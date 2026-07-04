import type { L10n } from "./curriculum";

export const XP_PER_GAME = 10;

export type Rank = {
  xp: number;
  emoji: string;
  title: L10n;
};

/**
 * Player ranks, unlocked by XP (10 XP per completed game). The 10 ranks are
 * spread evenly across the whole curriculum: 20 worlds × 9 games × 10 XP =
 * 1800 XP, so 200 XP per rank and the top rank lands on the final game.
 */
export const ranks: Rank[] = [
  { xp: 0, emoji: "🥚", title: { en: "Curious Egg", id: "Telur Penasaran" } },
  { xp: 200, emoji: "🐣", title: { en: "Hatchling Coder", id: "Koder Menetas" } },
  { xp: 400, emoji: "🤖", title: { en: "Robot Rookie", id: "Robot Pemula" } },
  { xp: 600, emoji: "🧩", title: { en: "Pattern Pro", id: "Jagoan Pola" } },
  { xp: 800, emoji: "🔁", title: { en: "Loop Master", id: "Master Perulangan" } },
  { xp: 1000, emoji: "🚦", title: { en: "Rule Ranger", id: "Penjaga Aturan" } },
  { xp: 1200, emoji: "🐞", title: { en: "Bug Hunter", id: "Pemburu Bug" } },
  { xp: 1400, emoji: "📦", title: { en: "Memory Wizard", id: "Penyihir Ingatan" } },
  { xp: 1600, emoji: "🧱", title: { en: "Problem Breaker", id: "Pemecah Masalah" } },
  { xp: 1800, emoji: "👑", title: { en: "True Programmer", id: "Programmer Sejati" } },
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
