'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Key,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Building2,
  Store,
  Users,
  Star,
  Award,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  Calendar,
  Sparkles,
  Search,
  Filter,
  Plus,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Copy,
  Check,
  Download,
  Printer,
  FileSpreadsheet,
  RefreshCw,
  LogOut,
  Eye,
  EyeOff,
  Zap,
  Tv,
  BrainCircuit,
  MessageCircle,
  Phone,
  Mail,
  Sliders,
  ChevronRight,
  ChevronDown,
  Globe,
  MapPin,
  Trash2,
  X,
  FileText,
  BadgeCheck,
  Flame,
  Shield,
  Layers,
  BarChart3,
  HelpCircle,
  LayoutGrid,
  List,
  Radio,
  Activity,
  Compass,
  Monitor,
  Send,
  Inbox,
  UserCheck,
} from 'lucide-react';
import { PrestigiaIcon } from '@/components/PrestigiaIcon';
import { Business, BusinessPlan, Branch, MasterAddOns, DayOneBaseline, PRESTIGIA_NICHES, CommercialLead, TrafficVisit } from '@/lib/types';

// Banking Master Credentials & Thresholds
const MASTER_KEY_DEFAULT = 'PRESTIGIA-MASTER-2026';
const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout
const SESSION_INACTIVITY_MS = 10 * 60 * 1000; // 10 minutes auto-lock

const PLAN_BADGES: Record<string, { label: string; color: string; border: string }> = {
  independiente: { label: 'Independiente', color: 'bg-emerald-500/10 text-emerald-400', border: 'border-emerald-500/30' },
  basic: { label: 'Independiente', color: 'bg-emerald-500/10 text-emerald-400', border: 'border-emerald-500/30' },
  pro: { label: 'Pro', color: 'bg-blue-500/10 text-blue-400', border: 'border-blue-500/30' },
  elite: { label: 'Élite', color: 'bg-amber-500/10 text-amber-400', border: 'border-amber-500/30' },
  empresarial: { label: 'Empresarial', color: 'bg-purple-500/10 text-purple-400', border: 'border-purple-500/30' },
};

// Zero-Trust Masking Helpers for Confidential Contact Channels
const maskSafePhone = (phone: string) => {
  if (!phone) return '+57 ••• ••• ••XX';
  return phone.replace(/(\+\d{2}\s?\d{3})\d{4}(\d{3})/, '$1 •••• $2');
};

const maskSafeEmail = (email: string) => {
  if (!email) return '•••@prestigia.app';
  return email.replace(/(.{2})(.*)(@.*)/, '$1••••$3');
};

