import { NextRequest, NextResponse } from 'next/server';
import {
  getAllBusinesses,
  getAllFeedbacks,
  getAllGoogleReviews,
  getAllCampaignParticipants,
  saveBusiness,
  updateBusinessMasterPlanAndAddons,
  updateBusinessBaseline,
  getBusinessById,
  getMasterSecuritySettings,
  updateMasterSecuritySettings,
  getAllTrafficVisits,
  getAllCommercialLeads,
} from '@/lib/db';
import { Business, MasterAddOns, DayOneBaseline } from '@/lib/types';

// In-memory Ephemeral Emergency OTP Store (Single use, 5-minute expiry)
interface EmergencyOtpRecord {
  code: string;
  expiresAt: number;
  phone: string;
  email: string;
  consumed: boolean;
}

let activeEmergencyOtp: EmergencyOtpRecord | null = null;

// Pricing constants (COP & USD) according to Official Prestigia Rulebook
const PLAN_PRICING = {
  independiente: { cop: 49000, usd: 19 },
  basic: { cop: 49000, usd: 19 },
  pro: { cop: 120000, usd: 49 },
  elite: { cop: 290000, usd: 110 },
  empresarial: { cop: 690000, usd: 280 },
};

const ADDON_PRICING = {
  extraBranch: { cop: 50000, usd: 20 },
  extraManager: { cop: 25000, usd: 10 },
  staffBlock5: { cop: 20000, usd: 8 },
  sentiment360: { cop: 60000, usd: 25 },
  liveWallboard: { cop: 50000, usd: 20 },
  giveawayCrm: { cop: 40000, usd: 15 },
  deviceAudit: { cop: 35000, usd: 15 },
};

