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
        const prompt = `You are Prestigia's Senior Commercial Director and Local Market Forensics Specialist.
Generate a high-converting, professional, and convincing COMMERCIAL PROPOSAL / PITCH for a business or independent professional who currently DOES NOT have an optimized Google Maps Business Profile (or is completely invisible on the local map).

INPUT DATA:
- Target Business/Professional Name: "${cleanName}"
- Owner/Decision Maker: "${cleanOwner}"
- Niche/Industry: "${cleanCategory}"
- Country & City: "${cleanCity}, ${cleanCountry}"
- Specific Neighborhood/District: "${cleanNeighborhood || 'Zona central / comercial'}"
- Flagship Specialties/Services: "${cleanServices}"
- Business Model: ${isSAB ? 'Independent / Service Area Business (At-home or mobile services)' : 'Storefront with Physical Location'}
- Target Phone/WhatsApp: "${cleanPhone || 'Línea de contacto'}"
- Language: ${isEn ? 'ENGLISH' : 'SPANISH'}

OBJECTIVE:
The proposal must convince the owner why having an official, optimized Google Maps listing will directly increase their daily phone calls, customers, and monthly revenue, while demonstrating the high cost of remaining invisible.

STRUCTURE TO PRODUCE (STRICT VALID JSON ONLY, NO MARKDOWN WRAPPERS):
{
  "headline": "...",
  "executiveSummary": "...",
  "monthlySearchStats": {
    "estimatedSearchesInZone": "ej: 3.400 - 5.200 búsquedas al mes",
    "searchKeywords": ["...", "...", "..."],
    "intentLevel": "Alta Intención de Compra (82% de personas llaman en menos de 24h)"
  },
  "invisibilityDiagnosis": {
    "currentSituation": "...",
    "estimatedLostClientsMonthly": "ej: 25 a 45 clientes potenciales cada mes",
    "estimatedLostRevenueMonthly": "ej: $3.500.000 a $6.000.000 COP (o $1.200 - $2.000 USD)",
    "competitorImpact": "..."
  },
  "solutionRoadmap": [
    {
      "step": 1,
      "title": "...",
      "description": "..."
    },
    {
      "step": 2,
      "title": "...",
      "description": "..."
    },
    {
      "step": 3,
      "title": "...",
      "description": "..."
    },
    {
      "step": 4,
      "title": "...",
      "description": "..."
    }
  ],
  "deliverablesList": [
    "...",
    "...",
    "...",
    "...",
    "..."
  ],
  "investmentOffer": {
    "setupFee": "${suggestedBudget || (isEn ? '$180 USD' : '$150 - $250 USD')}",
    "deliveryDays": "3 a 5 días hábiles",
    "ownershipGuarantee": "Propiedad total y directa entregada en el correo Gmail del cliente sin ataduras.",
    "callToAction": "..."
  },
  "whatsappPitchMessage": "A ready-to-send polite, compelling, high-converting WhatsApp pitch for the advisor to send directly to ${cleanOwner} (${cleanPhone || ''}). Must be respectful, mentioning their exact location in ${cleanNeighborhood || cleanCity}, the search volume of clients they are missing, and inviting to a 5-minute call or showing a live demonstration."
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
        headline: `Propuesta de Activación & Posicionamiento en Google Maps para ${cleanName}`,
        executiveSummary: `Actualmente, cientos de clientes en ${locText} buscan activamente "${cleanCategory}" desde sus teléfonos móviles. Al no contar con una ficha verificada y optimizada en Google Maps, el 100% de esta demanda se está desviando directamente hacia tus competidores visibles en el mapa.`,
        monthlySearchStats: {
          estimatedSearchesInZone: '2.800 a 4.500 búsquedas mensuales',
          searchKeywords: [
            `${cleanCategory} en ${locText}`,
            `${cleanCategory} cerca de mí`,
            `Mejor ${cleanCategory} ${cleanCity}`,
          ],
          intentLevel: 'Alta Intención Comercial (86% de usuarios llaman o visitan en menos de 24 horas)',
        },
        invisibilityDiagnosis: {
          currentSituation: `Tu negocio o actividad profesional no aparece en el mapa local cuando los clientes necesitan ${cleanServices}.`,
          estimatedLostClientsMonthly: '20 a 35 clientes calificados al mes',
          estimatedLostRevenueMonthly: 'Aproximadamente $800 - $1.500 USD en facturación perdida',
          competitorImpact: 'Los 3 negocios ubicados en el Top 3 local se están quedando con más del 70% de las llamadas y citas de la zona.',
        },
        solutionRoadmap: [
          {
            step: 1,
            title: 'Creación & Verificación Oficial',
            description: 'Estructuración técnica de tu ficha comercial con el protocolo oficial de Google Business Profile.',
          },
          {
            step: 2,
            title: 'Arquitectura de Categorías & Palabras Clave',
            description: `Configuración de categoría principal y secundarias exactas para dominar búsquedas de "${cleanCategory}".`,
          },
          {
            step: 3,
            title: 'Catálogo de Servicios & Geotagging',
            description: 'Redacción persuasiva de tus servicios destacados con optimización visual de autoridad local.',
          },
          {
            step: 4,
            title: 'Activación de Canales de Contacto Directo',
            description: 'Botones inmediatos de llamada telefónica, WhatsApp y enlace a Google Maps para recibir clientes.',
          },
        ],
        deliverablesList: [
          'Ficha oficial de Google Maps 100% configurada y lista.',
          'Entrega de propiedad total en tu propia cuenta de Gmail.',
          'Catálogo de servicios y especialidades estructurado con SEO local.',
          'Guía de 10 fotos estratégicas y protocolo para recibir 5 estrellas.',
          'QR oficial para mostrador o tarjetas de presentación.',
        ],
        investmentOffer: {
          setupFee: suggestedBudget || '$150 USD (Pago Único de Implementación)',
          deliveryDays: '3 a 5 días hábiles',
          ownershipGuarantee: '100% de propiedad entregada a tu nombre, sin mensualidades obligatorias ni contratos forzosos.',
          callToAction: 'Activa tu presencia comercial en Google Maps esta semana y comienza a captar los clientes que hoy se lleva tu competencia.',
        },
        whatsappPitchMessage: `¡Hola, ${cleanOwner}! 👋 Te escribe ${advisorName || 'un consultor de Prestigia'}.

Estuve revisando las búsquedas en Google de *${cleanCategory}* en la zona de *${locText}*, y detecté una oportunidad enorme para *${cleanName}*:

📊 En tu sector se realizan más de *3.000 búsquedas al mes* de clientes que necesitan exactamente tus servicios, pero hoy tu negocio no aparece en el mapa de Google, lo que significa que esos clientes están llamando directamente a tu competencia.

Hemos preparado una propuesta ejecutiva de 1 página para activar y posicionar tu ficha oficial en Google Maps en tiempo récord, para que cada persona que busque en tu zona te encuentre de primero.

¿Te comparto el documento resumen por aquí para que lo revises en 2 minutos? 🚀`,
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
