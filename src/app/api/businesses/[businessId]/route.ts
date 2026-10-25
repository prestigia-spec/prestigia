import { NextRequest, NextResponse } from 'next/server';
import { getBranchOrBusiness, getCampaign, getBusinessById, saveBusiness } from '@/lib/db';
import { sanitizeStaffName, normalizeSocialUrl } from '@/lib/security';

export async function GET(
  request: Request,
  { params }: { params: { businessId: string } }
) {
  try {
    const slug = params.businessId;
    const resolved = await getBranchOrBusiness(slug);

    if (!resolved) {
      return NextResponse.json(
        { error: 'Establecimiento o sede no encontrada' },
        { status: 404 }
      );
    }

    const { business, branch } = resolved;

    // A branch is active only if both the master business and the branch are active
    const effectiveStatus =
      business.status === 'suspended' || branch.status === 'suspended'
        ? 'suspended'
        : 'active';

    return NextResponse.json({
      businessId: business.id,
      businessName: business.name,
      branchId: branch.id,
      branchName: branch.name,
      address: branch.address,
      city: branch.city,
      locality: branch.locality,
      googleReviewUrl: branch.googleReviewUrl,
      googlePlaceId: branch.googlePlaceId || null,
      googleBusinessStatus: branch.googleBusinessStatus || 'connected',
      googleManagedBy: branch.googleManagedBy || 'prestigia_central',
      googleAuditedAt: branch.googleAuditedAt || null,
      googleAuditNotes: branch.googleAuditNotes || null,
      googleSelfServiceEnabled: branch.googleSelfServiceEnabled ?? false,
      category: business.category,
      status: effectiveStatus,
      plan: business.plan,
      masterAddOns: business.masterAddOns || null,
      baseline: business.baseline || null,
      ownerName: business.ownerName || null,
      ownerPhone: business.ownerPhone || null,
      managerPhone: branch.managerPhone,
      managerName: branch.managerName || null,
      managerRole: branch.managerRole || null,
      managers: branch.managers || [],
      schedule: branch.schedule || null,
      scheduleWeekdays: branch.scheduleWeekdays || null,
      scheduleWeekends: branch.scheduleWeekends || null,
      scheduleHolidays: branch.scheduleHolidays || null,
      responseTimeSla: branch.responseTimeSla || '< 15 min',
      containmentMessage: branch.containmentMessage || null,
      staffMembers: branch.staffMembers || [],
      websiteUrl: branch.websiteUrl || 'https://prestigia.com',
      instagramUrl: branch.instagramUrl || null,
      tiktokUrl: branch.tiktokUrl || null,
      facebookUrl: branch.facebookUrl || null,
      whatsappVipUrl: branch.whatsappVipUrl || null,
      menuUrl: branch.menuUrl || null,
      branches: business.branches || [],
      campaign: (await getCampaign(business.id, branch.id)) || null,
      branding: business.branding || null,
      rawBusiness: {
        ...business,
        status: effectiveStatus,
      },
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('Error fetching business/branch:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { businessId: string } }
) {
  try {
    const slug = params.businessId;
    const body = await request.json();
    const existing = await getBusinessById(slug);

    if (!existing) {
      return NextResponse.json(
        { error: 'Negocio no encontrado' },
        { status: 404 }
      );
    }

    // Regla de Negocio: En Plan Élite máximo 3 sedes incluidas
    if (body.branches && Array.isArray(body.branches)) {
      if (existing.plan === 'elite' && body.branches.length > 3) {
        return NextResponse.json(
          {
            error:
              'Has alcanzado el límite de 3 sedes incluidas en tu Plan Élite. Para activar sedes adicionales (+ $120.000 COP/mes por sede), solicítalo a tu ejecutivo Prestigia.',
          },
          { status: 400 }
        );
      }
      if ((existing.plan === 'pro' || existing.plan === 'basic') && body.branches.length > 1) {
        return NextResponse.json(
          {
            error:
              'Tu plan actual solo permite 1 sede. Pásate a Plan Élite para administrar hasta 3 sedes simultáneas.',
          },
          { status: 400 }
        );
      }
    }

    // Actualizar campos permitidos para el Dueño:
    // 1. Identidad Visual (Logo y Paleta de Colores)
    // 2. Canales Digitales y Redes Sociales por Sede (Instagram, TikTok, Facebook, WhatsApp VIP)
    // 3. Colaboradores / Empleados registrados por Sede (staffMembers)
    // NOTA DE SEGURIDAD: La creación/borrado de sedes, datos de empresa (name, category, owner)
    // y credenciales de acceso solo son modificables desde el panel administrativo central de Prestigia.
    const mergedBranches = existing.branches.map((b) => {
      const incoming = (body.branches || []).find((ib: any) => ib.id === b.id);
      if (!incoming) return b;

      // Sanitizar y validar colaboradores (máximo 30, sin duplicados ni código malicioso)
      let cleanedStaff = b.staffMembers || [];
      if (Array.isArray(incoming.staffMembers)) {
        const unique = new Map<string, any>();
        for (const raw of incoming.staffMembers) {
          if (typeof raw === 'object' && raw !== null && raw.name) {
            const cleanName = sanitizeStaffName(String(raw.name || ''));
            const cleanRole = sanitizeStaffName(String(raw.role || 'Atención / Servicio'));
            const cleanDate = String(raw.joinedAt || new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }));
            if (cleanName && !unique.has(cleanName.toLowerCase())) {
              unique.set(cleanName.toLowerCase(), {
                name: cleanName,
                role: cleanRole,
                joinedAt: cleanDate,
              });
            }
          } else if (typeof raw === 'string') {
            const cleanName = sanitizeStaffName(String(raw || ''));
            if (cleanName && !unique.has(cleanName.toLowerCase())) {
              unique.set(cleanName.toLowerCase(), {
                name: cleanName,
                role: 'Atención / Servicio',
                joinedAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
              });
            }
          }
          const maxStaff = b.staffQuota || 15;
          if (unique.size >= maxStaff) break;
        }
        cleanedStaff = Array.from(unique.values());
      }

      // Sanitizar y limitar encargados según cupo contratado en Master
      const maxManagers = b.managersQuota || 3;
      let cleanedManagers = b.managers || [];
      if (Array.isArray(incoming.managers)) {
        cleanedManagers = incoming.managers.slice(0, maxManagers);
      }

      return {
        ...b,
        // Permitir actualizar y normalizar redes sociales
        instagramUrl: incoming.instagramUrl !== undefined ? normalizeSocialUrl('instagram', incoming.instagramUrl) : b.instagramUrl,
        tiktokUrl: incoming.tiktokUrl !== undefined ? normalizeSocialUrl('tiktok', incoming.tiktokUrl) : b.tiktokUrl,
        facebookUrl: incoming.facebookUrl !== undefined ? normalizeSocialUrl('facebook', incoming.facebookUrl) : b.facebookUrl,
        whatsappVipUrl: incoming.whatsappVipUrl !== undefined ? normalizeSocialUrl('whatsapp', incoming.whatsappVipUrl) : b.whatsappVipUrl,
        menuUrl: incoming.menuUrl !== undefined ? String(incoming.menuUrl).trim() : b.menuUrl,
        // Permitir actualizar colaboradores / empleados sanitizados (respetando quota)
        staffMembers: cleanedStaff,
        // Permitir actualizar encargados de servicio (managers multi-cuentas respetando quota)
        managers: cleanedManagers,
        // Permitir actualizar horarios de atención y protocolo de contención de sede
        schedule: incoming.schedule !== undefined ? String(incoming.schedule) : b.schedule,
        scheduleWeekdays: incoming.scheduleWeekdays !== undefined ? String(incoming.scheduleWeekdays) : b.scheduleWeekdays,
        scheduleWeekends: incoming.scheduleWeekends !== undefined ? String(incoming.scheduleWeekends) : b.scheduleWeekends,
        scheduleHolidays: incoming.scheduleHolidays !== undefined ? String(incoming.scheduleHolidays) : b.scheduleHolidays,
        responseTimeSla: incoming.responseTimeSla !== undefined ? String(incoming.responseTimeSla) : b.responseTimeSla,
        containmentMessage: incoming.containmentMessage !== undefined ? String(incoming.containmentMessage) : b.containmentMessage,
        timezone: incoming.timezone !== undefined ? String(incoming.timezone) : (b.timezone || 'GMT-5 (Bogotá, Lima, Quito)'),
        lastAuditUpdate: incoming.lastAuditUpdate !== undefined ? String(incoming.lastAuditUpdate) : b.lastAuditUpdate,
        // Google Business Profile Sync & Place ID
        googlePlaceId: incoming.googlePlaceId !== undefined ? String(incoming.googlePlaceId) : b.googlePlaceId,
        googleReviewUrl: incoming.googleReviewUrl !== undefined ? String(incoming.googleReviewUrl) : b.googleReviewUrl,
        googleBusinessStatus: incoming.googleBusinessStatus !== undefined ? incoming.googleBusinessStatus : b.googleBusinessStatus,
        googleManagedBy: incoming.googleManagedBy !== undefined ? incoming.googleManagedBy : b.googleManagedBy,
        googleAuditedAt: incoming.googleAuditedAt !== undefined ? incoming.googleAuditedAt : b.googleAuditedAt,
        googleAuditNotes: incoming.googleAuditNotes !== undefined ? incoming.googleAuditNotes : b.googleAuditNotes,
        googleSelfServiceEnabled: incoming.googleSelfServiceEnabled !== undefined ? incoming.googleSelfServiceEnabled : b.googleSelfServiceEnabled,
      };
    });

    const updatedBusiness = {
      ...existing,
      branding: body.branding !== undefined ? body.branding : existing.branding,
      branches: mergedBranches,
    };

    await saveBusiness(updatedBusiness);
    return NextResponse.json({ success: true, business: updatedBusiness });
  } catch (error) {
    console.error('Error updating business:', error);
    return NextResponse.json(
      { error: 'Error interno al actualizar los datos del negocio' },
      { status: 500 }
    );
  }
}

