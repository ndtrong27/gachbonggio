import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { articles } from '@/data/articles';

export const revalidate = 3600; // Revalidate sitemap every hour (ISR)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gachbonggio.vercel.app';
  const now = new Date();

  // 1. Core High-Priority Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/san-pham`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bai-viet`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // 2. Dynamic Architectural Articles
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: dbArticles } = await supabase
      .from('articles')
      .select('slug, updated_at, created_at, published')
      .eq('published', true);

    if (dbArticles && dbArticles.length > 0) {
      articleRoutes = dbArticles.map((art) => ({
        url: `${baseUrl}/bai-viet/${art.slug}`,
        lastModified: art.updated_at ? new Date(art.updated_at) : (art.created_at ? new Date(art.created_at) : now),
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      }));
    } else {
      articleRoutes = articles.map((art) => ({
        url: `${baseUrl}/bai-viet/${art.slug}`,
        lastModified: new Date(art.publishedAt || now),
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      }));
    }
  } catch (err) {
    console.error('Error fetching articles for sitemap:', err);
    articleRoutes = articles.map((art) => ({
      url: `${baseUrl}/bai-viet/${art.slug}`,
      lastModified: new Date(art.publishedAt || now),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));
  }

  // 3. Dynamic Product Catalog (270+ Products from Supabase, Deduplicated by Code/ID)
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: products } = await supabase
      .from('products')
      .select('id, code, updated_at, created_at')
      .order('id', { ascending: true });

    if (products && products.length > 0) {
      const seenUrls = new Set<string>();

      for (const prod of products) {
        const identifier = prod.code ? encodeURIComponent(prod.code) : prod.id.toString();
        const url = `${baseUrl}/san-pham/${identifier}`;

        if (!seenUrls.has(url)) {
          seenUrls.add(url);
          productRoutes.push({
            url,
            lastModified: prod.updated_at ? new Date(prod.updated_at) : (prod.created_at ? new Date(prod.created_at) : now),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          });
        }
      }
    }
  } catch (err) {
    console.error('Error fetching products for sitemap:', err);
  }

  return [...staticRoutes, ...articleRoutes, ...productRoutes];
}
