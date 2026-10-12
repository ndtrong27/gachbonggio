import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkIsAdmin } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const isAuthed = await checkIsAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Chưa được cấp quyền quản trị' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Chưa chọn file ảnh tải lên' }, { status: 400 });
    }

    // Sanitize filename
    const ext = file.name.split('.').pop() || 'jpg';
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${Date.now()}-${cleanName}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage bucket 'product-images'
    const { error } = await supabase.storage
      .from('product-images')
      .upload(fileName, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      fileName,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Đã có lỗi xảy ra';
    return NextResponse.json({ error: 'Lỗi tải ảnh: ' + message }, { status: 500 });
  }
}
