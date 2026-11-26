<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { obtenerModulo, siguienteModulo, moduloAnterior, modulos } from '../data/curso'
import { usarProgreso } from '../store/progreso'
import EjemploBloque from '../components/EjemploBloque.vue'
import RetoBloque from '../components/RetoBloque.vue'

const props = defineProps<{ id: string }>()
const ruta = useRoute()
const navegador = useRouter()
const { leccionHecha, retoHecho, marcarLeccion, marcarReto, progresoModulo, moduloCompleto } = usarProgreso()

const modulo = computed(() => obtenerModulo(Number(props.id)))
const leccionActual = ref<string | null>(null)
const zona = ref<HTMLElement | null>(null)

function inicializar() {
  const m = modulo.value
  if (!m) return
  const pedida = typeof ruta.query.leccion === 'string' ? ruta.query.leccion : null
  if (pedida && m.lecciones.some((l) => l.id === pedida)) {
    leccionActual.value = pedida
  } else if (!leccionActual.value || !m.lecciones.some((l) => l.id === leccionActual.value)) {
    const primeraPendiente = m.lecciones.find((l) => !leccionHecha(l.id))
    leccionActual.value = primeraPendiente ? primeraPendiente.id : m.lecciones[0]?.id ?? null
  }
}

watch(() => props.id, inicializar, { immediate: true })
watch(() => ruta.query.leccion, inicializar)

const leccion = computed(() => modulo.value?.lecciones.find((l) => l.id === leccionActual.value))

const indiceLeccion = computed(() => {
  if (!modulo.value || !leccion.value) return -1
  return modulo.value.lecciones.findIndex((l) => l.id === leccion.value!.id)
})

const anterior = computed(() => (indiceLeccion.value > 0 ? modulo.value!.lecciones[indiceLeccion.value - 1] : null))
const siguiente = computed(() => {
  if (!modulo.value) return null
  return modulo.value.lecciones[indiceLeccion.value + 1] ?? null
})

const sigModulo = computed(() => siguienteModulo(Number(props.id)))
const antModulo = computed(() => moduloAnterior(Number(props.id)))

const todasHechas = computed(() => {
  if (!modulo.value) return false
  return modulo.value.lecciones.every((l) => leccionHecha(l.id))
})

