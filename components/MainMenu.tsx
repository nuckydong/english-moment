'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import WordList from './WordList';

interface MainMenuProps {
  onShowAchievements: () => void;
}

export default function MainMenu({ onShowAchievements }: MainMenuProps) {
  const { setMode, difficulty, setDifficulty, highScore, achievements } = useGameStore();
  const [showWordList, setShowWordList] = useState(false);

  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex flex-col items-center justify-center p-4">
      {/* Title */}
      <div className="text-center mb-8 animate-bounce-slow">
        <h1 className="text-5xl md:text-6xl font-bold text-primary mb-2 drop-shadow-lg">
          🎮 英语拼词
        </h1>
        <p className="text-2xl md:text-3xl text-gray-700 font-semibold">
          入门版（逐步增加词汇）
        </p>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8 w-full max-w-md">
        <div className="flex justify-around text-center">
          <div>
            <div className="text-3xl font-bold text-secondary">{highScore}</div>
            <div className="text-sm text-gray-600">最高分</div>
          </div>
          <div className="border-l-2 border-gray-200"></div>
          <div>
            <div className="text-3xl font-bold text-accent">{unlockedAchievements}</div>
            <div className="text-sm text-gray-600">成就</div>
          </div>
        </div>
      </div>

      {/* Difficulty Selection */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8 w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-4 text-gray-800">选择难度</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setDifficulty('easy')}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-lg transition-all btn-press ${
              difficulty === 'easy'
                ? 'bg-green-400 text-white shadow-lg scale-105'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            😊 简单
          </button>
          <button
            onClick={() => setDifficulty('medium')}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-lg transition-all btn-press ${
              difficulty === 'medium'
                ? 'bg-yellow-400 text-white shadow-lg scale-105'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            🙂 普通
          </button>
          <button
            onClick={() => setDifficulty('hard')}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-lg transition-all btn-press ${
              difficulty === 'hard'
                ? 'bg-red-400 text-white shadow-lg scale-105'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            😎 困难
          </button>
        </div>
      </div>

      {/* Game Modes */}
      <div className="space-y-4 w-full max-w-md">
        <button
          onClick={() => setMode('timed')}
          className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white py-6 px-8 rounded-3xl font-bold text-2xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105 btn-press"
        >
          ⏰ 计时挑战
          <p className="text-sm font-normal mt-1 opacity-90">120秒（2分钟）答对尽可能多的单词</p>
        </button>

        <button
          onClick={() => setMode('level')}
          className="w-full bg-gradient-to-r from-blue-400 to-cyan-400 text-white py-6 px-8 rounded-3xl font-bold text-2xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105 btn-press"
        >
          🎯 闯关模式
          <p className="text-sm font-normal mt-1 opacity-90">逐级挑战，解锁新关卡</p>
        </button>

               <button
          onClick={() => setShowWordList(true)}
          className="w-full bg-gradient-to-r from-emerald-400 to-teal-400 text-white py-5 px-8 rounded-3xl font-bold text-2xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105 btn-press"
        >
          📚 单词表
          <p className="text-sm font-normal mt-1 opacity-90">查看所有单词，点击扬声器朗读</p>
        </button>


        <button
          onClick={onShowAchievements}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-4 px-8 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105 btn-press"
        >
          🏆 查看成就
        </button>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-600 text-sm">
        <p>💡 提示：选择合适的难度，开始学习吧！</p>
      </div>

      {showWordList && (
        <WordList onClose={() => setShowWordList(false)} />
      )}
    </div>
  );
}