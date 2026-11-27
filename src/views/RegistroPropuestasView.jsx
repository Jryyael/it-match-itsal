import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Cpu,
  Edit3,
  FileCheck2,
  FilePlus2,
  FolderOpen,
  GraduationCap,
  ImagePlus,
  QrCode,
  Send,
  Sparkles,
  Trash2,
  UserCheck,
  Users,
  Wand2,
  XCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  AREAS_CONOCIMIENTO,
  CARRERAS_ITSAL,
  DEMO_PROJECT_PHOTOS,
  DEPARTAMENTOS_ITSAL,
  HABILIDADES_CATALOGO,
  PERIODOS,
  PROJECT_LIFECYCLE_STATES,
  TIPOS_PROYECTO,
} from '../data/mockData';
import { analizarYMejorarPropuesta, calcularAfinidadProyecto } from '../utils/aiHelpers';
import OfficialFormatModal from '../components/OfficialFormatModal';
import { LifecycleBadge, OriginBadge, StatusBadge } from '../components/StatusBadge';
import MascotSprite from '../components/MascotSprite';
import DocenteAutocomplete, { findVerifiedDocente } from '../components/DocenteAutocomplete';

const RESIDENT_STAGES = [
  { key: 'anteproyecto', label: 'Anteproyecto' },
  { key: 'primerReporte', label: 'Primer Reporte' },
  { key: 'segundoReporte', label: 'Segundo Reporte' },
  { key: 'reporteFinal', label: 'Reporte Final' },
];

const INITIAL_FORM = {
  origen: 'Interno',
  institucion: 'INSTITUTO TECNOLÓGICO DE SALINA CRUZ',
  departamento: 'Ing. Eléctrica y Electrónica',
  perfilRequerido: 'Ing. en Tecnologías de la Información y Comunicaciones',
  alumnosRequeridos: 2,
  asesor: '',
  colaboradores: '',
  jefeDepartamento: 'Ing. Anita del Carmen Morales Cruz',
  areaConocimiento: 'Ingeniería y Tecnología',
  titulo: '',
  tipoProyecto: 'Desarrollo Tecnológico',
  periodo: 'Enero - Junio 2026',
  objetivo: '',
  planteamiento: '',
  justificacion: '',
  alcances: '',
  limitaciones: '',
  observaciones: '',
  correoContacto: '',
  whatsappContacto: '',
  ubicacionContacto: '',
  habilidades: ['Desarrollo Web', 'Bases de Datos'],
  imagenUrl: '/projects/proj-001.jpg',
};

const INPUT_CLASS =
  'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#009FE3] focus:bg-white focus:outline-none transition';

function resizeImageToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Archivo de imagen inválido.'));
      img.onload = () => {
        const maxW = 800;
        const scale = img.width > maxW ? maxW / img.width : 1;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function buildInitialForm(currentUser) {
  const isStudent = currentUser?.roleId === 'estudiante';
  if (isStudent) {
    return {
      ...INITIAL_FORM,
      origen: 'Propuesta de Estudiante',
      modalidadLugar: 'ITSAL',
      institucion: 'INSTITUTO TECNOLÓGICO DE SALINA CRUZ',
      perfilRequerido: currentUser?.carrera || INITIAL_FORM.perfilRequerido,
      alumnosRequeridos: 1,
      asesor: '',
      correoContacto: currentUser?.correo || '',
      whatsappContacto: '',
      ubicacionContacto: 'Campus ITSAL · Salina Cruz',
      estudianteNombre: currentUser?.nombreCompleto || currentUser?.nombre || '',
      estudianteMatricula: currentUser?.matricula || '',
    };
  }
  return {
    ...INITIAL_FORM,
    modalidadLugar: 'ITSAL',
    asesor: currentUser?.roleId === 'docente' ? currentUser.nombre : '',
    correoContacto: currentUser?.roleId === 'docente' ? currentUser.correo || '' : '',
    whatsappContacto: currentUser?.roleId === 'docente' ? '9711248510' : '',
    ubicacionContacto:
      currentUser?.roleId === 'docente' ? 'Edificio D · Cubículo 4 de TIC (10:00-14:00)' : '',
    estudianteNombre: '',
    estudianteMatricula: '',
  };
}

export default function RegistroPropuestasView() {
  const {
    projects,
    applications,
    currentUser,
    createProject,
    resubmitProject,
    assignStudentToProject,
    rejectApplication,
    updateResidentStage,
    updateProjectLifecycle,
    openProjectInBanco,
    navigateView,
    showToast,
    setMascotContext,
  } = useApp();

  const isStudent = currentUser?.roleId === 'estudiante';
  const [activeTab, setActiveTab] = useState('nueva'); // 'nueva' | 'mis-proyectos' | 'seguimiento'
  const [formData, setFormData] = useState(() => buildInitialForm(currentUser));
  const [editingProject, setEditingProject] = useState(null);
  const [expandedProjectIds, setExpandedProjectIds] = useState({});
  const [stageNotesByKey, setStageNotesByKey] = useState({});
  const [aiReport, setAiReport] = useState(null);
  const [generatedProject, setGeneratedProject] = useState(null);

  useEffect(() => {
    setFormData(buildInitialForm(currentUser));
    setEditingProject(null);
    setAiReport(null);
    setActiveTab('nueva');
  }, [currentUser?.id]);

  const registeredProjects = projects.filter((p) => {
    if (isStudent) {
      return (
        p.origen === 'Propuesta de Estudiante' &&
        (p.creadoPorId === currentUser?.id ||
          p.estudianteProponente?.matricula === currentUser?.matricula)
      );
    }
    if (!currentUser?.nombre) return true;
    const asesorLower = (p.asesor || '').toLowerCase();
    const userLower = currentUser.nombre.toLowerCase();
    return (
      p.creadoPorId === currentUser.id ||
      asesorLower === userLower ||
      asesorLower.includes('alfonso miguel') ||
      p.origen === 'Interno'
    );
  });

  const acceptedResidents = registeredProjects.flatMap((proj) =>
    (proj.alumnosAsignados || []).map((resident) => ({
      project: proj,
      resident,
      key: `${proj.id}-${resident.noControl}`,
    }))
  );

  const pendingApplicantsTotal = registeredProjects.reduce((sum, proj) => {
    const count = applications.filter(
      (a) => a.projectId === proj.id && a.estado === 'En Revisión de Academia'
    ).length;
    return sum + count;
  }, 0);

  const toggleProjectApplicants = (projectId) => {
    setExpandedProjectIds((prev) => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const handleStartEditProject = (proj) => {
    setEditingProject(proj);
    setFormData({
      origen:
        proj.origen === 'Propuesta de Estudiante'
          ? 'Propuesta de Estudiante'
          : proj.origen === 'Externo'
          ? 'Externo'
          : 'Interno',
      modalidadLugar: proj.modalidadLugar || 'ITSAL',
      institucion: proj.institucion || '',
      departamento: proj.departamento || INITIAL_FORM.departamento,
      perfilRequerido: proj.perfilRequerido || INITIAL_FORM.perfilRequerido,
      alumnosRequeridos: Number(proj.alumnosRequeridos) || 1,
      asesor: proj.asesor || '',
      colaboradores: proj.colaboradores || '',
      jefeDepartamento: proj.jefeDepartamento || INITIAL_FORM.jefeDepartamento,
      areaConocimiento: proj.areaConocimiento || INITIAL_FORM.areaConocimiento,
      titulo: proj.titulo || '',
      tipoProyecto: proj.tipoProyecto || INITIAL_FORM.tipoProyecto,
      periodo: proj.periodo || INITIAL_FORM.periodo,
      objetivo: proj.objetivo || '',
      planteamiento: proj.planteamiento || '',
      justificacion: proj.justificacion || '',
      alcances: proj.alcances || '',
      limitaciones: proj.limitaciones || '',
      observaciones: proj.observaciones || '',
      correoContacto: proj.correoContacto || '',
      whatsappContacto: proj.whatsappContacto || '',
      ubicacionContacto: proj.ubicacionContacto || '',
      habilidades: proj.habilidades?.length ? proj.habilidades : INITIAL_FORM.habilidades,
      imagenUrl: proj.imagenUrl || '/projects/proj-001.jpg',
      estudianteNombre: proj.estudianteProponente?.nombre || '',
      estudianteMatricula: proj.estudianteProponente?.matricula || '',
    });
    setAiReport(null);
    setActiveTab('nueva');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOriginChange = (origen) => {
    setFormData((prev) => ({
      ...prev,
      origen,
      institucion:
        origen === 'Interno'
          ? 'INSTITUTO TECNOLÓGICO DE SALINA CRUZ'
          : prev.institucion === 'INSTITUTO TECNOLÓGICO DE SALINA CRUZ'
          ? ''
          : prev.institucion,
    }));
  };

  const handleStudentLugarChange = (lugar) => {
    setFormData((prev) => ({
      ...prev,
      origen: 'Propuesta de Estudiante',
      modalidadLugar: lugar,
      institucion:
        lugar === 'ITSAL'
          ? 'INSTITUTO TECNOLÓGICO DE SALINA CRUZ'
          : prev.institucion === 'INSTITUTO TECNOLÓGICO DE SALINA CRUZ'
          ? ''
          : prev.institucion,
    }));
  };

  const toggleSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      habilidades: prev.habilidades.includes(skill)
        ? prev.habilidades.filter((s) => s !== skill)
        : [...prev.habilidades, skill],
    }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      setFormData((prev) => ({ ...prev, imagenUrl: dataUrl }));
      showToast('Foto cargada correctamente', 'success', 'Se guardará junto con la propuesta en localStorage.');
    } catch {
      showToast('No se pudo procesar la imagen', 'error', 'Selecciona un archivo JPG o PNG válido.');
    }
  };

  const handleLoadQuickExample = () => {
    if (isStudent) {
      setFormData({
        origen: 'Propuesta de Estudiante',
        modalidadLugar: 'Externo',
        institucion: 'ASIPONA Salina Cruz · Terminal de Usos Múltiples',
        departamento: 'Ing. Eléctrica y Electrónica',
        perfilRequerido:
          currentUser?.carrera || 'Ing. en Tecnologías de la Información y Comunicaciones',
        alumnosRequeridos: 1,
        asesor: 'Ing. Alfonso Miguel Escobar',
        colaboradores: 'Ing. Patricia Toledo (Enlace Externo ASIPONA)',
        jefeDepartamento: 'Ing. Anita del Carmen Morales Cruz',
        areaConocimiento: 'Ingeniería y Tecnología',
        titulo:
          'Portal Móvil de Trazabilidad QR y Bitácora Digital para Control de Maniobras en Patio Portuario',
        tipoProyecto: 'Desarrollo Tecnológico',
        periodo: 'Enero - Junio 2026',
        objetivo: 'hacer una app web con codigos qr para registrar movimientos de carga en patio',
        planteamiento:
          'actualmente el control en patio se hace en hojas de papel y tarda mucho en cuadrar con el sistema central',
        justificacion:
          'Digitaliza la captura en campo con códigos QR verificables, reduciendo errores de transcripción en operaciones portuarias.',
        alcances: 'lector qr web, tablero de turnos en tiempo real y exportacion a reporte oficial',
        limitaciones:
          'Las pruebas piloto se realizarán en horario diurno dentro de la zona de acceso autorizado.',
        observaciones: 'Proyecto propuesto directamente por el residente en coordinación con enlace externo.',
        correoContacto: currentUser?.correo || 'l211020074@salinacruz.tecnm.mx',
        whatsappContacto: '9711124590',
        ubicacionContacto: 'Terminal Portuaria · Salina Cruz (09:00-14:00)',
        habilidades: ['Desarrollo Web', 'Códigos QR', 'Bases de Datos', 'Logística Portuaria'],
        imagenUrl: '/projects/proj-003.jpg',
        estudianteNombre: currentUser?.nombreCompleto || currentUser?.nombre || '',
        estudianteMatricula: currentUser?.matricula || '',
      });
      setAiReport(null);
      setMascotContext(3, 'Ejemplo estudiantil cargado. Optimízalo con IA y envíalo a Revisión Académica');
      showToast(
        'Ejemplo de propuesta estudiantil cargado',
        'info',
        'Puedes editarlo, validarlo con IA y enviarlo a Revisión Académica.'
      );
      return;
    }

    setFormData({
      origen: 'Externo',
      modalidadLugar: 'Externo',
      institucion: 'Parque Eólico Bií Hioxo - Istmo de Tehuantepec',
      departamento: 'Ing. Eléctrica y Electrónica',
      perfilRequerido: 'Ing. Electrónica',
      alumnosRequeridos: 2,
      asesor: 'Ing. Roberto Morales Chiñas',
      colaboradores: 'Ing. Mariana Castillejos (Enlace Parque Eólico)',
      jefeDepartamento: 'Ing. Anita del Carmen Morales Cruz',
      areaConocimiento: 'Ingeniería y Tecnología',
      titulo:
        'Sistema Inteligente de Diagnóstico Térmico y Telemetría para Inversores de Aerogeneradores',
      tipoProyecto: 'Desarrollo Tecnológico',
      periodo: 'Enero - Junio 2026',
      objetivo: 'hacer un sistema que mida la temperatura de los inversores para evitar fallas',
      planteamiento:
        'los inversores se calientan mucho por el clima del istmo y no hay monitoreo remoto continuo en tiempo real',
      justificacion:
        'Permitirá prevenir paros no programados en generación eólica y reducir costos de mantenimiento correctivo en la subestación.',
      alcances: 'sensores de temperatura, tablero web de alertas y manual de instalacion',
      limitaciones:
        'Las pruebas en campo se limitan a dos aerogeneradores piloto autorizados por seguridad industrial.',
      observaciones: 'Se requiere equipo de protección personal (EPP) otorgado por la empresa.',
      correoContacto: 'roberto.morales@salinacruz.tecnm.mx',
      whatsappContacto: '9711309822',
      ubicacionContacto: 'Edificio Eléctrica y Electrónica · Cubículo 2 (10:00-13:00)',
      habilidades: ['IoT', 'Energía Renovable', 'Automatización', 'Redes'],
      imagenUrl: '/projects/proj-005.jpg',
      estudianteNombre: '',
      estudianteMatricula: '',
    });
    setAiReport(null);
    setMascotContext(3, 'Aquí redactas tu propuesta y generas el formato oficial con código QR');
    showToast(
      'Borrador de ejemplo cargado',
      'info',
      'Presiona "Asistente IA de Redacción y Validación" para optimizarlo.'
    );
  };

  const handleRunAI = () => {
    const report = analizarYMejorarPropuesta(formData);
    setAiReport(report);
    setMascotContext(6, 'Analizando competencias clave y requisitos del proyecto...');
  };

  const handleApplyAISuggestions = () => {
    if (!aiReport) return;
    setFormData((prev) => ({
      ...prev,
      objetivo: aiReport.sugerencias.objetivo,
      planteamiento: aiReport.sugerencias.planteamiento,
      alcances: aiReport.sugerencias.alcances,
    }));
    setMascotContext(7, '¡Excelente! Acción registrada correctamente en el sistema');
    showToast(
      'Redacción académica aplicada',
      'success',
      'Objetivo, Planteamiento y Alcances fueron optimizados.'
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = analizarYMejorarPropuesta(formData);
    if (!validation.valido) {
      setAiReport(validation);
      showToast(
        'Faltan campos obligatorios',
        'error',
        `Revisa ${validation.errores.length} campo(s) señalado(s) por el validador.`
      );
      return;
    }

    if (!findVerifiedDocente(formData.asesor)) {
      showToast(
        'Selecciona un docente ITSAL válido',
        'error',
        'Elige al Asesor del Proyecto desde las sugerencias desplegables del catálogo oficial.'
      );
      return;
    }

    if (editingProject) {
      const updated = resubmitProject(editingProject.id, formData);
      if (updated) {
        setGeneratedProject(updated);
      }
      setEditingProject(null);
      setFormData(buildInitialForm(currentUser));
      setAiReport(null);
      setActiveTab('mis-proyectos');
      return;
    }

    const created = createProject(formData);
    setGeneratedProject(created);
    setFormData(buildInitialForm(currentUser));
    setAiReport(null);
  };

  return (
    <div className="px-6 sm:px-8 py-8 pb-24 max-w-6xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4 space-y-4">
        {/* 1. Encabezado superior de ancho completo con acciones secundarias a la derecha */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#009FE3]">
              {isStudent
                ? 'Estudiante · Propuesta Propia de Residencia'
                : 'Docente / Empresa · Asesoría de Residencias'}
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
              {isStudent ? 'Proponer mi Proyecto' : 'Módulo Docente y Propuestas'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {isStudent
                ? 'Registra tu propia propuesta (en el ITSAL o en empresa/organismo) y envíala a Revisión Académica.'
                : 'Registra propuestas oficiales con QR, selecciona a tus residentes y da seguimiento a sus entregas.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 sm:pt-1">
            {!isStudent && (
              <button
                type="button"
                onClick={() => navigateView('banco')}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-[#009FE3] hover:text-[#009FE3]"
              >
                <BookOpen className="h-3.5 w-3.5 text-[#009FE3]" />
                Consultar Banco
              </button>
            )}

            {activeTab === 'nueva' && !editingProject && (
              <button
                type="button"
                onClick={handleLoadQuickExample}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 transition hover:border-[#009FE3]"
              >
                <Wand2 className="h-3.5 w-3.5 text-[#D99B16]" />
                {isStudent ? 'Cargar Ejemplo Estudiantil' : 'Cargar Borrador Demo'}
              </button>
            )}
          </div>
        </div>

        {/* 2. Fila dedicada para las pestañas principales del rol */}
        <div
          role="tablist"
          aria-label="Secciones del módulo"
          className="flex flex-wrap items-center gap-2 pt-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'nueva'}
            onClick={() => setActiveTab('nueva')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold whitespace-nowrap transition ${
              activeTab === 'nueva'
                ? 'bg-[#0B1120] text-white shadow-xs'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-[#009FE3] hover:text-slate-900'
            }`}
          >
            <FilePlus2 className={`h-3.5 w-3.5 ${activeTab === 'nueva' ? 'text-[#009FE3]' : ''}`} />
            {editingProject ? 'Corregir Propuesta' : 'Nueva Propuesta'}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'mis-proyectos'}
            onClick={() => setActiveTab('mis-proyectos')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold whitespace-nowrap transition ${
              activeTab === 'mis-proyectos'
                ? 'bg-[#0B1120] text-white shadow-xs'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-[#009FE3] hover:text-slate-900'
            }`}
          >
            <FolderOpen
              className={`h-3.5 w-3.5 ${activeTab === 'mis-proyectos' ? 'text-[#009FE3]' : ''}`}
            />
            Mis Propuestas y Seguimiento ({registeredProjects.length})
            {!isStudent && pendingApplicantsTotal > 0 && (
              <span className="rounded-full bg-[#009FE3] px-1.5 py-0.5 font-mono text-[10px] font-bold text-white leading-none">
                {pendingApplicantsTotal}
              </span>
            )}
          </button>

          {!isStudent && (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'seguimiento'}
              onClick={() => setActiveTab('seguimiento')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold whitespace-nowrap transition ${
                activeTab === 'seguimiento'
                  ? 'bg-[#0B1120] text-white shadow-xs'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-[#009FE3] hover:text-slate-900'
              }`}
            >
              <ClipboardCheck
                className={`h-3.5 w-3.5 ${activeTab === 'seguimiento' ? 'text-[#009FE3]' : ''}`}
              />
              Seguimiento de Residentes ({acceptedResidents.length})
            </button>
          )}
        </div>
      </div>

      {activeTab === 'seguimiento' && !isStudent ? (
        <div className="space-y-4 animate-view-in">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                Tablero de Seguimiento de Residentes Aceptados
              </h2>
              <p className="text-xs text-slate-500">
                Aprueba las etapas oficiales de residencia y registra observaciones rápidas de asesoría.
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-[#009FE3]">
              {acceptedResidents.length} residente(s) activo(s)
            </span>
          </div>

          {acceptedResidents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center space-y-3">
              <Users className="h-8 w-8 mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-800">
                Aún no tienes residentes aceptados en tus proyectos
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Revisa las postulaciones en "Mis Proyectos y Postulantes" y acepta a tu primer residente para dar seguimiento a sus reportes.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('mis-proyectos')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#009FE3] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0088C6]"
              >
                <FolderOpen className="h-3.5 w-3.5" />
                Ir a Mis Proyectos y Postulantes
              </button>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {acceptedResidents.map(({ project, resident, key }) => {
                const etapas = resident.etapas || {};
                const completedCount = RESIDENT_STAGES.filter((s) => Boolean(etapas[s.key])).length;
                const progressPct = Math.round((completedCount / RESIDENT_STAGES.length) * 100);
                const noteValue =
                  stageNotesByKey[key] !== undefined
                    ? stageNotesByKey[key]
                    : resident.observacionAsesor || '';

                return (
                  <article
                    key={key}
                    className="rounded-xl border border-slate-200 bg-white p-5 space-y-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-[#009FE3]">
                            {project.folio}
                          </span>
                          <span className="font-mono text-[11px] text-slate-400">
                            · {resident.noControl}
                          </span>
                        </div>
                        <h3 className="mt-0.5 text-base font-extrabold text-slate-900">
                          {resident.nombre}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {resident.carrera} · Proyecto: <strong className="text-slate-700">{project.titulo}</strong>
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="rounded-full bg-[#009FE3]/10 px-2.5 py-1 font-mono text-xs font-extrabold text-[#009FE3]">
                          {progressPct}% avance
                        </span>
                        <select
                          value={project.estado_proyecto || 'Disponible'}
                          onChange={(e) => updateProjectLifecycle(project.id, e.target.value)}
                          aria-label="Estado operativo del proyecto"
                          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-[#0D2240] focus:border-[#009FE3] focus:bg-white focus:outline-none"
                        >
                          {PROJECT_LIFECYCLE_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {RESIDENT_STAGES.map((stage) => {
                          const done = Boolean(etapas[stage.key]);
                          return (
                            <button
                              key={stage.key}
                              type="button"
                              onClick={() =>
                                updateResidentStage(project.id, resident.noControl, {
                                  etapas: { [stage.key]: !done },
                                  observacionAsesor: noteValue,
                                  notifyLabel: !done ? stage.label : undefined,
                                })
                              }
                              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs font-bold transition ${
                                done
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-[#009FE3] hover:bg-white'
                              }`}
                            >
                              <span
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${
                                  done
                                    ? 'bg-emerald-600 text-white'
                                    : 'border border-slate-300 bg-white'
                                }`}
                              >
                                {done && <Check className="h-3 w-3" />}
                              </span>
                              <span className="truncate">{stage.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3 space-y-2">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Observación rápida de asesoría
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={noteValue}
                          onChange={(e) =>
                            setStageNotesByKey((prev) => ({
                              ...prev,
                              [key]: e.target.value,
                            }))
                          }
                          placeholder="Ej. Aprobado capítulo 1; revisar diagrama de red..."
                          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:border-[#009FE3] focus:bg-white focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateResidentStage(project.id, resident.noControl, {
                              observacionAsesor: noteValue,
                              notifyLabel: 'Observación de asesoría',
                            })
                          }
                          className="shrink-0 rounded-lg bg-[#0B1120] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#009FE3]"
                        >
                          Guardar nota
                        </button>
                      </div>
                      {resident.ultimaRevision && (
                        <p className="font-mono text-[10px] text-slate-400">
                          Última revisión registrada: {resident.ultimaRevision}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      ) : activeTab === 'mis-proyectos' ? (
        <div className="space-y-4 animate-view-in">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold text-slate-500">
              {isStudent
                ? `Propuestas enviadas a Revisión Académica (${registeredProjects.length})`
                : `Tus propuestas registradas y postulaciones de estudiantes (${registeredProjects.length})`}
            </p>
            <button
              type="button"
              onClick={() => {
                setEditingProject(null);
                setFormData(buildInitialForm(currentUser));
                setActiveTab('nueva');
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B1120] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#009FE3]"
            >
              <FilePlus2 className="h-3.5 w-3.5" />
              {isStudent ? 'Proponer otro proyecto' : 'Registrar otra propuesta'}
            </button>
          </div>

          {registeredProjects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center space-y-3">
              <p className="text-sm font-bold text-slate-800">
                Aún no has enviado propuestas propias
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Registra un proyecto en el ITSAL o con una empresa externa para que Jefatura / Academia lo dictamine.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('nueva')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#009FE3] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0088C6]"
              >
                <FilePlus2 className="h-3.5 w-3.5" />
                Crear mi primera propuesta
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {registeredProjects.map((proj) => {
                const projectApps = applications.filter((a) => a.projectId === proj.id);
                const pendingApps = projectApps.filter(
                  (a) => a.estado === 'En Revisión de Academia'
                );
                const ocupadas = proj.alumnosAsignados?.length || 0;
                const isRejected = proj.estado === 'Rechazado';
                const isApproved = proj.estado === 'Publicado' || proj.estado === 'Asignado';
                const isInReview = !isRejected && !isApproved;
                const semaphore = isApproved
                  ? {
                      label: 'Aprobada y publicada',
                      dot: 'bg-emerald-500',
                      badge: 'border-emerald-200 bg-emerald-50 text-emerald-800',
                    }
                  : isRejected
                  ? {
                      label: 'Con observaciones',
                      dot: 'bg-rose-500',
                      badge: 'border-rose-200 bg-rose-50 text-rose-800',
                    }
                  : {
                      label: 'En revisión',
                      dot: 'bg-amber-500',
                      badge: 'border-amber-200 bg-amber-50 text-amber-900',
                    };
                const correctionNote =
                  proj.observacionesVinculacion ||
                  proj.observacionesAcademia ||
                  'Requiere ajustes en planteamiento o alcances.';
                const isExpanded =
                  expandedProjectIds[proj.id] !== undefined
                    ? expandedProjectIds[proj.id]
                    : pendingApps.length > 0;

                return (
                  <article
                    key={proj.id}
                    className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 transition duration-200 hover:border-slate-300"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#009FE3]">
                            {proj.folio}
                          </span>
                          {/* Semáforo de estatus de la propuesta */}
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold ${semaphore.badge}`}
                          >
                            <span className={`h-2 w-2 rounded-full ${semaphore.dot}`} />
                            {semaphore.label}
                          </span>
                          <LifecycleBadge estadoProyecto={proj.estado_proyecto || 'Disponible'} />
                          <OriginBadge origen={proj.origen} modalidadLugar={proj.modalidadLugar} />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                          {proj.titulo}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {proj.institucion} · {proj.perfilRequerido}
                        </p>

                        {/* Métricas de postulación y cupos cuando está aprobada y publicada */}
                        {isApproved && (
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50/70 px-2.5 py-0.5 font-mono font-bold text-emerald-800">
                              <Users className="h-3 w-3 text-emerald-600" />
                              {projectApps.length} postulado(s) · {ocupadas}/{proj.alumnosRequeridos} cupos ocupados
                            </span>
                            {isInReview ? null : (
                              <span className="text-slate-400 font-medium">
                                Estado del banco: {proj.estado}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {!isStudent && (
                          <select
                            value={proj.estado_proyecto || 'Disponible'}
                            onChange={(e) => updateProjectLifecycle(proj.id, e.target.value)}
                            aria-label="Cambiar estado de ciclo de vida"
                            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-[#0D2240] focus:border-[#009FE3] focus:bg-white focus:outline-none"
                          >
                            {PROJECT_LIFECYCLE_STATES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        )}

                        {isApproved && (
                          <button
                            type="button"
                            onClick={() => openProjectInBanco(proj.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#009FE3] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#0088C6]"
                          >
                            Ver en el Banco
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setGeneratedProject(proj)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 transition hover:border-[#009FE3] hover:bg-white hover:text-[#009FE3]"
                        >
                          <QrCode className="h-3.5 w-3.5 text-[#009FE3]" />
                          Ver formato QR
                        </button>

                        {!isStudent && (
                          <button
                            type="button"
                            onClick={() => toggleProjectApplicants(proj.id)}
                            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
                              isExpanded
                                ? 'border-[#0B1120] bg-[#0B1120] text-white'
                                : 'border-slate-200 bg-white text-slate-800 hover:border-[#009FE3]'
                            }`}
                          >
                            <Users className="h-3.5 w-3.5" />
                            Postulantes ({projectApps.length})
                            {pendingApps.length > 0 && (
                              <span className="rounded-full bg-[#009FE3] px-1.5 py-0.5 font-mono text-[10px] font-bold text-white leading-none">
                                {pendingApps.length}
                              </span>
                            )}
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Aviso de corrección con comentario de Vinculación / Academia (visible para Alumno y Docente) */}
                    {isRejected && (
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5">
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <p className="text-[11px] font-extrabold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Comentarios de Vinculación / Academia para corregir
                          </p>
                          <p className="text-xs font-medium text-rose-900">
                            {correctionNote}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleStartEditProject(proj)}
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-rose-700"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          Editar y reenviar
                        </button>
                      </div>
                    )}

                    {/* Panel desplegable de postulantes para Docente */}
                    {!isStudent && isExpanded && (
                      <div className="rounded-xl border border-slate-200 bg-[#FAF8F5] p-4 space-y-3 animate-it-enter">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                            Estudiantes postulados a este proyecto ({projectApps.length})
                          </p>
                          <span className="font-mono text-[11px] font-bold text-emerald-700">
                            {Math.max(0, proj.alumnosRequeridos - ocupadas)} plaza(s) disponible(s)
                          </span>
                        </div>

                        {projectApps.length === 0 ? (
                          <p className="text-xs text-slate-500 py-2">
                            Aún no hay estudiantes postulados en este proyecto.
                          </p>
                        ) : (
                          <div className="space-y-2.5">
                            {projectApps.map((app) => {
                              const affinity = calcularAfinidadProyecto(
                                proj,
                                app.carrera,
                                app.habilidades || []
                              );
                              const isPendingApp = app.estado === 'En Revisión de Academia';
                              return (
                                <div
                                  key={app.id}
                                  className="rounded-xl border border-slate-200 bg-white p-3.5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
                                >
                                  <div className="space-y-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <p className="text-sm font-bold text-slate-900">
                                        {app.estudianteNombre}
                                      </p>
                                      <span className="font-mono text-[11px] font-semibold text-slate-500">
                                        {app.noControl}
                                      </span>
                                      <span className="inline-flex items-center gap-1 rounded-full bg-[#009FE3]/10 px-2 py-0.5 font-mono text-[10px] font-extrabold text-[#009FE3]">
                                        <Sparkles className="h-3 w-3" />
                                        {affinity.porcentaje}% afinidad IA
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                      {app.carrera} · Promedio {app.promedio}
                                    </p>
                                    <p className="text-xs text-slate-700 italic leading-relaxed">
                                      "{app.motivacion}"
                                    </p>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                                    {isPendingApp ? (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() => rejectApplication(app.id)}
                                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
                                        >
                                          <XCircle className="h-3.5 w-3.5" />
                                          Declinar
                                        </button>
                                        <button
                                          type="button"
                                          disabled={ocupadas >= proj.alumnosRequeridos}
                                          onClick={() =>
                                            assignStudentToProject(
                                              app.id,
                                              'Residente aceptado por Docente Asesor.'
                                            )
                                          }
                                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#009FE3] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#0088C6] disabled:cursor-not-allowed disabled:bg-slate-300"
                                        >
                                          <UserCheck className="h-3.5 w-3.5" />
                                          Aceptar residente
                                        </button>
                                      </>
                                    ) : (
                                      <span
                                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                          app.estado === 'No Seleccionado'
                                            ? 'bg-slate-100 text-slate-600'
                                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                        }`}
                                      >
                                        {app.estado}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      ) : (
      <div className="grid gap-6 lg:grid-cols-12 items-start animate-view-in">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-8 space-y-5 rounded-xl border border-slate-200 bg-white p-6"
        >
          <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Formato de Registro de Proyectos · Residencia Profesional
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Los campos marcados con * son obligatorios.
              </p>
            </div>
            <span className="rounded-md bg-slate-100 border border-slate-200 px-2.5 py-1 font-mono text-[11px] font-bold text-slate-700">
              ITSAL-RP-2026
            </span>
          </div>

          {editingProject && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1 min-w-0 flex-1">
                <p className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Corrigiendo propuesta devuelta: {editingProject.folio}
                </p>
                <p className="text-xs text-amber-800">
                  <strong>Observaciones:</strong>{' '}
                  {editingProject.observacionesAcademia ||
                    editingProject.observacionesVinculacion ||
                    'Atiende las observaciones y reenvía para nueva revisión.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingProject(null);
                  setFormData(buildInitialForm(currentUser));
                }}
                className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100"
              >
                Cancelar edición
              </button>
            </div>
          )}

          {isStudent && (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-4 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-900 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                  <GraduationCap className="h-3 w-3 text-[#38BDF8]" />
                  Propuesta de Estudiante
                </span>
                <span className="font-mono text-[11px] font-bold text-indigo-900">
                  Estatus inicial: En Revisión Académica
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-slate-700">
                    Alumno Proponente
                  </label>
                  <input
                    type="text"
                    value={formData.estudianteNombre}
                    onChange={(e) => setFormData({ ...formData, estudianteNombre: e.target.value })}
                    className={`${INPUT_CLASS} bg-white`}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-slate-700">
                    Número de Control / Matrícula
                  </label>
                  <input
                    type="text"
                    value={formData.estudianteMatricula}
                    onChange={(e) =>
                      setFormData({ ...formData, estudianteMatricula: e.target.value })
                    }
                    className={`${INPUT_CLASS} bg-white font-mono`}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                {isStudent ? 'Modalidad / Sede de Realización *' : 'Origen del Proyecto *'}
              </label>
              {isStudent ? (
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'ITSAL', label: 'En el ITSAL' },
                    { id: 'Externo', label: 'Empresa / Org.' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleStudentLugarChange(opt.id)}
                      className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                        formData.modalidadLugar === opt.id
                          ? 'border-[#0B1120] bg-[#0B1120] text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {['Interno', 'Externo'].map((orig) => (
                    <button
                      key={orig}
                      type="button"
                      onClick={() => handleOriginChange(orig)}
                      className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                        formData.origen === orig
                          ? 'border-[#0B1120] bg-[#0B1120] text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {orig === 'Interno' ? 'Interno (ITSAL)' : 'Externo (Empresa)'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="sm:col-span-7">
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Institución / Organismo / Empresa *
              </label>
              <input
                type="text"
                value={formData.institucion}
                onChange={(e) => setFormData({ ...formData, institucion: e.target.value })}
                placeholder="Ej. PEMEX Refinería / ASIPONA Salina Cruz"
                className={INPUT_CLASS}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Departamento Académico *
              </label>
              <select
                value={formData.departamento}
                onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                className={INPUT_CLASS}
              >
                {DEPARTAMENTOS_ITSAL.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-5">
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Perfil Profesional Requerido *
              </label>
              <select
                value={formData.perfilRequerido}
                onChange={(e) => setFormData({ ...formData, perfilRequerido: e.target.value })}
                className={INPUT_CLASS}
              >
                {CARRERAS_ITSAL.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                No. Alumnos *
              </label>
              <input
                type="number"
                min={1}
                max={6}
                value={formData.alumnosRequeridos}
                onChange={(e) =>
                  setFormData({ ...formData, alumnosRequeridos: Number(e.target.value) })
                }
                className={`${INPUT_CLASS} text-center font-mono font-bold`}
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Asesor del Proyecto *
              </label>
              <DocenteAutocomplete
                mode="advisor"
                value={formData.asesor}
                onChange={(asesor) => setFormData((prev) => ({ ...prev, asesor }))}
                preferredDepartment={formData.departamento}
                placeholder="Buscar docente ITSAL (ej. Alfonso, Anita...)"
                inputClassName={INPUT_CLASS}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Colaboradores
              </label>
              <DocenteAutocomplete
                mode="collaborators"
                value={formData.colaboradores}
                onChange={(colaboradores) => setFormData((prev) => ({ ...prev, colaboradores }))}
                preferredDepartment={formData.departamento}
                allowExternal={
                  isStudent ? formData.modalidadLugar === 'Externo' : formData.origen === 'Externo'
                }
                placeholder={
                  (isStudent ? formData.modalidadLugar === 'Externo' : formData.origen === 'Externo')
                    ? 'Docente ITSAL o enlace externo de empresa'
                    : 'Buscar co-asesor docente del ITSAL'
                }
                inputClassName={INPUT_CLASS}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Vo. Bo. Jefatura de Depto.
              </label>
              <input
                type="text"
                value={formData.jefeDepartamento}
                onChange={(e) => setFormData({ ...formData, jefeDepartamento: e.target.value })}
                placeholder="Nombre del Jefe(a) de Depto."
                className={INPUT_CLASS}
              />
            </div>
          </div>

          {/* Contacto directo del responsable (Opcional) */}
          <div className="rounded-xl border border-slate-200/80 bg-[#FAF8F5] p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-extrabold text-[#0D2240]">
                Contacto directo del asesor / responsable (Opcional)
              </p>
              <span className="text-[11px] font-medium text-slate-500">
                Visible en el Banco de Proyectos para dudas y entrevistas
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-700">
                  Correo institucional
                </label>
                <input
                  type="email"
                  value={formData.correoContacto}
                  onChange={(e) => setFormData({ ...formData, correoContacto: e.target.value })}
                  placeholder="docente@salinacruz.tecnm.mx"
                  className={`${INPUT_CLASS} bg-white`}
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-700">
                  WhatsApp / Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.whatsappContacto}
                  onChange={(e) => setFormData({ ...formData, whatsappContacto: e.target.value })}
                  placeholder="Ej. 9711248510"
                  className={`${INPUT_CLASS} bg-white font-mono`}
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-700">
                  Ubicación / Cubículo / Horario
                </label>
                <input
                  type="text"
                  value={formData.ubicacionContacto}
                  onChange={(e) => setFormData({ ...formData, ubicacionContacto: e.target.value })}
                  placeholder="Edificio D · Cubículo 4 (10:00-14:00)"
                  className={`${INPUT_CLASS} bg-white`}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Área del Conocimiento *
              </label>
              <select
                value={formData.areaConocimiento}
                onChange={(e) => setFormData({ ...formData, areaConocimiento: e.target.value })}
                className={INPUT_CLASS}
              >
                {AREAS_CONOCIMIENTO.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-4">
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Tipo de Proyecto *
              </label>
              <select
                value={formData.tipoProyecto}
                onChange={(e) => setFormData({ ...formData, tipoProyecto: e.target.value })}
                className={INPUT_CLASS}
              >
                {TIPOS_PROYECTO.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Periodo
              </label>
              <select
                value={formData.periodo}
                onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
                className={INPUT_CLASS}
              >
                {PERIODOS.map((per) => (
                  <option key={per} value={per}>
                    {per}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700">
              Título del Proyecto *
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Ej. Implementación de un Sistema Web para..."
              className={`${INPUT_CLASS} font-bold`}
            />
          </div>

          {/* Foto del Proyecto, Laboratorio o Empresa */}
          <div className="border-y border-slate-200 py-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-900">
                  Fotografía del Proyecto, Laboratorio o Empresa (Opcional)
                </label>
                <p className="text-[11px] text-slate-500">
                  Sube una foto real desde tu equipo o selecciona una foto demo rápida.
                </p>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#0B1120] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#009FE3]">
                <ImagePlus className="h-3.5 w-3.5" />
                Subir foto
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {formData.imagenUrl && (
                <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  <img
                    src={formData.imagenUrl}
                    alt="Vista previa del proyecto"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, imagenUrl: '' }))}
                    title="Quitar foto"
                    className="absolute right-1 top-1 rounded-md bg-slate-900/80 p-1 text-white hover:bg-rose-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )}

              <div className="flex-1 flex flex-wrap gap-1.5">
                {DEMO_PROJECT_PHOTOS.map((photo) => {
                  const active = formData.imagenUrl === photo.url;
                  return (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, imagenUrl: photo.url }))}
                      title={photo.label}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] font-semibold transition ${
                        active
                          ? 'border-[#009FE3] bg-[#009FE3]/10 text-slate-900'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-400'
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.label}
                        className="h-5 w-5 rounded object-cover"
                      />
                      <span className="truncate max-w-[115px]">{photo.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Objetivo *
              </label>
              <textarea
                rows={2}
                value={formData.objetivo}
                onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
                placeholder="Redacta el objetivo general iniciando con verbo en infinitivo..."
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Planteamiento del Proyecto (Descripción, elementos y formulación) *
              </label>
              <textarea
                rows={3}
                value={formData.planteamiento}
                onChange={(e) => setFormData({ ...formData, planteamiento: e.target.value })}
                placeholder="Describe la problemática actual, los elementos técnicos y la formulación de la solución..."
                className={INPUT_CLASS}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Justificación *
                </label>
                <textarea
                  rows={3}
                  value={formData.justificacion}
                  onChange={(e) => setFormData({ ...formData, justificacion: e.target.value })}
                  placeholder="Impacto técnico, económico o institucional..."
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Alcances *
                </label>
                <textarea
                  rows={3}
                  value={formData.alcances}
                  onChange={(e) => setFormData({ ...formData, alcances: e.target.value })}
                  placeholder="Entregables tangibles o cobertura..."
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Limitaciones y/o Restricciones *
                </label>
                <textarea
                  rows={2}
                  value={formData.limitaciones}
                  onChange={(e) => setFormData({ ...formData, limitaciones: e.target.value })}
                  placeholder="Condicionantes técnicos o de alcance..."
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Observaciones
                </label>
                <textarea
                  rows={2}
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  placeholder="Notas adicionales..."
                  className={INPUT_CLASS}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700">
              Competencias Clave (para Recomendador IA)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {HABILIDADES_CATALOGO.slice(0, 12).map((sk) => {
                const active = formData.habilidades.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => toggleSkill(sk)}
                    className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] font-semibold transition ${
                      active
                        ? 'border-[#0B1120] bg-[#0B1120] text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-[#009FE3]'
                    }`}
                  >
                    {active && <Check className="h-3 w-3 text-[#009FE3]" />}
                    {sk}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={handleRunAI}
              className="inline-flex items-center gap-2 rounded-lg border border-[#009FE3] bg-[#009FE3]/10 px-4 py-2 text-xs font-bold text-[#0D2240] transition hover:bg-[#009FE3]/20"
            >
              <Cpu className="h-4 w-4 text-[#009FE3]" />
              Asistente IA de Redacción y Validación
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-[#0B1120] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#009FE3]"
            >
              <FilePlus2 className="h-4 w-4 text-[#D99B16]" />
              {editingProject
                ? 'Guardar correcciones y reenviar a dictamen'
                : isStudent
                ? 'Enviar a Revisión Académica y Generar QR'
                : 'Guardar Propuesta y Generar Folio QR'}
            </button>
          </div>
        </form>

        {/* Right Sticky AI Assistant Panel */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 sticky top-6 overflow-visible">
            <div className="flex items-center gap-3 rounded-xl bg-[#FAF8F5] px-3.5 pt-3 pb-2.5 mb-4 overflow-visible">
              <div className="pt-1 overflow-visible shrink-0">
                <MascotSprite
                  pose={6}
                  variant="full"
                  blend={true}
                  className="w-16 shrink-0 transition-all duration-300 hover:-translate-y-1"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900">
                  Asistente IA de Redacción
                </h3>
                <p className="text-xs text-slate-500">
                  Validación y estilo institucional TecNM
                </p>
              </div>
            </div>

            {!aiReport ? (
              <div className="space-y-3 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">
                  Revisión normativa antes de enviar:
                </p>
                <ul className="space-y-1.5 list-disc pl-4">
                  <li>Detecta campos obligatorios faltantes.</li>
                  <li>Evalúa la calidad de redacción académica.</li>
                  <li>
                    Genera versiones mejoradas de <strong className="text-slate-900">Objetivo</strong>,{' '}
                    <strong className="text-slate-900">Planteamiento</strong> y{' '}
                    <strong className="text-slate-900">Alcances</strong>.
                  </li>
                </ul>
                <button
                  type="button"
                  onClick={handleRunAI}
                  className="mt-2 w-full rounded-lg bg-[#009FE3] py-2.5 text-xs font-bold text-white hover:bg-[#0088C6]"
                >
                  Analizar borrador actual
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs animate-it-enter">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-700">Índice de Completitud</span>
                    <span className="font-mono font-bold text-[#009FE3]">
                      {aiReport.puntuacionCalidad}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        aiReport.puntuacionCalidad >= 85
                          ? 'bg-emerald-500'
                          : aiReport.puntuacionCalidad >= 60
                          ? 'bg-[#D99B16]'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${aiReport.puntuacionCalidad}%` }}
                    />
                  </div>
                </div>

                {aiReport.errores.length > 0 ? (
                  <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 space-y-1">
                    <p className="font-bold text-rose-800 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" />
                      Faltan {aiReport.errores.length} campo(s) obligatorio(s)
                    </p>
                    <ul className="list-disc pl-4 text-rose-700 space-y-0.5">
                      {aiReport.errores.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 font-semibold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Todos los campos obligatorios están completos.
                  </div>
                )}

                {aiReport.advertencias.length > 0 && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-1">
                    <p className="font-bold text-slate-900">Sugerencias de estilo:</p>
                    <ul className="list-disc pl-4 text-amber-900 space-y-0.5">
                      {aiReport.advertencias.map((adv, i) => (
                        <li key={i}>{adv}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-2.5 border-t border-slate-200 pt-3">
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <FileCheck2 className="h-4 w-4 text-[#009FE3]" />
                    Redacción Académica Sugerida
                  </p>
                  <div>
                    <span className="font-bold text-[#009FE3] block">Objetivo:</span>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">
                      {aiReport.sugerencias.objetivo}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-[#009FE3] block">Planteamiento:</span>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">
                      {aiReport.sugerencias.planteamiento}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-[#009FE3] block">Alcances:</span>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">
                      {aiReport.sugerencias.alcances}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyAISuggestions}
                    className="mt-2 w-full rounded-lg bg-[#0B1120] py-2 font-bold text-white hover:bg-[#009FE3]"
                  >
                    Aplicar mejoras al formulario
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
      )}

      {generatedProject && (
        <OfficialFormatModal
          project={generatedProject}
          onClose={() => setGeneratedProject(null)}
        />
      )}
    </div>
  );
}
