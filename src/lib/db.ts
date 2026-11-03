import fs from 'fs';
import { getSupabase } from './supabase';
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

export interface EmailDispatchRecord {
  id: string;
  templateId: 'welcome_credentials' | 'reactivation_winback' | 'monthly_report' | 'official_announcement' | 'billing_renewal' | 'custom';
  templateName: string;
  subject: string;
  recipientEmail: string;
  recipientName: string;
  businessName: string;
  status: 'sent' | 'queued' | 'failed';
  provider: string;
  sentAt: string;
  error?: string;
}

export interface StudioAdvisor {
  id: string;
  name: string;
  username: string;
  password: string;
  phone: string;
  role: 'admin' | 'advisor';
  accountType?: 'internal_advisor' | 'partner_agency' | 'founder' | 'director';
  country?: string;
  city?: string;
  monthlyFeeUsd?: number;
  licenseStatus?: 'active' | 'pending_payment' | 'suspended';
  active: boolean;
  maxCreatesMonthly?: number;
  maxAuditsMonthly?: number;
  maxRescuesMonthly?: number;
  createdAt: string;
}

export interface StudioDossier {
  id: string;
  advisorId: string;
  advisorName: string;
  advisorPhone?: string;
  advisorType?: 'internal_advisor' | 'partner_agency' | 'founder';
  country?: string;
  clientName: string;
  // Contact & Client Contratante details
  contactName?: string;
  contactCompany?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactRole?: string;
  category: string;
  city: string;
  neighborhood?: string;
  googleUrl?: string;
  mode: 'create' | 'audit' | 'rescue';
  businessModel?: 'storefront' | 'service_area';
  status: 'draft' | 'presented' | 'closed';
  deletedByAdvisor?: boolean;
  deletedAt?: string;
  // Commercial closing & monetization
  closingStatus?: 'prestigia_subscriber' | 'setup_paid' | 'proposal_sent' | 'negotiating' | 'lead_draft';
  setupFeeChargedUsd?: number;
  monthlyPlanUsd?: number;
  prestigiaPlan?: 'standard' | 'elite' | 'enterprise' | 'none';
  paymentMethod?: string;
  closingNotes?: string;
  data: any;
  createdAt: string;
  updatedAt: string;
}

