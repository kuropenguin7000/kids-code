export type L10n = {
  en: string;
  id: string;
};

type GameBase = {
  id: string;
  emoji: string;
  title: L10n;
  /** Short, kid-friendly explanation of what to do. */
  instructions: L10n;
};

/** Tap the cards in the correct order (sequencing). */
export type OrderGame = GameBase & {
  kind: "order";
  /** Items listed in the CORRECT order; the UI shuffles them. */
  items: { emoji: string; text: L10n }[];
};

/** Program a robot with movement blocks to reach the goal (commands/loops). */
export type RobotGame = GameBase & {
  kind: "robot";
  cols: number;
  rows: number;
  start: { x: number; y: number };
  goal: { x: number; y: number };
  walls: { x: number; y: number }[];
  /** Available command blocks; times > 1 makes it a "repeat" block. */
  palette: { dx: number; dy: number; times: number }[];
  /** Max number of blocks allowed (forces precision / loop use). */
  maxBlocks: number | null;
};

/** Pick what comes next in the sequence (patterns). */
export type PatternGame = GameBase & {
  kind: "pattern";
  sequence: string[];
  options: string[];
  answer: string;
};

/** "If this, then that" scenario with one correct choice (conditionals). */
export type ChoiceGame = GameBase & {
  kind: "choice";
  scenario: L10n;
  options: { emoji: string; text: L10n }[];
  correctIndex: number;
};

/** Find the wrong step, then pick the fix (debugging). */
export type DebugGame = GameBase & {
  kind: "debug";
  steps: { emoji: string; text: L10n }[];
  wrongIndex: number;
  fixOptions: { emoji: string; text: L10n }[];
  correctFixIndex: number;
};

/** Type and run real JavaScript (final level). */
export type CodeGame = GameBase & {
  kind: "code";
  intro: L10n;
  hint: L10n;
  starterCode: string;
  /** If set, completed when trimmed output matches; if null, any error-free run wins. */
  expectedOutput: string | null;
};

export type Game =
  | OrderGame
  | RobotGame
  | PatternGame
  | ChoiceGame
  | DebugGame
  | CodeGame;

export type Level = {
  id: string;
  number: number;
  emoji: string;
  color: string;
  title: L10n;
  description: L10n;
  games: Game[];
};

/** A themed chapter grouping a handful of levels (Duolingo-style unit). */
export type World = {
  id: string;
  number: number;
  emoji: string;
  color: string;
  title: L10n;
  description: L10n;
  levels: Level[];
};

