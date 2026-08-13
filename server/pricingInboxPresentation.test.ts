import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const pricingSource = readFileSync(resolve(process.cwd(), "client/src/pages/Pricing.tsx"), "utf8");
const dashboardSource = readFileSync(resolve(process.cwd(), "client/src/pages/Dashboard.tsx"), "utf8");

describe("pricing and protected inbox presentation contracts", () => {
  it("renders the three required fixed prices and contains no price-range presentation", () => {
    expect(pricingSource).toContain('price: "$34.99"');
    expect(pricingSource).toContain('price: "$94.99"');
    expect(pricingSource).toContain('price: "$194.99"');
    expect(pricingSource).not.toContain("priceRange");
    expect(pricingSource).not.toContain("Range:");
  });

  it("keeps search, every status filter, and the reply workflow inside the administrator inbox", () => {
    expect(dashboardSource).toContain('aria-label="Search contact inbox"');
    expect(dashboardSource).toContain("CONTACT_INBOX_FILTERS.map");
    expect(dashboardSource).toContain("filterContactInboxMessages(messages ?? [], keyword, statusFilter)");
    expect(dashboardSource).toContain("Reply by Email");
    expect(dashboardSource).toContain("Mark Replied");
    expect(dashboardSource).toContain('status: "REPLIED"');
  });
});
