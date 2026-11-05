import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prestigia | Tu Opinión Nos Importa',
  description: 'Evaluación de Experiencia y Calificación Oficial de Servicio',
};

export default function ReviewExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
