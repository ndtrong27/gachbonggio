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

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.image_url ? [{ url: product.image_url }] : [],
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

  return (
    <div className="product-detail-page">
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
