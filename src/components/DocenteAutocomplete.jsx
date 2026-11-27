import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Plus,
  Search,
  UserCheck,
  X,
} from 'lucide-react';
import { DOCENTES_ITSAL } from '../data/mockData';

function normalizeText(str = '') {
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[.,;:()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshteinDistance(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const prev = Array.from({ length: b.length + 1 }, (_, idx) => idx);
  for (let i = 1; i <= a.length; i += 1) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const temp = prev[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + cost);
      diag = temp;
    }
  }
  return prev[b.length];
}

function scoreTokenMatch(qToken, targetToken) {
  if (!qToken || !targetToken) return 0;
  if (targetToken === qToken) return 1;
  if (targetToken.startsWith(qToken) && qToken.length >= 2) return 0.92;
  if (targetToken.includes(qToken) && qToken.length >= 3) return 0.84;

  const maxLen = Math.max(qToken.length, targetToken.length);
  if (qToken.length < 3 || Math.abs(qToken.length - targetToken.length) > 4) {
    return 0;
  }

  const dist = levenshteinDistance(qToken, targetToken);
  const ratio = 1 - dist / maxLen;
  return ratio >= 0.55 ? ratio * 0.86 : 0;
}

/**
 * Busca docentes en el catálogo oficial ITSAL tolerando errores leves y ausencia de acentos.
 */
export function searchDocentesFuzzy(query, preferredDepartment = '') {
  const normQuery = normalizeText(query);
  if (!normQuery) {
    return [...DOCENTES_ITSAL].sort((a, b) => {
      const aMatch = a.departamento === preferredDepartment ? -1 : 0;
      const bMatch = b.departamento === preferredDepartment ? -1 : 0;
      return aMatch - bMatch || a.nombre.localeCompare(b.nombre, 'es');
    });
  }

  const qTokens = normQuery.split(' ').filter(Boolean);

  return DOCENTES_ITSAL.map((doc) => {
    const normNombre = normalizeText(doc.nombre);
    const normDepto = normalizeText(doc.departamento);
    if (normNombre.includes(normQuery)) {
      const deptBonus = doc.departamento === preferredDepartment ? 0.05 : 0;
      return { doc, score: 1 + deptBonus };
    }

    const targetTokens = `${normNombre} ${normDepto}`.split(' ').filter(Boolean);
    const tokenScores = qTokens.map((qt) =>
      targetTokens.reduce((best, tt) => Math.max(best, scoreTokenMatch(qt, tt)), 0)
    );

    const minTokenScore = Math.min(...tokenScores);
    const avgScore = tokenScores.reduce((sum, s) => sum + s, 0) / tokenScores.length;
    if (minTokenScore < 0.45 && avgScore < 0.55) {
      return { doc, score: 0 };
    }

    const deptBonus = doc.departamento === preferredDepartment ? 0.04 : 0;
    return { doc, score: avgScore + deptBonus };
  })
    .filter((entry) => entry.score >= 0.52)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.doc);
}

/**
 * Verifica si el nombre capturado coincide exactamente (normalizado) con un docente oficial.
 */
export function findVerifiedDocente(value) {
  const normVal = normalizeText(value);
  if (!normVal) return null;
  return DOCENTES_ITSAL.find((d) => normalizeText(d.nombre) === normVal) || null;
}

/**
 * Valida que un colaborador externo tenga formato legible y no sea texto sin sentido.
 */
export function isSensibleExternalName(raw = '') {
  const cleaned = String(raw).trim().replace(/\s+/g, ' ');
  if (cleaned.length < 5) return false;
  if (/(.)\1{2,}/i.test(cleaned)) return false;

  const norm = normalizeText(cleaned);
  const blockedPatterns = ['asdf', 'qwer', 'zxcv', 'hjkl', 'test', 'prueba', 'xxxx', 'none'];
  if (blockedPatterns.some((pat) => norm.includes(pat))) return false;

  const words = norm.split(' ').filter((w) => /[a-z]{2,}/.test(w));
  if (words.length < 2) return false;

  const meaningfulWords = words.filter(
    (w) => /[aeiou]/.test(w) && /[bcdfghjklmnpqrstvwxyz]/.test(w)
  );
  return meaningfulWords.length >= 2;
}

