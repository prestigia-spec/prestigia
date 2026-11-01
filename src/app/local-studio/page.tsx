'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
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
  FileText,
  SlidersHorizontal,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  X,
  Phone,
  MessageSquare,
  Lock,
  ChevronRight,
  UserCheck,
  Building2,
  Trash2,
  Save,
  Info,
  HelpCircle,
  Clock,
  Layers,
  Award,
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
} from 'lucide-react';

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

const UI_TEXT = {
  es: {
    tagline: 'Suite de Creación & Optimización Google Maps',
    loginProfile: 'Ingresar Perfil',
    switchProfile: 'Cambiar',
    downloadPdf: 'Descargar PDF',
    tabCreate: '🏗️ Crear Ficha Ganadora (Desde Cero)',
    tabAudit: '🔬 Auditar & Optimizar Ficha Existente',
    tabTools: '⚡ Armas Top 3 (Geo-Grid & ROI)',
    tabDossiers: '📁 Mis Clientes (Luisma)',
    tabGuide: '📖 Guía Dónde Dar Clic en Google',
    tabPitch: '🗣️ Guion Comercial para Asesores',
    tabNetwork: '🏢 Red de Asesores & Agencias B2B',
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
    mod2Badge: 'Módulo 2: Para Negocios que Ya Tienen Google Maps pero no venden',
    mod2Title: 'Auditoría Forense de Brechas & Upgrade al Top 3',
    mod2Desc: 'Descubre con exactitud por qué los 3 líderes de su zona están acaparando a todos los clientes y genera la hoja de ruta técnica para destronarlos en 90 días con el ecosistema Prestigia.',
    mod2Target: 'Objetivo de Ascenso',
    mod2TargetVal: 'Conquista Top 3',
    auditFormHeader: 'Ficha Actual a Diagnosticar',
    auditBizName: 'Nombre Comercial de la Ficha *',
    auditBizNamePlaceholder: 'Ej: La Suiza Parrilla',
    googleUrl: 'Enlace de Google Maps (Opcional)',
    googleUrlPlaceholder: 'https://maps.google.com/?cid=...',
    currentRating: 'Calificación Actual ★',
    publicReviews: 'Opiniones Públicas',
    auditCityPlaceholder: 'Ej: Medellín o Bogotá',
    auditNeighborhoodPlaceholder: 'Ej: El Poblado o Usaquén',
    btnAudit: 'Escanear Brechas & Generar Hoja de Ruta',
    btnAuditing: 'Analizando Brechas frente al Top 3...',
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
    downloadPdf: 'Download PDF',
    tabCreate: '🏗️ Build Winning Listing (From Scratch)',
    tabAudit: '🔬 Audit & Upgrade Existing Listing',
    tabTools: '⚡ Top 3 Weapons (Geo-Grid & ROI)',
    tabDossiers: '📁 My Clients (Luisma)',
    tabGuide: '📖 Step-by-Step Google Click Guide',
    tabPitch: '🗣️ Sales Pitch & Objection Scripts',
    tabNetwork: '🏢 Sales Advisors & Agency Network',
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
    mod2Badge: 'Module 2: For Businesses on Google Maps Not Getting Sales',
    mod2Title: 'Forensic Gap Audit & Top 3 Upgrade',
    mod2Desc: 'Discover exactly why the top 3 competitors in your area are capturing all clients, and generate the 90-day technical roadmap to overtake them with Prestigia.',
    mod2Target: 'Ranking Goal',
    mod2TargetVal: 'Conquering Top 3',
    auditFormHeader: 'Current Profile to Audit',
    auditBizName: 'Business Listing Name *',
    auditBizNamePlaceholder: 'e.g. Miami Smile Center',
    googleUrl: 'Google Maps Link (Optional)',
    googleUrlPlaceholder: 'https://maps.google.com/?cid=...',
    currentRating: 'Current Rating ★',
    publicReviews: 'Public Reviews',
    auditCityPlaceholder: 'e.g. Miami, FL or Austin, TX',
    auditNeighborhoodPlaceholder: 'e.g. Brickell or Downtown',
    btnAudit: 'Scan Gaps & Generate Action Roadmap',
    btnAuditing: 'Analyzing Gaps Against Top 3 Leaders...',
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

export default function LocalStudioPage() {
  // -------------------------------------------------------------
  // 1. AUTHENTICATION & ADVISOR SESSION
  // -------------------------------------------------------------
  const [currentUser, setCurrentUser] = useState<StudioAdvisorUser | null>(null);
  const [loginUsername, setLoginUsername] = useState('luisma');
  const [loginPassword, setLoginPassword] = useState('1234');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Active Workspace Tab
  const [activeTab, setActiveTab] = useState<'create' | 'audit' | 'tools' | 'dossiers' | 'guide' | 'pitch' | 'advisors' | 'network'>('create');

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
    setCurrentUser(null);
    setShowAuthModal(true);
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
  const [existingReviews, setExistingReviews] = useState<number>(38);
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [businessModel, setBusinessModel] = useState<'storefront' | 'service_area'>('storefront');
  const [serviceAreas, setServiceAreas] = useState('');

  const t = UI_TEXT[lang] || UI_TEXT.es;
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
  const [activeEngine, setActiveEngine] = useState<string>('');

  // 4 Elite Local SEO Power Tools State
  const [toolsActiveTab, setToolsActiveTab] = useState<'geogrid' | 'roicalc' | 'geotag' | 'citations'>('geogrid');
  const [geoGridKeyword, setGeoGridKeyword] = useState('Restaurante');
  const [geoGridRadius, setGeoGridRadius] = useState<'1km' | '3km' | '5km'>('3km');
  const [roiAverageTicket, setRoiAverageTicket] = useState<number>(65);
  const [roiCurrentRank, setRoiCurrentRank] = useState<number>(8);
  const [roiMonthlySearches, setRoiMonthlySearches] = useState<number>(1200);
  const [geoTagFilename, setGeoTagFilename] = useState('');
  const [geoTagKeywords, setGeoTagKeywords] = useState('');
  const [geoTagResult, setGeoTagResult] = useState<string | null>(null);
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
  const handleGenerate = async (targetMode: 'create' | 'audit') => {
    if (!businessName.trim()) {
      showToast('⚠️ Ingresa el nombre comercial del negocio');
      return;
    }

    setIsGenerating(true);
    setGeneratedData(null);

    try {
      const payload = {
        mode: targetMode,
        businessName: businessName.trim(),
        category,
        city: city.trim() || 'Colombia',
        neighborhood: neighborhood.trim(),
        specialties: specialties.trim(),
        phone: phone.trim() || currentUser?.phone || '',
        googleUrl: googleUrl.trim(),
        existingRating,
        existingReviews,
        lang,
        businessModel,
        serviceAreas: serviceAreas.trim(),
      };

      const res = await fetch('/api/local-studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (resData.success && resData.data) {
        setGeneratedData(resData.data);
        setActiveEngine(resData.engine || 'Prestigia AI');
        showToast('✨ ¡Arquitectura Top 3 generada y registrada en Cartera!');

        // AUTO-SAVE to database so every generation is permanently audited
        try {
          const autoPayload = {
            advisorId: currentUser?.id || 'adv-luisma',
            advisorName: currentUser?.name || 'Luisma • Director General',
            advisorPhone: currentUser?.phone || '+573058314049',
            clientName: businessName.trim(),
            category,
            city: city.trim() || 'Colombia',
            neighborhood: neighborhood.trim(),
            googleUrl: googleUrl.trim(),
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
        mode: activeTab === 'audit' ? 'audit' : 'create',
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
    showToast(`📂 Visualizando cuentas de ${advisor.name}`);
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

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 select-none">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <MapPin className="w-5 h-5 text-slate-950" />
            </div>
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
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                title="Cambiar de perfil (Director / Asesor)"
                className="ml-2 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer text-[10px] font-bold"
              >
                {t.switchProfile}
              </button>
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

      {/* Main Workspace Navigation Switcher */}
      <nav className="bg-slate-900/80 border-b border-slate-800/80 px-4 sm:px-8 py-2 overflow-x-auto print:hidden">
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

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 print:max-w-none print:p-0 print:m-0 print:space-y-2">
        {/* PRINT-ONLY CORPORATE DOSSIER HEADER */}
        <div className="hidden print:flex items-center justify-between pb-2 border-b-2 border-slate-800 text-[10px] text-slate-600 font-bold uppercase tracking-wider mb-3">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-950 text-xs">PRESTIGIA LOCAL STUDIO</span>
            <span>•</span>
            <span className="text-amber-700">EXPEDIENTE MAESTRO DE POSICIONAMIENTO LOCAL TOP 3</span>
          </div>
          <div>
            <span>CONSULTOR ASIGNADO: {currentUser?.name || 'Prestigia LatAm'} • WHATSAPP: {currentUser?.phone || '+57 305 831 4049'}</span>
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
                        'Mensaje para pedir fotos y video al cliente'
                      )
                    }
                    className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-emerald-500/30 text-emerald-300 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{t.btnCopyWhatsapp}</span>
                  </button>
                )}
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
                          Arquitectura Lista: <strong className="text-white">{businessName}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSaveDossier}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5 text-amber-400" />
                          <span>Guardar en Cartera</span>
                        </button>
                        <button
                          type="button"
                          onClick={handlePrint}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Descargar PDF</span>
                        </button>
                      </div>
                    </div>

                    {/* 1. Categorías Oficiales */}
                    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 print-card-box">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                          Paso Clave 1: Taxonomía Algorítmica
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
                          <span>Copiar Todas</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/40">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-1">
                            Categoría Principal (Oficial Google)
                          </span>
                          <span className="text-sm font-black text-white">{generatedData.primaryCategory}</span>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                            {generatedData.secondaryCategories.length} Subcategorías Secundarias (Para Ganar Búsquedas)
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
                          Paso Clave 2: Título Estratégico Anti-Suspensión
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(generatedData.optimizedTitle, 'Título')}
                          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer print:hidden"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Título</span>
                        </button>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-black text-white flex items-center justify-between">
                        <span>{generatedData.optimizedTitle}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Combina el nombre oficial de la marca con la palabra clave local y la zona, garantizando máxima indexación sin riesgo de penalización por Google.
                      </p>
                    </div>

                    {/* 3. Descripción Comercial SEO (745 caracteres) */}
                    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5 print-card-box">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                            Paso Clave 3: Descripción de Alto Impacto
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {generatedData.commercialDescription.length} / 750 Caracteres
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(generatedData.commercialDescription, 'Descripción')}
                          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer print:hidden"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Descripción</span>
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
                          Paso Clave 4: Catálogo Estructurado de Servicios / Productos
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Cargar en la pestaña "Productos" de Google
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
                        <h3 className="text-sm font-black text-white">5. Checklist de Fotos para Pedir al Cliente</h3>
                      </div>
                      <div className="space-y-2 text-xs">
                        {generatedData.photoChecklist.map((ph, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                          >
                            <div className="space-y-0.5">
                              <span className="font-bold text-white text-xs">
                                📷 {ph.item} ({ph.count} {ph.count === 1 ? 'foto' : 'fotos'})
                              </span>
                              <p className="text-[11px] text-slate-400">{ph.tip}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[10px] text-slate-500 block">Nombre sugerido para SEO:</span>
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
                          6. Preguntas y Respuestas Oficiales (Q&A Seeding)
                        </h3>
                      </div>
                      <div className="space-y-2 text-xs">
                        {generatedData.preventiveFaqs.map((faq, i) => (
                          <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                            <span className="font-bold text-amber-300 block text-xs">P: {faq.question}</span>
                            <p className="text-slate-300 text-[11px] leading-relaxed">R: {faq.answer}</p>
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
                          Video de 60s sin cortes
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {generatedData.verificationGuide.overview}
                      </p>
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                          <strong className="text-amber-400 block mb-0.5">Toma 1 (Exterior):</strong>
                          <span className="text-slate-300 text-[11px]">{generatedData.verificationGuide.cameraTake1}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                          <strong className="text-indigo-300 block mb-0.5">Toma 2 (Acceso):</strong>
                          <span className="text-slate-300 text-[11px]">{generatedData.verificationGuide.cameraTake2}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                          <strong className="text-emerald-400 block mb-0.5">Toma 3 (Interior y Facturación):</strong>
                          <span className="text-slate-300 text-[11px]">{generatedData.verificationGuide.cameraTake3}</span>
                        </div>
                      </div>
                    </div>

                    {/* 8. Mensaje de WhatsApp Listo para Enviar al Cliente */}
                    <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-2.5 print-card-box">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-emerald-400" />
                          <h3 className="text-sm font-black text-white">Kit para Pedir Fotos y Video por WhatsApp</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(generatedData.whatsappOnboardingMessage, 'Mensaje de WhatsApp')
                          }
                          className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black transition flex items-center gap-1.5 cursor-pointer print:hidden"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Mensaje</span>
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
                            Algoritmo Top 3
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                              {lang === 'en' ? 'Current Reviews' : 'Reseñas Actuales'}
                            </span>
                            <strong className="text-base font-black text-white">
                              {generatedData.reviewVelocityPlan.currentReviews} ★
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
                              +{generatedData.reviewVelocityPlan.reviewsPerWeek} / sem
                            </strong>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                              {lang === 'en' ? 'Time to Top 3' : 'Tiempo al Top 3'}
                            </span>
                            <strong className="text-base font-black text-purple-300">
                              {generatedData.reviewVelocityPlan.weeksToTop3} semanas
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
                            4 Semanas Listas
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {generatedData.monthlyPostsBooster.map((post, i) => (
                            <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                                    Semana {post.week} • {post.type}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(`${post.title}\n\n${post.body}`, `Post Semana ${post.week}`)}
                                    className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer print:hidden"
                                  >
                                    <Copy className="w-3 h-3" />
                                    <span>Copiar</span>
                                  </button>
                                </div>
                                <h4 className="font-black text-white text-xs">{post.title}</h4>
                                <p className="text-[11px] text-slate-300 leading-snug">{post.body}</p>
                              </div>
                              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                                <span>Botón CTA:</span>
                                <span className="font-bold text-emerald-400">{post.callToAction}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Advisor Sign-off Box */}
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs print:border-t print:border-slate-300">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Expediente Generado por:</span>
                        <span className="font-black text-white text-sm">{currentUser?.name || 'Prestigia LatAm'}</span>
                        <span className="text-slate-400 text-xs block">Línea de Asesoría: {currentUser?.phone || '+57 305 831 4049'}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 uppercase font-bold block">Garantía Prestigia Top 3</span>
                        <span className="text-xs text-slate-400">Arquitectura SEO Certificada 2026</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =============================================================
            TAB 2: AUDITAR FICHA EXISTENTE & UPGRADE AL TOP 3
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
              <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl print:hidden">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <Search className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-black text-white">{t.auditFormHeader}</h2>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">{t.auditBizName}</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder={t.auditBizNamePlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">{t.googleUrl}</label>
                    <input
                      type="text"
                      value={googleUrl}
                      onChange={(e) => setGoogleUrl(e.target.value)}
                      placeholder={t.googleUrlPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition"
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400 transition font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">{t.publicReviews}</label>
                      <input
                        type="number"
                        min="0"
                        value={existingReviews}
                        onChange={(e) => setExistingReviews(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400 transition font-bold"
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400 transition"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">{t.neighborhood}</label>
                      <input
                        type="text"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        placeholder={t.auditNeighborhoodPlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">{t.sector}</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400 transition"
                    >
                      {categoryOptions.map((c: string) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleGenerate('audit')}
                  disabled={isGenerating || !businessName.trim()}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer active:scale-98"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{t.btnAuditing}</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>{t.btnAudit}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right: Audit Diagnostic Output */}
              <div className="lg:col-span-7 space-y-4">
                {generatedData?.healthScore && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    {/* Score Bar */}
                    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between print-card-box">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">{t.healthScore}</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-amber-400">{generatedData.healthScore} / 100</span>
                          <span className="text-xs text-rose-400 font-bold bg-rose-950 px-2 py-0.5 rounded border border-rose-500/30">
                            {t.vulnerableBadge}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 print:hidden">
                        <button
                          type="button"
                          onClick={handleSaveDossier}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5 text-amber-400" />
                          <span>{t.save}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handlePrint}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>{t.printPdf}</span>
                        </button>
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
            TAB: 4 ARMAS DE ÉLITE LOCAL SEO (GEO-GRID, ROI, GEOTAG, CITAS)
            ============================================================= */}
        {activeTab === 'tools' && (
          <div className="space-y-6 print:hidden">
            {/* Header intro */}
            <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-950/40 border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300">
                    {lang === 'en' ? 'High-Value Conversion Arsenal • BrightLocal & Local Falcon Style' : 'Arsenal de Cierre de Alto Valor • Estilo BrightLocal & Local Falcon'}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    {lang === 'en' ? '4 Local Dominance & Commercial Closing Weapons' : '4 Armas de Dominio Local & Cierre Comercial'}
                  </h1>
                  <p className="text-xs text-slate-300 max-w-2xl">
                    {lang === 'en' ? 'Visual sales and forensic optimization tools showing clients how much revenue they are losing today and how Prestigia positions them at the top.' : 'Herramientas de venta visual y optimización forense para demostrarle al cliente cuánto dinero está perdiendo hoy y cómo Prestigia lo posiciona en la cima.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                    {lang === 'en' ? '⚡ 2026 Algorithm Active' : '⚡ Algoritmo 2026 Activo'}
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
                <span>{lang === 'en' ? '1. 3x3 Geo-Grid Heatmap' : '1. Simulador Geo-Grid 3x3'}</span>
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
                <span>{lang === 'en' ? '2. Financial Loss Calculator (ROI)' : '2. Calculadora de Pérdida Financiera (ROI)'}</span>
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
                <span>{lang === 'en' ? '3. EXIF Geo-Tagging Injector' : '3. Inyector de Geo-Tagging EXIF'}</span>
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
                <span>{lang === 'en' ? '4. Citations Directory (USA/LatAm)' : '4. Hub de Citaciones USA & LatAm'}</span>
              </button>
            </div>

            {/* TOOL 1: SIMULADOR VISUAL GEO-GRID 3X3 */}
            {toolsActiveTab === 'geogrid' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <span>🗺️ Simulador de Posición Geo-Grid 3x3 (Local Falcon Style)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Demuestra visualmente cómo cae el ranking del cliente a medida que nos alejamos de su ubicación.
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
                        Radio {rad}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left: Interactive 3x3 Geo-Grid Heatmap */}
                  <div className="md:col-span-7 bg-slate-950 p-6 rounded-3xl border border-slate-800 relative">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center justify-between">
                      <span>Mapa Satelital de Cobertura ({city || 'Tu Ciudad'})</span>
                      <span className="text-amber-400">Palabra clave: "{category.split('/')[0].trim()}"</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3.5 max-w-sm mx-auto aspect-square">
                      {[
                        { pin: 'P1', rank: geoGridRadius === '1km' ? 2 : 7, color: geoGridRadius === '1km' ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950', note: 'Noroeste' },
                        { pin: 'P2', rank: geoGridRadius === '1km' ? 1 : 5, color: geoGridRadius === '1km' ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950', note: 'Norte' },
                        { pin: 'P3', rank: geoGridRadius === '5km' ? 14 : 9, color: 'bg-rose-600 text-white', note: 'Noreste' },
                        { pin: 'P4', rank: geoGridRadius === '1km' ? 1 : 4, color: geoGridRadius === '1km' ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950', note: 'Oeste' },
                        { pin: 'CENTRO', rank: 1, color: 'bg-emerald-400 text-slate-950 ring-4 ring-emerald-500/30', note: 'Sede Central' },
                        { pin: 'P6', rank: geoGridRadius === '5km' ? 16 : 8, color: 'bg-rose-600 text-white', note: 'Este' },
                        { pin: 'P7', rank: geoGridRadius === '5km' ? 18 : 11, color: 'bg-rose-600 text-white', note: 'Suroeste' },
                        { pin: 'P8', rank: geoGridRadius === '1km' ? 3 : 8, color: geoGridRadius === '1km' ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950', note: 'Sur' },
                        { pin: 'P9', rank: geoGridRadius === '5km' ? 21 : 15, color: 'bg-rose-600 text-white', note: 'Sureste' },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className={`rounded-2xl p-3 flex flex-col items-center justify-center font-black transition-all transform hover:scale-105 shadow-lg ${item.color}`}
                        >
                          <span className="text-[9px] opacity-75 uppercase">{item.note}</span>
                          <span className="text-2xl font-black">#{item.rank}</span>
                          <span className="text-[8px] font-bold uppercase">{item.rank <= 3 ? 'TOP 3' : 'FUERA'}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-4 mt-5 text-[11px] font-bold">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>Puesto 1 al 3 (Se llevan el 84% de llamadas)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-rose-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                        <span>Puesto 4+ (Invisibles)</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Pitch Breakdown */}
                  <div className="md:col-span-5 space-y-4 text-xs">
                    <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                        Diagnóstico para el Asesor:
                      </span>
                      <p className="text-slate-200 leading-relaxed text-xs">
                        "Don {businessName || 'Carlos'}, cuando usted busca parado en su propio local aparece de #1. Pero cuando una persona busca a solo <strong>{geoGridRadius}</strong> de distancia en su mismo barrio, su negocio cae al puesto <strong>#8 o #14</strong>. Toda esa clientela se la están llevando sus 3 competidores más cercanos."
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                        Solución con Prestigia:
                      </span>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        Con la inyección de subcategorías secundarias, menciones de vecindario en la descripción y 8 reseñas semanales geolocalizadas, extendemos el radio verde a toda la ciudad en 90 días.
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
                    <span>Calculadora de Pérdida Financiera por estar fuera del Top 3</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Convierte la posición de Google Maps en dólares exactos perdidos por el cliente cada mes.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <label className="block font-bold text-slate-300">Ticket Promedio por Cliente (USD)</label>
                    <input
                      type="number"
                      value={roiAverageTicket}
                      onChange={(e) => setRoiAverageTicket(Number(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 font-black text-base focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500">Lo que gasta un cliente promedio en su negocio.</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <label className="block font-bold text-slate-300">Posición Actual en Google Maps</label>
                    <select
                      value={roiCurrentRank}
                      onChange={(e) => setRoiCurrentRank(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-black text-base focus:outline-none"
                    >
                      <option value="4">Puesto #4 (Al borde del Top 3)</option>
                      <option value="8">Puesto #8 (Segunda vista)</option>
                      <option value="15">Puesto #15+ (Completamente invisible)</option>
                    </select>
                    <span className="text-[10px] text-slate-500">Lugar donde aparece hoy al buscar su servicio.</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <label className="block font-bold text-slate-300">Búsquedas Mensuales Estimadas en Zona</label>
                    <input
                      type="number"
                      value={roiMonthlySearches}
                      onChange={(e) => setRoiMonthlySearches(Number(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-black text-base focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500">Personas buscando este servicio al mes.</span>
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
                            Fuga de Facturación Detectada
                          </span>
                          <h4 className="text-lg font-black text-white mt-1">
                            Dinero que tu negocio está regalando a la competencia:
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-black text-rose-400">
                            ${monthlyLoss.toLocaleString()} USD
                          </span>
                          <span className="text-xs text-slate-400 block font-bold">perdidos cada 30 días</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Llamadas y Clics Perdidos:</span>
                          <strong className="text-base font-black text-white">~{lostClicks} búsquedas/mes</strong>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Clientes que no entraron:</span>
                          <strong className="text-base font-black text-amber-400">~{lostClients} clientes nuevos/mes</strong>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Pérdida en 12 Meses:</span>
                          <strong className="text-base font-black text-rose-400">${yearlyLoss.toLocaleString()} USD/año</strong>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 text-xs text-amber-200">
                        <strong className="text-white block mb-0.5">Cierre del Asesor:</strong>
                        "Prestigia le cuesta una fracción de lo que usted pierde en solo una semana sin estar en el Top 3. Con recuperar tan solo 2 clientes al mes, el servicio se paga solo y todo lo demás es ganancia neta."
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
                    <span>Inyector y Generador de Geo-Tagging EXIF para Fotos</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Google lee los metadatos IPTC y coordenadas de las fotos para validar la ubicación real del establecimiento.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Nombre Base de la Foto</label>
                      <input
                        type="text"
                        value={geoTagFilename}
                        onChange={(e) => setGeoTagFilename(e.target.value)}
                        placeholder="ej: fachada-principal o plato-insignia"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-400"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Palabras Clave de Indexación</label>
                      <input
                        type="text"
                        value={geoTagKeywords}
                        onChange={(e) => setGeoTagKeywords(e.target.value)}
                        placeholder="ej: mejor restaurante, comida gourmet, centro"
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
                        showToast('Metadatos EXIF generados');
                      }}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black transition cursor-pointer"
                    >
                      Generar Nomenclatura & Etiquetas EXIF
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <span className="text-[10px] font-black uppercase text-indigo-400 block">
                      Resultado para Renombrar Antes de Subir a Google:
                    </span>
                    <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/30 font-mono text-[11px] text-amber-300 break-all">
                      {geoTagResult || `${(businessName || 'negocio').toLowerCase().replace(/[^a-z0-9]/g, '-')}-${city.toLowerCase()}-fachada-geotagged.jpg`}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Subir fotos con nombres geolocalizados y metadatos IPTC acelera en un 40% la indexación visual en Google Lens y Google Maps.
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
                    <span>Hub de Citaciones y Autoridad NAP (Name, Address, Phone)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Directorio oficial para verificar la consistencia de los datos del cliente en internet y blindar su autoridad frente al algoritmo.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* USA Directoriess */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🇺🇸</span>
                      <h4 className="font-black text-white">Directorio Top de Citaciones EE.UU.</h4>
                    </div>
                    <ul className="space-y-2 text-[11px] text-slate-300">
                      {[
                        { name: 'Apple Maps Connect', authority: 'DA 99', desc: 'Indispensable para usuarios de iPhone y Siri' },
                        { name: 'Bing Places for Business', authority: 'DA 94', desc: 'Búsquedas nativas en Windows y copilotos de IA' },
                        { name: 'Yelp for Business', authority: 'DA 94', desc: 'Principal fuente de reseñas externas leída por Apple' },
                        { name: 'YellowPages (YP.com)', authority: 'DA 89', desc: 'Autoridad local histórica para SEO en EE.UU.' },
                        { name: 'Better Business Bureau (BBB)', authority: 'DA 93', desc: 'Sello definitivo de confianza y legitimidad' },
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
                      <h4 className="font-black text-white">Directorio Top de Citaciones LatAm</h4>
                    </div>
                    <ul className="space-y-2 text-[11px] text-slate-300">
                      {[
                        { name: 'Waze Ads & Local Pins', authority: 'DA 92', desc: 'Navegación automotriz #1 en ciudades latinas' },
                        { name: 'Páginas Amarillas / Publicar', authority: 'DA 76', desc: 'Backlink local de alto valor de directorio' },
                        { name: 'Foursquare & Swarm', authority: 'DA 91', desc: 'Base de datos geo-espacial de Uber y Twitter' },
                        { name: 'Cámara de Comercio / Registro Mercantil', authority: 'DA 85', desc: 'Validación de existencia legal formal' },
                        { name: 'Facebook & Instagram Local Place', authority: 'DA 96', desc: 'Geolocalización para check-in de clientes' },
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
          </div>
        )}
        {activeTab === 'dossiers' && (
          <div className="space-y-6 print:hidden">
            {/* Header & Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300">
                    ⭐ Cartera Personal Privada
                  </span>
                  <span className="text-xs text-slate-500">• Luisma (Cuenta Principal)</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Mis Clientes & Auditorías Privadas
                </h1>
                <p className="text-xs text-slate-400">
                  Expedientes creados y auditados personalmente por ti. Tus clientes están 100% aislados y protegidos de la red comercial.
                </p>
              </div>

              <div className="w-full sm:w-80 relative">
                <input
                  type="text"
                  value={dossierSearch}
                  onChange={(e) => setDossierSearch(e.target.value)}
                  placeholder="Buscar en mis clientes..."
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
                  <span className="text-[11px] text-slate-400 block">Mis Expedientes</span>
                  <strong className="text-xl font-black text-white">{myDossiers.length}</strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Fichas Desde Cero</span>
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
                  <span className="text-[11px] text-slate-400 block">Auditorías Top 3</span>
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
                  <span className="text-[11px] text-slate-400 block">Privacidad</span>
                  <strong className="text-xs font-black text-emerald-400 uppercase">100% Blindado</strong>
                </div>
              </div>
            </div>

            {/* Filter Pills (Clean, personal mode filters only) */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px] font-bold">Filtrar por:</span>
                <button
                  type="button"
                  onClick={() => setDossierModeFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                    dossierModeFilter === 'all'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Todos ({myDossiers.length})
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
                  🏗️ Fichas Nuevas ({myDossiers.filter((d) => d.mode === 'create').length})
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
                  🔬 Auditorías Top 3 ({myDossiers.filter((d) => d.mode === 'audit').length})
                </button>
              </div>

              <span className="text-[11px] text-slate-400 font-medium">
                Mostrando únicamente clientes de la cuenta principal
              </span>
            </div>

            {/* List / Grid of My Dossiers */}
            {isLoadingDossiers ? (
              <div className="text-center py-16 text-slate-400 text-xs space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-400" />
                <p>Cargando tu cartera personal...</p>
              </div>
            ) : myDossiers.length === 0 ? (
              <div className="text-center py-16 p-8 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
                <Layers className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No tienes clientes guardados en tu cuenta personal</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Genera una nueva ficha desde cero o una auditoría en los módulos principales para registrar tu primer cliente.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('create')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-md"
                >
                  🏗️ Crear Primera Ficha Ganadora
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
                          {d.mode === 'create' ? '🏗️ Ficha Nueva' : '🔬 Auditoría Top 3'}
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
                          👑 Luisma (Cuenta Principal)
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{d.advisorPhone}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleLoadDossier(d)}
                          className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10 active:scale-98"
                        >
                          <span>👁️ Cargar y Ver</span>
                        </button>

                        {d.data?.whatsappOnboardingMessage && (
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(d.data.whatsappOnboardingMessage)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Enviar Kit por WhatsApp"
                            className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 transition cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteDossier(d.id)}
                          title="Eliminar Expediente"
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
                    Modo Piloto Automático • Cero Fricción Tecnológica
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    Guía Paso a Paso: Dónde dar Clic en Google en 5 Minutos
                  </h1>
                  <p className="text-xs text-slate-300 max-w-2xl">
                    Instrucciones exactas para ti o cualquiera de tus vendedores. No necesitas saber nada de sistemas: solo sigue los 6 pasos en orden.
                  </p>
                </div>
                <a
                  href="https://business.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition flex items-center gap-2 shadow-lg cursor-pointer shrink-0"
                >
                  <span>Abrir Google Business</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {/* Paso 1 */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-xs">1</span>
                  <h3 className="font-bold text-white text-sm">Abrir Google Business</h3>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Entra a <strong className="text-purple-400">business.google.com</strong> usando el correo de Gmail del negocio o el tuyo. Si no tiene cuenta, inicia sesión con cualquier Gmail.
                </p>
              </div>

              {/* Paso 2 */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-xs">2</span>
                  <h3 className="font-bold text-white text-sm">Escribir Nombre y Categoría</h3>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Pega el <strong>Título Optimizado</strong> que te dio Local Studio. En categoría escribe la <strong>Categoría Principal</strong> y elígela del menú desplegable oficial de Google.
                </p>
              </div>

              {/* Paso 3 */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-xs">3</span>
                  <h3 className="font-bold text-white text-sm">Ubicación y Modelo de Negocio</h3>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  <strong>• Si es Local Físico:</strong> Marca <em>"Sí tienes local abierto al público"</em> y ajusta el pin rojo sobre la entrada.
                  <br />
                  <strong className="text-amber-300">• Si es Profesional Independiente (SAB):</strong> Marca <em>"No, presto servicios en la ubicación del cliente"</em>. Esto <strong>oculta tu dirección de casa</strong> para evitar suspensiones de Google, y luego agregas las <strong>Zonas de Cobertura</strong> que te dio la herramienta.
                </p>
              </div>

              {/* Paso 4 */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-xs">4</span>
                  <h3 className="font-bold text-white text-sm">Video de Verificación</h3>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Google exige un video de 60s sin cortes:
                  <br />
                  <strong>• Para Locales:</strong> 1) Calle y fachada, 2) Llaves abriendo puerta, 3) Caja registradora y datáfono.
                  <br />
                  <strong className="text-indigo-300">• Para Independientes:</strong> 1) Herramientas o computador con software abierto, 2) RUT o documento fiscal y tarjetas, 3) Vehículo de trabajo o bodega. ¡Aprobación rápida en 1 intento!
                </p>
              </div>

              {/* Paso 5 */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-xs">5</span>
                  <h3 className="font-bold text-white text-sm">Inyectar Subcategorías & Copy</h3>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Ve a <em>"Editar Perfil"</em>. En descripción, pega el copy de 745 caracteres. En categorías adicionales, agrega las <strong>5 subcategorías secundarias</strong> que te dio la herramienta.
                </p>
              </div>

              {/* Paso 6 */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-xs">6</span>
                  <h3 className="font-bold text-white text-sm">Cargar Fotos y QR Prestigia</h3>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Sube las fotos renombradas según el checklist de la herramienta. Luego activa el <strong>código QR de Prestigia</strong> en las mesas o mostrador para empezar a recibir reseñas de 5★ de inmediato.
                </p>
              </div>
            </div>

            {/* Anti-Suspension Rules */}
            <div className="p-6 rounded-3xl bg-slate-900 border-2 border-amber-500/40 space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-base font-black text-white">El Semáforo de Seguridad Anti-Suspensión de Google</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/30 text-rose-300 space-y-1">
                  <strong className="text-rose-400 block text-xs">❌ LO QUE NUNCA DEBES HACER (PELIGRO DE BAN):</strong>
                  <p className="text-[11px] text-slate-300">• No pongas nombres inventados o palabras spam como "EL MEJOR RESTAURANTE".</p>
                  <p className="text-[11px] text-slate-300">• No uses números telefónicos virtuales desechables.</p>
                  <p className="text-[11px] text-slate-300">• No pongas direcciones de apartamentos residenciales si el cliente dice atender público.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 text-emerald-300 space-y-1">
                  <strong className="text-emerald-400 block text-xs">✅ LO QUE SÍ DEBES HACER (APROBACIÓN SEGURA):</strong>
                  <p className="text-[11px] text-slate-300">• Usar el título con el separador "|" que generó Local Studio.</p>
                  <p className="text-[11px] text-slate-300">• Subir fotos reales con el letrero coincidente.</p>
                  <p className="text-[11px] text-slate-300">• Grabar el video continuo sin cortes mostrando la llave física.</p>
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
                  Manual de Cierre en Llamadas y Reuniones
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Guion Comercial: Respuestas a Objeciones para Asesores
                </h1>
                <p className="text-xs text-slate-300 max-w-2xl">
                  Qué decirle al cliente cuando tiene dudas para asegurar el contrato de 12 meses de Prestigia.
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <strong className="text-amber-300 block text-sm">
                  1. Si el cliente dice: "¿Y por qué no creo yo mismo la ficha de Google gratis?"
                </strong>
                <p className="text-slate-300 text-xs leading-relaxed">
                  <em>Respuesta del Asesor:</em> "Claro que sí, don Carlos, Google permite crearla gratis. Pero el 92% de los negocios comete el error de poner solo una categoría y una descripción corta sin palabras clave. Por eso terminan en la página 4 de Google Maps donde nadie los ve. Nosotros aplicamos la arquitectura de categorías secretas y copywriting de los 3 líderes de su zona para que su ficha no solo exista, sino que le traiga clientes nuevos y reservas todos los días."
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <strong className="text-amber-300 block text-sm">
                  2. Si el cliente dice: "¿Por qué necesito el servicio de Prestigia durante 12 meses?"
                </strong>
                <p className="text-slate-300 text-xs leading-relaxed">
                  <em>Respuesta del Asesor:</em> "Porque Google Maps castiga la inactividad bajo la 'Ley de Recencia'. Si dejas de recibir reseñas recientes durante 30 días, el algoritmo te oculta y premia a tu competencia activa. Además, Prestigia es su seguro de blindaje: contiene en caliente cualquier cliente furioso para que nunca publique una queja de 1 estrella en su perfil."
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <strong className="text-amber-300 block text-sm">
                  3. Si el cliente dice: "¿En cuánto tiempo veo resultados de estar en el Top 3?"
                </strong>
                <p className="text-slate-300 text-xs leading-relaxed">
                  <em>Respuesta del Asesor:</em> "En los primeros 7 a 14 días la optimización técnica de categorías y descripción genera un salto visible de impresiones. Y con el código QR en mesa capturando las primeras 30 a 50 opiniones de 5 estrellas en el primer mes, el algoritmo lo posiciona en la zona caliente de su barrio en menos de 60 a 90 días."
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
                      👑 Panel Ejecutivo Master • Red Comercial & Monetización B2B
                    </span>
                    <span className="text-xs text-slate-500">• Licenciamiento & Equipos</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                    Red de Asesores Comerciales & Agencias Partners
                  </h1>
                  <p className="text-xs text-slate-300 max-w-3xl">
                    Crea accesos individuales para tus vendedores a comisión o vende licencias de software mensual a agencias aliadas para que prospecten y auditen negocios locales en cualquier país o ciudad.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={downloadNetworkCsvReport}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-500/20 shrink-0 active:scale-98"
                >
                  <Download className="w-4 h-4" />
                  <span>📥 Descargar Reporte CSV</span>
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
                  <span className="text-[11px] text-slate-400 block">Asesores Internos</span>
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
                  <span className="text-[11px] text-slate-400 block">Agencias Licenciadas</span>
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
                  <span className="text-[11px] text-slate-400 block">Cuentas de la Red</span>
                  <strong className="text-xl font-black text-amber-400">{networkFilteredDossiers.length}</strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Ingreso Licencias (MRR)</span>
                  <strong className="text-xl font-black text-emerald-400">
                    ${advisorsList
                      .filter((a) => a.accountType === 'partner_agency' && a.licenseStatus === 'active')
                      .reduce((sum, a) => sum + (a.monthlyFeeUsd || 0), 0)}{' '}
                    <span className="text-xs font-bold text-slate-400">USD/mes</span>
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
                <span>📊 Monitor de Cuentas Prospectadas ({networkFilteredDossiers.length})</span>
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
                <span>➕ Registrar Asesor o Licenciar Agencia</span>
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
                  👥 Directorio de Cuentas Activas (
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
                    <span>Filtros de Auditoría y Seguimiento de Red:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
                    {/* Filter Advisor */}
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">
                        Asesor / Agencia
                      </label>
                      <select
                        value={networkAdvisorFilter}
                        onChange={(e) => setNetworkAdvisorFilter(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="all">Todos los Miembros</option>
                        {advisorsList
                          .filter((a) => a.id !== 'adv-admin' && a.id !== 'adv-luisma')
                          .map((adv) => (
                            <option key={adv.id} value={adv.id}>
                              {adv.name} ({adv.accountType === 'partner_agency' ? 'Agencia' : 'Asesor'})
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Filter Account Type */}
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">
                        Tipo de Cuenta
                      </label>
                      <select
                        value={networkTypeFilter}
                        onChange={(e) => setNetworkTypeFilter(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="all">Todos los Tipos</option>
                        <option value="internal_advisor">💼 Asesores Internos</option>
                        <option value="partner_agency">🏢 Agencias Partners (B2B)</option>
                      </select>
                    </div>

                    {/* Filter Country */}
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">País</label>
                      <select
                        value={networkCountryFilter}
                        onChange={(e) => setNetworkCountryFilter(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="all">Todos los Países</option>
                        {availableCountries.map((c) => (
                          <option key={c} value={c}>
                            {c === 'Colombia' ? '🇨🇴 Colombia' : c === 'México' ? '🇲🇽 México' : c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filter City */}
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">Ciudad</label>
                      <select
                        value={networkCityFilter}
                        onChange={(e) => setNetworkCityFilter(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="all">Todas las Ciudades</option>
                        {availableCities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filter Mode */}
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">Modalidad</label>
                      <select
                        value={networkModeFilter}
                        onChange={(e) => setNetworkModeFilter(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="all">Todas las Modalidades</option>
                        <option value="create">🏗️ Fichas Nuevas</option>
                        <option value="audit">🔬 Auditorías Top 3</option>
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
                        placeholder="Buscar por cliente, categoría o palabras clave..."
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
                      Restablecer Filtros
                    </button>
                  </div>
                </div>

                {/* Dossiers Grid */}
                {networkFilteredDossiers.length === 0 ? (
                  <div className="text-center py-16 p-8 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
                    <Layers className="w-10 h-10 text-slate-600 mx-auto" />
                    <h3 className="text-base font-bold text-white">No hay expedientes con los filtros seleccionados</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Intenta modificando los filtros de asesor, país o ciudad.
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
                              {d.mode === 'create' ? '🏗️ Ficha Nueva' : '🔬 Auditoría Top 3'}
                            </span>

                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                d.advisorType === 'partner_agency'
                                  ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                                  : 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                              }`}
                            >
                              {d.advisorType === 'partner_agency' ? '🏢 Agencia Partner' : '💼 Asesor Interno'}
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
                                {d.data.healthScore < 50 ? 'Oportunidad de Venta Alta' : 'Perfil Optimizado'}
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
                              <span>👁️ Cargar y Ver</span>
                            </button>

                            {d.data?.whatsappOnboardingMessage && (
                              <a
                                href={`https://wa.me/?text=${encodeURIComponent(d.data.whatsappOnboardingMessage)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Enviar Kit por WhatsApp"
                                className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 transition cursor-pointer"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDeleteDossier(d.id)}
                              title="Eliminar Expediente"
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
                  <h3 className="text-lg font-black text-white">Registrar Nueva Cuenta en la Red</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Elige si vas a registrar un vendedor de tu equipo propio o una agencia aliada con cuota mensual.
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
                    <span>💼 Asesor Comercial Propio</span>
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
                    <span>🏢 Agencia Partner (Licencia)</span>
                  </button>
                </div>

                <form onSubmit={handleCreateAdvisor} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      {newAccountType === 'partner_agency'
                        ? 'Razón Social o Nombre de la Agencia *'
                        : 'Nombre Completo del Asesor *'}
                    </label>
                    <input
                      type="text"
                      value={newAdvisorName}
                      onChange={(e) => setNewAdvisorName(e.target.value)}
                      placeholder={
                        newAccountType === 'partner_agency'
                          ? 'Ej: Agencia Digital Rocket 360'
                          : 'Ej: Carlos Gómez'
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">País Sede *</label>
                      <input
                        type="text"
                        value={newAdvisorCountry}
                        onChange={(e) => setNewAdvisorCountry(e.target.value)}
                        placeholder="Colombia, México, España..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Ciudad Sede *</label>
                      <input
                        type="text"
                        value={newAdvisorCity}
                        onChange={(e) => setNewAdvisorCity(e.target.value)}
                        placeholder="Bogotá, Medellín, CDMX..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Usuario de Acceso *</label>
                      <input
                        type="text"
                        value={newAdvisorUser}
                        onChange={(e) => setNewAdvisorUser(e.target.value)}
                        placeholder="ej: carlos o rocketagency"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white lowercase focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Contraseña *</label>
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
                      WhatsApp de Contacto (Para firmar expedientes)
                    </label>
                    <input
                      type="text"
                      value={newAdvisorPhone}
                      onChange={(e) => setNewAdvisorPhone(e.target.value)}
                      placeholder="+573001234567 o +52..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Agency-only License monetization settings */}
                  {newAccountType === 'partner_agency' && (
                    <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-3">
                      <div className="flex items-center gap-2 text-purple-300 font-black">
                        <DollarSign className="w-4 h-4" />
                        <span>Configuración de Licencia Mensual B2B:</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Cuota Mensual Pactada (USD)</label>
                          <input
                            type="number"
                            value={newAdvisorMonthlyFee}
                            onChange={(e) => setNewAdvisorMonthlyFee(Number(e.target.value))}
                            placeholder="49"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-purple-500/50 text-purple-200 font-bold focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Estado de Licencia</label>
                          <select
                            value={newAdvisorLicenseStatus}
                            onChange={(e) => setNewAdvisorLicenseStatus(e.target.value as any)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-purple-500/50 text-white focus:outline-none"
                          >
                            <option value="active">✅ Activa y al día</option>
                            <option value="pending_payment">⏳ Pendiente de Pago</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Clave Maestra de Dueño (Luisma) *</label>
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
                      ? 'Registrando...'
                      : newAccountType === 'partner_agency'
                      ? '🚀 Activar Licencia de Agencia Partner'
                      : '+ Crear Asesor Comercial'}
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
                                {adv.accountType === 'partner_agency' ? '🏢 Agencia Partner' : '💼 Asesor Interno'}
                              </span>

                              {adv.accountType === 'partner_agency' && (
                                <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                  ${adv.monthlyFeeUsd || 49} USD/mes
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
                                Cuentas Prospectadas:
                              </span>
                              <div className="flex items-center justify-between text-xs font-black text-white">
                                <span>{advisorDossiers.length} Expedientes</span>
                                <span className="text-[10px] text-slate-400 font-normal">
                                  ({createsCount} nuevas, {auditsCount} auditorías)
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setNetworkAdvisorFilter(adv.id);
                              setNetworkSubView('monitor');
                              showToast(`Filtrando cuentas de ${adv.name}`);
                            }}
                            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white font-black text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-98"
                          >
                            <span>Ver Expedientes en Monitor</span>
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
            {currentUser && (
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white text-xs font-bold px-2 py-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                ✕ Cerrar
              </button>
            )}

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center mx-auto shadow-xl">
              <Lock className="w-6 h-6 text-slate-950" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">Ingreso a Prestigia Local Studio</h3>
              <p className="text-xs text-slate-400 mt-0.5">Selecciona tu perfil de acceso o ingresa con tus credenciales</p>
            </div>

            {/* Quick 1-Click Selectors */}
            <div className="space-y-2 pt-1 text-left">
              <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block px-1">
                Acceso Rápido Directo:
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
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">FOUNDER</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">Acceso total + Gestión de asesores + Control de expedientes</span>
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
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/40">ASESOR</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">Vista comercial de ventas + Generador Top 3</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition" />
              </button>
            </div>

            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">o ingresar otro asesor</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <form onSubmit={handleLogin} className="space-y-3 text-left text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Usuario</label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="ej: carlos o tu usuario"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Contraseña</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {loginError && <p className="text-xs text-rose-400 font-bold">{loginError}</p>}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer border border-slate-700 active:scale-98"
              >
                {isLoggingIn ? 'Verificando...' : 'Iniciar Sesión con Contraseña'}
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
