export type Valor = number | string | boolean

export class Rango {
  filas: Valor[][]
  ref: string

  constructor(filas: Valor[][], ref: string) {
    this.filas = filas
    this.ref = ref
  }

  aplanar(): Valor[] {
    return this.filas.flat()
  }

  columna(indice: number): Valor[] {
    return this.filas.map((fila) => fila[indice] ?? '')
  }
}

type Eval = Valor | Rango

interface Token {
  tipo: 'num' | 'texto' | 'ref' | 'func' | 'op' | 'paren' | 'coma' | 'bool'
  valor: string
}

const PATRON_REF = /^[A-Z]{1,3}[0-9]{1,7}(:[A-Z]{1,3}[0-9]{1,7})?$/

function tokenizar(texto: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  while (i < texto.length) {
    const c = texto[i]
    if (/\s/.test(c)) {
      i++
      continue
    }
    if (c === '"' || c === '“' || c === '”') {
      let j = i + 1
      let s = ''
      while (j < texto.length && texto[j] !== '"' && texto[j] !== '”' && texto[j] !== '“') {
        s += texto[j]
        j++
      }
      tokens.push({ tipo: 'texto', valor: s })
      i = j + 1
      continue
    }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(texto[i + 1] ?? ''))) {
      let j = i
      let s = ''
      while (j < texto.length && /[0-9.]/.test(texto[j])) {
        s += texto[j]
        j++
      }
      tokens.push({ tipo: 'num', valor: s })
      i = j
      continue
    }
    if (/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(c)) {
      let j = i
      let s = ''
      while (j < texto.length && /[A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ._$]/.test(texto[j])) {
        s += texto[j]
        j++
      }
      if (texto[j] === '!' && j + 1 < texto.length && /[A-Za-z$]/.test(texto[j + 1])) {
        j++
        while (j < texto.length && /[A-Za-z0-9$]/.test(texto[j])) {
          s += texto[j]
          j++
        }
        s = s.slice(s.indexOf('!') + 1)
      }
      if (texto[j] === ':' && j + 1 < texto.length && /[A-Za-z$]/.test(texto[j + 1])) {
        let k2 = j + 1
        let fin = ''
        while (k2 < texto.length && /[A-Za-z0-9$]/.test(texto[k2])) {
          fin += texto[k2]
          k2++
        }
        s = `${s}:${fin}`
        j = k2
      }
      let k = j
      while (k < texto.length && texto[k] === ' ') k++
      const esFuncion = texto[k] === '('
      const limpio = s.replace(/\$/g, '').toUpperCase()
      if (PATRON_REF.test(limpio)) {
        tokens.push({ tipo: 'ref', valor: limpio })
      } else if (esFuncion) {
        tokens.push({ tipo: 'func', valor: limpio })
      } else if (limpio === 'VERDADERO' || limpio === 'TRUE') {
        tokens.push({ tipo: 'bool', valor: 'true' })
      } else if (limpio === 'FALSO' || limpio === 'FALSE') {
        tokens.push({ tipo: 'bool', valor: 'false' })
      } else {
        throw new Error(`No entiendo "${s}"`)
      }
      i = j
      continue
    }
    const dos = texto.slice(i, i + 2)
    if (dos === '<=' || dos === '>=' || dos === '<>') {
      tokens.push({ tipo: 'op', valor: dos })
      i += 2
      continue
    }
    if ('+-*/^=<>%&'.includes(c)) {
      tokens.push({ tipo: 'op', valor: c })
      i++
      continue
    }
    if (c === '(') {
      tokens.push({ tipo: 'paren', valor: '(' })
      i++
      continue
    }
    if (c === ')') {
      tokens.push({ tipo: 'paren', valor: ')' })
      i++
      continue
    }
    if (c === ',' || c === ';') {
      tokens.push({ tipo: 'coma', valor: ',' })
      i++
      continue
    }
    throw new Error(`Símbolo no válido: "${c}"`)
  }
  return tokens
}

