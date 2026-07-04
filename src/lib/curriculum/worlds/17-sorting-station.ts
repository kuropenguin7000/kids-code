import type { WorldDef } from "../types";

export const world: WorldDef = {
  id: "sorting-station",
  emoji: "📊",
  color: "#0369a1",
  title: { en: "Sorting Station", id: "Stasiun Sortir" },
  description: {
    en: "Sort parcels like a real algorithm — compare two, swap if needed, repeat!",
    id: "Sortir paket seperti algoritma sungguhan — bandingkan dua, tukar bila perlu, ulangi!",
  },
  levels: [
    {
      id: "compare-two",
      emoji: "⚖️",
      color: "#0369a1",
      title: { en: "Compare Two", id: "Bandingkan Dua" },
      description: {
        en: "Sorting starts small: look at two things and decide which is bigger.",
        id: "Menyortir dimulai dari yang kecil: lihat dua hal dan putuskan mana yang lebih besar.",
      },
      games: [
        {
          kind: "choice",
          id: "ss-bigger",
          emoji: "🔢",
          title: { en: "Which is Bigger?", id: "Mana Lebih Besar?" },
          instructions: {
            en: "Compare the two boxes.",
            id: "Bandingkan kedua kotak.",
          },
          scenario: {
            en: "Compare box 7 and box 3. Which number is bigger?",
            id: "Bandingkan kotak 7 dan kotak 3. Angka mana yang lebih besar?",
          },
          options: [
            { emoji: "7️⃣", text: { en: "7", id: "7" } },
            { emoji: "3️⃣", text: { en: "3", id: "3" } },
            { emoji: "🟰", text: { en: "They are equal", id: "Sama besar" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "choice",
          id: "ss-swap-or-keep",
          emoji: "🔄",
          title: { en: "Swap or Keep?", id: "Tukar atau Biarkan?" },
          instructions: {
            en: "Sorting small to big — should these two swap?",
            id: "Mengurutkan kecil ke besar — haruskah keduanya ditukar?",
          },
          scenario: {
            en: "You are sorting small → big. You see 5 then 2 (the 5 comes first). Should you swap them?",
            id: "Kamu mengurutkan kecil → besar. Kamu lihat 5 lalu 2 (5 di depan). Haruskah ditukar?",
          },
          options: [
            { emoji: "🔄", text: { en: "Yes, swap them", id: "Ya, tukar" } },
            { emoji: "✋", text: { en: "No, keep them", id: "Tidak, biarkan" } },
            { emoji: "🗑️", text: { en: "Remove them both", id: "Buang keduanya" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "order",
          id: "ss-the-swap",
          emoji: "📦",
          title: { en: "The Swap", id: "Menukar" },
          instructions: {
            en: "Swap two boxes using one spare spot. Put the steps in order!",
            id: "Tukar dua kotak memakai satu tempat kosong. Susun langkahnya!",
          },
          items: [
            { emoji: "📤", text: { en: "Move box A to the spare spot", id: "Pindah kotak A ke tempat kosong" } },
            { emoji: "➡️", text: { en: "Move box B into A's place", id: "Pindah kotak B ke tempat A" } },
            { emoji: "📥", text: { en: "Move box A where B was", id: "Pindah kotak A ke bekas tempat B" } },
            { emoji: "✅", text: { en: "Done — they're swapped!", id: "Selesai — sudah tertukar!" } },
          ],
        },
      ],
    },
    {
      id: "bubble-sort",
      emoji: "🫧",
      color: "#0284c7",
      title: { en: "Bubble Sort", id: "Sortir Gelembung" },
      description: {
        en: "Compare neighbours and swap, over and over, until everything is in order.",
        id: "Bandingkan tetangga lalu tukar, berulang-ulang, sampai semua urut.",
      },
      games: [
        {
          kind: "order",
          id: "ss-bubble-pass",
          emoji: "🔢",
          title: { en: "Put Them in Order", id: "Susun Berurutan" },
          instructions: {
            en: "The boxes are jumbled. Line them up smallest to biggest!",
            id: "Kotaknya berantakan. Susun dari terkecil ke terbesar!",
          },
          items: [
            { emoji: "1️⃣", text: { en: "1", id: "1" } },
            { emoji: "2️⃣", text: { en: "2", id: "2" } },
            { emoji: "3️⃣", text: { en: "3", id: "3" } },
            { emoji: "4️⃣", text: { en: "4", id: "4" } },
          ],
        },
        {
          kind: "debug",
          id: "ss-sort-slip",
          emoji: "🐞",
          title: { en: "Sort Slip", id: "Salah Urut" },
          instructions: {
            en: "The list should climb by 2 each time. Tap the one out of place!",
            id: "Daftarnya harusnya naik 2 setiap kali. Ketuk yang salah tempat!",
          },
          steps: [
            { emoji: "2️⃣", text: { en: "2", id: "2" } },
            { emoji: "4️⃣", text: { en: "4", id: "4" } },
            { emoji: "6️⃣", text: { en: "6", id: "6" } },
            { emoji: "5️⃣", text: { en: "5", id: "5" } },
          ],
          wrongIndex: 3,
          fixOptions: [
            { emoji: "8️⃣", text: { en: "8", id: "8" } },
            { emoji: "7️⃣", text: { en: "7", id: "7" } },
            { emoji: "3️⃣", text: { en: "3", id: "3" } },
          ],
          correctFixIndex: 0,
        },
        {
          kind: "choice",
          id: "ss-when-done",
          emoji: "🏁",
          title: { en: "When Is It Done?", id: "Kapan Selesai?" },
          instructions: {
            en: "A sort keeps going until... when?",
            id: "Penyortiran terus berjalan sampai... kapan?",
          },
          scenario: {
            en: "Bubble sort keeps making passes until something happens. When is the list finally DONE?",
            id: "Sortir gelembung terus mengulang sampai sesuatu terjadi. Kapan daftarnya benar-benar SELESAI?",
          },
          options: [
            { emoji: "✅", text: { en: "When nothing needs swapping", id: "Saat tak ada yang perlu ditukar" } },
            { emoji: "1️⃣", text: { en: "After exactly one look", id: "Setelah satu kali lihat" } },
            { emoji: "♾️", text: { en: "Never — it goes forever", id: "Tak pernah — berjalan selamanya" } },
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "sort-master",
      emoji: "🏆",
      color: "#075985",
      title: { en: "Sort Master", id: "Master Sortir" },
      description: {
        en: "Bigger lists, smarter moves — find the smallest and build the order.",
        id: "Daftar lebih besar, langkah lebih cerdas — cari yang terkecil dan bangun urutannya.",
      },
      games: [
        {
          kind: "order",
          id: "ss-sort-line",
          emoji: "📏",
          title: { en: "Sort the Line", id: "Urutkan Barisan" },
          instructions: {
            en: "Line up the animals from shortest to tallest!",
            id: "Baris hewan dari terpendek ke tertinggi!",
          },
          items: [
            { emoji: "🐭", text: { en: "Mouse (shortest)", id: "Tikus (terpendek)" } },
            { emoji: "🐰", text: { en: "Rabbit", id: "Kelinci" } },
            { emoji: "🐕", text: { en: "Dog", id: "Anjing" } },
            { emoji: "🦒", text: { en: "Giraffe (tallest)", id: "Jerapah (tertinggi)" } },
          ],
        },
        {
          kind: "choice",
          id: "ss-find-smallest",
          emoji: "🔍",
          title: { en: "Find the Smallest", id: "Cari yang Terkecil" },
          instructions: {
            en: "To sort, first find the smallest. Check them all!",
            id: "Untuk menyortir, cari yang terkecil dulu. Periksa semuanya!",
          },
          scenario: {
            en: "To start sorting, find the smallest of 8, 3, 5 and 9. Which is smallest?",
            id: "Untuk mulai menyortir, cari yang terkecil dari 8, 3, 5, dan 9. Mana yang terkecil?",
          },
          options: [
            { emoji: "3️⃣", text: { en: "3", id: "3" } },
            { emoji: "8️⃣", text: { en: "8", id: "8" } },
            { emoji: "9️⃣", text: { en: "9", id: "9" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "debug",
          id: "ss-wrong-swap",
          emoji: "🔄",
          title: { en: "Wrong Swap", id: "Tukar yang Salah" },
          instructions: {
            en: "Sorting small → big, 4 and 7 are already in order. Tap the mistake!",
            id: "Mengurutkan kecil → besar, 4 dan 7 sudah urut. Ketuk kesalahannya!",
          },
          steps: [
            { emoji: "👀", text: { en: "Compare 4 and 7", id: "Bandingkan 4 dan 7" } },
            { emoji: "🔄", text: { en: "Swap: put 7 before 4", id: "Tukar: taruh 7 sebelum 4" } },
            { emoji: "😕", text: { en: "Now it reads 7, 4", id: "Sekarang jadi 7, 4" } },
            { emoji: "➡️", text: { en: "Move to the next pair", id: "Lanjut ke pasangan berikutnya" } },
          ],
          wrongIndex: 1,
          fixOptions: [
            { emoji: "✋", text: { en: "Keep them — 4 is already first", id: "Biarkan — 4 sudah di depan" } },
            { emoji: "🗑️", text: { en: "Throw the 7 away", id: "Buang angka 7" } },
            { emoji: "➕", text: { en: "Add them into 11", id: "Jumlahkan jadi 11" } },
          ],
          correctFixIndex: 0,
        },
      ],
    },
  ],
};
