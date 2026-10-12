import { supabase } from '@/lib/supabase';
import { articles as staticArticles, Article, ArticleSection, FeaturedProduct } from '@/data/articles';
import { Tables } from '@/types/database.types';

const categoryColorMap: Record<string, { bg: string; text: string; border: string }> = {
  'Bông Gió Xi Măng': { bg: '#ebf8ff', text: '#2b6cb0', border: '#bee3f8' },
  'Gốm Đất Nung': { bg: '#fffaf0', text: '#c05621', border: '#feebc8' },
  'Men Sứ Cao Cấp': { bg: '#f0fff4', text: '#276749', border: '#c6f6d5' },
  'Tư Vấn Thiết Kế': { bg: '#faf5ff', text: '#6b46c1', border: '#e9d8fd' },
  'Kỹ Thuật Thi Công': { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
};

export function mapDbArticleToArticle(db: Tables<'articles'>): Article {
  let sections: ArticleSection[] = [];
  if (Array.isArray(db.sections)) {
    sections = db.sections as unknown as ArticleSection[];
  } else if (typeof db.sections === 'string') {
    try {
      sections = JSON.parse(db.sections);
    } catch {
      sections = [];
    }
  }

  let featuredProduct: FeaturedProduct = {
    name: 'Bông gió mỹ thuật',
    code: 'VCB30-029',
    size: '290x290x90 mm',
    color: 'Trắng xi măng cao cấp',
    image: '/images/products/vcb30-029-trang.jpg',
    link: '/#xi-mang',
  };

  if (db.featured_product) {
    if (typeof db.featured_product === 'string') {
      try {
        featuredProduct = JSON.parse(db.featured_product);
      } catch {}
    } else {
      featuredProduct = db.featured_product as unknown as FeaturedProduct;
    }
  }

  const categoryColor = categoryColorMap[db.category] || {
    bg: '#f1f5f9',
    text: '#334155',
    border: '#cbd5e1',
  };

  let formattedDate = '12/10/2026';
  if (db.published_at) {
    try {
      formattedDate = new Date(db.published_at).toLocaleDateString('vi-VN');
    } catch {}
  }

  return {
    id: db.id,
    slug: db.slug,
    title: db.title,
    excerpt: db.excerpt || (db.lead ? db.lead.slice(0, 160) + '...' : ''),
    category: db.category,
    categoryColor,
    coverImage: db.cover_image || '/images/banners/banner-9.jpg',
    readingTime: db.reading_time || '4 phút đọc',
    publishedAt: formattedDate,
    author: db.author || 'KTS. Vĩnh Cửu Sài Gòn',
    targetSection: '#xi-mang',
    featuredProduct,
    lead: db.lead || '',
    sections: sections,
    conclusion: db.conclusion || '',
  };
}

// Fetch all published articles from Supabase with fallback to static articles
export async function getPublishedArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return staticArticles;
    }

    return data.map(mapDbArticleToArticle);
  } catch (err) {
    console.error('Error fetching articles from Supabase:', err);
    return staticArticles;
  }
}

// Fetch single article by slug
export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (data) {
      return mapDbArticleToArticle(data as Tables<'articles'>);
    }
  } catch (err) {
    console.error(`Error fetching article slug "${slug}" from Supabase:`, err);
  }

  // Fallback to static articles
  return staticArticles.find((a) => a.slug === slug);
}
