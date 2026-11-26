<script setup lang="ts">
import type { Ejemplo } from '../data/tipos'

defineProps<{ ejemplo: Ejemplo }>()

function porcentaje(valor: number, maximo: number) {
  if (maximo <= 0) return 0
  return Math.max(4, Math.round((valor / maximo) * 100))
}

function maximoDe(valores: number[]) {
  return Math.max(...valores, 1)
}

const colores = ['#005A8B', '#0099B8', '#4FA3C7', '#7FBFD9', '#A8D5E5', '#C9E4F0']

function anguloPastel(valores: number[]) {
  const total = valores.reduce((a, b) => a + b, 0) || 1
  let acumulado = 0
  return valores.map((v) => {
    const inicio = (acumulado / total) * 360
    acumulado += v
    const fin = (acumulado / total) * 360
    return { inicio, fin, grados: fin - inicio }
  })
}

function colorPastel(indice: number) {
  return colores[indice % colores.length]
}

function pastelGradiente(valores: number[]) {
  const segmentos = anguloPastel(valores)
  let acumulado = 0
  const partes = segmentos.map((s, i) => {
    const texto = `${colorPastel(i)} ${acumulado}deg ${acumulado + s.grados}deg`
    acumulado += s.grados
    return texto
  })
  return `conic-gradient(${partes.join(', ')})`
}
</script>

<template>
  <div class="tarjeta overflow-hidden">
    <div v-if="ejemplo.titulo" class="border-b border-inegi-borde bg-inegi-claro/60 px-5 py-3">
      <p class="text-sm font-semibold uppercase tracking-wide text-inegi-azul">Ejemplo ya hecho</p>
      <p class="text-lg font-semibold text-inegi-oscuro">{{ ejemplo.titulo }}</p>
    </div>
    <div class="p-5">
      <p
        v-if="ejemplo.tipo === 'texto'"
        class="rounded-xl bg-inegi-fondo p-4 text-[17px] leading-relaxed text-inegi-texto"
      >
        {{ ejemplo.contenido }}
      </p>

      <ul v-else-if="ejemplo.tipo === 'lista'" class="space-y-2">
        <li v-for="(item, i) in ejemplo.items" :key="i" class="flex gap-3 text-[17px] leading-relaxed">
          <span class="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-inegi-claro text-xs font-bold text-inegi-azul">
            {{ i + 1 }}
          </span>
          <span>{{ item }}</span>
        </li>
      </ul>

      <div v-else-if="ejemplo.tipo === 'tabla'" class="overflow-x-auto">
        <table class="min-w-full border-collapse text-left text-[15px]">
          <thead>
            <tr>
              <th
                v-for="col in ejemplo.columnas"
                :key="col"
                class="border border-inegi-borde bg-inegi-claro px-3 py-2.5 font-semibold text-inegi-oscuro"
              >
                {{ col }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(fila, i) in ejemplo.filas" :key="i">
              <td
                v-for="(celda, j) in fila"
                :key="j"
                class="border border-inegi-borde px-3 py-2.5 text-inegi-texto"
                :class="typeof celda === 'number' ? 'text-right tabular-nums' : ''"
              >
                {{ celda }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="ejemplo.tipo === 'formula'" class="space-y-3">
        <div class="rounded-xl border border-inegi-borde bg-white px-4 py-3 font-mono text-[15px] text-inegi-oscuro">
          {{ ejemplo.formula }}
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <span class="chip bg-inegi-claro text-inegi-azul">Resultado</span>
          <span class="text-2xl font-bold text-inegi-exito">{{ ejemplo.resultado }}</span>
        </div>
        <p class="text-[16px] leading-relaxed text-inegi-secundario">{{ ejemplo.explicacion }}</p>
      </div>

      <div v-else-if="ejemplo.tipo === 'grafico'" class="space-y-4">
        <div v-if="ejemplo.estilo === 'barras'" class="space-y-3">
          <div v-for="(etiqueta, i) in ejemplo.etiquetas" :key="etiqueta" class="flex items-center gap-3">
            <span class="w-28 shrink-0 text-sm font-medium text-inegi-texto">{{ etiqueta }}</span>
            <div class="h-7 flex-1 overflow-hidden rounded-md bg-inegi-fondo">
              <div
                class="flex h-full items-center justify-end rounded-md px-2 text-xs font-bold text-white transition-all"
                :style="{
                  width: porcentaje(ejemplo.valores[i], maximoDe(ejemplo.valores)) + '%',
                  backgroundColor: colorPastel(i)
                }"
              >
                {{ ejemplo.valores[i] }}
              </div>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-wrap items-center gap-6">
          <div
            class="h-40 w-40 shrink-0 rounded-full border border-inegi-borde"
            :style="{ background: pastelGradiente(ejemplo.valores) }"
            role="img"
            aria-label="Gráfica de pastel del ejemplo"
          />
          <ul class="space-y-2">
            <li v-for="(etiqueta, i) in ejemplo.etiquetas" :key="etiqueta" class="flex items-center gap-2 text-[15px]">
              <span class="h-3.5 w-3.5 rounded-sm" :style="{ backgroundColor: colorPastel(i) }" />
              <span class="text-inegi-texto">{{ etiqueta }}: <strong>{{ ejemplo.valores[i] }}</strong></span>
            </li>
          </ul>
        </div>
        <p v-if="ejemplo.nota" class="text-[16px] leading-relaxed text-inegi-secundario">{{ ejemplo.nota }}</p>
      </div>

      <div v-else-if="ejemplo.tipo === 'tarjetas'" class="grid gap-3 sm:grid-cols-2">
        <div v-for="item in ejemplo.items" :key="item.titulo" class="rounded-xl border border-inegi-borde bg-inegi-fondo p-4">
          <p class="font-semibold text-inegi-oscuro">{{ item.titulo }}</p>
          <p class="mt-1 text-[16px] leading-relaxed text-inegi-secundario">{{ item.texto }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
