<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { DefinicionLibro, FormatoRequerido, GraficoRequerido, ObjetivoExcel } from '../data/tipos'
import { crearHoja, formatearValor, nombreColumna } from '../lib/formulas'
import { colorClase, datosParaGrafico, evaluarRegla, normalizarRango, rangoDesdeTexto, type RangoCeldas } from '../lib/formatoExcel'
import GraficoVista from './GraficoVista.vue'

const props = defineProps<{
  libro: DefinicionLibro
  objetivos: ObjetivoExcel[]
  formatoRequerido?: FormatoRequerido[]
  graficoRequerido?: GraficoRequerido
}>()

const emit = defineEmits<{
  (e: 'validado', ok: boolean): void
}>()

const celdas = ref<Record<string, string>>({})
const seleccionada = ref('A2')
const ancla = ref('A2')
const editando = ref(false)
const borrador = ref('')
const historial = ref<Record<string, string>[]>([])
const mensaje = ref<{ tipo: 'exito' | 'aviso' | 'neutro'; texto: string } | null>(null)
const guardado = ref(false)
const filtroActivo = ref(false)
const ordenAscendente = ref(true)
const celdaEditando = ref<HTMLInputElement | null>(null)
const barraEditando = ref(false)
const contenedor = ref<HTMLElement | null>(null)

const formatos = ref<FormatoRequerido[]>([])
const grafico = ref<GraficoRequerido | null>(null)
const panel = ref<'ninguno' | 'formato' | 'grafico'>('ninguno')
const borradorFormato = ref({ rango: '', condicion: 'mayor', valor: '', valor2: '', color: 'verde' })
const borradorGrafico = ref<{ tipo: 'barras' | 'pastel'; rango: string; titulo: string }>({
  tipo: 'barras',
  rango: '',
  titulo: ''
})

function preparar(libro: DefinicionLibro) {
  celdas.value = { ...libro.celdas }
  seleccionada.value = 'A2'
  ancla.value = 'A2'
  mensaje.value = null
  historial.value = []
  filtroActivo.value = false
  editando.value = false
  barraEditando.value = false
  formatos.value = []
  grafico.value = null
  panel.value = 'ninguno'
}

watch(() => props.libro, (nuevo) => preparar(nuevo), { immediate: true })

const motor = computed(() => crearHoja(celdas.value))
const columnas = computed(() => props.libro.columnas.length)
const letras = computed(() => Array.from({ length: columnas.value }, (_, i) => nombreColumna(i)))
const filas = computed(() => props.libro.filas)

const valorCelda = (ref: string) => formatearValor(motor.value.valorDe(ref))
const contenidoCelda = (ref: string) => celdas.value[ref] ?? ''
const esNumero = (ref: string) => typeof motor.value.valorDe(ref) === 'number'

const columnaEstatus = computed(() => {
  const indice = props.libro.columnas.findIndex((c) => c.toLowerCase().includes('estatus'))
  return indice >= 0 ? letras.value[indice] : null
})

const filasVisibles = computed(() => {
  const total = Math.max(0, filas.value - 1)
  const indices = Array.from({ length: total }, (_, i) => i + 2)
  if (!filtroActivo.value || !columnaEstatus.value) return indices
  return indices.filter((f) => valorCelda(`${columnaEstatus.value}${f}`).trim().toUpperCase() === 'PENDIENTE')
})

const encabezado = computed(() =>
  letras.value.map((letra, i) => ({
    ref: `${letra}1`,
    valor: valorCelda(`${letra}1`) || props.libro.columnas[i] || ''
  }))
)

const rangoSeleccion = computed<RangoCeldas>(() => normalizarRango(ancla.value, seleccionada.value))
const seleccionMultiple = computed(() => seleccionada.value !== ancla.value && rangoSeleccion.value.celdas.length > 1)
const textoSeleccion = computed(() =>
  seleccionMultiple.value ? `${rangoSeleccion.value.ini}:${rangoSeleccion.value.fin}` : seleccionada.value
)

function enSeleccion(ref: string) {
  return seleccionMultiple.value && rangoSeleccion.value.celdas.includes(ref)
}

