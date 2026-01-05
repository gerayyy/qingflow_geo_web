import React from 'react';
import { postService } from '@/services/postService';
import { Pagination } from '@/components/Pagination';

export const dynamic = 'force-dynamic';

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const ITEMS_PER_PAGE = 20;
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  
  // 从数据库获取已发布的文章列表（分页）
  const result = await postService.getPublishedPostsPaginated(currentPage, ITEMS_PER_PAGE);
  const { posts, total, totalPages } = result;

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
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              <span className="text-gradient">轻流技术洞察</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              探索AI无代码搭建平台的最新技术趋势、应用场景和行业解决方案
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-20 glass-card rounded-2xl">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">暂无文章</h3>
                <p className="text-gray-500">敬请期待更多精彩内容</p>
              </div>
            ) : (
              <div className="grid gap-8">
                {posts.map((post) => (
                  <article key={post.id} className="glass-card glass-card-hover p-8 rounded-2xl group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/20"></div>

                    <div className="relative z-10">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-blue-600">
                          文章
                        </span>
                        <time dateTime={post.publishedAt.toString()}>
                          {new Date(post.publishedAt).toISOString().split('T')[0]}
                        </time>
                      </div>

                      <h2 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                        <a href={`/blog/${post.slug}`} className="focus:outline-none">
                          <span className="absolute inset-0" aria-hidden="true" />
                          {post.title}
                        </a>
                      </h2>

                      <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                        {post.summary}
                      </p>

                      <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform">
                        阅读文章
                        <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
            
            {/* 分页导航 */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={total}
                itemsPerPage={ITEMS_PER_PAGE}
                baseUrl="/blog"
              />
            )}
          </div>
        </div>
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
