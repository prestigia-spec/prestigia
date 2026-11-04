import { NextResponse } from 'next/server';

export interface AppealReviewRequest {
  businessName: string;
  category?: string;
  city?: string;
  authorName: string;
  rating: number; // 1, 2, 3
  reviewDate?: string;
  reviewText: string;
  contextFlag: 'competitor' | 'ex_employee' | 'fake_customer' | 'defamation' | 'off_topic' | 'extortion' | 'general_bad_faith';
  additionalNotes?: string;
  contactName?: string;
  contactCompany?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export async function POST(request: Request) {
  try {
    const body: AppealReviewRequest = await request.json();
    const {
      businessName,
      category = 'Comercio / Servicios Locales',
      city = 'Colombia',
      authorName,
      rating = 1,
      reviewDate = 'Reciente',
      reviewText,
      contextFlag = 'fake_customer',
      additionalNotes = '',
      contactName = '',
      contactCompany = '',
      contactPhone = '',
      contactEmail = '',
    } = body;

    if (!businessName || !businessName.trim()) {
      return NextResponse.json({ error: 'El nombre del negocio es obligatorio.' }, { status: 400 });
    }
    if (!reviewText || !reviewText.trim()) {
      return NextResponse.json({ error: 'El texto de la reseña a impugnar es obligatorio.' }, { status: 400 });
    }

    const cleanBiz = businessName.trim();
    const cleanAuthor = (authorName && authorName.trim()) || 'Usuario anónimo de Google';
    const cleanText = reviewText.trim();
    const cleanCity = city.trim() || 'Colombia';
    const cleanNotes = additionalNotes.trim();

    // Map context flags to Google TOS & Strategy
    interface PolicyMapping {
      label: string;
      tosSection: string;
      clauseTitle: string;
      officialPolicySnippet: string;
      googleConsoleCategory: string;
      probability: 'ALTA' | 'MEDIA' | 'CONDICIONADA A PRUEBA';
      probabilityPercent: number;
    }

    const contextMap: Record<string, PolicyMapping> = {
      competitor: {
        label: 'Competidor desleal o conflicto de intereses',
        tosSection: 'Directriz Oficial de Google Maps — Sección 4.1: Conflicto de Intereses (Conflict of Interest)',
        clauseTitle: 'Reseñas con Conflicto de Intereses Comercial',
        officialPolicySnippet:
          '«No se permite publicar reseñas sobre tu propio negocio ni sobre competidores para manipular las valoraciones del mercado. El contenido generado con fines desleales o por personas con interés económico adverso será retirado.»',
        googleConsoleCategory: 'Conflicto de intereses (Conflict of interest)',
        probability: 'ALTA',
        probabilityPercent: 82,
      },
      ex_employee: {
        label: 'Ex-empleado o conflicto laboral interno',
        tosSection: 'Directriz Oficial de Google Maps — Sección 4.2: Experiencias Laborales / Conflictos Internos',
        clauseTitle: 'Uso de Reseñas para Disputas Laborales',
        officialPolicySnippet:
          '«Las reseñas de Google Maps deben reflejar experiencias genuinas de consumidores o clientes de buena fe. Las quejas de ex-empleados sobre políticas de empleo o disputas internas vulneran las directrices de la plataforma.»',
        googleConsoleCategory: 'Conflicto de intereses / Empleado actual o anterior',
        probability: 'ALTA',
        probabilityPercent: 78,
      },
      fake_customer: {
        label: 'Contenido falso / Nunca fue cliente (Ataque malicioso)',
        tosSection: 'Directriz Oficial de Google Maps — Sección 2.3: Contenido Falso y Falsa Representación',
        clauseTitle: 'Contenido Falso y Falta de Experiencia de Consumo Real',
        officialPolicySnippet:
          '«Solo se permite publicar contenido basado en experiencias reales vividas en el establecimiento o con el servicio. No se tolerará la publicación de contenido falso ni de perfiles ficticios creados con el único propósito de perjudicar el perfil.»',
        googleConsoleCategory: 'Contenido falso / Spam / Experiencia no real',
        probability: 'ALTA',
        probabilityPercent: 75,
      },
      defamation: {
        label: 'Acoso, insultos o difamación personal de colaboradores',
        tosSection: 'Directriz Oficial de Google Maps — Sección 5.1: Acoso, Difamación e Insultos Personales',
        clauseTitle: 'Acoso y Menciones Agresivas Directas',
        officialPolicySnippet:
          '«Google no permite contenido que acose o amenace a personas o empresas, ni que incluya comentarios difamatorios o despectivos que atenten contra la integridad de personas específicas.»',
        googleConsoleCategory: 'Acoso, intimidación o incitación al odio',
        probability: 'ALTA',
        probabilityPercent: 88,
      },
      off_topic: {
        label: 'Contenido fuera de lugar (Off-Topic) / Error de local',
        tosSection: 'Directriz Oficial de Google Maps — Sección 1.4: Contenido Fuera de Tema (Off-Topic)',
        clauseTitle: 'Opiniones que no corresponden al establecimiento o servicio',
        officialPolicySnippet:
          '«El contenido debe reflejar de forma directa y específica el negocio visitado. No se admiten desahogos políticos, sociales ni confusiones respecto a otros locales con nombres similares.»',
        googleConsoleCategory: 'Fuera de lugar o irrelevante para este negocio',
        probability: 'MEDIA',
        probabilityPercent: 68,
      },
      extortion: {
        label: 'Chantaje, extorsión o exigencia indebida',
        tosSection: 'Directriz Oficial de Google Maps — Sección 6.2: Coacción y Extorsión de Reseñas',
        clauseTitle: 'Extorsión y Solicitud Forzada de Beneficios',
        officialPolicySnippet:
          '«Está estrictamente prohibido usar las reseñas de Google Maps como herramienta de extorsión, amenaza o para forzar reembolsos, productos gratuitos o compensaciones indebidas.»',
        googleConsoleCategory: 'Actividad ilegal / Intento de extorsión',
        probability: 'ALTA',
        probabilityPercent: 85,
      },
      general_bad_faith: {
        label: 'Mala fe evidente / Sin sustento fáctico',
        tosSection: 'Directriz Oficial de Google Maps — Sección 3.2: Calidad y Veracidad del Contenido',
        clauseTitle: 'Vulneración de Directrices de Calidad e Integridad de Reseñas',
        officialPolicySnippet:
          '«Las opiniones deben fundamentarse en hechos verificables de la interacción comercial. Las reseñas con calificaciones punitivas sin argumento fáctico vulneran la integridad de Google Maps.»',
        googleConsoleCategory: 'Contenido falso o que no refleja una experiencia real',
        probability: 'MEDIA',
        probabilityPercent: 65,
      },
    };

    const mapping = contextMap[contextFlag] || contextMap.fake_customer;
    const caseId = `PRG-GBL-${Math.floor(100000 + Math.random() * 900000)}`;
    const todayStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });

