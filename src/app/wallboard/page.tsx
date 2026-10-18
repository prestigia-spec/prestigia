'use client';

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Tv,
  Award,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Gift,
  Trophy,
  DollarSign,
  Zap,
  RotateCw,
  Play,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  Store,
  MapPin,
  Sparkles,
  ArrowLeft,
  Building2,
  X,
} from 'lucide-react';
import {
  SatisfactionCampaign,
  BrandIdentity,
  Feedback,
  GoogleReview,
} from '@/lib/types';

// Multi-Industry Label & Vocabulary Framework
function getIndustryLabels(category: string = '', language: 'es' | 'en' = 'es') {
  const cat = category.toLowerCase();
  const isEn = language === 'en';

  if (cat.includes('salud') || cat.includes('medic') || cat.includes('clínic') || cat.includes('clinic') || cat.includes('odontolog') || cat.includes('dental') || cat.includes('oftalmolog')) {
    return {
      experienceUnit: isEn ? 'Patients' : 'Pacientes',
      experienceSingular: isEn ? 'Patient' : 'Paciente',
      satisfactionLabel: isEn ? 'Patient Satisfaction' : 'Satisfacción de Pacientes',
      experienceToday: isEn ? 'Patients Attended Today' : 'Pacientes Atendidos Hoy',
      shiftName: isEn ? 'Clinical Shift' : 'Turno Asistencial',
      venueTerm: isEn ? 'Clinic' : 'Sede Médica / Clínica',
    };
  }
  if (cat.includes('hotel') || cat.includes('hosped') || cat.includes('resort') || cat.includes('turism') || cat.includes('posada') || cat.includes('glamping')) {
    return {
      experienceUnit: isEn ? 'Guests' : 'Huéspedes',
      experienceSingular: isEn ? 'Guest' : 'Huésped',
      satisfactionLabel: isEn ? 'Guest Experience' : 'Satisfacción del Huésped',
      experienceToday: isEn ? 'Guests Registered Today' : 'Huéspedes Atendidos Hoy',
      shiftName: isEn ? 'Hospitality Shift' : 'Turno de Hospitalidad',
      venueTerm: isEn ? 'Hotel' : 'Sede Hotel',
    };
  }
  if (cat.includes('spa') || cat.includes('estétic') || cat.includes('estetic') || cat.includes('belleza') || cat.includes('barber') || cat.includes('peluquer') || cat.includes('uñas')) {
    return {
      experienceUnit: isEn ? 'Clients' : 'Clientes',
      experienceSingular: isEn ? 'Client' : 'Cliente',
      satisfactionLabel: isEn ? 'Beauty & Care Satisfaction' : 'Satisfacción en Servicio',
      experienceToday: isEn ? 'Appointments Attended Today' : 'Citas Atendidas Hoy',
      shiftName: isEn ? 'Salon & Studio Shift' : 'Turno de Cabina & Salón',
      venueTerm: isEn ? 'Studio / Spa' : 'Sede Studio / Spa',
    };
  }
  if (cat.includes('gym') || cat.includes('gimnasio') || cat.includes('fitness') || cat.includes('crossfit') || cat.includes('deport') || cat.includes('yoga') || cat.includes('pilates')) {
    return {
      experienceUnit: isEn ? 'Athletes / Members' : 'Atletas / Afiliados',
      experienceSingular: isEn ? 'Member' : 'Afiliado',
      satisfactionLabel: isEn ? 'Training & Member Experience' : 'Satisfacción en Entrenamiento',
      experienceToday: isEn ? 'Members Trained Today' : 'Miembros Entrenados Hoy',
      shiftName: isEn ? 'Gym Operation Shift' : 'Turno de Entrenamiento',
      venueTerm: isEn ? 'Club / Gym' : 'Sede Club / Gimnasio',
    };
  }
  if (cat.includes('auto') || cat.includes('taller') || cat.includes('mecanic') || cat.includes('concesionar') || cat.includes('detailing') || cat.includes('llantas')) {
    return {
      experienceUnit: isEn ? 'Vehicle Owners' : 'Propietarios de Vehículos',
      experienceSingular: isEn ? 'Driver' : 'Conductor',
      satisfactionLabel: isEn ? 'Workshop Confidence' : 'Índice de Confianza en Servicio',
      experienceToday: isEn ? 'Vehicles Serviced Today' : 'Vehículos Atendidos Hoy',
      shiftName: isEn ? 'Workshop Shift' : 'Turno Técnico Operativo',
      venueTerm: isEn ? 'Service Center' : 'Centro de Servicio',
    };
  }
  if (cat.includes('retail') || cat.includes('tienda') || cat.includes('moda') || cat.includes('joyer') || cat.includes('comercio') || cat.includes('boutique') || cat.includes('calzado')) {
    return {
      experienceUnit: isEn ? 'Shoppers' : 'Compradores',
      experienceSingular: isEn ? 'Shopper' : 'Comprador',
      satisfactionLabel: isEn ? 'Shopping Experience' : 'Satisfacción de Compra',
      experienceToday: isEn ? 'Shoppers Attended Today' : 'Compradores Atendidos Hoy',
      shiftName: isEn ? 'Store Shift' : 'Turno de Tienda',
      venueTerm: isEn ? 'Store / Boutique' : 'Tienda / Boutique',
    };
  }
  if (cat.includes('veterinar') || cat.includes('pet') || cat.includes('mascota') || cat.includes('canin')) {
    return {
      experienceUnit: isEn ? 'Patients & Guardians' : 'Pacientes & Tutores',
      experienceSingular: isEn ? 'Guardian' : 'Tutor / Mascota',
      satisfactionLabel: isEn ? 'Pet Care Satisfaction' : 'Satisfacción en Cuidado Animal',
      experienceToday: isEn ? 'Pets Attended Today' : 'Mascotas Atendidas Hoy',
      shiftName: isEn ? 'Veterinary Shift' : 'Turno Médico Veterinario',
      venueTerm: isEn ? 'Veterinary Center' : 'Clínica Veterinaria',
    };
  }
  if (cat.includes('abogad') || cat.includes('jurid') || cat.includes('legal') || cat.includes('inmobiliaria') || cat.includes('consultor') || cat.includes('contab') || cat.includes('agencia') || cat.includes('notaria')) {
    return {
      experienceUnit: isEn ? 'Clients / Accounts' : 'Clientes / Asesorados',
      experienceSingular: isEn ? 'Client' : 'Cliente',
      satisfactionLabel: isEn ? 'Advisory Satisfaction' : 'Satisfacción & Confianza',
      experienceToday: isEn ? 'Consultations Delivered Today' : 'Asesorías Brindadas Hoy',
      shiftName: isEn ? 'Professional Business Hours' : 'Jornada Profesional',
      venueTerm: isEn ? 'Firm / Office' : 'Firma / Oficina',
    };
  }
  if (cat.includes('restaurant') || cat.includes('gastro') || cat.includes('café') || cat.includes('cafe') || cat.includes('bar') || cat.includes('pizza') || cat.includes('hamburgue') || cat.includes('disco') || cat.includes('club') || cat.includes('lounge')) {
    return {
      experienceUnit: isEn ? 'Guests' : 'Clientes',
      experienceSingular: isEn ? 'Guest' : 'Cliente',
      satisfactionLabel: isEn ? 'Experience & Service' : 'Satisfacción de Servicio',
      experienceToday: isEn ? 'Guests Attended Today' : 'Clientes Atendidos Hoy',
      shiftName: isEn ? 'Service Shift' : 'Turno de Servicio',
      venueTerm: isEn ? 'Branch / Venue' : 'Sede / Establecimiento',
    };
  }
  // Default Universal: Fits ANY commercial business, clinic, office or service
  return {
    experienceUnit: isEn ? 'Clients' : 'Clientes',
    experienceSingular: isEn ? 'Client' : 'Cliente',
    satisfactionLabel: isEn ? 'Customer Satisfaction' : 'Satisfacción General',
    experienceToday: isEn ? 'Clients Attended Today' : 'Clientes Atendidos Hoy',
    shiftName: isEn ? 'Daily Operation' : 'Operación del Día',
    venueTerm: isEn ? 'Branch' : 'Sede',
  };
}

