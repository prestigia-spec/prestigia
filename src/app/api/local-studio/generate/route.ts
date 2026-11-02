import { NextResponse } from 'next/server';

interface GenerateRequest {
  mode: 'create' | 'audit';
  businessName: string;
  category: string;
  city: string;
  neighborhood?: string;
  specialties?: string;
  phone?: string;
  googleUrl?: string;
  existingRating?: number;
  existingReviews?: number;
  lang?: 'es' | 'en';
  businessModel?: 'storefront' | 'service_area';
  serviceAreas?: string;
}

export async function POST(request: Request) {
  try {
    const body: GenerateRequest = await request.json();
    const {
      mode = 'create',
      businessName,
      category = 'Restaurante / Gastronomía',
      city = 'Bogotá',
      neighborhood = '',
      specialties = '',
      phone = '',
      googleUrl = '',
      existingRating = 4.2,
      existingReviews = 45,
      lang = 'es',
      businessModel = 'storefront',
      serviceAreas = '',
    } = body;

    if (!businessName || !businessName.trim()) {
      return NextResponse.json({ error: 'El nombre del negocio es obligatorio' }, { status: 400 });
    }

    const cleanName = businessName.trim();
    const cleanCity = city.trim() || 'Colombia';
    const cleanNeighborhood = neighborhood.trim();
    const cleanSpecialties = specialties.trim();
    const cleanPhone = phone.trim();
    const cleanServiceAreas = serviceAreas.trim();
    const isEn = lang === 'en';
    const isSAB = businessModel === 'service_area';

    const effectiveReviews = mode === 'create' ? 0 : (Number(existingReviews) || 0);
    const targetTop3Reviews = mode === 'create' ? 100 : Math.max(120, effectiveReviews + 80);
    const neededReviews = Math.max(0, targetTop3Reviews - effectiveReviews);
    const reviewsPerWeek = 8;
    const weeksToTop3 = Math.ceil(neededReviews / reviewsPerWeek) || (mode === 'create' ? 13 : 10);

    // -------------------------------------------------------------
    // 1. LIVE GEMINI 1.5 FLASH ENGINE
    // -------------------------------------------------------------
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const prompt = `You are the Lead Google Business Profile & Local SEO Architect at Prestigia.
Your task is to generate the EXACT technical architecture and winning Google Maps Top 3 (Local 3-Pack) setup for the following business.
Language of the entire output: ${isEn ? 'ENGLISH (USA Market Standard)' : 'SPANISH (LatAm Standard)'}.

BUSINESS SPECIFICATIONS:
- Mode: ${mode === 'create' ? 'BUILD NEW PROFILE FROM SCRATCH' : 'FORENSIC AUDIT & TOP 3 UPGRADE'}
- Business Model: ${isSAB ? 'SERVICE AREA BUSINESS / INDEPENDENT PROFESSIONAL (SAB - No physical customer storefront, travels to client or works remotely)' : 'STOREFRONT WITH PHYSICAL ADDRESS (Customers visit location)'}
- Business Name: "${cleanName}"
- Sector/Category: "${category}"
- City / State / Metro Area: "${cleanCity}"
- Neighborhood / Zone: "${cleanNeighborhood || 'Central commercial district'}"
- Coverage / Target Areas (if SAB): "${cleanServiceAreas || 'Key affluent neighborhoods across ' + cleanCity}"
- Star Specialties / Top Services: "${cleanSpecialties || 'High demand flagship services'}"
- Official Phone / WhatsApp: "${cleanPhone || 'Direct line'}"
- Existing Rating & Reviews (if audit): ${existingRating}★ (${existingReviews} reviews)

CRITICAL QUALITY RULES (FACTUAL & RELEVANT - NO INVENTED INFO - NO FILLER):
1. "primaryCategory": The exact official Google Business Profile primary category matching the business and specialties.
2. "secondaryCategories": Exactly 4 to 5 official Google secondary categories strictly relevant to the business. NEVER include unrelated categories (e.g. do NOT include 'Bar and grill' for a pasta restaurant).
3. "optimizedTitle": Strategic title following formula: "[Brand Name] | [Core Category/Specialty] en [City/Area]".
4. "commercialDescription": Factual, clear, professional overview describing the business, exact specialties provided, service formats (dine-in, takeout, delivery), and direct WhatsApp contact. ABSOLUTELY NO generic marketing fluff, NO pompous claims (e.g. do not invent 'referente', 'el mejor', 'apasionados'), NO unverified assumptions (e.g. do NOT invent wine, valet parking, or services not specified).
5. "serviceCatalog": Array derived STRICTLY from the user's provided specialties/products. DO NOT invent fictitious products or services.
6. "photoChecklist": Array of 5 required photo types with geotagged SEO recommended filenames. ${isSAB ? 'For independents/SAB: Focus on professional equipment, tools, work vehicle, laptop/workspace, and smiling specialist.' : 'For storefronts: Focus on facade, illuminated sign, interior, star dishes/products, and team.'}
7. "preventiveFaqs": Exactly 5 strategic Q&As addressing common customer objections.
8. "verificationGuide": Foolproof 60-90 second continuous video verification guide. ${isSAB ? 'CRITICAL FOR INDEPENDENTS/SAB: Google does NOT accept an empty house. Must detail Take 1 (Professional tools, branded materials, active work equipment), Take 2 (Official tax/business registration matching address privately, utility bill, physical business cards), Take 3 (Branded work vehicle with tools or dedicated workspace).' : 'For storefronts: Take 1 (Street sign and exterior facade), Take 2 (Unlocking front door with keys), Take 3 (Cash register, POS terminal, POS software).'}
9. "whatsappOnboardingMessage": Complete and professional message ready to copy & paste to the client requesting all photos, verification video, and details in one go.
10. "suggestedServiceAreas": ${isSAB ? 'Array of 8 to 10 affluent target neighborhoods, zip codes, or sub-cities where the independent professional should register service coverage in Google Maps without showing home address.' : '[]'}
11. "hidePhysicalAddress": ${isSAB ? true : false}
12. "nfcPocketReviewGuide": Protocol for collecting instant 5-star Google reviews on-site (using pocket NFC cards or immediate post-service WhatsApp dispatch).
13. "reviewVelocityPlan": Object with currentReviews (${effectiveReviews}), targetTop3Reviews (${targetTop3Reviews}), neededReviews (${neededReviews}), recommended pace reviewsPerWeek (8), and estimated weeksToTop3 (${weeksToTop3}).
14. "monthlyPostsBooster": Array of 4 weekly Google Business Profile posts (Week 1: Flagship Service, Week 2: Problem & Solution, Week 3: Trust/Certification/Behind the Scenes, Week 4: Limited Booking Offer) with title, body, and CTA button.
${mode === 'audit' ? `15. For Audit Mode: "healthScore" (40-68), "criticalGaps" (4-5 gaps), "topCompetitorInsights" (concise 90-day win strategy), and "actionRoadmap" (5 prioritized steps with impact: CRÍTICO/ALTO/MEDIO).` : ''}

RETURN ONLY A VALID JSON OBJECT WITH THIS STRUCTURE (NO MARKDOWN WRAPPERS, NO EXTRA TEXT):
{
  "businessModel": "${isSAB ? 'service_area' : 'storefront'}",
  "hidePhysicalAddress": ${isSAB ? true : false},
  "primaryCategory": "...",
  "secondaryCategories": ["...", "...", "...", "...", "..."],
  "optimizedTitle": "...",
  "commercialDescription": "...",
  "serviceCatalog": [
    { "name": "...", "description": "...", "tag": "..." }
  ],
  "photoChecklist": [
    { "item": "...", "count": 2, "tip": "...", "filenameExample": "..." }
  ],
  "preventiveFaqs": [
    { "question": "...", "answer": "..." }
  ],
  "verificationGuide": {
    "title": "...",
    "overview": "...",
    "cameraTake1": "...",
    "cameraTake2": "...",
    "cameraTake3": "...",
    "documents": ["...", "..."]
  },
  "whatsappOnboardingMessage": "...",
  "suggestedServiceAreas": ["...", "...", "...", "..."],
  "nfcPocketReviewGuide": {
    "title": "...",
    "steps": ["...", "...", "..."],
    "samplePitch": "..."
  },
  "reviewVelocityPlan": {
    "currentReviews": ${effectiveReviews},
    "targetTop3Reviews": ${targetTop3Reviews},
    "neededReviews": ${neededReviews},
    "reviewsPerWeek": ${reviewsPerWeek},
    "weeksToTop3": ${weeksToTop3}
  },
  "monthlyPostsBooster": [
    { "week": 1, "type": "Destacado", "title": "...", "body": "...", "callToAction": "..." },
    { "week": 2, "type": "Solución", "title": "...", "body": "...", "callToAction": "..." },
    { "week": 3, "type": "Autoridad", "title": "...", "body": "...", "callToAction": "..." },
    { "week": 4, "type": "Oferta", "title": "...", "body": "...", "callToAction": "..." }
  ]${mode === 'audit' ? `,
  "healthScore": 58,
  "criticalGaps": ["...", "...", "...", "..."],
  "topCompetitorInsights": "...",
  "actionRoadmap": [
    { "step": 1, "title": "...", "impact": "CRÍTICO", "action": "..." }
  ]` : ''}
}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 2500,
                responseMimeType: 'application/json',
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const aiData = await geminiRes.json();
          const candidateText = aiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            let clean = candidateText.trim();
            if (clean.startsWith('```')) {
              clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
            }
            const firstBrace = clean.indexOf('{');
            const lastBrace = clean.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
              clean = clean.substring(firstBrace, lastBrace + 1);
            }
            const parsed = JSON.parse(clean);
            return NextResponse.json({ success: true, engine: 'gemini-1.5-flash', data: parsed });
          }
        } else {
          const errBody = await geminiRes.text();
          console.warn('[LocalStudio AI] Gemini API error:', geminiRes.status, errBody);
        }
      } catch (geminiErr) {
        console.warn('[LocalStudio AI] Gemini fallback activated:', geminiErr);
      }
    }

    // -------------------------------------------------------------
    // 2. DETERMINISTIC HEURISTIC LOCAL ENGINE (Zero-Downtime Fallback)
    // -------------------------------------------------------------
    const fallbackData = buildFallbackBlueprint({
      mode,
      businessName: cleanName,
      category,
      city: cleanCity,
      neighborhood: cleanNeighborhood,
      specialties: cleanSpecialties,
      phone: cleanPhone,
      existingRating,
      existingReviews,
      lang: isEn ? 'en' : 'es',
      businessModel,
      serviceAreas: cleanServiceAreas,
    });

    return NextResponse.json({ success: true, engine: 'heuristic-local', data: fallbackData });
  } catch (error: any) {
    console.error('Error generating Local Studio blueprint:', error);
    return NextResponse.json(
      { error: 'Error procesando la solicitud del Local Studio', details: error?.message },
      { status: 500 }
    );
  }
}

