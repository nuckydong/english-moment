export interface Word {
  id: number;
  word: string;
  translation: string;
  imageUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'animals' | 'greetings' | 'classroom' | 'stationery' | 'family' | 'colors' | 'numbers' | 'food' | 'nature' | 'body';
  phonetic?: string;
  examples?: ExampleSentence[];
}

export interface ExampleSentence {
  en: string;
  zh: string;
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
  { id: 53, word: 'ruler', translation: '尺子，直尺', imageUrl: '📏', difficulty: 'medium', category: 'stationery' },
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
  ruler: '/ˈruːlər/',
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

const specialExamples: Record<string, ExampleSentence[]> = {
  hi: [
    { en: 'Hi, I am Tom.', zh: '嗨，我是汤姆。' },
    { en: 'Hi, my friend!', zh: '嗨，我的朋友！' },
  ],
  bye: [
    { en: 'Bye, see you tomorrow.', zh: '再见，明天见。' },
    { en: 'Say bye to the teacher.', zh: '跟老师说再见。' },
  ],
  yes: [
    { en: 'Yes, I can do it.', zh: '是的，我能做到。' },
    { en: 'Yes, this is my book.', zh: '是的，这是我的书。' },
  ],
  no: [
    { en: 'No, thank you.', zh: '不，谢谢。' },
    { en: 'No, it is not mine.', zh: '不，这不是我的。' },
  ],
  please: [
    { en: 'Please open the door.', zh: '请把门打开。' },
    { en: 'Please help me.', zh: '请帮助我。' },
  ],
  thank: [
    { en: 'Thank you, teacher.', zh: '谢谢你，老师。' },
    { en: 'Thank you very much.', zh: '非常感谢你。' },
  ],
  sorry: [
    { en: 'Sorry, I am late.', zh: '对不起，我迟到了。' },
    { en: 'Sorry, I made a mistake.', zh: '对不起，我犯了个错。' },
  ],
  run: [
    { en: 'I can run fast.', zh: '我可以跑得很快。' },
    { en: 'Run to the playground.', zh: '跑到操场去。' },
  ],
  sit: [
    { en: 'Please sit here.', zh: '请坐这里。' },
    { en: 'Sit down, please.', zh: '请坐下。' },
  ],
  eat: [
    { en: 'I eat an apple.', zh: '我吃一个苹果。' },
    { en: 'We eat bread at school.', zh: '我们在学校吃面包。' },
  ],
  open: [
    { en: 'Open your book, please.', zh: '请打开你的书。' },
    { en: 'Open the window.', zh: '打开窗户。' },
  ],
  shut: [
    { en: 'Shut the door, please.', zh: '请把门关上。' },
    { en: 'Shut your eyes.', zh: '闭上你的眼睛。' },
  ],
  come: [
    { en: 'Come here, please.', zh: '请到这里来。' },
    { en: 'Come to my home.', zh: '来我家吧。' },
  ],
  look: [
    { en: 'Look at the bird.', zh: '看那只鸟。' },
    { en: 'Look at me.', zh: '看我。' },
  ],
  read: [
    { en: 'I read a book.', zh: '我读一本书。' },
    { en: 'Read this word.', zh: '读这个单词。' },
  ],
  draw: [
    { en: 'I draw a flower.', zh: '我画一朵花。' },
    { en: 'Draw a big sun.', zh: '画一个大太阳。' },
  ],
  write: [
    { en: 'Write your name.', zh: '写下你的名字。' },
    { en: 'I write with a pencil.', zh: '我用铅笔写字。' },
  ],
  listen: [
    { en: 'Listen to the teacher.', zh: '听老师讲。' },
    { en: 'Listen and repeat.', zh: '听并跟读。' },
  ],
  today: [
    { en: 'Today is Monday.', zh: '今天是星期一。' },
    { en: 'I am happy today.', zh: '我今天很高兴。' },
  ],
  here: [
    { en: 'Come here, please.', zh: '请到这里来。' },
    { en: 'My book is here.', zh: '我的书在这里。' },
  ],
  sun: [
    { en: 'The sun is big and hot.', zh: '太阳又大又热。' },
    { en: 'I see the sun in the sky.', zh: '我看到天空中的太阳。' },
  ],
  moon: [
    { en: 'The moon is in the sky.', zh: '月亮在天上。' },
    { en: 'The moon is round.', zh: '月亮是圆的。' },
  ],
  star: [
    { en: 'I see a star in the sky.', zh: '我看到天上有一颗星星。' },
    { en: 'The star is bright.', zh: '星星很亮。' },
  ],
  head: [
    { en: 'This is my head.', zh: '这是我的头。' },
    { en: 'Touch your head.', zh: '摸摸你的头。' },
  ],
  foot: [
    { en: 'This is my foot.', zh: '这是我的脚。' },
    { en: 'I have two feet.', zh: '我有两只脚。' },
  ],
  bus: [
    { en: 'I go to school by bus.', zh: '我坐公交车去学校。' },
    { en: 'The bus is big.', zh: '公交车很大。' },
  ],
  car: [
    { en: 'This is a toy car.', zh: '这是一辆玩具车。' },
    { en: 'Dad has a car.', zh: '爸爸有一辆汽车。' },
  ],
  toy: [
    { en: 'This is my toy.', zh: '这是我的玩具。' },
    { en: 'I like my toy.', zh: '我喜欢我的玩具。' },
  ],
  box: [
    { en: 'This is a big box.', zh: '这是一个大盒子。' },
    { en: 'Put it in the box.', zh: '把它放进盒子里。' },
  ],
  hat: [
    { en: 'I have a nice hat.', zh: '我有一顶好看的帽子。' },
    { en: 'Put on your hat.', zh: '戴上你的帽子。' },
  ],
  bed: [
    { en: 'This is my bed.', zh: '这是我的床。' },
    { en: 'I go to bed at nine.', zh: '我九点上床睡觉。' },
  ],
  kite: [
    { en: 'I fly a kite.', zh: '我放风筝。' },
    { en: 'The kite is in the sky.', zh: '风筝在天上。' },
  ],
  ball: [
    { en: 'I play with a ball.', zh: '我玩球。' },
    { en: 'The ball is round.', zh: '球是圆的。' },
  ],
  wall: [
    { en: 'This is a wall.', zh: '这是一面墙。' },
    { en: 'Do not draw on the wall.', zh: '不要在墙上画画。' },
  ],
  desk: [
    { en: 'This is my desk.', zh: '这是我的桌子。' },
    { en: 'My book is on the desk.', zh: '我的书在桌子上。' },
  ],
  door: [
    { en: 'Please open the door.', zh: '请打开门。' },
    { en: 'Close the door, please.', zh: '请关门。' },
  ],
  tree: [
    { en: 'This is a big tree.', zh: '这是一棵大树。' },
    { en: 'The bird is in the tree.', zh: '鸟在树上。' },
  ],
  flower: [
    { en: 'This is a beautiful flower.', zh: '这是一朵漂亮的花。' },
    { en: 'I like this flower.', zh: '我喜欢这朵花。' },
  ],
  family: [
    { en: 'This is my family.', zh: '这是我的家庭。' },
    { en: 'I love my family.', zh: '我爱我的家庭。' },
  ],
  blackboard: [
    { en: 'The teacher writes on the blackboard.', zh: '老师在黑板上写字。' },
    { en: 'Look at the blackboard.', zh: '看黑板。' },
  ],
  window: [
    { en: 'Open the window, please.', zh: '请打开窗户。' },
    { en: 'Look out the window.', zh: '往窗外看。' },
  ],
  paper: [
    { en: 'This is a piece of paper.', zh: '这是一张纸。' },
    { en: 'I draw on paper.', zh: '我在纸上画画。' },
  ],
  color: [
    { en: 'Red is a color.', zh: '红色是一种颜色。' },
    { en: 'What is your favorite color?', zh: '你最喜欢什么颜色？' },
  ],
  smile: [
    { en: 'She has a nice smile.', zh: '她的微笑很好看。' },
    { en: 'Smile at your friend.', zh: '对你的朋友微笑。' },
  ],
  heart: [
    { en: 'I draw a heart.', zh: '我画了一个心。' },
    { en: 'I love you with all my heart.', zh: '我全心全意爱你。' },
  ],
  ruler: [
    { en: 'I use a ruler to draw a line.', zh: '我用尺子画线。' },
    { en: 'This is my ruler.', zh: '这是我的尺子。' },
  ],
  marker: [
    { en: 'The teacher uses a marker.', zh: '老师用马克笔。' },
    { en: 'This is a red marker.', zh: '这是一支红色的马克笔。' },
  ],
  crayon: [
    { en: 'I draw with a crayon.', zh: '我用蜡笔画画。' },
    { en: 'This is a blue crayon.', zh: '这是一支蓝色的蜡笔。' },
  ],
  notebook: [
    { en: 'This is my notebook.', zh: '这是我的笔记本。' },
    { en: 'I write in my notebook.', zh: '我在笔记本上写字。' },
  ],
  scissors: [
    { en: 'I use scissors to cut paper.', zh: '我用剪刀剪纸。' },
    { en: 'Be careful with scissors.', zh: '用剪刀要小心。' },
  ],
  frog: [
    { en: 'The frog can jump.', zh: '青蛙会跳。' },
    { en: 'I see a green frog.', zh: '我看见一只绿色的青蛙。' },
  ],
  rose: [
    { en: 'This is a red rose.', zh: '这是一朵红玫瑰。' },
    { en: 'The rose is beautiful.', zh: '玫瑰很漂亮。' },
  ],
  morning: [
    { en: 'Good morning!', zh: '早上好！' },
    { en: 'I get up in the morning.', zh: '我早上起床。' },
  ],
  big: [
    { en: 'The elephant is big.', zh: '大象很大。' },
    { en: 'I have a big apple.', zh: '我有一个大苹果。' },
  ],
  nice: [
    { en: 'You are very nice.', zh: '你真好。' },
    { en: 'This is a nice day.', zh: '今天天气真好。' },
  ],
  good: [
    { en: 'This is good.', zh: '这个很好。' },
    { en: 'You are a good student.', zh: '你是一个好学生。' },
  ],
  happy: [
    { en: 'I am very happy.', zh: '我很高兴。' },
    { en: 'Happy birthday!', zh: '生日快乐！' },
  ],
  friend: [
    { en: 'This is my friend.', zh: '这是我的朋友。' },
    { en: 'We are good friends.', zh: '我们是好朋友。' },
  ],
  water: [
    { en: 'I drink water.', zh: '我喝水。' },
    { en: 'Fish live in water.', zh: '鱼生活在水里。' },
  ],
  milk: [
    { en: 'I drink milk every day.', zh: '我每天喝牛奶。' },
    { en: 'Milk is good for you.', zh: '牛奶对你有好处。' },
  ],
  bread: [
    { en: 'I eat bread for breakfast.', zh: '我早餐吃面包。' },
    { en: 'This bread is nice.', zh: '这个面包很好吃。' },
  ],
  teacher: [
    { en: 'This is my teacher.', zh: '这是我的老师。' },
    { en: 'The teacher is nice.', zh: '老师很好。' },
  ],
  student: [
    { en: 'I am a student.', zh: '我是一个学生。' },
    { en: 'The student reads a book.', zh: '这个学生在读书。' },
  ],
  apple: [
    { en: 'I eat an apple.', zh: '我吃一个苹果。' },
    { en: 'The apple is red.', zh: '这个苹果是红色的。' },
  ],
  eraser: [
    { en: 'I use an eraser.', zh: '我用橡皮擦。' },
    { en: 'This is my eraser.', zh: '这是我的橡皮。' },
  ],
  orange: [
    { en: 'I like orange.', zh: '我喜欢橙色。' },
    { en: 'This is an orange.', zh: '这是一个橙子。' },
  ],
  eye: [
    { en: 'This is my eye.', zh: '这是我的眼睛。' },
    { en: 'I have two eyes.', zh: '我有两只眼睛。' },
  ],
  ear: [
    { en: 'This is my ear.', zh: '这是我的耳朵。' },
    { en: 'I have two ears.', zh: '我有两只耳朵。' },
  ],
  arm: [
    { en: 'This is my arm.', zh: '这是我的手臂。' },
    { en: 'I have two arms.', zh: '我有两只手臂。' },
  ],
  leg: [
    { en: 'This is my leg.', zh: '这是我的腿。' },
    { en: 'I have two legs.', zh: '我有两条腿。' },
  ],
  hand: [
    { en: 'This is my hand.', zh: '这是我的手。' },
    { en: 'I have two hands.', zh: '我有两只手。' },
  ],
  hello: [
    { en: 'Hello, how are you?', zh: '你好，你怎么样？' },
    { en: 'Hello, my name is Tom.', zh: '你好，我叫汤姆。' },
  ],
  sister: [
    { en: 'This is my sister.', zh: '这是我的姐妹。' },
    { en: 'My sister is nice.', zh: '我的姐妹很好。' },
  ],
  brother: [
    { en: 'This is my brother.', zh: '这是我的兄弟。' },
    { en: 'My brother is big.', zh: '我的兄弟个子很高。' },
  ],
  school: [
    { en: 'I go to school.', zh: '我去上学。' },
    { en: 'My school is big.', zh: '我的学校很大。' },
  ],
  house: [
    { en: 'This is my house.', zh: '这是我的房子。' },
    { en: 'The house is big.', zh: '这个房子很大。' },
  ],
  chair: [
    { en: 'This is a chair.', zh: '这是一把椅子。' },
    { en: 'Please sit on the chair.', zh: '请坐在椅子上。' },
  ],
  table: [
    { en: 'This is a table.', zh: '这是一张桌子。' },
    { en: 'The book is on the table.', zh: '书在桌子上。' },
  ],
  piano: [
    { en: 'I play the piano.', zh: '我弹钢琴。' },
    { en: 'The piano is big.', zh: '钢琴很大。' },
  ],
  clock: [
    { en: 'Look at the clock.', zh: '看钟表。' },
    { en: 'The clock is on the wall.', zh: '钟表在墙上。' },
  ],
  tiger: [
    { en: 'The tiger is big.', zh: '老虎很大。' },
    { en: 'I see a tiger in the book.', zh: '我在书里看到一只老虎。' },
  ],
  name: [
    { en: 'My name is Tom.', zh: '我的名字叫汤姆。' },
    { en: 'What is your name?', zh: '你叫什么名字？' },
  ],
  help: [
    { en: 'Can you help me?', zh: '你能帮助我吗？' },
    { en: 'I help my friend.', zh: '我帮助我的朋友。' },
  ],
  girl: [
    { en: 'This is a girl.', zh: '这是一个女孩。' },
    { en: 'The girl is happy.', zh: '这个女孩很高兴。' },
  ],
  mom: [
    { en: 'This is my mom.', zh: '这是我的妈妈。' },
    { en: 'I love my mom.', zh: '我爱我的妈妈。' },
  ],
  dad: [
    { en: 'This is my dad.', zh: '这是我的爸爸。' },
    { en: 'I love my dad.', zh: '我爱我的爸爸。' },
  ],
  boy: [
    { en: 'This is a boy.', zh: '这是一个男孩。' },
    { en: 'The boy is happy.', zh: '这个男孩很高兴。' },
  ],
  cup: [
    { en: 'This is my cup.', zh: '这是我的杯子。' },
    { en: 'I have a cup.', zh: '我有一个杯子。' },
  ],
  cake: [
    { en: 'I like cake.', zh: '我喜欢蛋糕。' },
    { en: 'This cake is nice.', zh: '这个蛋糕很好吃。' },
  ],
  cat: [
    { en: 'This is a cat.', zh: '这是一只猫。' },
    { en: 'The cat is small.', zh: '猫很小。' },
  ],
  dog: [
    { en: 'This is a dog.', zh: '这是一只狗。' },
    { en: 'The dog is my friend.', zh: '狗是我的朋友。' },
  ],
  fox: [
    { en: 'This is a fox.', zh: '这是一只狐狸。' },
    { en: 'The fox is clever.', zh: '狐狸很聪明。' },
  ],
  bee: [
    { en: 'This is a bee.', zh: '这是一只蜜蜂。' },
    { en: 'The bee can fly.', zh: '蜜蜂会飞。' },
  ],
  pig: [
    { en: 'This is a pig.', zh: '这是一只猪。' },
    { en: 'The pig is pink.', zh: '猪是粉色的。' },
  ],
  owl: [
    { en: 'This is an owl.', zh: '这是一只猫头鹰。' },
    { en: 'The owl can see at night.', zh: '猫头鹰晚上能看见。' },
  ],
  ant: [
    { en: 'This is an ant.', zh: '这是一只蚂蚁。' },
    { en: 'The ant is small.', zh: '蚂蚁很小。' },
  ],
  fish: [
    { en: 'This is a fish.', zh: '这是一条鱼。' },
    { en: 'The fish can swim.', zh: '鱼会游泳。' },
  ],
  bird: [
    { en: 'This is a bird.', zh: '这是一只鸟。' },
    { en: 'The bird can fly.', zh: '鸟会飞。' },
  ],
  duck: [
    { en: 'This is a duck.', zh: '这是一只鸭子。' },
    { en: 'The duck can swim.', zh: '鸭子会游泳。' },
  ],
  bear: [
    { en: 'This is a bear.', zh: '这是一只熊。' },
    { en: 'The bear is big.', zh: '熊很大。' },
  ],
  pen: [
    { en: 'This is my pen.', zh: '这是我的笔。' },
    { en: 'I write with a pen.', zh: '我用笔写字。' },
  ],
  bag: [
    { en: 'This is my bag.', zh: '这是我的书包。' },
    { en: 'My bag is big.', zh: '我的书包很大。' },
  ],
  book: [
    { en: 'This is my book.', zh: '这是我的书。' },
    { en: 'I read a book.', zh: '我读一本书。' },
  ],
  pencil: [
    { en: 'This is my pencil.', zh: '这是我的铅笔。' },
    { en: 'I write with a pencil.', zh: '我用铅笔写字。' },
  ]
};

const colorWords = new Set(['red', 'blue', 'pink', 'yellow', 'green', 'purple', 'black', 'white']);
const numberWords = new Set(['one', 'two', 'three', 'four', 'five', 'seven', 'eight', 'nine']);

function buildExampleSentences(word: Word): ExampleSentence[] {
  const key = word.word.toLowerCase();
  const shortZh = word.translation.split(/[，,]/)[0];
  const article = /^[aeiou]/i.test(key) ? 'an' : 'a';

  if (specialExamples[key]) {
    return specialExamples[key];
  }

  if (colorWords.has(key)) {
    return [
      { en: `This is ${key}.`, zh: `这是${shortZh}。` },
      { en: `I like ${key}.`, zh: `我喜欢${shortZh}。` },
    ];
  }

  if (numberWords.has(key)) {
    return [
      { en: `I can count ${key}.`, zh: `我会数到${shortZh}。` },
      { en: `Show me ${key} fingers.`, zh: `给我看${shortZh}根手指。` },
    ];
  }

  if (word.category === 'animals') {
    return [
      { en: `This is ${article} ${key}.`, zh: `这是一个${shortZh}。` },
      { en: `I see ${article} ${key}.`, zh: `我看见一个${shortZh}。` },
    ];
  }

  if (word.category === 'stationery') {
    return [
      { en: `This is ${article} ${key}.`, zh: `这是一个${shortZh}。` },
      { en: `I use ${article} ${key}.`, zh: `我使用这个${shortZh}。` },
    ];
  }

  return [
    { en: `This is ${article} ${key}.`, zh: `这是一个${shortZh}。` },
    { en: `I like this ${key}.`, zh: `我喜欢这个${shortZh}。` },
  ];
}

wordsDatabase.forEach(word => {
  const key = word.word.toLowerCase();
  if (wordPhonetics[key]) {
    word.phonetic = wordPhonetics[key];
  }
  word.examples = buildExampleSentences(word);
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
