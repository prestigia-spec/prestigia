'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  MessageCircle,
  Send,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  X,
} from 'lucide-react';
import {
  COUNTRIES,
  DEFAULT_COUNTRY,
  detectUserCountry,
  toE164Phone,
  validatePhoneNumber,
  CountryDialInfo,
} from '@/lib/countries';

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
  businessId: string;
  businessName: string;
  rating: number;
  plan?: 'basic' | 'pro' | 'elite';
  managerPhone?: string;
  staffMembers?: any[];
  preselectedStaff?: string;
  containmentMessage?: string;
  responseTimeSla?: string;
  lang?: 'es' | 'en';
}

export function ComplaintModal({
  isOpen,
  onClose,
  onSubmitted,
  businessId,
  businessName,
  rating,
  plan = 'basic',
  managerPhone,
  staffMembers = [],
  preselectedStaff = '',
  containmentMessage,
  responseTimeSla,
  lang = 'es',
}: ComplaintModalProps) {
  const isEn = lang === 'en';
  const [customerName, setCustomerName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryDialInfo>(DEFAULT_COUNTRY);
  const [customerPhone, setCustomerPhone] = useState('');
  const [complaintReason, setComplaintReason] = useState('');
  const [attendedBy, setAttendedBy] = useState(preselectedStaff || '');
  const [isEditingStaff, setIsEditingStaff] = useState(false);
  const [clubConsent, setClubConsent] = useState(true);

  // Sync preselected staff if it changes from parent
  useEffect(() => {
    if (preselectedStaff) {
      setAttendedBy(preselectedStaff);
    }
  }, [preselectedStaff]);

  // Auto-adapt country to user's real geographic location
  useEffect(() => {
    setSelectedCountry(detectUserCountry('CO'));
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneWarning, setPhoneWarning] = useState('');

  if (!isOpen) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permite solo letras (incluye acentos latinos y eñes) y espacios
    const lettersOnly = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    setCustomerName(lettersOnly);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permite exclusivamente números y según el máximo de dígitos del país seleccionado
    const digitsOnly = e.target.value.replace(/[^0-9]/g, '').slice(0, selectedCountry.maxDigits);
    setCustomerPhone(digitsOnly);

    if (errorMessage) setErrorMessage('');

    if (digitsOnly.length > 0) {
      const val = validatePhoneNumber(selectedCountry, digitsOnly, isEn);
      if (!val.valid) {
        setPhoneWarning(val.error || '');
      } else {
        setPhoneWarning('');
      }
    } else {
      setPhoneWarning('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim() || !customerPhone.trim() || !complaintReason.trim()) {
      setErrorMessage(isEn ? 'Please fill in all required fields so we can assist you immediately.' : 'Por favor completa los campos obligatorios para atenderte de inmediato.');
      return;
    }

    const val = validatePhoneNumber(selectedCountry, customerPhone, isEn);
    if (!val.valid) {
      setErrorMessage(val.error || (isEn ? 'Enter a valid phone number.' : 'Ingresa un número telefónico válido.'));
      return;
    }

    const fullE164 = toE164Phone(selectedCountry.dialCode, customerPhone);

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          rating,
          customerName: customerName.trim(),
          customerPhone: fullE164,
          complaintReason: complaintReason.trim(),
          attendedBy: plan !== 'basic' && attendedBy.trim() ? attendedBy.trim() : undefined,
          clubConsent,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (isEn ? 'Error submitting report' : 'Error al enviar el reporte'));
      }

      setIsSuccess(true);
      if (onSubmitted) onSubmitted();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || (isEn ? 'An error occurred while sending your report.' : 'Ocurrió un error al enviar tu reporte.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanManagerPhone = managerPhone ? managerPhone.replace(/[^0-9]/g, '') : '';
  const managerWhatsAppText = encodeURIComponent(
    isEn
      ? `Hello, I am at ${businessName} and I just registered a feedback regarding service experience (Rating ${rating}★).`
      : `Hola, me encuentro en ${businessName} y acabo de registrar una inconformidad sobre la atención/servicio recibido (Calificación ${rating}★).`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-prestigia-card border border-prestigia-cardBorder rounded-2xl p-6 sm:p-8 shadow-2xl glow-alert text-white">
        
        {/* Close button (only visible if not successfully submitted) */}
        {!isSuccess && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
            aria-label={isEn ? "Close modal" : "Cerrar modal"}
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {isSuccess ? (
          /* Success Screen */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-bold tracking-tight text-white">
              {isEn ? 'Message Received by Management' : 'Mensaje Recibido por Gerencia'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
              {isEn ? (
                <>
                  We are very sorry that your experience was not perfect. 
                  The management team at <strong className="text-white">{businessName}</strong> has received your report and will reach out to you shortly.
                </>
              ) : (
                <>
                  Lamentamos mucho que tu experiencia no haya sido perfecta. 
                  El equipo de administración de <strong className="text-white">{businessName}</strong> ya tiene tu reporte y te contactará a la brevedad.
                </>
              )}
            </p>

            {/* Pro & Élite Plan Feature: Direct Urgent WhatsApp to Manager */}
            {plan !== 'basic' && cleanManagerPhone && (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-left space-y-2 mt-2">
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>{isEn ? 'Do you need urgent attention or immediate resolution on-site?' : '¿Requieres atención urgente o solución inmediata en sede?'}</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {isEn
                    ? 'You can write right now to Management / Venue In-Charge for priority resolution:'
                    : 'Puedes escribirle en este instante a la Gerencia / Encargado de Sede para darte solución prioritaria:'}
                </p>
                <a
                  href={`https://wa.me/${cleanManagerPhone}?text=${managerWhatsAppText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition active:scale-[0.98] shadow-md shadow-emerald-500/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isEn ? 'Contact Venue Management via WhatsApp' : 'Contactar Gerencia de Sede por WhatsApp'}</span>
                </a>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-6 rounded-xl bg-prestigia-primary hover:bg-prestigia-primaryHover text-white font-semibold text-sm transition shadow-lg shadow-indigo-500/25"
              >
                {isEn ? 'Close and Continue' : 'Cerrar y Continuar'}
              </button>
            </div>
          </div>
        ) : (
          /* Complaint Form */
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-prestigia-alert">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {isEn ? 'We want to make things right and resolve this' : 'Queremos compensarte y solucionar'}
                </h3>
                <span className="text-xs text-amber-400 font-medium">
                  {isEn ? `Recorded rating: ${rating} of 5 stars` : `Calificación registrada: ${rating} de 5 estrellas`}
                </span>
              </div>
            </div>

            {containmentMessage ? (
              <div className="mb-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1.5">
                <p className="text-xs text-amber-200/90 leading-relaxed font-medium italic">
                  "{containmentMessage}"
                </p>
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-amber-500/20 text-[10px]">
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-400" />
                    <span>{isEn ? 'Management Protocol' : 'Protocolo de Gerencia'}</span>
                  </span>
                  {responseTimeSla && (
                    <span className="text-emerald-400 font-mono font-bold bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                      ⚡ {isEn ? `Attention SLA: ${responseTimeSla}` : `SLA de Atención: ${responseTimeSla}`}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                {isEn ? (
                  <>At <strong className="text-white">{businessName}</strong> your feedback is completely private; it reaches the management team directly to provide you a solution.</>
                ) : (
                  <>En <strong className="text-white">{businessName}</strong> tu inconformidad no será pública; llegará directamente al equipo de gerencia para darte una solución.</>
                )}
              </p>
            )}

            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-500/30 flex items-center gap-2 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isEn ? 'Your Full Name *' : 'Tu Nombre Completo *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isEn ? "E.g., John Doe" : "Ej: Carlos Gómez"}
                  value={customerName}
                  onChange={handleNameChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-prestigia-primary transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    {isEn ? 'Your Contact WhatsApp *' : 'Tu WhatsApp de Contacto *'}
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {customerPhone.length}/{selectedCountry.maxDigits} {isEn ? 'digits' : 'dígitos'}
                  </span>
                </div>
                <div className="flex items-center gap-2 w-full">
                  <select
                    value={selectedCountry.code}
                    onChange={(e) => {
                      const found = COUNTRIES.find((c) => c.code === e.target.value) || DEFAULT_COUNTRY;
                      setSelectedCountry(found);
                      setPhoneWarning('');
                      setCustomerPhone('');
                    }}
                    aria-label={isEn ? "Select country code" : "Seleccionar código de país"}
                    className="h-[42px] w-[115px] sm:w-[130px] px-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-prestigia-primary cursor-pointer shrink-0 truncate"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                        {c.flag} {c.dialCode} ({isEn ? c.nameEn : c.name})
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    required
                    maxLength={selectedCountry.maxDigits}
                    inputMode="numeric"
                    placeholder={`Ej: ${selectedCountry.example}`}
                    value={customerPhone}
                    onChange={handlePhoneChange}
                    className={`flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-slate-900/90 border text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none transition ${
                      phoneWarning ? 'border-red-500/80 focus:border-red-400' : 'border-slate-700 focus:border-prestigia-primary'
                    }`}
                  />
                </div>
                {phoneWarning && (
                  <p className="mt-1 text-[11px] text-red-400 flex items-center gap-1">
                    <span>⚠️</span>
                    <span>{phoneWarning}</span>
                  </p>
                )}
              </div>

              {/* Staff Member Selection (Pro & Élite): Hereda lo seleccionado en la pantalla principal */}
              {plan !== 'basic' && (
                <div>
                  {preselectedStaff && !isEditingStaff ? (
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="text-xs text-slate-300">
                          {isEn ? 'Attended by:' : 'Atendido por:'}{' '}
                          <strong className="text-white font-bold">{attendedBy || preselectedStaff}</strong>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsEditingStaff(true)}
                        className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                      >
                        {isEn ? 'Change' : 'Cambiar'}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{isEn ? 'Who attended you today? (Optional)' : '¿Quién te atendió el día de hoy? (Opcional)'}</span>
                      </label>

                      {staffMembers && staffMembers.length > 0 ? (
                        <select
                          value={attendedBy}
                          onChange={(e) => setAttendedBy(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-prestigia-primary transition"
                        >
                          <option value="">{isEn ? 'Select staff member or associate...' : 'Seleccionar persona o colaborador...'}</option>
                          {staffMembers.map((member: any) => {
                            const mName = typeof member === 'object' && member !== null ? member.name : String(member);
                            const mRole = typeof member === 'object' && member !== null && member.role ? ` (${member.role})` : '';
                            return (
                              <option key={mName} value={mName}>
                                {mName}{mRole}
                              </option>
                            );
                          })}
                          <option value="Otro / No recuerdo">{isEn ? "Other / Don't recall the name" : "Otro / No recuerdo el nombre"}</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          placeholder={isEn ? "Name of staff member or professional who served you..." : "Nombre de la persona o profesional que te atendió..."}
                          value={attendedBy}
                          onChange={(e) => setAttendedBy(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-prestigia-primary transition"
                        />
                      )}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {isEn ? 'What happened or how can we improve? *' : '¿Qué sucedió o qué podemos solucionar? *'}
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder={isEn ? "Tell us with full confidence what didn't meet your expectations..." : "Cuéntanos con total confianza qué no cumplió tus expectativas..."}
                  value={complaintReason}
                  onChange={(e) => setComplaintReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-prestigia-primary transition resize-none"
                />
              </div>

              {/* Universal: Habeas Data & Club Consent */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="clubConsent"
                  checked={clubConsent}
                  onChange={(e) => setClubConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-prestigia-primary focus:ring-0 cursor-pointer shrink-0"
                />
                <label htmlFor="clubConsent" className="text-[11px] text-slate-300 cursor-pointer leading-snug">
                  {isEn ? (
                    <>I wish to join the brand's <strong className="text-white font-semibold">Benefits Club</strong> to receive promotions and authorize the treatment of my personal data.</>
                  ) : (
                    <>Deseo pertenecer al <strong className="text-white font-semibold">Club de Beneficios</strong> de la marca para recibir ofertas y autorizo el tratamiento de mis datos personales (Habeas Data).</>
                  )}
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-prestigia-primary hover:bg-prestigia-primaryHover text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{isEn ? 'Sending secure report...' : 'Enviando reporte seguro...'}</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{isEn ? 'Send to Private Management' : 'Enviar a Gerencia Privada'}</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-500">
                {isEn ? '🔒 Your privacy is protected. This message is never published on Google Maps or social networks.' : '🔒 Tu privacidad está protegida. Este mensaje no se publica en Google Maps ni en redes sociales.'}
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
