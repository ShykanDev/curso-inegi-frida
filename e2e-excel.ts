import { chromium } from 'playwright'

const BASE = 'http://127.0.0.1:5199'
let fallas = 0
let pruebas = 0
function verificar(nombre: string, condicion: boolean, detalle = '') {
  pruebas++
  if (!condicion) {
    fallas++
    console.log(`  ✗ ${nombre}${detalle ? ' → ' + detalle : ''}`)
  } else {
    console.log(`  ✓ ${nombre}`)
  }
}

const navegador = await chromium.launch()
const pagina = await navegador.newPage({ viewport: { width: 1400, height: 1000 } })
const errores: string[] = []
pagina.on('pageerror', (e) => errores.push(e.message))

async function irALeccion(regex: RegExp) {
  await pagina.goto(`${BASE}/#/modulo/1`, { waitUntil: 'networkidle' })
  await pagina.waitForTimeout(300)
  await pagina.getByRole('button', { name: regex }).click()
  await pagina.waitForTimeout(450)
}

console.log('\n== 1.11 Formato condicional: lo aplica ELLA ===')
await irALeccion(/1\.11 · Formato/)
const r11 = pagina.getByRole('region', { name: 'Reto 1.11' })
verificar('existe botón Formato condicional', await r11.getByRole('button', { name: 'Formato' }).isVisible())
await r11.getByRole('button', { name: 'Formato' }).click()
await pagina.waitForTimeout(250)
const panelFormato = r11.locator('text=Pinta las celdas solas')
verificar('se abre el panel de formato', await panelFormato.isVisible())

const inputs = r11.locator('input[placeholder="B2:B6"]')
await inputs.fill('B2:B7')
await r11.locator('select').first().selectOption('mayor')
await r11.locator('input[placeholder="80"]').fill('80')
await r11.locator('select').nth(1).selectOption('verde')
await r11.getByRole('button', { name: 'Aplicar formato' }).click()
await pagina.waitForTimeout(350)

const celdasVerdes = await r11.locator('td.font-semibold').count()
verificar('las celdas se pintan solas', celdasVerdes >= 3, `${celdasVerdes} celdas con formato`)

await r11.getByRole('button', { name: 'Revisar mi trabajo' }).click()
await pagina.waitForTimeout(300)
const msg11 = (await r11.locator('[role="status"]').first().textContent()) ?? ''
verificar('acepta el formato correcto', msg11.includes('correcto') || msg11.includes('Bien'), `"${msg11.slice(0, 70)}"`)

console.log('\n== 1.12 Semáforo de 3 reglas ===')
await irALeccion(/1\.12 · Dos reglas/)
const r12 = pagina.getByRole('region', { name: 'Reto 1.12' })
await r12.getByRole('button', { name: 'Formato' }).click()
await pagina.waitForTimeout(250)
await r12.locator('input[placeholder="B2:B6"]').fill('B2:B7')
await r12.locator('select').first().selectOption('mayor')
await r12.locator('input[placeholder="80"]').fill('80')
await r12.locator('select').nth(1).selectOption('verde')
await r12.getByRole('button', { name: 'Aplicar formato' }).click()
await pagina.waitForTimeout(250)
await r12.locator('select').first().selectOption('entre')
await r12.locator('input[placeholder="80"]').fill('60')
await r12.locator('input[placeholder="100"]').fill('80')
await r12.locator('select').nth(1).selectOption('amarillo')
await r12.getByRole('button', { name: 'Aplicar formato' }).click()
await pagina.waitForTimeout(250)
await r12.locator('select').first().selectOption('menor')
await r12.locator('input[placeholder="80"]').fill('60')
await r12.locator('select').nth(1).selectOption('rojo')
await r12.getByRole('button', { name: 'Aplicar formato' }).click()
await pagina.waitForTimeout(350)
await r12.getByRole('button', { name: 'Revisar mi trabajo' }).click()
await pagina.waitForTimeout(300)
const msg12 = (await r12.locator('[role="status"]').first().textContent()) ?? ''
verificar('acepta las 3 reglas', msg12.includes('correcto') || msg12.includes('Bien'), `"${msg12.slice(0, 70)}"`)

console.log('\n== 1.13 Gráfica de barras hecha por ella ===')
await irALeccion(/1\.13 · Tu primera gráfica/)
const r13 = pagina.getByRole('region', { name: 'Reto 1.13' })
await r13.getByRole('button', { name: 'Gráfica' }).click()
await pagina.waitForTimeout(250)
await r13.locator('select').first().selectOption('barras')
await r13.locator('input[placeholder="A1:B6"]').fill('A1:B7')
await r13.locator('input[placeholder="Avance por alcaldía"]').fill('Completas por alcaldía')
await r13.getByRole('button', { name: 'Crear gráfica' }).click()
await pagina.waitForTimeout(500)
const graficaVisible = await r13.locator('figure').isVisible()
verificar('la gráfica se dibuja dentro del simulador', graficaVisible)
const textoGrafica = (await r13.locator('figure').textContent()) ?? ''
verificar('la gráfica trae sus etiquetas reales', textoGrafica.includes('Benito Juárez') && textoGrafica.includes('Iztapalapa'), textoGrafica.slice(0, 80))
await r13.getByRole('button', { name: 'Revisar mi trabajo' }).click()
await pagina.waitForTimeout(300)
const msg13 = (await r13.locator('[role="status"]').first().textContent()) ?? ''
verificar('acepta la gráfica de barras', msg13.includes('correcto') || msg13.includes('Bien'), `"${msg13.slice(0, 70)}"`)

