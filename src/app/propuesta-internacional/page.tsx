'use client';

import React from 'react';
import {
  Activity,
  ArrowRight,
  Bot,
  Briefcase,
  Check,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Flame,
  Globe,
  HeartPulse,
  HelpCircle,
  MapPin,
  MessageCircle,
  Printer,
  QrCode,
  Scissors,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  TrendingUp,
  Truck,
  Users,
  UtensilsCrossed,
  Wrench,
  Zap,
} from 'lucide-react';

export default function PropuestaInternacionalPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full min-h-screen bg-[#070A12] text-white selection:bg-indigo-500 selection:text-white pb-16">
      
      {/* Global Print Styles - Preserves Full Dark Mode Visual Identity with Zero White Margins */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            margin: 0 !important;
            size: A4 portrait;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: #070A12 !important;
            color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .proposal-page {
            padding: 14mm 16mm !important;
            box-sizing: border-box !important;
            min-height: 100vh !important;
          }
        }
      ` }} />

      {/* Action Bar (Only visible on screen, hidden when printing to PDF) */}
      <div className="print:hidden sticky top-0 z-50 bg-[#0D1424]/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-xl">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-extrabold text-white text-sm">
              P
            </div>
            <div>
              <span className="text-xs font-bold text-white tracking-wider">PRESTIGIA GLOBAL</span>
              <span className="text-[10px] ml-2 text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 font-medium">
                Dossier Internacional (USD)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 transition active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Descargar en PDF / Imprimir</span>
            </button>
            <a
              href="/"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Volver al Hub
            </a>
          </div>
        </div>
      </div>

      {/* Main Printable Document */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-12 print:p-0 print:m-0 print:space-y-8 print:max-w-none">
        
        {/* ========================================================================= */}
        {/* PÁGINA 1: PORTADA & DIAGNÓSTICO (IMPACTO INTERNACIONAL) */}
        {/* ========================================================================= */}
        <section className="space-y-8 proposal-page print:page-break-after">
          
          {/* Header */}
          <header className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-700 flex items-center justify-center font-black text-white text-xl shadow-xl shadow-purple-600/25 print:text-white">
                P
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white">
                  PRESTIGIA <span className="text-purple-400">PRO GLOBAL</span>
                </h1>
                <p className="text-xs text-slate-400 font-semibold tracking-wide">
                  INFRAESTRUCTURA, REPUTACIÓN Y CONVERSIÓN COMERCIAL INTERNACIONAL (USD)
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                PROGRAMA PILOTO GLOBAL 30 DÍAS
              </span>
            </div>
          </header>

          {/* Hero Section */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
              <Flame className="w-3.5 h-3.5" />
              <span>EL DIAGNÓSTICO GLOBAL: LA PÉRDIDA SILENCIOSA DE CLIENTES LOCALES</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              El <span className="text-purple-400">88% de los consumidores</span> busca en Google Maps antes de visitar un negocio o contratar un servicio.
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
              Ya sea un <strong>restaurante, clínica estética, spa, tienda, o un servicio especializado (lavado de tapicería, cerrajería, plomería o técnica automotriz)</strong>: recibir <strong>una sola reseña pública negativa de 1 estrella</strong> desvía hasta el <strong>70% de tus clientes nuevos</strong> directamente hacia tu competencia.
            </p>
          </div>

          {/* COBERTURA DUAL: LOCALES & SERVICIOS */}
          <div className="space-y-3">
            <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Ecosistema Diseñado para Todo Tipo de Negocio:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#0D1424] border border-indigo-500/30 space-y-2 text-left">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <Store className="w-4 h-4" />
                  <span>Para Comercios & Puntos de Venta Físicos</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Clínicas, centros médicos, concesionarios, retail, hoteles, spas, centros de servicio y gastronomía. Kit de QR dinámicos para recepción, puntos de atención y áreas de cobro para convertir clientes satisfechos en reseñas de 5★ al ser atendidos.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0D1424] border border-cyan-500/30 space-y-2 text-left">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Truck className="w-4 h-4" />
                  <span>Para Servicios a Domicilio & Profesionales Móviles</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Lavado de muebles y alfombras, plomeros, cerrajeros, electricistas, estilistas y mecánicos. QR Digital en tu teléfono para calificar en el hogar del cliente al terminar cada servicio.
                </p>
              </div>
            </div>
          </div>

          {/* Dolores Psicológicos del Comercio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-[#0D1424] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center font-black text-lg">
                ❌
              </div>
              <h3 className="font-bold text-white text-base">
                El Sesgo Humano de la Queja Pública
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                El cliente insatisfecho busca desahogarse públicamente en Google Maps arruinando años de esfuerzo. En cambio, los clientes satisfechos no dejan reseña por pereza al buscar el negocio.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D1424] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-black text-lg">
                ⚡
              </div>
              <h3 className="font-bold text-white text-base">
                Entrega 100% Digital en Menos de 24 Horas
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Sin envíos lentos por correo. Te entregamos tu Ficha de Google Maps optimizada, tu Página Web ultrarrápida y tu <strong>Kit de QR Inteligentes de Alta Resolución</strong> listos para usar en tu celular o imprimir localmente.
              </p>
            </div>
          </div>

          {/* The Core Promise */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/60 via-[#0D1424] to-indigo-950/60 border border-purple-500/30 text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>LA SOLUCIÓN DE PRESTIGIA PRO GLOBAL</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Blindaje de Reputación + Más Clientes Locales en Automático
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Multiplicamos tus opiniones de 5 estrellas en Google Maps, bloqueamos el 100% de las quejas destructivas y convertimos a tus clientes en seguidores y compradores recurrentes a través de tu nueva Página Web Oficial.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PÁGINA 2: EL CIRCUITO DE BIFURCACIÓN INTELIGENTE (3 PASOS) */}
        {/* ========================================================================= */}
        <section className="space-y-8 proposal-page print:page-break-after">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
              Ingeniería Comercial en el Punto de Contacto
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              El Circuito de Bifurcación Inteligente
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Todo ocurre en menos de 10 segundos desde el teléfono del cliente sin necesidad de descargas ni registros engorrosos.
            </p>
          </div>

          {/* 3-Step Visual Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-[#0D1424] border border-slate-800 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 font-black text-sm flex items-center justify-center">
                    1
                  </span>
                  <QrCode className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="font-extrabold text-white text-base">
                  Escaneo de Smart QR
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  El cliente escanea el QR desde tu display físico o directamente desde tu teléfono móvil. La pantalla de calificación abre en <strong>menos de 1 segundo</strong>.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 text-[11px] text-slate-400 font-medium">
                ⚡ Cero fricción: no pide instalar aplicaciones.
              </div>
            </div>

            {/* Step 2: Positive Routing */}
            <div className="p-5 rounded-2xl bg-[#0D1424] border border-emerald-500/40 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 font-black text-sm flex items-center justify-center">
                    2A
                  </span>
                  <div className="flex text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                </div>
                <h4 className="font-extrabold text-emerald-400 text-base">
                  Cliente Satisfecho (4 o 5★)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Redirección instantánea a Google Maps. <strong>Abre directamente la ventana modal con las 5 estrellas listas</strong> para que el cliente solo toque "Publicar".
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/40 text-[11px] text-emerald-300 font-semibold">
                📈 Posicionamiento garantizado en el Top 3 local.
              </div>
            </div>

            {/* Step 3: Negative Routing */}
            <div className="p-5 rounded-2xl bg-[#0D1424] border border-red-500/40 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 font-black text-sm flex items-center justify-center">
                    2B
                  </span>
                  <ShieldAlert className="w-6 h-6 text-red-400" />
                </div>
                <h4 className="font-extrabold text-red-400 text-base">
                  Cliente Inconforme (1 a 3★)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Google Maps queda 100% bloqueado.</strong> Se abre un buzón privado para capturar Nombre, WhatsApp y Motivo de inconformidad en tiempo real.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-red-950/40 text-[11px] text-red-300 font-semibold">
                🛡️ 0 daño público. Alerta en &lt;10 seg a tu WhatsApp.
              </div>
            </div>

          </div>

          {/* The Post-Review Powerhouse */}
          <div className="p-6 rounded-2xl bg-[#0D1424] border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                <Globe className="w-4 h-4" />
                <span>Conversión Comercial Post-Reseña</span>
              </div>
              <h4 className="font-black text-white text-base sm:text-lg">
                Tu Página Web Comercial Móvil Incluida
              </h4>
              <p className="text-xs text-slate-300">
                Carga en <strong className="text-white">&lt;1.2 segundos</strong> con catálogo de servicios/productos, botón directo a WhatsApp y enlaces a Instagram, TikTok y Facebook.
              </p>
            </div>
            <div className="shrink-0 px-4 py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 text-xs font-extrabold">
              Reseñas + Seguidores + Ventas
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PÁGINA 3: COMPARATIVA DE PLANES (USD) & OFERTA PILOTO */}
        {/* ========================================================================= */}
        <section className="space-y-8 proposal-page">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
              Inversión Transparente y Máxima Rentabilidad
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Tarifas Globales en Dólares (USD)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              La Regla de Oro: El montaje inicial paga la <strong className="text-white">propiedad definitiva</strong> de tu Web y Google Maps. La mensualidad paga el <strong className="text-white">radar anti-quejas, hosting continuo y soporte</strong>.
            </p>
          </div>

          {/* Plans Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-800 text-xs sm:text-sm rounded-2xl overflow-hidden">
              <thead>
                <tr className="bg-[#0D1424] text-slate-300 border-b border-slate-800">
                  <th className="p-3.5 font-bold">Módulo / Beneficio</th>
                  <th className="p-3.5 font-bold text-center">Plan Básico Global</th>
                  <th className="p-3.5 font-bold text-center bg-purple-950/40 text-purple-300 border-x border-purple-500/30">
                    Plan Pro Global (Recomendado)
                  </th>
                  <th className="p-3.5 font-bold text-center">Solo Montaje Fijo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-[#0A0F1D] text-slate-300">
                <tr>
                  <td className="p-3 font-semibold text-white">Kit de Códigos QR Inteligentes</td>
                  <td className="p-3 text-center">Kit Digital descargable en Portal</td>
                  <td className="p-3 text-center font-bold text-purple-300 bg-purple-950/20 border-x border-purple-500/20">
                    Kit Digital HD para móvil + Imprimible para Displays
                  </td>
                  <td className="p-3 text-center text-slate-500">QR estático sin radar</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Ficha Oficial Google Maps</td>
                  <td className="p-3 text-center">Configuración y verificación</td>
                  <td className="p-3 text-center font-bold text-purple-300 bg-purple-950/20 border-x border-purple-500/20">
                    Optimización quirúrgica para Top 3 local
                  </td>
                  <td className="p-3 text-center">Configuración básica</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Filtro Anti-Quejas</td>
                  <td className="p-3 text-center">1 a 3★ van a buzón privado</td>
                  <td className="p-3 text-center font-bold text-purple-300 bg-purple-950/20 border-x border-purple-500/20">
                    1 a 3★ prioritario + alerta a WhatsApp (&lt;10s)
                  </td>
                  <td className="p-3 text-center text-red-400">Desactivado (abierto a Google)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Asistente de Inteligencia Artificial</td>
                  <td className="p-3 text-center text-slate-500">Plantillas estándar</td>
                  <td className="p-3 text-center font-bold text-purple-300 bg-purple-950/20 border-x border-purple-500/20">
                    IA redacta respuestas a reseñas en 5 seg
                  </td>
                  <td className="p-3 text-center text-slate-500">100% manual</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Página Web Móvil Comercial</td>
                  <td className="p-3 text-center">Hosting continuo y catálogo</td>
                  <td className="p-3 text-center font-bold text-purple-300 bg-purple-950/20 border-x border-purple-500/20">
                    Muro en vivo de reseñas Google + Multicanal
                  </td>
                  <td className="p-3 text-center">Propiedad fija (sin soporte)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Actualizaciones de Fotos & Precios</td>
                  <td className="p-3 text-center">Hasta 2 al mes (precios y datos)</td>
                  <td className="p-3 text-center font-bold text-purple-300 bg-purple-950/20 border-x border-purple-500/20">
                    1 actualización semanal (fotos trabajos, ofertas)
                  </td>
                  <td className="p-3 text-center text-slate-500">No incluidas</td>
                </tr>
                <tr className="border-t-2 border-purple-500/50 bg-[#0D1424] font-extrabold text-sm">
                  <td className="p-4 text-white">
                    Tarifa Mensual Recurrente
                    <div className="text-[10px] font-normal text-slate-400 mt-0.5">
                      (A partir del día 31 • Mes 1 es $0 USD)
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="text-xs text-slate-500 line-through font-semibold">$40 USD</div>
                    <div className="text-purple-300 font-black text-base">$19 <span className="text-xs font-normal">USD/mes</span></div>
                    <div className="text-[10px] text-emerald-400 font-bold tracking-tight mt-0.5">50% OFF ($0.63/día)</div>
                  </td>
                  <td className="p-4 text-center bg-purple-950/30 border-x border-purple-500/40">
                    <div className="text-xs text-slate-500 line-through font-semibold">$60 USD</div>
                    <div className="text-emerald-400 font-black text-lg">$29 <span className="text-xs font-normal">USD/mes</span></div>
                    <div className="text-[10px] text-amber-300 font-bold tracking-tight mt-0.5">50% OFF ($0.96/día)</div>
                  </td>
                  <td className="p-4 text-center text-slate-400">
                    <div className="font-bold text-sm">$0 USD/mes</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Sin soporte continuo</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* The Infallible Pilot Offer Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-purple-900/80 via-[#0D1424] to-indigo-950/70 border-2 border-purple-500 shadow-2xl space-y-6 text-left">
            
            {/* Traditional Agency Contrast Banner */}
            <div className="p-3.5 rounded-2xl bg-purple-950/70 border border-purple-400/30 flex items-center gap-3 text-xs text-slate-200">
              <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 font-black text-sm shrink-0">
                💡
              </div>
              <div>
                <strong className="text-white">El Contraste Real de Mercado Internacional:</strong> Cualquier agencia tradicional de diseño web en EE.UU., México o España cobra entre <strong className="text-amber-300 font-bold">$300 y $800 USD</strong> únicamente por una página web básica (sin Google Maps optimizado, sin Smart QR, sin filtro anti-quejas y sin inteligencia artificial). Nosotros te entregamos el ecosistema completo por una fracción de ese valor.
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-500/30 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                  🔥 50% OFF LANZAMIENTO GLOBAL (SOLO 5 CUPOS POR CIUDAD Y SECTOR)
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1.5">
                  Programa Piloto Global 30 Días: Validación y Crecimiento
                </h3>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 line-through font-semibold">$199 USD</div>
                <div className="text-2xl sm:text-4xl font-black text-emerald-400">
                  $99 USD
                </div>
                <span className="text-[10px] text-slate-300 font-medium">Pago único de ingeniería (50% Descuento)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Lo que recibe tu empresa en 24 horas:</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Kit de Códigos QR Inteligentes Digitales</strong> descargables en tu portal (listos para llevar en tu celular o imprimir en cualquier imprenta local).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Ficha Google Maps oficial verificada y auditada</strong> para posicionar en el Top 3 de tu área de influencia.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Página Web Comercial Móvil ultrarrápida (&lt;1.2s)</strong> con catálogo de productos/servicios y botón WhatsApp (de tu propiedad definitiva).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>30 Días 100% Bonificados de Plataforma Pro ($0 USD)</strong> con radar anti-quejas y alertas directas a WhatsApp.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Tarifa de Mantenimiento 50% OFF Congelada para Siempre:</strong> Al finalizar el mes bonificado, conservas tu cuota ($19 Básico o $29 Pro) sin aumentos futuros.</span>
                  </li>
                  <li className="flex items-start gap-2 text-amber-300">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Posicionamiento Vitalicio en Directorio Prestigia Global (Páginas Amarillas 2.0):</strong> Tu negocio figurará en los primeros puestos con sello de "Negocio Verificado" en la guía oficial de tu ciudad.</span>
                  </li>
                  <li className="flex items-start gap-2 text-amber-300">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Acceso Vitalicio a la Red de Venta Cruzada & Fidelización:</strong> Participación preferencial en alianzas y recomendaciones de clientes con otros comercios y profesionales aliados de tu comunidad.</span>
                  </li>
                  <li className="flex items-start gap-2 text-purple-300">
                    <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span><em>Opcional VIP:</em> Placa Acrílica de Lujo o Tarjeta PVC NFC física enviada a tu puerta por solo +$25 USD adicionales.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>El Acuerdo Ganar-Ganar:</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Solo pagas el valor reducido de montaje ($99 USD). A cambio, lo único que te pedimos es:
                </p>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">★</span>
                    <span>Exhibir el QR en tu establecimiento o mostrarlo al cliente al terminar cada servicio.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">★</span>
                    <span>Publicar 2 historias semanales en tus redes sociales destacando tu nueva web oficial y nuestros servicios.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">★</span>
                    <span>Grabar un video testimonio de 30 seg al día 28 con tus resultados obtenidos.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-slate-700 text-xs text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <strong className="text-white">Cero ataduras al día 30:</strong> Tu página web y tu Google Maps son de tu propiedad para siempre desde el día 1. Si decides no continuar con el software, no hay penalidad alguna.
              </div>
              <button
                onClick={handlePrint}
                className="print:hidden shrink-0 px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs transition shadow-lg shadow-purple-500/20"
              >
                Imprimir Propuesta Oficial
              </button>
            </div>
          </div>

          {/* Objection Handling Cheat Sheet */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-sm font-bold text-purple-400 uppercase tracking-widest text-center">
              Preguntas Frecuentes de Comercios y Profesionales Internacionales
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#0D1424] border border-slate-800 space-y-1.5">
                <strong className="text-white">"¿Cómo recibo las alertas si estoy en EE.UU., México o España?"</strong>
                <p className="text-slate-300">
                  Prestigia Pro está integrado de forma nativa con códigos de país internacionales (+1 EE.UU., +52 México, +34 España, etc.). Las alertas de clientes y mensajes llegan al instante a tu WhatsApp habitual sin importar dónde estés.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1424] border border-slate-800 space-y-1.5">
                <strong className="text-white">"¿Cómo imprimo mis códigos QR en mi ciudad?"</strong>
                <p className="text-slate-300">
                  Desde tu Portal del Negocio puedes descargar tu Kit QR en archivos vectoriales de máxima resolución (PDF y PNG). Puedes llevarlos en una memoria USB o enviarlos por WhatsApp a cualquier imprenta local para imprimirlos en stickers, acrílicos o volantes.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1424] border border-slate-800 space-y-1.5">
                <strong className="text-white">"¿Qué pasa si decido pausar el servicio mensual?"</strong>
                <p className="text-slate-300">
                  Tu Ficha de Google Maps y tu Página Web siguen existiendo porque pagaste su montaje. Si decides suspender la mensualidad, el radar anti-quejas inteligente se pausa temporalmente hasta que decidas reactivarlo.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1424] border border-slate-800 space-y-1.5">
                <strong className="text-white">"¿Cuánto demora la entrega de mi web y Google Maps?"</strong>
                <p className="text-slate-300">
                  El despliegue de tu página web comercial, configuración de Google Maps y la activación de tu Kit QR digital se entrega en únicamente <strong>24 a 48 horas</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Call to Action */}
          <footer className="text-center pt-6 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              Prestigia Global • Infraestructura, Reputación y Conversión Comercial Internacional • Todos los derechos reservados.
            </p>
          </footer>

        </section>

      </main>
    </div>
  );
}
