import {
  MessageCircle,
  Star,
  Sparkles,
  Brain,
  QrCode,
  Rocket,
  Gift,
  BarChart3,
  Building2,
} from 'lucide-react';
import { LandingLang } from './landing-translations';

export interface PortalModuleItem {
  id: number;
  title: string;
  shortName: string;
  tabKey: string;
  badge: string;
  badgeColor: string;
  icon: any;
  desc: string;
  benefit: string;
  tip: string;
}

export function getPortalModules(lang: LandingLang): PortalModuleItem[] {
  const isEn = lang === 'en';
  return [
    {
      id: 1,
      title: isEn ? 'Private In-Venue Containment Center' : 'Central de Contención & Incidentes en Sala',
      shortName: isEn ? '1. Private Containment' : '1. Contención Privada',
      tabKey: 'quejas',
      badge: isEn ? 'In-Venue Urgency • Zero Spam' : 'Urgencia en Sala • Cero Saturación',
      badgeColor: 'text-red-400 bg-red-500/10 border-red-500/20',
      icon: MessageCircle,
      desc: isEn
        ? 'Shielded vault holding all 1, 2, and 3-star ratings. Zero spam to personal WhatsApp or emails. Generates instant audible and visual alerts on the venue display with full audit tickets to resolve disputes on the spot.'
        : 'Bóveda blindada donde quedan retenidas todas las calificaciones de 1, 2 y 3 estrellas. Cero mensajes a WhatsApp ni correos personales para no saturar. Genera alertas sonoras y visuales en la pantalla del local con tickets de auditoría completa para resolver de inmediato.',
      benefit: isEn
        ? 'Neutralizes 100% of public Google Maps reputation damage before the guest even leaves your venue.'
        : 'Neutraliza el 100% del daño a la reputación pública en Google Maps antes de que el cliente salga del local.',
      tip: isEn
        ? 'Resolving incidents in under 15 minutes rescues 89% of dissatisfied guests.'
        : 'Atender el incidente en menos de 15 minutos rescata al 89% de clientes insatisfechos.',
    },
    {
      id: 2,
      title: isEn ? 'Google Maps Radar & Real-Time Monitoring' : 'Radar Google Maps & Monitoreo en Vivo',
      shortName: isEn ? '2. Google Radar' : '2. Radar Google',
      tabKey: 'radar',
      badge: isEn ? 'Google Maps • Real Time' : 'Google Maps • Tiempo Real',
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      icon: Star,
      desc: isEn
        ? 'Monitors in real time all incoming public reviews on your Google Maps listing. Shows cumulative scores, pending count, and response velocity without leaving the system.'
        : 'Monitorea en tiempo real todas las opiniones públicas que ingresan a tu ficha de Google Maps. Muestra la calificación acumulada, conteo de reseñas pendientes y velocidad de respuesta de tu negocio.',
      benefit: isEn
        ? 'Executive oversight of your brand prestige without having to manually log into Google.'
        : 'Supervisión ejecutiva total del prestigio de tu negocio sin tener que entrar manualmente a Google.',
      tip: isEn
        ? 'Maintaining steady weekly reviews boosts organic visibility in local Google search up to 38%.'
        : 'Mantener un flujo regular de reseñas eleva la visibilidad orgánica en búsquedas locales de la zona hasta un 38%.',
    },
    {
      id: 3,
      title: isEn ? 'AI Response Dispatch Center' : 'Centro de Despacho & Asistente IA',
      shortName: isEn ? '3. AI Assistant' : '3. Asistente IA',
      tabKey: 'ia',
      badge: isEn ? 'Fast Dispatch • Multilingual' : 'Despacho Rápido • Multilingüe',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      icon: Sparkles,
      desc: isEn
        ? 'Artificial Intelligence engine drafting tailored official replies in 3 strategic tones (Warm, Corporate, Promotional) and auto-translating tourist reviews written in English or other languages.'
        : 'Motor de Inteligencia Artificial que redacta respuestas oficiales personalizadas en 3 tonos estratégicos (Cálido, Corporativo y Promocional) y traduce automáticamente reseñas de turistas escritas en inglés u otros idiomas.',
      benefit: isEn
        ? 'Saves weekly drafting hours and thousands of dollars in agency Community Management fees.'
        : 'Ahorra horas semanales de redacción y miles de dólares en agencias de Community Management.',
      tip: isEn
        ? 'Using the Promotional tone on 5★ reviews invites customers to try new seasonal products on their next visit.'
        : 'El tono Promocional en opiniones 5★ invita al cliente a probar una novedad en su próxima visita.',
    },
    {
      id: 4,
      title: isEn ? '360° AI Sentiment Matrix' : 'Matriz de Sentimiento 360° con IA',
      shortName: isEn ? '4. Sentiment 360°' : '4. Sentimiento 360°',
      tabKey: 'sentimiento',
      badge: isEn ? 'Exclusive Pro & Elite' : 'Exclusivo Élite & Franquicias',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      icon: Brain,
      desc: isEn
        ? 'Multidimensional AI analytics auditing the 4 critical operational pillars: Product Quality, Staff Service, Waiting Times, and Venue Atmosphere.'
        : 'Analítica multidimensional con IA que audita los pilares críticos de la operación: Calidad del Producto, Atención del Personal, Tiempos de Espera, Ambiente e Higiene.',
      benefit: isEn
        ? 'Diagnoses root causes of operational friction weeks before they affect revenue.'
        : 'Diagnostica la causa raíz de cualquier problema operativo semanas antes de que impacte la facturación.',
      tip: isEn
        ? 'Compare shift scores to identify which operational hours need kitchen or floor reinforcement.'
        : 'Compara las métricas entre turnos para saber qué horarios requieren ajustes o refuerzos en sala.',
    },
    {
      id: 5,
      title: isEn ? 'Smart QR & Marketing Materials' : 'Smart QR & Material de Captación',
      shortName: isEn ? '5. Smart QR' : '5. Smart QR',
      tabKey: 'qr',
      badge: isEn ? 'Printable Vector Assets' : 'Material Vectorial de Mesa',
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      icon: QrCode,
      desc: isEn
        ? 'Download and configuration center for your venue Smart QRs. Export high-resolution vector codes for table talkers, bar acrylics, receipts, or bill folders.'
        : 'Centro de descarga y configuración de los Smart QRs para tu negocio. Exporta códigos vectoriales en alta resolución para habladores de mesa, acrílicos en barra, tarjetas o facturas.',
      benefit: isEn
        ? 'Customers do not need to download apps; scans directly with camera and loads in under 1 second.'
        : 'El cliente no tiene que descargar ninguna app; escanea con su cámara y carga en menos de 1 segundo.',
      tip: isEn
        ? 'Placing the Smart QR next to payment card terminals multiplies customer scans by 300%.'
        : 'Ubicar el Smart QR visible junto al datáfono o en el portacuentas multiplica los escaneos en un 300%.',
    },
    {
      id: 6,
      title: isEn ? '5-Star Customer Reactivation' : 'Reactivación de Clientes 5★',
      shortName: isEn ? '6. Reactivate 5★' : '6. Reactivar 5★',
      tabKey: 'reactivar',
      badge: isEn ? 'Loyalty & Repeat Visits' : 'Fidelización & Recompra',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      icon: Rocket,
      desc: isEn
        ? 'Exclusive loyalty module for customers who rated 4 or 5 stars. Send seasonal perks, updates, and invitations to bring them back.'
        : 'Módulo de fidelización exclusivo para clientes que calificaron 4 o 5 estrellas. Permite enviar beneficios exclusivos, novedades de temporada y recordatorios para asegurar su regreso.',
      benefit: isEn
        ? 'Turns casual diners and visitors into regular patrons without spending money on social ads.'
        : 'Convierte comensales y visitantes casuales en clientes frecuentes sin gastar en publicidad de redes sociales.',
      tip: isEn
        ? 'An invitation sent 20 days after their first visit elevates repurchase rates by 24%.'
        : 'Un mensaje con una invitación especial a los 20 días de la primera visita eleva la tasa de recompra un 24%.',
    },
    {
      id: 7,
      title: isEn ? 'VIP Giveaways & Prize Wheel' : 'Sorteos VIP & Motor de Ruleta',
      shortName: isEn ? '7. VIP Giveaways' : '7. Sorteos VIP',
      tabKey: 'sorteos',
      badge: isEn ? 'Interactive Wheel • Legal Consent' : 'Ruleta Interactiva • Ley 1581',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      icon: Gift,
      desc: isEn
        ? 'Official gamification module with a prize wheel and monthly draws. Motivates guests to review from their phone to win perks, capturing verified WhatsApp data.'
        : 'Módulo de gamificación con ruleta de premios y sorteos mensuales oficiales. Motiva al cliente a calificar desde su celular para ganar incentivos, capturando su nombre y WhatsApp bajo Habeas Data legal.',
      benefit: isEn
        ? 'Multiplies review volume by 4 and builds your brand’s own verified customer phone database.'
        : 'Multiplica por 4 el volumen de calificaciones y construye una base de datos propia blindada para tu marca.',
      tip: isEn
        ? 'Offer a house appetizer or dessert as a prize; the venue cost is negligible compared to hundreds of registered patrons.'
        : 'Premia un bono o producto de la casa; el costo para el negocio es mínimo frente a cientos de clientes registrados.',
    },
    {
      id: 8,
      title: isEn ? 'Executive Reports & Staff Podium' : 'Reportes Ejecutivos & Podio de Personal',
      shortName: isEn ? '8. Reports' : '8. Reportes',
      tabKey: 'reportes',
      badge: isEn ? 'Staff Audit • ROI Metrics' : 'Auditoría de Personal • Métricas ROI',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      icon: BarChart3,
      desc: isEn
        ? 'Protected revenue metrics against neutralized complaints, net retention rate, server score rankings, and executive PDF report export.'
        : 'Métricas de dinero protegido frente a quejas evitadas, tasa de retención neta, ranking de atención por colaborador y exportación de reportes ejecutivos en PDF.',
      benefit: isEn
        ? 'Accurately know which staff member to reward with bonuses and track the exact ROI of the system.'
        : 'Sabes con precisión matemática a qué colaborador premiar con incentivos y el retorno exacto de tu inversión.',
      tip: isEn
        ? 'Weekly recognition of top servers on the podium immediately boosts overall floor team morale.'
        : 'Reconocer semanalmente al colaborador que lidera el podio eleva la motivación de todo el personal.',
    },
    {
      id: 9,
      title: isEn ? 'Brand & Multi-Location Management' : 'Configuración de Marca & Multi-Sedes',
      shortName: isEn ? '9. Brand & Branches' : '9. Marca & Sedes',
      tabKey: 'perfil',
      badge: isEn ? 'Multi-Branch Switcher & Shifts' : 'Control Multisede & Turnos',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      icon: Building2,
      desc: isEn
        ? 'General administration hub where you manage multiple physical locations, assign shift managers, and configure brand visual identity.'
        : 'Panel de administración general donde gestionas múltiples sedes físicas, asignas administradores de turno independientes y personalizas la identidad visual de tu marca.',
      benefit: isEn
        ? 'Macro control for brand owners and restaurant groups without sharing master credentials.'
        : 'Control macro para propietarios y cadenas de locales sin necesidad de compartir contraseñas maestras.',
      tip: isEn
        ? 'Setting up each location with its dedicated team allows benchmarking consistent hospitality standards.'
        : 'Configurar cada sede con su propio equipo permite evaluar qué sucursal ofrece el servicio más consistente.',
    },
  ];
}

