export type BusinessPlan = 'independiente' | 'basic' | 'pro' | 'elite' | 'empresarial';
export type BusinessStatus = 'active' | 'suspended';

export interface ShiftIncident {
  id: string;
  businessId: string;
  branchId: string;
  branchName: string;
  description: string;
  registeredBy: string;
  createdAt: string;
  status: 'handled' | 'monitoring';
  staffMember?: string; // Tagged employee
  incidentType?: string; // e.g. 'attitude' | 'delay' | 'error' | 'discipline' | 'praise'
}

export interface BranchManager {
  id: string;
  name: string;
  role: string; // e.g. "Capitán de Sala & VIP", "Jefe de Barras & Coctelería", "Administrador de Turno"
  phone: string; // WhatsApp line for instant alerts
  username?: string;
  password?: string; // Personal PIN / Password
  active?: boolean;
}

export interface Branch {
  id: string; // Unique slug for the QR code (e.g. "la-burguesia-chapinero")
  name: string; // Branch name (e.g. "Sede Chapinero")
  address?: string; // Physical address
  city: string; // e.g. "Bogotá"
  locality: string; // e.g. "Chapinero"
  googleReviewUrl: string; // Specific Google Maps review link for THIS location
  managerPhone: string; // Primary WhatsApp number for instant alerts at this branch
  managerPassword?: string; // PIN or password for primary branch manager login
  managerUsername?: string; // Username / identifier for branch manager login
  managerName?: string; // Branch manager name (e.g. "Andrés Ramírez")
  managerRole?: string; // Branch manager official title (e.g. "Gerente de Sede")
  managerEmail?: string; // Official email for branch manager reports & alerts
  staffQuota?: number; // Maximum allowed collaborators for this branch (Controlled by Prestigia Master)
  managersQuota?: number; // Maximum allowed duty managers for this branch (Controlled by Prestigia Master)
  managers?: BranchManager[]; // Multi-encargados support for high-volume venues (Discotecas, Gastrobares)
  schedule?: string; // Operating schedule summary or days/hours
  scheduleWeekdays?: string; // e.g. "11:30 AM - 10:00 PM"
  scheduleWeekends?: string; // e.g. "12:00 PM - 11:00 PM"
  scheduleSaturday?: string; // e.g. "12:00 PM - 11:00 PM"
  scheduleSunday?: string; // e.g. "12:00 PM - 09:00 PM"
  scheduleHolidays?: string; // e.g. "12:00 PM - 08:00 PM"
  responseTimeSla?: string; // e.g. "< 15 min" | "< 1 hora" | "Mismo día"
  containmentMessage?: string; // Custom private containment message for 1-3★ reviews
  status: BusinessStatus; // 'active' | 'suspended'
  websiteUrl: string; // Mandatory official commercial website link
  instagramUrl?: string; // Optional Instagram profile link
  tiktokUrl?: string; // Optional TikTok profile link
  facebookUrl?: string; // Optional Facebook page link
  whatsappVipUrl?: string; // Optional WhatsApp VIP channel link
  menuUrl?: string; // Optional digital menu / portfolio link (PDF, web catalog)
  timezone?: string; // e.g. "GMT-5 (Bogotá, Lima, Quito)"
  lastAuditUpdate?: string; // Enterprise audit trail timestamp
  staffMembers?: (string | StaffMember)[]; // Pro feature: list of staff/servers
  customStaffRoles?: string[]; // Custom job titles/roles created by this business/branch
  googlePlaceId?: string; // Unique Google Maps Place ID for this physical branch
  googleBusinessStatus?: 'connected' | 'pending' | 'disconnected'; // Google API sync state
  googleManagedBy?: 'prestigia_central' | 'client_self_service'; // Operational management model
  googleAuditedAt?: string; // Master audit & certification timestamp
  baseline?: DayOneBaseline; // Optional branch-specific Day 1 historical baseline calibration
  googleAuditNotes?: string; // Technical audit notes from Master
  googleSelfServiceEnabled?: boolean; // Master switch allowing client self-service Google connection
  agreedMonthlyFeeCOP?: number; // Tarifa pactada mensual contratada para esta sede física en COP (sin planes fijos)
  agreedMonthlyFeeUSD?: number; // Tarifa pactada mensual contratada para esta sede física en USD
}

