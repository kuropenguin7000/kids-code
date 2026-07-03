import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { allGames } from "@/lib/curriculum";

const validIds = new Set(allGames.map((g) => g.id));

async function getUserId() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  return user?.id ?? null;
}

/** Record a single completed game. */
export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { gameId } = (await request.json()) as { gameId?: string };
  if (!gameId || !validIds.has(gameId)) {
    return NextResponse.json({ error: "unknown game" }, { status: 400 });
  }

  await prisma.gameProgress.upsert({
    where: { userId_gameId: { userId, gameId } },
    create: { userId, gameId },
    update: {},
  });
  return NextResponse.json({ ok: true });
}

/** Bulk-sync completions made before signing in (from localStorage). */
export async function PUT(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { gameIds } = (await request.json()) as { gameIds?: string[] };
  const ids = (gameIds ?? []).filter((id) => validIds.has(id));
  if (ids.length > 0) {
    await prisma.gameProgress.createMany({
      data: ids.map((gameId) => ({ userId, gameId })),
      skipDuplicates: true,
    });
  }
  return NextResponse.json({ ok: true, synced: ids.length });
}
