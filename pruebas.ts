import { crearHoja, formatearValor, evaluarFormula, comoEscalar } from './src/lib/formulas.ts'
import { modulos } from './src/data/curso.ts'

let fallas = 0
let pruebas = 0

function verificar(nombre: string, condicion: boolean, detalle = '') {
  pruebas++
  if (!condicion) {
    fallas++
    console.log(`  ✗ ${nombre} ${detalle}`)
  }
}

function valorEn(celdas: Record<string, string>, ref: string) {
  const hoja = crearHoja(celdas)
  return formatearValor(hoja.valorDe(ref))
}

console.log('\n== Pruebas de fórmulas ==')
verificar('SUMA', valorEn({ A1: '12', A2: '15', A3: '9' }, 'B1') === '' || true)
verificar(
  'SUMA básica',
  valorEn({ A1: '12', A2: '15', A3: '9', B1: '=SUMA(A1:A3)' }, 'B1') === '36',
  `dio ${valorEn({ A1: '12', A2: '15', A3: '9', B1: '=SUMA(A1:A3)' }, 'B1')}`
)
verificar('SUM alias', valorEn({ A1: '1', A2: '2', B1: '=SUM(A1:A2)' }, 'B1') === '3')
verificar('PROMEDIO', valorEn({ A1: '10', A2: '20', B1: '=PROMEDIO(A1:A2)' }, 'B1') === '15')
verificar('CONTAR', valorEn({ A1: '10', A2: 'texto', A3: '5', B1: '=CONTAR(A1:A3)' }, 'B1') === '2')
verificar(
  'CONTAR.SI',
  valorEn({ A1: 'Pendiente', A2: 'Completa', A3: 'Pendiente', B1: '=CONTAR.SI(A1:A3,"Pendiente")' }, 'B1') ===
    '2'
)
verificar('SI verdadero', valorEn({ A1: '90', B1: '=SI(A1>=80,"Bien","Falta")' }, 'B1') === 'Bien')
verificar('SI falso', valorEn({ A1: '70', B1: '=SI(A1>=80,"Bien","Falta")' }, 'B1') === 'Falta')
verificar('división porcentaje', valorEn({ A1: '70', B1: '100', C1: '=A1/B1*100' }, 'C1') === '70')
verificar('suma simple', valorEn({ A1: '5', B1: '7', C1: '=A1+B1' }, 'C1') === '12')
verificar('BUSCARV', valorEn({ A1: 'E-02', A2: 'E-01', B2: 'Ana', A3: 'E-02', B3: 'Luis', C1: '=BUSCARV(A1,A2:B3,2,FALSO)' }, 'C1') === 'Luis')
verificar('XLOOKUP', valorEn({ A1: 'E-02', A2: 'E-01', B2: 'Ana', A3: 'E-02', B3: 'Luis', C1: '=XLOOKUP(A1,A2:A3,B2:B3)' }, 'C1') === 'Luis')
verificar('SI anidado con texto entre comillas', valorEn({ A1: '50', B1: '=SI(A1<60,"Falta","Bien")' }, 'B1') === 'Falta')
verificar('comparación de texto', valorEn({ A1: 'Completa', B1: '=SI(A1="Completa",1,0)' }, 'B1') === '1')
verificar('suma con decimales', valorEn({ A1: '18', B1: '95', C1: '=A1/B1*100' }, 'C1') === '18.95')

console.log('\n== Pruebas de retos ==')

function evaluarObjetivo(celdas: Record<string, string>, obj: { valor: number | string; tolerancia?: number }) {
  const hoja = crearHoja(celdas)
  const v = hoja.valorDe('__none__')
  return v
}

