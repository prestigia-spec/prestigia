'use client';

import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  CreditCard,
  Globe,
  Lock,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserCheck,
  X,
  Zap,
} from 'lucide-react';

declare global {
  interface Window {
    BoldCheckout?: new (config: Record<string, any>) => {
      open: () => void;
    };
  }
}

export type BoldPlanTier = 'level_1' | 'level_2' | 'level_3';
export type BoldReloadTab = 'creates' | 'audits' | 'rescues' | 'appeals' | 'tools';

export interface BoldCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderType: 'new_plan' | 'credit_reload';
  planTier?: BoldPlanTier;
  reloadTab?: BoldReloadTab;
  advisorId?: string;
  advisorUsername?: string;
  defaultBuyerName?: string;
  defaultBuyerEmail?: string;
  defaultBuyerPhone?: string;
  defaultBuyerCountry?: string;
  lang?: 'es' | 'en';
  exchangeRateCop?: number;
}

const PLAN_DETAILS: Record<
  BoldPlanTier,
  { priceUsd: number; titleEs: string; titleEn: string; quotaLabel: string; commissionLabel: string }
> = {
  level_1: {
    priceUsd: 49,
    titleEs: 'Plan Asesor Independiente',
    titleEn: 'Independent Advisor Plan',
    quotaLabel: '10 créditos/mes en cada pestaña',
    commissionLabel: '10% comisión Prestigia recurrente & anual',
  },
  level_2: {
    priceUsd: 90,
    titleEs: 'Plan Agencias Partner',
    titleEn: 'Partner Agency Plan',
    quotaLabel: '20 créditos/mes en cada pestaña',
    commissionLabel: '20% comisión Prestigia recurrente & anual',
  },
  level_3: {
    priceUsd: 140,
    titleEs: 'Plan Súper Agencias',
    titleEn: 'Super Agency Plan',
    quotaLabel: '30 créditos/mes en cada pestaña',
    commissionLabel: '30% comisión Prestigia recurrente & anual',
  },
};

const RELOAD_TABS: Array<{ id: BoldReloadTab; labelEs: string; labelEn: string; descEs: string; descEn: string }> = [
  {
    id: 'creates',
    labelEs: '1. Creación de Ficha Nueva',
    labelEn: '1. New Listing Creation',
    descEs: '+10 Creaciones optimizadas',
    descEn: '+10 Optimized Creations',
  },
  {
    id: 'audits',
    labelEs: '2. Auditar & Optimizar',
    labelEn: '2. Audit & Optimize',
    descEs: '+10 Auditorías Forenses Top 3',
    descEn: '+10 Top 3 Forensic Audits',
  },
  {
    id: 'rescues',
    labelEs: '3. Rescatar Ficha 72h',
    labelEn: '3. Listing Rescue 72h',
    descEs: '+10 Protocolos de Rescate Google',
    descEn: '+10 Google Rescue Protocols',
  },
  {
    id: 'appeals',
    labelEs: '4. Apelar Reseñas 1★',
    labelEn: '4. Appeal 1★ Reviews',
    descEs: '+10 Defensas Legales TOS',
    descEn: '+10 Legal TOS Defenses',
  },
  {
    id: 'tools',
    labelEs: '5. Prospección & Cierre',
    labelEn: '5. Prospect & Close',
    descEs: '+10 Propuestas Forenses B2B',
    descEn: '+10 B2B Forensic Proposals',
  },
];

let boldScriptPromise: Promise<void> | null = null;

function loadBoldCheckoutScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.BoldCheckout) return Promise.resolve();
  if (boldScriptPromise) return boldScriptPromise;

  boldScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src*="checkout.bold.co/library/boldPaymentButton.js"]'
    );
    if (existing && window.BoldCheckout) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.bold.co/library/boldPaymentButton.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      boldScriptPromise = null;
      reject(new Error('No se pudo cargar la librería segura de Bold.'));
    };
    document.head.appendChild(script);
  });

  return boldScriptPromise;
}

