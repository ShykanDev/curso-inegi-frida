<script setup lang="ts">
import { ref, computed } from 'vue'
import { modulos } from '../data/curso'
import { usarProgreso } from '../store/progreso'

const {
  estado,
  porcentajeTotal,
  insignias,
  moduloCompleto,
  progresoModulo,
  leccionesModulo,
  reiniciar,
  totalLecciones,
  totalRetos
} = usarProgreso()

const confirmando = ref(false)

const fechaActualizacion = computed(() => {
  if (!estado.actualizado) return null
  try {
    return new Date(estado.actualizado).toLocaleString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return null
  }
})

function reiniciarTodo() {
  reiniciar()
  confirmando.value = false
}
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-2xl border border-inegi-borde bg-white p-6 shadow-tarjeta">
      <h2 class="text-2xl font-bold text-inegi-oscuro">Mi progreso</h2>
      <p class="mt-1 text-inegi-secundario">
        Aquí ves todo lo que ya hiciste. No hay calificaciones, solo avance.
      </p>

      <div class="mt-5 grid gap-4 sm:grid-cols-3">
        <div class="rounded-xl bg-inegi-claro/70 p-4 text-center">
          <p class="text-xs font-semibold uppercase text-inegi-secundario">Progreso total</p>
          <p class="mt-1 text-4xl font-bold text-inegi-azul">{{ porcentajeTotal }}%</p>
        </div>
        <div class="rounded-xl bg-inegi-fondo p-4 text-center">
          <p class="text-xs font-semibold uppercase text-inegi-secundario">Lecciones</p>
          <p class="mt-1 text-4xl font-bold text-inegi-oscuro">
            {{ estado.leccionesHechas.length }}<span class="text-lg text-inegi-secundario">/{{ totalLecciones }}</span>
          </p>
        </div>
        <div class="rounded-xl bg-inegi-fondo p-4 text-center">
          <p class="text-xs font-semibold uppercase text-inegi-secundario">Retos completados</p>
          <p class="mt-1 text-4xl font-bold text-inegi-oscuro">
            {{ estado.retosHechos.length }}<span class="text-lg text-inegi-secundario">/{{ totalRetos }}</span>
          </p>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <h3 class="text-xl font-bold text-inegi-oscuro">Insignias</h3>
      <div class="grid gap-4 sm:grid-cols-2">
        <div
          v-for="insignia in insignias"
          :key="insignia.id"
          class="tarjeta flex items-start gap-4 p-5"
          :class="insignia.lograda ? 'border-inegi-turquesa/50' : 'opacity-70'"
        >
          <span
            class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl font-bold"
            :class="insignia.lograda ? 'bg-inegi-azul text-white' : 'bg-inegi-fondo text-inegi-secundario'"
          >
            {{ insignia.icono }}
          </span>
          <div>
            <p class="font-bold text-inegi-oscuro">{{ insignia.nombre }}</p>
            <p class="text-sm leading-relaxed text-inegi-secundario">{{ insignia.descripcion }}</p>
            <p v-if="insignia.lograda" class="mt-1 text-xs font-semibold text-inegi-exito">✓ Lograda</p>
            <p v-else class="mt-1 text-xs font-semibold text-inegi-secundario">Aún pendiente</p>
          </div>
        </div>
      </div>
    </section>

    <section class="tarjeta p-5">
      <h3 class="text-xl font-bold text-inegi-oscuro">Detalle por módulo</h3>
      <ul class="mt-3 divide-y divide-inegi-borde">
        <li v-for="m in modulos" :key="m.id" class="flex flex-wrap items-center gap-3 py-3">
          <span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-inegi-claro font-bold text-inegi-azul">
            {{ m.id }}
          </span>
          <div class="min-w-0 flex-1">
            <p class="font-semibold text-inegi-texto">{{ m.titulo }}</p>
            <p class="text-xs text-inegi-secundario">
              {{ leccionesModulo(m.id).hechas }} de {{ leccionesModulo(m.id).total }} lecciones
            </p>
          </div>
          <div class="flex w-full items-center gap-2 sm:w-48">
            <div class="h-2 flex-1 overflow-hidden rounded-full bg-inegi-fondo">
              <div
                class="h-full rounded-full"
                :class="moduloCompleto(m.id) ? 'bg-inegi-exito' : 'bg-inegi-turquesa'"
                :style="{ width: progresoModulo(m.id) + '%' }"
              />
            </div>
            <span class="w-10 text-right text-xs font-semibold text-inegi-secundario">{{ progresoModulo(m.id) }}%</span>
          </div>
        </li>
      </ul>
    </section>

    <section class="rounded-2xl border border-inegi-borde bg-white p-5 shadow-tarjeta">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 class="text-lg font-bold text-inegi-oscuro">Reiniciar mi progreso</h3>
          <p class="text-sm text-inegi-secundario">
            Borra el avance guardado en este navegador. Después puedes empezar de nuevo con calma.
          </p>
          <p v-if="fechaActualizacion" class="mt-1 text-xs text-inegi-secundario">
            Última vez que se guardó: {{ fechaActualizacion }}
          </p>
        </div>
        <button
          v-if="!confirmando"
          type="button"
          class="btn-suave !border-inegi-alerta/40 !text-inegi-alerta hover:!bg-[#FDECEC]"
          @click="confirmando = true"
        >
          Reiniciar mi progreso
        </button>
        <div v-else class="flex flex-wrap items-center gap-2">
          <p class="text-sm font-semibold text-inegi-alerta">¿Segura que quieres borrar todo?</p>
          <button type="button" class="btn-primario !bg-inegi-alerta hover:!bg-[#9c2020]" @click="reiniciarTodo">
            Sí, reiniciar
          </button>
          <button type="button" class="btn-suave" @click="confirmando = false">Mejor no</button>
        </div>
      </div>
    </section>

    <section class="rounded-2xl border border-inegi-borde bg-inegi-claro/60 p-5">
      <p class="text-lg font-bold text-inegi-oscuro">Ya sabes lo básico</p>
      <p class="mt-1 bloque-texto">
        Lo demás lo vas a aprender en el trabajo, con calma, preguntando. No tienes que saberlo todo el primer día.
      </p>
    </section>
  </div>
</template>
