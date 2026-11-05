'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { PrestigiaIcon } from '@/components/PrestigiaIcon';
import {
  Sparkles,
  Layers,
  Globe,
  Smartphone,
  Monitor,
  Save,
  ExternalLink,
  Copy,
  Lock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Star,
  MessageSquare,
  MapPin,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Eye,
  Sliders,
  Palette,
  Trash2,
  Building2,
  Check,
  Flame,
} from 'lucide-react';
import type { StudioLandingPage, StudioAdvisor } from '@/lib/db';

const CATEGORY_PRESETS_ES = [
  'Clínica Dental / Odontología',
  'Restaurante / Gastronomía',
  'Abogado / Servicios Legales',
  'Estética / Spa / Belleza',
  'Médico Especialista / Salud',
  'Cerrajería / Urgencias 24h',
  'Taller Automotriz / Mecánica',
  'Entrenador Personal / Fitness',
  'Veterinaria / Cuidado Mascotas',
  'Servicios Profesionales B2B',
];

const CATEGORY_PRESETS_EN = [
  'Dental Clinic / Cosmetic Dentistry',
  'Restaurant / Gastronomy',
  'Attorney / Legal Services',
  'Aesthetic Spa / MedSpa',
  'Medical Specialist / Healthcare',
  'Locksmith / 24h Emergency',
  'Auto Repair / Mechanics',
  'Personal Trainer / Fitness',
  'Veterinary / Pet Care',
  'B2B Professional Services',
];

const COLOR_PRESETS = [
  { name: 'Oro Élite', primary: '#D97706', accent: '#059669', bg: '#030712' },
  { name: 'Médico Teal', primary: '#0D9488', accent: '#2563EB', bg: '#041724' },
  { name: 'Gastronomía Cálida', primary: '#EA580C', accent: '#CA8A04', bg: '#140804' },
  { name: 'Alto Impacto Naranja', primary: '#F97316', accent: '#10B981', bg: '#0B0F17' },
  { name: 'Lujo Púrpura', primary: '#9333EA', accent: '#EC4899', bg: '#0F061A' },
  { name: 'Azul Corporativo', primary: '#2563EB', accent: '#0D9488', bg: '#060D1E' },
];

