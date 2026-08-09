import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { storagePut, storageGet, storageGetSignedUrl } from "./storage";
import { nanoid } from "nanoid";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Staff access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  osint: router({
    // Submit new investigation request (public)
    submitRequest: publicProcedure
      .input(z.object({
        contactMethod: z.string().min(1),
        contactValue: z.string().min(1),
        targetPlatform: z.string().optional(),
        targetUsername: z.string().optional(),
        targetUrl: z.string().optional(),
        targetEmail: z.string().optional(),
        targetPhone: z.string().optional(),
        targetDomain: z.string().optional(),
        targetWallet: z.string().optional(),
        goal: z.string().min(10, "Investigation goal must be at least 10 characters"),
        additionalInfo: z.string().optional(),
        consent: z.boolean().refine(val => val === true, "Consent is required"),
        attachments: z.array(z.object({
          filename: z.string(),
          storageKey: z.string(),
          mimeType: z.string(),
          size: z.number(),
        })).optional(),
      }))
      .mutation(async ({ input }) => {
        const referenceCode = "OSINT-" + nanoid(8).toUpperCase();
        const requestId = await db.createInvestigationRequest({
          referenceCode,
          contactMethod: input.contactMethod,
          contactValue: input.contactValue,
          targetPlatform: input.targetPlatform || null,
          targetUsername: input.targetUsername || null,
          targetUrl: input.targetUrl || null,
          targetEmail: input.targetEmail || null,
          targetPhone: input.targetPhone || null,
          targetDomain: input.targetDomain || null,
          targetWallet: input.targetWallet || null,
          goal: input.goal,
          additionalInfo: input.additionalInfo || null,
          status: "NEW",
        });

        if (input.attachments && input.attachments.length > 0) {
          for (const att of input.attachments) {
            await db.createAttachment({
              requestId,
              filename: att.filename,
              storageKey: att.storageKey,
              mimeType: att.mimeType,
              size: att.size,
            });
          }
        }

        await db.createAuditLog({
          action: "SUBMIT_REQUEST",
          requestId,
          metadata: JSON.stringify({ referenceCode, contactMethod: input.contactMethod }),
        });

        return { success: true, referenceCode, requestId };
      }),

    // Get request status by reference code (public check)
    getRequestByRef: publicProcedure
      .input(z.object({ referenceCode: z.string() }))
      .query(async ({ input }) => {
        const req = await db.getInvestigationRequestByRef(input.referenceCode);
        if (!req) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Investigation request not found" });
        }
        // Return safe public fields
        return {
          referenceCode: req.referenceCode,
          status: req.status,
          createdAt: req.createdAt,
          targetPlatform: req.targetPlatform,
          goal: req.goal,
        };
      }),

    // Staff dashboard list all requests
    listRequests: adminProcedure.query(async () => {
      return await db.getAllInvestigationRequests();
    }),

    // Staff get single request detail with all relations
    getRequestDetail: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const req = await db.getInvestigationRequestById(input.id);
        if (!req) throw new TRPCError({ code: "NOT_FOUND" });
        const atts = await db.getAttachmentsForRequest(input.id);
        const pays = await db.getPaymentsForRequest(input.id);
        const reps = await db.getReportsForRequest(input.id);
        const notes = await db.getAdminNotesForRequest(input.id);
        return { request: req, attachments: atts, payments: pays, reports: reps, notes };
      }),

    // Update case status, price, or refund
    updateStatus: adminProcedure
      .input(z.object({
        requestId: z.number(),
        status: z.enum([
          "NEW", "REVIEWING", "WAITING_FOR_CLIENT", "PAYMENT_REQUIRED",
          "PAID", "INVESTIGATING", "COMPLETED", "REFUNDED", "CANCELLED"
        ]),
        price: z.string().optional(),
        refundReason: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateInvestigationRequestStatus(input.requestId, input.status, input.price, input.refundReason);
        await db.createAuditLog({
          adminUserId: ctx.user.id,
          action: "UPDATE_STATUS",
          requestId: input.requestId,
          metadata: JSON.stringify({ status: input.status, price: input.price, refundReason: input.refundReason }),
        });
        return { success: true };
      }),

    // Add private admin note
    addNote: adminProcedure
      .input(z.object({
        requestId: z.number(),
        content: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createAdminNote({
          requestId: input.requestId,
          adminUserId: ctx.user.id,
          content: input.content,
        });
        await db.createAuditLog({
          adminUserId: ctx.user.id,
          action: "ADD_NOTE",
          requestId: input.requestId,
        });
        return { success: true };
      }),

    // Record manual cryptocurrency payment
    recordPayment: adminProcedure
      .input(z.object({
        requestId: z.number(),
        currency: z.string().min(1),
        amount: z.string().min(1),
        transactionId: z.string().min(1),
        paidAt: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createPayment({
          requestId: input.requestId,
          currency: input.currency,
          amount: input.amount,
          status: "CONFIRMED",
          transactionId: input.transactionId,
          paidAt: input.paidAt ? new Date(input.paidAt) : new Date(),
        });
        // Automatically set status to PAID if currently PAYMENT_REQUIRED
        const req = await db.getInvestigationRequestById(input.requestId);
        if (req && req.status === "PAYMENT_REQUIRED") {
          await db.updateInvestigationRequestStatus(input.requestId, "PAID");
        }
        await db.createAuditLog({
          adminUserId: ctx.user.id,
          action: "RECORD_PAYMENT",
          requestId: input.requestId,
          metadata: JSON.stringify({ currency: input.currency, amount: input.amount, transactionId: input.transactionId }),
        });
        return { success: true };
      }),

    // Upload private report PDF
    uploadReport: adminProcedure
      .input(z.object({
        requestId: z.number(),
        filename: z.string(),
        storageKey: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createReport({
          requestId: input.requestId,
          filename: input.filename,
          storageKey: input.storageKey,
        });
        await db.updateInvestigationRequestStatus(input.requestId, "COMPLETED");
        await db.createAuditLog({
          adminUserId: ctx.user.id,
          action: "UPLOAD_REPORT_AND_COMPLETE",
          requestId: input.requestId,
          metadata: JSON.stringify({ filename: input.filename }),
        });
        return { success: true };
      }),

    // Get audit logs
    getAuditLogs: adminProcedure.query(async () => {
      return await db.getAllAuditLogs();
    }),

    // Get secure download URL for attachment or report (staff only)
    getSecureDownloadUrl: adminProcedure
      .input(z.object({ type: z.enum(["attachment", "report"]), id: z.number() }))
      .query(async ({ input }) => {
        let storageKey = "";
        let filename = "";
        if (input.type === "attachment") {
          const att = await db.getAttachmentById(input.id);
          if (!att) throw new TRPCError({ code: "NOT_FOUND" });
          storageKey = att.storageKey;
          filename = att.filename;
        } else {
          const rep = await db.getReportById(input.id);
          if (!rep) throw new TRPCError({ code: "NOT_FOUND" });
          storageKey = rep.storageKey;
          filename = rep.filename;
        }
        const url = await storageGetSignedUrl(storageKey);
        return { url, filename };
      }),
  }),
});

export type AppRouter = typeof appRouter;
