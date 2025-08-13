/**
 * API客户端 - 与后端塔罗占卜API通信
 */

import axios from 'axios';

// API基础配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求和响应类型定义
export interface StartDivinationRequest {
  user_id?: string;
}

export interface DivinationStepRequest {
  session_id: string;
  step: string;
  data: Record<string, unknown>;
}

export interface DivinationResponse {
  session_id: string;
  status: string;
  message: string;
  next_step?: string;
  data: Record<string, unknown>;
}

export interface CardInfo {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  image_url: string;
}

export interface DivinationStatus {
  session_id: string;
  current_step: string;
  progress: number;
  completed: boolean;
  history: Array<Record<string, unknown>>;
}

export interface TarotCard {
  id: string;
  name: string;
  number: number;
  keywords: string[];
  upright_meaning: string;
  reversed_meaning: string;
  emoji: string;
  position?: string;
  position_index?: number;
  is_reversed?: boolean;
  orientation?: string;
  current_meaning?: string;
}

export interface Topic {
  name: string;
  description: string;
  emoji: string;
}

export interface Spread {
  name: string;
  description: string;
  card_count: number;
  positions: string[];
}

// API方法
export const apiMethods = {
  // 开始占卜
  startDivination: async (request: StartDivinationRequest): Promise<DivinationResponse> => {
    const response = await apiClient.post('/api/v1/divination/start', request);
    return response.data;
  },

  // 处理占卜步骤
  processDivinationStep: async (request: DivinationStepRequest): Promise<DivinationResponse> => {
    const response = await apiClient.post('/api/v1/divination/step', request);
    return response.data;
  },

  // 获取塔罗牌信息
  getCardInfo: async (cardId: string): Promise<CardInfo> => {
    const response = await apiClient.get(`/api/v1/cards/${cardId}`);
    return response.data;
  },

  // 获取占卜状态
  getDivinationStatus: async (sessionId: string): Promise<DivinationStatus> => {
    const response = await apiClient.get(`/api/v1/divination/${sessionId}/status`);
    return response.data;
  },

  // 获取可用主题
  getTopics: async (): Promise<{ topics: Record<string, Topic> }> => {
    const response = await apiClient.get('/api/v1/topics');
    return response.data;
  },

  // 获取可用牌阵
  getSpreads: async (): Promise<{ spreads: Record<string, Spread> }> => {
    const response = await apiClient.get('/api/v1/spreads');
    return response.data;
  },

  // 快速占卜（测试用）
  quickDivination: async (): Promise<{
    status: string;
    drawn_cards: TarotCard[];
    interpretation: string;
    advice: string;
  }> => {
    const response = await apiClient.post('/api/v1/divination/quick');
    return response.data;
  },
};

// 错误处理
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    // 处理网络错误
    if (error.code === 'ECONNABORTED') {
      throw new Error('请求超时，请稍后重试');
    }
    
    // 处理HTTP错误
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 404:
          throw new Error(data?.detail || '资源不存在');
        case 400:
          throw new Error(data?.detail || '请求参数错误');
        case 500:
          throw new Error(data?.detail || '服务器内部错误');
        default:
          throw new Error(data?.detail || `请求失败 (${status})`);
      }
    }
    
    // 处理其他错误
    throw new Error('网络连接失败，请检查网络设置');
  }
);

export default apiMethods;
