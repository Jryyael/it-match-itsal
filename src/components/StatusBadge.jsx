import React from 'react';
import { Building2, CheckCircle2, Clock, GraduationCap, ShieldAlert, XCircle } from 'lucide-react';

const STATUS_STYLES = {
  Publicado: {
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: CheckCircle2,
  },
  'Concluido / Liberado': {
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: CheckCircle2,
  },
  'En Revisión Académica': {
    bg: 'bg-amber-50 text-amber-900 border-amber-200',
    icon: Clock,
  },
  'Pendiente de Vinculación': {
    bg: 'bg-sky-50 text-sky-900 border-sky-200',
    icon: ShieldAlert,
  },
  Asignado: {
    bg: 'bg-slate-100 text-[#0D2240] border-slate-300',
    icon: CheckCircle2,
  },
  Rechazado: {
    bg: 'bg-rose-50 text-rose-800 border-rose-200',
    icon: XCircle,
  },
  'Con Observaciones · Corregir': {
    bg: 'bg-rose-50 text-rose-800 border-rose-200',
    icon: XCircle,
  },
};

export function StatusBadge({ estado }) {
  const cfg = STATUS_STYLES[estado] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Clock,
  };
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${cfg.bg}`}
    >
      <Icon className="h-3 w-3" />
      {estado}
    </span>
  );
}

export function OriginBadge({ origen, modalidadLugar }) {
  if (origen === 'Propuesta de Estudiante') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-900">
        <GraduationCap className="h-3 w-3 text-indigo-600" />
        Propuesta de Estudiante{modalidadLugar ? ` · ${modalidadLugar}` : ''}
      </span>
    );
  }
  const isInterno = origen === 'Interno';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
        isInterno
          ? 'border-[#009FE3]/30 bg-[#009FE3]/10 text-[#0D2240]'
          : 'border-[#D99B16]/40 bg-amber-50 text-[#0D2240]'
      }`}
    >
      {isInterno ? (
        <GraduationCap className="h-3 w-3 text-[#009FE3]" />
      ) : (
        <Building2 className="h-3 w-3 text-[#D99B16]" />
      )}
      {isInterno ? 'Interno - Docente ITSAL' : 'Externo - Empresa/Organismo'}
    </span>
  );
}
