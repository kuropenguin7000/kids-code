"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { findGame, isWorldCompleted, worlds, type World } from "./curriculum";
import { addCompleted, fetchCompleted, mergeCompleted } from "./cloudProgress";
import {
  clearProgress,
  getProgress,
  markCompleted as markCompletedLocally,
  markStarted as markStartedLocally,
  useProgressStore,
} from "./progress";

// Last-fetched cloud completions, kept at module scope so pages render with the
// known state immediately across client-side navigations (no flash) while a
// background refetch keeps it fresh.
let cloudCache: string[] | null = null;

/**
 * Single source of truth for access + progress on the client.
 *
 * Anonymous visitors: localStorage only. Signed-in users (Firebase Auth): a
 * per-account localStorage store merged with Cloud Firestore (`users/{uid}`).
 * Progress made BEFORE signing in (the anonymous store) is merged into the
 * account once at sign-in and then cleared, so it can never leak into a
 * different account that signs in later on the same browser.
 *
 * With pricing removed, every world is available to everyone — the only gate
 * left is sequential progression ("finish the previous world to open the next").
 */
export function useAccess() {
  const { user, loading, enabled, signInWithGoogle, signOut } = useAuth();
  const signedIn = user !== null;
  // Scopes localStorage per account; anonymous visitors share the base key.
  const owner = signedIn ? user.uid : null;
  const local = useProgressStore(owner);
  const [cloud, setCloud] = useState<string[] | null>(cloudCache);

  const refresh = useCallback(async () => {
    if (!user) return;
    const ids = await fetchCompleted(user.uid);
    cloudCache = ids;
    setCloud(ids);
  }, [user]);

  useEffect(() => {
    if (!user) {
      cloudCache = null;
      setCloud(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        // Adopt progress made before signing in: merge the anonymous store into
        // this account, then clear it so a later sign-in by a DIFFERENT account
        // on this browser doesn't inherit it.
        const offline = getProgress(null).completed;
        if (offline.length > 0) {
          await mergeCompleted(user.uid, offline);
          clearProgress(null);
        }
        const ids = await fetchCompleted(user.uid);
        cloudCache = ids;
        if (!cancelled) setCloud(ids);
      } catch {
        if (!cancelled) setCloud([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const completed = useMemo(() => {
    const merged = new Set(local.progress.completed);
    for (const id of cloud ?? []) merged.add(id);
    return merged;
  }, [local.progress.completed, cloud]);

  const hydrated = local.hydrated && !loading && (!signedIn || cloud !== null);

  /**
   * Why a world can't be entered yet: the previous world isn't finished
   * ("progress" — gentle pacing that makes it a learning path, applies to
   * everyone). There is no paywall anymore.
   */
  const worldLockReason = useCallback(
    (world: World): "progress" | null => {
      const previous = worlds.find((w) => w.number === world.number - 1);
      if (previous && !isWorldCompleted(previous, completed)) {
        return "progress";
      }
      return null;
    },
    [completed]
  );

  const gameLockReason = useCallback(
    (gameId: string): "progress" | null => {
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
      // signed in, persisted to Firestore as the source of truth.
      markCompletedLocally(gameId, owner);
      if (user) {
        addCompleted(user.uid, gameId).catch(() => {
          // the account-scoped local copy keeps the UI consistent meanwhile
        });
      }
    },
    [user, owner]
  );

  return {
    hydrated,
    signedIn,
    authEnabled: enabled,
    user,
    completed,
    started: local.progress.started,
    canPlay,
    gameLockReason,
    worldLockReason,
    markStarted,
    markDone,
    refresh,
    signInWithGoogle,
    signOut,
  };
}
