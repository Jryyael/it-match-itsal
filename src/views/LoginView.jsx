import React, { useState } from 'react';
import {
  ArrowRight,
  FileCheck2,
  GraduationCap,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import MascotSprite from '../components/MascotSprite';

const MARQUEE_TOPICS = [
  'Banco Inteligente de Residencias Profesionales',
  'TecNM ITSAL',
  'Emparejamiento Académico con IA',
  'Validación Oficial con Código QR',
  'Vinculación y Academia Digital',
  'Periodo 2026',
];

const QUICK_ROLES = [
  {
    userId: 'demo-estudiante',
    title: 'Alumno',
    subtitle: 'Catálogo IA, postulación y propuestas',
    icon: GraduationCap,
  },
  {
    userId: 'demo-docente',
    title: 'Docente',
    subtitle: 'Registro oficial de proyectos y QR',
    icon: FileCheck2,
  },
  {
    userId: 'demo-jefatura',
    title: 'Jefatura',
    subtitle: 'Reunión de Academia, asesor y vinculación',
    icon: UserCheck,
  },
  {
    userId: 'demo-directivo',
    title: 'Subdirección',
    subtitle: 'Cobertura, SGC y Servidor BD ITSAL',
    icon: ShieldCheck,
  },
];

export default function LoginView() {
  const { loginAsDemo, loginWithCredentials, goToLanding } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const res = loginWithCredentials(identifier, password);
    if (!res.ok) {
      setError(res.error);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#FAF8F5] text-[#0D2240] overflow-x-clip select-none">
      {/* Acentos geométricos sutiles en el fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(13, 34, 64, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(13, 34, 64, 0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-[640px] rounded-full bg-[#009FE3]/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-[#0D2240]/[0.04] blur-3xl" />
      </div>

      {/* 1. CINTA SUPERIOR CON MOVIMIENTO CONTINUO (MARQUEE INFORMATIVO) */}
      <header className="relative z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xs py-2.5 overflow-hidden">
        <div className="animate-marquee">
          {[0, 1, 2, 3].map((loopIdx) => (
            <div key={loopIdx} className="flex items-center gap-5 px-3">
              {MARQUEE_TOPICS.map((text, idx) => (
                <React.Fragment key={`${loopIdx}-${idx}`}>
                  <span className="text-xs font-bold tracking-tight text-[#0D2240] whitespace-nowrap">
                    {text}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#009FE3] shadow-[0_0_8px_#009FE3]"
                  />
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </header>

      {/* 2. BLOQUE CENTRAL DE ACCESO CON EL OSO PROTAGONISTA */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-10">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200/90 bg-white/95 p-6 sm:p-8 shadow-[0_24px_60px_-24px_rgba(13,34,64,0.16)] backdrop-blur-xs animate-it-enter">
          {/* Título IT Match + Oso mascota con sudadera azul marino y circuito AI */}
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-[#FAF8F5] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-[#009FE3]" />
              Residencias Profesionales · TecNM ITSAL
            </div>

            <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-[#0D2240]">
              <span className="text-[#009FE3]">IT</span> Match
            </h1>

            <div className="relative mt-2 mb-1 flex items-center justify-center">
              <div
                aria-hidden="true"
                className="absolute inset-4 rounded-full bg-[#009FE3]/15 blur-xl"
              />
              <MascotSprite
                pose={1}
                variant="full"
                blend={true}
                className="relative z-10 w-32 sm:w-36 animate-it-float"
              />
            </div>
          </div>

          {/* Formulario de acceso limpio */}
          <form onSubmit={handleSubmit} className="mt-3 space-y-3">
            <div>
              <label
                htmlFor="login-identifier"
                className="mb-1 block text-xs font-bold text-[#0D2240]"
              >
                Matrícula o Correo Institucional
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="login-identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Matrícula o Correo Institucional @salinacruz.tecnm.mx"
                  className="w-full rounded-xl border border-slate-200 bg-[#FAF8F5] py-2.5 pl-10 pr-3.5 text-sm text-[#0D2240] placeholder:text-slate-400 focus:border-[#009FE3] focus:bg-white focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-1 block text-xs font-bold text-[#0D2240]"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full rounded-xl border border-slate-200 bg-[#FAF8F5] py-2.5 pl-10 pr-3.5 text-sm text-[#0D2240] placeholder:text-slate-400 focus:border-[#009FE3] focus:bg-white focus:outline-none transition"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0D2240] px-4 py-3 text-sm font-extrabold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#163663]"
            >
              Iniciar Sesión
              <ArrowRight className="h-4 w-4 text-[#009FE3]" />
            </button>
          </form>

          {/* 3. BLOQUE "ACCESO DIRECTO PARA EVALUAR" EN CUADRÍCULA 2x2 */}
          <div className="mt-6 border-t border-slate-200 pt-5">
            <div className="mb-3 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              <KeyRound className="h-3.5 w-3.5 text-[#009FE3]" />
              Acceso directo para evaluar
            </div>

            <div className="grid grid-cols-2 gap-3">
              {QUICK_ROLES.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.userId}
                    type="button"
                    onClick={() => loginAsDemo(item.userId)}
                    className="group flex items-start gap-2.5 rounded-xl border border-slate-200 bg-[#FAF8F5] p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#009FE3] hover:bg-white hover:shadow-md"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0D2240] text-[#009FE3] transition-colors group-hover:bg-[#009FE3] group-hover:text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-[#0D2240] leading-tight">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-snug text-slate-500 line-clamp-2">
                        {item.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Firma minimalista en esquina inferior izquierda + enlace discreto a Portada */}
      <footer className="relative z-10 flex items-center justify-between px-6 py-4 text-xs text-slate-500">
        <span className="font-semibold tracking-tight text-slate-600">
          IT Match · TecNM ITSAL
        </span>
        <button
          type="button"
          onClick={goToLanding}
          className="text-xs font-semibold text-slate-500 transition hover:text-[#009FE3]"
        >
          Ver Portada institucional →
        </button>
      </footer>
    </div>
  );
}
