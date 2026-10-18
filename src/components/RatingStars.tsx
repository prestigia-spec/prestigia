'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  onSelectRating: (rating: number) => void;
  disabled?: boolean;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Experiencia insatisfactoria',
  2: 'Hubo detalles a mejorar',
  3: 'Aceptable, pero con observaciones',
  4: '¡Muy buena experiencia!',
  5: '¡Excelente, servicio impecable!',
};

export function RatingStars({ onSelectRating, disabled = false }: RatingStarsProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const handleSelect = (rating: number) => {
    if (disabled) return;
    setSelectedRating(rating);
    onSelectRating(rating);
  };

  const activeRating = hoveredRating ?? selectedRating;

  return (
    <div className="flex flex-col items-center w-full my-6">
      <div className="flex items-center justify-center gap-2 sm:gap-3 py-3">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = activeRating !== null && star <= activeRating;
          return (
            <button
              key={star}
              type="button"
              disabled={disabled}
              onClick={() => handleSelect(star)}
              onMouseEnter={() => !disabled && setHoveredRating(star)}
              onMouseLeave={() => !disabled && setHoveredRating(null)}
              className={`p-2 transition-all duration-200 transform active:scale-90 focus:outline-none ${
                disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:scale-110'
              }`}
              aria-label={`Calificar con ${star} estrella${star > 1 ? 's' : ''}`}
            >
              <Star
                className={`w-11 h-11 sm:w-12 sm:h-12 transition-colors duration-200 ${
                  isFilled
                    ? 'fill-prestigia-gold text-prestigia-gold drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                    : 'text-slate-600 hover:text-slate-400'
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="h-8 flex items-center justify-center text-center mt-1">
        {activeRating ? (
          <span
            className={`text-sm sm:text-base font-semibold transition-all duration-300 ${
              activeRating >= 4 ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {RATING_LABELS[activeRating]}
          </span>
        ) : (
          <span className="text-xs sm:text-sm text-prestigia-muted">
            Toca una estrella para evaluar tu experiencia
          </span>
        )}
      </div>
    </div>
  );
}
