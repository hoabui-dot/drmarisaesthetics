'use client'

import Image from 'next/image';
import { NavigationLink } from '@/src/components/ui/NavigationLink';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import { useMobileAnimation } from '@/src/hooks/useMobileAnimation';
import { PerformanceAnimation } from '@/src/components/ui/PerformanceAnimation';

interface BlogPost {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  excerpt?: string;
  imageCover?: {
    data?: {
      attributes: {
        url: string;
        alternativeText?: string;
      };
    };
    url?: string;
    alternativeText?: string;
  } | null;
  coverImage?: any;
  publishedAt: string;
}

interface BlogCollectionSectionProps {
  title: string;
  subtitle?: string;
  posts: BlogPost[];
  showFeatured?: boolean;
  isActive?: boolean;
}

export default function BlogCollectionSection({
  title,
  subtitle,
  posts,
  isActive = true,
}: BlogCollectionSectionProps) {
  // Use the NEXT_PUBLIC_STRAPI_URL baked at build time — always available,
  // no async fetch needed unlike the old useEnv() pattern.
  const strapiUrl = (process.env.NEXT_PUBLIC_STRAPI_URL ?? '').replace(/\/$/, '');
  const { shouldSimplify } = useMobileAnimation();

  if (!isActive || !posts || posts.length === 0) {
    return null;
  }


  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-white">
      {/* ── BACKGROUND LAYER ── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#F8FBFF]" />
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-primary-100/30 blur-[130px] rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <PerformanceAnimation
          preset="slide-up-subtle"
          whileInView={true}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base sm:text-lg md:text-xl text-foreground-secondary mx-auto">
              {subtitle}
            </p>
          )}
        </PerformanceAnimation>

        {/* Blog Carousel */}
        <div className="relative px-4 sm:px-0">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 sm:-ml-6">
              {posts.map((post: any, index: number) => {
                const imageUrl = post.imageUrl;
                const imageAlt = post.imageAlt;

                return (
                  <CarouselItem key={post.id || index} className="pl-4 sm:pl-6 basis-[92%] sm:basis-[55%] lg:basis-1/3">
                    <PerformanceAnimation
                      preset="slide-up-subtle"
                      whileInView={true}
                      delay={(index % 3) * 0.08}
                      className="h-full"
                    >
                      <NavigationLink
                        href={`/news/${post.slug}`}
                        className="block group bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(30,58,95,0.08)] hover:shadow-[0_20px_60px_rgba(30,58,95,0.15)] transition-all duration-500 border border-primary-50 hover:border-primary-200 h-full hover:-translate-y-2"
                      >
                        {/* Image Container */}
                        <div className="relative h-56 bg-gradient-to-br from-primary-50 to-blue-50 overflow-hidden">
                          {(() => {
                            const resolvedSrc = typeof imageUrl === 'string' && imageUrl
                              ? imageUrl.startsWith('http')
                                ? imageUrl
                                : strapiUrl
                                  ? `${strapiUrl}${imageUrl}`
                                  : null
                              : null;

                            if (resolvedSrc) {
                              return (
                                <Image
                                  src={resolvedSrc}
                                  alt={imageAlt || post.title || 'Blog post'}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              );
                            }

                            return (
                              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                <svg className="w-14 h-14 text-primary-200" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-2 0-4.5 1-4.5 4 0 1.5.5 3 .5 5s-1 5-1 6.5a1.5 1.5 0 003 0c0-1 .5-3 1.5-3s1.5 2 1.5 3a1.5 1.5 0 003 0c0-1.5-1-5-1-6.5s.5-3.5.5-5C16.5 4 14 3 12 3z" />
                                </svg>
                                <span className="text-xs font-medium text-primary-300 uppercase tracking-widest">Dental News</span>
                              </div>
                            );
                          })()}
                          {/* Overlay gradient on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-foreground-secondary line-clamp-3 mb-4 leading-relaxed">
                              {post.excerpt}
                            </p>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-4 border-t border-border">
                            <time
                              dateTime={post.publishedAt}
                              className="text-xs sm:text-sm md:text-base text-foreground-muted"
                            >
                              {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </time>
                            <span className="text-xs sm:text-sm md:text-base text-primary-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                              Read More
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </NavigationLink>
                    </PerformanceAnimation>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <div className="hidden sm:block">
              <CarouselPrevious className="-left-12 border-primary-200 text-primary-600 hover:bg-primary-50" />
              <CarouselNext className="-right-12 border-primary-200 text-primary-600 hover:bg-primary-50" />
            </div>

            {/* Mobile Controls */}
            <div className="flex justify-center gap-4 mt-8 sm:hidden">
              <CarouselPrevious className="static translate-y-0 w-10 h-10 border-primary-200 text-primary-600 hover:bg-primary-50 shadow-sm" />
              <CarouselNext className="static translate-y-0 w-10 h-10 border-primary-200 text-primary-600 hover:bg-primary-50 shadow-sm" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}

