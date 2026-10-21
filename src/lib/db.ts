import fs from 'fs';
import path from 'path';
import {
  Business,
  Branch,
  Feedback,
  BusinessStatus,
  GoogleReview,
  UserRole,
  ShiftIncident,
  SatisfactionCampaign,
  CampaignParticipant,
  BrandIdentity,
  FeedbackStatus,
  CommercialLead,
  TrafficVisit,
} from './types';

const IS_SERVERLESS = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DATA_DIR = IS_SERVERLESS ? path.join('/tmp', 'prestigia-data') : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const SEED_DB_FILE = path.join(process.cwd(), 'data', 'db.json');

// In-process memory singleton cache to ensure immediate consistency
let memoryDb: DatabaseSchema | null = null;

interface DatabaseSchema {
  businesses: Business[];
  feedbacks: Feedback[];
  googleReviews: GoogleReview[];
  incidents: ShiftIncident[];
  campaignParticipants?: CampaignParticipant[];
  masterSecurity?: MasterSecurityConfig;
  leads?: CommercialLead[];
  trafficVisits?: TrafficVisit[];
}

export interface MasterSecurityConfig {
  masterKey: string;
  emergencyPhone: string;
  emergencyEmail: string;
  totpSecret?: string;
  twoFactorEnabled?: boolean;
  activeOtp?: {
    code: string;
    expiresAt: number;
    phone: string;
    email: string;
    consumed: boolean;
  };
  updatedAt: string;
}

function ensureDbFile(): DatabaseSchema {
  if (memoryDb) {
    return memoryDb;
  }

  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {}
  }

  // In serverless, populate /tmp/prestigia-data/db.json from the seed db.json bundled with the build
  if (IS_SERVERLESS && !fs.existsSync(DB_FILE) && fs.existsSync(SEED_DB_FILE)) {
    try {
      const seedRaw = fs.readFileSync(SEED_DB_FILE, 'utf-8');
      fs.writeFileSync(DB_FILE, seedRaw, 'utf-8');
    } catch (e) {
      console.error('Error seeding serverless db:', e);
    }
  }

  const fileToRead = fs.existsSync(DB_FILE) ? DB_FILE : SEED_DB_FILE;

  if (fs.existsSync(fileToRead)) {
    try {
      const raw = fs.readFileSync(fileToRead, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!parsed.googleReviews) parsed.googleReviews = [];
      if (!parsed.incidents) parsed.incidents = [];
      if (!parsed.campaignParticipants) parsed.campaignParticipants = [];
      if (!parsed.leads) parsed.leads = [];
      if (!parsed.trafficVisits) parsed.trafficVisits = [];
      memoryDb = parsed;
      return memoryDb!;
    } catch (err) {
      console.error('Error reading db.json:', err);
    }
  }

  const emptyData: DatabaseSchema = { businesses: [], feedbacks: [], googleReviews: [], incidents: [] };
  memoryDb = emptyData;
  return emptyData;
}

function writeDbFile(data: DatabaseSchema): void {
  memoryDb = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err: any) {
    console.warn('[DB] writeDbFile warning:', err?.message);
  }
}

/**
 * Resolves a QR scan by either Branch ID (e.g. 'la-burguesia-chapinero') or Brand ID (e.g. 'la-burguesia')
 */
export async function getBranchOrBusiness(
  idOrSlug: string
): Promise<{ business: Business; branch: Branch } | null> {
  const db = ensureDbFile();
  const target = idOrSlug.toLowerCase().trim();

  // 1. Look for direct branch ID match
  for (const business of db.businesses) {
    if (business.branches && business.branches.length > 0) {
      const foundBranch = business.branches.find(
        (br) => br.id.toLowerCase() === target
      );
      if (foundBranch) {
        return { business, branch: foundBranch };
      }
    }
  }

  // 2. Fallback: Check if target matches brand ID, return its first branch
  const foundBusiness = db.businesses.find(
    (b) => b.id.toLowerCase() === target
  );
  if (foundBusiness && foundBusiness.branches && foundBusiness.branches.length > 0) {
    return { business: foundBusiness, branch: foundBusiness.branches[0] };
  }

  return null;
}

export async function getBusinessById(id: string): Promise<Business | null> {
  const db = ensureDbFile();
  const business = db.businesses.find(
    (b) => b.id.toLowerCase() === id.toLowerCase().trim()
  );
  return business || null;
}

export async function getAllBusinesses(): Promise<Business[]> {
  const db = ensureDbFile();
  return db.businesses;
}

