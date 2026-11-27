export const CARRERAS_ITSAL = [
  'Ing. en Tecnologías de la Información y Comunicaciones',
  'Ing. en Gestión Empresarial',
  'Ing. Mecánica',
  'Ing. Electrónica',
  'Ing. en Acuicultura',
];

export const DEPARTAMENTOS_ITSAL = [
  'Ing. Eléctrica y Electrónica',
  'Sistemas y Computación',
  'Ciencias Económico-Administrativas',
  'Metal-Mecánica',
  'Ing. Química y Bioquímica',
];

export const DOCENTES_ITSAL = [
  {
    id: 'doc-01',
    nombre: 'Ing. Alfonso Miguel Escobar',
    departamento: 'Ing. Eléctrica y Electrónica',
    especialidad: 'Desarrollo Web, Códigos QR y Seguridad Informática',
  },
  {
    id: 'doc-02',
    nombre: 'Ing. Anita del Carmen Morales Cruz',
    departamento: 'Ing. Eléctrica y Electrónica',
    especialidad: 'Telecomunicaciones, Redes y Vinculación Académica',
  },
  {
    id: 'doc-03',
    nombre: 'M.T.I. Luis Fernando Toledo Castellanos',
    departamento: 'Sistemas y Computación',
    especialidad: 'Ingeniería de Software, Bases de Datos y Calidad',
  },
  {
    id: 'doc-04',
    nombre: 'M.T.I. Alejandro Cruz Pineda',
    departamento: 'Sistemas y Computación',
    especialidad: 'Arquitectura Web y Analítica de Datos',
  },
  {
    id: 'doc-05',
    nombre: 'M.S.C. Paola Jiménez Carrasco',
    departamento: 'Sistemas y Computación',
    especialidad: 'Inteligencia Artificial y Ciencia de Datos',
  },
  {
    id: 'doc-06',
    nombre: 'M.C. Eduardo Morales Gutiérrez',
    departamento: 'Ing. Eléctrica y Electrónica',
    especialidad: 'Telemetría LoRaWAN, IoT y Energías Renovables',
  },
  {
    id: 'doc-07',
    nombre: 'Ing. Julio César Osorio Castillejos',
    departamento: 'Ing. Eléctrica y Electrónica',
    especialidad: 'Automatización Industrial y Sistemas Fotovoltaicos',
  },
  {
    id: 'doc-08',
    nombre: 'Ing. Roberto Morales Chiñas',
    departamento: 'Ing. Eléctrica y Electrónica',
    especialidad: 'Electrónica de Potencia y Diagnóstico Energético',
  },
  {
    id: 'doc-09',
    nombre: 'Dr. Humberto Enríquez Salinas',
    departamento: 'Ing. Química y Bioquímica',
    especialidad: 'Acuicultura Sustentable y Calidad Fisicoquímica de Agua',
  },
  {
    id: 'doc-10',
    nombre: 'M.C. Patricia Ordóñez Ramírez',
    departamento: 'Ing. Química y Bioquímica',
    especialidad: 'Biotecnología y Monitoreo Ambiental',
  },
  {
    id: 'doc-11',
    nombre: 'M.A. Carmen Elena Ríos Villalobos',
    departamento: 'Ciencias Económico-Administrativas',
    especialidad: 'Logística Portuaria y Cadena de Suministro',
  },
  {
    id: 'doc-12',
    nombre: 'M.G.E. Jorge Alberto Pinacho',
    departamento: 'Ciencias Económico-Administrativas',
    especialidad: 'Gestión de Calidad ISO 9001 y Finanzas',
  },
  {
    id: 'doc-13',
    nombre: 'M.I. Sergio Iván Villalobos Cruz',
    departamento: 'Metal-Mecánica',
    especialidad: 'Mantenimiento Predictivo y Análisis de Vibraciones',
  },
  {
    id: 'doc-14',
    nombre: 'Ing. Roberto Carlos Jiménez',
    departamento: 'Metal-Mecánica',
    especialidad: 'Manufactura CAD/CAM y Sistemas de Bombeo',
  },
];

export const AREAS_CONOCIMIENTO = [
  'Ciencias naturales',
  'Ciencias químico-biológicas',
  'Ciencias de la tierra',
  'Ingeniería y Tecnología',
  'Ciencias agronómicas',
  'Ciencias del mar',
  'Ciencias económico-administrativas',
  'Otra',
];

export const TIPOS_PROYECTO = ['Básico', 'Aplicado', 'Desarrollo Tecnológico'];

export const PERIODOS = [
  'Enero - Junio 2026',
  'Agosto - Diciembre 2026',
];

export const HABILIDADES_CATALOGO = [
  'Desarrollo Web',
  'Códigos QR',
  'Bases de Datos',
  'Redes',
  'IoT',
  'Automatización',
  'Análisis de Datos',
  'Gestión de Calidad',
  'Logística Portuaria',
  'Análisis Financiero',
  'Manufactura CAD/CAM',
  'Mantenimiento Industrial',
  'Energía Renovable',
  'Acuicultura Sustentable',
  'Calidad de Agua',
  'Seguridad Informática',
];

