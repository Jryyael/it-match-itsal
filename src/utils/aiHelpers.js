// Motor local de Recomendación IA y Asistente de Redacción Académica ITSAL

const RELATED_CAREERS = {
  'Ing. en Tecnologías de la Información y Comunicaciones': ['Ing. Electrónica', 'Ing. en Gestión Empresarial'],
  'Ing. Electrónica': ['Ing. en Tecnologías de la Información y Comunicaciones', 'Ing. Mecánica'],
  'Ing. Mecánica': ['Ing. Electrónica', 'Ing. en Gestión Empresarial'],
  'Ing. en Gestión Empresarial': ['Ing. en Tecnologías de la Información y Comunicaciones'],
  'Ing. en Acuicultura': ['Ing. Química y Bioquímica'],
};

const SKILL_KEYWORDS = {
  'Desarrollo Web': ['web', 'plataforma', 'react', 'portal', 'sistema web', 'interfaz', 'frontend'],
  'Códigos QR': ['qr', 'código qr', 'códigos qr', 'escaneo', 'asistencia'],
  'Bases de Datos': ['base de datos', 'bases de datos', 'sql', 'almacén', 'registro', 'datos'],
  'Redes': ['red', 'redes', 'lorawan', 'wi-fi', 'conectividad', 'telecomunicaciones', 'telemetría'],
  'IoT': ['iot', 'sensores', 'telemetría', 'monitoreo', 'lorawan', 'nodos'],
  'Automatización': ['automatización', 'automatice', 'control', 'sensor', 'subestación', 'aireadores'],
  'Análisis de Datos': ['analítica', 'análisis', 'métricas', 'kpi', 'indicadores', 'reportes', 'predictiva'],
  'Gestión de Calidad': ['calidad', 'iso', 'sgc', 'estandarización', 'norma', 'auditoría'],
  'Logística Portuaria': ['portuaria', 'puerto', 'corredor interoceánico', 'cadena de suministro', 'inventarios', 'asipona'],
  'Análisis Financiero': ['costo-beneficio', 'financiero', 'inventarios', 'eficiencia'],
  'Manufactura CAD/CAM': ['cad', 'fea', 'modelado', 'manufactura', 'componentes'],
  'Mantenimiento Industrial': ['mantenimiento', 'vibraciones', 'bombeo', 'centrífugo', 'rodamientos', 'planta'],
  'Energía Renovable': ['solar', 'fotovoltaicos', 'energías limpias', 'energía', 'eólicos'],
  'Acuicultura Sustentable': ['acuícola', 'acuicultura', 'tilapia', 'estanques', 'biomasa'],
  'Calidad de Agua': ['calidad de agua', 'oxígeno disuelto', 'ph', 'temperatura', 'estanques'],
  'Seguridad Informática': ['seguridad', 'encriptados', 'autenticación', 'anti-duplicados', 'confidencialidad'],
};

/**
 * Calcula el porcentaje de afinidad y genera una explicación transparente para el estudiante.
 */
