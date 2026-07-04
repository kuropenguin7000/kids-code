import type { WorldDef } from "../types";

export const world: WorldDef = {
  id: "number-ninjas",
  emoji: "🥷",
  color: "#b91c1c",
  title: { en: "Number Ninjas", id: "Ninja Angka" },
  description: {
    en: "Master math like a ninja — add, subtract, compare and combine!",
    id: "Kuasai matematika seperti ninja — tambah, kurang, bandingkan, dan gabungkan!",
  },
  levels: [
    {
      id: "operators",
      emoji: "➕",
      color: "#b91c1c",
      title: { en: "Operators", id: "Operator" },
      description: {
        en: "Add, take away, and group — the ninja's basic moves.",
        id: "Tambah, kurang, dan kelompokkan — jurus dasar sang ninja.",
      },
      games: [
        {
          kind: "choice",
          id: "nn-add",
          emoji: "⭐",
          title: { en: "Add It Up", id: "Jumlahkan" },
          instructions: {
            en: "Add the two amounts together.",
            id: "Jumlahkan kedua jumlahnya.",
          },
          scenario: {
            en: "A ninja has 4 throwing stars and finds 3 more. How many stars now?",
            id: "Seorang ninja punya 4 bintang lempar dan menemukan 3 lagi. Berapa bintang sekarang?",
          },
          options: [
            { emoji: "7️⃣", text: { en: "7", id: "7" } },
            { emoji: "1️⃣", text: { en: "1", id: "1" } },
            { emoji: "🔟", text: { en: "43", id: "43" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "choice",
          id: "nn-subtract",
          emoji: "🍎",
          title: { en: "Take Away", id: "Kurangi" },
          instructions: {
            en: "Take the eaten apples away from the total.",
            id: "Kurangi apel yang dimakan dari totalnya.",
          },
          scenario: {
            en: "A ninja has 10 apples and eats 4. How many are left?",
            id: "Seorang ninja punya 10 apel dan memakan 4. Berapa sisanya?",
          },
          options: [
            { emoji: "6️⃣", text: { en: "6", id: "6" } },
            { emoji: "🔢", text: { en: "14", id: "14" } },
            { emoji: "4️⃣", text: { en: "4", id: "4" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "choice",
          id: "nn-groups",
          emoji: "🧺",
          title: { en: "Equal Groups", id: "Kelompok Sama" },
          instructions: {
            en: "Multiplying is just counting equal groups.",
            id: "Mengalikan hanyalah menghitung kelompok yang sama.",
          },
          scenario: {
            en: "There are 3 baskets, and each holds 4 eggs. How many eggs in total?",
            id: "Ada 3 keranjang, dan tiap keranjang berisi 4 telur. Berapa total telurnya?",
          },
          options: [
            { emoji: "🔢", text: { en: "12", id: "12" } },
            { emoji: "7️⃣", text: { en: "7", id: "7" } },
            { emoji: "3️⃣", text: { en: "34", id: "34" } },
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "comparisons",
      emoji: "⚖️",
      color: "#dc2626",
      title: { en: "Comparisons", id: "Perbandingan" },
      description: {
        en: "Which is more? Are they equal? Ninjas check before they leap.",
        id: "Mana lebih banyak? Apakah sama? Ninja memeriksa sebelum melompat.",
      },
      games: [
        {
          kind: "choice",
          id: "nn-more",
          emoji: "🔼",
          title: { en: "Bigger or Smaller", id: "Lebih atau Kurang" },
          instructions: {
            en: "Compare the two numbers.",
            id: "Bandingkan kedua angka.",
          },
          scenario: {
            en: "Which is more: 8 or 12?",
            id: "Mana lebih banyak: 8 atau 12?",
          },
          options: [
            { emoji: "🔢", text: { en: "12", id: "12" } },
            { emoji: "8️⃣", text: { en: "8", id: "8" } },
            { emoji: "🟰", text: { en: "They are the same", id: "Sama saja" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "choice",
          id: "nn-equal",
          emoji: "🟰",
          title: { en: "Are They Equal?", id: "Apakah Sama?" },
          instructions: {
            en: "Work out both sides, then compare.",
            id: "Hitung kedua sisi, lalu bandingkan.",
          },
          scenario: {
            en: "Ninja check: is 6 + 2 the same as 10 − 2?",
            id: "Cek ninja: apakah 6 + 2 sama dengan 10 − 2?",
          },
          options: [
            { emoji: "✅", text: { en: "Yes — both are 8", id: "Ya — keduanya 8" } },
            { emoji: "🔼", text: { en: "No — 6 + 2 is bigger", id: "Tidak — 6 + 2 lebih besar" } },
            { emoji: "🔽", text: { en: "No — 10 − 2 is bigger", id: "Tidak — 10 − 2 lebih besar" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "pattern",
          id: "nn-odd-ladder",
          emoji: "🪜",
          title: { en: "The Number Ladder", id: "Tangga Angka" },
          instructions: {
            en: "The ladder climbs by 2: 1, 3, 5, 7. What comes next?",
            id: "Tangganya naik 2: 1, 3, 5, 7. Apa berikutnya?",
          },
          sequence: ["1️⃣", "3️⃣", "5️⃣", "7️⃣"],
          options: ["8️⃣", "9️⃣", "🔟"],
          answer: "9️⃣",
        },
      ],
    },
    {
      id: "number-master",
      emoji: "🏯",
      color: "#991b1b",
      title: { en: "Number Master", id: "Master Angka" },
      description: {
        en: "Combine your moves — do the math in the right order to win.",
        id: "Gabungkan jurusmu — hitung dengan urutan yang tepat untuk menang.",
      },
      games: [
        {
          kind: "robot",
          id: "nn-exact-steps",
          emoji: "🎯",
          title: { en: "Exact Steps", id: "Langkah Tepat" },
          instructions: {
            en: "The star is 6 steps away. Use blocks that add up to exactly 6!",
            id: "Bintangnya 6 langkah jauhnya. Pakai balok yang jumlahnya tepat 6!",
          },
          cols: 7,
          rows: 3,
          start: { x: 0, y: 1 },
          goal: { x: 6, y: 1 },
          walls: [],
          palette: [
            { dx: 1, dy: 0, times: 3 },
            { dx: 1, dy: 0, times: 2 },
            { dx: 1, dy: 0, times: 1 },
            { dx: 0, dy: -1, times: 1 },
          ],
          maxBlocks: 2,
        },
        {
          kind: "choice",
          id: "nn-order-steps",
          emoji: "🧮",
          title: { en: "Step by Step", id: "Selangkah demi Selangkah" },
          instructions: {
            en: "Do the first step, then the next — one at a time.",
            id: "Lakukan langkah pertama, lalu berikutnya — satu per satu.",
          },
          scenario: {
            en: "A ninja does 2 + 3 first, then multiplies the result by 2. What is the final number?",
            id: "Ninja menghitung 2 + 3 dulu, lalu mengalikan hasilnya dengan 2. Berapa angka akhirnya?",
          },
          options: [
            { emoji: "🔟", text: { en: "10", id: "10" } },
            { emoji: "8️⃣", text: { en: "8", id: "8" } },
            { emoji: "🔢", text: { en: "12", id: "12" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "debug",
          id: "nn-math-mistake",
          emoji: "🐞",
          title: { en: "Math Mistake", id: "Salah Hitung" },
          instructions: {
            en: "The ninja adds 5 each time. One line is wrong — tap it!",
            id: "Ninja menambah 5 setiap kali. Satu baris salah — ketuk!",
          },
          steps: [
            { emoji: "➕", text: { en: "5 + 5 = 10", id: "5 + 5 = 10" } },
            { emoji: "➕", text: { en: "10 + 5 = 15", id: "10 + 5 = 15" } },
            { emoji: "➕", text: { en: "15 + 5 = 25", id: "15 + 5 = 25" } },
            { emoji: "🎯", text: { en: "Keep adding 5", id: "Terus tambah 5" } },
          ],
          wrongIndex: 2,
          fixOptions: [
            { emoji: "✅", text: { en: "15 + 5 = 20", id: "15 + 5 = 20" } },
            { emoji: "❌", text: { en: "15 + 5 = 30", id: "15 + 5 = 30" } },
            { emoji: "❓", text: { en: "15 + 5 = 10", id: "15 + 5 = 10" } },
          ],
          correctFixIndex: 0,
        },
      ],
    },
  ],
};
