import React, { useMemo, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  History,
  Mail,
  MessageSquare,
  Send,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PROJECT_LIFECYCLE_STATES } from '../data/mockData';
import { LifecycleBadge, OriginBadge, StatusBadge } from '../components/StatusBadge';
import OfficialFormatModal from '../components/OfficialFormatModal';
import MascotSprite from '../components/MascotSprite';
import ProjectContactBlock from '../components/ProjectContactBlock';

const BASE_INTERNAL_ADVISORS = [
  'Ing. Alfonso Miguel Escobar',
  'M.T.I. Luis Fernando Toledo Castellanos',
  'Mtra. Gabriela Cruz Ortiz',
  'M.C. Héctor Manuel Ramírez',
  'Ing. Laura Elena Vásquez',
  'Ing. Anita del Carmen Morales Cruz',
];

export default function GestionVinculacionView() {
  const {
    projects,
    applications,
    approveExternalProject,
    approveInternalProject,
    rejectProject,
    assignStudentToProject,
    rejectApplication,
    channelToVinculacion,
    updateProjectLifecycle,
  } = useApp();

  const [activeFlow, setActiveFlow] = useState('externos');
  const [historyFilter, setHistoryFilter] = useState('Todos');
  const [selectedId, setSelectedId] = useState(null);
  const [notesByProject, setNotesByProject] = useState({});
  const [advisorByProject, setAdvisorByProject] = useState({});
  const [pdfProject, setPdfProject] = useState(null);
  const [lastChannelAlert, setLastChannelAlert] = useState(null);

  const advisorOptions = useMemo(() => {
    const set = new Set(BASE_INTERNAL_ADVISORS);
    projects.forEach((p) => {
      if (p.asesor?.trim()) set.add(p.asesor.trim());
    });
    return Array.from(set);
  }, [projects]);

  const externalPending = projects.filter(
    (p) => p.origen === 'Externo' && p.estado === 'Pendiente de Vinculación'
  );
  const externalProcessed = projects.filter(
    (p) => p.origen === 'Externo' && p.estado !== 'Pendiente de Vinculación'
  );

  const internalPending = projects.filter(
    (p) =>
      (p.origen === 'Interno' || p.origen === 'Propuesta de Estudiante') &&
      p.estado === 'En Revisión Académica'
  );
  const pendingApplications = applications.filter(
    (a) => a.estado === 'En Revisión de Academia'
  );

  const projectsWithAssigned = projects.filter(
    (p) => (p.alumnosAsignados?.length || 0) > 0
  );

  const historyProjects = useMemo(
    () =>
      projects.filter(
        (p) =>
          p.estado === 'Publicado' || p.estado === 'Asignado' || p.estado === 'Rechazado'
      ),
    [projects]
  );

  // Unified items list for the Left Pane of each flow
  const listItems = useMemo(() => {
    if (activeFlow === 'externos') {
      return [
        ...externalPending.map((p) => ({ kind: 'ext-pending', id: p.id, data: p })),
        ...externalProcessed.map((p) => ({ kind: 'ext-done', id: p.id, data: p })),
      ];
    }
    if (activeFlow === 'academia') {
      return [
        ...internalPending.map((p) => ({ kind: 'int-pending', id: p.id, data: p })),
        ...pendingApplications.map((a) => ({ kind: 'app-pending', id: a.id, data: a })),
      ];
    }
    if (activeFlow === 'historial') {
      const filtered = historyProjects.filter((p) => {
        if (historyFilter === 'Aprobados') {
          return p.estado === 'Publicado' || p.estado === 'Asignado';
        }
        if (historyFilter === 'Rechazados') {
          return p.estado === 'Rechazado';
        }
        return true;
      });
      return filtered.map((p) => ({ kind: 'historial', id: p.id, data: p }));
    }
    return projectsWithAssigned.map((p) => ({ kind: 'canalizacion', id: p.id, data: p }));
  }, [
    activeFlow,
    historyFilter,
    externalPending,
    externalProcessed,
    internalPending,
    pendingApplications,
    projectsWithAssigned,
    historyProjects,
  ]);

  const activeItem = useMemo(() => {
    if (!listItems.length) return null;
    return listItems.find((item) => item.id === selectedId) || listItems[0];
  }, [listItems, selectedId]);

  const handleFlowSwitch = (flow) => {
    setActiveFlow(flow);
    setSelectedId(null);
  };

  const getNote = (id) => notesByProject[id] || '';
  const setNote = (id, val) =>
    setNotesByProject((prev) => ({ ...prev, [id]: val }));

  const handleChannel = (project) => {
    channelToVinculacion(project.id);
    setLastChannelAlert({
      folio: project.folio,
      titulo: project.titulo,
      institucion: project.institucion,
      estudiantes: project.alumnosAsignados.map((a) => `${a.nombre} (${a.noControl})`).join(', '),
      timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    });
  };

  return (
    <div className="px-6 sm:px-8 py-8 pb-24 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="hidden sm:flex shrink-0 items-center justify-center rounded-xl bg-[#FAF8F5] px-2 py-1">
            <MascotSprite
              pose={3}
              variant="full"
              blend={true}
              className="w-14 shrink-0 transition-all duration-300 hover:-translate-y-1"
            />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#009FE3]">
              Jefatura · Reunión de Academia · Vinculación
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
              Gestión Académica y Vinculación
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Selecciona un expediente a la izquierda para revisarlo, dictaminar o canalizar.
            </p>
          </div>
        </div>

        <div className="inline-flex flex-nowrap items-center gap-1 max-w-full overflow-x-auto rounded-lg border border-slate-200 bg-white p-0.5 shrink-0">
          <button
            type="button"
            onClick={() => handleFlowSwitch('externos')}
            className={`whitespace-nowrap shrink-0 rounded-md px-3.5 py-1.5 text-xs font-bold transition ${
              activeFlow === 'externos'
                ? 'bg-[#0B1120] text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Externos / Vinculación ({externalPending.length})
          </button>
          <button
            type="button"
            onClick={() => handleFlowSwitch('academia')}
            className={`whitespace-nowrap shrink-0 rounded-md px-3.5 py-1.5 text-xs font-bold transition ${
              activeFlow === 'academia'
                ? 'bg-[#0B1120] text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reunión de Academia ({internalPending.length + pendingApplications.length})
          </button>
          <button
            type="button"
            onClick={() => handleFlowSwitch('canalizacion')}
            className={`whitespace-nowrap shrink-0 rounded-md px-3.5 py-1.5 text-xs font-bold transition ${
              activeFlow === 'canalizacion'
                ? 'bg-[#0B1120] text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Canalización ({projectsWithAssigned.filter((p) => !p.canalizadoVinculacion).length})
          </button>
          <button
            type="button"
            onClick={() => handleFlowSwitch('historial')}
            className={`whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-bold transition ${
              activeFlow === 'historial'
                ? 'bg-[#0B1120] text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            Historial de Dictámenes ({historyProjects.length})
          </button>
        </div>
      </div>

      {lastChannelAlert && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50/80 p-4 animate-it-enter">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Send className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Notificación Automática Simulada Enviada ({lastChannelAlert.timestamp})
                </p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  Proyecto {lastChannelAlert.folio} canalizado a Gestión Tecnológica y Vinculación
                </p>
                <p className="text-xs text-slate-700 mt-1">
                  Residentes: <strong>{lastChannelAlert.estudiantes}</strong> · {lastChannelAlert.institucion}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold">
                  <span className="inline-flex items-center gap-1 rounded-md bg-white border border-emerald-200 px-2.5 py-0.5 text-emerald-800">
                    <Mail className="h-3 w-3" /> Correo a vinculacion@salinacruz.tecnm.mx
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-white border border-emerald-200 px-2.5 py-0.5 text-emerald-800">
                    <MessageSquare className="h-3 w-3" /> WhatsApp enviado al enlace y residente(s)
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setLastChannelAlert(null)}
              className="text-xs font-bold text-emerald-800 hover:underline"
            >
              Ocultar
            </button>
          </div>
        </div>
      )}

      {/* Split Master-Detail Workspace */}
      <div
        key={activeFlow}
        className="grid lg:grid-cols-12 rounded-xl border border-slate-200 bg-white overflow-hidden min-h-[460px] animate-it-enter"
      >
        {/* Left List Pane */}
        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/40">
          <div className="border-b border-slate-200 px-4 py-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {activeFlow === 'externos'
                  ? 'Expedientes Externos'
                  : activeFlow === 'academia'
                  ? 'Propuestas y Postulaciones'
                  : activeFlow === 'historial'
                  ? 'Historial de Dictámenes'
                  : 'Proyectos con Residentes'}
              </span>
              <span className="font-mono text-xs font-bold text-slate-500">
                {listItems.length}
              </span>
            </div>

            {activeFlow === 'historial' && (
              <div className="flex flex-wrap gap-1.5">
                {['Todos', 'Aprobados', 'Rechazados'].map((flt) => (
                  <button
                    key={flt}
                    type="button"
                    onClick={() => {
                      setHistoryFilter(flt);
                      setSelectedId(null);
                    }}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition ${
                      historyFilter === flt
                        ? 'bg-[#0B1120] text-white'
                        : 'border border-slate-200 bg-white text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {flt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {listItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No hay elementos registrados en esta bandeja.
            </div>
          ) : (
            <div className="divide-y divide-slate-200 max-h-[540px] overflow-y-auto">
              {listItems.map((item) => {
                const isSelected = activeItem?.id === item.id;
                const isApp = item.kind === 'app-pending';

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full px-4 py-3.5 text-left transition ${
                      isSelected
                        ? 'bg-[#009FE3]/5 border-l-2 border-l-[#009FE3]'
                        : 'hover:bg-white'
                    }`}
                  >
                    {isApp ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#009FE3]">
                            <UserCheck className="h-3 w-3" /> Postulación
                          </span>
                          <span className="font-mono text-[11px] font-bold text-slate-500">
                            Prom. {item.data.promedio}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {item.data.estudianteNombre}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {item.data.projectFolio} · {item.data.carrera}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-mono text-[11px] font-bold text-slate-500">
                              {item.data.folio}
                            </span>
                            {item.data.origen === 'Propuesta de Estudiante' && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-800">
                                <GraduationCap className="h-2.5 w-2.5" />
                                Propuesta de Estudiante
                              </span>
                            )}
                          </div>
                          <StatusBadge estado={item.data.estado} />
                        </div>
                        <p className="text-sm font-bold text-slate-900 line-clamp-1">
                          {item.data.titulo}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {item.data.estudianteProponente?.nombre
                            ? `Alumno: ${item.data.estudianteProponente.nombre} · `
                            : ''}
                          {item.data.institucion} · {item.data.departamento}
                        </p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Detail & Verdict Pane */}
        <div className="lg:col-span-7 p-6">
          {!activeItem ? (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              Selecciona un elemento para ver su detalle.
            </div>
          ) : activeItem.kind === 'app-pending' ? (
            /* Revisión de Postulación en Academia */
            (() => {
              const app = activeItem.data;
              const targetProj = projects.find((p) => p.id === app.projectId);
              const ocupadas = targetProj?.alumnosAsignados?.length || 0;
              const req = targetProj?.alumnosRequeridos || 1;
              return (
                <div key={app.id} className="space-y-5 animate-it-enter">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#009FE3]">
                        <UserCheck className="h-3.5 w-3.5" />
                        Postulación pendiente de dictamen
                      </span>
                      <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                        {app.estudianteNombre}
                      </h2>
                      <p className="font-mono text-xs text-slate-500 mt-0.5">
                        Matrícula {app.noControl} · Promedio {app.promedio} · {app.semestre}
                      </p>
                    </div>
                    {targetProj && (
                      <button
                        type="button"
                        onClick={() => setPdfProject(targetProj)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-[#009FE3]"
                      >
                        <FileText className="h-3.5 w-3.5 text-[#009FE3]" />
                        Formato QR
                      </button>
                    )}
                  </div>

                  <dl className="grid gap-3 sm:grid-cols-2 text-xs border-b border-slate-200 pb-4">
                    <div>
                      <dt className="font-bold uppercase text-slate-400">Carrera</dt>
                      <dd className="mt-0.5 font-semibold text-slate-900">{app.carrera}</dd>
                    </div>
                    <div>
                      <dt className="font-bold uppercase text-slate-400">Plazas en proyecto</dt>
                      <dd className="mt-0.5 font-mono font-bold text-emerald-700">
                        {ocupadas} de {req} ocupadas
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="font-bold uppercase text-slate-400">Proyecto solicitado</dt>
                      <dd className="mt-0.5 font-semibold text-slate-900">
                        <span className="font-mono text-[#009FE3] mr-1.5">{app.projectFolio}</span>
                        {app.projectTitle}
                      </dd>
                    </div>
                  </dl>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Exposición de Motivos del Estudiante
                    </h3>
                    <p className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-700 italic leading-relaxed">
                      "{app.motivacion}"
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => rejectApplication(app.id)}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      No seleccionar
                    </button>
                    <button
                      type="button"
                      disabled={ocupadas >= req}
                      onClick={() =>
                        assignStudentToProject(
                          app.id,
                          'Asignación formalizada en Reunión de Academia.'
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#009FE3] px-4 py-2 text-xs font-bold text-white hover:bg-[#0088C6] disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Formalizar Asignación
                    </button>
                  </div>
                </div>
              );
            })()
          ) : (
            /* Revisión de Proyecto (Externo / Interno / Canalización) */
            (() => {
              const project = activeItem.data;
              const isPendingValidation =
                project.estado === 'Pendiente de Vinculación' ||
                project.estado === 'En Revisión Académica';

              return (
                <div key={project.id} className="space-y-5 animate-it-enter">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-[#009FE3]">
                          {project.folio}
                        </span>
                        <StatusBadge estado={project.estado} />
                        <LifecycleBadge estadoProyecto={project.estado_proyecto || 'Disponible'} />
                        <OriginBadge
                          origen={project.origen}
                          modalidadLugar={project.modalidadLugar}
                        />
                      </div>
                      <h2 className="text-lg font-extrabold text-slate-900 leading-snug">
                        {project.titulo}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPdfProject(project)}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800 hover:border-[#009FE3]"
                    >
                      <FileText className="h-3.5 w-3.5 text-[#009FE3]" />
                      Formato QR
                    </button>
                  </div>

                  <dl className="grid gap-3 sm:grid-cols-2 border-b border-slate-200 pb-4 text-xs">
                    <div>
                      <dt className="font-bold uppercase text-slate-400">Institución / Empresa</dt>
                      <dd className="mt-0.5 font-semibold text-slate-900">{project.institucion}</dd>
                    </div>
                    <div>
                      <dt className="font-bold uppercase text-slate-400">Departamento</dt>
                      <dd className="mt-0.5 font-semibold text-slate-900">{project.departamento}</dd>
                    </div>
                    <div>
                      <dt className="font-bold uppercase text-slate-400">Perfil Requerido</dt>
                      <dd className="mt-0.5 font-semibold text-slate-900">{project.perfilRequerido}</dd>
                    </div>
                    <div>
                      <dt className="font-bold uppercase text-slate-400">Asesor Interno</dt>
                      <dd className="mt-0.5 font-semibold text-slate-900">
                        {project.asesor || 'Por designar en Academia'}
                      </dd>
                    </div>
                    {project.estudianteProponente?.nombre && (
                      <div className="sm:col-span-2">
                        <dt className="font-bold uppercase text-slate-400">Estudiante Proponente</dt>
                        <dd className="mt-0.5 font-semibold text-indigo-900">
                          {project.estudianteProponente.nombre} ·{' '}
                          <span className="font-mono text-xs">
                            {project.estudianteProponente.matricula}
                          </span>
                        </dd>
                      </div>
                    )}
                  </dl>

                  <div className="space-y-3 text-xs">
                    <div>
                      <h3 className="font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Objetivo
                      </h3>
                      <p className="text-slate-700 leading-relaxed">{project.objetivo}</p>
                    </div>
                    <div>
                      <h3 className="font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Planteamiento
                      </h3>
                      <p className="text-slate-700 leading-relaxed">{project.planteamiento}</p>
                    </div>
                  </div>

                  <ProjectContactBlock project={project} variant="compact" />

                  {!isPendingValidation && project.estado !== 'Rechazado' && (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-[#FAF8F5] px-3.5 py-2.5 text-xs">
                      <div>
                        <p className="font-bold text-[#0D2240]">
                          Ciclo de vida del proyecto
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Actualiza la disponibilidad operativa ante el Banco y SGC
                        </p>
                      </div>
                      <select
                        value={project.estado_proyecto || 'Disponible'}
                        onChange={(e) => updateProjectLifecycle(project.id, e.target.value)}
                        aria-label="Cambiar estado de ciclo de vida del proyecto"
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-[#0D2240] focus:border-[#009FE3] focus:outline-none"
                      >
                        {PROJECT_LIFECYCLE_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {project.alumnosAsignados?.length > 0 && (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5">
                      <p className="text-[11px] font-bold uppercase text-slate-500 mb-2">
                        Residentes Asignados ({project.alumnosAsignados.length} de {project.alumnosRequeridos})
                      </p>
                      <ul className="space-y-1 text-xs">
                        {project.alumnosAsignados.map((al) => (
                          <li key={al.noControl} className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{al.nombre}</span>
                            <span className="font-mono text-slate-500">{al.noControl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeFlow === 'canalizacion' ? (
                    <div className="flex justify-end border-t border-slate-200 pt-4">
                      {project.canalizadoVinculacion ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-xs font-bold text-emerald-800">
                          <CheckCircle2 className="h-4 w-4" />
                          Canalizado a Vinculación
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleChannel(project)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B1120] px-4 py-2 text-xs font-bold text-white hover:bg-[#009FE3]"
                        >
                          <Send className="h-3.5 w-3.5" />
                          Canalizar a Gestión Tec. y Vinculación
                        </button>
                      )}
                    </div>
                  ) : isPendingValidation ? (
                    <div className="space-y-3 border-t border-slate-200 pt-4">
                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700">
                          Designar / Confirmar Asesor Interno
                        </label>
                        <select
                          value={
                            advisorByProject[project.id] ??
                            (project.asesor || advisorOptions[0] || '')
                          }
                          onChange={(e) =>
                            setAdvisorByProject((prev) => ({
                              ...prev,
                              [project.id]: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#009FE3] focus:bg-white focus:outline-none"
                        >
                          {advisorOptions.map((adv) => (
                            <option key={adv} value={adv}>
                              {adv}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700">
                          Observaciones de dictamen
                        </label>
                        <input
                          type="text"
                          value={getNote(project.id)}
                          onChange={(e) => setNote(project.id, e.target.value)}
                          placeholder={
                            project.origen === 'Externo'
                              ? 'Observaciones de Vinculación / DEP...'
                              : 'Observaciones de Reunión de Academia...'
                          }
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:border-[#009FE3] focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            rejectProject(
                              project.id,
                              getNote(project.id) || 'Requiere precisión en objetivos o alcance.',
                              project.origen === 'Externo' ? 'Vinculación' : 'Academia'
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Rechazar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const selectedAdvisor =
                              advisorByProject[project.id] ??
                              (project.asesor || advisorOptions[0]);
                            if (project.origen === 'Externo') {
                              approveExternalProject(
                                project.id,
                                getNote(project.id),
                                selectedAdvisor
                              );
                            } else {
                              approveInternalProject(
                                project.id,
                                getNote(project.id),
                                selectedAdvisor
                              );
                            }
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#009FE3] px-4 py-2 text-xs font-bold text-white hover:bg-[#0088C6]"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Validar y Publicar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`rounded-lg border p-3.5 text-xs space-y-1.5 ${
                        project.estado === 'Rechazado'
                          ? 'border-rose-200 bg-rose-50 text-rose-900'
                          : 'border-emerald-200 bg-emerald-50/70 text-slate-700'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <strong className="text-slate-900">
                          {project.estado === 'Rechazado'
                            ? 'Dictamen: Rechazado con observaciones'
                            : 'Dictamen: Aprobado / Publicado'}
                        </strong>
                        <button
                          type="button"
                          onClick={() => setPdfProject(project)}
                          className="inline-flex items-center gap-1 font-bold text-[#009FE3] hover:underline"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Abrir Formato QR
                        </button>
                      </div>
                      <p>
                        {project.observacionesVinculacion ||
                          project.observacionesAcademia ||
                          'Expediente dictaminado en sesión de Academia / Vinculación.'}
                      </p>
                    </div>
                  )}
                </div>
              );
            })()
          )}
        </div>
      </div>

      {pdfProject && (
        <OfficialFormatModal project={pdfProject} onClose={() => setPdfProject(null)} />
      )}
    </div>
  );
}
