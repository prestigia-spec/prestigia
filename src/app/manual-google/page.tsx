'use client';

import React from 'react';
import Link from 'next/link';
import { PrestigiaIcon } from '@/components/PrestigiaIcon';
import {
  BookOpen,
  Printer,
  ShieldCheck,
  Star,
  MapPin,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  Search,
  Eye,
  MessageCircle,
  Users,
  DollarSign,
  FileText,
  BadgeCheck,
  Globe,
  Zap,
} from 'lucide-react';

export default function ManualGoogleLocalPage() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar (Hidden in Print) */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <PrestigiaIcon className="w-7 h-7 text-indigo-400 group-hover:scale-105 transition" />
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                Prestigia
              </span>
            </Link>
            <div className="h-4 w-[1px] bg-slate-800 hidden sm:block"></div>
            <span className="text-[11px] font-bold text-amber-400 bg-amber-950/80 border border-amber-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>Material de Ventas & Academia</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/auditor"
              className="text-xs text-slate-400 hover:text-white transition hidden md:block"
            >
              ← Volver al Auditor de Negocios
            </Link>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-black text-xs transition flex items-center gap-2 shadow-lg shadow-indigo-600/25 cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Descargar Guía en PDF / Imprimir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {/* COVER / DOCUMENT HEADER */}
        <section className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900 border-2 border-indigo-500/40 relative overflow-hidden shadow-2xl print:border-slate-700">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none hidden sm:block">
            <Cpu className="w-64 h-64 text-indigo-400" />
          </div>

          <div className="space-y-4 relative z-10 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-950 px-3 py-1 rounded-full border border-amber-500/40 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Documento Técnico Confidencial • Nivel Ingeniería</span>
              </span>
              <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-500/30">
                REF: DOC-ENG-GOOGLE-MAPS-2026
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Ingeniería Inversa de Google Maps: El Algoritmo del Local 3-Pack
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Manual maestro para consultores, directores comerciales y vendedores de <strong className="text-white">Prestigia Enterprise</strong>. Aprende con exactitud milimétrica cómo el motor neuronal de Google clasifica los negocios físicos, cómo explotar la Ley de Recencia y cómo argumentar con autoridad científica para cerrar contratos irrevocables a 12 meses.
            </p>

            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center font-black text-indigo-300">
                  L
                </div>
                <div>
                  <div className="font-bold text-white">Luisma • Prestigia Enterprise LatAm</div>
                  <div className="text-[11px] text-slate-400">Co-diseñado para la Fuerza de Ventas de Alta Gama</div>
                </div>
              </div>

              <div className="text-right font-mono text-[11px] text-slate-400">
                <div>Versión: 2.4 Enterprise Edition</div>
                <div className="text-emerald-400 font-bold">Válido 2026 - 2027</div>
              </div>
            </div>
          </div>
        </section>

        {/* INDEX / TABLE OF CONTENTS */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 print:bg-slate-950">
          <div className="flex items-center gap-2 text-indigo-400">
            <Layers className="w-5 h-5" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-200">
              Índice Estructurado del Manual Maestro
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <a href="#capitulo-1" className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 transition block text-slate-300 hover:text-white">
              <span className="text-amber-400 font-bold block mb-0.5">Capítulo 1</span>
              <span>La Mente de Google: Los 3 Pilares del Local Ranking</span>
            </a>
            <a href="#capitulo-2" className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition block text-slate-300 hover:text-white">
              <span className="text-amber-400 font-bold block mb-0.5">Capítulo 2</span>
              <span>El Motor de Reseñas: Review Velocity & NLP Semántico</span>
            </a>
            <a href="#capitulo-3" className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-rose-500/40 transition block text-slate-300 hover:text-white">
              <span className="text-amber-400 font-bold block mb-0.5">Capítulo 3</span>
              <span>La Devastación de 1★ y la Ley de Recencia</span>
            </a>
            <a href="#capitulo-4" className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition block text-slate-300 hover:text-white">
              <span className="text-amber-400 font-bold block mb-0.5">Capítulo 4</span>
              <span>Auditoría de 10 Puntos para la Ficha Perfecta</span>
            </a>
            <a href="#capitulo-5" className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/40 transition block text-slate-300 hover:text-white">
              <span className="text-amber-400 font-bold block mb-0.5">Capítulo 5</span>
              <span>El Discurso Inapelable & Desarmador de Objeciones</span>
            </a>
            <a href="#capitulo-6" className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition block text-slate-300 hover:text-white">
              <span className="text-amber-400 font-bold block mb-0.5">Capítulo 6</span>
              <span>Diccionario Técnico de Alto Impacto para Vendedores</span>
            </a>
          </div>
        </section>

        {/* CAPÍTULO 1 */}
        <section id="capitulo-1" className="space-y-6 pt-4 print-avoid-break">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center">
              1
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">Arquitectura Algorítmica</span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                La Mente de Google: Los 3 Pilares del Local Ranking
              </h2>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              Cuando un usuario busca en su teléfono inteligente <em>"restaurante cerca de mí"</em>, <em>"clínica dental"</em> o <em>"barbería"</em>, los servidores de Google Maps procesan más de <strong>200 señales micro-geográficas</strong> en menos de 150 milisegundos.
            </p>
            <p>
              El resultado final no es una lista infinita: es el codiciado <strong className="text-white">Google Local 3-Pack</strong> (los 3 perfiles destacados en el mapa principal). Estos 3 negocios capturan entre el <strong>70% y el 82% de todos los clics</strong>, llamadas telefónicas, reservas y rutas de navegación (Google Maps / Waze).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black">
                  A
                </div>
                <h3 className="text-sm font-bold text-white">Relevancia (Relevance)</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  ¿Qué tan exacto coincide la ficha del negocio con la intención semántica del usuario? Se define por la <strong>categoría primaria</strong> de Google Business Profile, los servicios especificados y las palabras clave que el cliente incluye en sus búsquedas.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                  B
                </div>
                <h3 className="text-sm font-bold text-white">Distancia (Proximity)</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  ¿Qué tan cerca está el negocio de la ubicación GPS exacta del usuario? No se pueden mover las paredes físicas del local, pero sí se puede <strong>expandir el radio de influencia</strong> aumentando el volumen de opiniones de usuarios de distintos sectores.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border-2 border-indigo-500/60 space-y-2 shadow-xl">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                  C
                </div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Prominencia (Prominence)</span>
                  <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/40">
                    El Factor Rey
                  </span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ¿Qué tan conocido, creíble y validado es el negocio por el público humano real? <strong>El 80% de la Prominencia se decide mediante las Reseñas de Google Maps</strong> (calificación, cantidad, velocidad y frescura). ¡Aquí es donde Prestigia domina el mercado!
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
              <strong className="text-white">Conclusión para la Venta:</strong> El dueño no puede cambiar la ubicación de su local (Distancia), y la Relevancia la optimizamos en 30 minutos. Por lo tanto, <strong>la Prominencia (las reseñas) es el ÚNICO campo de batalla que define si el negocio gana millones en el Top 3 o quiebra invisible en el puesto #8.</strong>
            </div>
          </div>
        </section>

        {/* CAPÍTULO 2 */}
        <section id="capitulo-2" className="space-y-6 pt-4 print-avoid-break">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center">
              2
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Algoritmo Profundo</span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                El Motor de Reseñas: Review Velocity & Procesamiento de Lenguaje Natural (NLP)
              </h2>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              Un comerciante novato cree que tener reseñas es solo "acumular estrellitas amarillas". La inteligencia artificial de Google Maps (basada en el modelo neuronal BERT y Gemini) examina <strong>5 variables matemáticas</strong> en cada reseña:
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">Review Velocity (Velocidad y Constancia de Opiniones)</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Google mide la aceleración con la que un perfil recibe opiniones. Un perfil que recibe <strong className="text-white">+5 reseñas semanales de manera constante</strong> tiene un coeficiente algorítmico 4x mayor que un perfil estático con 300 reseñas viejas. La velocidad demuestra que el negocio está vivo, activo y demandado.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">Extracción de Entidades & Palabras Clave (Google NLP)</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    El algoritmo escanea el texto libre de la reseña buscando sustantivos y adjetivos. Cuando un cliente escribe: <span className="text-amber-300">"El corte rib eye y la atención del mesero Andrés fueron espectaculares"</span>, Google indexa automáticamente el negocio para las búsquedas: <em>"mejor rib eye"</em>, <em>"carne asada"</em> y <em>"buena atención"</em>.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">Fotos de Clientes (User Generated Content - UGC)</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Google premia hasta con un <strong>45% más de visibilidad</strong> a las reseñas que incluyen fotografías tomadas directamente desde la cámara del cliente. El sistema de Google Vision reconoce si en la foto hay comida, interiores impecables o familias sonriendo, validando la autenticidad física del local.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">Autoridad del Reseñador (Local Guides & Historial de Cuenta)</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    No todas las reseñas pesan lo mismo. Una opinión dejada por un usuario real que utiliza Google Maps a diario, con cuenta antigua y nivel de Local Guide, transfiere un "PageRank Local" sustancialmente superior al de cuentas recién creadas.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  5
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">Tasa de Respuesta Operativa (Owner Response Time)</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Los negocios que responden al menos al 85% de sus reseñas en menos de 48 horas son catalogados como "Perfiles de Alta Diligencia", otorgándoles mayor preferencia cuando dos negocios empatan en calificación promedio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CAPÍTULO 3 */}
        <section id="capitulo-3" className="space-y-6 pt-4 print-avoid-break">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <span className="w-8 h-8 rounded-xl bg-rose-600 text-white font-black text-sm flex items-center justify-center">
              3
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">Vulnerabilidad Crítica</span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                La Matemática Devastadora de 1★ y la Ley de Recencia de Google
              </h2>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              Este capítulo contiene la munición verbal más letal que tú y tus vendedores pueden usar frente a cualquier dueño de negocio.
            </p>

            {/* Recuadro de la Ley de Recencia */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-amber-500/40 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Flame className="w-4 h-4" />
                <h3 className="text-sm font-black text-white">La Ley de Recencia de Google (Review Freshness Drop)</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Google Maps no premia el pasado. Su algoritmo opera bajo una ventana de vigencia dinámica: <strong className="text-white">las opiniones recibidas en los últimos 30 días tienen un peso 3 veces superior a las opiniones de hace 6 meses</strong>.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs text-amber-300/90">
                🚨 <strong>¿Por qué el cliente no puede cancelar a los 3 meses?</strong> Si un cliente sube de 3.4★ a 4.9★ en sus primeros 90 días con Prestigia y cancela el servicio pensando que "ya logró la meta", sus opiniones se enfrían. En menos de 45 días, los competidores activos con reseñas nuevas lo desplazarán fuera del Local 3-Pack. La reputación no es un trofeo estático: es un activo vivo que requiere irrigación constante.
              </div>
            </div>

            {/* Recuadro de la Devastación Matemática */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-red-950/80 to-slate-900 border-2 border-red-500/50 space-y-3">
              <div className="flex items-center gap-2 text-red-400 font-bold">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="text-sm font-black text-white">La Asimetría Matemática del Daño (Por Qué 1★ Destruye Fichas)</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Las matemáticas de Google no son lineales. Para elevar un promedio se necesita un esfuerzo masivo, pero para derrumbarlo basta un solo golpe:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-red-500/30">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">El Daño Inmediato</div>
                  <div className="text-sm font-black text-red-400 mt-1">Una sola queja de 1.0★</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    En un negocio con 10 o 15 opiniones a 4.5★, una sola estrella de 1.0★ tumba el promedio general a <strong>4.1★</strong> en un solo segundo.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">El Costo de Reconstrucción</div>
                  <div className="text-sm font-black text-amber-400 mt-1">+12 a +25 reseñas de 5★ seguidas</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Para recuperar esa décima perdida, el negocio necesita matemáticamente que entre 12 y 25 clientes consecutivos le califiquen con 5 estrellas perfectas sin que nadie vuelva a quejarse.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200">
                🛡️ <strong>El Rol Inmortal de Prestigia:</strong> Nuestro Escudo Anti-Reseñas es el dique que impide que esa queja de 1★ toque Google Maps. Al desviarla a WhatsApp en &lt;15 segundos, la convertimos en una oportunidad de servicio al cliente en privado, blindando la ficha pública para siempre.
              </div>
            </div>
          </div>
        </section>

        {/* CAPÍTULO 4 */}
        <section id="capitulo-4" className="space-y-6 pt-4 print-avoid-break">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <span className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center">
              4
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Manual de Campo</span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Checklist Quirúrgico: La Configuración Perfecta de una Ficha en 10 Pasos
              </h2>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              Cuando estés frente al prospecto, abre su ficha en Google Maps en tu tableta o laptop y revisa estos 10 puntos. Cada error que encuentres es una razón más por la que necesita tu consultoría:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold text-[11px]">1. Categoría Primaria Hiper-Específica</span>
                <p className="text-slate-400 text-[11px]">
                  Nunca uses categorías genéricas como "Restaurante" o "Tienda". Usa la categoría exacta: <em>"Restaurante de comida mexicana"</em> o <em>"Clínica de ortodoncia"</em>. Define el 60% de la concordancia de búsqueda.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold text-[11px]">2. Categorías Secundarias Acotadas</span>
                <p className="text-slate-400 text-[11px]">
                  Agrega entre 3 y 5 categorías secundarias complementarias (ej: "Restaurante familiar", "Servicio de entrega de comida a domicilio", "Bar de tapas"). Evita saturar con categorías no relacionadas.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold text-[11px]">3. NAP Consistente (Name, Address, Phone)</span>
                <p className="text-slate-400 text-[11px]">
                  El nombre, dirección exacta y teléfono deben coincidir exactamente con lo que dice su Cámara de Comercio, su página web y sus redes sociales. Las discrepancias confunden al crawler de Google.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold text-[11px]">4. Cero Keyword Stuffing en el Título</span>
                <p className="text-slate-400 text-[11px]">
                  Si el negocio se llama "Hamburguesas Juan", no pongas "Hamburguesas Juan - El Mejor Domicilio Bogotá". Google suspende fichas masivamente por manipular el nombre comercial.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold text-[11px]">5. Catálogo de Productos y Precios Activo</span>
                <p className="text-slate-400 text-[11px]">
                  Carga los 10 productos o servicios estrella con foto, precio y descripción rica en palabras clave. Los usuarios pueden comprar o reservar directamente desde la ficha de Google.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold text-[11px]">6. Horarios Especiales y Festivos Validados</span>
                <p className="text-slate-400 text-[11px]">
                  Si no confirmas si el local abre en días feriados, Google estampa un cartel amarillo: <em>"Los horarios de este lugar podrían diferir"</em>, ahuyentando a comensales hambrientos.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold text-[11px]">7. Atributos de Identidad Completos</span>
                <p className="text-slate-400 text-[11px]">
                  Configura los badges: "Entrada accesible para sillas de ruedas", "Terraza al aire libre", "Wi-Fi gratis", "Acepta tarjetas de crédito", "Ideal para niños". Estos son filtros directos en Google Maps.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold text-[11px]">8. Fototeca Georreferenciada</span>
                <p className="text-slate-400 text-[11px]">
                  Sube fotos nítidas con iluminación profesional de la fachada (para que los clientes reconozcan el local al llegar en auto), el interior, el menú y el equipo humano sonriendo.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold text-[11px]">9. Publicaciones Semanales (Google Updates)</span>
                <p className="text-slate-400 text-[11px]">
                  Publicar ofertas, platos del mes o noticias una vez a la semana le dice al algoritmo que el perfil está monitoreado constantemente por su administración.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold text-[11px]">10. Máquina de Opiniones Automatizada (Prestigia)</span>
                <p className="text-slate-400 text-[11px]">
                  El eslabón crítico. Sin un flujo automático de clientes satisfechos impulsados por QR gamificado, los primeros 9 puntos quedan indefensos ante la falta de frescura algorítmica.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CAPÍTULO 5 */}
        <section id="capitulo-5" className="space-y-6 pt-4 print-avoid-break">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black text-sm flex items-center justify-center">
              5
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-400">Guion de Venta Quirúrgico</span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                El Argumentario Inapelable para Cerrar Contratos a 12 Meses
              </h2>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              Enseña a tu equipo a utilizar estas respuestas exactas cuando el cliente plantee cualquiera de las dudas típicas de negociación:
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40">Objeción del Cliente:</span>
                  <span className="italic">"Hagámoslo por 3 meses a ver cómo nos va, y si funciona renovamos..."</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-emerald-400 block mb-1">Tu Respuesta de Consultor Senior:</strong>
                  "Don [Cliente], en 90 días nosotros lo vamos a poner en el Top 3 de Google con 4.8★ o 4.9★, eso está garantizado por la matemática del sistema. Pero quiero serle completamente franco: <strong>Google Maps penaliza severamente los perfiles que se enfrían</strong> por la Ley de Recencia. Si usted apaga Prestigia al tercer mes, dos cosas van a pasar de inmediato: 1) Su competencia activa lo desplazará del Top 3 en pocas semanas; y 2) El dique se rompe: el primer cliente que tenga una mala experiencia en el mes 4 le dejará 1 estrella directamente en Google Maps y le derrumbará todo lo que construimos. Prestigia no es una campaña de marketing de temporada: <strong>es la alarma y el seguro de su negocio</strong>. ¿Usted cancela el seguro de su coche a los 3 meses porque no ha chocado? Por eso nuestros acuerdos son de 12 meses, para blindar su patrimonio todo el año."
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40">Objeción del Cliente:</span>
                  <span className="italic">"Mis clientes no escanean códigos QR, a la gente le da pereza..."</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-emerald-400 block mb-1">Tu Respuesta de Consultor Senior:</strong>
                  "Tiene toda la razón: si usted les pone un papel frío que dice 'Danos una reseña', el 98% lo ignora. Nadie hace favores gratis. Pero Prestigia no pide favores: <strong>Prestigia utiliza gamificación e incentivos directos</strong>. Al escanear, el cliente participa en el Sorteo Oficial de la marca (con consentimiento legal de Habeas Data) y puede elegir qué mesero o colaborador lo atendió para darle su reconocimiento. Con este disparador psicológico, entre el <strong>25% y el 35% de los clientes escanean con una sonrisa</strong>. Sus clientes no tienen pereza de escanear, solo necesitaban una razón atractiva para hacerlo."
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40">Objeción del Cliente:</span>
                  <span className="italic">"¿Y qué pasa si Google descubre que estamos filtrando quejas?"</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-emerald-400 block mb-1">Tu Respuesta de Consultor Senior:</strong>
                  "Google prohíbe bloquear o amenazar clientes para que no opinen. Nosotros <strong>no bloqueamos a nadie</strong>: la arquitectura de Prestigia es un Canal Privado de Garantía y Auxilio Inmediato. Cuando un comensal tiene un inconveniente con su plato o servicio, el sistema lo comunica en menos de 15 segundos con el WhatsApp del gerente para resolver su caso antes de que abandone el local. El 92% de los clientes que se quejan solo quieren una disculpa o una solución rápida; al recibir una atención impecable en caliente, su molestia desaparece y ya no tienen ningún motivo para desahogarse en Google Maps. Cumplimos al 100% con las políticas de Google y la legislación de Habeas Data."
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CAPÍTULO 6 */}
        <section id="capitulo-6" className="space-y-6 pt-4 print-avoid-break">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <span className="w-8 h-8 rounded-xl bg-cyan-600 text-white font-black text-sm flex items-center justify-center">
              6
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">Terminología de Alta Gama</span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Diccionario Técnico de Autoridad para la Fuerza de Ventas
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-cyan-300 block mb-0.5">Google Local 3-Pack</strong>
              <span className="text-slate-400 text-[11px]">
                El bloque de los 3 únicos comercios que Google muestra debajo del mapa en las búsquedas geolocalizadas. Concentra el 80% de las conversiones de compra.
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-cyan-300 block mb-0.5">Review Velocity (Velocidad de Opiniones)</strong>
              <span className="text-slate-400 text-[11px]">
                Métrica algorítmica que calcula la tasa de nuevas opiniones recibidas en función del tiempo. Supera en ponderación al volumen histórico acumulado.
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-cyan-300 block mb-0.5">Ley de Recencia (Review Freshness)</strong>
              <span className="text-slate-400 text-[11px]">
                Penalización matemática automática que aplica Google a los perfiles que pasan más de 30 a 45 días sin recibir nuevas opiniones verificadas.
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-cyan-300 block mb-0.5">Efecto Dique Roto</strong>
              <span className="text-slate-400 text-[11px]">
                Fenómeno de caída libre en reputación que sufre un negocio al cancelar Prestigia, permitiendo que el 15% mensual de quejas humanas vuelva a golpear a Google Maps.
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-cyan-300 block mb-0.5">Extracción Semántica NLP</strong>
              <span className="text-slate-400 text-[11px]">
                Tecnología de Procesamiento de Lenguaje Natural de Google que analiza las palabras dentro de las opiniones para otorgar relevancia de búsqueda por platillos o servicios.
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-cyan-300 block mb-0.5">Fuga Financiera Oculta (Churn Reputacional)</strong>
              <span className="text-slate-400 text-[11px]">
                Dinero que el negocio deja escapar cada mes por el 96% de clientes insatisfechos que pagan la cuenta pero deciden nunca más regresar en silencio.
              </span>
            </div>
          </div>
        </section>

        {/* PRINT / DOWNLOAD ACTION BANNER */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border-2 border-indigo-500/50 text-center space-y-4 print:hidden">
          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="text-lg sm:text-xl font-black text-white">
              ¿Quieres este Manual en Formato Físico o PDF de Alta Definición?
            </h3>
            <p className="text-xs text-slate-300">
              Utiliza el motor de impresión ejecutiva de Prestigia para guardarlo como un manual PDF de capacitación para ti y todos los vendedores que sumes a tu equipo.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm transition flex items-center gap-2 shadow-xl shadow-indigo-600/30 cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar Guía Completa en PDF</span>
            </button>

            <Link
              href="/auditor"
              className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition cursor-pointer"
            >
              Ir a Auditar un Negocio en Vivo →
            </Link>
          </div>
        </section>

        {/* Executive Certification Footer */}
        <footer className="pt-6 pb-12 border-t border-slate-800 text-center text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-400">
            Prestigia Reputation System • Manual Confidencial de Capacitación en Posicionamiento Local © 2026
          </p>
          <p className="text-[11px] text-slate-600">
            Documento de uso interno y comercial para consultores y directores de cuenta Prestigia Enterprise LatAm.
          </p>
        </footer>
      </main>
    </div>
  );
}
