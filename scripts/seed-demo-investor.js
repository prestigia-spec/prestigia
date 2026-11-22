const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// 1. Create demo business
const demoBusiness = {
  id: "demo",
  name: "La Parrilla de Andrés & Co. (Demo Oficial Prestigia)",
  legalName: "Inversiones Gastronómicas Gómez & Cía S.A.S.",
  taxId: "901.482.910-4",
  address: "Calle 69A # 5-28, Zona G",
  ownerName: "Carlos Andrés Gómez",
  ownerPhone: "+57 300 123 4567",
  plan: "elite",
  status: "active",
  trialEndsAt: "2029-12-31T23:59:59.000Z",
  password: "admin",
  category: "Restaurante & Gastrobar",
  createdAt: "2026-08-01T12:00:00.000Z",
  branches: [
    {
      id: "demo-sede-principal",
      name: "Sede Principal Zona G",
      address: "Calle 69A # 5-28, Zona G",
      city: "Bogotá",
      locality: "Chapinero / Zona G",
      googleReviewUrl: "https://maps.google.com/?cid=1029384756",
      managerPhone: "+573001234567",
      managerPassword: "admin",
      managerUsername: "encargado_demo",
      managerName: "Mariana Pérez",
      managerRole: "Jefe de Sala & Servicio",
      status: "active",
      websiteUrl: "https://prestigia-oficial.vercel.app",
      staffQuota: 10,
      staffMembers: [
        { name: "Carlos Gómez", role: "Mesero Líder", joinedAt: "2026-08-01" },
        { name: "Mariana Pérez", role: "Jefe de Sala", joinedAt: "2026-07-15" },
        { name: "Andrés Martínez", role: "Bartender & Coctelería", joinedAt: "2026-08-10" },
        { name: "Camila López", role: "Hostess / Recepción", joinedAt: "2026-09-01" },
        { name: "Diego Morales", role: "Jefe de Parrilla", joinedAt: "2026-07-20" }
      ]
    }
  ]
};

// Replace or push demo business
const existingBIdx = db.businesses.findIndex(b => b.id === 'demo');
if (existingBIdx >= 0) {
  db.businesses[existingBIdx] = demoBusiness;
} else {
  db.businesses.unshift(demoBusiness);
}

