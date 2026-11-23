const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const staffList = [
  "Carlos Gómez",
  "Mariana Pérez",
  "Andrés Martínez",
  "Camila López",
  "Diego Morales"
];

const customerNames = [
  "Valentina Rincón", "Mauricio Restrepo", "Felipe Caicedo", "Dra. Sofía Mendoza", "Esteban Osorio",
  "Jorge Pinzón", "Lorena Silva", "Alejandro Bernal", "Carolina Duarte", "Santiago Echeverri",
  "Patricia Vega", "Andrés Felipe Ruiz", "Camila Navas", "Julián Castro", "Daniela Cárdenas",
  "Rodrigo Vargas", "Natalia Gómez", "Sebastián Beltrán", "Paula Andrea Ortiz", "Mateo Jaramillo",
  "Laura Marcela Reyes", "Cristian Camilo Torres", "Gabriela Salamanca", "Nicolás Arango", "Vanessa Quintero",
  "David Fernando Meza", "Mariana Cardona", "Ricardo Albarracín", "Tatiana Monsalve", "Héctor Fabio Morales",
  "Juliana Peñuela", "Camilo Sampedro", "Diana Milena Buitrago", "Álvaro José Hoyos", "Catalina Villamil",
  "Oscar Eduardo Prada", "Mónica Forero", "Sergio Iván Pardo", "Paola Andrea Cruz", "Guillermo León Vélez",
  "Marcela Benítez", "Germán Alonso Patiño", "Silvia Juliana León", "César Augusto Franco", "Adriana Lucía Parra",
  "Fabio Nelson Quiceno", "Andrea Carolina Roa", "Juan Pablo Cuéllar", "Claudia Jimena Ospina", "Manuel Guillermo Solano",
  "Esperanza Barreto", "Leonardo Favio Chaves", "Yolanda Castañeda", "Rubén Darío Henao", "Luz Marina Agudelo",
  "Gonzalo Efrén Mayorga", "Sandra Patricia Barón", "Víctor Manuel Cañizares", "Gloria Inés Suescún", "Édgar Mauricio Carvajal"
];

const positiveFeedbacks = [
  "La carne madurada en su punto exacto. La atención fue impecable desde la entrada.",
  "Excelente ambiente para celebrar cumpleaños familiar. Nos encantó la sugerencia de vino.",
  "El corte Tomahawk superó todas las expectativas. Gran atención en la mesa.",
  "Muy buena música en vivo el sábado. Los cócteles de la casa son de primer nivel.",
  "Diego en la parrilla es un artista. Las costillas BBQ son las mejores de la Zona G.",
  "La hostess Camila nos atendió de inmediato y nos ubicó en una mesa excelente sin reserva.",
  "Rápida atención y comida deliciosa. Muy cómodo el pago sin contacto.",
  "Excelente servicio de Carlos, estuvo pendiente de cada detalle sin ser invasivo.",
  "Los acompañamientos y el chimichurri artesanal tienen un sabor increíble.",
  "Celebramos una cena de negocios y todo salió perfecto. 100% recomendado.",
  "El postre de tres leches y el café especial al final cerraron una cena de 10.",
  "Ambiente acogedor, decoración sobria y cortes de carne muy suaves."
];

const neutralFeedbacks = [
  "La comida deliciosa, pero tardaron unos 15 minutos en traer las bebidas.",
  "Buen sabor pero el parqueadero del valet estaba bastante lleno un viernes a las 8pm.",
  "Los cócteles muy ricos, aunque la música en la terraza estaba un poco alta para conversar.",
  "La atención fue buena, solo que el datáfono se demoró en procesar la tarjeta por señal.",
  "Pedimos término medio y uno de los cortes llegó un poco más cocido, pero lo comimos bien.",
  "El restaurante es muy bonito, solo sugiero más opciones de postres sin azúcar."
];

const negativeFeedbacks = [
  "El bife de chorizo llegó bien cocido cuando lo pedí término medio. Tuvimos que pedir cambio.",
  "Tardaron 35 minutos en traer los platos principales un domingo concurrido.",
  "La ensalada llegó sin el aderezo prometido en la carta y el mesero tardó en traerlo.",
  "Mesa asignada cerca de la puerta con mucho frío por la corriente de aire.",
  "Nos trajeron la cuenta con un plato que no habíamos pedido, aunque lo corrigieron rápido.",
  "El café llegó frío después del postre. El encargado fue amable pero deben cuidar ese detalle."
];

// Helper to generate ISO dates between Aug 1 and Nov 23, 2026
function getRandomDate(index, total) {
  const start = new Date('2026-08-15T12:00:00.000Z').getTime();
  const end = new Date('2026-11-23T12:00:00.000Z').getTime();
  const time = start + ((end - start) * (index / total)) + (Math.random() * 86400000);
  return new Date(Math.min(time, end)).toISOString();
}

// 1. GENERATE EXACTLY 60 GOOGLE REVIEWS
// 30 answered, 30 unanswered
const generatedGoogleReviews = [];

