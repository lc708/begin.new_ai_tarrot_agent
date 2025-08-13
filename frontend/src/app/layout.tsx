import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "✨ 智能塔罗占卜师 | AI Tarot Reading",
  description: "体验智能塔罗占卜，获得人生指引和心灵启发。友好的AI占卜师星月为您解读命运奥秘。",
  keywords: ["塔罗占卜", "AI占卜", "塔罗牌", "命运解读", "心灵指导"],
  authors: [{ name: "智能塔罗占卜师" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "✨ 智能塔罗占卜师",
    description: "体验智能塔罗占卜，获得人生指引和心灵启发",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