export const DEMO_PROJECT_PHOTOS = [
  { id: 'qr', label: 'Laboratorio TIC / Códigos QR', url: '/projects/proj-001.jpg' },
  { id: 'acuicultura', label: 'Estanques Acuicultura IoT', url: '/projects/proj-002.jpg' },
  { id: 'puerto', label: 'Terminal Portuaria Salina Cruz', url: '/projects/proj-003.jpg' },
  { id: 'mecanica', label: 'Planta Industrial / Bombeo', url: '/projects/proj-004.jpg' },
  { id: 'electronica', label: 'Laboratorio Electrónica y Solar', url: '/projects/proj-005.jpg' },
  { id: 'analitica', label: 'Centro de Innovación y Datos', url: '/projects/proj-006.jpg' },
];

export const INITIAL_PROJECTS = [
  {
    id: 'proj-001',
    folio: 'ITSAL-RP-2026-001',
    imagenUrl: '/projects/proj-001.jpg',
    origen: 'Interno',
    institucion: 'INSTITUTO TECNOLÓGICO DE SALINA CRUZ',
    departamento: 'Ing. Eléctrica y Electrónica',
    perfilRequerido: 'Ing. en Tecnologías de la Información y Comunicaciones',
    alumnosRequeridos: 2,
    alumnosAsignados: [],
    asesor: 'Ing. Alfonso Miguel Escobar',
    colaboradores: 'M.T.I. Luis Fernando Toledo Castellanos',
    jefeDepartamento: 'Ing. Anita del Carmen Morales Cruz',
    areaConocimiento: 'Ingeniería y Tecnología',
    titulo:
      'Implementación y Refinamiento de un Sistema Web para la Gestión de Asistencia a Eventos Académicos mediante Códigos QR',
    tipoProyecto: 'Desarrollo Tecnológico',
    estado: 'Publicado',
    periodo: 'Enero - Junio 2026',
    fechaRegistro: '2026-01-18',
    habilidades: ['Desarrollo Web', 'Códigos QR', 'Bases de Datos', 'Seguridad Informática', 'Análisis de Datos'],
    objetivo:
      'Desarrollar, implementar y refinar una plataforma web responsiva que automatice el registro, validación y generación de reportes de asistencia estudiantil y docente a eventos académicos institucionales del ITSAL mediante la lectura de códigos QR únicos y verificables.',
    planteamiento:
      'Actualmente, el control de asistencia en congresos, conferencias, jornadas académicas y actividades complementarias del Instituto Tecnológico de Salina Cruz se realiza mediante listas impresas o formularios manuales, lo que genera retrasos en el acceso, errores de transcripción, duplicidad de registros y demora en la emisión de constancias. Se requiere una arquitectura web escalable con generación dinámica de pases QR por participante, escaneo en tiempo real desde dispositivos móviles y un panel administrativo para la emisión inmediata de métricas y constancias digitales.',
    justificacion:
      'La transformación digital de los procesos académicos del TecNM campus Salina Cruz reduce tiempos operativos hasta en un 80%, elimina el consumo innecesario de papel, fortalece la trazabilidad de créditos complementarios y brinda información confiable para las auditorías del Sistema de Gestión de la Calidad (SGC).',
    alcances:
      'Incluye módulo de registro y autenticación institucional, generación automática de códigos QR encriptados por evento, lector QR desde navegador web móvil sin app nativa, tablero de monitoreo en tiempo real, validación anti-duplicados y exportación de listas oficiales en PDF y Excel.',
    limitaciones:
      'El escaneo en tiempo real requiere conectividad Wi-Fi o datos móviles en los auditorios del plantel; la integración directa con el Sistema Integral de Información (SII) se realizará mediante exportación estructurada en CSV en esta primera fase.',
    observaciones:
      'Proyecto prioritario aprobado por la Academia de Ingeniería en Tecnologías de la Información y Comunicaciones para el periodo Enero - Junio 2026.',
    observacionesAcademia: 'Aprobado en reunión ordinaria de academia. Cumple con pertinencia curricular para 2 residentes.',
    observacionesVinculacion: 'Validado como proyecto interno de impacto institucional.',
    canalizadoVinculacion: false,
  },
  {
    id: 'proj-002',
    folio: 'ITSAL-RP-2026-002',
    imagenUrl: '/projects/proj-002.jpg',
    origen: 'Externo',
    institucion: 'Granja Acuícola Bahía La Ventosa S.P.R. de R.L.',
    departamento: 'Ing. Química y Bioquímica',
    perfilRequerido: 'Ing. en Acuicultura',
    alumnosRequeridos: 2,
    alumnosAsignados: [
      {
        nombre: 'Valeria Méndez Ortiz',
        noControl: '211050031',
        carrera: 'Ing. en Acuicultura',
        fechaAsignacion: '2026-02-05',
      },
    ],
    asesor: 'Dr. Humberto Enríquez Salinas',
    colaboradores: 'Biol. Mar. Sofía Velázquez Ordaz (Asesor Externo)',
    jefeDepartamento: 'M.C. Patricia Ordóñez Ramírez',
    areaConocimiento: 'Ciencias del mar',
    titulo:
      'Sistema IoT de Monitoreo Multiparamétrico de Calidad de Agua en Estanques de Cultivo de Tilapia',
    tipoProyecto: 'Desarrollo Tecnológico',
    estado: 'Publicado',
    periodo: 'Enero - Junio 2026',
    fechaRegistro: '2026-01-22',
    habilidades: ['IoT', 'Calidad de Agua', 'Acuicultura Sustentable', 'Análisis de Datos', 'Automatización'],
    objetivo:
      'Implementar un sistema de monitoreo continuo basado en sensores de oxígeno disuelto, temperatura y pH conectados mediante telemetría IoT para optimizar la supervivencia y tasa de crecimiento en estanques de cultivo acuícola en la región de Salina Cruz.',
    planteamiento:
      'Las variaciones bruscas de temperatura y la caída nocturna de oxígeno disuelto en granjas acuícolas del Istmo de Tehuantepec ocasionan mortalidad de biomasa y pérdidas económicas. El monitoreo manual dos veces al día resulta insuficiente para detectar anomalías críticas oportunamente.',
    justificacion:
      'Contribuir a la sostenibilidad productiva del sector acuícola local mediante tecnología accesible de alerta temprana que permita activar aireadores de manera oportuna y reducir desperdicio de alimento balanceado.',
    alcances:
      'Calibración de nodos de sensores en 4 estanques piloto, registro histórico en nube/local, alertas tempranas por umbral crítico y manual de operación para técnicos acuícolas.',
    limitaciones:
      'El mantenimiento preventivo y limpieza de sondas deberá realizarse semanalmente por personal de la granja debido a la bioincrustación.',
    observaciones: 'La empresa proporciona acceso a estanques piloto y alimentación durante las jornadas de campo.',
    observacionesAcademia: 'Pertinente para líneas de investigación en acuicultura sustentable.',
    observacionesVinculacion: 'Convenio de colaboración vigente verificado por Gestión Tecnológica y Vinculación.',
    canalizadoVinculacion: true,
  },
  {
    id: 'proj-003',
    folio: 'ITSAL-RP-2026-003',
    imagenUrl: '/projects/proj-003.jpg',
    origen: 'Externo',
    institucion: 'ASIPONA Salina Cruz (Administración del Sistema Portuario Nacional)',
    departamento: 'Ciencias Económico-Administrativas',
    perfilRequerido: 'Ing. en Gestión Empresarial',
    alumnosRequeridos: 2,
    alumnosAsignados: [],
    asesor: 'M.A. Carmen Elena Ríos Villalobos',
    colaboradores: 'Lic. Ricardo Matus López (Enlace ASIPONA)',
    jefeDepartamento: 'M.G.E. Jorge Alberto Pinacho',
    areaConocimiento: 'Ciencias económico-administrativas',
    titulo:
      'Optimización de la Cadena de Suministro y Control de Inventarios para Logística Portuaria en el Corredor Interoceánico',
    tipoProyecto: 'Aplicado',
    estado: 'Publicado',
    periodo: 'Enero - Junio 2026',
    fechaRegistro: '2026-01-25',
    habilidades: ['Logística Portuaria', 'Gestión de Calidad', 'Análisis Financiero', 'Bases de Datos', 'Análisis de Datos'],
    objetivo:
      'Diseñar e implementar un modelo de control de inventarios y trazabilidad de insumos operativos que reduzca tiempos de despacho y mejore los indicadores de eficiencia logística en terminales portuarias vinculadas al Corredor Interoceánico.',
    planteamiento:
      'Ante el incremento de operaciones de carga y proyectos estratégicos en el Puerto de Salina Cruz, los procesos actuales de clasificación ABC, reorden y conciliación de almacenes requieren estandarización bajo indicadores clave de desempeño (KPIs) alineados a normas ISO 9001.',
    justificacion:
      'Fortalece la competitividad regional del Istmo de Tehuantepec e inserta a estudiantes de Ingeniería en Gestión Empresarial en un entorno real de logística portuaria de alto impacto nacional.',
    alcances:
      'Diagnóstico situacional de almacén, reingeniería de flujos de entrada/salida, tablero de KPIs logísticos, análisis costo-beneficio y guía de estandarización operativa.',
    limitaciones:
      'El acceso a datos financieros confidenciales estará sujeto a acuerdos de confidencialidad y anonimización de cifras sensibles.',
    observaciones: 'Se requiere disponibilidad de horario matutino y cumplimiento estricto de lineamientos de seguridad portuaria.',
    observacionesAcademia: 'Aprobado por Academia de Ciencias Económico-Administrativas.',
    observacionesVinculacion: 'Validado por División de Estudios Profesionales y Vinculación.',
    canalizadoVinculacion: false,
  },
  {
    id: 'proj-004',
    folio: 'ITSAL-RP-2026-004',
    imagenUrl: '/projects/proj-004.jpg',
    origen: 'Externo',
    institucion: 'PEMEX Refinería "Ing. Antonio Dovalí Jaime"',
    departamento: 'Metal-Mecánica',
    perfilRequerido: 'Ing. Mecánica',
    alumnosRequeridos: 2,
    alumnosAsignados: [
      {
        nombre: 'Diego Armando Santiago Cruz',
        noControl: '211040018',
        carrera: 'Ing. Mecánica',
        fechaAsignacion: '2026-02-02',
      },
      {
        nombre: 'Kevin Yahir Fuentes Morales',
        noControl: '211040042',
        carrera: 'Ing. Mecánica',
        fechaAsignacion: '2026-02-02',
      },
    ],
    asesor: 'M.I. Sergio Iván Villalobos Cruz',
    colaboradores: 'Ing. Héctor Gallegos Méndez (Superintendente de Mantenimiento)',
    jefeDepartamento: 'Ing. Roberto Carlos Jiménez',
    areaConocimiento: 'Ingeniería y Tecnología',
    titulo:
      'Diseño y Simulación de Mantenimiento Predictivo en Sistemas de Bombeo Centrífugo mediante Análisis de Vibraciones',
    tipoProyecto: 'Aplicado',
    estado: 'Asignado',
    periodo: 'Enero - Junio 2026',
    fechaRegistro: '2026-01-12',
    habilidades: ['Mantenimiento Industrial', 'Manufactura CAD/CAM', 'Gestión de Calidad', 'Análisis de Datos'],
    objetivo:
      'Establecer un protocolo de mantenimiento predictivo basado en análisis espectral de vibraciones y modelado CAD/FEA para detectar fallas incipientes en rodamientos y desalineación de bombas centrífugas de proceso.',
    planteamiento:
      'Los paros no programados en trenes de bombeo generan elevados costos de mantenimiento correctivo y riesgos operativos. Implementar umbrales predictivos bajo norma ISO 10816 permite anticipar intervenciones antes de una falla catastrófica.',
    justificacion:
      'Incrementa la confiabilidad mecánica de equipos rotativos críticos y fomenta el dominio práctico de estándares industriales en los futuros ingenieros mecánicos del ITSAL.',
    alcances:
      'Levantamiento de línea base de vibraciones en 6 equipos, modelado de componentes críticos, matriz de criticidad y plan maestro de mantenimiento predictivo.',
    limitaciones:
      'Las mediciones en planta estarán condicionadas a permisos de trabajo con riesgo y acompañamiento del supervisor de área.',
    observaciones: 'Plazas cubiertas al 100%. Proyecto canalizado formalmente con carta de presentación emitida.',
    observacionesAcademia: 'Aprobado y asignado en primera sesión de academia.',
    observacionesVinculacion: 'Expediente completo y canalizado a Gestión Tecnológica y Vinculación.',
    canalizadoVinculacion: true,
  },
  {
    id: 'proj-005',
    folio: 'ITSAL-RP-2026-005',
    imagenUrl: '/projects/proj-005.jpg',
    origen: 'Interno',
    institucion: 'INSTITUTO TECNOLÓGICO DE SALINA CRUZ',
    departamento: 'Ing. Eléctrica y Electrónica',
    perfilRequerido: 'Ing. Electrónica',
    alumnosRequeridos: 2,
    alumnosAsignados: [],
    asesor: 'M.C. Eduardo Morales Gutiérrez',
    colaboradores: 'Ing. Julio César Osorio Castillejos',
    jefeDepartamento: 'Ing. Anita del Carmen Morales Cruz',
    areaConocimiento: 'Ingeniería y Tecnología',
    titulo:
      'Prototipo de Red de Telemetría LoRaWAN y Automatización Solar para Subestaciones de Baja Tensión',
    tipoProyecto: 'Básico',
    estado: 'En Revisión Académica',
    periodo: 'Enero - Junio 2026',
    fechaRegistro: '2026-02-08',
    habilidades: ['IoT', 'Redes', 'Automatización', 'Energía Renovable', 'Desarrollo Web'],
    objetivo:
      'Diseñar y validar a nivel laboratorio un prototipo de red de telemetría de largo alcance y bajo consumo energético alimentada con paneles fotovoltaicos para monitorear variables eléctricas en tiempo real.',
    planteamiento:
      'En zonas rurales y parques eólicos o solares del Istmo, la infraestructura cableada para monitoreo de tableros de distribución es costosa y vulnerable a fallas ambientales. Una topología LoRaWAN autónoma permite transmitir voltaje, corriente y factor de potencia de forma inalámbrica.',
    justificacion:
      'Impulsa la investigación aplicada en energías limpias y telecomunicaciones dentro del laboratorio de Electrónica del ITSAL.',
    alcances:
      'Diseño de PCB prototipo, pruebas de enlace a 1.5 km en campo abierto, tablero web de visualización y caracterización de consumo energético del nodo.',
    limitaciones:
      'El alcance experimental se circunscribe a mediciones en baja tensión con transformadores de corriente no invasivos.',
    observaciones: 'Pendiente de dictamen en la próxima Reunión de Academia de Ingeniería Electrónica.',
    observacionesAcademia: '',
    observacionesVinculacion: '',
    canalizadoVinculacion: false,
  },
  {
    id: 'proj-006',
    folio: 'ITSAL-RP-2026-006',
    imagenUrl: '/projects/proj-006.jpg',
    origen: 'Externo',
    institucion: 'CANACO SERVYTUR Salina Cruz',
    departamento: 'Sistemas y Computación',
    perfilRequerido: 'Ing. en Tecnologías de la Información y Comunicaciones',
    alumnosRequeridos: 1,
    alumnosAsignados: [],
    asesor: 'M.S.C. Paola Jiménez Carrasco',
    colaboradores: 'Lic. Diana Laura Toledo (Coordinadora CANACO)',
    jefeDepartamento: 'M.T.I. Alejandro Cruz Pineda',
    areaConocimiento: 'Ingeniería y Tecnología',
    titulo:
      'Plataforma Web con Analítica Predictiva para Seguimiento de Egresados y Vinculación Empresarial del Istmo',
    tipoProyecto: 'Desarrollo Tecnológico',
    estado: 'Pendiente de Vinculación',
    periodo: 'Agosto - Diciembre 2026',
    fechaRegistro: '2026-02-14',
    habilidades: ['Desarrollo Web', 'Bases de Datos', 'Análisis de Datos', 'Códigos QR', 'Redes'],
    objetivo:
      'Construir una plataforma web colaborativa que conecte perfiles de egresados y residentes del ITSAL con vacantes de empresas afiliadas a CANACO Salina Cruz, integrando métricas de empleabilidad y demanda laboral.',
    planteamiento:
      'Las empresas locales desconocen la disponibilidad de talento especializado egresado del Tecnológico, mientras que la institución requiere automatizar encuestas de seguimiento y medir la pertinencia de sus planes de estudio.',
    justificacion:
      'Acelera la inserción laboral regional en el contexto de crecimiento económico del Corredor Interoceánico del Istmo de Tehuantepec.',
    alcances:
      'Portal de vacantes, perfiles verificables mediante código QR, módulo de encuestas automatizadas y reportes ejecutivos de empleabilidad.',
    limitaciones:
      'La publicación de vacantes dependerá de la validación previa de empresas formalmente afiliadas a la cámara empresarial.',
    observaciones: 'Propuesta recién ingresada por organismo externo; requiere validación de Gestión Tecnológica y Vinculación antes de su publicación.',
    observacionesAcademia: '',
    observacionesVinculacion: '',
    canalizadoVinculacion: false,
  },
];

