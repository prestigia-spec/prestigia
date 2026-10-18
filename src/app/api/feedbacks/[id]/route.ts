import { NextResponse } from 'next/server';
import { updateFeedbackStatus } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const feedbackId = params.id;
    const body = await request.json();
    const { status, resolvedBy, resolvedByRole, rescueMessage } = body;

    if (!status || !['pending', 'resolved'].includes(status)) {
      return NextResponse.json(
        { error: 'Estado inválido. Debe ser pending o resolved' },
        { status: 400 }
      );
    }

    const success = await updateFeedbackStatus(feedbackId, status, resolvedBy, resolvedByRole, rescueMessage);
    if (!success) {
      return NextResponse.json(
        { error: 'Queja o reporte no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error('Error updating feedback status:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el reporte' },
      { status: 500 }
    );
  }
}
