import { NextResponse } from 'next/server';
import { updateBranchGoogleTokens } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const rawState = searchParams.get('state');

  let stateObj: { businessId?: string; branchId?: string; returnUrl?: string } = {};
  try {
    if (rawState) stateObj = JSON.parse(rawState);
  } catch {}

  const returnUrl = stateObj.returnUrl || '/portal';

  if (error) {
    console.error('Google OAuth error from user consent:', error);
    return NextResponse.redirect(
      new URL(`${returnUrl}?google_error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL(`${returnUrl}?google_error=no_code`, request.url)
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
    return NextResponse.redirect(
      new URL(`${returnUrl}?google_error=missing_server_credentials`, request.url)
    );
  }

  const host = request.headers.get('host') || 'prestigia-oficial.vercel.app';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

  try {
    // Exchange authorization code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('Token exchange failed:', tokenData);
      return NextResponse.redirect(
        new URL(`${returnUrl}?google_error=token_exchange_failed`, request.url)
      );
    }

    // Retrieve user email
    let connectedEmail = '';
    try {
      const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      if (userInfoRes.ok) {
        const userInfo = await userInfoRes.json();
        connectedEmail = userInfo.email || '';
      }
    } catch {}

    // Save tokens in database for target business / branch
    const targetBranchId = stateObj.branchId || stateObj.businessId || '';
    if (targetBranchId) {
      await updateBranchGoogleTokens(targetBranchId, {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        connectedEmail,
      });
    }

    return NextResponse.redirect(
      new URL(
        `${returnUrl}?google_success=connected&email=${encodeURIComponent(connectedEmail)}`,
        request.url
      )
    );
  } catch (err: any) {
    console.error('Fatal Google OAuth callback error:', err);
    return NextResponse.redirect(
      new URL(`${returnUrl}?google_error=${encodeURIComponent(err.message || 'unknown')}`, request.url)
    );
  }
}
