import { NextResponse } from 'next/server';
import { updateGoogleReviewReply, getBranchOrBusiness } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessId, branchId, reviewId, replyText, repliedBy, repliedByRole } = body;

    if (!businessId || !reviewId || !replyText) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios (businessId, reviewId, replyText)' },
        { status: 400 }
      );
    }

    // 1. Resolve branch configuration
    const resolved = await getBranchOrBusiness(branchId || businessId);
    if (!resolved) {
      return NextResponse.json(
        { error: 'Negocio o sede no encontrada' },
        { status: 404 }
      );
    }
    const branch = resolved.branch;
    const business = resolved.business;

    // 2. Trazabilidad de actor y rol
    const actor = repliedBy || (branch ? branch.managerName : business.ownerName) || 'Gerencia General';
    const role = repliedByRole || (branch ? 'branch_manager' : 'owner');

    // 3. Persist reply to database & mark review as answered
    const success = await updateGoogleReviewReply(reviewId, replyText.trim(), actor, role);

    if (!success) {
      return NextResponse.json(
        { error: 'Reseña de Google Maps no encontrada en el sistema' },
        { status: 404 }
      );
    }

    // 4. Live dispatch via Google Business Profile API if OAuth token exists
    const refreshToken = (branch as any)?.googleRefreshToken;
    const existingAccessToken = (branch as any)?.googleAccessToken;
    let liveGoogleStatus = 'saved_in_prestigia';

    if (refreshToken && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      try {
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
        const activeToken = refreshData.access_token || existingAccessToken;

        if (activeToken && (reviewId.includes('accounts/') || reviewId.includes('locations/'))) {
          const googleReplyRes = await fetch(`https://mybusiness.googleapis.com/v4/${reviewId}/reply`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${activeToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ comment: replyText.trim() }),
          });
          if (googleReplyRes.ok) {
            liveGoogleStatus = 'published_live_to_google';
          }
        }
      } catch (e) {
        console.warn('Google Business API live dispatch fallback:', e);
      }
    }

    const placeId = branch?.googlePlaceId || 'ChIJj61dQgK6j4AR4GeTYWZsKWw';

    return NextResponse.json({
      success: true,
      message: `Respuesta publicada con éxito en Google Maps para ${branch?.name || business.name}`,
      reviewId,
      branchId: branch?.id || 'main',
      branchName: branch?.name || business.name,
      placeId,
      liveGoogleStatus,
      publishedAt: new Date().toISOString(),
      repliedBy: actor,
      repliedByRole: role,
    });
  } catch (error) {
    console.error('Error publishing Google review reply via API:', error);
    return NextResponse.json(
      { error: 'Error al despachar la respuesta a Google Business Profile API' },
      { status: 500 }
    );
  }
}
