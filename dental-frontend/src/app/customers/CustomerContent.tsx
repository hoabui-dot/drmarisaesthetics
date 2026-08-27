'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { MotionDiv } from '@/src/components/ui/MotionDiv'
import { PerformanceAnimation } from '@/src/components/ui/PerformanceAnimation'
import { DecorativeBadge } from '@/src/components/ui/DecorativeBadge'
import {
    Globe, Star, CheckCircle, ArrowRight, Quote
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { NavigationLink } from '../../components/ui/NavigationLink'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '../../components/ui/carousel'
import { CombinedTestimonialResult } from '../../components/blocks/CombinedTestimonialResult'
import { AnimatedSectionHeader } from '../../components/ui/AnimatedSectionHeader'
import { PageSkeleton } from '@/src/components/LoadingSkeleton'

import { useEnv } from '@/src/hooks/useEnv';
import { useMobileAnimation } from '@/src/hooks/useMobileAnimation';

interface CustomerContentProps {
    content: any
}

export function CustomerContent({ content }: CustomerContentProps) {
    const { env } = useEnv();
    const { shouldSimplify } = useMobileAnimation();
    const baseUrl = env?.NEXT_PUBLIC_STRAPI_URL || env?.STRAPI_URL || '';

    // Early return after all hooks
    const { hero, beforeAfterGallery } = content || {}

    // Early return: if content is missing, show skeleton
    if (!content || typeof content === 'string' || (!hero && !beforeAfterGallery)) {
        return <PageSkeleton />;
    }

    const { successStories, whyChooseUs, reviews } = content

    // Helper function to get image URL
    const getImageUrl = (image: any) => {
        if (!image) return null

        // If image is already a string (absolute URL from API), return it
        if (typeof image === 'string') {
            if (image.startsWith('http')) return image
            return baseUrl ? `${baseUrl}${image}` : null
        }

        if (image.type === 'strapi' && image.path) {
            // If path is already an absolute URL, return it directly
            if (image.path.startsWith('http')) return image.path
            return baseUrl ? `${baseUrl}${image.path}` : null
        }

        // Handle case where image has a direct url property (Strapi v5)
        if (image.url) {
            if (image.url.startsWith('http')) return image.url
            return baseUrl ? `${baseUrl}${image.url}` : null
        }

        return image.url || null
    }

    return (
        <div className="w-full bg-white overflow-hidden">
            {/* 1. HERO SECTION - Static for LCP */}
            {hero && (
                <section className="relative pt-24 pb-20 sm:pt-28 md:pb-32 lg:pt-32 overflow-hidden">
                    {/* Static background blobs — CSS-only, no JS */}
                    <div className="absolute top-20 right-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="max-w-screen-2xl mx-auto px-6 relative z-10">
                        <div className="relative z-10 grid md:grid-cols-2 gap-12 lg:gap-6 items-center">
                            <div className="flex flex-col gap-6 lg:pr-4 text-center md:text-left items-center md:items-start">
                                <DecorativeBadge text="Patient Stories" variant="primary" className="mb-0" />
                                <AnimatedSectionHeader
                                    title={hero.title}
                                    subtitle={hero.description}
                                    titleAs="h1"
                                    titleSize="large"
                                    align="left"
                                    titleClassName="text-[#165197] tracking-tight"
                                    subtitleClassName="text-[#165197]/80 font-normal w-full max-w-[none]"
                                    className="!mb-0 items-center md:items-start text-center md:text-left"
                                />
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                    <Button
                                        asChild
                                        className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-6 rounded-xl text-sm sm:text-base md:text-xl font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 whitespace-nowrap"
                                    >
                                        <NavigationLink href="/services">
                                            Explore Our Services
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </NavigationLink>
                                    </Button>
                                </div>
                            </div>

                            {/* Hero Images Grid — floating animation (same as news page) */}
                            <div className="grid grid-cols-2 gap-4 lg:pl-8">
                                <div className="space-y-4">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: [0, -10, 0] }}
                                        transition={{
                                            opacity: { delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                                            y: shouldSimplify ? { duration: 0 } : { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0 },
                                        }}
                                        className="rounded-3xl overflow-hidden shadow-xl relative h-64 border-4 border-white"
                                    >
                                        <Image
                                            src={getImageUrl(hero.images?.[0]) || (baseUrl ? `${baseUrl}/uploads/happy_patient_3d6d7753d6.jpg` : 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800')}
                                            alt={hero.images?.[0]?.alt || "Happy dental patients"}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: [0, -10, 0] }}
                                        transition={{
                                            opacity: { delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                                            y: shouldSimplify ? { duration: 0 } : { duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
                                        }}
                                        className="rounded-3xl overflow-hidden shadow-xl relative h-48 border-4 border-white"
                                    >
                                        <Image
                                            src={getImageUrl(hero.images?.[1]) || (baseUrl ? `${baseUrl}/uploads/patient_consultation_dcf1a32d50.jpg` : 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800')}
                                            alt={hero.images?.[1]?.alt || "Patient consultation"}
                                            fill
                                            className="object-cover"
                                        />
                                    </motion.div>
                                </div>
                                <div className="space-y-4 pt-8">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: [0, -10, 0] }}
                                        transition={{
                                            opacity: { delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                                            y: shouldSimplify ? { duration: 0 } : { duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
                                        }}
                                        className="rounded-3xl overflow-hidden shadow-xl relative h-48 border-4 border-white"
                                    >
                                        <Image
                                            src={getImageUrl(hero.images?.[2]) || (baseUrl ? `${baseUrl}/uploads/clinic_interior_205c275757.jpg` : 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800')}
                                            alt={hero.images?.[2]?.alt || "Family dental care"}
                                            fill
                                            className="object-cover"
                                        />
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: [0, -10, 0] }}
                                        transition={{
                                            opacity: { delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                                            y: shouldSimplify ? { duration: 0 } : { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 },
                                        }}
                                        className="rounded-3xl overflow-hidden shadow-xl relative h-64 border-4 border-white"
                                    >
                                        <Image
                                            src={getImageUrl(hero.images?.[3]) || (baseUrl ? `${baseUrl}/uploads/dental_team_db6d3d4f6f.jpg` : 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800')}
                                            alt={hero.images?.[3]?.alt || "Patient consultation"}
                                            fill
                                            className="object-cover"
                                        />
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* 2. BEFORE AND AFTER DENTAL TRANSFORMATIONS SECTION */}
            {beforeAfterGallery && beforeAfterGallery.items && beforeAfterGallery.items.length > 0 && (
                <CombinedTestimonialResult data={beforeAfterGallery as any} />
            )}

            {/* 3. SUCCESS STORIES / TESTIMONIALS SECTION */}
            {successStories && (
                <section className="px-6 py-20 md:py-32 bg-gradient-to-b from-primary-50 via-white to-white relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-400 to-transparent" />

                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-8 sm:mb-10 md:mb-12">
                            <AnimatedSectionHeader
                                badge={successStories.badge}
                                title={successStories.title}
                                subtitle={successStories.description}
                                titleClassName="text-foreground tracking-tight"
                                className="mb-0"
                            />
                        </div>

                        {/* Stories Carousel */}
                        {successStories.stories && successStories.stories.length > 0 && (
                            <Carousel
                                opts={{
                                    align: "start",
                                    loop: true,
                                    slidesToScroll: 1,
                                }}
                                className="w-full"
                            >
                                <CarouselContent className="-ml-2 md:-ml-4 py-3 px-2">
                                    {successStories.stories.map((story: any, index: number) => {
                                        const avatarUrl = getImageUrl(story.avatar)

                                        return (
                                            <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                                <PerformanceAnimation preset="slide-up-subtle" delay={index * 0.1} whileInView={true} className="h-full">
                                                    <MotionDiv
                                                        className="bg-white rounded-2xl border border-primary-50 relative overflow-hidden h-full flex flex-col group"
                                                        style={{
                                                            padding: '32px',
                                                            boxShadow: '0 8px 30px rgb(0,0,0,0.04)'
                                                        }}
                                                        whileHover={shouldSimplify ? undefined : {
                                                            y: -8,
                                                            boxShadow: '0 20px 40px rgb(0,0,0,0.08)',
                                                            borderColor: 'rgb(226, 232, 240)',
                                                            transition: { duration: 0.3 }
                                                        }}
                                                    >
                                                        {/* Gradient accent */}
                                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                                                        {/* Quote icon */}
                                                        <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                                            <Quote className="w-16 h-16 text-primary-500" />
                                                        </div>

                                                        <div className="relative z-10 flex flex-col h-full text-left">
                                                            {/* Rating stars */}
                                                            <div className="flex gap-1 mb-6">
                                                                {Array.from({ length: story.rating || 5 }).map((_, i) => (
                                                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                                                ))}
                                                            </div>

                                                            {/* Quote */}
                                                            <p className="text-sm sm:text-base md:text-lg mb-8 leading-relaxed italic flex-1 text-foreground-secondary font-normal">
                                                                &quot;{story.quote}&quot;
                                                            </p>

                                                            {/* Customer info with avatar */}
                                                            <div className="flex items-center justify-end gap-3 mt-auto pt-4 w-full text-right" style={{ alignSelf: 'flex-end' }}>
                                                                <div className="flex flex-col justify-center">
                                                                    <h4 className="text-lg sm:text-xl font-bold text-foreground leading-tight">{story.name}</h4>
                                                                    {story.treatment && (
                                                                        <p className="text-sm sm:text-base md:text-lg font-normal text-primary-600 mt-1">{story.treatment}</p>
                                                                    )}
                                                                </div>
                                                                {avatarUrl ? (
                                                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden shadow-sm flex-shrink-0 border-2 border-white ring-2 ring-primary-100 ml-2">
                                                                        <Image
                                                                            src={avatarUrl}
                                                                            alt={story.name}
                                                                            width={56}
                                                                            height={56}
                                                                            className="object-cover w-full h-full"
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 border-2 border-white ring-2 ring-primary-100 ml-2">
                                                                        <span className="text-white font-bold text-lg">{story.name?.charAt(0) || 'C'}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </MotionDiv>
                                                </PerformanceAnimation>
                                            </CarouselItem>
                                        )
                                    })}
                                </CarouselContent>

                                {/* Navigation Buttons — Vertically centered at sides */}
                                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none px-2 sm:-mx-12 z-20">
                                    <CarouselPrevious className="static translate-y-0 h-10 w-10 md:h-12 md:w-12 border-2 border-primary-300 text-primary-600 bg-white/90 hover:bg-white hover:text-primary-700 shadow-lg pointer-events-auto" />
                                    <CarouselNext className="static translate-y-0 h-10 w-10 md:h-12 md:w-12 border-2 border-primary-300 text-primary-600 bg-white/90 hover:bg-white hover:text-primary-700 shadow-lg pointer-events-auto" />
                                </div>
                            </Carousel>
                        )}
                    </div>
                </section>
            )}

            {/* 4. WHY INTERNATIONAL PATIENTS CHOOSE OUR DENTAL CLINIC SECTION */}
            {whyChooseUs && whyChooseUs.features && whyChooseUs.features.length > 0 && (
                <section className="px-6 py-20 md:py-32 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
                    {/* Background World Map Watermark */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl">
                            <svg viewBox="0 0 1000 500" className="w-full h-full">
                                <path d="M0,250 Q250,200 500,250 T1000,250" stroke="currentColor" strokeWidth="1" fill="none" className="text-slate-900" />
                                <circle cx="200" cy="250" r="3" fill="currentColor" className="text-slate-900" />
                                <circle cx="500" cy="250" r="3" fill="currentColor" className="text-slate-900" />
                                <circle cx="800" cy="250" r="3" fill="currentColor" className="text-slate-900" />
                            </svg>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        {/* Section Header */}
                        <div className="text-center md:text-center mb-8 sm:mb-10 md:mb-12">
                            <AnimatedSectionHeader
                                badge={whyChooseUs.badge}
                                title={whyChooseUs.title}
                                subtitle={whyChooseUs.description}
                                titleClassName="text-foreground tracking-tight"
                                className="mb-0"
                            />
                        </div>

                        {/* Feature Cards Carousel */}
                        <Carousel
                            opts={{
                                align: "start",
                                loop: true,
                                slidesToScroll: 1,
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-2 md:-ml-4 py-3 px-2">
                                {whyChooseUs.features.map((feature: any, index: number) => {
                                    const iconUrl = getImageUrl(feature.icon)
                                    const iconAlt = feature.icon?.alternativeText || feature.icon?.alt || feature.title

                                    return (
                                        <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                            <PerformanceAnimation preset="slide-up-subtle" delay={index * 0.1} whileInView={true}>
                                                <MotionDiv
                                                    className="bg-white rounded-2xl border border-slate-100 h-full flex flex-col transition-all duration-300 group"
                                                    style={{
                                                        padding: '32px',
                                                        boxShadow: '0 8px 30px rgb(0,0,0,0.04)'
                                                    }}
                                                    whileHover={shouldSimplify ? undefined : {
                                                        y: -8,
                                                        boxShadow: '0 20px 40px rgb(0,0,0,0.08)',
                                                        borderColor: 'rgb(226, 232, 240)',
                                                        transition: { duration: 0.3 }
                                                    }}
                                                >
                                                    {/* Row 1: Icon & Title */}
                                                    <div className="flex items-center gap-4 mb-5 sm:block">
                                                        {iconUrl ? (
                                                            <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 relative">
                                                                <Image
                                                                    src={iconUrl}
                                                                    alt={iconAlt}
                                                                    fill
                                                                    className="object-contain"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <MotionDiv
                                                                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center relative shrink-0"
                                                                style={{
                                                                    backgroundColor: '#E0F2FE',
                                                                    boxShadow: '0 0 0 0 rgba(14, 165, 233, 0.3)'
                                                                }}
                                                                whileHover={shouldSimplify ? undefined : {
                                                                    scale: 1.1,
                                                                    boxShadow: '0 0 20px 8px rgba(14, 165, 233, 0.15)',
                                                                    transition: { duration: 0.3 }
                                                                }}
                                                            >
                                                                <Globe className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600 group-hover:scale-110 transition-transform duration-300" />
                                                            </MotionDiv>
                                                        )}
                                                        <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-[#165197] transition-colors duration-300">
                                                            {feature.title}
                                                        </h3>
                                                    </div>

                                                    {/* Row 2: Feature Description */}
                                                    <div className="flex-1">
                                                        <p className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed font-normal">
                                                            {feature.description}
                                                        </p>
                                                    </div>

                                                    {/* Hover Indicator — Always visible on mobile, hover-only on desktop */}
                                                    <div className="mt-6 pt-4 border-t border-slate-100 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                                                        <div className="text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 text-primary-600 font-bold cursor-pointer">
                                                            <span>Learn more</span>
                                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                                        </div>
                                                    </div>
                                                </MotionDiv>
                                            </PerformanceAnimation>
                                        </CarouselItem>
                                    )
                                })}
                            </CarouselContent>

                            {/* Navigation Buttons — Vertically centered at sides */}
                            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none px-2 sm:-mx-12 z-20">
                                <CarouselPrevious className="static translate-y-0 h-10 w-10 md:h-12 md:w-12 border-2 border-primary-300 text-primary-600 bg-white/90 hover:bg-white hover:text-primary-700 shadow-lg pointer-events-auto" />
                                <CarouselNext className="static translate-y-0 h-10 w-10 md:h-12 md:w-12 border-2 border-primary-300 text-primary-600 bg-white/90 hover:bg-white hover:text-primary-700 shadow-lg pointer-events-auto" />
                            </div>
                        </Carousel>
                    </div>
                </section>
            )}

            {/* 5. REVIEWS SECTION - 5-Star Dental Clinic with Verified Patient Reviews */}
            {reviews && (
                <section className="px-6 py-20 md:py-32 max-w-7xl mx-auto">
                    <div className="text-center mb-8 sm:mb-10 md:mb-12">
                        <AnimatedSectionHeader
                            badge={reviews.badge}
                            title={reviews.title}
                            titleClassName="text-foreground tracking-tight"
                            className="mb-6"
                        >
                            {/* Rating with Stars */}
                            <div className="flex flex-col items-center justify-center gap-3 mb-6 mt-6">
                                {/* Row 1: Animated Stars */}
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <PerformanceAnimation key={i} preset="scale-in" delay={i * 0.1} whileInView={true}>
                                            <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
                                        </PerformanceAnimation>
                                    ))}
                                </div>

                                {/* Row 2: Rating Text */}
                                <p className="text-xl md:text-2xl font-bold">
                                    <span style={{ color: '#F59E0B' }}>{reviews.rating}</span>
                                    <span className="text-slate-600"> / </span>
                                    <span style={{ color: '#F59E0B' }}>5</span>
                                    <span className="text-foreground-secondary font-normal"> {reviews.rating_subtitle}</span>
                                </p>
                            </div>

                        </AnimatedSectionHeader>
                    </div>

                    {/* Checklist Stacked List (Static Layout ideally suited for odd item counts) */}
                    {reviews.checklist && reviews.checklist.length > 0 && (
                        <div className="w-full max-w-3xl mx-auto mt-12 flex flex-col gap-3 sm:gap-4 md:gap-5">
                            {reviews.checklist.map((item: any, index: number) => {
                                const iconUrl = getImageUrl(item.icon)
                                const iconAlt = item.icon?.alternativeText || item.icon?.alt || item.text

                                return (
                                    <PerformanceAnimation key={index} preset="slide-up-subtle" delay={index * 0.1} whileInView={true}>
                                        <MotionDiv
                                            className="bg-white rounded-2xl border border-slate-100 flex items-center gap-5 transition-all duration-300 overflow-hidden relative group"
                                            style={{
                                                padding: '20px 32px',
                                                boxShadow: '0 4px 15px rgb(0,0,0,0.02)'
                                            }}
                                            whileHover={shouldSimplify ? undefined : {
                                                x: 8,
                                                boxShadow: '0 12px 25px rgb(0,0,0,0.06)',
                                                borderColor: 'rgb(226, 232, 240)',
                                            }}
                                        >
                                            {/* Hover Accent Bar */}
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                            {/* Icon */}
                                            {iconUrl ? (
                                                <div className="w-12 h-12 flex-shrink-0">
                                                    <Image
                                                        src={iconUrl}
                                                        alt={iconAlt}
                                                        width={48}
                                                        height={48}
                                                        className="object-contain"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary-50 flex items-center justify-center border border-primary-100 shadow-inner">
                                                    <CheckCircle className="w-5 h-5 text-primary-600" />
                                                </div>
                                            )}

                                            {/* Text Block */}
                                            <div className="flex-1">
                                                <p className="text-sm sm:text-base md:text-lg text-foreground leading-snug group-hover:text-primary-700 transition-colors">
                                                    {item.text}
                                                </p>
                                            </div>

                                            {/* Action icon (Visible on Hover) */}
                                            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-50 opacity-0 group-hover:opacity-100 transition-all duration-300 text-primary-600 group-hover:bg-primary-50 group-hover:translate-x-1">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </MotionDiv>
                                    </PerformanceAnimation>
                                )
                            })}
                        </div>
                    )}
                </section>
            )}
        </div>
    )
}
