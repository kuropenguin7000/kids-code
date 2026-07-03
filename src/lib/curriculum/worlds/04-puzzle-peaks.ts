import type { WorldDef } from "../types";

export const world: WorldDef = {
  id: "puzzle-peaks",
  emoji: "🏔️",
  color: "#f43f5e",
  title: { en: "Puzzle Peaks", id: "Puncak Teka-Teki" },
  description: {
    en: "Double rules, master mazes and clever plans — the last climb before real code!",
    id: "Aturan ganda, labirin master, dan rencana cerdas — pendakian terakhir sebelum kode sungguhan!",
  },
  levels: [
    {
      id: "logic-combo",
      emoji: "🔗",
      color: "#84cc16",
      title: { en: "Double Rules", id: "Aturan Ganda" },
      description: {
        en: "Real rules often need two checks: AND means both, OR means at least one, NOT flips it!",
        id: "Aturan sungguhan sering butuh dua pemeriksaan: DAN berarti keduanya, ATAU berarti salah satu, TIDAK membaliknya!",
      },
      games: [
        {
          kind: "choice",
          id: "combo-and",
          emoji: "🚸",
          title: { en: "The AND Crossing", id: "Penyeberangan DAN" },
          instructions: {
            en: "AND means BOTH things must be true. Check both before you choose!",
            id: "DAN berarti KEDUA hal harus benar. Periksa keduanya sebelum memilih!",
          },
          scenario: {
            en: "Robo's rule: IF the light is green AND the road is empty, THEN cross. The light is green, but a car is coming. What does Robo do?",
            id: "Aturan Robo: JIKA lampu hijau DAN jalan kosong, MAKA menyeberang. Lampunya hijau, tapi ada mobil datang. Apa yang Robo lakukan?",
          },
          options: [
            {
              emoji: "✋",
              text: {
                en: "Wait — both must be true",
                id: "Menunggu — keduanya harus benar",
              },
            },
            {
              emoji: "🏃",
              text: {
                en: "Cross — the light is green",
                id: "Menyeberang — lampunya hijau",
              },
            },
            {
              emoji: "🙈",
              text: {
                en: "Close his eyes and go",
                id: "Tutup mata lalu jalan",
              },
            },
          ],
          correctIndex: 0,
        },
        {
          kind: "choice",
          id: "combo-or",
          emoji: "☔",
          title: { en: "The OR Umbrella", id: "Payung ATAU" },
          instructions: {
            en: "OR means at least ONE thing must be true. One is enough!",
            id: "ATAU berarti minimal SATU hal harus benar. Satu saja cukup!",
          },
          scenario: {
            en: "Robo's rule: IF it is raining OR the forecast says rain, THEN take the umbrella. The sun is out, but the forecast says rain. What does Robo do?",
            id: "Aturan Robo: JIKA hujan turun ATAU ramalan cuaca bilang hujan, MAKA bawa payung. Matahari cerah, tapi ramalan bilang hujan. Apa yang Robo lakukan?",
          },
          options: [
            {
              emoji: "🕶️",
              text: {
                en: "Leave the umbrella — it's sunny",
                id: "Tinggalkan payung — sedang cerah",
              },
            },
            {
              emoji: "☂️",
              text: {
                en: "Take the umbrella — one is true",
                id: "Bawa payung — satu sudah benar",
              },
            },
            {
              emoji: "🏠",
              text: { en: "Stay home forever", id: "Diam di rumah selamanya" },
            },
          ],
          correctIndex: 1,
        },
        {
          kind: "choice",
          id: "combo-not",
          emoji: "🔄",
          title: { en: "The NOT Flipper", id: "Pembalik TIDAK" },
          instructions: {
            en: "NOT flips a rule: true becomes false, false becomes true!",
            id: "TIDAK membalik aturan: benar jadi salah, salah jadi benar!",
          },
          scenario: {
            en: "Robo's rule: IF it is NOT a school day, THEN sleep in. Today is Sunday. What does Robo do?",
            id: "Aturan Robo: JIKA hari ini BUKAN hari sekolah, MAKA tidur lebih lama. Hari ini Minggu. Apa yang Robo lakukan?",
          },
          options: [
            {
              emoji: "🎒",
              text: { en: "Rush to school", id: "Buru-buru ke sekolah" },
            },
            {
              emoji: "⏰",
              text: { en: "Set five alarms", id: "Pasang lima alarm" },
            },
            {
              emoji: "😴",
              text: {
                en: "Sleep in — no school today",
                id: "Tidur lagi — hari ini libur",
              },
            },
          ],
          correctIndex: 2,
        },
      ],
    },
    {
      id: "loop-mastery",
      emoji: "🌀",
      color: "#22c55e",
      title: { en: "Loop Master", id: "Master Perulangan" },
      description: {
        en: "Bigger mazes, fewer blocks — combine repeat blocks like a pro!",
        id: "Labirin lebih besar, balok lebih sedikit — gabungkan balok pengulang seperti profesional!",
      },
      games: [
        {
          kind: "robot",
          id: "mastery-zigzag",
          emoji: "⚡",
          title: { en: "The Zigzag Run", id: "Lari Zigzag" },
          instructions: {
            en: "Reach the star with only 4 blocks. You'll need repeat blocks more than once!",
            id: "Capai bintang hanya dengan 4 balok. Kamu butuh balok pengulang lebih dari sekali!",
          },
          cols: 5,
          rows: 5,
          start: { x: 0, y: 0 },
          goal: { x: 4, y: 4 },
          walls: [],
          palette: [
            { dx: 1, dy: 0, times: 1 },
            { dx: 0, dy: 1, times: 1 },
            { dx: 1, dy: 0, times: 2 },
            { dx: 0, dy: 1, times: 2 },
          ],
          maxBlocks: 4,
        },
        {
          kind: "robot",
          id: "mastery-updraft",
          emoji: "🌋",
          title: { en: "The Cliff Climb", id: "Memanjat Tebing" },
          instructions: {
            en: "A long ledge blocks the middle. Only 2 blocks allowed — pick the big repeats!",
            id: "Tepian panjang menghalangi bagian tengah. Hanya boleh 2 balok — pilih pengulang besar!",
          },
          cols: 5,
          rows: 4,
          start: { x: 0, y: 3 },
          goal: { x: 4, y: 0 },
          walls: [
            { x: 1, y: 2 },
            { x: 2, y: 2 },
            { x: 3, y: 2 },
          ],
          palette: [
            { dx: 1, dy: 0, times: 1 },
            { dx: 0, dy: -1, times: 1 },
            { dx: 1, dy: 0, times: 4 },
            { dx: 0, dy: -1, times: 3 },
          ],
          maxBlocks: 2,
        },
        {
          kind: "pattern",
          id: "mastery-count",
          emoji: "🔢",
          title: { en: "The Counting Loop", id: "Perulangan Menghitung" },
          instructions: {
            en: "This loop counts 1, 2, 3 — again and again. What comes next?",
            id: "Perulangan ini menghitung 1, 2, 3 — berulang-ulang. Apa yang berikutnya?",
          },
          sequence: ["1️⃣", "2️⃣", "3️⃣", "1️⃣", "2️⃣", "3️⃣", "1️⃣", "2️⃣"],
          options: ["1️⃣", "2️⃣", "3️⃣"],
          answer: "3️⃣",
        },
      ],
    },
    {
      id: "algorithms",
      emoji: "🗺️",
      color: "#e11d48",
      title: { en: "Plan Like a Pro", id: "Merencana seperti Pro" },
      description: {
        en: "A full plan from start to finish is called an algorithm — the programmer's secret weapon!",
        id: "Rencana lengkap dari awal sampai akhir disebut algoritma — senjata rahasia programmer!",
      },
      games: [
        {
          kind: "order",
          id: "alg-treasure",
          emoji: "🏴‍☠️",
          title: { en: "The Treasure Algorithm", id: "Algoritma Harta Karun" },
          instructions: {
            en: "Captain Robo has a treasure plan. Put the whole algorithm in order!",
            id: "Kapten Robo punya rencana harta karun. Susun seluruh algoritmanya!",
          },
          items: [
            { emoji: "🗺️", text: { en: "Read the map", id: "Baca petanya" } },
            {
              emoji: "👣",
              text: { en: "Follow the path", id: "Ikuti jalurnya" },
            },
            {
              emoji: "⛏️",
              text: { en: "Dig at the X", id: "Gali di tanda X" },
            },
            { emoji: "💰", text: { en: "Open the chest", id: "Buka petinya" } },
          ],
        },
        {
          kind: "choice",
          id: "alg-plan",
          emoji: "🪴",
          title: { en: "The Smartest Plan", id: "Rencana Paling Cerdas" },
          instructions: {
            en: "Good algorithms are short AND always work. Pick the smartest plan!",
            id: "Algoritma yang baik itu singkat DAN selalu berhasil. Pilih rencana paling cerdas!",
          },
          scenario: {
            en: "Robo must water 10 plants. Which plan is the smartest?",
            id: "Robo harus menyiram 10 tanaman. Rencana mana yang paling cerdas?",
          },
          options: [
            {
              emoji: "🔁",
              text: {
                en: "Repeat 10 times: water the next plant",
                id: "Ulangi 10 kali: siram tanaman berikutnya",
              },
            },
            {
              emoji: "📜",
              text: {
                en: 'Write "water plant 1", "water plant 2"... ten times',
                id: 'Tulis "siram tanaman 1", "siram tanaman 2"... sepuluh kali',
              },
            },
            {
              emoji: "🎲",
              text: {
                en: "Water random plants and hope for luck",
                id: "Siram tanaman acak dan berharap beruntung",
              },
            },
          ],
          correctIndex: 0,
        },
        {
          kind: "debug",
          id: "alg-cake",
          emoji: "🎂",
          title: { en: "The Cake Algorithm", id: "Algoritma Kue" },
          instructions: {
            en: "Robo's birthday-cake algorithm has a bug. Tap the step that is wrong!",
            id: "Algoritma kue ulang tahun Robo punya bug. Ketuk langkah yang salah!",
          },
          steps: [
            {
              emoji: "🥣",
              text: { en: "Mix the batter", id: "Aduk adonannya" },
            },
            {
              emoji: "🧊",
              text: {
                en: "Bake it in the freezer",
                id: "Panggang di dalam freezer",
              },
            },
            {
              emoji: "🍓",
              text: {
                en: "Decorate with strawberries",
                id: "Hias dengan stroberi",
              },
            },
            {
              emoji: "🕯️",
              text: { en: "Light the candles", id: "Nyalakan lilinnya" },
            },
          ],
          wrongIndex: 1,
          fixOptions: [
            {
              emoji: "🔥",
              text: { en: "Bake it in the oven", id: "Panggang di dalam oven" },
            },
            {
              emoji: "🛁",
              text: {
                en: "Bake it in the bathtub",
                id: "Panggang di bak mandi",
              },
            },
            {
              emoji: "🌞",
              text: {
                en: "Leave it in the sun",
                id: "Jemur di bawah matahari",
              },
            },
          ],
          correctFixIndex: 0,
        },
      ],
    },
  ],
};