export interface StaffMember {
  name: string;
  role: string;
  joinedAt: string;
}

export interface BrandIdentity {
  logoUrl?: string;
  primaryColor?: string; // hex code e.g. '#E11D48', '#D97706', '#059669', etc.
  accentColor?: string;
}

export interface SatisfactionCampaign {
  id: string;
  businessId: string;
  branchId?: string; // Optional: if specified, applies to this branch; if undefined/'all', applies to all branches
  campaignCode?: string; // Unique campaign code, e.g. "CAMP-2026-SEP-01"
  campaignType?: 'general' | 'vip'; // 'general' = Abierta a todos, 'vip' = Exclusiva para clientes frecuentes
  duration?: '7_days' | '15_days' | '30_days' | 'custom'; // Duración de la campaña
  title: string;
  reward: string;
  winnersCount?: number; // Number of winners to draw (e.g. 1, 2, 5, 10)
  active: boolean;
  drawDate?: string;
  terms?: string;
  updatedAt?: string;
}

export interface CampaignParticipant {
  id: string;
  businessId: string;
  businessName?: string; // Nombre oficial del negocio
  country?: string; // País donde opera la sede
  city?: string; // Ciudad donde opera la sede
  locality?: string; // Localidad o Zona geográfica
  nicheCategory?: string; // Nicho / Categoría de la industria
  branchId: string;
  branchName: string;
  customerName: string;
  customerPhone: string;
  rating: number; // 1 to 5 (Calificación del cliente)
  customerComment?: string; // Opinión o reseña real expresada por el cliente
  registeredAt: string;
  attendedBy?: string; // Collaborator / server who attended the customer
  isWinner?: boolean;
  winnerNotifiedAt?: string;
  prizeWon?: string;
  prizeClaimed?: boolean;
  claimedAt?: string;
}

export interface PastGiveawayEdition {
  id: string;
  businessId: string;
  campaignCode?: string;
  campaignType?: 'general' | 'vip';
  duration?: string;
  editionMonth: string; // e.g. "Agosto 2026"
  title: string;
  reward: string;
  drawDate: string; // e.g. "31 de Agosto de 2026"
  participationPeriod: string; // e.g. "01 Ago 2026 - 31 Ago 2026"
  winnersCount: number;
  totalParticipants: number;
  winners: CampaignParticipant[];
  participants: CampaignParticipant[];
}

export interface VipLoyaltyCustomer {
  customerPhone: string;
  customerName: string;
  participationsCount: number;
  timesWon: number;
  favoriteBranch: string;
  lastParticipation: string;
  averageRating: number;
}

export interface CustomerCampaignRecord {
  campaignCode: string;
  campaignTitle: string;
  campaignType: 'general' | 'vip';
  date: string;
  status: 'invited' | 'participated' | 'winner';
  prizeWon?: string;
  branchName?: string;
}

export interface ReactivationContact {
  id: string;
  name: string;
  phone: string;
  status: 'pending' | 'invited';
  invitedAt?: string;
  invitedCampaignCode?: string;
  source?: string;
  branchId?: string;
  branchName?: string;
  daysInactive?: number; // e.g. 45, 12, 3
  visitCount?: number; // e.g. 1, 4, 8
  segment?: 'recent' | 'inactive' | 'vip';
  isVip?: boolean;
  loyaltyLevel?: 'bronze' | 'silver' | 'gold' | 'vip_platinum';
  campaignHistory?: CustomerCampaignRecord[];
}

