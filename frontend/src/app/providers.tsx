"use client";

/**
 * Providers组件 - 提供全局的Context和状态管理
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // 创建QueryClient实例
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 默认查询配置
            staleTime: 60 * 1000, // 1分钟内数据保持新鲜
            gcTime: 5 * 60 * 1000, // 5分钟后垃圾回收
            retry: (failureCount, error) => {
              // 根据错误类型决定是否重试
              if (error instanceof Error && error.message.includes('网络')) {
                return failureCount < 3;
              }
              return failureCount < 1;
            },
            refetchOnWindowFocus: false, // 窗口聚焦时不自动重新获取
          },
          mutations: {
            // 默认变更配置
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 开发环境下显示React Query开发工具 */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
        />
      )}
    </QueryClientProvider>
  );
}
