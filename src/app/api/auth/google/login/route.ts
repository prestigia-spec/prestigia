import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get('businessId') || '';
  const branchId = searchParams.get('branchId') || '';
  const returnUrl = searchParams.get('returnUrl') || '/portal';

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: 'GOOGLE_CLIENT_ID no configurado en el servidor' },
      { status: 500 }
    );
  }

  // Construct Google OAuth 2.0 redirect
  const host = request.headers.get('host') || 'prestigia-oficial.vercel.app';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

  const state = JSON.stringify({ businessId, branchId, returnUrl });

  const scopes = [
    'https://www.googleapis.com/auth/business.manage',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ].join(' ');

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
    clientId
  )}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${encodeURIComponent(
    scopes
  )}&access_type=offline&prompt=consent&state=${encodeURIComponent(state)}`;

  return NextResponse.redirect(googleAuthUrl);
}
