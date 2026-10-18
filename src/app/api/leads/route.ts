import { NextRequest, NextResponse } from 'next/server';
import { saveCommercialLead, getAllCommercialLeads, updateCommercialLeadStatus } from '@/lib/db';
import { getClientIp, sanitizeInput } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request) || '127.0.0.1';
    const body = await request.json();

    const { fullName, businessName, category, phone, email, city, branchCount, notes } = body;

    if (!fullName || !businessName || !phone) {
      return NextResponse.json(
        { error: 'Tu nombre, el nombre de tu negocio y tu WhatsApp son obligatorios.' },
        { status: 400 }
      );
    }

    const headerCountry = request.headers.get('x-vercel-ip-country') || 'CO';
    const headerCity = request.headers.get('x-vercel-ip-city');

    const cleanName = sanitizeInput(fullName);
    const cleanBiz = sanitizeInput(businessName);
    const cleanCat = sanitizeInput(category || 'Comercio General');
    let rawDigits = phone.replace(/[^0-9]/g, '');
    if (rawDigits.length === 10 && rawDigits.startsWith('3')) {
      rawDigits = `57${rawDigits}`;
    }
    const cleanPhone = rawDigits.length >= 7 ? `+${rawDigits}` : phone.trim();

    const userAgent = request.headers.get('user-agent') || '';
    const isMobile = /mobile|iphone|android/i.test(userAgent);

    const lead = await saveCommercialLead({
      fullName: cleanName,
      businessName: cleanBiz,
      category: cleanCat,
      phone: cleanPhone,
      email: email ? sanitizeInput(email) : undefined,
      city: city ? sanitizeInput(city) : (headerCity ? decodeURIComponent(headerCity) : 'Bogotá'),
      branchCount: branchCount || '1',
      notes: notes ? sanitizeInput(notes) : undefined,
      ip,
      country: headerCountry === 'CO' ? 'Colombia' : headerCountry,
      countryCode: headerCountry,
      device: isMobile ? 'Móvil / Celular' : 'Computador',
    });

    return NextResponse.json({
      success: true,
      message: '¡Excelente! Hemos recibido tu solicitud. Un especialista de Prestigia te contactará por WhatsApp en breve con tu auditoría gratuita.',
      lead,
    });
  } catch (error) {
    console.error('Error saving lead:', error);
    return NextResponse.json({ error: 'Error procesando solicitud de contacto' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const leads = await getAllCommercialLeads();
    return NextResponse.json({ success: true, leads });
  } catch (error) {
    return NextResponse.json({ error: 'Error cargando prospectos' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID y estado son requeridos' }, { status: 400 });
    }

    const updated = await updateCommercialLeadStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Prospecto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Estado del prospecto actualizado' });
  } catch (error) {
    return NextResponse.json({ error: 'Error actualizando estado del prospecto' }, { status: 500 });
  }
}
