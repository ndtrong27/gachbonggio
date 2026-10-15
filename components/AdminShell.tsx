'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, render clean full page without admin navigation
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    {
      href: '/admin',
      label: 'Tổng Quan',
      active: pathname === '/admin',
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="9" rx="1.5"></rect>
          <rect x="14" y="3" width="7" height="5" rx="1.5"></rect>
          <rect x="14" y="12" width="7" height="9" rx="1.5"></rect>
          <rect x="3" y="16" width="7" height="5" rx="1.5"></rect>
        </svg>
      ),
    },
    {
      href: '/admin/san-pham',
      label: 'Quản Lý Sản Phẩm',
      active: pathname.startsWith('/admin/san-pham'),
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      ),
    },
    {
      href: '/admin/bai-viet',
      label: 'Quản Lý Bài Viết',
      active: pathname.startsWith('/admin/bai-viet'),
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
    },
    {
      href: '/admin/ai-agent',
      label: 'Đào Tạo & Đánh Giá AI',
      active: pathname.startsWith('/admin/ai-agent'),
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="11" width="18" height="10" rx="2"></rect>
          <circle cx="12" cy="5" r="2"></circle>
          <path d="M12 7v4"></path>
          <line x1="8" y1="16" x2="8.01" y2="16"></line>
          <line x1="16" y1="16" x2="16.01" y2="16"></line>
        </svg>
      ),
    },
  ];

  return (
    <div className="admin-shell">
      {/* Top Admin Header */}
      <header className="admin-header">
        <div className="admin-header-container">
          {/* Left Brand & Tabs */}
          <div className="admin-brand-left">
            <Link href="/admin" className="admin-logo-link" title="Về trang tổng quan quản trị">
              <Image
                src="/images/logo.png"
                alt="Logo Vĩnh Cửu Sài Gòn"
                width={130}
                height={36}
                priority
                style={{ height: '34px', width: 'auto', objectFit: 'contain' }}
              />
            </Link>

            <div className="admin-header-divider" aria-hidden="true" />

            <div className="admin-pill-tag">
              <span className="pill-dot" />
              <span>CMS QUẢN TRỊ</span>
            </div>

            <nav className="admin-nav-tabs">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-item ${item.active ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Profile & Actions */}
          <div className="admin-brand-right">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn-external"
              title="Mở website trong tab mới"
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              <span>Xem Website</span>
            </Link>

            <div className="admin-header-divider" aria-hidden="true" />

            <div className="admin-user-profile">
              <div className="admin-user-avatar">
                AD
              </div>
              <div className="admin-user-meta">
                <span className="admin-user-name">Admin VCSG</span>
                <span className="admin-user-role">Quản Trị Viên</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="admin-logout-btn"
              title="Đăng xuất khỏi hệ thống quản trị"
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Đăng Xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="admin-main-container">
        {children}
      </main>
    </div>
  );
}
