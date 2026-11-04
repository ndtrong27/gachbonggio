import { unstable_noStore as noStore } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { articles as staticArticles, Article, ArticleSection, FeaturedProduct } from '@/data/articles';
import { Tables } from '@/types/database.types';

const categoryColorMap: Record<string, { bg: string; text: string; border: string }> = {
  'Bông Gió Xi Măng': { bg: '#ebf8ff', text: '#2b6cb0', border: '#bee3f8' },
  'Bông Gió Tráng Men': { bg: '#f0fff4', text: '#276749', border: '#c6f6d5' },
  'Bông Gió Đất Nung': { bg: '#fffaf0', text: '#c05621', border: '#feebc8' },
  'Gốm Đất Nung': { bg: '#fffaf0', text: '#c05621', border: '#feebc8' },
  'Men Sứ Cao Cấp': { bg: '#f0fff4', text: '#276749', border: '#c6f6d5' },
  'Tư Vấn Thiết Kế': { bg: '#faf5ff', text: '#6b46c1', border: '#e9d8fd' },
  'Thiết Kế Kiến Trúc': { bg: '#faf5ff', text: '#6b46c1', border: '#e9d8fd' },
  'Kiến Trúc & Xây Dựng': { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
  'Kiến Trúc': { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' },
  'Kinh Nghiệm Xây Dựng': { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
  'Kỹ Thuật Thi Công': { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
};

export function mapDbArticleToArticle(db: Tables<'articles'>): Article {
  let rawSections: any[] = [];
  if (Array.isArray(db.sections)) {
    rawSections = db.sections;
  } else if (typeof db.sections === 'string') {
    try {
      rawSections = JSON.parse(db.sections);
    } catch {
      rawSections = [];
    }
  }

  // Normalize sections to always have heading and paragraphs array
  const sections: ArticleSection[] = rawSections.map((sec, idx) => {
    const heading = sec.heading || sec.title || `Mục ${idx + 1}`;
    let paragraphs: string[] = [];
    if (Array.isArray(sec.paragraphs)) {
      paragraphs = sec.paragraphs.map(String);
    } else if (typeof sec.content === 'string') {
      paragraphs = sec.content.split('\n\n').map((p: string) => p.trim()).filter(Boolean);
      if (paragraphs.length === 0 && sec.content.trim()) {
        paragraphs = [sec.content.trim()];
      }
    } else if (typeof sec.paragraph === 'string') {
      paragraphs = [sec.paragraph.trim()];
    } else {
      paragraphs = ['Nội dung đang được cập nhật.'];
    }

    return {
      heading,
      paragraphs,
      highlight: sec.highlight || undefined,
      quote: sec.quote || undefined,
    };
  });

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
  const rawDate = db.published_at || db.created_at;
  if (rawDate) {
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(rawDate.trim())) {
      formattedDate = rawDate.trim();
    } else {
      const parsed = new Date(rawDate);
      if (!isNaN(parsed.getTime())) {
        formattedDate = parsed.toLocaleDateString('vi-VN');
      } else {
        formattedDate = rawDate;
      }
    }
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
    targetSection: db.target_section || '#xi-mang',
    featuredProduct,
    lead: db.lead || '',
    sections: sections,
    conclusion: db.conclusion || '',
  };
}

// Get the default showcase articles for Homepage (permanent & unchanging)
export function getDefaultHomepageArticles(): Article[] {
  return staticArticles;
}

// Fetch all published articles from Supabase with fallback to static articles
export async function getPublishedArticles(): Promise<Article[]> {
  noStore();
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
  noStore();
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
