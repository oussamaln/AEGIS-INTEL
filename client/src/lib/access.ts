export type DashboardIdentity = { role?: string | null } | null | undefined;

/**
 * Shared UI access gate for staff-only dashboard content.
 * Keep this separate from server-side role enforcement, which remains mandatory.
 */
export function isAdministrator(identity: DashboardIdentity): boolean {
  return identity?.role === "admin";
}
