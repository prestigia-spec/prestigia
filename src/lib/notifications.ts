/**
 * PRESTIGIA ENTERPRISE NOTIFICATION & DISPATCH ENGINE
 * Production-ready transactional dispatcher for Out-of-band Emergency OTPs,
 * VIP client alerts, containment notices, and executive reports.
 * 
 * Supports:
 * - Resend API (HTTP REST, zero-dependency, modern Next.js standard)
 * - Brevo / Sendinblue (HTTP REST, 300 free emails/day)
 * - Twilio SMS / WhatsApp Cloud API
 */

export interface DispatcherConfig {
  resendApiKey?: string;
  resendFromEmail?: string;
  brevoApiKey?: string;
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioFromPhone?: string;
}

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface DispatchResult {
  success: boolean;
  emailSent: boolean;
  smsSent: boolean;
  provider: string;
  summary: string;
  error?: string;
}

/**
 * Sends a transactional email using available configured providers
 */
export async function sendTransactionalEmail(
  payload: EmailPayload,
  config?: DispatcherConfig
): Promise<{ success: boolean; provider: string; error?: string; messageId?: string }> {
  const resendKey = config?.resendApiKey || process.env.RESEND_API_KEY;
  const brevoKey = config?.brevoApiKey || process.env.BREVO_API_KEY;
  const fromEmail = config?.resendFromEmail || process.env.RESEND_FROM_EMAIL || 'Prestigia Security <onboarding@resend.dev>';

  // 1. Try Resend API (First priority)
  if (resendKey && resendKey.startsWith('re_')) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [payload.to],
          subject: payload.subject,
          html: payload.html,
          text: payload.text || payload.subject,
        }),
      });

      const data = await res.json();
      if (res.ok && data.id) {
        console.log(`[NOTIFICATIONS:RESEND] Email dispatched successfully to ${payload.to} (ID: ${data.id})`);
        return { success: true, provider: 'resend', messageId: data.id };
      }
      console.warn('[NOTIFICATIONS:RESEND] Delivery rejected:', data);
      return { success: false, provider: 'resend', error: data.message || 'Error en pasarela Resend' };
    } catch (err: any) {
      console.error('[NOTIFICATIONS:RESEND] Network error:', err?.message);
      return { success: false, provider: 'resend', error: err?.message };
    }
  }

  // 2. Try Brevo API (Second priority)
  if (brevoKey) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoKey.trim(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'Prestigia Core Security', email: 'seguridad@prestigia.app' },
          to: [{ email: payload.to }],
          subject: payload.subject,
          htmlContent: payload.html,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log(`[NOTIFICATIONS:BREVO] Email dispatched successfully to ${payload.to}`);
        return { success: true, provider: 'brevo', messageId: data.messageId };
      }
      return { success: false, provider: 'brevo', error: data.message || 'Error en pasarela Brevo' };
    } catch (err: any) {
      return { success: false, provider: 'brevo', error: err?.message };
    }
  }

  // 3. Fallback: Log payload for enterprise audit trail
  console.log(`[NOTIFICATIONS:AUDIT_LOG] No transactional API key active. Notification recorded for ${payload.to}: ${payload.subject}`);
  return {
    success: false,
    provider: 'unconfigured',
    error: 'Pasarela de correo no configurada (Configura tu RESEND_API_KEY en Bóveda Ciega o Vercel)',
  };
}

/**
 * Sends SMS or WhatsApp message via Twilio API
 */
export async function sendTwilioMessage(
  toPhone: string,
  body: string,
  config?: DispatcherConfig
): Promise<{ success: boolean; provider: string; error?: string }> {
  const sid = config?.twilioAccountSid || process.env.TWILIO_ACCOUNT_SID;
  const token = config?.twilioAuthToken || process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = config?.twilioFromPhone || process.env.TWILIO_FROM_PHONE;

  if (!sid || !token || !fromPhone) {
    return {
      success: false,
      provider: 'unconfigured',
      error: 'Pasarela Twilio no configurada (TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN)',
    };
  }

  try {
    const auth = Buffer.from(`${sid.trim()}:${token.trim()}`).toString('base64');
    const params = new URLSearchParams();
    params.append('To', toPhone.trim());
    params.append('From', fromPhone.trim());
    params.append('Body', body);

    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await res.json();
    if (res.ok && data.sid) {
      console.log(`[NOTIFICATIONS:TWILIO] SMS/WhatsApp dispatched to ${toPhone} (SID: ${data.sid})`);
      return { success: true, provider: 'twilio' };
    }
    return { success: false, provider: 'twilio', error: data.message || 'Error en Twilio' };
  } catch (err: any) {
    return { success: false, provider: 'twilio', error: err?.message };
  }
}

/**
 * Generates an executive, bank-grade HTML email template for Emergency OTP
 */
