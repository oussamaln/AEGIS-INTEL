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

describe("OSINT Investigation MVP Router Tests", () => {
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

  it("restricts staff dashboard procedures to admin users", async () => {
    const publicCtx = createPublicContext();
    const publicCaller = appRouter.createCaller(publicCtx);

    await expect(publicCaller.osint.listRequests()).rejects.toThrow();

    const adminCtx = createAdminContext();
    const adminCaller = appRouter.createCaller(adminCtx);

    const requests = await adminCaller.osint.listRequests();
    expect(Array.isArray(requests)).toBe(true);
  });
});
