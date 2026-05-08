import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPrefixes = [
  '/',
  '/analytics',
  '/settings',
  '/business',
  '/inbox',
  '/fans',
  '/ai-brain',
  '/transcription',
];

const publicPaths = ['/login', '/auth/callback'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('app_token')?.value;
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));
  const isProtected = protectedPrefixes.some((prefix) =>
    prefix === '/' ? pathname === '/' : pathname.startsWith(prefix),
  );

  if (isPublic && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isProtected && !isPublic && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)'],
};