function detectTaxonomy(params: {
  category: string;
  specialties: string;
  businessName: string;
  isEn: boolean;
}) {
  const combined = `${params.category} ${params.specialties} ${params.businessName}`.toLowerCase();
  const isEn = params.isEn;

  // 1. GASTRONOMÍA
  if (
    combined.includes('restauran') ||
    combined.includes('gastro') ||
    combined.includes('comida') ||
    combined.includes('alimento') ||
    combined.includes('pasta') ||
    combined.includes('lasa') ||
    combined.includes('pizza') ||
    combined.includes('burger') ||
    combined.includes('hamburgues') ||
    combined.includes('carne') ||
    combined.includes('parrilla') ||
    combined.includes('sushi') ||
    combined.includes('cafe') ||
    combined.includes('café') ||
    combined.includes('bar')
  ) {
    // 1A. Pastas / Italiano / Lasaña
    if (
      combined.includes('pasta') ||
      combined.includes('lasa') ||
      combined.includes('ital') ||
      combined.includes('spoleto') ||
      combined.includes('trattoria') ||
      combined.includes('ravioli') ||
      combined.includes('espaguet') ||
      combined.includes('risotto')
    ) {
      return {
        primaryCategory: isEn ? 'Italian Restaurant' : 'Restaurante italiano',
        secondaryCategories: isEn
          ? ['Pasta Shop', 'Takeout Restaurant', 'Meal Delivery', 'Family Style Restaurant', 'Lunch Restaurant']
          : ['Restaurante de pastas', 'Comida para llevar', 'Entrega a domicilio', 'Restaurante familiar', 'Restaurante para almorzar'],
      };
    }

    // 1B. Pizza
    if (combined.includes('pizza') || combined.includes('pizzer')) {
      return {
        primaryCategory: isEn ? 'Pizza Restaurant' : 'Pizzería',
        secondaryCategories: isEn
          ? ['Takeout Restaurant', 'Meal Delivery', 'Italian Restaurant', 'Fast Food Restaurant', 'Family Style Restaurant']
          : ['Comida para llevar', 'Entrega a domicilio', 'Restaurante italiano', 'Comida rápida', 'Restaurante familiar'],
      };
    }

    // 1C. Carnes / Parrilla / Asados / BBQ
    if (combined.includes('carne') || combined.includes('parrilla') || combined.includes('asado') || combined.includes('steak') || combined.includes('bbq')) {
      return {
        primaryCategory: isEn ? 'Steak House' : 'Restaurante de carnes',
        secondaryCategories: isEn
          ? ['Barbecue Restaurant', 'Grill', 'Family Style Restaurant', 'Takeout Restaurant', 'Meal Delivery']
          : ['Parrilla', 'Restaurante de barbacoa', 'Restaurante familiar', 'Comida para llevar', 'Entrega a domicilio'],
      };
    }

    // 1D. Hamburguesas / Comida Rápida
    if (combined.includes('hamburgues') || combined.includes('burger')) {
      return {
        primaryCategory: isEn ? 'Hamburger Restaurant' : 'Restaurante de hamburguesas',
        secondaryCategories: isEn
          ? ['Fast Food Restaurant', 'American Restaurant', 'Takeout Restaurant', 'Meal Delivery', 'Family Style Restaurant']
          : ['Comida rápida', 'Restaurante de comida americana', 'Comida para llevar', 'Entrega a domicilio', 'Restaurante familiar'],
      };
    }

    // 1E. Café / Cafetería / Panadería
    if (combined.includes('cafe') || combined.includes('café') || combined.includes('coffee') || combined.includes('panader') || combined.includes('pasteler')) {
      return {
        primaryCategory: isEn ? 'Coffee Shop' : 'Cafetería',
        secondaryCategories: isEn
          ? ['Bakery', 'Breakfast Restaurant', 'Espresso Bar', 'Takeout Restaurant', 'Pastry Shop']
          : ['Pastelería', 'Panadería', 'Café de especialidad', 'Restaurante de desayunos', 'Comida para llevar'],
      };
    }

    // 1F. Sushi / Japonés
    if (combined.includes('sushi') || combined.includes('japon') || combined.includes('asiat') || combined.includes('ramen') || combined.includes('wok')) {
      return {
        primaryCategory: isEn ? 'Japanese Restaurant' : 'Restaurante japonés',
        secondaryCategories: isEn
          ? ['Sushi Restaurant', 'Asian Restaurant', 'Takeout Restaurant', 'Meal Delivery', 'Ramen Restaurant']
          : ['Restaurante de sushi', 'Restaurante asiático', 'Comida para llevar', 'Entrega a domicilio', 'Restaurante de ramen'],
      };
    }

    // 1G. Restaurante General (Sin categorías no solicitadas)
    return {
      primaryCategory: isEn ? 'Restaurant' : 'Restaurante',
      secondaryCategories: isEn
        ? ['Family Style Restaurant', 'Lunch Restaurant', 'Takeout Restaurant', 'Meal Delivery', 'Local Cuisine Restaurant']
        : ['Restaurante familiar', 'Restaurante para almorzar', 'Comida para llevar', 'Entrega a domicilio', 'Restaurante de cocina local'],
    };
  }

  // 2. SALUD / ODONTOLOGÍA
  if (combined.includes('médic') || combined.includes('salud') || combined.includes('odontol') || combined.includes('dent') || combined.includes('dient') || combined.includes('estétic')) {
    if (combined.includes('odontol') || combined.includes('dent') || combined.includes('dient') || combined.includes('sonrisa') || combined.includes('ortodoncia') || combined.includes('implante')) {
      return {
        primaryCategory: isEn ? 'Dental Clinic' : 'Clínica dental',
        secondaryCategories: isEn
          ? ['Dentist', 'Orthodontist', 'Emergency Dental Service', 'Cosmetic Dentist', 'Dental Laboratory']
          : ['Dentista', 'Ortodoncista', 'Servicio dental de urgencia', 'Centro odontológico', 'Clínica especializada'],
      };
    }
    return {
      primaryCategory: isEn ? 'Medical Clinic' : 'Clínica médica',
      secondaryCategories: isEn
        ? ['Doctor', 'Medical Center', 'Specialized Clinic', 'Health Consultant', 'Family Practice Physician']
        : ['Centro médico', 'Médico especialista', 'Consultorio médico', 'Centro de salud y bienestar', 'Clínica especializada'],
    };
  }

  // 3. TALLER MECÁNICO / AUTOMOTRIZ
  if (combined.includes('auto') || combined.includes('taller') || combined.includes('mecánic') || combined.includes('frenos') || combined.includes('vehícul')) {
    return {
      primaryCategory: isEn ? 'Auto Repair Shop' : 'Taller mecánico',
      secondaryCategories: isEn
        ? ['Brake Shop', 'Oil Change Service', 'Car Inspection Station', 'Mechanic', 'Auto Electrical Service']
        : ['Taller de automóviles', 'Servicio de cambio de aceite', 'Taller de frenos', 'Mecánico', 'Diagnóstico automotriz'],
    };
  }

  // 4. BELLEZA / BARBERÍA / PELUQUERÍA
  if (combined.includes('belleza') || combined.includes('peluquer') || combined.includes('barber') || combined.includes('uñas') || combined.includes('spa')) {
    if (combined.includes('barber')) {
      return {
        primaryCategory: isEn ? 'Barber Shop' : 'Barbería',
        secondaryCategories: isEn
          ? ['Hair Salon', 'Beauty Salon', 'Stylist', 'Skin Care Clinic', 'Cosmetics Store']
          : ['Peluquería', 'Salón de belleza', 'Estilista', 'Cuidado de la piel', 'Tienda de cosméticos'],
      };
    }
    return {
      primaryCategory: isEn ? 'Beauty Salon' : 'Salón de belleza',
      secondaryCategories: isEn
        ? ['Hair Salon', 'Nail Salon', 'Spa', 'Esthetician', 'Cosmetics Store']
        : ['Peluquería', 'Salón de manicura', 'Centro de estética', 'Spa y bienestar', 'Estilista'],
    };
  }

  // 5. SERVICIOS PROFESIONALES / LEGAL / B2B
  if (combined.includes('abog') || combined.includes('legal') || combined.includes('juríd')) {
    return {
      primaryCategory: isEn ? 'Law Firm' : 'Bufete de abogados',
      secondaryCategories: isEn
        ? ['Lawyer', 'Legal Services', 'Corporate Office', 'Business Management Consultant', 'Real Estate Attorney']
        : ['Abogado', 'Servicios legales', 'Asesoría jurídica', 'Consultoría legal', 'Abogado laboralista'],
    };
  }

  // DEFAULT GENERAL
  return {
    primaryCategory: isEn ? 'Commercial Service' : 'Servicios Comerciales & Profesionales',
    secondaryCategories: isEn
      ? ['Business Management Consultant', 'Corporate Office', 'Specialty Store', 'Service Establishment', 'Local Service']
      : ['Oficina corporativa', 'Comercio local', 'Servicios especializados', 'Asesoría profesional', 'Establecimiento de atención'],
  };
}