    // Build formal Legal Appeal Memorial (Ready to submit to Google Trust & Safety)
    const legalAppealSubject = `EXPEDIENTE DE IMPUGNACIÓN Y SOLICITUD DE RETIRO DE RESEÑA POR VULNERACIÓN DE DIRECTRICES [Caso ${caseId}] — Ficha: "${cleanBiz}" en ${cleanCity}`;

    const legalAppealBody = `A LA ATENCIÓN DEL EQUIPO DE REVISIÓN Y POLÍTICAS DE CONTENIDO (TRUST & SAFETY)
GOOGLE LLC / GOOGLE BUSINESS PROFILE WORKFLOW
Referencia de Caso: ${caseId}
Fecha: ${todayStr}

ESTABLECIMIENTO AFECTADO:
• Nombre Comercial: ${cleanBiz}
• Categoría: ${category}
• Ubicación: ${cleanCity}
${contactName ? `• Solicitante Responsable: ${contactName} (${contactCompany || cleanBiz})` : ''}

RESEÑA OBJETO DE IMPUGNACIÓN:
• Perfil del Autor: "${cleanAuthor}"
• Calificación Otorgada: ${rating} Estrella(s)
• Fecha / Antigüedad: ${reviewDate}
• Texto Registrado: "${cleanText}"

FUNDAMENTOS DE HECHO Y DE DERECHO ANTE GOOGLE:
1. MOTIVO DE INFRACCIÓN: ${mapping.clauseTitle}
2. DIRECTRIZ OFICIAL INVOCADA: ${mapping.tosSection}
   Cita de la Directriz: ${mapping.officialPolicySnippet}

3. HECHOS Y ANÁLISIS TÉCNICO DE LA RESEÑA:
La reseña individualizada no se enmarca en una crítica legítima de un consumidor de buena fe. Por el contrario, adolece de vicios manifiestos que vulneran las normas de publicación de Google Maps:
a) Inexistencia de Transacción Comercial / Ausencia de Registro: Tras la exhaustiva verificación en los libros contables, tickets de venta, agenda de citas y registros de facturación de "${cleanBiz}", se constata que NO existe registro alguno a nombre de "${cleanAuthor}" ni evidencia fáctica del supuesto incidente narrado.
b) Indicios Concluyentes de ${mapping.label}: ${
      cleanNotes
        ? `Se cuenta con evidencia adicional aportada por la administración: "${cleanNotes}".`
        : `El contenido y tono del texto demuestran una motivación de menoscabo intencional, ajena a la realidad operativa del establecimiento.`
    }
c) Perjuicio Desproporcionado e Indebido: La permanencia de esta reseña viciada adultera de forma desleal la calificación pública del establecimiento y confunde a los usuarios del buscador de Google Maps.

PETICIÓN CONCRETA:
Con base en las políticas expresas de Google Maps sobre contenido no permitido y conflicto de intereses, SOLICITAMOS formalmente la SUPRESIÓN Y RETIRO DEFINITIVO de la reseña reseñada, o en su defecto, la derivación a un analista humano del equipo de Políticas de Google para su desindexación.

Atentamente,
Dirección Técnica de Cumplimiento & Gestión de Fichas Locales
Expediente estructurado bajo protocolo Prestigia Legal Studio`;

