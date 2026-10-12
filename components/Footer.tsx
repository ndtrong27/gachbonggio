import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Info */}
          <div className="footer-col">
            <div style={{ marginBottom: '1.25rem', display: 'inline-block', background: '#ffffff', padding: '8px 16px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              <Image
                src="/images/logo.png"
                alt="Logo Vĩnh Cửu Sài Gòn"
                width={160}
                height={64}
                style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
              />
            </div>
            <p style={{ color: '#a0aec0', marginBottom: '1.25rem', fontSize: '0.9375rem', lineHeight: '1.7' }}>
              Chuyên sản xuất và phân phối gạch bông gió mỹ thuật chất lượng cao: bông gió xi măng, bông gió tráng men gốm cổ, bông gió đất nung truyền thống. Cam kết giá xuất xưởng tốt nhất thị trường.
            </p>
            <p style={{ color: '#e2e8f0', fontSize: '0.875rem' }}>
              📍 <strong>Địa chỉ:</strong> 20B đường số 2, P. Trường Thọ, TP. Thủ Đức, TP.HCM<br />
              📞 <strong>Hotline:</strong> 0909.177.415<br />
              ✉️ <strong>Email:</strong> vinhcuusaigon@gmail.com<br />
              🌐 <strong>Website:</strong> gachbonggio.net
            </p>
          </div>

          {/* Column 2: Danh mục */}
          <div className="footer-col">
            <h3>DÒNG SẢN PHẨM</h3>
            <ul className="footer-links">
              <li><Link href="/#xi-mang">Bông Gió Xi Măng (250+ mẫu)</Link></li>
              <li><Link href="/#trang-men">Bông Gió Tráng Men (15 mẫu)</Link></li>
              <li><Link href="/#dat-nung">Bông Gió Đất Nung (9 mẫu)</Link></li>
              <li><Link href="/#xi-mang">Gạch Thông Gió Chắn Mưa</Link></li>
              <li><Link href="/#xi-mang">Gạch Bánh Ú Chắn Mưa</Link></li>
            </ul>
          </div>

          {/* Column 3: Bài viết & Tư vấn */}
          <div className="footer-col">
            <h3>BÀI VIẾT & TƯ VẤN</h3>
            <ul className="footer-links">
              <li><Link href="/bai-viet/giai-phap-chong-nong-thong-gio-gach-bong-gio-xi-mang">Chống nóng nhà phố bằng bông gió</Link></li>
              <li><Link href="/bai-viet/kien-truc-indochine-gach-bong-gio-trang-men-gom-co">Kiến trúc Indochine bông gió men cổ</Link></li>
              <li><Link href="/bai-viet/gach-thong-gio-dat-nung-san-vuon-nha-nghi-duong">Bông gió đất nung sân vườn mộc mạc</Link></li>
              <li><Link href="/#bai-viet">Tất cả bài viết kiến trúc</Link></li>
              <li><a href="tel:0909177415">Yêu cầu bảng giá sỉ công trình</a></li>
            </ul>
          </div>

          {/* Column 4: Hotline & Giờ làm việc */}
          <div className="footer-col">
            <h3>TƯ VẤN & BÁO GIÁ</h3>
            <p style={{ color: '#a0aec0', fontSize: '0.9375rem', marginBottom: '1rem' }}>
              Nhận tư vấn thiết kế mặt tiền & phối cảnh gạch bông gió miễn phí từ kiến trúc sư.
            </p>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                0909.177.415
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#cbd5e0' }}>
                Hỗ trợ tư vấn Zalo / Điện thoại 24/7
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Vĩnh Cửu Sài Gòn. Toàn bộ bản quyền được bảo lưu. Thiết kế & phát triển bởi Antigravity.</p>
        </div>
      </div>
    </footer>
  );
}
