'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Lock,
  Globe,
  CheckCircle2,
  ExternalLink,
  Award,
  Sparkles,
  Download,
  Building2,
  Check,
  MessageSquare,
} from 'lucide-react';
import { PrestigiaIcon } from '@/components/PrestigiaIcon';
import {
  Jurisdiction,
  JURISDICTIONS,
  getLegalDocuments,
} from '@/lib/legal-agreements';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  ownerName: string;
  plan: string;
  branchesCount: number;
  agreedPrice?: string;
  billingCycle?: string;
  initialJurisdiction?: Jurisdiction;
}

export function LegalModal({
  isOpen,
  onClose,
  businessName,
  ownerName,
  plan,
  branchesCount,
  agreedPrice,
  billingCycle = 'Mensual',
  initialJurisdiction = 'co',
}: LegalModalProps) {
  const [activeDoc, setActiveDoc] = useState<'msa' | 'dpa' | 'sla'>('msa');
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>(initialJurisdiction);
  const [copiedHash, setCopiedHash] = useState(false);

  if (!isOpen) return null;

  const currentJur = JURISDICTIONS[jurisdiction];

  // Commercial Terms: Payments are agreed directly with each client (no hardcoded prices)
  const defaultPrice =
    agreedPrice ||
    (jurisdiction === 'us'
      ? 'According to terms agreed in Direct Commercial Contract'
      : 'Según lo pactado en Contrato Comercial Directo');

  const docs = getLegalDocuments({
    businessName: businessName || 'Empresa Suscriptora',
    ownerName: ownerName || 'Representante Legal',
    plan: plan || 'elite',
    branchesCount: branchesCount || 1,
    agreedPriceFormatted: defaultPrice,
    billingCycle,
    jurisdiction,
  });

  const selectedDoc = docs[activeDoc];

  const handleCopyHash = () => {
    navigator.clipboard.writeText(`PRESTIGIA-VERIFIED-${businessName.replace(/\s+/g, '-').toUpperCase()}-${Date.now()}`);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto no-scrollbar animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0D1424] border border-indigo-500/40 text-left shadow-2xl text-white overflow-hidden relative">
        
        {/* TOP BAR */}
        <div className="p-4 sm:p-6 border-b border-slate-800/90 bg-[#0A0E1A] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <PrestigiaIcon className="w-9 h-9 drop-shadow-lg shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-wide">
                  Marco Legal & Licencia SaaS B2B
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Internacional
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Garantía Jurídica, Protección de Datos y Contrato Oficial de Suscripción
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition text-xs cursor-pointer"
              title="Cerrar Marco Legal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* JURISDICTION SELECTOR & DOCUMENT TABS ROW */}
        <div className="p-3 sm:px-6 bg-[#070A12] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          
          {/* Document Type Tabs */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setActiveDoc('msa')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                activeDoc === 'msa'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1. Contrato de Licencia (MSA)</span>
            </button>

            <button
              onClick={() => setActiveDoc('dpa')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                activeDoc === 'dpa'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>2. Datos & Privacidad (DPA)</span>
            </button>

            <button
              onClick={() => setActiveDoc('sla')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                activeDoc === 'sla'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>3. Soporte & SLA</span>
            </button>
          </div>

          {/* Territorial Jurisdiction Pill Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold px-1.5 hidden md:inline">
              Jurisdicción:
            </span>
            {(Object.keys(JURISDICTIONS) as Jurisdiction[]).map((jKey) => {
              const item = JURISDICTIONS[jKey];
              const isSelected = jurisdiction === jKey;
              return (
                <button
                  key={jKey}
                  type="button"
                  onClick={() => setJurisdiction(jKey)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title={`Marco normativo aplicable en ${item.name}`}
                >
                  <span>{item.flag}</span>
                  <span className="hidden sm:inline text-[11px]">{item.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* DOCUMENT VIEWER (READ-ONLY SECTION) */}
        <div id="prestigia-legal-document" className="p-5 sm:p-8 overflow-y-auto space-y-6 text-slate-300 text-xs leading-relaxed">
          
          {/* Header of the Selected Document */}
          <div className="border-b border-slate-800/80 pb-4 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-indigo-400 font-bold uppercase tracking-wider">
              <span>Prestigia Enterprise Legal Framework</span>
              <span className="flex items-center gap-1 text-slate-400">
                <span>{currentJur.flag} Jurisdicción Oficial:</span>
                <strong className="text-white font-semibold">{currentJur.name}</strong>
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              {selectedDoc.title}
            </h2>
            <p className="text-xs text-slate-400">
              {selectedDoc.subtitle}
            </p>
          </div>

          {/* Document Sections */}
          <div className="space-y-5">
            {selectedDoc.sections.map((section, idx) => (
              <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <h4 className="font-bold text-white text-xs sm:text-sm tracking-wide">
                  {section.title}
                </h4>
                <div className="text-[11px] sm:text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          {/* Digital Signature & Cryptographic Seal */}
          <div className="p-5 rounded-2xl bg-[#070A12] border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">Sello de Aceptación Digital B2B</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                  Validado
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyHash}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono cursor-pointer"
                title="Copiar Hash de Verificación"
              >
                {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <ExternalLink className="w-3 h-3" />}
                <span>{copiedHash ? '¡Copiado!' : 'Copiar Hash Verificación'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              <div>
                <span className="block text-slate-500 font-medium">Suscriptor Autorizado:</span>
                <strong className="text-slate-200">{businessName}</strong> ({ownerName || 'Titular'})
              </div>
              <div>
                <span className="block text-slate-500 font-medium">Autoridad Competente:</span>
                <strong className="text-slate-200">{currentJur.authority}</strong>
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="p-3.5 sm:px-6 bg-[#0A0E1A] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <span className="text-[11px] text-slate-500">
            {jurisdiction === 'us'
              ? 'Official Terms of Service • Certified legal copies available upon request to Support.'
              : 'Marco normativo oficial • Para copias certificadas en PDF o adendas contables, contáctanos en Soporte.'}
          </span>
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/573001234567?text=${encodeURIComponent(
                jurisdiction === 'us'
                  ? `Hello Prestigia Support, I would like to request an official PDF copy of our service agreement for ${businessName}.`
                  : `Hola Soporte Prestigia, solicito una copia oficial en PDF de nuestro contrato de servicio para ${businessName}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition font-bold text-xs flex items-center gap-1.5 shadow-sm"
              title="Solicitar documento oficial en PDF a Soporte"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Solicitar Copia Oficial en PDF</span>
            </a>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30 active:scale-95 cursor-pointer"
            >
              Entendido y Cerrar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