export interface StudioLandingPage {
  id: string;
  slug: string;
  advisorId: string;
  advisorName: string;
  advisorPhone?: string;
  businessName: string;
  category: string;
  city: string;
  phone: string;
  whatsappMessage?: string;
  status: 'active' | 'suspended';
  theme: {
    primaryColor: string;
    accentColor: string;
    bgColor?: string;
    template: 'executive_dark' | 'medical_clean' | 'gourmet_warm' | 'high_impact_orange';
  };
  headline: string;
  subheadline: string;
  callToAction: string;
  offerBadge?: string;
  offerCountdownHours?: number;
  services: Array<{
    name: string;
    description: string;
    price?: string;
    tag?: string;
  }>;
  reviews: Array<{
    author: string;
    rating: number;
    text: string;
    date: string;
  }>;
  testimonials: Array<{
    name: string;
    role: string;
    quote: string;
  }>;
  features: {
    showLiveOpen: boolean;
    showUrgencyBanner: boolean;
    showFomoPopups: boolean;
    showReviewCarousel: boolean;
    showWazeButton: boolean;
    showPrestigiaBadge: boolean;
  };
  heroImage?: string;
  beforeAfter?: {
    beforeUrl: string;
    afterUrl: string;
    title?: string;
    labelBefore?: string;
    labelAfter?: string;
  };
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  statHighlights?: Array<{
    value: string;
    label: string;
  }>;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

interface DatabaseSchema {
  businesses: Business[];
  feedbacks: Feedback[];
  googleReviews: GoogleReview[];
  incidents: ShiftIncident[];
  campaignParticipants?: CampaignParticipant[];
  masterSecurity?: MasterSecurityConfig;
  leads?: CommercialLead[];
  trafficVisits?: TrafficVisit[];
  emailDispatches?: EmailDispatchRecord[];
  exchangeRates?: ExchangeRatesRecord;
  studioAdvisors?: StudioAdvisor[];
  studioDossiers?: StudioDossier[];
  studioLandingPages?: StudioLandingPage[];
}

export interface ExchangeRatesRecord {
  base: string;
  rates: Record<string, number>;
  lastUpdated: string;
  source: string;
}

export interface MasterSecurityConfig {
  masterKey: string;
  emergencyPhone: string;
  emergencyEmail: string;
  totpSecret?: string;
  twoFactorEnabled?: boolean;
  resendApiKey?: string;
  resendFromEmail?: string;
  brevoApiKey?: string;
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioFromPhone?: string;
  activeOtp?: {
    code: string;
    expiresAt: number;
    phone: string;
    email: string;
    consumed: boolean;
  };
  updatedAt: string;
}

const KV_REST_API_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function syncWithRemoteKv(): Promise<void> {
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) return;
  try {
    const res = await fetch(`${KV_REST_API_URL}/get/prestigia_db`, {
      headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` },
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.result) {
        const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
        if (parsed && Array.isArray(parsed.businesses)) {
          memoryDb = parsed;
          try {
            if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
            fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
          } catch {}
        }
      }
    }
  } catch (err) {
    console.warn('[DB] KV fetch warning:', err);
  }
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
      if (!parsed.studioDossiers) parsed.studioDossiers = [];
      if (!parsed.studioAdvisors || parsed.studioAdvisors.length === 0) {
        parsed.studioAdvisors = [
          {
            id: 'adv-luisma',
            name: 'Luisma • Director General & Founder',
            username: 'luisma',
            password: 'admin',
            phone: '+573058314049',
            role: 'admin',
            accountType: 'founder',
            licenseStatus: 'active',
            active: true,
            createdAt: '2026-01-01T00:00:00.000Z',
          },
          {
            id: 'adv-carlos',
            name: 'Carlos Mendoza • Asesor Comercial',
            username: 'carlos',
            password: '1234',
            phone: '+573104567890',
            role: 'advisor',
            accountType: 'internal_advisor',
            active: true,
            createdAt: '2026-01-01T00:00:00.000Z',
          },
        ];
      }
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

  // Background broadcast to remote KV if configured
  if (KV_REST_API_URL && KV_REST_API_TOKEN) {
    fetch(`${KV_REST_API_URL}/set/prestigia_db`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KV_REST_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(JSON.stringify(data)),
    }).catch((err) => console.warn('[DB] KV sync write warning:', err));
  }
}

/**
 * Resolves a QR scan by either Branch ID (e.g. 'la-burguesia-chapinero') or Brand ID (e.g. 'la-burguesia')
 */
export async function getBranchOrBusiness(
  idOrSlug: string
): Promise<{ business: Business; branch: Branch } | null> {
  await syncWithRemoteKv();
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

  // 3. Fallback: Check Supabase Cloud via getBusinessById
  const cloudBiz = await getBusinessById(target);
  if (cloudBiz && cloudBiz.branches && cloudBiz.branches.length > 0) {
    return { business: cloudBiz, branch: cloudBiz.branches[0] };
  }

  return null;
}

export async function getBusinessById(id: string): Promise<Business | null> {
  await syncWithRemoteKv();
  const db = ensureDbFile();
  const targetId = id.toLowerCase().trim();
  const business = db.businesses.find(
    (b) => b.id.toLowerCase() === targetId
  );
  if (business) return business;

  // Supabase Cloud live fallback
  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data: bData } = await supabase.from('businesses').select('*').eq('id', targetId).single();
      if (bData) {
        const { data: branchesData } = await supabase.from('branches').select('*').eq('business_id', targetId);
        const mappedBranches: Branch[] = (branchesData || []).map((br: any) => ({
          id: br.id,
          name: br.name,
          address: br.address || '',
          city: br.city || '',
          locality: br.locality || '',
          googleReviewUrl: br.google_review_url || '',
          googlePlaceId: br.google_place_id || undefined,
          managerPhone: br.manager_phone || '',
          managerPassword: br.manager_password || undefined,
          managerUsername: br.manager_username || undefined,
          status: br.status || 'active',
          containmentMessage: br.containment_message || undefined,
          websiteUrl: br.website_url || br.google_review_url || '',
        }));

        const restoredBusiness: Business = {
          id: bData.id,
          name: bData.name,
          legalName: bData.legal_name || undefined,
          taxId: bData.tax_id || undefined,
          address: bData.address || undefined,
          ownerName: bData.owner_name,
          ownerPhone: bData.owner_phone,
          ownerEmail: bData.owner_email || undefined,
          plan: bData.plan || 'pro',
          status: bData.status || 'active',
          trialEndsAt: bData.trial_ends_at || new Date(Date.now() + 30 * 86400000).toISOString(),
          category: bData.category || 'General',
          country: bData.country || 'Colombia',
          createdAt: bData.created_at || new Date().toISOString(),
          password: bData.password,
          branding: bData.branding || {},
          baseline: bData.baseline || {},
          masterAddOns: bData.master_add_ons || {},
          customStaffRoles: bData.custom_staff_roles || [],
          branches: mappedBranches,
        };

        db.businesses.push(restoredBusiness);
        writeDbFile(db);
        return restoredBusiness;
      }
    }
  } catch {}

  return null;
}

export async function getAllBusinesses(): Promise<Business[]> {
  await syncWithRemoteKv();
  const db = ensureDbFile();

  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data: bList } = await supabase.from('businesses').select('*');
      if (bList && bList.length > 0) {
        const { data: allBranches } = await supabase.from('branches').select('*');
        for (const bData of bList) {
          const exists = db.businesses.find((b) => b.id.toLowerCase() === bData.id.toLowerCase());
          if (!exists) {
            const mappedBranches: Branch[] = (allBranches || [])
              .filter((br: any) => br.business_id.toLowerCase() === bData.id.toLowerCase())
              .map((br: any) => ({
                id: br.id,
                name: br.name,
                address: br.address || '',
                city: br.city || '',
                locality: br.locality || '',
                googleReviewUrl: br.google_review_url || '',
                googlePlaceId: br.google_place_id || undefined,
                managerPhone: br.manager_phone || '',
                managerPassword: br.manager_password || undefined,
                managerUsername: br.manager_username || undefined,
                status: br.status || 'active',
                containmentMessage: br.containment_message || undefined,
                websiteUrl: br.website_url || br.google_review_url || '',
              }));

            db.businesses.push({
              id: bData.id,
              name: bData.name,
              legalName: bData.legal_name || undefined,
              taxId: bData.tax_id || undefined,
              address: bData.address || undefined,
              ownerName: bData.owner_name,
              ownerPhone: bData.owner_phone,
              ownerEmail: bData.owner_email || undefined,
              plan: bData.plan || 'pro',
              status: bData.status || 'active',
              trialEndsAt: bData.trial_ends_at || new Date(Date.now() + 30 * 86400000).toISOString(),
              category: bData.category || 'General',
              country: bData.country || 'Colombia',
              createdAt: bData.created_at || new Date().toISOString(),
              password: bData.password,
              branding: bData.branding || {},
              baseline: bData.baseline || {},
              masterAddOns: bData.master_add_ons || {},
              customStaffRoles: bData.custom_staff_roles || [],
              branches: mappedBranches,
            });
          }
        }
      }
    }
  } catch {}

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

  // Sync real-time to Supabase cloud
  try {
    const supabase = getSupabase();
    if (supabase) {
      Promise.resolve(
        supabase.from('businesses').upsert({
          id: business.id,
          name: business.name,
          legal_name: business.legalName || null,
          tax_id: business.taxId || null,
          address: business.address || null,
          owner_name: business.ownerName,
          owner_phone: business.ownerPhone,
          owner_email: business.ownerEmail || null,
          plan: business.plan,
          status: business.status,
          category: business.category,
          country: business.country || 'Colombia',
          password: business.password,
          branding: business.branding || {},
          baseline: business.baseline || {},
          master_add_ons: business.masterAddOns || {},
          custom_staff_roles: business.customStaffRoles || [],
        })
      ).catch(() => {});

      if (business.branches && business.branches.length > 0) {
        for (const br of business.branches) {
          Promise.resolve(
            supabase.from('branches').upsert({
              id: br.id,
              business_id: business.id,
              name: br.name,
              address: br.address || null,
              city: br.city,
              locality: br.locality,
              google_review_url: br.googleReviewUrl,
              google_place_id: br.googlePlaceId || null,
              manager_phone: br.managerPhone,
              manager_password: br.managerPassword || null,
              manager_username: br.managerUsername || null,
              status: br.status,
              containment_message: br.containmentMessage || null,
            })
          ).catch(() => {});
        }
      }
    }
  } catch {}
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

export async function deleteBusiness(id: string): Promise<boolean> {
  const db = ensureDbFile();
  const targetId = id.toLowerCase().trim();
  const index = db.businesses.findIndex((b) => b.id.toLowerCase() === targetId);
  if (index === -1) return false;

  db.businesses.splice(index, 1);
  writeDbFile(db);

  // Sync deletion to Supabase cloud
  try {
    const supabase = getSupabase();
    if (supabase) {
      Promise.resolve(supabase.from('businesses').delete().eq('id', targetId)).catch(() => {});
    }
  } catch {}

  return true;
}

export async function archiveBusiness(id: string, reason?: string): Promise<Business | null> {
  const db = ensureDbFile();
  const targetId = id.toLowerCase().trim();
  const business = db.businesses.find((b) => b.id.toLowerCase() === targetId);
  if (!business) return null;

  business.status = 'suspended';
  (business as any).isArchived = true;
  (business as any).archivedAt = new Date().toISOString();
  if (reason) (business as any).archiveReason = reason;

  if (Array.isArray(business.branches)) {
    business.branches.forEach((br) => {
      br.status = 'suspended';
    });
  }

  writeDbFile(db);
  return business;
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

  // Sync real-time to Supabase
  try {
    const supabase = getSupabase();
    if (supabase) {
      Promise.resolve(
        supabase.from('feedbacks').insert({
          id: newFeedback.id,
          business_id: newFeedback.businessId,
          business_name: newFeedback.businessName,
          branch_id: newFeedback.branchId,
          branch_name: newFeedback.branchName,
          rating: newFeedback.rating,
          customer_name: newFeedback.customerName,
          customer_phone: newFeedback.customerPhone,
          complaint_reason: newFeedback.complaintReason || null,
          attended_by: newFeedback.attendedBy || null,
          club_consent: Boolean(newFeedback.clubConsent),
          status: newFeedback.status,
          created_at: newFeedback.createdAt,
          category: newFeedback.category || 'General',
          country: newFeedback.country || 'Colombia',
          city: newFeedback.city || 'Bogotá',
          locality: newFeedback.locality || 'Centro',
        })
      ).catch(() => {});
    }
  } catch {}

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
  baseline: import('./types').DayOneBaseline,
  branchId?: string
): Promise<Business | null> {
  const db = ensureDbFile();
  const business = db.businesses.find((b) => b.id === businessId);
  if (!business) return null;
  if (branchId && branchId !== 'all') {
    const branch = business.branches?.find((br) => br.id === branchId);
    if (branch) {
      branch.baseline = baseline;
    }
  } else {
    business.baseline = baseline;
  }
  writeDbFile(db);
  return business;
}

export async function getMasterSecuritySettings(): Promise<MasterSecurityConfig> {
  const db = ensureDbFile();
  if (!db.masterSecurity) {
    db.masterSecurity = {
      masterKey: 'PRESTIGIA-MASTER-2026',
      emergencyPhone: '+57 305 831 4049',
      emergencyEmail: 'prestigiaprincipal@gmail.com',
      totpSecret: 'JBSWY3DPEHPK3PXP',
      twoFactorEnabled: false,
      resendApiKey: process.env.RESEND_API_KEY,
      resendFromEmail: process.env.RESEND_FROM_EMAIL || 'Prestigia Enterprise <onboarding@resend.dev>',
      updatedAt: new Date().toISOString(),
    };
  }
  if (db.masterSecurity.twoFactorEnabled === undefined) {
    db.masterSecurity.twoFactorEnabled = false;
  }
  if (!db.masterSecurity.totpSecret || db.masterSecurity.totpSecret.includes('PRESTIGIA-TOTP')) {
    db.masterSecurity.totpSecret = 'JBSWY3DPEHPK3PXP';
  }
  if (!db.masterSecurity.resendApiKey && process.env.RESEND_API_KEY) {
    db.masterSecurity.resendApiKey = process.env.RESEND_API_KEY;
  }
  if (!db.masterSecurity.emergencyEmail || db.masterSecurity.emergencyEmail.includes('info@prestigia')) {
    db.masterSecurity.emergencyEmail = 'prestigiaprincipal@gmail.com';
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

  // Sync real-time to Supabase
  try {
    const supabase = getSupabase();
    if (supabase) {
      Promise.resolve(
        supabase.from('commercial_leads').insert({
          id: newLead.id,
          created_at: newLead.createdAt,
          full_name: newLead.fullName,
          business_name: newLead.businessName,
          category: newLead.category || null,
          city: newLead.city,
          country: newLead.country || 'Colombia',
          phone: newLead.phone,
          email: newLead.email || null,
          branch_count: newLead.branchCount || 1,
          preferred_time: newLead.preferredTime || null,
          primary_goal: newLead.primaryGoal || null,
          status: newLead.status,
          ip: newLead.ip || null,
          device: newLead.device || null,
          notes: newLead.notes || null,
        })
      ).catch(() => {});
    }
  } catch {}

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

  // Sync status to Supabase
  try {
    const supabase = getSupabase();
    if (supabase) {
      Promise.resolve(supabase.from('commercial_leads').update({ status }).eq('id', id)).catch(() => {});
    }
  } catch {}

  return true;
}

export async function getAllEmailDispatches(): Promise<EmailDispatchRecord[]> {
  const db = ensureDbFile();
  return db.emailDispatches || [];
}

export async function saveEmailDispatch(
  record: Omit<EmailDispatchRecord, 'id' | 'sentAt'>
): Promise<EmailDispatchRecord> {
  const db = ensureDbFile();
  if (!db.emailDispatches) db.emailDispatches = [];
  const newRecord: EmailDispatchRecord = {
    ...record,
    id: `disp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    sentAt: new Date().toISOString(),
  };
  db.emailDispatches.unshift(newRecord);
  if (db.emailDispatches.length > 200) {
    db.emailDispatches = db.emailDispatches.slice(0, 200);
  }
  writeDbFile(db);
  return newRecord;
}

export async function getExchangeRates(forceRefresh = false): Promise<ExchangeRatesRecord> {
  const db = ensureDbFile();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const now = Date.now();

  const existing = db.exchangeRates;
  const isFresh = existing && existing.lastUpdated && (now - new Date(existing.lastUpdated).getTime() < ONE_DAY_MS);

  if (!forceRefresh && isFresh && existing.rates && existing.rates.COP) {
    return existing;
  }

  // Fetch updated daily TRM from open central-bank rate provider
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        const newRecord: ExchangeRatesRecord = {
          base: 'USD',
          rates: {
            USD: 1,
            COP: Math.round(data.rates.COP || 4150),
            CLP: Math.round(data.rates.CLP || 980),
            MXN: Number((data.rates.MXN || 18.5).toFixed(2)),
            EUR: Number((data.rates.EUR || 0.90).toFixed(4)),
            BRL: Number((data.rates.BRL || 5.5).toFixed(2)),
            PEN: Number((data.rates.PEN || 3.75).toFixed(2)),
          },
          lastUpdated: new Date().toISOString(),
          source: 'Open Exchange Rates (TRM Oficial Diaria)',
        };
        db.exchangeRates = newRecord;
        writeDbFile(db);
        return newRecord;
      }
    }
  } catch (e: any) {
    console.warn('Could not refresh exchange rates, using fallback:', e?.message);
  }

  // Fallback if network failed
  return existing || {
    base: 'USD',
    rates: { USD: 1, COP: 4150, CLP: 985, MXN: 18.6, EUR: 0.90 },
    lastUpdated: new Date().toISOString(),
    source: 'Tasa Referencial de Respaldo',
  };
}

