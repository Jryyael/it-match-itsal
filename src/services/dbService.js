import {
  INITIAL_APPLICATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PROJECTS,
} from '../data/mockData';
import {
  DB_CONFIG_STORAGE_KEY,
  getSupabaseClient,
  getSupabaseConfig,
} from './supabaseClient';

export const STORAGE_MODE_KEY = 'itmatch_storage_mode';

export const STORAGE_KEYS = {
  projects: 'sibap_itsal_projects_v1',
  applications: 'sibap_itsal_applications_v1',
  notifications: 'sibap_itsal_notifications_v1',
  dbConfig: DB_CONFIG_STORAGE_KEY,
};

const FALLBACK_NOTICE = 'Sin credenciales o sin red: usando respaldo local';
const REMOTE_TIMEOUT_MS = 5000;

export function getStorageMode() {
  try {
    const mode = localStorage.getItem(STORAGE_MODE_KEY);
    return mode === 'online' ? 'online' : 'offline';
  } catch {
    return 'offline';
  }
}

export function setStorageMode(mode) {
  const normalized = mode === 'online' ? 'online' : 'offline';
  try {
    localStorage.setItem(STORAGE_MODE_KEY, normalized);
  } catch {
    // ignore
  }
  return normalized;
}

export function getRemoteConfig() {
  const cfg = getSupabaseConfig();
  return {
    url: cfg.url,
    key: cfg.anonKey,
    isConfigured: cfg.isConfigured,
  };
}

function readLocalArray(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeLocalArray(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // ignore
  }
}

function hydrateProjectPhotos(list) {
  return list.map((proj) => {
    if (proj.imagenUrl) return proj;
    const match = INITIAL_PROJECTS.find(
      (init) => init.id === proj.id || init.folio === proj.folio
    );
    return match?.imagenUrl ? { ...proj, imagenUrl: match.imagenUrl } : proj;
  });
}

// Preserva íntegramente todos los campos requeridos para el Formato Oficial con QR
function normalizeProjectFields(proj) {
  return {
    id: proj.id,
    folio: proj.folio,
    imagenUrl: proj.imagenUrl || '/projects/proj-001.jpg',
    origen: proj.origen || 'Interno',
    modalidadLugar: proj.modalidadLugar,
    estudianteProponente: proj.estudianteProponente,
    institucion: proj.institucion || '',
    departamento: proj.departamento || '',
    perfilRequerido: proj.perfilRequerido || '',
    alumnosRequeridos: Number(proj.alumnosRequeridos) || 1,
    alumnosAsignados: Array.isArray(proj.alumnosAsignados) ? proj.alumnosAsignados : [],
    asesor: proj.asesor || '',
    colaboradores: proj.colaboradores || '',
    jefeDepartamento: proj.jefeDepartamento || '',
    areaConocimiento: proj.areaConocimiento || '',
    titulo: proj.titulo || '',
    tipoProyecto: proj.tipoProyecto || 'Desarrollo Tecnológico',
    estado: proj.estado || 'En Revisión Académica',
    periodo: proj.periodo || 'Enero - Junio 2026',
    fechaRegistro: proj.fechaRegistro || '',
    habilidades: Array.isArray(proj.habilidades) ? proj.habilidades : [],
    objetivo: proj.objetivo || '',
    planteamiento: proj.planteamiento || '',
    justificacion: proj.justificacion || '',
    alcances: proj.alcances || '',
    limitaciones: proj.limitaciones || '',
    observaciones: proj.observaciones || '',
    observacionesAcademia: proj.observacionesAcademia || '',
    observacionesVinculacion: proj.observacionesVinculacion || '',
    canalizadoVinculacion: Boolean(proj.canalizadoVinculacion),
    creadoPorId: proj.creadoPorId,
  };
}