export function calcularAfinidadProyecto(project, carreraEstudiante, habilidadesEstudiante = []) {
  let score = 0;
  const razones = [];

  // 1. Afinidad por Carrera / Perfil Profesional (hasta 48 pts)
  if (!carreraEstudiante) {
    score += 25;
  } else if (project.perfilRequerido === carreraEstudiante) {
    score += 48;
    razones.push(`Coincidencia directa con tu perfil (${carreraEstudiante})`);
  } else if (RELATED_CAREERS[carreraEstudiante]?.includes(project.perfilRequerido)) {
    score += 24;
    razones.push(`Perfil interdisciplinario afín (${project.perfilRequerido})`);
  } else {
    score += 8;
  }

  // 2. Afinidad por Habilidades e Intereses (hasta 44 pts)
  const projectText = `${project.titulo} ${project.objetivo} ${project.planteamiento} ${project.alcances}`.toLowerCase();
  const projectSkills = project.habilidades || [];

  const matchedSkills = habilidadesEstudiante.filter((skill) => {
    if (projectSkills.includes(skill)) return true;
    const keywords = SKILL_KEYWORDS[skill] || [skill.toLowerCase()];
    return keywords.some((kw) => projectText.includes(kw));
  });

  if (habilidadesEstudiante.length > 0) {
    const ratio = matchedSkills.length / Math.min(habilidadesEstudiante.length, Math.max(projectSkills.length, 3));
    const skillPoints = Math.min(44, Math.round(ratio * 44));
    score += skillPoints;

    if (matchedSkills.length > 0) {
      razones.push(
        `Dominas ${matchedSkills.length} competencia(s) clave del proyecto: ${matchedSkills.join(', ')}`
      );
    } else {
      razones.push('No se detectaron coincidencias directas con las habilidades seleccionadas');
    }
  } else {
    score += 18;
    razones.push('Selecciona tus habilidades para personalizar la afinidad técnica');
  }

  // 3. Disponibilidad y Tipo de Impacto (hasta 7 pts)
  const plazasDisponibles = Math.max(0, (project.alumnosRequeridos || 1) - (project.alumnosAsignados?.length || 0));
  if (project.estado === 'Publicado' && plazasDisponibles > 0) {
    score += 7;
    razones.push(
      `${project.tipoProyecto} con ${plazasDisponibles} plaza(s) disponible(s) (${project.origen === 'Externo' ? 'vinculación empresarial' : 'proyecto interno ITSAL'})`
    );
  } else if (project.estado === 'Asignado' || plazasDisponibles === 0) {
    score = Math.max(15, score - 12);
    razones.push('Actualmente sin plazas disponibles (proyecto asignado)');
  } else {
    score = Math.max(15, score - 6);
    razones.push(`Estado actual: ${project.estado}`);
  }

  const porcentaje = Math.max(12, Math.min(99, score));
  return {
    porcentaje,
    matchedSkills,
    razones,
  };
}

/**
 * Asistente IA de Redacción y Validación para el Formato Oficial ITSAL.
 */
