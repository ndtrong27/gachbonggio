'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tables } from '@/types/database.types';
import { ProductDimensions, calculateBrickQuantity } from '@/lib/calculator';
import BrickCalculatorModal from '@/components/BrickCalculatorModal';

interface ProductDetailClientProps {
  product: Tables<'products'>;
  colorVariants?: Tables<'products'>[];
  dimensions: ProductDimensions;
  relatedProducts: Tables<'products'>[];
  categoryAnchor: string;
}

export default function ProductDetailClient({
  product,
  colorVariants = [],
  dimensions,
  relatedProducts,
  categoryAnchor,
}: ProductDetailClientProps) {
  const [activeProduct, setActiveProduct] = useState<Tables<'products'>>(product);
  const [isCalcModalOpen, setIsCalcModalOpen] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // In-page quick calculator state
  const [calcWidth, setCalcWidth] = useState(3.0);
  const [calcHeight, setCalcHeight] = useState(2.6);
  const [calcWastage, setCalcWastage] = useState(5);

  const quickResult = calculateBrickQuantity(
    calcWidth,
    calcHeight,
    activeProduct.size,
    activeProduct.category,
    calcWastage
  );

  const zaloMessage = encodeURIComponent(
    `Chào Vĩnh Cửu Sài Gòn! Tôi đang xem sản phẩm trên website:\n` +
    `- Tên: ${activeProduct.name}\n` +
    `- Mã sản phẩm: ${activeProduct.code}\n` +
    `- Quy cách: ${activeProduct.size || dimensions.sizeLabel}\n` +
    `- Màu sắc: ${activeProduct.color || 'Tự nhiên'}\n` +
    `Tôi cần tư vấn số lượng và xin bảng báo giá sỉ giao về công trình!`
  );

  return (
    <>
      <div className="product-detail-layout">
        {/* =========================================================
            LEFT COLUMN: PRODUCT IMAGE & GALLERY
            ========================================================= */}
        <div className="detail-media-column">
          <div
            className="detail-main-image-wrap"
            onClick={() => setIsZoomOpen(true)}
            role="button"
            tabIndex={0}
            title="Bấm để phóng to xem chi tiết bề mặt hoa văn"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setIsZoomOpen(true);
            }}
          >
            <Image
              src={activeProduct.image_url || '/images/logo.png'}
              alt={`${activeProduct.name} - ${activeProduct.code}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 520px"
              style={{ objectFit: 'cover' }}
            />
            <div className="detail-zoom-hint">
              <span>🔍 Bấm để phóng to</span>
            </div>
          </div>

          <div className="detail-trust-badges">
            <div className="trust-badge-item">
              <span className="trust-icon">✓</span>
              <span>Sản xuất trực tiếp tại xưởng</span>
            </div>
            <div className="trust-badge-item">
              <span className="trust-icon">✓</span>
              <span>Chống tạt mưa & bền màu vĩnh cửu</span>
            </div>
            <div className="trust-badge-item">
              <span className="trust-icon">✓</span>
              <span>Giao hàng toàn quốc</span>
            </div>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN: DETAILS, SPECS, QUICK CALCULATOR, ACTIONS
            ========================================================= */}
        <div className="detail-info-column">
          <div className="detail-header-group">
            <div className="detail-category-tag">
              {activeProduct.category}
            </div>
            <h1 className="detail-product-title">{activeProduct.name}</h1>
            <div className="detail-code-row">
              <span className="code-pill">Mã SP: {activeProduct.code}</span>
              <span className="stock-pill">● Có sẵn kho</span>
            </div>

            {/* Color variants selector (e.g. Trắng / Xám xi măng) */}
            {colorVariants.length > 1 && (
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px dashed #e2e8f0' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                  Tùy chọn màu sắc hoàn thiện:
                </span>
                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                  {colorVariants.map((v) => {
                    const isSelected = v.id === activeProduct.id;
                    const isWhite = (v.color || '').toLowerCase().includes('trắng');
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setActiveProduct(v)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.45rem 0.95rem',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid var(--primary)' : '1.5px solid #cbd5e1',
                          background: isSelected ? 'var(--primary-light)' : '#ffffff',
                          color: isSelected ? 'var(--primary-dark)' : 'var(--secondary-dark)',
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <span
                          style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            backgroundColor: isWhite ? '#ffffff' : '#94a3b8',
                            border: '1px solid #64748b',
                            display: 'inline-block',
                          }}
                        />
                        <span>{v.color || 'Màu tiêu chuẩn'}</span>
                        {isSelected && <span style={{ fontSize: '0.75rem' }}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Specifications Table */}
          <div className="detail-specs-card">
            <h3 className="specs-card-title">BẢNG THÔNG SỐ KỸ THUẬT QUY CHUẨN</h3>
            <div className="specs-table">
              <div className="spec-row">
                <span className="spec-name">Quy cách (Kích thước):</span>
                <span className="spec-value highlight">{activeProduct.size || dimensions.sizeLabel}</span>
              </div>
              <div className="spec-row">
                <span className="spec-name">Định mức thi công:</span>
                <span className="spec-value">{dimensions.piecesPerM2} viên / m²</span>
              </div>
              <div className="spec-row">
                <span className="spec-name">Màu sắc hoàn thiện:</span>
                <span className="spec-value">{activeProduct.color || 'Tự nhiên'}</span>
              </div>
              <div className="spec-row">
                <span className="spec-name">Trọng lượng ước tính:</span>
                <span className="spec-value">~{dimensions.estimatedWeightKg} kg / viên</span>
              </div>
              <div className="spec-row">
                <span className="spec-name">Chất liệu chế tác:</span>
                <span className="spec-value">
                  {activeProduct.category === 'Bông gió xi măng'
                    ? 'Xi măng mác cao, cát thạch anh ép tĩnh'
                    : activeProduct.category === 'Bông gió tráng men'
                    ? 'Gốm đất sét nung tráng men cổ 1200°C'
                    : 'Đất sét nung tự nhiên mộc mạc'}
                </span>
              </div>
              <div className="spec-row">
                <span className="spec-name">Ứng dụng phù hợp:</span>
                <span className="spec-value">Mặt tiền chống nắng, vách ngăn giếng trời, tường rào, ô gió</span>
              </div>
            </div>
          </div>

          {/* In-page Quick Calculator Widget */}
          <div className="detail-quick-calc-card">
            <div className="quick-calc-header">
              <span className="calc-icon">📐</span>
              <div>
                <h4 className="quick-calc-title">Dự Toán Nhanh Cho Mảng Tường Của Bạn</h4>
                <p className="quick-calc-desc">Nhập kích thước mảng tường để biết ngay số lượng viên gạch cần đặt</p>
              </div>
            </div>

            <div className="quick-calc-inputs">
              <div className="quick-input-col">
                <label htmlFor="quick-w">Chiều rộng (m)</label>
                <input
                  id="quick-w"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={calcWidth}
                  onChange={(e) => setCalcWidth(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="quick-input-col">
                <label htmlFor="quick-h">Chiều cao (m)</label>
                <input
                  id="quick-h"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={calcHeight}
                  onChange={(e) => setCalcHeight(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="quick-input-col">
                <label htmlFor="quick-wastage">Hao hụt (%)</label>
                <select
                  id="quick-wastage"
                  value={calcWastage}
                  onChange={(e) => setCalcWastage(parseInt(e.target.value, 10))}
                >
                  <option value={3}>+3%</option>
                  <option value={5}>+5% (chuẩn)</option>
                  <option value={8}>+8%</option>
                  <option value={10}>+10%</option>
                </select>
              </div>
            </div>

            <div className="quick-calc-output">
              <div className="output-item">
                <span className="output-label">Diện tích:</span>
                <span className="output-val">{quickResult.areaM2} m²</span>
              </div>
              <div className="output-item highlight-item">
                <span className="output-label">CẦN ĐẶT:</span>
                <span className="output-val bold">{quickResult.totalPieces} viên</span>
              </div>
              <div className="output-item">
                <span className="output-label">Trọng lượng:</span>
                <span className="output-val">~{quickResult.totalWeightKg} kg</span>
              </div>
            </div>

            <button
              type="button"
              className="quick-calc-expand-btn"
              onClick={() => setIsCalcModalOpen(true)}
            >
              Mở bảng dự toán chi tiết & tư vấn thi công ↗
            </button>
          </div>

          {/* Action CTAs */}
          <div className="detail-action-bar">
            <a
              href={`https://zalo.me/0909177415?text=${zaloMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary detail-zalo-btn"
            >
              💬 Nhận Báo Giá Sỉ Qua Zalo
            </a>
            <a
              href="tel:0909177415"
              className="btn btn-outline detail-hotline-btn"
            >
              📞 Hotline: 0909.177.415
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================
          RELATED PRODUCTS SECTION
          ========================================================= */}
      {relatedProducts.length > 0 && (
        <section className="detail-related-section">
          <div className="related-header">
            <h3 className="related-title">Các Mẫu {product.category} Cùng Loại</h3>
            <Link href={`/${categoryAnchor}`} className="related-view-all">
              Xem toàn bộ danh mục &rarr;
            </Link>
          </div>

          <div className="related-grid">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.id}
                href={`/san-pham/${rel.code || rel.id}`}
                className="related-card"
              >
                <div className="related-thumb-wrap">
                  <Image
                    src={rel.image_url || '/images/logo.png'}
                    alt={rel.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 250px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="related-info">
                  <span className="related-code">{rel.code}</span>
                  <h4 className="related-name">{rel.name}</h4>
                  <span className="related-size">{rel.size}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Full Modal Calculator */}
      <BrickCalculatorModal
        isOpen={isCalcModalOpen}
        onClose={() => setIsCalcModalOpen(false)}
        product={activeProduct}
      />

      {/* Zoom Lightbox */}
      {isZoomOpen && (
        <div
          className="detail-zoom-modal-backdrop"
          onClick={() => setIsZoomOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="detail-zoom-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="zoom-close-btn"
              onClick={() => setIsZoomOpen(false)}
              aria-label="Đóng"
            >
              ✕
            </button>
            <div className="zoom-image-container">
              <Image
                src={activeProduct.image_url || '/images/logo.png'}
                alt={activeProduct.name}
                width={800}
                height={800}
                style={{ width: '100%', height: 'auto', objectFit: 'contain', maxHeight: '85vh' }}
                priority
              />
            </div>
            <div className="zoom-caption">
              <strong>{activeProduct.name}</strong> • Mã {activeProduct.code} • Quy cách {activeProduct.size}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
