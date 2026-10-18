import { NextRequest, NextResponse } from 'next/server';
import { recordTrafficVisit, getAllTrafficVisits } from '@/lib/db';
import { getClientIp } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request) || '127.0.0.1';
    const body = await request.json().catch(() => ({}));

    // Header geo detection (Native in Vercel / Cloudflare)
    const headerCountry = request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry');
    const headerCity = request.headers.get('x-vercel-ip-city');
    const headerRegion = request.headers.get('x-vercel-ip-country-region');

    const countryCode = (headerCountry || body.countryCode || 'CO').toUpperCase();
    const city = headerCity ? decodeURIComponent(headerCity) : (body.city || 'Bogotá');
    const country = body.country || (countryCode === 'CO' ? 'Colombia' : countryCode === 'US' ? 'Estados Unidos' : countryCode === 'MX' ? 'México' : countryCode === 'ES' ? 'España' : countryCode);

    const userAgent = request.headers.get('user-agent') || body.userAgent || '';
    const ua = userAgent.toLowerCase();

    let deviceType: 'mobile' | 'desktop' | 'tablet' = 'desktop';
    let deviceBrand = 'PC';
    let os = 'Windows';
    let browser = 'Chrome';

    if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) {
      deviceType = 'tablet';
      deviceBrand = /ipad/i.test(ua) ? 'iPad (Apple)' : 'Tablet Android';
    } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
      deviceType = 'mobile';
      if (/iphone/i.test(ua)) deviceBrand = 'iPhone (Apple)';
      else if (/samsung/i.test(ua)) deviceBrand = 'Samsung Galaxy';
      else if (/xiaomi|redmi/i.test(ua)) deviceBrand = 'Xiaomi / Redmi';
      else deviceBrand = 'Smartphone';
    }

    if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
    else if (/android/i.test(ua)) os = 'Android';
    else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
    else if (/windows/i.test(ua)) os = 'Windows';
    else if (/linux/i.test(ua)) os = 'Linux';

    if (/edg/i.test(ua)) browser = 'Edge';
    else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
    else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';

    const recorded = await recordTrafficVisit({
      ip,
      country,
      countryCode,
      city,
      region: headerRegion || body.region || undefined,
      deviceType,
      deviceBrand,
      os,
      browser,
      path: body.path || '/',
      referrer: body.referrer || request.headers.get('referer') || 'Directo',
      action: body.action || 'view',
    });

    return NextResponse.json({ success: true, visit: recorded });
  } catch (error) {
    console.error('Error tracking visit:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const visits = await getAllTrafficVisits();
    return NextResponse.json({ success: true, visits });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching visits' }, { status: 500 });
  }
}
