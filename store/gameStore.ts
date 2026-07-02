import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GameMode = 'menu' | 'timed' | 'level' | 'match';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string; // ISO string for proper JSON serialization
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
  correctCount: number; // 每局答对单词数
  streak: number;
  addScore: (points: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  resetScore: () => void;
  incrementCorrect: () => void; // 答对一个单词时调用

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
  checkSpeedMaster: (correctIn60s: number) => void;

  // Game State
  isPlaying: boolean;
  startGame: () => void;
  endGame: () => void;
}

const initialAchievements: Achievement[] = [
  { id: 'first_word', title: '初次尝试', description: '完成第一个单词', icon: '🎯', unlocked: false },
  { id: 'streak_5', title: '连胜高手', description: '连续答对5个单词', icon: '🔥', unlocked: false },
  { id: 'streak_10', title: '无敌战神', description: '连续答对10个单词', icon: '⚡', unlocked: false },
  { id: 'score_100', title: '百分宝宝', description: '单局得分达到100分', icon: '💯', unlocked: false },
  { id: 'level_5', title: '闯关新星', description: '完成前5关', icon: '⭐', unlocked: false },
  { id: 'level_10', title: '闯关大师', description: '完成全部10关', icon: '👑', unlocked: false },
  { id: 'perfect_level', title: '完美通关', description: '在一关中获得3星评价', icon: '✨', unlocked: false },
  { id: 'speed_master', title: '速度之王', description: '60秒内答对15个单词', icon: '🚀', unlocked: false },
];

const createInitialLevelsForDifficulty = (): LevelProgress[] =>
  Array.from({ length: 10 }, (_, i) => ({
    level: i + 1,
    completed: false,
    stars: 0,
    unlocked: i === 0,
  }));

const initialLevelsProgress: DifficultyProgress = {
  easy: createInitialLevelsForDifficulty(),
  medium: createInitialLevelsForDifficulty(),
  hard: createInitialLevelsForDifficulty(),
};

