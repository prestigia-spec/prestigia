'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { PrestigiaIcon } from '@/components/PrestigiaIcon';
import {
  Users,
  Search,
  RefreshCw,
  Download,
  Phone,
  MessageSquare,
  Award,
  Globe,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowLeft,
  Share2,
  Copy,
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

export default function MasterclassReferidosPage() {
  const [loading, setLoading] = useState(true);
  const [totalLeads, setTotalLeads] = useState(0);
  const [referralSummary, setReferralSummary] = useState<ReferralSummaryItem[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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
          lead.referredBy.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [allLeads, selectedFriend, searchTerm]);

  // Download CSV
  const handleDownloadCsv = () => {
    if (filteredLeads.length === 0) return;
    const headers = ['Fecha', 'Invitado', 'WhatsApp', 'Ciudad', 'Pais', 'Codigo Amigo / Referido', 'Perfil', 'Dispositivo'];
    const rows = filteredLeads.map((l) => [
      `"${new Date(l.createdAt).toLocaleString()}"`,
      `"${(l.fullName || '').replace(/"/g, '""')}"`,
      `"${l.phone || ''}"`,
      `"${(l.city || '').replace(/"/g, '""')}"`,
      `"${(l.country || '').replace(/"/g, '""')}"`,
      `"${(l.referredBy || 'directo').toUpperCase()}"`,
      `"${(l.role || '').replace(/"/g, '""')}"`,
      `"${l.device || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Masterclass_Referidos_${selectedFriend}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyFriendLink = (friendCode: string) => {
    const link = `https://prestigia-oficial.vercel.app/masterclass?angle=ingresos-casa&ref=${friendCode}`;
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(link);
      setCopiedCode(friendCode);
      setTimeout(() => setCopiedCode(null), 2500);
    }
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
                <span className="text-[10px] text-amber-400 font-black tracking-widest uppercase block">HQ MASTERCLASS</span>
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
              <span>↗</span>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* TITLE & INTRO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Control Central de Tráfico & Amigos Referidos</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Lista Oficial de Invitados por Amigo
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Monitorea en tiempo real quién de tus amigos ha invitado más personas a la Masterclass del 10 de Diciembre.
            </p>
          </div>

          <button
            onClick={handleDownloadCsv}
            disabled={filteredLeads.length === 0}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 shrink-0 self-start sm:self-auto disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Descargar en Excel ({filteredLeads.length})</span>
          </button>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Registrados</span>
            <div className="text-3xl font-black text-white font-mono">{totalLeads}</div>
            <span className="text-[10px] text-amber-400 font-semibold block">Prospectos en Base de Datos</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Amigos con Referidos</span>
            <div className="text-3xl font-black text-amber-400 font-mono">
              {referralSummary.filter((r) => r.code !== 'directo').length}
            </div>
            <span className="text-[10px] text-slate-400 block">Amigos compartiendo links</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Top Amigo #1</span>
            <div className="text-2xl font-black text-emerald-400 truncate font-mono">
              {referralSummary[0]?.code ? `@${referralSummary[0].code}` : 'Sin datos'}
            </div>
            <span className="text-[10px] text-emerald-300 font-semibold block">
              {referralSummary[0]?.count ? `${referralSummary[0].count} invitados traídos` : 'Comienza a compartir'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tráfico Directo</span>
            <div className="text-3xl font-black text-purple-400 font-mono">
              {referralSummary.find((r) => r.code === 'directo')?.count || 0}
            </div>
            <span className="text-[10px] text-slate-400 block">Sin código de referido</span>
          </div>
        </div>

        {/* RANKING DE AMIGOS (CARDS SELECTOR) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Ranking y Filtro por Amigo</span>
            </h2>
            {selectedFriend !== 'all' && (
              <button
                onClick={() => setSelectedFriend('all')}
                className="text-xs text-amber-400 hover:underline font-bold"
              >
                Ver Todos los Amigos
              </button>
            )}
          </div>

          {referralSummary.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
              <p className="text-sm text-slate-400">Aún no hay registros con códigos de amigos.</p>
              <p className="text-xs text-slate-500">
                Pasa a tus amigos sus enlaces personalizados con <code>&ref=sunombre</code> para verlos reflejados aquí.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <button
                type="button"
                onClick={() => setSelectedFriend('all')}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                  selectedFriend === 'all'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 font-black'
                    : 'bg-slate-900/80 text-white border-slate-800 hover:border-slate-700 font-bold'
                }`}
              >
                <div className="text-[10px] opacity-80 uppercase tracking-wider">Todos</div>
                <div className="text-lg font-mono">{totalLeads}</div>
                <div className="text-[10px] opacity-80">Total General</div>
              </button>

              {referralSummary.map((item, idx) => (
                <div
                  key={item.code}
                  className={`p-3.5 rounded-2xl border text-left transition relative group ${
                    selectedFriend === item.code
                      ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/25 font-black'
                      : 'bg-slate-900/80 text-white border-slate-800 hover:border-slate-700 font-bold'
                  }`}
                >
                  <div
                    onClick={() => setSelectedFriend(item.code)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-[10px] opacity-80 uppercase tracking-wider mb-1">
                      <span>#{idx + 1}</span>
                      <span>{item.code === 'directo' ? '🌐 Web' : '🎟️ Amigo'}</span>
                    </div>
                    <div className="text-base truncate font-mono">@{item.code}</div>
                    <div className="text-xs opacity-90 mt-1 font-mono">
                      {item.count} {item.count === 1 ? 'invitado' : 'invitados'}
                    </div>
                  </div>

                  {item.code !== 'directo' && (
                    <button
                      type="button"
                      onClick={() => copyFriendLink(item.code)}
                      className="mt-2 text-[9px] px-2 py-0.5 rounded-md bg-slate-950/60 hover:bg-slate-950 text-amber-300 border border-amber-400/30 flex items-center gap-1 transition w-full justify-center"
                      title="Copiar enlace de este amigo"
                    >
                      <Copy className="w-2.5 h-2.5" />
                      <span>{copiedCode === item.code ? '¡Copiado!' : 'Copiar Link'}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEARCH & FILTER CONTROLS */}
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

          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>

        {/* DETAILED LEADS TABLE */}
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <span>👥 Invitados Registrados</span>
              <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                {filteredLeads.length}
              </span>
            </h3>

            {selectedFriend !== 'all' && (
              <span className="text-xs text-slate-400">
                Mostrando únicamente invitados de: <strong className="text-amber-300 font-mono">@{selectedFriend}</strong>
              </span>
            )}
          </div>

          {filteredLeads.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-white">No hay invitados en esta vista</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {selectedFriend !== 'all'
                  ? `Tu amigo @${selectedFriend} aún no tiene registros. Pásale su enlace para que empiece a invitar.`
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
                    <th className="py-3 px-4">Invitado Por (Amigo)</th>
                    <th className="py-3 px-4">Fecha y Hora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredLeads.map((lead) => {
                    const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
                    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hola ${lead.fullName}, te saluda Luisma de Prestigia. Veo que te registraste para la Masterclass del 10 de Diciembre. ¿Pudiste entrar al grupo VIP de WhatsApp?`)}`;

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
                          {new Date(lead.createdAt).toLocaleDateString()} • {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
