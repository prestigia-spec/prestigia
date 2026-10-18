import fs from 'fs';
import path from 'path';
import {
  DeviceSession,
  DeviceAuditLog,
  UserRole,
  DeviceType,
  BlockedDevice,
  LoginApprovalRequest,
} from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

interface SessionsStorage {
  sessions: DeviceSession[];
  auditLogs: DeviceAuditLog[];
  blockedDevices: BlockedDevice[];
  loginRequests: LoginApprovalRequest[];
}

function ensureSessionsFile(): SessionsStorage {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(SESSIONS_FILE)) {
    try {
      const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed.sessions)) parsed.sessions = [];
      if (!Array.isArray(parsed.auditLogs)) parsed.auditLogs = [];
      if (!Array.isArray(parsed.blockedDevices)) parsed.blockedDevices = [];
      if (!Array.isArray(parsed.loginRequests)) parsed.loginRequests = [];
      return parsed;
    } catch (e) {
      console.error('Error reading sessions.json:', e);
    }
  }

  const initial: SessionsStorage = {
    sessions: [
      {
        deviceId: 'dev_mock_pc_chapinero',
        deviceName: 'PC Mostrador (Windows - Chrome)',
        deviceType: 'desktop',
        os: 'Windows 11',
        browser: 'Google Chrome',
        ipAddress: '181.61.192.44',
        businessId: 'clinica-san-rafael',
        branchId: 'san-rafael-norte',
        branchName: 'Sede Norte - Consultorios & Odontología',
        userRole: 'branch_manager',
        username: 'claudia.mendoza',
        loginAt: '2026-09-27T08:00:00.000Z',
        lastActiveAt: '2026-09-27T11:30:00.000Z',
        status: 'active',
      },
    ],
    auditLogs: [
      {
        id: 'aud_1',
        timestamp: '2026-09-27T08:00:00.000Z',
        businessId: 'clinica-san-rafael',
        branchId: 'san-rafael-norte',
        branchName: 'Sede Norte - Consultorios & Odontología',
        deviceId: 'dev_mock_pc_norte',
        deviceName: 'PC Mostrador (Windows - Chrome)',
        deviceType: 'desktop',
        userRole: 'branch_manager',
        username: 'claudia.mendoza',
        event: 'login_success',
        details: 'Inicio de sesión autorizado en PC principal de recepción',
      },
    ],
    blockedDevices: [],
    loginRequests: [],
  };

  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(initial, null, 2), 'utf-8');
  return initial;
}

function writeSessionsFile(data: SessionsStorage): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Check if a device is currently blocked in the blacklist
 */
export function isDeviceBlocked(deviceId: string): boolean {
  const store = ensureSessionsFile();
  return store.blockedDevices.some((b) => b.deviceId === deviceId);
}

/**
 * Get all blocked devices
 */
export function getBlockedDevices(businessId?: string): BlockedDevice[] {
  const store = ensureSessionsFile();
  return store.blockedDevices;
}

/**
 * Block a device (Blacklist).
 * Also immediately terminates any active session for that device.
 */
