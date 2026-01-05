# Helyweb - Next.js + MySQL 轻量化全栈博客系统

## 项目架构

### 总体设计
采用 **“轻量化全栈”** 架构，将 Next.js 作为全能型应用服务器，既处理 API 写入，也处理页面渲染。系统不再依赖第三方 CMS，实现了数据、服务、渲染的完全分离。

### 技术栈
- **前端框架**: Next.js 16.0.10
- **数据库**: MySQL 8.0
- **ORM**: Prisma 6.19.1
- **样式**: Tailwind CSS 4.1.18
- **语言**: TypeScript 5.9.3

### 系统数据流向
1. **数据写入层**: 脚本 → HTTPS POST (JSON) → Next.js API Route → MySQL (Prisma ORM)
2. **数据读取层**: 用户/爬虫 → CDN (Cloudflare) → Next.js (ISR/SSG) → MySQL

### 核心分层原则
- **数据层 (Data Layer)**: MySQL 数据库 + Prisma Client，负责“存”和“取”
- **服务层 (Service Layer)**: 定义在 `src/services`，负责数据验证、清洗、预处理
- **渲染层 (Presentation Layer)**: Next.js App Router，负责将数据转换为语义化 HTML
- **样式层 (Styling Layer)**: Tailwind CSS，负责视觉表现，与 HTML 结构解耦

## 数据库设计

采用 **混合模式 (Hybrid Schema)**：核心字段结构化，内容字段 JSON 化。

### 核心表结构
| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `id` | `INT` (PK) | 自增主键 |
| `slug` | `VARCHAR(191)` | 唯一索引，文章 URL 路径 |
| `title` | `VARCHAR(255)` | 文章标题 |
| `summary` | `TEXT` | 文章摘要 |
| `status` | `ENUM('draft', 'published', 'archived')` | 文章状态 |
| `publishedAt` | `DATETIME` | 发布时间 |
| `content` | `JSON` | 文章正文、段落结构、图片列表 |
| `geoData` | `JSON` | GEO 数据，包含 FAQ 数组、Key Takeaways |
| `seoMeta` | `JSON` | SEO 元数据 |
| `createdAt` | `DATETIME` | 创建时间 |
| `updatedAt` | `DATETIME` | 更新时间 |

## 快速开始

### 本地开发环境搭建

1. **克隆项目**
```bash
git clone <repository-url>
cd helyweb
```

2. **安装依赖**
```bash
npm install
```

3. **启动本地数据库**
```bash
cd local_test
docker-compose up -d
```

4. **配置环境变量**
```bash
cp .env.example .env.local
# 根据需要修改 .env.local 中的配置
```

5. **生成 Prisma 客户端**
```bash
npm run prisma:generate
```

6. **创建数据库表结构**
```bash
npx dotenv-cli -e .env.local -- prisma db push
```

7. **启动开发服务器**
```bash
npm run dev
```

8. **访问应用**
- 首页: http://localhost:3000
- 博客列表页: http://localhost:3000/blog
- API 健康检查: http://localhost:3000/api/health

### API 使用说明

#### 文章发布接口

- **Endpoint**: `POST /api/webhooks/publish`
- **鉴权**: Header 中必须携带 `x-api-key`，值为环境变量 `API_SECRET_KEY`
- **请求方法**: POST
- **Content-Type**: application/json

##### 请求数据格式
```json
{
  "slug": "article-slug",
  "title": "文章标题",
  "summary": "文章摘要",
  "status": "published",
  "seo": {
    "title": "SEO 标题",
    "description": "SEO 描述"
  },
  "geo_enhancement": {
    "key_takeaways": ["观点1", "观点2"],
    "faqs": [
      { "question": "问题1", "answer": "答案1" }
    ]
  },
  "content_blocks": [
    { "type": "h2", "text": "章节标题" },
    { "type": "paragraph", "text": "段落内容" },
    { "type": "image", "url": "https://example.com/image.jpg" },
    { "type": "list", "items": ["列表项1", "列表项2"] },
    {
      "type": "table",
      "headers": ["表头1", "表头2"],
      "rows": [["数据1", "数据2"]]
    }
  ]
}
```

##### 响应示例
```json
{
  "success": true,
  "post": {
    "id": 1,
    "slug": "article-slug",
    "title": "文章标题",
    "status": "published"
  },
  "message": "Post published successfully"
}
```

#### API 测试脚本
项目提供了 API 测试脚本，位于 `local_test/test_publish_api.js`，用于测试文章发布功能：

```bash
cd local_test
node test_publish_api.js
```

## 项目结构

