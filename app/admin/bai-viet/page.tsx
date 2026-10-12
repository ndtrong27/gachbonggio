import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/database.types';
import ArticleManagerClient from './ArticleManagerClient';

export const revalidate = 0; // Fresh admin data

async function getAllArticles(): Promise<Tables<'articles'>[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Lỗi truy vấn bài viết admin:', error);
    return [];
  }

  return data as Tables<'articles'>[];
}

export default async function AdminArticlesPage() {
  const articles = await getAllArticles();

  return <ArticleManagerClient initialArticles={articles} />;
}
