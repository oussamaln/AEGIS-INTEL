import { asc, eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users,
  investigationRequests, attachments, payments, reports, adminNotes, clientUpdates, contactMessages, auditLogs,
  type InsertInvestigationRequest, type InvestigationRequest,
  type Attachment, type Payment, type Report, type AdminNote, type ClientUpdate, type ContactMessage, type AuditLog
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// OSINT Investigation Query Helpers

export async function createInvestigationRequest(data: Omit<InsertInvestigationRequest, "id" | "referenceCode" | "createdAt" | "updatedAt"> & { referenceCode: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [res] = await db.insert(investigationRequests).values(data);
  return res.insertId;
}

export async function getInvestigationRequestByRef(referenceCode: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [req] = await db.select().from(investigationRequests).where(eq(investigationRequests.referenceCode, referenceCode));
  return req;
}

export async function getInvestigationRequestById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [req] = await db.select().from(investigationRequests).where(eq(investigationRequests.id, id));
  return req;
}

export async function getAllInvestigationRequests() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(investigationRequests).orderBy(desc(investigationRequests.createdAt));
}

export async function updateInvestigationRequestStatus(id: number, status: any, price?: string, refundReason?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData: any = { status, updatedAt: new Date() };
  if (price !== undefined) updateData.price = price;
  if (refundReason !== undefined) updateData.refundReason = refundReason;
  await db.update(investigationRequests).set(updateData).where(eq(investigationRequests.id, id));
}

export async function createAttachment(data: { requestId: number; filename: string; storageKey: string; mimeType: string; size: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [res] = await db.insert(attachments).values(data);
  return res.insertId;
}

export async function getAttachmentsForRequest(requestId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(attachments).where(eq(attachments.requestId, requestId));
}

export async function getAttachmentById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [att] = await db.select().from(attachments).where(eq(attachments.id, id));
  return att;
}

export async function createPayment(data: { requestId: number; currency: string; amount: string; status?: string; transactionId?: string; paidAt?: Date }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [res] = await db.insert(payments).values(data);
  return res.insertId;
}

export async function getPaymentsForRequest(requestId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(payments).where(eq(payments.requestId, requestId));
}

export async function createReport(data: { requestId: number; filename: string; storageKey: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [res] = await db.insert(reports).values(data);
  return res.insertId;
}

export async function getReportsForRequest(requestId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(reports).where(eq(reports.requestId, requestId));
}

export async function getReportById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [rep] = await db.select().from(reports).where(eq(reports.id, id));
  return rep;
}

export async function createAdminNote(data: { requestId: number; adminUserId: number; content: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [res] = await db.insert(adminNotes).values(data);
  return res.insertId;
}

export async function getAdminNotesForRequest(requestId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(adminNotes).where(eq(adminNotes.requestId, requestId)).orderBy(desc(adminNotes.createdAt));
}

export async function createClientUpdate(data: { requestId: number; message: string; status?: string | null; adminUserId?: number | null }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [res] = await db.insert(clientUpdates).values(data);
  return res.insertId;
}

export async function getClientUpdatesForRequest(requestId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(clientUpdates).where(eq(clientUpdates.requestId, requestId)).orderBy(asc(clientUpdates.createdAt));
}

export async function createContactMessage(data: { name: string; email: string; subject: string; message: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [res] = await db.insert(contactMessages).values(data);
  return res.insertId;
}

export async function getAllContactMessages() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function getContactMessageById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
  return message;
}

export async function updateContactMessageStatus(id: number, status: "NEW" | "READ" | "REPLIED" | "ARCHIVED") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData: { status: "NEW" | "READ" | "REPLIED" | "ARCHIVED"; readAt?: Date; repliedAt?: Date } = { status };
  if (status === "READ") updateData.readAt = new Date();
  if (status === "REPLIED") updateData.repliedAt = new Date();
  await db.update(contactMessages).set(updateData).where(eq(contactMessages.id, id));
}

export async function createAuditLog(data: { adminUserId?: number; action: string; requestId?: number; metadata?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(auditLogs).values(data);
}

export async function getAllAuditLogs() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt));
}
