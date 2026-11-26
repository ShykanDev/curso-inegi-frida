<script setup lang="ts">
import { ref, watch } from 'vue'
import type { RetoValidacion } from '../data/tipos'

const props = defineProps<{ reto: RetoValidacion }>()
const emit = defineEmits<{ (e: 'validado', ok: boolean): void }>()

const marcadas = ref<Set<number>>(new Set())
const observaciones = ref<Record<number, string>>({})
const mensaje = ref<{ tipo: 'exito' | 'aviso' | 'neutro'; texto: string } | null>(null)
const revisado = ref(false)

watch(
  () => props.reto.id,
  () => {
    marcadas.value = new Set()
    observaciones.value = {}
    mensaje.value = null
    revisado.value = false
  }
)

function alternar(indice: number) {
  const copia = new Set(marcadas.value)
  if (copia.has(indice)) copia.delete(indice)
  else copia.add(indice)
  marcadas.value = copia
  mensaje.value = null
}

function revisar() {
  const esperadas = props.reto.errores.map((e) => e.fila)
  const marcadasArr = Array.from(marcadas.value)
  const faltantes = esperadas.filter((f) => !marcadasArr.includes(f))
  const sobrantes = marcadasArr.filter((f) => !esperadas.includes(f))
  const sinObservacion = esperadas.filter((f) => (observaciones.value[f] ?? '').trim().length < 8)
  revisado.value = true

  if (faltantes.length === 0 && sobrantes.length === 0 && sinObservacion.length === 0) {
    mensaje.value = { tipo: 'exito', texto: props.reto.mensajeExito }
    emit('validado', true)
    return
  }

  if (faltantes.length > 0) {
    mensaje.value = {
      tipo: 'aviso',
      texto: `Casi, mira la pista. Todavía te faltan ${faltantes.length} fila(s) con error por marcar.`
    }
  } else if (sobrantes.length > 0) {
    mensaje.value = {
      tipo: 'aviso',
      texto: 'Revisa: marcaste una fila que sí está correcta. Quítale la marca y vuelve a intentar.'
    }
  } else {
    mensaje.value = {
      tipo: 'aviso',
      texto: 'Ya marcaste las filas correctas. Ahora escribe la observación de cada una (mínimo 8 palabras).'
    }
  }
  emit('validado', false)
}

function esError(indice: number) {
  return props.reto.errores.some((e) => e.fila === indice)
}
</script>

<template>
  <div class="space-y-4">
    <div class="overflow-x-auto rounded-xl border border-inegi-borde">
      <table class="min-w-full text-left text-[15px]">
        <thead>
          <tr class="bg-inegi-oscuro text-white">
            <th class="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide">Marcar</th>
            <th v-for="col in reto.columnas" :key="col" class="px-3 py-2.5 font-semibold">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(fila, i) in reto.filas"
            :key="i"
            :class="[
              marcadas.has(i) ? 'bg-[#FFF6E0]' : i % 2 ? 'bg-inegi-fondo' : 'bg-white',
              revisado && esError(i) && !marcadas.has(i) ? 'ring-2 ring-inset ring-inegi-aviso' : ''
            ]"
          >
            <td class="px-3 py-2">
              <button
                type="button"
                class="flex h-9 w-9 items-center justify-center rounded-lg border-2 transition"
                :class="
                  marcadas.has(i)
                    ? 'border-inegi-aviso bg-inegi-aviso text-white'
                    : 'border-inegi-borde bg-white text-inegi-secundario hover:border-inegi-aviso'
                "
                :aria-pressed="marcadas.has(i)"
                :aria-label="`Marcar fila ${i + 1} como error`"
                @click="alternar(i)"
              >
                ✓
              </button>
            </td>
            <td v-for="(celda, j) in fila" :key="j" class="px-3 py-2 text-inegi-texto">{{ celda }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="marcadas.size > 0" class="space-y-3 rounded-xl border border-inegi-borde bg-white p-4">
      <p class="font-semibold text-inegi-oscuro">Observación para cada fila marcada</p>
      <div v-for="indice in Array.from(marcadas).sort((a, b) => a - b)" :key="indice" class="space-y-1">
        <label :for="`obs-${indice}`" class="text-sm font-medium text-inegi-texto">
          Fila {{ indice + 1 }} · Folio {{ reto.filas[indice][0] }}
        </label>
        <textarea
          :id="`obs-${indice}`"
          v-model="observaciones[indice]"
          class="campo min-h-[70px]"
          placeholder="Escribe qué problema tiene y qué se necesita hacer, sin cambiar el dato."
        />
      </div>
    </div>

    <button type="button" class="btn-primario" @click="revisar">Revisar mi validación</button>

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

    <div v-if="revisado && mensaje?.tipo === 'exito'" class="space-y-2 rounded-xl border border-inegi-borde bg-inegi-fondo p-4">
      <p class="font-semibold text-inegi-oscuro">Observaciones modelo</p>
      <ul class="space-y-1.5 text-[15px] text-inegi-texto">
        <li v-for="e in reto.errores" :key="e.fila" class="flex gap-2">
          <span class="font-semibold text-inegi-azul">Fila {{ e.fila + 1 }}:</span>
          <span>{{ e.observacion }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