console.log('\n== 1.14 Gráfica de pastel ===')
await irALeccion(/1\.14 · Gráfica de pastel/)
const r14 = pagina.getByRole('region', { name: 'Reto 1.14' })
await r14.getByRole('button', { name: 'Gráfica' }).click()
await pagina.waitForTimeout(250)
await r14.locator('select').first().selectOption('pastel')
await r14.locator('input[placeholder="A1:B6"]').fill('A1:B4')
await r14.locator('input[placeholder="Avance por alcaldía"]').fill('Completas vs pendientes')
await r14.getByRole('button', { name: 'Crear gráfica' }).click()
await pagina.waitForTimeout(500)
const pastelTexto = (await r14.locator('figure').textContent()) ?? ''
verificar('el pastel muestra porcentajes', pastelTexto.includes('%'), pastelTexto.slice(0, 80))
await r14.getByRole('button', { name: 'Revisar mi trabajo' }).click()
await pagina.waitForTimeout(300)
const msg14 = (await r14.locator('[role="status"]').first().textContent()) ?? ''
verificar('acepta el pastel', msg14.includes('correcto') || msg14.includes('Bien'), `"${msg14.slice(0, 70)}"`)

console.log('\n== 1.15 Todo junto (fórmula + formato + gráfica) ===')
await irALeccion(/1\.15 · Todo junto/)
const r15 = pagina.getByRole('region', { name: 'Reto 1.15' })
const tabla15 = r15.locator('table').first()
const escribir = async (fila, col, texto) => {
  await tabla15.locator('tbody tr').nth(fila).locator('td').nth(col).click()
  await pagina.waitForTimeout(120)
  await pagina.keyboard.type(texto)
  await pagina.keyboard.press('Enter')
  await pagina.waitForTimeout(220)
}
verificar('la tabla tiene la columna de cobertura', (await tabla15.locator('thead th').count()) >= 5, `${await tabla15.locator('thead th').count()}`)

console.log('\n== La gráfica de 1.15 debe graficar COBERTURA, no seleccionadas ==')
await escribir(0, 4, '=C2/B2*100')
await escribir(1, 4, '=C3/B3*100')
await escribir(2, 4, '=C4/B4*100')
await r15.getByRole('button', { name: 'Gráfica' }).click()
await pagina.waitForTimeout(250)
await r15.locator('select').first().selectOption('barras')
await r15.locator('input[placeholder="A1:B6"]').fill('A1:D4')
await r15.getByRole('button', { name: 'Crear gráfica' }).click()
await pagina.waitForTimeout(500)
const textoG15 = (await r15.locator('figure').textContent()) ?? ''
verificar('grafica la cobertura (70/80), no las seleccionadas (120)', textoG15.includes('70') && textoG15.includes('80') && !textoG15.includes('120'), textoG15.slice(0, 140))

console.log('\n== Solución: si se atora, ve exactamente cómo se hace ===')
await irALeccion(/1\.15 · Todo junto/)
const r15b = pagina.getByRole('region', { name: 'Reto 1.15' })
verificar('existe el botón de solución', await r15b.getByRole('button', { name: 'Ver la solución en el simulador' }).isVisible())
await r15b.getByRole('button', { name: 'Ver la solución en el simulador' }).click()
await pagina.waitForTimeout(600)
const tablaSol = r15b.locator('table').first()
const filaD2 = (await tablaSol.locator('tbody tr').nth(0).textContent()) ?? ''
verificar('la solución carga la fórmula en D2', filaD2.includes('70'), `fila: ${filaD2}`)
const pintadas = await r15b.locator('td.font-semibold').count()
verificar('la solución también pinta el semáforo', pintadas > 0, `${pintadas}`)
const grafSol = await r15b.locator('figure').count()
verificar('la solución también crea la gráfica', grafSol > 0, `${grafSol}`)
const textoRespuesta = (await r15b.textContent()) ?? ''
verificar('explica la respuesta', textoRespuesta.includes('Respuesta modelo'))

console.log('\n== Errores de página ==')
verificar('sin errores de página', errores.length === 0, errores.slice(0, 2).join(' | '))

await pagina.goto(`${BASE}/#/modulo/1`, { waitUntil: 'networkidle' })
await pagina.waitForTimeout(400)
await pagina.getByRole('button', { name: /1\.12 · Dos reglas/ }).click()
await pagina.waitForTimeout(500)
const r12b = pagina.getByRole('region', { name: 'Reto 1.12' })
await r12b.getByRole('button', { name: 'Ver la solución en el simulador' }).click()
await pagina.waitForTimeout(600)
await r12b.screenshot({ path: 'captura-formato.png' })

await navegador.close()
console.log(`\nExcel ampliado: ${pruebas - fallas}/${pruebas} verificaciones pasaron\n`)
process.exit(fallas > 0 ? 1 : 0)
