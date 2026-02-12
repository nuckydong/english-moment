'use client';

import { wordsDatabase } from '@/lib/words';
import { speakWord } from '@/lib/speech';

interface WordListProps {
  onClose: () => void;
}

export default function WordList({ onClose }: WordListProps) {
  const sortedWords = [...wordsDatabase].sort((a, b) =>
    a.word.localeCompare(b.word),
  );

  let currentInitial = '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex h-full w-full max-w-4xl flex-col bg-gradient-to-br from-blue-50 to-purple-50 md:h-[90vh] md:rounded-3xl md:shadow-2xl">
        <div className="flex items-center justify-between border-b border-purple-100 bg-white/70 px-4 py-3 md:px-6">
          <div>
            <div className="text-lg font-bold text-purple-700 md:text-2xl">
              📚 单词表
            </div>
            <div className="text-xs text-gray-500 md:text-sm">
              点击扬声器可以朗读对应的英语单词
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-red-100 px-3 py-1 text-sm font-semibold text-red-600 hover:bg-red-200 md:px-4 md:py-2"
          >
            返回首页
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 md:px-6 md:py-4">
          {sortedWords.map((word) => {
            const initial = word.word[0]?.toUpperCase() ?? '';
            const showHeader = initial !== currentInitial;
            if (showHeader) {
              currentInitial = initial;
            }

            return (
              <div key={word.id}>
                {showHeader && (
                  <div className="mt-3 flex items-center text-xs font-bold uppercase tracking-wide text-gray-500 first:mt-0 md:text-sm">
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                      {initial}
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-r from-purple-200 to-transparent" />
                  </div>
                )}

                <div className="mt-2 flex items-center rounded-3xl bg-white/90 px-3 py-2 shadow-sm md:mt-3 md:px-4 md:py-3">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-2xl md:h-12 md:w-12 md:text-3xl">
                      {word.imageUrl}
                    </div>
                    <div className="flex items-center gap-3 md:gap-4 overflow-x-auto whitespace-nowrap">
                      <div className="text-base font-bold text-gray-800 md:text-lg">
                        {word.word}
                      </div>
                      {word.phonetic && (
                        <div className="text-xs text-gray-400 md:text-sm">
                          {word.phonetic}
                        </div>
                      )}
                      <div className="text-sm text-gray-500 md:text-base">
                        {word.translation}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          speakWord(word.word);
                        }}
                        className="inline-flex items-center justify-center rounded-2xl bg-blue-50 px-2 py-1 text-base text-blue-600 hover:bg-blue-100 md:px-2.5 md:py-1.5"
                        aria-label="朗读单词"
                      >
                        🔊
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}