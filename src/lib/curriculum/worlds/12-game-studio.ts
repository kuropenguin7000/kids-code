import type { WorldDef } from "../types";

export const world: WorldDef = {
  id: "game-studio",
  emoji: "🎮",
  color: "#db2777",
  title: { en: "Game Studio", id: "Studio Game" },
  description: {
    en: "Make games react! Learn how programs respond to what players do.",
    id: "Buat game bereaksi! Pelajari cara program menanggapi aksi pemain.",
  },
  levels: [
    {
      id: "events",
      emoji: "⚡",
      color: "#db2777",
      title: { en: "When This, Do That", id: "Jika Ini, Lakukan Itu" },
      description: {
        en: "Games listen for events — like a tap or a bump — then do something.",
        id: "Game menunggu kejadian — seperti ketukan atau tabrakan — lalu melakukan sesuatu.",
      },
      games: [
        {
          kind: "choice",
          id: "gs-jump",
          emoji: "🦘",
          title: { en: "Press to Jump", id: "Tekan untuk Lompat" },
          instructions: {
            en: "An event triggers an action. Pick the right reaction!",
            id: "Sebuah kejadian memicu aksi. Pilih reaksi yang tepat!",
          },
          scenario: {
            en: "In the game: WHEN the player taps the button, the hero should...",
            id: "Di dalam game: KETIKA pemain menekan tombol, sang jagoan harus...",
          },
          options: [
            { emoji: "🦘", text: { en: "Jump", id: "Melompat" } },
            { emoji: "😴", text: { en: "Fall asleep", id: "Tertidur" } },
            { emoji: "🪨", text: { en: "Do nothing", id: "Diam saja" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "choice",
          id: "gs-coin",
          emoji: "🪙",
          title: { en: "Collect the Coin", id: "Ambil Koin" },
          instructions: {
            en: "What should happen when the hero grabs a coin?",
            id: "Apa yang harus terjadi saat jagoan mengambil koin?",
          },
          scenario: {
            en: "WHEN the hero touches a coin, the score should...",
            id: "KETIKA jagoan menyentuh koin, skornya harus...",
          },
          options: [
            { emoji: "⬆️", text: { en: "Go up", id: "Naik" } },
            { emoji: "⬇️", text: { en: "Go down", id: "Turun" } },
            { emoji: "💨", text: { en: "Make the hero vanish", id: "Membuat jagoan hilang" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "debug",
          id: "gs-wrong-reaction",
          emoji: "🐛",
          title: { en: "Wrong Reaction", id: "Reaksi yang Salah" },
          instructions: {
            en: "Rule: WHEN the hero touches spikes, lose a life. One step is wrong!",
            id: "Aturan: KETIKA jagoan menyentuh duri, kurangi nyawa. Satu langkah salah!",
          },
          steps: [
            { emoji: "🦔", text: { en: "Hero touches the spikes", id: "Jagoan menyentuh duri" } },
            { emoji: "🎉", text: { en: "Play happy music", id: "Putar musik gembira" } },
            { emoji: "📉", text: { en: "Check the lives left", id: "Cek sisa nyawa" } },
            { emoji: "🔁", text: { en: "Keep playing", id: "Lanjut bermain" } },
          ],
          wrongIndex: 1,
          fixOptions: [
            { emoji: "💔", text: { en: "Lose a life", id: "Kurangi satu nyawa" } },
            { emoji: "🏆", text: { en: "Win the game", id: "Menangkan game" } },
            { emoji: "🪙", text: { en: "Add a coin", id: "Tambah koin" } },
          ],
          correctFixIndex: 0,
        },
      ],
    },
    {
      id: "game-loop",
      emoji: "🔁",
      color: "#e11d48",
      title: { en: "The Game Loop", id: "Perulangan Game" },
      description: {
        en: "Games repeat the same steps super fast, over and over — that's the game loop.",
        id: "Game mengulang langkah yang sama sangat cepat, berulang-ulang — itulah perulangan game.",
      },
      games: [
        {
          kind: "order",
          id: "gs-loop-order",
          emoji: "🖼️",
          title: { en: "Every Frame", id: "Setiap Bingkai" },
          instructions: {
            en: "Put the game-loop steps in the order they run each frame!",
            id: "Susun langkah perulangan game sesuai urutan tiap bingkai!",
          },
          items: [
            { emoji: "🎮", text: { en: "Read the buttons", id: "Baca tombolnya" } },
            { emoji: "🏃", text: { en: "Move the players", id: "Gerakkan pemain" } },
            { emoji: "🖼️", text: { en: "Draw the screen", id: "Gambar layarnya" } },
            { emoji: "🔁", text: { en: "Do it all again", id: "Ulangi semuanya" } },
          ],
        },
        {
          kind: "choice",
          id: "gs-gameover",
          emoji: "💀",
          title: { en: "Game Over Rule", id: "Aturan Game Over" },
          instructions: {
            en: "Pick what the game does when the rule is met.",
            id: "Pilih apa yang game lakukan saat aturan terpenuhi.",
          },
          scenario: {
            en: "WHEN the player's lives reach 0, the game should...",
            id: "KETIKA nyawa pemain jadi 0, game harus...",
          },
          options: [
            { emoji: "🛑", text: { en: "Show \"Game Over\"", id: "Tampilkan \"Game Over\"" } },
            { emoji: "🎁", text: { en: "Give more coins", id: "Beri lebih banyak koin" } },
            { emoji: "⏩", text: { en: "Speed everything up", id: "Percepat semuanya" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "pattern",
          id: "gs-blink",
          emoji: "✨",
          title: { en: "Blinking Star", id: "Bintang Berkedip" },
          instructions: {
            en: "The star blinks on and off every frame. What comes next?",
            id: "Bintang berkedip nyala-mati tiap bingkai. Apa berikutnya?",
          },
          sequence: ["⭐", "⬛", "⭐", "⬛", "⭐"],
          options: ["⭐", "⬛"],
          answer: "⬛",
        },
      ],
    },
    {
      id: "level-design",
      emoji: "🏗️",
      color: "#be185d",
      title: { en: "Level Design", id: "Desain Level" },
      description: {
        en: "Design fun levels — decide what to place and how hard to make it.",
        id: "Rancang level seru — tentukan apa yang ditaruh dan seberapa sulit.",
      },
      games: [
        {
          kind: "order",
          id: "gs-build-level",
          emoji: "🚩",
          title: { en: "Build a Level", id: "Bangun Level" },
          instructions: {
            en: "Put the level-building steps in a sensible order!",
            id: "Susun langkah membangun level dengan urutan yang masuk akal!",
          },
          items: [
            { emoji: "🟫", text: { en: "Lay down the ground", id: "Pasang tanahnya" } },
            { emoji: "👾", text: { en: "Add some enemies", id: "Tambahkan musuh" } },
            { emoji: "🪙", text: { en: "Sprinkle coins", id: "Taburkan koin" } },
            { emoji: "🚩", text: { en: "Place the goal flag", id: "Pasang bendera tujuan" } },
          ],
        },
        {
          kind: "choice",
          id: "gs-difficulty",
          emoji: "🎚️",
          title: { en: "Difficulty Dial", id: "Pengatur Kesulitan" },
          instructions: {
            en: "Which change makes the level HARDER?",
            id: "Perubahan mana yang membuat level lebih SULIT?",
          },
          scenario: {
            en: "To make the game harder, the designer should...",
            id: "Untuk membuat game lebih sulit, sang desainer harus...",
          },
          options: [
            { emoji: "👾", text: { en: "Add more enemies", id: "Tambah lebih banyak musuh" } },
            { emoji: "🧹", text: { en: "Remove all enemies", id: "Hapus semua musuh" } },
            { emoji: "🛡️", text: { en: "Make the hero invincible", id: "Buat jagoan kebal" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "debug",
          id: "gs-buggy-level",
          emoji: "🐞",
          title: { en: "Buggy Level", id: "Level Berbug" },
          instructions: {
            en: "One building step would break the whole level. Tap it!",
            id: "Satu langkah membangun akan merusak seluruh level. Ketuk!",
          },
          steps: [
            { emoji: "🟫", text: { en: "Lay the ground", id: "Pasang tanah" } },
            { emoji: "🦸", text: { en: "Place the hero", id: "Tempatkan jagoan" } },
            { emoji: "🕳️", text: { en: "Delete the ground", id: "Hapus tanahnya" } },
            { emoji: "🚩", text: { en: "Place the goal", id: "Pasang tujuan" } },
          ],
          wrongIndex: 2,
          fixOptions: [
            { emoji: "🪙", text: { en: "Add a coin", id: "Tambah koin" } },
            { emoji: "🌋", text: { en: "Fill it with lava", id: "Isi dengan lava" } },
            { emoji: "🚮", text: { en: "Delete the hero too", id: "Hapus jagoan juga" } },
          ],
          correctFixIndex: 0,
        },
      ],
    },
  ],
};
