import { NextResponse } from 'next/server';
import { getAllStudioDossiers, saveStudioDossier, deleteStudioDossier, StudioDossier } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const advisorId = searchParams.get('advisorId');
    const isAdmin = searchParams.get('isAdmin') === 'true';

    const allDossiers = await getAllStudioDossiers();

    if (isAdmin || !advisorId) {
      return NextResponse.json({ success: true, dossiers: allDossiers });
    }

    const filtered = allDossiers.filter((d) => d.advisorId === advisorId);
    return NextResponse.json({ success: true, dossiers: filtered });
  } catch (error: any) {
    console.error('Error fetching studio dossiers:', error);
    return NextResponse.json({ error: 'Error del servidor al obtener expedientes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      advisorId = 'adv-luisma',
      advisorName = 'Luisma • Consultor',
      advisorPhone = '+573058314049',
      clientName,
      category = 'Restaurante / Gastronomía',
      city = 'Bogotá',
      neighborhood = '',
      googleUrl = '',
      mode = 'create',
      status = 'draft',
      data,
    } = body;

    if (!clientName || !clientName.trim()) {
      return NextResponse.json({ error: 'El nombre del cliente es obligatorio' }, { status: 400 });
    }

    const dossierObj: StudioDossier = {
      id: id || `dos-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      advisorId,
      advisorName,
      advisorPhone,
      clientName: clientName.trim(),
      category,
      city: city.trim(),
      neighborhood: neighborhood?.trim() || '',
      googleUrl: googleUrl?.trim() || '',
      mode,
      status,
      data: data || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveStudioDossier(dossierObj);

    return NextResponse.json({ success: true, dossier: dossierObj });
  } catch (error: any) {
    console.error('Error saving studio dossier:', error);
    return NextResponse.json({ error: 'Error guardando expediente' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dossierId = searchParams.get('id');

    if (!dossierId) {
      return NextResponse.json({ error: 'ID de expediente no proporcionado' }, { status: 400 });
    }

    const ok = await deleteStudioDossier(dossierId);
    return NextResponse.json({ success: ok, message: 'Expediente eliminado con éxito' });
  } catch (error: any) {
    console.error('Error deleting studio dossier:', error);
    return NextResponse.json({ error: 'Error eliminando expediente' }, { status: 500 });
  }
}
