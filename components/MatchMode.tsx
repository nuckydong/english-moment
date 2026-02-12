'use client';

import { useCallback, useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { getWordsByDifficulty, shuffleArray, type Word } from '@/lib/words';
import { speakWord } from '@/lib/speech';

const pastelColorClasses = [
  'bg-pink-100 border-pink-200 text-pink-800 hover:shadow-md hover:-translate-y-0.5',
  'bg-purple-100 border-purple-200 text-purple-800 hover:shadow-md hover:-translate-y-0.5',
  'bg-yellow-100 border-yellow-200 text-yellow-800 hover:shadow-md hover:-translate-y-0.5',
  'bg-green-100 border-green-200 text-green-800 hover:shadow-md hover:-translate-y-0.5',
  'bg-sky-100 border-sky-200 text-sky-800 hover:shadow-md hover:-translate-y-0.5',
  'bg-rose-100 border-rose-200 text-rose-800 hover:shadow-md hover:-translate-y-0.5',
];

const getPastelClass = (id: number, offset = 0) => {
  const index = Math.abs(id + offset) % pastelColorClasses.length;
  return pastelColorClasses[index];
};

export default function MatchMode() {
  const { difficulty, setMode } = useGameStore();
  const [roundWords, setRoundWords] = useState<Word[]>([]);
  const [chineseOrder, setChineseOrder] = useState<number[]>([]);
  const [englishOrder, setEnglishOrder] = useState<number[]>([]);
  const [cardOrder, setCardOrder] = useState<{ id: number; side: 'chinese' | 'english' }[]>([]);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [selectedChineseId, setSelectedChineseId] = useState<number | null>(null);
  const [selectedEnglishId, setSelectedEnglishId] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showRoundComplete, setShowRoundComplete] = useState(false);

  const wordsPerRound = 9;

  const startRound = useCallback(() => {
    const pool = getWordsByDifficulty(difficulty);
    if (pool.length === 0) {
      setRoundWords([]);
      setChineseOrder([]);
      setEnglishOrder([]);
      setCardOrder([]);
      setMatchedIds([]);
      setSelectedChineseId(null);
      setSelectedEnglishId(null);
      setIsChecking(false);
      setShowRoundComplete(false);
      return;
    }

    const selected = shuffleArray(pool).slice(0, Math.min(wordsPerRound, pool.length));
    setRoundWords(selected);

    const ids = selected.map((w) => w.id);
    const chineseIds = shuffleArray(ids);
    const englishIds = shuffleArray(ids);
    setChineseOrder(chineseIds);
    setEnglishOrder(englishIds);

    const combinedCards = shuffleArray([
      ...chineseIds.map((id) => ({ id, side: 'chinese' as const })),
      ...englishIds.map((id) => ({ id, side: 'english' as const })),
    ]);
    setCardOrder(combinedCards);

    setMatchedIds([]);
    setSelectedChineseId(null);
    setSelectedEnglishId(null);
    setIsChecking(false);
    setShowRoundComplete(false);
  }, [difficulty]);

  useEffect(() => {
    startRound();
  }, [startRound]);

  const handleChineseClick = (id: number) => {
    if (isChecking) return;
    if (matchedIds.includes(id)) return;
    setSelectedChineseId((prev) => (prev === id ? null : id));
  };

  const handleEnglishClick = (id: number) => {
    if (isChecking) return;
    if (matchedIds.includes(id)) return;
    setSelectedEnglishId((prev) => (prev === id ? null : id));
    const word = getWordById(id);
    if (word) {
      speakWord(word.word, {
        rate: 0.7,
        pitch: 1.1,
        volume: 0.9,
      });
    }
  };

  useEffect(() => {
    if (selectedChineseId == null || selectedEnglishId == null) return;

    setIsChecking(true);
    const isMatch = selectedChineseId === selectedEnglishId;

    if (isMatch) {
      setTimeout(() => {
        setMatchedIds((prev) => {
          if (prev.includes(selectedChineseId)) return prev;
          const next = [...prev, selectedChineseId];
          if (next.length === roundWords.length) {
            setShowRoundComplete(true);
          }
          return next;
        });
        setSelectedChineseId(null);
        setSelectedEnglishId(null);
        setIsChecking(false);
      }, 200);
    } else {
      setTimeout(() => {
        setSelectedChineseId(null);
        setSelectedEnglishId(null);
        setIsChecking(false);
      }, 600);
    }
  }, [selectedChineseId, selectedEnglishId, roundWords.length]);

  const getWordById = (id: number) => roundWords.find((w) => w.id === id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50">
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
              <div>
                <h1 className="text-3xl font-bold text-gray-800">🧩 单词消消乐</h1>
                <div className="text-sm text-gray-500">
                  点击一个汉语，再点击对应的英文，配对正确就会消失
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">难度</div>
              <div className="text-lg font-bold capitalize text-blue-600">
                {difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-6">
        <div className="mb-3 text-center text-sm font-semibold text-gray-600">
          点击任意卡片，配对正确的中文和英文
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {cardOrder.map(({ id, side }) => {
            const word = getWordById(id);
            if (!word) return null;
            const matched = matchedIds.includes(id);
            const selected =
              side === 'chinese'
                ? selectedChineseId === id
                : selectedEnglishId === id;
            const pastelClass = getPastelClass(id, side === 'chinese' ? 0 : 3);

            const handleClick = () => {
              if (side === 'chinese') {
                handleChineseClick(id);
              } else {
                handleEnglishClick(id);
              }
            };

            return (
              <button
                key={`${id}-${side}`}
                type="button"
                disabled={matched || isChecking}
                onClick={handleClick}
                className={`inline-flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-base md:text-lg font-semibold transition-all ${
                  matched
                    ? 'bg-gray-100 text-gray-400 border-gray-200 opacity-60 cursor-default'
                    : selected
                    ? side === 'chinese'
                      ? 'bg-indigo-100 border-indigo-400 text-indigo-700 scale-[1.02]'
                      : 'bg-emerald-100 border-emerald-400 text-emerald-700 scale-[1.02]'
                    : pastelClass
                }`}
              >
                {side === 'english' && (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-lg">
                    {word.imageUrl}
                  </span>
                )}
                {side === 'chinese' ? (
                  <span className="whitespace-nowrap">{word.translation}</span>
                ) : (
                  <span className="flex flex-col items-start leading-tight">
                    <span className="whitespace-nowrap">{word.word}</span>
                    {word.phonetic && (
                      <span className="mt-0.5 text-xs text-gray-600">{word.phonetic}</span>
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {showRoundComplete && (
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="text-3xl md:text-4xl">🎉</div>
            <div className="text-xl md:text-2xl font-bold text-green-600">本轮全部配对成功！</div>
            <button
              type="button"
              onClick={startRound}
              className="mt-2 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 px-6 py-3 text-base md:text-lg font-bold text-white shadow-lg transition-all hover:scale-105"
            >
              再来一组
            </button>
          </div>
        )}
      </div>
    </div>
  );
}