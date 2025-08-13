"use client";

/**
 * 占卜页面 - 独立的占卜界面页面
 */

import { DivinationInterface } from '@/components/DivinationInterface';
import { useRouter } from 'next/navigation';

export default function DivinationPage() {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <DivinationInterface
      onBack={handleBackToHome}
    />
  );
}

