'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { RatingStars } from '@/components/RatingStars';
import { ComplaintModal } from '@/components/ComplaintModal';
import { PrestigiaIcon } from '@/components/PrestigiaIcon';
import confetti from 'canvas-confetti';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Facebook,
  Globe,
  Instagram,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Store,
  Gift,
  Trophy,
  Users,
  UserCheck,
  ChevronDown,
} from 'lucide-react';
import {
  COUNTRIES,
  DEFAULT_COUNTRY,
  detectUserCountry,
  toE164Phone,
  validatePhoneNumber,
  CountryDialInfo,
} from '@/lib/countries';

interface PublicBranchInfo {
  businessId: string;
  businessName: string;
  branchId: string;
  branchName: string;
  address?: string;
  city?: string;
  locality?: string;
  googleReviewUrl: string;
  category?: string;
  status: 'active' | 'suspended';
  plan: 'basic' | 'pro' | 'elite';
  managerPhone?: string;
  managerName?: string;
  managerRole?: string;
  staffMembers?: any[];
  websiteUrl: string;
  containmentMessage?: string | null;
  responseTimeSla?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  facebookUrl?: string | null;
  whatsappVipUrl?: string | null;
  campaign?: {
    id: string;
    title: string;
    reward: string;
    active: boolean;
    drawDate?: string;
    terms?: string;
  } | null;
  branding?: {
    logoUrl?: string;
    primaryColor?: string;
    accentColor?: string;
  } | null;
}

