import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  DEMO_STUDENT_PROFILE,
  INITIAL_APPLICATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PROJECTS,
} from '../data/mockData';
import * as dbService from '../services/dbService';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  projects: dbService.STORAGE_KEYS.projects,
  applications: dbService.STORAGE_KEYS.applications,
  notifications: dbService.STORAGE_KEYS.notifications,
  authUser: 'sibap_itsal_auth_user_v1',
};

export const DEMO_USERS = [
  {
    id: 'demo-estudiante',
    roleId: 'estudiante',
    shortRole: 'Alumno TIC',
    nombre: 'Andrea G. Toledo',
    nombreCompleto: 'Andrea Guadalupe Toledo',
    matricula: '211020074',
    area: 'Ing. TICs',
    carrera: 'Ing. en Tecnologías de la Información y Comunicaciones',
    semestre: '9° Semestre',
    promedio: '93.8',
    correo: 'l211020074@salinacruz.tecnm.mx',
  },
  {
    id: 'demo-docente',
    roleId: 'docente',
    shortRole: 'Docente Asesor',
    nombre: 'Ing. Alfonso Miguel Escobar',
    nombreCompleto: 'Ing. Alfonso Miguel Escobar',
    matricula: 'DOC-IEE-014',
    area: 'Ing. Eléctrica y Electrónica',
    carrera: 'Ing. Eléctrica y Electrónica',
    correo: 'alfonso.miguel@salinacruz.tecnm.mx',
  },
  {
    id: 'demo-jefatura',
    roleId: 'jefatura',
    shortRole: 'Jefatura/Vinculación',
    nombre: 'Ing. Anita del C. Morales Cruz',
    nombreCompleto: 'Ing. Anita del Carmen Morales Cruz',
    matricula: 'JEF-IEE-002',
    area: 'Jefatura / Vinculación',
    carrera: 'Ing. Eléctrica y Electrónica',
    correo: 'jefatura.iee@salinacruz.tecnm.mx',
  },
  {
    id: 'demo-directivo',
    roleId: 'directivo',
    shortRole: 'Subdirección Académica / Directivo',
    nombre: 'Dr. Octavio Ramírez Sosa',
    nombreCompleto: 'Dr. Octavio Ramírez Sosa',
    matricula: 'DIR-SUB-001',
    area: 'Subdirección Académica',
    carrera: 'Dirección / Subdirección Académica ITSAL',
    correo: 'subdireccion.acad@salinacruz.tecnm.mx',
  },
];

export const ROLE_PERMISSIONS = {
  estudiante: {
    roleLabel: 'Estudiante',
    sidebarLabel: 'Banco de Proyectos',
    sidebarSub: 'Catálogo y Mis Postulaciones',
    defaultView: 'banco',
    allowedViews: ['inicio', 'banco', 'registro', 'como-funciona'],
    canAccessServerConfig: false,
    sidebarItems: [
      {
        view: 'banco',
        label: 'Banco de Proyectos',
        sub: 'Catálogo y Mis Postulaciones',
        icon: 'graduation',
      },
      {
        view: 'registro',
        label: 'Proponer mi Proyecto',
        sub: 'Enviar Propuesta a Revisión',
        icon: 'filePlus',
      },
    ],
  },
  docente: {
    roleLabel: 'Docente / Empresa',
    sidebarLabel: 'Registro de Propuestas',
    sidebarSub: 'Propuestas y Mis Registros',
    defaultView: 'registro',
    allowedViews: ['inicio', 'registro', 'banco', 'como-funciona'],
    canAccessServerConfig: false,
    sidebarItems: [
      {
        view: 'registro',
        label: 'Registro de Propuestas',
        sub: 'Propuestas y Mis Registros',
        icon: 'filePlus',
      },
    ],
  },
  jefatura: {
    roleLabel: 'Jefatura / Vinculación',
    sidebarLabel: 'Gestión Académica y Vinculación',
    sidebarSub: 'Externos, Academia y Canalización',
    defaultView: 'gestion',
    allowedViews: ['inicio', 'gestion', 'como-funciona'],
    canAccessServerConfig: false,
    sidebarItems: [
      {
        view: 'gestion',
        label: 'Gestión Académica y Vinculación',
        sub: 'Externos, Academia y Canalización',
        icon: 'userCheck',
        showPendingBadge: true,
      },
    ],
  },
  directivo: {
    roleLabel: 'Subdirección Académica / Directivo',
    sidebarLabel: 'Tablero Ejecutivo y SGC',
    sidebarSub: 'Subdirección, Carreras y SGC',
    defaultView: 'indicadores',
    allowedViews: ['inicio', 'como-funciona', 'indicadores'],
    canAccessServerConfig: true,
    sidebarItems: [
      {
        view: 'indicadores',
        label: 'Tablero Ejecutivo y SGC',
        sub: 'Subdirección, Carreras y SGC',
        icon: 'barChart',
      },
    ],
  },
};

export const ROLES = [
  {
    id: 'estudiante',
    label: 'Estudiante',
    view: 'banco',
    badge: 'Alumno Candidato',
  },
  {
    id: 'docente',
    label: 'Docente / Empresa',
    view: 'registro',
    badge: 'Proponente',
  },
  {
    id: 'jefatura',
    label: 'Jefatura / Vinculación',
    view: 'gestion',
    badge: 'Comité Académico',
  },
  {
    id: 'directivo',
    label: 'Subdirección Académica / Directivo',
    view: 'indicadores',
    badge: 'Subdirección / SGC',
  },
];

