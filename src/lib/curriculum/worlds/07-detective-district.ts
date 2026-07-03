import type { WorldDef } from "../types";

export const world: WorldDef = {
  id: "detective-district",
  emoji: "🕵️",
  color: "#6366f1",
  title: { en: "Detective District", id: "Distrik Detektif" },
  description: {
    en: "Hunt sneaky bugs in patterns, plans and rules.",
    id: "Buru bug licik dalam pola, rencana, dan aturan.",
  },
  levels: [
    {
      id: "clue-patterns",
      emoji: "🔍",
      color: "#6366f1",
      title: { en: "Pattern Clues", id: "Petunjuk Pola" },
      description: {
        en: "A detective spots the tiny detail that breaks the pattern.",
        id: "Detektif melihat detail kecil yang merusak pola.",
      },
      games: [
        {
          kind: "debug",
          id: "clue-shape",
          emoji: "🟣",
          title: { en: "The Odd Dot", id: "Titik yang Janggal" },
          instructions: {
            en: "The dots should alternate yellow, purple, yellow, purple... Tap the dot that breaks the rule!",
            id: "Titiknya harus bergantian kuning, ungu, kuning, ungu... Ketuk titik yang melanggar aturan!",
          },
          steps: [
            { emoji: "🟡", text: { en: "Yellow", id: "Kuning" } },
            { emoji: "🟣", text: { en: "Purple", id: "Ungu" } },
            { emoji: "🟡", text: { en: "Yellow", id: "Kuning" } },
            { emoji: "🟡", text: { en: "Yellow", id: "Kuning" } },
          ],
          wrongIndex: 3,
          fixOptions: [
            { emoji: "🟣", text: { en: "Purple", id: "Ungu" } },
            { emoji: "🟡", text: { en: "Yellow", id: "Kuning" } },
            { emoji: "🔴", text: { en: "Red", id: "Merah" } },
          ],
          correctFixIndex: 0,
        },
        {
          kind: "pattern",
          id: "clue-moon",
          emoji: "🌙",
          title: { en: "Moon Watch", id: "Mengamati Bulan" },
          instructions: {
            en: "The moon grows the same way every time. What comes next?",
            id: "Bulan membesar dengan cara yang sama setiap kali. Apa yang berikutnya?",
          },
          sequence: ["🌑", "🌓", "🌕", "🌑", "🌓"],
          options: ["🌑", "🌓", "🌕"],
          answer: "🌕",
        },
        {
          kind: "debug",
          id: "clue-count",
          emoji: "🔢",
          title: { en: "The Counting Case", id: "Kasus Menghitung" },
          instructions: {
            en: "Robo counts up by one... but something is off. Tap the mistake!",
            id: "Robo menghitung naik satu-satu... tapi ada yang aneh. Ketuk kesalahannya!",
          },
          steps: [
            { emoji: "1️⃣", text: { en: "One", id: "Satu" } },
            { emoji: "2️⃣", text: { en: "Two", id: "Dua" } },
            { emoji: "3️⃣", text: { en: "Three", id: "Tiga" } },
            { emoji: "5️⃣", text: { en: "Five", id: "Lima" } },
          ],
          wrongIndex: 3,
          fixOptions: [
            { emoji: "4️⃣", text: { en: "Four", id: "Empat" } },
            { emoji: "6️⃣", text: { en: "Six", id: "Enam" } },
            { emoji: "0️⃣", text: { en: "Zero", id: "Nol" } },
          ],
          correctFixIndex: 0,
        },
      ],
    },
    {
      id: "clue-plans",
      emoji: "📋",
      color: "#4f46e5",
      title: { en: "Plan Inspectors", id: "Inspektur Rencana" },
      description: {
        en: "Real programs are plans — inspect every step like a pro.",
        id: "Program sungguhan adalah rencana — periksa setiap langkah seperti profesional.",
      },
      games: [
        {
          kind: "debug",
          id: "plan-pizza",
          emoji: "🍕",
          title: { en: "The Pizza Program", id: "Program Pizza" },
          instructions: {
            en: "Robo's pizza plan has one very strange step. Find it!",
            id: "Rencana pizza Robo punya satu langkah yang sangat aneh. Temukan!",
          },
          steps: [
            {
              emoji: "🥖",
              text: { en: "Roll out the dough", id: "Pipihkan adonan" },
            },
            {
              emoji: "🍅",
              text: { en: "Spread the sauce", id: "Oleskan saus" },
            },
            {
              emoji: "🧦",
              text: { en: "Sprinkle socks on top", id: "Taburi kaus kaki" },
            },
            {
              emoji: "🔥",
              text: { en: "Bake in the oven", id: "Panggang di oven" },
            },
          ],
          wrongIndex: 2,
          fixOptions: [
            { emoji: "🧀", text: { en: "Sprinkle cheese", id: "Taburi keju" } },
            {
              emoji: "🧸",
              text: { en: "Add a teddy bear", id: "Tambahkan boneka" },
            },
            {
              emoji: "🧊",
              text: { en: "Cover it with ice", id: "Tutupi dengan es batu" },
            },
          ],
          correctFixIndex: 0,
        },
        {
          kind: "debug",
          id: "plan-bath",
          emoji: "🛁",
          title: { en: "Bath Time Bug", id: "Bug Waktu Mandi" },
          instructions: {
            en: "One step in the bath plan will end very badly. Which one?",
            id: "Satu langkah dalam rencana mandi ini bakal kacau. Yang mana?",
          },
          steps: [
            { emoji: "🛁", text: { en: "Fill the tub", id: "Isi bak mandi" } },
            {
              emoji: "👟",
              text: { en: "Get in with shoes on", id: "Masuk dengan sepatu" },
            },
            {
              emoji: "🧼",
              text: { en: "Scrub with soap", id: "Gosok pakai sabun" },
            },
            {
              emoji: "🧺",
              text: { en: "Dry with a towel", id: "Keringkan dengan handuk" },
            },
          ],
          wrongIndex: 1,
          fixOptions: [
            {
              emoji: "🦶",
              text: {
                en: "Take shoes off, then get in",
                id: "Lepas sepatu, lalu masuk",
              },
            },
            {
              emoji: "🎩",
              text: { en: "Put on a fancy hat", id: "Pakai topi pesta" },
            },
            {
              emoji: "📺",
              text: { en: "Bring the TV along", id: "Bawa TV sekalian" },
            },
          ],
          correctFixIndex: 0,
        },
        {
          kind: "order",
          id: "plan-library",
          emoji: "📚",
          title: { en: "Return the Book", id: "Kembalikan Bukunya" },
          instructions: {
            en: "The book is due today! Put the plan in the right order.",
            id: "Bukunya harus dikembalikan hari ini! Susun rencananya dengan benar.",
          },
          items: [
            {
              emoji: "🔍",
              text: {
                en: "Find the borrowed book",
                id: "Cari buku pinjamannya",
              },
            },
            {
              emoji: "🎒",
              text: { en: "Put it in your bag", id: "Masukkan ke tas" },
            },
            {
              emoji: "🚶",
              text: { en: "Walk to the library", id: "Jalan ke perpustakaan" },
            },
            {
              emoji: "🤝",
              text: {
                en: "Hand it to the librarian",
                id: "Serahkan ke pustakawan",
              },
            },
          ],
        },
      ],
    },
    {
      id: "clue-rules",
      emoji: "⚖️",
      color: "#4338ca",
      title: { en: "Rule Detectives", id: "Detektif Aturan" },
      description: {
        en: "Watch what happens, then figure out the hidden rule!",
        id: "Amati yang terjadi, lalu temukan aturan tersembunyinya!",
      },
      games: [
        {
          kind: "choice",
          id: "rule-club",
          emoji: "🚪",
          title: { en: "The Secret Club", id: "Klub Rahasia" },
          instructions: {
            en: "Look at who gets in and who doesn't — the rule is hiding there!",
            id: "Perhatikan siapa yang boleh masuk dan siapa yang tidak — aturannya bersembunyi di situ!",
          },
          scenario: {
            en: "Robo lets in 🐶 🐱 🐰 but stops 🚗 ✈️ ⚽. What is his secret rule?",
            id: "Robo mengizinkan 🐶 🐱 🐰 masuk tapi menahan 🚗 ✈️ ⚽. Apa aturan rahasianya?",
          },
          options: [
            {
              emoji: "🐾",
              text: {
                en: "Only animals may enter",
                id: "Hanya hewan yang boleh masuk",
              },
            },
            {
              emoji: "🔴",
              text: { en: "Only red things", id: "Hanya benda merah" },
            },
            {
              emoji: "📏",
              text: { en: "Only big things", id: "Hanya benda besar" },
            },
          ],
          correctIndex: 0,
        },
        {
          kind: "choice",
          id: "rule-numbers",
          emoji: "🎰",
          title: { en: "The Number Gate", id: "Gerbang Angka" },
          instructions: {
            en: "Some numbers open the gate, some don't. Crack the rule!",
            id: "Beberapa angka membuka gerbang, yang lain tidak. Pecahkan aturannya!",
          },
          scenario: {
            en: "The gate opens for 2, 4, 6 and 8 — but not for 3, 5 or 7. What is the rule?",
            id: "Gerbang terbuka untuk 2, 4, 6, dan 8 — tapi tidak untuk 3, 5, atau 7. Apa aturannya?",
          },
          options: [
            {
              emoji: "👯",
              text: {
                en: "Numbers you reach counting by twos",
                id: "Angka yang didapat saat menghitung dua-dua",
              },
            },
            {
              emoji: "🤏",
              text: { en: "Small numbers only", id: "Hanya angka kecil" },
            },
            {
              emoji: "🍀",
              text: {
                en: "Lucky numbers only",
                id: "Hanya angka keberuntungan",
              },
            },
          ],
          correctIndex: 0,
        },
        {
          kind: "debug",
          id: "rule-wings",
          emoji: "🪽",
          title: { en: "The Flying Club", id: "Klub Terbang" },
          instructions: {
            en: "Rule: IF it has wings, THEN it may join. One member should not be here!",
            id: "Aturan: JIKA punya sayap, MAKA boleh bergabung. Satu anggota seharusnya tidak di sini!",
          },
          steps: [
            { emoji: "🦅", text: { en: "Eagle joins", id: "Elang bergabung" } },
            {
              emoji: "🦋",
              text: { en: "Butterfly joins", id: "Kupu-kupu bergabung" },
            },
            {
              emoji: "🐘",
              text: { en: "Elephant joins", id: "Gajah bergabung" },
            },
            { emoji: "🐝", text: { en: "Bee joins", id: "Lebah bergabung" } },
          ],
          wrongIndex: 2,
          fixOptions: [
            {
              emoji: "🦉",
              text: { en: "Owl joins", id: "Burung hantu bergabung" },
            },
            { emoji: "🐠", text: { en: "Fish joins", id: "Ikan bergabung" } },
            { emoji: "🪨", text: { en: "Rock joins", id: "Batu bergabung" } },
          ],
          correctFixIndex: 0,
        },
      ],
    },
  ],
};
