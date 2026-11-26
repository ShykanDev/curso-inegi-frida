import type { ColorFormato, CondicionFormato, ReglaFormato } from '../data/tipos'

export interface RangoCeldas {
  ini: string
  fin: string
  celdas: string[]
}

export function parseRef(ref: string): { col: string; fila: number } | null {
  const m = ref.toUpperCase().replace(/\$/g, '').match(/^([A-Z]{1,3})(\d{1,7})$/)
  if (!m) return null
  return { col: m[1], fila: Number(m[2]) }
}

function numeroColumna(col: string): number {
  let n = 0
  for (const ch of col) n = n * 26 + (ch.charCodeAt(0) - 64)
  return n
}

function nombreColumna(n: number): string {
  let salida = ''
  let x = n
  while (x > 0) {
    const resto = (x - 1) % 26
    salida = String.fromCharCode(65 + resto) + salida
    x = Math.floor((x - 1) / 26)
  }
  return salida
}

export function normalizarRango(ini: string, fin: string): RangoCeldas {
  const a = parseRef(ini)
  const b = parseRef(fin)
  if (!a || !b) return { ini, fin, celdas: [] }
  const c1 = numeroColumna(a.col)
  const c2 = numeroColumna(b.col)
  const f1 = Math.min(a.fila, b.fila)
  const f2 = Math.max(a.fila, b.fila)
  const colIni = Math.min(c1, c2)
  const colFin = Math.max(c1, c2)
  const celdas: string[] = []
  for (let f = f1; f <= f2; f++) {
    for (let c = colIni; c <= colFin; c++) {
      celdas.push(`${nombreColumna(c)}${f}`)
    }
  }
  return {
    ini: `${nombreColumna(colIni)}${f1}`,
    fin: `${nombreColumna(colFin)}${f2}`,
    celdas
  }
}

export function mismoRango(a: RangoCeldas, b: RangoCeldas): boolean {
  return a.ini === b.ini && a.fin === b.fin
}

export function rangoDesdeTexto(texto: string): RangoCeldas | null {
  const limpio = texto.toUpperCase().replace(/\$/g, '').replace(/\s/g, '')
  const m = limpio.match(/^([A-Z]+\d+):([A-Z]+\d+)$/)
  if (!m) return null
  return normalizarRango(m[1], m[2])
}

export function evaluarRegla(
  valor: string | number,
  regla: ReglaFormato
): boolean {
  const esNumero = typeof valor === 'number' || (typeof valor === 'string' && valor.trim() !== '' && Number.isFinite(Number(valor.replace(',', '.'))))
  const n = esNumero ? Number(String(valor).replace(',', '.')) : NaN
  const texto = String(valor).trim().toUpperCase()
  const valorRegla = typeof regla.valor === 'number' ? regla.valor : String(regla.valor).trim().toUpperCase()

  switch (regla.condicion) {
    case 'mayor':
      return Number.isFinite(n) && Number.isFinite(Number(valorRegla)) && n > Number(valorRegla)
    case 'menor':
      return Number.isFinite(n) && Number.isFinite(Number(valorRegla)) && n < Number(valorRegla)
    case 'igual':
      return esNumero && Number.isFinite(Number(valorRegla)) ? n === Number(valorRegla) : texto === valorRegla
    case 'contiene':
      return texto.includes(String(valorRegla))
    case 'entre': {
      const v2 = Number(regla.valor2)
      if (!Number.isFinite(n) || !Number.isFinite(Number(valorRegla)) || !Number.isFinite(v2)) return false
      const a = Math.min(Number(valorRegla), v2)
      const b = Math.max(Number(valorRegla), v2)
      return n >= a && n <= b
    }
    default:
      return false
  }
}

export function reglasIguales(a: ReglaFormato[], b: ReglaFormato[]): boolean {
  if (a.length !== b.length) return false
  return a.every((ra, i) => {
    const rb = b[i]
    return (
      !!rb &&
      ra.condicion === rb.condicion &&
      String(ra.valor).toUpperCase() === String(rb.valor).toUpperCase() &&
      String(ra.valor2 ?? '') === String(rb.valor2 ?? '') &&
      ra.color === rb.color
    )
  })
}

export const colorClase: Record<ColorFormato, { texto: string; fondo: string; nombre: string }> = {
  verde: { texto: 'text-[#1B5E20]', fondo: 'bg-[#D7F0D9]', nombre: 'verde' },
  rojo: { texto: 'text-[#A01616]', fondo: 'bg-[#FBDCDC]', nombre: 'rojo' },
  amarillo: { texto: 'text-[#7A5200]', fondo: 'bg-[#FFF0C2]', nombre: 'amarillo' },
  azul: { texto: 'text-[#00456B]', fondo: 'bg-[#D6EAF7]', nombre: 'azul' }
}

export function describirRegla(regla: ReglaFormato): string {
  const color = colorClase[regla.color].nombre
  switch (regla.condicion) {
    case 'mayor':
      return `mayor que ${regla.valor} → ${color}`
    case 'menor':
      return `menor que ${regla.valor} → ${color}`
    case 'igual':
      return `igual a ${regla.valor} → ${color}`
    case 'contiene':
      return `contiene "${regla.valor}" → ${color}`
    case 'entre':
      return `entre ${regla.valor} y ${regla.valor2} → ${color}`
    default:
      return color
  }
}

export interface SerieGrafico {
  etiqueta: string
  valor: number
}

export function datosParaGrafico(
  celdas: Record<string, string>,
  ejecutar: (ref: string) => string | number,
  rangoTexto: string
): SerieGrafico[] {
  const rango = rangoDesdeTexto(rangoTexto)
  if (!rango) return []
  const filas = new Map<number, string[]>()
  for (const ref of rango.celdas) {
    const p = parseRef(ref)
    if (!p) continue
    const lista = filas.get(p.fila) ?? []
    lista.push(ref)
    filas.set(p.fila, lista)
  }
  const salida: SerieGrafico[] = []
  const ordenadas = Array.from(filas.entries()).sort((a, b) => a[0] - b[0])
  for (const [, refs] of ordenadas) {
    const valores = refs.map((r) => ejecutar(r))
    const numeros = valores.filter((v) => typeof v === 'number') as number[]
    if (numeros.length === 0) continue
    const etiqueta = valores
      .filter((v) => typeof v === 'string' && String(v).trim() !== '')
      .map((v) => String(v))
      .join(' ')
    salida.push({ etiqueta: etiqueta || `Fila ${parseRef(refs[0])?.fila ?? ''}`, valor: numeros[numeros.length - 1] })
  }
  return salida
}

export function gradientePastel(valores: number[], colores: string[]): string {
  const total = valores.reduce((a, b) => a + b, 0)
  if (total <= 0) return 'conic-gradient(#DDE7F0 0deg 360deg)'
  let acumulado = 0
  const partes = valores.map((v, i) => {
    const grados = (v / total) * 360
    const texto = `${colores[i % colores.length]} ${acumulado}deg ${acumulado + grados}deg`
    acumulado += grados
    return texto
  })
  return `conic-gradient(${partes.join(', ')})`
}

export const paletaGrafico = ['#005A8B', '#0099B8', '#4FA3C7', '#7FBFD9', '#A8D5E5', '#C9E4F0', '#003057']
