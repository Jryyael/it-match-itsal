import React from 'react';
import { createPortal } from 'react-dom';
import { Printer, QrCode, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { AREAS_CONOCIMIENTO, TIPOS_PROYECTO } from '../data/mockData';

export default function OfficialFormatModal({ project, onClose }) {
  if (!project) return null;

  const qrPayload = JSON.stringify({
    sistema: 'IT Match · ITSAL',
    folio: project.folio,
    titulo: project.titulo,
    depto: project.departamento,
    asesor: project.asesor,
    estado: project.estado,
    fecha: project.fechaRegistro,
  });

  const handlePrint = () => {
    window.print();
  };

  const modalContent = (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0B0F17]/75 p-2 sm:p-4 overflow-y-auto backdrop-blur-xs print:static print:inset-auto print:block print:overflow-visible print:bg-transparent print:p-0">
      <div className="relative my-4 w-full max-w-4xl rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl animate-modal-in overflow-hidden print:my-0 print:max-w-none print:rounded-none print:border-0 print:shadow-none print:overflow-visible print:animate-none">
        <div className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#0B0F17] px-5 py-3.5 text-white">
          <div className="flex items-center gap-2.5">
            <QrCode className="h-5 w-5 text-[#009FE3]" />
            <div>
              <h3 className="text-sm font-bold">
                Vista Previa Oficial para Impresión / PDF
              </h3>
              <p className="text-xs text-slate-300">
                Folio Verificable: <span className="font-mono text-[#009FE3]">{project.folio}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#009FE3] px-4 py-2 text-xs font-extrabold text-white transition hover:bg-[#0088C6]"
            >
              <Printer className="h-4 w-4" />
              Imprimir / Guardar PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
            >
              <X className="h-4 w-4" />
              Cerrar
            </button>
          </div>
        </div>

        <div className="max-h-[82vh] overflow-y-auto p-4 sm:p-8 print:max-h-none print:overflow-visible print:p-0">
          <div
            id="print-area"
            className="mx-auto bg-white text-slate-900 border border-slate-300 p-6 sm:p-8 text-[12px] leading-snug print:border-0 print:p-0 print:w-full"
          >
            <div className="print-avoid-break flex items-center justify-between border-b-2 border-[#0D2240] pb-3 mb-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border-2 border-[#0D2240] bg-[#0D2240] text-white font-extrabold text-sm">
                  TecNM
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-wider text-[#0D2240] uppercase">
                    Tecnológico Nacional de México
                  </p>
                  <p className="text-sm font-extrabold text-slate-900 uppercase">
                    Instituto Tecnológico de Salina Cruz
                  </p>
                  <p className="text-[11px] font-semibold text-slate-600 uppercase">
                    Formato de Registro de Proyectos para Banco de Proyectos de Residencia Profesional
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="rounded border border-[#0D2240] bg-slate-50 px-3 py-1.5">
                  <p className="text-[10px] font-semibold uppercase text-slate-500">Folio de Registro</p>
                  <p className="font-mono text-xs font-extrabold text-[#0D2240]">{project.folio}</p>
                </div>
                <p className="mt-1 font-mono text-[10px] text-slate-500">
                  Fecha: {project.fechaRegistro} · {project.periodo}
                </p>
              </div>
            </div>

            <table className="w-full border-collapse border border-slate-400 text-[11.5px]">
              <tbody>
                <tr>
                  <td className="w-1/4 border border-slate-400 bg-slate-100 px-2.5 py-1.5 font-bold text-[#0D2240]">
                    ORIGEN DEL PROYECTO:
                  </td>
                  <td className="border border-slate-400 px-2.5 py-1.5" colSpan={3}>
                    <div className="flex flex-wrap gap-6">
                      <span className="inline-flex items-center gap-1.5 font-semibold whitespace-nowrap">
                        <span className="font-mono font-bold">
                          [{project.origen === 'Interno' ? 'X' : ' '}]
                        </span>
                        <span>Interno (Docente ITSAL)</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-semibold whitespace-nowrap">
                        <span className="font-mono font-bold">
                          [{project.origen === 'Externo' ? 'X' : ' '}]
                        </span>
                        <span>Externo (Organismo / Empresa)</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-semibold whitespace-nowrap">
                        <span className="font-mono font-bold">
                          [{project.origen === 'Propuesta de Estudiante' ? 'X' : ' '}]
                        </span>
                        <span>
                          Propuesta de Estudiante
                          {project.modalidadLugar ? ` (${project.modalidadLugar})` : ''}
                        </span>
                      </span>
                    </div>
                    {project.estudianteProponente?.nombre && (
                      <p className="mt-1 text-[11px] font-semibold text-[#0D2240]">
                        Estudiante proponente: {project.estudianteProponente.nombre} · Matrícula:{' '}
                        <span className="font-mono">{project.estudianteProponente.matricula}</span>
                      </p>
                    )}
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-400 bg-slate-100 px-2.5 py-1.5 font-bold text-[#0D2240]">
                    INSTITUCIÓN / EMPRESA:
                  </td>
                  <td className="border border-slate-400 px-2.5 py-1.5 font-semibold" colSpan={3}>
                    {project.institucion}
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-400 bg-slate-100 px-2.5 py-1.5 font-bold text-[#0D2240]">
                    DEPARTAMENTO ACADÉMICO:
                  </td>
                  <td className="border border-slate-400 px-2.5 py-1.5">
                    {project.departamento}
                  </td>
                  <td className="w-1/5 border border-slate-400 bg-slate-100 px-2.5 py-1.5 font-bold text-[#0D2240]">
                    NO. ALUMNOS REQ.:
                  </td>
                  <td className="w-1/6 border border-slate-400 px-2.5 py-1.5 font-mono font-bold text-center">
                    {project.alumnosRequeridos}
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-400 bg-slate-100 px-2.5 py-1.5 font-bold text-[#0D2240]">
                    PERFIL PROFESIONAL REQUERIDO:
                  </td>
                  <td className="border border-slate-400 px-2.5 py-1.5" colSpan={3}>
                    {project.perfilRequerido}
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-400 bg-slate-100 px-2.5 py-1.5 font-bold text-[#0D2240]">
                    ASESOR DEL PROYECTO:
                  </td>
                  <td className="border border-slate-400 px-2.5 py-1.5">
                    {project.asesor}
                  </td>
                  <td className="border border-slate-400 bg-slate-100 px-2.5 py-1.5 font-bold text-[#0D2240]">
                    COLABORADORES:
                  </td>
                  <td className="border border-slate-400 px-2.5 py-1.5">
                    {project.colaboradores || 'N/A'}
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-400 bg-slate-100 px-2.5 py-1.5 font-bold text-[#0D2240]">
                    ÁREA DEL CONOCIMIENTO:
                  </td>
                  <td className="border border-slate-400 px-2.5 py-2" colSpan={3}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-4 gap-y-1.5 gap-x-3 text-[11px]">
                      {AREAS_CONOCIMIENTO.map((area) => (
                        <span key={area} className="inline-flex items-baseline gap-1.5">
                          <span className="font-mono font-bold whitespace-nowrap shrink-0">
                            [{project.areaConocimiento === area ? 'X' : '\u00A0'}]
                          </span>
                          <span className="leading-tight">{area}</span>
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-400 bg-slate-100 px-2.5 py-1.5 font-bold text-[#0D2240]">
                    TÍTULO DEL PROYECTO:
                  </td>
                  <td className="border border-slate-400 px-2.5 py-2 font-bold text-slate-900" colSpan={3}>
                    {project.titulo}
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-400 bg-slate-100 px-2.5 py-1.5 font-bold text-[#0D2240]">
                    TIPO DE PROYECTO:
                  </td>
                  <td className="border border-slate-400 px-2.5 py-1.5" colSpan={3}>
                    <div className="flex flex-wrap gap-6">
                      {TIPOS_PROYECTO.map((tipo) => (
                        <span key={tipo} className="inline-flex items-center gap-1.5 font-semibold whitespace-nowrap">
                          <span className="font-mono font-bold">
                            [{project.tipoProyecto === tipo ? 'X' : '\u00A0'}]
                          </span>
                          <span>{tipo}</span>
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>

                <tr className="print-avoid-break">
                  <td className="border border-slate-400 bg-slate-100 px-2.5 py-1.5 font-bold text-[#0D2240] align-top">
                    OBJETIVO:
                  </td>
                  <td className="border border-slate-400 px-2.5 py-2 leading-relaxed" colSpan={3}>
                    <div className="print-avoid-break">{project.objetivo}</div>
                  </td>
                </tr>

                <tr className="print-avoid-break">
                  <td className="border border-slate-400 bg-slate-100 px-2.5 py-1.5 font-bold text-[#0D2240] align-top">
                    PLANTEAMIENTO DEL PROYECTO (Descripción, elementos y formulación):
                  </td>
                  <td className="border border-slate-400 px-2.5 py-2 leading-relaxed" colSpan={3}>
                    <div className="print-avoid-break">{project.planteamiento}</div>
                  </td>
                </tr>

                <tr className="print-avoid-break">
                  <td className="border border-slate-400 bg-slate-100 px-2.5 py-1.5 font-bold text-[#0D2240] align-top">
                    JUSTIFICACIÓN:
                  </td>
                  <td className="border border-slate-400 px-2.5 py-2 leading-relaxed" colSpan={3}>
                    <div className="print-avoid-break">{project.justificacion}</div>
                  </td>
                </tr>

                <tr className="print-avoid-break">
                  <td className="border border-slate-400 bg-slate-100 px-2.5 py-1.5 font-bold text-[#0D2240] align-top">
                    ALCANCES:
                  </td>
                  <td className="border border-slate-400 px-2.5 py-2 leading-relaxed" colSpan={3}>
                    <div className="print-avoid-break">{project.alcances}</div>
                  </td>
                </tr>

                <tr className="print-avoid-break">
                  <td className="border border-slate-400 bg-slate-100 px-2.5 py-1.5 font-bold text-[#0D2240] align-top">
                    LIMITACIONES Y/O RESTRICCIONES:
                  </td>
                  <td className="border border-slate-400 px-2.5 py-2 leading-relaxed" colSpan={3}>
                    <div className="print-avoid-break">{project.limitaciones}</div>
                  </td>
                </tr>

                <tr className="print-avoid-break">
                  <td className="border border-slate-400 bg-slate-100 px-2.5 py-1.5 font-bold text-[#0D2240] align-top">
                    OBSERVACIONES:
                  </td>
                  <td className="border border-slate-400 px-2.5 py-2 leading-relaxed" colSpan={3}>
                    <div className="print-avoid-break">
                      {project.observaciones || 'Sin observaciones adicionales.'}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="print-avoid-break mt-6 grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 gap-4 items-end border-t border-slate-300 pt-5">
              <div className="text-center px-3">
                <div className="h-12 border-b border-slate-800" />
                <p className="mt-1.5 font-bold text-slate-900">{project.asesor}</p>
                <p className="text-[10px] uppercase tracking-wide text-slate-600">
                  Firma del Asesor del Proyecto
                </p>
              </div>

              <div className="text-center px-3">
                <div className="h-12 border-b border-slate-800" />
                <p className="mt-1.5 font-bold text-slate-900">
                  {project.jefeDepartamento || 'Jefatura de Departamento Académico'}
                </p>
                <p className="text-[10px] uppercase tracking-wide text-slate-600">
                  Vo. Bo. Jefatura de Departamento Académico
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-end gap-3 rounded border border-slate-300 bg-slate-50 p-2.5">
                <QRCodeSVG
                  value={qrPayload}
                  size={74}
                  level="M"
                  bgColor="#FFFFFF"
                  fgColor="#0D2240"
                />
                <div className="text-left text-[10px]">
                  <p className="font-bold text-[#0D2240]">Sello Digital IT Match</p>
                  <p className="font-mono text-slate-700">{project.folio}</p>
                  <p className="text-slate-500 mt-0.5 leading-tight">
                    QR verificable para control SGC-ITSAL
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
