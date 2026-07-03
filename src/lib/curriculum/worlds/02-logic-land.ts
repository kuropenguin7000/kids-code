import type { WorldDef } from "../types";

export const world: WorldDef = {
  id: "logic-land",
  emoji: "🧠",
  color: "#8b5cf6",
  title: { en: "Logic Land", id: "Negeri Logika" },
  description: {
    en: "Loops, if-then rules and bug hunting — the thinking tools of every programmer.",
    id: "Perulangan, aturan jika-maka, dan berburu bug — alat berpikir setiap programmer.",
  },
  levels: [
    {
      id: "loops",
      emoji: "🔁",
      color: "#8b5cf6",
      title: { en: "Repeat Power", id: "Kekuatan Mengulang" },
      description: {
        en: "Why say it five times when you can say it once? Loops repeat things for you!",
        id: "Kenapa bilang lima kali kalau bisa sekali saja? Perulangan mengulang untukmu!",
      },
      games: [
        {
          kind: "choice",
          id: "loop-song",
          emoji: "🎤",
          title: { en: "The Robot Song", id: "Lagu Robot" },
          instructions: {
            en: "Loops say things again and again — the short way.",
            id: "Perulangan mengucapkan sesuatu berkali-kali — dengan cara singkat.",
          },
          scenario: {
            en: 'Robo sings: "La La La La" (4 times). What is the SHORTEST way to write his song?',
            id: 'Robo bernyanyi: "La La La La" (4 kali). Mana cara PALING SINGKAT menulis lagunya?',
          },
          options: [
            {
              emoji: "🔁",
              text: { en: "Repeat 4 times: La", id: "Ulangi 4 kali: La" },
            },
            {
              emoji: "📜",
              text: { en: "La La La La La La", id: "La La La La La La" },
            },
            {
              emoji: "🔂",
              text: { en: "Repeat 2 times: La", id: "Ulangi 2 kali: La" },
            },
          ],
          correctIndex: 0,
        },
        {
          kind: "robot",
          id: "loop-corridor",
          emoji: "🏃",
          title: { en: "The Long Hallway", id: "Lorong Panjang" },
          instructions: {
            en: "The star is 5 steps away, but you may only use 1 block. Pick the repeat block!",
            id: "Bintangnya 5 langkah jauhnya, tapi kamu hanya boleh pakai 1 balok. Pilih balok pengulang!",
          },
          cols: 6,
          rows: 3,
          start: { x: 0, y: 1 },
          goal: { x: 5, y: 1 },
          walls: [],
          palette: [
            { dx: 1, dy: 0, times: 1 },
            { dx: 1, dy: 0, times: 5 },
            { dx: 0, dy: -1, times: 1 },
          ],
          maxBlocks: 1,
        },
        {
          kind: "robot",
          id: "loop-stairs",
          emoji: "⛰️",
          title: { en: "Mountain Path", id: "Jalur Gunung" },
          instructions: {
            en: "Reach the star with only 2 blocks. Repeat blocks are your superpower!",
            id: "Capai bintang hanya dengan 2 balok. Balok pengulang adalah kekuatan supermu!",
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
      ],
    },
    {
      id: "conditionals",
      emoji: "🚦",
      color: "#ec4899",
      title: { en: "If This, Then That", id: "Jika Ini, Maka Itu" },
      description: {
        en: "Computers make choices with rules: IF something happens, THEN do something.",
        id: "Komputer memilih dengan aturan: JIKA sesuatu terjadi, MAKA lakukan sesuatu.",
      },
      games: [
        {
          kind: "choice",
          id: "cond-rain",
          emoji: "🌧️",
          title: { en: "Rainy Day Rule", id: "Aturan Hari Hujan" },
          instructions: {
            en: "Finish the rule so Robo stays dry!",
            id: "Lengkapi aturannya supaya Robo tetap kering!",
          },
          scenario: {
            en: "IF it is raining, THEN Robo should...",
            id: "JIKA hujan turun, MAKA Robo sebaiknya...",
          },
          options: [
            {
              emoji: "☂️",
              text: { en: "Open the umbrella", id: "Buka payung" },
            },
            {
              emoji: "🕶️",
              text: { en: "Wear sunglasses", id: "Pakai kacamata hitam" },
            },
            {
              emoji: "🏖️",
              text: { en: "Go to the beach", id: "Pergi ke pantai" },
            },
          ],
          correctIndex: 0,
        },
        {
          kind: "choice",
          id: "cond-light",
          emoji: "🚥",
          title: { en: "Traffic Light Rule", id: "Aturan Lampu Lalu Lintas" },
          instructions: {
            en: "Robo is driving. Help him follow the rule!",
            id: "Robo sedang menyetir. Bantu dia mengikuti aturan!",
          },
          scenario: {
            en: "IF the traffic light is red, THEN Robo must...",
            id: "JIKA lampu lalu lintas merah, MAKA Robo harus...",
          },
          options: [
            { emoji: "🏎️", text: { en: "Drive faster", id: "Tancap gas" } },
            {
              emoji: "✋",
              text: { en: "Stop and wait", id: "Berhenti dan menunggu" },
            },
            {
              emoji: "🎵",
              text: { en: "Honk a song", id: "Klakson sambil bernyanyi" },
            },
          ],
          correctIndex: 1,
        },
        {
          kind: "choice",
          id: "cond-sort",
          emoji: "🍋",
          title: { en: "The Fruit Sorter", id: "Mesin Penyortir Buah" },
          instructions: {
            en: "Robo sorts fruit with a rule: IF the fruit is yellow, THEN put it in the yellow box, ELSE the red box.",
            id: "Robo menyortir buah dengan aturan: JIKA buahnya kuning, MAKA masukkan kotak kuning, SELAIN ITU kotak merah.",
          },
          scenario: {
            en: "A lemon 🍋 arrives on the belt. Where does it go?",
            id: "Sebuah lemon 🍋 datang di ban berjalan. Ke mana ia pergi?",
          },
          options: [
            { emoji: "🟥", text: { en: "The red box", id: "Kotak merah" } },
            { emoji: "🟨", text: { en: "The yellow box", id: "Kotak kuning" } },
            { emoji: "🗑️", text: { en: "The trash can", id: "Tempat sampah" } },
          ],
          correctIndex: 1,
        },
      ],
    },
    {
      id: "debugging",
      emoji: "🐞",
      color: "#ef4444",
      title: { en: "Bug Hunters", id: "Pemburu Bug" },
      description: {
        en: 'When a program goes wrong, programmers hunt the mistake — the "bug" — and fix it!',
        id: 'Saat program salah, programmer memburu kesalahannya — si "bug" — dan memperbaikinya!',
      },
      games: [
        {
          kind: "debug",
          id: "bug-flower",
          emoji: "🥤",
          title: { en: "The Thirsty Flower", id: "Bunga yang Kehausan" },
          instructions: {
            en: "Robo's flower plan has one wrong step. Tap the step that is wrong!",
            id: "Rencana bunga Robo punya satu langkah salah. Ketuk langkah yang salah!",
          },
          steps: [
            { emoji: "🕳️", text: { en: "Dig a hole", id: "Gali lubang" } },
            {
              emoji: "🌱",
              text: { en: "Drop in the seed", id: "Masukkan biji" },
            },
            {
              emoji: "🪨",
              text: { en: "Cover with soil", id: "Tutup dengan tanah" },
            },
            {
              emoji: "🧃",
              text: { en: "Water it with juice", id: "Siram dengan jus" },
            },
          ],
          wrongIndex: 3,
          fixOptions: [
            {
              emoji: "💧",
              text: { en: "Water it with water", id: "Siram dengan air" },
            },
            {
              emoji: "🍬",
              text: { en: "Cover it with candy", id: "Taburi permen" },
            },
            {
              emoji: "🎤",
              text: { en: "Sing it a song", id: "Nyanyikan lagu" },
            },
          ],
          correctFixIndex: 0,
        },
        {
          kind: "debug",
          id: "bug-cookie",
          emoji: "🍪",
          title: { en: "The Cookie Mission", id: "Misi Kue" },
          instructions: {
            en: "Robo wants the cookie on the HIGH shelf, but one step is wrong. Find it!",
            id: "Robo mau kue di rak yang TINGGI, tapi satu langkah salah. Temukan!",
          },
          steps: [
            {
              emoji: "🚶",
              text: { en: "Walk to the shelf", id: "Jalan ke rak" },
            },
            { emoji: "🧊", text: { en: "Open the fridge", id: "Buka kulkas" } },
            { emoji: "🙋", text: { en: "Reach up high", id: "Raih ke atas" } },
            {
              emoji: "🍪",
              text: { en: "Grab the cookie", id: "Ambil kuenya" },
            },
          ],
          wrongIndex: 1,
          fixOptions: [
            { emoji: "😴", text: { en: "Take a nap", id: "Tidur siang" } },
            {
              emoji: "🪑",
              text: { en: "Climb on the stool", id: "Naik ke bangku" },
            },
            { emoji: "📺", text: { en: "Watch TV", id: "Nonton TV" } },
          ],
          correctFixIndex: 1,
        },
        {
          kind: "debug",
          id: "bug-pattern",
          emoji: "🎨",
          title: { en: "The Broken Pattern", id: "Pola yang Rusak" },
          instructions: {
            en: "This pattern should go red, blue, red, blue... but one spot is broken. Tap the bug!",
            id: "Pola ini harusnya merah, biru, merah, biru... tapi satu titik rusak. Ketuk bug-nya!",
          },
          steps: [
            { emoji: "🔴", text: { en: "Red", id: "Merah" } },
            { emoji: "🔵", text: { en: "Blue", id: "Biru" } },
            { emoji: "🔴", text: { en: "Red", id: "Merah" } },
            { emoji: "🟢", text: { en: "Green", id: "Hijau" } },
            { emoji: "🔴", text: { en: "Red", id: "Merah" } },
          ],
          wrongIndex: 3,
          fixOptions: [
            { emoji: "🔵", text: { en: "Blue", id: "Biru" } },
            { emoji: "🟡", text: { en: "Yellow", id: "Kuning" } },
            { emoji: "🔴", text: { en: "Red", id: "Merah" } },
          ],
          correctFixIndex: 0,
        },
      ],
    },
  ],
};
