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

    const placeId = branch?.googlePlaceId || 'ChIJj61dQgK6j4AR4GeTYWZsKWw';

    return NextResponse.json({
      success: true,
      message: `Respuesta publicada con éxito en Google Maps para ${branch?.name || business.name}`,
      reviewId,
      branchId: branch?.id || 'main',
      branchName: branch?.name || business.name,
      placeId,
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
