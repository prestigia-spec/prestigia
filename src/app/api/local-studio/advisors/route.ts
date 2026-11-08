import { NextResponse } from 'next/server';
import { getAllStudioAdvisors, saveStudioAdvisor, deleteStudioAdvisor, StudioAdvisor } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username')?.trim().toLowerCase();
    const password = searchParams.get('password')?.trim();

    const advisors = await getAllStudioAdvisors();

    // If login attempt
    if (username && password) {
      const match = advisors.find((a) => {
        const u = a.username.toLowerCase();
        if (u !== username) return false;
        if (!a.active) return false;
        // Strict credential check: Only the exact configured password for this account is allowed
        return a.password === password;
      });
      if (match) {
        // Return without revealing password
        const { password: _, ...safeAdvisor } = match;
        return NextResponse.json({ success: true, advisor: safeAdvisor });
      } else {
        return NextResponse.json({ success: false, error: 'Usuario o contraseña incorrectos o cuenta inactiva' }, { status: 401 });
      }
    }

    const isAdmin = searchParams.get('isAdmin') === 'true';
    if (isAdmin) {
      return NextResponse.json({ success: true, advisors });
    }

    // List all advisors (safe list)
    const safeList = advisors.map(({ password: _, ...a }) => a);
    return NextResponse.json({ success: true, advisors: safeList });
  } catch (error: any) {
    console.error('Error fetching studio advisors:', error);
    return NextResponse.json({ error: 'Error del servidor al obtener asesores' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      username,
      password,
      phone,
      role = 'advisor',
      accountType = 'internal_advisor',
      planTier = 'level_1',
      country = 'Colombia',
      city = 'Bogotá',
      monthlyFeeUsd,
      licenseStatus = 'active',
      active = true,
      planStartDate,
      extraCredits,
      maxCreatesMonthly,
      maxAuditsMonthly,
      maxRescuesMonthly,
      maxAppealsMonthly,
      maxToolsMonthly,
      masterKey,
      action,
      rechargeTab,
    } = body;

    const allAdvisors = await getAllStudioAdvisors();
    const existing = id ? allAdvisors.find((a) => a.id === id) : null;

    // Security check: master key or existing update
    if (masterKey && masterKey.trim() !== 'admin') {
      return NextResponse.json({ error: 'Clave de Administrador inválida' }, { status: 403 });
    }

    // Acción rápida 1: Registrar Pago Mensual y Reactivar Cupo
    if (action === 'mark_paid_and_activate' && existing) {
      const updated: StudioAdvisor = {
        ...existing,
        active: true,
        licenseStatus: 'active',
        planStartDate: new Date().toISOString(),
      };
      await saveStudioAdvisor(updated);
      const { password: _, ...safe } = updated;
      return NextResponse.json({ success: true, advisor: safe, message: 'Pago mensual confirmado. Cupo reactivado para nuevo ciclo.' });
    }

    // Acción rápida 2: Recargar +10 Créditos en una pestaña específica
    if (action === 'recharge_credits' && existing && rechargeTab) {
      const currentExtras = existing.extraCredits || {};
      const tabKey = rechargeTab as 'creates' | 'audits' | 'rescues' | 'appeals' | 'tools';
      const updated: StudioAdvisor = {
        ...existing,
        extraCredits: {
          ...currentExtras,
          [tabKey]: (currentExtras[tabKey] || 0) + 10,
        },
      };
      await saveStudioAdvisor(updated);
      const { password: _, ...safe } = updated;
      return NextResponse.json({ success: true, advisor: safe, message: `+10 Créditos recargados exitosamente en ${rechargeTab}.` });
    }

    // Acción rápida 3: Apagar / Encender Usuario (Toggle Active)
    if (action === 'toggle_status' && existing) {
      const nextActive = body.active !== undefined ? Boolean(body.active) : !existing.active;
      const updated: StudioAdvisor = {
        ...existing,
        active: nextActive,
        licenseStatus: nextActive ? (existing.licenseStatus === 'suspended' ? 'active' : existing.licenseStatus) : 'suspended',
      };
      await saveStudioAdvisor(updated);
      const { password: _, ...safe } = updated;
      return NextResponse.json({
        success: true,
        advisor: safe,
        message: nextActive ? 'Usuario activado exitosamente.' : 'Usuario apagado / pausado por facturación.',
      });
    }

    if (!name || !username) {
      return NextResponse.json({ error: 'Nombre y usuario son obligatorios' }, { status: 400 });
    }

    if (!existing && !password) {
      return NextResponse.json({ error: 'La contraseña es obligatoria al registrar una nueva cuenta' }, { status: 400 });
    }

    const isLuisma = (id === 'adv-luisma' || username.trim().toLowerCase() === 'luisma');

    // Strict Rule: Dirección General & Founder is exclusive to Luisma. No other account can have or change to this type.
    const resolvedAccountType: 'founder' | 'internal_advisor' | 'partner_agency' = isLuisma
      ? 'founder'
      : (accountType === 'partner_agency' ? 'partner_agency' : 'internal_advisor');

    // Calibración de defaults según el Plan Oficial (Nivel 1: $49/10, Nivel 2: $90/20, Nivel 3: $140/30, Master: 9999)
    const resolvedPlanTier: 'level_1' | 'level_2' | 'level_3' | 'founder' = isLuisma
      ? 'founder'
      : (planTier === 'level_3' ? 'level_3' : planTier === 'level_2' ? 'level_2' : 'level_1');

    const defaultFeeByTier = resolvedPlanTier === 'level_3' ? 140 : resolvedPlanTier === 'level_2' ? 90 : 49;
    const defaultQuotaByTier = resolvedPlanTier === 'level_3' ? 30 : resolvedPlanTier === 'level_2' ? 20 : 10;

    const advisorObj: StudioAdvisor = {
      id: isLuisma ? 'adv-luisma' : (id || `adv-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`),
      name: name.trim(),
      username: username.trim().toLowerCase(),
      password: (password && password.trim()) ? password.trim() : (existing?.password || '1234'),
      phone: (phone !== undefined ? phone : (existing?.phone || '+573058314049')).trim(),
      role: isLuisma ? 'admin' : (existing?.role || 'advisor'),
      accountType: resolvedAccountType,
      planTier: resolvedPlanTier,
      country: (country || existing?.country || 'Colombia').trim(),
      city: (city || existing?.city || 'Bogotá').trim(),
      monthlyFeeUsd: monthlyFeeUsd !== undefined ? Number(monthlyFeeUsd) : (existing?.monthlyFeeUsd ?? defaultFeeByTier),
      licenseStatus: isLuisma ? 'active' : (licenseStatus || existing?.licenseStatus || 'active'),
      active: isLuisma ? true : (active !== undefined ? Boolean(active) : (existing?.active ?? true)),
      planStartDate: planStartDate || existing?.planStartDate || new Date().toISOString(),
      extraCredits: extraCredits !== undefined ? extraCredits : (existing?.extraCredits || {}),
      maxCreatesMonthly: maxCreatesMonthly !== undefined ? Number(maxCreatesMonthly) : (existing?.maxCreatesMonthly ?? defaultQuotaByTier),
      maxAuditsMonthly: maxAuditsMonthly !== undefined ? Number(maxAuditsMonthly) : (existing?.maxAuditsMonthly ?? defaultQuotaByTier),
      maxRescuesMonthly: maxRescuesMonthly !== undefined ? Number(maxRescuesMonthly) : (existing?.maxRescuesMonthly ?? defaultQuotaByTier),
      maxAppealsMonthly: maxAppealsMonthly !== undefined ? Number(maxAppealsMonthly) : (existing?.maxAppealsMonthly ?? defaultQuotaByTier),
      maxToolsMonthly: maxToolsMonthly !== undefined ? Number(maxToolsMonthly) : (existing?.maxToolsMonthly ?? defaultQuotaByTier),
      createdAt: existing?.createdAt || new Date().toISOString(),
    };

    await saveStudioAdvisor(advisorObj);
    const { password: _, ...safeAdvisor } = advisorObj;

    return NextResponse.json({ success: true, advisor: safeAdvisor });
  } catch (error: any) {
    console.error('Error saving studio advisor:', error);
    return NextResponse.json({ error: 'Error guardando asesor' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const advisorId = searchParams.get('id');
    const masterKey = searchParams.get('masterKey');

    if (!masterKey || masterKey.trim() !== 'admin') {
      return NextResponse.json({ error: 'Autorización requerida de Administrador' }, { status: 403 });
    }

    if (!advisorId) {
      return NextResponse.json({ error: 'ID de asesor no proporcionado' }, { status: 400 });
    }

    const ok = await deleteStudioAdvisor(advisorId);
    if (!ok) {
      return NextResponse.json({ error: 'No se puede eliminar el Administrador Principal' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Asesor eliminado exitosamente' });
  } catch (error: any) {
    console.error('Error deleting studio advisor:', error);
    return NextResponse.json({ error: 'Error eliminando asesor' }, { status: 500 });
  }
}
