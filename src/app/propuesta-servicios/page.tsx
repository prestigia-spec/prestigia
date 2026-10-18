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

export default function PropuestaServiciosPage() {
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-extrabold text-white text-sm">
              P
            </div>
            <div>
              <span className="text-xs font-bold text-white tracking-wider">PRESTIGIA</span>
              <span className="text-[10px] ml-2 text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-medium">
                Edición Servicios a Domicilio & Profesionales Móviles
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-600/30 transition active:scale-95"
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
        {/* PÁGINA 1: PORTADA & DIAGNÓSTICO (EL FACTOR CONFIANZA EN EL HOGAR) */}
        {/* ========================================================================= */}
        <section className="space-y-8 proposal-page print:page-break-after">
          
          {/* Header */}
          <header className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-700 flex items-center justify-center font-black text-white text-xl shadow-xl shadow-cyan-500/25 print:text-white">
                P
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white">
                  PRESTIGIA <span className="text-cyan-400">PRO MÓVIL</span>
                </h1>
                <p className="text-xs text-slate-400 font-semibold tracking-wide">
                  INFRAESTRUCTURA Y REPUTACIÓN PARA SERVICIOS A DOMICILIO Y PROFESIONALES INDEPENDIENTES
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                PROGRAMA PILOTO 30 DÍAS
              </span>
            </div>
          </header>

          {/* Hero Section */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
              <Flame className="w-3.5 h-3.5" />
              <span>EL FACTOR DECISIVO: LA CONFIANZA PARA ENTRAR A UN HOGAR</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              El <span className="text-cyan-400">92% de las familias</span> no contrata a un técnico o profesional a domicilio si no tiene reseñas de 5★ en Google Maps.
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
              Nadie deja entrar a un desconocido a su casa para <strong>lavar sus muebles, reparar una fuga, cambiar una cerradura, arreglar un electrodoméstico o hacer un servicio de estética</strong> si no ve fotos de trabajos reales y opiniones que garanticen honestidad, puntualidad y trabajo impecable.
            </p>
          </div>

          {/* ESPECIALIZADO PARA PROFESIONALES Y TÉCNICOS A DOMICILIO */}
          <div className="space-y-3">
            <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Sistemas Especializados para Cada Especialidad a Domicilio:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-[#0D1424] border border-slate-800 space-y-1 text-left">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Lavado de Muebles & Alfombras</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Salas, colchones, tapicería vehicular y alfombras.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0D1424] border border-slate-800 space-y-1 text-left">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                  <Wrench className="w-4 h-4" />
                  <span>Mantenimiento & Urgencias</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Plomeros, cerrajeros 24/7, electricistas, gasodomésticos.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0D1424] border border-slate-800 space-y-1 text-left">
                <div className="flex items-center gap-1.5 text-pink-400 font-bold text-xs">
                  <Scissors className="w-4 h-4" />
                  <span>Cuidado & Estética Móvil</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Manicuristas, estilistas, barberos y masajistas a domicilio.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0D1424] border border-slate-800 space-y-1 text-left">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <Truck className="w-4 h-4" />
                  <span>Transporte & Mecánica Móvil</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Acarreos, mudanzas, auxilio vial y mecánicos a domicilio.
                </p>
              </div>
            </div>
          </div>

          {/* Dolores Psicológicos del Independiente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-[#0D1424] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center font-black text-lg">
                ❌
              </div>
              <h3 className="font-bold text-white text-base">
                Depender del "Boca a Boca" Casual
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Esperar a que un cliente te recomiende genera semanas vacías y estrés financiero. Los clientes que pagan bien y buscan especialistas urgentes en tu sector buscan en <strong>Google Maps</strong> todos los días.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D1424] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-black text-lg">
                ⏱️
              </div>
              <h3 className="font-bold text-white text-base">
                El Momento de Calificación Desperdiciado
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Al terminar un trabajo impecable el cliente te agradece sonriendo, pero nunca te califica porque después se le olvida. Con tu <strong>Tarjeta Inteligente de Bolsillo</strong>, te califica en 5 segundos antes de salir de su casa.
              </p>
            </div>
          </div>

          {/* The Core Promise */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-[#0D1424] to-indigo-950/60 border border-cyan-500/30 text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>LA SOLUCIÓN PRESTIGIA MÓVIL</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Tu Tarjeta Inteligente en el Bolsillo + Clientes Nuevos en tu Zona
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Te entregamos una Tarjeta PVC de lujo (NFC Contactless + QR) que llevas a cada servicio. Posicionamos tu Ficha de Google Maps en toda tu área de cobertura y te creamos tu Web Oficial con fotos de "Antes y Después" para cerrar clientes por WhatsApp en automático.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PÁGINA 2: EL CIRCUITO DE CIERRE EN EL DOMICILIO (3 PASOS) */}
        {/* ========================================================================= */}
        <section className="space-y-8 proposal-page print:page-break-after">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Cierre Inmediato en Casa del Cliente
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Cómo Aseguras Reseñas de 5★ en 5 Segundos
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Todo ocurre en el instante exacto de mayor alegría del cliente: justo cuando ve su trabajo terminado.
            </p>
          </div>

          {/* 3-Step Visual Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-[#0D1424] border border-slate-800 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 font-black text-sm flex items-center justify-center">
                    1
                  </span>
                  <QrCode className="w-6 h-6 text-cyan-400" />
                </div>
                <h4 className="font-extrabold text-white text-base">
                  Acerca tu Tarjeta PVC (NFC)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Al terminar el trabajo, sacas tu tarjeta de presentación inteligente: <em>"¿Me colabora con 5 segundos acercando su celular aquí para calificarme?"</em>. La pantalla abre en <strong>menos de 1 segundo</strong>.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 text-[11px] text-slate-400 font-medium">
                ⚡ Cero descargas: el cliente solo acerca su celular.
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
                  Redirección instantánea a Google Maps. <strong>Abre directo la ventana con las 5 estrellas marcadas</strong> para que el cliente solo toque "Publicar".
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/40 text-[11px] text-emerald-300 font-semibold">
                📈 Tu perfil sube al Top 3 de tu ciudad.
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
                  Detalle Inconforme (1 a 3★)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Google Maps queda 100% bloqueado.</strong> El reclamo entra a tu WhatsApp privado para que ajustes el trabajo o apliques garantía antes de que te dañen la reputación.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-red-950/40 text-[11px] text-red-300 font-semibold">
                🛡️ 0 daño público. Reputación protegida al 100%.
              </div>
            </div>

          </div>

          {/* The Post-Review Powerhouse */}
          <div className="p-6 rounded-2xl bg-[#0D1424] border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                <Globe className="w-4 h-4" />
                <span>Página Web Portafolio Móvil Incluida</span>
              </div>
              <h4 className="font-black text-white text-base sm:text-lg">
                Galería de Trabajos "Antes y Después" + Botón WhatsApp
              </h4>
              <p className="text-xs text-slate-300">
                Tu web oficial carga en <strong className="text-white">&lt;1.2 segundos</strong>. Permite que nuevos clientes vean tus fotos de trabajos anteriores y toquen: <strong className="text-emerald-400">"Envíanos una foto de tu trabajo y te cotizamos por WhatsApp"</strong>.
              </p>
            </div>
            <div className="shrink-0 px-4 py-2.5 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-300 text-xs font-extrabold">
              Cotizaciones Directas a tu WhatsApp
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PÁGINA 3: PLANES ESPECIALES & OFERTA PILOTO IRRESISTIBLE */}
        {/* ========================================================================= */}
        <section className="space-y-8 proposal-page">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Inversión Ajustada al Bolsillo del Independiente
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Tarifas Especiales: Servicios a Domicilio
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
                  <th className="p-3.5 font-bold text-center">Plan Básico Independiente</th>
                  <th className="p-3.5 font-bold text-center bg-cyan-950/40 text-cyan-300 border-x border-cyan-500/30">
                    Plan Pro Móvil (Recomendado)
                  </th>
                  <th className="p-3.5 font-bold text-center">Solo Montaje Fijo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-[#0A0F1D] text-slate-300">
                <tr>
                  <td className="p-3 font-semibold text-white">Hardware de Bolsillo</td>
                  <td className="p-3 text-center">1 Tarjeta PVC (NFC + QR)</td>
                  <td className="p-3 text-center font-bold text-cyan-300 bg-cyan-950/20 border-x border-cyan-500/20">
                    1 Tarjeta PVC + 2 Stickers QR para Maletín/Vehículo
                  </td>
                  <td className="p-3 text-center text-slate-500">Sin hardware</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Ficha Google Maps (Área de Servicio)</td>
                  <td className="p-3 text-center">Configurada y verificada</td>
                  <td className="p-3 text-center font-bold text-cyan-300 bg-cyan-950/20 border-x border-cyan-500/20">
                    Optimizada para Top 3 en tu zona
                  </td>
                  <td className="p-3 text-center">Configuración básica</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Filtro Anti-Quejas</td>
                  <td className="p-3 text-center">1 a 3★ van a buzón privado</td>
                  <td className="p-3 text-center font-bold text-cyan-300 bg-cyan-950/20 border-x border-cyan-500/20">
                    Alerta inmediata a WhatsApp (&lt;10 seg)
                  </td>
                  <td className="p-3 text-center text-red-400">Desactivado (abierto a Google)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Asistente IA para Responder Reseñas</td>
                  <td className="p-3 text-center text-slate-500">Plantillas estándar</td>
                  <td className="p-3 text-center font-bold text-cyan-300 bg-cyan-950/20 border-x border-cyan-500/20">
                    IA redacta respuestas profesionales en 5 seg
                  </td>
                  <td className="p-3 text-center text-slate-500">100% manual</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Página Web Portafolio Móvil</td>
                  <td className="p-3 text-center">Hosting continuo y catálogo</td>
                  <td className="p-3 text-center font-bold text-cyan-300 bg-cyan-950/20 border-x border-cyan-500/20">
                    Muro en vivo de reseñas Google + Cotizador WhatsApp
                  </td>
                  <td className="p-3 text-center">Propiedad fija (sin soporte)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Actualizaciones de Fotos & Precios</td>
                  <td className="p-3 text-center">Hasta 2 al mes (precios y datos)</td>
                  <td className="p-3 text-center font-bold text-cyan-300 bg-cyan-950/20 border-x border-cyan-500/20">
                    1 actualización semanal (fotos trabajos, ofertas)
                  </td>
                  <td className="p-3 text-center text-slate-500">No incluidas</td>
                </tr>
                <tr className="border-t-2 border-cyan-500/50 bg-[#0D1424] font-extrabold text-sm">
                  <td className="p-4 text-white">
                    Tarifa Mensual Recurrente
                    <div className="text-[10px] font-normal text-slate-400 mt-0.5">
                      (A partir del día 31 • Mes 1 es $0 COP)
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="text-xs text-slate-500 line-through font-semibold">$140.000 COP</div>
                    <div className="text-cyan-300 font-black text-base">$69.000 <span className="text-xs font-normal">COP/mes</span></div>
                    <div className="text-[10px] text-emerald-400 font-bold tracking-tight mt-0.5">50% OFF ($2.300/día)</div>
                  </td>
                  <td className="p-4 text-center bg-cyan-950/30 border-x border-cyan-500/40">
                    <div className="text-xs text-slate-500 line-through font-semibold">$200.000 COP</div>
                    <div className="text-emerald-400 font-black text-lg">$99.000 <span className="text-xs font-normal">COP/mes</span></div>
                    <div className="text-[10px] text-amber-300 font-bold tracking-tight mt-0.5">50% OFF ($3.300/día)</div>
                  </td>
                  <td className="p-4 text-center text-slate-400">
                    <div className="font-bold text-sm">$0 COP/mes</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Sin soporte continuo</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* The Infallible Pilot Offer Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-cyan-900/80 via-[#0D1424] to-indigo-950/70 border-2 border-cyan-500 shadow-2xl space-y-6 text-left">
            
            {/* Traditional Agency Contrast Banner */}
            <div className="p-3.5 rounded-2xl bg-cyan-950/70 border border-cyan-400/30 flex items-center gap-3 text-xs text-slate-200">
              <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 font-black text-sm shrink-0">
                💡
              </div>
              <div>
                <strong className="text-white">El Retorno con 1 Solo Trabajo:</strong> Una agencia web tradicional cobra entre <strong className="text-amber-300 font-bold">$600.000 y $1.200.000 COP</strong> por una web genérica sin tarjeta NFC ni Google Maps. Con nuestro valor de lanzamiento de <strong className="text-emerald-400 font-bold">$199.000 COP</strong>, recuperas el 100% de tu inversión con el <strong>primer servicio nuevo que te llegue</strong> (un lavado de sala o una reparación promedio cuesta entre $150.000 y $250.000 COP).
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/30 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                  🔥 50% OFF LANZAMIENTO ESPECIAL (SOLO 5 CUPOS POR CIUDAD)
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1.5">
                  Programa Piloto 30 Días: Independientes & Móviles
                </h3>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 line-through font-semibold">$400.000 COP</div>
                <div className="text-2xl sm:text-4xl font-black text-emerald-400">
                  $199.000 COP
                </div>
                <span className="text-[10px] text-slate-300 font-medium">Pago único de montaje (50% Descuento)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Lo que recibes para salir a trabajar:</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>1 Tarjeta PVC Inteligente (NFC + QR)</strong> de presentación para llevar en tu billetera o bolsillo a cada servicio.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Ficha Google Maps oficial (Área de Servicio)</strong> posicionada para tu barrio o ciudad entera sin exponer tu dirección de casa.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Página Web Portafolio Móvil (&lt;1.2s)</strong> con fotos de "Antes y Después" y botón directo a WhatsApp (de tu propiedad definitiva).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>30 Días 100% Bonificados de Plataforma Pro ($0 COP)</strong> con filtro anti-quejas y alertas a WhatsApp.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Tarifa Mensual 50% OFF Congelada para Siempre:</strong> Al terminar el mes de prueba, conservas tu suscripción preferencial ($69.000 Básico o $99.000 Pro) sin incrementos futuros.</span>
                  </li>
                  <li className="flex items-start gap-2 text-amber-300">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Posicionamiento Vitalicio en Directorio Prestigia (Páginas Amarillas 2.0):</strong> Tu servicio figurará de #1 con sello de "Especialista Verificado" en la guía oficial de tu ciudad.</span>
                  </li>
                  <li className="flex items-start gap-2 text-amber-300">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Acceso Vitalicio a la Red de Venta Cruzada & Recomendaciones:</strong> Recibe clientes recomendados por otros comercios y profesionales aliados de tu comunidad sin costo extra.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>El Acuerdo Ganar-Ganar:</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Solo pagas el valor reducido de montaje ($199.000 COP). A cambio, lo único que te pedimos es:
                </p>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">★</span>
                    <span>Acercar tu tarjeta inteligente al cliente al terminar cada servicio.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">★</span>
                    <span>Publicar 2 historias semanales en tus redes sociales destacando tu nueva web oficial y nuestros servicios.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">★</span>
                    <span>Grabar un video testimonio de 30 seg al día 28 con tus resultados.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-slate-700 text-xs text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <strong className="text-white">Cero ataduras al día 30:</strong> Tu web y tu Google Maps son tuyos para siempre desde el día 1. Si decides no pagar la mensualidad, no hay penalidad alguna.
              </div>
              <button
                onClick={handlePrint}
                className="print:hidden shrink-0 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition shadow-lg shadow-cyan-500/20"
              >
                Imprimir Propuesta Oficial
              </button>
            </div>
          </div>

          {/* Objection Handling Cheat Sheet */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-widest text-center">
              Preguntas Frecuentes de Profesionales y Técnicos Independientes
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#0D1424] border border-slate-800 space-y-1.5">
                <strong className="text-white">"¿Tengo que mostrar la dirección de mi casa en Google Maps?"</strong>
                <p className="text-slate-300">
                  No. Configuramos tu perfil como <strong>Área de Servicio (SAB)</strong>. Tu dirección residencial queda totalmente privada y oculta; en el mapa aparecerán los barrios o la ciudad que tú decidas cubrir.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1424] border border-slate-800 space-y-1.5">
                <strong className="text-white">"¿La Tarjeta Inteligente necesita batería o alguna aplicación?"</strong>
                <p className="text-slate-300">
                  No requiere baterías ni aplicaciones. Funciona con tecnología NFC pasiva de por vida (igual que una tarjeta de banco contactless). Solo la acercas al celular del cliente o le muestras el QR trasero.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1424] border border-slate-800 space-y-1.5">
                <strong className="text-white">"¿Cómo me ayuda esto si ya uso grupos de Facebook o volanteo?"</strong>
                <p className="text-slate-300">
                  El volanteo y las redes sociales requieren que persigas al cliente. En cambio, cuando una persona tiene un mueble sucio, una fuga de agua o una cerradura rota, <strong>busca en Google Maps para llamar ya mismo</strong>. Estar de #1 te trae clientes listos para pagar.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1424] border border-slate-800 space-y-1.5">
                <strong className="text-white">"¿Cuánto demora la entrega de mi tarjeta y de mi página web?"</strong>
                <p className="text-slate-300">
                  La entrega de tu página web, ficha de Google Maps y el despacho de tu Tarjeta Inteligente toma únicamente <strong>5 días hábiles</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Call to Action */}
          <footer className="text-center pt-6 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              Prestigia Servicios • Infraestructura y Crecimiento para Servicios a Domicilio • Todos los derechos reservados.
            </p>
          </footer>

        </section>

      </main>
    </div>
  );
}
