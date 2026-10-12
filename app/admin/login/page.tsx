'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@vinhcuusaigon.vn');
  const [password, setPassword] = useState('vcsg@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Đăng nhập không thành công');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('admin@vinhcuusaigon.vn');
    setPassword('vcsg@2026');
    setError(null);
  };

  return (
    <div className="admin-auth-page">
      {/* ========================================================
          LEFT COLUMN: Luxury Architecture Showcase (Canva Concept)
          ======================================================== */}
      <div className="admin-auth-hero">
        <div className="admin-auth-hero-bg">
          <Image
            src="/images/banners/banner-9.jpg"
            alt="Kiến trúc gạch bông gió Vĩnh Cửu Sài Gòn"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            style={{ objectFit: 'cover' }}
          />
          <div className="admin-auth-overlay" />
        </div>

        <div className="admin-auth-hero-content">
          {/* Top Brand Pill */}
          <div className="auth-brand-badge">
            <span className="auth-dot" />
            <span>VĨNH CỬU SÀI GÒN • HỆ THỐNG QUẢN TRỊ NỘI BỘ</span>
          </div>

          {/* Slogan & Quote */}
          <div className="auth-hero-main">
            <h2 className="auth-hero-title">
              Kiến Tạo Không Gian <br />
              <span className="highlight-text">Thoáng Đãng & Trường Tồn</span>
            </h2>
            <p className="auth-hero-quote">
              &ldquo;Architecture is the thoughtful shaping of light, space, and permanence.&rdquo;
            </p>
            <p className="auth-hero-desc">
              Hệ thống quản trị thời gian thực cho hơn 270+ mẫu gạch bông gió mỹ thuật xi măng, tráng men gốm cổ Indochine và đất nung sân vườn.
            </p>

            {/* Feature Highlights */}
            <div className="auth-features-grid">
              <div className="auth-feature-pill">
                <div className="feature-icon">📦</div>
                <div>
                  <strong>270+ Mẫu Gạch</strong>
                  <span>Đồng bộ Supabase Database</span>
                </div>
              </div>

              <div className="auth-feature-pill">
                <div className="feature-icon">⚡</div>
                <div>
                  <strong>Cập Nhật Tồn Kho</strong>
                  <span>Báo giá xuất kho tức thì</span>
                </div>
              </div>

              <div className="auth-feature-pill">
                <div className="feature-icon">📝</div>
                <div>
                  <strong>Cẩm Nang Kiến Trúc</strong>
                  <span>Tự động xuất bản tin tức</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="auth-hero-footer">
            <div className="footer-item">
              <span className="footer-label">Trụ sở & Tổng kho:</span>
              <span className="footer-val">20B Đường số 2, P. Trường Thọ, TP. Thủ Đức</span>
            </div>
            <div className="footer-item">
              <span className="footer-label">Hotline Kỹ Thuật:</span>
              <span className="footer-val">0909.177.415</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          RIGHT COLUMN: Clean Luxury Login Form
          ======================================================== */}
      <div className="admin-auth-panel">
        <div className="admin-auth-container">
          {/* Brand Header */}
          <div className="auth-panel-header">
            <Link href="/" className="auth-logo-wrap" title="Về trang chủ">
              <Image
                src="/images/logo.png"
                alt="Logo Vĩnh Cửu Sài Gòn"
                width={150}
                height={42}
                priority
                style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
              />
            </Link>
            <span className="auth-badge-tag">CMS PORTAL</span>
          </div>

          <div className="auth-heading-area">
            <h1 className="auth-title">Đăng Nhập Quản Trị</h1>
            <p className="auth-subtitle">
              Chào mừng bạn trở lại! Vui lòng nhập tài khoản để truy cập hệ thống.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="auth-error-banner" role="alert">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email Field */}
            <div className="auth-field-group">
              <label htmlFor="login-email" className="auth-label">
                Tài khoản Email
              </label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vinhcuusaigon.vn"
                  required
                  autoComplete="email"
                  className="auth-input"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="auth-field-group">
              <div className="auth-label-row">
                <label htmlFor="login-pass" className="auth-label">
                  Mật khẩu bảo vệ
                </label>
              </div>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input
                  id="login-pass"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="auth-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-eye-btn"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? (
                    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Utility Row */}
            <div className="auth-utility-row">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Ghi nhớ phiên (7 ngày)</span>
              </label>

              <Link href="/" className="auth-back-link">
                ← Về Trang Chủ
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn"
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  <span>Đang Xác Thực...</span>
                </>
              ) : (
                <>
                  <span>Đăng Nhập Vào Bảng Điều Khiển</span>
                  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper Card */}
          <div className="auth-helper-card">
            <div className="helper-header">
              <div className="helper-title">
                <svg width="15" height="15" fill="none" stroke="#0284c7" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>Tài Khoản Quản Trị Hệ Thống</span>
              </div>
              <button
                type="button"
                onClick={handleQuickFill}
                className="helper-autofill-btn"
                title="Bấm để tự động điền tài khoản mẫu"
              >
                📋 Điền nhanh
              </button>
            </div>
            <div className="helper-credentials">
              <div>Email: <code>admin@vinhcuusaigon.vn</code></div>
              <div>Mật khẩu: <code>vcsg@2026</code></div>
            </div>
          </div>

          {/* Security Footer */}
          <div className="auth-security-footer">
            <div className="security-item">
              <svg width="14" height="14" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>Kết Nối Bảo Mật SSL 256-bit</span>
            </div>
            <span className="sep">•</span>
            <span>Supabase Singapore</span>
          </div>
        </div>
      </div>
    </div>
  );
}
