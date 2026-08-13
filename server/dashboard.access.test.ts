import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DashboardAdminApprovalRequired } from "../client/src/pages/Dashboard";
import { isAdministrator } from "../client/src/lib/access";

describe("dashboard UI access gate", () => {
  it("allows only accounts with the administrator role to render staff content", () => {
    expect(isAdministrator({ role: "admin" })).toBe(true);
    expect(isAdministrator({ role: "user" })).toBe(false);
    expect(isAdministrator(null)).toBe(false);
  });

  it("renders an approval-required screen without the Contact Inbox for a signed-in non-admin", () => {
    const html = renderToStaticMarkup(
      createElement(DashboardAdminApprovalRequired, {
        user: { email: "member@example.com" },
        onLogout: () => undefined,
      }),
    );

    expect(html).toContain("Administrator Approval Required");
    expect(html).toContain("member@example.com");
    expect(html).not.toContain("Contact Inbox");
  });
});
