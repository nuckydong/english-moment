import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GameMode = 'menu' | 'timed' | 'level';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface LevelProgress {
  level: number;
  completed: boolean;
  stars: number;
  bestTime?: number;
  unlocked: boolean;
}

export interface DifficultyProgress {
  easy: LevelProgress[];
  medium: LevelProgress[];
  hard: LevelProgress[];
}

interface GameState {
  // Game Mode
  currentMode: GameMode;
  difficulty: Difficulty;
  setMode: (mode: GameMode) => void;
  setDifficulty: (difficulty: Difficulty) => void;

  // Score & Stats
  score: number;
  highScore: number;
  totalWords: number;
  correctWords: number;
  streak: number;
  addScore: (points: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  resetScore: () => void;

  // Level Mode
  currentLevel: number;
  levelsProgress: DifficultyProgress;
  setCurrentLevel: (level: number) => void;
  completeLevel: (stars: number, time: number) => void;
  resetLevelsProgress: () => void;
  fixLevelsUnlock: () => void;
  getCurrentDifficultyProgress: () => LevelProgress[];
  initializeDifficultyProgress: (difficulty: Difficulty) => void;

  // Achievements
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;

  // Game State
  isPlaying: boolean;
  startGame: () => void;
  endGame: () => void;
}

const initialAchievements: Achievement[] = [
  {
    id: 'first_word',
    title: '初次尝试',
    description: '完成第一个单词',
    icon: '🎯',
    unlocked: false,
  },
  {
    id: 'streak_5',
    title: '连胜高手',
    description: '连续答对5个单词',
    icon: '🔥',
    unlocked: false,
  },
  {
    id: 'streak_10',
    title: '无敌战神',
    description: '连续答对10个单词',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'score_100',
    title: '百分宝宝',
    description: '单局得分达到100分',
    icon: '💯',
    unlocked: false,
  },
  {
    id: 'level_5',
    title: '闯关新星',
    description: '完成前5关',
    icon: '⭐',
    unlocked: false,
  },
  {
    id: 'level_10',
    title: '闯关大师',
    description: '完成全部10关',
    icon: '👑',
    unlocked: false,
  },
  {
    id: 'perfect_level',
    title: '完美通关',
    description: '在一关中获得3星评价',
    icon: '✨',
    unlocked: false,
  },
  {
    id: 'speed_master',
    title: '速度之王',
    description: '60秒内答对15个单词',
    icon: '🚀',
    unlocked: false,
  },
];

const createInitialLevelsForDifficulty = (): LevelProgress[] => 
  Array.from({ length: 10 }, (_, i) => ({
    level: i + 1,
    completed: false,
    stars: 0,
    unlocked: i === 0, // Only first level is unlocked initially
  }));

const initialLevelsProgress: DifficultyProgress = {
  easy: createInitialLevelsForDifficulty(),
  medium: createInitialLevelsForDifficulty(),
  hard: createInitialLevelsForDifficulty(),
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentMode: 'menu',
      difficulty: 'easy',
      score: 0,
      highScore: 0,
      totalWords: 0,
      correctWords: 0,
      streak: 0,
      currentLevel: 1,
      levelsProgress: initialLevelsProgress,
      achievements: initialAchievements,
      isPlaying: false,

      // Actions
      setMode: (mode) => set({ currentMode: mode }),
      setDifficulty: (difficulty) => set({ difficulty }),

      getCurrentDifficultyProgress: () => {
        const { difficulty, levelsProgress } = get();
        
        // Return existing progress or empty array (don't modify state during render)
        return levelsProgress[difficulty] || [];
      },

      initializeDifficultyProgress: (targetDifficulty) => {
        const { levelsProgress } = get();
        
        // Only initialize if it doesn't exist
        if (!levelsProgress[targetDifficulty]) {
          const newProgress = Array.from({ length: 10 }, (_, i) => ({
            level: i + 1,
            completed: false,
            unlocked: i === 0, // First level is unlocked by default
            stars: 0,
            bestTime: undefined,
          }));
          
          set({ 
            levelsProgress: {
              ...levelsProgress,
              [targetDifficulty]: newProgress
            }
          });
        }
      },

      addScore: (points) => {
        const newScore = get().score + points;
        const currentHighScore = get().highScore;
        set({
          score: newScore,
          highScore: Math.max(newScore, currentHighScore),
        });

        // Check achievements
        if (newScore >= 100 && !get().achievements.find(a => a.id === 'score_100')?.unlocked) {
          get().unlockAchievement('score_100');
        }
      },

      incrementStreak: () => {
        const newStreak = get().streak + 1;
        set({ streak: newStreak });

  // 第一次答对单词：解锁「初次尝试」成就
  if (
    newStreak === 1 &&
    !get().achievements.find(a => a.id === 'first_word')?.unlocked
  ) {
    get().unlockAchievement('first_word');
  }

  // 连胜 5 次
  if (
    newStreak === 5 &&
    !get().achievements.find(a => a.id === 'streak_5')?.unlocked
  ) {
    get().unlockAchievement('streak_5');
  }

  // 连胜 10 次
  if (
    newStreak === 10 &&
    !get().achievements.find(a => a.id === 'streak_10')?.unlocked
  ) {
    get().unlockAchievement('streak_10');
  }
      },

      resetStreak: () => set({ streak: 0 }),
      resetScore: () => set({ score: 0 }),

      setCurrentLevel: (level) => set({ currentLevel: level }),

      completeLevel: (stars, time) => {
        const currentLevel = get().currentLevel;
        const { difficulty, levelsProgress } = get();
        const levelIndex = currentLevel - 1;

        console.log(`🎯 Completing level ${currentLevel} (index ${levelIndex}) for ${difficulty} with ${stars} stars`);
        console.log('📊 Before completion, levels progress:', levelsProgress[difficulty]);

        // Get current difficulty progress - ensure it exists first
        if (!levelsProgress[difficulty]) {
          console.log(`⚠️ No progress found for ${difficulty}, creating new...`);
          // This will trigger the migration logic
          get().getCurrentDifficultyProgress();
        }
        
        // Create a deep copy of the progress for the current difficulty
        const currentDifficultyProgress = [...levelsProgress[difficulty]];
        console.log(`📋 Current ${difficulty} progress before update:`, currentDifficultyProgress);

        currentDifficultyProgress[levelIndex] = {
          level: currentLevel,
          completed: true,
          stars,
          bestTime: currentDifficultyProgress[levelIndex].bestTime
            ? Math.min(currentDifficultyProgress[levelIndex].bestTime!, time)
            : time,
          unlocked: true, // Keep the level unlocked
        };

        // Unlock next level if it exists
        if (currentLevel < currentDifficultyProgress.length) {
          const nextLevelIndex = currentLevel; // currentLevel is 1-based, so it's the correct 0-based index for next level
          console.log(`Unlocking next level: ${currentLevel + 1} (index ${nextLevelIndex}) for ${difficulty}`);
          currentDifficultyProgress[nextLevelIndex] = {
            ...currentDifficultyProgress[nextLevelIndex],
            unlocked: true
          };
        }

        console.log(`Updated ${difficulty} levels progress:`, currentDifficultyProgress);
        
        // Update the specific difficulty progress
        set({ 
          levelsProgress: {
            ...levelsProgress,
            [difficulty]: currentDifficultyProgress
          }
        });

        // Check achievements
        if (stars === 3 && !get().achievements.find(a => a.id === 'perfect_level')?.unlocked) {
          get().unlockAchievement('perfect_level');
        }

        const difficultyProgress = levelsProgress[difficulty];
        const completedLevels = difficultyProgress.filter(l => l.completed).length;
        if (completedLevels >= 5 && !get().achievements.find(a => a.id === 'level_5')?.unlocked) {
          get().unlockAchievement('level_5');
        }
        if (completedLevels >= 10 && !get().achievements.find(a => a.id === 'level_10')?.unlocked) {
          get().unlockAchievement('level_10');
        }
      },

      unlockAchievement: (id) => {
        const achievements = get().achievements.map(a =>
          a.id === id ? { ...a, unlocked: true, unlockedAt: new Date() } : a
        );
        set({ achievements });
      },

      startGame: () => {
        set({ isPlaying: true, score: 0, streak: 0 });
      },

      endGame: () => {
        const totalWords = get().totalWords + 1;
        const correctWords = get().correctWords + (get().score > 0 ? 1 : 0);
        set({ isPlaying: false, totalWords, correctWords });

        // Check first word achievement
        if (correctWords === 1 && !get().achievements.find(a => a.id === 'first_word')?.unlocked) {
          get().unlockAchievement('first_word');
        }
      },

      resetLevelsProgress: () => {
        set({ 
          levelsProgress: {
            easy: createInitialLevelsForDifficulty(),
            medium: createInitialLevelsForDifficulty(),
            hard: createInitialLevelsForDifficulty(),
          },
          currentLevel: 1 
        });
      },

      fixLevelsUnlock: () => {
        const { difficulty, levelsProgress } = get();
        const currentProgress = levelsProgress[difficulty];
        
        const fixedProgress = currentProgress.map((level, index) => {
          // First level is always unlocked
          if (index === 0) {
            return { ...level, unlocked: true };
          }
          
          // Unlock level if previous level is completed
          const previousLevel = currentProgress[index - 1];
          const shouldUnlock = previousLevel && previousLevel.completed;
          
          return { ...level, unlocked: shouldUnlock || level.unlocked };
        });
        
        set({ 
          levelsProgress: {
            ...levelsProgress,
            [difficulty]: fixedProgress
          }
        });
      },
    }),
    {
      name: 'word-puzzle-game',
    }
  )
);
