'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { PrestigiaIcon } from '@/components/PrestigiaIcon';
import { RetentionDonutChart, FinancialRoiComparisonChart } from '@/components/AuditorCharts';
import { AUDITOR_TRANSLATIONS, AuditorLang } from '@/lib/auditorTranslations';
import type { GoogleSeoAudit } from '@/app/api/auditor/google-lookup/route';
import {
  ShieldAlert,
  ShieldCheck,
  Star,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Users,
  Search,
  CheckCircle2,
  DollarSign,
  Gift,
  ArrowRight,
  Printer,
  Share2,
  FileSpreadsheet,
  Building2,
  Store,
  Tv,
  MessageCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Flame,
  Zap,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Plus,
  Trash2,
  MapPin,
  Globe,
  QrCode,
  X,
  Copy,
  Check,
  ChevronUp,
  ChevronDown,
  FileText,
  Lock,
  Scale,
  Award,
  BadgeCheck,
  Tag,
  Compass,
  PhoneCall,
  BookOpen,
  MessageSquareReply,
  Bot,
  SlidersHorizontal,
  UserCheck,
  CornerDownRight,
  History,
} from 'lucide-react';

export interface AdditionalBranch {
  id: string;
  name: string;
  googleUrl: string;
  rating: number;
  reviewsCount: number;
  monthlyDiners: number;
  staffCount: number;
  address?: string;
  isScanning?: boolean;
  scanMessage?: string | null;
  scanSuccess?: boolean | null;
}

interface GoogleScrapedData {
  name: string;
  rating: number;
  reviewsCount: number;
  address?: string;
  googleMapsUrl?: string;
  googleReviewUrl?: string;
  placeId?: string;
  extractedFrom?: string;
  category?: string;
  website?: string;
  phone?: string;
  detectedCategories?: string[];
  seoAudit?: GoogleSeoAudit;
}

