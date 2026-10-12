import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/database.types';
import CategoryCard from '@/components/CategoryCard';
import ArticleCard from '@/components/ArticleCard';
import HeroVisualSlider, { HeroSlideItem } from '@/components/HeroVisualSlider';
import ProductShowcaseLayout from '@/components/ProductShowcaseLayout';
import { getPublishedArticles } from '@/lib/articles';

// Server-side Data Fetching directly from Supabase
async function getProducts() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  if (error || !products) {
    console.error('Lỗi truy vấn sản phẩm từ Supabase:', error);
    return [];
  }

  return products as Tables<'products'>[];
}

export const revalidate = 60; // ISR 60 seconds

export default async function HomePage() {
  const [allProducts, articles] = await Promise.all([
    getProducts(),
    getPublishedArticles(),
  ]);

  const xiMangProducts = allProducts.filter(p => p.category === 'Bông gió xi măng');
  const trangMenProducts = allProducts.filter(p => p.category === 'Bông gió tráng men');
  const datNungProducts = allProducts.filter(p => p.category === 'Bông gió đất nung');

  // Priority products for the first 4 slots (matching the showcase design), followed by remaining products
  const xiMangFeaturedCodes = ['VCB30-029', 'VCB30-029-X', 'VCB30-028', 'VCB30-028-X'];
  const xiMangTop4 = xiMangFeaturedCodes
    .map(c => xiMangProducts.find(p => p.code === c))
    .filter(Boolean) as Tables<'products'>[];
  const xiMangRemaining = xiMangProducts.filter(p => !xiMangFeaturedCodes.includes(p.code));
  const sortedXiMang = [...xiMangTop4, ...xiMangRemaining];

  const trangMenFeaturedCodes = ['VCSG-TG-B40', 'VCSG-TG-B40-V', 'VCSG-TG-TV20', 'VCSG-TG-TV30'];
  const trangMenTop4 = trangMenFeaturedCodes
    .map(c => trangMenProducts.find(p => p.code === c))
    .filter(Boolean) as Tables<'products'>[];
  const trangMenRemaining = trangMenProducts.filter(p => !trangMenFeaturedCodes.includes(p.code));
  const sortedTrangMen = [...trangMenTop4, ...trangMenRemaining];

  const datNungFeaturedCodes = ['VCSG-TG-B40', 'VCSG-TG-U30', 'VCSG-TG-C30', 'VCSG-TG-V30'];
  const datNungTop4 = datNungFeaturedCodes
    .map(c => datNungProducts.find(p => p.code === c))
    .filter(Boolean) as Tables<'products'>[];
  const datNungRemaining = datNungProducts.filter(p => !datNungFeaturedCodes.includes(p.code));
  const sortedDatNung = [...datNungTop4, ...datNungRemaining];

  const heroSlides: HeroSlideItem[] = [
    {
      id: 'slide-xi-mang',
      category: 'Bông gió xi măng',
      badge: 'Bông Gió Xi Măng • 2026',
      name: 'Bộ Sưu Tập Gạch Bông Gió Xi Măng Mỹ Thuật',
      subtitle: '250+ mẫu hoa văn ép tĩnh mác cao • Chống tạt mưa & cản nắng hướng Tây',
      imageUrl: '/images/showcase_bong_gio_xi_mang.png',
      tag: 'Xem danh mục',
      link: '#xi-mang',
    },
    {
      id: 'slide-trang-men',
      category: 'Bông gió tráng men',
      badge: 'Bông Gió Tráng Men • Indochine',
      name: 'Bộ Sưu Tập Bông Gió Tráng Men Gốm Cổ',
      subtitle: 'Nung 1200°C bền màu ngọc • Men xanh đồng cổ & vàng da lươn',
      imageUrl: '/images/showcase_bong_gio_trang_men.png',
      tag: 'Xem danh mục',
      link: '#trang-men',
    },
    {
      id: 'slide-dat-nung',
      category: 'Bông gió đất nung',
      badge: 'Bông Gió Đất Nung • Truyền Thống',
      name: 'Bộ Sưu Tập Bông Gió Đất Nung Mộc Mạc',
      subtitle: 'Đất sét nung tự nhiên • Đậm nét kiến trúc Đông Dương & sân vườn biệt thự',
      imageUrl: '/images/showcase_bong_gio_dat_nung.png',
      tag: 'Xem danh mục',
      link: '#dat-nung',
    },
  ];

  return (
    <>
      {/* 1. HERO BANNER */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <div className="hero-tag">
              <span>★</span> Nhà Cung Cấp Gạch Bông Gió Hàng Đầu
            </div>
            <h1 className="hero-title">
              Nghệ Thuật Đón Gió & Lấy Sáng <span>Đỉnh Cao Kiến Trúc</span>
            </h1>
            <p className="hero-desc">
              Khám phá bộ sưu tập <strong>{allProducts.length || 274}+ mẫu gạch bông gió mỹ thuật</strong> chất lượng cao: từ xi măng hiện đại, tráng men ngọc cổ điển đến đất nung mộc mạc. Báo giá trực tiếp tận xưởng sản xuất.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="#xi-mang" className="btn btn-primary" style={{ padding: '0.85rem 1.8rem', fontSize: '1rem' }}>
                Khám Phá Bộ Sưu Tập
              </a>
              <a href="tel:0909177415" className="btn btn-outline" style={{ padding: '0.85rem 1.8rem', fontSize: '1rem' }}>
                📞 Hotline: 0909.177.415
              </a>
            </div>

            <div className="hero-stats">
              <div className="hero-stat-item">
                <h4>{allProducts.length || 274}+</h4>
                <p>Mẫu mã hoa văn</p>
              </div>
              <div className="hero-stat-item">
                <h4>100%</h4>
                <p>Giá xuất xưởng</p>
              </div>
              <div className="hero-stat-item">
                <h4>24/7</h4>
                <p>Giao hàng toàn quốc</p>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <HeroVisualSlider slides={heroSlides} intervalMs={4000} />
          </div>
        </div>
      </section>

      {/* 2. CATEGORY SELECTOR */}
      <section className="section-padding" style={{ background: '#ffffff' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Phân Loại Sản Phẩm</span>
            <h2 className="section-title">3 Dòng Gạch Bông Gió Tiêu Biểu</h2>
            <p className="section-subtitle">
              Đa dạng chất liệu và kích thước, đáp ứng mọi phong cách từ nhà phố hiện đại, biệt thự sân vườn đến resort cao cấp.
            </p>
          </div>

          <div className="category-grid">
            <CategoryCard
              id="xi-mang"
              name="Bông Gió Xi Măng"
              count={xiMangProducts.length || 250}
              description="Chế tác từ xi măng ép tĩnh cường độ cao. Bền bỉ với thời tiết, hoa văn hình học phong phú, giá thành tối ưu nhất."
              badge="Phổ biến nhất"
              iconBg="#edf2f7"
              icon="🧱"
            />
            <CategoryCard
              id="trang-men"
              name="Bông Gió Tráng Men"
              count={trangMenProducts.length || 15}
              description="Nung ở nhiệt độ cao với lớp men gốm thủ công: xanh đồng cổ & vàng da lươn. Bề mặt bóng loáng, chống rêu mốc vĩnh cửu."
              badge="Cao cấp sang trọng"
              iconBg="#e6fffa"
              icon="✨"
            />
            <CategoryCard
              id="dat-nung"
              name="Bông Gió Đất Nung"
              count={datNungProducts.length || 9}
              description="Sản xuất từ đất sét nung tự nhiên mang sắc đỏ ấm cúng, đậm nét kiến trúc truyền thống Đông Dương và Á Đông."
              badge="Mộc mạc ấm áp"
              iconBg="#fff5f5"
              icon="🏺"
            />
          </div>
        </div>
      </section>

      {/* 3. SHOWCASE: BÔNG GIÓ XI MĂNG (THEO MẪU THIẾT KẾ WIREFRAME) */}
      <ProductShowcaseLayout
        id="xi-mang"
        theme="xi-mang"
        badgeText="BỘ SƯU TẬP 2026 • 250+ MẪU"
        titleLine1="GẠCH BÔNG GIÓ"
        titleLine2="XI MĂNG MỸ THUẬT"
        bulletPoints={[
          "Ép tĩnh thủy lực mác cao chịu lực",
          "Chống tạt mưa, cản nắng hướng Tây",
          "Có sẵn 2 tông màu: Trắng & Xám xi măng"
        ]}
        hotlineText="HOTLINE TƯ VẤN: 0909.177.415"
        hotlinePhone="0909177415"
        banner1={{
          imageUrl: "/images/banners/banner-9.jpg",
          caption: "Mặt tiền nhà phố đón gió hiện đại",
          alt: "Mặt tiền nhà phố gạch bông gió xi măng"
        }}
        banner2={{
          imageUrl: "/images/banners/banner-10.jpg",
          caption: "Tường rào bông gió bọt nước sang trọng",
          alt: "Tường rào bông gió bọt nước xi măng"
        }}
        dividerText="—  BỘ SƯU TẬP BÔNG GIÓ XI MĂNG TIÊU BIỂU XUẤT XƯỞNG  —"
        products={sortedXiMang}
        totalCount={xiMangProducts.length}
      />

      {/* 4. SHOWCASE: BÔNG GIÓ TRÁNG MEN GỐM CỔ (THEO MẪU THIẾT KẾ WIREFRAME) */}
      <ProductShowcaseLayout
        id="trang-men"
        theme="trang-men"
        badgeText="GỐM CỔ THỦ CÔNG • INDOCHINE"
        titleLine1="GẠCH BÔNG GIÓ"
        titleLine2="TRÁNG MEN CAO CẤP"
        bulletPoints={[
          "Nung 1200°C lớp men bóng ngọc vĩnh cửu",
          "Kháng rêu mốc & chống thấm nước 100%",
          "Sắc men: Xanh đồng cổ & Vàng da lươn"
        ]}
        hotlineText="HOTLINE TƯ VẤN: 0909.177.415"
        hotlinePhone="0909177415"
        banner1={{
          imageUrl: "/images/banners/banner-6.jpg",
          caption: "Vách ngăn men xanh đồng đẳng cấp Indochine",
          alt: "Vách ngăn gạch bông gió tráng men xanh đồng"
        }}
        banner2={{
          imageUrl: "/images/banners/banner-8.jpg",
          caption: "Cận cảnh hoa văn gốm sứ chạm khắc tinh xảo",
          alt: "Cận cảnh gạch bông gió tráng men hoa bưởi"
        }}
        dividerText="—  BỘ SƯU TẬP BÔNG GIÓ TRÁNG MEN GỐM CỔ TIÊU BIỂU  —"
        products={sortedTrangMen}
        totalCount={trangMenProducts.length}
      />

      {/* 5. SHOWCASE: BÔNG GIÓ ĐẤT NUNG TRUYỀN THỐNG (THEO MẪU THIẾT KẾ WIREFRAME) */}
      <ProductShowcaseLayout
        id="dat-nung"
        theme="dat-nung"
        badgeText="ĐẤT SÉT NUNG 100% • MỘC MẠC"
        titleLine1="GẠCH THÔNG GIÓ"
        titleLine2="ĐẤT NUNG TRUYỀN THỐNG"
        bulletPoints={[
          "Sắc đỏ cam đất nung tự nhiên ấm áp",
          "Thân thiện môi trường, lưu thông khí tối ưu",
          "Phù hợp cảnh quan sân vườn, biệt thự vườn"
        ]}
        hotlineText="HOTLINE TƯ VẤN: 0909.177.415"
        hotlinePhone="0909177415"
        banner1={{
          imageUrl: "/images/banners/banner-7.jpg",
          caption: "Khung cửa tròn đất nung nhà hàng mộc mạc",
          alt: "Khung cửa tròn gạch thông gió đất nung"
        }}
        banner2={{
          imageUrl: "/images/banners/banner-3.jpg",
          caption: "Giếng trời cầu thang đón nắng nghệ thuật",
          alt: "Giếng trời cầu thang gạch thông gió đất nung"
        }}
        dividerText="—  BỘ SƯU TẬP BÔNG GIÓ ĐẤT NUNG TRUYỀN THỐNG TIÊU BIỂU  —"
        products={sortedDatNung}
        totalCount={datNungProducts.length}
      />

      {/* 6. ARTICLES SHOWCASE SECTION */}
      <section id="bai-viet" className="section-padding" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Kiến Thức & Cảm Hứng</span>
            <h2 className="section-title">Bài Viết Tiêu Biểu Theo Dòng Sản Phẩm</h2>
            <p className="section-subtitle">
              Chia sẻ kinh nghiệm thiết kế mặt tiền, chống nóng và ứng dụng gạch bông gió mỹ thuật trong kiến trúc thực tế.
            </p>
          </div>

          <div className="article-grid">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA SECTION */}
      <section className="section-padding" style={{ background: 'linear-gradient(135deg, var(--secondary-dark) 0%, #1a202c 100%)', color: 'white', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.08em', display: 'block', marginBottom: '0.75rem' }}>
            Hỗ Trợ Dự Án & Công Trình
          </span>
          <h2 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '1.25rem' }}>
            Bạn Cần Tư Vấn Mẫu Gạch Hay Nhận Báo Giá Sỉ?
          </h2>
          <p style={{ color: '#cbd5e0', fontSize: '1.125rem', marginBottom: '2.25rem', lineHeight: '1.7' }}>
            Đội ngũ kỹ thuật viên và kiến trúc sư của chúng tôi luôn sẵn sàng hỗ trợ bạn tính toán số lượng viên theo m², giải pháp chống tạt mưa và phối cảnh 3D mặt tiền hoàn toàn miễn phí.
          </p>

          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:0909177415" className="btn btn-primary" style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem' }}>
              📞 Gọi Ngay: 0909.177.415
            </a>
            <a href="https://zalo.me/0909177415" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)', padding: '0.9rem 2.2rem', fontSize: '1.05rem' }}>
              Nhắn Zalo Tư Vấn
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
