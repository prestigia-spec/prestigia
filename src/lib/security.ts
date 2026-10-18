/**
 * PRESTIGIA SECURITY & ANTI-FRAUD MODULE
 * Cuádruple Blindaje de Seguridad:
 * 1. Rate Limiting de IP (Bloqueo estricto de 24 Horas)
 * 2. Unicidad de Teléfono por Sorteo (1 Ticket por WhatsApp)
 * 3. Enfriamiento de Quejas por Teléfono (Anti-Spam)
 * 4. Sanitización XSS / Inyección de Código
 * 5. Geolocalización (Cálculo de Distancia Haversine en Sala)
 */

interface IpRecord {
  lastActionAt: number; // timestamp
  actionType: 'feedback' | 'campaign';
}

// Almacenamiento en memoria para Rate Limiting de IPs (24 horas = 86,400,000 ms)
const IP_RECORDS: Map<string, IpRecord[]> = new Map();
const COOLDOWN_24H_MS = 24 * 60 * 60 * 1000;

/**
 * Obtiene la dirección IP real del cliente desde las cabeceras HTTP
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

/**
 * Verifica si una IP tiene permitido realizar una acción (Regla de 24 Horas)
 */
export function checkIpRateLimit(
  ip: string,
  actionType: 'feedback' | 'campaign'
): { allowed: boolean; remainingHours?: number } {
  // En local/desarrollo permitimos pruebas sin bloqueo por IP para agilizar tests del dueño
  if (
    process.env.NODE_ENV !== 'production' ||
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip === 'localhost' ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.')
  ) {
    return { allowed: true };
  }

  const now = Date.now();
  const records = IP_RECORDS.get(ip) || [];

  // Filtrar registros de menos de 24 horas para este tipo de acción
  const recentAction = records.find(
    (r) => r.actionType === actionType && now - r.lastActionAt < COOLDOWN_24H_MS
  );

  if (recentAction) {
    const elapsedMs = now - recentAction.lastActionAt;
    const remainingHours = Math.ceil((COOLDOWN_24H_MS - elapsedMs) / (1000 * 60 * 60));
    return { allowed: false, remainingHours };
  }

  return { allowed: true };
}

/**
 * Registra una acción exitosa para una IP
 */
export function recordIpAction(ip: string, actionType: 'feedback' | 'campaign'): void {
  const now = Date.now();
  const records = IP_RECORDS.get(ip) || [];
  records.push({ lastActionAt: now, actionType });
  IP_RECORDS.set(ip, records);
}

/**
 * Sanitiza texto para prevenir inyecciones XSS y código malicioso
 */