// Multi-Industry Dynamic Team Role Preset Generator
function getIndustryStaffMembers(category: string = '', isEn: boolean = false): Array<{ name: string; role: string }> {
  const cat = category.toLowerCase();
  
  if (cat.includes('salud') || cat.includes('medic') || cat.includes('clínic') || cat.includes('clinic') || cat.includes('odontolog') || cat.includes('dental')) {
    return [
      { name: 'Dra. Camila Morales', role: isEn ? 'Lead Specialist' : 'Especialista Principal' },
      { name: 'Dr. Sebastián Roa', role: isEn ? 'Clinical Specialist' : 'Odontólogo / Terapeuta' },
      { name: 'Laura Cárdenas', role: isEn ? 'Clinical Care Coordinator' : 'Coordinadora Asistencial' },
      { name: 'Mariana Beltrán', role: isEn ? 'Front Desk & Patient Care' : 'Recepción & Citas' },
      { name: 'Andrés Torres', role: isEn ? 'Clinical Support' : 'Atención al Paciente' },
    ];
  }
  if (cat.includes('spa') || cat.includes('estétic') || cat.includes('estetic') || cat.includes('belleza') || cat.includes('barber') || cat.includes('peluquer') || cat.includes('uñas')) {
    return [
      { name: 'Mateo Morales', role: isEn ? 'Master Stylist / Therapist' : 'Master Stylist / Terapeuta' },
      { name: 'David Ríos', role: isEn ? 'Senior Specialist' : 'Estilista Senior' },
      { name: 'Camilo Restrepo', role: isEn ? 'Facial & Wellness Care' : 'Cuidado & Bienestar' },
      { name: 'Valentina Cruz', role: isEn ? 'Front Desk & Bookings' : 'Recepción & Citas' },
      { name: 'Sofía Pardo', role: isEn ? 'Client Experience' : 'Asesora de Imagen' },
    ];
  }
  if (cat.includes('auto') || cat.includes('taller') || cat.includes('mecanic') || cat.includes('concesionar') || cat.includes('detailing')) {
    return [
      { name: 'Ing. Fernando Silva', role: isEn ? 'Workshop Technical Lead' : 'Jefe Técnico de Taller' },
      { name: 'Carlos Rincón', role: isEn ? 'Senior Technician' : 'Técnico Mecánico Senior' },
      { name: 'Diego Alarcón', role: isEn ? 'Diagnostics & Quality' : 'Diagnóstico & Calidad' },
      { name: 'Paola Ortiz', role: isEn ? 'Service Advisor' : 'Asesora de Servicio' },
      { name: 'Andrés Morales', role: isEn ? 'Vehicle Reception & Dispatch' : 'Recepción de Vehículos' },
    ];
  }
  if (cat.includes('retail') || cat.includes('tienda') || cat.includes('moda') || cat.includes('joyer') || cat.includes('comercio') || cat.includes('boutique')) {
    return [
      { name: 'Sofía Restrepo', role: isEn ? 'Store Lead' : 'Líder de Tienda' },
      { name: 'Valentina Cruz', role: isEn ? 'Experience & Styling Advisor' : 'Asesora de Experiencia' },
      { name: 'Juliana Pardo', role: isEn ? 'VIP Checkout & Loyalty' : 'Caja & Fidelización VIP' },
      { name: 'Camilo Torres', role: isEn ? 'Client Care' : 'Atención al Cliente' },
      { name: 'Daniel Rincón', role: isEn ? 'Brand Specialist' : 'Asesor de Marca' },
    ];
  }
  if (cat.includes('gym') || cat.includes('gimnasio') || cat.includes('fitness') || cat.includes('crossfit') || cat.includes('deport') || cat.includes('yoga')) {
    return [
      { name: 'Coach Daniel Ruiz', role: isEn ? 'Head Coach' : 'Head Coach / Entrenador Líder' },
      { name: 'Laura Mendoza', role: isEn ? 'Floor Coach' : 'Coach de Piso' },
      { name: 'Camilo Vega', role: isEn ? 'Wellness & Nutrition' : 'Nutrición & Bienestar' },
      { name: 'Valentina Gómez', role: isEn ? 'Front Desk & Memberships' : 'Recepción & Membresías' },
      { name: 'Mateo Ortiz', role: isEn ? 'Fitness Advisor' : 'Asesor Fitness' },
    ];
  }
  if (cat.includes('hotel') || cat.includes('hosped') || cat.includes('resort') || cat.includes('turism')) {
    return [
      { name: 'Esteban Morales', role: isEn ? 'Guest Experience Manager' : 'Gerente de Experiencia' },
      { name: 'Carolina Gómez', role: isEn ? 'Front Desk & Concierge' : 'Recepción & Concierge' },
      { name: 'Mateo Ríos', role: isEn ? 'Hospitality Lead' : 'Líder de Hospitalidad' },
      { name: 'Valentina Restrepo', role: isEn ? 'Guest Relations' : 'Relaciones con Huéspedes' },
      { name: 'Andrés Castro', role: isEn ? 'Operations Support' : 'Operaciones de Sede' },
    ];
  }
  if (cat.includes('veterinar') || cat.includes('pet') || cat.includes('mascota') || cat.includes('canin')) {
    return [
      { name: 'Dra. Andrea Morales', role: isEn ? 'Chief Veterinarian' : 'Médica Veterinaria Líder' },
      { name: 'Dr. Julián Castro', role: isEn ? 'Clinical Veterinarian' : 'Veterinario de Consulta' },
      { name: 'Marcela Silva', role: isEn ? 'Pet Grooming Lead' : 'Grooming & Spa Canino' },
      { name: 'Paula Gómez', role: isEn ? 'Front Desk & Records' : 'Recepción & Citas' },
      { name: 'Camilo Duarte', role: isEn ? 'Veterinary Assistant' : 'Asistente Veterinario' },
    ];
  }
  if (cat.includes('abogad') || cat.includes('jurid') || cat.includes('legal') || cat.includes('inmobiliaria') || cat.includes('consultor') || cat.includes('contab')) {
    return [
      { name: 'Dr. Felipe Morales', role: isEn ? 'Principal Consultant' : 'Consultor Principal' },
      { name: 'Dra. Valeria Gómez', role: isEn ? 'Senior Specialist' : 'Asesora Especialista' },
      { name: 'Carlos Restrepo', role: isEn ? 'Account Manager' : 'Gestor de Cuentas' },
      { name: 'Mariana Duarte', role: isEn ? 'Client Coordination' : 'Recepción & Agenda' },
      { name: 'Sebastián Ortiz', role: isEn ? 'Client Experience' : 'Atención al Cliente' },
    ];
  }
  if (cat.includes('restaurant') || cat.includes('gastro') || cat.includes('café') || cat.includes('cafe') || cat.includes('bar') || cat.includes('pizza') || cat.includes('hamburgue')) {
    return [
      { name: 'Camilo Restrepo', role: isEn ? 'Service Lead' : 'Líder de Servicio' },
      { name: 'Valentina Ríos', role: isEn ? 'Hospitality Host' : 'Capitana de Atención' },
      { name: 'Sebastián Torres', role: isEn ? 'Specialist' : 'Especialista de Calidad' },
      { name: 'Mateo Gómez', role: isEn ? 'Front Service' : 'Atención al Cliente' },
      { name: 'Andrés Felipe', role: isEn ? 'Guest Care' : 'Servicio & Experiencia' },
    ];
  }
  // Universal: fits ANY business
  return [
    { name: 'Camilo Restrepo', role: isEn ? 'Operations Lead' : 'Líder de Operación' },
    { name: 'Valentina Ríos', role: isEn ? 'Service Specialist' : 'Especialista de Servicio' },
    { name: 'Sebastián Torres', role: isEn ? 'Care Coordinator' : 'Coordinador(a) Operativo' },
    { name: 'Mateo Gómez', role: isEn ? 'Front Desk & Reception' : 'Recepción & Orientación' },
    { name: 'Andrés Felipe', role: isEn ? 'Client Advisor' : 'Asesor(a) al Cliente' },
  ];
}

// Format date helper
function isSameDay(d1: Date, d2: Date) {
  if (!d1 || !d2 || isNaN(d1.getTime()) || isNaN(d2.getTime())) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function formatRelativeOrDate(dateStr: string, isEn: boolean = false) {
  if (!dateStr) return isEn ? 'Recent' : 'Reciente';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diffSec < 60) return isEn ? 'Just now' : 'Hace un momento';
  if (diffSec < 3600) return isEn ? `${Math.floor(diffSec / 60)}m ago` : `Hace ${Math.floor(diffSec / 60)} min`;
  if (diffSec < 86400) return isEn ? `${Math.floor(diffSec / 3600)}h ago` : `Hace ${Math.floor(diffSec / 3600)} h`;
  return d.toLocaleDateString(isEn ? 'en-US' : 'es-CO', { day: '2-digit', month: 'short' });
}

