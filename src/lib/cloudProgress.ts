import { arrayUnion, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Per-user progress stored in Firestore: one document `users/{uid}` holding
 * the list of completed game ids. This is the source of truth for signed-in
 * players (localStorage is kept in sync for instant UI + offline). All access
 * is client-side and guarded by security rules (a user may only touch their
 * own doc — see firestore.rules).
 */

type UserDoc = { completed?: string[] };

/** Read the completed game ids for a user (empty array if none/absent). */
export async function fetchCompleted(uid: string): Promise<string[]> {
  if (!db) return [];
  const snap = await getDoc(doc(db, "users", uid));
  const data = snap.data() as UserDoc | undefined;
  return data?.completed ?? [];
}

/** Add a single completed game id (idempotent via arrayUnion). */
export async function addCompleted(uid: string, gameId: string): Promise<void> {
  if (!db) return;
  await setDoc(
    doc(db, "users", uid),
    { completed: arrayUnion(gameId) },
    { merge: true }
  );
}

/** Merge a batch of completed ids (used to adopt anonymous progress at sign-in). */
export async function mergeCompleted(
  uid: string,
  gameIds: string[]
): Promise<void> {
  if (!db || gameIds.length === 0) return;
  await setDoc(
    doc(db, "users", uid),
    { completed: arrayUnion(...gameIds) },
    { merge: true }
  );
}
