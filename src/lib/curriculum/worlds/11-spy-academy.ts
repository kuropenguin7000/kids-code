import type { WorldDef } from "../types";

export const world: WorldDef = {
  id: "spy-academy",
  emoji: "🕵️",
  color: "#4338ca",
  title: { en: "Spy Academy", id: "Akademi Mata-Mata" },
  description: {
    en: "Crack secret codes! Encode and decode hidden messages like a real spy.",
    id: "Pecahkan kode rahasia! Sandikan dan pecahkan pesan tersembunyi seperti mata-mata sungguhan.",
  },
  levels: [
    {
      id: "secret-symbols",
      emoji: "🔣",
      color: "#4338ca",
      title: { en: "Secret Symbols", id: "Simbol Rahasia" },
      description: {
        en: "In a code, each letter is swapped for a secret symbol. Learn to swap them back!",
        id: "Dalam kode, setiap huruf ditukar dengan simbol rahasia. Pelajari cara menukarnya kembali!",
      },
      games: [
        {
          kind: "choice",
          id: "spy-symbol-decode",
          emoji: "🍌",
          title: { en: "Decode the Symbol", id: "Pecahkan Simbol" },
          instructions: {
            en: "Use the secret key to translate the symbol.",
            id: "Pakai kunci rahasia untuk menerjemahkan simbol.",
          },
          scenario: {
            en: "Secret key: 🍎 = A, 🍌 = B, 🍒 = C. What letter does 🍌 mean?",
            id: "Kunci rahasia: 🍎 = A, 🍌 = B, 🍒 = C. Huruf apa arti 🍌?",
          },
          options: [
            { emoji: "🅱", text: { en: "B", id: "B" } },
            { emoji: "🅰", text: { en: "A", id: "A" } },
            { emoji: "🅲", text: { en: "C", id: "C" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "choice",
          id: "spy-shift",
          emoji: "➡️",
          title: { en: "The Shifted Letter", id: "Huruf yang Bergeser" },
          instructions: {
            en: "Every letter moves forward by one. Follow the shift!",
            id: "Setiap huruf maju satu. Ikuti pergeserannya!",
          },
          scenario: {
            en: "In this code each letter moves forward by 1: A becomes B, B becomes C. What does C become?",
            id: "Di kode ini setiap huruf maju 1: A jadi B, B jadi C. C jadi apa?",
          },
          options: [
            { emoji: "🇩", text: { en: "D", id: "D" } },
            { emoji: "🇧", text: { en: "B", id: "B" } },
            { emoji: "🇦", text: { en: "A", id: "A" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "order",
          id: "spy-send",
          emoji: "📨",
          title: { en: "Send a Secret", id: "Kirim Rahasia" },
          instructions: {
            en: "Put the secret-message steps in the right order!",
            id: "Susun langkah mengirim pesan rahasia dengan benar!",
          },
          items: [
            { emoji: "✍️", text: { en: "Write the message", id: "Tulis pesannya" } },
            { emoji: "🔒", text: { en: "Lock it with the code", id: "Kunci dengan kode" } },
            { emoji: "📨", text: { en: "Send it to your friend", id: "Kirim ke temanmu" } },
            { emoji: "🔓", text: { en: "Friend unlocks it", id: "Teman membukanya" } },
          ],
        },
      ],
    },
    {
      id: "number-codes",
      emoji: "🔢",
      color: "#4f46e5",
      title: { en: "Number Codes", id: "Kode Angka" },
      description: {
        en: "Turn letters into numbers and back — a spy's favourite trick.",
        id: "Ubah huruf jadi angka dan sebaliknya — trik favorit mata-mata.",
      },
      games: [
        {
          kind: "choice",
          id: "spy-num-letter",
          emoji: "🔢",
          title: { en: "Letters to Numbers", id: "Huruf jadi Angka" },
          instructions: {
            en: "Match the number back to its letter.",
            id: "Cocokkan angka kembali ke hurufnya.",
          },
          scenario: {
            en: "Code: A = 1, B = 2, C = 3, D = 4. The secret number is 2. What letter is it?",
            id: "Kode: A = 1, B = 2, C = 3, D = 4. Angka rahasianya 2. Huruf apa itu?",
          },
          options: [
            { emoji: "🅱", text: { en: "B", id: "B" } },
            { emoji: "🅲", text: { en: "C", id: "C" } },
            { emoji: "🅰", text: { en: "A", id: "A" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "pattern",
          id: "spy-key-pattern",
          emoji: "🔁",
          title: { en: "The Repeating Key", id: "Kunci Berulang" },
          instructions: {
            en: "The secret key repeats over and over. What number comes next?",
            id: "Kunci rahasianya berulang terus. Angka apa berikutnya?",
          },
          sequence: ["1️⃣", "2️⃣", "3️⃣", "1️⃣", "2️⃣", "3️⃣"],
          options: ["1️⃣", "2️⃣", "3️⃣"],
          answer: "1️⃣",
        },
        {
          kind: "debug",
          id: "spy-decoder-bug",
          emoji: "🐞",
          title: { en: "Broken Decoder", id: "Pemecah Kode Rusak" },
          instructions: {
            en: "Key: A=1, B=2, C=3. Decoding \"1 2 3\" has one wrong step. Find it!",
            id: "Kunci: A=1, B=2, C=3. Memecah \"1 2 3\" punya satu langkah salah. Temukan!",
          },
          steps: [
            { emoji: "1️⃣", text: { en: "1 means A", id: "1 berarti A" } },
            { emoji: "2️⃣", text: { en: "2 means B", id: "2 berarti B" } },
            { emoji: "3️⃣", text: { en: "3 means D", id: "3 berarti D" } },
            { emoji: "📖", text: { en: "Read the word: A B ?", id: "Baca katanya: A B ?" } },
          ],
          wrongIndex: 2,
          fixOptions: [
            { emoji: "🅲", text: { en: "3 means C", id: "3 berarti C" } },
            { emoji: "🅴", text: { en: "3 means E", id: "3 berarti E" } },
            { emoji: "0️⃣", text: { en: "3 means nothing", id: "3 tidak berarti apa-apa" } },
          ],
          correctFixIndex: 0,
        },
      ],
    },
    {
      id: "master-spy",
      emoji: "🎖️",
      color: "#3730a3",
      title: { en: "Master Spy", id: "Mata-Mata Ulung" },
      description: {
        en: "Time to crack tougher codes — figure out the rule yourself!",
        id: "Saatnya memecahkan kode lebih sulit — temukan sendiri aturannya!",
      },
      games: [
        {
          kind: "order",
          id: "spy-unscramble",
          emoji: "🔤",
          title: { en: "Unscramble the Word", id: "Susun Ulang Kata" },
          instructions: {
            en: "The secret word is HELLO, but the letters are scrambled. Put them in order!",
            id: "Kata rahasianya HELLO, tapi hurufnya teracak. Susun sesuai urutan!",
          },
          items: [
            { emoji: "🇭", text: { en: "H", id: "H" } },
            { emoji: "🇪", text: { en: "E", id: "E" } },
            { emoji: "🇱", text: { en: "L", id: "L" } },
            { emoji: "🇴", text: { en: "O", id: "O" } },
          ],
        },
        {
          kind: "choice",
          id: "spy-find-rule",
          emoji: "🧠",
          title: { en: "Which Rule?", id: "Aturan yang Mana?" },
          instructions: {
            en: "Work out the code from the example, then use it.",
            id: "Cari tahu kodenya dari contoh, lalu pakai.",
          },
          scenario: {
            en: "CAT becomes DBU (each letter moves forward by 1). Using the same code, what does DOG become?",
            id: "CAT jadi DBU (tiap huruf maju 1). Dengan kode yang sama, DOG jadi apa?",
          },
          options: [
            { emoji: "✅", text: { en: "EPH", id: "EPH" } },
            { emoji: "🔙", text: { en: "CNF", id: "CNF" } },
            { emoji: "🐶", text: { en: "DOG", id: "DOG" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "debug",
          id: "spy-encode-bug",
          emoji: "🕳️",
          title: { en: "Spy Slip-up", id: "Kekeliruan Mata-Mata" },
          instructions: {
            en: "Encoding DOG with the +1 code has one letter that didn't shift. Tap it!",
            id: "Menyandikan DOG dengan kode +1 punya satu huruf yang tak bergeser. Ketuk!",
          },
          steps: [
            { emoji: "🇩", text: { en: "D becomes E", id: "D jadi E" } },
            { emoji: "🇴", text: { en: "O becomes P", id: "O jadi P" } },
            { emoji: "🇬", text: { en: "G stays G", id: "G tetap G" } },
            { emoji: "📨", text: { en: "Send: E P ?", id: "Kirim: E P ?" } },
          ],
          wrongIndex: 2,
          fixOptions: [
            { emoji: "🇭", text: { en: "G becomes H", id: "G jadi H" } },
            { emoji: "🇫", text: { en: "G becomes F", id: "G jadi F" } },
            { emoji: "🇬", text: { en: "G becomes G", id: "G jadi G" } },
          ],
          correctFixIndex: 0,
        },
      ],
    },
  ],
};
