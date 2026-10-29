'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PrestigiaIcon } from '@/components/PrestigiaIcon';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Star,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Store,
  QrCode,
  MapPin,
  TrendingUp,
  Award,
  Users,
  MessageCircle,
  Phone,
  Check,
  Zap,
  Globe,
  Lock,
  Calendar,
  Clock,
  Target,
  BarChart3,
  HeartHandshake,
  Eye,
  Database,
  Brain,
  Tv,
  Mail,
  Sliders,
  DollarSign,
  ChevronDown,
  X,
  Smartphone,
  Flame,
  HelpCircle,
  Activity,
  Layers,
  Search,
  Gift,
  FileSpreadsheet,
  Rocket,
} from 'lucide-react';
import { PRESTIGIA_NICHES } from '@/lib/types';
import { LANDING_TRANSLATIONS, type LandingLang } from '@/lib/landing-translations';
import {
  getPortalModules,
  getLiveTickerItems,
  getShowcaseNiches,
  getFaqs,
  getSuccessCases,
} from '@/lib/landing-data';

// Live Social Proof Notification Feed Data
const LIVE_TICKER_ITEMS = [
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

// Interactive Niche Showcase Data
const SHOWCASE_NICHES = [
  {
    id: 'gastronomia',
    name: 'Gastronomía & Bares',
    icon: '🍔',
    badge: 'Restaurantes, Bares, Cafés & Gastrobares',
    headline: 'Elimina las quejas de platos o demoras antes de que lleguen a internet',
    pain: 'Un cliente enojado por un plato frío o demora paga la cuenta, se va en silencio y destruye tu reputación con 1★ en Google Maps un domingo.',
    solution: 'El Smart QR en mesa o servilletero le ofrece desahogo inmediato. El sistema te avisa al instante y el capitán de turno soluciona el reclamo antes de que el cliente se levante.',
    metrics: [
      { label: 'Subida Promedio', val: '+1.1★' },
      { label: 'Quejas Contenidas', val: '99.2%' },
      { label: 'Base de Datos Mes', val: '+380 clientes' },
    ],
    qrDemoText: 'Califica tu experiencia en mesa',
  },
  {
    id: 'salud',
    name: 'Clínicas & Odontología',
    icon: '🦷',
    badge: 'Médicos, Dentistas, Cirujanos & Estética Médica',
    headline: 'Multiplica pacientes particulares por recomendación directa de 5★',
    pain: 'En el sector salud, 1 sola reseña negativa aleja a decenas de pacientes con tratamientos de alto ticket (ortodoncias, cirugías, implantes).',
    solution: 'Tras finalizar la consulta, el paciente escanea el QR en recepción y en 10 segundos deja su testimonio 5★ verificando la excelencia de tu servicio profesional.',
    metrics: [
      { label: 'Citas Nuevas Maps', val: '+3.4x' },
      { label: 'Índice de Confianza', val: '99.8%' },
      { label: 'Protección Legal', val: '100% Habeas Data' },
    ],
    qrDemoText: 'Califica tu atención médica hoy',
  },
  {
    id: 'estetica',
    name: 'Belleza & Spas',
    icon: '💇',
    badge: 'Salones, Barberías, Spas & Centros de Estética',
    headline: 'Crea tu propia base de datos comercial para llenar la agenda los días lentos',
    pain: 'Atiendes cientos de clientes al mes pero no tienes sus números de WhatsApp organizados para escribirles promociones en días de baja afluencia.',
    solution: 'Con el módulo de sorteos VIP, tus clientes registran su número felizmente bajo la Ley de Habeas Data para ganar premios de la casa.',
    metrics: [
      { label: 'Clientes en Base', val: '500+ / sede' },
      { label: 'Reactivación Agenda', val: '+38%' },
      { label: 'Reseñas 5★', val: '+95 / mes' },
    ],
    qrDemoText: 'Participa en el sorteo de belleza',
  },
  {
    id: 'automotriz',
    name: 'Automotriz & Talleres',
    icon: '🚗',
    badge: 'Talleres Mecánicos, Detailing & Concesionarios',
    headline: 'Posiciónate de #1 en tu ciudad y gana contratos corporativos de flotas',
    pain: 'Los conductores desconfían de los talleres mecánicos desconocidos a menos que tengan una avalancha de reseñas impecables y fotos reales.',
    solution: 'Al entregar las llaves del vehículo, el cliente escanea el QR y confirma su satisfacción en Google Maps, generando autoridad comercial insuperable.',
    metrics: [
      { label: 'Posición Local', val: 'Top 1 en Ciudad' },
      { label: 'Tráfico de Taller', val: '+45%' },
      { label: 'Contención Privada', val: '100%' },
    ],
    qrDemoText: 'Valora la entrega de tu vehículo',
  },
  {
    id: 'hoteleria',
    name: 'Hoteles & Hospedaje',
    icon: '🏨',
    badge: 'Hoteles Boutique, Glampings & Alojamientos',
    headline: 'Aumenta tus reservas directas sin depender de las comisiones de Booking',
    pain: 'Las comisiones de plataformas intermediarias te quitan hasta un 20% de cada noche, y cualquier detalle en habitación termina en queja pública.',
    solution: 'Durante el check-out, el huésped califica. Si hubo algún detalle, se atiende privadamente; si fue perfecto, catapulta tu perfil internacional 5★.',
    metrics: [
      { label: 'Ahorro Comisiones', val: 'Hasta 20%' },
      { label: 'Turistas de Google', val: '+52%' },
      { label: 'Reputación Global', val: '4.9★' },
    ],
    qrDemoText: 'Califica tu estancia con nosotros',
  },
];

// FAQs Data
const FAQS = [
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
    a: 'Cuando un cliente insatisfecho presiona 1, 2 o 3 estrellas, el sistema oculta el enlace a Google Maps y abre una interfaz confidencial de atención al cliente. La queja entra inmediatamente al Portal Clientes en la Central de Contención, con alerta visual y sonora en tiempo real. Esto evita saturar teléfonos personales o correos, centraliza la trazabilidad en un solo lugar y permite al equipo gestionar y resolver la inconformidad con auditoría completa.',
  },
  {
    q: '¿Puedo conectar varias sedes o franquicias en un mismo panel?',
    a: 'Sí. Prestigia cuenta con arquitectura Multi-Sedes de nivel empresarial. Puedes asignar administradores de turno independientes por punto físico, comparar qué local tiene mejor atención y monitorear el desempeño global de tu marca desde un solo panel maestro.',
  },
  {
    q: '¿Cuánto tiempo tarda la puesta en marcha en mi negocio?',
    a: 'Menos de 24 horas. En nuestra sesión estratégica configuramos la identidad de tu marca, generamos tus Smart QRs de alta resolución listos para imprimir y activamos los accesos para ti y tu equipo.',
  },
];

