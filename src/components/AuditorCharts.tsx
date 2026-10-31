import React from 'react';

interface RetentionDonutProps {
  satisfiedCount: number;
  unhappyCount: number;
  silentUnhappyCount: number;
  totalMonthly: number;
  clientLabel: string;
  lang?: 'es' | 'en';
}

export function RetentionDonutChart({
  satisfiedCount,
  unhappyCount,
  silentUnhappyCount,
  totalMonthly,
  clientLabel,
  lang = 'es',
}: RetentionDonutProps) {
  const safeTotal = Math.max(1, totalMonthly);
  const satisfiedPct = Math.round((Math.max(0, satisfiedCount) / safeTotal) * 100);
  const unhappyPct = Math.max(1, Math.round((unhappyCount / safeTotal) * 100));
  const silentPct = Math.round((silentUnhappyCount / Math.max(1, unhappyCount)) * 100);

  const radius = 38;
  const circ = 2 * Math.PI * radius;
  const strokeDashoffset = circ - (satisfiedPct / 100) * circ;

  return (
    <div className="p-4 print:p-2 rounded-2xl bg-slate-950 print:bg-white border border-slate-800 print:border-slate-300 flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden">
      {/* SVG Donut */}
      <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#e11d48"
            strokeWidth="12"
            className="opacity-90"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#10b981"
            strokeWidth="12"
            strokeDasharray={circ}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-black text-white print:text-slate-950">{satisfiedPct}%</span>
          <span className="text-[9px] text-slate-400 print:text-slate-600 font-bold uppercase tracking-tight">
            {lang === 'en' ? 'Satisfied' : 'Satisfechos'}
          </span>
        </div>
      </div>

      {/* Legend & Churn Alert */}
      <div className="flex-1 space-y-1.5 text-xs print:text-[10.5px]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 print:text-slate-700">
            {lang === 'en' ? 'Retention & Silent Churn Model' : 'Modelo de Retención & Fuga Silenciosa'}
          </span>
          <span className="text-[10px] font-bold text-rose-400 print:text-rose-700 bg-rose-950/80 print:bg-white px-2 py-0.5 rounded border border-rose-500/30 print:border-slate-300">
            {unhappyPct}% {lang === 'en' ? 'Friction' : 'Con Fricción'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2 rounded-xl bg-emerald-950/40 print:bg-white border border-emerald-500/20 print:border-slate-200">
            <span className="text-[10px] text-emerald-300 print:text-emerald-700 block font-semibold">
              🟢 {lang === 'en' ? 'Loyal Clients' : 'Clientes Fieles'}
            </span>
            <strong className="text-white print:text-slate-950 text-sm block mt-0.5">
              ~{satisfiedCount.toLocaleString()} <span className="text-[10px] font-normal text-slate-400 print:text-slate-500">/{lang === 'en' ? 'mo' : 'mes'}</span>
            </strong>
          </div>

          <div className="p-2 rounded-xl bg-rose-950/40 print:bg-white border border-rose-500/20 print:border-slate-200">
            <span className="text-[10px] text-rose-300 print:text-rose-700 block font-semibold">
              🔴 {lang === 'en' ? 'Unhappy Churn' : 'Fuga Silenciosa'}
            </span>
            <strong className="text-rose-400 print:text-rose-700 text-sm block mt-0.5">
              ~{silentUnhappyCount.toLocaleString()} <span className="text-[10px] font-normal text-rose-300/70 print:text-slate-500">/{lang === 'en' ? 'mo' : 'mes'}</span>
            </strong>
          </div>
        </div>

        <p className="text-[10.5px] print:text-[9.5px] text-slate-400 print:text-slate-600 leading-snug pt-0.5">
          {lang === 'en' ? (
            <><strong>{silentPct}% of unhappy {clientLabel.toLowerCase()}</strong> never say anything to the manager — they just leave and never return.</>
          ) : (
            <>El <strong>{silentPct}% de los clientes inconformes</strong> nunca le dice nada al encargado: se van en silencio y no regresan jamás.</>
          )}
        </p>
      </div>
    </div>
  );
}

interface FinancialRoiChartProps {
  moneySavedYearly: number;
  newRevenueYearly: number;
  totalBenefitYearly: number;
  currencySymbol: string;
  lang?: 'es' | 'en';
}

export function FinancialRoiComparisonChart({
  moneySavedYearly,
  newRevenueYearly,
  totalBenefitYearly,
  currencySymbol,
  lang = 'es',
}: FinancialRoiChartProps) {
  const maxVal = Math.max(totalBenefitYearly, moneySavedYearly + newRevenueYearly, 1);
  const savedPct = Math.max(8, Math.round((moneySavedYearly / maxVal) * 100));
  const newRevPct = Math.max(8, Math.round((newRevenueYearly / maxVal) * 100));

  const fmt = (num: number) => `${currencySymbol}${num.toLocaleString()}`;

  return (
    <div className="p-5 print:p-3 rounded-2xl bg-slate-950 print:bg-white border border-slate-800 print:border-slate-300 space-y-3.5 print:space-y-2">
      <div className="flex items-center justify-between border-b border-slate-800 print:border-slate-200 pb-2">
        <span className="text-xs font-black uppercase tracking-wider text-slate-200 print:text-slate-900">
          {lang === 'en' ? 'Annual Financial Impact Breakdown' : 'Desglose de Impacto Financiero Anual'}
        </span>
        <span className="text-xs font-black text-emerald-400 print:text-emerald-700 bg-emerald-950/80 print:bg-white px-2.5 py-0.5 rounded-full border border-emerald-500/40 print:border-slate-300">
          {lang === 'en' ? 'High Impact ROI' : 'Retorno de Alta Rentabilidad'}
        </span>
      </div>

      {/* Bar 2: Money Saved */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs print:text-[10px]">
          <span className="text-emerald-300 print:text-emerald-700 font-bold flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            {lang === 'en' ? 'Money Saved from Churn Leakage' : 'Dinero Salvado por Retención de Fuga'}
          </span>
          <span className="font-mono font-bold text-emerald-400 print:text-emerald-700">{fmt(moneySavedYearly)}</span>
        </div>
        <div className="h-3.5 print:h-2.5 rounded-full bg-slate-900 print:bg-slate-100 border border-slate-800 print:border-slate-300 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 ease-out"
            style={{ width: `${savedPct}%` }}
          />
        </div>
      </div>

      {/* Bar 3: New Google Revenue */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs print:text-[10px]">
          <span className="text-indigo-300 print:text-indigo-700 font-bold flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" />
            {lang === 'en' ? 'New Revenue from Google Local Top 3' : 'Ventas Nuevas por Conquistar Top 3 Google'}
          </span>
          <span className="font-mono font-bold text-indigo-300 print:text-indigo-700">{fmt(newRevenueYearly)}</span>
        </div>
        <div className="h-3.5 print:h-2.5 rounded-full bg-slate-900 print:bg-slate-100 border border-slate-800 print:border-slate-300 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-amber-400 transition-all duration-700 ease-out"
            style={{ width: `${newRevPct}%` }}
          />
        </div>
      </div>

      {/* Combined Net Gain Card */}
      <div className="p-3 print:p-2 rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 print:bg-white border border-emerald-500/40 print:border-slate-300 flex items-center justify-between text-xs print:text-[10.5px]">
        <div>
          <span className="text-[10px] font-bold uppercase text-slate-400 print:text-slate-600 block">
            {lang === 'en' ? 'Net Annual Business Gain' : 'Beneficio Financiero Neto Anual'}
          </span>
          <strong className="text-base sm:text-lg print:text-sm font-black text-emerald-400 print:text-emerald-700">
            {fmt(totalBenefitYearly)}
          </strong>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 print:text-slate-600 block">
            {lang === 'en' ? 'Payback Period' : 'Retorno de Inversión'}
          </span>
          <span className="text-xs font-black text-indigo-300 print:text-indigo-700">
            {lang === 'en' ? '< 30 Days' : '< 30 Días'}
          </span>
        </div>
      </div>
    </div>
  );
}
