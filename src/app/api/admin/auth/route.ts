import { NextRequest, NextResponse } from 'next/server';
import {
  validateAdminCredentials,
  createSessionToken,
  verifyAdminAuth,
  SESSION_COOKIE_NAME,
} from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/auth - Admin Login
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'पासवर्ड दर्ज करना आवश्यक है।' },
        { status: 400 }
      );
    }

    const isValid = validateAdminCredentials(email, password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'अमान्य ईमेल अथवा पासवर्ड।' },
        { status: 401 }
      );
    }

    const adminEmail = (email && email.trim()) || process.env.ADMIN_EMAIL || 'admin@ward14.local';
    const token = createSessionToken(adminEmail, 'admin');

    const res = NextResponse.json({
      success: true,
      message: 'सफलतापूर्वक लॉग इन किया गया।',
      token,
      email: adminEmail,
    });

    // Set secure HttpOnly cookie for Netlify and browser session persistence
    res.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'लॉगिन में त्रुटि हुई।' }, { status: 500 });
  }
}

/**
 * GET /api/admin/auth - Verify current session
 */
export async function GET(req: NextRequest) {
  const auth = verifyAdminAuth(req);
  if (auth.authenticated) {
    return NextResponse.json({
      authenticated: true,
      email: auth.email,
      role: auth.role,
    });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

/**
 * DELETE /api/admin/auth - Admin Logout
 */
export async function DELETE() {
  const res = NextResponse.json({
    success: true,
    message: 'सफलतापूर्वक लॉग आउट किया गया।',
  });

  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return res;
}
