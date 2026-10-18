export type Jurisdiction = 'co' | 'mx' | 'us' | 'es';

export interface JurisdictionInfo {
  id: Jurisdiction;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  dataLaw: string;
  authority: string;
  courtLocation: string;
}

export const JURISDICTIONS: Record<Jurisdiction, JurisdictionInfo> = {
  co: {
    id: 'co',
    name: 'Colombia',
    flag: '🇨🇴',
    currency: 'COP',
    currencySymbol: '$',
    dataLaw: 'Ley Estatutaria 1581 de 2012 y Decreto 1377 de 2013 (Habeas Data)',
    authority: 'Superintendencia de Industria y Comercio (SIC)',
    courtLocation: 'Bogotá D.C., República de Colombia',
  },
  mx: {
    id: 'mx',
    name: 'México',
    flag: '🇲🇽',
    currency: 'MXN',
    currencySymbol: '$',
    dataLaw: 'Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)',
    authority: 'Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI)',
    courtLocation: 'Ciudad de México, Estados Unidos Mexicanos',
  },
  us: {
    id: 'us',
    name: 'United States / Global',
    flag: '🇺🇸',
    currency: 'USD',
    currencySymbol: '$',
    dataLaw: 'California Consumer Privacy Act (CCPA) & CAN-SPAM Act 2003',
    authority: 'Federal Trade Commission (FTC)',
    courtLocation: 'State of Delaware, United States of America / International Arbitration',
  },
  es: {
    id: 'es',
    name: 'España / Unión Europea',
    flag: '🇪🇸',
    currency: 'EUR',
    currencySymbol: '€',
    dataLaw: 'Reglamento General de Protección de Datos (RGPD UE 2016/679) y LOPDGDD 3/2018',
    authority: 'Agencia Española de Protección de Datos (AEPD)',
    courtLocation: 'Madrid, Reino de España',
  },
};

export interface LegalDocumentContent {
  id: 'msa' | 'dpa' | 'sla' | 'order_form';
  title: string;
  subtitle: string;
  sections: {
    title: string;
    content: string;
  }[];
}