function toRemoteProjectRow(proj) {
  const clean = normalizeProjectFields(proj);
  return {
    id: clean.id,
    folio: clean.folio,
    imagen_url: clean.imagenUrl,
    origen: clean.origen,
    modalidad_lugar: clean.modalidadLugar || null,
    estudiante_proponente: clean.estudianteProponente || null,
    institucion: clean.institucion,
    departamento: clean.departamento,
    perfil_requerido: clean.perfilRequerido,
    alumnos_requeridos: clean.alumnosRequeridos,
    alumnos_asignados: clean.alumnosAsignados,
    asesor: clean.asesor,
    colaboradores: clean.colaboradores,
    jefe_departamento: clean.jefeDepartamento,
    area_conocimiento: clean.areaConocimiento,
    titulo: clean.titulo,
    tipo_proyecto: clean.tipoProyecto,
    estado: clean.estado,
    periodo: clean.periodo,
    fecha_registro: clean.fechaRegistro,
    habilidades: clean.habilidades,
    objetivo: clean.objetivo,
    planteamiento: clean.planteamiento,
    justificacion: clean.justificacion,
    alcances: clean.alcances,
    limitaciones: clean.limitaciones,
    observaciones: clean.observaciones,
    observaciones_academia: clean.observacionesAcademia,
    observaciones_vinculacion: clean.observacionesVinculacion,
    canalizado_vinculacion: clean.canalizadoVinculacion,
    creado_por_id: clean.creadoPorId || null,
  };
}

function fromRemoteProjectRow(row) {
  return normalizeProjectFields({
    id: row.id,
    folio: row.folio,
    imagenUrl: row.imagenUrl ?? row.imagen_url ?? row.imagen,
    origen: row.origen,
    modalidadLugar: row.modalidadLugar ?? row.modalidad_lugar ?? undefined,
    estudianteProponente: row.estudianteProponente ?? row.estudiante_proponente ?? undefined,
    institucion: row.institucion,
    departamento: row.departamento,
    perfilRequerido: row.perfilRequerido ?? row.perfil_requerido ?? row.perfil,
    alumnosRequeridos: row.alumnosRequeridos ?? row.alumnos_requeridos ?? row.plazas,
    alumnosAsignados: row.alumnosAsignados ?? row.alumnos_asignados,
    asesor: row.asesor,
    colaboradores: row.colaboradores,
    jefeDepartamento: row.jefeDepartamento ?? row.jefe_departamento ?? row.vo_bo,
    areaConocimiento: row.areaConocimiento ?? row.area_conocimiento ?? row.area,
    titulo: row.titulo,
    tipoProyecto: row.tipoProyecto ?? row.tipo_proyecto ?? row.tipo,
    estado: row.estado,
    periodo: row.periodo,
    fechaRegistro: row.fechaRegistro ?? row.fecha_registro,
    habilidades: row.habilidades,
    objetivo: row.objetivo,
    planteamiento: row.planteamiento,
    justificacion: row.justificacion,
    alcances: row.alcances,
    limitaciones: row.limitaciones,
    observaciones: row.observaciones,
    observacionesAcademia: row.observacionesAcademia ?? row.observaciones_academia,
    observacionesVinculacion:
      row.observacionesVinculacion ?? row.observaciones_vinculacion,
    canalizadoVinculacion: row.canalizadoVinculacion ?? row.canalizado_vinculacion,
    creadoPorId: row.creadoPorId ?? row.creado_por_id,
  });
}

async function runWithTimeout(promise) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('timeout')), REMOTE_TIMEOUT_MS);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

async function execSupabaseQuery(queryFn) {
  const client = getSupabaseClient();
  if (!client) {
    return { ok: false, fallbackReason: FALLBACK_NOTICE };
  }

  try {
    const result = await runWithTimeout(queryFn(client));
    if (result?.error) {
      return { ok: false, error: result.error, fallbackReason: FALLBACK_NOTICE };
    }
    return { ok: true, data: result?.data ?? null };
  } catch {
    return { ok: false, fallbackReason: FALLBACK_NOTICE };
  }
}

export function getProyectosLocal() {
  const list = readLocalArray(STORAGE_KEYS.projects, INITIAL_PROJECTS);
  return hydrateProjectPhotos(list).map(normalizeProjectFields);
}

export function getPostulacionesLocal() {
  return readLocalArray(STORAGE_KEYS.applications, INITIAL_APPLICATIONS);
}

export function getNotificacionesLocal() {
  return readLocalArray(STORAGE_KEYS.notifications, INITIAL_NOTIFICATIONS);
}

