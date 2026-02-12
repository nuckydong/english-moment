export interface Word {
  id: number;
  word: string;
  translation: string;
  imageUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'animals' | 'greetings' | 'classroom' | 'stationery' | 'family' | 'colors' | 'numbers' | 'food' | 'nature' | 'body';
  phonetic?: string;
}

export const wordsDatabase: Word[] = [
  // Easy words (3 letters) - Greetings & Basic
  { id: 1, word: 'hi', translation: '你好', imageUrl: '👋', difficulty: 'easy', category: 'greetings' },
  { id: 2, word: 'bye', translation: '再见', imageUrl: '👋', difficulty: 'easy', category: 'greetings' },
  { id: 3, word: 'yes', translation: '是的', imageUrl: '✅', difficulty: 'easy', category: 'greetings' },
  { id: 4, word: 'no', translation: '不', imageUrl: '❌', difficulty: 'easy', category: 'greetings' },
  { id: 5, word: 'cat', translation: '猫', imageUrl: '🐱', difficulty: 'easy', category: 'animals' },
  { id: 6, word: 'dog', translation: '狗', imageUrl: '🐶', difficulty: 'easy', category: 'animals' },
  { id: 7, word: 'sun', translation: '太阳', imageUrl: '☀️', difficulty: 'easy', category: 'nature' },
  { id: 8, word: 'pen', translation: '笔，钢笔', imageUrl: '🖊️', difficulty: 'easy', category: 'stationery' },
  { id: 9, word: 'cup', translation: '杯子', imageUrl: '🥤', difficulty: 'easy', category: 'classroom' },
  { id: 10, word: 'bag', translation: '书包', imageUrl: '🎒', difficulty: 'easy', category: 'stationery' },
  { id: 11, word: 'hat', translation: '帽子', imageUrl: '🎩', difficulty: 'easy', category: 'classroom' },
  { id: 12, word: 'bed', translation: '床', imageUrl: '🛏️', difficulty: 'easy', category: 'classroom' },
  { id: 13, word: 'car', translation: '汽车', imageUrl: '🚗', difficulty: 'easy', category: 'classroom' },
  { id: 14, word: 'bus', translation: '公交车', imageUrl: '🚌', difficulty: 'easy', category: 'classroom' },
  { id: 15, word: 'red', translation: '红色', imageUrl: '🔴', difficulty: 'easy', category: 'colors' },
  { id: 16, word: 'big', translation: '大的', imageUrl: '🔍', difficulty: 'easy', category: 'classroom' },
  { id: 17, word: 'run', translation: '跑', imageUrl: '🏃', difficulty: 'easy', category: 'body' },
  { id: 18, word: 'sit', translation: '坐', imageUrl: '🪑', difficulty: 'easy', category: 'classroom' },
  { id: 19, word: 'eat', translation: '吃', imageUrl: '🍽️', difficulty: 'easy', category: 'food' },
  { id: 20, word: 'mom', translation: '妈妈', imageUrl: '👩', difficulty: 'easy', category: 'family' },
  { id: 21, word: 'dad', translation: '爸爸', imageUrl: '👨', difficulty: 'easy', category: 'family' },
  { id: 22, word: 'boy', translation: '男孩', imageUrl: '👦', difficulty: 'easy', category: 'family' },
  { id: 23, word: 'toy', translation: '玩具', imageUrl: '🧸', difficulty: 'easy', category: 'classroom' },
  { id: 24, word: 'box', translation: '盒子', imageUrl: '📦', difficulty: 'easy', category: 'classroom' },
  { id: 25, word: 'fox', translation: '狐狸', imageUrl: '🦊', difficulty: 'easy', category: 'animals' },
  { id: 26, word: 'bee', translation: '蜜蜂', imageUrl: '🐝', difficulty: 'easy', category: 'animals' },
  { id: 27, word: 'pig', translation: '猪', imageUrl: '🐷', difficulty: 'easy', category: 'animals' },
  { id: 28, word: 'owl', translation: '猫头鹰', imageUrl: '🦉', difficulty: 'easy', category: 'animals' },
  { id: 29, word: 'ant', translation: '蚂蚁', imageUrl: '🐜', difficulty: 'easy', category: 'animals' },
  { id: 30, word: 'one', translation: '一', imageUrl: '1️⃣', difficulty: 'easy', category: 'numbers' },
  { id: 31, word: 'two', translation: '二', imageUrl: '2️⃣', difficulty: 'easy', category: 'numbers' },
  { id: 32, word: 'eye', translation: '眼睛', imageUrl: '👁️', difficulty: 'easy', category: 'body' },
  { id: 33, word: 'arm', translation: '手臂', imageUrl: '💪', difficulty: 'easy', category: 'body' },
  { id: 34, word: 'leg', translation: '腿', imageUrl: '🦵', difficulty: 'easy', category: 'body' },
  { id: 35, word: 'ear', translation: '耳朵', imageUrl: '👂', difficulty: 'easy', category: 'body' },

  // Medium words (4 letters) - Classroom & Stationery
  { id: 36, word: 'book', translation: '书', imageUrl: '📚', difficulty: 'medium', category: 'stationery' },
  { id: 37, word: 'desk', translation: '桌子', imageUrl: '🪑', difficulty: 'medium', category: 'classroom' },
  { id: 38, word: 'door', translation: '门', imageUrl: '🚪', difficulty: 'medium', category: 'classroom' },
  { id: 39, word: 'wall', translation: '墙', imageUrl: '🧱', difficulty: 'medium', category: 'classroom' },
  { id: 40, word: 'fish', translation: '鱼', imageUrl: '🐟', difficulty: 'medium', category: 'animals' },
  { id: 41, word: 'tree', translation: '树', imageUrl: '🌲', difficulty: 'medium', category: 'nature' },
  { id: 42, word: 'moon', translation: '月亮', imageUrl: '🌙', difficulty: 'medium', category: 'nature' },
  { id: 43, word: 'star', translation: '星星', imageUrl: '⭐', difficulty: 'medium', category: 'nature' },
  { id: 44, word: 'bird', translation: '鸟', imageUrl: '🐦', difficulty: 'medium', category: 'animals' },
  { id: 45, word: 'ball', translation: '球', imageUrl: '⚽', difficulty: 'medium', category: 'classroom' },
  { id: 46, word: 'cake', translation: '蛋糕', imageUrl: '🎂', difficulty: 'medium', category: 'food' },
  { id: 47, word: 'milk', translation: '牛奶', imageUrl: '🥛', difficulty: 'medium', category: 'food' },
  { id: 48, word: 'duck', translation: '鸭子', imageUrl: '🦆', difficulty: 'medium', category: 'animals' },
  { id: 49, word: 'bear', translation: '熊', imageUrl: '🐻', difficulty: 'medium', category: 'animals' },
  { id: 50, word: 'frog', translation: '青蛙', imageUrl: '🐸', difficulty: 'medium', category: 'animals' },
  { id: 51, word: 'rose', translation: '玫瑰', imageUrl: '🌹', difficulty: 'medium', category: 'nature' },
  { id: 52, word: 'kite', translation: '风筝', imageUrl: '🪁', difficulty: 'medium', category: 'classroom' },
  { id: 53, word: 'rule', translation: '尺子', imageUrl: '📏', difficulty: 'medium', category: 'stationery' },
  { id: 54, word: 'blue', translation: '蓝色', imageUrl: '🔵', difficulty: 'medium', category: 'colors' },
  { id: 55, word: 'pink', translation: '粉色', imageUrl: '🩷', difficulty: 'medium', category: 'colors' },
  { id: 56, word: 'open', translation: '打开', imageUrl: '📖', difficulty: 'medium', category: 'classroom' },
  { id: 57, word: 'shut', translation: '关闭', imageUrl: '🚪', difficulty: 'medium', category: 'classroom' },
  { id: 58, word: 'come', translation: '来', imageUrl: '🚶‍♂️', difficulty: 'medium', category: 'classroom' },
  { id: 59, word: 'look', translation: '看', imageUrl: '👀', difficulty: 'medium', category: 'body' },
  { id: 60, word: 'read', translation: '读', imageUrl: '📖', difficulty: 'medium', category: 'classroom' },
  { id: 61, word: 'draw', translation: '画', imageUrl: '✏️', difficulty: 'medium', category: 'stationery' },
  { id: 62, word: 'girl', translation: '女孩', imageUrl: '👧', difficulty: 'medium', category: 'family' },
  { id: 63, word: 'hand', translation: '手', imageUrl: '✋', difficulty: 'medium', category: 'body' },
  { id: 64, word: 'head', translation: '头', imageUrl: '🗣️', difficulty: 'medium', category: 'body' },
  { id: 65, word: 'foot', translation: '脚', imageUrl: '🦶', difficulty: 'medium', category: 'body' },
  { id: 66, word: 'nice', translation: '好的', imageUrl: '👍', difficulty: 'medium', category: 'greetings' },
  { id: 67, word: 'good', translation: '好', imageUrl: '✨', difficulty: 'medium', category: 'greetings' },
  { id: 68, word: 'help', translation: '帮助', imageUrl: '🤝', difficulty: 'medium', category: 'classroom' },
  { id: 69, word: 'name', translation: '名字', imageUrl: '📛', difficulty: 'medium', category: 'greetings' },
  { id: 70, word: 'here', translation: '这里', imageUrl: '📍', difficulty: 'medium', category: 'classroom' },

  // Hard words (5+ letters) - Advanced Classroom
  { id: 71, word: 'apple', translation: '苹果', imageUrl: '🍎', difficulty: 'hard', category: 'food' },
  { id: 72, word: 'house', translation: '房子', imageUrl: '🏠', difficulty: 'hard', category: 'classroom' },
  { id: 73, word: 'tiger', translation: '老虎', imageUrl: '🐯', difficulty: 'hard', category: 'animals' },
  { id: 74, word: 'piano', translation: '钢琴', imageUrl: '🎹', difficulty: 'hard', category: 'classroom' },
  { id: 75, word: 'bread', translation: '面包', imageUrl: '🍞', difficulty: 'hard', category: 'food' },
  { id: 76, word: 'clock', translation: '钟表', imageUrl: '⏰', difficulty: 'hard', category: 'classroom' },
  { id: 77, word: 'smile', translation: '微笑', imageUrl: '😊', difficulty: 'hard', category: 'body' },
  { id: 78, word: 'water', translation: '水', imageUrl: '💧', difficulty: 'hard', category: 'food' },
  { id: 79, word: 'heart', translation: '心', imageUrl: '❤️', difficulty: 'hard', category: 'body' },
  { id: 80, word: 'chair', translation: '椅子', imageUrl: '🪑', difficulty: 'hard', category: 'classroom' },
  { id: 81, word: 'table', translation: '桌子', imageUrl: '🪑', difficulty: 'hard', category: 'classroom' },
  { id: 82, word: 'paper', translation: '纸', imageUrl: '📄', difficulty: 'hard', category: 'stationery' },
  { id: 83, word: 'pencil', translation: '铅笔', imageUrl: '✏️', difficulty: 'hard', category: 'stationery' },
  { id: 84, word: 'eraser', translation: '橡皮', imageUrl: '🧽', difficulty: 'hard', category: 'stationery' },
  { id: 85, word: 'school', translation: '学校', imageUrl: '🏫', difficulty: 'hard', category: 'classroom' },
  { id: 86, word: 'teacher', translation: '老师', imageUrl: '👩‍🏫', difficulty: 'hard', category: 'classroom' },
  { id: 87, word: 'student', translation: '学生', imageUrl: '👨‍🎓', difficulty: 'hard', category: 'classroom' },
  { id: 88, word: 'hello', translation: '你好', imageUrl: '👋', difficulty: 'hard', category: 'greetings' },
  { id: 89, word: 'please', translation: '请', imageUrl: '🙏', difficulty: 'hard', category: 'greetings' },
  { id: 90, word: 'thank', translation: '谢谢', imageUrl: '🙏', difficulty: 'hard', category: 'greetings' },
  { id: 91, word: 'sorry', translation: '对不起', imageUrl: '😔', difficulty: 'hard', category: 'greetings' },
  { id: 92, word: 'listen', translation: '听', imageUrl: '👂', difficulty: 'hard', category: 'classroom' },
  { id: 93, word: 'write', translation: '写', imageUrl: '✍️', difficulty: 'hard', category: 'stationery' },
  { id: 94, word: 'color', translation: '颜色', imageUrl: '🎨', difficulty: 'hard', category: 'colors' },
  { id: 95, word: 'yellow', translation: '黄色', imageUrl: '🟡', difficulty: 'hard', category: 'colors' },
  { id: 96, word: 'green', translation: '绿色', imageUrl: '🟢', difficulty: 'hard', category: 'colors' },
  { id: 97, word: 'orange', translation: '橙色', imageUrl: '🟠', difficulty: 'hard', category: 'colors' },
  { id: 98, word: 'purple', translation: '紫色', imageUrl: '🟣', difficulty: 'hard', category: 'colors' },
  { id: 99, word: 'black', translation: '黑色', imageUrl: '⚫', difficulty: 'hard', category: 'colors' },
  { id: 100, word: 'white', translation: '白色', imageUrl: '⚪', difficulty: 'hard', category: 'colors' },
  { id: 101, word: 'three', translation: '三', imageUrl: '3️⃣', difficulty: 'hard', category: 'numbers' },
  { id: 102, word: 'four', translation: '四', imageUrl: '4️⃣', difficulty: 'hard', category: 'numbers' },
  { id: 103, word: 'five', translation: '五', imageUrl: '5️⃣', difficulty: 'hard', category: 'numbers' },
  { id: 104, word: 'seven', translation: '七', imageUrl: '7️⃣', difficulty: 'hard', category: 'numbers' },
  { id: 105, word: 'eight', translation: '八', imageUrl: '8️⃣', difficulty: 'hard', category: 'numbers' },
  { id: 106, word: 'nine', translation: '九', imageUrl: '9️⃣', difficulty: 'hard', category: 'numbers' },
  { id: 107, word: 'friend', translation: '朋友', imageUrl: '👫', difficulty: 'hard', category: 'greetings' },
  { id: 108, word: 'happy', translation: '高兴', imageUrl: '😊', difficulty: 'hard', category: 'greetings' },
  { id: 109, word: 'today', translation: '今天', imageUrl: '📅', difficulty: 'hard', category: 'greetings' },
  { id: 110, word: 'morning', translation: '早上', imageUrl: '🌅', difficulty: 'hard', category: 'greetings' },
  { id: 111, word: 'flower', translation: '花', imageUrl: '🌸', difficulty: 'hard', category: 'nature' },
  { id: 112, word: 'family', translation: '家庭', imageUrl: '👨‍👩‍👧‍👦', difficulty: 'hard', category: 'family' },
  { id: 113, word: 'sister', translation: '姐妹', imageUrl: '👭', difficulty: 'hard', category: 'family' },
  { id: 114, word: 'brother', translation: '兄弟', imageUrl: '👬', difficulty: 'hard', category: 'family' },
  { id: 115, word: 'window', translation: '窗户', imageUrl: '🪟', difficulty: 'hard', category: 'classroom' },
  { id: 116, word: 'blackboard', translation: '黑板', imageUrl: '◼', difficulty: 'hard', category: 'classroom' },
  { id: 117, word: 'marker', translation: '马克笔', imageUrl: '🖍️', difficulty: 'hard', category: 'stationery' },
  { id: 118, word: 'crayon', translation: '蜡笔', imageUrl: '🖍️', difficulty: 'hard', category: 'stationery' },
  { id: 119, word: 'notebook', translation: '笔记本', imageUrl: '📓', difficulty: 'hard', category: 'stationery' },
  { id: 120, word: 'scissors', translation: '剪刀', imageUrl: '✂️', difficulty: 'hard', category: 'stationery' },
];

