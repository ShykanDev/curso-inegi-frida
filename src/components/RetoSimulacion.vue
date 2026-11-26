<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { RetoSimulacion } from '../data/tipos'

const props = defineProps<{ reto: RetoSimulacion }>()
const emit = defineEmits<{ (e: 'validado', ok: boolean): void }>()

const paso = ref(0)
const opcion = ref<number | null>(null)
const resuelto = ref(false)
const mensaje = ref<{ tipo: 'exito' | 'aviso'; texto: string } | null>(null)
const completado = ref(false)

watch(
  () => props.reto.id,
  () => {
    paso.value = 0
    opcion.value = null
    resuelto.value = false
    mensaje.value = null
    completado.value = false
  }
)

const actual = computed(() => props.reto.pasos[paso.value])

function confirmar() {
  if (opcion.value === null) {
    mensaje.value = { tipo: 'aviso', texto: 'Elige una opción para continuar.' }
    return
  }
  if (opcion.value === actual.value.correcta) {
    resuelto.value = true
    mensaje.value = { tipo: 'exito', texto: `¡Bien! ${actual.value.explicacion}` }
  } else {
    resuelto.value = false
    mensaje.value = { tipo: 'aviso', texto: 'Casi, mira la pista. Vuelve a leer la situación y prueba de nuevo.' }
  }
}

function siguiente() {
  if (paso.value < props.reto.pasos.length - 1) {
    paso.value++
    opcion.value = null
    resuelto.value = false
    mensaje.value = null
  } else {
    completado.value = true
    mensaje.value = { tipo: 'exito', texto: props.reto.mensajeExito }
    emit('validado', true)
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap gap-2">
      <span
        v-for="(_, i) in reto.pasos"
        :key="i"
        class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
        :class="i < paso || completado ? 'bg-inegi-exito/15 text-inegi-exito' : i === paso ? 'bg-inegi-azul text-white' : 'bg-inegi-claro text-inegi-secundario'"
      >
        {{ i + 1 }}
      </span>
    </div>

    <div v-if="!completado" class="rounded-xl border border-inegi-borde bg-white p-5">
      <p class="text-sm font-semibold uppercase tracking-wide text-inegi-azul">{{ actual.titulo }}</p>
      <p class="mt-2 text-[17px] leading-relaxed text-inegi-texto">{{ actual.guion }}</p>
      <p class="mt-4 text-base font-semibold text-inegi-oscuro">{{ actual.pregunta }}</p>
      <div class="mt-3 space-y-2">
        <button
          v-for="(op, i) in actual.opciones"
          :key="op"
          type="button"
          class="flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition"
          :class="
            opcion === i
              ? 'border-inegi-azul bg-inegi-claro font-semibold'
              : 'border-inegi-borde bg-white hover:bg-inegi-fondo'
          "
          :aria-pressed="opcion === i"
          @click="opcion = i; mensaje = null"
        >
          <span
            class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold"
            :class="opcion === i ? 'border-inegi-azul bg-inegi-azul text-white' : 'border-inegi-borde text-inegi-secundario'"
          >
            {{ String.fromCharCode(65 + i) }}
          </span>
          <span class="text-[16px] leading-relaxed">{{ op }}</span>
        </button>
      </div>
    </div>

    <div class="flex flex-wrap gap-3">
      <button v-if="!completado" type="button" class="btn-primario" @click="confirmar">Confirmar</button>
      <button v-if="resuelto && !completado" type="button" class="btn-secundario" @click="siguiente">
        {{ paso < reto.pasos.length - 1 ? 'Siguiente parte del día' : 'Terminar mi día' }}
      </button>
    </div>

    <div
      v-if="mensaje"
      class="rounded-xl px-4 py-3 text-[16px] font-medium"
      :class="mensaje.tipo === 'exito' ? 'bg-[#E3F2E5] text-inegi-exito' : 'bg-[#FFF6E0] text-[#8a5a00]'"
      role="status"
    >
      {{ mensaje.texto }}
    </div>
  </div>
</template>
