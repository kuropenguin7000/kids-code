import type { WorldDef } from "../types";

export const world: WorldDef = {
  id: "robo-basics",
  emoji: "🤖",
  color: "#f59e0b",
  title: { en: "Robo Basics", id: "Dasar Robo" },
  description: {
    en: "Meet Robo! Learn how computers follow steps, commands and patterns.",
    id: "Kenalan dengan Robo! Pelajari cara komputer mengikuti langkah, perintah, dan pola.",
  },
  levels: [
    {
      id: "sequencing",
      emoji: "🪜",
      color: "#f59e0b",
      title: { en: "Step by Step", id: "Langkah demi Langkah" },
      description: {
        en: "Computers do things in order, one step at a time. Put the steps in the right order!",
        id: "Komputer bekerja berurutan, satu langkah demi satu. Susun langkahnya dengan benar!",
      },
      games: [
        {
          kind: "order",
          id: "seq-morning",
          emoji: "🌞",
          title: { en: "Robo's Morning", id: "Pagi si Robo" },
          instructions: {
            en: "Robo the robot wants to get ready for school. Tap the cards in the right order!",
            id: "Robot Robo mau bersiap ke sekolah. Ketuk kartunya sesuai urutan yang benar!",
          },
          items: [
            { emoji: "⏰", text: { en: "Wake up", id: "Bangun tidur" } },
            { emoji: "🪥", text: { en: "Brush teeth", id: "Gosok gigi" } },
            { emoji: "🥣", text: { en: "Eat breakfast", id: "Sarapan" } },
            {
              emoji: "🎒",
              text: { en: "Go to school", id: "Berangkat sekolah" },
            },
          ],
        },
        {
          kind: "order",
          id: "seq-flower",
          emoji: "🌷",
          title: { en: "Plant a Flower", id: "Menanam Bunga" },
          instructions: {
            en: "Help Robo plant a flower. Which step comes first?",
            id: "Bantu Robo menanam bunga. Langkah mana yang paling awal?",
          },
          items: [
            { emoji: "🕳️", text: { en: "Dig a hole", id: "Gali lubang" } },
            {
              emoji: "🌱",
              text: { en: "Drop in the seed", id: "Masukkan biji" },
            },
            {
              emoji: "🪨",
              text: { en: "Cover with soil", id: "Tutup dengan tanah" },
            },
            { emoji: "💧", text: { en: "Water it", id: "Siram air" } },
          ],
        },
        {
          kind: "order",
          id: "seq-sandwich",
          emoji: "🥪",
          title: { en: "The Sandwich Program", id: "Program Roti Lapis" },
          instructions: {
            en: "A sandwich is a program too! Tap the steps in the right order.",
            id: "Roti lapis juga sebuah program! Ketuk langkahnya sesuai urutan.",
          },
          items: [
            {
              emoji: "🍞",
              text: { en: "Put down the bread", id: "Taruh rotinya" },
            },
            {
              emoji: "🧀",
              text: { en: "Add the cheese", id: "Tambahkan keju" },
            },
            {
              emoji: "🍞",
              text: { en: "Put bread on top", id: "Tutup dengan roti" },
            },
            {
              emoji: "😋",
              text: { en: "Take a big bite", id: "Gigit besar-besar" },
            },
          ],
        },
      ],
    },
    {
      id: "commands",
      emoji: "🎯",
      color: "#10b981",
      title: { en: "Precise Commands", id: "Perintah yang Tepat" },
      description: {
        en: "Robots only do EXACTLY what you say. Guide Robo to the star with movement blocks!",
        id: "Robot hanya melakukan PERSIS yang kamu perintahkan. Antar Robo ke bintang dengan balok perintah!",
      },
      games: [
        {
          kind: "robot",
          id: "cmd-first-steps",
          emoji: "👣",
          title: { en: "First Steps", id: "Langkah Pertama" },
          instructions: {
            en: "Add arrow blocks to walk Robo to the star, then press Go!",
            id: "Tambahkan balok panah untuk mengantar Robo ke bintang, lalu tekan Jalan!",
          },
          cols: 4,
          rows: 3,
          start: { x: 0, y: 1 },
          goal: { x: 3, y: 1 },
          walls: [],
          palette: [
            { dx: 1, dy: 0, times: 1 },
            { dx: -1, dy: 0, times: 1 },
            { dx: 0, dy: -1, times: 1 },
            { dx: 0, dy: 1, times: 1 },
          ],
          maxBlocks: null,
        },
        {
          kind: "robot",
          id: "cmd-treasure",
          emoji: "💎",
          title: { en: "The Treasure Climb", id: "Memanjat ke Harta" },
          instructions: {
            en: "The wall is in the way! Go up first, then across to the treasure star.",
            id: "Ada tembok menghalangi! Naik dulu, lalu menyamping ke bintang harta.",
          },
          cols: 4,
          rows: 4,
          start: { x: 0, y: 3 },
          goal: { x: 3, y: 0 },
          walls: [
            { x: 1, y: 2 },
            { x: 2, y: 2 },
            { x: 3, y: 2 },
          ],
          palette: [
            { dx: 1, dy: 0, times: 1 },
            { dx: -1, dy: 0, times: 1 },
            { dx: 0, dy: -1, times: 1 },
            { dx: 0, dy: 1, times: 1 },
          ],
          maxBlocks: null,
        },
        {
          kind: "robot",
          id: "cmd-exact",
          emoji: "🧱",
          title: { en: "Around the Wall", id: "Memutari Tembok" },
          instructions: {
            en: "A wall blocks the path! You may use at most 6 blocks — every command counts.",
            id: "Tembok menghalangi jalan! Kamu hanya boleh pakai 6 balok — setiap perintah berharga.",
          },
          cols: 5,
          rows: 3,
          start: { x: 0, y: 1 },
          goal: { x: 4, y: 1 },
          walls: [{ x: 2, y: 1 }],
          palette: [
            { dx: 1, dy: 0, times: 1 },
            { dx: -1, dy: 0, times: 1 },
            { dx: 0, dy: -1, times: 1 },
            { dx: 0, dy: 1, times: 1 },
          ],
          maxBlocks: 6,
        },
      ],
    },
    {
      id: "patterns",
      emoji: "🧩",
      color: "#3b82f6",
      title: { en: "Pattern Power", id: "Kekuatan Pola" },
      description: {
        en: "Programmers are great at spotting what repeats. Can you see the pattern?",
        id: "Programmer jago menemukan apa yang berulang. Bisakah kamu melihat polanya?",
      },
      games: [
        {
          kind: "pattern",
          id: "pat-colors",
          emoji: "🎈",
          title: { en: "Balloon Parade", id: "Parade Balon" },
          instructions: {
            en: "Look at the balloons. Which one comes next?",
            id: "Perhatikan balonnya. Mana yang berikutnya?",
          },
          sequence: ["🔴", "🔵", "🔴", "🔵", "🔴"],
          options: ["🔴", "🔵", "🟢"],
          answer: "🔵",
        },
        {
          kind: "pattern",
          id: "pat-shapes",
          emoji: "🚂",
          title: { en: "The Shape Train", id: "Kereta Bentuk" },
          instructions: {
            en: "Two squares, then a star. What comes next on the train?",
            id: "Dua kotak, lalu bintang. Apa gerbong berikutnya?",
          },
          sequence: ["🟦", "🟦", "⭐", "🟦", "🟦", "⭐", "🟦", "🟦"],
          options: ["🟦", "⭐", "🟥"],
          answer: "⭐",
        },
        {
          kind: "pattern",
          id: "pat-animals",
          emoji: "🎪",
          title: { en: "Animal Circus", id: "Sirkus Hewan" },
          instructions: {
            en: "The animals march in a pattern. Who marches next?",
            id: "Hewan-hewan berbaris dengan pola. Siapa yang berikutnya?",
          },
          sequence: ["🐱", "🐶", "🐶", "🐱", "🐶", "🐶", "🐱"],
          options: ["🐱", "🐶", "🐰"],
          answer: "🐶",
        },
      ],
    },
  ],
};