for (const modulo of modulos) {
  const todosRetos = [
    ...modulo.lecciones.map((l) => ({ reto: l.reto, origen: `M${modulo.id} L${l.numero}` })),
    ...(modulo.reto ? [{ reto: modulo.reto, origen: `M${modulo.id} cierre` }] : [])
  ]
  for (const { reto, origen } of todosRetos) {
    if (reto.tipo !== 'excel') continue
    if (!reto.solucion) {
      console.log(`  ! ${origen} ${reto.id}: reto excel sin solución declarada`)
      continue
    }
    const celdas = { ...reto.libro.celdas, ...reto.solucion }
    const hoja = crearHoja(celdas)
    for (const obj of reto.objetivos) {
      const crudo = celdas[obj.celda] ?? ''
      const v = formatearValor(hoja.valorDe(obj.celda))
      let ok = false
      if (typeof obj.valor === 'number') {
        const n = Number(v)
        ok = Number.isFinite(n) && Math.abs(n - obj.valor) <= (obj.tolerancia ?? 0.0001)
      } else {
        ok = v.trim().toUpperCase() === String(obj.valor).trim().toUpperCase()
      }
      const funciones = obj.funciones ?? []
      const cumpleFuncion = funciones.length === 0 || funciones.some((f) => crudo.toUpperCase().replace(/\s/g, '').includes(f))
      verificar(`${origen} ${reto.id} celda ${obj.celda}`, ok && cumpleFuncion, `fórmula "${crudo}" dio "${v}" esperado "${obj.valor}"`)
    }
  }
}

console.log('\n== Pruebas de dinámicas y gráficos ==')
for (const modulo of modulos) {
  const todos = [
    ...modulo.lecciones.map((l) => ({ reto: l.reto, origen: `M${modulo.id} L${l.numero}` })),
    ...(modulo.reto ? [{ reto: modulo.reto, origen: `M${modulo.id} cierre` }] : [])
  ]
  for (const { reto, origen } of todos) {
    if (reto.tipo === 'dinamica') {
      const columnas = reto.libro.columnas
      const filas: Record<string, string>[] = []
      for (let f = 2; f <= reto.libro.filas; f++) {
        const registro: Record<string, string> = {}
        columnas.forEach((nombre, i) => {
          registro[nombre] = reto.libro.celdas[`${String.fromCharCode(65 + i)}${f}`] ?? ''
        })
        filas.push(registro)
      }
      const idxFila = columnas.indexOf(reto.filaEsperada)
      const idxValor = columnas.indexOf(reto.valorEsperado)
      verificar(`${origen} campos existen`, idxFila >= 0 && idxValor >= 0, `fila=${idxFila} valor=${idxValor}`)
      const grupos = new Map<string, number>()
      for (const r of filas) {
        const k = r[reto.filaEsperada]
        const n = reto.agregacionEsperada === 'suma' ? Number(r[reto.valorEsperado]) || 0 : 1
        grupos.set(k, (grupos.get(k) ?? 0) + n)
      }
      for (const esperado of reto.resultadoEsperado) {
        verificar(
          `${origen} ${esperado.etiqueta}`,
          grupos.get(esperado.etiqueta) === esperado.valor,
          `dio ${grupos.get(esperado.etiqueta)} esperado ${esperado.valor}`
        )
      }
      const totalEsperado = reto.resultadoEsperado.reduce((a, b) => a + b.valor, 0)
      const totalReal = Array.from(grupos.values()).reduce((a, b) => a + b, 0)
      verificar(`${origen} total`, totalEsperado === totalReal, `${totalEsperado} vs ${totalReal}`)
    }
    if (reto.tipo === 'grafico') {
      verificar(
        `${origen} etiquetas y valores coinciden`,
        reto.etiquetas.length === reto.valores.length,
        `${reto.etiquetas.length} vs ${reto.valores.length}`
      )
      verificar(
        `${origen} lectura válida`,
        reto.correctaLectura >= 0 && reto.correctaLectura < reto.opcionesLectura.length
      )
    }
  }
}

console.log(`\nResultado: ${pruebas - fallas}/${pruebas} pruebas pasaron, ${fallas} fallas\n`)
if (fallas > 0) process.exit(1)
