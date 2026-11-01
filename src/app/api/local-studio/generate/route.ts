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
    } = body;

    if (!businessName || !businessName.trim()) {
      return NextResponse.json({ error: 'El nombre del negocio es obligatorio' }, { status: 400 });
    }

    const cleanName = businessName.trim();
    const cleanCity = city.trim() || 'Colombia';
    const cleanNeighborhood = neighborhood.trim();
    const cleanSpecialties = specialties.trim();
    const cleanPhone = phone.trim();
    const isEn = lang === 'en';

    // -------------------------------------------------------------
    // 1. LIVE GEMINI 1.5 FLASH ENGINE
    // -------------------------------------------------------------
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const prompt = `Eres el Especialista Principal en Posicionamiento Local de Google Maps (Local SEO & Google Business Profile Architecture) de Prestigia LatAm.
Tu misión es generar la arquitectura y configuración técnica EXACTA para que el siguiente negocio domine el Top 3 (Local 3-Pack) en Google Maps.

DATOS DEL NEGOCIO:
- Modo: ${mode === 'create' ? 'CONSTRUIR FICHA NUEVA DESDE CERO (El negocio no tiene Google Maps)' : 'AUDITORÍA FORENSE Y UPGRADE AL TOP 3 (Ficha existente con fugas)'}
- Nombre Comercial: "${cleanName}"
- Sector/Categoría: "${category}"
- Ciudad: "${cleanCity}"
- Barrio / Zona Comercial: "${cleanNeighborhood || 'Zona central comercial'}"
- Especialidades / Platos o Servicios Estrella: "${cleanSpecialties || 'Servicios destacados de alta demanda'}"
- Teléfono / WhatsApp: "${cleanPhone || 'Línea directa de atención'}"
- Enlace Actual (si aplica): "${googleUrl || 'Sin enlace'}"
- Calificación y Reseñas Actuales (si aplica): ${existingRating}★ (${existingReviews} opiniones)
- Idioma de respuesta: ${isEn ? 'Inglés' : 'Español'}

REGLAS CRÍTICAS DE CALIDAD:
1. "primaryCategory": La categoría principal OFICIAL de Google Maps más relevante y de mayor volumen.
2. "secondaryCategories": Exactamente entre 5 y 7 subcategorías secundarias oficiales de Google Maps para acaparar búsquedas alternativas y de cola larga.
3. "optimizedTitle": Título comercial estratégico siguiendo la fórmula anti-suspensión: "[Nombre de Marca] | [Especialidad Clave] [Barrio/Ciudad]".
4. "commercialDescription": Texto de entre 680 y 745 caracteres (límite Google: 750). Altamente persuasivo, con emojis elegantes, llamada a la acción clara y conteniendo las 8 palabras clave de compra local más buscadas.
5. "serviceCatalog": Arreglo de 4 a 6 servicios/productos estrella estructurados con nombre comercial, descripción corta de 15 palabras y etiqueta de categoría.
6. "photoChecklist": Arreglo de 5 tipos de fotos obligatorias (Fachada exterior día/noche, salón/interior, productos estrella, equipo sonriendo, logo cuadrado) con el nombre exacto de archivo geolocalizado recomendado para SEO (ej: "${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${cleanCity.toLowerCase()}-fachada.jpg").
7. "preventiveFaqs": Exactamente 5 preguntas y respuestas estratégicas para la sección de Preguntas y Respuestas (Q&A) de Google Maps (horarios, métodos de pago, reservas/domicilios, parqueadero, pet-friendly o garantías).
8. "verificationGuide": Guía clara y paso a paso para el video de verificación de 60-90 segundos sin cortes que exige Google, detallando: toma 1 (exterior y letrero), toma 2 (abrir puerta con llaves), toma 3 (caja/sistema interno) y documentos de respaldo.
9. "whatsappOnboardingMessage": Mensaje completo y amigable listo para enviar al cliente por WhatsApp solicitando de una sola vez todas las fotos, el video de 60s, el menú y los horarios.
${mode === 'audit' ? `10. Para Modo Auditoría:
    - "healthScore": Número entero entre 40 y 68 evaluando la salud SEO actual.
    - "criticalGaps": 4 a 5 brechas graves detectadas (ej: falta de categorías secundarias, descripción sin palabras clave, sin productos cargados, abandono de reseñas).
    - "topCompetitorInsights": Análisis conciso de por qué los 3 rivales del Top 3 están ganando y cómo superarlos en 90 días.
    - "actionRoadmap": 5 pasos prioritarios con nivel de impacto (CRÍTICO, ALTO, MEDIO) para implementar de inmediato.` : ''}

RESPONDE ÚNICAMENTE UN OBJETO JSON VÁLIDO CON ESTA ESTRUCTURA (SIN TEXTO EXTRA):
{
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
    "title": "Guía Blindada de Verificación por Video en 1 Intento",
    "overview": "...",
    "cameraTake1": "...",
    "cameraTake2": "...",
    "cameraTake3": "...",
    "documents": ["...", "..."]
  },
  "whatsappOnboardingMessage": "..."${mode === 'audit' ? `,
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
}) {
  const { businessName, category, city, neighborhood, specialties, phone, mode, lang } = params;
  const isEn = lang === 'en';
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

  const verificationGuide = {
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

  const whatsappOnboardingMessage = isEn
    ? `Hello ${businessName}! 👋\n\nTo build and configure your official winning profile on Google Maps and position you in the Local Top 3, we just need you to send us this material:\n\n📸 *1. PHOTOS (Horizontal, clear light):*\n- 2 Exterior facade photos (day and illuminated night)\n- 3 Interior customer area photos\n- 4 to 6 photos of your star products or dishes\n- 1 photo of your smiling team\n- High-resolution square logo\n\n🎥 *2. CONTINUOUS 60s VERIFICATION VIDEO (No cuts):*\n- Filming the street and your facade sign\n- Opening the front door with your keys\n- Filming the register/POS and billing screen\n\n📋 *3. OPERATING DATA:*\n- Menu / price list\n- Exact hours (Mon-Sun & Holidays)\n- Accepted payment methods\n- Gmail address where you want profile ownership\n\nOur Prestigia team will handle all technical categories and SEO architecture! 🚀`
    : `¡Hola ${businessName}! 👋\n\nPara construir y configurar la ficha oficial de tu negocio con la arquitectura ganadora del Top 3 de Google Maps, únicamente requerimos que nos envíes este material:\n\n📸 *1. FOTOS (Horizontales y con buena luz):*\n- 2 Fotos de fachada exterior (de día y de noche con letrero iluminado)\n- 3 Fotos del salón o área de clientes limpia\n- 4 a 6 Fotos de tus productos o platos estrella\n- 1 Foto del equipo de atención sonriendo\n- Logo cuadrado en buena calidad\n\n🎥 *2. VIDEO DE VERIFICACIÓN DE 60 SEGUNDOS (Continuo sin cortes):*\n- Grabando la calle y el letrero de la fachada\n- Abriendo la puerta con las llaves\n- Grabando la caja registradora, datáfono y computador con facturación\n\n📋 *3. DATOS OPERATIVOS:*\n- Menú o catálogo de precios\n- Horarios exactos de Lunes a Domingo y Festivos\n- Medios de pago recibidos\n- Correo de Gmail donde deseas la propiedad de la ficha\n\n¡Del montaje técnico, palabras clave y categorías nos encargamos nosotros con el equipo de Prestigia! 🚀`;

  return {
    primaryCategory,
    secondaryCategories,
    optimizedTitle,
    commercialDescription,
    serviceCatalog,
    photoChecklist,
    preventiveFaqs,
    verificationGuide,
    whatsappOnboardingMessage,
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