const reglasPorCelda = computed(() => {
  const mapa = new Map<string, { color: string; fondo: string }>()
  for (const bloque of formatos.value) {
    const rango = rangoDesdeTexto(bloque.rango)
    if (!rango) continue
    for (const ref of rango.celdas) {
      const valor = motor.value.valorDe(ref) as string | number
      for (const regla of bloque.reglas) {
        if (evaluarRegla(valor, regla)) {
          mapa.set(ref, { color: colorClase[regla.color].texto, fondo: colorClase[regla.color].fondo })
          break
        }
      }
    }
  }
  return mapa
})

const cuadricula = computed(() =>
  filasVisibles.value.map((fila) => ({
    fila,
    celdas: letras.value.map((letra) => {
      const ref = `${letra}${fila}`
      return { ref, valor: valorCelda(ref), numero: esNumero(ref), formato: reglasPorCelda.value.get(ref) ?? null }
    })
  }))
)

const valorBarra = computed(() => (editando.value ? borrador.value : contenidoCelda(seleccionada.value)))

const datosGrafico = computed(() => {
  if (!grafico.value) return []
  return datosParaGrafico(celdas.value, (r) => motor.value.valorDe(r) as string | number, grafico.value.rango)
})

function seleccionar(ref: string, extender = false) {
  if (editando.value) confirmarEdicion()
  seleccionada.value = ref
  if (!extender) ancla.value = ref
  mensaje.value = null
  nextTick(() => contenedor.value?.focus())
}

function empezarEdicion(ref: string, inicial?: string) {
  seleccionada.value = ref
  ancla.value = ref
  editando.value = true
  barraEditando.value = false
  borrador.value = inicial !== undefined ? inicial : contenidoCelda(ref)
  nextTick(() => {
    const input = celdaEditando.value
    if (input) {
      input.focus()
      input.setSelectionRange(input.value.length, input.value.length)
    } else {
      contenedor.value?.focus()
    }
  })
}

function iniciarBarra() {
  if (!barraEditando.value) {
    borrador.value = contenidoCelda(seleccionada.value)
    barraEditando.value = true
    editando.value = true
  }
}

function actualizarBarra(e: Event) {
  borrador.value = (e.target as HTMLInputElement).value
}

function guardarPaso() {
  historial.value.push({ ...celdas.value })
  if (historial.value.length > 40) historial.value.shift()
}

function confirmarEdicion() {
  if (!editando.value) return
  guardarPaso()
  const ref = seleccionada.value
  const nuevas = { ...celdas.value }
  if (borrador.value.trim() === '') delete nuevas[ref]
  else nuevas[ref] = borrador.value
  celdas.value = nuevas
  editando.value = false
  barraEditando.value = false
  guardado.value = false
  mensaje.value = null
  mover('abajo')
}

function cancelarEdicion() {
  editando.value = false
  barraEditando.value = false
  borrador.value = ''
}

function mover(direccion: 'arriba' | 'abajo' | 'izquierda' | 'derecha', extender = false) {
  const m = seleccionada.value.match(/^([A-Z]+)(\d+)$/)
  if (!m) return
  let col = letras.value.indexOf(m[1])
  let fila = Number(m[2])
  if (direccion === 'arriba') fila = Math.max(1, fila - 1)
  if (direccion === 'abajo') fila = Math.min(filas.value, fila + 1)
  if (direccion === 'izquierda') col = Math.max(0, col - 1)
  if (direccion === 'derecha') col = Math.min(columnas.value - 1, col + 1)
  seleccionada.value = `${letras.value[col]}${fila}`
  if (!extender) ancla.value = seleccionada.value
}

