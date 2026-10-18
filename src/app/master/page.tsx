import { notFound } from 'next/navigation';

// Security Decoy Route:
// Anyone attempting to probe or scan for /master will receive a standard HTTP 404 Not Found error.
// The true Prestigia Master Console operates exclusively at an unguessable stealth endpoint.
export default function MasterDecoyPage() {
  notFound();
}