function parseCollaborators(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function DocenteAutocomplete({
  mode = 'advisor',
  value = '',
  onChange,
  preferredDepartment = '',
  allowExternal = false,
  placeholder = '',
  inputClassName = '',
}) {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [collabQuery, setCollabQuery] = useState('');
  const [touched, setTouched] = useState(false);

  const isCollaboratorMode = mode === 'collaborators';
  const currentSearch = isCollaboratorMode ? collabQuery : value;

  const verifiedAdvisor = useMemo(
    () => (isCollaboratorMode ? null : findVerifiedDocente(value)),
    [isCollaboratorMode, value]
  );

  const selectedCollaborators = useMemo(
    () => (isCollaboratorMode ? parseCollaborators(value) : []),
    [isCollaboratorMode, value]
  );

  const suggestions = useMemo(() => {
    const matches = searchDocentesFuzzy(currentSearch, preferredDepartment);
    if (!isCollaboratorMode) return matches.slice(0, 7);

    const existingSet = new Set(selectedCollaborators.map((c) => normalizeText(c)));
    return matches.filter((doc) => !existingSet.has(normalizeText(doc.nombre))).slice(0, 7);
  }, [currentSearch, preferredDepartment, isCollaboratorMode, selectedCollaborators]);

  useEffect(() => {
    setActiveIndex(0);
  }, [currentSearch, suggestions.length]);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        if (!isCollaboratorMode && String(value).trim()) {
          setTouched(true);
        }
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [isCollaboratorMode, value]);

  const handleSelectDocente = (doc) => {
    if (isCollaboratorMode) {
      const next = [...selectedCollaborators, doc.nombre];
      onChange(next.join(', '));
      setCollabQuery('');
      setIsOpen(false);
      return;
    }

    onChange(doc.nombre);
    setTouched(false);
    setIsOpen(false);
  };

  const handleRemoveCollaborator = (nameToRemove) => {
    const next = selectedCollaborators.filter((item) => item !== nameToRemove);
    onChange(next.join(', '));
  };

  const handleAddExternalCollaborator = () => {
    const trimmed = collabQuery.trim().replace(/\s+/g, ' ');
    if (!allowExternal || !isSensibleExternalName(trimmed)) return;
    const formatted = /\(.*\)/.test(trimmed) ? trimmed : `${trimmed} (Enlace Externo)`;
    const exists = selectedCollaborators.some(
      (c) => normalizeText(c) === normalizeText(formatted)
    );
    if (!exists) {
      onChange([...selectedCollaborators, formatted].join(', '));
    }
    setCollabQuery('');
    setIsOpen(false);
  };

  const canAddExternalOption =
    isCollaboratorMode &&
    allowExternal &&
    collabQuery.trim().length >= 3 &&
    !findVerifiedDocente(collabQuery) &&
    isSensibleExternalName(collabQuery);

  const showExternalGibberishHint =
    isCollaboratorMode &&
    collabQuery.trim().length >= 2 &&
    suggestions.length === 0 &&
    (!allowExternal || !isSensibleExternalName(collabQuery));

  const showAdvisorWarning =
    !isCollaboratorMode &&
    !verifiedAdvisor &&
    ((touched && String(value).trim().length > 0) ||
      (String(value).trim().length >= 3 && !isOpen));

  const handleKeyDown = (e) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setIsOpen(true);
      return;
    }
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setActiveIndex((prev) => (prev + 1) % suggestions.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      }
    } else if (e.key === 'Enter') {
      if (suggestions[activeIndex]) {
        e.preventDefault();
        handleSelectDocente(suggestions[activeIndex]);
      } else if (canAddExternalOption) {
        e.preventDefault();
        handleAddExternalCollaborator();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative space-y-1.5">
      {/* Chips seleccionados para Colaboradores */}
      {isCollaboratorMode && selectedCollaborators.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pb-0.5">
          {selectedCollaborators.map((item) => {
            const isVerifiedInternal = Boolean(findVerifiedDocente(item));
            return (
              <span
                key={item}
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                  isVerifiedInternal
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-sky-200 bg-sky-50 text-[#0D2240]'
                }`}
              >
                {isVerifiedInternal ? (
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                ) : (
                  <Building2 className="h-3 w-3 text-[#009FE3] shrink-0" />
                )}
                <span className="truncate max-w-[210px]">{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCollaborator(item)}
                  aria-label={`Quitar a ${item}`}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-black/10"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Input principal */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          value={currentSearch}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            const nextVal = e.target.value;
            if (isCollaboratorMode) {
              setCollabQuery(nextVal);
            } else {
              onChange(nextVal);
            }
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`${inputClassName} pl-8 ${!isCollaboratorMode && value ? 'pr-8' : 'pr-3'}`}
        />

        {!isCollaboratorMode && value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setTouched(false);
              setIsOpen(true);
            }}
            aria-label="Limpiar asesor"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Estado de validación para Asesor */}
      {!isCollaboratorMode && verifiedAdvisor && (
        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-0.5">
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
            <UserCheck className="h-3 w-3 text-emerald-600" />
            ✓ Docente ITSAL verificado
          </span>
          <span className="text-[10px] font-semibold text-slate-400 truncate">
            {verifiedAdvisor.departamento}
          </span>
        </div>
      )}

      {showAdvisorWarning && (
        <p className="flex items-start gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[11px] font-semibold text-amber-800">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600" />
          <span>
            {suggestions.length > 0
              ? 'Selecciona un docente oficial de la lista desplegable para validar la asesoría.'
              : 'No coincide con el catálogo docente del ITSAL. Elige un asesor de las sugerencias.'}
          </span>
        </p>
      )}

      {/* Aviso amable en Colaboradores para prevenir texto sin sentido */}
      {showExternalGibberishHint && !isOpen && (
        <p className="flex items-start gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[11px] font-semibold text-amber-800">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600" />
          <span>
            {allowExternal
              ? 'Selecciona un docente del ITSAL o escribe nombre y apellido válidos del enlace externo.'
              : 'En proyectos internos, selecciona co-asesores del catálogo de docentes del ITSAL.'}
          </span>
        </p>
      )}

      {/* Lista desplegable de sugerencias */}
      {isOpen && (
        <div className="absolute left-0 z-30 mt-1 min-w-full sm:min-w-[330px] max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl animate-it-enter">
          {suggestions.length > 0 ? (
            <ul role="listbox" className="space-y-0.5">
              {suggestions.map((doc, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <li key={doc.id} role="option" aria-selected={isActive}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectDocente(doc);
                      }}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`w-full rounded-lg px-3 py-2 text-left transition ${
                        isActive ? 'bg-[#009FE3]/10' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-[#0D2240]">
                          {doc.nombre}
                        </span>
                        <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                          {doc.departamento}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-500 truncate">
                        {doc.especialidad}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-3 py-2.5 text-xs text-slate-500">
              No se encontraron docentes con «{currentSearch}».
            </div>
          )}

          {canAddExternalOption && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleAddExternalCollaborator();
              }}
              className="mt-1 flex w-full items-center gap-2 rounded-lg border-t border-slate-100 bg-sky-50/70 px-3 py-2 text-left text-xs font-bold text-[#0D2240] hover:bg-sky-100/80"
            >
              <Plus className="h-3.5 w-3.5 text-[#009FE3] shrink-0" />
              <span className="truncate">
                Agregar colaborador externo: &ldquo;{collabQuery.trim()}&rdquo;
              </span>
            </button>
          )}

          {isCollaboratorMode &&
            collabQuery.trim().length >= 2 &&
            suggestions.length === 0 &&
            !canAddExternalOption && (
              <p className="border-t border-slate-100 px-3 py-2 text-[11px] font-medium text-amber-700">
                {allowExternal
                  ? 'Para colaborador externo, escribe nombre y apellido completos (ej. Ing. Ana Ruiz).'
                  : 'Proyecto interno: selecciona un co-asesor del catálogo ITSAL.'}
              </p>
            )}
        </div>
      )}
    </div>
  );
}
