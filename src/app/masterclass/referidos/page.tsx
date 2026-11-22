'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { PrestigiaIcon } from '@/components/PrestigiaIcon';
import {
  Users,
  Search,
  RefreshCw,
  Download,
  MessageSquare,
  Award,
  Sparkles,
  Copy,
  Trash2,
  ExternalLink,
  Filter,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  Share2,
  ChevronRight,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

interface ReferralSummaryItem {
  code: string;
  count: number;
  leads: Array<{
    id: string;
    createdAt: string;
    fullName: string;
    phone: string;
    email?: string;
    city?: string;
    country?: string;
    role?: string;
    status: string;
    device?: string;
    referredBy: string;
  }>;
}

interface DeleteTarget {
  type: 'lead' | 'friend';
  id: string;
  name: string;
  count?: number;
}

export default function MasterclassReferidosPage() {
  const [loading, setLoading] = useState(true);
  const [totalLeads, setTotalLeads] = useState(0);
  const [referralSummary, setReferralSummary] = useState<ReferralSummaryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'friends' | 'leads'>('friends');
  const [selectedFriend, setSelectedFriend] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New Ally link generator
  const [newFriendInput, setNewFriendInput] = useState('');
  const [createdFriendLink, setCreatedFriendLink] = useState<string | null>(null);

  // Deletion state
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/masterclass/leads');
      const data = await res.json();
      if (data.success) {
        setTotalLeads(data.totalLeads || 0);
        setReferralSummary(data.referralSummary || []);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Flatten all leads
  const allLeads = useMemo(() => {
    const list: any[] = [];
    referralSummary.forEach((item) => {
      list.push(...item.leads);
    });
    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [referralSummary]);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead) => {
      if (selectedFriend !== 'all' && lead.referredBy !== selectedFriend) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const match =
          lead.fullName.toLowerCase().includes(q) ||
          lead.phone.toLowerCase().includes(q) ||
          (lead.city && lead.city.toLowerCase().includes(q)) ||
          lead.referredBy.toLowerCase().includes(q) ||
          (lead.role && lead.role.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [allLeads, selectedFriend, searchTerm]);

  // Copy link
  const copyFriendLink = (friendCode: string) => {
    const link = `https://prestigia-oficial.vercel.app/masterclass?angle=ingresos-casa&ref=${friendCode.toLowerCase().trim()}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(link);
      setCopiedCode(friendCode);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  // Generate ally link on the fly
  const handleGenerateFriendLink = () => {
    if (!newFriendInput.trim()) return;
    const clean = newFriendInput.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '');
    const url = `https://prestigia-oficial.vercel.app/masterclass?angle=ingresos-casa&ref=${clean}`;
    setCreatedFriendLink(url);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
  };

  // Delete execution
  const executeDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const payload =
        deleteTarget.type === 'lead'
          ? { leadId: deleteTarget.id }
          : { friendCode: deleteTarget.id };

      const res = await fetch('/api/masterclass/leads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        if (deleteTarget.type === 'friend' && selectedFriend === deleteTarget.id) {
          setSelectedFriend('all');
        }
        await fetchLeads();
        setDeleteTarget(null);
      } else {
        alert(data.error || 'Error al eliminar');
      }
    } catch (err) {
      console.error('Error deleting target:', err);
      alert('Error de conexión al eliminar');
    } finally {
      setIsDeleting(false);
    }
  };

  // Professional Executive Excel Export (with XML/HTML & mso-number-format)
  const handleDownloadExecutiveExcel = () => {
    if (filteredLeads.length === 0) return;

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const filterLabel =
      selectedFriend === 'all'
        ? 'Todos los Aliados (Consolidado General)'
        : `@${selectedFriend.toUpperCase()}`;

    const excelHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Referidos Masterclass</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; }
          .banner-main { background-color: #0F172A; color: #FFFFFF; font-size: 15pt; font-weight: bold; text-align: center; padding: 12px; }
          .banner-sub { background-color: #1E293B; color: #F59E0B; font-size: 10.5pt; font-weight: bold; text-align: center; padding: 6px; }
          .kpi-title { background-color: #F1F5F9; color: #475569; font-weight: bold; font-size: 9pt; border: 1px solid #CBD5E1; padding: 6px 10px; }
          .kpi-val { background-color: #FFFFFF; color: #0F172A; font-weight: bold; font-size: 10pt; border: 1px solid #CBD5E1; padding: 6px 10px; }
          .th-col { background-color: #0F172A; color: #FFFFFF; font-weight: bold; font-size: 9.5pt; text-align: center; border: 1px solid #334155; padding: 8px; }
          .td-row { font-size: 9pt; border: 1px solid #CBD5E1; padding: 6px 8px; vertical-align: middle; }
          .td-phone { font-size: 9pt; border: 1px solid #CBD5E1; padding: 6px 8px; vertical-align: middle; mso-number-format: "\\@"; }
          .td-ref { background-color: #FEF3C7; color: #92400E; font-weight: bold; text-align: center; border: 1px solid #CBD5E1; }
          .td-alt { background-color: #F8FAFC; }
        </style>
      </head>
      <body>
        <table>
          <tr>
            <td colspan="8" class="banner-main">PRESTIGIA HQ &bull; REPORTE EJECUTIVO DE INVITADOS MASTERCLASS</td>
          </tr>
          <tr>
            <td colspan="8" class="banner-sub">Masterclass de Posicionamiento Local &bull; 10 de Diciembre 2026 &bull; Director General: Luisma</td>
          </tr>
          <tr><td colspan="8"></td></tr>
          <tr>
            <td class="kpi-title">Fecha de Emisi&oacute;n:</td>
            <td class="kpi-val" colspan="2">${dateFormatted}</td>
            <td class="kpi-title">Filtro Aliado:</td>
            <td class="kpi-val" colspan="2">${filterLabel}</td>
            <td class="kpi-title">Total Registros:</td>
            <td class="kpi-val" style="color: #059669; font-size: 11pt;">${filteredLeads.length} Invitados</td>
          </tr>
          <tr><td colspan="8"></td></tr>
          <thead>
            <tr>
              <th class="th-col" style="width: 45px;">#</th>
              <th class="th-col" style="width: 130px;">Fecha y Hora</th>
              <th class="th-col" style="width: 180px;">Nombre del Invitado</th>
              <th class="th-col" style="width: 140px;">WhatsApp Directo</th>
              <th class="th-col" style="width: 130px;">Ciudad y Pa&iacute;s</th>
              <th class="th-col" style="width: 160px;">Perfil / Profesion</th>
              <th class="th-col" style="width: 130px;">Promotor / Aliado</th>
              <th class="th-col" style="width: 150px;">Enlace Chat WhatsApp</th>
            </tr>
          </thead>
          <tbody>
            ${filteredLeads
              .map((lead, idx) => {
                const bg = idx % 2 === 1 ? 'td-alt' : '';
                const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
                const waUrl = `https://wa.me/${cleanPhone}`;
                const dt = new Date(lead.createdAt).toLocaleString('es-CO');
                const refCode = (lead.referredBy || 'DIRECTO').toUpperCase();
                return `
                  <tr>
                    <td class="td-row ${bg}" style="text-align: center;">${idx + 1}</td>
                    <td class="td-row ${bg}">${dt}</td>
                    <td class="td-row ${bg}" style="font-weight: bold; color: #0F172A;">${lead.fullName || ''}</td>
                    <td class="td-phone ${bg}" style="mso-number-format:'\\@'; font-weight: bold;">${lead.phone || ''}</td>
                    <td class="td-row ${bg}">${lead.city || 'Bogotá'}, ${lead.country || 'Colombia'}</td>
                    <td class="td-row ${bg}">${lead.role || 'Independiente'}</td>
                    <td class="td-row td-ref ${bg}">${refCode}</td>
                    <td class="td-row ${bg}" style="text-align: center;">
                      <a href="${waUrl}">Abrir Chat en WhatsApp</a>
                    </td>
                  </tr>
                `;
              })
              .join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Reporte_Ejecutivo_Masterclass_${selectedFriend}_${now.toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#06080E] text-slate-100 font-sans antialiased selection:bg-amber-500/20 selection:text-amber-300">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/local-studio" className="flex items-center gap-2 group">
              <PrestigiaIcon className="w-8 h-8 text-amber-400 group-hover:scale-105 transition" />
              <div className="leading-none">
                <span className="font-black text-sm tracking-widest text-white block">PRESTIGIA</span>
                <span className="text-[10px] text-amber-400 font-black tracking-widest uppercase block">
                  RED DE ALIADOS & REFERIDOS
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/masterclass"
              target="_blank"
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 transition flex items-center gap-1.5"
            >
              <span>Ver Landing</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <button
              onClick={fetchLeads}
              disabled={loading}
              className="text-xs text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* TITLE & ACTIONS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Panel Ejecutivo de Aliados Estratégicos & Tráfico</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Gestión Oficial de Aliados y Referidos
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Monitorea los prospectos de la Masterclass del 10 de Diciembre, filtra por aliado, elimina registros y descarga reportes profesionales en Excel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleDownloadExecutiveExcel}
              disabled={filteredLeads.length === 0}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
              title="Descarga en formato Excel profesional con teléfonos corregidos (sin notación científica)"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Reporte Excel ({filteredLeads.length})</span>
            </button>
          </div>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Invitados</span>
            <div className="text-3xl font-black text-white font-mono">{totalLeads}</div>
            <span className="text-[10px] text-amber-400 font-semibold block">Prospectos en Base de Datos</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Aliados Activos</span>
            <div className="text-3xl font-black text-amber-400 font-mono">
              {referralSummary.filter((r) => r.code !== 'directo').length}
            </div>
            <span className="text-[10px] text-slate-400 block">Compartiendo enlaces únicos</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Top Aliado #1</span>
            <div className="text-2xl font-black text-emerald-400 truncate font-mono">
              {referralSummary.find((r) => r.code !== 'directo')?.code
                ? `@${referralSummary.find((r) => r.code !== 'directo')!.code}`
                : 'Sin datos'}
            </div>
            <span className="text-[10px] text-emerald-300 font-semibold block">
              {referralSummary.find((r) => r.code !== 'directo')?.count
                ? `${referralSummary.find((r) => r.code !== 'directo')!.count} invitados traídos`
                : 'Pasa los enlaces a tus aliados'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tráfico Directo</span>
            <div className="text-3xl font-black text-purple-400 font-mono">
              {referralSummary.find((r) => r.code === 'directo')?.count || 0}
            </div>
            <span className="text-[10px] text-slate-400 block">Registros orgánicos / sin código</span>
          </div>
        </div>

        {/* TAB CONTROLS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-slate-900/90 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('friends')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'friends'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>👥 Lista de Aliados / Promotores</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeTab === 'friends' ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'
              }`}>
                {referralSummary.filter((r) => r.code !== 'directo').length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'leads'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>📋 Lista de Referidos / Invitados</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeTab === 'leads' ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'
              }`}>
                {filteredLeads.length}
              </span>
            </button>
          </div>

          {/* Quick Ally Filter in Leads Tab */}
          {activeTab === 'leads' && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-[11px] text-slate-400 font-bold whitespace-nowrap flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-amber-400" />
                <span>Filtrar Aliado:</span>
              </span>
              <select
                value={selectedFriend}
                onChange={(e) => setSelectedFriend(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-white text-xs font-mono rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-400 w-full sm:w-auto"
              >
                <option value="all">⭐ Ver Todos ({totalLeads})</option>
                {referralSummary.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.code === 'directo' ? '🌐 Directo' : `@${item.code}`} ({item.count})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: LISTA DE ALIADOS / PROMOTORES */}
        {/* ============================================================== */}
        {activeTab === 'friends' && (
          <div className="space-y-6">
            {/* GENERAR ENLACE RÁPIDO PARA UN ALIADO */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-black text-sm">
                <UserPlus className="w-4 h-4" />
                <span>Generar Enlace Personalizado para un Nuevo Aliado</span>
              </div>
              <p className="text-xs text-slate-300">
                Escribe el nombre o alias de tu aliado estratégico para crear de inmediato su enlace de recomendación con comisión del 20% recurrente sobre ventas de Prestigia:
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <span className="absolute left-3 top-2.5 text-amber-400 font-mono text-sm font-bold">@</span>
                  <input
                    type="text"
                    value={newFriendInput}
                    onChange={(e) => setNewFriendInput(e.target.value)}
                    placeholder="ej: carlos, andres, mariana, agenciatop"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <button
                  onClick={handleGenerateFriendLink}
                  disabled={!newFriendInput.trim()}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Crear y Copiar Enlace</span>
                </button>
              </div>

              {createdFriendLink && (
                <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="truncate w-full sm:w-auto font-mono text-emerald-400">
                    <span className="text-slate-400 text-[10px] block">¡Enlace creado y copiado al portapapeles!</span>
                    {createdFriendLink}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `¡Hola! Luisma me invitó a la Masterclass VIP de posicionamiento de negocios en Google Maps del 10 de Dic. Regístrate gratis aquí con mi pase: ${createdFriendLink}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/30 transition flex items-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Compartir por WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* TABLA DE ALIADOS */}
            <div className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-white">Ranking de Aliados Estratégicos</h3>
                  <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                    {referralSummary.length} promotores registrados
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Comisión proyectada por cliente Prestigia: <span className="text-emerald-400 font-bold">20% mensual recurrente</span>
                </div>
              </div>

              {referralSummary.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <Users className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-sm font-bold text-white">Aún no hay aliados con referidos</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Crea un enlace con la caja superior y compártelo a tus aliados para que empiecen a sumar invitados.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4 w-12 text-center">Rank</th>
                        <th className="py-3 px-4">Aliado / Promotor</th>
                        <th className="py-3 px-4 text-center">Invitados Registrados</th>
                        <th className="py-3 px-4">Enlace Único de Referido</th>
                        <th className="py-3 px-4 text-center">Comisión Estimada (20%)</th>
                        <th className="py-3 px-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-sans">
                      {referralSummary.map((item, idx) => {
                        const isDirect = item.code === 'directo';
                        const link = `https://prestigia-oficial.vercel.app/masterclass?angle=ingresos-casa&ref=${item.code}`;

                        return (
                          <tr key={item.code} className="hover:bg-slate-800/40 transition">
                            <td className="py-3 px-4 text-center font-mono font-bold text-slate-400">
                              {idx === 0 && !isDirect ? (
                                <span className="text-base" title="Top 1">🥇</span>
                              ) : idx === 1 && !isDirect ? (
                                <span className="text-base" title="Top 2">🥈</span>
                              ) : idx === 2 && !isDirect ? (
                                <span className="text-base" title="Top 3">🥉</span>
                              ) : (
                                `#${idx + 1}`
                              )}
                            </td>

                            <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                              {isDirect ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-400 text-sm">🌐</span>
                                  <div>
                                    <div className="font-mono text-purple-400">Tráfico Directo / Web</div>
                                    <div className="text-[10px] text-slate-500 font-normal">Sin código de promotor</div>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className="text-amber-400 text-sm">🎟️</span>
                                  <div>
                                    <div className="font-mono text-amber-300 text-sm">@{item.code}</div>
                                    <div className="text-[10px] text-slate-400 font-normal">Aliado Estratégico</div>
                                  </div>
                                </div>
                              )}
                            </td>

                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-700 text-amber-400 font-mono font-bold text-xs">
                                {item.count} {item.count === 1 ? 'invitado' : 'invitados'}
                              </span>
                            </td>

                            <td className="py-3 px-4 whitespace-nowrap">
                              {isDirect ? (
                                <span className="text-[11px] text-slate-500 italic">Enlace general sin parámetro</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => copyFriendLink(item.code)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-mono transition cursor-pointer"
                                  title="Copiar enlace oficial de este aliado"
                                >
                                  <Copy className="w-3 h-3 text-amber-400" />
                                  <span>{copiedCode === item.code ? '¡Copiado!' : `...&ref=${item.code}`}</span>
                                </button>
                              )}
                            </td>

                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              <span className="text-emerald-400 font-mono font-bold text-xs">
                                ${(item.count * 10).toLocaleString()} - ${(item.count * 28).toLocaleString()} USD/mes
                              </span>
                              <span className="text-[9px] text-slate-500 block">Si contratan software</span>
                            </td>

                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedFriend(item.code);
                                    setActiveTab('leads');
                                  }}
                                  className="px-3 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                  title="Filtrar y ver los invitados de este aliado"
                                >
                                  <span>Ver Invitados</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setDeleteTarget({
                                      type: 'friend',
                                      id: item.code,
                                      name: isDirect ? 'Tráfico Directo' : `@${item.code}`,
                                      count: item.count,
                                    })
                                  }
                                  className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition cursor-pointer"
                                  title={`Eliminar aliado ${item.code} y todos sus ${item.count} referidos`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: LISTA DE REFERIDOS / INVITADOS */}
        {/* ============================================================== */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            {/* SEARCH & FILTERS BAR */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar invitado por nombre, teléfono, ciudad o código..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-sans"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>

              {selectedFriend !== 'all' && (
                <button
                  onClick={() => setSelectedFriend('all')}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold transition whitespace-nowrap cursor-pointer"
                >
                  Ver Todos los Aliados
                </button>
              )}

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition whitespace-nowrap cursor-pointer"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>

            {/* TABLA DE INVITADOS */}
            <div className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-white">Listado Completo de Invitados</h3>
                  <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                    {filteredLeads.length} registrados
                  </span>
                </div>

                {selectedFriend !== 'all' && (
                  <span className="text-xs text-slate-300">
                    Filtrado por: <strong className="text-amber-400 font-mono">@{selectedFriend}</strong>
                  </span>
                )}
              </div>

              {filteredLeads.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <Users className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-sm font-bold text-white">No hay invitados en esta vista</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {selectedFriend !== 'all'
                      ? `Tu aliado @${selectedFriend} aún no tiene registros. Pásale su enlace para que empiece a invitar.`
                      : 'Aún no se ha registrado nadie. Los registros aparecerán aquí automáticamente en tiempo real.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Invitado / Contacto</th>
                        <th className="py-3 px-4">WhatsApp Directo</th>
                        <th className="py-3 px-4">Ubicación</th>
                        <th className="py-3 px-4">Perfil</th>
                        <th className="py-3 px-4">Invitado Por (Aliado)</th>
                        <th className="py-3 px-4">Fecha y Hora</th>
                        <th className="py-3 px-4 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-sans">
                      {filteredLeads.map((lead) => {
                        const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
                        const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                          `Hola ${lead.fullName}, te saluda Luisma de Prestigia. Veo que te registraste para la Masterclass del 10 de Diciembre. ¿Pudiste entrar al grupo VIP de WhatsApp?`
                        )}`;

                        return (
                          <tr key={lead.id} className="hover:bg-slate-800/40 transition">
                            <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                              <div>{lead.fullName}</div>
                              {lead.email && <div className="text-[10px] text-slate-400 font-normal">{lead.email}</div>}
                            </td>

                            <td className="py-3 px-4 whitespace-nowrap">
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold transition cursor-pointer"
                                title="Abrir chat en WhatsApp"
                              >
                                <MessageSquare className="w-3 h-3 text-emerald-400" />
                                <span>{lead.phone}</span>
                              </a>
                            </td>

                            <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                              📍 {lead.city || 'Bogotá'}, {lead.country || 'Colombia'}
                            </td>

                            <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                                {lead.role || 'Independiente'}
                              </span>
                            </td>

                            <td className="py-3 px-4 whitespace-nowrap">
                              {lead.referredBy === 'directo' ? (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                                  🌐 Directo / Orgánico
                                </span>
                              ) : (
                                <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40 font-mono font-black inline-flex items-center gap-1">
                                  <span>🎟️</span>
                                  <span>@{lead.referredBy}</span>
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-slate-400 text-[11px] font-mono whitespace-nowrap">
                              {new Date(lead.createdAt).toLocaleDateString()} •{' '}
                              {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>

                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteTarget({
                                    type: 'lead',
                                    id: lead.id,
                                    name: lead.fullName,
                                  })
                                }
                                className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition cursor-pointer"
                                title={`Eliminar registro de ${lead.fullName}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* CONFIRM DELETE MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="font-black text-white text-base">
                  {deleteTarget.type === 'lead' ? '¿Eliminar este Invitado?' : '¿Eliminar Aliado y sus Referidos?'}
                </h3>
                <p className="text-xs text-slate-400">Esta acción no se puede deshacer.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="text-slate-300">
                {deleteTarget.type === 'lead' ? (
                  <>
                    Estás a punto de borrar de la base de datos a:
                    <strong className="block text-white font-bold mt-1 text-sm">{deleteTarget.name}</strong>
                  </>
                ) : (
                  <>
                    Estás a punto de borrar al aliado <strong className="text-amber-400 font-mono">{deleteTarget.name}</strong> y a sus{' '}
                    <strong className="text-rose-400 font-bold">{deleteTarget.count || 0} invitados registrados</strong>.
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={executeDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-rose-500/20 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Eliminando...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Sí, Eliminar Definitivamente</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