export const INITIAL_APPLICATIONS = [
  {
    id: 'app-001',
    projectId: 'proj-001',
    projectFolio: 'ITSAL-RP-2026-001',
    projectTitle:
      'Implementación y Refinamiento de un Sistema Web para la Gestión de Asistencia a Eventos Académicos mediante Códigos QR',
    estudianteNombre: 'Carlos Eduardo Sosa Ramírez',
    noControl: '211020112',
    carrera: 'Ing. en Tecnologías de la Información y Comunicaciones',
    semestre: '9° Semestre',
    promedio: '91.4',
    habilidades: ['Desarrollo Web', 'Códigos QR', 'Bases de Datos'],
    motivacion:
      'He desarrollado aplicaciones web con React y Node.js en proyectos integradores y me interesa optimizar el control de eventos del ITSAL.',
    fechaPostulacion: '2026-02-10',
    estado: 'En Revisión de Academia',
    esDemoUsuario: false,
  },
  {
    id: 'app-002',
    projectId: 'proj-002',
    projectFolio: 'ITSAL-RP-2026-002',
    projectTitle:
      'Sistema IoT de Monitoreo Multiparamétrico de Calidad de Agua en Estanques de Cultivo de Tilapia',
    estudianteNombre: 'Valeria Méndez Ortiz',
    noControl: '211050031',
    carrera: 'Ing. en Acuicultura',
    semestre: '9° Semestre',
    promedio: '94.2',
    habilidades: ['Calidad de Agua', 'Acuicultura Sustentable', 'IoT'],
    motivacion: 'Cuento con experiencia en muestreo físico-químico en estanques de tilapia y manejo de parámetros biológicos.',
    fechaPostulacion: '2026-02-01',
    estado: 'Canalizado a Vinculación',
    esDemoUsuario: false,
  },
  {
    id: 'app-003',
    projectId: 'proj-003',
    projectFolio: 'ITSAL-RP-2026-003',
    projectTitle:
      'Optimización de la Cadena de Suministro y Control de Inventarios para Logística Portuaria en el Corredor Interoceánico',
    estudianteNombre: 'Andrea Guadalupe Toledo',
    noControl: '211020074',
    carrera: 'Ing. en Tecnologías de la Información y Comunicaciones',
    semestre: '9° Semestre',
    promedio: '93.8',
    habilidades: ['Desarrollo Web', 'Bases de Datos', 'Análisis de Datos', 'Gestión de Calidad'],
    motivacion:
      'Me interesa aportar soluciones digitales de bases de datos y tableros KPI para apoyar la logística portuaria en Salina Cruz.',
    fechaPostulacion: '2026-02-11',
    estado: 'En Revisión de Academia',
    esDemoUsuario: true,
  },
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-001',
    canal: 'Correo Institucional + WhatsApp',
    destinatario: 'Gestión Tecnológica y Vinculación / PEMEX Refinería',
    asunto: 'Canalización Formalizada: ITSAL-RP-2026-004',
    mensaje:
      'Se formalizó la asignación de 2 residentes de Ing. Mecánica al proyecto "Diseño y Simulación de Mantenimiento Predictivo en Sistemas de Bombeo Centrífugo". Carta de presentación lista para firma.',
    fecha: '2026-02-02 11:35',
  },
  {
    id: 'notif-002',
    canal: 'Correo Institucional',
    destinatario: 'Granja Acuícola Bahía La Ventosa / Valeria Méndez Ortiz',
    asunto: 'Canalización a Vinculación: ITSAL-RP-2026-002',
    mensaje:
      'La Academia de Ing. Química y Bioquímica aprobó la asignación de Valeria Méndez Ortiz (211050031). Se notificó a Vinculación para trámite de convenio específico.',
    fecha: '2026-02-05 16:10',
  },
];