export function esNumerico(v: unknown): boolean {
  return typeof v === 'number' && Number.isFinite(v)
}

function aNumero(v: Eval): number {
  if (v instanceof Rango) {
    const primero = v.aplanar().find((x) => esNumerico(x))
    return typeof primero === 'number' ? primero : 0
  }
  if (typeof v === 'number') return v
  if (typeof v === 'boolean') return v ? 1 : 0
  if (v === '') return 0
  const limpio = String(v).replace(/\s/g, '').replace(',', '.')
  const n = Number(limpio)
  return Number.isFinite(n) ? n : 0
}

function aTexto(v: Eval): string {
  if (v instanceof Rango) {
    const primero = v.aplanar().find((x) => x !== '')
    return primero === undefined ? '' : String(primero)
  }
  if (typeof v === 'boolean') return v ? 'VERDADERO' : 'FALSO'
  return String(v)
}

function aBooleano(v: Eval): boolean {
  if (v instanceof Rango) return aNumero(v) !== 0
  if (typeof v === 'boolean') return v
  if (typeof v === 'number') return v !== 0
  const t = String(v).trim().toUpperCase()
  if (t === 'VERDADERO' || t === 'TRUE') return true
  if (t === 'FALSO' || t === 'FALSE') return false
  return t !== ''
}

function numerosDe(valores: Eval[]): number[] {
  const salida: number[] = []
  for (const v of valores) {
    if (v instanceof Rango) {
      for (const x of v.aplanar()) {
        if (esNumerico(x)) salida.push(x as number)
      }
    } else if (esNumerico(v)) {
      salida.push(v as number)
    }
  }
  return salida
}

function celdasDe(valor: Eval): Valor[] {
  if (valor instanceof Rango) return valor.aplanar()
  return [valor]
}

function compararIzquierda(criterio: string): { op: string; resto: string } {
  const m = criterio.match(/^(<=|>=|<>|<|>|=)(.*)$/)
  if (m) return { op: m[1], resto: m[2].trim() }
  return { op: '=', resto: criterio.trim() }
}

function coincide(celda: Valor, criterio: string): boolean {
  const { op, resto } = compararIzquierda(criterio)
  const numCriterio = Number(resto.replace(',', '.'))
  const esNumCriterio = resto !== '' && Number.isFinite(numCriterio)
  const textoCriterio = resto.toUpperCase()
  const esComodin = textoCriterio.includes('*') || textoCriterio.includes('?')

  if (esComodin) {
    const patron = textoCriterio
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.')
    const prueba = new RegExp(`^${patron}$`, 'i').test(aTexto(celda))
    if (prueba) return op !== '<>'
    return op === '<>'
  }

  let igual: boolean
  if (typeof celda === 'number' && esNumCriterio) {
    igual = celda === numCriterio
  } else if (esNumCriterio && String(celda).trim() !== '') {
    const n = Number(String(celda).replace(',', '.'))
    igual = Number.isFinite(n) && n === numCriterio
  } else {
    igual = aTexto(celda).trim().toUpperCase() === textoCriterio
  }

  if (op === '=') return igual
  if (op === '<>') return !igual

  const izq = typeof celda === 'number' ? celda : Number(String(celda).replace(',', '.'))
  const der = esNumCriterio ? numCriterio : NaN
  if (!Number.isFinite(izq) || !Number.isFinite(der)) return false
  if (op === '<') return izq < der
  if (op === '<=') return izq <= der
  if (op === '>') return izq > der
  if (op === '>=') return izq >= der
  return false
}

class Analizador {
  private tokens: Token[]
  private pos = 0
  private ctx: ContextoEval

  constructor(tokens: Token[], ctx: ContextoEval) {
    this.tokens = tokens
    this.ctx = ctx
  }

  private mirar(): Token | undefined {
    return this.tokens[this.pos]
  }

  private esOp(valor: string): boolean {
    const t = this.mirar()
    return !!t && t.tipo === 'op' && t.valor === valor
  }

  expresion(): Eval {
    return this.comparacion()
  }

