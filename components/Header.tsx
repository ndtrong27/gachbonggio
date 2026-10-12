import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="site-header">
      {/* Top bar info */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-bar-contact">
            <span>📍 20B Đường số 2, P. Trường Thọ, TP. Thủ Đức, TP.HCM</span>
            <a href="tel:0909177415">📞 Hotline: 0909.177.415</a>
          </div>
          <div>
            <span>🕒 Giờ mở cửa: 07:30 - 17:30 (Thứ 2 - Thứ 7)</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container nav-inner">
        <Link href="/" className="logo-brand" title="Vĩnh Cửu Sài Gòn - Gạch Bông Gió Mỹ Thuật">
          <Image
            src="/images/logo.png"
            alt="Logo Vĩnh Cửu Sài Gòn"
            width={160}
            height={64}
            priority
            style={{ height: '46px', width: 'auto', objectFit: 'contain' }}
          />
        </Link>

        <nav className="main-nav">
          <Link href="/" className="nav-link">Trang Chủ</Link>
          <Link href="/san-pham" className="nav-link highlight-nav-link">Tra Cứu & Dự Toán</Link>
          <Link href="/#xi-mang" className="nav-link">Bông Gió Xi Măng</Link>
          <Link href="/#trang-men" className="nav-link">Bông Gió Tráng Men</Link>
          <Link href="/#dat-nung" className="nav-link">Bông Gió Đất Nung</Link>
          <Link href="/#bai-viet" className="nav-link">Bài Viết</Link>
        </nav>

        <div className="nav-actions">
          <Link href="/san-pham" className="btn btn-outline nav-calc-shortcut" title="Công cụ dự toán số lượng gạch mảng tường">
            <span>📐 Dự Toán</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
