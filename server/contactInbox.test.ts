import { describe, expect, it } from "vitest";
import { filterContactInboxMessages } from "../client/src/lib/contactInbox";

const messages = [
  {
    status: "NEW" as const,
    name: "Amira Khan",
    email: "amira@example.com",
    subject: "Impersonation inquiry",
    message: "Please investigate a profile impersonating me on Telegram.",
  },
  {
    status: "REPLIED" as const,
    name: "Youssef Ali",
    email: "youssef@example.com",
    subject: "Fraud research",
    message: "I need an update about a wallet address and suspicious site.",
  },
  {
    status: "ARCHIVED" as const,
    name: "Marta Silva",
    email: "marta@example.com",
    subject: "Completed enquiry",
    message: "Thank you for your earlier help.",
  },
];

describe("contact inbox filters", () => {
  it("matches administrator keyword searches across every enquiry field", () => {
    expect(filterContactInboxMessages(messages, "telegram", "ALL")).toEqual([messages[0]]);
    expect(filterContactInboxMessages(messages, "youssef@example.com", "ALL")).toEqual([messages[1]]);
  });

  it("combines a status filter with keyword filtering", () => {
    expect(filterContactInboxMessages(messages, "", "NEW")).toEqual([messages[0]]);
    expect(filterContactInboxMessages(messages, "", "REPLIED")).toEqual([messages[1]]);
    expect(filterContactInboxMessages(messages, "", "ARCHIVED")).toEqual([messages[2]]);
    expect(filterContactInboxMessages(messages, "wallet", "REPLIED")).toEqual([messages[1]]);
    expect(filterContactInboxMessages(messages, "wallet", "NEW")).toEqual([]);
  });
});
