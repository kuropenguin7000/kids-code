import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { isMasterEmail } from "@/lib/config";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ signedIn: false });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { subscription: true, progress: true },
  });
  if (!user) {
    return NextResponse.json({ signedIn: false });
  }

  // An expired subscription behaves exactly like a free account.
  const subscription = user.subscription;
  const active =
    subscription !== null && subscription.currentPeriodEnd > new Date();

  return NextResponse.json({
    signedIn: true,
    name: user.name,
    email: user.email,
    image: user.image,
    memberSince: user.createdAt,
    isMaster: isMasterEmail(user.email),
    plan: active ? subscription.plan : null,
    planExpires: active ? subscription.currentPeriodEnd : null,
    completed: user.progress.map((p) => p.gameId),
  });
}