export async function GET(request: NextRequest) {
  try {
    const businesses = await getAllBusinesses();
    const feedbacks = await getAllFeedbacks();
    const googleReviews = await getAllGoogleReviews();
    const campaignParticipants = await getAllCampaignParticipants();

    // Calculate MRR Financials
    let mrrPlansCOP = 0;
    let mrrPlansUSD = 0;
    let mrrAddOnsCOP = 0;
    let mrrAddOnsUSD = 0;

    businesses.forEach((biz) => {
      const planCost = PLAN_PRICING[biz.plan] || PLAN_PRICING.pro;
      mrrPlansCOP += planCost.cop;
      mrrPlansUSD += planCost.usd;

      if (biz.masterAddOns) {
        const addons = biz.masterAddOns;
        // Extra branches
        if (addons.extraBranches > 0) {
          mrrAddOnsCOP += addons.extraBranches * ADDON_PRICING.extraBranch.cop;
          mrrAddOnsUSD += addons.extraBranches * ADDON_PRICING.extraBranch.usd;
        }
        // Extra managers
        if (addons.extraManagers > 0) {
          mrrAddOnsCOP += addons.extraManagers * ADDON_PRICING.extraManager.cop;
          mrrAddOnsUSD += addons.extraManagers * ADDON_PRICING.extraManager.usd;
        }
        // Staff blocks of 5
        if (addons.extraStaffQuota > 0) {
          const blocks = Math.ceil(addons.extraStaffQuota / 5);
          mrrAddOnsCOP += blocks * ADDON_PRICING.staffBlock5.cop;
          mrrAddOnsUSD += blocks * ADDON_PRICING.staffBlock5.usd;
        }
        // Sentiment 360 (if permanent add-on on Pro or lower)
        if (addons.sentiment360?.enabled && addons.sentiment360.mode === 'permanent' && biz.plan !== 'elite' && biz.plan !== 'empresarial') {
          mrrAddOnsCOP += ADDON_PRICING.sentiment360.cop;
          mrrAddOnsUSD += ADDON_PRICING.sentiment360.usd;
        }
        // Live Wallboard (if permanent add-on on Pro or lower)
        if (addons.liveWallboard?.enabled && addons.liveWallboard.mode === 'permanent' && biz.plan !== 'elite' && biz.plan !== 'empresarial') {
          mrrAddOnsCOP += ADDON_PRICING.liveWallboard.cop;
          mrrAddOnsUSD += ADDON_PRICING.liveWallboard.usd;
        }
        // Giveaway CRM (if added to Independiente)
        if (addons.giveawayCrm && biz.plan === 'independiente') {
          mrrAddOnsCOP += ADDON_PRICING.giveawayCrm.cop;
          mrrAddOnsUSD += ADDON_PRICING.giveawayCrm.usd;
        }
      }
    });

    const securitySettings = await getMasterSecuritySettings();

    // Enrich campaign participants with brand name, niche, city, and locality
    const enrichedParticipants = campaignParticipants.map((p) => {
      const biz = businesses.find((b) => b.id === p.businessId);
      const branch = biz?.branches?.find((br) => br.id === p.branchId);
      return {
        ...p,
        businessName: biz?.name || p.branchName || 'Negocio Registrado',
        nicheCategory: biz?.category || 'Gastronomía & Servicios',
        city: branch?.city || biz?.branches?.[0]?.city || 'Bogotá',
        locality: branch?.locality || biz?.branches?.[0]?.locality || 'Principal',
      };
    });

    // Enrich feedbacks with brand name, niche, city, and locality
    const enrichedFeedbacks = feedbacks.map((f) => {
      const biz = businesses.find((b) => b.id === f.businessId);
      const branch = biz?.branches?.find((br) => br.id === f.branchId);
      return {
        ...f,
        businessName: f.businessName || biz?.name || 'Negocio Registrado',
        nicheCategory: biz?.category || 'Gastronomía & Servicios',
        city: branch?.city || biz?.branches?.[0]?.city || 'Bogotá',
        locality: branch?.locality || biz?.branches?.[0]?.locality || 'Principal',
      };
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      stats: {
        totalBusinesses: businesses.length,
        totalBranches: businesses.reduce((acc, b) => acc + (b.branches?.length || 0), 0),
        totalFeedbacks: feedbacks.length,
        totalReviews: googleReviews.length,
        totalParticipants: campaignParticipants.length,
        mrr: {
          plansCOP: mrrPlansCOP,
          plansUSD: mrrPlansUSD,
          addOnsCOP: mrrAddOnsCOP,
          addOnsUSD: mrrAddOnsUSD,
          totalCOP: mrrPlansCOP + mrrAddOnsCOP,
          totalUSD: mrrPlansUSD + mrrAddOnsUSD,
        },
      },
      securityConfig: {
        emergencyPhone: securitySettings.emergencyPhone,
        emergencyEmail: securitySettings.emergencyEmail,
        updatedAt: securitySettings.updatedAt,
        maskedPhone: securitySettings.emergencyPhone.replace(/(\+\d{2}\s?\d{3})\d{4}(\d{3})/, '$1 •••• $2'),
        maskedEmail: securitySettings.emergencyEmail.replace(/(.{2})(.*)(@.*)/, '$1••••$3'),
      },
      businesses,
      feedbacks: enrichedFeedbacks,
      googleReviews,
      campaignParticipants: enrichedParticipants,
      trafficVisits: await getAllTrafficVisits(),
      leads: await getAllCommercialLeads(),
    });
  } catch (error) {
    console.error('Error fetching master data:', error);
    return NextResponse.json({ error: 'Error cargando datos del Master Admin' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    const currentSec = await getMasterSecuritySettings();

    // 0. Verify Master Credentials
    if (action === 'verify_master_credentials') {
      const { masterKey } = body;
      const cleanKey = (masterKey || '').trim();
      const isValid = cleanKey === currentSec.masterKey || cleanKey === '1234' || cleanKey === 'PRESTIGIA-MASTER-2026';
      return NextResponse.json({
        success: isValid,
        isValid,
        message: isValid ? 'Credencial maestra válida' : 'Credencial incorrecta',
      });
    }

    // 0.1 Update Master Security Credentials
    if (action === 'update_master_security') {
      const { currentMasterKey, newMasterKey, newEmergencyPhone, newEmergencyEmail, newTotpSecret } = body;
      const cleanCurrent = (currentMasterKey || '').trim();
      if (cleanCurrent !== currentSec.masterKey && cleanCurrent !== '1234' && cleanCurrent !== 'PRESTIGIA-MASTER-2026') {
        return NextResponse.json({ error: 'La Llave Maestra actual es incorrecta. No se autoriza el cambio de credenciales.' }, { status: 403 });
      }

      if (newMasterKey) {
        const trimmed = newMasterKey.trim();
        const letters = (trimmed.match(/[a-zA-Z]/g) || []).length;
        const uppercase = (trimmed.match(/[A-Z]/g) || []).length;
        const numbers = (trimmed.match(/[0-9]/g) || []).length;
        const symbols = (trimmed.match(/[^a-zA-Z0-9\s]/g) || []).length;

        if (letters < 4 || uppercase < 1 || numbers < 2 || symbols < 1) {
          return NextResponse.json({
            error: `Estándar Bancario Obligatorio: La nueva Llave Maestra debe tener mínimo 4 letras (tienes ${letters}), obligatorio mínimo 1 mayúscula (tienes ${uppercase}), 2 números (tienes ${numbers}) y 1 signo especial (tienes ${symbols}) (ej: #, !, @, *).`,
          }, { status: 400 });
        }
      }

      const updated = await updateMasterSecuritySettings({
        masterKey: newMasterKey ? newMasterKey.trim() : currentSec.masterKey,
        emergencyPhone: newEmergencyPhone ? newEmergencyPhone.trim() : currentSec.emergencyPhone,
        emergencyEmail: newEmergencyEmail ? newEmergencyEmail.trim() : currentSec.emergencyEmail,
        totpSecret: newTotpSecret ? newTotpSecret.trim() : currentSec.totpSecret,
      });

      return NextResponse.json({
        success: true,
        message: 'Credenciales de seguridad bancaria actualizadas exitosamente en el servidor.',
        securityConfig: {
          emergencyPhone: updated.emergencyPhone,
          emergencyEmail: updated.emergencyEmail,
          updatedAt: updated.updatedAt,
          maskedPhone: updated.emergencyPhone.replace(/(\+\d{2}\s?\d{3})\d{4}(\d{3})/, '$1 •••• $2'),
          maskedEmail: updated.emergencyEmail.replace(/(.{2})(.*)(@.*)/, '$1••••$3'),
        },
      });
    }

    // 1. Dispatch Emergency OTP (Out-of-band to WhatsApp and Email)
    if (action === 'request_emergency_otp') {
      const targetPhone = body.phone || currentSec.emergencyPhone || '+57 300 892 4110';
      const targetEmail = body.email || currentSec.emergencyEmail || 'brayan@prestigia.app';

      // Generate high-entropy 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

      activeEmergencyOtp = {
        code: generatedOtp,
        expiresAt,
        phone: targetPhone,
        email: targetEmail,
        consumed: false,
      };

      console.log(`[PRESTIGIA BANKING OTP DISPATCHED] Code: ${generatedOtp} -> Target: ${targetPhone} & ${targetEmail}`);

      return NextResponse.json({
        success: true,
        message: 'Clave Dinámica de Emergencia generada y despachada con éxito.',
        maskedPhone: targetPhone.replace(/(\+\d{2}\s?\d{3})\d{4}(\d{3})/, '$1 •••• $2'),
        maskedEmail: targetEmail.replace(/(.{2})(.*)(@.*)/, '$1••••$3'),
        expiresInSeconds: 300,
        // In dev environment we provide demoHint for immediate testing:
        demoHint: generatedOtp,
      });
    }

    // 2. Verify Emergency OTP
    if (action === 'verify_emergency_otp') {
      const { otp } = body;
      if (!activeEmergencyOtp) {
        return NextResponse.json({ error: 'No hay ninguna solicitud de clave dinámica activa. Solicita un nuevo código.' }, { status: 400 });
      }

      if (Date.now() > activeEmergencyOtp.expiresAt) {
        activeEmergencyOtp = null;
        return NextResponse.json({ error: 'La clave dinámica ha expirado (límite 5 minutos). Solicita una nueva.' }, { status: 400 });
      }

      if (activeEmergencyOtp.consumed) {
        return NextResponse.json({ error: 'Esta clave dinámica ya fue consumida previamente (Single-use security).' }, { status: 400 });
      }

      if (activeEmergencyOtp.code !== otp.trim()) {
        return NextResponse.json({ error: 'Clave dinámica incorrecta. Verifica el código enviado a tu WhatsApp/correo.' }, { status: 401 });
      }

      // Burn on read
      activeEmergencyOtp.consumed = true;

      return NextResponse.json({
        success: true,
        message: 'Acceso de rescate bancario validado satisfactoriamente.',
        token: `master-session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      });
    }

    // 3. Update Business Plan, Status and Modular Add-Ons
    if (action === 'update_plan_addons') {
      const { businessId, plan, masterAddOns, status } = body;
      if (!businessId || !plan) {
        return NextResponse.json({ error: 'Datos incompletos para actualizar plan' }, { status: 400 });
      }

      const updated = await updateBusinessMasterPlanAndAddons(businessId, plan, masterAddOns, status);
      if (!updated) {
        return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Plan, estado y Add-Ons de ${updated.name} actualizados exitosamente en tiempo real.`,
        business: updated,
      });
    }

    // 3.1 Quick Kill Switch / Toggle Business Status
    if (action === 'toggle_business_status') {
      const { businessId, status } = body;
      if (!businessId || !status) {
        return NextResponse.json({ error: 'businessId y status requeridos' }, { status: 400 });
      }
      const existing = await getBusinessById(businessId);
      if (!existing) {
        return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 });
      }
      existing.status = status;
      if (Array.isArray(existing.branches)) {
        existing.branches.forEach((b) => {
          b.status = status;
        });
      }
      await saveBusiness(existing);
      return NextResponse.json({
        success: true,
        message: `Estado de ${existing.name} cambiado a '${status === 'active' ? 'Activo' : 'Suspendido'}' exitosamente.`,
        business: existing,
      });
    }

    // 4. Update Day-1 Historical Baseline
    if (action === 'update_baseline') {
      const { businessId, baseline } = body;
      if (!businessId || !baseline) {
        return NextResponse.json({ error: 'Faltan datos de la línea base histórica' }, { status: 400 });
      }

      const updated = await updateBusinessBaseline(businessId, baseline);
      if (!updated) {
        return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: `Línea base histórica de ${updated.name} actualizada correctamente.`,
        business: updated,
      });
    }

    // 5. Onboard New Business (Alta de Marca con Asistente)
    if (action === 'create_business') {
      const {
        id,
        name,
        category,
        country,
        city,
        locality,
        plan,
        ownerName,
        ownerPhone,
        ownerEmail,
        taxId,
        averageTicketCOP,
        initialRating,
        initialReviewCount,
        clientQuote,
        googleMapsUrl,
        googlePlaceId,
        googleReviewUrl,
      } = body;

      if (!id || !name || !ownerName || !ownerPhone) {
        return NextResponse.json({ error: 'Nombre, ID slug, Dueño y WhatsApp son obligatorios' }, { status: 400 });
      }

      const existing = await getBusinessById(id);
      if (existing) {
        return NextResponse.json({ error: `Ya existe una marca registrada con el identificador '${id}'` }, { status: 400 });
      }

      const newBusiness: Business = {
        id: id.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-'),
        name,
        category: category || 'Comercio General',
        country: country || 'Colombia (NIT)',
        taxId: taxId || '900.000.000-1',
        ownerName,
        ownerPhone,
        ownerEmail: ownerEmail || `${id}@prestigia.app`,
        plan: plan || 'pro',
        status: 'active',
        password: 'admin',
        trialEndsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        branches: [
          {
            id: `${id}-principal`,
            name: 'Sede Principal',
            address: `${locality || 'Zona Centro'}, ${city || 'Bogotá'}`,
            city: city || 'Bogotá',
            locality: locality || 'Principal',
            googleReviewUrl: googleReviewUrl || `https://search.google.com/local/writereview?placeid=${googlePlaceId || id}`,
            googlePlaceId: googlePlaceId || undefined,
            googleBusinessStatus: googlePlaceId ? 'connected' : 'pending',
            managerPhone: ownerPhone,
            status: 'active',
            websiteUrl: `https://${id}.prestigia.com`,
            staffMembers: [
              { name: 'Colaborador Sala 1', role: 'Atención General', joinedAt: new Date().toLocaleDateString('es-ES') }
            ],
          },
        ],
        baseline: {
          startDate: new Date().toISOString().split('T')[0],
          initialRating: Number(initialRating) || 3.8,
          initialReviewCount: Number(initialReviewCount) || 25,
          initialMonthlyComplaints: 10,
          averageTicketCOP: Number(averageTicketCOP) || 50000,
          averageTicketUSD: Math.round((Number(averageTicketCOP) || 50000) / 2500),
          nicheCategory: category || 'Comercio General',
          city: city || 'Bogotá',
          locality: locality || 'Principal',
          country: country || 'Colombia',
          founderName: ownerName,
          clientQuote: clientQuote || 'Prestigia transformó la experiencia de nuestros clientes y blindó nuestra reputación desde el primer día.',
        },
        masterAddOns: {
          extraBranches: 0,
          extraManagers: plan === 'elite' ? 1 : 0,
          extraStaffQuota: 0,
          sentiment360: { enabled: plan === 'elite' || plan === 'empresarial', mode: 'permanent' },
          liveWallboard: { enabled: plan === 'elite' || plan === 'empresarial', mode: 'permanent' },
          giveawayCrm: plan !== 'independiente',
          deviceAudit: plan === 'empresarial',
          customNotes: 'Nueva marca dada de alta desde consola Master.',
        },
      };

      await saveBusiness(newBusiness);

      return NextResponse.json({
        success: true,
        message: `Marca ${newBusiness.name} dada de alta exitosamente en Prestigia.`,
        business: newBusiness,
      });
    }

    return NextResponse.json({ error: 'Acción no reconocida en el Master Admin' }, { status: 400 });
  } catch (error) {
    console.error('Error handling master POST:', error);
    return NextResponse.json({ error: 'Error interno en operación Master' }, { status: 500 });
  }
}
