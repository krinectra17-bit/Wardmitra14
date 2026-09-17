import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('ward14_admin_session');
  const hasSession = !!sessionCookie?.value;

  // 1. Root /admin redirect to /admin/dashboard
  if (pathname === '/admin') {
    if (hasSession) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 2. Protect Admin Pages
  const protectedAdminPaths = ['/admin/dashboard', '/admin/issues', '/admin/feedback'];
  const isProtectedAdminPath = protectedAdminPaths.some((p) => pathname.startsWith(p));

  if (isProtectedAdminPath && !hasSession) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. If already logged in and visiting /admin/login, redirect to /admin/dashboard
  if (pathname === '/admin/login' && hasSession) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
