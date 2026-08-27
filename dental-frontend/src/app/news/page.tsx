import { NewsPageClient } from "./NewsPageClient";
import { apiClient } from "@/src/lib/api/client";
import { NEXT_PUBLIC_STRAPI_URL } from "@/src/lib/env";

interface BlogPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  coverImage?: {
    url: string;
    alternativeText?: string;
  } | null;
  publishedAt: string;
}

interface StrapiBlogsResponse {
  data: BlogPost[];
  meta?: any;
}

async function fetchBlogs(): Promise<BlogPost[]> {
  try {
    const response = await apiClient<StrapiBlogsResponse>("/api/blogs", {
      params: {
        populate: "*",
        sort: "publishedAt:desc",
        "pagination[limit]": 50,
      },
      isDraftMode: false,
      tags: ["blogs"], // Cache tags for webhook revalidation
    });

    // Handle Strapi v5 flattening and pre-calculate imageUrl
    return (response.data || []).map((blog: any) => {
      const data = blog.attributes || blog;
      const rawMedia = data.coverImage || data.imageCover;
      const mediaData = rawMedia?.data?.attributes || rawMedia;

      return {
        id: blog.id,
        documentId: blog.documentId,
        ...data,
        // Keep uploads on the frontend origin so Next Image can fetch them
        // through the internal Strapi media proxy in Docker.
        imageUrl: mediaData?.url?.startsWith('/uploads/') ? `/api/strapi-media${mediaData.url}` : mediaData?.url || null,
        imageAlt: mediaData?.alternativeText || data.title,
      };
    }) as BlogPost[];
  } catch (error) {
    return [];
  }
}

export default async function NewsPage() {
  const blogs = await fetchBlogs();

  const featuredBlog = blogs[0];
  const popularBlogs = blogs.slice(0, 3);

  return (
    <NewsPageClient
      initialBlogs={blogs}
      featuredBlog={featuredBlog}
      popularBlogs={popularBlogs}
      strapiUrl={NEXT_PUBLIC_STRAPI_URL}
    />
  );
}

// Static until Strapi webhook triggers revalidateTag('blogs')
// force-dynamic: prevents stale SSG content baked when Strapi was unreachable at build time.
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const dynamicParams = true;