for (let i = 0; i < 60; i++) {
  const isAnswered = i < 30; // first 30 answered, next 30 unanswered
  const author = customerNames[i];
  const dateIso = getRandomDate(i, 60);

  // Rating distribution: 32 five-star, 14 four-star, 6 three-star, 4 two-star, 4 one-star
  let rating = 5;
  if (i >= 52) rating = 1;
  else if (i >= 48) rating = 2;
  else if (i >= 42) rating = 3;
  else if (i >= 28) rating = 4;
  else rating = 5;

  let text = "";
  if (rating === 5) {
    text = positiveFeedbacks[i % positiveFeedbacks.length] + " Volveremos pronto con amigos.";
  } else if (rating === 4) {
    text = neutralFeedbacks[i % neutralFeedbacks.length];
  } else if (rating === 3) {
    text = neutralFeedbacks[(i + 2) % neutralFeedbacks.length] + " Aceptable pero con detalles por mejorar.";
  } else {
    text = negativeFeedbacks[i % negativeFeedbacks.length];
  }

  let replyText = undefined;
  let repliedAt = undefined;
  let repliedBy = undefined;
  let repliedByRole = undefined;

  if (isAnswered) {
    const replyDate = new Date(new Date(dateIso).getTime() + (Math.random() * 7200000 + 1800000)).toISOString();
    repliedAt = replyDate;
    if (rating >= 4) {
      repliedBy = (i % 2 === 0) ? "Carlos Gómez (Dueño)" : "Prestigia AI Assistant";
      repliedByRole = "owner";
      replyText = `Hola ${author.split(' ')[0]}, ¡muchísimas gracias por visitarnos en La Parrilla de Andrés! Nos alegra de corazón que hayas tenido una experiencia tan grata. Será un placer recibirte de nuevo en tu casa.`;
    } else {
      repliedBy = "Mariana Pérez (Jefe de Sala)";
      repliedByRole = "branch_manager";
      replyText = `Hola ${author.split(' ')[0]}, lamentamos profundamente el inconveniente con tu visita. En La Parrilla de Andrés la excelencia en el servicio es nuestra prioridad y ya tomamos los correctivos con el equipo de sala y cocina. Nos encantaría tener la oportunidad de reivindicarnos en tu próxima visita.`;
    }
  }

  generatedGoogleReviews.push({
    id: `gr-demo-${String(i + 1).padStart(2, '0')}`,
    businessId: "demo",
    branchId: "demo-sede-principal",
    branchName: "Sede Principal Zona G",
    authorName: `${author} ${rating >= 4 && i % 4 === 0 ? '(Local Guide)' : ''}`.trim(),
    rating,
    relativeTime: i < 5 ? "hace 2 días" : i < 15 ? "hace 1 semana" : i < 30 ? "hace 3 semanas" : i < 45 ? "hace 1 mes" : "hace 2 meses",
    text,
    status: isAnswered ? "answered" : "unanswered",
    replyText,
    repliedAt,
    repliedBy,
    repliedByRole,
    createdAt: dateIso
  });
}

const complaintsList = [
  "El bife de chorizo llegó bien cocido cuando lo pedí término medio. Tuvimos que pedir cambio y tardaron 25 minutos.",
  "Tardaron 40 minutos en traer los platos principales un domingo concurrido y las bebidas llegaron tibias.",
  "La ensalada llegó sin el aderezo prometido en la carta y el mesero tardó en traerlo con evidente mala cara.",
  "Mesa asignada cerca de la puerta con mucho frío por la corriente de aire; pedimos cambio y no nos dieron solución.",
  "Nos trajeron la cuenta con un plato y dos cócteles que nunca pedimos, y demoraron en hacer la corrección.",
  "El corte de carne tenía demasiado nervio y grasa para ser corte premium. No concordaba con el precio.",
  "Pedimos la hamburguesa sin cebolla por tema de alergia y vino con cebolla. Mala comunicación con la cocina.",
  "El mesero derramó salsa en la mesa al servir y no limpió ni ofreció cambio de mantel.",
  "La crema de champiñones llegó tibia casi fría. La regresamos y tardaron 15 minutos en devolverla.",
  "Demasiado ruido de los parlantes de música en vivo en la terraza. Imposible conversar en la mesa.",
  "El datáfono no tenía señal y nos hicieron esperar 15 minutos en caja para poder pagar.",
  "El baño de clientes estaba descuidado y sin toallas de papel en pleno servicio de la noche.",
  "La carne deliciosa, pero tardaron unos 20 minutos en traer las primeras bebidas a la mesa.",
  "Buen sabor pero el valet parking colapsó un viernes a las 8pm y demoraron en recibir el carro.",
  "Los cócteles muy ricos, aunque la música estaba un poco alta para una cena de negocios.",
  "La atención fue amable, solo que el datáfono se demoró en procesar la tarjeta por señal.",
  "Pedimos término medio y uno de los cortes llegó un poco más cocido, aunque aún pasable.",
  "El restaurante es muy bonito, solo sugiero incluir más opciones sin azúcar y postres sin gluten.",
  "El plato principal estuvo excelente, pero las papas rústicas de acompañamiento llegaron frías.",
  "El mesero atendía demasiadas mesas al mismo tiempo y costaba trabajo llamarlo para pedir la cuenta."
];

