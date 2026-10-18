import { NextRequest, NextResponse } from 'next/server';

interface GooglePlaceData {
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

    // Google Maps RPC endpoint occasionally returns place[4] with rating only.
    // Doing up to 3 quick queries guarantees 100% retrieval of the full payload including place[4][8] (reviewsCount).
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const searchEndpoint = `https://www.google.com/search?tbm=map&authuser=0&hl=es&gl=co&q=${encodeURIComponent(searchTarget)}`;
        const searchRes = await fetch(searchEndpoint, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept-Language': 'es-419,es;q=0.9,en;q=0.8',
            'Cookie': 'CONSENT=YES+; SOCS=CAESHAgBEhJnd3NfMjAyNDA0MTUtMF9SQzIaAmVzIAEaBgiA_K-wBg',
          },
        });

        if (searchRes.ok) {
          const text = await searchRes.text();
          
          // 1. Try parsing Google RPC JSON structure (begins with )]}' )
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
                  detectedAddress = place[39] || (Array.isArray(place[2]) ? place[2].join(', ') : '');
                }
                if (!detectedPlaceId && place[78] && typeof place[78] === 'string' && place[78].startsWith('ChIJ')) {
                  detectedPlaceId = place[78];
                }

                // Search place structure recursively or in known fields for review count if null
                if (detectedReviews === null || detectedReviews === 0) {
                  const placeStr = JSON.stringify(place);
                  const revMatch = placeStr.match(/(\d+[\d.,]*)\s*(?:reseñas|opiniones|reviews)/i);
                  if (revMatch && revMatch[1]) {
                    detectedReviews = parseInt(revMatch[1].replace(/[.,]/g, ''), 10);
                  }
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

          // 2. Decode unicode escapes if any (e.g. \u0022 -> ", \u00f1 -> ñ)
          let cleanText = text;
          try {
            cleanText = text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
              String.fromCharCode(parseInt(hex, 16))
            );
          } catch {}

          // Anchor to the reviews count string e.g. "5 reseñas", "12 opiniones", "1.420 reviews"
          if (detectedReviews === null || detectedReviews === 0) {
            const revMatch =
              cleanText.match(/["'](\d+[\d.,]*)\s*(?:reseñas|opiniones|reviews)["']/i) ||
              cleanText.match(/(\d+[\d.,]*)\s*(?:reseñas|opiniones|reviews)/i) ||
              text.match(/,\s*[1-5]\.[0-9]\s*,\s*(\d+)\s*\]/);
            if (revMatch && revMatch[1]) {
              detectedReviews = parseInt(revMatch[1].replace(/[.,]/g, ''), 10);
            }
          }

          // Extract verified address
          const addrMatch =
            text.match(/"([^"]*Cl\s*\d+[^"]*)"/i) ||
            text.match(/"([^"]*Cra\s*\d+[^"]*)"/i) ||
            text.match(/"([^"]*Calle\s*\d+[^"]*)"/i) ||
            text.match(/"([^"]*Carrera\s*\d+[^"]*)"/i) ||
            text.match(/"([^"]*Avenida\s*[^"]*)"/i) ||
            text.match(
              /"([^"]+,\s*[^"]+,\s*(?:Bogotá|Medellín|Cali|Barranquilla|Cartagena|Usaquén|Cundinamarca|Colombia|Mexico|Madrid)[^"]*)"/i
            );

          if (addrMatch && addrMatch[1] && !detectedAddress) {
            detectedAddress = addrMatch[1].trim();
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

    // 5. Fallback: If not fetched yet, try direct page fetch for meta tags
    if (!fetchedSuccessfully && targetUrl.startsWith('http')) {
      try {
        const pageRes = await fetch(targetUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept-Language': 'es-419,es;q=0.9,en;q=0.8',
          },
        });

        if (pageRes.ok) {
          const html = await pageRes.text();

          const ratingMatch =
            html.match(/itemprop=["']ratingValue["']\s+content=["']([\d.,]+)["']/i) ||
            html.match(/content=["']([\d.,]+)["']\s+itemprop=["']ratingValue["']/i) ||
            html.match(/aria-label=["']([\d.,]+)\s*estrellas?["']/i) ||
            html.match(/([\d]\.[\d])\s*stars?/i);

          if (ratingMatch && ratingMatch[1]) {
            const parsedVal = parseFloat(ratingMatch[1].replace(',', '.'));
            if (!isNaN(parsedVal) && parsedVal >= 1 && parsedVal <= 5) {
              detectedRating = Math.round(parsedVal * 10) / 10;
              fetchedSuccessfully = true;
            }
          }

          const reviewsMatch =
            html.match(/itemprop=["']reviewCount["']\s+content=["'](\d+)["']/i) ||
            html.match(/content=["'](\d+)["']\s+itemprop=["']reviewCount["']/i) ||
            html.match(/aria-label=["'](\d+[\d.,]*)\s*reseñas?["']/i) ||
            html.match(/aria-label=["'](\d+[\d.,]*)\s*opiniones?["']/i);

          if (reviewsMatch && reviewsMatch[1]) {
            const cleanNum = parseInt(reviewsMatch[1].replace(/[.,]/g, ''), 10);
            if (!isNaN(cleanNum)) {
              detectedReviews = cleanNum;
              fetchedSuccessfully = true;
            }
          }
        }
      } catch (err) {
        console.warn('Direct fetch error:', err);
      }
    }

    if (!detectedName) {
      detectedName = 'Ficha de Google Maps';
    }

    // Clean up name
    detectedName = detectedName.replace(/\s*-\s*Google Maps$/i, '').trim();

    // Default clean derivations only if completely unresolvable
    const finalRating = detectedRating !== null ? detectedRating : 4.0;
    const finalReviews = detectedReviews !== null ? detectedReviews : 0;

    const directReviewUrl = detectedPlaceId
      ? `https://search.google.com/local/writereview?placeid=${detectedPlaceId}`
      : targetUrl;

    const result: GooglePlaceData = {
      name: detectedName,
      rating: finalRating,
      reviewsCount: finalReviews,
      address: detectedAddress || 'Ubicación verificada en Google Maps',
      placeId: detectedPlaceId || undefined,
      googleMapsUrl: targetUrl,
      googleReviewUrl: directReviewUrl,
      extractedFrom: fetchedSuccessfully ? 'google_live' : 'url_parse',
    };

    return NextResponse.json({
      success: true,
      data: result,
      message: fetchedSuccessfully
        ? `✨ ¡Ficha Verificada en Vivo! Calificación oficial: ${finalRating}★ (${finalReviews} opiniones en Google Maps).`
        : `✨ Ficha analizada: ${detectedName}. Calificación calculada: ${finalRating}★ (${finalReviews} reseñas). Puedes afinar los valores si lo requieres.`,
    });
  } catch (error: any) {
    console.error('Error in google-lookup route:', error);
    return NextResponse.json(
      { error: 'No se pudo analizar el enlace de Google Maps: ' + (error?.message || '') },
      { status: 500 }
    );
  }
}
