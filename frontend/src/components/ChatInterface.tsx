/**
 * ChatInterface组件 - 对话界面，显示占卜师的消息和用户交互
 */

"use client";

import { useEffect, useRef } from 'react';
import { MessageCircle, Sparkles, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'ai' | 'user' | 'system';
  content: string;
  timestamp: string;
  step?: string;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  loading?: boolean;
  className?: string;
  disableSmoothScroll?: boolean;
}

export function ChatInterface({ 
  messages, 
  loading = false,
  className = "",
  disableSmoothScroll = false
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: disableSmoothScroll ? 'auto' : 'smooth' 
    });
  }, [messages, disableSmoothScroll]);

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return '';
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'ai':
        return <Sparkles size={16} className="text-purple-400" />;
      case 'user':
        return <User size={16} className="text-amber-400" />;
      default:
        return <MessageCircle size={16} className="text-gray-400" />;
    }
  };

  const getMessageStyle = (type: string) => {
    switch (type) {
      case 'ai':
        return 'bg-gradient-to-br from-purple-900/40 to-purple-800/40 border-purple-500/30';
      case 'user':
        return 'bg-gradient-to-br from-amber-900/40 to-amber-800/40 border-amber-500/30 ml-auto';
      case 'system':
        return 'bg-gradient-to-br from-gray-800/40 to-gray-700/40 border-gray-500/30 mx-auto text-center';
      default:
        return 'bg-gray-800/40 border-gray-600/30';
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* 聊天标题 */}
      <div className="flex items-center space-x-2 p-4 border-b border-gray-700/50">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center">
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white">占卜师星月</h3>
          <p className="text-xs text-gray-400">在线为您服务</p>
        </div>
        <div className="ml-auto w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Sparkles size={48} className="mx-auto mb-4 text-purple-400/50" />
            <p>准备开始神奇的塔罗占卜之旅...</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-xs md:max-w-md lg:max-w-lg ${
                  message.type === 'user' ? 'ml-auto' : 
                  message.type === 'system' ? 'mx-auto' : ''
                }`}
              >
                <div
                  className={`
                    rounded-2xl p-4 border backdrop-blur-sm
                    transform transition-all duration-300 hover:scale-[1.02]
                    ${getMessageStyle(message.type)}
                  `}
                >
                  {/* 消息头部 */}
                  <div className="flex items-center space-x-2 mb-2">
                    {getMessageIcon(message.type)}
                    <span className="text-xs text-gray-400">
                      {message.type === 'ai' ? '星月' : 
                       message.type === 'user' ? '你' : '系统'}
                    </span>
                    {message.timestamp && (
                      <span className="text-xs text-gray-500 ml-auto">
                        {formatTimestamp(message.timestamp)}
                      </span>
                    )}
                  </div>

                  {/* 消息内容 */}
                  <div className="text-gray-100 leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>

                  {/* 步骤标识 */}
                  {message.step && (
                    <div className="mt-2 text-xs text-gray-500 opacity-75">
                      #{message.step}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* 加载指示器 */}
            {loading && (
              <div className="max-w-xs">
                <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 border border-purple-500/30 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles size={16} className="text-purple-400" />
                    <span className="text-xs text-gray-400">星月</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-300">正在思考中...</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* 滚动锚点 */}
        <div ref={messagesEndRef} />
      </div>

      {/* 底部状态栏 */}
      <div className="p-3 border-t border-gray-700/50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>💫 塔罗占卜中</span>
          {loading && <span>AI正在解读...</span>}
        </div>
      </div>
    </div>
  );
}
