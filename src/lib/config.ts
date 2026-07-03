/** Worlds playable for free (1..FREE_WORLDS); higher worlds need a subscription. */
export const FREE_WORLDS = 1;

/** Accounts with full access to every feature, regardless of subscription. */
export const MASTER_EMAILS = ["ctlvechocolatoz@gmail.com"];

export function isMasterEmail(email: string | null | undefined): boolean {
  return !!email && MASTER_EMAILS.includes(email.toLowerCase());
}