export function blockDevice(params: {
  deviceId: string;
  deviceName?: string;
  deviceType?: DeviceType;
  os?: string;
  browser?: string;
  blockedBy: string;
  reason?: string;
  branchId?: string;
  branchName?: string;
  businessId?: string;
}): BlockedDevice {
  const store = ensureSessionsFile();
  const now = new Date().toISOString();

  // 1. Remove if already exists in blocked list to update it
  store.blockedDevices = store.blockedDevices.filter((b) => b.deviceId !== params.deviceId);

  const blockedEntry: BlockedDevice = {
    deviceId: params.deviceId,
    deviceName: params.deviceName || 'Dispositivo',
    deviceType: params.deviceType || 'desktop',
    os: params.os,
    browser: params.browser,
    blockedAt: now,
    blockedBy: params.blockedBy,
    reason: params.reason || 'Bloqueado por la administración central (vacaciones o seguridad)',
    branchId: params.branchId,
    branchName: params.branchName,
  };

  store.blockedDevices.unshift(blockedEntry);

  // 2. Terminate any active sessions for this device
  const session = store.sessions.find((s) => s.deviceId === params.deviceId);
  if (session) {
    session.status = 'blocked';
    session.displacedByDeviceName = `Bloqueado por ${params.blockedBy}`;
    session.displacedAt = now;
  }

  // 3. Log audit event
  store.auditLogs.unshift({
    id: `aud_${Date.now()}_block`,
    timestamp: now,
    businessId: params.businessId || session?.businessId || 'clinica-san-rafael',
    branchId: params.branchId || session?.branchId || 'general',
    branchName: params.branchName || session?.branchName || 'Administración Central',
    deviceId: params.deviceId,
    deviceName: params.deviceName || session?.deviceName || 'Dispositivo',
    deviceType: params.deviceType || session?.deviceType || 'desktop',
    userRole: 'owner',
    username: params.blockedBy,
    event: 'device_blocked',
    details: `Dispositivo bloqueado por ${params.blockedBy}. Motivo: ${blockedEntry.reason}`,
  });

  writeSessionsFile(store);
  return blockedEntry;
}

/**
 * Unblock a device (Remove from Blacklist)
 */
export function unblockDevice(
  deviceId: string,
  unblockedBy: string,
  businessId: string = 'clinica-san-rafael'
): boolean {
  const store = ensureSessionsFile();
  const now = new Date().toISOString();

  const found = store.blockedDevices.find((b) => b.deviceId === deviceId);
  if (!found) return false;

  store.blockedDevices = store.blockedDevices.filter((b) => b.deviceId !== deviceId);

  // If session was marked as blocked, reset it
  const session = store.sessions.find((s) => s.deviceId === deviceId);
  if (session && session.status === 'blocked') {
    session.status = 'logged_out';
  }

  store.auditLogs.unshift({
    id: `aud_${Date.now()}_unblock`,
    timestamp: now,
    businessId,
    branchId: found.branchId || 'general',
    branchName: found.branchName || 'Administración Central',
    deviceId,
    deviceName: found.deviceName,
    deviceType: found.deviceType,
    userRole: 'owner',
    username: unblockedBy,
    event: 'device_unblocked',
    details: `Dispositivo desbloqueado por ${unblockedBy}. Acceso restablecido.`,
  });

  writeSessionsFile(store);
  return true;
}

/**
 * Register a new device login or refresh its active state.
 * Enforces strictly MAX 2 active devices per branch.
 */
