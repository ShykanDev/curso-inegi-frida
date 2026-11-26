<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { RetoDinamica, RetoGrafico } from '../data/tipos'

const props = defineProps<{
  reto: RetoDinamica | RetoGrafico
}>()

const emit = defineEmits<{
  (e: 'validado', ok: boolean): void
}>()

const campoFila = ref('')
const campoValor = ref('')
const agregacion = ref<'suma' | 'cuenta'>('suma')
const tipoGrafica = ref<'barras' | 'pastel' | ''>('')
const lectura = ref<number | null>(null)
const mensaje = ref<{ tipo: 'exito' | 'aviso' | 'neutro'; texto: string } | null>(null)

watch(
  () => props.reto.id,
  () => {
    campoFila.value = ''
    campoValor.value = ''
    agregacion.value = 'suma'
    tipoGrafica.value = ''
    lectura.value = null
    mensaje.value = null
  }
)

const esDinamica = computed(() => props.reto.tipo === 'dinamica')

interface FilaResumen {
  etiqueta: string
  valor: number
}

function separarRef(ref: string) {
  const m = ref.match(/^([A-Z]+)(\d+)$/)
  return { col: m ? m[1] : 'A', fila: m ? Number(m[2]) : 1 }
}

const filasDatos = computed(() => {
  if (props.reto.tipo !== 'dinamica') return [] as Record<string, string>[]
  const { celdas, columnas, filas } = props.reto.libro
  const salida: Record<string, string>[] = []
  for (let f = 2; f <= filas; f++) {
    const registro: Record<string, string> = {}
    columnas.forEach((nombre, i) => {
      const letra = String.fromCharCode(65 + i)
      registro[nombre] = celdas[`${letra}${f}`] ?? ''
    })
    salida.push(registro)
  }
  return salida
})

const resumenActual = computed<FilaResumen[]>(() => {
  if (!esDinamica.value || props.reto.tipo !== 'dinamica') return []
  if (!campoFila.value || !campoValor.value) return []
  const grupos = new Map<string, number>()
  for (const registro of filasDatos.value) {
    const clave = registro[campoFila.value] ?? ''
    if (clave === '') continue
    if (agregacion.value === 'suma') {
      const n = Number(registro[campoValor.value])
      grupos.set(clave, (grupos.get(clave) ?? 0) + (Number.isFinite(n) ? n : 0))
    } else {
      grupos.set(clave, (grupos.get(clave) ?? 0) + 1)
    }
  }
  return Array.from(grupos.entries())
    .map(([etiqueta, valor]) => ({ etiqueta, valor }))
    .sort((a, b) => b.valor - a.valor)
})

function revisarDinamica() {
  if (props.reto.tipo !== 'dinamica') return
  const okFila = campoFila.value === props.reto.filaEsperada
  const okValor = campoValor.value === props.reto.valorEsperado
  const okAgregacion = agregacion.value === props.reto.agregacionEsperada
  if (okFila && okValor && okAgregacion) {
    const correcto = props.reto.resultadoEsperado.every((esperado) => {
      const encontrado = resumenActual.value.find((r) => r.etiqueta === esperado.etiqueta)
      return encontrado && encontrado.valor === esperado.valor
    })
    if (correcto) {
      mensaje.value = { tipo: 'exito', texto: props.reto.mensajeExito }
      emit('validado', true)
      return
    }
  }
  mensaje.value = {
    tipo: 'aviso',
    texto: 'Casi, mira la pista. Revisa qué campo va en filas, qué campo se suma y la operación.'
  }
  emit('validado', false)
}

function revisarGrafico() {
  if (props.reto.tipo !== 'grafico') return
  const okTipo = tipoGrafica.value === props.reto.tipoCorrecto
  const okLectura = lectura.value === props.reto.correctaLectura
  if (okTipo && okLectura) {
    mensaje.value = { tipo: 'exito', texto: props.reto.mensajeExito }
    emit('validado', true)
  } else {
    mensaje.value = { tipo: 'aviso', texto: 'Casi, mira la pista. Revisa el tipo de gráfica y la lectura.' }
    emit('validado', false)
  }
}

function porcentajeBarras(valor: number) {
  const max = Math.max(...(props.reto.tipo === 'grafico' ? props.reto.valores : [1]))
  return Math.max(6, Math.round((valor / max) * 100))
}

const colores = ['#005A8B', '#0099B8', '#4FA3C7', '#7FBFD9', '#A8D5E5']

function gradientePastel() {
  if (props.reto.tipo !== 'grafico') return ''
  const total = props.reto.valores.reduce((a, b) => a + b, 0) || 1
  let acumulado = 0
  const partes = props.reto.valores.map((v, i) => {
    const grados = (v / total) * 360
    const texto = `${colores[i % colores.length]} ${acumulado}deg ${acumulado + grados}deg`
    acumulado += grados
    return texto
  })
  return `conic-gradient(${partes.join(', ')})`
}
</script>