export interface SuccessCase {
  id: string;
  country: string;
  countryCode: 'co' | 'us' | 'es' | 'cl' | 'pa';
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

const SUCCESS_CASES: SuccessCase[] = [
  // 1. Colombia 1
  {
    id: 'la-burguesia-co',
    country: 'Colombia',
    countryCode: 'co',
    flag: '🇨🇴',
    emoji: '🍔',
    brand: 'La Burguesía Artesanal',
    city: 'Bogotá & Medellín, Colombia',
    category: 'Gastrobar Gourmet • 2 Sedes',
    badgeStyle: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    quote: 'Prestigia interceptó más de 120 quejas privadas en mesa antes de que salieran a Google Maps. Subimos de 3.8★ a 4.9★ en 5 meses y blindamos la facturación de nuestros dos restaurantes.',
    author: 'Carlos Gómez',
    authorRole: 'Titular & Fundador',
    metricVal: '4.9★',
    metricLabel: 'Google Maps',
    metricColor: 'text-emerald-400',
  },
  // 2. Colombia 2
  {
    id: 'dr-carlos-mendoza-co',
    country: 'Colombia',
    countryCode: 'co',
    flag: '🇨🇴',
    emoji: '🦷',
    brand: 'Dr. Carlos Mendoza • Odontología',
    city: 'Bogotá D.C., Colombia',
    category: 'Salud & Consulta Especializada',
    badgeStyle: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    quote: 'En el sector salud una mala reseña es letal para conseguir nuevos pacientes. Con el Smart QR en recepción mis pacientes satisfechos me dejan 5 estrellas y tripliqué las citas agendadas.',
    author: 'Dr. Carlos Mendoza',
    authorRole: 'Cirujano & Especialista',
    metricVal: '+3.4x',
    metricLabel: 'Citas Nuevas',
    metricColor: 'text-blue-400',
  },
  // 3. USA 1
  {
    id: 'miami-prime-us',
    country: 'USA',
    countryCode: 'us',
    flag: '🇺🇸',
    emoji: '🥩',
    brand: 'Miami Prime Steakhouse',
    city: 'Miami Beach, Florida (USA)',
    category: 'Cortes Finos & VIP Dining',
    badgeStyle: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    quote: 'En South Beach los turistas internacionales eligen dónde cenar basándose estrictamente en Google Maps. Prestigia nos posicionó en el Top 3 local y captamos comensales extranjeros a diario.',
    author: 'David Miller',
    authorRole: 'General Manager',
    metricVal: '+48%',
    metricLabel: 'Comensales Turistas',
    metricColor: 'text-emerald-400',
  },
  // 4. USA 2
  {
    id: 'apex-dental-us',
    country: 'USA',
    countryCode: 'us',
    flag: '🇺🇸',
    emoji: '✨',
    brand: 'Apex Dental & Aesthetics',
    city: 'Orlando, Florida (USA)',
    category: 'Odontología & Estética Dental',
    badgeStyle: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    quote: 'Cualquier demora en sala antes se convertía en 1 estrella en internet. Con Prestigia resolvemos la queja en privado con un beneficio inmediato. Subimos a 4.93★ y somos líderes en Orlando.',
    author: 'Dra. Sarah Jenkins',
    authorRole: 'Directora Médica',
    metricVal: '4.93★',
    metricLabel: 'Top 1 en Orlando',
    metricColor: 'text-amber-400',
  },
  // 5. Europa 1 (España)
  {
    id: 'taberna-del-mar-es',
    country: 'Europa',
    countryCode: 'es',
    flag: '🇪🇸',
    emoji: '🍷',
    brand: 'Taberna del Mar',
    city: 'Madrid & Valencia (España)',
    category: 'Restauración Mediterránea • 3 Sedes',
    badgeStyle: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    quote: 'La arquitectura multi-sede nos permite auditar la calidad del servicio de los camareros en cada turno. Durante el verano multiplicamos las opiniones de 5★ un 310% sin pagar publicidad.',
    author: 'Javier Montes',
    authorRole: 'Propietario & Chef',
    metricVal: '+310%',
    metricLabel: 'Reseñas 5★ Verificadas',
    metricColor: 'text-emerald-400',
  },
  // 6. Europa 2 (España)
  {
    id: 'clinique-royale-es',
    country: 'Europa',
    countryCode: 'es',
    flag: '🇪🇸',
    emoji: '💎',
    brand: 'Clinique Esthétique Royale',
    city: 'Barcelona (España)',
    category: 'Medicina Estética & Spa VIP',
    badgeStyle: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    quote: 'Nuestros clientes de alto poder adquisitivo valoran enormemente la discreción. El canal privado nos salvó de crisis reputacionales y disparó las reservas para tratamientos premium.',
    author: 'Elena Puig',
    authorRole: 'Socia Fundadora',
    metricVal: '+2.8x',
    metricLabel: 'Tratamientos VIP',
    metricColor: 'text-purple-400',
  },
  // 7. Chile 1
  {
    id: 'bistro-patagonia-cl',
    country: 'Chile',
    countryCode: 'cl',
    flag: '🇨🇱',
    emoji: '🥘',
    brand: 'Bistró Patagonia & Vinos',
    city: 'Santiago & Viña del Mar (Chile)',
    category: 'Gastronomía de Autor • 2 Sedes',
    badgeStyle: 'text-red-400 bg-red-500/10 border-red-500/30',
    quote: 'En Providencia la competencia es implacable. Pasamos del puesto #18 al Top 3 en Google Maps en solo 90 días. Los clientes escanean el QR felices para participar en el sorteo de la casa.',
    author: 'Matías Undurraga',
    authorRole: 'Gerente de Operaciones',
    metricVal: 'Top 3',
    metricLabel: 'Santiago de Chile',
    metricColor: 'text-amber-400',
  },
  // 8. Chile 2
  {
    id: 'autoklass-cl',
    country: 'Chile',
    countryCode: 'cl',
    flag: '🇨🇱',
    emoji: '🏎️',
    brand: 'AutoKlass Detailing & Taller',
    city: 'Las Condes, Santiago (Chile)',
    category: 'Automotriz & Detailing de Lujo',
    badgeStyle: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    quote: 'Con el sorteo VIP construimos una base de datos propia de 650 clientes con autos de gama alta. Al enviar una campaña directa por WhatsApp llenamos los cupos de mantenimiento en horas.',
    author: 'Rodrigo Sanhueza',
    authorRole: 'Gerente General',
    metricVal: '650+',
    metricLabel: 'Base Propia WhatsApp',
    metricColor: 'text-emerald-400',
  },
  // 9. Panamá 1
  {
    id: 'peninsula-sky-pa',
    country: 'Panamá',
    countryCode: 'pa',
    flag: '🇵🇦',
    emoji: '🍸',
    brand: 'Península Sky Lounge',
    city: 'Ciudad de Panamá (Panamá)',
    category: 'Rooftop & Coctelería Casco Antiguo',
    badgeStyle: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    quote: 'En Casco Antiguo los diplomáticos y turistas deciden su visita por Google Maps. Prestigia nos sostiene en 4.95★ y blindó nuestras barras ante quejas por volumen de música o demoras.',
    author: 'Roberto Chen',
    authorRole: 'Director de Alimentos & Bebidas',
    metricVal: '4.95★',
    metricLabel: 'Google Maps Panamá',
    metricColor: 'text-emerald-400',
  },
  // 10. Panamá 2
  {
    id: 'pacific-smile-pa',
    country: 'Panamá',
    countryCode: 'pa',
    flag: '🇵🇦',
    emoji: '🦷',
    brand: 'Pacific Smile Dental Studio',
    city: 'Costa del Este (Panamá)',
    category: 'Odontología Digital & Diseño Sonrisa',
    badgeStyle: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    quote: 'El filtro inteligente contuvo más de 35 inconformidades privadas en sala este año, manteniendo nuestra clínica impecable en internet y generando un flujo ininterrumpido de pacientes.',
    author: 'Dr. Ernesto Icaza',
    authorRole: 'Director Clínico',
    metricVal: '100%',
    metricLabel: 'Contención Privada',
    metricColor: 'text-cyan-400',
  },
];

// 9 Official Operational Tabs of Prestigia Client Portal in Exact Live Order
const PORTAL_MODULES = [
  {
    id: 1,
    title: 'Central de Contención & Incidentes en Sala',
    shortName: '1. Contención Privada',
    tabKey: 'quejas',
    badge: 'Urgencia en Sala • Cero Saturación',
    badgeColor: 'text-red-400 bg-red-500/10 border-red-500/20',
    icon: MessageCircle,
    desc: 'Bóveda blindada donde quedan retenidas todas las calificaciones de 1, 2 y 3 estrellas. Cero mensajes a WhatsApp ni correos personales para no saturar. Genera alertas sonoras y visuales en la pantalla del local con tickets de auditoría completa para resolver de inmediato.',
    benefit: 'Neutraliza el 100% del daño a la reputación pública en Google Maps antes de que el cliente salga del local.',
    tip: 'Atender el incidente en menos de 15 minutos rescata al 89% de clientes insatisfechos.',
  },
  {
    id: 2,
    title: 'Radar Google Maps & Monitoreo en Vivo',
    shortName: '2. Radar Google',
    tabKey: 'radar',
    badge: 'Google Maps • Tiempo Real',
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    icon: Star,
    desc: 'Monitorea en tiempo real todas las opiniones públicas que ingresan a tu ficha de Google Maps. Muestra la calificación acumulada, conteo de reseñas pendientes y velocidad de respuesta de tu negocio.',
    benefit: 'Supervisión ejecutiva total del prestigio de tu negocio sin tener que entrar manualmente a Google.',
    tip: 'Mantener un flujo regular de reseñas eleva la visibilidad orgánica en búsquedas locales de la zona hasta un 38%.',
  },
  {
    id: 3,
    title: 'Centro de Despacho & Asistente IA',
    shortName: '3. Asistente IA',
    tabKey: 'ia',
    badge: 'Despacho Rápido • Multilingüe',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    icon: Sparkles,
    desc: 'Motor de Inteligencia Artificial que redacta respuestas oficiales personalizadas en 3 tonos estratégicos (Cálido, Corporativo y Promocional) y traduce automáticamente reseñas de turistas escritas en inglés u otros idiomas.',
    benefit: 'Ahorra horas semanales de redacción y miles de dólares en agencias de Community Management.',
    tip: 'El tono Promocional en opiniones 5★ invita al cliente a probar una novedad en su próxima visita.',
  },
  {
    id: 4,
    title: 'Matriz de Sentimiento 360° con IA',
    shortName: '4. Sentimiento 360°',
    tabKey: 'sentimiento',
    badge: 'Exclusivo Élite & Franquicias',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    icon: Brain,
    desc: 'Analítica multidimensional con IA que audita los pilares críticos de la operación: Calidad del Producto, Atención del Personal, Tiempos de Espera, Ambiente e Higiene.',
    benefit: 'Diagnostica la causa raíz de cualquier problema operativo semanas antes de que impacte la facturación.',
    tip: 'Compara las métricas entre turnos para saber qué horarios requieren ajustes o refuerzos en sala.',
  },
  {
    id: 5,
    title: 'Smart QR & Material de Captación',
    shortName: '5. Smart QR',
    tabKey: 'qr',
    badge: 'Material Vectorial de Mesa',
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    icon: QrCode,
    desc: 'Centro de descarga y configuración de los Smart QRs para tu negocio. Exporta códigos vectoriales en alta resolución para habladores de mesa, acrílicos en barra, tarjetas o facturas.',
    benefit: 'El cliente no tiene que descargar ninguna app; escanea con su cámara y carga en menos de 1 segundo.',
    tip: 'Ubicar el Smart QR visible junto al datáfono o en el portacuentas multiplica los escaneos en un 300%.',
  },
  {
    id: 6,
    title: 'Reactivación de Clientes 5★',
    shortName: '6. Reactivar 5★',
    tabKey: 'reactivar',
    badge: 'Fidelización & Recompra',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    icon: Rocket,
    desc: 'Módulo de fidelización exclusivo para clientes que calificaron 4 o 5 estrellas. Permite enviar beneficios exclusivos, novedades de temporada y recordatorios para asegurar su regreso.',
    benefit: 'Convierte comensales y visitantes casuales en clientes frecuentes sin gastar en publicidad de redes sociales.',
    tip: 'Un mensaje con una invitación especial a los 20 días de la primera visita eleva la tasa de recompra un 24%.',
  },
  {
    id: 7,
    title: 'Sorteos VIP & Motor de Ruleta',
    shortName: '7. Sorteos VIP',
    tabKey: 'sorteos',
    badge: 'Ruleta Interactiva • Ley 1581',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    icon: Gift,
    desc: 'Módulo de gamificación con ruleta de premios y sorteos mensuales oficiales. Motiva al cliente a calificar desde su celular para ganar incentivos, capturando su nombre y WhatsApp bajo Habeas Data legal.',
    benefit: 'Multiplica por 4 el volumen de calificaciones y construye una base de datos propia blindada para tu marca.',
    tip: 'Premia un bono o producto de la casa; el costo para el negocio es mínimo frente a cientos de clientes registrados.',
  },
  {
    id: 8,
    title: 'Reportes Ejecutivos & Podio de Personal',
    shortName: '8. Reportes',
    tabKey: 'reportes',
    badge: 'Auditoría de Personal • Métricas ROI',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    icon: BarChart3,
    desc: 'Métricas de dinero protegido frente a quejas evitadas, tasa de retención neta, ranking de atención por colaborador y exportación de reportes ejecutivos en PDF.',
    benefit: 'Sabes con precisión matemática a qué colaborador premiar con incentivos y el retorno exacto de tu inversión.',
    tip: 'Reconocer semanalmente al colaborador que lidera el podio eleva la motivación de todo el personal.',
  },
  {
    id: 9,
    title: 'Configuración de Marca & Multi-Sedes',
    shortName: '9. Marca & Sedes',
    tabKey: 'perfil',
    badge: 'Control Multisede & Turnos',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    icon: Building2,
    desc: 'Panel de administración general donde gestionas múltiples sedes físicas, asignas administradores de turno independientes y personalizas la identidad visual de tu marca.',
    benefit: 'Control macro para propietarios y cadenas de locales sin necesidad de compartir contraseñas maestras.',
    tip: 'Configurar cada sede con su propio equipo permite evaluar qué sucursal ofrece el servicio más consistente.',
  },
];

export default function HomePage() {
  // Strategic Call Booking Form State
  const [leadForm, setLeadForm] = useState({
    fullName: '',
    businessName: '',
    category: PRESTIGIA_NICHES[0].label,
    phone: '',
    city: 'Bogotá',
    branchCount: '1',
    preferredTime: 'Mañana (9:00 AM - 12:00 PM)',
    primaryGoal: 'Aumentar clientes y reseñas 5★ en Google Maps',
    notes: '',
  });
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  // Phone Simulator Interactive State
  const [phoneRating, setPhoneRating] = useState<number>(5);
  const [phoneExperienceState, setPhoneExperienceState] = useState<'stars' | 'google_maps' | 'private_containment'>('google_maps');
  const [privateComment, setPrivateComment] = useState('');
  const [privateCommentSent, setPrivateCommentSent] = useState(false);

  // Dynamic Ticker State with Natural Waiting Interval
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isTickerVisible, setIsTickerVisible] = useState(false);
  const [tickerDismissed, setTickerDismissed] = useState(false);