export interface Business {
  id: string; // Brand slug or ID (e.g. "la-burguesia")
  name: string; // Commercial brand name (e.g. "La Burguesía Artesanal")
  legalName?: string; // Razón Social registrada (ej: "Inversiones Gastronómicas Gómez & Cía S.A.S.")
  taxId?: string; // NIT, CIF, RFC, RUT, EIN or Tax ID according to country
  address?: string; // Dirección principal / fiscal de la empresa
  ownerName: string; // Representante Legal o titular que firmó el contrato
  ownerPhone: string; // Owner WhatsApp / Teléfono del firmante
  contractSignerName?: string; // Quien firmó el contrato (opcional, fallback a ownerName)
  contractSignerPhone?: string; // Teléfono del firmante (opcional, fallback a ownerPhone)
  plan: BusinessPlan; // 'basic' | 'pro' | 'elite'
  status: BusinessStatus; // 'active' | 'suspended' (master status)
  trialEndsAt: string; // ISO date string
  createdAt?: string; // ISO creation timestamp
  password?: string; // For /portal owner login
  category: string; // e.g. "Hamburguesería & Gastrobar"
  country?: string; // Country code or name, e.g. 'CO', 'MX', 'ES', 'US'
  ownerEmail?: string; // Official tax & billing notification email
  supportTicketsQuota?: number; // Monthly support ticket allowance (e.g. 4 for elite, 2 for pro, 1 for basic)
  supportTicketsUsed?: number; // Number of support tickets used in the current billing cycle
  branches: Branch[]; // List of physical branches / sedes
  campaign?: SatisfactionCampaign;
  branchCampaigns?: Record<string, SatisfactionCampaign>; // Branch-specific overrides
  branding?: BrandIdentity;
  baseline?: DayOneBaseline;
  masterAddOns?: MasterAddOns;
  customStaffRoles?: string[]; // Custom job titles/roles created by this business
  agreedMonthlyFeeCOP?: number; // Tarifa mensual pactada contratada oficial de la marca en COP (sin planes fijos)
  agreedMonthlyFeeUSD?: number; // Tarifa mensual pactada contratada oficial de la marca en USD
  billingCycle?: 'monthly' | 'quarterly' | 'semiannual' | 'annual'; // Ciclo comercial pactado
  billingDay?: number; // Día del mes para corte y cobro de factura (1 al 31, default: 5)
}

export interface DayOneBaseline {
  startDate: string; // e.g. "2026-03-15"
  initialRating: number; // e.g. 3.7
  initialReviewCount: number; // e.g. 38
  initialReviews1to3?: number; // Reseñas 1-3★ previas en Google Maps el Día 1
  initialReviews4to5?: number; // Reseñas 4-5★ previas en Google Maps el Día 1
  initialRespondedReviews?: number; // Reseñas que estaban respondidas antes de Prestigia
  initialMonthlyComplaints: number; // e.g. 15
  averageTicketCOP: number; // e.g. 45000
  averageTicketUSD: number; // e.g. 18
  nicheCategory: string; // e.g. "Gastrobar / Hamburguesería Artesanal"
  city: string;
  locality: string;
  country: string;
  clientQuote?: string; // Real or AI-suggested quote
  founderName?: string;
  calibratedAt?: string; // Fecha y hora ISO de cuando se hizo la calibración
  isCalibrated?: boolean; // True si ya fue calibrado manualmente
  customMonthlyFeeCOP?: number; // Tarifa / inversión mensual acordada a la medida (sin plan fijo)
}

export interface MasterAddOns {
  extraBranches: number; // +1, +2
  extraManagers: number; // +1, +2
  extraStaffQuota: number; // +5, +10, etc.
  sentiment360: {
    enabled: boolean;
    mode: 'permanent' | 'trial';
    trialExpiresAt?: string;
  };
  liveWallboard: {
    enabled: boolean;
    mode: 'permanent' | 'trial';
    trialExpiresAt?: string;
  };
  giveawayCrm: boolean; // Enables giveaways/crm on Independiente
  deviceAudit: boolean; // Device forensics
  customNotes?: string;
}

export interface MasterSecurityAuditLog {
  id: string;
  timestamp: string;
  event: 'login_success' | 'login_failed' | 'lockout' | 'emergency_otp_dispatched' | 'emergency_otp_verified' | 'plan_changed' | 'addon_updated';
  ip?: string;
  deviceFingerprint: string;
  details: string;
}

export type FeedbackStatus = 'pending' | 'resolved';

export interface Feedback {
  id: string;
  businessId: string; // Brand ID
  businessName: string; // Brand Name
  branchId: string; // Specific Branch ID
  branchName: string; // Specific Branch Name (e.g. "Sede Chapinero")
  rating: number; // 1 to 5
  customerName: string;
  customerPhone: string; // WhatsApp
  complaintReason: string;
  attendedBy?: string; // Pro feature: "Atendido por"
  clubConsent: boolean; // Universal: Habeas Data & Club consent
  status: FeedbackStatus; // 'pending' | 'resolved'
  createdAt: string; // ISO date
  resolvedAt?: string; // ISO date
  resolvedBy?: string; // Name of who resolved it
  resolvedByRole?: UserRole; // 'owner' | 'branch_manager'
  rescueMessage?: string; // WhatsApp rescue message sent to customer
  // Inherited segmentation metadata:
  category: string;
  country?: string;
  city: string;
  locality: string;
}

