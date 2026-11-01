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

CRITICAL QUALITY RULES:
1. "primaryCategory": The exact official Google Business Profile primary category (highest search intent).
2. "secondaryCategories": Exactly 5 to 7 official Google secondary categories to capture long-tail and alternative searches.
3. "optimizedTitle": Strategic title following formula: "[Brand Name] | [Core Specialty] [City/Area]".
4. "commercialDescription": High-converting text between 680 and 745 characters (Google limit: 750). Contains top 8 purchase intent keywords and direct call to action.
5. "serviceCatalog": Array of 4 to 6 structured star services/products with commercial name, 15-word benefit description, and category tag.
6. "photoChecklist": Array of 5 required photo types with geotagged SEO recommended filenames. ${isSAB ? 'For independents/SAB: Focus on professional equipment, tools, work vehicle, laptop/workspace, and smiling specialist.' : 'For storefronts: Focus on facade, illuminated sign, interior, star dishes/products, and team.'}
7. "preventiveFaqs": Exactly 5 strategic Q&As addressing common customer objections.
8. "verificationGuide": Foolproof 60-90 second continuous video verification guide. ${isSAB ? 'CRITICAL FOR INDEPENDENTS/SAB: Google does NOT accept an empty house. Must detail Take 1 (Professional tools, branded materials, active work equipment), Take 2 (Official tax/business registration matching address privately, utility bill, physical business cards), Take 3 (Branded work vehicle with tools or dedicated workspace).' : 'For storefronts: Take 1 (Street sign and exterior facade), Take 2 (Unlocking front door with keys), Take 3 (Cash register, POS terminal, POS software).'}
9. "whatsappOnboardingMessage": Complete and professional message ready to copy & paste to the client requesting all photos, verification video, and details in one go.
10. "suggestedServiceAreas": ${isSAB ? 'Array of 8 to 10 affluent target neighborhoods, zip codes, or sub-cities where the independent professional should register service coverage in Google Maps without showing home address.' : '[]'}
11. "hidePhysicalAddress": ${isSAB ? true : false}
12. "nfcPocketReviewGuide": Protocol for collecting instant 5-star Google reviews on-site (using pocket NFC cards or immediate post-service WhatsApp dispatch).
13. "reviewVelocityPlan": Object with currentReviews (${existingReviews || 0}), targetTop3Reviews, neededReviews, recommended pace reviewsPerWeek, and estimated weeksToTop3.
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
    "currentReviews": ${existingReviews || 0},
    "targetTop3Reviews": 180,
    "neededReviews": 180,
    "reviewsPerWeek": 8,
    "weeksToTop3": 22
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
            const parsed = JSON.parse(candidateText.trim());
            return NextResponse.json({ success: true, engine: 'gemini-1.5-flash', data: parsed });
          }
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

  // Determine category taxonomy
  let primaryCategory = 'Restaurante';
  let secondaryCategories = ['Restaurante familiar', 'Bar y parrilla', 'Comida para llevar', 'Entrega a domicilio', 'Restaurante para almorzar'];
  let defaultSpecialties = specialties || 'Platos gourmet, parrilla y cócteles de autor';

  if (category.toLowerCase().includes('médic') || category.toLowerCase().includes('salud') || category.toLowerCase().includes('odontol') || category.toLowerCase().includes('estétic')) {
    primaryCategory = isEn ? 'Medical Clinic' : 'Clínica médica';
    secondaryCategories = isEn
      ? ['Doctor', 'Medical Center', 'Specialized Clinic', 'Health Consultant', 'Family Practice Physician']
      : ['Centro médico', 'Médico especialista', 'Consultorio médico', 'Centro de salud y bienestar', 'Clínica especializada'];
  } else if (category.toLowerCase().includes('auto') || category.toLowerCase().includes('taller') || category.toLowerCase().includes('mecánic')) {
    primaryCategory = isEn ? 'Auto Repair Shop' : 'Taller mecánico';
    secondaryCategories = isEn
      ? ['Brake Shop', 'Oil Change Service', 'Car Inspection Station', 'Mechanic', 'Auto Electrical Service']
      : ['Taller de automóviles', 'Servicio de cambio de aceite', 'Taller de frenos', 'Mecánico', 'Diagnóstico automotriz'];
  } else if (category.toLowerCase().includes('belleza') || category.toLowerCase().includes('peluquer') || category.toLowerCase().includes('barber')) {
    primaryCategory = isEn ? 'Beauty Salon' : 'Salón de belleza';
    secondaryCategories = isEn
      ? ['Hair Salon', 'Barber Shop', 'Nail Salon', 'Spa', 'Cosmetics Store']
      : ['Peluquería', 'Barbería', 'Salón de manicura', 'Centro de estética', 'Spa y bienestar'];
  } else if (category.toLowerCase().includes('retail') || category.toLowerCase().includes('tienda') || category.toLowerCase().includes('comercio')) {
    primaryCategory = isEn ? 'Store' : 'Tienda de artículos generales';
    secondaryCategories = isEn
      ? ['Shopping Mall', 'Boutique', 'Gift Shop', 'Discount Store', 'Specialty Store']
      : ['Boutique', 'Tienda especializada', 'Comercio local', 'Tienda de regalos', 'Centro de compras'];
  } else if (category.toLowerCase().includes('b2b') || category.toLowerCase().includes('profesional') || category.toLowerCase().includes('legal')) {
    primaryCategory = isEn ? 'Consulting Agency' : 'Consultoría y Servicios Profesionales';
    secondaryCategories = isEn
      ? ['Business Management Consultant', 'Corporate Office', 'Legal Services', 'Marketing Agency', 'Financial Consultant']
      : ['Oficina de consultoría', 'Asesoría empresarial', 'Servicios legales y corporativos', 'Consultor financiero', 'Agencia de servicios'];
  }

  const optimizedTitle = `${businessName} | ${primaryCategory} en ${locationTag}`;
  const commercialDescription = isEn
    ? `Welcome to ${businessName}, your premier destination for ${primaryCategory.toLowerCase()} in ${locationTag}. We pride ourselves on delivering outstanding quality, friendly service, and exceptional value. Specializing in ${defaultSpecialties}. Conveniently located in ${city} with easy access and dedicated customer attention. Visit us today or contact us via WhatsApp at ${phone || 'our direct line'} for bookings, menus, and personalized inquiries.`
    : `Bienvenido a ${businessName}, el referente líder en ${primaryCategory.toLowerCase()} en ${locationTag}. Nos distinguimos por ofrecer la más alta calidad, atención cálida y una experiencia memorable para nuestros clientes. Especialistas en ${defaultSpecialties}. Ubicados estratégicamente en ${city} con cómodas instalaciones y servicio preferencial. ¡Visítanos hoy mismo o contáctanos por WhatsApp al ${phone || 'nuestra línea directa'} para reservas y consultas!`;

  const serviceCatalog = [
    {
      name: isEn ? 'Signature Service / Flagship Product' : 'Servicio Estrella / Producto Insignia',
      description: isEn ? `Our most requested specialty at ${businessName} crafted with premium standards.` : `Nuestra especialidad más aclamada en ${businessName} elaborada con los más altos estándares.`,
      tag: primaryCategory,
    },
    {
      name: isEn ? 'Express VIP Experience' : 'Experiencia VIP / Atención Personalizada',
      description: isEn ? 'Dedicated assistance designed for clients seeking priority and top-tier service.' : 'Atención prioritaria y dedicada para clientes que buscan rapidez y máxima excelencia.',
      tag: 'Especial',
    },
    {
      name: isEn ? 'Corporate / Group Booking' : 'Planes para Grupos & Celebraciones',
      description: isEn ? 'Tailored packages for corporate meetings, families, and special occasions.' : 'Paquetes adaptados para reuniones de trabajo, familias y ocasiones especiales.',
      tag: 'Grupos',
    },
    {
      name: isEn ? 'Complimentary Consultation / Tasting' : 'Asesoría / Degustación de Cortesía',
      description: isEn ? 'Discover why we are rated among the best options in the area.' : 'Descubre por qué somos una de las opciones mejor valoradas de toda la zona.',
      tag: 'Bienvenida',
    },
  ];

  const photoChecklist = [
    {
      item: isEn ? 'Daytime Exterior Facade' : 'Fachada Exterior de Día',
      count: 2,
      tip: isEn ? 'Shows the main sign, street number, and entrance clearly with natural light.' : 'Muestra el letrero comercial principal, el número de la calle y el acceso con luz natural.',
      filenameExample: `${businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${city.toLowerCase()}-fachada-exterior.jpg`,
    },
    {
      item: isEn ? 'Nighttime Illuminated Facade' : 'Fachada de Noche con Iluminación',
      count: 1,
      tip: isEn ? 'Highlights the lit signage and warm exterior ambiance.' : 'Destaca el letrero iluminado y el ambiente cálido nocturno para clientes que buscan cenar o visitar tarde.',
      filenameExample: `${businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${city.toLowerCase()}-fachada-noche.jpg`,
    },
    {
      item: isEn ? 'Customer Area / Dining / Interior' : 'Área de Clientes / Salón Interior',
      count: 4,
      tip: isEn ? 'Clean, well-lit shots of seating, reception, or service stations.' : 'Tomas amplias y bien iluminadas de las mesas, recepción o instalaciones limpias.',
      filenameExample: `${businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${city.toLowerCase()}-salon-interior.jpg`,
    },
    {
      item: isEn ? 'Star Products / Dishes' : 'Productos / Platos Estrella',
      count: 6,
      tip: isEn ? 'Close-up, appetizing/detailed pictures of top offerings.' : 'Fotos de cerca con buena luz mostrando la calidad y presentación de tus productos más vendidos.',
      filenameExample: `${businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${city.toLowerCase()}-producto-estrella.jpg`,
    },
    {
      item: isEn ? 'Team in Uniform / Hospitality' : 'Equipo de Trabajo Sonriendo',
      count: 2,
      tip: isEn ? 'Google awards significant organic boost to profiles showcasing real human faces.' : 'Google premia con gran impulso orgánico a los perfiles que muestran rostros humanos reales atendiendo.',
      filenameExample: `${businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${city.toLowerCase()}-equipo-atencion.jpg`,
    },
  ];

  const preventiveFaqs = [
    {
      question: isEn ? `What are the official operating hours of ${businessName}?` : `¿Cuáles son los horarios de atención de ${businessName}?`,
      answer: isEn
        ? `We operate throughout the week. Check our updated Google Maps schedule above or write to us directly via WhatsApp at ${phone || 'our contact number'} for holiday hours.`
        : `Atendemos de lunes a domingo. Consulta nuestros horarios oficiales actualizados en esta misma ficha de Google o escríbenos directamente al WhatsApp ${phone || 'de atención'} para confirmar disponibilidad en festivos.`,
    },
    {
      question: isEn ? 'What payment methods do you accept?' : '¿Qué medios de pago reciben?',
      answer: isEn
        ? 'We accept cash, all debit and credit cards (Visa, Mastercard, Amex), and verified mobile electronic transfers.'
        : 'Recibimos efectivo, todas las tarjetas débito y crédito (Visa, Mastercard, American Express) y transferencias móviles inmediatas (Nequi, Daviplata, transferencias bancarias).',
    },
    {
      question: isEn ? 'Do you have parking or valet service available?' : '¿Cuentan con parqueadero para clientes?',
      answer: isEn
        ? 'Yes, there is convenient parking access directly adjacent to our location for our guests.'
        : 'Sí, contamos con zonas de parqueo y convenios cercanos para la total comodidad y seguridad de nuestros visitantes.',
    },
    {
      question: isEn ? 'Is it necessary to make a prior reservation?' : '¿Es necesario hacer reserva previa para visitarlos?',
      answer: isEn
        ? `Walk-ins are always warmly welcomed! For groups of 4 or more, we recommend reserving via WhatsApp at ${phone || 'our line'} to ensure priority seating.`
        : `¡Siempre son bienvenidos sin reserva! Para grupos o fechas especiales, recomendamos reservar con anticipación por WhatsApp al ${phone || 'nuestra línea'} para garantizar la mejor ubicación.`,
    },
    {
      question: isEn ? 'Do you offer home delivery or takeaway?' : '¿Manejan servicio a domicilio o para llevar?',
      answer: isEn
        ? 'Yes! You can order directly for takeout or fast local delivery right to your door.'
        : '¡Sí! Puedes solicitar tus pedidos para llevar o pedir a domicilio directamente a través de nuestro WhatsApp oficial con entrega rápida en la zona.',
    },
  ];

  const verificationGuide = isSAB
    ? {
        title: isEn
          ? 'Guaranteed Verification Video for Independent Pros (SAB)'
          : 'Guía Blindada de Verificación para Independientes y Servicios a Domicilio',
        overview: isEn
          ? 'Since you do not have a public customer sign or store on the street, Google verifies your active operations through this 60s continuous video:'
          : 'Al no tener letrero exterior con horario en la calle, Google verifica que eres un profesional activo mediante este video continuo de 60 segundos sin cortes:',
        cameraTake1: isEn
          ? 'Take 1 (Tools & Gear, 20s): Film your professional equipment, tools, work laptop with specialized software/calendar open, or specialized instruments.'
          : 'Toma 1 (Herramientas y Equipo, 20s): Graba tus herramientas de trabajo, maletín profesional, computador con software de gestión/agenda abierta o instrumentos de servicio.',
        cameraTake2: isEn
          ? 'Take 2 (Official Documents, 20s): Film your official tax registration (RUT / Tax ID / LLC), recent utility bill with your registered address, and physical business cards.'
          : 'Toma 2 (Documentos y Legalidad, 20s): Graba de cerca tu registro tributario o mercantil (RUT / RFC / Licencia profesional), factura de servicio a tu nombre y tarjetas de presentación.',
        cameraTake3: isEn
          ? 'Take 3 (Work Space or Vehicle, 20s): Film your dedicated workspace/inventory area or your work vehicle (inside tools/branded magnet if applicable).'
          : 'Toma 3 (Espacio de Trabajo o Vehículo, 20s): Graba tu estación de trabajo dedicada, bodega de materiales o tu vehículo de trabajo con las herramientas adentro.',
        documents: [
          isEn ? 'Tax ID / Business Registration (RUT / RFC / LLC certificate) matching owner name.' : 'RUT / Registro Tributario o Licencia Profesional oficial.',
          isEn ? 'Utility bill or bank statement showing your registered address.' : 'Factura de servicios o extracto bancario con la dirección registrada para verificar posesión.',
          isEn ? 'Recent client contracts, printed invoices or branded marketing materials.' : 'Tarjetas de presentación físicas o facturas recientes emitidas a clientes.',
        ],
      }
    : {
        title: isEn ? 'Foolproof Video Verification Guide in 1 Attempt' : 'Guía Blindada de Verificación por Video en 1 Intento',
        overview: isEn
          ? 'Google Maps requires an unedited continuous 60 to 90-second smartphone video to approve your listing. Follow these 3 camera takes in order:'
          : 'Google Maps exige un video continuo de 60 a 90 segundos grabado con celular sin cortes ni pausas para aprobar la ficha. Sigue exactamente estas 3 tomas seguidas:',
        cameraTake1: isEn
          ? 'Take 1 (Exterior, 20s): Start outside on the street. Film the street signs, nearby commercial context, and zoom in on your official permanent business sign.'
          : 'Toma 1 (Exterior, 20s): Comienza en la calle. Graba la placa de la dirección, los locales vecinos y enfoca con claridad el letrero comercial permanente de tu negocio.',
        cameraTake2: isEn
          ? 'Take 2 (Access, 15s): Film your hands unlocking the front door with physical keys or opening the main entrance to prove legal possession.'
          : 'Toma 2 (Acceso, 15s): Graba tus manos abriendo la puerta principal con las llaves físicas o abriendo la reja (esto le demuestra a Google que tienes posesión legal del local).',
        cameraTake3: isEn
          ? 'Take 3 (Operation & Staff Only, 30s): Walk inside to employee-only zones. Show the cash register, card terminal/POS, computer screen with billing/invoicing software, and equipment.'
          : 'Toma 3 (Interior y Operación, 30s): Camina adentro hacia la caja, datáfono, computador con el software de facturación abierto y herramientas de trabajo a las que solo el personal tiene acceso.',
        documents: [
          isEn ? 'Official utility bill (water/electricity/internet) under the business name and address.' : 'Factura reciente de servicios públicos (agua, luz o internet) a nombre del negocio y con la dirección exacta.',
          isEn ? 'Tax ID / Business registration certificate (RUT, NIT or Chamber of Commerce).' : 'Certificado de registro mercantil o tributario (RUT, NIT o Cámara de Comercio).',
        ],
      };

  const suggestedServiceAreas = isSAB
    ? [
        `${city} Centro & Zona Comercial`,
        `${city} Norte / Zonas Residenciales VIP`,
        `${city} Sur / Sectores Consolidados`,
        `${city} Occidente / Zonas Industriales y Empresariales`,
        `Comunas y Barrios de Alta Demanda en ${city}`,
        `Municipios Aledaños del Área Metropolitana de ${city}`,
      ]
    : [];

  const nfcPocketReviewGuide = {
    title: isEn ? 'On-Site Pocket NFC & WhatsApp Review Protocol' : 'Protocolo Portátil de Reseñas: Tarjeta NFC de Bolsillo + WhatsApp',
    steps: [
      isEn
        ? 'Carry a Prestigia pocket NFC card or keychain in your work bag on every client visit.'
        : 'Lleva siempre contigo tu tarjeta NFC Prestigia de bolsillo o llavero inteligente en cada cita.',
      isEn
        ? 'Upon completing the job, ask the satisfied client: "Could you tap this with your phone to leave a quick 5★ review?"'
        : 'Al terminar el servicio y con el cliente satisfecho: "Por favor acerca tu teléfono a esta tarjeta para dejarnos tu calificación de 5 estrellas en 10 segundos."',
      isEn
        ? 'If their NFC is disabled, immediately share your dedicated WhatsApp review link with pre-drafted positive text.'
        : 'Si el cliente no tiene NFC, envíale de inmediato por WhatsApp el enlace directo de reseña con un texto de agradecimiento pre-redactado.',
    ],
    samplePitch: isEn
      ? `"It was a pleasure serving you today! Could you take 10 seconds to tap this card and share your 5★ feedback on Google? It helps an independent professional tremendously!"`
      : `"¡Ha sido un placer atenderte hoy! ¿Me ayudarías acercando tu teléfono a esta tarjeta para calificar nuestro servicio en Google? Como profesional independiente, tu recomendación me ayuda muchísimo."`,
  };

  const targetTop3Reviews = Math.max(120, (existingReviews || 0) + 80);
  const neededReviews = Math.max(0, targetTop3Reviews - (existingReviews || 0));
  const reviewsPerWeek = 8;
  const weeksToTop3 = Math.ceil(neededReviews / reviewsPerWeek) || 10;

  const reviewVelocityPlan = {
    currentReviews: existingReviews || 0,
    targetTop3Reviews,
    neededReviews,
    reviewsPerWeek,
    weeksToTop3,
  };

  const monthlyPostsBooster = [
    {
      week: 1,
      type: isEn ? 'Star Offering' : 'Servicio Estrella',
      title: isEn ? `Looking for top-tier ${primaryCategory} in ${city}?` : `¿Buscando el mejor servicio de ${primaryCategory} en ${city}?`,
      body: isEn
        ? `At ${businessName}, we specialize in ${defaultSpecialties}. Verified experience, prompt attention, and unmatched quality. Message us today!`
        : `En ${businessName} te garantizamos la mejor atención en ${defaultSpecialties}. Calidad certificada y puntualidad. ¡Escríbenos hoy mismo!`,
      callToAction: isEn ? 'Contact Us / Call Now' : 'Contactar / Llamar Ahora',
    },
    {
      week: 2,
      type: isEn ? 'Customer Problem Solved' : 'Caso de Éxito',
      title: isEn ? 'Guaranteed Results & Fast Turnaround' : 'Solución Rápida con Garantía de Satisfacción',
      body: isEn
        ? `Don't risk your investment with amateurs. See why clients in ${city} trust ${businessName} for all their needs.`
        : `No pongas en riesgo tu tiempo con improvisados. Descubre por qué nuestros clientes en ${city} nos recomiendan al 100%.`,
      callToAction: isEn ? 'Book Appointment' : 'Reservar Cita',
    },
    {
      week: 3,
      type: isEn ? 'Trust & Certification' : 'Confianza & Autoridad',
      title: isEn ? `Why Choose ${businessName}?` : `¿Por qué elegir a ${businessName}?`,
      body: isEn
        ? `We operate with total transparency, upfront quotes, and 5-star verified customer satisfaction across ${city}.`
        : `Trabajamos con total transparencia, presupuestos claros y la máxima satisfacción de nuestros clientes en toda la ciudad.`,
      callToAction: isEn ? 'Learn More' : 'Más Información',
    },
    {
      week: 4,
      type: isEn ? 'Limited Priority Booking' : 'Oferta de Temporada',
      title: isEn ? 'Schedule Your Consultation This Week' : 'Agenda tu Consulta o Servicio Esta Semana',
      body: isEn
        ? `Limited spots available for personalized attention this month. Tap below to speak directly with our team.`
        : `Cupos limitados para atención prioritaria esta semana. Toca el botón para hablar directamente con nosotros por WhatsApp.`,
      callToAction: isEn ? 'Call Now' : 'Llamar / Escribir al WhatsApp',
    },
  ];

  const whatsappOnboardingMessage = isSAB
    ? isEn
      ? `Hello ${businessName}! 👋\n\nTo build and configure your official winning profile on Google Maps as an Independent Professional and position you in the Local Top 3, we just need you to send us this material:\n\n📸 *1. PHOTOS (Horizontal, clear natural lighting):*\n- 3 Photos of your professional tools, equipment or work vehicle\n- 2 Photos of your dedicated workspace, inventory, or laptop with active work\n- 1 Photo of you smiling in professional work attire\n- High-resolution square logo\n\n🎥 *2. CONTINUOUS 60s VERIFICATION VIDEO (No cuts):*\n- Filming your work tools/instruments\n- Filming your official tax ID/registration (LLC/EIN/RUT) and business cards\n- Filming your dedicated workspace or vehicle\n\n📋 *3. OPERATING DATA:*\n- Top service specialties\n- Coverage zones/cities you travel to\n- Accepted payment methods\n- Gmail address for ownership\n\nOur Prestigia team handles all technical categories and Google SAB optimization! 🚀`
      : `¡Hola ${businessName}! 👋\n\nPara construir y configurar la ficha oficial de tu actividad como Profesional Independiente / Servicios a Domicilio en el Top 3 de Google Maps, únicamente requerimos que nos envíes este material:\n\n📸 *1. FOTOS (Horizontales y con buena luz):*\n- 3 Fotos de tus herramientas de trabajo, equipos o vehículo de servicio\n- 2 Fotos de tu espacio de trabajo, bodega o computador de gestión\n- 1 Foto tuya sonriendo con vestimenta profesional\n- Logo cuadrado en buena calidad\n\n🎥 *2. VIDEO DE VERIFICACIÓN DE 60 SEGUNDOS (Continuo sin cortes):*\n- Grabando tus herramientas o equipo de servicio\n- Grabando tu RUT / Registro tributario y tarjetas de presentación\n- Grabando tu vehículo de trabajo o área de preparación\n\n📋 *3. DATOS OPERATIVOS:*\n- Lista de servicios o especialidades\n- Zonas y barrios de cobertura donde te desplazas\n- Medios de pago recibidos\n- Correo de Gmail donde deseas la propiedad de la ficha\n\n¡Del montaje técnico, zonas de cobertura y blindaje anti-suspensión nos encargamos nosotros con el equipo de Prestigia! 🚀`
    : isEn
    ? `Hello ${businessName}! 👋\n\nTo build and configure your official winning profile on Google Maps and position you in the Local Top 3, we just need you to send us this material:\n\n📸 *1. PHOTOS (Horizontal, clear light):*\n- 2 Exterior facade photos (day and illuminated night)\n- 3 Interior customer area photos\n- 4 to 6 photos of your star products or dishes\n- 1 photo of your smiling team\n- High-resolution square logo\n\n🎥 *2. CONTINUOUS 60s VERIFICATION VIDEO (No cuts):*\n- Filming the street and your facade sign\n- Opening the front door with your keys\n- Filming the register/POS and billing screen\n\n📋 *3. OPERATING DATA:*\n- Menu / price list\n- Exact hours (Mon-Sun & Holidays)\n- Accepted payment methods\n- Gmail address where you want profile ownership\n\nOur Prestigia team will handle all technical categories and SEO architecture! 🚀`
    : `¡Hola ${businessName}! 👋\n\nPara construir y configurar la ficha oficial de tu negocio con la arquitectura ganadora del Top 3 de Google Maps, únicamente requerimos que nos envíes este material:\n\n📸 *1. FOTOS (Horizontales y con buena luz):*\n- 2 Fotos de fachada exterior (de día y de noche con letrero iluminado)\n- 3 Fotos del salón o área de clientes limpia\n- 4 a 6 Fotos de tus productos o platos estrella\n- 1 Foto del equipo de atención sonriendo\n- Logo cuadrado en buena calidad\n\n🎥 *2. VIDEO DE VERIFICACIÓN DE 60 SEGUNDOS (Continuo sin cortes):*\n- Grabando la calle y el letrero de la fachada\n- Abriendo la puerta con las llaves\n- Grabando la caja registradora, datáfono y computador con facturación\n\n📋 *3. DATOS OPERATIVOS:*\n- Menú o catálogo de precios\n- Horarios exactos de Lunes a Domingo y Festivos\n- Medios de pago recibidos\n- Correo de Gmail donde deseas la propiedad de la ficha\n\n¡Del montaje técnico, palabras clave y categorías nos encargamos nosotros con el equipo de Prestigia! 🚀`;

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
          healthScore: 56,
          criticalGaps: [
            isEn ? 'Missing 5 critical secondary categories in Google Maps' : 'Faltan 5 subcategorías secundarias obligatorias en Google Maps',
            isEn ? 'Commercial description is short and lacks local high-intent keywords' : 'Descripción corta y sin palabras clave de compra local',
            isEn ? 'Zero cataloged products or services in Google profile tabs' : 'Cero productos o servicios cargados en las pestañas oficiales',
            isEn ? 'Over 65% of reviews remain unanswered without official response' : 'Más del 65% de reseñas no tienen respuesta oficial de gerencia',
            isEn ? 'Low photo volume compared to local Top 3 competitors' : 'Volumen de fotos insuficiente frente a los 3 líderes de la zona',
          ],
          topCompetitorInsights: isEn
            ? `The top 3 leaders in ${city} average 4.7★ with 410+ reviews and 120+ photos. They leverage 6 secondary categories that capture 70% of nearby searches. Applying our Prestigia upgrade roadmap closes this gap within 90 days.`
            : `Los 3 líderes del sector en ${city} promedian 4.7★ con 410+ opiniones y más de 120 fotos. Utilizan 6 subcategorías secundarias que acaparan el 70% de las búsquedas en la zona. Aplicando la hoja de ruta Prestigia cerramos esta brecha en 90 días.`,
          actionRoadmap: [
            {
              step: 1,
              title: isEn ? 'Category Taxonomy Injection' : 'Inyección de Categorías Secundarias',
              impact: 'CRÍTICO',
              action: isEn ? `Add the 5 secondary categories identified above immediately in Google Business Profile.` : `Agregar de inmediato las 5 subcategorías identificadas arriba en el panel de Google.`,
            },
            {
              step: 2,
              title: isEn ? 'Keyword-Optimized Description' : 'Actualización de Descripción Comercial',
              impact: 'ALTO',
              action: isEn ? 'Replace existing description with the 745-character SEO copy generated above.' : 'Reemplazar la descripción actual por el texto comercial de 745 caracteres con palabras clave.',
            },
            {
              step: 3,
              title: isEn ? 'Service Catalog Setup' : 'Carga de Catálogo de Servicios',
              impact: 'ALTO',
              action: isEn ? 'Publish the 4 structured offerings in Google Products/Services tab.' : 'Publicar los 4 servicios/productos estructurados en la pestaña de Productos de Google.',
            },
            {
              step: 4,
              title: isEn ? 'Q&A Preventive Seeding' : 'Publicación de Preguntas Frecuentes (Q&A)',
              impact: 'MEDIO',
              action: isEn ? 'Post the 5 preventive Q&As to boost algorithmic search indexation.' : 'Publicar las 5 preguntas y respuestas oficiales para que Google indexe más términos de búsqueda.',
            },
            {
              step: 5,
              title: isEn ? 'Prestigia 5★ Review Acceleration' : 'Activación del Blindaje Prestigia en Mesa',
              impact: 'CRÍTICO',
              action: isEn ? 'Deploy table QR codes to filter complaints privately and capture +40 fresh 5★ reviews/mo.' : 'Desplegar el código QR en mesa para contener quejas en privado y capturar +40 reseñas 5★ al mes.',
            },
          ],
        }
      : {}),
  };
}