export function sanitizeInput(text: string): string {
  if (!text) return '';
  return text
    .replace(/<[^>]*>?/gm, '') // Elimina etiquetas HTML
    .replace(/[<>"'&;]/g, '') // Elimina caracteres de escape peligrosos
    .trim();
}

/**
 * Valida la distancia geográfica (fórmula Haversine) entre el cliente y el local
 * @returns distancia en metros
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Radio de la Tierra en metros
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distancia en metros
}

/**
 * CONTROL ANTI-FUERZA BRUTA PARA EL LOGIN DEL PORTAL
 * 5 intentos fallidos consecutivos = Bloqueo total hasta que el SuperAdmin desbloquee.
 */
interface LoginAttemptRecord {
  failedAttempts: number;
  isLocked: boolean;
  lockedAt?: string;
}

const LOGIN_ATTEMPTS: Map<string, LoginAttemptRecord> = new Map();

/**
 * Consulta el estado de seguridad de una cuenta antes de permitir el intento de login
 */
export function checkLoginSecurity(identifier: string): {
  isLocked: boolean;
  failedAttempts: number;
  remainingAttempts: number;
} {
  const key = identifier.toLowerCase().trim();
  const record = LOGIN_ATTEMPTS.get(key) || { failedAttempts: 0, isLocked: false };
  const remainingAttempts = Math.max(0, 5 - record.failedAttempts);

  return {
    isLocked: record.isLocked,
    failedAttempts: record.failedAttempts,
    remainingAttempts,
  };
}

/**
 * Registra un intento fallido de contraseña. Si llega a 5, bloquea la cuenta.
 */
export function recordFailedLogin(identifier: string): {
  isLocked: boolean;
  failedAttempts: number;
  remainingAttempts: number;
} {
  const key = identifier.toLowerCase().trim();
  const record = LOGIN_ATTEMPTS.get(key) || { failedAttempts: 0, isLocked: false };

  record.failedAttempts += 1;
  if (record.failedAttempts >= 5) {
    record.isLocked = true;
    record.lockedAt = new Date().toISOString();
  }

  LOGIN_ATTEMPTS.set(key, record);
  const remainingAttempts = Math.max(0, 5 - record.failedAttempts);

  return {
    isLocked: record.isLocked,
    failedAttempts: record.failedAttempts,
    remainingAttempts,
  };
}

/**
 * Restablece los intentos tras un login exitoso
 */
export function resetLoginAttempts(identifier: string): void {
  const key = identifier.toLowerCase().trim();
  LOGIN_ATTEMPTS.delete(key);
}

/**
 * Desbloqueo oficial por el SuperAdmin desde la app de gestión principal
 */
export function unlockAccountBySuperAdmin(identifier: string): boolean {
  const key = identifier.toLowerCase().trim();
  LOGIN_ATTEMPTS.delete(key);
  return true;
}

/**
 * Sanitiza valores para exportaciones CSV/Excel evitando inyección de fórmulas
 */
export function sanitizeCsvField(field: string | number | undefined | null): string {
  if (field === null || field === undefined) return '';
  const str = String(field).trim();
  // Si empieza por caracteres de fórmula en Excel (=, +, -, @, tab, retorno), se neutraliza con comilla simple
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  return str.replace(/"/g, '""'); // Escapar comillas dobles
}

/**
 * Normaliza enlaces de redes sociales y WhatsApp
 * Si el usuario escribe '@mi_marca' o 'mi_marca' o una ruta directa,
 * lo convierte a una URL HTTPS completa y válida para que nunca falle en el QR.
 */
export function normalizeSocialUrl(
  platform: 'instagram' | 'tiktok' | 'facebook' | 'whatsapp',
  input: string
): string {
  const trimmed = (input || '').trim();
  if (!trimmed) return '';

  if (platform === 'instagram') {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    const clean = trimmed.replace(/^@/, '').replace(/^instagram\.com\//, '').replace(/^\/+/, '');
    return `https://instagram.com/${clean}`;
  }

  if (platform === 'tiktok') {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    const clean = trimmed.replace(/^@/, '').replace(/^tiktok\.com\/@?/, '').replace(/^\/+/, '');
    return `https://tiktok.com/@${clean}`;
  }

  if (platform === 'facebook') {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    const clean = trimmed.replace(/^@/, '').replace(/^facebook\.com\//, '').replace(/^\/+/, '');
    return `https://facebook.com/${clean}`;
  }

  if (platform === 'whatsapp') {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    if (trimmed.includes('chat.whatsapp.com')) {
      return `https://${trimmed.replace(/^https?:\/\//, '')}`;
    }
    if (trimmed.includes('wa.me')) {
      return `https://${trimmed.replace(/^https?:\/\//, '')}`;
    }
    const digitsOnly = trimmed.replace(/\D/g, '');
    if (digitsOnly.length >= 7) {
      return `https://wa.me/${digitsOnly}`;
    }
    return trimmed;
  }

  return trimmed;
}

/**
 * Sanitiza nombres de colaboradores evitando etiquetas HTML o scripts
 */
export function sanitizeStaffName(name: string): string {
  return (name || '')
    .replace(/<[^>]*>?/gm, '')
    .replace(/[<>"'&]/g, '')
    .trim()
    .slice(0, 50);
}

