import type { WorldDef } from "../types";

export const world: WorldDef = {
  id: "robot-brains",
  emoji: "🧠",
  color: "#7e22ce",
  title: { en: "Robot Brains", id: "Otak Robot" },
  description: {
    en: "Teach a robot to decide! Build decision trees and if-else chains.",
    id: "Ajari robot mengambil keputusan! Bangun pohon keputusan dan rantai jika-selain itu.",
  },
  levels: [
    {
      id: "sensors",
      emoji: "👁️",
      color: "#7e22ce",
      title: { en: "Sensors", id: "Sensor" },
      description: {
        en: "A robot senses the world, then picks an action to match.",
        id: "Robot merasakan dunia, lalu memilih aksi yang cocok.",
      },
      games: [
        {
          kind: "choice",
          id: "rb-wall-sensor",
          emoji: "🧱",
          title: { en: "Wall Sensor", id: "Sensor Tembok" },
          instructions: {
            en: "The sensor found a wall. Pick the smart action!",
            id: "Sensor menemukan tembok. Pilih aksi yang cerdas!",
          },
          scenario: {
            en: "The robot's sensor says a wall is right AHEAD. What should the robot do?",
            id: "Sensor robot bilang ada tembok tepat di DEPAN. Apa yang harus robot lakukan?",
          },
          options: [
            { emoji: "↩️", text: { en: "Turn to avoid it", id: "Berbelok menghindar" } },
            { emoji: "💥", text: { en: "Keep going forward", id: "Terus maju" } },
            { emoji: "🙈", text: { en: "Close its eyes", id: "Menutup mata" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "choice",
          id: "rb-light-sensor",
          emoji: "🚦",
          title: { en: "Light Sensor", id: "Sensor Lampu" },
          instructions: {
            en: "Follow the rule for the light the sensor sees.",
            id: "Ikuti aturan untuk lampu yang dilihat sensor.",
          },
          scenario: {
            en: "Rule: IF the robot sees GREEN, go; IF RED, stop. The sensor sees red. What does the robot do?",
            id: "Aturan: JIKA robot melihat HIJAU, jalan; JIKA MERAH, berhenti. Sensor melihat merah. Apa yang robot lakukan?",
          },
          options: [
            { emoji: "🛑", text: { en: "Stop", id: "Berhenti" } },
            { emoji: "🏃", text: { en: "Go", id: "Jalan" } },
            { emoji: "📣", text: { en: "Honk loudly", id: "Klakson keras" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "debug",
          id: "rb-confused",
          emoji: "🐞",
          title: { en: "Confused Robot", id: "Robot Bingung" },
          instructions: {
            en: "Rule: IF there's an obstacle, STOP. One step breaks the rule — tap it!",
            id: "Aturan: JIKA ada rintangan, BERHENTI. Satu langkah melanggar aturan — ketuk!",
          },
          steps: [
            { emoji: "👁️", text: { en: "See a rock ahead", id: "Lihat batu di depan" } },
            { emoji: "🏎️", text: { en: "Speed up", id: "Tancap gas" } },
            { emoji: "💥", text: { en: "Crash into it", id: "Menabraknya" } },
            { emoji: "🔧", text: { en: "Get repaired", id: "Diperbaiki" } },
          ],
          wrongIndex: 1,
          fixOptions: [
            { emoji: "🛑", text: { en: "Stop before the rock", id: "Berhenti sebelum batu" } },
            { emoji: "🎉", text: { en: "Throw a party", id: "Adakan pesta" } },
            { emoji: "💨", text: { en: "Go even faster", id: "Melaju lebih cepat" } },
          ],
          correctFixIndex: 0,
        },
      ],
    },
    {
      id: "decision-trees",
      emoji: "🌳",
      color: "#9333ea",
      title: { en: "Decision Trees", id: "Pohon Keputusan" },
      description: {
        en: "Ask one question, then another — each answer leads to the next choice.",
        id: "Tanya satu hal, lalu hal lain — tiap jawaban menuntun ke pilihan berikutnya.",
      },
      games: [
        {
          kind: "choice",
          id: "rb-two-questions",
          emoji: "🍎",
          title: { en: "Two Questions", id: "Dua Pertanyaan" },
          instructions: {
            en: "Follow the tree: first question, then the next.",
            id: "Ikuti pohonnya: pertanyaan pertama, lalu berikutnya.",
          },
          scenario: {
            en: "The robot asks: Is it a fruit? If yes → Is it red? An apple is a fruit AND red. Which box?",
            id: "Robot bertanya: Apakah buah? Jika ya → Apakah merah? Apel itu buah DAN merah. Kotak mana?",
          },
          options: [
            { emoji: "🟥", text: { en: "The red-fruit box", id: "Kotak buah-merah" } },
            { emoji: "🥬", text: { en: "The vegetable box", id: "Kotak sayur" } },
            { emoji: "🟨", text: { en: "The yellow-fruit box", id: "Kotak buah-kuning" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "order",
          id: "rb-sorting-brain",
          emoji: "📦",
          title: { en: "The Sorting Brain", id: "Otak Penyortir" },
          instructions: {
            en: "Put the robot's decision steps in order!",
            id: "Susun langkah keputusan robot dengan urutan!",
          },
          items: [
            { emoji: "👀", text: { en: "Look at the item", id: "Lihat barangnya" } },
            { emoji: "🔺", text: { en: "Check its shape", id: "Periksa bentuknya" } },
            { emoji: "🎨", text: { en: "Check its color", id: "Periksa warnanya" } },
            { emoji: "📦", text: { en: "Put it in the right box", id: "Taruh di kotak yang benar" } },
          ],
        },
        {
          kind: "robot",
          id: "rb-follow-plan",
          emoji: "🤖",
          title: { en: "Follow the Plan", id: "Ikuti Rencana" },
          instructions: {
            en: "A wall blocks the way. Go up and around to reach the goal!",
            id: "Tembok menghalangi. Naik dan memutar untuk mencapai tujuan!",
          },
          cols: 5,
          rows: 3,
          start: { x: 0, y: 1 },
          goal: { x: 4, y: 1 },
          walls: [{ x: 2, y: 1 }],
          palette: [
            { dx: 1, dy: 0, times: 1 },
            { dx: 0, dy: -1, times: 1 },
            { dx: 0, dy: 1, times: 1 },
          ],
          maxBlocks: 6,
        },
      ],
    },
    {
      id: "robot-rules",
      emoji: "⚙️",
      color: "#6b21a8",
      title: { en: "Robot Rules", id: "Aturan Robot" },
      description: {
        en: "Chain rules together: if not this, then check that.",
        id: "Rangkai aturan: jika bukan ini, maka periksa itu.",
      },
      games: [
        {
          kind: "choice",
          id: "rb-if-else-chain",
          emoji: "🏅",
          title: { en: "If-Else Chain", id: "Rantai Jika-Selain" },
          instructions: {
            en: "Walk down the chain until a rule fits.",
            id: "Telusuri rantai sampai ada aturan yang cocok.",
          },
          scenario: {
            en: "Rule: IF score > 100 → gold; ELSE IF score > 50 → silver; ELSE bronze. The score is 70. Which medal?",
            id: "Aturan: JIKA skor > 100 → emas; SELAIN ITU JIKA skor > 50 → perak; SELAIN ITU perunggu. Skornya 70. Medali apa?",
          },
          options: [
            { emoji: "🥈", text: { en: "Silver", id: "Perak" } },
            { emoji: "🥇", text: { en: "Gold", id: "Emas" } },
            { emoji: "🥉", text: { en: "Bronze", id: "Perunggu" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "debug",
          id: "rb-backwards",
          emoji: "🔀",
          title: { en: "Backwards Brain", id: "Otak Terbalik" },
          instructions: {
            en: "Rule: IF the battery is low, recharge. One step makes no sense — tap it!",
            id: "Aturan: JIKA baterai lemah, isi ulang. Satu langkah tak masuk akal — ketuk!",
          },
          steps: [
            { emoji: "🪫", text: { en: "Battery is low", id: "Baterai lemah" } },
            { emoji: "🔍", text: { en: "Robot checks the rule", id: "Robot memeriksa aturan" } },
            { emoji: "🍔", text: { en: "Eat a burger", id: "Makan burger" } },
            { emoji: "✅", text: { en: "Back to work", id: "Kembali bekerja" } },
          ],
          wrongIndex: 2,
          fixOptions: [
            { emoji: "🔌", text: { en: "Recharge the battery", id: "Isi ulang baterai" } },
            { emoji: "🎈", text: { en: "Blow up a balloon", id: "Tiup balon" } },
            { emoji: "🕺", text: { en: "Dance around", id: "Menari-nari" } },
          ],
          correctFixIndex: 0,
        },
        {
          kind: "choice",
          id: "rb-best-decision",
          emoji: "🌊",
          title: { en: "Best Decision", id: "Keputusan Terbaik" },
          instructions: {
            en: "Weigh the options and pick the safe one.",
            id: "Timbang pilihannya dan ambil yang aman.",
          },
          scenario: {
            en: "The robot must cross a river. It sees: a broken bridge, deep water, and a sturdy boat. The smart decision?",
            id: "Robot harus menyeberangi sungai. Ia melihat: jembatan rusak, air dalam, dan perahu kokoh. Keputusan cerdasnya?",
          },
          options: [
            { emoji: "⛵", text: { en: "Take the sturdy boat", id: "Naik perahu kokoh" } },
            { emoji: "🌉", text: { en: "Walk on the broken bridge", id: "Lewati jembatan rusak" } },
            { emoji: "🌊", text: { en: "Swim in the deep water", id: "Berenang di air dalam" } },
          ],
          correctIndex: 0,
        },
      ],
    },
  ],
};
