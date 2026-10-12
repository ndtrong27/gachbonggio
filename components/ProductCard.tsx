'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Tables } from '@/types/database.types';

interface ProductCardProps {
  product: Tables<'products'>;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const imageUrl = product.image_url || '/images/placeholder.jpg';

  // Get color style badge
  const getColorBadge = (color: string) => {
    const c = color.toLowerCase();
    if (c.includes('trắng')) return { bg: '#f7fafc', color: '#4a5568', border: '#e2e8f0' };
    if (c.includes('đất nung') || c.includes('đỏ')) return { bg: '#fff5f5', color: '#c53030', border: '#fed7d7' };
    if (c.includes('xanh')) return { bg: '#e6fffa', color: '#234e52', border: '#b2f5ea' };
    if (c.includes('vàng') || c.includes('lươn')) return { bg: '#fffff0', color: '#744210', border: '#fefcbf' };
    return { bg: '#edf2f7', color: '#2d3748', border: '#e2e8f0' };
  };

  const colorBadge = getColorBadge(product.color);

  return (
    <div className="product-card" id={`product-${product.id}`}>
      <Link href={`/san-pham/${product.code || product.id}`} className="product-card-link-wrap">
        <div className="product-image-wrap">
          <span className="product-category-tag">{product.category}</span>
          <span className="product-code-tag">{product.code}</span>
          
          <Image
            src={imageUrl}
            alt={`${product.name} - ${product.code}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            loading={priority ? undefined : "lazy"}
            priority={priority}
            style={{ objectFit: 'cover' }}
          />
        </div>
      </Link>

      <div className="product-info">
        <Link href={`/san-pham/${product.code || product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 className="product-name" title={product.name}>
            {product.name} {product.code !== product.name ? `(${product.code})` : ''}
          </h3>
        </Link>

        <div className="product-meta">
          <div className="product-meta-row">
            <span>Kích thước:</span>
            <strong style={{ color: 'var(--secondary-dark)' }}>{product.size}</strong>
          </div>
          <div className="product-meta-row">
            <span>Màu sắc:</span>
            <span
              style={{
                backgroundColor: colorBadge.bg,
                color: colorBadge.color,
                border: `1px solid ${colorBadge.border}`,
                padding: '0.1rem 0.45rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'capitalize'
              }}
            >
              {product.color}
            </span>
          </div>
        </div>

        <div className="product-price-row">
          <Link
            href={`/san-pham/${product.code || product.id}`}
            className="btn btn-outline"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
          >
            Chi Tiết &rarr;
          </Link>
          <a
            href={`https://zalo.me/0909177415?text=${encodeURIComponent(`Chào Vĩnh Cửu Sài Gòn! Tôi muốn nhận báo giá sản phẩm ${product.name} (${product.code})`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem' }}
          >
            Báo Giá
          </a>
        </div>
      </div>
    </div>
  );
}