export function getLiveTickerItems(lang: LandingLang) {
  const isEn = lang === 'en';
  if (isEn) {
    return [
      {
        icon: '🍔',
        brand: 'The Artisan Burger Co. (Downtown Venue)',
        event: 'New 5★ review confirmed on Google Maps',
        time: '3 min ago',
        type: 'positive',
        tag: '5.0★ Google Maps',
      },
      {
        icon: '🦷',
        brand: 'Dr. Charles Mendoza • Dentistry',
        event: '2★ complaint contained in private (0% public damage)',
        time: '6 min ago',
        type: 'shield',
        tag: 'Active Shield',
      },
      {
        icon: '🚗',
        brand: 'AutoElite Detailing & Garage',
        event: '+14 New customers registered with full consent',
        time: '11 min ago',
        type: 'data',
        tag: 'Owned List',
      },
      {
        icon: '💇',
        brand: 'D’Luxe Spa & Barbershop',
        event: 'Staff member audited with 5★ for in-venue service',
        time: '16 min ago',
        type: 'positive',
        tag: '5★ Staff Audit',
      },
      {
        icon: '☕',
        brand: 'Bistro La Candelaria',
        event: 'Climbed to #2 ranking in Google Maps local search',
        time: '22 min ago',
        type: 'growth',
        tag: 'Top 3 Local',
      },
    ];
  }
  return [
    {
      icon: '🍔',
      brand: 'La Burguesía Artesanal (Sede Chapinero)',
      event: 'Nueva reseña 5★ confirmada en Google Maps',
      time: 'Hace 3 min',
      type: 'positive',
      tag: '5.0★ Google Maps',
    },
    {
      icon: '🦷',
      brand: 'Dr. Carlos Mendoza • Odontología',
      event: 'Queja de 2★ contenida en privado (0 daño público)',
      time: 'Hace 6 min',
      type: 'shield',
      tag: 'Blindaje Activo',
    },
    {
      icon: '🚗',
      brand: 'AutoElite Taller & Detailing',
      event: '+14 Nuevos clientes registrados con Habeas Data',
      time: 'Hace 11 min',
      type: 'data',
      tag: 'Base Propia',
    },
    {
      icon: '💇',
      brand: 'D’Luxe Spa & Barbería',
      event: 'Colaborador auditado con 5★ por atención en sala',
      time: 'Hace 16 min',
      type: 'positive',
      tag: 'Auditoría 5★',
    },
    {
      icon: '☕',
      brand: 'Bistro La Candelaria',
      event: 'Subió al puesto #2 en búsquedas locales de Maps',
      time: 'Hace 22 min',
      type: 'growth',
      tag: 'Top 3 Local',
    },
  ];
}

