import { NextResponse } from 'next/server';
import {
  getAllStudioLandingPages,
  getStudioLandingPageBySlug,
  saveStudioLandingPage,
  deleteStudioLandingPage,
  StudioLandingPage,
} from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const advisorId = searchParams.get('advisorId');
    const isAdmin = searchParams.get('isAdmin') === 'true';

    if (slug) {
      const page = await getStudioLandingPageBySlug(slug);
      if (!page) {
        return NextResponse.json({ success: false, error: 'Página no encontrada' }, { status: 404 });
      }
      return NextResponse.json({ success: true, page });
    }

    const allPages = await getAllStudioLandingPages();

    if (isAdmin || !advisorId) {
      return NextResponse.json({ success: true, pages: allPages });
    }

    const filtered = allPages.filter((p) => p.advisorId === advisorId);
    return NextResponse.json({ success: true, pages: filtered });
  } catch (error: any) {
    console.error('Error fetching landing pages:', error);
    return NextResponse.json({ error: 'Error del servidor al obtener páginas web' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      slug,
      advisorId = 'adv-luisma',
      advisorName = 'Luisma • Director General',
      advisorPhone = '+573058314049',
      businessName,
      category = 'General',
      city = 'Bogotá',
      phone = '+573058314049',
      whatsappMessage = 'Hola, deseo agendar una consulta y solicitar información de disponibilidad.',
      status = 'active',
      theme,
      headline,
      subheadline,
      callToAction = 'Agendar por WhatsApp',
      offerBadge = '⚡ Oferta Especial Disponible Hoy',
      offerCountdownHours = 4,
      services = [],
      reviews = [],
      testimonials = [],
      features,
      address,
    } = body;

    if (!businessName || !businessName.trim()) {
      return NextResponse.json({ error: 'El nombre del negocio es obligatorio' }, { status: 400 });
    }

    const safeSlug =
      (slug || businessName)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || `negocio-${Date.now().toString(36)}`;

    const landingObj: StudioLandingPage = {
      id: id || `lp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      slug: safeSlug,
      advisorId,
      advisorName,
      advisorPhone,
      businessName: businessName.trim(),
      category: category.trim(),
      city: city.trim(),
      phone: phone.trim(),
      whatsappMessage,
      status: status === 'suspended' ? 'suspended' : 'active',
      theme: {
        primaryColor: theme?.primaryColor || '#D97706',
        accentColor: theme?.accentColor || '#059669',
        bgColor: theme?.bgColor || '#030712',
        template: theme?.template || 'executive_dark',
      },
      headline: headline || `Los Mejores en ${category} en ${city}`,
      subheadline: subheadline || 'Atención personalizada, resultados garantizados y soporte inmediato por WhatsApp.',
      callToAction: callToAction || 'Chatear por WhatsApp',
      offerBadge,
      offerCountdownHours: Number(offerCountdownHours) || 4,
      services: Array.isArray(services) && services.length > 0 ? services : [
        { name: 'Servicio Insignia Premium', description: 'Atención personalizada de alta calidad con garantía completa.', price: 'Consultar', tag: 'Más Solicitado' },
        { name: 'Evaluación y Diagnóstico', description: 'Análisis detallado de necesidades con plan de acción inmediato.', price: 'Gratis Hoy', tag: 'Cortesía' },
        { name: 'Atención Prioritaria Express', description: 'Respuesta en menos de 20 minutos para requerimientos urgentes.', price: 'Inmediata', tag: 'Express' },
      ],
      reviews: Array.isArray(reviews) && reviews.length > 0 ? reviews : [
        { author: 'María Camila R.', rating: 5, text: 'Excelente atención, puntuales y muy profesionales. Totalmente recomendados.', date: 'Hace 3 días' },
        { author: 'Andrés Felipe M.', rating: 5, text: 'Resolvieron mi requerimiento en tiempo récord. El trato por WhatsApp fue de 10/10.', date: 'Hace 1 semana' },
        { author: 'Dra. Paola Gómez', rating: 5, text: 'Muy satisfechos con el resultado. Sin duda seguiremos contratando con ellos.', date: 'Hace 2 semanas' },
      ],
      testimonials: Array.isArray(testimonials) && testimonials.length > 0 ? testimonials : [
        { name: 'Carlos Mendoza', role: 'Cliente Verificado', quote: 'Desde el primer contacto supieron exactamente lo que necesitaba. Llegaron a tiempo y con la mejor actitud.' },
        { name: 'Sofía Restrepo', role: 'Cliente Frecuente', quote: 'La calidad del servicio superó mis expectativas. Ya los he recomendado a toda mi familia.' },
      ],
      features: {
        showLiveOpen: features?.showLiveOpen !== false,
        showUrgencyBanner: features?.showUrgencyBanner !== false,
        showFomoPopups: features?.showFomoPopups !== false,
        showReviewCarousel: features?.showReviewCarousel !== false,
        showWazeButton: features?.showWazeButton !== false,
        showPrestigiaBadge: features?.showPrestigiaBadge !== false,
      },
      address: address || `${city}, Colombia`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveStudioLandingPage(landingObj);

    return NextResponse.json({ success: true, page: landingObj });
  } catch (error: any) {
    console.error('Error saving landing page:', error);
    return NextResponse.json({ error: 'Error guardando página de aterrizaje' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID de página web no proporcionado' }, { status: 400 });
    }

    const ok = await deleteStudioLandingPage(id);
    return NextResponse.json({ success: ok, message: 'Página web eliminada con éxito' });
  } catch (error: any) {
    console.error('Error deleting landing page:', error);
    return NextResponse.json({ error: 'Error eliminando página web' }, { status: 500 });
  }
}
