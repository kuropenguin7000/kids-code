import type { WorldDef } from "../types";

export const world: WorldDef = {
  id: "logic-legends",
  emoji: "🦸",
  color: "#16a34a",
  title: { en: "Logic Legends", id: "Legenda Logika" },
  description: {
    en: "Run programs in your head — the final training before real code!",
    id: "Jalankan program di kepalamu — latihan terakhir sebelum kode sungguhan!",
  },
  levels: [
    {
      id: "legend-trace",
      emoji: "🧭",
      color: "#16a34a",
      title: { en: "Run It in Your Head", id: "Jalankan di Kepalamu" },
      description: {
        en: "Legends can run a whole program in their head before pressing Go.",
        id: "Para legenda bisa menjalankan seluruh program di kepala sebelum menekan Jalan.",
      },
      games: [
        {
          kind: "choice",
          id: "trace-loop",
          emoji: "🗣️",
          title: { en: "The Echo Program", id: "Program Gema" },
          instructions: {
            en: "Count the repeats carefully!",
            id: "Hitung pengulangannya dengan teliti!",
          },
          scenario: {
            en: 'Program: repeat 3 times → say "HOP". What does Robo say?',
            id: 'Program: ulangi 3 kali → ucapkan "HOP". Apa yang Robo ucapkan?',
          },
          options: [
            { emoji: "🐇", text: { en: "HOP HOP HOP", id: "HOP HOP HOP" } },
            { emoji: "🤫", text: { en: "HOP", id: "HOP" } },
            {
              emoji: "😵",
              text: { en: "HOP HOP HOP HOP", id: "HOP HOP HOP HOP" },
            },
          ],
          correctIndex: 0,
        },
        {
          kind: "choice",
          id: "trace-box",
          emoji: "🎁",
          title: { en: "Follow the Box", id: "Ikuti Kotaknya" },
          instructions: {
            en: "Track the box step by step — one change at a time.",
            id: "Ikuti kotaknya langkah demi langkah — satu perubahan setiap kali.",
          },
          scenario: {
            en: "The box holds 2. Add 3. Then double it. What is in the box now?",
            id: "Kotaknya berisi 2. Tambahkan 3. Lalu gandakan. Sekarang isinya berapa?",
          },
          options: [
            { emoji: "✨", text: { en: "10", id: "10" } },
            { emoji: "🤔", text: { en: "7", id: "7" } },
            { emoji: "😵", text: { en: "12", id: "12" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "choice",
          id: "trace-if",
          emoji: "🎉",
          title: { en: "Cheer or No Cheer?", id: "Bersorak atau Tidak?" },
          instructions: {
            en: "First work out the box, THEN check the rule.",
            id: "Hitung dulu isi kotaknya, BARU periksa aturannya.",
          },
          scenario: {
            en: "Rule: IF the box holds MORE than 4, Robo cheers. The box holds 3, then Robo adds 2. Does he cheer?",
            id: "Aturan: JIKA kotak berisi LEBIH dari 4, Robo bersorak. Kotaknya berisi 3, lalu Robo menambah 2. Apakah ia bersorak?",
          },
          options: [
            {
              emoji: "🎉",
              text: { en: "Yes — 5 is more than 4", id: "Ya — 5 lebih dari 4" },
            },
            {
              emoji: "😐",
              text: {
                en: "No — 5 is less than 4",
                id: "Tidak — 5 kurang dari 4",
              },
            },
            {
              emoji: "🙈",
              text: { en: "He hides instead", id: "Dia malah sembunyi" },
            },
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "legend-combine",
      emoji: "🧩",
      color: "#15803d",
      title: { en: "Mix It All", id: "Campur Semuanya" },
      description: {
        en: "Sequences, loops, rules and bugs — all at once!",
        id: "Urutan, perulangan, aturan, dan bug — semuanya sekaligus!",
      },
      games: [
        {
          kind: "robot",
          id: "legend-maze",
          emoji: "🏰",
          title: { en: "The Legend's Maze", id: "Labirin Legenda" },
          instructions: {
            en: "The wall has gaps only at the far edges. Pick a side and plan 3 blocks!",
            id: "Temboknya hanya berlubang di tepi-tepi jauh. Pilih satu sisi dan rencanakan 3 balok!",
          },
          cols: 5,
          rows: 5,
          start: { x: 2, y: 4 },
          goal: { x: 2, y: 0 },
          walls: [
            { x: 1, y: 2 },
            { x: 2, y: 2 },
            { x: 3, y: 2 },
          ],
          palette: [
            { dx: -1, dy: 0, times: 1 },
            { dx: 1, dy: 0, times: 1 },
            { dx: 0, dy: -1, times: 1 },
            { dx: -1, dy: 0, times: 2 },
            { dx: 1, dy: 0, times: 2 },
            { dx: 0, dy: -1, times: 4 },
          ],
          maxBlocks: 3,
        },
        {
          kind: "debug",
          id: "legend-dance",
          emoji: "💃",
          title: { en: "The Dance Bug", id: "Bug Tarian" },
          instructions: {
            en: "The dance repeats spin, clap, spin, clap... one move is wrong!",
            id: "Tariannya berulang putar, tepuk, putar, tepuk... satu gerakan salah!",
          },
          steps: [
            { emoji: "🌀", text: { en: "Spin", id: "Berputar" } },
            { emoji: "👏", text: { en: "Clap", id: "Tepuk tangan" } },
            { emoji: "🌀", text: { en: "Spin", id: "Berputar" } },
            { emoji: "😴", text: { en: "Sleep", id: "Tidur" } },
          ],
          wrongIndex: 3,
          fixOptions: [
            { emoji: "👏", text: { en: "Clap", id: "Tepuk tangan" } },
            { emoji: "🌀", text: { en: "Spin", id: "Berputar" } },
            { emoji: "🦵", text: { en: "Kick", id: "Menendang" } },
          ],
          correctFixIndex: 0,
        },
        {
          kind: "pattern",
          id: "legend-rainbow",
          emoji: "🌈",
          title: { en: "Triple Rainbow", id: "Pelangi Tiga Warna" },
          instructions: {
            en: "Red, orange, yellow — around and around. What comes next?",
            id: "Merah, oranye, kuning — berputar terus. Apa yang berikutnya?",
          },
          sequence: ["🟥", "🟧", "🟨", "🟥", "🟧", "🟨", "🟥", "🟧"],
          options: ["🟥", "🟨", "🟩"],
          answer: "🟨",
        },
      ],
    },
    {
      id: "legend-final",
      emoji: "🎓",
      color: "#166534",
      title: { en: "Almost a Coder", id: "Hampir Jadi Koder" },
      description: {
        en: "One last look at how real programs think — then the castle gates open!",
        id: "Satu pandangan terakhir pada cara program sungguhan berpikir — lalu gerbang kastel terbuka!",
      },
      games: [
        {
          kind: "choice",
          id: "final-text",
          emoji: "🔤",
          title: { en: "Text or Math?", id: "Teks atau Hitungan?" },
          instructions: {
            en: "Quotes make TEXT — and text gets glued, not added!",
            id: "Tanda kutip membuat TEKS — dan teks disambung, bukan dijumlahkan!",
          },
          scenario: {
            en: 'In real code, say("3" + "2") glues two TEXTS together. What appears?',
            id: 'Di kode sungguhan, say("3" + "2") menyambung dua TEKS. Apa yang muncul?',
          },
          options: [
            { emoji: "🔤", text: { en: "32", id: "32" } },
            { emoji: "🧮", text: { en: "5", id: "5" } },
            { emoji: "💥", text: { en: "An explosion", id: "Ledakan" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "choice",
          id: "final-order",
          emoji: "🔝",
          title: { en: "Top to Bottom", id: "Dari Atas ke Bawah" },
          instructions: {
            en: "Programs always run line by line, from the top.",
            id: "Program selalu berjalan baris demi baris, dari atas.",
          },
          scenario: {
            en: 'Line 1: say("A"). Line 2: say("B"). What shows FIRST?',
            id: 'Baris 1: say("A"). Baris 2: say("B"). Apa yang muncul DULUAN?',
          },
          options: [
            { emoji: "🅰️", text: { en: "A", id: "A" } },
            { emoji: "🅱️", text: { en: "B", id: "B" } },
            {
              emoji: "🤝",
              text: { en: "Both at once", id: "Keduanya bersamaan" },
            },
          ],
          correctIndex: 0,
        },
        {
          kind: "debug",
          id: "final-workflow",
          emoji: "🐞",
          title: { en: "The Coder's Day", id: "Hari Sang Koder" },
          instructions: {
            en: "This is how real programmers work — but one habit is very wrong!",
            id: "Beginilah cara kerja programmer sungguhan — tapi satu kebiasaan sangat salah!",
          },
          steps: [
            {
              emoji: "🧠",
              text: { en: "Think of a plan", id: "Pikirkan rencananya" },
            },
            {
              emoji: "⌨️",
              text: { en: "Write the code", id: "Tulis kodenya" },
            },
            {
              emoji: "🙈",
              text: { en: "Never test it", id: "Jangan pernah mengetesnya" },
            },
            {
              emoji: "🐛",
              text: { en: "Fix any bugs", id: "Perbaiki bug yang ada" },
            },
          ],
          wrongIndex: 2,
          fixOptions: [
            {
              emoji: "▶️",
              text: { en: "Run and test it", id: "Jalankan dan tes" },
            },
            {
              emoji: "🗑️",
              text: { en: "Delete everything", id: "Hapus semuanya" },
            },
            {
              emoji: "🤞",
              text: { en: "Just hope it works", id: "Berharap saja berhasil" },
            },
          ],
          correctFixIndex: 0,
        },
      ],
    },
  ],
};