export const wordPhonetics: Record<string, string> = {
  hi: '/haɪ/',
  bye: '/baɪ/',
  yes: '/jes/',
  no: '/nəʊ/',
  cat: '/kæt/',
  dog: '/dɔːɡ/',
  sun: '/sʌn/',
  pen: '/pen/',
  cup: '/kʌp/',
  bag: '/bæɡ/',
  hat: '/hæt/',
  bed: '/bed/',
  car: '/kɑːr/',
  bus: '/bʌs/',
  red: '/red/',
  big: '/bɪɡ/',
  run: '/rʌn/',
  sit: '/sɪt/',
  eat: '/iːt/',
  mom: '/mɒm/',
  dad: '/dæd/',
  boy: '/bɔɪ/',
  toy: '/tɔɪ/',
  box: '/bɒks/',
  fox: '/fɒks/',
  bee: '/biː/',
  pig: '/pɪɡ/',
  owl: '/aʊl/',
  ant: '/ænt/',
  one: '/wʌn/',
  two: '/tuː/',
  eye: '/aɪ/',
  arm: '/ɑːrm/',
  leg: '/leɡ/',
  ear: '/ɪər/',
  book: '/bʊk/',
  desk: '/desk/',
  door: '/dɔːr/',
  wall: '/wɔːl/',
  fish: '/fɪʃ/',
  tree: '/triː/',
  moon: '/muːn/',
  star: '/stɑːr/',
  bird: '/bɜːrd/',
  ball: '/bɔːl/',
  cake: '/keɪk/',
  milk: '/mɪlk/',
  duck: '/dʌk/',
  bear: '/ber/',
  frog: '/frɒɡ/',
  rose: '/rəʊz/',
  kite: '/kaɪt/',
  rule: '/ruːl/',
  blue: '/bluː/',
  pink: '/pɪŋk/',
  open: '/ˈəʊpən/',
  shut: '/ʃʌt/',
  come: '/kʌm/',
  look: '/lʊk/',
  read: '/riːd/',
  draw: '/drɔː/',
  girl: '/ɡɜːrl/',
  hand: '/hænd/',
  head: '/hed/',
  foot: '/fʊt/',
  nice: '/naɪs/',
  good: '/ɡʊd/',
  help: '/help/',
  name: '/neɪm/',
  here: '/hɪər/',
  apple: '/ˈæpəl/',
  house: '/haʊs/',
  tiger: '/ˈtaɪɡər/',
  piano: '/piˈænəʊ/',
  bread: '/bred/',
  clock: '/klɒk/',
  smile: '/smaɪl/',
  water: '/ˈwɔːtər/',
  heart: '/hɑːrt/',
  chair: '/tʃeər/',
  table: '/ˈteɪbəl/',
  paper: '/ˈpeɪpər/',
  pencil: '/ˈpensəl/',
  eraser: '/ɪˈreɪzər/',
  school: '/skuːl/',
  teacher: '/ˈtiːtʃər/',
  student: '/ˈstuːdnt/',
  hello: '/həˈləʊ/',
  please: '/pliːz/',
  thank: '/θæŋk/',
  sorry: '/ˈsɒri/',
  listen: '/ˈlɪsən/',
  write: '/raɪt/',
  color: '/ˈkʌlər/',
  yellow: '/ˈjeloʊ/',
  green: '/ɡriːn/',
  orange: '/ˈɒrɪndʒ/',
  purple: '/ˈpɜːrpl/',
  black: '/blæk/',
  white: '/waɪt/',
  three: '/θriː/',
  four: '/fɔːr/',
  five: '/faɪv/',
  seven: '/ˈsevən/',
  eight: '/eɪt/',
  nine: '/naɪn/',
  friend: '/frend/',
  happy: '/ˈhæpi/',
  today: '/təˈdeɪ/',
  morning: '/ˈmɔːrnɪŋ/',
  flower: '/ˈflaʊər/',
  family: '/ˈfæməli/',
  sister: '/ˈsɪstər/',
  brother: '/ˈbrʌðər/',
  window: '/ˈwɪndəʊ/',
  blackboard: '/ˈblækbɔːrd/',
  marker: '/ˈmɑːrkər/',
  crayon: '/ˈkreɪən/',
  notebook: '/ˈnəʊtbʊk/',
  scissors: '/ˈsɪzərz/',
};

