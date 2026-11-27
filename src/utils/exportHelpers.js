/**
 * Exporta la matriz consolidada de proyectos a formato CSV compatible con Excel (UTF-8 con BOM).
 */
export function exportProjectsToCSV(projects, periodoLabel = 'Todos') {
  const headers = [
    'Folio',
    'Periodo',
    'Origen',
    'Institucion / Organismo',
    'Departamento Academico',
    'Perfil Profesional Requerido',
    'Area del Conocimiento',
    'Tipo de Proyecto',
    'Titulo del Proyecto',
    'Asesor del Proyecto',
    'Vo. Bo. Jefatura',
    'Plazas Requeridas',
    'Plazas Ocupadas',
    'Plazas Disponibles',
    'Estado',
    'Canalizado a Vinculacion',
    'Fecha Registro',
  ];

  const escapeCSV = (value) => {
    const str = String(value ?? '').replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = projects.map((p) => {
    const ocupadas = p.alumnosAsignados?.length || 0;
    const requeridas = Number(p.alumnosRequeridos) || 0;
    const disponibles = Math.max(0, requeridas - ocupadas);
    return [
      p.folio,
      p.periodo,
      p.origen === 'Interno' ? 'Interno - Docente ITSAL' : 'Externo - Empresa/Organismo',
      p.institucion,
      p.departamento,
      p.perfilRequerido,
      p.areaConocimiento,
      p.tipoProyecto,
      p.titulo,
      p.asesor,
      p.jefeDepartamento || 'Pendiente',
      requeridas,
      ocupadas,
      disponibles,
      p.estado,
      p.canalizadoVinculacion ? 'Si' : 'No',
      p.fechaRegistro,
    ]
      .map(escapeCSV)
      .join(',');
  });

  const csvContent = '\uFEFF' + [headers.map(escapeCSV).join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const safePeriod = periodoLabel.replace(/[^a-zA-Z0-9_-]+/g, '_');
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `SIBAP_ITSAL_Reporte_SGC_${safePeriod}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
