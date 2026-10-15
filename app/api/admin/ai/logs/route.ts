import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { TablesUpdate } from '@/types/database.types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rating = searchParams.get('rating');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let query = supabase
      .from('ai_chat_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (rating === 'unrated') {
      query = query.is('rating', null);
    } else if (rating === 'positive' || rating === 'negative') {
      query = query.eq('rating', rating);
    }

    const { data, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      logs: data || [],
      total: count || 0,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, rating, admin_notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID cuộc trò chuyện' }, { status: 400 });
    }

    const updatePayload: TablesUpdate<'ai_chat_logs'> = {
      reviewed_at: new Date().toISOString(),
    };

    if (rating !== undefined) {
      updatePayload.rating = rating;
    }
    if (admin_notes !== undefined) {
      updatePayload.admin_notes = admin_notes;
    }

    const { data, error } = await supabase
      .from('ai_chat_logs')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, log: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi server' }, { status: 500 });
  }
}
