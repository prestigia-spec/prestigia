export interface CountryDialInfo {
  code: string; // ISO 3166-1 alpha-2
  name: string; // Spanish name
  nameEn: string; // English name
  dialCode: string; // with leading +
  flag: string; // Emoji
  minDigits: number; // local number min length
  maxDigits: number; // local number max length
  example: string; // format hint
}

export const COUNTRIES: CountryDialInfo[] = [
  // 1. Prioritarios solicitados por el usuario
  { code: 'CO', name: 'Colombia', nameEn: 'Colombia', dialCode: '+57', flag: '🇨🇴', minDigits: 10, maxDigits: 10, example: '300 123 4567' },
  { code: 'CL', name: 'Chile', nameEn: 'Chile', dialCode: '+56', flag: '🇨🇱', minDigits: 9, maxDigits: 9, example: '9 1234 5678' },
  { code: 'US', name: 'Estados Unidos', nameEn: 'United States', dialCode: '+1', flag: '🇺🇸', minDigits: 10, maxDigits: 10, example: '305 123 4567' },
  { code: 'MX', name: 'México', nameEn: 'Mexico', dialCode: '+52', flag: '🇲🇽', minDigits: 10, maxDigits: 10, example: '55 1234 5678' },
  { code: 'AR', name: 'Argentina', nameEn: 'Argentina', dialCode: '+54', flag: '🇦🇷', minDigits: 10, maxDigits: 11, example: '9 11 1234 5678' },
  { code: 'VE', name: 'Venezuela', nameEn: 'Venezuela', dialCode: '+58', flag: '🇻🇪', minDigits: 10, maxDigits: 10, example: '412 123 4567' },
  { code: 'ES', name: 'España', nameEn: 'Spain', dialCode: '+34', flag: '🇪🇸', minDigits: 9, maxDigits: 9, example: '612 345 678' },

  // 2. Iberoamérica y el Caribe
  { code: 'PE', name: 'Perú', nameEn: 'Peru', dialCode: '+51', flag: '🇵🇪', minDigits: 9, maxDigits: 9, example: '912 345 678' },
  { code: 'EC', name: 'Ecuador', nameEn: 'Ecuador', dialCode: '+593', flag: '🇪🇨', minDigits: 9, maxDigits: 9, example: '99 123 4567' },
  { code: 'PA', name: 'Panamá', nameEn: 'Panama', dialCode: '+507', flag: '🇵🇦', minDigits: 8, maxDigits: 8, example: '6123 4567' },
  { code: 'CR', name: 'Costa Rica', nameEn: 'Costa Rica', dialCode: '+506', flag: '🇨🇷', minDigits: 8, maxDigits: 8, example: '8123 4567' },
  { code: 'DO', name: 'Rep. Dominicana', nameEn: 'Dominican Rep.', dialCode: '+1', flag: '🇩🇴', minDigits: 10, maxDigits: 10, example: '809 123 4567' },
  { code: 'BR', name: 'Brasil', nameEn: 'Brazil', dialCode: '+55', flag: '🇧🇷', minDigits: 10, maxDigits: 11, example: '11 91234 5678' },
  { code: 'UY', name: 'Uruguay', nameEn: 'Uruguay', dialCode: '+598', flag: '🇺🇾', minDigits: 8, maxDigits: 9, example: '99 123 456' },
  { code: 'BO', name: 'Bolivia', nameEn: 'Bolivia', dialCode: '+591', flag: '🇧🇴', minDigits: 8, maxDigits: 8, example: '7123 4567' },
  { code: 'PY', name: 'Paraguay', nameEn: 'Paraguay', dialCode: '+595', flag: '🇵🇾', minDigits: 9, maxDigits: 9, example: '981 123 456' },
  { code: 'CA', name: 'Canadá', nameEn: 'Canada', dialCode: '+1', flag: '🇨🇦', minDigits: 10, maxDigits: 10, example: '416 123 4567' },

  // 3. Europa y Global
  { code: 'FR', name: 'Francia', nameEn: 'France', dialCode: '+33', flag: '🇫🇷', minDigits: 9, maxDigits: 9, example: '6 12 34 56 78' },
  { code: 'DE', name: 'Alemania', nameEn: 'Germany', dialCode: '+49', flag: '🇩🇪', minDigits: 10, maxDigits: 11, example: '151 1234 5678' },
  { code: 'IT', name: 'Italia', nameEn: 'Italy', dialCode: '+39', flag: '🇮🇹', minDigits: 9, maxDigits: 10, example: '312 345 6789' },
  { code: 'GB', name: 'Reino Unido', nameEn: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', minDigits: 10, maxDigits: 10, example: '7123 456789' },
  { code: 'PT', name: 'Portugal', nameEn: 'Portugal', dialCode: '+351', flag: '🇵🇹', minDigits: 9, maxDigits: 9, example: '912 345 678' },
  { code: 'CH', name: 'Suiza', nameEn: 'Switzerland', dialCode: '+41', flag: '🇨🇭', minDigits: 9, maxDigits: 9, example: '78 123 45 67' },
  { code: 'NL', name: 'Países Bajos', nameEn: 'Netherlands', dialCode: '+31', flag: '🇳🇱', minDigits: 9, maxDigits: 9, example: '6 12345678' },
];

export const DEFAULT_COUNTRY = COUNTRIES[0]; // Colombia por defecto para La Burguesía

/**
 * Normaliza un número telefónico al estándar universal ITU-T E.164
 * Si ya incluye el dialCode no lo duplica.
 */
export function toE164Phone(dialCode: string, localNumber: string): string {
  const cleanDial = dialCode.replace(/[^0-9]/g, '');
  const cleanLocal = localNumber.replace(/[^0-9]/g, '');

  if (cleanLocal.startsWith(cleanDial)) {
    return `+${cleanLocal}`;
  }

  // En Argentina, para WhatsApp móvil muchas veces se agrega 9 tras el 54 si no está presente
  if (cleanDial === '54' && !cleanLocal.startsWith('9')) {
    return `+549${cleanLocal}`;
  }

  return `+${cleanDial}${cleanLocal}`;
}

/**
 * Valida si un número telefónico cumple con las reglas del país o con el estándar general E.164
 */
export function validatePhoneNumber(
  country: CountryDialInfo,
  localNumber: string,
  isEn: boolean = false
): { valid: boolean; error?: string } {
  const digits = localNumber.replace(/[^0-9]/g, '');

  if (!digits) {
    return {
      valid: false,
      error: isEn ? 'Phone number is required' : 'El número de teléfono es obligatorio',
    };
  }

  // Regla específica para Colombia: celulares inician por 3 y tienen 10 dígitos
  if (country.code === 'CO') {
    if (digits.length !== 10) {
      return {
        valid: false,
        error: isEn
          ? `Colombian mobile number must be 10 digits (currently ${digits.length})`
          : `El celular en Colombia debe tener 10 dígitos (actualmente tiene ${digits.length})`,
      };
    }
    if (!digits.startsWith('3')) {
      return {
        valid: false,
        error: isEn
          ? 'Colombian mobile number must start with 3 (e.g. 300 123 4567)'
          : 'El número celular en Colombia debe iniciar por 3 (ej: 300 123 4567)',
      };
    }
  } else {
    // Reglas para otros países según minDigits y maxDigits
    if (digits.length < country.minDigits || digits.length > country.maxDigits) {
      return {
        valid: false,
        error: isEn
          ? `Valid phone for ${country.nameEn} must have between ${country.minDigits} and ${country.maxDigits} digits (example: ${country.example})`
          : `El teléfono para ${country.name} debe tener entre ${country.minDigits} y ${country.maxDigits} dígitos (ej: ${country.example})`,
      };
    }
  }

  return { valid: true };
}

/**
 * Genera el enlace oficial de WhatsApp internacional sin símbolos ni espacios
 */
export function generateWhatsAppLink(fullPhone: string, message: string = ''): string {
  const cleanDigits = fullPhone.replace(/[^0-9]/g, '');
  if (!cleanDigits) return '#';
  const textParam = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${cleanDigits}${textParam}`;
}

export function getCountryByCode(code: string): CountryDialInfo {
  return COUNTRIES.find((c) => c.code === code) || DEFAULT_COUNTRY;
}

/**
 * Detecta automáticamente el país del usuario en el navegador
 * mediante su zona horaria IANA y la configuración de idioma local.
 * Cero latencia, cero APIs externas, funciona offline y 100% privado.
 */
export function detectUserCountry(fallbackCode: string = 'CO'): CountryDialInfo {
  if (typeof window === 'undefined') {
    return getCountryByCode(fallbackCode);
  }

  try {
    // 1. Detección por IANA Timezone (el método más preciso, nativo del dispositivo)
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase();
    
    if (tz.includes('santiago') || tz.includes('easter')) return getCountryByCode('CL');
    if (tz.includes('bogota') || tz.includes('bogotá')) return getCountryByCode('CO');
    if (tz.includes('mexico') || tz.includes('cancun') || tz.includes('monterrey') || tz.includes('tijuana') || tz.includes('merida') || tz.includes('chihuahua') || tz.includes('hermosillo')) return getCountryByCode('MX');
    if (tz.includes('argentina') || tz.includes('buenos_aires') || tz.includes('cordoba') || tz.includes('rosario') || tz.includes('mendoza')) return getCountryByCode('AR');
    if (tz.includes('caracas')) return getCountryByCode('VE');
    if (tz.includes('madrid') || tz.includes('canary')) return getCountryByCode('ES');
    if (tz.includes('lima')) return getCountryByCode('PE');
    if (tz.includes('guayaquil')) return getCountryByCode('EC');
    if (tz.includes('panama')) return getCountryByCode('PA');
    if (tz.includes('costa_rica')) return getCountryByCode('CR');
    if (tz.includes('santo_domingo')) return getCountryByCode('DO');
    if (tz.includes('sao_paulo') || tz.includes('rio_branco') || tz.includes('manaus') || tz.includes('belem') || tz.includes('recife')) return getCountryByCode('BR');
    if (tz.includes('montevideo')) return getCountryByCode('UY');
    if (tz.includes('la_paz')) return getCountryByCode('BO');
    if (tz.includes('asuncion')) return getCountryByCode('PY');
    if (tz.includes('new_york') || tz.includes('chicago') || tz.includes('los_angeles') || tz.includes('denver') || tz.includes('phoenix') || tz.includes('detroit') || tz.includes('anchorage') || tz.includes('honolulu')) return getCountryByCode('US');
    if (tz.includes('toronto') || tz.includes('vancouver') || tz.includes('montreal') || tz.includes('edmonton') || tz.includes('winnipeg')) return getCountryByCode('CA');
    if (tz.includes('paris')) return getCountryByCode('FR');
    if (tz.includes('berlin')) return getCountryByCode('DE');
    if (tz.includes('rome')) return getCountryByCode('IT');
    if (tz.includes('london')) return getCountryByCode('GB');
    if (tz.includes('lisbon')) return getCountryByCode('PT');
    if (tz.includes('zurich')) return getCountryByCode('CH');
    if (tz.includes('amsterdam')) return getCountryByCode('NL');

    // 2. Detección secundaria por configuración regional del navegador (ej: es-CL, es-MX, es-AR, es-CO)
    const lang = (navigator.language || (navigator.languages && navigator.languages[0]) || '').toUpperCase();
    if (lang.includes('-CL')) return getCountryByCode('CL');
    if (lang.includes('-CO')) return getCountryByCode('CO');
    if (lang.includes('-MX')) return getCountryByCode('MX');
    if (lang.includes('-AR')) return getCountryByCode('AR');
    if (lang.includes('-VE')) return getCountryByCode('VE');
    if (lang.includes('-ES')) return getCountryByCode('ES');
    if (lang.includes('-PE')) return getCountryByCode('PE');
    if (lang.includes('-EC')) return getCountryByCode('EC');
    if (lang.includes('-US')) return getCountryByCode('US');
  } catch (e) {
    console.warn('Error detecting user country:', e);
  }

  return getCountryByCode(fallbackCode);
}