function tecla(e: KeyboardEvent) {
  if (editando.value) {
    if (e.target === celdaEditando.value || (e.target as HTMLElement)?.tagName === 'INPUT') return
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault()
      borrador.value += e.key
    }
    return
  }
  const mapa: Record<string, 'arriba' | 'abajo' | 'izquierda' | 'derecha'> = {
    ArrowUp: 'arriba',
    ArrowDown: 'abajo',
    ArrowLeft: 'izquierda',
    ArrowRight: 'derecha'
  }
  if (mapa[e.key]) {
    e.preventDefault()
    mover(mapa[e.key], e.shiftKey)
    return
  }
  if (e.key === 'Enter' || e.key === 'F2') {
    e.preventDefault()
    empezarEdicion(seleccionada.value)
    return
  }
  if (e.key === 'Backspace' || e.key === 'Delete') {
    e.preventDefault()
    guardarPaso()
    const nuevas = { ...celdas.value }
    delete nuevas[seleccionada.value]
    celdas.value = nuevas
    mensaje.value = null
    return
  }
  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
    e.preventDefault()
    empezarEdicion(seleccionada.value, '')
    borrador.value = e.key
  }
}

function enfocarEntrada(el: unknown) {
  celdaEditando.value = (el as HTMLInputElement) ?? null
}

function alEditartecla(e: KeyboardEvent) {
  e.stopPropagation()
  if (e.key === 'Enter') {
    e.preventDefault()
    confirmarEdicion()
  } else if (e.key === 'Escape') {
    e.preventDefault()
    cancelarEdicion()
  }
}

function guardar() {
  guardado.value = true
  mensaje.value = { tipo: 'neutro', texto: `Guardado. ${props.libro.archivo} está a salvo.` }
}

function deshacer() {
  const anterior = historial.value.pop()
  if (anterior) {
    celdas.value = anterior
    mensaje.value = { tipo: 'neutro', texto: 'Listo, regresamos un paso.' }
  } else {
    mensaje.value = { tipo: 'neutro', texto: 'Todavía no hay pasos para deshacer.' }
  }
}

function ordenar() {
  guardarPaso()
  const filasDatos = filasVisibles.value
  const contenido = filasDatos.map((f) => letras.value.map((l) => celdas.value[`${l}${f}`] ?? ''))
  contenido.sort((a, b) => {
    const va = a[0] ?? ''
    const vb = b[0] ?? ''
    const na = Number(va)
    const nb = Number(vb)
    const comp = va !== '' && vb !== '' && Number.isFinite(na) && Number.isFinite(nb) ? na - nb : va.localeCompare(vb, 'es')
    return ordenAscendente.value ? comp : -comp
  })
  const nuevas: Record<string, string> = {}
  letras.value.forEach((l, c) => {
    nuevas[`${l}1`] = celdas.value[`${l}1`] ?? props.libro.columnas[c] ?? ''
  })
  contenido.forEach((fila, i) => {
    letras.value.forEach((l, c) => {
      if (fila[c] !== '') nuevas[`${l}${i + 2}`] = fila[c]
    })
  })
  celdas.value = nuevas
  ordenAscendente.value = !ordenAscendente.value
  mensaje.value = { tipo: 'neutro', texto: 'Filas ordenadas por la primera columna.' }
}

function alternarFiltro() {
  if (!columnaEstatus.value) {
    mensaje.value = { tipo: 'neutro', texto: 'Esta hoja no tiene una columna de estatus para filtrar.' }
    return
  }
  filtroActivo.value = !filtroActivo.value
  mensaje.value = filtroActivo.value
    ? { tipo: 'neutro', texto: 'Filtro activo: solo se ven los casos “Pendiente”. Nada se borró.' }
    : { tipo: 'neutro', texto: 'Filtro quitado. Ya se ven todos los casos otra vez.' }
}

function abrirFormato() {
  panel.value = panel.value === 'formato' ? 'ninguno' : 'formato'
  if (!borradorFormato.value.rango && seleccionMultiple.value) {
    borradorFormato.value.rango = `${rangoSeleccion.value.ini}:${rangoSeleccion.value.fin}`
  }
}