function WallboardContent() {
  const searchParams = useSearchParams();
  const rawParam = searchParams.get('businessId');
  const branchParam = searchParams.get('branchId');
  const [activeBusinessId, setActiveBusinessId] = useState<string>(rawParam || 'la-burguesia');
  const [activeBranchParam, setActiveBranchParam] = useState<string | null>(branchParam || 'all');
  const [availableBranches, setAvailableBranches] = useState<any[]>([]);
  const [wallboardLang, setWallboardLang] = useState<'es' | 'en'>(
    searchParams.get('lang') === 'en' ? 'en' : 'es'
  );
  const isEn = wallboardLang === 'en';

  useEffect(() => {
    if (rawParam) {
      setActiveBusinessId(rawParam);
    } else if (typeof window !== 'undefined') {
      try {
        const savedSession = localStorage.getItem('prestigia_session');
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          if (parsed?.business?.id) {
            setActiveBusinessId(parsed.business.id);
          }
        }
      } catch (e) {
        // ignore
      }
    }
    if (branchParam !== null) {
      setActiveBranchParam(branchParam);
    }
  }, [rawParam, branchParam]);

  // Core visual state
  const [wallboardTheme, setWallboardTheme] = useState<'dark' | 'light'>('dark');
  const [wallboardAudioEnabled, setWallboardAudioEnabled] = useState<boolean>(true);
  const [wallboardIsFullscreen, setWallboardIsFullscreen] = useState<boolean>(false);
  const [wallboardPeriod, setWallboardPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [wallboardAutoCycle, setWallboardAutoCycle] = useState<boolean>(true);
  const [wallboardCycleSecondsLeft, setWallboardCycleSecondsLeft] = useState<number>(12);
  const [wallboardTime, setWallboardTime] = useState<string>('');
  const [wallboardDate, setWallboardDate] = useState<string>('');
  const [newItemNotification, setNewItemNotification] = useState<string | null>(null);

  // Business and branding state
  const [businessName, setBusinessName] = useState<string>('Prestigia Sede Central');
  const [businessCategory, setBusinessCategory] = useState<string>('Punto de Atención');
  const [brandIdentity, setBrandIdentity] = useState<BrandIdentity>({
    logoUrl: '',
    primaryColor: '#F59E0B',
    accentColor: '#6366F1',
  });

  // Campaign state
  const [campaignData, setCampaignData] = useState<SatisfactionCampaign>({
    id: 'camp-default',
    businessId: 'clinica-dental-sonrisas',
    title: 'Campaña de Satisfacción del Mes',
    reward: 'Bono de Experiencia VIP / Compra $150.000 COP',
    winnersCount: 1,
    active: true,
    drawDate: '30 de Septiembre de 2026',
    terms: 'Válido para clientes registrados este mes.',
  });
  const [participantsCount, setParticipantsCount] = useState<number>(0);

  // Live reviews and feedbacks data
  const [googleReviews, setGoogleReviews] = useState<GoogleReview[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const lastTotalCountRef = useRef<number>(0);
  const hasInitialLoadedRef = useRef<boolean>(false);
  const [viewMode, setViewMode] = useState<'feed' | 'ranking'>('feed');
  const [branchStaffList, setBranchStaffList] = useState<any[]>([]);

  // Branch state
  const [resolvedBranchId, setResolvedBranchId] = useState<string | null>(null);
  const [resolvedBranchName, setResolvedBranchName] = useState<string | null>(null);

  // Audio Context Ref
  const audioContextRef = useRef<AudioContext | null>(null);

  // Web Audio API 3-Tone Luxury Chime (E5 -> A5 -> C#6)
  const playChimeSound = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const nowTime = ctx.currentTime;

      // Tone 1: E5 (659.25 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, nowTime);
      gain1.gain.setValueAtTime(0.35, nowTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, nowTime + 0.3);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(nowTime);
      osc1.stop(nowTime + 0.3);

      // Tone 2: A5 (880 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, nowTime + 0.12);
      gain2.gain.setValueAtTime(0.4, nowTime + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, nowTime + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(nowTime + 0.12);
      osc2.stop(nowTime + 0.45);

      // Tone 3: C#6 (1108.73 Hz)
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(1108.73, nowTime + 0.24);
      gain3.gain.setValueAtTime(0.45, nowTime + 0.24);
      gain3.gain.exponentialRampToValueAtTime(0.001, nowTime + 0.7);
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.start(nowTime + 0.24);
      osc3.stop(nowTime + 0.7);
    } catch {
      // Ignore audio synthesis errors on blocked browsers
    }
  };

  // Fullscreen Handler (Cross-browser Native Fullscreen to hide address and window bars)
  const toggleWallboardFullscreen = () => {
    const docEl = document.documentElement as unknown as {
      requestFullscreen?: () => Promise<void>;
      webkitRequestFullscreen?: () => Promise<void>;
      msRequestFullscreen?: () => Promise<void>;
      mozRequestFullScreen?: () => Promise<void>;
    };
    const doc = document as unknown as {
      fullscreenElement?: Element;
      webkitFullscreenElement?: Element;
      msFullscreenElement?: Element;
      mozFullScreenElement?: Element;
      exitFullscreen?: () => Promise<void>;
      webkitExitFullscreen?: () => Promise<void>;
      msExitFullscreen?: () => Promise<void>;
      mozCancelFullScreen?: () => Promise<void>;
    };

    const isFs = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement || doc.mozFullScreenElement);
    if (!isFs) {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen();
      }
      setWallboardIsFullscreen(true);
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch(() => {});
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      }
      setWallboardIsFullscreen(false);
    }
  };

  // Sync fullscreen state with native browser events (e.g. F11 or Esc)
  useEffect(() => {
    const handleFsChange = () => {
      const doc = document as unknown as {
        fullscreenElement?: Element;
        webkitFullscreenElement?: Element;
        msFullscreenElement?: Element;
        mozFullScreenElement?: Element;
      };
      setWallboardIsFullscreen(!!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement || doc.mozFullScreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    document.addEventListener('mozfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      document.removeEventListener('mozfullscreenchange', handleFsChange);
    };
  }, []);

  // Sync with localStorage on client mount if available
  useEffect(() => {
    try {
      // 1. Check active portal session for branch and business
      const portalSession = localStorage.getItem('prestigia_portal_session');
      if (portalSession) {
        const parsed = JSON.parse(portalSession);
        if (parsed?.businessName) setBusinessName(parsed.businessName);
        if (parsed?.branchName) setResolvedBranchName(parsed.branchName);
        if (parsed?.branchId) setResolvedBranchId(parsed.branchId);
      }

      // 2. Check general session
      const savedSession = localStorage.getItem('prestigia_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed?.business?.name) setBusinessName(parsed.business.name);
        if (parsed?.business?.category) setBusinessCategory(parsed.business.category);
        if (parsed?.business?.branding) {
          setBrandIdentity({
            logoUrl: parsed.business.branding.logoUrl || '',
            primaryColor: parsed.business.branding.primaryColor || '#F59E0B',
            accentColor: parsed.business.branding.accentColor || '#6366F1',
          });
        }
      }

      // 3. Fallback inference from query param or active business
      if (activeBusinessId.includes('chapinero')) {
        setResolvedBranchName((curr) => curr || 'Sede Chapinero');
        setResolvedBranchId((curr) => curr || 'la-burguesia-chapinero');
      } else if (activeBusinessId.includes('usaquen')) {
        setResolvedBranchName((curr) => curr || 'Sede Usaquén');
        setResolvedBranchId((curr) => curr || 'la-burguesia-usaquen');
      }

      const activeBiz = activeBusinessId || 'la-burguesia';
      const savedCampaign = localStorage.getItem(`prestigia_campaign_${activeBiz}`);
      if (savedCampaign) {
        const parsedCamp = JSON.parse(savedCampaign);
        if (parsedCamp) setCampaignData(parsedCamp);
      }

      const savedParticipants = localStorage.getItem(`prestigia_giveaway_participants_${activeBiz}`);
      if (savedParticipants) {
        const parsedPart = JSON.parse(savedParticipants);
        if (Array.isArray(parsedPart)) setParticipantsCount(parsedPart.length);
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
  }, [activeBusinessId]);

  // Digital Clock Updater
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setWallboardTime(
        now.toLocaleTimeString(isEn ? 'en-US' : 'es-CO', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setWallboardDate(
        now.toLocaleDateString(isEn ? 'en-US' : 'es-CO', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [wallboardLang, isEn]);

  // Strict Period Auto-Cycle Timer: Hoy (12s) -> Esta Semana (12s) -> Este Mes (12s) -> Hoy
  useEffect(() => {
    if (!wallboardAutoCycle) return;

    let seconds = 12;
    setWallboardCycleSecondsLeft(12);

    const cycleTimer = setInterval(() => {
      seconds -= 1;
      if (seconds <= 0) {
        seconds = 12;
        setWallboardCycleSecondsLeft(12);
        setWallboardPeriod((curr) => {
          if (curr === 'today') return 'week';
          if (curr === 'week') return 'month';
          return 'today';
        });
      } else {
        setWallboardCycleSecondsLeft(seconds);
      }
    }, 1000);

    return () => clearInterval(cycleTimer);
  }, [wallboardAutoCycle]);

  // Polling data every 8 seconds from APIs
  useEffect(() => {
    const activeBiz = activeBusinessId || 'la-burguesia';

    const fetchData = async () => {
      try {
        // 1. Fetch business metadata to resolve branch details & branding
        const resBiz = await fetch(`/api/businesses/${encodeURIComponent(activeBiz)}`);
        if (resBiz.ok) {
          const bzData = await resBiz.json();
          if (bzData.businessName) setBusinessName(bzData.businessName);
          if (bzData.category) setBusinessCategory(bzData.category);
          if (Array.isArray(bzData.branches) && bzData.branches.length > 0) {
            setAvailableBranches(bzData.branches);
          }
          if (bzData.branding) {
            setBrandIdentity({
              logoUrl: bzData.branding.logoUrl || '/images/la-burguesia-logo.jpg',
              primaryColor: bzData.branding.primaryColor || '#D97706',
              accentColor: bzData.branding.accentColor || '#B45309',
            });
          }
          if (bzData.campaign) {
            setCampaignData(bzData.campaign);
          }

          const allTeam: Array<{ name: string; role: string; branchName?: string }> = [];
          const seen = new Set<string>();

          const hasBranches = Array.isArray(bzData.branches) && bzData.branches.length > 0;
          const isGlobalWallboard = activeBranchParam === 'all' || !activeBranchParam;

          if (isGlobalWallboard) {
            setResolvedBranchName(isEn ? 'All Branches (Consolidated)' : 'Todas las Sedes (Consolidado General)');
            setResolvedBranchId('all');

            if (hasBranches) {
              bzData.branches.forEach((br: any) => {
                const bName = br.name || 'Sede';
                if (Array.isArray(br.staffMembers)) {
                  br.staffMembers.forEach((s: any) => {
                    const sName = typeof s === 'object' && s !== null ? (s.name || '').trim() : String(s || '').trim();
                    if (sName && !seen.has(sName.toLowerCase())) {
                      const sRole = typeof s === 'object' && s !== null && s.role ? s.role : 'Colaborador';
                      allTeam.push({ name: sName, role: sRole, branchName: bName });
                      seen.add(sName.toLowerCase());
                    }
                  });
                }
                if (br.managerName && !seen.has(br.managerName.trim().toLowerCase())) {
                  allTeam.push({
                    name: br.managerName.trim(),
                    role: br.managerRole || (isEn ? 'Branch Administrator' : 'Administrador de Sede'),
                    branchName: bName,
                  });
                  seen.add(br.managerName.trim().toLowerCase());
                }
              });
            }
          } else {
            // Specific branch selected
            const matchedBranch = hasBranches
              ? bzData.branches.find((b: any) => b.id === activeBranchParam)
              : null;
            const bName = matchedBranch?.name || bzData.branchName || 'Sede';
            setResolvedBranchName(bName);
            setResolvedBranchId(activeBranchParam);

            if (matchedBranch && Array.isArray(matchedBranch.staffMembers)) {
              matchedBranch.staffMembers.forEach((s: any) => {
                const sName = typeof s === 'object' && s !== null ? (s.name || '').trim() : String(s || '').trim();
                if (sName && !seen.has(sName.toLowerCase())) {
                  const sRole = typeof s === 'object' && s !== null && s.role ? s.role : (isEn ? 'Staff Specialist' : 'Colaborador de Sede');
                  allTeam.push({ name: sName, role: sRole, branchName: bName });
                  seen.add(sName.toLowerCase());
                }
              });
            }
            if (matchedBranch?.managerName && !seen.has(matchedBranch.managerName.trim().toLowerCase())) {
              allTeam.push({
                name: matchedBranch.managerName.trim(),
                role: matchedBranch.managerRole || (isEn ? 'Branch Administrator' : 'Administrador de Sede'),
                branchName: bName,
              });
              seen.add(matchedBranch.managerName.trim().toLowerCase());
            }
          }

          if (allTeam.length > 0) {
            setBranchStaffList(allTeam);
          } else if (bzData.staffMembers) {
            setBranchStaffList(bzData.staffMembers);
          }
        }

        // 2. Fetch feedbacks, google reviews, and campaign data unwrapping the payload
        const targetBranch = activeBranchParam === 'all'
          ? undefined
          : (activeBranchParam || resolvedBranchId || (activeBusinessId.includes('centro') ? 'san-rafael-centro' : activeBusinessId.includes('norte') ? 'san-rafael-norte' : undefined));

        const campUrl = targetBranch
          ? `/api/portal/campaign?businessId=${encodeURIComponent(activeBiz)}&branchId=${encodeURIComponent(targetBranch)}`
          : `/api/portal/campaign?businessId=${encodeURIComponent(activeBiz)}`;

        const fbUrl = targetBranch
          ? `/api/feedbacks?businessId=${encodeURIComponent(activeBiz)}&branchId=${encodeURIComponent(targetBranch)}`
          : `/api/feedbacks?businessId=${encodeURIComponent(activeBiz)}`;

        const grUrl = targetBranch
          ? `/api/portal/google-reviews?businessId=${encodeURIComponent(activeBiz)}&branchId=${encodeURIComponent(targetBranch)}`
          : `/api/portal/google-reviews?businessId=${encodeURIComponent(activeBiz)}`;

        const [resFb, resGr, resCamp] = await Promise.all([
          fetch(fbUrl),
          fetch(grUrl),
          fetch(campUrl),
        ]);

        const [dataCamp, dataFb, dataGr] = await Promise.all([
          resCamp.ok ? resCamp.json() : null,
          resFb.ok ? resFb.json() : null,
          resGr.ok ? resGr.json() : null,
        ]);

        if (dataCamp?.campaign) {
          setCampaignData(dataCamp.campaign);
        }
        if (Array.isArray(dataCamp?.participants)) {
          setParticipantsCount(dataCamp.participants.length);
        }

        const itemsFb: Feedback[] = Array.isArray(dataFb)
          ? dataFb
          : Array.isArray(dataFb?.feedbacks)
          ? dataFb.feedbacks
          : [];

        const itemsGr: GoogleReview[] = Array.isArray(dataGr)
          ? dataGr
          : Array.isArray(dataGr?.reviews)
          ? dataGr.reviews
          : [];

        setFeedbacks(itemsFb);
        setGoogleReviews(itemsGr);

        const currentTotal = itemsFb.length + itemsGr.length;

        // Establish initial baseline on first load without false alarm
        if (!hasInitialLoadedRef.current) {
          hasInitialLoadedRef.current = true;
          lastTotalCountRef.current = currentTotal;
        } else {
          // On subsequent polls, if new opinions or feedbacks arrived, alert in real time
          if (lastTotalCountRef.current > 0 && currentTotal > lastTotalCountRef.current) {
            if (wallboardAudioEnabled) {
              playChimeSound();
            }
            setNewItemNotification(isEn ? 'New live experience recorded!' : '¡Nueva opinión registrada en vivo!');
            setTimeout(() => setNewItemNotification(null), 5000);
          }
          lastTotalCountRef.current = currentTotal;
        }
      } catch (err) {
        console.error('Error fetching live wallboard data', err);
      }
    };

    fetchData();
    const poller = setInterval(fetchData, 8000);
    return () => clearInterval(poller);
  }, [activeBusinessId, activeBranchParam, resolvedBranchId, wallboardAudioEnabled, isEn]);

  // Calculations per timeframe and branch
  const now = useMemo(() => new Date(), []);
  const ind = useMemo(() => getIndustryLabels(businessCategory, wallboardLang), [businessCategory, wallboardLang]);

  const currentBranchId = useMemo(() => {
    if (activeBranchParam === 'all') return null;
    if (activeBranchParam && activeBranchParam !== 'all') return activeBranchParam;
    if (activeBusinessId.includes('chapinero')) return 'la-burguesia-chapinero';
    if (activeBusinessId.includes('usaquen')) return 'la-burguesia-usaquen';
    if (activeBusinessId.includes('norte')) return 'san-rafael-norte';
    if (activeBusinessId.includes('centro')) return 'san-rafael-centro';
    return null;
  }, [resolvedBranchId, activeBusinessId, activeBranchParam]);

  const branchGoogle = useMemo(() => {
    if (!currentBranchId) return googleReviews;
    return googleReviews.filter((r) => r.branchId === currentBranchId);
  }, [googleReviews, currentBranchId]);

  const branchFeedbacks = useMemo(() => {
    if (!currentBranchId) return feedbacks;
    return feedbacks.filter((f) => f.branchId === currentBranchId);
  }, [feedbacks, currentBranchId]);

  const periodGoogle = useMemo(() => {
    return branchGoogle.filter((r) => {
      if (wallboardPeriod === 'today') return isSameDay(new Date(r.createdAt || r.repliedAt || ''), now);
      const d = new Date(r.createdAt || r.repliedAt || '').getTime();
      if (isNaN(d)) return true;
      if (wallboardPeriod === 'week') return now.getTime() - d <= 7 * 24 * 3600 * 1000;
      if (wallboardPeriod === 'month') return now.getTime() - d <= 30 * 24 * 3600 * 1000;
      return true;
    });
  }, [branchGoogle, wallboardPeriod, now]);

  const periodFeedbacks = useMemo(() => {
    return branchFeedbacks.filter((f) => {
      if (wallboardPeriod === 'today') return isSameDay(new Date(f.createdAt || ''), now);
      const d = new Date(f.createdAt || '').getTime();
      if (isNaN(d)) return true;
      if (wallboardPeriod === 'week') return now.getTime() - d <= 7 * 24 * 3600 * 1000;
      if (wallboardPeriod === 'month') return now.getTime() - d <= 30 * 24 * 3600 * 1000;
      return true;
    });
  }, [branchFeedbacks, wallboardPeriod, now]);

  const wbTotalCount = periodGoogle.length + periodFeedbacks.length;
  const wbPositives =
    periodGoogle.filter((r) => r.rating >= 4).length +
    periodFeedbacks.filter((f) => f.rating >= 4).length;
  const wbAnswered =
    periodGoogle.filter((r) => r.status === 'answered').length +
    periodFeedbacks.filter((f) => f.status === 'resolved').length;
  const wbResolutionRate = wbTotalCount > 0 ? Math.round((wbAnswered / wbTotalCount) * 100) : 100;
  const wbNeutralized = periodFeedbacks.length;

  // Period Rating Average
  const allRatingsInPeriod = [...periodGoogle.map((r) => r.rating), ...periodFeedbacks.map((f) => f.rating)];
  const wbPeriodAvgRating =
    allRatingsInPeriod.length > 0
      ? (allRatingsInPeriod.reduce((a, b) => a + b, 0) / allRatingsInPeriod.length).toFixed(1)
      : '4.9';

  // Overall Score
  const wbScore = wbTotalCount > 0 ? Math.round((wbPositives / wbTotalCount) * 100) : 98;

  // Titles
  const periodTitle =
    wallboardPeriod === 'today'
      ? (isEn ? 'Today (Live Shift)' : 'Hoy (Turno en Vivo)')
      : wallboardPeriod === 'week'
      ? (isEn ? 'This Week (Last 7 Days)' : 'Esta Semana (Últimos 7 Días)')
      : (isEn ? 'This Month (Month-to-Date)' : 'Este Mes (Acumulado Mensual)');

  const periodSubtitle =
    wallboardPeriod === 'today'
      ? (isEn ? 'Real-time monitoring of today’s service' : 'Monitoreo en tiempo real del servicio de hoy')
      : wallboardPeriod === 'week'
      ? (isEn ? 'Cumulative operational week performance' : 'Rendimiento acumulado de la semana operativa')
      : (isEn ? 'Monthly target of excellence & satisfaction' : 'Meta mensual de excelencia y satisfacción');

  // SVG Radial Gauge
  const radius = 74;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * Math.min(100, Math.max(0, wbScore))) / 100;

  // Combined Activity Stream with branch and global fallbacks
  const wbActivity = useMemo(() => {
    const sourceGoogle = periodGoogle.length > 0 ? periodGoogle : branchGoogle;
    const sourceFeedbacks = periodFeedbacks.length > 0 ? periodFeedbacks : branchFeedbacks;

    return [
      ...sourceGoogle.map((r) => ({
        id: r.id,
        isGoogle: true,
        author: r.authorName,
        rating: r.rating,
        comment: r.text,
        date: r.createdAt || r.relativeTime,
        timestamp: r.createdAt ? new Date(r.createdAt).getTime() : 0,
        branchName: r.branchName || resolvedBranchName || businessName,
      })),
      ...sourceFeedbacks.map((f) => ({
        id: f.id,
        isGoogle: false,
        author: f.customerName,
        rating: f.rating,
        comment: f.complaintReason,
        date: f.createdAt,
        timestamp: f.createdAt ? new Date(f.createdAt).getTime() : 0,
        branchName: f.branchName || resolvedBranchName || businessName,
      })),
    ]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 6);
  }, [
    periodGoogle,
    periodFeedbacks,
    branchGoogle,
    branchFeedbacks,
    googleReviews,
    feedbacks,
    businessName,
    resolvedBranchName,
  ]);

  return (
    <div
      className={`min-h-screen w-full flex flex-col justify-between p-4 sm:p-7 select-none transition-colors duration-300 font-sans ${
        wallboardTheme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-[#060913] text-white'
      }`}
    >
      {/* Top Bar: Brand Identity, Live Mode Controls & Clock */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border flex items-center justify-between gap-4 shadow-xl backdrop-blur-xl shrink-0 ${
          wallboardTheme === 'light' ? 'bg-white/95 border-slate-200' : 'bg-[#0B1222]/90 border-slate-800'
        }`}
      >
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3.5 shrink-0">
          {brandIdentity.logoUrl ? (
            <img
              src={brandIdentity.logoUrl}
              alt="Logo"
              className="w-10 h-10 rounded-2xl object-cover border border-slate-300 dark:border-slate-700 shadow-md"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-md"
              style={{ backgroundColor: brandIdentity.primaryColor || '#6366F1' }}
            >
              <Store className="w-5 h-5" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-wide">{businessName}</h2>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                  wallboardTheme === 'light'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                }`}
              >
                {businessCategory || ind.venueTerm}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs opacity-90 flex-wrap">
              {availableBranches && availableBranches.length > 1 ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-amber-500/40 shadow-sm">
                  <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <select
                    value={activeBranchParam || 'all'}
                    onChange={(e) => {
                      const val = e.target.value;
                      setActiveBranchParam(val);
                      if (typeof window !== 'undefined') {
                        const url = new URL(window.location.href);
                        url.searchParams.set('branchId', val);
                        window.history.replaceState({}, '', url.toString());
                      }
                    }}
                    className="bg-transparent text-xs font-bold text-amber-300 focus:outline-none cursor-pointer"
                  >
                    <option value="all" className="bg-slate-900 text-white font-bold">
                      🏢 {isEn ? 'All Locations (Consolidated)' : 'Todas las Sedes (Consolidado)'}
                    </option>
                    {availableBranches.map((br: any) => (
                      <option key={br.id} value={br.id} className="bg-slate-900 text-white">
                        📍 {br.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <span className="flex items-center gap-1 font-semibold">
                  <MapPin className="w-3 h-3 text-amber-500" />
                  <span>
                    {activeBranchParam === 'all'
                      ? (isEn ? 'All Active Locations' : 'Todas las Sedes')
                      : resolvedBranchName || (isEn ? 'Main Branch' : 'Sede Principal')}
                  </span>
                </span>
              )}
              <span>•</span>
              <span>{ind.shiftName}</span>
            </div>
          </div>
        </div>

        {/* Center: Timeframe Selector (Hoy / Esta Semana / Este Mes) & Auto-Cycle Toggle */}
        <div className="flex items-center gap-2.5 flex-nowrap justify-center shrink-0">
          <div
            className={`flex items-center gap-1 p-1 rounded-2xl border ${
              wallboardTheme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <button
              type="button"
              onClick={() => {
                setWallboardPeriod('today');
                setWallboardCycleSecondsLeft(12);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                wallboardPeriod === 'today'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{isEn ? 'Today (Live)' : 'Hoy (En Vivo)'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setWallboardPeriod('week');
                setWallboardCycleSecondsLeft(12);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95 ${
                wallboardPeriod === 'week'
                  ? 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{isEn ? 'This Week' : 'Esta Semana'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setWallboardPeriod('month');
                setWallboardCycleSecondsLeft(12);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95 ${
                wallboardPeriod === 'month'
                  ? 'bg-purple-600 text-white font-black shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{isEn ? 'This Month' : 'Este Mes'}</span>
            </button>
          </div>

          {/* Auto-Cycle Slideshow Toggle */}
          <button
            type="button"
            onClick={() => setWallboardAutoCycle(!wallboardAutoCycle)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              wallboardAutoCycle
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title={wallboardAutoCycle ? (isEn ? 'Pause automatic rotation' : 'Pausar rotación automática') : (isEn ? 'Enable 12s auto-cycle' : 'Activar rotación automática cada 12 segundos')}
          >
            {wallboardAutoCycle ? (
              <>
                <RotateCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span>{isEn ? `Auto (${wallboardCycleSecondsLeft}s)` : `Rotando (${wallboardCycleSecondsLeft}s)`}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-slate-400" />
                <span>{isEn ? 'Auto-Cycle' : 'Rotar Auto'}</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Digital Clock & Quick Controls */}
        <div className="flex items-center gap-2.5 ml-auto sm:ml-0 shrink-0">
          <div
            className={`px-3 py-1.5 rounded-2xl font-mono text-sm sm:text-base font-black border shadow-inner ${
              wallboardTheme === 'light'
                ? 'bg-slate-50 border-slate-200 text-slate-900'
                : 'bg-slate-950/80 border-slate-800 text-amber-400'
            }`}
          >
            {wallboardTime}
          </div>

          {/* Language Toggle Button */}
          <button
            type="button"
            onClick={() => {
              const nextLang = wallboardLang === 'es' ? 'en' : 'es';
              setWallboardLang(nextLang);
              if (typeof window !== 'undefined') {
                const url = new URL(window.location.href);
                url.searchParams.set('lang', nextLang);
                window.history.replaceState({}, '', url.toString());
                try {
                  localStorage.setItem('prestigia_portal_lang', nextLang);
                } catch (e) {}
              }
            }}
            className={`px-3 py-1.5 rounded-2xl border text-xs font-black transition cursor-pointer active:scale-95 flex items-center gap-1 ${
              wallboardTheme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-400 shadow-sm'
            }`}
            title={isEn ? 'Cambiar idioma a Español' : 'Switch display language to English'}
          >
            <span>{isEn ? '🇺🇸 EN' : '🇨🇴 ES'}</span>
          </button>

          {/* Sound chime test */}
          <button
            type="button"
            onClick={() => {
              const next = !wallboardAudioEnabled;
              setWallboardAudioEnabled(next);
              if (next) playChimeSound();
            }}
            className={`p-2.5 rounded-2xl border transition cursor-pointer active:scale-95 ${
              wallboardAudioEnabled
                ? 'bg-amber-500/15 text-amber-500 border-amber-500/40'
                : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
            }`}
            title={wallboardAudioEnabled ? (isEn ? 'Audio Chime Active' : 'Audio Chime Activo') : (isEn ? 'Audio Chime Muted' : 'Audio Chime Silenciado')}
          >
            {wallboardAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme toggle inside Wallboard */}
          <button
            type="button"
            onClick={() => setWallboardTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            className={`p-2.5 rounded-2xl border transition cursor-pointer active:scale-95 ${
              wallboardTheme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-amber-600'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-400'
            }`}
            title={isEn ? 'Toggle contrast (Dark / Light mode)' : 'Cambiar Contraste (Modo Oscuro / Claro)'}
          >
            {wallboardTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleWallboardFullscreen}
            className={`p-2.5 rounded-2xl border transition cursor-pointer active:scale-95 ${
              wallboardIsFullscreen
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                : wallboardTheme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
            title={
              wallboardIsFullscreen
                ? (isEn ? 'Exit Fullscreen' : 'Salir de Pantalla Completa')
                : (isEn ? 'Fullscreen (F11)' : 'Pantalla Completa (F11)')
            }
          >
            {wallboardIsFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Exit / Close TV Window Button */}
          <button
            type="button"
            onClick={() => {
              if (document.fullscreenElement && document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
              }
              if (typeof window !== 'undefined') {
                window.close();
                setTimeout(() => {
                  window.location.href = '/portal';
                }, 200);
              }
            }}
            className="px-3.5 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
            title={isEn ? 'Exit / Close TV Window (Esc)' : 'Salir / Cerrar Ventana TV (Esc)'}
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">{isEn ? 'Exit (Esc)' : 'Salir (Esc)'}</span>
          </button>
        </div>
      </div>

      {/* Floating Live Notification Alert */}
      {newItemNotification && (
        <div className="my-2 p-3 bg-gradient-to-r from-emerald-500 to-indigo-600 text-white font-black text-center text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span>{newItemNotification}</span>
        </div>
      )}

      {/* Central Arena: Big Radial Meter + 4 Main Operational Metric Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-5 items-stretch flex-1">
        {/* Radial Gauge Column (5 Cols) */}
        <div
          className={`lg:col-span-5 p-6 sm:p-8 rounded-3xl border flex flex-col justify-between items-center text-center shadow-2xl relative overflow-hidden ${
            wallboardTheme === 'light'
              ? 'bg-white border-slate-200 shadow-slate-200/70'
              : 'bg-[#0B1222]/90 border-slate-800 shadow-black/40'
          }`}
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${brandIdentity.primaryColor || '#F59E0B'}, transparent 70%)`,
            }}
          />

          <div className="w-full flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800/80">
            <span className="text-xs font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>
                {ind.satisfactionLabel} • {periodTitle}
              </span>
            </span>
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              {wallboardPeriod === 'today' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{isEn ? 'Live Shift' : 'Turno en Vivo'}</span>
                </>
              ) : wallboardPeriod === 'week' ? (
                <span>{isEn ? 'Weekly (7d)' : 'Semanal (7d)'}</span>
              ) : (
                <span>{isEn ? 'Monthly (30d)' : 'Mensual (30d)'}</span>
              )}
            </span>
          </div>

          {/* SVG Radial Gauge */}
          <div className="relative my-4 flex items-center justify-center">
            <svg className="w-52 h-52 sm:w-60 sm:h-60 transform -rotate-90">
              {/* Background Track */}
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke={wallboardTheme === 'light' ? '#E2E8F0' : '#1E293B'}
                strokeWidth="14"
                fill="transparent"
              />
              {/* Active Progress */}
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke={wbScore >= 85 ? '#10B981' : wbScore >= 60 ? '#F59E0B' : '#EF4444'}
                strokeWidth="14"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Inside Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={`text-5xl sm:text-6xl font-black tracking-tight ${
                  wbScore >= 85 ? 'text-emerald-500' : wbScore >= 60 ? 'text-amber-500' : 'text-rose-500'
                }`}
              >
                {wbScore}%
              </span>
              <span className="text-xs font-bold opacity-75 mt-0.5">{isEn ? 'Net Approval' : 'Aprobación Neta'}</span>
              <div className="mt-1 flex items-center gap-1 text-amber-500 font-bold text-sm">
                <span>★</span>
                <span>{wbPeriodAvgRating}</span>
                <span className="opacity-60 text-xs">/ 5.0</span>
              </div>
            </div>
          </div>

          {/* Excellence Status & Reputation Breakdown */}
          <div className="w-full space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-xs font-bold">
              <span
                className={`flex items-center gap-1 ${
                  wbScore >= 85
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : wbScore >= 60
                    ? 'text-amber-500'
                    : 'text-rose-500'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {isEn
                    ? wbScore >= 85
                      ? 'Operational Excellence Level'
                      : wbScore >= 60
                      ? 'Active Operation'
                      : 'Service Attention Required'
                    : wbScore >= 85
                    ? 'Nivel de Excelencia Operativa'
                    : wbScore >= 60
                    ? 'Operación Activa'
                    : 'Atención en Servicio Requerida'}
                </span>
              </span>
              <span className="opacity-70 text-[11px]">
                {wbTotalCount} {ind.experienceUnit.toLowerCase()}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
              <div
                className={`p-2 rounded-xl border ${
                  wallboardTheme === 'light'
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="font-black text-amber-500">5★</div>
                <div className="text-[10px] opacity-75 font-semibold">
                  {periodGoogle.filter((r) => r.rating === 5).length +
                    periodFeedbacks.filter((f) => f.rating === 5).length}{' '}
                  {isEn ? 'Reviews' : 'Reseñas'}
                </div>
              </div>
              <div
                className={`p-2 rounded-xl border ${
                  wallboardTheme === 'light'
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="font-black text-indigo-500">4★</div>
                <div className="text-[10px] opacity-75 font-semibold">
                  {periodGoogle.filter((r) => r.rating === 4).length +
                    periodFeedbacks.filter((f) => f.rating === 4).length}{' '}
                  {isEn ? 'Reviews' : 'Reseñas'}
                </div>
              </div>
              <div
                className={`p-2 rounded-xl border ${
                  wallboardTheme === 'light'
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-emerald-950/20 border-emerald-500/30'
                }`}
              >
                <div className="font-black text-emerald-600 dark:text-emerald-400">🛡️ {wbNeutralized}</div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold">
                  {isEn ? 'Shielded' : 'Protegidas'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Main Operational Metric Cards (7 Cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Experiencias Registradas */}
          <div
            className={`p-5 sm:p-6 rounded-3xl border flex flex-col justify-between shadow-xl transition-all ${
              wallboardTheme === 'light'
                ? 'bg-white border-slate-200 shadow-slate-200/60'
                : 'bg-[#0B1222]/90 border-slate-800 shadow-black/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-75 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span>
                  {wallboardPeriod === 'today'
                    ? ind.experienceToday
                    : wallboardPeriod === 'week'
                    ? (isEn ? 'Experiences This Week' : 'Experiencias Esta Semana')
                    : (isEn ? 'Experiences This Month' : 'Experiencias Este Mes')}
                </span>
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
            </div>
            <div className="my-3">
              <div className="text-4xl sm:text-5xl font-black">{wbTotalCount}</div>
              <p className="text-xs opacity-75 mt-1 font-medium">
                {isEn
                  ? `${periodGoogle.length} public on Google • ${periodFeedbacks.length} private via Smart QR`
                  : `${periodGoogle.length} públicas en Google • ${periodFeedbacks.length} privadas por Smart QR`}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[11px] font-bold text-indigo-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{periodSubtitle}</span>
            </div>
          </div>

          {/* Card 2: Atención & Resolución Inmediata */}
          <div
            className={`p-5 sm:p-6 rounded-3xl border flex flex-col justify-between shadow-xl transition-all ${
              wallboardTheme === 'light'
                ? 'bg-white border-slate-200 shadow-slate-200/60'
                : 'bg-[#0B1222]/90 border-slate-800 shadow-black/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-75 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{isEn ? 'Immediate Resolution' : 'Resolución Inmediata'}</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
                {isEn ? 'SLA Active' : 'SLA Activo'}
              </span>
            </div>
            <div className="my-3">
              <div className="text-4xl sm:text-5xl font-black text-emerald-500">{wbResolutionRate}%</div>
              <p className="text-xs opacity-75 mt-1 font-medium">
                {isEn
                  ? `${wbAnswered} of ${wbTotalCount || 0} attended or answered`
                  : `${wbAnswered} de ${wbTotalCount || 0} atendidas o respondidas`}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>
                {isEn
                  ? wbTotalCount === 0
                    ? 'Shift up to date'
                    : 'Active rescue protocol'
                  : wbTotalCount === 0
                  ? 'Turno al día'
                  : 'Protocolo de rescate activo'}
              </span>
            </div>
          </div>

          {/* Card 3: Comunidad VIP & Participantes del Sorteo */}
          <div
            className={`p-5 sm:p-6 rounded-3xl border flex flex-col justify-between shadow-xl transition-all ${
              wallboardTheme === 'light'
                ? 'bg-white border-slate-200 shadow-slate-200/60'
                : 'bg-[#0B1222]/90 border-slate-800 shadow-black/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-75 flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-amber-500" />
                <span>{isEn ? 'VIP Loyalty & Giveaway' : 'Fidelización & Sorteo VIP'}</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30">
                {isEn ? 'Privacy Shield' : 'Habeas Data'}
              </span>
            </div>
            <div className="my-3">
              <div className="text-4xl sm:text-5xl font-black text-amber-500">{participantsCount}</div>
              <p className="text-xs opacity-75 mt-1 font-medium">
                {isEn
                  ? 'Registered clients in database this month'
                  : 'Clientes registrados en la base de datos este mes'}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 truncate">
              <Trophy className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {campaignData.active
                  ? `${campaignData.reward.substring(0, 30)}...`
                  : isEn
                  ? 'Giveaway of the Month'
                  : 'Sorteo del Mes'}
              </span>
            </div>
          </div>

          {/* Card 4: Blindaje Reputacional en Sala */}
          <div
            className={`p-5 sm:p-6 rounded-3xl border flex flex-col justify-between shadow-xl transition-all ${
              wallboardTheme === 'light'
                ? 'bg-white border-slate-200 shadow-slate-200/60'
                : 'bg-[#0B1222]/90 border-slate-800 shadow-black/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-75 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-500" />
                <span>{isEn ? 'Reputation Shield' : 'Blindaje Reputacional'}</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold border border-cyan-500/30">
                Anti-Crisis
              </span>
            </div>
            <div className="my-3">
              <div className="text-4xl sm:text-5xl font-black text-cyan-600 dark:text-cyan-400">
                {wbNeutralized}
              </div>
              <p className="text-xs opacity-75 mt-1 font-medium">
                {isEn
                  ? 'Private concerns resolved before reaching public internet'
                  : 'Inconformidades privadas resueltas antes de llegar a internet'}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[11px] font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>{isEn ? 'Smart QR protective filter 100% active' : 'Filtro inteligente Smart QR 100% activo'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. SECCIÓN: PODIO DEL PERSONAL DEL TURNO EN VIVO */}
      <div
        className={`p-4 sm:p-6 rounded-3xl border shadow-xl backdrop-blur-xl shrink-0 ${
          wallboardTheme === 'light' ? 'bg-white/95 border-slate-200' : 'bg-[#0B1222]/90 border-slate-800'
        }`}
      >
        <div className="space-y-3.5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400 animate-pulse" />
              <div>
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-1.5">
                  <span>{isEn ? 'Live Staff Shift Podium' : 'Podio del Personal del Turno en Vivo'}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
                    {isEn ? 'Live Recognition' : 'Modo Reconocimiento en Vivo'}
                  </span>
                </h2>
                <p className="text-[10px] opacity-60">
                  {isEn
                    ? 'Team performance driven by 5★ client reviews and zero uncontained incidents'
                    : 'Personal líder motivado por calificaciones 5★ de clientes y 0 quejas en servicio'}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold opacity-75">
              {wallboardPeriod === 'today' ? `${isEn ? 'Shift: ' : 'Turno: '}${ind.shiftName}` : wallboardPeriod === 'week' ? (isEn ? 'Period: This Week' : 'Periodo: Esta Semana') : (isEn ? 'Period: This Month' : 'Periodo: Este Mes')}
            </span>
          </div>

          {(() => {
            const defaultStaff = getIndustryStaffMembers(businessCategory, isEn);
            const staffSource = (branchStaffList.length > 0 ? branchStaffList : defaultStaff)
              .map((raw: any, sIdx: number) => {
              const name = typeof raw === 'object' && raw !== null ? raw.name : String(raw);
              const role = typeof raw === 'object' && raw !== null ? raw.role : (isEn ? 'Service / Support' : 'Servicio / Atención');
              const branchName = typeof raw === 'object' && raw !== null && raw.branchName
                ? raw.branchName
                : (resolvedBranchName || (isEn ? 'Main Branch' : 'Sede Principal'));

              const cleanName = name.replace(/^(Dr\.|Dra\.|Lic\.|Enf\.|Ing\.|Sr\.|Sra\.)\s*/i, '').trim();
              const firstName = cleanName.split(/\s+/)[0];

              // 1. Calificaciones y menciones en el periodo activo (periodGoogle: Hoy, Semana o Mes)
              const staffReviewsInPeriod = periodGoogle.filter((r) => {
                const t = r.text.toLowerCase();
                return (
                  t.includes(cleanName.toLowerCase()) ||
                  (firstName.length >= 4 && t.includes(firstName.toLowerCase()))
                );
              });
              const fiveStarsCount = staffReviewsInPeriod.filter((r) => r.rating === 5).length;
              const positiveReviewsCount = staffReviewsInPeriod.filter((r) => r.rating >= 4).length;

              // 2. Quejas / Incidencias en el periodo activo (periodFeedbacks: Hoy, Semana o Mes)
              const staffComplaintsInPeriod = periodFeedbacks.filter((f) => {
                if (!f.attendedBy) return false;
                const att = f.attendedBy.toLowerCase();
                return (
                  att.includes(cleanName.toLowerCase()) ||
                  (firstName.length >= 4 && att.includes(firstName.toLowerCase()))
                );
              });
              const complaintsAgainst = staffComplaintsInPeriod.length;
              const neutralizedCount = staffComplaintsInPeriod.filter((f) => f.status === 'resolved').length;
              const pendingCount = staffComplaintsInPeriod.filter((f) => f.status === 'pending').length;

              // Calificación promedio calculada real del periodo
              let rating = '5.0';
              if (staffReviewsInPeriod.length > 0) {
                const totalStars = staffReviewsInPeriod.reduce((acc, r) => acc + (r.rating || 5), 0);
                rating = (totalStars / staffReviewsInPeriod.length).toFixed(1);
              } else if (complaintsAgainst > 0) {
                rating = Math.max(3.8, 5.0 - pendingCount * 0.4 - neutralizedCount * 0.1).toFixed(1);
              } else {
                rating = '5.0';
              }

              // Tasa de satisfacción
              let satisfactionRate = 100;
              if (complaintsAgainst > 0) {
                const positiveInteractions = fiveStarsCount + neutralizedCount;
                const totalInteractions = fiveStarsCount + complaintsAgainst;
                satisfactionRate = totalInteractions > 0
                  ? Math.max(70, Math.round((positiveInteractions / totalInteractions) * 100))
                  : 100;
              }

              return {
                id: `podium-${sIdx}-${name}`,
                name,
                role,
                branchName,
                fiveStarsCount,
                positiveReviewsCount,
                complaintsCount: complaintsAgainst,
                neutralizedCount,
                rating,
                satisfactionRate,
              };
            }).sort((a, b) => {
              // 1. Mayor cantidad de 5 estrellas en el periodo
              if (b.fiveStarsCount !== a.fiveStarsCount) return b.fiveStarsCount - a.fiveStarsCount;
              // 2. Mayor cantidad de opiniones positivas (>= 4★)
              if (b.positiveReviewsCount !== a.positiveReviewsCount) return b.positiveReviewsCount - a.positiveReviewsCount;
              // 3. Mayor cantidad de quejas neutralizadas
              if (b.neutralizedCount !== a.neutralizedCount) return b.neutralizedCount - a.neutralizedCount;
              // 4. Menor cantidad de quejas en el periodo
              if (a.complaintsCount !== b.complaintsCount) return a.complaintsCount - b.complaintsCount;
              // 5. Mejor rating
              if (parseFloat(b.rating) !== parseFloat(a.rating)) return parseFloat(b.rating) - parseFloat(a.rating);
              // 6. Alfabético por nombre
              return a.name.localeCompare(b.name);
            });

            const topThree = staffSource.slice(0, 3);
            const restStaff = staffSource.slice(3, 7);

            return (
              <div className="space-y-3.5">
                {/* Top 3 Podium Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {topThree.map((staff, idx) => {
                    const medal = idx === 0
                      ? (isEn ? '🥇 1st Place (Gold)' : '🥇 1er Puesto (Oro)')
                      : idx === 1
                      ? (isEn ? '🥈 2nd Place (Silver)' : '🥈 2do Puesto (Plata)')
                      : (isEn ? '🥉 3rd Place (Bronze)' : '🥉 3er Puesto (Bronce)');
                    const isGold = idx === 0;
                    const isSilver = idx === 1;

                    return (
                      <div
                        key={staff.id}
                        className={`p-4 rounded-2xl border relative overflow-hidden flex flex-col justify-between space-y-2.5 transition-all hover:scale-[1.02] ${
                          isGold
                            ? wallboardTheme === 'light'
                              ? 'bg-gradient-to-br from-amber-100/95 via-amber-50 to-yellow-100/80 border-amber-300 ring-2 ring-amber-400/50 shadow-lg'
                              : 'bg-gradient-to-br from-[#1A1408] via-[#241A0B] to-amber-950/40 border-amber-500/60 ring-2 ring-amber-400/40 shadow-xl'
                            : isSilver
                            ? wallboardTheme === 'light'
                              ? 'bg-gradient-to-br from-slate-100 to-slate-200/70 border-slate-300 shadow-md'
                              : 'bg-gradient-to-br from-[#0B101E] to-slate-900 border-slate-700 shadow-md'
                            : wallboardTheme === 'light'
                            ? 'bg-gradient-to-br from-amber-50 to-orange-50/70 border-amber-200 shadow-md'
                            : 'bg-gradient-to-br from-[#100C09] to-amber-950/20 border-amber-600/40 shadow-md'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] font-black px-2.5 py-1 rounded-xl border flex items-center gap-1.5 ${
                            isGold
                              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                              : isSilver
                              ? 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white border-slate-400'
                              : 'bg-amber-600/30 text-amber-600 dark:text-amber-300 border-amber-600/40'
                          }`}>
                            {medal}
                          </span>
                          <span className="text-xs font-mono font-black text-amber-500">
                            ★ {staff.rating}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-base font-black truncate">{staff.name}</h3>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs opacity-75">{staff.role}</span>
                            {staff.branchName && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20">
                                <MapPin className="w-2.5 h-2.5 shrink-0" />
                                {staff.branchName}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 dark:border-slate-800 text-xs">
                          <span className="font-bold text-amber-500">
                            {staff.fiveStarsCount} {staff.fiveStarsCount === 1 ? (isEn ? '5★ rating' : 'calificación 5★') : (isEn ? '5★ ratings' : 'calificaciones 5★')}
                          </span>
                          <span className="font-bold text-emerald-500">
                            {staff.satisfactionRate}% {staff.complaintsCount === 0 ? (isEn ? '0 complaints' : '0 quejas') : (isEn ? `${staff.complaintsCount} incident` : `${staff.complaintsCount} quejas`)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Rest of Staff */}
                {restStaff.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {restStaff.map((staff, rIdx) => (
                      <div
                        key={staff.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs ${
                          wallboardTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#080D1A] border-slate-800'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-mono text-slate-400 shrink-0">#{rIdx + 4}</span>
                            <span className="font-bold truncate text-xs">{staff.name}</span>
                          </div>
                          {staff.branchName && (
                            <div className="flex items-center gap-1 text-[9px] text-sky-400 font-semibold truncate mt-0.5">
                              <MapPin className="w-2 h-2 shrink-0 text-sky-400" />
                              <span className="truncate">{staff.branchName}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-amber-500 font-bold shrink-0">{staff.fiveStarsCount} ★</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* 2. SECCIÓN: ÚLTIMOS MENSAJES & ACTIVIDAD EN VIVO */}
      <div
        className={`p-4 sm:p-6 rounded-3xl border shadow-xl backdrop-blur-xl shrink-0 ${
          wallboardTheme === 'light' ? 'bg-white/95 border-slate-200' : 'bg-[#0B1222]/90 border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 animate-bounce" />
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider">
              {isEn ? 'Live Stream (Google Maps & Smart QR)' : 'Actividad en Vivo (Google Maps & Smart QR)'}
            </h2>
          </div>
          <span className="text-[10px] font-bold opacity-60">
            {isEn
              ? `Showing latest ${wbActivity.length} verified experiences • Auto-syncing`
              : `Mostrando las últimas ${wbActivity.length} opiniones registradas • Actualización automática`}
          </span>
        </div>

        {wbActivity.length === 0 ? (
          <div className="py-6 text-center text-xs opacity-50 font-medium">
            {isEn
              ? 'No customer experiences recorded yet for this shift or location.'
              : 'Aún no hay opiniones registradas para este turno o sede.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {wbActivity.map((item, idx) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border flex flex-col justify-between space-y-2 transition-all hover:scale-[1.01] ${
                  idx === 0
                    ? wallboardTheme === 'light'
                      ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-400/40 shadow-md'
                      : 'bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border-amber-500/40 ring-1 ring-amber-400/30 shadow-md'
                    : wallboardTheme === 'light'
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-[#060913] border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0 ${
                        item.isGoogle
                          ? 'bg-indigo-500/15 text-indigo-500 border border-indigo-500/30'
                          : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                      }`}
                    >
                      {item.isGoogle ? 'Google' : 'WhatsApp'}
                    </span>
                    <span className="font-black text-xs truncate">{item.author}</span>
                  </div>
                  <div className="flex items-center text-amber-500 font-bold text-xs shrink-0">
                    {'★'.repeat(item.rating)}
                  </div>
                </div>

                <p className="text-[11px] leading-relaxed line-clamp-2 opacity-85 font-medium italic">
                  "{item.comment || (isEn ? 'Rating submitted with no written comment' : 'Calificación enviada sin comentario escrito')}"
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800/60 text-[10px] opacity-60">
                  <span className="truncate">{item.branchName}</span>
                  <span className="shrink-0">{formatRelativeOrDate(item.date, isEn)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function WallboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#060913] text-white flex flex-col items-center justify-center gap-3">
          <Tv className="w-10 h-10 text-amber-500 animate-pulse" />
          <p className="text-sm font-bold tracking-wide">Iniciando Wallboard Operativo en Vivo...</p>
        </div>
      }
    >
      <WallboardContent />
    </Suspense>
  );
}
