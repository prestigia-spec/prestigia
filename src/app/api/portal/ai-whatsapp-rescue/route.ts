import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessName, customerName, complaintReason, attendedBy, branchName, plan } = body;

    // Gating check: Feature exclusively for Elite Plan
    if (plan !== 'elite') {
      return NextResponse.json(
        {
          error: 'Función exclusiva de Plan Élite',
          upsell: true,
          message: 'Actualiza tu cuenta a Plan Élite para activar el Rescate Inteligente de Quejas en WhatsApp con Inteligencia Artificial.',
        },
        { status: 403 }
      );
    }

    const cleanCustomer = (customerName || 'estimado cliente').trim();
    const cleanBusiness = (businessName || 'nuestro negocio').trim();
    const cleanReason = (complaintReason || '').trim();
    const cleanStaff = (attendedBy || '').trim();
    const cleanBranch = (branchName || '').trim();

    const branchText = cleanBranch ? ` (${cleanBranch})` : '';
    const staffText = cleanStaff ? ` y ya estamos tomando medidas con ${cleanStaff} y el equipo de turno` : '';
    const enStaffText = cleanStaff ? ` and we are already taking corrective steps with ${cleanStaff} and the shift team` : '';

    const userLang = body.lang || (/[a-zA-Z]{4,}/.test(cleanReason) && !/[áéíóúñ¿¡]/i.test(cleanReason) && /\b(the|was|and|very|service|waiter|food|order|cold|dirty|rude|slow|manager)\b/i.test(cleanReason) ? 'en' : 'es');

    const options = userLang === 'en' ? [
      {
        tone: 'Immediate Compensation (Complimentary Visit)',
        strategy: 'Offers a full on-the-house replacement experience to retain the client for life.',
        text: `Hi ${cleanCustomer}, this is executive management at ${cleanBusiness}${branchText}. We received your feedback regarding: "${cleanReason}" with deep concern. Please accept our sincere apologies; this does not meet our standard of excellence. To make things right, we would love to invite you back for an experience entirely on us. Would you like to schedule your visit for this week?`,
      },
      {
        tone: 'Empathetic & Direct Resolution',
        strategy: 'Acknowledges the issue with humility, confirms internal corrective action, and opens a direct line.',
        text: `Hello ${cleanCustomer}, this is management at ${cleanBusiness}. I personally reviewed your comment regarding: "${cleanReason}". I am truly sorry you did not receive the impeccable hospitality you deserve${enStaffText}. Your satisfaction is our top priority. When would be a good time for a quick 2-minute call today so I can listen and ensure a fair resolution?`,
      },
      {
        tone: 'VIP Loyalty & Exclusive Privilege',
        strategy: 'Turns dissatisfaction into high-value loyalty by granting exclusive perks.',
        text: `Dear ${cleanCustomer}, warm regards from ${cleanBusiness}. We sincerely apologize for the inconvenience with "${cleanReason}". To show our appreciation for your honesty, we have credited your profile with an exclusive 30% VIP courtesy discount on your next visit, along with a special welcome gift from our team. May we confirm your details to activate this benefit?`,
      },
    ] : [
      {
        tone: 'Compensación Inmediata (Cortesía / Reposición)',
        strategy: 'Ofrece una reposición o invitación sin costo para resarcir el error y retener al cliente de por vida.',
        text: `Hola ${cleanCustomer}, te saluda la gerencia de ${cleanBusiness}${branchText}. Vimos con mucha preocupación tu reporte respecto a: "${cleanReason}". Queremos pedirte sinceras disculpas; ese no es nuestro estándar de calidad. Para compensar este mal momento, queremos invitarte a repetir tu experiencia completamente por cuenta de la casa. ¿Te gustaría coordinar tu visita para este fin de semana?`,
      },
      {
        tone: 'Empático y Resolución Inmediata',
        strategy: 'Reconoce la falla con humildad, menciona la acción correctiva interna y abre un canal directo.',
        text: `Hola ${cleanCustomer}, te escribe la administración de ${cleanBusiness}. Acabo de revisar personalmente tu comentario sobre: "${cleanReason}". Lamento profundamente que no hayas tenido la atención impecable que mereces${staffText}. Tu satisfacción es nuestra prioridad número uno. ¿A qué hora te puedo llamar 2 minutos para escucharte y darte una solución justa hoy mismo?`,
      },
      {
        tone: 'Fidelización VIP y Descuento Exclusivo',
        strategy: 'Transforma una queja en una oportunidad de lealtad haciéndolo sentir parte del círculo exclusivo.',
        text: `Hola ${cleanCustomer}, te saludamos con mucho aprecio desde ${cleanBusiness}. Lamentamos mucho el inconveniente con "${cleanReason}". En compensación, hemos habilitado en nuestro sistema un bono especial del 30% de descuento en tu próxima cuenta, además de un detalle de cortesía de bienvenida. Queremos demostrarte la verdadera calidad de nuestro servicio. ¿Nos confirmas para activar tu beneficio?`,
      },
    ];

    return NextResponse.json({
      success: true,
      options,
    });
  } catch (error) {
    console.error('Error generating AI WhatsApp rescue:', error);
    return NextResponse.json(
      { error: 'Error al generar la propuesta de rescate con IA' },
      { status: 500 }
    );
  }
}
