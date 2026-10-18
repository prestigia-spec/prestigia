import { NextResponse } from 'next/server';
import {
  getCampaign,
  saveCampaign,
  getCampaignParticipants,
  addCampaignParticipant,
  markCampaignWinner,
  clearCampaignParticipants,
  getBusinessById,
} from '@/lib/db';
import { getClientIp, checkIpRateLimit, recordIpAction, sanitizeInput } from '@/lib/security';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId') || 'clinica-san-rafael';
    const branchId = searchParams.get('branchId') || undefined;

    const campaign = await getCampaign(businessId, branchId);
    let participants = await getCampaignParticipants(businessId);
    if (branchId && branchId !== 'all') {
      participants = participants.filter((p) => p.branchId === branchId);
    }

    const business = await getBusinessById(businessId);
    const defaultReward = business?.name
      ? `Bono de Experiencia VIP en ${business.name} valorado en $150.000 COP`
      : 'Bono de Experiencia VIP / Compra valorado en $150.000 COP';
    const defaultTerms = 'Válido para clientes registrados este mes que califiquen su experiencia en cualquiera de nuestras sedes.';

    return NextResponse.json({
      success: true,
      campaign: campaign || {
        id: `camp-${businessId}`,
        businessId,
        branchId: branchId && branchId !== 'all' ? branchId : undefined,
        title: 'Campaña de Satisfacción del Mes',
        reward: defaultReward,
        active: true,
        drawDate: '30 de Septiembre de 2026',
        terms: defaultTerms,
      },
      participants,
    });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json({ error: 'Error al consultar campaña' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessId, campaign, branchId } = body;

    if (!businessId || !campaign) {
      return NextResponse.json({ error: 'businessId y campaign son requeridos' }, { status: 400 });
    }

    const updated = await saveCampaign(businessId, campaign, branchId);
    return NextResponse.json({ success: true, campaign: updated });
  } catch (error) {
    console.error('Error saving campaign:', error);
    return NextResponse.json({ error: 'Error al guardar campaña' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'add_participant') {
      const { participant } = body;
      if (!participant || !participant.businessId || !participant.customerPhone) {
        return NextResponse.json({ error: 'Datos de participante incompletos' }, { status: 400 });
      }

      const clientIp = getClientIp(request);
      const isDemo = participant.businessId === 'demo' || participant.businessId === 'demo-main' || participant.businessId === 'live';

      // 1. Blindaje: Bloqueo de 24 horas por IP para evitar inscripciones masivas (excepto en modo demo)
      if (!isDemo) {
        const rateCheck = checkIpRateLimit(clientIp, 'campaign');
        if (!rateCheck.allowed) {
          return NextResponse.json(
            {
              error: `Ya se registró una participación en el sorteo el día de hoy desde este dispositivo. Por transparencia, solo se permite una participación cada 24 horas.`,
            },
            { status: 429 }
          );
        }
      }

      // 2. Sanitización y normalización internacional E.164
      let rawDigits = participant.customerPhone.replace(/[^0-9]/g, '');
      if (rawDigits.length === 10 && rawDigits.startsWith('3')) {
        rawDigits = `57${rawDigits}`;
      }
      const cleanPhone = rawDigits.length >= 7 ? `+${rawDigits.slice(0, 15)}` : participant.customerPhone.trim();
      const cleanName = sanitizeInput(participant.customerName || 'Cliente VIP');
      const cleanAttendedBy = participant.attendedBy ? sanitizeInput(participant.attendedBy) : undefined;

      if (isDemo) {
        return NextResponse.json({
          success: true,
          participant: {
            id: `part-demo-${Date.now()}`,
            businessId: 'demo',
            branchId: 'demo-main',
            branchName: participant.branchName || 'Sede Principal',
            customerName: cleanName,
            customerPhone: cleanPhone,
            rating: participant.rating || 5,
            attendedBy: cleanAttendedBy,
            ticketNumber: `VIP-${Math.floor(1000 + Math.random() * 9000)}`,
            createdAt: new Date().toISOString(),
          }
        }, { status: 201 });
      }

      // 3. Blindaje: Comprobar si este número ya está registrado en este sorteo (comparando dígitos E.164)
      const existingParticipants = await getCampaignParticipants(participant.businessId);
      const pureDigits = cleanPhone.replace(/[^0-9]/g, '');
      const alreadyRegistered = existingParticipants.some(
        (p) => p.customerPhone.replace(/[^0-9]/g, '') === pureDigits
      );

      if (alreadyRegistered) {
        return NextResponse.json(
          {
            error: 'Tu número de WhatsApp ya se encuentra registrado con un ticket oficial para este sorteo.',
            alreadyRegistered: true,
          },
          { status: 400 }
        );
      }

      const saved = await addCampaignParticipant({
        ...participant,
        customerName: cleanName,
        customerPhone: cleanPhone,
        attendedBy: cleanAttendedBy,
      });

      // Registrar IP para bloqueo de 24h
      recordIpAction(clientIp, 'campaign');

      return NextResponse.json({ success: true, participant: saved });
    }

    if (action === 'mark_winner') {
      const { participantId, notifiedAt } = body;
      if (!participantId) {
        return NextResponse.json({ error: 'participantId requerido' }, { status: 400 });
      }
      const winner = await markCampaignWinner(participantId, notifiedAt);
      return NextResponse.json({ success: true, winner });
    }

    if (action === 'clear_participants') {
      const { businessId } = body;
      if (!businessId) {
        return NextResponse.json({ error: 'businessId requerido' }, { status: 400 });
      }
      await clearCampaignParticipants(businessId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Acción no reconocida' }, { status: 400 });
  } catch (error) {
    console.error('Error updating campaign participant:', error);
    return NextResponse.json({ error: 'Error al procesar acción' }, { status: 500 });
  }
}