export async function updateBranchGoogleTokens(
  branchOrBusinessId: string,
  tokens: {
    accessToken?: string;
    refreshToken?: string;
    connectedEmail?: string;
    accountId?: string;
    locationId?: string;
  }
): Promise<boolean> {
  const db = ensureDbFile();
  const target = branchOrBusinessId.toLowerCase().trim();
  let updated = false;

  for (const b of db.businesses) {
    if (b.branches) {
      for (const br of b.branches) {
        if (br.id.toLowerCase() === target || b.id.toLowerCase() === target) {
          br.googleBusinessStatus = 'connected';
          br.googleManagedBy = 'client_self_service';
          (br as any).googleAccessToken = tokens.accessToken;
          if (tokens.refreshToken) (br as any).googleRefreshToken = tokens.refreshToken;
          if (tokens.connectedEmail) (br as any).googleConnectedEmail = tokens.connectedEmail;
          if (tokens.accountId) (br as any).googleAccountId = tokens.accountId;
          if (tokens.locationId) (br as any).googleLocationId = tokens.locationId;
          br.googleAuditedAt = new Date().toISOString();
          br.googleAuditNotes = `Vinculado exitosamente vía Google OAuth (${tokens.connectedEmail || 'Gmail'})`;
          updated = true;

          const supabase = getSupabase();
          if (supabase) {
            Promise.resolve(
              supabase.from('branches').update({
                google_business_status: 'connected',
                google_managed_by: 'client_self_service',
                google_audited_at: new Date().toISOString(),
                google_audit_notes: `OAuth Vinculado: ${tokens.connectedEmail || 'OK'}`,
              }).eq('id', br.id)
            ).catch(() => {});
          }
        }
      }
    }
  }

  if (updated) {
    writeDbFile(db);
  }
  return updated;
}