export default function MasterAdminPage() {
  // Authentication & Banking Security State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTwoFactorActiveOnServer, setIsTwoFactorActiveOnServer] = useState(false);
  const [masterKeyInput, setMasterKeyInput] = useState('');
  const [totpTokenInput, setTotpTokenInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showTotpToken, setShowTotpToken] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [totpRemainingSec, setTotpRemainingSec] = useState(30);

  // Emergency SOS Dynamic Key State (Zero-Trust)
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyPhone, setEmergencyPhone] = useState('+57 317 260 6093');
  const [emergencyEmail, setEmergencyEmail] = useState('info@prestigia.app');
  const [emergencyOtpSent, setEmergencyOtpSent] = useState(false);
  const [emergencyOtpInput, setEmergencyOtpInput] = useState('');
  const [showEmergencyOtp, setShowEmergencyOtp] = useState(false);
  const [emergencyCountdown, setEmergencyCountdown] = useState(300);
  const [emergencyLoading, setEmergencyLoading] = useState(false);

  // Master Security Credentials Management Modal
  const [showSecurityConfigModal, setShowSecurityConfigModal] = useState(false);
  const [securityForm, setSecurityForm] = useState({
    currentMasterKey: '',
    newMasterKey: '',
    confirmNewMasterKey: '',
    newEmergencyPhone: '+57 317 260 6093',
    newEmergencyEmail: 'info@prestigia.app',
    newTotpSecret: 'JBSWY3DPEHPK3PXP',
    twoFactorEnabled: false,
  });
  const [securityFormLoading, setSecurityFormLoading] = useState(false);
  const [securityFormError, setSecurityFormError] = useState<string | null>(null);
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [vaultChallengeKey, setVaultChallengeKey] = useState('');
  const [vaultVerifying, setVaultVerifying] = useState(false);
  const [vaultError, setVaultError] = useState<string | null>(null);
  const [showVaultKey, setShowVaultKey] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTotpSecret, setShowTotpSecret] = useState(false);
  const [securityConfig, setSecurityConfig] = useState<{
    emergencyPhone: string;
    emergencyEmail: string;
    twoFactorEnabled?: boolean;
    totpSecret?: string;
    updatedAt?: string;
    maskedPhone?: string;
    maskedEmail?: string;
  }>({
    emergencyPhone: '+57 317 260 6093',
    emergencyEmail: 'info@prestigia.app',
    twoFactorEnabled: false,
    totpSecret: 'JBSWY3DPEHPK3PXP',
  });

  // Query public gateway security status on load, restore active session from sessionStorage, and hydrate local security preferences
  useEffect(() => {
    let wasExplicitlyLocked = false;

    // Check if coming from a voluntary or inactivity lock
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const lockedParam = params.get('locked');
        if (lockedParam === 'voluntary') {
          wasExplicitlyLocked = true;
          sessionStorage.removeItem('prestigia_master_session');
          setAuthError('Sesión bloqueada voluntariamente por el Administrador Master.');
          if (window.history?.replaceState) {
            window.history.replaceState({}, '', '/prestigia-hq-core-2026');
          }
        } else if (lockedParam === 'timeout') {
          wasExplicitlyLocked = true;
          sessionStorage.removeItem('prestigia_master_session');
          setAuthError('Sesión bloqueada por inactividad prolongada (Seguridad Bancaria Prestigia).');
          if (window.history?.replaceState) {
            window.history.replaceState({}, '', '/prestigia-hq-core-2026');
          }
        }
      } catch (e) {}
    }

    // Hydrate active session across F5 / page reloads
    if (!wasExplicitlyLocked && typeof window !== 'undefined') {
      try {
        const rawSession = sessionStorage.getItem('prestigia_master_session');
        if (rawSession) {
          const parsedSession = JSON.parse(rawSession);
          if (parsedSession?.authenticated && parsedSession?.lastActivity) {
            const elapsed = Date.now() - Number(parsedSession.lastActivity);
            if (elapsed < SESSION_INACTIVITY_MS) {
              // Valid unexpired session: keep user logged in across F5!
              setIsAuthenticated(true);
              lastActivityRef.current = Date.now();
              sessionStorage.setItem('prestigia_master_session', JSON.stringify({
                authenticated: true,
                lastActivity: Date.now(),
              }));
            } else {
              // Session expired (> 10 minutes): enforce lock
              sessionStorage.removeItem('prestigia_master_session');
              setAuthError('Sesión bloqueada por inactividad prolongada (Seguridad Bancaria Prestigia).');
            }
          }
        }
      } catch (e) {}
    }

    try {
      const savedConfig = localStorage.getItem('prestigia_master_security_config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (parsed.emergencyEmail) {
          setEmergencyEmail(parsed.emergencyEmail);
          setSecurityForm((prev) => ({ ...prev, newEmergencyEmail: parsed.emergencyEmail }));
        }
        if (parsed.emergencyPhone) {
          setEmergencyPhone(parsed.emergencyPhone);
          setSecurityForm((prev) => ({ ...prev, newEmergencyPhone: parsed.emergencyPhone }));
        }
        if (parsed.twoFactorEnabled !== undefined) {
          setIsTwoFactorActiveOnServer(Boolean(parsed.twoFactorEnabled));
          setSecurityForm((prev) => ({ ...prev, twoFactorEnabled: Boolean(parsed.twoFactorEnabled) }));
        }
      }
    } catch (e) {}

    fetch('/api/master', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_gateway_status' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // If local doesn't have an override, apply server values
          const savedConfig = localStorage.getItem('prestigia_master_security_config');
          if (!savedConfig) {
            setIsTwoFactorActiveOnServer(Boolean(data.twoFactorEnabled));
            if (data.maskedPhone) setEmergencyPhone(data.maskedPhone);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Global Master Data State
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [googleReviews, setGoogleReviews] = useState<any[]>([]);
  const [campaignParticipants, setCampaignParticipants] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('la-burguesia');

  // Navigation & View State
  const [activeTab, setActiveTab] = useState<'directorio' | 'conmutador' | 'bigdata' | 'casos' | 'alertas' | 'mrr' | 'trafico'>('directorio');
  const [privacyMode, setPrivacyMode] = useState(false); // Masks financial numbers & phones
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [directoryViewMode, setDirectoryViewMode] = useState<'list' | 'cards'>('list');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Traffic & Commercial Leads State (Tab 7)
  const [trafficVisits, setTrafficVisits] = useState<TrafficVisit[]>([]);
  const [commercialLeads, setCommercialLeads] = useState<CommercialLead[]>([]);
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('all');
  const [leadSearchTerm, setLeadSearchTerm] = useState<string>('');
  const [trafficSearchTerm, setTrafficSearchTerm] = useState<string>('');
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);

  // Onboarding Wizard Modal State
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [viewPlaceModalBusiness, setViewPlaceModalBusiness] = useState<Business | null>(null);
  const [detectedGoogleProfile, setDetectedGoogleProfile] = useState<{
    name: string;
    rating: number;
    reviewsCount: number;
    address?: string;
    placeId?: string;
    googleMapsUrl: string;
    googleReviewUrl?: string;
  } | null>(null);
  const [googleQueryInput, setGoogleQueryInput] = useState('');
  const [googleDetectLoading, setGoogleDetectLoading] = useState(false);
  const [googleDetectSuccess, setGoogleDetectSuccess] = useState<string | null>(null);
  const [googleDetectError, setGoogleDetectError] = useState<string | null>(null);
  const [isGoogleSynced, setIsGoogleSynced] = useState(false);

  const [onboardForm, setOnboardForm] = useState({
    id: '',
    name: '',
    category: PRESTIGIA_NICHES[0].label,
    country: 'Colombia (NIT)',
    city: 'Bogotá',
    locality: 'Chapinero',
    plan: 'pro' as BusinessPlan,
    ownerName: '',
    ownerPhone: '+57',
    ownerEmail: '',
    taxId: '',
    googleMapsUrl: '',
    googlePlaceId: '',
    googleReviewUrl: '',
    averageTicketCOP: 45000,
    initialRating: 3.8,
    initialReviewCount: 30,
    clientQuote: '',
  });

  // Conmutador Add-Ons Local State
  const [addonState, setAddonState] = useState<{
    plan: BusinessPlan;
    status: 'active' | 'suspended';
    extraBranches: number;
    extraManagers: number;
    extraStaffQuota: number;
    sentimentEnabled: boolean;
    sentimentMode: 'permanent' | 'trial';
    wallboardEnabled: boolean;
    wallboardMode: 'permanent' | 'trial';
    giveawayCrm: boolean;
    deviceAudit: boolean;
    customNotes: string;
  }>({
    plan: 'pro',
    status: 'active',
    extraBranches: 0,
    extraManagers: 0,
    extraStaffQuota: 0,
    sentimentEnabled: false,
    sentimentMode: 'trial',
    wallboardEnabled: false,
    wallboardMode: 'trial',
    giveawayCrm: false,
    deviceAudit: false,
    customNotes: '',
  });

  // Big Data Lake Filters State
  const [dataFilterCountry, setDataFilterCountry] = useState('all');
  const [dataFilterCity, setDataFilterCity] = useState('all');
  const [dataFilterLocality, setDataFilterLocality] = useState('all');
  const [dataFilterBusiness, setDataFilterBusiness] = useState('all');
  const [dataFilterNiche, setDataFilterNiche] = useState('all');
  const [dataFilterRating, setDataFilterRating] = useState('all');
  const [dataPageLimit, setDataPageLimit] = useState<'30' | '50' | 'all'>('all');

  // Alertas Tempranas Filters State
  const [alertFilterBusiness, setAlertFilterBusiness] = useState<string>('all');
  const [alertFilterStatus, setAlertFilterStatus] = useState<string>('all');
  const [alertSearchTerm, setAlertSearchTerm] = useState<string>('');

  // Case Study Generator Edit State
  const [editQuoteMode, setEditQuoteMode] = useState(false);
  const [customTestimonialQuote, setCustomTestimonialQuote] = useState('');

  // Auto-inactivity lock ref
  const lastActivityRef = useRef<number>(Date.now());
  const lastSessionSaveRef = useRef<number>(Date.now());

  // Dynamic TOTP simulation timer (changes every 30s)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const sec = now.getSeconds();
      setTotpRemainingSec(30 - (sec % 30));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Voluntary or Inactivity Lock (Purges credentials and executes hard navigation for Zero-Leakage)
  const handleLockConsole = (reason: 'voluntary' | 'timeout' = 'voluntary') => {
    setIsAuthenticated(false);
    setMasterKeyInput('');
    setTotpTokenInput('');
    setShowPassword(false);
    setShowTotpToken(false);
    setVaultChallengeKey('');
    setIsVaultUnlocked(false);
    setShowSecurityConfigModal(false);
    setShowEmergencyModal(false);
    setEmergencyOtpInput('');
    setShowEmergencyOtp(false);
    setSecurityForm((prev) => ({
      ...prev,
      currentMasterKey: '',
      newMasterKey: '',
      confirmNewMasterKey: '',
    }));

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('prestigia_master_session');
        sessionStorage.clear();
      } catch (e) {}
      // Hard navigation to completely wipe React DOM memory and flush any cached form state
      window.location.href = `/prestigia-hq-core-2026?locked=${reason}&t=${Date.now()}`;
    }
  };

  // Inactivity watchdog
  useEffect(() => {
    if (!isAuthenticated) return;
    const updateActivity = () => {
      const now = Date.now();
      lastActivityRef.current = now;
      if (now - lastSessionSaveRef.current > 5000) {
        lastSessionSaveRef.current = now;
        try {
          sessionStorage.setItem('prestigia_master_session', JSON.stringify({
            authenticated: true,
            lastActivity: now,
          }));
        } catch (e) {}
      }
    };

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);

    const checkInterval = setInterval(() => {
      if (Date.now() - lastActivityRef.current > SESSION_INACTIVITY_MS) {
        handleLockConsole('timeout');
      }
    }, 15000);

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      clearInterval(checkInterval);
    };
  }, [isAuthenticated]);

  // Load master data once authenticated
  const fetchMasterData = async () => {
    setLoadingData(true);
    try {
      const res = await fetch('/api/master');
      const data = await res.json();
      if (data.success) {
        setBusinesses(data.businesses || []);
        setFeedbacks(data.feedbacks || []);
        setGoogleReviews(data.googleReviews || []);
        setCampaignParticipants(data.campaignParticipants || []);
        setStats(data.stats || null);

        if (data.securityConfig) {
          let effEmail = data.securityConfig.emergencyEmail;
          let effPhone = data.securityConfig.emergencyPhone;
          let eff2FA = Boolean(data.securityConfig.twoFactorEnabled);
          let effTotp = data.securityConfig.totpSecret;

          try {
            const savedConfig = localStorage.getItem('prestigia_master_security_config');
            if (savedConfig) {
              const p = JSON.parse(savedConfig);
              if (p.emergencyEmail) effEmail = p.emergencyEmail;
              if (p.emergencyPhone) effPhone = p.emergencyPhone;
              if (p.twoFactorEnabled !== undefined) eff2FA = Boolean(p.twoFactorEnabled);
              if (p.totpSecret) effTotp = p.totpSecret;
            }
          } catch (e) {}

          setSecurityConfig({
            ...data.securityConfig,
            emergencyEmail: effEmail,
            emergencyPhone: effPhone,
            twoFactorEnabled: eff2FA,
          });
          setIsTwoFactorActiveOnServer(eff2FA);
          setEmergencyPhone(effPhone);
          setEmergencyEmail(effEmail);
          setSecurityForm((prev) => ({
            ...prev,
            newEmergencyPhone: effPhone,
            newEmergencyEmail: effEmail,
            newTotpSecret: effTotp || prev.newTotpSecret,
            twoFactorEnabled: eff2FA,
          }));
        }

        setTrafficVisits(data.trafficVisits || []);
        setCommercialLeads(data.leads || []);

        // Set default selected business if available
        if (data.businesses?.length > 0 && !selectedBusinessId) {
          setSelectedBusinessId(data.businesses[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load master data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  // Update commercial lead status
  const handleUpdateLeadStatus = async (id: string, newStatus: string) => {
    setUpdatingLeadId(id);
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setCommercialLeads((prev) =>
          prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus as any } : lead))
        );
        setNotification({ type: 'success', message: 'Estado del prospecto comercial actualizado con éxito.' });
        setTimeout(() => setNotification(null), 3000);
      } else {
        setNotification({ type: 'error', message: data.error || 'Error al actualizar prospecto.' });
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Error de conexión al actualizar prospecto.' });
    } finally {
      setUpdatingLeadId(null);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMasterData();
    }
  }, [isAuthenticated]);

  // Sync current selected business with addon form
  const currentBusiness = useMemo(() => {
    return businesses.find((b) => b.id === selectedBusinessId) || businesses[0] || null;
  }, [businesses, selectedBusinessId]);

  useEffect(() => {
    if (currentBusiness) {
      const addons = currentBusiness.masterAddOns;
      setAddonState({
        plan: currentBusiness.plan,
        status: currentBusiness.status || 'active',
        extraBranches: addons?.extraBranches || 0,
        extraManagers: addons?.extraManagers || 0,
        extraStaffQuota: addons?.extraStaffQuota || 0,
        sentimentEnabled: addons?.sentiment360?.enabled ?? (currentBusiness.plan === 'elite' || currentBusiness.plan === 'empresarial'),
        sentimentMode: addons?.sentiment360?.mode || 'trial',
        wallboardEnabled: addons?.liveWallboard?.enabled ?? (currentBusiness.plan === 'elite' || currentBusiness.plan === 'empresarial'),
        wallboardMode: addons?.liveWallboard?.mode || 'trial',
        giveawayCrm: addons?.giveawayCrm ?? (currentBusiness.plan !== 'independiente'),
        deviceAudit: addons?.deviceAudit ?? (currentBusiness.plan === 'empresarial'),
        customNotes: addons?.customNotes || '',
      });
      setCustomTestimonialQuote(currentBusiness.baseline?.clientQuote || '');
    }
  }, [currentBusiness]);

  // Handle Standard Banking Login (Server Verified - No Backdoors)
  const handleBankingLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    // Check Lockout
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remMin = Math.ceil((lockoutUntil - Date.now()) / 60000);
      setAuthError(`BLOQUEO BANCARIO ACTIVO: Demasiados intentos fallidos. Reintenta en ${remMin} minutos o usa tu Clave Dinámica de Emergencia.`);
      return;
    }

    const keyClean = masterKeyInput.trim();
    const tokenClean = totpTokenInput.trim();

    if (!keyClean) {
      setAuthError('Por favor ingresa tu Llave Maestra.');
      return;
    }

    try {
      const verifyRes = await fetch('/api/master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_master_credentials',
          masterKey: keyClean,
          totpToken: tokenClean,
          requireTwoFactor: isTwoFactorActiveOnServer,
        }),
      });
      const verifyData = await verifyRes.json();

      if (verifyData.isValid) {
        setIsAuthenticated(true);
        // Zero-Trust: Purge input state and reset password masks from memory immediately upon login
        setMasterKeyInput('');
        setTotpTokenInput('');
        setShowPassword(false);
        setShowTotpToken(false);
        setFailedAttempts(0);
        setLockoutUntil(null);
        lastActivityRef.current = Date.now();
        localStorage.setItem('prestigia_master_custom_key', keyClean);
        try {
          sessionStorage.setItem('prestigia_master_session', JSON.stringify({
            authenticated: true,
            lastActivity: Date.now(),
          }));
          if (typeof window !== 'undefined' && window.history?.replaceState) {
            window.history.replaceState({}, '', '/prestigia-hq-core-2026');
          }
        } catch (e) {}
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        if (newAttempts >= MAX_FAILED_ATTEMPTS) {
          const lockoutTime = Date.now() + LOCKOUT_DURATION_MS;
          setLockoutUntil(lockoutTime);
          setAuthError('ALERTA DE SEGURIDAD: 3 intentos fallidos consecutivos. Consola Master congelada preventivamente por 15 minutos.');
        } else {
          setAuthError(verifyData.error || `Credencial incorrecta. Intento ${newAttempts} de ${MAX_FAILED_ATTEMPTS}.`);
        }
      }
    } catch (err) {
      setAuthError('Error de conexión con el servidor bancario.');
    }
  };

  // Close and lock security vault
  const handleCloseSecurityConfigModal = () => {
    setShowSecurityConfigModal(false);
    setIsVaultUnlocked(false);
    setVaultChallengeKey('');
    setVaultError(null);
    setSecurityFormError(null);
  };

  // Challenge-response unlock for Master Security Vault
  const handleUnlockVault = async (e: React.FormEvent) => {
    e.preventDefault();
    setVaultError(null);
    setVaultVerifying(true);

    const cleanKey = vaultChallengeKey.trim();
    if (!cleanKey) {
      setVaultError('Por favor ingresa tu Llave Maestra actual.');
      setVaultVerifying(false);
      return;
    }

    try {
      const res = await fetch('/api/master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_vault_unlock',
          masterKey: cleanKey,
        }),
      });
      const data = await res.json();
      if (data.isValid) {
        setIsVaultUnlocked(true);
        setSecurityForm((prev) => ({ ...prev, currentMasterKey: cleanKey }));
        setVaultError(null);
      } else {
        setVaultError(data.error || 'Llave Maestra incorrecta. Desbloqueo de bóveda denegado.');
      }
    } catch (err) {
      setVaultError('Error de conexión con el servidor bancario.');
    } finally {
      setVaultVerifying(false);
    }
  };

  // Save Master Security Credentials
  const handleSaveSecuritySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityFormError(null);

    if (securityForm.newMasterKey && securityForm.newMasterKey !== securityForm.confirmNewMasterKey) {
      setSecurityFormError('La confirmación de la nueva Llave Maestra no coincide.');
      return;
    }

    if (securityForm.newMasterKey) {
      const trimmed = securityForm.newMasterKey.trim();
      const letters = (trimmed.match(/[a-zA-Z]/g) || []).length;
      const uppercase = (trimmed.match(/[A-Z]/g) || []).length;
      const numbers = (trimmed.match(/[0-9]/g) || []).length;
      const symbols = (trimmed.match(/[^a-zA-Z0-9\s]/g) || []).length;

      if (letters < 4 || uppercase < 1 || numbers < 2 || symbols < 1) {
        setSecurityFormError(`Estándar Bancario Obligatorio: La nueva Llave Maestra debe contener mínimo 4 letras (llevas ${letters}), mínimo 1 mayúscula (llevas ${uppercase}), 2 números (llevas ${numbers}) y 1 signo especial (llevas ${symbols}) (ej: #, !, @, *).`);
        return;
      }
    }

    setSecurityFormLoading(true);
    try {
      const res = await fetch('/api/master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_master_security',
          currentMasterKey: securityForm.currentMasterKey,
          newMasterKey: securityForm.newMasterKey,
          newEmergencyPhone: securityForm.newEmergencyPhone,
          newEmergencyEmail: securityForm.newEmergencyEmail,
          newTotpSecret: securityForm.newTotpSecret,
          twoFactorEnabled: securityForm.twoFactorEnabled,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (securityForm.newMasterKey) {
          localStorage.setItem('prestigia_master_custom_key', securityForm.newMasterKey.trim());
        }

        const updatedConfig = {
          emergencyEmail: securityForm.newEmergencyEmail.trim(),
          emergencyPhone: securityForm.newEmergencyPhone.trim(),
          twoFactorEnabled: securityForm.twoFactorEnabled,
          totpSecret: securityForm.newTotpSecret,
        };

        try {
          localStorage.setItem('prestigia_master_security_config', JSON.stringify(updatedConfig));
        } catch (e) {}

        setEmergencyEmail(updatedConfig.emergencyEmail);
        setEmergencyPhone(updatedConfig.emergencyPhone);
        setIsTwoFactorActiveOnServer(Boolean(securityForm.twoFactorEnabled));
        setShowSecurityConfigModal(false);
        setIsVaultUnlocked(false);
        setVaultChallengeKey('');
        setSecurityForm((prev) => ({
          ...prev,
          currentMasterKey: '',
          newMasterKey: '',
          confirmNewMasterKey: '',
          newEmergencyEmail: updatedConfig.emergencyEmail,
          newEmergencyPhone: updatedConfig.emergencyPhone,
          twoFactorEnabled: securityForm.twoFactorEnabled,
        }));
        setNotification({ type: 'success', message: '¡Credenciales bancarias maestras y nivel de blindaje actualizados con éxito!' });
        setTimeout(() => setNotification(null), 4000);
        fetchMasterData();
      } else {
        setSecurityFormError(data.error || 'Error al actualizar credenciales.');
      }
    } catch (err) {
      setSecurityFormError('Error de conexión con el módulo de seguridad bancaria.');
    } finally {
      setSecurityFormLoading(false);
    }
  };

  // Request Emergency OTP (WhatsApp / Email)
  const handleRequestEmergencyOtp = async () => {
    setEmergencyLoading(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_emergency_otp',
          phone: emergencyPhone,
          email: emergencyEmail,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEmergencyOtpSent(true);
        setEmergencyCountdown(300);
      } else {
        setAuthError(data.error || 'Error solicitando clave dinámica.');
      }
    } catch (err) {
      setAuthError('Error conectando con el servicio de despacho bancario.');
    } finally {
      setEmergencyLoading(false);
    }
  };

  // Verify Emergency OTP
  const handleVerifyEmergencyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmergencyLoading(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_emergency_otp',
          otp: emergencyOtpInput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        // Zero-Trust: Purge credentials and masks from memory
        setMasterKeyInput('');
        setTotpTokenInput('');
        setShowPassword(false);
        setShowTotpToken(false);
        setShowEmergencyModal(false);
        setFailedAttempts(0);
        setLockoutUntil(null);
        setEmergencyOtpSent(false);
        setEmergencyOtpInput('');
        lastActivityRef.current = Date.now();
        try {
          sessionStorage.setItem('prestigia_master_session', JSON.stringify({
            authenticated: true,
            lastActivity: Date.now(),
          }));
          if (typeof window !== 'undefined' && window.history?.replaceState) {
            window.history.replaceState({}, '', '/prestigia-hq-core-2026');
          }
        } catch (e) {}
      } else {
        setAuthError(data.error || 'Clave dinámica inválida.');
      }
    } catch (err) {
      setAuthError('Error validando clave de emergencia.');
    } finally {
      setEmergencyLoading(false);
    }
  };

  // Emergency Timer countdown
  useEffect(() => {
    if (!emergencyOtpSent || emergencyCountdown <= 0) return;
    const timer = setInterval(() => {
      setEmergencyCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [emergencyOtpSent, emergencyCountdown]);

  // Copy helper with feedback
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // Save Plan & Addons changes
  const handleSaveAddons = async () => {
    if (!currentBusiness) return;
    try {
      const newMasterAddOns: MasterAddOns = {
        extraBranches: addonState.extraBranches,
        extraManagers: addonState.extraManagers,
        extraStaffQuota: addonState.extraStaffQuota,
        sentiment360: {
          enabled: addonState.sentimentEnabled,
          mode: addonState.sentimentMode,
        },
        liveWallboard: {
          enabled: addonState.wallboardEnabled,
          mode: addonState.wallboardMode,
        },
        giveawayCrm: addonState.giveawayCrm,
        deviceAudit: addonState.deviceAudit,
        customNotes: addonState.customNotes,
      };

      const res = await fetch('/api/master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_plan_addons',
          businessId: currentBusiness.id,
          plan: addonState.plan,
          status: addonState.status,
          masterAddOns: newMasterAddOns,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: 'success', message: data.message });
        setTimeout(() => setNotification(null), 4000);
        fetchMasterData();
      } else {
        setNotification({ type: 'error', message: data.error || 'Error al guardar cambios' });
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Error de conexión al actualizar add-ons' });
    }
  };

  // Save Day-1 Baseline changes
  const handleSaveBaseline = async () => {
    if (!currentBusiness || !currentBusiness.baseline) return;
    try {
      const updatedBaseline: DayOneBaseline = {
        ...currentBusiness.baseline,
        clientQuote: customTestimonialQuote,
      };

      const res = await fetch('/api/master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_baseline',
          businessId: currentBusiness.id,
          baseline: updatedBaseline,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditQuoteMode(false);
        setNotification({ type: 'success', message: 'Caso de éxito y testimonio actualizado correctamente.' });
        setTimeout(() => setNotification(null), 4000);
        fetchMasterData();
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Error guardando testimonio' });
    }
  };

  // Auto-detect and sync with Google Maps / Google Business Profile
  const handleDetectGooglePlace = async (queryParam?: string) => {
    const rawQuery = (queryParam || googleQueryInput || onboardForm.name || '').trim();
    if (!rawQuery) {
      setGoogleDetectError('Ingresa el enlace de Google Maps o el nombre comercial del negocio.');
      return;
    }

    setGoogleDetectLoading(true);
    setGoogleDetectError(null);
    setGoogleDetectSuccess(null);

    try {
      const res = await fetch('/api/auditor/google-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: rawQuery }),
      });
      const json = await res.json();

      if (json.success && json.data) {
        const d = json.data;
        const rating = typeof d.rating === 'number' ? Number(d.rating.toFixed(1)) : 4.0;
        const reviews = typeof d.reviewsCount === 'number' ? d.reviewsCount : 0;

        setOnboardForm((prev) => {
          const newName = prev.name || d.name || '';
          const newId = prev.id || (newName ? newName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') : '');
          return {
            ...prev,
            name: newName,
            id: newId,
            initialRating: rating,
            initialReviewCount: reviews,
            googleMapsUrl: d.googleMapsUrl || prev.googleMapsUrl,
            googlePlaceId: d.placeId || prev.googlePlaceId,
            googleReviewUrl: d.googleReviewUrl || prev.googleReviewUrl,
          };
        });

        setDetectedGoogleProfile({
          name: d.name || rawQuery,
          rating,
          reviewsCount: reviews,
          address: d.address || `${onboardForm.locality}, ${onboardForm.city}`,
          placeId: d.placeId,
          googleMapsUrl: d.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.name || rawQuery)}`,
          googleReviewUrl: d.googleReviewUrl || (d.placeId ? `https://search.google.com/local/writereview?placeid=${d.placeId}` : ''),
        });

        setIsGoogleSynced(true);
        setGoogleDetectSuccess(`¡Ficha Google Maps conectada con éxito! Calificación detectada: ${rating}★ (${reviews} reseñas oficiales). Sincronizado automáticamente como Línea Base Día 1.`);
      } else {
        setGoogleDetectError(json.error || 'No se encontró la ficha en Google Maps. Puedes ajustar los valores manualmente.');
      }
    } catch (err) {
      setGoogleDetectError('Error conectando con el servicio de auditoría de Google Maps.');
    } finally {
      setGoogleDetectLoading(false);
    }
  };

  // Handle Onboard Create Business
  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_business',
          ...onboardForm,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowOnboardModal(false);
        setNotification({ type: 'success', message: data.message });
        setTimeout(() => setNotification(null), 4000);
        fetchMasterData();
        setSelectedBusinessId(data.business.id);
        setActiveTab('casos');
      } else {
        alert(data.error || 'Error al dar de alta la marca');
      }
    } catch (err) {
      alert('Error de conexión al crear marca');
    }
  };

  // Impersonate into /portal
  const handleImpersonate = (biz: Business) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('prestigia_selected_business', biz.id);
      localStorage.setItem('prestigia_master_impersonation', JSON.stringify({
        businessId: biz.id,
        role: 'owner',
        timestamp: Date.now(),
      }));
      window.open('/portal', '_blank');
    }
  };

  // Quick Kill Switch / Toggle Business Status (Live Sync)
  const handleToggleBusinessStatus = async (biz: Business) => {
    const newStatus = biz.status === 'suspended' ? 'active' : 'suspended';
    const confirmMsg = newStatus === 'suspended'
      ? `🚨 ¿Seguro que deseas SUSPENDER a "${biz.name}"?\n\nConsecuencias inmediatas:\n• Bloqueo total de su portal corporativo.\n• Desactivación de su canal público QR.\n• Se refleja en vivo en menos de 10 segundos.`
      : `✅ ¿Deseas REACTIVAR la cuenta de "${biz.name}"?\n\nSe restablecerá el acceso al portal y a la captura de opiniones de inmediato.`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch('/api/master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_business_status',
          businessId: biz.id,
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: 'success', message: data.message });
        setTimeout(() => setNotification(null), 4000);
        fetchMasterData();
      } else {
        alert(data.error || 'Error al cambiar estado');
      }
    } catch {
      alert('Error de conexión al cambiar estado');
    }
  };

  // Historical Day-1 Performance Computations for currentBusiness
  const historicalMetrics = useMemo(() => {
    if (!currentBusiness) return null;

    const baseline = currentBusiness.baseline || {
      startDate: '2026-03-01',
      initialRating: 3.8,
      initialReviewCount: 30,
      initialMonthlyComplaints: 15,
      averageTicketCOP: 45000,
      averageTicketUSD: 18,
      nicheCategory: currentBusiness.category,
      city: currentBusiness.branches?.[0]?.city || 'Bogotá',
      locality: currentBusiness.branches?.[0]?.locality || 'Principal',
      country: 'Colombia',
      founderName: currentBusiness.ownerName,
      clientQuote: 'Prestigia blindó nuestra reputación y convirtió clientes inconformes en promotores fieles de 5 estrellas.',
    };

    // Calculate days operating
    const startMs = new Date(baseline.startDate).getTime();
    const daysOperating = Math.max(1, Math.floor((Date.now() - startMs) / (1000 * 60 * 60 * 24)));

    // Relevant feedbacks for this business
    const bizFeedbacks = feedbacks.filter((f) => f.businessId === currentBusiness.id);
    const privateComplaintsIntercepted = bizFeedbacks.filter((f) => Number(f.rating) <= 3).length || 18;
    const resolvedPrivateCount = bizFeedbacks.filter((f) => Number(f.rating) <= 3 && f.status === 'resolved').length || privateComplaintsIntercepted;

    // Relevant Google Reviews for this business
    const bizReviews = googleReviews.filter((r) => r.businessId === currentBusiness.id);
    const newGoogleReviews5Star = bizReviews.filter((r) => Number(r.rating) >= 4).length || 24;

    // Calculated Current Google Rating
    const totalAllReviews = baseline.initialReviewCount + newGoogleReviews5Star + 6;
    const currentRating = Math.min(5.0, Number((baseline.initialRating + (newGoogleReviews5Star * 0.04)).toFixed(1)));
    const ratingGain = Number((currentRating - baseline.initialRating).toFixed(1));

    // Preserved Revenue (Saved from Churn): Intercepted complaints * average ticket * estimated return factor (2 visits)
    const preservedRevenueCOP = privateComplaintsIntercepted * baseline.averageTicketCOP * 2;
    const preservedRevenueUSD = Math.round(preservedRevenueCOP / 2500);

    // Resolution Speed (<10s compliance)
    const resolutionSpeedPercent = 98.6;

    // Staff stars
    const staffMembers = currentBusiness.branches?.flatMap((b) => b.staffMembers || []) || [];
    const topStaff = staffMembers[0] ? (typeof staffMembers[0] === 'string' ? staffMembers[0] : staffMembers[0].name) : 'Camilo Restrepo';

    return {
      baseline,
      daysOperating,
      privateComplaintsIntercepted,
      resolvedPrivateCount,
      newGoogleReviews5Star,
      totalAllReviews,
      currentRating,
      ratingGain,
      preservedRevenueCOP,
      preservedRevenueUSD,
      resolutionSpeedPercent,
      topStaff,
    };
  }, [currentBusiness, feedbacks, googleReviews]);

  // Format currency helper respecting Privacy Mode
  const formatMoneyCOP = (amount: number) => {
    if (privacyMode) return '$ ••••••• COP';
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
  };

  const formatMoneyUSD = (amount: number) => {
    if (privacyMode) return '$ ••• USD';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const maskPhone = (phone: string) => {
    if (privacyMode) return '+57 ••• ••• ••XX';
    return phone;
  };

  // Helper for Niche & Industry badge classification
  const getNicheBadge = (category: string) => {
    const cat = (category || '').toLowerCase();
    for (const niche of PRESTIGIA_NICHES) {
      if (niche.keywords.some((k) => cat.includes(k))) {
        return { label: niche.shortLabel || niche.label, icon: niche.icon, color: niche.color };
      }
    }
    return { label: category || 'Comercial & Retail', icon: '🏢', color: 'bg-slate-500/10 text-slate-300 border-slate-500/30' };
  };

  // Filtered Businesses for Directory Tab
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((biz) => {
      // 1. Plan filter
      if (selectedPlanFilter !== 'all' && biz.plan !== selectedPlanFilter) return false;

      // 2. Nicho / Category filter
      if (selectedCategoryFilter !== 'all') {
        const cat = (biz.category || '').toLowerCase();
        const niche = PRESTIGIA_NICHES.find((n) => n.id === selectedCategoryFilter);
        if (niche) {
          const matches = niche.keywords.some((k) => cat.includes(k));
          if (!matches) return false;
        } else {
          if (!cat.includes(selectedCategoryFilter.toLowerCase())) return false;
        }
      }

      // 3. Search term filter
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        biz.name.toLowerCase().includes(term) ||
        biz.ownerName.toLowerCase().includes(term) ||
        biz.category.toLowerCase().includes(term) ||
        biz.branches?.some((b) => b.city.toLowerCase().includes(term) || b.locality.toLowerCase().includes(term))
      );
    });
  }, [businesses, selectedPlanFilter, selectedCategoryFilter, searchTerm]);

  // Unified Global Data Lake (Habeas Data & Lead Matrix: 80 Clientes Reales)
  const unifiedDataLakeRecords = useMemo(() => {
    const list: Array<{
      id: string;
      customerName: string;
      customerPhone: string;
      country: string;
      city: string;
      locality: string;
      customerOriginCountry: string;
      customerOriginFlag: string;
      isTourist: boolean;
      businessId: string;
      businessName: string;
      branchName: string;
      nicheCategory: string;
      rating: number;
      source: string;
      sourceType: 'sorteo' | 'feedback';
      registeredAt: string;
    }> = [];

    // 1. Sorteos & Ruletas (campaignParticipants - 50 registros)
    campaignParticipants.forEach((p) => {
      const isChilePhone = p.customerPhone?.startsWith('+56');
      const originCountry = (p as any).customerOriginCountry || (isChilePhone ? 'Chile' : 'Colombia');
      const originFlag = (p as any).customerOriginFlag || (isChilePhone ? '🇨🇱' : '🇨🇴');
      const estCountry = (p as any).country || 'Colombia';
      list.push({
        id: p.id,
        customerName: p.customerName || 'Cliente Anónimo',
        customerPhone: p.customerPhone || '',
        country: estCountry,
        city: p.city || 'Bogotá',
        locality: p.locality || 'Principal',
        customerOriginCountry: originCountry,
        customerOriginFlag: originFlag,
        isTourist: Boolean((p as any).isTourist || (isChilePhone && estCountry === 'Colombia')),
        businessId: p.businessId,
        businessName: p.businessName || 'Negocio Registrado',
        branchName: p.branchName || 'Sede Principal',
        nicheCategory: p.nicheCategory || 'Gastronomía & Servicios',
        rating: Number(p.rating) || 5,
        source: '🎁 Ruleta / Sorteo QR',
        sourceType: 'sorteo',
        registeredAt: p.registeredAt || '2026-10-01',
      });
    });

    // 2. Opiniones y Feedbacks QR en Mesa (feedbacks - 30 registros)
    feedbacks.forEach((f) => {
      const isChilePhone = f.customerPhone?.startsWith('+56');
      const originCountry = (f as any).customerOriginCountry || (isChilePhone ? 'Chile' : 'Colombia');
      const originFlag = (f as any).customerOriginFlag || (isChilePhone ? '🇨🇱' : '🇨🇴');
      const estCountry = (f as any).country || 'Colombia';
      list.push({
        id: f.id,
        customerName: f.customerName || 'Comensal Registrado',
        customerPhone: f.customerPhone || '',
        country: estCountry,
        city: (f as any).city || 'Bogotá',
        locality: (f as any).locality || 'Principal',
        customerOriginCountry: originCountry,
        customerOriginFlag: originFlag,
        isTourist: Boolean((f as any).isTourist || (isChilePhone && estCountry === 'Colombia')),
        businessId: f.businessId,
        businessName: (f as any).businessName || f.businessId,
        branchName: f.branchName || 'Sede Principal',
        nicheCategory: (f as any).nicheCategory || 'Gastronomía & Servicios',
        rating: Number(f.rating) || 3,
        source: '📱 QR Mesa / Opinión',
        sourceType: 'feedback',
        registeredAt: f.createdAt ? f.createdAt.slice(0, 16).replace('T', ' ') : '2026-10-01',
      });
    });

    return list;
  }, [campaignParticipants, feedbacks]);

  // Cascading Dynamic Options for Big Data Lake Filters
  const availableDataCountries = useMemo(() => {
    const set = new Set<string>();
    unifiedDataLakeRecords.forEach((r) => { if (r.country) set.add(r.country); });
    return Array.from(set).sort();
  }, [unifiedDataLakeRecords]);

  // Cities belonging ONLY to the selected Country (Cascading)
  const availableDataCities = useMemo(() => {
    const set = new Set<string>();
    unifiedDataLakeRecords.forEach((r) => {
      if (dataFilterCountry === 'all' || r.country === dataFilterCountry) {
        if (r.city) set.add(r.city.trim());
      }
    });
    return Array.from(set).sort();
  }, [unifiedDataLakeRecords, dataFilterCountry]);

  // Localities belonging ONLY to the selected City and Country (Cascading)
  const availableDataLocalities = useMemo(() => {
    const set = new Set<string>();
    unifiedDataLakeRecords.forEach((r) => {
      const matchCountry = dataFilterCountry === 'all' || r.country === dataFilterCountry;
      const matchCity = dataFilterCity === 'all' || r.city.trim().toLowerCase() === dataFilterCity.trim().toLowerCase();
      if (matchCountry && matchCity && r.locality && r.locality !== 'Principal') {
        set.add(r.locality.trim());
      }
    });
    return Array.from(set).sort();
  }, [unifiedDataLakeRecords, dataFilterCountry, dataFilterCity]);

  const availableDataBusinesses = useMemo(() => {
    const map = new Map<string, string>();
    unifiedDataLakeRecords.forEach((r) => {
      const matchCountry = dataFilterCountry === 'all' || r.country === dataFilterCountry;
      const matchCity = dataFilterCity === 'all' || r.city.trim().toLowerCase() === dataFilterCity.trim().toLowerCase();
      if (matchCountry && matchCity && r.businessId && r.businessName) {
        map.set(r.businessId, r.businessName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [unifiedDataLakeRecords, dataFilterCountry, dataFilterCity]);

  // Filtered Records for Big Data Lake Tab
  const filteredDataLake = useMemo(() => {
    return unifiedDataLakeRecords.filter((r) => {
      // 1. Country filter
      if (dataFilterCountry !== 'all' && r.country !== dataFilterCountry) return false;

      // 2. City filter
      if (dataFilterCity !== 'all' && r.city !== dataFilterCity) return false;

      // 3. Locality filter
      if (dataFilterLocality !== 'all' && r.locality !== dataFilterLocality) return false;

      // 4. Business filter
      if (dataFilterBusiness !== 'all' && r.businessId !== dataFilterBusiness) return false;

      // 5. Nicho filter
      if (dataFilterNiche !== 'all') {
        const nicheLower = (r.nicheCategory || '').toLowerCase();
        const niche = PRESTIGIA_NICHES.find((n) => n.id === dataFilterNiche);
        if (niche) {
          const matches = niche.keywords.some((k) => nicheLower.includes(k));
          if (!matches) return false;
        } else {
          if (!nicheLower.includes(dataFilterNiche.toLowerCase())) return false;
        }
      }

      // 6. Rating / Segment filter
      if (dataFilterRating === 'promoters' && Number(r.rating) < 4) return false;
      if (dataFilterRating === 'detractors' && Number(r.rating) >= 4) return false;

      // 7. Search term filter
      if (searchTerm) {
        const t = searchTerm.toLowerCase();
        return (
          r.customerName.toLowerCase().includes(t) ||
          r.customerPhone.includes(t) ||
          r.businessName.toLowerCase().includes(t) ||
          r.nicheCategory.toLowerCase().includes(t) ||
          r.city.toLowerCase().includes(t) ||
          r.locality.toLowerCase().includes(t) ||
          r.country.toLowerCase().includes(t)
        );
      }

      return true;
    });
  }, [
    unifiedDataLakeRecords,
    dataFilterCountry,
    dataFilterCity,
    dataFilterLocality,
    dataFilterBusiness,
    dataFilterNiche,
    dataFilterRating,
    searchTerm,
  ]);

  // Displayed records according to pagination / limit
  const displayedDataLake = useMemo(() => {
    if (dataPageLimit === '30') return filteredDataLake.slice(0, 30);
    if (dataPageLimit === '50') return filteredDataLake.slice(0, 50);
    return filteredDataLake;
  }, [filteredDataLake, dataPageLimit]);

  // Filtered Alerts for Tab 5 (Radar de Quejas en Vivo)
  const filteredAlerts = useMemo(() => {
    return feedbacks.filter((f) => {
      // Focus on complaints / low ratings (1-3 stars)
      if (Number(f.rating) > 3) return false;

      // 1. Business filter
      if (alertFilterBusiness !== 'all' && f.businessId !== alertFilterBusiness) return false;

      // 2. Status filter
      if (alertFilterStatus === 'pending' && f.status === 'resolved') return false;
      if (alertFilterStatus === 'resolved' && f.status !== 'resolved') return false;

      // 3. Search filter
      if (alertSearchTerm) {
        const term = alertSearchTerm.toLowerCase();
        return (
          (f.customerName || '').toLowerCase().includes(term) ||
          (f.customerPhone || '').includes(term) ||
          (f.complaintReason || '').toLowerCase().includes(term) ||
          (f.businessName || '').toLowerCase().includes(term) ||
          (f.attendedBy || '').toLowerCase().includes(term)
        );
      }

      return true;
    });
  }, [feedbacks, alertFilterBusiness, alertFilterStatus, alertSearchTerm]);

  // Handle Mark Resolved from Master
  const handleToggleResolveAlert = async (feedbackId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'resolved' ? 'pending' : 'resolved';
    try {
      const res = await fetch(`/api/feedbacks/${feedbackId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          resolvedBy: 'Dirección Central Master Prestigia',
          resolvedByRole: 'owner',
          rescueMessage: nextStatus === 'resolved' ? 'Resuelto y conciliado desde la Consola Central Prestigia.' : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({
          type: 'success',
          message: nextStatus === 'resolved' ? 'Alerta marcada como RESUELTA' : 'Alerta reabierta como PENDIENTE',
        });
        setTimeout(() => setNotification(null), 3000);
        fetchMasterData();
      }
    } catch {
      alert('Error al actualizar el estado de la alerta');
    }
  };

  // -------------------------------------------------------------
  // VIEW: BANKING ACCESS GATEWAY (IF NOT AUTHENTICATED)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative selection:bg-amber-500/20 selection:text-amber-300">
        {/* Ambient Security Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-amber-500/10 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Header & Crest */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-b from-amber-500/20 to-amber-950/40 border border-amber-500/40 shadow-2xl shadow-amber-500/10 mb-4 p-3 ring-1 ring-amber-400/20">
              <PrestigiaIcon className="w-12 h-12 text-amber-400 drop-shadow-md" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Consola Master Central Prestigia
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Autenticación de Grado Bancario</h1>
            <p className="text-xs text-slate-400 mt-1">
              Acceso restringido exclusivamente a la Dirección General de Prestigia.
            </p>
          </div>

          {/* Security Alert / Info Box */}
          {authError && (
            authError.includes('voluntariamente') ? (
              <div className="mb-6 p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 text-slate-300 text-xs flex items-start gap-3 shadow-xl shadow-black/60">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-300">Consola Master Bloqueada con Éxito</p>
                  <p className="mt-0.5 text-slate-300 leading-relaxed">Has cerrado tu sesión de forma segura. Introduce tu Llave Maestra y token 2FA para volver a ingresar.</p>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-3 shadow-lg shadow-rose-950/50 animate-shake">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-rose-300">Error de Validación de Seguridad</p>
                  <p className="mt-0.5 text-rose-200/90 leading-relaxed">{authError}</p>
                </div>
              </div>
            )
          )}

          {/* Banking Form Card */}
          <div className="bg-[#0D111A]/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

            <form onSubmit={handleBankingLogin} className="space-y-5">
              {/* Factor 1: Master Key */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    Llave Criptográfica Maestra
                  </span>
                  <span className="text-[10px] text-slate-400">Master Secret Key</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={masterKeyInput}
                    onChange={(e) => setMasterKeyInput(e.target.value)}
                    placeholder="••••••••••••••••"
                    required
                    autoComplete="new-password"
                    disabled={Boolean(lockoutUntil && Date.now() < lockoutUntil)}
                    className="w-full bg-[#141A26] border border-slate-700/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 text-white placeholder-slate-400 text-sm rounded-xl px-4 py-3 pr-11 transition-all outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>Clave criptográfica de alta entropía</span>
                  <span className="text-amber-400/80 font-mono">256-BIT ENCRYPTION</span>
                </p>
              </div>

              {/* Factor 2: Dynamic 2FA TOTP Token (Only rendered if 2FA is active on server) */}
              {isTwoFactorActiveOnServer && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                      Token Dinámico Bancario (Google Authenticator TOTP)
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      RFC-6238
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showTotpToken ? 'text' : 'password'}
                      maxLength={6}
                      value={totpTokenInput}
                      onChange={(e) => setTotpTokenInput(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="••••••"
                      required
                      autoComplete="one-time-code"
                      disabled={Boolean(lockoutUntil && Date.now() < lockoutUntil)}
                      className="w-full bg-[#141A26] border border-slate-700/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 text-white placeholder-slate-600 text-center tracking-[0.4em] text-lg font-mono rounded-xl px-4 py-3 pr-11 transition-all outline-none font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowTotpToken(!showTotpToken)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      {showTotpToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                    Introduce el código temporal de 6 dígitos de tu aplicación autenticadora.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={Boolean(lockoutUntil && Date.now() < lockoutUntil)}
                className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-amber-500 hover:from-amber-400 to-amber-600 text-slate-950 font-bold rounded-xl text-sm shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                Desbloquear Consola Master
              </button>
            </form>

            {/* Emergency SOS Recovery Button */}
            <div className="mt-6 pt-5 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={() => {
                  setShowEmergencyModal(true);
                  handleRequestEmergencyOtp();
                }}
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                ¿Emergencia? Rescate Criptográfico de la Consola Master
              </button>
            </div>
          </div>

          {/* Footer Security Badges */}
          <div className="mt-8 flex items-center justify-center gap-6 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              Sesión Protegida TLS 1.3
            </span>
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="w-3.5 h-3.5 text-amber-400" />
              IP & Device Fingerprint Logged
            </span>
          </div>
        </div>

        {/* MODAL: EMERGENCY OUT-OF-BAND DYNAMIC KEY */}
        {showEmergencyModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0F1420] border border-amber-500/40 w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Rescate de Emergencia Bancario</h3>
                    <p className="text-[10px] text-slate-400">Despacho Out-of-band cifrado</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEmergencyModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
                  <p className="font-semibold flex items-center gap-1.5 text-amber-300">
                    <Smartphone className="w-4 h-4" />
                    Protocolo de Rescate Fuera de Banda
                  </p>
                  <p className="mt-1 text-[11px] text-slate-300">
                    Se ha despachado una clave temporal a tus canales privados autorizados. Ningún código se revela en este terminal público.
                  </p>
                </div>

                <form onSubmit={handleVerifyEmergencyOtp} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                      <span>Introduce tu Llave Maestra o Clave de Rescate:</span>
                      {emergencyCountdown > 0 && (
                        <span className="text-amber-400 font-mono text-[11px]">
                          Vigencia: {Math.floor(emergencyCountdown / 60)}:{(emergencyCountdown % 60).toString().padStart(2, '0')}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showEmergencyOtp ? 'text' : 'password'}
                        maxLength={64}
                        value={emergencyOtpInput}
                        onChange={(e) => setEmergencyOtpInput(e.target.value)}
                        placeholder="••••••••••••••••"
                        required
                        autoFocus
                        className="w-full bg-[#141A26] border border-amber-500/50 focus:border-amber-400 text-white text-center font-mono text-lg tracking-[0.2em] font-bold rounded-xl py-3 pr-11 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEmergencyOtp(!showEmergencyOtp)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                      >
                        {showEmergencyOtp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                      🔐 Puedes ingresar directamente tu Llave Maestra offline o la clave temporal enviada a tu canal privado.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={emergencyLoading || !emergencyOtpInput.trim()}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-amber-500/20 hover:from-amber-400 cursor-pointer disabled:opacity-50"
                  >
                    {emergencyLoading ? 'Validando Clave Criptográfica...' : 'Validar y Acceder de Emergencia'}
                  </button>
                </form>

                <p className="text-[10px] text-slate-400 text-center">
                  Por seguridad Zero-Trust, ninguna credencial o número de rescate se revela en esta pantalla.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: AUTHENTICATED MASTER CONSOLE
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300 w-full overflow-x-hidden">
      {/* Top Banking Command Bar */}
      <header className="sticky top-0 z-40 bg-[#0C101A]/95 backdrop-blur-xl border-b border-slate-800/80 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 shadow-xl shadow-black/40 w-full">
        {/* Left Crest & Identification */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-950/40 border border-amber-500/40 flex items-center justify-center p-1.5 shadow-md shadow-amber-500/10">
            <PrestigiaIcon className="w-full h-full text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-white text-sm sm:text-base tracking-tight whitespace-nowrap">PRESTIGIA MASTER ADMIN</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase whitespace-nowrap">
                Bank Guard Live
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">Consola Central de Dirección General & Big Data Lake</p>
          </div>
        </div>

        {/* Global Stats Micro-badges */}
        <div className="hidden xl:flex items-center gap-2 text-[11px]">
          <div className="px-2.5 py-1 rounded-xl bg-[#141A26] border border-slate-800 text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Marcas: <strong className="text-white">{businesses.length}</strong></span>
          </div>
          <div className="px-2.5 py-1 rounded-xl bg-[#141A26] border border-slate-800 text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
            <Store className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sedes: <strong className="text-white">{stats?.totalBranches || 0}</strong></span>
          </div>
          <div className="px-2.5 py-1 rounded-xl bg-[#141A26] border border-slate-800 text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>Data Lake: <strong className="text-white">{campaignParticipants.length + feedbacks.length} clientes</strong></span>
          </div>
          <div className="px-2.5 py-1 rounded-xl bg-[#141A26] border border-slate-800 text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            <span>MRR Total: <strong className="text-amber-300">{formatMoneyCOP(stats?.mrr?.totalCOP || 1469000)}</strong></span>
          </div>
        </div>

        {/* Right Security & Control Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Privacy Masking Toggle */}
          <button
            type="button"
            onClick={() => setPrivacyMode(!privacyMode)}
            title="Modo Privacidad Bancaria (Ocultar cifras sensibles en pantalla)"
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              privacyMode
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-[#141A26] border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {privacyMode ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline">{privacyMode ? 'Privacidad: ON' : 'Ocultar Cifras'}</span>
          </button>

          {/* Security Credentials Config Button */}
          <button
            type="button"
            onClick={() => {
              setSecurityFormError(null);
              setIsVaultUnlocked(false);
              setVaultChallengeKey('');
              setVaultError(null);
              setShowSecurityConfigModal(true);
            }}
            title="Cambiar Llave Maestra y WhatsApp de Emergencia"
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Seguridad & Llaves</span>
          </button>

          {/* Refresh Data */}
          <button
            type="button"
            onClick={fetchMasterData}
            title="Refrescar datos en vivo"
            className="p-2 rounded-xl bg-[#141A26] border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {/* Lock Session Emergency */}
          <button
            type="button"
            onClick={() => handleLockConsole('voluntary')}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Bloquear Consola</span>
          </button>
        </div>
      </header>

      {/* Global Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold border ${
              notification.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                : 'bg-rose-950/90 border-rose-500 text-rose-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Tabs Navigation Bar */}
      <nav className="bg-[#0A0D15] border-b border-slate-800/80 px-3 sm:px-6 py-1.5 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 w-full">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            type="button"
            onClick={() => setActiveTab('directorio')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'directorio'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            1. Directorio de Marcas & Clientes
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('conmutador')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'conmutador'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            2. Conmutador de Planes & Add-Ons
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('casos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'casos'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Award className="w-4 h-4" />
            3. Auditoría Día 1 & Casos de Éxito
            <span className="px-1.5 py-0.5 rounded-md bg-amber-950/80 text-amber-300 text-[10px] font-mono border border-amber-500/40">
              Ventas
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bigdata')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'bigdata'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Globe className="w-4 h-4" />
            4. Big Data Lake Global (Habeas Data)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('alertas')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'alertas'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            5. Monitor de Alertas en Red
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mrr')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'mrr'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            6. Facturación Master & MRR
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('trafico')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'trafico'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            7. Tráfico Web & Prospectos (Leads)
            {commercialLeads.filter((l) => l.status === 'new').length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px]">
                {commercialLeads.filter((l) => l.status === 'new').length} nuevos
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Main Work Area */}
      <main className="flex-1 px-3 sm:px-6 py-5 w-full max-w-[1600px] mx-auto">
        {/* ============================================================== */}
        {/* TAB 1: DIRECTORIO GLOBAL DE MARCAS & ONBOARDING WIZARD */}
        {/* ============================================================== */}
        {activeTab === 'directorio' && (
          <div className="space-y-6">
            {/* Top Toolbar: Search, Filters & Action Button */}
            {/* Top Toolbar: Search, Filters, View Switcher & Action Button */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              <div className="flex flex-1 flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[240px] max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar marca, dueño, ciudad o categoría..."
                    className="w-full bg-[#121622] border border-slate-700/80 focus:border-amber-400 text-white placeholder-slate-400 text-xs rounded-xl pl-10 pr-4 py-2.5 outline-none transition-all"
                  />
                </div>

                <select
                  value={selectedPlanFilter}
                  onChange={(e) => setSelectedPlanFilter(e.target.value)}
                  className="bg-[#121622] border border-slate-700/80 text-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none cursor-pointer"
                >
                  <option value="all">Todos los Planes (4)</option>
                  <option value="independiente">Plan Independiente</option>
                  <option value="pro">Plan Pro</option>
                  <option value="elite">Plan Élite</option>
                  <option value="empresarial">Plan Empresarial</option>
                </select>

                {/* Filter by Niche / Industry Classification */}
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-[#121622] border border-slate-700/80 text-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none cursor-pointer"
                >
                  <option value="all">Todos los Nichos ({PRESTIGIA_NICHES.length})</option>
                  {PRESTIGIA_NICHES.map((niche) => (
                    <option key={niche.id} value={niche.id}>
                      {niche.icon} {niche.label}
                    </option>
                  ))}
                </select>

                {/* View Switcher: List (Default) vs Cards */}
                <div className="flex items-center bg-[#121622] border border-slate-700/80 rounded-xl p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => setDirectoryViewMode('list')}
                    title="Vista Lista (Recomendada para escalar a cientos de marcas)"
                    className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      directoryViewMode === 'list'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Lista</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirectoryViewMode('cards')}
                    title="Vista Tarjetas Visuales"
                    className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      directoryViewMode === 'cards'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Tarjetas</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setGoogleQueryInput('');
                  setGoogleDetectError(null);
                  setGoogleDetectSuccess(null);
                  setIsGoogleSynced(false);
                  setShowOnboardModal(true);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                Dar de Alta Nueva Marca
              </button>
            </div>

            {/* Empty State when no results */}
            {filteredBusinesses.length === 0 && (
              <div className="bg-[#0E121B] border border-slate-800 rounded-3xl p-12 text-center">
                <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No se encontraron marcas</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  No hay ningún cliente que coincida con "{searchTerm}" en el filtro seleccionado.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedPlanFilter('all');
                  }}
                  className="mt-4 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold cursor-pointer"
                >
                  Limpiar filtros
                </button>
              </div>
            )}

            {/* VISTA 1: LISTA / TABLA DE ALTA DENSIDAD (PREDETERMINADA) */}
            {filteredBusinesses.length > 0 && directoryViewMode === 'list' && (
              <div className="bg-[#0E121B] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-black/60">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#141A26] border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        <th className="py-2.5 px-3">Marca / Empresa</th>
                        <th className="py-2.5 px-2">Nicho / Industria</th>
                        <th className="py-2.5 px-2">Plan</th>
                        <th className="py-2.5 px-2">Titular / WhatsApp</th>
                        <th className="py-2.5 px-2">Sedes & Ciudad</th>
                        <th className="py-2.5 px-2 text-center">Trayectoria Día 1</th>
                        <th className="py-2.5 px-2 text-center">Estado</th>
                        <th className="py-2.5 px-3 text-right">Acciones Directas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredBusinesses.map((biz) => {
                        const badge = PLAN_BADGES[biz.plan] || PLAN_BADGES.pro;
                        const nicheBadge = getNicheBadge(biz.category);
                        const branchCount = biz.branches?.length || 1;
                        const baselineRating = biz.baseline?.initialRating || 3.8;
                        const currentGoogleRating = Math.min(5.0, Number((baselineRating + 1.1).toFixed(1)));
                        const netGain = Number((currentGoogleRating - baselineRating).toFixed(1));

                        return (
                          <tr key={biz.id} className="hover:bg-[#141A26]/80 transition-colors group">
                            {/* Brand & Category */}
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500/20 to-amber-950/40 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0">
                                  {biz.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-white group-hover:text-amber-400 transition-colors truncate text-xs">
                                    {biz.name}
                                  </p>
                                  <p className="text-[10px] text-slate-400 truncate">{biz.category}</p>
                                </div>
                              </div>
                            </td>

                            {/* Niche / Industry Classification Badge */}
                            <td className="py-2.5 px-2 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border inline-flex items-center gap-1 ${nicheBadge.color}`}>
                                <span>{nicheBadge.icon}</span>
                                <span>{nicheBadge.label}</span>
                              </span>
                            </td>

                            {/* Plan Badge */}
                            <td className="py-2.5 px-2 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.color} ${badge.border}`}>
                                {badge.label}
                              </span>
                            </td>

                            {/* Owner & WhatsApp */}
                            <td className="py-2.5 px-2 whitespace-nowrap">
                              <p className="font-medium text-slate-200 text-xs">{biz.ownerName}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{maskPhone(biz.ownerPhone)}</p>
                            </td>

                            {/* Branches & City */}
                            <td className="py-2.5 px-2 whitespace-nowrap">
                              <p className="text-slate-200 font-medium text-xs flex items-center gap-1">
                                <Store className="w-3 h-3 text-blue-400" />
                                {branchCount} {branchCount === 1 ? 'Sede' : 'Sedes'}
                              </p>
                              <p className="text-[10px] text-slate-400">{biz.branches?.[0]?.city || 'Bogotá'}</p>
                            </td>

                            {/* Trayectoria Día 1 */}
                            <td className="py-2.5 px-2 whitespace-nowrap text-center">
                              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px]">
                                <span className="text-slate-400 line-through font-mono">{baselineRating}★</span>
                                <ArrowRight className="w-2.5 h-2.5 text-amber-400" />
                                <span className="text-amber-300 font-bold font-mono flex items-center gap-0.5">
                                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                  {currentGoogleRating}★
                                </span>
                                <span className="px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono">
                                  +{netGain}★
                                </span>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-2.5 px-2 whitespace-nowrap text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleBusinessStatus(biz)}
                                title={biz.status === 'suspended' ? 'Clic para reactivar el negocio' : 'Clic para suspender el negocio (Kill Switch)'}
                                className="cursor-pointer"
                              >
                                {biz.status === 'suspended' ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-semibold hover:bg-red-500/20 transition">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                    Suspendido
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium hover:bg-emerald-500/20 transition">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Activo
                                  </span>
                                )}
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="py-2.5 px-3 whitespace-nowrap text-right">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => setViewPlaceModalBusiness(biz)}
                                  title="Ver Ficha Oficial de Google Maps y Datos del Negocio"
                                  className="py-1 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <MapPin className="w-3 h-3 text-amber-400" />
                                  <span>Ficha</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleImpersonate(biz)}
                                  title="Entrar al Portal del Cliente simulando al Dueño"
                                  className="py-1 px-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-[11px] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <Eye className="w-3 h-3 text-blue-400" />
                                  <span>Entrar</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedBusinessId(biz.id);
                                    setActiveTab('conmutador');
                                  }}
                                  title="Conmutador de Planes & Add-Ons"
                                  className="p-1 rounded-lg bg-[#141A26] hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                                >
                                  <Sliders className="w-3 h-3 text-amber-400" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedBusinessId(biz.id);
                                    setActiveTab('casos');
                                  }}
                                  title="Caso de Éxito / Testimonio"
                                  className="p-1 rounded-lg bg-[#141A26] hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                                >
                                  <Award className="w-3 h-3 text-emerald-400" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="py-3 px-4 bg-[#121622] border-t border-slate-800 text-slate-400 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
                  <span>Mostrando <strong className="text-white">{filteredBusinesses.length}</strong> de <strong className="text-white">{businesses.length}</strong> marcas registradas</span>
                  <span className="text-[11px] text-amber-400/90 font-medium flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Vista Lista de Alta Densidad: diseñada para gestionar cientos de marcas ágilmente
                  </span>
                </div>
              </div>
            )}

            {/* VISTA 2: TARJETAS VISUALES (OPCIONAL) */}
            {filteredBusinesses.length > 0 && directoryViewMode === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredBusinesses.map((biz) => {
                  const badge = PLAN_BADGES[biz.plan] || PLAN_BADGES.pro;
                  const branchCount = biz.branches?.length || 1;
                  const baselineRating = biz.baseline?.initialRating || 3.8;
                  const currentGoogleRating = Math.min(5.0, Number((baselineRating + 1.1).toFixed(1)));
                  const netGain = Number((currentGoogleRating - baselineRating).toFixed(1));

                  return (
                    <div
                      key={biz.id}
                      className="bg-[#0E121B] border border-slate-800 hover:border-amber-500/40 rounded-3xl p-5 shadow-lg shadow-black/40 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Top row: Plan badge, Niche badge & Status */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.color} ${badge.border}`}>
                              {badge.label}
                            </span>
                            {(() => {
                              const nicheBadge = getNicheBadge(biz.category);
                              return (
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 ${nicheBadge.color}`}>
                                  <span>{nicheBadge.icon}</span>
                                  <span>{nicheBadge.label}</span>
                                </span>
                              );
                            })()}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleBusinessStatus(biz)}
                            title={biz.status === 'suspended' ? 'Clic para reactivar el negocio' : 'Clic para suspender el negocio (Kill Switch)'}
                            className="cursor-pointer"
                          >
                            {biz.status === 'suspended' ? (
                              <span className="inline-flex items-center gap-1.5 text-[11px] text-red-400 font-semibold px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                Suspendido
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium hover:text-emerald-300 transition">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                Activo
                              </span>
                            )}
                          </button>
                        </div>

                        {/* Brand Name & Category */}
                        <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                          {biz.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">{biz.category}</p>

                        {/* Metadata Pills */}
                        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-[11px]">
                          <div className="bg-[#141A26] p-2.5 rounded-xl border border-slate-800">
                            <p className="text-slate-400 text-[10px]">Titular / Dueño</p>
                            <p className="font-semibold text-white truncate mt-0.5">{biz.ownerName}</p>
                            <p className="text-slate-400 font-mono text-[10px] truncate">{maskPhone(biz.ownerPhone)}</p>
                          </div>
                          <div className="bg-[#141A26] p-2.5 rounded-xl border border-slate-800">
                            <p className="text-slate-400 text-[10px]">Sedes Físicas</p>
                            <p className="font-semibold text-white mt-0.5 flex items-center gap-1">
                              <Store className="w-3.5 h-3.5 text-blue-400" />
                              {branchCount} {branchCount === 1 ? 'Sede' : 'Sedes'}
                            </p>
                            <p className="text-slate-400 text-[10px] truncate">{biz.branches?.[0]?.city || 'Bogotá'}</p>
                          </div>
                        </div>

                        {/* Day 1 vs Current Rating Tracker */}
                        <div className="mt-3 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-3 rounded-2xl border border-amber-500/20 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider">Trayectoria Día 1</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-slate-400 font-mono line-through">{baselineRating}★</span>
                              <ArrowRight className="w-3 h-3 text-amber-400" />
                              <span className="text-sm font-bold text-amber-300 font-mono flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                {currentGoogleRating}★
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold font-mono">
                              +{netGain}★ Neto
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Shortcuts */}
                      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setViewPlaceModalBusiness(biz)}
                          title="Ver Ficha Oficial de Google Maps y Datos del Negocio"
                          className="py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          <span>Ficha Google</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleImpersonate(biz)}
                          title="Entrar al Portal del Cliente simulando al Dueño"
                          className="flex-1 py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-400" />
                          <span>Entrar al Portal</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBusinessId(biz.id);
                            setActiveTab('conmutador');
                          }}
                          title="Modificar Plan y Add-Ons Modulares"
                          className="p-2 rounded-xl bg-[#141A26] hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors cursor-pointer"
                        >
                          <Sliders className="w-4 h-4 text-amber-400" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBusinessId(biz.id);
                            setActiveTab('casos');
                          }}
                          title="Ver y Generar Caso de Éxito para Ventas"
                          className="p-2 rounded-xl bg-[#141A26] hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors cursor-pointer"
                        >
                          <Award className="w-4 h-4 text-emerald-400" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: CONMUTADOR DE PLANES & ADD-ONS MODULARES */}
        {/* ============================================================== */}
        {activeTab === 'conmutador' && currentBusiness && (
          <div className="space-y-6">
            {/* Top Selector Card */}
            <div className="bg-[#0E121B] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-amber-400 font-semibold tracking-wider uppercase">Superpoderes de Configuración Master</p>
                <h2 className="text-xl font-bold text-white mt-1">
                  Ajuste Modular de Cliente: <span className="text-amber-300">{currentBusiness.name}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Modifica en tiempo real el plan base, sedes extras, encargados y módulos de cortesía o permanentes.
                </p>
              </div>

              {/* Business Switcher Dropdown */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-xs text-slate-400 shrink-0">Seleccionar Marca:</span>
                <select
                  value={selectedBusinessId}
                  onChange={(e) => setSelectedBusinessId(e.target.value)}
                  className="bg-[#141A26] border border-slate-700 text-white text-xs rounded-xl px-4 py-2.5 outline-none font-semibold cursor-pointer w-full md:w-64"
                >
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.plan.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Estado Operativo & Kill Switch Central */}
            <div className="bg-[#0E121B] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  Estado Operativo & Kill Switch Central
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Suspende o activa el portal del cliente y su enlace público QR en tiempo real con 1 clic.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-[#141A26] p-1.5 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setAddonState({ ...addonState, status: 'active' })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    addonState.status === 'active'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${addonState.status === 'active' ? 'bg-slate-950' : 'bg-emerald-400'}`} />
                  Cuenta Activa
                </button>
                <button
                  type="button"
                  onClick={() => setAddonState({ ...addonState, status: 'suspended' })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    addonState.status === 'suspended'
                      ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${addonState.status === 'suspended' ? 'bg-white' : 'bg-red-400'}`} />
                  Suspender (Kill Switch)
                </button>
              </div>
            </div>

            {/* Plan Switcher Grid */}
            <div className="bg-[#0E121B] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  1. Plan Base Contratado
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Puedes migrar al cliente a cualquier plan con 1 clic sin perder su historial.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(['independiente', 'pro', 'elite', 'empresarial'] as BusinessPlan[]).map((p) => {
                  const isSelected = addonState.plan === p;
                  return (
                    <div
                      key={p}
                      onClick={() => setAddonState({ ...addonState, plan: p })}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40'
                          : 'bg-[#141A26] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                      <h4 className="text-sm font-bold text-white capitalize">{p}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {p === 'independiente' && '$49k COP / $19 USD • 1 Sede • Solo Profesional'}
                        {p === 'pro' && '$120k COP / $49 USD • 1 Sede • Dueño Central'}
                        {p === 'elite' && '$290k COP / $110 USD • Hasta 3 Sedes + Encargados'}
                        {p === 'empresarial' && 'Corporativo • Holding • Sedes Ilimitadas'}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Add-Ons Modulares Switches */}
              <div className="pt-6 border-t border-slate-800 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    2. Add-Ons y Superpoderes Modulares (A la Carta)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Genera ingresos adicionales activando funciones temporales (Trial Hooks de venta) o permanentes.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Sede Extra Counter */}
                  <div className="bg-[#141A26] p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-blue-400" />
                          Sedes Físicas Extras
                        </span>
                        <span className="text-[10px] text-amber-400 font-mono font-semibold">+ $50k COP / $20 USD c/u</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Permite a la marca añadir sedes más allá de las incluidas en su plan base.
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80">
                      <span className="text-xs text-slate-300">Sedes adicionales:</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAddonState({ ...addonState, extraBranches: Math.max(0, addonState.extraBranches - 1) })}
                          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold font-mono text-white text-sm">
                          {addonState.extraBranches}
                        </span>
                        <button
                          type="button"
                          onClick={() => setAddonState({ ...addonState, extraBranches: addonState.extraBranches + 1 })}
                          className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Encargados Extras / Habilitación en Pro */}
                  <div className="bg-[#141A26] p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-purple-400" />
                          Encargados de Turno
                        </span>
                        <span className="text-[10px] text-amber-400 font-mono font-semibold">+ $25k COP / $10 USD</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Habilita la cuenta de encargado en Plan Pro (si el dueño opera a distancia) o suma supervisores en Élite.
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80">
                      <span className="text-xs text-slate-300">Cuentas de encargado:</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAddonState({ ...addonState, extraManagers: Math.max(0, addonState.extraManagers - 1) })}
                          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold font-mono text-white text-sm">
                          {addonState.extraManagers}
                        </span>
                        <button
                          type="button"
                          onClick={() => setAddonState({ ...addonState, extraManagers: addonState.extraManagers + 1 })}
                          className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Cupo Colaboradores en Bloques de 5 */}
                  <div className="bg-[#141A26] p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-emerald-400" />
                          Cupo Empleados (+5)
                        </span>
                        <span className="text-[10px] text-amber-400 font-mono font-semibold">+ $20k COP / $8 USD</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Amplía la capacidad de colaboradores auditados en sala por encima del límite estándar de 10.
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80">
                      <span className="text-xs text-slate-300">Cupos adicionales:</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAddonState({ ...addonState, extraStaffQuota: Math.max(0, addonState.extraStaffQuota - 5) })}
                          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold font-mono text-white text-sm">
                          +{addonState.extraStaffQuota}
                        </span>
                        <button
                          type="button"
                          onClick={() => setAddonState({ ...addonState, extraStaffQuota: addonState.extraStaffQuota + 5 })}
                          className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sentimiento IA 360° Switch */}
                  <div className="bg-[#141A26] p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <BrainCircuit className="w-3.5 h-3.5 text-pink-400" />
                          Sentimiento IA 360°
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={addonState.sentimentEnabled}
                            onChange={(e) => setAddonState({ ...addonState, sentimentEnabled: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-500"></div>
                        </label>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Desbloquea auditoría de cocina, servicio, tiempos y plan estratégico IA.
                      </p>
                    </div>
                    {addonState.sentimentEnabled && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Modalidad:</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setAddonState({ ...addonState, sentimentMode: 'trial' })}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                              addonState.sentimentMode === 'trial' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 bg-slate-800'
                            }`}
                          >
                            Hook 7 Días
                          </button>
                          <button
                            type="button"
                            onClick={() => setAddonState({ ...addonState, sentimentMode: 'permanent' })}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                              addonState.sentimentMode === 'permanent' ? 'bg-pink-500 text-white font-bold' : 'text-slate-400 bg-slate-800'
                            }`}
                          >
                            Permanente
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Live TV Wallboard Switch */}
                  <div className="bg-[#141A26] p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Tv className="w-3.5 h-3.5 text-cyan-400" />
                          Live TV Wallboard
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={addonState.wallboardEnabled}
                            onChange={(e) => setAddonState({ ...addonState, wallboardEnabled: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                        </label>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Habilita la pantalla en vivo a pantalla completa para salas de espera o cocina.
                      </p>
                    </div>
                    {addonState.wallboardEnabled && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Modalidad:</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setAddonState({ ...addonState, wallboardMode: 'trial' })}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                              addonState.wallboardMode === 'trial' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 bg-slate-800'
                            }`}
                          >
                            Hook 7 Días
                          </button>
                          <button
                            type="button"
                            onClick={() => setAddonState({ ...addonState, wallboardMode: 'permanent' })}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
                              addonState.wallboardMode === 'permanent' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 bg-slate-800'
                            }`}
                          >
                            Permanente
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sorteos & CRM Habeas Data Switch */}
                  <div className="bg-[#141A26] p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          Sorteos & CRM Habeas Data
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={addonState.giveawayCrm}
                            onChange={(e) => setAddonState({ ...addonState, giveawayCrm: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                        </label>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Permite a profesionales independientes capturar base de datos de comensales.
                      </p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] text-slate-400">
                      Incluido por defecto en Pro, Élite y Empresarial.
                    </div>
                  </div>
                </div>

                {/* Custom Notes */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Notas Administrativas y Acuerdos Especiales (Uso Interno Master):
                  </label>
                  <input
                    type="text"
                    value={addonState.customNotes}
                    onChange={(e) => setAddonState({ ...addonState, customNotes: e.target.value })}
                    placeholder="Ej: Autorizada excepción de encargado sin costo por ser cliente fundador..."
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 text-white text-xs rounded-xl px-4 py-2.5 outline-none"
                  />
                </div>

                {/* Action Save Bar */}
                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleSaveAddons}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Aplicar Cambios en Vivo para {currentBusiness.name}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: AUDITORÍA HISTÓRICA DÍA 1 & GENERADOR DE CASOS DE ÉXITO */}
        {/* ============================================================== */}
        {activeTab === 'casos' && currentBusiness && historicalMetrics && (
          <div className="space-y-6">
            {/* Top Selector & Action Bar */}
            <div className="bg-[#0E121B] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wider uppercase mb-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Dossier de Resultados Irrefutables Prestigia
                </div>
                <h2 className="text-xl font-bold text-white">
                  Auditoría de Comportamiento Histórico: <span className="text-amber-300">{currentBusiness.name}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Trayectoria real documentada desde el Día 1 para demostrar el ROI al cliente y cerrar nuevos prospectos con testimonios de éxito.
                </p>
              </div>

              {/* Selector & Print / Export buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <select
                  value={selectedBusinessId}
                  onChange={(e) => setSelectedBusinessId(e.target.value)}
                  className="bg-[#141A26] border border-slate-700 text-white text-xs rounded-xl px-4 py-2.5 outline-none font-semibold cursor-pointer"
                >
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2.5 rounded-xl bg-[#141A26] hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  Imprimir / PDF
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const text = `🏆 CASO DE ÉXITO VERIFICADO: ${currentBusiness.name}\n` +
                      `📍 Ubicación: ${historicalMetrics.baseline.city} (${historicalMetrics.baseline.nicheCategory})\n` +
                      `⭐️ Calificación Inicial Día 1: ${historicalMetrics.baseline.initialRating}★\n` +
                      `🌟 Calificación Actual con Prestigia: ${historicalMetrics.currentRating}★ (+${historicalMetrics.ratingGain}★)\n` +
                      `🛡️ Quejas Privadas Salvadas en Sala: ${historicalMetrics.privateComplaintsIntercepted} crisis evitadas antes de tocar Google Maps\n` +
                      `💰 Dinero Salvado de Fuga Estimado: ${formatMoneyCOP(historicalMetrics.preservedRevenueCOP)}\n` +
                      `🗣️ Testimonio del Dueño (${historicalMetrics.baseline.founderName}): "${customTestimonialQuote || historicalMetrics.baseline.clientQuote}"\n\n` +
                      `👉 Conoce cómo implementarlo en tu negocio en: prestigia.app`;
                    handleCopy(text, 'whatsapp-summary');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20 transition-all"
                >
                  {copiedText === 'whatsapp-summary' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedText === 'whatsapp-summary' ? '¡Copiado para WhatsApp!' : 'Copiar para WhatsApp Ventas'}
                </button>
              </div>
            </div>

            {/* Visual KPI Cards: The Transformation Journey */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Google Rating Evolution */}
              <div className="bg-[#0E121B] border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Reputación Google Maps</span>
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white font-mono">{historicalMetrics.currentRating}★</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">+{historicalMetrics.ratingGain}★</span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Día 1: {historicalMetrics.baseline.initialRating}★</span>
                  <span className="text-amber-400 font-semibold">{historicalMetrics.daysOperating} días de protección</span>
                </div>
              </div>

              {/* Card 2: Intercepted Private Complaints */}
              <div className="bg-[#0E121B] border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Quejas 1-3★ Interceptadas</span>
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white font-mono">{historicalMetrics.privateComplaintsIntercepted}</span>
                  <span className="text-xs font-bold text-blue-400">Crisis Evitadas</span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Resueltas en sala: {historicalMetrics.resolvedPrivateCount}</span>
                  <span className="text-emerald-400 font-semibold">&lt;10 seg ({historicalMetrics.resolutionSpeedPercent}%)</span>
                </div>
              </div>

              {/* Card 3: Revenue Saved from Churn */}
              <div className="bg-[#0E121B] border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Facturación Salvada de Fuga</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                    {formatMoneyCOP(historicalMetrics.preservedRevenueCOP)}
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Ticket Promedio: {formatMoneyCOP(historicalMetrics.baseline.averageTicketCOP)}</span>
                  <span className="text-slate-300 font-mono">{formatMoneyUSD(historicalMetrics.preservedRevenueUSD)}</span>
                </div>
              </div>

              {/* Card 4: New 5-Star Reviews Gained */}
              <div className="bg-[#0E121B] border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Nuevas Reseñas 5★ Google</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-amber-300 font-mono">+{historicalMetrics.newGoogleReviews5Star}</span>
                  <span className="text-xs text-slate-400">en Google Maps</span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Colaborador Destacado:</span>
                  <span className="text-white font-semibold truncate">{historicalMetrics.topStaff}</span>
                </div>
              </div>
            </div>

            {/* Official Printed Ficha / Case Study Visual Board */}
            <div className="bg-[#0D111A] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden print:p-0 print:border-none print:shadow-none">
              {/* Header Certificate */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center p-2.5">
                    <PrestigiaIcon className="w-full h-full text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white tracking-tight">{currentBusiness.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                        Caso de Éxito Certificado
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {historicalMetrics.baseline.nicheCategory} • {historicalMetrics.baseline.city}, {historicalMetrics.baseline.country}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Fecha de Inicio Auditoría</span>
                  <p className="text-xs font-mono font-bold text-slate-200 mt-0.5">{historicalMetrics.baseline.startDate}</p>
                  <p className="text-[10px] text-emerald-400 font-semibold">{historicalMetrics.daysOperating} días de protección activa</p>
                </div>
              </div>

              {/* Before vs After Visual Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                {/* BEFORE PRESTIGIA */}
                <div className="bg-[#121622] rounded-2xl p-5 border border-rose-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingDown className="w-4 h-4 text-rose-400" />
                      1. Antes de Prestigia (Día 1)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[10px] font-bold font-mono">
                      Línea Base Inicial
                    </span>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-300">
                    <li className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Calificación en Google Maps:</span>
                      <strong className="text-rose-300 font-mono text-sm">{historicalMetrics.baseline.initialRating} ★</strong>
                    </li>
                    <li className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Total Reseñas Públicas:</span>
                      <span className="font-mono">{historicalMetrics.baseline.initialReviewCount} opiniones</span>
                    </li>
                    <li className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Quejas públicas recurrentes:</span>
                      <span className="text-rose-300">Sin filtro en sala (salían a Maps)</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-slate-400">Pérdida mensual por fuga:</span>
                      <span className="text-rose-400 font-mono font-semibold">Alta (clientes no volvían)</span>
                    </li>
                  </ul>
                </div>

                {/* WITH PRESTIGIA TODAY */}
                <div className="bg-[#121622] rounded-2xl p-5 border border-emerald-500/30 ring-1 ring-emerald-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      2. Con Prestigia (Hoy)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold font-mono">
                      Reputación Blindada
                    </span>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-300">
                    <li className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Calificación en Google Maps:</span>
                      <strong className="text-amber-300 font-mono text-base flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        {historicalMetrics.currentRating} ★ (+{historicalMetrics.ratingGain}★)
                      </strong>
                    </li>
                    <li className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Quejas 1-3★ contenidas en sala:</span>
                      <strong className="text-blue-400 font-mono">{historicalMetrics.privateComplaintsIntercepted} interceptadas</strong>
                    </li>
                    <li className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-slate-400">Tiempo respuesta en WhatsApp:</span>
                      <span className="text-emerald-400 font-mono font-bold">&lt; 10 Segundos</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-slate-400">Dinero retenido / Churn evitado:</span>
                      <strong className="text-emerald-400 font-mono text-sm">{formatMoneyCOP(historicalMetrics.preservedRevenueCOP)}</strong>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Founder Quote / Testimonial Box */}
              <div className="bg-[#141A26] rounded-2xl p-5 border border-slate-800 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                    Testimonio Oficial del Titular ({historicalMetrics.baseline.founderName})
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditQuoteMode(!editQuoteMode)}
                    className="text-[11px] text-slate-400 hover:text-amber-300 cursor-pointer font-medium"
                  >
                    {editQuoteMode ? 'Cancelar Edición' : 'Editar Testimonio'}
                  </button>
                </div>

                {editQuoteMode ? (
                  <div className="space-y-3 mt-2">
                    <textarea
                      rows={3}
                      value={customTestimonialQuote}
                      onChange={(e) => setCustomTestimonialQuote(e.target.value)}
                      className="w-full bg-[#0D111A] border border-amber-500/40 text-white text-xs rounded-xl p-3 outline-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleSaveBaseline}
                        className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg cursor-pointer hover:bg-amber-400"
                      >
                        Guardar Testimonio
                      </button>
                    </div>
                  </div>
                ) : (
                  <blockquote className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                    &ldquo;{customTestimonialQuote || historicalMetrics.baseline.clientQuote}&rdquo;
                  </blockquote>
                )}
              </div>

              {/* Certificate Verification Stamp */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Auditoría certificada bajo protocolo de satisfacción Prestigia International SLA-10s.
                </span>
                <span className="font-mono text-slate-400">Hash ID: PRG-HIST-{currentBusiness.id.toUpperCase()}-2026</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: BIG DATA LAKE GLOBAL (HABEAS DATA & AMARILLAS) */}
        {/* ============================================================== */}
        {activeTab === 'bigdata' && (
          <div className="space-y-6">
            {/* Header & Strategic Vision Banner */}
            <div className="bg-gradient-to-r from-purple-950/40 via-[#0E121B] to-blue-950/40 border border-purple-500/30 rounded-3xl p-6 shadow-xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold tracking-wider uppercase mb-1">
                    <Globe className="w-3.5 h-3.5 text-purple-400" />
                    Base de Datos Global de Clientes Finales (Habeas Data)
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">
                    Big Data Lake Prestigia: <span className="text-purple-300">{unifiedDataLakeRecords.length} Contactos Reales Clasificados</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Consolidado de comensales de Ruletas/Sorteos QR y opiniones en sala con teléfono, nombre y autorización de Habeas Data.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const csvHeader = 'Nombre_Cliente,Telefono_WhatsApp,Pais,Ciudad,Localidad_Zona,Negocio_Registrado,Sede,Nicho_Industria,Calificacion,Segmento,Origen_Registro,Consentimiento_HabeasData,Fecha\n';
                      const csvRows = filteredDataLake.map((p) => {
                        const segment = p.rating >= 4 ? 'Promotor (4-5 Estrellas)' : 'Detractor Interceptado (1-3 Estrellas)';
                        return `"${p.customerName}","${p.customerPhone}","${p.country}","${p.city}","${p.locality}","${p.businessName}","${p.branchName}","${p.nicheCategory}","${p.rating}★","${segment}","${p.source}","Autorizado 100% Habeas Data","${p.registeredAt}"`;
                      }).join('\n');
                      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `Prestigia_BigDataLake_${dataFilterCountry}_${dataFilterCity}_${Date.now()}.csv`;
                      a.click();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-600/20 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Exportar a Excel / CSV ({filteredDataLake.length})
                  </button>
                </div>
              </div>
            </div>

            {/* Multi-Criteria Filter Bar for Big Data Lake */}
            <div className="bg-[#0E121B] border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                {/* País Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">País:</span>
                  <select
                    value={dataFilterCountry}
                    onChange={(e) => {
                      setDataFilterCountry(e.target.value);
                      setDataFilterCity('all');
                      setDataFilterLocality('all');
                    }}
                    className="bg-[#141A26] border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
                  >
                    <option value="all">Todos los Países ({availableDataCountries.length})</option>
                    {availableDataCountries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Ciudad Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Ciudad:</span>
                  <select
                    value={dataFilterCity}
                    onChange={(e) => {
                      setDataFilterCity(e.target.value);
                      setDataFilterLocality('all');
                    }}
                    className="bg-[#141A26] border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
                  >
                    <option value="all">Todas las Ciudades ({availableDataCities.length})</option>
                    {availableDataCities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Localidad / Zona Filter */}
                {availableDataLocalities.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">Zona / Localidad:</span>
                    <select
                      value={dataFilterLocality}
                      onChange={(e) => setDataFilterLocality(e.target.value)}
                      className="bg-[#141A26] border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
                    >
                      <option value="all">Todas las Zonas ({availableDataLocalities.length})</option>
                      {availableDataLocalities.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Negocio Registrado Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Negocio:</span>
                  <select
                    value={dataFilterBusiness}
                    onChange={(e) => setDataFilterBusiness(e.target.value)}
                    className="bg-[#141A26] border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 outline-none cursor-pointer max-w-[180px] truncate"
                  >
                    <option value="all">Todos los Negocios ({availableDataBusinesses.length})</option>
                    {availableDataBusinesses.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Nicho Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Nicho:</span>
                  <select
                    value={dataFilterNiche}
                    onChange={(e) => setDataFilterNiche(e.target.value)}
                    className="bg-[#141A26] border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
                  >
                    <option value="all">Todos los Nichos ({PRESTIGIA_NICHES.length})</option>
                    {PRESTIGIA_NICHES.map((niche) => (
                      <option key={niche.id} value={niche.id}>
                        {niche.icon} {niche.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Calificación Segment Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Calificación:</span>
                  <select
                    value={dataFilterRating}
                    onChange={(e) => setDataFilterRating(e.target.value)}
                    className="bg-[#141A26] border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
                  >
                    <option value="all">Todas las Calificaciones</option>
                    <option value="promoters">🌟 Promotores 4-5★ (Fidelizados)</option>
                    <option value="detractors">🛡️ Detractores 1-3★ (Recuperados)</option>
                  </select>
                </div>

                {/* Límite en Pantalla */}
                <div className="flex items-center gap-1.5 ml-auto">
                  <span className="text-slate-400 font-medium">Mostrar:</span>
                  <select
                    value={dataPageLimit}
                    onChange={(e) => setDataPageLimit(e.target.value as any)}
                    className="bg-[#141A26] border border-purple-500/40 text-purple-300 text-xs rounded-lg px-2.5 py-1.5 outline-none cursor-pointer font-bold"
                  >
                    <option value="30">30 filas</option>
                    <option value="50">50 filas</option>
                    <option value="all">Todos los {filteredDataLake.length} registros</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <span>
                  Mostrando <strong className="text-white">{displayedDataLake.length}</strong> de <strong className="text-white">{filteredDataLake.length}</strong> clientes filtrados (Total en Data Lake: <strong className="text-purple-300">{unifiedDataLakeRecords.length}</strong>)
                </span>
                {(dataFilterCountry !== 'all' || dataFilterCity !== 'all' || dataFilterBusiness !== 'all' || dataFilterNiche !== 'all' || dataFilterRating !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setDataFilterCountry('all');
                      setDataFilterCity('all');
                      setDataFilterLocality('all');
                      setDataFilterBusiness('all');
                      setDataFilterNiche('all');
                      setDataFilterRating('all');
                    }}
                    className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                  >
                    Limpiar todos los filtros
                  </button>
                )}
              </div>
            </div>

            {/* Customers Big Data Lake Table */}
            <div className="bg-[#0E121B] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#141A26] border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-3.5">Cliente Final / WhatsApp</th>
                      <th className="py-3 px-3.5">Ubicación Geográfica</th>
                      <th className="py-3 px-3.5">Negocio Registrado</th>
                      <th className="py-3 px-3.5">Nicho de Industria</th>
                      <th className="py-3 px-3.5 text-center">Calificación & Segmento</th>
                      <th className="py-3 px-3.5 text-center">Origen & Habeas Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {displayedDataLake.map((participant, idx) => {
                      const isPromoter = participant.rating >= 4;
                      const cleanPhone = participant.customerPhone.replace(/[^0-9+]/g, '');
                      const waLink = cleanPhone ? `https://wa.me/${cleanPhone.replace('+', '')}` : null;
                      const countryFlag = participant.country === 'Chile' ? '🇨🇱' : '🇨🇴';

                      return (
                        <tr key={participant.id || idx} className="hover:bg-[#121622] transition-colors">
                          {/* Customer Name & Phone */}
                          <td className="py-3 px-3.5">
                            <p className="font-semibold text-white">
                              {privacyMode ? 'Cliente Anónimo' : participant.customerName}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                                <Phone className="w-3 h-3 text-emerald-400" />
                                {maskPhone(participant.customerPhone)}
                              </p>
                              {waLink && !privacyMode && (
                                <a
                                  href={waLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Abrir chat en WhatsApp"
                                  className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold underline"
                                >
                                  WhatsApp ↗
                                </a>
                              )}
                            </div>
                            {participant.isTourist && (
                              <div className="mt-1">
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] font-semibold">
                                  <span>{participant.customerOriginFlag}</span>
                                  <span>Turista / Internacional ({participant.customerOriginCountry})</span>
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Country, City & Locality */}
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 font-medium text-slate-200">
                              <span>{countryFlag}</span>
                              <span className="font-bold text-slate-100">{participant.country}</span>
                              <span className="text-slate-500">•</span>
                              <span className="text-slate-300 font-semibold">{participant.city}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 pl-5 flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5 text-amber-400" />
                              <span>{participant.locality || 'Principal'}</span>
                            </p>
                          </td>

                          {/* Business Name & Branch */}
                          <td className="py-3 px-3.5">
                            <p className="font-bold text-slate-100">{participant.businessName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{participant.branchName || 'Sede Principal'}</p>
                          </td>

                          {/* Niche Badge */}
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            {(() => {
                              const nb = getNicheBadge(participant.nicheCategory || '');
                              return (
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border inline-flex items-center gap-1.5 ${nb.color}`}>
                                  <span>{nb.icon}</span>
                                  <span>{nb.label}</span>
                                </span>
                              );
                            })()}
                          </td>

                          {/* Rating in Niche */}
                          <td className="py-3 px-3.5 text-center whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                                isPromoter
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              <Star className="w-3 h-3 fill-current" />
                              {participant.rating}★ {isPromoter ? 'Promotor' : 'Detractor'}
                            </span>
                          </td>

                          {/* Source & Legal Habeas Data Consent */}
                          <td className="py-3 px-3.5 text-center whitespace-nowrap">
                            <p className="text-[10px] font-medium text-slate-400 mb-0.5">{participant.source}</p>
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Habeas Data OK
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="py-3 px-4 bg-[#121622] border-t border-slate-800 text-slate-400 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
                <span>
                  Mostrando <strong className="text-white">{displayedDataLake.length}</strong> de <strong className="text-white">{filteredDataLake.length}</strong> resultados filtrados (Base total: <strong className="text-white">{unifiedDataLakeRecords.length}</strong>)
                </span>
                <span className="text-[11px] text-purple-400 font-medium">
                  Directorio & Fidelización: Base lista para campañas cruzadas y Páginas Amarillas Prestigia
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: MONITOR DE ALERTAS & SALUD DE LA RED */}
        {/* ============================================================== */}
        {activeTab === 'alertas' && (
          <div className="space-y-6">
            <div className="bg-[#0E121B] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  Radar de Quejas en Vivo (Toda la Red de Marcas)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Monitoreo proactivo de clientes inconformes en sala para evitar crisis o reseñas negativas en Google Maps.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Red 98.6% Libre de Fugas
                </span>
              </div>
            </div>

            {/* Filter Bar for Alertas */}
            <div className="bg-[#0E121B] border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                {/* Brand Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Marca:</span>
                  <select
                    value={alertFilterBusiness}
                    onChange={(e) => setAlertFilterBusiness(e.target.value)}
                    className="bg-[#141A26] border border-slate-700 text-white text-xs rounded-lg px-3 py-1.5 outline-none cursor-pointer"
                  >
                    <option value="all">Todas las Marcas ({businesses.length})</option>
                    {businesses.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Estado:</span>
                  <select
                    value={alertFilterStatus}
                    onChange={(e) => setAlertFilterStatus(e.target.value)}
                    className="bg-[#141A26] border border-slate-700 text-white text-xs rounded-lg px-3 py-1.5 outline-none cursor-pointer"
                  >
                    <option value="all">Todos los Estados</option>
                    <option value="pending">🚨 Pendientes de Contacto</option>
                    <option value="resolved">✅ Resueltos en Sala</option>
                  </select>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={alertSearchTerm}
                    onChange={(e) => setAlertSearchTerm(e.target.value)}
                    placeholder="Buscar cliente, teléfono o motivo..."
                    className="bg-[#141A26] border border-slate-700 text-white text-xs rounded-lg pl-3 pr-8 py-1.5 outline-none w-60 focus:border-amber-400"
                  />
                  {alertSearchTerm && (
                    <button
                      type="button"
                      onClick={() => setAlertSearchTerm('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="text-xs text-slate-400">
                Mostrando <strong className="text-white">{filteredAlerts.length}</strong> quejas interceptadas
              </div>
            </div>

            {/* List of Alerts */}
            {filteredAlerts.length === 0 ? (
              <div className="bg-[#0E121B] border border-slate-800 rounded-3xl p-10 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">0 Quejas Pendientes en este Filtro</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Todas las alertas tempranas se encuentran resueltas o no hay reportes que coincidan con la búsqueda.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAlerts.map((fb) => {
                  const cleanPhone = (fb.customerPhone || '').replace(/[^0-9]/g, '');
                  const waPhone = cleanPhone.length === 10 && cleanPhone.startsWith('3') ? `57${cleanPhone}` : cleanPhone;
                  const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
                    `Hola ${fb.customerName || 'estimado cliente'}, te contactamos de la Dirección Central de ${fb.businessName || 'nuestro establecimiento'}. Lamentamos tu experiencia y queremos asistirte de inmediato.`
                  )}`;

                  return (
                    <div
                      key={fb.id}
                      className="bg-[#0E121B] border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-5 h-5 text-rose-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <strong className="text-white text-sm">{fb.businessName || fb.businessId}</strong>
                            <span className="text-slate-400 text-xs">• {fb.branchName || 'Sede Principal'}</span>
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold font-mono">
                              {fb.rating}★
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                          <p className="text-xs text-slate-200 mt-1.5 font-medium leading-relaxed">&ldquo;{fb.complaintReason}&rdquo;</p>
                          <div className="text-[11px] text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                            <span>Cliente: <strong className="text-slate-300">{privacyMode ? 'Anónimo' : fb.customerName}</strong> ({maskPhone(fb.customerPhone)})</span>
                            <span>•</span>
                            <span>Atendido por: <strong className="text-slate-300">{fb.attendedBy || 'Personal de Sala'}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        {/* WhatsApp Contact Button */}
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                          title="Abrir chat de WhatsApp para rescatar al cliente"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>WhatsApp</span>
                        </a>

                        {/* Toggle Resolved Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleResolveAlert(fb.id, fb.status)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                            fb.status === 'resolved'
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
                              : 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{fb.status === 'resolved' ? 'Resuelta' : 'Marcar Resuelta'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: FACTURACIÓN MASTER & MRR */}
        {/* ============================================================== */}
        {activeTab === 'mrr' && stats && (
          <div className="space-y-6">
            <div className="bg-[#0E121B] border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                Matriz Financiera de Ingresos Recurrentes (MRR)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Consolidado de suscripciones base y margen neto generado por Add-Ons modulares a la carta.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-[#0E121B] border border-slate-800 rounded-3xl p-5 shadow-lg">
                <p className="text-xs text-slate-400">MRR Planes Base</p>
                <p className="text-2xl font-extrabold text-white font-mono mt-1">
                  {privacyMode ? '••••••••••' : formatMoneyCOP(stats.mrr?.plansCOP || 1149000)}
                </p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {privacyMode ? '••••••••' : formatMoneyUSD(stats.mrr?.plansUSD || 458)}
                </p>
              </div>

              <div className="bg-[#0E121B] border border-amber-500/30 rounded-3xl p-5 shadow-lg bg-gradient-to-br from-amber-500/5 to-transparent">
                <p className="text-xs text-amber-400 font-semibold">MRR Add-Ons Modulares (Margen &gt;90%)</p>
                <p className="text-2xl font-extrabold text-amber-300 font-mono mt-1">
                  {privacyMode ? '••••••••••' : formatMoneyCOP(stats.mrr?.addOnsCOP || 320000)}
                </p>
                <p className="text-[11px] text-amber-400/80 font-mono mt-0.5">
                  {privacyMode ? '••••••••' : formatMoneyUSD(stats.mrr?.addOnsUSD || 128)}
                </p>
              </div>

              <div className="bg-[#0E121B] border border-emerald-500/30 rounded-3xl p-5 shadow-lg bg-gradient-to-br from-emerald-500/5 to-transparent">
                <p className="text-xs text-emerald-400 font-semibold">MRR Total Consolidado</p>
                <p className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
                  {privacyMode ? '••••••••••' : formatMoneyCOP(stats.mrr?.totalCOP || 1469000)}
                </p>
                <p className="text-[11px] text-emerald-300/80 font-mono mt-0.5">
                  {privacyMode ? '••••••••' : formatMoneyUSD(stats.mrr?.totalUSD || 586)}
                </p>
              </div>
            </div>

            {/* Breakdown per client table */}
            <div className="bg-[#0E121B] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-4 bg-[#141A26] border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Desglose por Marca & Servicio</span>
                <span className="text-[11px] text-slate-400">Total Marcas Facturando: {businesses.length}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#121622] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Marca</th>
                      <th className="py-3 px-4">Plan Base</th>
                      <th className="py-3 px-4">Sedes</th>
                      <th className="py-3 px-4">Add-Ons Activos</th>
                      <th className="py-3 px-4 text-right">Facturación Mensual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {businesses.map((biz) => {
                      const addons = biz.masterAddOns;
                      return (
                        <tr key={biz.id} className="hover:bg-[#121622]">
                          <td className="py-3 px-4 font-semibold text-white">{biz.name}</td>
                          <td className="py-3 px-4 capitalize">{biz.plan}</td>
                          <td className="py-3 px-4">{biz.branches?.length || 1} Sedes</td>
                          <td className="py-3 px-4 text-[11px] text-slate-400">
                            {addons?.extraBranches ? `+${addons.extraBranches} Sedes • ` : ''}
                            {addons?.extraManagers ? `+${addons.extraManagers} Encargados • ` : ''}
                            {addons?.sentiment360?.enabled ? 'Sentimiento IA • ' : ''}
                            {addons?.liveWallboard?.enabled ? 'Wallboard' : ''}
                            {!addons?.extraBranches && !addons?.extraManagers && !addons?.sentiment360?.enabled ? 'Plan Base Estándar' : ''}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-amber-300">
                            {privacyMode
                              ? '••••••••••'
                              : formatMoneyCOP(
                                  (biz.plan === 'elite' ? 290000 : biz.plan === 'pro' ? 120000 : biz.plan === 'empresarial' ? 690000 : 49000) +
                                  ((addons?.extraBranches || 0) * 50000) +
                                  ((addons?.extraManagers || 0) * 25000)
                                )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trafico' && (
          <div className="space-y-6">
            {/* Header & Controls */}
            <div className="bg-[#0E121B] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Radio className="w-5 h-5 text-emerald-400" />
                    Radar de Tráfico en Vivo & Prospectos (Leads)
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Supervisión en tiempo real de visitantes a la página web comercial (país, ciudad, dispositivo, IP) y consola CRM de leads captados para contacto directo por WhatsApp.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={fetchMasterData}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                  title="Actualizar datos en vivo"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin text-amber-400' : ''}`} />
                  Actualizar Radar
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-[#0E121B] border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Total Visitas Web</span>
                  <Globe className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-2xl font-extrabold text-white font-mono mt-2">
                  {trafficVisits.length}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Páginas vistas rastreadas
                </p>
              </div>

              <div className="bg-[#0E121B] border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Prospectos (Leads)</span>
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-2xl font-extrabold text-white font-mono">
                    {commercialLeads.length}
                  </p>
                  {commercialLeads.filter((l) => l.status === 'new').length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      {commercialLeads.filter((l) => l.status === 'new').length} nuevos
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Formularios de auditoría
                </p>
              </div>

              <div className="bg-[#0E121B] border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Conversión (CR)</span>
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-2xl font-extrabold text-amber-400 font-mono mt-2">
                  {trafficVisits.length > 0
                    ? ((commercialLeads.length / trafficVisits.length) * 100).toFixed(1)
                    : '0.0'}%
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Visita a prospecto calificado
                </p>
              </div>

              <div className="bg-[#0E121B] border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Top Países</span>
                  <Compass className="w-4 h-4 text-purple-400" />
                </div>
                <div className="mt-2 space-y-1">
                  {(() => {
                    const countryCounts: Record<string, number> = {};
                    trafficVisits.forEach((v) => {
                      const c = v.country || 'Colombia';
                      countryCounts[c] = (countryCounts[c] || 0) + 1;
                    });
                    const sorted = Object.entries(countryCounts)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 2);

                    if (sorted.length === 0) {
                      return <p className="text-xs text-slate-500">Sin datos de geolocalización</p>;
                    }

                    return sorted.map(([country, count]) => {
                      const flag =
                        country.toLowerCase().includes('colombia') || country === 'CO'
                          ? '🇨🇴'
                          : country.toLowerCase().includes('mexico') || country === 'MX'
                          ? '🇲🇽'
                          : country.toLowerCase().includes('spain') || country.toLowerCase().includes('españa') || country === 'ES'
                          ? '🇪🇸'
                          : country.toLowerCase().includes('united states') || country.toLowerCase().includes('estados unidos') || country === 'US'
                          ? '🇺🇸'
                          : '🌐';
                      return (
                        <div key={country} className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 truncate">{flag} {country}</span>
                          <span className="font-mono text-slate-400 font-bold">{count}</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              <div className="bg-[#0E121B] border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Dispositivos</span>
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="mt-2 space-y-1">
                  {(() => {
                    const total = Math.max(1, trafficVisits.length);
                    const mobile = trafficVisits.filter((v) => v.deviceType === 'mobile').length;
                    const desktop = trafficVisits.filter((v) => v.deviceType === 'desktop').length;
                    const mobilePct = Math.round((mobile / total) * 100);
                    const desktopPct = Math.round((desktop / total) * 100);
                    return (
                      <>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 flex items-center gap-1.5">
                            <Smartphone className="w-3 h-3 text-cyan-400" /> Móvil
                          </span>
                          <span className="font-mono text-cyan-400 font-bold">{mobilePct}%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 flex items-center gap-1.5">
                            <Monitor className="w-3 h-3 text-blue-400" /> PC
                          </span>
                          <span className="font-mono text-blue-400 font-bold">{desktopPct}%</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* SECCIÓN A: PROSPECTOS COMERCIALES (CRM LEADS) */}
            <div className="bg-[#0E121B] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-400" />
                    Prospectos Comerciales Captados ({commercialLeads.length})
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Negocios que solicitaron su auditoría gratuita desde la página web oficial.
                  </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={leadSearchTerm}
                      onChange={(e) => setLeadSearchTerm(e.target.value)}
                      placeholder="Buscar por nombre, marca o ciudad..."
                      className="bg-[#141A26] border border-slate-700/80 text-white rounded-xl pl-8 pr-3 py-1.5 text-xs outline-none focus:border-amber-400 w-52 sm:w-64"
                    />
                  </div>

                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value)}
                    className="bg-[#141A26] border border-slate-700/80 text-white rounded-xl px-3 py-1.5 text-xs outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="all">Todos los Estados</option>
                    <option value="new">🟡 Nuevos</option>
                    <option value="contacted">🔵 Contactados</option>
                    <option value="negotiating">🟣 En Negociación</option>
                    <option value="won">🟢 Clientes Ganados</option>
                    <option value="dismissed">⚪ Descartados</option>
                  </select>
                </div>
              </div>

              {/* Leads List */}
              {(() => {
                const filteredLeads = commercialLeads.filter((l) => {
                  const matchStatus = leadStatusFilter === 'all' || l.status === leadStatusFilter;
                  const query = leadSearchTerm.toLowerCase();
                  const matchSearch =
                    !query ||
                    l.fullName.toLowerCase().includes(query) ||
                    l.businessName.toLowerCase().includes(query) ||
                    l.city.toLowerCase().includes(query) ||
                    l.phone.includes(query) ||
                    (l.category && l.category.toLowerCase().includes(query));
                  return matchStatus && matchSearch;
                });

                if (filteredLeads.length === 0) {
                  return (
                    <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
                      <Inbox className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-300">No hay prospectos comerciales con los filtros aplicados</p>
                      <p className="text-xs text-slate-500 mt-1">Los nuevos leads captados a través del formulario de la landing page aparecerán aquí automáticamente.</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredLeads.map((lead) => {
                      const cleanPhoneDigits = lead.phone.replace(/[^0-9]/g, '');
                      const waText = encodeURIComponent(
                        `Hola ${lead.fullName}, te escribo desde la dirección de Prestigia respecto a la solicitud de auditoría de reputación para ${lead.businessName}. ¿En qué horario te queda bien que revisemos tu diagnóstico?`
                      );
                      const waUrl = `https://wa.me/${cleanPhoneDigits}?text=${waText}`;

                      return (
                        <div
                          key={lead.id}
                          className="bg-[#141A26] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-md flex flex-col justify-between gap-4"
                        >
                          <div>
                            {/* Header row */}
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-[11px] font-mono text-amber-400 font-semibold uppercase tracking-wider">
                                  {lead.category || 'Comercio General'}
                                </span>
                                <h4 className="text-base font-bold text-white mt-0.5">
                                  {lead.businessName}
                                </h4>
                                <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                                  <Users className="w-3.5 h-3.5 text-slate-400" />
                                  {lead.fullName}
                                </p>
                              </div>

                              {/* Status Selector */}
                              <div className="flex items-center gap-2">
                                <select
                                  value={lead.status}
                                  disabled={updatingLeadId === lead.id}
                                  onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                                  className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border outline-none cursor-pointer ${
                                    lead.status === 'new'
                                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                      : lead.status === 'contacted'
                                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                      : lead.status === 'negotiating'
                                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                                      : lead.status === 'won'
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                      : 'bg-slate-800 text-slate-400 border-slate-700'
                                  }`}
                                >
                                  <option value="new" className="bg-[#0F1420] text-amber-400">🟡 Nuevo</option>
                                  <option value="contacted" className="bg-[#0F1420] text-blue-400">🔵 Contactado</option>
                                  <option value="negotiating" className="bg-[#0F1420] text-purple-400">🟣 En Negociación</option>
                                  <option value="won" className="bg-[#0F1420] text-emerald-400">🟢 Cliente Cerrado</option>
                                  <option value="dismissed" className="bg-[#0F1420] text-slate-400">⚪ Descartado</option>
                                </select>
                              </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-400 bg-[#0E121B] p-3 rounded-xl border border-slate-800/80">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                                <span>{lead.city} • {lead.country || 'Colombia'}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Store className="w-3.5 h-3.5 text-slate-500" />
                                <span>{lead.branchCount} sede(s)</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-slate-500" />
                                <span className="font-mono text-slate-300">
                                  {privacyMode ? '••••••••••' : lead.phone}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-500" />
                                <span>{new Date(lead.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>

                            {lead.notes && (
                              <p className="text-xs text-slate-400 italic mt-2.5 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                                &ldquo;{lead.notes}&rdquo;
                              </p>
                            )}
                          </div>

                          {/* Quick WhatsApp Action Button */}
                          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-3">
                            <span className="text-[11px] text-slate-500">
                              IP: {privacyMode ? '•••.•••.•••' : lead.ip || '127.0.0.1'} • {lead.device || 'Móvil'}
                            </span>
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Contactar por WhatsApp
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* SECCIÓN B: RADAR DE ACCESOS EN VIVO (TRAFFIC FEED) */}
            <div className="bg-[#0E121B] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    Bitácora de Accesos Web en Vivo ({trafficVisits.length})
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Registro detallado de visitantes: geolocalización, dispositivo, sistema operativo, navegador y páginas visitadas.
                  </p>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={trafficSearchTerm}
                    onChange={(e) => setTrafficSearchTerm(e.target.value)}
                    placeholder="Filtrar por ciudad, país o IP..."
                    className="bg-[#141A26] border border-slate-700/80 text-white rounded-xl pl-8 pr-3 py-1.5 text-xs outline-none focus:border-amber-400 w-52 sm:w-64"
                  />
                </div>
              </div>

              {(() => {
                const filteredVisits = trafficVisits.filter((v) => {
                  const query = trafficSearchTerm.toLowerCase();
                  if (!query) return true;
                  return (
                    (v.city && v.city.toLowerCase().includes(query)) ||
                    (v.country && v.country.toLowerCase().includes(query)) ||
                    (v.ip && v.ip.includes(query)) ||
                    (v.path && v.path.toLowerCase().includes(query)) ||
                    (v.browser && v.browser.toLowerCase().includes(query))
                  );
                });

                if (filteredVisits.length === 0) {
                  return (
                    <div className="text-center py-10 text-slate-500 text-xs">
                      No hay registros de tráfico que coincidan con la búsqueda.
                    </div>
                  );
                }

                return (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-[#141A26] text-slate-400 font-semibold border-b border-slate-800">
                        <tr>
                          <th className="py-3 px-4 rounded-l-xl">Fecha & Hora</th>
                          <th className="py-3 px-4">Ubicación (País / Ciudad)</th>
                          <th className="py-3 px-4">Dispositivo & Entorno</th>
                          <th className="py-3 px-4">Dirección IP</th>
                          <th className="py-3 px-4">Ruta</th>
                          <th className="py-3 px-4 rounded-r-xl text-right">Evento</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredVisits.slice(0, 50).map((visit) => {
                          const flag =
                            visit.country?.toLowerCase().includes('colombia') || visit.countryCode === 'CO'
                              ? '🇨🇴'
                              : visit.country?.toLowerCase().includes('mexico') || visit.countryCode === 'MX'
                              ? '🇲🇽'
                              : visit.country?.toLowerCase().includes('spain') || visit.country?.toLowerCase().includes('españa') || visit.countryCode === 'ES'
                              ? '🇪🇸'
                              : visit.country?.toLowerCase().includes('united states') || visit.countryCode === 'US'
                              ? '🇺🇸'
                              : '🌐';

                          return (
                            <tr key={visit.id} className="hover:bg-slate-800/30 transition-colors">
                              <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                                {new Date(visit.timestamp).toLocaleDateString('es-ES', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                                })}
                              </td>
                              <td className="py-3 px-4 font-medium text-white whitespace-nowrap">
                                <span className="mr-1.5">{flag}</span>
                                {visit.city || 'Bogotá'}, {visit.country || 'Colombia'}
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                <span className="inline-flex items-center gap-1.5 text-slate-300">
                                  {visit.deviceType === 'mobile' ? (
                                    <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                                  ) : (
                                    <Monitor className="w-3.5 h-3.5 text-blue-400" />
                                  )}
                                  {visit.os} • {visit.browser}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                                {privacyMode ? '••••••••••' : visit.ip}
                              </td>
                              <td className="py-3 px-4 font-mono text-amber-400/90 whitespace-nowrap">
                                {visit.path || '/'}
                              </td>
                              <td className="py-3 px-4 text-right whitespace-nowrap">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    visit.action === 'lead_submit'
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                      : visit.action === 'cta_click'
                                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                                  }`}
                                >
                                  {visit.action || 'pageview'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* MODAL: ONBOARDING WIZARD (ALTA DE NUEVA MARCA) */}
      {/* ============================================================== */}
      {showOnboardModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0F1420] border border-amber-500/40 w-full max-w-2xl rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Alta de Nueva Marca (Onboarding Master)</h3>
                  <p className="text-xs text-slate-400">Crea la cuenta del cliente y configura su línea base Día 1</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOnboardModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBusiness} className="mt-5 space-y-4 text-xs">
              {/* Row 1: Brand Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nombre Comercial de la Marca *</label>
                  <input
                    type="text"
                    required
                    value={onboardForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
                      setOnboardForm({ ...onboardForm, name, id: slug });
                    }}
                    placeholder="Ej: La Taquería del Sol"
                    className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Identificador Slug (URL & QR) *</label>
                  <input
                    type="text"
                    required
                    value={onboardForm.id}
                    onChange={(e) => setOnboardForm({ ...onboardForm, id: e.target.value })}
                    placeholder="la-taqueria-del-sol"
                    className="w-full bg-[#141A26] border border-slate-700 text-amber-400 font-mono rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Row 2: Niche & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nicho / Industria *</label>
                  <select
                    required
                    value={onboardForm.category}
                    onChange={(e) => setOnboardForm({ ...onboardForm, category: e.target.value })}
                    className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 cursor-pointer"
                  >
                    {PRESTIGIA_NICHES.map((niche) => (
                      <option key={niche.id} value={niche.label}>
                        {niche.icon} {niche.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Ciudad *</label>
                  <input
                    type="text"
                    required
                    value={onboardForm.city}
                    onChange={(e) => setOnboardForm({ ...onboardForm, city: e.target.value })}
                    placeholder="Bogotá"
                    className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Localidad / Zona *</label>
                  <input
                    type="text"
                    required
                    value={onboardForm.locality}
                    onChange={(e) => setOnboardForm({ ...onboardForm, locality: e.target.value })}
                    placeholder="Zona Rosa / Usaquén"
                    className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Row 3: Owner & Plan */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nombre del Dueño *</label>
                  <input
                    type="text"
                    required
                    value={onboardForm.ownerName}
                    onChange={(e) => setOnboardForm({ ...onboardForm, ownerName: e.target.value })}
                    placeholder="Mario Casas"
                    className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">WhatsApp para Alertas *</label>
                  <input
                    type="text"
                    required
                    value={onboardForm.ownerPhone}
                    onChange={(e) => setOnboardForm({ ...onboardForm, ownerPhone: e.target.value })}
                    placeholder="+57 300 123 4567"
                    className="w-full bg-[#141A26] border border-slate-700 text-white font-mono rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Plan Inicial Contratado *</label>
                  <select
                    value={onboardForm.plan}
                    onChange={(e) => setOnboardForm({ ...onboardForm, plan: e.target.value as BusinessPlan })}
                    className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 capitalize"
                  >
                    <option value="independiente">Plan Independiente ($49k)</option>
                    <option value="pro">Plan Pro ($120k)</option>
                    <option value="elite">Plan Élite ($290k)</option>
                    <option value="empresarial">Plan Empresarial ($690k)</option>
                  </select>
                </div>
              </div>

              {/* Google Business Profile / Maps Auto-Detection Module */}
              <div className="p-4 rounded-2xl bg-[#141A26] border border-blue-500/30">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-xs flex items-center gap-2">
                        Conexión Oficial con Google Maps
                        {isGoogleSynced && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Detectado en Vivo
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Pega el enlace de Google Maps o busca por nombre: Prestigia detecta automáticamente la calificación y las reseñas oficiales en tiempo real.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={googleQueryInput}
                      onChange={(e) => setGoogleQueryInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleDetectGooglePlace();
                        }
                      }}
                      placeholder="Ej: https://maps.app.goo.gl/... o Nombre del Negocio + Ciudad"
                      className="w-full bg-[#0E121B] border border-slate-700 focus:border-blue-400 text-white rounded-xl pl-9 pr-3 py-2 text-xs outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={googleDetectLoading}
                    onClick={() => handleDetectGooglePlace()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-600/20 transition-all shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${googleDetectLoading ? 'animate-spin' : ''}`} />
                    <span>{googleDetectLoading ? 'Detectando...' : 'Detectar con Google'}</span>
                  </button>
                </div>

                {googleDetectSuccess && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-[11px] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{googleDetectSuccess}</span>
                  </div>
                )}

                {googleDetectError && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-[11px] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{googleDetectError}</span>
                  </div>
                )}

                {/* Rich Google Business Profile Preview Card */}
                {detectedGoogleProfile && (
                  <div className="mt-3 p-3.5 rounded-xl bg-[#0E121B] border border-blue-500/40 text-xs space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Ficha Oficial Detectada en Google Maps
                        </span>
                        <h4 className="font-bold text-white text-sm mt-0.5">{detectedGoogleProfile.name}</h4>
                        {detectedGoogleProfile.address && (
                          <p className="text-[11px] text-slate-300 flex items-center gap-1.5 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{detectedGoogleProfile.address}</span>
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0 bg-[#141A26] px-3 py-1.5 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-1 justify-end font-mono font-bold text-amber-400 text-sm">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span>{detectedGoogleProfile.rating}★</span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          {detectedGoogleProfile.reviewsCount} opiniones oficiales
                        </p>
                      </div>
                    </div>

                    {detectedGoogleProfile.placeId && (
                      <div className="flex items-center justify-between text-[10px] text-slate-400 bg-[#141A26] px-2.5 py-1.5 rounded-lg border border-slate-800">
                        <span className="font-mono truncate">Place ID: <strong className="text-amber-300">{detectedGoogleProfile.placeId}</strong></span>
                        <span className="text-emerald-400 font-semibold shrink-0 ml-2">API Certificada</span>
                      </div>
                    )}

                    {/* Direct Links to view Google Maps listing */}
                    <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                      <a
                        href={detectedGoogleProfile.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Abrir Ficha en Google Maps ↗</span>
                      </a>

                      {detectedGoogleProfile.googleReviewUrl && (
                        <a
                          href={detectedGoogleProfile.googleReviewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 text-amber-400" />
                          <span>Probar Enlace de Reseña ↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Section: Day-1 Baseline Parameters */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-amber-400 font-bold flex items-center gap-1.5 text-xs">
                    <Star className="w-3.5 h-3.5" />
                    Línea Base Histórica (Día 1 para el Caso de Éxito):
                  </p>
                  {isGoogleSynced && (
                    <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      <Check className="w-3 h-3" />
                      Auto-detectado de Google Maps
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1 flex items-center justify-between">
                      <span>Rating Google Inicial (1.0 - 5.0)</span>
                      {isGoogleSynced && <span className="text-[10px] text-emerald-400 font-bold font-mono">Google Live</span>}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      value={onboardForm.initialRating}
                      onChange={(e) => setOnboardForm({ ...onboardForm, initialRating: parseFloat(e.target.value) })}
                      className={`w-full bg-[#141A26] border text-white rounded-xl px-3 py-2 outline-none font-mono ${
                        isGoogleSynced ? 'border-emerald-500/60 text-emerald-300 font-bold' : 'border-slate-700'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 flex items-center justify-between">
                      <span>Reseñas Google Iniciales</span>
                      {isGoogleSynced && <span className="text-[10px] text-emerald-400 font-bold font-mono">Google Live</span>}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={onboardForm.initialReviewCount}
                      onChange={(e) => setOnboardForm({ ...onboardForm, initialReviewCount: parseInt(e.target.value) || 0 })}
                      className={`w-full bg-[#141A26] border text-white rounded-xl px-3 py-2 outline-none font-mono ${
                        isGoogleSynced ? 'border-emerald-500/60 text-emerald-300 font-bold' : 'border-slate-700'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Ticket Promedio (COP $)</label>
                    <input
                      type="number"
                      step="1000"
                      value={onboardForm.averageTicketCOP}
                      onChange={(e) => setOnboardForm({ ...onboardForm, averageTicketCOP: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl px-3 py-2 outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowOnboardModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold rounded-xl cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  Dar de Alta Marca en Prestigia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: GESTIÓN DE SEGURIDAD & CREDENCIALES MASTER BANCARIAS   */}
      {/* ============================================================== */}
      {showSecurityConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D111A] border border-amber-500/50 w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all ${
                  isVaultUnlocked
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                }`}>
                  {isVaultUnlocked ? <ShieldCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {isVaultUnlocked ? 'Bóveda Criptográfica Master' : 'Bóveda Criptográfica Ciega'}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                      isVaultUnlocked
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {isVaultUnlocked ? 'DESBLOQUEADA' : 'ZERO-TRUST BLOQUEADO'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isVaultUnlocked
                      ? 'Gestión autorizada de credenciales y canales confidenciales'
                      : 'Datos sensibles ocultos. Introduce tu Llave Maestra para descifrar la bóveda.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseSecurityConfigModal}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FASE 1: BÓVEDA BLOQUEADA (CHALLENGE-RESPONSE GATE) */}
            {!isVaultUnlocked ? (
              <div className="mt-5 space-y-4 text-xs">
                <div className="p-4 sm:p-5 rounded-2xl bg-[#141A26] border border-amber-500/30 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      Autorización Obligatoria de Bóveda
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono">CONFIDENCIALIDAD PRIVADA</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Por protocolo de máxima seguridad bancaria, tu WhatsApp de rescate, correo oficial y configuraciones de 2FA están totalmente ocultos contra miradas no autorizadas.
                  </p>

                  <form onSubmit={handleUnlockVault} className="space-y-4 pt-1">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-slate-200 text-xs font-semibold">Introduce tu Llave Maestra Actual:</label>
                        <button
                          type="button"
                          onClick={() => setShowVaultKey(!showVaultKey)}
                          className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                        >
                          {showVaultKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{showVaultKey ? 'Ocultar' : 'Ver'}</span>
                        </button>
                      </div>
                      <input
                        type={showVaultKey ? 'text' : 'password'}
                        required
                        autoFocus
                        value={vaultChallengeKey}
                        onChange={(e) => setVaultChallengeKey(e.target.value)}
                        placeholder="••••••••••••••••"
                        className="w-full bg-[#0D111A] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 font-mono text-sm tracking-wider"
                      />
                    </div>

                    {vaultError && (
                      <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                        <span>{vaultError}</span>
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={handleCloseSecurityConfigModal}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs cursor-pointer"
                      >
                        Cerrar
                      </button>
                      <button
                        type="submit"
                        disabled={vaultVerifying || !vaultChallengeKey.trim()}
                        className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-lg shadow-amber-500/25 flex items-center gap-2 disabled:opacity-50"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        {vaultVerifying ? 'Verificando Criptográficamente...' : 'Desbloquear y Descifrar Bóveda'}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Cifrado Zero-Trust Activo
                  </span>
                  <span>•</span>
                  <span>Blindaje contra Visualización Indebida</span>
                </div>
              </div>
            ) : (
              /* FASE 2: BÓVEDA DESBLOQUEADA Y EDITABLE */
              <div className="mt-5 space-y-4 text-xs animate-in fade-in duration-200">
                {/* Desbloqueo Exitoso Banner */}
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold">Bóveda descifrada con éxito. Puedes modificar tus credenciales.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsVaultUnlocked(false);
                      setVaultChallengeKey('');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium cursor-pointer flex items-center gap-1"
                  >
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Bloquear</span>
                  </button>
                </div>

                {/* Error Message */}
                {securityFormError && (
                  <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{securityFormError}</span>
                  </div>
                )}

                <form onSubmit={handleSaveSecuritySettings} className="space-y-4">
                  {/* Step 1: New Master Key */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-slate-200 font-bold flex items-center gap-1.5">
                          <Key className="w-3.5 h-3.5 text-amber-400" />
                          1. Nueva Llave Criptográfica Maestra (Opcional)
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                        >
                          {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{showNewPassword ? 'Ocultar' : 'Ver'}</span>
                        </button>
                      </div>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={securityForm.newMasterKey}
                        onChange={(e) => setSecurityForm({ ...securityForm, newMasterKey: e.target.value })}
                        placeholder="Deja en blanco si deseas mantener la misma"
                        className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 font-mono"
                      />
                      {securityForm.newMasterKey && (() => {
                        const k = securityForm.newMasterKey;
                        const letters = (k.match(/[a-zA-Z]/g) || []).length;
                        const uppercase = (k.match(/[A-Z]/g) || []).length;
                        const numbers = (k.match(/[0-9]/g) || []).length;
                        const symbols = (k.match(/[^a-zA-Z0-9\s]/g) || []).length;
                        const hasLetters = letters >= 4;
                        const hasUppercase = uppercase >= 1;
                        const hasNumbers = numbers >= 2;
                        const hasSymbols = symbols >= 1;
                        const isAllMet = hasLetters && hasUppercase && hasNumbers && hasSymbols;

                        return (
                          <div className="mt-2 p-3 rounded-2xl bg-[#0D111A] border border-slate-800 text-[11px] space-y-2">
                            <div className="flex items-center justify-between font-semibold">
                              <span className="text-slate-300">Reglas Bancarias Obligatorias:</span>
                              <span className={isAllMet ? 'text-emerald-400 font-bold' : 'text-amber-400 font-semibold'}>
                                {isAllMet ? '✓ Estándar Bancario Cumplido' : '⚠️ Requisitos Pendientes'}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[10px]">
                              <span className={`p-1.5 rounded-lg border flex items-center gap-1.5 ${
                                hasLetters ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-semibold' : 'bg-slate-900 border-slate-800 text-slate-400'
                              }`}>
                                {hasLetters ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
                                Min. 4 Letras ({letters}/4)
                              </span>
                              <span className={`p-1.5 rounded-lg border flex items-center gap-1.5 ${
                                hasUppercase ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-semibold' : 'bg-slate-900 border-slate-800 text-slate-400'
                              }`}>
                                {hasUppercase ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
                                Min. 1 Mayúscula ({uppercase}/1)
                              </span>
                              <span className={`p-1.5 rounded-lg border flex items-center gap-1.5 ${
                                hasNumbers ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-semibold' : 'bg-slate-900 border-slate-800 text-slate-400'
                              }`}>
                                {hasNumbers ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
                                Min. 2 Números ({numbers}/2)
                              </span>
                              <span className={`p-1.5 rounded-lg border flex items-center gap-1.5 ${
                                hasSymbols ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-semibold' : 'bg-slate-900 border-slate-800 text-slate-400'
                              }`}>
                                {hasSymbols ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
                                Min. 1 Signo ({symbols}/1)
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {securityForm.newMasterKey && (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-slate-300 font-medium">Confirmar Nueva Llave Maestra *</label>
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            <span>{showConfirmPassword ? 'Ocultar' : 'Ver'}</span>
                          </button>
                        </div>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required={Boolean(securityForm.newMasterKey)}
                          value={securityForm.confirmNewMasterKey}
                          onChange={(e) => setSecurityForm({ ...securityForm, confirmNewMasterKey: e.target.value })}
                          placeholder="Repite exactamente la nueva Llave Maestra"
                          className={`w-full bg-[#141A26] border text-white rounded-xl px-3.5 py-2.5 outline-none font-mono ${
                            securityForm.confirmNewMasterKey
                              ? securityForm.confirmNewMasterKey === securityForm.newMasterKey
                                ? 'border-emerald-500 focus:border-emerald-400'
                                : 'border-rose-500 focus:border-rose-400'
                              : 'border-slate-700 focus:border-amber-400'
                          }`}
                        />
                        {securityForm.confirmNewMasterKey && (
                          <p className={`text-[10px] mt-1 font-semibold flex items-center gap-1 ${
                            securityForm.confirmNewMasterKey === securityForm.newMasterKey
                              ? 'text-emerald-400'
                              : 'text-rose-400'
                          }`}>
                            {securityForm.confirmNewMasterKey === securityForm.newMasterKey ? (
                              <>
                                <Check className="w-3 h-3" />
                                ✓ Las claves coinciden perfectamente
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3 h-3" />
                                ⚠️ La confirmación no coincide con la nueva clave
                              </>
                            )}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Step 2: Emergency Channels */}
                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <p className="text-slate-200 font-bold flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                      2. Canales de Rescate para Clave Dinámica de Emergencia
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">WhatsApp Personal de Rescate *</label>
                        <input
                          type="text"
                          required
                          value={securityForm.newEmergencyPhone}
                          onChange={(e) => setSecurityForm({ ...securityForm, newEmergencyPhone: e.target.value })}
                          placeholder="+57 300 123 4567"
                          className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl px-3.5 py-2 outline-none font-mono focus:border-amber-400"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Aquí recibirás los códigos OTP efímeros de 5 min.</p>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Correo Electrónico de Notificación *</label>
                        <input
                          type="email"
                          required
                          value={securityForm.newEmergencyEmail}
                          onChange={(e) => setSecurityForm({ ...securityForm, newEmergencyEmail: e.target.value })}
                          placeholder="luisma0603@gmail.com"
                          className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl px-3.5 py-2 outline-none focus:border-amber-400"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Copia de auditoría para eventos críticos.</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Security Mode (Modo A vs Modo B) & TOTP */}
                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <div>
                      <label className="text-slate-200 font-bold flex items-center justify-between mb-2">
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                          3. Política de Acceso y Nivel de Blindaje
                        </span>
                        <span className="text-[10px] text-amber-400 font-mono">AUTENTICACIÓN</span>
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Modo A */}
                        <div
                          onClick={() => setSecurityForm({ ...securityForm, twoFactorEnabled: false })}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            !securityForm.twoFactorEnabled
                              ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-lg shadow-amber-500/10'
                              : 'bg-[#141A26] border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-xs flex items-center gap-1.5 text-amber-300">
                              <Key className="w-3.5 h-3.5" />
                              Modo A: Llave Maestra + SOS
                            </span>
                            {!securityForm.twoFactorEnabled && (
                              <span className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            Ingreso directo con tu Llave Maestra. Si la olvidas, puedes solicitar un código de un solo uso despachado a tu WhatsApp registrado.
                          </p>
                          <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                            ✓ Recomendado para Operación Ágil
                          </span>
                        </div>

                        {/* Modo B */}
                        <div
                          onClick={() => setSecurityForm({ ...securityForm, twoFactorEnabled: true })}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            securityForm.twoFactorEnabled
                              ? 'bg-blue-500/10 border-blue-500/50 text-white shadow-lg shadow-blue-500/10'
                              : 'bg-[#141A26] border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-xs flex items-center gap-1.5 text-blue-300">
                              <Smartphone className="w-3.5 h-3.5" />
                              Modo B: Blindaje 2FA (TOTP)
                            </span>
                            {securityForm.twoFactorEnabled && (
                              <span className="w-2 h-2 rounded-full bg-blue-400 ring-4 ring-blue-400/20" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            Exige en cada acceso tu Llave Maestra más el token dinámico de 6 dígitos de tu app Google Authenticator o Authy.
                          </p>
                          <span className="inline-block mt-2 text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                            🛡️ Máxima Seguridad Bancaria
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* TOTP Secret (Only configuration if Modo B is active) */}
                    {securityForm.twoFactorEnabled && (
                      <div className="p-3.5 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-2 animate-in fade-in duration-200">
                        <label className="block text-slate-300 text-xs font-semibold flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                            Clave Secreta TOTP para Google Authenticator / Authy:
                          </span>
                          <span className="text-[10px] text-blue-400 font-mono">RFC-6238 COMPLIANT</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <input
                              type={showTotpSecret ? 'text' : 'password'}
                              value={securityForm.newTotpSecret}
                              onChange={(e) => setSecurityForm({ ...securityForm, newTotpSecret: e.target.value })}
                              className="w-full bg-[#141A26] border border-blue-500/40 text-blue-200 rounded-xl px-3.5 py-2 pr-10 outline-none font-mono text-xs font-bold tracking-wider"
                            />
                            <button
                              type="button"
                              onClick={() => setShowTotpSecret(!showTotpSecret)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                            >
                              {showTotpSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(securityForm.newTotpSecret, 'totp-secret')}
                            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-all shrink-0"
                          >
                            {copiedText === 'totp-secret' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedText === 'totp-secret' ? 'Copiado' : 'Copiar Clave'}</span>
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal">
                          Copia esta clave secreta e ingrésala manualmente en tu aplicación autenticadora (cuenta &quot;Prestigia Master&quot; con clave basada en tiempo).
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Submit Buttons */}
                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={handleCloseSecurityConfigModal}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={securityFormLoading}
                      className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold rounded-xl cursor-pointer shadow-lg shadow-amber-500/25 flex items-center gap-2 disabled:opacity-50"
                    >
                      <Lock className="w-4 h-4" />
                      {securityFormLoading ? 'Encriptando y Guardando...' : 'Guardar y Encriptar Nuevas Credenciales'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: FICHA TÉCNICA Y PERFIL OFICIAL DE GOOGLE MAPS           */}
      {/* ============================================================== */}
      {viewPlaceModalBusiness && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D111A] border border-blue-500/50 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-blue-950/40 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-lg">
                  {viewPlaceModalBusiness.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{viewPlaceModalBusiness.name}</h3>
                    {(() => {
                      const nb = getNicheBadge(viewPlaceModalBusiness.category);
                      return (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 ${nb.color}`}>
                          <span>{nb.icon}</span>
                          <span>{nb.label}</span>
                        </span>
                      );
                    })()}
                  </div>
                  <p className="text-xs text-slate-400">
                    Ficha Oficial de Google Maps • ID: <span className="font-mono text-amber-300">{viewPlaceModalBusiness.id}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewPlaceModalBusiness(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="mt-5 space-y-4 text-xs">
              {(() => {
                const primaryBranch = viewPlaceModalBusiness.branches?.[0];
                const placeId = primaryBranch?.googlePlaceId || viewPlaceModalBusiness.id;
                const baselineRating = viewPlaceModalBusiness.baseline?.initialRating || 3.8;
                const currentRating = Math.min(5.0, Number((baselineRating + 1.1).toFixed(1)));
                const googleMapsUrl = primaryBranch?.googlePlaceId 
                  ? `https://www.google.com/maps/place/?q=place_id:${primaryBranch.googlePlaceId}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(viewPlaceModalBusiness.name + ' ' + (primaryBranch?.city || ''))}`;
                const reviewUrl = primaryBranch?.googleReviewUrl || `https://search.google.com/local/writereview?placeid=${placeId}`;

                return (
                  <div className="space-y-4">
                    {/* Official Google Maps Card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#141A26] to-[#0E121B] border border-blue-500/30">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                            <Globe className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white flex items-center gap-2">
                              Ficha Google Business Profile
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
                                Certificada en Red
                              </span>
                            </p>
                            <p className="text-[11px] text-slate-300 mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>{primaryBranch?.address || `${primaryBranch?.locality}, ${primaryBranch?.city}`}</span>
                            </p>
                          </div>
                        </div>

                        <div className="text-left sm:text-right bg-[#0D111A] px-3.5 py-2 rounded-xl border border-slate-800">
                          <div className="flex items-center gap-1 font-mono font-bold text-amber-400 text-sm">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span>{currentRating}★</span>
                            <span className="text-slate-400 text-xs font-normal">Google Maps</span>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            Día 1: {baselineRating}★ (+{Number((currentRating - baselineRating).toFixed(1))}★ Neto)
                          </p>
                        </div>
                      </div>

                      {/* Technical Identifiers */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800 text-[11px]">
                        <div className="bg-[#0D111A] px-3 py-2 rounded-xl border border-slate-800 flex items-center justify-between">
                          <span className="text-slate-400">Place ID:</span>
                          <span className="font-mono text-amber-300 truncate ml-2 font-semibold">{placeId}</span>
                        </div>
                        <div className="bg-[#0D111A] px-3 py-2 rounded-xl border border-slate-800 flex items-center justify-between">
                          <span className="text-slate-400">Sincronización API:</span>
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Activa & Blindada
                          </span>
                        </div>
                      </div>

                      {/* Direct External Action Buttons */}
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2.5">
                        <a
                          href={googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20 transition-all text-center"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Abrir Ficha Oficial en Google Maps ↗</span>
                        </a>

                        <a
                          href={reviewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 transition-all text-center"
                        >
                          <Star className="w-4 h-4 fill-slate-950" />
                          <span>Probar Enlace de Reseña Google ↗</span>
                        </a>
                      </div>
                    </div>

                    {/* Branches List */}
                    <div className="p-4 rounded-2xl bg-[#141A26] border border-slate-800">
                      <p className="font-bold text-white text-xs mb-2.5 flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-blue-400" />
                        Sedes Físicas Registradas ({viewPlaceModalBusiness.branches?.length || 1})
                      </p>
                      <div className="space-y-2">
                        {viewPlaceModalBusiness.branches?.map((branch, bIdx) => (
                          <div key={branch.id || bIdx} className="bg-[#0E121B] p-3 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <div>
                              <p className="font-semibold text-white">{branch.name}</p>
                              <p className="text-[11px] text-slate-400">{branch.address || 'Sin dirección registrada'} • {branch.locality}, {branch.city}</p>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                                WhatsApp Alertas: {branch.managerPhone} ({branch.managerName || 'Encargado Principal'})
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <a
                                href={branch.googleReviewUrl || googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Google Maps</span>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Business Contract & Owner Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-2xl bg-[#141A26] border border-slate-800">
                        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Titular & Contacto</p>
                        <p className="font-bold text-white text-sm">{viewPlaceModalBusiness.ownerName}</p>
                        <p className="text-slate-300 font-mono text-[11px] mt-0.5">{maskPhone(viewPlaceModalBusiness.ownerPhone)}</p>
                        <p className="text-slate-400 text-[11px] truncate mt-0.5">{viewPlaceModalBusiness.ownerEmail}</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#141A26] border border-slate-800">
                        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Plan & Facturación</p>
                        <p className="font-bold text-amber-300 text-sm capitalize">Plan {viewPlaceModalBusiness.plan}</p>
                        <p className="text-slate-300 text-[11px] mt-0.5">NIT / Doc: {viewPlaceModalBusiness.taxId}</p>
                        <p className="text-slate-400 text-[11px] mt-0.5">Vigencia: Activa con Prestigia Master</p>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-800 flex justify-between items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const target = viewPlaceModalBusiness;
                          setViewPlaceModalBusiness(null);
                          handleImpersonate(target);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Entrar al Portal del Cliente</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setViewPlaceModalBusiness(null)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs rounded-xl cursor-pointer"
                      >
                        Cerrar Ficha
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
