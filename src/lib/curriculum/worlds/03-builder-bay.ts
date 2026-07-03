import type { WorldDef } from "../types";

export const world: WorldDef = {
  id: "builder-bay",
  emoji: "🏗️",
  color: "#06b6d4",
  title: { en: "Builder Bay", id: "Teluk Pembangun" },
  description: {
    en: "Memory boxes, slicing big problems and magic recipes — build like a pro.",
    id: "Kotak ingatan, memecah masalah besar, dan resep ajaib — membangun seperti profesional.",
  },
  levels: [
    {
      id: "variables",
      emoji: "📦",
      color: "#06b6d4",
      title: { en: "Memory Boxes", id: "Kotak Ingatan" },
      description: {
        en: "Computers remember things in labeled boxes called variables.",
        id: "Komputer mengingat sesuatu dalam kotak berlabel bernama variabel.",
      },
      games: [
        {
          kind: "choice",
          id: "var-apples",
          emoji: "🍎",
          title: { en: "The Apple Box", id: "Kotak Apel" },
          instructions: {
            en: "Boxes can hold numbers — and the numbers can change!",
            id: "Kotak bisa menyimpan angka — dan angkanya bisa berubah!",
          },
          scenario: {
            en: "Robo's box called 'apples' holds 3 apples. He puts in 2 more. What is in the box now?",
            id: "Kotak Robo bernama 'apel' berisi 3 apel. Ia memasukkan 2 lagi. Sekarang isi kotaknya berapa?",
          },
          options: [
            { emoji: "🍎", text: { en: "5 apples", id: "5 apel" } },
            { emoji: "🤔", text: { en: "3 apples", id: "3 apel" } },
            { emoji: "😵", text: { en: "32 apples", id: "32 apel" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "choice",
          id: "var-name",
          emoji: "🏷️",
          title: { en: "The Name Tag", id: "Label Nama" },
          instructions: {
            en: "Boxes can hold words too. Robo uses the box's CONTENTS, not its name!",
            id: "Kotak juga bisa menyimpan kata. Robo memakai ISI kotaknya, bukan namanya!",
          },
          scenario: {
            en: 'A box called \'name\' holds the word "Budi". Robo says: "Hello " + name. What does he say?',
            id: 'Kotak bernama \'name\' berisi kata "Budi". Robo mengucapkan: "Hello " + name. Apa yang ia ucapkan?',
          },
          options: [
            { emoji: "🗣️", text: { en: '"Hello name"', id: '"Hello name"' } },
            { emoji: "👋", text: { en: '"Hello Budi"', id: '"Hello Budi"' } },
            { emoji: "🤖", text: { en: '"Budi Budi"', id: '"Budi Budi"' } },
          ],
          correctIndex: 1,
        },
        {
          kind: "choice",
          id: "var-score",
          emoji: "🏆",
          title: { en: "The Score Counter", id: "Penghitung Skor" },
          instructions: {
            en: "This is how games count points — a box that keeps changing!",
            id: "Beginilah cara game menghitung poin — kotak yang terus berubah!",
          },
          scenario: {
            en: "The box 'score' starts at 0. Robo wins 10 points, then 10 more. What is in the score box?",
            id: "Kotak 'score' mulai dari 0. Robo menang 10 poin, lalu 10 lagi. Berapa isi kotak score?",
          },
          options: [
            { emoji: "🔟", text: { en: "10", id: "10" } },
            { emoji: "0️⃣", text: { en: "0", id: "0" } },
            { emoji: "💯", text: { en: "20", id: "20" } },
          ],
          correctIndex: 2,
        },
      ],
    },
    {
      id: "decomposition",
      emoji: "🧱",
      color: "#f97316",
      title: {
        en: "Big Problems, Small Pieces",
        id: "Masalah Besar, Potongan Kecil",
      },
      description: {
        en: "Programmers break big problems into small, easy steps.",
        id: "Programmer memecah masalah besar menjadi langkah-langkah kecil yang mudah.",
      },
      games: [
        {
          kind: "order",
          id: "dec-dog",
          emoji: "🐶",
          title: { en: "Wash the Dog", id: "Memandikan Anjing" },
          instructions: {
            en: '"Wash the dog" is a BIG job. Break it into small steps in the right order!',
            id: '"Memandikan anjing" itu tugas BESAR. Pecah menjadi langkah kecil dengan urutan yang benar!',
          },
          items: [
            {
              emoji: "🛁",
              text: { en: "Fill the tub", id: "Isi bak dengan air" },
            },
            {
              emoji: "🐕",
              text: { en: "Put the dog in", id: "Masukkan anjingnya" },
            },
            {
              emoji: "🧼",
              text: { en: "Scrub with soap", id: "Gosok dengan sabun" },
            },
            {
              emoji: "🧺",
              text: { en: "Dry with a towel", id: "Keringkan dengan handuk" },
            },
          ],
        },
        {
          kind: "choice",
          id: "dec-house",
          emoji: "🏠",
          title: { en: "Slice the Problem", id: "Potong Masalahnya" },
          instructions: {
            en: "When a problem feels too big, programmers slice it up!",
            id: "Saat masalah terasa terlalu besar, programmer memotong-motongnya!",
          },
          scenario: {
            en: "Robo must clean the WHOLE house — it feels impossible! What is the smart programmer move?",
            id: "Robo harus membersihkan SELURUH rumah — rasanya mustahil! Apa langkah cerdas ala programmer?",
          },
          options: [
            {
              emoji: "🍰",
              text: {
                en: "Split it: one room at a time",
                id: "Pecah: satu ruangan demi satu",
              },
            },
            {
              emoji: "🌪️",
              text: {
                en: "Do everything at once",
                id: "Kerjakan semuanya sekaligus",
              },
            },
            {
              emoji: "😴",
              text: { en: "Give up and nap", id: "Menyerah lalu tidur" },
            },
          ],
          correctIndex: 0,
        },
        {
          kind: "order",
          id: "dec-rocket",
          emoji: "🚀",
          title: { en: "The Space Mission", id: "Misi Luar Angkasa" },
          instructions: {
            en: '"Fly to space" = four small missions. Put them in order!',
            id: '"Terbang ke luar angkasa" = empat misi kecil. Susun urutannya!',
          },
          items: [
            {
              emoji: "🔧",
              text: { en: "Build the rocket", id: "Rakit roketnya" },
            },
            {
              emoji: "⛽",
              text: { en: "Fill up the fuel", id: "Isi bahan bakarnya" },
            },
            {
              emoji: "🔢",
              text: { en: "Count down 3, 2, 1", id: "Hitung mundur 3, 2, 1" },
            },
            { emoji: "🌌", text: { en: "Blast off!", id: "Meluncur!" } },
          ],
        },
      ],
    },
    {
      id: "functions",
      emoji: "🧙",
      color: "#14b8a6",
      title: { en: "Recipe Magic", id: "Sihir Resep" },
      description: {
        en: "Give a group of steps a name and reuse it — programmers call these functions!",
        id: "Beri nama untuk sekumpulan langkah dan pakai lagi — programmer menyebutnya fungsi!",
      },
      games: [
        {
          kind: "choice",
          id: "fun-dance",
          emoji: "🕺",
          title: { en: "The Magic Word", id: "Kata Ajaib" },
          instructions: {
            en: "A recipe (function) is steps with a name. Say the name — the steps happen!",
            id: "Resep (fungsi) adalah langkah-langkah yang punya nama. Sebut namanya — langkahnya terjadi!",
          },
          scenario: {
            en: "The recipe 'happyDance' = wag tail, spin around, bark twice. What happens when you say: happyDance?",
            id: "Resep 'happyDance' = goyang ekor, berputar, menggonggong dua kali. Apa yang terjadi saat kamu menyebut: happyDance?",
          },
          options: [
            {
              emoji: "🎉",
              text: {
                en: "Wag, spin, and bark twice",
                id: "Goyang, berputar, dan menggonggong dua kali",
              },
            },
            {
              emoji: "🐕",
              text: { en: "Only one bark", id: "Hanya satu gonggongan" },
            },
            {
              emoji: "🪨",
              text: { en: "Nothing at all", id: "Tidak terjadi apa-apa" },
            },
          ],
          correctIndex: 0,
        },
        {
          kind: "choice",
          id: "fun-greet",
          emoji: "🫖",
          title: { en: "Recipe with Ingredients", id: "Resep dengan Bahan" },
          instructions: {
            en: "Recipes can take ingredients! greet(name) uses whatever name you hand it.",
            id: "Resep bisa menerima bahan! greet(nama) memakai nama apa pun yang kamu berikan.",
          },
          scenario: {
            en: 'The recipe greet(name) says "Hello " + name. What does greet("Sari") do?',
            id: 'Resep greet(nama) mengucapkan "Hello " + nama. Apa yang dilakukan greet("Sari")?',
          },
          options: [
            {
              emoji: "🗣️",
              text: { en: 'Says "Hello name"', id: 'Mengucapkan "Hello name"' },
            },
            {
              emoji: "🍵",
              text: { en: "Makes a cup of tea", id: "Membuat secangkir teh" },
            },
            {
              emoji: "👋",
              text: { en: 'Says "Hello Sari"', id: 'Mengucapkan "Hello Sari"' },
            },
          ],
          correctIndex: 2,
        },
        {
          kind: "debug",
          id: "fun-cat",
          emoji: "😺",
          title: { en: "The Broken Recipe", id: "Resep yang Rusak" },
          instructions: {
            en: "The recipe 'feedTheCat' has a bug. Tap the step that is wrong!",
            id: "Resep 'feedTheCat' punya bug. Ketuk langkah yang salah!",
          },
          steps: [
            { emoji: "🥫", text: { en: "Open the can", id: "Buka kalengnya" } },
            {
              emoji: "🥣",
              text: {
                en: "Pour food into the bowl",
                id: "Tuang makanan ke mangkuk",
              },
            },
            {
              emoji: "🐶",
              text: { en: "Call the dog", id: "Panggil anjingnya" },
            },
            {
              emoji: "😺",
              text: { en: "Watch the cat eat", id: "Lihat kucingnya makan" },
            },
          ],
          wrongIndex: 2,
          fixOptions: [
            {
              emoji: "🐟",
              text: { en: "Call the fish", id: "Panggil ikannya" },
            },
            {
              emoji: "🐱",
              text: { en: "Call the cat", id: "Panggil kucingnya" },
            },
            {
              emoji: "🙈",
              text: { en: "Hide the bowl", id: "Sembunyikan mangkuknya" },
            },
          ],
          correctFixIndex: 1,
        },
      ],
    },
  ],
};
