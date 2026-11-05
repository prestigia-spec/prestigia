'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { PrestigiaIcon } from '@/components/PrestigiaIcon';
import {
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Printer,
  Search,
  Zap,
  Shield,
  ShieldCheck,
  Star,
  Users,
  Camera,
  Video,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Trophy,
  Flame,
  RefreshCw,
  X,
  Phone,
  MessageSquare,
  Lock,
  ChevronRight,
  Building2,
  Trash2,
  Crown,
  Save,
  HelpCircle,
  Layers,
  ExternalLink,
  Check,
  Download,
  Globe,
  DollarSign,
  Filter,
  Briefcase,
  Crosshair,
  Calculator,
  Compass,
  FileCheck,
  Upload,
  Eye,
  EyeOff,
  KeyRound,
  ShieldAlert,
  Unlock,
  Clock,
  LogOut,
  ChevronDown,
  ChevronUp,
  Edit3,
  Sliders,
  RotateCcw,
  CheckCheck,
  Plus,
  User,
  Mail,
  Power,
  Scale,
  Gavel,
  FileText,
} from 'lucide-react';
import type { GooglePlaceData, NegativeReviewItem } from '@/app/api/auditor/google-lookup/route';

interface StudioAdvisorUser {
  id: string;
  name: string;
  username: string;
  password?: string;
  phone: string;
  role: 'admin' | 'advisor';
  accountType?: 'internal_advisor' | 'partner_agency' | 'founder' | 'director';
  country?: string;
  city?: string;
  monthlyFeeUsd?: number;
  licenseStatus?: 'active' | 'pending_payment' | 'suspended';
  active: boolean;
  maxCreatesMonthly?: number;
  maxAuditsMonthly?: number;
  maxRescuesMonthly?: number;
  maxAppealsMonthly?: number;
}

interface ServiceCatalogItem {
  name: string;
  description: string;
  tag: string;
}

interface PhotoChecklistItem {
  item: string;
  count: number;
  tip: string;
  filenameExample: string;
}

interface PreventiveFaqItem {
  question: string;
  answer: string;
}

interface VerificationGuideData {
  title: string;
  overview: string;
  cameraTake1: string;
  cameraTake2: string;
  cameraTake3: string;
  documents: string[];
}

interface ActionRoadmapItem {
  step: number;
  title: string;
  impact: string;
  action: string;
}

interface BlueprintData {
  primaryCategory: string;
  secondaryCategories: string[];
  optimizedTitle: string;
  commercialDescription: string;
  serviceCatalog: ServiceCatalogItem[];
  photoChecklist: PhotoChecklistItem[];
  preventiveFaqs: PreventiveFaqItem[];
  verificationGuide: VerificationGuideData;
  whatsappOnboardingMessage: string;
  businessModel?: 'storefront' | 'service_area';
  hidePhysicalAddress?: boolean;
  suggestedServiceAreas?: string[];
  nfcPocketReviewGuide?: {
    title: string;
    steps: string[];
    samplePitch: string;
  };
  reviewVelocityPlan?: {
    currentReviews: number;
    targetTop3Reviews: number;
    neededReviews: number;
    reviewsPerWeek: number;
    weeksToTop3: number;
  };
  monthlyPostsBooster?: {
    week: number;
    type: string;
    title: string;
    body: string;
    callToAction: string;
  }[];
  // Audit mode additions
  healthScore?: number;
  criticalGaps?: string[];
  topCompetitorInsights?: string;
  actionRoadmap?: ActionRoadmapItem[];
}

interface StudioDossierRecord {
  id: string;
  advisorId: string;
  advisorName: string;
  advisorPhone?: string;
  advisorType?: 'internal_advisor' | 'partner_agency' | 'founder';
  country?: string;
  clientName: string;
  contactName?: string;
  contactCompany?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactRole?: string;
  category: string;
  city: string;
  neighborhood?: string;
  googleUrl?: string;
  mode: 'create' | 'audit' | 'rescue' | 'appeal';
  businessModel?: 'storefront' | 'service_area';
  status: 'draft' | 'presented' | 'closed';
  closingStatus?: 'prestigia_subscriber' | 'setup_paid' | 'proposal_sent' | 'negotiating' | 'lead_draft';
  setupFeeChargedUsd?: number;
  monthlyPlanUsd?: number;
  prestigiaPlan?: 'standard' | 'elite' | 'enterprise' | 'none';
  paymentMethod?: string;
  closingNotes?: string;
  deletedByAdvisor?: boolean;
  deletedAt?: string;
  data: any;
  createdAt: string;
  updatedAt: string;
}

const CATEGORY_OPTIONS_ES = [
  'Restaurante / Gastronomía / Gastrobar',
  'Cafetería / Panadería / Pastelería',
  'Salud / Clínica Médica / Consultorio',
  'Odontología / Clínica Dental',
  'Estética / Spa / Belleza / Barbería',
  'Automotriz / Taller Mecánico / Lavadero',
  'Fitness / Gimnasio / Centro de Entrenamiento',
  'Servicios Profesionales / B2B / Legal / Contable',
  'Retail / Tienda de Moda / Comercio',
  'Veterinaria / Cuidado de Mascotas',
  'Hotelería / Hospedaje / Turismo',
  'Educación / Academia / Cursos',
];

const CATEGORY_OPTIONS_EN = [
  'Restaurant / Dining / Gastrobar',
  'Cafe / Bakery / Pastry Shop',
  'Medical Clinic / Healthcare / Practice',
  'Dental Clinic / Cosmetic Dentistry',
  'Beauty Salon / Spa / Barber Shop',
  'Automotive / Mechanic Shop / Detailing',
  'Fitness Center / Gym / Personal Training',
  'Professional Services / Legal / Accounting',
  'Retail / Fashion Boutique / Store',
  'Veterinary Clinic / Pet Care',
  'Hospitality / Hotel / Tourism',
  'Education / Academy / Training Courses',
];

const CATEGORY_OPTIONS = CATEGORY_OPTIONS_ES;

const WORLD_REGIONS_GEO: Record<string, string[]> = {
  // América
  'Colombia': [
    'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga',
    'Pereira', 'Manizales', 'Santa Marta', 'Cúcuta', 'Ibagué', 'Villavicencio',
    'Pasto', 'Armenia', 'Montería', 'Neiva', 'Valledupar', 'Popayán', 'Sincelejo', 'Tunja'
  ],
  'Venezuela': [
    'Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay',
    'Ciudad Guayana', 'San Cristóbal', 'Lechería', 'Puerto La Cruz',
    'Maturín', 'Mérida', 'Porlamar', 'Barinas', 'Cabimas', 'Punto Fijo',
    'Puerto Cabello', 'Los Teques', 'Guatire', 'Cumaná', 'El Tigre'
  ],
  'México': [
    'Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana',
    'Querétaro', 'Cancún', 'Mérida', 'León', 'San Luis Potosí', 'Toluca',
    'Chihuahua', 'Hermosillo', 'Aguascalientes', 'Veracruz', 'Mazatlán', 'Cuernavaca'
  ],
  'Estados Unidos': [
    'Miami', 'Orlando', 'Tampa', 'New York', 'Los Angeles', 'Houston',
    'Chicago', 'Dallas', 'Las Vegas', 'Atlanta', 'Phoenix', 'San Antonio',
    'San Diego', 'Austin', 'San Francisco', 'Seattle', 'Boston', 'Denver'
  ],
  'España': [
    'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga',
    'Murcia', 'Palma de Mallorca', 'Las Palmas', 'Bilbao', 'Alicante',
    'Córdoba', 'Valladolid', 'Vigo', 'Gijón', 'Granada', 'A Coruña', 'Vitoria'
  ],
  'Argentina': [
    'Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata',
    'San Miguel de Tucumán', 'Mar del Plata', 'Salta', 'Santa Fe', 'San Juan', 'Neuquén', 'Bariloche'
  ],
  'Chile': [
    'Santiago', 'Valparaíso', 'Concepción', 'Viña del Mar', 'Antofagasta',
    'Temuco', 'La Serena', 'Rancagua', 'Puerto Montt', 'Iquique', 'Arica', 'Talca'
  ],
  'Perú': [
    'Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura', 'Cusco',
    'Huancayo', 'Iquitos', 'Tacna', 'Pucallpa', 'Chimbote'
  ],
  'Ecuador': [
    'Quito', 'Guayaquil', 'Cuenca', 'Santo Domingo', 'Machala',
    'Manta', 'Portoviejo', 'Loja', 'Ambato', 'Esmeraldas', 'Riobamba'
  ],
  'Panamá': [
    'Ciudad de Panamá', 'San Miguelito', 'David', 'Colón', 'La Chorrera',
    'Santiago de Veraguas', 'Penonomé', 'Chitré'
  ],
  'República Dominicana': [
    'Santo Domingo', 'Santiago de los Caballeros', 'Punta Cana', 'La Romana',
    'Puerto Plata', 'San Pedro de Macorís', 'San Cristóbal', 'Higüey'
  ],
  'Costa Rica': [
    'San José', 'Alajuela', 'Cartago', 'Heredia', 'Liberia',
    'Puntarenas', 'Limón', 'San Carlos', 'Pérez Zeledón'
  ],
  'Guatemala': [
    'Ciudad de Guatemala', 'Mixco', 'Villa Nueva', 'Quetzaltenango',
    'Escuintla', 'Antigua Guatemala', 'Cobán', 'San Miguel Petapa'
  ],
  'Uruguay': [
    'Montevideo', 'Maldonado', 'Punta del Este', 'Salto', 'Ciudad de la Costa',
    'Paysandú', 'Las Piedras', 'Rivera'
  ],
  'Canadá': [
    'Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa',
    'Edmonton', 'Quebec City', 'Winnipeg', 'Hamilton', 'Halifax'
  ],
  'Brasil': [
    'São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza',
    'Belo Horizonte', 'Curitiba', 'Recife', 'Porto Alegre', 'Florianópolis', 'Campinas'
  ],
  // Europa
  'Reino Unido': [
    'London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow',
    'Liverpool', 'Bristol', 'Leeds', 'Sheffield', 'Belfast', 'Newcastle'
  ],
  'Francia': [
    'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice',
    'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille', 'Rennes'
  ],
  'Italia': [
    'Roma', 'Milano', 'Napoli', 'Torino', 'Palermo',
    'Genova', 'Bologna', 'Firenze', 'Bari', 'Catania', 'Verona', 'Venezia'
  ],
  'Alemania': [
    'Berlin', 'München', 'Frankfurt', 'Hamburg', 'Köln',
    'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dortmund', 'Essen', 'Bremen', 'Dresden'
  ],
  'Portugal': [
    'Lisboa', 'Porto', 'Vila Nova de Gaia', 'Amadora', 'Braga',
    'Coimbra', 'Funchal', 'Setúbal', 'Faro', 'Aveiro', 'Guimarães'
  ],
};

const COUNTRY_ALIASES: Record<string, string> = {
  colombia: 'Colombia',
  venezuela: 'Venezuela',
  'república bolivariana de venezuela': 'Venezuela',
  'republica bolivariana de venezuela': 'Venezuela',
  mexico: 'México',
  méxico: 'México',
  'estados unidos': 'Estados Unidos',
  'united states': 'Estados Unidos',
  usa: 'Estados Unidos',
  eeuu: 'Estados Unidos',
  'ee.uu.': 'Estados Unidos',
  'u.s.a.': 'Estados Unidos',
  spain: 'España',
  españa: 'España',
  argentina: 'Argentina',
  chile: 'Chile',
  peru: 'Perú',
  perú: 'Perú',
  ecuador: 'Ecuador',
  panama: 'Panamá',
  panamá: 'Panamá',
  'republica dominicana': 'República Dominicana',
  'república dominicana': 'República Dominicana',
  'dominican republic': 'República Dominicana',
  'costa rica': 'Costa Rica',
  guatemala: 'Guatemala',
  uruguay: 'Uruguay',
  canada: 'Canadá',
  canadá: 'Canadá',
  brazil: 'Brasil',
  brasil: 'Brasil',
  'united kingdom': 'Reino Unido',
  uk: 'Reino Unido',
  'reino unido': 'Reino Unido',
  france: 'Francia',
  francia: 'Francia',
  italy: 'Italia',
  italia: 'Italia',
  germany: 'Alemania',
  alemania: 'Alemania',
  portugal: 'Portugal',
};

function parseAddressGeo(
  rawAddress: string,
  fallbackCountry: string = 'Colombia',
  fallbackCity: string = 'Bogotá',
  fallbackNeighborhood: string = ''
): { country: string; city: string; neighborhood: string } {
  if (!rawAddress) {
    return { country: fallbackCountry, city: fallbackCity, neighborhood: fallbackNeighborhood };
  }
  const cleaned = rawAddress.toLowerCase();

  let detectedCountry = fallbackCountry;
  for (const [alias, canonical] of Object.entries(COUNTRY_ALIASES)) {
    if (cleaned.includes(alias)) {
      detectedCountry = canonical;
      break;
    }
  }

  const citiesList = WORLD_REGIONS_GEO[detectedCountry] || [];
  let detectedCity = fallbackCity;
  let cityFound = false;
  for (const c of citiesList) {
    if (cleaned.includes(c.toLowerCase())) {
      detectedCity = c;
      cityFound = true;
      break;
    }
  }

  const parts = rawAddress.split(',').map((p) => p.trim());
  let detectedNeighborhood = fallbackNeighborhood;
  if (!cityFound) {
    if (parts.length >= 3) {
      detectedCity = parts[parts.length - 2] || fallbackCity;
      detectedNeighborhood = parts[parts.length - 3] || fallbackNeighborhood;
    } else if (parts.length >= 2) {
      detectedCity = parts[parts.length - 2] || fallbackCity;
    }
  } else {
    if (parts.length >= 3) {
      detectedNeighborhood = parts[parts.length - 3] || fallbackNeighborhood;
    }
  }

  return {
    country: detectedCountry,
    city: detectedCity,
    neighborhood: detectedNeighborhood,
  };
}

function mapDetectedCategoryToPrestigia(
  primaryCategory: string,
  detectedCategories: string[] = [],
  isEn: boolean = false
): string {
  const combined = (primaryCategory + ' ' + (detectedCategories || []).join(' ')).toLowerCase();
  const options = isEn ? CATEGORY_OPTIONS_EN : CATEGORY_OPTIONS_ES;

  if (
    combined.includes('restauran') ||
    combined.includes('bar') ||
    combined.includes('comida') ||
    combined.includes('pizza') ||
    combined.includes('burger') ||
    combined.includes('hamburg') ||
    combined.includes('parrilla') ||
    combined.includes('pasta') ||
    combined.includes('gastro') ||
    combined.includes('asador')
  ) {
    return options[0];
  }
  if (
    combined.includes('caf') ||
    combined.includes('panader') ||
    combined.includes('pasteler') ||
    combined.includes('bakery') ||
    combined.includes('coffee')
  ) {
    return options[1];
  }
  if (
    combined.includes('odont') ||
    combined.includes('dental') ||
    combined.includes('dentist')
  ) {
    return options[3];
  }
  if (
    combined.includes('salud') ||
    combined.includes('medic') ||
    combined.includes('clinic') ||
    combined.includes('doctor') ||
    combined.includes('hospital')
  ) {
    return options[2];
  }
  if (
    combined.includes('belleza') ||
    combined.includes('spa') ||
    combined.includes('barber') ||
    combined.includes('estetica') ||
    combined.includes('salon') ||
    combined.includes('unas') ||
    combined.includes('hair')
  ) {
    return options[4];
  }
  if (
    combined.includes('auto') ||
    combined.includes('taller') ||
    combined.includes('mecanic') ||
    combined.includes('lavadero') ||
    combined.includes('detailing') ||
    combined.includes('car')
  ) {
    return options[5];
  }
  if (
    combined.includes('gym') ||
    combined.includes('gimnasio') ||
    combined.includes('fitness') ||
    combined.includes('crossfit') ||
    combined.includes('entren')
  ) {
    return options[6];
  }
  if (
    combined.includes('abogad') ||
    combined.includes('legal') ||
    combined.includes('contab') ||
    combined.includes('consult') ||
    combined.includes('inmobili') ||
    combined.includes('real estate')
  ) {
    return options[7];
  }
  if (
    combined.includes('tienda') ||
    combined.includes('retail') ||
    combined.includes('moda') ||
    combined.includes('ropa') ||
    combined.includes('boutique') ||
    combined.includes('zapater') ||
    combined.includes('joyer')
  ) {
    return options[8];
  }
  if (
    combined.includes('veterinar') ||
    combined.includes('mascot') ||
    combined.includes('pet') ||
    combined.includes('perro') ||
    combined.includes('gato')
  ) {
    return options[9];
  }
  if (
    combined.includes('hotel') ||
    combined.includes('hospedaj') ||
    combined.includes('hostal') ||
    combined.includes('turismo') ||
    combined.includes('resort')
  ) {
    return options[10];
  }
  if (
    combined.includes('escuela') ||
    combined.includes('colegio') ||
    combined.includes('academia') ||
    combined.includes('curso') ||
    combined.includes('educacion') ||
    combined.includes('universidad')
  ) {
    return options[11];
  }

  return options[0];
}

function getAverageTicketByNiche(categoryOrName: string): number {
  const c = categoryOrName.toLowerCase();
  if (c.includes('médic') || c.includes('medic') || c.includes('salud') || c.includes('doctor') || c.includes('hospital')) return 180;
  if (c.includes('odont') || c.includes('dental') || c.includes('dentist')) return 250;
  if (c.includes('estétic') || c.includes('spa') || c.includes('dermatolog')) return 95;
  if (c.includes('veterinar') || c.includes('pet') || c.includes('mascota')) return 80;
  if (c.includes('evento') || c.includes('banquet') || c.includes('boda') || c.includes('wedding')) return 850;
  if (c.includes('taller') || c.includes('mecánic') || c.includes('automot') || c.includes('auto')) return 160;
  if (c.includes('peluquer') || c.includes('barber') || c.includes('belleza') || c.includes('salon')) return 35;
  if (c.includes('gimnasio') || c.includes('gym') || c.includes('fitness') || c.includes('crossfit')) return 55;
  if (c.includes('legal') || c.includes('abogad') || c.includes('consultor') || c.includes('contad') || c.includes('b2b')) return 350;
  if (c.includes('hotel') || c.includes('hospedaje') || c.includes('resort')) return 150;
  if (c.includes('tienda') || c.includes('retail') || c.includes('boutique') || c.includes('comercio')) return 45;
  if (c.includes('caf') || c.includes('panader') || c.includes('bakery') || c.includes('coffee')) return 15;
  // Standard restaurant / gastronomy
  return 30;
}

function getDefaultKeywordByNiche(cat: string, cityName?: string, isEn: boolean = false): string {
  const c = cat.toLowerCase();
  const cty = cityName ? (isEn ? ` in ${cityName}` : ` en ${cityName}`) : '';
  if (c.includes('odont') || c.includes('dental') || c.includes('dentist')) {
    return isEn ? `Dental Clinic / Dentist${cty}` : `Clínica Dental / Odontología${cty}`;
  }
  if (c.includes('médic') || c.includes('medic') || c.includes('salud') || c.includes('doctor')) {
    return isEn ? `Medical Clinic / Doctor${cty}` : `Clínica Médica / Consulta Especializada${cty}`;
  }
  if (c.includes('veterinar') || c.includes('pet') || c.includes('mascota')) {
    return isEn ? `Veterinary Clinic / Pet Care${cty}` : `Clínica Veterinaria / Urgencias Mascotas${cty}`;
  }
  if (c.includes('evento') || c.includes('banquet') || c.includes('boda')) {
    return isEn ? `Event Hall / Banquets${cty}` : `Salón de Eventos / Banquetes${cty}`;
  }
  if (c.includes('taller') || c.includes('mecánic') || c.includes('automot')) {
    return isEn ? `Auto Repair / Mechanic Workshop${cty}` : `Taller Mecánico / Taller Automotriz${cty}`;
  }
  if (c.includes('peluquer') || c.includes('barber') || c.includes('belleza') || c.includes('salon')) {
    return isEn ? `Hair Salon / Barbershop${cty}` : `Peluquería / Barbería / Salón de Belleza${cty}`;
  }
  if (c.includes('estétic') || c.includes('spa')) {
    return isEn ? `Medical Spa / Aesthetics${cty}` : `Centro de Estética / Spa${cty}`;
  }
  if (c.includes('gimnasio') || c.includes('gym') || c.includes('fitness')) {
    return isEn ? `Gym / Fitness Center${cty}` : `Gimnasio / Centro Fitness${cty}`;
  }
  if (c.includes('legal') || c.includes('abogad') || c.includes('b2b')) {
    return isEn ? `Law Firm / Professional Services${cty}` : `Bufete de Abogados / Asesoría Legal${cty}`;
  }
  if (c.includes('hotel') || c.includes('hospedaje')) {
    return isEn ? `Boutique Hotel / Accommodation${cty}` : `Hotel / Alojamiento${cty}`;
  }
  if (c.includes('caf') || c.includes('panader')) {
    return isEn ? `Coffee Shop / Bakery${cty}` : `Cafetería / Panadería Especializada${cty}`;
  }
  if (c.includes('tienda') || c.includes('retail')) {
    return isEn ? `Boutique / Retail Store${cty}` : `Tienda / Comercio Local${cty}`;
  }
  return isEn ? `Restaurante / Gastronomía${cty}` : `Restaurante / Gastronomía${cty}`;
}

const UI_TEXT = {
  es: {
    tagline: 'Suite de Creación & Optimización Google Maps',
    loginProfile: 'Ingresar Perfil',
    switchProfile: 'Cambiar',
    logoutBtn: 'Salir',
    downloadPdf: 'Descargar PDF',
    tabCreate: '1. Crear Ficha',
    tabAudit: '2. Auditar & Optimizar',
    tabRescue: '3. Rescatar Ficha',
    tabAppeals: '4. Apelar Reseñas 1-3★',
    tabTools: '5. Armas Top 3',
    tabDossiers: '6. Mis Clientes',
    tabGuide: '7. Guía Google',
    tabPitch: '8. Guion Comercial',
    tabNetwork: '9. Red Asesores B2B',
    mod1Badge: 'Módulo 1: Para Negocios sin Google Maps',
    mod1Title: 'Constructor de Ficha Ganadora (Arquitectura Top 3)',
    mod1Desc: 'Ingresa los datos básicos del negocio. La inteligencia artificial de Prestigia generará el expediente técnico exacto (categorías secretas, título optimizado, copy de 745 caracteres, catálogo y guía de verificación) para configurar la ficha en Google en menos de 10 minutos.',
    mod1Time: 'Tiempo estimado de montaje',
    mod1TimeVal: '< 10 Minutos',
    formHeader1: '1. Datos Básicos del Cliente',
    opModel: 'Modelo Operativo del Negocio *',
    storefront: '🏬 Local Físico',
    serviceArea: '💼 Independiente / A Domicilio',
    sabNoticeTitle: 'Blindaje Anti-Suspensión Activo (SAB)',
    sabNoticeDesc: 'Google prohíbe publicar direcciones residenciales. La dirección física se mantendrá oculta y Google posicionará el perfil en las zonas o barrios de cobertura que indiques.',
    bizName: 'Nombre Comercial o del Especialista *',
    bizNamePlaceholder: 'Ej: La Parrilla de Andrés o Dr. Carlos Gómez',
    sector: 'Nicho / Sector Comercial *',
    city: 'Ciudad o Sede Principal *',
    cityPlaceholder: 'Ej: Bogotá',
    neighborhood: 'Barrio o Localidad *',
    neighborhoodPlaceholder: 'Ej: Chapinero',
    coverageAreas: 'Zonas o Barrios de Cobertura a Domicilio *',
    coveragePlaceholder: 'Ej: Zona Norte, Chicó, Usaquén, Salitre, Chía',
    specialties: '3 Platos o Servicios Más Vendidos *',
    specialtiesPlaceholder: 'Ej: Hamburguesas artesanales, costillas BBQ, cócteles',
    phone: 'WhatsApp Comercial de Atención *',
    phonePlaceholder: 'Ej: +57 300 123 4567',
    btnGenerate: 'Generar Configuración Ganadora en 1-Clic',
    btnGenerating: 'Generando Arquitectura Top 3 con IA...',
    btnCopyWhatsapp: 'Copiar Kit de Solicitud de Fotos y Video',
    readyTitle: 'Listo para Generar el Perfil Ganador',
    readyDesc: 'Ingresa el nombre del negocio a la izquierda y presiona el botón para generar las categorías maestras, título anti-suspensión, descripción persuasiva y checklist fotográfico.',
    consultingAi: 'Consultando Algoritmo de Google Maps',
    consultingAiDesc: 'Analizando taxonomía oficial de categorías, palabras clave de compra local y redactando descripción comercial de 745 caracteres...',
    saveDossier: 'Guardar en Cartera',
    mod2Badge: 'Módulo 2: Reconocimiento API de Google & Auditoría Forense',
    mod2Title: 'Auditoría Forense de Brechas & Upgrade al Top 3',
    mod2Desc: 'Solo ingresa la ficha (enlace o nombre de Google Maps). Prestigia reconocerá todos los datos en tiempo real con la API de Google (calificación, reseñas, categoría, dirección) y Gemini ejecutará la auditoría forense al instante.',
    mod2Target: 'Objetivo de Ascenso',
    mod2TargetVal: 'Conquista Top 3',
    auditFormHeader: '1. Reconocimiento de Ficha en Google Maps',
    auditInputLabel: 'Enlace de Google Maps o Nombre Comercial',
    auditInputPlaceholder: 'Pega el enlace (maps.app.goo.gl/...) o escribe Nombre Comercial + Ciudad',
    btnScanAndAudit: 'Reconocer Ficha con API de Google & Auditar en 1-Clic',
    btnScanningAndAuditing: 'Reconociendo Ficha en Google Maps & Auditando con Gemini...',
    verifiedListingBadge: 'Ficha Reconocida en Vivo por Google Maps',
    adjustManuallyLabel: 'Ajustar datos detectados manualmente',
    adjustManuallyHide: 'Ocultar ajustes manuales',
    pasteBtn: 'Pegar',
    auditBizName: 'Nombre Comercial Detectado *',
    auditBizNamePlaceholder: 'Ej: La Suiza Parrilla',
    googleUrl: 'Enlace Oficial de Google Maps',
    googleUrlPlaceholder: 'https://maps.google.com/?cid=...',
    currentRating: 'Calificación Detectada ★',
    publicReviews: 'Opiniones Detectadas',
    auditCityPlaceholder: 'Ej: Medellín o Bogotá',
    auditNeighborhoodPlaceholder: 'Ej: El Poblado o Usaquén',
    btnAudit: 'Re-escanear Brechas & Generar Hoja de Ruta',
    btnAuditing: 'Analizando Brechas frente al Top 3...',
    readyAuditTitle: 'Listo para Auditar la Ficha en Google Maps',
    readyAuditDesc: 'Pega el enlace de Google Maps a la izquierda y presiona el botón. La API de Google extraerá las métricas reales y la IA generará el diagnóstico forense, brechas y hoja de ruta al Top 3.',
    consultingAuditAi: 'Auditando Ficha con Algoritmo Google Maps & Gemini',
    consultingAuditDesc: 'Calculando brechas de visibilidad, analizando el Top 3 local de la zona y estructurando la hoja de ruta de 5 pasos...',
    healthScore: 'Puntaje de Salud SEO Local',
    vulnerableBadge: 'Ficha Vulnerable (-45% visibilidad)',
    save: 'Guardar',
    printPdf: 'Imprimir PDF',
    criticalGapsTitle: 'Brechas Críticas Detectadas en la Ficha',
    competitorBenchmarkTitle: 'Análisis Frente a los 3 Líderes del Top 3 en',
    roadmapTitle: 'Hoja de Ruta de Ascenso al Top 3 (5 Pasos)',
    stepLabel: 'Paso',
    optimizedCopyTitle: 'Textos Optimizados Listos para Pegar en Google',
    copyNewDesc: 'Copiar Nueva Descripción',
  },
  en: {
    tagline: 'Google Maps Creation & Top 3 Optimization Suite',
    loginProfile: 'Log In Profile',
    switchProfile: 'Switch',
    logoutBtn: 'Log out',
    downloadPdf: 'Download PDF',
    tabCreate: '1. Build Listing',
    tabAudit: '2. Audit & Optimize',
    tabRescue: '3. Rescue Listing',
    tabAppeals: '4. Appeal 1-3★ Reviews',
    tabTools: '5. Top 3 Weapons',
    tabDossiers: '6. My Clients',
    tabGuide: '7. Google Guide',
    tabPitch: '8. Sales Pitch',
    tabNetwork: '9. B2B Network',
    mod1Badge: 'Module 1: For Businesses Without Google Maps',
    mod1Title: 'Winning Listing Builder (Top 3 Architecture)',
    mod1Desc: 'Enter the basic business details. Prestigia AI will generate the exact technical blueprint (secret categories, optimized title, 745-char copy, catalog, and verification guide) to set up on Google in under 10 minutes.',
    mod1Time: 'Estimated Setup Time',
    mod1TimeVal: '< 10 Minutes',
    formHeader1: '1. Basic Client Information',
    opModel: 'Operating Business Model *',
    storefront: '🏬 Physical Storefront',
    serviceArea: '💼 Independent / Service Area',
    sabNoticeTitle: 'SAB Anti-Suspension Protection Active',
    sabNoticeDesc: 'Google strictly prohibits publishing residential addresses. The physical address will remain completely hidden to clients, ranking your profile across your target service areas.',
    bizName: 'Business or Specialist Name *',
    bizNamePlaceholder: 'e.g. Apex Detailing or Dr. Sarah Johnson',
    sector: 'Industry / Business Niche *',
    city: 'City or Main Metro Area *',
    cityPlaceholder: 'e.g. Miami, FL',
    neighborhood: 'Neighborhood / District *',
    neighborhoodPlaceholder: 'e.g. Brickell / 33131',
    coverageAreas: 'Target Service Coverage Areas *',
    coveragePlaceholder: 'e.g. Brickell, Downtown, Coral Gables, South Beach',
    specialties: 'Top 3 Best-Selling Products or Services *',
    specialtiesPlaceholder: 'e.g. Cosmetic Dentistry, Teeth Whitening, Veneers',
    phone: 'Commercial WhatsApp / Phone *',
    phonePlaceholder: 'e.g. +1 305 123 4567',
    btnGenerate: 'Generate Winning Setup in 1-Click',
    btnGenerating: 'Generating Top 3 Architecture with AI...',
    btnCopyWhatsapp: 'Copy Photo & Video Request Message',
    readyTitle: 'Ready to Build Winning Profile',
    readyDesc: 'Enter the business name on the left and click the button to generate master categories, anti-suspension title, persuasive copy, and photo checklist.',
    consultingAi: 'Querying Google Maps Algorithm',
    consultingAiDesc: 'Analyzing official category taxonomy, local buyer intent keywords, and drafting 745-character SEO commercial copy...',
    saveDossier: 'Save to Portfolio',
    mod2Badge: 'Module 2: Google API Live Recognition & Forensic Audit',
    mod2Title: 'Forensic Gap Audit & Top 3 Upgrade',
    mod2Desc: 'Simply provide the Google Maps listing (URL or business name). Prestigia will recognize all real-time metrics with Google Maps API (rating, reviews, category, address) and Gemini will execute the forensic audit instantly.',
    mod2Target: 'Ranking Goal',
    mod2TargetVal: 'Conquering Top 3',
    auditFormHeader: '1. Google Maps Listing Recognition',
    auditInputLabel: 'Google Maps Link or Business Name',
    auditInputPlaceholder: 'Paste Google Maps link (maps.app.goo.gl/...) or type Business Name + City',
    btnScanAndAudit: 'Recognize Listing with Google API & Audit in 1-Click',
    btnScanningAndAuditing: 'Recognizing Profile & Auditing with Gemini...',
    verifiedListingBadge: 'Live Verified Google Maps Profile',
    adjustManuallyLabel: 'Manually adjust detected listing data',
    adjustManuallyHide: 'Hide manual adjustments',
    pasteBtn: 'Paste',
    auditBizName: 'Detected Business Name *',
    auditBizNamePlaceholder: 'e.g. Miami Smile Center',
    googleUrl: 'Official Google Maps URL',
    googleUrlPlaceholder: 'https://maps.google.com/?cid=...',
    currentRating: 'Detected Rating ★',
    publicReviews: 'Detected Reviews',
    auditCityPlaceholder: 'e.g. Miami, FL or Austin, TX',
    auditNeighborhoodPlaceholder: 'e.g. Brickell or Downtown',
    btnAudit: 'Re-scan Gaps & Generate Action Roadmap',
    btnAuditing: 'Analyzing Gaps Against Top 3 Leaders...',
    readyAuditTitle: 'Ready to Audit Google Maps Profile',
    readyAuditDesc: 'Paste the Google Maps link on the left and click the button. Google Maps API will pull live metrics and AI will generate the forensic score, critical gaps, and 5-step roadmap to the Top 3.',
    consultingAuditAi: 'Auditing Profile with Google Maps Algorithm & Gemini',
    consultingAuditDesc: 'Calculating visibility gaps, benchmarking against local Top 3 leaders, and structuring the 5-step action roadmap...',
    healthScore: 'Local SEO Health Score',
    vulnerableBadge: 'Vulnerable Profile (-45% visibility)',
    save: 'Save',
    printPdf: 'Print PDF',
    criticalGapsTitle: 'Critical Gaps Detected in Profile',
    competitorBenchmarkTitle: 'Top 3 Competitor Benchmark in',
    roadmapTitle: 'Roadmap to Top 3 (5 Steps)',
    stepLabel: 'Step',
    optimizedCopyTitle: 'Optimized Copy Ready to Paste into Google',
    copyNewDesc: 'Copy New Description',
  },
};

const TXT_TOOLS = {
  es: {
    badge: 'Arsenal de Cierre de Alto Valor • Estilo BrightLocal & Local Falcon',
    title: '3 Armas Top 3 de Cierre Comercial',
    desc: 'Herramientas de venta visual y espionaje competitivo para demostrarle al cliente cuánto dinero pierde hoy y cómo Prestigia lo posiciona en la cima.',
    activeAlgo: '⚡ Algoritmo 2026 Activo',
    tab1: '1. Simulador Geo-Grid 3x3',
    tab2: '2. Balanza Financiera (ROI)',
    tab3: '3. Rival Spy (Cara a Cara)',
    tab6: '6. Rescate de Ficha (Ownership Claim)',
    rescueTitle: '🛡️ Rescue Radar: Rescate y Reclamación de Ficha Google Maps',
    rescueDesc: 'Protocolo oficial paso a paso para recuperar el control legal de una ficha existente cuando el dueño no tiene acceso, sin perder reseñas, fotos ni antigüedad.',
    rescueScenarioLabel: 'Selecciona el Diagnóstico Actual de la Ficha en Google Maps:',
    scenario1Title: 'Caso 1: Ficha Huérfana / "Reclamar esta empresa" (Sin Dueño Reclamado)',
    scenario1Subtitle: 'Aparece "¿Eres el propietario?" o "Reclamar esta empresa". Creada por la comunidad o bots de Google. Nadie tiene el control legal.',
    scenario2Title: 'Caso 2: Ficha Reclamada por Tercero (Ex-agencia o Ex-empleado)',
    scenario2Subtitle: 'Google indica "Esta empresa ya está gestionada por otro usuario". Activación del Protocolo Oficial de 72 Horas de Google.',
    scenario3Title: 'Caso 3: Solicitud Rechazada por Tercero de Mala Fe (Apelación Legal)',
    scenario3Subtitle: 'El tercero rechazó la entrega. Activación de Expediente Probatorio ante el Soporte Técnico de Google.',
    rescueBtnDirectClaim: 'Abrir Google Business Profile para Reclamar',
    rescueSearchLabel: 'Reconocer Ficha con Google Maps API (1 Clic)',
    rescueSearchPlaceholder: 'Pega enlace de Google Maps (maps.app.goo.gl/...) o Nombre + Ciudad',
    rescueBtnScan: 'Reconocer Ficha con Google API',
    rescueBtnScanning: 'Consultando Google Maps API en Vivo...',
    rescueSyncBanner: 'Ficha detectada en sesión:',
    rescueSyncBtn: 'Cargar en Rescate',
    rescueDetectedBadge: 'Ficha Existente Detectada en Google Maps',
    rescueClaimViaMaps: 'Abrir Ficha en Google Maps para Reclamar',
    rescueWhatsappScriptTitle: 'Guion de WhatsApp para Explicar el Rescate al Cliente',
    rescueDocsTitle: 'Checklist de Evidencias de Titularidad Probatoria',
    rescuePricingTitle: 'Propuesta de Honorarios por Rescate (Setup Fee)',
    toolsScannerLabel: 'Reconocer Ficha con Google Maps API (Armas de Cierre)',
    toolsScannerPlaceholder: 'Pega enlace de Google Maps (maps.app.goo.gl/...) o Nombre + Ciudad',
    toolsScannerBtn: 'Reconocer Ficha',
    toolsScannerScanning: 'Consultando Google Maps en Vivo...',
    toolsSyncBanner: 'Ficha activa en sesión:',
    toolsSyncBtn: 'Cargar en Armas de Cierre',
    toolsDetectedBadge: 'Ficha Vinculada a las Armas de Cierre',
    toolsKeywordPlaceholder: 'Palabra clave a simular (ej: Clínica Dental en Bogotá)',
    toolsEmptyTitle: 'Vincula una Ficha de Google Maps para Activar las Armas de Venta',
    toolsEmptyDesc: 'Pega el enlace de Google Maps o escribe el nombre del negocio y su ciudad para cargar su posición satelital real, calcular la pérdida de facturación exacta y activar la batalla de espionaje contra sus rivales.',
    toolsEmptyScanBtn: 'Activar Armas con Google Maps API',
    toolsEmptyDemoBtn: 'O explorar con datos de demostración interactiva →',
    toolsChangeListing: 'Cambiar Ficha / Limpiar',
    rivalScannerLabel: 'Escanear Competidor Más Cercano con Google Maps API (1 Clic)',
    rivalScannerPlaceholder: 'Pega enlace de Google Maps o Nombre del Rival + Ciudad',
    rivalScannerBtn: 'Escanear Rival con Google',
    rivalScannerScanning: 'Consultando Competidor en Vivo...',
    geogridTitle: '🗺️ Simulador de Posición Geo-Grid 3x3 (Local Falcon Style)',
    geogridDesc: 'Demuestra visualmente cómo cae el ranking del cliente a medida que nos alejamos de su ubicación.',
    radiusLabel: 'Radio',
    satMap: 'Mapa Satelital de Cobertura',
    keyword: 'Palabra clave:',
    legendTop3: 'Puesto 1 al 3 (Se llevan el 84% de llamadas)',
    legendDropped: 'Puesto 4+ (Invisibles)',
    diagAdvisor: 'Diagnóstico para el Asesor:',
    diagAdvisorBody: (name: string, rad: string, kw?: string) =>
      `"Don ${name || 'Cliente'}, cuando usted busca parado en su propio local aparece de #1${kw ? ` para '${kw}'` : ''}. Pero cuando una persona busca a solo ${rad} de distancia en su mismo barrio, su negocio cae al puesto #8 o #14. Toda esa clientela se la están llevando sus 3 competidores más cercanos."`,
    solutionPrestigia: 'Solución con Prestigia:',
    solutionPrestigiaBody:
      'Con la inyección de subcategorías secundarias, menciones de vecindario en la descripción y 8 reseñas semanales geolocalizadas, extendemos el radio verde a toda la ciudad en 90 días.',
    roiTitle: 'Balanza Financiera Top 3: Fuga Actual vs. Ganancia con Prestigia',
    roiDesc: 'Compara con exactitud matemática el dinero que se fuga hoy a los rivales del podio frente a la nueva facturación conquistada al dominar el Top 3.',
    avgTicket: 'Ticket Promedio por Venta/Servicio (USD)',
    avgTicketSub: 'Gasto promedio de un cliente en cada consumo o cita.',
    avgFrequency: 'Frecuencia / Visitas al Año por Cliente',
    avgFrequencySub: 'Veces que el cliente vuelve a comprar en 12 meses (LTV).',
    freqOpt1: '1x (Compra única puntual / Servicio esporádico)',
    freqOpt2: '3x (Salud, estética, automotriz, servicios profesionales)',
    freqOpt3: '6x (Alta recurrencia / Gastronomía y comercio)',
    freqOpt4: '12x (Suscripciones o consumo mensual recurrente)',
    currentRank: 'Posición Actual en Google Maps',
    rankOpt1: 'Puesto #4 (Al borde del Top 3 • Pierde 35% de clics)',
    rankOpt2: 'Puesto #8 (Segunda vista • Pierde 60% de clics)',
    rankOpt3: 'Puesto #15+ (Invisible • Pierde 85%+ de clics)',
    currentRankSub: 'Lugar donde aparece hoy al buscar su servicio.',
    searches: 'Búsquedas Mensuales Estimadas en Zona',
    searchesSub: 'Personas buscando este servicio al mes en Google.',
    leakDetected: 'Fuga de Facturación (Sin Prestigia)',
    leakHeading: 'Dinero que tu negocio regala hoy a los 3 rivales del podio:',
    lostPer30Days: 'perdidos cada 30 días',
    lostCalls: 'Llamadas y Clics Perdidos:',
    searchesPerMonth: 'búsquedas/mes',
    lostClientsLabel: 'Clientes que no entraron:',
    newClientsPerMonth: 'clientes perdidos/mes',
    loss12Months: 'Fuga Anual Directa:',
    lossLtv12Months: 'Fuga Anual con Fidelización (LTV):',
    gainDetected: 'Expansión Comercial (Con Prestigia Top 3)',
    gainHeading: 'Nueva facturación conquistada al ingresar al Top 3:',
    gainPer30Days: 'facturados cada 30 días',
    gainCalls: 'Búsquedas y Clics Ganados:',
    gainClientsLabel: 'Clientes Nuevos Ganados:',
    gainNewClientsPerMonth: 'clientes nuevos/mes',
    gain12Months: 'Nueva Facturación Anual:',
    gainLtv12Months: 'Facturación Anual con Fidelización (LTV):',
    netImpactBadge: 'IMPACTO COMERCIAL TOTAL (Fuga Detenida + Nueva Facturación)',
    netImpactTotalAnnual: 'Impacto Económico Total Anual a Favor:',
    roiEstimateLabel: 'Retorno de Inversión (ROI):',
    breakEvenLabel: 'Punto de Amortización:',
    breakEvenText: (clients: number) =>
      `Con recuperar apenas ${clients} ${clients === 1 ? 'cliente' : 'clientes'} al mes, la inversión en Prestigia queda 100% amortizada. Todo cliente adicional es ganancia neta directa.`,
    advisorClose: 'Cierre Definitivo del Asesor:',
    advisorCloseBody: (name: string, monthlyLoss: number, monthlyGain: number, breakEvenClients: number) =>
      `"Don ${name || 'Cliente'}, no contratar Prestigia no le ahorra dinero: le cuesta $${monthlyLoss.toLocaleString()} USD al mes que hoy van directo a los bolsillos de sus 3 competidores. Al ingresar al Top 3, no solo frena esa hemorragia de dinero sino que suma +$${monthlyGain.toLocaleString()} USD en clientes nuevos cada mes. Con recuperar apenas ${breakEvenClients} ${breakEvenClients === 1 ? 'cliente' : 'clientes'} al mes, Prestigia se paga 100% solo y todo lo demás es ganancia neta directa a su cuenta bancaria."`,
    spyTitle: '🥊 Rival Spy: Radar de Espionaje Cara a Cara',
    spyDesc: 'Compara a tu cliente frente a su competidor #1 en Google Maps y genera la radiografía exacta para destronarlo en el Top 3.',
    spyClientCol: 'Tu Negocio (Cliente)',
    spyRivalCol: 'Competidor Líder #1',
    spyRivalPlaceholder: 'ej: Clínica Dental Élite o Rival Principal',
    spyMetricRating: 'Calificación Google Maps',
    spyMetricReviews: 'Volumen de Reseñas',
    spyMetricWeekly: 'Velocidad Semanal Actual',
    spyMetricPhotos: 'Fotos en Ficha',
    spyVerdictTitle: 'Radiografía Algorítmica & Veredicto Prestigia',
    spyAttackPlan: 'Plan de Destronamiento en 3 Movimientos Tácticos:',
    spyMove1: 'Acelerador Digital de Reseñas 5★ con Software Prestigia (+8 reseñas semanales para quebrar su ventaja)',
    spyMove2: 'Inyección de 5 Subcategorías Secundarias que el rival no tiene registradas',
    spyMove3: 'Booster de 30 Días de Google Posts & Geo-Tagging para superar su frescura algorítmica',
    spyPitchBox: 'Argumento de Cierre Agresivo para el Asesor Comercial:',
    spyPitchText: (client: string, rival: string, weeks: number, clientReviews: number, rivalReviews: number) => {
      if (clientReviews >= rivalReviews) {
        return `"Don ${client || 'Cliente'}, mire esta radiografía forense. Su negocio tiene ${clientReviews.toLocaleString()} reseñas y ${rival || 'su competidor'} apenas ${rivalReviews}, pero ellos están en el puesto #1 del Top 3 llevándose a sus clientes. ¿Por qué? Porque para el algoritmo 2026 de Google sus reseñas son del pasado: su ficha hoy está dormida (+1 reseña/semana) mientras el rival tiene actividad constante. Con el software inteligente de reseñas de Prestigia y automatización digital, inyectamos +8 reseñas semanales frescas con palabras clave de compra, duplicamos sus fotos y en menos de 30 días recuperamos el puesto #1 que por historia le pertenece a usted."`;
      }
      const gap = Math.max(1, rivalReviews - clientReviews);
      const years = Math.max(1, Math.round((gap / 52) * 10) / 10);
      return `"Mire ${client || 'Don Cliente'}, ${rival || 'su competidor'} le lleva ${gap} reseñas de ventaja. A su ritmo orgánico actual de +1 reseña por semana, tardaría ${years} AÑOS en alcanzarlos mientras ellos se quedan con el 70% de las llamadas y ventas locales. Al activar Prestigia y nuestro sistema inteligente de captura 5★, aceleramos su velocidad a +8 reseñas 5★ semanales y destronamos a su rival en solo ${weeks} semanas."`;
    },
    spyBtnCopyPitch: 'Copiar Argumento de Cierre',
  },
  en: {
    badge: 'High-Value Conversion Arsenal • BrightLocal & Local Falcon Style',
    title: '3 Top 3 Commercial Closing Weapons',
    desc: 'Visual sales and competitive espionage weapons showing clients how much revenue they lose today and how Prestigia positions them at #1.',
    activeAlgo: '⚡ 2026 Algorithm Active',
    tab1: '1. 3x3 Geo-Grid Heatmap',
    tab2: '2. Financial Balance (ROI)',
    tab3: '3. Rival Spy (Head-to-Head)',
    tab6: '6. Listing Rescue (Ownership Claim)',
    rescueTitle: '🛡️ Rescue Radar: Google Maps Listing Rescue & Ownership Claim',
    rescueDesc: 'Official step-by-step protocol to recover ownership of an existing listing when the owner has no login access, preserving all reviews, photos, and rank.',
    rescueScenarioLabel: 'Select Current Profile Diagnosis on Google Maps:',
    scenario1Title: 'Case 1: Orphan Listing / "Claim this business" (Unclaimed Profile)',
    scenario1Subtitle: 'Displays "Own this business?" or "Claim this business". Created by Google Maps community or automated bots. No verified owner.',
    scenario2Title: 'Case 2: Claimed by Third Party (Ex-agency or Ex-employee)',
    scenario2Subtitle: 'Google displays "This business is already managed by another user". Activates Google 72-Hour Legal Transfer Protocol.',
    scenario3Title: 'Case 3: Request Rejected by Third Party in Bad Faith (Legal Appeal)',
    scenario3Subtitle: 'Third party rejected the transfer. Activates Evidentiary Appeal with Google Support Team.',
    rescueBtnDirectClaim: 'Open Google Business Profile to Claim',
    rescueSearchLabel: 'Recognize Profile via Google Maps API (1-Click)',
    rescueSearchPlaceholder: 'Paste Google Maps link (maps.app.goo.gl/...) or Business Name + City',
    rescueBtnScan: 'Recognize Profile via Google API',
    rescueBtnScanning: 'Querying Google Maps API in Real-time...',
    rescueSyncBanner: 'Session profile detected:',
    rescueSyncBtn: 'Load in Rescue',
    rescueDetectedBadge: 'Existing Listing Verified on Google Maps',
    rescueClaimViaMaps: 'Open Listing on Google Maps to Claim',
    rescueWhatsappScriptTitle: 'WhatsApp Client Advisory Script (Copy & Send)',
    rescueDocsTitle: 'Ownership Proof & Legal Evidence Checklist',
    rescuePricingTitle: 'Rescue Fee Recommendation (Setup Fee)',
    toolsScannerLabel: 'Recognize Profile via Google Maps API (Sales Arsenal)',
    toolsScannerPlaceholder: 'Paste Google Maps link (maps.app.goo.gl/...) or Business Name + City',
    toolsScannerBtn: 'Recognize Profile with Google',
    toolsScannerScanning: 'Querying Google Maps in Real-time...',
    toolsSyncBanner: 'Active profile in session:',
    toolsSyncBtn: 'Load in Sales Arsenal',
    toolsDetectedBadge: 'Profile Recognized on Google Maps',
    toolsKeywordPlaceholder: 'Simulated target keyword (e.g. Dental Clinic in Miami)',
    toolsEmptyTitle: 'Connect a Google Maps Profile to Activate Sales Arsenal',
    toolsEmptyDesc: 'Paste a Google Maps link or enter business name and city to load real satellite positions, calculate exact revenue leakage, and spy on local competitors.',
    toolsEmptyScanBtn: 'Activate Arsenal with Google Maps API',
    toolsEmptyDemoBtn: 'Or explore with interactive demo data →',
    toolsChangeListing: 'Change Profile / Clear',
    rivalScannerLabel: 'Scan Closest Competitor via Google Maps API (1-Click)',
    rivalScannerPlaceholder: 'Paste Google Maps link or Competitor Name + City',
    rivalScannerBtn: 'Scan Competitor with Google',
    rivalScannerScanning: 'Querying Competitor in Real-time...',
    geogridTitle: '🗺️ 3x3 Geo-Grid Position Heatmap (Local Falcon Style)',
    geogridDesc: 'Visually demonstrates how the client’s ranking drops as distance increases from their location.',
    radiusLabel: 'Radius',
    satMap: 'Satellite Coverage Heatmap',
    keyword: 'Target Keyword:',
    legendTop3: 'Ranks #1 to #3 (Captures 84% of calls & visits)',
    legendDropped: 'Rank #4+ (Completely Invisible)',
    diagAdvisor: 'Sales Advisor Script:',
    diagAdvisorBody: (name: string, rad: string, kw?: string) =>
      `"${name || 'Client'}, when you search standing inside your storefront, you appear #1${kw ? ` for '${kw}'` : ''}. But when someone searches just ${rad} away in your same neighborhood, your business drops to rank #8 or #14. All those ready-to-buy customers are going straight to your 3 closest competitors."`,
    solutionPrestigia: 'Solution with Prestigia:',
    solutionPrestigiaBody:
      'With secondary category injection, geo-targeted neighborhood keywords in your commercial copy, and 8 weekly geo-tagged reviews, we expand your top-ranking radius across the entire metro area in 90 days.',
    roiTitle: 'Top 3 Financial Balance: Current Revenue Leak vs. Prestigia Gain',
    roiDesc: 'Mathematically compares the revenue leaking to podium rivals against the new revenue unlocked by dominating the Google Maps Top 3.',
    avgTicket: 'Average Ticket Value per Sale/Service (USD)',
    avgTicketSub: 'Average amount spent by a customer per visit or transaction.',
    avgFrequency: 'Purchase Frequency / Visits per Year',
    avgFrequencySub: 'Number of times a customer returns in 12 months (LTV).',
    freqOpt1: '1x (One-off purchase / Sporadic service)',
    freqOpt2: '3x (Healthcare, beauty, auto, professional services)',
    freqOpt3: '6x (High frequency / Dining & retail)',
    freqOpt4: '12x (Monthly repeat or subscription)',
    currentRank: 'Current Position on Google Maps',
    rankOpt1: 'Rank #4 (On the verge of Top 3 • 35% click loss)',
    rankOpt2: 'Rank #8 (Second view • 60% click loss)',
    rankOpt3: 'Rank #15+ (Invisible • 85%+ click loss)',
    currentRankSub: 'Where the business ranks today for buyer-intent queries.',
    searches: 'Estimated Monthly Local Searches',
    searchesSub: 'Number of people searching for this service each month.',
    leakDetected: 'Revenue Leak (Without Prestigia)',
    leakHeading: 'Money your business is handing directly to the 3 podium competitors:',
    lostPer30Days: 'lost every 30 days',
    lostCalls: 'Lost Calls & Searches:',
    searchesPerMonth: 'searches/mo',
    lostClientsLabel: 'Lost Paying Customers:',
    newClientsPerMonth: 'lost customers/mo',
    loss12Months: 'Direct 12-Month Loss:',
    lossLtv12Months: 'Annual Loss with Retention (LTV):',
    gainDetected: 'Commercial Expansion (With Prestigia Top 3)',
    gainHeading: 'New revenue captured by dominating the Top 3:',
    gainPer30Days: 'generated every 30 days',
    gainCalls: 'Captured Searches & Calls:',
    gainClientsLabel: 'New Customers Gained:',
    gainNewClientsPerMonth: 'new customers/mo',
    gain12Months: 'New 12-Month Revenue:',
    gainLtv12Months: 'Annual Revenue with Retention (LTV):',
    netImpactBadge: 'TOTAL COMMERCIAL IMPACT (Halted Leak + New Revenue)',
    netImpactTotalAnnual: 'Total Net Financial Advantage / Year:',
    roiEstimateLabel: 'Estimated Return on Investment (ROI):',
    breakEvenLabel: 'Break-Even Point:',
    breakEvenText: (clients: number) =>
      `Recovering just ${clients} paying customer${clients === 1 ? '' : 's'} a month pays for Prestigia completely. Every additional customer is 100% pure profit.`,
    advisorClose: 'Advisor Closing Pitch:',
    advisorCloseBody: (name: string, monthlyLoss: number, monthlyGain: number, breakEvenClients: number) =>
      `"${name || 'Client'}, choosing not to hire Prestigia doesn't save you money—it costs you $${monthlyLoss.toLocaleString()} USD every month going straight to your competitors. By reaching the Top 3, you not only stop that leak but also bring in +$${monthlyGain.toLocaleString()} USD in new revenue each month. Bringing in just ${breakEvenClients} customer${breakEvenClients === 1 ? '' : 's'} a month pays for Prestigia completely, and everything else is pure profit."`,
    spyTitle: '🥊 Rival Spy: Head-to-Head Competitor Radar',
    spyDesc: 'Compare your client directly against their #1 Google Maps competitor and generate the exact blueprint to dethrone them in the Top 3.',
    spyClientCol: 'Your Business (Client)',
    spyRivalCol: 'Target #1 Competitor to Beat',
    spyRivalPlaceholder: 'e.g. Apex Dental or Top Competitor',
    spyMetricRating: 'Google Maps Rating',
    spyMetricReviews: 'Total Reviews Volume',
    spyMetricWeekly: 'Current Weekly Pace',
    spyMetricPhotos: 'Photos on Listing',
    spyVerdictTitle: 'Algorithmic Radiography & Prestigia Verdict',
    spyAttackPlan: '3 Tactical Dethroning Moves with Prestigia:',
    spyMove1: '5★ Review Velocity Accelerator with Prestigia Software (+8 weekly reviews to eliminate their lead)',
    spyMove2: 'Secondary Category Injection capturing 5 high-intent keywords missing from competitor profile',
    spyMove3: '30-Day Google Posts Booster & Geo-Tagging to outpace competitor freshness signals',
    spyPitchBox: 'Aggressive Advisor Closing Pitch Script:',
    spyPitchText: (client: string, rival: string, weeks: number, clientReviews: number, rivalReviews: number) => {
      if (clientReviews >= rivalReviews) {
        return `"${client || 'Client'}, look at this diagnostic data. You have ${clientReviews.toLocaleString()} reviews and ${rival || 'your rival'} has only ${rivalReviews}, yet they are ranking #1 in Google's Top 3 taking your customers. Why? Because Google's 2026 algorithm penalizes dormant profiles: your profile receives only +1 review/week while your competitor has fresh momentum. With Prestigia's intelligent review software, we inject +8 weekly 5★ reviews with targeted keywords, double your photo gallery, and within 30 days reclaim the #1 spot that rightfully belongs to you."`;
      }
      const gap = Math.max(1, rivalReviews - clientReviews);
      const years = Math.max(1, Math.round((gap / 52) * 10) / 10);
      return `"${client || 'Client'}, ${rival || 'your competitor'} has a ${gap}-review lead. At your current organic pace of +1 review/week, it would take you ${years} YEARS to catch them while they take 70% of the local customers. By activating Prestigia and our 5★ review software, we accelerate your velocity to +8 weekly 5★ reviews and dethrone your competitor in just ${weeks} weeks."`;
    },
    spyBtnCopyPitch: 'Copy Closing Pitch',
  },
};

const TXT_DOSSIERS = {
  es: {
    privateBadge: '⭐ Cartera Personal Privada',
    accountOwner: '• Luisma (Cuenta Principal)',
    title: 'Mis Clientes & Auditorías Privadas',
    desc: 'Expedientes creados, auditados y rescatados personalmente por ti. Métricas de cobro, suscripciones activas y 100% aislados de la red.',
    searchPlaceholder: 'Buscar por cliente, categoría, ciudad...',
    kpiDossiers: 'Mis Expedientes',
    kpiCreated: 'Fichas Desde Cero',
    kpiAudited: 'Auditorías Top 3',
    kpiRescued: 'Fichas Rescatadas',
    kpiRevenue: 'Total Facturado Setup',
    kpiMrr: 'MRR Prestigia',
    kpiPrivacy: 'Privacidad',
    kpiPrivacyVal: '100% Blindado',
    filterBy: 'Servicio:',
    filterAll: 'Todos',
    filterCreate: '🏗️ Fichas Nuevas',
    filterAudit: '🔬 Auditorías Top 3',
    filterRescue: '🛡️ Rescates 72h',
    filterAppeal: '⚖️ Apelaciones 1-3★',
    filterCountry: 'País:',
    filterCity: 'Ciudad:',
    filterNeighborhood: 'Barrio / Localidad:',
    filterClosing: 'Estado de Cierre:',
    filterAllCountries: 'Todos los Países',
    filterAllCities: 'Todas las Ciudades',
    filterAllNeighborhoods: 'Todas las Localidades',
    filterAllClosing: 'Todos los Cierres',
    showingNotice: 'Cartera personal blindada de Luisma',
    loading: 'Cargando tu cartera personal...',
    emptyTitle: 'No se encontraron clientes con los filtros seleccionados',
    emptyDesc: 'Intenta limpiar los filtros o genera un nuevo expediente en los módulos superiores.',
    btnCreateFirst: '🏗️ Crear Primera Ficha Ganadora',
    badgeCreate: '🏗️ Ficha Creada',
    badgeAudit: '🔬 Auditoría Top 3',
    badgeRescue: '🛡️ Ficha Rescatada',
    ownerBadge: '👑 Luisma (Cuenta Principal)',
    btnLoadView: '👁️ Cargar y Ver',
    sendWhatsappKit: 'Enviar Kit por WhatsApp',
    deleteDossier: 'Eliminar Expediente',
    confirmDelete: '¿Eliminar este expediente de forma definitiva?',
    statusPrestigiaSubscriber: '💎 Plan Prestigia (A la Medida • Setup $0)',
    statusSetupPaid: '💵 Setup Cobrado',
    statusProposalSent: '⏳ Propuesta Enviada',
    statusNegotiating: '🤝 En Negociación',
    statusLeadDraft: '📝 Prospección',
    btnManageClosing: '⚙️ Cierre & Cobro',
    pricingBenchmarkNotice: 'Baremos de Mercado: Creación $150-$250 | Auditoría $200-$350 | Rescate $250-$450 USD | Planes Prestigia: A la Medida',
  },
  en: {
    privateBadge: '⭐ Private Client Portfolio',
    accountOwner: '• Luisma (Main Account)',
    title: 'My Clients & Private Audits',
    desc: 'Dossiers created, audited and rescued personally by you. Revenue tracking, active subscriptions and 100% isolated.',
    searchPlaceholder: 'Search by client, category, city...',
    kpiDossiers: 'My Dossiers',
    kpiCreated: 'Built From Scratch',
    kpiAudited: 'Top 3 Audits',
    kpiRescued: 'Rescued Listings',
    kpiRevenue: 'Total Setup Revenue',
    kpiMrr: 'Prestigia MRR',
    kpiPrivacy: 'Privacy',
    kpiPrivacyVal: '100% Shielded',
    filterBy: 'Service:',
    filterAll: 'All',
    filterCreate: '🏗️ New Listings',
    filterAudit: '🔬 Top 3 Audits',
    filterRescue: '🛡️ 72h Rescues',
    filterAppeal: '⚖️ 1-3★ Appeals',
    filterCountry: 'Country:',
    filterCity: 'City:',
    filterNeighborhood: 'Neighborhood:',
    filterClosing: 'Closing Status:',
    filterAllCountries: 'All Countries',
    filterAllCities: 'All Cities',
    filterAllNeighborhoods: 'All Localities',
    filterAllClosing: 'All Closings',
    showingNotice: 'Luisma private shielded portfolio',
    loading: 'Loading your private portfolio...',
    emptyTitle: 'No clients found matching the selected filters',
    emptyDesc: 'Try resetting the filters or generate a new dossier in the modules above.',
    btnCreateFirst: '🏗️ Build First Winning Listing',
    badgeCreate: '🏗️ Built Listing',
    badgeAudit: '🔬 Top 3 Audit',
    badgeRescue: '🛡️ Rescued Listing',
    ownerBadge: '👑 Luisma (Main Account)',
    btnLoadView: '👁️ Load & View',
    sendWhatsappKit: 'Send Kit via WhatsApp',
    deleteDossier: 'Delete Dossier',
    confirmDelete: 'Are you sure you want to permanently delete this dossier?',
    statusPrestigiaSubscriber: '💎 Prestigia Plan (Custom • Setup $0)',
    statusSetupPaid: '💵 Setup Paid',
    statusProposalSent: '⏳ Proposal Sent',
    statusNegotiating: '🤝 In Negotiation',
    statusLeadDraft: '📝 Lead / Draft',
    btnManageClosing: '⚙️ Closing & Monetization',
    pricingBenchmarkNotice: 'Market Benchmarks: Setup $150-$250 | Audit $200-$350 | Rescue $250-$450 USD | Prestigia Plans: Custom Tailored',
  },
};

const TXT_GUIDE = {
  es: {
    badge: 'Modo Piloto Automático • Cero Fricción Tecnológica',
    title: 'Guía Paso a Paso: Dónde dar Clic en Google en 5 Minutos',
    desc: 'Instrucciones exactas para ti o cualquiera de tus vendedores. No necesitas saber nada de sistemas: solo sigue los 6 pasos en orden.',
    btnOpenGoogle: 'Abrir Google Business',
    step1Title: 'Abrir Google Business',
    step1Body: 'Entra a business.google.com usando el correo de Gmail del negocio o el tuyo. Si no tiene cuenta, inicia sesión con cualquier Gmail.',
    step2Title: 'Escribir Nombre y Categoría',
    step2Body: 'Pega el Título Optimizado que te dio Local Studio. En categoría escribe la Categoría Principal y elígela del menú desplegable oficial de Google.',
    step3Title: 'Ubicación y Modelo de Negocio',
    step3BodyStore: '• Si es Local Físico: Marca "Sí tienes local abierto al público" y ajusta el pin rojo sobre la entrada.',
    step3BodySab: '• Si es Profesional Independiente (SAB): Marca "No, presto servicios en la ubicación del cliente". Esto oculta tu dirección de casa para evitar suspensiones de Google, y luego agregas las Zonas de Cobertura que te dio la herramienta.',
    step4Title: 'Video de Verificación',
    step4BodyStore: '• Para Locales: 1) Calle y fachada, 2) Llaves abriendo puerta, 3) Caja registradora y datáfono.',
    step4BodySab: '• Para Independientes: 1) Herramientas o computador con software abierto, 2) RUT o documento fiscal y tarjetas, 3) Vehículo de trabajo o bodega. ¡Aprobación rápida en 1 intento!',
    step5Title: 'Inyectar Subcategorías & Copy',
    step5Body: 'Ve a "Editar Perfil". En descripción, pega el copy de 745 caracteres. En categorías adicionales, agrega las 5 subcategorías secundarias que te dio la herramienta.',
    step6Title: 'Cargar Fotos y QR Prestigia',
    step6Body: 'Sube las fotos renombradas según el checklist de la herramienta. Luego activa el código QR de Prestigia en las mesas o mostrador para empezar a recibir reseñas de 5★ de inmediato.',
    trafficLightTitle: 'El Semáforo de Seguridad Anti-Suspensión de Google',
    dangerTitle: '❌ LO QUE NUNCA DEBES HACER (PELIGRO DE BAN):',
    danger1: '• No pongas nombres inventados o palabras spam como "EL MEJOR RESTAURANTE".',
    danger2: '• No uses números telefónicos virtuales desechables.',
    danger3: '• No pongas direcciones de apartamentos residenciales si el cliente dice atender público.',
    safeTitle: '✅ LO QUE SÍ DEBES HACER (APROBACIÓN SEGURA):',
    safe1: '• Usar el título con el separador "|" que generó Local Studio.',
    safe2: '• Subir fotos reales con el letrero coincidente.',
    safe3: '• Grabar el video continuo sin cortes mostrando la llave física.',
  },
  en: {
    badge: 'Autopilot Mode • Zero Tech Friction',
    title: 'Step-by-Step Guide: Where to Click in Google in 5 Minutes',
    desc: 'Exact instructions for you or any of your sales reps. No technical expertise required: just follow these 6 steps in order.',
    btnOpenGoogle: 'Open Google Business',
    step1Title: 'Open Google Business Profile',
    step1Body: 'Go to business.google.com using the business owner’s Gmail or your agency account. Sign in with any active Google account.',
    step2Title: 'Enter Business Name & Category',
    step2Body: 'Paste the Optimized Title generated by Local Studio. Type the Primary Category and select it from Google’s official dropdown taxonomy.',
    step3Title: 'Location & Operating Business Model',
    step3BodyStore: '• For Storefronts: Select "Yes, I have a physical location open to customers" and adjust the red pin precisely over the front entrance.',
    step3BodySab: '• For Independent Contractors / SAB: Select "No, I deliver goods and services to my customers". This hides your residential address to prevent suspensions, and then enter the Target Service Areas provided by the tool.',
    step4Title: 'One-Take Video Verification',
    step4BodyStore: '• For Storefronts: 1) Street sign and exterior signage, 2) Physical key unlocking front door, 3) POS terminal and operational counters.',
    step4BodySab: '• For Independents: 1) Professional tools or laptop with active business software, 2) Business license/EIN and branded business cards, 3) Work vehicle or inventory room. Instant approval on attempt #1!',
    step5Title: 'Inject Subcategories & Commercial Copy',
    step5Body: 'Click "Edit Profile". Under description, paste the 745-character SEO copy. Under additional categories, paste the 5 secondary subcategories provided by the tool.',
    step6Title: 'Upload Photos & Activate Prestigia Smart QR',
    step6Body: 'Upload the renamed photos following the tool’s SEO checklist. Then deploy the Prestigia Smart Digital QR & Review Link system to start capturing 5★ Google reviews immediately.',
    trafficLightTitle: 'Google Anti-Suspension Security Traffic Light',
    dangerTitle: '❌ WHAT TO NEVER DO (RISK OF IMMEDIATE BAN):',
    danger1: '• Do not add spam keywords or fake names like "THE BEST RESTAURANT".',
    danger2: '• Do not use burner VoIP or virtual forwarding phone numbers.',
    danger3: '• Do not publish residential apartment addresses as physical storefronts.',
    safeTitle: '✅ WHAT TO DO (GUARANTEED APPROVAL):',
    safe1: '• Use the optimized title with separator "|" generated by Local Studio.',
    safe2: '• Upload high-res photos showing matching permanent building signage.',
    safe3: '• Record a single continuous unedited video showing physical access keys.',
  },
};

const TXT_PITCH = {
  es: {
    badge: 'Manual de Cierre en Llamadas y Reuniones',
    title: 'Guion Comercial: Respuestas a Objeciones para Asesores',
    desc: 'Qué decirle al cliente cuando tiene dudas para asegurar el contrato de 12 meses de Prestigia.',
    q1: '1. Si el cliente dice: "¿Y por qué no creo yo mismo la ficha de Google gratis?"',
    a1: '"Claro que sí, don Carlos, Google permite crearla gratis. Pero el 92% de los negocios comete el error de poner solo una categoría y una descripción corta sin palabras clave. Por eso terminan en la página 4 de Google Maps donde nadie los ve. Nosotros aplicamos la arquitectura de categorías secretas y copywriting de los 3 líderes de su zona para que su ficha no solo exista, sino que le traiga clientes nuevos y reservas todos los días."',
    q2: '2. Si el cliente dice: "¿Por qué necesito el servicio de Prestigia durante 12 meses?"',
    a2: '"Porque Google Maps castiga la inactividad bajo la \'Ley de Recencia\'. Si dejas de recibir reseñas recientes durante 30 días, el algoritmo te oculta y premia a tu competencia activa. Además, Prestigia es su seguro de blindaje: contiene en caliente cualquier cliente furioso para que nunca publique una queja de 1 estrella en su perfil."',
    q3: '3. Si el cliente dice: "¿En cuánto tiempo veo resultados de estar en el Top 3?"',
    a3: '"En los primeros 7 a 14 días la optimización técnica de categorías y descripción genera un salto visible de impresiones. Y con el código QR en mesa capturando las primeras 30 a 50 opiniones de 5 estrellas en el primer mes, el algoritmo lo posiciona en la zona caliente de su barrio en menos de 60 a 90 días."',
  },
  en: {
    badge: 'In-Person & Phone Closing Playbook',
    title: 'Sales Pitch Playbook: Objection Handling for Advisors',
    desc: 'Exact word-for-word scripts to overcome objections and close 12-month Prestigia retainers.',
    q1: '1. If the client asks: "Why shouldn’t I just set up the Google profile myself for free?"',
    a1: '"Absolutely, you can create it for free. But 92% of business owners make the critical mistake of selecting only one broad category and writing a generic description without purchase-intent keywords. That’s why they end up buried on page 4 of Google Maps where zero clients find them. We engineer the exact secret category hierarchy, geo-grid keywords, and copy architecture used by the top 3 market leaders in your city to make your phone ring with new paying customers every day."',
    q2: '2. If the client asks: "Why do I need Prestigia on an ongoing 12-month plan?"',
    a2: '"Because Google’s local algorithm strictly penalizes inactivity under the \'Recency Factor\'. If your profile stops getting consistent verified reviews every 30 days, your rankings drop and Google pushes active competitors above you. Furthermore, Prestigia acts as your private reputation firewall: filtering private negative feedback so angry customers never leave a public 1-star review on your listing."',
    q3: '3. If the client asks: "How fast will I see results and reach the Top 3?"',
    a3: '"Within the first 7 to 14 days, the category taxonomy and geo-targeted copy trigger a noticeable spike in Google search impressions. And once your Prestigia Smart QR plates generate the first 30 to 50 genuine 5-star reviews during month one, the algorithm propels your listing into the high-converting Top 3 map pack in under 60 to 90 days."',
  },
};

const TXT_NETWORK = {
  es: {
    badge: '👑 Panel Ejecutivo Master • Red Comercial & Monetización B2B',
    badgeSub: '• Licenciamiento & Equipos',
    title: 'Red de Asesores Comerciales & Agencias Partners',
    desc: 'Crea accesos individuales para tus vendedores a comisión o vende licencias de software mensual a agencias aliadas para que prospecten y auditen negocios locales en cualquier país o ciudad.',
    btnDownloadCsv: '📥 Descargar Reporte CSV',
    kpiInternal: 'Asesores Internos',
    kpiAgencies: 'Agencias Licenciadas',
    kpiAccounts: 'Cuentas de la Red',
    kpiMrr: 'Ingreso Licencias (MRR)',
    subviewMonitor: '📊 Monitor de Cuentas Prospectadas',
    subviewRegister: '➕ Registrar Asesor o Licenciar Agencia',
    subviewDirectory: '👥 Directorio de Cuentas Activas',
    filterAdvisor: 'Filtrar por Asesor:',
    allAdvisors: 'Todos los Asesores',
    filterCountry: 'Filtrar por País:',
    allCountries: 'Todos los Países',
    filterCity: 'Filtrar por Ciudad:',
    allCities: 'Todas las Ciudades',
    registerTitle: 'Crear Nuevo Usuario en la Plataforma',
    registerDesc: 'Genera un nuevo acceso para un vendedor comisionista de tu equipo o una licencia de software para una agencia aliada que paga una cuota mensual.',
    nameLabel: 'Nombre del Asesor o Razón Social de la Agencia *',
    accountTypeLabel: 'Tipo de Cuenta *',
    optAdvisor: '💼 Asesor Interno (Comisionista)',
    optAgency: '🏢 Agencia Aliada B2B (Licencia de Software)',
    userLabel: 'Nombre de Usuario (Para Iniciar Sesión) *',
    passLabel: 'Contraseña Temporal *',
    phoneLabel: 'WhatsApp / Teléfono de Contacto',
    countryLabel: 'País de Operación',
    cityLabel: 'Ciudad Principal de Operación',
    monthlyFeeLabel: 'Tarifa de Licencia Mensual (USD/mes)',
    licenseStatusLabel: 'Estado de la Licencia',
    statusActive: 'Activa (Al Día)',
    statusPending: 'Pendiente de Pago',
    statusSuspended: 'Suspendida',
    btnSaveAdvisor: 'Guardar y Activar Usuario en el Sistema',
    tableAdvisor: 'Asesor / Agencia',
    tableType: 'Tipo',
    tableLocation: 'Ubicación',
    tableDossiers: 'Expedientes',
    tableFee: 'Cuota Mensual',
    tableStatus: 'Estado',
    tableActions: 'Acciones',
    btnDeactivate: 'Desactivar',
    btnActivate: 'Activar',
  },
  en: {
    badge: '👑 Executive Master Panel • Sales Network & B2B Monetization',
    badgeSub: '• Licensing & Teams',
    title: 'Sales Advisors & Partner Agency Network',
    desc: 'Create individual accounts for commission-based sales reps or license monthly software access to partner marketing agencies prospecting and auditing local businesses in any country or city.',
    btnDownloadCsv: '📥 Download CSV Report',
    kpiInternal: 'Internal Advisors',
    kpiAgencies: 'Licensed Agencies',
    kpiAccounts: 'Network Accounts',
    kpiMrr: 'License Revenue (MRR)',
    subviewMonitor: '📊 Prospecting & Audits Monitor',
    subviewRegister: '➕ Register Advisor or License Agency',
    subviewDirectory: '👥 Active Accounts Directory',
    filterAdvisor: 'Filter by Advisor:',
    allAdvisors: 'All Advisors',
    filterCountry: 'Filter by Country:',
    allCountries: 'All Countries',
    filterCity: 'Filter by City:',
    allCities: 'All Cities',
    registerTitle: 'Create New User Account',
    registerDesc: 'Generate access credentials for a sales rep on your internal team or issue a software license for a partner marketing agency paying a monthly fee.',
    nameLabel: 'Advisor Name or Agency Corporate Name *',
    accountTypeLabel: 'Account Type *',
    optAdvisor: '💼 Internal Sales Advisor (Commission)',
    optAgency: '🏢 Partner Agency B2B (Software License)',
    userLabel: 'Username (For Sign-In) *',
    passLabel: 'Temporary Password *',
    phoneLabel: 'Contact Phone / WhatsApp',
    countryLabel: 'Operating Country',
    cityLabel: 'Primary Operating City',
    monthlyFeeLabel: 'Monthly License Fee (USD/month)',
    licenseStatusLabel: 'License Status',
    statusActive: 'Active (Paid)',
    statusPending: 'Payment Pending',
    statusSuspended: 'Suspended',
    btnSaveAdvisor: 'Save & Activate User in System',
    tableAdvisor: 'Advisor / Agency',
    tableType: 'Type',
    tableLocation: 'Location',
    tableDossiers: 'Dossiers',
    tableFee: 'Monthly Fee',
    tableStatus: 'Status',
    tableActions: 'Actions',
    btnDeactivate: 'Deactivate',
    btnActivate: 'Activate',
  },
};

const TXT_AUTH = {
  es: {
    close: '✕ Cerrar',
    title: 'Ingreso a Prestigia Local Studio',
    subtitle: 'Selecciona tu perfil de acceso o ingresa con tus credenciales',
    quickAccess: 'Acceso Rápido Directo:',
    founderRole: 'FOUNDER',
    founderDesc: 'Acceso total + Gestión de asesores + Control de expedientes',
    advisorRole: 'ASESOR',
    advisorDesc: 'Vista comercial de ventas + Generador Top 3',
    orCredentials: 'o ingresar otro asesor con contraseña',
    usernameLabel: 'Usuario',
    passwordLabel: 'Contraseña',
    btnLogin: 'Iniciar Sesión con Contraseña',
    verifying: 'Verificando...',
  },
  en: {
    close: '✕ Close',
    title: 'Sign In to Prestigia Local Studio',
    subtitle: 'Select your user profile or log in with credentials',
    quickAccess: 'Quick 1-Click Access:',
    founderRole: 'FOUNDER',
    founderDesc: 'Full master access + Advisor management + Dossiers control',
    advisorRole: 'ADVISOR',
    advisorDesc: 'Sales rep workspace + Top 3 Blueprint Generator',
    orCredentials: 'or enter advisor credentials with password',
    usernameLabel: 'Username',
    passwordLabel: 'Password',
    btnLogin: 'Sign In with Password',
    verifying: 'Verifying...',
  },
};

export default function LocalStudioPage() {
  // -------------------------------------------------------------
  // 1. AUTHENTICATION & ADVISOR SESSION
  // -------------------------------------------------------------
  const [currentUser, setCurrentUser] = useState<StudioAdvisorUser | null>(null);
  const isLuismaMaster = Boolean(currentUser?.id === 'adv-luisma' || currentUser?.username?.toLowerCase() === 'luisma');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userFieldActive, setUserFieldActive] = useState(false);
  const [passFieldActive, setPassFieldActive] = useState(false);
  const [modalUserActive, setModalUserActive] = useState(false);
  const [modalPassActive, setModalPassActive] = useState(false);

  // Anti-autofill: Garantizar cajas 100% limpias al montar la página
  useEffect(() => {
    setLoginUsername('');
    setLoginPassword('');
    const t1 = setTimeout(() => {
      setLoginUsername('');
      setLoginPassword('');
    }, 100);
    const t2 = setTimeout(() => {
      setLoginUsername('');
      setLoginPassword('');
    }, 400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Active Workspace Tab
  const [activeTab, setActiveTab] = useState<'create' | 'audit' | 'rescue' | 'appeals' | 'tools' | 'dossiers' | 'guide' | 'pitch' | 'advisors' | 'network'>('create');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Luisma Master Security: Only Luisma can access tab 8 (Network)
  useEffect(() => {
    if ((activeTab === 'network' || activeTab === 'advisors') && !isLuismaMaster) {
      setActiveTab('create');
    }
  }, [currentUser, activeTab, isLuismaMaster]);

  // Check persisted session
  useEffect(() => {
    try {
      const isLoggedOut = localStorage.getItem('prestigia_studio_logged_out');
      if (isLoggedOut === 'true') {
        setCurrentUser(null);
        setShowAuthModal(true);
        return;
      }

      const stored = localStorage.getItem('prestigia_studio_advisor');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) {
          setCurrentUser(parsed);
          return;
        }
      }
    } catch {}

    // Sin sesión previa activa: requerir inicio de sesión obligatorio con credenciales
    setCurrentUser(null);
  }, []);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch(
        `/api/local-studio/advisors?username=${encodeURIComponent(loginUsername)}&password=${encodeURIComponent(loginPassword)}`
      );
      const data = await res.json();
      if (data.success && data.advisor) {
        setCurrentUser(data.advisor);
        localStorage.setItem('prestigia_studio_advisor', JSON.stringify(data.advisor));
        localStorage.setItem('prestigia_studio_advisor_explicit', 'true');
        localStorage.removeItem('prestigia_studio_logged_out');
        setLoginUsername('');
        setLoginPassword('');
        setLoginError('');
        setShowAuthModal(false);
        showToast(`¡Bienvenido, ${data.advisor.name}!`);
      } else {
        setLoginError(data.error || 'Credenciales inválidas');
      }
    } catch (err) {
      setLoginError('Error de conexión al verificar credenciales.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('prestigia_studio_advisor');
    localStorage.removeItem('prestigia_studio_advisor_explicit');
    localStorage.setItem('prestigia_studio_logged_out', 'true');
    setCurrentUser(null);
    setLoginUsername('');
    setLoginPassword('');
    setUserFieldActive(false);
    setPassFieldActive(false);
    setModalUserActive(false);
    setModalPassActive(false);
    setLoginError('');
    setShowAuthModal(true);
    showToast(isEn ? '👋 Session closed successfully' : '👋 Sesión cerrada exitosamente');
  };

  // -------------------------------------------------------------
  // 2. WORKSPACE FORM STATE
  // -------------------------------------------------------------
  // TAB 1: CREAR FICHA (CREATE) DEDICATED STATE
  // -------------------------------------------------------------
  const [createContactName, setCreateContactName] = useState<string>('');
  const [createContactCompany, setCreateContactCompany] = useState<string>('');
  const [createContactPhone, setCreateContactPhone] = useState<string>('');
  const [createContactEmail, setCreateContactEmail] = useState<string>('');
  const [createContactRole, setCreateContactRole] = useState<string>('Dueño / Propietario');
  const [createBusinessName, setCreateBusinessName] = useState('');
  const [createCategory, setCreateCategory] = useState(CATEGORY_OPTIONS[0]);
  const [createCountry, setCreateCountry] = useState<string>('Colombia');
  const [createCity, setCreateCity] = useState<string>('Bogotá');
  const [createNeighborhood, setCreateNeighborhood] = useState<string>('');
  const [createSpecialties, setCreateSpecialties] = useState('');
  const [createPhone, setCreatePhone] = useState('');
  const [createBusinessModel, setCreateBusinessModel] = useState<'storefront' | 'service_area'>('storefront');
  const [createServiceAreas, setCreateServiceAreas] = useState('');
  const [isGeneratingCreate, setIsGeneratingCreate] = useState(false);
  const [createGeneratedData, setCreateGeneratedData] = useState<BlueprintData | null>(null);

  // -------------------------------------------------------------
  // TAB 2: AUDITAR & OPTIMIZAR (AUDIT) DEDICATED STATE
  // -------------------------------------------------------------
  const [auditContactName, setAuditContactName] = useState<string>('');
  const [auditContactCompany, setAuditContactCompany] = useState<string>('');
  const [auditContactPhone, setAuditContactPhone] = useState<string>('');
  const [auditContactEmail, setAuditContactEmail] = useState<string>('');
  const [auditContactRole, setAuditContactRole] = useState<string>('Dueño / Propietario');
  const [auditQuery, setAuditQuery] = useState('');
  const [isScanningAudit, setIsScanningAudit] = useState(false);
  const [auditScannedListing, setAuditScannedListing] = useState<GooglePlaceData | null>(null);
  const [showManualAuditFields, setShowManualAuditFields] = useState(false);
  const [auditBusinessName, setAuditBusinessName] = useState('');
  const [auditCategory, setAuditCategory] = useState(CATEGORY_OPTIONS[0]);
  const [auditCountry, setAuditCountry] = useState<string>('Colombia');
  const [auditCity, setAuditCity] = useState<string>('Bogotá');
  const [auditNeighborhood, setAuditNeighborhood] = useState<string>('');
  const [auditPhone, setAuditPhone] = useState('');
  const [auditGoogleUrl, setAuditGoogleUrl] = useState('');
  const [auditExistingRating, setAuditExistingRating] = useState<number>(4.2);
  const [auditExistingReviews, setAuditExistingReviews] = useState<number>(0);
  const [isGeneratingAudit, setIsGeneratingAudit] = useState(false);
  const [auditGeneratedData, setAuditGeneratedData] = useState<BlueprintData | null>(null);

  // -------------------------------------------------------------
  // TAB 3: RESCATAR FICHA (RESCUE) DEDICATED STATE
  // -------------------------------------------------------------
  const [rescueContactName, setRescueContactName] = useState<string>('');
  const [rescueContactCompany, setRescueContactCompany] = useState<string>('');
  const [rescueContactPhone, setRescueContactPhone] = useState<string>('');
  const [rescueContactEmail, setRescueContactEmail] = useState<string>('');
  const [rescueContactRole, setRescueContactRole] = useState<string>('Dueño / Propietario');
  const [rescueSearchQuery, setRescueSearchQuery] = useState('');
  const [isRescueScanning, setIsRescueScanning] = useState(false);
  const [rescueScannedListing, setRescueScannedListing] = useState<GooglePlaceData | null>(null);
  const [rescueBusinessName, setRescueBusinessName] = useState('');
  const [rescueCategory, setRescueCategory] = useState(CATEGORY_OPTIONS[0]);
  const [rescueCountry, setRescueCountry] = useState<string>('Colombia');
  const [rescueCity, setRescueCity] = useState<string>('Bogotá');
  const [rescueNeighborhood, setRescueNeighborhood] = useState<string>('');
  const [rescueScenario, setRescueScenario] = useState<'orphan' | 'third_party' | 'rejected'>('third_party');
  const [rescueMaskedEmail, setRescueMaskedEmail] = useState('');

  // -------------------------------------------------------------
  // TAB 4: APELACIÓN Y RESCATE LEGAL DE RESEÑAS 1-3★ DEDICATED STATE
  // -------------------------------------------------------------
  const [appealContactName, setAppealContactName] = useState<string>('');
  const [appealContactCompany, setAppealContactCompany] = useState<string>('');
  const [appealContactPhone, setAppealContactPhone] = useState<string>('');
  const [appealContactEmail, setAppealContactEmail] = useState<string>('');
  const [appealContactRole, setAppealContactRole] = useState<string>('Dueño / Propietario');
  const [appealSearchQuery, setAppealSearchQuery] = useState('');
  const [isScanningAppeals, setIsScanningAppeals] = useState(false);
  const [scannedAppealBiz, setScannedAppealBiz] = useState<GooglePlaceData | null>(null);
  const [appealReviewsList, setAppealReviewsList] = useState<NegativeReviewItem[]>([]);
  const [selectedAppealReview, setSelectedAppealReview] = useState<NegativeReviewItem | null>(null);
  const [isGeneratingAppeal, setIsGeneratingAppeal] = useState(false);
  const [activeAppealDossier, setActiveAppealDossier] = useState<any | null>(null);
  const [appealSuccessCopied, setAppealSuccessCopied] = useState<string | null>(null);

  // Manual Review Form State
  const [showManualReviewForm, setShowManualReviewForm] = useState(false);
  const [manualAuthor, setManualAuthor] = useState('');
  const [manualRating, setManualRating] = useState<number>(1);
  const [manualTimeAgo, setManualTimeAgo] = useState('Reciente');
  const [manualText, setManualText] = useState('');
  const [manualContextFlag, setManualContextFlag] = useState<
    'competitor' | 'ex_employee' | 'fake_customer' | 'defamation' | 'off_topic' | 'extortion' | 'general_bad_faith'
  >('fake_customer');
  const [manualNotes, setManualNotes] = useState('');

  // -------------------------------------------------------------
  // TAB 5: 3 ARMAS TOP 3 (TOOLS) DEDICATED STATE
  // -------------------------------------------------------------
  const [toolsActiveTab, setToolsActiveTab] = useState<'geogrid' | 'roicalc' | 'rivalspy'>('geogrid');
  const [toolsSearchQuery, setToolsSearchQuery] = useState('');
  const [isToolsScanning, setIsToolsScanning] = useState(false);
  const [toolsBusinessName, setToolsBusinessName] = useState('');
  const [toolsScannedListing, setToolsScannedListing] = useState<GooglePlaceData | null>(null);
  const [toolsCategory, setToolsCategory] = useState(CATEGORY_OPTIONS[0]);
  const [toolsCity, setToolsCity] = useState('');
  const [toolsExistingRating, setToolsExistingRating] = useState<number>(4.2);
  const [toolsExistingReviews, setToolsExistingReviews] = useState<number>(0);
  const [geoGridKeyword, setGeoGridKeyword] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [geoGridRadius, setGeoGridRadius] = useState<'1km' | '3km' | '5km'>('3km');
  const [roiAverageTicket, setRoiAverageTicket] = useState<number>(65);
  const [roiCustomerFrequency, setRoiCustomerFrequency] = useState<number>(3);
  const [roiCurrentRank, setRoiCurrentRank] = useState<number>(8);
  const [roiMonthlySearches, setRoiMonthlySearches] = useState<number>(1200);

  // Rival Spy (Head-to-Head Competitor Radar) State
  const [rivalSearchQuery, setRivalSearchQuery] = useState('');
  const [isRivalScanning, setIsRivalScanning] = useState(false);
  const [rivalName, setRivalName] = useState('');
  const [rivalRating, setRivalRating] = useState<number>(4.8);
  const [rivalReviews, setRivalReviews] = useState<number>(120);
  const [rivalWeeklyPace, setRivalWeeklyPace] = useState<number>(3);
  const [rivalPhotos, setRivalPhotos] = useState<number>(45);

  // Common UI State & Custom Geo State
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [customCountries, setCustomCountries] = useState<string[]>([]);
  const [customCitiesByCountry, setCustomCitiesByCountry] = useState<Record<string, string[]>>({});

  // Quick modals for custom country / city
  const [showAddCountryModal, setShowAddCountryModal] = useState<boolean>(false);
  const [showAddCityModal, setShowAddCityModal] = useState<boolean>(false);
  const [targetCountryForNewCity, setTargetCountryForNewCity] = useState<string>('Colombia');
  const [newCountryInput, setNewCountryInput] = useState<string>('');
  const [newCityInput, setNewCityInput] = useState<string>('');

  // Closing modal location states
  const [closingFormCountry, setClosingFormCountry] = useState<string>('Colombia');
  const [closingFormCity, setClosingFormCity] = useState<string>('Bogotá');
  const [closingFormNeighborhood, setClosingFormNeighborhood] = useState<string>('');

  const t = UI_TEXT[lang] || UI_TEXT.es;
  const tTools = TXT_TOOLS[lang] || TXT_TOOLS.es;
  const tDossiers = TXT_DOSSIERS[lang] || TXT_DOSSIERS.es;
  const tGuide = TXT_GUIDE[lang] || TXT_GUIDE.es;
  const tPitch = TXT_PITCH[lang] || TXT_PITCH.es;
  const tNetwork = TXT_NETWORK[lang] || TXT_NETWORK.es;
  const tAuth = TXT_AUTH[lang] || TXT_AUTH.es;
  const isEn = lang === 'en';
  const categoryOptions = lang === 'en' ? CATEGORY_OPTIONS_EN : CATEGORY_OPTIONS_ES;

  const hasActiveGeneratedData = Boolean(
    (activeTab === 'create' && createGeneratedData) ||
    (activeTab === 'audit' && auditGeneratedData) ||
    (activeTab === 'appeals' && activeAppealDossier)
  );

  // Load custom countries and cities from localStorage on mount & set browser tab title
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Prestigia Local Studio';
    }
    try {
      const storedCountries = localStorage.getItem('prestigia_custom_geo_countries');
      if (storedCountries) {
        const parsed = JSON.parse(storedCountries);
        if (Array.isArray(parsed)) setCustomCountries(parsed);
      }
      const storedCities = localStorage.getItem('prestigia_custom_geo_cities');
      if (storedCities) {
        const parsed = JSON.parse(storedCities);
        if (typeof parsed === 'object' && parsed !== null) setCustomCitiesByCountry(parsed);
      }
    } catch (e) {
      console.warn('Could not load custom geo data from localStorage', e);
    }
  }, []);

  const [savedDossiers, setSavedDossiers] = useState<StudioDossierRecord[]>([]);

  // Combined list of countries (default + custom + dossiers)
  const allCountriesList = useMemo(() => {
    const set = new Set<string>(Object.keys(WORLD_REGIONS_GEO));
    customCountries.forEach((c) => set.add(c));
    savedDossiers.forEach((d) => {
      if (d.country) set.add(d.country);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [customCountries, savedDossiers]);

  // Cities for a given country (default + custom + dossiers)
  const getCitiesForCountry = (c: string): string[] => {
    const set = new Set<string>(WORLD_REGIONS_GEO[c] || []);
    if (customCitiesByCountry[c]) {
      customCitiesByCountry[c].forEach((cityName) => set.add(cityName));
    }
    savedDossiers.forEach((d) => {
      if ((d.country || 'Colombia') === c && d.city) set.add(d.city);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  };

  const handleSelectCreateCountry = (newCountry: string) => {
    setCreateCountry(newCountry);
    const available = getCitiesForCountry(newCountry);
    if (!available.includes(createCity) && available.length > 0) {
      setCreateCity(available[0]);
    }
  };

  const handleSelectAuditCountry = (newCountry: string) => {
    setAuditCountry(newCountry);
    const available = getCitiesForCountry(newCountry);
    if (!available.includes(auditCity) && available.length > 0) {
      setAuditCity(available[0]);
    }
  };

  const handleSelectRescueCountry = (newCountry: string) => {
    setRescueCountry(newCountry);
    const available = getCitiesForCountry(newCountry);
    if (!available.includes(rescueCity) && available.length > 0) {
      setRescueCity(available[0]);
    }
  };

  const handleSaveNewCountry = () => {
    const trimmedCountry = newCountryInput.trim();
    if (!trimmedCountry) return;

    setCustomCountries((prev) => {
      const updated = Array.from(new Set([...prev, trimmedCountry]));
      try {
        localStorage.setItem('prestigia_custom_geo_countries', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (activeTab === 'create') setCreateCountry(trimmedCountry);
    else if (activeTab === 'audit') setAuditCountry(trimmedCountry);
    else if (activeTab === 'rescue') setRescueCountry(trimmedCountry);

    setDossierCountryFilter(trimmedCountry);
    setDossierCityFilter('all');
    setDossierNeighborhoodFilter('all');
    setNewCountryInput('');
    setShowAddCountryModal(false);
    showToast(`✓ País "${trimmedCountry}" agregado y seleccionado con éxito`);
  };

  const handleSaveNewCity = () => {
    const trimmedCity = newCityInput.trim();
    const currentActiveCountry = activeTab === 'create' ? createCountry : activeTab === 'audit' ? auditCountry : activeTab === 'rescue' ? rescueCountry : 'Colombia';
    const targetC = targetCountryForNewCity || (dossierCountryFilter !== 'all' ? dossierCountryFilter : currentActiveCountry) || 'Colombia';
    if (!trimmedCity) return;

    setCustomCitiesByCountry((prev) => {
      const existing = prev[targetC] || [];
      const updated = { ...prev, [targetC]: Array.from(new Set([...existing, trimmedCity])) };
      try {
        localStorage.setItem('prestigia_custom_geo_cities', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (activeTab === 'create' && createCountry === targetC) setCreateCity(trimmedCity);
    if (activeTab === 'audit' && auditCountry === targetC) setAuditCity(trimmedCity);
    if (activeTab === 'rescue' && rescueCountry === targetC) setRescueCity(trimmedCity);
    if (closingFormCountry === targetC) setClosingFormCity(trimmedCity);
    if (dossierCountryFilter === targetC) setDossierCityFilter(trimmedCity);

    setNewCityInput('');
    setShowAddCityModal(false);
    showToast(`✓ Ciudad "${trimmedCity}" agregada a ${targetC} con éxito`);
  };

  const handleToggleLang = (newLang: 'es' | 'en') => {
    setLang(newLang);
    const fromOptions = newLang === 'en' ? CATEGORY_OPTIONS_ES : CATEGORY_OPTIONS_EN;
    const toOptions = newLang === 'en' ? CATEGORY_OPTIONS_EN : CATEGORY_OPTIONS_ES;

    const mapCat = (c: string) => {
      const idx = fromOptions.indexOf(c);
      if (idx !== -1 && toOptions[idx]) return toOptions[idx];
      return toOptions[0];
    };

    setCreateCategory((prev) => mapCat(prev));
    setAuditCategory((prev) => mapCat(prev));
    setRescueCategory((prev) => mapCat(prev));
    setToolsCategory((prev) => mapCat(prev));

    showToast(newLang === 'en' ? '🇺🇸 Language switched to English' : '🇨🇴 Idioma cambiado a Español');
  };

  // White-label Custom Logo State
  const [customLogoUrl, setCustomLogoUrl] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLogo = localStorage.getItem('prestigia_studio_custom_logo');
      if (savedLogo) setCustomLogoUrl(savedLogo);
    }
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast(isEn ? '⚠️ Logo must be under 2MB' : '⚠️ El logo debe pesar menos de 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCustomLogoUrl(result);
      if (typeof window !== 'undefined') {
        localStorage.setItem('prestigia_studio_custom_logo', result);
      }
      showToast(isEn ? '🎨 Custom logo saved for PDF reports!' : '🎨 ¡Logo personalizado guardado para reportes PDF!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setCustomLogoUrl('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('prestigia_studio_custom_logo');
    }
    showToast(isEn ? 'Logo removed' : 'Logo eliminado');
  };

  // Interactive Implementation Checklist State
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window !== 'undefined' && createBusinessName.trim()) {
      try {
        const saved = localStorage.getItem(`prestigia_checklist_${createBusinessName.trim()}`);
        if (saved) {
          setCheckedSteps(JSON.parse(saved));
        } else {
          setCheckedSteps({});
        }
      } catch {
        setCheckedSteps({});
      }
    }
  }, [createBusinessName]);

  const toggleChecklistStep = (stepId: string) => {
    setCheckedSteps((prev) => {
      const updated = { ...prev, [stepId]: !prev[stepId] };
      if (typeof window !== 'undefined' && createBusinessName.trim()) {
        try {
          localStorage.setItem(`prestigia_checklist_${createBusinessName.trim()}`, JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  };

  const checklistItems = useMemo(() => {
    const isSab = createBusinessModel === 'service_area';
    return [
      {
        id: 'step_title',
        title: isEn ? '1. Update Official Listing Title with Local SEO formula' : '1. Actualizar Título Oficial con la fórmula Local SEO',
        desc: isEn ? 'Combines brand + category + city/zone in Google Business Profile' : 'Combina marca + categoría + ciudad/zona en Google Business Profile',
      },
      {
        id: 'step_categories',
        title: isEn ? '2. Set Primary Category and Secondary Subcategories' : '2. Configurar Categoría Principal y Subcategorías Secundarias',
        desc: isEn ? 'Ensures maximum algorithmic match for high-intent search queries' : 'Garantiza coincidencia algorítmica para búsquedas de alta intención',
      },
      {
        id: 'step_description',
        title: isEn ? '3. Publish 745-Character Commercial SEO Description' : '3. Publicar Descripción Comercial SEO de 745 Caracteres',
        desc: isEn ? 'Includes value proposition, local keywords, and closing call-to-action' : 'Incluye propuesta de valor, palabras clave locales y llamado a la acción',
      },
      {
        id: 'step_catalog',
        title: isEn ? '4. Upload Star Products & Services in Products tab' : '4. Cargar Productos y Servicios Estrella en la pestaña Productos',
        desc: isEn ? 'Structured catalog with names, tags, and conversion copy' : 'Catálogo estructurado con nombres, tags y textos de conversión',
      },
      {
        id: 'step_photos',
        title: isEn ? '5. Upload 8+ Geo-Tagged Photos with SEO Filenames' : '5. Subir 8+ Fotos Geo-Etiquetadas con Nombres SEO',
        desc: isEn ? 'Storefront/vehicle, team in action, work tools, and certificates' : 'Fachada/vehículo, equipo en acción, herramientas y certificados',
      },
      {
        id: 'step_video',
        title: isEn ? '6. Submit 60-Second Uncut Video Verification (3 Takes)' : '6. Enviar Video de Verificación de 60s sin Cortes (3 Tomas)',
        desc: isEn ? 'Exterior street sign -> lock unlocking -> business equipment & invoices' : 'Letrero exterior -> apertura de acceso -> herramientas y facturación',
      },
      isSab
        ? {
            id: 'step_sab_areas',
            title: isEn ? '7. Define 5+ Service Coverage Areas (Keep Address Hidden)' : '7. Definir 5+ Zonas de Cobertura (Dirección Oculta al Público)',
            desc: isEn ? 'Registered service radius within 2 driving hours without home address pin' : 'Zonas de cobertura en radio de 2 horas sin pin de casa o apartamento',
          }
        : {
            id: 'step_qa',
            title: isEn ? '7. Seed Official Preventive Q&A in Google Business' : '7. Publicar Preguntas y Respuestas Preventivas Oficiales (Q&A)',
            desc: isEn ? 'Anticipates customer queries and matches conversational search queries' : 'Anticipa dudas de clientes y gana búsquedas conversacionales',
          },
      {
        id: 'step_posts',
        title: isEn ? '8. Publish Week 1 Google Post Booster with CTA Button' : '8. Publicar Post Booster de Semana 1 con Botón de Contacto',
        desc: isEn ? 'Signals active algorithmic freshness to Google Maps index' : 'Envía señal de frescura activa al algoritmo de Google Maps',
      },
      {
        id: 'step_prestigia',
        title: isEn ? '9. ⚡ Final Step: Prestigia Shield & Smart 5★ Review Engine Activation' : '9. ⚡ Paso Final: Blindaje con Prestigia y Activación de Captura Digital 5★',
        desc: isEn
          ? 'Connect listing to Prestigia Portal for 1-3★ review protection, 5★ review velocity, and smart QR/WhatsApp flow'
          : 'Vincular ficha al Portal Prestigia para filtrar reseñas de 1 a 3★, acelerar 5★ y activar enlaces y QR inteligentes',
        isHero: true,
      },
    ];
  }, [isEn, createBusinessModel]);

  const completedChecklistCount = checklistItems.filter((item) => checkedSteps[item.id]).length;
  const checklistProgressPercent = Math.round((completedChecklistCount / checklistItems.length) * 100);


  const [isLoadingDossiers, setIsLoadingDossiers] = useState(false);
  const [dossierSearch, setDossierSearch] = useState('');
  const [dossierModeFilter, setDossierModeFilter] = useState<'all' | 'create' | 'audit' | 'rescue' | 'appeal'>('all');
  const [dossierCountryFilter, setDossierCountryFilter] = useState<string>('all');
  const [dossierCityFilter, setDossierCityFilter] = useState<string>('all');
  const [dossierNeighborhoodFilter, setDossierNeighborhoodFilter] = useState<string>('all');
  const [dossierClosingFilter, setDossierClosingFilter] = useState<string>('all');
  const [editingDossierClosing, setEditingDossierClosing] = useState<StudioDossierRecord | null>(null);
  const [closingFormMode, setClosingFormMode] = useState<'create' | 'audit' | 'rescue' | 'appeal'>('audit');
  const [closingFormStatus, setClosingFormStatus] = useState<'prestigia_subscriber' | 'setup_paid' | 'proposal_sent' | 'negotiating' | 'lead_draft'>('prestigia_subscriber');
  const [closingFormSetupFee, setClosingFormSetupFee] = useState<number>(0);
  const [closingFormMonthlyPlan, setClosingFormMonthlyPlan] = useState<number>(199);
  const [closingFormPaymentMethod, setClosingFormPaymentMethod] = useState<string>('');
  const [closingFormNotes, setClosingFormNotes] = useState<string>('');
  const [isSavingClosing, setIsSavingClosing] = useState(false);

  // Network (Advisors & Agencies B2B) State
  const [networkSubView, setNetworkSubView] = useState<'monitor' | 'register' | 'directory'>('directory');
  const [networkSearch, setNetworkSearch] = useState('');
  const [networkAdvisorFilter, setNetworkAdvisorFilter] = useState('all');
  const [networkTypeFilter, setNetworkTypeFilter] = useState<'all' | 'director' | 'internal_advisor' | 'partner_agency'>('all');
  const [networkCountryFilter, setNetworkCountryFilter] = useState('all');
  const [networkCityFilter, setNetworkCityFilter] = useState('all');
  const [networkModeFilter, setNetworkModeFilter] = useState<'all' | 'create' | 'audit' | 'rescue' | 'appeal'>('all');
  const [networkActiveFilter, setNetworkActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [viewingAdvisorWorks, setViewingAdvisorWorks] = useState<StudioAdvisorUser | null>(null);
  const [showRegisterAdvisorModal, setShowRegisterAdvisorModal] = useState<boolean>(false);
  const [networkTabMode, setNetworkTabMode] = useState<'directory' | 'forensic'>('directory');

  // Edit Advisor Account Modal State
  const [editingAdvisor, setEditingAdvisor] = useState<StudioAdvisorUser | null>(null);
  const [showEditAdvisorModal, setShowEditAdvisorModal] = useState<boolean>(false);
  const [editAdvisorName, setEditAdvisorName] = useState<string>('');
  const [editAdvisorUser, setEditAdvisorUser] = useState<string>('');
  const [editAdvisorPass, setEditAdvisorPass] = useState<string>('');
  const [editAdvisorPhone, setEditAdvisorPhone] = useState<string>('+57');
  const [editAdvisorCountry, setEditAdvisorCountry] = useState<string>('Colombia');
  const [editAdvisorCity, setEditAdvisorCity] = useState<string>('Bogotá');
  const [editAdvisorAccountType, setEditAdvisorAccountType] = useState<'internal_advisor' | 'partner_agency' | 'director' | 'founder'>('internal_advisor');
  const [editAdvisorMonthlyFee, setEditAdvisorMonthlyFee] = useState<number>(79);
  const [editAdvisorLicenseStatus, setEditAdvisorLicenseStatus] = useState<'active' | 'pending_payment' | 'suspended'>('active');
  const [editAdvisorMaxCreates, setEditAdvisorMaxCreates] = useState<number>(30);
  const [editAdvisorMaxAudits, setEditAdvisorMaxAudits] = useState<number>(30);
  const [editAdvisorMaxRescues, setEditAdvisorMaxRescues] = useState<number>(10);
  const [editAdvisorMaxAppeals, setEditAdvisorMaxAppeals] = useState<number>(15);
  const [isUpdatingAdvisor, setIsUpdatingAdvisor] = useState<boolean>(false);

  // Live Monthly Quota & Usage Monitor
  const [monthlyUsage, setMonthlyUsage] = useState<{ creates: number; audits: number; rescues: number; appeals: number }>({
    creates: 0,
    audits: 0,
    rescues: 0,
    appeals: 0,
  });

  // Advisors & Agencies List (for Admin tab)
  const [advisorsList, setAdvisorsList] = useState<StudioAdvisorUser[]>([]);

  // Identificador Inteligente de Rango y Perfil en Tiempo Real según Usuario ingresado
  const detectedLoginUser = useMemo(() => {
    const q = loginUsername.trim().toLowerCase();
    if (!q) return null;
    if (q === 'luisma') {
      return {
        name: 'Luisma',
        fullName: 'Luisma • Director General & Founder',
        username: 'luisma',
        accountType: 'founder' as const,
        badgeLabel: 'Fundador & Director General',
        hierarchy: '👑 Dirección General Suprema',
        description: 'Jerarquía Máxima • Acceso total maestro, Bóveda Forense y Auditorías Globales',
      };
    }
    const match = advisorsList.find((a) => a.username.toLowerCase() === q);
    if (match) {
      const isAgency = match.accountType === 'partner_agency';
      return {
        name: match.name,
        fullName: match.name,
        username: match.username,
        accountType: isAgency ? ('partner_agency' as const) : ('internal_advisor' as const),
        badgeLabel: isAgency ? 'Agencia Partner B2B' : 'Asesor Comercial Interno',
        hierarchy: isAgency ? '🏢 Licencia de Agencia B2B' : '💼 Consultor Comercial Oficial',
        description: isAgency
          ? `Licencia de software activa • Cupo: ${match.maxCreatesMonthly ?? 60} creaciones / ${match.maxAuditsMonthly ?? 60} auditorías`
          : `Asesor comercial habilitado • Cupo: ${match.maxCreatesMonthly ?? 30} creaciones / ${match.maxAuditsMonthly ?? 30} auditorías`,
      };
    }
    return {
      name: q,
      fullName: `@${q}`,
      username: q,
      accountType: 'unknown' as const,
      badgeLabel: 'No Identificado',
      hierarchy: '❓ Usuario no registrado',
      description: 'Verifica tu ortografía o solicita tu alta en la red a Dirección General',
    };
  }, [loginUsername, advisorsList]);
  const [newAccountType, setNewAccountType] = useState<'internal_advisor' | 'partner_agency'>('internal_advisor');
  const [newAdvisorName, setNewAdvisorName] = useState('');
  const [newAdvisorUser, setNewAdvisorUser] = useState('');
  const [newAdvisorPass, setNewAdvisorPass] = useState('');
  const [newAdvisorPhone, setNewAdvisorPhone] = useState('+57');
  const [newAdvisorCountry, setNewAdvisorCountry] = useState('Colombia');
  const [newAdvisorCity, setNewAdvisorCity] = useState('Bogotá');
  const [newAdvisorMonthlyFee, setNewAdvisorMonthlyFee] = useState<number>(79);
  const [newAdvisorLicenseStatus, setNewAdvisorLicenseStatus] = useState<'active' | 'pending_payment'>('active');
  const [newAdvisorMaxCreates, setNewAdvisorMaxCreates] = useState<number>(30);
  const [newAdvisorMaxAudits, setNewAdvisorMaxAudits] = useState<number>(30);
  const [newAdvisorMaxRescues, setNewAdvisorMaxRescues] = useState<number>(10);
  const [newAdvisorMaxAppeals, setNewAdvisorMaxAppeals] = useState<number>(15);
  const [adminMasterKey, setAdminMasterKey] = useState('admin');
  const [isSavingAdvisor, setIsSavingAdvisor] = useState(false);

  // Fetch dossiers when entering dossiers tab or on user change
  const fetchDossiers = async () => {
    setIsLoadingDossiers(true);
    try {
      const isAdmin = currentUser?.role === 'admin' || !currentUser;
      const url = isLuismaMaster
        ? '/api/local-studio/dossiers?isLuisma=true'
        : isAdmin
        ? '/api/local-studio/dossiers?isAdmin=true'
        : `/api/local-studio/dossiers?advisorId=${currentUser?.id || 'adv-luisma'}`;
      const res = await fetch(url);
      const resData = await res.json();
      if (resData.success && Array.isArray(resData.dossiers)) {
        setSavedDossiers(resData.dossiers);
        if (resData.monthlyUsage) {
          setMonthlyUsage(resData.monthlyUsage);
        }
      }
    } catch (err) {
      console.warn('Error fetching dossiers:', err);
    } finally {
      setIsLoadingDossiers(false);
    }
  };

  useEffect(() => {
    fetchDossiers();
    fetchAdvisors();
  }, [currentUser]);

  useEffect(() => {
    if (activeTab === 'dossiers') {
      fetchDossiers();
    }
    if ((activeTab === 'advisors' || activeTab === 'network') && isLuismaMaster) {
      fetchAdvisors();
    }
  }, [activeTab]);

  const fetchAdvisors = async () => {
    try {
      const res = await fetch('/api/local-studio/advisors?isAdmin=true');
      const data = await res.json();
      if (data.success && Array.isArray(data.advisors)) {
        setAdvisorsList(data.advisors);
      }
    } catch (err) {
      console.warn('Error fetching advisors:', err);
    }
  };

  const handleResetCreateForm = () => {
    setCreateContactName('');
    setCreateContactCompany('');
    setCreateContactPhone('');
    setCreateContactEmail('');
    setCreateContactRole('Dueño / Propietario');
    setCreateBusinessName('');
    setCreateNeighborhood('');
    setCreateSpecialties('');
    setCreatePhone('');
    setCreateServiceAreas('');
    setCreateCategory(categoryOptions[0] || CATEGORY_OPTIONS[0]);
    setCreateGeneratedData(null);
    showToast(isEn ? '✨ Ready to create a new profile' : '✨ Formulario listo para crear una nueva ficha');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResetAuditForm = () => {
    setAuditContactName('');
    setAuditContactCompany('');
    setAuditContactPhone('');
    setAuditContactEmail('');
    setAuditContactRole('Dueño / Propietario');
    setAuditQuery('');
    setAuditScannedListing(null);
    setAuditBusinessName('');
    setAuditNeighborhood('');
    setAuditPhone('');
    setAuditGoogleUrl('');
    setAuditExistingRating(4.5);
    setAuditExistingReviews(0);
    setAuditCategory(categoryOptions[0] || CATEGORY_OPTIONS[0]);
    setAuditGeneratedData(null);
    setShowManualAuditFields(false);
    showToast(isEn ? '✨ Ready to run a new audit' : '✨ Formulario listo para una nueva auditoría');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResetRescueForm = () => {
    setRescueContactName('');
    setRescueContactCompany('');
    setRescueContactPhone('');
    setRescueContactEmail('');
    setRescueContactRole('Dueño / Propietario');
    setRescueSearchQuery('');
    setRescueScannedListing(null);
    setRescueBusinessName('');
    setRescueNeighborhood('');
    setRescueCategory(categoryOptions[0] || CATEGORY_OPTIONS[0]);
    setRescueScenario('third_party');
    setRescueMaskedEmail('');
    showToast(isEn ? '✨ Ready to run a new rescue' : '✨ Formulario listo para un nuevo rescate');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResetAppealForm = () => {
    setAppealContactName('');
    setAppealContactCompany('');
    setAppealContactPhone('');
    setAppealContactEmail('');
    setAppealContactRole('Dueño / Propietario');
    setAppealSearchQuery('');
    setScannedAppealBiz(null);
    setAppealReviewsList([]);
    setSelectedAppealReview(null);
    setActiveAppealDossier(null);
    setShowManualReviewForm(false);
    setManualAuthor('');
    setManualRating(1);
    setManualTimeAgo('Reciente');
    setManualText('');
    setManualContextFlag('fake_customer');
    setManualNotes('');
    showToast(isEn ? '✨ Ready to scan or appeal another review' : '✨ Formulario listo para una nueva apelación');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleScanForAppeals = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = appealSearchQuery.trim();
    if (!query) {
      showToast(isEn ? '⚠️ Please enter the Google Maps link or business name' : '⚠️ Ingresa el enlace de Google Maps o nombre del negocio');
      return;
    }
    setIsScanningAppeals(true);
    try {
      const res = await fetch('/api/auditor/google-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const place: GooglePlaceData = data.data;
        setScannedAppealBiz(place);
        if (place.name && !appealContactCompany) {
          setAppealContactCompany(place.name);
        }
        if (place.phone && !appealContactPhone) {
          setAppealContactPhone(place.phone);
        }
        if (place.negativeReviews && place.negativeReviews.length > 0) {
          setAppealReviewsList(place.negativeReviews);
        }
        showToast(isEn ? `✅ Listing scanned: ${place.name}` : `✅ Ficha detectada: ${place.name} (${place.rating}★)`);
      } else {
        showToast(data.error || (isEn ? 'Could not scan listing' : 'No se pudo escanear la ficha'));
      }
    } catch (err: any) {
      showToast(isEn ? 'Connection error scanning listing' : 'Error de conexión al escanear la ficha');
    } finally {
      setIsScanningAppeals(false);
    }
  };

  const handleGenerateAppealForReview = async (review: NegativeReviewItem, customNotes?: string) => {
    const userMaxAppeals = currentUser?.maxAppealsMonthly ?? (currentUser?.accountType === 'partner_agency' ? 25 : currentUser?.accountType === 'director' ? 50 : 15);
    if (!isLuismaMaster && (monthlyUsage.appeals || 0) >= userMaxAppeals) {
      showToast(
        isEn
          ? `⚠️ Monthly limit of ${userMaxAppeals} review appeals reached. Contact General Directorate.`
          : `⚠️ Has alcanzado tu cupo mensual de ${userMaxAppeals} apelaciones de reseñas. Contacta a Dirección General para ampliar tu plan.`
      );
      return;
    }

    setSelectedAppealReview(review);
    setIsGeneratingAppeal(true);
    setActiveAppealDossier(null);

    const bizName = (scannedAppealBiz?.name || appealContactCompany || 'Negocio').trim();
    const bizCategory = scannedAppealBiz?.category || 'Negocio Local';
    const bizCity = scannedAppealBiz?.address ? parseAddressGeo(scannedAppealBiz.address).city : 'Colombia';

    try {
      const res = await fetch('/api/local-studio/appeal-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: bizName,
          category: bizCategory,
          city: bizCity,
          authorName: review.author,
          rating: review.rating,
          reviewDate: review.timeAgo,
          reviewText: review.text,
          contextFlag: review.contextFlag,
          additionalNotes: customNotes || manualNotes,
          contactName: appealContactName,
          contactCompany: appealContactCompany || bizName,
          contactPhone: appealContactPhone,
          contactEmail: appealContactEmail,
        }),
      });

      const resData = await res.json();
      if (resData.success && resData.dossier) {
        setActiveAppealDossier(resData.dossier);
        setMonthlyUsage((prev) => ({ ...prev, appeals: (prev.appeals || 0) + 1 }));

        try {
          await fetch('/api/local-studio/dossiers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: resData.dossier.id,
              advisorId: currentUser?.id || (isLuismaMaster ? 'adv-luisma' : 'adv-anon'),
              advisorName: currentUser?.name || 'Luisma • Director General & Founder',
              advisorPhone: currentUser?.phone || '+573058314049',
              advisorType: currentUser?.accountType || 'founder',
              country: currentUser?.country || 'Colombia',
              clientName: bizName,
              contactName: appealContactName,
              contactCompany: appealContactCompany || bizName,
              contactPhone: appealContactPhone,
              contactEmail: appealContactEmail,
              contactRole: appealContactRole,
              category: bizCategory,
              city: bizCity,
              googleUrl: scannedAppealBiz?.googleMapsUrl || '',
              mode: 'appeal',
              status: 'draft',
              data: resData.dossier,
            }),
          });
          fetchDossiers();
        } catch (saveErr) {
          console.warn('Could not auto-save appeal dossier:', saveErr);
        }

        showToast(isEn ? '⚖️ Legal appeal dossier generated successfully!' : '⚖️ ¡Expediente de apelación legal generado con éxito!');
      } else {
        showToast(resData.error || (isEn ? 'Error generating appeal' : 'Error al generar la apelación'));
      }
    } catch (err: any) {
      showToast(isEn ? 'Connection error generating appeal' : 'Error de conexión al generar la apelación');
    } finally {
      setIsGeneratingAppeal(false);
    }
  };

  const handleAddManualReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) {
      showToast(isEn ? '⚠️ Please enter the review text' : '⚠️ Por favor escribe o pega el texto de la reseña');
      return;
    }
    const newRev: NegativeReviewItem = {
      id: `manual-rev-${Date.now()}`,
      author: manualAuthor.trim() || 'Usuario anónimo de Google',
      rating: manualRating,
      timeAgo: manualTimeAgo.trim() || 'Reciente',
      text: manualText.trim(),
      contextFlag: manualContextFlag,
      detectedReason: `Ingresada manualmente • Causa: ${manualContextFlag}`,
      viability: 'ALTA',
    };
    setAppealReviewsList((prev) => [newRev, ...prev]);
    setShowManualReviewForm(false);
    showToast(isEn ? '✅ Negative review added to radar' : '✅ Reseña crítica añadida al radar de impugnaciones');
    handleGenerateAppealForReview(newRev, manualNotes);
  };

  // -------------------------------------------------------------
  // TAB 1 GENERATION: CREAR FICHA GANADORA
  // -------------------------------------------------------------
  const handleGenerateCreate = async () => {
    const finalBizName = createBusinessName.trim();
    if (!createContactName.trim()) {
      showToast(isEn ? '⚠️ Contact Person / Owner is required (*)' : '⚠️ La Persona de Contacto / Dueño es obligatoria (*)');
      return;
    }
    if (!createContactCompany.trim()) {
      showToast(isEn ? '⚠️ Contracting Company / Business is required (*)' : '⚠️ La Empresa / Razón Social Contratante es obligatoria (*)');
      return;
    }
    if (!createContactPhone.trim()) {
      showToast(isEn ? '⚠️ Direct WhatsApp is required (*)' : '⚠️ El WhatsApp Directo del cliente es obligatorio (*)');
      return;
    }
    if (!createContactEmail.trim()) {
      showToast(isEn ? '⚠️ Client Email is required (*)' : '⚠️ El Correo Electrónico del cliente es obligatorio (*)');
      return;
    }
    if (!finalBizName) {
      showToast(isEn ? '⚠️ Business Name is required (*)' : '⚠️ El Nombre Comercial o del Especialista es obligatorio (*)');
      return;
    }
    if (!createCity.trim()) {
      showToast(isEn ? '⚠️ City is required (*)' : '⚠️ La Ciudad es obligatoria (*)');
      return;
    }
    if (!createNeighborhood.trim()) {
      showToast(isEn ? '⚠️ Neighborhood / District is required (*)' : '⚠️ El Barrio o Localidad es obligatorio (*)');
      return;
    }
    if (createBusinessModel === 'service_area' && !createServiceAreas.trim()) {
      showToast(isEn ? '⚠️ Service coverage areas are required (*)' : '⚠️ Las Zonas de Cobertura a domicilio son obligatorias (*)');
      return;
    }
    if (!createSpecialties.trim()) {
      showToast(isEn ? '⚠️ Top 3 products/services are required (*)' : '⚠️ Los 3 Platos o Servicios Más Vendidos son obligatorios (*)');
      return;
    }
    if (!createPhone.trim()) {
      showToast(isEn ? '⚠️ Commercial WhatsApp / Phone is required (*)' : '⚠️ El WhatsApp Comercial de Atención es obligatorio (*)');
      return;
    }

    const userMaxCreates = currentUser?.maxCreatesMonthly ?? (currentUser?.accountType === 'partner_agency' ? 60 : currentUser?.accountType === 'director' ? 100 : 30);
    if (!isLuismaMaster && monthlyUsage.creates >= userMaxCreates) {
      showToast(isEn ? `⚠️ Monthly limit of ${userMaxCreates} creations reached. Contact General Directorate.` : `⚠️ Has alcanzado tu cupo mensual de ${userMaxCreates} creaciones. Contacta a Dirección General para ampliar tu plan.`);
      return;
    }

    setIsGeneratingCreate(true);
    setCreateGeneratedData(null);

    try {
      const payload = {
        mode: 'create',
        businessName: finalBizName,
        category: createCategory,
        city: createCity.trim() || 'Colombia',
        neighborhood: createNeighborhood.trim(),
        specialties: createSpecialties.trim(),
        phone: createPhone.trim() || createContactPhone.trim() || currentUser?.phone || '',
        googleUrl: '',
        existingRating: 5.0,
        existingReviews: 0,
        lang,
        businessModel: createBusinessModel,
        serviceAreas: createServiceAreas.trim(),
        reviewHighlights: [],
      };

      const res = await fetch('/api/local-studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (resData.success && resData.data) {
        setCreateGeneratedData(resData.data);
        setMonthlyUsage((prev) => ({ ...prev, creates: (prev.creates || 0) + 1 }));
        showToast(isEn ? '✨ Winning Top 3 Architecture generated!' : '✨ ¡Arquitectura Top 3 generada y registrada en Cartera!');

        // AUTO-SAVE to database
        try {
          const autoPayload = {
            advisorId: currentUser?.id || 'adv-luisma',
            advisorName: currentUser?.name || 'Luisma • Director General',
            advisorPhone: currentUser?.phone || '+573058314049',
            clientName: finalBizName,
            contactName: createContactName.trim(),
            contactCompany: createContactCompany.trim(),
            contactPhone: createContactPhone.trim(),
            contactEmail: createContactEmail.trim(),
            contactRole: createContactRole.trim(),
            category: createCategory,
            country: createCountry.trim() || 'Colombia',
            city: createCity.trim(),
            neighborhood: createNeighborhood.trim(),
            googleUrl: '',
            mode: 'create',
            businessModel: createBusinessModel,
            status: 'draft',
            data: resData.data,
          };
          fetch('/api/local-studio/dossiers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(autoPayload),
          }).then(() => fetchDossiers());
        } catch (autoErr) {
          console.warn('Auto-save error:', autoErr);
        }
      } else {
        showToast('⚠️ Error generando el expediente: ' + (resData.error || 'Reintente'));
      }
    } catch (err) {
      showToast('⚠️ Error de conexión con el motor de IA.');
    } finally {
      setIsGeneratingCreate(false);
    }
  };

  // -------------------------------------------------------------
  // TAB 2 GENERATION: AUDITORÍA FORENSE & TOP 3
  // -------------------------------------------------------------
  const handleGenerateAudit = async (overrides?: {
    businessName?: string;
    category?: string;
    city?: string;
    neighborhood?: string;
    googleUrl?: string;
    existingRating?: number;
    existingReviews?: number;
    phone?: string;
    reviewHighlights?: string[];
  }) => {
    const finalBizName = (overrides?.businessName ?? auditBusinessName).trim();
    if (!finalBizName) {
      showToast(isEn ? '⚠️ Please enter the business name or link' : '⚠️ Ingresa el nombre comercial o enlace del negocio');
      return;
    }

    const userMaxAudits = currentUser?.maxAuditsMonthly ?? (currentUser?.accountType === 'partner_agency' ? 60 : currentUser?.accountType === 'director' ? 100 : 30);
    if (!isLuismaMaster && monthlyUsage.audits >= userMaxAudits) {
      showToast(isEn ? `⚠️ Monthly limit of ${userMaxAudits} audits reached. Contact General Directorate.` : `⚠️ Has alcanzado tu cupo mensual de ${userMaxAudits} auditorías. Contacta a Dirección General para ampliar tu plan.`);
      return;
    }

    setIsGeneratingAudit(true);
    setAuditGeneratedData(null);

    const finalCategory = overrides?.category ?? auditCategory;
    const finalCity = (overrides?.city ?? auditCity).trim() || 'Colombia';
    const finalNeighborhood = (overrides?.neighborhood ?? auditNeighborhood).trim();
    const finalPhone = (overrides?.phone ?? auditPhone).trim() || auditContactPhone.trim() || currentUser?.phone || '';
    const finalGoogleUrl = (overrides?.googleUrl ?? auditGoogleUrl).trim();
    const finalRating = Number(overrides?.existingRating ?? auditExistingRating) || 4.5;
    const finalReviews = Number(overrides?.existingReviews ?? auditExistingReviews) || 0;

    try {
      const payload = {
        mode: 'audit',
        businessName: finalBizName,
        category: finalCategory,
        city: finalCity,
        neighborhood: finalNeighborhood,
        specialties: '',
        phone: finalPhone,
        googleUrl: finalGoogleUrl,
        existingRating: finalRating,
        existingReviews: finalReviews,
        lang,
        businessModel: 'storefront',
        serviceAreas: '',
        reviewHighlights: overrides?.reviewHighlights || auditScannedListing?.reviewHighlights || [],
      };

      const res = await fetch('/api/local-studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (resData.success && resData.data) {
        setAuditGeneratedData(resData.data);
        setMonthlyUsage((prev) => ({ ...prev, audits: (prev.audits || 0) + 1 }));
        showToast(isEn ? '✨ Forensic Audit completed with Gemini AI!' : '✨ ¡Auditoría Forense completada con IA Gemini!');

        // AUTO-SAVE to database
        try {
          const autoPayload = {
            advisorId: currentUser?.id || 'adv-luisma',
            advisorName: currentUser?.name || 'Luisma • Director General',
            advisorPhone: currentUser?.phone || '+573058314049',
            clientName: finalBizName,
            contactName: auditContactName.trim(),
            contactCompany: auditContactCompany.trim(),
            contactPhone: auditContactPhone.trim(),
            contactEmail: auditContactEmail.trim(),
            contactRole: auditContactRole.trim(),
            category: finalCategory,
            country: auditCountry.trim() || 'Colombia',
            city: finalCity,
            neighborhood: finalNeighborhood,
            googleUrl: finalGoogleUrl,
            mode: 'audit',
            status: 'draft',
            data: resData.data,
          };
          fetch('/api/local-studio/dossiers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(autoPayload),
          }).then(() => fetchDossiers());
        } catch (autoErr) {
          console.warn('Auto-save error:', autoErr);
        }
      } else {
        showToast('⚠️ Error generando la auditoría: ' + (resData.error || 'Reintente'));
      }
    } catch (err) {
      showToast('⚠️ Error de conexión con el motor de IA.');
    } finally {
      setIsGeneratingAudit(false);
    }
  };

  const handleScanAndAudit = async () => {
    const rawInput = auditQuery.trim();
    if (!rawInput) {
      showToast(isEn ? '⚠️ Please paste a Google Maps link or enter business name' : '⚠️ Pega el enlace de Google Maps o escribe el nombre del negocio');
      return;
    }

    setIsScanningAudit(true);
    showToast(isEn ? '🔍 Querying Google Maps API in real-time...' : '🔍 Reconociendo ficha con la API de Google Maps en vivo...');

    try {
      const res = await fetch('/api/auditor/google-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: rawInput }),
      });
      const data = await res.json();

      if (data?.success && data?.data) {
        const place: GooglePlaceData = data.data;
        setAuditScannedListing(place);

        const extractedName = place.name || rawInput;
        setAuditBusinessName(extractedName);
        if (typeof place.rating === 'number') setAuditExistingRating(place.rating);
        if (typeof place.reviewsCount === 'number') setAuditExistingReviews(place.reviewsCount);
        if (place.googleMapsUrl) setAuditGoogleUrl(place.googleMapsUrl);
        if (place.phone) {
          setAuditPhone(place.phone);
          if (!auditContactPhone) setAuditContactPhone(place.phone);
        }

        let parsedCity = auditCity;
        let parsedNeighborhood = auditNeighborhood;
        let parsedCountry = auditCountry;
        if (place.address && !place.address.toLowerCase().includes('ubicación verificada')) {
          const parsedGeo = parseAddressGeo(place.address, auditCountry, auditCity, auditNeighborhood);
          parsedCountry = parsedGeo.country;
          parsedCity = parsedGeo.city;
          parsedNeighborhood = parsedGeo.neighborhood;
          if (parsedGeo.country) setAuditCountry(parsedGeo.country);
          if (parsedGeo.city) setAuditCity(parsedGeo.city);
          if (parsedGeo.neighborhood) setAuditNeighborhood(parsedGeo.neighborhood);
        }

        const matchedCategory = mapDetectedCategoryToPrestigia(
          place.category || '',
          place.detectedCategories || [],
          isEn
        );
        setAuditCategory(matchedCategory);

        showToast(
          isEn
            ? `✓ Listing Recognized: ${extractedName} (${place.rating}★ · ${place.reviewsCount} reviews). Launching AI audit...`
            : `✓ Ficha Reconocida: ${extractedName} (${place.rating}★ · ${place.reviewsCount} opiniones). Ejecutando auditoría IA...`
        );

        await handleGenerateAudit({
          businessName: extractedName,
          category: matchedCategory,
          city: parsedCity,
          neighborhood: parsedNeighborhood,
          googleUrl: place.googleMapsUrl || rawInput,
          existingRating: place.rating,
          existingReviews: place.reviewsCount,
          phone: place.phone || auditPhone,
          reviewHighlights: place.reviewHighlights || [],
        });
      } else {
        const fallbackName = rawInput.replace(/https?:\/\/[^\s]+/g, '').trim() || rawInput;
        setAuditBusinessName(fallbackName);
        if (rawInput.startsWith('http')) setAuditGoogleUrl(rawInput);
        showToast(isEn ? '⚡ Auditing with detected profile data...' : '⚡ Auditando con los datos detectados...');
        await handleGenerateAudit({
          businessName: fallbackName,
          googleUrl: rawInput.startsWith('http') ? rawInput : '',
        });
      }
    } catch (err: any) {
      console.error('Scan error:', err);
      const fallbackName = rawInput.replace(/https?:\/\/[^\s]+/g, '').trim() || rawInput;
      setAuditBusinessName(fallbackName);
      if (rawInput.startsWith('http')) setAuditGoogleUrl(rawInput);
      await handleGenerateAudit({
        businessName: fallbackName,
        googleUrl: rawInput.startsWith('http') ? rawInput : '',
      });
    } finally {
      setIsScanningAudit(false);
    }
  };

  // -------------------------------------------------------------
  // TAB 3 SCANNER: RESCATE DE FICHA
  // -------------------------------------------------------------
  const handleRescueScan = async (queryInput?: string) => {
    const rawInput = (typeof queryInput === 'string' ? queryInput : rescueSearchQuery).trim();
    if (!rawInput) {
      showToast(isEn ? '⚠️ Please paste a Google Maps link or enter business name' : '⚠️ Pega el enlace de Google Maps o escribe el nombre del negocio');
      return;
    }

    const userMaxRescues = currentUser?.maxRescuesMonthly ?? (currentUser?.accountType === 'partner_agency' ? 20 : currentUser?.accountType === 'director' ? 50 : 10);
    if (!isLuismaMaster && monthlyUsage.rescues >= userMaxRescues) {
      showToast(isEn ? `⚠️ Monthly limit of ${userMaxRescues} rescues reached. Contact General Directorate.` : `⚠️ Has alcanzado tu cupo mensual de ${userMaxRescues} rescates. Contacta a Dirección General para ampliar tu plan.`);
      return;
    }

    setIsRescueScanning(true);
    showToast(isEn ? '🔍 Querying Google Maps API in real-time...' : '🔍 Reconociendo ficha con la API de Google Maps en vivo...');

    try {
      const res = await fetch('/api/auditor/google-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: rawInput }),
      });
      const data = await res.json();

      if (data?.success && data?.data) {
        const place: GooglePlaceData = data.data;
        setRescueScannedListing(place);

        const extractedName = place.name || rawInput;
        setRescueBusinessName(extractedName);
        if (place.phone && !rescueContactPhone) {
          setRescueContactPhone(place.phone);
        }

        if (place.address && !place.address.toLowerCase().includes('ubicación verificada')) {
          const parsedGeo = parseAddressGeo(place.address, rescueCountry, rescueCity, rescueNeighborhood);
          if (parsedGeo.country) setRescueCountry(parsedGeo.country);
          if (parsedGeo.city) setRescueCity(parsedGeo.city);
          if (parsedGeo.neighborhood) setRescueNeighborhood(parsedGeo.neighborhood);
        }

        const matchedCategory = mapDetectedCategoryToPrestigia(
          place.category || '',
          place.detectedCategories || [],
          isEn
        );
        setRescueCategory(matchedCategory);

        showToast(
          isEn
            ? `✓ Listing Recognized: ${extractedName} (${place.rating}★ · ${place.reviewsCount} reviews). Rescue protocol ready!`
            : `✓ Ficha Reconocida: ${extractedName} (${place.rating}★ · ${place.reviewsCount} opiniones). ¡Protocolo de rescate listo!`
        );
      } else {
        const fallbackName = rawInput.replace(/https?:\/\/[^\s]+/g, '').trim() || rawInput;
        setRescueBusinessName(fallbackName);
        showToast(isEn ? `✓ Listing set to "${fallbackName}". Rescue protocol ready!` : `✓ Ficha asignada a "${fallbackName}". ¡Protocolo de rescate listo!`);
      }
    } catch (err: any) {
      console.error('Rescue scan error:', err);
      const fallbackName = rawInput.replace(/https?:\/\/[^\s]+/g, '').trim() || rawInput;
      setRescueBusinessName(fallbackName);
      showToast(isEn ? '⚠️ Connection error. Profile name set manually.' : '⚠️ Error de conexión. Nombre de ficha asignado.');
    } finally {
      setIsRescueScanning(false);
    }
  };

  // -------------------------------------------------------------
  // TAB 5 SCANNER: 3 ARMAS TOP 3 (VENTAS)
  // -------------------------------------------------------------
  const handleToolsScan = async (queryInput?: string) => {
    const rawInput = (typeof queryInput === 'string' ? queryInput : toolsSearchQuery).trim();
    if (!rawInput) {
      showToast(isEn ? '⚠️ Please paste a Google Maps link or enter business name' : '⚠️ Pega el enlace de Google Maps o escribe el nombre del negocio');
      return;
    }

    setIsToolsScanning(true);
    showToast(isEn ? '🔍 Querying Google Maps API for sales arsenal...' : '🔍 Reconociendo ficha con Google Maps para las herramientas de venta...');

    try {
      const res = await fetch('/api/auditor/google-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: rawInput }),
      });
      const data = await res.json();

      if (data?.success && data?.data) {
        const place: GooglePlaceData = data.data;
        setToolsScannedListing(place);

        const extractedName = place.name || rawInput;
        setToolsBusinessName(extractedName);
        if (typeof place.rating === 'number') setToolsExistingRating(place.rating);
        if (typeof place.reviewsCount === 'number') setToolsExistingReviews(place.reviewsCount);

        let parsedCity = toolsCity;
        if (place.address && !place.address.toLowerCase().includes('ubicación verificada')) {
          const parsedGeo = parseAddressGeo(place.address);
          parsedCity = parsedGeo.city;
          setToolsCity(parsedGeo.city);
        }

        const matchedCategory = mapDetectedCategoryToPrestigia(
          place.category || '',
          place.detectedCategories || [],
          isEn
        );
        setToolsCategory(matchedCategory);

        const smartTicket = getAverageTicketByNiche(matchedCategory);
        setRoiAverageTicket(smartTicket);

        const smartKw = getDefaultKeywordByNiche(matchedCategory, parsedCity, isEn);
        setGeoGridKeyword(smartKw);

        showToast(
          isEn
            ? `✓ Profile Connected: ${extractedName} (${matchedCategory}). Sales tools configured!`
            : `✓ Ficha Conectada: ${extractedName} (${matchedCategory}). ¡Armas de venta configuradas!`
        );
      } else {
        const fallbackName = rawInput.replace(/https?:\/\/[^\s]+/g, '').trim() || rawInput;
        setToolsBusinessName(fallbackName);
        setGeoGridKeyword(getDefaultKeywordByNiche(toolsCategory, toolsCity, isEn));
        showToast(isEn ? `✓ Connected to "${fallbackName}"` : `✓ Conectado a "${fallbackName}"`);
      }
    } catch (err: any) {
      console.error('Tools scan error:', err);
      const fallbackName = rawInput.replace(/https?:\/\/[^\s]+/g, '').trim() || rawInput;
      setToolsBusinessName(fallbackName);
      showToast(isEn ? '⚠️ Lookup failed. Profile name set manually.' : '⚠️ Error al consultar Google Maps. Nombre asignado manualmente.');
    } finally {
      setIsToolsScanning(false);
    }
  };

  // -------------------------------------------------------------
  // COMPETITOR SCANNER FOR RIVAL SPY
  // -------------------------------------------------------------
  const handleRivalScan = async () => {
    const rawInput = rivalSearchQuery.trim();
    if (!rawInput) {
      showToast(isEn ? '⚠️ Please enter competitor link or name' : '⚠️ Pega el enlace de Google Maps o escribe el nombre del rival');
      return;
    }

    setIsRivalScanning(true);
    showToast(isEn ? '🔍 Inspecting competitor listing on Google Maps...' : '🔍 Escaneando perfil del competidor en Google Maps en tiempo real...');

    try {
      const res = await fetch('/api/auditor/google-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: rawInput }),
      });
      const data = await res.json();

      if (data?.success && data?.data) {
        const place: GooglePlaceData = data.data;
        setRivalName(place.name || rawInput);
        if (typeof place.rating === 'number') setRivalRating(place.rating);
        if (typeof place.reviewsCount === 'number') setRivalReviews(place.reviewsCount);
        showToast(
          isEn
            ? `✓ Competitor Scanned: ${place.name} (${place.rating}★ · ${place.reviewsCount} reviews). Head-to-Head calculated!`
            : `✓ Competidor Reconocido: ${place.name} (${place.rating}★ · ${place.reviewsCount} opiniones). ¡Batalla cara a cara calculada!`
        );
      } else {
        const fallbackName = rawInput.replace(/https?:\/\/[^\s]+/g, '').trim() || rawInput;
        setRivalName(fallbackName);
        showToast(isEn ? `✓ Competitor set to "${fallbackName}"` : `✓ Competidor asignado a "${fallbackName}"`);
      }
    } catch (err: any) {
      console.error('Rival scan error:', err);
      const fallbackName = rawInput.replace(/https?:\/\/[^\s]+/g, '').trim() || rawInput;
      setRivalName(fallbackName);
      showToast(isEn ? '⚠️ Competitor lookup error. Name updated.' : '⚠️ Error al escanear competidor. Nombre actualizado.');
    } finally {
      setIsRivalScanning(false);
    }
  };

  // -------------------------------------------------------------
  // MANUAL SAVE HANDLERS (PER TAB)
  // -------------------------------------------------------------
  const handleSaveCreateDossier = async () => {
    if (!createGeneratedData || !createBusinessName.trim()) {
      showToast('⚠️ Primero genera un expediente para guardar');
      return;
    }

    try {
      const payload = {
        advisorId: currentUser?.id || 'adv-luisma',
        advisorName: currentUser?.name || 'Luisma • Director General',
        advisorPhone: currentUser?.phone || '+573058314049',
        clientName: createBusinessName.trim(),
        contactName: createContactName.trim(),
        contactCompany: createContactCompany.trim(),
        contactPhone: createContactPhone.trim(),
        contactEmail: createContactEmail.trim(),
        contactRole: createContactRole.trim(),
        category: createCategory,
        country: createCountry.trim() || 'Colombia',
        city: createCity.trim(),
        neighborhood: createNeighborhood.trim(),
        googleUrl: '',
        mode: 'create',
        businessModel: createBusinessModel,
        status: 'draft',
        data: createGeneratedData,
      };

      const res = await fetch('/api/local-studio/dossiers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (resData.success) {
        showToast('💾 ¡Expediente guardado en Cartera de Clientes!');
        fetchDossiers();
      } else {
        showToast('⚠️ Error al guardar: ' + (resData.error || ''));
      }
    } catch (err) {
      showToast('⚠️ Error de conexión al guardar.');
    }
  };

  const handleSaveAuditDossier = async () => {
    if (!auditGeneratedData || !auditBusinessName.trim()) {
      showToast('⚠️ Primero genera una auditoría para guardar');
      return;
    }

    try {
      const payload = {
        advisorId: currentUser?.id || 'adv-luisma',
        advisorName: currentUser?.name || 'Luisma • Director General',
        advisorPhone: currentUser?.phone || '+573058314049',
        clientName: auditBusinessName.trim(),
        contactName: auditContactName.trim(),
        contactCompany: auditContactCompany.trim(),
        contactPhone: auditContactPhone.trim(),
        contactEmail: auditContactEmail.trim(),
        contactRole: auditContactRole.trim(),
        category: auditCategory,
        country: auditCountry.trim() || 'Colombia',
        city: auditCity.trim(),
        neighborhood: auditNeighborhood.trim(),
        googleUrl: auditGoogleUrl.trim(),
        mode: 'audit',
        status: 'draft',
        data: auditGeneratedData,
      };

      const res = await fetch('/api/local-studio/dossiers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (resData.success) {
        showToast('💾 ¡Expediente guardado en Cartera de Clientes!');
        fetchDossiers();
      } else {
        showToast('⚠️ Error al guardar: ' + (resData.error || ''));
      }
    } catch (err) {
      showToast('⚠️ Error de conexión al guardar.');
    }
  };

  // Copy helper with toast
  const copyToClipboard = (text: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(`¡${label} copiado al portapapeles! 📋`);
    }
  };

  // Print PDF helper
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // 100% PRIVATE DOSSIERS: ONLY Luisma's personal clients (Never mixed with team)
  const luismaBaseDossiers = useMemo(() => {
    if (!isLuismaMaster) {
      return savedDossiers.filter((d) => !d.deletedByAdvisor);
    }
    return savedDossiers.filter(
      (d) =>
        (d.advisorId === 'adv-luisma' ||
        d.advisorName.toLowerCase().includes('luisma') ||
        d.advisorName.toLowerCase().includes('director')) &&
        !d.deletedByAdvisor
    );
  }, [savedDossiers, isLuismaMaster]);

  // Dynamic filter values from Luisma's portfolio
  const dossierAvailableCountries = useMemo(() => {
    const set = new Set<string>();
    luismaBaseDossiers.forEach((d) => {
      set.add(d.country || 'Colombia');
    });
    allCountriesList.forEach((c) => set.add(c));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [luismaBaseDossiers, allCountriesList]);

  const dossierAvailableCities = useMemo(() => {
    // Si no hay país seleccionado, NO aparece ninguna ciudad en la lista
    if (dossierCountryFilter === 'all') {
      return [];
    }
    const set = new Set<string>();
    const countryCities = getCitiesForCountry(dossierCountryFilter);
    countryCities.forEach((c) => set.add(c));
    luismaBaseDossiers.forEach((d) => {
      if ((d.country || 'Colombia') === dossierCountryFilter && d.city) set.add(d.city);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [luismaBaseDossiers, dossierCountryFilter, customCitiesByCountry]);

  const dossierAvailableNeighborhoods = useMemo(() => {
    // Si no hay país o no hay ciudad seleccionada, NO aparece ningún barrio en la lista
    if (dossierCountryFilter === 'all' || dossierCityFilter === 'all') {
      return [];
    }
    const set = new Set<string>();
    luismaBaseDossiers.forEach((d) => {
      if ((d.country || 'Colombia') !== dossierCountryFilter) return;
      if (d.city.toLowerCase() !== dossierCityFilter.toLowerCase()) return;
      if (d.neighborhood) set.add(d.neighborhood);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [luismaBaseDossiers, dossierCountryFilter, dossierCityFilter]);

  // Executive portfolio KPI stats (unaffected by active filter view)
  const totalLuismaSetupRevenue = useMemo(() => {
    return luismaBaseDossiers.reduce((acc, d) => acc + (d.setupFeeChargedUsd || 0), 0);
  }, [luismaBaseDossiers]);

  const totalLuismaMrr = useMemo(() => {
    return luismaBaseDossiers.reduce((acc, d) => acc + (d.monthlyPlanUsd || 0), 0);
  }, [luismaBaseDossiers]);

  const prestigiaSubscribersCount = useMemo(() => {
    return luismaBaseDossiers.filter((d) => d.closingStatus === 'prestigia_subscriber').length;
  }, [luismaBaseDossiers]);

  // Active filtered view of dossiers for UI presentation
  const myDossiers = useMemo(() => {
    return luismaBaseDossiers.filter((d) => {
      if (dossierModeFilter !== 'all' && d.mode !== dossierModeFilter) return false;
      if (dossierCountryFilter !== 'all' && (d.country || 'Colombia') !== dossierCountryFilter) return false;
      if (dossierCityFilter !== 'all' && d.city.toLowerCase() !== dossierCityFilter.toLowerCase()) return false;
      if (
        dossierNeighborhoodFilter !== 'all' &&
        (!d.neighborhood || d.neighborhood.toLowerCase() !== dossierNeighborhoodFilter.toLowerCase())
      )
        return false;
      if (dossierClosingFilter !== 'all') {
        const cStatus = d.closingStatus || 'lead_draft';
        if (cStatus !== dossierClosingFilter) return false;
      }
      if (dossierSearch.trim()) {
        const q = dossierSearch.toLowerCase();
        const match =
          d.clientName.toLowerCase().includes(q) ||
          (d.contactName && d.contactName.toLowerCase().includes(q)) ||
          (d.contactCompany && d.contactCompany.toLowerCase().includes(q)) ||
          (d.contactPhone && d.contactPhone.toLowerCase().includes(q)) ||
          (d.contactEmail && d.contactEmail.toLowerCase().includes(q)) ||
          d.city.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          (d.country && d.country.toLowerCase().includes(q)) ||
          (d.neighborhood && d.neighborhood.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [
    luismaBaseDossiers,
    dossierModeFilter,
    dossierCountryFilter,
    dossierCityFilter,
    dossierNeighborhoodFilter,
    dossierClosingFilter,
    dossierSearch,
  ]);

  // NETWORK DOSSIERS: All team advisors and licensed B2B partner agencies
  const networkFilteredDossiers = useMemo(() => {
    return savedDossiers
      .filter((d) => d.advisorId !== 'adv-luisma' && !d.deletedByAdvisor) // Exclude Luisma's private records & deleted
      .filter((d) => {
        if (networkAdvisorFilter !== 'all' && d.advisorId !== networkAdvisorFilter) return false;
        if (networkModeFilter !== 'all' && d.mode !== networkModeFilter) return false;
        if (networkCountryFilter !== 'all' && (d.country || 'Colombia') !== networkCountryFilter) return false;
        if (networkCityFilter !== 'all' && d.city.toLowerCase() !== networkCityFilter.toLowerCase()) return false;
        if (networkTypeFilter !== 'all') {
          if (networkTypeFilter === 'partner_agency' && d.advisorType !== 'partner_agency') return false;
          if (networkTypeFilter === 'internal_advisor' && d.advisorType === 'partner_agency') return false;
        }
        if (networkSearch.trim()) {
          const q = networkSearch.toLowerCase();
          const match =
            d.clientName.toLowerCase().includes(q) ||
            (d.contactName && d.contactName.toLowerCase().includes(q)) ||
            (d.contactCompany && d.contactCompany.toLowerCase().includes(q)) ||
            (d.contactPhone && d.contactPhone.toLowerCase().includes(q)) ||
            (d.contactEmail && d.contactEmail.toLowerCase().includes(q)) ||
            d.advisorName.toLowerCase().includes(q) ||
            d.city.toLowerCase().includes(q) ||
            d.category.toLowerCase().includes(q) ||
            (d.country && d.country.toLowerCase().includes(q));
          if (!match) return false;
        }
        return true;
      });
  }, [
    savedDossiers,
    networkAdvisorFilter,
    networkModeFilter,
    networkCountryFilter,
    networkCityFilter,
    networkTypeFilter,
    networkSearch,
  ]);

  // FORENSIC VAULT: Dossiers soft-deleted by advisors/agencies, preserved for Director General auditing
  const forensicDeletedDossiers = useMemo(() => {
    return savedDossiers.filter((d) => d.deletedByAdvisor);
  }, [savedDossiers]);

  // Distinct countries available in network
  const networkAvailableCountries = useMemo(() => {
    const set = new Set<string>();
    savedDossiers.forEach((d) => {
      set.add(d.country || 'Colombia');
    });
    advisorsList.forEach((a) => {
      if (a.country) set.add(a.country);
    });
    allCountriesList.forEach((c) => set.add(c));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [savedDossiers, advisorsList, allCountriesList]);

  // Distinct cities available in network conditioned strictly to selected country
  const networkAvailableCities = useMemo(() => {
    if (networkCountryFilter === 'all') {
      return [];
    }
    const set = new Set<string>();
    const countryCities = getCitiesForCountry(networkCountryFilter);
    countryCities.forEach((c) => set.add(c));
    savedDossiers.forEach((d) => {
      if ((d.country || 'Colombia') === networkCountryFilter && d.city) set.add(d.city);
    });
    advisorsList.forEach((a) => {
      if ((a.country || 'Colombia') === networkCountryFilter && a.city) set.add(a.city);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [savedDossiers, advisorsList, networkCountryFilter, customCitiesByCountry]);

  // FILTERED ADVISORS FOR NETWORK TAB (Exclusively Advisor & Agency Cards)
  const filteredAdvisors = useMemo(() => {
    return advisorsList.filter((adv) => {
      if (networkCountryFilter !== 'all' && (adv.country || 'Colombia') !== networkCountryFilter) return false;
      if (networkCityFilter !== 'all' && (adv.city || '').toLowerCase() !== networkCityFilter.toLowerCase()) return false;
      if (networkTypeFilter !== 'all') {
        if (networkTypeFilter === 'director' && adv.accountType !== 'director' && adv.accountType !== 'founder') return false;
        if (networkTypeFilter === 'partner_agency' && adv.accountType !== 'partner_agency') return false;
        if (networkTypeFilter === 'internal_advisor' && adv.accountType !== 'internal_advisor') return false;
      }
      if (networkActiveFilter !== 'all') {
        if (networkActiveFilter === 'active' && !adv.active) return false;
        if (networkActiveFilter === 'inactive' && adv.active) return false;
      }
      if (networkSearch.trim()) {
        const q = networkSearch.toLowerCase();
        const match =
          adv.name.toLowerCase().includes(q) ||
          adv.username.toLowerCase().includes(q) ||
          (adv.phone && adv.phone.toLowerCase().includes(q)) ||
          (adv.city && adv.city.toLowerCase().includes(q)) ||
          (adv.country && adv.country.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [
    advisorsList,
    networkCountryFilter,
    networkCityFilter,
    networkTypeFilter,
    networkActiveFilter,
    networkSearch,
  ]);

  // Distinct countries and cities fallback for general use
  const availableCountries = networkAvailableCountries;
  const availableCities = networkAvailableCities;

  // Download Network Performance Report in CSV
  const downloadNetworkCsvReport = () => {
    const headers = [
      'Fecha',
      'Asesor o Agencia',
      'Tipo de Cuenta',
      'Pais',
      'Ciudad',
      'Ficha en Google Maps',
      'Cliente o Dueño Contratante',
      'Empresa Contratante',
      'WhatsApp Cliente',
      'Categoria',
      'Modalidad',
      'Score Salud Google',
      'Telefono Asesor',
    ];

    const rows = networkFilteredDossiers.map((d) => [
      `"${new Date(d.createdAt).toLocaleDateString()}"`,
      `"${(d.advisorName || '').replace(/"/g, '""')}"`,
      d.advisorType === 'partner_agency' ? 'Agencia Partner (Licencia Mensual)' : 'Asesor Comercial Interno',
      `"${d.country || 'Colombia'}"`,
      `"${d.city || ''}"`,
      `"${(d.clientName || '').replace(/"/g, '""')}"`,
      `"${(d.contactName || '').replace(/"/g, '""')}"`,
      `"${(d.contactCompany || '').replace(/"/g, '""')}"`,
      `"${d.contactPhone || ''}"`,
      `"${(d.category || '').replace(/"/g, '""')}"`,
      d.mode === 'create'
        ? 'Ficha Nueva Desde Cero'
        : d.mode === 'rescue'
        ? 'Rescate de Ficha Google Maps'
        : d.mode === 'appeal'
        ? 'Apelación de Reseñas 1-3★'
        : 'Auditoria Forense Top 3',
      d.data?.healthScore !== undefined ? `"${d.data.healthScore}/100"` : '"N/A"',
      `"${d.advisorPhone || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_seguimiento_red_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📥 ¡Reporte de seguimiento de red descargado en CSV con éxito!');
  };

  // Jump from Advisor management tab directly to that advisor's dossiers in the network tab
  const handleViewAdvisorDossiers = (advisor: StudioAdvisorUser) => {
    setNetworkAdvisorFilter(advisor.id);
    setActiveTab('network');
    setNetworkSubView('monitor');
    showToast(isEn ? `📂 Viewing dossiers for ${advisor.name}` : `📂 Visualizando cuentas de ${advisor.name}`);
  };

  // Load a dossier from list into workspace
  const handleLoadDossier = (dossier: StudioDossierRecord) => {
    if (dossier.mode === 'create') {
      setCreateBusinessName(dossier.clientName);
      setCreateContactName(dossier.contactName || '');
      setCreateContactCompany(dossier.contactCompany || '');
      setCreateContactPhone(dossier.contactPhone || '');
      setCreateContactEmail(dossier.contactEmail || '');
      setCreateContactRole(dossier.contactRole || 'Dueño / Propietario');
      setCreateCategory(dossier.category || categoryOptions[0]);
      if (dossier.country) setCreateCountry(dossier.country);
      setCreateCity(dossier.city || 'Bogotá');
      setCreateNeighborhood(dossier.neighborhood || '');
      if (dossier.businessModel) setCreateBusinessModel(dossier.businessModel);
      setCreateGeneratedData(dossier.data);
      setActiveTab('create');
    } else if (dossier.mode === 'audit') {
      setAuditBusinessName(dossier.clientName);
      setAuditContactName(dossier.contactName || '');
      setAuditContactCompany(dossier.contactCompany || '');
      setAuditContactPhone(dossier.contactPhone || '');
      setAuditContactEmail(dossier.contactEmail || '');
      setAuditContactRole(dossier.contactRole || 'Dueño / Propietario');
      setAuditCategory(dossier.category || categoryOptions[0]);
      if (dossier.country) setAuditCountry(dossier.country);
      setAuditCity(dossier.city || 'Bogotá');
      setAuditNeighborhood(dossier.neighborhood || '');
      setAuditGoogleUrl(dossier.googleUrl || '');
      setAuditGeneratedData(dossier.data);
      setActiveTab('audit');
    } else if (dossier.mode === 'rescue') {
      setRescueBusinessName(dossier.clientName);
      setRescueContactName(dossier.contactName || '');
      setRescueContactCompany(dossier.contactCompany || '');
      setRescueContactPhone(dossier.contactPhone || '');
      setRescueContactEmail(dossier.contactEmail || '');
      setRescueContactRole(dossier.contactRole || 'Dueño / Propietario');
      setRescueCategory(dossier.category || categoryOptions[0]);
      if (dossier.country) setRescueCountry(dossier.country);
      setRescueCity(dossier.city || 'Bogotá');
      setRescueNeighborhood(dossier.neighborhood || '');
      setActiveTab('rescue');
    } else if (dossier.mode === 'appeal') {
      setAppealContactName(dossier.contactName || '');
      setAppealContactCompany(dossier.contactCompany || '');
      setAppealContactPhone(dossier.contactPhone || '');
      setAppealContactEmail(dossier.contactEmail || '');
      setAppealContactRole(dossier.contactRole || 'Dueño / Propietario');
      setActiveAppealDossier(dossier.data);
      if (dossier.data?.authorName) {
        setSelectedAppealReview({
          id: dossier.id,
          author: dossier.data.authorName,
          rating: dossier.data.rating || 1,
          timeAgo: dossier.data.reviewDate || 'Reciente',
          text: dossier.data.reviewText || '',
          contextFlag: dossier.data.contextFlag || 'fake_customer',
          detectedReason: dossier.data.contextLabel || 'Impugnación previa',
          viability: dossier.data.successProbability || 'ALTA',
        });
      }
      setActiveTab('appeals');
    }
    showToast(`Expediente cargado: ${dossier.clientName}`);
  };

  const handleDeleteDossier = async (id: string, isPermanentPurge?: boolean) => {
    const msg = isPermanentPurge
      ? (isEn
          ? '🛡️ PRESTIGIA LOCAL STUDIO:\n\nAre you sure you want to PERMANENTLY purge this dossier from the database? This action is irreversible.'
          : '🛡️ PRESTIGIA LOCAL STUDIO:\n\n¿Seguro que deseas purgar DEFINITIVAMENTE este expediente de la base de datos? Esta acción es irreversible.')
      : (isEn
          ? '🛡️ PRESTIGIA LOCAL STUDIO:\n\nAre you sure you want to delete this dossier?'
          : '🛡️ PRESTIGIA LOCAL STUDIO:\n\n¿Seguro que deseas eliminar este expediente?');
    if (typeof window !== 'undefined' && !window.confirm(msg)) return;

    // Actualización optimista inmediata en la UI
    setSavedDossiers((prev) =>
      isPermanentPurge
        ? prev.filter((d) => d.id !== id)
        : prev.map((d) => (d.id === id ? { ...d, deletedByAdvisor: true } : d))
    );

    try {
      const url = isPermanentPurge
        ? `/api/local-studio/dossiers?id=${id}&purge=true`
        : `/api/local-studio/dossiers?id=${id}`;
      const res = await fetch(url, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success !== false) {
        showToast(isPermanentPurge ? '🗑️ Expediente purgado definitivamente' : '🗑️ Expediente eliminado con éxito');
      } else {
        showToast('⚠️ No se pudo eliminar el expediente del servidor.');
      }
      await fetchDossiers();
    } catch {
      showToast('⚠️ Error de conexión al eliminar.');
      await fetchDossiers();
    }
  };

  const handleRestoreDossier = async (id: string) => {
    // Actualización optimista inmediata
    setSavedDossiers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, deletedByAdvisor: false } : d))
    );

    try {
      const res = await fetch(`/api/local-studio/dossiers?id=${id}&restore=true`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success !== false) {
        showToast('✓ ¡Expediente restaurado con éxito a la vista activa!');
      } else {
        showToast('⚠️ No se pudo restaurar el expediente.');
      }
      await fetchDossiers();
    } catch {
      showToast('⚠️ Error de conexión al restaurar.');
      await fetchDossiers();
    }
  };

  const handleOpenEditClosing = (dossier: StudioDossierRecord) => {
    setEditingDossierClosing(dossier);
    setClosingFormCountry(dossier.country || 'Colombia');
    setClosingFormCity(dossier.city || 'Bogotá');
    setClosingFormNeighborhood(dossier.neighborhood || '');
    setClosingFormMode(dossier.mode || 'audit');
    setClosingFormStatus(dossier.closingStatus || 'lead_draft');
    setClosingFormSetupFee(
      dossier.setupFeeChargedUsd !== undefined
        ? dossier.setupFeeChargedUsd
        : dossier.closingStatus === 'prestigia_subscriber'
        ? 0
        : 250
    );
    setClosingFormMonthlyPlan(
      dossier.monthlyPlanUsd !== undefined
        ? dossier.monthlyPlanUsd
        : dossier.closingStatus === 'prestigia_subscriber'
        ? 199
        : 0
    );
    setClosingFormPaymentMethod(dossier.paymentMethod || '');
    setClosingFormNotes(dossier.closingNotes || '');
  };

  const handleSaveDossierClosing = async () => {
    if (!editingDossierClosing) return;
    setIsSavingClosing(true);
    try {
      const payload = {
        id: editingDossierClosing.id,
        clientName: editingDossierClosing.clientName,
        category: editingDossierClosing.category,
        city: closingFormCity.trim() || editingDossierClosing.city,
        neighborhood: closingFormNeighborhood.trim(),
        country: closingFormCountry.trim() || editingDossierClosing.country || 'Colombia',
        mode: closingFormMode,
        closingStatus: closingFormStatus,
        setupFeeChargedUsd: Number(closingFormSetupFee) || 0,
        monthlyPlanUsd: Number(closingFormMonthlyPlan) || 0,
        prestigiaPlan: (closingFormMonthlyPlan >= 199 ? 'elite' : closingFormMonthlyPlan > 0 ? 'standard' : 'none') as 'standard' | 'elite' | 'enterprise' | 'none',
        paymentMethod: closingFormPaymentMethod,
        closingNotes: closingFormNotes,
      };

      const res = await fetch('/api/local-studio/dossiers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast('¡Estado de cierre y cobro actualizado con éxito! 💰');
        setSavedDossiers((prev) =>
          prev.map((d) =>
            d.id === editingDossierClosing.id ? { ...d, ...payload, updatedAt: new Date().toISOString() } : d
          )
        );
        setEditingDossierClosing(null);
      } else {
        showToast('Error al actualizar el cierre');
      }
    } catch (e) {
      console.error(e);
      showToast('Error de red al actualizar cierre');
    } finally {
      setIsSavingClosing(false);
    }
  };

  // Save new advisor or licensed agency partner
  const handleCreateAdvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdvisorName || !newAdvisorUser || !newAdvisorPass) {
      showToast('⚠️ Completa los campos obligatorios');
      return;
    }

    setIsSavingAdvisor(true);
    try {
      const res = await fetch('/api/local-studio/advisors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAdvisorName,
          username: newAdvisorUser,
          password: newAdvisorPass,
          phone: newAdvisorPhone,
          role: 'advisor',
          accountType: newAccountType,
          country: newAdvisorCountry,
          city: newAdvisorCity,
          monthlyFeeUsd: Number(newAdvisorMonthlyFee) || 0,
          licenseStatus: newAdvisorLicenseStatus,
          maxCreatesMonthly: Number(newAdvisorMaxCreates) || (newAccountType === 'partner_agency' ? 60 : 30),
          maxAuditsMonthly: Number(newAdvisorMaxAudits) || (newAccountType === 'partner_agency' ? 60 : 30),
          maxRescuesMonthly: Number(newAdvisorMaxRescues) || (newAccountType === 'partner_agency' ? 20 : 10),
          active: true,
          masterKey: adminMasterKey,
        }),
      });

      const resData = await res.json();
      if (resData.success) {
        showToast(
          newAccountType === 'partner_agency'
            ? `🏢 ¡Agencia Partner ${newAdvisorName} registrada y licenciada con éxito!`
            : `💼 ¡Asesor Comercial ${newAdvisorName} creado con éxito!`
        );
        setNewAdvisorName('');
        setNewAdvisorUser('');
        setNewAdvisorPass('');
        fetchAdvisors();
        setNetworkSubView('directory');
      } else {
        showToast('⚠️ Error: ' + (resData.error || 'No autorizado'));
      }
    } catch (err) {
      showToast('⚠️ Error al registrar cuenta');
    } finally {
      setIsSavingAdvisor(false);
    }
  };

  // Open modal to modify advisor or agency partner account
  const handleOpenEditAdvisor = (advisor: StudioAdvisorUser) => {
    setEditingAdvisor(advisor);
    setEditAdvisorName(advisor.name || '');
    setEditAdvisorUser(advisor.username || '');
    setEditAdvisorPass(''); // Blank means keep unchanged
    setEditAdvisorPhone(advisor.phone || '+57');
    setEditAdvisorCountry(advisor.country || 'Colombia');
    setEditAdvisorCity(advisor.city || 'Bogotá');
    setEditAdvisorAccountType(
      advisor.accountType === 'partner_agency'
        ? 'partner_agency'
        : advisor.accountType === 'director'
        ? 'director'
        : advisor.accountType === 'founder'
        ? 'founder'
        : 'internal_advisor'
    );
    setEditAdvisorMonthlyFee(advisor.monthlyFeeUsd ?? 79);
    setEditAdvisorLicenseStatus(advisor.licenseStatus || 'active');
    setEditAdvisorMaxCreates(advisor.maxCreatesMonthly ?? (advisor.accountType === 'partner_agency' ? 60 : advisor.accountType === 'director' ? 100 : 30));
    setEditAdvisorMaxAudits(advisor.maxAuditsMonthly ?? (advisor.accountType === 'partner_agency' ? 60 : advisor.accountType === 'director' ? 100 : 30));
    setEditAdvisorMaxRescues(advisor.maxRescuesMonthly ?? (advisor.accountType === 'partner_agency' ? 20 : advisor.accountType === 'director' ? 50 : 10));
    setShowEditAdvisorModal(true);
  };

  // Save modified advisor account
  const handleSaveAdvisorEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdvisor) return;
    if (!editAdvisorName.trim() || !editAdvisorUser.trim()) {
      showToast('⚠️ Nombre y usuario son obligatorios');
      return;
    }

    setIsUpdatingAdvisor(true);
    try {
      const payload: any = {
        id: editingAdvisor.id,
        name: editAdvisorName.trim(),
        username: editAdvisorUser.trim().toLowerCase(),
        phone: editAdvisorPhone.trim(),
        role: editAdvisorAccountType === 'director' || editAdvisorAccountType === 'founder' ? 'admin' : 'advisor',
        accountType: editAdvisorAccountType,
        country: editAdvisorCountry.trim(),
        city: editAdvisorCity.trim(),
        monthlyFeeUsd: Number(editAdvisorMonthlyFee) || 0,
        licenseStatus: (editingAdvisor.accountType === 'founder' || editingAdvisor.id === 'adv-luisma') ? 'active' : editAdvisorLicenseStatus,
        maxCreatesMonthly: Number(editAdvisorMaxCreates),
        maxAuditsMonthly: Number(editAdvisorMaxAudits),
        maxRescuesMonthly: Number(editAdvisorMaxRescues),
        masterKey: 'admin',
      };
      if (editAdvisorPass.trim()) {
        payload.password = editAdvisorPass.trim();
      }

      const res = await fetch('/api/local-studio/advisors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (resData.success) {
        showToast(isEn ? '✓ Account successfully updated!' : '✓ ¡Cuenta modificada y actualizada con éxito!');
        setShowEditAdvisorModal(false);
        setEditingAdvisor(null);
        fetchAdvisors();
      } else {
        showToast('⚠️ Error: ' + (resData.error || 'No se pudo guardar'));
      }
    } catch {
      showToast('⚠️ Error de conexión al actualizar asesor');
    } finally {
      setIsUpdatingAdvisor(false);
    }
  };

  // Delete advisor account with confirmation
  const handleDeleteAdvisor = async (advisor: StudioAdvisorUser) => {
    if (advisor.id === 'adv-luisma' || advisor.id === 'adv-admin') {
      showToast('⚠️ No se puede eliminar la cuenta de Dirección Principal.');
      return;
    }
    const confirmMsg = isEn
      ? `🛡️ PRESTIGIA LOCAL STUDIO:\n\nAre you sure you want to delete the account "${advisor.name}" (@${advisor.username})? All their dossiers will remain in the database.`
      : `🛡️ PRESTIGIA LOCAL STUDIO:\n\n¿Estás seguro de que deseas eliminar la cuenta de "${advisor.name}" (@${advisor.username})? Sus expedientes se conservarán en el sistema.`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/local-studio/advisors?id=${advisor.id}&masterKey=admin`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast(isEn ? `✓ Account "${advisor.name}" deleted` : `✓ Cuenta "${advisor.name}" eliminada exitosamente`);
        fetchAdvisors();
      } else {
        showToast(`⚠️ Error: ${data.error || 'No se pudo eliminar'}`);
      }
    } catch {
      showToast('⚠️ Error de conexión al eliminar asesor');
    }
  };

  // Toggle active/inactive (encender / apagar cuenta de asesor)
  const handleToggleAdvisorActive = async (advisor: StudioAdvisorUser) => {
    if (advisor.id === 'adv-luisma' || advisor.accountType === 'founder') {
      showToast('⚠️ La cuenta de Dirección General no se puede desactivar.');
      return;
    }
    const newActiveState = !advisor.active;
    try {
      const res = await fetch('/api/local-studio/advisors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: advisor.id,
          name: advisor.name,
          username: advisor.username,
          active: newActiveState,
          masterKey: 'admin',
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          newActiveState
            ? `🟢 Cuenta de "${advisor.name}" encendida y activada con éxito.`
            : `🔴 Cuenta de "${advisor.name}" apagada y desactivada con éxito.`
        );
        fetchAdvisors();
      } else {
        showToast('⚠️ Error al actualizar estado de la cuenta');
      }
    } catch {
      showToast('⚠️ Error de conexión');
    }
  };

  // Toggle visible password for an advisor card
  const toggleRevealPassword = (id: string) => {
    setRevealedPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // =============================================================
  // AUTHENTICATION GATE: IF NO USER IS LOGGED IN, RENDER SECURE LOGIN SCREEN
  // (Prevents any workspace tools or tabs from being exposed in the background)
  // =============================================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
        {/* Subtle Ambient Background Mesh (Clean & Secure) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />
        </div>

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-indigo-600 via-indigo-700 to-amber-500 text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs sm:text-sm flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200 border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <header className="border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between relative z-10 backdrop-blur-md bg-slate-950/80">
          <div className="flex items-center gap-3">
            <PrestigiaIcon className="w-8 h-8 drop-shadow-md shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-widest text-white">PRESTIGIA</span>
              <span className="text-[10px] text-amber-400 font-bold tracking-wider uppercase">Local Studio • Top 3 Engine</span>
            </div>
          </div>

          {/* Bilingual Switcher */}
          <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-0.5 text-[11px] font-black">
            <button
              type="button"
              onClick={() => handleToggleLang('es')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                lang === 'es' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              🇨🇴 ES
            </button>
            <button
              type="button"
              onClick={() => handleToggleLang('en')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                lang === 'en' ? 'bg-indigo-600 text-white shadow-md font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              🇺🇸 EN
            </button>
          </div>
        </header>

        {/* Centered Login Card */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-center space-y-4">
            <div className="pb-1 border-b border-slate-800 text-center">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                {isEn ? '🔒 Access Control • Identification Required' : '🔒 Control de Acceso • Identificación Requerida'}
              </span>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 flex items-center justify-center mx-auto shadow-xl p-2.5 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-indigo-500/20 rounded-2xl blur-sm" />
              <PrestigiaIcon className="w-full h-full relative z-10 drop-shadow-md" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">{tAuth.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{tAuth.subtitle}</p>
            </div>

            <form onSubmit={handleLogin} autoComplete="off" className="space-y-3 text-left text-xs pt-2">
              {/* Trampa anti-autocompletado para gestores de contraseñas de navegadores */}
              <div style={{ position: 'absolute', opacity: 0, height: 0, width: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }} aria-hidden="true">
                <input type="text" name="prestigia_decoy_user" tabIndex={-1} autoComplete="off" defaultValue="" />
                <input type="password" name="prestigia_decoy_pass" tabIndex={-1} autoComplete="new-password" defaultValue="" />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">{tAuth.usernameLabel}</label>
                <input
                  type="text"
                  name="prestigia_id_user"
                  id="prestigia_id_user"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  data-lpignore="true"
                  data-1p-ignore="true"
                  readOnly={!userFieldActive}
                  onFocus={() => setUserFieldActive(true)}
                  onClick={() => setUserFieldActive(true)}
                  value={loginUsername}
                  onChange={(e) => {
                    setLoginUsername(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  placeholder={isEn ? 'Enter your username' : 'Ingresa tu usuario'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Sección Dinámica: Identificador Inteligente de Rango y Perfil */}
              {detectedLoginUser && (
                <div
                  className={`p-3 rounded-2xl border transition-all animate-in fade-in zoom-in-95 duration-200 ${
                    detectedLoginUser.accountType === 'founder'
                      ? 'bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-500/10'
                      : detectedLoginUser.accountType === 'partner_agency'
                      ? 'bg-gradient-to-r from-purple-950/70 via-slate-900 to-purple-950/40 border-purple-500/50 shadow-lg shadow-purple-500/10'
                      : detectedLoginUser.accountType === 'internal_advisor'
                      ? 'bg-gradient-to-r from-indigo-950/70 via-slate-900 to-indigo-950/40 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shadow shrink-0 ${
                        detectedLoginUser.accountType === 'founder'
                          ? 'bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 ring-2 ring-amber-400/40'
                          : detectedLoginUser.accountType === 'partner_agency'
                          ? 'bg-purple-600 text-white ring-2 ring-purple-400/30'
                          : detectedLoginUser.accountType === 'internal_advisor'
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-400/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {detectedLoginUser.accountType === 'founder'
                        ? '👑'
                        : detectedLoginUser.accountType === 'partner_agency'
                        ? '🏢'
                        : detectedLoginUser.accountType === 'internal_advisor'
                        ? '💼'
                        : '❓'}
                    </div>

                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-white text-xs truncate">
                          {detectedLoginUser.fullName}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                            detectedLoginUser.accountType === 'founder'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                              : detectedLoginUser.accountType === 'partner_agency'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                              : detectedLoginUser.accountType === 'internal_advisor'
                              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {detectedLoginUser.badgeLabel}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-tight truncate">
                        {detectedLoginUser.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-300 mb-1">{tAuth.passwordLabel}</label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="prestigia_sec_token"
                    id="prestigia_sec_token"
                    autoComplete="new-password"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    readOnly={!passFieldActive}
                    onFocus={() => setPassFieldActive(true)}
                    onClick={() => setPassFieldActive(true)}
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (loginError) setLoginError('');
                    }}
                    placeholder="••••"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400 font-mono text-xs tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-amber-400 transition cursor-pointer p-1"
                    title={showPassword ? (isEn ? 'Hide password' : 'Ocultar contraseña') : (isEn ? 'Show password' : 'Ver contraseña')}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {loginError && <p className="text-xs text-rose-400 font-bold">{loginError}</p>}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer border border-slate-700 active:scale-98"
              >
                {isLoggingIn ? tAuth.verifying : tAuth.btnLogin}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500 relative z-10">
          <p>Prestigia Local Studio™ • Google Maps Top 3 Optimization Engine © 2026</p>
        </footer>
      </div>
    );
  }

  // =============================================================
  // AUTHENTICATED WORKSPACE (ONLY MOUNTED & RENDERED FOR LOGGED-IN USERS)
  // =============================================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white print:bg-white print:text-slate-900 print:min-h-0 print:p-0 print:m-0">
      {/* Print Stylesheet for Pristine White Corporate Dossiers */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            margin: 8mm 10mm !important;
            size: A4 portrait;
          }
          *, *::before, *::after {
            background-color: transparent !important;
            background-image: none !important;
            box-shadow: none !important;
            text-shadow: none !important;
            filter: none !important;
            backdrop-filter: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body, main {
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #0f172a !important;
            font-size: 8.5pt !important;
            line-height: 1.25 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }
          header, footer, nav, button, input, textarea, select, .print-hidden, [class*="print:hidden"] {
            display: none !important;
          }
          [class*="bg-slate-"], [class*="bg-indigo-"], [class*="bg-amber-"], [class*="bg-emerald-"], [class*="bg-gradient-"] {
            background-color: #ffffff !important;
            background-image: none !important;
          }
          h1, h2, h3, h4, h5, h6, strong, b, .font-black, .font-extrabold {
            color: #0f172a !important;
          }
          p, span, div, li, td, th {
            color: #1e293b !important;
          }
          .print-card-box {
            background-color: #ffffff !important;
            border: 1px solid #cbd5e1 !important;
            border-radius: 8px !important;
            padding: 8px 10px !important;
            margin-bottom: 3mm !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      ` }} />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-indigo-600 via-indigo-700 to-amber-500 text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs sm:text-sm flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200 border border-white/20">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Unified Sticky Header & Workspace Navigation Tabs (Fija al Scroll) */}
      <div className="sticky top-0 z-40 print:hidden bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-2xl">
        {/* Top Header */}
        <header className="px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/70">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 select-none">
            <PrestigiaIcon className="w-8 h-8 drop-shadow-md shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-widest text-white">PRESTIGIA</span>
              <span className="text-[10px] text-amber-400 font-bold tracking-wider uppercase">Local Studio • Top 3 Engine</span>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-[11px] font-bold">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{t.tagline}</span>
          </span>
        </div>

        {/* Advisor Controls & Navigation */}
        <div className="flex items-center gap-2.5">
          {currentUser ? (
            <div
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs border transition shadow-sm ${
                currentUser.role === 'admin'
                  ? 'bg-gradient-to-r from-amber-950/60 to-slate-900 border-amber-500/40 text-amber-200'
                  : 'bg-gradient-to-r from-indigo-950/60 to-slate-900 border-indigo-500/40 text-indigo-200'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${
                  currentUser.role === 'admin' ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
              />
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white text-[11px] leading-tight">{currentUser.name}</span>
                  <span
                    className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                      currentUser.role === 'admin'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                    }`}
                  >
                    {currentUser.role === 'admin' ? (lang === 'en' ? 'DIRECTOR' : 'DIRECTOR') : (lang === 'en' ? 'ADVISOR' : 'ASESOR')}
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono">{currentUser.phone}</span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setLoginUsername('');
                setLoginPassword('');
                setLoginError('');
                setShowAuthModal(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t.loginProfile}</span>
            </button>
          )}

          {/* Bilingual Language Switcher */}
          <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-0.5 text-[11px] font-black print:hidden">
            <button
              type="button"
              onClick={() => handleToggleLang('es')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                lang === 'es'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🇨🇴 ES
            </button>
            <button
              type="button"
              onClick={() => handleToggleLang('en')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                lang === 'en'
                  ? 'bg-indigo-600 text-white shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🇺🇸 EN
            </button>
          </div>

          {/* Salir Button Solo en la Esquina Superior Derecha */}
          {currentUser && (
            <button
              type="button"
              onClick={handleLogout}
              title={isEn ? 'Log out of Prestigia Local Studio' : 'Cerrar sesión y salir del sistema'}
              className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 hover:text-white transition cursor-pointer text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 print:hidden"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>{t.logoutBtn}</span>
            </button>
          )}

          {hasActiveGeneratedData && (
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition shadow-md shadow-amber-500/10 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.downloadPdf}</span>
            </button>
          )}
        </div>
        </header>

        {/* Main Workspace Navigation Switcher (Pestañas Fijas de Ancho Completo Sin Barra de Movimiento) */}
        <nav className="bg-slate-900/95 border-b border-slate-800/80 px-2 sm:px-6 py-2">
          <div className="max-w-7xl mx-auto flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 w-full">
            <button
              type="button"
              onClick={() => setActiveTab('create')}
              className={`flex-1 min-w-0 px-2.5 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{t.tabCreate}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('audit')}
              className={`flex-1 min-w-0 px-2.5 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                activeTab === 'audit'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{t.tabAudit}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rescue')}
              className={`flex-1 min-w-0 px-2.5 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                activeTab === 'rescue'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 shadow-md shadow-rose-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{t.tabRescue}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('appeals')}
              className={`flex-1 min-w-0 px-2.5 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                activeTab === 'appeals'
                  ? 'bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-600 text-slate-950 shadow-md shadow-rose-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{t.tabAppeals}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tools')}
              className={`flex-1 min-w-0 px-2.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                activeTab === 'tools'
                  ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-slate-950 font-black shadow-md'
                  : 'bg-slate-950 text-amber-300 hover:text-white border border-amber-500/40'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{t.tabTools}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('dossiers')}
              className={`flex-1 min-w-0 px-2.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                activeTab === 'dossiers'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{t.tabDossiers}</span>
            </button>

            {isLuismaMaster && (
              <button
                type="button"
                onClick={() => setActiveTab('network')}
                className={`flex-1 min-w-0 px-2.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                  activeTab === 'network' || activeTab === 'advisors'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-black'
                    : 'bg-slate-950 text-indigo-400 hover:text-white border border-indigo-500/30'
                }`}
              >
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{t.tabNetwork}</span>
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 print:max-w-none print:p-0 print:m-0 print:space-y-2">
        {/* PRINT-ONLY CORPORATE DOSSIER HEADER */}
        <div className="hidden print:flex items-center justify-between pb-3 border-b-2 border-slate-800 text-[10px] text-slate-700 font-bold uppercase tracking-wider mb-4">
          <div className="flex items-center gap-3">
            {customLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={customLogoUrl} alt="Logo" className="max-h-12 max-w-[160px] object-contain rounded" />
            ) : (
              <span className="font-black text-slate-950 text-sm tracking-tight">PRESTIGIA LOCAL STUDIO</span>
            )}
            <span className="text-slate-400">•</span>
            <span className="text-amber-700 font-extrabold text-xs">
              {isEn ? 'MASTER TOP 3 LOCAL RANKING DOSSIER' : 'EXPEDIENTE MAESTRO DE POSICIONAMIENTO LOCAL TOP 3'}
            </span>
          </div>
          <div className="text-right">
            <span className="block">
              {isEn ? 'ASSIGNED CONSULTANT' : 'CONSULTOR ASIGNADO'}: {currentUser?.name || (isEn ? 'Prestigia LatAm & USA' : 'Prestigia LatAm')}
            </span>
            <span className="text-slate-500 font-mono">WHATSAPP: {currentUser?.phone || '+57 305 831 4049'}</span>
          </div>
        </div>

        {/* =============================================================
            TAB 1: CREAR FICHA GANADORA DESDE CERO
            ============================================================= */}
        {activeTab === 'create' && (
          <div className="space-y-6">
            {/* Header intro */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden print:hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                    {t.mod1Badge}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    {t.mod1Title}
                  </h1>
                  <p className="text-xs text-slate-300 max-w-2xl">
                    {t.mod1Desc}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
                  {/* Credit Counter Badge */}
                  {isLuismaMaster ? (
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                      <div className="text-left">
                        <span className="text-[9px] uppercase font-black tracking-wider text-amber-400/80 block">{isEn ? 'Monthly AI Credits' : 'Créditos IA Mensuales'}</span>
                        <strong className="text-xs font-black text-amber-200">{isEn ? '👑 UNLIMITED • Master' : '👑 ILIMITADO • Master'}</strong>
                      </div>
                    </div>
                  ) : (
                    <div className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl border transition ${
                      monthlyUsage.creates >= (currentUser?.maxCreatesMonthly ?? (currentUser?.accountType === 'partner_agency' ? 60 : currentUser?.accountType === 'director' ? 100 : 30))
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    }`}>
                      <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div className="text-left">
                        <span className="text-[9px] uppercase font-black tracking-wider opacity-80 block">{isEn ? 'Creation Quota' : 'Cupo de Creaciones'}</span>
                        <div className="text-xs font-black flex items-center gap-1">
                          <span>{monthlyUsage.creates} / {currentUser?.maxCreatesMonthly ?? (currentUser?.accountType === 'partner_agency' ? 60 : currentUser?.accountType === 'director' ? 100 : 30)} {isEn ? 'Used' : 'Usadas'}</span>
                          <span className="text-[10px] font-bold opacity-75">
                            ({Math.max(0, (currentUser?.maxCreatesMonthly ?? (currentUser?.accountType === 'partner_agency' ? 60 : currentUser?.accountType === 'director' ? 100 : 30)) - monthlyUsage.creates)} {isEn ? 'avail.)' : 'disp.)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block font-mono">{t.mod1Time}</span>
                    <span className="text-lg font-black text-emerald-400">{t.mod1TimeVal}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetCreateForm}
                    className="px-3.5 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer shrink-0 active:scale-95"
                    title={isEn ? 'Clear form to create another profile' : 'Crear una nueva ficha desde cero'}
                  >
                    <Plus className="w-4 h-4 text-slate-950" />
                    <span>{isEn ? 'New Profile' : 'Crear Nueva Ficha'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Form & Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Input Form (4 cols) */}
              <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl print:hidden">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-black text-white">{t.formHeader1}</h2>
                </div>

                {/* Tarjeta de Datos del Cliente / Contratante (Quién Solicita y Paga el Servicio) */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-900 border border-indigo-500/30 space-y-2.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-indigo-500/20">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-xs font-black text-indigo-300">
                        {isEn ? '👤 Client / Contractor Info (Who Hires & Pays)' : '👤 Datos del Cliente / Contratante (Quién Solicita y Paga el Servicio)'}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/40">
                      CRM
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">
                        {isEn ? 'Contact Person / Owner *' : 'Persona de Contacto / Dueño *'}
                      </label>
                      <input
                        type="text"
                        value={createContactName}
                        onChange={(e) => setCreateContactName(e.target.value)}
                        placeholder={isEn ? 'e.g. John Doe' : 'Ej: Carlos Gómez'}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">
                        {isEn ? 'Contracting Company / Legal Entity *' : 'Empresa / Razón Social Contratante *'}
                      </label>
                      <input
                        type="text"
                        value={createContactCompany}
                        onChange={(e) => setCreateContactCompany(e.target.value)}
                        placeholder={isEn ? 'e.g. Acme Corp / Individual' : 'Ej: Inversiones Gómez SAS / Particular'}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1 flex items-center justify-between">
                        <span>{isEn ? 'Direct WhatsApp *' : 'WhatsApp Directo *'}</span>
                        {createContactPhone && (
                          <a
                            href={`https://wa.me/${createContactPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] text-emerald-400 hover:text-emerald-300 font-bold"
                          >
                            Chat
                          </a>
                        )}
                      </label>
                      <input
                        type="tel"
                        value={createContactPhone}
                        onChange={(e) => setCreateContactPhone(e.target.value)}
                        placeholder="+57 300 123 4567"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">
                        {isEn ? 'Email *' : 'Correo Electrónico *'}
                      </label>
                      <input
                        type="email"
                        value={createContactEmail}
                        onChange={(e) => setCreateContactEmail(e.target.value)}
                        placeholder={isEn ? 'contact@company.com' : 'contacto@empresa.com'}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">
                        {isEn ? 'Role *' : 'Cargo / Relación *'}
                      </label>
                      <select
                        value={createContactRole}
                        onChange={(e) => setCreateContactRole(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-400 text-xs"
                      >
                        <option value="Dueño / Propietario">{isEn ? '👑 Owner' : '👑 Dueño / Propietario'}</option>
                        <option value="Gerente General">{isEn ? '💼 General Manager' : '💼 Gerente General'}</option>
                        <option value="Director de Marketing">{isEn ? '📈 Marketing Dir.' : '📈 Dir. Marketing'}</option>
                        <option value="Administrador">{isEn ? '🏢 Branch Admin' : '🏢 Administrador'}</option>
                        <option value="Encargado">{isEn ? '🔑 Shift Manager' : '🔑 Encargado'}</option>
                        <option value="Particular">{isEn ? '👤 Private Client' : '👤 Particular'}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Business Model Selector */}
                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">
                      {t.opModel}
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-950 border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setCreateBusinessModel('storefront')}
                        className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-[11px] ${
                          createBusinessModel === 'storefront'
                            ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{t.storefront}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCreateBusinessModel('service_area')}
                        className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-[11px] ${
                          createBusinessModel === 'service_area'
                            ? 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-600/30'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{t.serviceArea}</span>
                      </button>
                    </div>

                    {createBusinessModel === 'service_area' && (
                      <div className="mt-2 p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-[10.5px] text-indigo-200 leading-relaxed space-y-1">
                        <div className="flex items-center gap-1.5 font-black text-indigo-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>{t.sabNoticeTitle}</span>
                        </div>
                        <p>{t.sabNoticeDesc}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      {t.bizName}
                    </label>
                    <input
                      type="text"
                      value={createBusinessName}
                      onChange={(e) => setCreateBusinessName(e.target.value)}
                      placeholder={t.bizNamePlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      {t.sector}
                    </label>
                    <select
                      value={createCategory}
                      onChange={(e) => setCreateCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-400 transition"
                    >
                      {categoryOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Localización Enlazada en Cascada: País -> Ciudad -> Barrio */}
                  <div className="space-y-2.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isEn ? 'Linked Geographic Location (Americas & Europe)' : 'Ubicación Geográfica Enlazada (América y Europa)'}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* 1º Selector de País con botón + */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-300">
                            {isEn ? '1st Country *' : '1º País *'}
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowAddCountryModal(true)}
                            className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 font-bold transition cursor-pointer"
                            title={isEn ? 'Add another Country to catalog' : 'Agregar otro País al catálogo'}
                          >
                            <Plus className="w-3 h-3" />
                            <span>{isEn ? 'Country' : 'País'}</span>
                          </button>
                        </div>
                        <select
                          value={createCountry}
                          onChange={(e) => handleSelectCreateCountry(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-400 transition text-sm cursor-pointer"
                        >
                          {allCountriesList.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 2º Selector de Ciudad condicionado con botón + */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-300">
                            {isEn ? `2nd City (${createCountry}) *` : `2º Ciudad (${createCountry}) *`}
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setTargetCountryForNewCity(createCountry);
                              setShowAddCityModal(true);
                            }}
                            className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 font-bold transition cursor-pointer"
                            title={isEn ? `Add another City to ${createCountry}` : `Agregar otra Ciudad a ${createCountry}`}
                          >
                            <Plus className="w-3 h-3" />
                            <span>{isEn ? 'City' : 'Ciudad'}</span>
                          </button>
                        </div>
                        <select
                          value={createCity}
                          onChange={(e) => setCreateCity(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-400 transition text-sm cursor-pointer"
                        >
                          {getCitiesForCountry(createCountry).map((cty) => (
                            <option key={cty} value={cty}>
                              {cty}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* 3º Barrio / Localidad */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        {isEn ? '3rd Neighborhood or District *' : '3º Barrio o Localidad *'}
                      </label>
                      <input
                        type="text"
                        value={createNeighborhood}
                        onChange={(e) => setCreateNeighborhood(e.target.value)}
                        placeholder={isEn ? 'e.g. Brickell, Downtown, Manhattan, Beverly Hills...' : 'Ej: Chapinero, Poblado, Polanco, Brickell, Centro...'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition text-sm"
                      />
                    </div>
                  </div>

                  {createBusinessModel === 'service_area' && (
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">
                        {t.coverageAreas}
                      </label>
                      <input
                        type="text"
                        value={createServiceAreas}
                        onChange={(e) => setCreateServiceAreas(e.target.value)}
                        placeholder={t.coveragePlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-indigo-500/40 text-indigo-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-400 transition"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">{t.specialties}</label>
                    <input
                      type="text"
                      value={createSpecialties}
                      onChange={(e) => setCreateSpecialties(e.target.value)}
                      placeholder={t.specialtiesPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">{t.phone}</label>
                    <input
                      type="text"
                      value={createPhone}
                      onChange={(e) => setCreatePhone(e.target.value)}
                      placeholder={t.phonePlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition"
                    />
                  </div>
                </div>

                {!isLuismaMaster && monthlyUsage.creates >= (currentUser?.maxCreatesMonthly ?? (currentUser?.accountType === 'partner_agency' ? 60 : currentUser?.accountType === 'director' ? 100 : 30)) && (
                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Tope mensual de {currentUser?.maxCreatesMonthly ?? 30} creaciones alcanzado. Contacta a Dirección General.</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleGenerateCreate()}
                  disabled={isGeneratingCreate || (!isLuismaMaster && monthlyUsage.creates >= (currentUser?.maxCreatesMonthly ?? (currentUser?.accountType === 'partner_agency' ? 60 : currentUser?.accountType === 'director' ? 100 : 30)))}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer active:scale-98"
                >
                  {isGeneratingCreate ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{t.btnGenerating}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-slate-950" />
                      <span>{t.btnGenerate}</span>
                    </>
                  )}
                </button>

                {/* Botón rápido Crear Nueva Ficha cuando ya hay una generada */}
                {createGeneratedData && (
                  <button
                    type="button"
                    onClick={handleResetCreateForm}
                    className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border-2 border-emerald-500/50 hover:border-emerald-400 text-emerald-300 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>{isEn ? 'Create Another Profile' : 'Crear Nueva Ficha'}</span>
                  </button>
                )}

                {/* WhatsApp Request Kit Quick Button */}
                {createGeneratedData && (
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        createGeneratedData.whatsappOnboardingMessage,
                        isEn ? 'Client Media Request Kit' : 'Mensaje para pedir fotos y video al cliente'
                      )
                    }
                    className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-emerald-500/30 text-emerald-300 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{t.btnCopyWhatsapp}</span>
                  </button>
                )}

                {/* Commercial Strategy: Setup Fee & 100% Annual Plan Waiver */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-slate-900 to-teal-500/10 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span className="text-[10px] font-black uppercase text-emerald-400">
                        {isEn ? 'Advisor Monetization Strategy' : 'Estrategia Comercial de Cierre'}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      $150 - $250 USD
                    </span>
                  </div>
                  <div>
                    <strong className="text-white text-xs block mb-1">
                      {isEn ? 'Technical Setup Waiver Closing Hook' : 'Setup Fee de Creación 100% Bonificado'}
                    </strong>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {isEn
                        ? 'Waive 100% of the technical setup fee ($0 implementation cost) as an irresistible closing hook when the client subscribes to their tailored Prestigia plan (Digital QR & WhatsApp Flow + 5★ Review Accelerator).'
                        : 'Bonifica el 100% del setup técnico ($0 costo de implementación) como gancho de cierre de alto impacto si el cliente adquiere su Plan Prestigia a la medida (Software de Reseñas 5★ + Blindaje Digital).'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const scriptText = isEn
                        ? `Hello ${createBusinessName || 'Business Owner'}, to build, verify, and architect your Google Maps profile for Top 3 rankings, our technical setup fee is 100% WAIVED ($0 implementation cost) when you activate your tailored Prestigia plan for your business (5★ Review Accelerator + Digital Reputation Shield). Shall we reserve your slot and launch this week?`
                        : `Hola estimado/a ${createBusinessName || 'propietario'}, para crear, verificar y estructurar su ficha en Google Maps con arquitectura de posicionamiento Top 3, le BONIFICAMOS el 100% del Setup Fee técnico ($0 costo de implementación) al activar su Plan Prestigia a la medida de su negocio (Software de Reseñas 5★ + Blindaje Digital). ¿Le reservo el cupo y coordinamos la activación esta semana?`;
                      copyToClipboard(scriptText, isEn ? 'Setup Fee Proposal' : 'Propuesta de Setup Fee');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Copy Annual Plan Closing Script (WhatsApp)' : 'Copiar Propuesta Comercial de Cierre (WhatsApp)'}</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Output Blueprint (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                {!createGeneratedData && !isGeneratingCreate && (
                  <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                      <Sparkles className="w-6 h-6 text-amber-400" />
                    </div>
                    <h3 className="text-base font-bold text-white">{t.readyTitle}</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      {t.readyDesc}
                    </p>
                  </div>
                )}

                {isGeneratingCreate && (
                  <div className="p-12 rounded-3xl bg-slate-900/80 border border-emerald-500/30 text-center space-y-4">
                    <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                    <div>
                      <h3 className="text-base font-black text-white">{t.consultingAi}</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {t.consultingAiDesc}
                      </p>
                    </div>
                  </div>
                )}

                {createGeneratedData && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-slate-900 border border-slate-800 print:hidden">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-slate-300 font-semibold">
                          {isEn ? 'Blueprint Ready: ' : 'Arquitectura Lista: '}<strong className="text-white">{createBusinessName}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Botón: Crear Nueva Ficha */}
                        <button
                          type="button"
                          onClick={handleResetCreateForm}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer active:scale-95"
                          title={isEn ? 'Clear form to create another profile' : 'Crear otra nueva ficha desde cero'}
                        >
                          <Plus className="w-3.5 h-3.5 text-slate-950" />
                          <span>{isEn ? 'New Profile' : 'Crear Nueva Ficha'}</span>
                        </button>

                        {/* White-Label Logo Uploader */}
                        <div className="flex items-center gap-1">
                          <label
                            title={isEn ? 'Upload client/agency logo for white-label PDF' : 'Subir logo del cliente o agencia para PDF marca blanca'}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
                          >
                            <Upload className="w-3.5 h-3.5 text-amber-400" />
                            <span>{customLogoUrl ? (isEn ? 'Logo ✓' : 'Logo ✓') : (isEn ? 'Add Logo' : 'Logo Marca Blanca')}</span>
                            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                          </label>
                          {customLogoUrl && (
                            <button
                              type="button"
                              onClick={handleRemoveLogo}
                              title={isEn ? 'Remove custom logo' : 'Quitar logo personalizado'}
                              className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={handleSaveCreateDossier}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5 text-amber-400" />
                          <span>{t.saveDossier}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handlePrint}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>{t.downloadPdf}</span>
                        </button>
                      </div>
                    </div>

                    {/* 1. Categorías Oficiales */}
                    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 print-card-box">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                          {isEn ? 'Key Step 1: Algorithmic Taxonomy' : 'Paso Clave 1: Taxonomía Algorítmica'}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              `${createGeneratedData.primaryCategory}\nSubcategorías: ${createGeneratedData.secondaryCategories.join(', ')}`,
                              'Categorías'
                            )
                          }
                          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer print:hidden"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Copy All' : 'Copiar Todas'}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/40">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-1">
                            {isEn ? 'Primary Category (Google Official)' : 'Categoría Principal (Oficial Google)'}
                          </span>
                          <span className="text-sm font-black text-white">{createGeneratedData.primaryCategory}</span>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                            {createGeneratedData.secondaryCategories.length} {isEn ? 'Secondary Subcategories (To Capture Search Intent)' : 'Subcategorías Secundarias (Para Ganar Búsquedas)'}
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {createGeneratedData.secondaryCategories.map((sc, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-lg bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-[10.5px] font-semibold"
                              >
                                + {sc}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SPECIAL MODULE FOR INDEPENDENTS / SAB (SERVICE AREA BUSINESS) */}
                    {(createGeneratedData.businessModel === 'service_area' ||
                      (createGeneratedData.suggestedServiceAreas && createGeneratedData.suggestedServiceAreas.length > 0)) && (
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border-2 border-indigo-500/40 space-y-4 print-card-box">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-indigo-400" />
                            <h3 className="text-sm font-black text-white">
                              {lang === 'en'
                                ? 'Service Area Business Configuration (SAB)'
                                : 'Configuración de Áreas de Cobertura (Profesional Independiente / SAB)'}
                            </h3>
                          </div>
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-500/40">
                            🛡️ {lang === 'en' ? 'Address Hidden to Public' : 'Dirección Oculta al Público'}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/30 text-xs space-y-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300 block">
                            {lang === 'en'
                              ? 'Target Coverage Areas to Register in Google Maps:'
                              : 'Zonas y Barrios de Cobertura para Registrar en Google Maps:'}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {(createGeneratedData.suggestedServiceAreas || [
                              `${createCity} Norte`, `${createCity} Centro`, `${createCity} Occidente`, `Área Metropolitana de ${createCity}`,
                            ]).map((area, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-200 border border-indigo-500/30 font-bold text-[11px]"
                              >
                                📍 {area}
                              </span>
                            ))}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">
                            {lang === 'en'
                              ? 'Google allows up to 20 service areas within a 2-hour driving radius. Never enter a residential address with a map pin.'
                              : 'Google permite hasta 20 zonas de atención dentro de un radio de 2 horas. Nunca pongas la dirección de tu casa/apartamento como local físico abierto.'}
                          </p>
                        </div>

                        {/* Digital QR & WhatsApp Review Protocol for Independents */}
                        {createGeneratedData.nfcPocketReviewGuide && (
                          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-black text-amber-300 text-[11px] flex items-center gap-1.5">
                                ⭐ {createGeneratedData.nfcPocketReviewGuide.title}
                              </span>
                              <span className="text-[9px] font-mono text-slate-500">Prestigia Digital Review Engine</span>
                            </div>

                            <ul className="space-y-1 text-slate-300 text-[11px]">
                              {createGeneratedData.nfcPocketReviewGuide.steps.map((st, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-amber-400 font-black">✓</span>
                                  <span>{st}</span>
                                </li>
                              ))}
                            </ul>

                            <div className="p-2.5 rounded-lg bg-slate-900 border border-amber-500/30 text-[10.5px] italic text-amber-200">
                              <span className="font-bold not-italic text-slate-400 block mb-0.5">
                                {lang === 'en' ? 'Script to say to the client on-site:' : 'Frase exacta para decirle al cliente al terminar el trabajo:'}
                              </span>
                              {createGeneratedData.nfcPocketReviewGuide.samplePitch}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 2. Título Estratégico */}
                    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 print-card-box">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                          {isEn ? 'Key Step 2: Strategic Anti-Suspension Title' : 'Paso Clave 2: Título Estratégico Anti-Suspensión'}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(createGeneratedData.optimizedTitle, 'Título')}
                          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer print:hidden"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Copy Title' : 'Copiar Título'}</span>
                        </button>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-black text-white flex items-center justify-between">
                        <span>{createGeneratedData.optimizedTitle}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {isEn
                          ? 'Combines official brand name with local keyword and area, guaranteeing maximum indexing with zero suspension penalty risk.'
                          : 'Combina el nombre oficial de la marca con la palabra clave local y la zona, garantizando máxima indexación sin riesgo de penalización por Google.'}
                      </p>
                    </div>

                    {/* 3. Descripción Comercial SEO (745 caracteres) */}
                    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5 print-card-box">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                            {isEn ? 'Key Step 3: High-Impact Description' : 'Paso Clave 3: Descripción de Alto Impacto'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {createGeneratedData.commercialDescription.length} / 750 {isEn ? 'Characters' : 'Caracteres'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(createGeneratedData.commercialDescription, 'Descripción')}
                          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer print:hidden"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Copy Description' : 'Copiar Descripción'}</span>
                        </button>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {createGeneratedData.commercialDescription}
                      </div>
                    </div>

                    {/* 4. Catálogo de Servicios / Productos Estrella */}
                    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 print-card-box">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 bg-purple-950 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                          {isEn ? 'Key Step 4: Structured Product / Service Catalog' : 'Paso Clave 4: Catálogo Estructurado de Servicios / Productos'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {isEn ? 'Upload to the "Products" tab in Google' : 'Cargar en la pestaña "Productos" de Google'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        {createGeneratedData.serviceCatalog.map((svc, i) => (
                          <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-white text-xs">{svc.name}</span>
                              <span className="text-[9px] font-bold text-indigo-400 bg-indigo-950 px-1.5 py-0.5 rounded">
                                {svc.tag}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-snug">{svc.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 5. Checklist Fotográfico & Geo-Naming */}
                    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 print-card-box">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-amber-400" />
                        <h3 className="text-sm font-black text-white">
                          {isEn ? '5. Photo Checklist to Request from Client' : '5. Checklist de Fotos para Pedir al Cliente'}
                        </h3>
                      </div>
                      <div className="space-y-2 text-xs">
                        {createGeneratedData.photoChecklist.map((ph, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                          >
                            <div className="space-y-0.5">
                              <span className="font-bold text-white text-xs">
                                📷 {ph.item} ({ph.count} {ph.count === 1 ? (isEn ? 'photo' : 'foto') : (isEn ? 'photos' : 'fotos')})
                              </span>
                              <p className="text-[11px] text-slate-400">{ph.tip}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[10px] text-slate-500 block">
                                {isEn ? 'Suggested SEO filename:' : 'Nombre sugerido para SEO:'}
                              </span>
                              <code className="text-[10px] text-amber-300 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                {ph.filenameExample}
                              </code>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 6. Preguntas Frecuentes Preventivas (Google Q&A) */}
                    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 print-card-box">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-indigo-400" />
                        <h3 className="text-sm font-black text-white">
                          {isEn ? '6. Official Q&A Seeding' : '6. Preguntas y Respuestas Oficiales (Q&A Seeding)'}
                        </h3>
                      </div>
                      <div className="space-y-2 text-xs">
                        {createGeneratedData.preventiveFaqs.map((faq, i) => (
                          <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                            <span className="font-bold text-amber-300 block text-xs">{isEn ? 'Q' : 'P'}: {faq.question}</span>
                            <p className="text-slate-300 text-[11px] leading-relaxed">{isEn ? 'A' : 'R'}: {faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 7. Guía de Verificación por Video de Google (El paso más crítico) */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border-2 border-indigo-500/40 space-y-3 print-card-box">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Video className="w-5 h-5 text-indigo-400" />
                          <h3 className="text-sm font-black text-white">{createGeneratedData.verificationGuide.title}</h3>
                        </div>
                        <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                          {isEn ? 'Uncut 60s video' : 'Video de 60s sin cortes'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {createGeneratedData.verificationGuide.overview}
                      </p>
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                          <strong className="text-amber-400 block mb-0.5">{isEn ? 'Take 1 (Exterior):' : 'Toma 1 (Exterior):'}</strong>
                          <span className="text-slate-300 text-[11px]">{createGeneratedData.verificationGuide.cameraTake1}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                          <strong className="text-indigo-300 block mb-0.5">{isEn ? 'Take 2 (Access / Street):' : 'Toma 2 (Acceso):'}</strong>
                          <span className="text-slate-300 text-[11px]">{createGeneratedData.verificationGuide.cameraTake2}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                          <strong className="text-emerald-400 block mb-0.5">{isEn ? 'Take 3 (Interior & Billing Tools):' : 'Toma 3 (Interior y Facturación):'}</strong>
                          <span className="text-slate-300 text-[11px]">{createGeneratedData.verificationGuide.cameraTake3}</span>
                        </div>
                      </div>
                    </div>

                    {/* 8. Mensaje de WhatsApp Listo para Enviar al Cliente */}
                    <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-2.5 print-card-box">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-emerald-400" />
                          <h3 className="text-sm font-black text-white">{isEn ? 'WhatsApp Media Request Kit (Photos & Video)' : 'Kit para Pedir Fotos y Video por WhatsApp'}</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(createGeneratedData.whatsappOnboardingMessage, isEn ? 'WhatsApp Message' : 'Mensaje de WhatsApp')
                          }
                          className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black transition flex items-center gap-1.5 cursor-pointer print:hidden"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Copy Message' : 'Copiar Mensaje'}</span>
                        </button>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                        {createGeneratedData.whatsappOnboardingMessage}
                      </div>
                    </div>

                    {/* 9. Plan de Velocidad de Reseñas para Top 3 (Review Velocity) */}
                    {createGeneratedData.reviewVelocityPlan && (
                      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 print-card-box">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <h3 className="text-sm font-black text-white">
                              {lang === 'en'
                                ? '9. Google Review Velocity Plan to Reach Top 3'
                                : '9. Plan de Aceleración de Reseñas para Alcanzar el Top 3'}
                            </h3>
                          </div>
                          <span className="text-[10px] font-black uppercase text-emerald-300 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                            {isEn ? 'Top 3 Algorithm' : 'Algoritmo Top 3'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                              {lang === 'en' ? 'Current Reviews' : 'Reseñas Actuales'}
                            </span>
                            <strong className="text-base font-black text-white">
                              {createGeneratedData.reviewVelocityPlan.currentReviews === 0
                                ? (isEn ? '0 ★ (New Listing)' : '0 ★ (Ficha Nueva)')
                                : `${createGeneratedData.reviewVelocityPlan.currentReviews} ★`}
                            </strong>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                              {lang === 'en' ? 'Top 3 Competitor Benchmark' : 'Meta del Top 3'}
                            </span>
                            <strong className="text-base font-black text-amber-400">
                              {createGeneratedData.reviewVelocityPlan.targetTop3Reviews}+
                            </strong>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                              {lang === 'en' ? 'Pace per Week' : 'Ritmo Recomendado'}
                            </span>
                            <strong className="text-base font-black text-emerald-400">
                              +{createGeneratedData.reviewVelocityPlan.reviewsPerWeek} {isEn ? '/ wk' : '/ sem'}
                            </strong>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                              {lang === 'en' ? 'Time to Top 3' : 'Tiempo al Top 3'}
                            </span>
                            <strong className="text-base font-black text-purple-300">
                              {createGeneratedData.reviewVelocityPlan.weeksToTop3} {isEn ? 'weeks' : 'semanas'}
                            </strong>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {lang === 'en'
                            ? 'Google values review velocity and fresh sentiment more than total static review count. Capturing 8 fresh reviews weekly pushes listings above older inactive competitors.'
                            : 'El algoritmo de Google premia la frescura y velocidad semanal por encima de números estáticos antiguos. Mantener 8 reseñas nuevas por semana supera a competidores con años de antigüedad en menos de 90 días.'}
                        </p>
                      </div>
                    )}

                    {/* 10. Booster de 30 Días de Publicaciones de Google (Google Posts) */}
                    {createGeneratedData.monthlyPostsBooster && createGeneratedData.monthlyPostsBooster.length > 0 && (
                      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 print-card-box">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <h3 className="text-sm font-black text-white">
                              {lang === 'en'
                                ? '10. 30-Day Google Business Post Calendar (Weekly Boosters)'
                                : '10. Calendario de Publicaciones de 30 Días (Google Posts)'}
                            </h3>
                          </div>
                          <span className="text-[10px] font-black uppercase text-purple-300 bg-purple-950 px-2.5 py-0.5 rounded-full border border-purple-500/40">
                            {isEn ? '4 Ready Weeks' : '4 Semanas Listas'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {createGeneratedData.monthlyPostsBooster.map((post, i) => (
                            <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                                    {isEn ? 'Week' : 'Semana'} {post.week} • {post.type}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(`${post.title}\n\n${post.body}`, `${isEn ? 'Week Post' : 'Post Semana'} ${post.week}`)}
                                    className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer print:hidden"
                                  >
                                    <Copy className="w-3 h-3" />
                                    <span>{isEn ? 'Copy' : 'Copiar'}</span>
                                  </button>
                                </div>
                                <h4 className="font-black text-white text-xs">{post.title}</h4>
                                <p className="text-[11px] text-slate-300 leading-snug">{post.body}</p>
                              </div>
                              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                                <span>{isEn ? 'CTA Button:' : 'Botón CTA:'}</span>
                                <span className="font-bold text-emerald-400">{post.callToAction}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 11. Checklist Interactivo de Implementación (Progreso de 0% a 100%) */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-4 print-card-box">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                              {isEn ? 'Implementation Roadmap' : 'Hoja de Ruta de Implementación'}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {completedChecklistCount} / {checklistItems.length} {isEn ? 'Completed' : 'Completados'}
                            </span>
                          </div>
                          <h3 className="text-sm font-black text-white mt-1">
                            {isEn ? '11. Step-by-Step Google Maps Optimization Checklist' : '11. Checklist Interactivo de Implementación en Google'}
                          </h3>
                        </div>

                        {/* Percentage Badge */}
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <span
                            className={`text-xs font-black px-3 py-1 rounded-xl border ${
                              checklistProgressPercent === 100
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                                : checklistProgressPercent >= 60
                                ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {checklistProgressPercent}% {isEn ? 'Done' : 'Listo'}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="w-full bg-slate-950 rounded-full h-2.5 p-0.5 border border-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              checklistProgressPercent === 100
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                : checklistProgressPercent >= 60
                                ? 'bg-gradient-to-r from-amber-500 to-emerald-500'
                                : 'bg-gradient-to-r from-rose-500 to-amber-500'
                            }`}
                            style={{ width: `${checklistProgressPercent}%` }}
                          />
                        </div>
                        {checklistProgressPercent === 100 && (
                          <p className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 animate-in fade-in duration-300">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>
                              {isEn
                                ? '🎉 Listing 100% optimized to conquer Google Maps Top 3!'
                                : '🎉 ¡Ficha 100% optimizada para dominar el Top 3 de Google Maps!'}
                            </span>
                          </p>
                        )}
                      </div>

                      {/* Checklist Items */}
                      <div className="space-y-2 text-xs">
                        {checklistItems.map((item) => {
                          const isDone = !!checkedSteps[item.id];
                          const isHero = item.isHero;
                          return (
                            <div
                              key={item.id}
                              onClick={() => toggleChecklistStep(item.id)}
                              className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                                isHero
                                  ? isDone
                                    ? 'bg-indigo-950/40 border-indigo-500/50 text-white'
                                    : 'bg-gradient-to-r from-amber-950/20 via-slate-950 to-indigo-950/30 border-amber-500/40 hover:border-amber-400/70 text-slate-200'
                                  : isDone
                                  ? 'bg-slate-950/60 border-emerald-500/30 text-slate-300'
                                  : 'bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-200'
                              }`}
                            >
                              <button
                                type="button"
                                className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition cursor-pointer ${
                                  isDone
                                    ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                                    : isHero
                                    ? 'border-amber-400/60 bg-amber-950/30 text-transparent'
                                    : 'border-slate-700 bg-slate-900 text-transparent hover:border-slate-500'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </button>

                              <div className="space-y-0.5 flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span
                                    className={`font-bold text-xs ${
                                      isDone
                                        ? 'line-through text-slate-400'
                                        : isHero
                                        ? 'text-amber-300 font-black'
                                        : 'text-white'
                                    }`}
                                  >
                                    {item.title}
                                  </span>
                                  {isHero && (
                                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30 shrink-0">
                                      Prestigia Core
                                    </span>
                                  )}
                                </div>
                                <p className={`text-[11px] leading-snug ${isDone ? 'text-slate-500' : 'text-slate-400'}`}>
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Advisor Sign-off Box */}
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs print:border-t print:border-slate-300">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          {isEn ? 'Dossier Prepared by:' : 'Expediente Generado por:'}
                        </span>
                        <span className="font-black text-white text-sm">
                          {currentUser?.name || (isEn ? 'Prestigia LatAm & USA' : 'Prestigia LatAm')}
                        </span>
                        <span className="text-slate-400 text-xs block">
                          {isEn ? 'Advisory Line:' : 'Línea de Asesoría:'} {currentUser?.phone || '+57 305 831 4049'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 uppercase font-bold block">
                          {isEn ? 'Prestigia Top 3 Guarantee' : 'Garantía Prestigia Top 3'}
                        </span>
                        <span className="text-xs text-slate-400">
                          {isEn ? 'Certified 2026 Local SEO Architecture' : 'Arquitectura SEO Certificada 2026'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* =========================================================
                INTEGRATED: GUÍA PASO A PASO DÓNDE DAR CLIC (CREACIÓN)
                ========================================================= */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl print:hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                    {isEn ? 'Technical Walkthrough • Case 1: Built From Scratch' : 'Paso a Paso Técnico • Caso 1: Creación Desde Cero'}
                  </span>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-emerald-400" />
                    <span>{isEn ? 'Where to Click on Google to Create a New Listing' : 'Guía Paso a Paso: Dónde dar Clic en Google para Crear la Ficha'}</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isEn
                      ? 'Follow these 6 steps in Google Business to publish and verify the new profile without technical errors.'
                      : 'Sigue estos 6 pasos exactos en Google Business para registrar y verificar el nuevo perfil sin fallas técnicas.'}
                  </p>
                </div>
                <a
                  href="https://business.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer shrink-0"
                >
                  <span>{isEn ? 'Open Google Business' : 'Abrir Google Business'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* 6 Step Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">1</span>
                    <strong className="text-white text-xs">{isEn ? 'Open & Sign In' : 'Abrir e Iniciar Sesión'}</strong>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {isEn ? <>Go to <strong>business.google.com</strong>. Sign in with the official business Gmail account (or yours temporarily to transfer later).</> : <>Entra a <strong>business.google.com</strong>. Inicia sesión con el correo Gmail oficial del negocio (o el tuyo temporalmente para luego transferirlo).</>}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">2</span>
                    <strong className="text-white text-xs">{isEn ? 'Name & Official Category' : 'Nombre & Categoría Oficial'}</strong>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {isEn ? <>Paste the <strong>Optimized Title</strong> generated above. In "Business Category", enter the <strong>Primary Category</strong> and select it from Google\'s official menu.</> : <>Pega el <strong>Título Optimizado</strong> generado arriba. En "Categoría empresarial", escribe la <strong>Categoría Principal</strong> y elígela del menú oficial de Google.</>}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">3</span>
                    <strong className="text-white text-xs">{isEn ? 'Physical Storefront vs SAB Service Area' : 'Local Físico vs Domicilio (SAB)'}</strong>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {isEn ? <>• <strong>Storefront:</strong> Select "Yes, location open to the public" and pin the entrance.<br/>• <strong>Service Area / Remote:</strong> Select "No, I deliver services to customers" to hide residential addresses and prevent suspensions.</> : <>• <strong>Local comercial:</strong> Marca "Sí tienes local abierto al público" y fija el pin en la puerta.<br/>• <strong>A domicilio / independiente:</strong> Marca "No, presto servicios en la ubicación del cliente" para ocultar la dirección de casa y evitar suspensiones.</>}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">4</span>
                    <strong className="text-white text-xs">{isEn ? 'Phone & Official Website' : 'Teléfono & Sitio Web Oficial'}</strong>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {isEn ? <>Enter the customer service line or WhatsApp. Under website, add the official domain or the Prestigia-generated landing page URL.</> : <>Ingresa la línea de WhatsApp o PBX de atención al cliente. En sitio web, coloca la web del negocio o el link de su landing page generada en Prestigia.</>}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">5</span>
                    <strong className="text-white text-xs">{isEn ? '60s Video Verification' : 'Video de Verificación de 60s'}</strong>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {isEn ? <>Record one continuous take on mobile:<br/><strong>0-15s:</strong> Street & exterior signage • <strong>15-40s:</strong> Unlocking door & interior • <strong>40-60s:</strong> POS terminal & tax certificate / business license.</> : <>Graba continuo sin cortes con el móvil:<br/><strong>0-15s:</strong> Calle y aviso exterior • <strong>15-40s:</strong> Abrir puerta con llave física e interior • <strong>40-60s:</strong> Datáfono en caja y RUT / documento fiscal.</>}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">6</span>
                    <strong className="text-white text-xs">{isEn ? 'Initial Catalog Upload' : 'Carga del Catálogo Inicial'}</strong>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {isEn ? <>Once verification is submitted, go to "Edit Services" and upload the 6 services and 15 photos generated in this blueprint to trigger the algorithm.</> : <>Una vez enviada la verificación, ve a "Editar servicios" y carga los 6 servicios y 15 fotografías generadas en este expediente para activar el algoritmo.</>}
                  </p>
                </div>
              </div>

              {/* Anti-Suspension Rules */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 text-xs text-slate-300 space-y-2">
                <span className="font-bold text-rose-400 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  {isEn ? 'Immediate Anti-Suspension Traffic Light (Critical Google 2026 Guidelines)' : 'Semáforo Anti-Suspensión Inmediata (Reglas Críticas de Google 2026)'}
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  <p className="text-rose-300/90 bg-rose-950/40 p-2.5 rounded-xl border border-rose-500/20">
                    🔴 <strong>{isEn ? 'Forbidden to edit name or category within the first 14 days:' : 'Prohibido editar nombre o categoría en los primeros 14 días:'}</strong> {isEn ? 'Any edits to core data during the review period triggers an automatic suspension for suspected spam.' : 'Cualquier cambio en datos sensibles durante el periodo de revisión activa una suspensión automática por sospecha de spam.'}
                  </p>
                  <p className="text-emerald-300/90 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/20">
                    🟢 <strong>{isEn ? 'Safe accelerator:' : 'Acelerador seguro:'}</strong> {isEn ? 'Uploading photos directly from a mobile device on the business Wi-Fi or GPS coordinates validates physical authenticity to Google AI.' : 'Cargar fotos desde el móvil en la misma red Wi-Fi o coordenadas GPS del local valida la autenticidad física de la empresa ante Google AI.'}
                  </p>
                </div>
              </div>
            </div>

            {/* =========================================================
                INTEGRATED: GUIÓN COMERCIAL DE CIERRE (CREACIÓN)
                ========================================================= */}
            <div className="bg-slate-950 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl print:hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                    {isEn ? 'Sales Playbook • Case 1: New Listing Closing Pitch' : 'Guión Comercial & Cierre • Caso 1: Venta de Creación de Ficha'}
                  </span>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-400" />
                    <span>{isEn ? 'High-Conversion Sales Script: Creating from Scratch' : 'Guión Comercial Especializado para Negocios sin Ficha en Google'}</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isEn
                      ? 'Tactical pitch and objection handling to close listing setup fees or convert directly into monthly Prestigia plans.'
                      : 'Speech táctico y manejo de objeciones para cobrar el setup técnico o cerrar la membresía mensual de Prestigia con setup bonificado.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const script = `Hola ${createBusinessName || 'Emprendedor'}, le saluda el equipo de Prestigia. Estuvimos analizando las búsquedas comerciales de ${createCategory || 'su sector'} en ${createCity || 'su ciudad'} y notamos una situación crítica: su negocio sencillamente NO existe en Google Maps. Hoy en día, el 70% de las personas que van a comprar o contratar un servicio eligen entre los 3 primeros perfiles que aparecen en el mapa. Cada día que pasa sin ficha, son decenas de clientes que terminan comprándole a su competencia más cercana. En Prestigia no solo creamos y verificamos su ficha oficial ante Google sin riesgo de suspensión, sino que le instalamos la arquitectura para posicionarlo en el Top 3 y le activamos nuestro software inteligente de reseñas para capturar 5 estrellas en su negocio. Al activar hoy su Plan Prestigia a la medida para su negocio, le bonificamos el 100% del setup técnico ($0 costo de creación) y le entregamos la ficha lista para facturar. ¿Agendamos la grabación del video de 60 segundos hoy mismo?`;
                    copyToClipboard(script, 'Guión de Venta de Creación');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0 active:scale-98"
                >
                  <Copy className="w-4 h-4" />
                  <span>{isEn ? 'Copy Creation Pitch' : 'Copiar Guión de Creación'}</span>
                </button>
              </div>

              {/* Pitch Display Card */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 text-xs text-slate-200 leading-relaxed italic space-y-2">
                <span className="font-bold text-emerald-300 not-italic block text-xs">
                  {isEn ? '🎙️ Outreach & Opening Pitch (Call, On-Site or WhatsApp):' : '🎙️ Speech de Prospección & Apertura (Llamada, Visita o WhatsApp):'}
                </span>
                <p>
                  {isEn ? (
                    <>"Hello <strong>{createBusinessName || 'Business Owner'}</strong>, this is the Prestigia team. We were analyzing customer searches for <strong>{createCategory || 'your industry'}</strong> in <strong>{createCity || 'your area'}</strong> and noticed a critical gap: your business simply <strong>DOES NOT exist on Google Maps</strong>. Today, 70% of local buyers choose directly from the top 3 map profiles. Every single day without a verified listing represents dozens of paying clients handed to your closest rivals. At Prestigia, we build and verify your official Google profile with Top 3 architecture, and activate our digital 5-star review acceleration platform from week one."</>
                  ) : (
                    <>"Hola <strong>{createBusinessName || 'Emprendedor'}</strong>, le saluda el equipo de Prestigia. Estuvimos analizando las búsquedas comerciales de <strong>{createCategory || 'su sector'}</strong> en <strong>{createCity || 'su ciudad'}</strong> y notamos una situación crítica: su negocio sencillamente <strong>NO existe en Google Maps</strong>. Hoy en día, el 70% de las personas que van a comprar eligen entre los 3 primeros perfiles del mapa. Cada día sin ficha son decenas de ventas que le regala a su competencia. Nosotros creamos y verificamos su perfil oficial ante Google con arquitectura Top 3, y le activamos el sistema digital Prestigia para disparar sus reseñas 5★ desde la primera semana."</>
                  )}
                </p>
              </div>

              {/* Objections & Closing Offer Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <strong className="text-amber-300 block text-xs">
                    {isEn ? '⚠️ Objection: "Why pay you if creating a Google listing is free?"' : '⚠️ Objeción: "¿Por qué pagarles si crear una ficha en Google es gratis?"'}
                  </strong>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    <strong>{isEn ? 'Advisor Answer:' : 'Respuesta Asesor:'}</strong> {isEn ? '"Google is free, but 80% of unassisted listings get immediately suspended on video verification or buried on page 4 without receiving a single call. With Prestigia, you don\'t pay for the listing—you invest in the technical architecture that prevents suspensions, locks winning keywords, and propels you into the Top 3 to generate real revenue from month one."' : '"Google es gratis, pero el 80% de los negocios son suspendidos en el video de verificación o quedan sepultados en la página 4 sin recibir una sola llamada. Con Prestigia no paga por la ficha, paga por la arquitectura técnica que evita suspensiones, optimiza categorías y posiciona en el Top 3 para que la ficha facture clientes reales desde el primer mes."'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <strong className="text-amber-300 block text-xs">
                    {isEn ? '⚠️ Objection: "I don\'t have time to deal with photos and paperwork."' : '⚠️ Objeción: "No tengo tiempo para ocuparme de fotos ni trámites."'}
                  </strong>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    <strong>{isEn ? 'Advisor Answer:' : 'Respuesta Asesor:'}</strong> {isEn ? '"That is the beauty of our turnkey service: we only need a 60-second walkthrough video recorded together on-site, and our team manages 100% of the SEO copywriting, documentation, and official Google verification."' : '"Esa es la ventaja de nuestro servicio llave en mano: solo necesitamos 60 segundos de video que grabamos juntos desde su local y nosotros nos encargamos del 100% de la radicación, redacción SEO y verificación con Google."'}
                  </p>
                </div>
              </div>

              {/* Closing Hook Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-black text-emerald-300 uppercase tracking-wide block text-xs">
                    {isEn ? '🎁 The Prestigia Closing Hook ($0 Setup Waiver):' : '🎁 El Gancho de Cierre Prestigia ($0 Setup):'}
                  </span>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    {isEn ? <>"When you subscribe today to your tailored <strong>Prestigia Plan</strong> for your business, we waive 100% of the technical setup fee (<strong>$0 implementation cost</strong>) and include full activation of your 5★ review software and digital shield."</> : <>"Al contratar hoy tu <strong>Plan Prestigia a la medida</strong> para tu negocio, te bonificamos el 100% del setup técnico de creación (<strong>$0 costo de implementación</strong>) e incluimos la activación total de tu software de reseñas 5★ y blindaje reputacional."</>}
                  </p>
                </div>
                <span className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-xs">
                  {isEn ? 'Tailored Plan' : (isEn ? 'Tailored Plan' : 'Plan a la Medida')}
                </span>
              </div>

              {/* Bottom Quick Action: Crear Otra Nueva Ficha */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 pb-2 print:hidden">
                <button
                  type="button"
                  onClick={handleResetCreateForm}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition flex items-center gap-2 shadow-xl shadow-emerald-500/25 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4 text-slate-950" />
                  <span>{isEn ? 'Create Another Profile' : 'Crear Otra Nueva Ficha'}</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* =============================================================
            TAB 2: AUDITAR FICHA EXISTENTE & UPGRADE AL TOP 3 (1-CLIC GOOGLE API)
            ============================================================= */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden print:hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300">
                    {t.mod2Badge}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    {t.mod2Title}
                  </h1>
                  <p className="text-xs text-slate-300 max-w-2xl">
                    {t.mod2Desc}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
                  {/* Credit Counter Badge */}
                  {isLuismaMaster ? (
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                      <div className="text-left">
                        <span className="text-[9px] uppercase font-black tracking-wider text-amber-400/80 block">{isEn ? 'Monthly AI Credits' : 'Créditos IA Mensuales'}</span>
                        <strong className="text-xs font-black text-amber-200">{isEn ? '👑 UNLIMITED • Master' : '👑 ILIMITADO • Master'}</strong>
                      </div>
                    </div>
                  ) : (
                    <div className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl border transition ${
                      monthlyUsage.audits >= (currentUser?.maxAuditsMonthly ?? (currentUser?.accountType === 'partner_agency' ? 60 : currentUser?.accountType === 'director' ? 100 : 30))
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    }`}>
                      <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                      <div className="text-left">
                        <span className="text-[9px] uppercase font-black tracking-wider opacity-80 block">{isEn ? 'Audit Quota' : 'Cupo de Auditorías'}</span>
                        <div className="text-xs font-black flex items-center gap-1">
                          <span>{monthlyUsage.audits} / {currentUser?.maxAuditsMonthly ?? (currentUser?.accountType === 'partner_agency' ? 60 : currentUser?.accountType === 'director' ? 100 : 30)} Usadas</span>
                          <span className="text-[10px] font-bold opacity-75">
                            ({Math.max(0, (currentUser?.maxAuditsMonthly ?? (currentUser?.accountType === 'partner_agency' ? 60 : currentUser?.accountType === 'director' ? 100 : 30)) - monthlyUsage.audits)} disp.)
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block font-mono">{t.mod2Target}</span>
                    <span className="text-lg font-black text-amber-400">{t.mod2TargetVal}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetAuditForm}
                    className="px-3.5 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer shrink-0 active:scale-95"
                    title={isEn ? 'Clear form to run a new audit' : 'Realizar una nueva auditoría desde cero'}
                  >
                    <Plus className="w-4 h-4 text-slate-950" />
                    <span>{isEn ? 'New Audit' : 'Nueva Auditoría'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Input & Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: 1-Click Google Maps Scanner */}
              <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl print:hidden">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <Search className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-black text-white">{t.auditFormHeader}</h2>
                </div>

                {/* Tarjeta de Datos del Cliente / Contratante (Quién Solicita y Paga el Servicio) */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-900 border border-indigo-500/30 space-y-2.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-indigo-500/20">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-xs font-black text-indigo-300">
                        {isEn ? '👤 Client / Contractor Info (Who Hires & Pays)' : '👤 Datos del Cliente / Contratante (Quién Solicita y Paga el Servicio)'}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/40">
                      CRM
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">
                        {isEn ? 'Contact Person / Owner *' : 'Persona de Contacto / Dueño *'}
                      </label>
                      <input
                        type="text"
                        value={auditContactName}
                        onChange={(e) => setAuditContactName(e.target.value)}
                        placeholder={isEn ? 'e.g. John Doe' : 'Ej: Carlos Gómez'}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">
                        {isEn ? 'Contracting Company / Legal Entity *' : 'Empresa / Razón Social Contratante *'}
                      </label>
                      <input
                        type="text"
                        value={auditContactCompany}
                        onChange={(e) => setAuditContactCompany(e.target.value)}
                        placeholder={isEn ? 'e.g. Acme Corp / Individual' : 'Ej: Inversiones Gómez SAS / Particular'}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1 flex items-center justify-between">
                        <span>{isEn ? 'Direct WhatsApp *' : 'WhatsApp Directo *'}</span>
                        {auditContactPhone && (
                          <a
                            href={`https://wa.me/${auditContactPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] text-emerald-400 hover:text-emerald-300 font-bold"
                          >
                            Chat
                          </a>
                        )}
                      </label>
                      <input
                        type="tel"
                        value={auditContactPhone}
                        onChange={(e) => setAuditContactPhone(e.target.value)}
                        placeholder="+57 300 123 4567"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">
                        {isEn ? 'Email *' : 'Correo Electrónico *'}
                      </label>
                      <input
                        type="email"
                        value={auditContactEmail}
                        onChange={(e) => setAuditContactEmail(e.target.value)}
                        placeholder={isEn ? 'contact@company.com' : 'contacto@empresa.com'}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">
                        {isEn ? 'Role *' : 'Cargo / Relación *'}
                      </label>
                      <select
                        value={auditContactRole}
                        onChange={(e) => setAuditContactRole(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-400 text-xs"
                      >
                        <option value="Dueño / Propietario">{isEn ? '👑 Owner' : '👑 Dueño / Propietario'}</option>
                        <option value="Gerente General">{isEn ? '💼 General Manager' : '💼 Gerente General'}</option>
                        <option value="Director de Marketing">{isEn ? '📈 Marketing Dir.' : '📈 Dir. Marketing'}</option>
                        <option value="Administrador">{isEn ? '🏢 Branch Admin' : '🏢 Administrador'}</option>
                        <option value="Encargado">{isEn ? '🔑 Shift Manager' : '🔑 Encargado'}</option>
                        <option value="Particular">{isEn ? '👤 Private Client' : '👤 Particular'}</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Single Google Maps Input Box */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t.auditInputLabel}</span>
                      </span>
                      {auditQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setAuditQuery('');
                            setAuditScannedListing(null);
                          }}
                          className="text-[10px] text-slate-400 hover:text-rose-400 transition cursor-pointer"
                        >
                          {isEn ? 'Clear' : 'Limpiar'}
                        </button>
                      )}
                    </label>

                    <div className="relative">
                      <input
                        type="text"
                        value={auditQuery}
                        onChange={(e) => setAuditQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !isScanningAudit && !isGeneratingAudit && auditQuery.trim()) {
                            e.preventDefault();
                            handleScanAndAudit();
                          }
                        }}
                        placeholder={t.auditInputPlaceholder}
                        className="w-full pl-3.5 pr-20 py-3 rounded-xl bg-slate-950 border border-amber-500/40 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-xs transition font-medium"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText();
                            if (text) setAuditQuery(text.trim());
                          } catch {
                            // clipboard read not permitted by browser
                          }
                        }}
                        title={isEn ? 'Paste from clipboard' : 'Pegar del portapapeles'}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-amber-400 transition cursor-pointer"
                      >
                        {t.pasteBtn}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                      {isEn
                        ? '💡 Supports short links (maps.app.goo.gl/...), full Google Maps URLs, or "Business Name + City".'
                        : '💡 Soporta enlaces cortos (maps.app.goo.gl/...), enlaces web largos o "Nombre Comercial + Ciudad".'}
                    </p>
                  </div>
                </div>

                {/* Scanned Listing Profile Card (If recognized) */}
                {auditScannedListing && (
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/40 space-y-2.5 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{t.verifiedListingBadge}</span>
                      </span>
                      {auditScannedListing.googleMapsUrl && (
                        <a
                          href={auditScannedListing.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                        >
                          <span>Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-white leading-tight">
                        {auditScannedListing.name}
                      </h4>
                      {auditScannedListing.address && (
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="truncate">{auditScannedListing.address}</span>
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Rating</span>
                        <span className="text-xs font-black text-amber-400">★ {auditScannedListing.rating}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">{isEn ? 'Reviews' : 'Reseñas'}</span>
                        <span className="text-xs font-black text-white">{auditScannedListing.reviewsCount}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">{isEn ? 'Niche' : 'Nicho'}</span>
                        <span className="text-[10px] font-black text-teal-300 truncate block">
                          {auditScannedListing.category || 'General'}
                        </span>
                      </div>
                    </div>

                    {(auditScannedListing.phone || auditScannedListing.website) && (
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                        {auditScannedListing.phone && (
                          <span className="flex items-center gap-1 text-slate-300 truncate">
                            <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>{auditScannedListing.phone}</span>
                          </span>
                        )}
                        {auditScannedListing.website && (
                          <span className="flex items-center gap-1 text-slate-300 truncate">
                            <Globe className="w-3 h-3 text-indigo-400 shrink-0" />
                            <span>{auditScannedListing.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Primary 1-Click Scan & Audit Button */}
                <div className="space-y-2">
                  {!isLuismaMaster && monthlyUsage.audits >= (currentUser?.maxAuditsMonthly ?? (currentUser?.accountType === 'partner_agency' ? 60 : currentUser?.accountType === 'director' ? 100 : 30)) && (
                    <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{isEn ? `Monthly limit of ${currentUser?.maxAuditsMonthly ?? 30} audits reached. Contact Management.` : `Tope mensual de ${currentUser?.maxAuditsMonthly ?? 30} auditorías alcanzado. Contacta a Dirección General.`}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleScanAndAudit}
                    disabled={isScanningAudit || isGeneratingAudit || !auditQuery.trim() || (!isLuismaMaster && monthlyUsage.audits >= (currentUser?.maxAuditsMonthly ?? (currentUser?.accountType === 'partner_agency' ? 60 : currentUser?.accountType === 'director' ? 100 : 30)))}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer active:scale-98"
                  >
                    {isScanningAudit || isGeneratingAudit ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{t.btnScanningAndAuditing}</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-slate-950" />
                        <span>{t.btnScanAndAudit}</span>
                      </>
                    )}
                  </button>

                  {/* Botón rápido Nueva Auditoría cuando ya hay una generada */}
                  {auditGeneratedData?.healthScore && (
                    <button
                      type="button"
                      onClick={handleResetAuditForm}
                      className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border-2 border-amber-500/50 hover:border-amber-400 text-amber-300 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98"
                    >
                      <Plus className="w-4 h-4 text-amber-400" />
                      <span>{isEn ? 'Run Another Audit' : 'Nueva Auditoría'}</span>
                    </button>
                  )}
                </div>

                {/* Optional Collapsible Manual Tweaks Accordion */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowManualAuditFields(!showManualAuditFields)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-[11px] font-bold text-slate-400 hover:text-white transition flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>⚙️</span>
                      <span>{showManualAuditFields ? t.adjustManuallyHide : t.adjustManuallyLabel}</span>
                    </span>
                    {showManualAuditFields ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>

                  {showManualAuditFields && (
                    <div className="mt-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs animate-in fade-in duration-200">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">{t.auditBizName}</label>
                        <input
                          type="text"
                          value={auditBusinessName}
                          onChange={(e) => setAuditBusinessName(e.target.value)}
                          placeholder={t.auditBizNamePlaceholder}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">{t.googleUrl}</label>
                        <input
                          type="text"
                          value={auditGoogleUrl}
                          onChange={(e) => setAuditGoogleUrl(e.target.value)}
                          placeholder={t.googleUrlPlaceholder}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">{t.currentRating}</label>
                          <input
                            type="number"
                            step="0.1"
                            min="1"
                            max="5"
                            value={auditExistingRating}
                            onChange={(e) => setAuditExistingRating(Number(e.target.value))}
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400 transition font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">{t.publicReviews}</label>
                          <input
                            type="number"
                            min="0"
                            value={auditExistingReviews}
                            onChange={(e) => setAuditExistingReviews(Number(e.target.value))}
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400 transition font-bold"
                          />
                        </div>
                      </div>

                      {/* Localización Enlazada en Cascada: País -> Ciudad -> Barrio */}
                      <div className="space-y-2.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-amber-400" />
                            <span>{isEn ? 'Linked Geographic Location (Americas & Europe)' : 'Ubicación Geográfica Enlazada (América y Europa)'}</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {/* 1º Selector de País con botón + */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs font-bold text-slate-300">
                                {isEn ? '1st Country *' : '1º País *'}
                              </label>
                              <button
                                type="button"
                                onClick={() => setShowAddCountryModal(true)}
                                className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-0.5 font-bold transition cursor-pointer"
                                title={isEn ? 'Add another Country to catalog' : 'Agregar otro País al catálogo'}
                              >
                                <Plus className="w-3 h-3" />
                                <span>{isEn ? 'Add Country' : 'Agregar País'}</span>
                              </button>
                            </div>
                            <select
                              value={auditCountry}
                              onChange={(e) => handleSelectAuditCountry(e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400 transition text-xs cursor-pointer"
                            >
                              {allCountriesList.map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* 2º Selector de Ciudad condicionado con botón + */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs font-bold text-slate-300">
                                2º Ciudad ({auditCountry}) *
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                              setTargetCountryForNewCity(auditCountry);
                              setShowAddCityModal(true);
                            }}
                            className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-0.5 font-bold transition cursor-pointer"
                                title={`Agregar otra Ciudad a ${auditCountry}`}
                              >
                                <Plus className="w-3 h-3" />
                                <span>Agregar Ciudad</span>
                              </button>
                            </div>
                            <select
                              value={auditCity}
                              onChange={(e) => setAuditCity(e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400 transition text-xs cursor-pointer"
                            >
                              {getCitiesForCountry(auditCountry).map((cty) => (
                                <option key={cty} value={cty}>
                                  {cty}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* 3º Barrio / Localidad */}
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            3º Barrio o Localidad *
                          </label>
                          <input
                            type="text"
                            value={auditNeighborhood}
                            onChange={(e) => setAuditNeighborhood(e.target.value)}
                            placeholder={t.auditNeighborhoodPlaceholder}
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400 transition text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">{t.sector}</label>
                        <select
                          value={auditCategory}
                          onChange={(e) => setAuditCategory(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400 transition"
                        >
                          {categoryOptions.map((c: string) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleGenerateAudit()}
                        disabled={isGeneratingAudit || !auditBusinessName.trim()}
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>{t.btnAudit}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Commercial Strategy: Setup Fee & 100% Annual Plan Waiver */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-orange-500/10 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-amber-400" />
                      <span className="text-[10px] font-black uppercase text-amber-400">
                        {isEn ? 'Advisor Monetization Strategy' : 'Estrategia Comercial de Cierre'}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-amber-950 text-amber-300 border border-amber-500/40">
                      $150 - $250 USD
                    </span>
                  </div>
                  <div>
                    <strong className="text-white text-xs block mb-1">
                      {isEn ? 'Audit & Upgrade Setup Waiver' : 'Setup Fee de Auditoría 100% Bonificado'}
                    </strong>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {isEn
                        ? 'Waive 100% of the forensic overhaul fee ($0 implementation cost) as an irresistible hook when the client acquires their tailored Prestigia plan.'
                        : 'Bonifica el 100% del setup técnico de auditoría y reingeniería ($0 costo de implementación) como gancho de cierre al adquirir su Plan Prestigia a la medida (Software de Reseñas 5★ + Blindaje Digital).'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const scriptText = isEn
                        ? `Hello ${auditBusinessName || 'Business Owner'}, after performing our forensic audit on your Google Maps listing, we identified critical gaps keeping you outside the Top 3. When you activate our tailored Prestigia plan for your business (Digital 5★ Review Accelerator + Reputation Shield), we WAIVE 100% of the deep optimization setup fee ($0 USD). Shall we lock in this waiver and elevate your listing this week?`
                        : `Hola estimado/a ${auditBusinessName || 'propietario'}, tras auditar su negocio en Google Maps detectamos fallas críticas que le hacen perder clientes frente a la competencia. Al adquirir su Plan Prestigia a la medida (Software de Reseñas 5★ + Blindaje Digital), le BONIFICAMOS el 100% de la optimización técnica ($0 USD). ¿Le gustaría aprovechar esta bonificación y activar su plan a la medida?`;
                      copyToClipboard(scriptText, isEn ? 'Audit Proposal' : 'Propuesta de Auditoría');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Copy Tailored Plan Closing Script (WhatsApp)' : 'Copiar Propuesta Comercial de Cierre (WhatsApp)'}</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Audit Diagnostic Output */}
              <div className="lg:col-span-7 space-y-4">
                {/* State 1: Scanning & Auditing with Gemini */}
                {(isScanningAudit || isGeneratingAudit) && (
                  <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-amber-500/30 text-center space-y-4 animate-pulse">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                      <RefreshCw className="w-7 h-7 animate-spin text-amber-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-white">
                        {t.consultingAuditAi}
                      </h3>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        {t.consultingAuditDesc}
                      </p>
                    </div>
                    <div className="flex justify-center gap-2 pt-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                    </div>
                  </div>
                )}

                {/* State 2: Ready to Audit (Empty State) */}
                {!auditGeneratedData?.healthScore && !isScanningAudit && !isGeneratingAudit && (
                  <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                      <Search className="w-7 h-7 text-amber-400" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-white">
                        {t.readyAuditTitle}
                      </h3>
                      <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                        {t.readyAuditDesc}
                      </p>
                    </div>
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60">
                        ⚡ {isEn ? 'Live Recognition' : 'Reconocimiento en Vivo'}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60">
                        ★ {isEn ? 'Live Rating & Reviews' : 'Calificación Real & Reseñas'}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60">
                        🎯 {isEn ? 'Top 3 Gap Analysis' : 'Brechas frente al Top 3'}
                      </span>
                    </div>
                  </div>
                )}

                {/* State 3: Generated Forensic Audit Results */}
                {auditGeneratedData?.healthScore && !isScanningAudit && !isGeneratingAudit && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    {/* Score Bar & Action Header */}
                    <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl print-card-box">
                      {/* Top Row: Section Label + Action Buttons */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                          <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                            {t.healthScore}
                          </span>
                        </div>

                        {/* Action Buttons Group */}
                        <div className="flex flex-wrap items-center gap-2 print:hidden">
                          {/* Botón: Nueva Auditoría */}
                          <button
                            type="button"
                            onClick={handleResetAuditForm}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer active:scale-95"
                            title={isEn ? 'Clear form to run another audit' : 'Realizar otra nueva auditoría desde cero'}
                          >
                            <Plus className="w-3.5 h-3.5 text-slate-950" />
                            <span>{isEn ? 'New Audit' : 'Nueva Auditoría'}</span>
                          </button>
                          {/* White-Label Logo Uploader */}
                          <div className="flex items-center gap-1">
                            <label
                              title={isEn ? 'Upload client/agency logo for white-label PDF' : 'Subir logo del cliente o agencia para PDF marca blanca'}
                              className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700/80 shadow-sm"
                            >
                              <Upload className="w-3.5 h-3.5 text-amber-400" />
                              <span>{customLogoUrl ? (isEn ? 'Logo ✓' : 'Logo ✓') : (isEn ? 'Add Logo' : 'Logo Marca Blanca')}</span>
                              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                            </label>
                            {customLogoUrl && (
                              <button
                                type="button"
                                onClick={handleRemoveLogo}
                                title={isEn ? 'Remove custom logo' : 'Quitar logo personalizado'}
                                className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={handleSaveAuditDossier}
                            className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700/80 shadow-sm"
                          >
                            <Save className="w-3.5 h-3.5 text-amber-400" />
                            <span>{t.save}</span>
                          </button>

                          <button
                            type="button"
                            onClick={handlePrint}
                            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20 active:scale-98"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>{t.printPdf}</span>
                          </button>
                        </div>
                      </div>

                      {/* Score Value & Status Badge Row */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-3.5">
                          <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                            <span className="text-4xl sm:text-5xl font-black text-amber-400 tracking-tight leading-none">
                              {auditGeneratedData.healthScore}
                            </span>
                            <span className="text-base sm:text-lg font-bold text-slate-400">
                              / 100
                            </span>
                          </div>

                          <span
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl border whitespace-nowrap inline-flex items-center gap-1.5 shadow-sm ${
                              auditGeneratedData.healthScore < 60
                                ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                                : auditGeneratedData.healthScore < 80
                                ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                            }`}
                          >
                            {auditGeneratedData.healthScore < 60 ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            )}
                            <span>{t.vulnerableBadge}</span>
                          </span>
                        </div>

                        <div className="text-left md:text-right">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">
                            {isEn ? 'Diagnostic Status' : 'Diagnóstico Algorítmico'}
                          </span>
                          <span className="text-xs font-bold text-rose-400">
                            {isEn ? 'Penalized by missing local SEO factors' : 'Penalizado por factores SEO omitidos'}
                          </span>
                        </div>
                      </div>

                      {/* Visual Health Score Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="w-full bg-slate-950 rounded-full h-2 p-0.5 border border-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              auditGeneratedData.healthScore < 60
                                ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                                : auditGeneratedData.healthScore < 80
                                ? 'bg-gradient-to-r from-amber-500 to-teal-400'
                                : 'bg-gradient-to-r from-teal-400 to-emerald-400'
                            }`}
                            style={{ width: `${Math.min(Math.max(auditGeneratedData.healthScore, 5), 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Critical Gaps Detected */}
                    <div className="p-5 rounded-2xl bg-slate-900 border border-rose-500/40 space-y-3 print-card-box">
                      <div className="flex items-center gap-2 text-rose-400">
                        <AlertTriangle className="w-4 h-4" />
                        <h3 className="text-sm font-black text-white">{t.criticalGapsTitle}</h3>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        {auditGeneratedData.criticalGaps?.map((gap, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/20 text-rose-200 flex items-center gap-2">
                            <span className="font-bold text-rose-400">❌</span>
                            <span>{gap}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Competitor Insights */}
                    <div className="p-5 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-2 print-card-box">
                      <div className="flex items-center gap-2 text-indigo-400">
                        <TrendingUp className="w-4 h-4" />
                        <h3 className="text-sm font-black text-white">{t.competitorBenchmarkTitle} {auditCity}</h3>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {auditGeneratedData.topCompetitorInsights}
                      </p>
                    </div>

                    {/* Action Roadmap */}
                    <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-3 print-card-box">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <h3 className="text-sm font-black text-white">{t.roadmapTitle}</h3>
                      </div>
                      <div className="space-y-2 text-xs">
                        {auditGeneratedData.actionRoadmap?.map((item, i) => (
                          <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white text-xs">{t.stepLabel} {item.step}: {item.title}</span>
                              <span
                                className={`text-[9px] font-black px-2 py-0.5 rounded ${
                                  item.impact === 'CRÍTICO'
                                    ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                                    : item.impact === 'ALTO'
                                    ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                                    : 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                                }`}
                              >
                                {item.impact}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300">{item.action}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Copyable Optimized Assets */}
                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 print-card-box">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-white">{t.optimizedCopyTitle}</h3>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(auditGeneratedData.commercialDescription, 'Descripción')}
                          className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer print:hidden"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{t.copyNewDesc}</span>
                        </button>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {auditGeneratedData.commercialDescription}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* =========================================================
                INTEGRATED: GUÍA PASO A PASO DÓNDE DAR CLIC (AUDITORÍA TOP 3)
                ========================================================= */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl print:hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300">
                    {isEn ? 'Technical Walkthrough • Case 2: Top 3 Listing Upgrade' : 'Paso a Paso Técnico • Caso 2: Auditoría Forense & Optimización Top 3'}
                  </span>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-400" />
                    <span>{isEn ? 'Where to Click on Google to Optimize an Existing Listing' : 'Guía Paso a Paso: Dónde dar Clic en Google para Optimizar la Ficha'}</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isEn
                      ? 'Step-by-step instructions in Google Business Profile to inject the optimized blueprint and scale rankings.'
                      : 'Instrucciones paso a paso dentro del panel de Google Business para inyectar las mejoras del Blueprint y escalar al podio.'}
                  </p>
                </div>
                <a
                  href="https://business.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer shrink-0"
                >
                  <span>{isEn ? 'Open Google Business' : 'Abrir Google Business'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* 6 Steps Grid for Audit / Optimization */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">1</span>
                    <strong className="text-white text-xs">{isEn ? 'Access "Edit Profile"' : 'Acceder a "Editar Perfil"'}</strong>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {isEn ? <>Go to <strong>business.google.com</strong> or search your business name on Google. Click the circular <strong>"Edit profile"</strong> button.</> : <>Entra a <strong>business.google.com</strong> o busca el nombre de tu negocio en Google. Haz clic en el botón circular <strong>"Editar perfil"</strong>.</>}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">2</span>
                    <strong className="text-white text-xs">{isEn ? 'Set Penalization-Free Title' : 'Ajustar Título Despenalizado'}</strong>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {isEn ? <>In "Business information", replace spammy all-caps titles with the suggested <strong>Optimized Title</strong>, preventing visibility penalties.</> : <>En "Información de la empresa", reemplaza títulos con mayúsculas spam por el <strong>Título Optimizado</strong> sugerido, evitando penalizaciones de visibilidad.</>}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">3</span>
                    <strong className="text-white text-xs">{isEn ? 'Inject Secondary Categories' : 'Inyectar Categorías Secundarias'}</strong>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {isEn ? <>Click "Business category" → <strong>"+ Add another category"</strong>. Add the 3-5 subcategories from the Blueprint to increase impressions by +35%.</> : <>Haz clic en "Categoría de la empresa" → <strong>"+ Agregar otra categoría"</strong>. Añade las 3-5 subcategorías del Blueprint para aumentar un +35% de impresiones.</>}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">4</span>
                    <strong className="text-white text-xs">{isEn ? 'Upload Menu / Service Catalog' : 'Cargar Menú / Catálogo de Servicios'}</strong>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {isEn ? <>In the Google main menu, click <strong>"Edit services"</strong> or "Edit menu". Upload key offerings with persuasive copy and transparent pricing.</> : <>En el menú principal de Google, haz clic en <strong>"Editar servicios"</strong> o "Editar menú". Sube los platos o servicios clave con descripciones persuasivas y precios reales.</>}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">5</span>
                    <strong className="text-white text-xs">{isEn ? 'Upload Geo-Named Photos' : 'Subir Fotografías Geonombradas'}</strong>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {isEn ? <>Click <strong>"Add photo"</strong>. Upload high-res photos with local SEO filenames (e.g., <em>dental-clinic-brickell-miami.jpg</em>) for Exterior and Interior.</> : <>Haz clic en <strong>"Agregar foto"</strong>. Sube fotos de alta resolución con nombres SEO locales (ej: <em>clinica-dental-sonrisas-medellin.jpg</em>) en Fachada e Interior.</>}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">6</span>
                    <strong className="text-white text-xs">{isEn ? 'Seed Official Q&A' : 'Sembrar Preguntas Oficiales (Q&A)'}</strong>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {isEn ? <>From the public Google Maps profile, go to "Questions & answers", post the preventive FAQs (parking, bookings, pricing) and answer them immediately as the owner.</> : <>Desde Google Maps en el perfil público, ve a "Preguntas y respuestas", formula las preguntas preventivas (parqueadero, reservas, precios) y respóndelas de inmediato como propietario.</>}
                  </p>
                </div>
              </div>
            </div>

            {/* =========================================================
                INTEGRATED: GUIÓN COMERCIAL DE CIERRE (AUDITORÍA TOP 3)
                ========================================================= */}
            <div className="bg-slate-950 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl print:hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300">
                    {isEn ? 'Sales Playbook • Case 2: Top 3 Audit Closing Pitch' : 'Guión Comercial & Cierre • Caso 2: Venta de Auditoría & Optimización Top 3'}
                  </span>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-amber-400" />
                    <span>{isEn ? 'High-Impact Audit Closing Script & Objection Matrix' : 'Speech Demoledor de Auditoría: Fuga de Clientes vs Beneficio Prestigia'}</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isEn
                      ? 'Expose algorithmic gaps and present the dual-balance ROI to close the $200-$350 USD setup or activate monthly recurring plans.'
                      : 'Evidencia las fallas algorítmicas frente al competidor líder y usa la balanza ROI para cerrar el setup de $250 USD o la suscripción Prestigia.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const script = `Hola ${auditBusinessName || 'propietario'}, le saluda el equipo de Prestigia. Auditamos minuciosamente su perfil de Google Maps en ${auditCity || 'su ciudad'} y descubrimos la razón exacta por la cual no está apareciendo en los primeros 3 lugares: su ficha tiene 3 fugas algorítmicas críticas (carece de categorías secundarias de búsqueda transaccional, su catálogo de servicios no tiene precios y su flujo de opiniones está estancado). Nuestros cálculos muestran que está perdiendo aproximadamente entre $1,000 y $3,000 USD mensuales en clientes que se van con sus competidores del Top 3. En Prestigia reestructuramos el 100% de su perfil y le activamos nuestro software inteligente de reseñas para inyectar 5 estrellas semanales y superar a sus rivales. Al activar hoy su Plan Prestigia a la medida para su negocio, nosotros absorbemos el 100% del setup técnico de optimización ($0 costo de implementación bonificado). ¿Le gustaría ver la comparativa directa frente a su competidor más fuerte?`;
                    copyToClipboard(script, 'Guión de Venta de Auditoría');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer shrink-0 active:scale-98"
                >
                  <Copy className="w-4 h-4" />
                  <span>{isEn ? 'Copy Audit Pitch' : 'Copiar Guión de Auditoría'}</span>
                </button>
              </div>

              {/* Pitch Display Card */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 text-xs text-slate-200 leading-relaxed italic space-y-2">
                <span className="font-bold text-amber-300 not-italic block text-xs">
                  {isEn ? '🎙️ Forensic Audit Closing Pitch:' : '🎙️ Speech de Cierre de Auditoría Forense:'}
                </span>
                <p>
                  {isEn ? (
                    <>"Hello <strong>{auditBusinessName || 'Business Owner'}</strong>, this is the Prestigia team. We audited your Google profile in <strong>{auditCity || 'your area'}</strong> and pinpointed exactly why you aren\'t ranking in the Top 3: your listing suffers from <strong>3 critical algorithmic flaws</strong> leaking clients daily. Your podium competitors capture 68% of all searches due to secondary category indexing and fresh weekly reviews. We structured the exact 5-step blueprint to dethrone them."</>
                  ) : (
                    <>"Hola <strong>{auditBusinessName || 'propietario'}</strong>, le saluda el equipo de Prestigia. Auditamos su ficha en <strong>{auditCity || 'su zona'}</strong> y detectamos por qué no está en el Top 3: su perfil tiene <strong>3 fallas algorítmicas graves</strong> que le están costando clientes todos los días. Sus competidores líderes tienen flujo activo semanal y catálogo completo, mientras que su ficha pierde el 68% de las búsquedas por falta de categorías secundarias. Hemos estructurado el plan técnico para desbancar a los líderes y activar la plataforma digital de reseñas de Prestigia."</>
                  )}
                </p>
              </div>

              {/* Objections & Closing Offer Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <strong className="text-amber-300 block text-xs">
                    {isEn ? '⚠️ Objection: "I already have more reviews than my rival, why optimize?"' : '⚠️ Objeción: "Yo ya tengo más reseñas que mi competidor, ¿para qué optimizar?"'}
                  </strong>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    <strong>{isEn ? 'Advisor Answer:' : 'Respuesta Asesor:'}</strong> {isEn ? '"That is the costliest misconception: in 2026, Google\'s algorithm rewards fresh review velocity and recent sentiment over static numbers from last year. If your rival gains 10 reviews this month and you gain 1, Google drops you below them. Prestigia keeps your 5★ velocity continuously active."' : '"Ese es el error más costoso: en 2026, el algoritmo de Google premia la velocidad y frescura reciente, no el volumen estancado de hace un año. Si su competidor suma 10 reseñas este mes y usted 1, Google lo enviará a la segunda página. Prestigia mantiene su flujo semanal activo de 5★ permanentemente."'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <strong className="text-amber-300 block text-xs">
                    {isEn ? '⚠️ Objection: "Do you guarantee rank #1 exactly?"' : '⚠️ Objeción: "¿Me garantizan estar en el puesto #1 exacto?"'}
                  </strong>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    <strong>{isEn ? 'Advisor Answer:' : 'Respuesta Asesor:'}</strong> {isEn ? '"No agency owns Google. What we do guarantee is the exact mathematical SEO compliance and digital review acceleration engine to shatter competitor moats and capture the Local 3-Pack where 70% of buyer calls happen."' : '"Google no le pertenece a ninguna agencia en el mundo. Lo que sí garantizamos es la arquitectura SEO exacta que exige Google y la tecnología de captura digital de reseñas para quebrar la ventaja de sus rivales y adueñarse de los 3 lugares que se llevan el 70% de las ventas."'}
                  </p>
                </div>
              </div>

              {/* Closing Hook Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-900 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-black text-amber-300 uppercase tracking-wide block text-xs">
                    {isEn ? '🎁 The Prestigia Closing Hook ($0 Setup Waiver):' : '🎁 El Gancho de Cierre Prestigia ($0 Setup):'}
                  </span>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    {isEn ? <>"When you subscribe today to your tailored <strong>Prestigia Plan</strong>, the entire technical reengineering setup is <strong>100% WAIVED ($0 implementation cost)</strong>, including instant access to our 5★ review software and reputation shield."</> : <>"Al contratar hoy tu <strong>Plan Prestigia a la medida</strong> para tu negocio, el setup técnico de reingeniería y optimización te queda en <strong>$0 (100% bonificado)</strong> e incluye la activación completa del software de aceleración 5★ y blindaje reputacional."</>}
                  </p>
                </div>
                <span className="shrink-0 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-xs">
                  {isEn ? 'Tailored Plan' : (isEn ? 'Tailored Plan' : 'Plan a la Medida')}
                </span>
              </div>
              {/* Bottom Quick Action: Nueva Auditoría */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 pb-2 print:hidden">
                <button
                  type="button"
                  onClick={handleResetAuditForm}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm transition flex items-center gap-2 shadow-xl shadow-amber-500/25 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4 text-slate-950" />
                  <span>{isEn ? 'Run Another Audit' : 'Nueva Auditoría'}</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* =============================================================
            TAB 3: RESCATE DE FICHA SECUESTRADA / HUÉRFANA (CLAIM & OWNERSHIP ENGINE)
            ============================================================= */}
        {activeTab === 'rescue' && (
          <div className="space-y-6">
            {/* Header intro */}
            <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/20 border border-rose-500/40 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden print:hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-950 border border-rose-500/40 text-rose-300">
                    {isEn ? '🛡️ Module 3 • Listing Ownership Recovery & Claim' : '🛡️ Módulo 3 • Rescate & Reclamación de Titularidad Google Maps'}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6 text-rose-400" />
                    <span>{tTools.rescueTitle}</span>
                  </h1>
                  <p className="text-xs text-slate-300 max-w-2xl">
                    {tTools.rescueDesc}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
                  {/* Credit Counter Badge */}
                  {isLuismaMaster ? (
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                      <div className="text-left">
                        <span className="text-[9px] uppercase font-black tracking-wider text-amber-400/80 block">{isEn ? 'Monthly AI Credits' : 'Créditos IA Mensuales'}</span>
                        <strong className="text-xs font-black text-amber-200">{isEn ? '👑 UNLIMITED • Master' : '👑 ILIMITADO • Master'}</strong>
                      </div>
                    </div>
                  ) : (
                    <div className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl border transition ${
                      monthlyUsage.rescues >= (currentUser?.maxRescuesMonthly ?? (currentUser?.accountType === 'partner_agency' ? 20 : currentUser?.accountType === 'director' ? 50 : 10))
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    }`}>
                      <Zap className="w-4 h-4 text-rose-400 shrink-0" />
                      <div className="text-left">
                        <span className="text-[9px] uppercase font-black tracking-wider opacity-80 block">{isEn ? 'Rescue Quota' : 'Cupo de Rescates'}</span>
                        <div className="text-xs font-black flex items-center gap-1">
                          <span>{monthlyUsage.rescues} / {currentUser?.maxRescuesMonthly ?? (currentUser?.accountType === 'partner_agency' ? 20 : currentUser?.accountType === 'director' ? 50 : 10)} Usadas</span>
                          <span className="text-[10px] font-bold opacity-75">
                            ({Math.max(0, (currentUser?.maxRescuesMonthly ?? (currentUser?.accountType === 'partner_agency' ? 20 : currentUser?.accountType === 'director' ? 50 : 10)) - monthlyUsage.rescues)} disp.)
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block font-mono">{isEn ? 'Official Timeline' : 'Tiempo de Trámite'}</span>
                    <span className="text-lg font-black text-amber-400">{isEn ? '72-Hour Protocol' : 'Regla de 72 Horas'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetRescueForm}
                    className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-md shadow-rose-500/20 cursor-pointer shrink-0 active:scale-95"
                    title={isEn ? 'Clear form to run a new rescue' : 'Realizar un nuevo rescate desde cero'}
                  >
                    <Plus className="w-4 h-4 text-slate-950" />
                    <span>{isEn ? 'New Rescue' : 'Nuevo Rescate'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Rescue Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Diagnostics & Parameters (5 cols) */}
              <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl print:hidden">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <KeyRound className="w-4 h-4 text-rose-400" />
                  <h2 className="text-sm font-black text-white">{isEn ? '1. Listing Recognition & Diagnosis' : '1. Reconocimiento de Ficha & Diagnóstico'}</h2>
                </div>

                {/* Tarjeta de Datos del Cliente / Contratante (Antes de Reconocer la Ficha) */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-900 border border-indigo-500/30 space-y-2.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-indigo-500/20">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-xs font-black text-indigo-300">
                        {isEn ? '👤 Client / Contractor Info (Who Hires & Pays)' : '👤 Datos del Cliente / Contratante (Quién Solicita y Paga el Servicio)'}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/40">
                      CRM
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">
                        {isEn ? 'Contact Person / Owner *' : 'Persona de Contacto / Dueño *'}
                      </label>
                      <input
                        type="text"
                        value={rescueContactName}
                        onChange={(e) => setRescueContactName(e.target.value)}
                        placeholder={isEn ? 'e.g. John Doe' : 'Ej: Carlos Gómez'}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">
                        {isEn ? 'Contracting Company / Legal Entity *' : 'Empresa / Razón Social Contratante *'}
                      </label>
                      <input
                        type="text"
                        value={rescueContactCompany}
                        onChange={(e) => setRescueContactCompany(e.target.value)}
                        placeholder={isEn ? 'e.g. Acme Corp / Individual' : 'Ej: Inversiones Gómez SAS / Particular'}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1 flex items-center justify-between">
                        <span>{isEn ? 'Direct WhatsApp *' : 'WhatsApp Directo *'}</span>
                        {rescueContactPhone && (
                          <a
                            href={`https://wa.me/${rescueContactPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] text-emerald-400 hover:text-emerald-300 font-bold"
                          >
                            Chat
                          </a>
                        )}
                      </label>
                      <input
                        type="tel"
                        value={rescueContactPhone}
                        onChange={(e) => setRescueContactPhone(e.target.value)}
                        placeholder="+57 300 123 4567"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">
                        {isEn ? 'Email *' : 'Correo Electrónico *'}
                      </label>
                      <input
                        type="email"
                        value={rescueContactEmail}
                        onChange={(e) => setRescueContactEmail(e.target.value)}
                        placeholder={isEn ? 'contact@company.com' : 'contacto@empresa.com'}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">
                        {isEn ? 'Role *' : 'Cargo / Relación *'}
                      </label>
                      <select
                        value={rescueContactRole}
                        onChange={(e) => setRescueContactRole(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-400 text-xs"
                      >
                        <option value="Dueño / Propietario">{isEn ? '👑 Owner' : '👑 Dueño / Propietario'}</option>
                        <option value="Gerente General">{isEn ? '💼 General Manager' : '💼 Gerente General'}</option>
                        <option value="Director de Marketing">{isEn ? '📈 Marketing Dir.' : '📈 Dir. Marketing'}</option>
                        <option value="Administrador">{isEn ? '🏢 Branch Admin' : '🏢 Administrador'}</option>
                        <option value="Encargado">{isEn ? '🔑 Shift Manager' : '🔑 Encargado'}</option>
                        <option value="Particular">{isEn ? '👤 Private Client' : '👤 Particular'}</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 1-Click Google Maps Scanner for Rescue */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-2.5">
                  <label className="block text-xs font-bold text-rose-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-rose-400" />
                      <span>{tTools.rescueSearchLabel}</span>
                    </span>
                    {rescueSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setRescueSearchQuery('')}
                        className="text-[10px] text-slate-400 hover:text-rose-400 transition cursor-pointer"
                      >
                        {isEn ? 'Clear' : 'Limpiar'}
                      </button>
                    )}
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      value={rescueSearchQuery}
                      onChange={(e) => setRescueSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isRescueScanning && rescueSearchQuery.trim()) {
                          e.preventDefault();
                          handleRescueScan();
                        }
                      }}
                      placeholder={tTools.rescueSearchPlaceholder}
                      className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 text-xs transition font-medium"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const text = await navigator.clipboard.readText();
                          if (text) setRescueSearchQuery(text.trim());
                        } catch {}
                      }}
                      title={isEn ? 'Paste from clipboard' : 'Pegar del portapapeles'}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-rose-400 transition cursor-pointer"
                    >
                      {t.pasteBtn}
                    </button>
                  </div>

                  {!isLuismaMaster && monthlyUsage.rescues >= (currentUser?.maxRescuesMonthly ?? (currentUser?.accountType === 'partner_agency' ? 20 : currentUser?.accountType === 'director' ? 50 : 10)) && (
                    <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{isEn ? `Monthly limit of ${currentUser?.maxRescuesMonthly ?? 10} rescues reached. Contact Management.` : `Tope mensual de ${currentUser?.maxRescuesMonthly ?? 10} rescates alcanzado. Contacta a Dirección General.`}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRescueScan()}
                    disabled={isRescueScanning || !rescueSearchQuery.trim() || (!isLuismaMaster && monthlyUsage.rescues >= (currentUser?.maxRescuesMonthly ?? (currentUser?.accountType === 'partner_agency' ? 20 : currentUser?.accountType === 'director' ? 50 : 10)))}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:opacity-50 text-white font-black text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-98"
                  >
                    {isRescueScanning ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{tTools.rescueBtnScanning}</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 fill-white" />
                        <span>{tTools.rescueBtnScan}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Session profile detected sync pill */}
                {!rescueScannedListing && rescueBusinessName && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs animate-in fade-in">
                    <div className="truncate mr-2">
                      <span className="text-[10px] text-amber-400 block font-bold">{tTools.rescueSyncBanner}</span>
                      <span className="text-white font-bold text-xs truncate block">{rescueBusinessName} {rescueCity ? `(${rescueCity})` : ''}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const target = rescueBusinessName + (rescueCity ? ' ' + rescueCity : '');
                        setRescueSearchQuery(target);
                        handleRescueScan(target);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] shrink-0 transition cursor-pointer"
                    >
                      {tTools.rescueSyncBtn}
                    </button>
                  </div>
                )}

                {/* Verified Listing Card (Recognized from Google) */}
                {rescueScannedListing && (
                  <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-emerald-500/40 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{tTools.rescueDetectedBadge}</span>
                      </span>
                      {rescueScannedListing.googleMapsUrl && (
                        <a
                          href={rescueScannedListing.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                        >
                          <span>Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div>
                      <h4 className="font-black text-white text-xs">{rescueScannedListing.name}</h4>
                      {rescueScannedListing.address && (
                        <p className="text-[10px] text-slate-400 truncate">{rescueScannedListing.address}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-300 font-mono">
                      <span className="text-amber-400 font-bold">★ {rescueScannedListing.rating?.toFixed(1) || '0.0'}</span>
                      <span>·</span>
                      <span>{rescueScannedListing.reviewsCount || 0} {isEn ? 'reviews' : 'reseñas'}</span>
                      {rescueScannedListing.phone && (
                        <>
                          <span>·</span>
                          <span className="text-slate-400">{rescueScannedListing.phone}</span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">{isEn ? 'Business Name on Google Maps *' : 'Nombre de la Ficha en Google Maps *'}</label>
                    <input
                      type="text"
                      value={rescueBusinessName}
                      onChange={(e) => setRescueBusinessName(e.target.value)}
                      placeholder={isEn ? 'e.g. Apex Dental Center' : 'Ej: Clínica Dental Sanitas'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-400 transition"
                    />
                  </div>

                  {/* Localización Enlazada en Cascada: País -> Ciudad -> Barrio */}
                  <div className="space-y-2.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-rose-400" />
                        <span>{isEn ? 'Linked Geographic Location (Americas & Europe)' : 'Ubicación Geográfica Enlazada (América y Europa)'}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* 1º Selector de País con botón + */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-300">
                            {isEn ? '1st Country *' : '1º País *'}
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowAddCountryModal(true)}
                            className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-0.5 font-bold transition cursor-pointer"
                            title={isEn ? 'Add another Country to catalog' : 'Agregar otro País al catálogo'}
                          >
                            <Plus className="w-3 h-3" />
                            <span>{isEn ? 'Add Country' : 'Agregar País'}</span>
                          </button>
                        </div>
                        <select
                          value={rescueCountry}
                          onChange={(e) => handleSelectRescueCountry(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-rose-400 transition text-sm cursor-pointer"
                        >
                          {allCountriesList.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 2º Selector de Ciudad condicionado con botón + */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-300">
                            {isEn ? `2nd City (${rescueCountry}) *` : `2º Ciudad (${rescueCountry}) *`}
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setTargetCountryForNewCity(rescueCountry);
                              setShowAddCityModal(true);
                            }}
                            className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-0.5 font-bold transition cursor-pointer"
                            title={isEn ? `Add another City to ${rescueCountry}` : `Agregar otra Ciudad a ${rescueCountry}`}
                          >
                            <Plus className="w-3 h-3" />
                            <span>{isEn ? 'Add City' : 'Agregar Ciudad'}</span>
                          </button>
                        </div>
                        <select
                          value={rescueCity}
                          onChange={(e) => setRescueCity(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-rose-400 transition text-sm cursor-pointer"
                        >
                          {getCitiesForCountry(rescueCountry).map((cty) => (
                            <option key={cty} value={cty}>
                              {cty}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* 3º Barrio / Localidad */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        3º Barrio o Localidad *
                      </label>
                      <input
                        type="text"
                        value={rescueNeighborhood}
                        onChange={(e) => setRescueNeighborhood(e.target.value)}
                        placeholder="Ej: Chapinero, Poblado, Polanco, Brickell, Centro..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-400 transition text-sm"
                      />
                    </div>
                  </div>

                  {rescueScenario === 'third_party' && (
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">
                        {isEn ? 'Masked Owner Email Displayed on Google' : 'Correo Enmascarado que Muestra Google'}
                      </label>
                      <input
                        type="text"
                        value={rescueMaskedEmail}
                        onChange={(e) => setRescueMaskedEmail(e.target.value)}
                        placeholder={isEn ? 'e.g. Masked email shown by Google' : 'Ej: Correo que muestre Google al solicitar acceso'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 transition"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {isEn ? 'Shown when attempting to claim: "Managed by ..."' : 'Aparece al intentar reclamar: "Esta empresa está gestionada por..."'}
                      </span>
                    </div>
                  )}

                  {/* Scenario Selector */}
                  <div className="pt-2">
                    <label className="block font-bold text-slate-300 mb-2">{tTools.rescueScenarioLabel}</label>
                    <div className="space-y-2">
                      {/* Case 1: Orphan */}
                      <button
                        type="button"
                        onClick={() => setRescueScenario('orphan')}
                        className={`w-full p-3.5 rounded-2xl text-left border transition cursor-pointer flex flex-col space-y-1 ${
                          rescueScenario === 'orphan'
                            ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg ring-1 ring-amber-500/30'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between pb-0.5">
                          <span className="text-[10px] font-black uppercase text-amber-400">{isEn ? 'Case 1' : 'Caso 1'}</span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40">
                            {isEn ? 'Unclaimed / Orphan' : 'Sin Dueño Reclamado'}
                          </span>
                        </div>
                        <strong className="text-white text-xs block leading-snug">{tTools.scenario1Title}</strong>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{tTools.scenario1Subtitle}</p>
                      </button>

                      {/* Case 2: Third Party */}
                      <button
                        type="button"
                        onClick={() => setRescueScenario('third_party')}
                        className={`w-full p-3.5 rounded-2xl text-left border transition cursor-pointer flex flex-col space-y-1 ${
                          rescueScenario === 'third_party'
                            ? 'bg-indigo-500/10 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-500/30'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between pb-0.5">
                          <span className="text-[10px] font-black uppercase text-indigo-400">{isEn ? 'Case 2' : 'Caso 2'}</span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/40">
                            {isEn ? '72-Hour Rule' : 'Regla de 72h'}
                          </span>
                        </div>
                        <strong className="text-white text-xs block leading-snug">{tTools.scenario2Title}</strong>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {rescueMaskedEmail.trim()
                            ? (isEn
                                ? `Managed by "${rescueMaskedEmail.trim()}". Activates Google 72-Hour Legal Transfer Protocol.`
                                : `Gestionada por "${rescueMaskedEmail.trim()}". Activación del Protocolo Oficial de 72 Horas de Google.`)
                            : tTools.scenario2Subtitle}
                        </p>
                      </button>

                      {/* Case 3: Rejected */}
                      <button
                        type="button"
                        onClick={() => setRescueScenario('rejected')}
                        className={`w-full p-3.5 rounded-2xl text-left border transition cursor-pointer flex flex-col space-y-1 ${
                          rescueScenario === 'rejected'
                            ? 'bg-rose-500/10 border-rose-500 text-white shadow-lg ring-1 ring-rose-500/30'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between pb-0.5">
                          <span className="text-[10px] font-black uppercase text-rose-400">{isEn ? 'Case 3' : 'Caso 3'}</span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40">
                            {isEn ? 'Legal Appeal' : 'Apelación Legal'}
                          </span>
                        </div>
                        <strong className="text-white text-xs block leading-snug">{tTools.scenario3Title}</strong>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{tTools.scenario3Subtitle}</p>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Commercial Strategy: Setup Fee & 100% Annual Plan Waiver */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-slate-900 to-teal-500/10 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span className="text-[10px] font-black uppercase text-emerald-400">
                        {isEn ? 'Advisor Monetization Strategy' : 'Estrategia Comercial de Cierre'}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      $150 - $250 USD
                    </span>
                  </div>
                  <div>
                    <strong className="text-white text-xs block mb-1">
                      {isEn ? 'Rescue Management Waiver Closing Hook' : 'Gestión Legal de Rescate 100% Bonificada'}
                    </strong>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {isEn
                        ? 'Waive 100% of the legal ownership recovery fee ($0 cost) as an irresistible hook when the client acquires their tailored Prestigia plan (Digital QR & WhatsApp Flow + 5★ Review Accelerator).'
                        : 'Bonifica el 100% de los honorarios técnicos y legales de rescate ($0 costo) como gancho de cierre al adquirir su Plan Prestigia a la medida de su negocio (Software de Reseñas 5★ + Blindaje Digital).'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const scriptText = isEn
                        ? `Hello ${rescueBusinessName || 'Business Owner'}, to reclaim and transfer your Google Maps profile to your direct account, our legal ownership recovery fee is 100% WAIVED ($0 cost) when you activate your tailored Prestigia plan (Digital 5★ Review Accelerator + Reputation Shield). You get your listing back and your reputation secured. Shall we start the protocol today?`
                        : `Hola estimado/a ${rescueBusinessName || 'propietario'}, para recuperar la titularidad legal de su ficha en Google Maps y transferir el control total a su cuenta oficial mediante el protocolo de Google, le BONIFICAMOS el 100% de los costos de gestión técnica y legal de rescate ($0 USD) al adquirir su Plan Prestigia a la medida de su negocio (Software de Reseñas 5★ + Blindaje Digital). Recupera su ficha y blindamos su reputación. ¿Iniciamos el protocolo hoy?`;
                      copyToClipboard(scriptText, isEn ? 'Rescue Proposal' : 'Propuesta de Rescate');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Copy Tailored Plan Closing Script (WhatsApp)' : 'Copiar Propuesta Comercial de Cierre (WhatsApp)'}</span>
                  </button>
                </div>

                {/* Botón rápido Nuevo Rescate cuando ya hay datos */}
                {(rescueScannedListing || rescueBusinessName || rescueSearchQuery) && (
                  <button
                    type="button"
                    onClick={handleResetRescueForm}
                    className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border-2 border-rose-500/50 hover:border-rose-400 text-rose-300 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98"
                  >
                    <Plus className="w-4 h-4 text-rose-400" />
                    <span>{isEn ? 'Run Another Rescue' : 'Nuevo Rescate'}</span>
                  </button>
                )}
              </div>

              {/* Right Column: Interactive Protocol & Evidentiary Dossier (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Protocol Roadmap Card */}
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 text-xs shadow-xl">
                  {rescueScenario === 'orphan' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          <Unlock className="w-4 h-4 text-amber-400" />
                          <span>{isEn ? 'Action Plan for Unclaimed Orphan Listing' : 'Plan de Acción Inmediato para Ficha Huérfana'}</span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                          {isEn ? '⚡ 5-Minute Resolution' : '⚡ Resolución Inmediata'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="font-black text-amber-400 block text-xs">{isEn ? 'Step 1: Open Official Link' : 'Paso 1: Abrir Enlace Oficial'}</span>
                          <p className="text-[11px] text-slate-300">
                            {isEn
                              ? 'Search the business on Google Maps and click "Own this business?" or enter Google Business Profile.'
                              : 'Buscar el negocio en Google Maps y dar clic en "¿Eres el propietario?" o entrar a Google Business Profile.'}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="font-black text-amber-400 block text-xs">{isEn ? 'Step 2: Choose Verification' : 'Paso 2: Elegir Verificación'}</span>
                          <p className="text-[11px] text-slate-300">
                            {isEn
                              ? 'Select verification by automated call or SMS directly to the business phone line.'
                              : 'Seleccionar la verificación por llamada automatizada o SMS al teléfono del establecimiento.'}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="font-black text-emerald-400 block text-xs">{isEn ? 'Step 3: Shield Ownership' : 'Paso 3: Blindar Titularidad'}</span>
                          <p className="text-[11px] text-slate-300">
                            {isEn
                              ? 'Enter the 6-digit code. The listing is immediately transferred to the legitimate owner.'
                              : 'Digitar el código de 6 dígitos. La ficha pasa de inmediato a ser del dueño, asegurando reseñas y fotos.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {rescueScenario === 'third_party' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-indigo-400" />
                          <span>{isEn ? 'Official 72-Hour Legal Ownership Transfer Protocol' : 'Protocolo Oficial de Transferencia Legal de 72 Horas'}</span>
                        </span>
                        <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/30">
                          {isEn ? '⏳ 3 Business Days' : '⏳ 3 Días Hábiles'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="font-black text-indigo-400 block text-xs">{isEn ? 'Day 1: Submission' : 'Día 1: Radicación'}</span>
                          <p className="text-[11px] text-slate-300">
                            {isEn
                              ? 'Enter business.google.com/create, search the listing, click "Request Access", and choose Owner role.'
                              : 'Entrar a business.google.com/create, buscar la ficha y dar clic en "Solicitar Acceso" como Propietario.'}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="font-black text-indigo-400 block text-xs">{isEn ? 'Days 1-3: Waiting Period' : 'Días 1-3: Espera'}</span>
                          <p className="text-[11px] text-slate-300">
                            {isEn
                              ? 'Google emails the third party. They have exactly 72 hours to accept or transfer.'
                              : 'Google notifica al correo anterior con un plazo improrrogable de 72 horas para responder o transferir.'}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="font-black text-amber-400 block text-xs">{isEn ? 'Day 4: Unlocking' : 'Día 4: Desbloqueo'}</span>
                          <p className="text-[11px] text-slate-300">
                            {isEn
                              ? 'If third party does not reply within 72h, Google unlocks the "Claim & Verify" button for the client.'
                              : 'Si el tercero no responde en 3 días, Google da por abandonada la ficha y desbloquea el reclamo al cliente.'}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="font-black text-emerald-400 block text-xs">{isEn ? 'Day 5: Full Control' : 'Día 5: Control Total'}</span>
                          <p className="text-[11px] text-slate-300">
                            {isEn
                              ? 'The owner verifies via SMS, phone call or 60s video and takes 100% legal control.'
                              : 'El cliente realiza la verificación final por llamada o video de 60s y la ficha queda bajo su control.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {rescueScenario === 'rejected' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4 text-rose-400" />
                          <span>{isEn ? 'Evidentiary Legal Appeal Protocol (When Third Party Denies Access)' : 'Protocolo de Apelación Legal Probatoria (Cuando el Tercero Niega el Acceso)'}</span>
                        </span>
                        <span className="text-[10px] font-mono text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/30">
                          {isEn ? '⚖️ Google Support Escalation' : '⚖️ Escalamiento Legal con Soporte Google'}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-2">
                        <strong className="text-rose-300 block text-xs">
                          {isEn ? '⚠️ Bad-Faith Third Party Defense:' : '⚠️ Cómo anular la negativa del tercero de mala fe:'}
                        </strong>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {isEn
                            ? 'Google’s Official Terms of Service clearly state that a marketing agency, contractor, or former employee cannot withhold an official Google Business Profile from the registered business entity. In the rejection email, click "Appeal Decision" and submit the 4 evidentiary documents below. Google will revoke the third party and grant ownership to the client.'
                            : 'Las políticas oficiales de Google prohíben expresamente que una agencia anterior o un ex-empleado retenga una ficha contra la voluntad del titular comercial. En el correo de rechazo se hace clic en "Apelar Decisión" y se adjuntan las 4 pruebas oficiales. Google revocará al tercero por infracción de políticas.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Direct Link to Google Business Profile Claim Tool */}
                  <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div>
                      <strong className="text-white block text-xs">
                        {isEn ? 'Direct Official Google Business Profile Entry:' : 'Acceso Directo Oficial a Google Business Profile:'}
                      </strong>
                      <span className="text-[11px] text-slate-400">
                        {isEn
                          ? 'Starts the ownership claim flow directly on Google’s secure servers.'
                          : 'Inicia el flujo de reclamación de propiedad directamente en los servidores de Google.'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {rescueScannedListing?.googleMapsUrl && (
                        <a
                          href={rescueScannedListing.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                        >
                          <Globe className="w-3.5 h-3.5 text-rose-400" />
                          <span>{tTools.rescueClaimViaMaps}</span>
                        </a>
                      )}
                      <a
                        href="https://business.google.com/create"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{tTools.rescueBtnDirectClaim}</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Evidentiary Checklist */}
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs shadow-xl">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-black text-white flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-400" />
                      <span>{tTools.rescueDocsTitle}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {isEn ? 'Required for Escalation' : 'Requerido para Escalamiento ante Google'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block text-xs">{isEn ? '1. Incorporation Certificate / Tax Registration' : '1. Documento de Constitución / Registro Tributario'}</strong>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {isEn ? 'EIN / Articles of Incorporation (USA), CIF (Spain), RFC (Mexico), or RUT (Colombia).' : 'RUT (Colombia), RFC / Constancia SAT (México), CIF (España) o EIN / Articles of Incorporation (USA).'}
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block text-xs">{isEn ? '2. Utility Bill or Commercial Lease' : '2. Factura de Servicios Públicos o Contrato'}</strong>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {isEn ? 'Recent electricity, water, gas or internet bill with business name and address identical to Google Maps.' : 'Recibo reciente de energía, agua, gas o internet con el nombre comercial y dirección idéntica a Google Maps.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block text-xs">{isEn ? '3. Exterior Facade Photo with Visible Signage' : '3. Foto Exterior de Fachada con Aviso Visible'}</strong>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {isEn ? 'Street-view photo showing the permanent commercial sign and street address numbers.' : 'Fotografía tomada desde la calle mostrando el letrero comercial permanente y el número de nomenclatura.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block text-xs">{isEn ? '4. Continuous 60-Second Video Walkthrough' : '4. Video Continuo de 60 Segundos del Local'}</strong>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {isEn ? 'One continuous uncut take: Exterior facade (0-15s) → Reception desk (15-40s) → POS terminal or tax document (40-60s).' : 'Grabación continua sin cortes: Fachada exterior (0-15s) → Mostrador de recepción (15-40s) → Software o datáfono (40-60s).'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Diagnostic Script */}
                <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/40 space-y-3 text-xs shadow-xl">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-black text-amber-400 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>{tTools.rescueWhatsappScriptTitle}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        const emailSnippet = rescueMaskedEmail.trim()
                          ? `(${rescueMaskedEmail.trim()})`
                          : isEn
                          ? '(an external unauthorized email)'
                          : '(un correo externo no autorizado)';

                        const scriptText = isEn
                          ? rescueScenario === 'orphan'
                            ? `Hello ${rescueBusinessName || 'Business Owner'}, this is the Prestigia team. We audited your Google Maps presence and discovered a critical vulnerability: your business listing exists but is currently 'Unclaimed / Orphan'. Any third party or competitor can suggest edits or claim ownership. At Prestigia, we can process your official ownership claim today and secure full legal control without altering your existing reviews or SEO ranking. Shall we start your protection protocol?`
                            : rescueScenario === 'third_party'
                            ? `Hello ${rescueBusinessName || 'Business Owner'}, this is the Prestigia team. Upon auditing your business on Google Maps, we noticed your official listing is linked to an external email ${emailSnippet} and you lack Primary Owner access. Do not worry: creating a new listing is NOT necessary (doing so causes duplicate listing penalties). We execute Google's Official 72-Hour Legal Ownership Protocol to request ownership and transfer complete control directly to your personal account within a week, preserving all reviews and photos. Shall we initiate the protocol today?`
                            : `Hello ${rescueBusinessName || 'Business Owner'}, this is the Prestigia team. If a previous agency or ex-employee refused to transfer your Google Maps profile, Google's official policies protect your legitimate ownership. We submit an evidentiary appeal dossier with your corporate tax documentation and storefront evidence so Google Support revokes the third party and restores complete ownership to you. Would you like us to draft the official appeal?`
                          : rescueScenario === 'orphan'
                          ? `Hola estimado/a ${rescueBusinessName || 'propietario'}, le saluda el equipo de Prestigia. Auditamos su presencia en Google Maps y detectamos una vulnerabilidad crítica: su ficha de negocio existe pero actualmente se encuentra 'Huérfana / Sin Reclamar'. Esto significa que cualquier tercero o competidor puede sugerir cambios o adueñarse de ella. En Prestigia podemos gestionar hoy mismo la reclamación oficial y blindar la titularidad legal de su empresa sin alterar sus reseñas ni su posicionamiento. ¿Desea que iniciemos el trámite de protección?`
                          : rescueScenario === 'third_party'
                          ? `Hola estimado/a ${rescueBusinessName || 'propietario'}, le saluda el equipo de Prestigia. Al auditar su negocio en Google Maps notamos que su ficha oficial está vinculada a un correo externo ${emailSnippet} y usted no cuenta con el acceso de Propietario Principal. No se preocupe: NO es necesario crear una ficha nueva (hacerlo causaría sanción por duplicidad). Nosotros ejecutamos el Protocolo Oficial de 72 Horas de Google para solicitar la propiedad y transferirle el control legal completo a su cuenta personal en menos de una semana, conservando todas sus reseñas y fotos. ¿Coordinamos los datos para radicar la solicitud hoy?`
                          : `Hola estimado/a ${rescueBusinessName || 'propietario'}, le saluda el equipo de Prestigia. Si una agencia anterior o ex-empleado le negó el traspaso de su ficha en Google Maps, las políticas oficiales de Google amparan su titularidad legítima. Nosotros radicamos el expediente probatorio de apelación con su personería jurídica y evidencias del local para que el equipo de soporte de Google revoque al tercero y le restituya el control total de su negocio. ¿Le gustaría que redactemos la apelación oficial?`;
                        copyToClipboard(scriptText, isEn ? 'WhatsApp Script' : 'Guion de WhatsApp');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold transition flex items-center gap-1.5 cursor-pointer border border-amber-500/40"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Copy Script' : 'Copiar Guion'}</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 italic leading-relaxed p-4 rounded-xl bg-slate-950 border border-slate-800">
                    {isEn
                      ? rescueScenario === 'orphan'
                        ? `"Hello ${rescueBusinessName || 'Business Owner'}, this is the Prestigia team. We audited your Google Maps presence and discovered a critical vulnerability: your business listing exists but is currently 'Unclaimed / Orphan'. Any third party or competitor can suggest edits or claim ownership. At Prestigia, we can process your official ownership claim today and secure full legal control without altering your existing reviews or SEO ranking. Shall we start your protection protocol?"`
                        : rescueScenario === 'third_party'
                        ? `"Hello ${rescueBusinessName || 'Business Owner'}, this is the Prestigia team. Upon auditing your business on Google Maps, we noticed your official listing is linked to an external email ${rescueMaskedEmail.trim() ? `(${rescueMaskedEmail.trim()})` : '(an external unauthorized email)'} and you lack Primary Owner access. Do not worry: creating a new listing is NOT necessary (doing so causes duplicate listing penalties). We execute Google's Official 72-Hour Legal Ownership Protocol to request ownership and transfer complete control directly to your personal account within a week, preserving all reviews and photos. Shall we initiate the protocol today?"`
                        : `"Hello ${rescueBusinessName || 'Business Owner'}, this is the Prestigia team. If a previous agency or ex-employee refused to transfer your Google Maps profile, Google's official policies protect your legitimate ownership. We submit an evidentiary appeal dossier with your corporate tax documentation and storefront evidence so Google Support revokes the third party and restores complete ownership to you. Would you like us to draft the official appeal?"`
                      : rescueScenario === 'orphan'
                      ? `"Hola estimado/a ${rescueBusinessName || 'propietario'}, le saluda el equipo de Prestigia. Auditamos su presencia en Google Maps y detectamos una vulnerabilidad crítica: su ficha de negocio existe pero actualmente se encuentra 'Huérfana / Sin Reclamar'. Esto significa que cualquier tercero o competidor puede sugerir cambios o adueñarse de ella. En Prestigia podemos gestionar hoy mismo la reclamación oficial y blindar la titularidad legal de su empresa sin alterar sus reseñas ni su posicionamiento. ¿Desea que iniciemos el trámite de protección?"`
                      : rescueScenario === 'third_party'
                      ? `"Hola estimado/a ${rescueBusinessName || 'propietario'}, le saluda el equipo de Prestigia. Al auditar su negocio en Google Maps notamos que su ficha oficial está vinculada a un correo externo ${rescueMaskedEmail.trim() ? `(${rescueMaskedEmail.trim()})` : '(un correo externo no autorizado)'} y usted no cuenta con el acceso de Propietario Principal. No se preocupe: NO es necesario crear una ficha nueva (hacerlo causaría sanción por duplicidad). Nosotros ejecutamos el Protocolo Oficial de 72 Horas de Google para solicitar la propiedad y transferirle el control legal completo a su cuenta personal en menos de una semana, conservando todas sus reseñas y fotos. ¿Coordinamos los datos para radicar la solicitud hoy?"`
                      : `"Hola estimado/a ${rescueBusinessName || 'propietario'}, le saluda el equipo de Prestigia. Si una agencia anterior o ex-empleado le negó el traspaso de su ficha en Google Maps, las políticas oficiales de Google amparan su titularidad legítima. Nosotros radicamos el expediente probatorio de apelación con su personería jurídica y evidencias del local para que el equipo de soporte de Google revoque al tercero y le restituya el control total de su negocio. ¿Le gustaría que redactemos la apelación oficial?"`}
                  </p>
                </div>
              </div>
            </div>

            {/* =========================================================
                INTEGRATED: GUÍA PASO A PASO DÓNDE DAR CLIC (RESCATE 72H)
                ========================================================= */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl print:hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-950 border border-rose-500/40 text-rose-300">
                    {isEn ? 'Technical Walkthrough • Case 3: Listing Rescue & Appeal' : 'Paso a Paso Técnico • Caso 3: Rescate de Ficha Secuestrada o Huérfana'}
                  </span>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                    <span>{isEn ? 'Where to Click on Google to Reclaim or Appeal Listing Ownership' : 'Guía Paso a Paso: Dónde dar Clic en Google para Reclamar o Apelar Titularidad'}</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isEn
                      ? 'Legal 72-hour protocol to revoke third parties and submit evidentiary dossiers to Google Trust & Safety.'
                      : 'Protocolo legal de 72 horas para revocar a terceros y radicar el expediente probatorio ante Google Trust & Safety.'}
                  </p>
                </div>
                <a
                  href="https://support.google.com/business/workflow/12825603"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition flex items-center gap-2 shadow-lg shadow-rose-600/20 cursor-pointer shrink-0"
                >
                  <span>{isEn ? 'Google Appeal Tool' : 'Herramienta de Apelación Google'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* 6 Steps Grid for Rescue */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-black flex items-center justify-center text-xs shrink-0">1</span>
                    <strong className="text-white text-xs">{isEn ? 'Locate Profile on Maps' : 'Localizar Ficha en Maps'}</strong>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {isEn ? <>Open an incognito browser window. Search for the exact business name on Google Maps and open the public profile.</> : <>Abre el navegador en modo incógnito. Busca el nombre comercial exacto del negocio en Google Maps y abre el perfil público.</>}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-black flex items-center justify-center text-xs shrink-0">2</span>
                    <strong className="text-white text-xs">{isEn ? 'Click "Claim this Business"' : 'Clic en "Reclamar Empresa"'}</strong>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {isEn ? <>Below the address, click the link: <strong>"Own this business?"</strong> or <strong>"Claim this business"</strong>.</> : <>Debajo de la dirección, haz clic en el enlace azul: <strong>"¿Eres el propietario de esta empresa?"</strong> o <strong>"Reclamar este negocio"</strong>.</>}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-black flex items-center justify-center text-xs shrink-0">3</span>
                    <strong className="text-white text-xs">{isEn ? 'Click "Request Access"' : 'Clic en "Solicitar Acceso"'}</strong>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {isEn ? <>If Google indicates the profile belongs to an external email (e.g. <em>c*****@gmail.com</em>), click the blue <strong>"Request Access"</strong> button.</> : <>Si Google muestra que la ficha pertenece a un correo externo (ej: <em>c*****@gmail.com</em>), haz clic en el botón azul <strong>"Solicitar acceso"</strong> (Request Access).</>}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-black flex items-center justify-center text-xs shrink-0">4</span>
                    <strong className="text-white text-xs">{isEn ? 'Role "Owner" & 72-Hour Window' : 'Nivel "Propietario" & Plazo 72h'}</strong>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {isEn ? <>Select level <strong>"Owner"</strong>. Google notifies the holder with a mandatory <strong>3-day (72 hours)</strong> window. If they don\'t answer, Google releases direct verification to you.</> : <>Elige nivel <strong>"Propietario"</strong>. Google notifica al secuestrador dándole <strong>3 días (72 horas)</strong> obligatorios. Si no responde, Google libera la verificación directa para ti.</>}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-black flex items-center justify-center text-xs shrink-0">5</span>
                    <strong className="text-white text-xs">{isEn ? 'Formal Appeal if Rejected' : 'Apelación Formal si Rechazan'}</strong>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {isEn ? <>If the current manager denies or the listing is suspended, access the <strong>Official Google Appeals Tool</strong> and file a formal reinstatement claim.</> : <>Si el secuestrador rechaza o el perfil está suspendido, ingresa a la <strong>Herramienta Oficial de Apelaciones</strong> y abre un caso formal de restitución.</>}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-black flex items-center justify-center text-xs shrink-0">6</span>
                    <strong className="text-white text-xs">{isEn ? 'Evidentiary Dossier Upload' : 'Carga de Expediente Probatorio'}</strong>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {isEn ? <>Attach the 4 official records: Tax ID / Business license, recent utility bill, facade photo, and POS terminal to Google Trust & Safety to revoke unauthorized holders.</> : <>Adjunta los 4 documentos oficiales: RUT / Tax ID, factura de energía reciente, foto de fachada y datáfono en caja ante Google Trust & Safety para revocar al secuestrador.</>}
                  </p>
                </div>
              </div>
            </div>

            {/* =========================================================
                INTEGRATED: GUIÓN COMERCIAL DE CIERRE (RESCATE 72H)
                ========================================================= */}
            <div className="bg-slate-950 border-2 border-rose-500/50 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl print:hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-950 border border-rose-500/40 text-rose-300">
                    {isEn ? 'Sales Playbook • Case 3: Listing Rescue Closing Pitch' : 'Guión Comercial & Cierre • Caso 3: Venta de Rescate & Recuperación 72h'}
                  </span>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-rose-400" />
                    <span>{isEn ? 'High-Urgency Crisis Rescue Closing Script' : 'Speech de Crisis & Urgencia Extrema: Rescate de Titularidad Google'}</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isEn
                      ? 'Prevent clients from creating duplicate listings and close the $250-$450 USD rescue fee or bundle with Prestigia plans.'
                      : 'Evita que el cliente cree fichas duplicadas sancionables y cierra el servicio de rescate ($350 USD) o bonifícalo con el Plan Prestigia.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const script = isEn
                      ? `Hello ${rescueBusinessName || 'Business Owner'}, this is the Prestigia team with an urgent advisory regarding your Google Maps listing. We detected that your official profile is currently compromised by a third party or suspended by Google. Customers searching for your business in ${rescueCity || 'your city'} may be calling outdated numbers or unable to find your address. Please DO NOT make the serious mistake of creating a new profile: Google will penalize both listings for duplicity and you will lose all reviews, photos, and years of commercial seniority. At Prestigia, we are certified listing recovery specialists and execute Google's Official 72-Hour Legal Ownership Protocol to submit the evidentiary dossier and return absolute legal control to you. When you activate your tailored Prestigia Plan today to protect your reputation, we absorb 100% of the technical and legal recovery fee ($0 waived) and shield your listing from future takeovers. Would you authorize us to submit the ownership claim today?`
                      : `Hola ${rescueBusinessName || 'propietario'}, le saluda el equipo de Prestigia con una alerta prioritaria de su negocio en Google Maps. Detectamos que su ficha oficial se encuentra actualmente secuestrada por un tercero / suspendida por Google. Los clientes que buscan su negocio en ${rescueCity || 'su ciudad'} están llamando a números que no le pertenecen o no pueden encontrar su dirección. Por favor NO cometa el grave error de crear una ficha nueva: Google la suspenderá por duplicidad y usted perderá todas sus reseñas, fotos y años de antigüedad comercial. En Prestigia somos especialistas certificados en rescates de titularidad y ejecutamos el Protocolo Oficial de 72 Horas de Google para radicar el expediente probatorio y devolverle el control legal absoluto de su perfil. Al activar hoy su Plan Prestigia a la medida para blindar su reputación, nosotros absorbemos el 100% del costo legal y técnico de rescate ($0 bonificado) y blindamos su ficha para que nunca nadie vuelva a quitársela. ¿Nos autoriza a radicar la solicitud de titularidad hoy mismo?`;
                    copyToClipboard(script, isEn ? 'Listing Rescue Pitch' : 'Guión de Rescate de Ficha');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition flex items-center gap-2 shadow-lg shadow-rose-600/20 cursor-pointer shrink-0 active:scale-98"
                >
                  <Copy className="w-4 h-4" />
                  <span>{isEn ? 'Copy Rescue Pitch' : 'Copiar Guión de Rescate'}</span>
                </button>
              </div>

              {/* Pitch Display Card */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-rose-500/30 text-xs text-slate-200 leading-relaxed italic space-y-2">
                <span className="font-bold text-rose-300 not-italic block text-xs">
                  {isEn ? '🎙️ High-Urgency Ownership Rescue Pitch:' : '🎙️ Speech de Urgencia & Rescate de Titularidad:'}
                </span>
                <p>
                  {isEn ? (
                    <>"Hello <strong>{rescueBusinessName || 'Business Owner'}</strong>, this is the Prestigia team with an urgent advisory. Your official Google Maps profile is currently <strong>compromised / suspended by Google</strong>. Potential clients searching your business are calling outdated numbers. <strong>DO NOT create a duplicate profile</strong>: Google will penalize both listings and you will lose all reviews and domain history. We execute the official 72-Hour Legal Protocol with Google Trust & Safety to restore full ownership."</>
                  ) : (
                    <>"Hola <strong>{rescueBusinessName || 'propietario'}</strong>, le saluda el equipo de Prestigia con una alerta urgente. Su ficha en Google Maps está actualmente <strong>secuestrada por un tercero / suspendida</strong>. Clientes que buscan su negocio están llamando a números ajenos. <strong>NO cree una ficha nueva</strong>: Google la sancionará por duplicidad y perderá todas sus reseñas. Nosotros ejecutamos el protocolo legal de 72h con Google Trust & Safety para restituirle la titularidad legítima."</>
                  )}
                </p>
              </div>

              {/* Objections & Closing Offer Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <strong className="text-amber-300 block text-xs">
                    {isEn ? '⚠️ Objection: "A former agency or ex-employee wants money to release it."' : '⚠️ Objeción: "Una agencia anterior o ex-empleado me pide dinero para entregármela."'}
                  </strong>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    <strong>{isEn ? 'Advisor Answer:' : 'Respuesta Asesor:'}</strong> {isEn ? '"Never pay extortion fees. Google strictly prohibits third parties from withholding commercial listings. Through our official evidentiary claim (tax ID, utility bill, and point-of-sale receipt), Google Trust & Safety revokes the unauthorized holder directly and reassigns ownership to you."' : '"No les pague un solo centavo. Las directrices de Google sancionan penalmente la extorsión de perfiles comerciales. Con nuestro expediente legal (RUT, facturas de servicios y datáfono), Google revoca al tercero de inmediato y le transfiere la titularidad a usted sin depender de ellos."'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <strong className="text-amber-300 block text-xs">
                    {isEn ? '⚠️ Objection: "How long does it take and what are the guarantees?"' : '⚠️ Objeción: "¿Cuánto tiempo demora y qué garantías tengo?"'}
                  </strong>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    <strong>{isEn ? 'Advisor Answer:' : 'Respuesta Asesor:'}</strong> {isEn ? '"Google\'s 72-Hour protocol gives unauthorized managers exactly 3 business days to reply. If they fail to answer, the verification trigger releases automatically. Over 95% of evidentiary rescues are resolved within 7 business days."' : '"El protocolo de 72 horas de Google da un plazo perentorio de 3 días hábiles. Si no responden, el botón de verificación se libera inmediatamente. Más del 95% de los rescates probatorios con documentación legal se resuelven con éxito en menos de una semana."'}
                  </p>
                </div>
              </div>

              {/* Closing Hook Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-900 border border-rose-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-black text-rose-300 uppercase tracking-wide block text-xs">
                    {isEn ? '🎁 The Prestigia Closing Hook ($0 Setup Waiver):' : '🎁 El Gancho de Cierre Prestigia ($0 Setup):'}
                  </span>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    {isEn ? <>"When you activate your tailored <strong>Prestigia Plan</strong> today, we absorb 100% of the technical and legal rescue fee (<strong>$0 cost waived</strong>) and shield your listing from future hijackings."</> : <>"Al contratar hoy tu <strong>Plan Prestigia a la medida</strong> para tu negocio, nosotros asumimos el 100% del costo técnico y legal del rescate (<strong>$0 bonificado</strong>) y blindamos tu ficha."</>}
                  </p>
                </div>
                <span className="shrink-0 px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-black text-xs">
                  {isEn ? 'Tailored Plan' : (isEn ? 'Tailored Plan' : 'Plan a la Medida')}
                </span>
              </div>

              {/* Bottom Quick Action: Nuevo Rescate */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 pb-2 print:hidden">
                <button
                  type="button"
                  onClick={handleResetRescueForm}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black text-sm transition flex items-center gap-2 shadow-xl shadow-rose-500/25 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4 text-slate-950" />
                  <span>{isEn ? 'Run Another Rescue' : 'Nuevo Rescate'}</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* =============================================================
            TAB 4: ESCUDO LEGAL & APELACIÓN DE RESEÑAS 1★ A 3★
            ============================================================= */}
        {activeTab === 'appeals' && (
          <div className="space-y-6">
            {/* Header intro */}
            <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/30 border border-rose-500/40 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden print:hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-950 border border-rose-500/40 text-rose-300">
                    {isEn ? '⚖️ Module 4 • Legal Shield & 1★–3★ Review Appeal' : '⚖️ Módulo 4 • Escudo Legal & Apelación de Reseñas 1★ a 3★'}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <Scale className="w-6 h-6 text-amber-400" />
                    <span>{isEn ? 'Bad-Faith Review Removal & Legal Defense Dossier' : 'Impugnación de Reseñas de Mala Fe & Vicios de Política Google Maps'}</span>
                  </h1>
                  <p className="text-xs text-slate-300 max-w-2xl">
                    {isEn
                      ? 'Examine your client’s Google Maps profile, detect 1★ to 3★ reviews hurting their score, and generate the formal legal appeal package and mitigation script for Google Trust & Safety.'
                      : 'Examina la ficha de Google Maps de tu cliente, aísla las opiniones de 1★ a 3★ que dañan su reputación y formula el expediente legal técnico con base en las directrices oficiales de Google Trust & Safety.'}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
                  {/* Credit Counter Badge */}
                  {isLuismaMaster ? (
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                      <div className="text-left">
                        <span className="text-[9px] uppercase font-black tracking-wider text-amber-400/80 block">{isEn ? 'Appeal Credits' : 'Créditos de Apelación'}</span>
                        <strong className="text-xs font-black text-amber-200">{isEn ? '👑 UNLIMITED • Master' : '👑 ILIMITADO • Master'}</strong>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl border transition ${
                        (monthlyUsage.appeals || 0) >= (currentUser?.maxAppealsMonthly ?? (currentUser?.accountType === 'partner_agency' ? 25 : currentUser?.accountType === 'director' ? 50 : 15))
                          ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                          : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                      }`}
                    >
                      <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                      <div className="text-left">
                        <span className="text-[9px] uppercase font-black tracking-wider opacity-80 block">{isEn ? 'Appeal Quota' : 'Cupo de Apelaciones'}</span>
                        <div className="text-xs font-black flex items-center gap-1">
                          <span>
                            {monthlyUsage.appeals || 0} /{' '}
                            {currentUser?.maxAppealsMonthly ?? (currentUser?.accountType === 'partner_agency' ? 25 : currentUser?.accountType === 'director' ? 50 : 15)} Usadas
                          </span>
                          <span className="text-[10px] font-bold opacity-75">
                            (
                            {Math.max(
                              0,
                              (currentUser?.maxAppealsMonthly ?? (currentUser?.accountType === 'partner_agency' ? 25 : currentUser?.accountType === 'director' ? 50 : 15)) -
                                (monthlyUsage.appeals || 0)
                            )}{' '}
                            disp.)
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block font-mono">{isEn ? 'Google Workflow SLA' : 'Tiempo de Respuesta Google'}</span>
                    <span className="text-lg font-black text-amber-400">{isEn ? '3 to 5 Business Days' : '3 a 5 Días Hábiles'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetAppealForm}
                    className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-md shadow-rose-500/20 cursor-pointer shrink-0 active:scale-95"
                    title={isEn ? 'Clear form to run a new appeal' : 'Realizar una nueva apelación desde cero'}
                  >
                    <Plus className="w-4 h-4 text-slate-950" />
                    <span>{isEn ? 'New Appeal' : 'Nueva Apelación'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Appeals Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Client Data + Listing Scanner + Reviews Radar (5 cols) */}
              <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl print:hidden">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <Scale className="w-4 h-4 text-rose-400" />
                  <h2 className="text-sm font-black text-white">
                    {isEn ? '1. Client Data & 1★-3★ Reviews Radar' : '1. Datos del Cliente & Radar de Reseñas 1★ a 3★'}
                  </h2>
                </div>

                {/* Tarjeta de Datos del Cliente / Contratante */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-900 border border-indigo-500/30 space-y-2.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-indigo-500/20">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-xs font-black text-indigo-300">
                        {isEn ? '👤 Client / Contractor Info (Who Hires & Pays)' : '👤 Datos del Cliente / Contratante (Quién Solicita el Servicio)'}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/40">
                      CRM
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">
                        {isEn ? 'Contact Person / Owner *' : 'Persona de Contacto / Dueño *'}
                      </label>
                      <input
                        type="text"
                        value={appealContactName}
                        onChange={(e) => setAppealContactName(e.target.value)}
                        placeholder={isEn ? 'e.g. John Doe' : 'Ej: Carlos Gómez'}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">
                        {isEn ? 'Contracting Company / Legal Entity *' : 'Empresa / Razón Social Contratante *'}
                      </label>
                      <input
                        type="text"
                        value={appealContactCompany}
                        onChange={(e) => setAppealContactCompany(e.target.value)}
                        placeholder={isEn ? 'e.g. Acme Services LLC' : 'Ej: Restaurante El Sabor SAS'}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1 flex items-center justify-between">
                        <span>{isEn ? 'Direct WhatsApp *' : 'WhatsApp Directo *'}</span>
                        {appealContactPhone && (
                          <a
                            href={`https://wa.me/${appealContactPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] text-emerald-400 hover:text-emerald-300 font-bold"
                          >
                            Chat
                          </a>
                        )}
                      </label>
                      <input
                        type="tel"
                        value={appealContactPhone}
                        onChange={(e) => setAppealContactPhone(e.target.value)}
                        placeholder="+57 300 123 4567"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">
                        {isEn ? 'Email *' : 'Correo Electrónico *'}
                      </label>
                      <input
                        type="email"
                        value={appealContactEmail}
                        onChange={(e) => setAppealContactEmail(e.target.value)}
                        placeholder={isEn ? 'contact@company.com' : 'contacto@empresa.com'}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">
                        {isEn ? 'Role *' : 'Cargo / Relación *'}
                      </label>
                      <select
                        value={appealContactRole}
                        onChange={(e) => setAppealContactRole(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-400 text-xs"
                      >
                        <option value="Dueño / Propietario">{isEn ? '👑 Owner' : '👑 Dueño / Propietario'}</option>
                        <option value="Gerente General">{isEn ? '💼 General Manager' : '💼 Gerente General'}</option>
                        <option value="Director de Marketing">{isEn ? '📈 Marketing Dir.' : '📈 Dir. Marketing'}</option>
                        <option value="Administrador">{isEn ? '🏢 Branch Admin' : '🏢 Administrador'}</option>
                        <option value="Encargado">{isEn ? '🔑 Shift Manager' : '🔑 Encargado'}</option>
                        <option value="Particular">{isEn ? '👤 Private Client' : '👤 Particular'}</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Subcard 2: Google Maps Link Scanner */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">
                    {isEn ? 'Google Maps Link or Business Name to Scan *' : 'Enlace de Google Maps o Nombre del Negocio *'}
                  </label>
                  <form onSubmit={handleScanForAppeals} className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={appealSearchQuery}
                        onChange={(e) => setAppealSearchQuery(e.target.value)}
                        placeholder={isEn ? 'Paste Google Maps URL or name...' : 'Pega el link de Google Maps o nombre...'}
                        className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isScanningAppeals || !appealSearchQuery.trim()}
                      className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-md shrink-0"
                    >
                      {isScanningAppeals ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                          <span>{isEn ? 'Scanning...' : 'Escaneando...'}</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 text-slate-950" />
                          <span>{isEn ? 'Scan Reviews' : 'Escanear Reseñas'}</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Preview of Scanned Business */}
                {scannedAppealBiz && (
                  <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/30 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-xs font-black text-white truncate">{scannedAppealBiz.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <span className="text-amber-400 font-bold flex items-center gap-0.5">
                          ★ {scannedAppealBiz.rating}
                        </span>
                        <span>•</span>
                        <span>{scannedAppealBiz.reviewsCount} opiniones</span>
                        <span>•</span>
                        <span className="truncate">{scannedAppealBiz.category || 'Local'}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 shrink-0">
                      Verificada
                    </span>
                  </div>
                )}

                {/* Radar of Detected Reviews (1★ to 3★) */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span className="text-xs font-black text-white">
                        {isEn ? 'Critical Reviews Radar (1★ to 3★)' : 'Radar de Reseñas Críticas (1★ a 3★)'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowManualReviewForm((prev) => !prev)}
                      className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{showManualReviewForm ? (isEn ? 'Close Form' : 'Cerrar') : (isEn ? 'Paste Review' : 'Pegar Manual')}</span>
                    </button>
                  </div>

                  {/* Manual Review Entry Form / Modal Inline */}
                  {showManualReviewForm && (
                    <form onSubmit={handleAddManualReview} className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300">
                          {isEn ? '📝 Input Custom Negative Review to Appeal' : '📝 Ingresar Reseña Crítica para Apelar'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowManualReviewForm(false)}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-300 mb-1">
                            {isEn ? 'Author / User Name' : 'Nombre del Autor'}
                          </label>
                          <input
                            type="text"
                            value={manualAuthor}
                            onChange={(e) => setManualAuthor(e.target.value)}
                            placeholder={isEn ? 'e.g. John Doe' : 'Ej: Pedro Pérez'}
                            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-300 mb-1">
                            {isEn ? 'Stars Rating' : 'Calificación'}
                          </label>
                          <select
                            value={manualRating}
                            onChange={(e) => setManualRating(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                          >
                            <option value={1}>{isEn ? '★ 1 Star (Severe Critical)' : '★ 1 Estrella (Crítica Máxima)'}</option>
                            <option value={2}>{isEn ? '★★ 2 Stars (Negative)' : '★★ 2 Estrellas (Negativa)'}</option>
                            <option value={3}>{isEn ? '★★★ 3 Stars (Neutral / Damaging)' : '★★★ 3 Estrellas (Neutro/Dañina)'}</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 mb-1">
                          {isEn ? 'Estimated Date / Age' : 'Antigüedad / Fecha aproximada'}
                        </label>
                        <input
                          type="text"
                          value={manualTimeAgo}
                          onChange={(e) => setManualTimeAgo(e.target.value)}
                          placeholder="Ej: Hace 2 semanas / 15 de Octubre"
                          className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 mb-1">
                          {isEn ? 'Exact Review Text (Copy & Paste from Maps) *' : 'Texto Exacto de la Reseña (Copiar y Pegar de Google Maps) *'}
                        </label>
                        <textarea
                          rows={3}
                          value={manualText}
                          onChange={(e) => setManualText(e.target.value)}
                          placeholder={isEn ? 'Paste here the full text written by the reviewer...' : 'Pega aquí el texto completo que escribió la persona...'}
                          className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 mb-1">
                          {isEn ? 'Suspected Violation / Motive' : 'Motivo Principal de Impugnación'}
                        </label>
                        <select
                          value={manualContextFlag}
                          onChange={(e: any) => setManualContextFlag(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        >
                          <option value="fake_customer">{isEn ? '🚫 Never a customer / No purchase record or order' : '🚫 Nunca fue cliente / Sin registro de compra ni comanda'}</option>
                          <option value="competitor">{isEn ? '⚔️ Local Competitor Suspected / Conflict of Interest' : '⚔️ Sospecha de competidor local / Conflicto de intereses'}</option>
                          <option value="ex_employee">{isEn ? '👔 Ex-Employee or Internal Labor Dispute' : '👔 Ex-empleado o conflicto laboral interno'}</option>
                          <option value="defamation">{isEn ? '🚨 Harassment, Direct Insults or Defamation' : '🚨 Acoso, insultos directos o difamación personal'}</option>
                          <option value="extortion">{isEn ? '💰 Extortion Attempt / Forced Money Demand' : '💰 Intento de extorsión / Exigencia forzada de dinero'}</option>
                          <option value="off_topic">{isEn ? '📍 Off-Topic / Confusion with an Unrelated Business' : '📍 Off-Topic / Confusión con otro local ajeno'}</option>
                          <option value="general_bad_faith">{isEn ? '⚠️ Manifest Bad Faith / Unverifiable Claims' : '⚠️ Mala fe manifiesta / Queja sin hechos verificables'}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 mb-1">
                          {isEn ? 'Additional Context or Internal Evidence (Optional)' : 'Detalles Internos o Evidencia Adicional (Opcional)'}
                        </label>
                        <input
                          type="text"
                          value={manualNotes}
                          onChange={(e) => setManualNotes(e.target.value)}
                          placeholder={isEn ? 'e.g. We checked cameras and on that date the store was closed for maintenance...' : 'Ej: Revisamos las cámaras y ese día el local estuvo cerrado por mantenimiento...'}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isGeneratingAppeal || !manualText.trim()}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span>{isGeneratingAppeal ? (isEn ? 'Generating Appeal Dossier...' : 'Generando Expediente...') : (isEn ? 'Analyze & Prepare Formal Appeal' : 'Analizar & Preparar Apelación Formal')}</span>
                      </button>
                    </form>
                  )}

                  {/* List of Detected or Available Reviews */}
                  {appealReviewsList.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
                      <Search className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400">
                        {isEn
                          ? 'Scan a listing above or click "Paste Review" to analyze any 1★–3★ review hurting this business.'
                          : 'Escanea un enlace arriba o haz clic en "Pegar Manual" para impugnar cualquier reseña de 1★ a 3★ que perjudique al negocio.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {appealReviewsList.map((rev) => {
                        const isSelected = selectedAppealReview?.id === rev.id;
                        return (
                          <div
                            key={rev.id}
                            className={`p-3.5 rounded-2xl border transition space-y-2 ${
                              isSelected
                                ? 'bg-rose-950/30 border-rose-500/60 shadow-lg shadow-rose-950/30'
                                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-black text-white">{rev.author}</span>
                                  <span className="text-[10px] text-slate-400">{rev.timeAgo}</span>
                                </div>
                                <div className="flex items-center gap-0.5 mt-0.5 text-amber-400 text-xs">
                                  {Array.from({ length: rev.rating }).map((_, i) => (
                                    <span key={i}>★</span>
                                  ))}
                                  {Array.from({ length: 5 - rev.rating }).map((_, i) => (
                                    <span key={i} className="text-slate-700">★</span>
                                  ))}
                                </div>
                              </div>
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-500/30 shrink-0">
                                Viabilidad: {rev.viability}
                              </span>
                            </div>

                            <p className="text-xs text-slate-300 italic line-clamp-3 bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
                              «{rev.text}»
                            </p>

                            <div className="text-[10px] text-amber-400/90 font-mono">
                              🔍 {rev.detectedReason}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleGenerateAppealForReview(rev)}
                              disabled={isGeneratingAppeal}
                              className={`w-full py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                                isSelected
                                  ? 'bg-rose-500 text-slate-950 hover:bg-rose-400'
                                  : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 hover:border-rose-500/50'
                              } disabled:opacity-50`}
                            >
                              {isGeneratingAppeal && isSelected ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>{isEn ? 'Drafting Legal Memo...' : 'Redactando Expediente...'}</span>
                                </>
                              ) : (
                                <>
                                  <Scale className="w-3.5 h-3.5 text-amber-400" />
                                  <span>{isEn ? 'Prepare Formal Appeal' : '⚖️ Preparar Apelación Formal'}</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Bottom Quick Action */}
                <button
                  type="button"
                  onClick={handleResetAppealForm}
                  className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border-2 border-rose-500/50 hover:border-rose-400 text-rose-300 font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg active:scale-98"
                >
                  <Plus className="w-3.5 h-3.5 text-rose-400" />
                  <span>{isEn ? 'Run Another Appeal' : 'Nueva Apelación'}</span>
                </button>
              </div>

              {/* Right Column: Legal Defense Dossier & Submission Workflow (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Empty State when no appeal generated */}
                {!activeAppealDossier && !isGeneratingAppeal && (
                  <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-xl">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-rose-500/20 via-amber-500/20 to-indigo-500/20 border border-rose-500/40 flex items-center justify-center mx-auto shadow-lg">
                      <Scale className="w-8 h-8 text-amber-400" />
                    </div>

                    <div className="space-y-2 max-w-lg mx-auto">
                      <h3 className="text-lg font-black text-white">
                        {isEn ? 'Legal Review Removal & Trust & Safety Engine' : 'Expediente Legal de Impugnación ante Google Maps'}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {isEn
                          ? 'Select any detected critical review on the left or paste a custom one. Prestigia AI will cross-reference it with Google Prohibited Content Policies and generate the full submission package.'
                          : 'Selecciona una reseña del radar a la izquierda o pega una manualmente. La inteligencia artificial de Prestigia la confrontará con las Directrices Oficiales de Google y formulará el expediente de impugnación con 1 solo clic.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">{isEn ? '1. Exact Infringement' : '1. Infracción Precisa'}</span>
                        <p className="text-xs text-slate-300">{isEn ? 'Cites the exact clause of Google Terms (Conflict, Fake, or Harassment).' : 'Cita la cláusula exacta de los Términos de Google (Conflicto, Fake o Acoso).'}</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">{isEn ? '2. Legal Memorial' : '2. Memorial Legal'}</span>
                        <p className="text-xs text-slate-300">{isEn ? 'Formal technical-legal petition drafted for Google Trust & Safety.' : 'Escrito formal técnico-jurídico redactado para radicar ante Trust & Safety.'}</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">{isEn ? '3. Immediate Shield' : '3. Escudo Inmediato'}</span>
                        <p className="text-xs text-slate-300">{isEn ? 'Public institutional response to mitigate damage while Google decides.' : 'Respuesta pública institucional para frenar el daño mientras Google decide.'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading Pulse */}
                {isGeneratingAppeal && (
                  <div className="p-12 rounded-3xl bg-slate-900 border border-rose-500/40 text-center space-y-4 shadow-xl">
                    <RefreshCw className="w-10 h-10 animate-spin text-amber-400 mx-auto" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-white">
                        {isEn ? 'Analyzing Google TOS & Drafting Legal Memorial...' : 'Confrontando Políticas de Google Maps & Redactando Memorial Legal...'}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {isEn
                          ? 'Formulating policy infringement grounds and public mitigation response...'
                          : 'Estructurando causales de retiro, memorial para Trust & Safety y respuesta estratégica pública...'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Active Appeal Dossier Result */}
                {activeAppealDossier && !isGeneratingAppeal && (
                  <div className="space-y-4">
                    {/* Viability & Health Banner */}
                    <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/40 border border-rose-500/50 shadow-xl space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-500/30">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-500/40">
                            Expediente: {activeAppealDossier.id}
                          </span>
                          <h3 className="text-base font-black text-white mt-1 flex items-center gap-2">
                            <span>{isEn ? 'Review by:' : 'Reseña de:'} "{activeAppealDossier.authorName}"</span>
                            <span className="text-amber-400 text-xs">({activeAppealDossier.rating}★)</span>
                          </h3>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block font-mono">{isEn ? 'Viability Index' : 'Índice de Viabilidad'}</span>
                            <strong className="text-lg font-black text-emerald-400">
                              {activeAppealDossier.successProbability} ({activeAppealDossier.successProbabilityPercent}%)
                            </strong>
                          </div>
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 print:hidden"
                          >
                            <Printer className="w-3.5 h-3.5 text-amber-400" />
                            <span>{isEn ? 'Print' : 'Imprimir'}</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {activeAppealDossier.probabilityDiagnosis}
                      </p>
                    </div>

                    {/* Card 1: Google Policy Violation */}
                    <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                        <Gavel className="w-4 h-4 text-amber-400" />
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">
                          {isEn ? '1. Infringed Google Maps Policy Clause' : '1. Cláusula Infringida de las Políticas de Google Maps'}
                        </h4>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-1.5">
                        <span className="text-xs font-black text-amber-300 block">
                          {activeAppealDossier.googlePolicy.clauseTitle}
                        </span>
                        <div className="text-[11px] font-mono text-slate-400">
                          {activeAppealDossier.googlePolicy.tosSection}
                        </div>
                        <p className="text-xs text-slate-300 italic pt-1">
                          {activeAppealDossier.googlePolicy.officialPolicySnippet}
                        </p>
                      </div>
                      <p className="text-xs text-slate-400">
                        <strong className="text-white">{isEn ? 'Factual Basis: ' : 'Fundamento Fáctico: '}</strong>
                        {activeAppealDossier.googlePolicy.infringementAnalysis}
                      </p>
                    </div>

                    {/* Card 2: Google Console Workflow Instructions */}
                    <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <ExternalLink className="w-4 h-4 text-indigo-400" />
                          <h4 className="text-xs font-black text-white uppercase tracking-wider">
                            {isEn ? '2. Official Google Console Submission' : '2. Tramitación en la Consola Oficial de Google'}
                          </h4>
                        </div>
                        <a
                          href={activeAppealDossier.googleConsoleWorkflow.officialToolUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-xs transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer shrink-0"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Open Google Business Console' : 'Abrir Consola de Google Business'}</span>
                        </a>
                      </div>

                      <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] text-indigo-300 uppercase font-black tracking-wider block">
                            {isEn ? 'Exact Option to Select in Google Menu:' : 'Opción Exacta a Seleccionar en el Menú de Google:'}
                          </span>
                          <strong className="text-xs font-black text-white">
                            «{activeAppealDossier.googleConsoleWorkflow.exactCategoryToSelect}»
                          </strong>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-900 text-indigo-200 shrink-0">
                          {isEn ? 'Key Step' : 'Paso Clave'}
                        </span>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        {activeAppealDossier.googleConsoleWorkflow.stepByStepInstructions.map((step: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                            <span className="text-amber-400 font-bold shrink-0">•</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card 3: Formal Legal Appeal Memorial (Ready to Copy) */}
                    <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-rose-400" />
                          <h4 className="text-xs font-black text-white uppercase tracking-wider">
                            {isEn ? '3. Legal Appeal Memorial (Text for Google Trust & Safety)' : '3. Memorial Legal de Impugnación (Texto para Google Trust & Safety)'}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${activeAppealDossier.legalAppealMemorial.subject}\n\n${activeAppealDossier.legalAppealMemorial.body}`
                            );
                            setAppealSuccessCopied('memorial');
                            setTimeout(() => setAppealSuccessCopied(null), 2500);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          {appealSuccessCopied === 'memorial' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-slate-950" />
                              <span>{isEn ? 'Copied!' : '¡Copiado!'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-950" />
                              <span>{isEn ? 'Copy Memorial' : 'Copiar Memorial'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div className="text-[11px] font-mono text-slate-400 bg-slate-950 p-2 rounded-xl border border-slate-800">
                          <strong className="text-white">{isEn ? 'SUBJECT: ' : 'ASUNTO: '}</strong>
                          {activeAppealDossier.legalAppealMemorial.subject}
                        </div>
                        <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono bg-slate-950 p-4 rounded-2xl border border-slate-800 max-h-72 overflow-y-auto leading-relaxed">
                          {activeAppealDossier.legalAppealMemorial.body}
                        </pre>
                      </div>
                    </div>

                    {/* Card 4: Public Mitigation Response */}
                    <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-emerald-400" />
                          <h4 className="text-xs font-black text-white uppercase tracking-wider">
                            {isEn ? '4. Immediate Public Mitigation Response (Publish on Maps)' : '4. Respuesta Pública de Mitigación Inmediata (Publicar en Maps)'}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(activeAppealDossier.publicMitigationResponse.responseText);
                            setAppealSuccessCopied('mitigation');
                            setTimeout(() => setAppealSuccessCopied(null), 2500);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          {appealSuccessCopied === 'mitigation' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-slate-950" />
                              <span>{isEn ? 'Copied!' : '¡Copiado!'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-950" />
                              <span>{isEn ? 'Copy Response' : 'Copiar Respuesta'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-xs text-slate-400">
                        <strong className="text-amber-400">{isEn ? 'Reputation Shield Strategy: ' : 'Estrategia de Blindaje: '}</strong>
                        {activeAppealDossier.publicMitigationResponse.damageControlStrategy}
                      </p>

                      <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/30 text-xs text-slate-200 leading-relaxed font-sans">
                        «{activeAppealDossier.publicMitigationResponse.responseText}»
                      </div>
                    </div>

                    {/* Card 5: Recommended Evidence Pack */}
                    <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">
                          {isEn ? '5. Recommended Supporting Evidence to Attach' : '5. Pruebas de Soporte Recomendadas para Adjuntar'}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {activeAppealDossier.recommendedEvidence.map((ev: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-white truncate">{ev.item}</span>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                  ev.importance === 'Crítica'
                                    ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                                    : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                                }`}
                              >
                                {ev.importance}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-normal">{ev.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card 6: Advisor Sales Script & Closing */}
                    <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/40 space-y-3 shadow-xl">
                      <div className="flex items-center gap-2 pb-2 border-b border-indigo-500/30">
                        <Trophy className="w-4 h-4 text-indigo-400" />
                        <h4 className="text-xs font-black text-indigo-300 uppercase tracking-wider">
                          {isEn ? '6. Commercial Sales Script for Prestigia Advisor' : '6. Guion Comercial para el Asesor de Prestigia'}
                        </h4>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {isEn ? 'Client Presentation Pitch:' : 'Pitch de Presentación al Cliente:'}
                        </span>
                        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 italic leading-relaxed">
                          {activeAppealDossier.commercialScript.closingPitch}
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                          {isEn ? 'Objection Handling: "Do you guarantee Google will remove it 100%?"' : 'Manejo de la Objeción: "¿Y me garantizan que Google la borre sí o sí?"'}
                        </span>
                        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                          {activeAppealDossier.commercialScript.clientObjectionHandling}
                        </div>
                      </div>
                    </div>

                    {/* Card 7: Official Legal Disclaimer */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                        {isEn ? '🛡️ Prestigia Transparency & Legal Disclaimer' : '🛡️ Transparencia & Descargo de Responsabilidad Jurídica Prestigia'}
                      </span>
                      <p className="text-[10px] text-slate-500 leading-relaxed max-w-3xl mx-auto">
                        {activeAppealDossier.legalDisclaimer}
                      </p>
                    </div>

                    {/* Bottom Action: New Appeal */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 pb-2 print:hidden">
                      <button
                        type="button"
                        onClick={handleResetAppealForm}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black text-sm transition flex items-center gap-2 shadow-xl shadow-rose-500/25 cursor-pointer active:scale-95"
                      >
                        <Plus className="w-4 h-4 text-slate-950" />
                        <span>{isEn ? 'Appeal Another Review' : 'Apelar Otra Reseña'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =============================================================
            TAB: 4 ARMAS DE ÉLITE LOCAL SEO (GEO-GRID, ROI, GEOTAG, CITAS)
            ============================================================= */}
        {activeTab === 'tools' && (
          <div className="space-y-6 print:hidden">
            {/* Header intro */}
            <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-950/40 border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300">
                    {tTools.badge}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    {tTools.title}
                  </h1>
                  <p className="text-xs text-slate-300 max-w-2xl">
                    {tTools.desc}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                    {tTools.activeAlgo}
                  </span>
                </div>
              </div>
            </div>

            {/* If no listing is loaded or active, show the Activation Screen */}
            {!Boolean(toolsBusinessName.trim() || toolsScannedListing || isDemoMode) ? (
              <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-2xl">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-lg">
                  <Crosshair className="w-8 h-8" />
                </div>

                <div className="max-w-xl mx-auto space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {tTools.toolsEmptyTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {tTools.toolsEmptyDesc}
                  </p>
                </div>

                {/* Central 1-Click Search Input */}
                <div className="max-w-lg mx-auto space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={toolsSearchQuery}
                      onChange={(e) => setToolsSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isToolsScanning && toolsSearchQuery.trim()) {
                          e.preventDefault();
                          handleToolsScan();
                        }
                      }}
                      placeholder={tTools.toolsScannerPlaceholder}
                      className="w-full pl-4 pr-20 py-3.5 rounded-2xl bg-slate-950 border border-amber-500/40 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 text-xs sm:text-sm transition font-medium"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const text = await navigator.clipboard.readText();
                          if (text) setToolsSearchQuery(text.trim());
                        } catch {}
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-amber-400 transition cursor-pointer"
                    >
                      {t.pasteBtn}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToolsScan()}
                    disabled={isToolsScanning || !toolsSearchQuery.trim()}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer active:scale-98"
                  >
                    {isToolsScanning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{tTools.toolsScannerScanning}</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-slate-950" />
                        <span>{tTools.toolsEmptyScanBtn}</span>
                      </>
                    )}
                  </button>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDemoMode(true);
                        setToolsBusinessName('Negocio de Ejemplo');
                        setToolsCity('Bogotá');
                        setGeoGridKeyword(getDefaultKeywordByNiche(toolsCategory, 'Bogotá', isEn));
                      }}
                      className="text-xs text-slate-500 hover:text-amber-400 transition cursor-pointer underline underline-offset-4"
                    >
                      {tTools.toolsEmptyDemoBtn}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Active Listing Profile Card & Controls */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>{tTools.toolsDetectedBadge}</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{toolsCategory}</span>
                        {isDemoMode && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                            {isEn ? 'Demo Mode' : 'Modo Demostración'}
                          </span>
                        )}
                      </div>
                      <h3 className="font-black text-white text-sm">{toolsBusinessName || toolsScannedListing?.name}</h3>
                      {(toolsScannedListing?.address || toolsCity) && (
                        <p className="text-[11px] text-slate-400 truncate">{toolsScannedListing?.address || toolsCity}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right text-[11px] font-mono">
                        <span className="text-amber-400 font-black text-sm">★ {toolsScannedListing?.rating?.toFixed(1) || toolsExistingRating.toFixed(1)}</span>
                        <span className="text-slate-400 block">{toolsScannedListing?.reviewsCount || toolsExistingReviews} {isEn ? 'reviews' : 'reseñas'}</span>
                      </div>
                      {toolsScannedListing?.googleMapsUrl && (
                        <a
                          href={toolsScannedListing?.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition flex items-center gap-1 border border-slate-700 cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Google Maps</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setToolsBusinessName('');
                          setToolsCity('');
                          setToolsScannedListing(null);
                          setIsDemoMode(false);
                          setToolsSearchQuery('');
                          setGeoGridKeyword('');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition border border-rose-500/30 cursor-pointer"
                      >
                        {tTools.toolsChangeListing}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sub-tools Navigation */}
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => setToolsActiveTab('geogrid')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                  toolsActiveTab === 'geogrid'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>{tTools.tab1}</span>
              </button>

              <button
                type="button"
                onClick={() => setToolsActiveTab('roicalc')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                  toolsActiveTab === 'roicalc'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>{tTools.tab2}</span>
              </button>

              <button
                type="button"
                onClick={() => setToolsActiveTab('rivalspy')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                  toolsActiveTab === 'rivalspy'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{tTools.tab3}</span>
              </button>
            </div>

            {/* TOOL 1: SIMULADOR VISUAL GEO-GRID 3X3 */}
            {toolsActiveTab === 'geogrid' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <span>{tTools.geogridTitle}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {tTools.geogridDesc}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {(['1km', '3km', '5km'] as const).map((rad) => (
                      <button
                        key={rad}
                        type="button"
                        onClick={() => setGeoGridRadius(rad)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          geoGridRadius === rad
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                        }`}
                      >
                        {tTools.radiusLabel} {rad}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left: Interactive 3x3 Geo-Grid Heatmap */}
                  <div className="md:col-span-7 bg-slate-950 p-6 rounded-3xl border border-slate-800 relative">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800 text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        {tTools.satMap} ({toolsCity || (isEn ? 'Your City' : 'Tu Ciudad')})
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-400 font-bold text-[10px] shrink-0">{tTools.keyword}</span>
                        <input
                          type="text"
                          value={geoGridKeyword !== '' ? geoGridKeyword : getDefaultKeywordByNiche(toolsCategory, toolsCity, isEn)}
                          onChange={(e) => setGeoGridKeyword(e.target.value)}
                          placeholder={tTools.toolsKeywordPlaceholder}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-amber-500/40 text-amber-300 font-black text-xs focus:outline-none focus:border-amber-400 w-52 sm:w-64"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3.5 max-w-sm mx-auto aspect-square">
                      {[
                        { pin: 'P1', rank: geoGridRadius === '1km' ? 2 : 7, color: geoGridRadius === '1km' ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950', note: isEn ? 'Northwest' : 'Noroeste' },
                        { pin: 'P2', rank: geoGridRadius === '1km' ? 1 : 5, color: geoGridRadius === '1km' ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950', note: isEn ? 'North' : 'Norte' },
                        { pin: 'P3', rank: geoGridRadius === '5km' ? 14 : 9, color: 'bg-rose-600 text-white', note: isEn ? 'Northeast' : 'Noreste' },
                        { pin: 'P4', rank: geoGridRadius === '1km' ? 1 : 4, color: geoGridRadius === '1km' ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950', note: isEn ? 'West' : 'Oeste' },
                        { pin: 'CENTRO', rank: 1, color: 'bg-emerald-400 text-slate-950 ring-4 ring-emerald-500/30', note: isEn ? 'Main Location' : 'Sede Central' },
                        { pin: 'P6', rank: geoGridRadius === '5km' ? 16 : 8, color: 'bg-rose-600 text-white', note: isEn ? 'East' : 'Este' },
                        { pin: 'P7', rank: geoGridRadius === '5km' ? 18 : 11, color: 'bg-rose-600 text-white', note: isEn ? 'Southwest' : 'Suroeste' },
                        { pin: 'P8', rank: geoGridRadius === '1km' ? 3 : 8, color: geoGridRadius === '1km' ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950', note: isEn ? 'South' : 'Sur' },
                        { pin: 'P9', rank: geoGridRadius === '5km' ? 21 : 15, color: 'bg-rose-600 text-white', note: isEn ? 'Southeast' : 'Sureste' },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className={`rounded-2xl p-3 flex flex-col items-center justify-center font-black transition-all transform hover:scale-105 shadow-lg ${item.color}`}
                        >
                          <span className="text-[9px] opacity-75 uppercase">{item.note}</span>
                          <span className="text-2xl font-black">#{item.rank}</span>
                          <span className="text-[8px] font-bold uppercase">{item.rank <= 3 ? 'TOP 3' : (isEn ? 'DROPPED' : 'FUERA')}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-4 mt-5 text-[11px] font-bold">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>{tTools.legendTop3}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-rose-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                        <span>{tTools.legendDropped}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Pitch Breakdown */}
                  <div className="md:col-span-5 space-y-4 text-xs">
                    <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                        {tTools.diagAdvisor}
                      </span>
                      <p className="text-slate-200 leading-relaxed text-xs">
                        {tTools.diagAdvisorBody(
                          toolsBusinessName,
                          geoGridRadius,
                          geoGridKeyword !== '' ? geoGridKeyword : getDefaultKeywordByNiche(toolsCategory, toolsCity, isEn)
                        )}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                        {tTools.solutionPrestigia}
                      </span>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        {tTools.solutionPrestigiaBody}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TOOL 2: CALCULADORA DE PÉRDIDA FINANCIERA (ROI CALCULATOR) */}
            {toolsActiveTab === 'roicalc' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-emerald-400" />
                    <span>{tTools.roiTitle}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {tTools.roiDesc}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <label className="block font-bold text-slate-300">{tTools.avgTicket}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-emerald-400 font-bold">$</span>
                      <input
                        type="number"
                        value={roiAverageTicket}
                        onChange={(e) => setRoiAverageTicket(Number(e.target.value) || 0)}
                        className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 font-black text-base focus:outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 block leading-tight">{tTools.avgTicketSub}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <label className="block font-bold text-slate-300">{tTools.avgFrequency}</label>
                    <select
                      value={roiCustomerFrequency}
                      onChange={(e) => setRoiCustomerFrequency(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs focus:outline-none"
                    >
                      <option value="1">{tTools.freqOpt1}</option>
                      <option value="3">{tTools.freqOpt2}</option>
                      <option value="6">{tTools.freqOpt3}</option>
                      <option value="12">{tTools.freqOpt4}</option>
                    </select>
                    <span className="text-[10px] text-slate-500 block leading-tight">{tTools.avgFrequencySub}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <label className="block font-bold text-slate-300">{tTools.currentRank}</label>
                    <select
                      value={roiCurrentRank}
                      onChange={(e) => setRoiCurrentRank(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs focus:outline-none"
                    >
                      <option value="4">{tTools.rankOpt1}</option>
                      <option value="8">{tTools.rankOpt2}</option>
                      <option value="15">{tTools.rankOpt3}</option>
                    </select>
                    <span className="text-[10px] text-slate-500 block leading-tight">{tTools.currentRankSub}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <label className="block font-bold text-slate-300">{tTools.searches}</label>
                    <input
                      type="number"
                      value={roiMonthlySearches}
                      onChange={(e) => setRoiMonthlySearches(Number(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-black text-base focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 block leading-tight">{tTools.searchesSub}</span>
                  </div>
                </div>

                {/* Calculation Output: Dual-Balance Matrix (Fuga Actual vs Beneficio con Prestigia) */}
                {(() => {
                  // 1. Pérdida / Fuga sin Prestigia
                  const lossRate = roiCurrentRank > 10 ? 0.85 : roiCurrentRank > 5 ? 0.60 : 0.35;
                  const lostClicks = Math.round(roiMonthlySearches * lossRate);
                  const lostClients = Math.max(1, Math.round(lostClicks * 0.20));
                  const monthlyLoss = lostClients * roiAverageTicket;
                  const yearlyLoss = monthlyLoss * 12;
                  const yearlyLtvLoss = lostClients * (roiAverageTicket * roiCustomerFrequency) * 12;

                  // 2. Ganancia con Prestigia (Al ingresar al Top 3)
                  const gainRate = 0.45;
                  const gainedClicks = Math.round(roiMonthlySearches * gainRate);
                  const gainedClients = Math.max(1, Math.round(gainedClicks * 0.20));
                  const monthlyGain = gainedClients * roiAverageTicket;
                  const yearlyGain = monthlyGain * 12;
                  const yearlyLtvGain = gainedClients * (roiAverageTicket * roiCustomerFrequency) * 12;

                  // 3. Balance Neto Comercial & Amortización
                  const totalAnnualAdvantage = yearlyLoss + yearlyGain;
                  const totalAnnualLtvAdvantage = yearlyLtvLoss + yearlyLtvGain;
                  const estimatedPrestigiaFee = 200;
                  const breakEvenClients = Math.max(1, Math.ceil(estimatedPrestigiaFee / (roiAverageTicket || 1)));

                  return (
                    <div className="space-y-4">
                      {/* 2-Column High Contrast Matrix */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* CARD 1: Fuga de Facturación (Rojo) */}
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-950/70 via-slate-950 to-slate-900 border-2 border-rose-500/50 space-y-4 shadow-xl">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-rose-300 bg-rose-950 px-2.5 py-0.5 rounded-full border border-rose-500/40">
                                <TrendingDown className="w-3 h-3 text-rose-400" />
                                {tTools.leakDetected}
                              </span>
                              <h4 className="text-sm font-bold text-slate-200 mt-2">
                                {tTools.leakHeading}
                              </h4>
                            </div>
                            <div className="text-right">
                              <span className="text-3xl font-black text-rose-400 block tracking-tight">
                                -${monthlyLoss.toLocaleString()} USD
                              </span>
                              <span className="text-[11px] text-slate-400 font-bold block">{tTools.lostPer30Days}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-rose-500/20 text-xs">
                            <div className="p-3 rounded-xl bg-slate-900/90 border border-rose-900/40">
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">{tTools.lostCalls}</span>
                              <strong className="text-sm font-black text-white">~{lostClicks.toLocaleString()} {tTools.searchesPerMonth}</strong>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900/90 border border-rose-900/40">
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">{tTools.lostClientsLabel}</span>
                              <strong className="text-sm font-black text-rose-300">~{lostClients.toLocaleString()} {tTools.newClientsPerMonth}</strong>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900/90 border border-rose-900/40 col-span-2 sm:col-span-1">
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">{tTools.loss12Months}</span>
                              <strong className="text-sm font-black text-rose-400">-${yearlyLoss.toLocaleString()} USD/{isEn ? 'yr' : 'año'}</strong>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900/90 border border-rose-900/40 col-span-2 sm:col-span-1">
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">{tTools.lossLtv12Months}</span>
                              <strong className="text-sm font-black text-rose-300">-${yearlyLtvLoss.toLocaleString()} USD/{isEn ? 'yr' : 'año'}</strong>
                            </div>
                          </div>
                        </div>

                        {/* CARD 2: Expansión Comercial con Prestigia (Verde Esmeralda) */}
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/70 via-slate-950 to-slate-900 border-2 border-emerald-500/50 space-y-4 shadow-xl">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                                <TrendingUp className="w-3 h-3 text-emerald-400" />
                                {tTools.gainDetected}
                              </span>
                              <h4 className="text-sm font-bold text-slate-200 mt-2">
                                {tTools.gainHeading}
                              </h4>
                            </div>
                            <div className="text-right">
                              <span className="text-3xl font-black text-emerald-400 block tracking-tight">
                                +${monthlyGain.toLocaleString()} USD
                              </span>
                              <span className="text-[11px] text-slate-400 font-bold block">{tTools.gainPer30Days}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-emerald-500/20 text-xs">
                            <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-900/40">
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">{tTools.gainCalls}</span>
                              <strong className="text-sm font-black text-white">~{gainedClicks.toLocaleString()} {tTools.searchesPerMonth}</strong>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-900/40">
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">{tTools.gainClientsLabel}</span>
                              <strong className="text-sm font-black text-emerald-300">+{gainedClients.toLocaleString()} {tTools.gainNewClientsPerMonth}</strong>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-900/40 col-span-2 sm:col-span-1">
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">{tTools.gain12Months}</span>
                              <strong className="text-sm font-black text-emerald-400">+${yearlyGain.toLocaleString()} USD/{isEn ? 'yr' : 'año'}</strong>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-900/40 col-span-2 sm:col-span-1">
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">{tTools.gainLtv12Months}</span>
                              <strong className="text-sm font-black text-emerald-300">+${yearlyLtvGain.toLocaleString()} USD/{isEn ? 'yr' : 'año'}</strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* BANNER UNIFICADO: Balance Neto Comercial & Cierre del Asesor */}
                      <div className="p-5 rounded-3xl bg-slate-950 border border-amber-500/40 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                              {tTools.netImpactBadge}
                            </span>
                            <p className="text-xs text-slate-300 mt-1">
                              {tTools.breakEvenText(breakEvenClients)}
                            </p>
                          </div>
                          <div className="text-left sm:text-right shrink-0">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">{tTools.netImpactTotalAnnual}</span>
                            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300">
                              +${totalAnnualAdvantage.toLocaleString()} USD/{isEn ? 'yr' : 'año'}
                            </span>
                            {roiCustomerFrequency > 1 && (
                              <span className="text-[10px] text-slate-400 block font-medium">
                                (Hasta +${totalAnnualLtvAdvantage.toLocaleString()} USD/año con fidelización LTV)
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-900/90 border border-amber-500/20 text-xs text-amber-100/90 leading-relaxed">
                          <strong className="text-amber-400 block mb-1 font-black flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            {tTools.advisorClose}
                          </strong>
                          {tTools.advisorCloseBody(toolsBusinessName, monthlyLoss, monthlyGain, breakEvenClients)}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TOOL 3: RIVAL SPY - RADAR DE ESPIONAJE CARA A CARA */}
            {toolsActiveTab === 'rivalspy' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <span>{tTools.spyTitle}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {tTools.spyDesc}
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase text-rose-300 bg-rose-950 px-2.5 py-1 rounded-full border border-rose-500/40">
                    {isEn ? '⚔️ Head-to-Head Battle' : '⚔️ Batalla Cara a Cara'}
                  </span>
                </div>

                {/* Dual Business Setup (Client vs Competitor) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Left: Your Client (Bloqueado & Sincronizado de Ficha Activa) */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                          {tTools.spyClientCol}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        <Lock className="w-2.5 h-2.5 text-emerald-400" />
                        <span>{isEn ? 'Verified Listing (Locked)' : 'Ficha Verificada (Bloqueada)'}</span>
                      </span>
                    </div>

                    {/* Auto-synced Listing Status Banner */}
                    <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2.5 text-xs">
                      <div className="w-8 h-8 rounded-lg bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <strong className="text-white text-[11px] block truncate">
                          {toolsBusinessName || (isEn ? 'Active Client Profile' : 'Ficha Activa del Cliente')}
                        </strong>
                        <span className="text-[10px] text-emerald-300/80 block">
                          {toolsCity ? `${toolsCity} • ` : ''}{isEn ? 'Data auto-synced from Google Maps' : 'Datos sincronizados de Google Maps'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">
                          {isEn ? 'Client Business Name' : 'Nombre del Posible Cliente'}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={toolsBusinessName}
                            readOnly
                            className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-emerald-300 font-bold text-xs cursor-not-allowed select-none focus:outline-none"
                          />
                          <Lock className="w-3.5 h-3.5 text-emerald-500/60 absolute right-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">
                            {tTools.spyMetricRating}
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={`${toolsExistingRating} ★`}
                              readOnly
                              className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-amber-300 font-black text-xs cursor-not-allowed select-none focus:outline-none"
                            />
                            <Lock className="w-3.5 h-3.5 text-emerald-500/60 absolute right-3 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">
                            {tTools.spyMetricReviews}
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={`${toolsExistingReviews.toLocaleString()} ${isEn ? 'reviews' : 'opiniones'}`}
                              readOnly
                              className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-white font-black text-xs cursor-not-allowed select-none focus:outline-none"
                            />
                            <Lock className="w-3.5 h-3.5 text-emerald-500/60 absolute right-3 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">
                            {tTools.spyMetricWeekly}
                          </label>
                          <div className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 font-bold text-xs flex items-center justify-between">
                            <span>+1 / sem</span>
                            <span className="text-[9px] text-slate-500 font-normal">{isEn ? 'Organic' : 'Orgánico'}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">
                            {tTools.spyMetricPhotos}
                          </label>
                          <div className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 font-bold text-xs flex items-center justify-between">
                            <span>14 {isEn ? 'photos' : 'fotos'}</span>
                            <span className="text-[9px] text-slate-500 font-normal">{isEn ? 'Current' : 'Actuales'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: The Target Rival */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-rose-500/40 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider">
                        {tTools.spyRivalCol}
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/30">
                        {isEn ? 'Current #1 in Maps' : 'Actual #1 en Maps'}
                      </span>
                    </div>

                    {/* 1-Click Google Maps Competitor Scanner */}
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-rose-500/30 space-y-1.5">
                      <label className="block text-[10px] font-bold text-rose-300 flex items-center justify-between">
                        <span>{tTools.rivalScannerLabel}</span>
                        {rivalSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setRivalSearchQuery('')}
                            className="text-[9px] text-slate-400 hover:text-rose-400 transition cursor-pointer"
                          >
                            {isEn ? 'Clear' : 'Limpiar'}
                          </button>
                        )}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={rivalSearchQuery}
                          onChange={(e) => setRivalSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !isRivalScanning && rivalSearchQuery.trim()) {
                              e.preventDefault();
                              handleRivalScan();
                            }
                          }}
                          placeholder={tTools.rivalScannerPlaceholder}
                          className="w-full pl-2.5 pr-16 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-400 text-[11px]"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const text = await navigator.clipboard.readText();
                              if (text) setRivalSearchQuery(text.trim());
                            } catch {}
                          }}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-slate-800 text-[9px] font-bold text-rose-400 hover:bg-slate-700 transition cursor-pointer"
                        >
                          {t.pasteBtn}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={handleRivalScan}
                        disabled={isRivalScanning || !rivalSearchQuery.trim()}
                        className="w-full py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-[11px] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        {isRivalScanning ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>{tTools.rivalScannerScanning}</span>
                          </>
                        ) : (
                          <>
                            <Search className="w-3 h-3" />
                            <span>{tTools.rivalScannerBtn}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">
                          {isEn ? 'Rival Name' : 'Nombre del Rival'}
                        </label>
                        <input
                          type="text"
                          value={rivalName}
                          onChange={(e) => setRivalName(e.target.value)}
                          placeholder={tTools.spyRivalPlaceholder}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-rose-200 font-bold text-xs focus:outline-none focus:border-rose-400"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">
                            {tTools.spyMetricRating}
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="1"
                            max="5"
                            value={rivalRating}
                            onChange={(e) => setRivalRating(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-black text-xs focus:outline-none focus:border-rose-400"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">
                            {tTools.spyMetricReviews}
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={rivalReviews}
                            onChange={(e) => setRivalReviews(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-black text-xs focus:outline-none focus:border-rose-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">
                            {tTools.spyMetricWeekly}
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={rivalWeeklyPace}
                            onChange={(e) => setRivalWeeklyPace(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-rose-300 font-black text-xs focus:outline-none focus:border-rose-400"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">
                            {tTools.spyMetricPhotos}
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={rivalPhotos}
                            onChange={(e) => setRivalPhotos(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-black text-xs focus:outline-none focus:border-rose-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Head-to-Head Comparison & Algorithm Metrics */}
                {(() => {
                  const clientReviews = toolsExistingReviews || 0;
                  const isClientHigherInReviews = clientReviews >= rivalReviews;
                  const absReviewGap = Math.abs(rivalReviews - clientReviews);
                  const photoGap = Math.max(0, rivalPhotos - 14);
                  const clientWeekly = 1;
                  const rivalWeekly = rivalWeeklyPace || 3;
                  const prestigiaWeekly = 8;
                  const netWeeklyAdvantage = Math.max(1, prestigiaWeekly - rivalWeekly);
                  const weeksToSurpass = isClientHigherInReviews
                    ? 4
                    : Math.max(3, Math.ceil(absReviewGap / netWeeklyAdvantage));
                  const organicYearsToOvertake = Math.max(1, Math.round((absReviewGap / 52) * 10) / 10);

                  return (
                    <div className="space-y-4">
                      {/* 1. AGGRESSIVE DIAGNOSTIC BANNER */}
                      {isClientHigherInReviews ? (
                        <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/70 via-slate-950 to-slate-900 border-2 border-amber-500/60 space-y-3 shadow-xl">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-amber-500/20">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                                <AlertTriangle className="w-4 h-4 text-amber-400" />
                              </span>
                              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                                {isEn ? '⚠️ 2026 ALGORITHMIC PARADOX DETECTED' : '🚨 PARADOJA ALGORÍTMICA DE GOOGLE 2026 DETECTADA'}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-amber-300">
                              {isEn ? 'Rival dominates Top 3 with FEWER reviews' : `El rival domina el Top 3 teniendo ${Math.max(2, Math.round(clientReviews / Math.max(1, rivalReviews)))}x MENOS reseñas`}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <h4 className="text-base font-black text-white">
                              {isEn 
                                ? `You have ${clientReviews.toLocaleString()} reviews vs. ${rivalReviews} from ${rivalName || 'your rival'}, yet they are taking your Top 3 clients.` 
                                : `Tienes ${clientReviews.toLocaleString()} reseñas vs. ${rivalReviews} de ${rivalName || 'tu rival'}, y aun así ellos se quedan con los clientes del Top 3.`}
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {isEn
                                ? `Why does this happen? Google's 2026 local algorithm penalizes stagnant listings. Your ${clientReviews.toLocaleString()} reviews are historical, but today your profile receives only +1 review/week. Meanwhile, ${rivalName || 'your competitor'} has active weekly momentum (+${rivalWeekly}/wk) and +${photoGap} more photos. To Google's AI, your business is asleep.`
                                : `¿Por qué ocurre esto? El Algoritmo 2026 de Google castiga fichas dormidas. Tus ${clientReviews.toLocaleString()} reseñas son del pasado, pero hoy tu ficha recibe apenas +1 reseña/semana. Tu rival mantiene actividad constante (+${rivalWeekly}/sem) y te supera en fotos (+${photoGap} fotos). Para la IA de Google, tu negocio está estancado.`}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950/70 via-slate-950 to-slate-900 border-2 border-rose-500/60 space-y-3 shadow-xl">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-rose-500/20">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                                <Flame className="w-4 h-4 text-rose-400" />
                              </span>
                              <span className="text-[10px] font-black uppercase tracking-wider text-rose-300 bg-rose-950 px-2.5 py-0.5 rounded-full border border-rose-500/40">
                                {isEn ? '⚔️ CRITICAL COMPETITIVE THREAT' : '⚔️ ALERTA DE AMENAZA COMPETITIVA DIRECTA'}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-rose-300">
                              {isEn ? `Rival leads by +${absReviewGap.toLocaleString()} reviews` : `El rival te supera por +${absReviewGap.toLocaleString()} reseñas`}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <h4 className="text-base font-black text-white">
                              {isEn
                                ? `${rivalName || 'Your Competitor'} leads by +${absReviewGap.toLocaleString()} reviews and captures 70% of local searches.`
                                : `${rivalName || 'Tu Competidor'} te lleva +${absReviewGap.toLocaleString()} reseñas de ventaja y acapara el 70% de las llamadas de la zona.`}
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {isEn
                                ? `At your current organic pace of +1 review/week, it would take you ${organicYearsToOvertake} YEARS to catch them. With Prestigia Software 5★ (+8/wk), you break their lead and dethrone them in just ${weeksToSurpass} weeks.`
                                : `A tu velocidad orgánica actual de +1 reseña/semana, tardarías ${organicYearsToOvertake} AÑOS en alcanzarlos por tu cuenta. Con Prestigia Software 5★ (+8/sem), quiebras su ventaja y los destronas en solo ${weeksToSurpass} semanas.`}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* 2. FOUR HIGH-IMPACT METRIC CARDS */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                            {isClientHigherInReviews ? (isEn ? 'Historical Lead' : 'Ventaja Histórica') : (isEn ? 'Review Gap' : 'Brecha de Reseñas')}
                          </span>
                          <strong className={`text-xl font-black ${isClientHigherInReviews ? 'text-amber-400' : 'text-rose-400'}`}>
                            {isClientHigherInReviews ? `+${absReviewGap.toLocaleString()}` : `-${absReviewGap.toLocaleString()}`}
                          </strong>
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            {isClientHigherInReviews ? (isEn ? 'wasted without velocity' : 'desperdiciada sin velocidad') : (isEn ? 'in favor of rival' : 'a favor del rival')}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                            {isEn ? 'Current Organic Pace' : 'Velocidad Sin Prestigia'}
                          </span>
                          <strong className="text-xl font-black text-rose-400">
                            +1 / sem
                          </strong>
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            {isEn ? `vs +${rivalWeekly} rival pace` : `vs +${rivalWeekly} del rival (en riesgo)`}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/40 bg-emerald-950/20">
                          <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">
                            {isEn ? 'Prestigia Software Pace' : 'Velocidad con Prestigia'}
                          </span>
                          <strong className="text-xl font-black text-emerald-400">
                            +8 / sem
                          </strong>
                          <span className="text-[10px] text-emerald-300/80 block mt-0.5">
                            {isEn ? '+800% acceleration' : '+800% aceleración algorítmica'}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/40 bg-amber-950/20">
                          <span className="text-[10px] text-amber-400 uppercase font-bold block mb-1">
                            {isClientHigherInReviews ? (isEn ? 'Time to Reclaim #1' : 'Tiempo para Recuperar #1') : (isEn ? 'Time to Dethrone' : 'Tiempo para Destronar')}
                          </span>
                          <strong className="text-xl font-black text-amber-400">
                            {weeksToSurpass} {isEn ? 'weeks' : 'semanas'}
                          </strong>
                          <span className="text-[10px] text-amber-300/80 block mt-0.5">
                            {isClientHigherInReviews 
                              ? (isEn ? 'freshness reactivation' : 'reactivación de frescura') 
                              : (isEn ? `vs ${organicYearsToOvertake} yrs organic` : `vs ${organicYearsToOvertake} años orgánicos`)}
                          </span>
                        </div>
                      </div>

                      {/* 3. HEAD-TO-HEAD BATTLE MATRIX (5 CRITICAL FACTORS) */}
                      <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-amber-400" />
                            <h4 className="font-black text-white text-sm">
                              {isEn ? 'Head-to-Head Algorithmic Battle Matrix' : 'Matriz de Combate Algorítmico: Cara a Cara'}
                            </h4>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            {isEn ? 'Google Maps 2026 Factors' : 'Factores Clave Google Maps 2026'}
                          </span>
                        </div>

                        <div className="space-y-2 text-xs">
                          {/* Factor 1: Velocidad Semanal */}
                          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-2.5 items-center">
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">{isEn ? '1. Velocity & Freshness' : '1. Velocidad & Frescura'}</span>
                              <strong className="text-white text-xs">{isEn ? 'Algorithm Impact' : 'Impacto en el Algoritmo'}</strong>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-950 border border-rose-500/30">
                              <span className="text-[10px] text-rose-400 block font-bold">{isEn ? 'Your Business Today:' : 'Tu Negocio Hoy:'}</span>
                              <span className="text-slate-300 font-medium">{isEn ? '+1 review/week (Stagnant)' : '+1 reseña/semana (Dormida)'}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-950 border border-emerald-500/40">
                              <span className="text-[10px] text-emerald-400 block font-bold">{isEn ? 'With Prestigia 5★ Software:' : 'Con Prestigia Software 5★:'}</span>
                              <span className="text-emerald-300 font-bold">{isEn ? '+8 to +12 5★ reviews/wk' : '+8 a +12 reseñas 5★/sem'}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-950 border border-slate-700">
                              <span className="text-[10px] text-slate-400 block font-bold">{rivalName || (isEn ? 'Your Rival' : 'Tu Rival')}:</span>
                              <span className="text-slate-300">+{rivalWeekly} {isEn ? 'reviews/wk' : 'reseñas/sem'}</span>
                            </div>
                          </div>

                          {/* Factor 2: Galería de Fotos */}
                          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-2.5 items-center">
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">{isEn ? '2. Visual Arsenal (Photos)' : '2. Arsenal Visual (Fotos)'}</span>
                              <strong className="text-white text-xs">{isEn ? 'Trust & Google Lens' : 'Confianza & Google Lens'}</strong>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-950 border border-rose-500/30">
                              <span className="text-[10px] text-rose-400 block font-bold">{isEn ? 'Your Business Today:' : 'Tu Negocio Hoy:'}</span>
                              <span className="text-slate-300 font-medium">{isEn ? '14 photos (Critical deficit)' : '14 fotos (Déficit crítico)'}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-950 border border-emerald-500/40">
                              <span className="text-[10px] text-emerald-400 block font-bold">{isEn ? 'With Prestigia:' : 'Con Prestigia:'}</span>
                              <span className="text-emerald-300 font-bold">{isEn ? '50+ geotagged photos' : '50+ fotos geolocalizadas'}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-950 border border-slate-700">
                              <span className="text-[10px] text-slate-400 block font-bold">{rivalName || (isEn ? 'Your Rival' : 'Tu Rival')}:</span>
                              <span className="text-slate-300">{rivalPhotos} {isEn ? 'photos' : 'fotos'}</span>
                            </div>
                          </div>

                          {/* Factor 3: Palabras Clave en Reseñas */}
                          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-2.5 items-center">
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">{isEn ? '3. SEO Keywords' : '3. Palabras Clave SEO'}</span>
                              <strong className="text-white text-xs">{isEn ? 'Term Indexation' : 'Indexación por Términos'}</strong>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-950 border border-rose-500/30">
                              <span className="text-[10px] text-rose-400 block font-bold">{isEn ? 'Your Business Today:' : 'Tu Negocio Hoy:'}</span>
                              <span className="text-slate-300 font-medium">{isEn ? 'Generic ("tasty", "good")' : 'Genéricas ("rico", "bueno")'}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-950 border border-emerald-500/40">
                              <span className="text-[10px] text-emerald-400 block font-bold">{isEn ? 'With Prestigia:' : 'Con Prestigia:'}</span>
                              <span className="text-emerald-300 font-bold">{isEn ? 'Guided with buyer intent keywords' : 'Guiadas con palabras de compra'}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-950 border border-slate-700">
                              <span className="text-[10px] text-slate-400 block font-bold">{rivalName || (isEn ? 'Your Rival' : 'Tu Rival')}:</span>
                              <span className="text-slate-300">{isEn ? 'Unguided organic' : 'Orgánicas sin guiar'}</span>
                            </div>
                          </div>

                          {/* Factor 4: Filtro de Reseñas Negativas */}
                          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-2.5 items-center">
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">{isEn ? '4. Reputation Shield' : '4. Blindaje de Reputación'}</span>
                              <strong className="text-white text-xs">{isEn ? 'Anti-Negative Filter' : 'Filtro Anti-Negativas'}</strong>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-950 border border-rose-500/30">
                              <span className="text-[10px] text-rose-400 block font-bold">{isEn ? 'Your Business Today:' : 'Tu Negocio Hoy:'}</span>
                              <span className="text-slate-300 font-medium">{isEn ? 'Go straight to Google Maps' : 'Van directo a Google Maps'}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-950 border border-emerald-500/40">
                              <span className="text-[10px] text-emerald-400 block font-bold">{isEn ? 'With Prestigia:' : 'Con Prestigia:'}</span>
                              <span className="text-emerald-300 font-bold">{isEn ? 'Private redirect to WhatsApp' : 'Desvío privado a WhatsApp'}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-slate-950 border border-slate-700">
                              <span className="text-[10px] text-slate-400 block font-bold">{rivalName || (isEn ? 'Your Rival' : 'Tu Rival')}:</span>
                              <span className="text-slate-300">{isEn ? 'No review protection' : 'Sin protección de reseñas'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 4. TACTICAL ATTACK PLAN */}
                      <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-900 border border-indigo-500/40 space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <h4 className="font-black text-white text-sm">
                            {tTools.spyAttackPlan}
                          </h4>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                            <span className="font-black text-emerald-400">1.</span>
                            <span className="text-slate-300">
                              {isEn ? <><strong>Intelligent Review System Activation:</strong> We inject +8 to +12 5★ reviews per week via Smart QR codes and WhatsApp automation to break your competitor's lead.</> : <><strong>Activación del Sistema Inteligente de Reseñas Digitales:</strong> Inyectamos de +8 a +12 reseñas 5★ por semana mediante códigos QR inteligentes y automatización WhatsApp para quebrar la ventaja del competidor.</>}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                            <span className="font-black text-amber-400">2.</span>
                            <span className="text-slate-300">
                              {isEn ? <><strong>Upload of 35+ Geotagged Photos with EXIF Attributes:</strong> We nullify the visual gap by uploading dishes, facilities, and services optimized for Google Lens indexing.</> : <><strong>Carga de 35+ Fotos Geolocalizadas con Atributos:</strong> Anulamos el déficit visual subiendo platos, instalaciones y servicios optimizados para Google Lens.</>}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                            <span className="font-black text-indigo-400">3.</span>
                            <span className="text-slate-300">
                              {isEn ? <><strong>Reputation Shield & AI Review Response:</strong> We route dissatisfied customers to internal private support and reply to every review via AI within 2 hours to cement the #1 podium spot.</> : <><strong>Blindaje Anti-Reseñas Negativas & Respuestas con IA:</strong> Filtramos clientes insatisfechos a soporte interno y respondemos todas las opiniones con IA en menos de 2 horas para sellar el podio #1.</>}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 5. AGGRESSIVE ADVISOR CLOSING PITCH */}
                      <div className="p-5 rounded-3xl bg-slate-950 border-2 border-amber-500/50 space-y-3 shadow-xl">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            {tTools.spyPitchBox}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(
                                tTools.spyPitchText(toolsBusinessName, rivalName, weeksToSurpass, clientReviews, rivalReviews),
                                isEn ? 'Closing Pitch' : 'Argumento de Cierre'
                              )
                            }
                            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/30 transition"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{tTools.spyBtnCopyPitch}</span>
                          </button>
                        </div>
                        <p className="text-xs text-amber-100/90 italic leading-relaxed bg-slate-900/80 p-3.5 rounded-2xl border border-amber-500/20">
                          {tTools.spyPitchText(toolsBusinessName, rivalName, weeksToSurpass, clientReviews, rivalReviews)}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
            </>
          )}
          </div>
        )}
        {activeTab === 'dossiers' && (
          <div className="space-y-6 print:hidden">
            {/* Header & Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300">
                    {tDossiers.privateBadge}
                  </span>
                  <span className="text-xs text-slate-500">{tDossiers.accountOwner}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {tDossiers.title}
                </h1>
                <p className="text-xs text-slate-400">
                  {tDossiers.desc}
                </p>
              </div>

              <div className="w-full sm:w-80 relative">
                <input
                  type="text"
                  value={dossierSearch}
                  onChange={(e) => setDossierSearch(e.target.value)}
                  placeholder={tDossiers.searchPlaceholder}
                  className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            {/* Strategic Pricing Benchmark Reference Callout */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 text-xs text-slate-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-black text-amber-300 text-xs uppercase tracking-wide block">
                    {isEn ? 'Official Agency Pricing Benchmarks & Prestigia Closing Strategy' : 'Baremos Reales de Mercado de Agencias & Estrategia de Cierre Prestigia'}
                  </span>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {isEn ? (
                      <><strong>Creation:</strong> $150–$250 USD (3–5h) • <strong>Top 3 Audit:</strong> $200–$350 USD (4–6h) • <strong>72h Rescue:</strong> $250–$450 USD (5–8h) • <strong>Prestigia Plans:</strong> 100% custom-tailored per client (Technical Setup $0 waived).</>
                    ) : (
                      <><strong>Creación:</strong> $150–$250 USD (3–5h) • <strong>Auditoría Top 3:</strong> $200–$350 USD (4–6h) • <strong>Rescate 72h:</strong> $250–$450 USD (5–8h) • <strong>Planes Prestigia:</strong> 100% a la medida de cada cliente (Setup Técnico $0 bonificado).</>
                    )}
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-black text-emerald-300">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isEn ? 'Strategy: Setup $0 Waived with Prestigia Plan' : 'Estrategia: Setup $0 Bonificado con Plan Prestigia'}</span>
                </span>
              </div>
            </div>

            {/* Executive KPI Summary Cards (Real totals computed over all Luisma base clients) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 shadow-md">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">{tDossiers.kpiDossiers}</span>
                  <strong className="text-lg font-black text-white">{luismaBaseDossiers.length}</strong>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 shadow-md">
                <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">{tDossiers.kpiCreated}</span>
                  <strong className="text-lg font-black text-emerald-400">
                    {luismaBaseDossiers.filter((d) => d.mode === 'create').length}
                  </strong>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 shadow-md">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">{tDossiers.kpiAudited}</span>
                  <strong className="text-lg font-black text-indigo-300">
                    {luismaBaseDossiers.filter((d) => d.mode === 'audit').length}
                  </strong>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 shadow-md">
                <div className="w-9 h-9 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">{tDossiers.kpiRescued}</span>
                  <strong className="text-lg font-black text-amber-300">
                    {luismaBaseDossiers.filter((d) => d.mode === 'rescue').length}
                  </strong>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 shadow-md">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">{tDossiers.kpiMrr}</span>
                  <strong className="text-lg font-black text-emerald-300">
                    ${totalLuismaMrr}<span className="text-[10px] font-normal text-slate-400">/mes</span>
                  </strong>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 shadow-md">
                <div className="w-9 h-9 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">{tDossiers.kpiRevenue}</span>
                  <strong className="text-lg font-black text-cyan-300">
                    ${totalLuismaSetupRevenue}
                  </strong>
                </div>
              </div>
            </div>

            {/* Multi-Level Search & Filters Bar (País, Ciudad, Localidad/Barrio, Cierre Comercial) */}
            <div className="space-y-3 bg-slate-900/70 p-4 rounded-3xl border border-slate-800 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Service Mode Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-400 text-[11px] font-bold">{tDossiers.filterBy}</span>
                  <button
                    type="button"
                    onClick={() => setDossierModeFilter('all')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                      dossierModeFilter === 'all'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {tDossiers.filterAll} ({luismaBaseDossiers.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDossierModeFilter('create')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                      dossierModeFilter === 'create'
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {tDossiers.filterCreate} ({luismaBaseDossiers.filter((d) => d.mode === 'create').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDossierModeFilter('audit')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                      dossierModeFilter === 'audit'
                        ? 'bg-indigo-600 text-white font-black'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {tDossiers.filterAudit} ({luismaBaseDossiers.filter((d) => d.mode === 'audit').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDossierModeFilter('rescue')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                      dossierModeFilter === 'rescue'
                        ? 'bg-amber-600 text-white font-black'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {tDossiers.filterRescue} ({luismaBaseDossiers.filter((d) => d.mode === 'rescue').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDossierModeFilter('appeal')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                      dossierModeFilter === 'appeal'
                        ? 'bg-rose-500 text-slate-950 font-black'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {tDossiers.filterAppeal} ({luismaBaseDossiers.filter((d) => d.mode === 'appeal').length})
                  </button>
                </div>

                {/* Filter Active indicator & Reset button */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Mostrando <strong>{myDossiers.length}</strong> de <strong>{luismaBaseDossiers.length}</strong> clientes
                  </span>
                  {(dossierSearch ||
                    dossierModeFilter !== 'all' ||
                    dossierCountryFilter !== 'all' ||
                    dossierCityFilter !== 'all' ||
                    dossierNeighborhoodFilter !== 'all' ||
                    dossierClosingFilter !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setDossierSearch('');
                        setDossierModeFilter('all');
                        setDossierCountryFilter('all');
                        setDossierCityFilter('all');
                        setDossierNeighborhoodFilter('all');
                        setDossierClosingFilter('all');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{isEn ? 'Clear Filters' : 'Limpiar Filtros'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Location & Commercial Closing Dropdowns - Filtros Jerárquicos en Cascada */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-xs">
                {/* 1º Filtro: País */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                      <Globe className="w-3 h-3 text-amber-400" />
                      <span>1º {tDossiers.filterCountry}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddCountryModal(true)}
                      className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center gap-1 border border-amber-500/30 transition cursor-pointer"
                      title="Registrar nuevo País"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>País</span>
                    </button>
                  </div>
                  <select
                    value={dossierCountryFilter}
                    onChange={(e) => {
                      setDossierCountryFilter(e.target.value);
                      setDossierCityFilter('all');
                      setDossierNeighborhoodFilter('all');
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400 transition cursor-pointer"
                  >
                    <option value="all">{isEn ? `🌐 All Countries (${dossierAvailableCountries.length})` : `🌐 Todos los Países (${dossierAvailableCountries.length})`}</option>
                    {dossierAvailableCountries.map((c) => {
                      const count = luismaBaseDossiers.filter((d) => (d.country || 'Colombia') === c).length;
                      return (
                        <option key={c} value={c}>
                          {c} {count > 0 ? `(${count} clientes)` : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* 2º Filtro: Ciudad Condicionada al País */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-amber-400" />
                      <span>2º {tDossiers.filterCity}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetCountryForNewCity(dossierCountryFilter !== 'all' ? dossierCountryFilter : 'Colombia');
                        setShowAddCityModal(true);
                      }}
                      className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center gap-1 border border-amber-500/30 transition cursor-pointer"
                      title="Registrar nueva Ciudad"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>Ciudad</span>
                    </button>
                  </div>
                  <select
                    value={dossierCityFilter}
                    disabled={dossierCountryFilter === 'all'}
                    onChange={(e) => {
                      setDossierCityFilter(e.target.value);
                      setDossierNeighborhoodFilter('all');
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none transition ${
                      dossierCountryFilter === 'all'
                        ? 'bg-slate-900/60 border border-slate-800/80 text-slate-500 cursor-not-allowed opacity-60'
                        : 'bg-slate-950 border border-slate-800 text-white focus:border-amber-400 cursor-pointer'
                    }`}
                  >
                    {dossierCountryFilter === 'all' ? (
                      <option value="all">{isEn ? '🔒 Select a country first' : '🔒 Selecciona un país primero'}</option>
                    ) : (
                      <>
                        <option value="all">{isEn ? `🏙️ All Cities in ${dossierCountryFilter} (${dossierAvailableCities.length})` : `🏙️ Todas las Ciudades de ${dossierCountryFilter} (${dossierAvailableCities.length})`}</option>
                        {dossierAvailableCities.map((city) => {
                          const count = luismaBaseDossiers.filter(
                            (d) =>
                              (d.country || 'Colombia') === dossierCountryFilter &&
                              d.city.toLowerCase() === city.toLowerCase()
                          ).length;
                          return (
                            <option key={city} value={city}>
                              {city} {count > 0 ? `(${count})` : ''}
                            </option>
                          );
                        })}
                      </>
                    )}
                  </select>
                </div>

                {/* 3º Filtro: Estado de Cierre / Monetización */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    3º {tDossiers.filterClosing}
                  </label>
                  <select
                    value={dossierClosingFilter}
                    onChange={(e) => setDossierClosingFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400 transition"
                  >
                    <option value="all">{tDossiers.filterAllClosing}</option>
                    <option value="prestigia_subscriber">{tDossiers.statusPrestigiaSubscriber}</option>
                    <option value="setup_paid">{tDossiers.statusSetupPaid}</option>
                    <option value="proposal_sent">{tDossiers.statusProposalSent}</option>
                    <option value="negotiating">{tDossiers.statusNegotiating}</option>
                    <option value="lead_draft">{tDossiers.statusLeadDraft}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List / Grid of My Dossiers */}
            {isLoadingDossiers ? (
              <div className="text-center py-16 text-slate-400 text-xs space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-400" />
                <p>{tDossiers.loading}</p>
              </div>
            ) : myDossiers.length === 0 ? (
              <div className="text-center py-16 p-8 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
                <Layers className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">{tDossiers.emptyTitle}</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {tDossiers.emptyDesc}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setDossierSearch('');
                    setDossierModeFilter('all');
                    setDossierCountryFilter('all');
                    setDossierCityFilter('all');
                    setDossierNeighborhoodFilter('all');
                    setDossierClosingFilter('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-md"
                >
                  {isEn ? 'Reset All Filters' : 'Restablecer Todos los Filtros'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myDossiers.map((d) => (
                  <div
                    key={d.id}
                    className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-400/60 transition flex flex-col justify-between space-y-4 shadow-lg group"
                  >
                    <div className="space-y-3">
                      {/* Top Badges: Service Mode, HealthScore & Country */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            d.mode === 'create'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : d.mode === 'rescue'
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                              : d.mode === 'appeal'
                              ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                              : 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                          }`}
                        >
                          {d.mode === 'create'
                            ? tDossiers.badgeCreate
                            : d.mode === 'rescue'
                            ? tDossiers.badgeRescue
                            : d.mode === 'appeal'
                            ? (isEn ? '⚖️ 1-3★ Appeal' : '⚖️ Apelación 1-3★')
                            : tDossiers.badgeAudit}
                        </span>

                        {d.data?.healthScore !== undefined && (
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              d.data.healthScore < 50
                                ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            Score: {d.data.healthScore}/100
                          </span>
                        )}

                        <span className="text-[10px] text-slate-500 font-mono ml-auto">
                          📍 {d.country || 'Colombia'} • {new Date(d.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Client Info */}
                      <div>
                        <h4 className="text-base font-black text-white group-hover:text-amber-300 transition">
                          {d.clientName}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          📍 {d.city} {d.neighborhood ? `• ${d.neighborhood}` : ''}
                        </p>
                        <span className="text-[11px] text-amber-400 font-bold block mt-1">{d.category}</span>
                      </div>

                      {/* Datos del Cliente / Contratante (Quién Solicita y Paga) */}
                      {(d.contactName || d.contactCompany || d.contactPhone || d.contactEmail) && (
                        <div className="p-2.5 rounded-2xl bg-slate-950/90 border border-indigo-500/30 text-[11px] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-indigo-300 flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-indigo-400" />
                              <span>{d.contactName || 'Cliente Contratante'}</span>
                            </span>
                            {d.contactRole && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                                {d.contactRole}
                              </span>
                            )}
                          </div>
                          {d.contactCompany && (
                            <p className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-slate-500" />
                              <span>{d.contactCompany}</span>
                            </p>
                          )}
                          <div className="flex items-center gap-2.5 pt-0.5 text-[10px]">
                            {d.contactPhone && (
                              <a
                                href={`https://wa.me/${d.contactPhone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                              >
                                <Phone className="w-3 h-3" />
                                <span>{d.contactPhone}</span>
                              </a>
                            )}
                            {d.contactEmail && (
                              <a
                                href={`mailto:${d.contactEmail}`}
                                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 truncate"
                              >
                                <Mail className="w-3 h-3" />
                                <span className="truncate">{d.contactEmail}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Commercial Closing & Monetization Box */}
                      <div className="pt-2">
                        {d.closingStatus === 'prestigia_subscriber' ? (
                          <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-950 to-slate-950 border border-emerald-500/40 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wide flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-emerald-400" />
                                {isEn ? 'Active Prestigia Subscription' : 'Suscripción Prestigia Activa'}
                              </span>
                              <strong className="text-xs font-black text-emerald-400">
                                {d.monthlyPlanUsd ? `$${d.monthlyPlanUsd} USD/mes` : (isEn ? 'Tailored Plan' : 'Plan a la Medida')}
                              </strong>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-emerald-500/20">
                              <span className="text-slate-400">{isEn ? 'Technical Setup:' : 'Setup Técnico:'}</span>
                              <span className="font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                {isEn ? '$0 USD (100% Waived)' : '$0 USD (100% Bonificado)'}
                              </span>
                            </div>
                          </div>
                        ) : d.closingStatus === 'setup_paid' ? (
                          <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-slate-950 to-slate-950 border border-cyan-500/40 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-cyan-300 uppercase tracking-wide flex items-center gap-1">
                                <DollarSign className="w-3 h-3 text-cyan-400" />
                                {isEn ? 'Technical Setup Paid' : 'Setup Técnico Cobrado'}
                              </span>
                              <strong className="text-xs font-black text-cyan-300">
                                ${d.setupFeeChargedUsd || 250} USD
                              </strong>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-cyan-500/20">
                              <span className="text-slate-400">{isEn ? 'Monthly Plan:' : 'Plan Mensual:'}</span>
                              <span className="text-slate-400 italic">{isEn ? 'No subscription (One-Time Sale)' : 'Sin suscripción (Venta Única)'}</span>
                            </div>
                          </div>
                        ) : d.closingStatus === 'proposal_sent' ? (
                          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-950 to-slate-950 border border-amber-500/30 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-amber-300 uppercase tracking-wide flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-400" />
                                {isEn ? 'Commercial Proposal Sent' : 'Propuesta Comercial Enviada'}
                              </span>
                              <span className="text-[11px] font-black text-amber-300">
                                Setup: ${d.setupFeeChargedUsd || 250} USD
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-amber-500/20">
                              <span className="text-slate-400">{isEn ? 'Prestigia Option:' : 'Opción Prestigia:'}</span>
                              <span className="text-emerald-300 font-bold">{d.monthlyPlanUsd ? `$${d.monthlyPlanUsd}/mes` : (isEn ? 'Tailored Plan' : 'Plan a la Medida')} (Setup $0)</span>
                            </div>
                          </div>
                        ) : d.closingStatus === 'negotiating' ? (
                          <div className="p-3 rounded-2xl bg-purple-950/50 border border-purple-500/30 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-purple-300 uppercase tracking-wide">
                                {isEn ? '🤝 In Closing Negotiation' : '🤝 En Negociación de Cierre'}
                              </span>
                              <span className="text-[11px] font-bold text-slate-300">
                                Setup: ${d.setupFeeChargedUsd || 250} USD
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                            <span>{isEn ? '📝 Prospect / Listing Under Review' : '📝 Prospección / Ficha en Estudio'}</span>
                            <span className="text-slate-500">{isEn ? 'No closed proposal' : 'Sin propuesta cerrada'}</span>
                          </div>
                        )}

                        {d.closingNotes && (
                          <p className="text-[10px] text-slate-400 italic bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 mt-1.5 line-clamp-2">
                            "{d.closingNotes}"
                          </p>
                        )}
                      </div>

                      {/* Critical gap note if present */}
                      {d.data?.criticalGaps && d.data.criticalGaps.length > 0 && (
                        <p className="text-[11px] text-slate-400 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 line-clamp-2">
                          ⚠️ {d.data.criticalGaps[0]}
                        </p>
                      )}
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[11px] font-bold text-amber-200 flex items-center gap-1.5">
                          {tDossiers.ownerBadge}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{d.advisorPhone}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleLoadDossier(d)}
                          className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10 active:scale-98"
                        >
                          <span>{tDossiers.btnLoadView}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditClosing(d)}
                          title={isEn ? 'Manage Commercial Closing & Billing' : 'Gestionar Cierre Comercial y Cobro'}
                          className="py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-300 border border-slate-700 hover:border-amber-400 font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-sm"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Billing' : 'Cobro'}</span>
                        </button>

                        {d.data?.whatsappOnboardingMessage && (
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(d.data.whatsappOnboardingMessage)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={tDossiers.sendWhatsappKit}
                            className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 transition cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteDossier(d.id)}
                          title={tDossiers.deleteDossier}
                          className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modal for Commercial Closing & Monetization Management */}
            {editingDossierClosing && (
              <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md overflow-y-auto p-3 sm:p-6 flex items-center justify-center">
                <div className="w-full max-w-xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden my-auto">
                  {/* Cabecera Fija */}
                  <div className="p-5 sm:p-6 pb-3 border-b border-slate-800 flex items-start justify-between gap-4 shrink-0 bg-slate-900/95">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300">
                        {isEn ? 'Monetization & Closing Control' : 'Control de Monetización & Cierre'}
                      </span>
                      <h3 className="text-lg font-black text-white mt-1">
                        {editingDossierClosing.clientName}
                      </h3>
                      <p className="text-xs text-slate-400">
                        📍 {closingFormCity || editingDossierClosing.city} {closingFormNeighborhood ? `• ${closingFormNeighborhood}` : ''} ({closingFormCountry || editingDossierClosing.country || 'Colombia'})
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingDossierClosing(null)}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Cuerpo Desplazable con Barra de Movimiento */}
                  <div className="p-5 sm:p-6 pt-4 overflow-y-auto space-y-4 text-xs flex-1">

                  {/* 1-Click Fast Presets */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {isEn ? 'Quick Closing Presets:' : 'Plantillas Rápidas de Cierre:'}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setClosingFormStatus('prestigia_subscriber');
                          setClosingFormSetupFee(0);
                          setClosingFormPaymentMethod('Plan Prestigia a la Medida • Setup $0 Bonificado');
                        }}
                        className="p-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold text-left transition cursor-pointer"
                      >
                        💎 {isEn ? 'Tailored Plan' : 'Plan a la Medida'}
                        <span className="block text-[9px] text-emerald-400/80 font-normal">{isEn ? 'Setup $0 Waived' : 'Setup $0 Bonificado'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setClosingFormStatus('setup_paid');
                          setClosingFormSetupFee(250);
                          setClosingFormMonthlyPlan(0);
                          setClosingFormPaymentMethod('Transferencia Bancaria');
                        }}
                        className="p-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold text-left transition cursor-pointer"
                      >
                        💵 {isEn ? 'Setup Only $250' : 'Setup Solo $250'}
                        <span className="block text-[9px] text-cyan-400/80 font-normal">{isEn ? 'One-Time Payment (No MRR)' : 'Pago Único (Sin MRR)'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setClosingFormMode('rescue');
                          setClosingFormStatus('setup_paid');
                          setClosingFormSetupFee(350);
                          setClosingFormPaymentMethod('Transferencia / Pasarela');
                        }}
                        className="p-2 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-300 text-[11px] font-bold text-left transition cursor-pointer"
                      >
                        🛡️ {isEn ? '72h Rescue $350' : 'Rescate 72h $350'}
                        <span className="block text-[9px] text-amber-400/80 font-normal">{isEn ? 'Legal Ownership Recovery' : 'Recuperación Legal'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="space-y-3.5 text-xs">
                    {/* Location fields in closing modal */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-300 font-bold">
                            {isEn ? 'Client Country:' : 'País del Cliente:'}
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowAddCountryModal(true)}
                            className="text-[10px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-0.5 cursor-pointer"
                          >
                            <Plus className="w-2.5 h-2.5" />
                            <span>País</span>
                          </button>
                        </div>
                        <select
                          value={closingFormCountry}
                          onChange={(e) => {
                            if (e.target.value === '__add_new__') {
                              setShowAddCountryModal(true);
                            } else {
                              const newC = e.target.value;
                              setClosingFormCountry(newC);
                              const available = getCitiesForCountry(newC);
                              if (!available.includes(closingFormCity) && available.length > 0) {
                                setClosingFormCity(available[0]);
                              }
                            }
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 transition"
                        >
                          {allCountriesList.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                          
                        </select>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-300 font-bold">
                            Ciudad ({closingFormCountry}):
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setTargetCountryForNewCity(closingFormCountry);
                              setShowAddCityModal(true);
                            }}
                            className="text-[10px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-0.5 cursor-pointer"
                          >
                            <Plus className="w-2.5 h-2.5" />
                            <span>Ciudad</span>
                          </button>
                        </div>
                        <select
                          value={closingFormCity}
                          onChange={(e) => {
                            if (e.target.value === '__add_new__') {
                              setTargetCountryForNewCity(closingFormCountry);
                              setShowAddCityModal(true);
                            } else {
                              setClosingFormCity(e.target.value);
                            }
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 transition"
                        >
                          {getCitiesForCountry(closingFormCountry).map((cty) => (
                            <option key={cty} value={cty}>{cty}</option>
                          ))}
                          
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-300 font-bold mb-1">
                          Barrio o Localidad:
                        </label>
                        <input
                          type="text"
                          value={closingFormNeighborhood}
                          onChange={(e) => setClosingFormNeighborhood(e.target.value)}
                          placeholder="Ej: Chapinero, Poblado, Polanco, Brickell..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 transition"
                        />
                      </div>
                    </div>

                    {/* Service Type */}
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        {isEn ? 'Technical Service Delivered:' : 'Tipo de Servicio Técnico Realizado:'}
                      </label>
                      <select
                        value={closingFormMode}
                        onChange={(e) => setClosingFormMode(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 transition"
                      >
                        <option value="create">{isEn ? '🏗️ Profile Created From Scratch (Benchmark: $150 – $250 USD)' : '🏗️ Ficha Creada Desde Cero (Benchmark: $150 – $250 USD)'}</option>
                        <option value="audit">{isEn ? '🔬 Forensic Audit & Top 3 Optimization (Benchmark: $200 – $350 USD)' : '🔬 Auditoría Forense & Optimización Top 3 (Benchmark: $200 – $350 USD)'}</option>
                        <option value="rescue">{isEn ? '🛡️ Hijacked Profile Rescue / 72h Claim (Benchmark: $250 – $450 USD)' : '🛡️ Rescate de Ficha Secuestrada / Reclamación 72h (Benchmark: $250 – $450 USD)'}</option>
                      </select>
                    </div>

                    {/* Closing Status */}
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        {isEn ? 'Negotiation & Closing Status:' : 'Estado de Negociación y Cierre:'}
                      </label>
                      <select
                        value={closingFormStatus}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setClosingFormStatus(val);
                          if (val === 'prestigia_subscriber') {
                            setClosingFormSetupFee(0);
                            if (closingFormMonthlyPlan === 0) setClosingFormMonthlyPlan(199);
                          }
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 transition"
                      >
                        <option value="prestigia_subscriber">{isEn ? '💎 Active Prestigia Subscriber (Setup $0 USD 100% Waived)' : '💎 Suscriptor Prestigia Activo (Setup $0 USD 100% Bonificado)'}</option>
                        <option value="setup_paid">{isEn ? '💵 Technical Setup Paid (One-time technical delivery fee)' : '💵 Setup Técnico Cobrado (Pago único por trabajo técnico)'}</option>
                        <option value="proposal_sent">{isEn ? '⏳ Proposal Sent (In commercial follow-up)' : '⏳ Propuesta Enviada (En seguimiento comercial)'}</option>
                        <option value="negotiating">{isEn ? '🤝 In Active Negotiation' : '🤝 En Negociación Activa'}</option>
                        <option value="lead_draft">{isEn ? '📝 Prospect / Profile Under Review' : '📝 Prospección / Ficha en Estudio'}</option>
                      </select>
                    </div>

                    {/* Monetary Inputs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">
                          {isEn ? 'Setup Fee Charged (USD):' : 'Valor Cobrado de Setup (USD):'}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            step="10"
                            value={closingFormSetupFee}
                            onChange={(e) => setClosingFormSetupFee(Number(e.target.value))}
                            className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-xs focus:outline-none focus:border-amber-400 transition"
                          />
                          <DollarSign className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" />
                        </div>
                        <span className="text-[10px] text-slate-500 mt-0.5 block">
                          {isEn ? 'If client subscribed to Prestigia, enter $0 (Setup waived).' : 'Si adquirió Prestigia, coloca $0 (Setup bonificado).'}
                        </span>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">
                          {isEn ? 'Prestigia Monthly Plan (USD/mo):' : 'Plan Mensual Prestigia (USD/mes):'}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            step="10"
                            value={closingFormMonthlyPlan}
                            onChange={(e) => setClosingFormMonthlyPlan(Number(e.target.value))}
                            className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-xs focus:outline-none focus:border-amber-400 transition"
                          />
                          <DollarSign className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" />
                        </div>
                        <span className="text-[10px] text-slate-500 mt-0.5 block">
                          {isEn ? 'Tailored rate agreed with client • $0 if setup only.' : 'Tarifa a la medida acordada con el cliente • $0 si solo fue setup.'}
                        </span>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        {isEn ? 'Payment Method / Billing Detail:' : 'Método de Pago / Detalle de Cobro:'}
                      </label>
                      <input
                        type="text"
                        value={closingFormPaymentMethod}
                        onChange={(e) => setClosingFormPaymentMethod(e.target.value)}
                        placeholder={isEn ? 'e.g. Stripe Recurring, Wire Transfer, POS Terminal...' : 'Ej: Stripe Recurrente, Transferencia Bancaria, Datáfono...'} 
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 transition"
                      />
                    </div>

                    {/* Closing Notes */}
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        {isEn ? 'Negotiation Log & Commercial Notes:' : 'Bitácora & Notas de Negociación:'}
                      </label>
                      <textarea
                        rows={3}
                        value={closingFormNotes}
                        onChange={(e) => setClosingFormNotes(e.target.value)}
                        placeholder={isEn ? 'Log client agreements, activation date, resolved objections...' : 'Registra acuerdos, fecha de activación de plataforma, objeciones resueltas...'}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 transition"
                      />
                    </div>
                  </div>

                  </div>

                  {/* Pie Fijo con Botones de Acción Siempre Visibles */}
                  <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/95 flex items-center justify-end gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingDossierClosing(null)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                    >
                      {isEn ? 'Cancel' : 'Cancelar'}
                    </button>
                    <button
                      type="button"
                      disabled={isSavingClosing}
                      onClick={handleSaveDossierClosing}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-98 disabled:opacity-50"
                    >
                      {isSavingClosing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Guardando...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>{isEn ? 'Save Commercial Closing' : 'Guardar Cierre Comercial'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {(activeTab === 'advisors' || activeTab === 'network') && isLuismaMaster && (
          <div className="space-y-6 print:hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-950/40 border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300">
                      {tNetwork.badge}
                    </span>
                    <span className="text-xs text-slate-500">{tNetwork.badgeSub}</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                    {tNetwork.title}
                  </h1>
                  <p className="text-xs text-slate-300 max-w-3xl">
                    {tNetwork.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={downloadNetworkCsvReport}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-500/20 shrink-0 active:scale-98"
                >
                  <Download className="w-4 h-4" />
                  <span>{tNetwork.btnDownloadCsv}</span>
                </button>
              </div>
            </div>

            {/* Monetization & Network KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">{tNetwork.kpiInternal}</span>
                  <strong className="text-xl font-black text-white">
                    {advisorsList.filter((a) => a.accountType !== 'partner_agency' && a.id !== 'adv-luisma' && a.id !== 'adv-admin').length}
                  </strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">{tNetwork.kpiAgencies}</span>
                  <strong className="text-xl font-black text-purple-300">
                    {advisorsList.filter((a) => a.accountType === 'partner_agency').length}
                  </strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">{tNetwork.kpiAccounts}</span>
                  <strong className="text-xl font-black text-amber-400">{networkFilteredDossiers.length}</strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">{tNetwork.kpiMrr}</span>
                  <strong className="text-xl font-black text-emerald-400">
                    ${advisorsList
                      .filter((a) => a.accountType !== 'founder' && (a.licenseStatus === 'active' || a.active))
                      .reduce((sum, a) => sum + (a.monthlyFeeUsd || 0), 0)}{' '}
                    <span className="text-xs font-bold text-slate-400">{isEn ? 'USD/mo' : 'USD/mes'}</span>
                  </strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setNetworkTabMode(networkTabMode === 'forensic' ? 'directory' : 'forensic')}
                className={`p-4 rounded-2xl border flex items-center gap-3 transition cursor-pointer text-left ${
                  networkTabMode === 'forensic'
                    ? 'bg-rose-950/80 border-rose-500 shadow-lg shadow-rose-500/20'
                    : 'bg-slate-900 border-slate-800 hover:border-rose-500/50'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-bold">{isEn ? 'Forensic Vault' : 'Bóveda Forense'}</span>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-xl font-black text-rose-400">{forensicDeletedDossiers.length}</strong>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Borradas</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Sub-view Switcher: Directorio vs Bóveda Forense */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setNetworkTabMode('directory')}
                className={`flex-1 py-2.5 px-4 rounded-xl font-black transition flex items-center justify-center gap-2 cursor-pointer ${
                  networkTabMode === 'directory'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>👥 {isEn ? 'Directory of Advisors & Licensed Agencies' : 'Directorio de Asesores & Agencias Licenciadas'} ({filteredAdvisors.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setNetworkTabMode('forensic')}
                className={`flex-1 py-2.5 px-4 rounded-xl font-black transition flex items-center justify-center gap-2 cursor-pointer ${
                  networkTabMode === 'forensic'
                    ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>🛡️ {isEn ? 'Master Forensic Vault (Auditing of Deleted Files)' : 'Bóveda Forense Master (Historial de Fichas Borradas)'} ({forensicDeletedDossiers.length})</span>
              </button>
            </div>

            {networkTabMode === 'directory' && (
              <div className="space-y-6">
                {/* Barra de Filtros Inteligentes de Asesores & Agencias */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-slate-300 font-bold">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-amber-400" />
                  <span>{isEn ? 'Network Members & Licensees Filters:' : 'Filtros de Asesores & Agencias de la Red:'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRegisterAdvisorModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md active:scale-98"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Register Advisor / Agency' : 'Registrar Asesor o Licenciar Agencia'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                {/* 1º Filter Country con Botón + País */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-amber-400 uppercase font-black flex items-center gap-1">
                      <Globe className="w-3 h-3 text-amber-400" />
                      <span>1º {isEn ? 'Country' : 'País'}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddCountryModal(true)}
                      className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center gap-1 border border-amber-500/30 transition cursor-pointer"
                      title="Registrar nuevo País"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>País</span>
                    </button>
                  </div>
                  <select
                    value={networkCountryFilter}
                    onChange={(e) => {
                      setNetworkCountryFilter(e.target.value);
                      setNetworkCityFilter('all');
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 transition cursor-pointer"
                  >
                    <option value="all">{isEn ? `🌐 All Countries (${networkAvailableCountries.length})` : `🌐 Todos los Países (${networkAvailableCountries.length})`}</option>
                    {networkAvailableCountries.map((c: string) => {
                      const count = advisorsList.filter((a) => (a.country || 'Colombia') === c).length;
                      return (
                        <option key={c} value={c}>
                          {c === 'Colombia' ? '🇨🇴 Colombia' : c === 'Venezuela' ? '🇻🇪 Venezuela' : c === 'México' ? '🇲🇽 México' : c} {count > 0 ? `(${count})` : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* 2º Filter City Condicionado Estrictamente al País */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-amber-400 uppercase font-black flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-amber-400" />
                      <span>2º {isEn ? 'City' : 'Ciudad'}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetCountryForNewCity(networkCountryFilter !== 'all' ? networkCountryFilter : 'Colombia');
                        setShowAddCityModal(true);
                      }}
                      className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center gap-1 border border-amber-500/30 transition cursor-pointer"
                      title="Registrar nueva Ciudad"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>Ciudad</span>
                    </button>
                  </div>
                  <select
                    value={networkCityFilter}
                    disabled={networkCountryFilter === 'all'}
                    onChange={(e) => setNetworkCityFilter(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none transition ${
                      networkCountryFilter === 'all'
                        ? 'bg-slate-900/60 border border-slate-800/80 text-slate-500 cursor-not-allowed opacity-60'
                        : 'bg-slate-950 border border-slate-700 text-white focus:border-amber-400 cursor-pointer'
                    }`}
                  >
                    {networkCountryFilter === 'all' ? (
                      <option value="all">🔒 Selecciona un país primero</option>
                    ) : (
                      <>
                        <option value="all">{isEn ? `🏙️ All Cities in ${networkCountryFilter} (${networkAvailableCities.length})` : `🏙️ Todas las Ciudades de ${networkCountryFilter} (${networkAvailableCities.length})`}</option>
                        {networkAvailableCities.map((city: string) => {
                          const count = advisorsList.filter(
                            (a) => (a.country || 'Colombia') === networkCountryFilter && (a.city || '').toLowerCase() === city.toLowerCase()
                          ).length;
                          return (
                            <option key={city} value={city}>
                              {city} {count > 0 ? `(${count})` : ''}
                            </option>
                          );
                        })}
                      </>
                    )}
                  </select>
                </div>

                {/* Filter Account Type */}
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">
                    {isEn ? 'Account Type' : 'Tipo de Cuenta'}
                  </label>
                  <select
                    value={networkTypeFilter}
                    onChange={(e) => setNetworkTypeFilter(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="all">{isEn ? 'All Types' : 'Todos los Tipos'}</option>
                    <option value="director">{isEn ? '👑 General Directorate (Luisma)' : '👑 Dirección General (Luisma)'}</option>
                    <option value="internal_advisor">{isEn ? '💼 Sales Advisors' : '💼 Asesores Comerciales'}</option>
                    <option value="partner_agency">{isEn ? '🏢 Partner Agencies (B2B)' : '🏢 Agencias Partners (B2B)'}</option>
                  </select>
                </div>

                {/* Filter Active / Inactive (Encendida / Apagada) */}
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">
                    {isEn ? 'Account Status' : 'Estado de Cuenta'}
                  </label>
                  <select
                    value={networkActiveFilter}
                    onChange={(e) => setNetworkActiveFilter(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="all">{isEn ? 'All Statuses' : 'Todos los Estados'}</option>
                    <option value="active">{isEn ? '🟢 Active (Turned On)' : '🟢 Encendidas (Activas)'}</option>
                    <option value="inactive">{isEn ? '🔴 Inactive (Turned Off)' : '🔴 Apagadas (Inactivas)'}</option>
                  </select>
                </div>
              </div>

              {/* Search Input and Reset Button */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1 border-t border-slate-800/80">
                <div className="flex-1 w-full relative">
                  <input
                    type="text"
                    value={networkSearch}
                    onChange={(e) => setNetworkSearch(e.target.value)}
                    placeholder={isEn ? 'Search advisor by name, @username, phone, or city...' : 'Buscar asesor o agencia por nombre, @usuario, teléfono o ciudad...'}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setNetworkCountryFilter('all');
                    setNetworkCityFilter('all');
                    setNetworkTypeFilter('all');
                    setNetworkActiveFilter('all');
                    setNetworkSearch('');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition cursor-pointer shrink-0"
                >
                  {isEn ? 'Reset Filters' : 'Restablecer Filtros'}
                </button>
              </div>
            </div>

            {/* Grid Exclusivo de Fichas de Asesores & Agencias */}
            {filteredAdvisors.length === 0 ? (
              <div className="text-center py-16 p-8 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
                <Users className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">
                  {isEn ? 'No advisors or partner agencies found with current filters' : 'No hay asesores ni agencias con los filtros seleccionados'}
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {isEn ? 'Try adjusting country, city, or status filters.' : 'Intenta modificando los filtros de país, ciudad o estado.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setNetworkCountryFilter('all');
                    setNetworkCityFilter('all');
                    setNetworkTypeFilter('all');
                    setNetworkActiveFilter('all');
                    setNetworkSearch('');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-md"
                >
                  {isEn ? 'Reset Filters' : 'Restablecer Filtros'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {filteredAdvisors.map((adv) => {
                  const isFounder = adv.id === 'adv-luisma' || adv.accountType === 'founder';
                  const isDirector = adv.accountType === 'director';
                  const advisorDossiers = savedDossiers.filter((d) => d.advisorId === adv.id);
                  const createsCount = advisorDossiers.filter((d) => d.mode === 'create').length;
                  const auditsCount = advisorDossiers.filter((d) => d.mode === 'audit').length;
                  const rescuesCount = advisorDossiers.filter((d) => d.mode === 'rescue').length;
                  const appealsCount = advisorDossiers.filter((d) => d.mode === 'appeal').length;
                  const isRevealed = Boolean(revealedPasswords[adv.id]);

                  const curNow = new Date();
                  const curY = curNow.getFullYear();
                  const curM = curNow.getMonth();
                  const advisorMonthDossiers = advisorDossiers.filter((d) => {
                    const cd = new Date(d.createdAt);
                    return cd.getFullYear() === curY && cd.getMonth() === curM;
                  });
                  const monthCreates = advisorMonthDossiers.filter((d) => d.mode === 'create').length;
                  const monthAudits = advisorMonthDossiers.filter((d) => d.mode === 'audit').length;
                  const monthRescues = advisorMonthDossiers.filter((d) => d.mode === 'rescue').length;
                  const deletedCountForAdv = advisorDossiers.filter((d) => d.deletedByAdvisor).length;

                  return (
                    <div
                      key={adv.id}
                      className={`p-5 rounded-3xl border flex flex-col justify-between space-y-4 shadow-xl transition group ${
                        adv.active
                          ? 'bg-slate-900 border-slate-800 hover:border-amber-400/50'
                          : 'bg-slate-950/80 border-rose-950/60 opacity-80'
                      }`}
                    >
                      <div className="space-y-3.5">
                        {/* Header de Tarjeta: Rol, Estado Encendido/Apagado y Canon en 1 Sola Línea Imposible de Romperse */}
                        <div className="flex items-center justify-between gap-2 h-7">
                          <span
                            className={`text-[9.5px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1 ${
                              isFounder
                                ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                                : isDirector
                                ? 'bg-amber-950/70 text-amber-300 border border-amber-500/40'
                                : adv.accountType === 'partner_agency'
                                ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                                : 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                            }`}
                          >
                            {isFounder
                              ? (isEn ? '👑 Founder & Director' : '👑 Fundador Master')
                              : isDirector
                              ? (isEn ? `👑 General Director • $${adv.monthlyFeeUsd ?? 79}/mo` : `👑 Director General • $${adv.monthlyFeeUsd ?? 79} USD/mes`)
                              : adv.accountType === 'partner_agency'
                              ? (isEn ? `🏢 Partner Agency • $${adv.monthlyFeeUsd ?? 79}/mo` : `🏢 Agencia Partner • $${adv.monthlyFeeUsd ?? 79} USD/mes`)
                              : (isEn ? `💼 Sales Advisor • $${adv.monthlyFeeUsd ?? 79}/mo` : `💼 Asesor Comercial • $${adv.monthlyFeeUsd ?? 79} USD/mes`)}
                          </span>

                          <div className="shrink-0 flex items-center">
                            {/* Badge y Toggle de Estado: Encendida vs Apagada */}
                            {isFounder ? (
                              <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1">
                                <span>🟢</span>
                                <span>{isEn ? 'Always Active' : 'Siempre Activa'}</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleToggleAdvisorActive(adv)}
                                className={`text-[9px] font-bold px-2.5 py-1 rounded-full border transition cursor-pointer flex items-center gap-1 ${
                                  adv.active
                                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40 hover:bg-rose-950/80 hover:text-rose-300 hover:border-rose-500/40'
                                    : 'bg-rose-950 text-rose-300 border-rose-500/40 hover:bg-emerald-950/80 hover:text-emerald-300 hover:border-emerald-500/40'
                                }`}
                                title={adv.active ? 'Clic para Apagar cuenta' : 'Clic para Encender cuenta'}
                              >
                                <Power className="w-2.5 h-2.5" />
                                <span>{adv.active ? (isEn ? 'Active • Turn Off' : '🟢 Activa • Apagar') : (isEn ? 'Off • Turn On' : '🔴 Apagada • Encender')}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Nombre y Ubicación Parejos */}
                        <div className="space-y-1">
                          <h4 className="text-base font-black text-white group-hover:text-amber-300 transition truncate" title={adv.name}>
                            {adv.name}
                          </h4>
                          <p className="text-xs text-slate-400 truncate">
                            📍 {adv.city || 'Bogotá'}, {adv.country || 'Colombia'}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate">
                            <span>Teléfono: <strong className="text-slate-300 font-mono">{adv.phone || 'No registrado'}</strong></span>
                            {adv.phone && (
                              <a
                                href={`https://wa.me/${adv.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-0.5 text-[10px] shrink-0"
                                title="Abrir WhatsApp directo"
                              >
                                <MessageSquare className="w-2.5 h-2.5" />
                                <span>WhatsApp</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Box Visual de Credenciales de Entrada al Sistema */}
                        <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-black uppercase text-amber-400 pb-1 border-b border-slate-800">
                            <span className="flex items-center gap-1">
                              <KeyRound className="w-3 h-3 text-amber-400" />
                              <span>{isEn ? 'System Login Credentials:' : 'Credenciales de Entrada al Sistema:'}</span>
                            </span>
                            <span className="text-slate-500 text-[9px] font-mono">ID: {adv.id}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {/* Usuario */}
                            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                              <span className="text-[9px] uppercase font-bold text-slate-500 block">
                                {isEn ? 'Username' : 'Usuario'}
                              </span>
                              <div className="flex items-center justify-between mt-0.5">
                                <span className="font-mono font-bold text-indigo-300 truncate mr-1">
                                  {adv.username}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(adv.username, 'Usuario')}
                                  className="text-slate-400 hover:text-white transition cursor-pointer p-0.5"
                                  title="Copiar usuario"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Contraseña */}
                            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                              <span className="text-[9px] uppercase font-bold text-slate-500 block">
                                {isEn ? 'Password' : 'Contraseña'}
                              </span>
                              <div className="flex items-center justify-between mt-0.5">
                                <span className="font-mono font-bold text-amber-300 truncate mr-1">
                                  {isRevealed ? (adv.password || 'admin') : '••••••••'}
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => toggleRevealPassword(adv.id)}
                                    className="text-slate-400 hover:text-amber-400 transition cursor-pointer p-0.5"
                                    title={isRevealed ? 'Ocultar contraseña' : 'Ver contraseña'}
                                  >
                                    {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(adv.password || 'admin', 'Contraseña')}
                                    className="text-slate-400 hover:text-white transition cursor-pointer p-0.5"
                                    title="Copiar contraseña"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Resumen de Producción Parejo */}
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] space-y-1.5">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-slate-400">{isEn ? 'Production Record:' : 'Fichas Realizadas:'}</span>
                            <span className="font-black text-amber-300 font-mono">
                              {advisorDossiers.length} {isEn ? 'dossiers' : 'expedientes'}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 gap-1 pt-1 border-t border-slate-800/60 text-center text-[10px]">
                            <div className="bg-slate-900/80 py-0.5 rounded px-1">
                              <span className="text-slate-400 block text-[9px] uppercase font-semibold">{isEn ? 'Created' : 'Creadas'}</span>
                              <strong className="text-emerald-400 font-mono">{createsCount}</strong>
                            </div>
                            <div className="bg-slate-900/80 py-0.5 rounded px-1">
                              <span className="text-slate-400 block text-[9px] uppercase font-semibold">{isEn ? 'Audited' : 'Auditadas'}</span>
                              <strong className="text-blue-400 font-mono">{auditsCount}</strong>
                            </div>
                            <div className="bg-slate-900/80 py-0.5 rounded px-1">
                              <span className="text-slate-400 block text-[9px] uppercase font-semibold">{isEn ? 'Rescued' : 'Rescatadas'}</span>
                              <strong className="text-amber-400 font-mono">{rescuesCount}</strong>
                            </div>
                            <div className="bg-slate-900/80 py-0.5 rounded px-1">
                              <span className="text-slate-400 block text-[9px] uppercase font-semibold">{isEn ? 'Appealed' : 'Apeladas'}</span>
                              <strong className="text-purple-400 font-mono">{appealsCount}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Monitor de Topes & Consumo de IA este Mes */}
                        {!isFounder && (
                          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5 text-[11px]">
                            <div className="flex items-center justify-between font-bold">
                              <span className="text-amber-400 flex items-center gap-1 text-[10.5px]">
                                <Zap className="w-3 h-3 text-amber-400" />
                                <span>{isEn ? 'Current Month AI Usage:' : 'Consumo IA Mes Actual:'}</span>
                              </span>
                              {deletedCountForAdv > 0 && (
                                <span className="text-[9px] font-bold text-rose-400 bg-rose-950/60 border border-rose-500/30 px-1.5 py-0.5 rounded-full">
                                  🗑️ {deletedCountForAdv} {isEn ? 'in Vault' : 'en Bóveda'}
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-800/60 text-center text-[10px]">
                              <div className="bg-slate-900/80 py-1 rounded px-1">
                                <span className="text-slate-400 block text-[8.5px] uppercase font-semibold">{isEn ? 'Build' : 'Crea'}</span>
                                <strong className={`font-mono text-[11px] ${monthCreates >= (adv.maxCreatesMonthly ?? 30) ? 'text-rose-400' : 'text-emerald-400'}`}>
                                  {monthCreates} / {adv.maxCreatesMonthly ?? (adv.accountType === 'partner_agency' ? 60 : adv.accountType === 'director' ? 100 : 30)}
                                </strong>
                              </div>
                              <div className="bg-slate-900/80 py-1 rounded px-1">
                                <span className="text-slate-400 block text-[8.5px] uppercase font-semibold">{isEn ? 'Audit' : 'Audita'}</span>
                                <strong className={`font-mono text-[11px] ${monthAudits >= (adv.maxAuditsMonthly ?? 30) ? 'text-rose-400' : 'text-amber-400'}`}>
                                  {monthAudits} / {adv.maxAuditsMonthly ?? (adv.accountType === 'partner_agency' ? 60 : adv.accountType === 'director' ? 100 : 30)}
                                </strong>
                              </div>
                              <div className="bg-slate-900/80 py-1 rounded px-1">
                                <span className="text-slate-400 block text-[8.5px] uppercase font-semibold">{isEn ? 'Rescue' : 'Rescata'}</span>
                                <strong className={`font-mono text-[11px] ${monthRescues >= (adv.maxRescuesMonthly ?? 10) ? 'text-rose-400' : 'text-rose-300'}`}>
                                  {monthRescues} / {adv.maxRescuesMonthly ?? (adv.accountType === 'partner_agency' ? 20 : adv.accountType === 'director' ? 50 : 10)}
                                </strong>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Botones de Acción: Ver Trabajos, Modificar y Eliminar */}
                      <div className="pt-2 border-t border-slate-800/80 space-y-2 mt-auto">
                        {/* Botón Principal para Ver sus Trabajos */}
                        <button
                          type="button"
                          onClick={() => setViewingAdvisorWorks(adv)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98"
                        >
                          <Search className="w-3.5 h-3.5 text-slate-950" />
                          <span>
                            {isEn ? `📂 View Works & Listings (${advisorDossiers.length})` : `📂 Ver Trabajos / Fichas Realizadas (${advisorDossiers.length})`}
                          </span>
                        </button>

                        <div className="flex items-center gap-2 h-9">
                          <button
                            type="button"
                            onClick={() => handleOpenEditAdvisor(adv)}
                            className="flex-1 h-full rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{isEn ? 'Edit Account' : 'Modificar Cuenta'}</span>
                          </button>

                          {!isFounder ? (
                            <button
                              type="button"
                              onClick={() => handleDeleteAdvisor(adv)}
                              className="w-9 h-full rounded-xl bg-rose-950/30 hover:bg-rose-950/70 text-rose-400 hover:text-rose-200 border border-rose-500/30 transition cursor-pointer flex items-center justify-center shrink-0"
                              title={isEn ? 'Delete Account' : 'Eliminar Cuenta'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <div className="px-2.5 h-full rounded-xl bg-slate-950/60 border border-slate-800 text-[10px] text-amber-400 font-bold flex items-center justify-center shrink-0">
                              HQ Master
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {networkTabMode === 'forensic' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-xs space-y-1">
              <div className="flex items-center gap-2 text-rose-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span className="text-sm">{isEn ? 'General Management Exclusive Forensic Audit' : 'Auditoría Forense Exclusiva de Dirección General'}</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {isEn ? 'When an advisor or partner agency clicks "Delete" on their dashboard, the profile disappears from their screen but remains permanently preserved in this forensic vault. As Founder and General Director, you have unrestricted access to all historical records to audit and prevent data loss or tampering.' : 'Cuando un asesor o agencia pulsa "Eliminar" en su interfaz, la ficha desaparece de su pantalla pero se preserva permanentemente en esta bóveda. Como Fundador y Director General, tienes acceso a todo su trabajo histórico para auditar y prevenir cualquier pérdida de información o manipulación.'}
              </p>
            </div>

            {forensicDeletedDossiers.length === 0 ? (
              <div className="text-center py-16 p-8 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-white">
                  {isEn ? 'Clean Forensic Vault' : 'Bóveda Forense Limpia'}
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {isEn ? 'No deleted dossiers or audits found from advisors or partner agencies. All production is active.' : 'No hay expedientes ni auditorías borradas por asesores o agencias. Todo el trabajo se encuentra activo.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {forensicDeletedDossiers.map((d) => (
                  <div
                    key={d.id}
                    className="p-5 rounded-3xl bg-slate-900 border border-rose-500/40 hover:border-rose-400 transition flex flex-col justify-between space-y-4 shadow-xl"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9.5px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-500/50 flex items-center gap-1">
                          <Trash2 className="w-3 h-3 text-rose-400" />
                          <span>Borrado por Asesor</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {d.deletedAt ? new Date(d.deletedAt).toLocaleString() : new Date(d.updatedAt || d.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-indigo-400 block">
                          💼 Responsable: {d.advisorName || 'Asesor'} (@{d.advisorId})
                        </span>
                        <h4 className="font-black text-white text-base leading-tight mt-1">{d.clientName}</h4>
                        <p className="text-slate-400 text-xs mt-0.5">
                          📍 {d.city}, {d.country || 'Colombia'} {d.neighborhood ? `• ${d.neighborhood}` : ''}
                        </p>
                        <span className="text-[11px] text-amber-300 font-bold block mt-1">{d.category}</span>
                      </div>

                      {/* Contacto del Cliente */}
                      {(d.contactName || d.contactPhone || d.contactEmail) && (
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                          <span className="text-slate-400 block text-[9.5px] uppercase font-bold">{isEn ? 'Client Contact:' : 'Contacto Cliente:'}</span>
                          <div className="text-white font-bold">{d.contactName || 'No especificado'} {d.contactRole ? `(${d.contactRole})` : ''}</div>
                          {d.contactPhone && (
                            <div className="text-emerald-400 font-mono text-[10.5px]">📞 {d.contactPhone}</div>
                          )}
                          {d.contactEmail && (
                            <div className="text-indigo-400 text-[10.5px] truncate">✉️ {d.contactEmail}</div>
                          )}
                        </div>
                      )}

                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[10.5px] flex items-center justify-between">
                        <span className="text-slate-400">Modalidad:</span>
                        <span className="font-bold text-amber-300 uppercase">
                          {d.mode === 'create' ? '🏗️ Creación' : d.mode === 'rescue' ? '🛡️ Rescate' : '🔬 Auditoría'}
                        </span>
                      </div>
                    </div>

                    {/* Botonera de Auditoría Forense */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-2">
                      <button
                        type="button"
                        onClick={() => handleLoadDossier(d)}
                        className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-98"
                      >
                        <span>👁️ Inspeccionar en Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleRestoreDossier(d.id)}
                          className="flex-1 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Restore Profile' : 'Restaurar Ficha'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteDossier(d.id, true)}
                          className="px-3 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                          title={isEn ? 'Permanently purge from database' : 'Purgar definitivamente de la base de datos'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Purge' : 'Purgar'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    )}

      {/* MODAL: VER TRABAJOS & FICHAS REALIZADAS POR EL ASESOR */}
      {viewingAdvisorWorks && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 print:hidden animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
            {/* Cabecera Fija del Modal */}
            <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-900/95 flex items-start justify-between gap-4 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300">
                    {viewingAdvisorWorks.accountType === 'partner_agency' ? '🏢 Agencia Partner' : '💼 Asesor Comercial'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">@{viewingAdvisorWorks.username}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <span>📂 Trabajos Realizados por:</span>
                  <span className="text-amber-400">{viewingAdvisorWorks.name}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  📍 {viewingAdvisorWorks.city || 'Bogotá'}, {viewingAdvisorWorks.country || 'Colombia'} • Tel: {viewingAdvisorWorks.phone}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setViewingAdvisorWorks(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Métricas de Producción del Asesor */}
            {(() => {
              const advisorDossiers = savedDossiers.filter((d) => d.advisorId === viewingAdvisorWorks.id);
              const createsCount = advisorDossiers.filter((d) => d.mode === 'create').length;
              const auditsCount = advisorDossiers.filter((d) => d.mode === 'audit').length;
              const rescuesCount = advisorDossiers.filter((d) => d.mode === 'rescue').length;
              const appealsCount = advisorDossiers.filter((d) => d.mode === 'appeal').length;

              return (
                <div className="p-4 border-b border-slate-800 bg-slate-950/60 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs shrink-0">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">{isEn ? 'Total Profiles' : 'Total Fichas'}</span>
                    <strong className="text-lg font-black text-white">{advisorDossiers.length}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                    <span className="text-[10px] text-emerald-400 font-bold block uppercase truncate">{isEn ? '🏗️ Builds' : '🏗️ Creaciones'}</span>
                    <strong className="text-lg font-black text-emerald-300">{createsCount}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-blue-950/40 border border-blue-500/30">
                    <span className="text-[10px] text-blue-400 font-bold block uppercase truncate">{isEn ? '🔬 Audits' : '🔬 Auditorías'}</span>
                    <strong className="text-lg font-black text-blue-300">{auditsCount}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/30">
                    <span className="text-[10px] text-amber-400 font-bold block uppercase truncate">{isEn ? '🛡️ Rescues' : '🛡️ Rescates'}</span>
                    <strong className="text-lg font-black text-amber-300">{rescuesCount}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/30">
                    <span className="text-[10px] text-purple-400 font-bold block uppercase truncate">{isEn ? '⚖️ Appeals' : '⚖️ Apelaciones'}</span>
                    <strong className="text-lg font-black text-purple-300">{appealsCount}</strong>
                  </div>
                </div>
              );
            })()}

            {/* Cuerpo con Scroll: Lista de Expedientes y Clientes */}
            <div className="p-5 overflow-y-auto space-y-3.5 flex-1 text-xs">
              {(() => {
                const advisorDossiers = savedDossiers.filter((d) => d.advisorId === viewingAdvisorWorks.id);
                if (advisorDossiers.length === 0) {
                  return (
                    <div className="text-center py-12 space-y-2 text-slate-400">
                      <Layers className="w-10 h-10 text-slate-600 mx-auto" />
                      <p className="font-bold text-white text-sm">{isEn ? 'This member does not have any recorded dossiers yet.' : 'Este miembro aún no tiene expedientes registrados.'}</p>
                      <p className="text-xs">{isEn ? 'Clients and listings created, audited, or rescued by this advisor will appear here automatically.' : 'Los clientes y fichas creadas, auditadas o rescatadas por este asesor aparecerán aquí automáticamente.'}</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {advisorDossiers.map((d) => (
                      <div
                        key={d.id}
                        className={`p-4 rounded-2xl border transition space-y-3 flex flex-col justify-between ${
                          d.deletedByAdvisor
                            ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-400'
                            : 'bg-slate-950 border-slate-800 hover:border-amber-400/50'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                d.mode === 'create'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                  : d.mode === 'rescue'
                                  ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                                  : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                              }`}
                            >
                              {d.mode === 'create' ? (isEn ? '🏗️ New Listing' : '🏗️ Ficha Nueva') : d.mode === 'rescue' ? (isEn ? '🛡️ 72h Rescue' : '🛡️ Rescate 72h') : d.mode === 'appeal' ? (isEn ? '⚖️ 1-3★ Appeal' : '⚖️ Apelación 1-3★') : (isEn ? '🔬 Top 3 Audit' : '🔬 Auditoría Top 3')}
                            </span>

                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(d.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div>
                            <h5 className="font-black text-white text-sm leading-tight">{d.clientName}</h5>
                            <p className="text-slate-400 text-xs mt-0.5">
                              📍 {d.city}, {d.country || 'Colombia'} {d.neighborhood ? `• ${d.neighborhood}` : ''}
                            </p>
                            <span className="text-[11px] text-indigo-400 font-bold block">{d.category}</span>
                          </div>

                          {/* Datos del Cliente Contratante */}
                          {(d.contactName || d.contactCompany || d.contactPhone || d.contactEmail) && (
                            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                              <div className="flex items-center justify-between text-slate-300 font-bold">
                                <span className="flex items-center gap-1.5 text-indigo-300">
                                  <User className="w-3.5 h-3.5 text-indigo-400" />
                                  <span>{d.contactName || 'Cliente Contratante'}</span>
                                </span>
                                {d.contactRole && (
                                  <span className="text-[9px] font-normal text-slate-400">({d.contactRole})</span>
                                )}
                              </div>
                              {d.contactCompany && (
                                <p className="text-[10px] text-slate-400">🏢 {d.contactCompany}</p>
                              )}
                              <div className="flex items-center gap-2 pt-0.5 text-[10px]">
                                {d.contactPhone && (
                                  <a
                                    href={`https://wa.me/${d.contactPhone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-0.5"
                                  >
                                    <Phone className="w-3 h-3" />
                                    <span>{d.contactPhone}</span>
                                  </a>
                                )}
                                {d.contactEmail && (
                                  <a
                                    href={`mailto:${d.contactEmail}`}
                                    className="text-indigo-400 hover:text-indigo-300 truncate"
                                  >
                                    {d.contactEmail}
                                  </a>
                                )}
                              </div>
                            </div>
                          )}

                          {d.closingStatus && (
                            <div className="flex items-center justify-between text-[10.5px] p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                              <span className="text-slate-400">Estado de Cierre:</span>
                              <span className="font-bold text-amber-300">
                                {d.closingStatus === 'prestigia_subscriber' ? '💎 Suscriptor Prestigia' : d.closingStatus === 'setup_paid' ? '💵 Setup Pagado' : '📝 En Estudio'}
                              </span>
                            </div>
                          )}

                          {/* Forensic Badge if deleted by advisor */}
                          {d.deletedByAdvisor && (
                            <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-[11px] space-y-1.5">
                              <div className="flex items-center justify-between text-rose-300 font-bold">
                                <span className="flex items-center gap-1.5">
                                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                  <span>{isEn ? 'Profile Deleted by Advisor' : 'Ficha Borrada por el Asesor'}</span>
                                </span>
                                <span className="text-[9.5px] font-mono text-slate-400">
                                  {d.deletedAt ? new Date(d.deletedAt).toLocaleString() : 'Archivado'}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 leading-tight">
                                {isEn
                                  ? '🔒 General Management Forensic Vault. This profile was removed by the user but remains in your database for auditing.'
                                  : '🔒 Bóveda Forense de Dirección General. Esta ficha fue eliminada por el usuario pero permanece en tu base de datos para auditoría.'}
                              </p>
                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleRestoreDossier(d.id)}
                                  className="flex-1 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 font-bold text-[10px] transition cursor-pointer flex items-center justify-center gap-1"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  <span>{isEn ? 'Restore Profile' : 'Restaurar Ficha'}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteDossier(d.id, true)}
                                  className="px-2.5 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 font-bold text-[10px] transition cursor-pointer flex items-center justify-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>{isEn ? 'Permanent Purge' : 'Purgar Definitivo'}</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setViewingAdvisorWorks(null);
                            handleLoadDossier(d);
                          }}
                          className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-98"
                        >
                          <span>{isEn ? '👁️ Load Profile into Workspace' : '👁️ Cargar Ficha en Workspace'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Pie Fijo del Modal */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/95 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setViewingAdvisorWorks(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REGISTRAR NUEVO ASESOR O LICENCIAR AGENCIA PARTNER */}
      {showRegisterAdvisorModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 print:hidden animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
            <div className="p-5 sm:p-6 pb-4 border-b border-slate-800 bg-slate-900/95 flex items-start justify-between gap-4 shrink-0">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>{tNetwork.registerTitle}</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{tNetwork.registerDesc}</p>
              </div>

              <button
                type="button"
                onClick={() => setShowRegisterAdvisorModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Toggle Tipo de Cuenta: Asesor o Agencia Partner (Dirección General es exclusiva y única de Luisma) */}
            <div className="p-3 bg-slate-950/80 border-b border-slate-800 shrink-0">
              <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setNewAccountType('internal_advisor');
                    setNewAdvisorMaxCreates(30);
                    setNewAdvisorMaxAudits(30);
                    setNewAdvisorMaxRescues(10);
                  }}
                  className={`py-2 px-3 rounded-xl font-black transition cursor-pointer flex items-center justify-center gap-1.5 text-xs ${
                    newAccountType === 'internal_advisor'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{isEn ? 'Sales Advisor' : '💼 Asesor Comercial'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNewAccountType('partner_agency');
                    setNewAdvisorMaxCreates(60);
                    setNewAdvisorMaxAudits(60);
                    setNewAdvisorMaxRescues(20);
                  }}
                  className={`py-2 px-3 rounded-xl font-black transition cursor-pointer flex items-center justify-center gap-1.5 text-xs ${
                    newAccountType === 'partner_agency'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{isEn ? 'Partner Agency' : '🏢 Agencia Partner'}</span>
                </button>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                await handleCreateAdvisor(e);
                setShowRegisterAdvisorModal(false);
              }}
              className="flex flex-col flex-1 overflow-hidden min-h-0"
            >
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  {newAccountType === 'partner_agency'
                    ? (isEn ? 'Partner Agency Business Name *' : 'Razón Social o Nombre de la Agencia *')
                    : (isEn ? 'Sales Advisor Full Name *' : 'Nombre Completo del Asesor Comercial *')}
                </label>
                <input
                  type="text"
                  value={newAdvisorName}
                  onChange={(e) => setNewAdvisorName(e.target.value)}
                  placeholder={
                    newAccountType === 'partner_agency'
                      ? (isEn ? 'e.g. Apex Local Growth Agency' : 'Ej: Agencia Digital Rocket 360')
                      : (isEn ? 'e.g. Michael Smith' : 'Ej: Carlos Gómez')
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">{tNetwork.countryLabel} *</label>
                  <input
                    type="text"
                    value={newAdvisorCountry}
                    onChange={(e) => setNewAdvisorCountry(e.target.value)}
                    placeholder="Colombia, México, Venezuela..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">{tNetwork.cityLabel} *</label>
                  <input
                    type="text"
                    value={newAdvisorCity}
                    onChange={(e) => setNewAdvisorCity(e.target.value)}
                    placeholder="Bogotá, Medellín, CDMX, Caracas..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">{tNetwork.userLabel} *</label>
                  <input
                    type="text"
                    value={newAdvisorUser}
                    onChange={(e) => setNewAdvisorUser(e.target.value)}
                    placeholder="ej: carlos o rocketagency"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white lowercase focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">{tNetwork.passLabel} *</label>
                  <input
                    type="text"
                    value={newAdvisorPass}
                    onChange={(e) => setNewAdvisorPass(e.target.value)}
                    placeholder="Contraseña de acceso"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">{tNetwork.phoneLabel}</label>
                <input
                  type="text"
                  value={newAdvisorPhone}
                  onChange={(e) => setNewAdvisorPhone(e.target.value)}
                  placeholder="+573051234567"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              {/* Canon y Estado de Licencia (Asesores y Agencias) */}
              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-2.5">
                <div className="flex items-center gap-1.5 text-purple-300 font-bold text-xs">
                  <DollarSign className="w-4 h-4 text-purple-400" />
                  <span>{isEn ? 'Monthly Software License Configuration:' : 'Configuración de Canon Mensual de Licencia:'}</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 mb-1">
                      {isEn ? 'Monthly License Fee (USD/mo)' : 'Canon Mensual de Licencia (USD/mes)'}
                    </label>
                    <input
                      type="number"
                      value={newAdvisorMonthlyFee}
                      onChange={(e) => setNewAdvisorMonthlyFee(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-purple-500/50 text-purple-200 font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 mb-1">{tNetwork.licenseStatusLabel}</label>
                    <select
                      value={newAdvisorLicenseStatus}
                      onChange={(e) => setNewAdvisorLicenseStatus(e.target.value as any)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-purple-500/50 text-white focus:outline-none"
                    >
                      <option value="active">✅ Activa</option>
                      <option value="pending_payment">⏳ Pendiente de Pago</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Topes de Consumo Mensual de IA */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Topes de Consumo Mensual de IA (Freno de Abuso):</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Cupos / mes</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-400 mb-1">
                      Creaciones
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={newAdvisorMaxCreates}
                      onChange={(e) => setNewAdvisorMaxCreates(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-center focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-amber-400 mb-1">
                      Auditorías
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={newAdvisorMaxAudits}
                      onChange={(e) => setNewAdvisorMaxAudits(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-center focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-rose-400 mb-1">
                      Rescates
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={newAdvisorMaxRescues}
                      onChange={(e) => setNewAdvisorMaxRescues(Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-center focus:outline-none focus:border-rose-400"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 italic">
                  * Al agotar el cupo mensual, la herramienta se bloqueará automáticamente hasta el siguiente mes o hasta que Dirección General le recargue más usos.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Clave Maestra de Dueño (Luisma) *</label>
                <input
                  type="password"
                  value={adminMasterKey}
                  onChange={(e) => setAdminMasterKey(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-amber-500/40 text-amber-300 font-mono focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Botonera Fija Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/95 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowRegisterAdvisorModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSavingAdvisor}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg active:scale-98"
              >
                {isSavingAdvisor
                  ? 'Registrando...'
                  : newAccountType === 'partner_agency'
                  ? '🚀 Activar Licencia de Agencia Partner'
                  : '💼 + Crear Asesor Comercial'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* MODAL: MODIFICAR CUENTA DE ASESOR / AGENCIA PARTNER */}
    {showEditAdvisorModal && editingAdvisor && (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 print:hidden animate-in fade-in duration-200">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
          {/* Cabecera Fija */}
          <div className="p-5 sm:p-6 pb-4 border-b border-slate-800 bg-slate-900/95 flex items-start justify-between gap-4 shrink-0">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>{isEn ? 'Modify Account Details' : 'Modificar Cuenta de Usuario'}</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {editingAdvisor.name} (@{editingAdvisor.username})
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowEditAdvisorModal(false);
                setEditingAdvisor(null);
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveAdvisorEdit} className="flex flex-col flex-1 overflow-hidden min-h-0">
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  {editAdvisorAccountType === 'founder'
                    ? (isEn ? 'Founder & Master Director Name *' : 'Nombre del Fundador & Director General *')
                    : editAdvisorAccountType === 'partner_agency'
                    ? (isEn ? 'Partner Agency Name *' : 'Razón Social o Nombre de la Agencia *')
                    : (isEn ? 'Advisor Full Name *' : 'Nombre Completo del Asesor *')}
                </label>
                <input
                  type="text"
                  value={editAdvisorName}
                  onChange={(e) => setEditAdvisorName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">{isEn ? 'Username *' : 'Usuario de Acceso *'}</label>
                  <input
                    type="text"
                    value={editAdvisorUser}
                    onChange={(e) => setEditAdvisorUser(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white lowercase focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    {isEn ? 'New Password' : 'Nueva Contraseña'}
                  </label>
                  <input
                    type="text"
                    value={editAdvisorPass}
                    onChange={(e) => setEditAdvisorPass(e.target.value)}
                    placeholder={isEn ? '(Leave empty to keep current)' : '(En blanco = mantener actual)'}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">{isEn ? 'Country' : 'País'}</label>
                  <input
                    type="text"
                    value={editAdvisorCountry}
                    onChange={(e) => setEditAdvisorCountry(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">{isEn ? 'City' : 'Ciudad'}</label>
                  <input
                    type="text"
                    value={editAdvisorCity}
                    onChange={(e) => setEditAdvisorCity(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">{isEn ? 'Phone / WhatsApp' : 'Teléfono / WhatsApp'}</label>
                <input
                  type="text"
                  value={editAdvisorPhone}
                  onChange={(e) => setEditAdvisorPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Account Type and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">{isEn ? 'Account Type' : 'Tipo de Cuenta'}</label>
                  {editingAdvisor?.accountType === 'founder' ? (
                    <div className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-amber-500/40 text-amber-300 font-bold flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        <span>👑 Fundador & Director General</span>
                      </span>
                      <span className="text-[10px] text-amber-400 font-black uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        Único
                      </span>
                    </div>
                  ) : (
                    <select
                      value={editAdvisorAccountType}
                      onChange={(e) => setEditAdvisorAccountType(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                    >
                      <option value="internal_advisor">{isEn ? '💼 Sales Advisor' : '💼 Asesor Comercial Interno'}</option>
                      <option value="partner_agency">{isEn ? '🏢 Partner Agency (B2B)' : '🏢 Agencia Partner (Licencia Mensual)'}</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">{isEn ? 'License Status' : 'Estatus de Cuenta'}</label>
                  {editingAdvisor?.accountType === 'founder' ? (
                    <div className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>✅ Activa (Permanente)</span>
                      </span>
                      <span className="text-[10px] text-amber-400 font-black uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        Inalterable
                      </span>
                    </div>
                  ) : (
                    <select
                      value={editAdvisorLicenseStatus}
                      onChange={(e) => setEditAdvisorLicenseStatus(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                    >
                      <option value="active">{isEn ? '✅ Active' : '✅ Activa'}</option>
                      <option value="pending_payment">{isEn ? '⏳ Payment Pending' : '⏳ Pendiente de Pago'}</option>
                      <option value="suspended">{isEn ? '⛔ Suspended' : '⛔ Suspendida'}</option>
                    </select>
                  )}
                </div>
              </div>

              {editingAdvisor?.accountType !== 'founder' && (
                <div>
                  <label className="block font-bold text-purple-300 mb-1">
                    {isEn ? 'Monthly Software Fee (USD/mo)' : 'Canon Mensual de Licencia (USD/mes)'}
                  </label>
                  <input
                    type="number"
                    value={editAdvisorMonthlyFee}
                    onChange={(e) => setEditAdvisorMonthlyFee(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-purple-500/50 text-purple-300 font-bold focus:outline-none"
                  />
                </div>
              )}

              {editingAdvisor?.accountType !== 'founder' && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>{isEn ? 'Monthly AI Usage Limits (Reload Uses):' : 'Topes de Consumo Mensual de IA (Cargar más Usos):'}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Cupos / mes</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <label className="block text-[10px] font-bold text-emerald-400 mb-1">
                        Creaciones
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="1000"
                        value={editAdvisorMaxCreates}
                        onChange={(e) => setEditAdvisorMaxCreates(Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-center focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-amber-400 mb-1">
                        Auditorías
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="1000"
                        value={editAdvisorMaxAudits}
                        onChange={(e) => setEditAdvisorMaxAudits(Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-center focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-rose-400 mb-1">
                        Rescates
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="1000"
                        value={editAdvisorMaxRescues}
                        onChange={(e) => setEditAdvisorMaxRescues(Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-center focus:outline-none focus:border-rose-400"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 italic">
                    * Puedes aumentar el número de creaciones, auditorías y rescates para otorgar más créditos al asesor o agencia en tiempo real.
                  </p>
                </div>
              )}
            </div>

            {/* Botonera Fija Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/95 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowEditAdvisorModal(false);
                  setEditingAdvisor(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                {isEn ? 'Cancel' : 'Cancelar'}
              </button>

              <button
                type="submit"
                disabled={isUpdatingAdvisor}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg active:scale-98"
              >
                {isUpdatingAdvisor ? (isEn ? 'Saving...' : 'Guardando...') : (isEn ? 'Save Changes' : 'Guardar Cambios')}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
      </main>

      {/* MODAL: LOGIN / SELECTOR DE PERFIL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 print:hidden animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-center space-y-4 max-h-[92vh] overflow-y-auto my-auto">
            {currentUser ? (
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs text-rose-400 hover:text-rose-300 font-bold transition cursor-pointer flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Log out' : 'Cerrar Sesión'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginUsername('');
                    setLoginPassword('');
                    setLoginError('');
                    setShowAuthModal(false);
                  }}
                  className="text-slate-500 hover:text-white text-xs font-bold px-2 py-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                >
                  {tAuth.close}
                </button>
              </div>
            ) : (
              <div className="pb-1 border-b border-slate-800 text-center">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  {isEn ? '🔒 Access Control • Identification Required' : '🔒 Control de Acceso • Identificación Requerida'}
                </span>
              </div>
            )}

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 flex items-center justify-center mx-auto shadow-xl p-2.5 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-indigo-500/20 rounded-2xl blur-sm" />
              <PrestigiaIcon className="w-full h-full relative z-10 drop-shadow-md" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">{tAuth.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{tAuth.subtitle}</p>
            </div>

            <form onSubmit={handleLogin} autoComplete="off" className="space-y-3 text-left text-xs pt-2">
              {/* Trampa anti-autocompletado para gestores de contraseñas de navegadores */}
              <div style={{ position: 'absolute', opacity: 0, height: 0, width: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }} aria-hidden="true">
                <input type="text" name="prestigia_decoy_user" tabIndex={-1} autoComplete="off" defaultValue="" />
                <input type="password" name="prestigia_decoy_pass" tabIndex={-1} autoComplete="new-password" defaultValue="" />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">{tAuth.usernameLabel}</label>
                <input
                  type="text"
                  name="prestigia_id_user"
                  id="prestigia_id_user"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  data-lpignore="true"
                  data-1p-ignore="true"
                  readOnly={!userFieldActive}
                  onFocus={() => setUserFieldActive(true)}
                  onClick={() => setUserFieldActive(true)}
                  value={loginUsername}
                  onChange={(e) => {
                    setLoginUsername(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  placeholder={isEn ? 'Enter your username' : 'Ingresa tu usuario'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Sección Dinámica: Identificador Inteligente de Rango y Perfil */}
              {detectedLoginUser && (
                <div
                  className={`p-3 rounded-2xl border transition-all animate-in fade-in zoom-in-95 duration-200 ${
                    detectedLoginUser.accountType === 'founder'
                      ? 'bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-500/10'
                      : detectedLoginUser.accountType === 'partner_agency'
                      ? 'bg-gradient-to-r from-purple-950/70 via-slate-900 to-purple-950/40 border-purple-500/50 shadow-lg shadow-purple-500/10'
                      : detectedLoginUser.accountType === 'internal_advisor'
                      ? 'bg-gradient-to-r from-indigo-950/70 via-slate-900 to-indigo-950/40 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shadow shrink-0 ${
                        detectedLoginUser.accountType === 'founder'
                          ? 'bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 ring-2 ring-amber-400/40'
                          : detectedLoginUser.accountType === 'partner_agency'
                          ? 'bg-purple-600 text-white ring-2 ring-purple-400/30'
                          : detectedLoginUser.accountType === 'internal_advisor'
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-400/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {detectedLoginUser.accountType === 'founder'
                        ? '👑'
                        : detectedLoginUser.accountType === 'partner_agency'
                        ? '🏢'
                        : detectedLoginUser.accountType === 'internal_advisor'
                        ? '💼'
                        : '❓'}
                    </div>

                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-white text-xs truncate">
                          {detectedLoginUser.fullName}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                            detectedLoginUser.accountType === 'founder'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                              : detectedLoginUser.accountType === 'partner_agency'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                              : detectedLoginUser.accountType === 'internal_advisor'
                              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {detectedLoginUser.badgeLabel}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-tight truncate">
                        {detectedLoginUser.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-300 mb-1">{tAuth.passwordLabel}</label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="prestigia_sec_token"
                    id="prestigia_sec_token"
                    autoComplete="new-password"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    readOnly={!passFieldActive}
                    onFocus={() => setPassFieldActive(true)}
                    onClick={() => setPassFieldActive(true)}
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (loginError) setLoginError('');
                    }}
                    placeholder="••••"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400 font-mono text-xs tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-amber-400 transition cursor-pointer p-1"
                    title={showPassword ? (isEn ? 'Hide password' : 'Ocultar contraseña') : (isEn ? 'Show password' : 'Ver contraseña')}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {loginError && <p className="text-xs text-rose-400 font-bold">{loginError}</p>}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer border border-slate-700 active:scale-98"
              >
                {isLoggingIn ? tAuth.verifying : tAuth.btnLogin}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Agregar País al Catálogo */}
      {showAddCountryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[92vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{isEn ? 'Add New Country' : 'Agregar Nuevo País'}</h3>
                  <p className="text-[11px] text-slate-400">{isEn ? 'Will be added to the America & Europe regional catalog' : 'Se registrará en el catálogo de América y Europa'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddCountryModal(false);
                  setNewCountryInput('');
                                  }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Nombre del País *
                </label>
                <input
                  type="text"
                  autoFocus
                  value={newCountryInput}
                  onChange={(e) => setNewCountryInput(e.target.value)}
                  placeholder={isEn ? 'e.g. United Kingdom, Australia, Canada, Spain...' : 'Ej: Bolivia, Australia, Países Bajos, Paraguay...'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSaveNewCountry();
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setShowAddCountryModal(false);
                  setNewCountryInput('');
                                  }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!newCountryInput.trim()}
                onClick={handleSaveNewCountry}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-98 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isEn ? 'Save Country' : 'Guardar País'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Agregar Ciudad a País */}
      {showAddCityModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[92vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{isEn ? 'Add City' : 'Agregar Ciudad'}</h3>
                  <p className="text-[11px] text-slate-400">
                    Se enlazará automáticamente a <strong className="text-emerald-400">{targetCountryForNewCity}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddCityModal(false);
                  setNewCityInput('');
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  País al que Pertenece:
                </label>
                <select
                  value={targetCountryForNewCity}
                  onChange={(e) => setTargetCountryForNewCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-400 transition text-xs"
                >
                  {allCountriesList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Nombre de la Nueva Ciudad *
                </label>
                <input
                  type="text"
                  autoFocus
                  value={newCityInput}
                  onChange={(e) => setNewCityInput(e.target.value)}
                  placeholder="Ej: Envigado, Zapopan, Fort Lauderdale, Marbella..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSaveNewCity();
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setShowAddCityModal(false);
                  setNewCityInput('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!newCityInput.trim()}
                onClick={handleSaveNewCity}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-98 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isEn ? 'Save City' : 'Guardar Ciudad'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500 print:hidden">
        <p>Prestigia Local Studio™ • Google Maps Top 3 Optimization Engine © 2026</p>
      </footer>
    </div>
  );
}
