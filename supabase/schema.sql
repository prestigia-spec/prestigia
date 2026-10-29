-- =========================================================================
-- PRESTIGIA 2026 - ESQUEMA EMPRESARIAL DE BASE DE DATOS (POSTGRESQL / SUPABASE)
-- =========================================================================

-- Habilitar extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA: EMPRESAS (Marcas y Clientes Corporativos)
CREATE TABLE IF NOT EXISTS businesses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  legal_name TEXT,
  tax_id TEXT,
  address TEXT,
  owner_name TEXT NOT NULL,
  owner_phone TEXT NOT NULL,
  owner_email TEXT,
  contract_signer_name TEXT,
  contract_signer_phone TEXT,
  plan TEXT NOT NULL DEFAULT 'pro',
  status TEXT NOT NULL DEFAULT 'active',
  category TEXT NOT NULL,
  country TEXT DEFAULT 'Colombia',
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  password TEXT,
  support_tickets_quota INTEGER DEFAULT 2,
  support_tickets_used INTEGER DEFAULT 0,
  agreed_monthly_fee_cop NUMERIC(15, 2) DEFAULT 0,
  agreed_monthly_fee_usd NUMERIC(15, 2) DEFAULT 0,
  billing_cycle TEXT DEFAULT 'monthly',
  billing_day INTEGER DEFAULT 5,
  branding JSONB DEFAULT '{}'::jsonb,
  baseline JSONB DEFAULT '{}'::jsonb,
  master_add_ons JSONB DEFAULT '{}'::jsonb,
  custom_staff_roles JSONB DEFAULT '[]'::jsonb
);

-- 2. TABLA: SEDES (Puntos Físicos Operativos con QR)
CREATE TABLE IF NOT EXISTS branches (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  locality TEXT NOT NULL,
  google_review_url TEXT NOT NULL,
  google_place_id TEXT,
  google_business_status TEXT DEFAULT 'pending',
  google_managed_by TEXT DEFAULT 'prestigia_central',
  google_audited_at TIMESTAMPTZ,
  google_audit_notes TEXT,
  google_self_service_enabled BOOLEAN DEFAULT FALSE,
  manager_phone TEXT NOT NULL,
  manager_password TEXT,
  manager_username TEXT,
  manager_name TEXT,
  manager_role TEXT DEFAULT 'Gerente de Sede',
  manager_email TEXT,
  staff_quota INTEGER DEFAULT 10,
  managers_quota INTEGER DEFAULT 2,
  managers JSONB DEFAULT '[]'::jsonb,
  schedule JSONB DEFAULT '{}'::jsonb,
  response_time_sla TEXT DEFAULT '< 15 min',
  containment_message TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  website_url TEXT,
  instagram_url TEXT,
  tiktok_url TEXT,
  facebook_url TEXT,
  whatsapp_vip_url TEXT,
  menu_url TEXT,
  timezone TEXT DEFAULT 'America/Bogota',
  last_audit_update TIMESTAMPTZ,
  agreed_monthly_fee_cop NUMERIC(15, 2) DEFAULT 0,
  agreed_monthly_fee_usd NUMERIC(15, 2) DEFAULT 0
);

