import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// OSINT Investigation MVP Tables

export const investigationRequests = mysqlTable("investigation_requests", {
  id: int("id").autoincrement().primaryKey(),
  referenceCode: varchar("referenceCode", { length: 32 }).notNull().unique(),
  contactMethod: varchar("contactMethod", { length: 32 }).notNull(),
  contactValue: varchar("contactValue", { length: 255 }).notNull(),
  targetPlatform: varchar("targetPlatform", { length: 64 }),
  targetUsername: varchar("targetUsername", { length: 128 }),
  targetUrl: text("targetUrl"),
  targetEmail: varchar("targetEmail", { length: 320 }),
  targetPhone: varchar("targetPhone", { length: 64 }),
  targetDomain: varchar("targetDomain", { length: 255 }),
  targetWallet: varchar("targetWallet", { length: 255 }),
  goal: text("goal").notNull(),
  additionalInfo: text("additionalInfo"),
  status: mysqlEnum("status", [
    "NEW",
    "REVIEWING",
    "WAITING_FOR_CLIENT",
    "PAYMENT_REQUIRED",
    "PAID",
    "INVESTIGATING",
    "COMPLETED",
    "REFUNDED",
    "CANCELLED"
  ]).default("NEW").notNull(),
  price: varchar("price", { length: 64 }),
  refundReason: text("refundReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const attachments = mysqlTable("attachments", {
  id: int("id").autoincrement().primaryKey(),
  requestId: int("requestId").notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  storageKey: varchar("storageKey", { length: 512 }).notNull(),
  mimeType: varchar("mimeType", { length: 128 }).notNull(),
  size: int("size").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  requestId: int("requestId").notNull(),
  currency: varchar("currency", { length: 32 }).notNull(),
  amount: varchar("amount", { length: 64 }).notNull(),
  status: varchar("status", { length: 32 }).default("PENDING").notNull(),
  transactionId: varchar("transactionId", { length: 255 }),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  requestId: int("requestId").notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  storageKey: varchar("storageKey", { length: 512 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const adminNotes = mysqlTable("admin_notes", {
  id: int("id").autoincrement().primaryKey(),
  requestId: int("requestId").notNull(),
  adminUserId: int("adminUserId").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/** Client-safe status entries and messages. Never store internal investigation notes here. */
export const clientUpdates = mysqlTable("client_updates", {
  id: int("id").autoincrement().primaryKey(),
  requestId: int("requestId").notNull(),
  adminUserId: int("adminUserId"),
  status: varchar("status", { length: 32 }),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/** Public website inquiries. Access is limited to staff administrators. */
export const contactMessages = mysqlTable("contact_messages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 180 }).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["NEW", "READ", "REPLIED", "ARCHIVED"]).default("NEW").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  readAt: timestamp("readAt"),
  repliedAt: timestamp("repliedAt"),
});

export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  adminUserId: int("adminUserId"),
  action: varchar("action", { length: 128 }).notNull(),
  requestId: int("requestId"),
  metadata: text("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type InvestigationRequest = typeof investigationRequests.$inferSelect;
export type InsertInvestigationRequest = typeof investigationRequests.$inferInsert;
export type Attachment = typeof attachments.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type AdminNote = typeof adminNotes.$inferSelect;
export type ClientUpdate = typeof clientUpdates.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
