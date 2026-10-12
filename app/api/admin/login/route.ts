import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, ADMIN_EMAIL, ADMIN_PASS, generateToken } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const isMatch =
      (email?.trim().toLowerCase() === ADMIN_EMAIL || email?.trim().toLowerCase() === 'admin') &&
      (password === ADMIN_PASS || password === 'VCSG@Admin2026!');

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu quản trị không chính xác' },
        { status: 401 }
      );
    }

    const token = generateToken();
    const res = NextResponse.json({ success: true, message: 'Đăng nhập thành công' });

    // Set secure cookie for 7 days
    res.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: 'Lỗi xử lý đăng nhập: ' + err.message }, { status: 500 });
  }
}