// 独立的成就检查函数，从 store actions 中解耦
function checkAchievements(get: () => GameState, set: (partial: Partial<GameState>) => void) {
  const state = get();

  // first_word: 答对第一个单词
  if (state.correctCount >= 1 && !state.achievements.find(a => a.id === 'first_word')?.unlocked) {
    get().unlockAchievement('first_word');
  }

  // streak_5: 连续答对5个
  if (state.streak >= 5 && !state.achievements.find(a => a.id === 'streak_5')?.unlocked) {
    get().unlockAchievement('streak_5');
  }

  // streak_10: 连续答对10个
  if (state.streak >= 10 && !state.achievements.find(a => a.id === 'streak_10')?.unlocked) {
    get().unlockAchievement('streak_10');
  }

  // score_100: 单局得分达到100
  if (state.score >= 100 && !state.achievements.find(a => a.id === 'score_100')?.unlocked) {
    get().unlockAchievement('score_100');
  }
}

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
      correctCount: 0,
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
        return levelsProgress[difficulty] || [];
      },

      initializeDifficultyProgress: (targetDifficulty) => {
        const { levelsProgress } = get();
        if (!levelsProgress[targetDifficulty]) {
          const newProgress = Array.from({ length: 10 }, (_, i) => ({
            level: i + 1,
            completed: false,
            unlocked: i === 0,
            stars: 0,
            bestTime: undefined,
          }));
          set({
            levelsProgress: {
              ...levelsProgress,
              [targetDifficulty]: newProgress,
            },
          });
        }
      },

      addScore: (points) => {
        const newScore = get().score + points;
        set({
          score: newScore,
          highScore: Math.max(newScore, get().highScore),
        });
        checkAchievements(get, set);
      },

      incrementStreak: () => {
        set({ streak: get().streak + 1 });
        checkAchievements(get, set);
      },

      incrementCorrect: () => {
        set({ correctCount: get().correctCount + 1 });
        checkAchievements(get, set);
      },

      resetStreak: () => set({ streak: 0 }),
      resetScore: () => set({ score: 0, correctCount: 0 }),

      setCurrentLevel: (level) => set({ currentLevel: level }),

      completeLevel: (stars, time) => {
        const currentLevel = get().currentLevel;
        const { difficulty, levelsProgress } = get();
        const levelIndex = currentLevel - 1;

        // 确保当前难度的进度存在
        if (!levelsProgress[difficulty]) {
          get().initializeDifficultyProgress(difficulty);
        }

        const currentDifficultyProgress = [...(get().levelsProgress[difficulty] || [])];

        if (!currentDifficultyProgress[levelIndex]) {
          currentDifficultyProgress[levelIndex] = {
            level: currentLevel,
            completed: false,
            stars: 0,
            unlocked: false,
          };
        }

        currentDifficultyProgress[levelIndex] = {
          level: currentLevel,
          completed: true,
          stars,
          bestTime: currentDifficultyProgress[levelIndex].bestTime
            ? Math.min(currentDifficultyProgress[levelIndex].bestTime!, time)
            : time,
          unlocked: true,
        };

        // 解锁下一关
        if (currentLevel < currentDifficultyProgress.length) {
          const nextLevelIndex = currentLevel;
          currentDifficultyProgress[nextLevelIndex] = {
            ...currentDifficultyProgress[nextLevelIndex],
            unlocked: true,
          };
        }

        set({
          levelsProgress: {
            ...get().levelsProgress,
            [difficulty]: currentDifficultyProgress,
          },
        });

        // 成就检查 - 使用更新后的数据
        if (stars === 3 && !get().achievements.find(a => a.id === 'perfect_level')?.unlocked) {
          get().unlockAchievement('perfect_level');
        }

        // 使用更新后的 completedLevels 计数（修复 off-by-one）
        const completedLevels = currentDifficultyProgress.filter(l => l.completed).length;
        if (completedLevels >= 5 && !get().achievements.find(a => a.id === 'level_5')?.unlocked) {
          get().unlockAchievement('level_5');
        }
        if (completedLevels >= 10 && !get().achievements.find(a => a.id === 'level_10')?.unlocked) {
          get().unlockAchievement('level_10');
        }
      },

      unlockAchievement: (id) => {
        const achievements = get().achievements.map(a =>
          a.id === id ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
        );
        set({ achievements });
      },

      checkSpeedMaster: (correctIn60s) => {
        if (correctIn60s >= 15 && !get().achievements.find(a => a.id === 'speed_master')?.unlocked) {
          get().unlockAchievement('speed_master');
        }
      },

      startGame: () => {
        set({ isPlaying: true, score: 0, streak: 0, correctCount: 0 });
      },

      endGame: () => {
        const state = get();
        // 使用 correctCount 准确跟踪答对单词数
        set({
          isPlaying: false,
          totalWords: state.totalWords + 1,
          correctWords: state.correctWords + state.correctCount,
        });
        checkAchievements(get, set);
      },

      resetLevelsProgress: () => {
        set({
          levelsProgress: {
            easy: createInitialLevelsForDifficulty(),
            medium: createInitialLevelsForDifficulty(),
            hard: createInitialLevelsForDifficulty(),
          },
          currentLevel: 1,
        });
      },

      fixLevelsUnlock: () => {
        const { difficulty, levelsProgress } = get();
        const currentProgress = levelsProgress[difficulty];
        if (!currentProgress) return;

        const fixedProgress = currentProgress.map((level, index) => {
          if (index === 0) return { ...level, unlocked: true };
          const previousLevel = currentProgress[index - 1];
          const shouldUnlock = previousLevel && previousLevel.completed;
          return { ...level, unlocked: shouldUnlock || level.unlocked };
        });

        set({
          levelsProgress: {
            ...levelsProgress,
            [difficulty]: fixedProgress,
          },
        });
      },
    }),
    {
      name: 'word-puzzle-game',
      version: 2,
      skipHydration: true,
      partialize: (state) => ({
        highScore: state.highScore,
        totalWords: state.totalWords,
        correctWords: state.correctWords,
        levelsProgress: state.levelsProgress,
        difficulty: state.difficulty,
        achievements: state.achievements,
      }),
      migrate: (persistedState: unknown) => {
        const state = persistedState as Partial<GameState>;
        // 确保迁移后的数据结构完整
        if (!state.levelsProgress) {
          state.levelsProgress = initialLevelsProgress;
        } else {
          // 为每个难度确保有 10 个关卡
          (['easy', 'medium', 'hard'] as const).forEach(diff => {
            if (!state.levelsProgress![diff]) {
              state.levelsProgress![diff] = createInitialLevelsForDifficulty();
            }
          });
        }
        if (!state.achievements) {
          state.achievements = initialAchievements;
        }
        return state as GameState;
      },
      onRehydrateStorage: () => (state) => {
        // 水合后自动修复关卡解锁状态
        if (state) {
          state.fixLevelsUnlock();
        }
      },
    }
  )
);
