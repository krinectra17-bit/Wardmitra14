import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ward14admin2026';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'गलत पासवर्ड। कृपया सही पासवर्ड दर्ज करें।' }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
      token: ADMIN_PASSWORD,
      message: 'सफलतापूर्वक लॉगिन हो गया।',
    });

    response.cookies.set('ward14_admin_session', ADMIN_PASSWORD, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ error: 'लॉगिन में त्रुटि हुई' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'लॉगआउट सफल।' });
  response.cookies.delete('ward14_admin_session');
  return response;
}
