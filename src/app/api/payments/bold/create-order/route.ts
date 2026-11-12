import { NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  BoldPaymentOrder,
  getAllStudioAdvisors,
  getExchangeRates,
  saveBoldPaymentOrder,
} from '@/lib/db';

const PLAN_PRICING_USD: Record<'level_1' | 'level_2' | 'level_3', { priceUsd: number; label: string }> = {
  level_1: {
    priceUsd: 49,
    label: 'Prestigia Local Studio - Plan Asesor Independiente (10 cupos/mes)',
  },
  level_2: {
    priceUsd: 90,
    label: 'Prestigia Local Studio - Plan Agencias Partner (20 cupos/mes)',
  },
  level_3: {
    priceUsd: 140,
    label: 'Prestigia Local Studio - Plan Super Agencias (30 cupos/mes)',
  },
};

const TAB_LABELS: Record<'creates' | 'audits' | 'rescues' | 'appeals' | 'tools', string> = {
  creates: 'Creacion de Ficha Nueva (Pestana 1)',
  audits: 'Auditorias Forenses Top 3 (Pestana 2)',
  rescues: 'Rescate de Fichas 72h (Pestana 3)',
  appeals: 'Apelacion de Resenas 1 Estrella (Pestana 4)',
  tools: 'Prospeccion & Cierre B2B (Pestana 5)',
};

const RELOAD_PRICE_USD = 50;

