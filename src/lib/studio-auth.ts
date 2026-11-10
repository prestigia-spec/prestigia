import { getAllStudioAdvisors, getAllStudioDossiers, StudioAdvisor } from './db';

export type StudioToolTab = 'creates' | 'audits' | 'rescues' | 'appeals' | 'tools';

export interface QuotaVerificationResult {
  authorized: boolean;
  status: number;
  error?: string;
  code?: 'UNAUTHORIZED' | 'ADVISOR_NOT_FOUND' | 'ACCOUNT_SUSPENDED' | 'QUOTA_EXHAUSTED';
  isMaster?: boolean;
  advisor?: {
    id: string;
    name: string;
    username: string;
    planTier?: string;
  };
  effectiveQuota?: number;
  usedCount?: number;
  remainingCredits?: number;
}

/**
 * Live Server-Side Guard: Verifies that an advisor exists, is active,
 * has an un-suspended license, and has not exceeded their monthly credit quota.
 *
 * Founder / Luisma Master has infinite quota and bypasses limits.
 */
export async function verifyAdvisorQuota(
  advisorIdOrUsername?: string | null,
  tab: StudioToolTab = 'creates'
): Promise<QuotaVerificationResult> {
  const cleanId = (advisorIdOrUsername || '').trim();
  if (!cleanId) {
    return {
      authorized: false,
      status: 401,
      error: 'Acceso no autorizado: Identificador de asesor no suministrado.',
      code: 'UNAUTHORIZED',
    };
  }

  const advisors = await getAllStudioAdvisors();
  const advisor = advisors.find(
    (a) => a.id === cleanId || a.username.toLowerCase() === cleanId.toLowerCase()
  );

  if (!advisor) {
    return {
      authorized: false,
      status: 403,
      error: 'Acceso denegado: El asesor no está registrado en la base de datos.',
      code: 'ADVISOR_NOT_FOUND',
    };
  }

  // 1. Master Exemption: Luisma / Founder has total access
  const isMaster =
    advisor.id === 'adv-luisma' ||
    advisor.username.toLowerCase() === 'luisma' ||
    advisor.role === 'admin' ||
    advisor.accountType === 'founder';

  if (isMaster) {
    return {
      authorized: true,
      status: 200,
      isMaster: true,
      advisor: {
        id: advisor.id,
        name: advisor.name,
        username: advisor.username,
        planTier: 'founder',
      },
      effectiveQuota: 9999,
      usedCount: 0,
      remainingCredits: 9999,
    };
  }

  // 2. Account Suspension & Inactive Verification
  if (!advisor.active || advisor.licenseStatus === 'suspended') {
    return {
      authorized: false,
      status: 403,
      error: 'Cuenta suspendida o inactiva por facturación pendiente. Comunícate con Dirección General para reactivar tu servicio.',
      code: 'ACCOUNT_SUSPENDED',
      advisor: {
        id: advisor.id,
        name: advisor.name,
        username: advisor.username,
        planTier: advisor.planTier,
      },
    };
  }

  // 3. Quota Calculation (Base Tier + Extra Recharge Credits)
  const baseQuota =
    tab === 'creates'
      ? (advisor.maxCreatesMonthly ?? 10)
      : tab === 'audits'
      ? (advisor.maxAuditsMonthly ?? 10)
      : tab === 'rescues'
      ? (advisor.maxRescuesMonthly ?? 10)
      : tab === 'appeals'
      ? (advisor.maxAppealsMonthly ?? 10)
      : (advisor.maxToolsMonthly ?? 10);

  const extraCredits = Number(advisor.extraCredits?.[tab] || 0);
  const effectiveQuota = Math.max(0, baseQuota + extraCredits);

  // 4. Calculate Dossier Usage in the Current Monthly Cycle
  const allDossiers = await getAllStudioDossiers();

  const cycleStartDate = advisor.planStartDate
    ? new Date(advisor.planStartDate)
    : (() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
      })();

  const modeTarget =
    tab === 'creates'
      ? 'create'
      : tab === 'audits'
      ? 'audit'
      : tab === 'rescues'
      ? 'rescue'
      : tab === 'appeals'
      ? 'appeal'
      : 'tools';

  const usedCount = allDossiers.filter((d) => {
    const isAdvisorMatch =
      d.advisorId === advisor.id ||
      (d.advisorName && d.advisorName.toLowerCase() === advisor.name.toLowerCase());
    if (!isAdvisorMatch) return false;
    const isTargetMode =
      d.mode === modeTarget || (modeTarget === 'tools' && (d.mode === 'tools' || d.mode === 'prospect'));
    if (!isTargetMode) return false;

    if (!d.createdAt) return false;
    const createdAtTime = new Date(d.createdAt).getTime();
    if (isNaN(createdAtTime)) return false;

    return createdAtTime >= cycleStartDate.getTime();
  }).length;

  // 5. Quota Exhaustion Check
  if (usedCount >= effectiveQuota) {
    return {
      authorized: false,
      status: 403,
      error: `Has alcanzado el límite de tu plan (${effectiveQuota} créditos consumidos en ${tab}). Para continuar generando expedientes, solicita una recarga a Dirección General.`,
      code: 'QUOTA_EXHAUSTED',
      effectiveQuota,
      usedCount,
      remainingCredits: 0,
      advisor: {
        id: advisor.id,
        name: advisor.name,
        username: advisor.username,
        planTier: advisor.planTier,
      },
    };
  }

  return {
    authorized: true,
    status: 200,
    isMaster: false,
    effectiveQuota,
    usedCount,
    remainingCredits: Math.max(0, effectiveQuota - usedCount),
    advisor: {
      id: advisor.id,
      name: advisor.name,
      username: advisor.username,
      planTier: advisor.planTier,
    },
  };
}

/**
 * Server-Side Guard: Verifies that caller has Dirección General (Master/Admin) privileges.
 */
export async function verifyMasterAdmin(
  callerAdvisorId?: string | null,
  providedMasterKey?: string | null
): Promise<{ authorized: boolean; reason?: string }> {
  // Check master key
  const serverMasterKey = process.env.STUDIO_MASTER_KEY || 'admin';
  const cleanKey = (providedMasterKey || '').trim();

  if (cleanKey && cleanKey === serverMasterKey) {
    return { authorized: true };
  }

  // Check caller advisor credentials
  if (callerAdvisorId) {
    const advisors = await getAllStudioAdvisors();
    const caller = advisors.find((a) => a.id === callerAdvisorId);
    if (
      caller &&
      (caller.id === 'adv-luisma' ||
        caller.username.toLowerCase() === 'luisma' ||
        caller.role === 'admin' ||
        caller.accountType === 'founder')
    ) {
      return { authorized: true };
    }
  }

  return {
    authorized: false,
    reason: 'Acceso denegado: Se requieren privilegios de Dirección General.',
  };
}
