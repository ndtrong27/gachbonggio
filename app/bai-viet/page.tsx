import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedArticles } from '@/lib/articles';
import ArticleCard from '@/components/ArticleCard';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gachbonggio.vercel.app';

export const metadata: Metadata = {
  title: 'Cẩm Nang Kiến Trúc & Tư Vấn Gạch Bông Gió',
  description: 'Tổng hợp các bài viết chuyên sâu về kiến trúc mặt tiền, giải pháp chống nóng, thông gió tự nhiên và phong cách thiết kế ứng dụng gạch bông gió mỹ thuật.',
  alternates: {
    canonical: '/bai-viet',
  },
  openGraph: {
    title: 'Cẩm Nang Kiến Trúc & Tư Vấn Gạch Bông Gió | Vĩnh Cửu Sài Gòn',
    description: 'Tổng hợp các giải pháp chống nóng mặt tiền, kỹ thuật thi công và cẩm nang kiến trúc ứng dụng gạch bông gió mỹ thuật.',
    url: `${siteUrl}/bai-viet`,
    type: 'website',
    images: [
      {
        url: '/images/banners/banner-9.jpg',
        width: 1200,
        height: 630,
        alt: 'Cẩm nang kiến trúc gạch bông gió Vĩnh Cửu Sài Gòn',
      },
    ],
  },
};

export const revalidate = 60; // ISR 60s

export default async function ArticlesIndexPage() {
  const articles = await getPublishedArticles();

  const articlesIndexSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Trang Chủ',
        'item': siteUrl,
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Cẩm Nang Kiến Trúc & Bài Viết',
        'item': `${siteUrl}/bai-viet`,
      },
    ],
  };

  return (
    <main className="section-padding" style={{ background: '#f8fafc', minHeight: '80vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articlesIndexSchema) }}
        suppressHydrationWarning
      />

      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="breadcrumb-nav" style={{ marginBottom: '2rem' }}>
          <Link href="/">Trang Chủ</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Cẩm Nang Kiến Trúc & Bài Viết</span>
        </nav>

        {/* Header */}
        <div className="section-header" style={{ marginBottom: '3rem' }}>
          <span className="section-tag">Kiến Thức & Cảm Hứng Thiết Kế</span>
          <h1 className="section-title">Cẩm Nang & Xu Hướng Ứng Dụng Bông Gió</h1>
          <p className="section-subtitle">
            Khám phá các giải pháp chống nóng mặt tiền hướng Tây, phối cảnh kiến trúc Indochine, và kỹ thuật thi công gạch thông gió từ đội ngũ chuyên gia Vĩnh Cửu Sài Gòn.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="article-grid">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* Consultation Call To Action */}
        <div
          style={{
            marginTop: '5rem',
            padding: '3rem 2rem',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: '16px',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <span style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.08em', display: 'block', marginBottom: '0.75rem' }}>
            Hỗ Trợ Kỹ Thuật & Thiết Kế
          </span>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ffffff' }}>
            Bạn Cần Tư Vấn Thiết Kế Mặt Tiền Cho Công Trình Của Mình?
          </h2>
          <p style={{ color: '#cbd5e0', maxWidth: '640px', margin: '0 auto 2rem', lineHeight: '1.7' }}>
            Gửi bản vẽ mặt bằng hoặc liên hệ trực tiếp với KTS của chúng tôi để nhận phương án bố trí bông gió chắn nắng tối ưu nhất.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:0909177415" className="btn btn-primary" style={{ padding: '0.85rem 2rem' }}>
              📞 Hotline: 0909.177.415
            </a>
            <Link href="/san-pham" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', padding: '0.85rem 2rem' }}>
              Xem Toàn Bộ Sản Phẩm
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
