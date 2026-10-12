import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/database.types';

export const revalidate = 0; // Dynamic dashboard

async function getDashboardStats() {
  const [productsRes, articlesRes] = await Promise.all([
    supabase.from('products').select('*').order('id', { ascending: false }),
    supabase.from('articles').select('*').order('created_at', { ascending: false }),
  ]);

  const products = (productsRes.data as Tables<'products'>[]) || [];
  const articles = (articlesRes.data as Tables<'articles'>[]) || [];

  const xiMangCount = products.filter((p) => p.category === 'Bông gió xi măng').length;
  const trangMenCount = products.filter((p) => p.category === 'Bông gió tráng men').length;
  const datNungCount = products.filter((p) => p.category === 'Bông gió đất nung').length;
  const inStockCount = products.filter((p) => p.in_stock !== false).length;

  return {
    totalProducts: products.length,
    xiMangCount,
    trangMenCount,
    datNungCount,
    inStockCount,
    totalArticles: articles.length,
    recentProducts: products.slice(0, 6),
    recentArticles: articles.slice(0, 5),
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="admin-page-content">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumb-tag">
            <span className="dot-live" /> BẢNG ĐIỀU KHIỂN QUẢN TRỊ
          </div>
          <h1 className="admin-page-title">Tổng Quan Hoạt Động & Dữ Liệu</h1>
          <p className="admin-page-desc">
            Theo dõi thời gian thực dữ liệu 274+ mẫu gạch bông gió mỹ thuật và hệ thống cẩm nang kiến trúc.
          </p>
        </div>

        <div className="admin-header-actions">
          <Link href="/admin/san-pham" className="admin-btn admin-btn-primary">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            Quản Lý Sản Phẩm
          </Link>
          <Link href="/admin/bai-viet" className="admin-btn admin-btn-secondary">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Viết Bài Mới
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="admin-metrics-grid">
        {/* Card 1: Tổng Sản Phẩm */}
        <div className="metric-card border-blue">
          <div className="metric-card-top">
            <span className="metric-label">TỔNG SẢN PHẨM</span>
            <div className="metric-icon-box bg-blue">
              <svg width="20" height="20" fill="none" stroke="#0284c7" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              </svg>
            </div>
          </div>
          <div className="metric-value-wrap">
            <span className="metric-value-num">{stats.totalProducts}</span>
            <span className="metric-unit-tag">mẫu gạch</span>
          </div>
          <div className="metric-card-footer">
            <span className="status-dot green" />
            <span>Lưu trữ trên Supabase Singapore</span>
          </div>
        </div>

        {/* Card 2: Bông Gió Xi Măng */}
        <div className="metric-card border-sky">
          <div className="metric-card-top">
            <span className="metric-label">BÔNG GIÓ XI MĂNG</span>
            <div className="metric-icon-box bg-sky">
              <svg width="20" height="20" fill="none" stroke="#0369a1" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            </div>
          </div>
          <div className="metric-value-wrap">
            <span className="metric-value-num">{stats.xiMangCount}</span>
            <span className="metric-unit-tag">mẫu</span>
          </div>
          <div className="metric-card-footer">
            <span className="status-dot blue" />
            <span>Quy cách 290x290 & 190x190 mm</span>
          </div>
        </div>

        {/* Card 3: Bông Gió Tráng Men */}
        <div className="metric-card border-amber">
          <div className="metric-card-top">
            <span className="metric-label">BÔNG GIÓ TRÁNG MEN</span>
            <div className="metric-icon-box bg-amber">
              <svg width="20" height="20" fill="none" stroke="#d97706" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
          </div>
          <div className="metric-value-wrap">
            <span className="metric-value-num">{stats.trangMenCount}</span>
            <span className="metric-unit-tag">mẫu</span>
          </div>
          <div className="metric-card-footer">
            <span className="status-dot amber" />
            <span>Men gốm Indochine cổ truyền</span>
          </div>
        </div>

        {/* Card 4: Bông Gió Đất Nung */}
        <div className="metric-card border-orange">
          <div className="metric-card-top">
            <span className="metric-label">BÔNG GIÓ ĐẤT NUNG</span>
            <div className="metric-icon-box bg-orange">
              <svg width="20" height="20" fill="none" stroke="#ea580c" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
          </div>
          <div className="metric-value-wrap">
            <span className="metric-value-num">{stats.datNungCount}</span>
            <span className="metric-unit-tag">mẫu</span>
          </div>
          <div className="metric-card-footer">
            <span className="status-dot orange" />
            <span>Đất sét nung mộc sân vườn</span>
          </div>
        </div>

        {/* Card 5: Tồn Kho Sẵn Sàng */}
        <div className="metric-card border-emerald">
          <div className="metric-card-top">
            <span className="metric-label">SẴN SÀNG XUẤT KHO</span>
            <div className="metric-icon-box bg-emerald">
              <svg width="20" height="20" fill="none" stroke="#059669" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          </div>
          <div className="metric-value-wrap">
            <span className="metric-value-num">{stats.inStockCount}</span>
            <span className="metric-unit-tag">mẫu sẵn sàng</span>
          </div>
          <div className="metric-card-footer">
            <span className="status-dot green" />
            <span>Tổng kho Thủ Đức & Bình Dương</span>
          </div>
        </div>

        {/* Card 6: Bài Viết Kiến Trúc */}
        <div className="metric-card border-purple">
          <div className="metric-card-top">
            <span className="metric-label">BÀI VIẾT & CẨM NANG</span>
            <div className="metric-icon-box bg-purple">
              <svg width="20" height="20" fill="none" stroke="#7c3aed" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
          </div>
          <div className="metric-value-wrap">
            <span className="metric-value-num">{stats.totalArticles}</span>
            <span className="metric-unit-tag">bài xuất bản</span>
          </div>
          <div className="metric-card-footer">
            <span className="status-dot purple" />
            <span>Đang phát hành cho khách hàng</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Products & Articles */}
      <div className="admin-two-cols">
        {/* Left: Recent Products */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">Mẫu Gạch Mới Cập Nhật</h2>
              <p className="admin-card-subtitle">Các mẫu gạch bông gió đang lưu trữ trên hệ thống</p>
            </div>
            <Link href="/admin/san-pham" className="admin-card-link">
              Xem toàn bộ ({stats.totalProducts}) &rarr;
            </Link>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Ảnh</th>
                  <th>Mã SP</th>
                  <th>Tên Sản Phẩm</th>
                  <th>Danh Mục</th>
                  <th>Giá Bán</th>
                  <th style={{ textAlign: 'center' }}>Tồn Kho</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="admin-table-thumb">
                        <Image
                          src={p.image_url || '/images/logo.png'}
                          alt={p.name}
                          width={44}
                          height={44}
                          style={{ objectFit: 'cover' }}
                          unoptimized={p.image_url?.startsWith('http')}
                        />
                      </div>
                    </td>
                    <td>
                      <span className="admin-table-code">{p.code}</span>
                    </td>
                    <td>
                      <span className="admin-product-name">{p.name}</span>
                    </td>
                    <td>
                      <span className="admin-cat-badge">{p.category}</span>
                    </td>
                    <td>
                      <span className="admin-price-text">{p.price_display || 'Liên hệ'}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {p.in_stock !== false ? (
                        <span className="stock-pill in-stock">● Còn hàng</span>
                      ) : (
                        <span className="stock-pill out-of-stock">○ Tạm hết</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Articles */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">Bài Viết & Hướng Dẫn Kỹ Thuật</h2>
              <p className="admin-card-subtitle">Cẩm nang kiến trúc đang xuất bản trên website</p>
            </div>
            <Link href="/admin/bai-viet" className="admin-card-link">
              Quản lý ({stats.totalArticles}) &rarr;
            </Link>
          </div>

          <div className="admin-articles-list">
            {stats.recentArticles.map((art) => (
              <div key={art.id} className="admin-article-row">
                <div className="admin-art-thumb">
                  <Image
                    src={art.cover_image || '/images/banners/banner-9.jpg'}
                    alt={art.title}
                    width={72}
                    height={52}
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                    unoptimized={art.cover_image?.startsWith('http')}
                  />
                </div>
                <div className="admin-art-info">
                  <div className="admin-art-cat">{art.category}</div>
                  <h3 className="admin-art-title" title={art.title}>
                    {art.title}
                  </h3>
                  <div className="admin-art-meta">
                    <span>{art.author || 'KTS. Vĩnh Cửu Sài Gòn'}</span> • <span>{art.reading_time || '4 phút đọc'}</span>
                  </div>
                </div>
                <div className="admin-art-status">
                  <span className={`status-pill ${art.published !== false ? 'published' : 'draft'}`}>
                    {art.published !== false ? 'Đã xuất bản' : 'Bản nháp'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
