import { NextResponse } from 'next/server';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

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
  reviewHighlights?: string[];
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
      reviewHighlights = [],
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
    const cleanReviewHighlights = Array.isArray(reviewHighlights) ? reviewHighlights.filter(Boolean) : [];

    const effectiveReviews = mode === 'create' ? 0 : (Number(existingReviews) || 0);
    const targetTop3Reviews = mode === 'create' ? 100 : Math.max(120, effectiveReviews + 80);
    const neededReviews = Math.max(0, targetTop3Reviews - effectiveReviews);
    const reviewsPerWeek = 8;
    const weeksToTop3 = Math.ceil(neededReviews / reviewsPerWeek) || (mode === 'create' ? 13 : 10);

    // -------------------------------------------------------------
    // 1. LIVE GEMINI 3.1 FLASH LITE ENGINE (Maximum Analytics & Low Token Footprint)
    // -------------------------------------------------------------
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const prompt = `You are Prestigia's Elite Google Maps Local SEO & Local 3-Pack Algorithm Architect.
Analyze the business data below with deep vertical rigor and produce a winning technical profile in ${isEn ? 'ENGLISH' : 'SPANISH'}.

DATA INPUTS:
- Mode: ${mode === 'create' ? 'NEW LISTING SETUP' : 'FORENSIC AUDIT & TOP 3 UPGRADE'}
- Business Model: ${isSAB ? 'Service Area Business / Independent Professional (No physical storefront)' : 'Storefront with Physical Address (Walk-in customer location)'}
- Brand Name: "${cleanName}"
- Dropdown Niche: "${category}"
- Exact City & Neighborhood: "${cleanNeighborhood ? cleanNeighborhood + ', ' : ''}${cleanCity}"
- Service Areas (if SAB): "${cleanServiceAreas || cleanCity}"
- Star Specialties & Flagship Services: "${cleanSpecialties || 'High-demand local services'}"
- Commercial WhatsApp/Phone: "${cleanPhone || 'Direct line'}"
- Existing Rating: ${existingRating}★ (${existingReviews} reviews)
${cleanReviewHighlights.length > 0 ? `- Real Customer Feedback Highlights: "${cleanReviewHighlights.join(' | ')}"` : ''}

ANALYTICAL DIRECTIVES:
1. OPERATIONAL ACCURACY: Deduce the EXACT industry from the Niche ("${category}"), Brand ("${cleanName}"), and Specialties ("${cleanSpecialties}"). Never confuse beauty/spa with food, medical with retail, etc.
2. COMMERCIAL DESCRIPTION (STRICT: 620-740 CHARACTERS):
   Craft an engaging, high-converting commercial text. Highlight the atmosphere, signature craft/services in "${cleanSpecialties}", location in ${cleanNeighborhood ? cleanNeighborhood + ', ' : ''}${cleanCity}, and a warm call-to-action with WhatsApp (${cleanPhone}). Grounded, professional, and authentic (no generic spam).
3. CATEGORIES: Primary category must be the precise official Google Maps category. Provide exactly 4-5 strictly relevant secondary categories.
4. OPTIMIZED TITLE: Formula: "${cleanName} | [Primary Specialty/Category] ${isEn ? 'in' : 'en'} ${cleanNeighborhood || cleanCity}".
5. SERVICE CATALOG: 4-6 services directly derived from "${cleanSpecialties}", with commercial name, benefit description, and local search tag.
6. PROTOCOLS & MEDIA: 5 specific photo guidelines tailored to this business, 5 preventive FAQs, and a 60-90s video verification guide tailored to ${isSAB ? 'SAB' : 'storefront'}.
7. POSTS & VELOCITY: 4 weekly Google update posts and a review velocity schedule (target: ${targetTop3Reviews} reviews, ${reviewsPerWeek}/week).
${mode === 'audit' ? `8. AUDIT FORENSICS: Realistic healthScore (45-70), 4 critical profile gaps, Top 3 competitive insights, and a 5-step prioritized action roadmap.` : ''}

RETURN STRICTLY A COMPACT VALID JSON OBJECT (NO MARKDOWN WRAPPERS):
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
  "suggestedServiceAreas": ${isSAB ? '["...", "...", "..."]' : '[]'},
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

        const candidateModels = [
          'gemini-3.1-flash-lite',
          'gemini-3.5-flash-lite',
          'gemini-flash-lite-latest',
          'gemini-3.5-flash',
        ];
        for (const modelName of candidateModels) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 6000);
            const geminiRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                  contents: [{ parts: [{ text: prompt }] }],
                  generationConfig: {
                    temperature: 0.15,
                    maxOutputTokens: 2000,
                    responseMimeType: 'application/json',
                  },
                }),
              }
            );
            clearTimeout(timeoutId);

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
                return NextResponse.json({ success: true, engine: modelName, data: parsed });
              }
            } else {
              const errBody = await geminiRes.text();
              console.warn(`[LocalStudio AI] ${modelName} returned status:`, geminiRes.status, errBody);
            }
          } catch (modelErr) {
            console.warn(`[LocalStudio AI] Error trying model ${modelName}:`, modelErr);
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
      reviewHighlights: cleanReviewHighlights,
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
  const cat = (params.category || '').toLowerCase();
  const spec = (params.specialties || '').toLowerCase();
  const name = (params.businessName || '').toLowerCase();
  const combined = `${cat} ${spec} ${name}`;
  const isEn = params.isEn;

  // PRIORIDAD 1: BELLEZA / SPA / ESTÉTICA / BARBERÍA / PELUQUERÍA
  // (Debe evaluarse ANTES que gastronomía para evitar que "barbería" se confunda con "bar")
  if (
    cat.includes('estética') ||
    cat.includes('estetica') ||
    cat.includes('spa') ||
    cat.includes('belleza') ||
    cat.includes('barber') ||
    cat.includes('beauty') ||
    combined.includes('manicure') ||
    combined.includes('pedicure') ||
    combined.includes('facial') ||
    combined.includes('cejas') ||
    combined.includes('pestañas') ||
    combined.includes('uñas') ||
    combined.includes('masaje') ||
    (combined.includes('barber') && !combined.includes('barbacoa')) ||
    combined.includes('peluquer') ||
    combined.includes('estilista')
  ) {
    if (combined.includes('barber') && !combined.includes('spa') && !combined.includes('estétic')) {
      return {
        primaryCategory: isEn ? 'Barber Shop' : 'Barbería',
        secondaryCategories: isEn
          ? ['Hair Salon', 'Beauty Salon', 'Stylist', 'Skin Care Clinic', 'Cosmetics Store']
          : ['Peluquería', 'Salón de belleza', 'Estilista', 'Cuidado de la piel', 'Tienda de cosméticos'],
      };
    }
    if (combined.includes('spa') || combined.includes('masaje')) {
      return {
        primaryCategory: isEn ? 'Day Spa' : 'Spa',
        secondaryCategories: isEn
          ? ['Beauty Salon', 'Facial Spa', 'Nail Salon', 'Health Spa', 'Massage Therapist']
          : ['Salón de belleza', 'Centro de estética', 'Salón de manicura y pedicura', 'Spa de masajes', 'Cosméticos y cuidado facial'],
      };
    }
    return {
      primaryCategory: isEn ? 'Beauty Salon' : 'Salón de belleza',
      secondaryCategories: isEn
        ? ['Hair Salon', 'Nail Salon', 'Day Spa', 'Esthetician', 'Cosmetics Store']
        : ['Peluquería', 'Salón de manicura', 'Centro de estética', 'Spa y bienestar', 'Estilista'],
    };
  }

  // PRIORIDAD 2: ODONTOLOGÍA
  if (cat.includes('odontol') || cat.includes('dental') || combined.includes('dient') || combined.includes('sonrisa') || combined.includes('ortodoncia') || combined.includes('implante')) {
    return {
      primaryCategory: isEn ? 'Dental Clinic' : 'Clínica dental',
      secondaryCategories: isEn
        ? ['Dentist', 'Orthodontist', 'Emergency Dental Service', 'Cosmetic Dentist', 'Dental Laboratory']
        : ['Dentista', 'Ortodoncista', 'Servicio dental de urgencia', 'Centro odontológico', 'Clínica especializada'],
    };
  }

  // PRIORIDAD 3: SALUD / CLÍNICA MÉDICA
  if (cat.includes('salud') || cat.includes('médic') || cat.includes('medic') || cat.includes('clinic') || cat.includes('consultorio') || combined.includes('doctor')) {
    return {
      primaryCategory: isEn ? 'Medical Clinic' : 'Clínica médica',
      secondaryCategories: isEn
        ? ['Doctor', 'Medical Center', 'Specialized Clinic', 'Health Consultant', 'Family Practice Physician']
        : ['Centro médico', 'Médico especialista', 'Consultorio médico', 'Centro de salud y bienestar', 'Clínica especializada'],
    };
  }

  // PRIORIDAD 4: VETERINARIA / MASCOTAS
  if (cat.includes('veterin') || cat.includes('mascot') || cat.includes('pet') || combined.includes('canin') || combined.includes('felin')) {
    return {
      primaryCategory: isEn ? 'Veterinary Care' : 'Clínica veterinaria',
      secondaryCategories: isEn
        ? ['Veterinarian', 'Pet Groomer', 'Pet Supply Store', 'Animal Hospital', 'Emergency Veterinarian Service']
        : ['Veterinario', 'Peluquería de mascotas', 'Hospital para animales', 'Tienda de artículos para mascotas', 'Urgencias veterinarias'],
    };
  }

  // PRIORIDAD 5: AUTOMOTRIZ / TALLER MECÁNICO
  if (cat.includes('auto') || cat.includes('taller') || cat.includes('mecánic') || cat.includes('mecanic') || cat.includes('lavadero') || combined.includes('frenos') || combined.includes('vehícul')) {
    return {
      primaryCategory: isEn ? 'Auto Repair Shop' : 'Taller mecánico',
      secondaryCategories: isEn
        ? ['Brake Shop', 'Oil Change Service', 'Car Inspection Station', 'Mechanic', 'Auto Electrical Service']
        : ['Taller de automóviles', 'Servicio de cambio de aceite', 'Taller de frenos', 'Mecánico', 'Diagnóstico automotriz'],
    };
  }

  // PRIORIDAD 6: FITNESS / GIMNASIO
  if (cat.includes('fitness') || cat.includes('gimnasio') || cat.includes('gym') || cat.includes('entrenamiento')) {
    return {
      primaryCategory: isEn ? 'Gym' : 'Gimnasio',
      secondaryCategories: isEn
        ? ['Fitness Center', 'Personal Trainer', 'Aerobics Program', 'Yoga Studio', 'Pilates Studio']
        : ['Centro de fitness', 'Entrenador personal', 'Centro deportivo', 'Gimnasio de crossfit', 'Salón de entrenamiento'],
    };
  }

  // PRIORIDAD 7: SERVICIOS PROFESIONALES / LEGAL / B2B
  if (cat.includes('legal') || cat.includes('abog') || cat.includes('contab') || cat.includes('b2b') || combined.includes('juríd')) {
    return {
      primaryCategory: isEn ? 'Law Firm' : 'Bufete de abogados',
      secondaryCategories: isEn
        ? ['Lawyer', 'Legal Services', 'Corporate Office', 'Business Management Consultant', 'Real Estate Attorney']
        : ['Abogado', 'Servicios legales', 'Asesoría jurídica', 'Consultoría legal', 'Abogado laboralista'],
    };
  }

  // PRIORIDAD 8: RETAIL / TIENDA DE MODA / COMERCIO
  if (cat.includes('retail') || cat.includes('tienda') || cat.includes('moda') || cat.includes('comercio') || cat.includes('ropa') || cat.includes('boutique')) {
    return {
      primaryCategory: isEn ? 'Clothing Store' : 'Tienda de ropa',
      secondaryCategories: isEn
        ? ['Boutique', 'Fashion Accessories Store', 'Women\'s Clothing Store', 'Men\'s Clothing Store', 'Shoe Store']
        : ['Boutique', 'Tienda de accesorios de moda', 'Tienda de ropa para mujer', 'Tienda de ropa de hombre', 'Zapatería'],
    };
  }

  // PRIORIDAD 9: GASTRONOMÍA / RESTAURANTES / BARES
  // (Solo si explícitamente es comida, restaurante o bebida, evitando falsos positivos con 'barbería')
  if (
    cat.includes('restauran') ||
    cat.includes('gastro') ||
    cat.includes('cafetería') ||
    cat.includes('cafeteria') ||
    cat.includes('panadería') ||
    cat.includes('panaderia') ||
    combined.includes('restauran') ||
    combined.includes('gastro') ||
    combined.includes('comida') ||
    combined.includes('alimento') ||
    combined.includes('pasta') ||
    combined.includes('pizza') ||
    combined.includes('burger') ||
    combined.includes('hamburgues') ||
    combined.includes('parrilla') ||
    combined.includes('asado') ||
    combined.includes('sushi') ||
    combined.includes('gastrobar') ||
    combined.includes('cervecer') ||
    /\bbar\b/i.test(combined)
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

  // 6. VETERINARIA / MASCOTAS
  if (combined.includes('veterin') || combined.includes('mascot') || combined.includes('pet') || combined.includes('canin') || combined.includes('felin')) {
    return {
      primaryCategory: isEn ? 'Veterinary Care' : 'Clínica veterinaria',
      secondaryCategories: isEn
        ? ['Veterinarian', 'Pet Groomer', 'Pet Supply Store', 'Animal Hospital', 'Emergency Veterinarian Service']
        : ['Veterinario', 'Peluquería de mascotas', 'Hospital para animales', 'Tienda de artículos para mascotas', 'Urgencias veterinarias'],
    };
  }

  // 7. SALÓN DE EVENTOS / RECEPCIONES / BANQUETES
  if (combined.includes('evento') || combined.includes('recepc') || combined.includes('fiesta') || combined.includes('banquet') || combined.includes('boda') || combined.includes('salon')) {
    return {
      primaryCategory: isEn ? 'Event Venue' : 'Salón de eventos',
      secondaryCategories: isEn
        ? ['Banquet Hall', 'Wedding Venue', 'Party Planner', 'Conference Center', 'Catering Food and Drink Supplier']
        : ['Salón para banquetes', 'Lugar para celebrar bodas', 'Centro de conferencias', 'Organizador de eventos', 'Servicio de fiestas'],
    };
  }

  // 8. FITNESS / GIMNASIO / ENTRENAMIENTO
  if (combined.includes('gym') || combined.includes('gimnasio') || combined.includes('fitness') || combined.includes('crossfit') || combined.includes('entren')) {
    return {
      primaryCategory: isEn ? 'Gym' : 'Gimnasio',
      secondaryCategories: isEn
        ? ['Fitness Center', 'Personal Trainer', 'Sports Club', 'Weightloss Service', 'Aerobics Program']
        : ['Centro de fitness', 'Entrenador personal', 'Club deportivo', 'Centro de entrenamiento', 'Gimnasio de crossfit'],
    };
  }

  // 9. RETAIL / TIENDA DE ROPA / BOUTIQUE
  if (combined.includes('tienda') || combined.includes('retail') || combined.includes('moda') || combined.includes('ropa') || combined.includes('boutique') || combined.includes('calzado')) {
    return {
      primaryCategory: isEn ? 'Clothing Store' : 'Tienda de ropa',
      secondaryCategories: isEn
        ? ['Boutique', 'Fashion Accessories Store', 'Women\'s Clothing Store', 'Men\'s Clothing Store', 'Shoe Store']
        : ['Boutique de moda', 'Tienda de accesorios de moda', 'Tienda de ropa de mujer', 'Tienda de ropa de hombre', 'Comercio local'],
    };
  }

  // 10. HOTELERÍA / HOSPEDAJE
  if (combined.includes('hotel') || combined.includes('hospedaj') || combined.includes('hostal') || combined.includes('turismo') || combined.includes('resort')) {
    return {
      primaryCategory: isEn ? 'Hotel' : 'Hotel',
      secondaryCategories: isEn
        ? ['Motel', 'Inn', 'Resort Hotel', 'Extended Stay Hotel', 'Tourist Information Center']
        : ['Hospedaje turístico', 'Hostal', 'Hotel boutique', 'Alojamiento vacacional', 'Servicio de turismo'],
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
        description: isEn ? `Official ${primaryCategory} specialized service.` : `Atención oficial y especializada en ${primaryCategory}.`,
        tag: primaryCategory,
      }
    ];
  }

  const rawItems = specialties
    .split(/[,;/]|s+ys+|s+ands+/i)
    .map(s => s.trim())
    .filter(Boolean);

  if (rawItems.length === 0) {
    return [
      {
        name: primaryCategory,
        description: isEn ? `Official ${primaryCategory} specialized service.` : `Atención oficial y especializada en ${primaryCategory}.`,
        tag: primaryCategory,
      }
    ];
  }

  const catLower = primaryCategory.toLowerCase();
  let verb = isEn ? 'Specialized service in' : 'Servicio especializado en';
  if (catLower.includes('restauran') || catLower.includes('cafe') || catLower.includes('panader') || catLower.includes('pizza') || catLower.includes('asador')) {
    verb = isEn ? 'Preparation and table service of' : 'Elaboración artesanal y servicio de';
  } else if (catLower.includes('dental') || catLower.includes('odont') || catLower.includes('clinic') || catLower.includes('médic')) {
    verb = isEn ? 'Clinical evaluation and procedure for' : 'Evaluación clínica y procedimiento especializado en';
  } else if (catLower.includes('veterin')) {
    verb = isEn ? 'Compassionate animal care and clinical attention for' : 'Atención médica y cuidado compasivo para';
  } else if (catLower.includes('barber') || catLower.includes('peluquer') || catLower.includes('belleza')) {
    verb = isEn ? 'Professional styling and precision grooming for' : 'Estilizado profesional y cuidado personalizado de';
  } else if (catLower.includes('evento') || catLower.includes('recepc')) {
    verb = isEn ? 'Comprehensive coordination and venue setup for' : 'Coordinación logística y montaje exclusivo de';
  } else if (catLower.includes('taller') || catLower.includes('auto') || catLower.includes('mecánic')) {
    verb = isEn ? 'Technical diagnostics, certified maintenance and repair of' : 'Diagnóstico técnico, mantenimiento preventivo y reparación de';
  }

  return rawItems.map(item => {
    const capitalized = item.charAt(0).toUpperCase() + item.slice(1);
    return {
      name: capitalized,
      description: `${verb} ${item.toLowerCase()} ${isEn ? 'with guaranteed quality standards.' : 'con estándares de calidad y atención directa.'}`,
      tag: primaryCategory,
    };
  });
}

function generateNicheCommercialDescription(params: {
  mode: 'create' | 'audit';
  businessName: string;
  primaryCategory: string;
  category: string;
  specialties: string;
  locationTag: string;
  city: string;
  phone: string;
  existingRating: number;
  existingReviews: number;
  reviewHighlights?: string[];
  isEn: boolean;
  isSAB: boolean;
}): string {
  const {
    mode,
    businessName,
    primaryCategory,
    category,
    specialties,
    locationTag,
    city,
    phone,
    existingRating,
    existingReviews,
    reviewHighlights = [],
    isEn,
  } = params;

  const rawSpecialties = specialties.trim() || (isEn ? 'our flagship specialties' : 'nuestras especialidades principales');
  const catCombined = `${primaryCategory} ${category} ${businessName}`.toLowerCase();

  let niche: 'gastro' | 'health' | 'veterinary' | 'beauty' | 'events' | 'automotive' | 'fitness' | 'retail' | 'general' = 'general';

  if (
    catCombined.includes('barber') ||
    catCombined.includes('peluquer') ||
    catCombined.includes('salon') ||
    catCombined.includes('spa') ||
    catCombined.includes('estetic') ||
    catCombined.includes('estética') ||
    catCombined.includes('belleza') ||
    catCombined.includes('uñas') ||
    catCombined.includes('manicure')
  ) {
    niche = 'beauty';
  } else if (
    catCombined.includes('dental') ||
    catCombined.includes('odont') ||
    catCombined.includes('clinic') ||
    catCombined.includes('salud') ||
    catCombined.includes('medic') ||
    catCombined.includes('doctor')
  ) {
    niche = 'health';
  } else if (catCombined.includes('veterin') || catCombined.includes('mascot') || catCombined.includes('pet')) {
    niche = 'veterinary';
  } else if (
    catCombined.includes('restauran') ||
    catCombined.includes('cafe') ||
    catCombined.includes('café') ||
    catCombined.includes('panader') ||
    catCombined.includes('comida') ||
    catCombined.includes('pizza') ||
    catCombined.includes('burger') ||
    catCombined.includes('parrilla') ||
    catCombined.includes('pasta') ||
    catCombined.includes('gastro') ||
    catCombined.includes('gastrobar') ||
    /\bbar\b/i.test(catCombined)
  ) {
    niche = 'gastro';
  } else if (
    catCombined.includes('evento') ||
    catCombined.includes('recepc') ||
    catCombined.includes('fiesta') ||
    catCombined.includes('banquet') ||
    catCombined.includes('boda')
  ) {
    niche = 'events';
  } else if (
    catCombined.includes('auto') ||
    catCombined.includes('taller') ||
    catCombined.includes('mecanic') ||
    catCombined.includes('lavadero') ||
    catCombined.includes('detailing')
  ) {
    niche = 'automotive';
  } else if (catCombined.includes('gym') || catCombined.includes('fitness') || catCombined.includes('entren')) {
    niche = 'fitness';
  } else if (catCombined.includes('tienda') || catCombined.includes('retail') || catCombined.includes('moda') || catCombined.includes('ropa') || catCombined.includes('boutique')) {
    niche = 'retail';
  }

  let desc = '';

  if (mode === 'audit') {
    const reviewNote = reviewHighlights && reviewHighlights.length > 0
      ? reviewHighlights.slice(0, 2).join('. ')
      : (isEn ? 'Clients consistently praise our attentive service and top quality' : 'Nuestros clientes elogian constantemente la calidad de la atención y la experiencia vivida');

    if (isEn) {
      if (niche === 'gastro') {
        desc = `Welcome to ${businessName}, the recognized ${primaryCategory.toLowerCase()} in ${locationTag}. Backed by ${existingReviews} verified reviews and a ${existingRating}★ rating, diners celebrate our exquisite flavor, fresh ingredients, and signature ${rawSpecialties}. Enjoy a warm, welcoming dining ambiance with attentive hospitality, dine-in seating, takeout, and fast delivery across ${city}. ${reviewNote}. We invite you to live an unforgettable gastronomic moment. Contact us directly via WhatsApp at ${phone || 'our customer line'} for table bookings and orders.`;
      } else if (niche === 'health') {
        desc = `${businessName} is a premier ${primaryCategory.toLowerCase()} located in ${locationTag}. With a trusted ${existingRating}★ rating across ${existingReviews} patient reviews, we are commended for our compassionate bedside manner, strict clinical sterilization, and modern diagnostic technology in ${rawSpecialties}. ${reviewNote}. We prioritize patient comfort and personalized healthcare in a serene, professional environment. Book your consultation directly via WhatsApp at ${phone || 'our medical desk'}.`;
      } else if (niche === 'veterinary') {
        desc = `At ${businessName}, our dedicated ${primaryCategory.toLowerCase()} in ${locationTag} is backed by ${existingReviews} positive reviews and a ${existingRating}★ score. Pet families love our gentle animal handling, accurate preventative care, and specialized ${rawSpecialties}. ${reviewNote}. We offer modern facilities designed to keep dogs and cats calm and comfortable. Schedule a consultation or grooming session via WhatsApp at ${phone || 'our veterinary team'}.`;
      } else if (niche === 'beauty') {
        desc = `${businessName} is a distinguished ${primaryCategory.toLowerCase()} in ${locationTag}, rated ${existingRating}★ with ${existingReviews} glowing client reviews. Recognized for precision cuts, customized styling, and master care in ${rawSpecialties}. ${reviewNote}. Relax in our modern, stylish studio with VIP personal attention and premium salon products. Reserve your styling appointment today via WhatsApp at ${phone || 'our reception'}.`;
      } else if (niche === 'events') {
        desc = `Discover ${businessName}, the distinguished ${primaryCategory.toLowerCase()} in ${locationTag}. With ${existingReviews} customer reviews and a ${existingRating}★ rating, clients highlight our spacious layout, elegant lighting, acoustics, and expert coordination for ${rawSpecialties}. ${reviewNote}. We provide complete event logistics with dedicated staff to ensure a seamless celebration. Inquire and reserve your date via WhatsApp at ${phone || 'our event team'}.`;
      } else if (niche === 'automotive') {
        desc = `${businessName} is your dependable ${primaryCategory.toLowerCase()} in ${locationTag}, boasting a ${existingRating}★ rating backed by ${existingReviews} driver reviews. Clients appreciate our honest diagnostic transparency, certified technical mastery, and reliable repair turnarounds in ${rawSpecialties}. ${reviewNote}. State-of-the-art workshop and guaranteed workmanship across ${city}. Message us on WhatsApp at ${phone || 'our service desk'} for quotes and appointments.`;
      } else {
        desc = `${businessName} is a leading ${primaryCategory.toLowerCase()} in ${locationTag}. Supported by ${existingReviews} verified reviews and a ${existingRating}★ rating, clients commend our professionalism, warm customer care, and excellence in ${rawSpecialties}. ${reviewNote}. Experience dedicated service in comfortable, accessible facilities in ${city}. Contact our friendly team directly on WhatsApp at ${phone || 'our office line'}.`;
      }
    } else {
      if (niche === 'gastro') {
        desc = `Bienvenidos a ${businessName}, ${primaryCategory.toLowerCase()} de referencia en ${locationTag}. Respaldados por una calificación de ${existingRating}★ y ${existingReviews} opiniones de comensales que celebran el sabor casero, la frescura de los ingredientes y nuestras especialidades en ${rawSpecialties}. ${reviewNote}. Disfruta de un ambiente cálido, acogedor y familiar, con un servicio atento que te hace sentir como en casa. Ofrecemos servicio en salón, pedidos para llevar y entregas rápidas en ${city}. Te invitamos a vivir una experiencia gastronómica memorable. Escríbenos al WhatsApp ${phone || 'de atención'} para reservas y pedidos.`;
      } else if (niche === 'health') {
        desc = `${businessName} es un centro especializado en ${primaryCategory.toLowerCase()} ubicado en ${locationTag}. Con una valoración destacada de ${existingRating}★ basada en ${existingReviews} testimonios de pacientes que elogian la calidez humana, la ética médica y la precisión en tratamientos de ${rawSpecialties}. ${reviewNote}. Contamos con instalaciones modernas, cómodas y rigurosos protocolos de bioseguridad para brindarte una atención tranquila y sin dolor. Agenda tu valoración médica o dental directamente por WhatsApp al ${phone || 'nuestro número oficial'}.`;
      } else if (niche === 'veterinary') {
        desc = `En ${businessName}, ${primaryCategory.toLowerCase()} en ${locationTag}, cuidamos la salud y felicidad de tus mascotas. Respaldados por ${existingRating}★ y ${existingReviews} opiniones de familias que valoran el amor, la paciencia y el diagnóstico acertado en ${rawSpecialties}. ${reviewNote}. Brindamos instalaciones confortables y libres de estrés para perros y gatos, con atención médica preventiva y estética canina. Agenda tu consulta o servicio veterinario por WhatsApp al ${phone || 'número directo'}.`;
      } else if (niche === 'beauty') {
        desc = `${businessName} es tu ${primaryCategory.toLowerCase()} de confianza en ${locationTag}, calificado con ${existingRating}★ por ${existingReviews} clientes satisfechos que destacan la maestría en cortes, diseño personalizado y cuidado capilar en ${rawSpecialties}. ${reviewNote}. Disfruta de un espacio moderno, relajado y exclusivo, con atención personalizada de primer nivel y productos profesionales de alta gama. Reserva tu cita de estilo hoy mismo vía WhatsApp al ${phone || 'nuestro número de atención'}.`;
      } else if (niche === 'events') {
        desc = `Conoce ${businessName}, ${primaryCategory.toLowerCase()} exclusivo en ${locationTag}. Con una calificación de ${existingRating}★ respaldada por ${existingReviews} opiniones que elogian la amplitud, elegancia, acústica y excelente montaje para ${rawSpecialties}. ${reviewNote}. Ofrecemos asesoría logística integral, iluminación ambiental y personal de servicio dedicado para que tu boda, fiesta o evento corporativo sea inolvidable. Consulta disponibilidad y cotizaciones vía WhatsApp al ${phone || 'nuestro número directo'}.`;
      } else if (niche === 'automotive') {
        desc = `${businessName} es tu ${primaryCategory.toLowerCase()} aliado en ${locationTag}, con una calificación de ${existingRating}★ avalada por ${existingReviews} conductores que valoran la honestidad, el diagnóstico computarizado transparente y el cumplimiento en ${rawSpecialties}. ${reviewNote}. Taller equipado con herramientas de última generación y repuestos garantizados en ${city}. Escríbenos al WhatsApp ${phone || 'de taller'} para agendar tu mantenimiento o diagnóstico.`;
      } else {
        desc = `${businessName} es un establecimiento destacado en ${primaryCategory.toLowerCase()} ubicado en ${locationTag}. Con una calificación de ${existingRating}★ y ${existingReviews} opiniones de clientes que resaltan la seriedad, la calidez en el trato y la excelencia en ${rawSpecialties}. ${reviewNote}. Espacio cómodo, moderno y diseñado para brindarte la mejor experiencia en ${city}. Contáctanos directamente por WhatsApp al ${phone || 'nuestro número oficial'} para más información.`;
      }
    }
  } else {
    if (isEn) {
      if (niche === 'gastro') {
        desc = `Welcome to ${businessName}, your new favorite ${primaryCategory.toLowerCase()} in ${locationTag}. Step into a cozy, vibrant space where welcoming aromas, warm lighting, and charming decor create the perfect setting to relax and connect. We take pride in culinary craftsmanship, preparing fresh, flavorful dishes with authentic recipes, highlighting our signature ${rawSpecialties}. Our friendly waitstaff is dedicated to attentive, genuine hospitality, ensuring every guest feels right at home. We offer dine-in comfort, takeaway, and reliable delivery across ${city}. Message us on WhatsApp at ${phone || 'our line'} for menus and bookings.`;
      } else if (niche === 'health') {
        desc = `Welcome to ${businessName}, a state-of-the-art ${primaryCategory.toLowerCase()} in ${locationTag} designed for your complete well-being. Our clinic offers a peaceful, immaculate atmosphere with modern treatment suites, soothing ambient design, and strict sterilization standards. Our dedicated healthcare specialists provide gentle, empathetic, and personalized clinical care, specialized in ${rawSpecialties}. From the moment you arrive, our team greets you with warmth, respect, and attentive clinical guidance. Schedule your personalized appointment directly via WhatsApp at ${phone || 'our patient desk'}.`;
      } else if (niche === 'veterinary') {
        desc = `Welcome to ${businessName}, a compassionate ${primaryCategory.toLowerCase()} in ${locationTag} dedicated to your beloved pets. Our modern veterinary space is specifically designed to provide a calm, clean, and low-stress environment for dogs and cats. We deliver gentle medical care, comprehensive wellness checkups, and loving grooming, specialized in ${rawSpecialties}. Our veterinary staff treats every pet like family, combining clinical precision with warm, patient communication. Contact us on WhatsApp at ${phone || 'our clinic'} for consultations and vaccinations.`;
      } else if (niche === 'beauty') {
        desc = `Welcome to ${businessName}, the contemporary ${primaryCategory.toLowerCase()} in ${locationTag}. Experience a stylish, relaxing sanctuary with comfortable seating, modern aesthetics, and chill lounge vibes. Our master stylists and barbers specialize in ${rawSpecialties}, blending creative trends with tailored grooming techniques and premium care products. We are passionate about attentive, personalized customer care, taking the time to listen and elevate your personal look. Book your session directly via WhatsApp at ${phone || 'our studio'}.`;
      } else if (niche === 'events') {
        desc = `Welcome to ${businessName}, the premier ${primaryCategory.toLowerCase()} located in ${locationTag}. Our venue offers an expansive, architecturally elegant hall equipped with sophisticated ambient lighting, crystal-clear acoustics, and versatile celebration spaces for ${rawSpecialties}. Our passionate event team delivers attentive, detail-oriented hospitality from initial planning to celebration day, ensuring your guests enjoy an extraordinary experience. Contact our planning coordinator via WhatsApp at ${phone || 'our team'} to tour the venue.`;
      } else if (niche === 'automotive') {
        desc = `Welcome to ${businessName}, a modern, fully-equipped ${primaryCategory.toLowerCase()} in ${locationTag}. Our facility features clean, organized service bays with cutting-edge computerized diagnostic tools for your vehicle. We deliver expert mechanical maintenance and meticulous care, specialized in ${rawSpecialties}. Our certified technicians are committed to transparent advice, honest estimates, and attentive customer service with clear communication every step of the way. Contact us on WhatsApp at ${phone || 'our shop'} to book your vehicle service.`;
      } else {
        desc = `Welcome to ${businessName}, your dedicated ${primaryCategory.toLowerCase()} in ${locationTag}. Our space combines a clean, comfortable, and modern environment with specialized expertise in ${rawSpecialties}. We believe in warm, attentive customer care, listening closely to your needs to provide tailored solutions and dependable quality across ${city}. We look forward to serving you with excellence. Contact our friendly team directly on WhatsApp at ${phone || 'our office line'}.`;
      }
    } else {
      if (niche === 'gastro') {
        desc = `Bienvenidos a ${businessName}, tu nuevo ${primaryCategory.toLowerCase()} en ${locationTag}. Descubre un lugar acogedor y lleno de vida, con una atmósfera encantadora, iluminación cálida y espacios cómodos ideales para compartir momentos inolvidables. Nos apasiona la buena mesa y preparamos cada receta con ingredientes frescos y sabor auténtico, destacando nuestras especialidades en ${rawSpecialties}. Nuestro equipo te brinda una atención cercana, amable y servicial para que disfrutes de principio a fin. Contamos con servicio en mesa, pedidos para llevar y domicilios en ${city}. Escríbenos al WhatsApp ${phone || 'de atención'} para reservar tu mesa.`;
      } else if (niche === 'health') {
        desc = `Bienvenidos a ${businessName}, un moderno centro de ${primaryCategory.toLowerCase()} en ${locationTag} diseñado para tu salud y tranquilidad. Nuestras instalaciones ofrecen un ambiente sereno, impecable y dotado de tecnología de vanguardia con rigurosos estándares de bioseguridad. Nuestro equipo de profesionales brinda una atención médica cercana, delicada y personalizada, especializada en ${rawSpecialties}. Nos enfocamos en escucharte y cuidarte con vocación humana y ética profesional en cada visita. Agenda tu consulta o valoración médica de forma rápida y directa a través de nuestro WhatsApp ${phone || 'oficial'}.`;
      } else if (niche === 'veterinary') {
        desc = `Bienvenidos a ${businessName}, una clínica de ${primaryCategory.toLowerCase()} en ${locationTag} creada pensando en el bienestar de tus mascotas. Contamos con un espacio acogedor, limpio y libre de estrés, diseñado especialmente para la tranquilidad de perros y gatos. Nuestro equipo médico ofrece atención preventiva, diagnósticos certeros y cuidado cariñoso, especializados en ${rawSpecialties}. Amamos a los animales y te brindamos una atención cercana, transparente y llena de empatía. Déjanos cuidar a tu mejor amigo; comunícate directamente por WhatsApp al ${phone || 'nuestro número de atención'}.`;
      } else if (niche === 'beauty') {
        desc = `Bienvenidos a ${businessName}, tu exclusivo ${primaryCategory.toLowerCase()} en ${locationTag}. Disfruta de un ambiente moderno, relajado y sofisticado, diseñado para que desconectes de la rutina mientras cuidamos de tu imagen. Nuestros especialistas dominan las últimas tendencias y técnicas en ${rawSpecialties}, utilizando productos profesionales de máxima calidad. Te ofrecemos una atención personalizada, cercana y detallista, asesorándote para resaltar tu mejor estilo con total comodidad. Reserva tu cita fácilmente escribiéndonos por WhatsApp al ${phone || 'nuestro número de atención'}.`;
      } else if (niche === 'events') {
        desc = `Bienvenidos a ${businessName}, el distinguido ${primaryCategory.toLowerCase()} en ${locationTag}. Te ofrecemos un salón amplio, elegante y versátil, equipado con iluminación ambiental moderna, excelente acústica y espacios acondicionados para celebraciones inolvidables de ${rawSpecialties}. Nuestro equipo de coordinación y servicio te acompaña con total dedicación, amabilidad y atención a cada detalle para que tus invitados vivan una fiesta extraordinaria. Haz realidad tu evento soñado; contáctanos por WhatsApp al ${phone || 'nuestro número oficial'} para conocer las instalaciones.`;
      } else if (niche === 'automotive') {
        desc = `Bienvenidos a ${businessName}, un ${primaryCategory.toLowerCase()} moderno y equipado con tecnología de punta en ${locationTag}. Nuestras instalaciones cuentan con áreas de trabajo limpias y herramientas de diagnóstico computarizado para el cuidado integral de tu vehículo, con especialidad en ${rawSpecialties}. Nuestro equipo técnico se distingue por una atención honesta, transparente y puntual, explicándote cada procedimiento con claridad y garantía. Cuida tu inversión y viaja con total seguridad; escríbenos al WhatsApp ${phone || 'de taller'} para agendar tu servicio.`;
      } else {
        desc = `Bienvenidos a ${businessName}, tu aliado profesional en ${primaryCategory.toLowerCase()} en ${locationTag}. Ponemos a tu disposición un espacio cómodo, moderno y accesible, respaldado por un equipo comprometido con la excelencia y la calidad en ${rawSpecialties}. Creemos en una atención al cliente cercana, ágil y dedicada, orientada a superar tus expectativas en cada requerimiento en ${city}. Estaremos encantados de atenderte; contáctanos directamente a través de WhatsApp al ${phone || 'nuestro número oficial'} para asesorarte.`;
      }
    }
  }

  if (desc.length > 745) {
    desc = desc.substring(0, 740).replace(/\s+\S*$/, '') + '.';
  }

  return desc;
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
  reviewHighlights?: string[];
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
    reviewHighlights = [],
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

  const optimizedTitle = `${businessName} | ${primaryCategory} ${isEn ? 'in' : 'en'} ${locationTag}`;

  // Multi-niche rich commercial description (600-745 chars) honoring place, food/offering, customer care, and reviews
  const commercialDescription = generateNicheCommercialDescription({
    mode,
    businessName,
    primaryCategory,
    category,
    specialties,
    locationTag,
    city,
    phone,
    existingRating,
    existingReviews,
    reviewHighlights,
    isEn,
    isSAB,
  });

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

  const isFoodNiche = taxonomy.primaryCategory.toLowerCase().includes('restauran') || taxonomy.primaryCategory.toLowerCase().includes('cafe') || taxonomy.primaryCategory.toLowerCase().includes('pizza');

  const preventiveFaqs = [
    {
      question: isEn ? `What are the operating hours of ${businessName}?` : `¿Cuáles son los horarios de atención de ${businessName}?`,
      answer: isEn
        ? `Operating hours are kept updated directly on this Google profile. You may also message us on WhatsApp at ${phone || 'our line'} to confirm holiday hours.`
        : `Nuestros horarios se mantienen actualizados directamente en esta ficha de Google. También puedes consultarnos por WhatsApp al ${phone || 'número de atención'} para festivos o citas especiales.`,
    },
    {
      question: isEn ? 'What payment methods do you accept?' : '¿Qué medios de pago reciben?',
      answer: isEn
        ? 'We accept cash, debit and credit cards, and verified local electronic transfers.'
        : 'Recibimos efectivo, tarjetas de débito y crédito, y transferencias electrónicas verificadas.',
    },
    {
      question: isFoodNiche
        ? (isEn ? 'How can I place an order or make a reservation?' : '¿Cómo puedo hacer un pedido o reservar?')
        : (isEn ? 'How can I schedule an appointment or book a service?' : '¿Cómo puedo agendar una cita o reservar un servicio?'),
      answer: isEn
        ? `You can contact us directly via WhatsApp at ${phone || 'our direct line'} for fast booking and immediate assistance.`
        : `Puedes comunicarte directamente por WhatsApp al ${phone || 'nuestro número directo'} para coordinar citas, reservas o pedidos con rapidez.`,
    },
    {
      question: isFoodNiche
        ? (isEn ? 'Do you offer takeaway or delivery options?' : '¿Manejan pedidos para llevar o domicilios?')
        : (isEn ? 'Do you accept walk-ins or is it appointment only?' : '¿Atienden por orden de llegada o con cita previa?'),
      answer: isFoodNiche
        ? (isEn ? `Yes, we handle takeaway orders and local delivery across ${city}. Contact us on WhatsApp to order.` : `Sí, gestionamos pedidos para llevar y entregas a domicilio en ${city}. Escríbenos para solicitar tu pedido.`)
        : (isEn ? `We welcome walk-in visits, but recommend booking via WhatsApp at ${phone || 'our line'} to guarantee immediate priority service.` : `Recibimos visitas directas, pero recomendamos coordinar tu cita previa por WhatsApp al ${phone || 'nuestro número de atención'} para garantizar atención sin demoras.`),
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
    title: isEn ? 'Digital QR & Direct WhatsApp Review Protocol' : 'Protocolo Digital de Reseñas: Enlace Inteligente & QR',
    steps: [
      isEn
        ? 'Present the Prestigia smart QR or digital review link to the satisfied customer upon completing the service.'
        : 'Presenta el código QR digital inteligente de Prestigia o envía el enlace directo al cliente satisfecho al concluir la atención.',
      isEn
        ? 'Ask the customer to scan the QR code to open the Google review screen directly.'
        : 'Pide al cliente que escanee el código QR desde su celular para abrir directamente la pantalla de calificación 5★ en Google.',
      isEn
        ? 'Alternatively, share the direct review link via WhatsApp immediately.'
        : 'O envíale de inmediato el enlace inteligente directo por WhatsApp con un solo clic.',
    ],
    samplePitch: isEn
      ? `"Thank you for choosing ${businessName}! Could you scan this quick QR to leave your review on Google? It helps our local team significantly."`
      : `"¡Gracias por confiar en ${businessName}! ¿Podrías escanear este código QR rápido para dejarnos tu reseña 5★ en Google? Nos ayuda mucho a seguir creciendo."`,
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
              title: isEn ? 'Deploy Smart Digital QR & WhatsApp Review Protocol' : 'Activar Protocolo Digital de Reseñas QR & WhatsApp',
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