export default function LandingStudioPage() {
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const isEn = lang === 'en';

  // Current Advisor session
  const [currentUser, setCurrentUser] = useState<StudioAdvisor | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Active view: editor vs client portfolio
  const [activeTab, setActiveTab] = useState<'editor' | 'portfolio'>('editor');
  const [editorSubTab, setEditorSubTab] = useState<'content' | 'palette' | 'features' | 'billing'>('content');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');

  // Form State
  const [businessName, setBusinessName] = useState('Clínica Dental Sonrisas');
  const [category, setCategory] = useState(CATEGORY_PRESETS_ES[0]);
  const [city, setCity] = useState('Medellín');
  const [phone, setPhone] = useState('+57 305 831 4049');
  const [customSlug, setCustomSlug] = useState('clinica-dental-sonrisas');
  const [headline, setHeadline] = useState('Especialistas en Implantes & Diseño de Sonrisa en Medellín');
  const [subheadline, setSubheadline] = useState('Tecnología digital avanzada, atención sin dolor y financiación directa. Agenda tu consulta hoy por WhatsApp.');
  const [callToAction, setCallToAction] = useState('Agendar Consulta por WhatsApp');
  const [whatsappMessage, setWhatsappMessage] = useState('Hola, vi su página oficial y deseo agendar una valoración.');
  const [offerBadge, setOfferBadge] = useState('⚡ Oferta de Esta Semana: Valoración y Escaneo 3D Sin Costo');
  const [pageStatus, setPageStatus] = useState<'active' | 'suspended'>('active');

  // Brand Theme State (Luisma's Custom Palette Request)
  const [primaryColor, setPrimaryColor] = useState('#D97706');
  const [accentColor, setAccentColor] = useState('#059669');
  const [bgColor, setBgColor] = useState('#030712');
  const [template, setTemplate] = useState<'executive_dark' | 'medical_clean' | 'gourmet_warm' | 'high_impact_orange'>('executive_dark');

  // Feature Toggles
  const [showLiveOpen, setShowLiveOpen] = useState(true);
  const [showUrgencyBanner, setShowUrgencyBanner] = useState(true);
  const [showFomoPopups, setShowFomoPopups] = useState(true);
  const [showReviewCarousel, setShowReviewCarousel] = useState(true);
  const [showWazeButton, setShowWazeButton] = useState(true);
  const [showPrestigiaBadge, setShowPrestigiaBadge] = useState(true);

  // Services catalog
  const [services, setServices] = useState([
    { name: 'Diseño de Sonrisa Digital', description: 'Carillas cerámicas y resina de alta estética con acabado natural.', price: 'Desde $120 USD', tag: 'Más Popular' },
    { name: 'Implantes Dentales Guiados', description: 'Reemplazo fijo definitivo con cirugía guiada por computador sin dolor.', price: 'Consultar', tag: 'Avanzado' },
    { name: 'Blanqueamiento Láser Express', description: 'Aclara hasta 4 tonos en una sola sesión de 45 minutos.', price: '$85 USD', tag: 'Oferta Hoy' },
  ]);

  // Saved landing pages
  const [savedPages, setSavedPages] = useState<StudioLandingPage[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toast notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auto-generate slug when businessName changes
  useEffect(() => {
    const slugGen = businessName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    if (slugGen) setCustomSlug(slugGen);
  }, [businessName]);

  // Advisor session init
  useEffect(() => {
    try {
      const stored = localStorage.getItem('prestigia_studio_advisor');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      } else {
        setCurrentUser({
          id: 'adv-luisma',
          name: 'Luisma • Director General',
          username: 'luisma',
          phone: '+573058314049',
          role: 'admin',
          accountType: 'founder',
          country: 'Colombia',
          city: 'Bogotá',
          licenseStatus: 'active',
          active: true,
          createdAt: new Date().toISOString(),
        } as any);
      }
    } catch {}
  }, []);

  // Fetch saved pages
  const fetchPages = async () => {
    setIsLoadingPages(true);
    try {
      const res = await fetch('/api/landing-studio');
      const data = await res.json();
      if (data.success && Array.isArray(data.pages)) {
        setSavedPages(data.pages);
      }
    } catch (err) {
      console.warn('Error fetching pages:', err);
    } finally {
      setIsLoadingPages(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  // AI Copy Generator (Instant 3-second Magic)
  const handleGenerateAiCopy = () => {
    const cat = category.toLowerCase();
    if (cat.includes('dent') || cat.includes('odont')) {
      setHeadline(isEn ? 'Elite Cosmetic Dentistry & Pain-Free Dental Implants' : 'Odontología Estética de Élite & Implantes Dentales Sin Dolor');
      setSubheadline(isEn ? `Digital 3D technology, immediate booking, and flexible financing in ${city}.` : `Tecnología 3D digital, citas inmediatas y financiación directa en ${city}.`);
      setCallToAction(isEn ? 'Book Free 3D Scan on WhatsApp' : 'Agendar Escaneo 3D por WhatsApp');
      setOfferBadge(isEn ? '⚡ This Week: Free 3D Diagnostic Scan with WhatsApp Booking' : '⚡ Esta Semana: Escaneo y Valoración 3D Sin Costo por WhatsApp');
    } else if (cat.includes('restauran') || cat.includes('gastronom')) {
      setHeadline(isEn ? `Signature Dining Experience & Authentic Cuisine in ${city}` : `Experiencia Gastronómica de Autor & Sabores Auténticos en ${city}`);
      setSubheadline(isEn ? 'Locally sourced ingredients, exclusive cocktails, and memorable ambiance.' : 'Ingredientes frescos de origen, coctelería de autor y ambiente inigualable.');
      setCallToAction(isEn ? 'Reserve Table on WhatsApp' : 'Reservar Mesa por WhatsApp');
      setOfferBadge(isEn ? '⚡ Complimentary House Cocktail on Dinner Reservations' : '⚡ Cóctel de Cortesía en Reservas de Cena por WhatsApp');
    } else if (cat.includes('abog') || cat.includes('legal')) {
      setHeadline(isEn ? `Top Legal Defense & Strategic Corporate Counsel in ${city}` : `Defensa Legal de Élite & Asesoría Corporativa Estratégica en ${city}`);
      setSubheadline(isEn ? 'Over 15 years protecting families, businesses, and high-value assets.' : 'Más de 15 años protegiendo a familias, empresas y patrimonios.');
      setCallToAction(isEn ? 'Schedule Confidential WhatsApp Consultation' : 'Agendar Consulta Confidencial por WhatsApp');
      setOfferBadge(isEn ? '⚡ Free Initial Case Assessment via WhatsApp' : '⚡ Evaluación Inicial de Caso Sin Costo por WhatsApp');
    } else {
      setHeadline(isEn ? `Top Rated ${category} Experts in ${city}` : `Expertos Líderes en ${category} en ${city}`);
      setSubheadline(isEn ? 'Certified quality, immediate response, and personalized customer care.' : 'Calidad certificada, respuesta inmediata y atención personalizada.');
      setCallToAction(isEn ? 'Request Quote on WhatsApp' : 'Cotizar Inmediatamente por WhatsApp');
      setOfferBadge(isEn ? '⚡ Priority Response Guaranteed on WhatsApp' : '⚡ Atención Prioritaria Inmediata por WhatsApp');
    }
    showToast(isEn ? '✨ AI Copy generated with high-converting hooks!' : '✨ ¡Textos hipnóticos generados con IA!');
  };

  // Save / Publish Page
  const handleSavePage = async () => {
    if (!businessName.trim()) {
      showToast(isEn ? '⚠️ Business name is required' : '⚠️ El nombre del negocio es obligatorio');
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<StudioLandingPage> = {
        slug: customSlug,
        advisorId: currentUser?.id || 'adv-luisma',
        advisorName: currentUser?.name || 'Luisma • Director General',
        advisorPhone: currentUser?.phone || '+573058314049',
        businessName: businessName.trim(),
        category,
        city: city.trim(),
        phone: phone.trim(),
        whatsappMessage,
        status: pageStatus,
        theme: {
          primaryColor,
          accentColor,
          bgColor,
          template,
        },
        headline,
        subheadline,
        callToAction,
        offerBadge,
        services,
        features: {
          showLiveOpen,
          showUrgencyBanner,
          showFomoPopups,
          showReviewCarousel,
          showWazeButton,
          showPrestigiaBadge,
        },
      };

      const res = await fetch('/api/landing-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (resData.success) {
        showToast(isEn ? '🚀 Landing Page published & saved to portfolio!' : '🚀 ¡Página web publicada y guardada en Cartera!');
        fetchPages();
      } else {
        showToast('⚠️ Error: ' + (resData.error || 'Reintente'));
      }
    } catch (err) {
      showToast('⚠️ Error de conexión al guardar página');
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(`¡${label} copiado! 📋`);
    }
  };

  const publicUrl = typeof window !== 'undefined' ? `${window.location.origin}/p/${customSlug}` : `/p/${customSlug}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <aside aria-label="Notificaciones del sistema" className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-amber-500/50 text-white text-xs font-bold shadow-2xl flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </div>
        </aside>
      )}

      {/* TOP HEADER */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md px-4 sm:px-8 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer select-none"
            >
              <PrestigiaIcon className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-white text-base sm:text-lg font-black tracking-widest">PRESTIGIA</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[9px] font-bold tracking-wider uppercase">
                    5★ SUITE
                  </span>
                  <span className="text-indigo-400 text-xs font-black tracking-wider">LANDING STUDIO™</span>
                </div>
                <span className="text-[10px] text-slate-400 font-normal">
                  {isEn ? 'High-Converting Mobile Page Builder & Anti-Churn Engine' : 'Motor de Páginas Web de Alta Conversión & Candado Anti-Churn'}
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Language Switcher */}
            <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-0.5 text-[11px] font-black">
              <button
                type="button"
                onClick={() => setLang('es')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  lang === 'es' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                🇨🇴 ES
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  lang === 'en' ? 'bg-indigo-600 text-white font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                🇺🇸 EN
              </button>
            </div>

            {/* Publish CTA */}
            <button
              type="button"
              onClick={handleSavePage}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-98 cursor-pointer"
            >
              {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isEn ? 'Publish Page' : 'Publicar Página'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* SUB-NAV WORKSPACE TABS */}
      <nav className="border-b border-slate-800 bg-slate-900/60 px-4 sm:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-indigo-600 text-white shadow-md font-black'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isEn ? 'Landing Studio Workspace' : 'Estudio de Creación'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('portfolio')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'portfolio'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isEn ? `Client Portfolio (${savedPages.length})` : `Cartera de Clientes (${savedPages.length})`}</span>
            </button>
          </div>

          {activeTab === 'editor' && (
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="text-slate-400 text-[11px] font-mono">
                {isEn ? 'Live URL:' : 'Enlace:'} <strong className="text-emerald-400">/p/{customSlug}</strong>
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(publicUrl, 'Enlace Público')}
                title="Copiar enlace público"
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <a
                href={`/p/${customSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir página pública"
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* MAIN BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* ============================================================
            VIEW 1: EDITOR WORKSPACE (SPLIT SCREEN: INPUTS VS LIVE PREVIEW)
            ============================================================ */}
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: BUILDER CONTROLS & PALETTE (7 COLS) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Sub-Tabs: Content vs Palette vs Features vs Billing Lock */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setEditorSubTab('content')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    editorSubTab === 'content'
                      ? 'bg-indigo-600 text-white shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{isEn ? '1. Content & AI' : '1. Datos & IA'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditorSubTab('palette')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    editorSubTab === 'palette'
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>{isEn ? '2. Colors & Brand' : '2. Colores & Marca'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditorSubTab('features')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    editorSubTab === 'features'
                      ? 'bg-purple-600 text-white shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isEn ? '3. Live Effects' : '3. Efectos Pro'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditorSubTab('billing')}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    editorSubTab === 'billing'
                      ? pageStatus === 'active'
                        ? 'bg-emerald-600 text-white shadow-md font-black'
                        : 'bg-rose-600 text-white shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isEn ? '4. Status Lock' : '4. Candado Pago'}</span>
                </button>
              </div>

              {/* TAB 1: CONTENT & AI */}
              {editorSubTab === 'content' && (
                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="font-black text-white text-sm">
                        {isEn ? 'Business Information & Selling Copy' : 'Datos del Negocio & Textos de Venta'}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {isEn ? 'Complete details or click Generate with AI to auto-populate' : 'Completa la ficha o pulsa Generar con IA'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerateAiCopy}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-[11px] transition flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-98 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                      <span>{isEn ? 'Magic AI Copy' : 'Generar Textos IA'}</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">
                        {isEn ? 'Business Name' : 'Nombre del Negocio'}
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">
                          {isEn ? 'Sector / Category' : 'Sector / Categoría'}
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                        >
                          {(isEn ? CATEGORY_PRESETS_EN : CATEGORY_PRESETS_ES).map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">
                          {isEn ? 'City / Area' : 'Ciudad / Ubicación'}
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">
                          {isEn ? 'WhatsApp Phone' : 'Teléfono de WhatsApp'}
                        </label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+573058314049"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">
                          {isEn ? 'Public Web Slug (/p/slug)' : 'URL Pública (/p/slug)'}
                        </label>
                        <input
                          type="text"
                          value={customSlug}
                          onChange={(e) => setCustomSlug(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">
                        {isEn ? 'Hero Headline (High Conversion Hook)' : 'Titular Principal (Gancho Hipnótico)'}
                      </label>
                      <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">
                        {isEn ? 'Subheadline & Value Proposition' : 'Subtítulo & Propuesta de Valor'}
                      </label>
                      <textarea
                        rows={2}
                        value={subheadline}
                        onChange={(e) => setSubheadline(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">
                        {isEn ? 'Primary Call To Action (Button Text)' : 'Botón de Llamado a la Acción (CTA)'}
                      </label>
                      <input
                        type="text"
                        value={callToAction}
                        onChange={(e) => setCallToAction(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-black focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PALETTE & BRAND COLORS (LUISMA'S STAR FEATURE) */}
              {editorSubTab === 'palette' && (
                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 text-xs">
                  <div>
                    <h3 className="font-black text-white text-sm">
                      {isEn ? 'Custom Brand Palette & Color Identity' : 'Paleta de Colores de la Marca & Personalización'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isEn ? 'Adapt buttons, gradients, stars, and cards to match your client’s corporate branding' : 'Adapta botones, estrellas y degradados a la identidad visual del cliente'}
                    </p>
                  </div>

                  {/* 1-Click Color Presets */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      {isEn ? '1-Click Sector Color Presets' : 'Paletas Preconfiguradas de 1 Clic'}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {COLOR_PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setPrimaryColor(p.primary);
                            setAccentColor(p.accent);
                            setBgColor(p.bg);
                            showToast(`Paleta aplicada: ${p.name}`);
                          }}
                          className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                            primaryColor === p.primary
                              ? 'bg-slate-800 border-amber-400 text-white shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center -space-x-1 shrink-0">
                            <span className="w-4 h-4 rounded-full border border-slate-800 shadow" style={{ backgroundColor: p.primary }} />
                            <span className="w-4 h-4 rounded-full border border-slate-800 shadow" style={{ backgroundColor: p.accent }} />
                          </div>
                          <span className="text-[11px] font-bold truncate">{p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Hex Pickers */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                      {isEn ? 'Manual HEX Color Inputs (Exact Client Brand)' : 'Colores Exactos en Código HEX (Marca del Cliente)'}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 font-bold mb-1">
                          {isEn ? 'Primary Brand Color (Buttons & Badges)' : 'Color Primario (Botones & Títulos)'}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-9 h-9 rounded-xl border border-slate-700 bg-transparent cursor-pointer shrink-0"
                          />
                          <input
                            type="text"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold mb-1">
                          {isEn ? 'Accent Action Color (WhatsApp & Glow)' : 'Color de Acento (WhatsApp & Destacados)'}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="w-9 h-9 rounded-xl border border-slate-700 bg-transparent cursor-pointer shrink-0"
                          />
                          <input
                            type="text"
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: LIVE CONVERSION EFFECTS (TOGGLES) */}
              {editorSubTab === 'features' && (
                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                  <div>
                    <h3 className="font-black text-white text-sm">
                      {isEn ? 'High-Conversion Visual Effects & Triggers' : 'Efectos Visuales de Alta Conversión & Triggers'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isEn ? 'Activate urgency, social proof, and mobile conversion modules' : 'Activa módulos de urgencia, prueba social y conversión'}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {/* Toggle: Live Open */}
                    <div
                      onClick={() => setShowLiveOpen(!showLiveOpen)}
                      className={`p-3 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                        showLiveOpen ? 'bg-slate-950 border-emerald-500/40' : 'bg-slate-950/40 border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <strong className="text-white block">
                          🟢 {isEn ? 'Live "Open Now • Immediate Response" Indicator' : 'Indicador "Abierto Ahora • Respuesta Inmediata"'}
                        </strong>
                        <p className="text-slate-400 text-[11px]">
                          {isEn ? 'Shows a pulsing green dot assuring visitors they will be answered immediately' : 'Muestra pulso verde asegurando atención instantánea por WhatsApp'}
                        </p>
                      </div>
                      <span className={`text-xs font-black px-2.5 py-1 rounded-xl ${showLiveOpen ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-500'}`}>
                        {showLiveOpen ? 'ON' : 'OFF'}
                      </span>
                    </div>

                    {/* Toggle: Urgency Banner */}
                    <div
                      onClick={() => setShowUrgencyBanner(!showUrgencyBanner)}
                      className={`p-3 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                        showUrgencyBanner ? 'bg-slate-950 border-amber-500/40' : 'bg-slate-950/40 border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <strong className="text-white block">
                          ⚡ {isEn ? 'Top Urgency Countdown Banner (FOMO Timer)' : 'Barra Superior de Urgencia con Temporizador'}
                        </strong>
                        <p className="text-slate-400 text-[11px]">
                          {isEn ? 'Prompts visitors to message now before weekly spots run out' : 'Empuja a reservar hoy antes de que se agoten los cupos'}
                        </p>
                      </div>
                      <span className={`text-xs font-black px-2.5 py-1 rounded-xl ${showUrgencyBanner ? 'bg-amber-950 text-amber-300' : 'bg-slate-800 text-slate-500'}`}>
                        {showUrgencyBanner ? 'ON' : 'OFF'}
                      </span>
                    </div>

                    {/* Toggle: FOMO Live Popups */}
                    <div
                      onClick={() => setShowFomoPopups(!showFomoPopups)}
                      className={`p-3 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                        showFomoPopups ? 'bg-slate-950 border-indigo-500/40' : 'bg-slate-950/40 border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <strong className="text-white block">
                          🔥 {isEn ? 'Live Booking Popups (Social Proof)' : 'Notificaciones Emergentes de Citas y Reservas'}
                        </strong>
                        <p className="text-slate-400 text-[11px]">
                          {isEn ? 'Displays real-time notifications: "Carlos just requested a quote 3m ago"' : 'Muestra avisos: "Carlos acaba de agendar cita hace 3 minutos"'}
                        </p>
                      </div>
                      <span className={`text-xs font-black px-2.5 py-1 rounded-xl ${showFomoPopups ? 'bg-indigo-950 text-indigo-300' : 'bg-slate-800 text-slate-500'}`}>
                        {showFomoPopups ? 'ON' : 'OFF'}
                      </span>
                    </div>

                    {/* Toggle: Review Carousel */}
                    <div
                      onClick={() => setShowReviewCarousel(!showReviewCarousel)}
                      className={`p-3 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                        showReviewCarousel ? 'bg-slate-950 border-amber-500/40' : 'bg-slate-950/40 border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <strong className="text-white block">
                          ⭐️ {isEn ? 'Google 5★ Reviews Carousel (Tactile)' : 'Carrusel Táctil de Reseñas de 5★ de Google'}
                        </strong>
                        <p className="text-slate-400 text-[11px]">
                          {isEn ? 'Displays audited 5-star Google Maps reviews with gold stars' : 'Muestra testimonios reales de Google Maps con estrellas doradas'}
                        </p>
                      </div>
                      <span className={`text-xs font-black px-2.5 py-1 rounded-xl ${showReviewCarousel ? 'bg-amber-950 text-amber-300' : 'bg-slate-800 text-slate-500'}`}>
                        {showReviewCarousel ? 'ON' : 'OFF'}
                      </span>
                    </div>

                    {/* Toggle: Prestigia Badge */}
                    <div
                      onClick={() => setShowPrestigiaBadge(!showPrestigiaBadge)}
                      className={`p-3 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                        showPrestigiaBadge ? 'bg-slate-950 border-emerald-500/40' : 'bg-slate-950/40 border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <strong className="text-white block">
                          🛡️ {isEn ? 'Prestigia Verified Authority Seal' : 'Sello de Autoridad "Verificado por Prestigia"'}
                        </strong>
                        <p className="text-slate-400 text-[11px]">
                          {isEn ? 'Footprint proving certified local Google Maps architecture' : 'Sello de respaldo en el pie de página que certifica la web'}
                        </p>
                      </div>
                      <span className={`text-xs font-black px-2.5 py-1 rounded-xl ${showPrestigiaBadge ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-500'}`}>
                        {showPrestigiaBadge ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: BILLING LOCK / ANTI-CHURN SWITCH */}
              {editorSubTab === 'billing' && (
                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                  <div>
                    <h3 className="font-black text-white text-sm">
                      {isEn ? 'Anti-Churn Retainer Lock (Billing Switch)' : 'Candado de Suscripción Anti-Churn (Switch de Cobro)'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isEn ? 'Control whether the client landing page is live or suspended due to billing' : 'Controla si la web del cliente está en línea o suspendida por pago'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">
                        {isEn ? 'Client Hosting & Landing Status:' : 'Estado del Servicio del Cliente:'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPageStatus('active');
                            showToast(isEn ? '🟢 Page set to ACTIVE' : '🟢 Página establecida como ACTIVA');
                          }}
                          className={`px-3 py-1.5 rounded-xl font-black text-xs transition cursor-pointer ${
                            pageStatus === 'active'
                              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                              : 'bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          🟢 {isEn ? 'Active (Live)' : 'Activa (En Línea)'}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setPageStatus('suspended');
                            showToast(isEn ? '🔴 Page set to SUSPENDED' : '🔴 Página SUSPENDIDA por Pago');
                          }}
                          className={`px-3 py-1.5 rounded-xl font-black text-xs transition cursor-pointer ${
                            pageStatus === 'suspended'
                              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                              : 'bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          🔴 {isEn ? 'Suspended (Lapsed)' : 'Suspendida (Mora)'}
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {isEn
                        ? 'If the client cancels or delays their monthly Prestigia retainer, switch to Suspended. Their live landing page will pause and display a maintenance screen prompting them to contact support for immediate reactivation.'
                        : 'Si el cliente se atrasa o suspende su mensualidad de Prestigia, activa "Suspendida". Su página mostrará un aviso de mantenimiento comercial que detiene sus reservas de WhatsApp hasta que se ponga al día.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: REAL-TIME INTERACTIVE LIVE PREVIEW (6 COLS) */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-black text-slate-300 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>{isEn ? 'Live Interactive Simulator' : 'Previsualizador en Vivo Interactivo'}</span>
                </span>

                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                      previewDevice === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>{isEn ? 'Mobile' : 'Móvil'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                      previewDevice === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3 h-3" />
                    <span>Web</span>
                  </button>
                </div>
              </div>

              {/* SIMULATOR FRAME */}
              <div
                className={`mx-auto rounded-3xl border-4 transition-all duration-300 shadow-2xl overflow-hidden bg-slate-950 ${
                  previewDevice === 'mobile'
                    ? 'max-w-sm border-slate-800 shadow-indigo-950/40 min-h-[640px]'
                    : 'w-full border-slate-800 min-h-[600px]'
                }`}
                style={{ backgroundColor: bgColor }}
              >
                {/* Mobile Camera Notch */}
                {previewDevice === 'mobile' && (
                  <div className="h-5 bg-slate-950 flex items-center justify-center">
                    <div className="w-20 h-3 rounded-full bg-slate-800" />
                  </div>
                )}

                {/* If Suspended in Preview */}
                {pageStatus === 'suspended' ? (
                  <div className="p-8 text-center space-y-4 my-auto flex flex-col items-center justify-center min-h-[500px]">
                    <div className="w-14 h-14 rounded-2xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-xl">
                      <Lock className="w-7 h-7" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-500/30">
                      {isEn ? 'Connection Paused' : 'Conexión Pausada'}
                    </span>
                    <h4 className="text-base font-black text-white">Sitio en Mantenimiento</h4>
                    <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                      El portal de reservas de <strong className="text-white">{businessName}</strong> está temporalmente pausado por actualización de cuenta.
                    </p>
                    <div className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs">
                      Contactar a Soporte Prestigia
                    </div>
                  </div>
                ) : (
                  /* Active Live Preview */
                  <div className="text-left text-xs pb-12 select-none relative">
                    {/* Urgency bar */}
                    {showUrgencyBanner && (
                      <div className="py-2 px-3 text-center text-[10px] font-bold text-white flex items-center justify-center gap-1.5 backdrop-blur-md bg-slate-950/90 border-b border-white/10">
                        <Flame className="w-3 h-3 text-amber-400" />
                        <span className="truncate">{offerBadge}</span>
                      </div>
                    )}

                    {/* Brand header */}
                    <div className="p-3.5 border-b border-white/10 flex items-center justify-between backdrop-blur-md bg-slate-950/60">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-950 font-black text-sm shadow ring-1 ring-white/20"
                          style={{
                            background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
                          }}
                        >
                          {businessName.charAt(0)}
                        </div>
                        <div>
                          <strong className="text-white text-xs block leading-tight truncate max-w-[140px]">
                            {businessName}
                          </strong>
                          <span className="text-[9px] text-slate-400">{city}</span>
                        </div>
                      </div>

                      {showLiveOpen && (
                        <span className="text-[9px] font-bold text-emerald-300 flex items-center gap-1 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Abierto</span>
                        </span>
                      )}
                    </div>

                    {/* Hero */}
                    <div className="p-5 text-center space-y-3">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>4.9 / 5.0 en Google Maps</span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                        {headline}
                      </h3>

                      <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                        {subheadline}
                      </p>

                      <div className="pt-1">
                        <div
                          className="w-full py-3 rounded-xl font-black text-xs text-slate-950 flex items-center justify-center gap-2 shadow-xl ring-2 ring-white/10"
                          style={{
                            background: `linear-gradient(135deg, ${accentColor}, #25D366)`,
                          }}
                        >
                          <MessageSquare className="w-4 h-4 fill-slate-950" />
                          <span>{callToAction}</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Before/After Mini Preview */}
                    <div className="mx-4 p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-white">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Sparkles className="w-3 h-3" />
                          <span>Resultados Reales</span>
                        </span>
                        <span className="text-slate-400">{isEn ? 'Before / After' : 'Antes / Después'}</span>
                      </div>
                      <div className="h-24 rounded-xl overflow-hidden relative border border-white/10">
                        <img
                          src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80"
                          alt="Demo Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-2">
                          <span className="text-[9px] font-bold text-emerald-300 bg-slate-950/80 px-2 py-0.5 rounded">
                            {isEn ? '✨ Verified Clinical Case' : '✨ Caso Clínico Verificado'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Services */}
                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block">
                        Servicios Destacados
                      </span>
                      <div className="space-y-2">
                        {services.map((s, i) => (
                          <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-white/10 space-y-1 hover:border-emerald-500/40 transition">
                            <div className="flex items-center justify-between">
                              <strong className="text-white text-xs">{s.name}</strong>
                              <span className="text-[10px] font-bold text-emerald-400">{s.price}</span>
                            </div>
                            <p className="text-[10px] text-slate-300 leading-snug">{s.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Review Snippet */}
                    {showReviewCarousel && (
                      <div className="mx-4 p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-white flex items-center gap-1">
                            <span className="text-amber-400">★★★★★</span>
                            <span>Carolina R.</span>
                          </span>
                          <span className="text-emerald-400 font-bold">Google Verificado</span>
                        </div>
                        <p className="text-[10px] text-slate-300 italic">
                          &ldquo;Atención de primer nivel, tecnología 3D y agendamiento inmediato por WhatsApp.&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Footer Authority Badge */}
                    {showPrestigiaBadge && (
                      <div className="text-center pt-4 text-[9px] text-slate-400 flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>Verificado y Alojado por Prestigia Engine © 2026</span>
                      </div>
                    )}

                    {/* Floating WhatsApp Preview Button */}
                    <div className="absolute bottom-3 right-3">
                      <div className="w-11 h-11 rounded-2xl bg-[#25D366] text-slate-950 flex items-center justify-center shadow-2xl ring-2 ring-white/20">
                        <MessageSquare className="w-5 h-5 fill-slate-950" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            VIEW 2: CLIENT PORTFOLIO (SAVED LANDING PAGES)
            ============================================================ */}
        {activeTab === 'portfolio' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800">
              <div>
                <h2 className="text-lg font-black text-white">
                  {isEn ? 'Published Client Landing Pages' : 'Páginas Web de Clientes Publicadas'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isEn ? 'All active and suspended landing pages managed by your agency' : 'Todas las páginas activas y suspendidas administradas por ti'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setBusinessName('Nuevo Negocio');
                  setActiveTab('editor');
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>{isEn ? 'Create New Landing' : 'Crear Nueva Landing'}</span>
              </button>
            </div>

            {savedPages.length === 0 && !isLoadingPages && (
              <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
                <Globe className="w-8 h-8 text-slate-500 mx-auto" />
                <h3 className="font-bold text-white text-sm">
                  {isEn ? 'No landing pages published yet' : 'Aún no tienes páginas web creadas'}
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {isEn ? 'Use the Landing Studio Workspace to launch your first high-converting client page.' : 'Usa el Estudio de Creación para publicar tu primera página de cliente.'}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {savedPages.map((page) => (
                <div
                  key={page.id}
                  className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-amber-400">
                        {page.category}
                      </span>
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                          page.status === 'active'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {page.status === 'active' ? (isEn ? '🟢 Live / Online' : '🟢 En Línea') : (isEn ? '🔴 Suspended' : '🔴 Suspendida')}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-white text-sm">{page.businessName}</h4>
                    <p className="text-slate-400 text-[11px] truncate">{page.city} • /p/{page.slug}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setBusinessName(page.businessName);
                        setCategory(page.category);
                        setCity(page.city);
                        setPhone(page.phone);
                        setCustomSlug(page.slug);
                        setHeadline(page.headline);
                        setSubheadline(page.subheadline);
                        setCallToAction(page.callToAction);
                        setPageStatus(page.status);
                        if (page.theme?.primaryColor) setPrimaryColor(page.theme.primaryColor);
                        if (page.theme?.accentColor) setAccentColor(page.theme.accentColor);
                        setActiveTab('editor');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1"
                    >
                      <span>Editar</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(`${window.location.origin}/p/${page.slug}`, 'Enlace')}
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                        title="Copiar URL"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={`/p/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 transition cursor-pointer"
                        title={isEn ? 'Open Page' : 'Abrir página'}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