```
src/
├── app/                  # Next.js App Router
│   ├── page.tsx          # 首页 (SSG)
│   ├── blog/             # 博客模块
│   │   ├── page.tsx      # 文章列表页 (ISR)
│   │   └── [slug]/       # 文章详情页 (ISR)
│   │       └── page.tsx
│   └── api/              # API 接口
│       ├── health/       # 健康检查接口
│       │   └── route.ts
│       └── webhooks/     # Webhook 接口
│           └── publish/
│               └── route.ts
├── components/           # UI 组件
│   ├── blocks/           # 内容块渲染组件
│   │   └── BlockRenderer.tsx
│   └── seo/              # SEO 组件
│       └── JsonLd.tsx
├── lib/                  # 工具库
│   └── prisma.ts         # Prisma Client 实例
└── services/             # 服务层
    └── postService.ts    # 文章服务
```

## 渲染策略

### 1. 首页 (Intro Page) - SSG
- **策略**: `export const dynamic = 'force-static'`
- **逻辑**: 在代码构建时生成 HTML
- **适用**: 公司介绍、服务展示等“万年不变”的内容

### 2. 文章内容页 (Content Page) - ISR
- **策略**: 使用 `unstable_cache` 或 `next: { tags: ['posts'] }`
- **逻辑**: 
  - 用户访问 → 数据库读取 → 生成 HTML → 缓存
  - API 推送新文章 → 触发 `revalidateTag` → 缓存失效 → 下次访问生成新 HTML
- **优势**: 无论文章数量多少，构建时间都是几秒钟，且发布即更新

## 部署说明

### 容器化部署
使用 Docker Compose 编排：
- **Service A (Next.js)**: 端口 3000，负责业务逻辑和页面渲染
- **Service B (MySQL)**: 端口 3306，负责数据存储

### CDN 配置 (Cloudflare)
1. 将域名解析到 Cloudflare
2. 配置缓存规则：
   - 对 `www.yoursite.com/_next/static/*` 设置"Cache Everything"
   - 对 `www.yoursite.com/blog/*` 设置"Standard Caching"

### 环境变量配置

#### 必需配置
| 配置项 | 说明 | 示例值 |
| :--- | :--- | :--- |
| `DATABASE_URL` | MySQL 数据库连接字符串 | `mysql://user:pass@host:3306/dbname` |
| `API_SECRET_KEY` | API 鉴权密钥 | `your-secret-key-min-32-chars` |
| `NODE_ENV` | 运行环境 | `production` / `development` |

#### 可选配置
| 配置项 | 说明 | 默认值 |
| :--- | :--- | :--- |
| `DATABASE_POOL_MIN` | 数据库连接池最小连接数 | `2` |
| `DATABASE_POOL_MAX` | 数据库连接池最大连接数 | `10` |
| `REVALIDATE_SECRET` | ISR 按需重新验证密钥 | 无 |

## 开发流程

### 1. 数据层开发
- 定义 Prisma Schema
- 执行 `prisma db push` 生成表结构
- 编写数据访问逻辑（位于 `src/services`）

### 2. API 开发
- 编写 API Route（位于 `src/app/api`）
- 实现数据验证、清洗和入库逻辑
- 添加错误处理和日志记录

### 3. 组件开发
- 开发 UI 组件（位于 `src/components`）
- 实现内容块渲染逻辑
- 添加 SEO 优化

### 4. 页面组装
- 完成页面开发（位于 `src/app`）
- 实现数据获取和渲染逻辑
- 配置缓存策略

### 5. 测试与部署
- 运行测试脚本验证 API 功能
- 部署到生产环境
- 配置 CDN 和监控

## 交互使用说明

### 文章发布流程
1. **准备文章数据**: 按照 API 请求格式准备文章数据
2. **发送 API 请求**: 使用 `curl`、`postman` 或自定义脚本发送 POST 请求到 `/api/webhooks/publish`
3. **验证发布结果**: 检查 API 响应，确认文章发布成功
4. **访问文章**: 通过 `http://localhost:3000/blog/{slug}` 访问发布的文章

### 本地测试
1. **启动开发服务器**: `npm run dev`
2. **运行 API 测试脚本**: `cd local_test && node test_publish_api.js`
3. **访问博客列表**: 查看新发布的文章是否显示在列表中
4. **访问文章详情**: 查看文章内容是否正确渲染

### 日志与监控
- **开发环境**: 日志输出到控制台
- **生产环境**: 建议配置云日志服务（如阿里云 SLS）
- **健康检查**: 访问 `/api/health` 检查系统状态

## GEO & SEO 营销适配方案

本项目专门为 **GEO（生成式引擎优化）** 营销场景设计，通过语义化和结构化数据提升网站在 AI 搜索引擎中的表现。

### 核心原则
**样式服务于视觉，标签服务于 AI。** 严禁为了样式便利而牺牲标签语义，确保 AI 能够准确理解页面结构和内容。

