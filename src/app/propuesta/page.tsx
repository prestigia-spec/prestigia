import { redirect } from 'next/navigation';

// Redirección unificada a la Súper Página de Ventas Maestra de Prestigia (Sección Planes & Propuesta)
export default function PropuestaPage() {
  redirect('/#planes');
}
