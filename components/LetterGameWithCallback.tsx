'use client';

import { useState, useEffect, useCallback, forwardRef, useImperativeHandle, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { getRandomWord, scrambleWord, type Word } from '@/lib/words';
import { speakWord, stopSpeaking } from '@/lib/speech';

interface LetterGameWithCallbackProps {
  mode: 'timed' | 'level';
  onWordComplete?: (word?: {word: string, translation: string, id: number}) => void; // Called when a word is completed correctly
  showBuiltInFeedback?: boolean; // Control whether to show the built-in success/failure modal (default: true)
  wordHistory?: number[]; // Track recently used word IDs to avoid repetition
}

export interface LetterGameRef {
  initializeWord: () => void;
}

const LetterGameWithCallback = forwardRef<LetterGameRef, LetterGameWithCallbackProps>(({ mode, onWordComplete, showBuiltInFeedback = true, wordHistory = [] }, ref) => {
  const { difficulty, addScore, incrementStreak, resetStreak } = useGameStore();
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  
  // Use ref to access latest wordHistory without triggering re-initialization
  const wordHistoryRef = useRef<number[]>(wordHistory);
  useEffect(() => {
    wordHistoryRef.current = wordHistory;
  }, [wordHistory]);
  
  // Track if component has been initialized
  const isInitializedRef = useRef(false);
  
  // Use ref for onWordComplete to avoid infinite loops
  const onWordCompleteRef = useRef(onWordComplete);
  useEffect(() => {
    onWordCompleteRef.current = onWordComplete;
  }, [onWordComplete]);
  
  // Use refs for Zustand store functions to avoid infinite loops
  const addScoreRef = useRef(addScore);
  const incrementStreakRef = useRef(incrementStreak);
  const resetStreakRef = useRef(resetStreak);
  useEffect(() => {
    addScoreRef.current = addScore;
    incrementStreakRef.current = incrementStreak;
    resetStreakRef.current = resetStreak;
  }, [addScore, incrementStreak, resetStreak]);

  // Initialize new word
  const initializeWord = useCallback(() => {
    // 停止当前正在播放的语音（如果有）
    stopSpeaking();
    
    const word = getRandomWord(difficulty, wordHistoryRef.current);
    setCurrentWord(word);
    const scrambled = scrambleWord(word.word);
    setScrambledLetters(scrambled);
    setAvailableLetters(scrambled);
    setSelectedLetters([]);
    setShowFeedback(null);
    setIsComplete(false);
  }, [difficulty]);
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    initializeWord
  }), [initializeWord]);

  // Initialize first word once (avoid hydration mismatch and infinite loops)
  useEffect(() => {
    if (!isInitializedRef.current) {
      // Delay initialization until after hydration
      const timer = setTimeout(() => {
        initializeWord();
        isInitializedRef.current = true;
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []); // Empty deps - only run once on mount

  // Handle letter selection
  const handleLetterSelect = (letter: string, index: number) => {
    if (isComplete) return;

    // Move letter from available to selected
    const newAvailable = [...availableLetters];
    newAvailable.splice(index, 1);
    setAvailableLetters(newAvailable);
    setSelectedLetters(prev => [...prev, letter]);
  };

  // Handle letter removal (click selected letter to remove)
  const handleLetterRemove = (index: number) => {
    if (isComplete) return;

    const removedLetter = selectedLetters[index];
    const newSelected = [...selectedLetters];
    newSelected.splice(index, 1);
    setSelectedLetters(newSelected);
    setAvailableLetters(prev => [...prev, removedLetter]);
  };

  // Check answer when all letters are selected
  useEffect(() => {
    if (selectedLetters.length === currentWord?.word.length && currentWord && !isComplete) {
      const userAnswer = selectedLetters.join('').toLowerCase();
      const correctAnswer = currentWord.word.toLowerCase();
      
      if (userAnswer === correctAnswer) {
        if (showBuiltInFeedback) {
          setShowFeedback('correct');
        }
        setIsComplete(true);
        
        // Calculate score based on difficulty
        const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
        addScoreRef.current(points);
        incrementStreakRef.current();
        
        // Play success sound
        // Show success message
        const successMessage = '你真棒';
        
        // Notify parent component of word completion
        if (onWordCompleteRef.current) {
          onWordCompleteRef.current(currentWord ? {word: currentWord.word, translation: currentWord.translation, id: currentWord.id} : undefined);
        }
        
        // 🔊 朗读正确的英语单词，等待发音完成后再自动跳转
        // Auto-advance to next word after audio completes (only for timed mode)
        if (mode === 'timed') {
          speakWord(currentWord.word, {
            rate: 0.7,  // 稍慢语速，便于学习
            pitch: 1.1, // 稍高音调，更清晰
            volume: 0.9, // 较大音量
            onEnd: () => {
              // 延迟初始化新单词，避免与当前 useEffect 冲突
              setTimeout(() => {
                initializeWord();
              }, 100);
            }
          });
        } else {
          // 关卡模式：只播放语音，不自动跳转
          speakWord(currentWord.word, {
            rate: 0.7,
            pitch: 1.1,
            volume: 0.9
          });
        }
      } else {
        if (showBuiltInFeedback) {
          setShowFeedback('wrong');
        }
        resetStreakRef.current();
        
        // Reset after delay
        setTimeout(() => {
          setSelectedLetters([]);
          setAvailableLetters(scrambledLetters);
          setShowFeedback(null);
        }, 1000);
      }
    }
  }, [selectedLetters, currentWord, difficulty, scrambledLetters, mode, showBuiltInFeedback, isComplete]);

  // Clear all selected letters
  const handleClear = () => {
    if (isComplete) return;
    setSelectedLetters([]);
    setAvailableLetters(scrambledLetters);
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
            <div className="text-6xl mb-2">{currentWord.imageUrl}</div>
            <div className="text-xl font-bold text-gray-800 mb-2">{currentWord.translation}</div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                speakWord(currentWord.word);
              }}
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 mb-2 cursor-pointer transition-all duration-200 bg-blue-50 px-4 py-2 rounded-xl border-2 border-blue-200 hover:border-blue-400 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          
          <div className="flex flex-wrap justify-center gap-2 min-h-[60px] items-center p-3 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
            {selectedLetters.map((letter, index) => (
              <button
                key={`selected-${index}`}
                onClick={() => handleLetterRemove(index)}
                className="w-12 h-12 bg-blue-500 text-white text-xl font-bold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-110 hover:bg-blue-600 active:scale-95"
                disabled={isComplete}
              >
                {letter.toLowerCase()}
              </button>
            ))}
            
            {/* Empty slots */}
            {Array.from({ length: currentWord.word.length - selectedLetters.length }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="w-12 h-12 bg-gray-200 rounded-xl border-2 border-dashed border-gray-400 flex items-center justify-center"
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
          
          <div className="flex flex-wrap justify-center gap-2">
            {availableLetters.map((letter, index) => (
              <button
                key={`available-${index}-${letter}`}
                onClick={() => handleLetterSelect(letter, index)}
                className="w-12 h-12 bg-green-500 text-white text-xl font-bold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-110 hover:bg-green-600 active:scale-95"
                disabled={isComplete}
              >
                {letter.toLowerCase()}
              </button>
            ))}
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
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
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
                  <div className="text-3xl font-extrabold text-green-500 mb-2 tracking-widest">太棒啦！</div>
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
                  <div className="text-3xl font-bold text-red-600 mb-2">再试试！</div>
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
