const fs = require("fs");
const path = require("path");

const content = `import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Clock, TrendingUp, DollarSign, Award, Zap, Shield, Calendar,
  Smile, Star, Heart, CheckCircle, Sparkles,
  FileSearch, Wrench, Check, ChevronDown,
  GraduationCap, Users, Phone, ArrowLeft
} from 'lucide-react';

interface ServicePage {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description?: string;
  content?: any;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

const iconMap: Record<string, any> = {
  Smile, Star, Heart, CheckCircle, Clock, Sparkles,
  FileSearch, Wrench, Award, Zap, Shield, Calendar,
  GraduationCap, Users
};

async function getServiceBySlug(slug: string): Promise<ServicePage | null> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (STRAPI_TOKEN) {
      headers['Authorization'] = \`Bearer \${STRAPI_TOKEN}\`;
    }

    const response = await fetch(
      \`\${STRAPI_URL}/api/pages?filters[slug][$eq]=\${slug}&populate=*\`,
      {
        headers,
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch service:', response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return null;
    }

    return data.data[0];
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
}

async function getAllServiceSlugs(): Promise<string[]> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (STRAPI_TOKEN) {
      headers['Authorization'] = \`Bearer \${STRAPI_TOKEN}\`;
    }

    const response = await fetch(
      \`\${STRAPI_URL}/api/pages?filters[slug][$in]=implant,invisalign,veneer,whitening&fields[0]=slug\`,
      {
        headers,
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.data?.map((page: any) => page.slug) || [];
  } catch (error) {
    console.error('Error fetching service slugs:', error);
    return [];
  }
}

export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: 'Dịch vụ không tìm thấy',
    };
  }

  return {
    title: \`\${service.title} | Nha Khoa Quốc Tế Sài Gòn\`,
    description: service.description || service.title,
  };
}

export default async function ServicePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  // Parse content
  let serviceData = service.content;
  if (typeof serviceData === 'string') {
    try {
      serviceData = JSON.parse(serviceData);
    } catch (e) {
      serviceData = {};
    }
  }

  const hero = serviceData?.hero || {};
  const intro = serviceData?.intro || {};
  const benefits = serviceData?.benefits || [];

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-sky-500 transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/services" className="hover:text-sky-500 transition-colors">
              Dịch vụ
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{service.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-sky-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-sky-100 text-sky-700 rounded-full text-sm font-medium">
                Dịch vụ nha khoa
              </div>
              
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                {hero.serviceName || service.title}
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                {hero.description || service.description}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                {hero.duration && (
                  <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl shadow-sm">
                    <Clock className="w-5 h-5 text-sky-500" />
                    <div>
                      <div className="text-xs text-gray-500">Thời gian</div>
                      <div className="font-semibold text-gray-900">{hero.duration}</div>
                    </div>
                  </div>
                )}
                
                {hero.recoveryTime && (
                  <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl shadow-sm">
                    <TrendingUp className="w-5 h-5 text-sky-500" />
                    <div>
                      <div className="text-xs text-gray-500">Hồi phục</div>
                      <div className="font-semibold text-gray-900">{hero.recoveryTime}</div>
                    </div>
                  </div>
                )}

                {hero.priceRange && (
                  <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl shadow-sm">
                    <DollarSign className="w-5 h-5 text-sky-500" />
                    <div>
                      <div className="text-xs text-gray-500">Giá</div>
                      <div className="font-semibold text-gray-900">{hero.priceRange}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 pt-6">
                <Link
                  href="/booking"
                  className="px-8 py-4 bg-sky-500 text-white rounded-2xl font-semibold shadow-lg shadow-sky-500/30 hover:bg-sky-600 transition-colors"
                >
                  Đặt lịch tư vấn
                </Link>
                
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-white text-gray-700 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-shadow"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>

            {hero.heroImage && (
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <Image 
                    src={hero.heroImage} 
                    alt={hero.serviceName || service.title}
                    width={600}
                    height={500}
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sky-900/20 to-transparent" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: 'Bác sĩ chuyên khoa', description: 'Đội ngũ giàu kinh nghiệm' },
              { icon: Zap, title: 'Công nghệ tiên tiến', description: 'Trang thiết bị hiện đại' },
              { icon: Shield, title: 'An toàn tuyệt đối', description: 'Quy trình chuẩn quốc tế' },
              { icon: Calendar, title: 'Bảo hành dài hạn', description: 'Cam kết chất lượng' }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-2">
                <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-sky-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro Section */}
      {intro.title && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {intro.image && (
                <div className="rounded-3xl overflow-hidden shadow-xl">
                  <Image 
                    src={intro.image} 
                    alt={intro.title}
                    width={600}
                    height={400}
                    className="w-full h-[400px] object-cover"
                  />
                </div>
              )}

              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {intro.title}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {intro.content}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {benefits.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-white to-sky-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Ưu điểm vượt trội
              </h2>
              <p className="text-lg text-gray-600">
                Những lợi ích tuyệt vời mà dịch vụ mang lại cho bạn
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit: any, index: number) => {
                const IconComponent = iconMap[benefit.icon] || Smile;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center mb-6">
                      <IconComponent className="w-7 h-7 text-sky-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-sky-500 via-sky-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
              Sẵn sàng cải thiện nụ cười của bạn?
            </h2>
            
            <p className="text-xl text-sky-50 max-w-2xl mx-auto">
              Đặt lịch tư vấn miễn phí với đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm của chúng tôi
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-sky-600 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-shadow"
              >
                <Calendar className="w-5 h-5" />
                Đặt lịch ngay
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-sky-700 text-white rounded-2xl font-semibold shadow-lg hover:bg-sky-800 transition-colors"
              >
                <Phone className="w-5 h-5" />
                Gọi tư vấn: 0901 123 456
              </Link>
            </div>

            <div className="pt-6 text-sky-100 text-sm">
              ⭐ Được tin tưởng bởi hơn 10,000+ khách hàng
            </div>
          </div>
        </div>
      </section>

      {/* Back to Services */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Xem tất cả dịch vụ
          </Link>
        </div>
      </div>
    </main>
  );
}
`;

const filePath = path.join(
  __dirname,
  "../dental-frontend/src/app/services/[slug]/page.tsx",
);
fs.writeFileSync(filePath, content, "utf8");

console.log("✅ Service detail page created successfully!");