wordsDatabase.forEach(word => {
  const key = word.word.toLowerCase();
  if (wordPhonetics[key]) {
    word.phonetic = wordPhonetics[key];
  }
});

// Utility function to shuffle array
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Function to scramble letters of a word
export function scrambleWord(word: string): string[] {
  return shuffleArray(word.split(''));
}

// Auto-categorize words by length for better difficulty progression
function categorizeDifficultyByLength() {
  wordsDatabase.forEach(word => {
    const length = word.word.length;
    if (length <= 3) {
      word.difficulty = 'easy';
    } else if (length <= 5) {
      word.difficulty = 'medium';
    } else {
      word.difficulty = 'hard';
    }
  });
}

// Initialize difficulty categorization
categorizeDifficultyByLength();

export function getWordsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Word[] {
  return wordsDatabase.filter(word => word.difficulty === difficulty);
}

export function getWordsByCategory(category: string): Word[] {
  return wordsDatabase.filter(word => word.category === category);
}

export function getRandomWord(difficulty?: 'easy' | 'medium' | 'hard', recentWordIds: number[] = []): Word {
  const pool = difficulty ? getWordsByDifficulty(difficulty) : wordsDatabase;
  
  // Filter out recently used words (last 5)
  const availableWords = pool.filter(word => !recentWordIds.includes(word.id));
  
  // If all words have been used recently (unlikely but possible with small pools), use full pool
  const finalPool = availableWords.length > 0 ? availableWords : pool;
  
  return finalPool[Math.floor(Math.random() * finalPool.length)];
}

export function getWordById(id: number): Word | undefined {
  return wordsDatabase.find(word => word.id === id);
}
