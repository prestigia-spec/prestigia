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
} from 'lucide-react';

interface StudioAdvisorUser {
  id: string;
  name: string;
  username: string;
  phone: string;
  role: 'admin' | 'advisor';
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

const CATEGORY_OPTIONS = [
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
  const [activeTab, setActiveTab] = useState<'create' | 'audit' | 'dossiers' | 'guide' | 'pitch' | 'advisors'>('create');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Check persisted session
  useEffect(() => {
    try {
      const stored = localStorage.getItem('prestigia_studio_advisor');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) {
          setCurrentUser(parsed);
          return;
        }
      }
    } catch {}
    // Default advisor for frictionless start
    const defaultUser: StudioAdvisorUser = {
      id: 'adv-luisma',
      name: 'Luisma • Consultor Senior',
      username: 'luisma',
      phone: '+573058314049',
      role: 'advisor',
      active: true,
    };
    setCurrentUser(defaultUser);
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

  // Generator Result State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<BlueprintData | null>(null);
  const [activeEngine, setActiveEngine] = useState<string>('');

  // Saved Dossiers State
  const [savedDossiers, setSavedDossiers] = useState<StudioDossierRecord[]>([]);
  const [isLoadingDossiers, setIsLoadingDossiers] = useState(false);
  const [dossierSearch, setDossierSearch] = useState('');

  // Advisors List (for Admin tab)
  const [advisorsList, setAdvisorsList] = useState<StudioAdvisorUser[]>([]);
  const [newAdvisorName, setNewAdvisorName] = useState('');
  const [newAdvisorUser, setNewAdvisorUser] = useState('');
  const [newAdvisorPass, setNewAdvisorPass] = useState('');
  const [newAdvisorPhone, setNewAdvisorPhone] = useState('+57');
  const [adminMasterKey, setAdminMasterKey] = useState('admin');
  const [isSavingAdvisor, setIsSavingAdvisor] = useState(false);

  // Fetch dossiers when entering dossiers tab
  const fetchDossiers = async () => {
    setIsLoadingDossiers(true);
    try {
      const isAdmin = currentUser?.role === 'admin';
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
        showToast('✨ ¡Arquitectura Top 3 generada exitosamente!');
      } else {
        showToast('⚠️ Error generando el expediente: ' + (resData.error || 'Reintente'));
      }
    } catch (err) {
      showToast('⚠️ Error de conexión con el motor de IA.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Save current generated blueprint as a Dossier
  const handleSaveDossier = async () => {
    if (!generatedData || !businessName.trim()) {
      showToast('⚠️ Primero genera un expediente para guardar');
      return;
    }

    try {
      const payload = {
        advisorId: currentUser?.id || 'adv-luisma',
        advisorName: currentUser?.name || 'Luisma • Consultor',
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

  // Filtered dossiers
  const filteredDossiers = useMemo(() => {
    if (!dossierSearch.trim()) return savedDossiers;
    const q = dossierSearch.toLowerCase();
    return savedDossiers.filter(
      (d) =>
        d.clientName.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.advisorName.toLowerCase().includes(q)
    );
  }, [savedDossiers, dossierSearch]);

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

  // Save new advisor
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
          active: true,
          masterKey: adminMasterKey,
        }),
      });

      const resData = await res.json();
      if (resData.success) {
        showToast(`¡Asesor ${newAdvisorName} creado con éxito!`);
        setNewAdvisorName('');
        setNewAdvisorUser('');
        setNewAdvisorPass('');
        fetchAdvisors();
      } else {
        showToast('⚠️ Error: ' + (resData.error || 'No autorizado'));
      }
    } catch (err) {
      showToast('⚠️ Error al crear asesor');
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
            <span>Suite de Creación & Optimización Google Maps</span>
          </span>
        </div>

        {/* Advisor Controls & Navigation */}
        <div className="flex items-center gap-2.5">
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-white text-[11px] leading-tight">{currentUser.name}</span>
                <span className="text-[9px] text-slate-400 font-mono">{currentUser.phone}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Cambiar de Asesor / Salir"
                className="ml-2 text-slate-500 hover:text-rose-400 transition cursor-pointer text-[10px]"
              >
                Salir
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Ingresar Asesor</span>
            </button>
          )}

