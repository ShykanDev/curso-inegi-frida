<script setup lang="ts">
import { computed } from 'vue'
import { gradientePastel, paletaGrafico, type SerieGrafico } from '../lib/formatoExcel'

const props = defineProps<{
  tipo: 'barras' | 'pastel'
  datos: SerieGrafico[]
  titulo?: string
  compacto?: boolean
}>()

const maximo = computed(() => Math.max(...props.datos.map((d) => d.valor), 1))
const total = computed(() => props.datos.reduce((a, b) => a + b.valor, 0))

function ancho(valor: number) {
  return Math.max(6, Math.round((valor / maximo.value) * 100))
}

const gradiente = computed(() => gradientePastel(props.datos.map((d) => d.valor), paletaGrafico))
const alto = computed(() => (props.compacto ? 150 : 220))
</script>

<template>
  <figure class="rounded-xl border border-inegi-borde bg-white p-4">
    <figcaption class="mb-3 text-center text-sm font-semibold text-inegi-oscuro">
      {{ titulo || 'Gráfica' }}
    </figcaption>

    <p v-if="datos.length === 0" class="py-8 text-center text-sm text-inegi-secundario">
      Selecciona un rango con etiquetas y números para generar la gráfica.
    </p>

    <div v-else-if="tipo === 'barras'" class="space-y-2.5">
      <div v-for="(d, i) in datos" :key="d.etiqueta + i" class="flex items-center gap-3">
        <span class="w-24 shrink-0 truncate text-right text-xs font-medium text-inegi-texto" :title="d.etiqueta">
          {{ d.etiqueta }}
        </span>
        <div class="flex-1 overflow-hidden rounded bg-inegi-fondo" :style="{ height: compacto ? '18px' : '24px' }">
          <div
            class="flex h-full items-center justify-end rounded px-1.5 text-[11px] font-bold text-white"
            :style="{ width: ancho(d.valor) + '%', backgroundColor: paletaGrafico[i % paletaGrafico.length] }"
          >
            {{ d.valor }}
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-wrap items-center justify-center gap-5">
      <div
        class="shrink-0 rounded-full border border-inegi-borde"
        :style="{ background: gradiente, width: alto + 'px', height: alto + 'px' }"
        role="img"
        :aria-label="`Gráfica de pastel: ${titulo || 'datos'}`"
      />
      <ul class="space-y-1.5">
        <li v-for="(d, i) in datos" :key="d.etiqueta + i" class="flex items-center gap-2 text-xs">
          <span class="h-3 w-3 shrink-0 rounded-sm" :style="{ backgroundColor: paletaGrafico[i % paletaGrafico.length] }" />
          <span class="text-inegi-texto">{{ d.etiqueta }}: <strong>{{ d.valor }}</strong></span>
          <span class="text-inegi-secundario">({{ total > 0 ? Math.round((d.valor / total) * 100) : 0 }}%)</span>
        </li>
      </ul>
    </div>
  </figure>
</template>
