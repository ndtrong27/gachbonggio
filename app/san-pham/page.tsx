import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/database.types';
import ProductFilterCatalog from '@/components/ProductFilterCatalog';

export const revalidate = 60; // ISR

export const metadata: Metadata = {
  title: 'Tra Cứu & Bộ Sưu Tập 270+ Mẫu Gạch Bông Gió Mỹ Thuật | Vĩnh Cửu Sài Gòn',
  description: 'Tra cứu trực tuyến toàn bộ 270+ mẫu gạch bông gió xi măng, tráng men và đất nung. Lọc theo kích thước 290x290, 190x190, 400x400 mm, tính khối lượng dự toán công trình ngay tức thì. Hotline: 0909.177.415.',
  openGraph: {
    title: 'Tra Cứu & Bộ Sưu Tập 270+ Mẫu Gạch Bông Gió Mỹ Thuật | Vĩnh Cửu Sài Gòn',
    description: 'Kho mẫu gạch thông gió mỹ thuật lớn nhất TP.HCM. Báo giá trực tiếp tại xưởng sản xuất.',
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

  return (
    <div className="catalog-page-wrapper" style={{ minHeight: '85vh', background: '#fdfdfd', paddingBottom: '4rem' }}>
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
