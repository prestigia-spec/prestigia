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

/**
 * 1. Template: Welcome & Official Access Credentials
 */
export function buildWelcomeCredentialsHtml(params: {
  businessName: string;
  ownerName: string;
  plan: string;
  businessId: string;
  password?: string;
  portalUrl?: string;
  googleMapsUrl?: string;
}): string {
  const { businessName, ownerName, plan, businessId, password = 'admin', portalUrl = 'https://prestigia.app/portal', googleMapsUrl } = params;
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Bienvenido a Prestigia</title></head>
<body style="margin:0;padding:0;background-color:#07090E;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#E2E8F0;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#07090E;padding:40px 15px;">
    <tr><td align="center">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:580px;background-color:#0E131F;border:1px solid rgba(245,158,11,0.4);border-radius:24px;padding:36px 30px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.8);">
        <tr><td align="center" style="padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.08);">
          <div style="font-size:22px;font-weight:900;letter-spacing:0.18em;color:#F59E0B;text-transform:uppercase;">★ PRESTIGIA ★</div>
          <div style="font-size:11px;color:#94A3B8;margin-top:4px;letter-spacing:0.06em;text-transform:uppercase;">Reputation Cloud & Big Data Lake</div>
        </td></tr>
        <tr><td style="padding-top:28px;padding-bottom:16px;">
          <h1 style="font-size:20px;font-weight:700;color:#FFFFFF;margin:0 0 10px 0;">¡Bienvenido a Prestigia, ${ownerName}!</h1>
          <p style="font-size:13px;color:#CBD5E1;line-height:1.6;margin:0 0 20px 0;">
            Nos complace dar de alta formalmente a <strong style="color:#F59E0B;">${businessName}</strong> en nuestra red exclusiva bajo el <strong style="color:#FCD34D;">Plan ${plan.toUpperCase()}</strong>.
          </p>
          <div style="background-color:#141A26;border:1px solid rgba(245,158,11,0.3);border-radius:16px;padding:20px;margin-bottom:24px;">
            <div style="font-size:11px;text-transform:uppercase;color:#FBBF24;font-weight:700;letter-spacing:0.1em;margin-bottom:12px;">Tus Credenciales Oficiales de Acceso:</div>
            <table width="100%" style="font-size:12px;color:#E2E8F0;border-collapse:collapse;">
              <tr><td style="padding:6px 0;color:#94A3B8;">Portal de Acceso:</td><td style="font-weight:600;"><a href="${portalUrl}" style="color:#60A5FA;text-decoration:none;">${portalUrl}</a></td></tr>
              <tr><td style="padding:6px 0;color:#94A3B8;">ID de Empresa:</td><td style="font-family:monospace;font-weight:700;color:#F59E0B;">${businessId}</td></tr>
              <tr><td style="padding:6px 0;color:#94A3B8;">Contraseña Inicial:</td><td style="font-family:monospace;font-weight:700;color:#FFFFFF;">${password}</td></tr>
            </table>
          </div>
          <div style="text-align:center;margin:28px 0 20px 0;">
            <a href="${portalUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#F59E0B,#D97706);color:#07090E;font-weight:800;font-size:13px;text-decoration:none;border-radius:14px;box-shadow:0 10px 25px -5px rgba(245,158,11,0.4);">INGRESAR A MI PORTAL DE CLIENTE ↗</a>
          </div>
          <p style="font-size:11px;color:#94A3B8;line-height:1.6;margin:0;">
            💡 <strong>Siguiente paso:</strong> Dentro de tu portal podrás descargar tus Códigos QR de Mesa de alta resolución e imprimir tus placas para comenzar a blindar tu reputación en Google Maps.
          </p>
        </td></tr>
        <tr><td align="center" style="padding-top:24px;border-top:1px solid rgba(255,255,255,0.08);font-size:10px;color:#64748B;">
          Prestigia Big Data Lake © 2026 • Soporte VIP: contacto@prestigia.app
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

/**
 * 2. Template: Reactivation & Winback Offer (for Inactive/Suspended Clients)
 */
export function buildReactivationWinbackHtml(params: {
  businessName: string;
  ownerName: string;
  discountPercent?: number;
  offerDetails?: string;
  portalUrl?: string;
}): string {
  const { businessName, ownerName, discountPercent = 25, offerDetails = '30 días de Add-ons VIP (Live Wallboard & Sentiment 360) sin costo', portalUrl = 'https://prestigia.app/portal' } = params;
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Te extrañamos en Prestigia</title></head>
<body style="margin:0;padding:0;background-color:#07090E;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#E2E8F0;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#07090E;padding:40px 15px;">
    <tr><td align="center">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:580px;background-color:#0E131F;border:1px solid rgba(239,68,68,0.3);border-radius:24px;padding:36px 30px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.8);">
        <tr><td align="center" style="padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.08);">
          <div style="font-size:22px;font-weight:900;letter-spacing:0.18em;color:#F59E0B;text-transform:uppercase;">★ PRESTIGIA WINBACK ★</div>
          <div style="font-size:11px;color:#EF4444;margin-top:4px;letter-spacing:0.06em;font-weight:700;text-transform:uppercase;">Oportunidad Exclusiva de Reactivación</div>
        </td></tr>
        <tr><td style="padding-top:28px;padding-bottom:16px;">
          <h1 style="font-size:20px;font-weight:700;color:#FFFFFF;margin:0 0 10px 0;">Hola ${ownerName}, ¡te extrañamos en la red de ${businessName}!</h1>
          <p style="font-size:13px;color:#CBD5E1;line-height:1.6;margin:0 0 20px 0;">
            Hemos notado que el blindaje de reputación de tu negocio se encuentra temporalmente inactivo. Cada día sin Prestigia significa reseñas negativas no contenidas y clientes que no vuelven a tus sedes.
          </p>
          <div style="background:linear-gradient(135deg,rgba(245,158,11,0.12),rgba(14,19,31,0.9));border:1.5px solid #F59E0B;border-radius:18px;padding:22px;text-align:center;margin-bottom:24px;">
            <div style="font-size:11px;text-transform:uppercase;color:#FBBF24;font-weight:800;letter-spacing:0.12em;">Beneficio Especial de Retorno:</div>
            <div style="font-size:32px;font-weight:900;color:#FFFFFF;margin:8px 0;letter-spacing:0.05em;">${discountPercent}% DE DESCUENTO</div>
            <p style="font-size:12px;color:#E2E8F0;margin:0 0 6px 0;">+ ${offerDetails}</p>
            <div style="font-size:10px;color:#94A3B8;">Válido únicamente reactivando antes de finalizar esta semana.</div>
          </div>
          <div style="text-align:center;margin:28px 0 20px 0;">
            <a href="${portalUrl}" style="display:inline-block;padding:14px 34px;background:linear-gradient(135deg,#10B981,#059669);color:#FFFFFF;font-weight:800;font-size:13px;text-decoration:none;border-radius:14px;box-shadow:0 10px 25px -5px rgba(16,185,129,0.4);">REACTIVAR MI BLINDAJE DE INMEDIATO ↗</a>
          </div>
          <p style="font-size:11px;color:#94A3B8;text-align:center;margin:0;">
            Si prefieres que un asesor senior de Prestigia te acompañe personalmente, responde este correo o escríbenos a la línea de Dirección.
          </p>
        </td></tr>
        <tr><td align="center" style="padding-top:24px;border-top:1px solid rgba(255,255,255,0.08);font-size:10px;color:#64748B;">
          Prestigia Big Data Lake © 2026 • Campaña Oficial de Fidelización Comercial
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

/**
 * 3. Template: Monthly Reputation & Growth Executive Report
 */
export function buildMonthlyReportHtml(params: {
  businessName: string;
  ownerName: string;
  period?: string;
  currentRating?: number;
  ratingGain?: number;
  reviewsCount?: number;
  containedNegativeCount?: number;
  portalUrl?: string;
}): string {
  const { businessName, ownerName, period = 'Mes en Curso', currentRating = 4.8, ratingGain = 1.1, reviewsCount = 142, containedNegativeCount = 28, portalUrl = 'https://prestigia.app/portal' } = params;
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Reporte Ejecutivo Prestigia</title></head>
<body style="margin:0;padding:0;background-color:#07090E;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#E2E8F0;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#07090E;padding:40px 15px;">
    <tr><td align="center">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:580px;background-color:#0E131F;border:1px solid rgba(245,158,11,0.4);border-radius:24px;padding:36px 30px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.8);">
        <tr><td align="center" style="padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.08);">
          <div style="font-size:22px;font-weight:900;letter-spacing:0.18em;color:#F59E0B;text-transform:uppercase;">★ REPORTE EJECUTIVO MENSUAL ★</div>
          <div style="font-size:11px;color:#94A3B8;margin-top:4px;letter-spacing:0.06em;text-transform:uppercase;">Prestigia Big Data Analytics • ${period}</div>
        </td></tr>
        <tr><td style="padding-top:28px;padding-bottom:16px;">
          <h1 style="font-size:20px;font-weight:700;color:#FFFFFF;margin:0 0 8px 0;">Balance de Impacto: ${businessName}</h1>
          <p style="font-size:13px;color:#CBD5E1;line-height:1.6;margin:0 0 24px 0;">
            Estimado(a) ${ownerName}, aquí está el resumen de cómo el algoritmo de Prestigia protegió y potenció la facturación de tu negocio este mes:
          </p>
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
            <tr>
              <td width="50%" style="padding-right:8px;">
                <div style="background-color:#141A26;border:1px solid rgba(245,158,11,0.3);border-radius:16px;padding:16px;text-align:center;">
                  <div style="font-size:10px;text-transform:uppercase;color:#94A3B8;font-weight:700;">Calificación en Google Maps</div>
                  <div style="font-size:28px;font-weight:900;color:#F59E0B;margin:6px 0;">${currentRating} ★</div>
                  <div style="font-size:10px;color:#10B981;font-weight:700;">+${ratingGain}★ vs Día 1</div>
                </div>
              </td>
              <td width="50%" style="padding-left:8px;">
                <div style="background-color:#141A26;border:1px solid rgba(16,185,129,0.3);border-radius:16px;padding:16px;text-align:center;">
                  <div style="font-size:10px;text-transform:uppercase;color:#94A3B8;font-weight:700;">Quejas Contenidas en Sala</div>
                  <div style="font-size:28px;font-weight:900;color:#10B981;margin:6px 0;">${containedNegativeCount}</div>
                  <div style="font-size:10px;color:#CBD5E1;">Evitadas en Google Maps</div>
                </div>
              </td>
            </tr>
          </table>
          <div style="background-color:#141A26;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:18px;margin-bottom:24px;">
            <div style="font-size:11px;font-weight:700;color:#FCD34D;margin-bottom:6px;">📈 Crecimiento de Base de Datos (Habeas Data):</div>
            <div style="font-size:12px;color:#CBD5E1;line-height:1.5;">
              Acumulas <strong style="color:#FFFFFF;">${reviewsCount} clientes registrados</strong> en tu Big Data Lake listos para campañas de retorno y eventos especiales.
            </div>
          </div>
          <div style="text-align:center;margin:28px 0 20px 0;">
            <a href="${portalUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#F59E0B,#D97706);color:#07090E;font-weight:800;font-size:13px;text-decoration:none;border-radius:14px;box-shadow:0 10px 25px -5px rgba(245,158,11,0.4);">VER AUDITORÍA DETALLADA EN MI PORTAL ↗</a>
          </div>
        </td></tr>
        <tr><td align="center" style="padding-top:24px;border-top:1px solid rgba(255,255,255,0.08);font-size:10px;color:#64748B;">
          Prestigia Big Data Lake © 2026 • Reporte Automatizado de Dirección
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

/**
 * 4. Template: Institutional Announcement / System Update
 */
export function buildAnnouncementHtml(params: {
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
}): string {
  const { title, message, actionUrl = 'https://prestigia.app/portal', actionText = 'CONOCER MÁS EN MI PORTAL ↗' } = params;
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>${title}</title></head>
<body style="margin:0;padding:0;background-color:#07090E;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#E2E8F0;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#07090E;padding:40px 15px;">
    <tr><td align="center">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:580px;background-color:#0E131F;border:1px solid rgba(245,158,11,0.4);border-radius:24px;padding:36px 30px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.8);">
        <tr><td align="center" style="padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.08);">
          <div style="font-size:22px;font-weight:900;letter-spacing:0.18em;color:#F59E0B;text-transform:uppercase;">★ PRESTIGIA COMUNICADO ★</div>
          <div style="font-size:11px;color:#94A3B8;margin-top:4px;letter-spacing:0.06em;text-transform:uppercase;">Aviso Oficial de Dirección General</div>
        </td></tr>
        <tr><td style="padding-top:28px;padding-bottom:16px;">
          <h1 style="font-size:20px;font-weight:700;color:#FFFFFF;margin:0 0 12px 0;">${title}</h1>
          <div style="font-size:13px;color:#CBD5E1;line-height:1.7;margin:0 0 24px 0;white-space:pre-line;">
            ${message}
          </div>
          <div style="text-align:center;margin:28px 0 20px 0;">
            <a href="${actionUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#F59E0B,#D97706);color:#07090E;font-weight:800;font-size:13px;text-decoration:none;border-radius:14px;box-shadow:0 10px 25px -5px rgba(245,158,11,0.4);">${actionText}</a>
          </div>
        </td></tr>
        <tr><td align="center" style="padding-top:24px;border-top:1px solid rgba(255,255,255,0.08);font-size:10px;color:#64748B;">
          Prestigia Big Data Lake © 2026 • Comunicación Institucional Verificada
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

/**
 * 5. Template: Billing & Subscription Renewal
 */
export function buildBillingRenewalHtml(params: {
  businessName: string;
  ownerName: string;
  plan: string;
  amountCOP: number;
  dueDate: string;
  paymentUrl?: string;
}): string {
  const { businessName, ownerName, plan, amountCOP, dueDate, paymentUrl = 'https://prestigia.app/portal/facturacion' } = params;
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Aviso de Renovación Prestigia</title></head>
<body style="margin:0;padding:0;background-color:#07090E;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#E2E8F0;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#07090E;padding:40px 15px;">
    <tr><td align="center">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:580px;background-color:#0E131F;border:1px solid rgba(245,158,11,0.4);border-radius:24px;padding:36px 30px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.8);">
        <tr><td align="center" style="padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.08);">
          <div style="font-size:22px;font-weight:900;letter-spacing:0.18em;color:#F59E0B;text-transform:uppercase;">★ PRESTIGIA FACTURACIÓN ★</div>
          <div style="font-size:11px;color:#94A3B8;margin-top:4px;letter-spacing:0.06em;text-transform:uppercase;">Aviso de Ciclo de Facturación y Suscripción</div>
        </td></tr>
        <tr><td style="padding-top:28px;padding-bottom:16px;">
          <h1 style="font-size:20px;font-weight:700;color:#FFFFFF;margin:0 0 10px 0;">Renovación de Servicio: ${businessName}</h1>
          <p style="font-size:13px;color:#CBD5E1;line-height:1.6;margin:0 0 20px 0;">
            Estimado(a) ${ownerName}, tu suscripción activa al <strong style="color:#F59E0B;">Plan ${plan.toUpperCase()}</strong> está programada para renovación el próximo <strong style="color:#FFFFFF;">${dueDate}</strong>.
          </p>
          <div style="background-color:#141A26;border:1px solid rgba(245,158,11,0.3);border-radius:16px;padding:20px;margin-bottom:24px;text-align:center;">
            <div style="font-size:11px;text-transform:uppercase;color:#94A3B8;font-weight:700;">Valor a Renovar:</div>
            <div style="font-size:32px;font-weight:900;color:#FFFFFF;margin:8px 0;">$${amountCOP.toLocaleString('es-CO')} COP</div>
            <div style="font-size:11px;color:#10B981;">Garantía de continuidad operativa ininterrumpida 24/7</div>
          </div>
          <div style="text-align:center;margin:28px 0 20px 0;">
            <a href="${paymentUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#F59E0B,#D97706);color:#07090E;font-weight:800;font-size:13px;text-decoration:none;border-radius:14px;box-shadow:0 10px 25px -5px rgba(245,158,11,0.4);">RENOVAR SUSCRIPCIÓN EN LÍNEA ↗</a>
          </div>
        </td></tr>
        <tr><td align="center" style="padding-top:24px;border-top:1px solid rgba(255,255,255,0.08);font-size:10px;color:#64748B;">
          Prestigia Big Data Lake © 2026 • Soporte de Facturación: facturacion@prestigia.app
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

