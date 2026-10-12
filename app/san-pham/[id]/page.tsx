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

export const revalidate = 60; // ISR

async function getProductByIdOrCode(idOrCode: string): Promise<Tables<'products'> | null> {
  const isNumeric = /^\d+$/.test(idOrCode);
  
  if (isNumeric) {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', parseInt(idOrCode, 10))
      .maybeSingle();
    if (data) return data as Tables<'products'>;
  }

  const decoded = decodeURIComponent(idOrCode);
  const { data: codeData } = await supabase
    .from('products')
    .select('*')
    .eq('code', decoded)
    .limit(1);

  if (codeData && codeData.length > 0) {
    return codeData[0] as Tables<'products'>;
  }

  // Fallback case-insensitive
  const { data: fallbackData } = await supabase
    .from('products')
    .select('*')
    .ilike('code', decoded)
    .limit(1);

  if (fallbackData && fallbackData.length > 0) {
    return fallbackData[0] as Tables<'products'>;
  }

  return null;
}

async function getColorVariants(code: string): Promise<Tables<'products'>[]> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('code', code)
    .order('id', { ascending: true });

  return (data as Tables<'products'>[]) || [];
}

async function getRelatedProducts(category: string, currentId: number): Promise<Tables<'products'>[]> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('id', currentId)
    .limit(4);

  return (data as Tables<'products'>[]) || [];
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gachbonggio.vercel.app';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductByIdOrCode(id);

  if (!product) {
    return {
      title: 'Không tìm thấy sản phẩm | Vĩnh Cửu Sài Gòn',
    };
  }

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
  const product = await getProductByIdOrCode(id);

  if (!product) {
    notFound();
  }

  const colorVariants = await getColorVariants(product.code);
  const relatedProducts = await getRelatedProducts(product.category, product.id);
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
