import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessName, authorName, rating, reviewText, plan, tone, businessPhone, branchPhone } = body;

    // Gating check: Feature for Pro, Elite and Empresarial Plans
    if (plan !== 'pro' && plan !== 'elite' && plan !== 'empresarial') {
      return NextResponse.json(
        {
          error: 'Función exclusiva de Plan Pro, Élite y Empresarial',
          upsell: true,
          message: 'Actualiza tu cuenta a Plan Pro, Élite o Empresarial para desbloquear respuestas automáticas con Inteligencia Artificial.',
        },
        { status: 403 }
      );
    }

    const cleanAuthor = (authorName || 'estimado cliente').trim();
    const cleanBusiness = (businessName || 'nuestro equipo').trim();
    const cleanPhone = (branchPhone || businessPhone || '').trim();
    const cleanText = (reviewText || '').trim();
    const numRating = Number(rating) || 5;

    const userLang = body.lang || (/[a-zA-Z]{4,}/.test(cleanText) && !/[áéíóúñ¿¡]/i.test(cleanText) && /\b(the|was|and|very|good|food|service|place|great|bad|terrible|awesome|staff)\b/i.test(cleanText) ? 'en' : 'es');

    // =========================================================================
    // 1. LIVE GOOGLE GEMINI 1.5 FLASH ENGINE (When GEMINI_API_KEY is configured)
    // =========================================================================
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const isPositive = numRating >= 4;
        const phoneInstruction = cleanPhone
          ? `Si la calificación es de 1 a 3 estrellas, incluye sutilmente la línea directa de atención de "${cleanBusiness}": WhatsApp o teléfono ${cleanPhone}. IMPORTANTE: Usa ÚNICAMENTE este número oficial del negocio cliente, NUNCA inventes números ni uses teléfonos de terceros.`
          : `Si la calificación es de 1 a 3 estrellas, invita al cliente a contactar a la línea directa de gerencia de "${cleanBusiness}".`;

        const systemPrompt = `Eres el Gerente de Experiencia y Atención al Cliente de "${cleanBusiness}". Tu objetivo es redactar respuestas de Google Maps impecables, ultra humanas y persuasivas para cualquier tipo de negocio o servicio local (clínicas, estética, gastronomía, hotelería, comercio, talleres, servicios profesionales).

DETALLES DE LA RESEÑA:
- Cliente: ${cleanAuthor}
- Calificación: ${numRating} de 5 estrellas
- Comentario: "${cleanText || (isPositive ? 'Calificación positiva sin texto adicional' : 'Calificación con inconformidad')}"
- Idioma de respuesta: ${userLang === 'en' ? 'Inglés' : 'Español'} (o el idioma del cliente si usó otro)
- Teléfono oficial del negocio: ${cleanPhone || 'Línea gerencial del establecimiento'}

REGLAS CRÍTICAS DE REDACCIÓN (OBLIGATORIAS):
1. LONGITUD CORTA Y PUNCHY: Exactamente 2 a 3 frases (entre 30 y 45 palabras en total). NUNCA escribas párrafos largos. La gente lee en celulares.
2. Si el cliente mencionó un producto, tratamiento, servicio específico, profesional/personal que lo atendió, tiempos de atención o instalaciones, menciónalo de forma específica y natural.
3. Cero lenguaje robótico o legalista. Suena como un anfitrión cálido, profesional y agradecido.
4. Para 1 a 3 estrellas: empatía inmediata, sin excusas ni culpas, demostrando que gerencia ya está revisando el caso internamente para brindar una solución o compensación de cortesía. ${phoneInstruction}
5. Para 4 y 5 estrellas: celebra su visita o cita, agradece con calidez e invita a regresar.

Responde ÚNICAMENTE un arreglo JSON con exactamente 3 opciones:
[
  {
    "tone": "${userLang === 'en' ? 'Warm & Engaging' : 'Cálido y Cercano'}",
    "rationale": "${userLang === 'en' ? 'Authentic connection and specific gratitude' : 'Conexión humana y agradecimiento por su visita'}",
    "text": "..."
  },
  {
    "tone": "${userLang === 'en' ? 'Professional & Distinguished' : 'Profesional y Distinguido'}",
    "rationale": "${userLang === 'en' ? 'Elegance and leadership' : 'Elegancia y compromiso con la excelencia'}",
    "text": "..."
  },
  {
    "tone": "${userLang === 'en' ? 'Promotional & Loyalty' : 'Promocional y Fidelización'}",
    "rationale": "${userLang === 'en' ? 'Invites them back to try new specials' : 'Invita a probar novedades en su próximo regreso'}",
    "text": "..."
  }
]`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: systemPrompt }] }],
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
        console.warn('Google Gemini API live call fallback:', geminiErr);
      }
    }

    // =========================================================================
    // 2. ULTRA-PUNCHY HIGH-CONVERTING LOCAL FALLBACK ENGINE
    // =========================================================================
    let options: { tone: string; text: string; rationale: string }[] = [];

    if (userLang === 'en') {
      const enGreetings = [
        `Hi ${cleanAuthor}!`,
        `Thank you so much, ${cleanAuthor}!`,
        `Hello ${cleanAuthor}, warm regards from ${cleanBusiness}!`,
      ];
      const pickEnGreeting = enGreetings[Math.floor(Math.random() * enGreetings.length)];

      if (numRating >= 4) {
        options = [
          {
            tone: 'Warm & Engaging',
            rationale: 'Builds authentic human connection and expresses sincere gratitude for their visit.',
            text: `${pickEnGreeting} We are thrilled that you had such a wonderful time with us at ${cleanBusiness}. It was our absolute pleasure to serve you, and we cannot wait to welcome you back soon!`,
          },
          {
            tone: 'Professional & Distinguished',
            rationale: 'Projects elegance, excellence, and hospitality leadership.',
            text: `Dear ${cleanAuthor}, everyone at ${cleanBusiness} is honored by your ${numRating}-star rating. Delivering outstanding quality is our daily passion. We sincerely appreciate your trust and look forward to your next visit.`,
          },
          {
            tone: 'Promotional & Loyalty',
            rationale: 'Capitalizes on customer delight to invite them back for seasonal specials and new offerings.',
            text: `Awesome, ${cleanAuthor}! Thank you for your 5-star review at ${cleanBusiness}. Be sure to ask our team about our newest house specials next time you stop by. See you again very soon!`,
          },
        ];
      } else {
        options = [
          {
            tone: 'Empathetic & Conciliatory',
            rationale: 'Validates their grievance and shows genuine dedication to service recovery.',
            text: `Hi ${cleanAuthor}, we are deeply sorry that your experience fell short of our standard at ${cleanBusiness}. Your feedback is already being reviewed with our team to resolve it right away. We would love the chance to welcome you back and make this right.`,
          },
          {
            tone: 'Formal & Accountable',
            rationale: 'Maintains composure with corporate seriousness and operational rigor.',
            text: `Dear ${cleanAuthor}, we take your review very seriously. Quality and hospitality are non-negotiable for ${cleanBusiness}, and management is already implementing corrective steps. Thank you for your honest feedback—it helps us get better every single day.`,
          },
          {
            tone: 'Direct Resolution & Commitment',
            rationale: 'Focuses on immediate corrective action and customer recovery.',
            text: `Hello ${cleanAuthor}, thank you for bringing this to our attention. What you experienced does not represent our usual standard at ${cleanBusiness}. We have addressed this directly with our staff, and we hope to regain your trust on your next visit.`,
          },
        ];
      }
    } else {
      const greetings = [
        `¡Hola ${cleanAuthor}!`,
        `¡Muchas gracias por visitarnos, ${cleanAuthor}!`,
        `Hola ${cleanAuthor}, un saludo muy especial del equipo de ${cleanBusiness}.`,
      ];
      const pickRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

      if (numRating >= 4) {
        options = [
          {
            tone: 'Cálido y Cercano',
            rationale: 'Genera conexión humana y agradecimiento sincero por su visita.',
            text: `${pickRandom(greetings)} Nos alegra el corazón saber que tu experiencia fue excelente. Trabajamos con pasión todos los días para crear momentos memorables. ¡Será un inmenso placer recibirte de nuevo en ${cleanBusiness}!`,
          },
          {
            tone: 'Profesional y Distinguido',
            rationale: 'Ideal para proyectar pulcritud, excelencia y liderazgo.',
            text: `Estimado/a ${cleanAuthor}, en ${cleanBusiness} nos honra profundamente su calificación de ${numRating} estrellas. Mantener los más altos estándares de calidad y servicio es nuestro compromiso inquebrantable. Quedamos a su entera disposición en su próxima visita.`,
          },
          {
            tone: 'Promocional y Fidelización',
            rationale: 'Aprovecha la satisfacción para invitar a probar novedades o especialidades.',
            text: `¡Qué gran alegría, ${cleanAuthor}! Muchas gracias por tus 5 estrellas en ${cleanBusiness}. Te esperamos pronto para que sigas disfrutando nuestras novedades y creaciones de temporada. ¡Hasta muy pronto!`,
          },
        ];
      } else {
        options = [
          {
            tone: 'Empático y Conciliador',
            rationale: 'Valida la molestia del cliente y demuestra voluntad genuina de resolver.',
            text: `Hola ${cleanAuthor}, lamentamos de corazón que tu visita no haya sido impecable. En ${cleanBusiness} tu opinión es clave y ya revisamos lo ocurrido con nuestro equipo de sala para solucionarlo de raíz. Nos encantaría tener la oportunidad de recibirte de nuevo y brindarte la experiencia que mereces.`,
          },
          {
            tone: 'Formal e Institucional',
            rationale: 'Maneja la situación con calma y seriedad corporativa.',
            text: `Estimado/a ${cleanAuthor}, recibimos sus comentarios con la mayor seriedad. En ${cleanBusiness} la excelencia en el servicio es prioridad absoluta y la gerencia ya está aplicando los correctivos necesarios. Agradecemos su honestidad para seguir perfeccionando nuestros procesos.`,
          },
          {
            tone: 'Solución y Compromiso',
            rationale: 'Enfocado en acción correctiva inmediata.',
            text: `Hola ${cleanAuthor}, gracias por hacernos saber lo sucedido. Situaciones como esta no representan nuestro estándar en ${cleanBusiness}. Ya transmitimos tus observaciones al turno correspondiente para que no se repita. Esperamos tener el honor de atenderte nuevamente y demostrarte nuestra verdadera hospitalidad.`,
          },
        ];
      }
    }

    return NextResponse.json({
      success: true,
      options,
      provider: 'Prestigia AI Anti-Spam Engine (Optimized)',
    });
  } catch (error) {
    console.error('Error generating AI reply:', error);
    return NextResponse.json(
      { error: 'Error al generar la respuesta con Inteligencia Artificial' },
      { status: 500 }
    );
  }
}
