'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import MainMenu from '@/components/MainMenu';
import TimedMode from '@/components/TimedMode';
import LevelMode from '@/components/LevelMode';
import Achievements from '@/components/Achievements';

export default function Home() {
  const { currentMode } = useGameStore();
  const [showAchievements, setShowAchievements] = useState(false);

  return (
    <main className="relative">
      {currentMode === 'menu' && (
        <MainMenu onShowAchievements={() => setShowAchievements(true)} />
      )}
      {currentMode === 'timed' && <TimedMode />}
      {currentMode === 'level' && <LevelMode />}
      
      {showAchievements && (
        <Achievements onClose={() => setShowAchievements(false)} />
      )}
    </main>
  );
}
