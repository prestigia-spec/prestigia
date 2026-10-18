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
} from 'lucide-react';
import { PRESTIGIA_NICHES } from '@/lib/types';

export default function HomePage() {
  // Lead Capture Form State
  const [leadForm, setLeadForm] = useState({
    fullName: '',
    businessName: '',
    category: PRESTIGIA_NICHES[0].label,
    phone: '',
    city: 'Bogotá',
    branchCount: '1',
  });
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  // Interactive Demo Simulator State
  const [simulatedRating, setSimulatedRating] = useState<number | null>(null);

  // Silent Analytics Tracking
  useEffect(() => {
    // Record pageview with device & geo detection
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

  // Submit Lead Form
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
        body: JSON.stringify(leadForm),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setLeadSuccess(true);
        trackAction('lead_submitted_success');
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch {}
      } else {
        setLeadError(data.error || 'Ocurrió un error al procesar tu solicitud.');
      }
    } catch (err) {
      setLeadError('Error de conexión. Intenta nuevamente.');
    } finally {
      setSubmittingLead(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-amber-500/20 selection:text-amber-300 font-sans relative overflow-x-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-amber-500/5 blur-3xl pointer-events-none" />

      {/* ============================================================== */}
      {/* 1. TOP NAVBAR */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#07090E]/85 border-b border-slate-800/80 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-amber-500 flex items-center justify-center p-2 shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition">
              <PrestigiaIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-widest text-white flex items-center gap-1.5">
                PRESTIGIA
              </span>
              <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider hidden sm:block">
                Blindaje Reputacional & 5★
              </p>
            </div>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#como-funciona" className="hover:text-amber-400 transition">Cómo Funciona</a>
            <a href="#testimonios" className="hover:text-amber-400 transition">Casos de Éxito & ROI</a>
            <a href="#planes" className="hover:text-amber-400 transition">Planes</a>
            <a href="#auditoria" className="hover:text-amber-400 transition">Auditoría Gratis</a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/portal"
              onClick={() => trackAction('click_portal_from_navbar')}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Ingresar al Sistema</span>
            </Link>

            <a
              href="#auditoria"
              onClick={() => trackAction('click_cta_audit_navbar')}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer hidden sm:flex items-center gap-1"
            >
              <span>Solicitar Auditoría</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. HERO SECTION */}
      {/* ============================================================== */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-8 max-w-7xl mx-auto text-center">
        {/* Security Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-wide uppercase mb-6 animate-in fade-in">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Blindaje Reputacional & Conversión Google Maps para Comercios</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Protege tu reputación, <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
            intercepta quejas en sala
          </span>{' '}
          y multiplica tus reseñas 5★
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto mt-6 leading-relaxed font-normal">
          El sistema inteligente que filtra opiniones en tiempo real: los clientes felices van directo a{' '}
          <strong className="text-white font-semibold">Google Maps</strong> y las inconformidades se resuelven de forma privada en{' '}
          <strong className="text-amber-400 font-semibold">&lt; 10 segundos</strong> antes de que salgan a internet.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8 max-w-md mx-auto">
          <a
            href="#auditoria"
            onClick={() => trackAction('click_hero_primary_cta')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Solicitar Auditoría Gratuita</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#demo"
            onClick={() => trackAction('click_hero_demo_cta')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700/80 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-indigo-400" />
            <span>Ver Demo en Vivo</span>
          </a>
        </div>

        {/* Key Metrics Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-14 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-[#0E121B] border border-slate-800 shadow-lg text-center">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">+1.2★</span>
            <p className="text-xs text-slate-400 mt-0.5">Subida Promedio en Google Maps</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#0E121B] border border-slate-800 shadow-lg text-center">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">98.6%</span>
            <p className="text-xs text-slate-400 mt-0.5">Quejas Silenciosas Interceptadas</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#0E121B] border border-slate-800 shadow-lg text-center">
            <span className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">&lt; 10s</span>
            <p className="text-xs text-slate-400 mt-0.5">Tiempo de Alerta al Gerente</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#0E121B] border border-slate-800 shadow-lg text-center">
            <span className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">+$18M</span>
            <p className="text-xs text-slate-400 mt-0.5">COP Retenidos en Clientes Fieles</p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. CÓMO FUNCIONA: EL FILTRO INTELIGENTE BIFURCADO */}
      {/* ============================================================== */}
      <section id="como-funciona" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Arquitectura del Blindaje
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
            El Filtro Quirúrgico de Dos Vías
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            El 95% de los clientes insatisfechos nunca se quejan en persona; simplemente no vuelven o dejan una reseña de 1 estrella en Google Maps. Prestigia cambia las reglas del juego:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Camino A: Experiencia 4 y 5 Estrellas */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-950/20 via-[#0D1424] to-[#0A0F1D] border border-emerald-500/30 shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-black mb-4">
              <Star className="w-6 h-6 fill-emerald-400 text-emerald-400" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
              Flujo Positivo (4★ y 5★)
            </span>
            <h3 className="text-lg font-bold text-white mt-2">Multiplicación en Google Maps</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              El cliente satisfecho es redirigido con 1 clic al enlace oficial de tu ficha de Google Maps para publicar su reseña y a tus canales de Instagram/TikTok. Además, participa en sorteos exclusivos para premiar su fidelidad.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Aumento masivo del ranking local en Google</span>
            </div>
          </div>

          {/* Camino B: Experiencia 1 a 3 Estrellas */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-rose-950/20 via-[#0D1424] to-[#0A0F1D] border border-rose-500/30 shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center font-black mb-4">
              <ShieldCheck className="w-6 h-6 text-rose-400" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-bold uppercase tracking-wider">
              Flujo Crítico (1★ a 3★)
            </span>
            <h3 className="text-lg font-bold text-white mt-2">Bloqueo Seguro & Alerta Inmediata</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              El sistema <strong className="text-white">bloquea por completo la salida a Google Maps</strong>. La queja se captura de forma 100% privada y despacha una alerta sonora y visual al gerente de turno para resolver la inconformidad en sala antes de que el cliente se retire.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-rose-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>0% Daño público a la reputación comercial</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. DEMO INTERACTIVO EN PANTALLA */}
      {/* ============================================================== */}
      <section id="demo" className="py-16 px-4 sm:px-8 max-w-4xl mx-auto text-center">
        <div className="p-7 sm:p-10 rounded-3xl bg-[#0D1424] border border-indigo-500/30 shadow-2xl relative overflow-hidden">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Simulador en Vivo
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
            Prueba cómo reacciona el sistema
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto">
            Haz clic en una estrella para experimentar la bifurcación tal como la viven tus clientes:
          </p>

          {/* Star selector */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => {
                  setSimulatedRating(star);
                  trackAction(`simulated_rating_${star}`);
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  simulatedRating === star
                    ? 'bg-amber-500/20 border-amber-400 scale-110 shadow-lg shadow-amber-500/20'
                    : 'bg-[#141A26] border-slate-700 hover:border-slate-500'
                }`}
              >
                <Star
                  className={`w-7 h-7 sm:w-9 sm:h-9 ${
                    simulatedRating && star <= simulatedRating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-500 hover:text-amber-400'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Simulation Feedback Message */}
          {simulatedRating && (
            <div className="mt-6 p-4 rounded-2xl bg-[#141A26] border border-slate-700 max-w-md mx-auto text-left animate-in fade-in">
              {simulatedRating >= 4 ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Experiencia Excelente ({simulatedRating}★)</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    🟢 <strong>Acción del Sistema:</strong> Se abre automáticamente tu ficha de Google Maps para que el cliente confirme su reseña pública de 5 estrellas y se le invita al sorteo VIP.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Alerta de Contención Privada ({simulatedRating}★)</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    🛡️ <strong>Acción del Sistema:</strong> Google Maps permanece oculto. Se despliega una disculpa cordial, se captura el WhatsApp del cliente y suena la alarma en el Portal del Gerente para conciliar en sala.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. CASOS DE ÉXITO & TESTIMONIOS REALES CON ROI */}
      {/* ============================================================== */}
      <section id="testimonios" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Resultados Irrefutables
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
            Casos de Éxito de Marcas Afiliadas
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Marcas reales que blindaron su reputación comercial y convirtieron clientes inconformes en promotores leales:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Caso 1: La Burguesía Artesanal */}
          <div className="p-6 rounded-3xl bg-[#0D1424] border border-slate-800 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-2xl">🍔</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Gastrobar Gourmet • Bogotá
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-3">La Burguesía Artesanal</h3>
              <p className="text-xs text-slate-300 mt-2 italic leading-relaxed">
                &ldquo;Prestigia interceptó más de 120 quejas privadas en mesa antes de que salieran a Google Maps. Subimos de 3.8★ a 4.9★ en 5 meses y salvamos más de $18 millones en clientes que se iban a fugar.&rdquo;
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Carlos Gómez • Dueño</span>
              <span className="text-emerald-400 font-bold font-mono">+1.1★ Neto</span>
            </div>
          </div>

          {/* Caso 2: Clínica Odontológica San Rafael */}
          <div className="p-6 rounded-3xl bg-[#0D1424] border border-slate-800 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-2xl">🦷</span>
                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  Salud & Estética Dental
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-3">Odontología San Rafael</h3>
              <p className="text-xs text-slate-300 mt-2 italic leading-relaxed">
                &ldquo;En el sector salud una mala reseña es letal. Con Prestigia cualquier inconformidad en recepción o cita se resuelve en minutos. Hoy somos la clínica con mejor calificación de la zona.&rdquo;
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Dra. Sandra Martínez</span>
              <span className="text-emerald-400 font-bold font-mono">4.9★ Google</span>
            </div>
          </div>

          {/* Caso 3: AutoSpa Premier */}
          <div className="p-6 rounded-3xl bg-[#0D1424] border border-slate-800 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-2xl">🚗</span>
                <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  Automotriz & Detailing
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-3">AutoSpa Premier</h3>
              <p className="text-xs text-slate-300 mt-2 italic leading-relaxed">
                &ldquo;El módulo de sorteos y captura con Habeas Data nos permitió crear una base de datos de más de 400 clientes en solo 60 días. Cada semana lanzamos promociones y llenamos la agenda.&rdquo;
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Andrés Morales • Gerente</span>
              <span className="text-purple-400 font-bold font-mono">400+ Leads</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. PLANES COMERCIALES TRANSPARENTES */}
      {/* ============================================================== */}
      <section id="planes" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Inversión Inteligente
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
            Planes Diseñados para Crecer
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Sin contratos de permanencia. Elige el plan que mejor se adapte al tamaño de tu operación:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Plan Independiente */}
          <div className="p-6 rounded-3xl bg-[#0D1424] border border-slate-800 flex flex-col justify-between shadow-lg">
            <div>
              <span className="text-[11px] font-bold uppercase text-emerald-400">Para Profesionales</span>
              <h3 className="text-xl font-black text-white mt-1">Independiente</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white font-mono">$49.000</span>
                <span className="text-xs text-slate-400">COP/mes (~$19 USD)</span>
              </div>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-300 text-left">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> 1 Sede o consultorio</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Filtro seguro 5★ y quejas privadas</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Smart QR digital descargable</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Acceso al Portal del Propietario</li>
              </ul>
            </div>
            <a
              href="#auditoria"
              onClick={() => trackAction('click_plan_independiente')}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition"
            >
              Comenzar con Independiente
            </a>
          </div>

          {/* Plan Pro (Destacado) */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#141C30] to-[#0D1424] border-2 border-amber-500 shadow-2xl relative flex flex-col justify-between">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
              Más Popular • Alta Demanda
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-amber-400">Puntos de Venta</span>
              <h3 className="text-xl font-black text-white mt-1">Plan Pro</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white font-mono">$120.000</span>
                <span className="text-xs text-slate-400">COP/mes (~$49 USD)</span>
              </div>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-200 text-left">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> 1 Sede con multi-pantallas (Caja/Mesa)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> Alertas sonoras en tiempo real</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> Módulo de Sorteos & CRM Habeas Data</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> Reportes de turno y equipo de meseros</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> Soporte prioritario WhatsApp</li>
              </ul>
            </div>
            <a
              href="#auditoria"
              onClick={() => trackAction('click_plan_pro')}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs text-center shadow-lg shadow-amber-500/20 transition active:scale-95"
            >
              Elegir Plan Pro
            </a>
          </div>

          {/* Plan Élite */}
          <div className="p-6 rounded-3xl bg-[#0D1424] border border-slate-800 flex flex-col justify-between shadow-lg">
            <div>
              <span className="text-[11px] font-bold uppercase text-purple-400">Cadenas & Franquicias</span>
              <h3 className="text-xl font-black text-white mt-1">Plan Élite</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white font-mono">$290.000</span>
                <span className="text-xs text-slate-400">COP/mes (~$110 USD)</span>
              </div>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-300 text-left">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> Hasta 3 Sedes físicas incluidas</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> Múltiples Encargados de turno independientes</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> IA de Análisis de Sentimiento 360</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> Live TV Wallboard para cocina / sala</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> Asesor ejecutivo dedicado</li>
              </ul>
            </div>
            <a
              href="#auditoria"
              onClick={() => trackAction('click_plan_elite')}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition"
            >
              Comenzar con Élite
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. LEAD MAGNET FORM (SOLICITAR AUDITORÍA GRATUITA) */}
      {/* ============================================================== */}
      <section id="auditoria" className="py-20 px-4 sm:px-8 max-w-4xl mx-auto border-t border-slate-800/80">
        <div className="bg-gradient-to-br from-[#101728] via-[#0E1322] to-[#0A0E18] border-2 border-amber-500/40 rounded-3xl p-7 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wider uppercase">
              <Zap className="w-3.5 h-3.5" />
              Diagnóstico Express Sin Costo
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              ¿Cuánto dinero estás perdiendo por quejas silenciosas?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Déjanos los datos de tu negocio y te entregaremos una <strong className="text-white">Auditoría Quirúrgica de Google Maps</strong> con proyección de retorno de inversión personalizada por WhatsApp en minutos.
            </p>
          </div>

          {/* Form Content */}
          {leadSuccess ? (
            <div className="mt-8 p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">¡Solicitud Recibida con Éxito!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Nuestro equipo comercial ya está analizando tu negocio (<strong className="text-white">{leadForm.businessName}</strong>). En breve te escribiremos a tu WhatsApp con tu diagnóstico.
              </p>
              <div className="pt-2">
                <a
                  href={`https://wa.me/573001234567?text=${encodeURIComponent(
                    `Hola Prestigia, acabo de registrar mi negocio ${leadForm.businessName} para la auditoría gratuita de reputación.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Abrir Chat Directo en WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="mt-8 space-y-4 max-w-xl mx-auto text-left">
              {leadError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{leadError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre Titular */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tu Nombre y Apellido *
                  </label>
                  <input
                    type="text"
                    required
                    value={leadForm.fullName}
                    onChange={(e) => setLeadForm({ ...leadForm, fullName: e.target.value })}
                    placeholder="Ej: Carlos Gómez"
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 text-white text-xs rounded-xl px-4 py-3 outline-none"
                  />
                </div>

                {/* Nombre Comercial */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nombre de tu Negocio / Marca *
                  </label>
                  <input
                    type="text"
                    required
                    value={leadForm.businessName}
                    onChange={(e) => setLeadForm({ ...leadForm, businessName: e.target.value })}
                    placeholder="Ej: La Burguesía Artesanal"
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 text-white text-xs rounded-xl px-4 py-3 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nicho Comercial */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nicho / Sector Comercial *
                  </label>
                  <select
                    value={leadForm.category}
                    onChange={(e) => setLeadForm({ ...leadForm, category: e.target.value })}
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 text-white text-xs rounded-xl px-4 py-3 outline-none cursor-pointer"
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
                    Ciudad / Municipio *
                  </label>
                  <input
                    type="text"
                    required
                    value={leadForm.city}
                    onChange={(e) => setLeadForm({ ...leadForm, city: e.target.value })}
                    placeholder="Ej: Bogotá, Medellín, Cali..."
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 text-white text-xs rounded-xl px-4 py-3 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Número de WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    placeholder="+57 300 123 4567"
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 text-white text-xs rounded-xl px-4 py-3 outline-none font-mono"
                  />
                </div>

                {/* Número de Sedes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ¿Cuántas Sedes Físicas Operas?
                  </label>
                  <select
                    value={leadForm.branchCount}
                    onChange={(e) => setLeadForm({ ...leadForm, branchCount: e.target.value })}
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 text-white text-xs rounded-xl px-4 py-3 outline-none cursor-pointer"
                  >
                    <option value="1">1 Sede (Punto Único)</option>
                    <option value="2-3">2 a 3 Sedes</option>
                    <option value="4-10">4 a 10 Sedes (Cadena)</option>
                    <option value="10+">Más de 10 Sedes (Holding)</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submittingLead}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submittingLead ? (
                    <span>Procesando solicitud...</span>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-slate-950" />
                      <span>SOLICITAR MI AUDITORÍA DE REPUTACIÓN GRATUITA</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-slate-500 text-center">
                🔒 Tus datos están protegidos bajo estricto secreto profesional y ley de Habeas Data. Sin spam ni llamadas molestas.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. FOOTER CORPORATIVO */}
      {/* ============================================================== */}
      <footer className="border-t border-slate-800/80 py-10 px-4 sm:px-8 bg-[#05070B] text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <PrestigiaIcon className="w-7 h-7 text-white" />
            <div>
              <p className="text-white font-extrabold tracking-wider">PRESTIGIA TECHNOLOGIES</p>
              <p className="text-[10px] text-slate-500">Plataforma de Blindaje Reputacional & Conversión Local 5★</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <Link href="/portal" className="text-slate-300 hover:text-white transition flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Portal de Clientes</span>
            </Link>
            <a
              href="https://wa.me/573001234567?text=Hola%20Prestigia,%20requiero%20información%20comercial"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white transition flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Soporte WhatsApp</span>
            </a>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">Colombia • México • Estados Unidos • España</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-900 text-[10px] text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Prestigia. Todos los derechos reservados.</p>
          <p>Cumplimiento RGPD, Ley 1581 Habeas Data & Normativas de Reseñas de Google Maps.</p>
        </div>
      </footer>
    </div>
  );
}
