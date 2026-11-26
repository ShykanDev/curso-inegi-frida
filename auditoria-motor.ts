import { crearHoja, formatearValor } from './src/lib/formulas.ts'

let fallas = 0
let pruebas = 0
function verificar(nombre: string, condicion: boolean, detalle = '') {
  pruebas++
  if (!condicion) {
    fallas++
    console.log(`  ✗ ${nombre}${detalle ? ' → ' + detalle : ''}`)
  }
}

const v = (celdas: Record<string, string>, ref: string) => formatearValor(crearHoja(celdas).valorDe(ref))

console.log('\n=== 1. Paridad con Excel ===')
verificar('SUMA de rango', v({ A1: '1', A2: '2', A3: '3', B1: '=SUMA(A1:A3)' }, 'B1') === '6')
verificar('SUMA ignora texto', v({ A1: '1', A2: 'hola', A3: '3', B1: '=SUMA(A1:A3)' }, 'B1') === '4')
verificar('celda vacía suma 0', v({ A1: '5', B1: '=A1+C1' }, 'B1') === '5')
verificar('PROMEDIO ignora texto', v({ A1: '10', A2: 'x', A3: '20', B1: '=PROMEDIO(A1:A3)' }, 'B1') === '15')
verificar('CONTAR solo números', v({ A1: '1', A2: 'x', A3: '3', B1: '=CONTAR(A1:A3)' }, 'B1') === '2')
verificar('CONTAR.SI', v({ A1: 'Pendiente', A2: 'Completa', B1: '=CONTAR.SI(A1:A2,"Pendiente")' }, 'B1') === '1')
verificar('CONTAR.SI tolera espacio final', v({ A1: 'Completa ', B1: '=CONTAR.SI(A1,"Completa")' }, 'B1') === '1')
verificar('SI', v({ A1: '70', B1: '=SI(A1>=80,"Bien","Falta")' }, 'B1') === 'Falta')
verificar('porcentaje', v({ A1: '70', B1: '100', C1: '=A1/B1*100' }, 'C1') === '70')
verificar('BUSCARV', v({ A1: 'E-02', D1: 'E-01', E1: 'Ana', D2: 'E-02', E2: 'Luis', B1: '=BUSCARV(A1,D1:E2,2,FALSO)' }, 'B1') === 'Luis')
verificar('división entre cero', v({ A1: '5', B1: '0', C1: '=A1/B1' }, 'C1') === '#¡DIV/0!')

console.log('\n=== 2. Anti-trampa: no escribir el resultado a mano ===')
const oSuma = { celda: 'B7', valor: 70, funciones: ['SUMA', 'SUM'] }
function valida(celdas: Record<string, string>, obj: { celda: string; valor: number | string; tolerancia?: number; funciones?: string[] }): boolean {
  const hoja = crearHoja(celdas)
  const crudo = (celdas[obj.celda] ?? '').toUpperCase().replace(/\s/g, '')
  const valor = hoja.valorDe(obj.celda)
  const texto = formatearValor(valor)
  const funciones = obj.funciones ?? []
  const cumpleFuncion = funciones.length === 0 || funciones.some((f) => contieneFuncion(crudo, f))
  let cumpleValor = false
  if (typeof obj.valor === 'number') {
    const n = typeof valor === 'number' ? valor : Number(texto.replace(',', '.'))
    cumpleValor = Number.isFinite(n) && Math.abs(n - obj.valor) <= (obj.tolerancia ?? 0.0001)
  } else {
    cumpleValor = texto.trim().toUpperCase() === String(obj.valor).trim().toUpperCase()
  }
  return cumpleValor && cumpleFuncion && !usaSuPropiaCelda(crudo, obj.celda)
}
function contieneFuncion(crudo: string, funcion: string): boolean {
  if (funcion === '/') return crudo.includes('/')
  const nombres: string[] = []
  let i = 0
  while (i < crudo.length) {
    if ('=+-*/(,'.includes(crudo[i])) {
      let j = i + 1
      let nombre = ''
      while (j < crudo.length && /[A-Z0-9.]/.test(crudo[j])) {
        nombre += crudo[j]
        j++
      }
      if (nombre && crudo[j] === '(') nombres.push(nombre)
      i = j
      continue
    }
    i++
  }
  return nombres.includes(funcion)
}
function usaSuPropiaCelda(crudo: string, celda: string): boolean {
  const m = celda.toUpperCase().match(/^([A-Z]+)(\d+)$/)
  if (!m) return false
  const rangos = crudo.match(/[A-Z]+\d+:[A-Z]+\d+/g) ?? []
  return rangos.some((r) => {
    const [ini, fin] = r.split(':')
    const dentro = (ref: string) => {
      const mm = ref.match(/^([A-Z]+)(\d+)$/)
      return !!mm && mm[1] === m[1] && Number(mm[2]) === Number(m[2])
    }
    return dentro(ini) || dentro(fin)
  })
}

