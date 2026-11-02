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
  RefreshCw,
  X,
  Phone,
  MessageSquare,
  Lock,
  ChevronRight,
  Building2,
  Trash2,
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
} from 'lucide-react';
import type { GooglePlaceData } from '@/app/api/auditor/google-lookup/route';

interface StudioAdvisorUser {
  id: string;
  name: string;
  username: string;
  phone: string;
  role: 'admin' | 'advisor';
  accountType?: 'internal_advisor' | 'partner_agency' | 'founder';
  country?: string;
  city?: string;
  monthlyFeeUsd?: number;
  licenseStatus?: 'active' | 'pending_payment' | 'suspended';
  active: boolean;
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
  category: string;
  city: string;
  neighborhood?: string;
  googleUrl?: string;
  mode: 'create' | 'audit';
  status: 'draft' | 'presented' | 'closed';
  data: BlueprintData;
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

const UI_TEXT = {
  es: {
    tagline: 'Suite de Creación & Optimización Google Maps',
    loginProfile: 'Ingresar Perfil',
    switchProfile: 'Cambiar',
    logoutBtn: 'Salir',
    downloadPdf: 'Descargar PDF',
    tabCreate: '🏗️ 1. Crear Ficha (Desde Cero)',
    tabAudit: '🔬 2. Auditar & Optimizar Ficha',
    tabRescue: '🛡️ 3. Rescatar Ficha Secuestrada',
    tabTools: '⚡ 4. Armas Top 3 (Geo-Grid & ROI)',
    tabDossiers: '📁 5. Mis Clientes (Luisma)',
    tabGuide: '📖 6. Guía Dónde Dar Clic en Google',
    tabPitch: '🗣️ 7. Guion Comercial para Asesores',
    tabNetwork: '🏢 8. Red de Asesores & Agencias B2B',
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
    neighborhood: 'Barrio o Zona',
    neighborhoodPlaceholder: 'Ej: Chapinero',
    coverageAreas: 'Zonas o Barrios de Cobertura a Domicilio',
    coveragePlaceholder: 'Ej: Zona Norte, Chicó, Usaquén, Salitre, Chía',
    specialties: '3 Platos o Servicios Más Vendidos',
    specialtiesPlaceholder: 'Ej: Hamburguesas artesanales, costillas BBQ, cócteles',
    phone: 'WhatsApp Comercial de Atención',
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
    tabCreate: '🏗️ 1. Build New Listing (From Scratch)',
    tabAudit: '🔬 2. Audit & Upgrade Existing Listing',
    tabRescue: '🛡️ 3. Rescue & Claim Profile',
    tabTools: '⚡ 4. Top 3 Weapons (Geo-Grid & ROI)',
    tabDossiers: '📁 5. My Clients (Luisma)',
    tabGuide: '📖 6. Step-by-Step Google Click Guide',
    tabPitch: '🗣️ 7. Sales Pitch & Objection Scripts',
    tabNetwork: '🏢 8. Sales Advisors & Agency Network',
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
    neighborhood: 'Neighborhood / District',
    neighborhoodPlaceholder: 'e.g. Brickell / 33131',
    coverageAreas: 'Target Service Coverage Areas / Neighborhoods',
    coveragePlaceholder: 'e.g. Brickell, Downtown, Coral Gables, South Beach',
    specialties: 'Top 3 Best-Selling Products or Services',
    specialtiesPlaceholder: 'e.g. Cosmetic Dentistry, Teeth Whitening, Veneers',
    phone: 'Commercial Phone / WhatsApp',
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
    title: '5 Armas de Dominio Local & Cierre Comercial',
    desc: 'Herramientas de venta visual y optimización forense para demostrarle al cliente cuánto dinero está perdiendo hoy y cómo Prestigia lo posiciona en la cima.',
    activeAlgo: '⚡ Algoritmo 2026 Activo',
    tab1: '1. Simulador Geo-Grid 3x3',
    tab2: '2. Calculadora de Pérdida Financiera (ROI)',
    tab3: '3. Inyector de Geo-Tagging EXIF',
    tab4: '4. Hub de Citaciones USA & LatAm',
    tab5: '5. Rival Spy (Cara a Cara)',
    tab6: '6. Rescate de Ficha (Ownership Claim)',
    rescueTitle: '🛡️ Rescue Radar: Rescate y Reclamación de Ficha Google Maps',
    rescueDesc: 'Protocolo oficial paso a paso para recuperar el control legal de una ficha existente cuando el dueño no tiene acceso, sin perder reseñas, fotos ni antigüedad.',
    rescueScenarioLabel: 'Selecciona el Diagnóstico Actual de la Ficha en Google Maps:',
    scenario1Title: 'Caso 1: Ficha Huérfana / "Reclamar esta empresa" (Sin Dueño Reclamado)',
    scenario1Subtitle: 'Aparece "¿Eres el propietario?" o "Reclamar esta empresa". Creada por la comunidad o bots de Google. Nadie tiene el control legal.',
    scenario2Title: 'Caso 2: Ficha Reclamada por Tercero (Ex-agencia o Ex-empleado)',
    scenario2Subtitle: 'Sale "Gestionada por c•••••@gmail.com". Activación del Protocolo Oficial de 72 Horas de Google.',
    scenario3Title: 'Caso 3: Solicitud Rechazada por Tercero de Mala Fe (Apelación Legal)',
    scenario3Subtitle: 'El tercero rechazó la entrega. Activación de Expediente Probatorio ante el Soporte Técnico de Google.',
    rescueBtnDirectClaim: 'Abrir Google Business Profile para Reclamar',
    rescueWhatsappScriptTitle: 'Guion de WhatsApp para Explicar el Rescate al Cliente',
    rescueDocsTitle: 'Checklist de Evidencias de Titularidad Probatoria',
    rescuePricingTitle: 'Propuesta de Honorarios por Rescate (Setup Fee)',
    geogridTitle: '🗺️ Simulador de Posición Geo-Grid 3x3 (Local Falcon Style)',
    geogridDesc: 'Demuestra visualmente cómo cae el ranking del cliente a medida que nos alejamos de su ubicación.',
    radiusLabel: 'Radio',
    satMap: 'Mapa Satelital de Cobertura',
    keyword: 'Palabra clave:',
    legendTop3: 'Puesto 1 al 3 (Se llevan el 84% de llamadas)',
    legendDropped: 'Puesto 4+ (Invisibles)',
    diagAdvisor: 'Diagnóstico para el Asesor:',
    diagAdvisorBody: (name: string, rad: string) =>
      `"Don ${name || 'Cliente'}, cuando usted busca parado en su propio local aparece de #1. Pero cuando una persona busca a solo ${rad} de distancia en su mismo barrio, su negocio cae al puesto #8 o #14. Toda esa clientela se la están llevando sus 3 competidores más cercanos."`,
    solutionPrestigia: 'Solución con Prestigia:',
    solutionPrestigiaBody:
      'Con la inyección de subcategorías secundarias, menciones de vecindario en la descripción y 8 reseñas semanales geolocalizadas, extendemos el radio verde a toda la ciudad en 90 días.',
    roiTitle: 'Calculadora de Pérdida Financiera por estar fuera del Top 3',
    roiDesc: 'Convierte la posición de Google Maps en dólares exactos perdidos por el cliente cada mes.',
    avgTicket: 'Ticket Promedio por Cliente (USD)',
    avgTicketSub: 'Lo que gasta un cliente promedio en su negocio.',
    currentRank: 'Posición Actual en Google Maps',
    rankOpt1: 'Puesto #4 (Al borde del Top 3)',
    rankOpt2: 'Puesto #8 (Segunda vista)',
    rankOpt3: 'Puesto #15+ (Completamente invisible)',
    currentRankSub: 'Lugar donde aparece hoy al buscar su servicio.',
    searches: 'Búsquedas Mensuales Estimadas en Zona',
    searchesSub: 'Personas buscando este servicio al mes.',
    leakDetected: 'Fuga de Facturación Detectada',
    leakHeading: 'Dinero que tu negocio está regalando a la competencia:',
    lostPer30Days: 'perdidos cada 30 días',
    lostCalls: 'Llamadas y Clics Perdidos:',
    searchesPerMonth: 'búsquedas/mes',
    lostClientsLabel: 'Clientes que no entraron:',
    newClientsPerMonth: 'clientes nuevos/mes',
    loss12Months: 'Pérdida en 12 Meses:',
    advisorClose: 'Cierre del Asesor:',
    advisorCloseBody:
      '"Prestigia le cuesta una fracción de lo que usted pierde en solo una semana sin estar en el Top 3. Con recuperar tan solo 2 clientes al mes, el servicio se paga solo y todo lo demás es ganancia neta."',
    geotagTitle: 'Inyector y Generador de Geo-Tagging EXIF para Fotos',
    geotagDesc: 'Google lee los metadatos IPTC y coordenadas de las fotos para validar la ubicación real del establecimiento.',
    photoName: 'Nombre Base de la Foto',
    photoNamePlaceholder: 'ej: fachada-principal o plato-insignia',
    indexingKeywords: 'Palabras Clave de Indexación',
    indexingKeywordsPlaceholder: 'ej: mejor restaurante, comida gourmet, centro',
    btnGeotag: 'Generar Nomenclatura & Etiquetas EXIF',
    toastGeotag: 'Metadatos EXIF generados',
    resultBox: 'Resultado para Renombrar Antes de Subir a Google:',
    geotagNote: 'Subir fotos con nombres geolocalizados y metadatos IPTC acelera en un 40% la indexación visual en Google Lens y Google Maps.',
    citationsTitle: 'Hub de Citaciones y Autoridad NAP (Name, Address, Phone)',
    citationsDesc: 'Directorio oficial para verificar la consistencia de los datos del cliente en internet y blindar su autoridad frente al algoritmo.',
    citationsUsa: 'Directorio Top de Citaciones EE.UU.',
    citationsLatam: 'Directorio Top de Citaciones LatAm',
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
    spyMove1: 'Acelerador de Reseñas 5★ con Dispositivos NFC Prestigia (+8 reseñas semanales para quebrar su ventaja)',
    spyMove2: 'Inyección de 5 Subcategorías Secundarias que el rival no tiene registradas',
    spyMove3: 'Booster de 30 Días de Google Posts & Geo-Tagging para superar su frescura algorítmica',
    spyPitchBox: 'Argumento de Cierre para el Asesor Comercial:',
    spyPitchText: (client: string, rival: string, weeks: number) =>
      `"Mire ${client || 'Don Cliente'}, ${rival || 'su competidor'} no ofrece mejor servicio que usted; simplemente tiene ${weeks} semanas de ventaja algorítmica en volumen de reseñas. Al activar Prestigia y nuestros dispositivos inteligentes NFC, su velocidad semanal superará a la de ellos en un 300% y en menos de 90 días Google lo colocará a usted de #1."`,
    spyBtnCopyPitch: 'Copiar Argumento de Cierre',
  },
  en: {
    badge: 'High-Value Conversion Arsenal • BrightLocal & Local Falcon Style',
    title: '5 Local Dominance & Commercial Closing Weapons',
    desc: 'Visual sales and forensic optimization tools showing clients how much revenue they are losing today and how Prestigia positions them at the top.',
    activeAlgo: '⚡ 2026 Algorithm Active',
    tab1: '1. 3x3 Geo-Grid Heatmap',
    tab2: '2. Financial Loss Calculator (ROI)',
    tab3: '3. EXIF Geo-Tagging Injector',
    tab4: '4. Citations Directory (USA/LatAm)',
    tab5: '5. Rival Spy (Head-to-Head)',
    tab6: '6. Listing Rescue (Ownership Claim)',
    rescueTitle: '🛡️ Rescue Radar: Google Maps Listing Rescue & Ownership Claim',
    rescueDesc: 'Official step-by-step protocol to recover ownership of an existing listing when the owner has no login access, preserving all reviews, photos, and rank.',
    rescueScenarioLabel: 'Select Current Profile Diagnosis on Google Maps:',
    scenario1Title: 'Case 1: Orphan Listing / "Claim this business" (Unclaimed Profile)',
    scenario1Subtitle: 'Displays "Own this business?" or "Claim this business". Created by Google Maps community or automated bots. No verified owner.',
    scenario2Title: 'Case 2: Claimed by Third Party (Ex-agency or Ex-employee)',
    scenario2Subtitle: 'Displays "Managed by c•••••@gmail.com". Activates Google 72-Hour Legal Transfer Protocol.',
    scenario3Title: 'Case 3: Request Rejected by Third Party in Bad Faith (Legal Appeal)',
    scenario3Subtitle: 'Third party rejected the transfer. Activates Evidentiary Appeal with Google Support Team.',
    rescueBtnDirectClaim: 'Open Google Business Profile to Claim',
    rescueWhatsappScriptTitle: 'WhatsApp Client Advisory Script (Copy & Send)',
    rescueDocsTitle: 'Ownership Proof & Legal Evidence Checklist',
    rescuePricingTitle: 'Rescue Fee Recommendation (Setup Fee)',
    geogridTitle: '🗺️ 3x3 Geo-Grid Position Heatmap (Local Falcon Style)',
    geogridDesc: 'Visually demonstrates how the client’s ranking drops as distance increases from their location.',
    radiusLabel: 'Radius',
    satMap: 'Satellite Coverage Heatmap',
    keyword: 'Target Keyword:',
    legendTop3: 'Ranks #1 to #3 (Captures 84% of calls & visits)',
    legendDropped: 'Rank #4+ (Completely Invisible)',
    diagAdvisor: 'Sales Advisor Script:',
    diagAdvisorBody: (name: string, rad: string) =>
      `"${name || 'Client'}, when you search standing inside your storefront, you appear #1. But when someone searches just ${rad} away in your same neighborhood, your business drops to rank #8 or #14. All those ready-to-buy customers are going straight to your 3 closest competitors."`,
    solutionPrestigia: 'Solution with Prestigia:',
    solutionPrestigiaBody:
      'With secondary category injection, geo-targeted neighborhood keywords in your commercial copy, and 8 weekly geo-tagged reviews, we expand your top-ranking radius across the entire metro area in 90 days.',
    roiTitle: 'Financial Loss Calculator for Ranking Outside Top 3',
    roiDesc: 'Converts Google Maps ranking drops into exact USD revenue lost by the business every month.',
    avgTicket: 'Average Ticket Value per Customer (USD)',
    avgTicketSub: 'Average amount spent by a customer at your business.',
    currentRank: 'Current Position on Google Maps',
    rankOpt1: 'Rank #4 (On the verge of Top 3)',
    rankOpt2: 'Rank #8 (Second view / below the fold)',
    rankOpt3: 'Rank #15+ (Completely invisible to searchers)',
    currentRankSub: 'Where the business ranks today for buyer-intent queries.',
    searches: 'Estimated Monthly Local Searches',
    searchesSub: 'Number of people searching for this service each month.',
    leakDetected: 'Revenue Leak Detected',
    leakHeading: 'Money your business is handing directly to competitors:',
    lostPer30Days: 'lost every 30 days',
    lostCalls: 'Lost Calls & Searches:',
    searchesPerMonth: 'searches/mo',
    lostClientsLabel: 'Lost Paying Customers:',
    newClientsPerMonth: 'new customers/mo',
    loss12Months: '12-Month Financial Loss:',
    advisorClose: 'Advisor Closing Pitch:',
    advisorCloseBody:
      '"Prestigia costs a fraction of what you lose in just one single week outside the Top 3. Recovering just 2 clients a month pays for the entire service, and every other client is pure profit for you."',
    geotagTitle: 'EXIF & IPTC Geo-Tagging Photo Generator',
    geotagDesc: 'Google scans IPTC metadata and GPS coordinates embedded in photos to verify authentic physical operations.',
    photoName: 'Base Photo Filename',
    photoNamePlaceholder: 'e.g. main-storefront or signature-dish',
    indexingKeywords: 'Target SEO Indexing Keywords',
    indexingKeywordsPlaceholder: 'e.g. best cosmetic dentist, dental implants, downtown',
    btnGeotag: 'Generate SEO Filename & EXIF Tags',
    toastGeotag: 'EXIF metadata tags generated',
    resultBox: 'SEO Filename to Rename Before Uploading to Google:',
    geotagNote: 'Uploading photos with geo-tagged names and IPTC keywords speeds up visual indexing in Google Lens and Maps by 40%.',
    citationsTitle: 'NAP Authority & Citations Hub (Name, Address, Phone)',
    citationsDesc: 'Official directory to verify client business data consistency across the web and build algorithm trust.',
    citationsUsa: 'Top USA Business Citations Directory',
    citationsLatam: 'Top LatAm Business Citations Directory',
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
    spyMove1: '5★ Review Velocity Accelerator with Prestigia Smart NFC Devices (+8 weekly reviews to eliminate their lead)',
    spyMove2: 'Secondary Category Injection capturing 5 high-intent keywords missing from competitor profile',
    spyMove3: '30-Day Google Posts Booster & Geo-Tagging to outpace competitor freshness signals',
    spyPitchBox: 'Advisor Closing Pitch Script:',
    spyPitchText: (client: string, rival: string, weeks: number) =>
      `"Take a look ${client || 'Client'}, ${rival || 'your competitor'} does not offer better quality than you; they simply have a ${weeks}-week algorithmic head-start in review volume. Once we activate Prestigia and our Smart NFC devices, your weekly velocity will beat theirs by 300% and Google will push you to #1 in under 90 days."`,
    spyBtnCopyPitch: 'Copy Closing Pitch',
  },
};

const TXT_DOSSIERS = {
  es: {
    privateBadge: '⭐ Cartera Personal Privada',
    accountOwner: '• Luisma (Cuenta Principal)',
    title: 'Mis Clientes & Auditorías Privadas',
    desc: 'Expedientes creados y auditados personalmente por ti. Tus clientes están 100% aislados y protegidos de la red comercial.',
    searchPlaceholder: 'Buscar en mis clientes...',
    kpiDossiers: 'Mis Expedientes',
    kpiCreated: 'Fichas Desde Cero',
    kpiAudited: 'Auditorías Top 3',
    kpiPrivacy: 'Privacidad',
    kpiPrivacyVal: '100% Blindado',
    filterBy: 'Filtrar por:',
    filterAll: 'Todos',
    filterCreate: '🏗️ Fichas Nuevas',
    filterAudit: '🔬 Auditorías Top 3',
    showingNotice: 'Mostrando únicamente clientes de la cuenta principal',
    loading: 'Cargando tu cartera personal...',
    emptyTitle: 'No tienes clientes guardados en tu cuenta personal',
    emptyDesc: 'Genera una nueva ficha desde cero o una auditoría en los módulos principales para registrar tu primer cliente.',
    btnCreateFirst: '🏗️ Crear Primera Ficha Ganadora',
    badgeCreate: '🏗️ Ficha Nueva',
    badgeAudit: '🔬 Auditoría Top 3',
    ownerBadge: '👑 Luisma (Cuenta Principal)',
    btnLoadView: '👁️ Cargar y Ver',
    sendWhatsappKit: 'Enviar Kit por WhatsApp',
    deleteDossier: 'Eliminar Expediente',
    confirmDelete: '¿Eliminar este expediente de forma definitiva?',
  },
  en: {
    privateBadge: '⭐ Private Client Portfolio',
    accountOwner: '• Luisma (Main Account)',
    title: 'My Clients & Private Audits',
    desc: 'Dossiers created and audited personally by you. Your clients are 100% isolated and protected from the advisor sales network.',
    searchPlaceholder: 'Search in my clients...',
    kpiDossiers: 'My Dossiers',
    kpiCreated: 'Built From Scratch',
    kpiAudited: 'Top 3 Audits',
    kpiPrivacy: 'Privacy',
    kpiPrivacyVal: '100% Shielded',
    filterBy: 'Filter by:',
    filterAll: 'All',
    filterCreate: '🏗️ New Listings',
    filterAudit: '🔬 Top 3 Audits',
    showingNotice: 'Displaying exclusively main account clients',
    loading: 'Loading your private portfolio...',
    emptyTitle: 'No clients saved in your private account yet',
    emptyDesc: 'Build a new listing from scratch or run an audit in the main modules to save your first client dossier.',
    btnCreateFirst: '🏗️ Build First Winning Listing',
    badgeCreate: '🏗️ New Listing',
    badgeAudit: '🔬 Top 3 Audit',
    ownerBadge: '👑 Luisma (Main Account)',
    btnLoadView: '👁️ Load & View',
    sendWhatsappKit: 'Send Kit via WhatsApp',
    deleteDossier: 'Delete Dossier',
    confirmDelete: 'Are you sure you want to permanently delete this dossier?',
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
    step6Body: 'Upload the renamed photos following the tool’s SEO checklist. Then deploy the Prestigia Smart Review NFC/QR plates on counters to start capturing 5★ Google reviews immediately.',
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
  const [loginUsername, setLoginUsername] = useState('luisma');
  const [loginPassword, setLoginPassword] = useState('1234');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Active Workspace Tab
  const [activeTab, setActiveTab] = useState<'create' | 'audit' | 'rescue' | 'tools' | 'dossiers' | 'guide' | 'pitch' | 'advisors' | 'network'>('create');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Check persisted session
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
          // If stored was old legacy advisor, upgrade to Luisma Director General
          if (parsed.id === 'adv-brayan') {
            const founderUser: StudioAdvisorUser = {
              id: 'adv-luisma',
              name: 'Luisma • Director General & Founder',
              username: 'luisma',
              phone: '+573058314049',
              role: 'admin',
              active: true,
            };
            setCurrentUser(founderUser);
            localStorage.setItem('prestigia_studio_advisor', JSON.stringify(founderUser));
            return;
          }
          setCurrentUser(parsed);
          return;
        }
      }
    } catch {}

    // Default: Luisma (Director General & Founder) with full admin authority
    const founderUser: StudioAdvisorUser = {
      id: 'adv-luisma',
      name: 'Luisma • Director General & Founder',
      username: 'luisma',
      phone: '+573058314049',
      role: 'admin',
      active: true,
    };
    setCurrentUser(founderUser);
    localStorage.setItem('prestigia_studio_advisor', JSON.stringify(founderUser));
  }, []);

  const handleQuickLogin = (roleType: 'luisma' | 'carlos') => {
    if (roleType === 'luisma') {
      const founderUser: StudioAdvisorUser = {
        id: 'adv-luisma',
        name: 'Luisma • Director General & Founder',
        username: 'luisma',
        phone: '+573058314049',
        role: 'admin',
        active: true,
      };
      setCurrentUser(founderUser);
      localStorage.setItem('prestigia_studio_advisor', JSON.stringify(founderUser));
      localStorage.setItem('prestigia_studio_advisor_explicit', 'true');
      localStorage.removeItem('prestigia_studio_logged_out');
      setShowAuthModal(false);
      showToast('👑 Perfil activo: Luisma • Director General & Founder');
    } else {
      const advisorUser: StudioAdvisorUser = {
        id: 'adv-carlos',
        name: 'Carlos Mendoza • Asesor Comercial',
        username: 'carlos',
        phone: '+573104567890',
        role: 'advisor',
        active: true,
      };
      setCurrentUser(advisorUser);
      localStorage.setItem('prestigia_studio_advisor', JSON.stringify(advisorUser));
      localStorage.setItem('prestigia_studio_advisor_explicit', 'true');
      localStorage.removeItem('prestigia_studio_logged_out');
      setShowAuthModal(false);
      showToast('💼 Perfil activo: Carlos • Consultor Comercial');
    }
  };

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
    setShowAuthModal(true);
    showToast(isEn ? '👋 Session closed successfully' : '👋 Sesión cerrada exitosamente');
  };

  // -------------------------------------------------------------
  // 2. WORKSPACE FORM STATE
  // -------------------------------------------------------------
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [city, setCity] = useState('Bogotá');
  const [neighborhood, setNeighborhood] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [phone, setPhone] = useState('');
  const [googleUrl, setGoogleUrl] = useState('');
  const [existingRating, setExistingRating] = useState<number>(4.2);
  const [existingReviews, setExistingReviews] = useState<number>(0);
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [businessModel, setBusinessModel] = useState<'storefront' | 'service_area'>('storefront');
  const [serviceAreas, setServiceAreas] = useState('');

  const t = UI_TEXT[lang] || UI_TEXT.es;
  const tTools = TXT_TOOLS[lang] || TXT_TOOLS.es;
  const tDossiers = TXT_DOSSIERS[lang] || TXT_DOSSIERS.es;
  const tGuide = TXT_GUIDE[lang] || TXT_GUIDE.es;
  const tPitch = TXT_PITCH[lang] || TXT_PITCH.es;
  const tNetwork = TXT_NETWORK[lang] || TXT_NETWORK.es;
  const tAuth = TXT_AUTH[lang] || TXT_AUTH.es;
  const isEn = lang === 'en';
  const categoryOptions = lang === 'en' ? CATEGORY_OPTIONS_EN : CATEGORY_OPTIONS_ES;

  const handleToggleLang = (newLang: 'es' | 'en') => {
    setLang(newLang);
    const fromOptions = newLang === 'en' ? CATEGORY_OPTIONS_ES : CATEGORY_OPTIONS_EN;
    const toOptions = newLang === 'en' ? CATEGORY_OPTIONS_EN : CATEGORY_OPTIONS_ES;
    const idx = fromOptions.indexOf(category);
    if (idx !== -1 && toOptions[idx]) {
      setCategory(toOptions[idx]);
    } else if (!toOptions.includes(category)) {
      setCategory(toOptions[0]);
    }
    showToast(newLang === 'en' ? '🇺🇸 Language switched to English' : '🇨🇴 Idioma cambiado a Español');
  };

  // Generator Result State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<BlueprintData | null>(null);

  // Module 2 Google Maps 1-Click Scanner & Live Audit State
  const [auditQuery, setAuditQuery] = useState('');
  const [isScanningListing, setIsScanningListing] = useState(false);
  const [scannedListing, setScannedListing] = useState<GooglePlaceData | null>(null);
  const [showManualAuditFields, setShowManualAuditFields] = useState(false);

  // 5 Elite Local SEO Power Tools State
  const [toolsActiveTab, setToolsActiveTab] = useState<'geogrid' | 'roicalc' | 'geotag' | 'citations' | 'rivalspy'>('geogrid');
  const [geoGridRadius, setGeoGridRadius] = useState<'1km' | '3km' | '5km'>('3km');
  const [roiAverageTicket, setRoiAverageTicket] = useState<number>(65);
  const [roiCurrentRank, setRoiCurrentRank] = useState<number>(8);
  const [roiMonthlySearches, setRoiMonthlySearches] = useState<number>(1200);
  const [geoTagFilename, setGeoTagFilename] = useState('');
  const [geoTagKeywords, setGeoTagKeywords] = useState('');
  const [geoTagResult, setGeoTagResult] = useState<string | null>(null);

  // Rescue Radar (Ownership Claim Engine) State
  const [rescueScenario, setRescueScenario] = useState<'orphan' | 'third_party' | 'rejected'>('third_party');
  const [rescueMaskedEmail, setRescueMaskedEmail] = useState('c•••••@gmail.com');

  // Rival Spy (Head-to-Head Competitor Radar) State
  const [rivalName, setRivalName] = useState('Competidor Líder');
  const [rivalRating, setRivalRating] = useState<number>(4.8);
  const [rivalReviews, setRivalReviews] = useState<number>(185);
  const [rivalWeeklyPace, setRivalWeeklyPace] = useState<number>(3);
  const [rivalPhotos, setRivalPhotos] = useState<number>(65);

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
    if (typeof window !== 'undefined' && businessName.trim()) {
      try {
        const saved = localStorage.getItem(`prestigia_checklist_${businessName.trim()}`);
        if (saved) {
          setCheckedSteps(JSON.parse(saved));
        } else {
          setCheckedSteps({});
        }
      } catch {
        setCheckedSteps({});
      }
    }
  }, [businessName]);

  const toggleChecklistStep = (stepId: string) => {
    setCheckedSteps((prev) => {
      const updated = { ...prev, [stepId]: !prev[stepId] };
      if (typeof window !== 'undefined' && businessName.trim()) {
        try {
          localStorage.setItem(`prestigia_checklist_${businessName.trim()}`, JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  };

  const checklistItems = useMemo(() => {
    const isSab = businessModel === 'service_area';
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
        title: isEn ? '9. ⚡ Final Step: Prestigia Shield & Smart NFC Hardware Activation' : '9. ⚡ Paso Final: Blindaje con Prestigia y Activación de Dispositivos NFC',
        desc: isEn
          ? 'Connect listing to Prestigia Portal for 1-3★ review protection, 5★ review velocity, and on-site NFC chips'
          : 'Vincular ficha al Portal Prestigia para filtrar reseñas de 1 a 3★, acelerar 5★ y activar chips NFC',
        isHero: true,
      },
    ];
  }, [isEn, businessModel]);

  const completedChecklistCount = checklistItems.filter((item) => checkedSteps[item.id]).length;
  const checklistProgressPercent = Math.round((completedChecklistCount / checklistItems.length) * 100);

  const [savedDossiers, setSavedDossiers] = useState<StudioDossierRecord[]>([]);
  const [isLoadingDossiers, setIsLoadingDossiers] = useState(false);
  const [dossierSearch, setDossierSearch] = useState('');
  const [dossierModeFilter, setDossierModeFilter] = useState<'all' | 'create' | 'audit'>('all');

  // Network (Advisors & Agencies B2B) State
  const [networkSubView, setNetworkSubView] = useState<'monitor' | 'register' | 'directory'>('monitor');
  const [networkSearch, setNetworkSearch] = useState('');
  const [networkAdvisorFilter, setNetworkAdvisorFilter] = useState('all');
  const [networkTypeFilter, setNetworkTypeFilter] = useState<'all' | 'internal_advisor' | 'partner_agency'>('all');
  const [networkCountryFilter, setNetworkCountryFilter] = useState('all');
  const [networkCityFilter, setNetworkCityFilter] = useState('all');
  const [networkModeFilter, setNetworkModeFilter] = useState<'all' | 'create' | 'audit'>('all');

  // Advisors & Agencies List (for Admin tab)
  const [advisorsList, setAdvisorsList] = useState<StudioAdvisorUser[]>([]);
  const [newAccountType, setNewAccountType] = useState<'internal_advisor' | 'partner_agency'>('internal_advisor');
  const [newAdvisorName, setNewAdvisorName] = useState('');
  const [newAdvisorUser, setNewAdvisorUser] = useState('');
  const [newAdvisorPass, setNewAdvisorPass] = useState('');
  const [newAdvisorPhone, setNewAdvisorPhone] = useState('+57');
  const [newAdvisorCountry, setNewAdvisorCountry] = useState('Colombia');
  const [newAdvisorCity, setNewAdvisorCity] = useState('Bogotá');
  const [newAdvisorMonthlyFee, setNewAdvisorMonthlyFee] = useState<number>(49);
  const [newAdvisorLicenseStatus, setNewAdvisorLicenseStatus] = useState<'active' | 'pending_payment'>('active');
  const [adminMasterKey, setAdminMasterKey] = useState('admin');
  const [isSavingAdvisor, setIsSavingAdvisor] = useState(false);

  // Fetch dossiers when entering dossiers tab or on user change
  const fetchDossiers = async () => {
    setIsLoadingDossiers(true);
    try {
      const isAdmin = currentUser?.role === 'admin' || !currentUser;
      const url = isAdmin
        ? '/api/local-studio/dossiers?isAdmin=true'
        : `/api/local-studio/dossiers?advisorId=${currentUser?.id || 'adv-luisma'}`;
      const res = await fetch(url);
      const resData = await res.json();
      if (resData.success && Array.isArray(resData.dossiers)) {
        setSavedDossiers(resData.dossiers);
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
    if (activeTab === 'advisors' && currentUser?.role === 'admin') {
      fetchAdvisors();
    }
  }, [activeTab]);

  const fetchAdvisors = async () => {
    try {
      const res = await fetch('/api/local-studio/advisors');
      const data = await res.json();
      if (data.success && Array.isArray(data.advisors)) {
        setAdvisorsList(data.advisors);
      }
    } catch (err) {
      console.warn('Error fetching advisors:', err);
    }
  };

  // -------------------------------------------------------------
  // 3. GENERATION ACTION (LIVE GEMINI + HEURISTIC ENGINE)
  // -------------------------------------------------------------
  const handleGenerate = async (
    targetMode: 'create' | 'audit',
    overrides?: {
      businessName?: string;
      category?: string;
      city?: string;
      neighborhood?: string;
      googleUrl?: string;
      existingRating?: number;
      existingReviews?: number;
      phone?: string;
      reviewHighlights?: string[];
    }
  ) => {
    const finalBizName = (overrides?.businessName ?? businessName).trim();
    if (!finalBizName) {
      showToast(isEn ? '⚠️ Please enter the business name or link' : '⚠️ Ingresa el nombre comercial o enlace del negocio');
      return;
    }

    setIsGenerating(true);
    setGeneratedData(null);

    const finalCategory = overrides?.category ?? category;
    const finalCity = (overrides?.city ?? city).trim() || 'Colombia';
    const finalNeighborhood = (overrides?.neighborhood ?? neighborhood).trim();
    const finalPhone = (overrides?.phone ?? phone).trim() || currentUser?.phone || '';
    const finalGoogleUrl = (overrides?.googleUrl ?? googleUrl).trim();
    const finalRating = targetMode === 'create' ? 5.0 : (Number(overrides?.existingRating ?? existingRating) || 4.5);
    const finalReviews = targetMode === 'create' ? 0 : (Number(overrides?.existingReviews ?? existingReviews) || 0);

    try {
      const payload = {
        mode: targetMode,
        businessName: finalBizName,
        category: finalCategory,
        city: finalCity,
        neighborhood: finalNeighborhood,
        specialties: specialties.trim(),
        phone: finalPhone,
        googleUrl: finalGoogleUrl,
        existingRating: finalRating,
        existingReviews: finalReviews,
        lang,
        businessModel,
        serviceAreas: serviceAreas.trim(),
        reviewHighlights: overrides?.reviewHighlights || scannedListing?.reviewHighlights || [],
      };

      const res = await fetch('/api/local-studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (resData.success && resData.data) {
        setGeneratedData(resData.data);
        showToast(
          targetMode === 'audit'
            ? (isEn ? '✨ Forensic Audit completed with Gemini AI!' : '✨ ¡Auditoría Forense completada con IA Gemini!')
            : (isEn ? '✨ Winning Top 3 Architecture generated!' : '✨ ¡Arquitectura Top 3 generada y registrada en Cartera!')
        );

        // AUTO-SAVE to database so every generation is permanently audited
        try {
          const autoPayload = {
            advisorId: currentUser?.id || 'adv-luisma',
            advisorName: currentUser?.name || 'Luisma • Director General',
            advisorPhone: currentUser?.phone || '+573058314049',
            clientName: finalBizName,
            category: finalCategory,
            city: finalCity,
            neighborhood: finalNeighborhood,
            googleUrl: finalGoogleUrl,
            mode: targetMode,
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
      setIsGenerating(false);
    }
  };

  // -------------------------------------------------------------
  // 3.1. 1-CLICK GOOGLE MAPS API SCANNER & FORENSIC AUDIT
  // -------------------------------------------------------------
  const handleScanAndAudit = async () => {
    const rawInput = auditQuery.trim();
    if (!rawInput) {
      showToast(
        isEn
          ? '⚠️ Please paste a Google Maps link or enter business name'
          : '⚠️ Pega el enlace de Google Maps o escribe el nombre del negocio'
      );
      return;
    }

    setIsScanningListing(true);
    showToast(
      isEn
        ? '🔍 Querying Google Maps API in real-time...'
        : '🔍 Reconociendo ficha con la API de Google Maps en vivo...'
    );

    try {
      const res = await fetch('/api/auditor/google-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: rawInput }),
      });
      const data = await res.json();

      if (data?.success && data?.data) {
        const place: GooglePlaceData = data.data;
        setScannedListing(place);

        const extractedName = place.name || rawInput;
        setBusinessName(extractedName);
        if (typeof place.rating === 'number') setExistingRating(place.rating);
        if (typeof place.reviewsCount === 'number') setExistingReviews(place.reviewsCount);
        if (place.googleMapsUrl) setGoogleUrl(place.googleMapsUrl);
        if (place.phone) setPhone(place.phone);

        // Address parsing for city and neighborhood
        let parsedCity = city;
        let parsedNeighborhood = neighborhood;
        if (place.address && !place.address.toLowerCase().includes('ubicación verificada')) {
          const parts = place.address.split(',').map((p) => p.trim());
          if (parts.length >= 3) {
            parsedNeighborhood = parts[parts.length - 3] || parsedNeighborhood;
            parsedCity = parts[parts.length - 2] || parsedCity;
          } else if (parts.length >= 2) {
            parsedCity = parts[parts.length - 2] || parsedCity;
          }
          if (parsedCity) setCity(parsedCity);
          if (parsedNeighborhood) setNeighborhood(parsedNeighborhood);
        }

        // Category mapping
        const matchedCategory = mapDetectedCategoryToPrestigia(
          place.category || '',
          place.detectedCategories || [],
          isEn
        );
        setCategory(matchedCategory);

        showToast(
          isEn
            ? `✓ Listing Recognized: ${extractedName} (${place.rating}★ · ${place.reviewsCount} reviews). Launching AI audit...`
            : `✓ Ficha Reconocida: ${extractedName} (${place.rating}★ · ${place.reviewsCount} opiniones). Ejecutando auditoría IA...`
        );

        // Immediately trigger the full AI Audit Generation!
        await handleGenerate('audit', {
          businessName: extractedName,
          category: matchedCategory,
          city: parsedCity,
          neighborhood: parsedNeighborhood,
          googleUrl: place.googleMapsUrl || rawInput,
          existingRating: place.rating,
          existingReviews: place.reviewsCount,
          phone: place.phone || phone,
          reviewHighlights: place.reviewHighlights || [],
        });
      } else {
        // Fallback: If live lookup fails or returns error, use raw query as name and audit anyway
        const fallbackName = rawInput.replace(/https?:\/\/[^\s]+/g, '').trim() || rawInput;
        setBusinessName(fallbackName);
        if (rawInput.startsWith('http')) setGoogleUrl(rawInput);
        showToast(
          isEn
            ? '⚡ Auditing with detected profile data...'
            : '⚡ Auditando con los datos detectados...'
        );
        await handleGenerate('audit', {
          businessName: fallbackName,
          googleUrl: rawInput.startsWith('http') ? rawInput : '',
        });
      }
    } catch (err: any) {
      console.error('Scan error:', err);
      const fallbackName = rawInput.replace(/https?:\/\/[^\s]+/g, '').trim() || rawInput;
      setBusinessName(fallbackName);
      if (rawInput.startsWith('http')) setGoogleUrl(rawInput);
      await handleGenerate('audit', {
        businessName: fallbackName,
        googleUrl: rawInput.startsWith('http') ? rawInput : '',
      });
    } finally {
      setIsScanningListing(false);
    }
  };

  // Save current generated blueprint as a Dossier manually
  const handleSaveDossier = async () => {
    if (!generatedData || !businessName.trim()) {
      showToast('⚠️ Primero genera un expediente para guardar');
      return;
    }

    try {
      const payload = {
        advisorId: currentUser?.id || 'adv-luisma',
        advisorName: currentUser?.name || 'Luisma • Director General',
        advisorPhone: currentUser?.phone || '+573058314049',
        clientName: businessName.trim(),
        category,
        city: city.trim(),
        neighborhood: neighborhood.trim(),
        googleUrl: googleUrl.trim(),
        mode: activeTab === 'audit' ? 'audit' : activeTab === 'rescue' ? 'rescue' : 'create',
        status: 'draft',
        data: generatedData,
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
  const myDossiers = useMemo(() => {
    return savedDossiers
      .filter(
        (d) =>
          d.advisorId === 'adv-luisma' ||
          d.advisorName.toLowerCase().includes('luisma') ||
          d.advisorName.toLowerCase().includes('director')
      )
      .filter((d) => {
        if (dossierModeFilter !== 'all' && d.mode !== dossierModeFilter) return false;
        if (dossierSearch.trim()) {
          const q = dossierSearch.toLowerCase();
          const match =
            d.clientName.toLowerCase().includes(q) ||
            d.city.toLowerCase().includes(q) ||
            d.category.toLowerCase().includes(q) ||
            (d.neighborhood && d.neighborhood.toLowerCase().includes(q));
          if (!match) return false;
        }
        return true;
      });
  }, [savedDossiers, dossierSearch, dossierModeFilter]);

  // NETWORK DOSSIERS: All team advisors and licensed B2B partner agencies
  const networkFilteredDossiers = useMemo(() => {
    return savedDossiers
      .filter((d) => d.advisorId !== 'adv-luisma') // Exclude Luisma's private records
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

  // Distinct countries available in network
  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    savedDossiers.forEach((d) => {
      if (d.country) set.add(d.country);
    });
    advisorsList.forEach((a) => {
      if (a.country) set.add(a.country);
    });
    set.add('Colombia');
    set.add('México');
    return Array.from(set);
  }, [savedDossiers, advisorsList]);

  // Distinct cities available in network
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    savedDossiers.forEach((d) => {
      if (d.city) set.add(d.city);
    });
    advisorsList.forEach((a) => {
      if (a.city) set.add(a.city);
    });
    return Array.from(set);
  }, [savedDossiers, advisorsList]);

  // Download Network Performance Report in CSV
  const downloadNetworkCsvReport = () => {
    const headers = [
      'Fecha',
      'Asesor o Agencia',
      'Tipo de Cuenta',
      'Pais',
      'Ciudad',
      'Cliente Auditado',
      'Categoria',
      'Modalidad',
      'Score Salud Google',
      'WhatsApp Contacto',
    ];

    const rows = networkFilteredDossiers.map((d) => [
      `"${new Date(d.createdAt).toLocaleDateString()}"`,
      `"${(d.advisorName || '').replace(/"/g, '""')}"`,
      d.advisorType === 'partner_agency' ? 'Agencia Partner (Licencia Mensual)' : 'Asesor Comercial Interno',
      `"${d.country || 'Colombia'}"`,
      `"${d.city || ''}"`,
      `"${(d.clientName || '').replace(/"/g, '""')}"`,
      `"${(d.category || '').replace(/"/g, '""')}"`,
      d.mode === 'create' ? 'Ficha Nueva Desde Cero' : 'Auditoria Forense Top 3',
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
    setBusinessName(dossier.clientName);
    setCategory(dossier.category);
    setCity(dossier.city);
    setNeighborhood(dossier.neighborhood || '');
    setGoogleUrl(dossier.googleUrl || '');
    setGeneratedData(dossier.data);
    setActiveTab(dossier.mode === 'audit' ? 'audit' : 'create');
    showToast(`Expediente cargado: ${dossier.clientName}`);
  };

  const handleDeleteDossier = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este expediente?')) return;
    try {
      const res = await fetch(`/api/local-studio/dossiers?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Expediente eliminado');
        fetchDossiers();
      }
    } catch {}
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
          monthlyFeeUsd: newAccountType === 'partner_agency' ? Number(newAdvisorMonthlyFee) : 0,
          licenseStatus: newAdvisorLicenseStatus,
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

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center mx-auto shadow-xl">
              <Lock className="w-6 h-6 text-slate-950" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">{tAuth.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{tAuth.subtitle}</p>
            </div>

            {/* Quick 1-Click Selectors */}
            <div className="space-y-2 pt-1 text-left">
              <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block px-1">
                {tAuth.quickAccess}
              </span>

              <button
                type="button"
                onClick={() => handleQuickLogin('luisma')}
                className="w-full p-3 rounded-2xl bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-500/50 hover:border-amber-400 flex items-center justify-between text-left transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-base shadow-md group-hover:scale-105 transition">
                    👑
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-amber-200 text-xs">Luisma • Director General</span>
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">{tAuth.founderRole}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">{tAuth.founderDesc}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('carlos')}
                className="w-full p-3 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/40 hover:border-indigo-400 flex items-center justify-between text-left transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-base shadow-md group-hover:scale-105 transition">
                    💼
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-indigo-200 text-xs">Carlos • Consultor Comercial</span>
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/40">{tAuth.advisorRole}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">{tAuth.advisorDesc}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition" />
              </button>
            </div>

            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{tAuth.orCredentials}</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <form onSubmit={handleLogin} className="space-y-3 text-left text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">{tAuth.usernameLabel}</label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => {
                    setLoginUsername(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  placeholder={isEn ? 'e.g. carlos or your username' : 'ej: carlos o tu usuario'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">{tAuth.passwordLabel}</label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
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
              onClick={() => setShowAuthModal(true)}
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

          {generatedData && (
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

        {/* Main Workspace Navigation Switcher (Franja Fija de Pestañas) */}
        <nav className="bg-slate-900/90 px-4 sm:px-8 py-2 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{t.tabCreate}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{t.tabAudit}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rescue')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'rescue'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 shadow-md shadow-rose-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.tabRescue}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tools')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tools'
                ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-slate-950 font-black shadow-md'
                : 'bg-slate-950 text-amber-300 hover:text-white border border-amber-500/40'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.tabTools}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dossiers')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'dossiers'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.tabDossiers}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.tabGuide}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pitch')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'pitch'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t.tabPitch}</span>
          </button>

          {currentUser?.role === 'admin' && (
            <button
              type="button"
              onClick={() => setActiveTab('network')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'network' || activeTab === 'advisors'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-black'
                  : 'bg-slate-950 text-indigo-400 hover:text-white border border-indigo-500/30'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t.tabNetwork}</span>
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
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block font-mono">{t.mod1Time}</span>
                  <span className="text-lg font-black text-emerald-400">{t.mod1TimeVal}</span>
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

                <div className="space-y-3 text-xs">
                  {/* Business Model Selector */}
                  <div>
                    <label className="block font-bold text-slate-300 mb-1.5">
                      {t.opModel}
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-950 border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setBusinessModel('storefront')}
                        className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-[11px] ${
                          businessModel === 'storefront'
                            ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{t.storefront}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBusinessModel('service_area')}
                        className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-[11px] ${
                          businessModel === 'service_area'
                            ? 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-600/30'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{t.serviceArea}</span>
                      </button>
                    </div>

                    {businessModel === 'service_area' && (
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
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder={t.bizNamePlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      {t.sector}
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-400 transition"
                    >
                      {categoryOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">
                        {t.city}
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder={t.cityPlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">
                        {t.neighborhood}
                      </label>
                      <input
                        type="text"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        placeholder={t.neighborhoodPlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition"
                      />
                    </div>
                  </div>

                  {businessModel === 'service_area' && (
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">
                        {t.coverageAreas}
                      </label>
                      <input
                        type="text"
                        value={serviceAreas}
                        onChange={(e) => setServiceAreas(e.target.value)}
                        placeholder={t.coveragePlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-indigo-500/40 text-indigo-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-400 transition"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">{t.specialties}</label>
                    <input
                      type="text"
                      value={specialties}
                      onChange={(e) => setSpecialties(e.target.value)}
                      placeholder={t.specialtiesPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">{t.phone}</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t.phonePlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleGenerate('create')}
                  disabled={isGenerating || !businessName.trim()}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer active:scale-98"
                >
                  {isGenerating ? (
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

                {/* WhatsApp Request Kit Quick Button */}
                {generatedData && (
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        generatedData.whatsappOnboardingMessage,
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
                      {isEn ? 'Setup Fee + 100% Waiver Closing Hook' : 'Setup Fee de Creación + Gancho 100% Bonificado'}
                    </strong>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {isEn
                        ? 'Charge a $150–$250 USD Setup Fee for initial Google Maps architecture, or waive it 100% ($0 USD) as an irresistible closing hook when the client subscribes to the full annual Prestigia NFC review plan.'
                        : 'Cobra un Setup Fee de $150 a $250 USD por la arquitectura de creación, o bonifícalo al 100% ($0 USD) como gancho de cierre si el cliente adquiere el Plan Anual Prestigia (Tarjetas inteligentes NFC + Captura de reseñas 5★).'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const scriptText = isEn
                        ? `Hello ${businessName || 'Business Owner'}, our initial Setup Fee to build, verify, and architect your Google Maps profile for Top 3 rankings is $150 USD. However, if you subscribe today to our full Prestigia Annual Plan (Smart NFC devices + 5★ Review Accelerator), we WAIVE 100% of the setup fee ($0 creation cost). Shall we reserve your slot and launch this week?`
                        : `Hola estimado/a ${businessName || 'propietario'}, para crear, verificar y estructurar su ficha en Google Maps con arquitectura de posicionamiento Top 3, nuestros honorarios de configuración inicial son de $150 USD. Sin embargo, si adquiere hoy nuestro Plan Anual Prestigia (Tarjetas Inteligentes NFC + Sistema de Reseñas 5★), le BONIFICAMOS el 100% del Setup Fee ($0 costo de creación). ¿Le reservo el cupo y coordinamos la verificación esta semana?`;
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
                {!generatedData && !isGenerating && (
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

                {isGenerating && (
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

                {generatedData && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-slate-900 border border-slate-800 print:hidden">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-slate-300 font-semibold">
                          {isEn ? 'Blueprint Ready: ' : 'Arquitectura Lista: '}<strong className="text-white">{businessName}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
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
                          onClick={handleSaveDossier}
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
                              `${generatedData.primaryCategory}\nSubcategorías: ${generatedData.secondaryCategories.join(', ')}`,
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
                          <span className="text-sm font-black text-white">{generatedData.primaryCategory}</span>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                            {generatedData.secondaryCategories.length} {isEn ? 'Secondary Subcategories (To Capture Search Intent)' : 'Subcategorías Secundarias (Para Ganar Búsquedas)'}
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {generatedData.secondaryCategories.map((sc, i) => (
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
                    {(generatedData.businessModel === 'service_area' ||
                      (generatedData.suggestedServiceAreas && generatedData.suggestedServiceAreas.length > 0)) && (
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
                            {(generatedData.suggestedServiceAreas || [
                              `${city} Norte`,
                              `${city} Centro`,
                              `${city} Occidente`,
                              `Área Metropolitana de ${city}`,
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

                        {/* Pocket NFC Review Protocol for Independents */}
                        {generatedData.nfcPocketReviewGuide && (
                          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-black text-amber-300 text-[11px] flex items-center gap-1.5">
                                💳 {generatedData.nfcPocketReviewGuide.title}
                              </span>
                              <span className="text-[9px] font-mono text-slate-500">Prestigia Pocket Protocol</span>
                            </div>

                            <ul className="space-y-1 text-slate-300 text-[11px]">
                              {generatedData.nfcPocketReviewGuide.steps.map((st, i) => (
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
                              {generatedData.nfcPocketReviewGuide.samplePitch}
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
                          onClick={() => copyToClipboard(generatedData.optimizedTitle, 'Título')}
                          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer print:hidden"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Copy Title' : 'Copiar Título'}</span>
                        </button>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-black text-white flex items-center justify-between">
                        <span>{generatedData.optimizedTitle}</span>
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
                            {generatedData.commercialDescription.length} / 750 {isEn ? 'Characters' : 'Caracteres'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(generatedData.commercialDescription, 'Descripción')}
                          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer print:hidden"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Copy Description' : 'Copiar Descripción'}</span>
                        </button>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {generatedData.commercialDescription}
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
                        {generatedData.serviceCatalog.map((svc, i) => (
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
                        {generatedData.photoChecklist.map((ph, i) => (
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
                        {generatedData.preventiveFaqs.map((faq, i) => (
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
                          <h3 className="text-sm font-black text-white">{generatedData.verificationGuide.title}</h3>
                        </div>
                        <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                          {isEn ? 'Uncut 60s video' : 'Video de 60s sin cortes'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {generatedData.verificationGuide.overview}
                      </p>
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                          <strong className="text-amber-400 block mb-0.5">{isEn ? 'Take 1 (Exterior):' : 'Toma 1 (Exterior):'}</strong>
                          <span className="text-slate-300 text-[11px]">{generatedData.verificationGuide.cameraTake1}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                          <strong className="text-indigo-300 block mb-0.5">{isEn ? 'Take 2 (Access / Street):' : 'Toma 2 (Acceso):'}</strong>
                          <span className="text-slate-300 text-[11px]">{generatedData.verificationGuide.cameraTake2}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                          <strong className="text-emerald-400 block mb-0.5">{isEn ? 'Take 3 (Interior & Billing Tools):' : 'Toma 3 (Interior y Facturación):'}</strong>
                          <span className="text-slate-300 text-[11px]">{generatedData.verificationGuide.cameraTake3}</span>
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
                            copyToClipboard(generatedData.whatsappOnboardingMessage, isEn ? 'WhatsApp Message' : 'Mensaje de WhatsApp')
                          }
                          className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black transition flex items-center gap-1.5 cursor-pointer print:hidden"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Copy Message' : 'Copiar Mensaje'}</span>
                        </button>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                        {generatedData.whatsappOnboardingMessage}
                      </div>
                    </div>

                    {/* 9. Plan de Velocidad de Reseñas para Top 3 (Review Velocity) */}
                    {generatedData.reviewVelocityPlan && (
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
                              {generatedData.reviewVelocityPlan.currentReviews === 0
                                ? (isEn ? '0 ★ (New Listing)' : '0 ★ (Ficha Nueva)')
                                : `${generatedData.reviewVelocityPlan.currentReviews} ★`}
                            </strong>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                              {lang === 'en' ? 'Top 3 Competitor Benchmark' : 'Meta del Top 3'}
                            </span>
                            <strong className="text-base font-black text-amber-400">
                              {generatedData.reviewVelocityPlan.targetTop3Reviews}+
                            </strong>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                              {lang === 'en' ? 'Pace per Week' : 'Ritmo Recomendado'}
                            </span>
                            <strong className="text-base font-black text-emerald-400">
                              +{generatedData.reviewVelocityPlan.reviewsPerWeek} {isEn ? '/ wk' : '/ sem'}
                            </strong>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                              {lang === 'en' ? 'Time to Top 3' : 'Tiempo al Top 3'}
                            </span>
                            <strong className="text-base font-black text-purple-300">
                              {generatedData.reviewVelocityPlan.weeksToTop3} {isEn ? 'weeks' : 'semanas'}
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
                    {generatedData.monthlyPostsBooster && generatedData.monthlyPostsBooster.length > 0 && (
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
                          {generatedData.monthlyPostsBooster.map((post, i) => (
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
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block font-mono">{t.mod2Target}</span>
                  <span className="text-lg font-black text-amber-400">{t.mod2TargetVal}</span>
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
                            setScannedListing(null);
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
                          if (e.key === 'Enter' && !isScanningListing && !isGenerating && auditQuery.trim()) {
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

                  {/* Primary 1-Click Scan & Audit Button */}
                  <button
                    type="button"
                    onClick={handleScanAndAudit}
                    disabled={isScanningListing || isGenerating || !auditQuery.trim()}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer active:scale-98"
                  >
                    {isScanningListing || isGenerating ? (
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
                </div>

                {/* Scanned Listing Profile Card (If recognized) */}
                {scannedListing && (
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/40 space-y-2.5 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{t.verifiedListingBadge}</span>
                      </span>
                      {scannedListing.googleMapsUrl && (
                        <a
                          href={scannedListing.googleMapsUrl}
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
                        {scannedListing.name}
                      </h4>
                      {scannedListing.address && (
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="truncate">{scannedListing.address}</span>
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Rating</span>
                        <span className="text-xs font-black text-amber-400">★ {scannedListing.rating}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">{isEn ? 'Reviews' : 'Reseñas'}</span>
                        <span className="text-xs font-black text-white">{scannedListing.reviewsCount}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">{isEn ? 'Niche' : 'Nicho'}</span>
                        <span className="text-[10px] font-black text-teal-300 truncate block">
                          {scannedListing.category || 'General'}
                        </span>
                      </div>
                    </div>

                    {(scannedListing.phone || scannedListing.website) && (
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                        {scannedListing.phone && (
                          <span className="flex items-center gap-1 text-slate-300 truncate">
                            <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>{scannedListing.phone}</span>
                          </span>
                        )}
                        {scannedListing.website && (
                          <span className="flex items-center gap-1 text-slate-300 truncate">
                            <Globe className="w-3 h-3 text-indigo-400 shrink-0" />
                            <span>{scannedListing.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

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
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder={t.auditBizNamePlaceholder}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">{t.googleUrl}</label>
                        <input
                          type="text"
                          value={googleUrl}
                          onChange={(e) => setGoogleUrl(e.target.value)}
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
                            value={existingRating}
                            onChange={(e) => setExistingRating(Number(e.target.value))}
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400 transition font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">{t.publicReviews}</label>
                          <input
                            type="number"
                            min="0"
                            value={existingReviews}
                            onChange={(e) => setExistingReviews(Number(e.target.value))}
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400 transition font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">{t.city}</label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder={t.auditCityPlaceholder}
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400 transition"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">{t.neighborhood}</label>
                          <input
                            type="text"
                            value={neighborhood}
                            onChange={(e) => setNeighborhood(e.target.value)}
                            placeholder={t.auditNeighborhoodPlaceholder}
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400 transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">{t.sector}</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
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
                        onClick={() => handleGenerate('audit')}
                        disabled={isGenerating || !businessName.trim()}
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
                      {isEn ? 'Audit & Upgrade Setup Fee + 100% Waiver' : 'Setup Fee de Auditoría & Gancho 100% Bonificado'}
                    </strong>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {isEn
                        ? 'Charge a $150–$250 USD Setup Fee for forensic listing overhaul and Top 3 upgrade, or waive it 100% ($0 USD) as an irresistible hook when the client signs up for the annual Prestigia NFC review plan.'
                        : 'Cobra un Setup Fee de $150 a $250 USD por la auditoría forense y optimización profunda al Top 3, o bonifícalo al 100% ($0 USD) como gancho de cierre si el cliente adquiere el Plan Anual Prestigia (Tarjetas inteligentes NFC + Captura de reseñas 5★).'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const scriptText = isEn
                        ? `Hello ${businessName || 'Business Owner'}, after performing our forensic audit on your Google Maps listing, we identified critical gaps keeping you outside the Top 3. Our deep optimization Setup Fee is regularly $150 USD. However, if you activate our Prestigia Annual Plan (Smart NFC devices + 5★ Review System), we WAIVE 100% of the optimization fee ($0 USD). Shall we lock in this waiver and elevate your listing this week?`
                        : `Hola estimado/a ${businessName || 'propietario'}, tras auditar su negocio en Google Maps detectamos fallas críticas que le hacen perder clientes frente a la competencia. Nuestro Setup Fee por la optimización forense al Top 3 es de $150 USD. Sin embargo, si adquiere hoy nuestro Plan Anual Prestigia (Tarjetas Inteligentes NFC + Sistema de Reseñas 5★), le BONIFICAMOS el 100% de la optimización ($0 USD). ¿Le gustaría aprovechar esta bonificación y activar su plan anual?`;
                      copyToClipboard(scriptText, isEn ? 'Audit Proposal' : 'Propuesta de Auditoría');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Copy Annual Plan Closing Script (WhatsApp)' : 'Copiar Propuesta Comercial de Cierre (WhatsApp)'}</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Audit Diagnostic Output */}
              <div className="lg:col-span-7 space-y-4">
                {/* State 1: Scanning & Auditing with Gemini */}
                {(isScanningListing || isGenerating) && (
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
                {!generatedData?.healthScore && !isScanningListing && !isGenerating && (
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
                        ⚡ Reconocimiento en Vivo
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60">
                        ★ Calificación Real & Reseñas
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60">
                        🎯 Brechas frente al Top 3
                      </span>
                    </div>
                  </div>
                )}

                {/* State 3: Generated Forensic Audit Results */}
                {generatedData?.healthScore && !isScanningListing && !isGenerating && (
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
                            onClick={handleSaveDossier}
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
                              {generatedData.healthScore}
                            </span>
                            <span className="text-base sm:text-lg font-bold text-slate-400">
                              / 100
                            </span>
                          </div>

                          <span
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl border whitespace-nowrap inline-flex items-center gap-1.5 shadow-sm ${
                              generatedData.healthScore < 60
                                ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                                : generatedData.healthScore < 80
                                ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                            }`}
                          >
                            {generatedData.healthScore < 60 ? (
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
                              generatedData.healthScore < 60
                                ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                                : generatedData.healthScore < 80
                                ? 'bg-gradient-to-r from-amber-500 to-teal-400'
                                : 'bg-gradient-to-r from-teal-400 to-emerald-400'
                            }`}
                            style={{ width: `${Math.min(Math.max(generatedData.healthScore, 5), 100)}%` }}
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
                        {generatedData.criticalGaps?.map((gap, i) => (
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
                        <h3 className="text-sm font-black text-white">{t.competitorBenchmarkTitle} {city}</h3>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {generatedData.topCompetitorInsights}
                      </p>
                    </div>

                    {/* Action Roadmap */}
                    <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-3 print-card-box">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <h3 className="text-sm font-black text-white">{t.roadmapTitle}</h3>
                      </div>
                      <div className="space-y-2 text-xs">
                        {generatedData.actionRoadmap?.map((item, i) => (
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
                          onClick={() => copyToClipboard(generatedData.commercialDescription, 'Descripción')}
                          className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer print:hidden"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{t.copyNewDesc}</span>
                        </button>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {generatedData.commercialDescription}
                      </div>
                    </div>
                  </div>
                )}
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
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block font-mono">{isEn ? 'Official Timeline' : 'Tiempo de Trámite'}</span>
                  <span className="text-lg font-black text-amber-400">{isEn ? '72-Hour Protocol' : 'Regla de 72 Horas'}</span>
                </div>
              </div>
            </div>

            {/* Rescue Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Diagnostics & Parameters (5 cols) */}
              <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl print:hidden">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <KeyRound className="w-4 h-4 text-rose-400" />
                  <h2 className="text-sm font-black text-white">{isEn ? '1. Business & Rescue Diagnosis' : '1. Diagnóstico de Titularidad & Datos'}</h2>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">{isEn ? 'Business Name on Google Maps *' : 'Nombre de la Ficha en Google Maps *'}</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder={isEn ? 'e.g. Apex Dental Center' : 'Ej: Clínica Dental Sanitas'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">{isEn ? 'City / Location *' : 'Ciudad / Ubicación *'}</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder={isEn ? 'e.g. Miami, FL' : 'Ej: Bogotá o Medellín'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-400 transition"
                    />
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
                        placeholder="c•••••@gmail.com"
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
                        <p className="text-[11px] text-slate-400 leading-relaxed">{tTools.scenario2Subtitle}</p>
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
                      {isEn ? 'Rescue Setup Fee + 100% Waiver Closing Hook' : 'Setup Fee de Rescate + Gancho 100% Bonificado'}
                    </strong>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {isEn
                        ? 'Charge a $150–$250 USD Setup Fee for legal listing rescue and ownership transfer, or waive it 100% ($0 USD) as an irresistible hook when the client purchases an annual Prestigia NFC review plan.'
                        : 'Cobra un Setup Fee de $150 a $250 USD por rescatar y transferir la titularidad legal, o bonifícalo al 100% ($0 USD) como gancho de cierre si el cliente adquiere el Plan Anual Prestigia (Tarjetas inteligentes NFC + Captura de reseñas 5★).'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const scriptText = isEn
                        ? `Hello ${businessName || 'Business Owner'}, our legal ownership recovery Setup Fee to reclaim and transfer your Google Maps profile to your direct account is $150 USD. However, if you subscribe today to our full Prestigia Annual Plan (Smart NFC devices + 5★ Review Accelerator), we WAIVE 100% of the rescue fee ($0 cost). You get your listing back completely free and your reputation secured all year round. Shall we start the protocol today?`
                        : `Hola estimado/a ${businessName || 'propietario'}, para recuperar la titularidad legal de su ficha en Google Maps y transferir el control total a su cuenta oficial mediante el protocolo de Google, nuestros honorarios de gestión son de $150 USD. Sin embargo, si adquiere hoy nuestro Plan Anual Prestigia (Tarjetas Inteligentes NFC + Sistema de Reseñas 5★), le BONIFICAMOS el 100% del rescate ($0 USD). Recupera su ficha gratis y blindamos su reputación todo el año. ¿Iniciamos el protocolo hoy?`;
                      copyToClipboard(scriptText, isEn ? 'Rescue Proposal' : 'Propuesta de Rescate');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Copy Annual Plan Closing Script (WhatsApp)' : 'Copiar Propuesta Comercial de Cierre (WhatsApp)'}</span>
                  </button>
                </div>
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
                          <span className="font-black text-amber-400 block text-xs">Paso 1: Abrir Enlace Oficial</span>
                          <p className="text-[11px] text-slate-300">
                            {isEn
                              ? 'Search the business on Google Maps and click "Own this business?" or enter Google Business Profile.'
                              : 'Buscar el negocio en Google Maps y dar clic en "¿Eres el propietario?" o entrar a Google Business Profile.'}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="font-black text-amber-400 block text-xs">Paso 2: Elegir Verificación</span>
                          <p className="text-[11px] text-slate-300">
                            {isEn
                              ? 'Select verification by automated call or SMS directly to the business phone line.'
                              : 'Seleccionar la verificación por llamada automatizada o SMS al teléfono del establecimiento.'}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="font-black text-emerald-400 block text-xs">Paso 3: Blindar Titularidad</span>
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
                          <span className="font-black text-indigo-400 block text-xs">Día 1: Radicación</span>
                          <p className="text-[11px] text-slate-300">
                            {isEn
                              ? 'Enter business.google.com/create, search the listing, click "Request Access", and choose Owner role.'
                              : 'Entrar a business.google.com/create, buscar la ficha y dar clic en "Solicitar Acceso" como Propietario.'}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="font-black text-indigo-400 block text-xs">Días 1-3: Espera</span>
                          <p className="text-[11px] text-slate-300">
                            {isEn
                              ? 'Google emails the third party. They have exactly 72 hours to accept or transfer.'
                              : 'Google notifica al correo anterior con un plazo improrrogable de 72 horas para responder o transferir.'}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="font-black text-amber-400 block text-xs">Día 4: Desbloqueo</span>
                          <p className="text-[11px] text-slate-300">
                            {isEn
                              ? 'If third party does not reply within 72h, Google unlocks the "Claim & Verify" button for the client.'
                              : 'Si el tercero no responde en 3 días, Google da por abandonada la ficha y desbloquea el reclamo al cliente.'}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="font-black text-emerald-400 block text-xs">Día 5: Control Total</span>
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
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
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

                    <a
                      href="https://business.google.com/create"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 shrink-0 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{tTools.rescueBtnDirectClaim}</span>
                    </a>
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
                        <strong className="text-white block text-xs">1. Documento de Constitución / Registro Tributario</strong>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          RUT (Colombia), RFC / Constancia SAT (México), CIF (España) o EIN / Articles of Incorporation (USA).
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block text-xs">2. Factura de Servicios Públicos o Contrato</strong>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Recibo reciente de energía, agua, gas o internet con el nombre comercial y dirección idéntica a Google Maps.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block text-xs">3. Foto Exterior de Fachada con Aviso Visible</strong>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Fotografía tomada desde la calle mostrando el letrero comercial permanente y el número de nomenclatura.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block text-xs">4. Video Continuo de 60 Segundos del Local</strong>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Grabación continua sin cortes: Fachada exterior (0-15s) → Mostrador de recepción (15-40s) → Software o datáfono (40-60s).
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
                        const scriptText =
                          rescueScenario === 'orphan'
                            ? `Hola estimado/a ${businessName || 'propietario'}, le saluda el equipo de Prestigia. Auditamos su presencia en Google Maps y detectamos una vulnerabilidad crítica: su ficha de negocio existe pero actualmente se encuentra 'Huérfana / Sin Reclamar'. Esto significa que cualquier tercero o competidor puede sugerir cambios o adueñarse de ella. En Prestigia podemos gestionar hoy mismo la reclamación oficial y blindar la titularidad legal de su empresa sin alterar sus reseñas ni su posicionamiento. ¿Desea que iniciemos el trámite de protección?`
                            : rescueScenario === 'third_party'
                            ? `Hola estimado/a ${businessName || 'propietario'}, le saluda el equipo de Prestigia. Al auditar su negocio en Google Maps notamos que su ficha oficial está vinculada a un correo externo (${rescueMaskedEmail || 'c•••••@gmail.com'}) y usted no cuenta con el acceso de Propietario Principal. No se preocupe: NO es necesario crear una ficha nueva (hacerlo causaría sanción por duplicidad). Nosotros ejecutamos el Protocolo Oficial de 72 Horas de Google para solicitar la propiedad y transferirle el control legal completo a su cuenta personal en menos de una semana, conservando todas sus reseñas y fotos. ¿Coordinamos los datos para radicar la solicitud hoy?`
                            : `Hola estimado/a ${businessName || 'propietario'}, le saluda el equipo de Prestigia. Si una agencia anterior o ex-empleado le negó el traspaso de su ficha en Google Maps, las políticas oficiales de Google amparan su titularidad legítima. Nosotros radicamos el expediente probatorio de apelación con su personería jurídica y evidencias del local para que el equipo de soporte de Google revoque al tercero y le restituya el control total de su negocio. ¿Le gustaría que redactemos la apelación oficial?`;
                        copyToClipboard(scriptText, isEn ? 'WhatsApp Script' : 'Guion de WhatsApp');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold transition flex items-center gap-1.5 cursor-pointer border border-amber-500/40"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Copy Script' : 'Copiar Guion'}</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 italic leading-relaxed p-4 rounded-xl bg-slate-950 border border-slate-800">
                    {rescueScenario === 'orphan'
                      ? `"Hola estimado/a ${businessName || 'propietario'}, le saluda el equipo de Prestigia. Auditamos su presencia en Google Maps y detectamos una vulnerabilidad crítica: su ficha de negocio existe pero actualmente se encuentra 'Huérfana / Sin Reclamar'. Esto significa que cualquier tercero o competidor puede sugerir cambios o adueñarse de ella. En Prestigia podemos gestionar hoy mismo la reclamación oficial y blindar la titularidad legal de su empresa sin alterar sus reseñas ni su posicionamiento. ¿Desea que iniciemos el trámite de protección?"`
                      : rescueScenario === 'third_party'
                      ? `"Hola estimado/a ${businessName || 'propietario'}, le saluda el equipo de Prestigia. Al auditar su negocio en Google Maps notamos que su ficha oficial está vinculada a un correo externo (${rescueMaskedEmail || 'c•••••@gmail.com'}) y usted no cuenta con el acceso de Propietario Principal. No se preocupe: NO es necesario crear una ficha nueva (hacerlo causaría sanción por duplicidad). Nosotros ejecutamos el Protocolo Oficial de 72 Horas de Google para solicitar la propiedad y transferirle el control legal completo a su cuenta personal en menos de una semana, conservando todas sus reseñas y fotos. ¿Coordinamos los datos para radicar la solicitud hoy?"`
                      : `"Hola estimado/a ${businessName || 'propietario'}, le saluda el equipo de Prestigia. Si una agencia anterior o ex-empleado le negó el traspaso de su ficha en Google Maps, las políticas oficiales de Google amparan su titularidad legítima. Nosotros radicamos el expediente probatorio de apelación con su personería jurídica y evidencias del local para que el equipo de soporte de Google revoque al tercero y le restituya el control total de su negocio. ¿Le gustaría que redactemos la apelación oficial?"`}
                  </p>
                </div>
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
                onClick={() => setToolsActiveTab('geotag')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                  toolsActiveTab === 'geotag'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{tTools.tab3}</span>
              </button>

              <button
                type="button"
                onClick={() => setToolsActiveTab('citations')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                  toolsActiveTab === 'citations'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>{tTools.tab4}</span>
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
                <span>{tTools.tab5}</span>
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
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center justify-between">
                      <span>{tTools.satMap} ({city || (isEn ? 'Your City' : 'Tu Ciudad')})</span>
                      <span className="text-amber-400">{tTools.keyword} "{category.split('/')[0].trim()}"</span>
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
                        {tTools.diagAdvisorBody(businessName, geoGridRadius)}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <label className="block font-bold text-slate-300">{tTools.avgTicket}</label>
                    <input
                      type="number"
                      value={roiAverageTicket}
                      onChange={(e) => setRoiAverageTicket(Number(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 font-black text-base focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500">{tTools.avgTicketSub}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <label className="block font-bold text-slate-300">{tTools.currentRank}</label>
                    <select
                      value={roiCurrentRank}
                      onChange={(e) => setRoiCurrentRank(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-black text-base focus:outline-none"
                    >
                      <option value="4">{tTools.rankOpt1}</option>
                      <option value="8">{tTools.rankOpt2}</option>
                      <option value="15">{tTools.rankOpt3}</option>
                    </select>
                    <span className="text-[10px] text-slate-500">{tTools.currentRankSub}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <label className="block font-bold text-slate-300">{tTools.searches}</label>
                    <input
                      type="number"
                      value={roiMonthlySearches}
                      onChange={(e) => setRoiMonthlySearches(Number(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-black text-base focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500">{tTools.searchesSub}</span>
                  </div>
                </div>

                {/* Calculation Output Box */}
                {(() => {
                  const lostClicks = Math.round(roiMonthlySearches * (roiCurrentRank > 10 ? 0.28 : roiCurrentRank > 5 ? 0.22 : 0.14));
                  const lostClients = Math.round(lostClicks * 0.25);
                  const monthlyLoss = lostClients * roiAverageTicket;
                  const yearlyLoss = monthlyLoss * 12;

                  return (
                    <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/60 via-slate-950 to-slate-900 border-2 border-rose-500/50 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-rose-300 bg-rose-950 px-2.5 py-0.5 rounded-full border border-rose-500/40">
                            {tTools.leakDetected}
                          </span>
                          <h4 className="text-lg font-black text-white mt-1">
                            {tTools.leakHeading}
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-black text-rose-400">
                            ${monthlyLoss.toLocaleString()} USD
                          </span>
                          <span className="text-xs text-slate-400 block font-bold">{tTools.lostPer30Days}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">{tTools.lostCalls}</span>
                          <strong className="text-base font-black text-white">~{lostClicks} {tTools.searchesPerMonth}</strong>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">{tTools.lostClientsLabel}</span>
                          <strong className="text-base font-black text-amber-400">~{lostClients} {tTools.newClientsPerMonth}</strong>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">{tTools.loss12Months}</span>
                          <strong className="text-base font-black text-rose-400">${yearlyLoss.toLocaleString()} USD/{isEn ? 'yr' : 'año'}</strong>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 text-xs text-amber-200">
                        <strong className="text-white block mb-0.5">{tTools.advisorClose}</strong>
                        {tTools.advisorCloseBody}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TOOL 3: INYECTOR DE GEO-TAGGING EXIF */}
            {toolsActiveTab === 'geotag' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-indigo-400" />
                    <span>{tTools.geotagTitle}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {tTools.geotagDesc}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">{tTools.photoName}</label>
                      <input
                        type="text"
                        value={geoTagFilename}
                        onChange={(e) => setGeoTagFilename(e.target.value)}
                        placeholder={tTools.photoNamePlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-400"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">{tTools.indexingKeywords}</label>
                      <input
                        type="text"
                        value={geoTagKeywords}
                        onChange={(e) => setGeoTagKeywords(e.target.value)}
                        placeholder={tTools.indexingKeywordsPlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-400"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const cleanBase = (geoTagFilename.trim() || 'foto-local').toLowerCase().replace(/[^a-z0-9]/g, '-');
                        const cleanC = (city.trim() || 'ciudad').toLowerCase().replace(/[^a-z0-9]/g, '-');
                        const result = `${cleanBase}-${cleanC}-top3-prestigia.jpg [IPTC: ${geoTagKeywords || category} • GeoTag: ${city}]`;
                        setGeoTagResult(result);
                        showToast(tTools.toastGeotag);
                      }}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black transition cursor-pointer"
                    >
                      {tTools.btnGeotag}
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <span className="text-[10px] font-black uppercase text-indigo-400 block">
                      {tTools.resultBox}
                    </span>
                    <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/30 font-mono text-[11px] text-amber-300 break-all">
                      {geoTagResult || `${(businessName || 'negocio').toLowerCase().replace(/[^a-z0-9]/g, '-')}-${city.toLowerCase()}-fachada-geotagged.jpg`}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {tTools.geotagNote}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TOOL 4: HUB DE CITACIONES LOCALES (USA & LATAM) */}
            {toolsActiveTab === 'citations' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-purple-400" />
                    <span>{tTools.citationsTitle}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {tTools.citationsDesc}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* USA Directoriess */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🇺🇸</span>
                      <h4 className="font-black text-white">{tTools.citationsUsa}</h4>
                    </div>
                    <ul className="space-y-2 text-[11px] text-slate-300">
                      {[
                        { name: 'Apple Maps Connect', authority: 'DA 99', desc: isEn ? 'Essential for iPhone and Siri local queries' : 'Indispensable para usuarios de iPhone y Siri' },
                        { name: 'Bing Places for Business', authority: 'DA 94', desc: isEn ? 'Native search on Windows and AI copilot agents' : 'Búsquedas nativas en Windows y copilotos de IA' },
                        { name: 'Yelp for Business', authority: 'DA 94', desc: isEn ? 'Primary review feed read natively by Apple Maps' : 'Principal fuente de reseñas externas leída por Apple' },
                        { name: 'YellowPages (YP.com)', authority: 'DA 89', desc: isEn ? 'Historic local authority backlink for USA SEO' : 'Autoridad local histórica para SEO en EE.UU.' },
                        { name: 'Better Business Bureau (BBB)', authority: 'DA 93', desc: isEn ? 'Definitive badge of consumer trust and legitimacy' : 'Sello definitivo de confianza y legitimidad' },
                      ].map((c, i) => (
                        <li key={i} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                          <div>
                            <strong className="text-white block">{c.name}</strong>
                            <span className="text-[10px] text-slate-400">{c.desc}</span>
                          </div>
                          <span className="text-[9px] font-black text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                            {c.authority}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* LatAm Directories */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🇨🇴 🇲🇽</span>
                      <h4 className="font-black text-white">{tTools.citationsLatam}</h4>
                    </div>
                    <ul className="space-y-2 text-[11px] text-slate-300">
                      {[
                        { name: 'Waze Ads & Local Pins', authority: 'DA 92', desc: isEn ? '#1 driving navigation app in metropolitan hubs' : 'Navegación automotriz #1 en ciudades latinas' },
                        { name: 'Páginas Amarillas / Publicar', authority: 'DA 76', desc: isEn ? 'High-domain authority local directory backlink' : 'Backlink local de alto valor de directorio' },
                        { name: 'Foursquare & Swarm', authority: 'DA 91', desc: isEn ? 'Geo-spatial dataset powering Uber, Twitter, and apps' : 'Base de datos geo-espacial de Uber y Twitter' },
                        { name: 'Cámara de Comercio / Registro Mercantil', authority: 'DA 85', desc: isEn ? 'Corporate registry proving legal business establishment' : 'Validación de existencia legal formal' },
                        { name: 'Facebook & Instagram Local Place', authority: 'DA 96', desc: isEn ? 'Social check-in & location tagging for customers' : 'Geolocalización para check-in de clientes' },
                      ].map((c, i) => (
                        <li key={i} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                          <div>
                            <strong className="text-white block">{c.name}</strong>
                            <span className="text-[10px] text-slate-400">{c.desc}</span>
                          </div>
                          <span className="text-[9px] font-black text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded">
                            {c.authority}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TOOL 5: RIVAL SPY - RADAR DE ESPIONAJE CARA A CARA */}
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
                  {/* Left: Your Client */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                        {tTools.spyClientCol}
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        {isEn ? 'Your Profile' : 'Tu Ficha'}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">
                          {isEn ? 'Business Name' : 'Nombre del Negocio'}
                        </label>
                        <input
                          type="text"
                          value={businessName || 'Tu Negocio'}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs focus:outline-none focus:border-emerald-400"
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
                            value={existingRating}
                            onChange={(e) => setExistingRating(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-black text-xs focus:outline-none focus:border-emerald-400"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">
                            {tTools.spyMetricReviews}
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={existingReviews}
                            onChange={(e) => setExistingReviews(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-black text-xs focus:outline-none focus:border-emerald-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">
                            {tTools.spyMetricWeekly}
                          </label>
                          <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs flex items-center justify-between">
                            <span>+1 / sem</span>
                            <span className="text-[9px] text-slate-500 font-normal">{isEn ? 'Organic' : 'Orgánico'}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">
                            {tTools.spyMetricPhotos}
                          </label>
                          <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs flex items-center justify-between">
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
                  const reviewGap = Math.max(0, rivalReviews - (existingReviews || 0));
                  const netVelocity = Math.max(1, 8 - rivalWeeklyPace);
                  const weeksToSurpass = Math.max(3, Math.ceil(reviewGap / netVelocity));

                  return (
                    <div className="space-y-4">
                      {/* Metric Comparison Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                            {isEn ? 'Review Gap' : 'Brecha de Reseñas'}
                          </span>
                          <strong className="text-xl font-black text-rose-400">
                            +{reviewGap}
                          </strong>
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            {isEn ? 'in favor of rival' : 'a favor del rival'}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                            {isEn ? 'Pace Advantage' : 'Ventaja con Prestigia'}
                          </span>
                          <strong className="text-xl font-black text-emerald-400">
                            +8 / sem
                          </strong>
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            {isEn ? `vs +${rivalWeeklyPace} rival pace` : `vs +${rivalWeeklyPace} del rival`}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                            {isEn ? 'Time to Overtake' : 'Tiempo para Destronar'}
                          </span>
                          <strong className="text-xl font-black text-amber-400">
                            {weeksToSurpass} {isEn ? 'weeks' : 'semanas'}
                          </strong>
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            ~{Math.ceil(weeksToSurpass / 4)} {isEn ? 'months' : 'meses'}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                            {isEn ? 'Photo Gap' : 'Déficit Visual'}
                          </span>
                          <strong className="text-xl font-black text-indigo-400">
                            +{Math.max(0, rivalPhotos - 14)}
                          </strong>
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            {isEn ? 'photos needed' : 'fotos a cargar'}
                          </span>
                        </div>
                      </div>

                      {/* Tactical Attack Plan */}
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-900 border border-indigo-500/40 space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <h4 className="font-black text-white text-sm">
                            {tTools.spyAttackPlan}
                          </h4>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                            <span className="font-black text-emerald-400">1.</span>
                            <span className="text-slate-300">{tTools.spyMove1}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                            <span className="font-black text-amber-400">2.</span>
                            <span className="text-slate-300">{tTools.spyMove2}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                            <span className="font-black text-indigo-400">3.</span>
                            <span className="text-slate-300">{tTools.spyMove3}</span>
                          </div>
                        </div>
                      </div>

                      {/* Advisor Closing Pitch */}
                      <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                            {tTools.spyPitchBox}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(
                                tTools.spyPitchText(businessName, rivalName, weeksToSurpass),
                                isEn ? 'Closing Pitch' : 'Argumento de Cierre'
                              )
                            }
                            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{tTools.spyBtnCopyPitch}</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-300 italic leading-relaxed">
                          {tTools.spyPitchText(businessName, rivalName, weeksToSurpass)}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
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

            {/* Executive KPI Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">{tDossiers.kpiDossiers}</span>
                  <strong className="text-xl font-black text-white">{myDossiers.length}</strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">{tDossiers.kpiCreated}</span>
                  <strong className="text-xl font-black text-emerald-400">
                    {myDossiers.filter((d) => d.mode === 'create').length}
                  </strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">{tDossiers.kpiAudited}</span>
                  <strong className="text-xl font-black text-indigo-300">
                    {myDossiers.filter((d) => d.mode === 'audit').length}
                  </strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">{tDossiers.kpiPrivacy}</span>
                  <strong className="text-xs font-black text-emerald-400 uppercase">{tDossiers.kpiPrivacyVal}</strong>
                </div>
              </div>
            </div>

            {/* Filter Pills (Clean, personal mode filters only) */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
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
                  {tDossiers.filterAll} ({myDossiers.length})
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
                  {tDossiers.filterCreate} ({myDossiers.filter((d) => d.mode === 'create').length})
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
                  {tDossiers.filterAudit} ({myDossiers.filter((d) => d.mode === 'audit').length})
                </button>
              </div>

              <span className="text-[11px] text-slate-400 font-medium">
                {tDossiers.showingNotice}
              </span>
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
                  onClick={() => setActiveTab('create')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-md"
                >
                  {tDossiers.btnCreateFirst}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myDossiers.map((d) => (
                  <div
                    key={d.id}
                    className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-400/60 transition flex flex-col justify-between space-y-4 shadow-lg group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            d.mode === 'create'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {d.mode === 'create' ? tDossiers.badgeCreate : tDossiers.badgeAudit}
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
                          {new Date(d.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base font-black text-white group-hover:text-amber-300 transition">
                          {d.clientName}
                        </h4>
                        <p className="text-xs text-slate-400">
                          📍 {d.city} {d.neighborhood ? `• ${d.neighborhood}` : ''}
                        </p>
                        <span className="text-[11px] text-amber-400 font-bold block mt-1">{d.category}</span>
                      </div>

                      {d.data?.criticalGaps && d.data.criticalGaps.length > 0 && (
                        <p className="text-[11px] text-slate-400 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 line-clamp-2">
                          ⚠️ {d.data.criticalGaps[0]}
                        </p>
                      )}
                    </div>

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
          </div>
        )}

        {/* =============================================================
            TAB 4: GUÍA DÓNDE DAR CLIC EN GOOGLE (TUTORIAL PARA DUMMIES)
            ============================================================= */}
        {activeTab === 'guide' && (
          <div className="space-y-6 print:hidden">
            <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/40 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300">
                    {tGuide.badge}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    {tGuide.title}
                  </h1>
                  <p className="text-xs text-slate-300 max-w-2xl">
                    {tGuide.desc}
                  </p>
                </div>
                <a
                  href="https://business.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition flex items-center gap-2 shadow-lg cursor-pointer shrink-0"
                >
                  <span>{tGuide.btnOpenGoogle}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {/* Paso 1 */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-xs">1</span>
                  <h3 className="font-bold text-white text-sm">{tGuide.step1Title}</h3>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {tGuide.step1Body}
                </p>
              </div>

              {/* Paso 2 */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-xs">2</span>
                  <h3 className="font-bold text-white text-sm">{tGuide.step2Title}</h3>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {tGuide.step2Body}
                </p>
              </div>

              {/* Paso 3 */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-xs">3</span>
                  <h3 className="font-bold text-white text-sm">{tGuide.step3Title}</h3>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {tGuide.step3BodyStore}
                  <br />
                  <span className="text-amber-300 font-semibold">{tGuide.step3BodySab}</span>
                </p>
              </div>

              {/* Paso 4 */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-xs">4</span>
                  <h3 className="font-bold text-white text-sm">{tGuide.step4Title}</h3>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {tGuide.step4BodyStore}
                  <br />
                  <span className="text-indigo-300 font-semibold">{tGuide.step4BodySab}</span>
                </p>
              </div>

              {/* Paso 5 */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-xs">5</span>
                  <h3 className="font-bold text-white text-sm">{tGuide.step5Title}</h3>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {tGuide.step5Body}
                </p>
              </div>

              {/* Paso 6 */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-xs">6</span>
                  <h3 className="font-bold text-white text-sm">{tGuide.step6Title}</h3>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {tGuide.step6Body}
                </p>
              </div>
            </div>

            {/* Anti-Suspension Rules */}
            <div className="p-6 rounded-3xl bg-slate-900 border-2 border-amber-500/40 space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-base font-black text-white">{tGuide.trafficLightTitle}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/30 text-rose-300 space-y-1">
                  <strong className="text-rose-400 block text-xs">{tGuide.dangerTitle}</strong>
                  <p className="text-[11px] text-slate-300">{tGuide.danger1}</p>
                  <p className="text-[11px] text-slate-300">{tGuide.danger2}</p>
                  <p className="text-[11px] text-slate-300">{tGuide.danger3}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 text-emerald-300 space-y-1">
                  <strong className="text-emerald-400 block text-xs">{tGuide.safeTitle}</strong>
                  <p className="text-[11px] text-slate-300">{tGuide.safe1}</p>
                  <p className="text-[11px] text-slate-300">{tGuide.safe2}</p>
                  <p className="text-[11px] text-slate-300">{tGuide.safe3}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================
            TAB 5: GUION COMERCIAL PARA ASESORES (OBJECIONES Y CIERRE)
            ============================================================= */}
        {activeTab === 'pitch' && (
          <div className="space-y-6 print:hidden">
            <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/40 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-950 border border-rose-500/40 text-rose-300">
                  {tPitch.badge}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {tPitch.title}
                </h1>
                <p className="text-xs text-slate-300 max-w-2xl">
                  {tPitch.desc}
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <strong className="text-amber-300 block text-sm">
                  {tPitch.q1}
                </strong>
                <p className="text-slate-300 text-xs leading-relaxed">
                  <em>{isEn ? 'Advisor Script:' : 'Respuesta del Asesor:'}</em> {tPitch.a1}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <strong className="text-amber-300 block text-sm">
                  {tPitch.q2}
                </strong>
                <p className="text-slate-300 text-xs leading-relaxed">
                  <em>{isEn ? 'Advisor Script:' : 'Respuesta del Asesor:'}</em> {tPitch.a2}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <strong className="text-amber-300 block text-sm">
                  {tPitch.q3}
                </strong>
                <p className="text-slate-300 text-xs leading-relaxed">
                  <em>{isEn ? 'Advisor Script:' : 'Respuesta del Asesor:'}</em> {tPitch.a3}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================
            TAB 6 / 4: RED DE ASESORES & AGENCIAS B2B (EXCLUSIVO DUEÑO / MASTER)
            ============================================================= */}
        {(activeTab === 'advisors' || activeTab === 'network') && currentUser?.role === 'admin' && (
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
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
                      .filter((a) => a.accountType === 'partner_agency' && a.licenseStatus === 'active')
                      .reduce((sum, a) => sum + (a.monthlyFeeUsd || 0), 0)}{' '}
                    <span className="text-xs font-bold text-slate-400">{isEn ? 'USD/mo' : 'USD/mes'}</span>
                  </strong>
                </div>
              </div>
            </div>

            {/* Sub-view Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => setNetworkSubView('monitor')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                  networkSubView === 'monitor'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>{tNetwork.subviewMonitor} ({networkFilteredDossiers.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setNetworkSubView('register')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                  networkSubView === 'register'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{tNetwork.subviewRegister}</span>
              </button>

              <button
                type="button"
                onClick={() => setNetworkSubView('directory')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                  networkSubView === 'directory'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>
                  {tNetwork.subviewDirectory} (
                  {advisorsList.filter((a) => a.id !== 'adv-admin' && a.id !== 'adv-luisma').length})
                </span>
              </button>
            </div>

            {/* SUB-VIEW 1: MONITOR DE PROSPECCIÓN & AUDITORÍAS CON FILTROS AVANZADOS */}
            {networkSubView === 'monitor' && (
              <div className="space-y-4">
                {/* Advanced Multi-Criteria Filter Bar */}
                <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-300 font-bold">
                    <Filter className="w-4 h-4 text-amber-400" />
                    <span>{isEn ? 'Network Audit & Follow-Up Filters:' : 'Filtros de Auditoría y Seguimiento de Red:'}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
                    {/* Filter Advisor */}
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">
                        {isEn ? 'Advisor / Agency' : 'Asesor / Agencia'}
                      </label>
                      <select
                        value={networkAdvisorFilter}
                        onChange={(e) => setNetworkAdvisorFilter(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="all">{isEn ? 'All Members' : 'Todos los Miembros'}</option>
                        {advisorsList
                          .filter((a) => a.id !== 'adv-admin' && a.id !== 'adv-luisma')
                          .map((adv) => (
                            <option key={adv.id} value={adv.id}>
                              {adv.name} ({adv.accountType === 'partner_agency' ? (isEn ? 'Agency' : 'Agencia') : (isEn ? 'Advisor' : 'Asesor')})
                            </option>
                          ))}
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
                        <option value="internal_advisor">{isEn ? '💼 Internal Advisors' : '💼 Asesores Internos'}</option>
                        <option value="partner_agency">{isEn ? '🏢 Partner Agencies (B2B)' : '🏢 Agencias Partners (B2B)'}</option>
                      </select>
                    </div>

                    {/* Filter Country */}
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">{isEn ? 'Country' : 'País'}</label>
                      <select
                        value={networkCountryFilter}
                        onChange={(e) => setNetworkCountryFilter(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="all">{isEn ? 'All Countries' : 'Todos los Países'}</option>
                        {availableCountries.map((c) => (
                          <option key={c} value={c}>
                            {c === 'Colombia' ? '🇨🇴 Colombia' : c === 'México' ? '🇲🇽 México' : c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filter City */}
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">{isEn ? 'City' : 'Ciudad'}</label>
                      <select
                        value={networkCityFilter}
                        onChange={(e) => setNetworkCityFilter(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="all">{isEn ? 'All Cities' : 'Todas las Ciudades'}</option>
                        {availableCities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filter Mode */}
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">{isEn ? 'Mode' : 'Modalidad'}</label>
                      <select
                        value={networkModeFilter}
                        onChange={(e) => setNetworkModeFilter(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="all">{isEn ? 'All Modes' : 'Todas las Modalidades'}</option>
                        <option value="create">{isEn ? '🏗️ New Listings' : '🏗️ Fichas Nuevas'}</option>
                        <option value="audit">{isEn ? '🔬 Top 3 Audits' : '🔬 Auditorías Top 3'}</option>
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
                        placeholder={isEn ? 'Search by client, category, or keywords...' : 'Buscar por cliente, categoría o palabras clave...'}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                      />
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setNetworkAdvisorFilter('all');
                        setNetworkTypeFilter('all');
                        setNetworkCountryFilter('all');
                        setNetworkCityFilter('all');
                        setNetworkModeFilter('all');
                        setNetworkSearch('');
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition cursor-pointer shrink-0"
                    >
                      {isEn ? 'Reset Filters' : 'Restablecer Filtros'}
                    </button>
                  </div>
                </div>

                {/* Dossiers Grid */}
                {networkFilteredDossiers.length === 0 ? (
                  <div className="text-center py-16 p-8 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
                    <Layers className="w-10 h-10 text-slate-600 mx-auto" />
                    <h3 className="text-base font-bold text-white">{isEn ? 'No dossiers found with current filters' : 'No hay expedientes con los filtros seleccionados'}</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      {isEn ? 'Try adjusting advisor, country, or city filters.' : 'Intenta modificando los filtros de asesor, país o ciudad.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {networkFilteredDossiers.map((d) => (
                      <div
                        key={d.id}
                        className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition flex flex-col justify-between space-y-4 shadow-lg group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                d.mode === 'create'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                              }`}
                            >
                              {d.mode === 'create' ? (isEn ? '🏗️ New Listing' : '🏗️ Ficha Nueva') : (isEn ? '🔬 Top 3 Audit' : '🔬 Auditoría Top 3')}
                            </span>

                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                d.advisorType === 'partner_agency'
                                  ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                                  : 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                              }`}
                            >
                              {d.advisorType === 'partner_agency' ? (isEn ? '🏢 Partner Agency' : '🏢 Agencia Partner') : (isEn ? '💼 Internal Advisor' : '💼 Asesor Interno')}
                            </span>

                            <span className="text-[10px] text-slate-500 font-mono ml-auto">
                              {new Date(d.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-base font-black text-white group-hover:text-amber-300 transition">
                              {d.clientName}
                            </h4>
                            <p className="text-xs text-slate-400">
                              📍 {d.city}, {d.country || 'Colombia'} {d.neighborhood ? `• ${d.neighborhood}` : ''}
                            </p>
                            <span className="text-[11px] text-indigo-400 font-bold block mt-1">{d.category}</span>
                          </div>

                          {d.data?.healthScore !== undefined && (
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                  d.data.healthScore < 50
                                    ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                                    : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                }`}
                              >
                                Score: {d.data.healthScore}/100
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {d.data.healthScore < 50 ? (isEn ? 'High Sales Closing Opportunity' : 'Oportunidad de Venta Alta') : (isEn ? 'Optimized Profile' : 'Perfil Optimizado')}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-indigo-400" />
                              {d.advisorName}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">{d.advisorPhone}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleLoadDossier(d)}
                              className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 active:scale-98"
                            >
                              <span>{isEn ? '👁️ Load & View' : '👁️ Cargar y Ver'}</span>
                            </button>

                            {d.data?.whatsappOnboardingMessage && (
                              <a
                                href={`https://wa.me/?text=${encodeURIComponent(d.data.whatsappOnboardingMessage)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={isEn ? 'Send Kit via WhatsApp' : 'Enviar Kit por WhatsApp'}
                                className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 transition cursor-pointer"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDeleteDossier(d.id)}
                              title={isEn ? 'Delete Dossier' : 'Eliminar Expediente'}
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
              </div>
            )}

            {/* SUB-VIEW 2: FORMULARIO DE REGISTRO (ASESOR INTERNO VS AGENCIA PARTNER) */}
            {networkSubView === 'register' && (
              <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
                <div>
                  <h3 className="text-lg font-black text-white">{tNetwork.registerTitle}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {tNetwork.registerDesc}
                  </p>
                </div>

                {/* Account Type Toggle */}
                <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-slate-950 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setNewAccountType('internal_advisor')}
                    className={`py-3 px-4 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-2 ${
                      newAccountType === 'internal_advisor'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>{tNetwork.optAdvisor}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewAccountType('partner_agency')}
                    className={`py-3 px-4 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-2 ${
                      newAccountType === 'partner_agency'
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>{tNetwork.optAgency}</span>
                  </button>
                </div>

                <form onSubmit={handleCreateAdvisor} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      {newAccountType === 'partner_agency'
                        ? (isEn ? 'Partner Agency Business Name *' : 'Razón Social o Nombre de la Agencia *')
                        : (isEn ? 'Sales Advisor Full Name *' : 'Nombre Completo del Asesor *')}
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">{tNetwork.countryLabel} *</label>
                      <input
                        type="text"
                        value={newAdvisorCountry}
                        onChange={(e) => setNewAdvisorCountry(e.target.value)}
                        placeholder={isEn ? 'USA, Mexico, Spain...' : 'Colombia, México, España...'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">{tNetwork.cityLabel} *</label>
                      <input
                        type="text"
                        value={newAdvisorCity}
                        onChange={(e) => setNewAdvisorCity(e.target.value)}
                        placeholder={isEn ? 'Miami, Austin, CDMX...' : 'Bogotá, Medellín, CDMX...'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">{tNetwork.userLabel}</label>
                      <input
                        type="text"
                        value={newAdvisorUser}
                        onChange={(e) => setNewAdvisorUser(e.target.value)}
                        placeholder={isEn ? 'e.g. michael or apexagency' : 'ej: carlos o rocketagency'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white lowercase focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">{tNetwork.passLabel}</label>
                      <input
                        type="text"
                        value={newAdvisorPass}
                        onChange={(e) => setNewAdvisorPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      {tNetwork.phoneLabel}
                    </label>
                    <input
                      type="text"
                      value={newAdvisorPhone}
                      onChange={(e) => setNewAdvisorPhone(e.target.value)}
                      placeholder="+13051234567 o +57..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Agency-only License monetization settings */}
                  {newAccountType === 'partner_agency' && (
                    <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-3">
                      <div className="flex items-center gap-2 text-purple-300 font-black">
                        <DollarSign className="w-4 h-4" />
                        <span>{isEn ? 'B2B Monthly Software License Settings:' : 'Configuración de Licencia Mensual B2B:'}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">{tNetwork.monthlyFeeLabel}</label>
                          <input
                            type="number"
                            value={newAdvisorMonthlyFee}
                            onChange={(e) => setNewAdvisorMonthlyFee(Number(e.target.value))}
                            placeholder="49"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-purple-500/50 text-purple-200 font-bold focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">{tNetwork.licenseStatusLabel}</label>
                          <select
                            value={newAdvisorLicenseStatus}
                            onChange={(e) => setNewAdvisorLicenseStatus(e.target.value as any)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-purple-500/50 text-white focus:outline-none"
                          >
                            <option value="active">{isEn ? '✅ Active (Paid)' : '✅ Activa y al día'}</option>
                            <option value="pending_payment">{isEn ? '⏳ Payment Pending' : '⏳ Pendiente de Pago'}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">{isEn ? 'Founder Master Key (Luisma) *' : 'Clave Maestra de Dueño (Luisma) *'}</label>
                    <input
                      type="password"
                      value={adminMasterKey}
                      onChange={(e) => setAdminMasterKey(e.target.value)}
                      placeholder="admin"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-amber-500/40 text-amber-300 font-mono focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingAdvisor}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg active:scale-98"
                  >
                    {isSavingAdvisor
                      ? (isEn ? 'Saving...' : 'Registrando...')
                      : newAccountType === 'partner_agency'
                      ? (isEn ? '🚀 Activate Partner Agency License' : '🚀 Activar Licencia de Agencia Partner')
                      : (isEn ? '+ Create Sales Advisor' : '+ Crear Asesor Comercial')}
                  </button>
                </form>
              </div>
            )}

            {/* SUB-VIEW 3: DIRECTORIO DE ASESORES & AGENCIAS CON RENDIMIENTO */}
            {networkSubView === 'directory' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  {advisorsList
                    .filter((adv) => adv.id !== 'adv-admin' && adv.id !== 'adv-luisma')
                    .map((adv) => {
                      const advisorDossiers = savedDossiers.filter((d) => d.advisorId === adv.id);
                      const createsCount = advisorDossiers.filter((d) => d.mode === 'create').length;
                      const auditsCount = advisorDossiers.filter((d) => d.mode === 'audit').length;

                      return (
                        <div
                          key={adv.id}
                          className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 shadow-lg hover:border-amber-400/50 transition group"
                        >
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                  adv.accountType === 'partner_agency'
                                    ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                                    : 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                                }`}
                              >
                                {adv.accountType === 'partner_agency' ? (isEn ? '🏢 Partner Agency' : '🏢 Agencia Partner') : (isEn ? '💼 Internal Advisor' : '💼 Asesor Interno')}
                              </span>

                              {adv.accountType === 'partner_agency' && (
                                <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                  ${adv.monthlyFeeUsd || 49} {isEn ? 'USD/mo' : 'USD/mes'}
                                </span>
                              )}
                            </div>

                            <div>
                              <h4 className="text-base font-black text-white group-hover:text-amber-300 transition">
                                {adv.name}
                              </h4>
                              <p className="text-xs text-slate-400">
                                📍 {adv.city || 'Bogotá'}, {adv.country || 'Colombia'}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                                <span>
                                  User: <strong className="text-slate-300">{adv.username}</strong>
                                </span>
                                <span>•</span>
                                <span>Tel: {adv.phone}</span>
                              </div>
                            </div>

                            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                                {isEn ? 'Prospecting & Audits Record:' : 'Cuentas Prospectadas:'}
                              </span>
                              <div className="flex items-center justify-between text-xs font-black text-white">
                                <span>{advisorDossiers.length} {isEn ? 'Dossiers' : 'Expedientes'}</span>
                                <span className="text-[10px] text-slate-400 font-normal">
                                  ({createsCount} {isEn ? 'new' : 'nuevas'}, {auditsCount} {isEn ? 'audits' : 'auditorías'})
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleViewAdvisorDossiers(adv)}
                            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white font-black text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-98"
                          >
                            <span>{isEn ? 'View Dossiers in Monitor' : 'Ver Expedientes en Monitor'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL: LOGIN / SELECTOR DE PERFIL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 print:hidden animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-center space-y-4">
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
                  onClick={() => setShowAuthModal(false)}
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

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center mx-auto shadow-xl">
              <Lock className="w-6 h-6 text-slate-950" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">{tAuth.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{tAuth.subtitle}</p>
            </div>

            {/* Quick 1-Click Selectors */}
            <div className="space-y-2 pt-1 text-left">
              <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block px-1">
                {tAuth.quickAccess}
              </span>

              <button
                type="button"
                onClick={() => handleQuickLogin('luisma')}
                className="w-full p-3 rounded-2xl bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-500/50 hover:border-amber-400 flex items-center justify-between text-left transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-base shadow-md group-hover:scale-105 transition">
                    👑
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-amber-200 text-xs">Luisma • Director General</span>
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">{tAuth.founderRole}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">{tAuth.founderDesc}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('carlos')}
                className="w-full p-3 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/40 hover:border-indigo-400 flex items-center justify-between text-left transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-base shadow-md group-hover:scale-105 transition">
                    💼
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-indigo-200 text-xs">Carlos • Consultor Comercial</span>
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/40">{tAuth.advisorRole}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">{tAuth.advisorDesc}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition" />
              </button>
            </div>

            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{tAuth.orCredentials}</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <form onSubmit={handleLogin} className="space-y-3 text-left text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">{tAuth.usernameLabel}</label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => {
                    setLoginUsername(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  placeholder={isEn ? 'e.g. carlos or your username' : 'ej: carlos o tu usuario'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">{tAuth.passwordLabel}</label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
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

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500 print:hidden">
        <p>Prestigia Local Studio™ • Google Maps Top 3 Optimization Engine © 2026</p>
      </footer>
    </div>
  );
}