function aplicarFormato() {
  const f = borradorFormato.value
  const rango = rangoDesdeTexto(f.rango)
  if (!rango) {
    mensaje.value = { tipo: 'aviso', texto: 'Escribe un rango como B2:B6 para aplicar el formato.' }
    return
  }
  if (f.valor.trim() === '') {
    mensaje.value = { tipo: 'aviso', texto: 'Falta el valor de la condición, por ejemplo 80.' }
    return
  }
  const numerico = f.condicion !== 'contiene' && Number.isFinite(Number(f.valor))
  const regla = {
    condicion: f.condicion as never,
    valor: numerico ? Number(f.valor) : f.valor,
    valor2: f.condicion === 'entre' ? Number(f.valor2) : undefined,
    color: f.color as never
  }
  const existente = formatos.value.find((b) => b.rango === f.rango)
  if (existente) existente.reglas.push(regla)
  else formatos.value.push({ rango: f.rango, reglas: [regla] })
  mensaje.value = { tipo: 'neutro', texto: `Formato condicional aplicado a ${f.rango}. Las celdas cambian de color solas.` }
}

function quitarFormatos() {
  formatos.value = []
  mensaje.value = { tipo: 'neutro', texto: 'Se quitaron las reglas de formato. Los datos siguen intactos.' }
}

function abrirGrafico() {
  panel.value = panel.value === 'grafico' ? 'ninguno' : 'grafico'
  if (!borradorGrafico.value.rango && seleccionMultiple.value) {
    borradorGrafico.value.rango = `${rangoSeleccion.value.ini}:${rangoSeleccion.value.fin}`
  }
}

function crearGrafico() {
  const g = borradorGrafico.value
  if (!rangoDesdeTexto(g.rango)) {
    mensaje.value = { tipo: 'aviso', texto: 'Escribe un rango como A1:B6 para crear la gráfica.' }
    return
  }
  const datos = datosParaGrafico(celdas.value, (r) => motor.value.valorDe(r) as string | number, g.rango)
  if (datos.length === 0) {
    mensaje.value = { tipo: 'aviso', texto: 'En ese rango no hay números que graficar.' }
    return
  }
  grafico.value = { tipo: g.tipo, rango: g.rango, titulo: g.titulo || 'Mi gráfica' }
  mensaje.value = { tipo: 'neutro', texto: 'Gráfica creada. Revisa que las etiquetas y los números sean los correctos.' }
}

function quitarGrafico() {
  grafico.value = null
  mensaje.value = { tipo: 'neutro', texto: 'Se quitó la gráfica. Los datos siguen igual.' }
}

const resultados = computed(() =>
  props.objetivos.map((obj) => {
    const crudo = (celdas.value[obj.celda] ?? '').toUpperCase().replace(/\s/g, '')
    const valor = motor.value.valorDe(obj.celda)
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
    const rangoPropio = usaSuPropiaCelda(crudo, obj.celda)
    return { ...obj, cumple: cumpleValor && cumpleFuncion && !rangoPropio, obtenido: texto, rangoPropio }
  })
)

const formatoCumplido = computed(() => {
  if (!props.formatoRequerido || props.formatoRequerido.length === 0) return true
  return props.formatoRequerido.every((req) => {
    const aplicado = formatos.value.find((b) => b.rango === req.rango)
    if (!aplicado) return false
    return req.reglas.every((regla) =>
      aplicado.reglas.some(
        (r) =>
          r.condicion === regla.condicion &&
          String(r.valor).toUpperCase() === String(regla.valor).toUpperCase() &&
          String(r.valor2 ?? '') === String(regla.valor2 ?? '') &&
          r.color === regla.color
      )
    )
  })
})

const graficoCumplido = computed(() => {
  if (!props.graficoRequerido) return true
  if (!grafico.value) return false
  if (grafico.value.tipo !== props.graficoRequerido.tipo) return false
  const esperados = props.graficoRequerido.valoresEsperados
  if (esperados && esperados.length > 0) {
    const obtenidos = datosGrafico.value.map((d) => d.valor)
    if (obtenidos.length !== esperados.length) return false
    const iguales = esperados.every((v, i) => Math.abs(v - obtenidos[i]) <= 0.05)
    if (!iguales) return false
  }
  return true
})

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