<template>
  <div class="space-y-4">
    <div v-if="reto.tipo === 'dinamica'" class="grid gap-4 md:grid-cols-3">
      <label class="block">
        <span class="mb-1 block text-sm font-semibold text-inegi-oscuro">Campo en filas</span>
        <select v-model="campoFila" class="campo">
          <option value="">Elige…</option>
          <option v-for="campo in reto.camposFila" :key="campo" :value="campo">{{ campo }}</option>
        </select>
      </label>
      <label class="block">
        <span class="mb-1 block text-sm font-semibold text-inegi-oscuro">Campo en valores</span>
        <select v-model="campoValor" class="campo">
          <option value="">Elige…</option>
          <option v-for="campo in reto.camposValor" :key="campo" :value="campo">{{ campo }}</option>
        </select>
      </label>
      <label class="block">
        <span class="mb-1 block text-sm font-semibold text-inegi-oscuro">Operación</span>
        <select v-model="agregacion" class="campo">
          <option value="suma">Suma</option>
          <option value="cuenta">Cuenta</option>
        </select>
      </label>
    </div>

    <div v-if="reto.tipo === 'dinamica'" class="overflow-hidden rounded-xl border border-inegi-borde">
      <table class="min-w-full text-left text-[15px]">
        <thead>
          <tr class="bg-inegi-oscuro text-white">
            <th class="px-4 py-2.5 font-semibold">{{ campoFila || 'Filas' }}</th>
            <th class="px-4 py-2.5 text-right font-semibold">Suma de {{ campoValor || 'valores' }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="resumenActual.length === 0">
            <td colspan="2" class="px-4 py-6 text-center text-inegi-secundario">
              Elige un campo en filas y otro en valores para ver tu tabla dinámica.
            </td>
          </tr>
          <tr v-for="(fila, i) in resumenActual" :key="fila.etiqueta" :class="i % 2 ? 'bg-inegi-fondo' : 'bg-white'">
            <td class="px-4 py-2.5 text-inegi-texto">{{ fila.etiqueta }}</td>
            <td class="px-4 py-2.5 text-right font-semibold tabular-nums text-inegi-oscuro">{{ fila.valor }}</td>
          </tr>
          <tr v-if="resumenActual.length" class="border-t-2 border-inegi-borde bg-inegi-claro font-semibold">
            <td class="px-4 py-2.5 text-inegi-oscuro">Total general</td>
            <td class="px-4 py-2.5 text-right tabular-nums text-inegi-oscuro">
              {{ resumenActual.reduce((a, b) => a + b.valor, 0) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <template v-if="reto.tipo === 'grafico'">
      <div class="flex flex-wrap gap-3">
        <button
          type="button"
          class="btn-suave"
          :class="tipoGrafica === 'barras' ? '!border-inegi-azul !bg-inegi-azul !text-white' : ''"
          @click="tipoGrafica = 'barras'"
        >
          Gráfica de barras
        </button>
        <button
          type="button"
          class="btn-suave"
          :class="tipoGrafica === 'pastel' ? '!border-inegi-azul !bg-inegi-azul !text-white' : ''"
          @click="tipoGrafica = 'pastel'"
        >
          Gráfica de pastel
        </button>
      </div>

      <div class="rounded-xl border border-inegi-borde bg-white p-4">
        <p class="mb-3 text-center text-sm font-semibold text-inegi-oscuro">{{ reto.titulo }}</p>
        <div v-if="tipoGrafica === 'barras' || tipoGrafica === ''" class="space-y-2.5">
          <div v-for="(etiqueta, i) in reto.etiquetas" :key="etiqueta" class="flex items-center gap-3">
            <span class="w-28 shrink-0 text-sm text-inegi-texto">{{ etiqueta }}</span>
            <div class="h-6 flex-1 overflow-hidden rounded bg-inegi-fondo">
              <div
                v-if="tipoGrafica === 'barras'"
                class="flex h-full items-center justify-end rounded px-2 text-xs font-bold text-white"
                :style="{ width: porcentajeBarras(reto.valores[i]) + '%', backgroundColor: colores[i % colores.length] }"
              >
                {{ reto.valores[i] }}
              </div>
            </div>
          </div>
          <p v-if="tipoGrafica === ''" class="pt-2 text-center text-sm text-inegi-secundario">
            Elige el tipo de gráfica para armarla.
          </p>
        </div>
        <div v-else class="flex flex-wrap items-center justify-center gap-6">
          <div class="h-40 w-40 rounded-full border border-inegi-borde" :style="{ background: gradientePastel() }" />
          <ul class="space-y-2">
            <li v-for="(etiqueta, i) in reto.etiquetas" :key="etiqueta" class="flex items-center gap-2 text-sm">
              <span class="h-3.5 w-3.5 rounded-sm" :style="{ backgroundColor: colores[i % colores.length] }" />
              {{ etiqueta }}: <strong>{{ reto.valores[i] }}</strong>
            </li>
          </ul>
        </div>
      </div>

      <fieldset class="space-y-2">
        <legend class="text-base font-semibold text-inegi-oscuro">{{ reto.preguntaLectura }}</legend>
        <button
          v-for="(opcion, i) in reto.opcionesLectura"
          :key="opcion"
          type="button"
          class="flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition"
          :class="
            lectura === i
              ? 'border-inegi-azul bg-inegi-claro font-semibold text-inegi-oscuro'
              : 'border-inegi-borde bg-white hover:bg-inegi-fondo'
          "
          @click="lectura = i"
        >
          <span
            class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold"
            :class="lectura === i ? 'border-inegi-azul bg-inegi-azul text-white' : 'border-inegi-borde text-inegi-secundario'"
          >
            {{ String.fromCharCode(65 + i) }}
          </span>
          {{ opcion }}
        </button>
      </fieldset>
    </template>

    <div class="flex flex-wrap items-center gap-3">
      <button
        type="button"
        class="btn-primario"
        @click="reto.tipo === 'dinamica' ? revisarDinamica() : revisarGrafico()"
      >
        Revisar mi respuesta
      </button>
    </div>

    <div
      v-if="mensaje"
      class="rounded-xl px-4 py-3 text-[16px] font-medium"
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
