'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PrestigiaIcon } from '@/components/PrestigiaIcon';
import { TechnologicalSolutionsLogo } from '@/components/TechnologicalSolutionsLogo';
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
} from 'lucide-react';

export default function MasterclassPlanesPage() {
  const [lang, setLang] = useState<'es' | 'en'>('es');

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

            {/* Return to Local Studio */}
            <Link
              href="/local-studio"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700 transition"
            >
              {isEn ? '← Local Studio' : '← Abrir Local Studio'}
            </Link>
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
                ? 'Monetize Google Maps Optimization with Zero Tech Barrier: Invest $49, Double with Your 1st Client'
                : 'Monetiza la Optimización de Google Maps sin Barrera Técnica: Invierte $49 USD y Duplica desde tu 1er Cliente'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {isEn
                ? 'Prestigia Local Studio equips independent advisors and digital agencies with proprietary AI algorithmic engineering. Sell premium profile creation, forensic gap audits, 72h suspension rescues, and review appeals at $100 USD each, generating immediate cash flow while building recurring revenue through Prestigia annual software agreements.'
                : 'Prestigia Local Studio equipa a consultores independientes y agencias digitales con ingeniería algorítmica de IA propia. Vende creación técnica de fichas, auditorías forenses Top 3, rescates de suspensión en 72 horas y apelación de reseñas falsas a $100 USD cada servicio, recuperando el 100% de tu inversión desde tu primera venta y generando comisiones de contado con paquetes anuales de Prestigia.'}
            </p>
          </div>

          {/* 3 Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 mt-6 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 block">{isEn ? 'Immediate Breakeven:' : 'Punto de Equilibrio Inmediato:'}</span>
              <span className="text-emerald-400 font-black text-base flex items-center gap-1">
                <Rocket className="w-4 h-4 text-emerald-400" />
                <span>{isEn ? '1 Single Client ($100 USD)' : '1 Solo Cliente ($100 USD)'}</span>
              </span>
              <span className="text-[10px] text-slate-400 block">{isEn ? 'Recovers 204% of Starter plan' : 'Recupera el 204% de la inversión'}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 block">{isEn ? 'Suggested End-Client Price:' : 'Precio Sugerido al Cliente:'}</span>
              <span className="text-amber-400 font-black text-base flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>$100 USD / {isEn ? 'service' : 'servicio'}</span>
              </span>
              <span className="text-[10px] text-slate-400 block">{isEn ? 'Instant perceived market value' : 'Alto valor percibido en frío'}</span>
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
              {isEn ? 'Suggested Sale Price: $100 USD / service' : 'Precio Sugerido de Venta: $100 USD / servicio'}
            </span>
          </div>

          <p className="text-xs text-slate-300">
            {isEn
              ? 'Each plan grants dedicated operational credits across all 4 production engines of Prestigia Local Studio. No recurring maintenance fees; consume credits as you close clients.'
              : 'Cada plan otorga créditos de uso independientes para las 4 herramientas de producción técnica de Prestigia Local Studio. Sin costos ocultos de servidores ni mantenimiento.'}
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
                  <span className="text-slate-500 text-xs font-mono">Nivel 1</span>
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
                    <span className="text-amber-400 font-mono text-sm">40 Créditos</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">
                    10 {isEn ? 'credits per tab' : 'créditos en cada pestaña'} ($1.22 USD / {isEn ? 'use' : 'uso'})
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
                    <span><strong>10</strong> {isEn ? '72h Suspension Rescues (Tab 3)' : 'Rescates de Suspensión 72h (Pestaña 3)'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>10</strong> {isEn ? '1-Star Review Appeals (Tab 4)' : 'Apelaciones de Reseñas 1★ (Pestaña 4)'}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-emerald-300">
                  <strong>{isEn ? 'Breakeven:' : 'Retorno:'}</strong> {isEn ? '1 client at $100 USD = 204% recovered.' : 'Vendes 1 cliente a $100 USD y recuperas el 204% de tu inversión.'}
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{isEn ? 'Annual Software Commission:' : 'Comisión Plan Anual:'}</span>
                  <span className="text-cyan-400 font-black">10% de Contado</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{isEn ? 'Revenue Potential:' : 'Potencial de Venta:'}</span>
                  <span className="text-amber-400 font-black">Hasta $4.000 USD</span>
                </div>
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
                  <span className="text-indigo-400 text-xs font-mono">Nivel 2</span>
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
                    <span className="text-amber-400 font-mono text-sm">80 Créditos</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">
                    20 {isEn ? 'credits per tab' : 'créditos en cada pestaña'} ($1.12 USD / {isEn ? 'use' : 'uso'})
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
                    <span><strong>20</strong> {isEn ? '72h Suspension Rescues (Tab 3)' : 'Rescates de Suspensión 72h (Pestaña 3)'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span><strong>20</strong> {isEn ? '1-Star Review Appeals (Tab 4)' : 'Apelaciones de Reseñas 1★ (Pestaña 4)'}</span>
                  </li>
                  <li className="flex items-center gap-2 text-amber-300 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{isEn ? 'White Label PDF Dossier Exports' : 'Exportación de PDF con Logo Marca Blanca'}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-emerald-300">
                  <strong>{isEn ? 'Breakeven:' : 'Retorno:'}</strong> {isEn ? '1 single $100 USD client pays off the entire plan.' : 'Con 1 solo cliente de $100 USD pagas el plan completo.'}
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{isEn ? 'Annual Software Commission:' : 'Comisión Plan Anual:'}</span>
                  <span className="text-cyan-400 font-black text-sm">20% de Contado</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{isEn ? 'Revenue Potential:' : 'Potencial de Venta:'}</span>
                  <span className="text-amber-400 font-black">Hasta $8.000 USD</span>
                </div>
              </div>
            </div>

            {/* Plan 3: Súper Agencias */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 font-bold border border-cyan-500/30">
                    {isEn ? 'Super Agency' : 'Súper Agencias'}
                  </span>
                  <span className="text-cyan-400 text-xs font-mono">Nivel 3</span>
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
                    <span className="text-amber-400 font-mono text-sm">120 Créditos</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">
                    30 {isEn ? 'credits per tab' : 'créditos en cada pestaña'} ($1.16 USD / {isEn ? 'use' : 'uso'})
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
                    <span><strong>30</strong> {isEn ? '72h Suspension Rescues (Tab 3)' : 'Rescates de Suspensión 72h (Pestaña 3)'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span><strong>30</strong> {isEn ? '1-Star Review Appeals (Tab 4)' : 'Apelaciones de Reseñas 1★ (Pestaña 4)'}</span>
                  </li>
                  <li className="flex items-center gap-2 text-cyan-300 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{isEn ? 'Priority Queue & Multi-Advisor Subaccounts' : 'Cola de IA Prioritaria & Subcuentas para Asesores'}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-emerald-300">
                  <strong>{isEn ? 'Breakeven:' : 'Retorno:'}</strong> {isEn ? '1.5 clients recover 100% of your investment.' : 'Con 1 cliente y medio recuperas el 100% de la inversión.'}
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{isEn ? 'Annual Software Commission:' : 'Comisión Plan Anual:'}</span>
                  <span className="text-cyan-400 font-black text-sm">25% de Contado</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{isEn ? 'Revenue Potential:' : 'Potencial de Venta:'}</span>
                  <span className="text-amber-400 font-black">Hasta $12.000 USD</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2: THE 4 OPERATIONAL PRODUCTION TABS */}
        <section className="space-y-4 print-card p-6 rounded-2xl bg-[#090D17] border border-slate-800 page-break-before">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>{isEn ? '2. The 4 Monetizable Engines in Local Studio' : '2. Las 4 Herramientas Monetizables de Local Studio'}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">
            {isEn
              ? 'Why Clients Happily Pay $100 USD for Each Service'
              : 'Por qué los Negocios Pagan Felices $100 USD por Cada Servicio'}
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
                  <span>Pestaña 1: Creación & Setup Técnico</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">PVP: $100 USD</span>
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
                  <span>Pestaña 2: Auditoría Forense Top 3</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">PVP: $100 USD</span>
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
                  <span>Pestaña 3: Protocolo de Rescate 72h</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">PVP: $100 USD</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {isEn
                  ? 'Emergency defense protocol for suspended, duplicated, or orphaned listings. Compiles evidentiary checklists, legal utility proof, and drafts formal appeals to Google Support.'
                  : 'Servicio de alta urgencia y dolor extremo. Diagnóstica causales de suspensión engañosa o calidad, organiza las 4 pruebas de posesión legal y redacta la carta de apelación formal para escalamiento ante Google.'}
              </p>
            </div>

            {/* Engine 4 */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-purple-400 font-bold flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-purple-400" />
                  <span>Pestaña 4: Apelación de Reseñas 1★</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">PVP: $100 USD</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {isEn
                  ? 'Algorithmic defense against fake, defamatory, or competitor attack reviews. Generates legal policy violation reports directly mapped to Google Content Policies.'
                  : 'Blindaje reputacional. Redacta la impugnación legal fundamentada en los artículos oficiales de Google (conflicto de interés, difamación, spam o acoso) para solicitar la remoción definitiva de opiniones malintencionadas.'}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: COMMISSIONS ON ANNUAL PACKAGES */}
        <section className="space-y-4 print-card p-6 rounded-2xl bg-[#090D17] border border-cyan-500/30">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Percent className="w-4 h-4" />
            <span>{isEn ? '3. High-Ticket Cash Commissions: Annual Software Packages' : '3. Comisiones de Alto Valor: Paquetes Anuales Prestigia'}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">
            {isEn
              ? 'Zero Monthly Micromanagement: Earn Lump-Sum Upfront Commissions'
              : 'Cero Complicaciones Contables: Cobra Comisiones Grandes de Contado'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isEn
              ? 'When your clients experience the power of Google Maps optimization, pitch the Prestigia Smart QR & Private Containment Suite under an annual prepaid agreement. You receive a direct, lump-sum cash commission paid immediately on the full contract value:'
              : 'Cuando optimizas la ficha de tu cliente en Google Maps, el paso natural es instalarle el software de Blindaje y Smart QR de Prestigia bajo un paquete anual. Al cobrar el año completo por adelantado, Prestigia te liquida tu comisión de inmediato en una sola transferencia:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-mono text-[10px] uppercase">Plan Asesor Independiente</span>
              <div className="text-2xl font-black text-cyan-400">10% <span className="text-xs text-white font-normal">de Contado</span></div>
              <p className="text-[11px] text-slate-300">
                {isEn ? 'In a $600 USD annual agreement, you receive $60 USD upfront.' : 'En un contrato anual de $600 USD, recibes $60 USD de contado (¡ya pagaste tu plan de $49!).'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
              <span className="text-indigo-400 font-mono text-[10px] uppercase">Plan Agencias</span>
              <div className="text-2xl font-black text-cyan-400">20% <span className="text-xs text-white font-normal">de Contado</span></div>
              <p className="text-[11px] text-slate-300">
                {isEn ? 'In a $600 USD annual agreement, you receive $120 USD upfront.' : 'En un contrato anual de $600 USD, recibes $120 USD de contado (más de lo que invertiste en tu plan).'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
              <span className="text-cyan-400 font-mono text-[10px] uppercase">Plan Súper Agencias</span>
              <div className="text-2xl font-black text-cyan-400">25% <span className="text-xs text-white font-normal">de Contado</span></div>
              <p className="text-[11px] text-slate-300">
                {isEn ? 'In a $600 USD annual agreement, you receive $150 USD upfront.' : 'En un contrato anual de $600 USD, recibes $150 USD de contado en una sola transacción.'}
              </p>
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
                <li>• Asesor: <strong>11 créditos / pestaña</strong> (44 servicios en total).</li>
                <li>• Agencias: <strong>22 créditos / pestaña</strong> (88 servicios en total).</li>
                <li>• Súper Agencias: <strong>33 créditos / pestaña</strong> (132 servicios en total).</li>
              </ul>
            </div>

            {/* Reload Policy */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>{isEn ? 'Single Credit Reload Policy ($5 USD / use)' : 'Política de Recargas Sueltas ($5 USD / uso)'}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {isEn
                  ? 'Advisors who run out of credits before their cycle can buy individual top-up credits for $5 USD each across any tab. Buying a package saves up to 75% per credit.'
                  : 'Los asesores que agoten sus créditos pueden comprar recargas sueltas a $5 USD por crédito para cualquier pestaña. Los paquetes iniciales ahorran hasta un 75% frente a la recarga suelta.'}
              </p>
              <div className="pt-2 text-[10px] text-slate-400 font-mono">
                Recargas disponibles 24/7 sin fecha de vencimiento.
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
            <div className="flex items-center gap-3 font-bold text-amber-400">
              <a
                href={isEn ? "https://wa.me/573058314049?text=Hello%20Prestigia,%20I%20want%20to%20activate%20my%20Local%20Studio%20Partner%20Plan" : "https://wa.me/573058314049?text=Hola%20Prestigia,%20deseo%20activar%20mi%20Plan%20de%20Partner%20en%20Local%20Studio"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1 text-emerald-400"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{isEn ? 'Activate Partner Plan via WhatsApp' : 'Activar Plan de Partner por WhatsApp'}</span>
              </a>
              <span>&bull;</span>
              <Link href="/local-studio" className="hover:underline text-cyan-400">
                <span>{isEn ? 'Open Local Studio' : 'Abrir Local Studio'}</span>
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