// =========================================================================
// PRESTIGIA LOCAL STUDIO: ADVISORS & DOSSIERS STORAGE
// =========================================================================

export async function getAllStudioAdvisors(): Promise<StudioAdvisor[]> {
  const db = ensureDbFile();
  if (!db.studioAdvisors || db.studioAdvisors.length === 0) {
    db.studioAdvisors = [
      {
        id: 'adv-luisma',
        name: 'Luisma • Director General & Founder',
        username: 'luisma',
        password: 'admin',
        phone: '+573058314049',
        role: 'admin',
        accountType: 'founder',
        licenseStatus: 'active',
        active: true,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'adv-carlos',
        name: 'Carlos Mendoza • Asesor Comercial',
        username: 'carlos',
        password: '1234',
        phone: '+573104567890',
        role: 'advisor',
        accountType: 'internal_advisor',
        active: true,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ];
    writeDbFile(db);
  }

  // Strict Rule: Only Luisma can be Founder / Dirección General. All others are internal_advisor or partner_agency.
  let modified = false;
  db.studioAdvisors.forEach((a) => {
    const isLuisma = a.id === 'adv-luisma' || a.username.toLowerCase() === 'luisma';
    if (!isLuisma) {
      if (a.accountType === 'director' || a.accountType === 'founder') {
        a.accountType = 'internal_advisor';
        modified = true;
      }
    } else {
      if (a.accountType !== 'founder' || !a.active || a.licenseStatus !== 'active') {
        a.accountType = 'founder';
        a.active = true;
        a.licenseStatus = 'active';
        modified = true;
      }
    }
  });
  if (modified) writeDbFile(db);

  return db.studioAdvisors || [];
}

export async function saveStudioAdvisor(advisor: StudioAdvisor): Promise<void> {
  const db = ensureDbFile();
  if (!db.studioAdvisors) db.studioAdvisors = [];
  const idx = db.studioAdvisors.findIndex(
    (a) => a.id === advisor.id || a.username.toLowerCase() === advisor.username.toLowerCase()
  );

  const isLuisma = advisor.id === 'adv-luisma' || advisor.username.toLowerCase() === 'luisma';
  const sanitizedAdvisor = { ...advisor };

  if (isLuisma) {
    sanitizedAdvisor.id = 'adv-luisma';
    sanitizedAdvisor.username = 'luisma';
    sanitizedAdvisor.accountType = 'founder';
    sanitizedAdvisor.role = 'admin';
    sanitizedAdvisor.active = true;
    sanitizedAdvisor.licenseStatus = 'active';
  } else {
    // Under no circumstances can any other account be director or founder
    if (sanitizedAdvisor.accountType === 'director' || sanitizedAdvisor.accountType === 'founder') {
      sanitizedAdvisor.accountType = 'internal_advisor';
    }
  }

  if (idx >= 0) {
    db.studioAdvisors[idx] = { ...db.studioAdvisors[idx], ...sanitizedAdvisor };
  } else {
    db.studioAdvisors.push(sanitizedAdvisor);
  }
  writeDbFile(db);
}

export async function deleteStudioAdvisor(advisorId: string): Promise<boolean> {
  const db = ensureDbFile();
  if (!db.studioAdvisors) return false;
  // Never delete master admin
  const target = db.studioAdvisors.find((a) => a.id === advisorId);
  if (target?.role === 'admin' || target?.username === 'admin') return false;
  db.studioAdvisors = db.studioAdvisors.filter((a) => a.id !== advisorId);
  writeDbFile(db);
  return true;
}

export async function getAllStudioDossiers(): Promise<StudioDossier[]> {
  const db = ensureDbFile();
  if (!db.studioDossiers || db.studioDossiers.length === 0) {
    db.studioDossiers = [
      {
        id: 'dos-trattoria-01',
        advisorId: 'adv-luisma',
        advisorName: 'Luisma • Consultor Senior',
        advisorPhone: '+573058314049',
        clientName: 'La Trattoria del Parque',
        category: 'Restaurante / Gastronomía',
        city: 'Bogotá',
        neighborhood: 'Parque de la 93',
        googleUrl: 'https://maps.google.com/?cid=1029384756',
        mode: 'audit',
        status: 'presented',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        data: {
          healthScore: 48,
          criticalGaps: [
            "Ficha configurada con una sola categoría genérica ('Restaurante'), perdiendo 68% de búsquedas de alta conversión.",
            "Descripción comercial incompleta (solo 94 caracteres) sin palabras clave ni llamada a la acción.",
            "Sin catálogo de servicios o menú cargado en Google Maps con precios.",
            "Solo 14 fotos antiguas de baja resolución sin geonombres optimizados.",
            "Cero preguntas frecuentes (Q&A) preventivas configuradas."
          ],
          topCompetitorInsights: 'Los 3 restaurantes líderes acumulan más de 450 reseñas con flujo semanal activo y responden en menos de 24h.',
          actionRoadmap: [
            { step: 1, title: 'Inyección de Categorías Secundarias', impact: '+35% Impresiones', action: 'Configurar Restaurante italiano como primaria y agregar Pizzería, Bar de vinos y Restaurante familiar.' },
            { step: 2, title: 'Reemplazo de Copywriting Comercial', impact: '+28% Clics a Llamada', action: 'Cargar descripción optimizada con propuesta de valor y palabras clave locales.' },
            { step: 3, title: 'Publicación de Catálogo de 6 Platos Insignia', impact: '+40% Clics al Menú', action: 'Subir pastas frescas y pizzas al horno de leña con fotos y precios.' },
            { step: 4, title: 'Carga de 15 Fotografías Geonombradas', impact: '+22% Ruta en Maps', action: 'Reemplazar fotos con imágenes HD y nombres SEO de ubicación.' },
            { step: 5, title: 'Activación del Sistema Prestigia QR en Mesa', impact: '+45 Reseñas 5⭐/Mes', action: 'Implementar atril QR para capturar comensales en caliente.' }
          ],
          optimizedTitle: 'La Trattoria del Parque | Restaurante Italiano & Pastas Artesanales',
          primaryCategory: 'Restaurante italiano',
          secondaryCategories: ['Restaurante', 'Pizzería', 'Bar de vinos', 'Restaurante familiar'],
          commercialDescription: 'La Trattoria del Parque te ofrece la auténtica tradición italiana en el Parque de la 93 en Bogotá. Pastas frescas elaboradas a mano cada mañana, risottos cremosos, pizzas al horno de leña y cava de vinos. ¡Reserva tu mesa hoy!',
          serviceCatalog: [
            { name: 'Fettuccine al Tartufo & Funghi', description: 'Pasta fresca con crema de trufa negra, champiñones silvestres y queso Grana Padano DOP.', tag: 'Plato Insignia' },
            { name: 'Pizza Napoletana Verace', description: 'Masa madre 48h, salsa San Marzano, mozzarella di bufala y albahaca.', tag: 'Horno de Leña' }
          ],
          photoChecklist: [
            { item: 'Fachada con aviso visible', count: 2, tip: 'Toma limpia de día desde la acera opuesta.', filenameExample: 'trattoria-parque-fachada-restaurante-italiano-bogota.jpg' },
            { item: 'Platos estrella servidos', count: 6, tip: 'Luz natural a 45 grados sobre mesa vestida.', filenameExample: 'pasta-artesanal-trufa-parque-93-bogota.jpg' }
          ],
          preventiveFaqs: [
            { question: '¿Tienen parqueadero propio en el Parque de la 93?', answer: 'Sí, contamos con convenio de estacionamiento vigilado a solo media cuadra con tarifa preferencial.' }
          ],
          verificationGuide: {
            title: 'Grabación de Video de Verificación de 60 Segundos',
            overview: 'Google exige video continuo sin cortes de la calle, fachada, llave abriendo la puerta y datáfono en caja.',
            cameraTake1: '0-15s: Calle con letrero legible y dirección exterior.',
            cameraTake2: '15-40s: Entrada abriendo con llave física y mostrando salón y horno.',
            cameraTake3: '40-60s: Terminal de pago (datáfono) con el nombre comercial en caja.',
            documents: ['RUT con dirección del local', 'Factura de energía o internet', 'Datáfono en pantalla']
          },
          whatsappOnboardingMessage: 'Estimado equipo de La Trattoria del Parque, ya tenemos estructurada la optimización de Google Maps para llevarlos al Top 3. Por favor envíennos fotos y el video de 60s según la guía adjunta.'
        }
      },
      {
        id: 'dos-sonrisas-02',
        advisorId: 'adv-luisma',
        advisorName: 'Luisma • Consultor Senior',
        advisorPhone: '+573058314049',
        clientName: 'Clínica Dental Estética Sonrisas',
        category: 'Salud / Odontología / Médica',
        city: 'Medellín',
        neighborhood: 'El Poblado',
        googleUrl: '',
        mode: 'create',
        status: 'closed',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        data: {
          optimizedTitle: 'Clínica Dental Estética Sonrisas | Odontología & Diseño de Sonrisa',
          primaryCategory: 'Clínica dental',
          secondaryCategories: ['Dentista', 'Ortodoncista', 'Periodoncista de implantes dentales'],
          commercialDescription: 'Centro odontológico de alta gama en El Poblado, Medellín. Diseño de sonrisa digital, ortodoncia invisible, implantes guiados 3D y blanqueamiento láser sin dolor.',
          serviceCatalog: [
            { name: 'Diseño de Sonrisa Digital', description: 'Carillas cerámicas y resina con prueba digital 3D.', tag: 'Estética' },
            { name: 'Ortodoncia Invisible', description: 'Alineadores transparentes sin brackets.', tag: 'Ortodoncia' }
          ],
          photoChecklist: [
            { item: 'Recepción y consultorios', count: 4, tip: 'Luz impecable y tecnología 3D visible.', filenameExample: 'clinica-dental-recepcion-poblado-medellin.jpg' }
          ],
          preventiveFaqs: [
            { question: '¿La valoración incluye escaneo 3D?', answer: 'Sí, incluye diagnóstico completo digital en la primera cita.' }
          ],
          verificationGuide: {
            title: 'Verificación en Consultorio Médico',
            overview: 'Muestra placa exterior, títulos médicos y sillón odontológico.',
            cameraTake1: '0-15s: Placa exterior con número de consultorio.',
            cameraTake2: '15-40s: Entrada y unidad dental con instrumental médico.',
            cameraTake3: '40-60s: Software de gestión médica y datáfono en recepción.',
            documents: ['Registro médico / NIT', 'Contrato o factura del consultorio']
          },
          whatsappOnboardingMessage: 'Estimado Dr. Sonrisas, tenemos listo el expediente para crear su ficha en Google Maps en Medellín El Poblado. Requerimos las fotos y video de 60s para iniciar.'
        }
      },
      {
        id: 'dos-autospa-03',
        advisorId: 'adv-brayan',
        advisorName: 'Brayan • Director General & Founder',
        advisorPhone: '+573058314049',
        clientName: 'AutoSpa Premium Detailing & Cerámico',
        category: 'Taller / Automotriz',
        city: 'Cali',
        neighborhood: 'Granada',
        googleUrl: 'https://maps.google.com/?cid=987654321',
        mode: 'create',
        status: 'closed',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        data: {
          optimizedTitle: 'AutoSpa Premium Detailing | Corrección de Pintura & Recubrimiento Cerámico',
          primaryCategory: 'Servicio de lavado y detallado de automóviles',
          secondaryCategories: ['Taller de chapa y pintura', 'Tienda de repuestos'],
          commercialDescription: 'Estética automotriz de alta gama en Cali Granada. Recubrimientos cerámicos 9H, corrección de pintura en 3 pasos y detailing interior a vapor.',
          serviceCatalog: [
            { name: 'Cerámico 9H 5 Años de Garantía', description: 'Protección hidrofóbica extrema y brillo espejo.', tag: 'Servicio Estrella' }
          ],
          photoChecklist: [
            { item: 'Bahía de trabajo con luces LED', count: 3, tip: 'Enfoque de reflejo en pintura corregida.', filenameExample: 'autospa-detailing-cali-granada.jpg' }
          ],
          preventiveFaqs: [
            { question: '¿Cuánto demora el tratamiento cerámico?', answer: 'Entre 24 y 48 horas en cabina climatizada.' }
          ],
          verificationGuide: {
            title: 'Verificación de Taller o Detailing',
            overview: 'Muestra bahía, herramientas profesionales y oficina de recepción.',
            cameraTake1: '0-15s: Aviso exterior y rampa de acceso vehicular.',
            cameraTake2: '15-40s: Bahía de trabajo con pulidoras y autos.',
            cameraTake3: '40-60s: Mostrador de facturación y datáfono.',
            documents: ['RUT del taller', 'Factura de servicios públicos']
          },
          whatsappOnboardingMessage: 'Hola equipo AutoSpa Cali, expediente listo para posicionar su taller en el Top 3 de detailing en Cali. Envíen fotos y video de 60s para activar.'
        }
      }
    ];
    writeDbFile(db);
  }
  return db.studioDossiers;
}

export async function saveStudioDossier(dossier: StudioDossier): Promise<void> {
  const db = ensureDbFile();
  if (!db.studioDossiers) db.studioDossiers = [];
  const idx = db.studioDossiers.findIndex((d) => d.id === dossier.id);
  if (idx >= 0) {
    db.studioDossiers[idx] = { ...dossier, updatedAt: new Date().toISOString() };
  } else {
    db.studioDossiers.unshift(dossier);
  }
  writeDbFile(db);
}

export async function deleteStudioDossier(dossierId: string, isPermanentPurge: boolean = false): Promise<boolean> {
  const db = ensureDbFile();
  if (!db.studioDossiers) return false;
  if (isPermanentPurge) {
    db.studioDossiers = db.studioDossiers.filter((d) => d.id !== dossierId);
  } else {
    const item = db.studioDossiers.find((d) => d.id === dossierId);
    if (item) {
      item.deletedByAdvisor = true;
      item.deletedAt = new Date().toISOString();
    } else {
      return false;
    }
  }
  writeDbFile(db);
  return true;
}

export async function restoreStudioDossier(dossierId: string): Promise<boolean> {
  const db = ensureDbFile();
  if (!db.studioDossiers) return false;
  const item = db.studioDossiers.find((d) => d.id === dossierId);
  if (item) {
    item.deletedByAdvisor = false;
    delete item.deletedAt;
    writeDbFile(db);
    return true;
  }
  return false;
}

export const SEED_STUDIO_LANDING_PAGES: StudioLandingPage[] = [
  {
    id: 'lp-sonrisas-01',
    slug: 'clinica-dental-sonrisas',
    advisorId: 'adv-luisma',
    advisorName: 'Luisma • Director General',
    advisorPhone: '+573058314049',
    businessName: 'Clínica Dental Estética Sonrisas',
    category: 'Odontología & Estética Dental',
    city: 'Medellín • El Poblado',
    phone: '+573058314049',
    whatsappMessage: 'Hola Clínica Sonrisas, vi su página web oficial y deseo agendar una valoración odontológica con escaneo 3D.',
    status: 'active',
    theme: {
      primaryColor: '#059669',
      accentColor: '#10B981',
      bgColor: '#030712',
      template: 'medical_clean',
    },
    headline: 'La Sonrisa que Siempre Soñaste en Medellín',
    subheadline: 'Especialistas en Diseño de Sonrisa 3D, Ortodoncia Invisible e Implantes sin dolor. Tecnología digital avanzada en El Poblado.',
    callToAction: 'Agendar Valoración 3D por WhatsApp',
    offerBadge: '⚡ OFERTA EXCLUSIVA HOY: 40% OFF en Escaneo 3D y Diagnóstico',
    offerCountdownHours: 4,
    services: [
      {
        name: 'Diseño de Sonrisa Digital 3D',
        description: 'Carillas cerámicas y resina de alta estética con simulación digital previa para visualizar tu resultado antes de iniciar.',
        price: 'Desde $180 USD',
        tag: 'Más Solicitado',
      },
      {
        name: 'Ortodoncia Invisible (Alineadores)',
        description: 'Dientes alineados sin alambres ni brackets visibles. Cómodos, removibles y prácticamente imperceptibles.',
        price: 'Financiación 0%',
        tag: 'Alta Tecnología',
      },
      {
        name: 'Blanqueamiento Láser Clínico',
        description: 'Aclara hasta 4 tonos en una sola sesión de 45 minutos con tecnología fría que no causa sensibilidad.',
        price: 'Promoción $89 USD',
        tag: 'Sesión Única',
      },
      {
        name: 'Implantes Dentales Guiados por Computador',
        description: 'Recupera tus dientes fijos con microcirugía guiada en 3D, máxima precisión y recuperación rápida.',
        price: 'Valoración Gratuita',
        tag: 'Cirugía Avanzada',
      },
    ],
    reviews: [
      {
        author: 'Carolina Restrepo V.',
        rating: 5,
        text: '¡La mejor experiencia odontológica de mi vida! El diseño de sonrisa quedó 100% natural y la atención del equipo en El Poblado es insuperable. Totalmente recomendados.',
        date: 'Hace 3 días',
      },
      {
        author: 'Juan Felipe Echeverry',
        rating: 5,
        text: 'Inicié el tratamiento de alineadores invisibles hace 4 meses y el cambio es impresionante. No se notan para nada y no tuve dolor. Instalaciones 5 estrellas.',
        date: 'Hace 1 semana',
      },
      {
        author: 'Mariana Gómez S.',
        rating: 5,
        text: 'Me hice el blanqueamiento láser y quedé fascinada con los resultados en menos de una hora. Cero sensibilidad. La puntualidad y la limpieza son de 10.',
        date: 'Hace 2 semanas',
      },
    ],
    testimonials: [
      {
        name: 'Dra. Valentina Morales',
        role: 'Paciente VIP • Medellín',
        quote: 'Prestigia y Clínica Sonrisas superaron todas mis expectativas. Recomiendo a ojos cerrados a todo su equipo médico.',
      },
      {
        name: 'Carlos Mario Henao',
        role: 'Empresario • Medellín',
        quote: 'Excelente tecnología digital. El escaneo 3D me mostró exactamente cómo quedaría mi sonrisa antes de empezar.',
      },
    ],
    features: {
      showLiveOpen: true,
      showUrgencyBanner: true,
      showFomoPopups: true,
      showReviewCarousel: true,
      showWazeButton: true,
      showPrestigiaBadge: true,
    },
    heroImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    beforeAfter: {
      beforeUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1000&q=80',
      afterUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1000&q=80',
      title: 'Caso Clínico: Carillas Cerámicas & Diseño de Sonrisa 3D',
      labelBefore: 'Antes: Desalineación y Tono Opaco',
      labelAfter: 'Después: Sonrisa Natural y Armónica',
    },
    statHighlights: [
      { value: '4.9 ★', label: 'Google Maps' },
      { value: '+1,850', label: 'Pacientes Satisfechos' },
      { value: '100%', label: 'Tecnología Sin Dolor' },
      { value: '12 Años', label: 'Trayectoria Clínica' },
    ],
    faqs: [
      {
        question: '¿La valoración inicial y el escaneo 3D tienen algún costo?',
        answer: 'Durante esta semana la consulta de valoración con escaneo intraoral 3D está 100% bonificada al reservar tu turno por WhatsApp.',
      },
      {
        question: '¿Los tratamientos de diseño o implantes duelen?',
        answer: 'Absolutamente no. Empleamos tecnología de anestesia digital computarizada sin jeringa y microcirugía guiada en 3D para una experiencia placentera y libre de molestias.',
      },
      {
        question: '¿Tienen opciones de financiación o facilidades de pago?',
        answer: 'Sí, disponemos de planes de financiación directa sin intereses, cuotas mensuales y recibimos todas las tarjetas de crédito y transferencias bancarias.',
      },
      {
        question: '¿Cuentan con parqueadero en la clínica?',
        answer: 'Sí, contamos con bahía privada y parqueadero subterráneo con vigilancia las 24 horas para todos nuestros pacientes en El Poblado.',
      },
    ],
    address: 'Calle 10A # 36-24, El Poblado, Medellín, Antioquia',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lp-autospa-02',
    slug: 'autospa-detailing-cali',
    advisorId: 'adv-luisma',
    advisorName: 'Luisma • Director General',
    advisorPhone: '+573058314049',
    businessName: 'AutoSpa Premium Detailing & Cerámico',
    category: 'Estética Automotriz & Detailing',
    city: 'Cali • Granada',
    phone: '+573058314049',
    whatsappMessage: 'Hola AutoSpa Cali, vi su página web y deseo agendar un tratamiento cerámico 9H con cupón de descuento.',
    status: 'active',
    theme: {
      primaryColor: '#D97706',
      accentColor: '#F59E0B',
      bgColor: '#030712',
      template: 'executive_dark',
    },
    headline: 'El Brillo Espejo y Protección Cerámica 9H que tu Auto Merece',
    subheadline: 'Corrección de pintura en 3 pasos, recubrimiento cerámico garantizado por 5 años y detailing de interiores a vapor en Cali.',
    callToAction: 'Reservar Cupo Cerámico por WhatsApp',
    offerBadge: '🔥 CUPOS LIMITADOS: 25% OFF en Cerámico 9H + Lavado de Motor Gratis',
    offerCountdownHours: 3,
    services: [
      {
        name: 'Recubrimiento Cerámico 9H (5 Años)',
        description: 'Protección hidrofóbica extrema contra rayos UV, lluvia ácida y rayones superficiales con acabado espejo.',
        price: 'Desde $190 USD',
        tag: 'Servicio Estrella',
      },
      {
        name: 'Corrección de Pintura en 3 Pasos',
        description: 'Eliminación del 95% de micro-rayones (swirls), marcas de agua y hologramas devolviendo la profundidad del color.',
        price: 'Cotización Inmediata',
        tag: 'Alta Precisión',
      },
      {
        name: 'Detailing Interior a Vapor & Desinfección',
        description: 'Limpieza profunda de tapicería de cuero o tela, techos y alfombras con extracción y eliminación de olores al 99.9%.',
        price: '$65 USD',
        tag: 'Higiene Total',
      },
    ],
    reviews: [
      {
        author: 'Andrés Camilo P.',
        rating: 5,
        text: 'Le aplicaron cerámico 9H a mi camioneta y quedó mejor que recién salida de concesionario. El agua resbala sola. 100% recomendados en Granada.',
        date: 'Hace 4 días',
      },
      {
        author: 'Guillermo Henao',
        rating: 5,
        text: 'Excelente servicio y puntualidad. El detailing interior dejó la tapicería de cuero como nueva y el olor a nuevo volvió. Gran trabajo.',
        date: 'Hace 2 semanas',
      },
    ],
    testimonials: [
      {
        name: 'Santiago Arango',
        role: 'Cliente Frecuente BMW',
        quote: 'El mejor taller de detailing en Cali. Cuidan cada milímetro de la pintura con la máxima dedicación.',
      },
    ],
    features: {
      showLiveOpen: true,
      showUrgencyBanner: true,
      showFomoPopups: true,
      showReviewCarousel: true,
      showWazeButton: true,
      showPrestigiaBadge: true,
    },
    heroImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
    beforeAfter: {
      beforeUrl: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=1000&q=80',
      afterUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
      title: 'Corrección de Pintura en 3 Pasos + Sellado Nanocerámico 9H',
      labelBefore: 'Antes: Pintura Opaca y Swirls',
      labelAfter: 'Después: Brillo Espejo Wet Look',
    },
    statHighlights: [
      { value: '5.0 ★', label: 'Google Maps' },
      { value: '9H Real', label: 'Dureza Nanocerámica' },
      { value: '5 Años', label: 'Garantía Escrita' },
      { value: '+920', label: 'Vehículos Tratados' },
    ],
    faqs: [
      {
        question: '¿Cuánto tiempo dura la aplicación del cerámico 9H?',
        answer: 'El proceso toma entre 24 y 36 horas en cabina hermética climatizada para asegurar el secado y curado molecular con lámparas infrarrojas.',
      },
      {
        question: '¿Cómo mantengo el recubrimiento cerámico?',
        answer: 'Entregamos un kit de mantenimiento de champú pH neutro y un sellador express. El lavado toma la mitad de tiempo ya que la suciedad resbala sola.',
      },
    ],
    address: 'Av. 9 Norte # 14N-32, Barrio Granada, Cali, Valle',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function getAllStudioLandingPages(): Promise<StudioLandingPage[]> {
  const db = ensureDbFile();
  if (!db.studioLandingPages || db.studioLandingPages.length === 0) {
    db.studioLandingPages = SEED_STUDIO_LANDING_PAGES;
    writeDbFile(db);
  }
  return db.studioLandingPages;
}

export async function getStudioLandingPageBySlug(slug: string): Promise<StudioLandingPage | null> {
  const pages = await getAllStudioLandingPages();
  const match = pages.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
  return match || null;
}

export async function saveStudioLandingPage(page: StudioLandingPage): Promise<void> {
  const db = ensureDbFile();
  if (!db.studioLandingPages) db.studioLandingPages = [];
  const idx = db.studioLandingPages.findIndex((p) => p.id === page.id || p.slug === page.slug);
  if (idx >= 0) {
    db.studioLandingPages[idx] = { ...page, updatedAt: new Date().toISOString() };
  } else {
    db.studioLandingPages.unshift(page);
  }
  writeDbFile(db);
}

export async function deleteStudioLandingPage(idOrSlug: string): Promise<boolean> {
  const db = ensureDbFile();
  if (!db.studioLandingPages) return false;
  db.studioLandingPages = db.studioLandingPages.filter((p) => p.id !== idOrSlug && p.slug !== idOrSlug);
  writeDbFile(db);
  return true;
}
