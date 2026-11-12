'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PrestigiaIcon } from '@/components/PrestigiaIcon';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  KeyRound,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
} from 'lucide-react';

interface OrderStatusData {
  orderId: string;
  orderType: 'new_plan' | 'credit_reload';
  planTier?: 'level_1' | 'level_2' | 'level_3';
  reloadTab?: string;
  buyerName: string;
  buyerEmail: string;
  currency: 'USD' | 'COP';
  amountUsd: number;
  chargedAmount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'failed' | 'voided';
  paymentMethod?: string;
  boldTransactionId?: string;
  provisionedUsername?: string;
  provisionedPassword?: string;
  fulfilledAt?: string;
  createdAt: string;
}

function PagoExitosoContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || searchParams.get('bold-order-id') || '';

  const [order, setOrder] = useState<OrderStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);

  const fetchOrderStatus = useCallback(async () => {
    if (!orderId) {
      setErrorMsg('No se encontró el identificador de la orden en la URL.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/payments/bold/order-status?orderId=${encodeURIComponent(orderId)}`, {
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'No se pudo consultar el estado del pago.');
      } else {
        setOrder(data.order);
        setErrorMsg('');
      }
    } catch {
      setErrorMsg('Error de conexión verificando el pago con el servidor.');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderStatus();
  }, [fetchOrderStatus]);

  useEffect(() => {
    if (!order || order.status !== 'pending' || pollCount >= 8) return;
    const timer = setTimeout(() => {
      setPollCount((c) => c + 1);
      fetchOrderStatus();
    }, 3000);
    return () => clearTimeout(timer);
  }, [order, pollCount, fetchOrderStatus]);

  const handleCopy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formattedPaid =
    order?.currency === 'COP'
      ? `$${Number(order.chargedAmount || 0).toLocaleString('es-CO')} COP`
      : `$${Number(order?.amountUsd || 0)} USD`;

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-xl w-full space-y-6">
        {/* Header Logo */}
        <div className="flex items-center justify-center gap-3">
          <PrestigiaIcon className="w-9 h-9" />
          <div>
            <div className="text-lg font-black tracking-tight text-white">Prestigia Local Studio</div>
            <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
              Verificación Oficial de Pago • Bold
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
          {loading ? (
            <div className="py-10 text-center space-y-3">
              <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
              <h1 className="text-xl font-black text-white">Verificando transacción con Bold...</h1>
              <p className="text-xs text-slate-400">
                Consultando confirmación oficial para la orden <span className="font-mono text-slate-200">{orderId}</span>
              </p>
            </div>
          ) : errorMsg ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h1 className="text-xl font-black text-white">No pudimos validar tu orden aún</h1>
              <p className="text-xs text-rose-300">{errorMsg}</p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    fetchOrderStatus();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reintentar Verificación</span>
                </button>
                <Link
                  href="/masterclass-planes"
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs"
                >
                  Volver a Planes
                </Link>
              </div>
            </div>
          ) : order?.status === 'approved' ? (
            <>
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pago Aprobado &amp; Activación Completada</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {order.orderType === 'credit_reload'
                    ? '¡+10 Créditos Acreditados!'
                    : '¡Tu Licencia Local Studio está Activa!'}
                </h1>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {order.description}
                </p>
              </div>

              {/* Detalles del recibo */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Orden Prestigia:</span>
                  <span className="font-mono font-bold text-white">{order.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Titular:</span>
                  <span className="font-bold text-white">{order.buyerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Valor Pagado:</span>
                  <span className="font-mono font-black text-emerald-400">{formattedPaid}</span>
                </div>
                {order.boldTransactionId && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">ID Transacción Bold:</span>
                    <span className="font-mono text-slate-300">{order.boldTransactionId}</span>
                  </div>
                )}
              </div>

              {/* Credenciales para planes nuevos o confirmación para recarga */}
              {order.orderType === 'new_plan' && order.provisionedUsername ? (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-indigo-950/30 border border-emerald-500/40 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-300 font-black text-xs uppercase tracking-wider">
                    <KeyRound className="w-4 h-4" />
                    <span>Tus Credenciales de Acceso Inmediato</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                          <User className="w-3 h-3" /> Usuario
                        </span>
                        <div className="text-sm font-mono font-black text-white mt-0.5">
                          {order.provisionedUsername}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('user', order.provisionedUsername || '')}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                        title="Copiar usuario"
                      >
                        {copiedField === 'user' ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                          <KeyRound className="w-3 h-3" /> Contraseña Temporal
                        </span>
                        <div className="text-sm font-mono font-black text-amber-300 mt-0.5">
                          {order.provisionedPassword || 'Activa'}
                        </div>
                      </div>
                      {order.provisionedPassword && (
                        <button
                          type="button"
                          onClick={() => handleCopy('pass', order.provisionedPassword || '')}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                          title="Copiar contraseña"
                        >
                          {copiedField === 'pass' ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300">
                    Guarda o copia tus credenciales. Ya puedes iniciar sesión en{' '}
                    <strong className="text-white">/local-studio</strong> ahora mismo.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-200">
                  <Zap className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>
                    Se inyectaron <strong>+10 créditos</strong> exitosamente a la cuenta{' '}
                    <strong className="font-mono text-white">@{order.provisionedUsername}</strong>. Refresca tu sesión en Local Studio para usarlos de inmediato.
                  </span>
                </div>
              )}

              <Link
                href="/local-studio"
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition shadow-xl shadow-emerald-500/20"
              >
                <span>Ingresar a Prestigia Local Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          ) : order?.status === 'pending' ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>
              <h1 className="text-xl font-black text-white">Confirmando tu pago con Bold...</h1>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Tu pago está siendo confirmado por la red bancaria (PSE/Tarjeta). En unos segundos actualizaremos esta pantalla automáticamente con tus accesos.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400">
                Orden: {order.orderId} • {formattedPaid}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => fetchOrderStatus()}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Verificar Estado Ahora</span>
                </button>
                <a
                  href={`https://wa.me/573058314049?text=${encodeURIComponent(
                    `Hola Luisma! Acabo de realizar el pago de la orden ${order.orderId} (${order.buyerEmail}). ¿Me ayudas a verificar?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                >
                  Soporte WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h1 className="text-xl font-black text-white">Transacción No Aprobada ({order?.status})</h1>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                El banco o la pasarela Bold no completó el cobro de la orden{' '}
                <span className="font-mono text-slate-200">{order?.orderId}</span>. No se realizó ningún cargo definitivo.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/masterclass-planes"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs"
                >
                  Intentar con Otro Medio de Pago
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Procesado con encriptación segura Bold Colombia • Prestigia Local Studio © 2026</span>
        </div>
      </div>
    </div>
  );
}

export default function PagoExitosoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#060911] text-slate-300 flex items-center justify-center text-sm font-mono">
          Cargando confirmación de pago...
        </div>
      }
    >
      <PagoExitosoContent />
    </Suspense>
  );
}
