import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessName, customerName, complaintReason, attendedBy, branchName, plan } = body;

    // Gating check: Feature exclusively for Elite and Enterprise Plans
    if (plan !== 'elite' && plan !== 'empresarial') {
      return NextResponse.json(
        {
          error: 'Función exclusiva de Plan Élite y Plan Empresarial',
          upsell: true,
          message: 'Actualiza tu cuenta a Plan Élite o Empresarial para activar el Rescate Inteligente de Quejas en WhatsApp con Inteligencia Artificial.',
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

    // =========================================================================
    // 1. LIVE GOOGLE GEMINI 1.5 FLASH (When GEMINI_API_KEY is configured)
    // =========================================================================
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const prompt = `Eres el Gerente General de "${cleanBusiness}". Un cliente tuvo una mala experiencia en sala y dejó esta queja privada:
- Cliente: ${cleanCustomer}
- Sede: ${cleanBranch || 'Principal'}
- Motivo de molestia: "${cleanReason}"
- Atendido por: ${cleanStaff || 'Personal de turno'}
- Idioma: ${userLang === 'en' ? 'Inglés' : 'Español'}

Tu objetivo es redactar un mensaje de WHATSAPP directo para rescatarlo de inmediato.

REGLAS DE ORO DE WHATSAPP:
1. LONGITUD: Muy breve y directo (máximo 2 a 3 frases, 35 a 45 palabras). Nadie lee textos largos en WhatsApp.
2. Tono personal, empático y resolutivo. Cero lenguaje legalista.
3. Menciona brevemente el motivo "${cleanReason}" para que sienta que fue escuchado/a.

Genera un JSON con exactamente 3 opciones:
[
  {
    "tone": "${userLang === 'en' ? 'Immediate Courtesy (On the house)' : 'Compensación Inmediata (Cortesía de la casa)'}",
    "strategy": "${userLang === 'en' ? 'Invites them back with expenses covered' : 'Invita a repetir la experiencia por cuenta de la casa'}",
    "text": "..."
  },
  {
    "tone": "${userLang === 'en' ? 'Empathetic Direct Call' : 'Llamada Directa y Empatía'}",
    "strategy": "${userLang === 'en' ? 'Manager requests a quick 2-minute call to listen and resolve' : 'Gerencia pide una llamada rápida de 2 minutos para escuchar y resolver'}",
    "text": "..."
  },
  {
    "tone": "${userLang === 'en' ? 'VIP Loyalty Perk' : 'Fidelización VIP y Beneficio'}",
    "strategy": "${userLang === 'en' ? 'Grants exclusive VIP discount and gift' : 'Habilita un beneficio exclusivo y cortesía especial'}",
    "text": "..."
  }
]`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 600,
                responseMimeType: 'application/json',
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawOutput = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawOutput) {
            const parsed = JSON.parse(rawOutput);
            if (Array.isArray(parsed) && parsed.length >= 3) {
              return NextResponse.json({
                success: true,
                options: parsed,
                provider: 'Google Gemini 1.5 Flash (Official Live)',
              });
            }
          }
        }
      } catch (geminiErr) {
        console.warn('Google Gemini API live call fallback for WhatsApp rescue:', geminiErr);
      }
    }

    // =========================================================================
    // 2. ULTRA-PUNCHY LOCAL FALLBACK RESCUE ENGINE
    // =========================================================================
    const options = userLang === 'en' ? [
      {
        tone: 'Immediate Compensation (Complimentary Visit)',
        strategy: 'Offers a full on-the-house replacement experience to retain the client for life.',
        text: `Hi ${cleanCustomer}, this is management at ${cleanBusiness}${branchText}. We reviewed your comment about "${cleanReason}" with deep concern. Please accept our apologies; this is not our standard. We would love to invite you back for an experience entirely on the house. When could we welcome you this week?`,
      },
      {
        tone: 'Empathetic & Direct Resolution',
        strategy: 'Acknowledges the issue with humility, confirms internal corrective action, and opens a direct line.',
        text: `Hello ${cleanCustomer}, this is executive management at ${cleanBusiness}. I personally reviewed your feedback regarding "${cleanReason}"${enStaffText}. Your satisfaction is our priority. Could I give you a brief 2-minute call today to listen and make this right for you?`,
      },
      {
        tone: 'VIP Loyalty & Exclusive Privilege',
        strategy: 'Turns dissatisfaction into high-value loyalty by granting exclusive perks.',
        text: `Dear ${cleanCustomer}, warm regards from ${cleanBusiness}. We sincerely apologize for the inconvenience with "${cleanReason}". To make it up to you, we have activated a 30% VIP discount on your next visit plus a special welcome courtesy. May we activate this benefit for you?`,
      },
    ] : [
      {
        tone: 'Compensación Inmediata (Cortesía de la casa)',
        strategy: 'Ofrece una reposición sin costo para resarcir el error y retener al cliente de por vida.',
        text: `Hola ${cleanCustomer}, te saluda la gerencia de ${cleanBusiness}${branchText}. Leí con mucha preocupación tu reporte sobre "${cleanReason}". Te pido sinceras disculpas; ese no es nuestro estándar. Queremos invitarte a repetir tu experiencia completamente por cuenta de la casa. ¿Qué día nos podrías acompañar esta semana?`,
      },
      {
        tone: 'Empático y Resolución Inmediata',
        strategy: 'Reconoce la falla con humildad, menciona la acción correctiva interna y abre un canal directo.',
        text: `Hola ${cleanCustomer}, te escribe la administración de ${cleanBusiness}. Revisé personalmente tu comentario sobre "${cleanReason}"${staffText}. Tu tranquilidad es lo primero. ¿A qué hora te puedo marcar 2 minutos para escucharte y darte una solución justa hoy mismo?`,
      },
      {
        tone: 'Fidelización VIP y Beneficio Exclusivo',
        strategy: 'Transforma una queja en una oportunidad de lealtad haciéndolo sentir parte del círculo exclusivo.',
        text: `Hola ${cleanCustomer}, un saludo del equipo de ${cleanBusiness}. Lamentamos mucho el mal momento con "${cleanReason}". En compensación, habilitamos en tu perfil un 30% de descuento VIP para tu próxima cuenta y un detalle de bienvenida. ¿Nos confirmas para dejártelo activo?`,
      },
    ];

    return NextResponse.json({
      success: true,
      options,
      provider: 'Prestigia AI Rescue Engine (Optimized)',
    });
  } catch (error) {
    console.error('Error generating AI WhatsApp rescue:', error);
    return NextResponse.json(
      { error: 'Error al generar la propuesta de rescate con IA' },
      { status: 500 }
    );
  }
}