export type GoogleReviewStatus = 'unanswered' | 'answered';

export interface GoogleReview {
  id: string;
  businessId: string;
  branchId: string;
  branchName: string;
  authorName: string;
  rating: number; // 1 to 5
  relativeTime: string; // e.g. "hace 2 horas"
  text: string;
  status: GoogleReviewStatus;
  replyText?: string;
  repliedAt?: string;
  repliedBy?: string; // e.g. "Andrés Ramírez (Encargado)" or "Carlos Gómez (Dueño)"
  repliedByRole?: UserRole; // 'owner' | 'branch_manager'
  createdAt?: string; // ISO date string
}

export type UserRole = 'owner' | 'branch_manager';

export interface PortalSession {
  role: UserRole;
  business: Business;
  activeBranch?: Branch;
  activeManager?: BranchManager; // Specific logged-in duty manager
}

export type DeviceType = 'desktop' | 'mobile' | 'tablet';

export interface BlockedDevice {
  deviceId: string;
  deviceName: string;
  deviceType: DeviceType;
  os?: string;
  browser?: string;
  blockedAt: string;
  blockedBy: string; // e.g. "Carlos Gómez (Dueño General)"
  reason?: string;
  branchId?: string;
  branchName?: string;
}

export interface LoginApprovalRequest {
  requestId: string;
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
  createdAt: string;
  expiresAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  decidedAt?: string;
  decidedByDeviceName?: string;
}

export interface DeviceSession {
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
  loginAt: string;
  lastActiveAt: string;
  status: 'active' | 'displaced' | 'logged_out' | 'blocked';
  displacedByDeviceName?: string;
  displacedAt?: string;
  isBlocked?: boolean;
}

export interface DeviceAuditLog {
  id: string;
  timestamp: string;
  businessId: string;
  branchId: string;
  branchName: string;
  deviceId: string;
  deviceName: string;
  deviceType: DeviceType;
  userRole: UserRole;
  username: string;
  event:
    | 'login_success'
    | 'session_active'
    | 'displaced_limit_exceeded'
    | 'logout'
    | 'remote_revoke'
    | 'login_request_created'
    | 'login_request_approved'
    | 'login_request_rejected'
    | 'login_request_expired'
    | 'device_blocked'
    | 'device_unblocked';
  details: string;
}

export interface PrestigiaNiche {
  id: string;
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  keywords: string[];
}