  // Niche Selector Tab State
  const [activeNicheId, setActiveNicheId] = useState('gastronomia');

  // Interactive ROI Calculator State
  const [roiMonthlyClients, setRoiMonthlyClients] = useState<number>(950);
  const [roiAverageTicket, setRoiAverageTicket] = useState<number>(35);

  // Before vs After Comparison Switch
  const [comparisonMode, setComparisonMode] = useState<'with' | 'without'>('with');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Interactive 8-Module Portal Walkthrough State
  const [activePortalTab, setActivePortalTab] = useState<number>(0);

  // Testimonials Infinite Carousel Glide Pause on Touch / Interaction
  const [isGlidePaused, setIsGlidePaused] = useState(false);

  // Bilingual Language State with LocalStorage Persistence
  const [lang, setLang] = useState<LandingLang>('es');

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('prestigia_landing_lang') as LandingLang | null;
      if (savedLang === 'es' || savedLang === 'en') {
        setLang(savedLang);
      }
    } catch {}
  }, []);

  const handleLanguageChange = (newLang: LandingLang) => {
    setLang(newLang);
    try {
      localStorage.setItem('prestigia_landing_lang', newLang);
    } catch {}
    trackAction(`lang_switch_${newLang}`);
  };

  const t = LANDING_TRANSLATIONS[lang];
  const isEn = lang === 'en';
  const portalModules = getPortalModules(lang);
  const liveTickerList = getLiveTickerItems(lang);
  const showcaseNiches = getShowcaseNiches(lang);
  const faqsList = getFaqs(lang);
  const successCases = getSuccessCases(lang);

  // Realistic Social Proof Timing (Shows 6s, then hides and waits 18s between toasts)
  useEffect(() => {
    if (tickerDismissed) return;

    let hideTimeout: NodeJS.Timeout;
    let showTimeout: NodeJS.Timeout;

    // Show initial toast after 4 seconds of reading
    showTimeout = setTimeout(() => {
      setIsTickerVisible(true);
      hideTimeout = setTimeout(() => {
        setIsTickerVisible(false);
      }, 6000);
    }, 4000);

    // Periodic interval: repeats every 24s (6s visible + 18s pause)
    const cycleInterval = setInterval(() => {
      if (tickerDismissed) return;
      setTickerIndex((prev) => (prev + 1) % liveTickerList.length);
      setIsTickerVisible(true);

      hideTimeout = setTimeout(() => {
        setIsTickerVisible(false);
      }, 6000);
    }, 24000);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
      clearInterval(cycleInterval);
    };
  }, [tickerDismissed, liveTickerList.length]);

  // Silent Analytics Tracking on Load
  useEffect(() => {
    try {
      const isMobile = /mobile|iphone|android/i.test(navigator.userAgent);
      const isTablet = /ipad|tablet/i.test(navigator.userAgent);
      const deviceType = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';

      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: '/',
          referrer: document.referrer || 'Directo',
          userAgent: navigator.userAgent,
          action: 'pageview_landing',
        }),
      }).catch(() => {});
    } catch {}
  }, []);

  // Track button click
  const trackAction = (actionName: string) => {
    try {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: '/',
          action: actionName,
        }),
      }).catch(() => {});
    } catch {}
  };

  // Handle Interactive Phone Star Selection
  const handlePhoneStarClick = (rating: number) => {
    setPhoneRating(rating);
    setPrivateCommentSent(false);
    if (rating >= 4) {
      setPhoneExperienceState('google_maps');
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch {}
    } else {
      setPhoneExperienceState('private_containment');
    }
    trackAction(`phone_sim_star_${rating}`);
  };

  // Submit Strategic Call Booking Form
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadError(null);

    if (!leadForm.fullName.trim() || !leadForm.businessName.trim() || !leadForm.phone.trim()) {
      setLeadError('Por favor completa tu nombre, el nombre de tu negocio y tu WhatsApp.');
      return;
    }

    setSubmittingLead(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leadForm,
          notes: `[Horario preferido: ${leadForm.preferredTime}] • [Meta: ${leadForm.primaryGoal}] ${leadForm.notes ? `• ${leadForm.notes}` : ''}`,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setLeadSuccess(true);
        trackAction('lead_submitted_success');
        try {
          confetti({ particleCount: 110, spread: 90, origin: { y: 0.5 } });
        } catch {}
      } else {
        setLeadError(data.error || 'Ocurrió un error al procesar tu solicitud.');
      }
    } catch (err) {
      setLeadError('Error de conexión con el servidor. Intenta nuevamente.');
    } finally {
      setSubmittingLead(false);
    }
  };

  // ROI Calculated Metrics
  const estimatedMonthlyTurnover = roiMonthlyClients * roiAverageTicket;
  const estimatedLostClientsFromBadReviews = Math.round(roiMonthlyClients * 0.18);
  const estimatedLostMoneyMonthly = Math.round(estimatedLostClientsFromBadReviews * roiAverageTicket);
  const estimatedRetainedWithPrestigia = Math.round(estimatedLostMoneyMonthly * 0.82);

  const activeNiche = showcaseNiches.find((n) => n.id === activeNicheId) || showcaseNiches[0];
  const currentTicker = liveTickerList[tickerIndex] || liveTickerList[0];



  return (
    <div className="min-h-screen w-full max-w-full bg-[#06080E] text-slate-100 selection:bg-amber-500/25 selection:text-amber-200 font-sans relative overflow-x-clip">
      {/* ============================================================== */}
      {/* 0. AURORA DYNAMIC GLOW BACKGROUNDS */}
      {/* ============================================================== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-amber-500/10 blur-[130px] rounded-full animate-pulse-glow" />
        <div className="absolute top-[900px] -right-40 w-[600px] h-[600px] bg-emerald-500/10 blur-[140px] rounded-full" />
        <div className="absolute top-[2200px] -left-40 w-[700px] h-[700px] bg-amber-500/8 blur-[150px] rounded-full" />
        <div className="absolute top-[3600px] right-10 w-[650px] h-[650px] bg-blue-600/10 blur-[140px] rounded-full" />
      </div>

      {/* Grid Pattern Overlay for High-Tech Enterprise Feel */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
        style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '32px 32px' }}
      />

      {/* ============================================================== */}
      {/* 100% FIXED HEADER (Top Live Strip + Main Navigation Bar) */}
      {/* ============================================================== */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full shadow-2xl shadow-black/80 transition-all">
        {/* 1. TOP LIVE STATUS STRIP */}
        <div className="bg-[#090D17]/95 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 lg:px-12 py-1.5 sm:py-2 text-[11px] font-semibold text-slate-300">
          <div className="w-full max-w-[1700px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] sm:text-[11px] shrink-0">
                {t.topBar.liveStatus}
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-slate-400 truncate hidden sm:inline">
                {t.topBar.coverage}
              </span>
            </div>

            <div className="flex items-center gap-3.5 text-[11px] font-mono shrink-0">
              {/* Bilingual Language Switcher Toggle */}
              <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-0.5 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => handleLanguageChange('es')}
                  className={`px-2 py-0.5 rounded-lg transition cursor-pointer ${lang === 'es' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'}`}
                  title="Cambiar a Español"
                >
                  🇪🇸 ES
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('en')}
                  className={`px-2 py-0.5 rounded-lg transition cursor-pointer ${lang === 'en' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'}`}
                  title="Switch to English"
                >
                  🇺🇸 EN
                </button>
              </div>

              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{t.topBar.rating}</span>
              </span>
              <a
                href="https://wa.me/573058314049?text=Hola%20Prestigia,%20me%20gustar%C3%ADa%20consultar%20sobre%20el%20blindaje%20comercial"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition hidden md:flex items-center gap-1.5"
              >
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>{t.topBar.support}</span>
              </a>
            </div>
          </div>
        </div>

        {/* 2. TOP NAVBAR — EXPANSIVE FULL-WIDTH LAYOUT */}
        <header className="backdrop-blur-2xl bg-[#06080E]/95 border-b border-slate-800/80 px-4 sm:px-8 lg:px-12 py-2.5 sm:py-3 transition-all">
          <div className="w-full max-w-[1700px] mx-auto flex items-center justify-between gap-4">
            {/* Brand Logo (Clean, sleek, non-wrapping) */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-indigo-800 flex items-center justify-center p-2 shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform duration-300">
                <PrestigiaIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black tracking-widest text-white">
                  PRESTIGIA
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold tracking-wider uppercase hidden 2xl:inline-block">
                  5★ SUITE
                </span>
              </div>
            </Link>

            {/* Navigation Links with adaptive breathing room */}
            <nav className="hidden xl:flex items-center gap-3.5 2xl:gap-6 text-[11px] 2xl:text-xs font-semibold text-slate-300">
              <a href="#como-funciona" className="hover:text-amber-400 transition whitespace-nowrap">{t.nav.howItWorks}</a>
              <a href="#simulador" className="hover:text-amber-400 transition whitespace-nowrap">{t.nav.simulator}</a>
              <a href="#calculadora-roi" className="hover:text-amber-400 transition whitespace-nowrap">{t.nav.roiCalc}</a>
              <a href="#tour-sistema" className="hover:text-amber-400 transition whitespace-nowrap">{t.nav.systemTour}</a>
              <a href="#auditor-preview" className="hover:text-cyan-300 transition whitespace-nowrap text-cyan-400 flex items-center gap-1 font-bold">
                <Search className="w-3 h-3 text-cyan-400" />
                <span>{t.nav.auditor}</span>
              </a>
              <a href="#planes" className="hover:text-amber-400 transition whitespace-nowrap">{t.nav.plans}</a>
              <Link
                href="/dossier"
                className="hover:text-amber-300 transition whitespace-nowrap text-amber-400/90 flex items-center gap-1 font-bold"
              >
                <FileSpreadsheet className="w-3 h-3 text-amber-400" />
                <span>{t.nav.dossier}</span>
              </Link>
            </nav>

            {/* Action CTAs */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <Link
                href="/auditor"
                onClick={() => trackAction('click_auditor_from_navbar')}
                className="px-3 sm:px-4 py-2 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 font-bold text-xs border border-cyan-500/40 transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">{t.nav.auditBusiness}</span>
                <span className="sm:hidden">{t.nav.auditor}</span>
              </Link>

              <Link
                href="/portal"
                onClick={() => trackAction('click_portal_from_navbar')}
                className="px-3 sm:px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700/80 transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">{t.nav.clientPortal}</span>
                <span className="sm:hidden">Portal</span>
              </Link>

              <a
                href="#agendar"
                onClick={() => trackAction('click_agendar_navbar')}
                className="px-3.5 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer flex items-center gap-1.5 animate-shimmer whitespace-nowrap"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{t.nav.bookCall}</span>
              </a>
            </div>
          </div>
        </header>
      </div>

      {/* Spacer so page content flows cleanly below the fixed header */}
      <div className="h-[94px] sm:h-[102px]" aria-hidden="true" />

      {/* ============================================================== */}
      {/* 3. HERO SECTION — EXPANSIVE FULL-WIDTH DUAL COLUMN */}
      {/* ============================================================== */}
      <section className="relative z-10 pt-10 pb-16 sm:pt-16 sm:pb-24 px-6 sm:px-12 lg:px-20 max-w-[1700px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-center">
          {/* Left Column: Value Pitch & Conversion */}
          <div className="lg:col-span-7 xl:col-span-7 text-left space-y-7">
            {/* Top Elite Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide uppercase shadow-lg shadow-amber-500/5">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{t.hero.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.08]">
              {t.hero.headlineStart}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 underline decoration-amber-500/40 decoration-wavy">
                {t.hero.headlineHighlight}
              </span>{' '}
              {t.hero.headlineEnd}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
              {t.hero.subhead}
            </p>

            {/* Key Micro-Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 max-w-3xl">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0D121E] border border-slate-800 text-xs text-slate-200 shadow-md">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                </div>
                <span><strong>{t.hero.pillar1}</strong></span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0D121E] border border-slate-800 text-xs text-slate-200 shadow-md">
                <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                </div>
                <span><strong>{t.hero.pillar2}</strong></span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0D121E] border border-slate-800 text-xs text-slate-200 shadow-md">
                <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
                  <Database className="w-4 h-4 text-purple-400" />
                </div>
                <span><strong>{t.hero.pillar3}</strong></span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-3 max-w-2xl">
              <a
                href="#agendar"
                onClick={() => trackAction('click_hero_agendar')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer animate-shimmer whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 text-slate-950" />
                <span>{t.hero.ctaBook}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="https://wa.me/573058314049?text=Hola%20Prestigia,%20quiero%20conocer%20c%C3%B3mo%20blindar%20mi%20negocio%20con%20el%20sistema%20de%20rese%C3%B1as%205%E2%98%85"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAction('click_hero_whatsapp')}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700/80 transition flex items-center justify-center gap-2 cursor-pointer shadow-md whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>{t.hero.ctaWhatsapp}</span>
              </a>
            </div>

            {/* Direct Auditor Quick Access Banner in Hero */}
            <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400">{t.hero.auditorPrompt}</span>
              <Link
                href="/auditor"
                onClick={() => trackAction('click_hero_auditor_link')}
                className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 group/audit underline underline-offset-4 decoration-cyan-500/40 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-cyan-400 group-hover/audit:scale-110 transition-transform" />
                <span>{t.hero.auditorLink}</span>
              </Link>
            </div>

            {/* Social Proof Trust Footer */}
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <div className="flex -space-x-2">
                <span className="w-8 h-8 rounded-full bg-amber-500/20 border-2 border-slate-900 flex items-center justify-center text-xs">🍔</span>
                <span className="w-8 h-8 rounded-full bg-blue-500/20 border-2 border-slate-900 flex items-center justify-center text-xs">🦷</span>
                <span className="w-8 h-8 rounded-full bg-purple-500/20 border-2 border-slate-900 flex items-center justify-center text-xs">🚗</span>
                <span className="w-8 h-8 rounded-full bg-emerald-500/20 border-2 border-slate-900 flex items-center justify-center text-xs">💇</span>
              </div>
              <p>
                {t.hero.socialProof}
              </p>
            </div>
          </div>

          {/* Right Column: Titanium 3D Smartphone Interactive Simulator */}
          <div id="simulador" className="scroll-mt-36 lg:col-span-5 xl:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[340px] animate-float">
              {/* Outer Glow on Phone */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500/30 via-indigo-500/30 to-purple-500/30 rounded-[44px] blur-xl opacity-70" />

              {/* Physical Titanium Phone Frame */}
              <div className="relative rounded-[40px] bg-[#0A0D16] border-[6px] border-[#22293A] shadow-2xl p-3.5 overflow-hidden">
                {/* Dynamic Island / Notch */}
                <div className="w-24 h-4 bg-black rounded-full mx-auto mb-3 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#1A2234] ml-auto mr-2" />
                </div>

                {/* Smartphone Display Content */}
                <div className="rounded-[28px] bg-gradient-to-b from-[#0F1424] to-[#090D18] border border-slate-800 p-4 min-h-[440px] flex flex-col justify-between text-center relative overflow-hidden">
                  {/* Subtle Brand Watermark */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 font-bold text-slate-300">
                      <PrestigiaIcon className="w-3.5 h-3.5 text-amber-400" />
                      {t.phoneSim.watermark}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold">
                      {t.phoneSim.tableTag}
                    </span>
                  </div>

                  {/* Main Screen Body */}
                  <div className="py-3">
                    <span className="text-3xl">🍔</span>
                    <h3 className="text-sm font-black text-white mt-1">{t.phoneSim.venueName}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">{t.phoneSim.venueSub}</p>

                    <div className="my-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <p className="text-[11px] font-bold text-slate-200">
                        {t.phoneSim.prompt}
                      </p>
                      <p className="text-[9px] text-slate-400 mt-0.5">
                        {t.phoneSim.subprompt}
                      </p>

                      {/* Interactive Stars */}
                      <div className="flex items-center justify-center gap-1.5 mt-2.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handlePhoneStarClick(star)}
                            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                              phoneRating === star
                                ? 'bg-amber-500/20 border-amber-400 scale-125 shadow-md shadow-amber-500/30'
                                : 'bg-[#141B2D] border-slate-800 hover:border-slate-600'
                            }`}
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= phoneRating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* DYNAMIC SCREEN ROUTING BASED ON STAR SELECTION */}
                    {phoneExperienceState === 'google_maps' ? (
                      /* Camino A: 4 y 5 Estrellas (Google Maps + Sorteo) */
                      <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-left space-y-2 animate-fade-in">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px] uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{t.phoneSim.path5Title}</span>
                        </div>
                        <p className="text-[10px] text-slate-300 leading-tight">
                          {t.phoneSim.path5Desc}
                        </p>
                        <div className="p-2 rounded-xl bg-[#141E30] border border-slate-800 flex items-center justify-between">
                          <span className="text-[9px] text-amber-300 font-bold">{isEn ? '🎁 VIP House Giveaway' : '🎁 Sorteo VIP de la Casa'}</span>
                          <span className="text-[8px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded">{isEn ? 'Data Consent' : 'Habeas Data'}</span>
                        </div>
                        <a
                          href="https://maps.google.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] text-center block transition shadow-md shadow-emerald-500/20"
                        >
                          {t.phoneSim.path5Btn}
                        </a>
                      </div>
                    ) : (
                      /* Camino B: 1 a 3 Estrellas (Contención Privada & Blindaje) */
                      <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-left space-y-2 animate-fade-in">
                        <div className="flex items-center gap-1.5 text-rose-400 font-bold text-[10px] uppercase">
                          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                          <span>{t.phoneSim.path2Title}</span>
                        </div>
                        <p className="text-[10px] text-slate-300 leading-tight">
                          {t.phoneSim.path2Desc}
                        </p>
                        {privateCommentSent ? (
                          <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] text-center font-bold">
                            {t.phoneSim.path2Success}
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <textarea
                              rows={2}
                              value={privateComment}
                              onChange={(e) => setPrivateComment(e.target.value)}
                              placeholder={t.phoneSim.path2Placeholder}
                              className="w-full bg-[#121828] border border-slate-700 text-white text-[10px] rounded-lg p-2 outline-none focus:border-rose-400"
                            />
                            <button
                              type="button"
                              onClick={() => setPrivateCommentSent(true)}
                              className="w-full py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-bold text-[10px] text-center transition cursor-pointer"
                            >
                              {t.phoneSim.path2Btn}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Micro Footer inside Simulator */}
                  <div className="pt-2 border-t border-slate-800 text-[9px] text-slate-500 flex items-center justify-between">
                    <span>{t.phoneSim.footerNoApp}</span>
                    <span className="text-amber-400 font-mono font-bold">{t.phoneSim.footerZeroDamage}</span>
                  </div>
                </div>
              </div>

              {/* Quick Simulator Switch Buttons below Phone */}
              <div className="flex items-center justify-center gap-2 mt-3 text-xs">
                <button
                  type="button"
                  onClick={() => handlePhoneStarClick(5)}
                  className={`px-3 py-1.5 rounded-xl border font-bold transition flex items-center gap-1 cursor-pointer ${
                    phoneRating >= 4
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                  <span>{t.phoneSim.btnTry5}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePhoneStarClick(2)}
                  className={`px-3 py-1.5 rounded-xl border font-bold transition flex items-center gap-1 cursor-pointer ${
                    phoneRating < 4
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                  <span>{t.phoneSim.btnTry2}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. FLOATING LIVE SOCIAL PROOF TICKER (BOTTOM-LEFT TOAST) */}
      {/* ============================================================== */}
      {!tickerDismissed && (
        <div
          className={`fixed bottom-5 left-5 z-50 max-w-sm bg-[#0E1322]/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl transition-all duration-700 transform ${
            isTickerVisible
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-lg shrink-0">
              {currentTicker.icon}
            </div>
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  {currentTicker.tag}
                </span>
                <span className="text-[10px] text-slate-500">• {currentTicker.time}</span>
              </div>
              <p className="text-xs font-bold text-white truncate mt-0.5">
                {currentTicker.brand}
              </p>
              <p className="text-[11px] text-slate-300 leading-tight mt-0.5">
                {currentTicker.event}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTickerDismissed(true)}
              className="text-slate-500 hover:text-slate-300 transition cursor-pointer p-0.5"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4.1. FLOATING WHATSAPP SUPPORT BUTTON (BOTTOM-RIGHT) */}
      {/* ============================================================== */}
      <aside aria-label={isEn ? 'Direct WhatsApp Support' : 'Soporte Directo de WhatsApp'}>
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center">
          <a
            href={`https://wa.me/573058314049?text=${encodeURIComponent(
              isEn
                ? 'Hello Prestigia, I would like to consult with an advisor about the reputation protection system.'
                : 'Hola Prestigia, me gustaría consultar con un asesor sobre el sistema de blindaje de reputación.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackAction('click_floating_whatsapp')}
            className="group relative flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold shadow-2xl shadow-emerald-500/50 hover:shadow-emerald-500/70 border border-emerald-300/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label={isEn ? 'Direct WhatsApp Support' : 'Soporte y Asesoría WhatsApp'}
            title={isEn ? 'Chat with an advisor on WhatsApp' : 'Hablar con un asesor en WhatsApp'}
          >
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-40"></span>
              <MessageCircle className="w-5 h-5 text-white fill-white/20 shrink-0 relative" />
            </div>
            <div className="flex flex-col text-left leading-tight pr-0.5">
              <span className="text-[10px] text-emerald-100 font-semibold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                {isEn ? 'Live Advisor' : 'Asesor en línea'}
              </span>
              <span className="text-xs font-black text-white whitespace-nowrap">
                WhatsApp
              </span>
            </div>
          </a>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 5. CÓMO FUNCIONA EL EMBUDO BIFURCADO DE DOS VÍAS */}
      {/* ============================================================== */}
      <section id="como-funciona" className="scroll-mt-32 py-20 px-6 sm:px-12 lg:px-20 max-w-[1700px] mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3.5 py-1 rounded-full border border-indigo-500/20">
            {t.funnel.tag}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
            {t.funnel.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            {t.funnel.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1500px] mx-auto">
          {/* Camino A: Experiencia 4 y 5 Estrellas */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-950/25 via-[#0D1424] to-[#0A0F1D] border-2 border-emerald-500/40 shadow-2xl relative overflow-hidden group hover:border-emerald-400 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-black">
                <Star className="w-6 h-6 fill-emerald-400 text-emerald-400" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                {t.funnel.pathATag}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mt-2">{t.funnel.pathATitle}</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
              {t.funnel.pathADesc}
            </p>

            <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-emerald-400 font-semibold">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /> {t.funnel.pathAItem1}</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /> {t.funnel.pathAItem2}</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /> {t.funnel.pathAItem3}</div>
            </div>
          </div>

          {/* Camino B: Experiencia 1 a 3 Estrellas */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-rose-950/25 via-[#0D1424] to-[#0A0F1D] border-2 border-rose-500/40 shadow-2xl relative overflow-hidden group hover:border-rose-400 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center font-black">
                <ShieldCheck className="w-6 h-6 text-rose-400" />
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider">
                {t.funnel.pathBTag}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mt-2">{t.funnel.pathBTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
              {t.funnel.pathBDesc}
            </p>

            <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-rose-400 font-semibold">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /> {t.funnel.pathBItem1}</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /> {t.funnel.pathBItem2}</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /> {t.funnel.pathBItem3}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5.1. AUDITORÍA REPUTACIONAL EN TIEMPO REAL (ACCESO OFICIAL AL AUDITOR) */}
      {/* ============================================================== */}
      <section id="auditor-preview" className="scroll-mt-32 py-20 px-4 sm:px-8 lg:px-12 max-w-[1700px] mx-auto border-t border-slate-800/80">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-[#0A101F] to-[#070B16] border-2 border-cyan-500/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Pitch & Live Scan Explanation */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wide">
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.auditorSection.tag}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                {t.auditorSection.title}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                  {t.auditorSection.titleHighlight}
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                {t.auditorSection.subtitle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="p-3.5 rounded-2xl bg-[#0E1628]/80 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>{t.auditorSection.diagLeak}</span>
                  </div>
                  <p className="text-slate-400">{t.auditorSection.diagLeakDesc}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0E1628]/80 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{t.auditorSection.vulnIndex}</span>
                  </div>
                  <p className="text-slate-400">{t.auditorSection.vulnIndexDesc}</p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="/auditor"
                  onClick={() => trackAction('click_auditor_preview_btn')}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer animate-shimmer whitespace-nowrap"
                >
                  <Search className="w-4 h-4 text-slate-950" />
                  <span>{t.auditorSection.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <span className="text-[11px] text-slate-400 text-center sm:text-left">
                  {t.auditorSection.badgeInstant}
                </span>
              </div>
            </div>

            {/* Right Column: Auditor Card Mockup Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md p-6 rounded-3xl bg-[#090F1C] border-2 border-cyan-500/30 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    AUDITOR_PRESTIGIA_V2
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">{t.auditorSection.cardRating}</span>
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.1 / 5.0
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-center justify-between">
                    <span className="text-rose-300">{t.auditorSection.cardIncidents}</span>
                    <span className="text-rose-400 font-mono font-bold">{isEn ? '14 incidents' : '14 incidentes'}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between">
                    <span className="text-amber-300">{t.auditorSection.cardLoss}</span>
                    <span className="text-amber-400 font-mono font-bold">$1.850 USD / mes</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
                    <span className="text-emerald-300">{t.auditorSection.cardPotential}</span>
                    <span className="text-emerald-400 font-mono font-bold">{isEn ? '+85 Customers / mo' : '+85 Clientes / mes'}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-cyan-500/20 flex items-center justify-center gap-2 text-[11px] text-cyan-300/80 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t.auditorSection.cardStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. CALCULADORA INTERACTIVA DE ROI (PÉRDIDAS & GANANCIAS) */}
      {/* ============================================================== */}
      <section id="calculadora-roi" className="scroll-mt-32 py-20 px-6 sm:px-12 lg:px-20 max-w-[1700px] mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
            {t.calculator.tag}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
            {t.calculator.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            {t.calculator.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0D1322] border-2 border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {/* Sliders Input Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Slider 1: Clientes Atendidos por Mes */}
            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                <span className="text-slate-300 font-bold flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  {t.calculator.monthlyClients}
                </span>
                <span className="text-xl font-mono font-black text-amber-400">
                  {roiMonthlyClients.toLocaleString()} {isEn ? 'customers' : 'clientes'}
                </span>
              </div>
              <input
                type="range"
                min={100}
                max={5000}
                step={50}
                value={roiMonthlyClients}
                onChange={(e) => setRoiMonthlyClients(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>100 {isEn ? 'customers' : 'clientes'}</span>
                <span>2,500 {isEn ? 'customers' : 'clientes'}</span>
                <span>5,000 {isEn ? 'customers' : 'clientes'}</span>
              </div>
            </div>

            {/* Slider 2: Ticket Promedio por Cliente */}
            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                <span className="text-slate-300 font-bold flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  {t.calculator.averageTicket}
                </span>
                <span className="text-xl font-mono font-black text-emerald-400">
                  ${roiAverageTicket} USD {isEn ? '/ check' : '/ consumo'}
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={200}
                step={5}
                value={roiAverageTicket}
                onChange={(e) => setRoiAverageTicket(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>$10 USD</span>
                <span>$100 USD</span>
                <span>$200 USD</span>
              </div>
            </div>

            {/* Context Info Box */}
            <div className="p-4 rounded-2xl bg-[#141A28] border border-slate-700/80 text-xs text-slate-300 space-y-1.5">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                {isEn ? 'Industry Data (Harvard Business Review & BrightLocal):' : 'Dato de la industria (Harvard Business Review & BrightLocal):'}
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isEn
                  ? 'Each single-star drop on Google Maps represents between 15% and 22% in direct revenue loss to better-rated nearby competitors.'
                  : 'Cada estrella de caída en Google Maps representa entre un 15% y 22% de pérdida en ventas frente a competidores cercanos mejor calificados.'}
              </p>
            </div>
          </div>

          {/* Dynamic Financial Results Card (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-b from-[#141E34] to-[#0A1020] border-2 border-amber-500/40 shadow-xl space-y-5 text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
              {isEn ? 'Estimated Monthly Projection' : 'Proyección Mensual Estimada'}
            </span>

            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">{t.calculator.monthlyLoss}:</p>
              <p className="text-3xl sm:text-4xl font-black text-rose-400 font-mono mt-1">
                -${estimatedLostMoneyMonthly.toLocaleString()} <span className="text-xs text-slate-400">USD/mo</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isEn
                  ? `Approx. ${estimatedLostClientsFromBadReviews} customers lost who choose your competitor.`
                  : `Aprox. ${estimatedLostClientsFromBadReviews} clientes perdidos que eligen a tu vecino.`}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-300 uppercase font-semibold">{t.calculator.retainedMoney}:</p>
              <p className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono mt-1">
                +${estimatedRetainedWithPrestigia.toLocaleString()} <span className="text-xs text-slate-400">USD/mo</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isEn
                  ? 'More organic walk-ins, contained complaints, and loyal repeat patrons.'
                  : 'Más visitas orgánicas, blindaje de quejas y clientes leales.'}
              </p>
            </div>

            <a
              href="#agendar"
              onClick={() => {
                setLeadForm((prev) => ({
                  ...prev,
                  notes: `[Calculadora ROI: ${roiMonthlyClients} clientes/mes a $${roiAverageTicket} USD/ticket. Fuga estimada: $${estimatedLostMoneyMonthly} USD]`,
                }));
                trackAction('click_recuperar_ventas_calculator');
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/25 active:scale-95 block cursor-pointer"
            >
              {isEn ? 'I Want to Protect this Revenue in My Business ↗' : 'Quiero Blindar Estos Ingresos en Mi Negocio ↗'}
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. SHOWCASE DINÁMICO POR INDUSTRIAS (TABS INTERACTIVAS) */}
      {/* ============================================================== */}
      <section id="nichos" className="scroll-mt-32 py-20 px-6 sm:px-12 lg:px-20 max-w-[1700px] mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20">
            {t.niches.tag}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
            {t.niches.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            {t.niches.subtitle}
          </p>
        </div>

        {/* Niche Tabs Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto mb-10">
          {showcaseNiches.map((niche) => (
            <button
              key={niche.id}
              type="button"
              onClick={() => {
                setActiveNicheId(niche.id);
                trackAction(`select_niche_tab_${niche.id}`);
              }}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                activeNicheId === niche.id
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-105'
                  : 'bg-[#0D1424] text-slate-300 border border-slate-800 hover:border-slate-600'
              }`}
            >
              <span className="text-base">{niche.icon}</span>
              <span>{niche.name}</span>
            </button>
          ))}
        </div>

        {/* Active Niche Showcase Content Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0F1626] to-[#0A0E18] border-2 border-slate-800 shadow-2xl max-w-[1550px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <span className="text-xs font-black uppercase text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                {activeNiche.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {activeNiche.headline}
              </h3>

              <div className="space-y-3 pt-2 text-xs sm:text-sm">
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-slate-200">
                  <p className="font-bold text-rose-400 text-xs uppercase mb-1">{t.niches.painTitle}</p>
                  <p className="text-slate-300 leading-relaxed text-xs">{activeNiche.pain}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-slate-200">
                  <p className="font-bold text-emerald-400 text-xs uppercase mb-1">{t.niches.solutionTitle}</p>
                  <p className="text-slate-300 leading-relaxed text-xs">{activeNiche.solution}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-center">
                {activeNiche.metrics.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#141A28] border border-slate-800">
                    <p className="text-lg font-black text-amber-400 font-mono">{m.val}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Mini Graphic Representation */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="p-6 rounded-3xl bg-[#141C30] border border-slate-700/80 shadow-xl w-full text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center text-3xl">
                  {activeNiche.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">{activeNiche.name}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{activeNiche.qrDemoText}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#090D18] border border-slate-800 flex items-center justify-center gap-2">
                  <QrCode className="w-12 h-12 text-white" />
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-emerald-400">{t.niches.activeSmartQr}</p>
                    <p className="text-[9px] text-slate-400">{t.niches.scanNoApps}</p>
                    <p className="text-[9px] text-amber-400 font-mono font-bold">{t.niches.responseSpeed}</p>
                  </div>
                </div>

                <a
                  href="#agendar"
                  onClick={() => {
                    setLeadForm((prev) => ({ ...prev, category: activeNiche.name }));
                    trackAction(`click_cotizar_niche_${activeNiche.id}`);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs text-center transition block shadow-md cursor-pointer"
                >
                  {t.niches.ctaAudit} {activeNiche.name} ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. COMPARATIVA INTERACTIVA: ANTES VS DESPUÉS DE PRESTIGIA */}
      {/* ============================================================== */}
      <section id="comparativa" className="scroll-mt-32 py-20 px-6 sm:px-12 lg:px-20 max-w-[1700px] mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3.5 py-1 rounded-full border border-purple-500/20">
            {t.comparison.tag}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
            {t.comparison.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            {t.comparison.subtitle}
          </p>

          {/* Interactive Switcher */}
          <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-[#0E1322] border border-slate-700 mt-6">
            <button
              type="button"
              onClick={() => setComparisonMode('without')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                comparisonMode === 'without'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.comparison.withoutBtn}
            </button>
            <button
              type="button"
              onClick={() => setComparisonMode('with')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                comparisonMode === 'with'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.comparison.withBtn}
            </button>
          </div>
        </div>

        {/* Dynamic Comparison Cards */}
        {comparisonMode === 'without' ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-rose-950/20 via-[#0E1322] to-[#0A0D18] border-2 border-rose-500/40 shadow-2xl animate-fade-in max-w-[1550px] mx-auto">
            <div className="flex items-center gap-3 pb-6 border-b border-rose-500/20">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="text-xl font-black text-rose-400">{t.comparison.withoutHeader}</h3>
                <p className="text-xs text-slate-400">{t.comparison.withoutSub}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {t.comparison.withoutCards.map((card, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#141A28] border border-rose-500/20">
                  <p className="text-2xl font-mono font-black text-rose-400">{card.val}</p>
                  <p className="text-xs font-bold text-white mt-1">{card.title}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-emerald-950/25 via-[#0E1322] to-[#0A0D18] border-2 border-emerald-500/40 shadow-2xl animate-fade-in max-w-[1550px] mx-auto">
            <div className="flex items-center gap-3 pb-6 border-b border-emerald-500/20">
              <span className="text-3xl">🏆</span>
              <div>
                <h3 className="text-xl font-black text-emerald-400">{t.comparison.withHeader}</h3>
                <p className="text-xs text-slate-300">{t.comparison.withSub}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {t.comparison.withCards.map((card, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#141E30] border border-emerald-500/30">
                  <p className="text-2xl font-mono font-black text-emerald-400">{card.val}</p>
                  <p className="text-xs font-bold text-white mt-1">{card.title}</p>
                  <p className="text-[11px] text-slate-300 mt-1">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* 9. CASOS DE ÉXITO REALES CON RESULTADOS (CARRUSEL INTERACTIVO INTERNACIONAL) */}
      {/* ============================================================== */}
      <section id="testimonios" className="scroll-mt-32 py-20 px-4 sm:px-8 lg:px-12 max-w-[1700px] mx-auto border-t border-slate-800/80">
        <div className="max-w-3xl text-left mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20">
            {t.cases.tag}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
            {t.cases.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            {t.cases.subtitle}
          </p>
        </div>

        {/* Carousel Infinite Cyclic Marquee Track */}
        <div
          className="relative w-full overflow-hidden py-4 group"
          onTouchStart={() => setIsGlidePaused(true)}
          onTouchEnd={() => setIsGlidePaused(false)}
        >
          {/* Subtle gradient side fades for smooth appearance/exit */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-r from-[#06080E] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-l from-[#06080E] to-transparent z-10 pointer-events-none" />

          {/* The gliding track: 10 cases duplicated for seamless 100% infinite cycle */}
          <div
            className="animate-infinite-glide flex gap-6"
            style={{ animationPlayState: isGlidePaused ? 'paused' : undefined }}
          >
            {[...successCases, ...successCases].map((c, idx) => (
              <div
                key={`${c.id}-${idx}`}
                className="w-[340px] sm:w-[410px] shrink-0 p-7 rounded-3xl bg-[#0D1424] border border-slate-800 hover:border-amber-500/50 hover:bg-[#11192e] transition-all duration-300 shadow-xl flex flex-col justify-between cursor-default group/card"
              >
                <div>
                  {/* Top Strip: Emoji + Country Flag + Category Badge */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{c.emoji}</span>
                      <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                        <span>{c.flag}</span>
                        <span>{c.country}</span>
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${c.badgeStyle} truncate max-w-[190px]`}>
                      {c.category}
                    </span>
                  </div>

                  {/* Brand & City */}
                  <div className="mt-4">
                    <h3 className="text-lg font-black text-white group-hover/card:text-amber-400 transition-colors">
                      {c.brand}
                    </h3>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{c.city}</span>
                    </p>
                  </div>

                  {/* Testimonial Quote */}
                  <p className="text-xs text-slate-300 mt-3.5 italic leading-relaxed">
                    &ldquo;{c.quote}&rdquo;
                  </p>
                </div>

                {/* Footer: Author & Key Highlight Metric */}
                <div className="mt-6 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-slate-200 font-bold">{c.author}</p>
                    <p className="text-[10px] text-slate-500">{c.authorRole}</p>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-black text-sm ${c.metricColor} block`}>
                      {c.metricVal}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {c.metricLabel}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 10. TOUR DEL SISTEMA: RECORRIDO PESTAÑA POR PESTAÑA */}
      {/* ============================================================== */}
      <section id="tour-sistema" className="scroll-mt-32 py-20 px-4 sm:px-8 lg:px-12 max-w-[1700px] mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3.5 py-1 rounded-full border border-indigo-500/20">
            {t.tour.tag}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
            {t.tour.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            {t.tour.subtitle}
          </p>
        </div>

        {/* 9-Tab Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 max-w-5xl mx-auto">
          {portalModules.map((mod, idx) => {
            const ModIcon = mod.icon;
            const isActive = activePortalTab === idx;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => {
                  setActivePortalTab(idx);
                  trackAction(`click_portal_tab_${mod.id}`);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                    : 'bg-[#0E1424] text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                <ModIcon className="w-3.5 h-3.5 shrink-0" />
                <span>{mod.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Active Module Showcase Card */}
        {(() => {
          const mod = portalModules[activePortalTab] || portalModules[0];
          const ModIcon = mod.icon;
          return (
            <div className="max-w-4xl mx-auto p-7 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0F1626] to-[#0A0E18] border-2 border-indigo-500/40 shadow-2xl space-y-6 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <ModIcon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-black text-white">{mod.title}</h3>
                    <p className="text-xs text-slate-400">{t.tour.tabIndicator} {mod.id} {t.tour.of9}</p>
                  </div>
                </div>
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${mod.badgeColor}`}>
                  {mod.badge}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {mod.desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#090D17] border border-slate-800 text-xs space-y-1.5">
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{t.tour.ownerBenefit}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{mod.benefit}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#090D17] border border-slate-800 text-xs space-y-1.5">
                  <div className="text-amber-400 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{t.tour.profitTip}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{mod.tip}</p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800/80">
                <span>{t.tour.rolesNote}</span>
                <Link
                  href="/portal"
                  className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                >
                  <span>{t.tour.portalLink}</span>
                </Link>
              </div>
            </div>
          );
        })()}
      </section>

      {/* ============================================================== */}
      {/* 11. PLANES A LA MEDIDA: CERO PRECIOS PÚBLICOS, TRATO EXCLUSIVO */}
      {/* ============================================================== */}
      <section id="planes" className="scroll-mt-32 py-20 px-4 sm:px-8 lg:px-12 max-w-[1700px] mx-auto border-t border-slate-800/80">
        <div id="propuesta" className="-mt-20 pt-20" />
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
            {t.plans.tag}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
            {t.plans.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            {t.plans.subtitle}
          </p>
        </div>

        {/* 4 Main Bespoke Architecture Cards (Zero Public Prices) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-[1700px] mx-auto items-stretch">
          
          {/* NIVEL 1: PUNTO ÚNICO */}
          <div className="p-7 sm:p-8 rounded-3xl bg-[#0D1424] border border-slate-800 flex flex-col justify-between shadow-xl hover:border-slate-700 transition">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  {isEn ? '1 Location / Office / Store' : '1 Sede / Consultorio / Local'}
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">
                  {isEn ? 'Single Physical Venue' : 'Punto Físico Único'}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">{t.plans.plan1Name}</h3>
                <span className="text-xs text-emerald-400 font-bold block mt-0.5">{isEn ? 'Tailored Proposal' : 'Propuesta a la Medida'}</span>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  {t.plans.plan1Desc}
                </p>
                <div className="mt-3 p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-emerald-400 font-bold">
                  🎁 <strong>Setup & Smart QR:</strong> {isEn ? '100% INCLUDED in pilot phase' : '100% BONIFICADO en fase de prueba'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>{isEn ? 'Displays: 1 Owner Central Command Screen' : 'Pantallas: 1 Pantalla Central del Dueño'}</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{isEn ? 'Smart QR filter anti-reviews 1 to 3★' : 'Filtro Smart QR anti-reseñas 1 a 3★'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{isEn ? 'Google Maps basic real-time radar' : 'Radar de Google Maps básico en tiempo real'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{isEn ? 'Private complaint containment in Client Portal' : 'Contención de quejas privada en Portal Clientes'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{isEn ? 'Monthly executive performance report' : 'Reporte mensual de rendimiento y auditoría'}</span>
                </li>
                <li className="flex items-start gap-2 text-slate-500">
                  <Lock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <span>{isEn ? 'Without Google AI Assistant (available in Pro)' : 'Sin Asistente IA Google (disponible en Alto Rendimiento)'}</span>
                </li>
              </ul>
            </div>

            <a
              href="#agendar"
              onClick={() => {
                setLeadForm((prev) => ({ ...prev, branchCount: '1' }));
                trackAction('click_cotizar_punto_unico');
              }}
              className="mt-6 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition block cursor-pointer active:scale-95 shadow-md"
            >
              {t.plans.ctaRequest}
            </a>
          </div>

          {/* NIVEL 2: ALTO RENDIMIENTO (MÁS POPULAR) */}
          <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-b from-[#141E34] via-[#0E1526] to-[#0A0F1D] border-2 border-amber-500 shadow-2xl relative flex flex-col justify-between">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg shadow-amber-500/25 whitespace-nowrap">
              ⭐ {isEn ? 'MOST POPULAR' : 'MÁS SOLICITADO'}
            </div>

            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  {isEn ? 'Hospitality, Clinics & High-End Retail' : 'Gastrobares, Clínicas & Retail'}
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  {isEn ? 'High Footfall' : 'Alto Flujo'}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">{t.plans.plan2Name}</h3>
                <span className="text-xs text-amber-400 font-bold block mt-0.5">{isEn ? 'Tailored Architecture' : 'Estructura a la Medida'}</span>
                <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                  {t.plans.plan2Desc}
                </p>
                <div className="mt-3 p-2 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-[10px] text-emerald-300 font-bold">
                  🎁 <strong>Setup & Smart QR:</strong> {isEn ? '100% INCLUDED in pilot phase' : '100% BONIFICADO en fase de prueba'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-[11px] text-slate-200 space-y-1">
                <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{isEn ? 'Displays: 1 Owner + 2 Floor/Checkout Displays with 2FA' : 'Pantallas: 1 Dueño + 2 Pantallas en Local/Caja con 2FA'}</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200 border-t border-slate-800 pt-4">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>{isEn ? 'Everything in Basic Plan' : 'Todo lo del Plan Punto Único'}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>{isEn ? 'Unlimited Google AI Assistant' : 'Asistente IA Google Ilimitado'}</strong> ({isEn ? '3 strategic tones' : '3 tonos de respuesta'})</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>{isEn ? 'Audible & Visual In-Room Alerts' : 'Alertas en Vivo Sonoras & Push'}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>{isEn ? 'Official Monthly Giveaway Module' : 'Sorteo del Mes Oficial'}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>{isEn ? 'Customer CSV Export with Legal Consent' : 'Exportación CSV de Clientes con Consentimiento Legal'}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{isEn ? 'Server/Staff performance audit by shift' : 'Auditoría de personal y meseros en turno'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{isEn ? 'Priority VIP executive support' : 'Soporte ejecutivo comercial prioritario'}</span>
                </li>
              </ul>
            </div>

            <a
              href="#agendar"
              onClick={() => {
                setLeadForm((prev) => ({ ...prev, branchCount: '1' }));
                trackAction('click_cotizar_alto_rendimiento');
              }}
              className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs text-center shadow-lg shadow-amber-500/25 transition active:scale-95 block cursor-pointer animate-shimmer"
            >
              {t.plans.ctaRequestPro}
            </a>
          </div>

          {/* NIVEL 3: MULTI-SEDES (PLAN ÉLITE) */}
          <div className="p-7 sm:p-8 rounded-3xl bg-[#0D1424] border-2 border-purple-500/70 flex flex-col justify-between shadow-2xl relative hover:border-purple-400 transition">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow whitespace-nowrap">
              👑 {isEn ? 'MULTI-LOCATION POWER' : 'POTENCIA MULTISEDE (2-3 SEDES)'}
            </div>

            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                  {isEn ? 'Multi-Branch Groups (2-3 Venues)' : 'Grupos Multi-Sedes (2-3 Sedes)'}
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                  {isEn ? 'Up to 3 Venues' : 'Hasta 3 Sedes'}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">{t.plans.plan3Name}</h3>
                <span className="text-xs text-purple-400 font-bold block mt-0.5">{isEn ? 'Multi-Location Architecture' : 'Arquitectura Multi-Local a la Medida'}</span>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  {t.plans.plan3Desc}
                </p>
                <div className="mt-3 p-2 rounded-xl bg-purple-950/40 border border-purple-500/40 text-[10px] text-purple-300 font-bold">
                  🎁 <strong>Setup & Smart QR:</strong> {isEn ? '100% INCLUDED' : '100% BONIFICADO'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-[11px] text-slate-200 space-y-1">
                <div className="font-bold text-purple-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>{isEn ? 'Multi-Branch: Up to 3 venues with independent shift managers' : 'Multisede: Hasta 3 sedes con administradores independientes'}</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>{isEn ? 'Everything in Pro Plan included' : 'Todo lo de Alto Rendimiento incluido'}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>{isEn ? 'Live TV Wallboard mode for floor & kitchen' : 'Modo TV Live Wallboard para salón y cocina'}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>{isEn ? 'Multi-Winner VIP Giveaways' : 'Sorteos VIP Multi-Ganador'}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>{isEn ? 'Consolidated staff podium & audit log' : 'Bitácora y Podio de Personal consolidado'}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>{isEn ? 'Macro Multi-Branch benchmark & comparison' : 'Control Macro Multisede y comparativa entre locales'}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>{isEn ? 'Dedicated Growth Engineer & VIP Onboarding' : 'Asesor ejecutivo dedicado & Onboarding VIP'}</span>
                </li>
              </ul>
            </div>

            <a
              href="#agendar"
              onClick={() => {
                setLeadForm((prev) => ({ ...prev, branchCount: '2-3' }));
                trackAction('click_cotizar_multi_sede');
              }}
              className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs text-center shadow-lg shadow-purple-600/20 transition active:scale-95 block cursor-pointer"
            >
              {t.plans.ctaRequestElite}
            </a>
          </div>

          {/* NIVEL 4: HOLDINGS & FRANQUICIAS (PLAN EMPRESARIAL) */}
          <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0D1829] via-[#09101C] to-[#060B14] border-2 border-cyan-500/70 flex flex-col justify-between shadow-2xl relative hover:border-cyan-400 transition">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg shadow-cyan-500/30 whitespace-nowrap">
              🏢 {isEn ? 'UNLIMITED ENTERPRISE' : 'HOLDING CORPORATIVO'}
            </div>

            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  {isEn ? 'Chains & National Holdings' : 'Franquicias & Holdings'}
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                  {isEn ? 'Unlimited Venues' : 'Sedes Ilimitadas'}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">{t.plans.plan4Name}</h3>
                <span className="text-xs text-cyan-400 font-bold block mt-0.5">{isEn ? 'Enterprise SLA & Infrastructure' : 'Infraestructura & SLA Corporativo'}</span>
                <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                  {t.plans.plan4Desc}
                </p>
                <div className="mt-3 p-2 rounded-xl bg-cyan-950/50 border border-cyan-500/40 text-[10px] text-cyan-300 font-bold">
                  🎁 <strong>Onboarding & Setup:</strong> {isEn ? '100% INCLUDED with Dedicated Engineer' : '100% BONIFICADO con Ingeniero Dedicado'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-[11px] text-slate-200 space-y-1">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isEn ? 'Holdings: Unlimited branches & multi-tenant hierarchy' : 'Holding: Sedes ilimitadas y jerarquía multisede'}</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200 border-t border-slate-800 pt-4">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>{isEn ? 'Everything in Elite Plan included' : 'Todo lo del Plan Élite incluido'}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>{isEn ? 'Unlimited physical branches & locations' : 'Sedes físicas y locales ilimitados'}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>{isEn ? 'REST API & Webhook data stream integration' : 'Integración vía API REST & Webhooks'}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>{isEn ? 'Custom POS / ERP data sync connection' : 'Sincronización con POS / ERP o CRM de la marca'}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>{isEn ? 'Dedicated Account Manager & 24/7 SLA' : 'Account Manager dedicado & SLA 99.98%'}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{isEn ? 'Bespoke staff training & in-situ rollout' : 'Capacitación in-situ al equipo operativo'}</span>
                </li>
              </ul>
            </div>

            <a
              href="#agendar"
              onClick={() => {
                setLeadForm((prev) => ({ ...prev, branchCount: '10+' }));
                trackAction('click_cotizar_empresarial');
              }}
              className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs text-center shadow-lg shadow-cyan-500/25 transition active:scale-95 block cursor-pointer"
            >
              {t.plans.ctaRequestEnterprise}
            </a>
          </div>
        </div>

        {/* Corporate Peace of Mind Banner (Dossier & ROI Commitment) */}
        <div className="mt-12 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 max-w-[1300px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white text-xs font-bold">{t.plans.roiBannerTitle}</p>
              <p className="text-[11px] text-slate-400">{t.plans.roiBannerDesc}</p>
            </div>
          </div>
          <div className="shrink-0 flex flex-wrap items-center justify-center gap-2.5">
            <Link
              href="/dossier"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/30 hover:from-amber-500/30 hover:to-amber-600/40 text-amber-300 border border-amber-500/50 text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <span>{t.plans.dossierBtn}</span>
            </Link>
            <a
              href="https://wa.me/573058314049?text=Hola%20Prestigia,%20solicito%20el%20Dossier%20Ejecutivo%20y%20cotizaci%C3%B3n%20personalizada"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.plans.whatsappBtn}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 11. ACORDEÓN INTERACTIVO DE PREGUNTAS FRECUENTES (FAQ) */}
      {/* ============================================================== */}
      <section className="py-20 px-6 sm:px-12 lg:px-20 max-w-[1500px] mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3.5 py-1 rounded-full border border-indigo-500/20">
            {isEn ? 'FAQ & Inquiries' : 'Dudas Resueltas'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
            {isEn ? 'Frequently Asked Questions' : 'Preguntas Frecuentes'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            {isEn ? 'Everything you need to know before starting with Prestigia:' : 'Todo lo que necesitas saber antes de iniciar con Prestigia:'}
          </p>
        </div>

        <div className="space-y-3.5 max-w-[1200px] mx-auto">
          {faqsList.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-[#0D1322] border border-slate-800 transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-white hover:text-amber-400 transition cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 12. FORMULARIO DE AGENDAMIENTO DE LLAMADA ESTRATÉGICA VIP */}
      {/* ============================================================== */}
      <section id="agendar" className="scroll-mt-32 py-20 px-6 sm:px-12 lg:px-20 max-w-[1500px] mx-auto border-t border-slate-800/80">
        <div className="bg-gradient-to-br from-[#101728] via-[#0E1322] to-[#0A0E18] border-2 border-amber-500/40 rounded-3xl p-7 sm:p-14 shadow-2xl relative overflow-hidden max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wider uppercase">
              <Calendar className="w-3.5 h-3.5" />
              {t.booking.tag}
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              {t.booking.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {t.booking.subtitle}
            </p>
          </div>

          {/* Form Content */}
          {leadSuccess ? (
            <div className="mt-8 p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-white">{t.booking.successTitle}</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                {t.booking.successDesc}
              </p>
              <div className="pt-3">
                <a
                  href={`https://wa.me/573058314049?text=${encodeURIComponent(
                    `Hola, acabo de agendar mi llamada estratégica en Prestigia para mi negocio *${leadForm.businessName}* (${leadForm.fullName}). Me gustaría confirmar el horario para revisar el diagnóstico.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/25 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isEn ? 'Confirm via Direct WhatsApp' : 'Confirmar por WhatsApp Inmediato'}</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="mt-8 space-y-4 max-w-2xl mx-auto text-left">
              {leadError && (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{leadError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre Titular */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.booking.nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={leadForm.fullName}
                    onChange={(e) => setLeadForm({ ...leadForm, fullName: e.target.value })}
                    placeholder={isEn ? 'e.g. John Miller' : 'Ej: Carlos Gómez'}
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 text-white text-xs rounded-xl px-4 py-3 outline-none transition"
                  />
                </div>

                {/* Nombre Comercial */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.booking.businessLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={leadForm.businessName}
                    onChange={(e) => setLeadForm({ ...leadForm, businessName: e.target.value })}
                    placeholder={isEn ? 'e.g. The Artisan Burger Co.' : 'Ej: La Burguesía Artesanal'}
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 text-white text-xs rounded-xl px-4 py-3 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nicho Comercial */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isEn ? 'Business Sector / Niche *' : 'Nicho / Sector de tu Negocio *'}
                  </label>
                  <select
                    value={leadForm.category}
                    onChange={(e) => setLeadForm({ ...leadForm, category: e.target.value })}
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 text-white text-xs rounded-xl px-4 py-3 outline-none cursor-pointer transition"
                  >
                    {PRESTIGIA_NICHES.map((n) => (
                      <option key={n.id} value={n.label}>
                        {n.icon} {n.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ciudad */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isEn ? 'City / Location *' : 'Ciudad / Ubicación *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={leadForm.city}
                    onChange={(e) => setLeadForm({ ...leadForm, city: e.target.value })}
                    placeholder={isEn ? 'e.g. Miami, Madrid, Bogotá...' : 'Ej: Bogotá, Medellín, Cali, CDMX...'}
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 text-white text-xs rounded-xl px-4 py-3 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.booking.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    required
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    placeholder="+1 305 123 4567"
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 text-white text-xs rounded-xl px-4 py-3 outline-none font-mono transition"
                  />
                </div>

                {/* Número de Sedes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isEn ? 'How many physical venues do you operate?' : '¿Cuántas Sedes Físicas Tienes?'}
                  </label>
                  <select
                    value={leadForm.branchCount}
                    onChange={(e) => setLeadForm({ ...leadForm, branchCount: e.target.value })}
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 text-white text-xs rounded-xl px-4 py-3 outline-none cursor-pointer transition"
                  >
                    <option value="1">{isEn ? '1 Venue (Single Location)' : '1 Sede (Punto Único)'}</option>
                    <option value="2-3">{isEn ? '2 to 3 Venues' : '2 a 3 Sedes'}</option>
                    <option value="4-10">{isEn ? '4 to 10 Venues (Chain)' : '4 a 10 Sedes (Cadena)'}</option>
                    <option value="10+">{isEn ? '10+ Venues (Holding / Enterprise)' : 'Más de 10 Sedes (Holding)'}</option>
                  </select>
                </div>
              </div>

              {/* Fila Especial: Horario de Llamada & Meta Principal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Horario Preferido para la Llamada */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.booking.timeLabel}</span>
                  </label>
                  <select
                    value={leadForm.preferredTime}
                    onChange={(e) => setLeadForm({ ...leadForm, preferredTime: e.target.value })}
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 text-white text-xs rounded-xl px-4 py-3 outline-none cursor-pointer transition"
                  >
                    <option value="Mañana (9:00 AM - 12:00 PM)">{isEn ? 'Morning (9:00 AM - 12:00 PM)' : 'Mañana (9:00 AM - 12:00 PM)'}</option>
                    <option value="Tarde (2:00 PM - 6:00 PM)">{isEn ? 'Afternoon (2:00 PM - 6:00 PM)' : 'Tarde (2:00 PM - 6:00 PM)'}</option>
                    <option value="Noche (6:00 PM - 8:00 PM)">{isEn ? 'Evening (6:00 PM - 8:00 PM)' : 'Noche (6:00 PM - 8:00 PM)'}</option>
                    <option value="Cualquier Horario Laboral">{isEn ? 'Any Business Hours' : 'Cualquier Horario Laboral'}</option>
                  </select>
                </div>

                {/* Meta Principal del Negocio */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.booking.goalLabel}</span>
                  </label>
                  <select
                    value={leadForm.primaryGoal}
                    onChange={(e) => setLeadForm({ ...leadForm, primaryGoal: e.target.value })}
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 text-white text-xs rounded-xl px-4 py-3 outline-none cursor-pointer transition"
                  >
                    <option value="Aumentar clientes y reseñas 5★ en Google Maps">{isEn ? 'Grow customers and 5★ reviews on Google Maps' : 'Aumentar clientes y 5★ en Google Maps'}</option>
                    <option value="Frenar quejas privadas antes de que salgan a internet">{isEn ? 'Contain private complaints before the web' : 'Frenar quejas privadas antes de internet'}</option>
                    <option value="Crear base de datos propia de clientes (WhatsApp)">{isEn ? 'Build owned customer WhatsApp database' : 'Crear base de datos propia (WhatsApp)'}</option>
                    <option value="Auditar la atención del personal y meseros">{isEn ? 'Audit server and staff performance' : 'Auditar la atención del personal'}</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submittingLead}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 animate-shimmer"
                >
                  {submittingLead ? (
                    <span>{t.booking.sendingBtn}</span>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 text-slate-950" />
                      <span>{t.booking.submitBtn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-slate-500 text-center">
                {isEn
                  ? '🔒 Your data is processed under strict confidentiality and privacy consent. No spam, no pushy calls.'
                  : '🔒 Tus datos se tratan bajo estricta confidencialidad y Ley de Habeas Data (Ley 1581). Sin compromisos ni llamadas insistentes.'}
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 13. FOOTER CORPORATIVO */}
      {/* ============================================================== */}
      <footer className="border-t border-slate-800/80 py-14 px-6 sm:px-12 lg:px-20 bg-[#05070B] text-slate-400 text-xs">
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <PrestigiaIcon className="w-8 h-8 text-white" />
            <div>
              <p className="text-white font-extrabold tracking-wider text-sm">PRESTIGIA TECHNOLOGIES ENTERPRISE</p>
              <p className="text-[11px] text-slate-500">{t.footer.brandDesc}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <Link href="/portal" className="text-slate-300 hover:text-white transition flex items-center gap-1.5 font-semibold">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t.nav.clientPortal}</span>
            </Link>
            <Link href="/dossier" className="text-amber-400 hover:text-amber-300 transition flex items-center gap-1.5 font-semibold">
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.nav.dossier}</span>
            </Link>
            <Link href="/auditor" className="text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1.5 font-semibold">
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.nav.auditor}</span>
            </Link>
            <a
              href="https://wa.me/573058314049?text=Hola%20Prestigia,%20solicito%20información%20sobre%20el%20blindaje%20comercial"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white transition flex items-center gap-1.5 font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isEn ? 'Direct WhatsApp Support' : 'Atención Directa WhatsApp'}</span>
            </a>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="text-slate-500 font-medium">Colombia • México • Chile • United States • Spain</span>
          </div>
        </div>

        <div className="max-w-[1700px] mx-auto mt-8 pt-6 border-t border-slate-900 text-[10px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Prestigia Technologies. {isEn ? 'All rights reserved.' : 'Todos los derechos reservados.'}</p>
          <p>{t.footer.compliance}</p>
        </div>
      </footer>
    </div>
  );
}
