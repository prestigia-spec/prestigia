const fs = require('fs');
const path = require('path');

const logoPath = 'C:\\Users\\brayan\\OneDrive\\Desktop\\Logo_3_Escudo_TSS.jpg';
const logoBase64 = fs.readFileSync(logoPath).toString('base64');
const logoDataUri = `data:image/jpeg;base64,${logoBase64}`;

const prestigiaSvg = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-shield">
  <defs>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4F46E5" />
      <stop offset="50%" stop-color="#3B82F6" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
  </defs>
  <polygon points="50,4 90,20 90,56 50,96 10,56 10,20" fill="#0A0F1D" stroke="url(#shieldGrad)" stroke-width="4" stroke-linejoin="round" />
  <path d="M50 22C42.8 22 37 27.8 37 35C37 44.5 50 58 50 58C50 58 63 44.5 63 35C63 27.8 57.2 22 50 22Z" fill="#1E293B" stroke="#38BDF8" stroke-width="2.5" />
  <circle cx="50" cy="35" r="5.5" fill="#38BDF8" />
  <path d="M50 63L53.5 70.5L61.5 71.5L55.5 77L57 85L50 81L43 85L44.5 77L38.5 71.5L46.5 70.5L50 63Z" fill="url(#goldGrad)" stroke="#FDE68A" stroke-width="1" />
