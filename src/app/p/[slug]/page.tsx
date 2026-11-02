'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'next/navigation';
import {
  Star,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  MapPin,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Zap,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Lock,
  Volume2,
  VolumeX,
  Calendar,
  Flame,
  ChevronDown,
  Award,
  Navigation,
  Check,
} from 'lucide-react';
import type { StudioLandingPage } from '@/lib/db';

export default function PublicLandingPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const [pageData, setPageData] = useState<StudioLandingPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 42, seconds: 18 });

  // FOMO live popups
  const [activeFomo, setActiveFomo] = useState<string | null>(null);

  // Review carousel
  const [reviewIdx, setReviewIdx] = useState(0);

  // Interactive Before/After slider position (percentage 0 to 100)
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Interactive Appointment / Quote Calculator
  const [selectedServiceIdx, setSelectedServiceIdx] = useState(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'morning' | 'afternoon' | 'weekend'>('morning');

  // FAQ open state
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Sound toggle & Web Audio API
  const [soundEnabled, setSoundEnabled] = useState(false);

  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {}
  };

  // Fetch page data by slug
  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);

    fetch(`/api/landing-studio?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.page) {
          setPageData(data.page);
        } else {
          setError(data.error || 'Página no encontrada');
        }
      })
      .catch(() => setError('Error al cargar la página'))
      .finally(() => setIsLoading(false));
  }, [slug]);

  // Countdown loop
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // FOMO popups loop
  useEffect(() => {
    if (!pageData?.features?.showFomoPopups) return;

    const fomoMessages = [
      `🔥 ${pageData.city || 'Tu Ciudad'}: Mariana R. acaba de agendar su turno por WhatsApp hace 3 min`,
      `⭐️ 5★ Calificación de Google verificada hoy para ${pageData.businessName}`,
      `⚡ Alguien en ${pageData.city || 'la zona'} está consultando la oferta de esta semana`,
      `✅ Cita prioritaria confirmada exitosamente hace 8 minutos`,
    ];

    let idx = 0;
    const interval = setInterval(() => {
      setActiveFomo(fomoMessages[idx % fomoMessages.length]);
      idx++;
      setTimeout(() => setActiveFomo(null), 5000);
    }, 12000);

    return () => clearInterval(interval);
  }, [pageData]);

  // Reviews carousel auto-advance
  useEffect(() => {
    if (!pageData?.reviews || pageData.reviews.length <= 1) return;
    const interval = setInterval(() => {
      setReviewIdx((prev) => (prev + 1) % pageData.reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [pageData]);

  // Slider dragging handlers
  const handleMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pos);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const primaryColor = pageData?.theme?.primaryColor || '#059669';
  const accentColor = pageData?.theme?.accentColor || '#10B981';

  const cleanPhone = (pageData?.phone || '+573058314049').replace(/[^0-9+]/g, '');

  const currentSelectedService = pageData?.services?.[selectedServiceIdx] || pageData?.services?.[0];
  const timeSlotLabel =
    selectedTimeSlot === 'morning' ? 'Mañana (8:00 AM - 12:00 PM)' : selectedTimeSlot === 'afternoon' ? 'Tarde (1:00 PM - 6:00 PM)' : 'Sábado (Horario Flexible)';

  const dynamicWhatsappText = encodeURIComponent(
    `Hola ${pageData?.businessName || ''}, vi su página oficial y deseo agendar mi cita:\n` +
      `📌 Servicio: ${currentSelectedService?.name || 'Consulta General'}\n` +
      `⏰ Horario Preferido: ${timeSlotLabel}\n` +
      `⚡ Promoción: ${pageData?.offerBadge || 'Oferta Web'}\n` +
      `¿Tienen disponibilidad esta semana?`
  );

  const mainWhatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${dynamicWhatsappText}`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl animate-pulse" />
          <div className="w-16 h-16 rounded-2xl border-2 border-emerald-500 border-t-transparent animate-spin relative z-10" />
        </div>
        <h2 className="text-base font-bold text-white tracking-wide">Cargando experiencia oficial...</h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">Prestigia Dynamic Engine • Ultra Fast</p>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4 shadow-2xl">
          <AlertTriangle className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="text-xl font-black text-white">Página No Disponible</h1>
        <p className="text-xs text-slate-400 max-w-sm mt-2">
          La dirección web solicitada no existe o no tiene una landing page activa en este momento.
        </p>
      </div>
    );
  }

  // Anti-Churn Retainer Lock (Suspended Screen)
  if (pageData.status === 'suspended') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/90 border-2 border-rose-500/40 shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-rose-950/60 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400 shadow-xl">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-rose-950 border border-rose-500/40 text-rose-300">
              Conexión Comercial Pausada
            </span>
            <h1 className="text-xl font-black text-white pt-1">
              Sitio Web Temporalmente en Mantenimiento
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              El portal de atención y reservas directas de <strong className="text-white">{pageData.businessName}</strong> se encuentra temporalmente suspendido por actualización de cuenta.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2">
            <strong className="text-amber-300 block text-xs">¿Eres el titular de este negocio?</strong>
            <p className="text-slate-400 text-[11px] leading-snug">
              Comunícate con tu asesor asignado de <strong>Prestigia LatAm</strong> para reactivar la página web, el botón de WhatsApp y la sincronización con Google Maps.
            </p>
          </div>
          <a
            href="https://wa.me/573058314049?text=Hola,%20deseo%20reactivar%20mi%20landing%20page%20suspendida%20en%20Prestigia"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20"
          >
            <MessageSquare className="w-4 h-4 fill-slate-950" />
            <span>Contactar a Soporte y Reactivar</span>
          </a>
        </div>
      </div>
    );
  }

  const beforeAfterData = pageData.beforeAfter || {
    beforeUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1000&q=80',
    afterUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1000&q=80',
    title: 'Transformación Real de Pacientes en Medellín',
    labelBefore: 'Antes',
    labelAfter: 'Después (Resultado 100% Real)',
  };

  const statHighlights = pageData.statHighlights || [
    { value: '4.9 ★', label: 'En Google Maps' },
    { value: '+1,850', label: 'Clientes Felices' },
    { value: '100%', label: 'Tecnología de Punta' },
    { value: '12 Años', label: 'Trayectoria' },
  ];

  const faqs = pageData.faqs || [
    {
      question: '¿La valoración inicial tiene algún costo?',
      answer: 'Durante esta semana, la consulta de valoración con escaneo digital está 100% bonificada al reservar tu turno por WhatsApp.',
    },
    {
      question: '¿Los procedimientos son dolorosos?',
      answer: 'No. Empleamos tecnología avanzada indolora y microcirugía guiada para una experiencia 100% confortable.',
    },
    {
      question: '¿Tienen opciones de financiación?',
      answer: 'Sí, contamos con facilidades de pago directo en cuotas mensuales y recibimos todas las tarjetas de crédito.',
    },
    {
      question: '¿Cuentan con parqueadero y fácil acceso?',
      answer: `Sí, contamos con bahía privada y parqueadero vigilado para la comodidad de todos nuestros clientes en ${pageData.city || 'nuestra sede'}.`,
    },
  ];

  return (
    <div
      className="min-h-screen text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden"
      style={{ backgroundColor: pageData.theme?.bgColor || '#030712' }}
    >
      {/* Dynamic Ambient Mesh Glow Background (Luxury Look) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[140px] opacity-25"
          style={{ backgroundColor: primaryColor }}
        />
        <div
          className="absolute top-[40%] -right-40 w-[500px] h-[500px] rounded-full blur-[150px] opacity-15"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute bottom-10 -left-40 w-[600px] h-[600px] rounded-full blur-[160px] opacity-15"
          style={{ backgroundColor: primaryColor }}
        />
        {/* Subtle dot grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* 1. TOP URGENCY COUNTDOWN BANNER (Sleek Glassmorphic) */}
      {pageData.features?.showUrgencyBanner && (
        <aside
          aria-label="Aviso de oferta especial"
          className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-white/10 px-4 py-2.5 shadow-2xl transition"
        >
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <Flame className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-200">
                {pageData.offerBadge || '⚡ PROMOCIÓN EXCLUSIVA DE ESTA SEMANA'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 font-mono font-bold text-white text-[11px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-amber-400 mr-0.5" />
                <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
                <span>:</span>
                <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
                <span>:</span>
                <span className="text-amber-400">{String(timeLeft.seconds).padStart(2, '0')}s</span>
              </div>

              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'Silenciar efectos sonoros' : 'Activar efectos sonoros'}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 2. LUXURY BRAND HEADER */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 pb-3">
        <nav aria-label="Navegación principal" className="backdrop-blur-xl bg-slate-900/60 border border-white/10 rounded-3xl p-3.5 sm:p-4 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3.5">
            <div
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-slate-950 font-black text-xl shadow-lg ring-2 ring-white/10"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
              }}
            >
              {pageData.businessName?.charAt(0) || 'P'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-white text-sm sm:text-base tracking-tight leading-tight">
                  {pageData.businessName}
                </h1>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span>{pageData.city} • {pageData.category}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {pageData.features?.showLiveOpen && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-[11px] font-black text-emerald-300 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">Abierto Ahora</span>
                <span className="sm:hidden">Abierto</span>
              </div>
            )}

            <a
              href={mainWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClickSound}
              className="px-3.5 py-2 rounded-xl text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-lg active:scale-95 cursor-pointer hover:brightness-110"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, #25D366)`,
              }}
            >
              <MessageSquare className="w-3.5 h-3.5 fill-slate-950" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </nav>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16 pt-4 pb-28">

        {/* 3. HERO SHOWCASE SECTION */}
        <section className="text-center space-y-6 pt-2">
          {/* Google 5.0 Star Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full backdrop-blur-md bg-white/5 border border-white/10 shadow-xl">
            <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center font-black text-[11px] text-slate-950 shadow-sm">
              G
            </div>
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs font-black text-white">4.9 / 5.0</span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">• Clientes Verificados en Google</span>
          </div>

          {/* Main Headline with Gradient Glow */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-3xl mx-auto">
            {pageData.headline}
          </h2>

          {/* Subheadline */}
          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            {pageData.subheadline}
          </p>

          {/* Dual Main CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href={mainWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClickSound}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm text-slate-950 transition flex items-center justify-center gap-2.5 shadow-2xl hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-white/10"
              style={{
                background: `linear-gradient(135deg, #10B981, #25D366)`,
                boxShadow: `0 12px 30px -5px rgba(37, 211, 102, 0.45)`,
              }}
            >
              <MessageSquare className="w-5 h-5 fill-slate-950" />
              <span>{pageData.callToAction || 'Agendar por WhatsApp'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            {pageData.features?.showWazeButton && (
              <a
                href={
                  pageData.address
                    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pageData.address)}`
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${pageData.businessName} ${pageData.city}`)}`
                }
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClickSound}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl backdrop-blur-md bg-white/5 hover:bg-white/10 border border-white/15 text-xs sm:text-sm font-bold text-white transition flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:border-white/30"
              >
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>Cómo Llegar (GPS / Waze)</span>
              </a>
            )}
          </div>

          {/* Quick Assurance Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-[11px] sm:text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Sin Compromiso</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Respuesta en &lt; 5 min</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Garantía de Satisfacción</span>
            </span>
          </div>

          {/* HERO IMAGE SHOWCASE (If Available) */}
          {pageData.heroImage && (
            <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl group mt-6">
              <img
                src={pageData.heroImage}
                alt={pageData.businessName}
                className="w-full h-64 sm:h-96 object-cover group-hover:scale-102 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Floating Glass Chips over Image */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
                <div className="backdrop-blur-xl bg-slate-900/85 border border-white/20 px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold text-white shadow-xl">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Instalaciones Certificadas & Tecnología 3D</span>
                </div>
                <div className="backdrop-blur-xl bg-slate-900/85 border border-white/20 px-3.5 py-2 rounded-2xl flex items-center gap-1.5 text-xs font-bold text-amber-400 shadow-xl">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>5.0 / 5.0 Excelencia</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 4. STAT COUNTERS (Proof & Authority) */}
        <section aria-label="Métricas de confianza" className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {statHighlights.map((stat, i) => (
            <div
              key={i}
              className="p-4 sm:p-5 rounded-2xl backdrop-blur-xl bg-slate-900/50 border border-white/10 text-center space-y-1 hover:border-white/20 transition shadow-xl"
            >
              <div
                className="text-2xl sm:text-3xl font-black tracking-tight"
                style={{ color: accentColor }}
              >
                {stat.value}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        {/* 5. INTERACTIVE BEFORE & AFTER SLIDER (EL GANCHO VISUAL MÁS POTENTE) */}
        <section className="backdrop-blur-xl bg-slate-900/60 border border-white/10 rounded-3xl p-5 sm:p-8 space-y-5 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Resultados Reales Comprobables</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {beforeAfterData.title || 'Resultados de Transformación'}
              </h3>
            </div>
            <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Desliza la barra para comparar</span>
            </div>
          </div>

          {/* Interactive Split Drag Container */}
          <div
            ref={sliderRef}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden select-none cursor-ew-resize border border-white/15 shadow-2xl"
          >
            {/* After Image (Full Background) */}
            <img
              src={beforeAfterData.afterUrl}
              alt="Después"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Before Image (Clipped by slider position) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={beforeAfterData.beforeUrl}
                alt="Antes"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                style={{
                  width: sliderRef.current?.getBoundingClientRect().width || '100%',
                  maxWidth: 'none',
                }}
              />
            </div>

            {/* Drag Handle Divider */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_15px_rgba(255,255,255,0.8)]"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-slate-950 font-black text-xs flex items-center justify-center shadow-2xl ring-4 ring-emerald-500/50">
                ⇄
              </div>
            </div>

            {/* Labels overlay */}
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl backdrop-blur-md bg-slate-950/80 border border-white/10 text-[11px] font-black text-slate-300 pointer-events-none">
              {beforeAfterData.labelBefore || 'Antes'}
            </div>
            <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl backdrop-blur-md bg-emerald-950/80 border border-emerald-500/30 text-[11px] font-black text-emerald-300 pointer-events-none">
              {beforeAfterData.labelAfter || 'Después'}
            </div>
          </div>

          <div className="text-center">
            <a
              href={mainWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClickSound}
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 transition"
            >
              <span>¿Quieres un resultado como este? Consulta disponibilidad de turno por WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* 6. SERVICES CATALOG (High-End Cards) */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
              Tratamientos & Especialidades
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Servicios Destacados de Alta Calidad
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              Cada procedimiento es realizado con instrumental de última tecnología y garantía médica certificada.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {(pageData.services || []).map((svc, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/50 border border-white/10 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 hover:bg-slate-900/70 transition duration-300 shadow-xl group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {svc.tag || 'Servicio Estrella'}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-white font-mono bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
                      {svc.price || 'Consultar'}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-black text-white group-hover:text-emerald-300 transition">
                    {svc.name}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {svc.description}
                  </p>
                </div>

                <a
                  href={`https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(`Hola ${pageData.businessName}, deseo consultar disponibilidad e información detallada del servicio "${svc.name}".`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playClickSound}
                  className="w-full py-3 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-slate-950 text-white font-black text-xs transition flex items-center justify-center gap-2 border border-white/10 hover:border-emerald-500 shadow-lg cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Agendar este Servicio</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-950" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* 7. INTERACTIVE QUICK QUOTE & APPOINTMENT CALCULATOR */}
        <section className="backdrop-blur-xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Agendamiento Rápido en 3 Clics</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Solicita tu Turno Prioritario en Segundos
            </h3>
            <p className="text-xs text-slate-400">
              Selecciona tu servicio y horario deseado para pre-cargar tu solicitud directa en WhatsApp.
            </p>
          </div>

          <div className="space-y-4">
            {/* Step 1: Select Service */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">
                1. Selecciona el servicio que te interesa:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(pageData.services || []).map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedServiceIdx(idx);
                      playClickSound();
                    }}
                    className={`p-3 rounded-2xl text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                      selectedServiceIdx === idx
                        ? 'bg-emerald-500/20 border-2 border-emerald-400 text-white shadow-lg'
                        : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span>{s.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400">{s.price || 'Consultar'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Time Preference */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">
                2. Franja horaria preferida:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'morning', label: 'Mañana', sub: '8am - 12pm' },
                  { id: 'afternoon', label: 'Tarde', sub: '1pm - 6pm' },
                  { id: 'weekend', label: 'Sábado', sub: 'Flexible' },
                ].map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => {
                      setSelectedTimeSlot(slot.id as any);
                      playClickSound();
                    }}
                    className={`p-3 rounded-2xl text-center text-xs transition cursor-pointer ${
                      selectedTimeSlot === slot.id
                        ? 'bg-emerald-500/20 border-2 border-emerald-400 text-white font-black'
                        : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-bold text-white text-xs">{slot.label}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{slot.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary preview & Direct WhatsApp Confirmation */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Servicio Seleccionado:</span>
                <span className="font-bold text-white">{currentSelectedService?.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Horario Solicitado:</span>
                <span className="font-bold text-emerald-400">{timeSlotLabel}</span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-white/10 pt-2">
                <span className="text-slate-400">Beneficio Aplicado:</span>
                <span className="font-bold text-amber-400">⚡ Escaneo 3D Bonificado</span>
              </div>

              <a
                href={mainWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClickSound}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition flex items-center justify-center gap-2 shadow-2xl active:scale-98 cursor-pointer mt-2"
              >
                <MessageSquare className="w-5 h-5 fill-slate-950" />
                <span>Enviar Solicitud a WhatsApp con 1 Clic</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* 8. 5★ GOOGLE REVIEWS CAROUSEL */}
        {pageData.features?.showReviewCarousel && pageData.reviews && pageData.reviews.length > 0 && (
          <section className="backdrop-blur-xl bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center font-black text-sm text-slate-950 shadow-md">
                  G
                </div>
                <div>
                  <h4 className="font-black text-white text-base">Testimonios Reales en Google Maps</h4>
                  <span className="text-[11px] text-slate-400">Auditadas y respaldadas por Prestigia Engine</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full w-fit">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-xs font-black text-white">5.0 de 5 Estrellas</span>
              </div>
            </div>

            {/* Current Active Review Card */}
            {pageData.reviews[reviewIdx] && (
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3 shadow-inner animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center text-sm font-black shadow-md">
                      {pageData.reviews[reviewIdx]?.author?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <strong className="text-white text-sm block">
                        {pageData.reviews[reviewIdx]?.author || 'Cliente Satisfecho'}
                      </strong>
                      <div className="flex items-center gap-0.5 text-amber-400 mt-0.5">
                        {[...Array(pageData.reviews[reviewIdx]?.rating || 5)].map((_, r) => (
                          <Star key={r} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {pageData.reviews[reviewIdx]?.date || 'Verificado'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic pt-1">
                  &ldquo;{pageData.reviews[reviewIdx]?.text || ''}&rdquo;
                </p>
              </div>
            )}

            {/* Carousel navigation indicators */}
            <div className="flex items-center justify-center gap-2 pt-1">
              {pageData.reviews.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setReviewIdx(i);
                    playClickSound();
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    reviewIdx === i ? 'w-8 bg-emerald-400' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </section>
        )}

        {/* 9. INTERACTIVE FAQ ACCORDION */}
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
              Preguntas Frecuentes
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Respuestas Claras a tus Consultas
            </h3>
          </div>

          <div className="space-y-2.5 max-w-2xl mx-auto">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-white/10 overflow-hidden shadow-lg transition"
              >
                <button
                  type="button"
                  onClick={() => {
                    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
                    playClickSound();
                  }}
                  className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-white flex items-center justify-between gap-3 cursor-pointer hover:bg-white/5 transition"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-emerald-400 transition-transform duration-300 shrink-0 ${
                      openFaqIdx === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openFaqIdx === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 10. FINAL VIP CLOSING CALL TO ACTION */}
        <section
          className="p-8 sm:p-12 rounded-3xl text-center space-y-5 relative overflow-hidden border border-white/15 shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}25, ${accentColor}25)`,
          }}
        >
          <div className="space-y-2 max-w-xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30">
              Atención Prioritaria Disponible
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              ¿Listo para Agendar tu Valoración?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Escríbenos en este instante por WhatsApp. Te responderemos en menos de 5 minutos para confirmar el mejor horario para ti.
            </p>
          </div>

          <a
            href={mainWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClickSound}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-black text-sm text-slate-950 transition shadow-2xl hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: `linear-gradient(135deg, #10B981, #25D366)`,
              boxShadow: `0 10px 30px rgba(37, 211, 102, 0.4)`,
            }}
          >
            <MessageSquare className="w-5 h-5 fill-slate-950" />
            <span>Hablar por WhatsApp Ahora</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </section>
      </main>

      {/* 11. FOOTER WITH PRESTIGIA VERIFIED SEAL */}
      <footer className="border-t border-white/10 py-10 px-4 text-center text-xs text-slate-500 space-y-3">
        <p className="font-bold text-slate-300 text-sm">
          {pageData.businessName} • {pageData.address || `${pageData.city}, Colombia`}
        </p>

        {pageData.features?.showPrestigiaBadge && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 border border-white/10 text-[11px] text-slate-400 shadow-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Página Oficial Verificada y Alojada por Prestigia Engine © 2026</span>
          </div>
        )}
      </footer>

      {/* 12. FLOATING WHATSAPP BUTTON (DESKTOP) */}
      <aside aria-label="Contacto rápido" className="fixed bottom-6 right-6 z-50 hidden sm:block">
        <a
          href={mainWhatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          onClick={playClickSound}
          className="w-16 h-16 rounded-3xl flex items-center justify-center text-slate-950 shadow-2xl transition hover:scale-110 active:scale-95 group relative cursor-pointer"
          style={{
            backgroundColor: '#25D366',
            boxShadow: '0 12px 35px rgba(37, 211, 102, 0.55)',
          }}
        >
          <span className="w-full h-full rounded-3xl bg-[#25D366] absolute animate-ping opacity-30 -z-10" />
          <MessageSquare className="w-8 h-8 fill-slate-950 text-slate-950" />
          <span className="absolute right-20 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-black whitespace-nowrap shadow-2xl opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none">
            Escríbenos por WhatsApp 📲
          </span>
        </a>
      </aside>

      {/* 13. FLOATING MOBILE VIP BOTTOM BAR (MOBILE ONLY) */}
      <aside aria-label="Acceso rápido móvil" className="fixed bottom-0 left-0 right-0 z-50 sm:hidden backdrop-blur-2xl bg-slate-950/90 border-t border-white/10 p-3 shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="text-[11px] font-black text-white">4.9 Google</span>
              <span className="text-[10px] text-slate-400">• Abierto</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-bold truncate">
              {pageData.offerBadge || '⚡ Oferta Activa Hoy'}
            </div>
          </div>

          <a
            href={mainWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClickSound}
            className="px-5 py-3 rounded-xl font-black text-xs text-slate-950 transition flex items-center gap-1.5 shadow-xl active:scale-95 shrink-0"
            style={{
              background: `linear-gradient(135deg, #10B981, #25D366)`,
            }}
          >
            <MessageSquare className="w-4 h-4 fill-slate-950" />
            <span>WhatsApp</span>
          </a>
        </div>
      </aside>

      {/* 14. LIVE FOMO SOCIAL PROOF POPUP */}
      {activeFomo && (
        <aside aria-label="Notificaciones en vivo" className="fixed bottom-20 sm:bottom-6 left-4 z-40 max-w-xs animate-in slide-in-from-bottom duration-300">
          <div className="p-3.5 rounded-2xl backdrop-blur-xl bg-slate-900/95 border border-white/15 shadow-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-slate-200 font-medium leading-tight">
              {activeFomo}
            </p>
          </div>
        </aside>
      )}
    </div>
  );
}
