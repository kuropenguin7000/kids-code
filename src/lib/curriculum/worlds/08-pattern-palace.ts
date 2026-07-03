import type { WorldDef } from "../types";

export const world: WorldDef = {
  id: "pattern-palace",
  emoji: "🏛️",
  color: "#d946ef",
  title: { en: "Pattern Palace", id: "Istana Pola" },
  description: {
    en: "Royal riddles: patterns inside patterns and magic number machines.",
    id: "Teka-teki kerajaan: pola di dalam pola dan mesin angka ajaib.",
  },
  levels: [
    {
      id: "palace-doubles",
      emoji: "👯",
      color: "#d946ef",
      title: { en: "Double Patterns", id: "Pola Ganda" },
      description: {
        en: "Patterns can hide inside patterns — look twice!",
        id: "Pola bisa bersembunyi di dalam pola — lihat dua kali!",
      },
      games: [
        {
          kind: "pattern",
          id: "double-pairs",
          emoji: "🍇",
          title: { en: "Fruit Pairs", id: "Pasangan Buah" },
          instructions: {
            en: "The fruits march in PAIRS: two strawberries, two lemons, two grapes... What comes next?",
            id: "Buahnya berbaris BERPASANGAN: dua stroberi, dua lemon, dua anggur... Apa yang berikutnya?",
          },
          sequence: ["🍓", "🍓", "🍋", "🍋", "🍇", "🍇", "🍓", "🍓", "🍋"],
          options: ["🍓", "🍋", "🍇"],
          answer: "🍋",
        },
        {
          kind: "pattern",
          id: "double-flowers",
          emoji: "🌼",
          title: { en: "The Flower Parade", id: "Parade Bunga" },
          instructions: {
            en: "Three pinks, then one yellow — count carefully! What comes next?",
            id: "Tiga merah muda, lalu satu kuning — hitung dengan teliti! Apa yang berikutnya?",
          },
          sequence: [
            "🌸",
            "🌸",
            "🌸",
            "🌼",
            "🌸",
            "🌸",
            "🌸",
            "🌼",
            "🌸",
            "🌸",
          ],
          options: ["🌸", "🌼", "🌹"],
          answer: "🌸",
        },
        {
          kind: "debug",
          id: "double-bug",
          emoji: "🟠",
          title: { en: "The Pair Repair", id: "Perbaikan Pasangan" },
          instructions: {
            en: "This pattern should go two oranges, two greens, repeating. One dot broke it!",
            id: "Pola ini harusnya dua oranye, dua hijau, berulang. Satu titik merusaknya!",
          },
          steps: [
            { emoji: "🟠", text: { en: "Orange", id: "Oranye" } },
            { emoji: "🟠", text: { en: "Orange", id: "Oranye" } },
            { emoji: "🟢", text: { en: "Green", id: "Hijau" } },
            { emoji: "🟢", text: { en: "Green", id: "Hijau" } },
            { emoji: "🟢", text: { en: "Green", id: "Hijau" } },
          ],
          wrongIndex: 4,
          fixOptions: [
            { emoji: "🟠", text: { en: "Orange", id: "Oranye" } },
            { emoji: "🟢", text: { en: "Green", id: "Hijau" } },
            { emoji: "🔵", text: { en: "Blue", id: "Biru" } },
          ],
          correctFixIndex: 0,
        },
      ],
    },
    {
      id: "palace-numbers",
      emoji: "🔮",
      color: "#a21caf",
      title: { en: "Number Magic", id: "Sihir Angka" },
      description: {
        en: "Number machines follow secret rules — can you see them?",
        id: "Mesin angka mengikuti aturan rahasia — bisakah kamu melihatnya?",
      },
      games: [
        {
          kind: "pattern",
          id: "num-countdown",
          emoji: "🎈",
          title: { en: "The Countdown Pattern", id: "Pola Hitung Mundur" },
          instructions: {
            en: "The numbers shrink by 2 each time. What comes next?",
            id: "Angkanya berkurang 2 setiap kali. Apa yang berikutnya?",
          },
          sequence: ["9️⃣", "7️⃣", "5️⃣"],
          options: ["4️⃣", "3️⃣", "2️⃣"],
          answer: "3️⃣",
        },
        {
          kind: "choice",
          id: "num-double",
          emoji: "🎩",
          title: { en: "The Doubling Machine", id: "Mesin Pengganda" },
          instructions: {
            en: "Watch what the machine does to each number that goes in!",
            id: "Perhatikan apa yang dilakukan mesin pada setiap angka yang masuk!",
          },
          scenario: {
            en: "The machine doubles: 2 goes in, 4 comes out. 5 goes in, 10 comes out. What comes out for 6?",
            id: "Mesinnya menggandakan: 2 masuk, 4 keluar. 5 masuk, 10 keluar. Berapa yang keluar untuk 6?",
          },
          options: [
            { emoji: "✨", text: { en: "12", id: "12" } },
            { emoji: "🤔", text: { en: "8", id: "8" } },
            { emoji: "😵", text: { en: "62", id: "62" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "choice",
          id: "num-machine",
          emoji: "⚙️",
          title: { en: "Guess the Machine", id: "Tebak Mesinnya" },
          instructions: {
            en: "Compare what goes in with what comes out — the rule will appear!",
            id: "Bandingkan yang masuk dengan yang keluar — aturannya akan terlihat!",
          },
          scenario: {
            en: "3 becomes 5. 7 becomes 9. 10 becomes 12. What does the machine do?",
            id: "3 menjadi 5. 7 menjadi 9. 10 menjadi 12. Apa yang dilakukan mesinnya?",
          },
          options: [
            { emoji: "➕", text: { en: "It adds 2", id: "Menambahkan 2" } },
            {
              emoji: "✖️",
              text: {
                en: "It doubles the number",
                id: "Menggandakan angkanya",
              },
            },
            {
              emoji: "➖",
              text: { en: "It takes 2 away", id: "Mengurangi 2" },
            },
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "palace-abstract",
      emoji: "🪞",
      color: "#86198f",
      title: { en: "Same but Different", id: "Sama tapi Beda" },
      description: {
        en: "Programmers spot the SAME idea hiding in different clothes.",
        id: "Programmer mengenali ide yang SAMA meski berpakaian beda.",
      },
      games: [
        {
          kind: "choice",
          id: "abs-same",
          emoji: "👏",
          title: { en: "Copy the Beat", id: "Tiru Iramanya" },
          instructions: {
            en: "Listen to the rhythm, not the moves: short, short, BIG!",
            id: "Rasakan iramanya, bukan gerakannya: pendek, pendek, BESAR!",
          },
          scenario: {
            en: '"Clap, clap, stomp" has a rhythm. Which one has the SAME rhythm?',
            id: '"Tepuk, tepuk, hentak" punya irama. Mana yang iramanya SAMA?',
          },
          options: [
            {
              emoji: "😉",
              text: { en: "Blink, blink, jump", id: "Kedip, kedip, lompat" },
            },
            {
              emoji: "🔄",
              text: { en: "Clap, stomp, clap", id: "Tepuk, hentak, tepuk" },
            },
            {
              emoji: "👟",
              text: { en: "Stomp, stomp, stomp", id: "Hentak, hentak, hentak" },
            },
          ],
          correctIndex: 0,
        },
        {
          kind: "pattern",
          id: "abs-shapes",
          emoji: "⭐",
          title: { en: "Star Song", id: "Lagu Bintang" },
          instructions: {
            en: "Star, star, moon — the same song again and again. What comes next?",
            id: "Bintang, bintang, bulan — lagu yang sama berulang-ulang. Apa yang berikutnya?",
          },
          sequence: ["⭐", "⭐", "🌙", "⭐", "⭐", "🌙", "⭐"],
          options: ["⭐", "🌙", "☀️"],
          answer: "⭐",
        },
        {
          kind: "order",
          id: "abs-recipe",
          emoji: "🎨",
          title: { en: "The Maker's Recipe", id: "Resep Sang Pembuat" },
          instructions: {
            en: "Every maker — baker, builder or coder — follows this same plan. Put it in order!",
            id: "Setiap pembuat — tukang roti, tukang bangunan, atau koder — mengikuti rencana yang sama. Susun urutannya!",
          },
          items: [
            {
              emoji: "📦",
              text: { en: "Get the materials", id: "Siapkan bahannya" },
            },
            {
              emoji: "📖",
              text: { en: "Follow the steps", id: "Ikuti langkah-langkahnya" },
            },
            {
              emoji: "🔍",
              text: { en: "Check the result", id: "Periksa hasilnya" },
            },
            {
              emoji: "🎁",
              text: { en: "Share your creation", id: "Bagikan karyamu" },
            },
          ],
        },
      ],
    },
  ],
};