### 1. 结构化数据注入 (JSON-LD)

通过 `src/components/seo/JsonLd.tsx` 组件动态生成结构化数据，帮助 AI 更好地理解页面内容：

| 类型 | 位置 | 作用 |
| :--- | :--- | :--- |
| **Article Schema** | 文章详情页 | 告诉 AI 这是一篇专业文章，包含标题、描述、发布时间等信息 |
| **FAQPage Schema** | 文章详情页（当包含 FAQ 时） | 将 `geo_data.faqs` 转化为 Schema，AI 搜索会直接抓取作为答案 |
| **Organization Schema** | 首页 | 建立品牌权威实体，包含公司名称、描述、网址和 logo |

### 2. 语义化 HTML 输出

所有内容块使用语义化 HTML 标签，确保 AI 能够准确理解内容结构：

| 内容类型 | 语义化标签 | GEO 影响 |
| :--- | :--- | :--- |
| 章节标题 | `<h2>`, `<h3>` | AI 理解文章大纲的唯一依据 |
| 段落内容 | `<p>` | 确保文本内容被正确识别 |
| 列表项 | `<ul><li>` | AI 优先抓取列表内容作为答案 |
| 表格数据 | `<table>` | 被 Google 识别为“数据表格”并直接展示在搜索结果中 |
| 图片 | `<img>` 包裹在 `<figure>` 中 | `alt` 属性帮助 AI 理解图片内容 |

### 3. BlockRenderer 组件

位于 `src/components/blocks/BlockRenderer.tsx`，专门处理内容块的语义化渲染：

```tsx
// 正确的语义化写法
if (type === 'h2') return <h2 className="text-3xl font-bold my-4">{text}</h2>;
if (type === 'list') {
  return (
    <ul className="list-disc pl-5 my-4 space-y-2">
       {items.map(item => <li>{item}</li>)}
    </ul>
  );
}
```

### 4. 标题层级规范

标题是 AI 理解文章大纲的唯一依据，严格遵循层级规范：
- 每页只有一个 `<h1>`
- 层级必须连续：`h1` -> `h2` -> `h3`，不可跳级
- 样式调整完全依赖 Tailwind CSS，不改变标签语义

### 5. 链接与交互规范

确保 AI 能够正确爬取网站内容：
- 页面跳转使用 `<a>` 标签，爬虫无法识别 `onClick`
- 链接文字包含关键词，帮助 AI 理解链接内容
- 禁止 `<a>` 标签嵌套 `<button>`，避免解析错误

### 6. GEO 数据支持

专门设计了 `geoData` 字段存储 GEO 优化数据：

| 字段 | 类型 | 作用 |
| :--- | :--- | :--- |
| `key_takeaways` | 数组 | 文章核心观点，用于快速摘要 |
| `faqs` | 数组 | 常见问题与答案，用于 FAQPage Schema |

### 7. 与 GEO 营销场景的适配

- **AI 友好**: 所有内容结构和标签都针对 AI 优化
- **搜索抓取**: 结构化数据和语义化标签便于 AI 搜索引擎抓取
- **内容理解**: 清晰的标题层级和内容结构帮助 AI 理解文章逻辑
- **答案提取**: FAQ 结构化数据直接作为 AI 搜索答案
- **品牌权威**: Organization Schema 建立品牌在 AI 中的权威地位

## 项目特点

1. **结构极简**: 去除了 CMS，简化了技术栈
2. **职责分明**: 数据/样式/逻辑分离，易于维护
3. **性能强悍**: MySQL + ISR + CDN 架构，确保高并发下的性能
4. **运维友好**: 完善的日志、监控、备份机制
5. **灵活扩展**: 支持多种内容块类型，易于扩展新功能
6. **SEO 优化**: 内置结构化数据和语义化 HTML
7. **GEO 营销适配**: 专门为 GEO 营销场景设计，提升 AI 搜索表现
8. **语义化开发**: 严格遵循前端 GEO/SEO 语义化开发规范

## 硬件资源消耗评估与配置建议

### 资源消耗分析

本项目采用轻量化全栈架构，资源消耗相对较低，主要消耗来自以下组件：

| 组件 | CPU 消耗 | 内存消耗 | 磁盘消耗 | 网络消耗 |
| :--- | :--- | :--- | :--- | :--- |
| **Next.js 应用** | 低-中 | 低-中 | 低 | 低-中 |
| **MySQL 数据库** | 低 | 中 | 低-中 | 低 |

### 最低配置建议

#### 1. 开发环境

适用于本地开发、测试和小型团队协作：

| 资源类型 | 最低配置 | 推荐配置 |
| :--- | :--- | :--- |
| **CPU 核心数** | 2 核 | 4 核 |
| **内存大小** | 4 GB | 8 GB |
| **磁盘空间** | 20 GB | 40 GB |
| **网络带宽** | 1 Mbps | 10 Mbps |

