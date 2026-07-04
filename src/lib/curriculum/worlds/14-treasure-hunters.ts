import type { WorldDef } from "../types";

export const world: WorldDef = {
  id: "treasure-hunters",
  emoji: "🗺️",
  color: "#65a30d",
  title: { en: "Treasure Hunters", id: "Pemburu Harta" },
  description: {
    en: "Find treasure fast! Learn clever ways to search and pick the best path.",
    id: "Temukan harta dengan cepat! Pelajari cara cerdas mencari dan memilih jalur terbaik.",
  },
  levels: [
    {
      id: "searching-smart",
      emoji: "🔍",
      color: "#65a30d",
      title: { en: "Searching Smart", id: "Mencari dengan Cerdas" },
      description: {
        en: "Don't check everything one by one — split the search in half each time!",
        id: "Jangan cek satu per satu — belah pencarian jadi separuh setiap kali!",
      },
      games: [
        {
          kind: "choice",
          id: "th-higher-lower",
          emoji: "🔢",
          title: { en: "Higher or Lower", id: "Lebih atau Kurang" },
          instructions: {
            en: "Guess the middle of what's left — that's the smart move.",
            id: "Tebak bagian tengah dari sisanya — itu langkah cerdas.",
          },
          scenario: {
            en: "Robo hunts a number from 1 to 10. He guesses 5 — you say \"higher!\". Which number is the smart NEXT guess?",
            id: "Robo mencari angka 1 sampai 10. Ia menebak 5 — kamu bilang \"lebih tinggi!\". Tebakan CERDAS berikutnya angka berapa?",
          },
          options: [
            { emoji: "8️⃣", text: { en: "8 (middle of 6–10)", id: "8 (tengah dari 6–10)" } },
            { emoji: "6️⃣", text: { en: "6 (just next door)", id: "6 (tetangga sebelah)" } },
            { emoji: "🔟", text: { en: "10 (all the way up)", id: "10 (paling atas)" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "choice",
          id: "th-split-search",
          emoji: "📖",
          title: { en: "Split the Search", id: "Belah Pencarian" },
          instructions: {
            en: "Which way finds the word fastest?",
            id: "Cara mana yang menemukan kata paling cepat?",
          },
          scenario: {
            en: "To find a word in a dictionary, the fast way is...",
            id: "Untuk menemukan kata di kamus, cara cepatnya adalah...",
          },
          options: [
            { emoji: "✂️", text: { en: "Open to the middle and split it", id: "Buka ke tengah lalu belah" } },
            { emoji: "🐌", text: { en: "Read every page from page 1", id: "Baca tiap halaman dari halaman 1" } },
            { emoji: "🎲", text: { en: "Open random pages and hope", id: "Buka halaman acak dan berharap" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "order",
          id: "th-guess-steps",
          emoji: "🎯",
          title: { en: "The Guessing Game", id: "Permainan Tebak" },
          instructions: {
            en: "Put the smart-search steps in order!",
            id: "Susun langkah pencarian cerdas!",
          },
          items: [
            { emoji: "🎯", text: { en: "Guess the middle", id: "Tebak bagian tengah" } },
            { emoji: "⚖️", text: { en: "Compare: higher or lower?", id: "Bandingkan: lebih atau kurang?" } },
            { emoji: "✂️", text: { en: "Throw away the wrong half", id: "Buang separuh yang salah" } },
            { emoji: "🔁", text: { en: "Repeat until found", id: "Ulangi sampai ketemu" } },
          ],
        },
      ],
    },
    {
      id: "best-path",
      emoji: "🧭",
      color: "#4d7c0f",
      title: { en: "Best Path", id: "Jalur Terbaik" },
      description: {
        en: "Many paths reach the treasure — a smart hunter takes the shortest.",
        id: "Banyak jalur menuju harta — pemburu cerdas memilih yang terpendek.",
      },
      games: [
        {
          kind: "robot",
          id: "th-shortest",
          emoji: "🏴‍☠️",
          title: { en: "Shortest Route", id: "Rute Terpendek" },
          instructions: {
            en: "Reach the treasure in just 2 blocks — around the rocks!",
            id: "Capai harta hanya dengan 2 balok — memutari bebatuan!",
          },
          cols: 4,
          rows: 4,
          start: { x: 0, y: 0 },
          goal: { x: 3, y: 3 },
          walls: [
            { x: 1, y: 1 },
            { x: 2, y: 2 },
          ],
          palette: [
            { dx: 1, dy: 0, times: 1 },
            { dx: 0, dy: 1, times: 1 },
            { dx: 1, dy: 0, times: 3 },
            { dx: 0, dy: 1, times: 3 },
          ],
          maxBlocks: 2,
        },
        {
          kind: "choice",
          id: "th-fewest",
          emoji: "👣",
          title: { en: "Fewest Steps", id: "Langkah Tersedikit" },
          instructions: {
            en: "Shorter paths save time. Which one wins?",
            id: "Jalur lebih pendek menghemat waktu. Mana yang menang?",
          },
          scenario: {
            en: "Two paths reach the treasure: one is 10 steps, one is 6 steps. A smart hunter picks...",
            id: "Dua jalur menuju harta: satu 10 langkah, satu 6 langkah. Pemburu cerdas memilih...",
          },
          options: [
            { emoji: "6️⃣", text: { en: "The 6-step path", id: "Jalur 6 langkah" } },
            { emoji: "🔟", text: { en: "The 10-step path", id: "Jalur 10 langkah" } },
            { emoji: "🚫", text: { en: "Neither path", id: "Tidak keduanya" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "debug",
          id: "th-wasteful",
          emoji: "🔙",
          title: { en: "Wasteful Route", id: "Rute Boros" },
          instructions: {
            en: "The treasure is 3 steps right, but one step wastes time. Tap it!",
            id: "Harta 3 langkah ke kanan, tapi satu langkah buang waktu. Ketuk!",
          },
          steps: [
            { emoji: "➡️", text: { en: "Step right", id: "Melangkah kanan" } },
            { emoji: "⬅️", text: { en: "Step left", id: "Melangkah kiri" } },
            { emoji: "➡️", text: { en: "Step right", id: "Melangkah kanan" } },
            { emoji: "➡️", text: { en: "Step right", id: "Melangkah kanan" } },
          ],
          wrongIndex: 1,
          fixOptions: [
            { emoji: "➡️", text: { en: "Step right", id: "Melangkah kanan" } },
            { emoji: "⬆️", text: { en: "Step up", id: "Melangkah atas" } },
            { emoji: "💤", text: { en: "Take a rest", id: "Beristirahat" } },
          ],
          correctFixIndex: 0,
        },
      ],
    },
    {
      id: "clue-strategy",
      emoji: "📜",
      color: "#3f6212",
      title: { en: "Follow the Clues", id: "Ikuti Petunjuk" },
      description: {
        en: "Read the clues, make the right choices, and the treasure is yours!",
        id: "Baca petunjuk, buat pilihan yang tepat, dan harta jadi milikmu!",
      },
      games: [
        {
          kind: "choice",
          id: "th-which-door",
          emoji: "🚪",
          title: { en: "Which Door?", id: "Pintu yang Mana?" },
          instructions: {
            en: "The clue has TWO parts — both must match.",
            id: "Petunjuknya punya DUA bagian — keduanya harus cocok.",
          },
          scenario: {
            en: "Clue: the treasure is behind a RED door on the LEFT. You see: left-red, left-blue, right-red. Which door?",
            id: "Petunjuk: harta di balik pintu MERAH di sebelah KIRI. Kamu lihat: kiri-merah, kiri-biru, kanan-merah. Pintu mana?",
          },
          options: [
            { emoji: "🟥", text: { en: "Left-red door", id: "Pintu kiri-merah" } },
            { emoji: "🟦", text: { en: "Left-blue door", id: "Pintu kiri-biru" } },
            { emoji: "🔴", text: { en: "Right-red door", id: "Pintu kanan-merah" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "choice",
          id: "th-if-clue",
          emoji: "☀️",
          title: { en: "Sun or Shade", id: "Terang atau Teduh" },
          instructions: {
            en: "Follow the IF-THEN clue with today's weather.",
            id: "Ikuti petunjuk JIKA-MAKA dengan cuaca hari ini.",
          },
          scenario: {
            en: "The map says: IF the sun is up, go east, ELSE go west. The sun is up. Which way?",
            id: "Peta berkata: JIKA matahari terbit, ke timur, SELAIN ITU ke barat. Matahari terbit. Ke arah mana?",
          },
          options: [
            { emoji: "➡️", text: { en: "Go east", id: "Ke timur" } },
            { emoji: "⬅️", text: { en: "Go west", id: "Ke barat" } },
            { emoji: "🧍", text: { en: "Stay put", id: "Diam saja" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "order",
          id: "th-treasure-plan",
          emoji: "💰",
          title: { en: "The Treasure Plan", id: "Rencana Harta" },
          instructions: {
            en: "Put the whole treasure-hunt plan in order!",
            id: "Susun seluruh rencana berburu harta!",
          },
          items: [
            { emoji: "📜", text: { en: "Read the clue", id: "Baca petunjuk" } },
            { emoji: "🧭", text: { en: "Choose the path", id: "Pilih jalurnya" } },
            { emoji: "⛏️", text: { en: "Dig at the X", id: "Gali di tanda X" } },
            { emoji: "🎉", text: { en: "Grab the treasure", id: "Ambil hartanya" } },
          ],
        },
      ],
    },
  ],
};
