import type { DefinicionLibro } from '../data/tipos'

export const alcaldiasCDMX = [
  'Azcapotzalco',
  'Cuauhtémoc',
  'Benito Juárez',
  'Gustavo A. Madero',
  'Iztapalapa',
  'Coyoacán',
  'Miguel Hidalgo',
  'Álvaro Obregón'
]

export const municipiosEdomex = [
  'Ecatepec',
  'Toluca',
  'Naucalpan',
  'Tlalnepantla',
  'Chimalhuacán',
  'Nezahualcóyotl'
]

export const entrevistadores = [
  'Ana Ramírez',
  'Luis Ortega',
  'Mariana Cruz',
  'José Peña',
  'Sofía Delgado'
]

export const estatusVivienda = [
  'Completa',
  'Pendiente',
  'No respuesta',
  'Incompleta'
] as const

export function columnasEncabezado(columnas: string[]): Record<string, string> {
  const celdas: Record<string, string> = {}
  columnas.forEach((nombre, i) => {
    celdas[`${String.fromCharCode(65 + i)}1`] = nombre
  })
  return celdas
}

export function construirLibro(
  id: string,
  archivo: string,
  columnas: string[],
  filas: (string | number)[][],
  extras?: { hoja?: string; anchos?: number[] }
): DefinicionLibro {
  const celdas = columnasEncabezado(columnas)
  filas.forEach((fila, fi) => {
    fila.forEach((valor, ci) => {
      celdas[`${String.fromCharCode(65 + ci)}${fi + 2}`] = String(valor)
    })
  })
  return {
    id,
    archivo,
    hoja: extras?.hoja ?? 'Datos',
    columnas,
    filas: filas.length + 1,
    celdas,
    anchos: extras?.anchos
  }
}

export const hojaAvanceSemana = construirLibro(
  'avance-semana',
  'Avance_CDMX.xlsx',
  ['Día', 'Entrevistas completas'],
  [
    ['Lunes', 12],
    ['Martes', 15],
    ['Miércoles', 9],
    ['Jueves', 20],
    ['Viernes', 14]
  ],
  { hoja: 'Avance', anchos: [150, 200] }
)

export const hojaEntrevistadores = construirLibro(
  'por-entrevistador',
  'Viviendas_CDMX.xlsx',
  ['Entrevistador', 'Viviendas visitadas', 'Completas'],
  [
    ['Ana Ramírez', 24, 18],
    ['Luis Ortega', 21, 17],
    ['Mariana Cruz', 18, 15],
    ['José Peña', 20, 12],
    ['Sofía Delgado', 17, 16]
  ],
  { hoja: 'Viviendas', anchos: [160, 170, 120] }
)

export const hojaCobertura = construirLibro(
  'cobertura',
  'Cobertura_CDMX.xlsx',
  ['Concepto', 'Total'],
  [
    ['Viviendas seleccionadas', 100],
    ['Entrevistas completas', 70]
  ],
  { hoja: 'Cobertura', anchos: [240, 120] }
)

export const hojaViviendas = construirLibro(
  'viviendas-base',
  'Base_Viviendas_CDMX.xlsx',
  ['Folio', 'Estado', 'Alcaldía / Municipio', 'Entrevistador', 'Fecha', 'Estatus', 'Personas'],
  [
    ['CDMX-001', 'Ciudad de México', 'Azcapotzalco', 'Ana Ramírez', '2026-03-02', 'Completa', 4],
    ['CDMX-002', 'Ciudad de México', 'Cuauhtémoc', 'Luis Ortega', '2026-03-02', 'Completa', 3],
    ['CDMX-003', 'Ciudad de México', 'Iztapalapa', 'Mariana Cruz', '2026-03-03', 'Pendiente', 5],
    ['CDMX-004', 'Ciudad de México', 'Coyoacán', 'José Peña', '2026-03-03', 'No respuesta', 0],
    ['CDMX-005', 'Ciudad de México', 'Benito Juárez', 'Sofía Delgado', '2026-03-04', 'Completa', 2],
    ['CDMX-006', 'Ciudad de México', 'Gustavo A. Madero', 'Ana Ramírez', '2026-03-04', 'Completa', 6],
    ['CDMX-007', 'Estado de México', 'Ecatepec', 'Luis Ortega', '2026-03-05', 'Pendiente', 4],
    ['CDMX-008', 'Estado de México', 'Toluca', 'Mariana Cruz', '2026-03-05', 'Completa', 3],
    ['CDMX-009', 'Estado de México', 'Naucalpan', 'José Peña', '2026-03-06', 'No respuesta', 0],
    ['CDMX-010', 'Estado de México', 'Tlalnepantla', 'Sofía Delgado', '2026-03-06', 'Completa', 5]
  ],
  { hoja: 'Viviendas', anchos: [110, 150, 180, 140, 120, 130, 100] }
)

