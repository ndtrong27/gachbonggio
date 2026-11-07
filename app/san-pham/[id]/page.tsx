import { cache } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/database.types';
import { parseProductDimensions } from '@/lib/calculator';
import ProductDetailClient from './ProductDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 3600; // ISR 1 giờ (kết hợp On-Demand Revalidation khi cập nhật từ Admin)
export const dynamicParams = true;

export async function generateStaticParams() {
  const { data } = await supabase
    .from('products')
    .select('id, code');

  if (!data) return [];

  const seen = new Set<string>();
  const params: { id: string }[] = [];

  for (const row of data) {
    const key = (row.code || String(row.id)).trim();
    if (key && !seen.has(key)) {
      seen.add(key);
      params.push({ id: key });
    }
  }

  return params;
}

interface ProductWithVariants {
  product: Tables<'products'>;
  colorVariants: Tables<'products'>[];
}

const getProductWithVariants = cache(async (idOrCode: string): Promise<ProductWithVariants | null> => {
  const decoded = decodeURIComponent(idOrCode).trim();
  const isNumeric = /^\d+$/.test(decoded);

  if (isNumeric) {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', parseInt(decoded, 10))
      .maybeSingle();

    if (data) {
      const product = data as Tables<'products'>;
      const { data: variants } = await supabase
        .from('products')
        .select('*')
        .eq('code', product.code)
        .order('id', { ascending: true });

      return {
        product,
        colorVariants: (variants as Tables<'products'>[]) || [product],
      };
    }
  }

  // Khi truy cập bằng mã sản phẩm (99% trường hợp): lấy cả sản phẩm và toàn bộ biến thể màu chỉ trong 1 truy vấn
  const { data: codeData } = await supabase
    .from('products')
    .select('*')
    .eq('code', decoded)
    .order('id', { ascending: true });

  if (codeData && codeData.length > 0) {
    const variants = codeData as Tables<'products'>[];
    return {
      product: variants[0],
      colorVariants: variants,
    };
  }

  // Fallback case-insensitive
  const { data: fallbackData } = await supabase
    .from('products')
    .select('*')
    .ilike('code', decoded)
    .order('id', { ascending: true });

  if (fallbackData && fallbackData.length > 0) {
    const variants = fallbackData as Tables<'products'>[];
    return {
      product: variants[0],
      colorVariants: variants,
    };
  }

  return null;
});

const getRelatedProducts = cache(async (category: string, currentCode: string, currentId: number): Promise<Tables<'products'>[]> => {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('code', currentCode)
    .neq('id', currentId)
    .limit(4);

  return (data as Tables<'products'>[]) || [];
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gachbonggio.vercel.app';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getProductWithVariants(id);

  if (!result) {
    return {
      title: 'Không tìm thấy sản phẩm | Vĩnh Cửu Sài Gòn',
    };
  }

  const { product } = result;
  const title = `${product.name} - ${product.code} | Gạch Bông Gió Vĩnh Cửu Sài Gòn`;
  const description = `Chi tiết ${product.name} (${product.code}), quy cách ${product.size || 'chuẩn'}, màu ${product.color || 'tự nhiên'}. Phân phối sỉ lẻ giá tận xưởng sản xuất Vĩnh Cửu Sài Gòn. Hotline: 0909.177.415.`;
  const productUrl = `${siteUrl}/san-pham/${encodeURIComponent(product.code || product.id.toString())}`;

  return {
    title,
    description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title,
      description,
      url: productUrl,
      type: 'website',
      images: product.image_url ? [{ url: product.image_url, width: 800, height: 800, alt: product.name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getProductWithVariants(id);

  if (!result) {
    notFound();
  }

  const { product, colorVariants } = result;
  const relatedProducts = await getRelatedProducts(product.category, product.code, product.id);
  const dims = parseProductDimensions(product.size, product.category);

  // Anchor link based on category
  let categoryAnchor = '#xi-mang';
  if (product.category === 'Bông gió tráng men') categoryAnchor = '#trang-men';
  if (product.category === 'Bông gió đất nung') categoryAnchor = '#dat-nung';

  const productUrl = `${siteUrl}/san-pham/${encodeURIComponent(product.code || product.id.toString())}`;

  // Rich Product & Breadcrumbs Structured Data (JSON-LD)
  const productJsonLd = {
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
            'name': product.category,
            'item': `${siteUrl}/${categoryAnchor}`,
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': `${product.name} (${product.code})`,
            'item': productUrl,
          },
        ],
      },
      {
        '@type': 'Product',
        '@id': `${productUrl}#product`,
        'name': `${product.name} - ${product.code}`,
        'image': product.image_url ? [product.image_url] : [],
        'description': `Mẫu gạch bông gió mỹ thuật ${product.name} (${product.code}), dòng ${product.category}, quy cách ${product.size || 'chuẩn'}, màu ${product.color || 'tự nhiên'}.`,
        'sku': product.code,
        'mpn': product.code,
        'brand': {
          '@type': 'Brand',
          'name': 'Vĩnh Cửu Sài Gòn',
        },
        'category': product.category,
        'offers': {
          '@type': 'Offer',
          'url': productUrl,
          'priceCurrency': 'VND',
          'price': product.price || 25000,
          'priceValidUntil': '2027-12-31',
          'itemCondition': 'https://schema.org/NewCondition',
          'availability': product.in_stock !== false ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
          'seller': {
            '@type': 'Organization',
            'name': 'Vĩnh Cửu Sài Gòn',
          },
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.9',
          'reviewCount': '86',
        },
        'additionalProperty': [
          {
            '@type': 'PropertyValue',
            'name': 'Quy cách kích thước',
            'value': product.size || dims.sizeLabel || `${dims.widthMm}x${dims.heightMm}x${dims.thicknessMm} mm`,
          },
          {
            '@type': 'PropertyValue',
            'name': 'Màu sắc',
            'value': product.color || 'Tự nhiên',
          },
          {
            '@type': 'PropertyValue',
            'name': 'Dòng sản phẩm',
            'value': product.category,
          },
        ],
      },
    ],
  };

  return (
    <div className="product-detail-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        suppressHydrationWarning
      />

      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="detail-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Trang Chủ</Link>
          <span className="crumb-sep">/</span>
          <Link href={`/${categoryAnchor}`}>{product.category}</Link>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">{product.name} ({product.code})</span>
        </nav>

        {/* Client-Interactive Product Detail View */}
        <ProductDetailClient
          product={product}
          colorVariants={colorVariants}
          dimensions={dims}
          relatedProducts={relatedProducts}
          categoryAnchor={categoryAnchor}
        />
      </div>
    </div>
  );
}
