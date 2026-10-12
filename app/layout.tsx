import type { Metadata } from "next";
import { Be_Vietnam_Pro, Outfit } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gachbonggio.vercel.app";


export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Gạch Bông Gió Mỹ Thuật | Vĩnh Cửu Sài Gòn - 274+ Mẫu Giá Xuất Xưởng",
    template: "%s | Vĩnh Cửu Sài Gòn",
  },
  description: "Tổng kho phân phối gạch bông gió xi măng, gạch bông gió tráng men và gạch thông gió đất nung chất lượng cao. Báo giá trực tiếp tận xưởng, tư vấn phối cảnh & dự toán số lượng gạch mảng tường miễn phí.",
  keywords: [
    "gạch bông gió",
    "gạch thông gió",
    "gạch bông gió xi măng",
    "gạch bông gió tráng men",
    "gạch bông gió đất nung",
    "gạch bánh ú",
    "gạch thông gió chống mưa",
    "vĩnh cửu sài gòn",
    "báo giá gạch bông gió",
    "kích thước gạch bông gió"
  ],
  authors: [{ name: "Vĩnh Cửu Sài Gòn", url: siteUrl }],
  creator: "Vĩnh Cửu Sài Gòn",
  publisher: "Vĩnh Cửu Sài Gòn",
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Gạch Bông Gió Mỹ Thuật Cao Cấp | Vĩnh Cửu Sài Gòn",
    description: "Bộ sưu tập 274+ mẫu gạch bông gió kiến trúc xi măng, tráng men, đất nung. Tra cứu thông số, tính số lượng gạch tự động và nhận báo giá xuất xưởng.",
    url: siteUrl,
    siteName: "Vĩnh Cửu Sài Gòn",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/images/banners/banner-9.jpg",
        width: 1200,
        height: 630,
        alt: "Gạch bông gió mỹ thuật Vĩnh Cửu Sài Gòn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gạch Bông Gió Mỹ Thuật Cao Cấp | Vĩnh Cửu Sài Gòn",
    description: "274+ mẫu gạch bông gió xi măng, tráng men, đất nung giá xuất xưởng tại TP.HCM.",
    images: ["/images/banners/banner-9.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaOrgGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "Gạch Bông Gió Vĩnh Cửu Sài Gòn",
        "description": "Kho phân phối gạch bông gió mỹ thuật kiến trúc xi măng, tráng men, đất nung chất lượng cao.",
        "publisher": {
          "@id": `${siteUrl}/#organization`,
        },
        "inLanguage": "vi-VN",
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${siteUrl}/san-pham?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": "Vĩnh Cửu Sài Gòn",
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/images/logo.png`,
          "width": 160,
          "height": 64,
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+84-909-177-415",
          "contactType": "sales",
          "areaServed": "VN",
          "availableLanguage": "Vietnamese",
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": `${siteUrl}/#localbusiness`,
        "name": "Vĩnh Cửu Sài Gòn - Gạch Bông Gió Mỹ Thuật",
        "image": `${siteUrl}/images/logo.png`,
        "telephone": "0909.177.415",
        "email": "vinhcuusaigon@gmail.com",
        "priceRange": "15.000đ - 65.000đ",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "20B Đường số 2, P. Trường Thọ",
          "addressLocality": "TP. Thủ Đức",
          "addressRegion": "TP. Hồ Chí Minh",
          "addressCountry": "VN",
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 10.8447,
          "longitude": 106.7588,
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "07:30",
            "closes": "17:30",
          },
        ],
        "url": siteUrl,
      },
    ],
  };

  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${outfit.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://yxzlcvhprkdctoeqjmrw.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://yxzlcvhprkdctoeqjmrw.supabase.co" />
      </head>
      <body suppressHydrationWarning>
        <script
          id="schema-org-graph"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgGraph) }}
          suppressHydrationWarning
        />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}

