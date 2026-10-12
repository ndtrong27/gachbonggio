import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkIsAdmin } from '@/lib/admin-auth';

// GET all articles
export async function GET() {
  try {
    const isAuthed = await checkIsAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Chưa được cấp quyền quản trị' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ articles: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST create new article
export async function POST(req: NextRequest) {
  try {
    const isAuthed = await checkIsAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Chưa được cấp quyền quản trị' }, { status: 401 });
    }

    const body = await req.json();
    const { title, slug, category, excerpt, cover_image, reading_time, author, lead, sections, conclusion, published } = body;

    if (!title || !category || !lead) {
      return NextResponse.json({ error: 'Vui lòng điền đủ Tiêu đề, Thể loại và Đoạn mở đầu' }, { status: 400 });
    }

    const finalSlug = (slug || title.toLowerCase().replace(/[^a-z0-9]/g, '-')).replace(/-+/g, '-');
    const id = `bai-viet-${Date.now()}`;

    const { data, error } = await supabase
      .from('articles')
      .insert({
        id,
        title,
        slug: finalSlug,
        category,
        excerpt: excerpt || lead.slice(0, 160) + '...',
        cover_image: cover_image || '/images/banners/banner-9.jpg',
        reading_time: reading_time || '4 phút đọc',
        author: author || 'KTS. Vĩnh Cửu Sài Gòn',
        lead,
        sections: sections || [],
        conclusion: conclusion || '',
        published: published !== false,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, article: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
