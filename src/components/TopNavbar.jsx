import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { ROLE_PERMISSIONS, useApp } from '../context/AppContext';

export function getNavSectionsForRole(currentUser, activeRole, pendingCount = 0) {
  if (!currentUser) {
    return [
      { id: 'inicio', label: 'Inicio' },
      { id: 'como-funciona', label: 'Cómo funciona' },
    ];
  }

  const roleId = currentUser.roleId || activeRole || 'estudiante';

  if (roleId === 'estudiante') {
    return [
      { id: 'inicio', label: 'Inicio' },
      { id: 'banco', label: 'Banco de Proyectos' },
      { id: 'registro', label: 'Proponer mi Proyecto' },
      { id: 'como-funciona', label: 'Cómo funciona' },
    ];
  }

  if (roleId === 'docente') {
    return [
      { id: 'inicio', label: 'Inicio' },
      { id: 'registro', label: 'Registro de Propuestas' },
      { id: 'banco', label: 'Banco de Proyectos' },
      { id: 'como-funciona', label: 'Cómo funciona' },
    ];
  }

  if (roleId === 'jefatura') {
    return [
      { id: 'inicio', label: 'Inicio' },
      { id: 'gestion', label: 'Gestión y Vinculación', badge: pendingCount },
      { id: 'como-funciona', label: 'Cómo funciona' },
    ];
  }

  return [
    { id: 'inicio', label: 'Inicio' },
    { id: 'como-funciona', label: 'Cómo funciona' },
    { id: 'indicadores', label: 'Indicadores' },
  ];
}

const SHORT_ROLE_PILL = {
  estudiante: 'Alumno',
  docente: 'Docente',
  jefatura: 'Jefatura',
  directivo: 'Subdirección',
};

export default function TopNavbar() {
  const {
    currentUser,
    activeRole,
    activeView,
    navigateView,
    openRolePanel,
    openAccountModal,
    projects,
    notifications,
    storageMode,
    cloudStatus,
  } = useApp();

  const pendingCount = projects.filter(
    (p) => p.estado === 'Pendiente de Vinculación' || p.estado === 'En Revisión Académica'
  ).length;

  const navItems = getNavSectionsForRole(currentUser, activeRole, pendingCount);
  const effectiveRoleId = currentUser?.roleId || activeRole || 'estudiante';
  const roleShort = currentUser ? SHORT_ROLE_PILL[effectiveRoleId] || ROLE_PERMISSIONS[effectiveRoleId]?.roleLabel : null;
  const isCloud = storageMode === 'online' && cloudStatus.source === 'cloud' && !cloudStatus.fallbackNotice;

  return (
    <header className="no-print sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xs">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Marca IT Match · clic desliza a Inicio */}
        <button
          type="button"
          onClick={() => navigateView('inicio')}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group"
          title="Ir a Inicio"
        >
          <img
            src="/logo-itmatch.jpg"
            alt="IT Match"
            className="h-8 w-8 rounded-lg object-cover border border-slate-200 transition-transform duration-200 group-hover:scale-105"
          />
          <span className="text-base font-extrabold tracking-tight">
            <span className="text-[#009FE3]">IT</span>{' '}
            <span className="text-[#0D2240]">Match</span>
          </span>
          <span className="hidden sm:inline-block rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-500">
            TecNM ITSAL
          </span>
        </button>

        {/* Enlaces horizontales con indicador activo claro */}
        <nav
          aria-label="Secciones principales"
          className="hidden md:flex items-center gap-1 rounded-xl bg-slate-100/80 p-1"
        >
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateView(item.id)}
                className={`relative inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-[#0D2240] shadow-xs ring-1 ring-slate-200/80'
                    : 'text-slate-600 hover:text-[#0D2240]'
                }`}
              >
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className="rounded-full bg-[#009FE3] px-1.5 py-0.5 font-mono text-[10px] font-bold text-white leading-none">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-[#009FE3]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Píldora del Rol a la derecha (abre panel lateral ligero) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => (currentUser ? openRolePanel() : openAccountModal())}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-[#0D2240] shadow-xs whitespace-nowrap transition-all duration-200 hover:border-[#009FE3] hover:bg-slate-50"
            title="Abrir panel de rol y entorno"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                !currentUser
                  ? 'bg-slate-400'
                  : storageMode === 'offline'
                  ? 'bg-[#009FE3]'
                  : isCloud
                  ? 'bg-emerald-500'
                  : 'bg-amber-500'
              }`}
            />
            <span>{roleShort ? roleShort : 'Iniciar sesión'}</span>
            {notifications.length > 0 && currentUser && (
              <span className="hidden sm:inline-flex items-center gap-0.5 rounded-full bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                <Bell className="h-2.5 w-2.5 text-[#009FE3]" />
                {notifications.length}
              </span>
            )}
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Navegación móvil compacta horizontal */}
      <div className="flex md:hidden items-center gap-1 overflow-x-auto border-t border-slate-100 px-4 py-1.5 bg-white">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigateView(item.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap shrink-0 transition ${
                isActive
                  ? 'bg-[#0D2240] text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-[#0D2240]'
              }`}
            >
              <span>{item.label}</span>
              {item.badge > 0 && (
                <span className="rounded-full bg-[#009FE3] px-1.5 py-0.5 font-mono text-[10px] font-bold text-white leading-none">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
}
