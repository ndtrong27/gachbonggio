import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { checkIsAdmin } from '@/lib/admin-auth';
import { TablesUpdate } from '@/types/database.types';

interface Params {
  params: Promise<{ id: string }>;
}

// PUT / PATCH update product
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const isAuthed = await checkIsAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Chưa được cấp quyền quản trị' }, { status: 401 });
    }

    const { id } = await params;
    const numId = parseInt(id, 10);
    const body = await req.json();

    const updateData: TablesUpdate<'products'> = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.code !== undefined) updateData.code = body.code.trim();
    if (body.category !== undefined) updateData.category = body.category.trim();
    if (body.size !== undefined) updateData.size = body.size.trim();
    if (body.color !== undefined) {
      const c = body.color.trim();
      updateData.color = c.toLowerCase() === 'xi măng' ? 'xám xi măng' : c;
    }
    if (body.price_display !== undefined) updateData.price_display = body.price_display.trim();
    if (body.image_url !== undefined) updateData.image_url = body.image_url.trim();
    if (body.in_stock !== undefined) updateData.in_stock = Boolean(body.in_stock);

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', numId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/');
    revalidatePath('/san-pham');
    if (data?.code) {
      revalidatePath(`/san-pham/${encodeURIComponent(data.code)}`);
    }
    revalidatePath(`/san-pham/${numId}`);

    return NextResponse.json({ success: true, product: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const isAuthed = await checkIsAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Chưa được cấp quyền quản trị' }, { status: 401 });
    }

    const { id } = await params;
    const numId = parseInt(id, 10);

    const { error } = await supabase.from('products').delete().eq('id', numId);
    if (error) throw error;

    revalidatePath('/');
    revalidatePath('/san-pham');
    revalidatePath(`/san-pham/${numId}`);

    return NextResponse.json({ success: true, message: 'Đã xóa sản phẩm thành công' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
