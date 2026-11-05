import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prestigia Dossier',
  description: 'Strategic Client Proposals & Market Intelligence Dossiers',
};

export default function DossierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