**说明**：开发环境需要同时运行 Next.js 开发服务器、MySQL 数据库和代码编辑器等工具，因此需要更多资源支持热重载和编译。

#### 2. 生产环境（单机部署）

适用于中小型网站，月访问量 10 万以下：

| 资源类型 | 最低配置 | 推荐配置 |
| :--- | :--- | :--- |
| **CPU 核心数** | 1 核 | 2 核 |
| **内存大小** | 2 GB | 4 GB |
| **磁盘空间** | 10 GB | 20 GB |
| **网络带宽** | 1 Mbps | 5 Mbps |

**说明**：生产环境使用编译后的 Next.js 应用，资源消耗较低。磁盘空间主要用于存储 MySQL 数据库和静态资源。

#### 3. 生产环境（分离部署）

适用于较大规模网站，月访问量 10 万以上：

| 组件 | CPU 核心数 | 内存大小 | 磁盘空间 |
| :--- | :--- | :--- | :--- |
| **Next.js 应用服务器** | 1 核 | 1 GB | 5 GB |
| **MySQL 数据库服务器** | 1 核 | 1 GB | 10 GB |
| **CDN 服务** | - | - | - |

**说明**：分离部署可以更好地扩展和管理，CDN 服务可以进一步降低服务器资源消耗。

### 资源优化建议

1. **启用 CDN**：接入 Cloudflare 或其他 CDN 服务，加速静态资源访问，降低服务器带宽消耗
2. **配置缓存**：合理配置 Next.js ISR 缓存和 MySQL 查询缓存，减少数据库压力
3. **优化图片**：使用图片压缩工具优化静态资源，减少磁盘空间和带宽消耗
4. **定期清理**：定期清理日志文件和临时文件，释放磁盘空间
5. **监控资源使用**：配置资源监控，及时发现和解决资源瓶颈

## 样式定制

本项目使用 Tailwind CSS 作为样式框架，以下是允许修改的样式相关文件及其作用：

| 文件路径 | 作用 | 建议修改内容 |
| :--- | :--- | :--- |
| `src/app/globals.css` | 全局样式配置文件，通过 Tailwind 指令引入所有样式 | 可以添加自定义的全局 CSS 类、字体引入或 CSS 变量 |
| `tailwind.config.js` (项目根目录) | Tailwind CSS 配置文件 | 可以自定义主题颜色、字体、间距、断点等 Tailwind 配置 |

### 主要页面文件

以下是项目中主要的页面文件，这些文件使用 Tailwind CSS 类来实现样式：

| 文件路径 | 作用 | 与样式文件的关系 |
| :--- | :--- | :--- |
| `src/app/page.tsx` | 网站主页 | 直接使用 Tailwind 工具类进行样式设计，继承 `src/app/globals.css` 中的全局样式 |
| `src/app/blog/page.tsx` | 文章列表页 | 直接使用 Tailwind 工具类进行样式设计，继承 `src/app/globals.css` 中的全局样式 |
| `src/app/blog/[slug]/page.tsx` | 文章详情页 | 直接使用 Tailwind 工具类进行样式设计，继承 `src/app/globals.css` 中的全局样式，使用 `BlockRenderer` 组件渲染内容 |

### 样式修改说明

1. **全局样式文件说明**：`src/app/globals.css` 只有三行是因为项目采用了 Tailwind CSS 的指令式引入方式：
   - `@tailwind base;`：引入基础样式（包括重置样式和浏览器默认样式调整）
   - `@tailwind components;`：引入组件样式（如按钮、卡片等预定义组件）
   - `@tailwind utilities;`：引入工具类样式（所有 Tailwind 工具类）
   - 在项目构建时，Tailwind 会将这些指令替换为实际的 CSS 代码

2. **主题定制**：在 `tailwind.config.js`（位于项目根目录）中扩展或修改 Tailwind 主题，例如添加品牌颜色、自定义字体等

3. **组件样式**：在组件文件中直接使用 Tailwind 工具类进行样式调整，这是推荐的样式修改方式

4. **页面样式关系**：
   - 所有页面文件都继承自 `src/app/globals.css` 中定义的全局样式
   - 页面文件中的 Tailwind 工具类会受到 `tailwind.config.js` 配置的影响
   - 可以在页面文件中直接覆盖或扩展全局样式

### 注意事项

- 不建议修改 `node_modules` 目录下的任何样式文件
- 不建议修改 `.next` 构建目录下的样式文件，这些是构建生成的临时文件
- 所有样式修改应遵循 Tailwind CSS 的最佳实践，保持样式与 HTML 结构的分离

