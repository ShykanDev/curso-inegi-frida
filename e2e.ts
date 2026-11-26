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
const contexto = await navegador.newContext({ viewport: { width: 1280, height: 900 } })
const pagina = await contexto.newPage()

const erroresConsola: string[] = []
pagina.on('console', (m) => {
  if (m.type() === 'error') erroresConsola.push(m.text())
})
pagina.on('pageerror', (e) => erroresConsola.push(`PAGEERROR: ${e.message}`))

console.log('\n== Inicio ==')
await pagina.goto(BASE, { waitUntil: 'networkidle' })
verificar('saludo Hola, Frida', await pagina.getByText('Hola, Frida').first().isVisible())
verificar('subtítulo DREC', await pagina.getByText('Dirección Regional Centro').first().isVisible())
verificar('botón continuar', await pagina.getByRole('button', { name: /Continuar donde me quedé/ }).isVisible())
const tarjetasModulo = await pagina.locator('main a[href$="#/modulo/0"], main a[href$="#/modulo/1"], main a[href$="#/modulo/2"], main a[href$="#/modulo/3"], main a[href$="#/modulo/4"], main a[href$="#/modulo/5"]').count()
verificar('6 tarjetas de módulo en el contenido', tarjetasModulo === 6, `encontré ${tarjetasModulo}`)
verificar('nota del puesto exacto', (await pagina.content()).includes('Tu puesto exacto te lo confirmarán'))

console.log('\n== Módulo 1: simulador de Excel ==')
await pagina.goto(`${BASE}/#/modulo/1`, { waitUntil: 'networkidle' })
verificar('título del módulo', (await pagina.textContent('body'))?.includes('Excel desde cero') ?? false)
verificar('archivo del simulador', (await pagina.textContent('body'))?.includes('.xlsx') ?? false)
verificar('barra fx', await pagina.locator('text=fx').first().isVisible())

const retoUno = pagina.getByRole('region', { name: 'Reto 1.1' })
const tablaUno = retoUno.locator('table')
await tablaUno.locator('tbody tr').nth(0).locator('td').nth(2).click()
await pagina.waitForTimeout(150)
await pagina.keyboard.type('Azcapotzalco')
await pagina.keyboard.press('Enter')
await pagina.waitForTimeout(250)
const valorB2 = await tablaUno.locator('tbody tr').nth(0).locator('td').nth(2).textContent()
verificar('escribir texto en celda (B2)', (valorB2 ?? '').trim() === 'Azcapotzalco', `dio "${valorB2}"`)
await retoUno.getByRole('button', { name: 'Revisar mi fórmula' }).click()
await pagina.waitForTimeout(250)
const msgUno = await retoUno.locator('[role="status"]').first().textContent()
verificar('valida la celda de texto', (msgUno ?? '').includes('correctas'), `mensaje: "${msgUno}"`)

console.log('\n== Lección 1.3: SUMA con fórmula ==')
await pagina.getByRole('button', { name: /1\.3 · SUMA/ }).click()
await pagina.waitForTimeout(350)
const retoTres = pagina.getByRole('region', { name: 'Reto 1.3' })
const tablaTres = retoTres.locator('table')
const filaB7 = tablaTres.locator('tbody tr').last()
await filaB7.locator('td').nth(2).click()
await pagina.waitForTimeout(120)
await pagina.keyboard.type('=SUMA(B2:B6)')
await pagina.keyboard.press('Enter')
await pagina.waitForTimeout(250)
const valorB7 = await filaB7.locator('td').nth(2).textContent()
verificar('SUMA calcula en vivo (70)', (valorB7 ?? '').trim() === '70', `dio "${valorB7}"`)
await retoTres.getByRole('button', { name: 'Revisar mi fórmula' }).click()
await pagina.waitForTimeout(300)
const msgTres = await retoTres.locator('[role="status"]').first().textContent()
verificar('valida SUMA correcta', (msgTres ?? '').includes('Bien') || (msgTres ?? '').includes('correctas'), `mensaje: "${msgTres}"`)

