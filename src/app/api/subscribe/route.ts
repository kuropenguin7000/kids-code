import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { PLAN_AMOUNTS } from "@/lib/pricing";

/**
 * Prepaid access passes: one-time payments, no auto-renewal. "lifetime" is
 * modelled as a 100-year pass so every expiry-based access check just works.
 */
const PASS_DAYS = { monthly: 30, yearly: 365, lifetime: 36500 } as const;

function invoiceNumber(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `INV-${ymd}-${rand}`;
}

/**
 * Demo checkout: records the purchased pass directly and stores an invoice. In
 * production this must be replaced by a real payment flow (Midtrans/Xendit —
 * QRIS, e-wallets and virtual accounts are all one-time payments, which is
 * exactly what passes need) where the pass + invoice are only written after a
 * verified payment webhook.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { plan } = (await request.json()) as { plan?: string };
  if (plan !== "monthly" && plan !== "yearly" && plan !== "lifetime") {
    return NextResponse.json({ error: "invalid plan" }, { status: 400 });
  }

  // Buying while a pass is still active EXTENDS it: the new days are added
  // on top of the remaining ones, so renewing early never loses time.
  const existing = await prisma.subscription.findUnique({
    where: { userId: user.id },
    select: { plan: true, currentPeriodEnd: true },
  });
  const now = new Date();
  const active = existing !== null && existing.currentPeriodEnd > now;

  // An active lifetime pass already covers everything — never let a smaller
  // purchase overwrite its label or stack pointless days on top.
  if (active && existing.plan === "lifetime") {
    return NextResponse.json({
      ok: true,
      plan: "lifetime",
      currentPeriodEnd: existing.currentPeriodEnd,
    });
  }

  const base = active ? existing.currentPeriodEnd : now;
  const currentPeriodEnd = new Date(
    base.getTime() + PASS_DAYS[plan] * 24 * 60 * 60 * 1000
  );

  // The stored plan is a display label: with stacking it should describe how
  // much access the user now HOLDS, not the size of the last top-up (a
  // 30-day extend on a yearly pass must not demote the badge to "30-day").
  const remainingDays =
    (currentPeriodEnd.getTime() - now.getTime()) / (24 * 60 * 60 * 1000);
  const label =
    plan === "lifetime" ? "lifetime" : remainingDays > 30 ? "yearly" : "monthly";

  await prisma.subscription.upsert({
    where: { userId: user.id },
    create: { userId: user.id, plan: label, currentPeriodEnd },
    update: { plan: label, currentPeriodEnd },
  });

  // Persist a receipt for the account's purchase history. `plan` here is the
  // tier actually purchased (what was charged), not the stacked display label.
  const invoice = await prisma.invoice.create({
    data: {
      userId: user.id,
      number: invoiceNumber(),
      plan,
      amount: PLAN_AMOUNTS[plan],
      periodEnd: currentPeriodEnd,
    },
    select: {
      number: true,
      plan: true,
      amount: true,
      periodEnd: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ ok: true, plan: label, currentPeriodEnd, invoice });
}