// 2. Generate 3 months of feedbacks (September, October, November 2026)
const sampleFeedbacks = [
  // 5 Stars - September
  {
    id: "fb-sep-01",
    businessId: "demo",
    businessName: demoBusiness.name,
    branchId: "demo-sede-principal",
    branchName: "Sede Principal Zona G",
    rating: 5,
    customerName: "Valentina Rincón",
    customerPhone: "+573104567890",
    complaintReason: "¡Excelente experiencia! La carne en su punto perfecto y el servicio impecable.",
    attendedBy: "Carlos Gómez",
    clubConsent: true,
    status: "resolved",
    createdAt: "2026-09-05T14:32:00.000Z",
    resolvedAt: "2026-09-05T15:00:00.000Z",
    resolvedBy: "Sistema Prestigia AI"
  },
  {
    id: "fb-sep-02",
    businessId: "demo",
    businessName: demoBusiness.name,
    branchId: "demo-sede-principal",
    branchName: "Sede Principal Zona G",
    rating: 4,
    customerName: "Mauricio Restrepo",
    customerPhone: "+573129876543",
    complaintReason: "Muy buena comida y cócteles de autor. El lugar estaba un poco lleno pero valió la pena.",
    attendedBy: "Andrés Martínez",
    clubConsent: true,
    status: "resolved",
    createdAt: "2026-09-18T20:15:00.000Z"
  },
  {
    id: "fb-sep-03",
    businessId: "demo",
    businessName: demoBusiness.name,
    branchId: "demo-sede-principal",
    branchName: "Sede Principal Zona G",
    rating: 1,
    customerName: "Felipe Caicedo",
    customerPhone: "+573167778899",
    complaintReason: "Pedí el bife de chorizo término medio y me llegó bien cocido. Me tocó esperar 25 min por el cambio.",
    attendedBy: "Carlos Gómez",
    clubConsent: true,
    status: "resolved",
    createdAt: "2026-09-24T21:40:00.000Z",
    resolvedAt: "2026-09-24T22:10:00.000Z",
    resolvedBy: "Mariana Pérez (Jefe de Sala)"
  },

  // October
  {
    id: "fb-oct-01",
    businessId: "demo",
    businessName: demoBusiness.name,
    branchId: "demo-sede-principal",
    branchName: "Sede Principal Zona G",
    rating: 5,
    customerName: "Dra. Sofía Mendoza",
    customerPhone: "+573005551234",
    complaintReason: "Celebramos el aniversario de la clínica aquí. La atención de Mariana en la reserva fue de 10 estrellas.",
    attendedBy: "Mariana Pérez",
    clubConsent: true,
    status: "resolved",
    createdAt: "2026-10-04T13:10:00.000Z"
  },
  {
    id: "fb-oct-02",
    businessId: "demo",
    businessName: demoBusiness.name,
    branchId: "demo-sede-principal",
    branchName: "Sede Principal Zona G",
    rating: 2,
    customerName: "Esteban Osorio",
    customerPhone: "+573142223344",
    complaintReason: "La música en la terraza estaba demasiado alta para una cena de negocios, no se podía conversar.",
    attendedBy: "Camila López",
    clubConsent: true,
    status: "resolved",
    createdAt: "2026-10-15T21:05:00.000Z",
    resolvedAt: "2026-10-15T21:20:00.000Z",
    resolvedBy: "Filtro Privado Prestigia"
  },
  {
    id: "fb-oct-03",
    businessId: "demo",
    businessName: demoBusiness.name,
    branchId: "demo-sede-principal",
    branchName: "Sede Principal Zona G",
    rating: 5,
    customerName: "Jorge Pinzón",
    customerPhone: "+573189990011",
    complaintReason: "Las mejores costillas BBQ de Bogotá sin duda. Diego en la parrilla es un maestro.",
    attendedBy: "Diego Morales",
    clubConsent: true,
    status: "resolved",
    createdAt: "2026-10-28T14:50:00.000Z"
  },

  // November
  {
    id: "fb-nov-01",
    businessId: "demo",
    businessName: demoBusiness.name,
    branchId: "demo-sede-principal",
    branchName: "Sede Principal Zona G",
    rating: 3,
    customerName: "Lorena Silva",
    customerPhone: "+573114445566",
    complaintReason: "La comida deliciosa, pero tardaron un poco en traer la cuenta porque el datáfono no tenía señal.",
    attendedBy: "Carlos Gómez",
    clubConsent: true,
    status: "resolved",
    createdAt: "2026-11-06T19:30:00.000Z"
  },
  {
    id: "fb-nov-02",
    businessId: "demo",
    businessName: demoBusiness.name,
    branchId: "demo-sede-principal",
    branchName: "Sede Principal Zona G",
    rating: 5,
    customerName: "Alejandro Bernal",
    customerPhone: "+573158889900",
    complaintReason: "Súper recomendado. Muy fácil dejar la reseña acercando el celular a la tarjeta de la mesa. ¡Innovador!",
    attendedBy: "Andrés Martínez",
    clubConsent: true,
    status: "resolved",
    createdAt: "2026-11-14T22:15:00.000Z"
  },
  {
    id: "fb-nov-03",
    businessId: "demo",
    businessName: demoBusiness.name,
    branchId: "demo-sede-principal",
    branchName: "Sede Principal Zona G",
    rating: 5,
    customerName: "Carolina Duarte",
    customerPhone: "+573176665544",
    complaintReason: "La anfitriona Camila nos recibió con una sonrisa y nos ubicó rápido sin tener reserva. 10/10.",
    attendedBy: "Camila López",
    clubConsent: true,
    status: "resolved",
    createdAt: "2026-11-20T13:45:00.000Z"
  }
];

// Clean old demo feedbacks and add new
db.feedbacks = db.feedbacks.filter(f => f.businessId !== 'demo');
db.feedbacks.unshift(...sampleFeedbacks);

