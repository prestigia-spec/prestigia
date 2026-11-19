'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PrestigiaIcon } from '@/components/PrestigiaIcon';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Flame,
  Users,
  ArrowRight,
  Play,
  Clock,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Award,
  TrendingUp,
  DollarSign,
  Building2,
  Globe,
  MessageSquare,
  Zap,
  ExternalLink,
  ChevronRight,
  Lock,
  Check,
  Gift,
  Star,
  Share2,
  Copy,
} from 'lucide-react';

export type MasterclassAngle = 'general' | 'ingresos-casa' | 'freelancers' | 'agencias' | 'negocios';

interface AngleCopy {
  badge: string;
  heroHeadline: string;
  heroHighlight: string;
  heroSubtitle: string;
  formTitle: string;
  formSubtitle: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
  pillar4Title: string;
  pillar4Desc: string;
  ctaButtonText: string;
}

const COPIES_ES: Record<MasterclassAngle, AngleCopy> = {
  general: {
    badge: '🔴 MASTERCLASS EN VIVO • ACCESO 100% GRATUITO',
    heroHeadline: 'Cómo Crear y Posicionar Fichas de Google Maps para',
    heroHighlight: 'Facturar de $150 a $250 USD por Servicio desde Casa',
    heroSubtitle:
      'Aprende el método paso a paso para crear fichas que atraen clientes todos los días, cómo automatizarlo con la IA de Local Studio en 10 minutos (sin saber de programación), y cómo generar comisiones mensuales recurrentes conectando clientes a Prestigia.',
    formTitle: 'Reserva tu Cupo Gratuito a la Masterclass',
    formSubtitle: 'Acceso exclusivo a la sala en vivo y materiales de trabajo.',
    pillar1Title: '1. Creación & Posicionamiento Paso a Paso',
    pillar1Desc: 'Aprenderás en vivo el proceso exacto para dar de alta y optimizar una ficha de negocio para que Google la priorice en las búsquedas locales de tu ciudad.',
    pillar2Title: '2. La Automatización con Local Studio en 10 Min',
    pillar2Desc: 'Descubrirás cómo el software hace el trabajo técnico en minutos: auditorías forenses, rescate 72h de fichas suspendidas y apelación de reseñas de 1 estrella.',
    pillar3Title: '3. El Negocio: Cobrar de $150 a $250 USD por Servicio',
    pillar3Desc: 'Te revelamos la matemática exacta: cómo cobrar tarifas de alto valor a comercios locales con una inversión operativa desde solo $49 USD al mes.',
    pillar4Title: '4. Comisiones Mensuales Recurrentes con Prestigia',
    pillar4Desc: 'Al canalizar a tus clientes a Prestigia para gestionar sus reseñas y equipo, recibes comisiones automáticas todos los meses mientras sigan activos.',
    ctaButtonText: 'RESERVAR MI CUPO GRATIS AHORA',
  },
  'ingresos-casa': {
    badge: '🏠 TRABAJO DESDE CASA • CERO EXPERIENCIA REQUERIDA',
    heroHeadline: 'Cómo Ganar de $150 a $250 USD por Servicio desde Casa',
    heroHighlight: 'Ayudando a Negocios Locales en Google Maps con IA',
    heroSubtitle:
      'Sin saber de programación, sin ser experto en marketing y sin jefes. Te enseñaremos cómo crear perfiles de Google Maps en minutos usando un sistema paso a paso que hace el trabajo pesado por ti, y cómo ganar comisiones recurrentes mes a mes.',
    formTitle: 'Comienza a Facturar desde Casa',
    formSubtitle: 'Aprende una habilidad digital rentable en una sola sesión en vivo.',
    pillar1Title: '1. 100% Desde Casa con tu Laptop',
    pillar1Desc: 'Solo necesitas una computadora y conexión a internet. Sin horarios forzados ni desplazamientos en tráfico.',
    pillar2Title: '2. Cero Conocimientos de IA o Tecnología',
    pillar2Desc: 'El software de Local Studio te guía clic a clic para generar auditorías, rescates y configuraciones listas para entregar.',
    pillar3Title: '3. Gana entre $150 y $250 USD por Cliente',
    pillar3Desc: 'Con solo 2 a 4 clientes al mes puedes generar entre $500 y $1,000 USD extra en tu tiempo libre.',
    pillar4Title: '4. Comisiones Pasivas Mes a Mes',
    pillar4Desc: 'Recomiendas el ecosistema de Prestigia a tus comercios y cobras comisiones recurrentes mes tras mes.',
    ctaButtonText: 'QUIERO APRENDER DESDE CASA GRATIS',
  },
  freelancers: {
    badge: '💼 PARA FREELANCERS, ASESORES & VENDEDORES',
    heroHeadline: 'El Negocio de Google Maps en 2026: Servicios de',
    heroHighlight: '$150 a $250 USD con Entregas en Minutos y Cierres en Frío',
    heroSubtitle:
      'El 90% de los comercios de tu ciudad están perdiendo llamadas porque su ficha está mal configurada o suspendida. Aprende a prospectar con auditorías forenses en mano, cerrar contratos de inmediato y construir comisiones mensuales recurrentes.',
    formTitle: 'Multiplica tus Ingresos como Consultor Local',
    formSubtitle: 'El servicio con mayor tasa de cierre y menor competencia local.',
    pillar1Title: '1. Prospección Demoledora con Auditorías en Mano',
    pillar1Desc: 'Muestra a cualquier dueño de negocio en 60 segundos exactamente dónde está perdiendo clientes frente a su competencia.',
    pillar2Title: '2. Portafolio Completo de Servicios Cotizados',
    pillar2Desc: 'Crea fichas Top 3, audita con reportes ejecutivos en PDF, rescata fichas caídas en 72h y remueve reseñas de 1 estrella.',
    pillar3Title: '3. Cierre Rápido y Márgenes de más del 90%',
    pillar3Desc: 'Cobras entre $150 y $250 USD por ficha. Tu costo es de solo $4.90 por crédito en tu plan de Local Studio ($49 USD/mes).',
    pillar4Title: '4. Fidelización y Comisiones Recurrentes',
    pillar4Desc: 'No te quedes en el servicio puntual: conéctalos a Prestigia para su gestión de reseñas y gana mensualidades residuales.',
    ctaButtonText: 'ACCEDER A LA MASTERCLASS PARA FREELANCERS',
  },
  agencias: {
    badge: '🏢 PARA AGENCIAS DE MARKETING & COMMUNITY MANAGERS',
    heroHeadline: 'Añade un Servicio de $500 a $1,500 USD/Mes a tu Agencia con',
    heroHighlight: '90% de Margen: Posicionamiento, Rescate y Apelación con IA',
    heroSubtitle:
      'Deja de perder horas en optimizaciones manuales de Google Business Profile. Descubre cómo sistematizar auditorías forenses, apelación legal de reseñas falsas y rescate 72h con tecnología Local Studio, delegando la operativa y escalando tu MRR.',
    formTitle: 'Escala la Facturación y Margen de tu Agencia',
    formSubtitle: 'Entrega servicios de Google Maps de nivel corporativo en minutos.',
    pillar1Title: '1. Reportes y Auditorías en Marca Blanca (White-Label)',
    pillar1Desc: 'Descarga informes ejecutivos en PDF de alta definición y Excel (.xlsx) estilizado para impresionar a tus clientes B2B.',
    pillar2Title: '2. Resuelve los Dolores Más Graves de tus Clientes',
    pillar2Desc: 'Recupera fichas inhabilitadas en 72 horas y apela reseñas destructivas de 1 a 3 estrellas con argumentos respaldados.',
    pillar3Title: '3. Alta Rentabilidad sin Aumentar Nómina',
    pillar3Desc: 'El software de Local Studio automatiza la ejecución técnica, permitiendo a tu equipo atender 10 veces más cuentas.',
    pillar4Title: '4. Aumento del LTV & Ingresos Recurrentes en Prestigia',
    pillar4Desc: 'Integra a tus clientes con la suite Prestigia para gestión de reputación y genera comisiones fijas mes a mes.',
    ctaButtonText: 'RESERVAR ACCESO VIP PARA AGENCIAS',
  },
  negocios: {
    badge: '📍 PARA DUEÑOS DE COMERCIOS & NEGOCIOS LOCALES',
    heroHeadline: 'Cómo Llevar tu Negocio Local al Top 3 de Google Maps para',
    heroHighlight: 'Multiplicar Llamadas y Clientes sin Pagar Anuncios',
    heroSubtitle:
      'Cuando las personas buscan lo que vendes en tu ciudad, llaman a los primeros 3 que aparecen en el mapa. Descubre el método paso a paso para posicionar tu local, blindar tu reputación contra reseñas falsas y rescatar tu perfil en caso de suspensión.',
    formTitle: 'Posiciona tu Negocio Local en el Top 3',
    formSubtitle: 'Domina las búsquedas de tu ciudad y multiplica tus ventas.',
    pillar1Title: '1. Tráfico Orgánico y Llamadas Diarias',
    pillar1Desc: 'Configura las categorías, atributos y palabras clave exactas que activan el algoritmo de Google Maps para tu negocio.',
    pillar2Title: '2. Apelación e Impugnación de Reseñas de 1 Estrella',
    pillar2Desc: 'Aprende los protocolos oficiales para solicitar la eliminación de comentarios injustos, difamatorios o de la competencia.',
    pillar3Title: '3. Blindaje y Rescate Rápido contra Suspensiones',
    pillar3Desc: 'Conoce las directrices para que Google nunca inhabilite tu perfil o cómo reactivarlo en 72 horas si fue suspendido.',
    pillar4Title: '4. Automatización de Reseñas de Clientes Felices',
    pillar4Desc: 'Descubre cómo Prestigia te ayuda a recolectar decenas de reseñas de 5 estrellas de tus clientes satisfechos en automático.',
    ctaButtonText: 'QUIERO MÁS CLIENTES EN MI NEGOCIO',
  },
};

