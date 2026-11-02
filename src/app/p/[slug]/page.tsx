'use client';

import React, { useState, useEffect, useMemo } from 'react';
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

  // Active review carousel index
  const [reviewIdx, setReviewIdx] = useState(0);

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

  // Countdown countdown loop
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
      `🔥 ${pageData.city}: Carlos M. acaba de solicitar una cita por WhatsApp hace 3 min`,
      `⭐️ Nueva reseña de 5★ verificada en Google Maps para ${pageData.businessName}`,
      `⚡ Alguien en ${pageData.city} está consultando disponibilidad en este momento`,
      `✅ Reserva confirmada exitosamente vía WhatsApp hace 7 minutos`,
    ];

    let idx = 0;
    const interval = setInterval(() => {
      setActiveFomo(fomoMessages[idx % fomoMessages.length]);
      idx++;
      setTimeout(() => setActiveFomo(null), 5500);
    }, 14000);

    return () => clearInterval(interval);
  }, [pageData]);

  // Auto-advance reviews
  useEffect(() => {
    if (!pageData?.reviews || pageData.reviews.length <= 1) return;
    const interval = setInterval(() => {
      setReviewIdx((prev) => (prev + 1) % pageData.reviews.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [pageData]);

  const primaryColor = pageData?.theme?.primaryColor || '#D97706';
  const accentColor = pageData?.theme?.accentColor || '#059669';

  const cleanPhone = (pageData?.phone || '+573058314049').replace(/[^0-9+]/g, '');
  const encodedWhatsapp = encodeURIComponent(
    pageData?.whatsappMessage || `Hola ${pageData?.businessName}, vi su página web y deseo consultar disponibilidad e información.`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodedWhatsapp}`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-12 h-12 rounded-2xl border-4 border-amber-500 border-t-transparent animate-spin mb-4" />
        <h2 className="text-base font-bold text-slate-300">Cargando sitio oficial...</h2>
        <p className="text-xs text-slate-500 mt-1">Verificando conexión con Prestigia Engine</p>
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

  // ==============================================================
  // CONDICIONAL: SITIO SUSPENDIDO POR FALTA DE PAGO (CANDADO ANTI-CHURN)
  // ==============================================================
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
              Comunícate de inmediato con tu asesor asignado de <strong>Prestigia LatAm</strong> para reactivar la página web, el botón de WhatsApp y la sincronización con Google Maps.
            </p>
          </div>

          <a
            href="https://wa.me/573058314049?text=Hola,%20deseo%20reactivar%20mi%20landing%20page%20suspendida%20en%20Prestigia"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20"
          >
            <MessageSquare className="w-4 h-4 fill-slate-950" />
            <span>Contactar a Soporte y Reactivar</span>
          </a>

          <p className="text-[10px] text-slate-600 font-mono">
            Powered by Prestigia Enterprise Suite • Protocolo de Suspensión Anti-Churn
          </p>
        </div>
      </div>
    );
  }

  // ==============================================================
  // SITIO WEB ACTIVO Y DE ALTA CONVERSIÓN
  // ==============================================================
  return (
    <div
      className="min-h-screen text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 relative pb-24"
      style={{
        backgroundColor: pageData.theme?.bgColor || '#030712',
      }}
    >
      {/* 1. TOP URGENCY COUNTDOWN BANNER */}
      {pageData.features?.showUrgencyBanner && (
        <div
          className="py-2 px-4 text-center text-xs font-black tracking-wide text-slate-950 flex flex-wrap items-center justify-center gap-2 sticky top-0 z-40 shadow-lg"
          style={{
            background: `linear-gradient(to right, ${primaryColor}, #F59E0B)`,
          }}
        >
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>{pageData.offerBadge || '⚡ Promoción Exclusiva de Esta Semana'}</span>
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="font-mono bg-slate-950/20 px-2 py-0.5 rounded text-[11px]">
            Termina en: {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>
      )}

      {/* 2. HEADER & BRAND BAR */}
      <header className="border-b border-slate-800/80 backdrop-blur-md bg-slate-950/70 sticky top-8 sm:top-9 z-30 px-4 sm:px-8 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-950 font-black text-lg shadow-md"
              style={{ backgroundColor: primaryColor }}
            >
              {pageData.businessName?.charAt(0) || 'P'}
            </div>
            <div>
              <h1 className="font-black text-sm sm:text-base text-white tracking-tight leading-tight">
                {pageData.businessName}
              </h1>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span>{pageData.city} • {pageData.category}</span>
              </span>
            </div>
          </div>

          {/* Live Open Indicator */}
          {pageData.features?.showLiveOpen && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-black text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Abierto Ahora</span>
            </div>
          )}
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 pt-8 sm:pt-12 space-y-10">
        <section className="text-center space-y-5">
          {/* Rating Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 shadow-md">
            <div className="flex items-center gap-0.5 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-black text-white">4.9 ★★★★★ en Google Maps</span>
            <span className="text-[10px] text-slate-500 font-bold hidden sm:inline">• Clientes Verificados</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-2xl mx-auto">
            {pageData.headline}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            {pageData.subheadline}
          </p>

          {/* Action Call Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm text-slate-950 transition flex items-center justify-center gap-2.5 shadow-2xl active:scale-98 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, #10B981)`,
                boxShadow: `0 10px 25px -5px ${accentColor}40`,
              }}
            >
              <MessageSquare className="w-5 h-5 fill-slate-950" />
              <span>{pageData.callToAction || 'Agendar por WhatsApp'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            {pageData.features?.showWazeButton && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${pageData.businessName} ${pageData.city}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Cómo Llegar (Waze / Maps)</span>
              </a>
            )}
          </div>
        </section>

        {/* 4. STAR SERVICES CATALOG */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                Nuestros Servicios
              </span>
              <h3 className="text-lg font-black text-white">Catálogo de Servicios & Soluciones</h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">Disponibilidad Inmediata</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {pageData.services.map((svc, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between space-y-3 hover:border-slate-700 transition"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[9px] font-black uppercase px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: `${primaryColor}30`, color: primaryColor }}
                    >
                      {svc.tag || 'Destacado'}
                    </span>
                    <span className="text-xs font-black text-emerald-400">{svc.price || 'Consultar'}</span>
                  </div>
                  <h4 className="font-extrabold text-white text-sm">{svc.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{svc.description}</p>
                </div>

                <a
                  href={`https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(`Hola, quiero consultar el servicio "${svc.name}"`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-center text-xs font-bold text-white transition flex items-center justify-center gap-1.5"
                >
                  <span>Pedir este servicio</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* 5. INTERACTIVE 5★ GOOGLE REVIEWS CAROUSEL */}
        {pageData.features?.showReviewCarousel && pageData.reviews?.length > 0 && (
          <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center font-bold text-xs text-slate-950">
                  G
                </div>
                <div>
                  <h4 className="font-black text-white text-sm">Reseñas Reales en Google Maps</h4>
                  <span className="text-[10px] text-slate-400">Verificadas y auditadas</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-xs font-black text-white">5.0 de 5 Estrellas</span>
              </div>
            </div>

            {/* Current Active Review Card */}
            {pageData.reviews[reviewIdx] && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2.5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-black text-slate-200">
                      {pageData.reviews[reviewIdx]?.author?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <strong className="text-white text-xs block">
                        {pageData.reviews[reviewIdx]?.author || 'Cliente Verificado'}
                      </strong>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(pageData.reviews[reviewIdx]?.rating || 5)].map((_, r) => (
                          <Star key={r} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {pageData.reviews[reviewIdx]?.date || 'Verificado'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic">
                  &ldquo;{pageData.reviews[reviewIdx]?.text || ''}&rdquo;
                </p>
              </div>
            )}

            {/* Carousel navigation indicators */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {pageData.reviews.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setReviewIdx(i)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    reviewIdx === i ? 'w-6 bg-amber-400' : 'w-2 bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </section>
        )}

        {/* 6. TESTIMONIALS & TRUST GUARANTEE */}
        {pageData.testimonials?.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-base font-black text-white text-center">
              Experiencias de Clientes Satisfechos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {pageData.testimonials.map((t, i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <strong className="text-white text-xs">{t.name}</strong>
                    <span className="text-[10px] text-emerald-400 font-bold">{t.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. FINAL DIRECT CALL TO ACTION */}
        <section
          className="p-8 rounded-3xl text-center space-y-4 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}20, ${accentColor}20)`,
            border: `1px solid ${primaryColor}40`,
          }}
        >
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              ¿Listo para Resolver tu Consulta Hoy Mismo?
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Escríbenos directamente por WhatsApp. Te responderemos en menos de 5 minutos con atención personalizada.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-xs sm:text-sm text-slate-950 transition shadow-xl active:scale-98"
            style={{
              backgroundColor: accentColor,
            }}
          >
            <MessageSquare className="w-4 h-4 fill-slate-950" />
            <span>Chatear por WhatsApp Ahora</span>
          </a>
        </section>
      </main>

      {/* 8. FOOTER WITH PRESTIGIA AUTHORITY BADGE */}
      <footer className="mt-16 border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <p className="font-bold text-slate-400">
          {pageData.businessName} • {pageData.address || `${pageData.city}, Colombia`}
        </p>

        {pageData.features?.showPrestigiaBadge && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Página Oficial Verificada y Alojada por Prestigia Engine © 2026</span>
          </div>
        )}
      </footer>

      {/* 9. FLOATING WHATSAPP BUTTON */}
      <aside aria-label="Contacto rápido" className="fixed bottom-5 right-5 z-50">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-slate-950 shadow-2xl transition hover:scale-110 active:scale-95 group relative cursor-pointer"
          style={{
            backgroundColor: '#25D366',
            boxShadow: '0 10px 25px rgba(37, 211, 102, 0.4)',
          }}
        >
          <span className="w-full h-full rounded-2xl bg-[#25D366] absolute animate-ping opacity-30 -z-10" />
          <MessageSquare className="w-7 h-7 fill-slate-950 text-slate-950" />
          <span className="absolute right-16 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-[11px] font-black whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none">
            Escríbenos por WhatsApp
          </span>
        </a>
      </aside>

      {/* 10. LIVE FOMO SOCIAL PROOF POPUP */}
      {activeFomo && (
        <aside aria-label="Notificaciones en vivo" className="fixed bottom-5 left-5 z-40 max-w-xs animate-in slide-in-from-bottom duration-300">
          <div className="p-3 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl flex items-center gap-3 backdrop-blur-md">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
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
