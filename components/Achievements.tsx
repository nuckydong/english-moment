'use client';

import { useGameStore } from '@/store/gameStore';

interface AchievementsProps {
  onClose: () => void;
}

export default function Achievements({ onClose }: AchievementsProps) {
  const achievements = useGameStore((s) => s.achievements);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progress = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="achievements-title"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 id="achievements-title" className="text-3xl font-bold text-white">🏆 成就系统</h2>
            <button
              onClick={onClose}
              className="bg-white text-gray-700 px-4 py-2 rounded-full font-bold hover:bg-gray-100 transition-all btn-press"
              aria-label="关闭成就面板"
            >
              ✕
            </button>
          </div>

          <div className="bg-white bg-opacity-20 rounded-2xl p-4">
            <div className="flex justify-between text-white font-bold mb-2">
              <span>进度</span>
              <span>{unlockedCount} / {totalCount}</span>
            </div>
            <div
              className="bg-white bg-opacity-30 rounded-full h-4 overflow-hidden"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Achievements List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`rounded-2xl p-4 transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-100 to-orange-100 shadow-lg'
                    : 'bg-gray-100 opacity-60'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`text-5xl ${achievement.unlocked ? 'animate-bounce-slow' : 'grayscale'}`} aria-hidden="true">
                    {achievement.icon}
                  </div>

                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-1 ${achievement.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                      {achievement.description}
                    </p>

                    {achievement.unlocked && achievement.unlockedAt && (
                      <div className="mt-2 text-xs text-orange-600 font-semibold">
                        ✓ 已解锁
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t">
          <div className="text-center text-gray-600 text-sm">
            {unlockedCount === totalCount ? (
              <p className="text-yellow-600 font-bold text-lg">🎉 恭喜你解锁所有成就！</p>
            ) : (
              <p>继续加油，解锁更多成就吧！💪</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