export const hojaCoberturaRep = construirLibro(
  'cobertura-republica',
  'Cobertura_República.xlsx',
  ['Estado', 'Seleccionadas', 'Completas', 'No respuesta'],
  [
    ['Ciudad de México', 100, 70, 12],
    ['Estado de México', 120, 96, 9],
    ['Jalisco', 90, 63, 11],
    ['Nuevo León', 80, 68, 5],
    ['Puebla', 85, 51, 14],
    ['Veracruz', 95, 57, 18]
  ],
  { hoja: 'Cobertura', anchos: [180, 140, 120, 140] }
)

export const hojaSI = construirLibro(
  'semana-si',
  'Avance_Nacional.xlsx',
  ['Alcaldía', 'Seleccionadas', 'Completas', 'Avance'],
  [
    ['Benito Juárez', 40, 32, ''],
    ['Iztapalapa', 60, 33, ''],
    ['Coyoacán', 50, 41, ''],
    ['Cuauhtémoc', 55, 48, '']
  ],
  { hoja: 'Avance', anchos: [170, 140, 120, 100] }
)

export const listaEntrevistadoresFolio = construirLibro(
  'lista-folios',
  'Catalogos.xlsx',
  ['Folio', 'Entrevistador', 'Alcaldía'],
  [
    ['E-01', 'Ana Ramírez', 'Ecatepec'],
    ['E-02', 'Luis Ortega', 'Toluca'],
    ['E-03', 'Mariana Cruz', 'Naucalpan'],
    ['E-04', 'José Peña', 'Tlalnepantla'],
    ['E-05', 'Sofía Delgado', 'Chimalhuacán']
  ],
  { hoja: 'Catálogo', anchos: [120, 160, 160] }
)

export const hojaBuscarv = construirLibro(
  'buscarv',
  'Casos_Edomex.xlsx',
  ['Folio', 'Entrevistador', 'Municipio'],
  [
    ['E-01', '', 'Ecatepec'],
    ['E-02', '', 'Toluca'],
    ['E-03', '', 'Naucalpan'],
    ['E-04', '', 'Tlalnepantla'],
    ['E-05', '', 'Chimalhuacán']
  ],
  { hoja: 'Casos', anchos: [110, 160, 170] }
)

export const hojaGrafico = construirLibro(
  'grafico-nacional',
  'Avance_Nacional.xlsx',
  ['Estado', 'Completas', 'Pendientes'],
  [
    ['Jalisco', 63, 27],
    ['Nuevo León', 68, 12],
    ['Puebla', 51, 34],
    ['Veracruz', 57, 38]
  ],
  { hoja: 'Nacional', anchos: [140, 120, 130] }
)

export const hojaDuplicados = construirLibro(
  'duplicados',
  'Base_CDMX_Revisión.xlsx',
  ['Folio', 'Alcaldía', 'Estatus', 'Personas'],
  [
    ['CDMX-101', 'Azcapotzalco', 'Completa', 3],
    ['CDMX-102', 'Cuauhtémoc', 'Completa', 4],
    ['CDMX-101', 'Azcapotzalco', 'Completa', 3],
    ['CDMX-103', 'Iztapalapa', 'Pendiente', 5],
    ['CDMX-104', 'Coyoacán', 'Completa', 2],
    ['CDMX-105', 'Benito Juárez', 'completa', 3],
    ['CDMX-106', 'Miguel Hidalgo', 'Completa', 2],
    ['CDMX-107', 'Álvaro Obregón', 'Pendiente', 4],
    ['CDMX-108', 'Cuauhtémoc', 'No respuesta', 0],
    ['CDMX-109', 'Iztapalapa', 'Completa', 6],
    ['CDMX-110', 'Azcapotzalco', 'Completa', 3],
    ['CDMX-111', 'Coyoacán', 'Pendiente', 3]
  ],
  { hoja: 'Revisión', anchos: [110, 170, 130, 100] }
)

export const hojaValidacionErrores = construirLibro(
  'validacion-10',
  'Base_Validar_CDMX.xlsx',
  ['Folio', 'Alcaldía', 'Edad', 'Fecha', 'Estatus'],
  [
    ['CDMX-201', 'Azcapotzalco', '34', '2026-03-02', 'Completa'],
    ['CDMX-202', 'Cuauhtémoc', '250', '2026-03-02', 'Completa'],
    ['CDMX-203', 'Iztapalapa', '41', '', 'Completa'],
    ['CDMX-204', 'Coyoacán', '29', '2026-03-03', 'Completa'],
    ['CDMX-202', 'Cuauhtémoc', '38', '2026-03-03', 'Pendiente'],
    ['CDMX-205', 'Benito Juárez', '17', '2026-03-03', 'Completa'],
    ['CDMX-206', 'Miguel Hidalgo', '45', '2026-03-04', 'completa'],
    ['CDMX-207', 'Álvaro Obregón', '52', '2026-03-04', 'Pendiente'],
    ['CDMX-208', 'Iztapalapa', '-3', '2026-03-05', 'Completa'],
    ['CDMX-209', 'Coyoacán', '31', '2026-03-05', 'Completa ']
  ],
  { hoja: 'Revisión', anchos: [110, 170, 90, 120, 120] }
)

