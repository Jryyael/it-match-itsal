import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  CheckCircle2,
  Cpu,
  FileCheck2,
  LayoutGrid,
  MapPin,
  MoveHorizontal,
  QrCode,
  Sparkles,
  Target,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CARRERAS_ITSAL, COMPLETED_RESIDENCIA_CASES } from '../data/mockData';
import { Reveal } from '../hooks/useScrollReveal';
import MascotSprite from '../components/MascotSprite';
import { StatusBadge } from '../components/StatusBadge';
import ProjectDetailModal from '../components/ProjectDetailModal';
import OfficialFormatModal from '../components/OfficialFormatModal';

export default function LandingView() {
  const {
    projects,
    enterProtectedModule,
    startGuidedTour,
    setMascotHidden,
  } = useApp();

  const [showcaseMode, setShowcaseMode] = useState('marquee');
  const [selectedCase, setSelectedCase] = useState(null);
  const [pdfCase, setPdfCase] = useState(null);

  useEffect(() => {
    setMascotHidden?.(Boolean(selectedCase || pdfCase));
    return () => setMascotHidden?.(false);
  }, [selectedCase, pdfCase, setMascotHidden]);

  const publishedCount = projects.filter((p) => p.estado === 'Publicado').length;
  const totalSeats = projects.reduce((sum, p) => sum + (Number(p.alumnosRequeridos) || 0), 0);

  const heroCardRibbon = [
    'Emparejamiento Académico IA',
    `${publishedCount} proyectos activos`,
    `${totalSeats} plazas disponibles`,
    'Formato Oficial con QR',
  ];

  const bottomMarqueeItems = [
    { text: 'IT Match · TecNM ITSAL', color: 'text-[#009FE3]' },
    { text: `${publishedCount} Proyectos Publicados`, color: 'text-[#D99B16]' },
    { text: `${totalSeats} Plazas en Empresas y Academia`, color: 'text-[#009FE3]' },
    { text: 'Evaluación con Formato Oficial QR', color: 'text-[#D99B16]' },
    { text: 'Seguimiento Transparente por Periodo 2026', color: 'text-[#009FE3]' },
  ];

  const renderCompletedCard = (item, keyPrefix = '') => (
    <button
      key={`${keyPrefix}${item.id}`}
      type="button"
      onClick={() => setSelectedCase(item)}
      className={`group flex flex-col justify-between rounded-3xl border border-[#E2E8F0] bg-white p-5 text-left transition duration-200 ease-out hover:-translate-y-1 hover:border-[#009FE3] hover:shadow-md ${
        showcaseMode === 'marquee' ? 'w-[340px] sm:w-[375px] shrink-0' : 'w-full'
      }`}
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <StatusBadge estado={item.estado} />
          <span className="font-mono text-[11px] font-semibold text-slate-400">
            {item.periodo}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3.5">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#009FE3] truncate">
              {item.perfilRequerido}
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-slate-500 truncate">
              {item.departamento} · {item.institucion}
            </p>
            <h3 className="mt-2 text-base font-extrabold leading-snug text-[#0D2240] line-clamp-2 group-hover:text-[#009FE3] transition-colors">
              {item.titulo}
            </h3>
          </div>

          <MascotSprite
            pose={item.bearPose || 5}
            variant="full"
            blend={true}
            className="w-20 sm:w-22 shrink-0 transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105"
          />
        </div>

        <div className="mt-3.5 rounded-2xl bg-[#FAF8F5] px-3.5 py-2.5">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Entregable final
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-700 line-clamp-2">
            {item.entregableFinal}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="font-mono text-[11px] font-bold text-slate-400">
          {item.folio}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0D2240] group-hover:text-[#009FE3]">
          Consultar ficha y QR
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </button>
  );

  return (
    <div id="inicio" className="space-y-0 overflow-x-clip bg-[#FAF8F5]">
      {/* 1. BLOQUE HERO EN 2 COLUMNAS */}
      <section className="mx-auto max-w-7xl px-6 pt-8 pb-12 lg:pt-12 lg:pb-14">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
          {/* Columna izquierda (7 cols): Título, descripción, acciones y contexto rápido */}
          <div className="lg:col-span-7 space-y-5 animate-it-enter">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#0D2240]">
              <span className="h-2 w-2 rounded-full bg-[#009FE3]" />
              RESIDENCIAS PROFESIONALES · TECNM ITSAL
            </div>

            <h1 className="text-4xl font-black tracking-tight text-[#0D2240] sm:text-5xl lg:text-[3.25rem] leading-[1.08]">
              Conecta tu talento con el proyecto{' '}
              <span className="relative inline-block">
                <span className="relative z-10">ideal.</span>
                <span
                  aria-hidden="true"
                  className="absolute left-0 right-0 bottom-1 h-3 bg-[#009FE3]/35 -z-0"
                />
              </span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              <strong className="font-bold text-[#0D2240]">IT Match</strong> es el banco inteligente de residencias profesionales del Instituto Tecnológico de Salina Cruz: afinidad académica con IA, dictamen colegiado y formato oficial verificable con código QR.
            </p>

            {/* Botones principales de acción */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => enterProtectedModule('estudiante')}
                className="inline-flex items-center gap-2 rounded-full bg-[#009FE3] px-6 py-3.5 text-sm font-extrabold text-white shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#0088C6]"
              >
                Explorar Banco de Proyectos
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => enterProtectedModule('docente')}
                className="inline-flex items-center gap-2 rounded-full bg-[#0D2240] px-6 py-3.5 text-sm font-bold text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#163663]"
              >
                Registrar Propuesta
                <ArrowRight className="h-4 w-4 text-[#D99B16]" />
              </button>
              <button
                type="button"
                onClick={startGuidedTour}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-5 py-3.5 text-xs font-extrabold text-[#0D2240] transition duration-200 ease-out hover:border-[#0D2240]"
              >
                <Sparkles className="h-4 w-4 text-[#009FE3]" />
                Tour Guiado
              </button>
            </div>

            {/* Datos rápidos de contexto + Carreras */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-xl">
              <div className="rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3">
                <p className="font-mono text-xl font-black text-[#0D2240]">{publishedCount}</p>
                <p className="text-[11px] font-semibold text-slate-500">Proyectos publicados</p>
              </div>
              <div className="rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3">
                <p className="inline-flex items-center gap-1 font-mono text-xl font-black text-[#009FE3]">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {totalSeats}
                </p>
                <p className="text-[11px] font-semibold text-slate-500">Plazas totales</p>
              </div>
              <div className="rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3">
                <p className="inline-flex items-center gap-1 font-mono text-xl font-black text-[#0D2240]">
                  <QrCode className="h-4 w-4 text-[#009FE3]" />
                  QR
                </p>
                <p className="text-[11px] font-semibold text-slate-500">Formato oficial</p>
              </div>
            </div>

            <div className="pt-1">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Carreras participantes en el ITSAL
              </p>
              <div className="flex flex-wrap gap-2">
                {CARRERAS_ITSAL.map((carrera) => (
                  <button
                    key={carrera}
                    type="button"
                    onClick={() => enterProtectedModule('estudiante')}
                    className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#0D2240] transition duration-200 hover:border-[#009FE3] hover:text-[#009FE3]"
                  >
                    {carrera}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Columna derecha (5 cols): Sede + Oso con laptop centrado + Cinta continua en la base */}
          <div className="lg:col-span-5 min-w-0 animate-it-enter" style={{ animationDelay: '90ms' }}>
            <div className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_18px_45px_-20px_rgba(13,34,64,0.16)]">
              {/* Etiqueta superior de ubicación/sede */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-[#FAF8F5] px-5 py-3.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0D2240] px-3.5 py-1.5 text-[11px] font-bold text-white">
                  <MapPin className="h-3.5 w-3.5 text-[#009FE3]" />
                  TecNM · Campus Salina Cruz
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Periodo 2026
                </span>
              </div>

              {/* Centro: Ilustración del oso con laptop y animación sutil */}
              <div className="relative flex flex-col items-center justify-center bg-gradient-to-b from-[#FAF8F5] via-white to-white px-6 py-7">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute h-48 w-48 rounded-full bg-[#009FE3]/12 blur-2xl transition-opacity duration-300 group-hover:bg-[#009FE3]/20"
                />
                <MascotSprite
                  pose={2}
                  variant="full"
                  blend={true}
                  className="relative z-10 w-52 sm:w-56 animate-it-float transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                />
                <div className="relative z-10 mt-3 text-center">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#009FE3]">
                    Asistente Académico IT Match
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-[#0D2240]">
                    Afinidad por perfil, proyecto oficial y seguimiento en línea
                  </p>
                </div>
              </div>

              {/* Base de la tarjeta: Cinta en movimiento continuo */}
              <div className="overflow-hidden border-t border-slate-200 bg-[#0D2240] py-2.5 text-white">
                <div className="animate-marquee">
                  {[0, 1, 2, 3].map((loopIdx) => (
                    <div key={loopIdx} className="flex items-center gap-4 px-3">
                      {heroCardRibbon.map((text, idx) => (
                        <React.Fragment key={`${loopIdx}-${idx}`}>
                          <span className="whitespace-nowrap text-[11px] font-bold tracking-wide text-slate-100">
                            {text}
                          </span>
                          <span className="text-[10px] text-[#009FE3]" aria-hidden="true">
                            ●
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROYECTOS DE RESIDENCIA TERMINADOS / CASOS CONCLUIDOS DEL ITSAL */}
      <section className="mx-auto max-w-7xl px-6 pb-14">
        <Reveal>
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-emerald-800">
                  <Award className="h-3.5 w-3.5 text-emerald-600" />
                  Casos Concluidos y Liberados · TecNM ITSAL
                </span>
                <h2 className="mt-2.5 text-2xl font-black tracking-tight text-[#0D2240] sm:text-3xl">
                  Proyectos de Residencia Terminados
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Resultados reales entregados por residentes en empresas e institución. Haz clic en cualquier caso para abrir su ficha técnica y formato oficial con QR.
                </p>
              </div>

              <div className="inline-flex items-center self-start sm:self-auto rounded-full border border-[#E2E8F0] bg-white p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setShowcaseMode('marquee')}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                    showcaseMode === 'marquee'
                      ? 'bg-[#0D2240] text-white'
                      : 'text-slate-600 hover:text-[#0D2240]'
                  }`}
                >
                  <MoveHorizontal className="h-3.5 w-3.5" />
                  Vitrina continua
                </button>
                <button
                  type="button"
                  onClick={() => setShowcaseMode('grid')}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                    showcaseMode === 'grid'
                      ? 'bg-[#0D2240] text-white'
                      : 'text-slate-600 hover:text-[#0D2240]'
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  Ver todos ({COMPLETED_RESIDENCIA_CASES.length})
                </button>
              </div>
            </div>

            {showcaseMode === 'marquee' ? (
              <div className="overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white/75 py-5">
                <div className="animate-marquee">
                  {[0, 1].map((loopIdx) => (
                    <div key={loopIdx} className="flex items-stretch gap-5 px-2.5">
                      {COMPLETED_RESIDENCIA_CASES.map((item) =>
                        renderCompletedCard(item, `loop-${loopIdx}-`)
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {COMPLETED_RESIDENCIA_CASES.map((item) => renderCompletedCard(item))}
              </div>
            )}
          </div>
        </Reveal>
      </section>

      {/* 3. CINTA INFERIOR CON MOVIMIENTO CONTINUO */}
      <div className="border-y border-[#E2E8F0] bg-white py-3.5 overflow-hidden">
        <div className="animate-marquee">
          {[0, 1, 2, 3].map((loopIdx) => (
            <div key={loopIdx} className="flex items-center gap-6 px-3">
              {bottomMarqueeItems.map((item, idx) => (
                <React.Fragment key={`${loopIdx}-${idx}`}>
                  <span className="text-sm font-extrabold tracking-tight text-[#0D2240] whitespace-nowrap">
                    {item.text}
                  </span>
                  <span className={`text-sm font-bold ${item.color}`} aria-hidden="true">
                    ◆
                  </span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Modales interactivos al consultar cualquier proyecto terminado */}
      <ProjectDetailModal
        project={selectedCase}
        readOnly={true}
        alreadyApplied={false}
        onClose={() => setSelectedCase(null)}
        onOpenPdf={(p) => setPdfCase(p)}
      />

      <OfficialFormatModal
        project={pdfCase}
        onClose={() => setPdfCase(null)}
      />
    </div>
  );
}

export function ComoFuncionaView() {
  const { currentUser, enterProtectedModule, openAccountModal, startGuidedTour, goToLogin } =
    useApp();

  return (
    <div id="como-funciona" className="bg-obsidian-grid text-white">
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#009FE3]/40 bg-[#009FE3]/10 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-[#009FE3]">
            Motor de Afinidad Académica IA
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            ¿Cómo calcula IT Match tu compatibilidad?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Cálculo directo y explicable basado en tu carrera, habilidades técnicas y disponibilidad real en el ITSAL.
          </p>
        </div>

        <div className="relative mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6 transition duration-200 hover:border-white/25">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#009FE3] text-white">
              <Target className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xs font-extrabold uppercase tracking-widest text-[#D99B16]">
              01 · Perfil
            </p>
            <h3 className="mt-1 text-lg font-extrabold text-white">
              Carrera y Habilidades
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              El estudiante selecciona su carrera del ITSAL y marca competencias clave como Desarrollo Web, IoT, Códigos QR o Logística Portuaria.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6 transition duration-200 hover:border-white/25">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D99B16] text-[#0B0F17]">
              <Cpu className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xs font-extrabold uppercase tracking-widest text-[#009FE3]">
              02 · Ponderación IA
            </p>
            <h3 className="mt-1 text-lg font-extrabold text-white">
              Cálculo de % de Afinidad
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Se pondera la coincidencia curricular (48%), el traslape de habilidades (44%) y las plazas abiertas (7%) con explicación clara.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6 transition duration-200 hover:border-white/25">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#009FE3] text-white">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <p className="mt-4 text-xs font-extrabold uppercase tracking-widest text-[#D99B16]">
              03 · Trazabilidad
            </p>
            <h3 className="mt-1 text-lg font-extrabold text-white">
              Formato Oficial y QR
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              La propuesta aprobada genera un folio verificable con código QR, firma de Academia, canalización a Vinculación y evidencia SGC.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-white/10 pt-8">
          <button
            type="button"
            onClick={startGuidedTour}
            className="inline-flex items-center gap-2 rounded-full bg-[#009FE3] px-5 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#0088C6]"
          >
            <Sparkles className="h-4 w-4" />
            Iniciar Tour Guiado (4 pasos)
          </button>
          <button
            type="button"
            onClick={() =>
              currentUser ? enterProtectedModule(currentUser.roleId) : openAccountModal()
            }
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-white/10"
          >
            {currentUser ? 'Ir a mi módulo activo' : 'Seleccionar perfil'}
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goToLogin}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Pantalla de acceso
          </button>
        </div>
      </section>
    </div>
  );
}
