# Hệ Thống Quản Lý & Danh Mục Gạch Bông Gió - Vĩnh Cửu Sài Gòn (VCSG)

Dự án website thương mại & quản trị nội dung (CMS) dành riêng cho thương hiệu **Gạch Bông Gió Vĩnh Cửu Sài Gòn**, xây dựng bằng **Next.js 16 (App Router)** và **Supabase PostgreSQL**.

---

## 🌟 Tính Năng Nổi Bật

- **Toàn bộ bộ sưu tập 270+ mẫu gạch**:
  - Gạch Bông Gió Xi Măng (màu xám tự nhiên & trắng cao cấp)
  - Gạch Bông Gió Gốm Đất Nung (màu đỏ gạch truyền thống)
  - Gạch Bông Gió Tráng Men (xanh đồng, vàng da lươn, da cam)
- **Công cụ Dự Toán & Dự Trù Vật Tư Thông Minh (Brick Calculator)**:
  - Tính chuẩn xác số lượng viên theo m², tỷ lệ hao hụt thi công (3% - 10%), trọng lượng khối xây và dự toán chi phí trọn gói.
- **Trang Chi Tiết Sản Phẩm & Biến Thể Màu Sắc**:
  - Hỗ trợ đổi màu sắc trực quan (Trắng / Xi măng), ảnh sắc nét, kích thước chuẩn xây dựng và xem gạch cùng danh mục.
- **Tạp Chí Kiến Trúc & Bài Viết Chuyên Đề (CMS)**:
  - Hệ thống bài viết chuyên sâu về kiến trúc Indochine, giải pháp chống nóng thông gió và sân vườn biệt thự nghỉ dưỡng.
- **Hệ Thống Quản Trị Hệ Thống (`/admin`)**:
  - Đăng nhập bảo mật HttpOnly Session Cookie.
  - Quản lý danh mục 270+ sản phẩm: tìm kiếm nhanh, lọc theo loại, bật/tắt trạng thái Còn hàng tức thì, thêm/sửa/xóa sản phẩm và upload ảnh trực tiếp lên Supabase Storage bucket.
  - Quản lý bài viết chuyên đề: soạn thảo nội dung, xuất bản/lưu nháp, tải ảnh bài viết.

---

## 🚀 Công Nghệ Sử Dụng

- **Framework**: Next.js 16.4.0 (Turbopack, App Router, SSR & ISR)
- **UI / Styling**: Vanilla CSS Modern Design System (Glassmorphism, Luxury Architecture Theme, Mobile-First Responsive)
- **Cơ Sở Dữ Liệu**: Supabase PostgreSQL (`yxzlcvhprkdctoeqjmrw.supabase.co`)
- **Lưu Trữ Media**: Supabase Storage Bucket (`product-images`)
- **Xác Thực Admin**: Edge-compatible Session Cookie HMAC Token
- **Ngôn Ngữ**: TypeScript 5, React 19

---

## 🛠 Hướng Dẫn Cài Đặt & Chạy Cục Bộ

1. Cài đặt các gói phụ thuộc:
```bash
npm install
```

2. Tạo file cấu hình môi trường `.env.local` (tham khảo `.env.example`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://yxzlcvhprkdctoeqjmrw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_USERNAME=admin@vinhcuusaigon.vn
ADMIN_PASSWORD=vcsg@2026
ADMIN_SESSION_SECRET=vcsg_admin_secret_key_2026_super_secure
```

3. Khởi động máy chủ phát triển:
```bash
npm run dev
```

4. Truy cập giao diện:
- Trang chủ & Tra cứu: [http://localhost:3000](http://localhost:3000)
- Bài viết kiến trúc: [http://localhost:3000/bai-viet](http://localhost:3000/bai-viet)
- Cổng quản trị: [http://localhost:3000/admin](http://localhost:3000/admin) (Đăng nhập: `admin@vinhcuusaigon.vn` / `vcsg@2026`)
