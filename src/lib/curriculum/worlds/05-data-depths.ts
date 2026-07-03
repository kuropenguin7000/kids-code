import type { WorldDef } from "../types";

export const world: WorldDef = {
  id: "data-depths",
  emoji: "🌊",
  color: "#0ea5e9",
  title: { en: "Data Depths", id: "Palung Data" },
  description: {
    en: "Sort, group and true-or-false — programmers are data wizards!",
    id: "Mengurutkan, mengelompokkan, dan benar-atau-salah — programmer adalah penyihir data!",
  },
  levels: [
    {
      id: "sorting",
      emoji: "📏",
      color: "#0284c7",
      title: { en: "Sort It Out", id: "Ayo Urutkan" },
      description: {
        en: "Computers love putting things in order — smallest to biggest!",
        id: "Komputer suka mengurutkan — dari yang terkecil sampai terbesar!",
      },
      games: [
        {
          kind: "order",
          id: "sort-sizes",
          emoji: "🐋",
          title: { en: "Ocean Lineup", id: "Barisan Laut" },
          instructions: {
            en: "Line up the sea friends from smallest to biggest!",
            id: "Urutkan teman-teman laut dari yang terkecil sampai terbesar!",
          },
          items: [
            { emoji: "🦐", text: { en: "Shrimp", id: "Udang" } },
            { emoji: "🐟", text: { en: "Fish", id: "Ikan" } },
            { emoji: "🐬", text: { en: "Dolphin", id: "Lumba-lumba" } },
            { emoji: "🐋", text: { en: "Whale", id: "Paus" } },
          ],
        },
        {
          kind: "choice",
          id: "sort-number",
          emoji: "🥇",
          title: { en: "First in Line", id: "Paling Depan" },
          instructions: {
            en: "Sorting means smallest first. Check every number before you pick!",
            id: "Mengurutkan berarti yang terkecil duluan. Periksa semua angka sebelum memilih!",
          },
          scenario: {
            en: "Robo sorts 7, 2 and 9 from smallest to biggest. Which number goes FIRST?",
            id: "Robo mengurutkan 7, 2, dan 9 dari terkecil ke terbesar. Angka mana yang PALING DEPAN?",
          },
          options: [
            { emoji: "2️⃣", text: { en: "2", id: "2" } },
            { emoji: "7️⃣", text: { en: "7", id: "7" } },
            { emoji: "9️⃣", text: { en: "9", id: "9" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "pattern",
          id: "sort-growing",
          emoji: "🪜",
          title: { en: "Counting by Twos", id: "Menghitung Dua-Dua" },
          instructions: {
            en: "The numbers grow by 2 each time. What comes next?",
            id: "Angkanya bertambah 2 setiap kali. Apa yang berikutnya?",
          },
          sequence: ["2️⃣", "4️⃣", "6️⃣", "8️⃣"],
          options: ["9️⃣", "🔟", "1️⃣"],
          answer: "🔟",
        },
      ],
    },
    {
      id: "grouping",
      emoji: "🗂️",
      color: "#0891b2",
      title: { en: "Group Alike", id: "Kelompokkan yang Mirip" },
      description: {
        en: "Putting similar things together makes big messes easy!",
        id: "Menyatukan yang mirip membuat kekacauan besar jadi mudah!",
      },
      games: [
        {
          kind: "choice",
          id: "group-fruit",
          emoji: "🥕",
          title: { en: "The Sorting Machine", id: "Mesin Pengelompok" },
          instructions: {
            en: "Robo groups similar things together. Help him pick the right box!",
            id: "Robo mengelompokkan barang yang mirip. Bantu dia memilih kotak yang tepat!",
          },
          scenario: {
            en: "Robo made a box for fruits: 🍎 🍌 🍇. A carrot 🥕 arrives. Where does it go?",
            id: "Robo membuat kotak untuk buah: 🍎 🍌 🍇. Sebuah wortel 🥕 datang. Ke mana ia pergi?",
          },
          options: [
            { emoji: "🍎", text: { en: "The fruit box", id: "Kotak buah" } },
            {
              emoji: "🥬",
              text: { en: "The vegetable box", id: "Kotak sayur" },
            },
            { emoji: "🧸", text: { en: "The toy box", id: "Kotak mainan" } },
          ],
          correctIndex: 1,
        },
        {
          kind: "debug",
          id: "group-bug",
          emoji: "🚗",
          title: { en: "One Doesn't Belong", id: "Ada yang Tidak Cocok" },
          instructions: {
            en: "Robo's ANIMAL group has a sneaky mistake. Tap the one that doesn't belong!",
            id: "Kelompok HEWAN milik Robo punya kesalahan licik. Ketuk yang tidak cocok!",
          },
          steps: [
            { emoji: "🐶", text: { en: "Dog", id: "Anjing" } },
            { emoji: "🐱", text: { en: "Cat", id: "Kucing" } },
            { emoji: "🚗", text: { en: "Car", id: "Mobil" } },
            { emoji: "🐰", text: { en: "Rabbit", id: "Kelinci" } },
          ],
          wrongIndex: 2,
          fixOptions: [
            { emoji: "🐹", text: { en: "Hamster", id: "Hamster" } },
            { emoji: "🍕", text: { en: "Pizza", id: "Pizza" } },
            { emoji: "✈️", text: { en: "Plane", id: "Pesawat" } },
          ],
          correctFixIndex: 0,
        },
        {
          kind: "order",
          id: "group-steps",
          emoji: "🧸",
          title: { en: "The Tidy-Up Program", id: "Program Beres-Beres" },
          instructions: {
            en: "Robo tidies toys the programmer way — by grouping! Put the steps in order.",
            id: "Robo membereskan mainan ala programmer — dengan mengelompokkan! Susun langkahnya.",
          },
          items: [
            {
              emoji: "🧺",
              text: { en: "Gather all the toys", id: "Kumpulkan semua mainan" },
            },
            {
              emoji: "👀",
              text: { en: "Look at each toy", id: "Perhatikan setiap mainan" },
            },
            {
              emoji: "🗂️",
              text: {
                en: "Put same kinds together",
                id: "Satukan yang sejenis",
              },
            },
            {
              emoji: "🏷️",
              text: { en: "Label each box", id: "Beri label tiap kotak" },
            },
          ],
        },
      ],
    },
    {
      id: "booleans",
      emoji: "✅",
      color: "#059669",
      title: { en: "True or False", id: "Benar atau Salah" },
      description: {
        en: "Computers answer every question with just two words: true or false!",
        id: "Komputer menjawab setiap pertanyaan dengan dua kata saja: benar atau salah!",
      },
      games: [
        {
          kind: "choice",
          id: "bool-number",
          emoji: "🧐",
          title: { en: "The Truth Checker", id: "Pemeriksa Kebenaran" },
          instructions: {
            en: "Computers check facts. Is this one true or false?",
            id: "Komputer memeriksa fakta. Yang ini benar atau salah?",
          },
          scenario: {
            en: 'Robo checks: "3 is bigger than 5". True or false?',
            id: 'Robo memeriksa: "3 lebih besar dari 5". Benar atau salah?',
          },
          options: [
            { emoji: "✅", text: { en: "True", id: "Benar" } },
            { emoji: "❌", text: { en: "False", id: "Salah" } },
            { emoji: "🤷", text: { en: "Maybe", id: "Mungkin" } },
          ],
          correctIndex: 1,
        },
        {
          kind: "choice",
          id: "bool-word",
          emoji: "🔤",
          title: { en: "Word Check", id: "Cek Kata" },
          instructions: {
            en: "Count carefully — the computer always does!",
            id: "Hitung dengan teliti — komputer selalu begitu!",
          },
          scenario: {
            en: 'Robo checks: "The word CAT has 3 letters". True or false?',
            id: 'Robo memeriksa: "Kata CAT punya 3 huruf". Benar atau salah?',
          },
          options: [
            { emoji: "✅", text: { en: "True", id: "Benar" } },
            { emoji: "❌", text: { en: "False", id: "Salah" } },
            { emoji: "🤷", text: { en: "Maybe", id: "Mungkin" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "debug",
          id: "bool-bug",
          emoji: "☀️",
          title: { en: "The Sunny Day Mix-Up", id: "Kekeliruan Hari Cerah" },
          instructions: {
            en: '"It is sunny" is TRUE — so one step makes no sense. Find it!',
            id: '"Hari ini cerah" itu BENAR — jadi ada satu langkah yang aneh. Temukan!',
          },
          steps: [
            {
              emoji: "☀️",
              text: {
                en: "Check: is it sunny? TRUE",
                id: "Periksa: apakah cerah? BENAR",
              },
            },
            {
              emoji: "🧥",
              text: {
                en: "Put on a thick raincoat",
                id: "Pakai jas hujan tebal",
              },
            },
            {
              emoji: "🕶️",
              text: { en: "Wear sunglasses", id: "Pakai kacamata hitam" },
            },
            {
              emoji: "🚪",
              text: { en: "Go out and play", id: "Keluar dan bermain" },
            },
          ],
          wrongIndex: 1,
          fixOptions: [
            {
              emoji: "👕",
              text: { en: "Wear a light t-shirt", id: "Pakai kaus tipis" },
            },
            {
              emoji: "☔",
              text: { en: "Open an umbrella", id: "Buka payung" },
            },
            {
              emoji: "🧣",
              text: { en: "Wrap up in a scarf", id: "Pakai syal tebal" },
            },
          ],
          correctFixIndex: 0,
        },
      ],
    },
  ],
};
