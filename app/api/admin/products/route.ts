import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkIsAdmin } from '@/lib/admin-auth';

// GET all products with optional filters
export async function GET(req: NextRequest) {
  try {
    const isAuthed = await checkIsAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Chưa được cấp quyền quản trị' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'ALL';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = (page - 1) * limit;

    let query = supabase.from('products').select('*', { count: 'exact' });

    if (category !== 'ALL') {
      query = query.eq('category', category);
    }

    if (search.trim()) {
      query = query.or(`name.ilike.%${search.trim()}%,code.ilike.%${search.trim()}%`);
    }

    query = query.order('id', { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) throw error;

    return NextResponse.json({
      products: data || [],
      total: count || 0,
      page,
      limit,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST create new product
export async function POST(req: NextRequest) {
  try {
    const isAuthed = await checkIsAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Chưa được cấp quyền quản trị' }, { status: 401 });
    }

    const body = await req.json();
    const { name, code, category, size, color, price_display, image_url, in_stock } = body;

    if (!name || !code || !category) {
      return NextResponse.json({ error: 'Vui lòng điền đủ Tên, Mã SP và Danh mục' }, { status: 400 });
    }

    const slug = `${code.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;

    const { data, error } = await supabase
      .from('products')
      .insert({
        name,
        code,
        slug,
        category,
        size: size || '290x290x90 mm',
        color: color || 'Trắng',
        price_display: price_display || 'Liên hệ',
        image_url: image_url || '/images/logo.png',
        in_stock: in_stock !== false,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, product: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
