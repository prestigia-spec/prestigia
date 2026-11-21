import { NextRequest, NextResponse } from 'next/server';
import { saveCommercialLead } from '@/lib/db';
import { getClientIp, sanitizeInput } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request) || '127.0.0.1';
    const body = await request.json();

    const {
      fullName,
      phone,
      email,
      role = 'independent',
      city,
      country,
      angle = 'general',
      referralCode,
      referredBy,
      ref,
      utmSource,
      utmCampaign,
    } = body;

    const rawRef = referralCode || referredBy || ref || '';
    const cleanRef = rawRef ? sanitizeInput(String(rawRef)).toLowerCase().trim() : 'directo';

    if (!fullName || !phone) {
      return NextResponse.json(
        { error: 'El nombre y el WhatsApp son obligatorios para reservar tu cupo.' },
        { status: 400 }
      );
    }

    const headerCountry = request.headers.get('x-vercel-ip-country') || 'CO';
    const headerCity = request.headers.get('x-vercel-ip-city');

    const cleanName = sanitizeInput(fullName);
    let rawDigits = phone.replace(/[^0-9]/g, '');
    if (rawDigits.length === 10 && rawDigits.startsWith('3')) {
      rawDigits = `57${rawDigits}`;
    }
    const cleanPhone = rawDigits.length >= 7 ? `+${rawDigits}` : phone.trim();

    const userAgent = request.headers.get('user-agent') || '';
    const isMobile = /mobile|iphone|android/i.test(userAgent);

    const leadNotes = JSON.stringify({
      source: 'masterclass_registration',
      angle,
      role,
      referredBy: cleanRef,
      utmSource: utmSource || 'organic',
      utmCampaign: utmCampaign || 'general',
      device: isMobile ? 'Móvil' : 'Computador',
      registeredAt: new Date().toISOString(),
    });

    const lead = await saveCommercialLead({
      fullName: cleanName,
      businessName: role === 'business_owner' ? 'Negocio Propio' : role === 'agency' ? 'Agencia / Marca' : 'Independiente / Emprendedor',
      category: 'Masterclass Local Studio 2026',
      phone: cleanPhone,
      email: email ? sanitizeInput(email) : undefined,
      city: city ? sanitizeInput(city) : (headerCity ? decodeURIComponent(headerCity) : 'Bogotá'),
      branchCount: '1',
      notes: leadNotes,
      primaryGoal: `Masterclass: ${angle} | Ref: ${cleanRef}`,
      ip,
      country: country || (headerCountry === 'CO' ? 'Colombia' : headerCountry),
      countryCode: headerCountry,
      device: isMobile ? 'Móvil / Celular' : 'Computador',
    });

    // Enlace oficial por defecto al grupo VIP de WhatsApp de la Masterclass
    const defaultWhatsAppGroup = process.env.NEXT_PUBLIC_MASTERCLASS_WA_GROUP || 'https://chat.whatsapp.com/HywvVNPmonBEyZWnw9OxNw';

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      whatsappGroupUrl: defaultWhatsAppGroup,
      message: '¡Registro exitoso a la Masterclass!',
    });
  } catch (error: any) {
    console.error('Error registering to masterclass:', error);
    return NextResponse.json(
      { error: error?.message || 'Error del servidor al procesar el registro.' },
      { status: 500 }
    );
  }
}
