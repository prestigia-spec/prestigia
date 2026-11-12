import { NextResponse } from 'next/server';
import { fulfillBoldPaymentOrder, getBoldPaymentOrderById } from '@/lib/db';

function getActiveBoldApiKey(): string {
  if (process.env.BOLD_MODE === 'sandbox') {
    return (process.env.BOLD_SANDBOX_API_KEY || process.env.BOLD_API_KEY || '').trim();
  }
  return (process.env.BOLD_API_KEY || '').trim();
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = String(searchParams.get('orderId') || '').trim();

    if (!orderId) {
      return NextResponse.json({ error: 'Falta el parámetro orderId.' }, { status: 400 });
    }

    let order = await getBoldPaymentOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Orden de pago no encontrada.' }, { status: 404 });
    }

    // Si el webhook aún no ha llegado, consultamos activamente el API oficial de Bold con la Llave de Identidad
    if (order.status === 'pending') {
      const apiKey = getActiveBoldApiKey();
      if (apiKey) {
        try {
          const checkRes = await fetch(
            `https://payments.api.bold.co/v2/payment-voucher/${encodeURIComponent(orderId)}`,
            {
              method: 'GET',
              headers: {
                Authorization: `x-api-key ${apiKey}`,
              },
              cache: 'no-store',
            }
          );

          if (checkRes.ok) {
            const voucherData = await checkRes.json();
            const paymentStatus = String(
              voucherData?.payment_status || voucherData?.status || ''
            ).toUpperCase();

            if (paymentStatus === 'APPROVED' || paymentStatus === 'PAID') {
              const fulfilled = await fulfillBoldPaymentOrder(orderId, {
                transactionId: voucherData?.transaction_id || voucherData?.payment_id,
                paymentMethod: voucherData?.payment_method,
              });
              if (fulfilled.order) {
                order = fulfilled.order;
              }
            }
          }
        } catch (err) {
          console.warn('[Bold order-status] Active voucher query skip:', err);
        }
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        orderId: order.orderId,
        orderType: order.orderType,
        planTier: order.planTier,
        reloadTab: order.reloadTab,
        buyerName: order.buyerName,
        buyerEmail: order.buyerEmail,
        currency: order.currency,
        amountUsd: order.amountUsd,
        chargedAmount: order.chargedAmount,
        description: order.description,
        status: order.status,
        paymentMethod: order.paymentMethod,
        boldTransactionId: order.boldTransactionId,
        provisionedUsername: order.provisionedUsername,
        provisionedPassword: order.provisionedPassword,
        fulfilledAt: order.fulfilledAt,
        createdAt: order.createdAt,
      },
    });
  } catch (err) {
    console.error('[Bold order-status] Error:', err);
    return NextResponse.json({ error: 'Error consultando el estado de la orden.' }, { status: 500 });
  }
}
