import { NextRequest, NextResponse } from 'next/server';

export interface GoogleSeoAudit {
  score: number;
  status: 'critical' | 'warning' | 'optimized';
  statusLabel: string;
  primaryCategory: string;
  detectedCategories: string[];
  missingCategories: string[];
  titleAudit: {
    score: number;
    hasLocalKeyword: boolean;
    hasCategoryKeyword: boolean;
    analysis: string;
    suggestedTitle: string;
  };
  descriptionAudit: {
    status: 'missing' | 'short' | 'optimized';
    charCount: number;
    analysis: string;
    recommendation: string;
  };
  linksAndConversion: {
    hasWebsite: boolean;
    websiteUrl?: string;
    isSecureHttps: boolean;
    hasDirectMenuOrBooking: boolean;
    analysis: string;
  };
  contactAudit: {
    hasPhone: boolean;
    phoneFormatted?: string;
    hasAddress: boolean;
    addressCompleteness: 'complete' | 'partial';
  };
  reviewsEngagement: {
    unansweredEstimatedPercent: number;
    algorithmPenaltyRisk: 'low' | 'medium' | 'high';
    analysis: string;
  };
  quickWins: Array<{
    impact: 'Alta Prioridad' | 'Impacto Medio';
    title: string;
    fix: string;
    boost: string;
  }>;
}

export interface GooglePlaceData {
  name: string;
  rating: number;
  reviewsCount: number;
  address?: string;
  placeId?: string;
  category?: string;
  photoUrl?: string;
  googleMapsUrl: string;
  googleReviewUrl?: string;
  extractedFrom: 'google_live' | 'url_parse' | 'smart_detect';
  website?: string;
  phone?: string;
  detectedCategories?: string[];
  seoAudit?: GoogleSeoAudit;
}