export async function getProyectos() {
  const localData = getProyectosLocal();
  if (getStorageMode() !== 'online') {
    return { ok: true, data: localData, source: 'local' };
  }

  const res = await execSupabaseQuery((sb) =>
    sb.from('proyectos').select('*').order('fecha_registro', { ascending: false })
  );

  if (!res.ok || !Array.isArray(res.data)) {
    return {
      ok: true,
      data: localData,
      source: 'local',
      fallbackReason: res.fallbackReason || FALLBACK_NOTICE,
    };
  }

  if (res.data.length === 0) {
    return { ok: true, data: localData, source: 'cloud' };
  }

  const mapped = hydrateProjectPhotos(res.data.map(fromRemoteProjectRow));
  writeLocalArray(STORAGE_KEYS.projects, mapped);
  return { ok: true, data: mapped, source: 'cloud' };
}

export async function createProyecto(project, nextProjectsList) {
  const normalized = normalizeProjectFields(project);
  const localList = nextProjectsList || [normalized, ...getProyectosLocal()];
  writeLocalArray(STORAGE_KEYS.projects, localList);

  if (getStorageMode() !== 'online') {
    return { ok: true, data: normalized, source: 'local' };
  }

  const res = await execSupabaseQuery((sb) =>
    sb.from('proyectos').insert([toRemoteProjectRow(normalized)]).select()
  );

  if (!res.ok) {
    return {
      ok: true,
      data: normalized,
      source: 'local',
      fallbackReason: res.fallbackReason || FALLBACK_NOTICE,
    };
  }

  return { ok: true, data: normalized, source: 'cloud' };
}

export async function updateProyecto(projectId, patch, nextProjectsList) {
  const localList =
    nextProjectsList ||
    getProyectosLocal().map((p) => (p.id === projectId ? { ...p, ...patch } : p));
  writeLocalArray(STORAGE_KEYS.projects, localList);

  if (getStorageMode() !== 'online') {
    return { ok: true, data: patch, source: 'local' };
  }

  const remotePatch = {};
  if (patch.estado !== undefined) remotePatch.estado = patch.estado;
  if (patch.asesor !== undefined) remotePatch.asesor = patch.asesor;
  if (patch.origen !== undefined) remotePatch.origen = patch.origen;
  if (patch.institucion !== undefined) remotePatch.institucion = patch.institucion;
  if (patch.departamento !== undefined) remotePatch.departamento = patch.departamento;
  if (patch.perfilRequerido !== undefined) remotePatch.perfil_requerido = patch.perfilRequerido;
  if (patch.alumnosRequeridos !== undefined)
    remotePatch.alumnos_requeridos = Number(patch.alumnosRequeridos) || 1;
  if (patch.colaboradores !== undefined) remotePatch.colaboradores = patch.colaboradores;
  if (patch.jefeDepartamento !== undefined) remotePatch.jefe_departamento = patch.jefeDepartamento;
  if (patch.areaConocimiento !== undefined) remotePatch.area_conocimiento = patch.areaConocimiento;
  if (patch.titulo !== undefined) remotePatch.titulo = patch.titulo;
  if (patch.tipoProyecto !== undefined) remotePatch.tipo_proyecto = patch.tipoProyecto;
  if (patch.periodo !== undefined) remotePatch.periodo = patch.periodo;
  if (patch.habilidades !== undefined) remotePatch.habilidades = patch.habilidades;
  if (patch.objetivo !== undefined) remotePatch.objetivo = patch.objetivo;
  if (patch.planteamiento !== undefined) remotePatch.planteamiento = patch.planteamiento;
  if (patch.justificacion !== undefined) remotePatch.justificacion = patch.justificacion;
  if (patch.alcances !== undefined) remotePatch.alcances = patch.alcances;
  if (patch.limitaciones !== undefined) remotePatch.limitaciones = patch.limitaciones;
  if (patch.observaciones !== undefined) remotePatch.observaciones = patch.observaciones;
  if (patch.imagenUrl !== undefined) remotePatch.imagen_url = patch.imagenUrl;
  if (patch.alumnosAsignados !== undefined)
    remotePatch.alumnos_asignados = patch.alumnosAsignados;
  if (patch.observacionesAcademia !== undefined)
    remotePatch.observaciones_academia = patch.observacionesAcademia;
  if (patch.observacionesVinculacion !== undefined)
    remotePatch.observaciones_vinculacion = patch.observacionesVinculacion;
  if (patch.canalizadoVinculacion !== undefined)
    remotePatch.canalizado_vinculacion = patch.canalizadoVinculacion;

  const res = await execSupabaseQuery((sb) =>
    sb.from('proyectos').update(remotePatch).eq('id', projectId).select()
  );

  if (!res.ok) {
    return {
      ok: true,
      data: patch,
      source: 'local',
      fallbackReason: res.fallbackReason || FALLBACK_NOTICE,
    };
  }

  return { ok: true, data: patch, source: 'cloud' };
}

