import { NextResponse } from 'next/server';
import {
  getAllBusinesses,
  getBranchOrBusiness,
  updateBranchGoogleTokens,
  upsertGoogleReviews,
} from '@/lib/db';
import { GoogleReview } from '@/lib/types';

const STAR_MAP: Record<string, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessId, branchId } = body;

    if (!businessId) {
      return NextResponse.json({ error: 'businessId es obligatorio' }, { status: 400 });
    }

    // Ensure Supabase businesses/branches (including __googleOAuth) are loaded in cache
    await getAllBusinesses();
    const resolved = await getBranchOrBusiness(branchId || businessId);
    if (!resolved) {
      return NextResponse.json({ error: 'Empresa o sede no encontrada' }, { status: 404 });
    }

    const branch = resolved.branch || resolved.business.branches?.[0];
    const business = resolved.business;
    const oauth = (branch as any)?.schedule?.__googleOAuth;
    const refreshToken = (branch as any)?.googleRefreshToken || oauth?.refreshToken;
    let accessToken = (branch as any)?.googleAccessToken || oauth?.accessToken;

    if (!refreshToken && !accessToken) {
      return NextResponse.json(
        {
          success: false,
          needsOAuth: true,
          error: 'Esta sede aún no está conectada con Google Business (OAuth). Haz clic en "Conectar con Google" primero.',
        },
        { status: 400 }
      );
    }

    // Refresh access token if refreshToken + server credentials exist
    if (refreshToken && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      const refreshRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });
      const refreshData = await refreshRes.json();
      if (refreshData?.access_token) {
        accessToken = refreshData.access_token;
      }
    }

    if (!accessToken) {
      return NextResponse.json(
        { success: false, needsOAuth: true, error: 'Token de Google expirado. Reconecta con Google.' },
        { status: 401 }
      );
    }

    // 1. Discover account + location if not yet stored
    let accountName: string = (branch as any)?.googleAccountId || oauth?.accountId || '';
    let locationName: string = (branch as any)?.googleLocationId || oauth?.locationId || '';

    if (!accountName || !locationName) {
      const accRes = await fetch('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const accData = await accRes.json();
      const accounts = Array.isArray(accData?.accounts) ? accData.accounts : [];

      if (accounts.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: accData?.error?.message || 'No se encontraron cuentas de Google Business Profile en este Gmail.',
          },
          { status: 404 }
        );
      }

      const targetPlaceId = branch?.googlePlaceId || '';
      const targetTitle = (branch?.name || business.name || '').toLowerCase().trim();

      for (const acc of accounts) {
        const locRes = await fetch(
          `https://mybusinessbusinessinformation.googleapis.com/v1/${acc.name}/locations?readMask=name,title,metadata`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const locData = await locRes.json();
        const locations = Array.isArray(locData?.locations) ? locData.locations : [];
        if (locations.length === 0) continue;

        const matched =
          locations.find((l: any) => targetPlaceId && l.metadata?.placeId === targetPlaceId) ||
          locations.find((l: any) => targetTitle && (l.title || '').toLowerCase().includes(targetTitle)) ||
          locations[0];

        if (matched) {
          accountName = acc.name; // e.g. accounts/123456
          locationName = matched.name; // e.g. locations/987654
          break;
        }
      }

      if (!accountName || !locationName) {
        return NextResponse.json(
          { success: false, error: 'No se encontró ninguna ubicación verificada en esta cuenta de Google Business.' },
          { status: 404 }
        );
      }

      await updateBranchGoogleTokens(branch?.id || business.id, {
        accessToken,
        refreshToken,
        accountId: accountName,
        locationId: locationName,
      });
    }

    // 2. Fetch reviews from Google Business Profile API v4
    const cleanAcc = accountName.startsWith('accounts/') ? accountName : `accounts/${accountName}`;
    const cleanLoc = locationName.startsWith('locations/') ? locationName : `locations/${locationName}`;
    const reviewsUrl = `https://mybusiness.googleapis.com/v4/${cleanAcc}/${cleanLoc}/reviews?pageSize=50`;

    const revRes = await fetch(reviewsUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const revData = await revRes.json();

    if (!revRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: revData?.error?.message || `Error de Google API (${revRes.status}) al leer reseñas.`,
        },
        { status: revRes.status }
      );
    }

    const rawReviews = Array.isArray(revData?.reviews) ? revData.reviews : [];
    const mappedReviews: GoogleReview[] = rawReviews.map((r: any) => {
      const ratingNum = STAR_MAP[String(r.starRating || '').toUpperCase()] || 5;
      const hasReply = Boolean(r.reviewReply?.comment);
      return {
        id: r.name || r.reviewId || `grev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        businessId: business.id,
        branchId: branch?.id || 'main',
        authorName: r.reviewer?.displayName || 'Cliente de Google',
        rating: ratingNum,
        comment: r.comment || '',
        createdAt: r.createTime || new Date().toISOString(),
        status: hasReply ? 'answered' : 'unanswered',
        replyText: r.reviewReply?.comment || undefined,
        repliedAt: r.reviewReply?.updateTime || undefined,
      };
    });

    const syncedCount = await upsertGoogleReviews(mappedReviews);

    return NextResponse.json({
      success: true,
      syncedCount,
      totalFound: mappedReviews.length,
      averageRating: revData?.averageRating || null,
      totalReviewCount: revData?.totalReviewCount || mappedReviews.length,
      message: `✅ Sincronizadas ${syncedCount} reseñas reales desde Google Business Profile.`,
    });
  } catch (error: any) {
    console.error('Error syncing Google Business reviews:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Error interno al sincronizar reseñas con Google.' },
      { status: 500 }
    );
  }
}