  private comparacion(): Eval {
    let izq = this.suma()
    while (
      this.esOp('=') ||
      this.esOp('<>') ||
      this.esOp('<') ||
      this.esOp('>') ||
      this.esOp('<=') ||
      this.esOp('>=')
    ) {
      const op = this.tokens[this.pos].valor
      this.pos++
      const der = this.suma()
      izq = this.aplicarComparacion(izq, op, der)
    }
    return izq
  }

  private aplicarComparacion(a: Eval, op: string, b: Eval): boolean {
    const ta = aTexto(a)
    const tb = aTexto(b)
    const na = Number(ta.replace(',', '.'))
    const nb = Number(tb.replace(',', '.'))
    const ambosNum = ta.trim() !== '' && tb.trim() !== '' && Number.isFinite(na) && Number.isFinite(nb)
    if (ambosNum) {
      if (op === '=') return na === nb
      if (op === '<>') return na !== nb
      if (op === '<') return na < nb
      if (op === '<=') return na <= nb
      if (op === '>') return na > nb
      if (op === '>=') return na >= nb
    }
    const cA = ta.toUpperCase()
    const cB = tb.toUpperCase()
    if (op === '=') return cA === cB
    if (op === '<>') return cA !== cB
    if (op === '<') return cA < cB
    if (op === '<=') return cA <= cB
    if (op === '>') return cA > cB
    if (op === '>=') return cA >= cB
    return false
  }

  private suma(): Eval {
    let izq = this.producto()
    while (this.esOp('+') || this.esOp('-') || this.esOp('&')) {
      const op = this.tokens[this.pos].valor
      this.pos++
      const der = this.producto()
      if (op === '+') izq = aNumero(izq) + aNumero(der)
      else if (op === '-') izq = aNumero(izq) - aNumero(der)
      else izq = aTexto(izq) + aTexto(der)
    }
    return izq
  }

  private producto(): Eval {
    let izq = this.potencia()
    while (this.esOp('*') || this.esOp('/')) {
      const op = this.tokens[this.pos].valor
      this.pos++
      const der = this.potencia()
      if (op === '*') {
        izq = aNumero(izq) * aNumero(der)
      } else {
        const divisor = aNumero(der)
        if (divisor === 0) return '#¡DIV/0!'
        izq = aNumero(izq) / divisor
      }
    }
    return izq
  }

  private potencia(): Eval {
    let izq = this.unario()
    while (this.esOp('^')) {
      this.pos++
      const der = this.unario()
      izq = Math.pow(aNumero(izq), aNumero(der))
    }
    return izq
  }

  private unario(): Eval {
    if (this.esOp('-')) {
      this.pos++
      return -aNumero(this.unario())
    }
    if (this.esOp('+')) {
      this.pos++
      return aNumero(this.unario())
    }
    return this.primario()
  }

  private primario(): Eval {
    const t = this.mirar()
    if (!t) throw new Error('Falta un valor al final de la fórmula')

    if (t.tipo === 'num') {
      this.pos++
      return Number(t.valor)
    }
    if (t.tipo === 'texto') {
      this.pos++
      return t.valor
    }
    if (t.tipo === 'bool') {
      this.pos++
      return t.valor === 'true'
    }
    if (t.tipo === 'ref') {
      this.pos++
      if (t.valor.includes(':')) return this.ctx.rangoDe(t.valor)
      return this.ctx.valorDe(t.valor)
    }
    if (t.tipo === 'func') {
      this.pos++
      return this.llamada(t.valor)
    }
    if (t.tipo === 'paren' && t.valor === '(') {
      this.pos++
      const v = this.expresion()
      const cierre = this.mirar()
      if (cierre && cierre.tipo === 'paren' && cierre.valor === ')') this.pos++
      return v
    }
    throw new Error(`No puedo leer "${t.valor}"`)
  }

