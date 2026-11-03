import { NextResponse } from 'next/server';
import { getAllStudioDossiers, saveStudioDossier, deleteStudioDossier, restoreStudioDossier, StudioDossier } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const advisorId = searchParams.get('advisorId');
    const isLuisma = searchParams.get('isLuisma') === 'true';
    const isAdmin = searchParams.get('isAdmin') === 'true';

    const allDossiers = await getAllStudioDossiers();

    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();
    const isThisMonth = (dStr?: string) => {
      if (!dStr) return false;
      const d = new Date(dStr);
      return d.getFullYear() === curYear && d.getMonth() === curMonth;
    };

    const targetAdvisorId = advisorId || (isLuisma ? 'adv-luisma' : undefined);
    const advisorMonthDossiers = targetAdvisorId
      ? allDossiers.filter((d) => d.advisorId === targetAdvisorId && isThisMonth(d.createdAt))
      : [];

    const monthlyUsage = {
      creates: advisorMonthDossiers.filter((d) => d.mode === 'create').length,
      audits: advisorMonthDossiers.filter((d) => d.mode === 'audit').length,
      rescues: advisorMonthDossiers.filter((d) => d.mode === 'rescue').length,
    };

    if (isLuisma) {
      // Luisma receives ALL dossiers, including those soft-deleted by advisors for auditing
      return NextResponse.json({ success: true, dossiers: allDossiers, monthlyUsage });
    }

    // Regular advisors and directors only see active, non-deleted dossiers
    const nonDeleted = allDossiers.filter((d) => !d.deletedByAdvisor);
    if (isAdmin || !advisorId) {
      return NextResponse.json({ success: true, dossiers: nonDeleted, monthlyUsage });
    }

    const filtered = nonDeleted.filter((d) => d.advisorId === advisorId);
    return NextResponse.json({ success: true, dossiers: filtered, monthlyUsage });
  } catch (error: any) {
    console.error('Error fetching studio dossiers:', error);
    return NextResponse.json({ error: 'Error del servidor al obtener expedientes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      advisorId = 'adv-luisma',
      advisorName = 'Luisma • Director General & Founder',
      advisorPhone = '+573058314049',
      advisorType = 'founder',
      country = 'Colombia',
      clientName,
      contactName = '',
      contactCompany = '',
      contactPhone = '',
      contactEmail = '',
      contactRole = '',
      category = 'Restaurante / Gastronomía',
      city = 'Bogotá',
      neighborhood = '',
      googleUrl = '',
      mode = 'create',
      status = 'draft',
      closingStatus = 'lead_draft',
      setupFeeChargedUsd = 0,
      monthlyPlanUsd = 0,
      prestigiaPlan = 'none',
      paymentMethod = '',
      closingNotes = '',
      data,
      createdAt,
    } = body;

    if (!clientName || !clientName.trim()) {
      return NextResponse.json({ error: 'El nombre del cliente es obligatorio' }, { status: 400 });
    }

    const allDossiers = await getAllStudioDossiers();
    const existing = id ? allDossiers.find((d) => d.id === id) : null;

    if (!existing && advisorId !== 'adv-luisma' && advisorId !== 'luisma') {
      const { getAllStudioAdvisors } = await import('@/lib/db');
      const advisors = await getAllStudioAdvisors();
      const currentAdv = advisors.find((a) => a.id === advisorId);
      if (currentAdv && currentAdv.accountType !== 'founder') {
        const now = new Date();
        const curYear = now.getFullYear();
        const curMonth = now.getMonth();
        const monthDossiers = allDossiers.filter((d) => {
          if (d.advisorId !== advisorId) return false;
          const cd = new Date(d.createdAt);
          return cd.getFullYear() === curYear && cd.getMonth() === curMonth;
        });

        const targetMode = (mode as any) || 'create';
        const used = monthDossiers.filter((d) => d.mode === targetMode).length;
        const limit = targetMode === 'create'
          ? (currentAdv.maxCreatesMonthly ?? 30)
          : targetMode === 'audit'
          ? (currentAdv.maxAuditsMonthly ?? 30)
          : (currentAdv.maxRescuesMonthly ?? 10);

        if (used >= limit) {
          return NextResponse.json({
            error: `Has alcanzado tu cupo mensual de ${limit} ${targetMode === 'create' ? 'creaciones' : targetMode === 'audit' ? 'auditorías' : 'rescates'}. Contacta a Dirección General para ampliar tu plan.`
          }, { status: 403 });
        }
      }
    }

    const dossierObj: StudioDossier = {
      id: id || `dos-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      advisorId: existing?.advisorId || advisorId,
      advisorName: existing?.advisorName || advisorName,
      advisorPhone: existing?.advisorPhone || advisorPhone,
      advisorType: existing?.advisorType || advisorType,
      country: country?.trim() || existing?.country || 'Colombia',
      clientName: clientName.trim(),
      contactName: contactName !== undefined ? contactName?.trim() : (existing?.contactName || ''),
      contactCompany: contactCompany !== undefined ? contactCompany?.trim() : (existing?.contactCompany || ''),
      contactPhone: contactPhone !== undefined ? contactPhone?.trim() : (existing?.contactPhone || ''),
      contactEmail: contactEmail !== undefined ? contactEmail?.trim() : (existing?.contactEmail || ''),
      contactRole: contactRole !== undefined ? contactRole?.trim() : (existing?.contactRole || ''),
      category: category || existing?.category || 'Restaurante / Gastronomía',
      city: city.trim(),
      neighborhood: neighborhood !== undefined ? neighborhood?.trim() : (existing?.neighborhood || ''),
      googleUrl: googleUrl !== undefined ? googleUrl?.trim() : (existing?.googleUrl || ''),
      mode: (mode as any) || existing?.mode || 'create',
      status: (status as any) || existing?.status || 'draft',
      closingStatus: (closingStatus as any) || existing?.closingStatus || 'lead_draft',
      setupFeeChargedUsd: setupFeeChargedUsd !== undefined ? Number(setupFeeChargedUsd) : (existing?.setupFeeChargedUsd || 0),
      monthlyPlanUsd: monthlyPlanUsd !== undefined ? Number(monthlyPlanUsd) : (existing?.monthlyPlanUsd || 0),
      prestigiaPlan: (prestigiaPlan as any) || existing?.prestigiaPlan || 'none',
      paymentMethod: paymentMethod || existing?.paymentMethod || '',
      closingNotes: closingNotes || existing?.closingNotes || '',
      data: data || existing?.data || {},
      deletedByAdvisor: existing?.deletedByAdvisor || false,
      deletedAt: existing?.deletedAt || undefined,
      createdAt: existing?.createdAt || createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveStudioDossier(dossierObj);

    return NextResponse.json({ success: true, dossier: dossierObj });
  } catch (error: any) {
    console.error('Error saving studio dossier:', error);
    return NextResponse.json({ error: 'Error guardando expediente' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dossierId = searchParams.get('id');
    const isPermanentPurge = searchParams.get('purge') === 'true';
    const isRestore = searchParams.get('restore') === 'true';

    if (!dossierId) {
      return NextResponse.json({ error: 'ID de expediente no proporcionado' }, { status: 400 });
    }

    if (isRestore) {
      const ok = await restoreStudioDossier(dossierId);
      return NextResponse.json({ success: ok, message: 'Expediente restaurado con éxito' });
    }

    const ok = await deleteStudioDossier(dossierId, isPermanentPurge);
    return NextResponse.json({
      success: ok,
      message: isPermanentPurge ? 'Expediente purgado definitivamente de la base de datos' : 'Expediente eliminado con éxito'
    });
  } catch (error: any) {
    console.error('Error deleting studio dossier:', error);
    return NextResponse.json({ error: 'Error eliminando expediente' }, { status: 500 });
  }
}