export default function BusinessAuditorPage() {
  // Language selector ('es' | 'en')
  const [lang, setLang] = useState<AuditorLang>('es');

  // Sync lang with localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('prestigia_auditor_lang');
      if (saved === 'en' || saved === 'es') {
        setLang(saved);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const changeLang = (newLang: AuditorLang) => {
    setLang(newLang);
    try {
      localStorage.setItem('prestigia_auditor_lang', newLang);
    } catch (e) {
      // ignore
    }
  };

  const t = AUDITOR_TRANSLATIONS[lang];

  // Currency selector
  const [currency, setCurrency] = useState<'COP' | 'USD' | 'MXN' | 'EUR'>('COP');

  // -------------------------------------------------------------
  // 1. FICHA PRINCIPAL DE LA MARCA (SEDE 1 / PRINCIPAL)
  // -------------------------------------------------------------
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('Gastrobar / Restaurante');
  const [mainGoogleUrl, setMainGoogleUrl] = useState('');
  const [isScanningMain, setIsScanningMain] = useState(false);
  const [mainScanMessage, setMainScanMessage] = useState<string | null>(null);
  const [mainScanSuccess, setMainScanSuccess] = useState<boolean | null>(null);
  const [hasScannedMain, setHasScannedMain] = useState(false);
  const [auditManuallyTriggered, setAuditManuallyTriggered] = useState(false);

  // Main Google Metrics
  const [mainRating, setMainRating] = useState<number | null>(null);
  const [mainReviews, setMainReviews] = useState<number | null>(null);
  const [mainAddress, setMainAddress] = useState('');
  const [mainSeoAudit, setMainSeoAudit] = useState<GoogleSeoAudit | null>(null);

  // Operational metrics for Main Venue (Mandatory inputs: start as null to force input by advisor/client)
  const [mainMonthlyDiners, setMainMonthlyDiners] = useState<number | null>(null);
  const [mainStaffCount, setMainStaffCount] = useState<number | null>(null);
  const [averageTicket, setAverageTicket] = useState<number | null>(null);
  const [isReportUnlocked, setIsReportUnlocked] = useState(false);
  const [auditDisplayMode, setAuditDisplayMode] = useState<'executive' | 'complete'>('executive');

  // Recovery Rate simulation for existing unanswered negative reviews (defaults to 25%)
  const [unansweredRecoveryRate, setUnansweredRecoveryRate] = useState<number>(25);

  // Live Real Review and IA Rescue Generator State
  const [activeComplaintAuthor, setActiveComplaintAuthor] = useState<string>('');
  const [activeComplaintText, setActiveComplaintText] = useState<string>('');
  const [customAiResponse, setCustomAiResponse] = useState<string>('');
  const [isEditingRealReview, setIsEditingRealReview] = useState<boolean>(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);

  // Validation of mandatory operational fields
  const isOperationalDataValid = useMemo(() => {
    return (
      businessName.trim().length > 0 &&
      mainRating !== null &&
      mainRating > 0 &&
      mainMonthlyDiners !== null &&
      mainMonthlyDiners > 0 &&
      mainStaffCount !== null &&
      mainStaffCount > 0 &&
      averageTicket !== null &&
      averageTicket > 0
    );
  }, [businessName, mainRating, mainMonthlyDiners, mainStaffCount, averageTicket]);

  // Diagnostic is ready ONLY if data is valid AND explicitly unlocked
  const isAuditReady = isReportUnlocked && isOperationalDataValid;

  // -------------------------------------------------------------
  // 2. SEDES ADICIONALES (OPCIONALES PARA CADENAS)
  // -------------------------------------------------------------
  const [additionalBranches, setAdditionalBranches] = useState<AdditionalBranch[]>([]);

  // Selected Report View: 'global' or branchId
  const [selectedReportView, setSelectedReportView] = useState<'global' | string>('global');

  // Currency formats
  const currencyConfig = useMemo(() => {
    switch (currency) {
      case 'USD':
        return { symbol: '$', code: 'USD', factor: 0.00025, defaultTicket: 22, name: 'Dólares (USD)' };
      case 'MXN':
        return { symbol: '$', code: 'MXN', factor: 0.0045, defaultTicket: 380, name: 'Pesos Mexicanos (MXN)' };
      case 'EUR':
        return { symbol: '€', code: 'EUR', factor: 0.00023, defaultTicket: 20, name: 'Euros (EUR)' };
      case 'COP':
      default:
        return { symbol: '$', code: 'COP', factor: 1, defaultTicket: 45000, name: 'Pesos Colombianos (COP)' };
    }
  }, [currency]);

  // Adjust default ticket when currency changes (only if already set)
  const handleCurrencyChange = (newCurr: 'COP' | 'USD' | 'MXN' | 'EUR') => {
    setCurrency(newCurr);
    if (averageTicket !== null) {
      if (newCurr === 'USD') setAverageTicket(22);
      else if (newCurr === 'EUR') setAverageTicket(20);
      else if (newCurr === 'MXN') setAverageTicket(380);
      else setAverageTicket(45000);
    }
  };

  // Dynamic category vocabulary based on the business type and active language
  const categoryTerms = useMemo(() => {
    const isEn = lang === 'en';
    switch (category) {
      case 'Logística / Envíos / Mensajería':
        return {
          clientLabel: isEn ? 'Clients / Senders' : 'Clientes / Remitentes',
          clientSingular: isEn ? 'client' : 'cliente',
          clientsMonthLabel: isEn ? 'Shipments / Month' : 'Envíos / Mes',
          staffLabel: isEn ? 'Couriers / Operators' : 'Operadores / Mensajeros',
          staffSingular: isEn ? 'courier/operator' : 'operador/mensajero',
          frictionCauses: isEn ? 'delivery delays, untracked parcels, or package condition' : 'los retrasos en entregas, guías sin actualización o estado de paquetes',
          ticketLabel: isEn ? 'Avg Value / Shipment' : 'Valor Promedio / Envío',
          ticketSub: isEn ? 'Average fee per freight or route' : 'Tarifa media por flete o servicio',
          serviceDescription: isEn ? 'in the delivery route' : 'en la entrega o ruta del envío',
          sampleAuthor: 'Julian P.',
          sampleComplaint: isEn ? '"Excessive delivery delay and tracking code never updated status. Unacceptable phone support."' : '"Demora excesiva en la entrega del paquete y el número de guía nunca actualizó el estado. Pésima comunicación telefónica."',
          sampleResponseSubject: isEn ? 'logistics dispatch' : 'servicio logístico',
          sampleResolution: isEn ? 'credit your freight cost and assign a complimentary priority courier for your next dispatch' : 'compensar el flete y entregarte una guía prioritaria sin costo para tu próximo envío',
        };
      case 'Servicios Profesionales / B2B':
        return {
          clientLabel: isEn ? 'Clients / Accounts' : 'Clientes / Cuentas',
          clientSingular: isEn ? 'account' : 'cliente',
          clientsMonthLabel: isEn ? 'Projects / Month' : 'Proyectos / Mes',
          staffLabel: isEn ? 'Consultants / Advisors' : 'Consultores / Asesores',
          staffSingular: isEn ? 'consultant' : 'consultor',
          frictionCauses: isEn ? 'project turnaround times, communication or case follow-up' : 'los tiempos de entrega, la comunicación o el seguimiento de casos',
          ticketLabel: isEn ? 'Avg Value / Contract' : 'Ticket Promedio / Contrato',
          ticketSub: isEn ? 'Average billing per service account' : 'Facturación media por servicio prestado',
          serviceDescription: isEn ? 'in project delivery' : 'en la gestión del proyecto',
          sampleAuthor: 'Alexander R.',
          sampleComplaint: isEn ? '"Lack of clarity regarding agreed delivery milestones and multi-day delays replying to emails."' : '"Falta de claridad en los tiempos de entrega pactados y demoras de varios días para responder correos."',
          sampleResponseSubject: isEn ? 'corporate advisory' : 'atención corporativa',
          sampleResolution: isEn ? 'personally audit your file and deliver a complimentary strategic corrective session' : 'revisar tu expediente personalmente y brindarte una sesión de consultoría correctiva sin costo',
        };
      case 'Retail / Comercio':
        return {
          clientLabel: isEn ? 'Shoppers / Buyers' : 'Clientes / Compradores',
          clientSingular: isEn ? 'shopper' : 'cliente',
          clientsMonthLabel: isEn ? 'Customers / Month' : 'Clientes / Mes',
          staffLabel: isEn ? 'Sales Reps / Staff' : 'Vendedores / Asesores',
          staffSingular: isEn ? 'associate' : 'asesor',
          frictionCauses: isEn ? 'checkout delays, service attentiveness, or stock availability' : 'la atención, demoras en caja o falta de producto',
          ticketLabel: isEn ? 'Avg Basket / Purchase' : 'Ticket Promedio / Compra',
          ticketSub: isEn ? 'Average store expenditure per customer' : 'Gasto medio por cliente en tienda',
          serviceDescription: isEn ? 'at store register' : 'en la tienda o punto de venta',
          sampleAuthor: 'Camille S.',
          sampleComplaint: isEn ? '"Poor staff attitude, absurd waiting queues to pay at register, and zero guidance on floor."' : '"Mala atención por parte del personal, demoras absurdas en caja para pagar y nadie supo orientarme."',
          sampleResponseSubject: isEn ? 'store experience' : 'atención en tienda',
          sampleResolution: isEn ? 'coordinate VIP assistance with our store director plus an exclusive courtesy bonus on your next visit' : 'coordinar una atención personalizada con nuestro jefe de tienda y una bonificación en tu próxima compra',
        };
      case 'Estética / Belleza / Spa':
        return {
          clientLabel: isEn ? 'Clients / Appointments' : 'Clientes / Citas',
          clientSingular: isEn ? 'client' : 'cliente',
          clientsMonthLabel: isEn ? 'Appointments / Month' : 'Citas / Mes',
          staffLabel: isEn ? 'Specialists / Stylists' : 'Especialistas / Estilistas',
          staffSingular: isEn ? 'specialist' : 'especialista',
          frictionCauses: isEn ? 'waiting times, service bedside manner, or treatment outcome' : 'el trato, tiempos de espera o el resultado del servicio',
          ticketLabel: isEn ? 'Avg Ticket / Service' : 'Ticket Promedio / Servicio',
          ticketSub: isEn ? 'Average spend per procedure' : 'Gasto medio por cita o procedimiento',
          serviceDescription: isEn ? 'in the styling booth' : 'en cabina o sillón',
          sampleAuthor: 'Valerie M.',
          sampleComplaint: isEn ? '"Arrived on time for my booked session and waited 45 minutes. The procedure felt rushed and careless."' : '"Llegué a mi cita puntual y me hicieron esperar 45 minutos. El procedimiento se sintió apresurado."',
          sampleResponseSubject: isEn ? 'guest care' : 'experiencia y cuidado',
          sampleResolution: isEn ? 'book an exclusive complimentary luxury treatment directly with our master specialist' : 'agendarte un tratamiento de cortesía directamente con nuestra especialista senior',
        };
      case 'Salud / Consultorios':
        return {
          clientLabel: isEn ? 'Patients / Consults' : 'Pacientes / Consultas',
          clientSingular: isEn ? 'patient' : 'paciente',
          clientsMonthLabel: isEn ? 'Patients / Month' : 'Pacientes / Mes',
          staffLabel: isEn ? 'Practitioners / Front Desk' : 'Profesionales / Recepción',
          staffSingular: isEn ? 'practitioner' : 'profesional',
          frictionCauses: isEn ? 'punctuality, reception demeanor, or bedside empathy' : 'la puntualidad, el trato en recepción o la atención',
          ticketLabel: isEn ? 'Avg Fee / Consultation' : 'Valor Promedio / Consulta',
          ticketSub: isEn ? 'Average expenditure per clinical visit' : 'Gasto medio por consulta o tratamiento',
          serviceDescription: isEn ? 'in consultation' : 'en consulta o recepción',
          sampleAuthor: 'Danielle G.',
          sampleComplaint: isEn ? '"Cold reception desk demeanor and the doctor started over an hour late with zero heads-up."' : '"Poco tacto en recepción y la consulta inició con más de una hora de retraso sin previo aviso."',
          sampleResponseSubject: isEn ? 'clinical care' : 'atención y puntualidad',
          sampleResolution: isEn ? 'schedule priority fast-track consultation and waive your next administrative fee' : 'brindarte un seguimiento prioritario y exonerar el costo administrativo de tu próxima consulta',
        };
      case 'Hotelería / Hospedaje':
        return {
          clientLabel: isEn ? 'Guests / Bookings' : 'Huéspedes / Reservas',
          clientSingular: isEn ? 'guest' : 'huésped',
          clientsMonthLabel: isEn ? 'Guests / Month' : 'Huéspedes / Mes',
          staffLabel: isEn ? 'Hospitality / Front Desk' : 'Equipo de Servicio / Front Desk',
          staffSingular: isEn ? 'host' : 'colaborador',
          frictionCauses: isEn ? 'check-in delays, room condition, or housekeeping' : 'el check-in, la habitación o el aseo',
          ticketLabel: isEn ? 'Avg Rate / Night' : 'Tarifa Promedio / Noche',
          ticketSub: isEn ? 'Average expenditure per guest stay' : 'Gasto medio por reserva o estancia',
          serviceDescription: isEn ? 'during hotel stay' : 'durante su estancia',
          sampleAuthor: 'Martin B.',
          sampleComplaint: isEn ? '"Room was not ready upon check-in hour and HVAC unit was malfunctioning throughout the night."' : '"La habitación no estaba lista a la hora del check-in y el aire acondicionado presentaba fallas continuas."',
          sampleResponseSubject: isEn ? 'hospitality' : 'hospitalidad',
          sampleResolution: isEn ? 'grant a complimentary room suite upgrade with executive welcome amenities on your return' : 'brindarte un upgrade gratuito y una cortesía especial en tu próxima reserva',
        };
      case 'Discoteca / Club':
        return {
          clientLabel: isEn ? 'Guests / Patrons' : 'Asistentes / Clientes',
          clientSingular: isEn ? 'guest' : 'cliente',
          clientsMonthLabel: isEn ? 'Patrons / Month' : 'Asistentes / Mes',
          staffLabel: isEn ? 'Bartenders / Security / Crew' : 'Bartenders / Seguridad / Meseros',
          staffSingular: isEn ? 'bartender' : 'bartender/mesero',
          frictionCauses: isEn ? 'door queue, audio balance, or bar service times' : 'el acceso, la música o la atención en barra',
          ticketLabel: isEn ? 'Avg Spend / Patron' : 'Consumo Promedio / Persona',
          ticketSub: isEn ? 'Average tab per attendee' : 'Gasto medio por asistente',
          serviceDescription: isEn ? 'at the bar' : 'en barra o mesa',
          sampleAuthor: 'Sebastian T.',
          sampleComplaint: isEn ? '"Endless queue despite confirmed table reservation, plus aggressive attitude from door security."' : '"Fila interminable a pesar de tener reserva y pésima actitud del personal de seguridad en la entrada."',
          sampleResponseSubject: isEn ? 'VIP nightlife' : 'experiencia y servicio',
          sampleResolution: isEn ? 'grant exclusive VIP priority table entry with complimentary welcome cocktails on your next visit' : 'otorgarte acceso VIP preferencial con mesa asegurada y cóctel de bienvenida en tu próxima visita',
        };
      case 'Cafetería / Panadería':
        return {
          clientLabel: isEn ? 'Guests / Patrons' : 'Clientes / Comensales',
          clientSingular: isEn ? 'guest' : 'cliente',
          clientsMonthLabel: isEn ? 'Guests / Month' : 'Clientes / Mes',
          staffLabel: isEn ? 'Baristas / Cashiers' : 'Baristas / Cajeros',
          staffSingular: isEn ? 'barista' : 'barista',
          frictionCauses: isEn ? 'prep times, cold specialty coffee, or cashier warmth' : 'el tiempo de preparación, el café frío o la atención en mostrador',
          ticketLabel: isEn ? 'Avg Ticket / Order' : 'Ticket Promedio / Consumo',
          ticketSub: isEn ? 'Average spending per coffee visit' : 'Gasto medio por cliente en cafetería',
          serviceDescription: isEn ? 'at coffee bar' : 'en barra o salón',
          sampleAuthor: 'Andrea K.',
          sampleComplaint: isEn ? '"Waited 35 minutes for two lattes and they were served lukewarm. Counter attendant was completely indifferent."' : '"Esperamos más de media hora por un par de cafés y nos los entregaron fríos. La atención en caja fue muy apática."',
          sampleResponseSubject: isEn ? 'coffee craft' : 'calidad y café',
          sampleResolution: isEn ? 'invite you personally for a complimentary barista tasting breakfast on your next morning run' : 'invitarte personalmente a un desayuno o merienda completa de cortesía en tu próxima pasada',
        };
      case 'Gastrobar / Restaurante':
      default:
        return {
          clientLabel: isEn ? 'Diners / Guests' : 'Comensales',
          clientSingular: isEn ? 'guest' : 'comensal',
          clientsMonthLabel: isEn ? 'Diners / Month' : 'Comensales / Mes',
          staffLabel: isEn ? 'Servers / Floor Staff' : 'Colaboradores / Meseros',
          staffSingular: isEn ? 'server' : 'mesero',
          frictionCauses: isEn ? 'table service, food timing, or ticket delays' : 'el servicio, la comida o la demora',
          ticketLabel: isEn ? 'Avg Ticket / Diner' : 'Ticket Promedio / Comensal',
          ticketSub: isEn ? 'Average spend per dining guest' : 'Gasto medio por comensal en mesa',
          serviceDescription: isEn ? 'at table' : 'en mesa',
          sampleAuthor: 'Carlos M.',
          sampleComplaint: isEn ? '"Terrible dining experience, waited over 45 minutes for mains with no explanation from staff. Never coming back."' : '"Pésima experiencia, esperamos más de 40 minutos por los platos y nadie nos dio una explicación. No volvemos."',
          sampleResponseSubject: isEn ? 'hospitality' : 'hospitalidad',
          sampleResolution: isEn ? 'compensate the occurrence with a complimentary dining course and host your table personally' : 'compensar lo ocurrido con una cena de cortesía y coordinar tu visita personalmente',
        };
    }
  }, [category, lang]);

  // Forensically calculated star distribution based on real Google Maps profile patterns
  const starDistribution = useMemo(() => {
    const rating = mainRating ?? 4.0;
    const total = mainReviews ?? 0;
    if (total <= 0) {
      return {
        5: { count: 0, pct: 0 },
        4: { count: 0, pct: 0 },
        3: { count: 0, pct: 0 },
        2: { count: 0, pct: 0 },
        1: { count: 0, pct: 0 },
        promotersPct: 0,
        detractorsPct: 0,
        detractorsCount: 0,
      };
    }

    if (total === 1) {
      const s = Math.min(5, Math.max(1, Math.round(rating)));
      const res: Record<number, { count: number; pct: number }> = {} as any;
      for (let i = 1; i <= 5; i++) res[i] = { count: i === s ? 1 : 0, pct: i === s ? 100 : 0 };
      return {
        ...res,
        promotersPct: s >= 4 ? 100 : 0,
        detractorsPct: s <= 2 ? 100 : 0,
        detractorsCount: s <= 2 ? 1 : 0,
      };
    }

    // Google Maps empirical distribution baselines by rating bracket:
    // Reflects real Google Maps bar distribution where higher ratings have descending bars:
    // 5★ (dominant), 4★ (second), 3★ (third), 2★ (fourth), 1★ (fifth)
    let f5: number, f4: number, f3: number, f2: number, f1: number;
    if (rating >= 4.8) {
      f5 = 0.85; f4 = 0.10; f3 = 0.03; f2 = 0.01; f1 = 0.01;
    } else if (rating >= 4.4) { // e.g. 4.5★
      f5 = 0.68; f4 = 0.20; f3 = 0.06; f2 = 0.03; f1 = 0.03;
    } else if (rating >= 4.0) {
      f5 = 0.54; f4 = 0.23; f3 = 0.10; f2 = 0.05; f1 = 0.08;
    } else if (rating >= 3.6) {
      f5 = 0.42; f4 = 0.21; f3 = 0.14; f2 = 0.09; f1 = 0.14;
    } else if (rating >= 3.0) {
      f5 = 0.30; f4 = 0.18; f3 = 0.18; f2 = 0.13; f1 = 0.21;
    } else if (rating >= 2.0) {
      f5 = 0.14; f4 = 0.12; f3 = 0.16; f2 = 0.18; f1 = 0.40;
    } else {
      f5 = 0.05; f4 = 0.06; f3 = 0.10; f2 = 0.17; f1 = 0.62;
    }

    let counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    // Exact integer combinations for small review counts (<= 15 reviews)
    if (total <= 15) {
      const targetSum = Math.round(rating * total);
      let best: Record<number, number> | null = null;
      let bestScore = -Infinity;

      for (let s5 = total; s5 >= 0; s5--) {
        for (let s4 = total - s5; s4 >= 0; s4--) {
          for (let s3 = total - s5 - s4; s3 >= 0; s3--) {
            for (let s2 = total - s5 - s4 - s3; s2 >= 0; s2--) {
              const s1 = total - s5 - s4 - s3 - s2;
              if (5 * s5 + 4 * s4 + 3 * s3 + 2 * s2 + 1 * s1 === targetSum) {
                // Penalize deviations from empirical shape with polarization weighting
                const diff =
                  Math.pow(s5 / total - f5, 2) * 2.0 +
                  Math.pow(s4 / total - f4, 2) * 1.5 +
                  Math.pow(s3 / total - f3, 2) * 1.0 +
                  Math.pow(s2 / total - f2, 2) * 1.0 +
                  Math.pow(s1 / total - f1, 2) * 1.8;
                const score = -diff;
                if (score > bestScore) {
                  bestScore = score;
                  best = { 5: s5, 4: s4, 3: s3, 2: s2, 1: s1 };
                }
              }
            }
          }
        }
      }
      if (best) counts = best;
    }

    // Medium and large volume profiles (16 to thousands)
    if (total > 15 || !counts[5]) {
      counts = {
        5: Math.round(total * f5),
        4: Math.round(total * f4),
        3: Math.round(total * f3),
        2: Math.round(total * f2),
        1: Math.round(total * f1),
      };

      // Balance sum of counts to match total
      const allocated = counts[5] + counts[4] + counts[3] + counts[2] + counts[1];
      counts[5] += total - allocated;

      // Exact mathematical adjustment to match target average rating (rating * total)
      const targetStars = Math.round(rating * total);
      let currentStars = counts[5] * 5 + counts[4] * 4 + counts[3] * 3 + counts[2] * 2 + counts[1] * 1;
      let diff = targetStars - currentStars;

      let safety = 1000;
      while (diff !== 0 && safety-- > 0) {
        if (diff > 0) {
          if (counts[4] > 0 && diff >= 1) { counts[4]--; counts[5]++; diff -= 1; }
          else if (counts[3] > 0 && diff >= 1) { counts[3]--; counts[4]++; diff -= 1; }
          else if (counts[2] > 0 && diff >= 1) { counts[2]--; counts[3]++; diff -= 1; }
          else if (counts[1] > 0 && diff >= 1) { counts[1]--; counts[2]++; diff -= 1; }
          else break;
        } else {
          if (counts[5] > 0 && diff <= -1) { counts[5]--; counts[4]++; diff += 1; }
          else if (counts[4] > 0 && diff <= -1) { counts[4]--; counts[3]++; diff += 1; }
          else if (counts[3] > 0 && diff <= -1) { counts[3]--; counts[2]++; diff += 1; }
          else if (counts[2] > 0 && diff <= -1) { counts[2]--; counts[1]++; diff += 1; }
          else break;
        }
      }
    }

    const result: Record<number, { count: number; pct: number }> = {} as any;
    for (let s = 1; s <= 5; s++) {
      const c = counts[s] || 0;
      const pct = total > 0 ? Math.round((c / total) * 100) : 0;
      result[s] = { count: c, pct };
    }

    const promotersCount = (counts[5] || 0) + (counts[4] || 0);
    const detractorsCount = (counts[1] || 0) + (counts[2] || 0);
    const promotersPct = total > 0 ? Math.round((promotersCount / total) * 100) : 0;
    const detractorsPct = total > 0 ? Math.round((detractorsCount / total) * 100) : 0;

    return {
      ...result,
      promotersPct,
      detractorsPct,
      detractorsCount,
    };
  }, [mainRating, mainReviews]);

  // Scan Main Branch Google Maps
  const handleScanMainGoogle = async (customUrl?: string) => {
    const urlToUse = (customUrl !== undefined ? customUrl : mainGoogleUrl).trim();
    if (!urlToUse) {
      setMainScanMessage('Por favor pega el enlace de Google Maps de la marca o escribe su nombre.');
      setMainScanSuccess(false);
      return;
    }

    if (customUrl) {
      setMainGoogleUrl(customUrl);
    }

    setIsScanningMain(true);
    setMainScanMessage('Conectando con Google Maps y extrayendo métricas de la marca...');
    setMainScanSuccess(null);

    try {
      const res = await fetch('/api/auditor/google-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToUse }),
      });

      const json = await res.json();
      if (res.ok && json.success && json.data) {
        const data: GoogleScrapedData = json.data;
        if (data.name && data.name !== 'Ficha de Google Maps') {
          setBusinessName(data.name);
          const lowerName = data.name.toLowerCase();
          if (lowerName.includes('envio') || lowerName.includes('envíos') || lowerName.includes('manda') || lowerName.includes('logis') || lowerName.includes('mensaj') || lowerName.includes('carga') || lowerName.includes('postal')) {
            setCategory('Logística / Envíos / Mensajería');
          } else if (lowerName.includes('hotel') || lowerName.includes('hostal') || lowerName.includes('posada') || lowerName.includes('resort')) {
            setCategory('Hotelería / Hospedaje');
          } else if (lowerName.includes('spa') || lowerName.includes('peluquer') || lowerName.includes('estetic') || lowerName.includes('belleza')) {
            setCategory('Estética / Belleza / Spa');
          } else if (lowerName.includes('salud') || lowerName.includes('clinic') || lowerName.includes('dental') || lowerName.includes('odontol') || lowerName.includes('doctor') || lowerName.includes('medic')) {
            setCategory('Salud / Consultorios');
          } else if (lowerName.includes('club') || lowerName.includes('disco') || lowerName.includes('bar') || lowerName.includes('pub') || lowerName.includes('lounge')) {
            setCategory('Discoteca / Club');
          } else if (lowerName.includes('cafe') || lowerName.includes('café') || lowerName.includes('panader')) {
            setCategory('Cafetería / Panadería');
          }
        }
        setMainRating(data.rating || 4.2);
        setMainReviews(data.reviewsCount || 0);
        if (data.address) setMainAddress(data.address);
        if (data.seoAudit) setMainSeoAudit(data.seoAudit);
        if (data.googleReviewUrl) {
          setMainGoogleUrl(data.googleReviewUrl);
        } else if (data.googleMapsUrl) {
          setMainGoogleUrl(data.googleMapsUrl);
        }
        setHasScannedMain(true);
        setIsReportUnlocked(false);
        setMainScanSuccess(true);
        setMainScanMessage(
          json.message || `✨ ¡Ficha Verificada! Calificación: ${data.rating}★ (${data.reviewsCount} opiniones detectadas).`
        );
      } else {
        setMainScanSuccess(false);
        setMainScanMessage(json.error || 'No se pudo leer la ficha automáticamente.');
      }
    } catch (err) {
      setMainScanSuccess(false);
      setMainScanMessage('Error de conexión al consultar Google Maps.');
    } finally {
      setIsScanningMain(false);
    }
  };

  // Additional Branch CRUD
  const handleAddBranch = () => {
    const nextNum = additionalBranches.length + 2;
    const newB: AdditionalBranch = {
      id: `b-${Date.now()}`,
      name: `Sede ${nextNum}`,
      googleUrl: '',
      rating: 0,
      reviewsCount: 0,
      monthlyDiners: 1200,
      staffCount: 6,
    };
    setAdditionalBranches([...additionalBranches, newB]);
  };

  const handleRemoveBranch = (id: string) => {
    setAdditionalBranches(additionalBranches.filter((b) => b.id !== id));
    if (selectedReportView === id) {
      setSelectedReportView('global');
    }
  };

  const handleUpdateBranch = (id: string, updates: Partial<AdditionalBranch>) => {
    setAdditionalBranches(additionalBranches.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const handleScanAdditionalBranch = async (branchId: string) => {
    const branch = additionalBranches.find((b) => b.id === branchId);
    if (!branch) return;

    if (!branch.googleUrl.trim()) {
      handleUpdateBranch(branchId, {
        scanMessage: 'Ingresa un enlace de Google Maps para esta sede.',
        scanSuccess: false,
      });
      return;
    }

    handleUpdateBranch(branchId, {
      isScanning: true,
      scanMessage: 'Conectando con Google Maps...',
      scanSuccess: null,
    });

    try {
      const res = await fetch('/api/auditor/google-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: branch.googleUrl.trim() }),
      });

      const json = await res.json();
      if (res.ok && json.success && json.data) {
        const data: GoogleScrapedData = json.data;
        handleUpdateBranch(branchId, {
          isScanning: false,
          name: data.name !== 'Ficha de Google Maps' ? data.name : branch.name,
          rating: data.rating || branch.rating,
          reviewsCount: data.reviewsCount || branch.reviewsCount,
          address: data.address || branch.address,
          scanSuccess: true,
          scanMessage: json.message || `✨ Ficha Verificada: ${data.rating}★ (${data.reviewsCount} reseñas).`,
        });
      } else {
        handleUpdateBranch(branchId, {
          isScanning: false,
          scanSuccess: false,
          scanMessage: json.error || 'No se pudo leer la ficha automáticamente.',
        });
      }
    } catch (err) {
      handleUpdateBranch(branchId, {
        isScanning: false,
        scanSuccess: false,
        scanMessage: 'Error de conexión con Google Maps.',
      });
    }
  };

  // Compile all branches (Main + Additional)
  const allBranches = useMemo(() => {
    const mainBranchObj = {
      id: 'main',
      name: businessName ? `${businessName} (Principal)` : 'Sede Principal',
      googleUrl: mainGoogleUrl,
      rating: mainRating !== null ? mainRating : 0,
      reviewsCount: mainReviews !== null ? mainReviews : 0,
      monthlyDiners: mainMonthlyDiners ?? 0,
      staffCount: mainStaffCount ?? 0,
      address: mainAddress,
      isMain: true,
    };
    return [mainBranchObj, ...additionalBranches];
  }, [
    businessName,
    mainGoogleUrl,
    mainRating,
    mainReviews,
    mainMonthlyDiners,
    mainStaffCount,
    mainAddress,
    additionalBranches,
  ]);

  // -------------------------------------------------------------
  // CALCULOS MATEMÁTICOS DE AUDITORÍA Y ROI (Global vs Por Sede)
  // -------------------------------------------------------------
  const calculations = useMemo(() => {
    const isGlobal = selectedReportView === 'global' || allBranches.length === 1;
    const activeBranch = allBranches.find((b) => b.id === selectedReportView) || allBranches[0];

    const targetBranches = isGlobal ? allBranches : [activeBranch];
    const branchesCount = targetBranches.length;

    // Totals
    const totalDinersMonth = targetBranches.reduce((sum, b) => sum + b.monthlyDiners, 0);
    const totalDinersYear = totalDinersMonth * 12;
    const totalStaffCount = targetBranches.reduce((sum, b) => sum + b.staffCount, 0);
    const totalReviews = targetBranches.reduce((sum, b) => sum + b.reviewsCount, 0);

    // Weighted average rating
    const weightedRatingSum = targetBranches.reduce((sum, b) => sum + b.rating * Math.max(1, b.reviewsCount), 0);
    const effectiveRating =
      totalReviews > 0
        ? Math.round((weightedRatingSum / totalReviews) * 10) / 10
        : (targetBranches[0]?.rating && targetBranches[0]?.rating > 0 ? targetBranches[0].rating : 4.0);

    // Estudio Harvard Business School & Zendesk:
    // La tasa de insatisfacción/fricción depende de la calificación actual en Google Maps:
    // A 4.8 - 5.0★: ~2.5% de clientes inconformes
    // A 4.5★: ~4.5%
    // A 4.0★: ~7.5%
    // A 3.4★: ~15.5% (alarma roja de reputación)
    // <= 3.0★: ~20.0%+
    const ratingDeficit = Math.max(0, 5.0 - (effectiveRating > 0 ? effectiveRating : 4.0));
    const dissatisfactionRate = Math.min(0.25, Math.max(0.025, 0.025 + Math.pow(ratingDeficit, 1.35) * 0.07));
    const monthlyUnhappyClients = Math.round(totalDinersMonth * dissatisfactionRate);
    const yearlyUnhappyClients = monthlyUnhappyClients * 12;

    // 96% de clientes inconformes NUNCA le dicen nada al administrador (The Silent Churn)
    const silentUnhappyMonthly = Math.round(monthlyUnhappyClients * 0.96);

    // Efecto devastador de reseñas negativas sin Prestigia
    const safeTotalReviews = Math.max(1, totalReviews);
    const isLowReviewProfile = totalReviews <= 30;

    // Para fichas con pocas reseñas (<= 30), 1 sola queja de 1★ tumba de inmediato el promedio.
    // Para fichas masivas (> 30), calculamos el golpe de una racha negativa (el número de quejas de 1★ necesarias para bajar al menos -0.1★)
    let badReviewsSimulated = 1;
    let simulatedNewRating = effectiveRating;
    let simulatedDrop = 0.1;

    if (isLowReviewProfile) {
      badReviewsSimulated = 1;
      const rawNew = ((effectiveRating * safeTotalReviews) + 1.0) / (safeTotalReviews + 1);
      simulatedDrop = Math.max(0.1, Math.round((effectiveRating - rawNew) * 10) / 10);
      simulatedNewRating = Math.max(1.0, Math.round((effectiveRating - simulatedDrop) * 10) / 10);
    } else {
      // Número de quejas de 1★ para provocar una caída visible de -0.1★
      simulatedDrop = 0.1;
      badReviewsSimulated = Math.max(2, Math.ceil((0.1 * safeTotalReviews) / Math.max(0.1, effectiveRating - 1.1)));
      simulatedNewRating = Math.max(1.0, Math.round((effectiveRating - 0.1) * 10) / 10);
    }

    const ratingAfterOneStar = simulatedNewRating;
    const dropWithOneStar = simulatedDrop;

    const targetRecovery = Math.min(4.9, Math.max(4.5, effectiveRating));
    const recoveryDenom = Math.max(0.1, 5.0 - targetRecovery);
    const rawReviewsToRecover = Math.ceil((targetRecovery - 1.0) / recoveryDenom);
    // Para fichas pequeñas (ej: 5 reseñas), 1 o 2 reseñas de 5★ bastan para recuperar el promedio
    const fiveStarReviewsToRecover = isLowReviewProfile
      ? Math.max(1, Math.min(6, Math.ceil(safeTotalReviews * 0.4)))
      : Math.min(40, Math.max(4, rawReviewsToRecover));

    // Riesgo de reseñas públicas de 1★ a 3★ en Google Maps (Harvard Business School / Spiegel Research):
    // Sin software proactivo como Prestigia, solo entre el 1.5% y el 2.5% de los clientes insatisfechos se toma el trabajo de abrir Google Maps para castigar al negocio.
    // Además, modulamos la proyección de forma realista según la madurez histórica de la ficha (totalReviews):

    // Tasa base de insatisfechos que publican en Google Maps (~1.5% a 2.5% según déficit de estrellas)
    const organicUnhappyReviewRate = Math.min(0.035, Math.max(0.015, 0.015 + ratingDeficit * 0.008));
    const potentialAnnualNegative = Math.round(yearlyUnhappyClients * organicUnhappyReviewRate);

    let projectedNegativeReviewsYearly: number;
    let projectedNegativeReviewsMonthly: number;
    let negativeReviewsDisplay: string;
    let negativeReviewsBadge: string;
    let negativeReviewsContext: string;

    const isEn = lang === 'en';

    if (isLowReviewProfile) {
      // Fichas pequeñas / con poco historial (ej: 5 reseñas): las quejas son esporádicas pero mortales.
      // Proyectamos entre 1 y 3 al año como máximo histórico verosímil
      projectedNegativeReviewsYearly = Math.max(1, Math.min(3, Math.ceil(totalReviews * 0.3) || 1));
      projectedNegativeReviewsMonthly = Math.round((projectedNegativeReviewsYearly / 12) * 10) / 10;
      negativeReviewsDisplay = isEn 
        ? `~${projectedNegativeReviewsYearly} ${projectedNegativeReviewsYearly === 1 ? '1★ review' : '1★ reviews'}/yr`
        : `~${projectedNegativeReviewsYearly} ${projectedNegativeReviewsYearly === 1 ? 'reseña 1★' : 'reseñas 1★'}/año`;
      negativeReviewsBadge = isEn ? 'Imminent Threat' : 'Peligro Inminente';
      const impactPercent = Math.round((1 / (Math.max(1, totalReviews) + 1)) * 100);
      negativeReviewsContext = isEn
        ? `With only ${totalReviews} cumulative public reviews, your listing lacks defensive mass: just 1 single 1★ review represents a ${impactPercent}% blow to overall reputation, sinking your rating to ${ratingAfterOneStar}★ and turning away up to 30 potential new clients every month.`
        : `Con solo ${totalReviews} opiniones acumuladas, tu ficha carece de volumen defensivo: 1 sola queja de 1★ representa un golpe del ${impactPercent}% a tu reputación, tumbando tu promedio a ${ratingAfterOneStar}★ y alejando hasta 30 nuevos clientes potenciales por mes.`;
    } else {
      // Fichas medianas y grandes con historial consolidado
      projectedNegativeReviewsYearly = Math.max(2, potentialAnnualNegative);
      projectedNegativeReviewsMonthly = Math.max(1, Math.round(projectedNegativeReviewsYearly / 12));
      negativeReviewsBadge = isEn ? 'Public Poison' : 'Veneno Público';
      if (projectedNegativeReviewsMonthly >= 2) {
        negativeReviewsDisplay = isEn 
          ? `~${projectedNegativeReviewsMonthly} 1★ reviews/mo`
          : `~${projectedNegativeReviewsMonthly} reseñas 1★/mes`;
        negativeReviewsContext = isEn
          ? `Without an active private shield, furious guests vent publicly on Google Maps (~${projectedNegativeReviewsYearly} complaints per year). Every 1★ review deters up to 30 potential local buyers.`
          : `Sin un escudo, los clientes furiosos se desahogan públicamente en Google Maps (~${projectedNegativeReviewsYearly} quejas al año). Cada reseña de 1★ aleja hasta 30 nuevos clientes potenciales en tu zona.`;
      } else {
        negativeReviewsDisplay = isEn
          ? `~${projectedNegativeReviewsYearly} 1★ reviews/yr`
          : `~${projectedNegativeReviewsYearly} reseñas 1★/año`;
        negativeReviewsContext = isEn
          ? `Without an active shield, dissatisfied guests publish permanent complaints on Google Maps (~${projectedNegativeReviewsYearly} complaints per year), silently driving away prospective buyers.`
          : `Sin un escudo, clientes insatisfechos publican quejas que quedan grabadas de por vida en Google Maps (~${projectedNegativeReviewsYearly} quejas al año), alejando silenciosamente a clientes potenciales.`;
      }
    }

    // Pérdida financiera por clientes que no vuelven (Churn)
    // En promedio, un cliente recurrente perdido representa 4 visitas o recompras al año
    const safeTicket = averageTicket ?? 0;
    const lostAnnualVisitsPerUnhappyClient = 4;
    const yearlyFinancialLeakage = monthlyUnhappyClients * safeTicket * lostAnnualVisitsPerUnhappyClient;
    const monthlyFinancialLeakage = Math.round(yearlyFinancialLeakage / 12);

    // IMPACTO CON PRESTIGIA:
    // 1. Escudo Privado: 92% de quejas interceptadas y resueltas en WhatsApp antes de tocar Google
    const shieldedComplaintsMonthly = Math.round(monthlyUnhappyClients * 0.92);
    const shieldedComplaintsYearly = shieldedComplaintsMonthly * 12;

    // 2. Dinero protegido / salvado por retención de clientes:
    // De la fuga anual calculada en el diagnóstico, el Escudo Privado intercepta el 92% y recupera al 65% de esos clientes.
    const moneySavedYearly = Math.round(yearlyFinancialLeakage * 0.92 * 0.65);
    const moneySavedMonthly = Math.round(moneySavedYearly / 12);

    // 3. Acelerador 5★ en Google Maps (8% de clientes convierten a 5★ con sorteo y QR)
    const newPositiveReviewsMonthly = Math.max(4, Math.round(totalDinersMonth * 0.08));
    const newPositiveReviews90Days = newPositiveReviewsMonthly * 3;
    const currentTotalStars = (effectiveRating > 0 ? effectiveRating : 4.0) * Math.max(1, totalReviews);
    const projectedTotalReviews90Days = Math.max(1, totalReviews) + newPositiveReviews90Days;
    
    // Weighted math for projected rating in 90 days
    const projectedRatingIn90Days = Math.min(
      4.9,
      Math.round(
        (((currentTotalStars) + (5.0 * newPositiveReviews90Days)) /
          projectedTotalReviews90Days) *
          10
      ) / 10
    );
    const totalReviewsIn1Year = totalReviews + newPositiveReviewsMonthly * 12;

    // 4. Clientes nuevos por posicionamiento Top 3 Google Maps (+8% de clientes adicionales por conquistar el Local 3-Pack)
    const newClientsFromGoogleMonthly = Math.max(1, Math.round(totalDinersMonth * 0.08));
    const newRevenueFromGoogleYearly = newClientsFromGoogleMonthly * safeTicket * 12;

    // 5. Base de Datos / WhatsApp VIP capturados con sorteo legal (~25% de clientes se registran)
    const contactsCapturedMonthly = Math.round(totalDinersMonth * 0.25);
    const contactsCapturedYearly = contactsCapturedMonthly * 12;

    // 6. Beneficio Total Anual vs Costo del Sistema
    const totalAnnualFinancialBenefit = moneySavedYearly + newRevenueFromGoogleYearly;

    // Costo estimado de Prestigia Plan Empresarial por sede
    const prestigiaCostPerBranchMonth = currency === 'COP' ? 199000 : currency === 'USD' ? 59 : currency === 'MXN' ? 990 : 55;
    const totalPrestigiaAnnualCost = prestigiaCostPerBranchMonth * branchesCount * 12;

    // ROI Multiplier
    const roiMultiplier = Math.max(
      2,
      Math.round((totalAnnualFinancialBenefit / Math.max(1, totalPrestigiaAnnualCost)) * 10) / 10
    );

    // 7. DIAGNÓSTICO DE ABANDONO REPUTACIONAL Y CLIENTES RECUPERABLES (HISTÓRICO GOOGLE MAPS)
    // Conteo exacto de reseñas de la ficha según distribución forense de Google:
    const actual1Star = starDistribution[1]?.count || 0;
    const actual2Star = starDistribution[2]?.count || 0;
    const actual3Star = starDistribution[3]?.count || 0;
    const actual4Star = starDistribution[4]?.count || 0;
    const actual5Star = starDistribution[5]?.count || 0;
    const actualNegativeTotal = actual1Star + actual2Star; // Total real de quejas críticas en Google (1-2★)
    const actualRescuableTotal = actual1Star + actual2Star + actual3Star; // Total real de quejas y opiniones tibias (1-3★)
    const actualPositiveTotal = actual4Star + actual5Star; // Total real de elogios en Google (4-5★)

    // Tasa estándar de desatención/abandono: en LatAm el ~68% de las reseñas nunca reciben respuesta oficial.
    // Para fichas con pocas reseñas (<= 10), si hay quejas negativas y la nota es < 4.8, se calcula con base al total real
    const abandonmentRate = totalReviews > 0 ? (totalReviews <= 5 ? 0.80 : 0.68) : 0;
    const estimatedUnansweredReviewsTotal = Math.min(
      totalReviews,
      Math.max(actualNegativeTotal > 0 ? actualNegativeTotal : 1, Math.round(totalReviews * abandonmentRate))
    );

    // Semáforo de clientes recuperables (números exactos y consistentes con totalReviews):
    // 🔴 1-2★ (Peligro público activo / Quejas críticas sin responder):
    // Nunca puede ser mayor que actualNegativeTotal ni menor a 1 si existen quejas reales de 1★/2★
    const estimatedUnansweredNegative = Math.min(
      actualNegativeTotal,
      Math.max(
        actualNegativeTotal > 0 ? (actualNegativeTotal <= 3 ? actualNegativeTotal : Math.round(actualNegativeTotal * 0.85)) : 0,
        0
      )
    );

    // 🟡 3★ (Clientes tibios rescatables):
    // Nunca puede ser mayor que actual3Star
    const estimatedUnanswered3Star = Math.min(
      actual3Star,
      Math.max(
        actual3Star > 0 ? (actual3Star <= 2 ? actual3Star : Math.round(actual3Star * 0.75)) : 0,
        0
      )
    );

    // Grupo completo rescatable (1★ a 3★ sin responder):
    const estimatedUnansweredRescuable = estimatedUnansweredNegative + estimatedUnanswered3Star;

    // 🟢 4-5★ (Agradecimientos ignorados / Clientes VIP descuidados):
    const remainingUnanswered = Math.max(0, estimatedUnansweredReviewsTotal - estimatedUnansweredNegative - estimatedUnanswered3Star);
    const estimatedUnansweredPositive = Math.min(actualPositiveTotal, remainingUnanswered);

    // Simulación del salto inmediato al desescalar y recuperar quejas pasadas:
    // Base de opiniones rescatables (1★ a 3★)
    const rescuableBaseForRecovery = Math.max(
      0,
      estimatedUnansweredRescuable > 0 ? estimatedUnansweredRescuable : estimatedUnansweredNegative
    );

    // Cantidad de quejas convertidas a 5★ según el porcentaje del slider:
    // Para bases pequeñas (1 a 4 quejas), el slider escala progresivamente desde 1 hasta el total.
    let recoveredNegativeCount: number;
    if (rescuableBaseForRecovery <= 0) {
      recoveredNegativeCount = 0;
    } else if (rescuableBaseForRecovery <= 3) {
      // 10% -> 1 queja | 25% -> proporcional | 50% -> rescata el 100% de quejas
      const step = (rescuableBaseForRecovery - 1) / 40;
      recoveredNegativeCount = Math.min(
        rescuableBaseForRecovery,
        Math.max(1, Math.round(1 + (unansweredRecoveryRate - 10) * step))
      );
    } else {
      recoveredNegativeCount = Math.min(
        rescuableBaseForRecovery,
        Math.max(1, Math.round(rescuableBaseForRecovery * (unansweredRecoveryRate / 100)))
      );
    }
    
    // Matriz matemática exacta del salto de nota si esas quejas pasan a 5★ (o se rectifican):
    // Tomamos la suma real de estrellas de las 5 categorías:
    const totalExistingStars =
      actual1Star * 1 +
      actual2Star * 2 +
      actual3Star * 3 +
      actual4Star * 4 +
      actual5Star * 5;

    // Convertimos de peor a mejor: primero las de 1★ (ganancia neta +4★), luego 2★ (+3★), luego 3★ (+2★):
    let remainingToConvert = recoveredNegativeCount;
    let netStarsGain = 0;

    // 1. Rescatar quejas de 1★ -> suben a 5★ (+4 estrellas cada una)
    const convertedFrom1 = Math.min(actual1Star, remainingToConvert);
    netStarsGain += convertedFrom1 * 4;
    remainingToConvert -= convertedFrom1;

    // 2. Rescatar quejas de 2★ -> suben a 5★ (+3 estrellas cada una)
    if (remainingToConvert > 0) {
      const convertedFrom2 = Math.min(actual2Star, remainingToConvert);
      netStarsGain += convertedFrom2 * 3;
      remainingToConvert -= convertedFrom2;
    }

    // 3. Rescatar quejas de 3★ -> suben a 5★ (+2 estrellas cada una)
    if (remainingToConvert > 0) {
      const convertedFrom3 = Math.min(actual3Star, remainingToConvert);
      netStarsGain += convertedFrom3 * 2;
      remainingToConvert -= convertedFrom3;
    }

    // Si por alguna razón la distribución forense no tuviera datos, usamos fallback proporcional (+3.8★ de media):
    if (totalExistingStars === 0 || netStarsGain === 0) {
      netStarsGain = recoveredNegativeCount * 3.8;
    }

    const baseStars = totalExistingStars > 0 ? totalExistingStars : (effectiveRating * safeTotalReviews);
    const immediateJumpRating = Math.min(
      5.0,
      Math.max(
        effectiveRating,
        Math.round(((baseStars + netStarsGain) / safeTotalReviews) * 10) / 10
      )
    );
    const immediateRatingDelta = Math.max(0, Math.round((immediateJumpRating - effectiveRating) * 10) / 10);

    const activeTitle =
      allBranches.length === 1
        ? businessName || 'Tu Marca'
        : isGlobal
        ? `${businessName || 'La Marca'} (Consolidado ${allBranches.length} Sedes)`
        : activeBranch.name;

    return {
      isGlobal,
      hasMultipleBranches: allBranches.length > 1,
      activeTitle,
      branchesCount,
      totalDinersMonth,
      totalDinersYear,
      totalStaffCount,
      totalReviews,
      effectiveRating,
      monthlyUnhappyClients,
      yearlyUnhappyClients,
      silentUnhappyMonthly,
      projectedNegativeReviewsMonthly,
      projectedNegativeReviewsYearly,
      isLowReviewProfile,
      negativeReviewsDisplay,
      negativeReviewsBadge,
      negativeReviewsContext,
      monthlyFinancialLeakage,
      yearlyFinancialLeakage,
      shieldedComplaintsMonthly,
      shieldedComplaintsYearly,
      moneySavedYearly,
      moneySavedMonthly,
      newPositiveReviewsMonthly,
      newClientsFromGoogleMonthly,
      newRevenueFromGoogleYearly,
      projectedRatingIn90Days,
      totalReviewsIn1Year,
      ratingAfterOneStar,
      dropWithOneStar,
      badReviewsSimulated,
      fiveStarReviewsToRecover,
      contactsCapturedMonthly,
      contactsCapturedYearly,
      totalAnnualFinancialBenefit,
      totalPrestigiaAnnualCost,
      roiMultiplier,
      // Abandono Reputacional & Clientes Recuperables
      abandonmentRate,
      actual1Star,
      actual2Star,
      actual3Star,
      actual4Star,
      actual5Star,
      actualNegativeTotal,
      actualPositiveTotal,
      actualRescuableTotal,
      estimatedUnansweredReviewsTotal,
      estimatedUnansweredNegative,
      estimatedUnanswered3Star,
      estimatedUnansweredPositive,
      estimatedUnansweredRescuable,
      recoveredNegativeCount,
      immediateJumpRating,
      immediateRatingDelta,
      safeTicket,
    };
  }, [
    allBranches,
    selectedReportView,
    businessName,
    averageTicket,
    currency,
    starDistribution,
    unansweredRecoveryRate,
    lang,
  ]);

  // Deterministic number formatter (prevents Next.js / React SSR hydration mismatch)
  const fmtNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Format currency helpers
  const fmtMoney = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined || isNaN(amount)) return `${currencyConfig.symbol}0`;
    return `${currencyConfig.symbol}${fmtNumber(amount)}`;
  };

  // Dynamic Live QR Demo modal and link
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoQrDataUrl, setDemoQrDataUrl] = useState<string>('');
  const [demoCopied, setDemoCopied] = useState(false);

  const demoTargetUrl = useMemo(() => {
    if (typeof window === 'undefined') return '/r/demo';
    const origin = window.location.origin;
    const brandParam = encodeURIComponent(businessName.trim() || 'Tu Negocio');
    const catParam = encodeURIComponent(category);
    const branchParam = encodeURIComponent(calculations.activeTitle);
    const addrParam = encodeURIComponent(mainAddress || 'Sede Principal');
    const gUrlParam = encodeURIComponent(mainGoogleUrl || 'https://google.com');

    return `${origin}/r/demo?name=${brandParam}&category=${catParam}&branch=${branchParam}&address=${addrParam}&googleUrl=${gUrlParam}`;
  }, [businessName, category, calculations.activeTitle, mainAddress, mainGoogleUrl]);

  useEffect(() => {
    if (typeof window !== 'undefined' && demoTargetUrl) {
      QRCode.toDataURL(demoTargetUrl, {
        width: 320,
        margin: 2,
        color: { dark: '#020617', light: '#ffffff' },
      })
        .then((url) => setDemoQrDataUrl(url))
        .catch((err) => console.error('Error generating QR:', err));
    }
  }, [demoTargetUrl]);

  // WhatsApp share builder
  const generateWhatsAppMessage = () => {
    const brandLabel = businessName || 'Tu Marca';
    const text = `📊 *AUDITORÍA Y DIAGNÓSTICO DE REPUTACIÓN PRESTIGIA*
🏢 *Marca:* ${brandLabel}
📍 *Alcance del Reporte:* ${calculations.activeTitle}
⭐ *Calificación Google Maps Actual:* ${calculations.effectiveRating}★ (${calculations.totalReviews} opiniones acumuladas)

🚨 *LOS 4 DOLORES DETECTADOS (DIAGNÓSTICO EN VIVO):*
1️⃣ *El Costo del Silencio:* ~${calculations.monthlyUnhappyClients} clientes al mes sufren inconformidades y el 96% se va en silencio sin regresar.
2️⃣ *Riesgo en Google:* ${calculations.negativeReviewsDisplay} amenazan la reputación pública de la ficha sin un escudo.
⚠️ *ALERTA CRÍTICA:* Con solo 1 queja de 1★, la calificación cae a ${calculations.ratingAfterOneStar}★ (-${calculations.dropWithOneStar}★) y se necesitarán +${calculations.fiveStarReviewsToRecover} clientes de 5★ seguidos solo para recuperarse.
3️⃣ *Fuga Financiera Anual:* La marca deja escapar aprox. *${fmtMoney(calculations.yearlyFinancialLeakage)}/año* en comensales perdidos.
4️⃣ *Ceguera Operativa:* Sin trazabilidad individual del desempeño de los ${calculations.totalStaffCount} colaboradores.

🛡️ *LA CURA CON EL SISTEMA PRESTIGIA:*
✅ *Escudo Anti-Reseñas Privado:* 92% de quejas contenidas en privado directo al WhatsApp del encargado en < 15 seg.
✅ *Acelerador & Blindaje Continuo 5★:* Subida proyectada a *${calculations.projectedRatingIn90Days}★ en 90 días* + blindaje mensual permanente para defender el Local 3-Pack ante la Ley de Recencia de Google.
✅ *Base de Datos VIP Legal:* +${fmtNumber(calculations.contactsCapturedMonthly)} números de WhatsApp capturados al mes con sorteos oficiales bajo Habeas Data.
✅ *Auditoría de Colaboradores:* Calificación directa a los colaboradores con Wallboard TV en tiempo real.

📈 *BENEFICIO FINANCIERO ANUAL PROYECTADO:*
💰 Beneficio Económico Total: *${fmtMoney(calculations.totalAnnualFinancialBenefit)}/año*
(Entre clientes retenidos en privado y nuevas ventas de Google Maps).

🔒 *ACUERDO DE BLINDAJE ANUAL (12 MESES):*
Infraestructura permanente de protección de reputación, conquista del Top 3 de Google y retención activa de clientes.

_Asesor Comercial: Luisma • Director de Crecimiento & Blindaje Reputacional • Prestigia Enterprise LatAm_`;

    return encodeURIComponent(text);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="auditor-root-container min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white print:min-h-0 print:h-auto print:bg-white print:text-slate-900 print:m-0 print:p-0">
      {/* Global Print Styles - 100% White Paper Corporate Dossier (Zero Backgrounds) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            margin: 10mm 12mm !important;
            size: A4 portrait;
          }
          
          /* 1. Global Reset: PURE WHITE, ZERO BACKGROUNDS, ZERO GRADIENTS */
          *, *::before, *::after {
            background-color: transparent !important;
            background-image: none !important;
            box-shadow: none !important;
            text-shadow: none !important;
            filter: none !important;
            backdrop-filter: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          html, body, .auditor-root-container, main {
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            min-height: 0 !important;
            height: auto !important;
            font-size: 10pt !important;
          }

          /* 2. FORCE NO BACKGROUNDS ON ALL TAILWIND COLOR UTILITIES */
          [class*="bg-slate-"],
          [class*="bg-rose-"],
          [class*="bg-red-"],
          [class*="bg-amber-"],
          [class*="bg-emerald-"],
          [class*="bg-indigo-"],
          [class*="bg-purple-"],
          [class*="bg-teal-"],
          [class*="bg-gradient-"] {
            background-color: #ffffff !important;
            background-image: none !important;
          }

          /* 3. CARDS & SECTIONS: CRISP SUBTLE BORDERS */
          section, article, .p-6, .p-5, [class*="rounded-3xl"] {
            background-color: #ffffff !important;
            border: 1px solid #cbd5e1 !important;
            border-radius: 10px !important;
          }

          [class*="border-slate-"],
          [class*="border-rose-"],
          [class*="border-red-"],
          [class*="border-amber-"],
          [class*="border-emerald-"],
          [class*="border-indigo-"],
          [class*="border-purple-"] {
            border-color: #cbd5e1 !important;
          }

          /* 4. Typography: pure dark slate / black, crystal clear */
          h1, h2, h3, h4, h5, h6, strong, b, .font-black, .font-extrabold {
            color: #0f172a !important;
          }
          p, span, div, li, td, th {
            color: #1e293b !important;
          }
          .text-white, [class*="text-slate-1"], [class*="text-slate-2"], [class*="text-slate-3"], [class*="text-slate-4"], [class*="text-slate-5"] {
            color: #0f172a !important;
          }
          .bg-clip-text {
            -webkit-background-clip: unset !important;
            background-clip: unset !important;
            -webkit-text-fill-color: initial !important;
            color: #0f172a !important;
          }

          /* 5. Numbers: vivid clean text colors ONLY (zero background tint) */
          .text-rose-200, .text-rose-300, .text-rose-400, .text-rose-500, .text-rose-600, .text-red-400, .text-red-500, .text-red-600 {
            color: #dc2626 !important;
          }
          .text-emerald-200, .text-emerald-300, .text-emerald-400, .text-emerald-500, .text-emerald-600 {
            color: #16a34a !important;
          }
          .text-amber-200, .text-amber-300, .text-amber-400, .text-amber-500, .text-amber-600 {
            color: #d97706 !important;
          }
          .text-indigo-200, .text-indigo-300, .text-indigo-400, .text-purple-400 {
            color: #4f46e5 !important;
          }

          /* 6. Spacing & Avoid Orphaned Cuts */
          section, .print-avoid-break, .print-card-avoid, table, tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-bottom: 3mm !important;
          }
          .space-y-4, .space-y-5, .space-y-6, .space-y-8 {
            margin-top: 0 !important;
          }

          /* 7. Corporate Table Formatting */
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          th, td {
            border: 1px solid #cbd5e1 !important;
            padding: 6px 8px !important;
            color: #0f172a !important;
            background-color: #ffffff !important;
          }
          th {
            background-color: #f8fafc !important;
            font-weight: 700 !important;
          }

          /* 8. Hide interactive buttons and screen-only controls */
          header, footer, nav, button, input, textarea, select, .print-hidden, [class*="print:hidden"] {
            display: none !important;
          }
        }
      ` }} />

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/portal" className="flex items-center gap-2 group">
            <PrestigiaIcon className="w-8 h-8 transition transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-widest text-white">PRESTIGIA</span>
              <span className="text-[10px] text-amber-400 font-bold tracking-wider uppercase">Business Auditor & ROI</span>
            </div>
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-[11px] font-bold">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{t.headerSub}</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs font-bold">
            {(['es', 'en'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => changeLang(l)}
                className={`px-2.5 py-1 rounded-lg uppercase transition cursor-pointer ${
                  lang === l
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs font-bold">
            {(['COP', 'USD', 'MXN', 'EUR'] as const).map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => handleCurrencyChange(curr)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  currency === curr
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition shadow-md shadow-amber-500/10 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.printPdf}</span>
          </button>
        </div>
      </header>

      {/* Embedded Print Engine Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { margin: 0 !important; size: A4 portrait !important; }
          *, *:before, *:after { box-sizing: border-box !important; overflow: visible !important; }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: #020617 !important;
            color: #FFFFFF !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            width: 100% !important;
          }
          header, footer, aside, nav, .no-print, button, input, select, .print-hidden {
            display: none !important;
          }
          .print-avoid-break, .print-card-avoid, table, tr {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          .print-sheet,
          .\print\:print-sheet {
            page-break-after: always !important;
            break-after: page !important;
            padding: 8mm 10mm !important;
            width: 100% !important;
            box-sizing: border-box !important;
            background-color: #020617 !important;
          }
          .print-sheet-last,
          .\print\:print-sheet-last {
            page-break-after: auto !important;
            break-after: auto !important;
            padding: 8mm 10mm !important;
            width: 100% !important;
            box-sizing: border-box !important;
            background-color: #020617 !important;
          }
        }
      `}} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8 print:max-w-none print:p-0 print:m-0 print:space-y-0">
        {/* PAGE 1: PORTADA EJECUTIVA Y FICHA PRINCIPAL */}
        <div className={`space-y-6 print:space-y-2 print:print-sheet ${auditDisplayMode === 'executive' ? 'print:hidden' : ''}`}>
          {/* Print-only Executive Header */}
          <div className="hidden print:flex items-center justify-between pb-1.5 border-b border-slate-800/80 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
            <div className="flex items-center gap-2">
              <PrestigiaIcon className="w-4 h-4 text-indigo-400" />
              <span className="text-white">PRESTIGIA REPUTATION SYSTEM</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400">ESTUDIO DE INTELIGENCIA COMERCIAL</span>
            </div>
            <div>
              <span>EXPEDIENTE OFICIAL • CONFIDENCIAL B2B</span>
            </div>
          </div>

          {/* HERO TITLE & PRESENTATION */}
          <section className="text-center max-w-4xl mx-auto pt-2 pb-4 print:pt-0 print:pb-1">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-3 print:mb-1 print:gap-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 print:px-2 print:py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs print:text-[10px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 print:w-3 print:h-3 text-amber-400" />
                <span>{lang === 'en' ? 'Commercial Intelligence Study vs Google & Local Competition' : 'Estudio de Inteligencia Comercial Frente a Google & Competencia Local'}</span>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 print:px-2 print:py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs print:text-[10px] font-bold shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 print:w-3 print:h-3 text-emerald-400" />
                <span>{lang === 'en' ? 'Complimentary Audit • Valued at $500 USD' : 'Auditoría de Cortesía • Valorado en $500 USD'}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl print:text-xl print:leading-tight font-black text-white tracking-tight leading-tight">
              {lang === 'en' ? (
                <>
                  Commercial <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-400 to-amber-200 print:text-amber-400 print:bg-none">Vulnerability Diagnostic</span> and <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 print:text-emerald-400 print:bg-none">Customer Retention</span> with Prestigia
                </>
              ) : (
                <>
                  Diagnóstico de <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-400 to-amber-200 print:text-amber-400 print:bg-none">Vulnerabilidad de tu Marca</span> y <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 print:text-emerald-400 print:bg-none">Retención de Clientes</span> con Prestigia
                </>
              )}
            </h1>
            <p className="mt-3 print:mt-1 text-sm sm:text-base print:text-[11px] print:leading-normal text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {lang === 'en' 
                ? 'An official audit on how your business ranks against the Google Maps algorithm, your local area competitors, and the guests leaking silently out your back door.'
                : 'Una radiografía oficial sobre el posicionamiento de tu negocio frente al algoritmo de Google Maps, tu competencia en la zona y los clientes que pierdes en silencio. Un estudio estratégico de alto nivel que cualquier consultor cobraría y que Prestigia te entrega sin costo.'}
            </p>
          </section>

        {/* STEP 1: FICHA PRINCIPAL DE LA MARCA (SEDE 1 O MARCA ÚNICA) */}
        <section className={`bg-slate-900/90 border border-slate-800 rounded-3xl print:rounded-2xl p-5 sm:p-8 print:p-3 shadow-2xl relative overflow-hidden backdrop-blur-xl space-y-6 print:space-y-2 ${auditDisplayMode === 'executive' ? 'print:hidden' : ''}`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500" />

          {/* Header of Section 1 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 print:gap-1 pb-4 print:pb-1.5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 print:w-5 print:h-5 rounded-full bg-indigo-600 text-white text-xs print:text-[10px] font-black flex items-center justify-center">1</span>
                <h2 className="text-lg sm:text-xl print:text-sm font-extrabold text-white">
                  {t.step1Title}
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1 print:hidden">
                {t.step1Sub}
              </p>
            </div>
            {hasScannedMain && (
              <span className="px-3 py-1 print:px-2 print:py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs print:text-[10px] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 print:w-3 print:h-3 text-emerald-400" />
                <span>{t.verifiedCard}</span>
              </span>
            )}
          </div>

          {/* GOOGLE MAPS AUTO-SCANNER INPUT BAR */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner space-y-3 print:hidden">
            <label className="text-xs font-black text-slate-200 flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-400" />
              <span>{t.searchLabel}</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={mainGoogleUrl}
                  onChange={(e) => setMainGoogleUrl(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition"
                />
              </div>
              <button
                type="button"
                onClick={() => handleScanMainGoogle()}
                disabled={isScanningMain}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 text-white font-black text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 shrink-0 cursor-pointer"
              >
                {isScanningMain ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t.scanning}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>{t.scanLive}</span>
                  </>
                )}
              </button>
            </div>

            {mainScanMessage && (
              <div
                className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  mainScanSuccess
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {mainScanSuccess ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span className="font-semibold">{mainScanMessage}</span>
                </div>
                {mainAddress && mainScanSuccess && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 border border-emerald-500/30 text-[11px] text-emerald-200 shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{lang === 'en' ? 'Location:' : 'Ubicación:'} <strong className="text-white">{mainAddress}</strong></span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* BASIC BRAND & OPERATIONAL FIELDS */}
          <div className="pt-3 border-t border-slate-800 space-y-3 print:hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                  {t.opParamsTitle}
                </span>
                <span className="text-xs font-bold text-white">
                  {lang === 'en' ? `Live Data: ${businessName || 'Brand'}` : `Datos Reales de ${businessName || 'la Marca'}`}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                {t.opParamsSub}
              </span>
            </div>

            {/* Fila 1: Datos de la Marca y Sector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Business Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{t.brandNameLabel}</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder={t.brandNamePlaceholder}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{t.categoryLabel}</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Gastrobar / Restaurante">{lang === 'en' ? 'Gastrobar / Restaurant' : 'Gastrobar / Restaurante'}</option>
                  <option value="Logística / Envíos / Mensajería">{lang === 'en' ? 'Logistics / Courier / Shipping' : 'Logística / Envíos / Mensajería'}</option>
                  <option value="Servicios Profesionales / B2B">{lang === 'en' ? 'Professional Services / B2B' : 'Servicios Profesionales / B2B'}</option>
                  <option value="Discoteca / Club">{lang === 'en' ? 'Nightclub / Lounge' : 'Discoteca / Club'}</option>
                  <option value="Cafetería / Panadería">{lang === 'en' ? 'Café / Bakery' : 'Cafetería / Panadería'}</option>
                  <option value="Hotelería / Hospedaje">{lang === 'en' ? 'Hotel / Hospitality' : 'Hotelería / Hospedaje'}</option>
                  <option value="Estética / Belleza / Spa">{lang === 'en' ? 'Beauty / Aesthetics / Spa' : 'Estética / Belleza / Spa'}</option>
                  <option value="Salud / Consultorios">{lang === 'en' ? 'Healthcare / Clinics' : 'Salud / Consultorios'}</option>
                  <option value="Retail / Comercio">{lang === 'en' ? 'Retail / Commerce' : 'Retail / Comercio'}</option>
                </select>
              </div>
            </div>

            {/* Fila 2: Los 3 Parámetros Operativos Obligatorios */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              {/* Monthly Clients / Diners */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{categoryTerms.clientsMonthLabel}</span>
                  </span>
                  {mainMonthlyDiners !== null && mainMonthlyDiners > 0 ? (
                    <span className="text-emerald-400 font-black">{fmtNumber(mainMonthlyDiners)}</span>
                  ) : (
                    <span className="text-amber-400 font-bold text-[10px] bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                      {t.requiredBadge}
                    </span>
                  )}
                </label>
                <div className="relative flex items-center rounded-xl bg-slate-900 border border-slate-700/80 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/40 transition">
                  <input
                    type="number"
                    min="1"
                    step="50"
                    value={mainMonthlyDiners ?? ''}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === '') setMainMonthlyDiners(null);
                      else {
                        const parsed = parseInt(raw, 10);
                        setMainMonthlyDiners(isNaN(parsed) ? null : Math.max(0, parsed));
                      }
                    }}
                    placeholder="Ej: 1400"
                    className="w-full bg-transparent px-3 py-2 text-white text-xs font-semibold focus:outline-none placeholder:text-slate-600"
                  />
                  <div className="flex flex-col border-l border-slate-800 pr-1 shrink-0">
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setMainMonthlyDiners((prev) => Math.max(50, (prev ?? 0) + 50))}
                      className="p-0.5 text-slate-400 hover:text-emerald-400 rounded transition cursor-pointer"
                      title={t.increase}
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setMainMonthlyDiners((prev) => Math.max(0, (prev ?? 50) - 50))}
                      className="p-0.5 text-slate-400 hover:text-emerald-400 rounded transition cursor-pointer"
                      title={t.decrease}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Staff Count */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{categoryTerms.staffLabel}</span>
                  </span>
                  {mainStaffCount !== null && mainStaffCount > 0 ? (
                    <span className="text-indigo-400 font-black">{mainStaffCount}</span>
                  ) : (
                    <span className="text-amber-400 font-bold text-[10px] bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                      {t.requiredBadge}
                    </span>
                  )}
                </label>
                <div className="relative flex items-center rounded-xl bg-slate-900 border border-slate-700/80 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/40 transition">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={mainStaffCount ?? ''}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === '') setMainStaffCount(null);
                      else {
                        const parsed = parseInt(raw, 10);
                        setMainStaffCount(isNaN(parsed) ? null : Math.max(1, parsed));
                      }
                    }}
                    placeholder={lang === 'en' ? 'E.g., 8' : 'Ej: 8'}
                    className="w-full bg-transparent px-3 py-2 text-white text-xs font-semibold focus:outline-none placeholder:text-slate-600"
                  />
                  <div className="flex flex-col border-l border-slate-800 pr-1 shrink-0">
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setMainStaffCount((prev) => Math.max(1, (prev ?? 0) + 1))}
                      className="p-0.5 text-slate-400 hover:text-indigo-400 rounded transition cursor-pointer"
                      title={t.increase}
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setMainStaffCount((prev) => Math.max(1, (prev ?? 2) - 1))}
                      className="p-0.5 text-slate-400 hover:text-indigo-400 rounded transition cursor-pointer"
                      title={t.decrease}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Average Ticket Card */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                    <span>{categoryTerms.ticketLabel}</span>
                  </span>
                  {averageTicket !== null && averageTicket > 0 ? (
                    <span className="text-amber-400 font-black">{fmtMoney(averageTicket)}</span>
                  ) : (
                    <span className="text-amber-400 font-bold text-[10px] bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                      {t.requiredBadge}
                    </span>
                  )}
                </label>
                <div className="relative flex items-center rounded-xl bg-slate-900 border border-slate-700/80 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/40 transition">
                  <input
                    type="number"
                    min="1"
                    step={currency === 'COP' ? 5000 : 1}
                    value={averageTicket ?? ''}
                    placeholder={currency === 'COP' ? 'Ej: 45000' : 'Ej: 25'}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === '') setAverageTicket(null);
                      else {
                        const parsed = parseInt(raw, 10);
                        setAverageTicket(isNaN(parsed) ? null : Math.max(1, parsed));
                      }
                    }}
                    className="w-full bg-transparent px-3 py-2 text-white text-xs font-semibold focus:outline-none placeholder:text-slate-600"
                  />
                  <div className="flex flex-col border-l border-slate-800 pr-1 shrink-0">
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setAverageTicket((prev) => Math.max(1, (prev ?? 0) + (currency === 'COP' ? 5000 : 1)))}
                      className="p-0.5 text-slate-400 hover:text-amber-400 rounded transition cursor-pointer"
                      title={t.increase}
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setAverageTicket((prev) => Math.max(0, (prev ?? 0) - (currency === 'COP' ? 5000 : 1)))}
                      className="p-0.5 text-slate-400 hover:text-amber-400 rounded transition cursor-pointer"
                      title={t.decrease}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PRINT-ONLY EXECUTIVE OPERATIONAL SUMMARY */}
          <div className="hidden print:grid grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">{lang === 'en' ? 'Brand & Sector' : 'Marca & Sector'}</span>
              <strong className="text-white text-sm block truncate">{businessName || (lang === 'en' ? 'Main Brand' : 'Marca Principal')}</strong>
              <span className="text-indigo-400 text-[10px] block font-semibold truncate">{category}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">{categoryTerms.clientLabel}/{lang === 'en' ? 'Mo' : 'Mes'}</span>
              <strong className="text-emerald-400 text-sm block">{mainMonthlyDiners ? fmtNumber(mainMonthlyDiners) : '—'}</strong>
              <span className="text-slate-400 text-[10px] block truncate">{categoryTerms.clientsMonthLabel}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">{lang === 'en' ? 'Average Ticket' : 'Ticket Promedio'}</span>
              <strong className="text-amber-400 text-sm block">{averageTicket ? fmtMoney(averageTicket) : '—'}</strong>
              <span className="text-slate-400 text-[10px] block">{lang === 'en' ? 'per ticket' : 'por consumo'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">{lang === 'en' ? 'Staff on Shift' : 'Personal en Turno'}</span>
              <strong className="text-indigo-300 text-sm block">{mainStaffCount ?? 0} {lang === 'en' ? 'staff members' : 'colaboradores'}</strong>
              <span className="text-slate-400 text-[10px] block truncate">{categoryTerms.staffLabel}</span>
            </div>
          </div>

          {/* GOOGLE PROFILE METRICS & TICKET */}
          <div className="pt-4 border-t border-slate-800 space-y-3 print:pt-2 print:space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                  {lang === 'en' ? 'Detected Google Maps Listing Metrics' : 'Métricas Detectadas de la Ficha de Google Maps'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                  {hasScannedMain 
                    ? (lang === 'en' ? '✓ Verified Listing Live' : '✓ Ficha Verificada en Vivo') 
                    : (lang === 'en' ? 'Awaiting Analysis' : 'Esperando Análisis')}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'en' ? 'Unalterable Public Google Data' : 'Datos Públicos Inalterables de Google'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 print:grid-cols-12 gap-4 print:gap-2.5">
              {/* Col 1: Calificación General y Estado Google (5 cols en lg y print) */}
              <div className="lg:col-span-5 print:col-span-5 p-5 print:p-2.5 rounded-2xl print:rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4 print:space-y-1.5 relative overflow-hidden">
                <div className="space-y-3 print:space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs print:text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                      <Star className="w-4 h-4 print:w-3 print:h-3 text-amber-400 fill-amber-400" />
                      <span>{lang === 'en' ? 'Official Google Rating' : 'Calificación Oficial Google'}</span>
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">Google Local 3-Pack</span>
                  </div>

                  <div className="flex items-baseline gap-3 print:gap-2">
                    <span className="text-4xl sm:text-5xl print:text-2xl font-black text-amber-400 tracking-tight">
                      {mainRating !== null ? `${mainRating}` : '—'}
                    </span>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-amber-400 text-base print:text-xs">
                        {'★'.repeat(Math.min(5, Math.max(1, Math.round(mainRating ?? 4))))}
                        {'☆'.repeat(Math.max(0, 5 - Math.min(5, Math.max(1, Math.round(mainRating ?? 4)))))}
                      </div>
                      <p className="text-xs print:text-[10px] font-bold text-indigo-300">
                        {mainReviews !== null 
                          ? `${fmtNumber(mainReviews)} ${lang === 'en' ? 'public reviews' : 'opiniones públicas'}` 
                          : (lang === 'en' ? 'No data' : 'Sin datos')}
                      </p>
                    </div>
                  </div>

                  {/* Diagnóstico Reputacional */}
                  {mainRating !== null && (
                    <div className="pt-1 print:pt-0">
                      {mainRating >= 4.5 ? (
                        <div className="p-2.5 print:p-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-[11px] print:text-[9.5px] text-emerald-300 flex items-center gap-2 font-medium">
                          <CheckCircle2 className="w-4 h-4 print:w-3.5 print:h-3.5 text-emerald-400 shrink-0" />
                          <span>
                            <strong>{lang === 'en' ? 'Strong Reputation:' : 'Reputación Fuerte:'}</strong>{' '}
                            {lang === 'en' 
                              ? 'Well positioned to dominate local Top 3 if recency is maintained.' 
                              : 'Apta para dominar el Top 3 local si mantiene recencia continua.'}
                          </span>
                        </div>
                      ) : mainRating >= 4.0 ? (
                        <div className="p-2.5 print:p-1.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-[11px] print:text-[9.5px] text-amber-300 flex items-center gap-2 font-medium">
                          <AlertTriangle className="w-4 h-4 print:w-3.5 print:h-3.5 text-amber-400 shrink-0" />
                          <span>
                            <strong>{lang === 'en' ? 'Medium Vulnerability:' : 'Vulnerabilidad Media:'}</strong>{' '}
                            {lang === 'en'
                              ? `At ${mainRating}★ a single negative review can push you off the local podium.`
                              : `Con ${mainRating}★ una sola reseña negativa puede sacarlo del podio local.`}
                          </span>
                        </div>
                      ) : (
                        <div className="p-2.5 print:p-1.5 rounded-xl bg-rose-950/70 border border-rose-500/50 text-[11px] print:text-[9.5px] text-rose-300 flex items-center gap-2 font-medium">
                          <ShieldAlert className="w-4 h-4 print:w-3.5 print:h-3.5 text-rose-400 shrink-0" />
                          <span>
                            <strong>{lang === 'en' ? 'Critical Alert:' : 'Alerta Crítica:'}</strong>{' '}
                            {lang === 'en'
                              ? 'Below 4.0★ Google diverts up to 70% of potential traffic to competitors.'
                              : 'Por debajo de 4.0★ Google desvía hasta el 70% del tráfico a la competencia.'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {mainAddress && (
                    <div className="text-[11px] print:text-[9.5px] text-slate-400 flex items-center gap-1.5 pt-1 print:pt-0">
                      <MapPin className="w-3.5 h-3.5 print:w-3 print:h-3 text-amber-400 shrink-0" />
                      <span className="truncate">{mainAddress}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Col 2: GRÁFICO FORENSE DE RESEÑAS POR ESTRELLA (7 cols en lg y print) */}
              <div className="lg:col-span-7 print:col-span-7 p-5 print:p-2.5 rounded-2xl print:rounded-xl bg-slate-950 border border-slate-800 space-y-3.5 print:space-y-1 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 print:w-3.5 print:h-3.5 text-amber-400" />
                      <span className="text-xs print:text-[10px] font-black uppercase tracking-wider text-slate-200">
                        {lang === 'en' ? 'Forensic Review Distribution by Star' : 'Distribución Forense de Reseñas por Estrella'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {mainReviews ? `${fmtNumber(mainReviews)} ${lang === 'en' ? 'analyzed' : 'analizadas'}` : (lang === 'en' ? 'No data' : 'Sin datos')}
                    </span>
                  </div>

                  {/* Barras de 5 a 1 Estrella */}
                  <div className="space-y-2 print:space-y-0.5 pt-2 print:pt-0.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const data = starDistribution[star as keyof typeof starDistribution] as { count: number; pct: number };
                      const isDanger = star <= 2;
                      const isNeutral = star === 3;
                      const barColor =
                        star === 5
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                          : star === 4
                          ? 'bg-gradient-to-r from-teal-500 to-teal-400'
                          : star === 3
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                          : star === 2
                          ? 'bg-gradient-to-r from-orange-500 to-orange-400'
                          : 'bg-gradient-to-r from-rose-600 to-rose-500 shadow-sm shadow-rose-500/40';

                      return (
                        <div key={star} className="flex items-center gap-2.5 print:gap-1.5 text-xs print:text-[10px]">
                          {/* Etiqueta de Estrella */}
                          <div className="w-11 print:w-8 font-bold flex items-center justify-end gap-1 shrink-0 text-slate-300">
                            <span>{star}</span>
                            <Star className={`w-3 h-3 print:w-2.5 print:h-2.5 ${isDanger ? 'text-rose-400 fill-rose-400' : isNeutral ? 'text-amber-400 fill-amber-400' : 'text-amber-400 fill-amber-400'}`} />
                          </div>

                          {/* Contenedor de Barra */}
                          <div className="flex-1 h-3 print:h-1.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden relative">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                              style={{ width: `${Math.max(data?.pct ? 3 : 0, data?.pct || 0)}%` }}
                            />
                          </div>

                          {/* Porcentaje y Conteo */}
                          <div className="w-24 print:w-20 flex items-center justify-between text-[11px] print:text-[9.5px] shrink-0 font-semibold">
                            <span className={`${isDanger && data?.count > 0 ? 'text-rose-400 font-black' : 'text-slate-300'}`}>
                              {data?.pct || 0}%
                            </span>
                            <span className={`text-[10px] print:text-[8.5px] ${isDanger && data?.count > 0 ? 'text-rose-300 font-bold bg-rose-950/80 px-1.5 py-0.2 rounded border border-rose-500/30' : 'text-slate-500'}`}>
                              {fmtNumber(data?.count || 0)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Métricas Inferiores de Impacto */}
                <div className="pt-3 print:pt-1 border-t border-slate-800/80 grid grid-cols-2 gap-2 print:gap-1.5 text-xs">
                  <div className="p-2 print:p-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                    <span className="text-[11px] print:text-[9.5px] text-emerald-300 font-bold flex items-center gap-1.5">
                      <ThumbsUp className="w-3.5 h-3.5 print:w-3 print:h-3 text-emerald-400" />
                      <span>{lang === 'en' ? 'Promoters (4-5★)' : 'Promotores (4-5★)'}</span>
                    </span>
                    <span className="font-black text-emerald-400 text-xs print:text-[10px]">
                      {starDistribution.promotersPct}%
                    </span>
                  </div>

                  <div className="p-2 print:p-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between">
                    <span className="text-[11px] print:text-[9.5px] text-rose-300 font-bold flex items-center gap-1.5">
                      <ThumbsDown className="w-3.5 h-3.5 print:w-3 print:h-3 text-rose-400" />
                      <span>{lang === 'en' ? 'Detractors (1-2★)' : 'Detractores (1-2★)'}</span>
                    </span>
                    <span className="font-black text-rose-400 text-xs print:text-[10px]">
                      {starDistribution.detractorsCount} ({starDistribution.detractorsPct}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SUPER AUDITOR: DIAGNÓSTICO TÉCNICO SEO LOCAL & ALGORITMO GOOGLE MAPS      */}
            {/* ========================================================================= */}
            {hasScannedMain && (
              <div className="pt-5 border-t border-slate-800 space-y-4 animate-in fade-in duration-300">
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#0B0F19] via-[#101827] to-[#0D1526] border-2 border-indigo-500/40 shadow-2xl relative overflow-hidden">
                  {/* Glow accents */}
                  <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Header */}
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-indigo-400" />
                          <span>PRESTIGIA RADAR 360° • AUDITORÍA SEO LOCAL & FICHA GOOGLE</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          ⚡ Escaneo del Algoritmo Local de Google
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                        {lang === 'en' ? 'Google Maps Technical SEO & Algorithmic Health' : 'Salud Técnica de Ficha & Algoritmo de Google Maps'}
                      </h3>
                      <p className="text-xs text-slate-400 max-w-2xl">
                        {lang === 'en'
                          ? 'Deep audit of the 7 factors that determine whether Google places this business in the Local 3-Pack or hides it behind competitors.'
                          : 'Auditoría de los 7 factores técnicos que determinan si Google posiciona este local en el Top 3 de tu ciudad o si lo invisibiliza ante la competencia.'}
                      </p>
                    </div>

                    {/* Global Score Gauge */}
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 shrink-0 shadow-inner">
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-slate-800"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className={
                              (mainSeoAudit?.score ?? 58) >= 80
                                ? 'text-emerald-500'
                                : (mainSeoAudit?.score ?? 58) >= 60
                                ? 'text-amber-500'
                                : 'text-rose-500'
                            }
                            strokeDasharray={`${mainSeoAudit?.score ?? 58}, 100`}
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-lg font-black text-white leading-none">
                            {mainSeoAudit?.score ?? 58}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 leading-none">/ 100</span>
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          {lang === 'en' ? 'Profile Health' : 'Calificación Técnica'}
                        </span>
                        <span
                          className={`text-xs font-black block ${
                            (mainSeoAudit?.score ?? 58) >= 80
                              ? 'text-emerald-400'
                              : (mainSeoAudit?.score ?? 58) >= 60
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {(mainSeoAudit?.score ?? 58) >= 80
                            ? (lang === 'en' ? 'Optimized (Top Tier)' : 'Ficha Optimizada')
                            : (mainSeoAudit?.score ?? 58) >= 60
                            ? (lang === 'en' ? 'At Risk (-45% Views)' : 'En Riesgo (-45% Vistas)')
                            : (lang === 'en' ? 'Critical Penalty' : 'Estado Crítico / Invisible')}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {lang === 'en' ? 'Google Local Algorithm' : 'Algoritmo Local de Google'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Banner */}
                  <div className="relative z-10 my-4">
                    <div
                      className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-bold ${
                        (mainSeoAudit?.score ?? 58) >= 80
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                          : (mainSeoAudit?.score ?? 58) >= 60
                          ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                          : 'bg-rose-950/50 border-rose-500/40 text-rose-300'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>
                        {mainSeoAudit?.statusLabel ||
                          '🟡 Ficha en Riesgo: Visibilidad Reducida al 45% frente a la Competencia'}
                      </span>
                    </div>
                  </div>

                  {/* Grid of 4 Technical Diagnostic Pillars */}
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pillar 1: Subcategorías Ocultas (The Trojan Horse Goldmine) */}
                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-200 flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-indigo-400" />
                          <span>1. Categoría Principal & Subcategorías Faltantes</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                          Factor Clave #1
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-[11px]">Categoría activa en Maps:</span>
                          <span className="font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 text-[11px]">
                            ✓ {mainSeoAudit?.primaryCategory || category}
                          </span>
                        </div>
                        <div className="space-y-1 pt-1">
                          <span className="text-[11px] font-bold text-rose-300 block">
                            ❌ Subcategorías secundarias no configuradas (Desaprovechadas):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {(mainSeoAudit?.missingCategories || [
                              'Restaurante familiar',
                              'Bar y parrilla',
                              'Comida para llevar',
                              'Entrega a domicilio',
                              'Restaurante para almorzar',
                            ]).map((sc, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/50 text-rose-300 border border-rose-500/30"
                              >
                                + {sc}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-[10.5px] text-slate-400 pt-1 leading-relaxed">
                          Google permite hasta 10 categorías en cada ficha. Al dejar las subcategorías vacías, este negocio queda <strong>100% invisible</strong> cuando un cliente busca esos términos en Google Maps.
                        </p>
                      </div>
                    </div>

                    {/* Pillar 2: Title & Geo-Keywords (SEO Local) */}
                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-200 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          <span>2. Optimización de Título (SEO Local)</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          Score: {mainSeoAudit?.titleAudit?.score ?? 55} / 100
                        </span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Título actual en Google:</span>
                          <span className="font-mono font-bold text-slate-300 text-[11px] block">{businessName || 'Nombre del Negocio'}</span>
                        </div>
                        <p className="text-[10.5px] text-slate-400 leading-relaxed">
                          {mainSeoAudit?.titleAudit?.analysis ||
                            'El título solo tiene el nombre comercial plano. Pierde miles de búsquedas mensuales sin intención geográfica ni palabra clave del nicho.'}
                        </p>
                        <div className="p-2.5 rounded-xl bg-indigo-950/50 border border-indigo-500/30 space-y-1">
                          <span className="text-[10px] font-black uppercase text-indigo-300 block">💡 Título Optimizado Recomendado:</span>
                          <span className="font-mono text-[11px] font-bold text-indigo-200 block">
                            {mainSeoAudit?.titleAudit?.suggestedTitle || `${businessName} | ${category} en tu Ciudad`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pillar 3: Description & Bio Indexing */}
                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-200 flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-purple-400" />
                          <span>3. Biografía y Descripción Corporativa</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                          750 Caracteres
                        </span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px]">
                          <span className="text-slate-400">Estado de indexación:</span>
                          <span className="font-bold text-rose-400">
                            {mainSeoAudit?.descriptionAudit?.status === 'optimized' ? '✓ Optimizada' : '❌ Vacía o Deficiente'}
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-400 leading-relaxed">
                          {mainSeoAudit?.descriptionAudit?.analysis ||
                            'No se detectó biografía corporativa en Google Maps. Estás desperdiciando los 750 caracteres que la IA de Google lee para posicionar y recomendar tu negocio a turistas y clientes.'}
                        </p>
                        <div className="text-[10.5px] text-indigo-300 font-semibold flex items-center gap-1">
                          <span>✦ Solución Prestigia: Redactamos la descripción con keywords de compra.</span>
                        </div>
                      </div>
                    </div>

                    {/* Pillar 4: Channels & Conversion Links */}
                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-200 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-teal-400" />
                          <span>4. Canales de Conversión & Respuesta</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30">
                          Factor de Ranking
                        </span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{mainSeoAudit?.linksAndConversion?.hasWebsite ? '✓ Web Vinculada' : '❌ Sin Web Oficial'}</span>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                            <PhoneCall className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{mainSeoAudit?.contactAudit?.hasPhone ? '✓ Teléfono Activo' : '❌ Sin Teléfono'}</span>
                          </div>
                        </div>
                        <p className="text-[10.5px] text-slate-400 leading-relaxed">
                          {mainSeoAudit?.reviewsEngagement?.analysis ||
                            'Google prioriza perfiles que responden el 100% de reseñas en menos de 24 horas. Los negocios con reseñas abandonadas sufren penalización de posición en el mapa.'}
                        </p>
                        <div className="p-2 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-[10.5px] text-emerald-300 font-bold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Prestigia activa la respuesta oficial en 1-Clic para salvar el ranking.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Plan de Acción Inmediato (Prestigia Boost) */}
                  <div className="relative z-10 mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="space-y-0.5 text-center sm:text-left">
                      <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1 justify-center sm:justify-start">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span>Plan de Aceleración Prestigia Boost</span>
                      </span>
                      <p className="text-xs font-bold text-white">
                        Implementando estos 4 ajustes, este negocio puede escalar al Top 3 de Google Maps en 14 días.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/25 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Potencial: +45% Visitas Locales</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* UNLOCK ACTION CARD (REQUERIDO PARA REPORTE REAL) */}
            <div className="pt-4 border-t border-slate-800 print:hidden">
              {!isReportUnlocked ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-amber-500/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                        {lang === 'en' 
                          ? 'Mandatory Step: Validate Parameters to Unlock Study' 
                          : 'Paso Obligatorio: Valida los Parámetros para Desbloquear el Estudio'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                      {mainRating !== null ? (
                        lang === 'en' ? (
                          <>
                            Google has verified <strong className="text-amber-300">{mainRating}★</strong> and <strong className="text-indigo-300">{mainReviews} reviews</strong>. Confirm your monthly {categoryTerms.clientLabel.toLowerCase()} above (<strong className="text-emerald-300">{mainMonthlyDiners !== null ? fmtNumber(mainMonthlyDiners) : 'Pending'}</strong>) and average ticket (<strong className="text-amber-300">{averageTicket !== null ? fmtMoney(averageTicket) : 'Pending'}</strong>) to calculate real financial leakage.
                          </>
                        ) : (
                          <>
                            Google ya verificó <strong className="text-amber-300">{mainRating}★</strong> y <strong className="text-indigo-300">{mainReviews} opiniones</strong>. Confirma arriba tus {categoryTerms.clientLabel.toLowerCase()}/mes (<strong className="text-emerald-300">{mainMonthlyDiners !== null ? fmtNumber(mainMonthlyDiners) : 'Pendiente'}</strong>) y ticket promedio (<strong className="text-amber-300">{averageTicket !== null ? fmtMoney(averageTicket) : 'Pendiente'}</strong>) para calcular la fuga financiera con datos 100% reales.
                          </>
                        )
                      ) : (
                        lang === 'en' ? (
                          <>
                            Enter the Google Maps link above and configure your monthly {categoryTerms.clientLabel.toLowerCase()} and average ticket to calculate financial leakage with 100% real data.
                          </>
                        ) : (
                          <>
                            Ingresa el enlace de Google Maps arriba y define tus {categoryTerms.clientLabel.toLowerCase()}/mes y ticket promedio para calcular la fuga financiera con datos 100% reales.
                          </>
                        )
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={!isOperationalDataValid}
                    onClick={() => {
                      if (isOperationalDataValid) {
                        setIsReportUnlocked(true);
                      }
                    }}
                    className={`px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm transition flex items-center gap-2 shrink-0 shadow-xl ${
                      isOperationalDataValid
                        ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 text-slate-950 hover:scale-[1.02] shadow-amber-500/20 active:scale-95 cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    {isOperationalDataValid ? (
                      <>
                        <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                        <span>{lang === 'en' ? 'Validate Data & Unlock Live Study' : 'Validar Datos y Desbloquear Estudio Real'}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-slate-500" />
                        <span>{lang === 'en' ? 'Fill out all 3 fields to unlock' : 'Completa los 3 campos para desbloquear'}</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong>{lang === 'en' ? 'Commercial Intelligence Study Unlocked:' : 'Estudio de Inteligencia Comercial Desbloqueado:'}</strong>{' '}
                      {lang === 'en'
                        ? `Calculated with verified Google data and operational volume from ${businessName} (${fmtNumber(mainMonthlyDiners)} ${categoryTerms.clientLabel.toLowerCase()}/mo at ${fmtMoney(averageTicket)}).`
                        : `Calculado con datos verificados de Google y parámetros reales de ${businessName} (${fmtNumber(mainMonthlyDiners)} ${categoryTerms.clientLabel.toLowerCase()}/mes a ${fmtMoney(averageTicket)}).`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsReportUnlocked(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-[11px] font-bold transition shrink-0 cursor-pointer"
                  >
                    {lang === 'en' ? 'Adjust Parameters' : 'Reajustar Parámetros'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
        </div>

        {/* STEP 1.B: AGREGAR SEDES ADICIONALES (OPCIONAL PARA CADENAS) */}
        <section className={`bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-4 ${additionalBranches.length === 0 || auditDisplayMode === 'executive' ? 'print:hidden' : ''}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  {lang === 'en' ? 'Does this brand have additional locations? (Optional)' : '¿Esta marca cuenta con más sedes? (Opcional)'}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'en'
                  ? 'If this is a chain or multi-location franchise, add them here with their Google Maps profile. If single location, leave blank.'
                  : 'Si es una cadena o franquicia con más ubicaciones, agrégalas aquí con su respectiva ficha de Google Maps. Si es de 1 sola sede, déjalo vacío.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddBranch}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'en' ? '+ Add Location' : 'Agregar Sede Adicional'}</span>
            </button>
          </div>

          {/* List of Additional Branches */}
          {additionalBranches.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
              {additionalBranches.map((branch, idx) => (
                <div
                  key={branch.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-3 relative hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-black flex items-center justify-center shrink-0">
                        {idx + 2}
                      </span>
                      <input
                        type="text"
                        value={branch.name}
                        onChange={(e) => handleUpdateBranch(branch.id, { name: e.target.value })}
                        className="bg-transparent text-sm font-extrabold text-white border-b border-transparent hover:border-slate-700 focus:border-amber-400 focus:outline-none px-1 py-0.5 w-full"
                        placeholder={lang === 'en' ? 'Location name (e.g., North Branch)...' : 'Nombre de esta sede (ej: Sede Norte)...'}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBranch(branch.id)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded-lg hover:bg-slate-900 transition"
                      title={lang === 'en' ? 'Delete location' : 'Eliminar esta sede'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <Search className="w-3 h-3 text-amber-400" />
                        <span>{lang === 'en' ? 'Google Maps listing for this location:' : 'Ficha Google Maps de esta Sede:'}</span>
                      </span>
                      {branch.scanSuccess && (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {lang === 'en' ? 'Verified Listing' : 'Ficha Verificada'}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={branch.googleUrl}
                        onChange={(e) => handleUpdateBranch(branch.id, { googleUrl: e.target.value })}
                        placeholder={lang === 'en' ? 'Paste Google Maps link for this branch...' : 'Pega enlace de Google Maps de esta sede...'}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => handleScanAdditionalBranch(branch.id)}
                        disabled={branch.isScanning}
                        className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {branch.isScanning ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Zap className="w-3.5 h-3.5 text-amber-300" />
                        )}
                        <span>{branch.isScanning ? (lang === 'en' ? 'Scanning...' : 'Escaneando...') : (lang === 'en' ? 'Scan' : 'Escanear')}</span>
                      </button>
                    </div>

                    {branch.scanMessage && (
                      <div
                        className={`text-[11px] p-2 rounded-lg border flex items-center gap-1.5 ${
                          branch.scanSuccess
                            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                            : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                        }`}
                      >
                        <span>{branch.scanMessage}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-850">
                    <div className="p-2 rounded-xl bg-slate-900/80 border border-amber-500/30">
                      <div className="text-[10px] text-slate-400 flex items-center justify-between">
                        <span>{lang === 'en' ? 'Rating' : 'Calificación'}</span>
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      </div>
                      <div className="text-sm font-black text-amber-400 mt-0.5">{branch.rating} ★</div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-900/80 border border-indigo-500/30">
                      <div className="text-[10px] text-slate-400 flex items-center justify-between">
                        <span>{lang === 'en' ? 'Reviews' : 'Opiniones'}</span>
                        <MessageCircle className="w-3 h-3 text-indigo-400" />
                      </div>
                      <div className="text-sm font-black text-indigo-300 mt-0.5">{branch.reviewsCount}</div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-[10px] text-slate-400">{categoryTerms.clientsMonthLabel}</div>
                      <div className="flex items-center justify-between mt-0.5">
                        <input
                          type="number"
                          min="100"
                          step="50"
                          value={branch.monthlyDiners}
                          onChange={(e) =>
                            handleUpdateBranch(branch.id, { monthlyDiners: parseInt(e.target.value, 10) || 0 })
                          }
                          className="w-full bg-transparent text-sm font-black text-emerald-400 focus:outline-none"
                        />
                        <div className="flex flex-col shrink-0 pl-1">
                          <button
                            type="button"
                            tabIndex={-1}
                            onClick={() =>
                              handleUpdateBranch(branch.id, { monthlyDiners: Math.max(50, branch.monthlyDiners + 50) })
                            }
                            className="text-slate-500 hover:text-emerald-400 transition cursor-pointer"
                            title={lang === 'en' ? 'Increase' : 'Aumentar'}
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            tabIndex={-1}
                            onClick={() =>
                              handleUpdateBranch(branch.id, { monthlyDiners: Math.max(50, branch.monthlyDiners - 50) })
                            }
                            className="text-slate-500 hover:text-emerald-400 transition cursor-pointer"
                            title={lang === 'en' ? 'Decrease' : 'Disminuir'}
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-[10px] text-slate-400">{lang === 'en' ? 'Staff' : 'Colaboradores'}</div>
                      <div className="flex items-center justify-between mt-0.5">
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={branch.staffCount}
                          onChange={(e) =>
                            handleUpdateBranch(branch.id, { staffCount: parseInt(e.target.value, 10) || 0 })
                          }
                          className="w-full bg-transparent text-sm font-black text-indigo-400 focus:outline-none"
                        />
                        <div className="flex flex-col shrink-0 pl-1">
                          <button
                            type="button"
                            tabIndex={-1}
                            onClick={() =>
                              handleUpdateBranch(branch.id, { staffCount: Math.max(1, branch.staffCount + 1) })
                            }
                            className="text-slate-500 hover:text-indigo-400 transition cursor-pointer"
                            title="Aumentar"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            tabIndex={-1}
                            onClick={() =>
                              handleUpdateBranch(branch.id, { staffCount: Math.max(1, branch.staffCount - 1) })
                            }
                            className="text-slate-500 hover:text-indigo-400 transition cursor-pointer"
                            title="Disminuir"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* REPORT SECTION (ONLY DISPLAYED ONCE BRAND IS SCANNED OR DIAGNOSTIC TRIGGERED) */}
        {!isAuditReady ? (
          <section className="bg-slate-900/60 border-2 border-dashed border-slate-800 rounded-3xl p-8 sm:p-14 text-center space-y-6 backdrop-blur-xl relative overflow-hidden print:hidden">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
              {hasScannedMain || mainRating !== null ? (
                <Lock className="w-8 h-8 text-amber-400" />
              ) : (
                <Search className="w-8 h-8 text-amber-400" />
              )}
            </div>

            <div className="max-w-xl mx-auto space-y-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/40">
                {hasScannedMain || mainRating !== null
                  ? (lang === 'en' ? '🔒 Protected Study • Operational Validation Required' : '🔒 Estudio Protegido • Requiere Validación de Operación')
                  : (lang === 'en' ? 'Diagnostic Ready to Generate' : 'Diagnóstico Listo para Generarse')}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {hasScannedMain || mainRating !== null
                  ? (lang === 'en' ? `Validate Operational Parameters for ${businessName || 'your Brand'}` : `Valida los Datos Operativos de ${businessName || 'tu Marca'}`)
                  : (lang === 'en' ? 'Awaiting Brand Profile to Calculate Churn & ROI' : 'Esperando Ficha de la Marca para Calcular Pérdidas y ROI')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {hasScannedMain || mainRating !== null ? (
                  lang === 'en' ? (
                    <>
                      Google has verified the public listing (<strong className="text-amber-300">{mainRating}★</strong> and <strong className="text-indigo-300">{mainReviews} reviews</strong>). To ensure financial loss calculations and ROI mirror reality, verify your monthly customers and average ticket above and click <strong className="text-amber-400 font-bold">"Validate Data & Unlock Live Study"</strong>.
                    </>
                  ) : (
                    <>
                      Google ya verificó la ficha pública (<strong className="text-amber-300">{mainRating}★</strong> y <strong className="text-indigo-300">{mainReviews} opiniones</strong>). Para que el cálculo de fuga financiera y el ROI sean 100% exactos a tu realidad, confirma los comensales y el ticket promedio en la sección superior y presiona <strong className="text-amber-400 font-bold">"Validar Datos y Desbloquear Estudio Real"</strong>.
                    </>
                  )
                ) : (
                  lang === 'en' ? (
                    <>
                      Paste the brand's Google Maps link above and click{' '}
                      <strong className="text-amber-400 font-bold">"Analyze Profile Live"</strong> to extract real rating, public reviews, and project customer churn along with ROI using Prestigia.
                    </>
                  ) : (
                    <>
                      Pega el enlace de Google Maps de la marca arriba y presiona{' '}
                      <strong className="text-amber-400 font-bold">"Analizar Ficha en Vivo"</strong> para extraer automáticamente sus estrellas, opiniones públicas y proyectar en tiempo real los clientes en fuga y el retorno con Prestigia.
                    </>
                  )
                )}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              {hasScannedMain || mainRating !== null ? (
                <button
                  type="button"
                  disabled={!isOperationalDataValid}
                  onClick={() => {
                    if (isOperationalDataValid) {
                      setIsReportUnlocked(true);
                    }
                  }}
                  className={`px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-xl transition flex items-center gap-2 cursor-pointer ${
                    isOperationalDataValid
                      ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 text-slate-950 hover:scale-[1.02] active:scale-95'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                  <span>{lang === 'en' ? 'Validate Parameters Above & Unlock Study' : 'Validar Datos Arriba y Desbloquear Reporte'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (mainGoogleUrl.trim()) {
                      handleScanMainGoogle();
                    } else {
                      setMainScanMessage(lang === 'en' ? 'Please paste the Google Maps link in the field above.' : 'Por favor pega el enlace de Google Maps en la casilla superior.');
                      setMainScanSuccess(false);
                    }
                  }}
                  disabled={isScanningMain}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition cursor-pointer flex items-center gap-2"
                >
                  {isScanningMain ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{lang === 'en' ? 'Connecting to Google Maps...' : 'Conectando con Google Maps...'}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>{lang === 'en' ? 'Analyze Google Profile Live' : 'Analizar Ficha de Google en Vivo'}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </section>
        ) : (
          <>
            {/* SELECTOR DE FORMATO DE PRESENTACIÓN (EJECUTIVO VS COMPLETO) */}
            <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden print:hidden">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                        {lang === 'en' ? 'Presentation Format for Meeting' : 'Formato de Presentación para Reunión'}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-white">
                      {auditDisplayMode === 'executive'
                        ? (lang === 'en' ? '⚡ Executive Pitch Mode (3-Minute Quick Closing)' : '⚡ Modo Ejecutivo (Pitch Rápido de 3 Minutos)')
                        : (lang === 'en' ? '🔬 Full 360° Technical Audit Study' : '🔬 Estudio Técnico y Algorítmico 360°')}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 w-full sm:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => setAuditDisplayMode('executive')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      auditDisplayMode === 'executive'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{lang === 'en' ? 'Executive (3 Min)' : '⚡ Resumen Ejecutivo'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuditDisplayMode('complete')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      auditDisplayMode === 'complete'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Full 360° Audit' : '🔬 Auditoría Completa'}</span>
                  </button>
                </div>
              </div>
            </section>

            {/* VISTA 1: MODO EJECUTIVO (PITCH RÁPIDO DE 3 MINUTOS) */}
            {auditDisplayMode === 'executive' ? (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Header Banner */}
                <div className="p-6 print:p-4 rounded-3xl print:rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 print:bg-white print:border print:border-slate-300 border-2 border-amber-500/50 shadow-2xl print:shadow-none flex flex-col md:flex-row items-center justify-between gap-4 print:mb-2 print-avoid-break">
                  <div className="space-y-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 print:bg-amber-600 animate-pulse print:animate-none" />
                      <span className="text-[11px] print:text-[10px] font-black uppercase tracking-wider text-amber-300 print:text-amber-700">
                        {lang === 'en' ? 'Executive Briefing • Prestigia Enterprise' : 'Resumen Estratégico Ejecutivo • Prestigia Enterprise'}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl print:text-base font-black text-white print:text-slate-950">
                      {calculations.activeTitle}: {lang === 'en' ? 'The Cost of Inaction vs Prestigia ROI' : 'Radiografía Rápida de Pérdida vs Retorno'}
                    </h2>
                    <p className="text-xs print:text-[10px] text-slate-300 print:text-slate-600 max-w-xl">
                      {lang === 'en'
                        ? 'The three core numbers every business owner needs to protect revenue and dominate the local map.'
                        : 'Los tres números maestros que todo dueño necesita para detener la fuga de dinero y dominar su ciudad.'}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0 print:hidden">
                    <button
                      type="button"
                      onClick={() => setShowDemoModal(true)}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer active:scale-95"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>{lang === 'en' ? 'Scan Live QR Demo' : 'Escanear Demo QR en Vivo'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
                    >
                      <Printer className="w-4 h-4" />
                      <span>{lang === 'en' ? 'Export PDF' : 'Imprimir / PDF'}</span>
                    </button>
                  </div>
                  <div className="hidden print:flex flex-col items-end text-[10px] text-slate-600">
                    <span className="font-black text-slate-900 text-xs">PRESTIGIA REPUTATION SYSTEM</span>
                    <span className="font-semibold">Expediente Oficial B2B</span>
                    <span className="text-amber-700 font-bold uppercase text-[9px] mt-0.5">Confidencial • Valorado en $500 USD</span>
                  </div>
                </div>

                {/* The 3 Golden Cards of the Executive Pitch */}
                <div className="grid grid-cols-1 lg:grid-cols-3 print:grid-cols-3 gap-5 print:gap-2.5 print:my-1">
                  {/* TARJETA 1: TU RADIOGRAFÍA EN GOOGLE (30 SEGUNDOS) */}
                  <div className="p-6 print:p-3.5 rounded-3xl print:rounded-2xl bg-slate-900/90 print:bg-white border border-slate-800 print:border-slate-300 flex flex-col justify-between space-y-5 print:space-y-3 shadow-xl print:shadow-none relative overflow-hidden group hover:border-slate-700 transition print-avoid-break">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 flex items-center gap-1.5">
                          <span>01. Tu Situación Actual</span>
                        </span>
                        <span className="text-xs font-bold text-slate-400">Google Maps</span>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-slate-400 block mb-1">Calificación y Salud de Ficha</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-black text-amber-400 tracking-tight">
                            {calculations.effectiveRating}★
                          </span>
                          <span className="text-xs font-bold text-slate-400">
                            ({fmtNumber(calculations.totalReviews)} reseñas públicas)
                          </span>
                        </div>
                      </div>

                      {/* Mini Health Bar */}
                      <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-semibold">Salud Algorítmica:</span>
                          <span className={`font-black ${(mainSeoAudit?.score ?? 58) >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {mainSeoAudit?.score ?? 58} / 100
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              (mainSeoAudit?.score ?? 58) >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${mainSeoAudit?.score ?? 58}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-slate-300">
                        <div className="flex items-start gap-2">
                          <span className="text-rose-400 font-black">❌</span>
                          <p className="text-[11.5px] leading-relaxed">
                            <strong>Subcategorías Ocultas:</strong> Faltan subcategorías secundarias en Google Maps, haciéndote invisible para el 50% de búsquedas locales.
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-amber-400 font-black">⚠️</span>
                          <p className="text-[11.5px] leading-relaxed">
                            <strong>Reseñas Vulnerables:</strong> Las quejas de 1★ a 3★ son leídas por nuevos clientes antes de visitarte, desviándolos a la competencia.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500">
                      Diagnóstico público extraído en vivo de Google Maps.
                    </div>
                  </div>

                  {/* TARJETA 2: LA FUGA DE DINERO MENSUAL (EL DOLOR FINANCIERO) */}
                  <div className="p-6 print:p-3.5 rounded-3xl print:rounded-2xl bg-gradient-to-b from-rose-950/40 via-slate-900 to-slate-900 print:bg-white border-2 border-rose-500/40 print:border-slate-300 flex flex-col justify-between space-y-5 print:space-y-3 shadow-2xl print:shadow-none relative overflow-hidden print-avoid-break">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-950 print:bg-white border border-rose-500/40 print:border-slate-300 text-rose-300 print:text-rose-600 flex items-center gap-1.5">
                          <Flame className="w-3 h-3 text-rose-400" />
                          <span>02. Lo Que Pierdes Hoy</span>
                        </span>
                        <span className="text-xs font-bold text-rose-400">Fuga Mensual</span>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-rose-300/80 print:text-slate-600 block mb-1">Pérdida Financiera Estimada</span>
                        <div className="text-3xl sm:text-4xl font-black text-rose-400 tracking-tight">
                          -{fmtMoney(calculations.monthlyFinancialLeakage)}
                          <span className="text-xs font-bold text-rose-300/80 print:text-slate-600 block sm:inline sm:ml-1">/ mes</span>
                        </div>
                        <span className="text-[11px] text-rose-300/60 print:text-slate-500 font-mono block mt-0.5">
                          (-{fmtMoney(calculations.yearlyFinancialLeakage)} al año)
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-rose-950/60 print:bg-white border border-rose-500/30 print:border-slate-200 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-rose-200 print:text-slate-700 font-semibold">{categoryTerms.clientLabel} insatisfechos:</span>
                          <strong className="text-white print:text-slate-950">~{calculations.monthlyUnhappyClients} / mes</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-rose-200 print:text-slate-700 font-semibold">Ticket promedio verificado:</span>
                          <strong className="text-white print:text-slate-950">{fmtMoney(calculations.safeTicket)}</strong>
                        </div>
                        <div className="flex items-center justify-between border-t border-rose-500/30 print:border-slate-200 pt-1.5">
                          <span className="text-rose-200 print:text-slate-700 font-semibold">Visitas perdidas recurrentes:</span>
                          <strong className="text-amber-300 print:text-amber-600">4 recompras / año</strong>
                        </div>
                      </div>

                      <p className="text-[11.5px] text-rose-200/90 print:text-slate-700 leading-relaxed">
                        El 92% de clientes con una mala experiencia <strong>jamás se quejan en el local</strong>: se van en silencio, no vuelven y le avisan a 10 conocidos en Google Maps.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-rose-500/30 print:border-slate-200 text-[11px] text-rose-300/70 print:text-slate-500 font-semibold">
                      Fórmula auditada basada en tu volumen de {fmtNumber(calculations.totalDinersMonth)} {categoryTerms.clientLabel.toLowerCase()}/mes.
                    </div>
                  </div>

                  {/* TARJETA 3: LA SOLUCIÓN Y EL RETORNO (EL CIERRE MAESTRO) */}
                  <div className="p-6 print:p-3.5 rounded-3xl print:rounded-2xl bg-gradient-to-b from-emerald-950/50 via-slate-900 to-slate-900 print:bg-white border-2 border-emerald-500/50 print:border-slate-300 flex flex-col justify-between space-y-5 print:space-y-3 shadow-2xl print:shadow-none relative overflow-hidden print-avoid-break">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-950 print:bg-white border border-emerald-500/40 print:border-slate-300 text-emerald-300 print:text-emerald-700 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>03. Tu Ganancia con Prestigia</span>
                        </span>
                        <span className="text-xs font-bold text-emerald-400">Retorno Neto</span>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-emerald-300/80 print:text-slate-600 block mb-1">Dinero Protegido + Nuevas Ventas</span>
                        <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                          +{fmtMoney(calculations.moneySavedMonthly + Math.round((calculations.newRevenueFromGoogleYearly || 0) / 12))}
                          <span className="text-xs font-bold text-emerald-300/80 print:text-slate-600 block sm:inline sm:ml-1">/ mes</span>
                        </div>
                        <span className="text-[11px] text-emerald-300/70 print:text-slate-500 font-mono block mt-0.5">
                          (+{fmtMoney(calculations.totalAnnualFinancialBenefit)} de beneficio anual)
                        </span>
                      </div>

                      <div className="space-y-2 text-xs text-slate-200">
                        <div className="p-2.5 rounded-xl bg-emerald-950/40 print:bg-white border border-emerald-500/30 print:border-slate-200 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs shrink-0">1</span>
                          <p className="text-[11px] print:text-slate-800">
                            <strong>Bóveda QR en Mesa:</strong> Intercepta el 92% de quejas en caliente y las resuelve por WhatsApp antes de internet.
                          </p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-950/40 print:bg-white border border-emerald-500/30 print:border-slate-200 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs shrink-0">2</span>
                          <p className="text-[11px] print:text-slate-800">
                            <strong>Respuesta IA en 1-Clic:</strong> Responde reseñas públicas con Gemini y recupera al 25% de clientes perdidos.
                          </p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-950/40 print:bg-white border border-emerald-500/30 print:border-slate-200 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs shrink-0">3</span>
                          <p className="text-[11px] print:text-slate-800">
                            <strong>Subida al Top 3:</strong> Tu calificación sube a <strong className="text-amber-300 print:text-amber-600">+{calculations.projectedRatingIn90Days}★</strong> atrayendo clientes nuevos cada semana.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4 border-t border-emerald-500/30 space-y-2 print:hidden">
                      <a
                        href={`https://wa.me/573058314049?text=${encodeURIComponent(
                          `Hola Prestigia, acabo de realizar la auditoría ejecutiva de "${businessName || calculations.activeTitle}". Queremos activar el blindaje reputacional y subir al Top 3 de Google Maps.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/25 hover:scale-[1.02] active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer text-center"
                      >
                        <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                        <span>Activar Protección Prestigia Ahora</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                      <div className="flex items-center justify-center gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowDemoModal(true)}
                          className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
                        >
                          Escanear Demo QR en Vivo
                        </button>
                        <span className="text-slate-600">•</span>
                        <button
                          type="button"
                          onClick={() => setAuditDisplayMode('complete')}
                          className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                        >
                          Ver Auditoría Completa 360°
                        </button>
                      </div>
                    </div>

                    {/* Print-only Executive Agreement block in Card 3 */}
                    <div className="hidden print:block pt-3 border-t border-slate-200 space-y-1.5 text-[10px]">
                      <div className="flex items-center justify-between font-bold text-slate-950">
                        <span>Garantía de Retención B2B</span>
                        <span className="text-emerald-600 font-extrabold">Retorno Estimado +{calculations.roiMultiplier}x</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-slate-200 text-[9.5px] text-slate-800 leading-snug">
                        Blindaje activo de 12 meses: Bóvedas QR en mesa, contención privada por WhatsApp y motor IA de respuesta oficial en Google Maps.
                      </div>
                    </div>
                  </div>
                </div>

                {/* BANNER INTERACTIVO DEMO QR EN VIVO (EL GANCHO PRINCIPAL) */}
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/15 border-2 border-amber-500/50 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden print:hidden">
                  <div className="flex items-center gap-4 text-center md:text-left">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xl shadow-amber-500/30 shrink-0">
                      <QrCode className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center justify-center md:justify-start gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                          {lang === 'en' ? 'Live Interactive Demonstration' : 'Demostración Interactiva en Vivo'}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                        {lang === 'en' ? 'Test the Private Shield live right now with your phone' : 'Comprueba cómo funciona el sistema en vivo con tu celular'}
                      </h3>
                      <p className="text-xs text-slate-300 max-w-xl">
                        {lang === 'en'
                          ? 'Scan the QR code to experience how negative reviews are intercepted via WhatsApp while 5-star reviews go straight to Google Maps.'
                          : 'Escanea el código QR interactivo para ver en caliente cómo una queja de 1★ se intercepta en privado y cómo una opinión de 5★ vuela directo a Google.'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDemoModal(true)}
                    className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/30 cursor-pointer active:scale-95 shrink-0 w-full md:w-auto"
                  >
                    <QrCode className="w-5 h-5" />
                    <span>{lang === 'en' ? 'Scan Live QR Demo' : 'Escanear Demo QR en Vivo'}</span>
                  </button>
                </div>

                {/* Print-only Executive Signature & Contact Footer */}
                <div className="hidden print:flex items-center justify-between pt-3 mt-4 border-t border-slate-300 text-[10px] text-slate-600 print-avoid-break">
                  <div className="space-y-0.5">
                    <span className="font-black text-slate-900 block text-xs">PRESTIGIA REPUTATION PROTECTION LATAM</span>
                    <span className="text-slate-600 block">Soporte y Consultoría Comercial: +57 305 831 4049 • info@prestigia.app</span>
                    <span className="text-slate-500 block text-[9px]">Sede Principal: Medellín / Bogotá • www.prestigia.app</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-bold">Autorización de Implementación</span>
                    <div className="w-52 border-b border-slate-400 pt-3" />
                    <span className="text-[9px] text-slate-500 block">Firma Dirección General / Propietario</span>
                  </div>
                </div>
              </div>
            ) : (
              /* VISTA 2: AUDITORÍA TÉCNICA COMPLETA 360° */
              <div className="space-y-4">
            {/* STEP 2: SELECTOR DE VISTA DE REPORTE (SOLO SI HAY MÁS DE 1 SEDE) */}
            {calculations.hasMultipleBranches && (
          <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                  {lang === 'en' ? 'Diagnostic Segmenter' : 'Segmentador de Diagnóstico'}
                </span>
                <h2 className="text-base sm:text-lg font-black text-white mt-1">
                  {lang === 'en' ? 'Which report would you like to view right now?' : '¿Qué reporte deseas visualizar en este momento?'}
                </h2>
              </div>
              <div className="text-xs text-slate-400 font-semibold">
                {lang === 'en' ? 'Active view:' : 'Vista activa:'} <strong className="text-white">{calculations.activeTitle}</strong>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedReportView('global')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                  selectedReportView === 'global'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Globe className="w-4 h-4 text-amber-300" />
                <span>{lang === 'en' ? `Global Consolidated Report (${allBranches.length} Locations)` : `Reporte Consolidado Global (${allBranches.length} Sedes)`}</span>
              </button>

              {allBranches.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedReportView(b.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    selectedReportView === b.id
                      ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{b.name}</span>
                  <span className="px-1.5 py-0.2 rounded bg-black/20 text-[10px] font-mono">
                    {b.rating}★
                  </span>
                </button>
              ))}
            </div>

            {selectedReportView === 'global' && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{lang === 'en' ? 'Reputational Health Benchmark Across Locations' : 'Comparativa de Salud Reputacional Entre Sedes'}</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-2 font-bold">{lang === 'en' ? 'Location' : 'Sede'}</th>
                        <th className="pb-2 font-bold">{lang === 'en' ? 'Google Rating' : 'Calificación Google'}</th>
                        <th className="pb-2 font-bold">{lang === 'en' ? 'Public Reviews' : 'Reseñas Públicas'}</th>
                        <th className="pb-2 font-bold">{categoryTerms.clientsMonthLabel}</th>
                        <th className="pb-2 font-bold text-rose-400">{lang === 'en' ? 'Estimated Leakage' : 'Fuga Financiera Estimada'}</th>
                        <th className="pb-2 font-bold">{lang === 'en' ? 'Diagnostic' : 'Diagnóstico'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {allBranches.map((b) => {
                        const branchLeakage = Math.round(b.monthlyDiners * 0.045 * (averageTicket ?? 0) * 4);
                        const isVulnerable = b.rating < 4.2;
                        return (
                          <tr key={b.id} className="hover:bg-slate-950/40 transition">
                            <td className="py-2.5 font-bold text-white flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-amber-400" />
                              <span>{b.name}</span>
                            </td>
                            <td className="py-2.5 font-black text-amber-400">{b.rating} ★</td>
                            <td className="py-2.5 text-indigo-300 font-semibold">{b.reviewsCount} {lang === 'en' ? 'reviews' : 'opiniones'}</td>
                            <td className="py-2.5 text-emerald-400 font-bold">{fmtNumber(b.monthlyDiners)}</td>
                            <td className="py-2.5 font-black text-rose-400">{fmtMoney(branchLeakage)}/{lang === 'en' ? 'yr' : 'año'}</td>
                            <td className="py-2.5">
                              {isVulnerable ? (
                                <span className="px-2 py-0.5 rounded-full bg-rose-950 border border-rose-500/40 text-rose-300 text-[10px] font-bold">
                                  {lang === 'en' ? '🔴 High Vulnerability' : '🔴 Alta Vulnerabilidad'}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                                  {lang === 'en' ? '🟢 Healthy (Optimizing)' : '🟢 Favorable (Optimizando)'}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* PAGE 2: DIAGNÓSTICO DE VULNERABILIDAD Y ALERTA ROJA */}
        <div className="space-y-4 print:space-y-2.5 print:print-sheet">
          {/* STEP 3: THE 4 DEADLY PAINS OF THE BRAND (LOS DOLORES MORTALES) */}
          <section className="space-y-4 print:space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-black flex items-center justify-center">{t.step2Badge}</span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                <span>{t.step2Title}</span>
                <span className="text-rose-400 underline decoration-rose-500/40">{calculations.activeTitle}</span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 print:text-[11px]">
              {t.step2Sub}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 print:grid-cols-2 gap-4 print:gap-2.5">
              {/* DOLOR 1: EL COSTO DEL SILENCIO */}
              <div className="p-5 print:p-3 rounded-2xl print:rounded-xl bg-gradient-to-b from-rose-950/40 to-slate-900 border border-rose-500/30 relative overflow-hidden shadow-xl print-card-avoid print:overflow-visible">
                <div className="flex items-center justify-between gap-2 mb-3 print:mb-1">
                  <div className="p-2 print:p-1.5 rounded-xl bg-rose-500/20 text-rose-400">
                    <ShieldAlert className="w-5 h-5 print:w-4 print:h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-950 border border-rose-500/40 text-rose-300">
                    {t.pain1Badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{t.pain1Title}</h3>
                <div className="text-2xl print:text-xl font-black text-rose-400 my-2 print:my-1">
                  ~{calculations.monthlyUnhappyClients} {categoryTerms.clientLabel.toLowerCase()}{lang === 'en' ? '/mo' : '/mes'}
                </div>
                <p className="text-xs print:text-[11px] text-slate-300 leading-relaxed">
                  {t.pain1Text1} <strong className="text-white">{categoryTerms.frictionCauses}</strong>. <strong className="text-white">{t.pain1Text2}</strong> {t.pain1Text3} ({calculations.silentUnhappyMonthly} {t.pain1Text4}
                </p>
              </div>

              {/* DOLOR 2: EL VENENO DE GOOGLE MAPS */}
              <div className="p-5 print:p-3 rounded-2xl print:rounded-xl bg-gradient-to-b from-amber-950/40 to-slate-900 border border-amber-500/30 relative overflow-hidden shadow-xl print-card-avoid print:overflow-visible">
                <div className="flex items-center justify-between gap-2 mb-3 print:mb-1">
                  <div className="p-2 print:p-1.5 rounded-xl bg-amber-500/20 text-amber-400">
                    <Flame className="w-5 h-5 print:w-4 print:h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300">
                    {calculations.negativeReviewsBadge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{t.pain2Title}</h3>
                <div className="text-2xl print:text-xl font-black text-amber-400 my-2 print:my-1">
                  {calculations.negativeReviewsDisplay}
                </div>
                <p className="text-xs print:text-[11px] text-slate-300 leading-relaxed">
                  {calculations.negativeReviewsContext}
                </p>
              </div>

              {/* DOLOR 3: CEGUERA OPERATIVA DE PERSONAL */}
              <div className="p-5 print:p-3 rounded-2xl print:rounded-xl bg-gradient-to-b from-purple-950/40 to-slate-900 border border-purple-500/30 relative overflow-hidden shadow-xl print-card-avoid print:overflow-visible">
                <div className="flex items-center justify-between gap-2 mb-3 print:mb-1">
                  <div className="p-2 print:p-1.5 rounded-xl bg-purple-500/20 text-purple-400">
                    <Users className="w-5 h-5 print:w-4 print:h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300">
                    {t.pain3Badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{t.pain3Title}</h3>
                <div className="text-2xl print:text-xl font-black text-purple-400 my-2 print:my-1">
                  {calculations.totalStaffCount} {categoryTerms.staffLabel.toLowerCase()}
                </div>
                <p className="text-xs print:text-[11px] text-slate-300 leading-relaxed">
                  {lang === 'en' ? (
                    <>Management has no real-time way of knowing <strong className="text-white">which {categoryTerms.staffSingular} ruined the guest experience</strong> during a shift, nor who is excelling to reward them with bonuses.</>
                  ) : (
                    <>La gerencia no tiene forma de saber en tiempo real <strong className="text-white">cuál {categoryTerms.staffSingular} arruinó la experiencia</strong> en un servicio ni cuál está destacando con excelencia para premiarlo con incentivos.</>
                  )}
                </p>
              </div>

              {/* DOLOR 4: FUGA FINANCIERA ANUAL */}
              <div className="p-5 print:p-3 rounded-2xl print:rounded-xl bg-gradient-to-b from-red-950 to-slate-900 border-2 border-red-500/60 relative overflow-hidden shadow-2xl print-card-avoid print:overflow-visible">
                <div className="flex items-center justify-between gap-2 mb-3 print:mb-1">
                  <div className="p-2 print:p-1.5 rounded-xl bg-red-500/20 text-red-400">
                    <DollarSign className="w-5 h-5 print:w-4 print:h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-950 border border-red-500 text-red-200 animate-pulse">
                    {t.pain4Badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{t.pain4Title}</h3>
                <div className="text-xl sm:text-2xl print:text-xl font-black text-red-400 my-2 print:my-1 tracking-tight">
                  {fmtMoney(calculations.yearlyFinancialLeakage)}{lang === 'en' ? '/yr' : '/año'}
                </div>
                <p className="text-xs print:text-[11px] text-slate-300 leading-relaxed">
                  {t.pain4Text1} {categoryTerms.clientLabel.toLowerCase()} {lang === 'en' ? 'who pay but' : 'que pagan pero'} <strong className="text-white">{t.pain4Text2}</strong> (~{fmtMoney(calculations.monthlyFinancialLeakage)}{lang === 'en' ? '/mo leaked).' : '/mes fugados).'}
                </p>
              </div>
            </div>

            {/* GRÁFICO VISUAL: ANÁLISIS FORENSE DE RETENCIÓN & FUGA SILENCIOSA */}
            <div className="print-card-avoid">
              <RetentionDonutChart
                satisfiedCount={Math.max(0, calculations.totalDinersMonth - calculations.monthlyUnhappyClients)}
                unhappyCount={calculations.monthlyUnhappyClients}
                silentUnhappyCount={calculations.silentUnhappyMonthly}
                totalMonthly={calculations.totalDinersMonth}
                clientLabel={categoryTerms.clientLabel}
                lang={lang}
              />
            </div>

            {/* ALERTA DE ALTO IMPACTO: EL EFECTO DEVASTADOR DE 1 SOLA RESEÑA DE 1★ SIN PRESTIGIA */}
            <div className="mt-5 print:mt-2.5 p-5 sm:p-6 print:p-3.5 rounded-3xl print:rounded-2xl bg-gradient-to-br from-red-950/80 via-slate-900 to-rose-950/60 border-2 border-red-500/70 shadow-2xl relative overflow-hidden print-card-avoid print:overflow-visible">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 print:mb-2 border-b border-red-500/20 pb-3.5 print:pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 print:w-8 print:h-8 rounded-2xl print:rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 print:w-4 print:h-4 text-red-400 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-red-300 bg-red-950 px-2.5 py-0.5 rounded-full border border-red-500/40">
                      {t.alertBadge}
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-white mt-1 print:mt-0.5">
                      {t.alertTitle}
                    </h3>
                  </div>
                </div>
                <span className="text-xs print:text-[10px] font-black text-red-400 bg-red-950/90 px-3 py-1.5 print:px-2 print:py-0.5 rounded-xl border border-red-500/40 shrink-0">
                  {t.alertCriticalBadge}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-3.5 print:gap-2 mb-4 print:mb-2">
                {/* Box 1: Caída de Calificación */}
                <div className="p-4 print:p-2.5 rounded-2xl print:rounded-xl bg-slate-950/80 border border-red-500/30 space-y-1.5 print:space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.alertDropLabel}</span>
                  <div className="text-lg sm:text-xl print:text-base font-black text-white flex items-center gap-2">
                    <span className="text-amber-400">{calculations.effectiveRating}★</span>
                    <ArrowRight className="w-4 h-4 print:w-3.5 print:h-3.5 text-red-400 shrink-0" />
                    <span className="text-red-400">{calculations.ratingAfterOneStar}★</span>
                    <span className="text-xs print:text-[10px] text-red-300 font-bold bg-red-950 px-2 py-0.5 rounded-full border border-red-500/40">
                      -{calculations.dropWithOneStar}★
                    </span>
                  </div>
                  <p className="text-[11px] print:text-[10px] text-slate-400 leading-relaxed">
                    {lang === 'en' ? (
                      calculations.isLowReviewProfile ? (
                        <>With only <strong>1 single public complaint</strong>, your global average drops in seconds ({calculations.totalReviews} total reviews).</>
                      ) : (
                        <>A streak of just <strong>{calculations.badReviewsSimulated} unshielded complaints</strong> immediately crashes your official score ({calculations.totalReviews} total reviews).</>
                      )
                    ) : (
                      calculations.isLowReviewProfile ? (
                        <>Con solo <strong>1 queja pública</strong>, tu promedio global cae en segundos ({calculations.totalReviews} opiniones acumuladas).</>
                      ) : (
                        <>Una racha de solo <strong>{calculations.badReviewsSimulated} quejas sin escudo</strong> tumba de inmediato tu calificación oficial ({calculations.totalReviews} opiniones acumuladas).</>
                      )
                    )}
                  </p>
                </div>

                {/* Box 2: Esfuerzo de Recuperación */}
                <div className="p-4 print:p-2.5 rounded-2xl print:rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-1.5 print:space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.alertRecoveryLabel}</span>
                  <div className="text-lg sm:text-xl print:text-base font-black text-amber-400">
                    +{calculations.fiveStarReviewsToRecover} {lang === 'en' ? 'consecutive 5★ reviews' : 'reseñas de 5★'}
                  </div>
                  <p className="text-[11px] print:text-[10px] text-slate-400 leading-relaxed">
                    {lang === 'en' ? (
                      <>Mathematically requires up to <strong>{calculations.fiveStarReviewsToRecover} consecutive happy 5★ guests</strong> just to counteract the damage of a single 1★ review.</>
                    ) : (
                      <>Matemáticamente necesitas hasta <strong>{calculations.fiveStarReviewsToRecover} clientes felices seguidos</strong> de 5★ solo para neutralizar el daño de 1 sola queja de 1★.</>
                    )}
                  </p>
                </div>

                {/* Box 3: El Sesgo de Indignación */}
                <div className="p-4 print:p-2.5 rounded-2xl print:rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 print:space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{lang === 'en' ? 'Outrage Bias' : 'El Sesgo de Indignación'}</span>
                  <div className="text-lg sm:text-xl print:text-base font-black text-rose-300">
                    {lang === 'en' ? '10x More Likely' : '10x Más Probable'}
                  </div>
                  <p className="text-[11px] print:text-[10px] text-slate-400 leading-relaxed">
                    {lang === 'en' ? (
                      <>An angry customer is <strong>10 times more motivated</strong> to post on Google than a satisfied guest. You are 1 guest away from compromising your score.</>
                    ) : (
                      <>Un cliente indignado tiene <strong>10 veces más iniciativa</strong> de escribir en Google que un cliente satisfecho. Estás a 1 cliente de arruinar tu perfil.</>
                    )}
                  </p>
                </div>
              </div>

              <div className="p-3.5 print:p-2.5 rounded-2xl print:rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:gap-2 text-xs print:text-[10px]">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 print:w-4 print:h-4 text-emerald-400 shrink-0" />
                  <span className="text-emerald-200 leading-relaxed">
                    {lang === 'en' ? (
                      <><strong>The Prestigia Antidote:</strong> With the Private Shield active, 1 to 3★ grievances <strong className="text-white">NEVER touch Google Maps</strong>. They route directly in &lt; 15 seconds to management's WhatsApp to de-escalate and save the guest.</>
                    ) : (
                      <><strong>La Vacuna Prestigia:</strong> Con el Escudo Privado activo, las quejas de 1 a 3★ <strong className="text-white">NUNCA tocan Google Maps</strong>. Se desvían en &lt; 15 segundos al WhatsApp del gerente para resolver el caso en privado y salvar al cliente.</>
                    )}
                  </span>
                </div>
                <span className="text-[11px] print:text-[10px] font-black text-emerald-300 uppercase tracking-wider bg-emerald-900/80 px-3 py-1 print:px-2 print:py-0.5 rounded-xl border border-emerald-400/40 shrink-0 whitespace-nowrap">
                  {lang === 'en' ? '100% Shielded Listing' : 'Ficha 100% Blindada'}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* PAGE 3: ABANDONO REPUTACIONAL EN GOOGLE MAPS & CLIENTES RECUPERABLES */}
        <div className="space-y-4 print:space-y-2.5 print:print-sheet">
          <section className="space-y-4 print:space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center">{t.step3Badge}</span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                  <span>{lang === 'en' ? 'Reputational Neglect Diagnostic:' : 'Diagnóstico de Abandono Reputacional:'}</span>
                  <span className="text-amber-400 underline decoration-amber-500/40">{calculations.activeTitle}</span>
                </h2>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-300 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-500/40 flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  <span>~{Math.round(calculations.abandonmentRate * 100)}% {lang === 'en' ? 'Unanswered' : 'Sin Respuesta'}</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>{lang === 'en' ? 'AI Rescue' : 'Rescate con IA'}</span>
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 print:text-[11px] leading-relaxed">
              {lang === 'en' ? (
                <>Google Maps does not forgive silence: leaving reviews unaddressed signals to both the algorithm and prospective customers that management disregards guest experiences. We audit your current response gap and show how <strong>Prestigia\'s AI Protocol</strong> rescues these customers to instantly lift your rating.</>
              ) : (
                <>Google Maps no perdona el silencio: una reseña sin responder le dice al algoritmo y a los nuevos clientes que a la gerencia no le importa lo que opinan de ella. Detectamos el estado de abandono actual y cómo el <strong>Protocolo de IA de Prestigia</strong> puede rescatar a estos clientes para elevar de inmediato tu calificación.</>
              )}
            </p>

            {/* SEMÁFORO DE CLIENTES RECUPERABLES CON NÚMEROS REALES DE GOOGLE MAPS */}
            <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-3.5 print:gap-2">
              {/* Semáforo Rojo: 1-2 Estrellas */}
              <div className="p-4 print:p-2.5 rounded-2xl print:rounded-xl bg-gradient-to-b from-rose-950/60 to-slate-950 border-2 border-rose-500/50 relative overflow-hidden shadow-xl print-card-avoid print:overflow-visible space-y-2 print:space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shadow-lg shadow-rose-500/50" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-rose-300">
                      {t.semRedTitle}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-500/40">
                    {t.semRedTag}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl print:text-xl font-black text-rose-400 tracking-tight flex items-baseline gap-2">
                  <span>{calculations.estimatedUnansweredNegative} {lang === 'en' ? (calculations.estimatedUnansweredNegative === 1 ? 'review' : 'reviews') : (calculations.estimatedUnansweredNegative === 1 ? 'reseña' : 'reseñas')}</span>
                  {calculations.actualNegativeTotal > calculations.estimatedUnansweredNegative && (
                    <span className="text-xs font-semibold text-rose-300/80">{lang === 'en' ? `of ${calculations.actualNegativeTotal} total` : `de ${calculations.actualNegativeTotal} reales`}</span>
                  )}
                </div>
                <p className="text-[11px] print:text-[10px] text-slate-300 leading-relaxed">
                  {t.semRedDesc}
                </p>
                <div className="pt-2 border-t border-rose-500/20 text-[10px] text-rose-200/90 font-semibold flex items-center justify-between">
                  <span>{t.semRedPriority}</span>
                  <span className="font-black text-rose-400 uppercase">{t.semRedUrgency}</span>
                </div>
              </div>

              {/* Semáforo Amarillo: 3 Estrellas */}
              <div className="p-4 print:p-2.5 rounded-2xl print:rounded-xl bg-gradient-to-b from-amber-950/60 to-slate-950 border border-amber-500/40 relative overflow-hidden shadow-xl print-card-avoid print:overflow-visible space-y-2 print:space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                      {t.semYellowTitle}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/40">
                    {t.semYellowTag}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl print:text-xl font-black text-amber-400 tracking-tight flex items-baseline gap-2">
                  <span>{calculations.estimatedUnanswered3Star} {lang === 'en' ? (calculations.estimatedUnanswered3Star === 1 ? 'review' : 'reviews') : (calculations.estimatedUnanswered3Star === 1 ? 'reseña' : 'reseñas')}</span>
                  {calculations.actual3Star > calculations.estimatedUnanswered3Star && (
                    <span className="text-xs font-semibold text-amber-300/80">{lang === 'en' ? `of ${calculations.actual3Star} total` : `de ${calculations.actual3Star} reales`}</span>
                  )}
                </div>
                <p className="text-[11px] print:text-[10px] text-slate-300 leading-relaxed">
                  {t.semYellowDesc}
                </p>
                <div className="pt-2 border-t border-amber-500/20 text-[10px] text-amber-200/90 font-semibold flex items-center justify-between">
                  <span>{t.semYellowPriority}</span>
                  <span className="font-black text-amber-400 uppercase">{t.semYellowUrgency}</span>
                </div>
              </div>

              {/* Semáforo Verde: 4-5 Estrellas */}
              <div className="p-4 print:p-2.5 rounded-2xl print:rounded-xl bg-gradient-to-b from-emerald-950/60 to-slate-950 border border-emerald-500/40 relative overflow-hidden shadow-xl print-card-avoid print:overflow-visible space-y-2 print:space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300">
                      {t.semGreenTitle}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                    {t.semGreenTag}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl print:text-xl font-black text-emerald-400 tracking-tight flex items-baseline gap-2">
                  <span>{calculations.estimatedUnansweredPositive} {lang === 'en' ? (calculations.estimatedUnansweredPositive === 1 ? 'review' : 'reviews') : (calculations.estimatedUnansweredPositive === 1 ? 'reseña' : 'reseñas')}</span>
                  {calculations.actualPositiveTotal > calculations.estimatedUnansweredPositive && (
                    <span className="text-xs font-semibold text-emerald-300/80">{lang === 'en' ? `of ${calculations.actualPositiveTotal} total` : `de ${calculations.actualPositiveTotal} reales`}</span>
                  )}
                </div>
                <p className="text-[11px] print:text-[10px] text-slate-300 leading-relaxed">
                  {t.semGreenDesc}
                </p>
                <div className="pt-2 border-t border-emerald-500/20 text-[10px] text-emerald-200/90 font-semibold flex items-center justify-between">
                  <span>{t.semGreenPriority}</span>
                  <span className="font-black text-emerald-400 uppercase">{t.semGreenUrgency}</span>
                </div>
              </div>
            </div>

            {/* BANNER DE BALANCE REAL DE LA FICHA EN GOOGLE */}
            <div className="p-3 print:p-2 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs print:text-[10px]">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">Auditoría Real de la Ficha:</span>
                <span className="text-slate-300">
                  Total de <strong className="text-white">{calculations.totalReviews} reseñas</strong> en Google Maps
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-rose-400 font-semibold">
                  {calculations.actualRescuableTotal} opiniones rescatables (1★ a 3★)
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-semibold">
                  {calculations.actualPositiveTotal} opiniones positivas (4★ y 5★)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Fórmula 100% fiel al historial oficial de la empresa</span>
              </div>
            </div>

            {/* SIMULADOR DE SALTO INMEDIATO DE CALIFICACIÓN Y EJEMPLO EN VIVO DE IA */}
            <div className="grid grid-cols-1 lg:grid-cols-12 print:grid-cols-12 gap-4 print:gap-2.5">
              {/* Columna Izquierda: SIMULADOR DE SALTO INMEDIATO (6 cols) */}
              <div className="lg:col-span-6 print:col-span-6 p-5 print:p-3 rounded-2xl print:rounded-xl bg-slate-900/90 border border-indigo-500/40 shadow-xl flex flex-col justify-between space-y-3.5 print:space-y-1.5 print-card-avoid print:overflow-visible">
                <div className="space-y-2 print:space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-500/30 flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3 h-3 text-indigo-400" />
                      <span>Simulador Interactivo de Rescate</span>
                    </span>
                    <span className="text-xs print:text-[10px] font-bold text-slate-400">
                      Tasa de Éxito: <strong className="text-amber-300 font-mono text-sm print:text-xs">{unansweredRecoveryRate}%</strong>
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base print:text-xs font-black text-white">
                    Impacto Inmediato de Recuperar Quejas Pasadas
                  </h3>
                  <p className="text-xs print:text-[10px] text-slate-300 leading-relaxed">
                    Al responder con diplomacia y resolver el caso por canal privado, clientes furiosos acceden a <strong>rectificar su calificación a 5★</strong> o retirar su reseña negativa de Google Maps.
                  </p>
                </div>

                {/* Slider interactivo (oculto el control de arrastre en impresión, mostrando el valor activo) */}
                <div className="p-3 print:p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-2 print:space-y-1">
                  <div className="flex items-center justify-between text-xs print:text-[10px] text-slate-400 font-semibold">
                    <span>Meta de clientes rescatados:</span>
                    <span className="text-amber-400 font-bold">
                      {calculations.recoveredNegativeCount} de {calculations.estimatedUnansweredRescuable > 0 ? calculations.estimatedUnansweredRescuable : calculations.estimatedUnansweredNegative} opiniones (1★-3★) recuperadas
                    </span>
                  </div>

                  <div className="print:hidden space-y-1.5">
                    <input
                      type="range"
                      min="10"
                      max="50"
                      step="1"
                      value={unansweredRecoveryRate}
                      onChange={(e) => setUnansweredRecoveryRate(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <button
                        type="button"
                        onClick={() => setUnansweredRecoveryRate(10)}
                        className={`px-2 py-0.5 rounded transition ${unansweredRecoveryRate <= 15 ? 'bg-indigo-900/60 text-amber-300 font-bold border border-amber-500/40' : 'hover:text-white'}`}
                      >
                        10% (Conservador)
                      </button>
                      <button
                        type="button"
                        onClick={() => setUnansweredRecoveryRate(25)}
                        className={`px-2 py-0.5 rounded transition ${unansweredRecoveryRate >= 20 && unansweredRecoveryRate <= 30 ? 'bg-amber-950/80 text-amber-400 font-bold border border-amber-500/40' : 'hover:text-white'}`}
                      >
                        25% (Estándar Prestigia)
                      </button>
                      <button
                        type="button"
                        onClick={() => setUnansweredRecoveryRate(50)}
                        className={`px-2 py-0.5 rounded transition ${unansweredRecoveryRate >= 45 ? 'bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-500/40' : 'hover:text-white'}`}
                      >
                        50% (Agresivo)
                      </button>
                    </div>
                  </div>

                  {/* Salto de Nota Visual */}
                  <div className="pt-2 print:pt-1 border-t border-slate-850 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Calificación Actual</span>
                      <div className="text-xl print:text-base font-black text-slate-300">
                        {calculations.effectiveRating}★
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                      <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs print:text-[10px] font-black">
                        +{calculations.immediateRatingDelta > 0 ? calculations.immediateRatingDelta : '0.2'}★ Inmediatas
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-emerald-400 uppercase font-bold block">Nueva Nota Proyectada</span>
                      <div className="text-2xl print:text-lg font-black text-emerald-400">
                        {calculations.immediateJumpRating > calculations.effectiveRating ? calculations.immediateJumpRating : Math.min(4.9, Math.round((calculations.effectiveRating + 0.2) * 10) / 10)}★
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 print:p-1.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-[11px] print:text-[9.5px] text-indigo-200 leading-snug">
                  💡 <strong>Beneficio Inmediato:</strong> No tienes que esperar meses a acumular nuevas opiniones. Recuperando clientes que ya te calificaron mal, limpias tu ficha existente desde la primera semana.
                </div>
              </div>

              {/* Columna Derecha: DEMOSTRACIÓN DE PROTOCOLO IA PRESTIGIA (6 cols) */}
              <div className="lg:col-span-6 print:col-span-6 p-5 print:p-3 rounded-2xl print:rounded-xl bg-slate-900/90 border border-emerald-500/40 shadow-xl flex flex-col justify-between space-y-3 print:space-y-1.5 print-card-avoid print:overflow-visible">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                      <Bot className="w-3 h-3 text-emerald-400" />
                      <span>Motor de Respuesta & Desescalación IA</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Protocolo Diplomático Adaptado a {category}</span>
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base print:text-xs font-black text-white">
                    Ejemplo Real: Cómo Desescalamos una Queja de 1★
                  </h3>
                  <p className="text-xs print:text-[10px] text-slate-400 leading-relaxed">
                    Las respuestas defensivas o automáticas enfurecen al cliente. La IA de Prestigia redacta con empatía ejecutiva para invitar a solucionar en privado y solicitar la reconsideración de la nota:
                  </p>
                </div>

                {/* Tarjeta de la Reseña Negativa Simulada y la Respuesta IA */}
                <div className="space-y-2.5 print:space-y-1 text-xs print:text-[10px]">
                  {/* Reseña de Cliente (Editable con el caso 100% Real de la Ficha) */}
                  <div className="p-3 print:p-2 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-2">
                    <div className="flex items-center justify-between text-[11px] print:text-[9.5px]">
                      <div className="flex items-center gap-1.5 flex-1">
                        <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                        {isEditingRealReview ? (
                          <input
                            type="text"
                            value={activeComplaintAuthor}
                            onChange={(e) => setActiveComplaintAuthor(e.target.value)}
                            placeholder="Nombre del autor en Google Maps (ej: Andrea Gómez)"
                            className="bg-slate-900 border border-rose-500/50 rounded px-2 py-0.5 text-xs text-white w-full max-w-xs focus:outline-none"
                          />
                        ) : (
                          <span className="font-bold text-slate-200">
                            {activeComplaintAuthor || categoryTerms.sampleAuthor || 'Cliente en Google Maps'} <span className="text-slate-400 font-normal">(Opinión Real de Google)</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-rose-400 font-mono font-bold">★☆☆☆☆ (1★)</span>
                        <button
                          type="button"
                          onClick={() => setIsEditingRealReview(!isEditingRealReview)}
                          className="print:hidden text-[10px] text-amber-300 hover:text-amber-200 underline font-semibold cursor-pointer"
                        >
                          {isEditingRealReview ? 'Listo' : '✏️ Pegar Reseña Real'}
                        </button>
                      </div>
                    </div>

                    {isEditingRealReview ? (
                      <div className="space-y-1.5 print:hidden">
                        <textarea
                          rows={3}
                          value={activeComplaintText}
                          onChange={(e) => setActiveComplaintText(e.target.value)}
                          placeholder="Pega o escribe el comentario exacto que le dejaron a la empresa en Google Maps..."
                          className="w-full bg-slate-900 border border-rose-500/40 rounded-lg p-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-400"
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">
                            Escribe o pega la queja textual del cliente para generar la solución en vivo.
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingRealReview(false);
                              setIsGeneratingAi(true);
                              setTimeout(() => {
                                const authorName = activeComplaintAuthor.trim() || 'cliente';
                                const companyName = businessName || 'nuestra empresa';
                                const complaint = activeComplaintText.trim();
                                let customRes = `Hola ${authorName.split(' ')[0]}, te ofrecemos una sincera disculpa por parte de la Dirección de ${companyName}. Lamentamos profundamente el inconveniente con tu ${categoryTerms.sampleResponseSubject || 'servicio'}. Deseamos comunicarnos directamente contigo para corregir lo sucedido, ${categoryTerms.sampleResolution || 'compensar el servicio'} y que nos des la oportunidad de brindarte la atención que mereces. Por favor escríbenos a nuestra línea de atención prioritaria para coordinarlo personalmente.`;
                                if (complaint.toLowerCase().includes('demora') || complaint.toLowerCase().includes('tarde') || complaint.toLowerCase().includes('tiempo')) {
                                  customRes = `Hola ${authorName.split(' ')[0]}, lamentamos sinceramente la demora presentada. En ${companyName} nos tomamos muy en serio los tiempos de entrega de cada cliente. La Gerencia General desea atenderte directamente para indemnizar el retraso y garantizar que no vuelva a suceder. Por favor contáctanos por WhatsApp para resolverlo hoy mismo.`;
                                } else if (complaint.toLowerCase().includes('atencion') || complaint.toLowerCase().includes('groser') || complaint.toLowerCase().includes('trato')) {
                                  customRes = `Hola ${authorName.split(' ')[0]}, te pedimos una disculpa sincera. El trato que recibiste no representa los valores de ${companyName}. Hemos abierto una investigación interna con el personal involucrado y nuestro Director de Operaciones desea contactarte personalmente para ofrecerte una cortesía especial y reparar este mal momento.`;
                                }
                                setCustomAiResponse(customRes);
                                setIsGeneratingAi(false);
                              }, 600);
                            }}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-md text-[11px] shadow transition"
                          >
                            ⚡ Generar Rescate con IA
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-300 italic text-[11px] print:text-[9.5px] leading-relaxed">
                        {activeComplaintText ? `"${activeComplaintText}"` : (categoryTerms.sampleComplaint || '"Pésima experiencia, esperamos más de 40 minutos por la atención y nadie nos dio una explicación. No vuelvo más."')}
                      </p>
                    )}
                  </div>

                  {/* Respuesta del Propietario con IA Prestigia */}
                  <div className="p-3 print:p-2 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-1.5 relative">
                    <div className="flex items-center justify-between text-[11px] print:text-[9.5px]">
                      <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                        <MessageSquareReply className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Respuesta Oficial de la Gerencia (Generada con IA)</span>
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        Enviada en Google Maps
                      </span>
                    </div>

                    {isGeneratingAi ? (
                      <div className="py-3 flex items-center justify-center gap-2 text-xs text-emerald-400 font-semibold animate-pulse">
                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                        <span>Redactando protocolo diplomático de rescate con IA...</span>
                      </div>
                    ) : (
                      <p className="text-slate-300 text-[11px] print:text-[9.5px] leading-relaxed">
                        {customAiResponse ? (
                          customAiResponse
                        ) : (
                          <>
                            "Hola {(activeComplaintAuthor || categoryTerms.sampleAuthor)?.split(' ')[0] || 'Carlos'}, te ofrecemos una sincera disculpa. Esa situación no representa el estándar de {categoryTerms.sampleResponseSubject || 'servicio'} de <strong className="text-white">{businessName || 'nuestra empresa'}</strong>. La Dirección General desea atenderte directamente para {categoryTerms.sampleResolution || 'compensar lo ocurrido y que nos des la oportunidad de sorprenderte'}. Por favor comunícate a nuestra línea prioritaria para coordinarlo personalmente."
                          </>
                        )}
                      </p>
                    )}

                    <div className="pt-1.5 border-t border-slate-850 flex items-center justify-between text-[10px] text-emerald-300/90 font-medium">
                      <span>Resultado esperado:</span>
                      <span className="font-bold text-emerald-400">Desescalación en privado + Rectificación a 5★</span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 print:p-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] print:text-[9.5px] text-emerald-200 leading-snug">
                  🛡️ <strong>Efecto en el Algoritmo:</strong> Google Maps premia con hasta un <strong>+28% más de visibilidad</strong> a las fichas comerciales que responden al 100% de sus reseñas en menos de 24 horas.
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* PAGE 4: LA CURA PRESTIGIA Y RETORNO DE INVERSIÓN ROI */}
        <div className="space-y-4 print:space-y-2.5 print:print-sheet">
          {/* STEP 4: THE PRESTIGIA CURE (LA CURA DEFINITIVA) */}
          <section className="space-y-4 print:space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 text-xs font-black flex items-center justify-center">{t.step4Badge}</span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                <span>{lang === 'en' ? 'The Prestigia Cure: How We Shield' : 'La Cura Prestigia: Cómo Transformaremos a'}</span>
                <span className="text-emerald-400 underline decoration-emerald-500/40">{calculations.activeTitle}</span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 print:text-[11px]">
              {t.step4Sub}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-2 gap-4 print:gap-2.5">
              {/* CURA 1: ESCUDO ANTI-RESEÑAS */}
              <div className="p-6 print:p-3 rounded-3xl print:rounded-xl bg-slate-900/90 border border-emerald-500/40 relative overflow-hidden shadow-xl hover:border-emerald-400 transition print-card-avoid print:overflow-visible">
                <div className="w-10 h-10 print:w-8 print:h-8 rounded-2xl print:rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 print:mb-1.5">
                  <ShieldCheck className="w-6 h-6 print:w-4 print:h-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {t.cure1Badge}
                </span>
                <h3 className="text-base font-extrabold text-white mt-2 print:mt-1 mb-1.5 print:mb-0.5">
                  {lang === 'en' ? '92% of Grievances Contained Privately' : '92% de Quejas Contenidas en Vivo'}
                </h3>
                <p className="text-xs print:text-[11px] text-slate-300 leading-relaxed mb-3 print:mb-1.5">
                  {lang === 'en' ? (
                    <>Upon scanning the QR, 1 to 3-star grievances <strong className="text-emerald-300">NEVER touch Google Maps</strong>. Instant alerts trigger to management\'s WhatsApp in under 15 seconds to resolve dissatisfaction {categoryTerms.serviceDescription} before guests leave.</>
                  ) : (
                    <>Al escanear el QR, las quejas de 1 a 3 estrellas <strong className="text-emerald-300">NUNCA tocan Google Maps</strong>. Se activan alertas instantáneas al WhatsApp del encargado de turno en menos de 15 segundos para resolver la inconformidad {categoryTerms.serviceDescription} antes de que abandonen el establecimiento.</>
                  )}
                </p>
                <div className="p-2.5 print:p-1.5 rounded-xl print:rounded-lg bg-slate-950 border border-slate-800 text-[11px] print:text-[10px] text-slate-300 flex items-center justify-between">
                  <span>{lang === 'en' ? 'Annual issues resolved privately:' : 'Inconformidades resueltas al año:'}</span>
                  <strong className="text-emerald-400 font-black">+{fmtNumber(calculations.shieldedComplaintsYearly)} {lang === 'en' ? 'cases' : 'casos'}</strong>
                </div>
              </div>

              {/* CURA 2: ACELERADOR Y BLINDAJE PERPETUO GOOGLE MAPS 5★ */}
              <div className="p-6 print:p-3 rounded-3xl print:rounded-xl bg-slate-900/90 border border-amber-500/40 relative overflow-hidden shadow-xl hover:border-amber-400 transition flex flex-col justify-between print-card-avoid print:overflow-visible">
                <div>
                  <div className="flex items-center justify-between mb-4 print:mb-1.5">
                    <div className="w-10 h-10 print:w-8 print:h-8 rounded-2xl print:rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Star className="w-6 h-6 print:w-4 print:h-4 fill-amber-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      {lang === 'en' ? 'Acceleration & Permanent Defense' : 'Aceleración & Blindaje Continuo'}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-white mt-1 mb-1.5 print:mb-0.5">
                    {lang === 'en' ? `Climb to ${calculations.projectedRatingIn90Days}★ & Ongoing Shield` : `Conquista a ${calculations.projectedRatingIn90Days}★ y Defensa Permanente`}
                  </h3>
                  
                  <p className="text-xs print:text-[11px] text-slate-300 leading-relaxed mb-2.5 print:mb-1">
                    {lang === 'en' ? (
                      <><strong className="text-amber-300">Phase 1 (Days 1-90) — Rapid Conquest:</strong> The system automatically guides satisfied diners to Google Maps, lifting your rating from <span className="text-white font-bold">{calculations.effectiveRating}★ to {calculations.projectedRatingIn90Days}★</span> and securing <strong className="text-amber-200">{businessName || 'your brand'}</strong> within the coveted <strong className="text-white">Google Local 3-Pack</strong>.</>
                    ) : (
                      <><strong className="text-amber-300">Fase 1 (Días 1-90) — Conquista Acelerada:</strong> El sistema guía en automático a los clientes satisfechos a Google Maps, proyectando la calificación de <span className="text-white font-bold">{calculations.effectiveRating}★ a {calculations.projectedRatingIn90Days}★</span> y posicionando a <strong className="text-amber-200">{businessName || 'tu marca'}</strong> en el codiciado <strong className="text-white">Local 3-Pack de Google</strong>.</>
                    )}
                  </p>

                  <p className="text-xs print:text-[11px] text-slate-300 leading-relaxed mb-3 print:mb-1">
                    {lang === 'en' ? (
                      <><strong className="text-emerald-300">Phase 2 (Ongoing) — Algorithmic Defense:</strong> Google Maps heavily penalizes businesses that stop generating fresh reviews (<em>Review Recency & Velocity Law</em>). A consistent flow of +{calculations.newPositiveReviewsMonthly} 5★ reviews every month is required to maintain Top 3 dominance and dilute future attacks.</>
                    ) : (
                      <><strong className="text-emerald-300">Fase 2 (Permanente) — Blindaje Algorítmico:</strong> Google Maps castiga severamente a los negocios que detienen su flujo de opiniones (<em>Ley de Recencia y Velocidad de Reseñas</em>). Se requiere un flujo constante de +{calculations.newPositiveReviewsMonthly} opiniones 5★ cada mes para evitar que la competencia activa te desplace del Top 3 y para neutralizar cualquier queja futura.</>
                    )}
                  </p>
                </div>

                <div className="space-y-2 print:space-y-1 pt-2 print:pt-1">
                  <div className="p-2.5 print:p-1.5 rounded-xl print:rounded-lg bg-slate-950 border border-slate-800 text-[11px] print:text-[10px] text-slate-300 flex items-center justify-between">
                    <span>Flujo 5★ activo al mes:</span>
                    <strong className="text-amber-400 font-black">+{calculations.newPositiveReviewsMonthly} opiniones frescas/mes</strong>
                  </div>
                  <div className="p-2 print:p-1.5 rounded-xl print:rounded-lg bg-amber-950/40 border border-amber-500/30 text-[10px] text-amber-200/90 leading-tight">
                    ⚡ <strong>¿Por qué mantener el servicio?</strong> Google premia la frescura mensual de opiniones. Si se suspende el servicio, el algoritmo oculta el perfil en menos de 45 días y las quejas vuelven a ser públicas.
                  </div>
                </div>
              </div>

              {/* CURA 3: AUDITORIA DE PERSONAL */}
              <div className="p-6 print:p-3 rounded-3xl print:rounded-xl bg-slate-900/90 border border-indigo-500/40 relative overflow-hidden shadow-xl hover:border-indigo-400 transition print-card-avoid print:overflow-visible">
                <div className="w-10 h-10 print:w-8 print:h-8 rounded-2xl print:rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 print:mb-1.5">
                  <Tv className="w-6 h-6 print:w-4 print:h-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                  {t.cure3Badge}
                </span>
                <h3 className="text-base font-extrabold text-white mt-2 print:mt-1 mb-1.5 print:mb-0.5">
                  {lang === 'en' ? `Leaderboard of ${calculations.totalStaffCount} ${categoryTerms.staffLabel}` : `Podio de ${calculations.totalStaffCount} ${categoryTerms.staffLabel}`}
                </h3>
                <p className="text-xs print:text-[11px] text-slate-300 leading-relaxed mb-3 print:mb-1.5">
                  {lang === 'en' ? (
                    <>Guests select on the QR code who served them ({categoryTerms.staffSingular}). The real-time TV Wallboard reveals top servers, fostering recognition, bonus incentives, and zero blind spots for management.</>
                  ) : (
                    <>El cliente elige en el QR quién lo atendió ({categoryTerms.staffSingular}). El Wallboard TV en tiempo real muestra quién es el colaborador más destacado, fomentando reconocimiento, mejores incentivos y cero puntos ciegos para la gerencia.</>
                  )}
                </p>
                <div className="p-2.5 print:p-1.5 rounded-xl print:rounded-lg bg-slate-950 border border-slate-800 text-[11px] print:text-[10px] text-slate-300 flex items-center justify-between">
                  <span>{t.cure3Stat}</span>
                  <strong className="text-indigo-400 font-black">{lang === 'en' ? '100% Individualized' : '100% Individualizado'}</strong>
                </div>
              </div>

              {/* CURA 4: MÁQUINA DE FIDELIZACIÓN (SORTEO & WHATSAPP) */}
              <div className="p-6 print:p-3 rounded-3xl print:rounded-xl bg-slate-900/90 border border-purple-500/40 relative overflow-hidden shadow-xl hover:border-purple-400 transition print-card-avoid print:overflow-visible">
                <div className="w-10 h-10 print:w-8 print:h-8 rounded-2xl print:rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 print:mb-1.5">
                  <Gift className="w-6 h-6 print:w-4 print:h-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                  {t.cure4Badge}
                </span>
                <h3 className="text-base font-extrabold text-white mt-2 print:mt-1 mb-1.5 print:mb-0.5">
                  +{fmtNumber(calculations.contactsCapturedMonthly)} {lang === 'en' ? 'VIP Contacts / Month' : 'Contactos VIP al Mes'}
                </h3>
                <p className="text-xs print:text-[11px] text-slate-300 leading-relaxed mb-3 print:mb-1.5">
                  {lang === 'en' ? (
                    <>With the Satisfaction Campaign & Official Giveaway, guests willingly provide their name and WhatsApp under data compliance. Build a proprietary customer database to launch promotions and drive slow-day foot traffic.</>
                  ) : (
                    <>Con la Campaña de Satisfacción y Sorteo Oficial, los clientes entregan voluntariamente su nombre y WhatsApp bajo Habeas Data legal. Una base de datos propia para enviar ofertas e impulsar visitas y recompras recurrentes en días de baja afluencia.</>
                  )}
                </p>
                <div className="p-2.5 print:p-1.5 rounded-xl print:rounded-lg bg-slate-950 border border-slate-800 text-[11px] print:text-[10px] text-slate-300 flex items-center justify-between">
                  <span>{t.cure4Stat}</span>
                  <strong className="text-purple-300 font-black">+{fmtNumber(calculations.contactsCapturedYearly)} {lang === 'en' ? 'guests' : 'clientes'}</strong>
                </div>
              </div>

              {/* CURA 5: RESUMEN DE BENEFICIO FINANCIERO & ROI */}
              <div className="p-6 print:p-3.5 rounded-3xl print:rounded-xl bg-gradient-to-br from-emerald-950 via-slate-900 to-indigo-950 border-2 border-emerald-500/80 relative overflow-hidden shadow-2xl md:col-span-2 print:col-span-2 print-card-avoid print:overflow-visible">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:gap-2 mb-4 print:mb-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-900/80 px-3 py-1 print:px-2 print:py-0.5 rounded-full border border-emerald-400/50">
                      {t.cure5Badge}
                    </span>
                    <h3 className="text-lg sm:text-xl print:text-base font-black text-white mt-2 print:mt-0.5">
                      {t.cure5Title} {calculations.activeTitle}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xs print:text-[10px] text-slate-400">{t.cure5BenefitLabel}</div>
                    <div className="text-2xl sm:text-3xl print:text-xl font-black text-emerald-400 tracking-tight">
                      {fmtMoney(calculations.totalAnnualFinancialBenefit)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-4 print:gap-2.5 mt-4 print:mt-2 pt-4 print:pt-2 border-t border-slate-800">
                  <div className="p-4 print:p-2.5 rounded-2xl print:rounded-xl bg-slate-950/80 border border-emerald-500/30">
                    <div className="text-xs print:text-[10px] text-slate-400">{t.savedMoneyCardTitle}</div>
                    <div className="text-lg sm:text-xl print:text-base font-black text-emerald-400 mt-1 print:mt-0.5">
                      {fmtMoney(calculations.moneySavedYearly)}{lang === 'en' ? '/yr' : '/año'}
                    </div>
                    <p className="text-[11px] print:text-[10px] text-slate-400 mt-1 leading-relaxed">
                      {lang === 'en' 
                        ? `Recovering guests who left silently (~${fmtMoney(calculations.moneySavedMonthly)}/mo saved out of ${fmtMoney(calculations.yearlyFinancialLeakage)}/yr in churn).`
                        : `Recuperando clientes que se iban en silencio (~${fmtMoney(calculations.moneySavedMonthly)}/mes salvados de los ${fmtMoney(calculations.yearlyFinancialLeakage)}/año en fuga).`}
                    </p>
                  </div>

                  <div className="p-4 print:p-2.5 rounded-2xl print:rounded-xl bg-slate-950/80 border border-indigo-500/30">
                    <div className="text-xs print:text-[10px] text-slate-400">{t.newRevenueCardTitle}</div>
                    <div className="text-lg sm:text-xl print:text-base font-black text-indigo-300 mt-1 print:mt-0.5">
                      {fmtMoney(calculations.totalAnnualFinancialBenefit)}
                    </div>
                    <p className="text-[11px] print:text-[10px] text-slate-400 mt-1 leading-relaxed">
                      {lang === 'en'
                        ? `Combines ${fmtMoney(calculations.moneySavedYearly)} saved + ${fmtMoney(calculations.newRevenueFromGoogleYearly)} in new sales from dominating Google Maps Top 3.`
                        : `Suma ${fmtMoney(calculations.moneySavedYearly)} salvados + ${fmtMoney(calculations.newRevenueFromGoogleYearly)} en ventas nuevas por conquistar el Top 3 de Google Maps.`}
                    </p>
                  </div>
                </div>

                {/* COMPARATIVO VISUAL: DESGLOSE DE BENEFICIO FINANCIERO ANUAL */}
                <div className="mt-4 print:mt-2">
                  <FinancialRoiComparisonChart
                    moneySavedYearly={calculations.moneySavedYearly}
                    newRevenueYearly={calculations.newRevenueFromGoogleYearly}
                    totalBenefitYearly={calculations.totalAnnualFinancialBenefit}
                    currencySymbol={currencyConfig.symbol}
                    lang={lang}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* PAGE 5: SOSTENIBILIDAD COMERCIAL Y CUADRO COMPARATIVO */}
        <div className="space-y-4 print:space-y-2.5 print:print-sheet">
          {/* STRATEGIC PERSISTENCE PILLAR: WHY PRESTIGIA IS PERMANENT INFRASTRUCTURE */}
          <section className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-indigo-500/40 rounded-3xl print:rounded-2xl p-5 sm:p-7 print:p-3.5 shadow-2xl relative overflow-hidden print-card-avoid print:overflow-visible">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:gap-1.5 pb-5 print:pb-2 border-b border-slate-800/80">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-950 px-3 py-1 print:px-2 print:py-0.5 rounded-full border border-amber-500/40 inline-flex items-center gap-1.5 mb-2 print:mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Modelo de Sostenibilidad Comercial & LTV</span>
                </span>
                <h3 className="text-base sm:text-xl print:text-sm font-black text-white">
                  ¿Por qué Prestigia es una Infraestructura Permanente y No un Servicio Temporal de 3 Meses?
                </h3>
                <p className="text-xs print:text-[10px] text-slate-300 mt-1 max-w-3xl">
                  {calculations.effectiveRating >= 4.6 ? (
                    <>
                      Mantener la calificación estelar en <strong className="text-amber-300">{calculations.effectiveRating}★</strong> y defender el liderazgo en Google Maps requiere un blindaje activo 24/7. Tres razones críticas de rentabilidad para <strong className="text-white">{businessName || 'tu marca'}</strong>:
                    </>
                  ) : (
                    <>
                      Llevar a <strong className="text-amber-300">{businessName || 'tu marca'}</strong> de {calculations.effectiveRating}★ a {calculations.projectedRatingIn90Days}★ en los primeros 90 días es solo la <em>Fase de Conquista</em>. La verdadera rentabilidad radica en mantener el <strong>Blindaje Activo 24/7</strong> por tres razones críticas:
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-4 print:gap-2 pt-5 print:pt-2">
              {/* Pilar 1 */}
              <div className="p-4 print:p-2.5 rounded-2xl print:rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition space-y-2 print:space-y-1 print-card-avoid print:overflow-visible">
                <div className="w-8 h-8 print:w-6 print:h-6 rounded-xl print:rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs print:text-[10px]">
                  1
                </div>
                <h4 className="text-sm print:text-xs font-bold text-white flex items-center gap-1.5">
                  <span>La Ley de Recencia de Google Maps</span>
                </h4>
                <p className="text-xs print:text-[10px] text-slate-300 leading-relaxed">
                  El algoritmo de Google no vive del pasado: premia con fuerza la <em>velocidad y frescura</em> de las opiniones de los <strong>últimos 30 días</strong>. Si <strong className="text-white">{businessName || 'tu marca'}</strong> detiene su flujo mensual, los competidores de la zona que sí reciben reseñas recientes te desplazarán fuera del <strong>Local 3-Pack</strong> en pocas semanas.
                </p>
              </div>

              {/* Pilar 2 */}
              <div className="p-4 print:p-2.5 rounded-2xl print:rounded-xl bg-slate-950/80 border border-slate-800 hover:border-rose-500/40 transition space-y-2 print:space-y-1 print-card-avoid print:overflow-visible">
                <div className="w-8 h-8 print:w-6 print:h-6 rounded-xl print:rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-black text-xs print:text-[10px]">
                  2
                </div>
                <h4 className="text-sm print:text-xs font-bold text-white flex items-center gap-1.5">
                  <span>El Riesgo del "Dique Roto"</span>
                </h4>
                <p className="text-xs print:text-[10px] text-slate-300 leading-relaxed">
                  En cualquier negocio con atención presencial, siempre existirá un margen natural de fricción humana (<strong className="text-rose-300">~{calculations.monthlyUnhappyClients} {categoryTerms.clientLabel.toLowerCase()}/mes</strong> en tu caso). Prestigia es el dique privado que las contiene. Si cancelas el servicio, <strong>el dique se rompe</strong>: las quejas volverán a publicarse directamente en Google Maps con 1★ y 2★, derrumbando rápidamente la calificación ganada.
                </p>
              </div>

              {/* Pilar 3 */}
              <div className="p-4 print:p-2.5 rounded-2xl print:rounded-xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/40 transition space-y-2 print:space-y-1 print-card-avoid print:overflow-visible">
                <div className="w-8 h-8 print:w-6 print:h-6 rounded-xl print:rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-xs print:text-[10px]">
                  3
                </div>
                <h4 className="text-sm print:text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Base de Datos Compuesta & Retención</span>
                </h4>
                <p className="text-xs print:text-[10px] text-slate-300 leading-relaxed">
                  El activo más valioso para <strong className="text-white">{businessName || 'tu marca'}</strong> es la base de datos de {categoryTerms.clientLabel.toLowerCase()} propios (<strong className="text-purple-300">+{fmtNumber(calculations.contactsCapturedMonthly)} números verificados/mes</strong>, +{fmtNumber(calculations.contactsCapturedYearly)} al año). Mantener el sistema activo mes a mes crea una máquina de ventas recurrentes para llenar {categoryTerms.serviceDescription} en los días de menor afluencia.
                </p>
              </div>
            </div>
          </section>

          {/* STEP 5: BEFORE VS AFTER COMPARISON TABLE */}
          <section className="bg-slate-900/90 border border-slate-800 rounded-3xl print:rounded-2xl p-5 sm:p-8 print:p-3 shadow-2xl relative overflow-hidden print-card-avoid print:overflow-visible print:mt-1">
            <div className="flex items-center gap-2 mb-4 print:mb-2">
              <span className="w-6 h-6 print:w-5 print:h-5 rounded-full bg-indigo-600 text-white text-xs print:text-[10px] font-black flex items-center justify-center">5</span>
              <h2 className="text-lg sm:text-xl print:text-sm font-extrabold text-white">
                Cuadro Comparativo: {calculations.activeTitle} (Antes vs. Con Prestigia)
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm print:text-[10px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 print:pb-1.5 font-bold">{lang === 'en' ? 'Strategic Pillar' : 'Dimensión Estratégica'}</th>
                    <th className="pb-3 print:pb-1.5 font-bold text-rose-400">{lang === 'en' ? '❌ Without Prestigia (Status Quo)' : '❌ Sin Prestigia (Estado Actual)'}</th>
                    <th className="pb-3 print:pb-1.5 font-bold text-emerald-400">{lang === 'en' ? '✅ With Prestigia (Active Shield)' : '✅ Con Prestigia (Blindaje Activo)'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-3 print:py-1.5 font-semibold text-white">{lang === 'en' ? 'Complaint Channel' : 'Canal de Quejas'}</td>
                    <td className="py-3 print:py-1.5 text-rose-300/90">
                      {lang === 'en' 
                        ? 'Posts directly onto Google Maps or social media when public damage is already irreversible.'
                        : 'Llegan a Google Maps o redes sociales cuando el daño ya es público e irreparable.'}
                    </td>
                    <td className="py-3 print:py-1.5 text-emerald-300 font-medium">
                      {lang === 'en'
                        ? 'Private secure filter straight to manager\'s WhatsApp in < 15 seconds.'
                        : 'Filtro seguro privado directo al WhatsApp del encargado en < 15 segundos.'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 print:py-1.5 font-semibold text-white">{lang === 'en' ? 'Google Maps Rating' : 'Calificación Google Maps'}</td>
                    <td className="py-3 print:py-1.5 text-rose-300/90">
                      {lang === 'en' ? (
                        calculations.effectiveRating >= 4.6 ? (
                          <>Fragile at {calculations.effectiveRating}★: Without a shield, 1 single 1★ attack tanks your average, and lack of recency drops you out of Top 3.</>
                        ) : (
                          <>Stagnant at {calculations.effectiveRating}★ or vulnerable to continuous dips due to dry review velocity.</>
                        )
                      ) : (
                        calculations.effectiveRating >= 4.6 ? (
                          <>Frágil en {calculations.effectiveRating}★: Sin escudo activo, 1 sola queja de 1★ derrumba el promedio y la falta de opiniones recientes te desplaza fuera del Top 3.</>
                        ) : (
                          <>Estancada en {calculations.effectiveRating}★ o vulnerable a caídas constantes por falta de flujo de opiniones frescas.</>
                        )
                      )}
                    </td>
                    <td className="py-3 print:py-1.5 text-emerald-300 font-medium">
                      {lang === 'en' ? (
                        calculations.effectiveRating >= 4.6 ? (
                          <>Permanent shield at {calculations.projectedRatingIn90Days}★ (+{calculations.newPositiveReviewsMonthly} fresh 5★ reviews/mo) to neutralize attacks and defend Top 3 under Google\'s Recency Law.</>
                        ) : (
                          <>Rapid climb to {calculations.projectedRatingIn90Days}★ in 90 days + <strong>Ongoing monthly shield</strong> (+{calculations.newPositiveReviewsMonthly} 5★ reviews/mo) to defend Top 3 under Google\'s Recency Law.</>
                        )
                      ) : (
                        calculations.effectiveRating >= 4.6 ? (
                          <>Blindaje permanente en {calculations.projectedRatingIn90Days}★ (+{calculations.newPositiveReviewsMonthly} opiniones 5★/mes) para neutralizar ataques y retener el Top 3 ante la Ley de Recencia de Google.</>
                        ) : (
                          <>Proyección a {calculations.projectedRatingIn90Days}★ en 90 días + <strong>Blindaje mensual permanente</strong> (+{calculations.newPositiveReviewsMonthly} opiniones 5★/mes) para defender el Top 3 ante la Ley de Recencia de Google.</>
                        )
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 print:py-1.5 font-semibold text-white">{lang === 'en' ? 'Staff Accountability' : 'Control de Personal'}</td>
                    <td className="py-3 print:py-1.5 text-rose-300/90">
                      {lang === 'en' 
                        ? `Total operational blindness across ${calculations.totalStaffCount} ${categoryTerms.staffLabel.toLowerCase()}. Zero insight on who creates friction or delights.`
                        : `Ceguera total de los ${calculations.totalStaffCount} ${categoryTerms.staffLabel.toLowerCase()}. No se sabe quién genera quejas ni quién deleita.`}
                    </td>
                    <td className="py-3 print:py-1.5 text-emerald-300 font-medium">
                      {lang === 'en'
                        ? `QR staff selector for ${categoryTerms.staffSingular}, individual rankings, and live TV leaderboard.`
                        : `Selector de ${categoryTerms.staffSingular} en el QR, ranking individual y Wallboard TV en tiempo real.`}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 print:py-1.5 font-semibold text-white">{lang === 'en' ? 'Guest Customer List' : 'Base de Datos de Clientes'}</td>
                    <td className="py-3 print:py-1.5 text-rose-300/90">
                      {lang === 'en'
                        ? `Zero first-party data. ${categoryTerms.clientLabel} pay and leave anonymously with zero re-engagement.`
                        : `Cero datos propios. Los ${categoryTerms.clientLabel.toLowerCase()} pagan y se van como usuarios anónimos sin recompra programada.`}
                    </td>
                    <td className="py-3 print:py-1.5 text-emerald-300 font-medium">
                      {lang === 'en'
                        ? `+${fmtNumber(calculations.contactsCapturedMonthly)} contacts per month with verified legal giveaways (+${fmtNumber(calculations.contactsCapturedYearly)} annually).`
                        : `+${fmtNumber(calculations.contactsCapturedMonthly)} contactos al mes con sorteos oficiales bajo Habeas Data (+${fmtNumber(calculations.contactsCapturedYearly)} al año).`}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 print:py-1.5 font-semibold text-white">{lang === 'en' ? 'Financial Leakage' : 'Fuga Financiera'}</td>
                    <td className="py-3 print:py-1.5 text-rose-300/90 font-bold">
                      {lang === 'en'
                        ? `Estimated annual loss of ${fmtMoney(calculations.yearlyFinancialLeakage)}/yr (~${fmtMoney(calculations.monthlyFinancialLeakage)}/mo).`
                        : `Pérdida anual estimada de ${fmtMoney(calculations.yearlyFinancialLeakage)}/año (~${fmtMoney(calculations.monthlyFinancialLeakage)}/mes).`}
                    </td>
                    <td className="py-3 print:py-1.5 text-emerald-300 font-black">
                      {lang === 'en'
                        ? `Savings of ${fmtMoney(calculations.moneySavedYearly)}/yr with total annual generated benefit of ${fmtMoney(calculations.totalAnnualFinancialBenefit)}.`
                        : `Ahorro de ${fmtMoney(calculations.moneySavedYearly)}/año y beneficio financiero anual de ${fmtMoney(calculations.totalAnnualFinancialBenefit)}.`}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* PAGE 6: DESARMADOR DE DUDAS B2B */}
        <div className="space-y-4 print:space-y-2.5 print:print-sheet">
          {/* STEP 6: DESARMADOR DE DUDAS FRECUENTES B2B (FAQ DE RETENCIÓN ANUAL) */}
          <section className="space-y-4 print:space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 print:w-5 print:h-5 rounded-full bg-indigo-500 text-white text-xs print:text-[10px] font-black flex items-center justify-center">6</span>
              <h2 className="text-lg sm:text-xl print:text-sm font-extrabold text-white flex items-center gap-2">
                <span>Desarmador de Dudas: Por Qué un Acuerdo de 12 Meses es Vital para</span>
                <span className="text-indigo-400 underline decoration-indigo-500/40">{calculations.activeTitle}</span>
              </h2>
            </div>
            <p className="text-xs print:text-[11px] text-slate-400">
              Respuestas estratégicas e inapelables a las preguntas más comunes de directores, gerentes y propietarios de negocio.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4 print:gap-2.5">
              {/* Pregunta 1 */}
              <div className="p-5 print:p-2.5 rounded-2xl print:rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition space-y-2.5 print:space-y-1 print-card-avoid print:overflow-visible">
                <div className="flex items-center gap-2 text-amber-400">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <h3 className="text-xs sm:text-sm print:text-xs font-bold text-white">
                    {calculations.effectiveRating >= 4.6
                      ? `¿Por qué firmar 12 meses si mi negocio ya tiene ${calculations.effectiveRating}★ en Google Maps?`
                      : `¿Por qué firmar 12 meses si en 90 días ya habremos subido a ${calculations.projectedRatingIn90Days}★?`}
                  </h3>
                </div>
                <div className="p-3 print:p-2 rounded-xl print:rounded-lg bg-slate-950 border border-slate-855 text-xs print:text-[10px] text-slate-300 leading-relaxed space-y-1.5 print:space-y-1">
                  <p>
                    {calculations.effectiveRating >= 4.6 ? (
                      <strong className="text-amber-300">Defender 4.8★ es más difícil que alcanzarlo: 1 solo descuido destruye el liderazgo.</strong>
                    ) : (
                      <strong className="text-amber-300">Alcanzar 4.9★ es conquistar la cima; mantenerlo es evitar la caída libre.</strong>
                    )}{' '}
                    Google Maps penaliza de forma implacable las fichas cuyas opiniones se enfrían (la <em>Ley de Recencia del algoritmo</em>).
                  </p>
                  <p>
                    Si cancelas al mes 3: <strong>1)</strong> Tus competidores activos te desplazarán fuera del Local 3-Pack en cuestión de semanas; y <strong>2)</strong> Al no tener el Escudo Privado activo, una sola queja de 1★ en el mes 4 desplomará de golpe la calificación ganada (requiriendo +{calculations.fiveStarReviewsToRecover} clientes seguidos de 5★ solo para amortiguar). Prestigia es como el seguro o la alarma del establecimiento: no la apagas porque no hayas tenido incidentes este trimestre.
                  </p>
                </div>
              </div>

              {/* Pregunta 2 */}
              <div className="p-5 print:p-2.5 rounded-2xl print:rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition space-y-2.5 print:space-y-1 print-card-avoid print:overflow-visible">
                <div className="flex items-center gap-2 text-emerald-400">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <h3 className="text-xs sm:text-sm print:text-xs font-bold text-white">
                    ¿Los {categoryTerms.clientLabel.toLowerCase()} realmente escanearán el QR o lo ignorarán?
                  </h3>
                </div>
                <div className="p-3 print:p-2 rounded-xl print:rounded-lg bg-slate-950 border border-slate-855 text-xs print:text-[10px] text-slate-300 leading-relaxed space-y-1.5 print:space-y-1">
                  <p>
                    <strong className="text-emerald-300">Los clientes no escanean por hacerte un favor, escanean por incentivo y gamificación.</strong> Prestigia conecta el escaneo al Sorteo Oficial de la marca y a la calificación individual del colaborador ({categoryTerms.staffSingular}) que los atendió.
                  </p>
                  <p>
                    En mediciones comprobadas, entre el <strong>25% y el 35% de los clientes</strong> escanean voluntariamente porque obtienen un beneficio tangible y sienten que su opinión tiene valor real e inmediato.
                  </p>
                </div>
              </div>

              {/* Pregunta 3 */}
              <div className="p-5 print:p-2.5 rounded-2xl print:rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition space-y-2.5 print:space-y-1 print-card-avoid print:overflow-visible">
                <div className="flex items-center gap-2 text-indigo-400">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <h3 className="text-xs sm:text-sm print:text-xs font-bold text-white">
                    ¿No penaliza Google Maps el filtrado de reseñas (Review Gating)?
                  </h3>
                </div>
                <div className="p-3 print:p-2 rounded-xl print:rounded-lg bg-slate-950 border border-slate-855 text-xs print:text-[10px] text-slate-300 leading-relaxed space-y-1.5 print:space-y-1">
                  <p>
                    <strong className="text-indigo-300">Prestigia no bloquea reseñas; resuelve la inconformidad en caliente por canal preferencial.</strong> La arquitectura de Prestigia es un canal privado de Atención Inmediata al Cliente bajo Habeas Data.
                  </p>
                  <p>
                    Cuando un cliente califica 1 a 3★, se le brinda auxilio prioritario directo con el encargado de turno en &lt; 15 segundos para resolver su caso antes de que abandone el local. El <strong>92% de los clientes molestos</strong> solo buscan ser escuchados y atendidos con respeto; al recibir una disculpa o cortesía en vivo, la necesidad de desahogarse públicamente en Google Maps se neutraliza por completo.
                  </p>
                </div>
              </div>

              {/* Pregunta 4 */}
              <div className="p-5 print:p-2.5 rounded-2xl print:rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition space-y-2.5 print:space-y-1 print-card-avoid print:overflow-visible">
                <div className="flex items-center gap-2 text-purple-400">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <h3 className="text-xs sm:text-sm print:text-xs font-bold text-white">
                    ¿Esto le generará fricción, quejas o sobrecarga a mi personal en el turno?
                  </h3>
                </div>
                <div className="p-3 print:p-2 rounded-xl print:rounded-lg bg-slate-950 border border-slate-855 text-xs print:text-[10px] text-slate-300 leading-relaxed space-y-1.5 print:space-y-1">
                  <p>
                    <strong className="text-purple-300">Cero sobrecarga operativa.</strong> El código QR va insertado de forma elegante en los habladores de mesa, la cuenta o stickers de recepción.
                  </p>
                  <p>
                    Al contrario: el Wallboard TV en tiempo real transforma la apatía en motivación sana. Los {calculations.totalStaffCount} {categoryTerms.staffLabel.toLowerCase()} compiten por brindar la mejor atención para figurar en los primeros puestos del podio, recibiendo reconocimiento objetivo, mejores propinas e incentivos medibles con datos reales, eliminando chismes internos.
                  </p>
                </div>
              </div>

              {/* Pregunta 5 (Full width) */}
              <div className="p-5 print:p-2.5 rounded-2xl print:rounded-xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 hover:border-emerald-400 transition space-y-2.5 print:space-y-1 md:col-span-2 print:col-span-2 print-card-avoid print:overflow-visible print:mt-0.5">
                <div className="flex items-center gap-2 text-emerald-400">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <h3 className="text-xs sm:text-sm print:text-xs font-bold text-white">
                    ¿Cómo sé con certeza matemática que esta inversión anual se pagará sola?
                  </h3>
                </div>
                <div className="p-3.5 print:p-2 rounded-xl print:rounded-lg bg-slate-950 border border-slate-855 text-xs print:text-[10px] text-slate-300 leading-relaxed space-y-2 print:space-y-1">
                  <p>
                    <strong className="text-emerald-300">El Retorno de Inversión es pura aritmética de retención:</strong> Con que el Escudo Privado salve tan solo <strong>2 a 3 {categoryTerms.clientLabel.toLowerCase()} al mes</strong> de marcharse para siempre a la competencia, el sistema ya cubre con creces cualquier costo operativo.
                  </p>
                  <p>
                    Todo el flujo de nuevos {categoryTerms.clientLabel.toLowerCase()} que ingresan por conquistar el <strong>Local 3-Pack de Google Maps</strong> (+{fmtNumber(calculations.newClientsFromGoogleMonthly)} {categoryTerms.clientLabel.toLowerCase()}/mes) y los <strong>+{fmtNumber(calculations.contactsCapturedMonthly)} números de WhatsApp capturados mensualmente</strong> para campañas de fidelización y recompra son pura ganancia neta para el negocio ({fmtMoney(calculations.totalAnnualFinancialBenefit)} en beneficio anual estimado).
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* PAGE 7: PROTOCOLO LEGAL & OPERATIVO DE RETENCIÓN */}
        <div className="space-y-4 print:space-y-3 print:print-sheet-last">
          {/* STEP 7: ACUERDO FORMAL DE BLINDAJE REPUTACIONAL A 12 MESES (CONTRATO EJECUTIVO) */}
          <section className="bg-slate-900/90 border-2 border-indigo-500/40 rounded-3xl print:rounded-2xl p-6 sm:p-8 print:p-4 shadow-2xl relative overflow-hidden print-avoid-break print-card-avoid print:overflow-visible">
            {/* Top Header of the Contract */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:gap-2 pb-6 print:pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 bg-indigo-950 px-3 py-1 rounded-full border border-indigo-500/40 inline-flex items-center gap-1.5 mb-2 print:mb-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Protocolo Legal & Operativo de Retención</span>
                </span>
                <h2 className="text-lg sm:text-2xl print:text-base font-black text-white">
                  Acuerdo de Blindaje Reputacional & Servicio Empresarial (12 Meses)
                </h2>
                <p className="text-xs print:text-[10px] text-slate-400 mt-0.5">
                  Instrumento ejecutivo vinculante entre <strong className="text-white">{calculations.activeTitle}</strong> y <strong className="text-indigo-300">Prestigia Reputation System LatAm</strong>.
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                <Lock className="w-4 h-4 text-emerald-400" />
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Vigencia Oficial</div>
                  <div className="text-xs font-black text-emerald-400">12 Meses Calendario</div>
                </div>
              </div>
            </div>

            {/* Clauses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4 print:gap-2.5 my-6 print:my-3 text-xs text-slate-300">
              <div className="p-4 print:p-2.5 rounded-2xl print:rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 print:space-y-1 print-card-avoid print:overflow-visible">
                <div className="flex items-center gap-2 font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="print:text-xs">1. Objeto y Alcance del Blindaje</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px] print:text-[10px]">
                  {lang === 'en'
                    ? `Full deployment of Prestigia technology infrastructure across ${calculations.branchesCount} ${calculations.branchesCount === 1 ? 'commercial venue' : 'commercial venues'}, ensuring 24/7 private complaint containment, accountability for all ${calculations.totalStaffCount} ${categoryTerms.staffLabel.toLowerCase()}, and conquest of Google Maps Local Top 3.`
                    : `Despliegue integral de la infraestructura tecnológica Prestigia para ${calculations.branchesCount} ${calculations.branchesCount === 1 ? 'sede comercial' : 'sedes comerciales'}, garantizando contención de quejas 24/7, auditoría de los ${calculations.totalStaffCount} ${categoryTerms.staffLabel.toLowerCase()} y conquista al Top 3 de Google Maps.`}
                </p>
              </div>

              <div className="p-4 print:p-2.5 rounded-2xl print:rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 print:space-y-1 print-card-avoid print:overflow-visible">
                <div className="flex items-center gap-2 font-bold text-white">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="print:text-xs">{lang === 'en' ? '2. Sustainability & Recency Commitment' : '2. Compromiso de Sostenibilidad & Recencia'}</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px] print:text-[10px]">
                  {lang === 'en'
                    ? `The Client acknowledges digital reputation is a live operational asset. To guard against Google\'s Recency Penalty (ranking drops after 30 days without reviews) and avoid the 'Broken Dam Effect', the system will run continuously for 12 months.`
                    : `El Contratante reconoce que la reputación digital es un activo vivo. Para protegerse de la Ley de Recencia de Google (penalización tras 30 días sin opiniones) y evitar el 'Efecto Dique Roto', el sistema operará ininterrumpidamente durante 12 meses.`}
                </p>
              </div>

              <div className="p-4 print:p-2.5 rounded-2xl print:rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 print:space-y-1 print-card-avoid print:overflow-visible">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span className="print:text-xs">{lang === 'en' ? '3. Deliverables & Priority Executive Support' : '3. Entregables & Soporte Prioritario'}</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px] print:text-[10px]">
                  {lang === 'en'
                    ? `Includes interactive QR materials, sub-15s private WhatsApp routing software, real-time TV Wallboard, compliant VIP customer list generation (+${fmtNumber(calculations.contactsCapturedYearly)} numbers/yr), and recurring executive audit reports.`
                    : `Incluye QR interactivos, software de desvío privado a WhatsApp (<15s), Wallboard TV en tiempo real, captura de base de datos VIP legal (+${fmtNumber(calculations.contactsCapturedYearly)} números/año) y reportes ejecutivos periódicos de rendimiento.`}
                </p>
              </div>

              <div className="p-4 print:p-2.5 rounded-2xl print:rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 print:space-y-1 print-card-avoid print:overflow-visible">
                <div className="flex items-center gap-2 font-bold text-white">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span className="print:text-xs">{lang === 'en' ? '4. Projected Financial Value' : '4. Retorno Financiero Proyectado'}</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px] print:text-[10px]">
                  {lang === 'en'
                    ? <>Estimated annual financial benefit of <strong>{fmtMoney(calculations.totalAnnualFinancialBenefit)}/yr</strong> generated through active retention of at-risk guests and new customer acquisition from Google Maps.</>
                    : <>Beneficio financiero anual estimado de <strong>{fmtMoney(calculations.totalAnnualFinancialBenefit)}/año</strong> generado entre retención activa de clientes en fuga y atracción de nuevos {categoryTerms.clientLabel.toLowerCase()} desde Google Maps.</>}
                </p>
              </div>
            </div>

            {/* Legal Validation Stamp */}
            <div className="mt-4 print:mt-2 pt-3 print:pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 gap-2">
              <div className="flex items-center gap-1.5">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.legalValidation}</span>
              </div>
              <div className="font-semibold text-slate-500">
                {t.legalCompany}
              </div>
            </div>
          </section>
        </div>

        {/* STEP 8: CLOSING ACTIONS & LIVE PITCH TOOLS */}
        <section className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border-2 border-indigo-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center print:hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/40 inline-flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Live Pitch Closing Tools' : 'Herramientas de Cierre en Caliente'}</span>
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-white">
              {lang === 'en' ? `Ready to close the deal for ${businessName || 'the brand'}?` : `¿Listo para cerrar la propuesta de ${businessName || 'la marca'}?`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {lang === 'en' 
                ? 'Generate the executive PDF report to present to the client or trigger the live interactive QR experience.'
                : 'Genera el informe ejecutivo en PDF para presentar al cliente o activa la experiencia interactiva en vivo con el código QR.'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              {/* Print / PDF Document */}
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer active:scale-98"
              >
                <Printer className="w-4 h-4" />
                <span>{lang === 'en' ? 'Generate PDF Report for Signing' : 'Generar Informe PDF para Firmar'}</span>
              </button>

              {/* Live QR Demo Modal Trigger */}
              <button
                type="button"
                onClick={() => setShowDemoModal(true)}
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-amber-500/30 cursor-pointer active:scale-98"
              >
                <QrCode className="w-4 h-4" />
                <span>{lang === 'en' ? 'Scan Live QR Demo' : 'Escanear Demo QR en Vivo'}</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    )}
  </>
)}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500 print:hidden">
        <p>{lang === 'en' ? 'Prestigia Reputation System • Commercial Business Auditor & Multi-Location Engine © 2026' : 'Prestigia Reputation System • Auditor de Negocios & Multi-Sede Commercial Engine © 2026'}</p>
      </footer>

      {/* MODAL: LIVE INTERACTIVE QR DEMO CUSTOMIZED TO AUDITED BRAND */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 print:hidden animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative text-center">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Tailored Live Interactive Experience' : 'Experiencia en Vivo Personalizada'}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              {businessName || (lang === 'en' ? 'Your Business' : 'Tu Negocio')}
            </h3>
            <p className="text-xs text-indigo-400 font-semibold mt-0.5 mb-1">
              {lang === 'en' ? 'Industry' : 'Sector'}: {category} • {calculations.activeTitle}
            </p>
            <p className="text-xs text-slate-300 max-w-md mx-auto mb-5">
              {lang === 'en'
                ? 'Point your phone camera at this QR code to experience what your customers see when rating the brand in real time.'
                : 'Apunta la cámara de tu celular a este código QR para vivir la experiencia interactiva que tendrán tus clientes al calificar la marca en tiempo real.'}
            </p>

            {/* QR Card */}
            <div className="bg-white p-4 rounded-3xl shadow-xl inline-block mx-auto mb-4 border-4 border-amber-400/40">
              {demoQrDataUrl ? (
                <img
                  src={demoQrDataUrl}
                  alt={`QR Demo de ${businessName || 'Prestigia'}`}
                  className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-xl"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs">
                  {lang === 'en' ? 'Generating QR code...' : 'Generando código QR...'}
                </div>
              )}
              <div className="pt-2 text-center">
                <span className="text-[11px] font-black tracking-widest text-slate-900 uppercase">
                  Prestigia Reputation System
                </span>
              </div>
            </div>

            {/* Features in this demo */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 mb-5 text-left">
              <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{lang === 'en' ? '1-3★ Private WhatsApp filter' : '1-3★ Filtro privado WhatsApp'}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                <span>{lang === 'en' ? '4-5★ Direct to Google Maps' : '4-5★ Directo a Google Maps'}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{lang === 'en' ? `Selector for ${categoryTerms.staffSingular}` : `Selector de ${categoryTerms.staffSingular}`}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2">
                <Gift className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{lang === 'en' ? 'Habeas Data & Raffle Capture' : 'Captura Habeas Data & Sorteo'}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <a
                href={demoTargetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/20 active:scale-98"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{lang === 'en' ? 'Open Demo on this Screen' : 'Abrir Demo en esta Pantalla'}</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== 'undefined') {
                    navigator.clipboard.writeText(demoTargetUrl);
                    setDemoCopied(true);
                    setTimeout(() => setDemoCopied(false), 2000);
                  }
                }}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer active:scale-98"
              >
                {demoCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">{lang === 'en' ? 'Link Copied!' : '¡Enlace Copiado!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-300" />
                    <span>{lang === 'en' ? 'Copy Link' : 'Copiar Enlace'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
