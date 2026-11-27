import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Cpu,
  Layers,
  Search,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  CARRERAS_ITSAL,
  HABILIDADES_CATALOGO,
  TIPOS_PROYECTO,
} from '../data/mockData';
import { calcularAfinidadProyecto } from '../utils/aiHelpers';
import { OriginBadge, StatusBadge } from '../components/StatusBadge';
import OfficialFormatModal from '../components/OfficialFormatModal';
import ProjectDetailModal from '../components/ProjectDetailModal';
import MascotSprite from '../components/MascotSprite';

const TIMELINE_STEPS = [
  'Postulación Enviada',
  'Revisión de Academia',
  'Asignación Formalizada',
  'Canalizado a Vinculación',
];

function getStepIndex(estado) {
  switch (estado) {
    case 'En Revisión de Academia':
      return 1;
    case 'Asignado por Academia':
      return 2;
    case 'Canalizado a Vinculación':
      return 3;
    case 'No Seleccionado':
      return -1;
    default:
      return 0;
  }
}

function ProjectThumbnail({ src, alt, estado }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-[#0B1120] to-[#1B396A] text-white">
        <div className="flex flex-col items-center gap-1.5 text-center px-4">
          <Layers className="h-6 w-6 text-[#009FE3]" />
          <span className="text-[11px] font-semibold tracking-wide text-slate-200">
            Proyecto ITSAL · {estado}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-40 w-full overflow-hidden bg-slate-100">
      <img
        src={src}
        alt={alt}
        onError={() => setFailed(true)}
        className="h-full w-full object-cover transition duration-300 ease-out group-hover:scale-[1.03]"
      />
    </div>
  );
}

