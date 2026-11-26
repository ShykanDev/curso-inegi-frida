<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { RetoWord, RetoPowerPoint } from '../data/tipos'

const props = defineProps<{ reto: RetoWord | RetoPowerPoint }>()
const emit = defineEmits<{ (e: 'validado', ok: boolean): void }>()

const seleccion = ref<Record<string, number | null>>({})
const mensaje = ref<{ tipo: 'exito' | 'aviso' | 'neutro'; texto: string } | null>(null)

watch(
  () => props.reto.id,
  () => {
    seleccion.value = {}
    mensaje.value = null
  }
)

const esWord = computed(() => props.reto.tipo === 'word')

const folio = computed(() => {
  const campo = props.reto.campos.find((c) => c.id === 'folio')
  const i = seleccion.value['folio']
  return campo && i !== null && i !== undefined ? campo.opciones[i] : '________'
})

const titulo = computed(() => {
  const campo = props.reto.campos.find((c) => c.id === 'titulo' || c.id === 'portada' || c.id === 'diapo2' || c.id === 'diapo3')
  if (!campo) return ''
  const i = seleccion.value[campo.id]
  return i !== null && i !== undefined ? campo.opciones[i] : '________'
})

const fecha = computed(() => {
  const campo = props.reto.campos.find((c) => c.id === 'fecha')
  const i = seleccion.value['fecha']
  return campo && i !== null && i !== undefined ? campo.opciones[i] : '________'
})

const totalTabla = computed(() => {
  if (props.reto.tipo !== 'word') return 0
  return props.reto.tabla.filas.reduce((suma, fila) => suma + (Number(fila[1]) || 0), 0)
})

function revisar() {
  if (props.reto.tipo === 'word') {
    const faltan = props.reto.campos.filter((c) => seleccion.value[c.id] !== c.correcta)
    if (faltan.length > 0) {
      mensaje.value = {
        tipo: 'aviso',
        texto: `Casi, mira la pista. Revisa: ${faltan.map((c) => c.etiqueta.toLowerCase()).join(', ')}.`
      }
      emit('validado', false)
      return
    }
    if (totalTabla.value !== props.reto.tabla.total) {
      mensaje.value = {
        tipo: 'aviso',
        texto: 'El total de la tabla no coincide con la suma de las filas. Revísalo antes de entregar.'
      }
      emit('validado', false)
      return
    }
    mensaje.value = { tipo: 'exito', texto: props.reto.mensajeExito }
    emit('validado', true)
    return
  }

  const faltan = props.reto.campos.filter((c) => seleccion.value[c.id] !== c.correcta)
  if (faltan.length > 0) {
    mensaje.value = {
      tipo: 'aviso',
      texto: `Casi, mira la pista. Revisa: ${faltan.map((c) => c.etiqueta.toLowerCase()).join(', ')}.`
    }
    emit('validado', false)
    return
  }
  mensaje.value = { tipo: 'exito', texto: props.reto.mensajeExito }
  emit('validado', true)
}

const colores = ['#005A8B', '#0099B8', '#4FA3C7', '#7FBFD9', '#A8D5E5']

function alturaBarra(valor: number) {
  const max = Math.max(...props.reto.tabla.filas.map((f) => Number(f[1]) || 0), 1)
  return Math.max(12, Math.round((valor / max) * 100))
}
</script>

