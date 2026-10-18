import { NextResponse } from 'next/server';
import {
  registerOrRefreshDeviceSession,
  requestLoginApproval,
  pollLoginRequest,
  decideLoginRequest,
  blockDevice,
  unblockDevice,
  verifyDeviceSessionStatus,
  logoutDeviceSession,
  revokeDeviceSession,
} from '@/lib/session-manager';
import { DeviceType } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // 1. Poll status of a login approval request
    if (action === 'poll-request') {
      const requestId = searchParams.get('requestId');
      if (!requestId) {
        return NextResponse.json({ error: 'Falta requestId' }, { status: 400 });
      }
      const pollResult = pollLoginRequest(requestId);
      return NextResponse.json({ success: true, ...pollResult });
    }

    // 2. Default: Verify heartbeat, active sessions, blocked devices, and pending requests
    const businessId = searchParams.get('businessId') || 'clinica-san-rafael';
    const branchId = searchParams.get('branchId') || undefined;
    const deviceId = searchParams.get('deviceId') || '';

    const status = verifyDeviceSessionStatus(deviceId, businessId, branchId);
    return NextResponse.json({
      success: true,
      ...status,
    });
  } catch (error) {
    console.error('Error in GET /api/portal/sessions:', error);
    return NextResponse.json({ error: 'Error verificando estado de sesión' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    // Helper: read client IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // 1. REQUEST LOGIN (2FA Handshake between devices)
    if (action === 'request-login') {
      const {
        deviceId,
        deviceName,
        deviceType,
        os,
        browser,
        businessId,
        branchId,
        branchName,
        userRole,
        username,
      } = body;

      if (!deviceId || !businessId || !branchId) {
        return NextResponse.json(
          { error: 'Faltan parámetros requeridos de dispositivo' },
          { status: 400 }
        );
      }

      const result = requestLoginApproval({
        deviceId,
        deviceName: deviceName || 'Dispositivo Desconocido',
        deviceType: (deviceType as DeviceType) || 'desktop',
        os: os || 'Desconocido',
        browser: browser || 'Navegador Web',
        ipAddress,
        businessId,
        branchId,
        branchName: branchName || 'Sede Principal',
        userRole: userRole || 'branch_manager',
        username: username || 'usuario',
      });

      return NextResponse.json({
        success: true,
        ...result,
      });
    }

    // 2. DECIDE LOGIN REQUEST (Approved or Rejected by active device)
    if (action === 'decide-request') {
      const { requestId, decision, deciderDeviceId, deciderDeviceName } = body;

      if (!requestId || !decision || !deciderDeviceId) {
        return NextResponse.json(
          { error: 'Faltan parámetros (requestId, decision, deciderDeviceId)' },
          { status: 400 }
        );
      }

      const result = decideLoginRequest({
        requestId,
        decision,
        deciderDeviceId,
        deciderDeviceName,
      });

      return NextResponse.json(result);
    }

    // 3. BLOCK DEVICE (Owner blacklist)
    if (action === 'block-device') {
      const { deviceId, deviceName, deviceType, os, browser, blockedBy, reason, branchId, branchName, businessId } = body;

      if (!deviceId) {
        return NextResponse.json({ error: 'Falta deviceId' }, { status: 400 });
      }

      const blockedEntry = blockDevice({
        deviceId,
        deviceName,
        deviceType: (deviceType as DeviceType) || 'desktop',
        os,
        browser,
        blockedBy: blockedBy || 'Administrador Central',
        reason,
        branchId,
        branchName,
        businessId,
      });

      return NextResponse.json({
        success: true,
        blockedDevice: blockedEntry,
        message: 'Dispositivo bloqueado exitosamente',
      });
    }

    // 4. UNBLOCK DEVICE (Owner removal from blacklist)
    if (action === 'unblock-device') {
      const { deviceId, unblockedBy, businessId } = body;

      if (!deviceId) {
        return NextResponse.json({ error: 'Falta deviceId' }, { status: 400 });
      }

      const unblocked = unblockDevice(deviceId, unblockedBy || 'Administrador Central', businessId);
      return NextResponse.json({
        success: unblocked,
        message: unblocked ? 'Dispositivo desbloqueado' : 'Dispositivo no encontrado en lista negra',
      });
    }

    // 5. REGISTER OR REFRESH A DEVICE SESSION DIRECTLY
    if (action === 'register') {
      const {
        deviceId,
        deviceName,
        deviceType,
        os,
        browser,
        businessId,
        branchId,
        branchName,
        userRole,
        username,
      } = body;

      if (!deviceId || !businessId || !branchId) {
        return NextResponse.json(
          { error: 'Faltan parámetros requeridos de dispositivo' },
          { status: 400 }
        );
      }

      const result = registerOrRefreshDeviceSession({
        deviceId,
        deviceName: deviceName || 'Dispositivo Desconocido',
        deviceType: (deviceType as DeviceType) || 'desktop',
        os: os || 'Desconocido',
        browser: browser || 'Navegador Web',
        ipAddress,
        businessId,
        branchId,
        branchName: branchName || 'Sede Principal',
        userRole: userRole || 'branch_manager',
        username: username || 'usuario',
      });

      return NextResponse.json({
        success: true,
        ...result,
      });
    }

    // 6. HEARTBEAT / DISPLACEMENT CHECK
    if (action === 'heartbeat') {
      const { deviceId, businessId, branchId } = body;
      if (!deviceId) {
        return NextResponse.json({ error: 'Falta deviceId' }, { status: 400 });
      }

      const status = verifyDeviceSessionStatus(
        deviceId,
        businessId || 'clinica-san-rafael',
        branchId
      );
      return NextResponse.json({
        success: true,
        ...status,
      });
    }

    // 7. EXPLICIT LOGOUT
    if (action === 'logout') {
      const { deviceId } = body;
      if (deviceId) {
        logoutDeviceSession(deviceId);
      }
      return NextResponse.json({ success: true, message: 'Sesión cerrada exitosamente' });
    }

    // 8. REMOTE REVOKE BY OWNER
    if (action === 'revoke') {
      const { targetDeviceId, revokedBy } = body;
      if (!targetDeviceId) {
        return NextResponse.json({ error: 'Falta targetDeviceId' }, { status: 400 });
      }

      const revoked = revokeDeviceSession(targetDeviceId, revokedBy || 'Administrador Central');
      return NextResponse.json({ success: revoked, message: 'Dispositivo revocado' });
    }

    return NextResponse.json({ error: 'Acción no soportada' }, { status: 400 });
  } catch (error) {
    console.error('Error in POST /api/portal/sessions:', error);
    return NextResponse.json({ error: 'Error procesando solicitud de sesión' }, { status: 500 });
  }
}

