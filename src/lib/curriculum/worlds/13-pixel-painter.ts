import type { WorldDef } from "../types";

export const world: WorldDef = {
  id: "pixel-painter",
  emoji: "🎨",
  color: "#0d9488",
  title: { en: "Pixel Painter", id: "Pelukis Piksel" },
  description: {
    en: "Paint pictures with loops inside loops — draw whole grids the smart way!",
    id: "Lukis gambar dengan perulangan di dalam perulangan — gambar seluruh kisi dengan cerdas!",
  },
  levels: [
    {
      id: "rows-of-color",
      emoji: "🖌️",
      color: "#0d9488",
      title: { en: "Rows of Color", id: "Baris Warna" },
      description: {
        en: "A loop paints a whole row of squares without repeating yourself.",
        id: "Perulangan melukis satu baris kotak tanpa mengulang-ulang.",
      },
      games: [
        {
          kind: "pattern",
          id: "px-row-pattern",
          emoji: "🟨",
          title: { en: "The Color Row", id: "Baris Warna" },
          instructions: {
            en: "The row alternates two colors. What comes next?",
            id: "Baris ini bergantian dua warna. Apa berikutnya?",
          },
          sequence: ["🟦", "🟨", "🟦", "🟨", "🟦"],
          options: ["🟦", "🟨"],
          answer: "🟨",
        },
        {
          kind: "choice",
          id: "px-smart-row",
          emoji: "🧠",
          title: { en: "Smart Painting", id: "Melukis Cerdas" },
          instructions: {
            en: "Pick the shortest way to paint a whole row.",
            id: "Pilih cara paling singkat melukis satu baris penuh.",
          },
          scenario: {
            en: "To paint a row of 6 blue squares, the smartest way is...",
            id: "Untuk melukis satu baris 6 kotak biru, cara paling cerdas adalah...",
          },
          options: [
            { emoji: "🔁", text: { en: "Repeat 6 times: paint blue", id: "Ulangi 6 kali: lukis biru" } },
            { emoji: "1️⃣", text: { en: "Paint blue just once", id: "Lukis biru sekali saja" } },
            { emoji: "🌈", text: { en: "Paint 6 different colors", id: "Lukis 6 warna berbeda" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "robot",
          id: "px-paint-row",
          emoji: "➡️",
          title: { en: "Paint the Wall", id: "Lukis Tembok" },
          instructions: {
            en: "Roll the painter across the row with ONE repeat block!",
            id: "Jalankan pelukis menyeberangi baris dengan SATU balok pengulang!",
          },
          cols: 5,
          rows: 3,
          start: { x: 0, y: 1 },
          goal: { x: 4, y: 1 },
          walls: [],
          palette: [
            { dx: 1, dy: 0, times: 1 },
            { dx: 1, dy: 0, times: 4 },
            { dx: 0, dy: -1, times: 1 },
          ],
          maxBlocks: 1,
        },
      ],
    },
    {
      id: "grids",
      emoji: "🔳",
      color: "#0f766e",
      title: { en: "Grids & Nested Loops", id: "Kisi & Perulangan Bersarang" },
      description: {
        en: "A loop inside a loop paints a whole grid — rows AND columns.",
        id: "Perulangan di dalam perulangan melukis seluruh kisi — baris DAN kolom.",
      },
      games: [
        {
          kind: "pattern",
          id: "px-checker",
          emoji: "🏁",
          title: { en: "Checkerboard", id: "Papan Catur" },
          instructions: {
            en: "The checker row keeps alternating. What comes next?",
            id: "Baris kotak-kotak terus bergantian. Apa berikutnya?",
          },
          sequence: ["🟥", "🟩", "🟥", "🟩", "🟥", "🟩", "🟥"],
          options: ["🟥", "🟩"],
          answer: "🟩",
        },
        {
          kind: "choice",
          id: "px-whole-grid",
          emoji: "🔢",
          title: { en: "The Whole Grid", id: "Seluruh Kisi" },
          instructions: {
            en: "Count the squares a nested loop paints.",
            id: "Hitung kotak yang dilukis perulangan bersarang.",
          },
          scenario: {
            en: "You loop over 3 rows, and for each row you paint 3 squares. How many squares in total?",
            id: "Kamu mengulang 3 baris, dan tiap baris melukis 3 kotak. Berapa total kotaknya?",
          },
          options: [
            { emoji: "9️⃣", text: { en: "9 squares", id: "9 kotak" } },
            { emoji: "6️⃣", text: { en: "6 squares", id: "6 kotak" } },
            { emoji: "3️⃣", text: { en: "3 squares", id: "3 kotak" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "choice",
          id: "px-loop-in-loop",
          emoji: "🔁",
          title: { en: "Loop in a Loop", id: "Perulangan dalam Perulangan" },
          instructions: {
            en: "Multiply the rows by the squares in each row.",
            id: "Kalikan jumlah baris dengan kotak di tiap baris.",
          },
          scenario: {
            en: "For each of 2 rows, you paint 4 squares. How many squares are painted in all?",
            id: "Untuk tiap 2 baris, kamu melukis 4 kotak. Berapa total kotak yang dilukis?",
          },
          options: [
            { emoji: "8️⃣", text: { en: "8 squares", id: "8 kotak" } },
            { emoji: "6️⃣", text: { en: "6 squares", id: "6 kotak" } },
            { emoji: "4️⃣", text: { en: "4 squares", id: "4 kotak" } },
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "pixel-art",
      emoji: "🖼️",
      color: "#115e59",
      title: { en: "Pixel Art", id: "Seni Piksel" },
      description: {
        en: "Put it all together and draw a real little picture!",
        id: "Gabungkan semuanya dan gambar sebuah lukisan kecil sungguhan!",
      },
      games: [
        {
          kind: "order",
          id: "px-draw-house",
          emoji: "🏠",
          title: { en: "Draw a House", id: "Gambar Rumah" },
          instructions: {
            en: "Put the drawing steps in a sensible order!",
            id: "Susun langkah menggambar dengan urutan yang masuk akal!",
          },
          items: [
            { emoji: "🟫", text: { en: "Draw the walls", id: "Gambar dindingnya" } },
            { emoji: "🔺", text: { en: "Add the roof", id: "Tambah atap" } },
            { emoji: "🚪", text: { en: "Add a door", id: "Tambah pintu" } },
            { emoji: "🪟", text: { en: "Add a window", id: "Tambah jendela" } },
          ],
        },
        {
          kind: "debug",
          id: "px-broken-stripe",
          emoji: "🐞",
          title: { en: "Broken Stripe", id: "Garis Rusak" },
          instructions: {
            en: "The stripe should go red, blue, red, blue... Tap the broken pixel!",
            id: "Garisnya harusnya merah, biru, merah, biru... Ketuk piksel yang rusak!",
          },
          steps: [
            { emoji: "🟥", text: { en: "Red", id: "Merah" } },
            { emoji: "🟦", text: { en: "Blue", id: "Biru" } },
            { emoji: "🟥", text: { en: "Red", id: "Merah" } },
            { emoji: "🟩", text: { en: "Green", id: "Hijau" } },
          ],
          wrongIndex: 3,
          fixOptions: [
            { emoji: "🟦", text: { en: "Blue", id: "Biru" } },
            { emoji: "🟨", text: { en: "Yellow", id: "Kuning" } },
            { emoji: "🟥", text: { en: "Red", id: "Merah" } },
          ],
          correctFixIndex: 0,
        },
        {
          kind: "robot",
          id: "px-draw-corner",
          emoji: "📐",
          title: { en: "Draw the Corner", id: "Gambar Sudut" },
          instructions: {
            en: "Paint an L-shape: across, then down — using just 2 repeat blocks!",
            id: "Lukis bentuk L: menyamping, lalu turun — hanya dengan 2 balok pengulang!",
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
  ],
};
