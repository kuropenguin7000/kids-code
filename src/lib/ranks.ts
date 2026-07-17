import type { L10n } from "./curriculum";

export const XP_PER_GAME = 10;

export type Rank = {
  xp: number;
  emoji: string;
  title: L10n;
};

/**
 * Player ranks, unlocked by XP (10 XP per completed game). Ranks are spread
 * evenly across the whole curriculum so the top rank lands on the final game:
 * currently 15 games × 10 XP = 150 XP, so 30 XP per rank. Rescale when the
 * game count changes.
 */
export const ranks: Rank[] = [
  { xp: 0, emoji: "🥚", title: { en: "Curious Egg", id: "Telur Penasaran" } },
  { xp: 30, emoji: "🐣", title: { en: "Hatchling Coder", id: "Koder Menetas" } },
  { xp: 60, emoji: "🤖", title: { en: "Robot Rookie", id: "Robot Pemula" } },
  { xp: 90, emoji: "🧩", title: { en: "Pattern Pro", id: "Jagoan Pola" } },
  { xp: 120, emoji: "🧠", title: { en: "Memory Wizard", id: "Penyihir Ingatan" } },
  { xp: 150, emoji: "👑", title: { en: "True Programmer", id: "Programmer Sejati" } },
];

export function rankForXp(xp: number): { current: Rank; next: Rank | null } {
  let current = ranks[0];
  let next: Rank | null = null;
  for (const rank of ranks) {
    if (xp >= rank.xp) {
      current = rank;
    } else {
      next = rank;
      break;
    }
  }
  return { current, next };
}
