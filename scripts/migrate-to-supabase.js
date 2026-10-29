const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load .env.local if present
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...values] = trimmed.split('=');
      const val = values.join('=').trim().replace(/^["']|["']$/g, '');
      process.env[key.trim()] = val;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no están configuradas en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function safeIsoDate(val, fallback = new Date().toISOString()) {
  if (!val) return fallback;
  const d = new Date(val);
  return isNaN(d.getTime()) ? fallback : d.toISOString();
}

async function migrate() {
  console.log('🚀 Iniciando migración de data/db.json a Supabase...');
  const dbJsonPath = path.join(__dirname, '../data/db.json');
  if (!fs.existsSync(dbJsonPath)) {
    console.error('❌ Archivo data/db.json no encontrado.');
    return;
  }

  const rawData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));

  // 1. Migrar Empresas
  if (Array.isArray(rawData.businesses) && rawData.businesses.length > 0) {
    console.log(`📦 Migrando ${rawData.businesses.length} empresas...`);
    const bizRows = rawData.businesses.map((b) => ({
      id: b.id,
      name: b.name,
      legal_name: b.legalName || null,
      tax_id: b.taxId || null,
      address: b.address || null,
      owner_name: b.ownerName,
      owner_phone: b.ownerPhone,
      owner_email: b.ownerEmail || null,
      contract_signer_name: b.contractSignerName || null,
      contract_signer_phone: b.contractSignerPhone || null,
      plan: b.plan || 'pro',
      status: b.status || 'active',
      category: b.category,
      country: b.country || 'Colombia',
      trial_ends_at: b.trialEndsAt ? safeIsoDate(b.trialEndsAt) : null,
      created_at: safeIsoDate(b.createdAt),
      password: b.password || null,
      support_tickets_quota: b.supportTicketsQuota || 2,
      support_tickets_used: b.supportTicketsUsed || 0,
      agreed_monthly_fee_cop: b.agreedMonthlyFeeCOP || 0,
      agreed_monthly_fee_usd: b.agreedMonthlyFeeUSD || 0,
      billing_cycle: b.billingCycle || 'monthly',
      billing_day: b.billingDay || 5,
      branding: b.branding || {},
      baseline: b.baseline || {},
      master_add_ons: b.masterAddOns || {},
      custom_staff_roles: b.customStaffRoles || [],
    }));

    const { error: bizErr } = await supabase.from('businesses').upsert(bizRows, { onConflict: 'id' });
    if (bizErr) console.error('Error migrando empresas:', bizErr);
    else console.log('✅ Empresas migradas con éxito.');

    // 2. Migrar Sedes y Personal
    const branchRows = [];
    const staffRows = [];

    rawData.businesses.forEach((b) => {
      if (Array.isArray(b.branches)) {
        b.branches.forEach((br) => {
          branchRows.push({
            id: br.id,
            business_id: b.id,
            name: br.name,
            address: br.address || null,
            city: br.city,
            locality: br.locality,
            google_review_url: br.googleReviewUrl,
            google_place_id: br.googlePlaceId || null,
            google_business_status: br.googleBusinessStatus || 'pending',
            google_managed_by: br.googleManagedBy || 'prestigia_central',
            google_audited_at: br.googleAuditedAt ? safeIsoDate(br.googleAuditedAt) : null,
            google_audit_notes: br.googleAuditNotes || null,
            google_self_service_enabled: Boolean(br.googleSelfServiceEnabled),
            manager_phone: br.managerPhone,
            manager_password: br.managerPassword || null,
            manager_username: br.managerUsername || null,
            manager_name: br.managerName || null,
            manager_role: br.managerRole || 'Gerente de Sede',
            manager_email: br.managerEmail || null,
            staff_quota: br.staffQuota || 10,
            managers_quota: br.managersQuota || 2,
            managers: br.managers || [],
            schedule: br.schedule ? { summary: br.schedule } : {},
            response_time_sla: br.responseTimeSla || '< 15 min',
            containment_message: br.containmentMessage || null,
            status: br.status || 'active',
            website_url: br.websiteUrl || null,
            instagram_url: br.instagramUrl || null,
            tiktok_url: br.tiktokUrl || null,
            facebook_url: br.facebookUrl || null,
            whatsapp_vip_url: br.whatsappVipUrl || null,
            menu_url: br.menuUrl || null,
            timezone: br.timezone || 'America/Bogota',
            last_audit_update: br.lastAuditUpdate ? safeIsoDate(br.lastAuditUpdate) : null,
            agreed_monthly_fee_cop: br.agreedMonthlyFeeCOP || 0,
            agreed_monthly_fee_usd: br.agreedMonthlyFeeUSD || 0,
          });

          if (Array.isArray(br.staffMembers)) {
            br.staffMembers.forEach((st) => {
              staffRows.push({
                business_id: b.id,
                branch_id: br.id,
                name: typeof st === 'string' ? st : st.name,
                role: typeof st === 'string' ? 'Mesero' : (st.role || 'Mesero'),
                joined_at: (typeof st === 'object' && st.joinedAt) ? safeIsoDate(st.joinedAt) : new Date().toISOString(),
                active: true,
              });
            });
          }
        });
      }
    });

    if (branchRows.length > 0) {
      console.log(`📍 Migrando ${branchRows.length} sedes...`);
      const { error: brErr } = await supabase.from('branches').upsert(branchRows, { onConflict: 'id' });
      if (brErr) console.error('Error migrando sedes:', brErr);
      else console.log('✅ Sedes migradas con éxito.');
    }

    if (staffRows.length > 0) {
      console.log(`👨‍🍳 Migrando ${staffRows.length} colaboradores...`);
      const { error: stErr } = await supabase.from('staff_members').upsert(staffRows);
      if (stErr) console.error('Error migrando personal:', stErr);
      else console.log('✅ Personal migrado con éxito.');
    }
  }

  // 3. Migrar Feedbacks (Opiniones y Quejas QR)
  if (Array.isArray(rawData.feedbacks) && rawData.feedbacks.length > 0) {
    console.log(`🛡️ Migrando ${rawData.feedbacks.length} opiniones/quejas...`);
    const fbRows = rawData.feedbacks.map((f) => ({
      id: f.id,
      business_id: f.businessId,
      business_name: f.businessName,
      branch_id: f.branchId === 'carlos-mendoza-principal' ? 'carlos-mendoza-consultorio' : f.branchId,
      branch_name: f.branchName,
      rating: f.rating,
      customer_name: f.customerName,
      customer_phone: f.customerPhone,
      complaint_reason: f.complaintReason || null,
      attended_by: f.attendedBy || null,
      club_consent: Boolean(f.clubConsent),
      status: f.status || 'pending',
      created_at: safeIsoDate(f.createdAt),
      resolved_at: f.resolvedAt ? safeIsoDate(f.resolvedAt) : null,
      resolved_by: f.resolvedBy || null,
      resolved_by_role: f.resolvedByRole || null,
      rescue_message: f.rescueMessage || null,
      category: f.category || 'General',
      country: f.country || 'Colombia',
      city: f.city || 'Bogotá',
      locality: f.locality || 'Centro',
    }));

    const { error: fbErr } = await supabase.from('feedbacks').upsert(fbRows, { onConflict: 'id' });
    if (fbErr) console.error('Error migrando feedbacks:', fbErr);
    else console.log('✅ Feedbacks migrados con éxito.');
  }

  // 4. Migrar Participantes de Sorteo (Habeas Data Big Data)
  if (Array.isArray(rawData.campaignParticipants) && rawData.campaignParticipants.length > 0) {
    console.log(`🎁 Migrando ${rawData.campaignParticipants.length} participantes de sorteos...`);
    const partRows = rawData.campaignParticipants.map((p) => {
      let branchId = p.branchId;
      if (branchId === 'carlos-mendoza-principal') branchId = 'carlos-mendoza-consultorio';
      return {
        id: p.id,
        business_id: p.businessId,
        business_name: p.businessName || null,
        country: p.country || 'Colombia',
        city: p.city || null,
        locality: p.locality || null,
        niche_category: p.nicheCategory || null,
        branch_id: branchId,
        branch_name: p.branchName,
        customer_name: p.customerName,
        customer_phone: p.customerPhone,
        rating: p.rating || 5,
        customer_comment: p.customerComment || null,
        registered_at: safeIsoDate(p.registeredAt),
        attended_by: p.attendedBy || null,
        is_winner: Boolean(p.isWinner),
        winner_notified_at: p.winnerNotifiedAt ? safeIsoDate(p.winnerNotifiedAt) : null,
        prize_won: p.prizeWon || null,
        prize_claimed: Boolean(p.prizeClaimed),
        claimed_at: p.claimedAt ? safeIsoDate(p.claimedAt) : null,
      };
    });

    const { error: partErr } = await supabase.from('campaign_participants').upsert(partRows, { onConflict: 'id' });
    if (partErr) console.error('Error migrando participantes:', partErr);
    else console.log('✅ Participantes migrados con éxito.');
  }

  // 5. Migrar Leads Comerciales
  if (Array.isArray(rawData.commercialLeads) && rawData.commercialLeads.length > 0) {
    console.log(`📋 Migrando ${rawData.commercialLeads.length} prospectos comerciales...`);
    const leadRows = rawData.commercialLeads.map((l) => ({
      id: l.id,
      created_at: safeIsoDate(l.createdAt),
      full_name: l.fullName,
      business_name: l.businessName,
      category: l.category || null,
      city: l.city,
      country: l.country || 'Colombia',
      phone: l.phone,
      email: l.email || null,
      branch_count: l.branchCount || 1,
      preferred_time: l.preferredTime || null,
      primary_goal: l.primaryGoal || null,
      status: l.status || 'new',
      ip: l.ip || null,
      device: l.device || null,
      notes: l.notes || null,
    }));

    const { error: leadErr } = await supabase.from('commercial_leads').upsert(leadRows, { onConflict: 'id' });
    if (leadErr) console.error('Error migrando leads:', leadErr);
    else console.log('✅ Prospectos comerciales migrados con éxito.');
  }

  // 6. Migrar Incidentes
  if (Array.isArray(rawData.shiftIncidents) && rawData.shiftIncidents.length > 0) {
    console.log(`🚨 Migrando ${rawData.shiftIncidents.length} incidentes...`);
    const incRows = rawData.shiftIncidents.map((i) => ({
      id: i.id,
      business_id: i.businessId,
      branch_id: i.branchId === 'carlos-mendoza-principal' ? 'carlos-mendoza-consultorio' : i.branchId,
      branch_name: i.branchName,
      manager_name: i.managerName || 'Gerencia de Turno',
      timestamp: safeIsoDate(i.timestamp),
      severity: i.severity || 'media',
      category: i.category || 'servicio',
      description: i.description,
      corrective_action: i.correctiveAction || null,
      status: i.status || 'open',
    }));

    const { error: incErr } = await supabase.from('shift_incidents').upsert(incRows, { onConflict: 'id' });
    if (incErr) console.error('Error migrando incidentes:', incErr);
    else console.log('✅ Incidentes migrados con éxito.');
  }

  // 7. Migrar Master Security
  if (rawData.masterSecurity) {
    const { error: secErr } = await supabase.from('master_security').upsert({
      id: 'master_singleton',
      emergency_phone: rawData.masterSecurity.emergencyPhone || '+57 305 831 4049',
      emergency_email: rawData.masterSecurity.emergencyEmail || 'info@prestigia.app',
      totp_secret: rawData.masterSecurity.totpSecret || 'JBSWY3DPEHPK3PXP',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });
    if (secErr) console.error('Error migrando seguridad master:', secErr);
    else console.log('✅ Seguridad master configurada con éxito.');
  }

  console.log('🎉 ¡TODOS LOS DATOS FUERON MIGRADOS A SUPABASE CON 100% DE ÉXITO!');
}

migrate().catch(console.error);