export const TOUR_STEPS = [
  {
    step: 1,
    roleId: 'estudiante',
    roleLabel: 'Paso 1 · Estudiante',
    title: 'Banco de Proyectos y Recomendador IA',
    description:
      'Los estudiantes consultan proyectos validados y su porcentaje de afinidad técnica calculado automáticamente.',
    actionHint:
      'Despliega "Recomendador IA" para ajustar habilidades, o presiona "Revisar y Postular" en el proyecto ITSAL-RP-2026-001.',
  },
  {
    step: 2,
    roleId: 'docente',
    roleLabel: 'Paso 2 · Docente / Empresa',
    title: 'Registro de Propuestas y Asistente IA',
    description:
      'Docentes del ITSAL y organismos externos capturan propuestas en el formato oficial institucional.',
    actionHint:
      'Presiona "Cargar Borrador Demo", luego "Asistente IA de Redacción y Validación" y finalmente "Guardar Propuesta y Generar Folio QR".',
  },
  {
    step: 3,
    roleId: 'jefatura',
    roleLabel: 'Paso 3 · Jefatura / Vinculación',
    title: 'Gestión Académica y Vinculación',
    description:
      'Vinculación valida proyectos externos antes de publicarlos; la Academia revisa propuestas internas, asigna residentes y canaliza expedientes.',
    actionHint:
      'Presiona "Validar y Publicar en Banco" en la propuesta externa pendiente, o cambia a "Reunión de Academia" y haz clic en "Formalizar Asignación".',
  },
  {
    step: 4,
    roleId: 'directivo',
    roleLabel: 'Paso 4 · Directivo',
    title: 'Indicadores y Reportes SGC',
    description:
      'Subdirección Académica y Dirección consultan estadísticas consolidadas por periodo, departamento y área del conocimiento.',
    actionHint:
      'Haz clic en "Exportar CSV (Excel)" para descargar la matriz o en "Evidencia PDF (SGC)" para generar el reporte oficial de auditoría.',
  },
];

function getLocalDateISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function loadAuthUser() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.authUser);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadProjectsWithPhotos() {
  const stored = loadFromStorage(STORAGE_KEYS.projects, INITIAL_PROJECTS);
  return stored.map((proj) => {
    if (proj.imagenUrl) return proj;
    const match = INITIAL_PROJECTS.find((init) => init.id === proj.id || init.folio === proj.folio);
    return match?.imagenUrl ? { ...proj, imagenUrl: match.imagenUrl } : proj;
  });
}

