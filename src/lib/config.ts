/**
 * Master accounts: signed-in emails that bypass sequential progression, so
 * every world and game is immediately playable. Intended for testing/demo —
 * regular players still unlock worlds one at a time. Matched case-insensitively
 * against the Firebase Auth email.
 */
export const MASTER_EMAILS = ["ctlvechocolatoz@gmail.com"];

export function isMasterEmail(email: string | null | undefined): boolean {
  return !!email && MASTER_EMAILS.includes(email.toLowerCase());
}