export function buildEmergencyOtpHtml(code: string, expiresMinutes: number = 5): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Prestigia Security - Clave Dinámica de Rescate</title>
</head>
<body style="margin: 0; padding: 0; background-color: #07090E; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #07090E; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #0E131F; border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 24px; padding: 36px 30px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);">
          <!-- Header Crest -->
          <tr>
            <td align="center" style="padding-bottom: 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
              <div style="font-size: 20px; font-weight: 800; letter-spacing: 0.15em; color: #F59E0B; text-transform: uppercase;">
                ★ PRESTIGIA CORE HQ ★
              </div>
              <div style="font-size: 11px; color: #94A3B8; margin-top: 4px; letter-spacing: 0.05em;">
                PROTOCOLO DE RESCATE BANCARIO OUT-OF-BAND
              </div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding-top: 28px; padding-bottom: 20px; text-align: center;">
              <h1 style="font-size: 18px; font-weight: 700; color: #FFFFFF; margin: 0 0 10px 0;">
                Clave Dinámica Temporal de Emergencia
              </h1>
              <p style="font-size: 13px; color: #CBD5E1; line-height: 1.6; margin: 0 0 24px 0;">
                Se ha generado una clave temporal para recuperar el acceso administrativo a la Consola Master de Prestigia.
              </p>

              <!-- OTP Display Box -->
              <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(15, 23, 42, 0.8)); border: 1.5px dashed #F59E0B; border-radius: 16px; padding: 22px; margin: 0 auto; max-width: 340px;">
                <div style="font-size: 11px; text-transform: uppercase; color: #FBBF24; font-weight: 700; letter-spacing: 0.1em; margin-bottom: 8px;">
                  Tu Código de Acceso
                </div>
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 900; letter-spacing: 0.35em; color: #FFFFFF; text-shadow: 0 0 12px rgba(245, 158, 11, 0.5);">
                  ${code}
                </div>
                <div style="font-size: 11px; color: #94A3B8; margin-top: 8px;">
                  ⏱ Vigencia: <strong>${expiresMinutes} minutos</strong> (uso único)
                </div>
              </div>
            </td>
          </tr>

          <!-- Security Instructions -->
          <tr>
            <td style="padding: 20px 0; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 12px; color: #94A3B8; line-height: 1.6;">
              <div style="background-color: rgba(239, 68, 68, 0.1); border-left: 3px solid #EF4444; padding: 12px 14px; border-radius: 8px; margin-bottom: 16px;">
                <strong style="color: #F87171;">⚠️ Advertencia de Seguridad Bancaria:</strong><br/>
                Nunca reveles este código a terceros ni al personal de soporte. Esta clave otorga acceso total de Dirección General a la base de datos empresarial y configuración de marcas.
              </div>
              <p style="margin: 0;">
                Si tú no solicitaste este rescate, alguien está intentando acceder a tu Consola Master. Ingresa de inmediato y rota tu Llave Maestra en la Bóveda Ciega.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 10px; color: #64748B;">
              Prestigia Big Data Lake & Reputation Cloud © 2026. Todos los derechos reservados.<br/>
              Sesión Cifrada SHA-256 • IP & Device Fingerprinting Activo.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Dispatches an Emergency OTP to authorized email and phone channels
 */
export async function dispatchEmergencyOtpNotification(params: {
  toEmail: string;
  toPhone: string;
  code: string;
  config?: DispatcherConfig;
}): Promise<DispatchResult> {
  const { toEmail, toPhone, code, config } = params;

  let emailSent = false;
  let smsSent = false;
  let providerUsed = 'ninguna';
  const errors: string[] = [];

  // 1. Dispatch Email
  if (toEmail) {
    const emailResult = await sendTransactionalEmail(
      {
        to: toEmail,
        subject: `🔒 [PRESTIGIA BANCARIA] Tu Clave de Rescate de Emergencia: ${code}`,
        html: buildEmergencyOtpHtml(code, 5),
        text: `PRESTIGIA SEGURIDAD: Tu clave dinámica de rescate bancario es ${code}. Vigencia: 5 minutos. No la compartas con nadie.`,
      },
      config
    );

    if (emailResult.success) {
      emailSent = true;
      providerUsed = emailResult.provider;
    } else if (emailResult.error) {
      errors.push(`Email (${emailResult.provider}): ${emailResult.error}`);
    }
  }

  // 2. Dispatch SMS/WhatsApp
  if (toPhone) {
    const smsResult = await sendTwilioMessage(
      toPhone,
      `PRESTIGIA BANCARIA: Tu clave temporal de rescate es ${code}. Expira en 5 minutos.`,
      config
    );

    if (smsResult.success) {
      smsSent = true;
      providerUsed = providerUsed === 'ninguna' ? 'twilio' : `${providerUsed} + twilio`;
    } else if (smsResult.error) {
      errors.push(`SMS/WhatsApp: ${smsResult.error}`);
    }
  }

  const success = emailSent || smsSent;
  const summary = success
    ? `Despachado exitosamente vía ${providerUsed}`
    : errors.length > 0
    ? `Registrado en auditoría interna (${errors.join('; ')})`
    : 'Registrado en auditoría bancaria interna';

  return {
    success,
    emailSent,
    smsSent,
    provider: providerUsed,
    summary,
    error: errors.length > 0 ? errors.join('; ') : undefined,
  };
}
