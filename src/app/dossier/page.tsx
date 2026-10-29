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
  Users,
  Lock,
  CheckCircle2,
  TrendingUp,
  Download,
  Printer,
  ChevronRight,
  ArrowRight,
  AlertTriangle,
  Zap,
  Globe,
  Gift,
  Building2,
  BarChart3,
  Award,
  Clock,
  Rocket,
  FileSpreadsheet,
} from 'lucide-react';

export default function DossierOficialPage() {
  const [lang, setLang] = useState<'es' | 'en'>('es');

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const isEn = lang === 'en';

  const MODULES = [
    {
      num: 1,
      title: isEn ? 'Private Containment Center' : 'Central de Contención Privada',
      badge: isEn ? '0 WhatsApp / Email Spam' : 'Cero Saturación • En Sala',
      desc: isEn
        ? 'Shielded vault capturing 1, 2, and 3-star ratings. Zero spam to personal WhatsApp or emails. Generates immediate audible and visual alerts in the venue dashboard to resolve disputes before the guest leaves.'
        : 'Bóveda blindada donde quedan retenidas todas las calificaciones de 1, 2 y 3 estrellas. Cero mensajes a WhatsApp ni correos personales para no saturar. Genera alertas sonoras y visuales en sala para resolver de inmediato.',
    },
    {
      num: 2,
      title: isEn ? 'Google Maps Radar & Real-Time Monitor' : 'Radar Google Maps & Monitoreo en Vivo',
      badge: isEn ? 'Live Synced' : 'Google Maps en Tiempo Real',
      desc: isEn
        ? 'Live monitoring of public Google Maps reviews. Displays cumulative ratings, pending reviews, and response velocity without leaving the system.'
        : 'Monitorea en tiempo real todas las opiniones públicas que ingresan a tu ficha de Google Maps. Muestra la calificación acumulada, conteo de reseñas pendientes y velocidad de respuesta.',
    },
    {
      num: 3,
      title: isEn ? 'AI Response Assistant & Dispatch' : 'Centro de Despacho & Asistente IA',
      badge: isEn ? 'AI Multi-Tone' : 'Inteligencia Artificial Multilingüe',
      desc: isEn
        ? 'Generates personalized strategic responses in 3 tones (Warm, Corporate, Promotional) and auto-translates tourist reviews from English or other languages.'
        : 'Motor de Inteligencia Artificial que redacta respuestas oficiales personalizadas en 3 tonos estratégicos (Cálido, Corporativo y Promocional) y traduce automáticamente reseñas de turistas en inglés u otros idiomas.',
    },
    {
      num: 4,
      title: isEn ? '360° Sentiment & Semaphoric Matrix' : 'Sentimiento 360° & Matriz Semáforo',
      badge: isEn ? 'Operational Audit' : 'Auditoría de 4 Ejes',
      desc: isEn
        ? 'Evaluates quality, staff service, waiting times, and atmosphere with an intuitive green-yellow-red warning system to preempt recurring kitchen or reception bottlenecks.'
        : 'Diagnóstico semáforo (Verde, Amarillo, Rojo) que audita comida/producto, servicio, tiempo y ambiente para detectar cuellos de botella antes de que afecten la facturación.',
    },
    {
      num: 5,
      title: isEn ? 'Smart QR Generator & Dissuasive Filter' : 'Smart QR & Filtro Blindado',
      badge: isEn ? 'Instant Material' : 'Imprimibles de Alta Conversión',
      desc: isEn
        ? 'Ready-to-print vector materials and QR codes for tables, counters, card readers, and bill folders with an active rating filter.'
        : 'Descarga instantánea de artes y códigos QR listos para mesas, datáfonos y portacuentas con filtro disuasorio que clasifica experiencias positivas e inconformidades.',
    },
    {
      num: 6,
      title: isEn ? '5-Star Client Reactivation' : 'Reactivación de Clientes 5★',
      badge: isEn ? 'Retention & Repurchase' : 'Fidelización & Recompra',
      desc: isEn
        ? 'Exclusive VIP segment for guests who gave 4 or 5 stars. Automates seasonal invitations and incentives to ensure their repeat visits.'
        : 'Módulo de fidelización exclusivo para clientes que calificaron 4 o 5 estrellas. Permite enviar beneficios exclusivos, novedades y recordatorios para asegurar su regreso.',
    },
    {
      num: 7,
      title: isEn ? 'VIP Giveaways & Gamified Prize Wheel' : 'Sorteos VIP & Motor de Ruleta',
      badge: isEn ? 'Data Privacy Compliant' : 'Ruleta Interactiva • Ley 1581',
      desc: isEn
        ? 'Official gamification module with a prize wheel that encourages table reviews while securely collecting first-party customer phone numbers and names.'
        : 'Módulo de gamificación con ruleta de premios y sorteos mensuales oficiales. Motiva al cliente a calificar desde su celular para ganar incentivos, capturando su nombre y WhatsApp bajo Habeas Data.',
    },
    {
      num: 8,
      title: isEn ? 'Executive Reports & Staff Podium' : 'Reportes Ejecutivos & Podio de Personal',
      badge: isEn ? 'ROI & Accountability' : 'Auditoría de Personal • Métricas ROI',
      desc: isEn
        ? 'Tracks revenue protected from contained complaints, net customer retention rate, individual server/advisor scores, and PDF executive export.'
        : 'Métricas de dinero protegido frente a quejas evitadas, tasa de retención neta, ranking de atención por colaborador y exportación de reportes ejecutivos en PDF.',
    },
    {
      num: 9,
      title: isEn ? 'Brand Management & Multi-Branch Control' : 'Marca & Control Multi-Sedes',
      badge: isEn ? 'Holdings & Chains' : 'Conmutador Multisede & Turnos',
      desc: isEn
        ? 'Central management hub for multiple physical locations, shift managers, and customized visual branding across restaurant groups and franchise networks.'
        : 'Panel de administración general donde gestionas múltiples sedes físicas, asignas administradores de turno independientes y personalizas la identidad visual de tu marca.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#06080E] text-slate-100 font-sans antialiased selection:bg-amber-500/20 selection:text-amber-300 pb-20">
      {/* Print Stylesheet for Flawless A4 Corporate PDF Export */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            margin: 10mm 10mm;
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
            margin-bottom: 10px !important;
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

      {/* FLOATING ACTION BAR (NO-PRINT) */}
      <header className="no-print sticky top-0 z-50 backdrop-blur-2xl bg-[#06080E]/90 border-b border-slate-800/80 px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-indigo-800 flex items-center justify-center p-1.5 shadow-md">
                <PrestigiaIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm tracking-wider text-white">PRESTIGIA</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                    {isEn ? 'Official Dossier 2026' : 'Dossier Oficial 2026'}
                  </span>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Language Toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLang('es')}
                className={`px-2.5 py-1 rounded-lg transition ${lang === 'es' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'}`}
              >
                🇪🇸 ES
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-lg transition ${lang === 'en' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'}`}
              >
                🇺🇸 EN
              </button>
            </div>

            {/* Print / Download PDF Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isEn ? 'Download / Print PDF' : 'Descargar en PDF / Imprimir'}</span>
            </button>

            {/* Return to Home */}
            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700 transition"
            >
              {isEn ? '← Home' : '← Volver a Inicio'}
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN DOCUMENT BODY */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 pt-8 space-y-12">
        
        {/* COVER / EXECUTIVE HEADER */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0F1626] to-[#0A0E18] border-2 border-amber-500/30 shadow-2xl relative overflow-hidden print-card-dark">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center p-2.5">
                <PrestigiaIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">PRESTIGIA</h1>
                <p className="text-xs text-amber-300/90 font-medium">
                  {isEn ? 'B2B Commercial Growth & Reputation Shielding Suite' : 'Suite de Crecimiento Comercial & Blindaje Reputacional B2B'}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                {isEn ? 'DOCUMENT CODE:' : 'CÓDIGO DE DOCUMENTO:'} <strong className="text-white">PR-DOSSIER-2026</strong>
              </span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 sm:justify-end">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isEn ? 'Active Commercial Version' : 'Versión Comercial Activa'}</span>
              </span>
            </div>
          </div>

          <div className="pt-8 space-y-4">
            <h2 className="text-xl sm:text-3xl font-black text-white leading-tight">
              {isEn
                ? 'Strategic Solution to Dominate Google Maps and Eliminate Public Reputation Leaks'
                : 'Solución Estratégica para Liderar Google Maps y Neutralizar Fugas de Clientes en Sala'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {isEn
                ? 'This official dossier presents Prestigia’s proprietary technology architecture. Designed specifically for high-ticket hospitality, culinary chains, healthcare centers, and multi-location retail brands seeking to systematically multiply 5-star Google Maps reviews while containing 100% of negative feedback privately in-house.'
                : 'Este dossier oficial presenta la arquitectura tecnológica de Prestigia, diseñada para restaurantes, clínicas, hoteles y cadenas de retail que requieren multiplicar sistemáticamente sus reseñas 5 estrellas en Google Maps mientras blindan y resuelven el 100% de quejas internamente en sala sin saturar WhatsApp ni correos personales.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 mt-6 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block">{isEn ? 'Average Rating Target:' : 'Meta de Calificación:'}</span>
              <span className="text-amber-400 font-black text-base">4.8+ ★ Google Maps</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block">{isEn ? 'Damage Prevention Rate:' : 'Contención de Daño Público:'}</span>
              <span className="text-emerald-400 font-black text-base">100% Blindado en Sala</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 block">{isEn ? 'Corporate Backing:' : 'Respaldo Institucional:'}</span>
              <span className="text-cyan-400 font-black text-base">Technological Solutions</span>
            </div>
          </div>
        </section>

        {/* SECTION 1: THE BUSINESS PROBLEM */}
        <section className="space-y-4 print-card p-6 rounded-2xl bg-[#090D17] border border-slate-800">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>{isEn ? '1. The Real Cost of Bad Reviews' : '1. El Costo Oculto de las Malas Reseñas'}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">
            {isEn
              ? 'Why a single 1-star review on Google Maps costs up to $3,500 USD / month'
              : 'Por qué una sola calificación de 1 estrella le cuesta a un local hasta $3.500 USD / mes'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isEn
              ? 'According to global hospitality analytics, 84% of consumers check Google Maps before choosing a restaurant or healthcare service. When a rating drops below 4.2 stars, venue foot traffic drops by 27% immediately. Uncontained incidents spread to public platforms and cannot be easily deleted.'
              : 'El 84% de los consumidores consulta la ficha de Google Maps antes de elegir dónde comer, alojarse o atender su salud. Cuando la calificación cae por debajo de 4.2 estrellas, el tráfico de nuevos clientes se desploma un 27% de inmediato. Una queja pública expuesta en internet ahuyenta prospectos durante años.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-rose-300">
              <strong>{isEn ? 'Without Prestigia:' : 'Sin Prestigia:'}</strong>{' '}
              {isEn
                ? 'The dissatisfied diner leaves silently and vents publicly on Google Maps. The venue owner only finds out days later when damage is already permanent.'
                : 'El comensal o cliente inconforme se va en silencio y publica su queja directamente en Google Maps. El dueño se entera días después cuando el daño ya es irreparable.'}
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-300">
              <strong>{isEn ? 'With Prestigia Shield:' : 'Con Prestigia:'}</strong>{' '}
              {isEn
                ? 'The 1-3 star complaint is contained inside the venue system with an instant audio alert. Management resolves the issue at the table in under 10 minutes.'
                : 'La queja de 1, 2 o 3 estrellas queda retenida en el portal en sala con alerta sonora instantánea. El administrador resuelve en mesa en menos de 10 minutos.'}
            </div>
          </div>
        </section>

        {/* SECTION 2: THE 3-STEP SOLUTION ARCHITECTURE */}
        <section className="space-y-4 print-card p-6 rounded-2xl bg-[#090D17] border border-slate-800">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>{isEn ? '2. The 3-Layer Shielding Architecture' : '2. La Arquitectura de Blindaje en 3 Capas'}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">
            {isEn ? 'How the Smart QR Filter Works' : 'Cómo opera el Filtro Inteligente de Reputación'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black">
                1
              </div>
              <h4 className="font-bold text-white text-sm">
                {isEn ? 'Touchless QR Scan' : 'Escaneo Ágil en Mesa'}
              </h4>
              <p className="text-slate-300 leading-relaxed">
                {isEn
                  ? 'No app downloads or registrations required. Diner scans the Smart QR placed on table acrylics, bill folders, or checkout counters.'
                  : 'Sin instalar apps ni registros engorrosos. El cliente escanea el Smart QR en habladores de mesa, datáfonos o portacuentas en 3 segundos.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                2
              </div>
              <h4 className="font-bold text-white text-sm">
                {isEn ? 'Intelligent Rating Filter' : 'Filtro Disuasorio de Estrellas'}
              </h4>
              <p className="text-slate-300 leading-relaxed">
                {isEn
                  ? '4 & 5 stars are forwarded to Google Maps with incentives (VIP Wheel). 1, 2, and 3 stars are quarantined in the private containment console.'
                  : '4 y 5 estrellas se canalizan a Google Maps con incentivos (Ruleta VIP). 1, 2 y 3 estrellas van a la bóveda privada de contención en sala.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                3
              </div>
              <h4 className="font-bold text-white text-sm">
                {isEn ? 'In-Venue Resolution' : 'Resolución en Sala & Base Propia'}
              </h4>
              <p className="text-slate-300 leading-relaxed">
                {isEn
                  ? 'Audible alert on venue tablet/PC allows managers to approach the table immediately, turning an upset customer into a lifelong advocate.'
                  : 'Alerta sonora en el panel para que el administrador atienda al cliente antes de que salga, capturando su contacto bajo Habeas Data.'}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: THE 9 OFFICIAL PORTAL TABS */}
        <section className="space-y-4 print-card p-6 rounded-2xl bg-[#090D17] border border-slate-800 page-break-before">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>{isEn ? '3. The 9 Operational Modules' : '3. Las 9 Pestañas Operativas del Portal'}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">
            {isEn
              ? 'Complete Software Tour (Client Portal 1:1)'
              : 'Estructura Completa de la Cabina Operativa'}
          </h3>
          <p className="text-xs text-slate-300">
            {isEn
              ? 'The Client Portal gives your management team real-time visibility across all 9 operational dimensions:'
              : 'El Portal Clientes le otorga a tu equipo de operaciones control absoluto sobre las 9 dimensiones clave del negocio:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2 text-xs">
            {MODULES.map((m) => (
              <div
                key={m.num}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-800">
                    <span className="font-mono text-[11px] text-amber-400 font-bold">
                      #{m.num}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 truncate">
                      {m.badge}
                    </span>
                  </div>
                  <h4 className="font-black text-white text-sm mt-2">{m.title}</h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed mt-1">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: BESPOKE COMMERCIAL MODEL */}
        <section className="space-y-4 print-card p-6 rounded-2xl bg-[#090D17] border border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>{isEn ? '4. Tailored Investment Plans' : '4. Planes Comerciales a la Medida'}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">
            {isEn
              ? 'Consultative & Scalable Pricing Model'
              : 'Modelo Consultivo y Escalonado con Retorno Garantizado'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isEn
              ? 'Prestigia does not impose rigid generic rates. Every agreement is tailored according to your venue location count, monthly footfall volume, and dedicated staff support requirements.'
              : 'Prestigia opera bajo un modelo de consultoría estratégica sin tarifas genéricas rígidas. Analizamos el número de sedes físicas, volumen de clientes mensuales y nivel de soporte requerido para estructurar una tarifa que se pague sola desde el primer mes.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Nivel 1 • {isEn ? '1 Location' : '1 Sede'}</span>
              <h4 className="font-black text-base text-white">Plan Básico</h4>
              <p className="text-slate-400 text-[11px]">
                {isEn ? 'Essential protection for single-location venues.' : 'Blindaje esencial para negocios de 1 sola sede.'}
              </p>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isEn ? 'Smart QR with dissuasive filter' : 'Smart QR con filtro disuasorio'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isEn ? 'In-venue Private Containment' : 'Central de Contención Privada en sala'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isEn ? 'Google Maps monitoring radar' : 'Radar de monitoreo Google Maps'}</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-950/20 border-2 border-indigo-500/40 space-y-3 relative">
              <span className="text-[10px] font-mono uppercase text-indigo-400 tracking-wider">Nivel 2 • {isEn ? 'Recommended' : 'Más Elegido'}</span>
              <h4 className="font-black text-base text-white">Plan Pro</h4>
              <p className="text-slate-400 text-[11px]">
                {isEn ? 'AI dispatch, staff podium, and retention.' : 'Inteligencia Artificial, podio de meseros y retención.'}
              </p>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{isEn ? 'All features from Básico' : 'Todo lo incluido en Plan Básico'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{isEn ? 'AI Assistant in 3 strategic tones' : 'Asistente IA en 3 tonos estratégicos'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{isEn ? 'Staff podium & 360° sentiment audit' : 'Podio de personal y auditoría 360°'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{isEn ? 'VIP customer reactivation campaigns' : 'Módulo de reactivación de clientes 5★'}</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-purple-950/20 border-2 border-purple-500/40 space-y-3">
              <span className="text-[10px] font-mono uppercase text-purple-400 tracking-wider">Nivel 3 • {isEn ? 'Up to 3 Venues' : 'Hasta 3 Sedes'}</span>
              <h4 className="font-black text-base text-white">Plan Élite</h4>
              <p className="text-slate-400 text-[11px]">
                {isEn ? 'Multi-branch brands with TV displays.' : 'Marcas multisede con TV en salón.'}
              </p>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{isEn ? 'All features from Pro' : 'Todo lo incluido en Plan Pro'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{isEn ? 'Central multi-branch switcher (1-3)' : 'Conmutador multisede (1 a 3 sedes)'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{isEn ? 'Live TV Wallboard mode for screens' : 'Modo TV Wallboard para pantallas'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{isEn ? 'Multi-winner VIP giveaways' : 'Sorteos VIP multi-ganador'}</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-950/20 border-2 border-cyan-500/40 space-y-3">
              <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider">Nivel 4 • {isEn ? 'Enterprise Unlimited' : 'Holding Ilimitado'}</span>
              <h4 className="font-black text-base text-white">Plan Empresarial</h4>
              <p className="text-slate-400 text-[11px]">
                {isEn ? 'Franchises, nationwide holdings, and API integration.' : 'Franquicias, holdings nacionales y API dedicada.'}
              </p>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{isEn ? 'All features from Élite' : 'Todo lo incluido en Plan Élite'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{isEn ? 'Unlimited physical branches & venues' : 'Sedes físicas y locales ilimitados'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{isEn ? 'REST API & Webhooks data stream' : 'Integración vía API REST & Webhooks'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{isEn ? 'Dedicated Account Manager & 24/7 SLA' : 'Account Manager dedicado & SLA 99.98%'}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 5: CORPORATE BACKING & GUARANTEE */}
        <section className="p-8 rounded-3xl bg-[#090F1C] border border-cyan-500/30 print-card text-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <TechnologicalSolutionsLogo className="h-8" showText={true} />
            </div>
            <div className="text-left sm:text-right text-[11px] text-slate-400">
              <span>{isEn ? 'Enterprise Infrastructure & Global SLA' : 'Infraestructura Empresarial & SLA Global 99.98%'}</span>
            </div>
          </div>

          <p className="text-slate-300 leading-relaxed text-xs">
            {isEn
              ? 'Prestigia is developed, monitored, and hosted under enterprise compliance standards by Technological Solutions Software. Protected by military-grade TLS/AES-256 encryption, Habeas Data data privacy compliance, and dedicated engineering support.'
              : 'Prestigia es desarrollado, alojado y monitoreado bajo los más estrictos estándares de alta disponibilidad de Technological Solutions Software. Cuenta con cifrado de grado militar TLS/AES-256, cumplimiento legal de Habeas Data (Ley 1581) y soporte corporativo B2B.'}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
            <span>
              Prestigia &copy; 2026 &bull; {isEn ? 'All rights reserved.' : 'Todos los derechos reservados.'}
            </span>
            <div className="flex items-center gap-3 font-bold text-amber-400">
              <a
                href="https://wa.me/573058314049?text=Hola%20Prestigia,%20le%C3%AD%20el%20Dossier%20Oficial%20y%20deseo%20una%20propuesta"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1 text-emerald-400"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{isEn ? 'Contact Executive Sales' : 'Contactar Consultor Comercial'}</span>
              </a>
              <span>&bull;</span>
              <Link href="/" className="hover:underline text-cyan-400">
                <span>{isEn ? 'Visit Official Portal' : 'Ver Portal Oficial'}</span>
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