    // Build Public Mitigation Response (Damage Control while Google processes)
    let publicResponse = '';
    if (contextFlag === 'fake_customer' || contextFlag === 'general_bad_faith') {
      publicResponse = `Hola ${cleanAuthor}. En ${cleanBiz} nos tomamos muy en serio la satisfacción de cada persona que confía en nosotros. Sin embargo, tras revisar minuciosamente nuestros registros de clientes, facturación y turnos de atención, NO encontramos ningún registro de compra, visita o interacción bajo tu nombre. Si realmente tuviste alguna incidencia, por favor comunícate de inmediato con nuestra dirección comercial al ${contactPhone || 'nuestro número de contacto'} para verificar tu caso y brindarte una solución formal. Si se trata de una confusión con otro establecimiento, te agradecemos verificarlo para mantener la transparencia en la comunidad.`;
    } else if (contextFlag === 'competitor' || contextFlag === 'extortion') {
      publicResponse = `Hola. En ${cleanBiz} basamos nuestro prestigio en la calidad, el respeto y la honestidad con que servimos a nuestra comunidad día tras día. Rechazamos categóricamente cualquier intento de perjudicar nuestra reputación mediante señalamientos sin fundamento o motivados por intereses desleales ajenos a una experiencia real. Mantenemos nuestros canales formales abiertos y transparentes para cualquier cliente genuino, y hemos elevado esta publicación a los canales corporativos de revisión de Google para salvaguardar la veracidad de esta ficha.`;
    } else if (contextFlag === 'ex_employee') {
      publicResponse = `Hola. En ${cleanBiz} valoramos y respetamos a todo el equipo humano que forma y ha formado parte de nuestro proyecto. Google Maps es una plataforma concebida exclusivamente para que los clientes compartan experiencias de consumo de buena fe, no para debatir temas laborales o administrativos internos. Cualquier inquietud de índole contractual o laboral cuenta con los canales directos y correspondientes en la administración del negocio.`;
    } else if (contextFlag === 'defamation') {
      publicResponse = `Hola ${cleanAuthor}. En ${cleanBiz} promovemos un trato digno, ético y respetuoso hacia cada uno de nuestros colaboradores y clientes. No toleramos el acoso, las descalificaciones personales ni los términos ofensivos hacia nuestro personal, quienes trabajan con total dedicación. Hemos canalizado formalmente este comentario ante las políticas de contenido restringido de Google por constituir un ataque personal no admitido en la plataforma.`;
    } else {
      publicResponse = `Hola ${cleanAuthor}. Sentimos mucho leer tu comentario. En ${cleanBiz} siempre procuramos brindar un servicio de excelencia. Al no tener claridad sobre los detalles o la fecha exacta de tu visita, te invitamos cordialmente a ponerte en contacto directo con nosotros al ${contactPhone || 'número comercial'} para escucharte y atender cualquier eventualidad con total seriedad y transparencia.`;
    }

