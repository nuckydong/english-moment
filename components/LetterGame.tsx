'use client';

import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { getRandomWord, scrambleWord, type Word } from '@/lib/words';
import { speakWord } from '@/lib/speech';

interface LetterGameProps {
  mode: 'timed' | 'level';
  onComplete?: () => void;
}

export default function LetterGame({ mode, onComplete }: LetterGameProps) {
  const { difficulty, addScore, incrementStreak, resetStreak } = useGameStore();
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Initialize new word
  const initializeWord = useCallback(() => {
    const word = getRandomWord(difficulty);
    setCurrentWord(word);
    const scrambled = scrambleWord(word.word);
    setScrambledLetters(scrambled);
    setAvailableLetters(scrambled);
    setSelectedLetters([]);
    setShowFeedback(null);
    setIsComplete(false);
  }, [difficulty]);

  // Initialize first word (delay to avoid hydration mismatch)
  useEffect(() => {
    // Delay initialization until after hydration to avoid server/client mismatch
    const timer = setTimeout(() => {
      initializeWord();
    }, 0);
    return () => clearTimeout(timer);
  }, [initializeWord]);

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
    if (selectedLetters.length === currentWord?.word.length && currentWord) {
      const userAnswer = selectedLetters.join('').toLowerCase();
      const correctAnswer = currentWord.word.toLowerCase();
      
      if (userAnswer === correctAnswer) {
        setShowFeedback('correct');
        setIsComplete(true);
        
        // 🔊 朗读正确的英语单词（英伦口音）
        speakWord(currentWord.word, {
          rate: 0.7,  // 稍慢语速，便于学习
          pitch: 1.1, // 稍高音调，更清晰
          volume: 0.9 // 较大音量
        });
        
        // Calculate score based on difficulty
        const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
        addScore(points);
        incrementStreak();
        
        // Auto-advance to next word after delay (don't complete level)
        setTimeout(() => {
          initializeWord(); // Always get next word, don't call onComplete here
        }, 1500);
      } else {
        setShowFeedback('wrong');
        resetStreak();
        
        // Reset after delay
        setTimeout(() => {
          setSelectedLetters([]);
          setAvailableLetters(scrambledLetters);
          setShowFeedback(null);
        }, 1000);
      }
    }
  }, [selectedLetters, currentWord, difficulty, addScore, incrementStreak, resetStreak, onComplete, scrambledLetters, initializeWord]);

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
        <div className="text-center mb-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <div className="text-8xl mb-4">{currentWord.imageUrl}</div>
            <div className="text-2xl font-bold text-gray-800 mb-2">{currentWord.translation}</div>
            <div className="text-lg text-gray-600 capitalize">#{currentWord.category}</div>
          </div>
        </div>

        {/* Selected Letters Area */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">拼出单词：</h3>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 min-h-[80px] items-center p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
            {selectedLetters.map((letter, index) => (
              <button
                key={`selected-${index}`}
                onClick={() => handleLetterRemove(index)}
                className="w-16 h-16 bg-blue-500 text-white text-2xl font-bold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-110 hover:bg-blue-600 active:scale-95"
                disabled={isComplete}
              >
                {letter.toUpperCase()}
              </button>
            ))}
            
            {/* Empty slots */}
            {Array.from({ length: currentWord.word.length - selectedLetters.length }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="w-16 h-16 bg-gray-200 rounded-xl border-2 border-dashed border-gray-400 flex items-center justify-center"
              >
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Letters */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">选择字母：</h3>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {availableLetters.map((letter, index) => (
              <button
                key={`available-${index}-${letter}`}
                onClick={() => handleLetterSelect(letter, index)}
                className="w-16 h-16 bg-green-500 text-white text-2xl font-bold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-110 hover:bg-green-600 active:scale-95"
                disabled={isComplete}
              >
                {letter.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={handleClear}
            className="px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:bg-orange-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isComplete || selectedLetters.length === 0}
          >
            🔄 重新开始
          </button>
          
          <button
            onClick={initializeWord}
            className="px-8 py-4 bg-purple-500 text-white font-bold rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:bg-purple-600 active:scale-95"
          >
            ⏭️ 下一个单词
          </button>
        </div>

        {/* Feedback Display */}
        {showFeedback && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className={`bg-white rounded-3xl p-8 text-center shadow-2xl transform transition-all duration-300 ${
              showFeedback === 'correct' ? 'scale-100' : 'scale-110'
            }`}>
              {showFeedback === 'correct' ? (
                <div>
                  <div className="text-8xl mb-4">🎉</div>
                  <div className="text-3xl font-bold text-green-600 mb-4">正确！</div>
                  <div className="bg-blue-50 rounded-2xl p-4 mb-4">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{currentWord.word}</div>
                    <div className="text-xl text-gray-600">{currentWord.translation}</div>
                  </div>
                  <div className="text-sm text-gray-500">🔊 听一听标准发音</div>
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
}
