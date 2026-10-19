import { NextRequest, NextResponse } from 'next/server';
import { createPanelToken, PANEL_COOKIE_NAME } from '../../../src/panelAuth';

export async function POST(request: NextRequest) {
  const configuredPassword = process.env.PANEL_PASSWORD;
  if (!configuredPassword) return new NextResponse('Panel non configuré.', { status: 503 });

  const formData = await request.formData();
  const submittedPassword = formData.get('password');
  if (typeof submittedPassword !== 'string' || submittedPassword !== configuredPassword) {
    return NextResponse.redirect(new URL('/panel/login?error=invalid', request.url), 303);
  }

  const response = NextResponse.redirect(new URL('/panel', request.url), 303);
  response.cookies.set(PANEL_COOKIE_NAME, await createPanelToken(configuredPassword), {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/panel',
  });
  return response;
}
