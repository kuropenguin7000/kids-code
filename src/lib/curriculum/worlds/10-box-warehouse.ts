import type { WorldDef } from "../types";

export const world: WorldDef = {
  id: "box-warehouse",
  emoji: "📦",
  color: "#b45309",
  title: { en: "Box Warehouse", id: "Gudang Kotak" },
  description: {
    en: "Robots stack, line up and shelve boxes — meet stacks, queues and lists!",
    id: "Robot menumpuk, mengantre, dan menata kotak — kenali tumpukan, antrean, dan daftar!",
  },
  levels: [
    {
      id: "stacks",
      emoji: "🍽️",
      color: "#b45309",
      title: { en: "The Stack", id: "Tumpukan" },
      description: {
        en: "A stack is like a pile of plates — the LAST one you add is the first one you take.",
        id: "Tumpukan itu seperti setumpuk piring — yang TERAKHIR ditaruh, itu yang pertama diambil.",
      },
      games: [
        {
          kind: "choice",
          id: "wh-stack-top",
          emoji: "🟩",
          title: { en: "Top of the Stack", id: "Puncak Tumpukan" },
          instructions: {
            en: "You always take from the TOP of a stack. Which box comes off?",
            id: "Kamu selalu mengambil dari ATAS tumpukan. Kotak mana yang terangkat?",
          },
          scenario: {
            en: "Robo stacks boxes: first 🟥 red, then 🟦 blue, then 🟩 green on top. He takes ONE box off the top. Which box is it?",
            id: "Robo menumpuk kotak: pertama 🟥 merah, lalu 🟦 biru, lalu 🟩 hijau di atas. Ia mengambil SATU kotak dari atas. Kotak mana?",
          },
          options: [
            { emoji: "🟩", text: { en: "The green box", id: "Kotak hijau" } },
            { emoji: "🟥", text: { en: "The red box", id: "Kotak merah" } },
            { emoji: "🟦", text: { en: "The blue box", id: "Kotak biru" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "choice",
          id: "wh-stack-plates",
          emoji: "🍽️",
          title: { en: "Plate Pile", id: "Tumpukan Piring" },
          instructions: {
            en: "Last in, first out. Which plate gets used first?",
            id: "Terakhir masuk, pertama keluar. Piring mana yang dipakai duluan?",
          },
          scenario: {
            en: "You add plates A, then B, then C, then D to a pile. You take one to eat. Which plate do you use FIRST?",
            id: "Kamu menaruh piring A, lalu B, lalu C, lalu D ke tumpukan. Kamu ambil satu untuk makan. Piring mana yang dipakai PERTAMA?",
          },
          options: [
            { emoji: "🅳", text: { en: "Plate D", id: "Piring D" } },
            { emoji: "🅰", text: { en: "Plate A", id: "Piring A" } },
            { emoji: "🅱", text: { en: "Plate B", id: "Piring B" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "debug",
          id: "wh-stack-bug",
          emoji: "🐛",
          title: { en: "The Wrong Grab", id: "Ambil yang Salah" },
          instructions: {
            en: "Rule: always take from the TOP. One step breaks the rule — tap it!",
            id: "Aturan: selalu ambil dari ATAS. Satu langkah melanggar aturan — ketuk!",
          },
          steps: [
            { emoji: "1️⃣", text: { en: "Stack box 1", id: "Tumpuk kotak 1" } },
            { emoji: "2️⃣", text: { en: "Stack box 2", id: "Tumpuk kotak 2" } },
            { emoji: "3️⃣", text: { en: "Stack box 3 on top", id: "Tumpuk kotak 3 di atas" } },
            { emoji: "⬇️", text: { en: "Pull box 1 from the bottom", id: "Tarik kotak 1 dari bawah" } },
          ],
          wrongIndex: 3,
          fixOptions: [
            { emoji: "⬆️", text: { en: "Take box 3 from the top", id: "Ambil kotak 3 dari atas" } },
            { emoji: "🤹", text: { en: "Shake the whole pile", id: "Goyang seluruh tumpukan" } },
            { emoji: "🧨", text: { en: "Knock the stack over", id: "Robohkan tumpukannya" } },
          ],
          correctFixIndex: 0,
        },
      ],
    },
    {
      id: "queues",
      emoji: "🚶",
      color: "#c2410c",
      title: { en: "The Queue", id: "Antrean" },
      description: {
        en: "A queue is like a line at a shop — the FIRST one in is the first one served.",
        id: "Antrean itu seperti barisan di toko — yang PERTAMA datang, itu yang pertama dilayani.",
      },
      games: [
        {
          kind: "choice",
          id: "wh-queue-first",
          emoji: "🍦",
          title: { en: "First in Line", id: "Paling Depan Antrean" },
          instructions: {
            en: "First in, first out. Who is served first?",
            id: "Pertama masuk, pertama keluar. Siapa yang dilayani duluan?",
          },
          scenario: {
            en: "At the ice-cream shop people line up: Ana first, then Budi, then Citra. Who gets served FIRST?",
            id: "Di toko es krim orang mengantre: Ana dulu, lalu Budi, lalu Citra. Siapa yang dilayani PERTAMA?",
          },
          options: [
            { emoji: "🙋‍♀️", text: { en: "Ana", id: "Ana" } },
            { emoji: "🙋", text: { en: "Citra", id: "Citra" } },
            { emoji: "🙋‍♂️", text: { en: "Budi", id: "Budi" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "order",
          id: "wh-queue-order",
          emoji: "🎟️",
          title: { en: "Join the Queue", id: "Ikut Antre" },
          instructions: {
            en: "People are served in the order they arrived. Put them in serving order!",
            id: "Orang dilayani sesuai urutan kedatangan. Susun urutan pelayanannya!",
          },
          items: [
            { emoji: "🥇", text: { en: "Ana (arrived first)", id: "Ana (datang pertama)" } },
            { emoji: "🥈", text: { en: "Budi (arrived next)", id: "Budi (datang berikutnya)" } },
            { emoji: "🥉", text: { en: "Citra (arrived third)", id: "Citra (datang ketiga)" } },
            { emoji: "4️⃣", text: { en: "Dedi (arrived last)", id: "Dedi (datang terakhir)" } },
          ],
        },
        {
          kind: "choice",
          id: "wh-queue-which",
          emoji: "🏦",
          title: { en: "Stack or Queue?", id: "Tumpukan atau Antrean?" },
          instructions: {
            en: "Think about who goes first.",
            id: "Pikirkan siapa yang duluan.",
          },
          scenario: {
            en: "At the bank, the first person in line is served first. Is this a stack or a queue?",
            id: "Di bank, orang pertama di barisan dilayani duluan. Ini tumpukan atau antrean?",
          },
          options: [
            { emoji: "🚶", text: { en: "A queue (first in, first out)", id: "Antrean (pertama masuk, pertama keluar)" } },
            { emoji: "🍽️", text: { en: "A stack (last in, first out)", id: "Tumpukan (terakhir masuk, pertama keluar)" } },
            { emoji: "🔁", text: { en: "A loop", id: "Perulangan" } },
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "lists",
      emoji: "📚",
      color: "#92400e",
      title: { en: "The List", id: "Daftar" },
      description: {
        en: "A list keeps things in order, and you can count to any spot in it.",
        id: "Daftar menjaga urutan, dan kamu bisa menghitung ke posisi mana pun di dalamnya.",
      },
      games: [
        {
          kind: "order",
          id: "wh-list-shelf",
          emoji: "📚",
          title: { en: "Alphabet Shelf", id: "Rak Abjad" },
          instructions: {
            en: "Shelve the books in A-B-C-D order!",
            id: "Tata buku sesuai urutan A-B-C-D!",
          },
          items: [
            { emoji: "📕", text: { en: "Book A", id: "Buku A" } },
            { emoji: "📗", text: { en: "Book B", id: "Buku B" } },
            { emoji: "📘", text: { en: "Book C", id: "Buku C" } },
            { emoji: "📙", text: { en: "Book D", id: "Buku D" } },
          ],
        },
        {
          kind: "choice",
          id: "wh-list-index",
          emoji: "🔢",
          title: { en: "The Third Box", id: "Kotak Ketiga" },
          instructions: {
            en: "Count from the start: 1, 2, 3...",
            id: "Hitung dari awal: 1, 2, 3...",
          },
          scenario: {
            en: "A list of boxes sits in a row: 🎁 🎀 🧸 🎈. Counting from the start, what is the 3rd box?",
            id: "Sebuah daftar kotak berbaris: 🎁 🎀 🧸 🎈. Menghitung dari awal, apa kotak ke-3?",
          },
          options: [
            { emoji: "🧸", text: { en: "The teddy bear", id: "Boneka beruang" } },
            { emoji: "🎀", text: { en: "The ribbon", id: "Pita" } },
            { emoji: "🎈", text: { en: "The balloon", id: "Balon" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "debug",
          id: "wh-list-order",
          emoji: "🏷️",
          title: { en: "Out of Order", id: "Salah Urutan" },
          instructions: {
            en: "The shelf labels should go up by 10 each time. Tap the wrong one!",
            id: "Label rak seharusnya naik 10 setiap kali. Ketuk yang salah!",
          },
          steps: [
            { emoji: "🔟", text: { en: "10", id: "10" } },
            { emoji: "2️⃣", text: { en: "20", id: "20" } },
            { emoji: "3️⃣", text: { en: "30", id: "30" } },
            { emoji: "5️⃣", text: { en: "50", id: "50" } },
          ],
          wrongIndex: 3,
          fixOptions: [
            { emoji: "4️⃣", text: { en: "40", id: "40" } },
            { emoji: "6️⃣", text: { en: "60", id: "60" } },
            { emoji: "0️⃣", text: { en: "0", id: "0" } },
          ],
          correctFixIndex: 0,
        },
      ],
    },
  ],
};