async function elegirLeccion(id: string) {
  leccionActual.value = id
  await nextTick()
  zona.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function completarLeccion() {
  if (leccion.value) marcarLeccion(leccion.value.id)
}

function completarReto(id: string) {
  marcarReto(id)
  if (leccion.value) marcarLeccion(leccion.value.id)
}

function irASiguiente() {
  if (!leccion.value) return
  marcarLeccion(leccion.value.id)
  if (siguiente.value) {
    elegirLeccion(siguiente.value.id)
  }
}

function irAModulo(destino: number | null) {
  if (destino === null) navegador.push('/')
  else navegador.push(`/modulo/${destino}`)
}

const totalModulos = modulos.length
</script>

<template>
  <div v-if="modulo" ref="zona" class="space-y-6">
    <nav class="flex flex-wrap items-center gap-1 text-sm text-inegi-secundario" aria-label="Ruta de navegación">
      <RouterLink to="/" class="hover:text-inegi-azul">Inicio</RouterLink>
      <span aria-hidden="true">/</span>
      <span class="font-semibold text-inegi-oscuro">Módulo {{ modulo.id }}</span>
    </nav>

    <section class="overflow-hidden rounded-2xl border border-inegi-borde bg-white shadow-tarjeta">
      <div class="border-b-4 border-inegi-turquesa bg-inegi-oscuro p-6 text-white">
        <p class="text-sm font-semibold uppercase tracking-wide text-inegi-claro/90">
          Módulo {{ modulo.id }} de {{ totalModulos - 1 }} · {{ modulo.tiempo }}
        </p>
        <h2 class="mt-1 text-2xl font-bold sm:text-3xl">{{ modulo.titulo }}</h2>
        <p class="mt-1 text-inegi-claro/90">{{ modulo.subtitulo }}</p>
      </div>
      <div class="grid gap-4 p-6 sm:grid-cols-[1.6fr_1fr]">
        <div>
          <p class="etiqueta">Objetivo del módulo</p>
          <p class="mt-1 bloque-texto">{{ modulo.objetivo }}</p>
        </div>
        <div class="rounded-xl bg-inegi-fondo p-4">
          <div class="flex items-center justify-between text-sm font-semibold text-inegi-secundario">
            <span>Tu avance en este módulo</span>
            <span class="text-inegi-azul">{{ progresoModulo(modulo.id) }}%</span>
          </div>
          <div class="mt-2 h-2.5 overflow-hidden rounded-full bg-white">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="moduloCompleto(modulo.id) ? 'bg-inegi-exito' : 'bg-inegi-turquesa'"
              :style="{ width: progresoModulo(modulo.id) + '%' }"
            />
          </div>
          <p class="mt-2 text-xs text-inegi-secundario">
            {{ modulo.lecciones.filter((l) => leccionHecha(l.id)).length }} de {{ modulo.lecciones.length }} lecciones completadas
          </p>
        </div>
      </div>
    </section>

    <div class="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside class="tarjeta h-fit p-3 lg:sticky lg:top-28">
        <p class="px-2 py-1.5 text-sm font-bold uppercase tracking-wide text-inegi-secundario">Lecciones</p>
        <ul class="space-y-1">
          <li v-for="l in modulo.lecciones" :key="l.id">
            <button
              type="button"
              class="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition"
              :class="
                leccionActual === l.id
                  ? 'bg-inegi-azul font-semibold text-white'
                  : 'text-inegi-texto hover:bg-inegi-claro'
              "
              :aria-current="leccionActual === l.id ? 'true' : undefined"
              @click="elegirLeccion(l.id)"
            >
              <span
                class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                :class="
                  leccionHecha(l.id)
                    ? leccionActual === l.id
                      ? 'bg-white/25 text-white'
                      : 'bg-inegi-exito/15 text-inegi-exito'
                    : leccionActual === l.id
                      ? 'border border-white/50 text-white'
                      : 'border border-inegi-borde bg-white text-inegi-secundario'
                "
              >
                {{ leccionHecha(l.id) ? '✓' : '' }}
              </span>
              <span class="leading-snug">{{ l.numero }} · {{ l.titulo }}</span>
            </button>
          </li>
        </ul>
      </aside>

      <div v-if="leccion" class="min-w-0 space-y-5">
        <article class="tarjeta p-5 sm:p-6">
          <p class="etiqueta">Lección {{ leccion.numero }}</p>
          <h3 class="mt-1 text-xl font-bold leading-snug text-inegi-oscuro sm:text-2xl">{{ leccion.titulo }}</h3>

          <div class="mt-4 space-y-3">
            <p v-for="(bloque, i) in leccion.bloques" :key="i" class="bloque-texto">{{ bloque }}</p>
          </div>

          <div v-if="leccion.ejemplo" class="mt-5">
            <EjemploBloque :ejemplo="leccion.ejemplo" />
          </div>
        </article>

        <RetoBloque
          :reto="leccion.reto"
          :numero="leccion.numero"
          :completado="retoHecho(leccion.reto.id) || leccionHecha(leccion.id)"
          @completado="completarReto"
        />

        <div class="flex flex-wrap items-center gap-3">
          <button type="button" class="btn-primario" @click="irASiguiente">
            {{ siguiente ? 'Siguiente lección' : 'Terminar el módulo' }}
            <span aria-hidden="true">→</span>
          </button>
          <button
            v-if="!leccionHecha(leccion.id)"
            type="button"
            class="btn-suave"
            @click="completarLeccion"
          >
            Marcar lección como vista
          </button>
          <button v-if="anterior" type="button" class="btn-suave" @click="elegirLeccion(anterior.id)">
            ← {{ anterior.numero }}
          </button>
        </div>
      </div>
    </div>

    <section v-if="modulo.reto" class="space-y-3">
      <div class="flex flex-wrap items-center gap-2">
        <span class="chip bg-inegi-turquesa/15 text-inegi-azul">Reto de cierre del módulo</span>
        <span class="text-sm text-inegi-secundario">Cuando lo completes, marcaremos el módulo como listo.</span>
      </div>
      <RetoBloque
        :reto="modulo.reto"
        numero="cierre"
        :completado="todasHechas"
        @completado="completarReto"
      />
    </section>

    <section
      v-if="todasHechas"
      class="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-inegi-exito/30 bg-[#E3F2E5] p-5"
    >
      <div>
        <p class="text-lg font-bold text-inegi-exito">¡Terminaste el Módulo {{ modulo.id }}!</p>
        <p class="text-[16px] text-inegi-texto">Ya puedes seguir, o repasar lo que quieras. Nada se pierde.</p>
      </div>
      <button v-if="sigModulo !== null" type="button" class="btn-primario" @click="irAModulo(sigModulo)">
        Ir al Módulo {{ sigModulo }} →
      </button>
      <button v-else type="button" class="btn-primario" @click="navegador.push('/progreso')">
        Ver mis insignias →
      </button>
    </section>

    <div v-else class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-inegi-borde bg-white p-4">
      <button v-if="antModulo !== null" type="button" class="btn-suave" @click="irAModulo(antModulo)">
        ← Módulo {{ antModulo }}
      </button>
      <p class="text-sm text-inegi-secundario">Cada lección suma a tu progreso. Vas bien.</p>
      <button v-if="sigModulo !== null" type="button" class="btn-suave" @click="irAModulo(sigModulo)">
        Módulo {{ sigModulo }} →
      </button>
    </div>
  </div>

  <div v-else class="tarjeta p-8 text-center">
    <p class="text-lg font-semibold text-inegi-oscuro">No encontré ese módulo.</p>
    <RouterLink to="/" class="btn-primario mt-4 inline-flex">Volver al inicio</RouterLink>
  </div>
</template>
