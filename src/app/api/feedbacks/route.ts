import { NextResponse } from 'next/server';
import { createFeedback, getBranchOrBusiness, getFeedbacksByBusinessId, addCampaignParticipant } from '@/lib/db';
import { getClientIp, checkIpRateLimit, recordIpAction, sanitizeInput } from '@/lib/security';

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

    const feedbacks = await getFeedbacksByBusinessId(businessId, branchId);
    return NextResponse.json({ success: true, feedbacks });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return NextResponse.json(
      { error: 'Error al consultar las quejas' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const body = await request.json();
    const { businessId, rating, customerName, customerPhone, complaintReason, attendedBy, clubConsent, status } = body;

    const isDemo = businessId === 'demo' || businessId === 'demo-main' || businessId === 'live';

    // 1. Blindaje: Bloqueo de 24 horas por IP solo para quejas negativas (1 a 3 estrellas, excepto en modo demo)
    if (!isDemo && Number(rating) <= 3) {
      const rateCheck = checkIpRateLimit(clientIp, 'feedback');
      if (!rateCheck.allowed) {
        return NextResponse.json(
          {
            error: `Ya registraste una opinión el día de hoy desde este dispositivo. Por seguridad, solo se permite un reporte cada 24 horas (faltan aprox. ${rateCheck.remainingHours}h).`,
          },
          { status: 429 }
        );
      }
    }

    if (!businessId || !rating || !customerName || !customerPhone || !complaintReason) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    // 2. Sanitización estricta anti-inyección XSS y normalización telefónica internacional (E.164)
    const cleanCustomerName = sanitizeInput(customerName);
    const cleanComplaintReason = sanitizeInput(complaintReason);
    let rawDigits = customerPhone.replace(/[^0-9]/g, '');
    if (rawDigits.length === 10 && rawDigits.startsWith('3')) {
      rawDigits = `57${rawDigits}`;
    }
    const cleanCustomerPhone = rawDigits.length >= 7 ? `+${rawDigits.slice(0, 15)}` : customerPhone.trim();
    const cleanAttendedBy = attendedBy ? sanitizeInput(attendedBy) : undefined;

    const resolved = await getBranchOrBusiness(businessId);
    if (!resolved) {
      if (isDemo) {
        return NextResponse.json({
          success: true,
          feedback: {
            id: `fb-demo-${Date.now()}`,
            businessId: 'demo',
            businessName: 'Tu Marca Comercial',
            branchId: 'demo-main',
            branchName: 'Sede Principal',
            rating: Number(rating),
            customerName: cleanCustomerName,
            customerPhone: cleanCustomerPhone,
            complaintReason: cleanComplaintReason,
            attendedBy: cleanAttendedBy,
            clubConsent: Boolean(clubConsent),
            category: 'Comercio Local',
            city: 'Sede Principal',
            locality: 'Ubicación Comercial',
            status: 'pending',
            createdAt: new Date().toISOString(),
          },
        }, { status: 201 });
      }
      return NextResponse.json(
        { error: 'Sede o negocio no encontrado' },
        { status: 404 }
      );
    }

    const { business, branch } = resolved;
    const feedbackCountry = (branch as any).country || business.baseline?.country || 'Colombia';
    const feedbackCity = branch.city || business.baseline?.city || 'Bogotá';
    const feedbackLocality = branch.locality || 'Principal';

    // Auto-inherit specific branch and brand metadata
    const feedback = await createFeedback({
      businessId: business.id,
      businessName: business.name,
      branchId: branch.id,
      branchName: branch.name,
      rating: Number(rating),
      customerName: cleanCustomerName,
      customerPhone: cleanCustomerPhone,
      complaintReason: cleanComplaintReason,
      attendedBy: cleanAttendedBy,
      clubConsent: Boolean(clubConsent),
      category: business.category || 'Comercio Local',
      country: feedbackCountry,
      city: feedbackCity,
      locality: feedbackLocality,
    });

    // Registrar acción de IP exitosa para activar el bloqueo de 24 horas solo si fue queja
    if (Number(rating) <= 3) {
      recordIpAction(clientIp, 'feedback');
    }

    // Auto-register in campaign if active
    if (business.campaign && business.campaign.active) {
      try {
        await addCampaignParticipant({
          businessId: business.id,
          businessName: business.name,
          nicheCategory: business.category || 'Gastronomía & Servicios',
          country: feedbackCountry,
          city: feedbackCity,
          locality: feedbackLocality,
          branchId: branch.id,
          branchName: branch.name,
          customerName: cleanCustomerName,
          customerPhone: cleanCustomerPhone,
          rating: Number(rating),
          attendedBy: cleanAttendedBy,
        });
      } catch (e) {
        console.error('Error auto-registering campaign participant:', e);
      }
    }

    return NextResponse.json({ success: true, feedback }, { status: 201 });
  } catch (error) {
    console.error('Error creating feedback:', error);
    return NextResponse.json(
      { error: 'Error al registrar el reporte' },
      { status: 500 }
    );
  }
}
