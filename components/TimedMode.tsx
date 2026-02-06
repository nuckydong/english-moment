'use client';

import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import LetterGameWithCallback from './LetterGameWithCallback';

export default function TimedMode() {
const {
  difficulty,
  resetStreak,
  score,
  streak,
  setMode,
  startGame,
} = useGameStore();
  
  const [timeLeft, setTimeLeft] = useState(120);
  const [isGameActive, setIsGameActive] = useState(true);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [completedWord, setCompletedWord] = useState<{word: string, translation: string, id: number} | null>(null);
  const [wordHistory, setWordHistory] = useState<number[]>([]);
   // 每次进入计时模式组件，认为开始一局新游戏：重置本局得分 & 连击
useEffect(() => {
  startGame();
}, [startGame]);
  // Timer countdown
  useEffect(() => {
    if (!isGameActive || timeLeft <= 0) {
      if (timeLeft <= 0 && isGameActive) {
        setIsGameActive(false);
        setShowGameOver(true);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsGameActive(false);
          setShowGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameActive, timeLeft]);

  // Handle word completion
  const handleWordComplete = useCallback((word?: {word: string, translation: string, id: number}) => {
    if (isGameActive && word) {
      setWordsCompleted(prev => prev + 1);
      setCompletedWord(word);
      
      // Update word history (keep last 5)
      setWordHistory(prev => {
        const newHistory = [...prev, word.id];
        return newHistory.slice(-5); // Keep only last 5
      });
      
      // Auto-hide after 1.5 seconds
      setTimeout(() => {
        setCompletedWord(null);
      }, 1500);
    }
  }, [isGameActive]);

  // Restart game
  const restartGame = () => {
      // 开始新的一局：重置本局得分和连击
    startGame();
    setTimeLeft(120);
    setIsGameActive(true);
    setWordsCompleted(0);
    setShowGameOver(false);
    setWordHistory([]); // Reset word history
    resetStreak();
  };

  // Format time display
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
                title="返回主页"
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
            {/* Timer */}
            <div className={`rounded-2xl p-4 text-center ${
              timeLeft <= 10 ? 'bg-red-100' : timeLeft <= 30 ? 'bg-yellow-100' : 'bg-green-100'
            }`}>
              <div className={`text-3xl font-bold ${
                timeLeft <= 10 ? 'text-red-600' : timeLeft <= 30 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-700">剩余时间</div>
            </div>
            
            {/* Words Completed */}
            <div className="bg-blue-100 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{wordsCompleted}</div>
              <div className="text-sm text-gray-700">完成单词</div>
            </div>
            
            {/* Current Score */}
            <div className="bg-purple-100 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">{score}</div>
              <div className="text-sm text-gray-700">当前得分</div>
            </div>
            
            {/* Streak */}
            <div className="bg-orange-100 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-orange-600">{streak}</div>
              <div className="text-sm text-gray-700">连续正确</div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      {isGameActive && !showGameOver && (
        <LetterGameWithCallback 
          mode="timed" 
          onWordComplete={handleWordComplete}
          showBuiltInFeedback={false}
          wordHistory={wordHistory}
        />
      )}

      {/* Word Completion Feedback Popup */}
      {completedWord && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-green-400 min-w-[300px] animate-bounce pointer-events-auto">
            <div className="text-center">
              <div className="text-5xl mb-2">✅</div>
              <div className="text-3xl font-bold text-gray-800 mb-2">
                {completedWord.word}
              </div>
              <div className="text-xl text-gray-600">
                {completedWord.translation}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {showGameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="text-8xl mb-4">⏰</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">时间到！</h2>
            
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
                  setTimeLeft(120);
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