export async function saveBusiness(business: Business): Promise<void> {
  const db = ensureDbFile();
  const index = db.businesses.findIndex((b) => b.id === business.id);
  if (index >= 0) {
    db.businesses[index] = business;
  } else {
    db.businesses.push(business);
  }
  writeDbFile(db);
}

export async function updateBusinessStatus(
  id: string,
  status: BusinessStatus
): Promise<void> {
  const db = ensureDbFile();
  const business = db.businesses.find((b) => b.id === id);
  if (business) {
    business.status = status;
    writeDbFile(db);
  }
}

export async function createFeedback(
  data: Omit<Feedback, 'id' | 'createdAt' | 'status'> & { staffAttended?: string; status?: FeedbackStatus }
): Promise<Feedback> {
  const db = ensureDbFile();
  const attendedBy = data.attendedBy || data.staffAttended;
  const newFeedback: Feedback = {
    ...data,
    attendedBy,
    id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    status: data.status || (Number(data.rating) >= 4 ? 'resolved' : 'pending'),
    createdAt: new Date().toISOString(),
  };

  db.feedbacks.unshift(newFeedback);
  writeDbFile(db);
  return newFeedback;
}

export async function getFeedbacksByBusinessId(
  businessId: string,
  branchId?: string
): Promise<Feedback[]> {
  const db = ensureDbFile();
  return db.feedbacks
    .filter((f) => {
      if (f.businessId !== businessId) return false;
      if (branchId && branchId !== 'all' && f.branchId !== branchId) return false;
      return true;
    })
    .map((f) => ({
      ...f,
      attendedBy: f.attendedBy || (f as any).staffAttended,
    }));
}

export async function updateFeedbackStatus(
  id: string,
  status: 'pending' | 'resolved',
  resolvedBy?: string,
  resolvedByRole?: UserRole,
  rescueMessage?: string
): Promise<boolean> {
  const db = ensureDbFile();
  const item = db.feedbacks.find((f) => f.id === id);
  if (item) {
    item.status = status;
    if (status === 'resolved') {
      item.resolvedAt = new Date().toISOString();
      if (resolvedBy) item.resolvedBy = resolvedBy;
      if (resolvedByRole) item.resolvedByRole = resolvedByRole;
      if (rescueMessage) item.rescueMessage = rescueMessage;
    }
    writeDbFile(db);
    return true;
  }
  return false;
}

export async function getGoogleReviews(
  businessId: string,
  branchId?: string
): Promise<GoogleReview[]> {
  const db = ensureDbFile();
  return db.googleReviews.filter((r) => {
    if (r.businessId !== businessId) return false;
    if (branchId && branchId !== 'all' && r.branchId !== branchId) return false;
    return true;
  });
}

export async function updateGoogleReviewReply(
  reviewId: string,
  replyText: string,
  repliedBy?: string,
  repliedByRole?: UserRole
): Promise<boolean> {
  const db = ensureDbFile();
  const review = db.googleReviews.find((r) => r.id === reviewId);
  if (review) {
    review.status = 'answered';
    review.replyText = replyText;
    review.repliedAt = new Date().toISOString();
    if (repliedBy) review.repliedBy = repliedBy;
    if (repliedByRole) review.repliedByRole = repliedByRole;
    writeDbFile(db);
    return true;
  }
  return false;
}

export async function getAllFeedbacks(): Promise<Feedback[]> {
  const db = ensureDbFile();
  return db.feedbacks.map((f) => ({
    ...f,
    attendedBy: f.attendedBy || (f as any).staffAttended,
  }));
}

export async function getShiftIncidents(
  businessId: string,
  branchId?: string
): Promise<ShiftIncident[]> {
  const db = ensureDbFile();
  const rawIncidents = [
    ...(db.incidents || []),
    ...((db as any).shiftIncidents || [])
  ];

  const seenIds = new Set<string>();
  const merged: ShiftIncident[] = [];

  for (const inc of rawIncidents) {
    if (!inc || !inc.id || seenIds.has(inc.id)) continue;
    seenIds.add(inc.id);
    merged.push({
      id: inc.id,
      businessId: inc.businessId || businessId,
      branchId: inc.branchId || 'main',
      branchName: inc.branchName || 'Sede Principal',
      description: inc.description || (inc as any).title || 'Novedad de turno',
      registeredBy: inc.registeredBy || (inc as any).authorName || 'Encargado de Turno',
      createdAt: inc.createdAt || new Date().toISOString(),
      status: inc.status || 'handled',
      staffMember: inc.staffMember || (inc as any).authorName || undefined,
      incidentType: inc.incidentType || (inc as any).type || undefined,
    });
  }

  return merged.filter((inc) => {
    if (inc.businessId !== businessId) return false;
    if (branchId && branchId !== 'all' && inc.branchId !== branchId) return false;
    return true;
  });
}