export default function BancoProyectosView() {
  const {
    projects,
    applications,
    demoStudent,
    currentUser,
    submitApplication,
    setMascotContext,
    setMascotHidden,
  } = useApp();

  const [subTab, setSubTab] = useState('catalogo');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCarrera, setFilterCarrera] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterOrigen, setFilterOrigen] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  const [aiOpen, setAiOpen] = useState(false);
  const [aiCarrera, setAiCarrera] = useState(demoStudent.carrera);
  const [aiSkills, setAiSkills] = useState([
    'Desarrollo Web',
    'Códigos QR',
    'Bases de Datos',
  ]);
  const [sortByAi, setSortByAi] = useState(true);

  const [selectedProject, setSelectedProject] = useState(null);
  const [pdfProject, setPdfProject] = useState(null);

  useEffect(() => {
    setMascotHidden(Boolean(selectedProject || pdfProject));
    return () => setMascotHidden(false);
  }, [selectedProject, pdfProject, setMascotHidden]);

  const activeStudentName =
    currentUser?.roleId === 'estudiante' ? currentUser.nombreCompleto : demoStudent.nombre;
  const activeStudentControl =
    currentUser?.roleId === 'estudiante' ? currentUser.matricula : demoStudent.noControl;
  const isConsultMode = currentUser?.roleId === 'docente';

  const [appForm, setAppForm] = useState({
    nombre: activeStudentName,
    noControl: activeStudentControl,
    carrera: demoStudent.carrera,
    semestre: demoStudent.semestre,
    promedio: demoStudent.promedio,
    motivacion: '',
  });
  const [appError, setAppError] = useState('');

  const catalogBase = useMemo(
    () => projects.filter((p) => p.estado !== 'Pendiente de Vinculación' && p.estado !== 'Rechazado'),
    [projects]
  );

  const statusCounts = useMemo(() => {
    return {
      todos: catalogBase.length,
      Publicado: catalogBase.filter((p) => p.estado === 'Publicado').length,
      'En Revisión Académica': catalogBase.filter((p) => p.estado === 'En Revisión Académica').length,
      Asignado: catalogBase.filter((p) => p.estado === 'Asignado').length,
    };
  }, [catalogBase]);

  const toggleSkill = (skill) => {
    setAiSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
    setMascotContext(2, 'Ajusta tus habilidades para calcular tu % de afinidad académica');
  };

  const handleToggleAi = () => {
    setAiOpen((prev) => {
      const next = !prev;
      if (next) {
        setMascotContext(2, 'Ajusta tus habilidades para calcular tu % de afinidad académica');
      }
      return next;
    });
  };

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    if (val.trim()) {
      setMascotContext(8, 'Filtrando oportunidades de residencia por carrera y área...');
    }
  };

  const visibleCatalogProjects = useMemo(() => {
    return catalogBase
      .map((p) => ({
        ...p,
        aiMatch: calcularAfinidadProyecto(p, aiCarrera, aiSkills),
      }))
      .filter((p) => {
        if (filterCarrera && p.perfilRequerido !== filterCarrera) return false;
        if (filterTipo && p.tipoProyecto !== filterTipo) return false;
        if (filterOrigen && p.origen !== filterOrigen) return false;
        if (filterEstado && p.estado !== filterEstado) return false;
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const haystack = `${p.folio} ${p.titulo} ${p.departamento} ${p.asesor} ${p.institucion} ${p.perfilRequerido} ${(p.habilidades || []).join(' ')}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortByAi) {
          return b.aiMatch.porcentaje - a.aiMatch.porcentaje;
        }
        return a.folio.localeCompare(b.folio);
      });
  }, [
    catalogBase,
    aiCarrera,
    aiSkills,
    filterCarrera,
    filterTipo,
    filterOrigen,
    filterEstado,
    searchTerm,
    sortByAi,
  ]);

  const myApplications = useMemo(
    () => applications.filter((a) => a.esDemoUsuario || a.noControl === activeStudentControl),
    [applications, activeStudentControl]
  );

  const hasActiveFilters = Boolean(
    searchTerm || filterCarrera || filterTipo || filterOrigen || filterEstado
  );

  const openDetailDrawer = (project) => {
    setAppError('');
    setAppForm({
      nombre: activeStudentName,
      noControl: activeStudentControl,
      carrera: aiCarrera || demoStudent.carrera,
      semestre: demoStudent.semestre,
      promedio: demoStudent.promedio,
      motivacion: '',
    });
    setSelectedProject(project);
    setMascotContext(6, 'Analizando competencias clave y requisitos del proyecto...');
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!selectedProject) return;
    if (!appForm.nombre.trim() || !appForm.noControl.trim() || !appForm.motivacion.trim()) {
      setAppError('Por favor completa tu nombre, número de control y exposición de motivos.');
      return;
    }
    const res = submitApplication(selectedProject.id, {
      ...appForm,
      habilidades: aiSkills,
    });
    if (!res.ok) {
      setAppError(res.error);
      return;
    }
    setSelectedProject(null);
    setSubTab('postulaciones');
  };

  const alreadyAppliedToSelected = selectedProject
    ? applications.some(
        (a) =>
          a.projectId === selectedProject.id &&
          a.noControl.toLowerCase() === appForm.noControl.toLowerCase()
      )
    : false;

  return (
    <div className="px-6 sm:px-8 py-8 pb-24 max-w-6xl mx-auto space-y-6">
      {/* Encabezado limpio con controles alineados */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#009FE3]">
            {isConsultMode
              ? 'Docente · Consulta del Banco ITSAL'
              : 'Estudiante · Banco de Proyectos'}
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
            {isConsultMode
              ? 'Banco de Proyectos (Modo Consulta)'
              : 'Proyectos de Residencia Profesional'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isConsultMode
              ? 'Consulta temas publicados en el ITSAL para evitar duplicar propuestas.'
              : 'Catálogo validado del ITSAL ordenado por compatibilidad académica.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {!isConsultMode && (
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
              <button
                type="button"
                onClick={() => setSubTab('catalogo')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold whitespace-nowrap transition ${
                  subTab === 'catalogo'
                    ? 'bg-[#0B1120] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5 text-[#009FE3]" />
                Catálogo ({visibleCatalogProjects.length})
              </button>
              <button
                type="button"
                onClick={() => setSubTab('postulaciones')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold whitespace-nowrap transition ${
                  subTab === 'postulaciones'
                    ? 'bg-[#0B1120] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="h-3.5 w-3.5 text-[#D99B16]" />
                Mis Postulaciones ({myApplications.length})
              </button>
            </div>
          )}

          {!isConsultMode && subTab === 'catalogo' && (
            <button
              type="button"
              onClick={handleToggleAi}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold whitespace-nowrap transition ${
                aiOpen
                  ? 'border-[#009FE3] bg-[#009FE3] text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-[#009FE3]'
              }`}
            >
              <Cpu className={`h-3.5 w-3.5 ${aiOpen ? 'text-white' : 'text-[#009FE3]'}`} />
              <span>Ajustar IA</span>
              <span className={`font-mono text-[11px] ${aiOpen ? 'text-white/90' : 'text-slate-400'}`}>
                ({aiSkills.length})
              </span>
              {aiOpen ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {subTab === 'catalogo' || isConsultMode ? (
        <div key="tab-catalogo" className="space-y-5 animate-it-enter">
          {/* Panel Recomendador IA desplegable */}
          <div
            className={`grid transition-all duration-300 ease-out ${
              aiOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 -my-3 pointer-events-none'
            }`}
          >
            <div className="overflow-hidden">
              <div className="rounded-xl border border-slate-200 bg-white p-5 grid gap-5 md:grid-cols-12">
                <div className="md:col-span-4 space-y-2.5">
                  <div className="flex items-center gap-3 rounded-lg bg-[#FAF8F5] px-3 py-2">
                    <MascotSprite
                      pose={2}
                      variant="full"
                      blend={true}
                      className="w-14 shrink-0 transition-all duration-300 hover:-translate-y-1"
                    />
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#009FE3]">
                        Recomendador IA
                      </p>
                      <p className="text-xs font-bold text-slate-900">
                        Ajusta tu perfil técnico
                      </p>
                    </div>
                  </div>

                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Carrera / Perfil
                  </label>
                  <select
                    value={aiCarrera}
                    onChange={(e) => {
                      setAiCarrera(e.target.value);
                      setMascotContext(2, 'Ajusta tus habilidades para calcular tu % de afinidad académica');
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-[#009FE3] focus:bg-white focus:outline-none"
                  >
                    <option value="">Todas las carreras</option>
                    {CARRERAS_ITSAL.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <label className="inline-flex items-center gap-2 pt-1 text-xs font-medium text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sortByAi}
                      onChange={(e) => setSortByAi(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#009FE3]"
                    />
                    Ordenar por mayor afinidad IA
                  </label>
                </div>

                <div className="md:col-span-8">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Habilidades Técnicas ({aiSkills.length})
                    </label>
                    {aiSkills.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setAiSkills([])}
                        className="text-xs font-semibold text-slate-500 hover:text-rose-600"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {HABILIDADES_CATALOGO.map((skill) => {
                      const active = aiSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-semibold transition ${
                            active
                              ? 'border-[#0B1120] bg-[#0B1120] text-white'
                              : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-[#009FE3]'
                          }`}
                        >
                          {active && <Check className="h-3 w-3 text-[#009FE3]" />}
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros compactos en una sola línea */}
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <div className="relative flex-1 min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Buscar proyecto, folio, asesor o empresa..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 focus:border-[#009FE3] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:items-center lg:gap-2">
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                aria-label="Filtrar por estado"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#009FE3] focus:outline-none"
              >
                <option value="">Todos ({statusCounts.todos})</option>
                <option value="Publicado">Publicados ({statusCounts.Publicado})</option>
                <option value="En Revisión Académica">
                  En Revisión ({statusCounts['En Revisión Académica']})
                </option>
                <option value="Asignado">Asignados ({statusCounts.Asignado})</option>
              </select>

              <select
                value={filterOrigen}
                onChange={(e) => setFilterOrigen(e.target.value)}
                aria-label="Filtrar por origen"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#009FE3] focus:outline-none"
              >
                <option value="">Todos orígenes</option>
                <option value="Interno">Interno</option>
                <option value="Externo">Externo</option>
              </select>

              <select
                value={filterCarrera}
                onChange={(e) => {
                  setFilterCarrera(e.target.value);
                  setMascotContext(8, 'Filtrando oportunidades de residencia por carrera y área...');
                }}
                aria-label="Filtrar por carrera"
                className="lg:max-w-[205px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#009FE3] focus:outline-none"
              >
                <option value="">Todas las carreras</option>
                {CARRERAS_ITSAL.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                aria-label="Filtrar por tipo de proyecto"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#009FE3] focus:outline-none"
              >
                <option value="">Todos tipos</option>
                {TIPOS_PROYECTO.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setFilterCarrera('');
                  setFilterTipo('');
                  setFilterOrigen('');
                  setFilterEstado('');
                }}
                className="shrink-0 text-xs font-bold text-[#009FE3] hover:underline px-1"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Cuadrícula de 2 Columnas */}
          {visibleCatalogProjects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-sm font-bold text-slate-900">
                No se encontraron proyectos con los criterios seleccionados.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Ajusta los filtros o limpia tu búsqueda para consultar todo el catálogo.
              </p>
            </div>
          ) : (
            <div
              key={`${filterEstado}-${filterOrigen}-${filterCarrera}-${filterTipo}`}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {visibleCatalogProjects.map((project, idx) => {
                const ocupadas = project.alumnosAsignados?.length || 0;
                const disponibles = Math.max(0, project.alumnosRequeridos - ocupadas);
                const { porcentaje, razones } = project.aiMatch;

                return (
                  <article
                    key={project.id}
                    style={{ animationDelay: `${Math.min(idx * 45, 220)}ms` }}
                    className="group animate-it-enter flex flex-col justify-between rounded-xl border border-slate-200 bg-white overflow-hidden transition duration-200 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                  >
                    <div>
                      <ProjectThumbnail
                        src={project.imagenUrl}
                        alt={project.titulo}
                        estado={project.estado}
                      />

                      <div className="p-5 pb-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-slate-500">
                              {project.folio}
                            </span>
                            <StatusBadge estado={project.estado} />
                          </div>
                          <span className="font-mono text-xs font-bold text-[#009FE3]">
                            {porcentaje}% Match IA
                          </span>
                        </div>

                        {/* Barra de afinidad IA animada */}
                        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-[#009FE3] transition-all duration-500 ease-out"
                            style={{ width: `${porcentaje}%` }}
                          />
                        </div>

                        <h3 className="mt-3 text-base font-bold text-slate-900 leading-snug line-clamp-2">
                          {project.titulo}
                        </h3>

                        <p className="mt-1.5 text-xs text-slate-600 truncate">
                          <span className="font-semibold text-slate-900">{project.institucion}</span>
                          <span className="mx-1.5 text-slate-300">·</span>
                          <span>{project.asesor}</span>
                        </p>

                        <p className="mt-1 text-[11px] text-slate-500 truncate">
                          {project.origen === 'Interno' ? 'Interno ITSAL' : 'Externo Empresa'}
                          <span className="mx-1.5 text-slate-300">·</span>
                          {project.perfilRequerido}
                          <span className="mx-1.5 text-slate-300">·</span>
                          {project.tipoProyecto}
                        </p>

                        <p className="mt-2 text-xs text-slate-500 line-clamp-1">
                          {razones[0]}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-3.5 bg-slate-50/50">
                      <span
                        className={`inline-flex items-center gap-1.5 font-mono text-xs font-bold whitespace-nowrap ${
                          disponibles > 0 ? 'text-emerald-700' : 'text-slate-500'
                        }`}
                      >
                        <Users className="h-3.5 w-3.5 shrink-0" />
                        {disponibles} de {project.alumnosRequeridos} disponibles
                      </span>

                      <button
                        type="button"
                        onClick={() => openDetailDrawer(project)}
                        className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg bg-[#0B1120] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#009FE3]"
                      >
                        {isConsultMode ? 'Consultar ficha' : 'Ver detalles y postular'}
                        <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Mis Postulaciones */
        <section key="tab-postulaciones" className="space-y-4 animate-it-enter">
          {myApplications.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="font-bold text-slate-900">Aún no has enviado postulaciones.</p>
              <p className="mt-1 text-xs text-slate-500">
                Selecciona un proyecto del catálogo para iniciar tu Residencia Profesional.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white overflow-hidden">
              {myApplications.map((app) => {
                const stepIdx = getStepIndex(app.estado);
                return (
                  <div key={app.id} className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#009FE3]">
                          {app.projectFolio}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-0.5">
                          {app.projectTitle}
                        </h4>
                        <p className="font-mono text-xs text-slate-500 mt-1">
                          {app.fechaPostulacion} · Promedio: {app.promedio}
                        </p>
                      </div>
                      <span
                        className={`rounded-md border px-2.5 py-1 text-xs font-bold ${
                          app.estado === 'Canalizado a Vinculación'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : app.estado === 'Asignado por Academia'
                            ? 'bg-[#009FE3]/10 text-[#0D2240] border-[#009FE3]/30'
                            : app.estado === 'No Seleccionado'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-amber-50 text-amber-900 border-amber-200'
                        }`}
                      >
                        {app.estado}
                      </span>
                    </div>

                    {stepIdx === -1 ? (
                      <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                        La Academia asignó otro perfil en esta convocatoria. Puedes postularte a otro proyecto disponible.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {TIMELINE_STEPS.map((label, idx) => {
                          const completed = idx <= stepIdx;
                          const current = idx === stepIdx;
                          return (
                            <div
                              key={label}
                              className={`rounded-lg border p-3 transition ${
                                completed
                                  ? 'border-slate-300 bg-slate-50'
                                  : 'border-slate-200 bg-white opacity-55'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={`flex h-5 w-5 items-center justify-center rounded text-[11px] font-bold ${
                                    completed
                                      ? 'bg-[#0B1120] text-[#009FE3]'
                                      : 'bg-slate-200 text-slate-600'
                                  }`}
                                >
                                  {completed ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
                                </span>
                                {current && (
                                  <span className="rounded bg-[#009FE3]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#009FE3]">
                                    Actual
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-semibold text-slate-800">{label}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      <ProjectDetailModal
        project={selectedProject}
        readOnly={isConsultMode}
        appForm={appForm}
        setAppForm={setAppForm}
        appError={appError}
        setAppError={setAppError}
        alreadyApplied={alreadyAppliedToSelected}
        onSubmitApplication={handleApplySubmit}
        onClose={() => setSelectedProject(null)}
        onOpenPdf={(p) => setPdfProject(p)}
      />

      {pdfProject && (
        <OfficialFormatModal project={pdfProject} onClose={() => setPdfProject(null)} />
      )}
    </div>
  );
}