export function registerOrRefreshDeviceSession(payload: {
  deviceId: string;
  deviceName: string;
  deviceType: DeviceType;
  os: string;
  browser: string;
  ipAddress?: string;
  businessId: string;
  branchId: string;
  branchName: string;
  userRole: UserRole;
  username: string;
}): {
  session: DeviceSession;
  displacedSession?: DeviceSession;
  activeCount: number;
} {
  const store = ensureSessionsFile();
  const now = new Date().toISOString();

  // 1. Look if this exact device is already registered
  const existingIdx = store.sessions.findIndex((s) => s.deviceId === payload.deviceId);
  let displacedSession: DeviceSession | undefined = undefined;

  // 2. ENFORCE SINGLE ACTIVE SCREEN RULE FOR OWNER (MAX 1 SCREEN)
  if (payload.userRole === 'owner') {
    const activeOwnerSessions = store.sessions.filter(
      (s) =>
        s.userRole === 'owner' &&
        (s.businessId === payload.businessId || payload.businessId === 'clinica-san-rafael') &&
        s.status === 'active' &&
        s.deviceId !== payload.deviceId
    );

    if (activeOwnerSessions.length >= 1) {
      activeOwnerSessions.forEach((toDisplace) => {
        toDisplace.status = 'displaced';
        toDisplace.displacedByDeviceName = payload.deviceName;
        toDisplace.displacedAt = now;
        displacedSession = { ...toDisplace };

        store.auditLogs.unshift({
          id: `aud_${Date.now()}_disp_owner`,
          timestamp: now,
          businessId: toDisplace.businessId,
          branchId: toDisplace.branchId,
          branchName: toDisplace.branchName,
          deviceId: toDisplace.deviceId,
          deviceName: toDisplace.deviceName,
          deviceType: toDisplace.deviceType,
          userRole: 'owner',
          username: toDisplace.username,
          event: 'displaced_limit_exceeded',
          details: `Sesión de Dueño cerrada automáticamente en "${toDisplace.deviceName}" por política de 1 sola pantalla activa. Acceso transferido a "${payload.deviceName}".`,
        });
      });
    }
  } else {
    // 3. ENFORCE MAX 2 DEVICES RULE FOR BRANCH / LOCAL
    const activeBranchSessions = store.sessions.filter(
      (s) => s.branchId === payload.branchId && s.status === 'active' && s.deviceId !== payload.deviceId
    );

    if (activeBranchSessions.length >= 2) {
      activeBranchSessions.sort(
        (a, b) => new Date(a.loginAt).getTime() - new Date(b.loginAt).getTime()
      );
      const toDisplace = activeBranchSessions[0];
      toDisplace.status = 'displaced';
      toDisplace.displacedByDeviceName = payload.deviceName;
      toDisplace.displacedAt = now;
      displacedSession = { ...toDisplace };

      store.auditLogs.unshift({
        id: `aud_${Date.now()}_disp`,
        timestamp: now,
        businessId: toDisplace.businessId,
        branchId: toDisplace.branchId,
        branchName: toDisplace.branchName,
        deviceId: toDisplace.deviceId,
        deviceName: toDisplace.deviceName,
        deviceType: toDisplace.deviceType,
        userRole: toDisplace.userRole,
        username: toDisplace.username,
        event: 'displaced_limit_exceeded',
        details: `Sesión desplazada por superar límite de 2 dispositivos por sede. Nuevo dispositivo: "${payload.deviceName}".`,
      });
    }
  }

  // 4. Create or update the current device session
  let currentSession: DeviceSession;
  if (existingIdx !== -1) {
    store.sessions[existingIdx] = {
      ...store.sessions[existingIdx],
      ...payload,
      status: 'active',
      lastActiveAt: now,
      displacedByDeviceName: undefined,
      displacedAt: undefined,
    };
    currentSession = store.sessions[existingIdx];
  } else {
    currentSession = {
      ...payload,
      loginAt: now,
      lastActiveAt: now,
      status: 'active',
    };
    store.sessions.unshift(currentSession);
  }

  // Record audit event for login
  store.auditLogs.unshift({
    id: `aud_${Date.now()}_login`,
    timestamp: now,
    businessId: payload.businessId,
    branchId: payload.branchId,
    branchName: payload.branchName,
    deviceId: payload.deviceId,
    deviceName: payload.deviceName,
    deviceType: payload.deviceType,
    userRole: payload.userRole,
    username: payload.username,
    event: 'login_success',
    details: `Inicio de sesión exitoso desde ${payload.deviceName} (${payload.os} - ${payload.browser})`,
  });

  if (store.auditLogs.length > 200) {
    store.auditLogs = store.auditLogs.slice(0, 200);
  }

  writeSessionsFile(store);

  const activeCount = store.sessions.filter(
    (s) => s.branchId === payload.branchId && s.status === 'active'
  ).length;

  return { session: currentSession, displacedSession, activeCount };
}

/**
 * Request login from a new device (2FA / Handshake between devices).
 * If branch already has an active primary device, creates a pending approval request.
 * If branch has NO active device, registers directly.
 */