export function getShowcaseNiches(lang: LandingLang) {
  const isEn = lang === 'en';
  return [
    {
      id: 'gastronomia',
      name: isEn ? 'Culinary & Bars' : 'Gastronomía & Bares',
      icon: '🍔',
      badge: isEn ? 'Restaurants, Gastro-Pubs, Cafés & Lounges' : 'Restaurantes, Bares, Cafés & Gastrobares',
      headline: isEn
        ? 'Eliminate food or delay complaints before they ever reach the internet'
        : 'Elimina las quejas de platos o demoras antes de que lleguen a internet',
      pain: isEn
        ? 'An upset diner over a cold dish pays the bill, leaves silently, and destroys your weekend reputation with a 1★ Google Maps review.'
        : 'Un cliente enojado por un plato frío o demora paga la cuenta, se va en silencio y destruye tu reputación con 1★ en Google Maps un domingo.',
      solution: isEn
        ? 'The Smart QR on the table gives immediate confidential vent. System alerts management instantly so floor captains resolve issues before the guest departs.'
        : 'El Smart QR en mesa o servilletero le ofrece desahogo inmediato. El sistema te avisa al instante y el capitán de turno soluciona el reclamo antes de que el cliente se levante.',
      metrics: [
        { label: isEn ? 'Average Rating Rise' : 'Subida Promedio', val: '+1.1★' },
        { label: isEn ? 'Contained Complaints' : 'Quejas Contenidas', val: '99.2%' },
        { label: isEn ? 'Monthly Data Capture' : 'Base de Datos Mes', val: isEn ? '+380 guests' : '+380 clientes' },
      ],
      qrDemoText: isEn ? 'Rate your table experience' : 'Califica tu experiencia en mesa',
    },
    {
      id: 'salud',
      name: isEn ? 'Healthcare & Dentistry' : 'Clínicas & Odontología',
      icon: '🦷',
      badge: isEn ? 'Doctors, Dentists, Surgeons & Aesthetics' : 'Médicos, Dentistas, Cirujanos & Estética Médica',
      headline: isEn
        ? 'Multiply private patients through verified direct 5★ recommendations'
        : 'Multiplica pacientes particulares por recomendación directa de 5★',
      pain: isEn
        ? 'In healthcare, a single negative review scares away dozens of high-ticket patients (orthodontics, implants, surgeries).'
        : 'En el sector salud, 1 sola reseña negativa aleja a decenas de pacientes con tratamientos de alto ticket (ortodoncias, cirugías, implantes).',
      solution: isEn
        ? 'After consultation, patients scan the QR at reception and post a 5★ testimonial in 10 seconds validating clinical excellence.'
        : 'Tras finalizar la consulta, el paciente escanea el QR en recepción y en 10 segundos deja su testimonio 5★ verificando la excelencia de tu servicio profesional.',
      metrics: [
        { label: isEn ? 'New Inquiries from Maps' : 'Citas Nuevas Maps', val: '+3.4x' },
        { label: isEn ? 'Trust Index' : 'Índice de Confianza', val: '99.8%' },
        { label: isEn ? 'Legal Compliance' : 'Protección Legal', val: '100% Consent' },
      ],
      qrDemoText: isEn ? 'Rate your medical care today' : 'Califica tu atención médica hoy',
    },
    {
      id: 'estetica',
      name: isEn ? 'Beauty & Wellness Spas' : 'Belleza & Spas',
      icon: '💇',
      badge: isEn ? 'Salons, Barbershops, Spas & Wellness Centers' : 'Salones, Barberías, Spas & Centros de Estética',
      headline: isEn
        ? 'Build an owned customer list to pack appointment books on slow weekdays'
        : 'Crea tu propia base de datos comercial para llenar la agenda los días lentos',
      pain: isEn
        ? 'You serve hundreds of clients monthly but have no organized WhatsApp database to blast seasonal promotions on slow days.'
        : 'Atiendes cientos de clientes al mes pero no tienes sus números de WhatsApp organizados para escribirles promociones en días de baja afluencia.',
      solution: isEn
        ? 'With the VIP prize wheel, clients happily register their phone number under legal compliance to win complimentary perks.'
        : 'Con el módulo de sorteos VIP, tus clientes registran su número felizmente bajo la Ley de Habeas Data para ganar premios de la casa.',
      metrics: [
        { label: isEn ? 'Customers in Database' : 'Clientes en Base', val: '500+ / venue' },
        { label: isEn ? 'Booking Reactivation' : 'Reactivación Agenda', val: '+38%' },
        { label: isEn ? '5★ Reviews' : 'Reseñas 5★', val: isEn ? '+95 / mo' : '+95 / mes' },
      ],
      qrDemoText: isEn ? 'Enter the beauty draw' : 'Participa en el sorteo de belleza',
    },
    {
      id: 'automotriz',
      name: isEn ? 'Automotive & Detailing' : 'Automotriz & Talleres',
      icon: '🚗',
      badge: isEn ? 'Auto Garages, Detailing Centers & Dealerships' : 'Talleres Mecánicos, Detailing & Concesionarios',
      headline: isEn
        ? 'Rank #1 in your city and win corporate fleet maintenance contracts'
        : 'Posiciónate de #1 en tu ciudad y gana contratos corporativos de flotas',
      pain: isEn
        ? 'Car owners distrust unknown mechanics unless backed by an avalanche of stellar reviews and real workshop photos.'
        : 'Los conductores desconfían de los talleres mecánicos desconocidos a menos que tengan una avalancha de reseñas impecables y fotos reales.',
      solution: isEn
        ? 'Upon handing over car keys, customers scan the Smart QR to confirm satisfaction on Google Maps, building unbeatable authority.'
        : 'Al entregar las llaves del vehículo, el cliente escanea el QR y confirma su satisfacción en Google Maps, generando autoridad comercial insuperable.',
      metrics: [
        { label: isEn ? 'Local Search Rank' : 'Posición Local', val: isEn ? 'Top 1 in City' : 'Top 1 en Ciudad' },
        { label: isEn ? 'Garage Inflow' : 'Tráfico de Taller', val: '+45%' },
        { label: isEn ? 'Private Containment' : 'Contención Privada', val: '100%' },
      ],
      qrDemoText: isEn ? 'Rate your vehicle handover' : 'Valora la entrega de tu vehículo',
    },
    {
      id: 'hoteleria',
      name: isEn ? 'Hotels & Hospitality' : 'Hoteles & Hospedaje',
      icon: '🏨',
      badge: isEn ? 'Boutique Hotels, Glampings & Luxury Resorts' : 'Hoteles Boutique, Glampings & Alojamientos',
      headline: isEn
        ? 'Increase direct bookings without relying on high OTA commissions'
        : 'Aumenta tus reservas directas sin depender de las comisiones de Booking',
      pain: isEn
        ? 'Third-party OTA commissions eat up to 20% of every night, and minor room details quickly turn into public negative reviews.'
        : 'Las comisiones de plataformas intermediarias te quitan hasta un 20% de cada noche, y cualquier detalle en habitación termina en queja pública.',
      solution: isEn
        ? 'During check-out, guests rate their stay. Minor feedback is handled in private; delighted guests catapult your 5★ global rank.'
        : 'Durante el check-out, el huésped califica. Si hubo algún detalle, se atiende privadamente; si fue perfecto, catapulta tu perfil internacional 5★.',
      metrics: [
        { label: isEn ? 'Commission Savings' : 'Ahorro Comisiones', val: isEn ? 'Up to 20%' : 'Hasta 20%' },
        { label: isEn ? 'Organic Google Guests' : 'Turistas de Google', val: '+52%' },
        { label: isEn ? 'Global Reputation' : 'Reputación Global', val: '4.9★' },
      ],
      qrDemoText: isEn ? 'Rate your stay with us' : 'Califica tu estancia con nosotros',
    },
  ];
}

