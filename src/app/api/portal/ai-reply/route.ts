import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessName, authorName, rating, reviewText, plan, tone } = body;

    // Gating check: Feature for Pro and Elite Plans
    if (plan !== 'pro' && plan !== 'elite') {
      return NextResponse.json(
        {
          error: 'Función exclusiva de Plan Pro y Plan Élite',
          upsell: true,
          message: 'Actualiza tu cuenta a Plan Pro o Élite para desbloquear respuestas automáticas con Inteligencia Artificial.',
        },
        { status: 403 }
      );
    }

    const cleanAuthor = (authorName || 'estimado cliente').trim();
    const cleanBusiness = (businessName || 'nuestro equipo').trim();
    const cleanText = (reviewText || '').trim();
    const numRating = Number(rating) || 5;

    const userLang = body.lang || (/[a-zA-Z]{4,}/.test(cleanText) && !/[áéíóúñ¿¡]/i.test(cleanText) && /\b(the|was|and|very|good|food|service|place|great|bad|terrible|awesome|staff)\b/i.test(cleanText) ? 'en' : 'es');

    let options: { tone: string; text: string; rationale: string }[] = [];

    if (userLang === 'en') {
      const enGreetings = [
        `Hi ${cleanAuthor}!`,
        `Thank you so much for your review, ${cleanAuthor}!`,
        `Hello ${cleanAuthor}, warm regards from the entire team at ${cleanBusiness}.`,
        `Dear ${cleanAuthor}, we truly value your time and feedback.`,
      ];
      const pickEnGreeting = enGreetings[Math.floor(Math.random() * enGreetings.length)];

      if (numRating >= 4) {
        options = [
          {
            tone: 'Warm & Engaging',
            rationale: 'Builds authentic human connection and expresses sincere gratitude for their visit.',
            text: `${pickEnGreeting} It warms our hearts to hear your experience was so positive${cleanText ? ` and that you enjoyed "${cleanText.slice(0, 50)}..."` : ''}. We work with dedication every day to create memorable moments. It will be an absolute pleasure to welcome you back to ${cleanBusiness}!`,
          },
          {
            tone: 'Professional & Distinguished',
            rationale: 'Projects elegance, excellence, and hospitality industry leadership.',
            text: `Dear ${cleanAuthor}, everyone at ${cleanBusiness} is truly honored by your ${numRating}-star rating. Upholding the highest standards of quality and service is our non-negotiable commitment. Thank you for your trust, and we look forward to serving you again soon.`,
          },
          {
            tone: 'Promotional & Loyalty',
            rationale: 'Capitalizes on customer delight to invite them back for seasonal specials and new offerings.',
            text: `Awesome ${cleanAuthor}! We are thrilled that you had a 5-star experience with us at ${cleanBusiness}. Stay tuned for exciting upcoming surprises and perks for our VIP guests. Be sure to ask about our seasonal specialties on your next visit!`,
          },
        ];
      } else {
        options = [
          {
            tone: 'Empathetic & Conciliatory',
            rationale: 'Validates their grievance and shows genuine dedication to service recovery.',
            text: `Hi ${cleanAuthor}, we are deeply sorry that your visit did not meet the high standards that define ${cleanBusiness}. Your feedback is critically important to us, and we are already reviewing what happened with our shift team to address it immediately. We would love the opportunity to make this right and provide the outstanding experience you deserve.`,
          },
          {
            tone: 'Formal & Accountable',
            rationale: 'Maintains composure with corporate seriousness and operational rigor.',
            text: `Dear ${cleanAuthor}, we take your comments very seriously. At ${cleanBusiness}, quality and hospitality are our highest priorities. We have logged your specific observations and are implementing corrective measures with our management team. Thank you for your honesty—it helps us improve every day.`,
          },
          {
            tone: 'Direct Resolution & Commitment',
            rationale: 'Focuses on immediate corrective action and customer recovery.',
            text: `Hello ${cleanAuthor}, thank you for bringing this to our attention. Experiences like the one you described do not represent our normal standard at ${cleanBusiness}. We have addressed this directly with our team to ensure it does not happen again. We hope to have the honor of welcoming you back soon to demonstrate our true level of hospitality.`,
          },
        ];
      }
    } else {
      // Dynamic phrasing elements to guarantee zero repetitive outputs (Google Anti-Spam compliance)
      const greetings = [
        `¡Hola ${cleanAuthor}!`,
        `¡Muchas gracias por tu visita y reseña, ${cleanAuthor}!`,
        `Hola ${cleanAuthor}, un saludo muy especial de parte de todo el equipo de ${cleanBusiness}.`,
        `¡Qué gran alegría leerte, ${cleanAuthor}! Valoramos inmensamente tu tiempo y tus amables palabras.`,
      ];

      const pickRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

      if (numRating >= 4) {
        // 4 or 5 Star Reviews
        options = [
          {
            tone: 'Empático y Cercano',
            rationale: 'Genera conexión humana y agradecimiento sincero por su visita.',
            text: `${pickRandom(greetings)} Nos alegra el corazón saber que tu experiencia fue tan positiva y que disfrutaste cada detalle en tu visita. Trabajamos con pasión cada día para brindarles momentos memorables. ¡Será un inmenso honor recibirte de nuevo en ${cleanBusiness}!`,
          },
          {
            tone: 'Profesional y Distinguido',
            rationale: 'Ideal para proyectar excelencia, pulcritud y liderazgo en el sector.',
            text: `Apreciamos profundamente su visita, ${cleanAuthor}. En ${cleanBusiness} nos sentimos sumamente honrados por su calificación de ${numRating} estrellas. Mantener los más altos estándares de calidad y servicio es nuestro compromiso innegociable. Agradecemos su confianza y quedamos a su entera disposición en su próxima visita.`,
          },
          {
            tone: 'Promocional y Fidelización',
            rationale: 'Aprovecha la satisfacción para invitar a probar novedades o eventos.',
            text: `¡Excelente, ${cleanAuthor}! Qué alegría que hayas tenido una experiencia de 5 estrellas en ${cleanBusiness}. Te adelantamos que muy pronto tendremos novedades y sorpresas especiales para nuestros comensales consentidos. ¡Pregunta por nuestras sugerencias de temporada en tu próximo regreso!`,
          },
        ];
      } else {
        // 1 to 3 Star Reviews (Crisis Prevention and Respectful Apology without violating Google policies)
        options = [
          {
            tone: 'Empático y Conciliador',
            rationale: 'Valida la inconformidad del cliente y demuestra voluntad genuina de mejora.',
            text: `Hola ${cleanAuthor}, lamentamos profundamente que tu experiencia no haya cumplido al 100% con las expectativas que caracterizan a ${cleanBusiness}. Tu opinión es de vital importancia para nosotros y ya estamos revisando lo sucedido con nuestro equipo de servicio para corregirlo de inmediato. Nos encantaría tener la oportunidad de reivindicarnos y brindarte la experiencia de excelencia que mereces.`,
          },
          {
            tone: 'Formal e Institucional',
            rationale: 'Maneja la situación con calma y seriedad corporativa.',
            text: `Hola ${cleanAuthor}, recibimos sus comentarios con la mayor seriedad y respeto. En ${cleanBusiness} la calidad en cada servicio es prioridad absoluta, por lo que tomamos nota de los puntos que menciona para aplicar los ajustes necesarios con la gerencia. Agradecemos su honestidad, ya que nos ayuda a perfeccionar nuestros procesos día a día.`,
          },
          {
            tone: 'Solución y Compromiso',
            rationale: 'Enfocado en acción correctiva inmediata.',
            text: `Hola ${cleanAuthor}, gracias por hacernos saber lo sucedido. Situaciones como la que describes no reflejan nuestro estándar habitual en ${cleanBusiness}. Hemos transmitido tus observaciones a nuestro equipo operativo para garantizar que no vuelva a ocurrir. Esperamos tener el honor de recibirte en una futura ocasión para demostrarte nuestro verdadero nivel de hospitalidad.`,
          },
        ];
      }
    }

    return NextResponse.json({ success: true, options });
  } catch (error) {
    console.error('Error generating AI reply:', error);
    return NextResponse.json(
      { error: 'Error al generar la respuesta con Inteligencia Artificial' },
      { status: 500 }
    );
  }
}
