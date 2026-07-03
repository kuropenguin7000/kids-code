"use client";

import { useMemo, useSyncExternalStore } from "react";

/**
 * Local progress tracking backed by localStorage.
 *
 * Storage is scoped per owner: anonymous visitors use the base key; signed-in
 * users get their own key (by email). This keeps accounts isolated on a
 * shared browser — one account's progress can never leak into another's.
 * Signed-in progress is additionally persisted in the database (see
 * useAccess); the anonymous store is synced to the account once at sign-in
 * and then cleared.
 */

// v3: invalidates progress recorded by pre-release test sessions
const BASE_KEY = "kidscode-progress-v3";

/** null/undefined owner = anonymous visitor. */
function storageKey(owner?: string | null) {
  return owner ? `${BASE_KEY}:${owner}` : BASE_KEY;
}

export type Progress = {
  /** Game ids the visitor has opened (used for "continue" labels). */
  started: string[];
  /** Game ids completed successfully. */
  completed: string[];
};

const EMPTY: Progress = { started: [], completed: [] };

// --- store plumbing (localStorage as an external store) ---

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function parseProgress(raw: string | null): Progress {
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw) as Progress;
    return {
      started: Array.isArray(parsed.started) ? parsed.started : [],
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
    };
  } catch {
    return EMPTY;
  }
}

function read(owner?: string | null): Progress {
  if (typeof window === "undefined") return EMPTY;
  return parseProgress(window.localStorage.getItem(storageKey(owner)));
}

function write(progress: Progress, owner?: string | null) {
  window.localStorage.setItem(storageKey(owner), JSON.stringify(progress));
  emitChange();
}

// --- reads/writes ---

export function getProgress(owner?: string | null): Progress {
  return read(owner);
}

export function markStarted(gameId: string, owner?: string | null) {
  const progress = read(owner);
  if (!progress.started.includes(gameId)) {
    write({ ...progress, started: [...progress.started, gameId] }, owner);
  }
}

export function markCompleted(gameId: string, owner?: string | null) {
  const progress = read(owner);
  if (!progress.completed.includes(gameId)) {
    write({ ...progress, completed: [...progress.completed, gameId] }, owner);
  }
}

/** Erase the stored progress for the given owner (default: anonymous). */
export function clearProgress(owner?: string | null) {
  window.localStorage.removeItem(storageKey(owner));
  emitChange();
}

// --- React hook ---

/**
 * Reactive snapshot of local progress for the given owner. `hydrated` is
 * false during SSR/first paint so components can avoid mismatched markup.
 */
export function useProgressStore(owner?: string | null) {
  const key = storageKey(owner);
  const rawProgress = useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(key),
    () => null
  );
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const progress = useMemo(() => parseProgress(rawProgress), [rawProgress]);

  return { progress, hydrated };
}