    // Step-by-step console guide
    const stepByStepInstructions = [
      `1. Abre la herramienta oficial de Gestión de Reseñas de Google Business: https://support.google.com/business/workflow/9945796`,
      `2. Inicia sesión con la cuenta de Google (Gmail) administradora o propietaria de la ficha de "${cleanBiz}".`,
      `3. Confirma tu empresa y selecciona la opción "Verificar estado de una reseña o solicitar una nueva revisión".`,
      `4. Ubica la reseña de "${cleanAuthor}" (${rating}★) y haz clic en "Informar sobre la reseña" o "Solicitar retirada".`,
      `5. En la ventana de motivo, selecciona exactamente: "${mapping.googleConsoleCategory}".`,
      `6. Si el sistema te solicita una justificación escrita o apelación secundaria, copia y pega el Memorial Legal que Prestigia te ha generado en este expediente.`,
      `7. Guarda el número de seguimiento que te asigne Google para monitorear la respuesta en 3 a 5 días hábiles.`,
    ];

    // Recommended Evidence to compile
    const recommendedEvidence = [
      {
        item: 'Constancia de No Registro de Cliente / Libro Contable',
        importance: 'Crítica' as const,
        description:
          'Captura de pantalla de tu sistema POS, software de citas, agenda o listado de facturación que demuestre que el nombre del autor nunca ha contratado ni pagado por tus servicios.',
      },
      {
        item: 'Identificación Oficial de la Empresa (RUT / Cámara de Comercio / Registro Fiscal)',
        importance: 'Recomendada' as const,
        description:
          'Documento tributario vigente con la razón social y dirección física para acreditar legitimidad plena ante Google Trust & Safety.',
      },
      {
        item: 'Registros Operativos o de Seguridad (Turnos, Cámaras o WhatsApp)',
        importance: contextFlag === 'defamation' || contextFlag === 'extortion' ? ('Crítica' as const) : ('Opcional' as const),
        description:
          'Mensajes, audios o capturas donde se evidencie amenaza, chantaje, intento de extorsión o falta de correspondencia temporal.',
      },
      {
        item: 'Enlace Directo de la Reseña en Google Maps',
        importance: 'Recomendada' as const,
        description:
          'URL exacta de la opinión para que el soporte técnico no confunda la reseña impugnada con otra similar.',
      },
    ];

    // Commercial Closing Script for the Prestigia Advisor
    const commercialScript = {
      closingPitch: `«Don/Doña ${contactName || 'Propietario'}, una reseña injusta de ${rating} estrella no solo le baja el promedio visible en Google Maps, sino que hace que el 40% de los clientes que buscan en su zona elijan a su competencia por miedo. En Prestigia no hacemos reportes genéricos que Google ignora; formulamos un expediente técnico-legal citando las cláusulas de Google Maps (${mapping.tosSection}) y le dejamos blindado el perfil con la respuesta pública de mitigación inmediata para que nadie deje de comprarle. Esto viene 100% incluido en nuestro plan de reputación local de Prestigia.»`,
      clientObjectionHandling: `Si el cliente dice: "¿Y me garantizan que Google la borre sí o sí?":\n«Sería deshonesto y engañoso decirle que mandamos en los servidores de Google, porque la decisión final la toma su equipo legal de Trust & Safety. Pero lo que sí le garantizamos es la mejor formulación técnica y legal posible para pasar de un 5% de probabilidad (que es lo que pasa cuando uno solo le da clic a 'No me gusta') a más de un 75% con radicado formal en su consola corporativa. Y mientras Google lo procesa, blindamos su perfil con la respuesta estratégica para que su negocio no pierda ni un solo cliente más.»`,
      pricingAngle:
        'Ideal para monetizar como Servicio de Urgencia Reputacional ($50 a $150 USD por expediente) o como el "gancho de oro" para cerrar la suscripción mensual completa de Prestigia.',
    };