const COPIES_EN: Record<MasterclassAngle, AngleCopy> = {
  general: {
    badge: '🔴 LIVE MASTERCLASS • 100% FREE ACCESS',
    heroHeadline: 'How to Build & Rank Google Maps Profiles to',
    heroHighlight: 'Earn $150 to $250 USD per Service from Home',
    heroSubtitle:
      'Learn the step-by-step method to build listings that attract customers every day, how to automate it with Local Studio AI in 10 minutes (no coding needed), and how to earn recurring monthly commissions connecting clients to Prestigia.',
    formTitle: 'Reserve Your Free Seat for the Masterclass',
    formSubtitle: 'Exclusive access to live training room and work files.',
    pillar1Title: '1. Step-by-Step Listing Creation & Ranking',
    pillar1Desc: 'Learn live the exact process to launch and optimize a local business profile so Google prioritizes it in local search results.',
    pillar2Title: '2. Automation with Local Studio in 10 Min',
    pillar2Desc: 'Discover how software does the heavy lifting in minutes: forensic audits, 72h suspended listing rescues, and 1-star review appeals.',
    pillar3Title: '3. The Business: Charge $150 to $250 USD per Client',
    pillar3Desc: 'We reveal the exact numbers: how to charge high-value fees to local businesses with an operational cost from just $49 USD/month.',
    pillar4Title: '4. Monthly Recurring Commissions with Prestigia',
    pillar4Desc: 'By funneling clients into Prestigia to manage reviews and staff, you earn passive commissions every single month.',
    ctaButtonText: 'RESERVE MY FREE SEAT NOW',
  },
  'ingresos-casa': {
    badge: '🏠 WORK FROM HOME • ZERO EXPERIENCE REQUIRED',
    heroHeadline: 'How to Earn $150 to $250 USD per Service from Home',
    heroHighlight: 'Helping Local Businesses on Google Maps with AI',
    heroSubtitle:
      'No programming, no marketing degree, and no boss. We teach you how to build Google Maps profiles in minutes using a guided step-by-step system, and how to build recurring monthly commissions from your laptop.',
    formTitle: 'Start Earning from Home',
    formSubtitle: 'Learn a profitable digital skill in a single live session.',
    pillar1Title: '1. 100% Remote from Your Laptop',
    pillar1Desc: 'All you need is a laptop and an internet connection. Work on your own schedule with zero commute.',
    pillar2Title: '2. Zero AI or Tech Knowledge Needed',
    pillar2Desc: 'Local Studio guides you click-by-click to generate ready-to-deliver audits, rescues, and listings.',
    pillar3Title: '3. Earn Between $150 and $250 USD per Client',
    pillar3Desc: 'With just 2 to 4 clients a month, you can easily generate $500 to $1,000 USD in extra income.',
    pillar4Title: '4. Passive Monthly Commissions',
    pillar4Desc: 'Recommend the Prestigia ecosystem to your business clients and earn monthly residual commissions.',
    ctaButtonText: 'START LEARNING FROM HOME FOR FREE',
  },
  freelancers: {
    badge: '💼 FOR FREELANCERS, ADVISORS & CLOSERS',
    heroHeadline: 'The Google Maps Business in 2026: Deliver',
    heroHighlight: '$150 to $250 USD Services in Minutes with Cold Closes',
    heroSubtitle:
      '90% of local shops in your city lose phone calls due to poorly configured or suspended profiles. Learn how to prospect with visual audits in hand, close on the spot, and generate recurring monthly commissions.',
    formTitle: 'Multiply Your Freelance Income',
    formSubtitle: 'The digital service with the highest closing rate and least local competition.',
    pillar1Title: '1. Powerful Prospecting with Visual Audits',
    pillar1Desc: 'Show any business owner in 60 seconds exactly where they are losing high-paying customers to competitors.',
    pillar2Title: '2. Complete In-Demand Service Catalog',
    pillar2Desc: 'Create Top 3 profiles, audit with executive PDF reports, rescue suspended accounts in 72h, and challenge 1-star reviews.',
    pillar3Title: '3. Fast Turnaround & 90%+ Profit Margins',
    pillar3Desc: 'Charge $150 to $250 USD per profile. Your operational cost is just $4.90 per credit with Local Studio ($49 USD/mo).',
    pillar4Title: '4. Client Retention & Monthly Residuals',
    pillar4Desc: 'Don’t stop at one-off setup: plug them into Prestigia for reputation management and get paid every single month.',
    ctaButtonText: 'JOIN THE MASTERCLASS FOR FREELANCERS',
  },
  agencias: {
    badge: '🏢 FOR MARKETING AGENCIES & MEDIA BUYERS',
    heroHeadline: 'Add a $500 to $1,500 USD/Month Service to Your Agency with',
    heroHighlight: '90% Net Margin: Google Maps Optimization, Rescue & Appeal',
    heroSubtitle:
      'Stop wasting hours on manual Google Business Profile tasks. Discover how to systematize forensic audits, legal review appeals, and 72h account recovery with Local Studio, freeing your team while scaling agency MRR.',
    formTitle: 'Scale Your Agency Margins & Revenue',
    formSubtitle: 'Deliver enterprise-grade Google Maps solutions in minutes.',
    pillar1Title: '1. 100% White-Label Client Reports',
    pillar1Desc: 'Export polished executive PDF audits and styled Excel spreadsheets branded to impress enterprise clients.',
    pillar2Title: '2. Solve Your Clients’ Pain Points Fast',
    pillar2Desc: 'Recover suspended listings in 72 hours and dispute defamatory 1-star reviews using proven policies.',
    pillar3Title: '3. High Margins Without Hiring Staff',
    pillar3Desc: 'Local Studio automates technical execution, empowering your team to handle 10x more client accounts.',
    pillar4Title: '4. Maximize LTV & Recurring Subscriptions',
    pillar4Desc: 'Onboard clients to the Prestigia suite for review management and earn recurring revenue every month.',
    ctaButtonText: 'CLAIM AGENCY VIP SEAT',
  },
  negocios: {
    badge: '📍 FOR LOCAL BUSINESS OWNERS & STORE OWNERS',
    heroHeadline: 'How to Rank Your Local Business in the Top 3 of Google Maps to',
    heroHighlight: 'Multiply Phone Calls & Walk-in Customers Without Paid Ads',
    heroSubtitle:
      'When buyers search for your products in your town, they call the top 3 on the map. Learn the step-by-step method to rank your storefront, shield your reputation against fake reviews, and rescue suspended profiles.',
    formTitle: 'Rank Your Local Business in Top 3',
    formSubtitle: 'Dominate your local city searches and boost in-store revenue.',
    pillar1Title: '1. Free Organic Traffic & Daily Calls',
    pillar1Desc: 'Set up the exact categories, attributes, and local keywords that trigger Google’s ranking algorithm.',
    pillar2Title: '2. Removal & Appeal of Unfair 1-Star Reviews',
    pillar2Desc: 'Learn the official dispute protocols to remove defamatory or competitor attacks hurting your rating.',
    pillar3Title: '3. Protection & Fast 72-Hour Account Recovery',
    pillar3Desc: 'Keep your listing compliant so Google never suspends it, or recover it fast if already flagged.',
    pillar4Title: '4. Automated 5-Star Reviews from Happy Clients',
    pillar4Desc: 'Discover how Prestigia collects dozens of authentic 5-star reviews on autopilot.',
    ctaButtonText: 'I WANT MORE CUSTOMERS IN MY STORE',
  },
};