export async function createShiftIncident(
  data: Omit<ShiftIncident, 'id' | 'createdAt'>
): Promise<ShiftIncident> {
  const db = ensureDbFile();
  if (!db.incidents) db.incidents = [];
  const newIncident: ShiftIncident = {
    ...data,
    id: `inc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  db.incidents.unshift(newIncident);
  writeDbFile(db);
  return newIncident;
}

export async function getCampaign(
  businessId: string,
  branchId?: string
): Promise<SatisfactionCampaign | null> {
  const db = ensureDbFile();
  const business = db.businesses.find((b) => b.id === businessId);
  if (!business) return null;

  // 1. If branchId requested and a branch-specific campaign exists, return it
  if (branchId && business.branchCampaigns?.[branchId]) {
    return business.branchCampaigns[branchId];
  }

  // 2. Otherwise return general brand campaign
  return business.campaign || null;
}

export async function saveCampaign(
  businessId: string,
  campaignData: Partial<SatisfactionCampaign>,
  branchId?: string
): Promise<SatisfactionCampaign> {
  const db = ensureDbFile();
  const business = db.businesses.find((b) => b.id === businessId);
  if (!business) throw new Error('Business not found');

  const targetBranch = branchId && branchId !== 'all' ? branchId : undefined;

  const defaultReward = business.name
    ? `Bono de Experiencia VIP en ${business.name} valorado en $150.000 COP`
    : 'Bono de Experiencia VIP / Compra valorado en $150.000 COP';
  const defaultTerms = 'Válido para clientes registrados este mes que califiquen su experiencia.';

  const existing = targetBranch
    ? business.branchCampaigns?.[targetBranch] || business.campaign || {
        id: `camp-${targetBranch}-${Date.now()}`,
        businessId,
        branchId: targetBranch,
        title: 'Campaña de Satisfacción del Mes',
        reward: defaultReward,
        active: true,
        drawDate: '30 de Septiembre de 2026',
        terms: defaultTerms,
      }
    : business.campaign || {
        id: `camp-${Date.now()}`,
        businessId,
        title: 'Campaña de Satisfacción del Mes',
        reward: defaultReward,
        active: true,
        drawDate: '30 de Septiembre de 2026',
        terms: defaultTerms,
      };

  const updated: SatisfactionCampaign = {
    ...existing,
    ...campaignData,
    businessId,
    branchId: targetBranch,
    updatedAt: new Date().toISOString(),
  };

  if (targetBranch) {
    if (!business.branchCampaigns) business.branchCampaigns = {};
    business.branchCampaigns[targetBranch] = updated;
  } else {
    business.campaign = updated;
  }

  writeDbFile(db);
  return updated;
}

export async function getBusinessBranding(businessId: string): Promise<BrandIdentity | null> {
  const db = ensureDbFile();
  const business = db.businesses.find((b) => b.id === businessId);
  return business?.branding || null;
}

export async function saveBusinessBranding(
  businessId: string,
  branding: BrandIdentity
): Promise<BrandIdentity> {
  const db = ensureDbFile();
  const business = db.businesses.find((b) => b.id === businessId);
  if (!business) throw new Error('Business not found');

  business.branding = {
    ...business.branding,
    ...branding,
  };

  writeDbFile(db);
  return business.branding;
}

export async function getCampaignParticipants(businessId: string, branchId?: string): Promise<CampaignParticipant[]> {
  const db = ensureDbFile();
  return (db.campaignParticipants || []).filter((p) => {
    if (p.businessId !== businessId) return false;
    if (branchId && branchId !== 'all' && p.branchId !== branchId) return false;
    return true;
  });
}

export async function addCampaignParticipant(
  data: Omit<CampaignParticipant, 'id' | 'registeredAt'>
): Promise<CampaignParticipant> {
  const db = ensureDbFile();
  if (!db.campaignParticipants) db.campaignParticipants = [];

  const existing = db.campaignParticipants.find(
    (p) =>
      p.businessId === data.businessId &&
      p.customerPhone.replace(/[^0-9]/g, '') === data.customerPhone.replace(/[^0-9]/g, '')
  );
  if (existing) {
    return existing;
  }

  const newParticipant: CampaignParticipant = {
    ...data,
    id: `part-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    registeredAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };

  db.campaignParticipants.unshift(newParticipant);
  writeDbFile(db);
  return newParticipant;
}

export async function markCampaignWinner(
  participantId: string,
  notifiedAt?: string
): Promise<CampaignParticipant | null> {
  const db = ensureDbFile();
  if (!db.campaignParticipants) return null;
  const participant = db.campaignParticipants.find((p) => p.id === participantId);
  if (participant) {
    participant.isWinner = true;
    if (notifiedAt) participant.winnerNotifiedAt = notifiedAt;
    writeDbFile(db);
    return participant;
  }
  return null;
}

