import type { WorldDef } from "../types";

export const world: WorldDef = {
  id: "robot-rally",
  emoji: "🏎️",
  color: "#ea580c",
  title: { en: "Robot Rally", id: "Reli Robot" },
  description: {
    en: "Bigger mazes, fuel limits and one grand final race!",
    id: "Labirin lebih besar, bahan bakar terbatas, dan satu balapan final akbar!",
  },
  levels: [
    {
      id: "rally-sprints",
      emoji: "🏁",
      color: "#ea580c",
      title: { en: "Speedway Sprints", id: "Sprint Lintasan" },
      description: {
        en: "New tracks, new walls — plan the whole route before you press Go!",
        id: "Lintasan baru, tembok baru — rencanakan seluruh rute sebelum menekan Jalan!",
      },
      games: [
        {
          kind: "robot",
          id: "rally-detour",
          emoji: "🚧",
          title: { en: "The Big Detour", id: "Jalan Memutar" },
          instructions: {
            en: "The middle is blocked! Go around — over the top or under the bottom. Max 3 blocks!",
            id: "Bagian tengah terhalang! Memutarlah — lewat atas atau bawah. Maksimal 3 balok!",
          },
          cols: 5,
          rows: 5,
          start: { x: 0, y: 2 },
          goal: { x: 4, y: 2 },
          walls: [
            { x: 2, y: 1 },
            { x: 2, y: 2 },
            { x: 2, y: 3 },
          ],
          palette: [
            { dx: 1, dy: 0, times: 1 },
            { dx: 0, dy: -1, times: 1 },
            { dx: 0, dy: 1, times: 1 },
            { dx: 1, dy: 0, times: 4 },
            { dx: 0, dy: -1, times: 2 },
            { dx: 0, dy: 1, times: 2 },
          ],
          maxBlocks: 3,
        },
        {
          kind: "robot",
          id: "rally-snake",
          emoji: "🐍",
          title: { en: "Snake Alley", id: "Gang Ular" },
          instructions: {
            en: "Slither through the alley: right, down, back left, down again... 5 blocks only!",
            id: "Meliuklah melewati gang: kanan, turun, balik ke kiri, turun lagi... hanya 5 balok!",
          },
          cols: 5,
          rows: 5,
          start: { x: 0, y: 0 },
          goal: { x: 4, y: 4 },
          walls: [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 3, y: 1 },
            { x: 1, y: 3 },
            { x: 2, y: 3 },
            { x: 3, y: 3 },
            { x: 4, y: 3 },
          ],
          palette: [
            { dx: 1, dy: 0, times: 1 },
            { dx: -1, dy: 0, times: 1 },
            { dx: 0, dy: 1, times: 1 },
            { dx: 1, dy: 0, times: 4 },
            { dx: -1, dy: 0, times: 4 },
            { dx: 0, dy: 1, times: 2 },
          ],
          maxBlocks: 5,
        },
        {
          kind: "pattern",
          id: "rally-turns",
          emoji: "🗺️",
          title: { en: "Remember the Route", id: "Ingat Rutenya" },
          instructions: {
            en: "The track repeats: right, right, down. Which turn comes next?",
            id: "Lintasannya berulang: kanan, kanan, turun. Belokan apa yang berikutnya?",
          },
          sequence: ["➡️", "➡️", "⬇️", "➡️", "➡️", "⬇️", "➡️", "➡️"],
          options: ["➡️", "⬇️", "⬆️"],
          answer: "⬇️",
        },
      ],
    },
    {
      id: "rally-fuel",
      emoji: "⛽",
      color: "#d97706",
      title: { en: "Fuel Savers", id: "Hemat Bahan Bakar" },
      description: {
        en: "Every block costs fuel — champions use as few as possible!",
        id: "Setiap balok memakai bahan bakar — juara memakai sesedikit mungkin!",
      },
      games: [
        {
          kind: "choice",
          id: "fuel-plan",
          emoji: "🔋",
          title: { en: "The Cheapest Program", id: "Program Paling Irit" },
          instructions: {
            en: "Short programs save fuel. Pick the cheapest one!",
            id: "Program singkat menghemat bahan bakar. Pilih yang paling irit!",
          },
          scenario: {
            en: "Robo must walk 8 steps right. Which program uses the FEWEST blocks?",
            id: "Robo harus berjalan 8 langkah ke kanan. Program mana yang memakai balok PALING SEDIKIT?",
          },
          options: [
            {
              emoji: "🔁",
              text: {
                en: "Repeat 8 times: step right",
                id: "Ulangi 8 kali: melangkah ke kanan",
              },
            },
            {
              emoji: "➡️",
              text: {
                en: "Eight separate arrow blocks",
                id: "Delapan balok panah terpisah",
              },
            },
            {
              emoji: "🎲",
              text: {
                en: "Walk around randomly",
                id: "Jalan ke sana kemari sembarangan",
              },
            },
          ],
          correctIndex: 0,
        },
        {
          kind: "robot",
          id: "fuel-run",
          emoji: "🛢️",
          title: { en: "Two-Block Trek", id: "Perjalanan Dua Balok" },
          instructions: {
            en: "Reach the star with only 2 blocks. Big repeats are your friends!",
            id: "Capai bintang hanya dengan 2 balok. Pengulang besar adalah temanmu!",
          },
          cols: 4,
          rows: 4,
          start: { x: 0, y: 0 },
          goal: { x: 3, y: 3 },
          walls: [],
          palette: [
            { dx: 1, dy: 0, times: 1 },
            { dx: 0, dy: 1, times: 1 },
            { dx: 1, dy: 0, times: 3 },
            { dx: 0, dy: 1, times: 3 },
          ],
          maxBlocks: 2,
        },
        {
          kind: "debug",
          id: "fuel-bug",
          emoji: "🔙",
          title: { en: "The Wasted Step", id: "Langkah Terbuang" },
          instructions: {
            en: "The star is 4 steps to the right, but one command wastes fuel. Tap it!",
            id: "Bintangnya 4 langkah ke kanan, tapi satu perintah membuang bahan bakar. Ketuk!",
          },
          steps: [
            {
              emoji: "➡️",
              text: { en: "Step right", id: "Melangkah ke kanan" },
            },
            {
              emoji: "➡️",
              text: { en: "Step right", id: "Melangkah ke kanan" },
            },
            { emoji: "⬅️", text: { en: "Step LEFT", id: "Melangkah ke KIRI" } },
            {
              emoji: "➡️",
              text: { en: "Step right", id: "Melangkah ke kanan" },
            },
          ],
          wrongIndex: 2,
          fixOptions: [
            {
              emoji: "➡️",
              text: { en: "Step right", id: "Melangkah ke kanan" },
            },
            { emoji: "⬆️", text: { en: "Step up", id: "Melangkah ke atas" } },
            { emoji: "💤", text: { en: "Take a nap", id: "Tidur siang" } },
          ],
          correctFixIndex: 0,
        },
      ],
    },
    {
      id: "rally-champ",
      emoji: "🏆",
      color: "#c2410c",
      title: { en: "The Grand Prix", id: "Grand Prix" },
      description: {
        en: "The final race: a big maze, a sharp mind and very few blocks!",
        id: "Balapan final: labirin besar, pikiran tajam, dan balok yang sangat sedikit!",
      },
      games: [
        {
          kind: "robot",
          id: "champ-final",
          emoji: "🏎️",
          title: { en: "Champion's Circuit", id: "Sirkuit Juara" },
          instructions: {
            en: "Two long ledges block the way. Find the one open lane — 3 blocks max!",
            id: "Dua tepian panjang menghalangi jalan. Temukan satu jalur yang terbuka — maksimal 3 balok!",
          },
          cols: 6,
          rows: 5,
          start: { x: 0, y: 4 },
          goal: { x: 5, y: 0 },
          walls: [
            { x: 1, y: 3 },
            { x: 2, y: 3 },
            { x: 3, y: 3 },
            { x: 4, y: 3 },
            { x: 2, y: 1 },
            { x: 3, y: 1 },
            { x: 4, y: 1 },
            { x: 5, y: 1 },
          ],
          palette: [
            { dx: 1, dy: 0, times: 1 },
            { dx: 0, dy: -1, times: 1 },
            { dx: 1, dy: 0, times: 5 },
            { dx: 0, dy: -1, times: 4 },
          ],
          maxBlocks: 3,
        },
        {
          kind: "pattern",
          id: "champ-pattern",
          emoji: "🥇",
          title: { en: "The Podium Pattern", id: "Pola Podium" },
          instructions: {
            en: "Gold, silver, silver, bronze — the podium repeats. Who is next?",
            id: "Emas, perak, perak, perunggu — podiumnya berulang. Siapa berikutnya?",
          },
          sequence: ["🥇", "🥈", "🥈", "🥉", "🥇", "🥈", "🥈", "🥉", "🥇"],
          options: ["🥇", "🥈", "🥉"],
          answer: "🥈",
        },
        {
          kind: "choice",
          id: "champ-predict",
          emoji: "🧠",
          title: { en: "Predict the Robot", id: "Tebak si Robot" },
          instructions: {
            en: "Run the program in your head before answering!",
            id: "Jalankan programnya di kepalamu sebelum menjawab!",
          },
          scenario: {
            en: "Robo runs: Repeat 3 times: [step right, step right]. How many steps does he take?",
            id: "Robo menjalankan: Ulangi 3 kali: [melangkah kanan, melangkah kanan]. Berapa langkah yang ia ambil?",
          },
          options: [
            { emoji: "6️⃣", text: { en: "6 steps", id: "6 langkah" } },
            { emoji: "3️⃣", text: { en: "3 steps", id: "3 langkah" } },
            { emoji: "9️⃣", text: { en: "9 steps", id: "9 langkah" } },
          ],
          correctIndex: 0,
        },
      ],
    },
  ],
};