-- 3. TABLA: COLABORADORES Y PERSONAL
CREATE TABLE IF NOT EXISTS staff_members (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  branch_id TEXT REFERENCES branches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

-- 4. TABLA: OPINIONES Y QUEJAS PRIVADAS (El Escudo QR)
CREATE TABLE IF NOT EXISTS feedbacks (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  branch_id TEXT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  branch_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  complaint_reason TEXT,
  attended_by TEXT,
  club_consent BOOLEAN DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  resolved_by_role TEXT,
  rescue_message TEXT,
  category TEXT NOT NULL,
  country TEXT DEFAULT 'Colombia',
  city TEXT NOT NULL,
  locality TEXT NOT NULL
);

-- 5. TABLA: CAMPAÑAS Y SORTEOS (Fidelización)
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  branch_id TEXT DEFAULT 'all',
  campaign_code TEXT,
  campaign_type TEXT DEFAULT 'general',
  duration TEXT DEFAULT '30_days',
  title TEXT NOT NULL,
  reward TEXT NOT NULL,
  winners_count INTEGER DEFAULT 1,
  active BOOLEAN DEFAULT TRUE,
  draw_date TIMESTAMPTZ,
  terms TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLA: CLIENTES SORTEOS & BIG DATA (Habeas Data Ley 1581)
CREATE TABLE IF NOT EXISTS campaign_participants (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  business_name TEXT,
  country TEXT DEFAULT 'Colombia',
  city TEXT,
  locality TEXT,
  niche_category TEXT,
  branch_id TEXT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  branch_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  customer_comment TEXT,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  attended_by TEXT,
  is_winner BOOLEAN DEFAULT FALSE,
  winner_notified_at TIMESTAMPTZ,
  prize_won TEXT,
  prize_claimed BOOLEAN DEFAULT FALSE,
  claimed_at TIMESTAMPTZ
);

-- 7. TABLA: PROSPECTOS COMERCIALES (Leads Landing Page)
CREATE TABLE IF NOT EXISTS commercial_leads (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  category TEXT,
  city TEXT NOT NULL,
  country TEXT DEFAULT 'Colombia',
  phone TEXT NOT NULL,
  email TEXT,
  branch_count INTEGER DEFAULT 1,
  preferred_time TEXT,
  primary_goal TEXT,
  status TEXT DEFAULT 'new',
  ip TEXT,
  device TEXT,
  notes TEXT
);

-- 8. TABLA: BITÁCORA DE INCIDENTES EN SEDE
CREATE TABLE IF NOT EXISTS shift_incidents (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  branch_id TEXT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  branch_name TEXT NOT NULL,
  manager_name TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  severity TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  corrective_action TEXT,
  status TEXT DEFAULT 'open'
);

-- 9. TABLA: TELEMETRÍA DE SESIONES Y DISPOSITIVOS
CREATE TABLE IF NOT EXISTS device_sessions (
  device_id TEXT PRIMARY KEY,
  device_name TEXT NOT NULL,
  device_type TEXT NOT NULL,
  os TEXT,
  browser TEXT,
  ip TEXT,
  business_id TEXT NOT NULL,
  branch_id TEXT,
  branch_name TEXT,
  user_role TEXT NOT NULL,
  username TEXT NOT NULL,
  first_seen TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  is_displaced BOOLEAN DEFAULT FALSE,
  is_blocked BOOLEAN DEFAULT FALSE
);

-- 10. TABLA: TRÁFICO WEB EN VIVO (Visitas a la Landing)
CREATE TABLE IF NOT EXISTS traffic_visits (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  ip TEXT NOT NULL,
  country TEXT,
  country_code TEXT,
  city TEXT,
  region TEXT,
  device_type TEXT,
  device_brand TEXT,
  os TEXT,
  browser TEXT,
  path TEXT,
  referrer TEXT,
  action TEXT
);

-- 11. TABLA: SEGURIDAD MASTER & CONFIGURACIÓN GLOBAL
CREATE TABLE IF NOT EXISTS master_security (
  id TEXT PRIMARY KEY DEFAULT 'master_singleton',
  emergency_phone TEXT DEFAULT '+57 305 831 4049',
  emergency_email TEXT DEFAULT 'info@prestigia.app',
  totp_secret TEXT DEFAULT 'JBSWY3DPEHPK3PXP',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ÍNDICES PARA ALTO RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_branches_business_id ON branches(business_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_business_id ON feedbacks(business_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_branch_id ON feedbacks(branch_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_participants_phone ON campaign_participants(customer_phone);
CREATE INDEX IF NOT EXISTS idx_participants_business ON campaign_participants(business_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON commercial_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_traffic_timestamp ON traffic_visits(timestamp DESC);

-- HABILITAR RLS (Row Level Security) O PERMITIR ACCESO CON SERVICE ROLE
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE commercial_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_security ENABLE ROW LEVEL SECURITY;

-- Políticas universales para Service Role (acceso total backend) y lectura anónima controlada
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_role_all_businesses') THEN
    CREATE POLICY service_role_all_businesses ON businesses FOR ALL TO service_role USING (true) WITH CHECK (true);
    CREATE POLICY service_role_all_branches ON branches FOR ALL TO service_role USING (true) WITH CHECK (true);
    CREATE POLICY service_role_all_staff ON staff_members FOR ALL TO service_role USING (true) WITH CHECK (true);
    CREATE POLICY service_role_all_feedbacks ON feedbacks FOR ALL TO service_role USING (true) WITH CHECK (true);
    CREATE POLICY service_role_all_campaigns ON campaigns FOR ALL TO service_role USING (true) WITH CHECK (true);
    CREATE POLICY service_role_all_participants ON campaign_participants FOR ALL TO service_role USING (true) WITH CHECK (true);
    CREATE POLICY service_role_all_leads ON commercial_leads FOR ALL TO service_role USING (true) WITH CHECK (true);
    CREATE POLICY service_role_all_incidents ON shift_incidents FOR ALL TO service_role USING (true) WITH CHECK (true);
    CREATE POLICY service_role_all_sessions ON device_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);
    CREATE POLICY service_role_all_traffic ON traffic_visits FOR ALL TO service_role USING (true) WITH CHECK (true);
    CREATE POLICY service_role_all_master ON master_security FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;
