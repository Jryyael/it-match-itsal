import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Award,
  BarChart3,
  Briefcase,
  Building2,
  CheckCircle2,
  Cloud,
  Database,
  Download,
  FileSpreadsheet,
  GraduationCap,
  HardDrive,
  Printer,
  RefreshCw,
  Server,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CARRERAS_ITSAL, PERIODOS } from '../data/mockData';
import { exportProjectsToCSV } from '../utils/exportHelpers';
import { LifecycleBadge, StatusBadge } from '../components/StatusBadge';
import MascotSprite from '../components/MascotSprite';

const DB_STORAGE_KEY = 'sibap_itsal_db_config_v1';
const AVAL_STORAGE_KEY = 'sibap_itsal_avales_v1';

const DEFAULT_DB_CONFIG = {
  motor: 'PostgreSQL',
  host: '172.16.10.25',
  puerto: '5432',
  baseDatos: 'itmatch_residencias_itsal',
  usuario: 'sgc_itsal_admin',
};

const DEFAULT_PORTS = {
  PostgreSQL: '5432',
  MySQL: '3306',
  'SQL Server': '1433',
};

function getLocalDateStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

function countByKey(items, key) {
  const map = {};
  items.forEach((item) => {
    const val = item[key] || 'No especificado';
    map[val] = (map[val] || 0) + 1;
  });
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

export default function IndicadoresSgcView() {
  const {
    projects,
    currentUser,
    showToast,
    pushNotification,
    setMascotContext,
    storageMode,
    cloudStatus,
    switchStorageMode,
    syncDemoToCloudAction,
  } = useApp();
  const [periodo, setPeriodo] = useState('Todos');
  const [sgcModalOpen, setSgcModalOpen] = useState(false);

  const [avalesByPeriodo, setAvalesByPeriodo] = useState(() => {
    try {
      const saved = localStorage.getItem(AVAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [dbConfig, setDbConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(DB_STORAGE_KEY);
      return saved ? { ...DEFAULT_DB_CONFIG, ...JSON.parse(saved) } : DEFAULT_DB_CONFIG;
    } catch {
      return DEFAULT_DB_CONFIG;
    }
  });
  const [dbTesting, setDbTesting] = useState(false);
  const [dbStatus, setDbStatus] = useState(null);

  const filteredProjects = useMemo(() => {
    if (periodo === 'Todos') return projects;
    return projects.filter((p) => p.periodo === periodo);
  }, [projects, periodo]);

  const metrics = useMemo(() => {
    const total = filteredProjects.length;
    const internos = filteredProjects.filter((p) => p.origen === 'Interno').length;
    const externos = filteredProjects.filter((p) => p.origen === 'Externo').length;

    const plazasTotales = filteredProjects.reduce(
      (sum, p) => sum + (Number(p.alumnosRequeridos) || 0),
      0
    );
    const plazasOcupadas = filteredProjects.reduce(
      (sum, p) => sum + (p.alumnosAsignados?.length || 0),
      0
    );
    const plazasDisponibles = Math.max(0, plazasTotales - plazasOcupadas);
    const tasaOcupacion =
      plazasTotales > 0 ? Math.round((plazasOcupadas / plazasTotales) * 100) : 0;

    const canalizados = filteredProjects.filter((p) => p.canalizadoVinculacion).length;
    const publicados = filteredProjects.filter(
      (p) => p.estado === 'Publicado' || p.estado === 'Asignado'
    ).length;
    const disponibles = filteredProjects.filter(
      (p) => (p.estado_proyecto || 'Disponible') === 'Disponible'
    ).length;
    const enCurso = filteredProjects.filter(
      (p) => (p.estado_proyecto || 'Disponible') === 'En curso'
    ).length;
    const concluidos = filteredProjects.filter(
      (p) => (p.estado_proyecto || 'Disponible') === 'Concluido'
    ).length;

    return {
      total,
      internos,
      externos,
      plazasTotales,
      plazasOcupadas,
      plazasDisponibles,
      tasaOcupacion,
      canalizados,
      publicados,
      disponibles,
      enCurso,
      concluidos,
      porDepartamento: countByKey(filteredProjects, 'departamento'),
      porArea: countByKey(filteredProjects, 'areaConocimiento'),
      porTipo: countByKey(filteredProjects, 'tipoProyecto'),
    };
  }, [filteredProjects]);

  const careerCoverage = useMemo(() => {
    return CARRERAS_ITSAL.map((carrera) => {
      const list = filteredProjects.filter((p) => p.perfilRequerido === carrera);
      const publicados = list.filter(
        (p) => p.estado === 'Publicado' || p.estado === 'Asignado'
      ).length;
      const enTramite = list.filter(
        (p) =>
          p.estado === 'En Revisión Académica' || p.estado === 'Pendiente de Vinculación'
      ).length;
      const plazasTotales = list.reduce(
        (sum, p) => sum + (Number(p.alumnosRequeridos) || 0),
        0
      );
      const plazasAsignadas = list.reduce(
        (sum, p) => sum + (p.alumnosAsignados?.length || 0),
        0
      );
      return {
        carrera,
        shortLabel: carrera.replace('Ing. en ', '').replace('Ing. ', ''),
        total: list.length,
        publicados,
        enTramite,
        plazasTotales,
        plazasAsignadas,
      };
    });
  }, [filteredProjects]);

  const advisorLoad = useMemo(() => {
    const map = {};
    filteredProjects
      .filter((p) => p.estado !== 'Rechazado')
      .forEach((p) => {
        const name = p.asesor?.trim() || 'Por designar';
        if (!map[name]) {
          map[name] = {
            asesor: name,
            departamento: p.departamento,
            proyectos: 0,
            publicados: 0,
            residentes: 0,
            cupoTotal: 0,
          };
        }
        map[name].proyectos += 1;
        if (p.estado === 'Publicado' || p.estado === 'Asignado') {
          map[name].publicados += 1;
        }
        map[name].residentes += p.alumnosAsignados?.length || 0;
        map[name].cupoTotal += Number(p.alumnosRequeridos) || 0;
      });
    return Object.values(map).sort(
      (a, b) => b.proyectos - a.proyectos || b.residentes - a.residentes
    );
  }, [filteredProjects]);

  const activeAval = avalesByPeriodo[periodo] || null;

  const handleEmitirAvalPeriodo = () => {
    const folioAval = `AVAL-SUB-${periodo === 'Todos' ? '2026' : periodo.slice(0, 3).toUpperCase()}-${String(
      Date.now()
    ).slice(-4)}`;
    const record = {
      folio: folioAval,
      fecha: getLocalDateStr(),
      autorizadoPor: currentUser?.nombre || 'Dr. Octavio Ramírez Sosa',
      totalPublicados: metrics.publicados,
      plazasTotales: metrics.plazasTotales,
    };
    const next = { ...avalesByPeriodo, [periodo]: record };
    setAvalesByPeriodo(next);
    try {
      localStorage.setItem(AVAL_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    pushNotification({
      canal: 'SGC + Dirección Académica',
      destinatario: 'Jefaturas Académicas / División de Estudios Profesionales',
      asunto: `Aval Académico Emitido: ${folioAval}`,
      mensaje: `Subdirección Académica emitió el aval del Banco de Proyectos (${periodo}) con ${metrics.publicados} proyectos activos y ${metrics.plazasTotales} plazas.`,
    });
    setMascotContext(5, '¡Aval Académico emitido correctamente para el periodo!');
    showToast(
      `Aval Académico emitido (${folioAval})`,
      'success',
      `Periodo ${periodo} avalado oficialmente por Subdirección Académica.`
    );
  };

  const handleExportCSV = () => {
    exportProjectsToCSV(filteredProjects, periodo);
    setMascotContext(7, '¡Excelente! Acción registrada correctamente en el sistema');
    showToast(
      'Reporte CSV exportado',
      'success',
      `Se descargó la matriz SGC (${filteredProjects.length} registros) lista para Excel.`
    );
  };

  const handleDbMotorChange = (motor) => {
    setDbConfig((prev) => ({
      ...prev,
      motor,
      puerto: DEFAULT_PORTS[motor] || prev.puerto,
    }));
    setDbStatus(null);
  };

  const handleTestDbConnection = (e) => {
    e.preventDefault();
    if (!dbConfig.host.trim() || !dbConfig.baseDatos.trim() || !dbConfig.usuario.trim()) {
      setDbStatus({
        ok: false,
        message: 'Completa Host/IP, Base de datos y Usuario antes de probar.',
      });
      return;
    }

    setDbTesting(true);
    setDbStatus(null);
    try {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(dbConfig));
    } catch {
      // ignore
    }

    setTimeout(() => {
      setDbTesting(false);
      setDbStatus({
        ok: true,
        message: `Parámetros verificados para ${dbConfig.motor} (${dbConfig.host}:${dbConfig.puerto}/${dbConfig.baseDatos}). Modo demo local activo en este pitch; listo para enlazar al servidor escolar del ITSAL en la siguiente etapa.`,
      });
      showToast(
        'Configuración de servidor validada',
        'success',
        `${dbConfig.motor} · Modo demo local listo para migración institucional.`
      );
    }, 550);
  };

  return (
    <div className="px-6 sm:px-8 py-8 pb-24 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="hidden sm:flex shrink-0 items-center justify-center rounded-xl bg-[#FAF8F5] px-2 py-1">
            <MascotSprite
              pose={5}
              variant="full"
              blend={true}
              className="w-14 shrink-0 transition-all duration-300 hover:-translate-y-1"
            />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#009FE3]">
              Subdirección Académica / Directivo · SGC y Supervisión ITSAL
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
              Tablero Ejecutivo y SGC
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Cobertura por carrera, carga de asesores, indicadores consolidados y exportación ISO 9001.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            aria-label="Filtrar por periodo"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:border-[#009FE3] focus:outline-none"
          >
            <option value="Todos">Todos los Periodos</option>
            {PERIODOS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 transition hover:border-emerald-600"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            Exportar CSV (Excel)
          </button>

          <button
            type="button"
            onClick={() => setSgcModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#009FE3] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0088C6]"
          >
            <Printer className="h-4 w-4" />
            Evidencia PDF (SGC)
          </button>
        </div>
      </div>

      {/* Unified KPI Strip (Stripe / Linear style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-xl border border-slate-200 bg-white divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
        <div className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total de Proyectos
            </span>
            <BarChart3 className="h-4 w-4 text-[#009FE3]" />
          </div>
          <p className="mt-2 font-mono text-3xl font-bold text-slate-900">{metrics.total}</p>
          <p className="mt-1 text-xs text-slate-500">
            {metrics.publicados} activos en banco / asignados
          </p>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Internos vs Externos
            </span>
            <Building2 className="h-4 w-4 text-[#D99B16]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2.5 font-mono">
            <span className="text-2xl font-bold text-slate-900">{metrics.internos} Int</span>
            <span className="text-slate-300">/</span>
            <span className="text-2xl font-bold text-[#009FE3]">{metrics.externos} Ext</span>
          </div>
          <div className="mt-3 flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="bg-[#0B1120] transition-all duration-300"
              style={{
                width: `${metrics.total ? (metrics.internos / metrics.total) * 100 : 50}%`,
              }}
            />
            <div
              className="bg-[#009FE3] transition-all duration-300"
              style={{
                width: `${metrics.total ? (metrics.externos / metrics.total) * 100 : 50}%`,
              }}
            />
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Plazas Ocupadas
            </span>
            <Users className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 font-mono text-3xl font-bold text-slate-900">
            {metrics.plazasOcupadas}
            <span className="text-lg font-medium text-slate-400"> / {metrics.plazasTotales}</span>
          </p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="font-mono font-bold text-emerald-700">
              {metrics.tasaOcupacion}% ocupación
            </span>
            <span className="text-slate-500">{metrics.plazasDisponibles} disponibles</span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Concluidos / SGC
            </span>
            <CheckCircle2 className="h-4 w-4 text-[#009FE3]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2.5 font-mono">
            <span className="text-3xl font-bold text-slate-900">{metrics.concluidos}</span>
            <span className="text-xs font-semibold text-slate-500">
              concluidos · {metrics.enCurso} en curso
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {metrics.canalizados} canalizado(s) · {metrics.disponibles} disponible(s)
          </p>
        </div>
      </div>

      {/* Comparative Breakdowns */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-[#009FE3]" />
            Proyectos por Departamento Académico
          </h2>
          <div className="space-y-3.5">
            {metrics.porDepartamento.map(([dept, count]) => {
              const pct = metrics.total ? Math.round((count / metrics.total) * 100) : 0;
              return (
                <div key={dept}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">{dept}</span>
                    <span className="font-mono text-slate-900 font-bold">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#0B1120] transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[#D99B16]" />
            Proyectos por Área del Conocimiento
          </h2>
          <div className="space-y-3.5">
            {metrics.porArea.map(([area, count]) => {
              const pct = metrics.total ? Math.round((count / metrics.total) * 100) : 0;
              return (
                <div key={area}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">{area}</span>
                    <span className="font-mono text-[#009FE3] font-bold">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#009FE3] transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 border-t border-slate-200 pt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Por Tipo de Proyecto
            </p>
            <div className="flex flex-wrap gap-2">
              {metrics.porTipo.map(([tipo, count]) => (
                <span
                  key={tipo}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700"
                >
                  {tipo}: <span className="font-mono font-bold text-[#009FE3]">{count}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bloques Clave de Subdirección Académica */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* 1) Cobertura y Aval por Carrera */}
        <section className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-3.5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#009FE3]" />
                Cobertura y Aval por Carrera
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Supervisión de proyectos publicados y plazas asignadas por ingeniería ({periodo})
              </p>
            </div>
            <button
              type="button"
              onClick={handleEmitirAvalPeriodo}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition ${
                activeAval
                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  : 'bg-[#0B1120] text-white hover:bg-[#009FE3]'
              }`}
            >
              <Award className="h-3.5 w-3.5" />
              {activeAval ? 'Actualizar Aval del Periodo' : 'Emitir Aval Académico del Periodo'}
            </button>
          </div>

          {activeAval && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-emerald-200 bg-emerald-50/70 px-3.5 py-2.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-900">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>
                  Aval emitido el <strong className="font-mono">{activeAval.fecha}</strong> por{' '}
                  <strong>{activeAval.autorizadoPor}</strong>
                </span>
              </div>
              <span className="font-mono text-[11px] font-bold text-emerald-800">
                {activeAval.folio}
              </span>
            </div>
          )}

          <div className="divide-y divide-slate-100">
            {careerCoverage.map((row) => {
              const pct = row.plazasTotales
                ? Math.round((row.plazasAsignadas / row.plazasTotales) * 100)
                : 0;
              return (
                <div key={row.carrera} className="py-3 first:pt-0 last:pb-0 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">{row.carrera}</span>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono font-bold text-slate-700">
                        {row.publicados} pub.
                      </span>
                      {row.enTramite > 0 && (
                        <span className="rounded-md bg-amber-50 px-2 py-0.5 font-mono font-bold text-amber-800">
                          {row.enTramite} trámite
                        </span>
                      )}
                      <span className="font-mono font-bold text-[#009FE3]">
                        {row.plazasAsignadas}/{row.plazasTotales} plazas
                      </span>
                      {activeAval && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          Avalado
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#009FE3] transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2) Carga de Asesores */}
        <section className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="border-b border-slate-200 pb-3.5">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-[#D99B16]" />
              Carga de Asesores
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Equilibrio académico de proyectos y residentes por docente
            </p>
          </div>

          <div className="divide-y divide-slate-100 max-h-[340px] overflow-y-auto pr-1">
            {advisorLoad.map((item) => {
              const isHigh = item.proyectos >= 2 || item.residentes >= 3;
              return (
                <div
                  key={item.asesor}
                  className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{item.asesor}</p>
                    <p className="text-[11px] text-slate-500 truncate">{item.departamento}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <p className="font-mono text-xs font-extrabold text-slate-900">
                        {item.proyectos} proy.
                      </p>
                      <p className="font-mono text-[10px] text-slate-500">
                        {item.residentes}/{item.cupoTotal} res.
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isHigh
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {isHigh ? 'Alta' : 'Óptima'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Consolidated Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-5 py-3.5">
          <h2 className="text-sm font-bold text-slate-900">
            Matriz Consolidada de Proyectos ({periodo})
          </h2>
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#009FE3] hover:underline"
          >
            <Download className="h-3.5 w-3.5" />
            Descargar CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Folio</th>
                <th className="px-5 py-3">Proyecto</th>
                <th className="px-5 py-3">Origen</th>
                <th className="px-5 py-3">Departamento / Área</th>
                <th className="px-5 py-3 text-center">Plazas</th>
                <th className="px-5 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProjects.map((p) => {
                const ocup = p.alumnosAsignados?.length || 0;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3 font-mono font-semibold text-[#009FE3] whitespace-nowrap">
                      {p.folio}
                    </td>
                    <td className="px-5 py-3 max-w-xs">
                      <p className="font-bold text-slate-900 line-clamp-2">{p.titulo}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{p.asesor}</p>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span
                        className={`rounded-md px-2 py-0.5 font-semibold ${
                          p.origen === 'Interno'
                            ? 'bg-slate-100 text-slate-800'
                            : p.origen === 'Propuesta de Estudiante'
                            ? 'bg-indigo-50 text-indigo-800'
                            : 'bg-amber-50 text-amber-900'
                        }`}
                      >
                        {p.origen}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-slate-900">{p.departamento}</p>
                      <p className="text-[11px] text-slate-500">{p.areaConocimiento}</p>
                    </td>
                    <td className="px-5 py-3 text-center font-mono font-bold text-slate-900 whitespace-nowrap">
                      {ocup} / {p.alumnosRequeridos}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <StatusBadge estado={p.estado} />
                        <LifecycleBadge estadoProyecto={p.estado_proyecto || 'Disponible'} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Servidor y Base de Datos Institucional (ITSAL) */}
      <section
        id="servidor-bd-itsal"
        className="rounded-xl border border-slate-200 bg-white overflow-hidden"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-[#0B1120] px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#009FE3]/20 text-[#009FE3]">
              <Server className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold">
                Servidor y Base de Datos Institucional (ITSAL)
              </h2>
              <p className="text-xs text-slate-400">
                Preparado para integración con infraestructura escolar en la siguiente etapa
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-bold ${
                storageMode === 'offline'
                  ? 'border-slate-600 bg-slate-800 text-slate-200'
                  : cloudStatus.source === 'cloud' && !cloudStatus.fallbackNotice
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                  : 'border-[#D99B16]/40 bg-[#D99B16]/15 text-[#D99B16]'
              }`}
            >
              {storageMode === 'offline' ? (
                <HardDrive className="h-3.5 w-3.5" />
              ) : (
                <Cloud className="h-3.5 w-3.5" />
              )}
              {storageMode === 'offline'
                ? 'Offline · Demo Local (localStorage)'
                : cloudStatus.source === 'cloud' && !cloudStatus.fallbackNotice
                ? 'Online · Nube ITSAL conectada'
                : 'Online · Respaldo local activo'}
            </span>
          </div>
        </div>

        <form onSubmit={handleTestDbConnection} className="p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#FAF8F5] px-3.5 py-2.5">
            <div className="flex items-center gap-3 min-w-0">
              <MascotSprite
                pose={2}
                variant="full"
                blend={true}
                className="w-12 shrink-0 transition-all duration-300 hover:-translate-y-1"
              />
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900">Capa híbrida local / nube:</strong> alterna entre{' '}
                <code className="font-mono text-[#009FE3]">localStorage</code> y la nube configurada con{' '}
                <code className="font-mono text-slate-800">VITE_SUPABASE_URL</code> y{' '}
                <code className="font-mono text-slate-800">VITE_SUPABASE_ANON_KEY</code>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => switchStorageMode('offline')}
                  className={`rounded-md px-3 py-1 text-xs font-bold transition ${
                    storageMode === 'offline'
                      ? 'bg-[#0B1120] text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Offline · Demo Local
                </button>
                <button
                  type="button"
                  onClick={() => switchStorageMode('online')}
                  className={`rounded-md px-3 py-1 text-xs font-bold transition ${
                    storageMode === 'online'
                      ? 'bg-[#009FE3] text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Online · Nube ITSAL
                </button>
              </div>

              {storageMode === 'online' && (
                <button
                  type="button"
                  disabled={cloudStatus.syncing}
                  onClick={syncDemoToCloudAction}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#009FE3] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#0088C6] disabled:opacity-60"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${cloudStatus.syncing ? 'animate-spin' : ''}`}
                  />
                  Sincronizar datos demo a la nube
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Motor
              </label>
              <select
                value={dbConfig.motor}
                onChange={(e) => handleDbMotorChange(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-[#009FE3] focus:bg-white focus:outline-none"
              >
                <option value="PostgreSQL">PostgreSQL</option>
                <option value="MySQL">MySQL</option>
                <option value="SQL Server">SQL Server</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Host / IP
              </label>
              <input
                type="text"
                value={dbConfig.host}
                onChange={(e) => setDbConfig({ ...dbConfig, host: e.target.value })}
                placeholder="172.16.10.25"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono text-slate-900 focus:border-[#009FE3] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Puerto
              </label>
              <input
                type="text"
                value={dbConfig.puerto}
                onChange={(e) => setDbConfig({ ...dbConfig, puerto: e.target.value })}
                placeholder="5432"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono text-slate-900 focus:border-[#009FE3] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Base de datos
              </label>
              <input
                type="text"
                value={dbConfig.baseDatos}
                onChange={(e) => setDbConfig({ ...dbConfig, baseDatos: e.target.value })}
                placeholder="itmatch_residencias_itsal"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono text-slate-900 focus:border-[#009FE3] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Usuario
              </label>
              <input
                type="text"
                value={dbConfig.usuario}
                onChange={(e) => setDbConfig({ ...dbConfig, usuario: e.target.value })}
                placeholder="sgc_itsal_admin"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono text-slate-900 focus:border-[#009FE3] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {dbStatus && (
            <div
              className={`flex items-start gap-2.5 rounded-lg border p-3.5 text-xs font-semibold animate-it-enter ${
                dbStatus.ok
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                  : 'border-rose-200 bg-rose-50 text-rose-800'
              }`}
            >
              <CheckCircle2
                className={`mt-0.5 h-4 w-4 shrink-0 ${
                  dbStatus.ok ? 'text-emerald-600' : 'text-rose-600'
                }`}
              />
              <span>{dbStatus.message}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-xs text-slate-500">
              Actualmente la demostración opera 100% en navegador (`localStorage`) sin dependencias externas.
            </p>
            <button
              type="submit"
              disabled={dbTesting}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0B1120] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#009FE3] disabled:opacity-60"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${dbTesting ? 'animate-spin' : ''}`} />
              {dbTesting ? 'Probando conexión...' : 'Probar conexión'}
            </button>
          </div>
        </form>
      </section>

      {/* Modal Evidencia SGC */}
      {sgcModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0B1120]/75 p-2 sm:p-4 overflow-y-auto backdrop-blur-xs print:static print:inset-auto print:block print:overflow-visible print:bg-transparent print:p-0">
          <div className="my-4 w-full max-w-4xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-modal-in print:my-0 print:max-w-none print:rounded-none print:border-0 print:shadow-none print:overflow-visible print:animate-none">
            <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-[#0B1120] px-5 py-3.5 text-white">
              <div>
                <h3 className="text-sm font-bold">
                  Vista de Impresión · Evidencia SGC
                </h3>
                <p className="text-xs text-slate-300">
                  Periodo seleccionado: {periodo}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#009FE3] px-4 py-2 text-xs font-bold text-white hover:bg-[#0088C6]"
                >
                  <Printer className="h-4 w-4" />
                  Imprimir / Guardar PDF
                </button>
                <button
                  type="button"
                  onClick={() => setSgcModalOpen(false)}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                  Cerrar
                </button>
              </div>
            </div>

            <div className="max-h-[82vh] overflow-y-auto p-6 sm:p-8 print:max-h-none print:overflow-visible print:p-0">
              <div id="print-area" className="bg-white text-slate-900 border border-slate-300 p-6 text-xs print:border-0 print:p-0 print:w-full">
                <div className="flex items-center justify-between border-b-2 border-[#0D2240] pb-3 mb-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase text-[#0D2240]">
                      Tecnológico Nacional de México · Instituto Tecnológico de Salina Cruz
                    </p>
                    <h4 className="text-base font-extrabold uppercase text-slate-900">
                      Informe Ejecutivo de Indicadores · IT Match (Banco de Proyectos)
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Evidencia Documental para el Sistema de Gestión de la Calidad (ISO 9001 / SGC-ITSAL)
                    </p>
                  </div>
                  <div className="text-right text-[11px]">
                    <p className="font-mono font-bold text-[#0D2240]">SGC-ITSAL-RP-2026</p>
                    <p>Periodo: {periodo}</p>
                    <p className="font-mono">Emisión: {getLocalDateStr()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-5">
                  <div className="border border-slate-300 p-2.5 text-center">
                    <p className="text-[10px] uppercase text-slate-500 font-bold">Total / Concluidos</p>
                    <p className="font-mono text-xl font-extrabold text-[#0D2240]">
                      {metrics.total} / {metrics.concluidos}
                    </p>
                  </div>
                  <div className="border border-slate-300 p-2.5 text-center">
                    <p className="text-[10px] uppercase text-slate-500 font-bold">Internos / Externos</p>
                    <p className="font-mono text-xl font-extrabold text-[#0D2240]">
                      {metrics.internos} / {metrics.externos}
                    </p>
                  </div>
                  <div className="border border-slate-300 p-2.5 text-center">
                    <p className="text-[10px] uppercase text-slate-500 font-bold">Plazas Ocupadas</p>
                    <p className="font-mono text-xl font-extrabold text-[#0D2240]">
                      {metrics.plazasOcupadas} de {metrics.plazasTotales}
                    </p>
                  </div>
                  <div className="border border-slate-300 p-2.5 text-center">
                    <p className="text-[10px] uppercase text-slate-500 font-bold">Tasa Ocupación</p>
                    <p className="font-mono text-xl font-extrabold text-[#0D2240]">{metrics.tasaOcupacion}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <table className="w-full border-collapse border border-slate-400 text-[11px]">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-400 px-2 py-1 text-left">Departamento Académico</th>
                        <th className="border border-slate-400 px-2 py-1 text-center">Proyectos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.porDepartamento.map(([d, c]) => (
                        <tr key={d}>
                          <td className="border border-slate-400 px-2 py-1">{d}</td>
                          <td className="border border-slate-400 px-2 py-1 text-center font-mono font-bold">{c}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <table className="w-full border-collapse border border-slate-400 text-[11px]">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-400 px-2 py-1 text-left">Área del Conocimiento</th>
                        <th className="border border-slate-400 px-2 py-1 text-center">Proyectos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.porArea.map(([a, c]) => (
                        <tr key={a}>
                          <td className="border border-slate-400 px-2 py-1">{a}</td>
                          <td className="border border-slate-400 px-2 py-1 text-center font-mono font-bold">{c}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <table className="w-full border-collapse border border-slate-400 text-[10.5px] mb-6">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-400 px-2 py-1 text-left">Folio</th>
                      <th className="border border-slate-400 px-2 py-1 text-left">Título del Proyecto</th>
                      <th className="border border-slate-400 px-2 py-1 text-left">Origen</th>
                      <th className="border border-slate-400 px-2 py-1 text-left">Asesor</th>
                      <th className="border border-slate-400 px-2 py-1 text-center">Plazas</th>
                      <th className="border border-slate-400 px-2 py-1 text-left">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((p) => (
                      <tr key={p.id}>
                        <td className="border border-slate-400 px-2 py-1 font-mono font-bold">{p.folio}</td>
                        <td className="border border-slate-400 px-2 py-1">{p.titulo}</td>
                        <td className="border border-slate-400 px-2 py-1">{p.origen}</td>
                        <td className="border border-slate-400 px-2 py-1">{p.asesor}</td>
                        <td className="border border-slate-400 px-2 py-1 text-center font-mono">
                          {p.alumnosAsignados?.length || 0}/{p.alumnosRequeridos}
                        </td>
                        <td className="border border-slate-400 px-2 py-1">{p.estado}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="print-avoid-break grid grid-cols-2 gap-8 pt-6">
                  <div className="text-center px-6">
                    <div className="h-10 border-b border-slate-800" />
                    <p className="mt-1 font-bold">Subdirección Académica</p>
                    <p className="text-[10px] text-slate-600 uppercase">
                      Instituto Tecnológico de Salina Cruz
                    </p>
                  </div>
                  <div className="text-center px-6">
                    <div className="h-10 border-b border-slate-800" />
                    <p className="mt-1 font-bold">Coordinación del Sistema de Gestión de la Calidad</p>
                    <p className="text-[10px] text-slate-600 uppercase">
                      Validación de Evidencia Documental
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
          document.body
        )}
    </div>
  );
}