export const DEMO_STUDENT_PROFILE = {
  nombre: 'Andrea Guadalupe Toledo',
  noControl: '211020074',
  carrera: 'Ing. en Tecnologías de la Información y Comunicaciones',
  semestre: '9° Semestre',
  promedio: '93.8',
  correo: 'l211020074@salinacruz.tecnm.mx',
};

export const COMPLETED_RESIDENCIA_CASES = [
  {
    id: 'comp-001',
    folio: 'ITSAL-RP-2025-084',
    bearPose: 5,
    imagenUrl: '/projects/proj-001.jpg',
    origen: 'Interno',
    institucion: 'División de Estudios Profesionales · TecNM ITSAL',
    departamento: 'Sistemas y Computación',
    perfilRequerido: 'Ing. en Tecnologías de la Información y Comunicaciones',
    alumnosRequeridos: 2,
    alumnosAsignados: [
      {
        nombre: 'Sofía Hernández Castro',
        noControl: '201020045',
        carrera: 'Ing. en Tecnologías de la Información y Comunicaciones',
        fechaAsignacion: '2025-08-22',
      },
      {
        nombre: 'Luis Ángel Pineda López',
        noControl: '201020089',
        carrera: 'Ing. en Tecnologías de la Información y Comunicaciones',
        fechaAsignacion: '2025-08-22',
      },
    ],
    asesor: 'Ing. Alfonso Miguel Escobar',
    colaboradores: 'M.T.I. Alejandro Cruz Pineda',
    jefeDepartamento: 'M.T.I. Alejandro Cruz Pineda',
    areaConocimiento: 'Ingeniería y Tecnología',
    titulo: 'Sistema de Gestión Documental y Validación QR para Actas de Titulación',
    tipoProyecto: 'Desarrollo Tecnológico',
    estado: 'Concluido / Liberado',
    periodo: 'Agosto - Diciembre 2025',
    fechaRegistro: '2025-08-18',
    entregableFinal: 'Sistema web implementado en ventanilla escolar y constancias digitales verificables por QR.',
    habilidades: ['Desarrollo Web', 'Códigos QR', 'Bases de Datos', 'Seguridad Informática'],
    objetivo:
      'Digitalizar el control de expedientes de titulación integral en el ITSAL mediante folios encriptados con código QR y seguimiento de firmas administrativas.',
    planteamiento:
      'La revisión física de expedientes generaba demoras en validación y consulta de estatus para egresados y coordinadores de carrera.',
    justificacion:
      'Redujo el tiempo de verificación documental a segundos y aseguró trazabilidad completa ante auditorías del SGC.',
    alcances:
      'Plataforma web institucional en operación continua, generador QR integrado y manual técnico entregado.',
    limitaciones: 'Integración con histórico previo a 2023 mediante carga por lotes CSV.',
    observaciones: 'Proyecto liberado con carta de terminación oficial y evaluación aprobatoria.',
    observacionesAcademia: 'Concluido al 100% con dictamen aprobatorio de Academia.',
    observacionesVinculacion: 'Expediente liberado y archivado en División de Estudios Profesionales.',
  },
  {
    id: 'comp-002',
    folio: 'ITSAL-RP-2025-079',
    bearPose: 7,
    imagenUrl: '/projects/proj-005.jpg',
    origen: 'Externo',
    institucion: 'Terminal Marítima PEMEX Salina Cruz',
    departamento: 'Ing. Eléctrica y Electrónica',
    perfilRequerido: 'Ing. Electrónica',
    alumnosRequeridos: 1,
    alumnosAsignados: [
      {
        nombre: 'Jorge Eduardo Castillo Ramos',
        noControl: '201030052',
        carrera: 'Ing. Electrónica',
        fechaAsignacion: '2025-08-25',
      },
    ],
    asesor: 'M.C. Eduardo Morales Gutiérrez',
    colaboradores: 'Ing. Marcos Antonio Vera (Supervisor de Instrumentación)',
    jefeDepartamento: 'Ing. Anita del Carmen Morales Cruz',
    areaConocimiento: 'Ingeniería y Tecnología',
    titulo: 'Red de Telemetría y Alertas Tempranas para Subestaciones Auxiliares',
    tipoProyecto: 'Aplicado',
    estado: 'Concluido / Liberado',
    periodo: 'Agosto - Diciembre 2025',
    fechaRegistro: '2025-08-14',
    entregableFinal: 'Nodos de medición calibrados en campo, reporte técnico liberado y tablero de alertas en operación.',
    habilidades: ['IoT', 'Redes', 'Automatización', 'Energía Renovable'],
    objetivo:
      'Implementar un sistema autónomo de monitoreo de voltaje, corriente y temperatura en tableros de distribución auxiliar con envío de alertas preventivas.',
    planteamiento:
      'Las rondas de inspección manual impedían detectar sobrecargas nocturnas oportunas en áreas periféricas de la terminal.',
    justificacion:
      'Mejoró la continuidad operativa y fortaleció la vinculación tecnológica entre el ITSAL y el sector energético del Istmo.',
    alcances:
      'Despliegue de 4 nodos inalámbricos alimentados por celda solar, protocolo de pruebas y documentación técnica final.',
    limitaciones: 'Cobertura sujeta a línea de vista dentro del perímetro industrial autorizado.',
    observaciones: 'Vinculación cumplida al 100% con carta de liberación emitida por la empresa.',
    observacionesAcademia: 'Informe técnico final aprobado por la Academia de Ing. Electrónica.',
    observacionesVinculacion: 'Carta de terminación y satisfacción empresarial registrada.',
  },
  {
    id: 'comp-003',
    folio: 'ITSAL-RP-2025-091',
    bearPose: 5,
    imagenUrl: '/projects/proj-003.jpg',
    origen: 'Externo',
    institucion: 'ASIPONA Salina Cruz',
    departamento: 'Ciencias Económico-Administrativas',
    perfilRequerido: 'Ing. en Gestión Empresarial',
    alumnosRequeridos: 2,
    alumnosAsignados: [
      {
        nombre: 'Mariana Guadalupe Orozco Díaz',
        noControl: '201060019',
        carrera: 'Ing. en Gestión Empresarial',
        fechaAsignacion: '2025-02-04',
      },
      {
        nombre: 'Fernando Javier Matus Cruz',
        noControl: '201060064',
        carrera: 'Ing. en Gestión Empresarial',
        fechaAsignacion: '2025-02-04',
      },
    ],
    asesor: 'M.A. Carmen Elena Ríos Villalobos',
    colaboradores: 'Lic. Ricardo Matus López (Enlace ASIPONA)',
    jefeDepartamento: 'M.G.E. Jorge Alberto Pinacho',
    areaConocimiento: 'Ciencias económico-administrativas',
    titulo: 'Reingeniería de Inventarios ABC y Tablero KPI para Almacén Portuario',
    tipoProyecto: 'Aplicado',
    estado: 'Concluido / Liberado',
    periodo: 'Enero - Junio 2025',
    fechaRegistro: '2025-01-20',
    entregableFinal: 'Catálogo estandarizado ABC implementado, tablero KPI operativo y vinculación empresarial liberada.',
    habilidades: ['Logística Portuaria', 'Gestión de Calidad', 'Análisis Financiero', 'Análisis de Datos'],
    objetivo:
      'Estandarizar los flujos de recepción, resguardo y despacho de insumos portuarios mediante indicadores clave de desempeño.',
    planteamiento:
      'El crecimiento en operaciones del Corredor Interoceánico incrementó los tiempos de conciliación manual de almacén.',
    justificacion:
      'Redujo en 35% el tiempo de despacho interno y dejó instalado un tablero de control alineado a ISO 9001.',
    alcances:
      'Diagnóstico integral, matriz de clasificación ABC, tablero automatizado de indicadores y capacitación al personal.',
    limitaciones: 'Cifras históricas anonimizadas conforme a políticas de confidencialidad portuaria.',
    observaciones: 'Caso destacado de vinculación con contratación posterior de una residente.',
    observacionesAcademia: 'Memoria de residencia liberada sin observaciones pendientes.',
    observacionesVinculacion: 'Evaluación final sobresaliente emitida por ASIPONA Salina Cruz.',
  },
  {
    id: 'comp-004',
    folio: 'ITSAL-RP-2025-068',
    bearPose: 7,
    imagenUrl: '/projects/proj-004.jpg',
    origen: 'Externo',
    institucion: 'Refinería Ing. Antonio Dovalí Jaime',
    departamento: 'Metal-Mecánica',
    perfilRequerido: 'Ing. Mecánica',
    alumnosRequeridos: 2,
    alumnosAsignados: [
      {
        nombre: 'Roberto Carlos Jiménez Vera',
        noControl: '201040027',
        carrera: 'Ing. Mecánica',
        fechaAsignacion: '2025-02-01',
      },
    ],
    asesor: 'M.I. Sergio Iván Villalobos Cruz',
    colaboradores: 'Ing. Héctor Gallegos Méndez',
    jefeDepartamento: 'Ing. Roberto Carlos Jiménez',
    areaConocimiento: 'Ingeniería y Tecnología',
    titulo: 'Protocolo de Mantenimiento Predictivo por Vibraciones en Bombas Centrífugas',
    tipoProyecto: 'Aplicado',
    estado: 'Concluido / Liberado',
    periodo: 'Enero - Junio 2025',
    fechaRegistro: '2025-01-16',
    entregableFinal: 'Reporte técnico liberado bajo norma ISO 10816 y plan maestro preventivo validado en planta.',
    habilidades: ['Mantenimiento Industrial', 'Manufactura CAD/CAM', 'Gestión de Calidad', 'Análisis de Datos'],
    objetivo:
      'Reducir paros no programados en equipos rotativos críticos mediante levantamiento espectral de vibraciones y umbrales de alerta.',
    planteamiento:
      'Las fallas inesperadas en rodamientos elevaban los costos de mantenimiento correctivo en trenes de bombeo.',
    justificacion:
      'Estableció una línea base cuantitativa para programar intervenciones sin detener la operación continua.',
    alcances:
      'Monitoreo de 8 bombas críticas, modelado de componentes y manual de diagnóstico predictivo aprobado.',
    limitaciones: 'Mediciones realizadas exclusivamente en ventanas autorizadas de seguridad industrial.',
    observaciones: 'Proyecto validado con liberación técnica y académica completada.',
    observacionesAcademia: 'Aprobado por Academia de Ingeniería Mecánica.',
    observacionesVinculacion: 'Vinculación industrial cumplida y acreditada.',
  },
  {
    id: 'comp-005',
    folio: 'ITSAL-RP-2025-073',
    bearPose: 5,
    imagenUrl: '/projects/proj-002.jpg',
    origen: 'Externo',
    institucion: 'Granja Acuícola Bahía La Ventosa S.P.R. de R.L.',
    departamento: 'Ing. Química y Bioquímica',
    perfilRequerido: 'Ing. en Acuicultura',
    alumnosRequeridos: 1,
    alumnosAsignados: [
      {
        nombre: 'Paola Montserrat Toledo Salinas',
        noControl: '201050014',
        carrera: 'Ing. en Acuicultura',
        fechaAsignacion: '2025-08-20',
      },
    ],
    asesor: 'Dr. Humberto Enríquez Salinas',
    colaboradores: 'Biol. Mar. Sofía Velázquez Ordaz',
    jefeDepartamento: 'M.C. Patricia Ordóñez Ramírez',
    areaConocimiento: 'Ciencias del mar',
    titulo: 'Protocolo de Calidad Fisicoquímica y Supervivencia en Cultivo de Tilapia',
    tipoProyecto: 'Desarrollo Tecnológico',
    estado: 'Concluido / Liberado',
    periodo: 'Agosto - Diciembre 2025',
    fechaRegistro: '2025-08-12',
    entregableFinal: 'Bitácora digital de calidad de agua implementada y reporte técnico de rendimiento liberado.',
    habilidades: ['Calidad de Agua', 'Acuicultura Sustentable', 'Análisis de Datos'],
    objetivo:
      'Optimizar el control de oxígeno disuelto, pH y temperatura para elevar la tasa de supervivencia en ciclos de engorda regional.',
    planteamiento:
      'Los cambios térmicos estacionales afectaban el crecimiento de biomasa por ausencia de registros sistematizados.',
    justificacion:
      'Incrementó la eficiencia alimenticia y transfirió metodología práctica a productores acuícolas de la zona.',
    alcances:
      'Seguimiento de ciclo completo en estanques piloto, guía de manejo sustentable y liberación oficial del residente.',
    limitaciones: 'Condiciones climáticas extremas atendidas con protocolos de aireación auxiliar.',
    observaciones: 'Residencia concluida con liberación formal y reconocimiento del sector productivo.',
    observacionesAcademia: 'Dictamen final aprobatorio por Academia de Ing. en Acuicultura.',
    observacionesVinculacion: 'Vinculación productiva cumplida satisfactoriamente.',
  },
];
