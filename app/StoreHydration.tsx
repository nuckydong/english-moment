'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export function StoreHydration({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    useGameStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🎮</div>
          <div className="text-xl text-gray-600">加载中...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
