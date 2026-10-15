import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { TablesUpdate } from '@/types/database.types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('active_only') === 'true';

    let query = supabase
      .from('ai_guidelines')
      .select('*')
      .order('priority', { ascending: true })
      .order('updated_at', { ascending: false });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      guidelines: data || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      rule_content,
      category = 'general',
      priority = 1,
      is_active = true,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Tiêu đề quy tắc không được để trống' }, { status: 400 });
    }
    if (!rule_content || !rule_content.trim()) {
      return NextResponse.json({ error: 'Nội dung chỉ dẫn không được để trống' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('ai_guidelines')
      .insert({
        title: title.trim(),
        rule_content: rule_content.trim(),
        category: category.trim(),
        priority: Number(priority) || 1,
        is_active: Boolean(is_active),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, guideline: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, rule_content, category, priority, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID quy tắc' }, { status: 400 });
    }

    const updatePayload: TablesUpdate<'ai_guidelines'> = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) updatePayload.title = title.trim();
    if (rule_content !== undefined) updatePayload.rule_content = rule_content.trim();
    if (category !== undefined) updatePayload.category = category.trim();
    if (priority !== undefined) updatePayload.priority = Number(priority) || 1;
    if (is_active !== undefined) updatePayload.is_active = Boolean(is_active);

    const { data, error } = await supabase
      .from('ai_guidelines')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, guideline: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID quy tắc cần xóa' }, { status: 400 });
    }

    const { error } = await supabase
      .from('ai_guidelines')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}
