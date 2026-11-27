import React from 'react';
import {
  ArrowRight,
  BarChart3,
  Building2,
  Compass,
  FileCheck2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const FLOW_STEPS = [
  { num: '1', label: 'Propuesta (QR)', icon: FileCheck2 },
  { num: '2', label: 'Validación (Jefatura)', icon: UserCheck },
  { num: '3', label: 'Match IA (Estudiante)', icon: Sparkles },
  { num: '4', label: 'Indicadores (SGC)', icon: BarChart3 },
];

const ROLE_LINKS = [
  {
    roleId: 'estudiante',
    title: 'Estudiante',
    desc: 'Explora el catálogo y calcula tu % de afinidad IA.',
    icon: GraduationCap,
  },
  {
    roleId: 'docente',
    title: 'Docente / Empresa',
    desc: 'Registra propuestas con asistente IA y formato QR.',
    icon: Building2,
  },
  {
    roleId: 'jefatura',
    title: 'Jefatura / Vinculación',
    desc: 'Valida proyectos externos y asigna residentes.',
    icon: UserCheck,
  },
  {
    roleId: 'directivo',
    title: 'Directivo / SGC',
    desc: 'Consulta métricas consolidadas, CSV y PDF SGC.',
    icon: ShieldCheck,
  },
];

export default function WelcomeModal() {
  const { welcomeOpen, closeWelcome, enterProtectedModule, startGuidedTour } = useApp();

  if (!welcomeOpen) return null;

  const handleSelectProfile = (roleId) => {
    closeWelcome();
    enterProtectedModule(roleId);
  };

  return (
    <div className="no-print fixed inset-0 z-[70] flex items-center justify-center bg-[#0B0F17]/75 p-4 overflow-y-auto backdrop-blur-xs">
      <div className="relative my-4 w-full max-w-4xl rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl overflow-hidden animate-modal-in">
        <div className="h-1 w-full bg-[#0B0F17]" />

        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 shrink-0 rounded-2xl overflow-hidden border border-[#E2E8F0]">
                <img
                  src="/logo-itmatch.jpg"
                  alt="Logo IT Match"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#009FE3]">
                  Guía de la Plataforma · TecNM ITSAL
                </p>
                <h2 className="mt-0.5 text-2xl font-black tracking-tight text-[#0D2240]">
                  ¿Cómo funciona <span className="text-[#009FE3]">IT</span> Match?
                </h2>
                <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600">
                  El portal digital del Instituto Tecnológico de Salina Cruz donde los estudiantes encuentran proyectos de Residencia Profesional con ayuda de IA, y los docentes o empresas registran propuestas con formato oficial y código QR.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeWelcome}
              aria-label="Cerrar guía"
              className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-[#0D2240]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-[#FAF8F5] p-4">
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Flujo completo del sistema:
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 relative">
              {FLOW_STEPS.map((st, idx) => {
                const Icon = st.icon;
                return (
                  <div key={st.num} className="relative flex items-center gap-3 sm:flex-col sm:text-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B0F17] text-white">
                      <Icon className="h-4 w-4 text-[#009FE3]" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#009FE3]">
                        Paso {st.num}
                      </span>
                      <span className="text-xs font-extrabold text-[#0D2240]">
                        {st.label}
                      </span>
                    </div>
                    {idx < FLOW_STEPS.length - 1 && (
                      <ArrowRight className="hidden sm:block absolute -right-3 top-3 h-4 w-4 text-[#D99B16]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Accede directamente a cualquier vista:
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {ROLE_LINKS.map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.roleId}
                    type="button"
                    onClick={() => handleSelectProfile(card.roleId)}
                    className="group flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-4 text-left transition hover:border-[#0D2240] hover:shadow-md"
                  >
                    <div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0D2240] text-[#009FE3] transition group-hover:bg-[#009FE3] group-hover:text-white">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="mt-3 text-sm font-extrabold text-[#0D2240]">
                        {card.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        {card.desc}
                      </p>
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#009FE3]">
                      Abrir vista <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-5">
            <p className="text-xs text-slate-500">
              ¿Evaluando el sistema? Inicia el recorrido guiado en vivo.
            </p>
            <div className="flex w-full sm:w-auto items-center gap-2.5">
              <button
                type="button"
                onClick={closeWelcome}
                className="w-full sm:w-auto rounded-full border border-[#E2E8F0] px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={startGuidedTour}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#0D2240] px-5 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#009FE3]"
              >
                <Compass className="h-4 w-4" />
                Iniciar Tour Guiado (4 pasos)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
