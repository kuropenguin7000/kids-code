import { formatRupiah, type PlanId } from "./pricing";

export type InvoiceLocale = "en" | "id";

export type InvoiceInput = {
  locale: InvoiceLocale;
  invoiceNumber: string;
  name: string | null;
  email: string;
  plan: PlanId;
  amount: number;
  purchasedAt: Date;
  /** Pass expiry; ignored for lifetime. */
  validUntil: Date;
};

const COPY = {
  en: {
    heading: "Invoice",
    hi: (name: string) => `Hi ${name},`,
    thanks:
      "Thank you for your purchase! Here are the details of your KidsCode pass.",
    invoiceNo: "Invoice number",
    date: "Date",
    billedTo: "Billed to",
    description: "Description",
    amount: "Amount",
    total: "Total",
    print: "🖨️ Save as PDF / print",
    planName: {
      monthly: "30-Day Pass",
      yearly: "1-Year Pass",
      lifetime: "Lifetime Pass",
    } as Record<PlanId, string>,
    validUntil: (d: string) => `Your pass is active until <strong>${d}</strong>.`,
    lifetimeNote:
      "You now have <strong>lifetime access</strong> — every world, forever.",
    oneTime: "This is a one-time payment — no auto-renewal.",
    footer: "KidsCode — raising the next generation of programmers.",
    dateLocale: "en-GB",
  },
  id: {
    heading: "Faktur",
    hi: (name: string) => `Halo ${name},`,
    thanks:
      "Terima kasih atas pembelianmu! Berikut detail paket KidsCode kamu.",
    invoiceNo: "Nomor faktur",
    date: "Tanggal",
    billedTo: "Ditagihkan kepada",
    description: "Keterangan",
    amount: "Jumlah",
    total: "Total",
    print: "🖨️ Simpan PDF / cetak",
    planName: {
      monthly: "Paket 30 Hari",
      yearly: "Paket 1 Tahun",
      lifetime: "Paket Selamanya",
    } as Record<PlanId, string>,
    validUntil: (d: string) => `Paketmu aktif sampai <strong>${d}</strong>.`,
    lifetimeNote:
      "Kamu kini punya <strong>akses selamanya</strong> — semua dunia, selamanya.",
    oneTime: "Ini pembayaran sekali — tanpa perpanjangan otomatis.",
    footer: "KidsCode — membesarkan generasi programmer berikutnya.",
    dateLocale: "id-ID",
  },
} as const;

/**
 * A standalone, printable invoice document (full HTML page). Served by the
 * invoice download route; the visitor uses their browser's "Save as PDF" (a
 * print button is included). Table-based inline styles keep it self-contained.
 */
export function renderInvoiceHtml(input: InvoiceInput): string {
  const c = COPY[input.locale];
  const fmtDate = (d: Date) =>
    d.toLocaleDateString(c.dateLocale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  const name = input.name?.trim() || input.email.split("@")[0];
  const price = formatRupiah(input.amount);
  const line =
    input.plan === "lifetime"
      ? c.lifetimeNote
      : c.validUntil(fmtDate(input.validUntil));

  return `<!doctype html>
<html lang="${input.locale}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escape(input.invoiceNumber)}</title>
    <style>@media print { .no-print { display: none !important; } }</style>
  </head>
  <body style="margin:0;padding:24px;background:#fefbf3;font-family:Arial,Helvetica,sans-serif;color:#2d2a3e;">
    <div class="no-print" style="max-width:560px;margin:0 auto 16px;text-align:right;">
      <button onclick="window.print()" style="cursor:pointer;background:#7c3aed;color:#fff;border:0;font-weight:bold;padding:10px 20px;border-radius:9999px;">${c.print}</button>
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:2px solid #ede9fe;border-radius:16px;overflow:hidden;">
      <tr>
        <td style="background:#7c3aed;padding:20px 28px;">
          <span style="font-size:22px;font-weight:bold;color:#ffffff;">🚀 KidsCode</span>
          <span style="float:right;font-size:16px;color:#ede9fe;padding-top:4px;">${c.heading}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:28px;">
          <p style="margin:0 0 8px;font-size:16px;">${c.hi(escape(name))}</p>
          <p style="margin:0 0 20px;font-size:14px;color:#555;">${c.thanks}</p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:#555;margin-bottom:20px;">
            <tr>
              <td style="padding:2px 0;"><strong>${c.invoiceNo}:</strong> ${escape(input.invoiceNumber)}</td>
            </tr>
            <tr>
              <td style="padding:2px 0;"><strong>${c.date}:</strong> ${fmtDate(input.purchasedAt)}</td>
            </tr>
            <tr>
              <td style="padding:2px 0;"><strong>${c.billedTo}:</strong> ${escape(name)} &lt;${escape(input.email)}&gt;</td>
            </tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
            <tr>
              <th align="left" style="padding:10px 12px;background:#f5f3ff;border-radius:8px 0 0 0;color:#7c3aed;">${c.description}</th>
              <th align="right" style="padding:10px 12px;background:#f5f3ff;border-radius:0 8px 0 0;color:#7c3aed;">${c.amount}</th>
            </tr>
            <tr>
              <td style="padding:12px;border-bottom:1px solid #eee;">${escape(c.planName[input.plan])}</td>
              <td align="right" style="padding:12px;border-bottom:1px solid #eee;">${price}</td>
            </tr>
            <tr>
              <td style="padding:12px;font-weight:bold;">${c.total}</td>
              <td align="right" style="padding:12px;font-weight:bold;color:#7c3aed;font-size:16px;">${price}</td>
            </tr>
          </table>

          <p style="margin:20px 0 0;font-size:14px;">${line}</p>
          <p style="margin:8px 0 0;font-size:12px;color:#888;">${c.oneTime}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px;background:#f5f3ff;text-align:center;font-size:12px;color:#7c3aed;">
          ${c.footer}
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Minimal HTML escaping for user-supplied values in the template. */
function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
