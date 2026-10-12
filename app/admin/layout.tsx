import { Metadata } from 'next';
import AdminShell from '@/components/AdminShell';

export const metadata: Metadata = {
  title: 'Hệ Thống Quản Trị CMS | Vĩnh Cửu Sài Gòn',
  description: 'Trang quản lý danh mục sản phẩm, cập nhật giá sỉ và xuất bản bài viết công trình.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