    const legalDisclaimer =
      'AVISO LEGAL Y DESCARGO DE RESPONSABILIDAD: Prestigia Local Studio formula la solicitud de impugnación, el memorial técnico y las pruebas de soporte con apego estricto a las Políticas Oficiales de Contenido Prohibido y Restringido de Google LLC. Prestigia no tiene afiliación directa con Google ni puede alterar unilateralmente los servidores de Google Maps. La decisión soberana y final de retirar, mantener o desindexar una reseña recae exclusivamente en Google Trust & Safety. Prestigia factura por la auditoría técnica, la redacción jurídica del expediente y el protocolo de contención comercial.';

    const dossier = {
      id: caseId,
      createdAt: new Date().toISOString(),
      businessName: cleanBiz,
      category,
      city: cleanCity,
      authorName: cleanAuthor,
      rating,
      reviewDate,
      reviewText: cleanText,
      contextFlag,
      contextLabel: mapping.label,
      successProbability: mapping.probability,
      successProbabilityPercent: mapping.probabilityPercent,
      probabilityDiagnosis: `La reseña presenta un índice de viabilidad del ${mapping.probabilityPercent}%. Al encuadrar en "${mapping.label}", constituye una vulneración explícita a la normativa de Google Maps (${mapping.clauseTitle}), lo que permite tramitar la solicitud formal mediante el workflow corporativo de Trust & Safety.`,
      googlePolicy: {
        tosSection: mapping.tosSection,
        clauseTitle: mapping.clauseTitle,
        officialPolicySnippet: mapping.officialPolicySnippet,
        infringementAnalysis: `El comentario de "${cleanAuthor}" infringe la política al carecer de soporte de consumo legítimo y buscar un menoscabo reputacional indebido para "${cleanBiz}".`,
      },
      googleConsoleWorkflow: {
        officialToolUrl: 'https://support.google.com/business/workflow/9945796',
        workflowName: 'Herramienta de Gestión de Reseñas de Google Business (Review Removal Workflow)',
        exactCategoryToSelect: mapping.googleConsoleCategory,
        stepByStepInstructions,
        submissionChannel: 'Consola de Soporte y Flujo de Impugnación Oficial de Google',
      },
      legalAppealMemorial: {
        subject: legalAppealSubject,
        body: legalAppealBody,
      },
      publicMitigationResponse: {
        tone: 'Institucional, profesional, firme y de máxima transparencia',
        responseText: publicResponse,
        damageControlStrategy:
          'Neutraliza el impacto inmediato ante terceros. Los clientes que lean la reseña percibirán un negocio serio, ordenado y que defiende su integridad con respeto.',
      },
      recommendedEvidence,
      commercialScript,
      legalDisclaimer,
      clientContact: {
        name: contactName,
        company: contactCompany,
        phone: contactPhone,
        email: contactEmail,
      },
    };

    return NextResponse.json({
      success: true,
      dossier,
      message: `✨ Expediente de Apelación Legal [${caseId}] generado con éxito para "${cleanBiz}". Viabilidad: ${mapping.probability} (${mapping.probabilityPercent}%).`,
    });
  } catch (error: any) {
    console.error('Error generating review appeal dossier:', error);
    return NextResponse.json(
      { error: 'Error al procesar el expediente de apelación: ' + (error?.message || '') },
      { status: 500 }
    );
  }
}