console.log('\n== Fórmula incorrecta da pista clara ==')
const filaB7Incorrecta = filaB7
await filaB7Incorrecta.locator('td').nth(2).click()
await pagina.waitForTimeout(120)
await pagina.keyboard.type('=SUMA(B2:B3)')
await pagina.keyboard.press('Enter')
await pagina.waitForTimeout(200)
await retoTres.getByRole('button', { name: 'Revisar mi fórmula' }).click()
await pagina.waitForTimeout(300)
const msgMalo = await retoTres.locator('[role="status"]').first().textContent()
verificar('mensaje dice "Casi, mira la pista"', (msgMalo ?? '').includes('Casi, mira la pista'), `mensaje: "${msgMalo}"`)
verificar('no dice Incorrecto en grande', !(msgMalo ?? '').includes('Incorrecto'))

console.log('\n== Persistencia del progreso ==')
await pagina.evaluate(() => localStorage.clear())
await pagina.reload({ waitUntil: 'networkidle' })
await pagina.goto(`${BASE}/#/modulo/0`, { waitUntil: 'networkidle' })
const retoQuiz = pagina.getByRole('region', { name: 'Reto 0.1' })
await retoQuiz.getByRole('button', { name: /Un censo/ }).click()
await retoQuiz.getByRole('button', { name: 'Revisar mi respuesta' }).click()
await pagina.waitForTimeout(400)
const guardado = await pagina.evaluate(() => localStorage.getItem('inegi-frida-curso:progreso'))
verificar('guarda progreso en localStorage', !!guardado && guardado.includes('0.1-r'), `${guardado?.slice(0, 120)}`)
const mensajeQuiz = await retoQuiz.locator('[role="status"]').first().textContent()
verificar('mensaje motivador en acierto', (mensajeQuiz ?? '').includes('Bien'), `"${mensajeQuiz}"`)

await pagina.reload({ waitUntil: 'networkidle' })
await pagina.waitForTimeout(400)
await pagina.goto(`${BASE}/#/progreso`, { waitUntil: 'networkidle' })
await pagina.waitForTimeout(300)
const textoProgreso = (await pagina.textContent('body')) ?? ''
verificar('progreso sobrevive recarga', textoProgreso.includes('Mi progreso'))
verificar('insignias presentes', textoProgreso.includes('Primera suma') && textoProgreso.includes('Validadora'))
verificar('contador de retos > 0', !/Retos completados\s*0\s*\//.test(textoProgreso.replace(/\s+/g, ' ')))

console.log('\n== Reiniciar progreso ==')
await pagina.getByRole('button', { name: 'Reiniciar mi progreso' }).click()
await pagina.waitForTimeout(200)
verificar('pide confirmación', await pagina.getByText('¿Segura que quieres borrar todo?').isVisible())
await pagina.getByRole('button', { name: 'Sí, reiniciar' }).click()
await pagina.waitForTimeout(400)
const trasReiniciar = await pagina.evaluate(() => localStorage.getItem('inegi-frida-curso:progreso'))
verificar('borra el progreso', !!trasReiniciar && JSON.parse(trasReiniciar).retosHechos.length === 0)

console.log('\n== Todos los módulos renderizan ==')
for (let id = 0; id <= 5; id++) {
  await pagina.goto(`${BASE}/#/modulo/${id}`, { waitUntil: 'networkidle' })
  await pagina.waitForTimeout(250)
  const largo = (await pagina.textContent('body'))?.length ?? 0
  verificar(`módulo ${id} con contenido`, largo > 900, `largo ${largo}`)
}

console.log('\n== Móvil ==')
await pagina.setViewportSize({ width: 390, height: 844 })
await pagina.goto(`${BASE}/#/`, { waitUntil: 'networkidle' })
await pagina.waitForTimeout(300)
verificar('menú hamburguesa visible en móvil', await pagina.getByRole('button', { name: 'Abrir menú' }).isVisible())
await pagina.getByRole('button', { name: 'Abrir menú' }).click()
await pagina.waitForTimeout(400)
verificar('menú lateral se abre', await pagina.getByRole('button', { name: 'Cerrar menú' }).isVisible())
const desbordaHorizontal = await pagina.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2)
verificar('sin desbordamiento horizontal en móvil', !desbordaHorizontal)

console.log('\n== Consola sin errores ==')
const erroresReales = erroresConsola.filter((e) => !e.includes('favicon') && !e.includes('404'))
verificar('sin errores de consola', erroresReales.length === 0, erroresReales.slice(0, 3).join(' | '))

await navegador.close()
console.log(`\nE2E: ${pruebas - fallas}/${pruebas} verificaciones pasaron\n`)
process.exit(fallas > 0 ? 1 : 0)
