'use client';

import { useState, useEffect, useCallback, forwardRef, useImperativeHandle, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { getRandomWord, scrambleWord, type Word } from '@/lib/words';
import { speakWord, stopSpeaking } from '@/lib/speech';
import type { WordCompleteData } from '@/types';

interface LetterGameWithCallbackProps {
  mode: 'timed' | 'level';
  onWordComplete?: (word?: WordCompleteData) => void;
  showBuiltInFeedback?: boolean;
  wordHistory?: number[];
}

export interface LetterGameRef {
  initializeWord: () => void;
}

const LetterGameWithCallback = forwardRef<LetterGameRef, LetterGameWithCallbackProps>(({ mode, onWordComplete, showBuiltInFeedback = true, wordHistory = [] }, ref) => {
  const difficulty = useGameStore((s) => s.difficulty);
  const addScore = useGameStore((s) => s.addScore);
  const incrementStreak = useGameStore((s) => s.incrementStreak);
  const resetStreak = useGameStore((s) => s.resetStreak);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const wordHistoryRef = useRef<number[]>(wordHistory);
  useEffect(() => {
    wordHistoryRef.current = wordHistory;
  }, [wordHistory]);

  const isInitializedRef = useRef(false);

  const onWordCompleteRef = useRef(onWordComplete);
  useEffect(() => {
    onWordCompleteRef.current = onWordComplete;
  }, [onWordComplete]);

  const addScoreRef = useRef(addScore);
  const incrementStreakRef = useRef(incrementStreak);
  const resetStreakRef = useRef(resetStreak);
  useEffect(() => {
    addScoreRef.current = addScore;
    incrementStreakRef.current = incrementStreak;
    resetStreakRef.current = resetStreak;
  }, [addScore, incrementStreak, resetStreak]);

  const initializeWord = useCallback(() => {
    stopSpeaking();
    const word = getRandomWord(difficulty, wordHistoryRef.current);
    setCurrentWord(word);
    const scrambled = scrambleWord(word.word);
    setScrambledLetters(scrambled);
    setSelectedLetters([]);
    setSelectedIndices([]);
    setShowFeedback(null);
    setIsComplete(false);
  }, [difficulty]);

  useImperativeHandle(ref, () => ({
    initializeWord
  }), [initializeWord]);

  useEffect(() => {
    if (!isInitializedRef.current) {
      const timer = setTimeout(() => {
        initializeWord();
        isInitializedRef.current = true;
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLetterSelect = (letter: string, index: number) => {
    if (isComplete) return;
    setSelectedIndices(prev => (prev.includes(index) ? prev : [...prev, index]));
    setSelectedLetters(prev => [...prev, letter]);
  };

  const handleLetterRemove = (index: number) => {
    if (isComplete) return;
    setSelectedLetters(prev => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
    setSelectedIndices(prev => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  useEffect(() => {
    if (selectedLetters.length === currentWord?.word.length && currentWord && !isComplete) {
      const userAnswer = selectedLetters.join('').toLowerCase();
      const correctAnswer = currentWord.word.toLowerCase();

      if (userAnswer === correctAnswer) {
        if (showBuiltInFeedback) {
          setShowFeedback('correct');
        }
        setIsComplete(true);

        const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
        addScoreRef.current(points);
        incrementStreakRef.current();

        onWordCompleteRef.current?.({ word: currentWord.word, translation: currentWord.translation, id: currentWord.id });

        if (mode === 'timed') {
          speakWord(currentWord.word, {
            onEnd: () => {
              setTimeout(() => {
                initializeWord();
              }, 100);
            }
          });
        } else {
          speakWord(currentWord.word);
        }
      } else {
        if (showBuiltInFeedback) {
          setShowFeedback('wrong');
        }
        resetStreakRef.current();

        setTimeout(() => {
          setSelectedLetters([]);
          setSelectedIndices([]);
          setShowFeedback(null);
        }, 1000);
      }
    }
  }, [selectedLetters, currentWord, difficulty, mode, showBuiltInFeedback, isComplete, initializeWord]);

  const handleClear = () => {
    if (isComplete) return;
    setSelectedLetters([]);
    setSelectedIndices([]);
  };

  if (!currentWord) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-xl text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Word Display */}
        <div className="text-center mb-4">
          <div className="bg-white rounded-3xl shadow-xl p-4 mb-4">
            <div className="text-6xl mb-2" aria-hidden="true">{currentWord.imageUrl}</div>
            <div className="text-xl font-bold text-gray-800 mb-2">{currentWord.translation}</div>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); speakWord(currentWord.word); }}
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 mb-2 cursor-pointer transition-all duration-200 bg-blue-50 px-4 py-2 rounded-xl border-2 border-blue-200 hover:border-blue-400 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label={`朗读单词 ${currentWord.word}`}
            >
              🔊 听发音
            </button>
            <div className="text-lg text-gray-600 capitalize">#{currentWord.category}</div>
            <div className="text-sm text-gray-500 mt-2">
              难度: {difficulty === 'easy' ? '简单 (≤3字母)' : difficulty === 'medium' ? '中等 (4-5字母)' : '困难 (≥6字母)'}
            </div>
          </div>
        </div>

        {/* Selected Letters Area */}
        <div className="bg-white rounded-3xl shadow-xl p-4 mb-4">
          <div className="text-center mb-2">
            <h3 className="text-lg font-bold text-gray-800">拼出单词：</h3>
          </div>

          <div className="flex flex-wrap justify-center gap-2 min-h-[60px] items-center p-3 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300" role="group" aria-label="已选字母区域">
            {selectedLetters.map((letter, index) => (
              <button
                key={`selected-${index}`}
                onClick={() => handleLetterRemove(index)}
                className="w-12 h-12 bg-blue-500 text-white text-xl font-bold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-110 hover:bg-blue-600 active:scale-95"
                disabled={isComplete}
                aria-label={`移除字母 ${letter.toLowerCase()}`}
              >
                {letter.toLowerCase()}
              </button>
            ))}

            {Array.from({ length: currentWord.word.length - selectedLetters.length }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="w-12 h-12 bg-gray-200 rounded-xl border-2 border-dashed border-gray-400 flex items-center justify-center"
                aria-hidden="true"
              >
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Letters */}
        <div className="bg-white rounded-3xl shadow-xl p-4 mb-4">
          <div className="text-center mb-2">
            <h3 className="text-lg font-bold text-gray-800">选择字母：</h3>
          </div>

          <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="可选字母">
            {scrambledLetters.map((letter, index) => {
              const isUsed = selectedIndices.includes(index);
              return (
                <button
                  key={`available-${index}-${letter}`}
                  onClick={() => handleLetterSelect(letter, index)}
                  className={`w-12 h-12 text-xl font-bold rounded-xl shadow-lg transform transition-all duration-200 ${
                    isUsed
                      ? 'bg-gray-300 text-gray-400 cursor-not-allowed opacity-60'
                      : 'bg-green-500 text-white hover:scale-110 hover:bg-green-600 active:scale-95'
                  }`}
                  disabled={isComplete || isUsed}
                  aria-label={`选择字母 ${letter.toLowerCase()}`}
                >
                  {letter.toLowerCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3 mb-4">
          <button
            onClick={handleClear}
            className="px-6 py-3 bg-orange-500 text-white font-bold rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:bg-orange-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            disabled={isComplete || selectedLetters.length === 0}
          >
            🔄 重新开始
          </button>

          <button
            onClick={initializeWord}
            className="px-6 py-3 bg-purple-500 text-white font-bold rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:bg-purple-600 active:scale-95 text-sm"
          >
            ⏭️ 下一个单词
          </button>
        </div>

        {/* Feedback Display */}
        {showFeedback && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          >
            <div className={`bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 rounded-3xl p-8 text-center shadow-2xl transform transition-all duration-300 ${
              showFeedback === 'correct' ? 'scale-100' : 'scale-110'
            }`}>
              {showFeedback === 'correct' ? (
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="text-8xl animate-bounce">🎉</div>
                    <div className="absolute -top-4 -left-6 text-3xl animate-pulse">⭐</div>
                    <div className="absolute -top-6 -right-4 text-3xl animate-pulse">🌟</div>
                    <div className="absolute -bottom-4 left-0 text-3xl animate-pulse">✨</div>
                  </div>
                  <div id="feedback-title" className="text-3xl font-extrabold text-green-500 mb-2 tracking-widest">太棒啦！</div>
                  <div className="text-lg text-gray-600 mb-4">你拼对了这个单词</div>
                  <div className="bg-gradient-to-r from-yellow-100 via-pink-100 to-blue-100 rounded-3xl p-4 mb-4 shadow-inner w-full max-w-md">
                    <div className="text-4xl font-extrabold text-blue-600 mb-2 tracking-wider">{currentWord.word}</div>
                    <div className="text-xl text-gray-700 mb-1">{currentWord.translation}</div>
                    <div className="text-sm text-gray-500">看看你能连续答对多少个？</div>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-500 mb-2">
                    <span className="text-2xl animate-bounce">⭐</span>
                    <span className="text-2xl animate-bounce delay-150">⭐</span>
                    <span className="text-2xl animate-bounce delay-300">⭐</span>
                  </div>
                  <div className="text-xs text-gray-400">小提示：听一听发音，再试试更难的关卡</div>
                </div>
              ) : (
                <div>
                  <div className="text-8xl mb-4">😅</div>
                  <div id="feedback-title" className="text-3xl font-bold text-red-600 mb-2">再试试！</div>
                  <div className="text-xl text-gray-700">重新排列字母</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-100 rounded-2xl p-4 text-center">
          <div className="text-sm text-yellow-800">
            💡 <strong>游戏说明：</strong> 点击绿色字母按钮来拼出正确的英文单词。点击蓝色字母可以移除。
          </div>
        </div>
      </div>
    </div>
  );
});

LetterGameWithCallback.displayName = 'LetterGameWithCallback';

export default LetterGameWithCallback;
