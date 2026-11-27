import React, { useState } from 'react';
import { Check, Copy, Mail, MapPin, MessageCircle } from 'lucide-react';

/**
 * Formatea un teléfono mexicano en enlace https://wa.me/521... con mensaje prellenado.
 */
export function buildWhatsAppUrl(phone = '', projectTitle = '', folio = '') {
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length < 10) return '';

  let normalized = digits;
  if (digits.length === 10) {
    normalized = `521${digits}`;
  } else if (digits.length === 12 && digits.startsWith('52') && !digits.startsWith('521')) {
    normalized = `521${digits.slice(2)}`;
  }

  const msg = `Hola, solicito información sobre el proyecto de Residencia Profesional "${projectTitle}"${
    folio ? ` (${folio})` : ''
  } en IT Match · TecNM ITSAL.`;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(msg)}`;
}

export default function ProjectContactBlock({ project, variant = 'full' }) {
  const [copied, setCopied] = useState(false);

  if (!project) return null;

  const correo = (project.correoContacto || '').trim();
  const whatsapp = (project.whatsappContacto || '').trim();
  const ubicacion = (project.ubicacionContacto || '').trim();

  if (!correo && !whatsapp && !ubicacion) return null;

  const waUrl = buildWhatsAppUrl(whatsapp, project.titulo, project.folio);

  const handleCopyEmail = async (e) => {
    e?.stopPropagation();
    if (!correo) return;
    try {
      await navigator.clipboard.writeText(correo);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback silencioso si el portapapeles no está disponible
    }
  };

  if (variant === 'compact') {
    return (
      <div className="mt-3 rounded-lg border border-slate-200/80 bg-[#FAF8F5] px-3 py-2 space-y-1.5 text-[11px]">
        {ubicacion && (
          <p className="flex items-center gap-1.5 text-slate-600 truncate" title={ubicacion}>
            <MapPin className="h-3 w-3 shrink-0 text-[#009FE3]" />
            <span className="truncate">{ubicacion}</span>
          </p>
        )}
        <div className="flex flex-wrap items-center gap-1.5">
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white transition hover:bg-emerald-700"
            >
              <MessageCircle className="h-3 w-3" />
              WhatsApp
            </a>
          )}
          {correo && (
            <div className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700 max-w-full">
              <a
                href={`mailto:${correo}?subject=${encodeURIComponent(
                  `Consulta Residencia ${project.folio || ''} - ${project.titulo || ''}`
                )}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 hover:text-[#009FE3] truncate max-w-[155px]"
                title={correo}
              >
                <Mail className="h-3 w-3 shrink-0 text-[#009FE3]" />
                <span className="truncate">{correo}</span>
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                title="Copiar correo"
                className="ml-0.5 text-slate-400 hover:text-[#0D2240]"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#009FE3]">
          Contacto directo del responsable
        </p>
        <p className="text-xs font-bold text-[#0D2240] mt-0.5">
          {project.asesor || 'Asesor del Proyecto'}
        </p>
      </div>

      {ubicacion && (
        <div className="flex items-start gap-2 text-xs text-slate-600">
          <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#009FE3]" />
          <span>{ubicacion}</span>
        </div>
      )}

      {correo && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
          <a
            href={`mailto:${correo}?subject=${encodeURIComponent(
              `Consulta Residencia ${project.folio || ''} - ${project.titulo || ''}`
            )}`}
            className="inline-flex items-center gap-1.5 font-semibold text-slate-800 hover:text-[#009FE3] min-w-0 truncate"
          >
            <Mail className="h-3.5 w-3.5 shrink-0 text-[#009FE3]" />
            <span className="truncate">{correo}</span>
          </a>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 hover:border-[#009FE3] hover:text-[#009FE3]"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-600" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copiar
              </>
            )}
          </button>
        </div>
      )}

      {waUrl && (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-extrabold text-white transition hover:bg-emerald-700"
        >
          <MessageCircle className="h-4 w-4" />
          Escribir por WhatsApp ({whatsapp})
        </a>
      )}
    </div>
  );
}