export async function clearCampaignParticipants(businessId: string): Promise<void> {
  const db = ensureDbFile();
  if (db.campaignParticipants) {
    db.campaignParticipants = db.campaignParticipants.filter((p) => p.businessId !== businessId);
    writeDbFile(db);
  }
}

export async function getAllCampaignParticipants(): Promise<CampaignParticipant[]> {
  const db = ensureDbFile();
  return db.campaignParticipants || [];
}

export async function getAllGoogleReviews(): Promise<GoogleReview[]> {
  const db = ensureDbFile();
  return db.googleReviews || [];
}

export async function updateBusinessMasterPlanAndAddons(
  businessId: string,
  plan: import('./types').BusinessPlan,
  masterAddOns: import('./types').MasterAddOns,
  status?: 'active' | 'suspended'
): Promise<Business | null> {
  const db = ensureDbFile();
  const business = db.businesses.find((b) => b.id === businessId);
  if (!business) return null;
  business.plan = plan;
  business.masterAddOns = masterAddOns;
  if (status) {
    business.status = status;
  }
  writeDbFile(db);
  return business;
}

export async function updateBusinessBaseline(
  businessId: string,
  baseline: import('./types').DayOneBaseline
): Promise<Business | null> {
  const db = ensureDbFile();
  const business = db.businesses.find((b) => b.id === businessId);
  if (!business) return null;
  business.baseline = baseline;
  writeDbFile(db);
  return business;
}

export async function getMasterSecuritySettings(): Promise<MasterSecurityConfig> {
  const db = ensureDbFile();
  if (!db.masterSecurity) {
    db.masterSecurity = {
      masterKey: 'PRESTIGIA-MASTER-2026',
      emergencyPhone: '+57 317 260 6093',
      emergencyEmail: 'info@prestigia.app',
      totpSecret: 'JBSWY3DPEHPK3PXP',
      twoFactorEnabled: false,
      updatedAt: new Date().toISOString(),
    };
  }
  if (db.masterSecurity.twoFactorEnabled === undefined) {
    db.masterSecurity.twoFactorEnabled = false;
  }
  if (!db.masterSecurity.totpSecret || db.masterSecurity.totpSecret.includes('PRESTIGIA-TOTP')) {
    db.masterSecurity.totpSecret = 'JBSWY3DPEHPK3PXP';
  }
  return db.masterSecurity;
}

export async function updateMasterSecuritySettings(settings: Partial<MasterSecurityConfig>): Promise<MasterSecurityConfig> {
  const db = ensureDbFile();
  const current = await getMasterSecuritySettings();
  db.masterSecurity = {
    ...current,
    ...settings,
    updatedAt: new Date().toISOString(),
  };
  writeDbFile(db);
  return db.masterSecurity;
}

// =========================================================================
// COMMERCIAL LEADS & TRAFFIC ANALYTICS
// =========================================================================

export async function recordTrafficVisit(
  visit: Omit<TrafficVisit, 'id' | 'timestamp'>
): Promise<TrafficVisit> {
  const db = ensureDbFile();
  if (!db.trafficVisits) db.trafficVisits = [];

  const newVisit: TrafficVisit = {
    ...visit,
    id: `visit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };

  db.trafficVisits.unshift(newVisit);
  if (db.trafficVisits.length > 1000) {
    db.trafficVisits = db.trafficVisits.slice(0, 1000);
  }

  writeDbFile(db);
  return newVisit;
}

export async function getAllTrafficVisits(): Promise<TrafficVisit[]> {
  const db = ensureDbFile();
  return db.trafficVisits || [];
}

export async function saveCommercialLead(
  lead: Omit<CommercialLead, 'id' | 'createdAt' | 'status'>
): Promise<CommercialLead> {
  const db = ensureDbFile();
  if (!db.leads) db.leads = [];

  const newLead: CommercialLead = {
    ...lead,
    id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: 'new',
  };

  db.leads.unshift(newLead);
  writeDbFile(db);
  return newLead;
}

export async function getAllCommercialLeads(): Promise<CommercialLead[]> {
  const db = ensureDbFile();
  return db.leads || [];
}

export async function updateCommercialLeadStatus(
  id: string,
  status: CommercialLead['status']
): Promise<boolean> {
  const db = ensureDbFile();
  if (!db.leads) return false;
  const lead = db.leads.find((l) => l.id === id);
  if (!lead) return false;
  lead.status = status;
  writeDbFile(db);
  return true;
}




