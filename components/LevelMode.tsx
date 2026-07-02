'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { speakWord } from '@/lib/speech';
import LetterGameWithCallback, { type LetterGameRef } from './LetterGameWithCallback';
import type { WordCompleteData } from '@/types';

const WORDS_PER_LEVEL = 5;

export default function LevelMode() {
  const difficulty = useGameStore((s) => s.difficulty);
  const currentLevel = useGameStore((s) => s.currentLevel);
  const completeLevel = useGameStore((s) => s.completeLevel);
  const setCurrentLevel = useGameStore((s) => s.setCurrentLevel);
  const score = useGameStore((s) => s.score);
  const streak = useGameStore((s) => s.streak);
  const setMode = useGameStore((s) => s.setMode);
  const resetLevelsProgress = useGameStore((s) => s.resetLevelsProgress);
  const fixLevelsUnlock = useGameStore((s) => s.fixLevelsUnlock);
  const getCurrentDifficultyProgress = useGameStore((s) => s.getCurrentDifficultyProgress);
  const initializeDifficultyProgress = useGameStore((s) => s.initializeDifficultyProgress);
  const incrementCorrect = useGameStore((s) => s.incrementCorrect);

  const currentDifficultyProgress = getCurrentDifficultyProgress();
  const currentLevelProgress = currentDifficultyProgress.find(p => p.level === currentLevel);
  const levelStars = currentLevelProgress?.stars ?? 0;

  useEffect(() => {
    initializeDifficultyProgress(difficulty);
  }, [difficulty, initializeDifficultyProgress]);

  const [showLevelSelect, setShowLevelSelect] = useState(true);
  const [correctWords, setCorrectWords] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [showWordSuccess, setShowWordSuccess] = useState(false);
  const [wordSuccessMessage, setWordSuccessMessage] = useState('');
  const [completedWord, setCompletedWord] = useState<WordCompleteData | null>(null);
  const [wordHistory, setWordHistory] = useState<number[]>([]);
  const [levelScore, setLevelScore] = useState(0);
  const [showLevelStartModal, setShowLevelStartModal] = useState(false);
  const [isLevelShattering, setIsLevelShattering] = useState(false);

  const gameRef = useRef<LetterGameRef>(null);

  // Auto-fix levels unlock logic
  useEffect(() => {
    let needsFix = false;
    if (currentDifficultyProgress.length > 0 && !currentDifficultyProgress[0].unlocked) {
      needsFix = true;
    }
    for (let i = 0; i < currentDifficultyProgress.length - 1; i++) {
      if (currentDifficultyProgress[i].completed && !currentDifficultyProgress[i + 1].unlocked) {
        needsFix = true;
        break;
      }
    }
    if (needsFix) fixLevelsUnlock();
  }, [currentDifficultyProgress, fixLevelsUnlock]);

  const startLevel = useCallback((level: number) => {
    setCurrentLevel(level);
    setShowLevelSelect(false);
    setCorrectWords(0);
    setWordHistory([]);
    setIsLevelComplete(false);
    setLevelScore(0);
    setShowLevelStartModal(true);
  }, [setCurrentLevel]);

  const handleWordComplete = useCallback((word?: WordCompleteData) => {
    if (word) {
      setCompletedWord(word);
      setWordHistory(prev => [...prev, word.id].slice(-5));
    }

    setCorrectWords(prevCorrectWords => {
      const newCorrectWords = prevCorrectWords + 1;
      setWordSuccessMessage('正确！');
      setShowWordSuccess(true);
      return newCorrectWords;
    });

    incrementCorrect();

    const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
    setLevelScore(prev => prev + points);
  }, [difficulty, incrementCorrect]);

  const continueGame = () => {
    setShowWordSuccess(false);

    if (correctWords >= WORDS_PER_LEVEL) {
      const timeTaken = startTime > 0 ? Math.floor((Date.now() - startTime) / 1000) : 0;
      let stars = 1;
      if (timeTaken <= 30) stars = 3;
      else if (timeTaken <= 60) stars = 2;

      setIsLevelComplete(true);
      completeLevel(stars, timeTaken);
    } else {
      if (gameRef.current?.initializeWord) {
        gameRef.current.initializeWord();
      }
    }
  };

  const returnToMenu = () => setMode('menu');

  const nextLevel = () => {
    setShowLevelSelect(true);
    setIsLevelComplete(false);
    setCorrectWords(0);
    setWordHistory([]);
  };

  const retryLevel = () => {
    setCorrectWords(0);
    setWordHistory([]);
    setIsLevelComplete(false);
    setLevelScore(0);
    setShowLevelStartModal(true);
  };

  const handleStartLevel = () => {
    if (isLevelShattering) return;
    setIsLevelShattering(true);
    setTimeout(() => {
      setShowLevelStartModal(false);
      setStartTime(Date.now());
      setIsLevelShattering(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Level Selection Screen */}
      {showLevelSelect && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={returnToMenu}
                className="flex items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="返回主页"
              >
                <span className="text-2xl">🏠</span>
              </button>

              <div className="text-center flex-1">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">🎯 关卡模式</h1>
                <div className="text-lg text-gray-600">选择关卡开始挑战</div>
              </div>

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
                    onClick={() => isUnlocked && startLevel(level)}
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
                    aria-label={`关卡 ${level} ${isUnlocked ? '可进入' : '已锁定'}`}
                  >
                    <div className="mb-1">{level}</div>
                    {isCompleted && levelProgress?.stars && (
                      <div className="flex justify-center" aria-label={`${levelProgress.stars} 星`}>
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
                      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
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

            {/* Rules */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-2 text-gray-800">💡 游戏规则：</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 每关需要答对 {WORDS_PER_LEVEL} 个单词</li>
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
                  <h1 className="text-3xl font-bold text-gray-800">关卡 {currentLevel}</h1>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">难度</div>
                  <div className="text-lg font-bold capitalize text-blue-600">
                    {difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难'}
                  </div>
                </div>
              </div>

              <div className="bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(correctWords / WORDS_PER_LEVEL) * 100}%` }}
                  role="progressbar"
                  aria-valuenow={correctWords}
                  aria-valuemin={0}
                  aria-valuemax={WORDS_PER_LEVEL}
                ></div>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-full px-8 py-3 shadow-lg inline-block">
                  <span className="text-2xl font-bold text-blue-600">
                    {correctWords} / {WORDS_PER_LEVEL}
                  </span>
                  <span className="text-gray-600 ml-2">完成</span>
                </div>
              </div>
            </div>
          </div>

          <LetterGameWithCallback
            ref={gameRef}
            mode="level"
            onWordComplete={handleWordComplete}
            showBuiltInFeedback={false}
            wordHistory={wordHistory}
          />
        </div>
      )}

      {/* Level Start Modal */}
      {!showLevelSelect && !isLevelComplete && showLevelStartModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="level-start-title"
          className={`fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${
            isLevelShattering ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div
            className={`relative rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-white/40 bg-white/20 backdrop-blur-xl transform transition-transform duration-500 ${
              isLevelShattering ? 'scale-110' : 'scale-100'
            }`}
          >
            <div className="text-6xl mb-4">🚀</div>
            <h2 id="level-start-title" className="text-3xl font-bold text-gray-100 mb-4">准备好了吗？</h2>
            <p className="text-gray-200 mb-6">点击"开始"后，本关计时才会开始。</p>

            <button
              onClick={handleStartLevel}
              className="w-full bg-blue-500/80 text-white font-bold py-4 px-8 rounded-2xl text-lg hover:bg-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              ▶️ 开始
            </button>
          </div>
        </div>
      )}

      {/* Word Success Modal */}
      {showWordSuccess && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="word-success-title"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setShowWordSuccess(false)}
        >
          <div
            className="bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="text-7xl">🎉</div>
                <div className="absolute -top-3 -left-6 text-3xl animate-pulse">⭐</div>
                <div className="absolute -top-5 -right-4 text-3xl animate-pulse">🌟</div>
                <div className="absolute -bottom-4 left-1 text-3xl animate-pulse">✨</div>
              </div>
              <div id="word-success-title" className="text-3xl font-extrabold text-green-500 mb-2 tracking-widest">
                {wordSuccessMessage || '太棒啦！'}
              </div>
              <div className="text-sm text-gray-600 mb-4">你离闯关成功又近了一步</div>

              {completedWord && (
                <div className="bg-white/80 rounded-2xl p-4 mb-4 shadow-inner">
                  <div className="text-4xl font-extrabold text-blue-600 mb-2 tracking-wider">
                    {completedWord.word}
                  </div>
                  <div className="text-xl text-gray-700">{completedWord.translation}</div>
                </div>
              )}

              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (completedWord) speakWord(completedWord.word);
                }}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                className="text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 mb-4 cursor-pointer transition-all duration-200 bg-blue-50 px-4 py-3 rounded-xl border-2 border-blue-200 hover:border-blue-400 relative shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="听一听标准发音"
              >
                🔊 听一听标准发音
              </button>

              <div className="bg-green-100 rounded-2xl p-4 mb-6">
                <div className="text-xl font-bold text-green-600">
                  {correctWords} / {WORDS_PER_LEVEL}
                </div>
                <div className="text-sm text-gray-700">本关单词进度</div>
              </div>

              <button
                onClick={continueGame}
                className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-bold py-4 px-8 rounded-2xl text-lg hover:from-green-500 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                {correctWords >= WORDS_PER_LEVEL ? '完成关卡! 🎊' : '继续下一个单词 ➡️'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Level Complete Modal */}
      {isLevelComplete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="level-complete-title"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="text-8xl mb-4">🎉</div>
            <h2 id="level-complete-title" className="text-3xl font-bold text-gray-800 mb-4">关卡完成！</h2>

            <div className="flex justify-center mb-6" role="img" aria-label={`${levelStars} 星评价`}>
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
                <div className="text-2xl font-bold text-purple-600">{levelScore}</div>
                <div className="text-sm text-gray-700">本关得分</div>
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
