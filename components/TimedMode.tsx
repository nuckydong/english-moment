'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import LetterGameWithCallback from './LetterGameWithCallback';
import type { WordCompleteData } from '@/types';

const GAME_DURATION = 120;

export default function TimedMode() {
  const difficulty = useGameStore((s) => s.difficulty);
  const resetStreak = useGameStore((s) => s.resetStreak);
  const score = useGameStore((s) => s.score);
  const streak = useGameStore((s) => s.streak);
  const setMode = useGameStore((s) => s.setMode);
  const startGame = useGameStore((s) => s.startGame);
  const endGame = useGameStore((s) => s.endGame);
  const checkSpeedMaster = useGameStore((s) => s.checkSpeedMaster);
  const incrementCorrect = useGameStore((s) => s.incrementCorrect);

  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isGameActive, setIsGameActive] = useState(false);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [completedWord, setCompletedWord] = useState<WordCompleteData | null>(null);
  const [wordHistory, setWordHistory] = useState<number[]>([]);
  const [showStartModal, setShowStartModal] = useState(true);
  const [isShattering, setIsShattering] = useState(false);

  // 追踪 60 秒窗口内答对的单词数（用于 speed_master 成就）
  const correctTimestampsRef = useRef<number[]>([]);

  useEffect(() => {
    startGame();
  }, [startGame]);

  const restartGame = useCallback(() => {
    startGame();
    setTimeLeft(GAME_DURATION);
    setIsGameActive(true);
    setWordsCompleted(0);
    setShowGameOver(false);
    setWordHistory([]);
    resetStreak();
    correctTimestampsRef.current = [];
  }, [resetStreak, startGame]);

  // Timer countdown - 只依赖 isGameActive，避免每秒重建 interval
  useEffect(() => {
    if (!isGameActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameActive(false);
          setShowGameOver(true);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameActive, endGame]);

  const handleWordComplete = useCallback((word?: WordCompleteData) => {
    if (isGameActive && word) {
      setWordsCompleted(prev => prev + 1);
      setCompletedWord(word);
      incrementCorrect();

      // 追踪 60 秒窗口内答对数
      const now = Date.now();
      correctTimestampsRef.current.push(now);
      correctTimestampsRef.current = correctTimestampsRef.current.filter(
        ts => now - ts < 60_000
      );
      checkSpeedMaster(correctTimestampsRef.current.length);

      setWordHistory(prev => {
        const newHistory = [...prev, word.id];
        return newHistory.slice(-5);
      });

      setTimeout(() => setCompletedWord(null), 1500);
    }
  }, [isGameActive, incrementCorrect, checkSpeedMaster]);

  const handleStart = () => {
    if (isShattering) return;
    setIsShattering(true);
    setTimeout(() => {
      restartGame();
      setShowStartModal(false);
      setIsShattering(false);
    }, 500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header with stats */}
      <div className="bg-white shadow-lg p-4 mb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMode('menu')}
                className="flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="返回主页"
              >
                <span className="text-2xl">🏠</span>
              </button>
              <h1 className="text-3xl font-bold text-gray-800">⏰ 计时模式</h1>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">难度</div>
              <div className="text-lg font-bold capitalize text-blue-600">
                {difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难'}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Timer with aria-live */}
            <div className={`rounded-2xl p-4 text-center ${
              timeLeft <= 10 ? 'bg-red-100' : timeLeft <= 30 ? 'bg-yellow-100' : 'bg-green-100'
            }`}>
              <div
                className={`text-3xl font-bold ${
                  timeLeft <= 10 ? 'text-red-600' : timeLeft <= 30 ? 'text-yellow-600' : 'text-green-600'
                }`}
                role="timer"
                aria-live={timeLeft <= 10 ? 'assertive' : 'polite'}
                aria-label={`剩余时间 ${Math.floor(timeLeft / 60)} 分 ${timeLeft % 60} 秒`}
              >
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-700">剩余时间</div>
            </div>

            <div className="bg-blue-100 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{wordsCompleted}</div>
              <div className="text-sm text-gray-700">完成单词</div>
            </div>

            <div className="bg-purple-100 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">{score}</div>
              <div className="text-sm text-gray-700">当前得分</div>
            </div>

            <div className="bg-orange-100 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-orange-600">{streak}</div>
              <div className="text-sm text-gray-700">连续正确</div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      {!showGameOver && (
        <LetterGameWithCallback
          mode="timed"
          onWordComplete={handleWordComplete}
          showBuiltInFeedback={false}
          wordHistory={wordHistory}
        />
      )}

      {/* Start Game Modal */}
      {showStartModal && !showGameOver && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="start-modal-title"
          className={`fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${
            isShattering ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div
            className={`relative rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-white/40 bg-white/20 backdrop-blur-xl transform transition-transform duration-500 ${
              isShattering ? 'scale-110' : 'scale-100'
            }`}
          >
            <div className="text-6xl mb-4">⏱️</div>
            <h2 id="start-modal-title" className="text-3xl font-bold text-gray-100 mb-4">准备好了吗？</h2>
            <p className="text-gray-200 mb-6">点击"开始"后，120 秒倒计时才会开始。</p>

            <button
              onClick={handleStart}
              className="w-full bg-blue-500/80 text-white font-bold py-4 px-8 rounded-2xl text-lg hover:bg-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              ▶️ 开始
            </button>
          </div>
        </div>
      )}

      {/* Word Completion Feedback Popup */}
      {completedWord && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="pointer-events-auto bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 rounded-3xl p-6 shadow-2xl border-4 border-yellow-300 min-w-[280px] max-w-xs transform animate-bounce">
            <div className="text-center flex flex-col items-center">
              <div className="relative mb-3">
                <div className="text-5xl">🎉</div>
                <div className="absolute -top-3 -left-4 text-2xl animate-pulse">⭐</div>
                <div className="absolute -top-4 -right-3 text-2xl animate-pulse">🌟</div>
              </div>
              <div className="text-2xl font-extrabold text-green-500 mb-1 tracking-widest">太棒啦！</div>
              <div className="text-sm text-gray-600 mb-3">你又拼对了一个单词</div>
              <div className="bg-white/70 rounded-2xl p-3 mb-3 shadow-inner w-full">
                <div className="text-2xl font-extrabold text-blue-600 mb-1 tracking-wider">
                  {completedWord.word}
                </div>
                <div className="text-base text-gray-700">
                  {completedWord.translation}
                </div>
              </div>
              <div className="flex items-center gap-1 text-yellow-500 text-xl">
                <span className="animate-bounce">⭐</span>
                <span className="animate-bounce delay-150">⭐</span>
                <span className="animate-bounce delay-300">⭐</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {showGameOver && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="gameover-title"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="text-8xl mb-4">⏰</div>
            <h2 id="gameover-title" className="text-3xl font-bold text-gray-800 mb-4">时间到！</h2>

            <div className="space-y-4 mb-6">
              <div className="bg-blue-100 rounded-2xl p-4">
                <div className="text-2xl font-bold text-blue-600">{wordsCompleted}</div>
                <div className="text-sm text-gray-700">完成单词</div>
              </div>

              <div className="bg-purple-100 rounded-2xl p-4">
                <div className="text-2xl font-bold text-purple-600">{score}</div>
                <div className="text-sm text-gray-700">总得分</div>
              </div>

              <div className="bg-orange-100 rounded-2xl p-4">
                <div className="text-2xl font-bold text-orange-600">{streak}</div>
                <div className="text-sm text-gray-700">最高连击</div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={restartGame}
                className="flex-1 bg-blue-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:bg-blue-600 active:scale-95"
              >
                🔄 再玩一次
              </button>

              <button
                onClick={() => {
                  setTimeLeft(GAME_DURATION);
                  setIsGameActive(false);
                  setWordsCompleted(0);
                  setShowGameOver(false);
                  setMode('menu');
                }}
                className="flex-1 bg-gray-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:bg-gray-600 active:scale-95"
              >
                🏠 返回主页
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {isGameActive && (
        <div className="max-w-4xl mx-auto px-4 pb-6">
          <div className="bg-yellow-100 rounded-2xl p-4 text-center">
            <div className="text-sm text-yellow-800">
              🎯 <strong>目标：</strong> 在120秒（2分钟）内完成尽可能多的单词！点击字母按钮拼出正确的英文单词。
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
