import React from 'react';
import './globals.css';

export const metadata = {
  title: '嘿狸引擎GEO版 | AI搜索引擎优化(GEO)解决方案_DeepSeek/豆包/Kimi推广神器 - HelyDrive',
  description: '嘿狸引擎(HelyDrive)为您提供专业的AI搜索营销(GEO)一体化解决方案。基于企业真实文档构建品牌画像，拒绝AI幻觉。帮助企业在DeepSeek、豆包、腾讯元宝、通义千问等AI平台实现意图截流与内容推荐，告别传统SEO，抢占AI时代的流量新入口。',
  keywords: '嘿狸引擎, HelyDrive, GEO, AI搜索引擎优化, DeepSeek推广, 豆包SEO, AI内容营销, 品牌意图截流, 企业品牌推广, 杭州嘿狸文化, 营销一体化',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
      </body>
    </html>
  );
}