function getBoldCredentials(): { apiKey: string; secretKey: string; mode: 'sandbox' | 'production' } {
  const mode = process.env.BOLD_MODE === 'sandbox' ? 'sandbox' : 'production';
  if (mode === 'sandbox') {
    return {
      apiKey: (process.env.BOLD_SANDBOX_API_KEY || process.env.BOLD_API_KEY || '').trim(),
      secretKey: (process.env.BOLD_SANDBOX_SECRET_KEY || process.env.BOLD_SECRET_KEY || '').trim(),
      mode: 'sandbox',
    };
  }
  return {
    apiKey: (process.env.BOLD_API_KEY || '').trim(),
    secretKey: (process.env.BOLD_SECRET_KEY || '').trim(),
    mode: 'production',
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderType: 'new_plan' | 'credit_reload' =
      body.orderType === 'credit_reload' ? 'credit_reload' : 'new_plan';
    const currency: 'USD' | 'COP' = body.currency === 'COP' ? 'COP' : 'USD';

    const buyerName = String(body.buyerName || '').trim();
    const buyerEmail = String(body.buyerEmail || '').trim().toLowerCase();
    const buyerPhone = String(body.buyerPhone || '').trim();
    const buyerCountry = String(body.buyerCountry || 'Colombia').trim();
    const desiredUsername = String(body.desiredUsername || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '');

    if (!buyerName || !buyerEmail || !buyerEmail.includes('@') || !buyerPhone) {
      return NextResponse.json(
        { error: 'Por favor completa Nombre completo, Correo electrónico y WhatsApp.' },
        { status: 400 }
      );
    }

    const { apiKey, secretKey, mode } = getBoldCredentials();
    if (!apiKey || !secretKey) {
      return NextResponse.json(
        {
          error:
            'La pasarela de pagos Bold aún no tiene configuradas las llaves (BOLD_API_KEY / BOLD_SECRET_KEY) en el servidor.',
          missingCredentials: true,
        },
        { status: 503 }
      );
    }

    let amountUsd = 49;
    let description = '';
    let planTier: 'level_1' | 'level_2' | 'level_3' | undefined;
    let reloadTab: 'creates' | 'audits' | 'rescues' | 'appeals' | 'tools' | undefined;
    let advisorId: string | undefined;
    let advisorUsername: string | undefined;

    if (orderType === 'new_plan') {
      const requestedTier = String(body.planTier || 'level_1') as 'level_1' | 'level_2' | 'level_3';
      if (!PLAN_PRICING_USD[requestedTier]) {
        return NextResponse.json({ error: 'Plan seleccionado inválido.' }, { status: 400 });
      }
      planTier = requestedTier;
      amountUsd = PLAN_PRICING_USD[requestedTier].priceUsd;
      description = PLAN_PRICING_USD[requestedTier].label;
    } else {
      const requestedTab = String(body.reloadTab || 'creates') as
        | 'creates'
        | 'audits'
        | 'rescues'
        | 'appeals'
        | 'tools';
      if (!TAB_LABELS[requestedTab]) {
        return NextResponse.json({ error: 'Pestaña de recarga inválida.' }, { status: 400 });
      }
      reloadTab = requestedTab;
      advisorId = body.advisorId ? String(body.advisorId).trim() : undefined;
      advisorUsername = body.advisorUsername ? String(body.advisorUsername).trim() : undefined;

      const advisors = await getAllStudioAdvisors();
      const targetAdvisor = advisors.find(
        (a) =>
          (advisorId && a.id === advisorId) ||
          (advisorUsername && a.username.toLowerCase() === advisorUsername.toLowerCase())
      );
      if (!targetAdvisor) {
        return NextResponse.json(
          { error: 'No se encontró tu cuenta de asesor para aplicar la recarga de créditos.' },
          { status: 404 }
        );
      }
      advisorId = targetAdvisor.id;
      advisorUsername = targetAdvisor.username;
      amountUsd = RELOAD_PRICE_USD;
      description = `Prestigia Local Studio - Recarga +10 Creditos en ${TAB_LABELS[requestedTab]} (@${targetAdvisor.username})`;
    }

    let chargedAmount = amountUsd;
    let exchangeRateUsed: number | undefined;

    if (currency === 'COP') {
      const rates = await getExchangeRates(false);
      const copRate = Number(rates?.rates?.COP || 4150);
      exchangeRateUsed = copRate;
      chargedAmount = Math.round(amountUsd * copRate);
    }

    // Bold requiere monto como entero sin decimales (tanto en COP como en USD)
    const amountStr = String(Math.round(chargedAmount));
    const orderId = `PRG-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    // Firma de integridad SHA-256 oficial de Bold: SHA256(orderId + amount + currency + secretKey)
    const signatureRaw = `${orderId}${amountStr}${currency}${secretKey}`;
    const integritySignature = crypto.createHash('sha256').update(signatureRaw).digest('hex');

    const forwardedProto = req.headers.get('x-forwarded-proto') || 'https';
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'prestigia.app';
    const origin = `${host.includes('localhost') ? 'http' : forwardedProto}://${host}`;
    const redirectionUrl = `${origin}/pago-exitoso?orderId=${encodeURIComponent(orderId)}`;

    const now = new Date().toISOString();
    const order: BoldPaymentOrder = {
      orderId,
      orderType,
      planTier,
      reloadTab,
      advisorId,
      advisorUsername,
      desiredUsername: desiredUsername || undefined,
      buyerName,
      buyerEmail,
      buyerPhone,
      buyerCountry,
      currency,
      amountUsd,
      chargedAmount: Number(amountStr),
      exchangeRateUsed,
      description,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    await saveBoldPaymentOrder(order);

    return NextResponse.json({
      success: true,
      mode,
      checkoutConfig: {
        orderId,
        currency,
        amount: amountStr,
        apiKey,
        integritySignature,
        description,
        redirectionUrl,
        customerData: {
          email: buyerEmail,
          fullName: buyerName,
          phone: buyerPhone,
          dialCode: '+57',
        },
      },
      order: {
        orderId: order.orderId,
        amountUsd: order.amountUsd,
        chargedAmount: order.chargedAmount,
        currency: order.currency,
        exchangeRateUsed: order.exchangeRateUsed,
        description: order.description,
      },
    });
  } catch (err: any) {
    console.error('[Bold create-order] Error:', err);
    return NextResponse.json(
      { error: 'Error al generar la orden de pago con Bold.' },
      { status: 500 }
    );
  }
}
