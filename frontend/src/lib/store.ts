/**
 * Zustand状态管理 - 全局状态管理
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TarotCard, Topic, Spread } from './api';

// 占卜会话状态
export interface DivinationState {
  sessionId: string | null;
  currentStep: string;
  progress: number;
  completed: boolean;
  
  // 用户选择
  selectedTopic: string | null;
  selectedSpread: string | null;
  
  // 抽牌结果
  drawnCards: TarotCard[];
  interpretation: string | null;
  advice: string | null;
  
  // 对话历史
  conversationHistory: Array<{
    step: string;
    message: string;
    timestamp: string;
  }>;
  
  // 操作方法
  setSessionId: (sessionId: string) => void;
  setCurrentStep: (step: string) => void;
  setProgress: (progress: number) => void;
  setSelectedTopic: (topic: string) => void;
  setSelectedSpread: (spread: string) => void;
  setDrawnCards: (cards: TarotCard[]) => void;
  setInterpretation: (interpretation: string) => void;
  setAdvice: (advice: string) => void;
  addMessage: (step: string, message: string) => void;
  resetDivination: () => void;
}

// UI状态
export interface UIState {
  loading: boolean;
  error: string | null;
  showCardDetails: boolean;
  selectedCardId: string | null;
  theme: 'mystical' | 'light' | 'dark';
  
  // 操作方法
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setShowCardDetails: (show: boolean, cardId?: string) => void;
  setTheme: (theme: 'mystical' | 'light' | 'dark') => void;
  clearError: () => void;
}

// 数据缓存状态
export interface DataState {
  topics: Record<string, Topic> | null;
  spreads: Record<string, Spread> | null;
  cardCache: Record<string, TarotCard>;
  
  // 操作方法
  setTopics: (topics: Record<string, Topic>) => void;
  setSpreads: (spreads: Record<string, Spread>) => void;
  setCachedCard: (cardId: string, card: TarotCard) => void;
  getCachedCard: (cardId: string) => TarotCard | null;
}

// 占卜状态Store
export const useDivinationStore = create<DivinationState>()(
  persist(
    (set) => ({
      sessionId: null,
      currentStep: 'welcome',
      progress: 0,
      completed: false,
      selectedTopic: null,
      selectedSpread: null,
      drawnCards: [],
      interpretation: null,
      advice: null,
      conversationHistory: [],

      setSessionId: (sessionId) => set({ sessionId }),
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      setProgress: (progress) => set({ progress }),
      
      setSelectedTopic: (topic) => set({ selectedTopic: topic }),
      
      setSelectedSpread: (spread) => set({ selectedSpread: spread }),
      
      setDrawnCards: (cards) => set({ drawnCards: cards }),
      
      setInterpretation: (interpretation) => set({ interpretation }),
      
      setAdvice: (advice) => set({ advice }),
      
      addMessage: (step, message) => set((state) => ({
        conversationHistory: [
          ...state.conversationHistory,
          {
            step,
            message,
            timestamp: new Date().toISOString(),
          },
        ],
      })),
      
      resetDivination: () => set({
        sessionId: null,
        currentStep: 'welcome',
        progress: 0,
        completed: false,
        selectedTopic: null,
        selectedSpread: null,
        drawnCards: [],
        interpretation: null,
        advice: null,
        conversationHistory: [],
      }),
    }),
    {
      name: 'divination-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // 只持久化部分状态，避免存储敏感信息
        selectedTopic: state.selectedTopic,
        selectedSpread: state.selectedSpread,
        conversationHistory: state.conversationHistory.slice(-10), // 只保存最近10条
      }),
    }
  )
);

// UI状态Store
export const useUIStore = create<UIState>((set) => ({
  loading: false,
  error: null,
  showCardDetails: false,
  selectedCardId: null,
  theme: 'mystical',

  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  setShowCardDetails: (show, cardId) => set({ 
    showCardDetails: show, 
    selectedCardId: cardId || null 
  }),
  
  setTheme: (theme) => set({ theme }),
  
  clearError: () => set({ error: null }),
}));

// 数据缓存Store
export const useDataStore = create<DataState>((set, get) => ({
  topics: null,
  spreads: null,
  cardCache: {},

  setTopics: (topics) => set({ topics }),
  
  setSpreads: (spreads) => set({ spreads }),
  
  setCachedCard: (cardId, card) => set((state) => ({
    cardCache: {
      ...state.cardCache,
      [cardId]: card,
    },
  })),
  
  getCachedCard: (cardId) => {
    const state = get();
    return state.cardCache[cardId] || null;
  },
}));

// 组合Hook - 方便使用
export const useDivination = () => {
  const divinationState = useDivinationStore();
  const uiState = useUIStore();
  const dataState = useDataStore();

  return {
    // 状态
    ...divinationState,
    loading: uiState.loading,
    error: uiState.error,
    topics: dataState.topics,
    spreads: dataState.spreads,
    
    // UI操作
    setLoading: uiState.setLoading,
    setError: uiState.setError,
    clearError: uiState.clearError,
    
    // 数据操作
    setTopics: dataState.setTopics,
    setSpreads: dataState.setSpreads,
  };
};
