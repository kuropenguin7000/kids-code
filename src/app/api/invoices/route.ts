import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

/** The signed-in account's purchase history (newest first). */
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ invoices: [] });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) {
    return NextResponse.json({ invoices: [] });
  }

  const invoices = await prisma.invoice.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      number: true,
      plan: true,
      amount: true,
      periodEnd: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ invoices });
}
