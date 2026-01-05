import React from 'react';
import { JsonLd } from '@/components/seo/JsonLd';

export const dynamic = 'force-static';

// 页面元数据设置
export const metadata = {
  title: '轻流 - AI无代码搭建平台 | 拖拽式应用构建，成本降低30%，效率提升90%',
  description: '轻流是受IDC、Forrester认可的AI无代码搭建平台，本地部署市占率第一。通过6大自主知识产权无代码开发引擎，为企业提供全场景数字化解决方案。拖拽式操作，业务人员快速上手，支持OA、CRM、进销存等200+行业模板。',
  keywords: '轻流, 无代码平台, AI搭建平台, 拖拽式开发, 低代码, 数字化转型, 企业管理, OA系统, CRM系统, 无代码开发',
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 结构化数据 - SoftwareApplication 和 Organization Schema */}
      <JsonLd
        type="softwareApplication"
        data={{
          name: '轻流 - AI无代码搭建平台',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'CNY',
            name: '免费试用'
          },
          description: '受IDC、Forrester认可的AI无代码搭建平台，通过6大自主知识产权无代码开发引擎，为企业提供全场景数字化解决方案。',
          provider: {
            '@type': 'Organization',
            name: '上海易校信息科技有限公司',
            url: 'https://qingflow.com'
          }
        }}
      />
      
      <JsonLd
        type="organization"
        data={{
          name: '上海易校信息科技有限公司',
          description: '轻流是受IDC、Forrester认可的AI无代码搭建平台，本地部署市占率第一，为企业提供全场景数字化解决方案。',
          url: 'https://qingflow.com',
          logo: 'https://qingflow.com/logo.png',
        }}
      />

      <header className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">轻流</h1>
          </div>
          <nav className="flex space-x-8">
            
            <a href="/blog" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                文章
              </a>
            
          </nav>
        </div>
      </header>

      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Section - 第一屏：视觉冲击与核心定位 */}
          <section className="text-center mb-32 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-10"></div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-float">
              <span className="text-gradient">AI无代码搭建平台</span>
              <br />
              <span className="text-gray-900">轻流 - 让企业数字化更简单</span>
            </h1>
            <h2 className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              拖拽式操作，业务人员快速上手，支持OA、CRM、进销存等200+行业模板
            </h2>
            <div className="flex justify-center gap-4 flex-wrap">
              <a
                href="https://qingflow.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1"
              >
                免费试用轻流
              </a>
              
            </div>
          </section>

          {/* The Hook - 第二屏：应用场景展示 */}
          <section className="mb-32 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                全场景覆盖，满足多样化业务需求
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600 mx-auto">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">企业管理</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    OA、进销存、CRM、售后管理
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 text-indigo-600 mx-auto">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">生产运营</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    设备巡检、安全隐患管控、生产报工
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 text-purple-600 mx-auto">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">办公协同</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    流程审批、项目管理、知识沉淀
                  </p>
                </div>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                200+行业模板，开箱即用。从企业管理到生产运营，全面覆盖您的业务场景。
              </p>
            </div>
          </section>

          {/* Value Proposition - 第三屏：三大核心价值 */}
          <section id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            <div className="glass-card glass-card-hover p-8 rounded-2xl">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">低门槛搭建</h3>
              <p className="text-gray-600 leading-relaxed">
                拖拽式操作，业务人员快速上手。无需编程基础，通过可视化界面轻松构建业务应用。
              </p>
            </div>

            <div className="glass-card glass-card-hover p-8 rounded-2xl">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">AI深度赋能</h3>
              <p className="text-gray-600 leading-relaxed">
                AI Agent一键生成表单/公式/代码，深度融合业务流程，实现智能化协作，减少80%重复操作。
              </p>
            </div>

            <div className="glass-card glass-card-hover p-8 rounded-2xl">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-purple-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">强大集成能力</h3>
              <p className="text-gray-600 leading-relaxed">
                60+无代码连接器，支持金蝶、钉钉等上百个系统。打破数据孤岛，实现跨系统统一管理。
              </p>
            </div>
          </section>

          
        </div>
      </main>

      {/* Footer CTA - 第六屏：底部转化 */}
      <footer id="contact" className="border-t border-gray-200 bg-white py-12">
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
          <div className="text-center mt-8 text-gray-600 text-sm">
            <p>&copy; 2025 轻流 - AI无代码搭建平台. 版权所有.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}