const semana = { B2: '12', B3: '15', B4: '9', B5: '20', B6: '14' }
verificar('escribir 70 a mano NO valida', !valida({ ...semana, B7: '70' }, oSuma))
verificar('=SUMA(B2:B6) SÍ valida', valida({ ...semana, B7: '=SUMA(B2:B6)' }, oSuma))
verificar('=SUMA(B2:B7) (incluye su celda) NO valida', !valida({ ...semana, B7: '=SUMA(B2:B7)' }, oSuma))
verificar('=PROMEDIO(B2:B7) tampoco', !valida({ ...semana, B7: '=PROMEDIO(B2:B7)' }, oSuma))
verificar('=B2+B3+B4+B5+B6 NO valida', !valida({ ...semana, B7: '=B2+B3+B4+B5+B6' }, oSuma))
verificar('=SUM alias SÍ valida', valida({ ...semana, B7: '=SUM(B2:B6)' }, oSuma))
verificar('CONTARA no pasa como CONTAR', !valida({ A1: '1', A2: 'x', B7: '=CONTARA(A1:A2)' }, { celda: 'B7', valor: 2, funciones: ['CONTAR', 'COUNT'] }))
verificar('CONTAR sí pasa', valida({ A1: '1', A2: '2', B7: '=CONTAR(A1:A2)' }, { celda: 'B7', valor: 2, funciones: ['CONTAR', 'COUNT'] }))
verificar('porcentaje a mano NO valida', !valida({ D2: '70' }, { celda: 'D2', valor: 70, tolerancia: 0.5, funciones: ['/'] }))
verificar('=C2/B2*100 SÍ valida', valida({ B2: '100', C2: '70', D2: '=C2/B2*100' }, { celda: 'D2', valor: 70, tolerancia: 0.5, funciones: ['/'] }))
verificar('SI literal NO valida', !valida({ D2: 'Falta' }, { celda: 'D2', valor: 'Falta', funciones: ['SI', 'IF'] }))
verificar('BUSCARV literal NO valida', !valida({ B3: 'Luis Ortega' }, { celda: 'B3', valor: 'Luis Ortega', funciones: ['BUSCARV', 'XLOOKUP'] }))

console.log('\n=== 3. Errores se propagan (no dan números falsos) ===')
verificar('circular da error, no un número', v({ A1: '=A1+1' }, 'A1').includes('CIRCULAR'))
verificar('circular de dos celdas da error', v({ A2: '=B2+1', B2: '=A2+1' }, 'A2').includes('CIRCULAR') || v({ A2: '=B2+1', B2: '=A2+1' }, 'A2').includes('#'))
verificar('SUMA con referencia circular no da falso total', v({ B2: '12', B3: '15', B4: '9', B5: '20', B6: '14', B7: '=SUMA(B2:B7)' }, 'B7').includes('#'))
verificar('div/0 se propaga por SUMA', v({ A1: '=1/0', B1: '=SUMA(A1:A1)' }, 'B1') === '#¡DIV/0!')
verificar('#N/A se propaga por suma aritmética', v({ A1: '=BUSCARV("x",C1:C2,1,FALSO)', B1: '=A1+5' }, 'B1').includes('#'))

console.log('\n=== 4. Lo que la alumna teclea debe funcionar ===')
verificar('símbolo $ en referencias', v({ A1: '5', B1: '=SUMA($A$1:$A$1)' }, 'B1') === '5')
verificar('minúsculas', v({ A1: '1', A2: '2', B1: '=suma(a1:a2)' }, 'B1') === '3')
verificar('espacios en la fórmula', v({ A1: '1', A2: '2', B1: '= SUMA ( A1 : A2 )' }, 'B1') === '3')
verificar('comillas tipográficas', v({ A1: 'x', B1: '=SI(A1="x","si","no")' }, 'B1') === 'si')
verificar('punto y coma', v({ A1: '1', A2: '2', B1: '=SUMA(A1;A2)' }, 'B1') === '3')
verificar('negativo', v({ A1: '-3', B1: '=A1*2' }, 'B1') === '-6')

console.log(`\nAuditoría: ${pruebas - fallas}/${pruebas} correctas, ${fallas} problemas\n`)
process.exit(fallas > 0 ? 1 : 0)
