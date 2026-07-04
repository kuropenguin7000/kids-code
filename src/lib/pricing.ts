/**
 * Canonical pass prices in Rupiah. The pricing PAGE shows these same numbers
 * via messages/*.json (pricing.monthlyPrice, etc.) — keep the two in sync.
 * Server code (invoices) formats from these amounts.
 */
export const PLAN_AMOUNTS = {
  monthly: 49000,
  yearly: 399000,
  lifetime: 699000,
} as const;

export type PlanId = keyof typeof PLAN_AMOUNTS;

/** "49000" → "Rp 49.000" (Indonesian grouping, no decimals). */
export function formatRupiah(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}