export function AppProvider({ children }) {
  const [projects, setProjects] = useState(() => dbService.getProyectosLocal());
  const [applications, setApplications] = useState(() => dbService.getPostulacionesLocal());
  const [notifications, setNotifications] = useState(() => dbService.getNotificacionesLocal());

  const [storageMode, setStorageModeState] = useState(() => dbService.getStorageMode());
  const [cloudStatus, setCloudStatus] = useState(() => ({
    source: 'local',
    syncing: false,
    fallbackNotice: '',
  }));

  const [currentUser, setCurrentUser] = useState(() => loadAuthUser());
  // 'app' | 'landing' | 'login'
  const [activeSurface, setActiveSurface] = useState(() => (loadAuthUser() ? 'app' : 'login'));
  const [surfaceTransition, setSurfaceTransition] = useState(null); // null | 'to-app' | 'to-landing'
  const [serverNavActive, setServerNavActive] = useState(false);
  const transitionTimerRef = useRef(null);
  const [activeRole, setActiveRole] = useState(() => loadAuthUser()?.roleId || 'estudiante');
  const [activeView, setActiveView] = useState('inicio');
  const [toast, setToast] = useState(null);

  // Welcome Modal, Account Switcher, Role Drawer & Guided Tour State
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [rolePanelOpen, setRolePanelOpen] = useState(false);
  const [tourActive, setTourActive] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);

  // Mascot Assistant State (pose 1-9 + message)
  const [mascotHidden, setMascotHidden] = useState(false);
  const [mascotContext, setMascotContextState] = useState({
    pose: 9,
    message: '¡Bienvenido a IT Match! Todo está listo para explorar',
  });

  const setMascotContext = (pose, message) => {
    setMascotContextState({ pose, message });
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.applications, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifications));
  }, [notifications]);

  const applyCloudFeedback = (res) => {
    if (!res) return;
    if (res.fallbackReason) {
      setCloudStatus({
        source: 'local',
        syncing: false,
        fallbackNotice: res.fallbackReason,
      });
    } else if (res.source === 'cloud') {
      setCloudStatus({
        source: 'cloud',
        syncing: false,
        fallbackNotice: '',
      });
    }
  };

  useEffect(() => {
    if (storageMode !== 'online') return undefined;
    let active = true;
    (async () => {
      setCloudStatus((prev) => ({ ...prev, syncing: true }));
      const [pRes, aRes, nRes] = await Promise.all([
        dbService.getProyectos(),
        dbService.getPostulaciones(),
        dbService.getNotificaciones(),
      ]);
      if (!active) return;
      if (pRes.data) setProjects(pRes.data);
      if (aRes.data) setApplications(aRes.data);
      if (nRes.data) setNotifications(nRes.data);
      const fallback = pRes.fallbackReason || aRes.fallbackReason || nRes.fallbackReason || '';
      setCloudStatus({
        source: fallback ? 'local' : pRes.source,
        syncing: false,
        fallbackNotice: fallback,
      });
    })();
    return () => {
      active = false;
    };
  }, []);

  const switchStorageMode = async (nextMode) => {
    const normalized = dbService.setStorageMode(nextMode);
    setStorageModeState(normalized);

    if (normalized === 'offline') {
      setCloudStatus({ source: 'local', syncing: false, fallbackNotice: '' });
      showToast(
        'Modo Offline · Demo Local',
        'info',
        'Leyendo y guardando al instante en localStorage sin llamadas externas.'
      );
      return;
    }

    setCloudStatus((prev) => ({ ...prev, syncing: true, fallbackNotice: '' }));
    const [pRes, aRes, nRes] = await Promise.all([
      dbService.getProyectos(),
      dbService.getPostulaciones(),
      dbService.getNotificaciones(),
    ]);
    if (pRes.data) setProjects(pRes.data);
    if (aRes.data) setApplications(aRes.data);
    if (nRes.data) setNotifications(nRes.data);

    const fallback = pRes.fallbackReason || aRes.fallbackReason || nRes.fallbackReason || '';
    if (fallback) {
      setCloudStatus({ source: 'local', syncing: false, fallbackNotice: fallback });
      showToast('Online · Nube ITSAL (Respaldo local)', 'info', fallback);
    } else {
      setCloudStatus({ source: 'cloud', syncing: false, fallbackNotice: '' });
      showToast(
        'Modo Online · Nube ITSAL conectado',
        'success',
        'Datos sincronizados con la capa remota en la nube.'
      );
    }
  };

  const syncDemoToCloudAction = async () => {
    setCloudStatus((prev) => ({ ...prev, syncing: true }));
    const res = await dbService.syncDemoToCloud({ projects, applications, notifications });
    if (!res.ok) {
      setCloudStatus({
        source: 'local',
        syncing: false,
        fallbackNotice: res.fallbackReason || 'Sin credenciales o sin red: usando respaldo local',
      });
      showToast(
        'Respaldo local activo',
        'info',
        res.fallbackReason || 'Sin credenciales o sin red: usando respaldo local'
      );
      return res;
    }

    setCloudStatus({ source: 'cloud', syncing: false, fallbackNotice: '' });
    showToast(
      'Datos demo sincronizados a la nube',
      'success',
      `Se sincronizaron ${res.syncedCount} registros hacia la Nube ITSAL.`
    );
    return res;
  };

  const showToast = (message, type = 'success', detail = '') => {
    setToast({ id: Date.now(), message, type, detail });
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  const syncMascotForRole = (roleId) => {
    if (roleId === 'estudiante') {
      setMascotContext(2, 'Ajusta tus habilidades para calcular tu % de afinidad académica');
    } else if (roleId === 'docente') {
      setMascotContext(3, 'Aquí redactas tu propuesta y generas el formato oficial con código QR');
    } else if (roleId === 'jefatura') {
      setMascotContext(4, 'Valida propuestas externas, formaliza asignaciones y canaliza expedientes');
    } else if (roleId === 'directivo') {
      setMascotContext(5, '¡Meta cumplida! Consulta los indicadores y reportes oficiales');
    }
  };

  // RBAC Guard: asegura que activeRole y activeView correspondan al rol de la cuenta activa
  useEffect(() => {
    if (!currentUser) return;
    const roleId = currentUser.roleId || 'estudiante';
    const perms = ROLE_PERMISSIONS[roleId] || ROLE_PERMISSIONS.estudiante;

    if (activeRole !== roleId) {
      setActiveRole(roleId);
    }
    if (!perms.allowedViews.includes(activeView)) {
      setActiveView(perms.defaultView);
      setServerNavActive(false);
    }
    if (serverNavActive && !perms.canAccessServerConfig) {
      setServerNavActive(false);
    }
  }, [currentUser, activeRole, activeView, serverNavActive]);

  const applyRoleSwitch = (roleId, { enterApp = true, isServer = false, forceDemoSwitch = false } = {}) => {
    const targetUser =
      !forceDemoSwitch && currentUser
        ? currentUser
        : DEMO_USERS.find((u) => u.roleId === roleId) || DEMO_USERS[0];
    const effectiveRoleId = targetUser.roleId || 'estudiante';
    const perms = ROLE_PERMISSIONS[effectiveRoleId] || ROLE_PERMISSIONS.estudiante;
    const requestedView = ROLES.find((r) => r.id === roleId)?.view || perms.defaultView;
    const nextView = perms.allowedViews.includes(requestedView) ? requestedView : perms.defaultView;

    setCurrentUser(targetUser);
    try {
      sessionStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(targetUser));
    } catch {
      // ignore
    }

    setActiveRole(effectiveRoleId);
    setActiveView(nextView);
    setServerNavActive(Boolean(isServer && perms.canAccessServerConfig));

    if (!forceDemoSwitch && currentUser && roleId && roleId !== effectiveRoleId) {
      showToast(
        'Redirigido a tu módulo autorizado',
        'info',
        `Tu rol activo es ${perms.roleLabel}. Usa "Cambiar cuenta / Sesión" para probar otro perfil.`
      );
    }

    if (enterApp) {
      setActiveSurface('app');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    syncMascotForRole(effectiveRoleId);
  };

  const switchRole = (roleId, { enterApp = true, isServer = false, forceDemoSwitch = false } = {}) => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }

    if (enterApp && !currentUser && !forceDemoSwitch) {
      setAccountModalOpen(true);
      showToast('Inicia sesión para continuar', 'info', 'Elige una cuenta para entrar a su módulo autorizado.');
      return;
    }

    if (enterApp && activeSurface !== 'app') {
      setSurfaceTransition('to-app');
      transitionTimerRef.current = setTimeout(() => {
        applyRoleSwitch(roleId, { enterApp: true, isServer, forceDemoSwitch });
        setSurfaceTransition(null);
      }, 190);
      return;
    }

    applyRoleSwitch(roleId, { enterApp, isServer, forceDemoSwitch });
  };

  const navigateView = (targetView) => {
    if (!currentUser) {
      if (targetView === 'inicio' || targetView === 'como-funciona') {
        setActiveView(targetView);
        setActiveSurface('app');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      setAccountModalOpen(true);
      showToast('Inicia sesión para continuar', 'info', 'Elige una cuenta para entrar a su módulo.');
      return;
    }

    const roleId = currentUser.roleId || activeRole || 'estudiante';
    const perms = ROLE_PERMISSIONS[roleId] || ROLE_PERMISSIONS.estudiante;
    if (!perms.allowedViews.includes(targetView)) {
      setActiveView(perms.defaultView);
      setServerNavActive(false);
      showToast(
        'Acceso restringido',
        'error',
        `Tu rol (${perms.roleLabel}) no tiene permiso para acceder a esta sección.`
      );
      return;
    }
    setActiveSurface('app');
    setActiveView(targetView);
    setServerNavActive(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (roleId === 'estudiante' && targetView === 'registro') {
      setMascotContext(3, 'Registra tu propia propuesta de Residencia y envíala a Revisión Académica');
    } else if (targetView === 'inicio' || targetView === 'como-funciona') {
      setMascotContext(9, '¡Bienvenido a IT Match! Todo está listo para explorar');
    } else {
      syncMascotForRole(roleId);
    }
  };

  const enterProtectedModule = (requestedRoleId) => {
    if (!currentUser) {
      setAccountModalOpen(true);
      showToast('Sesión requerida', 'info', 'Selecciona una cuenta para acceder a tu módulo.');
      return;
    }
    switchRole(requestedRoleId || currentUser.roleId, { enterApp: true });
  };

  const goToLanding = () => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    setSurfaceTransition(null);
    setServerNavActive(false);
    setTourActive(false);
    setActiveSurface('app');
    setActiveView('inicio');
    setMascotContext(9, '¡Bienvenido a IT Match! Todo está listo para explorar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToLogin = () => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    setSurfaceTransition(null);
    setServerNavActive(false);
    setActiveSurface('login');
    setTourActive(false);
    setMascotContext(1, '¡Hola! Soy tu guía de IT Match. Elige tu perfil para empezar 👋');
  };

  const loginAsDemo = (demoUserId) => {
    const user = DEMO_USERS.find((u) => u.id === demoUserId) || DEMO_USERS[0];
    setCurrentUser(user);
    try {
      sessionStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(user));
    } catch {
      // ignore
    }
    setActiveRole(user.roleId);
    const perms = ROLE_PERMISSIONS[user.roleId] || ROLE_PERMISSIONS.estudiante;
    setActiveView('inicio');
    setServerNavActive(false);
    setActiveSurface('app');
    setTourActive(false);
    setWelcomeOpen(false);
    setMascotContext(9, '¡Bienvenido a IT Match! Todo está listo para explorar');
    showToast(`Sesión iniciada: ${user.nombre}`, 'info', `${user.matricula} · ${perms.roleLabel}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginWithCredentials = (emailOrControl, password) => {
    const cleanInput = (emailOrControl || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    if (!cleanInput || !password?.trim()) {
      return { ok: false, error: 'Ingresa tu correo institucional o matrícula y contraseña.' };
    }

    let matched = DEMO_USERS[0];
    if (cleanInput.includes('docente') || cleanInput.includes('alfonso') || cleanInput.includes('doc-')) {
      matched = DEMO_USERS[1];
    } else if (
      cleanInput.includes('jefatura') ||
      cleanInput.includes('vinculacion') ||
      cleanInput.includes('anita') ||
      cleanInput.includes('jef-')
    ) {
      matched = DEMO_USERS[2];
    } else if (
      cleanInput.includes('directivo') ||
      cleanInput.includes('subdireccion') ||
      cleanInput.includes('octavio') ||
      cleanInput.includes('dir-')
    ) {
      matched = DEMO_USERS[3];
    } else {
      matched = {
        ...DEMO_USERS[0],
        correo: cleanInput.includes('@') ? cleanInput : `${cleanInput}@salinacruz.tecnm.mx`,
        matricula: cleanInput.includes('@') ? DEMO_USERS[0].matricula : cleanInput.toUpperCase(),
      };
    }

    setCurrentUser(matched);
    try {
      sessionStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(matched));
    } catch {
      // ignore
    }
    setActiveRole(matched.roleId);
    setActiveView('inicio');
    setServerNavActive(false);
    setActiveSurface('app');
    setTourActive(false);
    setWelcomeOpen(false);
    setMascotContext(9, '¡Bienvenido a IT Match! Todo está listo para explorar');
    showToast(`Bienvenido(a), ${matched.nombre}`, 'success', `${matched.matricula} · ${matched.area}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return { ok: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setRolePanelOpen(false);
    setTourActive(false);
    setWelcomeOpen(false);
    setActiveSurface('login');
    setMascotContext(1, '¡Hola! Soy tu guía de IT Match. Elige tu perfil para empezar 👋');
    try {
      sessionStorage.removeItem(STORAGE_KEYS.authUser);
    } catch {
      // ignore
    }
  };

  const closeWelcome = () => {
    setWelcomeOpen(false);
  };

  const openWelcome = () => {
    setWelcomeOpen(true);
    setMascotContext(1, '¡Hola! Soy tu guía de IT Match. Elige tu perfil para empezar');
  };

  const openAccountModal = () => setAccountModalOpen(true);
  const closeAccountModal = () => setAccountModalOpen(false);

  const openRolePanel = () => setRolePanelOpen(true);
  const closeRolePanel = () => setRolePanelOpen(false);

  const goToServerSettings = () => {
    if (!currentUser) {
      setAccountModalOpen(true);
      showToast('Inicia sesión como Directivo', 'info', 'La configuración del servidor requiere rol Directivo.');
      return;
    }
    const perms = ROLE_PERMISSIONS[currentUser.roleId] || ROLE_PERMISSIONS.estudiante;
    if (!perms.canAccessServerConfig) {
      setServerNavActive(false);
      setActiveView(perms.defaultView);
      showToast(
        'Acceso restringido a Directivo',
        'error',
        `Tu cuenta (${perms.roleLabel}) no tiene permisos para Servidor / BD ITSAL.`
      );
      return;
    }

    const scrollDelay = activeSurface === 'app' ? 120 : 340;
    switchRole('directivo', { enterApp: true, isServer: true });
    setTimeout(() => {
      const el = document.getElementById('servidor-bd-itsal');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, scrollDelay);
  };

  const startGuidedTour = () => {
    setWelcomeOpen(false);
    setTourActive(true);
    setTourStepIndex(0);
    switchRole(TOUR_STEPS[0].roleId, { enterApp: true, forceDemoSwitch: true });
    setMascotContext(4, 'Haz clic en este botón para probar esta función en vivo');
  };

  const goToTourStep = (nextIndex) => {
    if (nextIndex < 0 || nextIndex >= TOUR_STEPS.length) return;
    setTourStepIndex(nextIndex);
    switchRole(TOUR_STEPS[nextIndex].roleId, { enterApp: true, forceDemoSwitch: true });
    setMascotContext(4, 'Haz clic en este botón para probar esta función en vivo');
  };

  const closeTour = () => {
    setTourActive(false);
    syncMascotForRole(activeRole);
  };

  const pushNotification = ({ canal, destinatario, asunto, mensaje }) => {
    const now = new Date();
    const formattedDate = `${getLocalDateISO()} ${now.toTimeString().slice(0, 5)}`;
    const newNotif = {
      id: `notif-${Date.now()}`,
      canal,
      destinatario,
      asunto,
      mensaje,
      fecha: formattedDate,
    };
    const nextList = [newNotif, ...notifications];
    setNotifications(nextList);
    dbService.createNotificacion(newNotif, nextList).then(applyCloudFeedback);
    return newNotif;
  };

  const submitApplication = (projectId, studentPayload) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return { ok: false, error: 'Proyecto no encontrado.' };

    const already = applications.some(
      (a) =>
        a.projectId === projectId &&
        a.noControl.trim().toLowerCase() === studentPayload.noControl.trim().toLowerCase()
    );
    if (already) {
      return { ok: false, error: 'Ya cuentas con una postulación registrada para este proyecto.' };
    }

    const newApp = {
      id: `app-${Date.now()}`,
      projectId: project.id,
      projectFolio: project.folio,
      projectTitle: project.titulo,
      estudianteNombre: studentPayload.nombre,
      noControl: studentPayload.noControl,
      carrera: studentPayload.carrera,
      semestre: studentPayload.semestre,
      promedio: studentPayload.promedio,
      habilidades: studentPayload.habilidades || [],
      motivacion: studentPayload.motivacion,
      fechaPostulacion: getLocalDateISO(),
      estado: 'En Revisión de Academia',
      esDemoUsuario: true,
    };

    const nextApps = [newApp, ...applications];
    setApplications(nextApps);
    dbService.createPostulacion(newApp, nextApps).then(applyCloudFeedback);
    pushNotification({
      canal: 'Correo Institucional',
      destinatario: `${project.asesor} / Academia de ${project.departamento}`,
      asunto: `Nueva Postulación: ${project.folio}`,
      mensaje: `${studentPayload.nombre} (${studentPayload.noControl}) se postuló al proyecto "${project.titulo}".`,
    });
    setMascotContext(7, '¡Excelente! Acción registrada correctamente en el sistema');
    showToast(
      'Postulación enviada correctamente',
      'success',
      `Tu solicitud para ${project.folio} pasó a Revisión de Academia.`
    );
    return { ok: true, application: newApp };
  };

  const createProject = (formData) => {
    const nextNum = projects.length + 1;
    const padded = String(nextNum).padStart(3, '0');
    const folio = `ITSAL-RP-2026-${padded}`;

    const isStudentProposal =
      currentUser?.roleId === 'estudiante' || formData.origen === 'Propuesta de Estudiante';
    const finalOrigen = isStudentProposal ? 'Propuesta de Estudiante' : formData.origen;
    const initialEstado =
      finalOrigen === 'Externo' ? 'Pendiente de Vinculación' : 'En Revisión Académica';

    const newProject = {
      id: `proj-${Date.now()}`,
      folio,
      imagenUrl: formData.imagenUrl || '/projects/proj-001.jpg',
      origen: finalOrigen,
      modalidadLugar: isStudentProposal ? formData.modalidadLugar || 'ITSAL' : undefined,
      estudianteProponente: isStudentProposal
        ? {
            nombre:
              formData.estudianteNombre ||
              currentUser?.nombreCompleto ||
              currentUser?.nombre ||
              '',
            matricula: formData.estudianteMatricula || currentUser?.matricula || '',
          }
        : undefined,
      institucion: formData.institucion.trim(),
      departamento: formData.departamento,
      perfilRequerido: formData.perfilRequerido,
      alumnosRequeridos: Number(formData.alumnosRequeridos) || 1,
      alumnosAsignados: [],
      asesor: formData.asesor.trim(),
      colaboradores: (formData.colaboradores || '').trim(),
      jefeDepartamento: (formData.jefeDepartamento || 'Por asignar Vo. Bo.').trim(),
      areaConocimiento: formData.areaConocimiento,
      titulo: formData.titulo.trim(),
      tipoProyecto: formData.tipoProyecto,
      estado: initialEstado,
      periodo: formData.periodo || 'Enero - Junio 2026',
      fechaRegistro: getLocalDateISO(),
      habilidades: formData.habilidades?.length
        ? formData.habilidades
        : ['Análisis de Datos', 'Gestión de Calidad'],
      objetivo: formData.objetivo.trim(),
      planteamiento: formData.planteamiento.trim(),
      justificacion: formData.justificacion.trim(),
      alcances: formData.alcances.trim(),
      limitaciones: formData.limitaciones.trim(),
      observaciones: (formData.observaciones || '').trim(),
      observacionesAcademia: '',
      observacionesVinculacion: '',
      canalizadoVinculacion: false,
      creadoPorId: currentUser?.id || 'demo-docente',
    };

    const nextProjects = [newProject, ...projects];
    setProjects(nextProjects);
    dbService.createProyecto(newProject, nextProjects).then(applyCloudFeedback);
    pushNotification({
      canal: 'Correo Institucional',
      destinatario:
        finalOrigen === 'Externo'
          ? 'Gestión Tecnológica y Vinculación'
          : `Jefatura de ${formData.departamento}`,
      asunto: `Nueva Propuesta Registrada: ${folio}`,
      mensaje: isStudentProposal
        ? `El estudiante ${newProject.estudianteProponente?.nombre} (${newProject.estudianteProponente?.matricula}) registró la propuesta "${newProject.titulo}" para Revisión Académica.`
        : `Se registró la propuesta "${newProject.titulo}" (${finalOrigen}) en estado "${initialEstado}".`,
    });
    setMascotContext(7, '¡Excelente! Acción registrada correctamente en el sistema');
    showToast(
      isStudentProposal
        ? `Propuesta enviada a Revisión Académica (${folio})`
        : `Propuesta guardada: ${folio}`,
      'success',
      isStudentProposal
        ? 'Tu proyecto fue turnado a Jefatura / Academia para su dictamen y cuenta con formato QR.'
        : 'Se generó el formato oficial verificable con código QR.'
    );
    return newProject;
  };

  const updateProjectStatus = (projectId, updates) => {
    const nextProjects = projects.map((p) => (p.id === projectId ? { ...p, ...updates } : p));
    setProjects(nextProjects);
    dbService.updateProyecto(projectId, updates, nextProjects).then(applyCloudFeedback);
  };

  const resubmitProject = (projectId, formData) => {
    const existing = projects.find((p) => p.id === projectId);
    if (!existing) return null;

    const nextEstado =
      formData.origen === 'Externo' ? 'Pendiente de Vinculación' : 'En Revisión Académica';

    const updates = {
      imagenUrl: formData.imagenUrl || existing.imagenUrl || '/projects/proj-001.jpg',
      origen: formData.origen,
      institucion: formData.institucion.trim(),
      departamento: formData.departamento,
      perfilRequerido: formData.perfilRequerido,
      alumnosRequeridos: Number(formData.alumnosRequeridos) || 1,
      asesor: formData.asesor.trim(),
      colaboradores: (formData.colaboradores || '').trim(),
      jefeDepartamento: (formData.jefeDepartamento || 'Por asignar Vo. Bo.').trim(),
      areaConocimiento: formData.areaConocimiento,
      titulo: formData.titulo.trim(),
      tipoProyecto: formData.tipoProyecto,
      periodo: formData.periodo || existing.periodo,
      habilidades: formData.habilidades?.length ? formData.habilidades : existing.habilidades,
      objetivo: formData.objetivo.trim(),
      planteamiento: formData.planteamiento.trim(),
      justificacion: formData.justificacion.trim(),
      alcances: formData.alcances.trim(),
      limitaciones: formData.limitaciones.trim(),
      observaciones: (formData.observaciones || '').trim(),
      observacionesAcademia: '',
      observacionesVinculacion: '',
      estado: nextEstado,
    };

    const nextProjects = projects.map((p) =>
      p.id === projectId ? { ...p, ...updates } : p
    );
    setProjects(nextProjects);
    dbService.updateProyecto(projectId, updates, nextProjects).then(applyCloudFeedback);

    pushNotification({
      canal: 'Correo Institucional',
      destinatario:
        formData.origen === 'Externo'
          ? 'Gestión Tecnológica y Vinculación'
          : `Jefatura de ${formData.departamento}`,
      asunto: `Propuesta Corregida y Reenviada: ${existing.folio}`,
      mensaje: `El asesor ${updates.asesor} atendió las observaciones de ${existing.folio} ("${updates.titulo}") y la reenvió a dictamen.`,
    });
    setMascotContext(7, '¡Propuesta corregida y reenviada a dictamen!');
    showToast(
      `Propuesta reenviada (${existing.folio})`,
      'success',
      `Estatus actualizado a "${nextEstado}" para nueva revisión.`
    );
    return { ...existing, ...updates };
  };

  const updateResidentStage = (projectId, noControl, updates) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const updatedAssigned = (project.alumnosAsignados || []).map((al) => {
      if (al.noControl !== noControl) return al;
      return {
        ...al,
        etapas: {
          anteproyecto: Boolean(al.etapas?.anteproyecto),
          primerReporte: Boolean(al.etapas?.primerReporte),
          segundoReporte: Boolean(al.etapas?.segundoReporte),
          reporteFinal: Boolean(al.etapas?.reporteFinal),
          ...(updates.etapas || {}),
        },
        observacionAsesor:
          updates.observacionAsesor !== undefined
            ? updates.observacionAsesor
            : al.observacionAsesor || '',
        ultimaRevision: getLocalDateISO(),
      };
    });

    const nextProjects = projects.map((p) =>
      p.id === projectId ? { ...p, alumnosAsignados: updatedAssigned } : p
    );
    setProjects(nextProjects);
    dbService
      .updateProyecto(projectId, { alumnosAsignados: updatedAssigned }, nextProjects)
      .then(applyCloudFeedback);

    if (updates.notifyLabel) {
      const resident = updatedAssigned.find((al) => al.noControl === noControl);
      pushNotification({
        canal: 'Correo Institucional',
        destinatario: `${resident?.nombre || noControl}`,
        asunto: `Avance de Residencia Actualizado: ${project.folio}`,
        mensaje: `Tu asesor (${project.asesor}) registró avance en "${updates.notifyLabel}"${
          resident?.observacionAsesor ? `: "${resident.observacionAsesor}"` : '.'
        }`,
      });
    }
    showToast('Seguimiento de residente actualizado', 'success', `${project.folio} · ${noControl}`);
  };

  const approveExternalProject = (projectId, observacionesVinculacion, asesorAsignado) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    const finalAsesor = asesorAsignado?.trim() || project.asesor;
    updateProjectStatus(projectId, {
      estado: 'Publicado',
      asesor: finalAsesor,
      observacionesVinculacion:
        observacionesVinculacion || 'Validado por Gestión Tecnológica y Vinculación y División de Estudios Profesionales.',
    });
    pushNotification({
      canal: 'Correo Institucional + WhatsApp',
      destinatario: `${project.institucion} / ${finalAsesor}`,
      asunto: `Proyecto Externo Publicado: ${project.folio}`,
      mensaje: `La propuesta externa "${project.titulo}" fue validada con asesor interno ${finalAsesor} y publicada en el Banco de Proyectos del ITSAL.`,
    });
    setMascotContext(7, '¡Excelente! Acción registrada correctamente en el sistema');
    showToast('Proyecto externo validado y publicado', 'success', `${project.folio} · Asesor: ${finalAsesor}`);
  };

  const approveInternalProject = (projectId, observacionesAcademia, asesorAsignado) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    const finalAsesor = asesorAsignado?.trim() || project.asesor;
    updateProjectStatus(projectId, {
      estado: 'Publicado',
      asesor: finalAsesor,
      observacionesAcademia:
        observacionesAcademia || 'Aprobado en Reunión de Academia para publicación en el Banco de Proyectos.',
    });
    pushNotification({
      canal: 'Correo Institucional',
      destinatario: `${finalAsesor}`,
      asunto: `Dictamen Favorable de Academia: ${project.folio}`,
      mensaje: `El proyecto "${project.titulo}" fue aprobado en Reunión de Academia (Asesor: ${finalAsesor}) y publicado para postulaciones.`,
    });
    setMascotContext(7, '¡Excelente! Acción registrada correctamente en el sistema');
    showToast('Propuesta aprobada por Academia', 'success', `${project.folio} · Asesor: ${finalAsesor}`);
  };

  const rejectProject = (projectId, motivo, origenFlujo = 'Academia') => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    const obsField = origenFlujo === 'Vinculación' ? 'observacionesVinculacion' : 'observacionesAcademia';
    updateProjectStatus(projectId, {
      estado: 'Rechazado',
      [obsField]: motivo || 'Requiere replanteamiento de alcances o perfil académico.',
    });
    pushNotification({
      canal: 'Correo Institucional',
      destinatario: project.asesor,
      asunto: `Observaciones de ${origenFlujo}: ${project.folio}`,
      mensaje: `La propuesta "${project.titulo}" recibió observaciones: ${motivo}`,
    });
    showToast('Propuesta devuelta con observaciones', 'info', `${project.folio} marcada como Rechazado.`);
  };

  const assignStudentToProject = (applicationId, observacionesAcademia = '') => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;
    const project = projects.find((p) => p.id === app.projectId);
    if (!project) return;

    const alreadyAssigned = project.alumnosAsignados.some(
      (al) => al.noControl === app.noControl
    );
    if (alreadyAssigned) {
      showToast('El estudiante ya está asignado a este proyecto.', 'info');
      return;
    }

    if (project.alumnosAsignados.length >= project.alumnosRequeridos) {
      showToast('Este proyecto ya cubrió todas sus plazas disponibles.', 'error');
      return;
    }

    const updatedAssigned = [
      ...project.alumnosAsignados,
      {
        nombre: app.estudianteNombre,
        noControl: app.noControl,
        carrera: app.carrera,
        fechaAsignacion: getLocalDateISO(),
      },
    ];

    const isFull = updatedAssigned.length >= project.alumnosRequeridos;

    const projectUpdates = {
      alumnosAsignados: updatedAssigned,
      estado: isFull ? 'Asignado' : project.estado,
      observacionesAcademia: observacionesAcademia || project.observacionesAcademia,
    };
    const nextProjects = projects.map((p) =>
      p.id === project.id ? { ...p, ...projectUpdates } : p
    );
    setProjects(nextProjects);
    dbService.updateProyecto(project.id, projectUpdates, nextProjects).then(applyCloudFeedback);

    const nextApps = applications.map((a) =>
      a.id === applicationId ? { ...a, estado: 'Asignado por Academia' } : a
    );
    setApplications(nextApps);
    dbService
      .updatePostulacion(applicationId, { estado: 'Asignado por Academia' }, nextApps)
      .then(applyCloudFeedback);

    pushNotification({
      canal: 'Correo Institucional + WhatsApp',
      destinatario: `${app.estudianteNombre} (${app.noControl})`,
      asunto: `Asignación Aprobada en Academia: ${project.folio}`,
      mensaje: `Has sido asignado(a) formalmente al proyecto "${project.titulo}". Siguiente paso: canalización a Gestión Tecnológica y Vinculación.`,
    });

    setMascotContext(7, '¡Excelente! Acción registrada correctamente en el sistema');
    showToast(
      `Residente asignado: ${app.estudianteNombre}`,
      'success',
      `Plazas ocupadas: ${updatedAssigned.length} de ${project.alumnosRequeridos}.`
    );
  };

  const rejectApplication = (applicationId) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;
    const nextApps = applications.map((a) =>
      a.id === applicationId ? { ...a, estado: 'No Seleccionado' } : a
    );
    setApplications(nextApps);
    dbService
      .updatePostulacion(applicationId, { estado: 'No Seleccionado' }, nextApps)
      .then(applyCloudFeedback);
    showToast('Postulación marcada como no seleccionada', 'info');
  };

  const channelToVinculacion = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const nextProjects = projects.map((p) =>
      p.id === projectId ? { ...p, canalizadoVinculacion: true } : p
    );
    setProjects(nextProjects);
    dbService
      .updateProyecto(projectId, { canalizadoVinculacion: true }, nextProjects)
      .then(applyCloudFeedback);

    const affectedIds = [];
    const nextApps = applications.map((a) => {
      if (a.projectId === projectId && a.estado === 'Asignado por Academia') {
        affectedIds.push(a.id);
        return { ...a, estado: 'Canalizado a Vinculación' };
      }
      return a;
    });
    setApplications(nextApps);
    affectedIds.forEach((id) => {
      dbService
        .updatePostulacion(id, { estado: 'Canalizado a Vinculación' }, nextApps)
        .then(applyCloudFeedback);
    });

    const estudiantesTxt =
      project.alumnosAsignados.map((al) => `${al.nombre} (${al.noControl})`).join(', ') ||
      'Residentes asignados';

    pushNotification({
      canal: 'Correo Institucional + WhatsApp',
      destinatario: `Gestión Tecnológica y Vinculación / ${project.institucion}`,
      asunto: `Canalización Oficial de Residencia: ${project.folio}`,
      mensaje: `Notificación automática enviada por correo y WhatsApp: El proyecto "${project.titulo}" con residente(s) ${estudiantesTxt} fue canalizado a Gestión Tecnológica y Vinculación para emisión de Carta de Presentación y Aceptación.`,
    });

    setMascotContext(5, '¡Meta cumplida! Consulta los indicadores y reportes oficiales');
    showToast(
      `Proyecto ${project.folio} canalizado a Vinculación`,
      'success',
      'Notificación automática enviada vía Correo Institucional y WhatsApp.'
    );
  };

  const resetDemoData = async () => {
    setProjects(INITIAL_PROJECTS);
    setApplications(INITIAL_APPLICATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    const res = await dbService.resetDemoData();
    applyCloudFeedback(res);
    setMascotContext(9, '¡Bienvenido a IT Match! Todo está listo para explorar');
    showToast(
      'Datos de demostración restaurados',
      'info',
      res.fallbackReason
        ? 'Se restauraron localmente (sin credenciales o sin red en la nube).'
        : 'Se recargaron los 6 proyectos iniciales del ITSAL.'
    );
  };

  return (
    <AppContext.Provider
      value={{
        projects,
        applications,
        notifications,
        currentUser,
        activeSurface,
        setActiveSurface,
        surfaceTransition,
        serverNavActive,
        activeRole,
        activeView,
        setActiveView,
        switchRole,
        navigateView,
        enterProtectedModule,
        goToLanding,
        goToLogin,
        loginAsDemo,
        loginWithCredentials,
        logout,
        demoStudent: DEMO_STUDENT_PROFILE,
        toast,
        setToast,
        showToast,
        pushNotification,
        welcomeOpen,
        openWelcome,
        closeWelcome,
        accountModalOpen,
        openAccountModal,
        closeAccountModal,
        rolePanelOpen,
        openRolePanel,
        closeRolePanel,
        goToServerSettings,
        tourActive,
        tourStepIndex,
        startGuidedTour,
        goToTourStep,
        closeTour,
        mascotHidden,
        setMascotHidden,
        mascotContext,
        setMascotContext,
        submitApplication,
        createProject,
        resubmitProject,
        updateResidentStage,
        approveExternalProject,
        approveInternalProject,
        rejectProject,
        assignStudentToProject,
        rejectApplication,
        channelToVinculacion,
        resetDemoData,
        storageMode,
        cloudStatus,
        switchStorageMode,
        syncDemoToCloudAction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
