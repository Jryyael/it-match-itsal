import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Bell,
  Cloud,
  Database,
  FileCheck2,
  GraduationCap,
  HardDrive,
  HelpCircle,
  LogOut,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  UserCheck,
  X,
} from 'lucide-react';
import { ROLE_PERMISSIONS, useApp } from '../context/AppContext';

const ROLE_SWITCH_OPTIONS = [
  {
    userId: 'demo-estudiante',
    roleId: 'estudiante',
    label: 'Alumno',
    sub: 'Banco IA y propuestas',
    icon: GraduationCap,
  },
  {
    userId: 'demo-docente',
    roleId: 'docente',
    label: 'Docente',
    sub: 'Registro oficial y QR',
    icon: FileCheck2,
  },
  {
    userId: 'demo-jefatura',
    roleId: 'jefatura',
    label: 'Jefatura',
    sub: 'Academia y vinculación',
    icon: UserCheck,
  },
  {
    userId: 'demo-directivo',
    roleId: 'directivo',
    label: 'Subdirección',
    sub: 'Tablero SGC y BD ITSAL',
    icon: ShieldCheck,
  },
];

function getInitials(name) {
  if (!name) return 'IT';
  const prefixes = new Set([
    'ing.',
    'ing',
    'dr.',
    'dr',
    'dra.',
    'm.t.i.',
    'm.c.',
    'mtra.',
    'mtro.',
    'lic.',
    'del',
    'de',
    'la',
    'las',
    'los',
  ]);
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((w) => !prefixes.has(w.toLowerCase()));
  if (parts.length === 0) return name.slice(0, 2).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function RoleDrawerPanel() {
  const {
    rolePanelOpen,
    closeRolePanel,
    currentUser,
    activeRole,
    loginAsDemo,
    logout,
    openWelcome,
    goToServerSettings,
    notifications,
    storageMode,
    cloudStatus,
    switchStorageMode,
    syncDemoToCloudAction,
    resetDemoData,
  } = useApp();

  const [notifExpanded, setNotifExpanded] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (!rolePanelOpen) {
      setConfirmReset(false);
      return undefined;
    }

    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeRolePanel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [rolePanelOpen, closeRolePanel]);

  if (!rolePanelOpen) return null;

  const effectiveRoleId = currentUser?.roleId || activeRole || 'estudiante';
  const rolePerms = ROLE_PERMISSIONS[effectiveRoleId] || ROLE_PERMISSIONS.estudiante;
  const initials = getInitials(currentUser?.nombre);
  const isCloudSynced =
    storageMode === 'online' && cloudStatus.source === 'cloud' && !cloudStatus.fallbackNotice;

  const envStatusText =
    storageMode === 'offline'
      ? 'Modo Local (Sin conexión)'
      : isCloudSynced
      ? 'Nube ITSAL (Sincronizado)'
      : 'Nube ITSAL (Respaldo local)';

  const handleSelectRole = (userId) => {
    loginAsDemo(userId);
    closeRolePanel();
  };

  const handleConfirmReset = () => {
    resetDemoData();
    setConfirmReset(false);
  };

  const panelNode = (
    <div className="no-print fixed inset-0 z-[95] flex justify-end bg-slate-950/30 backdrop-blur-[2px] animate-it-enter">
      <div
        className="fixed inset-0"
        aria-hidden="true"
        onClick={closeRolePanel}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Panel de rol y entorno"
        className="relative z-10 flex h-full w-full max-w-sm flex-col justify-between border-l border-slate-200 bg-white/95 backdrop-blur-md shadow-xl animate-drawer-in"
      >
        {/* Cabecera del panel con usuario activo e iniciales */}
        <div className="border-b border-slate-200 px-5 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#009FE3]/40 bg-[#009FE3]/10 font-mono text-xs font-extrabold text-[#0D2240]">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-[#0D2240] leading-snug break-words">
                {currentUser?.nombre || 'Invitado ITSAL'}
              </p>
              <p className="text-[11px] font-semibold text-[#009FE3] truncate">
                {rolePerms.roleLabel}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeRolePanel}
            aria-label="Cerrar panel"
            className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-[#0D2240]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Contenido desplazable del panel */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Cambio rápido de rol */}
          <section className="space-y-2.5">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Cambiar de rol
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {ROLE_SWITCH_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const active = effectiveRoleId === opt.roleId;
                return (
                  <button
                    key={opt.userId}
                    type="button"
                    onClick={() => handleSelectRole(opt.userId)}
                    className={`flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                      active
                        ? 'border-[#009FE3] bg-[#009FE3]/10 shadow-xs'
                        : 'border-slate-200 bg-[#FAF8F5] hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex w-full items-center justify-between gap-1">
                      <Icon
                        className={`h-4 w-4 ${
                          active ? 'text-[#009FE3]' : 'text-[#0D2240]'
                        }`}
                      />
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#009FE3]" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-[#0D2240]">
                        {opt.label}
                      </p>
                      <p className="text-[10px] leading-snug text-slate-500">
                        {opt.sub}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Modo Local vs Nube ITSAL */}
          <section className="rounded-xl border border-slate-200 bg-[#FAF8F5] p-3.5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Conexión de datos
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  storageMode === 'offline'
                    ? 'bg-slate-200 text-slate-700'
                    : isCloudSynced
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    storageMode === 'offline'
                      ? 'bg-slate-500'
                      : isCloudSynced
                      ? 'bg-emerald-500'
                      : 'bg-amber-500'
                  }`}
                />
                {storageMode === 'offline'
                  ? 'Modo Local'
                  : isCloudSynced
                  ? 'Nube ITSAL'
                  : 'Respaldo'}
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-700">{envStatusText}</p>

            <div className="grid grid-cols-2 gap-1.5 rounded-lg bg-slate-200/70 p-1">
              <button
                type="button"
                onClick={() => switchStorageMode('offline')}
                className={`flex items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold transition ${
                  storageMode === 'offline'
                    ? 'bg-white text-[#0D2240] shadow-xs'
                    : 'text-slate-600 hover:text-[#0D2240]'
                }`}
              >
                <HardDrive className="h-3.5 w-3.5" />
                <span>Modo Local</span>
              </button>
              <button
                type="button"
                onClick={() => switchStorageMode('online')}
                className={`flex items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold transition ${
                  storageMode === 'online'
                    ? 'bg-[#009FE3] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0D2240]'
                }`}
              >
                <Cloud className="h-3.5 w-3.5" />
                <span>Nube ITSAL</span>
              </button>
            </div>

            {storageMode === 'online' && (
              <button
                type="button"
                disabled={cloudStatus.syncing}
                onClick={syncDemoToCloudAction}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#009FE3]/40 bg-white px-3 py-2 text-xs font-bold text-[#009FE3] transition hover:bg-[#009FE3]/5 disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${cloudStatus.syncing ? 'animate-spin' : ''}`}
                />
                <span>
                  {cloudStatus.syncing
                    ? 'Sincronizando...'
                    : 'Sincronizar datos iniciales a la nube'}
                </span>
              </button>
            )}
          </section>

          {/* Accesos complementarios y restablecimiento seguro */}
          <section className="space-y-1.5">
            {rolePerms.canAccessServerConfig && (
              <button
                type="button"
                onClick={() => {
                  closeRolePanel();
                  goToServerSettings();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <Database className="h-4 w-4 text-[#009FE3]" />
                <span>Configuración Servidor / BD ITSAL</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                closeRolePanel();
                openWelcome();
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <HelpCircle className="h-4 w-4 text-slate-500" />
              <span>Guía rápida ¿Cómo funciona?</span>
            </button>

            <button
              type="button"
              onClick={() => setNotifExpanded((prev) => !prev)}
              className="flex w-full items-center justify-between gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <span className="flex items-center gap-2.5">
                <Bell className="h-4 w-4 text-slate-500" />
                <span>Notificaciones recientes</span>
              </span>
              {notifications.length > 0 && (
                <span className="rounded-full bg-[#009FE3]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#009FE3]">
                  {notifications.length}
                </span>
              )}
            </button>

            {notifExpanded && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2 text-[11px] max-h-44 overflow-y-auto">
                {notifications.slice(0, 3).map((n) => (
                  <div key={n.id} className="border-b border-slate-200 last:border-0 pb-2 last:pb-0">
                    <p className="font-bold text-[#0D2240]">{n.asunto}</p>
                    <p className="text-slate-600 mt-0.5 line-clamp-2">{n.mensaje}</p>
                  </div>
                ))}
              </div>
            )}

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-rose-50 hover:text-rose-700"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Restablecer datos iniciales</span>
              </button>
            ) : (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 space-y-2">
                <p className="text-xs font-semibold text-rose-900">
                  ¿Restablecer los proyectos y postulaciones iniciales?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmReset}
                    className="flex-1 rounded-lg bg-rose-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Pie del cajón: Cerrar sesión */}
        <div className="border-t border-slate-200 px-5 py-3.5">
          <button
            type="button"
            onClick={() => {
              closeRolePanel();
              logout();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
          >
            <LogOut className="h-3.5 w-3.5" />
            Cerrar sesión (ir al Login)
          </button>
        </div>
      </aside>
    </div>
  );

  return createPortal(panelNode, document.body);
}