const levels: Level[] = [
  // ------------------------------------------------------------------
  {
    id: "sequencing",
    number: 1,
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
          { emoji: "🎒", text: { en: "Go to school", id: "Berangkat sekolah" } },
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
          { emoji: "🌱", text: { en: "Drop in the seed", id: "Masukkan biji" } },
          { emoji: "🪨", text: { en: "Cover with soil", id: "Tutup dengan tanah" } },
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
          { emoji: "🍞", text: { en: "Put down the bread", id: "Taruh rotinya" } },
          { emoji: "🧀", text: { en: "Add the cheese", id: "Tambahkan keju" } },
          { emoji: "🍞", text: { en: "Put bread on top", id: "Tutup dengan roti" } },
          { emoji: "😋", text: { en: "Take a big bite", id: "Gigit besar-besar" } },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------
  {
    id: "commands",
    number: 2,
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
  // ------------------------------------------------------------------
  {
    id: "patterns",
    number: 3,
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
  // ------------------------------------------------------------------
  {
    id: "loops",
    number: 4,
    emoji: "🔁",
    color: "#8b5cf6",
    title: { en: "Repeat Power", id: "Kekuatan Mengulang" },
    description: {
      en: "Why say it five times when you can say it once? Loops repeat things for you!",
      id: "Kenapa bilang lima kali kalau bisa sekali saja? Perulangan mengulang untukmu!",
    },
    games: [
      {
        kind: "choice",
        id: "loop-song",
        emoji: "🎤",
        title: { en: "The Robot Song", id: "Lagu Robot" },
        instructions: {
          en: "Loops say things again and again — the short way.",
          id: "Perulangan mengucapkan sesuatu berkali-kali — dengan cara singkat.",
        },
        scenario: {
          en: "Robo sings: \"La La La La\" (4 times). What is the SHORTEST way to write his song?",
          id: "Robo bernyanyi: \"La La La La\" (4 kali). Mana cara PALING SINGKAT menulis lagunya?",
        },
        options: [
          { emoji: "🔁", text: { en: "Repeat 4 times: La", id: "Ulangi 4 kali: La" } },
          { emoji: "📜", text: { en: "La La La La La La", id: "La La La La La La" } },
          { emoji: "🔂", text: { en: "Repeat 2 times: La", id: "Ulangi 2 kali: La" } },
        ],
        correctIndex: 0,
      },
      {
        kind: "robot",
        id: "loop-corridor",
        emoji: "🏃",
        title: { en: "The Long Hallway", id: "Lorong Panjang" },
        instructions: {
          en: "The star is 5 steps away, but you may only use 1 block. Pick the repeat block!",
          id: "Bintangnya 5 langkah jauhnya, tapi kamu hanya boleh pakai 1 balok. Pilih balok pengulang!",
        },
        cols: 6,
        rows: 3,
        start: { x: 0, y: 1 },
        goal: { x: 5, y: 1 },
        walls: [],
        palette: [
          { dx: 1, dy: 0, times: 1 },
          { dx: 1, dy: 0, times: 5 },
          { dx: 0, dy: -1, times: 1 },
        ],
        maxBlocks: 1,
      },
      {
        kind: "robot",
        id: "loop-stairs",
        emoji: "⛰️",
        title: { en: "Mountain Path", id: "Jalur Gunung" },
        instructions: {
          en: "Reach the star with only 2 blocks. Repeat blocks are your superpower!",
          id: "Capai bintang hanya dengan 2 balok. Balok pengulang adalah kekuatan supermu!",
        },
        cols: 4,
        rows: 4,
        start: { x: 0, y: 0 },
        goal: { x: 3, y: 3 },
        walls: [],
        palette: [
          { dx: 1, dy: 0, times: 1 },
          { dx: 0, dy: 1, times: 1 },
          { dx: 1, dy: 0, times: 3 },
          { dx: 0, dy: 1, times: 3 },
        ],
        maxBlocks: 2,
      },
    ],
  },
  // ------------------------------------------------------------------
  {
    id: "conditionals",
    number: 5,
    emoji: "🚦",
    color: "#ec4899",
    title: { en: "If This, Then That", id: "Jika Ini, Maka Itu" },
    description: {
      en: "Computers make choices with rules: IF something happens, THEN do something.",
      id: "Komputer memilih dengan aturan: JIKA sesuatu terjadi, MAKA lakukan sesuatu.",
    },
    games: [
      {
        kind: "choice",
        id: "cond-rain",
        emoji: "🌧️",
        title: { en: "Rainy Day Rule", id: "Aturan Hari Hujan" },
        instructions: {
          en: "Finish the rule so Robo stays dry!",
          id: "Lengkapi aturannya supaya Robo tetap kering!",
        },
        scenario: {
          en: "IF it is raining, THEN Robo should...",
          id: "JIKA hujan turun, MAKA Robo sebaiknya...",
        },
        options: [
          { emoji: "☂️", text: { en: "Open the umbrella", id: "Buka payung" } },
          { emoji: "🕶️", text: { en: "Wear sunglasses", id: "Pakai kacamata hitam" } },
          { emoji: "🏖️", text: { en: "Go to the beach", id: "Pergi ke pantai" } },
        ],
        correctIndex: 0,
      },
      {
        kind: "choice",
        id: "cond-light",
        emoji: "🚥",
        title: { en: "Traffic Light Rule", id: "Aturan Lampu Lalu Lintas" },
        instructions: {
          en: "Robo is driving. Help him follow the rule!",
          id: "Robo sedang menyetir. Bantu dia mengikuti aturan!",
        },
        scenario: {
          en: "IF the traffic light is red, THEN Robo must...",
          id: "JIKA lampu lalu lintas merah, MAKA Robo harus...",
        },
        options: [
          { emoji: "🏎️", text: { en: "Drive faster", id: "Tancap gas" } },
          { emoji: "✋", text: { en: "Stop and wait", id: "Berhenti dan menunggu" } },
          { emoji: "🎵", text: { en: "Honk a song", id: "Klakson sambil bernyanyi" } },
        ],
        correctIndex: 1,
      },
      {
        kind: "choice",
        id: "cond-sort",
        emoji: "🍋",
        title: { en: "The Fruit Sorter", id: "Mesin Penyortir Buah" },
        instructions: {
          en: "Robo sorts fruit with a rule: IF the fruit is yellow, THEN put it in the yellow box, ELSE the red box.",
          id: "Robo menyortir buah dengan aturan: JIKA buahnya kuning, MAKA masukkan kotak kuning, SELAIN ITU kotak merah.",
        },
        scenario: {
          en: "A lemon 🍋 arrives on the belt. Where does it go?",
          id: "Sebuah lemon 🍋 datang di ban berjalan. Ke mana ia pergi?",
        },
        options: [
          { emoji: "🟥", text: { en: "The red box", id: "Kotak merah" } },
          { emoji: "🟨", text: { en: "The yellow box", id: "Kotak kuning" } },
          { emoji: "🗑️", text: { en: "The trash can", id: "Tempat sampah" } },
        ],
        correctIndex: 1,
      },
    ],
  },
  // ------------------------------------------------------------------
  {
    id: "debugging",
    number: 6,
    emoji: "🐞",
    color: "#ef4444",
    title: { en: "Bug Hunters", id: "Pemburu Bug" },
    description: {
      en: "When a program goes wrong, programmers hunt the mistake — the \"bug\" — and fix it!",
      id: "Saat program salah, programmer memburu kesalahannya — si \"bug\" — dan memperbaikinya!",
    },
    games: [
      {
        kind: "debug",
        id: "bug-flower",
        emoji: "🥤",
        title: { en: "The Thirsty Flower", id: "Bunga yang Kehausan" },
        instructions: {
          en: "Robo's flower plan has one wrong step. Tap the step that is wrong!",
          id: "Rencana bunga Robo punya satu langkah salah. Ketuk langkah yang salah!",
        },
        steps: [
          { emoji: "🕳️", text: { en: "Dig a hole", id: "Gali lubang" } },
          { emoji: "🌱", text: { en: "Drop in the seed", id: "Masukkan biji" } },
          { emoji: "🪨", text: { en: "Cover with soil", id: "Tutup dengan tanah" } },
          { emoji: "🧃", text: { en: "Water it with juice", id: "Siram dengan jus" } },
        ],
        wrongIndex: 3,
        fixOptions: [
          { emoji: "💧", text: { en: "Water it with water", id: "Siram dengan air" } },
          { emoji: "🍬", text: { en: "Cover it with candy", id: "Taburi permen" } },
          { emoji: "🎤", text: { en: "Sing it a song", id: "Nyanyikan lagu" } },
        ],
        correctFixIndex: 0,
      },
      {
        kind: "debug",
        id: "bug-cookie",
        emoji: "🍪",
        title: { en: "The Cookie Mission", id: "Misi Kue" },
        instructions: {
          en: "Robo wants the cookie on the HIGH shelf, but one step is wrong. Find it!",
          id: "Robo mau kue di rak yang TINGGI, tapi satu langkah salah. Temukan!",
        },
        steps: [
          { emoji: "🚶", text: { en: "Walk to the shelf", id: "Jalan ke rak" } },
          { emoji: "🧊", text: { en: "Open the fridge", id: "Buka kulkas" } },
          { emoji: "🙋", text: { en: "Reach up high", id: "Raih ke atas" } },
          { emoji: "🍪", text: { en: "Grab the cookie", id: "Ambil kuenya" } },
        ],
        wrongIndex: 1,
        fixOptions: [
          { emoji: "😴", text: { en: "Take a nap", id: "Tidur siang" } },
          { emoji: "🪑", text: { en: "Climb on the stool", id: "Naik ke bangku" } },
          { emoji: "📺", text: { en: "Watch TV", id: "Nonton TV" } },
        ],
        correctFixIndex: 1,
      },
      {
        kind: "debug",
        id: "bug-pattern",
        emoji: "🎨",
        title: { en: "The Broken Pattern", id: "Pola yang Rusak" },
        instructions: {
          en: "This pattern should go red, blue, red, blue... but one spot is broken. Tap the bug!",
          id: "Pola ini harusnya merah, biru, merah, biru... tapi satu titik rusak. Ketuk bug-nya!",
        },
        steps: [
          { emoji: "🔴", text: { en: "Red", id: "Merah" } },
          { emoji: "🔵", text: { en: "Blue", id: "Biru" } },
          { emoji: "🔴", text: { en: "Red", id: "Merah" } },
          { emoji: "🟢", text: { en: "Green", id: "Hijau" } },
          { emoji: "🔴", text: { en: "Red", id: "Merah" } },
        ],
        wrongIndex: 3,
        fixOptions: [
          { emoji: "🔵", text: { en: "Blue", id: "Biru" } },
          { emoji: "🟡", text: { en: "Yellow", id: "Kuning" } },
          { emoji: "🔴", text: { en: "Red", id: "Merah" } },
        ],
        correctFixIndex: 0,
      },
    ],
  },
  // ------------------------------------------------------------------
  {
    id: "variables",
    number: 7,
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
          en: "A box called 'name' holds the word \"Budi\". Robo says: \"Hello \" + name. What does he say?",
          id: "Kotak bernama 'name' berisi kata \"Budi\". Robo mengucapkan: \"Hello \" + name. Apa yang ia ucapkan?",
        },
        options: [
          { emoji: "🗣️", text: { en: "\"Hello name\"", id: "\"Hello name\"" } },
          { emoji: "👋", text: { en: "\"Hello Budi\"", id: "\"Hello Budi\"" } },
          { emoji: "🤖", text: { en: "\"Budi Budi\"", id: "\"Budi Budi\"" } },
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
  // ------------------------------------------------------------------
  {
    id: "decomposition",
    number: 8,
    emoji: "🧱",
    color: "#f97316",
    title: { en: "Big Problems, Small Pieces", id: "Masalah Besar, Potongan Kecil" },
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
          en: "\"Wash the dog\" is a BIG job. Break it into small steps in the right order!",
          id: "\"Memandikan anjing\" itu tugas BESAR. Pecah menjadi langkah kecil dengan urutan yang benar!",
        },
        items: [
          { emoji: "🛁", text: { en: "Fill the tub", id: "Isi bak dengan air" } },
          { emoji: "🐕", text: { en: "Put the dog in", id: "Masukkan anjingnya" } },
          { emoji: "🧼", text: { en: "Scrub with soap", id: "Gosok dengan sabun" } },
          { emoji: "🧺", text: { en: "Dry with a towel", id: "Keringkan dengan handuk" } },
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
          { emoji: "🍰", text: { en: "Split it: one room at a time", id: "Pecah: satu ruangan demi satu" } },
          { emoji: "🌪️", text: { en: "Do everything at once", id: "Kerjakan semuanya sekaligus" } },
          { emoji: "😴", text: { en: "Give up and nap", id: "Menyerah lalu tidur" } },
        ],
        correctIndex: 0,
      },
      {
        kind: "order",
        id: "dec-rocket",
        emoji: "🚀",
        title: { en: "The Space Mission", id: "Misi Luar Angkasa" },
        instructions: {
          en: "\"Fly to space\" = four small missions. Put them in order!",
          id: "\"Terbang ke luar angkasa\" = empat misi kecil. Susun urutannya!",
        },
        items: [
          { emoji: "🔧", text: { en: "Build the rocket", id: "Rakit roketnya" } },
          { emoji: "⛽", text: { en: "Fill up the fuel", id: "Isi bahan bakarnya" } },
          { emoji: "🔢", text: { en: "Count down 3, 2, 1", id: "Hitung mundur 3, 2, 1" } },
          { emoji: "🌌", text: { en: "Blast off!", id: "Meluncur!" } },
        ],
      },
    ],
  },
  // ------------------------------------------------------------------
  {
    id: "functions",
    number: 9,
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
          { emoji: "🎉", text: { en: "Wag, spin, and bark twice", id: "Goyang, berputar, dan menggonggong dua kali" } },
          { emoji: "🐕", text: { en: "Only one bark", id: "Hanya satu gonggongan" } },
          { emoji: "🪨", text: { en: "Nothing at all", id: "Tidak terjadi apa-apa" } },
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
          en: "The recipe greet(name) says \"Hello \" + name. What does greet(\"Sari\") do?",
          id: "Resep greet(nama) mengucapkan \"Hello \" + nama. Apa yang dilakukan greet(\"Sari\")?",
        },
        options: [
          { emoji: "🗣️", text: { en: "Says \"Hello name\"", id: "Mengucapkan \"Hello name\"" } },
          { emoji: "🍵", text: { en: "Makes a cup of tea", id: "Membuat secangkir teh" } },
          { emoji: "👋", text: { en: "Says \"Hello Sari\"", id: "Mengucapkan \"Hello Sari\"" } },
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
          { emoji: "🥣", text: { en: "Pour food into the bowl", id: "Tuang makanan ke mangkuk" } },
          { emoji: "🐶", text: { en: "Call the dog", id: "Panggil anjingnya" } },
          { emoji: "😺", text: { en: "Watch the cat eat", id: "Lihat kucingnya makan" } },
        ],
        wrongIndex: 2,
        fixOptions: [
          { emoji: "🐟", text: { en: "Call the fish", id: "Panggil ikannya" } },
          { emoji: "🐱", text: { en: "Call the cat", id: "Panggil kucingnya" } },
          { emoji: "🙈", text: { en: "Hide the bowl", id: "Sembunyikan mangkuknya" } },
        ],
        correctFixIndex: 1,
      },
    ],
  },
  // ------------------------------------------------------------------
  {
    id: "real-code",
    number: 10,
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
          en: "This is real JavaScript — the language of the web! The command say() makes the computer talk. Whatever you put between the quotes \" \" gets shown on the screen.",
          id: "Ini JavaScript sungguhan — bahasanya internet! Perintah say() membuat komputer bicara. Apa pun yang kamu tulis di antara tanda kutip \" \" akan muncul di layar.",
        },
        hint: {
          en: "Type: say(\"Hello, world!\") — don't forget the quotes!",
          id: "Ketik: say(\"Hello, world!\") — jangan lupa tanda kutipnya!",
        },
        starterCode: "// Type your command below 👇\nsay(\"\")\n",
        expectedOutput: "Hello, world!",
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
          en: "Remember repeat blocks? In real code a loop looks like this: for (let i = 1; i <= 3; i++) { ... } repeats 3 times, and i counts 1, 2, 3. \"⭐\".repeat(i) makes i stars!",
          id: "Ingat balok pengulang? Di kode sungguhan, perulangan seperti ini: for (let i = 1; i <= 3; i++) { ... } mengulang 3 kali, dan i menghitung 1, 2, 3. \"⭐\".repeat(i) membuat i bintang!",
        },
        hint: {
          en: "Inside the loop, write: say(\"⭐\".repeat(i))",
          id: "Di dalam perulangan, tulis: say(\"⭐\".repeat(i))",
        },
        starterCode: "// Build the stairs 👇\nfor (let i = 1; i <= 3; i++) {\n  \n}\n",
        expectedOutput: "⭐\n⭐⭐\n⭐⭐⭐",
      },
      {
        kind: "code",
        id: "code-freeplay",
        emoji: "🎨",
        title: { en: "Free Play: Your Program", id: "Bebas Berkarya: Programmu" },
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
        starterCode: "// Your playground — build anything! 👇\nsay(\"I am a programmer! 🎉\")\n",
        expectedOutput: null,
      },
    ],
  },
];