          {generatedData && (
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition shadow-md shadow-amber-500/10 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Descargar PDF</span>
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
            <span>🏗️ Crear Ficha Ganadora (Desde Cero)</span>
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
            <span>🔬 Auditar & Optimizar Ficha Existente</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dossiers')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'dossiers'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>📁 Clientes Guardados</span>
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
            <span>📖 Guía Dónde Dar Clic en Google</span>
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
            <span>🗣️ Guion Comercial para Asesores</span>
          </button>

          {currentUser?.role === 'admin' && (
            <button
              type="button"
              onClick={() => setActiveTab('advisors')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'advisors'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'bg-slate-950 text-amber-400 hover:text-white border border-amber-500/30'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>👥 Gestión de Asesores</span>
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
                    Módulo 1: Para Negocios sin Google Maps
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    Constructor de Ficha Ganadora (Arquitectura Top 3)
                  </h1>
                  <p className="text-xs text-slate-300 max-w-2xl">
                    Ingresa los datos básicos del negocio. La inteligencia artificial de Prestigia generará el expediente técnico exacto (categorías secretas, título optimizado, copy de 745 caracteres, catálogo y guía de verificación) para que tú o tu asesor configuren la ficha en Google en menos de 10 minutos.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block font-mono">Tiempo estimado de montaje</span>
                  <span className="text-lg font-black text-emerald-400">&lt; 10 Minutos</span>
                </div>
              </div>
            </div>

            {/* Form & Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Input Form (4 cols) */}
              <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl print:hidden">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-black text-white">1. Datos Básicos del Cliente</h2>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Nombre Comercial del Negocio *</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Ej: La Parrilla de Andrés"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Nicho / Sector Comercial *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-400 transition"
                    >
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Ciudad *</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ej: Bogotá"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Barrio o Zona</label>
                      <input
                        type="text"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        placeholder="Ej: Chapinero"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">3 Platos o Servicios Más Vendidos</label>
                    <input
                      type="text"
                      value={specialties}
                      onChange={(e) => setSpecialties(e.target.value)}
                      placeholder="Ej: Hamburguesas artesanales, costillas BBQ, cócteles"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">WhatsApp Comercial de Atención</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej: +57 300 123 4567"
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
                      <span>Generando Arquitectura Top 3 con IA...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-slate-950" />
                      <span>Generar Configuración Ganadora en 1-Clic</span>
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
                    <span>Copiar Kit de Solicitud de Fotos y Video</span>
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
                    <h3 className="text-base font-bold text-white">Listo para Generar el Perfil Ganador</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Ingresa el nombre del negocio a la izquierda y presiona el botón para generar las categorías maestras, título anti-suspensión, descripción persuasiva y checklist fotográfico.
                    </p>
                  </div>
                )}

                {isGenerating && (
                  <div className="p-12 rounded-3xl bg-slate-900/80 border border-emerald-500/30 text-center space-y-4">
                    <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                    <div>
                      <h3 className="text-base font-black text-white">Consultando Algoritmo de Google Maps</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Analizando taxonomía oficial de categorías, palabras clave de compra local y redactando descripción comercial de 745 caracteres...
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
                    Módulo 2: Para Negocios que Ya Tienen Google Maps pero no venden
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    Auditoría Forense de Brechas & Upgrade al Top 3
                  </h1>
                  <p className="text-xs text-slate-300 max-w-2xl">
                    Descubre con exactitud por qué los 3 líderes de su zona están acaparando a todos los clientes y genera la hoja de ruta técnica para destronarlos en 90 días con el ecosistema Prestigia.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block font-mono">Objetivo de Ascenso</span>
                  <span className="text-lg font-black text-amber-400">Conquista Top 3</span>
                </div>
              </div>
            </div>

            {/* Input & Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl print:hidden">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <Search className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-black text-white">Ficha Actual a Diagnosticar</h2>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Nombre Comercial de la Ficha *</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Ej: La Suiza Parrilla"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Enlace de Google Maps (Opcional)</label>
                    <input
                      type="text"
                      value={googleUrl}
                      onChange={(e) => setGoogleUrl(e.target.value)}
                      placeholder="https://maps.google.com/?cid=..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Calificación Actual ★</label>
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
                      <label className="block font-bold text-slate-300 mb-1">Opiniones Públicas</label>
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
                      <label className="block font-bold text-slate-300 mb-1">Ciudad *</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ej: Medellín"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400 transition"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Barrio o Zona</label>
                      <input
                        type="text"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        placeholder="Ej: El Poblado"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Sector *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400 transition"
                    >
                      {CATEGORY_OPTIONS.map((c) => (
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
                      <span>Analizando Brechas frente al Top 3...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Escanear Brechas & Generar Hoja de Ruta</span>
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
                        <span className="text-[10px] uppercase font-bold text-slate-400">Puntaje de Salud SEO Local</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-amber-400">{generatedData.healthScore} / 100</span>
                          <span className="text-xs text-rose-400 font-bold bg-rose-950 px-2 py-0.5 rounded border border-rose-500/30">
                            Ficha Vulnerable (-45% visibilidad)
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
                          <span>Guardar</span>
                        </button>
                        <button
                          type="button"
                          onClick={handlePrint}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Imprimir PDF</span>
                        </button>
                      </div>
                    </div>

                    {/* Critical Gaps Detected */}
                    <div className="p-5 rounded-2xl bg-slate-900 border border-rose-500/40 space-y-3 print-card-box">
                      <div className="flex items-center gap-2 text-rose-400">
                        <AlertTriangle className="w-4 h-4" />
                        <h3 className="text-sm font-black text-white">Brechas Críticas Detectadas en la Ficha</h3>
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
                        <h3 className="text-sm font-black text-white">Análisis Frente a los 3 Líderes del Top 3 en {city}</h3>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {generatedData.topCompetitorInsights}
                      </p>
                    </div>

                    {/* Action Roadmap */}
                    <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-3 print-card-box">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <h3 className="text-sm font-black text-white">Hoja de Ruta de Ascenso al Top 3 (5 Pasos)</h3>
                      </div>
                      <div className="space-y-2 text-xs">
                        {generatedData.actionRoadmap?.map((item, i) => (
                          <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white text-xs">Paso {item.step}: {item.title}</span>
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
                        <h3 className="text-sm font-black text-white">Textos Optimizados Listos para Pegar en Google</h3>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(generatedData.commercialDescription, 'Descripción')}
                          className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer print:hidden"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Nueva Descripción</span>
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
            TAB 3: CARTERA DE CLIENTES GUARDADOS
            ============================================================= */}
        {activeTab === 'dossiers' && (
          <div className="space-y-5 print:hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-black text-white">Expedientes & Cartera de Clientes</h1>
                <p className="text-xs text-slate-400">
                  {currentUser?.role === 'admin'
                    ? 'Visualizando todos los expedientes de la empresa generados por tu equipo.'
                    : `Expedientes creados por ${currentUser?.name}.`}
                </p>
              </div>
              <div className="w-full sm:w-72 relative">
                <input
                  type="text"
                  value={dossierSearch}
                  onChange={(e) => setDossierSearch(e.target.value)}
                  placeholder="Buscar por cliente o ciudad..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              </div>
            </div>

            {isLoadingDossiers ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-400" />
                Cargando expedientes guardados...
              </div>
            ) : filteredDossiers.length === 0 ? (
              <div className="text-center py-16 p-8 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-2">
                <Layers className="w-8 h-8 text-slate-500 mx-auto" />
                <h3 className="text-sm font-bold text-white">No hay expedientes guardados aún</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Genera una ficha desde cero o una auditoría en los módulos anteriores y presiona "Guardar en Cartera".
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDossiers.map((d) => (
                  <div
                    key={d.id}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                            d.mode === 'create'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {d.mode === 'create' ? 'Ficha Nueva' : 'Auditoría Top 3'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(d.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-white">{d.clientName}</h4>
                      <p className="text-xs text-slate-400">
                        {d.city} {d.neighborhood ? `• ${d.neighborhood}` : ''}
                      </p>
                      <span className="text-[11px] text-indigo-400 font-semibold block">{d.category}</span>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400">Por: {d.advisorName}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleLoadDossier(d)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition cursor-pointer"
                        >
                          Cargar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDossier(d.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
                  <h3 className="font-bold text-white text-sm">Ubicación y Área de Atención</h3>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Marca que <strong>"Sí tienes local físico"</strong> para que te deje poner la dirección. Ajusta el pin rojo exactamente sobre la entrada del establecimiento en el mapa satelital.
                </p>
              </div>

              {/* Paso 4 */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-xs">4</span>
                  <h3 className="font-bold text-white text-sm">Video de Verificación</h3>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Cuando Google pida verificación por video, sigue la guía de 3 tomas: 1) Fachada y calle, 2) Llaves abriendo puerta, 3) Datáfono/Caja registradora. ¡Listo en 60 segundos!
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
            TAB 6: GESTIÓN DE ASESORES (SOLO DUEÑO / ADMIN)
            ============================================================= */}
        {activeTab === 'advisors' && currentUser?.role === 'admin' && (
          <div className="space-y-6 print:hidden">
            <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-xl">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300">
                  Panel de Dueño / Director Comercial
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Equipo de Ventas & Asesores de Prestigia
                </h1>
                <p className="text-xs text-slate-300">
                  Crea accesos individuales para tus vendedores. Cada vendedor tiene su propio usuario y sus PDFs saldrán firmados con su nombre y WhatsApp.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Create Advisor */}
              <form onSubmit={handleCreateAdvisor} className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3.5 text-xs shadow-xl">
                <h3 className="font-black text-white text-sm pb-2 border-b border-slate-800">
                  + Registrar Nuevo Asesor Comercial
                </h3>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Nombre Completo del Asesor *</label>
                  <input
                    type="text"
                    value={newAdvisorName}
                    onChange={(e) => setNewAdvisorName(e.target.value)}
                    placeholder="Ej: Carlos Gómez"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Usuario de Acceso *</label>
                  <input
                    type="text"
                    value={newAdvisorUser}
                    onChange={(e) => setNewAdvisorUser(e.target.value)}
                    placeholder="Ej: carlos"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white lowercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Contraseña *</label>
                  <input
                    type="text"
                    value={newAdvisorPass}
                    onChange={(e) => setNewAdvisorPass(e.target.value)}
                    placeholder="Ej: ventas123"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">WhatsApp del Asesor (Para PDFs)</label>
                  <input
                    type="text"
                    value={newAdvisorPhone}
                    onChange={(e) => setNewAdvisorPhone(e.target.value)}
                    placeholder="+573001234567"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Clave Maestra de Dueño *</label>
                  <input
                    type="password"
                    value={adminMasterKey}
                    onChange={(e) => setAdminMasterKey(e.target.value)}
                    placeholder="admin"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-amber-500/40 text-amber-300 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSavingAdvisor}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg active:scale-98"
                >
                  {isSavingAdvisor ? 'Guardando Asesor...' : '+ Crear Asesor Comercial'}
                </button>
              </form>

              {/* Advisors List */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
                <h3 className="font-black text-white text-sm pb-2 border-b border-slate-800">
                  Asesores Comerciales Activos ({advisorsList.length})
                </h3>

                <div className="space-y-2 text-xs">
                  {advisorsList.map((adv) => (
                    <div
                      key={adv.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{adv.name}</span>
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                              adv.role === 'admin'
                                ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                                : 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                            }`}
                          >
                            {adv.role === 'admin' ? 'ADMIN' : 'ASESOR'}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 block">
                          Usuario: <strong className="text-slate-300">{adv.username}</strong> • Teléfono: {adv.phone}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: LOGIN DE ASESORES */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 print:hidden animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center mx-auto shadow-xl">
              <Lock className="w-6 h-6 text-slate-950" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">Ingreso a Prestigia Local Studio</h3>
              <p className="text-xs text-slate-400 mt-0.5">Acceso exclusivo para consultores y asesores comerciales</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3 text-left text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Usuario</label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="luisma"
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
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg active:scale-98"
              >
                {isLoggingIn ? 'Verificando...' : 'Iniciar Sesión'}
              </button>
            </form>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500">
              Demo: Usuario: <code className="text-slate-400">luisma</code> | Clave: <code className="text-slate-400">1234</code>
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
