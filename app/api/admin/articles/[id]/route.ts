import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkIsAdmin } from '@/lib/admin-auth';
import { TablesUpdate } from '@/types/database.types';

interface Params {
  params: Promise<{ id: string }>;
}

// PUT / PATCH update article
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const isAuthed = await checkIsAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Chưa được cấp quyền quản trị' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updateData: TablesUpdate<'articles'> = {
      updated_at: new Date().toISOString(),
    };

    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.cover_image !== undefined) updateData.cover_image = body.cover_image;
    if (body.reading_time !== undefined) updateData.reading_time = body.reading_time;
    if (body.author !== undefined) updateData.author = body.author;
    if (body.lead !== undefined) updateData.lead = body.lead;
    if (body.sections !== undefined) updateData.sections = body.sections;
    if (body.conclusion !== undefined) updateData.conclusion = body.conclusion;
    if (body.published !== undefined) updateData.published = body.published;

    const { data, error } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, article: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE article
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const isAuthed = await checkIsAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Chưa được cấp quyền quản trị' }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Đã xóa bài viết thành công' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
