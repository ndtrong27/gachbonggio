import { cookies } from 'next/headers';

export const ADMIN_COOKIE_NAME = 'vcsg_admin_session';
export const ADMIN_EMAIL = 'admin@vinhcuusaigon.vn';
export const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'vcsg@2026';

// Simple and secure token generation
export function generateToken(): string {
  const secret = Buffer.from(`${ADMIN_EMAIL}:${ADMIN_PASS}:vcsg_secure_session_2026`).toString('base64');
  return secret;
}

export function isValidToken(token?: string | null): boolean {
  if (!token) return false;
  return token === generateToken();
}

export async function checkIsAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return isValidToken(token);
}