export default function RatingCapturePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const businessId = params?.businessId as string;

  const [lang, setLang] = useState<'es' | 'en'>('es');
  const isEn = lang === 'en';

  const [business, setBusiness] = useState<PublicBranchInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Flow states
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [hasRatedPositive, setHasRatedPositive] = useState(false);
  const [hasSubmittedComplaint, setHasSubmittedComplaint] = useState(false);

  // Campaign participation state
  const [campaignCountry, setCampaignCountry] = useState<CountryDialInfo>(DEFAULT_COUNTRY);
  const [campaignParticipantName, setCampaignParticipantName] = useState('');
  const [campaignParticipantPhone, setCampaignParticipantPhone] = useState('');
  const [campaignRegistered, setCampaignRegistered] = useState(false);
  const [registeringCampaign, setRegisteringCampaign] = useState(false);
  const [campaignPhoneError, setCampaignPhoneError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);

  const handleDemoChannelClick = (e: React.MouseEvent, channelName: string, category: 'social' | 'menu' = 'social') => {
    // Record outbound click for Prestigia Live Analytics
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('prestigia_outbound_metrics') || '{"menu": 0, "social": 0}');
        stored[category] = (stored[category] || 0) + 1;
        localStorage.setItem('prestigia_outbound_metrics', JSON.stringify(stored));
      } catch {}
    }

    const targetHref = e.currentTarget.getAttribute('href') || '';
    if (business?.businessId === 'demo' || targetHref.startsWith('#')) {
      e.preventDefault();
      setDemoNotice(
        isEn
          ? `✨ Demo Mode: In your active plan, this connects to your official ${channelName}. (Click tracked in Prestigia Analytics)`
          : `✨ Canal de Demostración: En tu plan activo se vinculará directamente a tu ${channelName} oficial. (Clic registrado en Analítica Prestigia)`
      );
      setTimeout(() => setDemoNotice(null), 4000);
    }
  };

  // Auto-adapt country to user's real geographic location
  useEffect(() => {
    setCampaignCountry(detectUserCountry('CO'));
  }, []);

  useEffect(() => {
    if (!businessId) return;

    const fetchBusiness = async () => {
      try {
        setLoading(true);

        // Universal Demo Mode: Dynamic generation for ANY business category (Retail, Health, Beauty, Hotel, etc.)
        if (businessId === 'demo' || businessId === 'live') {
          const name = searchParams?.get('name') || 'Tu Marca Comercial';
          const cat = searchParams?.get('category') || 'Comercio / Negocio';
          const branchName = searchParams?.get('branch') || 'Sede Principal';
          const address = searchParams?.get('address') || 'Ubicación Comercial Verificada';
          const googleReviewUrl = searchParams?.get('googleUrl') || 'https://google.com';

          let defaultStaff = [
            { name: 'Andrés López', role: 'Atención al Cliente' },
            { name: 'Camila Moreno', role: 'Asesora de Ventas' },
            { name: 'Javier Morales', role: 'Encargado de Turno' },
          ];

          if (cat.includes('Retail') || cat.includes('Comercio')) {
            defaultStaff = [
              { name: 'Carlos Díaz', role: 'Asesor de Ventas' },
              { name: 'Laura Sánchez', role: 'Caja & Facturación' },
              { name: 'Andrés Gómez', role: 'Atención en Tienda' },
            ];
          } else if (cat.includes('Salud') || cat.includes('Consultorios')) {
            defaultStaff = [
              { name: 'Dra. Sandra Martínez', role: 'Especialista' },
              { name: 'Paula Ruiz', role: 'Recepción & Citas' },
              { name: 'Dr. Alejandro Peña', role: 'Atención Médica' },
            ];
          } else if (cat.includes('Estética') || cat.includes('Spa')) {
            defaultStaff = [
              { name: 'Valentina Restrepo', role: 'Estilista / Especialista' },
              { name: 'Mariana Castro', role: 'Terapeuta' },
              { name: 'Diana Morales', role: 'Recepción & Citas' },
            ];
          } else if (cat.includes('Hotelería') || cat.includes('Hospedaje')) {
            defaultStaff = [
              { name: 'Felipe Soto', role: 'Front Desk & Recepción' },
              { name: 'Carolina Mendoza', role: 'Servicio al Huésped' },
              { name: 'Santiago Herrera', role: 'Concierge' },
            ];
          }

          setBusiness({
            businessId: 'demo',
            businessName: name,
            branchId: 'demo-main',
            branchName: branchName,
            address: address,
            googleReviewUrl: googleReviewUrl,
            category: cat,
            status: 'active',
            plan: 'elite',
            managerPhone: '+573000000000',
            managerName: 'Gerente de Sede',
            managerRole: 'Dirección Comercial',
            staffMembers: defaultStaff,
            websiteUrl: '#demo-website',
            instagramUrl: '#demo-instagram',
            tiktokUrl: '#demo-tiktok',
            facebookUrl: '#demo-facebook',
            whatsappVipUrl: '#demo-whatsapp',
            campaign: {
              id: 'demo-campaign',
              title: 'Experiencia VIP & Sorteo Exclusivo',
              reward: 'Bono de Compra / Experiencia VIP',
              active: true,
              drawDate: 'Próximo fin de mes',
              terms: 'Sorteo legal bajo política de privacidad y protección de datos.',
            },
            branding: {
              primaryColor: '#6366f1',
              accentColor: '#4f46e5',
            },
          });
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/businesses/${businessId}?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Pragma': 'no-cache' },
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Negocio o sede no encontrada');
          return;
        }

        const allTeam: Array<{ name: string; role: string }> = [];
        const seen = new Set<string>();

        if (data.managerName && typeof data.managerName === 'string' && data.managerName.trim()) {
          allTeam.push({
            name: data.managerName.trim(),
            role: data.managerRole || (isEn ? 'Branch Manager' : 'Gerente de Sede'),
          });
          seen.add(data.managerName.trim().toLowerCase());
        }

        if (Array.isArray(data.managers)) {
          data.managers.forEach((m: any) => {
            if (m?.name && !seen.has(m.name.trim().toLowerCase())) {
              allTeam.push({
                name: m.name.trim(),
                role: m.role || (isEn ? 'Shift Lead' : 'Encargado de Turno'),
              });
              seen.add(m.name.trim().toLowerCase());
            }
          });
        }

        if (Array.isArray(data.staffMembers)) {
          data.staffMembers.forEach((s: any) => {
            const sName = typeof s === 'object' && s !== null ? s.name : String(s);
            if (sName && !seen.has(sName.trim().toLowerCase())) {
              allTeam.push({
                name: sName.trim(),
                role: typeof s === 'object' && s !== null && s.role ? s.role : '',
              });
              seen.add(sName.trim().toLowerCase());
            }
          });
        }

        if (allTeam.length > 0) {
          data.staffMembers = allTeam;
        }

        setBusiness(data);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar la información de la sede.');
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [businessId, isEn]);

  // Handler for rating selection (The Core Bifurcation Logic)
  const handleRatingSelected = (rating: number) => {
    setSelectedRating(rating);

    if (!business) return;

    if (rating >= 4) {
      // 1. Positive rating: Open Google Maps review modal immediately
      setHasRatedPositive(true);

      // Record positive interaction with staff attribution in background
      if (selectedStaff && selectedStaff !== 'Otro / No recuerdo') {
        try {
          fetch('/api/feedbacks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              businessId: business.branchId || business.businessId,
              rating,
              customerName: isEn ? 'Verified Customer' : 'Cliente Verificado',
              customerPhone: '+573000000000',
              complaintReason: isEn ? '5-Star positive experience' : 'Calificación positiva 5★ verificada',
              attendedBy: selectedStaff,
              clubConsent: true,
              status: 'resolved',
            }),
          }).catch(() => {});
        } catch {}
      }

      if (business.googleReviewUrl) {
        let directUrl = business.googleReviewUrl.trim();
        if (!directUrl.includes('writereview') && !directUrl.includes('/review')) {
          const chijMatch = directUrl.match(/ChIJ[a-zA-Z0-9_-]{15,}/);
          if (chijMatch && chijMatch[0]) {
            directUrl = `https://search.google.com/local/writereview?placeid=${chijMatch[0]}`;
          }
        }
        window.open(directUrl, '_blank');
      }
    } else {
      // 2. Negative rating: Block Google Maps completely and open private complaint modal
      setShowComplaintModal(true);
    }
  };

  const handleCampaignNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permite solo letras (incluye acentos y eñes) y espacios
    const lettersOnly = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    setCampaignParticipantName(lettersOnly);
  };

  const handleCampaignPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/[^0-9]/g, '').slice(0, campaignCountry.maxDigits);
    setCampaignParticipantPhone(digitsOnly);

    if (digitsOnly.length > 0) {
      const val = validatePhoneNumber(campaignCountry, digitsOnly, isEn);
      if (!val.valid) {
        setCampaignPhoneError(val.error || '');
      } else {
        setCampaignPhoneError('');
      }
    } else {
      setCampaignPhoneError('');
    }
  };

  const handleRegisterCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setCampaignPhoneError('');
    if (!business) return;

    const val = validatePhoneNumber(campaignCountry, campaignParticipantPhone, isEn);
    if (!val.valid) {
      setCampaignPhoneError(val.error || (isEn ? 'Enter a valid phone number.' : 'Ingresa un número telefónico válido.'));
      return;
    }

    const fullE164 = toE164Phone(campaignCountry.dialCode, campaignParticipantPhone);

    try {
      setRegisteringCampaign(true);
      const res = await fetch('/api/portal/campaign', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_participant',
          participant: {
            businessId: business.businessId,
            branchId: business.branchId,
            branchName: business.branchName,
            customerName: campaignParticipantName.trim() || 'Cliente VIP',
            customerPhone: fullE164,
            rating: selectedRating || 5,
            attendedBy: selectedStaff && selectedStaff !== 'Otro / No recuerdo' ? selectedStaff : undefined,
          },
        }),
      });
      if (res.ok) {
        setCampaignRegistered(true);
        setShowConfetti(true);

        // Disparo de confetti festivo real en pantalla
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899', '#3B82F6'],
          });
          setTimeout(() => {
            confetti({
              particleCount: 70,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
              colors: ['#F59E0B', '#10B981', '#6366F1'],
            });
            confetti({
              particleCount: 70,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
              colors: ['#F59E0B', '#10B981', '#6366F1'],
            });
          }, 300);
        } catch (e) {
          console.error('Error disparando confetti:', e);
        }

        setTimeout(() => setShowConfetti(false), 5000);
      }
    } catch (err) {
      console.error('Error registering in campaign:', err);
      setCampaignPhoneError(isEn ? 'Error registering your number. Please try again.' : 'Error al registrar tu número. Por favor intenta de nuevo.');
    } finally {
      setRegisteringCampaign(false);
    }
  };

  // State: Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-prestigia-bg px-4 py-8">
        <main className="w-full max-w-md p-6 flex flex-col justify-center items-center text-center animate-pulse mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 mb-6"></div>
          <div className="h-6 w-48 bg-slate-800 rounded-lg mb-3"></div>
          <div className="h-4 w-32 bg-slate-800 rounded-lg mb-8"></div>
          <div className="h-12 w-64 bg-slate-800 rounded-xl mb-4"></div>
        </main>
      </div>
    );
  }

  // State: Error / Not found
  if (error || !business) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-prestigia-bg px-4 py-8">
        <main className="w-full max-w-md p-6 flex flex-col justify-center items-center text-center mx-auto">
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-prestigia-alert mb-4">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">
            {isEn ? 'Location Unavailable' : 'Sede no disponible'}
          </h1>
          <p className="text-sm text-slate-400 mb-6 max-w-xs">
            {error || (isEn ? 'The location identifier is invalid or has expired.' : 'El identificador de la sede no es válido o ha expirado.')}
          </p>
          <span className="text-xs text-slate-500">
            {isEn ? 'Prestigia Platform' : 'Plataforma Prestigia'}
          </span>
        </main>
      </div>
    );
  }

  // State: Suspended business (Kill Switch / Morosidad)
  if (business.status === 'suspended') {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-prestigia-bg px-4 py-8">
        <main className="w-full max-w-md p-6 flex flex-col justify-center items-center text-center mx-auto">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">
            {isEn ? 'Service Under Maintenance' : 'Servicio en Mantenimiento'}
          </h1>
          <p className="text-sm text-slate-400 mb-6 max-w-xs">
            {isEn ? (
              <>The evaluation channel for <strong className="text-white">{business.businessName} ({business.branchName})</strong> is temporarily inactive.</>
            ) : (
              <>El canal de evaluación de <strong className="text-white">{business.businessName} ({business.branchName})</strong> se encuentra temporalmente inactivo.</>
            )}
          </p>
          <div className="text-xs text-slate-500">
            Prestigia • {isEn ? 'Reputation System' : 'Sistema de Reputación'}
          </div>
        </main>
      </div>
    );
  }

  const hasSocials = Boolean(
    business.instagramUrl ||
    business.tiktokUrl ||
    business.facebookUrl ||
    business.whatsappVipUrl
  );

  const brandColor = business.branding?.primaryColor || '#6366F1';

  const getLocalizedCampaignTitle = (title?: string) => {
    if (!title) return isEn ? 'Monthly Satisfaction Campaign' : 'Campaña de Satisfacción del Mes';
    if (!isEn) return title;
    if (title.toLowerCase().includes('sorteo mensual vip')) {
      return title.replace(/sorteo mensual vip:\s*/i, 'VIP Monthly Giveaway: ')
                  .replace(/experiencia burger para 2/i, 'Burger Experience for 2');
    }
    return title;
  };

  const getLocalizedCampaignReward = (reward?: string) => {
    if (!reward) return '';
    if (!isEn) return reward;
    if (reward.toLowerCase().includes('cena gourmet')) {
      return 'Gourmet Dinner for 2 (Signature Burgers + Cocktails + Dessert)';
    }
    return reward;
  };

  const getLocalizedDrawDate = (date?: string) => {
    if (!date) return '';
    if (!isEn) return date;
    if (date.toLowerCase().includes('septiembre')) {
      return 'September 30, 2026';
    }
    return date;
  };

  const getLocalizedCategory = (cat?: string) => {
    if (!cat) return '';
    if (!isEn) return cat;
    if (cat.toLowerCase().includes('hamburguesería & gastrobar')) {
      return 'Burger Restaurant & Gastrobar';
    }
    return cat;
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-prestigia-bg px-3 py-4 sm:py-8">
      <main className="w-full max-w-md min-h-screen sm:min-h-0 flex flex-col justify-between p-5 sm:p-6 select-none bg-prestigia-bg mx-auto">
        {/* Top Bar / Branding */}
        <header className="flex items-center justify-between pt-2 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <PrestigiaIcon className="w-8 h-8 drop-shadow-md" />
          <span className="text-xs font-black tracking-widest text-white">PRESTIGIA</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setLang('es')}
              className={`px-2 py-0.5 rounded transition ${
                lang === 'es' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🇨🇴 ES
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 rounded transition ${
                lang === 'en' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🇺🇸 EN
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isEn ? 'Safe Filter' : 'Filtro Seguro'}</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <section className="my-auto py-6">
        {hasRatedPositive || hasSubmittedComplaint ? (
          /* POST-REVIEW LOYALTY & MULTI-CHANNEL HUB */
          <div className="w-full bg-prestigia-card border border-prestigia-cardBorder rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center glow-primary animate-in zoom-in-95 duration-300">
            {/* Top Glow Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80" />

            {/* Business Logo / Checkmark Badge */}
            {business.branding?.logoUrl ? (
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl overflow-hidden border border-slate-700 shadow-xl relative bg-slate-900 flex items-center justify-center">
                <img
                  src={business.branding.logoUrl}
                  alt={business.businessName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full text-slate-950 shadow-md">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
              </div>
            ) : (
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-b from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg">
                <CheckCircle className="w-7 h-7" />
              </div>
            )}

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-prestigia-gold fill-prestigia-gold" />
              <span>
                {hasRatedPositive
                  ? (isEn ? '5★ Rating on Google!' : '¡Calificación 5★ en Google!')
                  : (isEn ? 'Report Received by Management!' : '¡Reporte Recibido por Gerencia!')}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">
              {hasRatedPositive
                ? (isEn ? 'Thank You for Your Support!' : '¡Muchas Gracias por tu Apoyo!')
                : (isEn ? 'Thank You for Helping Us Improve!' : '¡Gracias por Ayudarnos a Mejorar!')}
            </h2>

            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              {hasRatedPositive ? (
                isEn ? (
                  <>
                    Your review fuels the growth of <strong className="text-white">{business.businessName}</strong>. 
                    As our appreciation, connect with us to access exclusive offers and perks:
                  </>
                ) : (
                  <>
                    Tu reseña impulsa el crecimiento de <strong className="text-white">{business.businessName}</strong>. 
                    Como agradecimiento, conéctate con nosotros para acceder a promociones y beneficios exclusivos:
                  </>
                )
              ) : (
                isEn ? (
                  <>
                    Your honest feedback helps us improve details at <strong className="text-white">{business.businessName}</strong>. 
                    Our management team already has your case. You can explore more on our official channels:
                  </>
                ) : (
                  <>
                    Tu opinión sincera nos ayuda a corregir detalles en <strong className="text-white">{business.businessName}</strong>. 
                    Nuestro equipo ya tiene tu caso. Puedes conocer más y seguirnos en nuestros canales oficiales:
                  </>
                )
              )}
            </p>

            {/* Campaign Participation Card on Positive Review (Only if rated positive) */}
            {hasRatedPositive && business.campaign && business.campaign.active && (
              <div className="mb-4 p-4 rounded-2xl bg-slate-900/90 border border-amber-500/40 text-left space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wide truncate">
                      {getLocalizedCampaignTitle(business.campaign.title)}
                    </span>
                  </div>
                  <span className="shrink-0 inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold tracking-wide whitespace-nowrap shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 animate-pulse"></span>
                    {isEn ? 'Active Prize' : 'Premio Activo'}
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  {isEn ? (
                    <>Enter your WhatsApp to participate for <strong>{getLocalizedCampaignReward(business.campaign.reward)}</strong>!</>
                  ) : (
                    <>¡Anota tu WhatsApp para participar por <strong>{business.campaign.reward}</strong>!</>
                  )}
                </p>

                {campaignRegistered ? (
                  <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-950/90 via-[#071F18] to-slate-950 border border-emerald-500/40 text-center space-y-2.5 relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                    <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-md">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold text-white tracking-tight">
                        {isEn ? 'Successful Giveaway Entry!' : '¡Inscripción Exitosa en el Sorteo!'}
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed max-w-xs mx-auto">
                        {isEn ? (
                          <>Your number was securely registered. If you are the winner, we will contact you via WhatsApp on <strong className="text-emerald-300">{getLocalizedDrawDate(business.campaign.drawDate) || 'month end'}</strong>. Good luck! 🍀</>
                        ) : (
                          <>Tu número quedó registrado de forma segura. Si resultas ganador(a), te contactaremos por WhatsApp el <strong className="text-emerald-300">{business.campaign.drawDate || 'cierre de mes'}</strong>. ¡Mucha suerte! 🍀</>
                        )}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      <span>{isEn ? '🎟️ Confirmed Digital Ticket' : '🎟️ Ticket Digital Confirmado'}</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRegisterCampaign} className="space-y-2.5">
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={campaignParticipantName}
                        onChange={handleCampaignNameChange}
                        placeholder={isEn ? "Your Full Name" : "Tu Nombre Completo"}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                        required
                      />
                      <div className="flex items-center gap-2 w-full">
                        <select
                          value={campaignCountry.code}
                          onChange={(e) => {
                            const found = COUNTRIES.find((c) => c.code === e.target.value) || DEFAULT_COUNTRY;
                            setCampaignCountry(found);
                            setCampaignPhoneError('');
                            setCampaignParticipantPhone('');
                          }}
                          aria-label={isEn ? "Select country code" : "Seleccionar código de país"}
                          className="h-[40px] w-[115px] sm:w-[130px] px-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-amber-400 cursor-pointer shrink-0 truncate"
                        >
                          {COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                              {c.flag} {c.dialCode} ({isEn ? c.nameEn : c.name})
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          maxLength={campaignCountry.maxDigits}
                          inputMode="numeric"
                          value={campaignParticipantPhone}
                          onChange={handleCampaignPhoneChange}
                          placeholder={`Ej: ${campaignCountry.example}`}
                          className={`flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-slate-950 border text-white text-xs focus:outline-none transition ${
                            campaignPhoneError ? 'border-red-500/80 focus:border-red-400' : 'border-slate-700 focus:border-amber-400'
                          }`}
                          required
                        />
                      </div>
                    </div>

                    {campaignPhoneError && (
                      <div className="p-2 rounded-lg bg-red-950/50 border border-red-500/30 text-red-300 text-[11px] flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span>{campaignPhoneError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={registeringCampaign}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/20 active:scale-98 flex items-center justify-center gap-2"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>
                        {registeringCampaign
                          ? (isEn ? 'Registering entry...' : 'Anotando en el sorteo...')
                          : (isEn ? 'Enter the Official Giveaway! 🎟️' : '¡Anotarme en el Sorteo Oficial! 🎟️')}
                      </span>
                    </button>
                    <span className="text-[10px] text-slate-400 block text-center">
                      {isEn ? '🔒 Legal data protection. Zero spam guaranteed.' : '🔒 Tratamiento de datos legal (Habeas Data). Cero spam garantizado.'}
                    </span>
                  </form>
                )}
              </div>
            )}

            {/* 1. MANDATORY OFFICIAL COMMERCIAL WEBSITE BUTTON */}
            <a
              href={business.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleDemoChannelClick(e, isEn ? 'Official Website' : 'Sitio Web Oficial')}
              className="flex items-center justify-between w-full p-4 rounded-2xl text-white font-bold text-sm shadow-xl transition active:scale-[0.98] mb-4 group border border-slate-700/60"
              style={{
                background: `linear-gradient(135deg, ${brandColor}, #1E1B4B)`,
                boxShadow: `0 10px 25px -5px ${brandColor}35`,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10 group-hover:scale-110 transition">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div className="font-extrabold text-sm text-white">
                  {isEn ? 'Official Website' : 'Sitio Web Oficial'}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition" />
            </a>

            {/* 2. CONFIGURABLE SOCIAL CHANNELS (Basic: 1 single network | Pro & Élite: Full multichannel) */}
            {hasSocials && (
              <div className="space-y-2 mb-4 pt-1">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-2">
                  <span>{business.plan !== 'basic' ? (isEn ? 'Official Channels:' : 'Canales Oficiales Multicanal:') : (isEn ? 'Official Social Channel:' : 'Canal Social Oficial:')}</span>
                </div>

                {demoNotice && (
                  <div className="p-3 rounded-xl bg-indigo-950/90 border border-indigo-500/40 text-indigo-200 text-xs font-medium text-center animate-in fade-in slide-in-from-top-1 duration-200 shadow-lg">
                    {demoNotice}
                  </div>
                )}

                {/* Digital Menu / Services (Shown if available or demo) */}
                {((business as any).menuUrl || business.websiteUrl || business.businessId === 'demo') && (
                  <a
                    href={(business as any).menuUrl || business.websiteUrl || '#demo-menu'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleDemoChannelClick(e, isEn ? 'Digital Menu' : 'Menú Digital', 'menu')}
                    className="flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600/80 to-blue-600/80 hover:opacity-95 text-white font-semibold text-xs transition active:scale-[0.99] border border-cyan-400/30"
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4" />
                      <span>{isEn ? 'View Digital Menu & Services' : 'Ver Carta / Menú Digital'}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                )}

                {/* Instagram (Always shown if present) */}
                {business.instagramUrl && (
                  <a
                    href={business.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleDemoChannelClick(e, 'Instagram')}
                    className="flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600/80 via-pink-600/80 to-rose-500/80 hover:opacity-95 text-white font-semibold text-xs transition active:scale-[0.99] border border-pink-400/30"
                  >
                    <div className="flex items-center gap-2.5">
                      <Instagram className="w-4 h-4" />
                      <span>{isEn ? 'Follow us on Instagram' : 'Síguenos en Instagram'}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                )}

                {/* TikTok (If Pro/Élite, or if Basic without Instagram) */}
                {business.tiktokUrl && (business.plan !== 'basic' || !business.instagramUrl) && (
                  <a
                    href={business.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleDemoChannelClick(e, 'TikTok')}
                    className="flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition active:scale-[0.99] border border-slate-700"
                  >
                    <div className="flex items-center gap-2.5">
                      <svg
                        className="w-4 h-4 fill-white shrink-0"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3 15.25a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.05a8.21 8.21 0 0 0 4.91 1.6v-3.46a4.85 4.85 0 0 1-1-.5z" />
                      </svg>
                      <span>{isEn ? 'Follow us on TikTok' : 'Síguenos en TikTok'}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                )}

                {/* Facebook (If Pro/Élite, or if Basic without Instagram/TikTok) */}
                {business.facebookUrl &&
                  (business.plan !== 'basic' || (!business.instagramUrl && !business.tiktokUrl)) && (
                    <a
                      href={business.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleDemoChannelClick(e, 'Facebook')}
                      className="flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-[#1877F2]/80 hover:bg-[#1877F2] text-white font-semibold text-xs transition active:scale-[0.99] border border-blue-400/30"
                    >
                      <div className="flex items-center gap-2.5">
                        <Facebook className="w-4 h-4 fill-white text-white" />
                        <span>{isEn ? 'Follow us on Facebook' : 'Síguenos en Facebook'}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>
                  )}

                {/* WhatsApp VIP Club (Exclusivo Plan ÉLITE) */}
                {business.whatsappVipUrl && business.plan === 'elite' && (
                  <a
                    href={business.whatsappVipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleDemoChannelClick(e, isEn ? 'VIP WhatsApp Club' : 'Club VIP de WhatsApp')}
                    className="flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white font-semibold text-xs transition active:scale-[0.99] border border-emerald-400/30"
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageCircle className="w-4 h-4" />
                      <span>{isEn ? 'VIP Customer Club on WhatsApp' : 'Club VIP de Clientes en WhatsApp'}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                )}
              </div>
            )}

            {/* Revisit Google Maps Link only if rated positive */}
            {hasRatedPositive && (
              <a
                href={business.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-white pt-2 transition underline"
              >
                <span>{isEn ? "Didn't your review open? Tap here for Google Maps" : "¿No abrió tu reseña? Toca aquí para ir a Google Maps"}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ) : (
          /* STANDARD RATING CAPTURE SCREEN */
          <div className="w-full bg-prestigia-card border border-prestigia-cardBorder rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center glow-primary">
            {/* Subtle top glow line */}
            <div
              className="absolute top-0 left-0 right-0 h-1 opacity-80"
              style={{
                background: `linear-gradient(to right, transparent, ${brandColor}, transparent)`,
              }}
            />

            {/* Business Icon / Logo Avatar */}
            {business.branding?.logoUrl ? (
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-xl flex items-center justify-center">
                <img
                  src={business.branding.logoUrl}
                  alt={business.businessName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 flex items-center justify-center shadow-lg"
                style={{ color: brandColor }}
              >
                <Store className="w-8 h-8" />
              </div>
            )}

            {/* Brand Name */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
              {business.businessName}
            </h1>

            {/* Specific Branch Badge */}
            <div className="mb-3">
              <span
                className="inline-block px-3 py-1 rounded-full font-bold text-xs tracking-wide border"
                style={{
                  backgroundColor: `${brandColor}20`,
                  borderColor: `${brandColor}40`,
                  color: brandColor,
                }}
              >
                {isEn && business.branchName.startsWith('Sede ')
                  ? `${business.branchName.replace('Sede ', '')} Location`
                  : business.branchName}
              </span>
            </div>

            {/* Category & Location Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-xs text-slate-400">
              {business.category && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/50">
                  {getLocalizedCategory(business.category)}
                </span>
              )}
              {business.city && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/50">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {business.locality ? `${business.locality}, ${business.city}` : business.city}
                </span>
              )}
            </div>

            {/* Active Campaign Banner (Incentive to Rate) */}
            {business.campaign && business.campaign.active && (
              <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-indigo-500/20 border border-amber-500/40 text-left relative overflow-hidden shadow-lg">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                    <Gift className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                    {getLocalizedCampaignTitle(business.campaign.title)}
                  </span>
                </div>
                <p className="text-xs text-white font-medium leading-relaxed">
                  {isEn ? (
                    <>🎁 Enter our campaign for a chance to win: <strong className="text-amber-200">{getLocalizedCampaignReward(business.campaign.reward)}</strong>.</>
                  ) : (
                    <>🎁 Participa en nuestra campaña y puedes ganar: <strong className="text-amber-200">{business.campaign.reward}</strong>.</>
                  )}
                </p>
                {business.campaign.drawDate && (
                  <div className="text-[10px] text-slate-300 mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-between">
                    <span>{isEn ? '📅 Draw:' : '📅 Sorteo:'} <strong>{getLocalizedDrawDate(business.campaign.drawDate)}</strong></span>
                    <span className="text-emerald-400 font-bold">{isEn ? '100% Free with your rating!' : '¡100% Gratis con tu voto!'}</span>
                  </div>
                )}
              </div>
            )}

            {/* Staff / Attendant Dropdown Selector on First Screen (Idea 1) */}
            {business.staffMembers && business.staffMembers.length > 0 && (
              <div className="mb-5 text-left bg-slate-900/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800 shadow-inner">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <label htmlFor="staff-dropdown" className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{isEn ? 'Who attended you today?' : '¿Quién te atendió el día de hoy?'}</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/50">
                    {isEn ? 'Optional' : 'Opcional'}
                  </span>
                </div>

                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400">
                    <Users className="w-4 h-4" />
                  </div>

                  <select
                    id="staff-dropdown"
                    value={selectedStaff}
                    onChange={(e) => setSelectedStaff(e.target.value)}
                    className="w-full appearance-none pl-10 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-700/80 hover:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white text-xs sm:text-sm font-medium transition cursor-pointer outline-none shadow-inner"
                  >
                    <option value="" className="bg-slate-900 text-slate-300 py-2">
                      {isEn ? '👥 General Service / Full team' : '👥 Servicio General / Todo el equipo'}
                    </option>
                    {business.staffMembers.map((staff, idx) => {
                      const staffName = typeof staff === 'object' && staff !== null ? staff.name : String(staff);
                      const staffRole = typeof staff === 'object' && staff !== null && staff.role ? ` (${staff.role})` : '';
                      return (
                        <option key={idx} value={staffName} className="bg-slate-900 text-white py-2">
                          👤 {staffName}{staffRole}
                        </option>
                      );
                    })}
                  </select>

                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>

                {/* Selected staff confirmation pill */}
                {selectedStaff && (
                  <div className="mt-2.5 flex items-center justify-between px-3 py-1.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-[11px] animate-in fade-in duration-200">
                    <div className="flex items-center gap-1.5 text-indigo-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>{isEn ? 'Selected:' : 'Atendido por:'} <strong className="text-white font-semibold">{selectedStaff}</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedStaff('')}
                      className="text-[10px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
                    >
                      {isEn ? 'Clear' : 'Quitar'}
                    </button>
                  </div>
                )}
              </div>
            )}

            <p className="text-sm text-slate-300 mb-2">
              {isEn ? 'How would you rate your experience today?' : '¿Cómo calificarías tu experiencia el día de hoy?'}
            </p>

            {/* 1 to 5 Star Selector */}
            <RatingStars
              onSelectRating={handleRatingSelected}
              disabled={hasRatedPositive}
            />
          </div>
        )}
      </section>

      {/* Private Complaint Modal (1 to 3 stars) */}
      {showComplaintModal && selectedRating !== null && (
        <ComplaintModal
          isOpen={showComplaintModal}
          onClose={() => {
            setShowComplaintModal(false);
          }}
          onSubmitted={() => {
            setHasSubmittedComplaint(true);
          }}
          businessId={business.branchId || business.businessId}
          businessName={
            business.branchName && business.branchName !== business.businessName && business.branchName !== 'Sede Principal'
              ? `${business.businessName} (${business.branchName})`
              : business.businessName
          }
          rating={selectedRating}
          plan={business.plan}
          managerPhone={business.managerPhone}
          staffMembers={business.staffMembers}
          preselectedStaff={selectedStaff}
          containmentMessage={business.containmentMessage || undefined}
          responseTimeSla={business.responseTimeSla || undefined}
          lang={lang}
        />
      )}

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-prestigia-primary" />
          <span>{isEn ? 'Experience powered by Prestigia' : 'Experiencia respaldada por Prestigia'}</span>
        </p>
      </footer>
    </main>
  </div>
  );
}