export const PRESTIGIA_NICHES: PrestigiaNiche[] = [
  {
    id: 'gastro',
    label: 'Gastronomía, Bares & Café',
    shortLabel: 'Gastronomía & Bares',
    icon: '🍔',
    color: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    keywords: ['gastro', 'hamburguesa', 'restaurante', 'café', 'cafe', 'comida', 'gastrobar', 'bares', 'cantina', 'pub', 'cervecería', 'cerveceria', 'pizzería', 'pizzeria', 'panadería', 'panaderia', 'repostería', 'coctel'],
  },
  {
    id: 'salud',
    label: 'Salud, Médica & Odontología',
    shortLabel: 'Salud & Médica',
    icon: '🩺',
    color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    keywords: ['salud', 'médic', 'medic', 'dental', 'odontolog', 'doctor', 'hospital', 'ips', 'eps', 'fisioterapia', 'laboratorio clínico', 'laboratorio clinico', 'pediatría', 'pediatria'],
  },
  {
    id: 'auto',
    label: 'Automotriz, Detailing & Talleres',
    shortLabel: 'Automotriz & Detailing',
    icon: '🚗',
    color: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    keywords: ['auto', 'detailing', 'taller', 'mecánic', 'mecanic', 'vehículo', 'vehiculo', 'concesionario', 'lavado', 'llantas', 'parqueadero'],
  },
  {
    id: 'hotel',
    label: 'Hotelería, Turismo & Experiencias',
    shortLabel: 'Hotelería & Turismo',
    icon: '🏨',
    color: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    keywords: ['hotel', 'turismo', 'hostal', 'resort', 'spa', 'viajes', 'glamping', 'alojamiento', 'hospedaje', 'agencia de viajes'],
  },
  {
    id: 'belleza',
    label: 'Belleza, Barberías & Estética',
    shortLabel: 'Belleza & Barbería',
    icon: '✂️',
    color: 'bg-pink-500/10 text-pink-300 border-pink-500/30',
    keywords: ['belleza', 'barbería', 'barberia', 'barbero', 'estética', 'estetica', 'peluquería', 'peluqueria', 'uñas', 'cejas', 'pestañas', 'spa capilar', 'salón de belleza', 'salon'],
  },
  {
    id: 'fitness',
    label: 'Fitness, Gimnasios & Deportes',
    shortLabel: 'Fitness & Deportes',
    icon: '🏋️',
    color: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
    keywords: ['fitness', 'gym', 'gimnasio', 'deporte', 'crossfit', 'yoga', 'pilates', 'cancha', 'entrenamiento', 'marciales'],
  },
  {
    id: 'mascotas',
    label: 'Mascotas & Clínicas Veterinarias',
    shortLabel: 'Mascotas & Veterinaria',
    icon: '🐾',
    color: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
    keywords: ['mascota', 'veterinaria', 'veterinario', 'pet', 'perro', 'gato', 'canina', 'guardería canina', 'grooming', 'clínica veterinaria', 'clinica veterinaria', 'spa canino'],
  },
  {
    id: 'retail',
    label: 'Comercio Minorista / Retail & Tiendas',
    shortLabel: 'Retail & Tiendas',
    icon: '🛍️',
    color: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    keywords: ['retail', 'tienda', 'comercio', 'moda', 'ropa', 'joyería', 'joyeria', 'calzado', 'boutique', 'accesorios', 'supermercado'],
  },
  {
    id: 'servicios',
    label: 'Servicios Profesionales & Legales',
    shortLabel: 'Servicios & Consultoría',
    icon: '⚖️',
    color: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    keywords: ['servicio', 'legal', 'abogad', 'contador', 'contabilidad', 'consultor', 'notaría', 'notaria', 'asesoría', 'asesoria', 'agencia', 'seguros'],
  },
  {
    id: 'inmobiliaria',
    label: 'Inmobiliaria, Hogar & Construcción',
    shortLabel: 'Inmobiliaria & Hogar',
    icon: '🏠',
    color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    keywords: ['inmobiliaria', 'hogar', 'construcción', 'construccion', 'diseño', 'arquitectura', 'remodelación', 'remodelacion', 'muebles', 'decoración'],
  },
  {
    id: 'educacion',
    label: 'Educación, Academias & Cursos',
    shortLabel: 'Educación & Cursos',
    icon: '🎓',
    color: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    keywords: ['educación', 'educacion', 'academia', 'colegio', 'idiomas', 'curso', 'escuela', 'universidad', 'instituto', 'capacitación'],
  },
  {
    id: 'entretenimiento',
    label: 'Entretenimiento, Eventos & Ocio',
    shortLabel: 'Entretenimiento & Ocio',
    icon: '🎭',
    color: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
    keywords: ['entretenimiento', 'evento', 'discoteca', 'club', 'fiesta', 'ocio', 'concierto', 'cine', 'parque', 'teatro', 'recreación'],
  },
];

export interface CommercialLead {
  id: string;
  fullName: string;
  businessName: string;
  category: string;
  phone: string;
  email?: string;
  city: string;
  branchCount: string;
  notes?: string;
  preferredTime?: string; // Horario preferido para la llamada estratégica (ej: Mañana, Tarde, Noche)
  primaryGoal?: string; // Meta de crecimiento del negocio
  createdAt: string;
  status: 'new' | 'contacted' | 'negotiating' | 'won' | 'dismissed';
  ip?: string;
  country?: string;
  countryCode?: string;
  device?: string;
}

export interface TrafficVisit {
  id: string;
  timestamp: string;
  ip: string;
  country: string;
  countryCode: string;
  city: string;
  region?: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  deviceBrand?: string;
  os: string;
  browser: string;
  path: string;
  referrer?: string;
  action?: string;
}
