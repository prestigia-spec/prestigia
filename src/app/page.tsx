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
} from 'lucide-react';
import { PRESTIGIA_NICHES } from '@/lib/types';

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

  // Interactive Demo Simulator State
  const [simulatedRating, setSimulatedRating] = useState<number | null>(5);

  // Silent Analytics Tracking
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
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
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

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-amber-500/20 selection:text-amber-300 font-sans relative overflow-x-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="absolute top-[1800px] left-0 w-[600px] h-[600px] bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* ============================================================== */}
      {/* 1. TOP NAVBAR */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#07090E]/90 border-b border-slate-800/80 px-4 sm:px-8 py-3.5 transition-all">
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
                Blindaje Reputacional & Ventas 5★
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#ventajas" className="hover:text-amber-400 transition">Ventajas para tu Negocio</a>
            <a href="#como-funciona" className="hover:text-amber-400 transition">Cómo Funciona</a>
            <a href="#simulador" className="hover:text-amber-400 transition">Simulador en Vivo</a>
            <a href="#testimonios" className="hover:text-amber-400 transition">Casos Reales</a>
            <a href="#a-medida" className="hover:text-amber-400 transition">Propuesta a Medida</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/portal"
              onClick={() => trackAction('click_portal_from_navbar')}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Portal Clientes</span>
            </Link>

            <a
              href="#agendar"
              onClick={() => trackAction('click_agendar_navbar')}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer hidden sm:flex items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Agendar Llamada</span>
            </a>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. HERO SECTION — VENTA INMEDIATA Y TRANSFORMACIÓN */}
      {/* ============================================================== */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-8 max-w-7xl mx-auto text-center">
        {/* Elite Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide uppercase mb-6 animate-fade-in shadow-lg shadow-amber-500/5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>La Suite de Crecimiento & Blindaje Reputacional para Comercios Exitosos</span>
        </div>

        {/* Main High-Ticket Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight max-w-5xl mx-auto leading-[1.12]">
          Multiplica tus clientes locales, <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
            frena quejas en privado
          </span>{' '}
          y convierte tus 5★ en ventas imparables
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto mt-6 leading-relaxed font-normal">
          El 92% de los consumidores eligen un negocio por su calificación en <strong className="text-white font-semibold">Google Maps</strong>. 
          Prestigia intercepta inconformidades de clientes en <strong className="text-amber-400 font-semibold">&lt; 10 segundos</strong> antes de que salgan a internet, 
          catapulta las reseñas positivas al Top de tu zona y crea una <strong className="text-emerald-400 font-semibold">base de datos propia</strong> de clientes leales.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-9 max-w-lg mx-auto">
          <a
            href="#agendar"
            onClick={() => trackAction('click_hero_agendar')}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-slate-950" />
            <span>Agendar Llamada Estratégica VIP</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#simulador"
            onClick={() => trackAction('click_hero_simulador')}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700/80 transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <QrCode className="w-4 h-4 text-indigo-400" />
            <span>Probar Simulador en Vivo</span>
          </a>
        </div>

        {/* Value Proof Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-14 max-w-5xl mx-auto">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0E121B] border border-slate-800 shadow-lg text-center">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">+1.2★</span>
            <p className="text-xs text-slate-300 font-semibold mt-1">Subida Promedio en Google Maps</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Top 3 en búsquedas locales</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0E121B] border border-slate-800 shadow-lg text-center">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">98.6%</span>
            <p className="text-xs text-slate-300 font-semibold mt-1">Inconformidades Contenidas</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Cero daño público a la marca</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0E121B] border border-slate-800 shadow-lg text-center">
            <span className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">100%</span>
            <p className="text-xs text-slate-300 font-semibold mt-1">Base de Datos Propia</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Clientes captados con Habeas Data</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0E121B] border border-slate-800 shadow-lg text-center">
            <span className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">&gt; 3.8x</span>
            <p className="text-xs text-slate-300 font-semibold mt-1">Retorno de Inversión (ROI)</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Más visitas, reservas y ventas</p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. EL PROBLEMA REAL: LA FUGA INVISIBLE DE CLIENTES */}
      {/* ============================================================== */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
            La Realidad del Mercado Actual
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
            El 95% de los clientes insatisfechos nunca se quejan en caja.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Pagan la cuenta, se van en silencio y destruyen la reputación de tu negocio con una reseña de 1 estrella en Google Maps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-3xl bg-[#0D1424] border border-rose-500/20 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-lg">
              ❌
            </div>
            <h3 className="text-base font-bold text-white">Clientes que se van a la competencia</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Un cliente nuevo busca en su celular tu producto o servicio. Si ve una calificación menor a 4.5★ o quejas sin resolver, no entra y se va al negocio de al lado.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D1424] border border-rose-500/20 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-lg">
              📉
            </div>
            <h3 className="text-base font-bold text-white">Depender de pagar publicidad cara</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pagar anuncios en Instagram o Facebook cada día cuesta más y no genera lealtad. Las reseñas orgánicas de 5★ en Google Maps te traen clientes todos los días gratis.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0D1424] border border-rose-500/20 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-lg">
              🕵️
            </div>
            <h3 className="text-base font-bold text-white">Clientes anónimos que no vuelven</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Atiendes a cientos de personas al mes pero no tienes sus números de WhatsApp para escribirles, invitarlos a volver o lanzarles promociones exclusivas.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. LAS VENTAJAS PRESTIGIA: QUÉ HACE EL SISTEMA POR TU NEGOCIO */}
      {/* ============================================================== */}
      <section id="ventajas" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20">
            El Arma Comercial de tu Marca
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
            Lo que Prestigia logra por tus ventas desde la primera semana
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            No es solo software; es un sistema integral de conversión, lealtad y protección operativa para tu negocio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Ventaja 1 */}
          <div className="p-6 rounded-3xl bg-[#0D1424] border border-slate-800 hover:border-amber-500/40 transition-all shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-white">Despegue 5★ en Google Maps</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Tus clientes felices escanean el Smart QR en mesa o recepción y en 1 solo clic confirman su reseña de 5 estrellas en tu perfil oficial de Google Maps.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-amber-400 font-semibold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Más visitas y reservas diarias</span>
            </div>
          </div>

          {/* Ventaja 2 */}
          <div className="p-6 rounded-3xl bg-[#0D1424] border border-slate-800 hover:border-rose-500/40 transition-all shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-base font-bold text-white">Blindaje Privado contra Quejas</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Si un cliente califica con 1, 2 o 3 estrellas, Google Maps queda 100% bloqueado. La queja te llega en privado para que la resuelvas antes de que el cliente salga del local.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-rose-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>0% Daño público a tu reputación</span>
            </div>
          </div>

          {/* Ventaja 3 */}
          <div className="p-6 rounded-3xl bg-[#0D1424] border border-slate-800 hover:border-emerald-500/40 transition-all shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white">Big Data Propio & Sorteos VIP</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                A través de sorteos mensuales de fidelización, cada cliente registra su nombre y WhatsApp bajo la Ley de Habeas Data. Tienes tu propia base de datos comercial sin intermediarios.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Cientos de clientes registrados</span>
            </div>
          </div>

          {/* Ventaja 4 */}
          <div className="p-6 rounded-3xl bg-[#0D1424] border border-slate-800 hover:border-purple-500/40 transition-all shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-base font-bold text-white">Sentimiento 360 IA & Wallboard</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Inteligencia Artificial que audita qué meseros o colaboradores atienden mejor, mientras tus clientes ven en una pantalla TV en vivo cómo celebras las 5 estrellas en sala.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-purple-400 font-semibold flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5" />
              <span>Motivación y control operativo</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. CÓMO FUNCIONA EL FILTRO INTELIGENTE BIFURCADO */}
      {/* ============================================================== */}
      <section id="como-funciona" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Arquitectura del Blindaje
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
            El Embudo Quirúrgico de Dos Vías
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            El cliente escanea el Smart QR con la cámara de su celular sin descargar ninguna aplicación. Esto es lo que sucede:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Camino A: Experiencia 4 y 5 Estrellas */}
          <div className="p-7 rounded-3xl bg-gradient-to-br from-emerald-950/20 via-[#0D1424] to-[#0A0F1D] border border-emerald-500/30 shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-black mb-4">
              <Star className="w-6 h-6 fill-emerald-400 text-emerald-400" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
              Flujo Positivo (4★ y 5★)
            </span>
            <h3 className="text-lg font-bold text-white mt-2">Multiplicación Pública en Google Maps</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              El cliente satisfecho es enviado directamente al enlace de tu ficha de Google Maps para publicar su opinión con 1 toque. También puede participar en el sorteo mensual y seguir tus redes.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Google premia tu negocio posicionándote de primero</span>
            </div>
          </div>

          {/* Camino B: Experiencia 1 a 3 Estrellas */}
          <div className="p-7 rounded-3xl bg-gradient-to-br from-rose-950/20 via-[#0D1424] to-[#0A0F1D] border border-rose-500/30 shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center font-black mb-4">
              <ShieldCheck className="w-6 h-6 text-rose-400" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-bold uppercase tracking-wider">
              Flujo Crítico (1★ a 3★)
            </span>
            <h3 className="text-lg font-bold text-white mt-2">Bloqueo Preventivo & Solución en Sala</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Google Maps nunca aparece. El cliente encuentra una ventana cordial de desahogo privado. El sistema captura su inconformidad y te notifica de inmediato para resolverla antes de que se retire.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-rose-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Conviertes un cliente enojado en un cliente agradecido</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. SIMULADOR INTERACTIVO DEL SMART QR */}
      {/* ============================================================== */}
      <section id="simulador" className="py-16 px-4 sm:px-8 max-w-4xl mx-auto text-center">
        <div className="p-7 sm:p-10 rounded-3xl bg-[#0D1424] border border-indigo-500/30 shadow-2xl relative overflow-hidden">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Simulador Interactivo
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
            Experimenta cómo reacciona el sistema
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto">
            Haz clic en una estrella para simular lo que ve un cliente al calificar tu negocio:
          </p>

          {/* Star Buttons */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => {
                  setSimulatedRating(star);
                  trackAction(`simulated_rating_${star}`);
                }}
                className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer ${
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

          {/* Simulation Feedback Card */}
          {simulatedRating && (
            <div className="mt-6 p-5 rounded-2xl bg-[#141A26] border border-slate-700 max-w-md mx-auto text-left animate-fade-in shadow-lg">
              {simulatedRating >= 4 ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Experiencia 5★ Detectada ({simulatedRating} Estrellas)</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    🟢 <strong>Acción Prestigia:</strong> Se activa el redireccionamiento inmediato a tu ficha oficial de Google Maps con las 5 estrellas pre-seleccionadas y se invita al cliente al sorteo VIP.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Contención Privada Activada ({simulatedRating} Estrellas)</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    🛡️ <strong>Acción Prestigia:</strong> Google Maps queda 100% oculto. El cliente ve una ventana de atención cordial donde expresa su molestia en privado, protegiendo tu negocio de daños públicos.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. CASOS DE ÉXITO REALES CON RESULTADOS */}
      {/* ============================================================== */}
      <section id="testimonios" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Casos de Éxito Reales
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
            Marcas que transformaron su reputación en ingresos
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Resultados comprobados en operaciones reales del mercado:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Caso 1: La Burguesía */}
          <div className="p-6 rounded-3xl bg-[#0D1424] border border-slate-800 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-2xl">🍔</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Gastrobar Gourmet • 2 Sedes
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-3">La Burguesía Artesanal</h3>
              <p className="text-xs text-slate-300 mt-2 italic leading-relaxed">
                &ldquo;Prestigia interceptó más de 120 quejas privadas en mesa antes de que salieran a Google Maps. Subimos de 3.8★ a 4.9★ en 5 meses y blindamos la facturación de nuestros dos restaurantes.&rdquo;
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Carlos Gómez • Titular</span>
              <span className="text-emerald-400 font-bold font-mono">4.9★ Google Maps</span>
            </div>
          </div>

          {/* Caso 2: Dr. Carlos Mendoza */}
          <div className="p-6 rounded-3xl bg-[#0D1424] border border-slate-800 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-2xl">🦷</span>
                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  Salud & Consulta Especializada
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-3">Dr. Carlos Mendoza</h3>
              <p className="text-xs text-slate-300 mt-2 italic leading-relaxed">
                &ldquo;En el sector salud una mala reseña es letal para conseguir nuevos pacientes. Con el Smart QR en recepción mis pacientes satisfechos me dejan 5 estrellas y tripliqué las citas agendadas.&rdquo;
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Dr. Carlos Mendoza</span>
              <span className="text-blue-400 font-bold font-mono">+3x Citas Nuevas</span>
            </div>
          </div>

          {/* Caso 3: AutoElite */}
          <div className="p-6 rounded-3xl bg-[#0D1424] border border-slate-800 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-2xl">🚗</span>
                <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  Automotriz & Detailing de Lujo
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-3">AutoElite Taller & Detailing</h3>
              <p className="text-xs text-slate-300 mt-2 italic leading-relaxed">
                &ldquo;El módulo de sorteos y captura con Habeas Data nos permitió crear una base de datos de más de 400 clientes recurrentes. Cada mes llenamos la agenda con promociones directas por WhatsApp.&rdquo;
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Mauricio Varela • Gerente</span>
              <span className="text-purple-400 font-bold font-mono">400+ Clientes en Base</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. MODELO A LA MEDIDA: CERO PRECIOS PÚBLICOS, TRATO EXCLUSIVO */}
      {/* ============================================================== */}
      <section id="a-medida" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
            Consultoría & Traje a la Medida
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-3">
            No vendemos software de catálogo. Diseñamos una solución para tu negocio.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Cada empresa tiene un volumen de clientes, un número de sedes y una dinámica diferente. Hablaremos directamente contigo en una sesión estratégica para estructurar el plan que mejor se ajuste a tu operación y presupuesto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Nivel 1: Punto Único */}
          <div className="p-7 rounded-3xl bg-[#0D1424] border border-slate-800 flex flex-col justify-between shadow-xl hover:border-slate-700 transition">
            <div>
              <span className="text-[11px] font-bold uppercase text-emerald-400 tracking-wider">
                1 Sede / Consultorio / Local
              </span>
              <h3 className="text-xl font-black text-white mt-1">Punto Único</h3>
              <p className="text-xs text-slate-400 mt-2">
                Ideal para profesionales independientes, consultorios médicos o locales comerciales de 1 punto físico.
              </p>
              <div className="mt-5 pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Smart QR digital para sala o recepción</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Contención privada de 1★ a 3★</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Catapulta 5★ directa a Google Maps</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Acceso al Portal del Propietario</div>
              </div>
            </div>
            <a
              href="#agendar"
              onClick={() => {
                setLeadForm((prev) => ({ ...prev, branchCount: '1' }));
                trackAction('click_cotizar_punto_unico');
              }}
              className="mt-6 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition block cursor-pointer"
            >
              Solicitar Propuesta Personalizada
            </a>
          </div>

          {/* Nivel 2: Comercio de Alto Tráfico */}
          <div className="p-7 rounded-3xl bg-gradient-to-b from-[#141C30] to-[#0D1424] border-2 border-amber-500 shadow-2xl relative flex flex-col justify-between">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
              ⭐ Más Solicitado
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-amber-400 tracking-wider">
                Gastrobares, Clínicas & Retail
              </span>
              <h3 className="text-xl font-black text-white mt-1">Alto Rendimiento</h3>
              <p className="text-xs text-slate-300 mt-2">
                Para negocios consolidados con alto tráfico de clientes que requieren captar base de datos y auditar meseros.
              </p>
              <div className="mt-5 pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-200">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> Multi-pantallas (Caja, Mesas, Recepción)</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> Módulo de Sorteos VIP & Big Data Habeas Data</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> Auditoría de personal y meseros en turno</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> Alertas sonoras e instantáneas al encargado</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> Soporte ejecutivo prioritario</div>
              </div>
            </div>
            <a
              href="#agendar"
              onClick={() => {
                setLeadForm((prev) => ({ ...prev, branchCount: '2-3' }));
                trackAction('click_cotizar_alto_rendimiento');
              }}
              className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs text-center shadow-lg shadow-amber-500/20 transition active:scale-95 block cursor-pointer"
            >
              Agendar Sesión Estratégica VIP
            </a>
          </div>

          {/* Nivel 3: Cadenas & Franquicias */}
          <div className="p-7 rounded-3xl bg-[#0D1424] border border-slate-800 flex flex-col justify-between shadow-xl hover:border-slate-700 transition">
            <div>
              <span className="text-[11px] font-bold uppercase text-purple-400 tracking-wider">
                Multi-Sedes & Corporativo
              </span>
              <h3 className="text-xl font-black text-white mt-1">Cadenas & Franquicias</h3>
              <p className="text-xs text-slate-400 mt-2">
                Arquitectura empresarial para holdings, grupos gastronómicos, cadenas hoteleras o marcas con 2 o más sedes.
              </p>
              <div className="mt-5 pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> Multi-Sedes físicas con control centralizado</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> Administradores de turno independientes</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> Sentimiento 360 IA para análisis de patrones</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> Live TV Wallboard en vivo para sala y cocina</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> Asesor ejecutivo comercial dedicado</div>
              </div>
            </div>
            <a
              href="#agendar"
              onClick={() => {
                setLeadForm((prev) => ({ ...prev, branchCount: '4-10' }));
                trackAction('click_cotizar_multi_sede');
              }}
              className="mt-6 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition block cursor-pointer"
            >
              Solicitar Propuesta Multi-Sede
            </a>
          </div>
        </div>

        {/* Corporate Peace of Mind Banner */}
        <div className="mt-12 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white text-xs font-bold">Compromiso de Retorno de Inversión Prestigia</p>
              <p className="text-[11px] text-slate-400">Pactamos tarifas justas y transparentes con proyección de facturación real.</p>
            </div>
          </div>
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shrink-0">
            ⭐ Tarifa Pactada Todo Incluido
          </span>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. FORMULARIO DE AGENDAMIENTO DE LLAMADA ESTRATÉGICA VIP */}
      {/* ============================================================== */}
      <section id="agendar" className="py-20 px-4 sm:px-8 max-w-4xl mx-auto border-t border-slate-800/80">
        <div className="bg-gradient-to-br from-[#101728] via-[#0E1322] to-[#0A0E18] border-2 border-amber-500/40 rounded-3xl p-7 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wider uppercase">
              <Calendar className="w-3.5 h-3.5" />
              Sesión Estratégica 1 a 1 Sin Costo
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Agenda tu llamada estratégica con la dirección de Prestigia
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Revisaremos en vivo el estado actual de tu negocio en Google Maps, calcularemos cuántos clientes estás perdiendo y te presentaremos la <strong className="text-white">propuesta exacta adaptada a tu presupuesto</strong>.
            </p>
          </div>

          {/* Form Content */}
          {leadSuccess ? (
            <div className="mt-8 p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-white">¡Llamada Agendada Exitosamente!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Hemos recibido tu solicitud para <strong className="text-white">{leadForm.businessName}</strong>. 
                El equipo directivo de Prestigia te contactará en el horario seleccionado (<strong className="text-amber-400">{leadForm.preferredTime}</strong>) con el diagnóstico de tu negocio listo.
              </p>
              <div className="pt-3">
                <a
                  href={`https://wa.me/573172606093?text=${encodeURIComponent(
                    `Hola, acabo de agendar mi llamada estratégica en Prestigia para mi negocio *${leadForm.businessName}* (${leadForm.fullName}). Me gustaría confirmar el horario para revisar el diagnóstico.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirmar por WhatsApp Inmediato</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="mt-8 space-y-4 max-w-xl mx-auto text-left">
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
                    Tu Nombre y Apellido *
                  </label>
                  <input
                    type="text"
                    required
                    value={leadForm.fullName}
                    onChange={(e) => setLeadForm({ ...leadForm, fullName: e.target.value })}
                    placeholder="Ej: Carlos Gómez"
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 text-white text-xs rounded-xl px-4 py-3 outline-none transition"
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
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 text-white text-xs rounded-xl px-4 py-3 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nicho Comercial */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nicho / Sector de tu Negocio *
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
                    Ciudad / Ubicación *
                  </label>
                  <input
                    type="text"
                    required
                    value={leadForm.city}
                    onChange={(e) => setLeadForm({ ...leadForm, city: e.target.value })}
                    placeholder="Ej: Bogotá, Medellín, Cali, CDMX..."
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 text-white text-xs rounded-xl px-4 py-3 outline-none transition"
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
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 text-white text-xs rounded-xl px-4 py-3 outline-none font-mono transition"
                  />
                </div>

                {/* Número de Sedes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ¿Cuántas Sedes Físicas Tienes?
                  </label>
                  <select
                    value={leadForm.branchCount}
                    onChange={(e) => setLeadForm({ ...leadForm, branchCount: e.target.value })}
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 text-white text-xs rounded-xl px-4 py-3 outline-none cursor-pointer transition"
                  >
                    <option value="1">1 Sede (Punto Único)</option>
                    <option value="2-3">2 a 3 Sedes</option>
                    <option value="4-10">4 a 10 Sedes (Cadena)</option>
                    <option value="10+">Más de 10 Sedes (Holding)</option>
                  </select>
                </div>
              </div>

              {/* Fila Especial: Horario de Llamada & Meta Principal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Horario Preferido para la Llamada */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Horario Preferido para la Llamada</span>
                  </label>
                  <select
                    value={leadForm.preferredTime}
                    onChange={(e) => setLeadForm({ ...leadForm, preferredTime: e.target.value })}
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 text-white text-xs rounded-xl px-4 py-3 outline-none cursor-pointer transition"
                  >
                    <option value="Mañana (9:00 AM - 12:00 PM)">Mañana (9:00 AM - 12:00 PM)</option>
                    <option value="Tarde (2:00 PM - 6:00 PM)">Tarde (2:00 PM - 6:00 PM)</option>
                    <option value="Noche (6:00 PM - 8:00 PM)">Noche (6:00 PM - 8:00 PM)</option>
                    <option value="Cualquier Horario Laboral">Cualquier Horario Laboral</option>
                  </select>
                </div>

                {/* Meta Principal del Negocio */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tu Objetivo Prioritario</span>
                  </label>
                  <select
                    value={leadForm.primaryGoal}
                    onChange={(e) => setLeadForm({ ...leadForm, primaryGoal: e.target.value })}
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 text-white text-xs rounded-xl px-4 py-3 outline-none cursor-pointer transition"
                  >
                    <option value="Aumentar clientes y reseñas 5★ en Google Maps">Aumentar clientes y 5★ en Google Maps</option>
                    <option value="Frenar quejas privadas antes de que salgan a internet">Frenar quejas privadas antes de internet</option>
                    <option value="Crear base de datos propia de clientes (WhatsApp)">Crear base de datos propia (WhatsApp)</option>
                    <option value="Auditar la atención del personal y meseros">Auditar la atención del personal</option>
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
                    <span>Agendando sesión estratégica...</span>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 text-slate-950" />
                      <span>AGENDAR MI SESIÓN ESTRATÉGICA 1 A 1 (SIN COSTO)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-slate-500 text-center">
                🔒 Tus datos se tratan bajo estricta confidencialidad y Ley de Habeas Data (Ley 1581). Sin compromisos ni llamadas insistentes.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 10. FOOTER CORPORATIVO */}
      {/* ============================================================== */}
      <footer className="border-t border-slate-800/80 py-12 px-4 sm:px-8 bg-[#05070B] text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <PrestigiaIcon className="w-7 h-7 text-white" />
            <div>
              <p className="text-white font-extrabold tracking-wider">PRESTIGIA TECHNOLOGIES ENTERPRISE</p>
              <p className="text-[10px] text-slate-500">Suite de Crecimiento Comercial, Blindaje Reputacional & Conversión Local 5★</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <Link href="/portal" className="text-slate-300 hover:text-white transition flex items-center gap-1.5 font-semibold">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Portal de Clientes</span>
            </Link>
            <a
              href="https://wa.me/573172606093?text=Hola%20Prestigia,%20solicito%20información%20sobre%20el%20blindaje%20comercial"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white transition flex items-center gap-1.5 font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Atención Directa WhatsApp</span>
            </a>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="text-slate-500 font-medium">Colombia • México • Chile • Estados Unidos • España</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-900 text-[10px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Prestigia Technologies. Todos los derechos reservados.</p>
          <p>Cumplimiento Normativo RGPD, Ley 1581 de Habeas Data & Políticas Oficiales de Reseñas de Google Maps.</p>
        </div>
      </footer>
    </div>
  );
}
