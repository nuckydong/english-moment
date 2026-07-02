'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import dynamic from 'next/dynamic';
import Achievements from '@/components/Achievements';

const MainMenu = dynamic(() => import('@/components/MainMenu'));
const TimedMode = dynamic(() => import('@/components/TimedMode'), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="text-2xl animate-pulse">加载中...</div></div>,
});
const LevelMode = dynamic(() => import('@/components/LevelMode'), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="text-2xl animate-pulse">加载中...</div></div>,
});
const MatchMode = dynamic(() => import('@/components/MatchMode'), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="text-2xl animate-pulse">加载中...</div></div>,
});

export default function Home() {
  const currentMode = useGameStore((s) => s.currentMode);
  const [showAchievements, setShowAchievements] = useState(false);

  return (
    <main className="relative">
      {currentMode === 'menu' && (
        <MainMenu onShowAchievements={() => setShowAchievements(true)} />
      )}
      {currentMode === 'timed' && <TimedMode />}
      {currentMode === 'match' && <MatchMode />}
      {currentMode === 'level' && <LevelMode />}

      {showAchievements && (
        <Achievements onClose={() => setShowAchievements(false)} />
      )}
    </main>
  );
}
