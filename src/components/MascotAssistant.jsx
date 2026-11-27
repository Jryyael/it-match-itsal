import React, { useEffect, useState } from 'react';
import { ArrowRight, Minus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import MascotSprite from './MascotSprite';

const ROTATING_TIPS = [
  {
    pose: 1,
    message: '¡Hola! Soy tu guía de IT Match. Elige tu perfil para empezar',
  },
  {
    pose: 2,
    message: 'Ajusta tus habilidades para calcular tu % de afinidad académica',
  },
  {
    pose: 3,
    message: 'Aquí redactas tu propuesta y generas el formato oficial con código QR',
  },
  {
    pose: 4,
    message: 'Haz clic en este botón para probar esta función en vivo',
  },
  {
    pose: 5,
    message: '¡Meta cumplida! Consulta los indicadores y reportes oficiales',
  },
  {
    pose: 6,
    message: 'Analizando competencias clave y requisitos del proyecto...',
  },
  {
    pose: 7,
    message: '¡Excelente! Acción registrada correctamente en el sistema',
  },
  {
    pose: 8,
    message: 'Filtrando oportunidades de residencia por carrera y área...',
  },
  {
    pose: 9,
    message: '¡Bienvenido a IT Match! Todo está listo para explorar',
  },
];

export default function MascotAssistant() {
  const {
    mascotContext,
    setMascotContext,
    tourActive,
    goToTourStep,
    tourStepIndex,
    activeSurface,
    activeView,
    welcomeOpen,
    mascotHidden,
  } = useApp();

  // Inicia minimizado por defecto para nunca tapar el marquee ni botones inferiores
  const [bubbleOpen, setBubbleOpen] = useState(false);

  useEffect(() => {
    if (tourActive) {
      setBubbleOpen(true);
    } else {
      setBubbleOpen(false);
    }
  }, [activeSurface, tourActive]);

  if (welcomeOpen || mascotHidden || activeSurface === 'login') return null;

  const isSpaceView = activeSurface === 'app' && activeView === 'registro';
  const effectivePose = isSpaceView ? 1 : mascotContext.pose;

  const handleNextTip = () => {
    if (tourActive) {
      const nextStep = (tourStepIndex + 1) % 4;
      goToTourStep(nextStep);
      return;
    }
    const nextIdx = mascotContext.pose % ROTATING_TIPS.length;
    const tip = ROTATING_TIPS[nextIdx];
    setMascotContext(tip.pose, tip.message);
  };

  if (!bubbleOpen) {
    return (
      <button
        type="button"
        onClick={() => setBubbleOpen(true)}
        aria-label="Abrir guía IT Match"
        title="Abrir asistente IT Match"
        className="no-print fixed bottom-5 right-5 z-40 animate-it-float flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#009FE3] bg-white p-0.5 shadow-lg transition duration-200 ease-out hover:scale-105"
      >
        <MascotSprite
          pose={effectivePose}
          variant="avatar"
          className="h-full w-full rounded-full"
        />
      </button>
    );
  }

  return (
    <div className="no-print fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 max-w-[calc(100vw-2rem)]">
      <div className="w-64 sm:w-72 rounded-2xl border-2 border-[#009FE3] bg-white p-3.5 shadow-2xl animate-it-enter">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-[#009FE3]/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#009FE3]">
            Guía IT Match
          </span>
          <button
            type="button"
            onClick={() => setBubbleOpen(false)}
            aria-label="Minimizar asistente"
            title="Minimizar asistente"
            className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-[#0D2240]"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
        </div>

        <p className="mt-2 text-xs font-semibold leading-relaxed text-[#0D2240]">
          {mascotContext.message}
        </p>

        <div className="mt-2.5 flex items-center justify-end border-t border-slate-100 pt-2">
          <button
            type="button"
            onClick={handleNextTip}
            className="inline-flex items-center gap-1 rounded-full bg-[#0D2240] px-3 py-1 text-[11px] font-bold text-white transition hover:bg-[#009FE3]"
          >
            Siguiente tip
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setBubbleOpen(false)}
        aria-label="Minimizar guía"
        className="animate-it-float flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#009FE3] bg-white p-0.5 shadow-lg transition duration-200 ease-out hover:scale-105"
      >
        <MascotSprite
          pose={effectivePose}
          variant="avatar"
          className="h-full w-full rounded-full"
        />
      </button>
    </div>
  );
}
