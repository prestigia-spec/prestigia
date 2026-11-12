'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PrestigiaIcon } from '@/components/PrestigiaIcon';
import { TechnologicalSolutionsLogo } from '@/components/TechnologicalSolutionsLogo';
import BoldCheckoutModal, { BoldPlanTier } from '@/components/BoldCheckoutModal';
import {
  CheckCircle2,
  Download,
  Sparkles,
  TrendingUp,
  DollarSign,
  Award,
  ShieldCheck,
  Flame,
  ArrowRight,
  Zap,
  Building2,
  Users,
  Rocket,
  Clock,
  Gift,
  Percent,
  MapPin,
  Search,
  LifeBuoy,
  Scale,
  MessageCircle,
  Coins,
  CreditCard,
} from 'lucide-react';

export default function MasterclassPlanesPage() {
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutPlanTier, setCheckoutPlanTier] = useState<BoldPlanTier>('level_2');

  const openPlanCheckout = (tier: BoldPlanTier) => {
    setCheckoutPlanTier(tier);
    setCheckoutOpen(true);
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = lang === 'en'
        ? 'Prestigia | B2B Partner Plans & Credit Economics 2026'
        : 'Prestigia | Planes Oficiales de Partners & Economía de Créditos 2026';
    }
  }, [lang]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const isEn = lang === 'en';

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

      {/* FLOATING ACTION BAR (NO-PRINT) */}
      <header className="no-print sticky top-0 z-50 backdrop-blur-2xl bg-[#06080E]/90 border-b border-slate-800/80 px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <PrestigiaIcon className="w-8 h-8 drop-shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm tracking-wider text-white">PRESTIGIA</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                    {isEn ? 'Masterclass Partner Dossier' : 'Dossier Masterclass Partners'}
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
              <span>{isEn ? 'Download / Print PDF (A4)' : 'Descargar en PDF / Imprimir (A4)'}</span>
            </button>

            {/* Direct WhatsApp CTA */}
            <a
              href={isEn ? "https://wa.me/573058314049?text=Hello%20Prestigia,%20I%20want%20to%20activate%20my%20Local%20Studio%20Partner%20Plan" : "https://wa.me/573058314049?text=Hola%20Prestigia,%20deseo%20activar%20mi%20Plan%20de%20Partner%20en%20Local%20Studio"}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{isEn ? 'Activate Plan' : 'Activar Plan'}</span>
            </a>
          </div>
        </div>
      </header>

      {/* MAIN DOCUMENT BODY */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 pt-8 space-y-10">

        {/* COVER / EXECUTIVE HEADER */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0F1626] to-[#0A0E18] border-2 border-amber-500/30 shadow-2xl relative overflow-hidden print-card-dark">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <PrestigiaIcon className="w-12 h-12 drop-shadow-lg shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">PRESTIGIA</h1>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
                    5★ SUITE
                  </span>
                </div>
                <p className="text-xs text-amber-300/90 font-medium">
                  {isEn
                    ? 'Local Studio • B2B Commercial Partner & Agency Credit Economics'
                    : 'Local Studio • Programa Oficial de Partners & Economía de Créditos B2B'}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                {isEn ? 'DOCUMENT CODE:' : 'CÓDIGO DE DOCUMENTO:'} <strong className="text-white">PR-PARTNER-2026</strong>
              </span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 sm:justify-end">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isEn ? 'Official Masterclass Proposal' : 'Propuesta Oficial Masterclass'}</span>
              </span>
            </div>
          </div>

          <div className="pt-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{isEn ? 'High Margin Business Model (99.8% Gross Margin)' : 'Modelo de Negocio de Alto Margen (99.8% Margen Bruto)'}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white leading-tight">
              {isEn
                ? 'Monetize Google Maps Optimization with Zero Tech Barrier: Invest from $49 USD, Double with Your 1st Client'
                : 'Monetiza la Optimización de Google Maps sin Barrera Técnica: Invierte desde $49 USD y Duplica desde tu 1er Cliente'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {isEn
                ? 'Prestigia Local Studio equips independent advisors and digital agencies with proprietary AI algorithmic engineering. Sell premium profile creation, forensic gap audits, 72h listing rescues (held by third parties or former agencies), and review appeals at $100–$250 USD each (agency market standard), generating immediate cash flow while building recurring revenue through Prestigia annual software agreements.'
                : 'Prestigia Local Studio equipa a consultores independientes y agencias digitales con ingeniería algorítmica de IA propia. Vende creación técnica de fichas, auditorías forenses Top 3, rescates de ficha en 72h (en manos de terceros o ex-agencias) y apelación de reseñas falsas de $100 a $250 USD por cada servicio (estándar de cobro en agencias), recuperando el 100% de tu inversión desde tu primera venta y generando comisiones de contado con paquetes anuales de Prestigia.'}
            </p>
          </div>

          {/* 3 Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 mt-6 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 block">{isEn ? 'Immediate Breakeven:' : 'Punto de Equilibrio Inmediato:'}</span>
              <span className="text-emerald-400 font-black text-base flex items-center gap-1">
                <Rocket className="w-4 h-4 text-emerald-400" />
                <span>{isEn ? '1 Single Client ($100 - $250 USD)' : '1 Solo Cliente ($100 - $250 USD)'}</span>
              </span>
              <span className="text-[10px] text-slate-400 block">{isEn ? 'Recovers 204% to 510% of investment' : 'Recupera del 204% al 510% de la inversión'}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 block">{isEn ? 'Suggested End-Client Price:' : 'Precio Sugerido al Cliente:'}</span>
              <span className="text-amber-400 font-black text-base flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>$100 - $250 USD / {isEn ? 'service' : 'servicio'}</span>
              </span>
              <span className="text-[10px] text-slate-400 block">{isEn ? 'Agency standard fee (High Profit Margin)' : 'Estándar de agencias (Alto Margen)'}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 block">{isEn ? 'Annual Software Commission:' : 'Comisión por Paquetes Anuales:'}</span>
              <span className="text-cyan-400 font-black text-base flex items-center gap-1">
                <Percent className="w-4 h-4 text-cyan-400" />
                <span>10% • 20% • 25% {isEn ? 'Cash' : 'de Contado'}</span>
              </span>
              <span className="text-[10px] text-slate-400 block">{isEn ? 'Liquidated upfront on full annual plan' : 'Liquidado completo en una sola transferencia'}</span>
            </div>
          </div>
        </section>

        {/* SECTION 1: MASTER COMPARISON TABLE */}
        <section className="space-y-4 print-card p-6 rounded-2xl bg-[#090D17] border border-slate-800">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>{isEn ? '1. Official Credit Packages & Partner Tiers' : '1. Planes Oficiales por Créditos & Escalas de Partner'}</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              {isEn ? 'Agency Standard: $100 - $250 USD / service' : 'Estándar en Agencias: $100 - $250 USD / servicio'}
            </span>
          </div>

          <p className="text-xs text-slate-300">
            {isEn
              ? 'Every plan grants full, unrestricted access to all 5 AI production engines and white-label PDF exports. Solo advisors operate with the exact same power as a top agency from day one; the only difference is the credit volume and commission tier.'
              : 'Todos los planes otorgan acceso total e idéntico a las 5 herramientas de ingeniería de IA y a la exportación de informes en PDF con tu marca. El consultor independiente opera desde el día uno con el mismo poder de una agencia pro; la única diferencia es el volumen de créditos y la escala de comisiones.'}
          </p>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-3">

            {/* Plan 1: Asesor Independiente */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                    {isEn ? 'Independent Advisor' : 'Asesor Independiente'}
                  </span>
                  <span className="text-slate-500 text-xs font-mono">{isEn ? 'Tier 1' : 'Nivel 1'}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">$49 <span className="text-xs text-slate-400 font-normal">USD</span></h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isEn ? 'Ideal for solo consultors and beginners.' : 'Para consultores independientes y egresados.'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold text-white">
                    <span>{isEn ? 'Total Credits Included:' : 'Total Créditos Incluidos:'}</span>
                    <span className="text-amber-400 font-mono text-sm">50 {isEn ? 'Credits' : 'Créditos'}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">
                    10 {isEn ? 'credits in each of the 5 tabs' : 'créditos en cada una de las 5 pestañas'} ($0.98 USD / {isEn ? 'use' : 'uso'})
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 pt-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>10</strong> {isEn ? 'New Profile Creations (Tab 1)' : 'Creaciones de Ficha Nueva (Pestaña 1)'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>10</strong> {isEn ? 'Top 3 Forensic Audits (Tab 2)' : 'Auditorías Forenses Top 3 (Pestaña 2)'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>10</strong> {isEn ? 'Listing Rescues - 72h Protocol (Tab 3)' : 'Rescates de Ficha - Protocolo 72h (Pestaña 3)'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>10</strong> {isEn ? '1-Star Review Appeals (Tab 4)' : 'Apelaciones de Reseñas 1★ (Pestaña 4)'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>10</strong> {isEn ? 'Prospect & Close: Forensic Pitch & Search Volume (Tab 5)' : 'Prospección & Cierre: Propuesta Forense y Volumen de Búsqueda (Pestaña 5)'}</span>
                  </li>
                  <li className="flex items-center gap-2 text-emerald-300 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{isEn ? 'White Label PDF Dossier Exports' : 'Exportación de PDF con Logo Marca Blanca'}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-emerald-300">
                  <strong>{isEn ? 'Breakeven:' : 'Retorno:'}</strong> {isEn ? '1 client at $100–$250 USD = 204% to 510% recovered.' : 'Vendes 1 cliente a $100-$250 USD y recuperas del 204% al 510% de tu inversión.'}
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{isEn ? 'Prestigia Recurring Commission:' : 'Comisión Prestigia Recurrente:'}</span>
                  <span className="text-cyan-400 font-black">{isEn ? '10% (Monthly & Prepaid)' : '10% (Mensual & Contado)'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{isEn ? 'Revenue Potential:' : 'Potencial de Venta:'}</span>
                  <span className="text-amber-400 font-black">{isEn ? '$5,000 to $12,500 USD' : '$5.000 a $12.500 USD'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => openPlanCheckout('level_1')}
                  className="no-print mt-3 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isEn ? 'Activate Plan • $49 USD' : 'Adquirir con Bold • $49 USD'}</span>
                </button>
              </div>
            </div>

            {/* Plan 2: Agencias (Recomendado) */}
            <div className="p-5 rounded-2xl bg-indigo-950/20 border-2 border-indigo-500/50 space-y-4 flex flex-col justify-between relative shadow-xl shadow-indigo-950/30">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-indigo-600 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-md">
                {isEn ? '★ Most Popular' : '★ Más Elegido'}
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                    {isEn ? 'Digital Agency' : 'Plan Agencias'}
                  </span>
                  <span className="text-indigo-400 text-xs font-mono">{isEn ? 'Tier 2' : 'Nivel 2'}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">$90 <span className="text-xs text-slate-400 font-normal">USD</span></h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {isEn ? 'For commercial teams and active agencies.' : 'Para agencias digitales y equipos comerciales activos.'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-indigo-500/30 space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold text-white">
                    <span>{isEn ? 'Total Credits Included:' : 'Total Créditos Incluidos:'}</span>
                    <span className="text-amber-400 font-mono text-sm">100 {isEn ? 'Credits' : 'Créditos'}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">
                    20 {isEn ? 'credits in each of the 5 tabs' : 'créditos en cada una de las 5 pestañas'} ($0.90 USD / {isEn ? 'use' : 'uso'})
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-200 pt-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span><strong>20</strong> {isEn ? 'New Profile Creations (Tab 1)' : 'Creaciones de Ficha Nueva (Pestaña 1)'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span><strong>20</strong> {isEn ? 'Top 3 Forensic Audits (Tab 2)' : 'Auditorías Forenses Top 3 (Pestaña 2)'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span><strong>20</strong> {isEn ? 'Listing Rescues - 72h Protocol (Tab 3)' : 'Rescates de Ficha - Protocolo 72h (Pestaña 3)'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span><strong>20</strong> {isEn ? '1-Star Review Appeals (Tab 4)' : 'Apelaciones de Reseñas 1★ (Pestaña 4)'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span><strong>20</strong> {isEn ? 'Prospect & Close: Forensic Pitch & Search Volume (Tab 5)' : 'Prospección & Cierre: Propuesta Forense y Volumen de Búsqueda (Pestaña 5)'}</span>
                  </li>
                  <li className="flex items-center gap-2 text-amber-300 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{isEn ? 'White Label PDF Dossier Exports' : 'Exportación de PDF con Logo Marca Blanca'}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-emerald-300">
                  <strong>{isEn ? 'Breakeven:' : 'Retorno:'}</strong> {isEn ? '1 single $100–$250 USD client pays the plan (111% to 277% return).' : 'Con 1 solo cliente ($100-$250 USD) pagas el plan y ganas del 111% al 277%.'}
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{isEn ? 'Prestigia Recurring Commission:' : 'Comisión Prestigia Recurrente:'}</span>
                  <span className="text-cyan-400 font-black text-sm">{isEn ? '20% (Monthly & Prepaid)' : '20% (Mensual & Contado)'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{isEn ? 'Revenue Potential:' : 'Potencial de Venta:'}</span>
                  <span className="text-amber-400 font-black">{isEn ? '$10,000 to $25,000 USD' : '$10.000 a $25.000 USD'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => openPlanCheckout('level_2')}
                  className="no-print mt-3 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xl shadow-amber-500/25"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isEn ? 'Activate Partner Plan • $90 USD' : 'Adquirir con Bold • $90 USD'}</span>
                </button>
              </div>
            </div>

            {/* Plan 3: Súper Agencias */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 font-bold border border-cyan-500/30">
                    {isEn ? 'Super Agency' : 'Súper Agencias'}
                  </span>
                  <span className="text-cyan-400 text-xs font-mono">{isEn ? 'Tier 3' : 'Nivel 3'}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">$140 <span className="text-xs text-slate-400 font-normal">USD</span></h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isEn ? 'For high-volume prospecting and franchise networks.' : 'Para prospección masiva y redes de franquicias.'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold text-white">
                    <span>{isEn ? 'Total Credits Included:' : 'Total Créditos Incluidos:'}</span>
                    <span className="text-amber-400 font-mono text-sm">150 {isEn ? 'Credits' : 'Créditos'}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">
                    30 {isEn ? 'credits in each of the 5 tabs' : 'créditos en cada una de las 5 pestañas'} ($0.93 USD / {isEn ? 'use' : 'uso'})
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 pt-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span><strong>30</strong> {isEn ? 'New Profile Creations (Tab 1)' : 'Creaciones de Ficha Nueva (Pestaña 1)'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span><strong>30</strong> {isEn ? 'Top 3 Forensic Audits (Tab 2)' : 'Auditorías Forenses Top 3 (Pestaña 2)'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span><strong>30</strong> {isEn ? 'Listing Rescues - 72h Protocol (Tab 3)' : 'Rescates de Ficha - Protocolo 72h (Pestaña 3)'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span><strong>30</strong> {isEn ? '1-Star Review Appeals (Tab 4)' : 'Apelaciones de Reseñas 1★ (Pestaña 4)'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span><strong>30</strong> {isEn ? 'Prospect & Close: Forensic Pitch & Search Volume (Tab 5)' : 'Prospección & Cierre: Propuesta Forense y Volumen de Búsqueda (Pestaña 5)'}</span>
                  </li>
                  <li className="flex items-center gap-2 text-cyan-300 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{isEn ? 'White Label PDF Dossier Exports' : 'Exportación de PDF con Logo Marca Blanca'}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-emerald-300">
                  <strong>{isEn ? 'Breakeven:' : 'Retorno:'}</strong> {isEn ? '1 single $140–$250 USD client recovers 100% to 178% of your investment.' : 'Con 1 solo cliente de $140-$250 USD recuperas del 100% al 178% de la inversión.'}
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{isEn ? 'Prestigia Recurring Commission:' : 'Comisión Prestigia Recurrente:'}</span>
                  <span className="text-cyan-400 font-black text-sm">{isEn ? '30% (Monthly & Prepaid)' : '30% (Mensual & Contado)'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{isEn ? 'Revenue Potential:' : 'Potencial de Venta:'}</span>
                  <span className="text-amber-400 font-black">{isEn ? '$15,000 to $37,500 USD' : '$15.000 a $37.500 USD'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => openPlanCheckout('level_3')}
                  className="no-print mt-3 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:brightness-110 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isEn ? 'Activate Super Agency • $140 USD' : 'Adquirir con Bold • $140 USD'}</span>
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2: THE 5 OPERATIONAL PRODUCTION TABS */}
        <section className="space-y-4 print-card p-6 rounded-2xl bg-[#090D17] border border-slate-800 page-break-before">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>{isEn ? '2. The 5 Monetizable & High-Closing Engines in Local Studio' : '2. Las 5 Herramientas de Producción & Cierre en Local Studio'}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">
            {isEn
              ? 'Why Clients Happily Pay $100–$250 USD for Each Service'
              : 'Por qué los Negocios Pagan Felices entre $100 y $250 USD por Cada Servicio'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isEn
              ? 'Each tab in Prestigia Local Studio automates a critical technical procedure that traditional marketing agencies charge $200–$450 USD to execute manually:'
              : 'Cada pestaña de Prestigia Local Studio automatiza en segundos un procedimiento técnico que a una agencia tradicional le toma días y cobra entre $200 y $450 USD:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
            {/* Engine 1 */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>{isEn ? 'Tab 1: Creation & Technical Setup' : 'Pestaña 1: Creación & Setup Técnico'}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">{isEn ? 'RRP: $100 - $250 USD' : 'PVP: $100 - $250 USD'}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {isEn
                  ? 'Generates exact category taxonomy, SEO title formulas, 745-char commercial descriptions, photo checklist, preventive FAQs, and 60-90s video verification scripts without risk of suspension.'
                  : 'Estructura la ficha desde cero sin riesgo de suspensión. Define categoría primaria oficial, 5 secundarias, título antibloqueo, copy comercial de 745 caracteres, catálogo de servicios y guión de video continuo de 60 segundos.'}
              </p>
            </div>

            {/* Engine 2 */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-indigo-400 font-bold flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-indigo-400" />
                  <span>{isEn ? 'Tab 2: Top 3 Forensic Audit' : 'Pestaña 2: Auditoría Forense Top 3'}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">{isEn ? 'RRP: $100 - $250 USD' : 'PVP: $100 - $250 USD'}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {isEn
                  ? 'Connects to Google Maps API to scan live ratings, review counts, and benchmark the profile against the local Top 3 leaders. Delivers a 5-step prioritized technical action roadmap.'
                  : 'El mejor gancho de prospección. Extrae las métricas reales con la API de Google Maps, diagnostica brechas frente a los 3 líderes de la zona y entrega la hoja de ruta técnica de 5 pasos para escalarlo al Top 3.'}
              </p>
            </div>

            {/* Engine 3 */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-rose-400 font-bold flex items-center gap-1.5">
                  <LifeBuoy className="w-4 h-4 text-rose-400" />
                  <span>{isEn ? 'Tab 3: Rescue Listing (72h Protocol)' : 'Pestaña 3: Rescatar Ficha (Protocolo 72h)'}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">{isEn ? 'RRP: $100 - $250 USD' : 'PVP: $100 - $250 USD'}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {isEn
                  ? 'Recovers control of an existing listing when the owner lost login access (created by a former agency, ex-employee, or third party). Activates Google\'s official 72-hour protocol to rescue the original profile without losing reviews, photos, or commercial seniority.'
                  : 'Recupera el control de una ficha existente cuando el dueño no tiene el correo o la clave (creada por una ex-agencia, exempleado o tercero). Activa el protocolo oficial de 72 horas de Google para rescatar la ficha original del negocio sin perder las reseñas, fotos ni la antigüedad comercial.'}
              </p>
            </div>

            {/* Engine 4 */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-purple-400 font-bold flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-purple-400" />
                  <span>{isEn ? 'Tab 4: 1-Star Review Appeals' : 'Pestaña 4: Apelación de Reseñas 1★'}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">{isEn ? 'RRP: $100 - $250 USD' : 'PVP: $100 - $250 USD'}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {isEn
                  ? 'Algorithmic defense against fake, defamatory, or competitor attack reviews. Generates legal policy violation reports directly mapped to Google Content Policies.'
                  : 'Blindaje reputacional. Redacta la impugnación legal fundamentada en los artículos oficiales de Google (conflicto de interés, difamación, spam o acoso) para solicitar la remoción definitiva de opiniones malintencionadas.'}
              </p>
            </div>

            {/* Engine 5: PROSPECCIÓN & CIERRE */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30 space-y-2 sm:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>{isEn ? 'Tab 5: Prospect & Close (Competitor Audit & 1-Click WhatsApp Pitch)' : 'Pestaña 5: Prospección & Cierre Comercial (Auditoría de Zona & Pitch en 1 Clic)'}</span>
                </span>
                <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">{isEn ? 'RRP: $150 - $300 USD' : 'PVP: $150 - $300 USD'}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {isEn
                  ? 'The ultimate sales engine for businesses without a Google Maps listing or invisible on the map. Simulates a local competitor benchmark in their neighborhood, calculates monthly high-intent search demand, demonstrates revenue currently leaking to competitors, and writes an executive proposal with a 1-click WhatsApp pitch to close $150–$300 USD setup contracts immediately.'
                  : 'El motor de ventas definitivo para monetizar negocios que no tienen ficha o están invisibles en Google Maps. Simula una auditoría forense de competidores de la zona, calcula cuántas personas buscan ese servicio al mes con urgencia de compra, demuestra el dinero que hoy absorben sus rivales y redacta una propuesta comercial ejecutiva con pitch de WhatsApp de 1 clic para cerrar contratos de $150 a $300 USD al instante.'}
              </p>
            </div>
          </div>
        </section>

        {/* MARKET COST REALITY COMPARISON */}
        <section className="space-y-4 print-card p-6 rounded-2xl bg-[#090D17] border border-amber-500/30">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>{isEn ? 'Market Cost Reality: Traditional Agency Software vs. Prestigia Local Studio' : 'Realidad de Costos en el Mercado: Software de Agencia Tradicional vs. Prestigia Local Studio'}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">
            {isEn
              ? 'Why Local Studio Destroys the Fragmented $200/Mo Agency Software Model'
              : 'Por qué Local Studio Deja Obsoleto el Modelo Tradicional de Pagar $200 USD/mes'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isEn
              ? 'Traditional marketing agencies are forced to pay multiple expensive monthly subscriptions in USD, even if they have zero clients in a given month. Prestigia unites everything into one single operational engine with no mandatory monthly fees:'
              : 'Cualquier agencia tradicional que ofrezca posicionamiento en Google Maps tiene que pagar suscripciones mensuales obligatorias en dólares, vendan o no vendan clientes en el mes. Prestigia une todo el flujo en una sola plataforma sin mensualidades forzadas:'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
            {/* Box 1: What Agencies Pay */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 space-y-3">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 font-bold border border-rose-500/20">
                {isEn ? '1. Software Costs for Traditional Agencies' : '1. Lo que Paga una Agencia en Software'}
              </span>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                <li>• <strong>BrightLocal:</strong> {isEn ? '$39 to $79 USD/mo (limited to just 3 to 5 businesses).' : '$39 a $79 USD/mes (para apenas 3 a 5 negocios).'}</li>
                <li>• <strong>Local Falcon (Geo-Grids):</strong> {isEn ? '$25 to $50 USD/mo in credit bundles.' : '$25 a $50 USD/mes en créditos.'}</li>
                <li>• <strong>ChatGPT Plus / Jasper AI:</strong> {isEn ? '$20 to $49 USD/mo for copywriting & appeals.' : '$20 a $49 USD/mes para redactar.'}</li>
              </ul>
              <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/30 text-[11px] text-rose-300 font-semibold">
                {isEn ? 'Total Fixed Monthly Cost: $100 to $200 USD EVERY MONTH, whether they sell or not, doing manual work.' : 'Gasto Fijo Mensual: $100 a $200 USD TODOS los meses, vendas o no vendas clientes, haciendo todo a mano.'}
              </div>
            </div>

            {/* Box 2: What Agencies Charge Clients */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-3">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                {isEn ? '2. Market Rates Charged to End Clients' : '2. Lo que Cobra una Agencia al Cliente'}
              </span>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                <li>• <strong>{isEn ? 'Setup & Technical Optimization:' : 'Setup & Optimización Técnica:'}</strong> {isEn ? '$200 to $500 USD (one-time fee).' : '$200 a $500 USD (un solo pago).'}</li>
                <li>• <strong>{isEn ? 'Monthly Maps Management:' : 'Mantenimiento Mensual Maps:'}</strong> {isEn ? '$150 to $350 USD/mo.' : '$150 a $350 USD/mes.'}</li>
                <li>• <strong>{isEn ? 'Listing Rescue / Ownership Appeal:' : 'Rescate de Ficha / Propiedad:'}</strong> {isEn ? '$150 to $400 USD (Upwork/Fiverr freelancers charge $100+ just for the appeal letter).' : '$150 a $400 USD (en Upwork/Fiverr cobran $100+ solo por la apelación).'}</li>
              </ul>
              <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-300 font-semibold">
                {isEn ? 'High Perceived Value: Businesses happily pay $100–$250 USD per service because losing Google Maps kills their sales.' : 'Alto Valor Percibido: Los negocios pagan felices $100-$250 USD porque no estar en Google Maps los hace quebrar.'}
              </div>
            </div>

            {/* Box 3: The Prestigia Advantage */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 via-slate-950 to-indigo-950/40 border border-emerald-500/40 space-y-3">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                {isEn ? '3. The Prestigia Local Studio Advantage' : '3. La Ventaja Prestigia Local Studio'}
              </span>
              <ul className="space-y-1.5 text-slate-200 text-[11px]">
                <li>• <strong>{isEn ? 'All in 1 single place:' : 'Todo en 1 solo lugar:'}</strong> {isEn ? 'All 5 production engines unified in one integrated suite.' : 'Las 5 herramientas en una sola suite integrada.'}</li>
                <li>• <strong>{isEn ? 'Zero mandatory monthly fees:' : 'Cero mensualidades obligatorias:'}</strong> {isEn ? 'Consume credits at your own pace as you close deals.' : 'Consumes créditos a tu ritmo al vender.'}</li>
                <li>• <strong>{isEn ? '2026 Algorithmic AI:' : 'IA Algorítmica 2026:'}</strong> {isEn ? 'Generates blueprints, audits, and heatmaps in seconds.' : 'Genera blueprints, auditorías y mapas en segundos.'}</li>
                <li>• <strong>{isEn ? 'White-Label PDF Dossier:' : 'Dossier PDF con tu marca:'}</strong> {isEn ? 'Executive reports ready to deliver to your clients.' : 'Informes ejecutivos listos para entregar.'}</li>
              </ul>
              <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-300 font-semibold">
                {isEn ? 'Invest from $49 USD (one-time). Sell 1 single client and pocket a 95% to 99% profit margin.' : 'Inviertes desde $49 USD (pago único). Vendes 1 solo cliente y te queda un margen de ganancia del 95% al 99%.'}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: THE DOUBLE MONETIZATION MODEL & RECURRING COMMISSIONS */}
        <section className="space-y-5 print-card p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#0B1120] to-[#070B14] border-2 border-cyan-500/40 shadow-2xl relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <Percent className="w-4 h-4 text-cyan-400" />
              <span>{isEn ? '3. The Double Monetization Model: Upfront Setup + Lifetime Recurring Prestigia MRR' : '3. El Modelo de Doble Monetización: Setup Inmediato + Renta Recurrente Mensual Prestigia'}</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              {isEn ? 'Active Retention Policy' : 'Regla de Clientes Activos'}
            </span>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {isEn
                ? 'Charge Upfront for the Setup & Build a Passive Monthly Income in USD'
                : 'Cobra de Inmediato por el Setup y Construye una Renta Mensual en Dólares Todos los Meses'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1.5">
              {isEn
                ? 'When you optimize a client with Local Studio, the natural next step is connecting them to Prestigia for automated weekly posts, review defense, and local Top 3 maintenance. You earn 10%, 20%, or 30% commission across ALL Prestigia plans (Monthly, 3-Month, 6-Month, and Annual) as long as the client and your advisor account remain active:'
                : 'Al optimizar la ficha de un cliente con Local Studio, el paso natural es conectarlo a Prestigia para su mantenimiento, blindaje reputacional y posicionamiento continuo. Ganas el 10%, 20% o 30% de comisión en TODOS los planes (Mensuales, Trimestrales, Semestrales y Anuales) mientras el cliente y tu cuenta de asesor permanezcan activos en las plataformas:'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs">
            {/* Box 1: Plan Asesor */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5 flex flex-col justify-between hover:border-cyan-500/30 transition">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                  {isEn ? 'Independent Advisor ($49 USD)' : 'Plan Asesor ($49 USD)'}
                </span>
                <div className="text-3xl font-black text-cyan-400">
                  10% <span className="text-xs text-white font-normal">{isEn ? 'Recurring & Prepaid' : 'Recurrente & Contado'}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {isEn
                    ? 'Earn ~ $10 USD/mo per client. Across Monthly, 3M, 6M, and Annual plans.'
                    : 'Ganas un aprox. de ~$10 USD/mes por cliente en planes mensuales, trimestrales, semestrales o anuales.'}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
                  <span className="text-[10px] text-cyan-300 font-bold block uppercase">{isEn ? 'With only 20 active clients:' : 'Con solo 20 clientes activos:'}</span>
                  <strong className="text-base font-black text-cyan-200">+$200 USD / {isEn ? 'month' : 'mes'}</strong>
                  <span className="text-[10px] text-slate-400 block">{isEn ? 'in 100% passive recurring income.' : 'de renta pasiva mes a mes.'}</span>
                </div>
                <p className="text-[10px] text-emerald-400 font-medium">
                  {isEn
                    ? '⚡ PLUS: $3,000–$5,000 USD upfront cash already collected from Google Maps setups ($150–$250/each).'
                    : '⚡ MÁS: $3.000 a $5.000 USD cobrados de contado de inmediato por los Setups ($150–$250 c/u).'}
                </p>
              </div>
            </div>

            {/* Box 2: Plan Agencias */}
            <div className="p-5 rounded-2xl bg-indigo-950/40 border-2 border-indigo-500/60 space-y-3.5 flex flex-col justify-between relative shadow-lg shadow-indigo-950/40">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                    {isEn ? 'Digital Agency ($90 USD)' : 'Plan Agencias ($90 USD)'}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                    {isEn ? '★ Recommended' : '★ Más Elegido'}
                  </span>
                </div>
                <div className="text-3xl font-black text-cyan-400">
                  20% <span className="text-xs text-white font-normal">{isEn ? 'Recurring & Prepaid' : 'Recurrente & Contado'}</span>
                </div>
                <p className="text-[11px] text-slate-200 leading-relaxed">
                  {isEn
                    ? 'Earn ~ $20 USD/mo per client. Double the recurring income on every single account.'
                    : 'Ganas un aprox. de ~$20 USD/mes por cliente. Duplicas tu renta en cada cuenta cerrada.'}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-indigo-800/60">
                <div className="p-2.5 rounded-xl bg-indigo-900/40 border border-indigo-500/40">
                  <span className="text-[10px] text-indigo-300 font-bold block uppercase">{isEn ? 'With only 20 active clients:' : 'Con solo 20 clientes activos:'}</span>
                  <strong className="text-base font-black text-indigo-200">+$400 a $600 USD / {isEn ? 'month' : 'mes'}</strong>
                  <span className="text-[10px] text-slate-300 block">{isEn ? 'in 100% passive recurring income.' : 'de renta pasiva mes a mes.'}</span>
                </div>
                <p className="text-[10px] text-emerald-300 font-medium">
                  {isEn
                    ? '⚡ PLUS: $4,000–$6,000 USD upfront cash already in your pocket from initial client setups.'
                    : '⚡ MÁS: $4.000 a $6.000 USD cobrados de contado de inmediato por los Setups iniciales.'}
                </p>
              </div>
            </div>

            {/* Box 3: Plan Súper Agencias */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-950/30 to-slate-900 border-2 border-amber-500/60 space-y-3.5 flex flex-col justify-between relative shadow-xl shadow-amber-950/30">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                    {isEn ? 'Super Agency ($140 USD)' : 'Plan Súper Agencias ($140 USD)'}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black">
                    {isEn ? '👑 Max Yield' : '👑 Máximo Retorno'}
                  </span>
                </div>
                <div className="text-3xl font-black text-amber-300">
                  30% <span className="text-xs text-white font-normal">{isEn ? 'Recurring & Prepaid' : 'Recurrente & Contado'}</span>
                </div>
                <p className="text-[11px] text-slate-200 leading-relaxed">
                  {isEn
                    ? 'Earn ~ $30 USD/mo per client. Maximum partnership tier with highest revenue share.'
                    : 'Ganas un aprox. de ~$30 USD/mes por cliente. Máxima jerarquía y el porcentaje más alto.'}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-amber-800/60">
                <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-500/40">
                  <span className="text-[10px] text-amber-300 font-bold block uppercase">{isEn ? 'With only 20 active clients:' : 'Con solo 20 clientes activos:'}</span>
                  <strong className="text-base font-black text-amber-200">+$600 a $900 USD / {isEn ? 'month' : 'mes'}</strong>
                  <span className="text-[10px] text-slate-300 block">{isEn ? 'in 100% passive recurring income.' : 'de renta pasiva mensual permanente.'}</span>
                </div>
                <p className="text-[10px] text-emerald-300 font-medium">
                  {isEn
                    ? '⚡ PLUS: $5,000–$7,000 USD upfront cash already in your pocket from initial client setups.'
                    : '⚡ MÁS: $5.000 a $7.000 USD cobrados de contado de inmediato por los Setups iniciales.'}
                </p>
              </div>
            </div>
          </div>

          {/* THE BIG CONVERSION HOOK BANNER */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-950 to-amber-950/40 border border-cyan-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <strong className="text-white text-sm font-black flex items-center gap-2">
                <span>🧲 {isEn ? 'Why Local Studio Is The Most Profitable Tool In The Market:' : 'Por Qué Local Studio es la Herramienta Más Rentable del Mercado:'}</span>
              </strong>
              <p className="text-slate-300 text-[11px] leading-relaxed max-w-3xl">
                {isEn
                  ? 'Local Studio is NOT an expense: you recover 100% of your investment with your very first client ($150–$300 USD). From there, every single profile you create becomes a candidate to connect into Prestigia, turning cold local businesses into recurring monthly income in USD that deposits into your account automatically.'
                  : 'Local Studio NO es un gasto: recuperas el 100% de tu inversión con tu primer cliente ($150–$300 USD). A partir de ahí, cada negocio que optimizas se convierte en un candidato para conectarlo a Prestigia, transformando clientes de tu ciudad en una renta mensual en dólares que entra a tu cuenta de forma automática mientras la plataforma trabaja por ti.'}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">{isEn ? 'Zero Risk' : 'Cero Riesgo'}</span>
              <strong className="text-cyan-300 text-sm font-black">{isEn ? '100% Breakeven in 1 Client' : 'Recuperas con 1 Solo Cliente'}</strong>
            </div>
          </div>
        </section>

        {/* SECTION 4: 24-HOUR FLASH OFFER & RELOAD POLICY */}
        <section className="space-y-4 print-card p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-orange-500/10 border-2 border-amber-500/40">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>{isEn ? '4. Masterclass 24-Hour Fast-Action Bonus & Reload Terms' : '4. Bono Flash 24 Horas de la Masterclass & Política de Recargas'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1 text-xs">
            {/* Flash Bonus */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Gift className="w-4 h-4 text-amber-400" />
                <span>{isEn ? '+10% Bonus Credits (First 24 Hours Only)' : 'Bono +10% de Créditos Adicionales (24 Horas)'}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {isEn
                  ? 'Attendees activating their package during the live Masterclass or within 24 hours receive 10% extra credits in EVERY tab permanently:'
                  : 'Quienes adquieran su paquete durante la Masterclass o en las siguientes 24 horas reciben un 10% adicional de créditos gratis en cada pestaña:'}
              </p>
              <ul className="space-y-1 font-mono text-[11px] text-amber-300 pt-1">
                <li>• {isEn ? 'Independent Advisor:' : 'Asesor:'} <strong>{isEn ? '11 credits / tab' : '11 créditos / pestaña'}</strong> {isEn ? '(55 total services across 5 tabs).' : '(55 servicios en total en las 5 pestañas).'}</li>
                <li>• {isEn ? 'Agencies:' : 'Agencias:'} <strong>{isEn ? '22 credits / tab' : '22 créditos / pestaña'}</strong> {isEn ? '(110 total services across 5 tabs).' : '(110 servicios en total en las 5 pestañas).'}</li>
                <li>• {isEn ? 'Super Agencies:' : 'Súper Agencias:'} <strong>{isEn ? '33 credits / tab' : '33 créditos / pestaña'}</strong> {isEn ? '(165 total services across 5 tabs).' : '(165 servicios en total en las 5 pestañas).'}</li>
              </ul>
            </div>

            {/* Reload Policy */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>{isEn ? 'Credit Reload Policy ($5 USD / credit • Min. 10 credits)' : 'Política de Recargas ($5 USD / crédito • Mínimo 10 créditos)'}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {isEn
                  ? 'Advisors who run out of credits can purchase top-up credits at $5 USD each for any tab, with a minimum reload package of 10 credits ($50 USD). Initial Masterclass packages save up to 75% compared to reload rates.'
                  : 'Los asesores que agoten sus créditos pueden comprar paquetes de recarga a $5 USD por crédito para cualquier pestaña, con una recarga mínima de 10 créditos ($50 USD). Los planes iniciales de la Masterclass ahorran hasta un 75% frente a la recarga suelta.'}
              </p>
              <div className="pt-2 text-[10px] text-slate-400 font-mono">
                {isEn ? 'Minimum reload: 10 credits ($50 USD). Available 24/7 with no expiration date.' : 'Recarga mínima: 10 créditos ($50 USD). Disponibles 24/7 sin fecha de vencimiento.'}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: INSTITUTIONAL BACKING & FOOTER */}
        <section className="p-8 rounded-3xl bg-[#090F1C] border border-slate-800 print-card text-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <TechnologicalSolutionsLogo className="h-8" showText={true} />
            </div>
            <div className="text-left sm:text-right text-[11px] text-slate-400">
              <span>{isEn ? 'Prestigia Technologies Enterprise • Authorized Partner Network' : 'Prestigia Technologies Enterprise • Red Autorizada de Partners B2B'}</span>
            </div>
          </div>

          <p className="text-slate-300 leading-relaxed text-xs">
            {isEn
              ? 'Prestigia Local Studio is developed, hosted, and maintained under enterprise SLA standards by Technological Solutions Software. Commercial partners operate as independent entities, retaining 100% of the fees charged to their end clients.'
              : 'Prestigia Local Studio es desarrollado, alojado y respaldado bajo estándares corporativos por Technological Solutions Software. Los partners comerciales operan de manera independiente, conservando el 100% de los honorarios cobrados a sus clientes finales.'}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
            <span>
              Prestigia &copy; 2026 &bull; {isEn ? 'All rights reserved.' : 'Todos los derechos reservados.'}
            </span>
            <div className="flex flex-wrap items-center gap-3 font-bold no-print">
              <button
                type="button"
                onClick={() => openPlanCheckout('level_2')}
                className="flex items-center gap-1.5 text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:brightness-110 px-3.5 py-1.5 rounded-lg transition cursor-pointer shadow-md"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>{isEn ? 'Pay Online with Bold (PSE / Cards)' : 'Pagar en Línea con Bold (PSE / Tarjetas)'}</span>
              </button>
              <a
                href={isEn ? "https://wa.me/573058314049?text=Hello%20Prestigia,%20I%20want%20to%20activate%20my%20Local%20Studio%20Partner%20Plan" : "https://wa.me/573058314049?text=Hola%20Prestigia,%20deseo%20activar%20mi%20Plan%20de%20Partner%20en%20Local%20Studio"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30 transition hover:bg-emerald-500/20"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{isEn ? 'Activate Partner Plan via WhatsApp' : 'Activar Plan de Partner por WhatsApp'}</span>
              </a>
            </div>
          </div>
        </section>

      </main>

      <BoldCheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        orderType="new_plan"
        planTier={checkoutPlanTier}
        lang={lang}
      />
    </div>
  );
}