function buildTruthfulServiceCatalog(specialties: string, primaryCategory: string, isEn: boolean) {
  if (!specialties || !specialties.trim()) {
    return [
      {
        name: primaryCategory,
        description: isEn ? `Official ${primaryCategory} services.` : `Servicios oficiales de ${primaryCategory}.`,
        tag: primaryCategory,
      }
    ];
  }

  // Split user specialties by commas, ' y ', ' and ', ';', or '/'
  const rawItems = specialties
    .split(/[,;/]|s+ys+|s+ands+/i)
    .map(s => s.trim())
    .filter(Boolean);

  if (rawItems.length === 0) {
    return [
      {
        name: primaryCategory,
        description: isEn ? `Official ${primaryCategory} services.` : `Servicios oficiales de ${primaryCategory}.`,
        tag: primaryCategory,
      }
    ];
  }

  return rawItems.map(item => {
    const capitalized = item.charAt(0).toUpperCase() + item.slice(1);
    return {
      name: capitalized,
      description: isEn
        ? `Preparation and service of ${item.toLowerCase()} based on current availability.`
        : `Preparación y servicio de ${item.toLowerCase()} según disponibilidad y solicitud directa.`,
      tag: primaryCategory,
    };
  });
}

function buildFallbackBlueprint(params: {
  mode: 'create' | 'audit';
  businessName: string;
  category: string;
  city: string;
  neighborhood: string;
  specialties: string;
  phone: string;
  existingRating: number;
  existingReviews: number;
  lang: 'es' | 'en';
  businessModel?: 'storefront' | 'service_area';
  serviceAreas?: string;
}) {
  const {
    businessName,
    category,
    city,
    neighborhood,
    specialties,
    phone,
    mode,
    lang,
    businessModel = 'storefront',
    serviceAreas = '',
    existingReviews = 0,
    existingRating = 4.5,
  } = params;
  const isEn = lang === 'en';
  const isSAB = businessModel === 'service_area';
  const locationTag = neighborhood ? `${neighborhood}, ${city}` : city;

  // Strict, truthful taxonomy
  const taxonomy = detectTaxonomy({
    category,
    specialties,
    businessName,
    isEn,
  });

  const primaryCategory = taxonomy.primaryCategory;
  const secondaryCategories = taxonomy.secondaryCategories;

  // Service catalog constructed strictly from provided specialties without invented offerings
  const serviceCatalog = buildTruthfulServiceCatalog(specialties, primaryCategory, isEn);

  const cleanSpecialties = specialties.trim();
  const rawSpecialties = cleanSpecialties || (isEn ? 'our main specialty items' : 'nuestros productos y servicios principales');

  const serviceChannels = isSAB
    ? (isEn ? 'service directly at the client location and home delivery' : 'atención a domicilio y cobertura en la zona')
    : (isEn ? 'dine-in service, takeout orders, and local delivery' : 'atención en el local, pedidos para llevar y servicio a domicilio');

  const optimizedTitle = `${businessName} | ${primaryCategory} en ${locationTag}`;

  // Factual, truthful commercial description without invented claims or empty marketing filler
  const commercialDescription = isEn
    ? `${businessName} is a ${primaryCategory.toLowerCase()} located in ${locationTag}, specialized in ${rawSpecialties}. We provide ${serviceChannels} across ${city}. For menu details, orders, and inquiries, contact us directly via WhatsApp at ${phone || 'our direct customer line'}.`
    : `${businessName} es un ${primaryCategory.toLowerCase()} ubicado en ${locationTag}, especializado en ${rawSpecialties}. Ofrecemos ${serviceChannels} en ${city}. Para consultar disponibilidad, realizar pedidos o solicitar información, comunícate directamente por WhatsApp al ${phone || 'nuestro número de atención'}.`;

  const photoChecklist = [
    {
      item: isEn ? 'Daytime Exterior Facade' : 'Fachada Exterior de Día',
      count: 2,
      tip: isEn ? 'Clear photo of the business entrance and permanent commercial sign in natural light.' : 'Foto clara del acceso al negocio y letrero comercial visible con luz natural.',
      filenameExample: `${businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${city.toLowerCase()}-fachada-exterior.jpg`,
    },
    {
      item: isEn ? 'Nighttime Facade with Signage' : 'Fachada con Letrero Iluminado',
      count: 1,
      tip: isEn ? 'Photo showing illuminated sign during evening operating hours.' : 'Foto mostrando el letrero iluminado durante el horario nocturno de atención.',
      filenameExample: `${businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${city.toLowerCase()}-fachada-noche.jpg`,
    },
    {
      item: isEn ? 'Customer Service Area' : 'Área de Clientes / Local Comercial',
      count: 3,
      tip: isEn ? 'Well-lit photos of the clean customer seating or reception area.' : 'Fotos iluminadas del área de atención al público o salón limpio.',
      filenameExample: `${businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${city.toLowerCase()}-area-clientes.jpg`,
    },
    {
      item: isEn ? 'Star Products / Specialties' : 'Productos / Especialidades Principales',
      count: 4,
      tip: isEn ? `Close-up photos of ${rawSpecialties}.` : `Fotos de cerca mostrando la presentación real de ${rawSpecialties}.`,
      filenameExample: `${businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${city.toLowerCase()}-especialidad.jpg`,
    },
    {
      item: isEn ? 'Working Team' : 'Equipo de Trabajo en Operación',
      count: 1,
      tip: isEn ? 'Photo of the team at the work station.' : 'Foto del equipo en su lugar de trabajo para humanizar la ficha.',
      filenameExample: `${businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${city.toLowerCase()}-equipo.jpg`,
    },
  ];

  const preventiveFaqs = [
    {
      question: isEn ? `What are the operating hours of ${businessName}?` : `¿Cuáles son los horarios de atención de ${businessName}?`,
      answer: isEn
        ? `Operating hours are kept updated directly on this Google profile. You may also message us on WhatsApp at ${phone || 'our line'} to confirm holiday hours.`
        : `Nuestros horarios se mantienen actualizados directamente en esta ficha de Google. También puedes consultarnos por WhatsApp al ${phone || 'número de atención'} para festivos.`,
    },
    {
      question: isEn ? 'What payment methods do you accept?' : '¿Qué medios de pago reciben?',
      answer: isEn
        ? 'We accept cash, debit and credit cards, and verified local electronic transfers.'
        : 'Recibimos efectivo, tarjetas de débito y crédito, y transferencias electrónicas verificadas.',
    },
    {
      question: isEn ? 'How can I place an order or make a reservation?' : '¿Cómo puedo hacer un pedido o reservar?',
      answer: isEn
        ? `You can contact us directly via WhatsApp at ${phone || 'our direct line'} for fast booking and orders.`
        : `Puedes comunicarte directamente por WhatsApp al ${phone || 'nuestro número directo'} para coordinar pedidos o reservas con rapidez.`,
    },
    {
      question: isEn ? 'Do you offer takeaway or delivery options?' : '¿Manejan pedidos para llevar o domicilios?',
      answer: isEn
        ? `Yes, we handle takeaway orders and local delivery across ${city}. Contact us on WhatsApp to order.`
        : `Sí, gestionamos pedidos para llevar y entregas a domicilio en la zona de ${city}. Escríbenos para solicitar tu pedido.`,
    },
    {
      question: isEn ? 'Where are you located?' : '¿Dónde están ubicados?',
      answer: isEn
        ? `We are located in ${locationTag}. Contact us via WhatsApp if you need exact arrival directions.`
        : `Estamos ubicados en ${locationTag}. Escríbenos al WhatsApp si necesitas indicaciones para llegar.`,
    },
  ];

  const verificationGuide = isSAB
    ? {
        title: isEn
          ? 'Video Verification Guide for Service Area Businesses (SAB)'
          : 'Guía de Verificación por Video para Servicios a Domicilio (SAB)',
        overview: isEn
          ? 'Google requires a continuous 60s video proving professional activity without public signage:'
          : 'Google solicita un video continuo de 60 segundos sin cortes que demuestre tu actividad profesional:',
        cameraTake1: isEn
          ? 'Take 1 (Tools & Gear, 20s): Film your work tools, equipment, or service materials.'
          : 'Toma 1 (Herramientas y Equipo, 20s): Graba tus herramientas de trabajo, equipos o materiales de servicio.',
        cameraTake2: isEn
          ? 'Take 2 (Official Registration, 20s): Film your tax ID/RUT registration and utility bill showing your registered address.'
          : 'Toma 2 (Registro Oficial, 20s): Graba tu registro tributario/RUT y factura de servicios donde conste la dirección registrada.',
        cameraTake3: isEn
          ? 'Take 3 (Work Space or Vehicle, 20s): Film your dedicated preparation area or work vehicle.'
          : 'Toma 3 (Espacio de Trabajo o Vehículo, 20s): Graba tu área de trabajo o vehículo de servicio con herramientas.',
        documents: [
          isEn ? 'Tax ID / Business Registration certificate.' : 'RUT / Registro Tributario o Licencia comercial oficial.',
          isEn ? 'Recent utility bill with registered address.' : 'Factura de servicios reciente con la dirección registrada.',
        ],
      }
    : {
        title: isEn ? 'Continuous Video Verification Guide for Physical Storefront' : 'Guía de Verificación por Video Continuo para Local Físico',
        overview: isEn
          ? 'Google Maps requires a 60-second continuous smartphone video without edits or pauses:'
          : 'Google Maps exige un video continuo de 60 segundos grabado con celular sin cortes ni pausas:',
        cameraTake1: isEn
          ? 'Take 1 (Exterior, 20s): Start outside on the street. Show street name and zoom in on your permanent business sign.'
          : 'Toma 1 (Exterior, 20s): Comienza en la calle. Muestra la placa de dirección y enfoca el letrero comercial permanente del local.',
        cameraTake2: isEn
          ? 'Take 2 (Access, 15s): Film your hands unlocking the front door with physical keys to prove legal possession.'
          : 'Toma 2 (Acceso, 15s): Graba tus manos abriendo la puerta principal con las llaves físicas para demostrar posesión legal.',
        cameraTake3: isEn
          ? 'Take 3 (Interior & Operations, 25s): Show the cash register, POS terminal, staff area, and work equipment.'
          : 'Toma 3 (Interior y Operación, 25s): Muestra la caja registradora, datáfono, área de atención y herramientas de trabajo.',
        documents: [
          isEn ? 'Recent utility bill matching the exact business address.' : 'Factura reciente de servicios públicos con la dirección exacta del local.',
          isEn ? 'Commercial registration or tax document (RUT / NIT).' : 'Registro mercantil o tributario oficial (RUT, NIT o Cámara de Comercio).',
        ],
      };

  const suggestedServiceAreas = isSAB
    ? [
        `${city} Centro`,
        `${city} Norte`,
        `${city} Sur`,
        `${city} Occidente`,
        `Área Metropolitana de ${city}`,
      ]
    : [];

  const nfcPocketReviewGuide = {
    title: isEn ? 'On-Site NFC & Direct WhatsApp Review Process' : 'Protocolo de Reseñas: Tarjeta NFC de Bolsillo + WhatsApp',
    steps: [
      isEn
        ? 'Present the Prestigia pocket NFC card or QR code to the satisfied customer upon completing the service.'
        : 'Presenta la tarjeta NFC Prestigia o código QR al cliente satisfecho al concluir la atención.',
      isEn
        ? 'Ask the customer to tap their smartphone to access the Google review screen directly.'
        : 'Pide al cliente que acerque su teléfono para abrir directamente la pantalla de calificación en Google.',
      isEn
        ? 'If NFC is unavailable, share the direct review link via WhatsApp.'
        : 'Si el cliente no tiene NFC, envíale de inmediato el enlace directo por WhatsApp.',
    ],
    samplePitch: isEn
      ? `"Thank you for visiting ${businessName}! Could you take a moment to leave your review on Google? It helps our local team significantly."`
      : `"¡Gracias por visitar ${businessName}! ¿Podrías dejarnos tu reseña en Google acercando tu teléfono a esta tarjeta? Nos ayuda mucho a seguir mejorando."`,
  };

  const isCreate = mode === 'create';
  const effectiveReviews = isCreate ? 0 : (existingReviews || 0);
  const targetTop3Reviews = isCreate ? 100 : Math.max(120, effectiveReviews + 80);
  const neededReviews = Math.max(0, targetTop3Reviews - effectiveReviews);
  const reviewsPerWeek = 8;
  const weeksToTop3 = Math.ceil(neededReviews / reviewsPerWeek) || (isCreate ? 13 : 10);

  const reviewVelocityPlan = {
    currentReviews: effectiveReviews,
    targetTop3Reviews,
    neededReviews,
    reviewsPerWeek,
    weeksToTop3,
  };

  const monthlyPostsBooster = [
    {
      week: 1,
      type: isEn ? 'Featured Item' : 'Especialidad',
      title: isEn ? `Specialties at ${businessName}` : `Especialidades en ${businessName}`,
      body: isEn
        ? `Discover our ${rawSpecialties} in ${locationTag}. Dine-in and delivery available.`
        : `Descubre nuestras ${rawSpecialties} en ${locationTag}. Atención en el local y domicilios disponibles.`,
      callToAction: isEn ? 'Call Now' : 'Contactar / Llamar',
    },
    {
      week: 2,
      type: isEn ? 'Service Channels' : 'Canales de Atención',
      title: isEn ? `Takeout and Delivery in ${city}` : `Pedidos para Llevar y Domicilios en ${city}`,
      body: isEn
        ? `Order ${rawSpecialties} directly to your home or office via WhatsApp.`
        : `Solicita tus ${rawSpecialties} directamente a domicilio o para llevar por WhatsApp.`,
      callToAction: isEn ? 'Order via WhatsApp' : 'Pedir por WhatsApp',
    },
    {
      week: 3,
      type: isEn ? 'Customer Attention' : 'Atención al Cliente',
      title: isEn ? `Visit us in ${locationTag}` : `Visítanos en ${locationTag}`,
      body: isEn
        ? `We are open during our official weekly schedule. We look forward to serving you.`
        : `Atendemos en nuestros horarios habituales. Será un gusto atenderte.`,
      callToAction: isEn ? 'More Info' : 'Más Información',
    },
    {
      week: 4,
      type: isEn ? 'Direct Contact' : 'Contacto Directo',
      title: isEn ? `Questions or Orders at ${businessName}` : `Consultas y Pedidos en ${businessName}`,
      body: isEn
        ? `Reach out directly via WhatsApp for quick answers regarding our menu and availability.`
        : `Escríbenos directamente por WhatsApp para resolver dudas sobre el menú y disponibilidad.`,
      callToAction: isEn ? 'WhatsApp' : 'Escribir al WhatsApp',
    },
  ];

  const whatsappOnboardingMessage = isSAB
    ? isEn
      ? `Hello ${businessName}! 👋\n\nTo complete your Google Maps profile setup as an Independent / Service Area Professional, please provide the following details:\n\n📸 *1. PHOTOS (Clear lighting):*\n- 3 Photos of your tools, equipment, or service vehicle\n- 2 Photos of your dedicated workspace or materials\n- 1 Photo of you in professional attire\n- Official logo\n\n🎥 *2. CONTINUOUS 60s VERIFICATION VIDEO:*\n- Recording your equipment/tools\n- Recording your tax document (RUT/LLC) and business card\n- Recording your workspace or service vehicle\n\n📋 *3. OPERATING DATA:*\n- Specialties list\n- Target service areas\n- Payment methods\n- Official Gmail account\n\nWe will configure your Google Business Profile with verified local SEO categories! 🚀`
      : `¡Hola ${businessName}! 👋\n\nPara configurar la ficha oficial de tu actividad como Profesional Independiente / Servicios a Domicilio en Google Maps, requerimos los siguientes datos:\n\n📸 *1. FOTOS (Con buena luz):*\n- 3 Fotos de tus herramientas, equipos o vehículo de trabajo\n- 2 Fotos de tu espacio de trabajo o materiales\n- 1 Foto tuya con vestimenta laboral\n- Logo en buena resolución\n\n🎥 *2. VIDEO CONTINUO DE 60 SEGUNDOS:*\n- Grabando tus herramientas o equipo de servicio\n- Grabando tu RUT / registro tributario con dirección\n- Grabando tu espacio de trabajo o vehículo\n\n📋 *3. DATOS OPERATIVOS:*\n- Lista de especialidades\n- Zonas de cobertura\n- Medios de pago aceptados\n- Correo Gmail donde deseas la propiedad de la ficha\n\n¡Nos encargamos de toda la configuración técnica en Google Maps! 🚀`
    : isEn
    ? `Hello ${businessName}! 👋\n\nTo complete your official Google Business Profile setup on Google Maps, please provide the following materials:\n\n📸 *1. PHOTOS (Clear lighting):*\n- 2 Exterior facade photos (daytime and evening with illuminated sign)\n- 3 Interior customer area photos\n- 4 Photos of your main specialties or products\n- 1 Photo of your working team\n- Official logo\n\n🎥 *2. CONTINUOUS 60s VERIFICATION VIDEO:*\n- Recording the street and exterior permanent sign\n- Opening the front door with keys\n- Recording the register, POS, and interior operation\n\n📋 *3. OPERATING DATA:*\n- Operating hours\n- Accepted payment methods\n- Gmail address for profile ownership\n\nWe will configure your Google Business Profile with verified local SEO categories! 🚀`
    : `¡Hola ${businessName}! 👋\n\nPara configurar la ficha oficial de tu negocio en Google Maps con la arquitectura verificada, requerimos los siguientes materiales:\n\n📸 *1. FOTOS (Con buena luz):*\n- 2 Fotos de fachada exterior (de día y de noche con letrero iluminado)\n- 3 Fotos del local o área de clientes limpia\n- 4 Fotos de tus especialidades o productos principales\n- 1 Foto del equipo de atención\n- Logo en buena resolución\n\n🎥 *2. VIDEO CONTINUO DE 60 SEGUNDOS:*\n- Grabando la calle y el letrero comercial de la fachada\n- Abriendo la puerta con las llaves\n- Grabando la caja registradora, datáfono e instalaciones\n\n📋 *3. DATOS OPERATIVOS:*\n- Horarios exactos de atención\n- Medios de pago aceptados\n- Correo de Gmail donde deseas la propiedad de la ficha\n\n¡Nos encargamos de toda la configuración técnica y categorías en Google Maps! 🚀`;

  return {
    businessModel,
    hidePhysicalAddress: isSAB,
    primaryCategory,
    secondaryCategories,
    optimizedTitle,
    commercialDescription,
    serviceCatalog,
    photoChecklist,
    preventiveFaqs,
    verificationGuide,
    whatsappOnboardingMessage,
    suggestedServiceAreas,
    nfcPocketReviewGuide,
    reviewVelocityPlan,
    monthlyPostsBooster,
    ...(mode === 'audit'
      ? {
          healthScore: 54,
          criticalGaps: [
            isEn ? 'Incomplete Google secondary categories capping search reach.' : 'Falta de subcategorías secundarias oficiales en Google Maps limitando alcance.',
            isEn ? 'Under-optimized description lacking core local transaction keywords.' : 'Descripción desaprovechada sin palabras clave locales de alta conversión.',
            isEn ? 'Review velocity below regional Top 3 competitors.' : 'Velocidad de reseñas semanales por debajo del promedio del Top 3 de la zona.',
            isEn ? 'Absence of geotagged weekly Google Posts.' : 'Sin publicaciones semanales activas con llamadas a la acción directas.',
          ],
          topCompetitorInsights: isEn
            ? `Leading competitors in ${city} capture 65% of organic calls by maintaining 8+ fresh reviews monthly and optimized category tags.`
            : `Los líderes del Top 3 en ${city} capturan el 65% de llamadas y visitas manteniendo al menos 8 reseñas frescas mensuales y categorías exhaustivas.`,
          actionRoadmap: [
            {
              step: 1,
              title: isEn ? 'Update GBP Primary & Secondary Categories' : 'Actualizar Categoría Primaria y 4-5 Secundarias Oficiales',
              impact: 'CRÍTICO',
              action: isEn ? 'Add exact Google categories to trigger algorithmic relevance.' : 'Configurar de inmediato las categorías sugeridas en el panel de Google.',
            },
            {
              step: 2,
              title: isEn ? 'Inject Factual Commercial Description' : 'Cargar la Nueva Descripción Concisa y Factual',
              impact: 'ALTO',
              action: isEn ? 'Paste the factual description with direct WhatsApp contact.' : 'Copiar y pegar el texto en la ficha de Google Business.',
            },
            {
              step: 3,
              title: isEn ? 'Deploy On-Site NFC Pocket Review Cards' : 'Activar Protocolo de Reseñas NFC & WhatsApp',
              impact: 'ALTO',
              action: isEn ? 'Target minimum 8 fresh reviews weekly.' : 'Capturar al menos 8 reseñas 5★ por semana para activar el algoritmo de frescura.',
            },
            {
              step: 4,
              title: isEn ? 'Upload Photo Batch' : 'Subir Lote de Fotos Reales',
              impact: 'MEDIO',
              action: isEn ? 'Publish facade, product, and staff photos.' : 'Cargar las fotos del checklist con nombres de archivo claros.',
            },
            {
              step: 5,
              title: isEn ? 'Schedule Weekly Google Business Posts' : 'Publicar 1 Novedad Semanal en Google',
              impact: 'MEDIO',
              action: isEn ? 'Keep listing fresh and active in Google feed.' : 'Publicar semanalmente los posts generados con botón de contacto.',
            },
          ],
        }
      : {}),
  };
}