export async function getPostulaciones() {
  const localData = getPostulacionesLocal();
  if (getStorageMode() !== 'online') {
    return { ok: true, data: localData, source: 'local' };
  }

  const res = await execSupabaseQuery((sb) => sb.from('postulaciones').select('*'));
  if (!res.ok || !Array.isArray(res.data)) {
    return {
      ok: true,
      data: localData,
      source: 'local',
      fallbackReason: res.fallbackReason || FALLBACK_NOTICE,
    };
  }

  if (res.data.length === 0) {
    return { ok: true, data: localData, source: 'cloud' };
  }

  writeLocalArray(STORAGE_KEYS.applications, res.data);
  return { ok: true, data: res.data, source: 'cloud' };
}

export async function createPostulacion(application, nextApplicationsList) {
  const localList = nextApplicationsList || [application, ...getPostulacionesLocal()];
  writeLocalArray(STORAGE_KEYS.applications, localList);

  if (getStorageMode() !== 'online') {
    return { ok: true, data: application, source: 'local' };
  }

  const res = await execSupabaseQuery((sb) =>
    sb.from('postulaciones').insert([application]).select()
  );

  if (!res.ok) {
    return {
      ok: true,
      data: application,
      source: 'local',
      fallbackReason: res.fallbackReason || FALLBACK_NOTICE,
    };
  }

  return { ok: true, data: application, source: 'cloud' };
}

export async function updatePostulacion(applicationId, patch, nextApplicationsList) {
  const localList =
    nextApplicationsList ||
    getPostulacionesLocal().map((a) => (a.id === applicationId ? { ...a, ...patch } : a));
  writeLocalArray(STORAGE_KEYS.applications, localList);

  if (getStorageMode() !== 'online') {
    return { ok: true, data: patch, source: 'local' };
  }

  const res = await execSupabaseQuery((sb) =>
    sb.from('postulaciones').update(patch).eq('id', applicationId).select()
  );

  if (!res.ok) {
    return {
      ok: true,
      data: patch,
      source: 'local',
      fallbackReason: res.fallbackReason || FALLBACK_NOTICE,
    };
  }

  return { ok: true, data: patch, source: 'cloud' };
}

export async function getNotificaciones() {
  const localData = getNotificacionesLocal();
  if (getStorageMode() !== 'online') {
    return { ok: true, data: localData, source: 'local' };
  }

  const res = await execSupabaseQuery((sb) => sb.from('notificaciones').select('*'));
  if (!res.ok || !Array.isArray(res.data)) {
    return {
      ok: true,
      data: localData,
      source: 'local',
      fallbackReason: res.fallbackReason || FALLBACK_NOTICE,
    };
  }

  if (res.data.length === 0) {
    return { ok: true, data: localData, source: 'cloud' };
  }

  writeLocalArray(STORAGE_KEYS.notifications, res.data);
  return { ok: true, data: res.data, source: 'cloud' };
}

export async function createNotificacion(notif, nextNotificationsList) {
  const localList = nextNotificationsList || [notif, ...getNotificacionesLocal()];
  writeLocalArray(STORAGE_KEYS.notifications, localList);

  if (getStorageMode() !== 'online') {
    return { ok: true, data: notif, source: 'local' };
  }

  const res = await execSupabaseQuery((sb) =>
    sb.from('notificaciones').insert([notif]).select()
  );

  if (!res.ok) {
    return {
      ok: true,
      data: notif,
      source: 'local',
      fallbackReason: res.fallbackReason || FALLBACK_NOTICE,
    };
  }

  return { ok: true, data: notif, source: 'cloud' };
}

