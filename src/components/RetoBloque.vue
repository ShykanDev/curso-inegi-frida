<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Reto } from '../data/tipos'
import SimuladorExcel from './SimuladorExcel.vue'
import RetoInteractivo from './RetoInteractivo.vue'
import RetoValidacion from './RetoValidacion.vue'
import RetoDocumento from './RetoDocumento.vue'
import RetoEleccion from './RetoEleccion.vue'
import RetoSimulacion from './RetoSimulacion.vue'

const props = defineProps<{
  reto: Reto
  completado: boolean
  numero?: string
}>()

const emit = defineEmits<{
  (e: 'completado', id: string): void
}>()

const mostrarPista = ref(false)
const mostrarRespuesta = ref(false)
const resueltoLocal = ref(false)

watch(
  () => props.reto.id,
  () => {
    mostrarPista.value = false
    mostrarRespuesta.value = false
    resueltoLocal.value = false
  }
)

function alValidar(ok: boolean) {
  if (ok) {
    resueltoLocal.value = true
    emit('completado', props.reto.id)
  }
}

function verRespuesta() {
  mostrarRespuesta.value = true
  if (!props.completado) emit('completado', props.reto.id)
}
</script>

<template>
  <section class="tarjeta overflow-hidden" :aria-label="`Reto ${numero ?? ''}`">
    <div class="flex flex-wrap items-center justify-between gap-2 border-b border-inegi-borde bg-inegi-oscuro px-5 py-3">
      <p class="text-sm font-semibold uppercase tracking-wide text-inegi-claro">
        Reto {{ numero ? `· ${numero}` : 'de práctica' }}
      </p>
      <span
        v-if="completado || resueltoLocal"
        class="chip bg-white/15 text-white"
      >
        ✓ Completado
      </span>
    </div>

    <div class="space-y-4 p-5">
      <p class="text-[17px] font-semibold leading-relaxed text-inegi-oscuro">{{ reto.pregunta }}</p>
      <p v-if="'instruccion' in reto && reto.instruccion" class="text-[16px] leading-relaxed text-inegi-texto">
        {{ reto.instruccion }}
      </p>

      <SimuladorExcel
        v-if="reto.tipo === 'excel'"
        :libro="reto.libro"
        :objetivos="reto.objetivos"
        @validado="alValidar"
      />
      <RetoInteractivo
        v-else-if="reto.tipo === 'dinamica' || reto.tipo === 'grafico'"
        :reto="reto"
        @validado="alValidar"
      />
      <RetoValidacion v-else-if="reto.tipo === 'validacion'" :reto="reto" @validado="alValidar" />
      <RetoDocumento
        v-else-if="reto.tipo === 'word' || reto.tipo === 'powerpoint'"
        :reto="reto"
        @validado="alValidar"
      />
      <RetoSimulacion v-else-if="reto.tipo === 'simulacion'" :reto="reto" @validado="alValidar" />
      <RetoEleccion
        v-else-if="reto.tipo === 'quiz' || reto.tipo === 'texto' || reto.tipo === 'clasificar'"
        :reto="reto"
        @validado="alValidar"
      />

      <div class="flex flex-wrap items-center gap-3 border-t border-inegi-borde pt-3">
        <button type="button" class="btn-suave !min-h-[44px] text-sm" @click="mostrarPista = !mostrarPista">
          {{ mostrarPista ? 'Ocultar pista' : 'Ver pista' }}
        </button>
        <button
          type="button"
          class="btn-suave !min-h-[44px] text-sm"
          @click="mostrarRespuesta = !mostrarRespuesta"
        >
          {{ mostrarRespuesta ? 'Ocultar respuesta modelo' : 'Ver respuesta modelo' }}
        </button>
      </div>

      <div v-if="mostrarPista" class="rounded-xl border-l-4 border-inegi-aviso bg-[#FFF6E0] px-4 py-3">
        <p class="text-sm font-semibold uppercase tracking-wide text-[#8a5a00]">Pista</p>
        <p class="mt-1 text-[16px] leading-relaxed text-[#6b4a00]">{{ reto.pista }}</p>
      </div>

      <div v-if="mostrarRespuesta" class="rounded-xl border-l-4 border-inegi-turquesa bg-inegi-claro/70 px-4 py-3">
        <p class="text-sm font-semibold uppercase tracking-wide text-inegi-azul">Respuesta modelo</p>
        <p class="mt-1 text-[16px] leading-relaxed text-inegi-texto">{{ reto.respuestaModelo }}</p>
        <button
          v-if="!completado && !resueltoLocal"
          type="button"
          class="btn-primario mt-3 !min-h-[40px] text-sm"
          @click="verRespuesta"
        >
          Ya la revisé, marcar el reto
        </button>
      </div>
    </div>
  </section>
</template>