// 2. GENERATE EXACTLY 60 PRIVATE FEEDBACKS (STRICTLY 1★, 2★, 3★ - PRIVATELY FILTERED)
// 30 resolved, 30 pending
const generatedFeedbacks = [];

for (let i = 0; i < 60; i++) {
  const isResolved = i < 30; // first 30 resolved, next 30 pending
  const customer = customerNames[(i + 15) % customerNames.length];
  const dateIso = getRandomDate(i, 60);
  const staff = staffList[i % staffList.length];
  const phone = `+573${Math.floor(100000000 + Math.random() * 899999999)}`;

  // STRICT RULE OF PRESTIGIA: Private complaints filter ONLY captures 1★, 2★ and 3★!
  // (4★ and 5★ are redirected automatically by Prestigia to Google Maps!)
  let rating = 1;
  if (i % 3 === 0) rating = 1;
  else if (i % 3 === 1) rating = 2;
  else rating = 3;

  const reason = complaintsList[i % complaintsList.length];

  let resolvedAt = undefined;
  let resolvedBy = undefined;
  let resolvedByRole = undefined;
  let rescueMessage = undefined;

  if (isResolved) {
    resolvedAt = new Date(new Date(dateIso).getTime() + (Math.random() * 3600000 + 900000)).toISOString();
    const firstName = customer.split(' ')[0];

    if (i % 3 === 0) {
      resolvedBy = "Mariana Pérez (Jefe de Sala)";
      resolvedByRole = "branch_manager";
      rescueMessage = `Hola ${firstName}, te saluda Mariana Pérez, Jefe de Sala de La Parrilla de Andrés. Lamento profundamente el inconveniente que tuviste ("${reason}"). Ya conversé directamente con ${staff} y ajustamos el servicio en mesa y cocina de inmediato. Queremos compensarte: te dejamos reservado un corte especial de cortesía y dos copas de vino en tu próxima visita. ¿Cuándo nos acompañas para atenderte como mereces?`;
    } else if (i % 3 === 1) {
      resolvedBy = "Carlos Gómez (Dueño General)";
      resolvedByRole = "owner";
      rescueMessage = `Hola ${firstName}, te escribe personalmente Carlos Gómez, dueño de La Parrilla de Andrés. Me enteré de lo ocurrido con "${reason}" y quiero pedirte una sincera disculpa. En mi casa la calidad y el servicio son sagrados. Ya tomé medidas directas con el equipo y me gustaría invitarte personalmente una cena completa por mi cuenta para que vivas la experiencia que verdaderamente nos representa. Por favor avísame cuando desees volver.`;
    } else {
      resolvedBy = "Filtro Privado Prestigia AI";
      resolvedByRole = "branch_manager";
      rescueMessage = `Estimado/a ${firstName}, el Agente de Rescate Prestigia AI detectó tu reporte ("${reason}") y lo escaló de forma inmediata a la Gerencia General de La Parrilla de Andrés. Lamentamos el malestar ocasionado. Se ha generado un Bono Digital de Rescate del 100% en plato fuerte para tu próxima visita y la Jefe de Sala Mariana Pérez supervisará personalmente tu mesa.`;
    }
  }

  generatedFeedbacks.push({
    id: `fb-demo-${String(i + 1).padStart(2, '0')}`,
    businessId: "demo",
    businessName: "La Parrilla de Andrés & Co.",
    branchId: "demo-sede-principal",
    branchName: "Sede Principal Zona G",
    rating,
    customerName: customer,
    customerPhone: phone,
    complaintReason: reason,
    attendedBy: staff,
    clubConsent: true,
    status: isResolved ? "resolved" : "pending",
    createdAt: dateIso,
    resolvedAt,
    resolvedBy,
    resolvedByRole,
    rescueMessage,
    category: "Restaurantes & Gastronomía",
    city: "Bogotá",
    locality: "Zona G"
  });
}

// Replace in db.json
db.googleReviews = db.googleReviews.filter(g => g.businessId !== 'demo');
db.googleReviews.unshift(...generatedGoogleReviews);

db.feedbacks = db.feedbacks.filter(f => f.businessId !== 'demo');
db.feedbacks.unshift(...generatedFeedbacks);

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

const answeredG = generatedGoogleReviews.filter(r => r.status === 'answered').length;
const unansweredG = generatedGoogleReviews.filter(r => r.status === 'unanswered').length;
const resolvedF = generatedFeedbacks.filter(f => f.status === 'resolved').length;
const pendingF = generatedFeedbacks.filter(f => f.status === 'pending').length;

console.log(`Successfully seeded dataset:`);
console.log(`Google Reviews: Total ${generatedGoogleReviews.length} (${answeredG} answered, ${unansweredG} unanswered)`);
console.log(`Private Feedbacks: Total ${generatedFeedbacks.length} (${resolvedF} resolved, ${pendingF} pending)`);
