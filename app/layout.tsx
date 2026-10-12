import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Gạch Bông Gió Mỹ Thuật | Vĩnh Cửu Sài Gòn - 274+ Mẫu Giá Xuất Xưởng",
  description: "Tổng kho phân phối gạch bông gió xi măng, gạch bông gió tráng men và gạch thông gió đất nung chất lượng cao. Báo giá trực tiếp tận xưởng, giao hàng toàn quốc.",
  keywords: [
    "gạch bông gió",
    "gạch thông gió",
    "gạch bông gió xi măng",
    "gạch bông gió tráng men",
    "gạch bông gió đất nung",
    "gạch bánh ú",
    "vĩnh cửu sài gòn"
  ],
  authors: [{ name: "Vĩnh Cửu Sài Gòn" }],
  creator: "Vĩnh Cửu Sài Gòn",
  metadataBase: new URL("https://gachbonggio.net"),
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Gạch Bông Gió Mỹ Thuật Cao Cấp | Vĩnh Cửu Sài Gòn",
    description: "Bộ sưu tập 274+ mẫu gạch bông gió kiến trúc xi măng, tráng men, đất nung. Tư vấn phối cảnh mặt tiền miễn phí.",
    url: "https://gachbonggio.net",
    siteName: "Vĩnh Cửu Sài Gòn",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/images/banners/banner-9.jpg",
        width: 1200,
        height: 630,
        alt: "Gạch bông gió Vĩnh Cửu Sài Gòn",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Vĩnh Cửu Sài Gòn",
    "image": "https://gachbonggio.net/images/logo.png",
    "telephone": "0909.177.415",
    "email": "vinhcuusaigon@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "20B đường số 2, P. Trường Thọ",
      "addressLocality": "TP. Thủ Đức",
      "addressRegion": "TP. HCM",
      "addressCountry": "VN"
    },
    "url": "https://gachbonggio.net/"
  };

  return (
    <html lang="vi" suppressHydrationWarning data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        <script
          id="schema-org-graph"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          suppressHydrationWarning
        />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
