export interface DefinicionLibro {
  id: string
  archivo: string
  hoja: string
  columnas: string[]
  filas: number
  celdas: Record<string, string>
  anchos?: number[]
  formato?: Record<string, 'encabezado' | 'negrita' | 'numero'>
}

export type Ejemplo =
  | { tipo: 'texto'; titulo?: string; contenido: string }
  | { tipo: 'lista'; titulo?: string; items: string[] }
  | {
      tipo: 'tabla'
      titulo?: string
      columnas: string[]
      filas: (string | number)[][]
      resaltarFilas?: number[]
    }
  | { tipo: 'formula'; titulo?: string; formula: string; resultado: string; explicacion: string }
  | {
      tipo: 'grafico'
      titulo?: string
      estilo: 'barras' | 'pastel'
      etiquetas: string[]
      valores: number[]
      nota?: string
    }
  | { tipo: 'tarjetas'; titulo?: string; items: { titulo: string; texto: string }[] }

export interface RetoBase {
  id: string
  pregunta: string
  pista: string
  respuestaModelo: string
}

export interface RetoQuiz extends RetoBase {
  tipo: 'quiz'
  opciones: string[]
  correcta: number
  explicacion: string
}

export interface RetoTexto extends RetoBase {
  tipo: 'texto'
  instruccion: string
  claves: string[]
  palabrasMinimas?: number
  explicacion: string
}

export interface RetoClasificar extends RetoBase {
  tipo: 'clasificar'
  categorias: string[]
  items: { texto: string; categoria: string }[]
  explicacion: string
}

export type ColorFormato = 'verde' | 'rojo' | 'amarillo' | 'azul'

export type CondicionFormato = 'mayor' | 'menor' | 'igual' | 'contiene' | 'entre'

export interface ReglaFormato {
  condicion: CondicionFormato
  valor: number | string
  valor2?: number
  color: ColorFormato
}

export interface FormatoRequerido {
  rango: string
  reglas: ReglaFormato[]
}

export interface GraficoRequerido {
  tipo: 'barras' | 'pastel'
  rango: string
  titulo?: string
  valoresEsperados?: number[]
}

export interface ObjetivoExcel {
  celda: string
  valor: number | string
  tolerancia?: number
  funciones?: string[]
  etiqueta?: string
}

export interface RetoExcel extends RetoBase {
  tipo: 'excel'
  libro: DefinicionLibro
  instruccion: string
  objetivos: ObjetivoExcel[]
  formatoRequerido?: FormatoRequerido[]
  graficoRequerido?: GraficoRequerido
  mensajeExito: string
  solucion?: Record<string, string>
  solucionFormato?: FormatoRequerido[]
  solucionGrafico?: GraficoRequerido
}

export interface RetoDinamica extends RetoBase {
  tipo: 'dinamica'
  libro: DefinicionLibro
  instruccion: string
  camposFila: string[]
  camposValor: string[]
  filaEsperada: string
  valorEsperado: string
  agregacionEsperada: 'suma' | 'cuenta'
  resultadoEsperado: { etiqueta: string; valor: number }[]
  mensajeExito: string
}

export interface RetoGrafico extends RetoBase {
  tipo: 'grafico'
  instruccion: string
  titulo: string
  etiquetas: string[]
  valores: number[]
  tipoCorrecto: 'barras' | 'pastel'
  preguntaLectura: string
  opcionesLectura: string[]
  correctaLectura: number
  mensajeExito: string
}

export interface RetoValidacion extends RetoBase {
  tipo: 'validacion'
  instruccion: string
  columnas: string[]
  filas: string[][]
  errores: { fila: number; observacion: string }[]
  mensajeExito: string
}

export interface CampoPlantilla {
  id: string
  etiqueta: string
  ayuda: string
  opciones: string[]
  correcta: number
}

export interface RetoWord extends RetoBase {
  tipo: 'word'
  instruccion: string
  campos: CampoPlantilla[]
  tabla: { columnas: string[]; filas: (string | number)[][]; etiquetaTotal: string; total: number }
  mensajeExito: string
}

export interface RetoPowerPoint extends RetoBase {
  tipo: 'powerpoint'
  instruccion: string
  campos: CampoPlantilla[]
  tabla: { columnas: string[]; filas: (string | number)[][] }
  mensajeExito: string
}

export interface RetoSimulacion extends RetoBase {
  tipo: 'simulacion'
  instruccion: string
  pasos: {
    titulo: string
    guion: string
    pregunta: string
    opciones: string[]
    correcta: number
    explicacion: string
  }[]
  mensajeExito: string
}

export type Reto =
  | RetoQuiz
  | RetoTexto
  | RetoClasificar
  | RetoExcel
  | RetoDinamica
  | RetoGrafico
  | RetoValidacion
  | RetoWord
  | RetoPowerPoint
  | RetoSimulacion

export interface Leccion {
  id: string
  numero: string
  titulo: string
  bloques: string[]
  ejemplo?: Ejemplo
  reto: Reto
}

export interface Modulo {
  id: number
  titulo: string
  subtitulo: string
  objetivo: string
  tiempo: string
  lecciones: Leccion[]
  reto?: Reto
}