export default function BoldCheckoutModal({
  isOpen,
  onClose,
  orderType,
  planTier = 'level_1',
  reloadTab = 'creates',
  advisorId,
  advisorUsername,
  defaultBuyerName = '',
  defaultBuyerEmail = '',
  defaultBuyerPhone = '',
  defaultBuyerCountry = 'Colombia',
  lang = 'es',
  exchangeRateCop = 4150,
}: BoldCheckoutModalProps) {
  const isEn = lang === 'en';

  const [selectedPlan, setSelectedPlan] = useState<BoldPlanTier>(planTier);
  const [selectedTab, setSelectedTab] = useState<BoldReloadTab>(reloadTab);
  const [currency, setCurrency] = useState<'COP' | 'USD'>(
    defaultBuyerCountry?.toLowerCase() === 'colombia' ? 'COP' : 'USD'
  );
  const [buyerName, setBuyerName] = useState(defaultBuyerName);
  const [buyerEmail, setBuyerEmail] = useState(defaultBuyerEmail);
  const [buyerPhone, setBuyerPhone] = useState(defaultBuyerPhone || '+57');
  const [buyerCountry, setBuyerCountry] = useState(defaultBuyerCountry || 'Colombia');
  const [desiredUsername, setDesiredUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [missingKeysWarning, setMissingKeysWarning] = useState(false);

  // Formateador estricto de teléfono: inicia obligatoriamente con '+' y luego solo números
  const handlePhoneChange = (val: string) => {
    let raw = val.trim();
    if (!raw.startsWith('+')) {
      raw = '+' + raw.replace(/[^0-9]/g, '');
    } else {
      raw = '+' + raw.slice(1).replace(/[^0-9]/g, '');
    }
    setBuyerPhone(raw);
  };

  // Sanitizador de nombre: solo letras, espacios, acentos y signos habituales de nombres (sin números ni símbolos raros)
  const handleNameChange = (val: string) => {
    const clean = val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.'-]/g, '');
    setBuyerName(clean);
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedPlan(planTier);
      setSelectedTab(reloadTab);
      if (defaultBuyerName) setBuyerName(defaultBuyerName.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.'-]/g, ''));
      if (defaultBuyerEmail) setBuyerEmail(defaultBuyerEmail);
      if (defaultBuyerPhone) {
        handlePhoneChange(defaultBuyerPhone);
      } else {
        setBuyerPhone('+57');
      }
      if (defaultBuyerCountry) {
        setBuyerCountry(defaultBuyerCountry);
        setCurrency(defaultBuyerCountry.toLowerCase().includes('colombia') ? 'COP' : 'USD');
      }
      setErrorMsg('');
      setMissingKeysWarning(false);
      // Pre-carga silenciosa del script de Bold al abrir el modal
      loadBoldCheckoutScript().catch(() => {});
    }
  }, [
    isOpen,
    planTier,
    reloadTab,
    defaultBuyerName,
    defaultBuyerEmail,
    defaultBuyerPhone,
    defaultBuyerCountry,
  ]);

  if (!isOpen) return null;

  const amountUsd = orderType === 'credit_reload' ? 50 : PLAN_DETAILS[selectedPlan].priceUsd;
  const approxCop = Math.round(amountUsd * (exchangeRateCop || 4150));

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleProceedToBold = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setMissingKeysWarning(false);

    const cleanName = buyerName.trim();
    const cleanEmail = buyerEmail.trim().toLowerCase();
    const cleanPhone = buyerPhone.trim();

    // 1. Validación estricta de Nombre (solo texto y al menos 3 caracteres)
    if (!cleanName || cleanName.length < 3) {
      setErrorMsg(
        isEn
          ? 'Please enter a valid full name (letters only).'
          : 'Por favor ingresa un nombre y apellido válido (solo letras).'
      );
      return;
    }

    // 2. Validación estricta de Correo (debe tener @ y extensión de dominio real como .com, .co, .net, etc.)
    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      setErrorMsg(
        isEn
          ? 'Please enter a valid email address with @ and domain extension (e.g. name@domain.com).'
          : 'Por favor ingresa un correo electrónico real y completo (con @ y extensión de dominio, ej. tunombre@dominio.com).'
      );
      return;
    }

    // 3. Validación estricta de Teléfono (debe iniciar con '+' y tener código de país + número, mínimo 9 dígitos en total)
    const phoneDigits = cleanPhone.replace(/[^0-9]/g, '');
    if (!cleanPhone.startsWith('+') || phoneDigits.length < 8) {
      setErrorMsg(
        isEn
          ? 'Please enter a valid WhatsApp number starting with + and country code (e.g. +573001234567).'
          : 'Por favor ingresa tu número con formato internacional iniciando con + y código de país (ej. +573001234567).'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/payments/bold/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderType,
          planTier: orderType === 'new_plan' ? selectedPlan : undefined,
          reloadTab: orderType === 'credit_reload' ? selectedTab : undefined,
          advisorId,
          advisorUsername,
          desiredUsername: orderType === 'new_plan' ? desiredUsername : undefined,
          buyerName: buyerName.trim(),
          buyerEmail: buyerEmail.trim(),
          buyerPhone: buyerPhone.trim(),
          buyerCountry: buyerCountry.trim() || 'Colombia',
          currency,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.missingCredentials) {
          setMissingKeysWarning(true);
        }
        setErrorMsg(
          data.error ||
            (isEn ? 'Could not initialize payment session.' : 'No se pudo iniciar la sesión de pago.')
        );
        setIsSubmitting(false);
        return;
      }

      await loadBoldCheckoutScript();

      if (!window.BoldCheckout) {
        throw new Error(
          isEn
            ? 'Bold gateway widget failed to initialize. Please retry.'
            : 'No se pudo inicializar el widget de Bold. Por favor intenta nuevamente.'
        );
      }

      const cfg = data.checkoutConfig;
      const checkout = new window.BoldCheckout({
        orderId: cfg.orderId,
        currency: cfg.currency,
        amount: cfg.amount,
        apiKey: cfg.apiKey,
        integritySignature: cfg.integritySignature,
        description: cfg.description,
        redirectionUrl: cfg.redirectionUrl,
        customerData: JSON.stringify({
          email: cfg.customerData?.email || buyerEmail.trim(),
          fullName: cfg.customerData?.fullName || buyerName.trim(),
          phone: (cfg.customerData?.phone || buyerPhone.trim()).replace(/[^0-9]/g, ''),
          dialCode: '+57',
        }),
      });

      onClose();
      checkout.open();
    } catch (err: any) {
      setErrorMsg(
        err?.message ||
          (isEn ? 'Error connecting to Bold gateway.' : 'Error conectando con la pasarela Bold.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#121C42] via-[#1B1F4B] to-slate-900 border-b border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-black uppercase tracking-wider mb-2">
              <Lock className="w-3 h-3" />
              <span>{isEn ? 'Secured by Bold Colombia' : 'Pasarela Oficial Bold Colombia'}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              {orderType === 'credit_reload' ? (
                <>
                  <Zap className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
                  <span>{isEn ? 'Instant Credit Top-Up (+10)' : 'Recarga Instantánea (+10 Créditos)'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{isEn ? 'Activate Local Studio License' : 'Activar Licencia Local Studio'}</span>
                </>
              )}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              {orderType === 'credit_reload'
                ? isEn
                  ? `Advisor account: @${advisorUsername || 'studio'} • Immediate unlock after payment.`
                  : `Cuenta asesor: @${advisorUsername || 'studio'} • Activación automática al pagar.`
                : isEn
                ? 'Immediate automated provisioning: your username and access key are created right after checkout.'
                : 'Aprovisionamiento automático inmediato: tu usuario y contraseña quedan activos apenas confirmas el pago.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer shrink-0"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleProceedToBold} className="p-5 sm:p-6 space-y-4">
          {/* Resumen o selector de paquete */}
          {orderType === 'new_plan' ? (
            <div className="grid grid-cols-3 gap-2">
              {(['level_1', 'level_2', 'level_3'] as BoldPlanTier[]).map((tier) => {
                const info = PLAN_DETAILS[tier];
                const active = selectedPlan === tier;
                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setSelectedPlan(tier)}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                      active
                        ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                      ${info.priceUsd} USD
                    </div>
                    <div className="text-xs font-bold text-white leading-tight mt-0.5">
                      {tier === 'level_1' ? 'Asesor' : tier === 'level_2' ? 'Agencia' : 'Súper Ag.'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {tier === 'level_1' ? '10/tab' : tier === 'level_2' ? '20/tab' : '30/tab'}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                {isEn ? 'Select tab to receive +10 credits ($50 USD):' : 'Elige la pestaña que recibirá +10 créditos ($50 USD):'}
              </label>
              <div className="grid grid-cols-1 gap-1.5 max-h-44 overflow-y-auto pr-1">
                {RELOAD_TABS.map((t) => {
                  const active = selectedTab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTab(t.id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl border text-left transition cursor-pointer ${
                        active
                          ? 'bg-amber-500/15 border-amber-400 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{isEn ? t.labelEn : t.labelEs}</div>
                        <div className="text-[10px] text-slate-400">{isEn ? t.descEn : t.descEs}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[11px] font-black border border-amber-500/40">
                        +10
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Moneda de Pago (COP vs USD) */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isEn ? 'Checkout Currency' : 'Moneda de Cobro en Bold'}</span>
              </span>
              <span className="text-[10px] text-slate-400">
                {currency === 'COP'
                  ? 'PSE • Nequi • Bancolombia • Tarjetas'
                  : 'Visa • Mastercard • Amex • Apple Pay'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCurrency('COP')}
                className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                  currency === 'COP'
                    ? 'bg-cyan-500/15 border-cyan-400 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-black">🇨🇴 Pesos (COP)</div>
                <div className="text-[11px] font-mono text-cyan-300">
                  ~${approxCop.toLocaleString('es-CO')} COP
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-cyan-500/15 border-cyan-400 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-black">🌎 Dólares (USD)</div>
                <div className="text-[11px] font-mono text-emerald-300">${amountUsd} USD exactos</div>
              </button>
            </div>
          </div>

          {/* Datos del Comprador */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                {isEn ? 'Full Name (Letters only) *' : 'Nombre completo (Solo letras) *'}
              </label>
              <input
                type="text"
                required
                value={buyerName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej. Carlos Mendoza"
                pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.'-]{3,}$"
                title="Ingresa tu nombre y apellido usando únicamente letras"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                {isEn ? 'Email (with @ and domain) *' : 'Correo electrónico (con @ y .com) *'}
              </label>
              <input
                type="email"
                required
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                placeholder="carlos@agencia.com"
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                title="Ingresa un correo real con @ y extensión (ej: nombre@dominio.com)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                {isEn ? 'WhatsApp (+ followed by numbers) *' : 'WhatsApp (+ seguido del número) *'}
              </label>
              <input
                type="tel"
                required
                value={buyerPhone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="+573001234567"
                pattern="^\+[0-9]{8,15}$"
                title="Debe iniciar obligatoriamente con + y contener solo números (ej: +573001234567)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:border-emerald-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                {orderType === 'new_plan'
                  ? isEn
                    ? 'Desired Username (optional)'
                    : 'Usuario deseado (opcional)'
                  : isEn
                  ? 'Country'
                  : 'País'}
              </label>
              {orderType === 'new_plan' ? (
                <input
                  type="text"
                  value={desiredUsername}
                  onChange={(e) => setDesiredUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
                  placeholder="ej. carlos_agency"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:border-emerald-500 outline-none font-mono"
                />
              ) : (
                <input
                  type="text"
                  value={buyerCountry}
                  onChange={(e) => setBuyerCountry(e.target.value)}
                  placeholder="Colombia"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:border-emerald-500 outline-none"
                />
              )}
            </div>
          </div>

          {orderType === 'new_plan' && (
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-start gap-2.5 text-[11px] text-emerald-200">
              <UserCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                {isEn ? (
                  <>
                    Includes <strong>{PLAN_DETAILS[selectedPlan].quotaLabel}</strong> +{' '}
                    <strong>{PLAN_DETAILS[selectedPlan].commissionLabel}</strong>.
                  </>
                ) : (
                  <>
                    Activa al instante <strong>{PLAN_DETAILS[selectedPlan].quotaLabel}</strong> +{' '}
                    <strong>{PLAN_DETAILS[selectedPlan].commissionLabel}</strong>.
                  </>
                )}
              </span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs space-y-2">
              <p className="font-semibold">{errorMsg}</p>
              {missingKeysWarning && (
                <a
                  href={`https://wa.me/573058314049?text=${encodeURIComponent(
                    `Hola Luisma! Quiero activar ${
                      orderType === 'credit_reload'
                        ? `Recarga +10 Créditos ($50 USD) para @${advisorUsername}`
                        : `el ${PLAN_DETAILS[selectedPlan].titleEs} ($${amountUsd} USD)`
                    }. Mi correo es ${buyerEmail}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-black text-[11px]"
                >
                  Solicitar Activación Directa por WhatsApp →
                </a>
              )}
            </div>
          )}

          {/* Submit Bold Button */}
          <div className="pt-1 space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#FF305C] via-[#E11D48] to-[#BE123C] hover:brightness-110 disabled:opacity-60 text-white font-black text-sm shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2.5 transition cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isEn ? 'Connecting securely with Bold...' : 'Conectando de forma segura con Bold...'}</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {isEn ? 'Pay Now with Bold • ' : 'Pagar Ahora con Bold • '}
                    {currency === 'COP' ? `~$${approxCop.toLocaleString('es-CO')} COP` : `$${amountUsd} USD`}
                  </span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Cifrado SHA-256 oficial Bold
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                Activación sin esperar
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
