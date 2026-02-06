'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { speakWord } from '@/lib/speech';
import LetterGameWithCallback, { LetterGameRef } from './LetterGameWithCallback';

export default function LevelMode() {
  const { 
    difficulty, 
    currentLevel, 
    levelsProgress,
    completeLevel,
    setCurrentLevel, 
    score, 
    streak,
    setMode,
    resetLevelsProgress,
    fixLevelsUnlock,
    getCurrentDifficultyProgress,
    initializeDifficultyProgress
  } = useGameStore();

  // Get progress for current difficulty (with fallback to empty array)
  const currentDifficultyProgress = getCurrentDifficultyProgress();
  
  // Initialize difficulty progress if needed
  useEffect(() => {
    initializeDifficultyProgress(difficulty);
  }, [difficulty, initializeDifficultyProgress]);
  
  const [showLevelSelect, setShowLevelSelect] = useState(true);
  const [correctWords, setCorrectWords] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [levelStars, setLevelStars] = useState(0);
  const [showWordSuccess, setShowWordSuccess] = useState(false);
  const [wordSuccessMessage, setWordSuccessMessage] = useState('');
  const [completedWord, setCompletedWord] = useState<{word: string, translation: string, id: number} | null>(null);
  const [wordHistory, setWordHistory] = useState<number[]>([]);
  
  // Game reference for manual control
  const gameRef = useRef<LetterGameRef>(null);

  const wordsPerLevel = 5; // Each level requires 5 correct words

  // Auto-fix levels unlock logic (for existing users)
  useEffect(() => {
    console.log(`Current ${difficulty} levels progress:`, currentDifficultyProgress);
    
    // Check if we need to fix the unlock logic
    let needsFix = false;
    
    // First level should always be unlocked
    if (currentDifficultyProgress.length > 0 && !currentDifficultyProgress[0].unlocked) {
      console.log(`First level (${difficulty}) is locked, needs fix`);
      needsFix = true;
    }
    
    // If any level is completed but next level is not unlocked, fix it
    for (let i = 0; i < currentDifficultyProgress.length - 1; i++) {
      if (currentDifficultyProgress[i].completed && !currentDifficultyProgress[i + 1].unlocked) {
        console.log(`Level ${i + 1} (${difficulty}) completed but level ${i + 2} is locked, needs fix`);
        needsFix = true;
        break;
      }
    }
    
    if (needsFix) {
      console.log(`Applying level unlock fix for ${difficulty}...`);
      fixLevelsUnlock();
    }
  }, [currentDifficultyProgress, difficulty, fixLevelsUnlock]);

  const startLevel = useCallback((level: number) => {
    console.log(`🚀 Starting level ${level} for ${difficulty}`);
    setCurrentLevel(level); // Update the current level in store
    setShowLevelSelect(false);
    setCorrectWords(0);
    setWordHistory([]); // Reset word history
    setStartTime(Date.now());
    setIsLevelComplete(false);
    setLevelStars(0);
  }, [difficulty, setCurrentLevel]);

  // Handle word completion
  const handleWordComplete = useCallback((word?: {word: string, translation: string, id: number}) => {
    // Store the completed word for display
    if (word) {
      setCompletedWord(word);
      
      // Update word history (keep last 5)
      setWordHistory(prev => {
        const newHistory = [...prev, word.id];
        return newHistory.slice(-5); // Keep only last 5
      });
    }
    
    setCorrectWords(prevCorrectWords => {
      const newCorrectWords = prevCorrectWords + 1;
      
      // Show success message
      const successMessage = '正确！';
      
      // Show success popup
      setWordSuccessMessage(successMessage);
      setShowWordSuccess(true);
      
      return newCorrectWords;
    });
  }, []);
  
  // Continue to next word or complete level
  const continueGame = () => {
    setShowWordSuccess(false);
    
    if (correctWords >= wordsPerLevel) {
      // Level complete!
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      
      // Calculate stars based on time
      let stars = 1;
      if (timeTaken <= 30) stars = 3;
      else if (timeTaken <= 60) stars = 2;
      
      setLevelStars(stars);
      setIsLevelComplete(true);
      completeLevel(stars, timeTaken);
    } else {
      // Manually trigger next word initialization
      if (gameRef.current && gameRef.current.initializeWord) {
        gameRef.current.initializeWord();
      }
    }
  };
  
  // Return to main menu
  const returnToMenu = () => {
    setMode('menu');
  };

  // Next level
  const nextLevel = () => {
    setShowLevelSelect(true);
    setIsLevelComplete(false);
    setCorrectWords(0);
    setWordHistory([]); // Reset word history
  };

  // Retry level
  const retryLevel = () => {
    setCorrectWords(0);
    setWordHistory([]); // Reset word history
    setStartTime(Date.now());
    setIsLevelComplete(false);
    setLevelStars(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Level Selection Screen */}
      {showLevelSelect && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
            {/* Header with Home Button */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={returnToMenu}
                className="flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
                title="返回主页"
              >
                <span className="text-2xl">🏠</span>
              </button>
              
              <div className="text-center flex-1">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">🎯 关卡模式</h1>
                <div className="text-lg text-gray-600">选择关卡开始挑战</div>
              </div>
              
              {/* Spacer to center the title */}
              <div className="w-12"></div>
            </div>

            {/* Level Grid */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-8">
              {Array.from({ length: 10 }, (_, i) => {
                const level = i + 1;
                const levelProgress = currentDifficultyProgress[i];
                const isUnlocked = levelProgress?.unlocked || false;
                const isCurrentLevel = level === currentLevel;
                const isCompleted = levelProgress?.completed || false;
                
                return (
                  <button
                    key={level}
                    onClick={() => {
                      console.log(`🖱️ Clicked level ${level}, isUnlocked: ${isUnlocked}`);
                      if (isUnlocked) {
                        startLevel(level);
                      } else {
                        console.log(`❌ Level ${level} is locked, cannot start`);
                      }
                    }}
                    className={`relative p-6 rounded-2xl font-bold text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 ${
                      !isUnlocked
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : isCompleted
                        ? 'bg-green-500 text-white shadow-green-200 hover:bg-green-600'
                        : isCurrentLevel
                        ? 'bg-blue-500 text-white shadow-blue-200'
                        : 'bg-yellow-400 text-white shadow-yellow-200 hover:bg-yellow-500'
                    }`}
                    disabled={!isUnlocked}
                  >
                    <div className="mb-1">{level}</div>
                    {isCompleted && levelProgress?.stars && (
                      <div className="flex justify-center">
                        {Array.from({ length: levelProgress.stars }, (_, starIndex) => (
                          <span key={starIndex} className="text-yellow-300 text-xs">⭐</span>
                        ))}
                      </div>
                    )}
                    {isCurrentLevel && !isCompleted && (
                      <div className="absolute -top-2 -right-2 bg-red-400 text-white text-xs px-2 py-1 rounded-full font-bold">
                        NEW
                      </div>
                    )}
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl">🔒</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Difficulty Display */}
            <div className="text-center mb-6">
              <div className="bg-gray-100 rounded-2xl p-4 inline-block">
                <div className="text-sm text-gray-600 mb-1">当前难度</div>
                <div className="text-xl font-bold text-blue-600 capitalize">
                  {difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难'}
                </div>
              </div>
            </div>

            {/* Manual Fix Buttons */}
            <div className="text-center mb-6">
              <div className="flex gap-4 justify-center">
                <button
                  onClick={fixLevelsUnlock}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  🔧 修复关卡解锁
                </button>
                <button
                  onClick={() => {
                    console.log(`Current ${difficulty} levels progress:`, currentDifficultyProgress);
                    fixLevelsUnlock();
                    console.log(`After fix (${difficulty}):`, getCurrentDifficultyProgress());
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  🔄 刷新状态
                </button>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                如果完成关卡后下一关没解锁，请点击修复按钮
              </div>
            </div>

            {/* Rules */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-2 text-gray-800">💡 游戏规则：</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 每关需要答对 {wordsPerLevel} 个单词</li>
                <li>• 30秒内完成获得⭐⭐⭐</li>
                <li>• 60秒内完成获得⭐⭐</li>
                <li>• 超过60秒完成获得⭐</li>
                <li>• 点击字母按钮拼出正确单词</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Game Screen */}
      {!showLevelSelect && !isLevelComplete && (
        <div>
          {/* Header with progress */}
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
                  <h1 className="text-3xl font-bold text-gray-800">关卡 {currentLevel}</h1>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">难度</div>
                  <div className="text-lg font-bold capitalize text-blue-600">
                    {difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难'}
                  </div>
                </div>
              </div>
              
              {/* Progress */}
              <div className="bg-gray-200 rounded-full h-4 mb-4">
                <div 
                  className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(correctWords / wordsPerLevel) * 100}%` }}
                ></div>
              </div>
              
              <div className="text-center">
                <div className="bg-white rounded-full px-8 py-3 shadow-lg inline-block">
                  <span className="text-2xl font-bold text-blue-600">
                    {correctWords} / {wordsPerLevel}
                  </span>
                  <span className="text-gray-600 ml-2">完成</span>
                </div>
              </div>
            </div>
          </div>

          {/* Game Component */}
          <LetterGameWithCallback 
            ref={gameRef}
            mode="level" 
            onWordComplete={handleWordComplete}
            showBuiltInFeedback={false}
            wordHistory={wordHistory}
          />
        </div>
      )}

      {/* Word Success Modal */}
      {showWordSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && setShowWordSuccess(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-8xl mb-4">🎉</div>
            <div className="text-3xl font-bold text-green-600 mb-4">{wordSuccessMessage}</div>
            
            {/* 显示完整单词 - 蓝色卡片 */}
            {completedWord && (
              <div className="bg-blue-50 rounded-2xl p-4 mb-4">
                <div className="text-4xl font-bold text-blue-600 mb-2">{completedWord.word}</div>
                <div className="text-xl text-gray-600">{completedWord.translation}</div>
              </div>
            )}
            
            <button 
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔊 鼠标按下发音按钮', completedWord);
                if (completedWord) {
                  console.log('🔊 准备播放:', completedWord.word);
                  speakWord(completedWord.word);
                } else {
                  console.log('❌ 没有完成的单词');
                }
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔊 点击发音按钮', completedWord);
              }}
              className="text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 mb-4 cursor-pointer transition-all duration-200 bg-blue-50 px-4 py-3 rounded-xl border-2 border-blue-200 hover:border-blue-400 relative shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              🔊 听一听标准发音
            </button>
            
            <div className="bg-green-100 rounded-2xl p-4 mb-6">
              <div className="text-xl font-bold text-green-600">{correctWords} / {wordsPerLevel}</div>
              <div className="text-sm text-gray-700">单词完成</div>
            </div>
            
            <button
              onClick={continueGame}
              className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-4 px-8 rounded-2xl text-lg hover:from-green-500 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {correctWords >= wordsPerLevel ? '完成关卡! 🎊' : '继续下一个单词 ➡️'}
            </button>
          </div>
        </div>
      )}

      {/* Level Complete Modal */}
      {isLevelComplete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">关卡完成！</h2>
            
            {/* Stars */}
            <div className="flex justify-center mb-6">
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className={`text-4xl mx-1 transition-all duration-300 ${
                    i < levelStars ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ⭐
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-blue-100 rounded-2xl p-4">
                <div className="text-2xl font-bold text-blue-600">{correctWords}</div>
                <div className="text-sm text-gray-700">完成单词</div>
              </div>
              
              <div className="bg-purple-100 rounded-2xl p-4">
                <div className="text-2xl font-bold text-purple-600">{score}</div>
                <div className="text-sm text-gray-700">总得分</div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={retryLevel}
                className="flex-1 bg-orange-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:bg-orange-600 active:scale-95"
              >
                🔄 重试关卡
              </button>
              
              <button
                onClick={nextLevel}
                className="flex-1 bg-blue-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:bg-blue-600 active:scale-95"
              >
                ➡️ 继续游戏
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
