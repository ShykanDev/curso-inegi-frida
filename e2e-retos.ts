import { chromium } from 'playwright'

const BASE = 'http://127.0.0.1:5199'
let fallas = 0
let pruebas = 0

function verificar(nombre: string, condicion: boolean, detalle = '') {
  pruebas++
  if (!condicion) {
    fallas++
    console.log(`  ✗ ${nombre} ${detalle}`)
  } else {
    console.log(`  ✓ ${nombre}`)
  }
}

const navegador = await chromium.launch()
const contexto = await navegador.newContext({ viewport: { width: 1400, height: 1000 } })
const pagina = await contexto.newPage()
const errores: string[] = []
pagina.on('pageerror', (e) => errores.push(e.message))

async function irALeccion(moduloId: number, botonRegex: RegExp, regionName: string) {
  await pagina.goto(`${BASE}/#/modulo/${moduloId}`, { waitUntil: 'networkidle' })
  await pagina.waitForTimeout(300)
  await pagina.getByRole('button', { name: botonRegex }).click()
  await pagina.waitForTimeout(400)
  return pagina.getByRole('region', { name: regionName })
}

console.log('\n== Tabla dinámica (1.8) ==')
const retoDin = await irALeccion(1, /1\.8 · Tablas dinámicas/, 'Reto 1.8')
await retoDin.locator('select').nth(0).selectOption({ label: 'Entrevistador' })
await retoDin.locator('select').nth(1).selectOption({ label: 'Completas' })
await retoDin.locator('select').nth(2).selectOption('suma')
await pagina.waitForTimeout(250)
const tablaDin = await retoDin.locator('table').textContent()
verificar('suma los valores reales', (tablaDin ?? '').includes('18') && (tablaDin ?? '').includes('12'))
await retoDin.getByRole('button', { name: 'Revisar mi respuesta' }).click()
await pagina.waitForTimeout(300)
const msgDin = await retoDin.locator('[role="status"]').first().textContent()
verificar('valida tabla dinámica', (msgDin ?? '').includes('tabulador') || (msgDin ?? '').includes('Excelente'), `"${msgDin}"`)

console.log('\n== Validación con 5 errores (cierre M2) ==')
await pagina.goto(`${BASE}/#/modulo/2`, { waitUntil: 'networkidle' })
await pagina.waitForTimeout(400)
const retoVal = pagina.getByRole('region', { name: 'Reto cierre' })
const botonesMarcar = retoVal.getByRole('button', { name: /Marcar fila/ })
verificar('10 filas con botón de marcar', (await botonesMarcar.count()) === 10, `hay ${await botonesMarcar.count()}`)
for (const fila of [2, 3, 5, 7, 9]) await botonesMarcar.nth(fila - 1).click()
await pagina.waitForTimeout(200)
const areas = retoVal.locator('textarea')
verificar('aparecen 5 observaciones', (await areas.count()) === 5, `hay ${await areas.count()}`)
for (let i = 0; i < 5; i++) await areas.nth(i).fill('Revisar este dato con el entrevistador, no se corrige a ojo.')
await retoVal.getByRole('button', { name: 'Revisar mi validación' }).click()
await pagina.waitForTimeout(300)
const msgVal = await retoVal.locator('[role="status"]').first().textContent()
verificar('valida los 5 errores correctos', (msgVal ?? '').includes('lograste'), `"${msgVal}"`)

console.log('\n== Marcar fila incorrecta avisa ==')
await botonesMarcar.nth(0).click()
await retoVal.getByRole('button', { name: 'Revisar mi validación' }).click()
await pagina.waitForTimeout(250)
const msgSobra = await retoVal.locator('[role="status"]').first().textContent()
verificar('detecta fila de más', (msgSobra ?? '').includes('correcta') || (msgSobra ?? '').includes('Revisa'), `"${msgSobra}"`)