// 3. Generate Google Reviews (1 to 5 stars)
const sampleGoogleReviews = [
  {
    id: "gr-01",
    businessId: "demo",
    branchId: "demo-sede-principal",
    branchName: "Sede Principal Zona G",
    authorName: "Santiago Echeverri (Local Guide Level 6)",
    rating: 5,
    relativeTime: "hace 2 días",
    text: "Sitio espectacular. Las carnes maduradas tienen un sabor brutal y los cócteles son de alta gastronomía. Además el sistema de atención y el servicio son rápidos.",
    status: "replied",
    replyText: "¡Muchísimas gracias, Santiago! Nos alegra enormemente que hayas disfrutado nuestras carnes maduradas y coctelería. Será un gusto recibirte pronto de nuevo.",
    repliedAt: "2026-11-20T16:00:00.000Z",
    repliedBy: "Carlos Gómez (Dueño)",
    repliedByRole: "owner",
    createdAt: "2026-11-20T14:00:00.000Z"
  },
  {
    id: "gr-02",
    businessId: "demo",
    branchId: "demo-sede-principal",
    branchName: "Sede Principal Zona G",
    authorName: "Patricia Vega",
    rating: 4,
    relativeTime: "hace 1 semana",
    text: "Muy buen ambiente y música. El estacionamiento es algo reducido los viernes por la noche pero el personal del valet parking es muy atento.",
    status: "replied",
    replyText: "Hola Patricia, gracias por tu visita y comentarios. Tomamos nota sobre el flujo de parqueo para optimizarlo. ¡Esperamos verte pronto!",
    repliedAt: "2026-11-15T10:00:00.000Z",
    repliedBy: "Prestigia AI Assistant",
    repliedByRole: "owner",
    createdAt: "2026-11-14T20:30:00.000Z"
  },
  {
    id: "gr-03",
    businessId: "demo",
    branchId: "demo-sede-principal",
    branchName: "Sede Principal Zona G",
    authorName: "Andrés Felipe Ruiz",
    rating: 2,
    relativeTime: "hace 3 semanas",
    text: "La comida rica pero nos trajeron las entradas junto con los platos fuertes, no hubo orden en los tiempos.",
    status: "replied",
    replyText: "Hola Andrés Felipe, lamentamos mucho ese desfase en cocina. Ya revisamos con nuestro equipo de sala para asegurar los tiempos correctos. Nos gustaría invitarte un postre en tu próxima visita.",
    repliedAt: "2026-11-01T11:00:00.000Z",
    repliedBy: "Mariana Pérez (Jefe de Sala)",
    repliedByRole: "branch_manager",
    createdAt: "2026-10-31T22:00:00.000Z"
  },
  {
    id: "gr-04",
    businessId: "demo",
    branchId: "demo-sede-principal",
    branchName: "Sede Principal Zona G",
    authorName: "Camila Navas",
    rating: 5,
    relativeTime: "hace 1 mes",
    text: "Simplemente perfecto. Carlos nos atendió de maravilla, nos recomendó un corte New York espectacular. Regresaremos con toda la familia.",
    status: "replied",
    replyText: "¡Qué felicidad leer tu reseña, Camila! Carlos estará encantado de saberlo. ¡Bienvenidos siempre a su casa!",
    repliedAt: "2026-10-23T12:00:00.000Z",
    repliedBy: "Carlos Gómez (Dueño)",
    repliedByRole: "owner",
    createdAt: "2026-10-22T19:15:00.000Z"
  },
  {
    id: "gr-05",
    businessId: "demo",
    branchId: "demo-sede-principal",
    branchName: "Sede Principal Zona G",
    authorName: "Julián Castro",
    rating: 1,
    relativeTime: "hace 2 meses",
    text: "Tardaron 40 minutos en atendernos un domingo al mediodía.",
    status: "replied",
    replyText: "Hola Julián, te pedimos una sincera disculpa por el retraso ese domingo de alta afluencia. Reforzamos el equipo de sala en horas pico para que nunca vuelva a ocurrir.",
    repliedAt: "2026-09-20T10:00:00.000Z",
    repliedBy: "Mariana Pérez (Jefe de Sala)",
    repliedByRole: "branch_manager",
    createdAt: "2026-09-19T14:45:00.000Z"
  }
];

db.googleReviews = db.googleReviews.filter(g => g.businessId !== 'demo');
db.googleReviews.unshift(...sampleGoogleReviews);

// 4. Create dedicated demo advisor for Local Studio
const demoAdvisor = {
  id: "adv-demo-inversionista",
  name: "Invitado Especial • Socio Inversionista",
  username: "demo_inversionista",
  password: "admin",
  phone: "+573000000000",
  role: "advisor",
  accountType: "partner_agency",
  planTier: "level_3",
  country: "Colombia",
  city: "Bogotá",
  agencyName: "Agencia Partner VIP",
  licenseStatus: "active",
  active: true,
  maxCreatesMonthly: 10,
  maxAuditsMonthly: 10,
  maxRescuesMonthly: 10,
  maxAppealsMonthly: 10,
  maxToolsMonthly: 10,
  createdAt: "2026-11-22T00:00:00.000Z"
};

const advIdx = db.studioAdvisors.findIndex(a => a.username === 'demo_inversionista');
if (advIdx >= 0) {
  db.studioAdvisors[advIdx] = demoAdvisor;
} else {
  db.studioAdvisors.push(demoAdvisor);
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Successfully seeded demo business and demo advisor with 10 credits in each service!');