<template>
  <div class="space-y-5">
    <div class="grid gap-4 md:grid-cols-3">
      <label v-for="campo in reto.campos" :key="campo.id" class="block">
        <span class="mb-1 block text-sm font-semibold text-inegi-oscuro">{{ campo.etiqueta }}</span>
        <span class="mb-2 block text-xs text-inegi-secundario">{{ campo.ayuda }}</span>
        <select v-model="seleccion[campo.id]" class="campo">
          <option :value="null">Elige…</option>
          <option v-for="(opcion, i) in campo.opciones" :key="opcion" :value="i">{{ opcion }}</option>
        </select>
      </label>
    </div>

    <div v-if="esWord" class="rounded-xl border border-inegi-borde bg-white p-6 shadow-sm" aria-label="Vista previa del oficio">
      <div class="mb-6 flex flex-wrap items-start justify-between gap-2 border-b border-inegi-borde pb-4 text-sm text-inegi-secundario">
        <span>Ciudad de México, {{ fecha }}</span>
        <span>Folio: {{ folio }}</span>
      </div>
      <p class="text-center text-lg font-bold uppercase tracking-wide text-inegi-oscuro">Asunto: {{ titulo }}</p>
      <p class="mt-4 text-[15px] leading-relaxed text-inegi-texto">
        Por medio del presente se informa el avance de la semana en las alcaldías de la Ciudad de México.
        Se anexa la tabla con el total de entrevistas completas del periodo.
      </p>
      <table v-if="reto.tipo === 'word'" class="mt-4 w-full border-collapse text-left text-[15px]">
        <thead>
          <tr>
            <th v-for="col in reto.tabla.columnas" :key="col" class="border border-inegi-borde bg-inegi-claro px-3 py-2 font-semibold">
              {{ col }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(fila, i) in reto.tabla.filas" :key="i">
            <td v-for="(celda, j) in fila" :key="j" class="border border-inegi-borde px-3 py-2" :class="typeof celda === 'number' ? 'text-right tabular-nums' : ''">
              {{ celda }}
            </td>
          </tr>
          <tr class="bg-inegi-claro font-semibold">
            <td class="border border-inegi-borde px-3 py-2">{{ reto.tabla.etiquetaTotal }}</td>
            <td
              class="border border-inegi-borde px-3 py-2 text-right tabular-nums"
              :class="totalTabla === reto.tabla.total ? 'text-inegi-exito' : 'text-inegi-alerta'"
            >
              {{ totalTabla }}
            </td>
          </tr>
        </tbody>
      </table>
      <p class="mt-6 text-[15px] font-semibold text-inegi-oscuro">Atentamente</p>
      <p class="text-[15px] text-inegi-texto">Frida Paola Sánchez Aguirre</p>
    </div>

    <div v-else class="space-y-4">
      <div class="rounded-xl border border-inegi-borde bg-white p-6 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-inegi-secundario">Diapositiva 1 · Portada</p>
        <p class="mt-2 text-2xl font-bold text-inegi-oscuro">
          {{ seleccion['portada'] !== null && seleccion['portada'] !== undefined ? reto.campos.find((c) => c.id === 'portada')?.opciones[seleccion['portada'] as number] : '________' }}
        </p>
        <p class="mt-1 text-sm text-inegi-secundario">Frida Paola Sánchez Aguirre</p>
      </div>
      <div class="rounded-xl border border-inegi-borde bg-white p-6 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-inegi-secundario">Diapositiva 2</p>
        <p class="mt-2 text-lg font-semibold text-inegi-oscuro">
          {{ seleccion['diapo2'] !== null && seleccion['diapo2'] !== undefined ? reto.campos.find((c) => c.id === 'diapo2')?.opciones[seleccion['diapo2'] as number] : '________' }}
        </p>
        <table class="mt-3 w-full border-collapse text-left text-sm">
          <thead>
            <tr>
              <th v-for="col in reto.tabla.columnas" :key="col" class="border border-inegi-borde bg-inegi-claro px-3 py-1.5 font-semibold">
                {{ col }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(fila, i) in reto.tabla.filas" :key="i">
              <td v-for="(celda, j) in fila" :key="j" class="border border-inegi-borde px-3 py-1.5" :class="typeof celda === 'number' ? 'text-right tabular-nums' : ''">
                {{ celda }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="rounded-xl border border-inegi-borde bg-white p-6 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-inegi-secundario">Diapositiva 3</p>
        <p class="mt-2 text-lg font-semibold text-inegi-oscuro">
          {{ seleccion['diapo3'] !== null && seleccion['diapo3'] !== undefined ? reto.campos.find((c) => c.id === 'diapo3')?.opciones[seleccion['diapo3'] as number] : '________' }}
        </p>
        <div class="mt-4 flex h-40 items-end gap-3">
          <div v-for="(fila, i) in reto.tabla.filas" :key="i" class="flex flex-1 flex-col items-center gap-1">
            <div
              class="w-full rounded-t"
              :style="{ height: alturaBarra(Number(fila[1]) || 0) + '%', backgroundColor: colores[i % colores.length] }"
            />
            <span class="text-[11px] text-inegi-secundario">{{ fila[0] }}</span>
          </div>
        </div>
      </div>
    </div>

    <button type="button" class="btn-primario" @click="revisar">Revisar mi reporte</button>

    <div
      v-if="mensaje"
      class="rounded-xl px-4 py-3 text-[16px] font-medium"
      :class="{
        'bg-[#E3F2E5] text-inegi-exito': mensaje.tipo === 'exito',
        'bg-[#FFF6E0] text-[#8a5a00]': mensaje.tipo === 'aviso'
      }"
      role="status"
    >
      {{ mensaje.texto }}
    </div>
  </div>
</template>
