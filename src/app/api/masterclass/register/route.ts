import { NextRequest, NextResponse } from 'next/server';
import { getAllCommercialLeads, saveCommercialLead } from '@/lib/db';
import { getClientIp, sanitizeInput } from '@/lib/security';

function normalizePhoneKey(phone?: string): string {
  const digits = (phone || '').replace(/[^0-9]/g, '');
  if (digits.length >= 10) return digits.slice(-10);
  return digits;
}

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

    const cleanEmail = email ? sanitizeInput(email).trim().toLowerCase() : '';
    const phoneKey = normalizePhoneKey(cleanPhone);

    // Enlace oficial por defecto al grupo VIP de WhatsApp de la Masterclass
    const defaultWhatsAppGroup = process.env.NEXT_PUBLIC_MASTERCLASS_WA_GROUP || 'https://chat.whatsapp.com/HywvVNPmonBEyZWnw9OxNw';

    // Verificar si ya está registrado en la Masterclass por WhatsApp o correo
    const existingLeads = await getAllCommercialLeads();
    const existingDuplicate = existingLeads.find((l) => {
      const isMasterclass =
        (l.category && l.category.toLowerCase().includes('masterclass')) ||
        (l.primaryGoal && l.primaryGoal.toLowerCase().includes('masterclass'));
      if (!isMasterclass) return false;

      const existingPhoneKey = normalizePhoneKey(l.phone);
      const existingEmail = (l.email || '').trim().toLowerCase();

      const samePhone = phoneKey.length >= 7 && existingPhoneKey === phoneKey;
      const sameEmail = cleanEmail.length > 0 && existingEmail === cleanEmail;
      return samePhone || sameEmail;
    });

    if (existingDuplicate) {
      return NextResponse.json({
        success: true,
        duplicate: true,
        leadId: existingDuplicate.id,
        whatsappGroupUrl: defaultWhatsAppGroup,
        message: '¡Ya tenías tu cupo reservado! Te redirigimos al Grupo VIP.',
      });
    }

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
      email: cleanEmail || undefined,
      city: city ? sanitizeInput(city) : (headerCity ? decodeURIComponent(headerCity) : 'Bogotá'),
      branchCount: '1',
      notes: leadNotes,
      primaryGoal: `Masterclass: ${angle} | Ref: ${cleanRef}`,
      ip,
      country: country || (headerCountry === 'CO' ? 'Colombia' : headerCountry),
      countryCode: headerCountry,
      device: isMobile ? 'Móvil / Celular' : 'Computador',
    });

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
