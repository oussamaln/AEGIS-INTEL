import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const adminUser: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@aegis-intel.com",
    name: "Senior Investigator",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user: adminUser,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

function createStandardUserContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "standard-user",
      email: "user@example.com",
      name: "Standard User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

describe("OSINT Investigation MVP Router Tests", () => {
  it("does not fabricate an administrator for unauthenticated sessions", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(caller.auth.me()).resolves.toBeNull();
    await expect(caller.osint.listRequests()).rejects.toThrow();
  });

  it("keeps a signed-in standard user out of staff procedures", async () => {
    const caller = appRouter.createCaller(createStandardUserContext());

    await expect(caller.auth.me()).resolves.toMatchObject({ role: "user" });
    await expect(caller.osint.listRequests()).rejects.toThrow("Staff access required");
  });

  it("requires an administrator for every staff-only case operation", async () => {
    const caller = appRouter.createCaller(createStandardUserContext());
    const staffOperations = [
      () => caller.osint.listRequests(),
      () => caller.osint.getRequestDetail({ id: 1 }),
      () => caller.osint.updateStatus({ requestId: 1, status: "REVIEWING" }),
      () => caller.osint.addNote({ requestId: 1, content: "Internal note" }),
      () => caller.osint.addClientMessage({ requestId: 1, message: "Client-safe status update" }),
      () => caller.osint.recordPayment({
        requestId: 1,
        currency: "USDT",
        amount: "35",
        transactionId: "test-transaction",
      }),
      () => caller.osint.uploadReport({
        requestId: 1,
        filename: "report.pdf",
        storageKey: "reports/report.pdf",
      }),
      () => caller.osint.getAuditLogs(),
      () => caller.osint.getSecureDownloadUrl({ type: "attachment", id: 1 }),
      () => caller.contact.list(),
      () => caller.contact.updateStatus({ id: 1, status: "READ" }),
      () => caller.contact.updateStatus({ id: 1, status: "REPLIED" }),
    ];

    for (const operation of staffOperations) {
      await expect(operation()).rejects.toThrow("Staff access required");
    }
  });

  it("allows public submission of an investigation request and generates a reference code", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.osint.submitRequest({
      contactMethod: "Telegram",
      contactValue: "@test_client",
      targetPlatform: "Instagram",
      targetUsername: "test_target",
      goal: "Investigate suspicious profile activity and check network associations.",
      consent: true,
      attachments: [
        {
          filename: "evidence.png",
          storageKey: "attachments/evidence_123.png",
          mimeType: "image/png",
          size: 20480,
        }
      ],
    });

    expect(result.success).toBe(true);
    expect(result.referenceCode).toBeDefined();
    expect(result.referenceCode.startsWith("OSINT-")).toBe(true);
    expect(result.requestId).toBeGreaterThan(0);
  });

  it("persists a public contact message and restricts the inbox to administrators", async () => {
    const publicCaller = appRouter.createCaller(createPublicContext());
    const result = await publicCaller.contact.submit({
      name: "Contact Form Test",
      email: "contact-form-test@example.com",
      subject: "Secure contact test",
      message: "This verifies that the public contact form writes an inbox message.",
    });

    expect(result.success).toBe(true);
    expect(result.id).toBeGreaterThan(0);
    await expect(publicCaller.contact.list()).rejects.toThrow();

    const adminCaller = appRouter.createCaller(createAdminContext());
    const messages = await adminCaller.contact.list();
    expect(messages.some(message => message.id === result.id && message.email === "contact-form-test@example.com")).toBe(true);

    await expect(adminCaller.contact.updateStatus({ id: result.id, status: "REPLIED" })).resolves.toEqual({ success: true });
    const updatedMessages = await adminCaller.contact.list();
    const updatedMessage = updatedMessages.find(message => message.id === result.id);
    expect(updatedMessage?.status).toBe("REPLIED");
    expect(updatedMessage?.repliedAt).not.toBeNull();
  });

  it("rejects invalid public contact message fields on the server", async () => {
    const publicCaller = appRouter.createCaller(createPublicContext());

    await expect(publicCaller.contact.submit({
      name: "",
      email: "not-an-email",
      subject: "",
      message: "",
    })).rejects.toThrow();
  });

  it("shows only client-safe status updates through a normalized reference code", async () => {
    const publicCaller = appRouter.createCaller(createPublicContext());
    const submission = await publicCaller.osint.submitRequest({
      contactMethod: "Email",
      contactValue: "client@example.com",
      targetPlatform: "Telegram",
      targetUsername: "private-target",
      goal: "Check the public profile for evidence of impersonation.",
      additionalInfo: "Internal case context must not be returned by public tracking.",
      consent: true,
    });

    const tracking = await publicCaller.osint.getRequestByRef({
      referenceCode: submission.referenceCode.toLowerCase(),
    });

    expect(tracking.referenceCode).toBe(submission.referenceCode);
    expect(tracking.status).toBe("NEW");
    expect(tracking.updates).toHaveLength(1);
    expect(tracking.updates[0]?.message).toContain("waiting for staff review");
    expect(tracking).not.toHaveProperty("contactValue");
    expect(tracking).not.toHaveProperty("targetUsername");
    expect(tracking).not.toHaveProperty("goal");
    expect(tracking).not.toHaveProperty("additionalInfo");
  });

  it("lets an administrator publish a client-safe message that appears in public tracking", async () => {
    const publicCaller = appRouter.createCaller(createPublicContext());
    const submission = await publicCaller.osint.submitRequest({
      contactMethod: "Email",
      contactValue: "case-client@example.com",
      goal: "Verify the source of a suspected impersonation account.",
      consent: true,
    });
    const adminCaller = appRouter.createCaller(createAdminContext());
    await expect(adminCaller.osint.addClientMessage({
      requestId: submission.requestId,
      message: "We have started our initial scope review.",
    })).resolves.toEqual({ success: true });

    const tracking = await publicCaller.osint.getRequestByRef({ referenceCode: submission.referenceCode });
    expect(tracking.updates.map(update => update.message)).toContain("We have started our initial scope review.");
  });

  it("restricts staff dashboard procedures to admin users", async () => {
    const publicCtx = createPublicContext();
    const publicCaller = appRouter.createCaller(publicCtx);

    await expect(publicCaller.osint.listRequests()).rejects.toThrow();

    const adminCtx = createAdminContext();
    const adminCaller = appRouter.createCaller(adminCtx);

    const requests = await adminCaller.osint.listRequests();
    expect(Array.isArray(requests)).toBe(true);
  });

  it("rejects evidence uploads when the filename extension does not match its MIME type", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.osint.uploadFile({
        filename: "evidence/not-a-png.pdf",
        contentType: "image/png",
        base64Data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL0bAAAAABJRU5ErkJggg==",
      }),
    ).rejects.toThrow("filename extension does not match");
  });
});
