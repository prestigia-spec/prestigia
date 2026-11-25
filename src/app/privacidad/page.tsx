import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PrestigiaIcon } from '@/components/PrestigiaIcon';
import { ShieldCheck, ArrowLeft, Lock, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad | Prestigia Technologies',
  description:
    'Política de Privacidad y tratamiento de datos de Prestigia Technologies, incluyendo el uso autorizado de la API de Google Business Profile.',
};

export default function PrivacidadPage() {
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
          <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cumplimiento y Protección de Datos</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Política de Privacidad — Prestigia Technologies
          </h1>
          <p className="text-xs text-slate-400">
            Última actualización: 25 de noviembre de 2026 • Aplicación oficial:{' '}
            <span className="text-slate-200 font-mono">https://prestigia-oficial.vercel.app</span>
          </p>
        </div>

        <section className="space-y-3 text-sm leading-relaxed text-slate-300">
          <h2 className="text-lg font-extrabold text-white">1. Responsable del Tratamiento</h2>
          <p>
            <strong>Prestigia Technologies</strong> (&ldquo;Prestigia&rdquo;, &ldquo;nosotros&rdquo;) es una plataforma SaaS de gestión de reputación local, blindaje de experiencias y administración de reseñas para empresas y comercios. Para cualquier consulta o solicitud sobre privacidad, puedes escribirnos a{' '}
            <a href="mailto:prestigiaprincipal@gmail.com" className="text-amber-400 underline">
              prestigiaprincipal@gmail.com
            </a>.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-slate-300">
          <h2 className="text-lg font-extrabold text-white">2. Datos que Recopilamos y Cómo los Usamos</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Datos de la cuenta y sede comercial:</strong> nombre de la empresa, nombre de sede, teléfono de contacto, correo del titular, enlaces de canales digitales y configuración del portal. Se utilizan exclusivamente para operar el servicio contratado.
            </li>
            <li>
              <strong>Datos de retroalimentación y clientes:</strong> calificaciones internas, comentarios de experiencia y datos de contacto ingresados voluntariamente por los clientes finales en los formularios de atención o campañas VIP.
            </li>
            <li>
              <strong>Datos de Google Business Profile (OAuth 2.0):</strong> cuando un cliente autoriza voluntariamente su cuenta de Google mediante OAuth, Prestigia solicita acceso únicamente para:
              <ul className="list-disc pl-5 mt-1.5 space-y-1 text-slate-400">
                <li>Identificar el correo de la cuenta conectada (<code className="text-slate-200">userinfo.email</code>, <code className="text-slate-200">userinfo.profile</code>).</li>
                <li>Leer las sedes, reseñas y calificaciones de su perfil oficial de Google Business Profile (<code className="text-slate-200">https://www.googleapis.com/auth/business.manage</code>).</li>
                <li>Publicar respuestas a dichas reseñas en nombre del negocio cuando el propietario o administrador lo solicita desde el portal de Prestigia.</li>
              </ul>
            </li>
          </ul>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-slate-300">
          <h2 className="text-lg font-extrabold text-white">3. Uso Limitado de los Datos de APIs de Google</h2>
          <p>
            El uso y la transferencia de información recibida de las APIs de Google por parte de Prestigia cumple con la{' '}
            <strong>Política de Datos de Usuario de los Servicios de API de Google</strong>, incluidos los requisitos de Uso Limitado. Prestigia:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>No vende, alquila ni comercializa datos obtenidos de Google bajo ninguna circunstancia.</li>
            <li>No utiliza los datos de Google Business Profile para publicidad dirigida ni para entrenar modelos públicos de terceros.</li>
            <li>Solo almacena los tokens OAuth necesarios para mantener la sincronización autorizada por el titular del negocio.</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-slate-300">
          <h2 className="text-lg font-extrabold text-white">4. Seguridad, Retención y Revocación de Acceso</h2>
          <p>
            Protegemos la información mediante cifrado en tránsito (HTTPS/TLS) y controles de acceso por empresa y sede. Puedes revocar el acceso de Prestigia a tu cuenta de Google en cualquier momento desde{' '}
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 underline"
            >
              myaccount.google.com/permissions
            </a>{' '}
            o solicitar la eliminación completa de tus datos escribiendo a{' '}
            <a href="mailto:prestigiaprincipal@gmail.com" className="text-amber-400 underline">
              prestigiaprincipal@gmail.com
            </a>.
          </p>
        </section>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs text-slate-300">
              <p className="font-bold text-white">Contacto de Privacidad y Cumplimiento</p>
              <p className="text-slate-400">prestigiaprincipal@gmail.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/terminos"
              className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-xl border border-slate-700 hover:border-slate-500 transition"
            >
              Ver Términos de Servicio
            </Link>
            <a
              href="mailto:prestigiaprincipal@gmail.com"
              className="text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Escribir a Soporte</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
