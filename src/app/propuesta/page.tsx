'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PrestigiaIcon } from '@/components/PrestigiaIcon';
import { TechnologicalSolutionsLogo } from '@/components/TechnologicalSolutionsLogo';
import {
  ShieldAlert,
  ShieldCheck,
  Star,
  Sparkles,
  QrCode,
  Flame,
  MessageCircle,
  Trophy,
  Users,
  Tv,
  Store,
  Lock,
  Headphones,
  CheckCircle2,
  TrendingUp,
  Download,
  Printer,
  ChevronRight,
  ArrowRight,
  AlertTriangle,
  FileSpreadsheet,
  Zap,
  Globe,
  DollarSign,
  Gift,
  HelpCircle,
  Building2,
  Activity,
  HeartHandshake,
  Check,
  BarChart3,
  Award,
  Clock,
  ExternalLink,
  Utensils,
  Scissors,
  Stethoscope,
  ShoppingBag,
  Calculator,
  Search,
  Truck,
  Wrench,
} from 'lucide-react';

export default function PropuestaUnificadaPage() {
  const [currency, setCurrency] = useState<'COP' | 'USD' | 'EUR' | 'MXN'>('COP');
  const [industry, setIndustry] = useState<'gastronomia' | 'servicios' | 'salud_retail'>('gastronomia');
  const [showAdvisorNotice, setShowAdvisorNotice] = useState(false);
  const [activePlanInquiry, setActivePlanInquiry] = useState<string>('');

  const formatPlanPrice = (plan: 'independiente' | 'pro' | 'elite' | 'empresarial') => {
    switch (plan) {
      case 'independiente':
        if (currency === 'USD') return '$19 USD';
        if (currency === 'EUR') return '18 €';
        if (currency === 'MXN') return '$390 MXN';
        return '$49.000 COP';
      case 'pro':
        if (currency === 'USD') return '$49 USD';
        if (currency === 'EUR') return '45 €';
        if (currency === 'MXN') return '$990 MXN';
        return '$120.000 COP';
      case 'elite':
        if (currency === 'USD') return '$110 USD';
        if (currency === 'EUR') return '99 €';
        if (currency === 'MXN') return '$2.300 MXN';
        return '$290.000 COP';
      case 'empresarial':
        if (currency === 'USD') return '$280 USD';
        if (currency === 'EUR') return '250 €';
        if (currency === 'MXN') return '$5.500 MXN';
        return '$690.000 COP';
    }
  };

  const formatSetupPrice = () => {
    if (currency === 'USD') return '$99 USD';
    if (currency === 'EUR') return '90 €';
    if (currency === 'MXN') return '$1.990 MXN';
    return '$350.000 COP';
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleAdvisorContact = (planName?: string) => {
    setActivePlanInquiry(planName || 'Plan General');
    setShowAdvisorNotice(true);
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans antialiased pb-24">
      {/* Estilos dedicados para exportación a PDF / Impresión impecable */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            margin: 12mm 10mm;
            size: A4 portrait;
          }
          body {
            background-color: #ffffff !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-card {
            background-color: #f8fafc !important;
            border: 1px solid #cbd5e1 !important;
            color: #0f172a !important;
            box-shadow: none !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            margin-bottom: 12px !important;
          }
          .print-card-dark {
            background-color: #0f172a !important;
            color: #ffffff !important;
            border: 1px solid #334155 !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          .print-text-dark {
            color: #0f172a !important;
          }
          .print-text-muted {
            color: #475569 !important;
          }
          .print-border {
            border-color: #cbd5e1 !important;
          }
          .page-break-before {
            page-break-before: always !important;
            break-before: page !important;
          }
        }
      `}} />

      {/* TOPBAR FLOTANTE INFORMATIVA */}
      <header className="no-print sticky top-0 z-50 backdrop-blur-xl bg-[#060913]/90 border-b border-slate-800/80 px-4 sm:px-8 py-3.5 transition-all shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <PrestigiaIcon className="w-10 h-10 drop-shadow-md shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg tracking-tight text-white">PRESTIGIA</span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Dossier Oficial 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:flex items-center gap-1.5">
                <span>Suite de Blindaje &bull; Un producto de</span>
                <span className="text-cyan-400 font-bold">Technological Solutions Software</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Moneda Toggle */}
            <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs font-bold">
              <button
                onClick={() => setCurrency('COP')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${currency === 'COP' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'}`}
              >
                COP 🇨🇴
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${currency === 'USD' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'}`}
              >
                USD 🌎
              </button>
              <button
                onClick={() => setCurrency('EUR')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${currency === 'EUR' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'}`}
              >
                EUR 🇪🇸
              </button>
              <button
                onClick={() => setCurrency('MXN')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${currency === 'MXN' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'}`}
              >
                MXN 🇲🇽
              </button>
            </div>

            {/* Imprimir / Descargar en PDF */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm cursor-pointer"
              title="Descargar o Imprimir en PDF"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Guardar PDF</span>
            </button>

            {/* Contactar Asesor con Candado */}
            <button
              onClick={() => handleAdvisorContact('Contacto General')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold flex items-center gap-1.5 border border-amber-500/40 shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Contactar Asesor</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL DEL DOSSIER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 space-y-20">

        {/* HERO HEADER */}
        <section className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Logo Oficial Prestigia & Respaldo */}
          <div className="flex flex-col items-center justify-center gap-2.5">
            <PrestigiaIcon className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_0_30px_rgba(245,158,11,0.35)]" />
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 shadow-md">
              <span className="text-slate-400">Un producto de</span>
              <TechnologicalSolutionsLogo className="h-4" showText={true} />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>Documento Oficial de Estrategia Comercial y ROI</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Hasta el <span className="bg-gradient-to-r from-rose-500 via-amber-400 to-amber-200 bg-clip-text text-transparent">30% de tus clientes nuevos se pierden</span> por culpa de una sola mala reseña en Google Maps.
          </h1>

          <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-normal max-w-3xl mx-auto">
            El <strong className="text-amber-400 font-bold">94% de los consumidores</strong> evitan activamente cualquier negocio con opiniones negativas sin resolver (Estudios BrightLocal, Moz & Harvard Business School). Prestigia es la primera plataforma integral que <strong className="text-white">contiene quejas destructivas en privado antes de que toquen internet</strong>, responde con Inteligencia Artificial y llena tu local con sorteos y bases de datos propias.
          </p>

          {/* Badges de tecnología */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Filtro Smart QR 5★
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5 font-bold">
              <Zap className="w-4 h-4 text-amber-400" /> IA Google & WhatsApp Rescue
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5 font-bold">
              <Tv className="w-4 h-4 text-indigo-400" /> TV Wallboard en Vivo
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5 font-bold">
              <Lock className="w-4 h-4 text-rose-400" /> Ciberseguridad 2FA & Límite de Pantallas
            </span>
          </div>
        </section>

        {/* INTERACTIVE LIVE AUDITOR CALLOUT & INDUSTRY SELECTOR */}
        <section className="space-y-6 no-print">
          {/* Selector de Nicho / Sector */}
          <div className="bg-[#0c1322] border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Personalizar Presentación según tu Tipo de Negocio
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  ¿A qué industria pertenece tu empresa?
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setIndustry('gastronomia')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    industry === 'gastronomia'
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-[1.02]'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  <span>Gastronomía & Bares</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIndustry('servicios')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    industry === 'servicios'
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-[1.02]'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Servicios & Domicilios</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIndustry('salud_retail')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    industry === 'salud_retail'
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-[1.02]'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Salud, Hoteles & Retail</span>
                </button>
              </div>
            </div>

            {/* Micro-callout de aplicación del nicho */}
            <div className="mt-4 pt-3.5 border-t border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <span className="font-semibold text-amber-300">Puntos de contacto activos:</span>
              {industry === 'gastronomia' && (
                <span>Habladores QR en mesas, stickers en portacuentas, barras y empaques de domicilios.</span>
              )}
              {industry === 'servicios' && (
                <span>QR en vehículos de flota, pie de factura electrónica, tarjetas de presentación de técnicos y WhatsApp post-servicio.</span>
              )}
              {industry === 'salud_retail' && (
                <span>QR en mostrador de recepción, consultorios médicos, habitaciones hoteleras y punto de pago.</span>
              )}
            </div>
          </div>

          {/* Banner Interactivo: Auditoría en Vivo con Google Maps */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/70 via-indigo-950/40 to-slate-900 border border-blue-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 shadow-inner">
                <Search className="w-6 h-6 text-blue-400" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Herramienta de Diagnóstico en Tiempo Real
                </span>
                <h3 className="text-base sm:text-lg font-black text-white">
                  ¿Quieres calcular las fugas de dinero de tu negocio en Google Maps?
                </h3>
                <p className="text-xs text-slate-300">
                  Ingresa tu ficha comercial en nuestro simulador en vivo para medir quejas silenciosas y ROI estimado.
                </p>
              </div>
            </div>

            <Link
              href="/auditor"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-cyan-500/20 transition active:scale-95 cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-950" />
              <span>Abrir Auditoría en Vivo</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>
          </div>
        </section>

        {/* 1. SECCIÓN DE DOLORES CRÍTICOS: LA CRUDA REALIDAD */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-rose-400">Diagnóstico de Pérdidas Ocultas</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              ¿Por qué los negocios tradicionales pierden clientes todos los días?
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              La mayoría de los dueños descubren el problema cuando ya es demasiado tarde y la calificación en Google Maps cayó a 3.8 estrellas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Dolor 1 */}
            <div className="p-6 rounded-3xl bg-slate-950/70 border border-rose-500/20 space-y-3 relative overflow-hidden shadow-lg print-card">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white">1. El "Cliente Francotirador" Silencioso</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Cuando el personal pregunta <em className="text-rose-300">"¿todo bien con su atención?"</em>, el cliente suele sonreír y decir que sí por pena o incomodidad. Pero al salir, abre Google Maps y publica una reseña destructiva de 1 estrella que verán más de 15.000 clientes potenciales durante los próximos 5 años.
              </p>
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20 text-[11px] text-rose-300 font-medium">
                ⚠️ <strong>Costo Real:</strong> Se requieren al menos 35 reseñas perfectas de 5★ para recuperar el promedio que destruye una sola calificación de 1 estrella.
              </div>
            </div>

            {/* Dolor 2 */}
            <div className="p-6 rounded-3xl bg-slate-950/70 border border-amber-500/20 space-y-3 relative overflow-hidden shadow-lg print-card">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                <TrendingUp className="w-5 h-5 rotate-180" />
              </div>
              <h3 className="text-lg font-black text-white">2. La Pérdida del 22% al 30% de Clientes Potenciales</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Investigaciones de <em>Moz</em> y <em>Search Engine Land</em> confirman que una sola queja pública en Google Maps ahuyenta de inmediato al <strong>22% de los clientes potenciales</strong>. Y según estudios de <em>Womply</em> y <em>Harvard</em> sobre 200.000 comercios, los negocios que caen por debajo de 4.0 estrellas ganan hasta un <strong>33% menos ingresos anuales</strong> frente a sus competidores.
              </p>
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 text-[11px] text-amber-300 font-medium">
                ⚠️ <strong>Impacto Real en Caja:</strong> En un negocio con ventas de $30M COP al mes, una reputación descuidada destruye entre $3.0M y $5.0M COP en ventas netas mensuales que se van directo a tu competencia.
              </div>
            </div>

            {/* Dolor 3 */}
            <div className="p-6 rounded-3xl bg-slate-950/70 border border-indigo-500/20 space-y-3 relative overflow-hidden shadow-lg print-card">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white">3. Días de Bajo Flujo y Cero Contacto con Clientes</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                En jornadas de baja afluencia los negocios sufren porque no tienen cómo contactar directamente a quienes ya les compraron. Dependen de publicidad costosa o de intermediarios que cobran comisiones excesivas y se quedan con los datos de tus clientes.
              </p>
              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-indigo-300 font-medium">
                ⚠️ <strong>Costo Real:</strong> Cientos o miles de personas pasan por tu negocio cada mes y no te queda ni un solo número de teléfono para enviarles promociones o recompras directas.
              </div>
            </div>

            {/* Dolor 4 */}
            <div className="p-6 rounded-3xl bg-slate-950/70 border border-purple-500/20 space-y-3 relative overflow-hidden shadow-lg print-card">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white">4. La "Ceguera Operativa" del Propietario</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Cuando el dueño o gerente no está presente en el establecimiento, no tiene forma de saber qué colaborador atendió con desgano, qué servicio tuvo fallas o por qué un cliente habitual se marchó inconforme. No hay trazabilidad, auditoría ni control en tiempo real.
              </p>
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-300 font-medium">
                ⚠️ <strong>Costo Real:</strong> Pérdida constante de clientes leales sin que la dirección jamás se entere de cuál fue el cuello de botella operativo.
              </div>
            </div>
          </div>
        </section>

        {/* 2. CÓMO LO RESUELVE PRESTIGIA: EL FILTRADO INTELIGENTE */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0c1322] via-[#070b16] to-[#0c1322] border-2 border-amber-500/40 shadow-2xl relative overflow-hidden space-y-8 print-card">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">La Tecnología Patentada</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              El Algoritmo Smart QR: El Escudo Protector de tu Marca
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Un solo código QR en cada mesa o mostrador detecta la satisfacción del cliente en tiempo real y bifurca el flujo de forma inteligente:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Camino Positivo */}
            <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-sm uppercase">
                <CheckCircle2 className="w-5 h-5" />
                <span>Si el cliente califica 4 o 5 Estrellas:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                El sistema lo redirige de inmediato a la ficha pública de <strong>Google Maps</strong> para que deje su reseña oficial. Además, le genera sugerencias de texto para que solo tenga que presionar <em>Pegar y Publicar</em>.
              </p>
              <div className="text-[11px] font-bold text-emerald-300 bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-500/30">
                🚀 Resultado: Crecimiento exponencial en el ranking de Google Maps, superando a todos los competidores de tu sector.
              </div>
            </div>

            {/* Camino Negativo */}
            <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/40 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-black text-sm uppercase">
                <ShieldAlert className="w-5 h-5" />
                <span>Si el cliente califica 1, 2 o 3 Estrellas:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                <strong>Google Maps queda completamente bloqueado.</strong> La inconformidad se captura en un canal privado protegido, emite una alerta sonora en sala y el Asistente IA redacta un mensaje de rescate para disculparnos y compensarlo por WhatsApp en 15 segundos.
              </p>
              <div className="text-[11px] font-bold text-rose-300 bg-rose-950/50 p-2.5 rounded-xl border border-rose-500/30">
                🛡️ Resultado: Cero malas reseñas públicas en Google. El cliente queda desarmado, complacido y agradecido por la rápida atención.
              </div>
            </div>
          </div>
        </section>

        {/* 2.2 VERSATILIDAD MULTI-SECTORIAL: ADAPTADO A TU INDUSTRIA */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400">Diseñado para Operaciones de Alto Tráfico</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Sistemas Especializados para Cada Sector Comercial
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              Prestigia adapta sus flujos de filtrado, tiempos de respuesta y captura de datos al ADN de cada tipo de negocio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sector 1: Gastronomía */}
            <div className="p-5 rounded-2xl bg-[#090E1A] border border-slate-800 space-y-2.5 print-card hover:border-amber-500/40 transition">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Utensils className="w-4 h-4" />
                </div>
                <span>Gastronomía & Bares</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Restaurantes, gastrobares, cafeterías de especialidad y comida rápida. Códigos QR en cada mesa y barra, alertas sonoras en cocina cuando un plato se demora y sorteos de cenas para captar teléfonos.
              </p>
              <div className="text-[11px] text-amber-300/90 font-medium bg-amber-950/20 p-2 rounded-xl border border-amber-500/20">
                🎯 Resultado: Evita quejas por demoras en cocina y llena el local los martes y miércoles.
              </div>
            </div>

            {/* Sector 2: Belleza & Estética */}
            <div className="p-5 rounded-2xl bg-[#090E1A] border border-slate-800 space-y-2.5 print-card hover:border-pink-500/40 transition">
              <div className="flex items-center gap-2.5 text-pink-400 font-bold text-sm">
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                  <Scissors className="w-4 h-4" />
                </div>
                <span>Belleza & Barberías</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Salones de belleza, barberías, spas y centros de estética. Placas acrílicas en los espejos, asignación de reseñas al barbero o estilista que atendió y auditoría de personal con propinas e incentivos.
              </p>
              <div className="text-[11px] text-pink-300/90 font-medium bg-pink-950/20 p-2 rounded-xl border border-pink-500/20">
                🎯 Resultado: Detecta inconformidades con tintes o cortes en privado antes de que salgan a redes.
              </div>
            </div>

            {/* Sector 3: Salud & Bienestar */}
            <div className="p-5 rounded-2xl bg-[#090E1A] border border-slate-800 space-y-2.5 print-card hover:border-cyan-500/40 transition">
              <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-sm">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <span>Salud & Clínicas</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Consultorios odontológicos, médicos, medicina estética, fisioterapia y clínicas veterinarias. Código QR en sala de espera y recepción para auditar el trato del personal y la puntualidad de las citas.
              </p>
              <div className="text-[11px] text-cyan-300/90 font-medium bg-cyan-950/20 p-2 rounded-xl border border-cyan-500/20">
                🎯 Resultado: Blindaje del prestigio profesional del doctor y aumento de pacientes particulares.
              </div>
            </div>

            {/* Sector 4: Retail & Boutiques */}
            <div className="p-5 rounded-2xl bg-[#090E1A] border border-slate-800 space-y-2.5 print-card hover:border-purple-500/40 transition">
              <div className="flex items-center gap-2.5 text-purple-400 font-bold text-sm">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span>Retail & Comercio</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tiendas de moda, zapaterías, joyerías, gimnasios y talleres automotrices. QR en el mostrador de pago y empaque para transformar compradores casuales en miembros VIP del club de fidelización.
              </p>
              <div className="text-[11px] text-purple-300/90 font-medium bg-purple-950/20 p-2 rounded-xl border border-purple-500/20">
                🎯 Resultado: Base de datos propia de compradores para lanzar campañas de liquidación y temporada.
              </div>
            </div>
          </div>
        </section>

        {/* 2.5 EL PLAN ESTRATÉGICO DE INICIO (SETUP & DESPEGUE DIGITAL) */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-[#0a101f] to-amber-950/50 border-2 border-indigo-500/50 shadow-2xl relative overflow-hidden space-y-8 print-card">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>EXCLUSIVO: 5 CUPOS DE FUNDADOR POR NICHO</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                Plan Estratégico de Inicio: Web Oficial + Google Maps + Kit Smart QR
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                El paquete integral llave en mano donde construimos tus activos digitales definitivos en menos de 5 días hábiles. Compara cuánto cobra una agencia tradicional frente al valor real que recibes con Prestigia:
              </p>
            </div>

            {/* Tarjeta de Precio con Descuento del 50% */}
            <div className="p-6 rounded-2xl bg-slate-900/95 border-2 border-amber-500/50 text-center min-w-[240px] shadow-2xl space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block line-through">
                PRECIO REGULAR: {currency === 'COP' ? '$700.000 COP' : '$199 USD'}
              </span>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black uppercase tracking-wider">
                🔥 50% DCTO. PRIMEROS 5 CUPOS
              </div>
              <div className="text-3xl sm:text-4xl font-black text-amber-400 my-1">
                {currency === 'COP' ? '$350.000 COP' : '$99 USD'}
              </div>
              <span className="text-[11px] text-emerald-400 font-bold block pt-1 border-t border-slate-800">
                🎁 ¡100% BONIFICADO ($0 COP) en suscripción anual de Planes PRO y ÉLITE!
              </span>
            </div>
          </div>

          {/* TABLA COMPARATIVA DE COSTOS: MERCADO TRADICIONAL VS PRESTIGIA */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>Comparativa de Inversión: Agencias Tradicionales vs. Prestigia</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-400">
                ¡Ahorras más del 75%!
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 font-semibold block">1. Página Web Móvil &lt;1.2s:</span>
                <span className="text-rose-400 font-medium block">Agencias: $800.000 - $1.200.000 COP</span>
                <span className="text-white font-bold block text-[11px]">Diseño moderno para celulares con menú y WhatsApp</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 font-semibold block">2. Google Maps SEO & Local:</span>
                <span className="text-rose-400 font-medium block">Agencias: $400.000 - $600.000 COP</span>
                <span className="text-white font-bold block text-[11px]">Categorías, fotos, palabras clave y verificación</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 font-semibold block">3. Branding & Kit Smart QR:</span>
                <span className="text-rose-400 font-medium block">Agencias: $150.000 - $250.000 COP</span>
                <span className="text-white font-bold block text-[11px]">Archivos vectoriales para mesa, barra y caja</span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1 text-center flex flex-col justify-center">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Total en Agencias:</span>
                <span className="text-rose-400 font-bold line-through block text-xs">$1.350.000 a $2.050.000+ COP</span>
                <span className="text-emerald-400 font-black block text-sm sm:text-base pt-1">
                  En Prestigia: {currency === 'COP' ? '$350.000 COP' : '$99 USD'}
                </span>
              </div>
            </div>
          </div>

          {/* LOS 3 PILARES TÉCNICOS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Pilar 1: Página Web */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm sm:text-base">1. Página Web Oficial de Carga Rápida (&lt;1.2s)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Diseño responsive moderno para celulares con catálogo de fotos, menú interactivo y botón directo a WhatsApp. De tu propiedad definitiva para siempre.
              </p>
            </div>

            {/* Pilar 2: Google Maps */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm sm:text-base">2. Configuración Profesional de Google Maps</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Auditoría y optimización SEO local, categorías quirúrgicas, fotos corporativas y enlace directo conectado al Smart QR para atraer clientes calificados de la zona.
              </p>
            </div>

            {/* Pilar 3: Kit Smart QR */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm sm:text-base">3. Kit Smart QR con tu Identidad de Marca</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Diseño exclusivo con tu logotipo y paleta corporativa listo para imprimir en placas de recepción, mostradores, salas de atención o stickers de punto de pago.
              </p>
            </div>
          </div>

          {/* CLÁUSULA DE URGENCIA Y CONDICIÓN DE 200.000 */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200/90 leading-relaxed">
              ⚠️ <strong>Condición de Urgencia & Cupos de Fundador:</strong> La tarifa de <strong>{currency === 'COP' ? '$350.000 COP' : '$99 USD'}</strong> es el resultado directo de un <strong>50% de descuento especial</strong> reservado estrictamente para los <strong>primeros 5 negocios de cada nicho</strong> comercial. Una vez ocupados los 5 cupos, el Plan de Inicio <strong>retorna a su precio regular de {currency === 'COP' ? '$700.000 COP' : '$199 USD'}</strong> y los negocios posteriores <strong>no tendrán acceso gratuito</strong> a las próximas mejoras del sistema (Fidelización por Puntos y Páginas Amarillas Digitales).
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 leading-relaxed">
              ** <strong>¿Tu negocio ya cuenta con página web y perfil de Google Maps activo y deseas conservarlos?</strong> Si tu empresa ya tiene estos activos creados y únicamente requiere la auditoría técnica de rendimiento, la vinculación del enlace blindado de reputación, la sincronización de analíticas y la entrega del Kit Smart QR listo para sala, el Plan de Inicio queda en tan solo <strong>{currency === 'COP' ? '$200.000 COP' : '$59 USD'}</strong> (igualmente exclusivo para los 5 cupos de nicho).
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-3">
            <span>
              💡 <strong>La Fórmula de Éxito:</strong> El <em>Plan Estratégico de Inicio</em> construye tus activos digitales definitivos (Web + Google Maps). Tu suscripción mensual (<em>Básico, Pro o Élite</em>) mantiene activo el radar anti-quejas, la IA, el TV Wallboard y las alertas en sala.
            </span>
            <button
              onClick={() => handleAdvisorContact('Plan Estratégico de Inicio')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 transition active:scale-95 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-300" />
              <span>Postular mi Negocio con mi Asesor ➔</span>
            </button>
          </div>
        </section>

        {/* 3. MATRIZ DE PLANES Y PRECIOS OFICIALES */}
        <section className="space-y-8 page-break-before">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">Estructura Comercial y Precios</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Tres Planes Claros. Un Solo Objetivo: Multiplicar tu Negocio.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              Sin cláusulas de permanencia oculta. Todos los planes incluyen actualizaciones de software y soporte técnico especializado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* PLAN BÁSICO */}
            <div className="p-6 rounded-3xl bg-[#090E1A] border border-slate-800 flex flex-col justify-between space-y-6 shadow-xl print-card">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">PLAN BÁSICO</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">
                    1 Sede Única
                  </span>
                </div>

                <div>
                  <div className="text-3xl font-black text-white">
                    {currency === 'COP' ? '$89.000 COP' : '$29 USD'}
                    <span className="text-xs text-slate-400 font-normal"> / mes</span>
                  </div>
                  <div className="text-[11px] text-amber-400/90 font-medium pt-0.5">
                    {currency === 'COP' ? '$890.000 COP / año (2 meses gratis)' : '$290 USD / año (2 months off)'}
                  </div>
                  <div className="mt-2 p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                    ⚙️ <strong>Setup Inicial:</strong> {currency === 'COP' ? '$350.000 COP' : '$99 USD'} (pago único)
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Límite de Pantallas:</span>
                  </div>
                  <p className="text-slate-400">
                    <strong>Solo 1 pantalla central del Dueño.</strong> Sin acceso para pantallas de local/caja.
                  </p>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Filtro Smart QR anti-reseñas 1 a 3★</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Radar de Google Maps básico</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>1 Soporte técnico al mes (cartas/horarios)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Reporte mensual de rendimiento</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-500">
                    <Lock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    <span>Sin Asistente IA Google</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-500">
                    <Lock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    <span>Sin Alertas Sonoras en Vivo</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-500">
                    <Lock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    <span>Sin Sorteos ni Base de Clientes CSV</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleAdvisorContact('Plan Básico')}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs text-center flex items-center justify-center gap-2 transition active:scale-95 shadow-md cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Solicitar Básico con mi Asesor</span>
              </button>
            </div>

            {/* PLAN PRO (DESTACADO) */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#10172c] via-[#090E1A] to-[#090E1A] border-2 border-indigo-500/80 flex flex-col justify-between space-y-6 shadow-2xl relative print-card">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-indigo-500/30">
                ⭐ EL MÁS POPULAR PARA LOCALES
              </div>

              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-400">PLAN PRO</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                    1 Sede de Alto Flujo
                  </span>
                </div>

                <div>
                  <div className="text-3xl font-black text-white">
                    {currency === 'COP' ? '$179.000 COP' : '$49 USD'}
                    <span className="text-xs text-slate-400 font-normal"> / mes</span>
                  </div>
                  <div className="text-[11px] text-indigo-300 font-medium pt-0.5">
                    {currency === 'COP' ? '$1.790.000 COP / año (2 meses gratis)' : '$490 USD / año (2 months off)'}
                  </div>
                  <div className="mt-2 p-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-[10px] text-emerald-300 font-bold">
                    🎁 <strong>Setup Inicial ({currency === 'COP' ? '$350K COP' : '$99 USD'}):</strong> ¡100% BONIFICADO en plan anual!
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-[11px] text-slate-200 space-y-1">
                  <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Límite de Pantallas:</span>
                  </div>
                  <p className="text-slate-300">
                    <strong>1 pantalla Dueño + 2 pantallas en Local/Caja</strong> con 2FA y protección de turnos.
                  </p>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-200 border-t border-slate-800 pt-4">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span><strong>Todo lo del Plan Básico</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span><strong>Asistente IA Google Ilimitado</strong> (3 tonos de respuesta)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span><strong>Alertas en Vivo Sonoras & Push</strong> en sala y celulares</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span><strong>Sorteo del Mes Oficial</strong> con 1 ganador oficial</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span><strong>Exportación CSV de Clientes</strong> con Habeas Data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>2 Soportes técnicos incluidos al mes</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-500">
                    <Lock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    <span>Sin Rescate IA WhatsApp a Dueño (Élite)</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleAdvisorContact('Plan Pro')}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs text-center flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/30 active:scale-95 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Activar Plan Pro con mi Asesor</span>
              </button>
            </div>

            {/* PLAN ÉLITE TOTAL */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#1c1407] via-[#090E1A] to-[#090E1A] border-2 border-amber-500 flex flex-col justify-between space-y-6 shadow-2xl relative print-card">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg shadow-amber-500/30">
                👑 MÁXIMA POTENCIA MULTISEDE
              </div>

              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400">PLAN ÉLITE TOTAL</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    Hasta 3 Sedes Incluidas
                  </span>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">
                    <span className="text-xs font-semibold text-amber-300 mr-1.5">Desde</span>
                    {currency === 'COP' ? '$250.000 COP' : '$99 USD'}
                    <span className="text-xs text-slate-400 font-normal"> / mes</span>
                  </div>
                  <div className="mt-2 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] space-y-1 font-medium">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>• 1 Sede física:</span>
                      <strong className="text-white">{currency === 'COP' ? '$250.000 COP' : '$99 USD'} <span className="text-slate-400 font-normal">/ mes</span></strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>• 2 Sedes físicas:</span>
                      <strong className="text-white">{currency === 'COP' ? '$300.000 COP' : '$119 USD'} <span className="text-slate-400 font-normal">/ mes</span></strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>• 3 Sedes físicas:</span>
                      <strong className="text-white">{currency === 'COP' ? '$350.000 COP' : '$139 USD'} <span className="text-slate-400 font-normal">/ mes</span></strong>
                    </div>
                  </div>
                  <div className="mt-2 p-1.5 rounded-lg bg-amber-950/50 border border-amber-500/40 text-[10px] text-amber-300 font-bold">
                    🎁 <strong>Plan Anual:</strong> ¡Paga 10 meses y recibe 12 meses completos (Ahorras 2 meses)!
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200/90 space-y-1">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5" />
                    <span>Límite de Pantallas:</span>
                  </div>
                  <p>
                    <strong>1 Dueño + 2 por Sede (hasta 6 pantallas) + TV Wallboard en Vivo</strong>.
                  </p>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-200 border-t border-slate-800 pt-4">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Hasta 3 Sedes Físicas integradas</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Rescate Diplomático en WhatsApp con IA</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Pantalla TV Wallboard en Vivo para Salón</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Sorteos Multi-Ganador (1 a 10+) por sede o global</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Exportación Global CSV de todas las sedes</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Ranking de personal y bitácora de novedades</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>4 Soportes Técnicos Prioritarios VIP / mes</strong></span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleAdvisorContact('Plan Élite')}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs text-center flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/30 active:scale-95 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-slate-950" />
                <span>Desbloquear Plan Élite con mi Asesor</span>
              </button>
            </div>
          </div>
        </section>

        {/* 3.5 MATEMÁTICAS FINANCIERAS & RETORNO DE INVERSIÓN (ROI) */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0c1424] via-[#080d1a] to-[#0c1424] border-2 border-emerald-500/40 shadow-2xl space-y-8 print-card">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                <span>EL NÚMERO QUE CONVENCE A TU CONTADOR</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                Por Qué Prestigia se Paga Solo Desde el Primer Mes
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Prestigia no es un costo operativo; es una póliza de seguro y un motor de ingresos directos. Aquí están los números transparentes:
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center min-w-[200px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Retorno Estimado Anual</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 my-1">
                {currency === 'COP' ? '+$14.000.000 COP' : '+$3,800 USD'}
              </div>
              <span className="text-[10px] text-emerald-300 font-semibold block">En ahorros y ventas recuperadas</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* ROI 1 */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 print-card">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-bold text-white text-sm sm:text-base">1. Evitar 1 Sola Reseña Negativa</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Un cliente recurrente que consume $45.000 COP acude 12 veces al año ($540.000 COP). Si una reseña destructiva de 1★ ahuyenta a solo 15 clientes nuevos al mes, tu negocio pierde <strong>$8.100.000 COP al año</strong>.
              </p>
              <div className="text-[11px] font-bold text-emerald-300 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/30">
                💰 Saldo: Contener 1 sola queja en privado paga más de 1 año completo del Plan Pro ($1.79M COP/año).
              </div>
            </div>

            {/* ROI 2 */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 print-card">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="font-bold text-white text-sm sm:text-base">2. Ahorro en Community Management</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Un redactor o community manager cobra entre <strong>$500.000 y $1.000.000 COP al mes</strong> por responder redes y comentarios. La IA de Prestigia responde con máxima elocuencia en 3 segundos con 1 clic.
              </p>
              <div className="text-[11px] font-bold text-indigo-300 bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-500/30">
                💰 Saldo: Ahorro neto directo de $6.000.000 a $12.000.000 COP al año en nómina de mercadeo.
              </div>
            </div>

            {/* ROI 3 */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 print-card">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="font-bold text-white text-sm sm:text-base">3. Reactivación de Días Muertos</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Crear una base propia de 2.000 contactos verificados con WhatsApp te permite enviar ofertas los martes al mediodía. Con solo el 2.5% de respuesta (50 personas con ticket de $30.000 COP):
              </p>
              <div className="text-[11px] font-bold text-amber-300 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/30">
                💰 Saldo: Generas $1.500.000 COP adicionales en una sola tarde que antes tenías vacía.
              </div>
            </div>
          </div>
        </section>

        {/* 4. AUDITORÍA DETALLADA PESTAÑA POR PESTAÑA */}
        <section className="space-y-8 page-break-before">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Transparencia Operativa Absoluta</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Recorrido Pestaña por Pestaña del Sistema
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              Cada sección del Portal Prestigia fue concebida para ahorrarte tiempo, blindar tu prestigio y generar dinero constante.
            </p>
          </div>

          <div className="space-y-4">
            {/* PESTAÑA 1 */}
            <div className="p-6 rounded-3xl bg-[#090E1A] border border-slate-800 space-y-3 print-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">1</div>
                  <h3 className="text-base sm:text-lg font-black text-white">Panel Central & Semáforo Operativo (Dashboard)</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700">
                  Incluido en Básico, Pro y Élite
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                <strong>Uso y Funciones:</strong> Cabina de mando en tiempo real. Muestra el Índice de Aprobación Neta (% de clientes felices), total de calificaciones recibidas, tiempo medio de respuesta y acceso rápido a los códigos QR imprimibles.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                  🎯 <strong>Beneficio:</strong> El dueño entiende la salud de su negocio en 5 segundos sin pedirle cuentas al administrador.
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-amber-300">
                  💡 <strong>Tip Operativo:</strong> Si la aprobación baja del 90%, revisa el turno de la tarde para detectar demoras en cocina.
                </div>
              </div>
            </div>

            {/* PESTAÑA 2 */}
            <div className="p-6 rounded-3xl bg-[#090E1A] border border-slate-800 space-y-3 print-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">2</div>
                  <h3 className="text-base sm:text-lg font-black text-white">Radar de Google Maps & Asistente IA</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-[10px] font-bold text-indigo-300 border border-indigo-500/30">
                  Lectura en Básico • IA en Pro y Élite
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                <strong>Uso y Funciones:</strong> Monitorea en vivo todas las reseñas de Google Maps. En Plan Pro y Élite, genera respuestas inmediatas con IA en 3 tonos (Cálido, Corporativo y Promocional) y traduce automáticamente si el cliente escribe en inglés u otro idioma.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                  🎯 <strong>Beneficio:</strong> Ahorra de $600K a $1.2M COP al mes en Community Management y posiciona tu local en el Top 3 de Google.
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-amber-300">
                  💡 <strong>Tip Operativo:</strong> Usar el tono Promocional fideliza al cliente para que vuelva la semana siguiente por un plato nuevo.
                </div>
              </div>
            </div>

            {/* PESTAÑA 3 */}
            <div className="p-6 rounded-3xl bg-[#090E1A] border border-slate-800 space-y-3 print-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">3</div>
                  <h3 className="text-base sm:text-lg font-black text-white">Quejas Privadas & Rescate por WhatsApp con IA</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                  Manual en Básico/Pro • Rescate IA Exclusivo Élite
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                <strong>Uso y Funciones:</strong> Bóveda blindada donde quedan retenidas todas las calificaciones de 1, 2 y 3 estrellas. En Plan Élite, la IA analiza la queja y redacta 3 opciones de conciliación (Compensación con cortesía, Disculpa humilde o Garantía de calidad), abriendo WhatsApp en 1 solo clic.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                  🎯 <strong>Beneficio:</strong> Evita el 100% de los escándalos en redes sociales y retiene al cliente insatisfecho para siempre.
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-amber-300">
                  💡 <strong>Tip Operativo:</strong> Responder en menos de 15 minutos tiene una tasa de efectividad de rescate del 89%.
                </div>
              </div>
            </div>

            {/* PESTAÑA 4 */}
            <div className="p-6 rounded-3xl bg-[#090E1A] border border-slate-800 space-y-3 print-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">4</div>
                  <h3 className="text-base sm:text-lg font-black text-white">Sorteos del Mes, Ruleta & Club VIP</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-[10px] font-bold text-purple-300 border border-purple-500/30">
                  Pro (1 Ganador) • Élite (Multi-Ganador 1 a 10+)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                <strong>Uso y Funciones:</strong> Motor de gamificación que motiva a los clientes a calificar desde su celular para ganar incentivos del establecimiento. Incluye ruleta animada, verificación de Habeas Data y generador de certificados oficiales de ganadores.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                  🎯 <strong>Beneficio:</strong> Multiplica por 4 el número de personas que escanean el QR en recepción, mostrador o punto de atención.
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-amber-300">
                  💡 <strong>Tip Operativo:</strong> Premia un "Bono de Compra", "Producto Estrella" o "Servicio de Cortesía". El costo para el negocio es marginal frente a cientos de contactos ganados.
                </div>
              </div>
            </div>

            {/* PESTAÑA 5 */}
            <div className="p-6 rounded-3xl bg-[#090E1A] border border-slate-800 space-y-3 print-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">5</div>
                  <h3 className="text-base sm:text-lg font-black text-white">Base de Clientes & Exportación CSV</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  Pro (1 Sede) • Élite (Global Multi-Sede)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                <strong>Uso y Funciones:</strong> Directorio centralizado de todos los clientes que han visitado tu negocio, con nombre, teléfono, fecha, sede y consentimiento legal firmado. Permite descargar todo a Excel o CSV blindado con 1 clic.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                  🎯 <strong>Beneficio:</strong> Te independiza de intermediarios costosos y crea un canal de WhatsApp Marketing directo sin pagar publicidad.
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-amber-300">
                  💡 <strong>Tip Operativo:</strong> Descarga la base periódicamente y envía un WhatsApp con promociones exclusivas para dinamizar días de menor flujo.
                </div>
              </div>
            </div>

            {/* PESTAÑA 6 */}
            <div className="p-6 rounded-3xl bg-[#090E1A] border border-slate-800 space-y-3 print-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">6</div>
                  <h3 className="text-base sm:text-lg font-black text-white">Centro de Comando & Auditoría de Personal</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-[10px] font-bold text-blue-300 border border-blue-500/30">
                  Pro (Básico) • Élite (Ranking Completo & Bitácora)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                <strong>Uso y Funciones:</strong> Asigna cada calificación al colaborador que atendió al cliente (asesor, recepcionista, especialista, cajero). Genera el ranking de satisfacción del equipo y permite registrar incidentes operativos (inconformidades, demoras, etc.).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                  🎯 <strong>Beneficio:</strong> Sabes con exactitud matemática a quién premiar con bonos y a quién capacitar para evitar quejas.
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-amber-300">
                  💡 <strong>Tip Operativo:</strong> Asigna un incentivo o reconocimiento especial al colaborador que lidere el ranking semanal.
                </div>
              </div>
            </div>

            {/* PESTAÑA 7 */}
            <div className="p-6 rounded-3xl bg-[#090E1A] border border-slate-800 space-y-3 print-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">7</div>
                  <h3 className="text-base sm:text-lg font-black text-white">Pantalla TV Wallboard en Vivo para Salón/Cocina</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                  Exclusivo Plan Élite
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                <strong>Uso y Funciones:</strong> Modo de visualización pop-out para proyectar en Smart TV o tablet en salón o cocina. Oculta la barra de navegador (F11), incluye selector bilingüe instantáneo y tacómetro radial con las opiniones que entran en vivo.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                  🎯 <strong>Beneficio:</strong> Motiva a todo el personal en tiempo real y transmite un estándar de calidad e higiene tecnológica a los clientes.
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-amber-300">
                  💡 <strong>Tip Operativo:</strong> Colócalo en la zona de pase de cocina o barra para que el equipo celebre cada 5 estrellas.
                </div>
              </div>
            </div>

            {/* PESTAÑA 8 */}
            <div className="p-6 rounded-3xl bg-[#090E1A] border border-slate-800 space-y-3 print-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">8</div>
                  <h3 className="text-base sm:text-lg font-black text-white">Control Multisede & Franquicias</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-[10px] font-bold text-teal-300 border border-teal-500/30">
                  Exclusivo Plan Élite (Hasta 3 sedes)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                <strong>Uso y Funciones:</strong> Conmutador inteligente para supervisar múltiples sucursales con 1 solo clic. Permite alternar entre sedes individuales o activar la vista macro "Todas las Sedes" para un consolidado financiero y de servicio.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                  🎯 <strong>Beneficio:</strong> Centraliza la administración de marcas con varias sedes sin enredos de contraseñas ni desorden.
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-amber-300">
                  💡 <strong>Tip Operativo:</strong> Compara el rendimiento entre sedes para identificar qué administrador está ejecutando mejor la operación.
                </div>
              </div>
            </div>

            {/* PESTAÑA 9 */}
            <div className="p-6 rounded-3xl bg-[#090E1A] border border-slate-800 space-y-3 print-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">9</div>
                  <h3 className="text-base sm:text-lg font-black text-white">Seguridad 2FA, Límite de Pantallas & Lista Negra</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700">
                  En todos los planes según sus reglas
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                <strong>Uso y Funciones:</strong> Seguridad de nivel bancario. El Dueño solo puede tener 1 pantalla activa. Las sedes tienen hasta 2 pantallas de local en Pro y Élite (0 en Básico). Incluye verificación 2FA con cuenta regresiva de 60s, detección de traslapes y bloqueo de dispositivos no autorizados.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                  🎯 <strong>Beneficio:</strong> Cero fuga de datos. Si un empleado renuncia o cambia de teléfono, no puede seguir viendo la información del negocio.
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-amber-300">
                  💡 <strong>Tip Operativo:</strong> Revisa la lista negra y los registros de auditoría forense para verificar las horas de conexión.
                </div>
              </div>
            </div>

            {/* PESTAÑA 10 */}
            <div className="p-6 rounded-3xl bg-[#090E1A] border border-slate-800 space-y-3 print-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">10</div>
                  <h3 className="text-base sm:text-lg font-black text-white">Configuración de Marca & Tickets de Soporte</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-[10px] font-bold text-indigo-300 border border-indigo-500/30">
                  1 ticket Básico • 2 tickets Pro • 4 tickets VIP Élite
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                <strong>Uso y Funciones:</strong> Personaliza los colores de tu marca, sube tu logotipo y gestiona los tickets mensuales incluidos para solicitar cambios de precios, actualización de platos de la carta o soporte técnico directo.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                  🎯 <strong>Beneficio:</strong> Cero costos extra en diseñadores web. Nuestro equipo técnico actualiza tu carta dentro de tu mensualidad.
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-amber-300">
                  💡 <strong>Tip Operativo:</strong> Envíanos tus fotos en alta resolución para que el Smart QR se vea irresistible en el celular del cliente.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. VISIÓN DE FUTURO Y BENEFICIO FUNDADORES */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-amber-950/40 via-[#070b16] to-[#0c1322] border-2 border-amber-500 space-y-8 shadow-2xl relative overflow-hidden print-card-dark">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider">
              🚀 LA REVOLUCIÓN PRESTIGIA • PRÓXIMOS LANZAMIENTOS
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Hacia Dónde Apunta el Sistema: Lealtad y Promoción Masiva
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Prestigia no se detiene en las reseñas. Nuestro mapa de ruta convertirá a tu negocio en una máquina de fidelización automatizada a través de dos grandes innovaciones en desarrollo:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Innovación 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-black text-sm">
                <Gift className="w-5 h-5" />
                <span>1. Sistema de Puntos por Compras (Lealtad Web)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Cada vez que un cliente pague su cuenta y escanee el QR, acumulará puntos automáticos en su navegador sin necesidad de descargar apps pesadas. Los puntos podrán redimirse por productos, descuentos y accesos exclusivos, disparando la recompra recurrente.
              </p>
            </div>

            {/* Innovación 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-black text-sm">
                <Globe className="w-5 h-5" />
                <span>2. Páginas Amarillas Digitales (Guía Prestigia)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Lanzamiento del portal geolocalizado más exclusivo del país. Los clientes y usuarios buscarán los mejores establecimientos, clínicas, tiendas y servicios de su ciudad. <strong>Solo los negocios con el Sello de Calidad Prestigia tendrán su ficha destacada de forma preferencial.</strong>
              </p>
            </div>
          </div>

          {/* BENEFICIO VITALICIO FUNDADORES */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-500/20 border-2 border-amber-400 text-center space-y-4">
            <div className="inline-block px-4 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest shadow-md">
              🎁 OPORTUNIDAD ÚNICA: BENEFICIO PARA LOS PRIMEROS 5 NEGOCIOS
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-white">
              Acceso 100% Gratuito y de Por Vida a los Nuevos Módulos
            </h3>
            <p className="text-xs sm:text-sm text-amber-100 max-w-3xl mx-auto leading-relaxed">
              Los primeros <strong>5 negocios de cada categoría comercial</strong> (las primeras 5 hamburgueserías, las primeras 5 barberías, los primeros 5 cafés, etc.) que se activen en Prestigia tendrán acceso preferencial sin costo alguno a los módulos de <strong>Puntos por Compras</strong> y a las <strong>Páginas Amarillas Digitales</strong> cuando se liberen, manteniendo su misma tarifa mensual de por vida.
            </p>
            <div className="pt-2">
              <button
                onClick={() => handleAdvisorContact('Beneficio Fundador (Primeros 5 Negocios)')}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-400/30 transition active:scale-95 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-slate-950" />
                <span>Postular mi Negocio con mi Asesor</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>
        </section>

        {/* 6. MANEJO DE OBJECIONES: SIN EXCUSAS PARA NO BLINDARSE */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Preguntas Frecuentes & Objeciones</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Respuestas Claras para Decisiones Inteligentes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-5 rounded-2xl bg-[#090E1A] border border-slate-800 space-y-2 print-card">
              <h4 className="font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>"Ya tengo un código QR que lleva directo a Google Maps."</span>
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Ese es el error más grave: si el cliente tuvo una mala experiencia, le estás poniendo el micrófono para que te destruya con 1 estrella pública. Con Prestigia hay un filtro inteligente: los felices van a Google y los disgustados se quedan en privado con el dueño.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#090E1A] border border-slate-800 space-y-2 print-card">
              <h4 className="font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>"No tengo tiempo para administrar otra plataforma."</span>
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Prestigia funciona en piloto automático. El cliente escanea solo, el sistema filtra solo, la alerta te llega al celular solo cuando hay que actuar y la Inteligencia Artificial redacta tus respuestas en 3 segundos con un solo clic.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#090E1A] border border-slate-800 space-y-2 print-card">
              <h4 className="font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>"El costo de inicio de $350.000 COP se me sale de presupuesto."</span>
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Diseñar una página web moderna y configurar Google Maps con una agencia externa cuesta más de $1.400.000 COP. Con Prestigia tienes un 50% de descuento ($350.000 COP) si alcanzas uno de los 5 cupos de tu nicho. Y mejor aún: <strong>si tomas el plan anual de Pro o Élite, ese montaje te queda 100% BONIFICADO ($0 COP).</strong>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#090E1A] border border-slate-800 space-y-2 print-card">
              <h4 className="font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>"Tengo varias sedes y no quiero pagar por separado."</span>
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Para marcas y franquicias contamos con el <strong>Plan Élite</strong>: desde $250.000 COP al mes (1 Sede: $250.000 COP / 2 Sedes: $300.000 COP / 3 Sedes: $350.000 COP), con pantalla TV Wallboard para salón, sentimiento IA 360°, subcuentas para encargados con PIN y conmutador multi-sede centralizado.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#090E1A] border border-slate-800 space-y-2 print-card">
              <h4 className="font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>"¿Tengo que firmar contratos con permanencia mínima?"</span>
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Ninguna. El servicio se renueva mes a mes. Puedes cancelar o cambiar de plan cuando quieras sin penalidades ni cláusulas de retención. Estamos tan seguros de los resultados que el servicio habla por sí solo.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#090E1A] border border-slate-800 space-y-2 print-card">
              <h4 className="font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>"¿Cómo se instala en mi negocio?"</span>
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Te entregamos los códigos QR listos para imprimir en habladores de acrílico o stickers para mesas, barras y recibos de pago. Tu personal no necesita capacitaciones complicadas: el sistema corre en cualquier celular o computador.
              </p>
            </div>
          </div>
        </section>

        {/* 7. FOOTER DE CIERRE Y CALL TO ACTION */}
        <section className="text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#0e1627] to-[#070b16] border border-amber-500/40 space-y-6 shadow-2xl print-card">
          <div className="flex items-center justify-center mx-auto">
            <PrestigiaIcon className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_0_30px_rgba(99,102,241,0.4)]" />
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Protege tu Negocio Hoy Mismo
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              No esperes a que caiga la próxima mala reseña de 1 estrella. Activa el blindaje Prestigia en menos de 24 horas.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleAdvisorContact('Asesoría Comercial Senior')}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-slate-950" />
              <span>Contactar al Asesor que te entregó este Dossier</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm transition active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Descargar Dossier en PDF</span>
            </button>
          </div>

          {/* Aviso Explícito de Asignación por Asesor con Candado */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm max-w-xl mx-auto flex items-start gap-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <span className="font-bold text-white block">Atención Personalizada & Reserva de Cupos:</span>
              <p className="text-slate-300 text-xs leading-relaxed">
                Para postular tu negocio a uno de los 5 Cupos de Fundador o activar tu suscripción, <strong>por favor comunícate directamente con el asesor comercial que te compartió este enlace o documento PDF</strong>. Él gestionará tu cupo preferencial y activación inmediata.
              </p>
            </div>
          </div>

          {/* Sello de Respaldo Corporativo Internacional */}
          <div className="pt-8 border-t border-slate-800/80 max-w-3xl mx-auto">
            <div className="p-6 rounded-2xl bg-[#060913]/90 border border-cyan-500/25 flex flex-col md:flex-row items-center justify-between gap-6 text-left shadow-lg">
              <div className="shrink-0 flex items-center justify-center">
                <TechnologicalSolutionsLogo className="h-10" showText={true} />
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <p className="font-bold text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Infraestructura Empresarial y Respaldo Global</span>
                </p>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Prestigia es desarrollado, alojado y monitoreado bajo los estándares de alta disponibilidad de <strong className="text-slate-200">Technological Solutions Software</strong>. Cifrado militar TLS/AES-256, 99.98% SLA de operatividad garantizada y soporte técnico corporativo B2B.
                </p>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-6">
              Prestigia &copy; 2026 &bull; Un producto oficial de <strong className="text-slate-400">Technological Solutions Software</strong>. Todos los derechos reservados.
            </div>
          </div>
        </section>

      </main>

      {/* MODAL DE CONTACTO CON ASESOR (CANDADO DE SEGURIDAD) */}
      {showAdvisorNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#0c1424] border-2 border-amber-500/50 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">Canal de Activación Exclusivo</h3>
              <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                {activePlanInquiry ? `Solicitud: ${activePlanInquiry}` : 'Atención Asignada por Asesor'}
              </p>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Para garantizar la reserva de uno de los <strong>5 Cupos de Fundador</strong> y verificar la disponibilidad de tu categoría comercial, <strong>por favor comunícate directamente con el asesor comercial autorizado que te entregó este enlace o documento PDF</strong>.
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              🔒 <em>Línea corporativa en fase de asignación de asesores. Tu asesor personal coordinará tu montaje y activación técnica.</em>
            </div>
            <button
              onClick={() => setShowAdvisorNotice(false)}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition active:scale-95 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              Entendido, Contactaré a mi Asesor
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