/**
 * Sincroniza los datos demo o locales hacia Supabase evitando duplicados por id/folio.
 */
export async function syncDemoToCloud({ projects, applications, notifications } = {}) {
  const client = getSupabaseClient();
  if (!client) {
    return { ok: false, source: 'local', fallbackReason: FALLBACK_NOTICE };
  }

  const rawProjs = (projects || INITIAL_PROJECTS).map(toRemoteProjectRow);
  const rawApps = applications || INITIAL_APPLICATIONS;
  const rawNotifs = notifications || INITIAL_NOTIFICATIONS;

  // Evita duplicados por folio en proyectos y por estudiante+proyecto en postulaciones
  const [existingProjRes, existingAppRes] = await Promise.all([
    execSupabaseQuery((sb) => sb.from('proyectos').select('id, folio')),
    execSupabaseQuery((sb) => sb.from('postulaciones').select('*')),
  ]);

  if (!existingProjRes.ok) {
    return { ok: false, source: 'local', fallbackReason: FALLBACK_NOTICE };
  }

  const existingFoliosToId = new Map(
    (existingProjRes.data || []).map((row) => [row.folio, row.id])
  );
  const projsToUpsert = rawProjs.filter((p) => {
    const existingId = existingFoliosToId.get(p.folio);
    return !existingId || existingId === p.id;
  });

  const existingAppKeyToId = new Map(
    (existingAppRes.ok && Array.isArray(existingAppRes.data) ? existingAppRes.data : []).map(
      (row) => [
        `${row.projectId ?? row.project_id ?? ''}::${row.noControl ?? row.no_control ?? ''}`,
        row.id,
      ]
    )
  );
  const appsToUpsert = rawApps.filter((a) => {
    const existingId = existingAppKeyToId.get(`${a.projectId || ''}::${a.noControl || ''}`);
    return !existingId || existingId === a.id;
  });

  const [pRes, aRes] = await Promise.all([
    projsToUpsert.length > 0
      ? execSupabaseQuery((sb) =>
          sb.from('proyectos').upsert(projsToUpsert, { onConflict: 'id' }).select()
        )
      : Promise.resolve({ ok: true, data: [] }),
    appsToUpsert.length > 0
      ? execSupabaseQuery((sb) =>
          sb.from('postulaciones').upsert(appsToUpsert, { onConflict: 'id' }).select()
        )
      : Promise.resolve({ ok: true, data: [] }),
  ]);

  if (!pRes.ok || !aRes.ok) {
    return { ok: false, source: 'local', fallbackReason: FALLBACK_NOTICE };
  }

  // Notificaciones opcional si existe la tabla en el proyecto Supabase
  const nRes = await execSupabaseQuery((sb) =>
    sb.from('notificaciones').upsert(rawNotifs, { onConflict: 'id' }).select()
  );

  return {
    ok: true,
    source: 'cloud',
    syncedCount:
      projsToUpsert.length +
      appsToUpsert.length +
      (nRes.ok ? rawNotifs.length : 0),
  };
}

export async function resetDemoData() {
  writeLocalArray(STORAGE_KEYS.projects, INITIAL_PROJECTS);
  writeLocalArray(STORAGE_KEYS.applications, INITIAL_APPLICATIONS);
  writeLocalArray(STORAGE_KEYS.notifications, INITIAL_NOTIFICATIONS);

  if (getStorageMode() === 'online') {
    const cloudRes = await syncDemoToCloud({
      projects: INITIAL_PROJECTS,
      applications: INITIAL_APPLICATIONS,
      notifications: INITIAL_NOTIFICATIONS,
    });
    return {
      ok: true,
      projects: INITIAL_PROJECTS,
      applications: INITIAL_APPLICATIONS,
      notifications: INITIAL_NOTIFICATIONS,
      source: cloudRes.source,
      fallbackReason: cloudRes.fallbackReason,
    };
  }

  return {
    ok: true,
    projects: INITIAL_PROJECTS,
    applications: INITIAL_APPLICATIONS,
    notifications: INITIAL_NOTIFICATIONS,
    source: 'local',
  };
}