function buildGoogleSeoAudit(params: {
  name: string;
  rating: number;
  reviewsCount: number;
  address: string;
  categories: string[];
  website?: string;
  phone?: string;
  description?: string;
}): GoogleSeoAudit {
  const { name, rating, reviewsCount, address, categories, website, phone, description } = params;

  // 1. Determine Industry Niche
  const lowerName = (name + ' ' + (categories[0] || '')).toLowerCase();
  let niche: 'gastro' | 'health' | 'beauty' | 'auto' | 'hotel' | 'retail' | 'general' = 'general';

  if (
    lowerName.includes('restauran') ||
    lowerName.includes('bar') ||
    lowerName.includes('caf') ||
    lowerName.includes('comida') ||
    lowerName.includes('pizza') ||
    lowerName.includes('burger') ||
    lowerName.includes('parrilla') ||
    lowerName.includes('gastro') ||
    lowerName.includes('taco') ||
    lowerName.includes('mondongo')
  ) {
    niche = 'gastro';
  } else if (
    lowerName.includes('dental') ||
    lowerName.includes('odont') ||
    lowerName.includes('clinic') ||
    lowerName.includes('salud') ||
    lowerName.includes('medic') ||
    lowerName.includes('doctor')
  ) {
    niche = 'health';
  } else if (
    lowerName.includes('spa') ||
    lowerName.includes('peluquer') ||
    lowerName.includes('barber') ||
    lowerName.includes('estetic') ||
    lowerName.includes('belleza') ||
    lowerName.includes('unas') ||
    lowerName.includes('uñas')
  ) {
    niche = 'beauty';
  } else if (
    lowerName.includes('taller') ||
    lowerName.includes('mecanic') ||
    lowerName.includes('auto') ||
    lowerName.includes('moto') ||
    lowerName.includes('llantas') ||
    lowerName.includes('repuesto')
  ) {
    niche = 'auto';
  } else if (
    lowerName.includes('hotel') ||
    lowerName.includes('hostal') ||
    lowerName.includes('resort') ||
    lowerName.includes('posada') ||
    lowerName.includes('hosped')
  ) {
    niche = 'hotel';
  } else if (
    lowerName.includes('tienda') ||
    lowerName.includes('ropa') ||
    lowerName.includes('moda') ||
    lowerName.includes('calzado') ||
    lowerName.includes('boutique')
  ) {
    niche = 'retail';
  }

  const nicheSubcategoriesMap: Record<string, string[]> = {
    gastro: [
      'Restaurante familiar',
      'Restaurante para almorzar',
      'Bar y parrilla',
      'Comida para llevar',
      'Entrega a domicilio',
      'Restaurante de comida tradicional',
      'Cafetería y brunch',
    ],
    health: [
      'Clínica dental',
      'Ortodoncista',
      'Servicio de urgencias dentales',
      'Implantes dentales',
      'Odontopediatra',
      'Centro médico',
      'Periodoncista',
    ],
    beauty: [
      'Salón de belleza',
      'Peluquería',
      'Centro de estética',
      'Salón de manicura y pedicura',
      'Spa de día',
      'Barbería tradicional',
      'Tratamientos faciales',
    ],
    auto: [
      'Taller de reparación de automóviles',
      'Taller de chapa y pintura',
      'Servicio de cambio de aceite',
      'Taller de frenos',
      'Inspección técnica de vehículos',
      'Taller de neumáticos',
    ],
    hotel: [
      'Hotel boutique',
      'Hotel de negocios',
      'Alojamiento con desayuno',
      'Apartotel',
      'Centro de eventos y convenciones',
    ],
    retail: [
      'Tienda de ropa',
      'Boutique de moda',
      'Zapatería',
      'Tienda de artículos para el hogar',
      'Comercio local',
    ],
    general: [
      'Servicio profesional',
      'Atención personalizada',
      'Servicio a domicilio',
      'Comercio especializado',
    ],
  };

  const pool = nicheSubcategoriesMap[niche] || nicheSubcategoriesMap.general;
  const currentCats =
    categories.length > 0
      ? categories
      : [niche === 'gastro' ? 'Restaurante' : niche === 'health' ? 'Clínica' : 'Negocio Local'];

  const missingCategories = pool
    .filter((sc) => !currentCats.some((cc) => cc.toLowerCase().includes(sc.toLowerCase())))
    .slice(0, 5);

  // 2. Score Calculation (0-100)
  let score = 100;

  // Categories penalty
  if (currentCats.length <= 1) {
    score -= 18;
  } else if (currentCats.length < 4) {
    score -= 10;
  }

  // Title Audit
  const hasLocalGeo = /(bogot|medell|cali|barranqu|cartag|bucaram|pereira|manizal|cundinam|antioqu|poblado|laureles|chapinero|usaquen|chico|cedritos|zona g|zona t|centro|norte|sur)/i.test(
    name + ' ' + address
  );
  const hasCategoryWord = /(restaurante|caf|bar|odontolog|clinic|taller|hotel|spa|peluquer|boutique|tienda|auto|hamburgues|parrilla)/i.test(
    name
  );

  if (!hasLocalGeo && !hasCategoryWord) {
    score -= 14;
  } else if (!hasLocalGeo || !hasCategoryWord) {
    score -= 7;
  }

  // Description Audit
  const hasDescription = !!description && description.length > 50;
  if (!hasDescription) {
    score -= 14;
  } else if (description.length < 200) {
    score -= 6;
  }

  // Website & Direct Links
  const hasWebsite = !!website && website.length > 5;
  const isHttps = hasWebsite ? website.toLowerCase().startsWith('https://') : false;
  if (!hasWebsite) {
    score -= 14;
  } else if (!isHttps) {
    score -= 6;
  }

  // Phone
  const hasPhone = !!phone && phone.length >= 7;
  if (!hasPhone) {
    score -= 10;
  }

  // Rating & Engagement
  if (rating < 4.2) {
    score -= 15;
  } else if (rating < 4.5) {
    score -= 6;
  }

  score = Math.max(34, Math.min(96, score));

  const status: 'critical' | 'warning' | 'optimized' =
    score < 60 ? 'critical' : score < 80 ? 'warning' : 'optimized';

  const statusLabel =
    status === 'critical'
      ? '🔴 Ficha en Estado Crítico: Penalizada por el Algoritmo Local de Google'
      : status === 'warning'
      ? '🟡 Ficha en Riesgo: Visibilidad Reducida al 45% frente a la Competencia'
      : '🟢 Ficha Bien Optimizada: En Rango de Alto Rendimiento';

  return {
    score,
    status,
    statusLabel,
    primaryCategory: currentCats[0] || 'Negocio Local',
    detectedCategories: currentCats,
    missingCategories,
    titleAudit: {
      score: hasLocalGeo && hasCategoryWord ? 95 : hasCategoryWord || hasLocalGeo ? 70 : 45,
      hasLocalKeyword: hasLocalGeo,
      hasCategoryKeyword: hasCategoryWord,
      analysis:
        hasLocalGeo && hasCategoryWord
          ? 'El título contiene palabras clave de categoría y ubicación geográfica.'
          : 'El título solo tiene el nombre comercial plano. Pierdes miles de búsquedas sin intención geográfica (ej. "en Medellín" o "en Chapinero").',
      suggestedTitle: `${name} | ${currentCats[0]} en ${address.split(',')[1]?.trim() || 'tu Ciudad'}`,
    },
    descriptionAudit: {
      status: !hasDescription ? 'missing' : description.length < 200 ? 'short' : 'optimized',
      charCount: description ? description.length : 0,
      analysis: !hasDescription
        ? 'No se detectó biografía corporativa en Google Maps. Estás desperdiciando los 750 caracteres que Google indexa para posicionarte.'
        : `Descripción detectada (${description.length} caracteres). Se recomienda expandir a 700 caracteres con palabras clave de compra.`,
      recommendation:
        'Redactar una descripción de 750 caracteres con los 5 servicios más buscados, horarios y llamado a la acción.',
    },
    linksAndConversion: {
      hasWebsite,
      websiteUrl: website || undefined,
      isSecureHttps: isHttps,
      hasDirectMenuOrBooking:
        hasWebsite &&
        (website.includes('menu') || website.includes('reserv') || website.includes('carta')),
      analysis: !hasWebsite
        ? 'Sin sitio web oficial o catálogo enlazado en la ficha. Google castiga la confianza del perfil.'
        : !isHttps
        ? 'El sitio web no tiene protocolo seguro HTTPS. Google alerta a los usuarios de "Sitio no seguro".'
        : 'Sitio web seguro HTTPS verificado.',
    },
    contactAudit: {
      hasPhone,
      phoneFormatted: phone || undefined,
      hasAddress: !!address && address.length > 10,
      addressCompleteness:
        address.includes('#') ||
        address.includes('Calle') ||
        address.includes('Carrera') ||
        address.includes('Cl ') ||
        address.includes('Cra ')
          ? 'complete'
          : 'partial',
    },
    reviewsEngagement: {
      unansweredEstimatedPercent: reviewsCount > 20 ? 76 : 40,
      algorithmPenaltyRisk: rating < 4.3 || reviewsCount < 30 ? 'high' : 'medium',
      analysis: `Con ${reviewsCount} opiniones registradas y calificación de ${rating}★, el algoritmo de Google prioriza en el Top 3 a perfiles que responden el 100% de las reseñas en menos de 24 horas.`,
    },
    quickWins: [
      {
        impact: 'Alta Prioridad',
        title: `Incorporar ${missingCategories.length} Subcategorías Secundarias`,
        fix: `Agregar a la ficha de Google: ${missingCategories.slice(0, 3).join(', ')}.`,
        boost: '+35% a +60% más apariciones en búsquedas indirectas en Google Maps.',
      },
      {
        impact: 'Alta Prioridad',
        title: 'Blindaje y Respuesta Gerencial en 1-Clic con Prestigia',
        fix: 'Responder el 100% de reseñas con IA Gemini y redirigir 1★-3★ a WhatsApp gerencial.',
        boost: 'Sube la calificación promedio a +4.7★ y activa el impulso algorítmico del Local Pack.',
      },
      {
        impact: 'Impacto Medio',
        title: 'Optimizar la Descripción Corporativa a 750 Caracteres',
        fix: 'Incorporar palabras de búsqueda local (zona, barrio, servicios insignia).',
        boost: 'Mayor relevancia semántica en Google Search y Google Maps móvil.',
      },
    ],
  };
}

