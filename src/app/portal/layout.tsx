import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prestigia Portal',
  description: 'Private Client Management & Reputation Portal',
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
