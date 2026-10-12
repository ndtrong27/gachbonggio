'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tables } from '@/types/database.types';
import BrickCalculatorModal from './BrickCalculatorModal';

interface ProductFilterCatalogProps {
  products: Tables<'products'>[];
  initialCategory?: string;
  title?: string;
  subtitle?: string;
}

export default function ProductFilterCatalog({
  products,
  initialCategory = 'ALL',
  title = 'Tra Cứu & Lọc Mẫu Gạch Bông Gió',
  subtitle = 'Tìm kiếm nhanh chóng trong toàn bộ 270+ mẫu sản phẩm theo kích thước, màu sắc và dòng chất liệu',
}: ProductFilterCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSize, setSelectedSize] = useState<string>('ALL');
  const [selectedColor, setSelectedColor] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'default' | 'name-asc' | 'code-asc'>('default');
  const [visibleCount, setVisibleCount] = useState<number>(20);

  // Modal Calculator state
  const [calcModalProduct, setCalcModalProduct] = useState<Tables<'products'> | null>(null);
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  // Open modal with specific product
  const handleOpenCalc = (p?: Tables<'products'>) => {
    setCalcModalProduct(p || null);
    setIsCalcOpen(true);
  };

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [products]);

  // Extract normalized size categories
  const sizeFilters = useMemo(() => {
    return [
      { id: 'ALL', label: 'Tất cả kích thước' },
      { id: '290', label: '290 × 290 mm (Chuẩn xi măng)' },
      { id: '190', label: '190 × 190 mm (Xi măng mini)' },
      { id: '300', label: '300 × 300 mm (Đất nung)' },
      { id: '400', label: '400 × 400 mm (Khổ lớn)' },
      { id: '200', label: '200 × 200 mm' },
    ];
  }, []);

  // Extract color options
  const colorFilters = useMemo(() => {
    return [
      { id: 'ALL', label: 'Tất cả màu' },
      { id: 'trang', label: 'Màu Trắng' },
      { id: 'xam', label: 'Màu Xám xi măng' },
      { id: 'do', label: 'Đất Nung Đỏ' },
      { id: 'xanh', label: 'Men Xanh ngọc' },
      { id: 'vang', label: 'Men Vàng / Da lươn' },
    ];
  }, []);

  // Filter & Search Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Category filter
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) {
        return false;
      }

      // 2. Size filter
      if (selectedSize !== 'ALL') {
        const sizeStr = (p.size || '').toLowerCase();
        if (!sizeStr.includes(selectedSize)) {
          return false;
        }
      }

      // 3. Color filter
      if (selectedColor !== 'ALL') {
        const c = (p.color || '').toLowerCase();
        if (selectedColor === 'trang' && !c.includes('trắng')) return false;
        if (selectedColor === 'xam' && !(c.includes('xám') || c.includes('xi măng'))) return false;
        if (selectedColor === 'do' && !(c.includes('đất nung') || c.includes('đỏ'))) return false;
        if (selectedColor === 'xanh' && !(c.includes('xanh') || c.includes('ngọc'))) return false;
        if (selectedColor === 'vang' && !(c.includes('vàng') || c.includes('lươn'))) return false;
      }

      // 4. Keyword search (Name or Code)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = (p.name || '').toLowerCase().includes(q);
        const codeMatch = (p.code || '').toLowerCase().includes(q);
        const sizeMatch = (p.size || '').toLowerCase().includes(q);
        if (!nameMatch && !codeMatch && !sizeMatch) return false;
      }

      return true;
    });
  }, [products, selectedCategory, selectedSize, selectedColor, searchQuery]);

  // Sort logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'name-asc') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortBy === 'code-asc') {
      list.sort((a, b) => (a.code || '').localeCompare(b.code || ''));
    }
    return list;
  }, [filteredProducts, sortBy]);

  const displayedProducts = sortedProducts.slice(0, visibleCount);
  const hasMore = visibleCount < sortedProducts.length;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedSize('ALL');
    setSelectedColor('ALL');
    setSortBy('default');
    setVisibleCount(20);
  };

  return (
    <section className="filter-catalog-section" id="tra-cuu">
      <div className="container">
        {/* Section Header */}
        <div className="catalog-header-bar">
          <div>
            <span className="section-tag">Bộ Lọc & Tra Cứu Trực Tuyến</span>
            <h2 className="catalog-heading">{title}</h2>
            <p className="catalog-subheading">{subtitle}</p>
          </div>

          <button
            type="button"
            className="btn btn-primary catalog-open-calc-btn"
            onClick={() => handleOpenCalc()}
          >
            <span>📐 Mở Bảng Tính Dự Toán Số Lượng</span>
          </button>
        </div>

        {/* Filter Control Box */}
        <div className="filter-control-box">
          {/* Row 1: Search & Sort Bar */}
          <div className="filter-top-bar">
            <div className="filter-search-group">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Nhập mã SP (vd: VCB30-029) hoặc tên mẫu hoa văn..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(20);
                }}
                className="filter-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Xoá tìm kiếm"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="filter-sort-group">
              <label htmlFor="catalog-sort" className="sort-label">Sắp xếp:</label>
              <select
                id="catalog-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="filter-sort-select"
              >
                <option value="default">Mặc định (Tiêu chuẩn)</option>
                <option value="code-asc">Mã sản phẩm (A &rarr; Z)</option>
                <option value="name-asc">Tên sản phẩm (A &rarr; Z)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Category Filter Pills */}
          <div className="filter-pill-row">
            <span className="pill-row-label">Chất liệu:</span>
            <div className="pill-group">
              <button
                type="button"
                className={`filter-pill ${selectedCategory === 'ALL' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory('ALL');
                  setVisibleCount(20);
                }}
              >
                Tất cả ({products.length})
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setVisibleCount(20);
                    }}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 3: Dimensions & Colors Pills */}
          <div className="filter-dropdowns-row">
            <div className="filter-select-col">
              <label htmlFor="filter-size-select" className="filter-col-label">Khổ kích thước:</label>
              <select
                id="filter-size-select"
                value={selectedSize}
                onChange={(e) => {
                  setSelectedSize(e.target.value);
                  setVisibleCount(20);
                }}
                className="filter-custom-select"
              >
                {sizeFilters.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="filter-select-col">
              <label htmlFor="filter-color-select" className="filter-col-label">Gam màu hoàn thiện:</label>
              <select
                id="filter-color-select"
                value={selectedColor}
                onChange={(e) => {
                  setSelectedColor(e.target.value);
                  setVisibleCount(20);
                }}
                className="filter-custom-select"
              >
                {colorFilters.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            {(searchQuery || selectedCategory !== 'ALL' || selectedSize !== 'ALL' || selectedColor !== 'ALL') && (
              <button
                type="button"
                className="filter-reset-btn"
                onClick={handleResetFilters}
                title="Xoá mọi bộ lọc để hiển thị lại toàn bộ"
              >
                ↺ Đặt lại bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Results Stat Header */}
        <div className="filter-status-bar">
          <div className="filter-result-count">
            Hiển thị <strong>{displayedProducts.length}</strong> / <strong>{sortedProducts.length}</strong> mẫu sản phẩm phù hợp
            {selectedCategory !== 'ALL' && <span className="active-tag"> • {selectedCategory}</span>}
            {selectedSize !== 'ALL' && <span className="active-tag"> • Khổ {selectedSize}mm</span>}
            {searchQuery && <span className="active-tag"> • Từ khoá: &quot;{searchQuery}&quot;</span>}
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="catalog-empty-state">
            <div className="empty-icon">🔍</div>
            <h3>Không tìm thấy mẫu gạch phù hợp</h3>
            <p>Vui lòng thử tìm với từ khoá khác hoặc bấm đặt lại bộ lọc để xem toàn bộ danh mục.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleResetFilters}
            >
              Xem toàn bộ {products.length} sản phẩm
            </button>
          </div>
        ) : (
          <div className="catalog-grid">
            {displayedProducts.map((p) => {
              const zaloUrl = `https://zalo.me/0909177415?text=${encodeURIComponent(
                `Chào Vĩnh Cửu Sài Gòn! Tôi quan tâm đến sản phẩm ${p.name} (Mã: ${p.code}), xin gửi báo giá!`
              )}`;

              return (
                <div key={p.id} className="catalog-card">
                  <Link href={`/san-pham/${p.code || p.id}`} className="catalog-thumb-link">
                    <div className="catalog-image-wrap">
                      <Image
                        src={p.image_url || '/images/logo.png'}
                        alt={`${p.name} - ${p.code}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        loading="lazy"
                        style={{ objectFit: 'cover' }}
                      />
                      <span className="catalog-badge-category">{p.category}</span>
                      <span className="catalog-badge-code">{p.code}</span>
                    </div>
                  </Link>

                  <div className="catalog-card-body">
                    <Link href={`/san-pham/${p.code || p.id}`} className="catalog-title-link">
                      <h3 className="catalog-product-name" title={p.name}>
                        {p.name}
                      </h3>
                    </Link>

                    <div className="catalog-spec-list">
                      <div className="catalog-spec-item">
                        <span className="spec-label">Quy cách:</span>
                        <span className="spec-val">{p.size || 'Tiêu chuẩn'}</span>
                      </div>
                      <div className="catalog-spec-item">
                        <span className="spec-label">Màu sắc:</span>
                        <span className="spec-val highlight-color">{p.color || 'Tự nhiên'}</span>
                      </div>
                    </div>

                    <div className="catalog-card-actions">
                      <button
                        type="button"
                        className="catalog-btn-calc"
                        onClick={() => handleOpenCalc(p)}
                        title="Tính số lượng gạch cần cho diện tích tường của bạn"
                      >
                        📐 Tính Số Lượng
                      </button>

                      <Link
                        href={`/san-pham/${p.code || p.id}`}
                        className="catalog-btn-detail"
                      >
                        Xem Chi Tiết &rarr;
                      </Link>
                    </div>

                    <a
                      href={zaloUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="catalog-zalo-link"
                    >
                      💬 Báo giá Zalo nhanh
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="catalog-load-more-wrap">
            <button
              type="button"
              className="catalog-load-more-btn"
              onClick={() => setVisibleCount((prev) => prev + 20)}
            >
              <span>Xem Thêm 20 Mẫu Tiếp Theo (+{sortedProducts.length - visibleCount})</span>
              <span className="btn-arrow">&darr;</span>
            </button>
          </div>
        )}
      </div>

      {/* Calculator Modal */}
      <BrickCalculatorModal
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
        product={calcModalProduct}
      />
    </section>
  );
}
