import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  variant?: 'compact' | 'badge' | 'full';
}

export function TechnologicalSolutionsLogo({
  className = 'h-9',
  size,
  showText = true,
  variant = 'compact',
}: LogoProps) {
  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center gap-3 ${className}`}>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
          <img
            src="/technological-solutions-logo.jpg"
            alt="Technological Solutions Software"
            className="relative w-36 h-36 object-contain rounded-2xl border border-cyan-500/40 shadow-2xl bg-[#070A12]"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${className}`}
      style={size ? { height: size } : undefined}
      title="Technological Solutions Software - Enterprise Division"
    >
      {/* Escudo Oficial Technological Solutions Software desde el Escritorio */}
      <img
        src="/technological-solutions-logo.jpg"
        alt="Technological Solutions Software Logo"
        className="h-full w-auto object-contain rounded-lg border border-cyan-500/40 shadow-[0_0_12px_rgba(56,189,248,0.35)] shrink-0 bg-[#070A12]"
      />

      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <span className="text-[12px] sm:text-[13px] font-black tracking-wider text-white uppercase font-sans">
            TECHNOLOGICAL SOLUTIONS
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.22em] text-cyan-400 uppercase">
            SOFTWARE &bull; ENTERPRISE
          </span>
        </div>
      )}
    </div>
  );
}