/** Themed chapters — each world bundles a few levels. New worlds append here. */
export const worlds: World[] = [
  {
    id: "robo-basics",
    number: 1,
    emoji: "🤖",
    color: "#f59e0b",
    title: { en: "Robo Basics", id: "Dasar Robo" },
    description: {
      en: "Meet Robo! Learn how computers follow steps, commands and patterns.",
      id: "Kenalan dengan Robo! Pelajari cara komputer mengikuti langkah, perintah, dan pola.",
    },
    levels: levels.slice(0, 3),
  },
  {
    id: "logic-land",
    number: 2,
    emoji: "🧠",
    color: "#8b5cf6",
    title: { en: "Logic Land", id: "Negeri Logika" },
    description: {
      en: "Loops, if-then rules and bug hunting — the thinking tools of every programmer.",
      id: "Perulangan, aturan jika-maka, dan berburu bug — alat berpikir setiap programmer.",
    },
    levels: levels.slice(3, 6),
  },
  {
    id: "builder-bay",
    number: 3,
    emoji: "🏗️",
    color: "#06b6d4",
    title: { en: "Builder Bay", id: "Teluk Pembangun" },
    description: {
      en: "Memory boxes, slicing big problems and magic recipes — build like a pro.",
      id: "Kotak ingatan, memecah masalah besar, dan resep ajaib — membangun seperti profesional.",
    },
    levels: levels.slice(6, 9),
  },
  {
    id: "code-castle",
    number: 4,
    emoji: "🏰",
    color: "#7c3aed",
    title: { en: "Code Castle", id: "Kastel Kode" },
    description: {
      en: "The grand finale: type and run real JavaScript, just like the pros!",
      id: "Babak puncak: ketik dan jalankan JavaScript sungguhan, seperti para profesional!",
    },
    levels: levels.slice(9, 10),
  },
];

/** Flat list of all levels across worlds. */
export const curriculum: Level[] = worlds.flatMap((world) => world.levels);

export const allGames: Game[] = curriculum.flatMap((level) => level.games);

export function findGame(gameId: string) {
  for (const world of worlds) {
    for (const level of world.levels) {
      const index = level.games.findIndex((g) => g.id === gameId);
      if (index !== -1) {
        const flatIndex = allGames.findIndex((g) => g.id === gameId);
        const next = allGames[flatIndex + 1] ?? null;
        return { game: level.games[index], level, world, next };
      }
    }
  }
  return null;
}

/** True when every game in the world is completed. */
export function isWorldCompleted(world: World, completed: Set<string>) {
  return world.levels.every((level) =>
    level.games.every((game) => completed.has(game.id))
  );
}
