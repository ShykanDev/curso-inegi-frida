<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { modulos } from '../data/curso'
import { usarProgreso } from '../store/progreso'

interface EnlaceMenu {
  a: string
  texto: string
  icono: string
  tipo: 'inicio' | 'modulo' | 'progreso'
  id?: number
}

const ruta = useRoute()
const { porcentajeTotal, moduloActual, moduloCompleto, progresoModulo } = usarProgreso()
const abierto = ref(false)

watch(
  () => ruta.fullPath,
  () => {
    abierto.value = false
  }
)

const enlaces: EnlaceMenu[] = [
  { a: '/', texto: 'Inicio', icono: '⌂', tipo: 'inicio' },
  ...modulos.map((m) => ({
    a: `/modulo/${m.id}`,
    texto: `Módulo ${m.id}`,
    icono: String(m.id),
    tipo: 'modulo' as const,
    id: m.id
  })),
  { a: '/progreso', texto: 'Mi progreso', icono: '★', tipo: 'progreso' }
]

function activo(enlace: EnlaceMenu) {
  if (enlace.tipo === 'inicio') return ruta.path === '/'
  if (enlace.tipo === 'progreso') return ruta.path === '/progreso'
  return ruta.path === enlace.a
}
</script>

<template>
  <div class="min-h-screen bg-inegi-fondo">
    <header class="sticky top-0 z-40 bg-inegi-oscuro text-white shadow-flotante">
      <div class="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <button
          type="button"
          class="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/25 text-xl lg:hidden"
          aria-label="Abrir menú"
          :aria-expanded="abierto"
          @click="abierto = !abierto"
        >
          {{ abierto ? '✕' : '☰' }}
        </button>
        <div class="min-w-0 flex-1">
          <h1 class="truncate text-lg font-bold tracking-tight sm:text-xl">Curso práctico INEGI para Frida</h1>
          <p class="truncate text-xs text-inegi-claro/80 sm:text-sm">Dirección Regional Centro · Ciudad de México</p>
        </div>
        <div class="hidden shrink-0 items-center gap-3 sm:flex">
          <div class="text-right">
            <p class="text-xs text-inegi-claro/80">Vas en el módulo {{ moduloActual }} de 5</p>
            <p class="text-sm font-bold">{{ porcentajeTotal }}% completado</p>
          </div>
        </div>
      </div>
      <div class="h-2 bg-inegi-claro">
        <div
          class="h-full bg-inegi-turquesa transition-all duration-500"
          :style="{ width: porcentajeTotal + '%' }"
          role="progressbar"
          :aria-valuenow="porcentajeTotal"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Progreso total del curso"
        />
      </div>
    </header>

    <div class="mx-auto flex max-w-7xl gap-6 px-0 sm:px-6">
      <aside
        class="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto border-r border-inegi-borde bg-white px-4 py-6 transition-transform lg:static lg:z-0 lg:w-64 lg:shrink-0 lg:translate-x-0 lg:border-r-0 lg:bg-transparent lg:px-0 lg:py-8"
        :class="abierto ? 'translate-x-0 shadow-flotante' : '-translate-x-full'"
        aria-label="Menú del curso"
      >
        <div class="mb-4 flex items-center justify-between lg:hidden">
          <span class="text-sm font-bold text-inegi-oscuro">Menú</span>
          <button
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-inegi-borde text-inegi-secundario"
            aria-label="Cerrar menú"
            @click="abierto = false"
          >
            ✕
          </button>
        </div>
        <nav class="space-y-1 lg:sticky lg:top-28">
          <RouterLink
            v-for="enlace in enlaces"
            :key="enlace.a"
            :to="enlace.a"
            class="enlace-menu"
            :class="activo(enlace) ? 'enlace-menu-activo' : ''"
          >
            <span
              class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
              :class="activo(enlace) ? 'bg-white/20 text-white' : 'bg-inegi-claro text-inegi-azul'"
            >
              {{ enlace.icono }}
            </span>
            <span class="flex-1">{{ enlace.texto }}</span>
            <span
              v-if="enlace.tipo === 'modulo' && enlace.id !== undefined"
              class="text-xs font-semibold"
              :class="
                activo(enlace)
                  ? 'text-white/80'
                  : moduloCompleto(enlace.id)
                    ? 'text-inegi-exito'
                    : 'text-inegi-secundario'
              "
            >
              {{ moduloCompleto(enlace.id) ? '✓' : progresoModulo(enlace.id) + '%' }}
            </span>
          </RouterLink>
        </nav>
      </aside>

      <div
        v-if="abierto"
        class="fixed inset-0 z-40 bg-inegi-oscuro/50 lg:hidden"
        aria-hidden="true"
        @click="abierto = false"
      />

      <main class="min-w-0 flex-1 px-4 py-6 sm:px-0 lg:py-8">
        <slot />
      </main>
    </div>
  </div>
</template>
