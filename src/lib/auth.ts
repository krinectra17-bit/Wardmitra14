import { NextRequest } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ward14admin2026';

export function verifyAdminAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token === ADMIN_PASSWORD) {
      return true;
    }
  }

  // Also support custom cookie
  const cookie = req.cookies.get('ward14_admin_session');
  if (cookie && cookie.value === ADMIN_PASSWORD) {
    return true;
  }

  return false;
}