export function getFaqs(lang: LandingLang) {
  const isEn = lang === 'en';
  if (isEn) {
    return [
      {
        q: 'Does Google penalize or ban the use of this system?',
        a: 'Not at all. Prestigia strictly complies with official Google Maps guidelines and international data protection laws (GDPR, CCPA). Satisfied customers who post reviews do so directly from their own verified Google accounts voluntarily and legitimately.',
      },
      {
        q: 'Do my guests or staff need to install any mobile apps?',
        a: 'Zero apps required. Everything runs instantly via standard phone cameras and mobile web browsers. Scanning the Smart QR with any iOS or Android smartphone loads the experience in less than 1 second.',
      },
      {
        q: 'How does 1 to 3-star complaint containment work?',
        a: 'When a guest rates 1, 2, or 3 stars, the Google Maps link is kept hidden. An internal feedback screen opens, triggering an immediate audible/visual alert inside your Client Portal. Management resolves the issue at the table before the customer leaves.',
      },
      {
        q: 'How long does onboarding and technical setup take?',
        a: 'Full setup is completed within 48 business hours. We configure your business listing, customize brand materials, generate your vector Smart QRs, and train your management team via private onboarding.',
      },
      {
        q: 'Are there forced long-term contracts or lock-in penalties?',
        a: 'No forced lock-in contracts. We believe in earning your business through measurable monthly ROI. You can pause or adjust your plan with standard 30-day notice without penalties.',
      },
      {
        q: 'How does customer phone number data collection work legally?',
        a: 'Patrons willingly register their name and WhatsApp to participate in official VIP monthly draws or spin the prize wheel under explicit privacy policy consent. This builds your brand’s own direct marketing asset.',
      },
      {
        q: 'How does multi-location management work for restaurant chains or franchises?',
        a: 'From the Client Portal dock, brand directors toggle between specific locations or access the consolidated Macro view to compare staff performance and overall reputation across all venues.',
      },
    ];
  }
  return [
    {
      q: '¿Google penaliza o bloquea el uso de este sistema?',
      a: 'En absoluto. Prestigia cumple al 100% con las directrices oficiales de Google Maps y las normativas internacionales de protección de datos (RGPD y Ley 1581 de Habeas Data). Los clientes satisfechos que publican su opinión lo hacen directamente desde su propia cuenta de Google de forma 100% legítima y voluntaria.',
    },
    {
      q: '¿Mis clientes o mis empleados tienen que descargar alguna aplicación?',
      a: 'Cero aplicaciones. Todo funciona de forma instantánea a través de la cámara del celular y el navegador web. Al escanear el Smart QR con cualquier teléfono (iPhone o Android), la experiencia carga en menos de 1 segundo.',
    },
    {
      q: '¿Cómo funciona la contención de quejas de 1 a 3 estrellas?',
      a: 'Cuando un cliente marca 1, 2 o 3 estrellas, el sistema oculta Google Maps y abre una pantalla interna confidencial. En ese mismo instante se genera una alerta sonora y visual en tu Portal Clientes para que el administrador atienda al comensal en mesa antes de que se marche.',
    },
    {
      q: '¿Cuánto tiempo toma la instalación y puesta en marcha?',
      a: 'El despliegue técnico toma menos de 48 horas hábiles. Configuramos tu ficha, personalizamos tu marca, generamos tus artes Smart QR en alta resolución y capacitamos a tu equipo en una sesión ejecutiva privada.',
    },
    {
      q: '¿Hay contratos de permanencia forzosa o penalidades?',
      a: 'Cero contratos forzosos. Creemos en retenerte por los resultados financieros que ves mes a mes. Puedes cancelar o pausar el servicio en cualquier momento con un aviso de 30 días sin cargos ocultos.',
    },
    {
      q: '¿Cómo funciona la captura legal de datos de clientes?',
      a: 'Los comensales ingresan su nombre y WhatsApp para participar en la ruleta de premios o sorteos VIP bajo autorización explícita de tratamiento de datos. Esto construye una base de datos propia blindada para tu negocio.',
    },
    {
      q: '¿Cómo funciona el control multisede para cadenas y franquicias?',
      a: 'Desde el panel central conmutas entre sucursales individuales o activas la vista "Todas las Sedes" para comparar el podio de atención de meseros y la calificación promedio entre tus diferentes locales.',
    },
  ];
}

