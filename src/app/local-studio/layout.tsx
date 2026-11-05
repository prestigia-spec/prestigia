import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prestigia Local Studio',
  description: 'Google Maps Creation & Top 3 Optimization Suite',
};

export default function LocalStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
