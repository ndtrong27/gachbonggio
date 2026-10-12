'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Tables } from '@/types/database.types';
import { calculateBrickQuantity } from '@/lib/calculator';

interface BrickCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Tables<'products'> | null;
}

export default function BrickCalculatorModal({
  isOpen,
  onClose,
  product,
}: BrickCalculatorModalProps) {
  const [widthM, setWidthM] = useState<number>(3.0);
  const [heightM, setHeightM] = useState<number>(2.6);
  const [wastagePercent, setWastagePercent] = useState<number>(5);
  const [selectedSizeStr, setSelectedSizeStr] = useState<string>(
    product?.size || '290x290x90 mm'
  );

  const [prevProduct, setPrevProduct] = useState(product);
  if (product !== prevProduct) {
    setPrevProduct(product);
    if (product?.size) {
      setSelectedSizeStr(product.size);
    }
  }

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeSize = product?.size || selectedSizeStr;
  const activeCategory = product?.category || 'Bông gió xi măng';
  const result = calculateBrickQuantity(
    widthM,
    heightM,
    activeSize,
    activeCategory,
    wastagePercent
  );

  const productName = product ? `${product.name} (${product.code})` : 'Gạch Bông Gió Mỹ Thuật';
  const zaloMessage = encodeURIComponent(
    `Xin chào Vĩnh Cửu Sài Gòn! Tôi vừa dùng công cụ dự toán gạch trên website cho mảng tường:\n` +
    `- Kích thước tường: Rộng ${result.widthM}m × Cao ${result.heightM}m (Diện tích: ${result.areaM2} m²)\n` +
    `- Mẫu gạch: ${productName} (Quy cách: ${result.sizeLabel})\n` +
    `- Dự toán số lượng: ${result.totalPieces} viên (đã tính hao hụt ${result.wastagePercent}%)\n` +
    `- Trọng lượng ước tính: ~${result.totalWeightKg} kg\n` +
    `Xin vui lòng gửi báo giá sỉ xuất xưởng và phí giao hàng cho khối lượng này!`
  );

  return (
    <div
      className="calculator-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Công cụ tính toán số lượng gạch bông gió"
    >
      <div
        className="calculator-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="calculator-modal-header">
          <div className="calculator-title-wrap">
            <span className="calculator-badge">📐 TIỆN ÍCH DỰ TOÁN KỸ THUẬT</span>
            <h3 className="calculator-heading">Tính Số Lượng Gạch Theo Diện Tích Mảng Tường</h3>
          </div>
          <button
            type="button"
            className="calculator-close-btn"
            onClick={onClose}
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        {/* Selected Product Banner (if passed) */}
        {product && (
          <div className="calculator-selected-product">
            <div className="calc-prod-thumb">
              <Image
                src={product.image_url || '/images/logo.png'}
                alt={product.name}
                width={60}
                height={60}
                style={{ objectFit: 'cover', borderRadius: '6px' }}
              />
            </div>
            <div className="calc-prod-info">
              <div className="calc-prod-name">{product.name}</div>
              <div className="calc-prod-meta">
                Mã: <strong>{product.code}</strong> • Quy cách: <strong>{product.size}</strong> • {product.color}
              </div>
            </div>
          </div>
        )}

        <div className="calculator-modal-body">
          {/* Inputs Section */}
          <div className="calculator-inputs-grid">
            {/* Width */}
            <div className="calc-input-group">
              <label htmlFor="wall-width" className="calc-label">
                Chiều rộng mảng tường (mét)
              </label>
              <div className="calc-input-wrapper">
                <input
                  id="wall-width"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  value={widthM}
                  onChange={(e) => setWidthM(parseFloat(e.target.value) || 0)}
                  className="calc-input"
                />
                <span className="calc-unit">m</span>
              </div>
            </div>

            {/* Height */}
            <div className="calc-input-group">
              <label htmlFor="wall-height" className="calc-label">
                Chiều cao mảng tường (mét)
              </label>
              <div className="calc-input-wrapper">
                <input
                  id="wall-height"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="50"
                  value={heightM}
                  onChange={(e) => setHeightM(parseFloat(e.target.value) || 0)}
                  className="calc-input"
                />
                <span className="calc-unit">m</span>
              </div>
            </div>

            {/* If no product is pre-selected, let user select dimension */}
            {!product && (
              <div className="calc-input-group calc-full-col">
                <label htmlFor="wall-size" className="calc-label">
                  Quy cách gạch thông gió
                </label>
                <select
                  id="wall-size"
                  value={selectedSizeStr}
                  onChange={(e) => setSelectedSizeStr(e.target.value)}
                  className="calc-select"
                >
                  <option value="290x290x90 mm">290 × 290 × 90 mm (Bông gió xi măng phổ biến - 11 viên/m²)</option>
                  <option value="190x190x65 mm">190 × 190 × 65 mm (Bông gió xi măng mini - 25 viên/m²)</option>
                  <option value="300x300x40 mm">300 × 300 × 40 mm (Gạch đất nung truyền thống - 11 viên/m²)</option>
                  <option value="400x400x50 mm">400 × 400 × 50 mm (Gạch tráng men / đất nung khổ lớn - 6.25 viên/m²)</option>
                  <option value="200x200x30 mm">200 × 200 × 30 mm (Gạch tráng men chữ Thọ - 25 viên/m²)</option>
                </select>
              </div>
            )}

            {/* Wastage */}
            <div className="calc-input-group calc-full-col">
              <label className="calc-label">
                Dự phòng hao hụt thi công (cắt góc, căn chỉnh mạch vữa)
              </label>
              <div className="calc-wastage-options">
                {[3, 5, 8, 10].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    className={`calc-wastage-pill ${wastagePercent === pct ? 'active' : ''}`}
                    onClick={() => setWastagePercent(pct)}
                  >
                    +{pct}% {pct === 5 ? '(Khuyên dùng)' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Display Grid */}
          <div className="calculator-results-box">
            <h4 className="calc-results-title">KẾT QUẢ DỰ TOÁN KHỐI LƯỢNG</h4>
            
            <div className="calc-results-grid">
              <div className="calc-stat-card">
                <div className="stat-label">Diện tích tường</div>
                <div className="stat-value">{result.areaM2} <span className="stat-unit">m²</span></div>
                <div className="stat-sub">Rộng {result.widthM}m × Cao {result.heightM}m</div>
              </div>

              <div className="calc-stat-card">
                <div className="stat-label">Định mức quy chuẩn</div>
                <div className="stat-value">{result.piecesPerM2} <span className="stat-unit">viên/m²</span></div>
                <div className="stat-sub">Khổ gạch {result.sizeLabel}</div>
              </div>

              <div className="calc-stat-card highlight-card">
                <div className="stat-label">TỔNG SỐ LƯỢNG NÊN ĐẶT</div>
                <div className="stat-value highlight-val">
                  {result.totalPieces} <span className="stat-unit">viên</span>
                </div>
                <div className="stat-sub">
                  Gồm {result.netPieces} viên chính + {result.wastagePieces} viên dự phòng
                </div>
              </div>

              <div className="calc-stat-card">
                <div className="stat-label">Tổng khối lượng ước tính</div>
                <div className="stat-value">{result.totalWeightKg} <span className="stat-unit">kg</span></div>
                <div className="stat-sub">Hỗ trợ tính cước xe tải giao hàng</div>
              </div>
            </div>
          </div>

          {/* CTA Actions */}
          <div className="calculator-actions-group">
            <a
              href={`https://zalo.me/0909177415?text=${zaloMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary calc-cta-zalo"
            >
              <span>💬 Gửi Bảng Dự Toán Này Qua Zalo Để Nhận Báo Giá Sỉ</span>
            </a>
            <a
              href="tel:0909177415"
              className="btn btn-outline calc-cta-call"
            >
              <span>📞 Hotline Kỹ Thuật: 0909.177.415</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
