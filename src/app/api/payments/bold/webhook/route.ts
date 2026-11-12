import { NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  fulfillBoldPaymentOrder,
  getBoldPaymentOrderById,
  saveBoldPaymentOrder,
} from '@/lib/db';

function safeTimingEqualHex(expectedHex: string, receivedHex: string): boolean {
  try {
    const a = Buffer.from(expectedHex.toLowerCase(), 'utf8');
    const b = Buffer.from(receivedHex.toLowerCase(), 'utf8');
    if (a.length !== b.length || a.length === 0) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function verifyBoldWebhookSignature(rawBody: string, signatureHeader: string): boolean {
  if (!signatureHeader) return false;

  const isSandbox = process.env.BOLD_MODE === 'sandbox';
  const candidateKeys: string[] = [];

  if (isSandbox) {
    if (process.env.BOLD_SANDBOX_SECRET_KEY) candidateKeys.push(process.env.BOLD_SANDBOX_SECRET_KEY.trim());
    if (process.env.BOLD_SANDBOX_API_KEY) candidateKeys.push(process.env.BOLD_SANDBOX_API_KEY.trim());
    if (process.env.BOLD_SECRET_KEY) candidateKeys.push(process.env.BOLD_SECRET_KEY.trim());
    // Bold Sandbox Webhooks documented behavior occasionally uses empty string as HMAC key in test dispatches
    candidateKeys.push('');
  } else {
    if (process.env.BOLD_SECRET_KEY) candidateKeys.push(process.env.BOLD_SECRET_KEY.trim());
    if (process.env.BOLD_API_KEY) candidateKeys.push(process.env.BOLD_API_KEY.trim());
  }

  const base64Body = Buffer.from(rawBody, 'utf8').toString('base64');

  for (const key of candidateKeys) {
    const hmacBase64 = crypto.createHmac('sha256', key).update(base64Body).digest('hex');
    if (safeTimingEqualHex(hmacBase64, signatureHeader)) return true;

    const hmacRaw = crypto.createHmac('sha256', key).update(rawBody).digest('hex');
    if (safeTimingEqualHex(hmacRaw, signatureHeader)) return true;
  }

  return false;
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signatureHeader =
      req.headers.get('x-bold-signature') ||
      req.headers.get('X-Bold-Signature') ||
      '';

    if (!verifyBoldWebhookSignature(rawBody, signatureHeader)) {
      console.warn('[Bold Webhook] Invalid signature rejected');
      return NextResponse.json({ error: 'Invalid Bold webhook signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventType: string = String(payload?.type || '').toUpperCase();
    const data = payload?.data || {};
    const orderId: string = String(
      data?.metadata?.reference ||
        data?.reference ||
        payload?.subject ||
        ''
    ).trim();

    if (!orderId) {
      return NextResponse.json({ received: true, ignored: 'No reference orderId in webhook' });
    }

    if (eventType === 'SALE_APPROVED') {
      const result = await fulfillBoldPaymentOrder(orderId, {
        transactionId: data?.payment_id || payload?.id,
        paymentMethod: data?.payment_method,
      });
      return NextResponse.json({
        received: true,
        fulfilled: result.ok,
        alreadyFulfilled: result.alreadyFulfilled || false,
        orderId,
      });
    }

    if (eventType === 'SALE_REJECTED' || eventType === 'SALE_FAILED' || eventType === 'VOID_APPROVED') {
      const order = await getBoldPaymentOrderById(orderId);
      if (order && order.status === 'pending') {
        order.status =
          eventType === 'VOID_APPROVED'
            ? 'voided'
            : eventType === 'SALE_FAILED'
            ? 'failed'
            : 'rejected';
        order.boldTransactionId = data?.payment_id || payload?.id || order.boldTransactionId;
        await saveBoldPaymentOrder(order);
      }
    }

    return NextResponse.json({ received: true, eventType, orderId });
  } catch (err) {
    console.error('[Bold Webhook] Error processing webhook:', err);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}
