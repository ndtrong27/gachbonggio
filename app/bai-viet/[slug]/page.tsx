import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug } from '@/lib/articles';
import { articles } from '@/data/articles';

export const revalidate = 60; // ISR 60 seconds

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gachbonggio.vercel.app';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Không tìm thấy bài viết | Vĩnh Cửu Sài Gòn',
    };
  }

  const articleUrl = `${siteUrl}/bai-viet/${article.slug}`;

  return {
    title: `${article.title} | Vĩnh Cửu Sài Gòn`,
    description: article.excerpt,
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: articleUrl,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
      images: [
        {
          url: article.coverImage.startsWith('http') ? article.coverImage : `${siteUrl}${article.coverImage}`,
          width: 800,
          height: 600,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage.startsWith('http') ? article.coverImage : `${siteUrl}${article.coverImage}`],
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const articleUrl = `${siteUrl}/bai-viet/${article.slug}`;
  const fullCoverImageUrl = article.coverImage.startsWith('http') ? article.coverImage : `${siteUrl}${article.coverImage}`;

  // Schema Structured Data for SEO (@graph: BreadcrumbList + Article)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
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
            'name': 'Cẩm Nang Kiến Trúc',
            'item': `${siteUrl}/bai-viet`,
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': article.title,
            'item': articleUrl,
          },
        ],
      },
      {
        '@type': 'Article',
        '@id': `${articleUrl}#article`,
        headline: article.title,
        description: article.excerpt,
        image: [fullCoverImageUrl],
        datePublished: article.publishedAt,
        dateModified: article.publishedAt,
        author: {
          '@type': 'Organization',
          name: article.author,
          url: siteUrl,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Vĩnh Cửu Sài Gòn',
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/images/logo.png`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': articleUrl,
        },
      },
    ],
  };

  return (
    <article className="article-detail-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        suppressHydrationWarning
      />

      <div className="container" style={{ maxWidth: '860px', padding: '2.5rem 1.25rem 5rem' }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="breadcrumb-nav">
          <Link href="/">Trang Chủ</Link>
          <span className="breadcrumb-separator">/</span>
          <Link href="/#bai-viet">Bài Viết</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{article.category}</span>
        </nav>

        {/* Article Header */}
        <header className="article-detail-header">
          <div className="article-badge-row">
            <span
              className="article-category-badge"
              style={{
                backgroundColor: article.categoryColor.bg,
                color: article.categoryColor.text,
                border: `1px solid ${article.categoryColor.border}`,
              }}
            >
              {article.category}
            </span>
            <span className="article-meta-text">
              ⏱️ {article.readingTime} • 📅 Ngày đăng: {article.publishedAt}
            </span>
          </div>

          <h1 className="article-detail-title">{article.title}</h1>

          <div className="article-author-info">
            <div className="author-avatar">🏛️</div>
            <div>
              <div className="author-name">{article.author}</div>
              <div className="author-role">Chuyên gia tư vấn vật liệu & kiến trúc mặt tiền</div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="article-detail-hero-image">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            priority
            loading="eager"
            sizes="(max-width: 900px) 100vw, 860px"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Article Content */}
        <div className="article-detail-content">
          <div className="article-lead">
            {article.lead}
          </div>

          {article.sections.map((section, idx) => (
            <section key={idx} className="article-content-section">
              <h2>{section.heading}</h2>

              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx}>{p}</p>
              ))}

              {section.highlight && (
                <div className="article-highlight-box">
                  <span className="highlight-icon">💡</span>
                  <span>{section.highlight}</span>
                </div>
              )}

              {section.quote && (
                <blockquote className="article-quote-box">
                  {section.quote}
                </blockquote>
              )}
            </section>
          ))}

          {/* Conclusion */}
          <div className="article-conclusion-box">
            <h3>Lời kết</h3>
            <p>{article.conclusion}</p>
          </div>

          {/* Featured Product CTA Box */}
          <div className="article-product-cta">
            <div className="product-cta-header">
              <span className="product-cta-tag">Sản Phẩm Trong Bài Viết</span>
              <h3>Khám phá dòng gạch được ứng dụng trong thiết kế này</h3>
            </div>

            <div className="product-cta-body">
              <div className="product-cta-thumb">
                <Image
                  src={article.featuredProduct.image}
                  alt={article.featuredProduct.name}
                  width={140}
                  height={140}
                  style={{ objectFit: 'cover', borderRadius: '10px' }}
                />
              </div>

              <div className="product-cta-details">
                <h4>{article.featuredProduct.name}</h4>
                <div className="product-cta-meta">
                  <div>Mã sản phẩm: <strong>{article.featuredProduct.code}</strong></div>
                  <div>Quy cách: <strong>{article.featuredProduct.size}</strong></div>
                  <div>Màu sắc: <strong>{article.featuredProduct.color}</strong></div>
                </div>

                <div className="product-cta-actions">
                  <Link href={article.featuredProduct.link} className="btn btn-primary">
                    Xem Mẫu Trên Trang Chủ
                  </Link>
                  <a href="tel:0909177415" className="btn btn-accent">
                    📞 Báo Giá Tận Xưởng
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Back Navigation */}
          <div className="article-bottom-actions">
            <Link href="/#bai-viet" className="btn btn-outline">
              &larr; Xem tất cả bài viết tiêu biểu
            </Link>
            <Link href="/" className="btn btn-primary">
              Về Trang Chủ
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
