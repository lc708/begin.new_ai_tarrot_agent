/**
 * React Query hooks for 塔罗占卜API
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { apiMethods, DivinationStepRequest, StartDivinationRequest, TarotCard } from '@/lib/api';
import { useDivination } from '@/lib/store';
import { useCallback, useEffect } from 'react';

// Query Keys
export const QUERY_KEYS = {
  topics: ['topics'],
  spreads: ['spreads'],
  cardInfo: (cardId: string) => ['cardInfo', cardId],
  divinationStatus: (sessionId: string) => ['divinationStatus', sessionId],
} as const;

// 开始占卜
export const useStartDivination = () => {
  const { setSessionId, setCurrentStep, setProgress, addMessage, setLoading, setError } = useDivination();

  return useMutation({
    mutationFn: (request: StartDivinationRequest) => apiMethods.startDivination(request),
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      setSessionId(data.session_id);
      setCurrentStep(data.next_step || 'topic_selection');
      setProgress(10);
      addMessage('welcome', data.message);
      setLoading(false);
    },
    onError: (error: Error) => {
      setError(error.message);
      setLoading(false);
    },
  });
};

// 处理占卜步骤
export const useProcessDivinationStep = () => {
  const { setCurrentStep, setProgress, addMessage, setLoading, setError, setDrawnCards, setInterpretation, setAdvice } = useDivination();

  return useMutation({
    mutationFn: (request: DivinationStepRequest) => apiMethods.processDivinationStep(request),
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      setCurrentStep(data.next_step || 'completed');
      addMessage(data.status, data.message);
      
      // 根据步骤更新进度
      const progressMap: Record<string, number> = {
        'topic_selection': 20,
        'spread_selection': 40,
        'drawing_cards': 60,
        'interpretation': 80,
        'advice': 90,
        'completed': 100,
      };
      const progress = progressMap[data.next_step || 'completed'] || 50;
      setProgress(progress);
      
      // 处理返回的数据
      if (data.data) {
        // 处理抽牌数据
        if (data.data.drawn_cards && Array.isArray(data.data.drawn_cards)) {
          setDrawnCards(data.data.drawn_cards as TarotCard[]);
        }
        // 处理解读数据
        if (data.data.interpretation && typeof data.data.interpretation === 'string') {
          setInterpretation(data.data.interpretation);
        }
        // 处理建议数据
        if (data.data.advice && typeof data.data.advice === 'string') {
          setAdvice(data.data.advice);
        }
      }
      
      setLoading(false);
    },
    onError: (error: Error) => {
      setError(error.message);
      setLoading(false);
    },
  });
};

// 获取可用主题
export const useTopics = () => {
  const { setTopics } = useDivination();

  const query = useQuery({
    queryKey: QUERY_KEYS.topics,
    queryFn: () => apiMethods.getTopics(),
    staleTime: 5 * 60 * 1000, // 5分钟内不重新获取
    retry: 3,
  });

  // 使用useEffect处理数据更新
  useEffect(() => {
    if (query.data) {
      setTopics(query.data.topics);
    }
  }, [query.data, setTopics]);

  return query;
};

// 获取可用牌阵
export const useSpreads = () => {
  const { setSpreads } = useDivination();

  const query = useQuery({
    queryKey: QUERY_KEYS.spreads,
    queryFn: () => apiMethods.getSpreads(),
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

  // 使用useEffect处理数据更新
  useEffect(() => {
    if (query.data) {
      setSpreads(query.data.spreads);
    }
  }, [query.data, setSpreads]);

  return query;
};

// 获取塔罗牌信息
export const useCardInfo = (cardId: string | null) => {
  return useQuery({
    queryKey: QUERY_KEYS.cardInfo(cardId || ''),
    queryFn: () => cardId ? apiMethods.getCardInfo(cardId) : Promise.resolve(null),
    enabled: !!cardId,
    staleTime: 10 * 60 * 1000, // 10分钟缓存
    retry: 2,
  });
};

// 获取占卜状态
export const useDivinationStatus = (sessionId: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.divinationStatus(sessionId || ''),
    queryFn: () => sessionId ? apiMethods.getDivinationStatus(sessionId) : Promise.resolve(null),
    enabled: enabled && !!sessionId,
    refetchInterval: (query) => {
      // 如果占卜未完成，每5秒刷新一次状态
      return query.state.data?.completed ? false : 5000;
    },
    retry: 2,
  });
};

// 快速占卜（测试用）
export const useQuickDivination = () => {
  const { setDrawnCards, setInterpretation, setAdvice, setLoading, setError } = useDivination();

  return useMutation({
    mutationFn: () => apiMethods.quickDivination(),
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      setDrawnCards(data.drawn_cards);
      setInterpretation(data.interpretation);
      setAdvice(data.advice);
      setLoading(false);
    },
    onError: (error: Error) => {
      setError(error.message);
      setLoading(false);
    },
  });
};

// 组合Hook - 占卜流程管理
export const useDivinationFlow = () => {
  const startDivination = useStartDivination();
  const processStep = useProcessDivinationStep();
  const { sessionId, currentStep, selectedTopic, selectedSpread } = useDivination();

  // 选择主题
  const selectTopic = useCallback((topic: string) => {
    if (!sessionId) return;
    
    processStep.mutate({
      session_id: sessionId,
      step: 'select_topic',
      data: { topic },
    });
  }, [sessionId, processStep]);

  // 选择牌阵
  const selectSpread = useCallback((spread: string) => {
    if (!sessionId) return;
    
    processStep.mutate({
      session_id: sessionId,
      step: 'select_spread',
      data: { spread },
    });
  }, [sessionId, processStep]);

  // 开始抽牌
  const drawCards = useCallback(() => {
    if (!sessionId) return;
    
    processStep.mutate({
      session_id: sessionId,
      step: 'draw_cards',
      data: {},
    });
  }, [sessionId, processStep]);

  // 开始新的占卜
  const startNewDivination = useCallback((userId?: string) => {
    startDivination.mutate({ user_id: userId });
  }, [startDivination]);

  return {
    // 状态
    sessionId,
    currentStep,
    selectedTopic,
    selectedSpread,
    
    // 操作
    startNewDivination,
    selectTopic,
    selectSpread,
    drawCards,
    processStep, // 添加processStep以供直接调用
    
    // 加载状态
    isStarting: startDivination.isPending,
    isProcessing: processStep.isPending,
  };
};