  private argumentos(): Eval[] {
    const args: Eval[] = []
    const abre = this.mirar()
    if (!abre || abre.tipo !== 'paren' || abre.valor !== '(') {
      throw new Error('Falta un paréntesis')
    }
    this.pos++
    const cierra = this.mirar()
    if (cierra && cierra.tipo === 'paren' && cierra.valor === ')') {
      this.pos++
      return args
    }
    while (true) {
      args.push(this.expresion())
      const t = this.mirar()
      if (t && t.tipo === 'coma') {
        this.pos++
        continue
      }
      if (t && t.tipo === 'paren' && t.valor === ')') {
        this.pos++
        break
      }
      throw new Error('Falta cerrar el paréntesis')
    }
    return args
  }

  private llamada(nombre: string): Eval {
    const args = this.argumentos()
    switch (nombre) {
      case 'SUMA':
      case 'SUM': {
        return numerosDe(args).reduce((a, b) => a + b, 0)
      }
      case 'PROMEDIO':
      case 'AVERAGE': {
        const nums = numerosDe(args)
        if (nums.length === 0) return '#¡DIV/0!'
        return nums.reduce((a, b) => a + b, 0) / nums.length
      }
      case 'CONTAR':
      case 'COUNT': {
        return numerosDe(args).length
      }
      case 'CONTARA':
      case 'COUNTA': {
        const todos = args.flatMap((a) => celdasDe(a))
        return todos.filter((x) => String(x).trim() !== '').length
      }
      case 'CONTAR.SI':
      case 'COUNTIF': {
        const celdas = celdasDe(args[0] ?? '')
        const criterio = aTexto(args[1] ?? '')
        return celdas.filter((c) => coincide(c, criterio)).length
      }
      case 'SUMAR.SI':
      case 'SUMIF': {
        const criterios = celdasDe(args[0] ?? '')
        const criterio = aTexto(args[1] ?? '')
        const sumandos = args[2] ? celdasDe(args[2]) : criterios
        let total = 0
        criterios.forEach((c, idx) => {
          if (coincide(c, criterio)) total += aNumero(sumandos[idx] ?? 0)
        })
        return total
      }
      case 'SI':
      case 'IF': {
        const cond = aBooleano(args[0] ?? false)
        if (cond) return args[1] ?? ''
        return args[2] ?? ''
      }
      case 'Y':
      case 'AND': {
        return args.every((a) => aBooleano(a))
      }
      case 'O':
      case 'OR': {
        return args.some((a) => aBooleano(a))
      }
      case 'BUSCARV':
      case 'VLOOKUP': {
        const buscado = args[0] ?? ''
        const tabla = args[1]
        const col = Math.max(1, Math.round(aNumero(args[2] ?? 1)))
        if (!(tabla instanceof Rango)) return '#¡N/A!'
        const fila = tabla.filas.find((f) => {
          const primera = f[0] ?? ''
          if (typeof primera === 'number' && typeof buscado === 'number') return primera === buscado
          return aTexto(primera).trim().toUpperCase() === aTexto(buscado).trim().toUpperCase()
        })
        if (!fila) return '#¡N/A!'
        return fila[col - 1] ?? ''
      }
      case 'XLOOKUP':
      case 'BUSCARX': {
        const buscado = args[0] ?? ''
        const rangoBusqueda = args[1]
        const rangoResultado = args[2]
        if (!(rangoBusqueda instanceof Rango) || !(rangoResultado instanceof Rango)) return '#¡N/A!'
        const colBusqueda = rangoBusqueda.aplanar()
        const colResultado = rangoResultado.aplanar()
        const idx = colBusqueda.findIndex((c) => {
          if (typeof c === 'number' && typeof buscado === 'number') return c === buscado
          return aTexto(c).trim().toUpperCase() === aTexto(buscado).trim().toUpperCase()
        })
        if (idx === -1) return '#¡N/A!'
        return colResultado[idx] ?? ''
      }
      case 'MAX': {
        const nums = numerosDe(args)
        return nums.length ? Math.max(...nums) : 0
      }
      case 'MIN': {
        const nums = numerosDe(args)
        return nums.length ? Math.min(...nums) : 0
      }
      case 'REDONDEAR':
      case 'ROUND': {
        const n = aNumero(args[0] ?? 0)
        const dec = Math.round(aNumero(args[1] ?? 0))
        const factor = Math.pow(10, dec)
        return Math.round(n * factor) / factor
      }
      default:
        throw new Error(`La función ${nombre} no existe en este simulador`)
    }
  }
}

