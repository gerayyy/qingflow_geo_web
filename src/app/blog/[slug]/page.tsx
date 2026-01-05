import React from 'react';
import { notFound } from 'next/navigation';
import { postService } from '@/services/postService';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { JsonLd } from '@/components/seo/JsonLd';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // 在 Next.js 13+ App Router 中，params 是一个 Promise，需要使用 await 获取
  const { slug } = await params;

  // 从数据库获取文章详情
  const post = await postService.getPublishedPostBySlug(slug);

  // 如果文章不存在或未发布，返回 404
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <a href="/" className="flex items-center space-x-2 group">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">轻流</h1>
            </a>
          </div>
          <nav>
            <a href="/blog" className="text-sm font-medium text-blue-600">
              文章
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-grow pt-32 pb-20 px-4">
        <article className="container mx-auto max-w-3xl">
          {/* 结构化数据注入 - JSON-LD */}
          <JsonLd
            type="article"
            data={{
              title: post.title,
              description: post.summary,
              publishedAt: post.publishedAt,
              updatedAt: post.updatedAt,
              slug: post.slug
            }}
          />

          {post.geoData?.faqs && post.geoData.faqs.length > 0 && (
            <JsonLd
              type="faq"
              data={{ faqs: post.geoData.faqs }}
            />
          )}

          {/* 文章头部 */}
          <header className="mb-12 text-center">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-blue-600 text-sm mb-6">
              <span>文章</span>
              <span className="w-1 h-1 rounded-full bg-gray-400"></span>
              <time dateTime={post.publishedAt.toString()}>
                {new Date(post.publishedAt).toISOString().split('T')[0]}
              </time>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight leading-tight">
              {post.title}
            </h1>

            <div className="glass-card p-6 rounded-2xl text-left">
              <p className="text-lg text-gray-700 leading-relaxed">
                {post.summary}
              </p>
            </div>
          </header>

          {/* GEO 数据 - Key Takeaways */}
          {post.geoData?.key_takeaways && (
            <div className="mb-12 p-1 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
              <div className="bg-white/90 rounded-xl p-6 md:p-8 backdrop-blur-sm border border-gray-200">
                <h3 className="text-xl font-bold mb-4 flex items-center text-blue-600">
                  <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  核心要点
                </h3>
                <ul className="space-y-3">
                  {post.geoData.key_takeaways.map((takeaway: string, index: number) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <span className="mr-3 mt-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0"></span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 文章内容 */}
          <div className="mb-16">
            <BlockRenderer blocks={post.content} />
          </div>

          {/* GEO 数据 - FAQs */}
          {post.geoData?.faqs && (
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-gray-900 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center mr-3 text-indigo-600">?</span>
                常见问题
              </h3>
              <div className="space-y-4">
                {post.geoData.faqs.map((faq: { question: string; answer: string }, index: number) => (
                  <div key={index} className="glass-card p-6 rounded-xl">
                    <h4 className="font-semibold mb-3 text-gray-800">{faq.question}</h4>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 返回列表按钮 */}
          <div className="border-t border-gray-200 pt-12 text-center">
            <a
              href="/blog"
              className="inline-flex items-center px-6 py-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-all duration-300 group"
            >
              <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回文章列表
            </a>
          </div>
        </article>
      </main>

      <footer className="border-t border-gray-200 bg-gray-50 py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">立即体验轻流</h2>
            <p className="text-gray-600 mb-8">拖拽式搭建，AI赋能，让数字化更简单</p>
            <a
              href="https://qingflow.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1"
            >
              免费试用轻流
            </a>
          </div>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <a href="https://qingflow.com/login" className="hover:text-blue-600 transition-colors">登录后台</a>
            <a href="https://qingflow.com/about" className="hover:text-blue-600 transition-colors">了解轻流</a>
          </div>
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p>&copy; 2025 轻流 - AI无代码搭建平台. 版权所有.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}