</svg>`;

const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prestigia • Super Dossier Oficial 2026 | Technological Solutions Software</title>
  <style>
    :root {
      --bg: #060913;
      --card: #090E1A;
      --card-border: #1E293B;
      --primary: #4F46E5;
      --amber: #F59E0B;
      --emerald: #10B981;
      --rose: #F43F5E;
      --cyan: #06B6D4;
      --text: #F8FAFC;
      --text-muted: #94A3B8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: var(--bg); color: var(--text); line-height: 1.6; padding-bottom: 80px; }
    .container { max-width: 1100px; margin: 0 auto; padding: 20px; }
    
    /* Topbar */
    .topbar { position: sticky; top: 0; z-index: 100; background: rgba(6, 9, 19, 0.95); backdrop-filter: blur(10px); border-bottom: 1px solid var(--card-border); padding: 12px 20px; }
    .topbar-content { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
    .brand-group { display: flex; align-items: center; gap: 12px; }
    .logo-shield { width: 42px; height: 42px; }
    .brand-title { font-size: 18px; font-weight: 900; letter-spacing: -0.5px; }
    .badge-year { font-size: 10px; background: rgba(245, 158, 11, 0.2); color: #FCD34D; border: 1px solid rgba(245, 158, 11, 0.4); padding: 2px 8px; border-radius: 999px; font-weight: 800; text-transform: uppercase; margin-left: 6px; }
    .brand-sub { font-size: 11px; color: var(--text-muted); }
    
    .actions { display: flex; align-items: center; gap: 8px; }
    .btn-toggle { background: #0F172A; border: 1px solid var(--card-border); border-radius: 10px; padding: 4px; display: flex; }
    .btn-toggle button { background: none; border: none; color: var(--text-muted); padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 12px; cursor: pointer; }
    .btn-toggle button.active { background: var(--amber); color: #020617; font-weight: 900; }
    .btn-lock { background: #1E293B; border: 1px solid rgba(245, 158, 11, 0.4); color: #FCD34D; border-radius: 10px; padding: 7px 14px; font-size: 12px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
    
    /* Hero */
    .hero { text-align: center; padding: 40px 10px 30px; max-width: 850px; margin: 0 auto; }
    .hero-badges { display: flex; justify-content: center; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
    .tss-pill { display: inline-flex; align-items: center; gap: 8px; background: #0A101D; border: 1px solid rgba(6, 182, 212, 0.3); padding: 4px 12px; border-radius: 999px; font-size: 11px; color: #CBD5E1; }
    .tss-logo-img { height: 20px; width: auto; border-radius: 4px; }
    .hero h1 { font-size: 2.4rem; font-weight: 900; line-height: 1.2; margin: 16px 0; letter-spacing: -0.5px; }
    .hero h1 span { color: #F43F5E; background: linear-gradient(90deg, #F43F5E, #F59E0B); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .hero p { font-size: 15px; color: #CBD5E1; line-height: 1.6; margin-bottom: 24px; }
    
    /* Grids & Cards */
    .section-title { text-align: center; margin-bottom: 24px; }
    .section-title h2 { font-size: 1.8rem; font-weight: 900; color: #FFF; margin-bottom: 6px; }
    .section-title p { font-size: 13px; color: var(--text-muted); }
    .tag-sec { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--amber); }
    
    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 40px; }
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 40px; }
    .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 40px; }
    
    .card { background: var(--card); border: 1px solid var(--card-border); border-radius: 20px; padding: 22px; position: relative; }
    .card h3 { font-size: 16px; font-weight: 800; color: #FFF; margin-bottom: 8px; }
    .card p { font-size: 12.5px; color: #CBD5E1; line-height: 1.5; }
    .highlight-box { margin-top: 12px; padding: 10px 12px; border-radius: 12px; font-size: 11.5px; font-weight: 600; }
    .hb-rose { background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.25); color: #FDA4AF; }
    .hb-amber { background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.25); color: #FCD34D; }
    .hb-emerald { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); color: #6EE7B7; }
    .hb-indigo { background: rgba(79, 70, 229, 0.1); border: 1px solid rgba(79, 70, 229, 0.25); color: #A5B4FC; }
    
    /* Algorithm Flow */
    .flow-card { background: linear-gradient(145deg, #0B132B, #070B16); border: 2px solid rgba(245, 158, 11, 0.4); border-radius: 24px; padding: 28px; margin-bottom: 40px; }
    
    /* Plan Estratégico */
    .setup-card { background: linear-gradient(135deg, rgba(79, 70, 229, 0.25), rgba(245, 158, 11, 0.15)); border: 2px solid rgba(99, 102, 241, 0.5); border-radius: 24px; padding: 28px; margin-bottom: 40px; }
    .price-badge { background: #0A0F1D; border: 2px solid var(--amber); border-radius: 16px; padding: 16px 20px; text-align: center; }
    .price-lg { font-size: 28px; font-weight: 900; color: var(--amber); }
    .old-price { font-size: 11px; text-decoration: line-through; color: var(--text-muted); }
    
    /* Plan Cards */
    .plan-card { display: flex; flex-direction: column; justify-content: space-between; border-radius: 24px; padding: 24px; border: 1px solid var(--card-border); background: var(--card); }
    .plan-pro { border: 2px solid #6366F1; background: linear-gradient(180deg, #0F172A, #090E1A); }
    .plan-elite { border: 2px solid var(--amber); background: linear-gradient(180deg, #1C1407, #090E1A); }
    .plan-price { font-size: 26px; font-weight: 900; color: #FFF; margin: 8px 0 2px; }
    .plan-feature-list { list-style: none; margin: 16px 0; border-top: 1px solid var(--card-border); padding-top: 14px; }
    .plan-feature-list li { font-size: 12px; color: #CBD5E1; margin-bottom: 8px; display: flex; gap: 8px; }
    .btn-action { width: 100%; border: none; border-radius: 12px; padding: 12px; font-weight: 800; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }
    .btn-primary { background: #6366F1; color: #FFF; }
    .btn-gold { background: linear-gradient(90deg, #F59E0B, #D97706); color: #020617; }
    .btn-dark { background: #1E293B; color: #CBD5E1; border: 1px solid var(--card-border); }
    
    /* Modal */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: none; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
    .modal-overlay.active { display: flex; }
    .modal-box { background: #0C1424; border: 2px solid var(--amber); border-radius: 24px; padding: 28px; max-width: 440px; text-align: center; }
    .lock-circle { width: 56px; height: 56px; background: rgba(245, 158, 11, 0.2); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 24px; color: var(--amber); }
    
    /* Footer */
    .footer-cta { text-align: center; background: linear-gradient(180deg, #0E1627, #070B16); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 28px; padding: 40px 20px; margin-top: 40px; }
    .corporate-card { margin-top: 30px; padding: 20px; background: rgba(6, 9, 19, 0.9); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; text-align: left; }
    .corporate-logo { height: 48px; border-radius: 8px; border: 1px solid rgba(6, 182, 212, 0.4); }

    /* Print styles */
    @media print {
      body { background: #FFF !important; color: #020617 !important; }
      .topbar, .btn-lock, .actions { display: none !important; }
      .card, .flow-card, .setup-card, .plan-card { border: 1px solid #CBD5E1 !important; background: #F8FAFC !important; color: #020617 !important; page-break-inside: avoid; }
      .hero h1 span { color: #020617 !important; -webkit-text-fill-color: initial !important; }
    }
  </style>
</head>
<body>

  <!-- Topbar -->
  <header class="topbar">
    <div class="topbar-content">
      <div class="brand-group">
        ${prestigiaSvg}
        <div>
          <div class="brand-title">PRESTIGIA <span class="badge-year">DOSSIER 2026</span></div>
          <div class="brand-sub">Suite de Blindaje &bull; Un producto de <strong style="color:#38BDF8">Technological Solutions Software</strong></div>
        </div>
      </div>
      <div class="actions">
        <div class="btn-toggle">
          <button id="btn-cop" class="active" onclick="setCurrency('COP')">COP ($)</button>
          <button id="btn-usd" onclick="setCurrency('USD')">USD ($)</button>
        </div>
        <button class="btn-lock" onclick="openAdvisorModal('Topbar')">
          🔒 Contactar Asesor
        </button>
      </div>
    </div>
  </header>

  <div class="container">

    <!-- Hero -->
    <section class="hero">
      <div class="hero-badges">
        <div class="tss-pill">
          <img src="${logoDataUri}" alt="Technological Solutions Software" class="tss-logo-img">
          <span>Un producto oficial de <strong>Technological Solutions Software</strong></span>
        </div>
      </div>
      <h1>Hasta el <span>30% de tus clientes nuevos se pierden</span> por culpa de una sola mala reseña en Google Maps.</h1>
      <p>El <strong>94% de los consumidores</strong> evitan activamente cualquier negocio con opiniones negativas sin resolver (BrightLocal, Moz & Harvard). Prestigia es la primera plataforma que contiene quejas destructivas en privado antes de que toquen internet, responde con Inteligencia Artificial y llena tu local con sorteos y bases de datos propias.</p>
    </section>

    <!-- 1. Los Dolores Críticos -->
    <div class="section-title">
      <div class="tag-sec">Diagnóstico de Pérdidas Ocultas</div>
      <h2>¿Por qué los negocios pierden dinero todos los días?</h2>
      <p>La mayoría de los dueños descubren el problema cuando la calificación ya cayó a 3.8 estrellas.</p>
    </div>
    <div class="grid-2">
      <div class="card">
        <h3>1. El "Cliente Francotirador" Silencioso</h3>
        <p>En el local sonríe y dice que todo estuvo bien por pena. Pero en casa publica una reseña feroz de 1 estrella en Google Maps que verán 15.000 clientes potenciales durante 5 años.</p>
        <div class="highlight-box hb-rose">⚠️ Se necesitan al menos 35 reseñas de 5★ para recuperar el promedio de una sola calificación de 1 estrella.</div>
      </div>
      <div class="card">
        <h3>2. Pérdida del 22% al 30% de Nuevos Clientes</h3>
        <p>Estudios de Moz y Harvard demuestran que una sola queja visible ahuyenta de inmediato al 22% de comensales nuevos, reduciendo las ventas anuales hasta un 33%.</p>
        <div class="highlight-box hb-amber">⚠️ En un negocio de $30M COP/mes, se destruyen entre $3M y $5M COP mensuales en ventas que se van a tu competencia.</div>
      </div>
      <div class="card">
        <h3>3. Días Muertos y Esclavitud de las Apps</h3>
        <p>Martes y miércoles vacíos porque el negocio no tiene los teléfonos de sus clientes. Dependen de apps de domicilios que cobran hasta el 30% de comisión y se quedan con la data.</p>
        <div class="highlight-box hb-indigo">⚠️ Miles de personas compran en tu local y no tienes ni un solo número para enviarles una oferta directa.</div>
      </div>
      <div class="card">
        <h3>4. Ceguera Operativa del Propietario</h3>
        <p>Cuando el dueño no está presente, no tiene cómo saber qué mesero atendió con desgano, qué plato salió frío o por qué un cliente leal no volvió.</p>
        <div class="highlight-box hb-rose">⚠️ Pérdida de clientes leales sin que el dueño jamás sepa qué empleado o turno causó la inconformidad.</div>
      </div>
    </div>

    <!-- 2. Solución Smart QR -->
    <section class="flow-card">
      <div class="section-title" style="text-align:left; margin-bottom: 16px;">
        <div class="tag-sec">Tecnología de Filtrado Patentada</div>
        <h2>El Algoritmo Smart QR: El Escudo de tu Marca</h2>
        <p>Un código QR en cada mesa o mostrador detecta la satisfacción en tiempo real y bifurca el flujo:</p>
      </div>
      <div class="grid-2" style="margin-bottom:0">
        <div class="card" style="background:rgba(16, 185, 129, 0.08); border-color: rgba(16, 185, 129, 0.3);">
          <h3 style="color:#34D399">✅ Si califica 4 o 5 Estrellas:</h3>
          <p>Desvío automático a la ficha oficial de <strong>Google Maps</strong> para publicar con textos generados por IA listos para "Copiar y Pegar".</p>
          <div class="highlight-box hb-emerald">🚀 Crecimiento exponencial en el ranking local de Google.</div>
        </div>
        <div class="card" style="background:rgba(244, 63, 94, 0.08); border-color: rgba(244, 63, 94, 0.3);">
          <h3 style="color:#FB7185">🛡️ Si califica 1 a 3 Estrellas:</h3>
          <p><strong>Google Maps queda completamente BLOQUEADO.</strong> La queja se retiene en privado, emite alerta sonora en sala y la IA redacta el mensaje de rescate por WhatsApp en 15 segundos.</p>
          <div class="highlight-box hb-rose">🛡️ Cero escándalos públicos y cliente insatisfecho recuperado.</div>
        </div>
      </div>
    </section>

    <!-- 2.2 Cuatro Sectores Físicos Clave -->
    <div class="section-title">
      <div class="tag-sec">Sistemas Especializados para Cada Industria</div>
      <h2>Adaptado a Negocios de Atención en Sala y Mostrador</h2>
      <p>Prestigia optimiza sus flujos al ADN de cada tipo de establecimiento comercial.</p>
    </div>
    <div class="grid-4">
      <div class="card">
        <h3 style="color:var(--amber)">🍽️ Gastronomía & Bares</h3>
        <p>Restaurantes, gastrobares y cafeterías. Códigos en mesas, alertas en cocina por platos demorados y sorteos para llenar el local los martes.</p>
      </div>
      <div class="card">
        <h3 style="color:#F472B6">✂️ Belleza & Barberías</h3>
        <p>Spas, barberías y salones de estética. Placas en espejos, asignación por barbero/estilista y auditoría de personal con propinas.</p>
      </div>
      <div class="card">
        <h3 style="color:var(--cyan)">🩺 Salud & Clínicas</h3>
        <p>Consultorios odontológicos, médicos y veterinarias. QR en sala de espera, blindaje del prestigio médico y control de puntualidad.</p>
      </div>
      <div class="card">
        <h3 style="color:#C084FC">🛍️ Retail & Comercio</h3>
        <p>Boutiques, tiendas de moda, calzado y gimnasios. QR en caja para convertir compradores ocasionales en miembros VIP.</p>
      </div>
    </div>

    <!-- 2.5 Plan Estratégico de Inicio -->
    <section class="setup-card">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; margin-bottom:20px;">
        <div style="max-width:650px;">
          <div class="tag-sec" style="color:#A5B4FC">PAQUETE DE ENTRADA & DESPEGUE DIGITAL</div>
          <h2>Plan Estratégico de Inicio: Web + Google Maps + Kit QR</h2>
          <p>El paquete llave en mano donde construimos tus activos digitales definitivos en menos de 5 días hábiles.</p>
        </div>
        <div class="price-badge">
          <div class="old-price" id="setup-old">PRECIO REGULAR: $700.000 COP</div>
          <div style="font-size:10px; font-weight:800; color:#F43F5E; text-transform:uppercase;">🔥 50% DCTO. PRIMEROS 5 CUPOS</div>
          <div class="price-lg" id="setup-price">$350.000 COP</div>
          <div style="font-size:11px; color:#34D399; font-weight:800; margin-top:4px;">🎁 ¡100% BONIFICADO en suscripción anual PRO y ÉLITE!</div>
        </div>
      </div>

      <!-- Comparativa Agencias -->
      <div class="grid-4" style="margin-bottom:16px;">
        <div class="card" style="padding:14px;">
          <strong style="font-size:12px; display:block; color:#CBD5E1;">1. Web Móvil &lt;1.2s:</strong>
          <span style="font-size:11px; color:#FDA4AF;">Agencias: $800K a $1.2M</span>
        </div>
        <div class="card" style="padding:14px;">
          <strong style="font-size:12px; display:block; color:#CBD5E1;">2. Google Maps SEO:</strong>
          <span style="font-size:11px; color:#FDA4AF;">Agencias: $400K a $600K</span>
        </div>
        <div class="card" style="padding:14px;">
          <strong style="font-size:12px; display:block; color:#CBD5E1;">3. Kit Físico Smart QR:</strong>
          <span style="font-size:11px; color:#FDA4AF;">Agencias: $150K a $250K</span>
        </div>
        <div class="card" style="padding:14px; background:rgba(16, 185, 129, 0.15); border-color:rgba(16, 185, 129, 0.4); text-align:center;">
          <span style="font-size:10px; text-transform:uppercase; color:#CBD5E1;">Total en Agencias:</span>
          <div style="text-decoration:line-through; color:#FDA4AF; font-size:11px;">$1.35M a $2.05M+</div>
          <strong style="color:#34D399; font-size:14px; display:block;" id="setup-save">En Prestigia: $350.000</strong>
        </div>
      </div>

      <div style="background:rgba(245, 158, 11, 0.1); border:1px solid rgba(245, 158, 11, 0.3); border-radius:12px; padding:12px; font-size:12px; color:#FCD34D; margin-bottom:12px;">
        ⚠️ <strong>Cláusula de Urgencia:</strong> La tarifa de $350.000 COP aplica únicamente para los <strong>primeros 5 negocios de cada nicho</strong>. Luego vuelve a su precio regular de $700.000 COP y se pierde el acceso vitalicio gratuito a los módulos de Puntos y Páginas Amarillas.
      </div>
      <div style="background:rgba(15, 23, 42, 0.8); border:1px solid var(--card-border); border-radius:12px; padding:12px; font-size:12px; color:#CBD5E1; margin-bottom:16px;">
        ** <strong>¿Ya tienes página web y Google Maps activo?</strong> La auditoría técnica, vinculación y entrega del Kit Smart QR queda en tan solo <strong style="color:var(--amber)" id="setup-audit">$200.000 COP (o $59 USD)</strong>.
      </div>

      <button class="btn-action btn-primary" onclick="openAdvisorModal('Plan Estratégico de Inicio')">
        🔒 Postular mi Negocio con mi Asesor ➔
      </button>
    </section>

    <!-- 3. Matriz de Planes -->
    <div class="section-title">
      <div class="tag-sec">Estructura Comercial y Precios</div>
      <h2>Tres Planes Claros. Un Solo Objetivo: Multiplicar tu Negocio.</h2>
      <p>Sin permanencias ocultas. Actualizaciones y soporte técnico especializado incluidos.</p>
    </div>
    <div class="grid-3">
      <!-- Básico -->
      <div class="plan-card">
        <div>
          <span style="font-size:11px; font-weight:800; color:var(--text-muted); text-transform:uppercase;">PLAN BÁSICO</span>
          <div class="plan-price" id="price-basic">$89.000 COP <span style="font-size:12px; color:var(--text-muted); font-weight:normal;">/ mes</span></div>
          <div style="font-size:11px; color:#FCD34D;" id="annual-basic">$890.000 COP / año (2 meses gratis)</div>
          <div style="margin: 8px 0; padding:6px 10px; background:#0F172A; border-radius:8px; font-size:10px; color:#CBD5E1;">
            ⚙️ <strong>Setup Inicial:</strong> <span id="setup-basic">$350.000 COP</span> (pago único)
          </div>
          <div style="margin-bottom: 12px; padding:8px 10px; background:#0F172A; border-radius:8px; font-size:11px; color:#94A3B8;">
            🔒 <strong>Pantallas:</strong> Solo 1 pantalla central del Dueño.
          </div>
          <ul class="plan-feature-list">
            <li>✅ Filtro Smart QR anti-reseñas 1 a 3★</li>
            <li>✅ Radar de Google Maps básico</li>
            <li>✅ 1 Soporte técnico al mes</li>
            <li>❌ Sin Asistente IA Google</li>
            <li>❌ Sin Alertas Sonoras en Vivo</li>
            <li>❌ Sin Sorteos ni Base CSV</li>
          </ul>
        </div>
        <button class="btn-action btn-dark" onclick="openAdvisorModal('Plan Básico')">
          🔒 Solicitar Básico con mi Asesor
        </button>
      </div>

      <!-- Pro -->
      <div class="plan-card plan-pro">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:11px; font-weight:900; color:#A5B4FC; text-transform:uppercase;">PLAN PRO</span>
            <span style="font-size:9px; background:#4F46E5; color:#FFF; font-weight:900; padding:2px 8px; border-radius:999px;">POPULAR</span>
          </div>
          <div class="plan-price" id="price-pro" style="color:#FFF;">$179.000 COP <span style="font-size:12px; color:#A5B4FC; font-weight:normal;">/ mes</span></div>
          <div style="font-size:11px; color:#A5B4FC;" id="annual-pro">$1.790.000 COP / año (2 meses gratis)</div>
          <div style="margin: 8px 0; padding:6px 10px; background:rgba(16, 185, 129, 0.2); border:1px solid rgba(16, 185, 129, 0.4); border-radius:8px; font-size:10px; color:#6EE7B7; font-weight:800;">
            🎁 <strong>Setup Inicial ($350K):</strong> ¡100% BONIFICADO en anual!
          </div>
          <div style="margin-bottom: 12px; padding:8px 10px; background:rgba(79, 70, 229, 0.2); border-radius:8px; font-size:11px; color:#C7D2FE;">
            🛡️ <strong>Pantallas:</strong> 1 Dueño + 2 en Local/Caja con 2FA.
          </div>
          <ul class="plan-feature-list">
            <li>✅ <strong>Todo lo del Plan Básico</strong></li>
            <li>✅ <strong>Asistente IA Google Ilimitado (3 tonos)</strong></li>
            <li>✅ <strong>Alertas Sonoras & Push en Vivo en sala</strong></li>
            <li>✅ <strong>Sorteo del Mes Oficial (1 ganador)</strong></li>
            <li>✅ <strong>Exportación CSV de Clientes con Habeas Data</strong></li>
            <li>✅ 2 Soportes técnicos incluidos al mes</li>
          </ul>
        </div>
        <button class="btn-action btn-primary" onclick="openAdvisorModal('Plan Pro')">
          🔒 Activar Plan Pro con mi Asesor
        </button>
      </div>

      <!-- Élite -->
      <div class="plan-card plan-elite">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:11px; font-weight:900; color:var(--amber); text-transform:uppercase;">PLAN ÉLITE TOTAL</span>
            <span style="font-size:9px; background:var(--amber); color:#020617; font-weight:900; padding:2px 8px; border-radius:999px;">MULTISEDE</span>
          </div>
          <div class="plan-price" id="price-elite" style="color:var(--amber);">$349.000 COP <span style="font-size:12px; color:var(--text-muted); font-weight:normal;">/ mes</span></div>
          <div style="font-size:11px; color:#FCD34D;" id="annual-elite">+$99.000 COP / mes por sede adicional</div>
          <div style="margin: 8px 0; padding:6px 10px; background:rgba(245, 158, 11, 0.2); border:1px solid rgba(245, 158, 11, 0.4); border-radius:8px; font-size:10px; color:#FCD34D; font-weight:800;">
            🎁 <strong>Setup Inicial ($350K):</strong> ¡100% BONIFICADO en anual!
          </div>
          <div style="margin-bottom: 12px; padding:8px 10px; background:rgba(245, 158, 11, 0.15); border-radius:8px; font-size:11px; color:#FDE68A;">
            👑 <strong>Pantallas:</strong> 1 Dueño + 2 por Sede (hasta 6) + TV Wallboard.
          </div>
          <ul class="plan-feature-list">
            <li>✅ <strong>Hasta 3 Sedes Físicas integradas</strong></li>
            <li>✅ <strong>Rescate WhatsApp con IA Generativa</strong></li>
            <li>✅ <strong>Pantalla Smart TV Wallboard en Vivo para Salón</strong></li>
            <li>✅ <strong>Sorteos Multi-Ganador (1 a 10+)</strong></li>
            <li>✅ <strong>Exportación Global CSV de todas las sedes</strong></li>
            <li>✅ <strong>4 Soportes Técnicos Prioritarios VIP al mes</strong></li>
          </ul>
        </div>
        <button class="btn-action btn-gold" onclick="openAdvisorModal('Plan Élite')">
          🔒 Desbloquear Plan Élite con mi Asesor
        </button>
      </div>
    </div>

    <!-- 3.5 ROI Matemático -->
    <div class="flow-card" style="border-color: rgba(16, 185, 129, 0.4); background: linear-gradient(135deg, #091A1D, #070B16);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; margin-bottom:20px;">
        <div style="max-width:650px;">
          <div class="tag-sec" style="color:#6EE7B7;">EL NÚMERO QUE CONVENCE A TU CONTADOR</div>
          <h2>Por Qué Prestigia se Paga Solo Desde el Primer Mes</h2>
          <p>Prestigia no es un costo operativo; es un motor de ingresos directos:</p>
        </div>
        <div class="price-badge" style="border-color:#34D399; background:rgba(6, 78, 59, 0.3);">
          <div style="font-size:10px; text-transform:uppercase; color:#CBD5E1;">Retorno Estimado Anual</div>
          <div style="font-size:24px; font-weight:900; color:#34D399;" id="roi-amount">+$14.000.000 COP</div>
          <div style="font-size:10px; color:#A7F3D0;">En ahorros y ventas recuperadas</div>
        </div>
      </div>
      <div class="grid-3" style="margin-bottom:0">
        <div class="card">
          <strong style="color:#FFF; display:block; margin-bottom:4px;">1. Evitar 1 Sola Queja 1★:</strong>
          <p>15 clientes nuevos perdidos al mes representan $8.100.000 COP al año.</p>
          <div class="highlight-box hb-emerald">💰 Contener 1 queja paga más de 1 año del Plan Pro.</div>
        </div>
        <div class="card">
          <strong style="color:#FFF; display:block; margin-bottom:4px;">2. Ahorro en Community Manager:</strong>
          <p>Un redactor cobra $500K a $1M/mes. La IA responde en 3 segundos con 1 clic.</p>
          <div class="highlight-box hb-indigo">💰 Ahorro de $6M a $12M COP al año en nómina.</div>
        </div>
        <div class="card">
          <strong style="color:#FFF; display:block; margin-bottom:4px;">3. Llenar Días Muertos:</strong>
          <p>2.000 contactos con WhatsApp generan ofertas los martes con 2.5% de asistencia.</p>
          <div class="highlight-box hb-amber">💰 +$1.500.000 COP adicionales en una sola tarde vacía.</div>
        </div>
      </div>
    </div>

    <!-- 5. Beneficio Fundadores -->
    <section class="flow-card" style="border-color:var(--amber); text-align:center;">
      <span class="badge-year" style="font-size:12px; padding:4px 14px;">🎁 BENEFICIO VITALICIO PARA LOS PRIMEROS 5 NEGOCIOS DE CADA NICHO</span>
      <h2 style="font-size:2rem; font-weight:900; margin:16px 0 8px;">Acceso 100% Gratuito y de Por Vida a los Nuevos Módulos</h2>
      <p style="max-width:700px; margin:0 auto 20px; font-size:13.5px; color:#FDE68A;">
        Los primeros 5 negocios de cada categoría comercial (las primeras 5 pizzerías, barberías, cafeterías, etc.) tendrán acceso de cortesía sin costo de por vida a los futuros módulos de <strong>Puntos por Compras</strong> y a las <strong>Páginas Amarillas Digitales (Guía Prestigia)</strong>, manteniendo su misma tarifa mensual para siempre.
      </p>
      <button class="btn-action btn-gold" style="max-width:340px; margin:0 auto;" onclick="openAdvisorModal('Beneficio Fundador')">
        🔒 Postular mi Negocio con mi Asesor
      </button>
    </section>

    <!-- Footer CTA -->
    <section class="footer-cta">
      ${prestigiaSvg}
      <h2 style="font-size:2.2rem; font-weight:900; margin:14px 0 6px;">Protege tu Negocio Hoy Mismo</h2>
      <p style="font-size:13px; color:#CBD5E1; max-width:550px; margin:0 auto 24px;">No esperes a que caiga la próxima mala reseña de 1 estrella. Activa el blindaje Prestigia en menos de 24 horas.</p>
      
      <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap; margin-bottom:24px;">
        <button class="btn-action btn-gold" style="width:auto; padding:14px 28px; font-size:13px;" onclick="openAdvisorModal('Cierre Dossier')">
          🔒 Contactar al Asesor que te entregó este Dossier
        </button>
        <button class="btn-action btn-dark" style="width:auto; padding:14px 24px;" onclick="window.print()">
          📥 Imprimir / Guardar en PDF
        </button>
      </div>

      <!-- Aviso Candado -->
      <div style="background:rgba(245, 158, 11, 0.1); border:1px solid rgba(245, 158, 11, 0.3); border-radius:16px; padding:16px; max-width:580px; margin:0 auto; text-align:left; display:flex; gap:12px;">
        <div style="font-size:20px;">🔒</div>
        <div style="font-size:12px; color:#FCD34D;">
          <strong>Atención Personalizada & Reserva de Cupos:</strong><br>
          <span style="color:#CBD5E1;">Para postular tu negocio a uno de los 5 Cupos de Fundador o activar tu suscripción, <strong>por favor comunícate directamente con el asesor comercial que te compartió este enlace o documento PDF</strong>. Él verificará la disponibilidad de cupos en tu nicho comercial.</span>
        </div>
      </div>

      <!-- Respaldo TSS -->
      <div class="corporate-card">
        <div style="display:flex; align-items:center; gap:14px;">
          <img src="${logoDataUri}" alt="Technological Solutions Software" class="corporate-logo">
          <div>
            <div style="font-size:13px; font-weight:900; color:#FFF;">TECHNOLOGICAL SOLUTIONS SOFTWARE</div>
            <div style="font-size:10px; color:#38BDF8; font-weight:700; letter-spacing:1px;">ENTERPRISE DIVISION &bull; CLOUD BACKING</div>
          </div>
        </div>
        <div style="font-size:11px; color:#94A3B8; max-width:500px;">
          Prestigia es desarrollado y protegido con la arquitectura cloud de <strong>Technological Solutions Software</strong>. Cifrado TLS/AES-256, 99.98% SLA de disponibilidad y soporte B2B especializado.
        </div>
      </div>

      <div style="font-size:11px; color:#64748B; margin-top:24px;">
        Prestigia &copy; 2026 &bull; Un producto oficial de Technological Solutions Software. Todos los derechos reservados.
      </div>
    </section>

  </div>

  <!-- Modal Asesor -->
  <div id="advisorModal" class="modal-overlay" onclick="closeAdvisorModal(event)">
    <div class="modal-box" onclick="event.stopPropagation()">
      <div class="lock-circle">🔒</div>
      <h3 style="font-size:18px; font-weight:900; color:#FFF; margin-bottom:4px;">Canal de Activación Exclusivo</h3>
      <div style="font-size:11px; color:var(--amber); font-weight:800; text-transform:uppercase; margin-bottom:14px;" id="modalPlanTitle">
        Atención Asignada por Asesor
      </div>
      <p style="font-size:13px; color:#CBD5E1; margin-bottom:16px;">
        Para garantizar la reserva de uno de los <strong>5 Cupos de Fundador con el 50% de descuento</strong> y validar la disponibilidad en tu categoría, <strong>comunícate directamente con el asesor comercial autorizado que te entregó este enlace o documento PDF</strong>.
      </p>
      <div style="background:#090E1A; border:1px solid var(--card-border); border-radius:12px; padding:10px; font-size:11px; color:#94A3B8; margin-bottom:18px;">
        🔒 <em>Línea corporativa central en asignación. Tu asesor personal gestionará tu onboarding en menos de 24 horas.</em>
      </div>
      <button class="btn-action btn-gold" onclick="closeAdvisorModal()">
        Entendido, Contactaré a mi Asesor
      </button>
    </div>
  </div>

  <script>
    let currentCurrency = 'COP';

    const prices = {
      COP: {
        setupOld: 'PRECIO REGULAR: $700.000 COP',
        setupPrice: '$350.000 COP',
        setupSave: 'En Prestigia: $350.000 COP',
        setupAudit: '$200.000 COP (o $59 USD)',
        setupBasic: '$350.000 COP',
        priceBasic: '$89.000 COP',
        annualBasic: '$890.000 COP / año (2 meses gratis)',
        pricePro: '$179.000 COP',
        annualPro: '$1.790.000 COP / año (2 meses gratis)',
        priceElite: '$349.000 COP',
        annualElite: '+$99.000 COP / mes por sede adicional',
        roiAmount: '+$14.000.000 COP',
      },
      USD: {
        setupOld: 'REGULAR PRICE: $199 USD',
        setupPrice: '$99 USD',
        setupSave: 'In Prestigia: $99 USD',
        setupAudit: '$59 USD',
        setupBasic: '$99 USD',
        priceBasic: '$29 USD',
        annualBasic: '$290 USD / year (2 months off)',
        pricePro: '$49 USD',
        annualPro: '$490 USD / year (2 months off)',
        priceElite: '$99 USD',
        annualElite: '+$29 USD / month add-on branch',
        roiAmount: '+$3,800 USD',
      }
    };

    function setCurrency(curr) {
      currentCurrency = curr;
      document.getElementById('btn-cop').className = curr === 'COP' ? 'active' : '';
      document.getElementById('btn-usd').className = curr === 'USD' ? 'active' : '';

      const p = prices[curr];
      document.getElementById('setup-old').innerText = p.setupOld;
      document.getElementById('setup-price').innerText = p.setupPrice;
      document.getElementById('setup-save').innerText = p.setupSave;
      document.getElementById('setup-audit').innerText = p.setupAudit;
      document.getElementById('setup-basic').innerText = p.setupBasic;
      document.getElementById('price-basic').innerHTML = p.priceBasic + ' <span style="font-size:12px; color:var(--text-muted); font-weight:normal;">/ mes</span>';
      document.getElementById('annual-basic').innerText = p.annualBasic;
      document.getElementById('price-pro').innerHTML = p.pricePro + ' <span style="font-size:12px; color:#A5B4FC; font-weight:normal;">/ mes</span>';
      document.getElementById('annual-pro').innerText = p.annualPro;
      document.getElementById('price-elite').innerHTML = p.priceElite + ' <span style="font-size:12px; color:var(--text-muted); font-weight:normal;">/ mes</span>';
      document.getElementById('annual-elite').innerText = p.annualElite;
      document.getElementById('roi-amount').innerText = p.roiAmount;
    }

    function openAdvisorModal(planName) {
      document.getElementById('modalPlanTitle').innerText = planName ? 'Consulta: ' + planName : 'Atención Asignada por Asesor';
      document.getElementById('advisorModal').classList.add('active');
    }

    function closeAdvisorModal() {
      document.getElementById('advisorModal').classList.remove('active');
    }
  </script>
</body>
</html>`;

const outputPath = 'C:\\Users\\brayan\\OneDrive\\Desktop\\Prestigia_Dossier_Offline.html';
fs.writeFileSync(outputPath, htmlContent, 'utf8');
console.log('Successfully written standalone offline HTML to:', outputPath);
