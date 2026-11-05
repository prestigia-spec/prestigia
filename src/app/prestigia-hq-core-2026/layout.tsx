import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prestigia HQ Core',
  description: 'General Direction Command Console & Master Node',
};

export default function HqCoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
