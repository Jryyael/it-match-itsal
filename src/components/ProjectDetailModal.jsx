import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Briefcase,
  CheckCircle2,
  FileText,
  Layers,
  Send,
  Users,
  X,
} from 'lucide-react';
import { CARRERAS_ITSAL } from '../data/mockData';
import { OriginBadge, StatusBadge } from './StatusBadge';
import MascotSprite from './MascotSprite';

export default function ProjectDetailModal({
  project,
  readOnly = false,
  appForm,
  setAppForm,
  appError,
  setAppError,
  alreadyApplied,
  onSubmitApplication,
  onClose,
  onOpenPdf,
}) {
  const [closing, setClosing] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setClosing(false);
    setImgFailed(false);
  }, [project?.id]);

  const handleRequestClose = (afterClose) => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => {
      onClose();
      if (typeof afterClose === 'function') afterClose();
    }, 180);
  };

  useEffect(() => {
    if (!project) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') handleRequestClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [project?.id]);

  if (!project) return null;

  const ocupadas = project.alumnosAsignados?.length || 0;
  const disponibles = Math.max(0, (Number(project.alumnosRequeridos) || 0) - ocupadas);
  const canApply = project.estado === 'Publicado' && disponibles > 0 && !alreadyApplied;

  const modalNode = (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-200 ${
        closing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className="fixed inset-0"
        aria-hidden="true"
        onClick={() => handleRequestClose()}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className={`relative z-10 w-full max-w-5xl max-h-[86vh] rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden ${
          closing ? 'animate-modal-out' : 'animate-modal-in'
        }`}
      >
        {/* Cabecera fija */}
        <header className="shrink-0 flex items-start justify-between gap-4 border-b border-slate-800 bg-[#0B1120] px-6 py-4 text-white">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-[#009FE3]">
                {project.folio}
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs font-medium text-slate-300">
                {project.departamento}
              </span>
            </div>
            <h3
              id="project-modal-title"
              className="text-base sm:text-lg font-bold leading-snug text-white"
            >
              {project.titulo}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => handleRequestClose()}
            aria-label="Cerrar detalle del proyecto"
            className="shrink-0 rounded-lg p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Cuerpo editorial en 2 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-y-auto lg:overflow-hidden">
          {/* Columna izquierda: fotografía, badges y ficha técnica */}
          <div className="lg:col-span-7 lg:overflow-y-auto p-6 space-y-5">
            {project.imagenUrl && !imgFailed ? (
              <div className="h-56 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                <img
                  src={project.imagenUrl}
                  alt={project.titulo}
                  onError={() => setImgFailed(true)}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-44 w-full items-center justify-center rounded-xl border border-slate-200 bg-gradient-to-br from-[#0B1120] to-[#1B396A] text-white">
                <div className="flex flex-col items-center gap-1.5 text-center px-4">
                  <Layers className="h-6 w-6 text-[#009FE3]" />
                  <span className="text-xs font-semibold text-slate-200">
                    Proyecto ITSAL · {project.estado}
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge estado={project.estado} />
                <OriginBadge
                  origen={project.origen}
                  modalidadLugar={project.modalidadLugar}
                />
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                  {project.tipoProyecto}
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-slate-500">
                {project.periodo}
              </span>
            </div>

            <div className="space-y-4 text-sm">
              <section>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Objetivo
                </h4>
                <p className="text-slate-700 leading-relaxed">{project.objetivo}</p>
              </section>

              <section>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Planteamiento del Proyecto
                </h4>
                <p className="text-slate-700 leading-relaxed">{project.planteamiento}</p>
              </section>

              <section>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Justificación
                </h4>
                <p className="text-slate-700 leading-relaxed">{project.justificacion}</p>
              </section>

              <section>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Alcances y Limitaciones
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  {project.alcances} {project.limitaciones}
                </p>
              </section>

              <section>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Observaciones
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {project.observaciones || 'Sin observaciones adicionales registradas.'}
                </p>
              </section>

              {project.habilidades?.length > 0 && (
                <section className="border-t border-slate-100 pt-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Competencias Requeridas
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.habilidades.map((hab) => (
                      <span
                        key={hab}
                        className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                      >
                        {hab}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Columna derecha: panel lateral en #F8FAFC con ficha rápida, Afinidad IA + Oso y postulación */}
          <aside className="lg:col-span-5 lg:overflow-y-auto bg-[#F8FAFC] border-t lg:border-t-0 lg:border-l border-slate-200 p-6 space-y-5">
            {/* Ficha rápida */}
            <dl className="grid gap-3 sm:grid-cols-2 rounded-xl border border-slate-200 bg-white p-4 text-xs">
              <div>
                <dt className="font-bold uppercase tracking-wider text-slate-400">
                  Institución / Empresa
                </dt>
                <dd className="mt-0.5 font-semibold text-slate-900">
                  {project.institucion}
                </dd>
              </div>
              <div>
                <dt className="font-bold uppercase tracking-wider text-slate-400">
                  Asesor
                </dt>
                <dd className="mt-0.5 font-semibold text-slate-900">
                  {project.asesor}
                </dd>
              </div>
              <div>
                <dt className="font-bold uppercase tracking-wider text-slate-400">
                  Perfil Requerido
                </dt>
                <dd className="mt-0.5 font-semibold text-slate-900">
                  {project.perfilRequerido}
                </dd>
              </div>
              <div>
                <dt className="font-bold uppercase tracking-wider text-slate-400">
                  {project.estado === 'Concluido / Liberado'
                    ? 'Residentes Acreditados'
                    : 'Plazas Disponibles'}
                </dt>
                <dd className="mt-0.5 inline-flex items-center gap-1 font-mono font-bold text-emerald-700">
                  <Users className="h-3.5 w-3.5" />
                  {project.estado === 'Concluido / Liberado'
                    ? `${ocupadas} acreditado${ocupadas === 1 ? '' : 's'}`
                    : `${disponibles} de ${project.alumnosRequeridos} disponibles`}
                </dd>
              </div>
            </dl>

            {/* Bloque lateral de contexto: Resultado final para casos concluidos o Afinidad IA para banco activo */}
            {project.estado === 'Concluido / Liberado' ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-2.5">
                <div className="flex items-center gap-3">
                  <MascotSprite
                    pose={project.bearPose || 5}
                    variant="full"
                    blend={true}
                    className="w-16 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                      Residencia Concluida
                    </p>
                    <p className="text-sm font-extrabold text-[#0D2240]">
                      Entregable Final Liberado
                    </p>
                  </div>
                </div>
                {project.entregableFinal && (
                  <p className="text-xs leading-relaxed text-slate-700 border-t border-emerald-200/80 pt-2">
                    {project.entregableFinal}
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-[#FAF8F5] p-4 space-y-2.5">
                <div className="flex items-center gap-3">
                  <MascotSprite
                    pose={6}
                    variant="full"
                    blend={true}
                    className="w-16 shrink-0 transition-transform duration-300 hover:-translate-y-1"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#009FE3]">
                      Afinidad Académica IA
                    </p>
                    <div className="flex items-baseline justify-between gap-2 mt-0.5">
                      <p className="text-sm font-extrabold text-slate-900">
                        Compatibilidad
                      </p>
                      {project.aiMatch && (
                        <span className="font-mono text-base font-extrabold text-[#009FE3]">
                          {project.aiMatch.porcentaje}%
                        </span>
                      )}
                    </div>
                    {project.aiMatch && (
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-[#009FE3] transition-all duration-300"
                          style={{ width: `${project.aiMatch.porcentaje}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                {project.aiMatch?.explicacion && (
                  <p className="text-xs leading-relaxed text-slate-600 border-t border-slate-200/80 pt-2">
                    {project.aiMatch.explicacion}
                  </p>
                )}
              </div>
            )}

            {/* Formulario / Estado de postulación */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-[#009FE3]" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  {project.estado === 'Concluido / Liberado'
                    ? 'Residentes Acreditados'
                    : readOnly
                    ? 'Consulta de Tema Docente'
                    : 'Postulación Directa'}
                </h4>
              </div>

              {project.estado === 'Concluido / Liberado' ? (
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-600 space-y-2">
                  {project.alumnosAsignados?.length > 0 ? (
                    <ul className="space-y-1.5">
                      {project.alumnosAsignados.map((al) => (
                        <li key={al.noControl} className="flex items-center justify-between gap-2">
                          <span className="font-bold text-[#0D2240]">{al.nombre}</span>
                          <span className="font-mono text-[11px] text-slate-500">{al.noControl}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Expediente concluido y validado por Vinculación y Academia.</p>
                  )}
                  <p className="border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                    Puedes abrir el Formato Oficial QR para consultar el dictamen completo del caso.
                  </p>
                </div>
              ) : readOnly ? (
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-600 leading-relaxed">
                  Estás consultando este tema en modo lectura para verificar disponibilidad y evitar duplicidad de proyectos en el Banco del ITSAL.
                </div>
              ) : project.estado !== 'Publicado' ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs font-semibold text-amber-800">
                  Este proyecto se encuentra en estado "{project.estado}" y no admite nuevas postulaciones.
                </div>
              ) : disponibles <= 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs font-semibold text-slate-700">
                  Todas las plazas de este proyecto han sido asignadas.
                </div>
              ) : alreadyApplied ? (
                <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span>
                    Ya enviaste una postulación para este proyecto. Consulta su seguimiento en la pestaña "Mis Postulaciones".
                  </span>
                </div>
              ) : (
                <form id="modal-apply-form" onSubmit={onSubmitApplication} className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={appForm.nombre}
                      onChange={(e) => setAppForm({ ...appForm, nombre: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-[#009FE3] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="mb-1 block text-xs font-bold text-slate-700">
                        No. Control *
                      </label>
                      <input
                        type="text"
                        value={appForm.noControl}
                        onChange={(e) => setAppForm({ ...appForm, noControl: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-900 focus:border-[#009FE3] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700">
                        Promedio
                      </label>
                      <input
                        type="text"
                        value={appForm.promedio}
                        onChange={(e) => setAppForm({ ...appForm, promedio: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-900 focus:border-[#009FE3] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Carrera
                    </label>
                    <select
                      value={appForm.carrera}
                      onChange={(e) => setAppForm({ ...appForm, carrera: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-[#009FE3] focus:outline-none"
                    >
                      {CARRERAS_ITSAL.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Exposición de Motivos *
                    </label>
                    <textarea
                      id="modal-motivacion-input"
                      rows={3}
                      value={appForm.motivacion}
                      onChange={(e) => setAppForm({ ...appForm, motivacion: e.target.value })}
                      placeholder="Explica brevemente tu interés y cómo aportarías al proyecto..."
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#009FE3] focus:outline-none"
                    />
                  </div>

                  {appError && (
                    <p className="text-xs font-bold text-rose-600">{appError}</p>
                  )}
                </form>
              )}
            </div>
          </aside>
        </div>

        {/* Barra inferior fija */}
        <footer className="shrink-0 border-t border-slate-200 bg-white px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handleRequestClose(() => onOpenPdf(project))}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 transition hover:border-[#009FE3] hover:text-[#009FE3]"
          >
            <FileText className="h-3.5 w-3.5 text-[#009FE3]" />
            Formato Oficial QR
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={() => handleRequestClose()}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Cerrar
            </button>

            {readOnly ? null : alreadyApplied ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Postulación enviada
              </span>
            ) : canApply ? (
              <button
                type="submit"
                form="modal-apply-form"
                onClick={(e) => {
                  if (!appForm.motivacion.trim()) {
                    e.preventDefault();
                    setAppError(
                      'Completa tu exposición de motivos antes de enviar la postulación.'
                    );
                    const el = document.getElementById('modal-motivacion-input');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      el.focus();
                    }
                  }
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-[#009FE3] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#0088C6]"
              >
                <Send className="h-3.5 w-3.5" />
                Postularme a este proyecto
              </button>
            ) : null}
          </div>
        </footer>
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
}
