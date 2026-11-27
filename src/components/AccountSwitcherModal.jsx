import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  Lock,
  LogOut,
  Mail,
  ShieldCheck,
  UserCheck,
  X,
} from 'lucide-react';
import { DEMO_USERS, useApp } from '../context/AppContext';

export default function AccountSwitcherModal() {
  const {
    accountModalOpen,
    closeAccountModal,
    currentUser,
    loginAsDemo,
    loginWithCredentials,
    logout,
  } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!accountModalOpen) return null;

  const handleManualLogin = (e) => {
    e.preventDefault();
    setError('');
    const res = loginWithCredentials(identifier, password);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setIdentifier('');
    setPassword('');
    closeAccountModal();
  };

  return (
    <div className="no-print fixed inset-0 z-[70] flex items-center justify-center bg-[#0B0F17]/75 p-4 overflow-y-auto backdrop-blur-xs">
      <div className="my-4 w-full max-w-2xl rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl overflow-hidden animate-modal-in">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#0B0F17] px-6 py-4 text-white">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#009FE3]">
              Sesión en este equipo · ITSAL
            </p>
            <h3 className="text-base font-extrabold">
              Cambiar cuenta o iniciar sesión
            </h3>
          </div>
          <button
            type="button"
            onClick={closeAccountModal}
            aria-label="Cerrar selector de cuenta"
            className="rounded-full p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Cuentas rápidas en 1 clic */}
          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Cuentas rápidas para evaluación (1 clic):
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {DEMO_USERS.map((u) => {
                const isActive = currentUser?.id === u.id;
                const Icon =
                  u.roleId === 'estudiante'
                    ? GraduationCap
                    : u.roleId === 'docente'
                    ? FileCheck2
                    : u.roleId === 'jefatura'
                    ? UserCheck
                    : ShieldCheck;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      loginAsDemo(u.id);
                      closeAccountModal();
                    }}
                    className={`flex items-start justify-between gap-2 rounded-xl border p-3.5 text-left transition duration-200 ${
                      isActive
                        ? 'border-[#009FE3] bg-[#009FE3]/5'
                        : 'border-[#E2E8F0] bg-[#FAF8F5] hover:border-[#0D2240] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <Icon
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          isActive ? 'text-[#009FE3]' : 'text-[#0D2240]'
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-[#0D2240] truncate">
                          {u.shortRole}
                        </p>
                        <p className="text-[11px] font-semibold text-slate-600 truncate">
                          {u.nombre}
                        </p>
                        <p className="font-mono text-[10px] text-slate-400 truncate">
                          {u.matricula} · {u.area}
                        </p>
                      </div>
                    </div>
                    {isActive && (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#009FE3]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Acceso manual simulado con correo o matrícula */}
          <form
            onSubmit={handleManualLogin}
            className="rounded-2xl border border-[#E2E8F0] bg-[#FAF8F5] p-4 space-y-3"
          >
            <p className="text-xs font-extrabold text-[#0D2240]">
              Ingresar con correo institucional o matrícula
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Correo @salinacruz.tecnm.mx o matrícula"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2 pl-9 pr-3 text-xs text-[#0D2240] focus:border-[#009FE3] focus:outline-none"
                />
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña institucional"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white py-2 pl-9 pr-3 text-xs text-[#0D2240] focus:border-[#009FE3] focus:outline-none"
                />
              </div>
            </div>

            {error && <p className="text-xs font-bold text-rose-600">{error}</p>}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  closeAccountModal();
                  logout();
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-rose-300 hover:text-rose-700"
              >
                <LogOut className="h-3.5 w-3.5" />
                Cerrar sesión (ir al Login)
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0D2240] px-5 py-2 text-xs font-extrabold text-white transition hover:bg-[#009FE3]"
              >
                Iniciar sesión
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