function revisar() {
  const faltan = resultados.value.filter((r) => !r.cumple)
  if (faltan.length > 0) {
    const pista = faltan[0]
    const donde = pista.etiqueta ? `${pista.celda} (${pista.etiqueta})` : pista.celda
    if (pista.rangoPropio) {
      mensaje.value = {
        tipo: 'aviso',
        texto: `Casi, mira la pista. En ${donde} el rango incluye la celda donde está la fórmula. Empieza en la fila 2 y termina antes del total.`
      }
    } else {
      mensaje.value = {
        tipo: 'aviso',
        texto: `Casi, mira la pista. En ${donde} todavía no sale. Ahora da ${pista.obtenido === '' ? 'vacío' : pista.obtenido}.`
      }
    }
    emit('validado', false)
    return
  }
  if (!formatoCumplido.value) {
    mensaje.value = { tipo: 'aviso', texto: 'Las fórmulas están bien. Falta aplicar el formato condicional como pide el reto.' }
    emit('validado', false)
    return
  }
  if (!graficoCumplido.value) {
    const tipo = props.graficoRequerido?.tipo === 'pastel' ? 'pastel' : 'barras'
    const esperados = props.graficoRequerido?.valoresEsperados
    if (grafico.value && esperados && esperados.length > 0) {
      const obtenidos = datosGrafico.value.map((d) => d.valor)
      mensaje.value = {
        tipo: 'aviso',
        texto: `Casi, mira la pista. La gráfica está graficando ${obtenidos.join(', ') || 'otros datos'} y debe mostrar ${esperados.join(', ')}. Revisa qué columnas elegiste en el rango.`
      }
    } else {
      mensaje.value = {
        tipo: 'aviso',
        texto: `Los datos están bien. Falta crear la gráfica de ${tipo} con el rango que pide el reto.`
      }
    }
    emit('validado', false)
    return
  }
  mensaje.value = { tipo: 'exito', texto: '¡Bien! Todo el reto está correcto.' }
  emit('validado', true)
}

function cargarSolucion(solucion: Record<string, string>) {
  guardarPaso()
  celdas.value = { ...celdas.value, ...solucion }
  mensaje.value = { tipo: 'neutro', texto: 'La respuesta modelo está cargada en el simulador.' }
}

function cargarSolucionCompleta(
  solucion: Record<string, string>,
  solucionFormato?: FormatoRequerido[],
  solucionGrafico?: GraficoRequerido
) {
  guardarPaso()
  celdas.value = { ...celdas.value, ...solucion }
  const form = solucionFormato ?? props.formatoRequerido
  if (form) formatos.value = form.map((f) => ({ rango: f.rango, reglas: f.reglas.map((r) => ({ ...r })) }))
  const graf = solucionGrafico ?? props.graficoRequerido
  if (graf) grafico.value = { ...graf }
  mensaje.value = { tipo: 'neutro', texto: 'La respuesta modelo está cargada: fórmula, formato y gráfica.' }
}

defineExpose({ cargarSolucion, cargarSolucionCompleta })

const anchoCol = (i: number) => `${props.libro.anchos?.[i] ?? 130}px`

const opcionesFormato = [
  { valor: 'mayor', texto: 'es mayor que' },
  { valor: 'menor', texto: 'es menor que' },
  { valor: 'igual', texto: 'es igual a' },
  { valor: 'contiene', texto: 'contiene el texto' },
  { valor: 'entre', texto: 'está entre' }
]

const opcionesColor = [
  { valor: 'verde', texto: 'Verde (bien)' },
  { valor: 'rojo', texto: 'Rojo (revisar)' },
  { valor: 'amarillo', texto: 'Amarillo (aviso)' },
  { valor: 'azul', texto: 'Azul (informativo)' }
]

