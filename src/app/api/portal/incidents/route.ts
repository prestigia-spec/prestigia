import { NextResponse } from 'next/server';
import { getShiftIncidents, createShiftIncident } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const branchId = searchParams.get('branchId') || undefined;

    if (!businessId) {
      return NextResponse.json(
        { error: 'businessId es requerido' },
        { status: 400 }
      );
    }

    const incidents = await getShiftIncidents(businessId, branchId);
    return NextResponse.json({ success: true, incidents });
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return NextResponse.json(
      { error: 'Error al obtener incidencias' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessId, branchId, branchName, description, registeredBy, status, staffMember, incidentType } = body;

    if (!businessId || !branchId || !description || !registeredBy) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios para registrar la novedad' },
        { status: 400 }
      );
    }

    const newIncident = await createShiftIncident({
      businessId,
      branchId,
      branchName: branchName || 'Sede',
      description,
      registeredBy,
      status: status || 'handled',
      staffMember: staffMember || undefined,
      incidentType: incidentType || undefined,
    });

    return NextResponse.json({ success: true, incident: newIncident });
  } catch (error) {
    console.error('Error creating incident:', error);
    return NextResponse.json(
      { error: 'Error al crear la novedad de turno' },
      { status: 500 }
    );
  }
}