export function analizarYMejorarPropuesta(formData) {
  const errores = [];
  const advertencias = [];

  const requiredFields = [
    { key: 'origen', label: 'Origen del proyecto (Interno / Externo)' },
    { key: 'institucion', label: 'Institución o Empresa' },
    { key: 'departamento', label: 'Departamento Académico' },
    { key: 'perfilRequerido', label: 'Perfil profesional requerido' },
    { key: 'alumnosRequeridos', label: 'No. de Alumnos requeridos' },
    { key: 'asesor', label: 'Asesor del proyecto' },
    { key: 'areaConocimiento', label: 'Área del conocimiento' },
    { key: 'titulo', label: 'Título del proyecto' },
    { key: 'tipoProyecto', label: 'Tipo de proyecto' },
    { key: 'objetivo', label: 'Objetivo' },
    { key: 'planteamiento', label: 'Planteamiento del proyecto' },
    { key: 'justificacion', label: 'Justificación' },
    { key: 'alcances', label: 'Alcances' },
    { key: 'limitaciones', label: 'Limitaciones y/o Restricciones' },
  ];

  requiredFields.forEach(({ key, label }) => {
    const val = formData[key];
    if (val === undefined || val === null || String(val).trim() === '' || Number(val) === 0) {
      errores.push(`Falta capturar el campo obligatorio: ${label}.`);
    }
  });

  if (formData.titulo && formData.titulo.trim().length < 18) {
    advertencias.push('El título es muy breve; se recomienda especificar el objeto de estudio y contexto tecnológico/empresarial.');
  }
  if (formData.objetivo && formData.objetivo.trim().length < 35) {
    advertencias.push('El Objetivo debe redactarse iniciando con un verbo en infinitivo (ej. Desarrollar, Implementar, Optimizar) e indicar propósito.');
  }
  if (formData.planteamiento && formData.planteamiento.trim().length < 45) {
    advertencias.push('El Planteamiento requiere detallar la problemática actual, sus elementos clave y la formulación de la solución.');
  }
  if (formData.alcances && formData.alcances.trim().length < 35) {
    advertencias.push('Los Alcances deben precisar los entregables tangibles, módulos o cobertura del proyecto.');
  }

  // Mejora académica contextualizada
  const tituloLimpio = (formData.titulo || 'el proyecto propuesto').trim();
  const institucionLimpia = (formData.institucion || 'el Instituto Tecnológico de Salina Cruz').trim();
  const perfilLimpio = (formData.perfilRequerido || 'Residencia Profesional').trim();

  const mejorarObjetivo = (texto) => {
    const base = (texto || '').trim();
    if (!base) {
      return `Diseñar, implementar y validar una solución integral para "${tituloLimpio}" en ${institucionLimpia}, aplicando metodologías propias de ${perfilLimpio} con el fin de optimizar la eficiencia operativa y la calidad de los resultados institucionales.`;
    }
    const iniciaInfinitivo = /^(desarrollar|implementar|diseñar|optimizar|analizar|construir|establecer|automatizar|evaluar|integrar|refinar)/i.test(base);
    const cuerpo = base.charAt(0).toLowerCase() + base.slice(1).replace(/\.+$/, '');
    if (iniciaInfinitivo) {
      return `${base.charAt(0).toUpperCase() + base.slice(1).replace(/\.+$/, '')}, garantizando el cumplimiento de estándares técnicos y académicos aplicables en ${institucionLimpia} dentro del periodo de Residencia Profesional.`;
    }
    return `Implementar y validar la propuesta orientada a ${cuerpo}, mediante herramientas metodológicas de ${perfilLimpio} para fortalecer los procesos de ${institucionLimpia}.`;
  };

  const mejorarPlanteamiento = (texto) => {
    const base = (texto || '').trim();
    if (!base) {
      return `En ${institucionLimpia} se identifica la necesidad de atender la problemática vinculada con ${tituloLimpio}, dado que los mecanismos actuales presentan oportunidades de mejora en trazabilidad, tiempo de respuesta y control operativo. Por ello, se formula una intervención estructurada desde el enfoque de ${perfilLimpio} que integre diagnóstico, diseño metodológico y validación funcional.`;
    }
    const limpio = base.replace(/\.+$/, '');
    return `Descripción de la problemática: ${limpio.charAt(0).toUpperCase() + limpio.slice(1)}. Elementos y formulación: Ante este escenario en ${institucionLimpia}, resulta pertinente formular una solución sistemática fundamentada en ${perfilLimpio} que permita reducir errores operativos, estandarizar el flujo de información y generar evidencia medible de mejora.`;
  };

  const mejorarAlcances = (texto) => {
    const base = (texto || '').trim();
    if (!base) {
      return `El proyecto abarca el levantamiento de requerimientos en ${institucionLimpia}, diseño técnico-metodológico, desarrollo o implementación del prototipo/modelo funcional, pruebas de validación operativa, documentación técnica y entrega de resultados ante la Academia de ${formData.departamento || 'la especialidad'}.`;
    }
    const limpio = base.replace(/\.+$/, '');
    return `${limpio.charAt(0).toUpperCase() + limpio.slice(1)}. Asimismo, contempla la validación funcional en entorno real o controlado, la elaboración de manual técnico/operativo y la entrega formal de evidencia ante el Departamento de ${formData.departamento || 'Adscripción'}.`;
  };

  const sugerencias = {
    objetivo: mejorarObjetivo(formData.objetivo),
    planteamiento: mejorarPlanteamiento(formData.planteamiento),
    alcances: mejorarAlcances(formData.alcances),
  };

  const puntuacionCalidad = Math.max(
    25,
    100 - errores.length * 10 - advertencias.length * 6
  );

  return {
    valido: errores.length === 0,
    errores,
    advertencias,
    sugerencias,
    puntuacionCalidad,
  };
}
