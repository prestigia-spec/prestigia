import { NextResponse } from 'next/server';
import { verifyAdvisorQuota } from '@/lib/studio-auth';
import { saveStudioDossier, StudioDossier } from '@/lib/db';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

interface ProspectRequest {
  businessName: string;
  category: string;
  country?: string;
  city?: string;
  neighborhood?: string;
  businessModel?: 'storefront' | 'service_area';
  targetOwnerName?: string;
  ownerPhone?: string;
  targetServices?: string;
  suggestedBudget?: string;
  advisorId?: string;
  advisorUsername?: string;
  advisorName?: string;
  lang?: 'es' | 'en';
}

export async function POST(request: Request) {
  try {
    const body: ProspectRequest = await request.json();
    const {
      businessName,
      category = 'Comercio / Servicios Locales',
      country = 'Colombia',
      city = 'Bogotá',
      neighborhood = '',
      businessModel = 'storefront',
      targetOwnerName = '',
      ownerPhone = '',
      targetServices = '',
      suggestedBudget = '',
      advisorId,
      advisorUsername,
      advisorName,
      lang = 'es',
    } = body;

    if (!businessName || !businessName.trim()) {
      return NextResponse.json({ error: 'El nombre del negocio o profesional es obligatorio.' }, { status: 400 });
    }

    // -------------------------------------------------------------
    // SERVER-SIDE SHIELD: Verify Advisor Quota & License (Tab 5: tools)
    // -------------------------------------------------------------
    const callerId = advisorId || advisorUsername || 'adv-luisma';
    const quotaCheck = await verifyAdvisorQuota(callerId, 'tools');
    if (!quotaCheck.authorized) {
      return NextResponse.json(
        {
          success: false,
          error: quotaCheck.error,
          code: quotaCheck.code,
          quotaExhausted: quotaCheck.code === 'QUOTA_EXHAUSTED',
          accountSuspended: quotaCheck.code === 'ACCOUNT_SUSPENDED',
          effectiveQuota: quotaCheck.effectiveQuota,
          usedCount: quotaCheck.usedCount,
          remainingCredits: 0,
        },
        { status: quotaCheck.status }
      );
    }

    const cleanName = businessName.trim();
    const cleanCity = city.trim() || 'Bogotá';
    const cleanCountry = country.trim() || 'Colombia';
    const cleanNeighborhood = neighborhood.trim();
    const cleanCategory = category.trim() || 'Servicios Especializados';
    const cleanOwner = targetOwnerName.trim() || 'Estimado Propietario / Director';
    const cleanPhone = ownerPhone.trim();
    const cleanServices = targetServices.trim() || 'servicios y atención profesional';
    const isSAB = businessModel === 'service_area';
    const isEn = lang === 'en';

    let generatedProposal: any = null;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      try {
        const cleanAdvisor = advisorName && !advisorName.toLowerCase().includes('luisma') ? advisorName : 'tu consultor especialista en Google Maps';
        const prompt = `You are a Senior Local Market Intelligence Forensics Director and Commercial Specialist.
Generate a high-converting, authoritative, and persuasive COMMERCIAL PROPOSAL / PITCH for a business or independent professional who currently DOES NOT have an optimized Google Maps Business Profile (or is completely invisible on the local map).

CONTEXT & COMPETITIVE AUDIT SIMULATION:
The proposal must be framed AS IF our local market intelligence engine has just conducted a rigorous competitive benchmark study of the local businesses operating in "${cleanNeighborhood || cleanCity}, ${cleanCity}".
You must prove to the business owner that their local competitors are currently capturing 75% to 85% of all high-ticket phone calls, appointments, and walk-ins solely because they appear on Google Maps, even when their service may be inferior.
Show them how having a perfectly crafted, verified, and authoritative Google Maps profile built under our professional architecture will make them SELL SIGNIFICANTLY MORE THAN THEIR COMPETITORS, capturing market share and establishing them as the #1 undisputed trusted choice in their zone.

CRITICAL WHITE-LABEL RULE:
DO NOT mention "Prestigia" anywhere in the proposal or WhatsApp pitch. It must be 100% WHITE-LABEL so any digital agency, independent consultant, or sales partner can deliver it as their own proprietary service.

INPUT DATA:
- Target Business/Professional Name: "${cleanName}"
- Owner/Decision Maker: "${cleanOwner}"
- Niche/Industry: "${cleanCategory}"
- Country & City: "${cleanCity}, ${cleanCountry}"
- Specific Neighborhood/District: "${cleanNeighborhood || 'Zona comercial y residencial'}"
- Flagship Specialties/Services: "${cleanServices}"
- Business Model: ${isSAB ? 'Independent / Service Area Business (At-home or mobile services)' : 'Storefront with Physical Location'}
- Target Phone/WhatsApp: "${cleanPhone || 'Línea de contacto'}"
- Language: ${isEn ? 'ENGLISH' : 'SPANISH'}

CORE SALES PSYCHOLOGY PILLARS TO HIGHLIGHT:
1. "Sell More Than Competitors": Clearly state how a superior Google Maps architecture (exact secondary categories, Geo-tagging, keywords, and trust badges) will outrank and outperform local competitors.
2. "High-Intent Buyers": In Google Maps, customers don't browse for fun; they search with immediate purchase intent (emergency, appointment, immediate visit).
3. "The Cost of Invisibility": Quantify in local currency the revenue leaking directly into competitor bank accounts each month.
4. "Absolute Asset Ownership": Deliver 100% full ownership directly to the client's Gmail with zero mandatory retainers.

STRUCTURE TO PRODUCE (STRICT VALID JSON ONLY, NO MARKDOWN WRAPPERS):
{
  "headline": "...",
  "executiveSummary": "Deep analysis citing the competitive benchmark conducted in the zone, proving the massive demand and how this listing will outperform nearby competitors.",
  "monthlySearchStats": {
    "estimatedSearchesInZone": "ej: 3.800 - 5.600 búsquedas mensuales de alta intención en la zona",
    "searchKeywords": ["...", "...", "..."],
    "intentLevel": "Alta Intención de Compra Inmediata (Más del 84% de usuarios llama o visita en menos de 24h)"
  },
  "invisibilityDiagnosis": {
    "currentSituation": "...",
    "estimatedLostClientsMonthly": "ej: 25 a 45 clientes calificados mensuales desviados a competidores",
    "estimatedLostRevenueMonthly": "ej: Facturación estimada que hoy absorben competidores cercanos",
    "competitorImpact": "Detailed forensic diagnosis of how local competitors in ${cleanNeighborhood || cleanCity} are currently monopolizing calls simply by having an active pin, and how an optimized listing will capture those customers back."
  },
  "solutionRoadmap": [
    {
      "step": 1,
      "title": "Arquitectura de Dominio Local & Verificación Oficial",
      "description": "..."
    },
    {
      "step": 2,
      "title": "Ingeniería de Categorías & Palabras Clave de Conversión",
      "description": "..."
    },
    {
      "step": 3,
      "title": "Catálogo de Servicios de Alta Conversión & Geotagging",
      "description": "..."
    },
    {
      "step": 4,
      "title": "Activación de Botones de Compra Rápida & Embudo de Reseñas 5★",
      "description": "..."
    }
  ],
  "deliverablesList": [
    "Ficha oficial verificada y optimizada bajo el estándar oficial de Google Business Profile.",
    "Traspaso del 100% de la propiedad legal y directa a tu correo Gmail sin ataduras.",
    "Optimización de palabras clave para superar a los competidores locales de tu sector.",
    "Botones de contacto inmediato (Llamada directa, WhatsApp y ubicación en tiempo real).",
    "Kit estratégico de bienvenida con QR oficial para mostrador y guía de captación de reseñas 5 estrellas."
  ],
  "investmentOffer": {
    "setupFee": "${suggestedBudget || (isEn ? '$180 USD' : '$150 - $250 USD')}",
    "deliveryDays": "3 a 5 días hábiles",
    "ownershipGuarantee": "Propiedad total y definitiva entregada a tu nombre. Tu ficha es un activo digital permanente que trabajará 24/7 para tu negocio.",
    "callToAction": "Activa tu ficha esta semana, supera a los competidores de tu sector y convierte cada búsqueda local en llamadas y clientes reales."
  },
  "whatsappPitchMessage": "A natural, polite, and persuasive WhatsApp message from the commercial specialist to ${cleanOwner} (${cleanPhone || ''}). MUST BE 100% WHITE-LABEL (NEVER say 'de Prestigia' or any third-party brand). Introduce as: 'Te escribe ${cleanAdvisor}'. Mentions that an executive market study for ${cleanCategory} in ${cleanNeighborhood || cleanCity} was completed, showing that local competitors are absorbing dozens of urgent calls every week, and offers to share this 1-page summary so ${cleanName} can capture those clients immediately."
}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.3,
                responseMimeType: 'application/json',
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            generatedProposal = JSON.parse(rawText.trim());
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini proposal call error, falling back to algorithmic engine:', geminiErr);
      }
    }

    // High-converting fallback if Gemini is offline
    if (!generatedProposal) {
      const locText = cleanNeighborhood ? `${cleanNeighborhood}, ${cleanCity}` : cleanCity;
      generatedProposal = {
        headline: `Auditoría de Demanda & Plan de Captación para ${cleanName}`,
        executiveSummary: `Tras realizar un estudio forense de la demanda local en ${locText}, confirmamos que más del 82% de las llamadas y citas de "${cleanCategory}" se las están repartiendo actualmente los competidores que ya cuentan con un pin activo en Google Maps. Con nuestra arquitectura estratégica de posicionamiento local, implementaremos una ficha superior que posicionará a ${cleanName} como la opción #1 en confianza y volumen de clientes de la zona.`,
        monthlySearchStats: {
          estimatedSearchesInZone: '3.600 a 5.400 búsquedas mensuales con intención de compra',
          searchKeywords: [
            `${cleanCategory} en ${locText}`,
            `${cleanCategory} cerca de mí`,
            `Mejor ${cleanCategory} ${cleanCity}`,
          ],
          intentLevel: 'Alta Intención Comercial Inmediata (86% de los usuarios llama o acude en menos de 24 horas)',
        },
        invisibilityDiagnosis: {
          currentSituation: `Tu actividad comercial permanece invisible en el mapa satelital de Google mientras tus clientes potenciales buscan activamente ${cleanServices}.`,
          estimatedLostClientsMonthly: '25 a 45 clientes calificados mensuales desviados a competidores',
          estimatedLostRevenueMonthly: 'Aproximadamente $900 - $2.200 USD en facturación que hoy absorbe tu competencia directa',
          competitorImpact: `Los negocios de tu categoría en ${locText} están absorbiendo el flujo diario de llamadas únicamente porque aparecen en el mapa, a pesar de que tu calidad y atención pueden ser muy superiores. Al activar una ficha optimizada, recuperarás esa cuota de mercado.`,
        },
        solutionRoadmap: [
          {
            step: 1,
            title: 'Verificación Oficial & Blindaje de Perfil',
            description: 'Configuración técnica bajo el protocolo oficial de Google Business Profile para garantizar máxima autoridad desde el día 1.',
          },
          {
            step: 2,
            title: 'Ingeniería de Categorías para Superar Rivales',
            description: `Configuración precisa de categoría principal y secundarias para interceptar las búsquedas que hoy captan tus competidores en "${cleanCategory}".`,
          },
          {
            step: 3,
            title: 'Catálogo de Servicios de Alta Conversión & Geotagging',
            description: 'Estructuración persuasiva de servicios, fotos optimizadas con coordenadas locales y textos enfocados en cerrar llamadas.',
          },
          {
            step: 4,
            title: 'Canales de Contacto Rápido & Embudo 5★',
            description: 'Botones directos de llamada y WhatsApp, más el protocolo automatizado para acumular reseñas positivas y generar confianza inmediata.',
          },
        ],
        deliverablesList: [
          'Ficha oficial de Google Maps 100% verificada, configurada y optimizada para dominar tu zona.',
          'Entrega del 100% de la propiedad legal y directa en tu cuenta personal de Gmail (sin contratos forzosos ni mensualidades).',
          'Catálogo comercial de especialidades con optimización SEO para superar a la competencia de tu sector.',
          'Botones de contacto inmediato para recibir llamadas telefónicas y mensajes de WhatsApp directamente en tu móvil.',
          'QR oficial listo para imprimir y guía práctica para recolectar reseñas 5 estrellas de tus clientes satisfechos.',
        ],
        investmentOffer: {
          setupFee: suggestedBudget || '$150 USD (Pago Único de Implementación)',
          deliveryDays: '3 a 5 días hábiles',
          ownershipGuarantee: '100% de propiedad entregada a tu nombre sin cláusulas de permanencia ni cobros mensuales obligatorios.',
          callToAction: 'Activa tu ficha en Google Maps esta misma semana, supera a los competidores de tu zona y empieza a recibir las llamadas de los clientes que hoy no te ven.',
        },
        whatsappPitchMessage: `¡Hola, ${cleanOwner}! 👋 Te escribe ${advisorName || 'un consultor especialista en Google Maps'}.

Estuvimos realizando un estudio de mercado sobre búsquedas en Google de *${cleanCategory}* en la zona de *${locText}*, y detectamos un dato muy importante para *${cleanName}*:

📊 En tu sector se realizan más de *3.500 búsquedas al mes* de clientes con urgencia de compra, pero la gran mayoría de esas llamadas se las están llevando los mismos 2 o 3 competidores de tu calle simplemente porque ellos sí aparecen en Google Maps.

Hemos preparado un breve informe ejecutivo de 1 página que muestra cómo activar tu ficha oficial con un posicionamiento superior para que comiences a captar esas llamadas esta misma semana.

¿Te comparto el documento resumen por aquí para que lo mires en 2 minutos? 🚀`,
      };
    }

    // -------------------------------------------------------------
    // AUTOMATIC FORENSIC DOSSIER STORAGE (Type: prospect)
    // -------------------------------------------------------------
    const dossierId = `dos-prospect-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newDossier: StudioDossier = {
      id: dossierId,
      advisorId: quotaCheck.advisor?.id || 'adv-luisma',
      advisorName: quotaCheck.advisor?.name || advisorName || 'Luisma • Director General',
      advisorPhone: cleanPhone,
      country: cleanCountry,
      clientName: cleanName,
      contactName: cleanOwner,
      contactPhone: cleanPhone,
      category: cleanCategory,
      city: cleanCity,
      neighborhood: cleanNeighborhood,
      mode: 'prospect',
      businessModel: isSAB ? 'service_area' : 'storefront',
      status: 'presented',
      deletedByAdvisor: false,
      closingStatus: 'proposal_sent',
      data: {
        prospectProposal: generatedProposal,
        category: cleanCategory,
        city: cleanCity,
        neighborhood: cleanNeighborhood,
        businessName: cleanName,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveStudioDossier(newDossier);

    return NextResponse.json({
      success: true,
      proposal: generatedProposal,
      dossierId,
      remainingCredits: quotaCheck.isMaster ? 9999 : Math.max(0, (quotaCheck.remainingCredits ?? 1) - 1),
    });
  } catch (error: any) {
    console.error('Error generating prospect proposal:', error);
    return NextResponse.json({ error: 'Error procesando propuesta comercial' }, { status: 500 });
  }
}
