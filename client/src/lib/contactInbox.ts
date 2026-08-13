export const CONTACT_INBOX_FILTERS = ["ALL", "NEW", "READ", "REPLIED", "ARCHIVED"] as const;

export type ContactInboxFilter = (typeof CONTACT_INBOX_FILTERS)[number];
export type ContactMessageStatus = Exclude<ContactInboxFilter, "ALL">;

export type ContactInboxMessage = {
  status: ContactMessageStatus;
  name: string;
  email: string;
  subject: string;
  message: string;
};

/** Filters administrator-visible enquiries without sending any data to the public site. */
export function filterContactInboxMessages<T extends ContactInboxMessage>(
  messages: T[],
  keyword: string,
  statusFilter: ContactInboxFilter,
): T[] {
  const normalizedKeyword = keyword.trim().toLocaleLowerCase();

  return messages.filter((message) => {
    const matchesStatus = statusFilter === "ALL" || message.status === statusFilter;
    if (!matchesStatus) return false;
    if (!normalizedKeyword) return true;

    return [message.name, message.email, message.subject, message.message]
      .some((value) => value.toLocaleLowerCase().includes(normalizedKeyword));
  });
}
