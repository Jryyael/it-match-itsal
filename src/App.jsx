import React from 'react';
import { AppProvider, ROLE_PERMISSIONS, useApp } from './context/AppContext';
import TopNavbar, { getNavSectionsForRole } from './components/TopNavbar';
import RoleDrawerPanel from './components/RoleDrawerPanel';
import ToastBanner from './components/ToastBanner';
import WelcomeModal from './components/WelcomeModal';
import AccountSwitcherModal from './components/AccountSwitcherModal';
import GuidedTourCard from './components/GuidedTourCard';
import MascotAssistant from './components/MascotAssistant';
import LandingView, { ComoFuncionaView } from './views/LandingView';
import LoginView from './views/LoginView';
import BancoProyectosView from './views/BancoProyectosView';
import RegistroPropuestasView from './views/RegistroPropuestasView';
import GestionVinculacionView from './views/GestionVinculacionView';
import IndicadoresSgcView from './views/IndicadoresSgcView';

function MainLayout() {
  const { activeSurface, activeView, activeRole, currentUser, projects } = useApp();

  if (activeSurface === 'login') {
    return (
      <>
        <LoginView />
        <MascotAssistant />
        <ToastBanner />
      </>
    );
  }

  const effectiveRole = currentUser?.roleId || activeRole || 'estudiante';
  const perms = ROLE_PERMISSIONS[effectiveRole] || ROLE_PERMISSIONS.estudiante;
  const pendingCount = projects.filter(
    (p) => p.estado === 'Pendiente de Vinculación' || p.estado === 'En Revisión Académica'
  ).length;

  const slides = getNavSectionsForRole(currentUser, activeRole, pendingCount);
  const safeView =
    !currentUser && (activeView === 'inicio' || activeView === 'como-funciona')
      ? activeView
      : perms.allowedViews.includes(activeView)
      ? activeView
      : perms.defaultView;

  const foundIndex = slides.findIndex((s) => s.id === safeView);
  const activeSlideIndex = foundIndex >= 0 ? foundIndex : 0;

  const renderSlide = (slideId) => {
    switch (slideId) {
      case 'inicio':
        return <LandingView />;
      case 'banco':
        return <BancoProyectosView />;
      case 'registro':
        return <RegistroPropuestasView />;
      case 'gestion':
        return <GestionVinculacionView />;
      case 'indicadores':
        return <IndicadoresSgcView />;
      case 'como-funciona':
        return <ComoFuncionaView />;
      default:
        return <LandingView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-slate-900 print:min-h-0 print:block print:overflow-visible">
      <TopNavbar />

      {/* Pista horizontal fluida sin cambio de layout */}
      <main className="flex-1 w-full overflow-x-hidden">
        <div
          className="flex w-full items-start transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: `translateX(-${activeSlideIndex * 100}%)` }}
        >
          {slides.map((slide, idx) => {
            const isActive = idx === activeSlideIndex;
            return (
              <section
                key={slide.id}
                aria-hidden={!isActive}
                className={`w-full shrink-0 transition-opacity duration-300 ${
                  isActive
                    ? 'opacity-100'
                    : 'max-h-[82vh] overflow-hidden opacity-45 pointer-events-none select-none'
                }`}
              >
                {renderSlide(slide.id)}
              </section>
            );
          })}
        </div>
      </main>

      <footer className="no-print border-t border-slate-200 bg-white py-4 px-6 sm:px-8 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img
              src="/logo-itmatch.jpg"
              alt="IT Match"
              className="h-6 w-6 rounded-md object-cover border border-slate-200"
            />
            <p>
              <strong className="text-[#009FE3]">IT</strong>{' '}
              <strong className="text-[#0D2240]">Match</strong> · Banco Inteligente de Residencias Profesionales · TecNM ITSAL
            </p>
          </div>
          <p className="font-mono text-[11px] font-semibold text-slate-400">
            DISRUPTIC 2026 · Salina Cruz, Oax.
          </p>
        </div>
      </footer>

      <RoleDrawerPanel />
      <WelcomeModal />
      <AccountSwitcherModal />
      <GuidedTourCard />
      <MascotAssistant />
      <ToastBanner />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
