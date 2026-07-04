import type { WorldDef } from "../types";

export const world: WorldDef = {
  id: "melody-makers",
  emoji: "🎵",
  color: "#be123c",
  title: { en: "Melody Makers", id: "Pencipta Melodi" },
  description: {
    en: "Compose songs with sequences, loops and patterns — music is code you can hear!",
    id: "Ciptakan lagu dengan urutan, perulangan, dan pola — musik adalah kode yang bisa didengar!",
  },
  levels: [
    {
      id: "note-by-note",
      emoji: "🎼",
      color: "#be123c",
      title: { en: "Note by Note", id: "Nada demi Nada" },
      description: {
        en: "A song is a sequence — notes played in just the right order.",
        id: "Lagu adalah urutan — nada yang dimainkan dengan susunan yang tepat.",
      },
      games: [
        {
          kind: "order",
          id: "mm-simple-song",
          emoji: "🎸",
          title: { en: "The Simple Song", id: "Lagu Sederhana" },
          instructions: {
            en: "Put the steps of playing a song in order!",
            id: "Susun langkah memainkan lagu dengan urutan!",
          },
          items: [
            { emoji: "🎸", text: { en: "Tune the guitar", id: "Setem gitarnya" } },
            { emoji: "🎵", text: { en: "Start the melody", id: "Mulai melodinya" } },
            { emoji: "📈", text: { en: "Build it up", id: "Bangun makin ramai" } },
            { emoji: "🎆", text: { en: "Big finish!", id: "Akhir yang megah!" } },
          ],
        },
        {
          kind: "pattern",
          id: "mm-beat",
          emoji: "🥁",
          title: { en: "The Beat", id: "Ketukan" },
          instructions: {
            en: "The drum beat repeats: boom, clap. What comes next?",
            id: "Ketukan drum berulang: boom, tepuk. Apa berikutnya?",
          },
          sequence: ["🥁", "👏", "🥁", "👏", "🥁"],
          options: ["🥁", "👏"],
          answer: "👏",
        },
        {
          kind: "choice",
          id: "mm-chorus",
          emoji: "🔁",
          title: { en: "Repeat the Chorus", id: "Ulangi Refrein" },
          instructions: {
            en: "What is the short way to sing the chorus three times?",
            id: "Apa cara singkat menyanyikan refrein tiga kali?",
          },
          scenario: {
            en: "A song sings the chorus 3 times in a row. What is the SHORTEST way to write it?",
            id: "Sebuah lagu menyanyikan refrein 3 kali berturut-turut. Apa cara PALING SINGKAT menulisnya?",
          },
          options: [
            { emoji: "🔁", text: { en: "Repeat 3 times: chorus", id: "Ulangi 3 kali: refrein" } },
            { emoji: "📜", text: { en: "Write the chorus out once", id: "Tulis refreinnya sekali" } },
            { emoji: "🎲", text: { en: "Play 3 different songs", id: "Mainkan 3 lagu berbeda" } },
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "loop-the-beat",
      emoji: "🔁",
      color: "#e11d48",
      title: { en: "Loop the Beat", id: "Ulangi Ketukan" },
      description: {
        en: "Great songs loop — the same beat again and again keeps the groove going.",
        id: "Lagu hebat berulang — ketukan yang sama berkali-kali menjaga iramanya.",
      },
      games: [
        {
          kind: "choice",
          id: "mm-drum-loop",
          emoji: "🥁",
          title: { en: "Drum Loop", id: "Perulangan Drum" },
          instructions: {
            en: "What do we call a beat that plays over and over?",
            id: "Apa nama ketukan yang dimainkan berulang-ulang?",
          },
          scenario: {
            en: "The drummer plays \"boom boom clap\" over and over for the whole song. This is a...",
            id: "Drummer memainkan \"boom boom tepuk\" berulang-ulang sepanjang lagu. Ini disebut...",
          },
          options: [
            { emoji: "🔁", text: { en: "A loop", id: "Perulangan" } },
            { emoji: "1️⃣", text: { en: "A single note", id: "Satu nada" } },
            { emoji: "❌", text: { en: "A mistake", id: "Kesalahan" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "pattern",
          id: "mm-keys",
          emoji: "🎹",
          title: { en: "Piano Pattern", id: "Pola Piano" },
          instructions: {
            en: "The keys repeat red, yellow, blue. Which key comes next?",
            id: "Tuts berulang merah, kuning, biru. Tuts mana berikutnya?",
          },
          sequence: ["🔴", "🟡", "🔵", "🔴", "🟡", "🔵", "🔴"],
          options: ["🔴", "🟡", "🔵"],
          answer: "🟡",
        },
        {
          kind: "debug",
          id: "mm-rhythm-bug",
          emoji: "🐞",
          title: { en: "Broken Rhythm", id: "Irama Rusak" },
          instructions: {
            en: "The rhythm should repeat clap, clap, stomp. Tap the wrong move!",
            id: "Iramanya harusnya berulang tepuk, tepuk, hentak. Ketuk gerakan yang salah!",
          },
          steps: [
            { emoji: "👏", text: { en: "Clap", id: "Tepuk" } },
            { emoji: "👏", text: { en: "Clap", id: "Tepuk" } },
            { emoji: "🦶", text: { en: "Stomp", id: "Hentak" } },
            { emoji: "🎺", text: { en: "Toot a horn", id: "Tiup terompet" } },
          ],
          wrongIndex: 3,
          fixOptions: [
            { emoji: "👏", text: { en: "Clap", id: "Tepuk" } },
            { emoji: "🦶", text: { en: "Stomp", id: "Hentak" } },
            { emoji: "😴", text: { en: "Yawn", id: "Menguap" } },
          ],
          correctFixIndex: 0,
        },
      ],
    },
    {
      id: "compose",
      emoji: "🎶",
      color: "#9f1239",
      title: { en: "Compose!", id: "Berkarya!" },
      description: {
        en: "Put sequences, loops and patterns together into a whole song.",
        id: "Gabungkan urutan, perulangan, dan pola menjadi sebuah lagu utuh.",
      },
      games: [
        {
          kind: "order",
          id: "mm-structure",
          emoji: "🎼",
          title: { en: "Song Structure", id: "Struktur Lagu" },
          instructions: {
            en: "Put the parts of a song in the usual order!",
            id: "Susun bagian-bagian lagu dengan urutan yang biasa!",
          },
          items: [
            { emoji: "🎼", text: { en: "Intro", id: "Pembuka" } },
            { emoji: "📝", text: { en: "Verse", id: "Bait" } },
            { emoji: "🎶", text: { en: "Chorus", id: "Refrein" } },
            { emoji: "🔚", text: { en: "Ending", id: "Penutup" } },
          ],
        },
        {
          kind: "choice",
          id: "mm-longer",
          emoji: "➰",
          title: { en: "Make it Longer", id: "Buat Lebih Panjang" },
          instructions: {
            en: "How can the song be longer without writing more notes?",
            id: "Bagaimana lagu jadi lebih panjang tanpa menulis nada baru?",
          },
          scenario: {
            en: "To make the song twice as long without writing more notes, the composer...",
            id: "Untuk membuat lagu dua kali lebih panjang tanpa menulis nada baru, sang komposer...",
          },
          options: [
            { emoji: "🔁", text: { en: "Loops the whole song again", id: "Mengulang seluruh lagu lagi" } },
            { emoji: "✂️", text: { en: "Deletes the chorus", id: "Menghapus refreinnya" } },
            { emoji: "⏩", text: { en: "Plays it faster", id: "Memainkannya lebih cepat" } },
          ],
          correctIndex: 0,
        },
        {
          kind: "pattern",
          id: "mm-light-show",
          emoji: "💡",
          title: { en: "Light Show", id: "Pertunjukan Lampu" },
          instructions: {
            en: "Stage lights repeat: red, green, green. What comes next?",
            id: "Lampu panggung berulang: merah, hijau, hijau. Apa berikutnya?",
          },
          sequence: ["🔴", "🟢", "🟢", "🔴", "🟢", "🟢", "🔴", "🟢"],
          options: ["🔴", "🟢"],
          answer: "🟢",
        },
      ],
    },
  ],
};
