import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Masterclass Gratuita: Posicionamiento en Google Maps 2026 | Prestigia',
  description:
    'Aprende en vivo el método paso a paso para posicionar y blindar negocios locales en el Top 3 de Google Maps con Inteligencia Artificial. Jueves 10 de Diciembre • 7:00 PM (Col/Miami). Acceso 100% libre.',
  openGraph: {
    title: '🔴 Masterclass en Vivo: El Negocio de Google Maps 2026',
    description:
      'Aprende a posicionar y blindar negocios locales en Google Maps con IA. Jueves 10 de Diciembre • 7:00 PM. Cupos limitados para la sala virtual.',
    url: 'https://prestigia-oficial.vercel.app/masterclass',
    siteName: 'Prestigia 5★',
    images: [
      {
        url: 'https://prestigia-oficial.vercel.app/images/masterclass/masterclass_post_1_podio_google_maps.jpg',
        width: 1080,
        height: 1080,
        alt: 'Masterclass Posicionamiento en Google Maps Prestigia',
      },
    ],
    locale: 'es_LA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '🔴 Masterclass en Vivo: El Negocio de Google Maps 2026',
    description:
      'Aprende a posicionar y blindar negocios locales en Google Maps con IA. Jueves 10 de Diciembre • 7:00 PM.',
    images: ['https://prestigia-oficial.vercel.app/images/masterclass/masterclass_post_1_podio_google_maps.jpg'],
  },
};

export default function MasterclassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
