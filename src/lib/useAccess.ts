"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { FREE_WORLDS } from "./config";
import { findGame, isWorldCompleted, worlds, type World } from "./curriculum";
import {
  clearProgress,
  getProgress,
  markCompleted as markCompletedLocally,
  markStarted as markStartedLocally,
  useProgressStore,
} from "./progress";

export type ServerMe = {
  signedIn: boolean;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  memberSince?: string;
  isMaster?: boolean;
  plan?: "monthly" | "yearly" | null;
  planExpires?: string | null;
  completed?: string[];
};

/**
 * Single source of truth for access + progress on the client.
 * Anonymous visitors: localStorage only. Signed-in users: a per-account
 * localStorage store merged with the database (via /api/me). Progress made
 * BEFORE signing in (the anonymous store) is synced to the account once at
 * sign-in and then cleared, so it can never leak into a different account
 * that signs in later on the same browser.
 */
export function useAccess() {
  const { data: session, status } = useSession();
  const signedIn = status === "authenticated";
  // Scopes localStorage per account; anonymous visitors share the base key.
  const owner = signedIn ? (session?.user?.email ?? null) : null;
  const local = useProgressStore(owner);
  const [me, setMe] = useState<ServerMe | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/me");
    setMe((await res.json()) as ServerMe);
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;
    (async () => {
      try {
        // Adopt progress made before signing in: push the anonymous store to
        // this account, then clear it so a later sign-in by a DIFFERENT
        // account on this browser doesn't inherit it.
        const offline = getProgress(null).completed;
        if (offline.length > 0) {
          const res = await fetch("/api/progress", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameIds: offline }),
          });
          if (res.ok) clearProgress(null);
        }
        const res = await fetch("/api/me");
        const data = (await res.json()) as ServerMe;
        if (!cancelled) setMe(data);
      } catch {
        if (!cancelled) setMe({ signedIn: false });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status]);

  const server = status === "authenticated" ? me : null;
  const isMaster = server?.isMaster ?? false;
  const plan = server?.plan ?? null;
  const planExpires = server?.planExpires ?? null;
  const subscribed = isMaster || plan !== null;

  const completed = useMemo(() => {
    const merged = new Set(local.progress.completed);
    for (const id of server?.completed ?? []) merged.add(id);
    return merged;
  }, [local.progress.completed, server?.completed]);

  const hydrated =
    local.hydrated &&
    status !== "loading" &&
    (status !== "authenticated" || me !== null);

  /**
   * Why a world can't be entered yet:
   * - "premium": beyond the free worlds and not subscribed → pricing page.
   * - "progress": the previous world isn't finished yet (applies to everyone
   *   except master accounts — it's pacing, not a paywall).
   */
  const worldLockReason = useCallback(
    (world: World): "premium" | "progress" | null => {
      if (isMaster) return null;
      if (!subscribed && world.number > FREE_WORLDS) return "premium";
      const previous = worlds.find((w) => w.number === world.number - 1);
      if (previous && !isWorldCompleted(previous, completed)) {
        return "progress";
      }
      return null;
    },
    [isMaster, subscribed, completed]
  );

  const gameLockReason = useCallback(
    (gameId: string): "premium" | "progress" | null => {
      const found = findGame(gameId);
      if (!found) return "progress";
      return worldLockReason(found.world);
    },
    [worldLockReason]
  );

  const canPlay = useCallback(
    (gameId: string) => gameLockReason(gameId) === null,
    [gameLockReason]
  );

  const markStarted = useCallback(
    (gameId: string) => markStartedLocally(gameId, owner),
    [owner]
  );

  const markDone = useCallback(
    (gameId: string) => {
      // Written to the account-scoped store (instant UI feedback) and, when
      // signed in, persisted to the database as the source of truth.
      markCompletedLocally(gameId, owner);
      if (signedIn) {
        fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId }),
        }).catch(() => {
          // the account-scoped local copy keeps the UI consistent meanwhile
        });
      }
    },
    [signedIn, owner]
  );

  return {
    hydrated,
    signedIn,
    isMaster,
    plan,
    planExpires,
    subscribed,
    completed,
    started: local.progress.started,
    canPlay,
    gameLockReason,
    worldLockReason,
    markStarted,
    markDone,
    refresh,
    me: server,
  };
}