const COUNTRY_CODES = [
  { code: '+57', flag: '🇨🇴', name: 'Colombia' },
  { code: '+1', flag: '🇺🇸', name: 'USA / Canadá' },
  { code: '+52', flag: '🇲🇽', name: 'México' },
  { code: '+34', flag: '🇪🇸', name: 'España' },
  { code: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: '+56', flag: '🇨🇱', name: 'Chile' },
  { code: '+51', flag: '🇵🇪', name: 'Perú' },
  { code: '+593', flag: '🇪🇨', name: 'Ecuador' },
  { code: '+507', flag: '🇵🇦', name: 'Panamá' },
  { code: '+506', flag: '🇨🇷', name: 'Costa Rica' },
  { code: '+502', flag: '🇬🇹', name: 'Guatemala' },
  { code: '+591', flag: '🇧🇴', name: 'Bolivia' },
  { code: '+598', flag: '🇺🇾', name: 'Uruguay' },
  { code: '+58', flag: '🇻🇪', name: 'Venezuela' },
];

function MasterclassContent() {
  const searchParams = useSearchParams();
  const rawAngle = searchParams.get('angle') as MasterclassAngle | null;
  const rawRef = searchParams.get('ref') || searchParams.get('amigo') || searchParams.get('invitado') || '';

  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [selectedAngle, setSelectedAngle] = useState<MasterclassAngle>('general');

  // Form State
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+57');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('independent');
  const [city, setCity] = useState('');
  const [referralCode, setReferralCode] = useState(rawRef || '');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredLeadData, setRegisteredLeadData] = useState<{ id?: string; groupUrl?: string } | null>(null);

  // Initialize Angle & Referral from URL query parameters
  useEffect(() => {
    if (rawAngle && COPIES_ES[rawAngle]) {
      setSelectedAngle(rawAngle);
    }
  }, [rawAngle]);

  useEffect(() => {
    if (rawRef) {
      setReferralCode(rawRef.toLowerCase().trim());
    }
  }, [rawRef]);

  const isEn = lang === 'en';
  const copy = isEn ? COPIES_EN[selectedAngle] : COPIES_ES[selectedAngle];

  // Countdown Timer: Targets official date: Jueves 10 de Diciembre 2026 at 7:00 PM Colombia/Miami time (2026-12-10T19:00:00-05:00)
  const targetDate = useMemo(() => {
    return new Date('2026-12-10T19:00:00-05:00');
  }, []);

  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 21,
    hours: 6,
    minutes: 15,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim()) {
      alert(isEn ? 'Please fill in your name and WhatsApp number.' : 'Por favor ingresa tu nombre y número de WhatsApp.');
      return;
    }

    setIsSubmitting(true);
    try {
      const fullPhone = `${countryCode}${phoneNumber.replace(/[^0-9]/g, '')}`;
      const payload = {
        fullName: fullName.trim(),
        phone: fullPhone,
        email: email.trim() || undefined,
        role,
        city: city.trim() || 'Bogotá',
        angle: selectedAngle,
        referralCode: referralCode.trim() || rawRef || 'directo',
        utmSource: searchParams.get('utm_source') || 'direct',
        utmCampaign: searchParams.get('utm_campaign') || 'masterclass_2026',
      };

      const res = await fetch('/api/masterclass/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRegisteredLeadData({
          id: data.leadId,
          groupUrl: data.whatsappGroupUrl || 'https://chat.whatsapp.com/Gj9X7pP1o8sK4y2zQ',
        });
        setShowSuccessModal(true);
      } else {
        alert(data.error || (isEn ? 'Error submitting registration.' : 'Error al procesar el registro.'));
      }
    } catch (err) {
      console.error(err);
      alert(isEn ? 'Network error. Please try again.' : 'Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06080E] text-slate-100 font-sans antialiased selection:bg-amber-500/20 selection:text-amber-300">
      {/* 1. TOP ANNOUNCEMENT & BILINGUAL NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <PrestigiaIcon className="w-8 h-8 text-amber-400 group-hover:scale-105 transition" />
              <div className="leading-none">
                <span className="font-black text-sm tracking-widest text-white block">PRESTIGIA</span>
                <span className="text-[10px] text-amber-400 font-black tracking-widest uppercase block">LOCAL STUDIO</span>
              </div>
            </Link>
          </div>

          {/* Selector de Idiomas */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-0.5 rounded-xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setLang('es')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  lang === 'es' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                🇨🇴 ES
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  lang === 'en' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                🇺🇸 EN
              </button>
            </div>
          </div>
        </div>

        {/* SELECTOR INTERACTIVO DE ÁNGULO (Pestañas Dinámicas si el usuario quiere explorar) */}
        <div className="bg-slate-900/60 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-2 whitespace-nowrap text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] hidden md:inline">
              {isEn ? '🎯 Tailored for:' : '🎯 Enfoque adaptado para:'}
            </span>

            <button
              type="button"
              onClick={() => setSelectedAngle('general')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                selectedAngle === 'general'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEn ? 'All Audiences' : '🌟 General'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedAngle('ingresos-casa')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                selectedAngle === 'ingresos-casa'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>🏠</span>
              <span>{isEn ? 'From Home (Beginners)' : '🏠 Ingresos desde Casa'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedAngle('freelancers')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                selectedAngle === 'freelancers'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>💼</span>
              <span>{isEn ? 'Freelancers & Closers' : '💼 Freelancers & Asesores'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedAngle('agencias')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                selectedAngle === 'agencias'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>🏢</span>
              <span>{isEn ? 'Marketing Agencies' : '🏢 Agencias de Marketing'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedAngle('negocios')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                selectedAngle === 'negocios'
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>📍</span>
              <span>{isEn ? 'Local Business Owners' : '📍 Dueños de Negocio'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION & REGISTRATION FORM CONTAINER */}
      <section className="relative pt-8 pb-16 px-4 sm:px-6 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-[300px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* LADO IZQUIERDO: Promesa, Titular Dinámico, Contador y Beneficios (Col 7) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge de Campaña */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-black text-xs uppercase tracking-wider animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                <span>{copy.badge}</span>
              </div>

              {/* Titular Principal */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.12]">
                {copy.heroHeadline}{' '}
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  {copy.heroHighlight}
                </span>
              </h1>

              {/* Subtítulo */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                {copy.heroSubtitle}
              </p>

              {/* CONTADOR REGRESIVO HACIA EL EVENTO EN VIVO */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-800/80">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>{isEn ? '🗓 Thursday, Dec 10 • 7:00 PM EST' : '🗓 Jueves, 10 de Diciembre • 7:00 PM (Col/Miami)'}</span>
                  </span>
                  <span className="text-emerald-400 font-mono text-[11px]">
                    {isEn ? '⚡ Limited Seats Available' : '⚡ Cupos de Transmisión Limitados'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isEn ? 'Opening Live Room in:' : 'La sala en vivo abre en:'}</span>
                  </span>
                  <span className="text-amber-300 font-mono text-[10px]">
                    {isEn ? '🔴 Live Private Session' : '🔴 Transmisión Privada'}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center pt-1 font-mono">
                  <div className="p-2 sm:p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <strong className="text-2xl sm:text-3xl font-black text-amber-400 block">{String(timeLeft.days).padStart(2, '0')}</strong>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">{isEn ? 'Days' : 'Días'}</span>
                  </div>
                  <div className="p-2 sm:p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <strong className="text-2xl sm:text-3xl font-black text-white block">{String(timeLeft.hours).padStart(2, '0')}</strong>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">{isEn ? 'Hours' : 'Horas'}</span>
                  </div>
                  <div className="p-2 sm:p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <strong className="text-2xl sm:text-3xl font-black text-white block">{String(timeLeft.minutes).padStart(2, '0')}</strong>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">{isEn ? 'Min' : 'Min'}</span>
                  </div>
                  <div className="p-2 sm:p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <strong className="text-2xl sm:text-3xl font-black text-emerald-400 block">{String(timeLeft.seconds).padStart(2, '0')}</strong>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">{isEn ? 'Sec' : 'Seg'}</span>
                  </div>
                </div>
              </div>

              {/* Badge del Anfitrión / Autoridad */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-lg flex items-center justify-center shrink-0">
                  👑
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-white text-sm font-bold">Luisma</strong>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30">
                      Director General
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isEn
                      ? 'Founder of Prestigia & Creator of Local Studio AI Ecosystem.'
                      : 'Fundador de Prestigia & Creador del Ecosistema Local Studio.'}
                  </p>
                </div>
              </div>
            </div>

            {/* LADO DERECHO: FORMULARIO DE REGISTRO DE ALTA CONVERSIÓN (Col 5) */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden ring-1 ring-amber-500/20">
                <div className="space-y-1 mb-5">
                  <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-wider">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>{isEn ? 'Instant Free Registration' : 'Registro Inmediato 100% Gratuito'}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{copy.formTitle}</h3>
                  <p className="text-xs text-slate-400">{copy.formSubtitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {/* Nombre */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      {isEn ? 'Your Full Name *' : 'Tu Nombre Completo *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={isEn ? 'e.g. Carlos Rodriguez' : 'Ej: Carlos Rodríguez'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 text-xs"
                    />
                  </div>

                  {/* WhatsApp con Selector de País */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      {isEn ? 'WhatsApp Phone (Where we send the live room link) *' : 'Número de WhatsApp (Donde enviaremos el enlace de la sala) *'}
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="px-2 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs cursor-pointer shrink-0"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code + c.name} value={c.code} className="bg-slate-900 text-white">
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder={isEn ? 'e.g. 300 123 4567' : 'Ej: 300 123 4567'}
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Correo Electrónico */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      {isEn ? 'Email Address (For backup reminders)' : 'Correo Electrónico (Para recordatorios de acceso)'}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tunombre@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 text-xs"
                    />
                  </div>

                  {/* Perfil de Asistente */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        {isEn ? 'What is your current profile?' : '¿Cuál es tu perfil actual?'}
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-xs cursor-pointer"
                      >
                        <option value="independent">{isEn ? 'Freelancer / Independent' : 'Independiente / Ventas'}</option>
                        <option value="beginner">{isEn ? 'Want to earn from home' : 'Quiero generar ingresos desde casa'}</option>
                        <option value="agency">{isEn ? 'Marketing Agency / Consultant' : 'Agencia de Marketing / Consultor'}</option>
                        <option value="business_owner">{isEn ? 'Local Business Owner' : 'Dueño de Negocio Local'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        {isEn ? 'City / Country' : 'Ciudad / País'}
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder={isEn ? 'e.g. Miami, FL' : 'Ej: Bogotá, Colombia'}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 text-xs"
                      />
                    </div>
                  </div>

                  {/* Código de Invitado / Referido (Amigo) */}
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <label className="text-slate-300 flex items-center gap-1">
                        <span>🎟️ {isEn ? 'Invited by a friend? (Optional code):' : '¿Te invitó un amigo? (Código opcional):'}</span>
                      </label>
                      {referralCode && (
                        <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          ✓ @{referralCode}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                      placeholder={isEn ? 'e.g. carlos, pedro, juan...' : 'Ej: carlos, pedro, juan...'}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 text-xs font-mono"
                    />
                  </div>

                  {/* Botón de Envío */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider transition cursor-pointer shadow-lg shadow-amber-500/25 active:scale-98 flex items-center justify-center gap-2 border border-amber-300/40"
                  >
                    {isSubmitting ? (
                      <span>{isEn ? 'Reserving your seat...' : 'Reservando tu cupo...'}</span>
                    ) : (
                      <>
                        <span>{copy.ctaButtonText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1 pt-1">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>{isEn ? 'Your information is 100% confidential. No spam.' : 'Tus datos están 100% protegidos. Cero spam.'}</span>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LOS 4 PILARES DE LA MASTERCLASS (LA CADENA DE VALOR) */}
      <section className="py-14 bg-slate-950 border-y border-slate-800 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest block">
              {isEn ? 'WHAT YOU WILL LEARN IN THE LIVE SESSION' : 'EL CONTENIDO EXACTO DE LA CLASE EN VIVO'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {isEn
                ? 'The 4 Stages of the Google Maps & AI Revenue Machine'
                : 'Las 4 Etapas del Negocio de Google Maps & Local Studio'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {isEn
                ? 'A practical, zero-fluff breakdown showing both manual listing setup and 10-minute AI execution.'
                : 'Una sesión práctica, directa al grano, donde aprenderás tanto la configuración manual como la automatización con IA.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pilar 1 */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 relative overflow-hidden group hover:border-amber-400/40 transition">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 font-black text-lg flex items-center justify-center">
                📍
              </div>
              <h3 className="text-lg font-black text-white">{copy.pillar1Title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{copy.pillar1Desc}</p>
            </div>

            {/* Pilar 2 */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 relative overflow-hidden group hover:border-emerald-400/40 transition">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 font-black text-lg flex items-center justify-center">
                ⚡
              </div>
              <h3 className="text-lg font-black text-white">{copy.pillar2Title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{copy.pillar2Desc}</p>
            </div>

            {/* Pilar 3 */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 relative overflow-hidden group hover:border-amber-400/40 transition">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 font-black text-lg flex items-center justify-center">
                💰
              </div>
              <h3 className="text-lg font-black text-white">{copy.pillar3Title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{copy.pillar3Desc}</p>
            </div>

            {/* Pilar 4 */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 relative overflow-hidden group hover:border-purple-400/40 transition">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 font-black text-lg flex items-center justify-center">
                🔄
              </div>
              <h3 className="text-lg font-black text-white">{copy.pillar4Title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{copy.pillar4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PREVIEW DE LAS 5 HERRAMIENTAS DE LOCAL STUDIO */}
      <section className="py-14 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black text-emerald-400 uppercase tracking-widest block">
            {isEn ? 'THE SUITE YOU WILL SEE LIVE' : 'LA TECNOLOGÍA QUE VERÁS EN ACCIÓN EN VIVO'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {isEn ? 'The 5 High-Demand Services of Prestigia Local Studio' : 'Los 5 Servicios Más Cotizados de Prestigia Local Studio'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {isEn
              ? 'Deliveries that normally take days, generated in 10 minutes with client-ready PDF and Excel dossiers.'
              : 'Trabajos que normalmente toman días, generados en minutos con dossieres en PDF y Excel listos para facturar.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 text-center space-y-2">
            <span className="text-2xl block">🏗️</span>
            <strong className="text-white font-bold block">{isEn ? 'Top 3 Creation' : 'Creación Ficha Top 3'}</strong>
            <p className="text-[11px] text-slate-400">{isEn ? 'Optimized profiles built for local search dominance.' : 'Alta optimizada que activa el algoritmo local.'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-blue-500/30 text-center space-y-2">
            <span className="text-2xl block">🔬</span>
            <strong className="text-white font-bold block">{isEn ? 'Forensic Audit' : 'Auditoría Forense'}</strong>
            <p className="text-[11px] text-slate-400">{isEn ? 'Visual PDF dossiers to close business owners on cold calls.' : 'Reportes visuales para cerrar clientes en frío.'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 text-center space-y-2">
            <span className="text-2xl block">🛡️</span>
            <strong className="text-white font-bold block">{isEn ? '72-Hour Rescue' : 'Rescate 72h'}</strong>
            <p className="text-[11px] text-slate-400">{isEn ? 'Recovery protocols for suspended or flagged listings.' : 'Reactiva perfiles inhabilitados o rechazados.'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/30 text-center space-y-2">
            <span className="text-2xl block">⚖️</span>
            <strong className="text-white font-bold block">{isEn ? '1-Star Appeals' : 'Apelación 1-3★'}</strong>
            <p className="text-[11px] text-slate-400">{isEn ? 'Legal dispute workflows against fake or unfair reviews.' : 'Impugnación de reseñas falsas o ataques.'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/30 text-center space-y-2">
            <span className="text-2xl block">🎯</span>
            <strong className="text-white font-bold block">{isEn ? 'Prospect & Pitch' : 'Prospección & Cierre'}</strong>
            <p className="text-[11px] text-slate-400">{isEn ? 'Ready-to-send commercial proposals with market rates.' : 'Propuestas comerciales con baremos sugeridos.'}</p>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="py-8 border-t border-slate-800 text-center text-xs text-slate-500 space-y-2">
        <p className="font-medium text-slate-400">
          👑 Prestigia Local Studio • {isEn ? 'Official Live Masterclass 2026' : 'Masterclass Oficial en Vivo 2026'}
        </p>
        <p className="text-[11px]">
          {isEn
            ? 'All rights reserved. Prestigia is a trademark registered for B2B local business intelligence.'
            : 'Todos los derechos reservados. Prestigia es una marca registrada de inteligencia de negocios locales.'}
        </p>
      </footer>

      {/* 6. MODAL DE CONFIRMACIÓN DE ÉXITO & PASO AL GRUPO VIP DE WHATSAPP */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center space-y-5 shadow-2xl relative overflow-hidden ring-1 ring-amber-500/30">
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-emerald-500/20 blur-3xl pointer-events-none" />

            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              🎉
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest block">
                {isEn ? 'SEAT CONFIRMED!' : '¡TU CUPO ESTÁ RESERVADO!'}
              </span>
              <h3 className="text-2xl font-black text-white">
                {isEn ? 'Final Mandatory Step:' : 'Paso Final Obligatorio:'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isEn
                  ? 'To receive the private live broadcast link, work templates, and access instructions, you must join our Official VIP WhatsApp Group.'
                  : 'Para recibir el enlace privado de acceso a la sala de transmisión en vivo, recordatorios y el material de trabajo, únete de inmediato al Grupo Oficial VIP de WhatsApp.'}
              </p>
            </div>

            {/* BOTÓN AL GRUPO VIP DE WHATSAPP */}
            <div className="pt-2">
              <a
                href={registeredLeadData?.groupUrl || 'https://chat.whatsapp.com/Gj9X7pP1o8sK4y2zQ'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-600/30 active:scale-98 animate-pulse"
              >
                <MessageSquare className="w-5 h-5 fill-white" />
                <span>{isEn ? 'JOIN VIP WHATSAPP GROUP' : 'UNIRME AL GRUPO VIP DE WHATSAPP'}</span>
              </a>
            </div>

            <p className="text-[11px] text-slate-400">
              {isEn
                ? '🔒 The group is strictly private. Only official live room links and high-value materials will be shared.'
                : '🔒 El grupo se mantiene cerrado para evitar spam. Solo compartiremos el enlace de la sala y materiales de alto valor.'}
            </p>

            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="text-xs text-slate-400 hover:text-white transition cursor-pointer font-bold underline"
            >
              {isEn ? 'Close this window' : 'Cerrar esta ventana'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MasterclassPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#06080E] text-white flex items-center justify-center">Cargando Masterclass...</div>}>
      <MasterclassContent />
    </Suspense>
  );
}
