import { NextResponse } from 'next/server';
import { getGoogleReviews, updateGoogleReviewReply } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const branchId = searchParams.get('branchId') || undefined;

    if (!businessId) {
      return NextResponse.json(
        { error: 'Parámetro businessId requerido' },
        { status: 400 }
      );
    }

    const reviews = await getGoogleReviews(businessId, branchId);
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return NextResponse.json(
      { error: 'Error al consultar las reseñas de Google' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { reviewId, replyText, repliedBy, repliedByRole } = body;

    if (!reviewId || !replyText) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos (reviewId, replyText)' },
        { status: 400 }
      );
    }

    const updated = await updateGoogleReviewReply(reviewId, replyText, repliedBy, repliedByRole);
    if (!updated) {
      return NextResponse.json(
        { error: 'Reseña de Google no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Respuesta guardada con éxito' });
  } catch (error) {
    console.error('Error updating Google review reply:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la respuesta' },
      { status: 500 }
    );
  }
}