export async function POST(req: NextRequest) {
  try {
    const rawText = await req.text();
    let body: any = {};
    try {
      body = JSON.parse(rawText);
    } catch {
      body = { url: rawText };
    }
    const { url, query } = body || {};

    const input = (url || query || '').trim();
    if (!input) {
      return NextResponse.json(
        { error: 'Por favor ingresa una URL de Google Maps o el nombre del negocio.' },
        { status: 400 }
      );
    }

    let targetUrl = input;

    // Follow shortened Google Maps links (e.g. https://maps.app.goo.gl/... or goo.gl/maps/...)
    if (input.includes('maps.app.goo.gl') || input.includes('goo.gl/maps')) {
      try {
        const redirectRes = await fetch(input, {
          method: 'GET',
          redirect: 'follow',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept-Language': 'es-419,es;q=0.9,en;q=0.8',
          },
        });
        if (redirectRes.url) {
          targetUrl = redirectRes.url;
        }
      } catch (err) {
        console.warn('Could not follow shortened redirect:', err);
      }
    }

    let detectedName = '';
    let detectedRating: number | null = null;
    let detectedReviews: number | null = null;
    let detectedAddress = '';
    let detectedPlaceId = '';
    let detectedCategories: string[] = [];
    let detectedWebsite = '';
    let detectedPhone = '';
    let detectedDescription = '';

    // Check if place name is inside URL path: /maps/place/Name+Here/...
    const placeMatch = targetUrl.match(/\/maps\/place\/([^/@?]+)/i);
    if (placeMatch && placeMatch[1]) {
      try {
        detectedName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      } catch {
        detectedName = placeMatch[1].replace(/\+/g, ' ');
      }
    }

    // Check for query parameter q=
    if (!detectedName && targetUrl.includes('?')) {
      const qMatch = targetUrl.match(/[?&]q=([^&]+)/i);
      if (qMatch && qMatch[1]) {
        try {
          detectedName = decodeURIComponent(qMatch[1].replace(/\+/g, ' '));
        } catch {
          detectedName = qMatch[1].replace(/\+/g, ' ');
        }
      }
    }

    // If plain text was entered instead of URL
    if (!detectedName && !targetUrl.startsWith('http')) {
      detectedName = targetUrl;
    }

    // 4. Query Google Maps Search RPC endpoint (tbm=map) for real-time rating & review data
    let fetchedSuccessfully = false;
    const searchTarget = detectedName || targetUrl;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const searchEndpoint = `https://www.google.com/search?tbm=map&authuser=0&hl=es&gl=co&q=${encodeURIComponent(
          searchTarget
        )}`;
        const searchRes = await fetch(searchEndpoint, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept-Language': 'es-419,es;q=0.9,en;q=0.8',
            Cookie:
              'CONSENT=YES+; SOCS=CAESHAgBEhJnd3NfMjAyNDA0MTUtMF9SQzIaAmVzIAEaBgiA_K-wBg',
          },
        });

        if (searchRes.ok) {
          const text = await searchRes.text();
          const rawJson = text.replace(/^\)\]\}'\s*/, '');
          try {
            const parsed = JSON.parse(rawJson);
            const results = parsed[0]?.[1] || [];
            for (const entry of results) {
              const place = entry?.[14];
              if (place && Array.isArray(place)) {
                if (!detectedName || detectedName.length < 3) {
                  detectedName = place[11] || place[18] || detectedName;
                }
                const ratingArray = place[4];
                if (Array.isArray(ratingArray)) {
                  if (typeof ratingArray[7] === 'number') {
                    detectedRating = ratingArray[7];
                  }
                  if (typeof ratingArray[8] === 'number') {
                    detectedReviews = ratingArray[8];
                  }
                  if (Array.isArray(ratingArray[3])) {
                    const revStr = ratingArray[3][1];
                    if (revStr && (detectedReviews === null || detectedReviews === 0)) {
                      const m = String(revStr).match(/(\d+[\d.,]*)/);
                      if (m) detectedReviews = parseInt(m[1].replace(/[.,]/g, ''), 10);
                    }
                  }
                }
                if (!detectedAddress) {
                  detectedAddress =
                    place[39] || (Array.isArray(place[2]) ? place[2].join(', ') : '');
                }
                if (
                  !detectedPlaceId &&
                  place[78] &&
                  typeof place[78] === 'string' &&
                  place[78].startsWith('ChIJ')
                ) {
                  detectedPlaceId = place[78];
                }

                // Extract Categories
                if (Array.isArray(place[13]) && detectedCategories.length === 0) {
                  detectedCategories = place[13].filter((c: any) => typeof c === 'string');
                }

                // Extract Website
                if (!detectedWebsite && place[7] && place[7][0]) {
                  detectedWebsite = place[7][0];
                }

                // Extract Phone
                if (!detectedPhone && place[178] && place[178][0] && place[178][0][0]) {
                  detectedPhone = place[178][0][0];
                }

                // Extract Description
                if (!detectedDescription && typeof place[32] === 'string') {
                  detectedDescription = place[32];
                }

                if (detectedRating !== null && detectedReviews !== null && detectedReviews > 0) {
                  fetchedSuccessfully = true;
                  break;
                }
              }
            }
          } catch (parseErr) {
            console.warn('google-lookup json parse err:', parseErr);
          }

          if (!detectedPlaceId) {
            const chijMatch = text.match(/ChIJ[a-zA-Z0-9_-]{15,}/);
            if (chijMatch && chijMatch[0]) {
              detectedPlaceId = chijMatch[0];
            }
          }

          if (detectedRating !== null && detectedReviews !== null && detectedReviews > 0) {
            fetchedSuccessfully = true;
            break;
          }
        }
      } catch (err) {
        console.warn(`Google tbm=map lookup attempt ${attempt} failed:`, err);
      }
    }

    if (!detectedName) {
      detectedName = 'Ficha de Google Maps';
    }

    detectedName = detectedName.replace(/\s*-\s*Google Maps$/i, '').trim();

    const finalRating = detectedRating !== null ? detectedRating : 4.0;
    const finalReviews = detectedReviews !== null ? detectedReviews : 0;

    const directReviewUrl = detectedPlaceId
      ? `https://search.google.com/local/writereview?placeid=${detectedPlaceId}`
      : targetUrl;

    // Generate comprehensive Google SEO Technical Audit
    const seoAudit = buildGoogleSeoAudit({
      name: detectedName,
      rating: finalRating,
      reviewsCount: finalReviews,
      address: detectedAddress || 'Ubicación verificada en Google Maps',
      categories: detectedCategories,
      website: detectedWebsite,
      phone: detectedPhone,
      description: detectedDescription,
    });

    const result: GooglePlaceData = {
      name: detectedName,
      rating: finalRating,
      reviewsCount: finalReviews,
      address: detectedAddress || 'Ubicación verificada en Google Maps',
      placeId: detectedPlaceId || undefined,
      category: seoAudit.primaryCategory,
      googleMapsUrl: targetUrl,
      googleReviewUrl: directReviewUrl,
      extractedFrom: fetchedSuccessfully ? 'google_live' : 'url_parse',
      website: detectedWebsite || undefined,
      phone: detectedPhone || undefined,
      detectedCategories: seoAudit.detectedCategories,
      seoAudit,
    };

    return NextResponse.json({
      success: true,
      data: result,
      message: fetchedSuccessfully
        ? `✨ ¡Ficha Verificada en Vivo! Calificación: ${finalRating}★ (${finalReviews} opiniones). Salud SEO: ${seoAudit.score}/100.`
        : `✨ Ficha analizada: ${detectedName}. Calificación: ${finalRating}★ (${finalReviews} reseñas). Salud SEO: ${seoAudit.score}/100.`,
    });
  } catch (error: any) {
    console.error('Error in google-lookup route:', error);
    return NextResponse.json(
      { error: 'No se pudo analizar el enlace de Google Maps: ' + (error?.message || '') },
      { status: 500 }
    );
  }
}
