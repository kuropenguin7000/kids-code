import type { WorldDef } from "../types";

export const world: WorldDef = {
  id: "nesting-nook",
  emoji: "🪆",
  color: "#9a3412",
  title: { en: "Nesting Nook", id: "Pojok Bersarang" },
  description: {
    en: "Things inside things inside things! Discover how a pattern can contain itself.",
    id: "Benda di dalam benda di dalam benda! Temukan cara pola memuat dirinya sendiri.",
  },
  levels: [
    {
      id: "dolls-in-dolls",
      emoji: "🪆",
      color: "#9a3412",
      title: { en: "Dolls in Dolls", id: "Boneka dalam Boneka" },
      description: {
        en: "Some things hold smaller copies of themselves — open them up!",
        id: "Beberapa benda memuat salinan kecil dirinya — buka satu per satu!",
      },
      games: [
        {
          kind: "order",
          id: "nk-open-dolls",
          emoji: "🪆",
          title: { en: "Open the Dolls", id: "Buka Bonekanya" },
          instructions: {
            en: "Open the nesting dolls from biggest to tiniest!",
            id: "Buka boneka bersarang dari terbesar ke terkecil!",
          },
          items: [
            { emoji: "🪆", text: { en: "Biggest doll", id: "Boneka terbesar" } },
            { emoji: "🪆", text: { en: "Medium doll", id: "Boneka sedang" } },
            { emoji: "🪆", text: { en: "Small doll", id: "Boneka kecil" } },
            { emoji: "🪆", text: { en: "Tiny doll", id: "Boneka mungil" } },
          ],
        },
        {
          kind: "choice",
          id: "nk-inside-smallest",
          emoji: "🎁",
          title: { en: "Inside the Smallest", id: "Isi yang Terkecil" },
          instructions: {
            en: "Follow the boxes all the way in.",
            id: "Ikuti kotaknya sampai ke dalam.",
          },
          scenario: {
            en: "A big box holds a medium box, which holds a small box, which holds a 🎁. What is inside the smallest box?",
            id: "Kotak besar memuat kotak sedang, yang memuat kotak kecil, yang memuat 🎁. Apa isi kotak terkecil?",
          },
          options: [
            { emoji: "🎁", text: { en: "The gift", id: "Hadiahnya" } },
            { emoji: "📦", text: { en: "Another big box", id: "Kotak besar lagi" } },
            { emoji: "🕳️", text: { en: "Nothing at all", id: "Tidak ada apa-apa" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "pattern",
          id: "nk-layers",
          emoji: "🧅",
          title: { en: "The Layers", id: "Lapisan" },
          instructions: {
            en: "The layers repeat brown, green, blue. What comes next?",
            id: "Lapisannya berulang cokelat, hijau, biru. Apa berikutnya?",
          },
          sequence: ["🟫", "🟩", "🟦", "🟫", "🟩"],
          options: ["🟫", "🟩", "🟦"],
          answer: "🟦",
        },
      ],
    },
    {
      id: "repeat-smaller",
      emoji: "🔁",
      color: "#c2410c",
      title: { en: "Repeat Smaller", id: "Ulangi Lebih Kecil" },
      description: {
        en: "A rule can use itself on a smaller job — that's recursion!",
        id: "Sebuah aturan bisa memakai dirinya pada tugas lebih kecil — itulah rekursi!",
      },
      games: [
        {
          kind: "choice",
          id: "nk-repeating-rule",
          emoji: "🌳",
          title: { en: "The Repeating Rule", id: "Aturan yang Berulang" },
          instructions: {
            en: "Notice which rule draws the smaller tree.",
            id: "Perhatikan aturan mana yang menggambar pohon lebih kecil.",
          },
          scenario: {
            en: "Magic rule: \"to draw a tree, draw a branch, then draw a SMALLER tree on it.\" What draws the smaller tree?",
            id: "Aturan ajaib: \"untuk menggambar pohon, gambar dahan, lalu gambar pohon LEBIH KECIL di atasnya.\" Apa yang menggambar pohon kecil itu?",
          },
          options: [
            { emoji: "🔁", text: { en: "The same rule, used again", id: "Aturan yang sama, dipakai lagi" } },
            { emoji: "🆕", text: { en: "A totally different rule", id: "Aturan yang berbeda" } },
            { emoji: "🚫", text: { en: "No rule at all", id: "Tanpa aturan" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "choice",
          id: "nk-countdown",
          emoji: "🔢",
          title: { en: "Countdown Rule", id: "Aturan Hitung Mundur" },
          instructions: {
            en: "The robot repeats the same shrinking step. What does it say?",
            id: "Robot mengulang langkah yang mengecil. Apa yang ia ucapkan?",
          },
          scenario: {
            en: "A robot says a number, then the number minus 1, and repeats until 0. It starts at 3. What does it say?",
            id: "Robot menyebut angka, lalu angka dikurang 1, dan mengulang sampai 0. Ia mulai dari 3. Apa yang ia ucapkan?",
          },
          options: [
            { emoji: "⬇️", text: { en: "3, 2, 1, 0", id: "3, 2, 1, 0" } },
            { emoji: "3️⃣", text: { en: "Just 3", id: "Hanya 3" } },
            { emoji: "⬆️", text: { en: "0, 1, 2, 3", id: "0, 1, 2, 3" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "debug",
          id: "nk-endless",
          emoji: "🐞",
          title: { en: "Endless Loop", id: "Perulangan Tanpa Akhir" },
          instructions: {
            en: "A repeating rule needs a place to stop. One step is missing that — tap it!",
            id: "Aturan berulang butuh titik berhenti. Satu langkah melewatkannya — ketuk!",
          },
          steps: [
            { emoji: "3️⃣", text: { en: "Start at 3", id: "Mulai dari 3" } },
            { emoji: "➖", text: { en: "Say it, then subtract 1", id: "Sebut, lalu kurangi 1" } },
            { emoji: "♾️", text: { en: "Keep going forever", id: "Terus tanpa henti" } },
            { emoji: "🥶", text: { en: "The robot freezes", id: "Robot membeku" } },
          ],
          wrongIndex: 2,
          fixOptions: [
            { emoji: "🛑", text: { en: "Stop when you reach 0", id: "Berhenti saat mencapai 0" } },
            { emoji: "⏩", text: { en: "Go even faster", id: "Melaju lebih cepat" } },
            { emoji: "💯", text: { en: "Start at 100 instead", id: "Mulai dari 100 saja" } },
          ],
          correctFixIndex: 0,
        },
      ],
    },
    {
      id: "fractals",
      emoji: "❄️",
      color: "#7c2d12",
      title: { en: "Fractals!", id: "Fraktal!" },
      description: {
        en: "Shapes made of smaller copies of themselves — the same at any size.",
        id: "Bentuk yang tersusun dari salinan kecil dirinya — sama di segala ukuran.",
      },
      games: [
        {
          kind: "pattern",
          id: "nk-fractal-branch",
          emoji: "🌿",
          title: { en: "Fractal Branch", id: "Dahan Fraktal" },
          instructions: {
            en: "Zoom in: tree, branch, leaf, and repeat. What comes next?",
            id: "Perbesar: pohon, dahan, daun, lalu ulang. Apa berikutnya?",
          },
          sequence: ["🌳", "🌿", "🍃", "🌳", "🌿"],
          options: ["🌳", "🌿", "🍃"],
          answer: "🍃",
        },
        {
          kind: "order",
          id: "nk-build-fractal",
          emoji: "🔺",
          title: { en: "Build a Fractal", id: "Bangun Fraktal" },
          instructions: {
            en: "Put the fractal-drawing steps in order!",
            id: "Susun langkah menggambar fraktal!",
          },
          items: [
            { emoji: "🔺", text: { en: "Draw a big triangle", id: "Gambar segitiga besar" } },
            { emoji: "🔻", text: { en: "Add smaller triangles on its sides", id: "Tambah segitiga kecil di sisinya" } },
            { emoji: "🔁", text: { en: "Do it again on those", id: "Ulangi pada yang itu" } },
            { emoji: "✨", text: { en: "A fractal appears!", id: "Fraktal pun muncul!" } },
          ],
        },
        {
          kind: "choice",
          id: "nk-same-shape",
          emoji: "🔍",
          title: { en: "Same Shape, Any Size", id: "Bentuk Sama, Segala Ukuran" },
          instructions: {
            en: "Think about what a branch looks like on its own.",
            id: "Pikirkan seperti apa sebuah dahan jika berdiri sendiri.",
          },
          scenario: {
            en: "A fractal looks the SAME zoomed in or out. A tree's big branches split into smaller branches that look like...",
            id: "Fraktal tampak SAMA saat diperbesar atau diperkecil. Dahan besar pohon bercabang jadi dahan kecil yang tampak seperti...",
          },
          options: [
            { emoji: "🌳", text: { en: "The whole tree, but smaller", id: "Seluruh pohon, tapi lebih kecil" } },
            { emoji: "⚪", text: { en: "A plain circle", id: "Lingkaran biasa" } },
            { emoji: "🕳️", text: { en: "Nothing at all", id: "Tidak seperti apa pun" } },
          ],
          correctIndex: 0,
        },
      ],
    },
  ],
};
