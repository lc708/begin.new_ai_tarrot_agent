"use client";

/**
 * 首页 - 塔罗占卜师应用
 */

import { useState } from 'react';
import { Hero } from '@/components/Hero';
import { DivinationInterface } from '@/components/DivinationInterface';
import { useDivination, useDivinationStore } from '@/lib/store';

export default function Home() {
  const [currentView, setCurrentView] = useState<'home' | 'divination'>('home');
  const { sessionId } = useDivination();

  // 如果有活跃会话，直接显示占卜界面
  if (sessionId && currentView === 'home') {
    setCurrentView('divination');
  }

  const handleStartDivination = () => {
    setCurrentView('divination');
  };

  const handleBackToHome = () => {
    // 重置占卜状态并返回首页
    useDivinationStore.getState().resetDivination();
    setCurrentView('home');
  };

  if (currentView === 'divination') {
    return (
      <DivinationInterface
        onBack={handleBackToHome}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <Hero
        title="✨ 智能塔罗占卜师 ✨"
        subtitle="让AI为你解读命运的奥秘，获得人生指引和心灵启发"
        onStartDivination={handleStartDivination}
      />
    </div>
  );
}
