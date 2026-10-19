import { NextRequest, NextResponse } from 'next/server';
import { createPanelToken, PANEL_COOKIE_NAME } from './src/panelAuth';

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/panel/login') return NextResponse.next();

  const password = process.env.PASSWORD;
  if (!password) {
    return new NextResponse('Panel non configuré.', {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const suppliedToken = request.cookies.get(PANEL_COOKIE_NAME)?.value;
  const expectedToken = await createPanelToken(password);
  if (suppliedToken !== expectedToken) {
    return NextResponse.redirect(new URL('/panel/login', request.url));
  }

  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}

export const config = {
  matcher: ['/panel/:path*'],
};
