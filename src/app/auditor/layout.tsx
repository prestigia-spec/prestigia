import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prestigia Auditor Top 3',
  description: 'Forensic Audit & Google Maps Ranking Optimization',
};

export default function AuditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
