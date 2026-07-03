import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

/**
 * Demo checkout: records the chosen plan directly. In production this must
 * be replaced by a real payment flow (Midtrans/Xendit/Stripe) where the plan
 * is only stored after a verified payment webhook.
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
  if (plan !== "monthly" && plan !== "yearly") {
    return NextResponse.json({ error: "invalid plan" }, { status: 400 });
  }

  const currentPeriodEnd = new Date();
  if (plan === "monthly") {
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
  } else {
    currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
  }

  await prisma.subscription.upsert({
    where: { userId: user.id },
    create: { userId: user.id, plan, currentPeriodEnd },
    update: { plan, currentPeriodEnd },
  });
  return NextResponse.json({ ok: true, plan });
}
