import { prisma } from '../lib/prisma';

export type Post = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt: Date;
  content: any;
  geoData?: any;
  seoMeta?: any;
  createdAt: Date;
  updatedAt: Date;
};

export type PostListItem = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type PaginatedPosts = {
  posts: PostListItem[];
  total: number;
  totalPages: number;
};

export const postService = {
  /**
   * 获取已发布的文章列表（无分页）
   */
  async getPublishedPosts(): Promise<PostListItem[]> {
    return prisma.post.findMany({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  /**
   * 获取已发布的文章列表（带分页）
   */
  async getPublishedPostsPaginated(page: number, limit: number): Promise<PaginatedPosts> {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { status: 'published' },
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          status: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.post.count({
        where: { status: 'published' },
      }),
    ]);

    return {
      posts,
      total,
      totalPages: Math.ceil(total / limit),
    };
  },

  /**
   * 根据 slug 获取已发布的文章详情
   */
  async getPublishedPostBySlug(slug: string): Promise<Post | null> {
    return prisma.post.findFirst({
      where: {
        slug,
        status: 'published',
      },
    });
  },

  /**
   * 创建或更新文章
   */
  async createOrUpdatePost(data: {
    slug: string;
    title: string;
    summary: string;
    status: 'draft' | 'published' | 'archived';
    publishedAt: Date;
    content: any;
    geoData?: any;
    seoMeta?: any;
  }): Promise<Post> {
    return prisma.post.upsert({
      where: { slug: data.slug },
      update: {
        title: data.title,
        summary: data.summary,
        status: data.status,
        publishedAt: data.publishedAt,
        content: data.content,
        geoData: data.geoData,
        seoMeta: data.seoMeta,
      },
      create: data,
    });
  },
};