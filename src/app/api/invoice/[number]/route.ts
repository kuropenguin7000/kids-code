import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { isMasterEmail } from "@/lib/config";
import {
  renderInvoiceHtml,
  type InvoiceInput,
  type InvoiceLocale,
} from "@/lib/invoice";
import type { PlanId } from "@/lib/pricing";

/**
 * A single invoice as a standalone printable HTML page. The owner (or a master
 * account) can open it and use the browser's "Save as PDF". Language follows
 * the `?locale=` query param, defaulting to English.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ number: string }> }
) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { number } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { number },
    include: { user: { select: { name: true, email: true } } },
  });
  if (!invoice) {
    return new Response("Not found", { status: 404 });
  }
  // Only the invoice's owner (or a master account) may view it.
  if (invoice.user.email !== email && !isMasterEmail(email)) {
    return new Response("Forbidden", { status: 403 });
  }

  const locale: InvoiceLocale =
    new URL(request.url).searchParams.get("locale") === "id" ? "id" : "en";

  const input: InvoiceInput = {
    locale,
    invoiceNumber: invoice.number,
    name: invoice.user.name,
    email: invoice.user.email ?? "",
    plan: invoice.plan as PlanId,
    amount: invoice.amount,
    purchasedAt: invoice.createdAt,
    validUntil: invoice.periodEnd,
  };

  return new Response(renderInvoiceHtml(input), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