export function requestLoginApproval(payload: {
  deviceId: string;
  deviceName: string;
  deviceType: DeviceType;
  os: string;
  browser: string;
  ipAddress?: string;
  businessId: string;
  branchId: string;
  branchName: string;
  userRole: UserRole;
  username: string;
}): {
  requiresApproval: boolean;
  request?: LoginApprovalRequest;
  session?: DeviceSession;
  activeDeviceName?: string;
  blocked?: boolean;
  error?: string;
} {
  const store = ensureSessionsFile();
  const now = new Date().toISOString();

  // 1. Check blacklist
  if (isDeviceBlocked(payload.deviceId)) {
    return {
      requiresApproval: false,
      blocked: true,
      error: 'Este dispositivo se encuentra bloqueado por la administración central.',
    };
  }

  // 2. Owner bypass: Brand Owner never needs 2FA approval from branch devices
  if (payload.userRole === 'owner') {
    const res = registerOrRefreshDeviceSession(payload);
    return { requiresApproval: false, session: res.session };
  }

  // 3. Mark stale sessions (>10 mins without heartbeat) as logged_out so abandoned devices don't block logins
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  let updatedStore = false;
  store.sessions.forEach((s) => {
    if (s.status === 'active' && s.lastActiveAt) {
      const last = new Date(s.lastActiveAt).getTime();
      if (last < tenMinutesAgo) {
        s.status = 'logged_out';
        updatedStore = true;
      }
    }
  });
  if (updatedStore) {
    writeSessionsFile(store);
  }

  // 4. Check active sessions in this branch (excluding this same device)
  const activeBranchSessions = store.sessions.filter(
    (s) => s.branchId === payload.branchId && s.status === 'active' && s.deviceId !== payload.deviceId
  );

  // If this device ALREADY has an active session (e.g. page refreshed), just return it
  const existingActive = store.sessions.find(
    (s) => s.deviceId === payload.deviceId && s.status === 'active'
  );
  if (existingActive) {
    existingActive.lastActiveAt = now;
    writeSessionsFile(store);
    return { requiresApproval: false, session: existingActive };
  }

  // If NO active device is running in this branch, allow direct login
  if (activeBranchSessions.length === 0) {
    const res = registerOrRefreshDeviceSession(payload);
    return { requiresApproval: false, session: res.session };
  }

  // 3. Otherwise, active device exists! Require authorization handshake:
  // Clean up old requests for this device
  store.loginRequests = store.loginRequests.filter(
    (r) => r.deviceId !== payload.deviceId || r.status === 'approved'
  );

  const expiresAt = new Date(Date.now() + 60000).toISOString(); // 60 seconds
  const request: LoginApprovalRequest = {
    requestId: `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    ...payload,
    createdAt: now,
    expiresAt,
    status: 'pending',
  };

  store.loginRequests.unshift(request);

  // Log audit event
  store.auditLogs.unshift({
    id: `aud_${Date.now()}_req`,
    timestamp: now,
    businessId: payload.businessId,
    branchId: payload.branchId,
    branchName: payload.branchName,
    deviceId: payload.deviceId,
    deviceName: payload.deviceName,
    deviceType: payload.deviceType,
    userRole: payload.userRole,
    username: payload.username,
    event: 'login_request_created',
    details: `Solicitud de acceso enviada al dispositivo principal activo (${activeBranchSessions[0].deviceName})`,
  });

  writeSessionsFile(store);

  return {
    requiresApproval: true,
    request,
    activeDeviceName: activeBranchSessions[0].deviceName,
  };
}

/**
 * Check the status of a pending login request (Polled by the requesting device)
 */
export function pollLoginRequest(requestId: string): {
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  session?: DeviceSession;
  error?: string;
} {
  const store = ensureSessionsFile();
  const req = store.loginRequests.find((r) => r.requestId === requestId);

  if (!req) {
    return { status: 'expired', error: 'Solicitud no encontrada o expirada' };
  }

  const now = new Date();
  if (req.status === 'pending' && new Date(req.expiresAt) < now) {
    req.status = 'expired';
    writeSessionsFile(store);
    return { status: 'expired', error: 'La solicitud expiró sin respuesta del dispositivo principal.' };
  }

  if (req.status === 'approved') {
    const session = store.sessions.find(
      (s) => s.deviceId === req.deviceId && s.status === 'active'
    );
    return { status: 'approved', session };
  }

  return { status: req.status };
}

/**
 * Get pending login approval requests for a branch (Polled by the active device)
 */
export function getPendingRequestsForBranch(branchId: string): LoginApprovalRequest[] {
  const store = ensureSessionsFile();
  const now = new Date();

  // Expire overdue requests
  let changed = false;
  store.loginRequests.forEach((r) => {
    if (r.status === 'pending' && new Date(r.expiresAt) < now) {
      r.status = 'expired';
      changed = true;
    }
  });

  if (changed) {
    writeSessionsFile(store);
  }

  return store.loginRequests.filter(
    (r) => r.branchId === branchId && r.status === 'pending'
  );
}

/**
 * Decide a login request (Approved or Rejected by active device)
 */
export function decideLoginRequest(params: {
  requestId: string;
  decision: 'approved' | 'rejected';
  deciderDeviceId: string;
  deciderDeviceName?: string;
}): { success: boolean; session?: DeviceSession; error?: string } {
  const store = ensureSessionsFile();
  const now = new Date().toISOString();

  const req = store.loginRequests.find((r) => r.requestId === params.requestId);
  if (!req) {
    return { success: false, error: 'Solicitud no encontrada' };
  }

  if (req.status !== 'pending') {
    return { success: false, error: `La solicitud ya se encuentra ${req.status}` };
  }

  req.decidedAt = now;
  req.decidedByDeviceName = params.deciderDeviceName || 'Dispositivo Principal';

  if (params.decision === 'rejected') {
    req.status = 'rejected';

    store.auditLogs.unshift({
      id: `aud_${Date.now()}_rej`,
      timestamp: now,
      businessId: req.businessId,
      branchId: req.branchId,
      branchName: req.branchName,
      deviceId: req.deviceId,
      deviceName: req.deviceName,
      deviceType: req.deviceType,
      userRole: req.userRole,
      username: req.username,
      event: 'login_request_rejected',
      details: `Acceso denegado por ${req.decidedByDeviceName}`,
    });

    writeSessionsFile(store);
    return { success: true };
  }

  // If approved:
  req.status = 'approved';

  // 1. Register the new approved device
  const regResult = registerOrRefreshDeviceSession({
    deviceId: req.deviceId,
    deviceName: req.deviceName,
    deviceType: req.deviceType,
    os: req.os,
    browser: req.browser,
    ipAddress: req.ipAddress,
    businessId: req.businessId,
    branchId: req.branchId,
    branchName: req.branchName,
    userRole: req.userRole,
    username: req.username,
  });

  // 2. Displace the decider device session (transfer session to the newly authorized device)
  const deciderSession = store.sessions.find((s) => s.deviceId === params.deciderDeviceId);
  if (deciderSession) {
    deciderSession.status = 'displaced';
    deciderSession.displacedByDeviceName = req.deviceName;
    deciderSession.displacedAt = now;
  }

  store.auditLogs.unshift({
    id: `aud_${Date.now()}_appr`,
    timestamp: now,
    businessId: req.businessId,
    branchId: req.branchId,
    branchName: req.branchName,
    deviceId: req.deviceId,
    deviceName: req.deviceName,
    deviceType: req.deviceType,
    userRole: req.userRole,
    username: req.username,
    event: 'login_request_approved',
    details: `Acceso autorizado por ${req.decidedByDeviceName}. Sesión transferida a ${req.deviceName}.`,
  });

  writeSessionsFile(store);
  return { success: true, session: regResult.session };
}

/**
 * Check if a device session is still active or has been displaced
 */
export function verifyDeviceSessionStatus(
  deviceId: string,
  businessId: string,
  branchId?: string
): {
  isDisplaced: boolean;
  isBlocked: boolean;
  displacedByDeviceName?: string;
  displacedAt?: string;
  currentSession?: DeviceSession;
  activeSessions: DeviceSession[];
  blockedDevices: BlockedDevice[];
  auditLogs: DeviceAuditLog[];
  pendingRequests: LoginApprovalRequest[];
} {
  const store = ensureSessionsFile();
  const now = new Date().toISOString();

  const found = store.sessions.find((s) => s.deviceId === deviceId);
  const isBlocked = isDeviceBlocked(deviceId) || (found ? found.status === 'blocked' : false);

  // Update heartbeat if active and not blocked
  if (found && found.status === 'active' && !isBlocked) {
    found.lastActiveAt = now;
    writeSessionsFile(store);
  }

  const isDisplaced = found ? found.status === 'displaced' : false;

  // Filter active sessions
  const activeSessions = store.sessions.filter((s) => {
    if (s.status !== 'active') return false;
    if (branchId && branchId !== 'all') return s.branchId === branchId;
    return s.businessId === businessId || businessId === 'clinica-san-rafael';
  });

  // Pending requests for this branch
  const pendingRequests = branchId && branchId !== 'all'
    ? getPendingRequestsForBranch(branchId)
    : [];

  // Filter audit logs
  const auditLogs = store.auditLogs.filter((l) => {
    if (branchId && branchId !== 'all') return l.branchId === branchId;
    return l.businessId === businessId || businessId === 'clinica-san-rafael';
  });

  return {
    isDisplaced,
    isBlocked,
    displacedByDeviceName: found?.displacedByDeviceName,
    displacedAt: found?.displacedAt,
    currentSession: found,
    activeSessions,
    blockedDevices: store.blockedDevices,
    auditLogs,
    pendingRequests,
  };
}

/**
 * Handle explicit logout
 */
export function logoutDeviceSession(deviceId: string): void {
  const store = ensureSessionsFile();
  const now = new Date().toISOString();
  const session = store.sessions.find((s) => s.deviceId === deviceId);

  if (session) {
    session.status = 'logged_out';
    session.lastActiveAt = now;

    store.auditLogs.unshift({
      id: `aud_${Date.now()}_logout`,
      timestamp: now,
      businessId: session.businessId,
      branchId: session.branchId,
      branchName: session.branchName,
      deviceId: session.deviceId,
      deviceName: session.deviceName,
      deviceType: session.deviceType,
      userRole: session.userRole,
      username: session.username,
      event: 'logout',
      details: `Cierre voluntario de sesión en ${session.deviceName}`,
    });

    writeSessionsFile(store);
  }
}

/**
 * Remotely revoke a device session (Owner action)
 */
export function revokeDeviceSession(targetDeviceId: string, revokedBy: string): boolean {
  const store = ensureSessionsFile();
  const now = new Date().toISOString();
  const session = store.sessions.find((s) => s.deviceId === targetDeviceId);

  if (session) {
    session.status = 'displaced';
    session.displacedByDeviceName = `Revocado remotamente por ${revokedBy}`;
    session.displacedAt = now;

    store.auditLogs.unshift({
      id: `aud_${Date.now()}_revoke`,
      timestamp: now,
      businessId: session.businessId,
      branchId: session.branchId,
      branchName: session.branchName,
      deviceId: session.deviceId,
      deviceName: session.deviceName,
      deviceType: session.deviceType,
      userRole: session.userRole,
      username: session.username,
      event: 'remote_revoke',
      details: `Sesión revocada remotamente por la Administración Central (${revokedBy})`,
    });

    writeSessionsFile(store);
    return true;
  }
  return false;
}

