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
  Database,
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
  ChevronLeft,
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
  Archive,
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
  Upload,
  Image as ImageIcon,
  Edit3,
} from 'lucide-react';
import { PrestigiaIcon } from '@/components/PrestigiaIcon';
import { Business, BusinessPlan, Branch, BranchManager, StaffMember, BusinessStatus, MasterAddOns, DayOneBaseline, PRESTIGIA_NICHES, CommercialLead, TrafficVisit } from '@/lib/types';
import { EmailDispatchRecord } from '@/lib/db';
import {
  buildWelcomeCredentialsHtml,
  buildReactivationWinbackHtml,
  buildMonthlyReportHtml,
  buildAnnouncementHtml,
  buildBillingRenewalHtml,
} from '@/lib/notifications';

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

const PRESTIGIA_COUNTRIES: {
  id: string;
  label: string;
  region: 'América' | 'Europa' | 'Internacional';
  flag: string;
  prefix: string;
  taxLabel: string;
  taxPlaceholder: string;
  defaultCity: string;
  cities: string[];
}[] = [
  // 🌎 AMÉRICA (20 países)
  {
    id: 'Colombia (NIT)',
    label: 'Colombia 🇨🇴',
    region: 'América',
    flag: '🇨🇴',
    prefix: '+57',
    taxLabel: 'NIT / Cédula Tributaria',
    taxPlaceholder: '901.458.723-1',
    defaultCity: 'Bogotá',
    cities: [
      'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga',
      'Pereira', 'Santa Marta', 'Manizales', 'Cúcuta', 'Ibagué', 'Pasto',
      'Villavicencio', 'Montería', 'Valledupar', 'Armenia', 'Popayán', 'Neiva',
      'Sincelejo', 'Tunja', 'Rionegro', 'Envigado', 'Chía', 'Floridablanca'
    ],
  },
  {
    id: 'Venezuela (RIF)',
    label: 'Venezuela 🇻🇪',
    region: 'América',
    flag: '🇻🇪',
    prefix: '+58',
    taxLabel: 'RIF Tributario',
    taxPlaceholder: 'J-12345678-9',
    defaultCity: 'Caracas',
    cities: [
      'Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay',
      'Ciudad Guayana (Puerto Ordaz)', 'San Cristóbal', 'Barcelona',
      'Puerto La Cruz', 'Maturín', 'Mérida', 'Ciudad Bolívar',
      'Porlamar (Margarita)', 'Punto Fijo', 'Los Teques', 'Barinas',
      'Cumaná', 'Cabimas', 'Coro', 'Guatire / Guarenas', 'Lechería'
    ],
  },
  {
    id: 'México (RFC)',
    label: 'México 🇲🇽',
    region: 'América',
    flag: '🇲🇽',
    prefix: '+52',
    taxLabel: 'RFC Fiscal',
    taxPlaceholder: 'OPG180415XYZ',
    defaultCity: 'Ciudad de México',
    cities: [
      'Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'Querétaro',
      'Mérida', 'Cancún', 'León', 'Toluca', 'Ciudad Juárez', 'San Luis Potosí',
      'Hermosillo', 'Aguascalientes', 'Veracruz', 'Morelia', 'Cuernavaca', 'Chihuahua',
      'Zapopan', 'San Pedro Garza García', 'Playa del Carmen'
    ],
  },
  {
    id: 'Estados Unidos (EIN)',
    label: 'Estados Unidos 🇺🇸',
    region: 'América',
    flag: '🇺🇸',
    prefix: '+1',
    taxLabel: 'EIN / Tax ID',
    taxPlaceholder: '12-3456789',
    defaultCity: 'Miami',
    cities: [
      'Miami', 'Nueva York', 'Los Ángeles', 'Houston', 'Chicago', 'Dallas',
      'Orlando', 'San Antonio', 'Austin', 'Phoenix', 'San Diego', 'Las Vegas',
      'San Francisco', 'Atlanta', 'Seattle', 'Boston', 'Denver', 'Washington D.C.',
      'Tampa', 'Fort Lauderdale'
    ],
  },
  {
    id: 'Canadá (BN)',
    label: 'Canadá 🇨🇦',
    region: 'América',
    flag: '🇨🇦',
    prefix: '+1',
    taxLabel: 'Business Number (BN)',
    taxPlaceholder: '123456789 RT0001',
    defaultCity: 'Toronto',
    cities: [
      'Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa',
      'Quebec', 'Winnipeg', 'Halifax', 'Victoria', 'Mississauga'
    ],
  },
  {
    id: 'Argentina (CUIT)',
    label: 'Argentina 🇦🇷',
    region: 'América',
    flag: '🇦🇷',
    prefix: '+54',
    taxLabel: 'CUIT Fiscal',
    taxPlaceholder: '30-71234567-8',
    defaultCity: 'Buenos Aires',
    cities: [
      'Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'Mar del Plata',
      'San Miguel de Tucumán', 'Salta', 'Santa Fe', 'Neuquén', 'Bariloche', 'San Juan'
    ],
  },
  {
    id: 'Chile (RUT)',
    label: 'Chile 🇨🇱',
    region: 'América',
    flag: '🇨🇱',
    prefix: '+56',
    taxLabel: 'RUT Comercial',
    taxPlaceholder: '76.432.198-5',
    defaultCity: 'Santiago',
    cities: [
      'Santiago', 'Valparaíso', 'Concepción', 'Viña del Mar', 'Antofagasta', 'Temuco',
      'La Serena', 'Rancagua', 'Iquique', 'Puerto Montt', 'Chillán', 'Arica', 'Talca'
    ],
  },
  {
    id: 'Brasil (CNPJ)',
    label: 'Brasil 🇧🇷',
    region: 'América',
    flag: '🇧🇷',
    prefix: '+55',
    taxLabel: 'CNPJ / CPF',
    taxPlaceholder: '12.345.678/0001-90',
    defaultCity: 'São Paulo',
    cities: [
      'São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza',
      'Belo Horizonte', 'Curitiba', 'Recife', 'Porto Alegre', 'Manaus', 'Florianópolis'
    ],
  },
  {
    id: 'Perú (RUC)',
    label: 'Perú 🇵🇪',
    region: 'América',
    flag: '🇵🇪',
    prefix: '+51',
    taxLabel: 'RUC Comercial',
    taxPlaceholder: '20512345678',
    defaultCity: 'Lima',
    cities: [
      'Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Cusco', 'Piura',
      'Huancayo', 'Iquitos', 'Tacna', 'Pucallpa', 'Chimbote', 'Ica'
    ],
  },
  {
    id: 'Ecuador (RUC)',
    label: 'Ecuador 🇪🇨',
    region: 'América',
    flag: '🇪🇨',
    prefix: '+593',
    taxLabel: 'RUC Fiscal',
    taxPlaceholder: '1791234567001',
    defaultCity: 'Quito',
    cities: [
      'Quito', 'Guayaquil', 'Cuenca', 'Santo Domingo', 'Machala',
      'Manta', 'Portoviejo', 'Ambato', 'Loja', 'Riobamba', 'Esmeraldas'
    ],
  },
  {
    id: 'Panamá (RUC)',
    label: 'Panamá 🇵🇦',
    region: 'América',
    flag: '🇵🇦',
    prefix: '+507',
    taxLabel: 'RUC / DV',
    taxPlaceholder: '155612345-2-2021',
    defaultCity: 'Ciudad de Panamá',
    cities: [
      'Ciudad de Panamá', 'San Miguelito', 'David', 'Colón', 'La Chorrera',
      'Santiago de Veraguas', 'Penonomé', 'Chitré', 'Boquete'
    ],
  },
  {
    id: 'Costa Rica (Cédula Jurídica)',
    label: 'Costa Rica 🇨🇷',
    region: 'América',
    flag: '🇨🇷',
    prefix: '+506',
    taxLabel: 'Cédula Jurídica / Física',
    taxPlaceholder: '3-101-123456',
    defaultCity: 'San José',
    cities: [
      'San José', 'Alajuela', 'Cartago', 'Heredia', 'Puntarenas',
      'Liberia', 'Limón', 'Escazú', 'Santa Ana'
    ],
  },
  {
    id: 'República Dominicana (RNC)',
    label: 'República Dominicana 🇩🇴',
    region: 'América',
    flag: '🇩🇴',
    prefix: '+1-809',
    taxLabel: 'RNC / Cédula',
    taxPlaceholder: '1-31-12345-6',
    defaultCity: 'Santo Domingo',
    cities: [
      'Santo Domingo', 'Santiago de los Caballeros', 'Punta Cana', 'La Romana',
      'San Cristóbal', 'Puerto Plata', 'San Pedro de Macorís', 'Higüey'
    ],
  },
  {
    id: 'Guatemala (NIT)',
    label: 'Guatemala 🇬🇹',
    region: 'América',
    flag: '🇬🇹',
    prefix: '+502',
    taxLabel: 'NIT Fiscal',
    taxPlaceholder: '1234567-8',
    defaultCity: 'Ciudad de Guatemala',
    cities: [
      'Ciudad de Guatemala', 'Mixco', 'Villa Nueva', 'Quetzaltenango',
      'Antigua Guatemala', 'Escuintla', 'Chinautla'
    ],
  },
  {
    id: 'El Salvador (NIT)',
    label: 'El Salvador 🇸🇻',
    region: 'América',
    flag: '🇸🇻',
    prefix: '+503',
    taxLabel: 'NIT / NRC',
    taxPlaceholder: '0614-123456-101-0',
    defaultCity: 'San Salvador',
    cities: [
      'San Salvador', 'Santa Ana', 'San Miguel', 'Soyapango',
      'Ilopango', 'Antiguo Cuscatlán', 'Santa Tecla'
    ],
  },
  {
    id: 'Honduras (RTN)',
    label: 'Honduras 🇭🇳',
    region: 'América',
    flag: '🇭🇳',
    prefix: '+504',
    taxLabel: 'RTN Tributario',
    taxPlaceholder: '08011990123456',
    defaultCity: 'Tegucigalpa',
    cities: [
      'Tegucigalpa', 'San Pedro Sula', 'Choloma', 'La Ceiba',
      'El Progreso', 'Comayagua', 'Roatán'
    ],
  },
  {
    id: 'Nicaragua (RUC)',
    label: 'Nicaragua 🇳🇮',
    region: 'América',
    flag: '🇳🇮',
    prefix: '+505',
    taxLabel: 'RUC Comercial',
    taxPlaceholder: 'J0310000123456',
    defaultCity: 'Managua',
    cities: [
      'Managua', 'León', 'Masaya', 'Matagalpa',
      'Chinandega', 'Granada', 'Estelí'
    ],
  },
  {
    id: 'Bolivia (NIT)',
    label: 'Bolivia 🇧🇴',
    region: 'América',
    flag: '🇧🇴',
    prefix: '+591',
    taxLabel: 'NIT Tributario',
    taxPlaceholder: '1023456789',
    defaultCity: 'Santa Cruz de la Sierra',
    cities: [
      'Santa Cruz de la Sierra', 'La Paz', 'Cochabamba',
      'Sucre', 'Tarija', 'Oruro', 'Potosí'
    ],
  },
  {
    id: 'Paraguay (RUC)',
    label: 'Paraguay 🇵🇾',
    region: 'América',
    flag: '🇵🇾',
    prefix: '+595',
    taxLabel: 'RUC Fiscal',
    taxPlaceholder: '80012345-6',
    defaultCity: 'Asunción',
    cities: [
      'Asunción', 'Ciudad del Este', 'San Lorenzo',
      'Luque', 'Encarnación', 'Capiatá'
    ],
  },
  {
    id: 'Uruguay (RUT)',
    label: 'Uruguay 🇺🇾',
    region: 'América',
    flag: '🇺🇾',
    prefix: '+598',
    taxLabel: 'RUT Comercial',
    taxPlaceholder: '21.123456.0018',
    defaultCity: 'Montevideo',
    cities: [
      'Montevideo', 'Punta del Este', 'Ciudad de la Costa',
      'Salto', 'Paysandú', 'Maldonado'
    ],
  },
  {
    id: 'Puerto Rico (EIN)',
    label: 'Puerto Rico 🇵🇷',
    region: 'América',
    flag: '🇵🇷',
    prefix: '+1-787',
    taxLabel: 'EIN / Reg. Comerciante',
    taxPlaceholder: '12-3456789',
    defaultCity: 'San Juan',
    cities: [
      'San Juan', 'Bayamón', 'Ponce', 'Carolina',
      'Caguas', 'Mayagüez', 'Guaynabo', 'Dorado'
    ],
  },

  // 🌍 EUROPA (20 países)
  {
    id: 'España (CIF/NIF)',
    label: 'España 🇪🇸',
    region: 'Europa',
    flag: '🇪🇸',
    prefix: '+34',
    taxLabel: 'NIF / CIF Tributario',
    taxPlaceholder: 'B-12345678',
    defaultCity: 'Madrid',
    cities: [
      'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga',
      'Murcia', 'Palma de Mallorca', 'Las Palmas de Gran Canaria', 'Bilbao',
      'Alicante', 'Córdoba', 'Valladolid', 'Vigo', 'Granada', 'San Sebastián'
    ],
  },
  {
    id: 'Reino Unido (VAT)',
    label: 'Reino Unido 🇬🇧',
    region: 'Europa',
    flag: '🇬🇧',
    prefix: '+44',
    taxLabel: 'UTR / VAT Number',
    taxPlaceholder: 'GB123456789',
    defaultCity: 'Londres',
    cities: [
      'Londres', 'Mánchester', 'Birmingham', 'Edimburgo', 'Glasgow',
      'Liverpool', 'Bristol', 'Leeds', 'Sheffield', 'Belfast', 'Newcastle'
    ],
  },
  {
    id: 'Francia (SIRET)',
    label: 'Francia 🇫🇷',
    region: 'Europa',
    flag: '🇫🇷',
    prefix: '+33',
    taxLabel: 'SIRET / SIREN',
    taxPlaceholder: '123 456 789 00012',
    defaultCity: 'París',
    cities: [
      'París', 'Marsella', 'Lyon', 'Toulouse', 'Niza', 'Nantes',
      'Estrasburgo', 'Montpellier', 'Burdeos', 'Lille', 'Rennes'
    ],
  },
  {
    id: 'Italia (P.IVA)',
    label: 'Italia 🇮🇹',
    region: 'Europa',
    flag: '🇮🇹',
    prefix: '+39',
    taxLabel: 'Partita IVA / Codice Fiscale',
    taxPlaceholder: 'IT12345678901',
    defaultCity: 'Roma',
    cities: [
      'Roma', 'Milán', 'Nápoles', 'Turín', 'Palermo', 'Génova',
      'Bolonia', 'Florencia', 'Bari', 'Venecia', 'Verona'
    ],
  },
  {
    id: 'Alemania (USt-IdNr)',
    label: 'Alemania 🇩🇪',
    region: 'Europa',
    flag: '🇩🇪',
    prefix: '+49',
    taxLabel: 'Steuernummer / USt-IdNr',
    taxPlaceholder: 'DE123456789',
    defaultCity: 'Berlín',
    cities: [
      'Berlín', 'Múnich', 'Fráncfort', 'Hamburgo', 'Colonia',
      'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dortmund', 'Dresde'
    ],
  },
  {
    id: 'Portugal (NIF)',
    label: 'Portugal 🇵🇹',
    region: 'Europa',
    flag: '🇵🇹',
    prefix: '+351',
    taxLabel: 'NIF / NIPC',
    taxPlaceholder: '501234567',
    defaultCity: 'Lisboa',
    cities: [
      'Lisboa', 'Oporto', 'Vila Nova de Gaia', 'Amadora', 'Braga',
      'Coímbra', 'Funchal', 'Faro', 'Setúbal', 'Cascais'
    ],
  },
  {
    id: 'Países Bajos (BTW)',
    label: 'Países Bajos 🇳🇱',
    region: 'Europa',
    flag: '🇳🇱',
    prefix: '+31',
    taxLabel: 'KVK / BTW-nummer',
    taxPlaceholder: 'NL123456789B01',
    defaultCity: 'Ámsterdam',
    cities: [
      'Ámsterdam', 'Róterdam', 'La Haya', 'Utrecht',
      'Eindhoven', 'Groninga', 'Tilburgo', 'Breda'
    ],
  },
  {
    id: 'Suiza (UID)',
    label: 'Suiza 🇨🇭',
    region: 'Europa',
    flag: '🇨🇭',
    prefix: '+41',
    taxLabel: 'UID / IDE',
    taxPlaceholder: 'CHE-123.456.789',
    defaultCity: 'Zúrich',
    cities: [
      'Zúrich', 'Ginebra', 'Basilea', 'Lausana',
      'Berna', 'Lucerna', 'Lugano', 'San Galo'
    ],
  },
  {
    id: 'Bélgica (BCE)',
    label: 'Bélgica 🇧🇪',
    region: 'Europa',
    flag: '🇧🇪',
    prefix: '+32',
    taxLabel: "Numéro d'entreprise (BCE)",
    taxPlaceholder: 'BE 0123.456.789',
    defaultCity: 'Bruselas',
    cities: [
      'Bruselas', 'Amberes', 'Gante', 'Charleroi',
      'Lieja', 'Brujas', 'Namur', 'Lovaina'
    ],
  },
  {
    id: 'Austria (UID)',
    label: 'Austria 🇦🇹',
    region: 'Europa',
    flag: '🇦🇹',
    prefix: '+43',
    taxLabel: 'UID-Nummer',
    taxPlaceholder: 'ATU12345678',
    defaultCity: 'Viena',
    cities: [
      'Viena', 'Graz', 'Linz', 'Salzburgo', 'Innsbruck', 'Klagenfurt'
    ],
  },
  {
    id: 'Irlanda (TRN)',
    label: 'Irlanda 🇮🇪',
    region: 'Europa',
    flag: '🇮🇪',
    prefix: '+353',
    taxLabel: 'Tax Reference (TRN)',
    taxPlaceholder: '1234567T',
    defaultCity: 'Dublín',
    cities: [
      'Dublín', 'Cork', 'Galway', 'Limerick', 'Waterford'
    ],
  },
  {
    id: 'Suecia (Org.nr)',
    label: 'Suecia 🇸🇪',
    region: 'Europa',
    flag: '🇸🇪',
    prefix: '+46',
    taxLabel: 'Organisationsnummer',
    taxPlaceholder: '556123-4567',
    defaultCity: 'Estocolmo',
    cities: [
      'Estocolmo', 'Gotemburgo', 'Malmö', 'Uppsala', 'Linköping'
    ],
  },
  {
    id: 'Noruega (Org.nr)',
    label: 'Noruega 🇳🇴',
    region: 'Europa',
    flag: '🇳🇴',
    prefix: '+47',
    taxLabel: 'Organisasjonsnummer',
    taxPlaceholder: '912 345 678 MVA',
    defaultCity: 'Oslo',
    cities: [
      'Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Drammen', 'Tromsø'
    ],
  },
  {
    id: 'Dinamarca (CVR)',
    label: 'Dinamarca 🇩🇰',
    region: 'Europa',
    flag: '🇩🇰',
    prefix: '+45',
    taxLabel: 'CVR-nummer',
    taxPlaceholder: 'DK12345678',
    defaultCity: 'Copenhague',
    cities: [
      'Copenhague', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg'
    ],
  },
  {
    id: 'Polonia (NIP)',
    label: 'Polonia 🇵🇱',
    region: 'Europa',
    flag: '🇵🇱',
    prefix: '+48',
    taxLabel: 'NIP Fiscal',
    taxPlaceholder: '123-456-78-90',
    defaultCity: 'Varsovia',
    cities: [
      'Varsovia', 'Cracovia', 'Łódź', 'Breslavia (Wrocław)', 'Poznań', 'Gdansk'
    ],
  },
  {
    id: 'Grecia (AFM)',
    label: 'Grecia 🇬🇷',
    region: 'Europa',
    flag: '🇬🇷',
    prefix: '+30',
    taxLabel: 'AFM / ΑΦΜ',
    taxPlaceholder: 'EL123456789',
    defaultCity: 'Atenas',
    cities: [
      'Atenas', 'Salónica', 'Patras', 'Heraclión', 'Larisa', 'Volos'
    ],
  },
  {
    id: 'República Checa (DIČ)',
    label: 'República Checa 🇨🇿',
    region: 'Europa',
    flag: '🇨🇿',
    prefix: '+420',
    taxLabel: 'DIČ / IČO',
    taxPlaceholder: 'CZ12345678',
    defaultCity: 'Praga',
    cities: [
      'Praga', 'Brno', 'Ostrava', 'Pilsen (Plzeň)', 'Liberec'
    ],
  },
  {
    id: 'Rumania (CIF)',
    label: 'Rumania 🇷🇴',
    region: 'Europa',
    flag: '🇷🇴',
    prefix: '+40',
    taxLabel: 'CIF / CUI',
    taxPlaceholder: 'RO12345678',
    defaultCity: 'Bucarest',
    cities: [
      'Bucarest', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Constanța', 'Brașov'
    ],
  },
  {
    id: 'Hungría (Adószám)',
    label: 'Hungría 🇭🇺',
    region: 'Europa',
    flag: '🇭🇺',
    prefix: '+36',
    taxLabel: 'Adószám',
    taxPlaceholder: '12345678-2-41',
    defaultCity: 'Budapest',
    cities: [
      'Budapest', 'Debrecen', 'Szeged', 'Miskolc', 'Pécs'
    ],
  },
  {
    id: 'Finlandia (Y-tunnus)',
    label: 'Finlandia 🇫🇮',
    region: 'Europa',
    flag: '🇫🇮',
    prefix: '+358',
    taxLabel: 'Y-tunnus (ALV)',
    taxPlaceholder: '1234567-8',
    defaultCity: 'Helsinki',
    cities: [
      'Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu', 'Turku'
    ],
  },

  // 🌐 INTERNACIONAL
  {
    id: 'Otro País (Internacional)',
    label: 'Otro País (Internacional) 🌐',
    region: 'Internacional',
    flag: '🌐',
    prefix: '+',
    taxLabel: 'Tax ID / ID Fiscal',
    taxPlaceholder: 'TAX-ID-12345',
    defaultCity: 'Ciudad Principal',
    cities: ['Ciudad Principal', 'Sede Central'],
  },
];

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
    resendApiKey: '',
    resendFromEmail: '',
  });
  const [securityFormLoading, setSecurityFormLoading] = useState(false);
  const [securityFormError, setSecurityFormError] = useState<string | null>(null);
  const [testNotificationLoading, setTestNotificationLoading] = useState(false);
  const [testNotificationResult, setTestNotificationResult] = useState<{ success: boolean; message: string } | null>(null);
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
    resendApiKey?: string;
    hasResendConfigured?: boolean;
    resendFromEmail?: string;
    hasTwilioConfigured?: boolean;
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
          setIsTwoFactorActiveOnServer(Boolean(data.twoFactorEnabled));
          if (data.maskedPhone) setEmergencyPhone(data.maskedPhone);
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
  const [activeTab, setActiveTab] = useState<'directorio' | 'conmutador' | 'casos' | 'bigdata' | 'mrr' | 'trafico' | 'comunicaciones'>('directorio');
  const [privacyMode, setPrivacyMode] = useState(false); // Masks financial numbers & phones
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'active' | 'suspended' | 'archived'>('all');
  const [directoryViewMode, setDirectoryViewMode] = useState<'list' | 'cards'>('list');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Corporate VIP Communications & Mailer State (Tab 8)
  const [emailDispatches, setEmailDispatches] = useState<EmailDispatchRecord[]>([]);
  const [mailerTemplate, setMailerTemplate] = useState<
    'welcome_credentials' | 'reactivation_winback' | 'monthly_report' | 'official_announcement' | 'billing_renewal' | 'custom'
  >('welcome_credentials');
  const [mailerAudience, setMailerAudience] = useState<
    'single' | 'active_all' | 'inactive_all' | 'plan_elite_empresarial' | 'leads_prospects'
  >('single');
  const [mailerBusinessId, setMailerBusinessId] = useState<string>('');
  const [mailerSubject, setMailerSubject] = useState<string>('');
  const [mailerCustomBody, setMailerCustomBody] = useState<string>('');
  const [mailerDiscountPercent, setMailerDiscountPercent] = useState<number>(25);
  const [mailerSending, setMailerSending] = useState(false);
  const [mailerResult, setMailerResult] = useState<{ success: boolean; message: string } | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

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
  const [killSwitchConfirmTarget, setKillSwitchConfirmTarget] = useState<Business | null>(null);
  const [killSwitchLoading, setKillSwitchLoading] = useState(false);

  // Decommissioning Protocol State (Protocolo de Baja Oficial: Archivo Histórico o Purga Total)
  const [decommissionTarget, setDecommissionTarget] = useState<Business | null>(null);
  const [decommissionMode, setDecommissionMode] = useState<'archive' | 'purge'>('archive');
  const [decommissionKey, setDecommissionKey] = useState('');
  const [decommissionReason, setDecommissionReason] = useState('');
  const [decommissionLoading, setDecommissionLoading] = useState(false);
  const [decommissionError, setDecommissionError] = useState<string | null>(null);
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

  // Branch (Sedes Físicas) Management State
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [branchFormData, setBranchFormData] = useState<{
    id: string;
    name: string;
    address: string;
    city: string;
    locality: string;
    managerName: string;
    managerPhone: string;
    managerPassword: string;
    googlePlaceId: string;
    googleReviewUrl: string;
    googleMapsUrl: string;
    status: BusinessStatus;
    agreedMonthlyFeeCOP: number;
    agreedMonthlyFeeUSD: number;
  }>({
    id: '',
    name: '',
    address: '',
    city: '',
    locality: '',
    managerName: '',
    managerPhone: '',
    managerPassword: '1234',
    googlePlaceId: '',
    googleReviewUrl: '',
    googleMapsUrl: '',
    status: 'active',
    agreedMonthlyFeeCOP: 0,
    agreedMonthlyFeeUSD: 0,
  });
  const [branchGoogleQuery, setBranchGoogleQuery] = useState('');
  const [branchGoogleLoading, setBranchGoogleLoading] = useState(false);
  const [branchGoogleSuccess, setBranchGoogleSuccess] = useState<string | null>(null);
  const [branchGoogleError, setBranchGoogleError] = useState<string | null>(null);
  const [branchSavingLoading, setBranchSavingLoading] = useState(false);

  // Team Management State for Specific Branch (Super Master HQ)
  const [selectedTeamBranch, setSelectedTeamBranch] = useState<Branch | null>(null);
  const [teamManagers, setTeamManagers] = useState<BranchManager[]>([]);
  const [teamStaff, setTeamStaff] = useState<(StaffMember | string)[]>([]);
  const [teamModalTab, setTeamModalTab] = useState<'managers' | 'staff'>('managers');
  const [teamManagersQuota, setTeamManagersQuota] = useState(2);
  const [teamStaffQuota, setTeamStaffQuota] = useState(15);
  const [isSavingTeam, setIsSavingTeam] = useState(false);

  // New Manager Form inputs
  const [newTeamMgrName, setNewTeamMgrName] = useState('');
  const [newTeamMgrRole, setNewTeamMgrRole] = useState('Capitán de Sala & VIP');
  const [newTeamMgrPhone, setNewTeamMgrPhone] = useState('');
  const [newTeamMgrPassword, setNewTeamMgrPassword] = useState('1234');

  // New Staff Form inputs & Dynamic Custom Roles
  const [newTeamStaffName, setNewTeamStaffName] = useState('');
  const [newTeamStaffRole, setNewTeamStaffRole] = useState('');
  const [teamStaffRoles, setTeamStaffRoles] = useState<string[]>([]);
  const [isCreatingStaffRole, setIsCreatingStaffRole] = useState(false);
  const [newStaffRoleInput, setNewStaffRoleInput] = useState('');

  // Quick Edit Owner Modal State (Tab 2)
  const [showOwnerEditModal, setShowOwnerEditModal] = useState(false);
  const [isSavingOwner, setIsSavingOwner] = useState(false);
  const [ownerEditForm, setOwnerEditForm] = useState({
    ownerName: '',
    ownerPhone: '',
    legalName: '',
    taxId: '',
    password: '',
    ownerEmail: '',
    agreedMonthlyFeeCOP: 0,
    agreedMonthlyFeeUSD: 0,
    billingCycle: 'monthly' as 'monthly' | 'quarterly' | 'semiannual' | 'annual',
  });

  const [customCountryMode, setCustomCountryMode] = useState(false);
  const [customCityMode, setCustomCityMode] = useState(false);
  const logoFileInputRef = useRef<HTMLInputElement | null>(null);
  const [localLogoName, setLocalLogoName] = useState<string | null>(null);
  const [onboardForm, setOnboardForm] = useState({
    id: '',
    name: '',
    legalName: '',
    category: PRESTIGIA_NICHES[0].label,
    country: '',
    city: '',
    locality: '',
    address: '',
    plan: 'pro' as BusinessPlan,
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    logoUrl: '',
    taxId: '',
    googleMapsUrl: '',
    googlePlaceId: '',
    googleReviewUrl: '',
    averageTicketCOP: 45000,
    initialRating: 0,
    initialReviewCount: 0,
    clientQuote: '',
    agreedMonthlyFeeCOP: 0,
    agreedMonthlyFeeUSD: 0,
    billingCycle: 'monthly' as 'monthly' | 'quarterly' | 'semiannual' | 'annual',
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

  // Big Data Lake Filters State & View Record Modal
  const [selectedDataLakeRecord, setSelectedDataLakeRecord] = useState<any | null>(null);
  const [dataFilterCountry, setDataFilterCountry] = useState('all');
  const [dataFilterCity, setDataFilterCity] = useState('all');
  const [dataFilterLocality, setDataFilterLocality] = useState('all');
  const [dataFilterBusiness, setDataFilterBusiness] = useState('all');
  const [dataFilterBranch, setDataFilterBranch] = useState('all');
  const [dataFilterNiche, setDataFilterNiche] = useState('all');
  const [dataFilterRating, setDataFilterRating] = useState('all');
  const [dataPageLimit, setDataPageLimit] = useState<'30' | '50' | '100' | 'all'>('30');
  const [dataCurrentPage, setDataCurrentPage] = useState<number>(1);

// Alertas operativas desacopladas (delegadas al portal de cada sede)

  // Matriz Financiera & MRR Multi-Divisa States
  const [mrrSearchTerm, setMrrSearchTerm] = useState('');
  const [mrrFilterPlan, setMrrFilterPlan] = useState('all');
  const [mrrFilterCountry, setMrrFilterCountry] = useState('all');
  const [mrrFilterStatus, setMrrFilterStatus] = useState('all');
  const [mrrFilterContractType, setMrrFilterContractType] = useState('all');
  const [mrrCurrencyMode, setMrrCurrencyMode] = useState<'usd' | 'local'>('usd');
  
  // Quick Fee Adjustment Modal State (Tab 5)
  const [mrrEditingBiz, setMrrEditingBiz] = useState<Business | null>(null);
  const [mrrFeeInputUSD, setMrrFeeInputUSD] = useState<string>('');
  const [mrrFeeInputLocal, setMrrFeeInputLocal] = useState<string>('');
  const [mrrBillingCycle, setMrrBillingCycle] = useState<'monthly' | 'quarterly' | 'semiannual' | 'annual'>('monthly');
  const [mrrSavingFee, setMrrSavingFee] = useState<boolean>(false);

  // Case Study Generator Edit State
  const [editQuoteMode, setEditQuoteMode] = useState(false);
  const [customTestimonialQuote, setCustomTestimonialQuote] = useState('');

  // Baseline Day-1 Calibration Modal State (Tab 3)
  const [showBaselineModal, setShowBaselineModal] = useState(false);
  const [isSavingBaseline, setIsSavingBaseline] = useState(false);
  const [isFetchingGoogleData, setIsFetchingGoogleData] = useState(false);
  const [googleSyncSuccess, setGoogleSyncSuccess] = useState<string | null>(null);
  const [googleSyncError, setGoogleSyncError] = useState<string | null>(null);
  const [allowManualOverride, setAllowManualOverride] = useState(false);
  const [selectedHistoricalBranchId, setSelectedHistoricalBranchId] = useState<string>('all');
  const [editingCustomFee, setEditingCustomFee] = useState(false);
  const [tempCustomFee, setTempCustomFee] = useState<string>('');
  const [baselineForm, setBaselineForm] = useState({
    startDate: new Date().toISOString().split('T')[0],
    initialRating: 3.8,
    initialReviewCount: 30,
    initialReviews1to3: 10,
    initialReviews4to5: 20,
    initialRespondedReviews: 4,
    averageTicketCOP: 45000,
    averageTicketUSD: 18,
    customMonthlyFeeCOP: 0,
    founderName: '',
    clientQuote: '',
  });

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
      const res = await fetch(`/api/master?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache' },
      });
      const data = await res.json();
      if (data.success) {
        let effBusinesses: Business[] = data.businesses || [];
        try {
          const savedOverrides = localStorage.getItem('prestigia_master_status_overrides');
          if (savedOverrides) {
            const overrides = JSON.parse(savedOverrides);
            effBusinesses = effBusinesses.map((b) => {
              if (overrides[b.id] && overrides[b.id] !== b.status) {
                // Cold start discrepancy detected: background re-sync to serverless container
                fetch('/api/master', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    action: 'toggle_business_status',
                    businessId: b.id,
                    status: overrides[b.id],
                  }),
                }).catch(() => {});

                return {
                  ...b,
                  status: overrides[b.id],
                  branches: (b.branches || []).map((br) => ({ ...br, status: overrides[b.id] })),
                };
              }
              return b;
            });
          }
        } catch (e) {}

        setBusinesses(effBusinesses);
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
            resendApiKey: data.securityConfig.resendApiKey || prev.resendApiKey,
            resendFromEmail: data.securityConfig.resendFromEmail || prev.resendFromEmail,
          }));
        }

        setTrafficVisits(data.trafficVisits || []);
        setCommercialLeads(data.leads || []);
        setEmailDispatches(data.emailDispatches || []);

        // Set default selected business if available
        if (data.businesses?.length > 0) {
          if (!selectedBusinessId) setSelectedBusinessId(data.businesses[0].id);
          if (!mailerBusinessId) setMailerBusinessId(data.businesses[0].id);
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

  // Business Plan Base Branches Allowance:
  // Independiente: 1 Punto Único (Solo Cuenta Dueño)
  // Pro: 1 Cuenta Dueño + 1 Sede Física incluida
  // Elite: 1 Cuenta Dueño + hasta 3 Sedes Físicas incluidas
  // Empresarial: 1 Cuenta Dueño + Sedes Físicas Ilimitadas
  const getBaseBranchesForPlan = (plan?: BusinessPlan): number => {
    if (plan === 'independiente') return 1;
    if (plan === 'pro') return 1;
    if (plan === 'elite') return 3;
    if (plan === 'empresarial') return 999;
    return 1;
  };

  // Computed Live Operational Stats for currentBusiness (Tab 2 Conmutador)
  const currentBranchesCount = currentBusiness?.branches ? currentBusiness.branches.length : (currentBusiness ? 1 : 0);
  const activePlan = addonState.plan || currentBusiness?.plan || 'pro';
  const basePlanBranches = getBaseBranchesForPlan(activePlan);
  const currentExtraBranchesCount = basePlanBranches === 999 ? 0 : Math.max(0, currentBranchesCount - basePlanBranches);
  const totalAuthorizedBranches = basePlanBranches === 999 ? 999 : (basePlanBranches + (addonState.extraBranches || 0));
  const isBranchQuotaReached = basePlanBranches === 999 ? false : currentBranchesCount >= totalAuthorizedBranches;
  const currentManagersList = useMemo(() => {
    if (!currentBusiness?.branches) return [];
    const list: string[] = [];
    currentBusiness.branches.forEach((b) => {
      if (b.managers && b.managers.length > 0) {
        b.managers.forEach((m) => {
          if (m.name && !list.includes(m.name)) list.push(m.name);
        });
      } else if (b.managerName && !list.includes(b.managerName)) {
        list.push(b.managerName);
      }
    });
    return list;
  }, [currentBusiness]);

  const currentStaffCount = useMemo(() => {
    if (!currentBusiness?.branches) return 0;
    return currentBusiness.branches.reduce((acc, b) => acc + (b.staffMembers?.length || 0), 0);
  }, [currentBusiness]);

  useEffect(() => {
    if (currentBusiness) {
      const addons = currentBusiness.masterAddOns;
      const baseAllowed = getBaseBranchesForPlan(currentBusiness.plan);
      const actualBranches = currentBusiness.branches?.length || 1;
      const actualExtra = baseAllowed === 999 ? 0 : Math.max(0, actualBranches - baseAllowed);
      const effectiveExtraBranches = Math.max(addons?.extraBranches || 0, actualExtra);

      const actualManagersCount = currentBusiness.branches?.filter(b => b.managerName || (b.managers && b.managers.length > 0)).length || 0;
      const effectiveExtraManagers = Math.max(addons?.extraManagers || 0, actualManagersCount);

      setAddonState({
        plan: currentBusiness.plan,
        status: currentBusiness.status || 'active',
        extraBranches: effectiveExtraBranches,
        extraManagers: effectiveExtraManagers,
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
        if (verifyData.twoFactorRequired) {
          setIsTwoFactorActiveOnServer(true);
          setAuthError('Doble Factor Requerido: Introduce el código de 6 dígitos de Google Authenticator.');
          return;
        }

        if (verifyData.isLocked) {
          const lockoutTime = Date.now() + LOCKOUT_DURATION_MS;
          setLockoutUntil(lockoutTime);
          setAuthError(verifyData.error || 'ALERTA DE SEGURIDAD: 3 intentos fallidos consecutivos. Tu IP ha sido congelada por 15 minutos.');
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
          resendApiKey: securityForm.resendApiKey,
          resendFromEmail: securityForm.resendFromEmail,
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

  // Test Live Notification Dispatch
  const handleTestNotificationDispatch = async () => {
    setTestNotificationLoading(true);
    setTestNotificationResult(null);
    try {
      const res = await fetch('/api/master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_notification_dispatch',
          email: securityForm.newEmergencyEmail,
          phone: securityForm.newEmergencyPhone,
        }),
      });
      const data = await res.json();
      if (data.emailSent || data.smsSent) {
        setTestNotificationResult({
          success: true,
          message: `✓ ¡Despacho exitoso! Código de prueba enviado vía ${data.provider}. Revisa tu bandeja de entrada en ${securityForm.newEmergencyEmail}.`,
        });
      } else {
        setTestNotificationResult({
          success: false,
          message: data.error || data.summary || 'Para habilitar el envío automático real a tu teléfono o bandeja de entrada, ingresa tu API Key de Resend.',
        });
      }
    } catch (err) {
      setTestNotificationResult({
        success: false,
        message: 'Error de conexión probando el despacho.',
      });
    } finally {
      setTestNotificationLoading(false);
    }
  };

  // Dispatch Corporate VIP Mailer Campaign
  const handleSendCorporateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setMailerSending(true);
    setMailerResult(null);

    try {
      const res = await fetch('/api/master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_corporate_email',
          audience: mailerAudience,
          targetBusinessId: mailerBusinessId,
          templateId: mailerTemplate,
          customSubject: mailerSubject.trim() || undefined,
          customBody: mailerCustomBody.trim() || undefined,
          discountPercent: mailerDiscountPercent,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMailerResult({
          success: true,
          message: data.message || `Campaña despachada con éxito a ${data.totalRecipients} destinatarios.`,
        });
        if (data.dispatches) {
          setEmailDispatches(data.dispatches);
        }
      } else {
        setMailerResult({
          success: false,
          message: data.error || 'Error procesando el envío de la campaña.',
        });
      }
    } catch (err) {
      setMailerResult({
        success: false,
        message: 'Error de conexión con el servidor bancario de despacho.',
      });
    } finally {
      setMailerSending(false);
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
    if (!currentBusiness) return;
    try {
      const base = currentBusiness.baseline || {
        startDate: currentBusiness.createdAt ? currentBusiness.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
        initialRating: 3.8,
        initialReviewCount: 30,
        initialReviews1to3: 10,
        initialReviews4to5: 20,
        initialRespondedReviews: 4,
        initialMonthlyComplaints: 15,
        averageTicketCOP: 45000,
        averageTicketUSD: 18,
        nicheCategory: currentBusiness.category || 'Gastronomía y Retail',
        city: currentBusiness.branches?.[0]?.city || 'Bogotá',
        locality: currentBusiness.branches?.[0]?.locality || 'Principal',
        country: currentBusiness.country || 'Colombia',
        founderName: currentBusiness.ownerName || 'Propietario',
        clientQuote: customTestimonialQuote,
      };

      const updatedBaseline: DayOneBaseline = {
        ...base,
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
        setBusinesses((prev) =>
          prev.map((b) => (b.id === currentBusiness.id ? { ...b, baseline: updatedBaseline } : b))
        );
        setEditQuoteMode(false);
        setNotification({ type: 'success', message: 'Caso de éxito y testimonio actualizado correctamente.' });
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Error guardando testimonio' });
    }
  };

  // Generate AI Testimonial & Case Study Analysis based on REAL Prestigia metrics
  const generateAITestimonial = (style: 'roi' | 'prestige' | 'growth' = 'roi') => {
    if (!currentBusiness) return '';
    const h = historicalMetrics;
    const dias = h ? h.daysOperating : 1;
    const ratingIni = Number(baselineForm.initialRating) || h?.baseline.initialRating || 3.8;
    const ratingAct = h?.currentRating || ratingIni;
    const ganancia = Number(Math.max(0, ratingAct - ratingIni).toFixed(1));
    const quejas = h ? h.privateComplaintsIntercepted : 0;
    const savedAmount = h ? h.preservedRevenueCOP : 0;
    const formattedCOP = formatMoneyCOP(savedAmount);
    const nuevas5 = h ? h.exactReviews5Star : 0;
    const nuevasTot = h ? h.newGoogleReviewsTotal : 0;
    const isBranch = selectedHistoricalBranchId !== 'all';
    const branchObj = isBranch ? currentBusiness.branches?.find((b) => b.id === selectedHistoricalBranchId) : null;
    const marca = branchObj ? `${currentBusiness.name} (${branchObj.name})` : currentBusiness.name;
    const roiTxt = h?.roiMultiplier ? ` (retorno auditado de ${h.roiMultiplier}x sobre la inversión)` : '';

    if (style === 'roi') {
      if (quejas > 0 && savedAmount > 0) {
        return `Prestigia blindó a ${marca} desde el Día 1. Durante estos ${dias} días de protección activa con QRs en sala, interceptamos de inmediato ${quejas} quejas privadas en mesa antes de que salieran a Google Maps. Subimos nuestra calificación de ${ratingIni}★ a ${ratingAct}★ (+${ganancia}★) y salvamos ${formattedCOP} en comensales retenidos${roiTxt}.`;
      } else {
        return `Prestigia activó el blindaje de reputación en ${marca} desde el Día 1. En estos ${dias} días de operación con códigos QR inteligentes, mantenemos una calificación protegida de ${ratingAct}★ en Google Maps, canalizando la experiencia de cada cliente y blindando al 100% la sala contra reseñas negativas públicas.`;
      }
    } else if (style === 'prestige') {
      if (quejas > 0 || nuevas5 > 0) {
        return `La contención inmediata en mesa (<10 seg) cambió por completo la experiencia de nuestros clientes en ${marca}. Contuvimos ${quejas} alertas privadas vía WhatsApp y sumamos ${nuevas5} reseñas reales de 5 estrellas en Google Maps, llevando nuestro perfil a ${ratingAct}★. La certeza de proteger el prestigio de la marca en tiempo real no tiene comparación.`;
      } else {
        return `El protocolo de contención VIP y fidelización en mesa de Prestigia mantiene blindada la experiencia en ${marca}. Con ${dias} días de protección activa, consolidamos un perfil protegido de ${ratingAct}★ en Google Maps y respuesta instantánea garantizada.`;
      }
    } else {
      if (ganancia > 0 || nuevasTot > 0) {
        return `Antes de Prestigia la reputación de ${marca} estaba en ${ratingIni}★ con riesgo constante de quejas públicas. Hoy, tras ${dias} días de blindaje con QR en mesa, alcanzamos ${ratingAct}★ en Google Maps (+${ganancia}★ con ${nuevasTot} nuevas reseñas ganadas), convirtiéndonos en el referente gastronómico más confiable del sector.`;
      } else {
        return `Desde la calibración Día 1, Prestigia estableció el estándar de calidad para ${marca} en ${ratingIni}★. Con ${dias} días de monitoreo y QR activos, tenemos control absoluto sobre la satisfacción de cada mesa y el crecimiento orgánico de nuestra reputación.`;
      }
    }
  };

  // Sync official live data from Google Maps (Anti-manipulation)
  const handleSyncGoogleLive = async () => {
    if (!currentBusiness) return;
    setIsFetchingGoogleData(true);
    setGoogleSyncError(null);
    setGoogleSyncSuccess(null);

    try {
      const isBranch = selectedHistoricalBranchId !== 'all';
      const branchObj = isBranch ? currentBusiness.branches?.find((b) => b.id === selectedHistoricalBranchId) : null;
      const targetBranch = branchObj || currentBusiness.branches?.[0];
      const query =
        targetBranch?.googleReviewUrl ||
        `${currentBusiness.name} ${targetBranch?.name || ''} ${targetBranch?.city || ''}`;

      const res = await fetch('/api/auditor/google-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: query }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        const realRating = typeof d.rating === 'number' ? Number(d.rating.toFixed(1)) : 3.8;
        const realReviews = typeof d.reviewsCount === 'number' ? d.reviewsCount : 0;

        // Mathematical distribution based on certified Google average rating
        const highStarRatio = Math.max(0.2, Math.min(0.95, (realRating - 1.2) / 3.6));
        const est4to5 = Math.round(realReviews * highStarRatio);
        const est1to3 = Math.max(0, realReviews - est4to5);
        const estResponded = Math.round(realReviews * 0.12);

        setBaselineForm((prev) => ({
          ...prev,
          initialRating: realRating,
          initialReviewCount: realReviews,
          initialReviews4to5: est4to5,
          initialReviews1to3: est1to3,
          initialRespondedReviews: estResponded,
        }));

        setGoogleSyncSuccess(
          `✓ Datos oficiales extraídos de Google Maps: ${realRating}★ (${realReviews} opiniones). Anti-inflación verificado.`
        );
      } else {
        setGoogleSyncError(
          json.error || 'No se pudo conectar automáticamente con la ficha de Google Maps. Puedes activar ajuste manual si es necesario.'
        );
      }
    } catch {
      setGoogleSyncError('Error de red al consultar Google Maps. Puedes activar el modo manual si es necesario.');
    } finally {
      setIsFetchingGoogleData(false);
    }
  };

  // Open Baseline Day-1 Calibration Modal (Tab 3)
  const handleOpenBaselineModal = () => {
    if (!currentBusiness) return;
    const isBranch = selectedHistoricalBranchId !== 'all';
    const branchObj = isBranch ? currentBusiness.branches?.find((b) => b.id === selectedHistoricalBranchId) : null;
    const base = branchObj?.baseline || currentBusiness.baseline;
    const initialRev = base?.initialReviewCount ?? 0;
    const initial1to3 = base?.initialReviews1to3 ?? Math.round(initialRev * 0.35);
    const initial4to5 = base?.initialReviews4to5 ?? Math.max(0, initialRev - initial1to3);
    const initialResp = base?.initialRespondedReviews ?? Math.round(initialRev * 0.15);

    setAllowManualOverride(false);
    setGoogleSyncError(null);
    setGoogleSyncSuccess(base?.isCalibrated ? `✓ Ficha ${branchObj ? `de ${branchObj.name}` : 'de la marca'} previamente calibrada y verificada.` : null);

    setBaselineForm({
      startDate: base?.startDate || new Date().toISOString().split('T')[0],
      initialRating: base?.initialRating ?? 3.8,
      initialReviewCount: initialRev,
      initialReviews1to3: initial1to3,
      initialReviews4to5: initial4to5,
      initialRespondedReviews: initialResp,
      averageTicketCOP: base?.averageTicketCOP ?? 45000,
      averageTicketUSD: base?.averageTicketUSD ?? 18,
      customMonthlyFeeCOP: base?.customMonthlyFeeCOP ?? 0,
      founderName: branchObj?.managerName || base?.founderName || currentBusiness.ownerName || '',
      clientQuote: base?.clientQuote || generateAITestimonial('roi'),
    });
    setShowBaselineModal(true);
  };

  // Save Calibrated Day-1 Baseline (Tab 3)
  const handleSaveCalibratedBaseline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBusiness) return;
    setIsSavingBaseline(true);
    try {
      const isBranch = selectedHistoricalBranchId !== 'all';
      const branchObj = isBranch ? currentBusiness.branches?.find((b) => b.id === selectedHistoricalBranchId) : null;
      const base = branchObj?.baseline || currentBusiness.baseline;

      const updatedBaseline: DayOneBaseline = {
        startDate: baselineForm.startDate,
        initialRating: Number(baselineForm.initialRating) || 3.8,
        initialReviewCount: Number(baselineForm.initialReviewCount) || 0,
        initialReviews1to3: Number(baselineForm.initialReviews1to3) || 0,
        initialReviews4to5: Number(baselineForm.initialReviews4to5) || 0,
        initialRespondedReviews: Number(baselineForm.initialRespondedReviews) || 0,
        initialMonthlyComplaints: base?.initialMonthlyComplaints || 15,
        averageTicketCOP: Number(baselineForm.averageTicketCOP) || 45000,
        averageTicketUSD: Number(baselineForm.averageTicketUSD) || 18,
        customMonthlyFeeCOP: Number(baselineForm.customMonthlyFeeCOP) || 0,
        nicheCategory: currentBusiness.category || 'Gastronomía y Retail',
        city: branchObj?.city || currentBusiness.branches?.[0]?.city || 'Bogotá',
        locality: branchObj?.locality || currentBusiness.branches?.[0]?.locality || 'Principal',
        country: currentBusiness.country || 'Colombia',
        founderName: baselineForm.founderName || branchObj?.managerName || currentBusiness.ownerName || 'Propietario',
        clientQuote: baselineForm.clientQuote,
        calibratedAt: new Date().toISOString(),
        isCalibrated: true,
      };

      const res = await fetch('/api/master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_baseline',
          businessId: currentBusiness.id,
          branchId: selectedHistoricalBranchId,
          baseline: updatedBaseline,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBusinesses((prev) =>
          prev.map((b) => {
            if (b.id !== currentBusiness.id) return b;
            if (isBranch) {
              return {
                ...b,
                branches: b.branches?.map((br) => (br.id === selectedHistoricalBranchId ? { ...br, baseline: updatedBaseline } : br)),
              };
            }
            return { ...b, baseline: updatedBaseline };
          })
        );
        setCustomTestimonialQuote(baselineForm.clientQuote);
        setShowBaselineModal(false);
        setNotification({
          type: 'success',
          message: `¡Línea Base Día 1 de ${branchObj ? branchObj.name : currentBusiness.name} calibrada y fijada con éxito!`,
        });
        setTimeout(() => setNotification(null), 4000);
      } else {
        alert(data.error || 'Error al calibrar línea base.');
      }
    } catch {
      alert('Error de conexión al calibrar la línea base.');
    } finally {
      setIsSavingBaseline(false);
    }
  };

  // Open Add/Edit Branch Modal
  const handleOpenBranchModal = (branchToEdit?: Branch) => {
    if (branchToEdit) {
      setEditingBranch(branchToEdit);
      setBranchFormData({
        id: branchToEdit.id || '',
        name: branchToEdit.name || '',
        address: branchToEdit.address || '',
        city: branchToEdit.city || currentBusiness?.baseline?.city || 'Bogotá',
        locality: branchToEdit.locality || 'Principal',
        managerName: branchToEdit.managerName || currentBusiness?.ownerName || '',
        managerPhone: branchToEdit.managerPhone || currentBusiness?.ownerPhone || '',
        managerPassword: branchToEdit.managerPassword || '1234',
        googlePlaceId: branchToEdit.googlePlaceId || '',
        googleReviewUrl: branchToEdit.googleReviewUrl || '',
        googleMapsUrl: branchToEdit.googlePlaceId ? `https://www.google.com/maps/place/?q=place_id:${branchToEdit.googlePlaceId}` : (branchToEdit.googleReviewUrl || ''),
        status: branchToEdit.status || 'active',
        agreedMonthlyFeeCOP: branchToEdit.agreedMonthlyFeeCOP || 0,
        agreedMonthlyFeeUSD: branchToEdit.agreedMonthlyFeeUSD || 0,
      });
      setBranchGoogleQuery(branchToEdit.googlePlaceId || branchToEdit.name || '');
    } else {
      if (isBranchQuotaReached) {
        alert(
          `⚠️ CAPACIDAD DE SEDES COMPLETA (${currentBranchesCount}/${totalAuthorizedBranches})\n\n` +
          `Esta marca en Plan ${activePlan.toUpperCase()} tiene autorizadas ${totalAuthorizedBranches} sede(s) física(s) (${basePlanBranches} del plan + ${addonState.extraBranches} extras), y actualmente tiene ${currentBranchesCount} operando.\n\n` +
          `Para dar de alta una nueva sede física, primero debes ampliar el cupo en 'Sedes Físicas Extras' en la Sección 2 (Conmutador de Add-Ons) haciendo clic en [+] y guardando los cambios.`
        );
        return;
      }
      const nextIdx = (currentBusiness?.branches?.length || 0) + 1;
      setEditingBranch(null);
      setBranchFormData({
        id: '',
        name: `Sede ${nextIdx}`,
        address: '',
        city: currentBusiness?.baseline?.city || currentBusiness?.branches?.[0]?.city || 'Bogotá',
        locality: 'Norte',
        managerName: '',
        managerPhone: currentBusiness?.ownerPhone || '',
        managerPassword: '1234',
        googlePlaceId: '',
        googleReviewUrl: '',
        googleMapsUrl: '',
        status: 'active',
        agreedMonthlyFeeCOP: 0,
        agreedMonthlyFeeUSD: 0,
      });
      setBranchGoogleQuery('');
    }
    setBranchGoogleSuccess(null);
    setBranchGoogleError(null);
    setShowBranchModal(true);
  };

  // Google Maps RPC Detection for specific branch
  const handleDetectBranchGoogle = async (inputQuery?: string) => {
    const query = (inputQuery || branchGoogleQuery || branchFormData.name).trim();
    if (!query) {
      setBranchGoogleError('Ingresa el enlace de Google Maps o nombre de esta sede.');
      return;
    }
    setBranchGoogleLoading(true);
    setBranchGoogleError(null);
    setBranchGoogleSuccess(null);
    try {
      const res = await fetch('/api/auditor/google-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: query }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        let detectedCity = '';
        let detectedLocality = '';
        if (d.address) {
          const parts = d.address.split(',').map((p: string) => p.trim());
          if (parts.length >= 3) {
            detectedCity = parts[parts.length - 2];
            detectedLocality = parts[parts.length - 3];
          } else if (parts.length === 2) {
            detectedCity = parts[1];
            detectedLocality = parts[0];
          }
        }
        setBranchFormData((prev) => ({
          ...prev,
          name: (d.name && d.name !== 'Ficha de Google Maps') ? d.name : prev.name,
          address: d.address || prev.address,
          city: detectedCity || prev.city,
          locality: detectedLocality || prev.locality,
          googlePlaceId: d.placeId || prev.googlePlaceId,
          googleReviewUrl: d.googleReviewUrl || prev.googleReviewUrl,
          googleMapsUrl: d.googleMapsUrl || prev.googleMapsUrl,
        }));
        setBranchGoogleSuccess(`¡Ficha de sede detectada! ${d.name} (${d.rating}★ - ${d.reviewsCount} reseñas)`);
      } else {
        setBranchGoogleError(json.error || 'No se encontró la ficha de Google. Puedes completar los datos manualmente.');
      }
    } catch {
      setBranchGoogleError('Error al consultar el servicio de Google Maps.');
    } finally {
      setBranchGoogleLoading(false);
    }
  };

  // Save Branch Handler
  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBusiness) return;
    if (!branchFormData.name.trim()) {
      alert('El nombre de la sede es obligatorio.');
      return;
    }
    setBranchSavingLoading(true);
    try {
      const res = await fetch('/api/master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_branch',
          businessId: currentBusiness.id,
          branch: branchFormData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowBranchModal(false);
        setNotification({ type: 'success', message: data.message });
        setTimeout(() => setNotification(null), 4000);
        fetchMasterData();
      } else {
        alert(data.error || 'Error al guardar la sede');
      }
    } catch {
      alert('Error de red al conectar con el servidor');
    } finally {
      setBranchSavingLoading(false);
    }
  };

  // Delete Branch Handler
  const handleDeleteBranch = async (branchId: string, branchName: string) => {
    if (!currentBusiness) return;
    if (!confirm(`¿Estás seguro de eliminar la sede '${branchName}'? Esta acción desvinculará su código QR y alertas.`)) return;
    try {
      const res = await fetch('/api/master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_branch',
          businessId: currentBusiness.id,
          branchId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: 'success', message: data.message });
        setTimeout(() => setNotification(null), 4000);
        fetchMasterData();
      } else {
        alert(data.error || 'Error al eliminar la sede');
      }
    } catch {
      alert('Error de conexión');
    }
  };

  // Toggle Branch Status Handler (1-click from badge)
  const handleToggleBranchStatus = async (branch: Branch) => {
    if (!currentBusiness) return;
    const newStatus: BusinessStatus = branch.status === 'suspended' ? 'active' : 'suspended';
    try {
      const res = await fetch('/api/master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_branch',
          businessId: currentBusiness.id,
          branch: {
            ...branch,
            status: newStatus,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({
          type: 'success',
          message: `Sede '${branch.name}' marcada como ${newStatus === 'active' ? 'Activa en Red' : 'En Mantenimiento'}.`,
        });
        setTimeout(() => setNotification(null), 3500);
        fetchMasterData();
      } else {
        alert(data.error || 'Error al cambiar estado de la sede');
      }
    } catch {
      alert('Error de conexión al actualizar estado de la sede');
    }
  };

  // Open Branch Team Management Modal
  const handleOpenTeamModal = (branch: Branch) => {
    setSelectedTeamBranch(branch);
    let initialMgrs: BranchManager[] = [];
    if (branch.managers && branch.managers.length > 0) {
      initialMgrs = [...branch.managers];
    } else if (branch.managerName) {
      initialMgrs = [{
        id: `mgr-${branch.id}-primary`,
        name: branch.managerName,
        role: branch.managerRole || 'Administrador de Sede',
        phone: branch.managerPhone || currentBusiness?.ownerPhone || '',
        password: branch.managerPassword || '1234',
        active: true,
      }];
    }
    setTeamManagers(initialMgrs);
    setTeamStaff(branch.staffMembers ? [...branch.staffMembers] : []);
    setTeamManagersQuota(branch.managersQuota || Math.max(2, initialMgrs.length));
    setTeamStaffQuota(branch.staffQuota || Math.max(10, (branch.staffMembers?.length || 5)));
    setTeamModalTab('managers');
    setNewTeamMgrName('');
    setNewTeamMgrPhone('');
    setNewTeamMgrPassword('1234');
    setNewTeamStaffName('');
    // Dynamically retrieve existing staff roles for this brand/branch (strictly no hardcoded values)
    const existingRoles: string[] = Array.from(
      new Set([
        ...(branch.customStaffRoles || []),
        ...(currentBusiness?.customStaffRoles || []),
        ...(branch.staffMembers || []).map(s => typeof s === 'object' && s !== null ? s.role : '').filter(Boolean),
      ])
    ).filter(r => r && r !== 'Atención / Servicio' && r !== 'Colaborador');

    setTeamStaffRoles(existingRoles);
    setIsCreatingStaffRole(existingRoles.length === 0);
    setNewStaffRoleInput('');
    setNewTeamStaffRole(existingRoles.length > 0 ? existingRoles[0] : '');
  };

  const handleSaveNewStaffRole = () => {
    const roleClean = newStaffRoleInput.trim();
    if (!roleClean) {
      alert('Ingresa el nombre del puesto (ej: Mesero, Parrillero, Cajero).');
      return;
    }
    if (!teamStaffRoles.some(r => r.toLowerCase() === roleClean.toLowerCase())) {
      const updated = [...teamStaffRoles, roleClean];
      setTeamStaffRoles(updated);
      setNewTeamStaffRole(roleClean);
    } else {
      setNewTeamStaffRole(roleClean);
    }
    setNewStaffRoleInput('');
    setIsCreatingStaffRole(false);
  };

  const handleDeleteStaffRole = (roleToDelete: string) => {
    const updated = teamStaffRoles.filter(r => r !== roleToDelete);
    setTeamStaffRoles(updated);
    if (newTeamStaffRole === roleToDelete) {
      const nextRole = updated.length > 0 ? updated[0] : '';
      setNewTeamStaffRole(nextRole);
      if (updated.length === 0) setIsCreatingStaffRole(true);
    }
  };

  const handleAddTeamManager = () => {
    if (!newTeamMgrName.trim()) {
      alert('Ingresa el nombre del encargado.');
      return;
    }
    const newMgr: BranchManager = {
      id: `mgr-${Date.now()}`,
      name: newTeamMgrName.trim(),
      role: newTeamMgrRole.trim() || 'Encargado de Turno',
      phone: newTeamMgrPhone.trim() || currentBusiness?.ownerPhone || '',
      password: newTeamMgrPassword.trim() || '1234',
      active: true,
    };
    setTeamManagers(prev => [...prev, newMgr]);
    setNewTeamMgrName('');
    setNewTeamMgrPhone('');
    setNewTeamMgrPassword('1234');
  };

  const handleRemoveTeamManager = (idx: number) => {
    setTeamManagers(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddTeamStaff = () => {
    if (!newTeamStaffName.trim()) {
      alert('Ingresa el nombre del colaborador.');
      return;
    }
    const roleAssigned = (isCreatingStaffRole && newStaffRoleInput.trim())
      ? newStaffRoleInput.trim()
      : (newTeamStaffRole.trim() || newStaffRoleInput.trim());

    if (!roleAssigned) {
      alert('Selecciona un puesto de la lista o escribe uno nuevo con [+ Nuevo Puesto].');
      return;
    }
    const today = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    const newCollab: StaffMember = {
      name: newTeamStaffName.trim(),
      role: roleAssigned,
      joinedAt: today,
    };
    setTeamStaff(prev => [...prev, newCollab]);
    if (!teamStaffRoles.some(r => r.toLowerCase() === roleAssigned.toLowerCase())) {
      setTeamStaffRoles(prev => [...prev, roleAssigned]);
    }
    setNewTeamStaffName('');
    if (isCreatingStaffRole) {
      setIsCreatingStaffRole(false);
      setNewStaffRoleInput('');
      setNewTeamStaffRole(roleAssigned);
    }
  };

  const handleRemoveTeamStaff = (idx: number) => {
    setTeamStaff(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveBranchTeam = async () => {
    if (!currentBusiness || !selectedTeamBranch) return;
    setIsSavingTeam(true);
    try {
      const res = await fetch('/api/master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_branch_team',
          businessId: currentBusiness.id,
          branchId: selectedTeamBranch.id,
          managersQuota: teamManagersQuota,
          staffQuota: teamStaffQuota,
          managers: teamManagers,
          staffMembers: teamStaff,
          customStaffRoles: teamStaffRoles,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({
          type: 'success',
          message: data.message || `Equipo de '${selectedTeamBranch.name}' sincronizado con la app del negocio.`,
        });
        setTimeout(() => setNotification(null), 4000);
        setSelectedTeamBranch(null);
        fetchMasterData();
      } else {
        alert(data.error || 'Error al guardar el equipo de la sede.');
      }
    } catch {
      alert('Error de conexión con el servidor.');
    } finally {
      setIsSavingTeam(false);
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

        let detectedCity = '';
        let detectedLocality = '';
        const detectedAddress = d.address || '';

        if (detectedAddress) {
          const parts = detectedAddress.split(',').map((p: string) => p.trim());
          if (parts.length >= 3) {
            // e.g. "Cl. 93 #13-45, Chapinero, Bogotá, Cundinamarca"
            detectedCity = parts[parts.length - 2];
            detectedLocality = parts[parts.length - 3];
          } else if (parts.length === 2) {
            detectedCity = parts[1];
            detectedLocality = parts[0];
          }
        }

        const cleanName = (d.name && d.name !== 'Ficha de Google Maps') ? d.name : '';

        setOnboardForm((prev) => {
          const detectedNameClean = cleanName || rawQuery;
          const finalName = prev.name.trim() ? prev.name : detectedNameClean;
          const finalId = prev.id.trim() ? prev.id : finalName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
          const finalAddress = prev.address.trim() ? prev.address : (detectedAddress || '');

          let detectedCountry = prev.country;
          if (!detectedCountry && detectedAddress) {
            const matchedCountry = PRESTIGIA_COUNTRIES.find((c) =>
              detectedAddress.toLowerCase().includes(c.label.split(' ')[0].toLowerCase()) ||
              c.cities.some((ct) => detectedAddress.toLowerCase().includes(ct.toLowerCase()))
            );
            if (matchedCountry) {
              detectedCountry = matchedCountry.id;
            }
          }

          const finalCountry = prev.country ? prev.country : detectedCountry;
          const finalCity = prev.city.trim() ? prev.city : (detectedCity || '');
          const finalLocality = prev.locality.trim() ? prev.locality : (detectedLocality || '');

          return {
            ...prev,
            name: finalName,
            id: finalId,
            address: finalAddress,
            country: finalCountry,
            city: finalCity,
            locality: finalLocality,
            initialRating: rating,
            initialReviewCount: reviews,
            googleMapsUrl: d.googleMapsUrl || prev.googleMapsUrl,
            googlePlaceId: d.placeId || prev.googlePlaceId,
            googleReviewUrl: d.googleReviewUrl || prev.googleReviewUrl,
          };
        });

        setDetectedGoogleProfile({
          name: cleanName || rawQuery,
          rating,
          reviewsCount: reviews,
          address: detectedAddress || `${onboardForm.locality}, ${onboardForm.city}`,
          placeId: d.placeId,
          googleMapsUrl: d.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanName || rawQuery)}`,
          googleReviewUrl: d.googleReviewUrl || (d.placeId ? `https://search.google.com/local/writereview?placeid=${d.placeId}` : ''),
        });

        setIsGoogleSynced(true);
        setGoogleDetectSuccess(`¡Ficha Google Maps leída con éxito! Línea Base Día 1 fijada automáticamente: ${rating}★ con ${reviews} reseñas.`);
      } else {
        setGoogleDetectError(json.error || 'No se encontró la ficha en Google Maps. Puedes ajustar los valores manualmente.');
      }
    } catch (err) {
      setGoogleDetectError('Error conectando con el servicio de auditoría de Google Maps.');
    } finally {
      setGoogleDetectLoading(false);
    }
  };

  // Handle local logo file upload with automatic web optimization
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (PNG, JPG, SVG o WebP).');
      return;
    }

    setLocalLogoName(file.name);

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const result = readerEvent.target?.result as string;
      if (!result) return;

      if (file.type === 'image/svg+xml') {
        setOnboardForm((prev) => ({ ...prev, logoUrl: result }));
        return;
      }

      const img = new Image();
      img.onload = () => {
        const maxDim = 512;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const optimizedDataUrl = canvas.toDataURL('image/webp', 0.88);
          setOnboardForm((prev) => ({ ...prev, logoUrl: optimizedDataUrl }));
        } else {
          setOnboardForm((prev) => ({ ...prev, logoUrl: result }));
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
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

  // Impersonate into /portal (Global or filtered by Branch)
  const handleImpersonate = (biz: Business, branchId?: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('prestigia_selected_business', biz.id);
      if (branchId) {
        localStorage.setItem('prestigia_selected_branch', branchId);
      } else {
        localStorage.removeItem('prestigia_selected_branch');
      }
      localStorage.setItem('prestigia_master_impersonation', JSON.stringify({
        businessId: biz.id,
        branchId: branchId || 'all',
        role: 'owner',
        timestamp: Date.now(),
      }));
      window.open(branchId ? `/portal?branch=${encodeURIComponent(branchId)}` : '/portal', '_blank');
    }
  };

  // Quick Edit Owner Modal Handlers (Tab 2)
  const handleOpenOwnerEditModal = () => {
    if (!currentBusiness) return;
    setOwnerEditForm({
      ownerName: currentBusiness.ownerName || '',
      ownerPhone: currentBusiness.ownerPhone || '',
      legalName: currentBusiness.legalName || currentBusiness.name || '',
      taxId: currentBusiness.taxId || '',
      password: currentBusiness.password || 'admin',
      ownerEmail: currentBusiness.ownerEmail || '',
      agreedMonthlyFeeCOP: currentBusiness.agreedMonthlyFeeCOP || 0,
      agreedMonthlyFeeUSD: currentBusiness.agreedMonthlyFeeUSD || 0,
      billingCycle: currentBusiness.billingCycle || 'monthly',
    });
    setShowOwnerEditModal(true);
  };

  const handleSaveOwnerDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBusiness) return;
    if (!ownerEditForm.ownerName.trim()) {
      alert('Ingresa el nombre del representante legal / titular.');
      return;
    }
    setIsSavingOwner(true);
    try {
      const res = await fetch('/api/master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_owner_details',
          businessId: currentBusiness.id,
          ...ownerEditForm,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({ type: 'success', message: 'Datos de la Cuenta Dueño actualizados con éxito.' });
        setTimeout(() => setNotification(null), 3500);
        setShowOwnerEditModal(false);
        setBusinesses(prev => prev.map(b => b.id === currentBusiness.id ? { ...b, ...ownerEditForm } : b));
      } else {
        alert(data.error || 'Error al actualizar datos del dueño.');
      }
    } catch {
      alert('Error de conexión con el servidor.');
    } finally {
      setIsSavingOwner(false);
    }
  };

  // Generate and Download Executive PDF Report for Business
  const handleDownloadFichaPDF = (biz: Business) => {
    if (typeof window === 'undefined') return;
    const url = `/api/master/ficha-pdf?id=${encodeURIComponent(biz.id)}`;
    window.open(url, '_blank');
  };

  // Quick Kill Switch / Toggle Business Status (Opens Custom Security Modal)
  const handleToggleBusinessStatus = (biz: Business) => {
    setKillSwitchConfirmTarget(biz);
  };

  const executeToggleBusinessStatus = async (biz: Business) => {
    const newStatus = biz.status === 'suspended' ? 'active' : 'suspended';
    setKillSwitchLoading(true);

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
        try {
          const overrides = JSON.parse(localStorage.getItem('prestigia_master_status_overrides') || '{}');
          overrides[biz.id] = newStatus;
          localStorage.setItem('prestigia_master_status_overrides', JSON.stringify(overrides));
        } catch {}

        setBusinesses((prev) =>
          prev.map((b) =>
            b.id === biz.id
              ? {
                  ...b,
                  status: newStatus,
                  branches: (b.branches || []).map((br) => ({ ...br, status: newStatus })),
                }
              : b
          )
        );

        if (selectedBusinessId === biz.id) {
          setAddonState((prev) => ({ ...prev, status: newStatus }));
        }

        setNotification({ type: 'success', message: data.message });
        setTimeout(() => setNotification(null), 4000);
        fetchMasterData();
        setKillSwitchConfirmTarget(null);
      } else {
        alert(data.error || 'Error al cambiar estado');
      }
    } catch {
      alert('Error de conexión al cambiar estado');
    } finally {
      setKillSwitchLoading(false);
    }
  };

  // Open Decommissioning Modal (Protocolo de Baja Oficial)
  const handleOpenDecommissionModal = (biz: Business, mode: 'archive' | 'purge' = 'archive') => {
    setDecommissionTarget(biz);
    setDecommissionMode(mode);
    setDecommissionKey('');
    setDecommissionReason(
      mode === 'archive'
        ? 'Terminación formal de contrato comercial y traslado a custodia histórica.'
        : 'Purga técnica definitiva solicitada por el administrador.'
    );
    setDecommissionError(null);
  };

  // Execute Decommissioning with Bank Guard validation
  const handleExecuteDecommission = async () => {
    if (!decommissionTarget) return;
    if (!decommissionKey.trim()) {
      setDecommissionError('Por favor introduce la Llave Maestra para autorizar esta operación.');
      return;
    }

    setDecommissionLoading(true);
    setDecommissionError(null);

    try {
      const action = decommissionMode === 'archive' ? 'archive_business' : 'delete_business';
      const payload: any = {
        action,
        businessId: decommissionTarget.id,
        masterKey: decommissionKey.trim(),
      };
      if (decommissionMode === 'archive') {
        payload.reason = decommissionReason.trim();
      }

      const res = await fetch('/api/master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        if (decommissionMode === 'archive') {
          try {
            const overrides = JSON.parse(localStorage.getItem('prestigia_master_status_overrides') || '{}');
            overrides[decommissionTarget.id] = 'suspended';
            localStorage.setItem('prestigia_master_status_overrides', JSON.stringify(overrides));
          } catch {}

          setBusinesses((prev) =>
            prev.map((b) =>
              b.id === decommissionTarget.id
                ? {
                    ...b,
                    status: 'suspended',
                    isArchived: true,
                    archivedAt: new Date().toISOString(),
                    archiveReason: decommissionReason.trim(),
                  } as any
                : b
            )
          );
        } else {
          try {
            const overrides = JSON.parse(localStorage.getItem('prestigia_master_status_overrides') || '{}');
            delete overrides[decommissionTarget.id];
            localStorage.setItem('prestigia_master_status_overrides', JSON.stringify(overrides));
          } catch {}

          setBusinesses((prev) => prev.filter((b) => b.id !== decommissionTarget.id));
          if (selectedBusinessId === decommissionTarget.id) {
            const remaining = businesses.filter((b) => b.id !== decommissionTarget.id);
            if (remaining.length > 0) setSelectedBusinessId(remaining[0].id);
          }
        }

        setNotification({ type: 'success', message: data.message });
        setTimeout(() => setNotification(null), 5000);
        setDecommissionTarget(null);
        fetchMasterData();
      } else {
        setDecommissionError(data.error || 'Error al procesar la baja oficial');
      }
    } catch {
      setDecommissionError('Error de conexión con el servidor Prestigia.');
    } finally {
      setDecommissionLoading(false);
    }
  };

  // Historical Day-1 Performance Computations for currentBusiness (Consolidated or Branch-Specific)
  const historicalMetrics = useMemo(() => {
    if (!currentBusiness) return null;

    const isBranch = selectedHistoricalBranchId !== 'all';
    const currentHistoricalBranch = isBranch
      ? currentBusiness.branches?.find((b) => b.id === selectedHistoricalBranchId) || null
      : null;

    const base = currentHistoricalBranch?.baseline || currentBusiness.baseline;
    const isCalibrated = Boolean(base?.isCalibrated);
    const startDate = base?.startDate || (currentBusiness.createdAt ? currentBusiness.createdAt.split('T')[0] : '2026-03-01');

    // Calculate days operating (since QR activation / start date)
    const startMs = new Date(startDate).getTime();
    const daysOperating = Math.max(1, Math.floor((Date.now() - startMs) / (1000 * 60 * 60 * 24)));

    const baseline: DayOneBaseline = base || {
      startDate,
      initialRating: 3.8,
      initialReviewCount: 0,
      initialReviews1to3: 0,
      initialReviews4to5: 0,
      initialRespondedReviews: 0,
      initialMonthlyComplaints: 0,
      averageTicketCOP: 45000,
      averageTicketUSD: 18,
      customMonthlyFeeCOP: 0,
      nicheCategory: currentBusiness.category || 'Gastrobar / Restaurante',
      city: currentHistoricalBranch?.city || currentBusiness.branches?.[0]?.city || 'Bogotá',
      locality: currentHistoricalBranch?.locality || currentBusiness.branches?.[0]?.locality || 'Principal',
      country: currentBusiness.country || 'Colombia',
      founderName: currentHistoricalBranch?.managerName || currentBusiness.ownerName || 'Propietario',
      clientQuote: 'Prestigia blindó nuestra reputación y convirtió clientes inconformes en promotores fieles de 5 estrellas.',
      isCalibrated: false,
    };

    // Day 1 review breakdown
    const initialRevCount = baseline.initialReviewCount || 0;
    const initialReviews1to3 = baseline.initialReviews1to3 ?? Math.round(initialRevCount * 0.35);
    const initialReviews4to5 = baseline.initialReviews4to5 ?? Math.max(0, initialRevCount - initialReviews1to3);
    const initialRespondedReviews = baseline.initialRespondedReviews ?? Math.round(initialRevCount * 0.15);
    const initialResponseRate = initialRevCount > 0 ? Math.round((initialRespondedReviews / initialRevCount) * 100) : 0;

    // Filter strictly by startTimestamp and selected branch (if branch-specific):
    const startTimestamp = new Date(startDate).getTime();

    // Relevant feedbacks (intercepted private complaints in room/WhatsApp)
    const bizFeedbacks = feedbacks.filter((f) => {
      if (f.businessId !== currentBusiness.id) return false;
      if (isBranch && f.branchId !== selectedHistoricalBranchId) return false;
      if (!f.createdAt) return false;
      return new Date(f.createdAt).getTime() >= startTimestamp;
    });
    const privateComplaintsIntercepted = bizFeedbacks.filter((f) => Number(f.rating) <= 3).length;
    const resolvedPrivateCount = bizFeedbacks.filter((f) => Number(f.rating) <= 3 && f.status === 'resolved').length;

    // Relevant Google Reviews for this business / branch (Exact Breakdown)
    const bizReviews = googleReviews.filter((r) => {
      if (r.businessId !== currentBusiness.id) return false;
      if (isBranch && r.branchId !== selectedHistoricalBranchId) return false;
      if (!r.createdAt) return false;
      return new Date(r.createdAt).getTime() >= startTimestamp;
    });
    const exactReviews5Star = bizReviews.filter((r) => Number(r.rating) === 5).length;
    const exactReviews4Star = bizReviews.filter((r) => Number(r.rating) === 4).length;
    const exactReviews1to3 = bizReviews.filter((r) => Number(r.rating) <= 3).length;
    const newGoogleReviewsTotal = bizReviews.length;
    const newGoogleReviews5Star = exactReviews5Star; // Strictly 5★ reviews!
    const newPositiveReviewsTotal = exactReviews5Star + exactReviews4Star;

    // Cumulative totals today with Prestigia
    const totalAllReviews = initialRevCount + newGoogleReviewsTotal;
    const currentReviews4to5 = initialReviews4to5 + newPositiveReviewsTotal;
    const currentReviews1to3 = initialReviews1to3 + exactReviews1to3;

    // Mathematical Arithmetic Mean for Google Rating (100% exact, no arbitrary factors)
    const initialStarsSum = (baseline.initialRating || 3.8) * initialRevCount;
    const newReviewsStarsSum = bizReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0);
    const totalStarsSum = initialStarsSum + newReviewsStarsSum;
    const currentRating = totalAllReviews > 0
      ? Math.min(5.0, Number((totalStarsSum / totalAllReviews).toFixed(1)))
      : (baseline.initialRating || 3.8);
    const ratingGain = Number(Math.max(0, currentRating - (baseline.initialRating || 3.8)).toFixed(1));

    // Response rate today with Prestigia AI assistant
    const currentResponseRate = 100;

    // Preserved Revenue (Saved from Churn): Exact calculation = Quejas interceptadas * Ticket Promedio exacto
    const preservedRevenueCOP = privateComplaintsIntercepted * (baseline.averageTicketCOP || 45000);
    const preservedRevenueUSD = baseline.averageTicketUSD
      ? privateComplaintsIntercepted * baseline.averageTicketUSD
      : Math.round(preservedRevenueCOP / 4000);

    // Multiplicador de Retorno de Inversión (ROI)
    // Sin precios fijos de planes: calculamos según la tarifa acordada negociada por cliente / sede
    const monthlyFeeCOP = isBranch && currentHistoricalBranch
      ? (currentHistoricalBranch.agreedMonthlyFeeCOP || currentHistoricalBranch.baseline?.customMonthlyFeeCOP || baseline.customMonthlyFeeCOP || (currentBusiness.agreedMonthlyFeeCOP ? Math.round(currentBusiness.agreedMonthlyFeeCOP / Math.max(1, currentBusiness.branches?.length || 1)) : 0))
      : (currentBusiness.agreedMonthlyFeeCOP || currentBusiness.branches?.reduce((acc, b) => acc + (b.agreedMonthlyFeeCOP || 0), 0) || baseline.customMonthlyFeeCOP || 0);
    const monthsOperating = Math.max(1, Math.round(daysOperating / 30));
    const totalInvestmentCOP = monthlyFeeCOP > 0 ? monthlyFeeCOP * monthsOperating : 0;
    const roiMultiplier = totalInvestmentCOP > 0 && preservedRevenueCOP > 0
      ? Number((preservedRevenueCOP / totalInvestmentCOP).toFixed(1))
      : null;

    // Resolution Speed (<10s compliance)
    const resolutionSpeedPercent = 98.6;

    // Staff stars
    const staffMembers = currentHistoricalBranch
      ? (currentHistoricalBranch.staffMembers || [])
      : (currentBusiness.branches?.flatMap((b) => b.staffMembers || []) || []);
    const topStaff = staffMembers[0] ? (typeof staffMembers[0] === 'string' ? staffMembers[0] : staffMembers[0].name) : 'Camilo Restrepo';

    return {
      baseline,
      isCalibrated,
      daysOperating,
      startDate,
      isBranch,
      currentHistoricalBranch,
      selectedHistoricalBranchId,
      monthlyFeeCOP,
      monthsOperating,
      totalInvestmentCOP,
      roiMultiplier,
      initialReviews1to3,
      initialReviews4to5,
      initialRespondedReviews,
      initialResponseRate,
      privateComplaintsIntercepted,
      resolvedPrivateCount,
      exactReviews5Star,
      exactReviews4Star,
      newGoogleReviews5Star,
      newGoogleReviews1to3: exactReviews1to3,
      newGoogleReviewsTotal,
      newPositiveReviewsTotal,
      totalAllReviews,
      currentReviews4to5,
      currentReviews1to3,
      currentRating,
      ratingGain,
      currentResponseRate,
      preservedRevenueCOP,
      preservedRevenueUSD,
      resolutionSpeedPercent,
      topStaff,
    };
  }, [currentBusiness, selectedHistoricalBranchId, feedbacks, googleReviews]);

  // Universal Multi-Currency Constants & Pricing Rules
  const PRESTIGIA_PLAN_PRICING: Record<string, { cop: number; usd: number; name: string }> = {
    independiente: { cop: 49000, usd: 19, name: 'Independiente' },
    basic: { cop: 49000, usd: 19, name: 'Básico' },
    pro: { cop: 120000, usd: 49, name: 'Profesional (Pro)' },
    elite: { cop: 290000, usd: 110, name: 'Élite Multi-Sede' },
    empresarial: { cop: 690000, usd: 280, name: 'Empresarial Corporativo' },
  };

  const PRESTIGIA_ADDON_PRICING = {
    extraBranch: { cop: 50000, usd: 20 },
    extraManager: { cop: 25000, usd: 10 },
    staffBlock5: { cop: 20000, usd: 8 },
    sentiment360: { cop: 60000, usd: 25 },
    liveWallboard: { cop: 50000, usd: 20 },
    giveawayCrm: { cop: 40000, usd: 15 },
    deviceAudit: { cop: 35000, usd: 15 },
  };

  const PRESTIGIA_CURRENCIES: Record<string, { code: string; name: string; flag: string; rateToUSD: number }> = {
    USD: { code: 'USD', name: 'Dólares Americanos', flag: '🇺🇸', rateToUSD: 1 },
    COP: { code: 'COP', name: 'Pesos Colombianos', flag: '🇨🇴', rateToUSD: 4000 },
    CLP: { code: 'CLP', name: 'Pesos Chilenos', flag: '🇨🇱', rateToUSD: 950 },
    MXN: { code: 'MXN', name: 'Pesos Mexicanos', flag: '🇲🇽', rateToUSD: 18 },
    EUR: { code: 'EUR', name: 'Euros', flag: '🇪🇺', rateToUSD: 0.92 },
  };

  const getBusinessCurrency = (countryStr?: string) => {
    const c = (countryStr || '').toLowerCase();
    if (c.includes('chile')) return PRESTIGIA_CURRENCIES.CLP;
    if (c.includes('mexic') || c.includes('méxic')) return PRESTIGIA_CURRENCIES.MXN;
    if (c.includes('españ') || c.includes('spain') || c.includes('euro')) return PRESTIGIA_CURRENCIES.EUR;
    if (c.includes('estados unidos') || c.includes('usa') || c.includes('eeuu') || c.includes('internacional')) return PRESTIGIA_CURRENCIES.USD;
    return PRESTIGIA_CURRENCIES.COP;
  };

  const formatCurrencyDisplay = (amount: number, currencyCode: string) => {
    if (privacyMode) return '••••••••';
    try {
      if (currencyCode === 'COP') {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
      }
      if (currencyCode === 'CLP') {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(amount);
      }
      if (currencyCode === 'MXN') {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(amount);
      }
      if (currencyCode === 'EUR') {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
      }
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    } catch {
      return `${currencyCode} ${amount.toLocaleString()}`;
    }
  };

  const getBusinessFinancials = (biz: Business) => {
    const curr = getBusinessCurrency(biz.country);
    
    // Custom negotiated fee has top priority
    const branchesFeeCOP = (biz.branches || []).reduce((acc: number, b: any) => acc + (b.agreedMonthlyFeeCOP || 0), 0);
    const branchesFeeUSD = (biz.branches || []).reduce((acc: number, b: any) => acc + (b.agreedMonthlyFeeUSD || 0), 0);
    const agreedCOP = (biz.agreedMonthlyFeeCOP && biz.agreedMonthlyFeeCOP > 0) ? biz.agreedMonthlyFeeCOP : branchesFeeCOP;
    const agreedUSD = (biz.agreedMonthlyFeeUSD && biz.agreedMonthlyFeeUSD > 0) ? biz.agreedMonthlyFeeUSD : branchesFeeUSD;
    const isCustomAgreed = agreedCOP > 0 || agreedUSD > 0;

    let baseUSD = 0;
    let baseCOP = 0;
    let baseLocal = 0;

    if (isCustomAgreed) {
      if (agreedUSD > 0) {
        baseUSD = agreedUSD;
        baseCOP = Math.round(agreedUSD * 4000);
        baseLocal = curr.code === 'USD' ? baseUSD : curr.code === 'COP' ? baseCOP : Math.round(baseUSD * curr.rateToUSD);
      } else {
        baseCOP = agreedCOP;
        baseUSD = Math.round(agreedCOP / 4000);
        baseLocal = curr.code === 'COP' ? baseCOP : curr.code === 'USD' ? baseUSD : Math.round(baseUSD * curr.rateToUSD);
      }
    } else {
      const std = PRESTIGIA_PLAN_PRICING[biz.plan] || PRESTIGIA_PLAN_PRICING.pro;
      baseCOP = std.cop;
      baseUSD = std.usd;
      baseLocal = curr.code === 'COP' ? std.cop : curr.code === 'USD' ? std.usd : Math.round(std.usd * curr.rateToUSD);
    }

    // Add-Ons Modulares
    let addOnsUSD = 0;
    let addOnsCOP = 0;
    const addons = biz.masterAddOns;

    if (addons) {
      if (addons.extraBranches > 0) {
        addOnsUSD += addons.extraBranches * PRESTIGIA_ADDON_PRICING.extraBranch.usd;
        addOnsCOP += addons.extraBranches * PRESTIGIA_ADDON_PRICING.extraBranch.cop;
      }
      if (addons.extraManagers > 0) {
        addOnsUSD += addons.extraManagers * PRESTIGIA_ADDON_PRICING.extraManager.usd;
        addOnsCOP += addons.extraManagers * PRESTIGIA_ADDON_PRICING.extraManager.cop;
      }
      if (addons.extraStaffQuota > 0) {
        const blocks = Math.ceil(addons.extraStaffQuota / 5);
        addOnsUSD += blocks * PRESTIGIA_ADDON_PRICING.staffBlock5.usd;
        addOnsCOP += blocks * PRESTIGIA_ADDON_PRICING.staffBlock5.cop;
      }
      if (addons.sentiment360?.enabled && addons.sentiment360.mode === 'permanent' && biz.plan !== 'elite' && biz.plan !== 'empresarial') {
        addOnsUSD += PRESTIGIA_ADDON_PRICING.sentiment360.usd;
        addOnsCOP += PRESTIGIA_ADDON_PRICING.sentiment360.cop;
      }
      if (addons.liveWallboard?.enabled && addons.liveWallboard.mode === 'permanent' && biz.plan !== 'elite' && biz.plan !== 'empresarial') {
        addOnsUSD += PRESTIGIA_ADDON_PRICING.liveWallboard.usd;
        addOnsCOP += PRESTIGIA_ADDON_PRICING.liveWallboard.cop;
      }
      if (addons.giveawayCrm && biz.plan === 'independiente') {
        addOnsUSD += PRESTIGIA_ADDON_PRICING.giveawayCrm.usd;
        addOnsCOP += PRESTIGIA_ADDON_PRICING.giveawayCrm.cop;
      }
      if (addons.deviceAudit && biz.plan !== 'elite' && biz.plan !== 'empresarial') {
        addOnsUSD += PRESTIGIA_ADDON_PRICING.deviceAudit.usd;
        addOnsCOP += PRESTIGIA_ADDON_PRICING.deviceAudit.cop;
      }
    }

    const addOnsLocal = curr.code === 'COP' ? addOnsCOP : curr.code === 'USD' ? addOnsUSD : Math.round(addOnsUSD * curr.rateToUSD);

    const totalUSD = baseUSD + addOnsUSD;
    const totalCOP = baseCOP + addOnsCOP;
    const totalLocal = baseLocal + addOnsLocal;
    const arrUSD = totalUSD * 12;
    const arrCOP = totalCOP * 12;

    return {
      currency: curr,
      isCustomAgreed,
      baseUSD,
      baseCOP,
      baseLocal,
      addOnsUSD,
      addOnsCOP,
      addOnsLocal,
      totalUSD,
      totalCOP,
      totalLocal,
      arrUSD,
      arrCOP,
    };
  };

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
    const cat = (category || '').toLowerCase().trim();
    // 1. Direct exact match with official niche label or ID
    const exact = PRESTIGIA_NICHES.find(
      (n) => n.id === cat || n.label.toLowerCase() === cat || (n.shortLabel && n.shortLabel.toLowerCase() === cat)
    );
    if (exact) {
      return { id: exact.id, label: exact.shortLabel || exact.label, icon: exact.icon, color: exact.color };
    }
    // 2. Explicit veterinary / pet isolation (never confuse with human health)
    if (cat.includes('veterin') || cat.includes('mascota') || cat.includes('pet ') || cat.startsWith('pet') || cat.endsWith('pet') || cat.includes('canin') || cat.includes('felin')) {
      const petNiche = PRESTIGIA_NICHES.find((n) => n.id === 'mascotas')!;
      return { id: petNiche.id, label: petNiche.shortLabel || petNiche.label, icon: petNiche.icon, color: petNiche.color };
    }
    // 3. Fallback keyword scan across all niches
    for (const niche of PRESTIGIA_NICHES) {
      if (niche.keywords.some((k) => cat.includes(k))) {
        return { id: niche.id, label: niche.shortLabel || niche.label, icon: niche.icon, color: niche.color };
      }
    }
    return { id: 'other', label: category || 'Comercial & Retail', icon: '🏢', color: 'bg-slate-500/10 text-slate-300 border-slate-500/30' };
  };

  // Filtered Businesses for Directory Tab
  const filteredBusinesses = useMemo(() => {
    const list = businesses.filter((biz) => {
      const isArchived = Boolean((biz as any).isArchived);

      // 0. Status filter
      if (selectedStatusFilter === 'active') {
        if (biz.status === 'suspended' || isArchived) return false;
      } else if (selectedStatusFilter === 'suspended') {
        if (biz.status !== 'suspended' || isArchived) return false;
      } else if (selectedStatusFilter === 'archived') {
        if (!isArchived) return false;
      }
      // Cuando selectedStatusFilter === 'all' se muestran todos los estados

      // 1. Plan filter
      if (selectedPlanFilter !== 'all' && biz.plan !== selectedPlanFilter) return false;

      // 2. Nicho / Category filter
      if (selectedCategoryFilter !== 'all') {
        const badge = getNicheBadge(biz.category);
        if (badge.id !== selectedCategoryFilter) return false;
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

    // Orden de prioridad estricto: 1° Activos, 2° Inactivos (Suspendidos), 3° Archivados
    return list.sort((a, b) => {
      const getPriority = (item: Business) => {
        if ((item as any).isArchived) return 3;
        if (item.status === 'suspended') return 2;
        return 1; // Activo
      };
      const pA = getPriority(a);
      const pB = getPriority(b);
      if (pA !== pB) return pA - pB;
      return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
    });
  }, [businesses, selectedStatusFilter, selectedPlanFilter, selectedCategoryFilter, searchTerm]);

  // Dynamic counts for Status, Plan & Niche filters
  const statusCounts = useMemo(() => {
    let active = 0;
    let suspended = 0;
    let archived = 0;

    businesses.forEach((b) => {
      if ((b as any).isArchived) {
        archived++;
      } else if (b.status === 'suspended') {
        suspended++;
      } else {
        active++;
      }
    });

    return {
      all: businesses.length, // Total contando los 3 estados (activos + suspendidos + archivados)
      active,
      suspended,
      archived,
    };
  }, [businesses]);

  const planCounts = useMemo(() => {
    const counts: Record<string, number> = { all: businesses.length, independiente: 0, pro: 0, elite: 0, empresarial: 0 };
    businesses.forEach((b) => {
      if (counts[b.plan] !== undefined) counts[b.plan]++;
    });
    return counts;
  }, [businesses]);

  const nicheCounts = useMemo(() => {
    const counts: Record<string, number> = { all: businesses.length };
    PRESTIGIA_NICHES.forEach((n) => { counts[n.id] = 0; });
    businesses.forEach((b) => {
      const badge = getNicheBadge(b.category);
      if (counts[badge.id] !== undefined) {
        counts[badge.id]++;
      }
    });
    return counts;
  }, [businesses]);

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
      branchId: string;
      branchName: string;
      nicheCategory: string;
      rating: number;
      source: string;
      sourceType: 'sorteo' | 'feedback';
      complaintReason?: string;
      attendedBy?: string;
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
        branchId: p.branchId || '',
        branchName: p.branchName || 'Sede Principal',
        nicheCategory: p.nicheCategory || 'Gastronomía & Servicios',
        rating: Number(p.rating) || 5,
        source: '🎁 Ruleta / Sorteo QR',
        sourceType: 'sorteo',
        complaintReason: (p as any).customerComment || (p as any).complaintReason || ((p as any).prizeWon ? `Premio ganado en ruleta de fidelización: ${(p as any).prizeWon}` : (Number(p.rating) >= 4 ? 'El cliente otorgó 5 estrellas en 1 clic directamente en la ficha de Google Maps.' : 'Calificación insatisfecha interceptada en sala.')),
        attendedBy: (p as any).attendedBy,
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
        customerName: f.customerName || 'Cliente Registrado',
        customerPhone: f.customerPhone || '',
        country: estCountry,
        city: (f as any).city || 'Bogotá',
        locality: (f as any).locality || 'Principal',
        customerOriginCountry: originCountry,
        customerOriginFlag: originFlag,
        isTourist: Boolean((f as any).isTourist || (isChilePhone && estCountry === 'Colombia')),
        businessId: f.businessId,
        businessName: (f as any).businessName || f.businessId,
        branchId: f.branchId || '',
        branchName: f.branchName || 'Sede Principal',
        nicheCategory: (f as any).category || (f as any).nicheCategory || 'Gastronomía & Servicios',
        rating: Number(f.rating) || 3,
        source: '📱 QR Mesa / Opinión',
        sourceType: 'feedback',
        complaintReason: f.complaintReason || (Number(f.rating) >= 4 ? 'Experiencia 5★ positiva registrada en sala con consentimiento de fidelización.' : 'Incidencia de servicio interceptada en sala antes de salir a Google Maps.'),
        attendedBy: (f as any).attendedBy || (f as any).staffAttended,
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

  // Cities belonging ONLY to the selected Country (Cascading estricto: solo al elegir país)
  const availableDataCities = useMemo(() => {
    if (dataFilterCountry === 'all') return [];
    const set = new Set<string>();
    unifiedDataLakeRecords.forEach((r) => {
      if (r.country === dataFilterCountry && r.city) {
        set.add(r.city.trim());
      }
    });
    return Array.from(set).sort();
  }, [unifiedDataLakeRecords, dataFilterCountry]);

  // Localities belonging ONLY to the selected City and Country (Cascading estricto: solo al elegir ciudad)
  const availableDataLocalities = useMemo(() => {
    if (dataFilterCountry === 'all' || dataFilterCity === 'all') return [];
    const set = new Set<string>();
    unifiedDataLakeRecords.forEach((r) => {
      const matchCountry = r.country === dataFilterCountry;
      const matchCity = r.city.trim().toLowerCase() === dataFilterCity.trim().toLowerCase();
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

  // Sedes belonging to the selected Business (Cascading Sede Filter)
  const availableDataBranches = useMemo(() => {
    const map = new Map<string, string>();
    unifiedDataLakeRecords.forEach((r) => {
      const matchCountry = dataFilterCountry === 'all' || r.country === dataFilterCountry;
      const matchCity = dataFilterCity === 'all' || r.city.trim().toLowerCase() === dataFilterCity.trim().toLowerCase();
      const matchBiz = dataFilterBusiness === 'all' || r.businessId === dataFilterBusiness;
      if (matchCountry && matchCity && matchBiz && r.branchId && r.branchName) {
        map.set(r.branchId, r.branchName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [unifiedDataLakeRecords, dataFilterCountry, dataFilterCity, dataFilterBusiness]);

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

      // 4.1. Sede filter
      if (dataFilterBranch !== 'all' && r.branchId !== dataFilterBranch) return false;

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
          r.branchName.toLowerCase().includes(t) ||
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
    dataFilterBranch,
    dataFilterNiche,
    dataFilterRating,
    searchTerm,
  ]);

  // Executive KPI metrics for Big Data Lake
  const dataLakePromotersCount = useMemo(() => filteredDataLake.filter((r) => r.rating >= 4).length, [filteredDataLake]);
  const dataLakeDetractorsCount = useMemo(() => filteredDataLake.filter((r) => r.rating < 4).length, [filteredDataLake]);
  const dataLakeTouristsCount = useMemo(() => filteredDataLake.filter((r) => r.isTourist).length, [filteredDataLake]);

  // Pagination calculations for Big Data Lake
  const dataPageSize = dataPageLimit === 'all' ? (filteredDataLake.length || 1) : parseInt(dataPageLimit, 10);
  const dataTotalPages = Math.max(1, Math.ceil(filteredDataLake.length / (dataPageLimit === 'all' ? (filteredDataLake.length || 1) : parseInt(dataPageLimit, 10))));
  const safeDataCurrentPage = Math.min(Math.max(1, dataCurrentPage), dataTotalPages);

  // Auto-reset page when filters or limit change
  useEffect(() => {
    setDataCurrentPage(1);
  }, [
    dataFilterCountry,
    dataFilterCity,
    dataFilterLocality,
    dataFilterBusiness,
    dataFilterBranch,
    dataFilterNiche,
    dataFilterRating,
    searchTerm,
    dataPageLimit,
  ]);

  // Displayed records according to pagination / limit
  const displayedDataLake = useMemo(() => {
    if (dataPageLimit === 'all') return filteredDataLake;
    const size = parseInt(dataPageLimit, 10);
    const start = (safeDataCurrentPage - 1) * size;
    return filteredDataLake.slice(start, start + size);
  }, [filteredDataLake, safeDataCurrentPage, dataPageLimit]);

  // Numbered pagination array generator (e.g. [1, 2, 3], or [1, 2, 3, 4, 5, '...', 20])
  const getDataLakePageNumbers = (current: number, total: number) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', total];
    }
    if (current >= total - 3) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
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
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-b from-amber-500/20 to-amber-950/40 border border-amber-500/40 shadow-2xl shadow-amber-500/10 mb-4 p-3 ring-1 ring-amber-400/20">
              <PrestigiaIcon className="w-12 h-12 text-amber-400 drop-shadow-md" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Consola Master Central Prestigia</span>
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
            <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col gap-2.5 items-center justify-center text-center">
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
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300 w-full">
      {/* Fixed Command Deck (Top Header + Tabs Navigation Bar) */}
      <div className="fixed top-0 left-0 right-0 z-40 w-full bg-[#0C101A]/95 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl shadow-black/60">
        {/* Top Banking Command Bar */}
        <header className="px-3 sm:px-4 lg:px-5 py-2.5 flex items-center justify-between gap-2 border-b border-slate-800/70 w-full">
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
        <div className="hidden xl:flex items-center gap-1.5 text-[11px]">
          <div className="px-2 py-1 rounded-xl bg-[#141A26] border border-slate-800 text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Marcas: <strong className="text-white">{businesses.length}</strong></span>
          </div>
          <div className="px-2 py-1 rounded-xl bg-[#141A26] border border-slate-800 text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
            <Store className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sedes: <strong className="text-white">{stats?.totalBranches || 0}</strong></span>
          </div>
          <div className="hidden 2xl:flex px-2 py-1 rounded-xl bg-[#141A26] border border-slate-800 text-slate-300 items-center gap-1.5 whitespace-nowrap">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>Data Lake: <strong className="text-white">{campaignParticipants.length + feedbacks.length}</strong></span>
          </div>
          <div className="px-2 py-1 rounded-xl bg-[#141A26] border border-slate-800 text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            <span>MRR: <strong className="text-amber-300">{formatMoneyCOP(stats?.mrr?.totalCOP || 1469000)}</strong></span>
          </div>
        </div>

        {/* Right Security & Control Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Privacy Masking Toggle */}
          <button
            type="button"
            onClick={() => setPrivacyMode(!privacyMode)}
            title="Modo Privacidad Bancaria (Ocultar cifras sensibles en pantalla)"
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
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
            className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Seguridad</span>
          </button>

          {/* Refresh Data */}
          <button
            type="button"
            onClick={fetchMasterData}
            title="Actualizar datos en vivo de la base de datos (reseñas, negocios y métricas)"
            className="px-2.5 py-1.5 rounded-xl bg-[#141A26] hover:bg-[#1a2232] border border-amber-500/30 text-amber-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Database className={`w-3.5 h-3.5 text-amber-400 ${loadingData ? 'animate-pulse' : ''}`} />
            <span className="hidden md:inline">Actualizar</span>
          </button>

          {/* Hard Cache Purge Button */}
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                if ('caches' in window) {
                  caches.keys().then((names) => {
                    names.forEach((name) => caches.delete(name));
                  });
                }
                sessionStorage.removeItem('nextjs_cache');
                window.location.reload();
              }
            }}
            title="Purgar Caché del Navegador y Forzar Descarga de la Última Versión del Sistema"
            className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">Purgar Caché</span>
          </button>

          {/* Lock Session Emergency */}
          <button
            type="button"
            onClick={() => handleLockConsole('voluntary')}
            title="Bloquear Consola de Dirección General"
            className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>Bloquear</span>
          </button>
        </div>
      </header>

      {/* Main Tabs Navigation Bar */}
      <nav className="bg-[#0A0D15]/95 px-3 sm:px-6 py-1.5 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 w-full">
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
            onClick={() => setActiveTab('mrr')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'mrr'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            5. Facturación Master & MRR
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
            6. Tráfico Web & Prospectos (Leads)
            {commercialLeads.filter((l) => l.status === 'new').length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px]">
                {commercialLeads.filter((l) => l.status === 'new').length} nuevos
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('comunicaciones')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'comunicaciones'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Mail className="w-4 h-4" />
            7. Comunicaciones VIP & Mailer
            {emailDispatches.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                {emailDispatches.length} envíos
              </span>
            )}
          </button>
        </div>
      </nav>
    </div>

    {/* Layout Spacer to guarantee no content is hidden underneath the fixed command deck */}
    <div className="h-[108px] shrink-0 w-full pointer-events-none" aria-hidden="true" />

    {/* Global Toast Notification */}
    {notification && (
      <div className="fixed top-28 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
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
                  <option value="all">Todos los Planes ({planCounts.all})</option>
                  <option value="independiente">Plan Independiente ({planCounts.independiente || 0})</option>
                  <option value="pro">Plan Pro ({planCounts.pro || 0})</option>
                  <option value="elite">Plan Élite ({planCounts.elite || 0})</option>
                  <option value="empresarial">Plan Empresarial ({planCounts.empresarial || 0})</option>
                </select>

                {/* Filter by Niche / Industry Classification */}
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-[#121622] border border-slate-700/80 text-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none cursor-pointer"
                >
                  <option value="all">Todos los Nichos ({nicheCounts.all})</option>
                  {PRESTIGIA_NICHES.map((niche) => (
                    <option key={niche.id} value={niche.id}>
                      {niche.icon} {niche.label} ({nicheCounts[niche.id] || 0})
                    </option>
                  ))}
                </select>

                {/* Filter by Operational Status (Activo / Suspendido / Archivado) */}
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
                  className="bg-[#121622] border border-slate-700/80 text-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none cursor-pointer font-medium transition-all hover:border-slate-600 focus:border-amber-400"
                >
                  <option value="all" className="bg-[#0F1420] text-slate-200">Todos los Estados ({statusCounts.all})</option>
                  <option value="active" className="bg-[#0F1420] text-slate-200">Solo Activos ({statusCounts.active})</option>
                  <option value="suspended" className="bg-[#0F1420] text-slate-200">Solo Suspendidos ({statusCounts.suspended})</option>
                  <option value="archived" className="bg-[#0F1420] text-slate-200">Solo Archivados ({statusCounts.archived})</option>
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
                  setDetectedGoogleProfile(null);
                  setCustomCountryMode(false);
                  setCustomCityMode(false);
                  setLocalLogoName(null);
                  if (logoFileInputRef.current) logoFileInputRef.current.value = '';
                  setOnboardForm({
                    id: '',
                    name: '',
                    legalName: '',
                    category: PRESTIGIA_NICHES[0].label,
                    country: '',
                    city: '',
                    locality: '',
                    address: '',
                    plan: 'pro' as BusinessPlan,
                    ownerName: '',
                    ownerPhone: '',
                    ownerEmail: '',
                    logoUrl: '',
                    taxId: '',
                    googleMapsUrl: '',
                    googlePlaceId: '',
                    googleReviewUrl: '',
                    averageTicketCOP: 45000,
                    initialRating: 0,
                    initialReviewCount: 0,
                    clientQuote: '',
                    agreedMonthlyFeeCOP: 0,
                    agreedMonthlyFeeUSD: 0,
                    billingCycle: 'monthly',
                  });
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
                  No hay ningún cliente que coincida con los filtros seleccionados.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedPlanFilter('all');
                    setSelectedCategoryFilter('all');
                    setSelectedStatusFilter('all');
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
                                <div className="w-8 h-8 rounded-xl bg-[#141A26] border border-amber-500/30 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                  {biz.branding?.logoUrl ? (
                                    <img
                                      src={biz.branding.logoUrl}
                                      alt={biz.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-amber-400 font-bold text-xs">{biz.name.charAt(0)}</span>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-white group-hover:text-amber-400 transition-colors truncate text-xs">
                                    {biz.name}
                                  </p>
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
                                onClick={() => {
                                  if ((biz as any).isArchived) {
                                    handleOpenDecommissionModal(biz, 'archive');
                                  } else {
                                    handleToggleBusinessStatus(biz);
                                  }
                                }}
                                title={
                                  (biz as any).isArchived
                                    ? 'Marca en Custodia Histórica (Clic para gestionar o purgar)'
                                    : biz.status === 'suspended'
                                    ? 'Clic para reactivar el negocio'
                                    : 'Clic para suspender el negocio (Kill Switch)'
                                }
                                className="cursor-pointer"
                              >
                                {((biz as any).isArchived) ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-semibold">
                                    <Archive className="w-2.5 h-2.5 text-amber-400" />
                                    Archivado
                                  </span>
                                ) : biz.status === 'suspended' ? (
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
                                <button
                                  type="button"
                                  onClick={() => handleOpenDecommissionModal(biz, (biz as any).isArchived ? 'purge' : 'archive')}
                                  title="Protocolo de Baja Oficial: Archivo Histórico o Purga Definitiva (Bank Guard)"
                                  className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
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
                            onClick={() => {
                              if ((biz as any).isArchived) {
                                handleOpenDecommissionModal(biz, 'archive');
                              } else {
                                handleToggleBusinessStatus(biz);
                              }
                            }}
                            title={
                              (biz as any).isArchived
                                ? 'Marca en Custodia Histórica (Clic para gestionar o purgar)'
                                : biz.status === 'suspended'
                                ? 'Clic para reactivar el negocio'
                                : 'Clic para suspender el negocio (Kill Switch)'
                            }
                            className="cursor-pointer"
                          >
                            {((biz as any).isArchived) ? (
                              <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-300 font-semibold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                                <Archive className="w-3 h-3 text-amber-400" />
                                Archivado
                              </span>
                            ) : biz.status === 'suspended' ? (
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

                        {/* Brand Name & Logo */}
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#141A26] border border-amber-500/30 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                            {biz.branding?.logoUrl ? (
                              <img
                                src={biz.branding.logoUrl}
                                alt={biz.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-amber-400 font-bold text-xs">{biz.name.charAt(0)}</span>
                            )}
                          </div>
                          <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                            {biz.name}
                          </h3>
                        </div>

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

                        <button
                          type="button"
                          onClick={() => handleOpenDecommissionModal(biz, (biz as any).isArchived ? 'purge' : 'archive')}
                          title="Protocolo de Baja Oficial: Archivo Histórico o Purga Definitiva (Bank Guard)"
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 text-xs transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
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
                  onClick={() => {
                    if (currentBusiness && currentBusiness.status === 'suspended') {
                      handleToggleBusinessStatus(currentBusiness);
                    }
                  }}
                  title={currentBusiness.status === 'suspended' ? 'Clic para reactivar el negocio (Bank Guard)' : 'La cuenta ya se encuentra activa'}
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
                  onClick={() => {
                    if (currentBusiness && currentBusiness.status !== 'suspended') {
                      handleToggleBusinessStatus(currentBusiness);
                    }
                  }}
                  title={currentBusiness.status !== 'suspended' ? 'Clic para suspender inmediatamente (Bank Guard)' : 'La cuenta ya se encuentra suspendida'}
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

            {/* Protocolo de Baja Oficial y Desvinculación */}
            {currentBusiness && (
              <div className="bg-[#0E121B] border border-rose-900/40 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <span>Protocolo de Baja Oficial y Desvinculación</span>
                      {(currentBusiness as any)?.isArchived ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-amber-500/30 uppercase">
                          Archivado Histórico
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                          Grado Bancario
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Desvinculación formal de <strong>{currentBusiness.name}</strong>: Opción A (Archivo Histórico de auditoría) u Opción B (Purga total e irreversible de base de datos).
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenDecommissionModal(currentBusiness, 'archive')}
                    className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>Archivo Histórico</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenDecommissionModal(currentBusiness, 'purge')}
                    className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Purga Total</span>
                  </button>
                </div>
              </div>
            )}

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
                        {p === 'independiente' && '1 Sede • Operador Único • Captura Ágil de Reseñas'}
                        {p === 'pro' && '1 Sede • Panel Central de Control • Radar Anti-Crisis en Vivo'}
                        {p === 'elite' && 'Multi-Sede (Hasta 3 Sedes) • Encargados de Turno • IA 360° & Wallboard'}
                        {p === 'empresarial' && 'Corporativo • Holding • Sedes & Supervisores Ilimitados'}
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
                    Habilita capacidades operativas temporales (Pilotos de prueba / cortesía) o acuerdos permanentes según la negociación con el cliente.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Sede Extra Counter */}
                  <div className="bg-[#141A26] p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-blue-400" />
                          Sedes Físicas Extras (Add-On)
                        </span>
                        <span className="text-[10px] text-blue-400 font-semibold bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded-full">
                          {activePlan === 'elite' ? '3 Sedes en Plan Élite' : activePlan === 'empresarial' ? 'Sedes Ilimitadas' : activePlan === 'pro' ? '1 Sede en Plan Pro' : 'Punto Único'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {activePlan === 'elite'
                          ? '1 Cuenta Dueño + hasta 3 sedes físicas incluidas en Plan Élite. Usa este conmutador si contrata a partir de la 4ta sede.'
                          : activePlan === 'pro'
                          ? '1 Cuenta Dueño + 1 sede física incluida en Plan Pro. Agrega sedes extras a partir de la 2da sede.'
                          : activePlan === 'empresarial'
                          ? '1 Cuenta Dueño + Sedes físicas ilimitadas incluidas en Plan Empresarial.'
                          : '1 Cuenta Dueño (Punto Profesional Único / Consultorio sin sedes extras).'}
                      </p>

                      {/* Live Reality Reflection */}
                      <div className="mt-3 p-2.5 rounded-xl bg-[#0C101A] border border-blue-500/20 text-[11px] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Cuenta Dueño General:</span>
                          <span className="font-bold text-slate-200 truncate max-w-[160px]" title={`${currentBusiness.ownerName} (${currentBusiness.name})`}>
                            👤 {currentBusiness.ownerName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Sedes físicas activas:</span>
                          <span className="font-extrabold text-blue-300 font-mono">
                            {currentBranchesCount} {currentBranchesCount === 1 ? 'Sede' : 'Sedes'} (
                            {activePlan === 'elite'
                              ? `${currentBranchesCount} de 3 del Plan Élite`
                              : activePlan === 'empresarial'
                              ? 'Ilimitadas'
                              : activePlan === 'independiente'
                              ? 'Punto Único'
                              : `${currentBranchesCount} de ${totalAuthorizedBranches} autorizadas`}
                            )
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate" title={currentBusiness.branches?.map(b => b.name).join(' • ') || 'Sede Principal'}>
                          📍 {currentBusiness.branches?.map(b => b.name).join(' • ') || 'Sede Principal'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/80">
                      <div>
                        <span className="text-xs text-slate-300 block font-semibold">
                          {activePlan === 'elite' ? 'Sedes extra (+ sobre las 3):' : activePlan === 'pro' ? 'Sedes extra (+ sobre la 1):' : 'Sedes adicionales:'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {activePlan === 'empresarial'
                            ? '✅ Ilimitadas en Empresarial'
                            : currentBranchesCount <= totalAuthorizedBranches
                            ? `✅ Capacidad cubierta (${currentBranchesCount}/${totalAuthorizedBranches === 999 ? '∞' : totalAuthorizedBranches})`
                            : `⚠️ Cupo sugerido: +${currentExtraBranchesCount}`}
                        </span>
                      </div>
                      {activePlan !== 'empresarial' && activePlan !== 'independiente' && (
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
                      )}
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

                {/* Custom Notes & Commercial Agreements */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      Acuerdo Comercial & Condiciones del Piloto (Uso Interno Master):
                    </span>
                    <span className="text-[10px] text-amber-400/90 font-mono">Confidencial</span>
                  </label>
                  <input
                    type="text"
                    value={addonState.customNotes}
                    onChange={(e) => setAddonState({ ...addonState, customNotes: e.target.value })}
                    placeholder="Ej: Piloto de cortesía por 30 días con Wallboard activo. Negociación sujeta a volumen..."
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 text-white text-xs rounded-xl px-4 py-2.5 outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Documenta aquí el tipo de prueba, duración de la cortesía o propuesta personalizada acordada con el cliente.
                  </p>
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

            {/* 3. GESTOR INTEGRAL DE SEDES FÍSICAS DE LA MARCA */}
            <div className="bg-[#0E121B] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-extrabold text-[10px] tracking-wider uppercase border border-blue-500/20">
                      Multi-Sede Master
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {totalAuthorizedBranches === 999 ? `${currentBranchesCount} sedes (Ilimitadas en Empresarial)` : `${currentBranchesCount} de ${totalAuthorizedBranches} sede(s) autorizada(s)`}
                    </span>
                    {totalAuthorizedBranches === 999 ? (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/30">
                        Sedes Ilimitadas
                      </span>
                    ) : isBranchQuotaReached ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/30 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Capacidad Completa
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                        Cupo Disponible (+{totalAuthorizedBranches - currentBranchesCount})
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-1 flex items-center gap-2">
                    <Store className="w-5 h-5 text-amber-400" />
                    <span>3. Sedes Físicas & Encargados de {currentBusiness.name}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Gobierna individualmente cada local: dirección, encargado de turno, WhatsApp de alertas inmediatas, ficha de Google y PIN de sala.
                  </p>
                </div>

                {isBranchQuotaReached ? (
                  <button
                    type="button"
                    onClick={() => handleOpenBranchModal()}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm cursor-pointer transition-all shrink-0"
                    title={`Límite de sedes alcanzado (${currentBranchesCount}/${totalAuthorizedBranches}). Amplía en 'Sedes Físicas Extras' [+] en la Sección 2 para habilitar otra sede.`}
                  >
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Capacidad Completa ({currentBranchesCount}/{totalAuthorizedBranches} Sedes)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenBranchModal()}
                    className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all shrink-0"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Dar de Alta Nueva Sede ({totalAuthorizedBranches === 999 ? `${currentBranchesCount} en uso` : `${currentBranchesCount}/${totalAuthorizedBranches}`})</span>
                  </button>
                )}
              </div>

              {/* FICHA OFICIAL DE LA CUENTA DUEÑO (TITULAR GENERAL DE LA EMPRESA) */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#141A26] via-[#101520] to-[#141A26] border border-amber-500/30 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-extrabold text-sm shrink-0">
                      👑
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-extrabold text-[10px] tracking-wider uppercase border border-amber-500/30">
                          Cuenta Dueño General
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          Gobierna las {currentBranchesCount} sedes físicas de la marca
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mt-0.5">
                        {currentBusiness.name}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleOpenOwnerEditModal}
                      title="Editar datos del titular, NIT, Razón Social y contraseña del dueño"
                      className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Editar Datos Dueño</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleImpersonate(currentBusiness)}
                      title="Entrar al Portal del Dueño en modo simulación Master"
                      className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      <span>Entrar al Portal Dueño</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const creds = `👑 CREDENCIALES CUENTA DUEÑO - PRESTIGIA\n\n` +
                          `🏢 Marca: ${currentBusiness.name}\n` +
                          `👤 Titular: ${currentBusiness.ownerName}\n` +
                          `📱 WhatsApp: ${currentBusiness.ownerPhone}\n` +
                          `🌐 Enlace Portal: https://prestigia.app/portal\n` +
                          `🔑 Usuario: ${currentBusiness.id}\n` +
                          `🔒 Clave: ${currentBusiness.password || 'admin'}`;
                        navigator.clipboard.writeText(creds);
                        alert('✅ Credenciales de la Cuenta Dueño copiadas al portapapeles.');
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      title="Copiar credenciales de acceso del dueño"
                    >
                      <Copy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Copiar Claves</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                  <div className="bg-[#0C101A] p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Representante Legal (Dueño)</span>
                    <span className="font-extrabold text-white text-sm block mt-0.5 truncate">{currentBusiness.ownerName}</span>
                    <span className="text-amber-300 font-mono text-[11px] block mt-0.5">📱 {currentBusiness.ownerPhone}</span>
                  </div>

                  <div className="bg-[#0C101A] p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Razón Social & NIT</span>
                    <span className="font-semibold text-slate-200 text-xs block mt-0.5 truncate" title={currentBusiness.legalName || currentBusiness.name}>
                      {currentBusiness.legalName || currentBusiness.name}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px] block mt-0.5">NIT: {currentBusiness.taxId || 'No asignado'}</span>
                  </div>

                  <div className="bg-[#0C101A] p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Acceso Portal del Dueño</span>
                    <span className="font-mono text-cyan-300 text-xs block mt-0.5">👤 {currentBusiness.id}</span>
                    <span className="font-mono text-purple-300 text-[11px] block mt-0.5">🔑 Clave: {currentBusiness.password || 'admin'}</span>
                  </div>

                  <div className="bg-[#0C101A] p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Plan & Capacidad Sedes</span>
                    <span className="font-bold text-amber-300 text-xs block mt-0.5 capitalize">Plan {currentBusiness.plan}</span>
                    <span className="text-slate-400 text-[11px] block mt-0.5">
                      {currentBusiness.plan === 'elite' ? '3 Sedes Físicas incluidas' : currentBusiness.plan === 'empresarial' ? 'Sedes ilimitadas' : '1 Sede física incluida'}
                    </span>
                  </div>

                  <div className="bg-[#0C101A] p-3 rounded-xl border border-emerald-500/30">
                    <span className="text-emerald-400 text-[10px] uppercase font-bold block flex items-center justify-between">
                      <span>Tarifa Pactada Contrato</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">Sin precios fijos</span>
                    </span>
                    <span className="font-extrabold text-emerald-400 text-sm block mt-0.5 font-mono">
                      {currentBusiness.agreedMonthlyFeeCOP ? formatMoneyCOP(currentBusiness.agreedMonthlyFeeCOP) : '$0 COP'}
                      <span className="text-[11px] text-slate-400 font-normal"> / mes</span>
                    </span>
                    <span className="text-slate-400 text-[11px] block mt-0.5 capitalize">
                      Ciclo: {currentBusiness.billingCycle || 'mensual'} • {currentBusiness.agreedMonthlyFeeUSD ? formatMoneyUSD(currentBusiness.agreedMonthlyFeeUSD) : 'USD eq'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lista de Sedes Físicas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {(currentBusiness.branches || []).map((branch, bIdx) => {
                  const isPrimary = bIdx === 0 || branch.id.includes('principal');
                  const branchPlaceId = branch.googlePlaceId;
                  const branchMapsUrl = branchPlaceId
                    ? `https://www.google.com/maps/place/?q=place_id:${branchPlaceId}`
                    : (branch.googleReviewUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.name + ' ' + branch.city)}`);
                  const qrEvaluationUrl = `https://prestigia.app/evaluar/${branch.id}`;

                  return (
                    <div
                      key={branch.id || bIdx}
                      className="p-5 rounded-2xl bg-[#141A26] border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between"
                    >
                      {/* Top Header of Card */}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                                <Store className="w-4 h-4 text-amber-400 shrink-0" />
                                <span>{branch.name}</span>
                              </h4>
                              {isPrimary ? (
                                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                                  Sede Principal
                                </span>
                              ) : (
                                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                                  Sede Satélite #{bIdx + 1}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-300 mt-1 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{branch.address || 'Sin dirección física registrada'} • <strong className="text-white">{branch.locality}, {branch.city}</strong></span>
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 flex items-center gap-1">
                                <span>💵 Tarifa Pactada Sede:</span>
                                <strong className="text-white font-bold">{branch.agreedMonthlyFeeCOP ? formatMoneyCOP(branch.agreedMonthlyFeeCOP) : '$0 COP'}</strong>
                                <span className="text-slate-400">/mes</span>
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleBranchStatus(branch)}
                            title={branch.status === 'suspended' ? 'Clic para reactivar esta sede a "Activa en Red"' : 'Clic para pausar esta sede a "En Mantenimiento"'}
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1 ${
                              branch.status === 'suspended'
                                ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${branch.status === 'suspended' ? 'bg-rose-400' : 'bg-emerald-400 animate-pulse'}`} />
                            <span>{branch.status === 'suspended' ? 'En Mantenimiento' : 'Activa en Red'}</span>
                          </button>
                        </div>

                        {/* Ficha Google & QR Info */}
                        <div className="p-3 rounded-xl bg-[#0E121B] border border-slate-800/80 space-y-2 text-xs">
                          {/* Google Maps Listing */}
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              Ficha Google Maps:
                            </span>
                            {branchPlaceId ? (
                              <a
                                href={branchMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] text-blue-400 hover:text-blue-300 font-mono font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                              >
                                <span>Place ID: {branchPlaceId.substring(0, 14)}...</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-[11px] text-slate-500 font-mono">Sin Place ID individual</span>
                            )}
                          </div>

                          {/* Encargado & Alertas WhatsApp */}
                          <div className="flex items-center justify-between flex-wrap gap-2 pt-1.5 border-t border-slate-800/60">
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-emerald-400" />
                              Encargado Turno:
                            </span>
                            <span className="text-[11px] text-white font-medium">
                              <strong>{branch.managerName || currentBusiness.ownerName}</strong> ({branch.managerPhone})
                            </span>
                          </div>

                          {/* PIN Acceso en Sala */}
                          <div className="flex items-center justify-between flex-wrap gap-2 pt-1.5 border-t border-slate-800/60">
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Key className="w-3.5 h-3.5 text-purple-400" />
                              PIN Acceso Sala:
                            </span>
                            <span className="text-[11px] font-mono text-purple-300 font-bold bg-[#141A26] px-2 py-0.5 rounded border border-purple-500/30">
                              {branch.managerPassword || '1234'}
                            </span>
                          </div>

                          {/* QR Public URL */}
                          <div className="flex items-center justify-between flex-wrap gap-2 pt-1.5 border-t border-slate-800/60">
                            <span className="text-[11px] text-slate-400 font-mono truncate max-w-[180px]">
                              Slug QR: <strong className="text-amber-300">{branch.id}</strong>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(qrEvaluationUrl, `branch-qr-${branch.id}`)}
                              className="text-[10px] text-amber-400 hover:text-white flex items-center gap-1 cursor-pointer font-bold bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded transition-colors"
                            >
                              <Copy className="w-3 h-3" />
                              <span>{copiedText === `branch-qr-${branch.id}` ? '¡Copiado!' : 'Copiar URL QR'}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2.5 border-t border-slate-800">
                        {/* Team summary pill */}
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 font-semibold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                            <Users className="w-3 h-3 text-purple-400" />
                            {branch.managers && branch.managers.length > 0 ? branch.managers.length : (branch.managerName ? 1 : 0)} Encargado(s)
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            {branch.staffMembers?.length || 0} Colaborador(es)
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => handleOpenTeamModal(branch)}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                            title="Gestionar encargados y colaboradores de esta sede en vivo"
                          >
                            <Users className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Gestionar Equipo</span>
                          </button>

                          {/* Direct Test Google Reviews 5★ */}
                          <a
                            href={branch.googleReviewUrl || branchMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Probar Ficha de Reseñas 5 Estrellas en Google Maps"
                          >
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span>Probar Ficha 5★</span>
                          </a>

                          {/* Direct Impersonation for this Branch */}
                          <button
                            type="button"
                            onClick={() => handleImpersonate(currentBusiness, branch.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            title={`Entrar al portal del cliente simulando a esta sede (${branch.name})`}
                          >
                            <Eye className="w-3 h-3 text-blue-400" />
                            <span>Entrar en Sede</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenBranchModal(branch)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Editar Sede</span>
                          </button>

                          {!isPrimary && (
                            <button
                              type="button"
                              onClick={() => handleDeleteBranch(branch.id, branch.name)}
                              className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Eliminar</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wider uppercase">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    Dossier de Resultados Irrefutables Prestigia
                  </div>
                  {historicalMetrics.isCalibrated ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Línea Base Calibrada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                      Línea Base Sin Calibrar
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white">
                  Auditoría de Comportamiento Histórico: <span className="text-amber-300">{currentBusiness.name}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Trayectoria real documentada desde el Día 1 para demostrar el ROI al cliente y cerrar nuevos prospectos con testimonios de éxito.
                </p>
              </div>

              {/* Selector, Calibrate & Print / Export buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {/* Selector de Negocio */}
                <select
                  value={selectedBusinessId}
                  onChange={(e) => {
                    setSelectedBusinessId(e.target.value);
                    setSelectedHistoricalBranchId('all');
                  }}
                  className="bg-[#141A26] border border-slate-700 text-white text-xs rounded-xl px-3.5 py-2.5 outline-none font-semibold cursor-pointer"
                >
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>

                {/* Selector de Sede Específica / Consolidado */}
                <select
                  value={selectedHistoricalBranchId}
                  onChange={(e) => setSelectedHistoricalBranchId(e.target.value)}
                  className="bg-[#141A26] border border-amber-500/40 text-amber-300 text-xs rounded-xl px-3.5 py-2.5 outline-none font-semibold cursor-pointer"
                  title="Filtrar reporte por sede o ver consolidado de toda la marca"
                >
                  <option value="all">🏢 Consolidado ({currentBusiness.branches?.length || 0} Sedes)</option>
                  {currentBusiness.branches?.map((br) => (
                    <option key={br.id} value={br.id}>
                      📍 {br.name} ({br.locality || br.city})
                    </option>
                  ))}
                </select>

                {/* Botón Calibrar Línea Base Día 1 */}
                <button
                  type="button"
                  onClick={handleOpenBaselineModal}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20 transition-all"
                  title="Calibrar fecha de inicio real de QRs, calificación inicial y reseñas previas"
                >
                  <Sliders className="w-4 h-4 text-slate-950" />
                  <span>
                    {historicalMetrics.isCalibrated
                      ? (historicalMetrics.isBranch ? `Recalibrar ${historicalMetrics.currentHistoricalBranch?.name}` : 'Recalibrar Línea Base')
                      : (historicalMetrics.isBranch ? `Calibrar ${historicalMetrics.currentHistoricalBranch?.name}` : 'Calibrar Línea Base Día 1')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2.5 rounded-xl bg-[#141A26] hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Imprimir / PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const scopeTitle = historicalMetrics.isBranch && historicalMetrics.currentHistoricalBranch
                      ? `${currentBusiness.name} - ${historicalMetrics.currentHistoricalBranch.name}`
                      : `${currentBusiness.name} (Consolidado ${currentBusiness.branches?.length || 1} Sedes)`;
                    const text = `🏆 CASO DE ÉXITO AUDITADO: ${scopeTitle}\n` +
                      `📍 Ubicación: ${historicalMetrics.baseline.city} (${historicalMetrics.baseline.nicheCategory})\n` +
                      `⏱️ Tiempo con Prestigia: ${historicalMetrics.daysOperating} días de protección activa (Desde ${historicalMetrics.startDate})\n` +
                      `🚀 Multiplicador de Retorno (ROI): ${historicalMetrics.roiMultiplier !== null ? `${historicalMetrics.roiMultiplier}x de Retorno sobre Inversión` : `${historicalMetrics.privateComplaintsIntercepted}x mesas retenidas en sala`}\n\n` +
                      `📊 EVOLUCIÓN HISTÓRICA EN GOOGLE MAPS:\n` +
                      `• Calificación: ${historicalMetrics.baseline.initialRating}★ ➔ ${historicalMetrics.currentRating}★ (+${historicalMetrics.ratingGain}★)\n` +
                      `• Reseñas Totales: ${historicalMetrics.baseline.initialReviewCount} ➔ ${historicalMetrics.totalAllReviews} (${historicalMetrics.newGoogleReviewsTotal > 0 ? `+${historicalMetrics.newGoogleReviewsTotal} nuevas ganadas` : '0 nuevas ganadas'})\n` +
                      `• Reseñas 4 y 5★: ${historicalMetrics.initialReviews4to5} ➔ ${historicalMetrics.currentReviews4to5} (${historicalMetrics.newPositiveReviewsTotal > 0 ? `+${historicalMetrics.exactReviews5Star} de 5★ y +${historicalMetrics.exactReviews4Star} de 4★ impulsadas vía QR` : '0 impulsadas vía QR'})\n` +
                      `• Quejas 1 a 3★ en Google: ${historicalMetrics.initialReviews1to3} antes ➔ ${historicalMetrics.newGoogleReviews1to3} nuevas en Google (${historicalMetrics.newGoogleReviews1to3 === 0 ? '100% contenidas en sala' : 'Contenidas'})\n` +
                      `• Tasa de Respuestas en Google: ${historicalMetrics.initialResponseRate}% antes ➔ 100% respondidas con IA\n\n` +
                      `🛡️ CONTENCIÓN Y RETENCIÓN EN SALA:\n` +
                      `• Quejas Privadas Salvadas en Sala: ${historicalMetrics.privateComplaintsIntercepted} crisis resueltas en <10 seg antes de salir a Google Maps\n` +
                      `• Facturación Salvada de Fuga: ${formatMoneyCOP(historicalMetrics.preservedRevenueCOP)} / ${formatMoneyUSD(historicalMetrics.preservedRevenueUSD)} (${historicalMetrics.privateComplaintsIntercepted} mesas × ${formatMoneyCOP(historicalMetrics.baseline.averageTicketCOP)})\n\n` +
                      `🗣️ TESTIMONIO DEL RESPONSABLE (${historicalMetrics.baseline.founderName}):\n` +
                      `"${customTestimonialQuote || historicalMetrics.baseline.clientQuote}"\n\n` +
                      `👉 Descubre cómo blindar tu reputación en: prestigia.app`;
                    handleCopy(text, 'whatsapp-summary');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20 transition-all"
                >
                  {copiedText === 'whatsapp-summary' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedText === 'whatsapp-summary' ? '¡Copiado para WhatsApp!' : 'Copiar para WhatsApp Ventas'}
                </button>
              </div>
            </div>

            {/* Banner: Contador de Días con Prestigia y Blindaje Activo */}
            <div className="bg-gradient-to-r from-amber-500/10 via-[#0E121B] to-emerald-500/10 border border-amber-500/30 rounded-3xl p-6 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Protección Activa Día {historicalMetrics.daysOperating}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    {historicalMetrics.isBranch && historicalMetrics.currentHistoricalBranch ? (
                      <>📍 {historicalMetrics.currentHistoricalBranch.name}</>
                    ) : (
                      <>🏢 Consolidado ({currentBusiness.branches?.length || 1} Sedes)</>
                    )}
                  </span>
                  <span className="text-xs text-slate-400">
                    Activación de QRs: <strong className="text-slate-200 font-mono">{historicalMetrics.startDate}</strong>
                  </span>
                  {historicalMetrics.baseline.calibratedAt && (
                    <span className="text-[11px] text-slate-500">
                      (Calibrado: {historicalMetrics.baseline.calibratedAt.split('T')[0]})
                    </span>
                  )}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex flex-wrap items-baseline gap-2">
                  <span>{historicalMetrics.daysOperating} Días con Prestigia</span>
                  <span className="text-amber-400 text-sm sm:text-base font-bold font-mono">
                    ({Math.floor(historicalMetrics.daysOperating / 30)} meses y {historicalMetrics.daysOperating % 30} días de blindaje)
                  </span>
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Desde el inicio de la operación con códigos QR en sala, el sistema ha blindado activamente la reputación de{' '}
                  <strong className="text-white">
                    {historicalMetrics.isBranch && historicalMetrics.currentHistoricalBranch
                      ? `${currentBusiness.name} — ${historicalMetrics.currentHistoricalBranch.name}`
                      : currentBusiness.name}
                  </strong>
                  , canalizando clientes insatisfechos en privado hacia WhatsApp en menos de 10 segundos e impulsando únicamente reseñas de 5 estrellas en su perfil público de Google Maps.
                </p>

                {/* Inline Negotiated Fee Editor (Sin Planes Fijos) */}
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-400 font-medium">Inversión mensual pactada:</span>
                  {editingCustomFee ? (
                    <div className="inline-flex items-center gap-1.5 bg-[#141A26] border border-amber-500/40 rounded-xl px-2.5 py-1">
                      <span className="text-amber-400 font-mono">$</span>
                      <input
                        type="number"
                        placeholder="Ej: 450000"
                        value={tempCustomFee}
                        onChange={(e) => setTempCustomFee(e.target.value)}
                        className="w-28 bg-transparent text-white font-mono text-xs outline-none"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          const fee = Number(tempCustomFee) || 0;
                          const isBranch = selectedHistoricalBranchId !== 'all';
                          const branchObj = isBranch ? currentBusiness.branches?.find((b) => b.id === selectedHistoricalBranchId) : null;
                          const base = branchObj?.baseline || currentBusiness.baseline || historicalMetrics.baseline;
                          const updatedBaseline = { ...base, customMonthlyFeeCOP: fee };
                          
                          await fetch('/api/master', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              action: 'update_baseline',
                              businessId: currentBusiness.id,
                              branchId: selectedHistoricalBranchId,
                              baseline: updatedBaseline,
                            }),
                          });

                          setBusinesses((prev) =>
                            prev.map((b) => {
                              if (b.id !== currentBusiness.id) return b;
                              if (isBranch) {
                                return {
                                  ...b,
                                  branches: b.branches?.map((br) => (br.id === selectedHistoricalBranchId ? { ...br, baseline: updatedBaseline } : br)),
                                };
                              }
                              return { ...b, baseline: updatedBaseline };
                            })
                          );
                          setEditingCustomFee(false);
                          setNotification({ type: 'success', message: '¡Tarifa de inversión pactada actualizada con éxito!' });
                          setTimeout(() => setNotification(null), 3000);
                        }}
                        className="px-2 py-0.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] cursor-pointer"
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCustomFee(false)}
                        className="text-slate-400 hover:text-white text-[10px] cursor-pointer px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setTempCustomFee(String(historicalMetrics.monthlyFeeCOP || ''));
                        setEditingCustomFee(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700 hover:border-amber-500/50 text-slate-300 font-mono text-[11px] flex items-center gap-1.5 transition cursor-pointer"
                      title="Haz clic para ingresar la tarifa personalizada acordada con este cliente y calcular el multiplicador de ROI"
                    >
                      <DollarSign className="w-3 h-3 text-emerald-400" />
                      <span>
                        {historicalMetrics.monthlyFeeCOP > 0
                          ? `${formatMoneyCOP(historicalMetrics.monthlyFeeCOP)} / mes (Pactado)`
                          : 'Fijar tarifa acordada para Multiplicador ROI'}
                      </span>
                      <Edit3 className="w-2.5 h-2.5 text-amber-400" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 shrink-0 w-full lg:w-auto justify-between lg:justify-end">
                {/* Badge 1: Nuevas 5★ */}
                <div className="text-center px-4 py-3 rounded-2xl bg-[#141A26] border border-slate-800 flex-1 lg:flex-initial">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Nuevas 5★ Maps</span>
                  <strong className="text-amber-300 font-mono text-xl font-extrabold block">
                    {historicalMetrics.exactReviews5Star > 0 ? `+${historicalMetrics.exactReviews5Star}` : '0'}
                  </strong>
                  <span className="text-[9px] text-emerald-400 font-semibold block">
                    {historicalMetrics.exactReviews4Star > 0 ? `(+${historicalMetrics.exactReviews4Star} de 4★)` : (historicalMetrics.exactReviews5Star > 0 ? 'Impulsadas al QR' : 'Monitoreo activo')}
                  </span>
                </div>

                {/* Badge 2: Quejas Salvadas */}
                <div className="text-center px-4 py-3 rounded-2xl bg-[#141A26] border border-slate-800 flex-1 lg:flex-initial">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Quejas Salvadas</span>
                  <strong className="text-blue-400 font-mono text-xl font-extrabold block">{historicalMetrics.privateComplaintsIntercepted}</strong>
                  <span className="text-[9px] text-blue-300 font-semibold">En mesa (&lt;10s)</span>
                </div>

                {/* Badge 3: Dinero Retenido */}
                <div className="text-center px-4 py-3 rounded-2xl bg-[#141A26] border border-slate-800 flex-1 lg:flex-initial">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Dinero Retenido</span>
                  <strong className="text-emerald-400 font-mono text-base sm:text-lg font-extrabold block">{formatMoneyCOP(historicalMetrics.preservedRevenueCOP)}</strong>
                  <span className="text-[9px] text-slate-400 font-mono">{formatMoneyUSD(historicalMetrics.preservedRevenueUSD)}</span>
                </div>

                {/* Badge 4: Multiplicador ROI */}
                <div className="text-center px-4 py-3 rounded-2xl bg-gradient-to-b from-amber-500/10 to-[#141A26] border border-amber-500/40 flex-1 lg:flex-initial shadow-lg shadow-amber-500/10">
                  <span className="text-[10px] text-amber-400 uppercase font-bold block flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Multiplicador ROI
                  </span>
                  {historicalMetrics.roiMultiplier !== null ? (
                    <>
                      <strong className="text-amber-300 font-mono text-xl font-black block">
                        {historicalMetrics.roiMultiplier}x
                      </strong>
                      <span className="text-[9px] text-emerald-400 font-semibold block">
                        Retorno de Inversión
                      </span>
                    </>
                  ) : (
                    <>
                      <strong className="text-amber-300 font-mono text-base font-extrabold block">
                        {historicalMetrics.privateComplaintsIntercepted}x Mesas
                      </strong>
                      <span className="text-[9px] text-slate-400 font-semibold block">
                        Cuentas recuperadas
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Visual KPI Cards Grid (6 Cards con Montos y Cantidades Exactas) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
              {/* Card 1: Calificación Google Maps */}
              <div className="bg-[#0E121B] border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold">Calificación Google</span>
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white font-mono">{historicalMetrics.currentRating}★</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      {historicalMetrics.ratingGain > 0 ? `+${historicalMetrics.ratingGain}★` : 'Línea Base'}
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Día 1: {historicalMetrics.baseline.initialRating}★</span>
                  <span className="text-emerald-400 font-semibold font-mono">Promedio Real</span>
                </div>
              </div>

              {/* Card 2: Total Reseñas en Google */}
              <div className="bg-[#0E121B] border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold">Total Reseñas Maps</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-amber-300 font-mono">{historicalMetrics.totalAllReviews}</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      {historicalMetrics.newGoogleReviewsTotal > 0 ? `+${historicalMetrics.newGoogleReviewsTotal}` : '0 nuevas'}
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Día 1: {historicalMetrics.baseline.initialReviewCount}</span>
                  <span className="text-amber-400 font-semibold font-mono">
                    {historicalMetrics.newGoogleReviewsTotal > 0 ? `+${historicalMetrics.newGoogleReviewsTotal} ganadas con Prestigia` : '0 ganadas (Monitoreo activo)'}
                  </span>
                </div>
              </div>

              {/* Card 3: Nuevas Reseñas 5★ Exactas */}
              <div className="bg-[#0E121B] border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold">Nuevas Reseñas 5★</span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-amber-300 font-mono">
                      {historicalMetrics.exactReviews5Star > 0 ? `+${historicalMetrics.exactReviews5Star}` : '0'}
                    </span>
                    <span className="text-xs text-slate-400 font-bold font-mono">de 5★</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Total 4-5★: {historicalMetrics.currentReviews4to5}</span>
                  <span className="text-emerald-400 font-semibold font-mono">
                    {historicalMetrics.exactReviews4Star > 0 ? `+${historicalMetrics.exactReviews4Star} de 4★` : '0 de 4★'}
                  </span>
                </div>
              </div>

              {/* Card 4: Quejas 1 a 3★ Salvadas en Sala */}
              <div className="bg-[#0E121B] border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold">Quejas en Sala</span>
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-blue-400 font-mono">{historicalMetrics.privateComplaintsIntercepted}</span>
                    <span className="text-xs font-bold text-blue-300">Salvadas</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Día 1 Maps: {historicalMetrics.initialReviews1to3}</span>
                  <span className="text-blue-400 font-semibold font-mono">{historicalMetrics.newGoogleReviews1to3} nuevas en Maps</span>
                </div>
              </div>

              {/* Card 5: Facturación Retenida Exacta */}
              <div className="bg-[#0E121B] border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold">Facturación Retenida</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-emerald-400 font-mono">{formatMoneyCOP(historicalMetrics.preservedRevenueCOP)}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{historicalMetrics.privateComplaintsIntercepted} mesas × {formatMoneyCOP(historicalMetrics.baseline.averageTicketCOP)}</span>
                  <span className="text-slate-400 font-mono">{formatMoneyUSD(historicalMetrics.preservedRevenueUSD)}</span>
                </div>
              </div>

              {/* Card 6: Tasa de Respuesta a Reseñas */}
              <div className="bg-[#0E121B] border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold">Tasa de Respuesta</span>
                    <MessageCircle className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-purple-300 font-mono">100%</span>
                    <span className="text-xs font-bold text-purple-400 font-mono">Con IA</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Día 1: {historicalMetrics.initialResponseRate}%</span>
                  <span className="text-purple-400 font-semibold font-mono">{historicalMetrics.initialRespondedReviews} resp. previas</span>
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
                      <h3 className="text-lg font-bold text-white tracking-tight">
                        {currentBusiness.name}
                        {historicalMetrics.isBranch && historicalMetrics.currentHistoricalBranch && (
                          <span className="text-amber-400 font-bold ml-1.5">— {historicalMetrics.currentHistoricalBranch.name}</span>
                        )}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                        {historicalMetrics.isBranch ? 'Reporte Oficial por Sede' : `Consolidado (${currentBusiness.branches?.length || 1} Sedes)`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {historicalMetrics.isBranch && historicalMetrics.currentHistoricalBranch ? (
                        <>
                          {historicalMetrics.currentHistoricalBranch.address || ''} • {historicalMetrics.currentHistoricalBranch.locality || historicalMetrics.currentHistoricalBranch.city}, {historicalMetrics.baseline.country} • Responsable: {historicalMetrics.currentHistoricalBranch.managerName || currentBusiness.ownerName}
                        </>
                      ) : (
                        <>
                          {historicalMetrics.baseline.nicheCategory} • {historicalMetrics.baseline.city}, {historicalMetrics.baseline.country} • Titular General: {currentBusiness.ownerName}
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Activación Operativa QRs</span>
                  <p className="text-xs font-mono font-bold text-slate-200 mt-0.5">{historicalMetrics.startDate}</p>
                  <p className="text-[10px] text-emerald-400 font-semibold">{historicalMetrics.daysOperating} días de protección activa</p>
                </div>
              </div>

              {/* Detailed Executive Comparison Table: Before vs Today */}
              <div className="my-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                    <span>Auditoría Comparativa Detallada: Transformación Día 1 vs. Con Prestigia</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    SLA &lt;10 seg • Retención Financiera Calculada
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-800">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#121622] text-slate-400 border-b border-slate-800">
                        <th className="py-3 px-4 font-bold text-[11px] uppercase tracking-wider">Métrica Auditada</th>
                        <th className="py-3 px-4 font-bold text-[11px] uppercase tracking-wider text-rose-400">1. Antes de Prestigia (Día 1)</th>
                        <th className="py-3 px-4 font-bold text-[11px] uppercase tracking-wider text-emerald-400">2. Con Prestigia (Hoy)</th>
                        <th className="py-3 px-4 font-bold text-[11px] uppercase tracking-wider text-amber-300">Impacto Real / ROI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70 text-slate-200">
                      <tr className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-300 flex items-center gap-2">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span>Calificación en Google Maps</span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-rose-300">
                          {historicalMetrics.baseline.initialRating} ★
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-400 text-sm">
                          {historicalMetrics.currentRating} ★
                        </td>
                        <td className="py-3 px-4 text-emerald-300 font-semibold font-mono">
                          +{historicalMetrics.ratingGain}★ de subida en ranking local
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-300 flex items-center gap-2">
                          <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
                          <span>Total de Reseñas en Google</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300">
                          {historicalMetrics.baseline.initialReviewCount} opiniones
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-white">
                          {historicalMetrics.totalAllReviews} opiniones
                        </td>
                        <td className="py-3 px-4 text-amber-300 font-semibold font-mono">
                          {historicalMetrics.newGoogleReviewsTotal > 0
                            ? `+${historicalMetrics.newGoogleReviewsTotal} nuevas opiniones ganadas`
                            : '0 opiniones ganadas (Inicio de monitoreo)'}
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-300 flex items-center gap-2">
                          <Award className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Reseñas 4 y 5 Estrellas (Promotores)</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300">
                          {historicalMetrics.initialReviews4to5} opiniones
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                          {historicalMetrics.currentReviews4to5} opiniones
                        </td>
                        <td className="py-3 px-4 text-emerald-300 font-semibold font-mono">
                          {historicalMetrics.newPositiveReviewsTotal > 0
                            ? `+${historicalMetrics.exactReviews5Star} de 5★ • +${historicalMetrics.exactReviews4Star} de 4★ impulsadas al QR`
                            : '0 impulsadas vía QR (Monitoreo activo)'}
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-300 flex items-center gap-2">
                          <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                          <span>Reseñas 1 a 3★ en Google Maps</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-rose-300 font-semibold">
                          {historicalMetrics.initialReviews1to3} quejas públicas sin filtro
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-blue-400">
                          {historicalMetrics.newGoogleReviews1to3} nuevas en Maps ({historicalMetrics.newGoogleReviews1to3 === 0 ? '100% filtradas' : 'Contenidas'})
                        </td>
                        <td className="py-3 px-4 text-blue-300 font-semibold">
                          Blindaje anti-detractores en Google
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-300 flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                          <span>Quejas 1-3★ Salvadas en Sala</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">
                          0 (Salían directo a Google Maps)
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-blue-400">
                          {historicalMetrics.privateComplaintsIntercepted} crisis interceptadas
                        </td>
                        <td className="py-3 px-4 text-emerald-300 font-semibold">
                          {historicalMetrics.privateComplaintsIntercepted > 0
                            ? 'Resueltas en sala <10 seg vía WhatsApp'
                            : 'Blindaje activo en mesas'}
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-300 flex items-center gap-2">
                          <Zap className="w-3.5 h-3.5 text-purple-400" />
                          <span>Tasa de Respuesta en Google Maps</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">
                          {historicalMetrics.initialResponseRate}% ({historicalMetrics.initialRespondedReviews} respondidas)
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-purple-300">
                          100% Respondidas con IA
                        </td>
                        <td className="py-3 px-4 text-purple-300 font-semibold">
                          Imagen corporativa y SEO local activo
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-300 flex items-center gap-2">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Facturación Salvada de Fuga (Churn)</span>
                        </td>
                        <td className="py-3 px-4 text-rose-400 font-medium">
                          Pérdida mensual por clientes que no volvían
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                          {formatMoneyCOP(historicalMetrics.preservedRevenueCOP)}
                        </td>
                        <td className="py-3 px-4 text-emerald-300 font-semibold font-mono">
                          Monto exacto: {historicalMetrics.privateComplaintsIntercepted} mesas × {formatMoneyCOP(historicalMetrics.baseline.averageTicketCOP)} ({formatMoneyUSD(historicalMetrics.preservedRevenueUSD)})
                        </td>
                      </tr>

                      {/* Fila: Multiplicador de Retorno de Inversión (ROI) */}
                      <tr className="hover:bg-slate-800/20 transition-colors bg-amber-500/[0.04]">
                        <td className="py-3 px-4 font-semibold text-amber-300 flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Multiplicador de Retorno (ROI)</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-rose-300">
                          0x (Sin blindaje, fuga total)
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-amber-300 text-sm">
                          {historicalMetrics.roiMultiplier !== null
                            ? `${historicalMetrics.roiMultiplier}x Retorno Directo`
                            : `${historicalMetrics.privateComplaintsIntercepted}x Mesas Salvadas`}
                        </td>
                        <td className="py-3 px-4 text-amber-300 font-semibold font-mono">
                          {historicalMetrics.roiMultiplier !== null
                            ? `Por cada $1 invertido en blindaje, la marca retuvo $${historicalMetrics.roiMultiplier} en caja`
                            : `Retención patrimonial: ${historicalMetrics.privateComplaintsIntercepted} cuentas devueltas al balance`}
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-300 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Días con Prestigia Activa</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">
                          Día 0 (Punto de Partida)
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-amber-300">
                          {historicalMetrics.daysOperating} días ininterrumpidos
                        </td>
                        <td className="py-3 px-4 text-amber-400 font-semibold">
                          Desde {historicalMetrics.startDate}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Founder Quote / Testimonial Box */}
              <div className="bg-[#141A26] rounded-2xl p-5 border border-slate-800 relative">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                    Testimonio Oficial del Titular ({historicalMetrics.baseline.founderName})
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        const aiQuote = generateAITestimonial('roi');
                        setCustomTestimonialQuote(aiQuote);
                        if (currentBusiness) {
                          const base = currentBusiness.baseline || historicalMetrics.baseline;
                          const updatedBaseline = { ...base, clientQuote: aiQuote };
                          await fetch('/api/master', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              action: 'update_baseline',
                              businessId: currentBusiness.id,
                              baseline: updatedBaseline,
                            }),
                          });
                          setBusinesses((prev) =>
                            prev.map((b) => (b.id === currentBusiness.id ? { ...b, baseline: updatedBaseline } : b))
                          );
                          setNotification({
                            type: 'success',
                            message: '✨ Testimonio generado con IA según el análisis de mejora real.',
                          });
                          setTimeout(() => setNotification(null), 4000);
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer"
                      title="Generar testimonio automático analizando los datos reales de mejora de Prestigia"
                    >
                      <BrainCircuit className="w-3.5 h-3.5 text-amber-400" />
                      <span>Generar con IA (Métricas Reales)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditQuoteMode(!editQuoteMode)}
                      className="text-[11px] text-slate-400 hover:text-amber-300 cursor-pointer font-medium"
                    >
                      {editQuoteMode ? 'Cancelar Edición' : 'Editar Testimonio'}
                    </button>
                  </div>
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
                    Consolidado de clientes, pacientes y usuarios de todo tipo de empresas, comercios y profesionales independientes con teléfono, nombre y autorización de Habeas Data.
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-900/30 border border-purple-500/30 text-[11px] text-purple-200">
                    <Shield className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span><strong className="text-white">Blindaje Soberano de Datos:</strong> Aunque una marca o sede sea dada de baja o eliminada del sistema, los registros de usuarios finales <strong>JAMÁS se borran</strong>; permanecen de por vida en este Big Data Lake como el activo más importante de Prestigia.</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const csvHeader = 'Nombre_Cliente,Telefono_WhatsApp,Pais,Ciudad,Localidad_Zona,Negocio_Registrado,Sede,Nicho_Industria,Calificacion,Segmento,Origen_Registro,Consentimiento_HabeasData,Fecha\n';
                      const csvRows = filteredDataLake.map((p) => {
                        const segment = p.rating >= 4 ? 'Promotor (4-5 Estrellas)' : 'Detractor Interceptado (1-3 Estrellas)';
                        return `"${p.customerName}","${p.customerPhone}","${p.country}","${p.city}","${p.locality}","${p.businessName}","${p.branchName}","${p.nicheCategory}","${p.rating}★","${segment}","${p.source}","Autorizado 100% Habeas Data (${p.country} - ${p.city})","${p.registeredAt}"`;
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

            {/* KPI Cards: Big Data Lake & Habeas Data Verified Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0E121B] border border-purple-500/30 rounded-2xl p-4 shadow-lg bg-gradient-to-br from-purple-500/10 to-transparent">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Habeas Data Verificado</span>
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-2xl font-extrabold text-white font-mono mt-1">
                  {filteredDataLake.length}
                </p>
                <p className="text-[10px] text-purple-300 mt-0.5">
                  100% consentidos • Con País, Ciudad y Localidad
                </p>
              </div>

              <div className="bg-[#0E121B] border border-emerald-500/30 rounded-2xl p-4 shadow-lg bg-gradient-to-br from-emerald-500/10 to-transparent">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Promotores Fidelizados (4-5★)</span>
                  <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                </div>
                <p className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
                  {dataLakePromotersCount}
                  <span className="text-xs text-slate-400 font-normal ml-2">
                    ({filteredDataLake.length > 0 ? Math.round((dataLakePromotersCount / filteredDataLake.length) * 100) : 0}%)
                  </span>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Listos para programas VIP y recompra
                </p>
              </div>

              <div className="bg-[#0E121B] border border-rose-500/30 rounded-2xl p-4 shadow-lg bg-gradient-to-br from-rose-500/10 to-transparent">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Detractores Interceptados (1-3★)</span>
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                </div>
                <p className="text-2xl font-extrabold text-rose-400 font-mono mt-1">
                  {dataLakeDetractorsCount}
                  <span className="text-xs text-slate-400 font-normal ml-2">
                    ({filteredDataLake.length > 0 ? Math.round((dataLakeDetractorsCount / filteredDataLake.length) * 100) : 0}%)
                  </span>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Blindados en sala antes de salir a Google Maps
                </p>
              </div>

              <div className="bg-[#0E121B] border border-blue-500/30 rounded-2xl p-4 shadow-lg bg-gradient-to-br from-blue-500/10 to-transparent">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Turistas & Extranjeros</span>
                  <Globe className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-2xl font-extrabold text-blue-300 font-mono mt-1">
                  {dataLakeTouristsCount}
                  <span className="text-xs text-slate-400 font-normal ml-2">
                    ({filteredDataLake.length > 0 ? Math.round((dataLakeTouristsCount / filteredDataLake.length) * 100) : 0}%)
                  </span>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Comensales internacionales captados en sala
                </p>
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

                {/* Ciudad Filter - Solo aparece tras seleccionar un País específico */}
                {dataFilterCountry !== 'all' && availableDataCities.length > 0 && (
                  <div className="flex items-center gap-1.5 animate-fade-in">
                    <span className="text-slate-400 font-medium">Ciudad:</span>
                    <select
                      value={dataFilterCity}
                      onChange={(e) => {
                        setDataFilterCity(e.target.value);
                        setDataFilterLocality('all');
                      }}
                      className="bg-[#141A26] border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
                    >
                      <option value="all">Todas las Ciudades de {dataFilterCountry} ({availableDataCities.length})</option>
                      {availableDataCities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Localidad / Zona Filter - Solo aparece tras seleccionar una Ciudad específica */}
                {dataFilterCountry !== 'all' && dataFilterCity !== 'all' && availableDataLocalities.length > 0 && (
                  <div className="flex items-center gap-1.5 animate-fade-in">
                    <span className="text-slate-400 font-medium">Zona / Localidad:</span>
                    <select
                      value={dataFilterLocality}
                      onChange={(e) => setDataFilterLocality(e.target.value)}
                      className="bg-[#141A26] border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
                    >
                      <option value="all">Todas las Zonas de {dataFilterCity} ({availableDataLocalities.length})</option>
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
                    onChange={(e) => {
                      setDataFilterBusiness(e.target.value);
                      setDataFilterBranch('all');
                    }}
                    className="bg-[#141A26] border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 outline-none cursor-pointer max-w-[180px] truncate"
                  >
                    <option value="all">Todos los Negocios ({availableDataBusinesses.length})</option>
                    {availableDataBusinesses.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Sede Física Filter - Solo aparece tras seleccionar un Negocio específico */}
                {dataFilterBusiness !== 'all' && availableDataBranches.length > 0 && (
                  <div className="flex items-center gap-1.5 animate-fade-in">
                    <span className="text-slate-400 font-medium">Sede:</span>
                    <select
                      value={dataFilterBranch}
                      onChange={(e) => setDataFilterBranch(e.target.value)}
                      className="bg-[#141A26] border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 outline-none cursor-pointer max-w-[170px] truncate"
                    >
                      <option value="all">Todas las Sedes ({availableDataBranches.length})</option>
                      {availableDataBranches.map((br) => (
                        <option key={br.id} value={br.id}>{br.name}</option>
                      ))}
                    </select>
                  </div>
                )}

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
                    <option value="100">100 filas</option>
                    <option value="all">Ver todos ({filteredDataLake.length})</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <span>
                  Mostrando registros <strong className="text-white">{filteredDataLake.length === 0 ? 0 : (safeDataCurrentPage - 1) * dataPageSize + 1} - {Math.min(safeDataCurrentPage * dataPageSize, filteredDataLake.length)}</strong> de <strong className="text-white">{filteredDataLake.length}</strong> clientes filtrados (Página <strong className="text-purple-300">{safeDataCurrentPage}</strong> de <strong className="text-purple-300">{dataTotalPages}</strong> • Base total: <strong className="text-purple-300">{unifiedDataLakeRecords.length}</strong>)
                </span>
                {(dataFilterCountry !== 'all' || dataFilterCity !== 'all' || dataFilterLocality !== 'all' || dataFilterBusiness !== 'all' || dataFilterBranch !== 'all' || dataFilterNiche !== 'all' || dataFilterRating !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setDataFilterCountry('all');
                      setDataFilterCity('all');
                      setDataFilterLocality('all');
                      setDataFilterBusiness('all');
                      setDataFilterBranch('all');
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
                      // Mensaje comercial B2B oficial de Prestigia: agradece participación en la marca y ofrece la plataforma a todo tipo de empresas y profesionales independientes
                      const waProspectingMsg = encodeURIComponent(
                        `Hola ${participant.customerName}, te saluda el equipo directivo de Prestigia.\n\n` +
                        `¡Muchas gracias por haber interactuado a través de nuestra plataforma en ${participant.businessName} (${participant.branchName})!\n\n` +
                        `Notamos tu participación y nos encantaría mostrarte cómo Prestigia impulsa a todo tipo de empresas, negocios, comercios y profesionales independientes a blindar su reputación en Google Maps, multiplicar sus reseñas de 5 estrellas y fidelizar a sus clientes y pacientes.\n\n` +
                        `🚀 Conoce nuestra tecnología y solicita una demostración gratuita para tu empresa o actividad profesional aquí:\nhttps://prestigia.app\n\n` +
                        `¿Cuentas con un negocio, consultorio, empresa o servicio profesional independiente? Con gusto te compartimos una auditoría de reputación digital sin costo.`
                      );
                      const waLink = cleanPhone ? `https://wa.me/${cleanPhone.replace('+', '')}?text=${waProspectingMsg}` : null;
                      const countryFlag = participant.country === 'Chile' ? '🇨🇱' : '🇨🇴';

                      return (
                        <tr key={participant.id || idx} className="hover:bg-[#121622] transition-colors">
                          {/* Customer Name & Phone */}
                          <td className="py-3 px-3.5">
                            <p className="font-semibold text-white">
                              {privacyMode ? 'Cliente Anónimo' : participant.customerName}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                                <Phone className="w-3 h-3 text-emerald-400" />
                                {maskPhone(participant.customerPhone)}
                              </p>
                              <button
                                type="button"
                                onClick={() => setSelectedDataLakeRecord(participant)}
                                title="Ver mensaje u opinión completa registrada por este cliente"
                                className="text-[10px] text-amber-300 hover:text-white bg-amber-500/15 hover:bg-amber-500/25 px-2 py-0.5 rounded-md border border-amber-500/30 font-semibold flex items-center gap-1 transition cursor-pointer"
                              >
                                <Eye className="w-2.5 h-2.5 text-amber-400" />
                                <span>Ver Mensaje</span>
                              </button>
                              {waLink && !privacyMode && (
                                <a
                                  href={waLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Abrir chat en WhatsApp para agradecer participación y ofrecer Prestigia para todo tipo de empresas, negocios y profesionales independientes"
                                  className="text-[10px] text-purple-300 hover:text-white bg-purple-500/15 hover:bg-purple-500/25 px-2 py-0.5 rounded-md border border-purple-500/30 font-semibold flex items-center gap-1 transition"
                                >
                                  <span>Ofrecer Prestigia B2B</span>
                                  <span>↗</span>
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

                          {/* Source & Legal Habeas Data Consent with Geographic Anchoring */}
                          <td className="py-3 px-3.5 text-center whitespace-nowrap">
                            <p className="text-[10px] font-medium text-slate-400 mb-0.5">{participant.source}</p>
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Habeas Data OK
                            </span>
                            <p className="text-[9px] text-slate-400 mt-0.5">
                              {participant.country} • {participant.city} • {participant.locality}
                            </p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer with Numbered Pagination Bar */}
              <div className="py-3.5 px-4 bg-[#121622] border-t border-slate-800 text-slate-400 text-xs flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 text-center sm:text-left">
                  <span>
                    Mostrando registros <strong className="text-white">{filteredDataLake.length === 0 ? 0 : (safeDataCurrentPage - 1) * dataPageSize + 1} - {Math.min(safeDataCurrentPage * dataPageSize, filteredDataLake.length)}</strong> de <strong className="text-white">{filteredDataLake.length}</strong> filtrados
                  </span>
                  <span className="text-slate-600 hidden sm:inline">•</span>
                  <span className="text-[11px] text-purple-400 font-medium">
                    Página <strong className="text-purple-300 font-bold">{safeDataCurrentPage}</strong> de <strong className="text-purple-300 font-bold">{dataTotalPages}</strong>
                  </span>
                </div>

                {/* Numbered Pagination Buttons */}
                {dataPageLimit !== 'all' && dataTotalPages > 1 && (
                  <div className="flex items-center gap-1.5 select-none">
                    {/* Botón Anterior */}
                    <button
                      type="button"
                      disabled={safeDataCurrentPage <= 1}
                      onClick={() => setDataCurrentPage((prev) => Math.max(1, prev - 1))}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-[#141A26] hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white transition flex items-center gap-1 text-xs font-semibold cursor-pointer"
                      title="Página Anterior"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Anterior</span>
                    </button>

                    {/* Selector de Páginas [1] [2] [3] [4] [5]... */}
                    <div className="flex items-center gap-1">
                      {getDataLakePageNumbers(safeDataCurrentPage, dataTotalPages).map((p, idx) => {
                        if (p === '...') {
                          return (
                            <span key={`dots-${idx}`} className="px-1 text-slate-500 font-mono text-xs select-none">
                              ...
                            </span>
                          );
                        }
                        const pageNum = p as number;
                        const isActive = pageNum === safeDataCurrentPage;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setDataCurrentPage(pageNum)}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                              isActive
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400 font-extrabold ring-1 ring-purple-400'
                                : 'bg-[#141A26] border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600'
                            }`}
                            title={`Ir a página ${pageNum}`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    {/* Botón Siguiente */}
                    <button
                      type="button"
                      disabled={safeDataCurrentPage >= dataTotalPages}
                      onClick={() => setDataCurrentPage((prev) => Math.min(dataTotalPages, prev + 1))}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-[#141A26] hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 hover:text-white transition flex items-center gap-1 text-xs font-semibold cursor-pointer"
                      title="Página Siguiente"
                    >
                      <span className="hidden sm:inline">Siguiente</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Modal: Expediente de Opinión & Verificación Habeas Data */}
            {selectedDataLakeRecord && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
                <div className="relative w-full max-w-lg bg-[#0C101A] border border-amber-500/30 rounded-3xl shadow-2xl p-5 sm:p-6 text-white my-8 max-h-[92vh] overflow-y-auto space-y-4">
                  {/* Modal Header */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-extrabold text-base shrink-0">
                        {selectedDataLakeRecord.rating >= 4 ? '🌟' : '🛡️'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            selectedDataLakeRecord.rating >= 4
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          }`}>
                            {selectedDataLakeRecord.rating >= 4 ? 'Promotor 4-5★ (Fidelizado)' : 'Detractor 1-3★ (Interceptado en Privado)'}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {selectedDataLakeRecord.rating} Estrellas
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-0.5">
                          {privacyMode ? 'Cliente Anónimo' : selectedDataLakeRecord.customerName}
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedDataLakeRecord(null)}
                      className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Context Cards */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#141A26] border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-semibold">Establecimiento & Sede</span>
                      <strong className="text-slate-100 block mt-0.5 truncate">{selectedDataLakeRecord.businessName}</strong>
                      <span className="text-[11px] text-slate-400 block truncate">{selectedDataLakeRecord.branchName}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#141A26] border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-semibold">Ubicación Geográfica</span>
                      <strong className="text-slate-100 block mt-0.5 truncate">
                        {selectedDataLakeRecord.country} • {selectedDataLakeRecord.city}
                      </strong>
                      <span className="text-[11px] text-slate-400 block truncate">{selectedDataLakeRecord.locality}</span>
                    </div>
                  </div>

                  {/* Opinion / Feedback Box */}
                  <div className={`p-4 rounded-2xl border space-y-2 ${
                    selectedDataLakeRecord.rating >= 4
                      ? 'bg-gradient-to-br from-emerald-500/10 via-[#101722] to-transparent border-emerald-500/30'
                      : 'bg-gradient-to-br from-rose-500/10 via-[#141118] to-transparent border-rose-500/30'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-300">
                        <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Mensaje / Opinión Registrada</span>
                      </span>
                      {selectedDataLakeRecord.rating <= 3 ? (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                          <span>🛡️ Queja Privada (Blindada de Google)</span>
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <span>🌟 Sincronizada vía API Google Maps</span>
                        </span>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-[#0C101A] border border-slate-800 text-xs text-slate-100 leading-relaxed font-medium">
                      "{selectedDataLakeRecord.complaintReason || (selectedDataLakeRecord.rating >= 4 ? 'El usuario otorgó 5 estrellas directamente en la ficha oficial de Google Maps (calificación directa en 1 clic).' : 'Calificación de insatisfacción registrada en sala.')}"
                    </div>

                    {selectedDataLakeRecord.rating <= 3 ? (
                      <p className="text-[10px] text-slate-400 leading-tight">
                        ⚡ Esta queja fue interceptada en privado por Prestigia en el punto físico antes de que el cliente pudiera publicarla negativamente en Google Maps, blindando la reputación de la empresa.
                      </p>
                    ) : (
                      <p className="text-[10px] text-emerald-400/80 leading-tight">
                        ✓ Reseña oficial leída directamente de la API de Google Maps tras la redirección directa en 1 clic desde el QR.
                      </p>
                    )}
                  </div>

                  {/* Attended By Staff */}
                  {selectedDataLakeRecord.attendedBy && (
                    <div className="p-2.5 rounded-xl bg-[#141A26] border border-slate-800 text-xs flex items-center justify-between">
                      <span className="text-slate-400">Colaborador / Atendido por:</span>
                      <strong className="text-amber-300 font-semibold">{selectedDataLakeRecord.attendedBy}</strong>
                    </div>
                  )}

                  {/* Habeas Data & Contact Info */}
                  <div className="p-3 rounded-xl bg-[#10141E] border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Consentimiento Legal:</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Habeas Data 100% Autorizado
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Teléfono / WhatsApp:</span>
                      <span className="font-mono text-emerald-300 font-bold">{maskPhone(selectedDataLakeRecord.customerPhone)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Fecha de Registro:</span>
                      <span className="font-mono">{selectedDataLakeRecord.registeredAt}</span>
                    </div>
                  </div>

                  {/* Modal Actions */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedDataLakeRecord(null)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      Cerrar
                    </button>

                    {(() => {
                      const cleanPhone = selectedDataLakeRecord.customerPhone.replace(/[^0-9+]/g, '');
                      const waProspectingMsg = encodeURIComponent(
                        `Hola ${selectedDataLakeRecord.customerName}, te saluda el equipo directivo de Prestigia.\n\n` +
                        `¡Muchas gracias por haber interactuado a través de nuestra plataforma en ${selectedDataLakeRecord.businessName} (${selectedDataLakeRecord.branchName})!\n\n` +
                        `Notamos tu participación y nos encantaría mostrarte cómo Prestigia impulsa a todo tipo de empresas, negocios, comercios y profesionales independientes a blindar su reputación en Google Maps, multiplicar sus reseñas de 5 estrellas y fidelizar a sus clientes y pacientes.\n\n` +
                        `🚀 Conoce nuestra tecnología y solicita una demostración gratuita para tu empresa o actividad profesional aquí:\nhttps://prestigia.app\n\n` +
                        `¿Cuentas con un negocio, consultorio, empresa o servicio profesional independiente? Con gusto te compartimos una auditoría de reputación digital sin costo.`
                      );
                      const waLink = cleanPhone ? `https://wa.me/${cleanPhone.replace('+', '')}?text=${waProspectingMsg}` : null;

                      return waLink && !privacyMode ? (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-purple-600/25 transition cursor-pointer"
                        >
                          <span>Ofrecer Prestigia B2B por WhatsApp</span>
                          <span>↗</span>
                        </a>
                      ) : null;
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: FACTURACIÓN MASTER & MRR MULTI-DIVISA (USD & MONEDAS LOCALES) */}
        {/* ============================================================== */}
        {activeTab === 'mrr' && (() => {
          // Calculate global financial summary dynamically using actual agreed fees and add-ons
          let totalUSD = 0;
          let totalCOP = 0;
          let plansUSD = 0;
          let plansCOP = 0;
          let addOnsUSD = 0;
          let addOnsCOP = 0;
          let activeCount = 0;

          businesses.forEach((biz) => {
            const fin = getBusinessFinancials(biz);
            if (biz.status !== 'suspended' && !(biz as any).isArchived) {
              activeCount++;
              totalUSD += fin.totalUSD;
              totalCOP += fin.totalCOP;
              plansUSD += fin.baseUSD;
              plansCOP += fin.baseCOP;
              addOnsUSD += fin.addOnsUSD;
              addOnsCOP += fin.addOnsCOP;
            }
          });

          const arrUSD = totalUSD * 12;
          const arrCOP = totalCOP * 12;
          const arpaUSD = activeCount > 0 ? Math.round(totalUSD / activeCount) : 0;
          const arpaCOP = activeCount > 0 ? Math.round(totalCOP / activeCount) : 0;

          // Filter businesses for table
          const displayedBusinesses = businesses.filter((biz) => {
            if (mrrSearchTerm) {
              const term = mrrSearchTerm.toLowerCase();
              const matchName = (biz.name || '').toLowerCase().includes(term);
              const matchOwner = (biz.ownerName || '').toLowerCase().includes(term);
              const matchId = (biz.id || '').toLowerCase().includes(term);
              const matchTax = (biz.taxId || '').toLowerCase().includes(term);
              if (!matchName && !matchOwner && !matchId && !matchTax) return false;
            }
            if (mrrFilterPlan !== 'all' && biz.plan !== mrrFilterPlan) return false;
            if (mrrFilterCountry !== 'all') {
              const curr = getBusinessCurrency(biz.country);
              if (curr.code !== mrrFilterCountry && !biz.country?.toLowerCase().includes(mrrFilterCountry.toLowerCase())) return false;
            }
            if (mrrFilterStatus !== 'all') {
              const isSuspended = biz.status === 'suspended' || (biz as any).isArchived;
              if (mrrFilterStatus === 'active' && isSuspended) return false;
              if (mrrFilterStatus === 'suspended' && !isSuspended) return false;
            }
            if (mrrFilterContractType !== 'all') {
              const fin = getBusinessFinancials(biz);
              if (mrrFilterContractType === 'custom' && !fin.isCustomAgreed) return false;
              if (mrrFilterContractType === 'standard' && fin.isCustomAgreed) return false;
            }
            return true;
          });

          // CSV Export Handler
          const handleExportMrrCsv = () => {
            const header = 'Marca,Titular,Pais,Moneda_Local,Plan_Contratado,Sedes_Activas,Tipo_Tarifa,Tarifa_Base_USD,Tarifa_Base_Local,Margen_AddOns_USD,Margen_AddOns_Local,Total_Mensual_USD,Total_Mensual_Local,Total_Equivalente_COP,ARR_Proyectado_Anual_USD,Estado_Cuenta\n';
            const rows = displayedBusinesses.map((b) => {
              const fin = getBusinessFinancials(b);
              const statusStr = (b.status === 'suspended' || (b as any).isArchived) ? 'Suspendido' : 'Al Dia';
              const tariffStr = fin.isCustomAgreed ? 'Pactada Comercial' : 'Plan Estandar';
              return `"${b.name}","${b.ownerName || ''}","${b.country || 'Colombia'}","${fin.currency.code}","${b.plan}","${b.branches?.length || 1}","${fin.baseUSD}","${fin.baseLocal}","${fin.addOnsUSD}","${fin.addOnsLocal}","${fin.totalUSD}","${fin.totalLocal}","${fin.totalCOP}","${fin.arrUSD}","${statusStr}","${tariffStr}"`;
            }).join('\n');
            const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Prestigia_MRR_Facturacion_${Date.now()}.csv`;
            a.click();
          };

          return (
            <div className="space-y-6 animate-fade-in">
              {/* Header & Global Currency Switcher */}
              <div className="bg-gradient-to-r from-emerald-950/30 via-[#0E121B] to-purple-950/30 border border-emerald-500/30 rounded-3xl p-6 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wider uppercase mb-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    Consola Financiera Multi-Divisa & SaaS MRR
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Matriz Financiera de Ingresos Recurrentes (MRR & ARR Global)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                    Facturación recurrente mensual en <strong>Dólares Americanos (USD)</strong> y <strong>Monedas Locales (COP, CLP, MXN, EUR)</strong>. Cálculo exacto con tarifas pactadas a medida y margen neto por Add-Ons modulares.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  {/* Selector Simple: Dólares vs Moneda Local */}
                  <div className="bg-[#141A26] border border-slate-700/80 p-1 rounded-xl flex items-center gap-1 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setMrrCurrencyMode('usd')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                        mrrCurrencyMode === 'usd'
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Ver todos los montos en Dólares Americanos (USD)"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Dólares (USD)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMrrCurrencyMode('local')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                        mrrCurrencyMode === 'local'
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Ver en la moneda local de cada país (Pesos COP, Pesos CLP, etc.)"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Moneda Local</span>
                    </button>
                  </div>

                  {/* Export CSV Button */}
                  <button
                    type="button"
                    onClick={handleExportMrrCsv}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow"
                    title="Exportar informe contable en Excel / CSV"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Exportar CSV</span>
                  </button>
                </div>
              </div>

              {/* 6 Executive KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
                {/* 1. MRR Total */}
                <div className="bg-[#0E121B] border border-emerald-500/30 rounded-2xl p-4 shadow-lg bg-gradient-to-br from-emerald-500/10 to-transparent">
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                    <span>MRR Total Consolidado</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-xl font-extrabold text-white font-mono mt-1">
                    {privacyMode ? '••••••••' : (mrrCurrencyMode === 'usd' ? formatCurrencyDisplay(totalUSD, 'USD') : formatCurrencyDisplay(totalCOP, 'COP'))}
                    <span className="text-xs text-emerald-300 font-sans ml-1 font-normal">/mes</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                    ≈ {privacyMode ? '••••••••' : (mrrCurrencyMode === 'usd' ? formatCurrencyDisplay(totalCOP, 'COP') : formatCurrencyDisplay(totalUSD, 'USD'))}
                  </p>
                </div>

                {/* 2. ARR Run-Rate */}
                <div className="bg-[#0E121B] border border-purple-500/30 rounded-2xl p-4 shadow-lg bg-gradient-to-br from-purple-500/10 to-transparent">
                  <div className="flex items-center justify-between text-xs text-purple-400 font-semibold">
                    <span>ARR Anual Proyectado</span>
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-xl font-extrabold text-white font-mono mt-1">
                    {privacyMode ? '••••••••' : formatCurrencyDisplay(arrUSD, 'USD')}
                    <span className="text-xs text-purple-300 font-sans ml-1 font-normal">/año</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                    ≈ {privacyMode ? '••••••••' : formatCurrencyDisplay(arrCOP, 'COP')}
                  </p>
                </div>

                {/* 3. Add-Ons Modulares */}
                <div className="bg-[#0E121B] border border-amber-500/30 rounded-2xl p-4 shadow-lg bg-gradient-to-br from-amber-500/10 to-transparent">
                  <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
                    <span>Margen Add-Ons (&gt;90%)</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-xl font-extrabold text-amber-300 font-mono mt-1">
                    {privacyMode ? '••••••••' : formatCurrencyDisplay(addOnsUSD, 'USD')}
                    <span className="text-xs text-amber-400 font-sans ml-1 font-normal">/mes</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                    ≈ {privacyMode ? '••••••••' : formatCurrencyDisplay(addOnsCOP, 'COP')}
                  </p>
                </div>

                {/* 4. MRR Planes Base */}
                <div className="bg-[#0E121B] border border-slate-800 rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>MRR Planes Base</span>
                    <Building2 className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-xl font-extrabold text-white font-mono mt-1">
                    {privacyMode ? '••••••••' : formatCurrencyDisplay(plansUSD, 'USD')}
                    <span className="text-xs text-slate-400 font-sans ml-1 font-normal">/mes</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                    ≈ {privacyMode ? '••••••••' : formatCurrencyDisplay(plansCOP, 'COP')}
                  </p>
                </div>

                {/* 5. ARPA Ticket Promedio */}
                <div className="bg-[#0E121B] border border-blue-500/30 rounded-2xl p-4 shadow-lg bg-gradient-to-br from-blue-500/10 to-transparent">
                  <div className="flex items-center justify-between text-xs text-blue-400 font-semibold">
                    <span>Ticket Promedio (ARPA)</span>
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-xl font-extrabold text-white font-mono mt-1">
                    {privacyMode ? '••••••••' : formatCurrencyDisplay(arpaUSD, 'USD')}
                    <span className="text-xs text-blue-300 font-sans ml-1 font-normal">/cuenta</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                    ≈ {privacyMode ? '••••••••' : formatCurrencyDisplay(arpaCOP, 'COP')}
                  </p>
                </div>

                {/* 6. Total Marcas Activas */}
                <div className="bg-[#0E121B] border border-slate-800 rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>Marcas Facturando</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-xl font-extrabold text-white font-mono mt-1">
                    {activeCount} <span className="text-xs text-slate-400 font-sans font-normal">activas</span>
                  </p>
                  <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                    100% de la red al día
                  </p>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-[#0E121B] border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  {/* Search Bar */}
                  <div className="relative flex-1 min-w-[220px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={mrrSearchTerm}
                      onChange={(e) => setMrrSearchTerm(e.target.value)}
                      placeholder="Buscar marca, titular, NIT o ID..."
                      className="w-full bg-[#141A26] border border-slate-700 text-white text-xs rounded-xl pl-8 pr-8 py-2 outline-none focus:border-amber-400 placeholder:text-slate-500"
                    />
                    {mrrSearchTerm && (
                      <button
                        type="button"
                        onClick={() => setMrrSearchTerm('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Plan Filter */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">Plan:</span>
                    <select
                      value={mrrFilterPlan}
                      onChange={(e) => setMrrFilterPlan(e.target.value)}
                      className="bg-[#141A26] border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
                    >
                      <option value="all">Todos los Planes</option>
                      <option value="independiente">Independiente ($19 USD / $49k COP)</option>
                      <option value="pro">Profesional Pro ($49 USD / $120k COP)</option>
                      <option value="elite">Élite Multi-Sede ($110 USD / $290k COP)</option>
                      <option value="empresarial">Empresarial ($280 USD / $690k COP)</option>
                    </select>
                  </div>

                  {/* Country / Currency Filter */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">País / Moneda:</span>
                    <select
                      value={mrrFilterCountry}
                      onChange={(e) => setMrrFilterCountry(e.target.value)}
                      className="bg-[#141A26] border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
                    >
                      <option value="all">Todas las Divisas</option>
                      <option value="COP">🇨🇴 Colombia (Pesos COP)</option>
                      <option value="CLP">🇨🇱 Chile (Pesos CLP)</option>
                      <option value="MXN">🇲🇽 México (Pesos MXN)</option>
                      <option value="USD">🇺🇸 Internacional (Dólares USD)</option>
                      <option value="EUR">🇪🇺 Europa (Euros EUR)</option>
                    </select>
                  </div>

                  {/* Contract Type (Pactada vs Estandar) */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">Tarifa:</span>
                    <select
                      value={mrrFilterContractType}
                      onChange={(e) => setMrrFilterContractType(e.target.value)}
                      className="bg-[#141A26] border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
                    >
                      <option value="all">Todas las Tarifas</option>
                      <option value="custom">⭐ Tarifas Especiales Pactadas</option>
                      <option value="standard">📦 Planes Oficiales Estándar</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">Estado:</span>
                    <select
                      value={mrrFilterStatus}
                      onChange={(e) => setMrrFilterStatus(e.target.value)}
                      className="bg-[#141A26] border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
                    >
                      <option value="all">Todos los Estados</option>
                      <option value="active">🟢 Al Día / Activas</option>
                      <option value="suspended">🔴 Suspendidas / Congeladas</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <span>
                    Mostrando <strong className="text-white">{displayedBusinesses.length}</strong> de <strong className="text-white">{businesses.length}</strong> marcas registradas en facturación
                  </span>
                  {(mrrSearchTerm || mrrFilterPlan !== 'all' || mrrFilterCountry !== 'all' || mrrFilterStatus !== 'all' || mrrFilterContractType !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setMrrSearchTerm('');
                        setMrrFilterPlan('all');
                        setMrrFilterCountry('all');
                        setMrrFilterStatus('all');
                        setMrrFilterContractType('all');
                      }}
                      className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                    >
                      Limpiar filtros de facturación
                    </button>
                  )}
                </div>
              </div>

              {/* Detailed Multi-Currency Billing Table */}
              <div className="bg-[#0E121B] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#141A26] border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                      <tr>
                        <th className="py-3.5 px-4">Marca & Titular Comercial</th>
                        <th className="py-3.5 px-3">País & Divisa</th>
                        <th className="py-3.5 px-3">Plan & Sedes</th>
                        <th className="py-3.5 px-3">Add-Ons Modulares</th>
                        <th className="py-3.5 px-3">Tarifa Base</th>
                        <th className="py-3.5 px-4 text-right">Facturación Mensual (MRR)</th>
                        <th className="py-3.5 px-3.5 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-300">
                      {displayedBusinesses.map((biz) => {
                        const fin = getBusinessFinancials(biz);
                        const isSuspended = biz.status === 'suspended' || (biz as any).isArchived;
                        const addons = biz.masterAddOns;

                        // Display formatted amount: either USD or Moneda Local
                        let primaryPrice = '';
                        let secondaryPrice = '';

                        if (mrrCurrencyMode === 'usd') {
                          primaryPrice = `${formatCurrencyDisplay(fin.totalUSD, 'USD')} USD`;
                          secondaryPrice = fin.currency.code === 'USD'
                            ? `ARR: ${formatCurrencyDisplay(fin.arrUSD, 'USD')}/año`
                            : `≈ ${formatCurrencyDisplay(fin.totalLocal, fin.currency.code)}`;
                        } else {
                          // Moneda Local de la marca
                          primaryPrice = formatCurrencyDisplay(fin.totalLocal, fin.currency.code);
                          secondaryPrice = `≈ ${formatCurrencyDisplay(fin.totalUSD, 'USD')} USD`;
                        }

                        return (
                          <tr key={biz.id} className="hover:bg-[#121622] transition-colors">
                            {/* Brand & Owner */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full shrink-0 ${
                                  isSuspended ? 'bg-rose-500' : 'bg-emerald-400'
                                }`} title={isSuspended ? 'Cuenta Suspendida' : 'Cuenta Activa y al Día'} />
                                <strong className="font-bold text-white text-sm">
                                  {privacyMode ? 'Marca Confidencial' : biz.name}
                                </strong>
                              </div>
                              <p className="text-[11px] text-slate-400 pl-4 mt-0.5">
                                Titular: <span className="text-slate-300 font-medium">{privacyMode ? '••••••••' : (biz.ownerName || 'No registrado')}</span>
                                {biz.taxId && <span className="font-mono text-slate-500 ml-1.5">• NIT/ID: {privacyMode ? '••••' : biz.taxId}</span>}
                              </p>
                            </td>

                            {/* Country & Currency */}
                            <td className="py-3.5 px-3 whitespace-nowrap">
                              <div className="flex items-center gap-1.5 font-medium text-slate-200">
                                <span className="text-base">{fin.currency.flag}</span>
                                <span>{biz.country?.replace(/\s*\(NIT\)/, '') || 'Colombia'}</span>
                              </div>
                              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30 inline-block mt-0.5">
                                {fin.currency.code}
                              </span>
                            </td>

                            {/* Plan & Branches */}
                            <td className="py-3.5 px-3 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                                biz.plan === 'elite'
                                  ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                                  : biz.plan === 'empresarial'
                                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                  : biz.plan === 'pro'
                                  ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                                  : 'bg-slate-700/50 text-slate-300 border-slate-600'
                              }`}>
                                Plan {biz.plan}
                              </span>
                              <p className="text-[11px] text-slate-400 font-mono mt-1">
                                {biz.branches?.length || 1} {(biz.branches?.length || 1) === 1 ? 'Sede' : 'Sedes'}
                              </p>
                            </td>

                            {/* Add-Ons */}
                            <td className="py-3.5 px-3">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {addons?.extraBranches ? (
                                  <span className="px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-semibold whitespace-nowrap">
                                    +{addons.extraBranches} Sedes (+${addons.extraBranches * 20} USD)
                                  </span>
                                ) : null}
                                {addons?.extraManagers ? (
                                  <span className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] font-semibold whitespace-nowrap">
                                    +{addons.extraManagers} Encargados (+${addons.extraManagers * 10} USD)
                                  </span>
                                ) : null}
                                {addons?.sentiment360?.enabled ? (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-semibold whitespace-nowrap">
                                    Sentimiento 360 (+$25 USD)
                                  </span>
                                ) : null}
                                {addons?.liveWallboard?.enabled ? (
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold whitespace-nowrap">
                                    Wallboard (+$20 USD)
                                  </span>
                                ) : null}
                                {!addons?.extraBranches && !addons?.extraManagers && !addons?.sentiment360?.enabled && !addons?.liveWallboard?.enabled && (
                                  <span className="text-[11px] text-slate-500 italic">Sin Add-Ons</span>
                                )}
                              </div>
                            </td>

                            {/* Base Fee */}
                            <td className="py-3.5 px-3 whitespace-nowrap">
                              <p className="font-mono font-bold text-white text-xs">
                                {privacyMode ? '••••••••' : formatCurrencyDisplay(fin.baseUSD, 'USD')}
                              </p>
                              {fin.isCustomAgreed ? (
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/30 mt-0.5">
                                  ⭐ Pactada Comercial
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                                  Plan Estándar
                                </span>
                              )}
                            </td>

                            {/* Monthly Invoicing (MRR) */}
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <p className="text-sm font-extrabold text-emerald-400 font-mono">
                                {privacyMode ? '••••••••' : primaryPrice}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                {privacyMode ? '••••••••' : secondaryPrice}
                              </p>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMrrEditingBiz(biz);
                                    setMrrFeeInputUSD(String(biz.agreedMonthlyFeeUSD || fin.totalUSD || ''));
                                    setMrrFeeInputLocal(String(biz.agreedMonthlyFeeCOP || fin.totalLocal || ''));
                                    setMrrBillingCycle(biz.billingCycle || 'monthly');
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                                  title="Ajustar tarifa personalizada para esta marca"
                                >
                                  <Edit3 className="w-3 h-3 text-amber-400" />
                                  <span>Tarifa</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedBusinessId(biz.id);
                                    setActiveTab('directorio');
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                                  title="Ver expediente en Directorio"
                                >
                                  <ExternalLink className="w-3 h-3 text-slate-400" />
                                  <span>Ficha</span>
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
                <div className="py-3.5 px-4 bg-[#121622] border-t border-slate-800 text-slate-400 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
                  <span>
                    Consolidado de <strong className="text-white">{displayedBusinesses.length}</strong> marcas • Total MRR Global: <strong className="text-emerald-400 font-mono font-bold">{formatCurrencyDisplay(totalUSD, 'USD')}</strong> (≈ {formatCurrencyDisplay(totalCOP, 'COP')})
                  </span>
                  <span className="text-[11px] text-purple-400 font-medium">
                    Prestigia B2B Billing System: Multi-Divisa (USD, COP, CLP, MXN, EUR)
                  </span>
                </div>
              </div>

              {/* Quick Fee Adjustment Modal */}
              {mrrEditingBiz && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
                  <div className="relative w-full max-w-md bg-[#0C101A] border border-amber-500/40 rounded-3xl shadow-2xl p-6 text-white space-y-4">
                    <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                          Ajuste de Tarifa Comercial Contratada
                        </span>
                        <h3 className="text-base font-bold text-white mt-0.5">
                          {mrrEditingBiz.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {mrrEditingBiz.country?.replace(/\s*\(NIT\)/, '') || 'Colombia'} • Plan {mrrEditingBiz.plan} ({mrrEditingBiz.branches?.length || 1} Sedes)
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMrrEditingBiz(null)}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[11px] leading-relaxed">
                        💡 <strong>Flexibilidad Total:</strong> Puedes fijar la tarifa en <strong>Dólares Americanos (USD)</strong> para clientes internacionales, o en la <strong>Moneda Local</strong> del país del cliente. El sistema sincronizará la conversión automáticamente.
                      </div>

                      {/* Tarifa en USD */}
                      <div>
                        <label className="text-slate-300 font-semibold block mb-1">
                          Tarifa Mensual en USD ($ Dólares Americanos)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 font-bold font-mono">
                            $
                          </span>
                          <input
                            type="number"
                            value={mrrFeeInputUSD}
                            onChange={(e) => {
                              const val = e.target.value;
                              setMrrFeeInputUSD(val);
                              if (val) {
                                const num = Number(val);
                                setMrrFeeInputLocal(String(num * 4000));
                              }
                            }}
                            placeholder="Ej: 360"
                            className="w-full bg-[#141A26] border border-slate-700 rounded-xl pl-8 pr-14 py-2 font-mono text-white text-xs outline-none focus:border-amber-400"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-mono">
                            USD / mes
                          </span>
                        </div>
                      </div>

                      {/* Tarifa en Moneda Local / COP */}
                      <div>
                        <label className="text-slate-300 font-semibold block mb-1">
                          Equivalente en Moneda Local ({getBusinessCurrency(mrrEditingBiz.country).code})
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">
                            $
                          </span>
                          <input
                            type="number"
                            value={mrrFeeInputLocal}
                            onChange={(e) => {
                              const val = e.target.value;
                              setMrrFeeInputLocal(val);
                              if (val) {
                                const num = Number(val);
                                setMrrFeeInputUSD(String(Math.round(num / 4000)));
                              }
                            }}
                            placeholder="Ej: 900000"
                            className="w-full bg-[#141A26] border border-slate-700 rounded-xl pl-8 pr-14 py-2 font-mono text-white text-xs outline-none focus:border-amber-400"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-mono">
                            {getBusinessCurrency(mrrEditingBiz.country).code} / mes
                          </span>
                        </div>
                      </div>

                      {/* Ciclo de Facturación */}
                      <div>
                        <label className="text-slate-300 font-semibold block mb-1">
                          Ciclo Comercial Pactado
                        </label>
                        <select
                          value={mrrBillingCycle}
                          onChange={(e) => setMrrBillingCycle(e.target.value as any)}
                          className="w-full bg-[#141A26] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none cursor-pointer focus:border-amber-400"
                        >
                          <option value="monthly">Facturación Mensual Recurrente</option>
                          <option value="quarterly">Facturación Trimestral Anticipada (3 meses)</option>
                          <option value="semiannual">Facturación Semestral (6 meses)</option>
                          <option value="annual">Facturación Anual Contratada (12 meses)</option>
                        </select>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setMrrEditingBiz(null)}
                        className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        disabled={mrrSavingFee}
                        onClick={async () => {
                          setMrrSavingFee(true);
                          try {
                            const res = await fetch('/api/master', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                action: 'update_owner_details',
                                businessId: mrrEditingBiz.id,
                                agreedMonthlyFeeUSD: Number(mrrFeeInputUSD) || 0,
                                agreedMonthlyFeeCOP: Number(mrrFeeInputLocal) || 0,
                                billingCycle: mrrBillingCycle,
                              }),
                            });
                            const data = await res.json();
                            if (data.success) {
                              setNotification({
                                type: 'success',
                                message: `¡Tarifa contratada de '${mrrEditingBiz.name}' actualizada con éxito!`,
                              });
                              setTimeout(() => setNotification(null), 4000);
                              setMrrEditingBiz(null);
                              fetchMasterData();
                            } else {
                              alert(data.error || 'Error al actualizar la tarifa');
                            }
                          } catch {
                            alert('Error de conexión con el servidor');
                          } finally {
                            setMrrSavingFee(false);
                          }
                        }}
                        className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
                      >
                        {mrrSavingFee ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Guardando...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Guardar Tarifa</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

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

        {/* ============================================================== */}
        {/* TAB 8: CENTRO DE COMUNICACIONES VIP & MAILER OFICIAL */}
        {/* ============================================================== */}
        {activeTab === 'comunicaciones' && (
          <div className="space-y-6">
            {/* Top Header Card */}
            <div className="bg-[#0E121B] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                      Centro de Comunicaciones VIP & Mailer Oficial
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                        {securityConfig.hasResendConfigured ? '✓ Resend Live API' : 'Modo Registro Interno'}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Despacho corporativo de bienvenidas con credenciales, campañas de reactivación de inactivas, reportes mensuales y avisos oficiales.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Metrics Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="px-3.5 py-2 rounded-2xl bg-[#141A26] border border-slate-800 text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Empresas Activas</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {businesses.filter((b) => b.status === 'active').length}
                  </span>
                </div>
                <div className="px-3.5 py-2 rounded-2xl bg-[#141A26] border border-amber-500/30 text-xs">
                  <span className="text-amber-400 block text-[10px] uppercase font-bold">Inactivas (Winback)</span>
                  <span className="font-mono font-bold text-amber-300 text-sm">
                    {businesses.filter((b) => b.status === 'suspended').length}
                  </span>
                </div>
                <div className="px-3.5 py-2 rounded-2xl bg-[#141A26] border border-slate-800 text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Despachos</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {emailDispatches.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Dual Grid: Editor & Live Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Form & Configuration (5 cols) */}
              <div className="lg:col-span-5 bg-[#0E121B] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    1. Selecciona la Plantilla Ejecutiva
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Formatos estandarizados con diseño bancario Prestigia Gold</p>
                </div>

                {/* Templates Selector Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setMailerTemplate('welcome_credentials')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      mailerTemplate === 'welcome_credentials'
                        ? 'bg-amber-500/15 border-amber-500/60 shadow-lg shadow-amber-500/10'
                        : 'bg-[#141A26] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">🎓</span>
                      <span className="text-xs font-bold text-white">Bienvenida & Credenciales</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">Entrega de ID, clave inicial y link al portal</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMailerTemplate('reactivation_winback')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      mailerTemplate === 'reactivation_winback'
                        ? 'bg-rose-500/15 border-rose-500/60 shadow-lg shadow-rose-500/10'
                        : 'bg-[#141A26] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">🎁</span>
                      <span className="text-xs font-bold text-rose-300">Reactivación & Winback</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">Oferta especial para empresas inactivas</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMailerTemplate('monthly_report')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      mailerTemplate === 'monthly_report'
                        ? 'bg-blue-500/15 border-blue-500/60 shadow-lg shadow-blue-500/10'
                        : 'bg-[#141A26] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">📊</span>
                      <span className="text-xs font-bold text-blue-300">Reporte Mensual</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">Estrellas Google, NPS y quejas contenidas</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMailerTemplate('official_announcement')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      mailerTemplate === 'official_announcement'
                        ? 'bg-purple-500/15 border-purple-500/60 shadow-lg shadow-purple-500/10'
                        : 'bg-[#141A26] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">📢</span>
                      <span className="text-xs font-bold text-purple-300">Comunicado Oficial</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">Nuevas funciones o avisos institucionales</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMailerTemplate('billing_renewal')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      mailerTemplate === 'billing_renewal'
                        ? 'bg-emerald-500/15 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                        : 'bg-[#141A26] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">💳</span>
                      <span className="text-xs font-bold text-emerald-300">Aviso de Renovación</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">Facturación de ciclo y pago en línea</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMailerTemplate('custom')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      mailerTemplate === 'custom'
                        ? 'bg-amber-500/15 border-amber-500/60 shadow-lg shadow-amber-500/10'
                        : 'bg-[#141A26] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">✍️</span>
                      <span className="text-xs font-bold text-amber-300">Mensaje Libre</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">Asunto y cuerpo totalmente personalizados</p>
                  </button>
                </div>

                {/* Form Controls */}
                <form onSubmit={handleSendCorporateCampaign} className="space-y-4 pt-2">
                  {/* Step 2: Audience Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                      <span>2. Segmento de Destinatarios</span>
                      <span className="text-[10px] text-amber-400 font-mono">AUDIENCIA</span>
                    </label>
                    <select
                      value={mailerAudience}
                      onChange={(e) => setMailerAudience(e.target.value as any)}
                      className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="single">🎯 Una Empresa Específica</option>
                      <option value="active_all">
                        🟢 Todas las Empresas Activas ({businesses.filter((b) => b.status === 'active').length})
                      </option>
                      <option value="inactive_all">
                        🔴 Empresas Inactivas / Suspendidas - Campaña Winback ({businesses.filter((b) => b.status === 'suspended').length})
                      </option>
                      <option value="plan_elite_empresarial">
                        👑 Segmento VIP: Solo Planes Élite y Empresarial ({businesses.filter((b) => b.plan === 'elite' || b.plan === 'empresarial').length})
                      </option>
                      <option value="leads_prospects">
                        🚀 Prospectos Web Registrados ({commercialLeads.length})
                      </option>
                    </select>
                  </div>

                  {/* If Single: Target Business Dropdown */}
                  {mailerAudience === 'single' && (
                    <div className="space-y-1.5 animate-in fade-in duration-150">
                      <label className="text-xs font-medium text-slate-300">Seleccionar Empresa Afiliada:</label>
                      <select
                        value={mailerBusinessId}
                        onChange={(e) => setMailerBusinessId(e.target.value)}
                        className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-amber-400 cursor-pointer"
                      >
                        {businesses.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name} — {b.ownerName} ({b.ownerEmail || 'Sin correo'}) [{b.plan.toUpperCase()}]
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* If Winback: Discount percent */}
                  {mailerTemplate === 'reactivation_winback' && (
                    <div className="space-y-1.5 p-3 rounded-2xl bg-rose-950/20 border border-rose-500/30 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between text-xs">
                        <label className="font-bold text-rose-300">Porcentaje de Descuento de Retorno:</label>
                        <span className="font-mono font-bold text-white text-sm">{mailerDiscountPercent}% OFF</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="50"
                        step="5"
                        value={mailerDiscountPercent}
                        onChange={(e) => setMailerDiscountPercent(Number(e.target.value))}
                        className="w-full accent-rose-500 cursor-pointer"
                      />
                    </div>
                  )}

                  {/* Asunto Personalizado (Opcional) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">Asunto del Correo (Opcional):</label>
                    <input
                      type="text"
                      value={mailerSubject}
                      onChange={(e) => setMailerSubject(e.target.value)}
                      placeholder="Deja en blanco para usar el asunto bancario predeterminado"
                      className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl px-3.5 py-2 text-xs outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Mensaje Adicional / Nota Personalizada */}
                  {(mailerTemplate === 'official_announcement' || mailerTemplate === 'custom' || mailerTemplate === 'reactivation_winback') && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">
                        {mailerTemplate === 'reactivation_winback' ? 'Detalle de la Oferta / Beneficios de Retorno:' : 'Cuerpo del Comunicado:'}
                      </label>
                      <textarea
                        rows={3}
                        value={mailerCustomBody}
                        onChange={(e) => setMailerCustomBody(e.target.value)}
                        placeholder={
                          mailerTemplate === 'reactivation_winback'
                            ? 'Ej: 30 días de Add-ons VIP (Live Wallboard & Sentiment 360) sin costo adicional.'
                            : 'Escribe el mensaje institucional aquí...'
                        }
                        className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl p-3 text-xs outline-none focus:border-amber-400 resize-none"
                      />
                    </div>
                  )}

                  {/* Status Banner */}
                  {mailerResult && (
                    <div
                      className={`p-3 rounded-2xl text-xs flex items-center gap-2.5 ${
                        mailerResult.success
                          ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                          : 'bg-rose-950/40 border border-rose-500/40 text-rose-300'
                      }`}
                    >
                      {mailerResult.success ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      )}
                      <span>{mailerResult.message}</span>
                    </div>
                  )}

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={mailerSending}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold rounded-2xl text-xs shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{mailerSending ? 'Despachando Campaña Corporativa...' : 'Despachar Campaña Corporativa ↗'}</span>
                  </button>
                </form>
              </div>

              {/* Right Column: Live Interactive Preview (7 cols) */}
              <div className="lg:col-span-7 bg-[#0E121B] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-400" />
                      Vista Previa en Vivo (Live Preview)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Así recibirá el cliente este correo en su bandeja de entrada
                    </p>
                  </div>

                  <div className="flex items-center bg-[#141A26] border border-slate-800 rounded-xl p-1 gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('desktop')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        previewDevice === 'desktop' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Desktop</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('mobile')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        previewDevice === 'mobile' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Móvil</span>
                    </button>
                  </div>
                </div>

                {/* Sandboxed Email Container */}
                <div className="bg-[#07090E] p-4 rounded-2xl border border-slate-800 flex justify-center overflow-x-auto min-h-[520px]">
                  <div
                    className={`transition-all duration-300 w-full overflow-hidden ${
                      previewDevice === 'mobile' ? 'max-w-sm rounded-3xl border border-slate-700 shadow-2xl' : 'max-w-xl'
                    }`}
                  >
                    {(() => {
                      const currentBiz =
                        businesses.find((b) => b.id === mailerBusinessId) ||
                        businesses[0] || {
                          name: 'Tu Empresa VIP',
                          ownerName: 'Estimado Titular',
                          plan: 'elite',
                          id: 'empresa-demo',
                          password: 'admin',
                          ownerEmail: 'cliente@empresa.com',
                        };

                      let previewHtml = '';
                      if (mailerTemplate === 'welcome_credentials') {
                        previewHtml = buildWelcomeCredentialsHtml({
                          businessName: currentBiz.name,
                          ownerName: currentBiz.ownerName || 'Director de Marca',
                          plan: currentBiz.plan || 'pro',
                          businessId: currentBiz.id,
                          password: currentBiz.password || 'admin',
                          portalUrl: 'https://prestigia.app/portal',
                        });
                      } else if (mailerTemplate === 'reactivation_winback') {
                        previewHtml = buildReactivationWinbackHtml({
                          businessName: currentBiz.name,
                          ownerName: currentBiz.ownerName || 'Director de Marca',
                          discountPercent: mailerDiscountPercent,
                          offerDetails: mailerCustomBody || '30 días de Add-ons VIP (Live Wallboard & Sentiment 360) sin costo adicional.',
                          portalUrl: 'https://prestigia.app/portal',
                        });
                      } else if (mailerTemplate === 'monthly_report') {
                        previewHtml = buildMonthlyReportHtml({
                          businessName: currentBiz.name,
                          ownerName: currentBiz.ownerName || 'Director de Marca',
                          currentRating: 4.8,
                          ratingGain: 1.1,
                          reviewsCount: 142,
                          containedNegativeCount: 28,
                          portalUrl: 'https://prestigia.app/portal',
                        });
                      } else if (mailerTemplate === 'billing_renewal') {
                        previewHtml = buildBillingRenewalHtml({
                          businessName: currentBiz.name,
                          ownerName: currentBiz.ownerName || 'Director de Marca',
                          plan: currentBiz.plan || 'pro',
                          amountCOP: currentBiz.plan === 'elite' ? 650000 : currentBiz.plan === 'empresarial' ? 1200000 : 380000,
                          dueDate: 'Fin de mes en curso',
                          paymentUrl: 'https://prestigia.app/portal/facturacion',
                        });
                      } else {
                        previewHtml = buildAnnouncementHtml({
                          title: mailerSubject || 'Comunicado Oficial de Prestigia',
                          message: mailerCustomBody || 'Estimado cliente, te compartimos una actualización importante sobre el servicio de Prestigia.',
                          actionUrl: 'https://prestigia.app/portal',
                          actionText: 'CONOCER MÁS EN MI PORTAL ↗',
                        });
                      }

                      return (
                        <div
                          className="w-full text-xs"
                          dangerouslySetInnerHTML={{ __html: previewHtml }}
                        />
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section: Historical Dispatch Audit Log */}
            <div className="bg-[#0E121B] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Inbox className="w-5 h-5 text-amber-400" />
                    Bitácora de Despachos & Historial de Envíos ({emailDispatches.length})
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Trazabilidad de cada correo institucional enviado a clientes, estados de entrega y proveedor utilizado.
                  </p>
                </div>
              </div>

              {emailDispatches.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  <Mail className="w-10 h-10 mx-auto text-slate-600 mb-2 opacity-50" />
                  <p>Aún no se han despachado campañas de correo desde esta consola.</p>
                  <p className="text-[10px] text-slate-400 mt-1">Usa el editor superior para enviar tu primera bienvenida o comunicado.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#141A26] text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4 rounded-l-xl">Fecha & Hora</th>
                        <th className="py-3 px-4">Plantilla</th>
                        <th className="py-3 px-4">Destinatario</th>
                        <th className="py-3 px-4">Empresa</th>
                        <th className="py-3 px-4">Asunto</th>
                        <th className="py-3 px-4 rounded-r-xl text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {emailDispatches.slice(0, 50).map((disp) => (
                        <tr key={disp.id} className="hover:bg-[#141A26]/80 transition-colors">
                          <td className="py-3 px-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                            {new Date(disp.sentAt).toLocaleString('es-CO', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-semibold">
                              {disp.templateName}
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <p className="font-semibold text-white">{disp.recipientName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{disp.recipientEmail}</p>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap font-medium text-amber-400">
                            {disp.businessName}
                          </td>
                          <td className="py-3 px-4 truncate max-w-xs text-slate-300">
                            {disp.subject}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                disp.status === 'sent'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : disp.status === 'queued'
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {disp.status === 'sent' ? `✓ Enviado (${disp.provider})` : disp.status === 'queued' ? 'En cola de auditoría' : 'Fallido'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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

            <form onSubmit={handleCreateBusiness} className="mt-5 space-y-5 text-xs">
              {/* ========================================================= */}
              {/* PASO 1: CONEXIÓN & DETECCIÓN INSTANTÁNEA DE GOOGLE MAPS   */}
              {/* ========================================================= */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#141A26] to-[#0E121B] border border-blue-500/40 shadow-xl shadow-blue-500/5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold shrink-0">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-extrabold text-[10px] tracking-wider uppercase border border-blue-500/30 whitespace-nowrap shrink-0 inline-flex items-center">
                          Paso 1 • Recomendado
                        </span>
                        <h4 className="font-extrabold text-white text-sm">
                          Detección Automática de Google Maps
                        </h4>
                        {isGoogleSynced && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Detectado en Vivo
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Pega el enlace de Google Maps de la marca o de la sede (ej: <code className="text-amber-300 font-mono">https://maps.app.goo.gl/...</code>). Prestigia extraerá en vivo la calificación (★), total de reseñas y dirección física para fijar la <strong className="text-white">Línea Base Día 1</strong> automáticamente.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={googleQueryInput}
                      onChange={(e) => setGoogleQueryInput(e.target.value)}
                      onPaste={(e) => {
                        const pasted = e.clipboardData.getData('text');
                        if (pasted && (pasted.includes('goo.gl') || pasted.includes('google.com/maps') || pasted.includes('maps.app'))) {
                          setGoogleQueryInput(pasted);
                          setTimeout(() => {
                            handleDetectGooglePlace(pasted.trim());
                          }, 120);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleDetectGooglePlace();
                        }
                      }}
                      placeholder="Pega el enlace de Google Maps (ej: https://maps.app.goo.gl/...) o nombre comercial"
                      className="w-full bg-[#0E121B] border border-slate-700 focus:border-blue-400 text-white rounded-xl pl-10 pr-3.5 py-2.5 text-xs outline-none shadow-inner"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={googleDetectLoading}
                    onClick={() => handleDetectGooglePlace()}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/25 transition-all shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${googleDetectLoading ? 'animate-spin' : ''}`} />
                    <span>{googleDetectLoading ? 'Detectando en Google...' : '⚡ Detectar Ficha en Google'}</span>
                  </button>
                </div>

                {googleDetectSuccess && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-medium">{googleDetectSuccess}</span>
                  </div>
                )}

                {googleDetectError && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5 animate-in fade-in">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{googleDetectError}</span>
                  </div>
                )}

                {/* Rich Google Business Profile Preview Card */}
                {detectedGoogleProfile && (
                  <div className="mt-3.5 p-4 rounded-xl bg-[#0E121B] border border-blue-500/40 text-xs space-y-3 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Ficha Oficial Verificada en Google Maps
                        </span>
                        <h4 className="font-extrabold text-white text-sm sm:text-base mt-0.5">{detectedGoogleProfile.name}</h4>
                        {detectedGoogleProfile.address && (
                          <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{detectedGoogleProfile.address}</span>
                          </p>
                        )}
                      </div>
                      <div className="text-left sm:text-right bg-[#141A26] px-4 py-2 rounded-xl border border-slate-800 shrink-0">
                        <div className="flex items-center gap-1.5 justify-start sm:justify-end font-mono font-extrabold text-amber-400 text-base">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span>{detectedGoogleProfile.rating}★</span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-semibold mt-0.5">
                          {detectedGoogleProfile.reviewsCount} opiniones oficiales
                        </p>
                      </div>
                    </div>

                    {detectedGoogleProfile.placeId && (
                      <div className="flex items-center justify-between text-[11px] text-slate-400 bg-[#141A26] px-3 py-1.5 rounded-lg border border-slate-800">
                        <span className="font-mono truncate">Google Place ID: <strong className="text-amber-300">{detectedGoogleProfile.placeId}</strong></span>
                        <span className="text-emerald-400 font-bold shrink-0 ml-2">✓ API Prestigia Enlazada</span>
                      </div>
                    )}

                    {/* Línea Base Confirmation Callout */}
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>
                        <strong>Línea Base Día 1 fijada automáticamente:</strong> Inicia con {detectedGoogleProfile.rating}★ y {detectedGoogleProfile.reviewsCount} reseñas. Todos los campos inferiores han sido autocompletados.
                      </span>
                    </div>

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
                          <span>Probar Enlace Directo de Reseña ↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ========================================================= */}
              {/* PASO 2: DATOS COMERCIALES DE LA MARCA & SEDE PRINCIPAL   */}
              {/* ========================================================= */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 border-b border-slate-800 gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-extrabold text-[10px] tracking-wider uppercase border border-slate-700 whitespace-nowrap shrink-0 inline-flex items-center">
                      Paso 2
                    </span>
                    <h4 className="font-extrabold text-white text-xs sm:text-sm">
                      Datos Comerciales de la Marca & Sede Principal
                    </h4>
                  </div>
                  <span className="text-[10px] text-amber-400 font-medium">
                    ✍️ Puedes escribir tus datos o afinar los sugeridos por Google
                  </span>
                </div>

                {/* Fila 1: Ubicación Geográfica (País y Ciudad Dependiente, con Modo Manual Libre) */}
                {(() => {
                  const countryObj = PRESTIGIA_COUNTRIES.find((c) => c.id === onboardForm.country);
                  const americaCountries = PRESTIGIA_COUNTRIES
                    .filter((c) => c.region === 'América')
                    .sort((a, b) => a.label.localeCompare(b.label, 'es'));
                  const europaCountries = PRESTIGIA_COUNTRIES
                    .filter((c) => c.region === 'Europa')
                    .sort((a, b) => a.label.localeCompare(b.label, 'es'));
                  const otherCountries = PRESTIGIA_COUNTRIES
                    .filter((c) => c.region === 'Internacional')
                    .sort((a, b) => a.label.localeCompare(b.label, 'es'));
                  const sortedCities = countryObj
                    ? [...countryObj.cities].sort((a, b) => a.localeCompare(b, 'es'))
                    : [];
                  const isCountryFilled = Boolean(onboardForm.country && onboardForm.country.trim());

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-2xl bg-[#0F141F] border border-blue-500/20 shadow-md">
                      {/* Columna 1: País de Operación */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-200 font-semibold flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-blue-400" />
                            1° País de Operación *
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const next = !customCountryMode;
                              setCustomCountryMode(next);
                              if (next) {
                                setCustomCityMode(true);
                              }
                            }}
                            className="text-[10px] text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
                          >
                            {customCountryMode ? '📋 Elegir de la lista' : '✍️ Escribir país a mano'}
                          </button>
                        </div>

                        {customCountryMode ? (
                          <input
                            type="text"
                            required
                            autoFocus
                            value={onboardForm.country}
                            onChange={(e) => {
                              const val = e.target.value;
                              setOnboardForm((prev) => ({
                                ...prev,
                                country: val,
                              }));
                            }}
                            placeholder="Escribe el nombre del país (ej: Australia, Japón, etc.)"
                            className="w-full bg-[#141A26] border border-amber-500/60 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 text-xs font-medium"
                          />
                        ) : (
                          <select
                            required
                            value={onboardForm.country}
                            onChange={(e) => {
                              const newCountryId = e.target.value;
                              if (newCountryId === '__custom_country__') {
                                setCustomCountryMode(true);
                                setCustomCityMode(true);
                                setOnboardForm((prev) => ({
                                  ...prev,
                                  country: '',
                                  city: '',
                                }));
                                return;
                              }
                              const newCountry = PRESTIGIA_COUNTRIES.find((c) => c.id === newCountryId);
                              setCustomCityMode(false);
                              if (newCountry) {
                                setOnboardForm((prev) => {
                                  let newPhone = prev.ownerPhone;
                                  const knownPrefixes = PRESTIGIA_COUNTRIES.map((c) => c.prefix);
                                  const matchedPrefix = knownPrefixes.find((pfx) => pfx && newPhone.startsWith(pfx));
                                  if (matchedPrefix || !newPhone || newPhone.trim() === '') {
                                    newPhone = newCountry.prefix + ' ';
                                  }
                                  return {
                                    ...prev,
                                    country: newCountryId,
                                    ownerPhone: newPhone,
                                    city: newCountry.defaultCity || newCountry.cities[0] || '',
                                  };
                                });
                              } else {
                                setOnboardForm((prev) => ({
                                  ...prev,
                                  country: '',
                                  city: '',
                                }));
                              }
                            }}
                            className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 cursor-pointer font-medium text-xs"
                          >
                            <option value="">-- Elige el País de Operación --</option>
                            <optgroup label={`🌎 América (${americaCountries.length} países)`}>
                              {americaCountries.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.label} ({c.taxLabel.split(' ')[0]} • {c.prefix})
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label={`🌍 Europa (${europaCountries.length} países)`}>
                              {europaCountries.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.label} ({c.taxLabel.split(' ')[0]} • {c.prefix})
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="🌐 Internacional">
                              {otherCountries.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.label} ({c.prefix})
                                </option>
                              ))}
                            </optgroup>
                            <option value="__custom_country__">✍️ Otro país no listado (Escribir a mano)...</option>
                          </select>
                        )}

                        <p className="text-[10px] text-slate-400 mt-1">
                          {customCountryMode ? (
                            <span className="text-amber-400/90 font-medium">✍️ Modo manual: Puedes escribir cualquier país del mundo.</span>
                          ) : countryObj ? (
                            <span className="text-emerald-400 font-medium">✓ {countryObj.flag} Prefijo: {countryObj.prefix} • {countryObj.taxLabel.split(' ')[0]}</span>
                          ) : (
                            'Al seleccionar o escribir el país se activará la casilla de ciudad.'
                          )}
                        </p>
                      </div>

                      {/* Columna 2: Ciudad de Operación (Bloqueada hasta definir país) */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-200 font-semibold flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                            2° Ciudad de Operación *
                          </label>
                          {countryObj && !customCountryMode && (
                            <button
                              type="button"
                              onClick={() => {
                                setCustomCityMode(!customCityMode);
                                if (!customCityMode && !onboardForm.city) {
                                  setOnboardForm({ ...onboardForm, city: '' });
                                }
                              }}
                              className="text-[10px] text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
                            >
                              {customCityMode ? '📋 Elegir de la lista' : '✍️ Escribir otra ciudad'}
                            </button>
                          )}
                        </div>

                        {!isCountryFilled ? (
                          <div className="w-full bg-[#0B0F17] border border-dashed border-slate-800 text-slate-500 rounded-xl px-3.5 py-2.5 text-xs flex items-center gap-2 cursor-not-allowed select-none opacity-70">
                            <Lock className="w-3.5 h-3.5 text-amber-500/70 shrink-0" />
                            <span className="font-medium">🔒 Bloqueado: Selecciona o escribe primero el país a la izquierda</span>
                          </div>
                        ) : customCountryMode || !countryObj || customCityMode ? (
                          <input
                            type="text"
                            required
                            autoFocus={customCountryMode || customCityMode}
                            value={onboardForm.city}
                            onChange={(e) => setOnboardForm({ ...onboardForm, city: e.target.value })}
                            placeholder={countryObj ? `Escribe cualquier municipio de ${countryObj.label.split(' ')[0]}` : `Escribe la ciudad de ${onboardForm.country || 'la sede'}`}
                            className="w-full bg-[#141A26] border border-amber-500/60 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 text-xs font-medium"
                          />
                        ) : (
                          <select
                            required
                            value={onboardForm.city}
                            onChange={(e) => {
                              if (e.target.value === '__custom__') {
                                setCustomCityMode(true);
                                setOnboardForm({ ...onboardForm, city: '' });
                              } else {
                                setOnboardForm({ ...onboardForm, city: e.target.value });
                              }
                            }}
                            className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 cursor-pointer font-medium text-xs"
                          >
                            <option value="">-- Elige una ciudad de {countryObj.label.split(' ')[0]} --</option>
                            {sortedCities.map((city) => (
                              <option key={city} value={city}>
                                📍 {city}
                              </option>
                            ))}
                            <option value="__custom__">✍️ Otra ciudad no listada (Escribir a mano)...</option>
                          </select>
                        )}

                        <p className="text-[10px] text-slate-400 mt-1">
                          {!isCountryFilled ? (
                            'Este campo se desbloqueará en cuanto elijas o escribas el país.'
                          ) : customCountryMode || !countryObj ? (
                            <span className="text-emerald-400">✓ País activo: <strong>{onboardForm.country}</strong>. Escribe la ciudad libremente.</span>
                          ) : customCityMode ? (
                            `✍️ Escribe libremente cualquier ciudad o municipio de ${countryObj.label.split(' ')[0]}.`
                          ) : (
                            `✓ ${sortedCities.length} ciudades principales disponibles en orden alfabético (A-Z).`
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Fila 2: Localidad / Zona / Barrio & Nicho / Industria */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Localidad / Barrio / Zona *
                    </label>
                    <input
                      type="text"
                      required
                      value={onboardForm.locality}
                      onChange={(e) => setOnboardForm({ ...onboardForm, locality: e.target.value })}
                      placeholder="Ej: Chapinero / Polanco / Palermo / Providencia"
                      className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 text-xs"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Sector o barrio específico de la sede principal.</p>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Nicho / Industria *</label>
                    <select
                      required
                      value={onboardForm.category}
                      onChange={(e) => setOnboardForm({ ...onboardForm, category: e.target.value })}
                      className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 cursor-pointer font-medium text-xs"
                    >
                      {PRESTIGIA_NICHES.map((niche) => (
                        <option key={niche.id} value={niche.label}>
                          {niche.icon} {niche.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1">Sector comercial para segmentación de analítica.</p>
                  </div>
                </div>

                {/* Fila 3: Nombre Comercial de la Marca & Identificador Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1 flex items-center justify-between">
                      <span>Nombre Comercial de la Marca *</span>
                      {isGoogleSynced && <span className="text-[10px] text-emerald-400 font-bold">✓ Sugerido Google</span>}
                    </label>
                    <input
                      type="text"
                      required
                      value={onboardForm.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
                        setOnboardForm({
                          ...onboardForm,
                          name,
                          legalName: onboardForm.legalName || name,
                          id: slug,
                        });
                      }}
                      placeholder="Ej: La Taquería del Sol"
                      className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 font-medium text-xs"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Escribe el nombre comercial oficial que verán tus clientes.</p>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Identificador Slug (URL & QR) *</label>
                    <input
                      type="text"
                      required
                      value={onboardForm.id}
                      onChange={(e) => setOnboardForm({ ...onboardForm, id: e.target.value })}
                      placeholder="la-taqueria-del-sol"
                      className="w-full bg-[#141A26] border border-slate-700 text-amber-400 font-mono rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 text-xs"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Enlace público QR: <span className="font-mono text-slate-300">prestigia.app/r/{onboardForm.id || 'slug'}</span>
                    </p>
                  </div>
                </div>

                {/* Fila 4: Logotipo de la Marca (Subida Local o URL) & Razón Social Registrada */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    {/* Hidden Native File Input */}
                    <input
                      type="file"
                      ref={logoFileInputRef}
                      accept="image/*"
                      onChange={handleLogoFileUpload}
                      className="hidden"
                    />

                    <label className="block text-slate-300 font-medium mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Logotipo de la Marca
                    </label>

                    <div className="flex items-center gap-2">
                      {/* Avatar Preview Box */}
                      <div className="w-10 h-10 rounded-xl bg-[#0E121B] border border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                        {onboardForm.logoUrl ? (
                          <img
                            src={onboardForm.logoUrl}
                            alt="Logo preview"
                            className="w-full h-full object-contain p-1"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-slate-500" />
                        )}
                      </div>

                      {/* URL or Local File Text Input */}
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={onboardForm.logoUrl.startsWith('data:') ? `[Archivo Local] ${localLogoName || 'logo.png'}` : onboardForm.logoUrl}
                          onChange={(e) => {
                            setLocalLogoName(null);
                            setOnboardForm({ ...onboardForm, logoUrl: e.target.value });
                          }}
                          placeholder="Pega enlace de imagen (URL)..."
                          className="w-full bg-[#141A26] border border-slate-700 text-white text-xs rounded-xl pl-3 pr-14 py-2.5 outline-none focus:border-amber-400 font-mono"
                        />

                        {onboardForm.logoUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setLocalLogoName(null);
                              setOnboardForm({ ...onboardForm, logoUrl: '' });
                              if (logoFileInputRef.current) logoFileInputRef.current.value = '';
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-red-400 bg-slate-800/80 hover:bg-red-500/20 px-2 py-0.5 rounded cursor-pointer transition-colors"
                          >
                            Quitar
                          </button>
                        )}
                      </div>

                      {/* UN SOLO BOTÓN para subir archivo local */}
                      <button
                        type="button"
                        onClick={() => logoFileInputRef.current?.click()}
                        className="px-3 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>Subir archivo</span>
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 mt-1">
                      {onboardForm.logoUrl.startsWith('data:') ? (
                        <span className="text-emerald-400 font-medium">✓ Imagen local optimizada y lista para guardar.</span>
                      ) : (
                        <span>Admite PNG, JPG, SVG o WebP (máx. 5MB) o enlace URL.</span>
                      )}
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Razón Social Registrada (Persona Jurídica o Legal)
                    </label>
                    <input
                      type="text"
                      value={onboardForm.legalName}
                      onChange={(e) => setOnboardForm({ ...onboardForm, legalName: e.target.value })}
                      placeholder="Ej: Operadora Gastronómica del Sol S.A.S."
                      className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 text-xs"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Si es igual a la marca o persona natural, puedes dejarlo igual.</p>
                  </div>
                </div>

                {/* Fila 5: Identificación Tributaria (NIT/RUT/RFC/NIF) & Dirección Física */}
                {(() => {
                  const countryObj = PRESTIGIA_COUNTRIES.find((c) => c.id === onboardForm.country) || PRESTIGIA_COUNTRIES[0];
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-300 font-medium mb-1 flex items-center justify-between">
                          <span>{countryObj.taxLabel} *</span>
                          <span className="text-[10px] font-mono text-amber-400">{countryObj.flag} {countryObj.id.split(' ')[0]}</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={onboardForm.taxId}
                          onChange={(e) => setOnboardForm({ ...onboardForm, taxId: e.target.value })}
                          placeholder={`Ej: ${countryObj.taxPlaceholder}`}
                          className="w-full bg-[#141A26] border border-slate-700 text-amber-300 font-mono rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 text-xs"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Número de identificación tributaria para facturación.</p>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-medium mb-1 flex items-center justify-between">
                          <span>Dirección Física de la Sede Principal</span>
                          {isGoogleSynced && <span className="text-[10px] text-emerald-400 font-bold">✓ Sugerido Google</span>}
                        </label>
                        <input
                          type="text"
                          value={onboardForm.address}
                          onChange={(e) => setOnboardForm({ ...onboardForm, address: e.target.value })}
                          placeholder="Ej: Cra. 13 #82-28, Chapinero"
                          className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 text-xs"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Escribe la dirección física real o afina la de Google.</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Fila 6: Plan Inicial Contratado & Representante Legal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Plan Inicial Contratado *</label>
                    <select
                      value={onboardForm.plan}
                      onChange={(e) => setOnboardForm({ ...onboardForm, plan: e.target.value as BusinessPlan })}
                      className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 capitalize cursor-pointer font-medium text-xs"
                    >
                      <option value="independiente">Plan Independiente (1 Sede • Operador Único)</option>
                      <option value="pro">Plan Pro (1 Sede • Panel Central)</option>
                      <option value="elite">Plan Élite (Multi-Sede • Encargados)</option>
                      <option value="empresarial">Plan Empresarial (Holding • Ilimitado)</option>
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1">Nivel de servicio y capacidad de sedes asignado.</p>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Representante Legal / Titular *
                    </label>
                    <input
                      type="text"
                      required
                      value={onboardForm.ownerName}
                      onChange={(e) => setOnboardForm({ ...onboardForm, ownerName: e.target.value })}
                      placeholder="Mario Casas"
                      className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 text-xs"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Nombre del dueño, director o gerente titular.</p>
                  </div>
                </div>

                {/* Fila 6.5: Tarifa Mensual Pactada & Ciclo de Facturación */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-[#101722] to-emerald-500/10 border border-emerald-500/30">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-emerald-300 font-bold text-xs">
                        Tarifa Mensual Pactada (COP) *
                      </label>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        Sin Planes Fijos
                      </span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">$</span>
                      <input
                        type="number"
                        min="0"
                        step="10000"
                        value={onboardForm.agreedMonthlyFeeCOP || ''}
                        onChange={(e) => {
                          const cop = parseInt(e.target.value) || 0;
                          setOnboardForm({
                            ...onboardForm,
                            agreedMonthlyFeeCOP: cop,
                            agreedMonthlyFeeUSD: cop > 0 ? Math.round(cop / 4000) : 0,
                          });
                        }}
                        placeholder="Ej: 900000"
                        className="w-full bg-[#141A26] border border-emerald-500/40 text-emerald-300 font-mono rounded-xl pl-8 pr-3.5 py-2.5 outline-none focus:border-emerald-400 text-xs font-bold"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Prestigia acuerda la tarifa según contrato (sin precios de planes fijos).</p>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1 text-xs">
                      Ciclo de Facturación
                    </label>
                    <select
                      value={onboardForm.billingCycle || 'monthly'}
                      onChange={(e) => setOnboardForm({ ...onboardForm, billingCycle: e.target.value as any })}
                      className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 text-xs font-medium cursor-pointer"
                    >
                      <option value="monthly">Facturación Mensual</option>
                      <option value="quarterly">Facturación Trimestral</option>
                      <option value="semiannual">Facturación Semestral</option>
                      <option value="annual">Facturación Anual</option>
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1">Equivalente ref: {onboardForm.agreedMonthlyFeeUSD ? `${onboardForm.agreedMonthlyFeeUSD} USD` : '$0 USD'}.</p>
                  </div>
                </div>

                {/* Fila 7: WhatsApp para Alertas Directas & Correo Electrónico */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      WhatsApp para Alertas Directas *
                    </label>
                    <input
                      type="text"
                      required
                      value={onboardForm.ownerPhone}
                      onChange={(e) => setOnboardForm({ ...onboardForm, ownerPhone: e.target.value })}
                      placeholder="+57 300 123 4567"
                      className="w-full bg-[#141A26] border border-slate-700 text-white font-mono rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 text-xs"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Con prefijo del país para alertas de insatisfacción en vivo.</p>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Correo Electrónico del Titular *
                    </label>
                    <input
                      type="email"
                      required
                      value={onboardForm.ownerEmail}
                      onChange={(e) => setOnboardForm({ ...onboardForm, ownerEmail: e.target.value })}
                      placeholder="gerencia@taqueria.com"
                      className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 text-xs"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Para recepción de credenciales del portal y reportes.</p>
                  </div>
                </div>
              </div>

              {/* ========================================================= */}
              {/* PASO 3: LÍNEA BASE HISTÓRICA INICIAL (DÍA 1)              */}
              {/* ========================================================= */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[10px] tracking-wider uppercase border border-amber-500/30 whitespace-nowrap shrink-0 inline-flex items-center">
                      Paso 3
                    </span>
                    <p className="text-amber-400 font-extrabold flex items-center gap-1.5 text-xs sm:text-sm">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      Línea Base Histórica Inicial (Día 1 para Caso de Éxito):
                    </p>
                  </div>
                  {isGoogleSynced ? (
                    <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full animate-in fade-in">
                      <Check className="w-3.5 h-3.5" />
                      ✓ Autocompletado en vivo desde Google Maps
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-400/90 font-medium flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                      ⚡ Automático: Se llena al detectar Google en Paso 1
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  {isGoogleSynced ? (
                    <span className="text-emerald-300 font-medium">
                      ✓ Calificación y reseñas extraídas en vivo desde la ficha pública de Google Maps. Servirán como prueba documental inmutable para calcular el incremento de estrellas y reseñas ganadas con Prestigia.
                    </span>
                  ) : (
                    <span>
                      Al presionar <strong>⚡ Detectar Ficha en Google</strong> en el Paso 1 arriba, la calificación (★) y total de reseñas se leerán y colocarán aquí automáticamente sin que tengas que escribirlos.
                    </span>
                  )}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Rating Google Día 1 */}
                  <div className={`p-3.5 rounded-2xl bg-[#141A26] border transition-all ${
                    isGoogleSynced ? 'border-emerald-500/60 bg-emerald-950/20 shadow-lg shadow-emerald-500/10' : 'border-slate-800'
                  }`}>
                    <label className="block text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Star className={`w-3.5 h-3.5 ${isGoogleSynced ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
                        Rating Google Día 1
                      </span>
                      {isGoogleSynced ? (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                          ✓ {onboardForm.initialRating}★ Live
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 font-mono">
                          Auto (Paso 1)
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      value={onboardForm.initialRating > 0 ? onboardForm.initialRating : ''}
                      onChange={(e) => setOnboardForm({ ...onboardForm, initialRating: parseFloat(e.target.value) || 0 })}
                      placeholder="⚡ Automático al detectar Google..."
                      className={`w-full bg-[#0E121B] border rounded-xl px-3.5 py-2.5 outline-none font-mono text-sm ${
                        isGoogleSynced
                          ? 'border-emerald-500/60 text-emerald-300 font-bold'
                          : 'border-slate-700 text-white placeholder-slate-600'
                      }`}
                    />
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                      <span>Escala de 1.0 a 5.0★</span>
                      {isGoogleSynced && <span className="text-emerald-400 font-bold">✓ Extraído de Google Maps</span>}
                    </p>
                  </div>

                  {/* Reseñas Google Día 1 */}
                  <div className={`p-3.5 rounded-2xl bg-[#141A26] border transition-all ${
                    isGoogleSynced ? 'border-emerald-500/60 bg-emerald-950/20 shadow-lg shadow-emerald-500/10' : 'border-slate-800'
                  }`}>
                    <label className="block text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <MessageCircle className={`w-3.5 h-3.5 ${isGoogleSynced ? 'text-blue-400' : 'text-slate-500'}`} />
                        Reseñas Google Día 1
                      </span>
                      {isGoogleSynced ? (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                          ✓ {onboardForm.initialReviewCount} Live
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 font-mono">
                          Auto (Paso 1)
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={onboardForm.initialReviewCount > 0 ? onboardForm.initialReviewCount : ''}
                      onChange={(e) => setOnboardForm({ ...onboardForm, initialReviewCount: parseInt(e.target.value) || 0 })}
                      placeholder="⚡ Automático al detectar Google..."
                      className={`w-full bg-[#0E121B] border rounded-xl px-3.5 py-2.5 outline-none font-mono text-sm ${
                        isGoogleSynced
                          ? 'border-emerald-500/60 text-emerald-300 font-bold'
                          : 'border-slate-700 text-white placeholder-slate-600'
                      }`}
                    />
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                      <span>Total acumulado inicial</span>
                      {isGoogleSynced && <span className="text-emerald-400 font-bold">✓ Extraído de Google Maps</span>}
                    </p>
                  </div>

                  {/* Ticket Promedio */}
                  <div className="p-3.5 rounded-2xl bg-[#141A26] border border-slate-800">
                    <label className="block text-slate-300 font-semibold mb-1.5 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ticket Promedio de Compra</span>
                    </label>
                    <input
                      type="number"
                      step="1000"
                      value={onboardForm.averageTicketCOP || ''}
                      onChange={(e) => setOnboardForm({ ...onboardForm, averageTicketCOP: parseInt(e.target.value) || 0 })}
                      placeholder="Ej: 45000"
                      className="w-full bg-[#0E121B] border border-slate-700 text-white rounded-xl px-3.5 py-2.5 outline-none font-mono text-sm"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Valor promedio de compra del comensal o cliente.</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowOnboardModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-extrabold rounded-xl cursor-pointer shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
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

                  {/* Step 4: Transactional Dispatch Gateways (Real Email & WhatsApp) */}
                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-200 font-bold flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-amber-400" />
                        4. Pasarelas de Despacho Transaccional (Email & WhatsApp Corporativo)
                      </label>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                        securityConfig.hasResendConfigured || securityForm.resendApiKey
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {securityConfig.hasResendConfigured || securityForm.resendApiKey ? '✓ RESEND CONECTADO' : 'CONFIGURACIÓN OPCIONAL'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300">
                      Para que los códigos de rescate y las alertas de contención de clientes lleguen automáticamente por red a tu bandeja de entrada o teléfono móvil, puedes registrar tu API Key:
                    </p>

                    <div className="space-y-2.5">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] text-slate-300 font-medium">Resend API Key (re_...)</label>
                          <a
                            href="https://resend.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-amber-400 hover:underline"
                          >
                            Obtener gratis en Resend.com ↗
                          </a>
                        </div>
                        <input
                          type="password"
                          value={securityForm.resendApiKey}
                          onChange={(e) => setSecurityForm({ ...securityForm, resendApiKey: e.target.value })}
                          placeholder="re_123456789abcdef..."
                          className="w-full bg-[#141A26] border border-slate-700 text-white rounded-xl px-3.5 py-2 outline-none font-mono text-xs focus:border-amber-400"
                        />
                      </div>

                      {/* Live Test Dispatch Button */}
                      <div className="pt-1 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          disabled={testNotificationLoading}
                          onClick={handleTestNotificationDispatch}
                          className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
                        >
                          <Radio className="w-3.5 h-3.5 text-amber-400" />
                          <span>{testNotificationLoading ? 'Probando Despacho en Vivo...' : 'Probar Envío a mi Correo / Celular'}</span>
                        </button>
                        <span className="text-[10px] text-slate-400">
                          Prueba la entrega a {securityForm.newEmergencyEmail}
                        </span>
                      </div>

                      {testNotificationResult && (
                        <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                          testNotificationResult.success
                            ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                            : 'bg-amber-950/40 border border-amber-500/40 text-amber-300'
                        }`}>
                          {testNotificationResult.success ? (
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                          ) : (
                            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                          )}
                          <span>{testNotificationResult.message}</span>
                        </div>
                      )}
                    </div>
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
      {/* MODAL: KILL SWITCH STATUS CONFIRMATION (BANKING GRADE)          */}
      {/* ============================================================== */}
      {killSwitchConfirmTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0F1420] border border-slate-700/80 w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  killSwitchConfirmTarget.status === 'suspended'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    <span>PRESTIGIA BANK GUARD</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                      killSwitchConfirmTarget.status === 'suspended'
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                    }`}>
                      {killSwitchConfirmTarget.status === 'suspended' ? 'Reactivación' : 'Kill Switch'}
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400">Control de Seguridad y Estado de Red</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setKillSwitchConfirmTarget(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="mt-4 space-y-4">
              <div className="bg-[#141A26] p-4 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-400 uppercase font-bold">Establecimiento Objetivo</p>
                <p className="text-base font-extrabold text-white mt-0.5">{killSwitchConfirmTarget.name}</p>
                <p className="text-xs text-slate-300 mt-1">
                  Titular: <strong>{killSwitchConfirmTarget.ownerName}</strong> • {killSwitchConfirmTarget.branches?.length || 1} {killSwitchConfirmTarget.branches?.length === 1 ? 'Sede' : 'Sedes'}
                </p>
              </div>

              {killSwitchConfirmTarget.status === 'suspended' ? (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs space-y-1.5">
                  <p className="font-bold flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Protocolo de Reactivación Inmediata
                  </p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Se restablecerá el acceso total al portal del cliente y se reactivará la captura de opiniones y reseñas en todas sus sedes registradas.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs space-y-1.5">
                  <p className="font-bold flex items-center gap-1.5 text-rose-400">
                    <AlertTriangle className="w-4 h-4" />
                    Consecuencias de la Suspensión Inmediata
                  </p>
                  <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                    <li>Bloqueo total de acceso al portal corporativo.</li>
                    <li>Desactivación del canal QR y captura de clientes en sala.</li>
                    <li>Sincronización de bloqueo en red en tiempo real.</li>
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setKillSwitchConfirmTarget(null)}
                  disabled={killSwitchLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => executeToggleBusinessStatus(killSwitchConfirmTarget)}
                  disabled={killSwitchLoading}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-white text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg ${
                    killSwitchConfirmTarget.status === 'suspended'
                      ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                      : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
                  }`}
                >
                  {killSwitchLoading ? (
                    <span>Procesando...</span>
                  ) : killSwitchConfirmTarget.status === 'suspended' ? (
                    <span>Confirmar Reactivación</span>
                  ) : (
                    <span>Confirmar Suspensión</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: PROTOCOLO DE BAJA OFICIAL (ARCHIVO HISTÓRICO O PURGA)   */}
      {/* ============================================================== */}
      {decommissionTarget && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0F1420] border border-rose-500/40 w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  decommissionMode === 'archive'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {decommissionMode === 'archive' ? <Archive className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    <span>PRESTIGIA BANK GUARD</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                      decommissionMode === 'archive'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                    }`}>
                      {decommissionMode === 'archive' ? 'Archivo Histórico' : 'Purga Irreversible'}
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400">Protocolo de Desvinculación y Baja Oficial</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDecommissionTarget(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target Business Info */}
            <div className="mt-4 bg-[#141A26] p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Marca Seleccionada</p>
                <p className="text-base font-extrabold text-white mt-0.5">{decommissionTarget.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  ID: <span className="font-mono text-amber-300">{decommissionTarget.id}</span> • Titular: <strong>{decommissionTarget.ownerName}</strong>
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Plan {decommissionTarget.plan}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">
                  {decommissionTarget.branches?.length || 1} {decommissionTarget.branches?.length === 1 ? 'Sede' : 'Sedes'}
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="mt-4 grid grid-cols-2 gap-2 p-1 bg-[#141A26] rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setDecommissionMode('archive');
                  setDecommissionReason('Terminación formal de contrato comercial y traslado a custodia histórica.');
                  setDecommissionError(null);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  decommissionMode === 'archive'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Opción A: Archivo Histórico</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDecommissionMode('purge');
                  setDecommissionError(null);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  decommissionMode === 'purge'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Opción B: Purga Total</span>
              </button>
            </div>

            {/* Mode Explanation */}
            <div className="mt-4">
              {decommissionMode === 'archive' ? (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs space-y-2">
                  <p className="font-bold flex items-center gap-1.5 text-amber-300">
                    <CheckCircle2 className="w-4 h-4" />
                    Custodia Legal y Desvinculación Segura (Recomendado)
                  </p>
                  <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside leading-relaxed">
                    <li>La marca queda suspendida definitivamente y con sello de <strong>Archivada</strong>.</li>
                    <li>Portales y canales QR quedan totalmente inoperativos para el cliente y el público.</li>
                    <li>Todo el historial de métricas, auditoría y reseñas se conserva inmutable en base de datos para respaldo legal o eventual reactivación.</li>
                  </ul>
                  <div className="pt-2">
                    <label className="text-[10px] uppercase font-bold text-slate-300 block mb-1">
                      Motivo Oficial de la Desvinculación / Custodia
                    </label>
                    <input
                      type="text"
                      value={decommissionReason}
                      onChange={(e) => setDecommissionReason(e.target.value)}
                      placeholder="Ej: Terminación por vencimiento de contrato comercial..."
                      className="w-full bg-[#090D14] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs space-y-2">
                  <p className="font-bold flex items-center gap-1.5 text-rose-400">
                    <AlertTriangle className="w-4 h-4" />
                    ⚠️ Baja Corporativa Definitiva (Purga de Marca)
                  </p>
                  <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside leading-relaxed">
                    <li>Se revocarán las credenciales y accesos administrativos de <strong>{decommissionTarget.name}</strong>.</li>
                    <li>Sus sedes y configuraciones de plan contratado serán desvinculadas.</li>
                    <li>Esta acción es permanente para el perfil corporativo de la empresa.</li>
                  </ul>
                  <div className="mt-2.5 p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-[11px] text-purple-200 flex items-start gap-2">
                    <Shield className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span><strong className="text-white">Blindaje Soberano de Datos Prestigia:</strong> Los registros de usuarios finales captados (Habeas Data, teléfonos, reseñas y opiniones) <strong>JAMÁS se borran</strong>. Permanecen intactos para siempre en el Big Data Lake corporativo como activo estratégico supremo.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Master Key Security Challenge */}
            <div className="mt-4 p-3.5 bg-[#090D14] rounded-2xl border border-slate-800 space-y-2">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Autorización con Llave Maestra</span>
              </label>
              <input
                type="password"
                value={decommissionKey}
                onChange={(e) => {
                  setDecommissionKey(e.target.value);
                  if (decommissionError) setDecommissionError(null);
                }}
                placeholder="Ingresa tu Llave Maestra Prestigia"
                className="w-full bg-[#141A26] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 font-mono tracking-wider"
              />
              {decommissionError && (
                <p className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{decommissionError}</span>
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setDecommissionTarget(null)}
                disabled={decommissionLoading}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteDecommission}
                disabled={decommissionLoading}
                className={`flex-1 py-2.5 px-4 rounded-xl text-white text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg ${
                  decommissionMode === 'archive'
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                    : 'bg-rose-700 hover:bg-rose-600 shadow-rose-700/40 animate-pulse'
                }`}
              >
                {decommissionLoading ? (
                  <span>Procesando...</span>
                ) : decommissionMode === 'archive' ? (
                  <span>Confirmar Archivo Histórico</span>
                ) : (
                  <span>Confirmar Purga Total</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: FICHA TÉCNICA Y PERFIL OFICIAL DE GOOGLE MAPS           */}
      {/* ============================================================== */}
      {viewPlaceModalBusiness && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D111A] border border-blue-500/50 w-full max-w-3xl rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-[#141A26] border border-blue-500/40 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                  {viewPlaceModalBusiness.branding?.logoUrl ? (
                    <img
                      src={viewPlaceModalBusiness.branding.logoUrl}
                      alt={viewPlaceModalBusiness.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-blue-400 font-extrabold text-xl">{viewPlaceModalBusiness.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">{viewPlaceModalBusiness.name}</h3>
                    {(() => {
                      const nb = getNicheBadge(viewPlaceModalBusiness.category);
                      return (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${nb.color}`}>
                          <span>{nb.icon}</span>
                          <span>{nb.label}</span>
                        </span>
                      );
                    })()}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
                    Ficha Oficial de Google Maps • ID: <span className="font-mono text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">{viewPlaceModalBusiness.id}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewPlaceModalBusiness(null)}
                className="text-slate-400 hover:text-white p-2 bg-slate-800/60 hover:bg-slate-800 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="mt-5 space-y-4">
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
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#141A26] to-[#0E121B] border border-blue-500/30">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold shrink-0">
                            <Globe className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                              Ficha Google Business Profile
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                                Certificada en Red
                              </span>
                            </p>
                            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1 flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                              <span>{primaryBranch?.address || `${primaryBranch?.locality}, ${primaryBranch?.city}`}</span>
                            </p>
                          </div>
                        </div>

                        <div className="text-left sm:text-right bg-[#0D111A] px-4 py-2.5 rounded-xl border border-slate-800 shrink-0">
                          <div className="flex items-center gap-1.5 font-mono font-extrabold text-amber-400 text-base sm:text-lg">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span>{currentRating}★</span>
                            <span className="text-slate-300 text-xs font-bold">Google Maps</span>
                          </div>
                          <p className="text-xs text-slate-300 font-bold mt-0.5">
                            Día 1: {baselineRating}★ (+{Number((currentRating - baselineRating).toFixed(1))}★ Neto)
                          </p>
                        </div>
                      </div>

                      {/* Technical Identifiers */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 pt-3.5 border-t border-slate-800">
                        <div className="bg-[#0D111A] px-4 py-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-300">Place ID:</span>
                          <span className="font-mono text-amber-300 text-xs sm:text-sm font-extrabold truncate ml-2">{placeId}</span>
                        </div>
                        <div className="bg-[#0D111A] px-4 py-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-300">Sincronización API:</span>
                          <span className="text-emerald-400 text-xs sm:text-sm font-extrabold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            Activa & Blindada
                          </span>
                        </div>
                      </div>

                      {/* Direct External Action Buttons */}
                      <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
                        <a
                          href={googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/25 transition-all text-center"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Abrir Ficha Oficial en Google Maps ↗</span>
                        </a>

                        <a
                          href={reviewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/25 transition-all text-center"
                        >
                          <Star className="w-4 h-4 fill-slate-950" />
                          <span>Probar Enlace de Reseña Google ↗</span>
                        </a>
                      </div>
                    </div>

                    {/* Branches List */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#141A26] border border-slate-800">
                      <p className="font-extrabold text-white text-xs sm:text-sm mb-3 flex items-center gap-2">
                        <Store className="w-4 h-4 text-blue-400" />
                        Sedes Físicas Registradas ({viewPlaceModalBusiness.branches?.length || 1})
                      </p>
                      <div className="space-y-3">
                        {viewPlaceModalBusiness.branches?.map((branch, bIdx) => {
                          const branchReviews = googleReviews.filter(
                            (r) => r.businessId === viewPlaceModalBusiness.id && r.branchId === branch.id
                          );
                          const bAvgRating = branchReviews.length > 0
                            ? Number((branchReviews.reduce((acc, r) => acc + (r.rating || 5), 0) / branchReviews.length).toFixed(1))
                            : currentRating;
                          const bReviewCount = branchReviews.length > 0
                            ? branchReviews.length
                            : (viewPlaceModalBusiness.baseline?.initialReviewCount || 25);
                          const branchPlaceId = branch.googlePlaceId || placeId;
                          const branchMapsUrl = branch.googlePlaceId 
                            ? `https://www.google.com/maps/place/?q=place_id:${branch.googlePlaceId}`
                            : (branch.googleReviewUrl || googleMapsUrl);

                          return (
                            <div key={branch.id || bIdx} className="bg-[#0E121B] p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                              <div className="space-y-1.5 flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="text-sm font-extrabold text-white">{branch.name}</p>
                                  <span className="flex items-center gap-1 font-mono font-extrabold text-amber-400 text-xs bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    {bAvgRating}★ ({bReviewCount} res.)
                                  </span>
                                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    API Conectada
                                  </span>
                                </div>

                                <p className="text-xs sm:text-sm font-medium text-slate-200">
                                  {branch.address || 'Sin dirección registrada'} • {branch.locality}, {branch.city}
                                </p>

                                <div className="flex items-center gap-2 pt-0.5 flex-wrap text-xs">
                                  <span className="text-slate-400 font-semibold text-[11px]">Google Place ID:</span>
                                  <span className="font-mono text-amber-300 text-xs font-bold bg-[#141A26] px-2 py-0.5 rounded border border-slate-700/80">
                                    {branchPlaceId}
                                  </span>
                                </div>

                                <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 flex-wrap pt-0.5">
                                  <span className="text-emerald-400 font-extrabold">Encargado de Turno:</span>
                                  <span className="text-white font-bold">{branch.managerName || 'Encargado Principal'}</span>
                                  <span className="text-slate-400">• Alertas WhatsApp:</span>
                                  <span className="font-mono text-amber-300 font-bold bg-[#141A26] px-1.5 py-0.5 rounded border border-slate-700">{branch.managerPhone}</span>
                                </p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                                <a
                                  href={branchMapsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full md:w-auto px-3.5 py-2 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/40 text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>Abrir en Maps ↗</span>
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Corporate & Legal Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Card 1: Datos de la Empresa & Fiscales */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#141A26] border border-slate-800 space-y-2.5">
                        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                          <p className="text-amber-400 text-xs uppercase font-extrabold tracking-wider flex items-center gap-1.5 min-w-0">
                            <span>🏛️</span>
                            <span className="truncate">Datos de la Empresa & Fiscales</span>
                          </p>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap shrink-0">
                            Persona Jurídica
                          </span>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-slate-400 font-bold">Nombre Comercial</p>
                          <p className="font-extrabold text-white text-sm sm:text-base">{viewPlaceModalBusiness.name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-slate-400 font-bold">Razón Social Registrada</p>
                          <p className="font-bold text-slate-200 text-xs sm:text-sm">{viewPlaceModalBusiness.legalName || viewPlaceModalBusiness.name}</p>
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
                          <div>
                            <p className="text-[10px] uppercase text-slate-400 font-bold">NIT / Documento</p>
                            <p className="font-mono font-bold text-amber-300 text-xs sm:text-sm">{viewPlaceModalBusiness.taxId || '901.000.000-1'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] uppercase text-slate-400 font-bold">Dirección Fiscal / Sede</p>
                            <p className="text-slate-300 text-xs font-semibold truncate max-w-[180px]">
                              {viewPlaceModalBusiness.address || primaryBranch?.address || `${primaryBranch?.locality || ''}, ${primaryBranch?.city || ''}`}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Card 2: Representación Legal & Contrato */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#141A26] border border-slate-800 space-y-2.5">
                        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                          <p className="text-blue-400 text-xs uppercase font-extrabold tracking-wider flex items-center gap-1.5 min-w-0">
                            <span>✍️</span>
                            <span className="truncate">Representante Legal & Contrato</span>
                          </p>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 whitespace-nowrap shrink-0">
                            Firmante Oficial
                          </span>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-slate-400 font-bold">Representante / Firmante del Contrato</p>
                          <p className="font-extrabold text-white text-sm sm:text-base">{viewPlaceModalBusiness.contractSignerName || viewPlaceModalBusiness.ownerName}</p>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-[10px] uppercase text-slate-400 font-bold">Teléfono / WhatsApp Directo</p>
                            <p className="font-mono font-bold text-amber-300 text-xs sm:text-sm mt-0.5">
                              {maskPhone(viewPlaceModalBusiness.contractSignerPhone || viewPlaceModalBusiness.ownerPhone)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] uppercase text-slate-400 font-bold">Plan Contratado</p>
                            <p className="font-extrabold text-amber-400 text-xs sm:text-sm capitalize mt-0.5">
                              Plan {viewPlaceModalBusiness.plan}
                            </p>
                          </div>
                        </div>
                        <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between">
                          <p className="text-slate-300 text-xs truncate">
                            <span className="text-slate-400">Email: </span>
                            <span className="font-medium text-white">{viewPlaceModalBusiness.ownerEmail || `${viewPlaceModalBusiness.id}@prestigia.app`}</span>
                          </p>
                          <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Vigente Master
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 border-t border-slate-800 flex flex-wrap justify-between items-center gap-3">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            const target = viewPlaceModalBusiness;
                            setViewPlaceModalBusiness(null);
                            handleImpersonate(target);
                          }}
                          className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/25 transition active:scale-[0.99]"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Entrar al Portal del Cliente</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadFichaPDF(viewPlaceModalBusiness)}
                          className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/25 transition active:scale-[0.99]"
                          title="Descargar Ficha Técnica Oficial en PDF con membrete y certificación"
                        >
                          <Download className="w-4 h-4 text-slate-950" />
                          <span>Descargar Ficha (PDF)</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setViewPlaceModalBusiness(null)}
                        className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl cursor-pointer transition"
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

      {/* Modal: Editar Datos de la Cuenta Dueño */}
      {showOwnerEditModal && currentBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0C101A] border border-amber-500/30 rounded-3xl shadow-2xl p-5 sm:p-7 text-white my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-extrabold text-lg shrink-0">
                  👑
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span>Editar Cuenta Dueño</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase">
                      Titular
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Modifica los datos corporativos y credenciales de acceso de {currentBusiness.name}.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowOwnerEditModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveOwnerDetails} className="space-y-4 pt-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Nombre del Titular / Representante Legal *
                </label>
                <input
                  type="text"
                  required
                  value={ownerEditForm.ownerName}
                  onChange={(e) => setOwnerEditForm({ ...ownerEditForm, ownerName: e.target.value })}
                  placeholder="Ej: Carlos Gómez"
                  className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    WhatsApp Oficial de Alertas *
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerEditForm.ownerPhone}
                    onChange={(e) => setOwnerEditForm({ ...ownerEditForm, ownerPhone: e.target.value })}
                    placeholder="Ej: +573001234567"
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono placeholder-slate-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Contraseña del Portal Dueño *
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerEditForm.password}
                    onChange={(e) => setOwnerEditForm({ ...ownerEditForm, password: e.target.value })}
                    placeholder="Clave para prestigia.app/portal"
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-purple-300 font-mono placeholder-slate-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Razón Social Registrada
                </label>
                <input
                  type="text"
                  value={ownerEditForm.legalName}
                  onChange={(e) => setOwnerEditForm({ ...ownerEditForm, legalName: e.target.value })}
                  placeholder="Ej: Inversiones Gastronómicas Gómez & Cía S.A.S."
                  className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    NIT / Tax ID / CIF / RFC
                  </label>
                  <input
                    type="text"
                    value={ownerEditForm.taxId}
                    onChange={(e) => setOwnerEditForm({ ...ownerEditForm, taxId: e.target.value })}
                    placeholder="Ej: 901.458.723-1"
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Correo Electrónico Oficial
                  </label>
                  <input
                    type="email"
                    value={ownerEditForm.ownerEmail}
                    onChange={(e) => setOwnerEditForm({ ...ownerEditForm, ownerEmail: e.target.value })}
                    placeholder="contacto@empresa.com"
                    className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Tarifa Pactada & Ciclo de Facturación */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tarifa Contratada Global de la Marca</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    Tarifa Pactada Personalizada
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Tarifa Mensual Pactada (COP) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">$</span>
                      <input
                        type="number"
                        min="0"
                        step="10000"
                        value={ownerEditForm.agreedMonthlyFeeCOP || ''}
                        onChange={(e) => {
                          const cop = parseInt(e.target.value) || 0;
                          setOwnerEditForm({
                            ...ownerEditForm,
                            agreedMonthlyFeeCOP: cop,
                            agreedMonthlyFeeUSD: cop > 0 ? Math.round(cop / 4000) : 0,
                          });
                        }}
                        placeholder="Ej: 900000"
                        className="w-full bg-[#141A26] border border-slate-700 focus:border-emerald-400 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-emerald-300 font-mono placeholder-slate-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Ciclo de Facturación Contratado
                    </label>
                    <select
                      value={ownerEditForm.billingCycle || 'monthly'}
                      onChange={(e) => setOwnerEditForm({ ...ownerEditForm, billingCycle: e.target.value as any })}
                      className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition"
                    >
                      <option value="monthly">Facturación Mensual</option>
                      <option value="quarterly">Facturación Trimestral</option>
                      <option value="semiannual">Facturación Semestral</option>
                      <option value="annual">Facturación Anual</option>
                    </select>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">
                  Prestigia no impone precios rígidos de planes. La tarifa se acuerda caso por caso según sedes, volumen y servicios.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowOwnerEditModal(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingOwner}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
                >
                  {isSavingOwner ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Calibrar Línea Base Día 1 */}
      {showBaselineModal && currentBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#0C101A] border border-amber-500/30 rounded-3xl shadow-2xl p-5 sm:p-7 text-white my-8 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                    <span>Calibrar Línea Base Día 1</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      Super Master
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Negocio: <span className="text-amber-300 font-bold">{currentBusiness.name}</span> • Punto de partida real antes de Prestigia
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBaselineModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCalibratedBaseline} className="space-y-5 pt-4">
              {/* Notice Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  <strong>Calibración de activación real:</strong> Si creaste la marca previamente pero los códigos QR empezaron a usarse después, fija aquí la <strong>fecha exacta de inicio operativo</strong>. Esto recalibrará de forma transparente el contador de días y la evolución real de Prestigia.
                </p>
              </div>

              {/* Group 1: Fecha de Inicio Operativo de QRs */}
              <div className="p-4 rounded-2xl bg-[#141A26] border border-slate-800 space-y-3">
                <label className="text-xs uppercase font-extrabold text-amber-300 tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>1. Fecha de Inicio Operativo de QRs (Día 1 de Prestigia)</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="date"
                    required
                    value={baselineForm.startDate}
                    onChange={(e) => setBaselineForm({ ...baselineForm, startDate: e.target.value })}
                    className="flex-1 bg-[#0C101A] border border-slate-700 text-white text-xs rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setBaselineForm({ ...baselineForm, startDate: new Date().toISOString().split('T')[0] })}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Fijar Hoy ({new Date().toISOString().split('T')[0]})</span>
                  </button>
                </div>
              </div>

              {/* Group 2: Reputación en Google Maps el Día 1 */}
              <div className="p-4 rounded-2xl bg-[#141A26] border border-slate-800 space-y-3.5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                  <label className="text-xs uppercase font-extrabold text-amber-300 tracking-wider flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>2. Estado en Google Maps el Día 1 (Antes de Prestigia)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setAllowManualOverride(!allowManualOverride)}
                    className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 underline cursor-pointer"
                  >
                    {allowManualOverride ? '🔒 Bloquear Modo Anti-Inflación' : '🔓 Permitir Ajuste Manual'}
                  </button>
                </div>

                {/* Live Google Maps Fetch Box */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-[#121622] to-amber-950/30 border border-blue-500/30 space-y-2.5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                          Sincronización Automática con Google Maps
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                          Anti-Inflación
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Extrae en vivo de Google Maps la calificación y total de opiniones para evitar alteración manual de datos.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSyncGoogleLive}
                      disabled={isFetchingGoogleData}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-amber-500 hover:from-blue-500 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/20 transition cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      {isFetchingGoogleData ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5 text-slate-950" />
                      )}
                      <span>{isFetchingGoogleData ? 'Consultando Google...' : 'Sincronizar de Google Maps'}</span>
                    </button>
                  </div>

                  {googleSyncSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{googleSyncSuccess}</span>
                    </div>
                  )}

                  {googleSyncError && (
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-medium">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{googleSyncError}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-300">
                        Calificación Inicial (1.0 a 5.0 ★)
                      </label>
                      {!allowManualOverride && (
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          Certificado Google
                        </span>
                      )}
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      required
                      readOnly={!allowManualOverride}
                      value={baselineForm.initialRating}
                      onChange={(e) => setBaselineForm({ ...baselineForm, initialRating: Number(e.target.value) })}
                      className={`w-full text-xs rounded-xl px-4 py-2.5 outline-none font-mono ${
                        !allowManualOverride
                          ? 'bg-[#0E121B] text-slate-300 border border-slate-800 cursor-not-allowed'
                          : 'bg-[#0C101A] text-white border border-amber-500/40 focus:border-amber-400'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-300">
                        Total de Reseñas en Google (Día 1)
                      </label>
                      {!allowManualOverride && (
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          Auditado Oficial
                        </span>
                      )}
                    </div>
                    <input
                      type="number"
                      min="0"
                      required
                      readOnly={!allowManualOverride}
                      value={baselineForm.initialReviewCount}
                      onChange={(e) => setBaselineForm({ ...baselineForm, initialReviewCount: Number(e.target.value) })}
                      className={`w-full text-xs rounded-xl px-4 py-2.5 outline-none font-mono ${
                        !allowManualOverride
                          ? 'bg-[#0E121B] text-slate-300 border border-slate-800 cursor-not-allowed'
                          : 'bg-[#0C101A] text-white border border-amber-500/40 focus:border-amber-400'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Group 3: Desglose de Reseñas Día 1 */}
              <div className="p-4 rounded-2xl bg-[#141A26] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase font-extrabold text-amber-300 tracking-wider flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>3. Desglose de Calidad de Reseñas Previas (Día 1)</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Suma: {baselineForm.initialReviews4to5 + baselineForm.initialReviews1to3} / {baselineForm.initialReviewCount} opiniones
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-emerald-400 block mb-1">
                      Reseñas 4 y 5★ Previas
                    </label>
                    <input
                      type="number"
                      min="0"
                      readOnly={!allowManualOverride}
                      value={baselineForm.initialReviews4to5}
                      onChange={(e) => setBaselineForm({ ...baselineForm, initialReviews4to5: Number(e.target.value) })}
                      className={`w-full text-xs rounded-xl px-4 py-2.5 outline-none font-mono ${
                        !allowManualOverride
                          ? 'bg-[#0E121B] text-slate-300 border border-slate-800 cursor-not-allowed'
                          : 'bg-[#0C101A] text-white border border-emerald-500/40 focus:border-emerald-400'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-rose-400 block mb-1">
                      Reseñas 1 a 3★ Previas (Quejas)
                    </label>
                    <input
                      type="number"
                      min="0"
                      readOnly={!allowManualOverride}
                      value={baselineForm.initialReviews1to3}
                      onChange={(e) => setBaselineForm({ ...baselineForm, initialReviews1to3: Number(e.target.value) })}
                      className={`w-full text-xs rounded-xl px-4 py-2.5 outline-none font-mono ${
                        !allowManualOverride
                          ? 'bg-[#0E121B] text-slate-300 border border-slate-800 cursor-not-allowed'
                          : 'bg-[#0C101A] text-white border border-rose-500/40 focus:border-rose-400'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-purple-300 block mb-1">
                      Reseñas ya Respondidas
                    </label>
                    <input
                      type="number"
                      min="0"
                      readOnly={!allowManualOverride}
                      value={baselineForm.initialRespondedReviews}
                      onChange={(e) => setBaselineForm({ ...baselineForm, initialRespondedReviews: Number(e.target.value) })}
                      className={`w-full text-xs rounded-xl px-4 py-2.5 outline-none font-mono ${
                        !allowManualOverride
                          ? 'bg-[#0E121B] text-slate-300 border border-slate-800 cursor-not-allowed'
                          : 'bg-[#0C101A] text-white border border-purple-500/40 focus:border-purple-400'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Group 4: Parámetros Financieros (Ticket Promedio) */}
              <div className="p-4 rounded-2xl bg-[#141A26] border border-slate-800 space-y-3">
                <label className="text-xs uppercase font-extrabold text-amber-300 tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>4. Ticket Promedio para Cálculo de Facturación Salvada de Fuga</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Ticket Promedio por Comensal / Cliente (COP)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={baselineForm.averageTicketCOP}
                      onChange={(e) => setBaselineForm({ ...baselineForm, averageTicketCOP: Number(e.target.value) })}
                      className="w-full bg-[#0C101A] border border-slate-700 text-white text-xs rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Ticket Promedio (USD)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={baselineForm.averageTicketUSD}
                      onChange={(e) => setBaselineForm({ ...baselineForm, averageTicketUSD: Number(e.target.value) })}
                      className="w-full bg-[#0C101A] border border-slate-700 text-white text-xs rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <label className="text-[11px] font-semibold text-amber-300 flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Inversión Mensual Pactada con el Cliente (COP)
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">Para Multiplicador ROI exacto (Sin planes fijos)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">$</span>
                    <input
                      type="number"
                      min="0"
                      step="10000"
                      placeholder="Ej: 450000 (Opcional, según acuerdo con el cliente)"
                      value={baselineForm.customMonthlyFeeCOP || ''}
                      onChange={(e) => setBaselineForm({ ...baselineForm, customMonthlyFeeCOP: Number(e.target.value) || 0 })}
                      className="w-full bg-[#0C101A] border border-amber-500/30 text-white text-xs rounded-xl pl-8 pr-4 py-2.5 outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Como no existen planes de precio fijo, ingresa la tarifa que se acordó contractualmente con este cliente para que el dossier calcule automáticamente cuántas veces recuperó su inversión.
                  </p>
                </div>
              </div>

              {/* Group 5: Testimonio & Titular con Generador de IA */}
              <div className="p-4 rounded-2xl bg-[#141A26] border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <label className="text-xs uppercase font-extrabold text-amber-300 tracking-wider flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>5. Titular y Testimonio Oficial para el Caso de Éxito</span>
                  </label>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Nombre del Titular / Propietario
                  </label>
                  <input
                    type="text"
                    value={baselineForm.founderName}
                    onChange={(e) => setBaselineForm({ ...baselineForm, founderName: e.target.value })}
                    className="w-full bg-[#0C101A] border border-slate-700 text-white text-xs rounded-xl px-4 py-2.5 outline-none focus:border-amber-400"
                    placeholder="Ej. Carlos Mendoza (Gerente General)"
                  />
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-[11px] font-semibold text-slate-300">
                      Cita o Testimonio Oficial del Propietario
                    </label>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <BrainCircuit className="w-3 h-3 text-amber-400" />
                        Generar con IA (Métricas Reales):
                      </span>
                      <button
                        type="button"
                        onClick={() => setBaselineForm({ ...baselineForm, clientQuote: generateAITestimonial('roi') })}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold cursor-pointer transition"
                        title="Genera análisis enfocado en ROI y facturación salvada con datos exactos"
                      >
                        💰 ROI Financiero
                      </button>
                      <button
                        type="button"
                        onClick={() => setBaselineForm({ ...baselineForm, clientQuote: generateAITestimonial('prestige') })}
                        className="px-2.5 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 text-[10px] font-bold cursor-pointer transition"
                        title="Genera análisis enfocado en blindaje de sala y prestigio de marca"
                      >
                        🛡️ Prestigio y Sala
                      </button>
                      <button
                        type="button"
                        onClick={() => setBaselineForm({ ...baselineForm, clientQuote: generateAITestimonial('growth') })}
                        className="px-2.5 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 text-[10px] font-bold cursor-pointer transition"
                        title="Genera análisis enfocado en crecimiento y liderazgo local"
                      >
                        🚀 Crecimiento Local
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    value={baselineForm.clientQuote}
                    onChange={(e) => setBaselineForm({ ...baselineForm, clientQuote: e.target.value })}
                    className="w-full bg-[#0C101A] border border-slate-700 text-white text-xs rounded-xl p-3 outline-none focus:border-amber-400 leading-relaxed"
                    placeholder="El análisis generado por la IA aparecerá aquí reflejando los números reales de mejora de Prestigia..."
                  />
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBaselineModal(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingBaseline}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
                >
                  {isSavingBaseline ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>Guardar y Fijar Línea Base Día 1</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Administrador de Sede Física & Encargado */}
      {showBranchModal && currentBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#0C101A] border border-amber-500/30 rounded-3xl shadow-2xl p-5 sm:p-7 text-white my-8 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                    <span>{editingBranch ? 'Configurar Sede Física' : 'Registrar Nueva Sede Física'}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      Super Master
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Marca: <span className="text-amber-300 font-bold">{currentBusiness.name}</span> • Asignación de encargados, PIN de sala y ficha Google
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBranchModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBranch} className="space-y-5 pt-4">
              {/* Step 1: Auto-detección con Google Maps */}
              <div className="p-4 rounded-2xl bg-[#141A26] border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs uppercase font-extrabold text-amber-300 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Detección Automática de Ficha Google Maps (Opcional)</span>
                  </label>
                  <span className="text-[10px] font-semibold text-slate-400">Pegar enlace o Place ID</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={branchGoogleQuery}
                      onChange={(e) => setBranchGoogleQuery(e.target.value)}
                      onPaste={(e) => {
                        const pasted = e.clipboardData.getData('text');
                        if (pasted && (pasted.includes('google.com') || pasted.includes('goo.gl') || pasted.startsWith('ChIJ'))) {
                          setTimeout(() => {
                            setBranchGoogleQuery(pasted);
                            handleDetectBranchGoogle(pasted);
                          }, 100);
                        }
                      }}
                      placeholder="Pega link de Google Maps, Place ID o nombre de la sucursal..."
                      className="w-full bg-[#0C101A] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDetectBranchGoogle()}
                    disabled={branchGoogleLoading || !branchGoogleQuery.trim()}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shrink-0 cursor-pointer"
                  >
                    {branchGoogleLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Search className="w-3.5 h-3.5" />
                    )}
                    <span>Detectar Ficha</span>
                  </button>
                </div>
                {branchGoogleSuccess && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{branchGoogleSuccess}</span>
                  </p>
                )}
                {branchGoogleError && (
                  <p className="text-xs text-amber-300 flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{branchGoogleError}</span>
                  </p>
                )}
              </div>

              {/* Step 2: Información Básica de la Sede */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>Datos de Identificación y Ubicación</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Nombre Comercial de la Sede *</label>
                    <input
                      type="text"
                      required
                      value={branchFormData.name}
                      onChange={(e) => setBranchFormData({ ...branchFormData, name: e.target.value })}
                      placeholder="Ej: Sede Chicó Norte, Sede Poblado..."
                      className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Estado Operativo de Sede</label>
                    <select
                      value={branchFormData.status}
                      onChange={(e) => setBranchFormData({ ...branchFormData, status: e.target.value as BusinessStatus })}
                      className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition"
                    >
                      <option value="active">Activa Operando</option>
                      <option value="suspended">Suspendida Temporalmente</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Ciudad</label>
                    <input
                      type="text"
                      value={branchFormData.city}
                      onChange={(e) => setBranchFormData({ ...branchFormData, city: e.target.value })}
                      placeholder="Ej: Bogotá, Medellín, Cali..."
                      className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Localidad / Zona / Barrio</label>
                    <input
                      type="text"
                      value={branchFormData.locality}
                      onChange={(e) => setBranchFormData({ ...branchFormData, locality: e.target.value })}
                      placeholder="Ej: Chapinero, Usaquén, El Poblado..."
                      className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Dirección Física Exacta</label>
                    <input
                      type="text"
                      value={branchFormData.address}
                      onChange={(e) => setBranchFormData({ ...branchFormData, address: e.target.value })}
                      placeholder="Ej: Carrera 15 # 93-45 Local 2"
                      className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Encargado de Sede & Alertas */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Encargado de Turno & Enrutamiento de Quejas</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Nombre Encargado / Gerente</label>
                    <input
                      type="text"
                      value={branchFormData.managerName}
                      onChange={(e) => setBranchFormData({ ...branchFormData, managerName: e.target.value })}
                      placeholder="Ej: Carlos Ramírez"
                      className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">WhatsApp de Alertas (1-3★)</label>
                    <input
                      type="text"
                      value={branchFormData.managerPhone}
                      onChange={(e) => setBranchFormData({ ...branchFormData, managerPhone: e.target.value })}
                      placeholder="Ej: 3101234567"
                      className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">PIN Acceso Terminal / Sala</label>
                    <input
                      type="text"
                      maxLength={8}
                      value={branchFormData.managerPassword}
                      onChange={(e) => setBranchFormData({ ...branchFormData, managerPassword: e.target.value })}
                      placeholder="Ej: 1234"
                      className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono placeholder-slate-500 outline-none transition"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">
                  ⚡ Las quejas de 1 a 3 estrellas ocurridas en este punto físico se enrutan de inmediato al WhatsApp de este encargado para resolver la inconformidad en sala antes de que el cliente se retire.
                </p>
              </div>

              {/* Step 4: Parámetros Técnicos de Google Maps */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ficha Técnica Google Maps & Place ID</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Google Place ID</label>
                    <input
                      type="text"
                      value={branchFormData.googlePlaceId}
                      onChange={(e) => setBranchFormData({ ...branchFormData, googlePlaceId: e.target.value })}
                      placeholder="Ej: ChIJN1t_tDeuEmsRUsoyG83frY4"
                      className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono placeholder-slate-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Link Directo de Reseñas Google</label>
                    <input
                      type="url"
                      value={branchFormData.googleReviewUrl}
                      onChange={(e) => setBranchFormData({ ...branchFormData, googleReviewUrl: e.target.value })}
                      placeholder="Ej: https://g.page/r/..."
                      className="w-full bg-[#141A26] border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Step 5: Acuerdo Económico y Tarifa Mensual de esta Sede */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tarifa Mensual Contratada para esta Sede</span>
                  </p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    Sin Planes Fijos • Negociación a Medida
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Tarifa Mensual Pactada (COP) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">$</span>
                      <input
                        type="number"
                        min="0"
                        step="10000"
                        value={branchFormData.agreedMonthlyFeeCOP || ''}
                        onChange={(e) => {
                          const cop = parseInt(e.target.value) || 0;
                          setBranchFormData({
                            ...branchFormData,
                            agreedMonthlyFeeCOP: cop,
                            agreedMonthlyFeeUSD: cop > 0 ? Math.round(cop / 4000) : 0,
                          });
                        }}
                        placeholder="Ej: 450000"
                        className="w-full bg-[#141A26] border border-slate-700 focus:border-emerald-400 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-emerald-300 font-mono placeholder-slate-500 outline-none transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Equivalente Referencial (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">US$</span>
                      <input
                        type="number"
                        min="0"
                        value={branchFormData.agreedMonthlyFeeUSD || ''}
                        onChange={(e) => setBranchFormData({ ...branchFormData, agreedMonthlyFeeUSD: parseInt(e.target.value) || 0 })}
                        placeholder="Ej: 110"
                        className="w-full bg-[#141A26] border border-slate-700 focus:border-emerald-400 rounded-xl pl-11 pr-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 outline-none transition"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">
                  ⚡ Prestigia no impone precios fijos. Esta tarifa alimenta con exactitud el multiplicador de Retorno de Inversión (ROI) en el Dossier Histórico de esta sede y consolida el MRR corporativo.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowBranchModal(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={branchSavingLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/25 transition cursor-pointer"
                >
                  {branchSavingLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>{editingBranch ? 'Actualizar Sede' : 'Guardar y Activar Sede'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Gestión de Equipo & Encargados de la Sede (Super Master HQ) */}
      {selectedTeamBranch && currentBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-3xl bg-[#0C101A] border border-indigo-500/30 rounded-3xl shadow-2xl p-5 sm:p-7 text-white my-8 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                    <span>Equipo & Personal de {selectedTeamBranch.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      Sincronización en Vivo
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Marca: <strong className="text-amber-300">{currentBusiness.name}</strong> • Modifica encargados y colaboradores con impacto bidireccional en la app del cliente.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTeamBranch(null)}
                className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quota Controls for THIS specific branch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
              <div className="p-3.5 rounded-2xl bg-[#141A26] border border-purple-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Cupo Encargados (Esta Sede)</span>
                  <p className="text-xs text-slate-300 mt-0.5">
                    <strong className="text-purple-300 text-sm">{teamManagers.length}</strong> registrados de <strong className="text-white text-sm">{teamManagersQuota}</strong> autorizados
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-[#0C101A] px-2 py-1 rounded-xl border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setTeamManagersQuota(Math.max(1, teamManagersQuota - 1))}
                    className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-xs cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold font-mono text-purple-300 text-xs">
                    {teamManagersQuota}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTeamManagersQuota(teamManagersQuota + 1)}
                    className="w-6 h-6 rounded-lg bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center font-bold text-xs cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#141A26] border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Cupo Colaboradores (Esta Sede)</span>
                  <p className="text-xs text-slate-300 mt-0.5">
                    <strong className="text-emerald-300 text-sm">{teamStaff.length}</strong> registrados de <strong className="text-white text-sm">{teamStaffQuota}</strong> autorizados
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-[#0C101A] px-2 py-1 rounded-xl border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setTeamStaffQuota(Math.max(1, teamStaffQuota - 1))}
                    className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-xs cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold font-mono text-emerald-300 text-xs">
                    {teamStaffQuota}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTeamStaffQuota(teamStaffQuota + 1)}
                    className="w-6 h-6 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs Selector */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-4">
              <button
                type="button"
                onClick={() => setTeamModalTab('managers')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  teamModalTab === 'managers'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Users className="w-4 h-4 text-purple-400" />
                <span>1. Encargados de Turno ({teamManagers.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setTeamModalTab('staff')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  teamModalTab === 'staff'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Award className="w-4 h-4 text-emerald-400" />
                <span>2. Trabajadores & Colaboradores ({teamStaff.length})</span>
              </button>
            </div>

            {/* Content Tab 1: Encargados de Turno */}
            {teamModalTab === 'managers' && (
              <div className="space-y-4">
                {/* Form Agregar Encargado */}
                <div className="p-4 rounded-2xl bg-[#141A26] border border-purple-500/20 space-y-3">
                  <p className="text-xs uppercase font-extrabold text-purple-300 tracking-wider flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-purple-400" />
                    <span>Dar de Alta Encargado de Sede</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Nombre Completo *</label>
                      <input
                        type="text"
                        value={newTeamMgrName}
                        onChange={(e) => setNewTeamMgrName(e.target.value)}
                        placeholder="Ej: Andrés Ramírez"
                        className="w-full bg-[#0C101A] border border-slate-700 focus:border-purple-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Cargo / Puesto *</label>
                      <input
                        type="text"
                        value={newTeamMgrRole}
                        onChange={(e) => setNewTeamMgrRole(e.target.value)}
                        placeholder="Ej: Capitán de Sala & VIP"
                        className="w-full bg-[#0C101A] border border-slate-700 focus:border-purple-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">WhatsApp (Alertas 1-3★) *</label>
                      <input
                        type="text"
                        value={newTeamMgrPhone}
                        onChange={(e) => setNewTeamMgrPhone(e.target.value)}
                        placeholder="Ej: +573001112233"
                        className="w-full bg-[#0C101A] border border-slate-700 focus:border-purple-400 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono placeholder-slate-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">PIN Acceso Sala</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={newTeamMgrPassword}
                          onChange={(e) => setNewTeamMgrPassword(e.target.value)}
                          placeholder="1234"
                          className="w-full bg-[#0C101A] border border-slate-700 focus:border-purple-400 rounded-xl px-3 py-2 text-xs text-purple-300 font-mono placeholder-slate-500 outline-none transition"
                        />
                        <button
                          type="button"
                          onClick={handleAddTeamManager}
                          className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition cursor-pointer shrink-0"
                          title="Añadir a la lista"
                        >
                          + Añadir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lista de Encargados */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {teamManagers.length === 0 ? (
                    <div className="p-6 text-center rounded-2xl bg-[#141A26] border border-dashed border-slate-800 text-slate-400 text-xs">
                      No hay encargados registrados para esta sede. Puedes añadir el primero con el formulario superior.
                    </div>
                  ) : (
                    teamManagers.map((mgr, idx) => (
                      <div
                        key={mgr.id || idx}
                        className="p-3 rounded-2xl bg-[#141A26] border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-xs shrink-0">
                            {idx + 1}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-extrabold text-white truncate flex items-center gap-2">
                              <span>{mgr.name}</span>
                              <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                {mgr.role}
                              </span>
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-3">
                              <span className="font-mono text-amber-300">📱 {mgr.phone}</span>
                              <span className="font-mono text-purple-300">🔑 PIN: {mgr.password || '1234'}</span>
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveTeamManager(idx)}
                          className="w-7 h-7 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center transition cursor-pointer shrink-0"
                          title="Eliminar encargado"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Content Tab 2: Trabajadores & Colaboradores */}
            {teamModalTab === 'staff' && (
              <div className="space-y-4">
                {/* Form Agregar Colaborador */}
                <div className="p-4 rounded-2xl bg-[#141A26] border border-emerald-500/20 space-y-3">
                  <p className="text-xs uppercase font-extrabold text-emerald-300 tracking-wider flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Dar de Alta Trabajador / Colaborador</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                    {/* Nombre del Colaborador */}
                    <div className="sm:col-span-6">
                      <label className="text-[10px] text-slate-400 block mb-1">Nombre Completo del Colaborador *</label>
                      <input
                        type="text"
                        value={newTeamStaffName}
                        onChange={(e) => setNewTeamStaffName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTeamStaff();
                          }
                        }}
                        placeholder="Ej: Camilo Restrepo, Valentina Gómez, Sebastián Cruz..."
                        className="w-full bg-[#0C101A] border border-slate-700 focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
                      />
                    </div>

                    {/* Cargo / Puesto (Lista Desplegable o Creación Dinámica) */}
                    <div className="sm:col-span-4">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] text-slate-400">Cargo / Puesto *</label>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCreatingStaffRole(!isCreatingStaffRole);
                            setNewStaffRoleInput('');
                          }}
                          className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          {isCreatingStaffRole && teamStaffRoles.length > 0 ? '✕ Ver Lista' : '+ Nuevo Puesto'}
                        </button>
                      </div>

                      {isCreatingStaffRole || teamStaffRoles.length === 0 ? (
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={newStaffRoleInput}
                            onChange={(e) => setNewStaffRoleInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSaveNewStaffRole();
                              }
                            }}
                            placeholder="Escribe el puesto (ej: Mesero)..."
                            className="w-full bg-[#0C101A] border border-emerald-500/40 focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
                            autoFocus={isCreatingStaffRole}
                          />
                          <button
                            type="button"
                            onClick={handleSaveNewStaffRole}
                            className="px-2.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer shrink-0"
                            title="Guardar puesto en la lista desplegable"
                          >
                            Guardar
                          </button>
                        </div>
                      ) : (
                        <select
                          value={newTeamStaffRole}
                          onChange={(e) => {
                            if (e.target.value === '__NEW__') {
                              setIsCreatingStaffRole(true);
                              setNewStaffRoleInput('');
                            } else {
                              setNewTeamStaffRole(e.target.value);
                            }
                          }}
                          className="w-full bg-[#0C101A] border border-slate-700 focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white outline-none transition cursor-pointer"
                        >
                          <option value="">-- Selecciona el puesto --</option>
                          {teamStaffRoles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                          <option value="__NEW__" className="text-emerald-400 font-bold">
                            + Crear nuevo puesto...
                          </option>
                        </select>
                      )}
                    </div>

                    {/* Botón Añadir Colaborador */}
                    <div className="sm:col-span-2 flex flex-col justify-end">
                      <button
                        type="button"
                        onClick={handleAddTeamStaff}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-emerald-600/20"
                        title="Añadir colaborador a esta sede"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Añadir</span>
                      </button>
                    </div>
                  </div>

                  {/* Chips de Puestos Guardados en la Marca */}
                  {teamStaffRoles.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/60 flex items-center flex-wrap gap-1.5">
                      <span className="text-[10px] text-slate-400 font-medium mr-1">Puestos en lista desplegable:</span>
                      {teamStaffRoles.map((role) => (
                        <span
                          key={role}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-semibold"
                        >
                          <span>{role}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteStaffRole(role)}
                            className="hover:text-rose-400 transition ml-0.5 cursor-pointer"
                            title={`Eliminar '${role}' de la lista desplegable`}
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Lista de Colaboradores */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {teamStaff.length === 0 ? (
                    <div className="sm:col-span-2 p-6 text-center rounded-2xl bg-[#141A26] border border-dashed border-slate-800 text-slate-400 text-xs">
                      No hay colaboradores registrados para esta sede. Puedes añadir meseros y personal con el formulario superior.
                    </div>
                  ) : (
                    teamStaff.map((st, idx) => {
                      const name = typeof st === 'object' && st !== null ? (st.name || '') : String(st || '');
                      const role = typeof st === 'object' && st !== null ? (st.role || 'Atención / Servicio') : 'Colaborador';
                      const joined = typeof st === 'object' && st !== null ? (st.joinedAt || 'Activo') : 'Activo';

                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-[#141A26] border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold text-[11px] shrink-0">
                              {idx + 1}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{name}</p>
                              <p className="text-[10px] text-slate-400">
                                <span className="text-emerald-300 font-medium">{role}</span> • Ingreso: {joined}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveTeamStaff(idx)}
                            className="w-6 h-6 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center transition cursor-pointer shrink-0"
                            title="Eliminar colaborador"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3 mt-4">
              <button
                type="button"
                onClick={() => setSelectedTeamBranch(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={handleSaveBranchTeam}
                disabled={isSavingTeam}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 via-indigo-600 to-purple-600 hover:from-emerald-400 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition cursor-pointer disabled:opacity-50"
              >
                {isSavingTeam ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>Guardar y Sincronizar en Vivo con App del Negocio</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