function describir(regla: { condicion: string; valor: string | number; valor2?: number }): string {
  switch (regla.condicion) {
    case 'mayor':
      return `mayor que ${regla.valor}`
    case 'menor':
      return `menor que ${regla.valor}`
    case 'igual':
      return `igual a ${regla.valor}`
    case 'contiene':
      return `contiene "${regla.valor}"`
    case 'entre':
      return `entre ${regla.valor} y ${regla.valor2}`
    default:
      return regla.condicion
  }
}
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-[#B8CCE0] bg-white shadow-tarjeta">
    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-[#1b5e35] bg-[#217346] px-3 py-2 text-white">
      <div class="flex items-center gap-2 text-sm font-semibold">
        <span class="inline-flex h-6 w-6 items-center justify-center rounded bg-white/20 text-xs font-bold">X</span>
        {{ libro.archivo }}
      </div>
      <span class="rounded bg-white/15 px-2 py-0.5 text-xs">{{ libro.hoja }}</span>
    </div>

    <div class="flex flex-wrap items-center gap-1 border-b border-[#D6E0EA] bg-[#F3F3F3] px-2 py-1.5">
      <button
        type="button"
        class="rounded px-2 py-1.5 text-sm font-bold text-[#333] hover:bg-[#E3E3E3]"
        title="Negrita"
        @click="mensaje = { tipo: 'neutro', texto: 'La negrita solo cambia cómo se ve el texto, no el dato.' }"
      >
        N
      </button>
      <span class="mx-0.5 h-5 w-px bg-[#C9C9C9]" />
      <button type="button" class="rounded px-2 py-1.5 text-sm text-[#333] hover:bg-[#E3E3E3]" @click="guardar">
        Guardar
      </button>
      <button type="button" class="rounded px-2 py-1.5 text-sm text-[#333] hover:bg-[#E3E3E3]" @click="deshacer">
        Deshacer
      </button>
      <span class="mx-0.5 h-5 w-px bg-[#C9C9C9]" />
      <button
        type="button"
        class="rounded px-2 py-1.5 text-sm text-[#333] hover:bg-[#E3E3E3]"
        :class="filtroActivo ? 'bg-[#D7E9F7] font-semibold' : ''"
        @click="alternarFiltro"
      >
        Filtro
      </button>
      <button type="button" class="rounded px-2 py-1.5 text-sm text-[#333] hover:bg-[#E3E3E3]" @click="ordenar">
        Ordenar
      </button>
      <span class="mx-0.5 h-5 w-px bg-[#C9C9C9]" />
      <button
        type="button"
        class="rounded px-2 py-1.5 text-sm text-[#333] hover:bg-[#E3E3E3]"
        :class="panel === 'formato' || formatos.length ? 'bg-[#D7E9F7] font-semibold' : ''"
        @click="abrirFormato"
      >
        Formato
      </button>
      <button
        type="button"
        class="rounded px-2 py-1.5 text-sm text-[#333] hover:bg-[#E3E3E3]"
        :class="panel === 'grafico' || grafico ? 'bg-[#D7E9F7] font-semibold' : ''"
        @click="abrirGrafico"
      >
        Gráfica
      </button>
      <span v-if="guardado" class="ml-auto text-xs font-semibold text-[#2E7D32]">Guardado</span>
    </div>

    <div class="flex items-stretch border-b border-[#D6E0EA] bg-white">
      <div class="flex min-w-[74px] items-center justify-center border-r border-[#D6E0EA] px-2 text-xs font-semibold text-[#555]">
        {{ textoSeleccion }}
      </div>
      <div class="flex items-center border-r border-[#D6E0EA] px-3 text-sm font-semibold italic text-[#888]">fx</div>
      <input
        :value="valorBarra"
        class="w-full bg-white px-2 py-2 font-mono text-sm text-[#1A2A3A] outline-none"
        aria-label="Barra de fórmulas"
        @focus="iniciarBarra"
        @input="actualizarBarra"
        @keydown.enter.prevent="confirmarEdicion"
        @keydown.esc.prevent="cancelarEdicion"
      />
    </div>

    <div v-if="panel === 'formato'" class="border-b border-[#D6E0EA] bg-[#F8FAFC] p-3">
      <p class="mb-1 text-sm font-semibold text-inegi-oscuro">Formato condicional</p>
      <p class="mb-3 text-xs text-inegi-secundario">
        Pinta las celdas solas según el dato. Ejemplo: si el avance es mayor que 80, verde.
      </p>
      <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <label class="text-xs font-semibold text-inegi-secundario">
          Rango
          <input v-model="borradorFormato.rango" class="campo mt-1 !py-1.5 text-sm" placeholder="B2:B6" />
        </label>
        <label class="text-xs font-semibold text-inegi-secundario">
          Condición
          <select v-model="borradorFormato.condicion" class="campo mt-1 !py-1.5 text-sm">
            <option v-for="o in opcionesFormato" :key="o.valor" :value="o.valor">{{ o.texto }}</option>
          </select>
        </label>
        <label class="text-xs font-semibold text-inegi-secundario">
          Valor
          <input v-model="borradorFormato.valor" class="campo mt-1 !py-1.5 text-sm" placeholder="80" />
        </label>
        <label v-if="borradorFormato.condicion === 'entre'" class="text-xs font-semibold text-inegi-secundario">
          Hasta
          <input v-model="borradorFormato.valor2" class="campo mt-1 !py-1.5 text-sm" placeholder="100" />
        </label>
        <label class="text-xs font-semibold text-inegi-secundario">
          Color
          <select v-model="borradorFormato.color" class="campo mt-1 !py-1.5 text-sm">
            <option v-for="o in opcionesColor" :key="o.valor" :value="o.valor">{{ o.texto }}</option>
          </select>
        </label>
      </div>
      <div class="mt-2 flex flex-wrap gap-2">
        <button type="button" class="btn-primario !min-h-[36px] !py-1 text-sm" @click="aplicarFormato">
          Aplicar formato
        </button>
        <button v-if="formatos.length" type="button" class="btn-suave !min-h-[36px] !py-1 text-sm" @click="quitarFormatos">
          Quitar reglas
        </button>
      </div>
      <ul v-if="formatos.length" class="mt-2 space-y-1 text-xs text-inegi-texto">
        <li v-for="bloque in formatos" :key="bloque.rango">
          <strong>{{ bloque.rango }}:</strong>
          {{ bloque.reglas.map((r) => `${describir(r)} (${r.color})`).join(', ') }}
        </li>
      </ul>
    </div>

    <div v-if="panel === 'grafico'" class="border-b border-[#D6E0EA] bg-[#F8FAFC] p-3">
      <p class="mb-1 text-sm font-semibold text-inegi-oscuro">Insertar gráfica</p>
      <p class="mb-3 text-xs text-inegi-secundario">
        Selecciona el rango con etiquetas y números. Barras para comparar; pastel para ver partes de un total.
      </p>
      <div class="grid gap-2 sm:grid-cols-3">
        <label class="text-xs font-semibold text-inegi-secundario">
          Tipo
          <select v-model="borradorGrafico.tipo" class="campo mt-1 !py-1.5 text-sm">
            <option value="barras">Barras</option>
            <option value="pastel">Pastel</option>
          </select>
        </label>
        <label class="text-xs font-semibold text-inegi-secundario">
          Rango con etiquetas y números
          <input v-model="borradorGrafico.rango" class="campo mt-1 !py-1.5 text-sm" placeholder="A1:B6" />
        </label>
        <label class="text-xs font-semibold text-inegi-secundario">
          Título
          <input v-model="borradorGrafico.titulo" class="campo mt-1 !py-1.5 text-sm" placeholder="Avance por alcaldía" />
        </label>
      </div>
      <div class="mt-2 flex flex-wrap gap-2">
        <button type="button" class="btn-primario !min-h-[36px] !py-1 text-sm" @click="crearGrafico">Crear gráfica</button>
        <button v-if="grafico" type="button" class="btn-suave !min-h-[36px] !py-1 text-sm" @click="quitarGrafico">
          Quitar gráfica
        </button>
      </div>
    </div>

    <div ref="contenedor" class="overflow-x-auto outline-none" tabindex="0" @keydown="tecla">
      <table class="min-w-full border-collapse text-sm">
        <thead>
          <tr>
            <th class="w-10 border border-[#D6E0EA] bg-[#F3F3F3] px-1 py-1" />
            <th
              v-for="(celda, i) in encabezado"
              :key="celda.ref"
              class="border border-[#D6E0EA] bg-[#EDF3F8] px-2 py-1.5 text-left text-xs font-semibold text-[#003057]"
              :style="{ minWidth: anchoCol(i), width: anchoCol(i) }"
            >
              {{ celda.valor }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fila in cuadricula" :key="fila.fila">
            <td class="border border-[#D6E0EA] bg-[#F3F3F3] px-1 py-1 text-center text-xs font-semibold text-[#666]">
              {{ fila.fila }}
            </td>
            <td
              v-for="(celda, i) in fila.celdas"
              :key="celda.ref"
              class="cursor-cell border px-2 py-1.5"
              :class="[
                seleccionada === celda.ref
                  ? 'border-2 border-[#217346] bg-[#E8F5EC] text-inegi-texto'
                  : enSeleccion(celda.ref)
                    ? 'border-[#217346] bg-[#EFF8F1] text-inegi-texto'
                    : celda.formato
                      ? [celda.formato.fondo, celda.formato.color, 'border-[#D6E0EA] font-semibold']
                      : 'border-[#D6E0EA] text-inegi-texto',
                celda.numero ? 'text-right tabular-nums' : ''
              ]"
              :style="{ minWidth: anchoCol(i) }"
              @click="seleccionar(celda.ref, $event.shiftKey)"
              @dblclick="empezarEdicion(celda.ref)"
            >
              <input
                v-if="editando && seleccionada === celda.ref"
                :ref="enfocarEntrada"
                v-model="borrador"
                class="w-full bg-transparent text-inegi-texto outline-none"
                :class="celda.numero ? 'text-right' : ''"
                @blur="confirmarEdicion"
                @keydown="alEditartecla"
              />
              <span v-else>{{ celda.valor }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="grafico" class="border-t border-[#D6E0EA] bg-[#F8FAFC] p-3">
      <GraficoVista :tipo="grafico.tipo" :datos="datosGrafico" :titulo="grafico.titulo" compacto />
      <p class="mt-2 text-center text-[11px] text-inegi-secundario">Rango graficado: {{ grafico.rango }}</p>
    </div>

    <div class="flex flex-wrap items-center gap-3 border-t border-[#D6E0EA] bg-[#F8FAFC] px-3 py-2">
      <div class="flex flex-1 flex-wrap gap-2 text-xs">
        <span
          v-for="r in resultados"
          :key="r.celda"
          class="inline-flex items-center gap-1 rounded-full px-2 py-1 font-semibold"
          :class="r.cumple ? 'bg-[#E3F2E5] text-inegi-exito' : 'bg-inegi-claro text-inegi-secundario'"
        >
          {{ r.cumple ? '✓' : '○' }} {{ r.celda }}<template v-if="r.etiqueta"> · {{ r.etiqueta }}</template>
        </span>
        <span
          v-if="formatoRequerido && formatoRequerido.length"
          class="inline-flex items-center gap-1 rounded-full px-2 py-1 font-semibold"
          :class="formatoCumplido ? 'bg-[#E3F2E5] text-inegi-exito' : 'bg-inegi-claro text-inegi-secundario'"
        >
          {{ formatoCumplido ? '✓' : '○' }} Formato condicional
        </span>
        <span
          v-if="graficoRequerido"
          class="inline-flex items-center gap-1 rounded-full px-2 py-1 font-semibold"
          :class="graficoCumplido ? 'bg-[#E3F2E5] text-inegi-exito' : 'bg-inegi-claro text-inegi-secundario'"
        >
          {{ graficoCumplido ? '✓' : '○' }} Gráfica de {{ graficoRequerido.tipo }}
        </span>
      </div>
      <button type="button" class="btn-primario !min-h-[40px] !py-1.5 text-sm" @click="revisar">
        Revisar mi trabajo
      </button>
    </div>

    <div
      v-if="mensaje"
      class="border-t px-3 py-2.5 text-sm font-medium"
      :class="{
        'bg-[#E3F2E5] text-inegi-exito': mensaje.tipo === 'exito',
        'bg-[#FFF6E0] text-[#8a5a00]': mensaje.tipo === 'aviso',
        'bg-inegi-claro text-inegi-oscuro': mensaje.tipo === 'neutro'
      }"
      role="status"
    >
      {{ mensaje.texto }}
    </div>
  </div>
</template>
