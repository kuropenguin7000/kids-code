import type { L10n } from "./curriculum";

export const XP_PER_GAME = 10;

export type Rank = {
  xp: number;
  emoji: string;
  title: L10n;
};

/**
 * Player ranks, unlocked by XP (10 XP per completed game). One rank per
 * finished world: 10 worlds × 9 games × 10 XP = 90 XP per rank.
 */
export const ranks: Rank[] = [
  { xp: 0, emoji: "🥚", title: { en: "Curious Egg", id: "Telur Penasaran" } },
  { xp: 90, emoji: "🐣", title: { en: "Hatchling Coder", id: "Koder Menetas" } },
  { xp: 180, emoji: "🤖", title: { en: "Robot Rookie", id: "Robot Pemula" } },
  { xp: 270, emoji: "🧩", title: { en: "Pattern Pro", id: "Jagoan Pola" } },
  { xp: 360, emoji: "🔁", title: { en: "Loop Master", id: "Master Perulangan" } },
  { xp: 450, emoji: "🚦", title: { en: "Rule Ranger", id: "Penjaga Aturan" } },
  { xp: 540, emoji: "🐞", title: { en: "Bug Hunter", id: "Pemburu Bug" } },
  { xp: 630, emoji: "📦", title: { en: "Memory Wizard", id: "Penyihir Ingatan" } },
  { xp: 720, emoji: "🧱", title: { en: "Problem Breaker", id: "Pemecah Masalah" } },
  { xp: 810, emoji: "👑", title: { en: "True Programmer", id: "Programmer Sejati" } },
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