export function getLegalDocuments(data: {
  businessName: string;
  ownerName: string;
  plan: string;
  branchesCount: number;
  agreedPriceFormatted: string;
  billingCycle: string;
  jurisdiction: Jurisdiction;
}): Record<string, LegalDocumentContent> {
  const jur = JURISDICTIONS[data.jurisdiction];
  const isEn = data.jurisdiction === 'us';

  const dateStr = isEn
    ? new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  if (isEn) {
    return {
      order_form: {
        id: 'order_form',
        title: 'Official Subscription Order Form (B2B SaaS)',
        subtitle: 'Agreed Commercial Terms & Licensed Tier Specifications',
        sections: [
          {
            title: '1. Contracting Parties & Account Holder',
            content: `This Order Form is entered into between PRESTIGIA ("Provider") and ${data.businessName.toUpperCase()}, legally represented by ${data.ownerName || 'the Account Holder'} ("Subscriber"). Both parties agree to formalize the provision of software-as-a-service (SaaS) and platform licensing under the terms herein.`,
          },
          {
            title: '2. Contracted Tier & Agreed Commercial Terms',
            content: `• Active Subscription Tier: ${data.plan.toUpperCase()}
• Billing Frequency: ${data.billingCycle.toUpperCase()}
• Pricing & Payment Terms: As stipulated in the Direct Commercial Proposal / Contract Annex executed directly with the client.
• Commercial Flexibility Clause: Standardized fixed amounts are intentionally omitted from this software interface to preserve commercial autonomy and confidential negotiations for authorized global distributors. Rates, pilot discounts, multi-location volume concessions, and billing milestones are formalized directly in the custom contract executed with each client. Expansion branches are governed by the agreed add-on location terms.`,
          },
          {
            title: '3. Physical Locations Scope & Capacity',
            content: `• Locations Included in Active Subscription: ${data.branchesCount} location(s).
• Multi-Location Capacity: Elite Plan allows up to three (3) active physical locations consolidated under a single brand dashboard. Additional locations require an add-on expansion order.
• Smart QR Dynamic Router: Grants access to dynamic QR routing with private satisfaction filtering across all service stations, counters, reception desks, and client tables.`,
          },
          {
            title: '4. Term, Digital Acceptance & Cryptographic Hash',
            content: `• Effective Date: ${dateStr}.
• Digital Signature: Verified via secure authentication credentials within the Prestigia B2B Portal, holding full evidentiary weight under applicable electronic commerce legislation (${jur.name}).
• Cryptographic Authentication Hash: PRESTIGIA-SIG-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString().slice(-6)}.`,
          },
        ],
      },

      msa: {
        id: 'msa',
        title: 'Master Services Agreement (MSA) - Enterprise SaaS',
        subtitle: 'General Terms of Service, Licensing & B2B Responsibilities',
        sections: [
          {
            title: 'Section 1: Subject Matter & Universal License Grant',
            content: 'Provider grants Subscriber a non-exclusive, revocable, non-transferable software-as-a-service (SaaS) license to access and use the Prestigia platform for online reputation management, Smart QR routing, Google Maps review tracking, and customer retention across authorized physical establishments (including restaurants, gastrobares, hotels, clinics, aesthetic centers, retail stores, automotive dealerships, or professional service venues). All rights not expressly granted are reserved exclusively by Prestigia.',
          },
          {
            title: 'Section 2: Payment Terms & Pricing Flexibility',
            content: `Subscriber agrees to pay subscription fees in accordance with the active Order Form. In the event of unpaid balances exceeding ten (10) calendar days past the billing due date, Provider reserves the right to temporarily suspend portal access until payment is brought current, while preserving customer data integrity throughout said period.`,
          },
          {
            title: 'Section 3: Banking-Grade Intellectual Property, Trade Secrets & Absolute Source Code Shielding',
            content: 'The source code, technological architecture, database schemas, smart routing algorithms, trademarks, visual interfaces, scripts, and documentation of Prestigia constitute strictly confidential trade secrets and exclusive intellectual property owned solely by Prestigia under banking-grade security standards and international copyright treaties (WIPO, DMCA). Under no circumstances is Subscriber or any third party granted ownership, inspection rights, or access to the source code. Subscriber is strictly prohibited from, under penalty of criminal prosecution for industrial espionage and statutory civil damages: (a) Decompiling, reverse engineering, disassembling, or extracting source code or operational logic; (b) Copying, cloning, benchmarking for competitive purposes, or creating derivative works; (c) Sublicensing, reselling, leasing, or distributing platform access to unauthorized third parties; (d) Circumventing or tampering with any security or licensing control.',
          },
          {
            title: 'Section 4: Third-Party Disclaimers (Google Maps & WhatsApp)',
            content: 'Subscriber acknowledges and agrees that Prestigia operates as an independent technological intermediary. Prestigia is NOT affiliated with, sponsored by, or an agent of Google LLC (Google Maps) or Meta Platforms, Inc. (WhatsApp). Prestigia bears no liability for unilateral third-party actions, including Google content moderation policies, Google Maps ranking changes, or account suspensions resulting from Subscriber non-compliance.',
          },
          {
            title: 'Section 5: Limitation of Liability (Liability Cap) & Disclaimer of Consequential Damages',
            content: 'To the maximum extent permitted by applicable law: (a) Under no circumstances shall Provider be liable to Subscriber, its customers, or any third party for indirect, incidental, special, consequential, or punitive damages, including loss of profits, loss of business revenue, commercial interruption, or reputational harm; (b) Provider’s total aggregate liability arising out of or related to this Agreement or the SaaS services shall strictly under no circumstances exceed the total fees actually paid by Subscriber to Provider during the three (3) months preceding the event giving rise to liability.',
          },
          {
            title: 'Section 6: Global Resellers & Authorized Distribution Partners',
            content: 'Prestigia may distribute platform subscriptions through authorized international agents, resellers, and channel partners across different countries. Said partners act as certified sales intermediaries, while the SaaS technology license and data custody relationship is established directly between Subscriber and Prestigia.',
          },
          {
            title: 'Section 7: Term, Renewal & Notice of Cancellation',
            content: 'This Agreement remains in effect on a monthly or annual recurring basis as specified in the Order Form, renewing automatically unless either party provides written notice via the official support channel at least five (5) business days prior to the next billing cycle.',
          },
          {
            title: 'Section 8: Governing Law & Jurisdiction',
            content: `Any dispute arising from this Agreement shall first be submitted to good-faith direct mediation for thirty (30) days. Failing amicable resolution, the parties submit to the exclusive jurisdiction of the competent courts of ${jur.courtLocation}, governed under the oversight of ${jur.authority}.`,
          },
        ],
      },

      dpa: {
        id: 'dpa',
        title: 'Data Processing Addendum & Privacy (DPA)',
        subtitle: `Comprehensive Privacy Compliance under ${jur.dataLaw}`,
        sections: [
          {
            title: 'Section 1: Data Roles (Data Controller vs. Data Processor)',
            content: `In strict compliance with applicable privacy regulations (${jur.dataLaw}) and international standards (GDPR / CCPA), across all business sectors (hospitality, healthcare, retail, automotive, gastrobar, or services):
• Subscriber (${data.businessName}) acts as the sole "DATA CONTROLLER", maintaining the primary commercial relationship with end customers and possessing legal authorization to collect guest information.
• Prestigia acts strictly as the "DATA PROCESSOR" (Technological Custodian), providing secure cloud infrastructure to store and process data strictly per Subscriber instructions.`,
          },
          {
            title: 'Section 2: Purpose of Processing & Explicit Consent',
            content: 'Data collected via Smart QR (guest name, WhatsApp phone number, rating, and feedback) is processed exclusively to: (a) Route public 5-star ratings or isolate private constructive feedback; (b) Register guests into VIP loyalty clubs or promotions; (c) Enable direct service recovery for dissatisfied guests. The Smart QR interface incorporates an explicit, informed consent opt-in checkbox prior to submission.',
          },
          {
            title: 'Section 3: Strict Zero-Spam & Zero-Sale Guarantee',
            content: `Prestigia expressly and irrevocably guarantees that:
• It will NEVER sell, lease, transfer, or disclose customer databases to third parties, competitors, or external ad networks.
• All guest and customer records generated by ${data.businessName} remain the exclusive property of ${data.businessName}.
• Prestigia will never broadcast cross-promotions or unauthorized advertisements to Subscriber guests.`,
          },
          {
            title: 'Section 4: Enterprise Information Security Standards',
            content: 'Prestigia employs banking-grade administrative and technical security safeguards, including TLS 1.3 256-bit encryption in transit, SOC2-compliant cloud database infrastructure, continuous encrypted backups, and role-based access controls.',
          },
          {
            title: 'Section 5: Exercise of Privacy Rights (CCPA / GDPR)',
            content: `Any registered individual may at any time exercise their statutory rights of Access, Correction, Deletion, and Opt-Out by submitting a request to ${data.businessName} or through Prestigia's official privacy channel.`,
          },
        ],
      },

      sla: {
        id: 'sla',
        title: 'Service Level Agreement & Support Terms (SLA)',
        subtitle: 'Platform Availability, Incident Response Times & VIP Escalation',
        sections: [
          {
            title: '1. Platform Availability Commitment & Best Commercial Efforts',
            content: 'Provider shall use commercially reasonable efforts to maintain 99.5% monthly availability for the Prestigia Portal and Smart QR routing engine. The service is provided on an "as-is" and "as-available" basis. Outages resulting from third-party cloud infrastructure (AWS, Cloudflare, Google Cloud, Vercel), local internet disruptions at Subscriber locations, or unilateral third-party platform actions (Google Maps API or WhatsApp outages) shall not constitute an SLA breach nor give rise to financial damages or compensation beyond proportional service credits.',
          },
          {
            title: '2. Support Tiers by Subscription Plan',
            content: '• ELITE PLAN (👑 Multi-Location VIP): Includes four (4) priority technical support requests per month via dedicated VIP WhatsApp, with rapid turnaround (< 4 business hours) for operational issues, staff onboarding, campaign setup, or multi-location routing.\n• PRO PLAN (⭐ Advanced): Includes two (2) priority support requests per month (< 8 business hours).\n• BASIC PLAN: Includes one (1) standard support ticket per month via email (< 24 business hours).',
          },
          {
            title: '3. Official Channels & Escalation Procedures',
            content: 'Support requests are submitted directly through the 1-click VIP Support link in the Prestigia Portal top navigation bar or via the dedicated business WhatsApp concierge assigned to Subscriber.',
          },
        ],
      },
    };
  }

  // Spanish (Default for CO, MX, ES)
  return {
    order_form: {
      id: 'order_form',
      title: 'Carátula de Suscripción Oficial (Order Form B2B)',
      subtitle: 'Condiciones Comerciales Pactadas y Especificaciones de Licencia',
      sections: [
        {
          title: '1. Partes del Contrato y Datos de Facturación',
          content: `El presente acuerdo rige entre PRESTIGIA (en adelante "El Proveedor") y ${data.businessName.toUpperCase()} representada legalmente por ${data.ownerName || 'el Titular de la Cuenta'} (en adelante "El Suscriptor"). Ambas partes convienen en formalizar la prestación de servicios y licenciamiento de software SaaS conforme a las estipulaciones pactadas a continuación.`,
        },
        {
          title: '2. Plan Contratado y Condiciones de Pago',
          content: `• Nivel de Plan Activo: ${data.plan.toUpperCase()}
• Ciclo de Facturación: ${data.billingCycle.toUpperCase()}
• Tarifa y Forma de Pago: Según lo estipulado directamente en la Oferta Comercial Individualizada o Contrato Anexo suscrito entre El Suscriptor y El Proveedor o sus Distribuidores Autorizados.
• Cláusula de Flexibilidad Comercial: No se fijan montos estándar forzosos en esta interfaz digital con el fin de preservar la autonomía comercial y confidencialidad en las negociaciones de los colaboradores internacionales. Cualquier descuento promocional, tarifa de lanzamiento, convenio regional o empaquetamiento corporativo por volumen se rige por el acuerdo directo celebrado con cada cliente. Las adiciones de sedes físicas adicionales se regirán por las condiciones pactadas en la orden de expansión respectiva.`,
        },
        {
          title: '3. Alcance de Sedes y Capacidad Habilitada',
          content: `• Sedes Físicas Incluidas en la Suscripción: ${data.branchesCount} sede(s) registrada(s).
• Capacidad Plan Élite: Hasta tres (3) sedes simultáneas consolidadas bajo la misma marca. A partir de la cuarta (4ª) sede física, cada sede adicional requerirá orden de adición expresa.
• Enrutador Smart QR: Acceso a enrutamiento dinámico inteligente con filtro de satisfacción privado para todos los puntos de atención, mostradores, estaciones, recepción o mesas de las sedes activas.`,
        },
        {
          title: '4. Vigencia, Aceptación Digital y Firma Electrónica',
          content: `• Fecha de Emisión y Entrada en Vigor: ${dateStr}.
• Modalidad de Firma: Aceptación digital verificada mediante autenticación segura de credenciales en el Portal Prestigia B2B, con valor probatorio pleno según la legislación de comercio electrónico aplicable (${jur.name}).
• Hash de Autenticación Criptográfica: PRESTIGIA-SIG-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString().slice(-6)}.`,
        },
      ],
    },

    msa: {
      id: 'msa',
      title: 'Contrato Marco de Licencia SaaS (Master Services Agreement)',
      subtitle: 'Términos Generales de Uso, Licenciamiento y Responsabilidades B2B',
      sections: [
        {
          title: 'Cláusula 1: Objeto del Contrato y Otorgamiento de Licencia Universal',
          content: 'El Proveedor otorga a favor de El Suscriptor una licencia de uso de software como servicio (SaaS), no exclusiva, revocable e intransferible, para acceder y utilizar la plataforma tecnológica Prestigia en la gestión de su reputación online, enrutamiento Smart QR, monitoreo de reseñas y fidelización de clientes y usuarios en sus establecimientos comerciales o sedes físicas autorizadas (aplicable a restaurantes, gastrobares, hoteles, clínicas, consultorios médicos o estéticos, concesionarios, comercios minoristas o empresas de servicios). Todos los derechos no otorgados expresamente quedan reservados exclusivamente a favor de Prestigia.',
        },
        {
          title: 'Cláusula 2: Contraprestación, Facturación y Flexibilidad de Precios',
          content: `El Suscriptor se compromete a abonar las tarifas pactadas de acuerdo con la Carátula de Suscripción (Order Form) vigente. Las tarifas podrán ser acordadas en moneda local (${jur.currency}) o dólares estadounidenses (USD). En caso de mora superior a diez (10) días calendario contados a partir de la fecha de corte, El Proveedor podrá suspender temporalmente el acceso al portal hasta la regularización del pago, sin perjuicio de la conservación de los datos del cliente durante dicho período.`,
        },
        {
          title: 'Cláusula 3: Propiedad Intelectual, Secreto Comercial y Blindaje Absoluto del Código Fuente',
          content: 'El código fuente, arquitectura técnica, esquemas de bases de datos, algoritmos de enrutamiento inteligente, marcas comerciales, isotipos, interfaces de usuario, scripts y documentación de Prestigia constituyen secretos comerciales y propiedad intelectual exclusiva e inalienable de Prestigia, protegida bajo estándares de seguridad de nivel bancario y tratados internacionales de derechos de autor (OMPI, Decisión Andina 486). Bajo ninguna circunstancia se concede a El Suscriptor ni a terceros acceso, inspección ni derecho sobre el código fuente. Queda terminantemente prohibido bajo apercibimiento de acciones penales por espionaje industrial y demandas civiles de indemnización agravada: (a) Descompilar, desensamblar, realizar ingeniería inversa o intentar extraer el código fuente o lógica operativa; (b) Copiar, clonar, emular o crear obras derivadas; (c) Alquilar, revender, transferir o sublicenciar el acceso a terceros ajenos a la organización autorizada; (d) Eludir, vulnerar o alterar cualquier medida tecnológica de seguridad o control de licencias.',
        },
        {
          title: 'Cláusula 4: Deslinde de Responsabilidad sobre Terceros (Google Maps & WhatsApp)',
          content: 'El Suscriptor reconoce y acepta expresamente que Prestigia es una herramienta tecnológica independiente de intermediación y blindaje. Prestigia NO es propietaria, afiliada ni representante de Google LLC (Google Maps) ni de Meta Platforms, Inc. (WhatsApp). Por tanto, Prestigia no asume responsabilidad alguna sobre decisiones unilaterales de terceros, tales como: políticas de moderación de reseñas de Google, cambios en el algoritmo de posicionamiento de Google Maps, suspensiones o bloqueos de fichas causados por infracciones cometidas directamente por El Suscriptor.',
        },
        {
          title: 'Cláusula 5: Límite Máximo de Responsabilidad (Liability Cap) y Exclusión de Lucro Cesante',
          content: 'En la máxima medida permitida por la ley aplicable: (a) En ningún caso El Proveedor será responsable frente a El Suscriptor, sus clientes o terceros por daños indirectos, incidentales, punitivos o consecuenciales, incluyendo lucro cesante, pérdida de ingresos comerciales, interrupción de operaciones, daño reputacional o pérdida de clientes; (b) La responsabilidad económica acumulada total y agregada de El Proveedor por cualquier reclamo derivado del servicio o del presente contrato se limitará estrictamente al monto total efectivamente pagado por El Suscriptor a Prestigia durante los tres (3) meses inmediatamente anteriores al evento generador del reclamo.',
        },
        {
          title: 'Cláusula 6: Distribuidores y Colaboradores Internacionales (Reseller Clause)',
          content: 'Prestigia podrá comercializar el acceso a la plataforma mediante agentes comerciales, distribuidores y colaboradores autorizados en diferentes países. Dichos colaboradores actúan como intermediarios comerciales autorizados para coordinar la vinculación, pero la relación tecnológica de licenciamiento y custodia de la plataforma se rige formalmente entre El Suscriptor y Prestigia.',
        },
        {
          title: 'Cláusula 7: Duración, Terminación y Preaviso',
          content: 'El presente contrato tiene vigencia mensual o anual según lo estipulado en la Carátula de Suscripción, y se renovará automáticamente por períodos iguales a menos que cualquiera de las partes notifique por escrito o a través del canal oficial de soporte su intención de no renovar con una antelación mínima de cinco (5) días hábiles antes de la siguiente fecha de corte.',
        },
        {
          title: 'Cláusula 8: Ley Aplicable y Jurisdicción',
          content: `Para controversias derivadas del presente contrato, las partes acuerdan someterse en primera instancia a un proceso de arreglo directo o mediación virtual de buena fe durante un término máximo de treinta (30) días. En su defecto, las partes fijan como domicilio contractual y ley rectora los tribunales competentes de ${jur.courtLocation}, bajo la tutela normativa de ${jur.authority}.`,
        },
      ],
    },

    dpa: {
      id: 'dpa',
      title: 'Acuerdo de Tratamiento de Datos & Privacidad (DPA)',
      subtitle: `Cumplimiento Integral de Privacidad bajo ${jur.dataLaw}`,
      sections: [
        {
          title: 'Cláusula 1: Roles de las Partes en el Tratamiento de Datos',
          content: `En estricto cumplimiento de la normativa vigente en ${jur.name} (${jur.dataLaw}) y los estándares internacionales (RGPD / CCPA), en todos los sectores comerciales (hotelería, salud, comercio, gastronomía o servicios):
• El Suscriptor (${data.businessName}) actúa en calidad de único "RESPONSABLE DEL TRATAMIENTO" (Data Controller), siendo el titular de la relación comercial directa con los clientes finales y el legitimado para recabar sus datos en el establecimiento o punto de atención.
• Prestigia actúa exclusivamente en calidad de "ENCARGADO DEL TRATAMIENTO" (Data Processor / Custodio Tecnológico), proveyendo el software y los servidores seguros para almacenar y procesar la información bajo instrucciones de El Suscriptor.`,
        },
        {
          title: 'Cláusula 2: Finalidad del Tratamiento y Consentimiento Informado',
          content: 'Los datos recolectados a través del Smart QR (nombre, número de WhatsApp, calificación de servicio y motivo de visita) tienen como única y exclusiva finalidad: (a) Enrutar la reseña pública o la queja privada al canal correspondiente; (b) Registrar al cliente en el Club de Fidelización, membresías o sorteos del establecimiento; (c) Permitir la compensación y respuesta ante inconformidades de servicio. El Smart QR integra una casilla de consentimiento previo, expreso e informado de Habeas Data antes de registrar cualquier dato.',
        },
        {
          title: 'Cláusula 3: Compromiso Absoluto de NO Comercialización (Zero-Spam Guarantee)',
          content: `Prestigia garantiza de forma expresa e indeclinable que:
• NO venderá, cederá, alquilará ni compartirá jamás las bases de datos de clientes con terceros, marcas competidoras ni redes publicitarias externas.
• Los datos de los clientes de ${data.businessName} son propiedad exclusiva de ${data.businessName}.
• Prestigia no enviará publicidad cruzada a los clientes y usuarios registrados en la plataforma.`,
        },
        {
          title: 'Cláusula 4: Medidas de Seguridad de la Información',
          content: 'Prestigia implementa medidas de seguridad técnicas y organizativas de estándar bancario, incluyendo: Cifrado en tránsito mediante protocolos TLS 1.3 de 256 bits, almacenamiento seguro en infraestructura cloud de alta disponibilidad con copias de seguridad redundantes y control de accesos estricto basado en roles.',
        },
        {
          title: 'Cláusula 5: Ejercicio de Derechos ARCO (Habeas Data)',
          content: `Cualquier titular de datos personales registrado en la plataforma podrá ejercer en todo momento sus derechos de Acceso, Rectificación, Cancelación y Oposición (ARCO), así como revocar su autorización de tratamiento de datos o solicitar la eliminación total de su registro mediante solicitud remitida a ${data.businessName} o al canal oficial de Prestigia.`,
        },
      ],
    },

    sla: {
      id: 'sla',
      title: 'Acuerdo de Nivel de Servicio & Soporte (SLA)',
      subtitle: 'Disponibilidad de la Plataforma, Tiempos de Respuesta y Asistencia VIP',
      sections: [
        {
          title: '1. Compromiso de Disponibilidad y Mejores Esfuerzos Comerciales',
          content: 'El Proveedor empleará sus mejores esfuerzos comerciales para mantener una disponibilidad mensual de la plataforma Prestigia y del enrutador Smart QR del 99.5% durante los 365 días del año. La plataforma se provee bajo modalidad de software como servicio "tal cual" (as-is). No se imputarán como fallas de servicio ni darán lugar a indemnizaciones las interrupciones ocasionadas por: (a) Caídas globales de infraestructura cloud o de hosting (AWS, Cloudflare, Vercel, Google Cloud); (b) Fallas de conectividad del proveedor local de internet del establecimiento; (c) Decisiones o caídas de plataformas de terceros ajenos a Prestigia (tales como mantenimientos de Google Maps o de la red de WhatsApp).',
        },
        {
          title: '2. Paquetes de Soporte Técnico por Nivel de Plan',
          content: '• PLAN ÉLITE (👑 Multi-Sede VIP): Incluye cuatro (4) asistencias técnicas prioritarias mensuales vía WhatsApp VIP dedicado, con atención en tiempo récord (< 4 horas hábiles) para incidentes operativos, asesoría en campañas, adición de sedes o soporte con personal.\n• PLAN PRO (⭐ Avanzado): Incluye dos (2) asistencias técnicas mensuales con tiempo de respuesta prioritario (< 8 horas hábiles).\n• PLAN BÁSICO: Incluye una (1) asistencia técnica mensual estándar por canal de tickets/correo electrónico (< 24 horas hábiles).',
        },
        {
          title: '3. Canales Oficiales y Procedimiento de Escalamiento',
          content: 'Las solicitudes de soporte técnico se gestionan directamente a través del botón oficial de Soporte VIP integrado en el portal de la marca o mediante la línea directa de WhatsApp corporativo asignada a la cuenta de El Suscriptor.',
        },
      ],
    },
  };
}
