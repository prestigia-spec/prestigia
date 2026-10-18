import React from 'react';

interface PrestigiaIconProps {
  className?: string;
  size?: number;
}

export function PrestigiaIcon({ className = "w-8 h-8", size }: PrestigiaIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="Isotipo Oficial Prestigia"
    >
      {/* Escudo exterior (Blindaje / Seguridad) */}
      <path
        d="M50 8L82 22V52C82 72 68 88 50 94C32 88 18 72 18 52V22L50 8Z"
        fill="#0B111E"
        stroke="#6366F1"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* Pin de localización (Google Maps / Comercio Local) */}
      <path
        d="M50 28C41.16 28 34 35.16 34 44C34 54.5 47 68 50 71C53 68 66 54.5 66 44C66 35.16 58.84 28 50 28Z"
        fill="#6366F1"
      />
      {/* Estrella dorada central (5 Estrellas de Reputación) */}
      <polygon
        points="50,37 52.5,43 59,43.5 54,47.5 56,54 50,50 44,54 46,47.5 41,43.5 47.5,43"
        fill="#F59E0B"
      />
    </svg>
  );
}
