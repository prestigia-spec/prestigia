'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Printer,
  ArrowLeft,
  FileText,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Globe,
  Sparkles,
  Award,
  UserCheck,
  Lock,
} from 'lucide-react';
import { PrestigiaIcon } from '@/components/PrestigiaIcon';

export default function ContratoComercialPage() {
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [currency, setCurrency] = useState<'COP' | 'USD' | 'MXN' | 'EUR'>('COP');

  // Sales Channel: Direct Owner vs Authorized Reseller / Commercial Partner
  const [salesChannel, setSalesChannel] = useState<'direct' | 'reseller'>('reseller');

  // Provider / Founder Info (Owner)
  const [providerName, setProviderName] = useState('PRESTIGIA');
  const [providerRep, setProviderRep] = useState('Brayan');
  const [providerId, setProviderId] = useState('CC / NIT [Completar tu documento]');
  const [providerPhone, setProviderPhone] = useState('+57 300 123 4567');
  const [providerCity, setProviderCity] = useState('Bogotá D.C., Colombia');

  // Authorized Reseller / Distributor Info
  const [resellerName, setResellerName] = useState('Carlos Mendoza (Distribuidor Autorizado)');
  const [resellerId, setResellerId] = useState('CC / ID: 1.020.345.678');
  const [resellerCode, setResellerCode] = useState('AUTH-DIST-2026-081');
  const [resellerPhone, setResellerPhone] = useState('+57 311 987 6543');
  const [resellerRegion, setResellerRegion] = useState('Colombia / Internacional');

  // Client Info
  const [clientBusinessName, setClientBusinessName] = useState('Nombre del Establecimiento / Marca');
  const [clientOwnerName, setClientOwnerName] = useState('Nombre del Representante Legal / Titular');
  const [clientId, setClientId] = useState('NIT / Cédula del Cliente');
  const [clientPhone, setClientPhone] = useState('WhatsApp / Teléfono');
  const [clientAddress, setClientAddress] = useState('Dirección y Ciudad del Establecimiento');

  // Contract Terms
  const [contractPlan, setContractPlan] = useState<'elite' | 'pro' | 'basic'>('elite');
  const [agreedAmount, setAgreedAmount] = useState('Tarifa pactada según propuesta (ej: $450.000 COP / $120 USD)');
  const [billingCycle, setBillingCycle] = useState('Mensual');
  const [branchesIncluded, setBranchesIncluded] = useState('1');
  
  const [contractDate, setContractDate] = useState(() => {
    return new Date().toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  });

  const [docRef] = useState(() => {
    return 'PRE-' + Math.random().toString(36).substring(2, 7).toUpperCase();
  });

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = lang === 'en'
    ? new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : contractDate;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans print:bg-white print:text-black">
      {/* SCREEN-ONLY TOOLBAR */}
      <div className="print:hidden sticky top-0 z-50 bg-[#0D1424] border-b border-slate-800 px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/portal"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'en' ? 'Back to Portal' : 'Volver al Portal'}</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <PrestigiaIcon className="w-6 h-6" />
              <span className="font-extrabold text-white">
                {lang === 'en' ? 'Commercial Contract Generator' : 'Generador de Acuerdo Comercial B2B'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Sales Channel Selector */}
            <div className="flex items-center rounded-xl bg-slate-800 p-0.5 border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setSalesChannel('direct')}
                className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  salesChannel === 'direct'
                    ? 'bg-amber-500 text-slate-950 font-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>👑</span>
                <span>{lang === 'en' ? 'Direct Founder' : 'Venta Directa'}</span>
              </button>
              <button
                type="button"
                onClick={() => setSalesChannel('reseller')}
                className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  salesChannel === 'reseller'
                    ? 'bg-indigo-600 text-white font-black shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Authorized Reseller' : 'Distribuidor Autorizado'}</span>
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center rounded-xl bg-slate-800 p-0.5 border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setLang('es')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  lang === 'es' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                🇪🇸 ES
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  lang === 'en' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                🇺🇸 EN
              </button>
            </div>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/25 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'en' ? 'Print / Save as PDF' : 'Imprimir / Guardar en PDF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SCREEN-ONLY EDITABLE FORM CONTROLS */}
      <div className="print:hidden max-w-5xl mx-auto px-4 sm:px-8 pt-6 pb-2">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0D1424] border border-indigo-500/30 text-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <span className="font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {lang === 'en'
                ? 'Dynamic Contract & Authorization Controls'
                : 'Parámetros del Contrato & Verificación de Autorización'}
            </span>
            <span className="text-[10px] text-slate-400">
              {salesChannel === 'reseller'
                ? (lang === 'en' ? '🛡️ Certified Reseller Mode Active' : '🛡️ Modo Distribuidor Autorizado Activo')
                : (lang === 'en' ? '👑 Direct Founder Mode Active' : '👑 Modo Venta Directa Activo')}
            </span>
          </div>

          {/* SECTION: AUTHORIZED RESELLER SPECIFICS (If Reseller Mode is active) */}
          {salesChannel === 'reseller' && (
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  {lang === 'en' ? 'Authorized Distributor Accreditation Data' : 'Datos de Acreditación del Vendedor / Distribuidor'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  {lang === 'en' ? 'VERIFIED PARTNER' : 'AVAL AUDITADO'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                <div>
                  <label className="text-[10px] text-indigo-200 block mb-0.5">
                    {lang === 'en' ? 'Distributor Full Name:' : 'Nombre del Vendedor / Distribuidor:'}
                  </label>
                  <input
                    type="text"
                    value={resellerName}
                    onChange={(e) => setResellerName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-indigo-500/50 text-white text-xs focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-indigo-200 block mb-0.5">
                    {lang === 'en' ? 'Distributor Tax ID / Document:' : 'Cédula / Documento del Vendedor:'}
                  </label>
                  <input
                    type="text"
                    value={resellerId}
                    onChange={(e) => setResellerId(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-indigo-500/50 text-white text-xs focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-indigo-200 block mb-0.5">
                    {lang === 'en' ? 'Prestigia Authorization Code:' : 'Código Oficial de Autorización:'}
                  </label>
                  <input
                    type="text"
                    value={resellerCode}
                    onChange={(e) => setResellerCode(e.target.value)}
                    placeholder="ej: AUTH-DIST-2026-081"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-emerald-500/50 text-emerald-300 font-mono font-bold text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-indigo-200 block mb-0.5">
                    {lang === 'en' ? 'Distributor Phone / WhatsApp:' : 'WhatsApp de Contacto del Vendedor:'}
                  </label>
                  <input
                    type="text"
                    value={resellerPhone}
                    onChange={(e) => setResellerPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-indigo-500/50 text-white text-xs focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION: CLIENT & DEAL DATA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">
                {lang === 'en' ? 'Client / Brand Name:' : 'Nombre del Cliente / Marca:'}
              </label>
              <input
                type="text"
                value={clientBusinessName}
                onChange={(e) => setClientBusinessName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">
                {lang === 'en' ? 'Authorized Representative:' : 'Representante / Titular:'}
              </label>
              <input
                type="text"
                value={clientOwnerName}
                onChange={(e) => setClientOwnerName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">
                {lang === 'en' ? 'Client Tax ID / NIT / SSN:' : 'Cédula / NIT del Cliente:'}
              </label>
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">
                {lang === 'en' ? 'Contracted Tier:' : 'Plan Contratado:'}
              </label>
              <select
                value={contractPlan}
                onChange={(e) => setContractPlan(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="elite">{lang === 'en' ? 'Elite Tier (Multi-Location & AI)' : 'Plan Élite (Multi-Sede & IA)'}</option>
                <option value="pro">{lang === 'en' ? 'Pro Tier (Advanced)' : 'Plan Pro (Avanzado)'}</option>
                <option value="basic">{lang === 'en' ? 'Basic Tier (Essential)' : 'Plan Básico (Esencial)'}</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">
                {lang === 'en' ? 'Agreed Fee (Negotiated amount):' : 'Tarifa Pactada (Monto negociado):'}
              </label>
              <input
                type="text"
                value={agreedAmount}
                onChange={(e) => setAgreedAmount(e.target.value)}
                placeholder="ej: $450.000 COP / $120 USD"
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 font-bold text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">
                {lang === 'en' ? 'Billing Frequency:' : 'Ciclo de Facturación:'}
              </label>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="Mensual">{lang === 'en' ? 'Monthly' : 'Mensual'}</option>
                <option value="Trimestral">{lang === 'en' ? 'Quarterly' : 'Trimestral'}</option>
                <option value="Semestral">{lang === 'en' ? 'Semi-Annual' : 'Semestral'}</option>
                <option value="Anual">{lang === 'en' ? 'Annual (Prepaid)' : 'Anual (Anticipado)'}</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">
                {lang === 'en' ? 'Authorized Physical Locations:' : 'Sedes Físicas Habilitadas:'}
              </label>
              <input
                type="text"
                value={branchesIncluded}
                onChange={(e) => setBranchesIncluded(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">
                {lang === 'en' ? 'Master Founder / Provider Name:' : 'Nombre del Titular / Fundador (Casa Matriz):'}
              </label>
              <input
                type="text"
                value={providerRep}
                onChange={(e) => setProviderRep(e.target.value)}
                placeholder="Tu nombre (Persona Natural o Empresa)"
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* PRINTABLE CONTRACT PAPER (A4 / LETTER) */}
      <main className="max-w-[850px] mx-auto my-6 sm:my-8 bg-white text-slate-900 p-8 sm:p-14 rounded-2xl shadow-2xl print:shadow-none print:m-0 print:p-0 print:rounded-none text-[12px] leading-relaxed">
        
        {/* CONTRACT HEADER */}
        <div className="border-b-2 border-slate-900 pb-5 mb-6 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-700 font-extrabold block">
              PRESTIGIA • SAAS B2B
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
              {lang === 'en'
                ? 'Master SaaS Agreement & Commercial Order Form'
                : 'Contrato de Prestación de Servicios & Licencia de Software SaaS'}
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              {lang === 'en'
                ? 'Cloud Technology Provisioning, Smart QR Routing, Online Reputation Monitoring & Customer Loyalty'
                : 'Suministro Tecnológico, Enrutamiento Smart QR, Monitoreo de Reputación y Blindaje de Clientes'}
            </p>
          </div>
          <div className="text-right shrink-0 flex flex-col items-end">
            <div className="w-14 h-14 rounded-2xl bg-[#0B111E] shadow-md border border-indigo-500/30 flex items-center justify-center p-1.5 mb-1.5 ring-1 ring-slate-900/10">
              <PrestigiaIcon className="w-full h-full drop-shadow-md" />
            </div>
            <span className="text-[9px] font-mono font-bold text-slate-500 block">
              DOC-REF: {docRef}
            </span>
          </div>
        </div>

        {/* SUMMARY CARD (CARÁTULA COMERCIAL) */}
        <div className="mb-6 p-4 rounded-xl border border-slate-300 bg-slate-50 space-y-2.5">
          <div className="text-[11px] font-black uppercase text-indigo-900 tracking-wider border-b border-slate-200 pb-1 flex justify-between">
            <span>
              {lang === 'en'
                ? 'Commercial Summary (Order Form Specifications)'
                : 'Resumen de Condiciones Comerciales Pactadas'}
            </span>
            <span className="text-slate-600 font-normal">{formattedDate}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div>
              <strong className="text-slate-700 block text-[10px] uppercase">
                {lang === 'en' ? 'The Subscriber (Client):' : 'El Suscriptor (Cliente):'}
              </strong>
              <span className="font-bold text-slate-950 block">{clientBusinessName}</span>
              <span className="text-slate-600 block">
                {lang === 'en' ? 'Rep:' : 'Rep:'} {clientOwnerName}
              </span>
              <span className="text-slate-600 block">
                {lang === 'en' ? 'ID / Tax ID:' : 'Identificación:'} {clientId}
              </span>
            </div>

            <div>
              <strong className="text-slate-700 block text-[10px] uppercase">
                {lang === 'en' ? 'The Provider (Prestigia):' : 'El Proveedor (Prestigia):'}
              </strong>
              <span className="font-bold text-slate-950 block">{providerName}</span>
              <span className="text-slate-600 block">
                {lang === 'en' ? 'Master Founder:' : 'Casa Matriz:'} {providerRep} ({providerId})
              </span>
              <span className="text-slate-600 block">
                {lang === 'en' ? 'VIP Support:' : 'Soporte:'} {providerPhone}
              </span>
            </div>
          </div>

          {/* AUTHORIZED RESELLER ACCREDITATION BADGE (If Reseller Channel) */}
          {salesChannel === 'reseller' && (
            <div className="p-2.5 rounded-lg bg-indigo-50/80 border border-indigo-200 text-[11px] flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-indigo-900 uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>
                    {lang === 'en'
                      ? 'Facilitated via Certified Commercial Distributor:'
                      : 'Tramitado mediante Distribuidor Comercial Autorizado:'}
                  </span>
                </span>
                <span className="font-bold text-slate-900 block">
                  {resellerName} • {resellerId}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-500 block uppercase font-mono">
                  {lang === 'en' ? 'Verification Code:' : 'Código de Acreditación:'}
                </span>
                <span className="text-xs font-mono font-black text-indigo-700 px-2 py-0.5 rounded bg-indigo-100 border border-indigo-300 inline-block">
                  {resellerCode}
                </span>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200 grid grid-cols-3 gap-2 text-[11px]">
            <div>
              <strong className="text-slate-700 block text-[10px] uppercase">
                {lang === 'en' ? 'Contracted Tier:' : 'Plan Seleccionado:'}
              </strong>
              <span className="font-bold text-indigo-800 uppercase">{contractPlan}</span>
            </div>
            <div>
              <strong className="text-slate-700 block text-[10px] uppercase">
                {lang === 'en' ? 'Rate & Cycle:' : 'Tarifa & Ciclo:'}
              </strong>
              <span className="font-bold text-slate-950">
                {agreedAmount} ({billingCycle})
              </span>
            </div>
            <div>
              <strong className="text-slate-700 block text-[10px] uppercase">
                {lang === 'en' ? 'Enabled Locations:' : 'Sedes Habilitadas:'}
              </strong>
              <span className="font-bold text-slate-950">
                {branchesIncluded} {lang === 'en' ? 'location(s)' : 'sede(s) física(s)'}
              </span>
            </div>
          </div>
        </div>

        {/* LEGAL CLAUSES */}
        {lang === 'en' ? (
          <div className="space-y-4 text-justify">
            <div>
              <h2 className="text-xs font-black uppercase text-slate-950 tracking-wide mb-1">
                Section One: Purpose & Software License Grant
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Provider grants Subscriber a non-exclusive, revocable, and non-transferable software-as-a-service (SaaS) license to access and use the <strong>Prestigia</strong> cloud platform to manage its establishment reputation, activate smart customer routing via Smart QR codes, track public Google Maps reviews, and centralize the receipt of constructive service feedback.
              </p>
            </div>

            <div>
              <h2 className="text-xs font-black uppercase text-slate-950 tracking-wide mb-1">
                Section Two: Obligation of Means & Results Disclaimer (Provider Shield)
              </h2>
              <p className="text-slate-700 leading-relaxed">
                The obligations undertaken by Provider are strictly of <strong>technological means and NOT of commercial or reputational result</strong>. Accordingly, the parties expressly agree:
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-700">
                <li>
                  <strong>Independence from Google LLC and Meta (WhatsApp):</strong> Prestigia provides routing, filtering, and AI response software. Prestigia holds <strong>NO</strong> corporate affiliation with Google LLC and does <strong>NOT</strong> guarantee the deletion or modification of pre-existing public reviews on Google Maps, nor does it assume liability for account suspensions or unilateral algorithmic updates decided by Google LLC.
                </li>
                <li>
                  <strong>Establishment Inherent Operational Quality:</strong> While the software facilitates early mitigation and private recovery of dissatisfied guests, the ultimate customer experience, dining satisfaction, and long-term loyalty depend exclusively on Subscriber internal operations, product quality, and staff hospitality.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-black uppercase text-slate-950 tracking-wide mb-1">
                Section Three: Economic Consideration & Pricing Discretion
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Subscriber shall pay the agreed subscription fee specified in the Commercial Summary of this document (<strong>{agreedAmount}</strong> on a <strong>{billingCycle}</strong> frequency). Rates are mutually agreed between the parties and may reflect custom promotional discounts or distributor bundling. In the event of payment default exceeding ten (10) calendar days, Provider may temporarily suspend portal access until balances are brought current, while preserving customer historical records.
              </p>
            </div>

            <div>
              <h2 className="text-xs font-black uppercase text-slate-950 tracking-wide mb-1">
                Section Four: Data Custody & Privacy Compliance (CCPA / GDPR / Data Protection)
              </h2>
              <p className="text-slate-700 leading-relaxed">
                In strict compliance with applicable data privacy regulations:
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-700">
                <li>
                  <strong>Legal Roles:</strong> Subscriber acts as the <strong>Data Controller</strong>. Prestigia acts strictly as the <strong>Data Processor</strong> and secure cloud infrastructure custodian.
                </li>
                <li>
                  <strong>Strict Zero-Spam Guarantee:</strong> Prestigia expressly and irrevocably guarantees that it will <strong>never sell, lease, transfer, or disclose</strong> customer databases collected via Smart QR codes. All guest records remain the exclusive and inalienable property of Subscriber.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-black uppercase text-slate-950 tracking-wide mb-1">
                Section Five: Service Level Agreement (SLA) & Technical Support
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Provider guarantees 99.5% monthly SaaS uptime, excluding pre-announced off-peak maintenance windows. Subscriber shall receive dedicated priority support corresponding to its plan ({contractPlan === 'elite' ? '4 priority VIP requests/month via WhatsApp' : contractPlan === 'pro' ? '2 priority requests/month' : '1 support ticket/month'}), accessible directly from the portal or designated support line.
              </p>
            </div>

            <div>
              <h2 className="text-xs font-black uppercase text-slate-950 tracking-wide mb-1">
                Section Six: Term, Renewal & Notice of Cancellation
              </h2>
              <p className="text-slate-700 leading-relaxed">
                This Agreement takes effect upon signature and automatically renews for successive periods equal to the contracted frequency ({billingCycle}), unless either party notifies the other in writing at least five (5) business days prior to the next billing date, without incurring penalties or mandatory lock-in clauses.
              </p>
            </div>

            {salesChannel === 'reseller' && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-indigo-200">
                <h2 className="text-xs font-black uppercase text-indigo-950 tracking-wide mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Section Seven: Certified Distribution & Corporate Authorization</span>
                </h2>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  This subscription is marketed and facilitated through <strong>{resellerName}</strong> ({resellerId}), operating as an <strong>OFFICIAL CERTIFIED DISTRIBUTOR / COMMERCIAL PARTNER</strong> accredited by Prestigia under verification code <strong>{resellerCode}</strong>. Subscriber is expressly assured that said partner holds active authority to onboard client accounts. The core SaaS technology, Smart QR engine, and data confidentiality remain directly backed and guaranteed by the central Prestigia platform.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 text-justify">
            <div>
              <h2 className="text-xs font-black uppercase text-slate-950 tracking-wide mb-1">
                Cláusula Primera: Objeto del Contrato
              </h2>
              <p className="text-slate-700 leading-relaxed">
                El Proveedor concede a favor de El Suscriptor una licencia de uso no exclusiva, revocable e intransferible para acceder y utilizar la plataforma tecnológica en la nube <strong>Prestigia</strong>, con el fin de gestionar la reputación de su establecimiento, activar el enrutamiento inteligente de clientes a través de códigos Smart QR, monitorear reseñas públicas de Google Maps y centralizar la recepción de quejas o comentarios constructivos de servicio.
              </p>
            </div>

            <div>
              <h2 className="text-xs font-black uppercase text-slate-950 tracking-wide mb-1">
                Cláusula Segunda: Obligaciones de Medio y Deslinde de Resultados (Blindaje del Proveedor)
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Las obligaciones asumidas por El Proveedor son estrictamente de <strong>medio tecnológico y no de resultado</strong> comercial o reputacional. En consecuencia, las partes acuerdan expresamente:
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-700">
                <li>
                  <strong>Independencia frente a Google LLC y Meta (WhatsApp):</strong> Prestigia suministra el software de filtrado y asistencia de respuesta. Prestigia <strong>NO</strong> tiene vínculo societario con Google ni garantiza la eliminación o alteración de reseñas públicas preexistentes en Google Maps, ni asume responsabilidad por suspensiones de fichas o políticas algorítmicas unilaterales decididas por Google LLC.
                </li>
                <li>
                  <strong>Calidad Operativa Propia del Establecimiento:</strong> El software facilita la canalización preventiva y el rescate de clientes insatisfechos; no obstante, el éxito de la experiencia final, la satisfacción gastronómica/operativa y la fidelización dependen exclusivamente de la gestión interna, calidad de producto e idoneidad del personal de El Suscriptor.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-black uppercase text-slate-950 tracking-wide mb-1">
                Cláusula Tercera: Contraprestación Económica y Autonomía de Tarifas
              </h2>
              <p className="text-slate-700 leading-relaxed">
                El Suscriptor abonará la tarifa estipulada en la Carátula Comercial del presente documento (<strong>{agreedAmount}</strong> con periodicidad <strong>{billingCycle}</strong>). Las tarifas son convenidas de mutuo acuerdo entre las partes y pueden contemplar descuentos preferenciales o empaquetamiento comercial pactado directamente. En caso de mora superior a diez (10) días calendario, El Proveedor podrá suspender temporalmente el acceso al portal hasta tanto se regularicen los pagos, garantizando la preservación de los datos históricos del cliente.
              </p>
            </div>

            <div>
              <h2 className="text-xs font-black uppercase text-slate-950 tracking-wide mb-1">
                Cláusula Cuarta: Custodia de Datos y Cumplimiento de Privacidad (Habeas Data / GDPR)
              </h2>
              <p className="text-slate-700 leading-relaxed">
                En estricto cumplimiento de las normas de protección de datos personales vigentes (Ley 1581 de 2012 / LFPDPPP / CCPA / RGPD):
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-700">
                <li>
                  <strong>Roles Jurídicos:</strong> El Suscriptor actúa en calidad de <strong>Responsable del Tratamiento</strong> (Data Controller). Prestigia actúa exclusivamente como <strong>Encargado del Tratamiento</strong> (Data Processor) y custodio tecnológico seguro de las bases de datos.
                </li>
                <li>
                  <strong>Compromiso Zero-Spam:</strong> Prestigia garantiza de forma expresa e indeclinable que <strong>jamás venderá, cederá, compartirá ni explotará comercialmente</strong> las bases de datos de clientes recabadas a través de los códigos QR. Los datos son y serán propiedad exclusiva e inalienable de El Suscriptor.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-black uppercase text-slate-950 tracking-wide mb-1">
                Cláusula Quinta: Nivel de Servicio (SLA) y Soporte Técnico
              </h2>
              <p className="text-slate-700 leading-relaxed">
                El Proveedor garantiza una disponibilidad mensual del servicio SaaS del 99.5%, salvo ventanas de mantenimiento preventivo notificadas en horarios nocturnos de bajo tráfico. El Suscriptor contará con el paquete de soporte prioritario correspondiente a su plan ({contractPlan === 'elite' ? '4 solicitudes prioritarias/mes vía WhatsApp VIP' : contractPlan === 'pro' ? '2 solicitudes prioritarias/mes' : '1 solicitud de soporte/mes'}), gestionado directamente desde el portal o el canal oficial de atención.
              </p>
            </div>

            <div>
              <h2 className="text-xs font-black uppercase text-slate-950 tracking-wide mb-1">
                Cláusula Sexta: Duración, Renovación y Terminación
              </h2>
              <p className="text-slate-700 leading-relaxed">
                El presente contrato entra en vigor en la fecha de firma y se entenderá prorrogado automáticamente por períodos sucesivos iguales a la periodicidad contratada ({billingCycle}), salvo que cualquiera de las partes notifique por escrito o vía WhatsApp oficial su deseo de no renovar con una antelación mínima de cinco (5) días hábiles antes de la siguiente fecha de corte, sin que ello genere penalidades ni cláusulas de permanencia forzosa.
              </p>
            </div>

            {salesChannel === 'reseller' && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-indigo-200">
                <h2 className="text-xs font-black uppercase text-indigo-950 tracking-wide mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Cláusula Séptima: Certificación de Distribución Autorizada y Aval Corporativo</span>
                </h2>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  El presente contrato es gestionado y suscrito mediante <strong>{resellerName}</strong> ({resellerId}), actuando en calidad de <strong>DISTRIBUIDOR / ASESOR COMERCIAL AUTORIZADO</strong> por la Dirección General de Prestigia bajo el código oficial de acreditación <strong>{resellerCode}</strong>. Se certifica a El Suscriptor que dicho distribuidor cuenta con autorización formal vigente para vincular establecimientos al sistema. La infraestructura tecnológica, enrutador Smart QR, soporte de servidores y custodia de datos son provistos de forma directa y garantizada por la plataforma central de Prestigia.
                </p>
              </div>
            )}
          </div>
        )}

        {/* SIGNATURE SECTION */}
        {salesChannel === 'reseller' ? (
          <div className="mt-10 pt-6 border-t-2 border-slate-900 grid grid-cols-3 gap-4 text-[10px]">
            <div>
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block mb-12">
                {lang === 'en' ? 'CENTRAL PLATFORM (PRESTIGIA):' : 'POR CASA MATRIZ (PRESTIGIA):'}
              </span>
              <div className="border-t border-slate-400 pt-2 space-y-0.5">
                <strong className="text-slate-900 block font-bold">{providerRep}</strong>
                <span className="text-slate-600 block">{providerName}</span>
                <span className="text-emerald-700 font-bold block text-[9px]">
                  {lang === 'en' ? '✓ Master Technology License' : '✓ Licencia Tecnológica Avalada'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[9px] text-indigo-900 uppercase font-bold tracking-wider block mb-12">
                {lang === 'en' ? 'AUTHORIZED DISTRIBUTOR:' : 'POR DISTRIBUIDOR AUTORIZADO:'}
              </span>
              <div className="border-t border-indigo-400 pt-2 space-y-0.5">
                <strong className="text-slate-900 block font-bold">{resellerName}</strong>
                <span className="text-slate-600 block">{resellerId}</span>
                <span className="text-indigo-700 font-mono font-bold block text-[9px]">
                  {lang === 'en' ? 'Auth Code:' : 'Acreditación:'} {resellerCode}
                </span>
                <span className="text-slate-500 text-[9px] block">Tel: {resellerPhone}</span>
              </div>
            </div>

            <div>
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block mb-12">
                {lang === 'en' ? 'THE SUBSCRIBER (CLIENT):' : 'POR EL CLIENTE (SUSCRIPTOR):'}
              </span>
              <div className="border-t border-slate-400 pt-2 space-y-0.5">
                <strong className="text-slate-900 block font-bold">{clientOwnerName}</strong>
                <span className="text-slate-600 block">{clientBusinessName}</span>
                <span className="text-slate-600 block">{clientId}</span>
                <span className="text-slate-500 text-[9px] block">Tel: {clientPhone}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-10 pt-6 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-[11px]">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-12">
                {lang === 'en' ? 'FOR THE PROVIDER (PRESTIGIA):' : 'POR EL PROVEEDOR (PRESTIGIA):'}
              </span>
              <div className="border-t border-slate-400 pt-2 space-y-0.5">
                <strong className="text-slate-900 block font-bold">{providerRep}</strong>
                <span className="text-slate-600 block">{providerName}</span>
                <span className="text-slate-600 block">{providerId}</span>
                <span className="text-slate-500 text-[10px] block">
                  {lang === 'en' ? 'Tel / WhatsApp:' : 'Tel / WA:'} {providerPhone}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-12">
                {lang === 'en' ? 'FOR THE SUBSCRIBER (CLIENT):' : 'POR EL SUSCRIPTOR (EL CLIENTE):'}
              </span>
              <div className="border-t border-slate-400 pt-2 space-y-0.5">
                <strong className="text-slate-900 block font-bold">{clientOwnerName}</strong>
                <span className="text-slate-600 block">{clientBusinessName}</span>
                <span className="text-slate-600 block">{clientId}</span>
                <span className="text-slate-500 text-[10px] block">
                  {lang === 'en' ? 'Contact:' : 'Contacto:'} {clientPhone}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* PRINT FOOTER WITH CERTIFICATION HASH */}
        <div className="mt-8 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[9px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              {lang === 'en'
                ? 'Prestigia SaaS Platform • Master SaaS Terms of Service'
                : 'Prestigia Enterprise Core • Contrato Marco de Adhesión SaaS'}
            </span>
            {salesChannel === 'reseller' && (
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-300 font-mono font-bold">
                ✓ CERT-ID: {resellerCode}
              </span>
            )}
          </div>
          <span>
            {lang === 'en'
              ? 'Page 1 of 1 • Digital Acceptance & Evidentiary Record'
              : 'Página 1 de 1 • Aprobación Digital & Evidencia Documental'}
          </span>
        </div>

      </main>
    </div>
  );
}