export interface ContextoEval {
  valorDe: (ref: string) => Valor
  rangoDe: (ref: string) => Rango
}

export function evaluarFormula(formula: string, ctx: ContextoEval): Eval {
  const limpia = formula.trim().replace(/^=/, '')
  const tokens = tokenizar(limpia)
  if (tokens.length === 0) return ''
  const analizador = new Analizador(tokens, ctx)
  return analizador.expresion()
}

export function comoEscalar(v: Eval): Valor {
  if (v instanceof Rango) {
    const primero = v.aplanar().find((x) => x !== '')
    return primero ?? ''
  }
  return v
}

function separarRef(ref: string): { col: number; fila: number } {
  const m = ref.match(/^([A-Z]{1,3})([0-9]{1,7})$/)
  if (!m) return { col: 0, fila: 0 }
  let col = 0
  for (const ch of m[1]) col = col * 26 + (ch.charCodeAt(0) - 64)
  return { col: col - 1, fila: Number(m[2]) }
}

export function nombreColumna(indice: number): string {
  let n = indice + 1
  let salida = ''
  while (n > 0) {
    const resto = (n - 1) % 26
    salida = String.fromCharCode(65 + resto) + salida
    n = Math.floor((n - 1) / 26)
  }
  return salida
}

export function crearHoja(celdas: Record<string, string>) {
  const cache: Record<string, Valor> = {}
  const enProceso = new Set<string>()

  const valorDe = (ref: string): Valor => {
    const clave = ref.replace(/\$/g, '').toUpperCase()
    if (clave in cache) return cache[clave]
    if (enProceso.has(clave)) return '#¡CIRCULAR!'
    enProceso.add(clave)
    const crudo = (celdas[clave] ?? '').toString().trim()
    let valor: Valor = ''
    if (crudo === '') {
      valor = ''
    } else if (crudo.startsWith('=')) {
      try {
        valor = comoEscalar(evaluarFormula(crudo, { valorDe, rangoDe }))
        if (typeof valor === 'number' && !Number.isFinite(valor)) valor = '#¡ERROR!'
        if (typeof valor === 'number') valor = Math.round(valor * 1e6) / 1e6
      } catch (e) {
        valor = '#¡ERROR!'
      }
    } else if (/^-?\d+(\.\d+)?$/.test(crudo)) {
      valor = Number(crudo)
    } else {
      valor = crudo
    }
    enProceso.delete(clave)
    cache[clave] = valor
    return valor
  }

  const rangoDe = (ref: string): Rango => {
    const [ini, fin] = ref.split(':')
    const a = separarRef(ini)
    const b = separarRef(fin)
    const filaIni = Math.min(a.fila, b.fila)
    const filaFin = Math.max(a.fila, b.fila)
    const colIni = Math.min(a.col, b.col)
    const colFin = Math.max(a.col, b.col)
    const filas: Valor[][] = []
    for (let f = filaIni; f <= filaFin; f++) {
      const fila: Valor[] = []
      for (let c = colIni; c <= colFin; c++) {
        fila.push(valorDe(`${nombreColumna(c)}${f}`))
      }
      filas.push(fila)
    }
    return new Rango(filas, ref)
  }

  return { valorDe, rangoDe }
}

export function formatearValor(v: Valor): string {
  if (v === '' || v === undefined || v === null) return ''
  if (typeof v === 'boolean') return v ? 'VERDADERO' : 'FALSO'
  if (typeof v === 'number') {
    if (Number.isInteger(v)) return String(v)
    return String(Math.round(v * 100) / 100)
  }
  return String(v)
}