console.log('\n== Reto Word (4.1) ==')
const retoWord = await irALeccion(4, /4\.1 · Word/, 'Reto 4.1')
const selectsWord = retoWord.locator('select')
await selectsWord.nth(0).selectOption({ index: 1 })
await selectsWord.nth(1).selectOption({ index: 2 })
await selectsWord.nth(2).selectOption({ index: 1 })
await pagina.waitForTimeout(250)
const totalWord = await retoWord.textContent()
verificar('vista previa con total 70', (totalWord ?? '').includes('70'))
await retoWord.getByRole('button', { name: 'Revisar mi reporte' }).click()
await pagina.waitForTimeout(300)
const msgWord = await retoWord.locator('[role="status"]').first().textContent()
verificar('valida el oficio', (msgWord ?? '').includes('oficio') || (msgWord ?? '').includes('Muy bien'), `"${msgWord}"`)

console.log('\n== Reto gráfico (cierre M3) ==')
await pagina.goto(`${BASE}/#/modulo/3`, { waitUntil: 'networkidle' })
await pagina.waitForTimeout(400)
const retoGraf = pagina.getByRole('region', { name: 'Reto cierre' })
await retoGraf.getByRole('button', { name: 'Gráfica de barras' }).click()
await pagina.waitForTimeout(200)
await retoGraf.getByRole('button', { name: /Veracruz/ }).click()
await retoGraf.getByRole('button', { name: 'Revisar mi respuesta' }).click()
await pagina.waitForTimeout(300)
const msgGraf = await retoGraf.locator('[role="status"]').first().textContent()
verificar('valida gráfico + lectura', (msgGraf ?? '').includes('Módulo 3') || (msgGraf ?? '').includes('Veracruz'), `"${msgGraf}"`)
const guardadoGraf = await pagina.evaluate(() => localStorage.getItem('inegi-frida-curso:progreso'))
verificar('reto de gráfico guardado como completado', !!guardadoGraf && guardadoGraf.includes('3-cierre'))

console.log('\n== Simulación del día (cierre M5) ==')
await pagina.goto(`${BASE}/#/modulo/5`, { waitUntil: 'networkidle' })
await pagina.waitForTimeout(400)
const retoSim = pagina.getByRole('region', { name: 'Reto cierre' })
for (let paso = 0; paso < 4; paso++) {
  const correctas = ['Las completas, pendientes y no respuesta del día', 'Fecha, folio, título, tabla con total y firma', 'Observar, anotar dudas y comentarlas al final', 'Que los totales cuadren, la fecha sea correcta y el folio no se repita']
  await retoSim.getByRole('button', { name: correctas[paso] }).click()
  await retoSim.getByRole('button', { name: 'Confirmar' }).click()
  await pagina.waitForTimeout(200)
  const sig = retoSim.getByRole('button', { name: /Siguiente parte del día|Terminar mi día/ })
  await sig.click()
  await pagina.waitForTimeout(250)
}
const msgSim = await retoSim.locator('[role="status"]').first().textContent()
verificar('completa el día simulado', (msgSim ?? '').includes('lograste') || (msgSim ?? '').includes('día'), `"${msgSim}"`)

console.log('\n== Progreso acumulado ==')
await pagina.goto(`${BASE}/#/progreso`, { waitUntil: 'networkidle' })
await pagina.waitForTimeout(400)
const prog = await pagina.textContent('body')
verificar('insignia Reportera INEGI lograda', /Reportera INEGI[\s\S]{0,200}Lograda/.test(prog ?? ''))
verificar('insignia Validadora lograda', /Validadora[\s\S]{0,200}Lograda/.test(prog ?? ''))

console.log('\n== Captura de pantalla ==')
await pagina.goto(`${BASE}/#/modulo/1`, { waitUntil: 'networkidle' })
await pagina.waitForTimeout(600)
await pagina.screenshot({ path: 'captura-modulo1.png', fullPage: false })
await pagina.goto(`${BASE}/#/`, { waitUntil: 'networkidle' })
await pagina.waitForTimeout(400)
await pagina.screenshot({ path: 'captura-inicio.png', fullPage: false })
console.log('  ✓ capturas guardadas')

verificar('sin errores de página', errores.length === 0, errores.slice(0, 2).join(' | '))

await navegador.close()
console.log(`\nRetos: ${pruebas - fallas}/${pruebas} verificaciones pasaron\n`)
process.exit(fallas > 0 ? 1 : 0)
