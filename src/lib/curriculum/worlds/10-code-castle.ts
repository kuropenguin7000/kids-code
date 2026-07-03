import type { WorldDef } from "../types";

export const world: WorldDef = {
  id: "code-castle",
  emoji: "🏰",
  color: "#7c3aed",
  title: { en: "Code Castle", id: "Kastel Kode" },
  description: {
    en: "The grand finale: type and run real JavaScript, just like the pros!",
    id: "Babak puncak: ketik dan jalankan JavaScript sungguhan, seperti para profesional!",
  },
  levels: [
    {
      id: "real-code",
      emoji: "⌨️",
      color: "#7c3aed",
      title: { en: "First Real Code", id: "Kode Sungguhan Pertama" },
      description: {
        en: "You trained your brain like a programmer — now type real code, just like the pros!",
        id: "Otakmu sudah terlatih seperti programmer — sekarang ketik kode sungguhan, seperti para profesional!",
      },
      games: [
        {
          kind: "code",
          id: "code-hello",
          emoji: "👋",
          title: { en: "Say Hello!", id: "Ucapkan Halo!" },
          instructions: {
            en: "Make the computer say exactly: Hello, world!",
            id: "Buat komputer mengucapkan persis: Hello, world!",
          },
          intro: {
            en: 'This is real JavaScript — the language of the web! The command say() makes the computer talk. Whatever you put between the quotes " " gets shown on the screen.',
            id: 'Ini JavaScript sungguhan — bahasanya internet! Perintah say() membuat komputer bicara. Apa pun yang kamu tulis di antara tanda kutip " " akan muncul di layar.',
          },
          hint: {
            en: 'Type: say("Hello, world!") — don\'t forget the quotes!',
            id: 'Ketik: say("Hello, world!") — jangan lupa tanda kutipnya!',
          },
          starterCode: '// Type your command below 👇\nsay("")\n',
          expectedOutput: "Hello, world!",
        },
        {
          kind: "code",
          id: "code-two-lines",
          emoji: "💬",
          title: { en: "Two Lines", id: "Dua Baris" },
          instructions: {
            en: "Make the computer say two lines: Hello! and then I am Robo!",
            id: "Buat komputer mengucapkan dua baris: Hello! lalu I am Robo!",
          },
          intro: {
            en: "Each say() prints one line. Two say() commands = two lines, in order — just like sequencing!",
            id: "Setiap say() mencetak satu baris. Dua perintah say() = dua baris, berurutan — sama seperti menyusun langkah!",
          },
          hint: {
            en: "Fill the second say() with: I am Robo!",
            id: "Isi say() kedua dengan: I am Robo!",
          },
          starterCode: '// Say two lines 👇\nsay("Hello!")\nsay("")\n',
          expectedOutput: "Hello!\nI am Robo!",
        },
        {
          kind: "code",
          id: "code-math",
          emoji: "🧮",
          title: { en: "Robot Calculator", id: "Kalkulator Robot" },
          instructions: {
            en: "Make the computer calculate 6 + 4 and say the answer.",
            id: "Buat komputer menghitung 6 + 4 dan mengucapkan jawabannya.",
          },
          intro: {
            en: 'say("2 + 2") shows the text 2 + 2, but say(2 + 2) shows 4 — without quotes, the computer does the math for you!',
            id: 'say("2 + 2") menampilkan teks 2 + 2, tapi say(2 + 2) menampilkan 4 — tanpa tanda kutip, komputer yang menghitung untukmu!',
          },
          hint: {
            en: "Type: say(6 + 4) — no quotes!",
            id: "Ketik: say(6 + 4) — tanpa tanda kutip!",
          },
          starterCode: "// Make the computer calculate 6 + 4 👇\nsay(2 + 2)\n",
          expectedOutput: "10",
        },
      ],
    },
    {
      id: "code-boxes-loops",
      emoji: "🚀",
      color: "#9333ea",
      title: { en: "Boxes & Loops", id: "Kotak & Perulangan" },
      description: {
        en: "Real variables and real loops — the superpowers you already know, now in JavaScript!",
        id: "Variabel dan perulangan sungguhan — kekuatan super yang sudah kamu kenal, kini dalam JavaScript!",
      },
      games: [
        {
          kind: "code",
          id: "code-box",
          emoji: "🍎",
          title: { en: "The Apple Box", id: "Kotak Apel" },
          instructions: {
            en: "The box starts with 3 apples. Add 2 more so the computer says 5!",
            id: "Kotaknya mulai dengan 3 apel. Tambahkan 2 lagi supaya komputer mengucapkan 5!",
          },
          intro: {
            en: "Remember memory boxes? In real code they are called variables: let apples = 3 makes the box, and apples = apples + 2 changes what is inside!",
            id: "Ingat kotak ingatan? Di kode sungguhan namanya variabel: let apples = 3 membuat kotaknya, dan apples = apples + 2 mengubah isinya!",
          },
          hint: {
            en: "On the empty line, write: apples = apples + 2",
            id: "Di baris kosong, tulis: apples = apples + 2",
          },
          starterCode:
            "// Add 2 more apples 👇\nlet apples = 3\n\nsay(apples)\n",
          expectedOutput: "5",
        },
        {
          kind: "code",
          id: "code-loop",
          emoji: "⭐",
          title: { en: "Star Stairs", id: "Tangga Bintang" },
          instructions: {
            en: "Build star stairs: 1 star, then 2, then 3 — each on its own line.",
            id: "Buat tangga bintang: 1 bintang, lalu 2, lalu 3 — masing-masing di barisnya sendiri.",
          },
          intro: {
            en: 'Remember repeat blocks? In real code a loop looks like this: for (let i = 1; i <= 3; i++) { ... } repeats 3 times, and i counts 1, 2, 3. "⭐".repeat(i) makes i stars!',
            id: 'Ingat balok pengulang? Di kode sungguhan, perulangan seperti ini: for (let i = 1; i <= 3; i++) { ... } mengulang 3 kali, dan i menghitung 1, 2, 3. "⭐".repeat(i) membuat i bintang!',
          },
          hint: {
            en: 'Inside the loop, write: say("⭐".repeat(i))',
            id: 'Di dalam perulangan, tulis: say("⭐".repeat(i))',
          },
          starterCode:
            "// Build the stairs 👇\nfor (let i = 1; i <= 3; i++) {\n  \n}\n",
          expectedOutput: "⭐\n⭐⭐\n⭐⭐⭐",
        },
        {
          kind: "code",
          id: "code-countdown",
          emoji: "🧨",
          title: { en: "Rocket Countdown", id: "Hitung Mundur Roket" },
          instructions: {
            en: "Count down 3, 2, 1 — then blast off!",
            id: "Hitung mundur 3, 2, 1 — lalu meluncur!",
          },
          intro: {
            en: 'Loops can count DOWN too: for (let i = 3; i >= 1; i--) counts 3, 2, 1. The i-- means "one less each time".',
            id: 'Perulangan juga bisa menghitung MUNDUR: for (let i = 3; i >= 1; i--) menghitung 3, 2, 1. i-- artinya "berkurang satu setiap kali".',
          },
          hint: {
            en: "Inside the loop, write: say(i)",
            id: "Di dalam perulangan, tulis: say(i)",
          },
          starterCode:
            '// Count down, then blast off 👇\nfor (let i = 3; i >= 1; i--) {\n  \n}\nsay("Blast off! 🚀")\n',
          expectedOutput: "3\n2\n1\nBlast off! 🚀",
        },
      ],
    },
    {
      id: "code-master",
      emoji: "🏆",
      color: "#c026d3",
      title: { en: "Code Master", id: "Master Kode" },
      description: {
        en: "Real if-rules, emoji art, and a free-play finale — show everything you've got!",
        id: "Aturan jika sungguhan, seni emoji, dan babak bebas berkarya — tunjukkan semua kemampuanmu!",
      },
      games: [
        {
          kind: "code",
          id: "code-if",
          emoji: "☂️",
          title: { en: "The Umbrella Rule", id: "Aturan Payung" },
          instructions: {
            en: "It is raining! Make the rule say: Take an umbrella! ☂️",
            id: "Hujan turun! Buat aturannya mengucapkan: Take an umbrella! ☂️",
          },
          intro: {
            en: 'If-then rules in real code: if (weather === "rain") { ... } only runs the code inside when the box \'weather\' holds "rain". The === means "is exactly".',
            id: 'Aturan jika-maka di kode sungguhan: if (weather === "rain") { ... } hanya menjalankan kode di dalamnya saat kotak \'weather\' berisi "rain". Tanda === artinya "sama persis".',
          },
          hint: {
            en: 'Inside the { }, write: say("Take an umbrella! ☂️")',
            id: 'Di dalam { }, tulis: say("Take an umbrella! ☂️")',
          },
          starterCode:
            '// The rule runs only when it rains 👇\nlet weather = "rain"\nif (weather === "rain") {\n  \n}\n',
          expectedOutput: "Take an umbrella! ☂️",
        },
        {
          kind: "code",
          id: "code-art",
          emoji: "🖼️",
          title: { en: "Emoji Painting", id: "Lukisan Emoji" },
          instructions: {
            en: "Paint a wall 5 squares wide and 3 rows tall — with a loop, not by typing every square!",
            id: "Lukis tembok selebar 5 kotak dan setinggi 3 baris — dengan perulangan, bukan mengetik setiap kotak!",
          },
          intro: {
            en: '"🟦".repeat(5) makes one row of 5 squares. A loop that runs 3 times can paint the whole wall!',
            id: '"🟦".repeat(5) membuat satu baris berisi 5 kotak. Perulangan yang berjalan 3 kali bisa melukis seluruh tembok!',
          },
          hint: {
            en: 'Inside the loop, write: say("🟦".repeat(5))',
            id: 'Di dalam perulangan, tulis: say("🟦".repeat(5))',
          },
          starterCode:
            "// Paint 3 rows of 5 squares 👇\nfor (let i = 1; i <= 3; i++) {\n  \n}\n",
          expectedOutput: "🟦🟦🟦🟦🟦\n🟦🟦🟦🟦🟦\n🟦🟦🟦🟦🟦",
        },
        {
          kind: "code",
          id: "code-freeplay",
          emoji: "🎨",
          title: {
            en: "Free Play: Your Program",
            id: "Bebas Berkarya: Programmu",
          },
          instructions: {
            en: "Write any program you like and run it without errors. Surprise us!",
            id: "Tulis program apa pun yang kamu suka dan jalankan tanpa error. Buat kami terkejut!",
          },
          intro: {
            en: "You made it! Sequencing, commands, patterns, loops, conditionals, debugging — you know the building blocks every programmer uses. Now build ANYTHING you want!",
            id: "Kamu berhasil! Urutan, perintah, pola, perulangan, kondisi, debugging — kamu tahu balok penyusun yang dipakai semua programmer. Sekarang buat APA PUN yang kamu mau!",
          },
          hint: {
            en: "Ideas: draw an emoji picture with loops, or make the computer tell a story!",
            id: "Ide: gambar emoji dengan perulangan, atau buat komputer bercerita!",
          },
          starterCode:
            '// Your playground — build anything! 👇\nsay("I am a programmer! 🎉")\n',
          expectedOutput: null,
        },
      ],
    },
  ],
};