export const hojaCierreModulo1 = construirLibro(
  'cierre-m1',
  'Cierre_Modulo1.xlsx',
  ['Estado', 'Seleccionadas', 'Completas', 'Cobertura %', 'No respuesta'],
  [
    ['Ciudad de México', 100, 70, '', 12],
    ['Estado de México', 120, 96, '', 9],
    ['Jalisco', 90, 63, '', 11],
    ['Nuevo León', 80, 68, '', 5]
  ],
  { hoja: 'Cobertura', anchos: [180, 140, 120, 130, 130] }
)

export const hojaPromedioEquipo = construirLibro(
  'promedio-equipo',
  'Promedio_Equipo.xlsx',
  ['Entrevistador', 'Completas'],
  [
    ['Ana Ramírez', 20],
    ['Luis Ortega', 18],
    ['Mariana Cruz', 16],
    ['José Peña', 14],
    ['Sofía Delgado', 12]
  ],
  { hoja: 'Equipo', anchos: [170, 120] }
)

export const hojaFormatoCondicional = construirLibro(
  'formato-condicional',
  'Avance_Alcaldías.xlsx',
  ['Alcaldía', 'Completas', 'Meta', 'Estatus'],
  [
    ['Benito Juárez', 92, 80, 'Completa'],
    ['Coyoacán', 85, 80, 'Completa'],
    ['Cuauhtémoc', 78, 80, 'Completa'],
    ['Iztapalapa', 55, 80, 'Pendiente'],
    ['Azcapotzalco', 81, 80, 'Completa'],
    ['Miguel Hidalgo', 64, 80, 'Pendiente']
  ],
  { hoja: 'Avance', anchos: [160, 120, 100, 130] }
)

export const hojaGraficoPractica = construirLibro(
  'grafico-practica',
  'Grafico_Avance.xlsx',
  ['Alcaldía', 'Completas'],
  [
    ['Benito Juárez', 92],
    ['Coyoacán', 85],
    ['Cuauhtémoc', 78],
    ['Iztapalapa', 55],
    ['Azcapotzalco', 81],
    ['Miguel Hidalgo', 64]
  ],
  { hoja: 'Avance', anchos: [170, 120] }
)

export const hojaPastel = construirLibro(
  'grafico-pastel',
  'Completas_vs_Pendientes.xlsx',
  ['Estatus', 'Viviendas'],
  [
    ['Completas', 70],
    ['Pendientes', 18],
    ['No respuesta', 12]
  ],
  { hoja: 'Resumen', anchos: [160, 120] }
)

export const hojaEstilosAvance = construirLibro(
  'estilos-avance',
  'Seguimiento_CDMX.xlsx',
  ['Alcaldía', 'Avance %', 'Semáforo'],
  [
    ['Benito Juárez', 92, ''],
    ['Coyoacán', 85, ''],
    ['Cuauhtémoc', 78, ''],
    ['Iztapalapa', 55, ''],
    ['Azcapotzalco', 81, ''],
    ['Miguel Hidalgo', 64, '']
  ],
  { hoja: 'Seguimiento', anchos: [160, 120, 140] }
)

export const tablaResumenCierre = [
  { etiqueta: 'Ciudad de México', valor: 70 },
  { etiqueta: 'Estado de México', valor: 80 },
  { etiqueta: 'Jalisco', valor: 70 },
  { etiqueta: 'Nuevo León', valor: 85 }
]

export const hojaTabulador = construirLibro(
  'tabulador',
  'Tabulador_CDMX.xlsx',
  ['Alcaldía', 'Sexo', 'Completas'],
  [
    ['Benito Juárez', 'Mujer', 18],
    ['Benito Juárez', 'Hombre', 14],
    ['Iztapalapa', 'Mujer', 17],
    ['Iztapalapa', 'Hombre', 16],
    ['Coyoacán', 'Mujer', 21],
    ['Coyoacán', 'Hombre', 20],
    ['Cuauhtémoc', 'Mujer', 24],
    ['Cuauhtémoc', 'Hombre', 24]
  ],
  { hoja: 'Tabulador', anchos: [160, 110, 120] }
)