export interface SuccessCase {
  id: string;
  country: string;
  countryCode: string;
  flag: string;
  emoji: string;
  brand: string;
  city: string;
  category: string;
  badgeStyle: string;
  quote: string;
  author: string;
  authorRole: string;
  metricVal: string;
  metricLabel: string;
  metricColor: string;
}

export function getSuccessCases(lang: LandingLang): SuccessCase[] {
  const isEn = lang === 'en';
  return [
    {
      id: 'la-burguesia-co',
      country: 'Colombia',
      countryCode: 'co',
      flag: '🇨🇴',
      emoji: '🍔',
      brand: 'La Burguesía Artesanal',
      city: isEn ? 'Bogota & Medellin, Colombia' : 'Bogotá & Medellín, Colombia',
      category: isEn ? 'Gourmet Gastrobar • 2 Locations' : 'Gastrobar Gourmet • 2 Sedes',
      badgeStyle: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      quote: isEn
        ? 'Prestigia intercepted over 120 private table complaints before they reached Google Maps. We climbed from 3.8★ to 4.9★ in 5 months, safeguarding revenue across both locations.'
        : 'Prestigia interceptó más de 120 quejas privadas en mesa antes de que salieran a Google Maps. Subimos de 3.8★ a 4.9★ en 5 meses y blindamos la facturación de nuestros dos restaurantes.',
      author: 'Carlos Gómez',
      authorRole: isEn ? 'Founder & Owner' : 'Titular & Fundador',
      metricVal: '4.9★',
      metricLabel: 'Google Maps',
      metricColor: 'text-emerald-400',
    },
    {
      id: 'dr-carlos-mendoza-co',
      country: 'Colombia',
      countryCode: 'co',
      flag: '🇨🇴',
      emoji: '🦷',
      brand: 'Dr. Carlos Mendoza • Odontología',
      city: 'Bogotá D.C., Colombia',
      category: isEn ? 'Specialized Healthcare Clinic' : 'Salud & Consulta Especializada',
      badgeStyle: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      quote: isEn
        ? 'In healthcare, one bad review is fatal for acquiring private patients. With the Smart QR at front desk, satisfied patients leave 5 stars and I tripled booked appointments.'
        : 'En el sector salud una mala reseña es letal para conseguir nuevos pacientes. Con el Smart QR en recepción mis pacientes satisfechos me dejan 5 estrellas y tripliqué las citas agendadas.',
      author: 'Dr. Carlos Mendoza',
      authorRole: isEn ? 'Surgeon & Specialist' : 'Cirujano & Especialista',
      metricVal: '+3.4x',
      metricLabel: isEn ? 'New Inquiries' : 'Citas Nuevas',
      metricColor: 'text-blue-400',
    },
    {
      id: 'miami-prime-us',
      country: 'USA',
      countryCode: 'us',
      flag: '🇺🇸',
      emoji: '🥩',
      brand: 'Miami Prime Steakhouse',
      city: 'Miami Beach, Florida (USA)',
      category: isEn ? 'Fine Steaks & VIP Dining' : 'Cortes Finos & VIP Dining',
      badgeStyle: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      quote: isEn
        ? 'In South Beach, international visitors decide where to dine strictly via Google Maps. Prestigia placed us in the local Top 3 and we attract global diners daily.'
        : 'En South Beach los turistas internacionales eligen dónde cenar basándose estrictamente en Google Maps. Prestigia nos posicionó en el Top 3 local y captamos comensales extranjeros a diario.',
      author: 'David Miller',
      authorRole: 'General Manager',
      metricVal: '+48%',
      metricLabel: isEn ? 'Tourist Diners' : 'Comensales Turistas',
      metricColor: 'text-emerald-400',
    },
    {
      id: 'apex-dental-us',
      country: 'USA',
      countryCode: 'us',
      flag: '🇺🇸',
      emoji: '✨',
      brand: 'Apex Dental & Aesthetics',
      city: 'Orlando, Florida (USA)',
      category: isEn ? 'Aesthetic & Family Dentistry' : 'Odontología & Estética Dental',
      badgeStyle: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
      quote: isEn
        ? 'Any in-clinic delay previously turned into a 1-star web complaint. With Prestigia, we settle feedback privately with immediate perks. We rose to 4.93★, leading Orlando.'
        : 'Cualquier demora en sala antes se convertía en 1 estrella en internet. Con Prestigia resolvemos la queja en privado con un beneficio inmediato. Subimos a 4.93★ y somos líderes en Orlando.',
      author: 'Dr. Sarah Jenkins',
      authorRole: isEn ? 'Medical Director' : 'Directora Médica',
      metricVal: '4.93★',
      metricLabel: isEn ? 'Top 1 in Orlando' : 'Top 1 en Orlando',
      metricColor: 'text-amber-400',
    },
    {
      id: 'taberna-del-mar-es',
      country: isEn ? 'Europe' : 'Europa',
      countryCode: 'es',
      flag: '🇪🇸',
      emoji: '🍷',
      brand: 'Taberna & Marisquería del Mar',
      city: isEn ? 'Madrid & Valencia (Spain)' : 'Madrid & Valencia (España)',
      category: isEn ? 'Mediterranean Dining • 3 Venues' : 'Restauración Mediterránea • 3 Sedes',
      badgeStyle: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      quote: isEn
        ? 'Multi-location architecture lets us audit server service quality on every shift. During summer, we multiplied 5★ reviews by 310% without paying for ads.'
        : 'La arquitectura multi-sede nos permite auditar la calidad del servicio de los camareros en cada turno. Durante el verano multiplicamos las opiniones de 5★ un 310% sin pagar publicidad.',
      author: 'Javier Montes',
      authorRole: isEn ? 'Chef & Proprietor' : 'Propietario & Chef',
      metricVal: '+310%',
      metricLabel: isEn ? 'Verified 5★ Reviews' : 'Reseñas 5★ Verificadas',
      metricColor: 'text-emerald-400',
    },
    {
      id: 'clinique-royale-es',
      country: isEn ? 'Europe' : 'Europa',
      countryCode: 'es',
      flag: '🇪🇸',
      emoji: '💎',
      brand: 'Clinique Esthétique Royale',
      city: isEn ? 'Barcelona (Spain)' : 'Barcelona (España)',
      category: isEn ? 'Aesthetic Medicine & VIP Spa' : 'Medicina Estética & Spa VIP',
      badgeStyle: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      quote: isEn
        ? 'Our affluent clientele values discretion immensely. The private channel shielded us from public crises and ignited high-ticket treatment bookings.'
        : 'Nuestros clientes de alto poder adquisitivo valoran enormemente la discreción. El canal privado nos salvó de crisis reputacionales y disparó las reservas para tratamientos premium.',
      author: 'Elena Puig',
      authorRole: isEn ? 'Co-Founder' : 'Socia Fundadora',
      metricVal: '+2.8x',
      metricLabel: isEn ? 'VIP Treatments' : 'Tratamientos VIP',
      metricColor: 'text-purple-400',
    },
    {
      id: 'bistro-patagonia-cl',
      country: 'Chile',
      countryCode: 'cl',
      flag: '🇨🇱',
      emoji: '🥘',
      brand: 'Bistró Patagonia & Vinos',
      city: 'Santiago & Viña del Mar (Chile)',
      category: isEn ? 'Signature Culinary • 2 Venues' : 'Gastronomía de Autor • 2 Sedes',
      badgeStyle: 'text-red-400 bg-red-500/10 border-red-500/30',
      quote: isEn
        ? 'In Providencia, competition is fierce. We surged from #18 to Top 3 on Google Maps in just 90 days. Diners scan the QR enthusiastically to enter our house giveaway.'
        : 'En Providencia la competencia es implacable. Pasamos del puesto #18 al Top 3 en Google Maps en solo 90 días. Los clientes escanean el QR felices para participar en el sorteo de la casa.',
      author: 'Matías Undurraga',
      authorRole: isEn ? 'Head of Operations' : 'Gerente de Operaciones',
      metricVal: 'Top 3',
      metricLabel: 'Santiago de Chile',
      metricColor: 'text-amber-400',
    },
    {
      id: 'autoklass-cl',
      country: 'Chile',
      countryCode: 'cl',
      flag: '🇨🇱',
      emoji: '🏎️',
      brand: 'AutoKlass Detailing & Taller',
      city: 'Las Condes, Santiago (Chile)',
      category: isEn ? 'Luxury Automotive & Detailing' : 'Automotriz & Detailing de Lujo',
      badgeStyle: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      quote: isEn
        ? 'With the VIP giveaway, we built our own database of 650 luxury vehicle owners. Sending a direct WhatsApp broadcast filled our workshop slots within hours.'
        : 'Con el sorteo VIP construimos una base de datos propia de 650 clientes con autos de gama alta. Al enviar una campaña directa por WhatsApp llenamos los cupos de mantenimiento en horas.',
      author: 'Rodrigo Sanhueza',
      authorRole: isEn ? 'General Manager' : 'Gerente General',
      metricVal: '650+',
      metricLabel: isEn ? 'Owned WhatsApp List' : 'Base Propia WhatsApp',
      metricColor: 'text-emerald-400',
    },
    {
      id: 'peninsula-sky-pa',
      country: isEn ? 'Panama' : 'Panamá',
      countryCode: 'pa',
      flag: '🇵🇦',
      emoji: '🍸',
      brand: 'Península Sky Lounge',
      city: isEn ? 'Panama City (Panama)' : 'Ciudad de Panamá (Panamá)',
      category: isEn ? 'Rooftop Lounge & Cocktails' : 'Rooftop & Coctelería Casco Antiguo',
      badgeStyle: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      quote: isEn
        ? 'In Casco Antiguo, diplomats and tourists pick venues via Google Maps. Prestigia sustains us at 4.95★ and protected our bar from complaints over music volume or delays.'
        : 'En Casco Antiguo los diplomáticos y turistas deciden su visita por Google Maps. Prestigia nos sostiene en 4.95★ y blindó nuestras barras ante quejas por volumen de música o demoras.',
      author: 'Roberto Chen',
      authorRole: isEn ? 'F&B Director' : 'Director de Alimentos & Bebidas',
      metricVal: '4.95★',
      metricLabel: 'Google Maps Panamá',
      metricColor: 'text-emerald-400',
    },
    {
      id: 'pacific-smile-pa',
      country: isEn ? 'Panama' : 'Panamá',
      countryCode: 'pa',
      flag: '🇵🇦',
      emoji: '🦷',
      brand: 'Pacific Smile Dental Studio',
      city: 'Costa del Este (Panamá)',
      category: isEn ? 'Digital Dentistry & Smile Design' : 'Odontología Digital & Diseño Sonrisa',
      badgeStyle: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      quote: isEn
        ? 'The smart filter caught over 35 private disputes in-clinic this year, keeping our web profile spotless and driving a continuous flow of private patients.'
        : 'El filtro inteligente contuvo más de 35 inconformidades privadas en sala este año, manteniendo nuestra clínica impecable en internet y generando un flujo ininterrumpido de pacientes.',
      author: 'Dr. Ernesto Icaza',
      authorRole: isEn ? 'Clinical Director' : 'Director Clínico',
      metricVal: '100%',
      metricLabel: isEn ? 'Private Containment' : 'Contención Privada',
      metricColor: 'text-cyan-400',
    },
  ];
}
