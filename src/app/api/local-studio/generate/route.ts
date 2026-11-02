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

function detectTaxonomyAndContent(params: {
  category: string;
  specialties: string;
  businessName: string;
  isEn: boolean;
  locationTag: string;
  phone: string;
  city: string;
  neighborhood: string;
}) {
  const combined = `${params.category} ${params.specialties} ${params.businessName}`.toLowerCase();
  const isEn = params.isEn;

  // 1. GASTRONOMÍA / RESTAURANTES
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
          ? ['Pasta Shop', 'Pizza Restaurant', 'Mediterranean Restaurant', 'Takeout Restaurant', 'Meal Delivery']
          : ['Restaurante de pastas', 'Pizzería', 'Restaurante mediterráneo', 'Comida para llevar', 'Entrega a domicilio'],
        catalog: [
          {
            name: isEn ? 'Artisanal Fresh Pasta' : 'Pastas Frescas Artesanales',
            description: isEn ? 'Handmade al dente pasta served with rich traditional Italian sauces.' : 'Elaboradas al momento con recetas tradicionales italianas y salsas frescas.',
            tag: isEn ? 'Italian Restaurant' : 'Restaurante italiano'
          },
          {
            name: isEn ? 'Oven-Baked Lasagna' : 'Lasañas Especiales al Horno',
            description: isEn ? 'Generous layers of slow-baked lasagna topped with melted golden cheese.' : 'Capas generosas de pasta artesanal horneadas con queso gratinado y recetas exclusivas.',
            tag: isEn ? 'Signature Dish' : 'Especialidad de la Casa'
          },
          {
            name: isEn ? 'Mediterranean Antipasti & Wine' : 'Antipastos & Selección de Vinos',
            description: isEn ? 'Curated starters, fresh salads, and beverage pairings for your table.' : 'Entradas mediterráneas, ensaladas frescas y maridaje perfecto para tu velada.',
            tag: isEn ? 'Starters' : 'Entradas & Bebidas'
          },
          {
            name: isEn ? 'Executive Lunch & Family Dinners' : 'Menú Ejecutivo & Cenas Familiares',
            description: isEn ? 'Special combinations designed for daily lunch or cozy evening celebrations.' : 'Combinaciones completas ideales para almuerzos entre semana o cenas especiales.',
            tag: isEn ? 'Menus' : 'Planes & Grupos'
          }
        ]
      };
    }

    // 1B. Pizza
    if (combined.includes('pizza') || combined.includes('pizzer')) {
      return {
        primaryCategory: isEn ? 'Pizza Restaurant' : 'Pizzería',
        secondaryCategories: isEn
          ? ['Italian Restaurant', 'Fast Food Restaurant', 'Takeout Restaurant', 'Meal Delivery', 'Family Style Restaurant']
          : ['Restaurante italiano', 'Comida rápida', 'Comida para llevar', 'Entrega a domicilio', 'Restaurante familiar'],
        catalog: [
          {
            name: isEn ? 'Artisanal Crust Pizzas' : 'Pizzas Artesanales a la Piedra',
            description: isEn ? 'Crispy, stone-baked thin crust pizza with premium toppings and real mozzarella.' : 'Masa madurada horneada a la piedra con queso mozzarella seleccionado e ingredientes frescos.',
            tag: isEn ? 'Pizza Restaurant' : 'Pizzería'
          },
          {
            name: isEn ? 'Stuffed Crust & Specialty Pizzas' : 'Pizzas Especiales & Bordes Rellenos',
            description: isEn ? 'Signature chef recipes with stuffed cheese crust and premium toppings.' : 'Recetas de la casa con bordes de queso derretido y combinaciones gourmet exclusivas.',
            tag: isEn ? 'Signature' : 'Especialidades'
          },
          {
            name: isEn ? 'Combos & Family Packs' : 'Combos Familiares & Bebidas',
            description: isEn ? 'Great value party combos including large pizzas, sides, and refreshing drinks.' : 'Paquetes completos con pizzas grandes, acompañamientos y bebidas para compartir.',
            tag: isEn ? 'Combos' : 'Combos & Promociones'
          },
          {
            name: isEn ? 'Express Home Delivery' : 'Servicio a Domicilio Express',
            description: isEn ? 'Hot, fresh pizza delivered right to your doorstep in minutes.' : 'Entrega rápida a domicilio garantizando temperatura perfecta y empaque sellado.',
            tag: isEn ? 'Delivery' : 'Domicilios'
          }
        ]
      };
    }

    // 1C. Carnes / Parrilla / Asados / BBQ
    if (combined.includes('carne') || combined.includes('parrilla') || combined.includes('asado') || combined.includes('steak') || combined.includes('bbq')) {
      return {
        primaryCategory: isEn ? 'Steak House' : 'Restaurante de carnes',
        secondaryCategories: isEn
          ? ['Bar & Grill', 'Barbecue Restaurant', 'Family Style Restaurant', 'Takeout Restaurant', 'Catering Food Service']
          : ['Parrilla', 'Restaurante de barbacoa', 'Restaurante familiar', 'Bar y parrilla', 'Asador'],
        catalog: [
          {
            name: isEn ? 'Prime Cut Steaks' : 'Cortes de Carne Madurados',
            description: isEn ? 'Selected prime cuts grilled to perfection over natural charcoal.' : 'Cortes premium asados al carbón con el término exacto de cocción y sazón artesanal.',
            tag: isEn ? 'Steak House' : 'Carnes & Parrilla'
          },
          {
            name: isEn ? 'Mixed Charcoal Platter' : 'Parrilladas Mixtas para Compartir',
            description: isEn ? 'Generous platters with assorted beef, pork, artisan chorizo, and sides.' : 'Generosa combinación de cortes de res, cerdo, chorizos artesanales y guarniciones.',
            tag: isEn ? 'Platters' : 'Para Compartir'
          },
          {
            name: isEn ? 'Signature Burgers & Ribs' : 'Costillas BBQ & Hamburguesas a la Brasa',
            description: isEn ? 'Fall-off-the-bone smoked ribs and artisanal flame-grilled burgers.' : 'Costillas tiernas bañadas en salsa BBQ de la casa y hamburguesas con carne madurada.',
            tag: isEn ? 'Favorites' : 'Especiales'
          },
          {
            name: isEn ? 'Celebrations & Group Events' : 'Eventos Especiales & Reservas',
            description: isEn ? 'Spacious reservations and special meat menus for birthday and corporate events.' : 'Atención preferencial y menús diseñados para cumpleaños y almuerzos empresariales.',
            tag: isEn ? 'Events' : 'Eventos'
          }
        ]
      };
    }

    // 1D. Hamburguesas / Fast Food
    if (combined.includes('hamburgues') || combined.includes('burger')) {
      return {
        primaryCategory: isEn ? 'Hamburger Restaurant' : 'Restaurante de hamburguesas',
        secondaryCategories: isEn
          ? ['Fast Food Restaurant', 'American Restaurant', 'Takeout Restaurant', 'Meal Delivery', 'Family Style Restaurant']
          : ['Comida rápida', 'Restaurante de comida americana', 'Comida para llevar', 'Entrega a domicilio', 'Restaurante familiar'],
        catalog: [
          {
            name: isEn ? 'Artisanal Brioche Burgers' : 'Hamburguesas Artesanales en Pan Brioche',
            description: isEn ? '100% premium beef smashed or grilled with double melted cheese.' : 'Carne 100% de res a la parrilla con doble queso fundido y pan brioche horneado a diario.',
            tag: isEn ? 'Burgers' : 'Hamburguesas'
          },
          {
            name: isEn ? 'Loaded Crispy Fries' : 'Papas Rústicas Cargadas',
            description: isEn ? 'Golden crispy fries topped with cheddar sauce, crispy bacon, and jalapeños.' : 'Papas crujientes con salsa de queso cheddar fundido, tocineta crocante y aderezos.',
            tag: isEn ? 'Sides' : 'Acompañamientos'
          },
          {
            name: isEn ? 'Thick Shakes & Beverages' : 'Malteadas Artesanales & Bebidas',
            description: isEn ? 'Creamy handcrafted milkshakes and refreshing drinks.' : 'Malteadas cremosas de sabores clásicos y bebidas frías para acompañar tu combo.',
            tag: isEn ? 'Drinks' : 'Bebidas'
          },
          {
            name: isEn ? 'Express Fast Delivery' : 'Envíos Rápidos a Domicilio',
            description: isEn ? 'Fast, hot packaging delivery to enjoy at home or office.' : 'Empaque térmico especial para que tus hamburguesas lleguen calientes y crocantes.',
            tag: isEn ? 'Delivery' : 'Domicilios'
          }
        ]
      };
    }

    // 1E. Café / Pastelería
    if (combined.includes('cafe') || combined.includes('café') || combined.includes('coffee') || combined.includes('panader') || combined.includes('pasteler')) {
      return {
        primaryCategory: isEn ? 'Coffee Shop' : 'Cafetería',
        secondaryCategories: isEn
          ? ['Bakery', 'Breakfast Restaurant', 'Espresso Bar', 'Brunch Restaurant', 'Pastry Shop']
          : ['Pastelería', 'Panadería', 'Café de especialidad', 'Restaurante de desayunos', 'Brunch'],
        catalog: [
          {
            name: isEn ? 'Specialty Origin Coffee' : 'Café de Especialidad de Origen',
            description: isEn ? 'Freshly ground local origin beans prepared with precision espresso methods.' : 'Granos de origen seleccionados preparados en espresso, filtrados y métodos artesanales.',
            tag: isEn ? 'Coffee' : 'Cafetería'
          },
          {
            name: isEn ? 'Fresh Baked Pastries' : 'Panadería & Repostería del Día',
            description: isEn ? 'Daily fresh croissants, artisan pastries, cakes, and sweet treats.' : 'Croissants de mantequilla, panes artesanales recién salidos del horno y tortas de la casa.',
            tag: isEn ? 'Bakery' : 'Panadería'
          },
          {
            name: isEn ? 'All-Day Breakfast & Brunch' : 'Desayunos Sorpresa & Brunch',
            description: isEn ? 'Hearty brunch plates with fresh eggs, artisan sourdough, and fresh fruits.' : 'Opciones completas de desayuno con huevos al gusto, tostadas y jugos naturales.',
            tag: isEn ? 'Brunch' : 'Desayunos & Brunch'
          },
          {
            name: isEn ? 'Cozy Atmosphere & Meetings' : 'Espacio Cómodo & Wi-Fi de Alta Velocidad',
            description: isEn ? 'Relaxing atmosphere with comfortable seating and fast connection for work or study.' : 'Ambiente tranquilo con buena iluminación y tomas eléctricas ideal para trabajar o charlar.',
            tag: isEn ? 'Space' : 'Experiencia'
          }
        ]
      };
    }

    // 1F. Sushi / Asiático
    if (combined.includes('sushi') || combined.includes('japon') || combined.includes('asiat') || combined.includes('ramen') || combined.includes('wok')) {
      return {
        primaryCategory: isEn ? 'Japanese Restaurant' : 'Restaurante japonés',
        secondaryCategories: isEn
          ? ['Sushi Restaurant', 'Asian Restaurant', 'Ramen Restaurant', 'Takeout Restaurant', 'Meal Delivery']
          : ['Restaurante de sushi', 'Restaurante asiático', 'Comida para llevar', 'Entrega a domicilio', 'Restaurante de ramen'],
        catalog: [
          {
            name: isEn ? 'Signature Sushi Rolls' : 'Rollos de Sushi Especiales',
            description: isEn ? 'Fresh salmon, tuna, avocado, and tempura rolls crafted with precision.' : 'Rollos preparados con salmón fresco, atún, aguacate y técnicas de alta cocina japonesa.',
            tag: isEn ? 'Sushi' : 'Sushi Especial'
          },
          {
            name: isEn ? 'Wok & Traditional Ramen' : 'Platos Wok & Ramen Tradicional',
            description: isEn ? 'Rich broths, artisanal noodles, wok stir-fries, and fragrant gyozas.' : 'Caldos lentos con fideos artesanales, salteados al wok y gyozas crocantes.',
            tag: isEn ? 'Hot Dishes' : 'Platos Calientes'
          },
          {
            name: isEn ? 'Sushi Boats & Party Platters' : 'Barcos & Bandejas para Compartir',
            description: isEn ? 'Large sushi selections presented for celebrations and group dining.' : 'Bandejas y barcos variados con 30 a 50 bocados para celebraciones especiales.',
            tag: isEn ? 'Platters' : 'Para Compartir'
          },
          {
            name: isEn ? 'Protected Delivery Packs' : 'Empaques Seguros para Domicilios',
            description: isEn ? 'Temperature-controlled containers ensuring fresh sushi right to your table.' : 'Empaque hermético que preserva la frescura, salsa de soya y palillos incluidos.',
            tag: isEn ? 'Delivery' : 'Domicilios'
          }
        ]
      };
    }

    // 1G. Restaurante General (Sin bar y parrilla arbitrario)
    return {
      primaryCategory: isEn ? 'Restaurant' : 'Restaurante',
      secondaryCategories: isEn
        ? ['Family Style Restaurant', 'Lunch Restaurant', 'Takeout Restaurant', 'Meal Delivery', 'Local Cuisine Restaurant']
        : ['Restaurante familiar', 'Restaurante para almorzar', 'Comida para llevar', 'Entrega a domicilio', 'Restaurante de cocina local'],
      catalog: [
        {
          name: isEn ? 'Signature Chef Specialties' : 'Platos de Autor & Especialidad de la Casa',
          description: isEn ? 'Our most celebrated recipes crafted with seasonal fresh ingredients.' : 'Recetas insignia elaboradas a diario con los más frescos ingredientes locales.',
          tag: isEn ? 'Specialties' : 'Especialidades'
        },
        {
          name: isEn ? 'Daily Executive Lunch' : 'Almuerzos Ejecutivos Completos',
          description: isEn ? 'Balanced daily menus with entrée, main dish, beverage, and dessert.' : 'Menú balanceado con entrada, plato fuerte, bebida y postre con atención rápida.',
          tag: isEn ? 'Daily Menu' : 'Menú del Día'
        },
        {
          name: isEn ? 'Family & Group Gatherings' : 'Atención para Familias & Grupos',
          description: isEn ? 'Comfortable dining setups and reserved seating for friends and corporate meetings.' : 'Mesas amplias y atención personalizada para reuniones de trabajo o eventos familiares.',
          tag: isEn ? 'Groups' : 'Grupos & Reservas'
        },
        {
          name: isEn ? 'Fast Takeout & Home Delivery' : 'Servicio para Llevar & Domicilios',
          description: isEn ? 'Easy phone or WhatsApp ordering with fast packaging and prompt local delivery.' : 'Pide con anticipación para recoger o solicita tu domicilio directo por WhatsApp.',
          tag: isEn ? 'Service' : 'Domicilios & Para Llevar'
        }
      ]
    };
  }

  // 2. SALUD / ODONTOLOGÍA
  if (combined.includes('médic') || combined.includes('salud') || combined.includes('odontol') || combined.includes('dent') || combined.includes('dient') || combined.includes('estétic')) {
    if (combined.includes('odontol') || combined.includes('dent') || combined.includes('dient') || combined.includes('sonrisa') || combined.includes('ortodoncia') || combined.includes('implante')) {
      return {
        primaryCategory: isEn ? 'Dental Clinic' : 'Clínica dental',
        secondaryCategories: isEn
          ? ['Dentist', 'Orthodontist', 'Cosmetic Dentist', 'Dental Implants Periodontist', 'Emergency Dental Service']
          : ['Dentista', 'Ortodoncista', 'Clínica de periodoncia', 'Diseño de sonrisa', 'Servicio dental de urgencia'],
        catalog: [
          {
            name: isEn ? 'Comprehensive Dental Checkup' : 'Valoración Odontológica Integral',
            description: isEn ? 'Complete diagnostic exam with high-resolution digital imaging.' : 'Diagnóstico digital completo con radiografías y plan de tratamiento personalizado.',
            tag: isEn ? 'Diagnosis' : 'Diagnóstico'
          },
          {
            name: isEn ? 'Smile Design & Teeth Whitening' : 'Diseño de Sonrisa & Blanqueamiento',
            description: isEn ? 'Minimally invasive cosmetic enhancements and professional whitening.' : 'Carillas de alta estética y blanqueamiento dental clínico seguro y duradero.',
            tag: isEn ? 'Aesthetics' : 'Estética Dental'
          },
          {
            name: isEn ? 'Modern Invisible Orthodontics' : 'Ortodoncia Invisible & Brackets',
            description: isEn ? 'Clear aligners and advanced braces for comfortable teeth alignment.' : 'Alineadores invisibles y ortodoncia moderna para niños y adultos.',
            tag: isEn ? 'Orthodontics' : 'Ortodoncia'
          },
          {
            name: isEn ? 'Dental Implants & Rehabilitation' : 'Implantes Dentales & Rehabilitación Oral',
            description: isEn ? 'Titanium biocompatible implants restoring full biting strength and aesthetics.' : 'Recuperación de piezas dentales con implantes de titanio biocompatibles y coronas cerámicas.',
            tag: isEn ? 'Implants' : 'Implantes & Cirugía'
          }
        ]
      };
    }
    return {
      primaryCategory: isEn ? 'Medical Clinic' : 'Clínica médica',
      secondaryCategories: isEn
        ? ['Doctor', 'Medical Center', 'Specialized Clinic', 'Health Consultant', 'Family Practice Physician']
        : ['Centro médico', 'Médico especialista', 'Consultorio médico', 'Centro de salud y bienestar', 'Clínica especializada'],
      catalog: [
        {
          name: isEn ? 'Specialized Medical Consultation' : 'Consulta Médica Especializada',
          description: isEn ? 'Personalized medical evaluation and diagnostics with certified doctors.' : 'Atención médica cercana y personalizada con especialistas certificados.',
          tag: isEn ? 'Consultation' : 'Consulta Médica'
        },
        {
          name: isEn ? 'Preventive Health Checkup' : 'Exámenes Preventivos & Chequeos',
          description: isEn ? 'Comprehensive health screenings and lab reviews for optimal wellbeing.' : 'Evaluaciones completas para detección temprana y cuidado de tu salud.',
          tag: isEn ? 'Prevention' : 'Prevención'
        },
        {
          name: isEn ? 'Treatment & Chronic Care' : 'Tratamientos & Seguimiento Continuo',
          description: isEn ? 'Tailored clinical therapies with regular digital health monitoring.' : 'Planes de tratamiento guiados con citas de control y soporte continuo.',
          tag: isEn ? 'Therapy' : 'Tratamientos'
        },
        {
          name: isEn ? 'Priority Telehealth & WhatsApp Care' : 'Atención Prioritaria & Canales Digitales',
          description: isEn ? 'Direct appointment scheduling and medical guidance via WhatsApp.' : 'Agendamiento ágil de citas y atención preferencial sin largas esperas.',
          tag: isEn ? 'Service' : 'Atención al Paciente'
        }
      ]
    };
  }

  // 3. TALLER MECÁNICO / AUTOMOTRIZ
  if (combined.includes('auto') || combined.includes('taller') || combined.includes('mecánic') || combined.includes('frenos') || combined.includes('vehícul')) {
    return {
      primaryCategory: isEn ? 'Auto Repair Shop' : 'Taller mecánico',
      secondaryCategories: isEn
        ? ['Brake Shop', 'Oil Change Service', 'Car Inspection Station', 'Mechanic', 'Auto Electrical Service']
        : ['Taller de automóviles', 'Servicio de cambio de aceite', 'Taller de frenos', 'Mecánico', 'Diagnóstico automotriz'],
      catalog: [
        {
          name: isEn ? 'Computerized Vehicle Diagnostics' : 'Diagnóstico Computarizado & Escáner',
          description: isEn ? 'High-tech scanner reading all engine, transmission, and sensor codes.' : 'Escaneo electrónico avanzado de motor, transmisión y sensores con reporte detallado.',
          tag: isEn ? 'Diagnostics' : 'Diagnóstico'
        },
        {
          name: isEn ? 'Brake & Suspension Overhaul' : 'Mantenimiento de Frenos & Suspensión',
          description: isEn ? 'Pad replacement, rotor resurfacing, shocks, and precision alignment.' : 'Cambio de pastillas, rectificación de discos, amortiguadores y alineación 3D.',
          tag: isEn ? 'Safety' : 'Frenos & Suspensión'
        },
        {
          name: isEn ? 'Oil & Filter Preventive Service' : 'Cambio de Aceite & Filtros Originales',
          description: isEn ? 'Premium synthetic motor oils and certified filters extending engine life.' : 'Aceites sintéticos certificados y filtros originales para máxima protección del motor.',
          tag: isEn ? 'Maintenance' : 'Mantenimiento'
        },
        {
          name: isEn ? 'Pre-Purchase Vehicle Inspection' : 'Peritaje & Revisión Técnico-Mecánica',
          description: isEn ? 'Exhaustive 80-point vehicle inspection before buying or road trips.' : 'Revisión preventiva de 80 puntos antes de viajes o compra de vehículos usados.',
          tag: isEn ? 'Inspection' : 'Peritaje'
        }
      ]
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
        catalog: [
          {
            name: isEn ? 'Classic & Fade Haircuts' : 'Cortes Clásicos & Degradados Modernos',
            description: isEn ? 'Precision scissor and clipper fades tailored to your face structure.' : 'Degradados impecables, fades y cortes clásicos adaptados a tu estilo personal.',
            tag: isEn ? 'Haircut' : 'Corte de Cabello'
          },
          {
            name: isEn ? 'Hot Towel Beard Grooming' : 'Perfilado de Barba & Ritual Toalla Caliente',
            description: isEn ? 'Beard sculpting with straight razor edge, essential oils, and hot towel relaxation.' : 'Afeitado tradicional a navaja, aceites hidratantes y toalla caliente relajante.',
            tag: isEn ? 'Beard' : 'Barba & Afeitado'
          },
          {
            name: isEn ? 'Hair Treatment & Color' : 'Tratamientos Capilares & Pigmentación',
            description: isEn ? 'Gray blending, scalp therapy, and nourishing treatments for healthy hair.' : 'Matización de canas, exfoliación de cuero cabelludo y nutrición profunda.',
            tag: isEn ? 'Treatments' : 'Tratamientos'
          },
          {
            name: isEn ? 'VIP Grooming Experience' : 'Combo VIP Completo (Corte + Barba + Mascarilla)',
            description: isEn ? 'Complete executive styling package including cut, beard trim, and cleansing facial mask.' : 'Paquete integral con corte, arreglo de barba, mascarilla facial negra y bebida de cortesía.',
            tag: isEn ? 'VIP' : 'Combos VIP'
          }
        ]
      };
    }
    return {
      primaryCategory: isEn ? 'Beauty Salon' : 'Salón de belleza',
      secondaryCategories: isEn
        ? ['Hair Salon', 'Nail Salon', 'Spa', 'Esthetician', 'Cosmetics Store']
        : ['Peluquería', 'Salón de manicura', 'Centro de estética', 'Spa y bienestar', 'Estilista'],
      catalog: [
        {
          name: isEn ? 'Balayage & Advanced Hair Color' : 'Balayage, Mechas & Colorimetría Avanzada',
          description: isEn ? 'Customized lightening and tone correction protecting your hair health.' : 'Aclarados profesionales, matices luminosos y tinturas de alta duración sin maltratar el cabello.',
          tag: isEn ? 'Color' : 'Colorimetría'
        },
        {
          name: isEn ? 'Russian Manicure & Pedicure Spa' : 'Manicura Rusa & Pedicura Spa',
          description: isEn ? 'Long-lasting gel polish, acrylics, and hydrating foot massage.' : 'Esmaltado semipermanente, uñas en acrílico y exfoliación spa hidratante.',
          tag: isEn ? 'Nails' : 'Uñas & Manicura'
        },
        {
          name: isEn ? 'Keratin & Deep Hair Repair' : 'Alisados Progresivos & Keratina Orgánica',
          description: isEn ? 'Frizz-free silk finish with organic botanical keratin treatments.' : 'Cabello liso, suave y con brillo espejo gracias a fórmulas orgánicas libres de formol.',
          tag: isEn ? 'Hair Repair' : 'Alisados & Hidratación'
        },
        {
          name: isEn ? 'Bridal & Event Makeup' : 'Peinados & Maquillaje Profesional para Eventos',
          description: isEn ? 'Long-lasting photographic makeup and elegant updos for weddings and galas.' : 'Maquillaje de alta definición y peinados de fiesta para novias, grados y eventos.',
          tag: isEn ? 'Events' : 'Maquillaje & Peinados'
        }
      ]
    };
  }

  // 5. SERVICIOS PROFESIONALES / LEGAL / B2B
  if (combined.includes('abog') || combined.includes('legal') || combined.includes('juríd')) {
    return {
      primaryCategory: isEn ? 'Law Firm' : 'Bufete de abogados',
      secondaryCategories: isEn
        ? ['Lawyer', 'Legal Services', 'Corporate Office', 'Business Management Consultant', 'Real Estate Attorney']
        : ['Abogado', 'Servicios legales', 'Asesoría jurídica', 'Consultoría legal', 'Abogado laboralista'],
      catalog: [
        {
          name: isEn ? 'Initial Legal Evaluation' : 'Consulta & Diagnóstico Jurídico Estratégico',
          description: isEn ? 'Exhaustive review of your case, risks, and winning legal strategy.' : 'Análisis detallado de tu situación legal, riesgos y ruta jurídica más conveniente.',
          tag: isEn ? 'Consultation' : 'Asesoría'
        },
        {
          name: isEn ? 'Contract Drafting & Review' : 'Elaboración & Blindaje de Contratos',
          description: isEn ? 'Drafting solid commercial, labor, and real estate agreements.' : 'Redacción de contratos comerciales, laborales y acuerdos de confidencialidad blindados.',
          tag: isEn ? 'Contracts' : 'Contratos'
        },
        {
          name: isEn ? 'Corporate & Business Compliance' : 'Defensa Judicial & Litigios',
          description: isEn ? 'Dedicated court representation protecting your rights and financial assets.' : 'Representación ante juzgados y entidades estatales con estricto seguimiento procesal.',
          tag: isEn ? 'Litigation' : 'Defensa Legal'
        },
        {
          name: isEn ? 'Corporate Legal Advisory' : 'Asesoría Legal Continua para Empresas',
          description: isEn ? 'Monthly retainer legal counsel for growing companies and entrepreneurs.' : 'Acompañamiento jurídico permanente para empresas, prevención de multas y demandas.',
          tag: isEn ? 'Corporate' : 'Empresas'
        }
      ]
    };
  }

  // DEFAULT GENERAL
  return {
    primaryCategory: isEn ? 'Commercial Service' : 'Servicios Comerciales & Profesionales',
    secondaryCategories: isEn
      ? ['Business Management Consultant', 'Corporate Office', 'Specialty Store', 'Service Establishment', 'Local Service']
      : ['Oficina corporativa', 'Comercio local', 'Servicios especializados', 'Asesoría profesional', 'Establecimiento de atención'],
    catalog: [
      {
        name: isEn ? 'Flagship Service' : 'Servicio Especializado Insignia',
        description: isEn ? `Our top requested solution tailored to ${params.businessName} clients.` : `Nuestra solución más solicitada y reconocida en ${params.businessName}.`,
        tag: isEn ? 'Flagship' : 'Servicio Principal'
      },
      {
        name: isEn ? 'Personalized Consultation' : 'Atención Personalizada & Cotizaciones',
        description: isEn ? 'Fast, clear estimates with direct guidance tailored to your project.' : 'Presupuestos claros y asesoría directa adaptada exactamente a lo que necesitas.',
        tag: isEn ? 'Consultation' : 'Atención Personalizada'
      },
      {
        name: isEn ? 'Comprehensive Project Execution' : 'Garantía & Soporte Posventa',
        description: isEn ? 'End-to-end dedicated service ensuring complete customer satisfaction.' : 'Acompañamiento paso a paso garantizando máxima calidad y satisfacción total.',
        tag: isEn ? 'Guarantee' : 'Calidad Garantizada'
      },
      {
        name: isEn ? 'Priority Booking & Fast Response' : 'Atención Prioritaria por WhatsApp',
        description: isEn ? 'Immediate answers and direct scheduling via our official line.' : 'Canal directo para resolver tus dudas de inmediato y agendar tu atención.',
        tag: isEn ? 'Direct Line' : 'Contacto Directo'
      }
    ]
  };
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

  // Semantic category and catalog detection
  const taxonomy = detectTaxonomyAndContent({
    category,
    specialties,
    businessName,
    isEn,
    locationTag,
    phone,
    city,
    neighborhood,
  });

  const primaryCategory = taxonomy.primaryCategory;
  const secondaryCategories = taxonomy.secondaryCategories;
  const serviceCatalog = taxonomy.catalog;

  const rawSpecialties = specialties.trim() || (isEn ? 'signature specialties and top-tier services' : 'platos y especialidades gastronómicas selectas');

  const optimizedTitle = `${businessName} | ${primaryCategory} en ${locationTag}`;

  // Rich, high-impact commercial description (640-730 characters, Google GBP max: 750)
  const commercialDescription = isEn
    ? `Welcome to ${businessName}, the premier destination in ${locationTag} for authentic ${rawSpecialties}. We take pride in delivering outstanding quality, welcoming hospitality, and a memorable experience for every customer. Prepared with fresh, premium ingredients and time-honored techniques, our offerings stand out for flavor and craftsmanship. Whether you are looking for dine-in comfort, convenient takeaway, or prompt local delivery across ${city}, our dedicated team is at your service from Monday through Sunday. Visit us today in ${locationTag} or write directly via WhatsApp to ${phone || 'our customer care line'} for reservations, catering, and orders!`
    : `Bienvenido a ${businessName}, el referente gastronómico en ${locationTag} especializado en auténticas ${rawSpecialties}. Nos apasiona ofrecer la más alta calidad culinaria, servicio cálido y una experiencia memorable para compartir en familia o con amigos. Preparamos cada receta con ingredientes frescos seleccionados y técnicas tradicionales que garantizan el mejor sabor en cada plato. Contamos con cómodas instalaciones para consumo en el local, pedidos para llevar y servicio a domicilio rápido en ${neighborhood ? neighborhood + ' y zonas aledañas en ' : ''}${city}. ¡Visítanos hoy mismo en ${locationTag} o contáctanos por WhatsApp al ${phone || 'nuestro número de atención'} para reservas y pedidos!`;

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
      type: isEn ? 'Star Offering' : 'Servicio Estrella',
      title: isEn ? `Looking for top-tier ${primaryCategory} in ${city}?` : `¿Buscando el mejor servicio de ${primaryCategory} en ${city}?`,
      body: isEn
        ? `At ${businessName}, we specialize in ${rawSpecialties}. Verified experience, prompt attention, and unmatched quality. Message us today!`
        : `En ${businessName} te garantizamos la mejor atención en ${rawSpecialties}. Calidad certificada y puntualidad. ¡Escríbenos hoy mismo!`,
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
              title: isEn ? 'Update GBP Primary & Secondary Categories' : 'Actualizar Categoría Primaria y 5 Secundarias Oficiales',
              impact: 'CRÍTICO',
              action: isEn ? 'Add exact Google categories to trigger algorithmic relevance.' : 'Configurar de inmediato las categorías sugeridas en el panel de Google.',
            },
            {
              step: 2,
              title: isEn ? 'Inject High-Intent Commercial Description' : 'Cargar la Nueva Descripción de Alto Impacto',
              impact: 'ALTO',
              action: isEn ? 'Paste the 700-character copy with direct WhatsApp CTA.' : 'Copiar y pegar el texto optimizado en la ficha de Google Business.',
            },
            {
              step: 3,
              title: isEn ? 'Deploy On-Site NFC Pocket Review Cards' : 'Activar Protocolo de Reseñas NFC & WhatsApp',
              impact: 'ALTO',
              action: isEn ? 'Target minimum 8 fresh reviews weekly.' : 'Capturar al menos 8 reseñas 5★ por semana para activar el algoritmo de frescura.',
            },
            {
              step: 4,
              title: isEn ? 'Upload Geotagged Photo Batch' : 'Subir Lote de Fotos con Nombres SEO',
              impact: 'MEDIO',
              action: isEn ? 'Publish facade, product, and staff photos.' : 'Cargar las fotos del checklist con nombres de archivo optimizados.',
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
