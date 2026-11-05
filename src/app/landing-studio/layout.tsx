import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prestigia Landing Studio',
  description: 'AI High-Conversion Local Landing Pages & Funnels',
};

export default function LandingStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
