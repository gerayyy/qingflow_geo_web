import { NextResponse } from 'next/server';
import { z } from 'zod';
import { postService } from '@/services/postService';

// 定义请求数据的 Zod schema
const publishPostSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  status: z.enum(['draft', 'published', 'archived']),
  seo: z.object({
    title: z.string(),
    description: z.string(),
  }),
  geo_enhancement: z.object({
    key_takeaways: z.array(z.string()),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })),
  }),
  content_blocks: z.array(z.union([
    z.object({
      type: z.literal('h2'),
      text: z.string(),
    }),
    z.object({
      type: z.literal('paragraph'),
      text: z.string(),
    }),
    z.object({
      type: z.literal('image'),
      url: z.string().url(),
    }),
    z.object({
      type: z.literal('list'),
      items: z.array(z.string()),
    }),
    z.object({
      type: z.literal('table'),
      headers: z.array(z.string()),
      rows: z.array(z.array(z.string())),
    }),
  ])),
});

export async function POST(request: Request) {
  try {
    // 1. 验证 API Key
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.API_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. 解析请求体
    const body = await request.json();

    // 3. 验证请求数据
    const validatedData = publishPostSchema.parse(body);

    // 4. 转换数据格式并写入数据库
    const post = await postService.createOrUpdatePost({
      slug: validatedData.slug,
      title: validatedData.title,
      summary: validatedData.summary,
      status: validatedData.status,
      publishedAt: new Date(),
      content: validatedData.content_blocks,
      geoData: validatedData.geo_enhancement,
      seoMeta: validatedData.seo,
    });

    // 5. 触发缓存更新
    // 这里使用 Next.js 的 revalidateTag 功能，需要在 app router 中配置
    // 由于我们使用的是 ISR，会自动处理缓存

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        slug: post.slug,
        title: post.title,
        status: post.status,
      },
      message: 'Post published successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // 验证错误
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    // 其他错误
    console.error('Error publishing post:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to publish post',
      },
      { status: 500 }
    );
  }
}