import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/database.types';
import ProductFilterCatalog from '@/components/ProductFilterCatalog';

export const revalidate = 60; // ISR

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gachbonggio.vercel.app';

export const metadata: Metadata = {
  title: 'Tra Cứu & Bộ Sưu Tập 270+ Mẫu Gạch Bông Gió Mỹ Thuật',
  description: 'Tra cứu trực tuyến toàn bộ 270+ mẫu gạch bông gió xi măng, tráng men và đất nung. Lọc theo kích thước 290x290, 190x190, 400x400 mm, tính khối lượng dự toán công trình ngay tức thì. Hotline: 0909.177.415.',
  alternates: {
    canonical: '/san-pham',
  },
  openGraph: {
    title: 'Tra Cứu & Bộ Sưu Tập 270+ Mẫu Gạch Bông Gió Mỹ Thuật | Vĩnh Cửu Sài Gòn',
    description: 'Kho mẫu gạch thông gió mỹ thuật lớn nhất TP.HCM. Báo giá trực tiếp tại xưởng sản xuất, hỗ trợ dự toán số lượng gạch mảng tường chuẩn xác.',
    url: `${siteUrl}/san-pham`,
    type: 'website',
    images: [
      {
        url: '/images/banners/banner-6.jpg',
        width: 1200,
        height: 630,
        alt: 'Bộ sưu tập 270+ mẫu gạch bông gió mỹ thuật',
      },
    ],
  },
};

async function getAllProducts(): Promise<Tables<'products'>[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  if (error || !data) {
    console.error('Lỗi truy vấn sản phẩm:', error);
    return [];
  }

  return data as Tables<'products'>[];
}

export default async function SanPhamIndexPage() {
  const products = await getAllProducts();

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Trang Chủ',
            'item': siteUrl,
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Tra Cứu Sản Phẩm & Dự Toán',
            'item': `${siteUrl}/san-pham`,
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        'name': 'Bộ Sưu Tập 270+ Mẫu Gạch Bông Gió Mỹ Thuật',
        'description': 'Tra cứu chi tiết và dự toán số lượng gạch bông gió xi măng, tráng men và đất nung.',
        'url': `${siteUrl}/san-pham`,
        'mainEntity': {
          '@type': 'ItemList',
          'numberOfItems': products.length,
          'itemListElement': products.slice(0, 24).map((p, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'name': `${p.name} (${p.code})`,
            'url': `${siteUrl}/san-pham/${encodeURIComponent(p.code || p.id.toString())}`,
          })),
        },
      },
    ],
  };

  return (
    <div className="catalog-page-wrapper" style={{ minHeight: '85vh', background: '#fdfdfd', paddingBottom: '4rem' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
        suppressHydrationWarning
      />

      <div className="container" style={{ paddingTop: '1.75rem', paddingBottom: '1rem' }}>
        <nav className="detail-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Trang Chủ</Link>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">Tra Cứu & Toàn Bộ Bộ Sưu Tập Sản Phẩm</span>
        </nav>
      </div>

      <ProductFilterCatalog
        products={products}
        title="Tra Cứu & Dự Toán 270+ Mẫu Gạch Bông Gió"
        subtitle="Tìm kiếm theo mã sản phẩm, kích thước (290x290, 190x190, 400x400), màu men và tính khối lượng gạch thi công chuẩn xác"
      />
    </div>
  );
}
