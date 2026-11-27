import React from 'react';
import { ChevronLeft, ChevronRight, Compass, MousePointerClick, X } from 'lucide-react';
import { TOUR_STEPS, useApp } from '../context/AppContext';

export default function GuidedTourCard() {
  const { tourActive, tourStepIndex, goToTourStep, closeTour } = useApp();

  if (!tourActive) return null;

  const current = TOUR_STEPS[tourStepIndex];
  const isFirst = tourStepIndex === 0;
  const isLast = tourStepIndex === TOUR_STEPS.length - 1;

  return (
    <aside
      aria-label="Tour guiado interactivo"
      className="no-print fixed bottom-5 left-5 z-40 w-[calc(100vw-2.5rem)] max-w-sm rounded-3xl border border-[#E2E8F0] bg-white shadow-2xl overflow-hidden animate-it-enter"
    >
      <div className="h-1.5 w-full bg-slate-100">
        <div
          className="h-full bg-[#009FE3] transition-all duration-300"
          style={{ width: `${((tourStepIndex + 1) / TOUR_STEPS.length) * 100}%` }}
        />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0D2240] text-xs font-extrabold text-[#009FE3]">
              {current.step}/{TOUR_STEPS.length}
            </span>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#D99B16]">
                {current.roleLabel}
              </p>
              <h4 className="text-sm font-extrabold text-[#0D2240]">
                {current.title}
              </h4>
            </div>
          </div>
          <button
            type="button"
            onClick={closeTour}
            aria-label="Cerrar tour"
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-[#0D2240]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-2.5 text-xs leading-relaxed text-slate-600">
          {current.description}
        </p>

        <div className="mt-3 rounded-2xl border border-[#009FE3]/30 bg-[#FAF8F5] p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#009FE3]">
            <MousePointerClick className="h-3.5 w-3.5" />
            Acción recomendada en vivo:
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[#0D2240]">
            {current.actionHint}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1">
            {TOUR_STEPS.map((s, idx) => (
              <button
                key={s.step}
                type="button"
                onClick={() => goToTourStep(idx)}
                aria-label={`Ir al paso ${s.step}`}
                className={`h-2 rounded-full transition-all ${
                  idx === tourStepIndex
                    ? 'w-5 bg-[#009FE3]'
                    : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isFirst}
              onClick={() => goToTourStep(tourStepIndex - 1)}
              className="inline-flex items-center gap-1 rounded-full border border-[#E2E8F0] px-3 py-1.5 text-xs font-bold text-[#0D2240] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Anterior
            </button>

            {isLast ? (
              <button
                type="button"
                onClick={closeTour}
                className="inline-flex items-center gap-1 rounded-full bg-[#0D2240] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#009FE3]"
              >
                <Compass className="h-3.5 w-3.5" />
                Finalizar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => goToTourStep(tourStepIndex + 1)}
                className="inline-flex items-center gap-1 rounded-full bg-[#009FE3] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#0088C6]"
              >
                Siguiente
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
