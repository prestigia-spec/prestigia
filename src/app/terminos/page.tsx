import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PrestigiaIcon } from '@/components/PrestigiaIcon';
import { FileText, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Términos de Servicio | Prestigia Technologies',
  description:
    'Términos y condiciones de uso de la plataforma SaaS Prestigia Technologies para gestión de reputación y reseñas locales.',
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[#070A12] text-slate-200 selection:bg-amber-500/30">
      <header className="border-b border-slate-800/80 bg-[#070A12]/90 backdrop-blur sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-white font-black tracking-wider text-sm">
            <PrestigiaIcon className="w-7 h-7" />
            <span>PRESTIGIA</span>
          </Link>
          <Link
            href="/"
            className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al inicio</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div className="space-y-3 border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <FileText className="w-3.5 h-3.5" />
            <span>Condiciones de Uso</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Términos de Servicio — Prestigia Technologies
          </h1>
          <p className="text-xs text-slate-400">Última actualización: 25 de noviembre de 2026</p>
        </div>

        <section className="space-y-3 text-sm leading-relaxed text-slate-300">
          <h2 className="text-lg font-extrabold text-white">1. Objeto del Servicio</h2>
          <p>
            Prestigia Technologies provee herramientas tecnológicas para la gestión de experiencia del cliente, recepción de retroalimentación privada y administración oficial de reseñas en Google Business Profile para comercios y empresas suscritas.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-slate-300">
          <h2 className="text-lg font-extrabold text-white">2. Uso Autorizado e Integración con Google</h2>
          <p>
            Al vincular una ficha de Google Business Profile mediante OAuth, el cliente declara ser propietario o administrador autorizado de dicha ubicación comercial y autoriza a Prestigia a leer reseñas y enviar respuestas únicamente bajo su instrucción directa.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-slate-300">
          <h2 className="text-lg font-extrabold text-white">3. Provisión &ldquo;Tal Cual&rdquo;, Deslinde de Responsabilidad y Tope Máximo</h2>
          <p>
            La plataforma se provee estrictamente &ldquo;TAL CUAL&rdquo; (as-is) y &ldquo;SEGÚN DISPONIBILIDAD&rdquo;, sin garantías implícitas ni promesas de resultados comerciales, posicionamiento o ingresos. Prestigia Technologies no es afiliada de Google LLC ni de Meta Platforms, Inc., y no asume responsabilidad por decisiones de terceros, sugerencias de IA revisadas por el cliente, sorteos locales ni por daños indirectos, lucro cesante, pérdida de datos o multas administrativas. En todo caso, cualquier responsabilidad máxima acumulada se limita estrictamente al valor pagado por el suscriptor en los últimos treinta (30) días (o $0 en planes gratuitos/prueba).
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-slate-300">
          <h2 className="text-lg font-extrabold text-white">4. Roles de Datos, Indemnidad Total y Prohibición de Datos Sensibles</h2>
          <p>
            El comercio suscriptor actúa como único <strong>Responsable del Tratamiento (Data Controller)</strong> frente a sus clientes finales y leyes locales o internacionales (Ley 1581, RGPD, CCPA, LFPDPPP), mientras Prestigia actúa únicamente como encargado tecnológico. Queda prohibido ingresar datos sensibles o historias clínicas. El suscriptor asume total indemnidad (Hold Harmless) y exoneración a favor de Prestigia frente a cualquier reclamo, sanción o demanda derivada del uso de datos, envíos de WhatsApp o promociones propias.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-slate-300">
          <h2 className="text-lg font-extrabold text-white">5. Privacidad y Contacto</h2>
          <p>
            El tratamiento de datos se rige por nuestra{' '}
            <Link href="/privacidad" className="text-amber-400 underline">
              Política de Privacidad
            </Link>. Para soporte técnico o consultas legales, contáctanos en{' '}
            <a href="mailto:prestigiaprincipal@gmail.com" className="text-amber-400 underline">
              prestigiaprincipal@gmail.com
            </a>.
          </p>
        </section>
      </main>
    </div>
  );
}
