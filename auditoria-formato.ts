import { evaluarRegla, rangoDesdeTexto, datosParaGrafico, normalizarRango, reglasIguales } from './src/lib/formatoExcel.ts'
import { modulos } from './src/data/curso.ts'
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

console.log('\n=== A. Rangos ===')
const r = rangoDesdeTexto('B2:B7')
verificar('rango B2:B7 tiene 6 celdas', r?.celdas.length === 6, `${r?.celdas.length}`)
verificar('rango normaliza al revés', normalizarRango('B7', 'B2').ini === 'B2')
verificar('rango con $', rangoDesdeTexto('$B$2:$B$7')?.celdas.length === 6)
verificar('rango inválido da null', rangoDesdeTexto('hola') === null)

console.log('\n=== B. Formato condicional evalúa igual que Excel ===')
verificar('mayor que 80 con 92', evaluarRegla(92, { condicion: 'mayor', valor: 80, color: 'verde' }))
verificar('mayor que 80 con 80 es falso', !evaluarRegla(80, { condicion: 'mayor', valor: 80, color: 'verde' }))
verificar('menor que 60 con 55', evaluarRegla(55, { condicion: 'menor', valor: 60, color: 'rojo' }))
verificar('entre 60 y 80 con 78', evaluarRegla(78, { condicion: 'entre', valor: 60, valor2: 80, color: 'amarillo' }))
verificar('entre 60 y 80 con 80', evaluarRegla(80, { condicion: 'entre', valor: 60, valor2: 80, color: 'amarillo' }))
verificar('entre 60 y 80 con 55 es falso', !evaluarRegla(55, { condicion: 'entre', valor: 60, valor2: 80, color: 'amarillo' }))
verificar('contiene texto', evaluarRegla('Pendiente', { condicion: 'contiene', valor: 'pend', color: 'amarillo' }))
verificar('contiene es insensible a mayúsculas', evaluarRegla('COMPLETA', { condicion: 'contiene', valor: 'completa', color: 'verde' }))
verificar('igual a texto', evaluarRegla('Completa', { condicion: 'igual', valor: 'Completa', color: 'verde' }))
verificar('texto no evalúa como mayor', !evaluarRegla('hola', { condicion: 'mayor', valor: 80, color: 'verde' }))
verificar('vacío no cumple mayor', !evaluarRegla('', { condicion: 'mayor', valor: 0, color: 'verde' }))

console.log('\n=== C. Gráficas: datos correctos ===')
const libro = {
  A1: 'Alcaldía', B1: 'Completas',
  A2: 'Benito Juárez', B2: '92',
  A3: 'Coyoacán', B3: '85',
  A4: 'Iztapalapa', B4: '55'
}
const hoja = crearHoja(libro)
const datos = datosParaGrafico(libro, (ref) => hoja.valorDe(ref) as string | number, 'A1:B4')
verificar('3 barras (sin encabezado)', datos.length === 3, `${datos.length}`)
verificar('etiqueta correcta', datos[0].etiqueta === 'Benito Juárez', datos[0]?.etiqueta)
verificar('valor correcto', datos[0].valor === 92, String(datos[0]?.valor))
verificar('la más baja es Iztapalapa 55', datos[2].etiqueta === 'Iztapalapa' && datos[2].valor === 55)
verificar('rango inexistente da vacío', datosParaGrafico(libro, (r) => hoja.valorDe(r) as never, 'X1:X9').length === 0)

console.log('\n=== D. Cada reto nuevo tiene solución completa ===')
const nuevos = ['1.11-r', '1.12-r', '1.13-r', '1.14-r', '1.15-r']
for (const id of nuevos) {
  const reto = modulos.flatMap((m) => [...m.lecciones.map((l) => l.reto), ...(m.reto ? [m.reto] : [])]).find((r) => r.id === id)
  verificar(`reto ${id} existe`, !!reto)
  if (!reto || reto.tipo !== 'excel') continue
  const tieneAlgo =
    (reto.objetivos && reto.objetivos.length > 0) || reto.formatoRequerido || reto.graficoRequerido
  verificar(`${id} pide algo verificable`, !!tieneAlgo)
  if (reto.formatoRequerido) {
    verificar(`${id} tiene solución de formato`, !!reto.solucionFormato)
    if (reto.solucionFormato) {
      verificar(`${id} solución de formato coincide`, reglasIguales(reto.formatoRequerido[0].reglas, reto.solucionFormato[0].reglas))
    }
  }
  if (reto.graficoRequerido) {
    verificar(`${id} tiene solución de gráfica`, !!reto.solucionGrafico)
    verificar(`${id} gráfica coincide en tipo`, reto.solucionGrafico?.tipo === reto.graficoRequerido.tipo)
  }
}

console.log('\n=== E. Los retos 1.15 calculan lo esperado con su solución ===')
const reto15 = modulos.flatMap((m) => m.lecciones.map((l) => l.reto)).find((r) => r.id === '1.15-r')
if (reto15 && reto15.tipo === 'excel') {
  const celdas = { ...reto15.libro.celdas, ...(reto15.solucion ?? {}) }
  const h = crearHoja(celdas)
  for (const obj of reto15.objetivos) {
    const v = formatearValor(h.valorDe(obj.celda))
    const n = Number(v)
    const ok = typeof obj.valor === 'number' && Math.abs(n - obj.valor) <= (obj.tolerancia ?? 0.0001)
    verificar(`1.15 ${obj.celda} = ${obj.valor}`, ok, `dio ${v}`)
  }
}

console.log(`\nAuditoría formato/gráficas: ${pruebas - fallas}/${pruebas} correctas, ${fallas} problemas\n`)
process.exit(fallas > 0 ? 1 : 0)
