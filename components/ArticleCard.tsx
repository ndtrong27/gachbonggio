import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/data/articles';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="article-card" id={`article-${article.id}`}>
      <Link href={`/bai-viet/${article.slug}`} className="article-image-wrap" tabIndex={-1} aria-hidden="true">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          style={{ objectFit: 'cover' }}
        />
        <span
          className="article-category-badge"
          style={{
            backgroundColor: article.categoryColor.bg,
            color: article.categoryColor.text,
            border: `1px solid ${article.categoryColor.border}`,
          }}
        >
          {article.category}
        </span>
      </Link>

      <div className="article-card-body">
        <div className="article-card-meta">
          <span>📅 {article.publishedAt}</span>
          <span className="meta-separator">•</span>
          <span>⏱️ {article.readingTime}</span>
        </div>

        <h3 className="article-card-title">
          <Link href={`/bai-viet/${article.slug}`} title={article.title}>
            {article.title}
          </Link>
        </h3>

        <p className="article-card-excerpt">
          {article.excerpt}
        </p>

        <div className="article-card-footer">
          <Link href={`/bai-viet/${article.slug}`} className="btn-article-detail">
            <span>Xem chi tiết</span>
            <span className="arrow-icon" aria-hidden="true">&rarr;</span>
          </Link>
          <span className="article-product-hint">
            Mã: <strong>{article.featuredProduct.code}</strong>
          </span>
        </div>
      </div>
    </article>
  );
}
