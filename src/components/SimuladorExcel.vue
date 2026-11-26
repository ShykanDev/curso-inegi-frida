<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { DefinicionLibro, ObjetivoExcel } from '../data/tipos'
import { crearHoja, formatearValor, nombreColumna } from '../lib/formulas'

const props = defineProps<{
  libro: DefinicionLibro
  objetivos: ObjetivoExcel[]
}>()

const emit = defineEmits<{
  (e: 'validado', ok: boolean): void
}>()

const celdas = ref<Record<string, string>>({})
const seleccionada = ref('A2')
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

function preparar(libro: DefinicionLibro) {
  celdas.value = { ...libro.celdas }
  seleccionada.value = 'A2'
  mensaje.value = null
  historial.value = []
  filtroActivo.value = false
  editando.value = false
  barraEditando.value = false
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
  return indices.filter(
    (f) => valorCelda(`${columnaEstatus.value}${f}`).trim().toUpperCase() === 'PENDIENTE'
  )
})

const encabezado = computed(() =>
  letras.value.map((letra, i) => ({
    ref: `${letra}1`,
    valor: valorCelda(`${letra}1`) || props.libro.columnas[i] || ''
  }))
)

const cuadricula = computed(() =>
  filasVisibles.value.map((fila) => ({
    fila,
    celdas: letras.value.map((letra) => {
      const ref = `${letra}${fila}`
      return { ref, valor: valorCelda(ref), numero: esNumero(ref) }
    })
  }))
)

const valorBarra = computed(() =>
  editando.value ? borrador.value : contenidoCelda(seleccionada.value)
)

function seleccionar(ref: string) {
  if (editando.value) confirmarEdicion()
  seleccionada.value = ref
  mensaje.value = null
  nextTick(() => contenedor.value?.focus())
}

function empezarEdicion(ref: string, inicial?: string) {
  seleccionada.value = ref
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

function mover(direccion: 'arriba' | 'abajo' | 'izquierda' | 'derecha') {
  const m = seleccionada.value.match(/^([A-Z]+)(\d+)$/)
  if (!m) return
  let col = letras.value.indexOf(m[1])
  let fila = Number(m[2])
  if (direccion === 'arriba') fila = Math.max(1, fila - 1)
  if (direccion === 'abajo') fila = Math.min(filas.value, fila + 1)
  if (direccion === 'izquierda') col = Math.max(0, col - 1)
  if (direccion === 'derecha') col = Math.min(columnas.value - 1, col + 1)
  seleccionada.value = `${letras.value[col]}${fila}`
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
    mover(mapa[e.key])
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
    const comp =
      va !== '' && vb !== '' && Number.isFinite(na) && Number.isFinite(nb)
        ? na - nb
        : va.localeCompare(vb, 'es')
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

const resultados = computed(() =>
  props.objetivos.map((obj) => {
    const crudo = (celdas.value[obj.celda] ?? '').toUpperCase().replace(/\s/g, '')
    const valor = motor.value.valorDe(obj.celda)
    const texto = formatearValor(valor)
    const funciones = obj.funciones ?? []
    const cumpleFuncion = funciones.length === 0 || funciones.some((f) => crudo.includes(f))
    let cumpleValor = false
    if (typeof obj.valor === 'number') {
      const n = typeof valor === 'number' ? valor : Number(texto.replace(',', '.'))
      cumpleValor = Number.isFinite(n) && Math.abs(n - obj.valor) <= (obj.tolerancia ?? 0.0001)
    } else {
      cumpleValor = texto.trim().toUpperCase() === String(obj.valor).trim().toUpperCase()
    }
    return { ...obj, cumple: cumpleValor && cumpleFuncion, obtenido: texto }
  })
)

function revisar() {
  const faltan = resultados.value.filter((r) => !r.cumple)
  if (faltan.length === 0) {
    mensaje.value = { tipo: 'exito', texto: '¡Bien! Las celdas del reto están correctas.' }
    emit('validado', true)
    return
  }
  const pista = faltan[0]
  const donde = pista.etiqueta ? `${pista.celda} (${pista.etiqueta})` : pista.celda
  mensaje.value = {
    tipo: 'aviso',
    texto: `Casi, mira la pista. En ${donde} todavía no sale. Ahora da ${pista.obtenido === '' ? 'vacío' : pista.obtenido}.`
  }
  emit('validado', false)
}

function cargarSolucion(solucion: Record<string, string>) {
  guardarPaso()
  celdas.value = { ...celdas.value, ...solucion }
  mensaje.value = { tipo: 'neutro', texto: 'La respuesta modelo está cargada en el simulador.' }
}

defineExpose({ cargarSolucion })

const anchoCol = (i: number) => `${props.libro.anchos?.[i] ?? 130}px`
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
        class="rounded px-2.5 py-1.5 text-sm font-bold text-[#333] hover:bg-[#E3E3E3]"
        title="Negrita"
        @click="mensaje = { tipo: 'neutro', texto: 'La negrita solo cambia cómo se ve el texto, no el dato.' }"
      >
        N
      </button>
      <span class="mx-1 h-5 w-px bg-[#C9C9C9]" />
      <button type="button" class="rounded px-2.5 py-1.5 text-sm text-[#333] hover:bg-[#E3E3E3]" @click="guardar">
        Guardar
      </button>
      <button type="button" class="rounded px-2.5 py-1.5 text-sm text-[#333] hover:bg-[#E3E3E3]" @click="deshacer">
        Deshacer
      </button>
      <span class="mx-1 h-5 w-px bg-[#C9C9C9]" />
      <button
        type="button"
        class="rounded px-2.5 py-1.5 text-sm text-[#333] hover:bg-[#E3E3E3]"
        :class="filtroActivo ? 'bg-[#D7E9F7] font-semibold' : ''"
        @click="alternarFiltro"
      >
        Filtro
      </button>
      <button type="button" class="rounded px-2.5 py-1.5 text-sm text-[#333] hover:bg-[#E3E3E3]" @click="ordenar">
        Ordenar A-Z
      </button>
      <span v-if="guardado" class="ml-auto text-xs font-semibold text-[#2E7D32]">Archivo guardado</span>
    </div>

    <div class="flex items-stretch border-b border-[#D6E0EA] bg-white">
      <div class="flex min-w-[58px] items-center justify-center border-r border-[#D6E0EA] px-2 text-sm font-semibold text-[#555]">
        {{ seleccionada }}
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
              class="cursor-cell border px-2 py-1.5 text-inegi-texto"
              :class="[
                seleccionada === celda.ref
                  ? 'border-2 border-[#217346] bg-[#E8F5EC]'
                  : 'border-[#D6E0EA]',
                celda.numero ? 'text-right tabular-nums' : ''
              ]"
              :style="{ minWidth: anchoCol(i) }"
              @click="seleccionar(celda.ref)"
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
      </div>
      <button type="button" class="btn-primario !min-h-[40px] !py-1.5 text-sm" @click="revisar">
        Revisar mi fórmula
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
