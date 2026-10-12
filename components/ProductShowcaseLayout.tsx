'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tables } from '@/types/database.types';

export interface ShowcaseProjectBanner {
  imageUrl: string;
  caption: string;
  alt: string;
}

export interface ProductShowcaseLayoutProps {
  id: string;
  theme: 'xi-mang' | 'trang-men' | 'dat-nung';
  badgeText: string;
  titleLine1: string;
  titleLine2: string;
  bulletPoints: string[];
  hotlineText?: string;
  hotlinePhone?: string;
  banner1: ShowcaseProjectBanner;
  banner2: ShowcaseProjectBanner;
  dividerText: string;
  products: Tables<'products'>[];
  totalCount: number;
}

export default function ProductShowcaseLayout({
  id,
  theme,
  badgeText,
  titleLine1,
  titleLine2,
  bulletPoints,
  hotlineText = 'HOTLINE TƯ VẤN: 0909.177.415',
  hotlinePhone = '0909177415',
  banner1,
  banner2,
  dividerText,
  products,
  totalCount,
}: ProductShowcaseLayoutProps) {
  // Initial state: 3 rows = 12 products. Each "Xem Thêm" adds 2 rows = +8 products.
  const DEFAULT_COUNT = 12;
  const [visibleCount, setVisibleCount] = useState(DEFAULT_COUNT);

  const displayedProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;
  const isExpanded = visibleCount > DEFAULT_COUNT;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 8, products.length));
  };

  const handleCollapse = () => {
    setVisibleCount(DEFAULT_COUNT);
    // Smooth scroll back to divider ribbon if scrolled far down
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id={id} className={`showcase-section-theme showcase-theme-${theme}`}>
      <div className="container">
        {/* Main Box Outer Container Matching Wireframe */}
        <div className="showcase-outer-frame">
          {/* =========================================================
              ROW 1: 3 COLUMNS [TÊN SP / CARD INFO] | [BANNER 1] | [BANNER 2]
              ========================================================= */}
          <div className="showcase-top-grid">
            {/* Box 1: [tên sp] - Brand & Category Card */}
            <div className="showcase-info-card">
              <div className="showcase-brand-header">
                <div className="showcase-logo-wrap">
                  <Image
                    src="/images/logo.png"
                    alt="Logo Vĩnh Cửu Sài Gòn"
                    width={150}
                    height={50}
                    style={{ objectFit: 'contain', width: 'auto', height: '42px' }}
                    priority
                  />
                </div>
                <div className="showcase-badge-pill">
                  {badgeText}
                </div>
              </div>

              <div className="showcase-title-block">
                <span className="showcase-title-l1">{titleLine1}</span>
                <h3 className="showcase-title-l2">{titleLine2}</h3>
              </div>

              <ul className="showcase-bullets-list">
                {bulletPoints.map((bp, idx) => (
                  <li key={idx} className="showcase-bullet-item">
                    <span className="showcase-bullet-dot" aria-hidden="true" />
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>

              <a
                href={`tel:${hotlinePhone}`}
                className="showcase-hotline-btn"
                title={`Gọi ngay ${hotlinePhone} để nhận tư vấn và báo giá chiết khấu`}
              >
                <span>📞</span>
                <span>{hotlineText}</span>
              </a>
            </div>

            {/* Box 2: [banner1] - Real Project Photo 1 */}
            <div className="showcase-banner-box">
              <div className="showcase-banner-img-wrap">
                <Image
                  src={banner1.imageUrl}
                  alt={banner1.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 440px"
                  style={{ objectFit: 'cover' }}
                />
                <div className="showcase-caption-overlay">
                  <span>{banner1.caption}</span>
                </div>
              </div>
            </div>

            {/* Box 3: [banner2] - Real Project Photo 2 */}
            <div className="showcase-banner-box">
              <div className="showcase-banner-img-wrap">
                <Image
                  src={banner2.imageUrl}
                  alt={banner2.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 440px"
                  style={{ objectFit: 'cover' }}
                />
                <div className="showcase-caption-overlay">
                  <span>{banner2.caption}</span>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              ROW 2: DIVIDER BAR / RIBBON
              ========================================================= */}
          <div className="showcase-divider-ribbon">
            <span className="showcase-divider-text">{dividerText}</span>
          </div>

          {/* =========================================================
              ROW 3: 4 COLUMNS [SP1] | [SP2] | [SP3] | [SP4] ...
              ========================================================= */}
          <div className="showcase-bottom-grid">
            {displayedProducts.map((product, idx) => (
              <div
                key={product.id}
                className="showcase-product-card"
                style={{
                  animation: idx >= DEFAULT_COUNT ? 'showcaseFadeInUp 0.35s ease-out forwards' : undefined,
                }}
              >
                <Link
                  href={`/san-pham/${product.code || product.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="showcase-card-body">
                    <div className="showcase-product-thumb-wrap">
                      <Image
                        src={product.image_url || '/images/logo.png'}
                        alt={`${product.name} - ${product.code}`}
                        fill
                        sizes="(max-width: 768px) 120px, 140px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>

                    <div className="showcase-product-details">
                      <div className="showcase-prod-code-badge">
                        {product.code}
                      </div>
                      <h4 className="showcase-prod-name" title={product.name}>
                        {product.name}
                      </h4>
                      <div className="showcase-prod-spec">
                        <span className="spec-label">Quy cách:</span>
                        <span className="spec-val">{product.size || 'Tiêu chuẩn'}</span>
                      </div>
                      <div className="showcase-prod-spec">
                        <span className="spec-label">Màu sắc:</span>
                        <span className="spec-val spec-color">{product.color || 'Tự nhiên'}</span>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link
                  href={`/san-pham/${product.code || product.id}`}
                  className="showcase-cta-tag"
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <span>XEM CHI TIẾT & BÁO GIÁ &rarr;</span>
                </Link>
              </div>
            ))}
          </div>

          {/* =========================================================
              LOAD MORE BUTTON SECTION ("XEM THÊM ..." +2 HÀNG SẢN PHẨM)
              ========================================================= */}
          <div className="showcase-load-more-section">
            <div className="showcase-load-more-btn-group">
              {hasMore && (
                <button
                  type="button"
                  className="showcase-load-more-btn"
                  onClick={handleLoadMore}
                  title="Bấm để xem thêm 2 hàng (8 sản phẩm) tiếp theo"
                >
                  <span className="load-more-icon">✦</span>
                  <span>Xem Thêm 2 Hàng Sản Phẩm (+8 Mẫu)</span>
                  <span className="load-more-arrow">&darr;</span>
                </button>
              )}

              {isExpanded && (
                <button
                  type="button"
                  className="showcase-collapse-btn"
                  onClick={handleCollapse}
                  title="Thu gọn danh sách về lại 3 hàng (12 mẫu)"
                >
                  <span>Thu Gọn &uarr;</span>
                </button>
              )}
            </div>

            <div className="showcase-product-counter">
              <span>Đang hiển thị <strong>{displayedProducts.length}</strong> / <strong>{products.length}</strong> mẫu sản phẩm</span>
            </div>
          </div>

          {/* Section Footnote Action */}
          <div className="showcase-frame-footer">
            <span className="showcase-footnote-info">
              ✓ Toàn bộ {totalCount} mẫu trong danh mục đều được sản xuất trực tiếp và sẵn sàng giao hàng ngay tại xưởng
            </span>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link
                href="/san-pham"
                className="btn btn-primary showcase-view-all-btn"
              >
                🔍 Tra Cứu & Dự Toán Toàn Bộ {totalCount} Mẫu
              </Link>
              <a
                href="tel:0909177415"
                className="btn btn-outline showcase-view-all-btn"
              >
                📞 Hotline: 0909.177.415
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
