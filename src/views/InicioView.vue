<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { modulos, perfilFrida } from '../data/curso'
import { usarProgreso } from '../store/progreso'

const router = useRouter()
const {
  porcentajeTotal,
  moduloActual,
  proximaLeccion,
  moduloCompleto,
  progresoModulo,
  leccionesModulo,
  estado,
  totalRetos
} = usarProgreso()

const continuar = computed(() => {
  const siguiente = proximaLeccion.value
  if (!siguiente) return { ruta: '/modulo/5', texto: 'Repasar el curso' }
  return {
    ruta: `/modulo/${siguiente.modulo}?leccion=${encodeURIComponent(siguiente.leccion)}`,
    texto: proximaLeccion.value ? `Continuar en ${siguiente.numero}` : 'Continuar donde me quedé'
  }
})

const retosHechos = computed(() => estado.retosHechos.length)

function ir(ruta: string) {
  router.push(ruta)
}
</script>

<template>
  <div class="space-y-6">
    <section class="overflow-hidden rounded-2xl border border-inegi-borde bg-white shadow-tarjeta">
      <div class="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.6fr_1fr]">
        <div class="space-y-4">
          <p class="chip bg-inegi-claro text-inegi-azul">Bienvenida</p>
          <h2 class="text-3xl font-bold leading-tight text-inegi-oscuro sm:text-4xl">{{ perfilFrida.saludo }}</h2>
          <p class="bloque-texto max-w-2xl">
            Este curso es para que llegues tranquila y segura a tu primer día. Vas a aprender a usar Excel con datos
            del INEGI, a validar información sin inventar nada y a hacer reportes limpios.
          </p>
          <p class="bloque-texto max-w-2xl">
            No es un examen y no hay tiempo límite. Aquí practicas con calma, a tu ritmo, y puedes repetir cada reto
            las veces que quieras.
          </p>
          <div class="flex flex-wrap gap-3 pt-1">
            <button type="button" class="btn-primario text-base" @click="ir(continuar.ruta)">
              {{ proximaLeccion ? 'Continuar donde me quedé' : 'Repasar el curso' }}
              <span aria-hidden="true">→</span>
            </button>
            <button type="button" class="btn-suave text-base" @click="ir('/progreso')">Ver mi progreso</button>
          </div>
          <p class="rounded-xl bg-inegi-fondo px-4 py-3 text-sm leading-relaxed text-inegi-secundario">
            Preparación general para Enlace / Analista de validación en Dirección Regional Centro, CDMX. Tu puesto
            exacto te lo confirmarán en el INEGI.
          </p>
        </div>

        <div class="space-y-4 rounded-2xl bg-inegi-claro/60 p-5">
          <div class="text-center">
            <p class="text-sm font-semibold text-inegi-secundario">Tu progreso total</p>
            <p class="mt-1 text-5xl font-bold text-inegi-azul">{{ porcentajeTotal }}<span class="text-2xl">%</span></p>
            <p class="mt-1 text-sm text-inegi-secundario">Vas en el módulo {{ moduloActual }} de 5</p>
          </div>
          <div class="h-3 overflow-hidden rounded-full bg-white">
            <div class="h-full rounded-full bg-inegi-azul transition-all duration-500" :style="{ width: porcentajeTotal + '%' }" />
          </div>
          <dl class="grid grid-cols-2 gap-3 text-center">
            <div class="rounded-xl bg-white p-3">
              <dt class="text-xs font-semibold uppercase text-inegi-secundario">Retos hechos</dt>
              <dd class="mt-1 text-xl font-bold text-inegi-oscuro">{{ retosHechos }}</dd>
            </div>
            <div class="rounded-xl bg-white p-3">
              <dt class="text-xs font-semibold uppercase text-inegi-secundario">Módulos listos</dt>
              <dd class="mt-1 text-xl font-bold text-inegi-oscuro">
                {{ modulos.filter((m) => moduloCompleto(m.id)).length }} / 6
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 class="text-2xl font-bold text-inegi-oscuro">Los 6 módulos</h3>
          <p class="text-inegi-secundario">Empieza por el 0 y avanza sin prisa. Cada módulo se apoya en el anterior.</p>
        </div>
        <p class="text-sm text-inegi-secundario">{{ totalRetos }} retos en total</p>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <RouterLink
          v-for="m in modulos"
          :key="m.id"
          :to="`/modulo/${m.id}`"
          class="tarjeta group flex flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-flotante focus-visible:ring-4 focus-visible:ring-inegi-turquesa/30"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-inegi-claro text-lg font-bold text-inegi-azul">
                {{ m.id }}
              </span>
              <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-inegi-secundario">
                  Módulo {{ m.id }} · {{ m.tiempo }}
                </p>
                <h4 class="text-lg font-bold leading-snug text-inegi-oscuro group-hover:text-inegi-azul">{{ m.titulo }}</h4>
              </div>
            </div>
            <span
              v-if="moduloCompleto(m.id)"
              class="chip shrink-0 bg-inegi-exito/15 text-inegi-exito"
            >
              ✓ Listo
            </span>
          </div>
          <p class="text-[15px] leading-relaxed text-inegi-secundario">{{ m.subtitulo }}</p>
          <div class="mt-auto space-y-1.5">
            <div class="flex items-center justify-between text-xs font-semibold text-inegi-secundario">
              <span>{{ leccionesModulo(m.id).hechas }} de {{ leccionesModulo(m.id).total }} lecciones</span>
              <span>{{ progresoModulo(m.id) }}%</span>
            </div>
            <div class="h-2 overflow-hidden rounded-full bg-inegi-fondo">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="moduloCompleto(m.id) ? 'bg-inegi-exito' : 'bg-inegi-turquesa'"
                :style="{ width: progresoModulo(m.id) + '%' }"
              />
            </div>
          </div>
        </RouterLink>
      </div>
    </section>

    <section class="tarjeta p-5">
      <h3 class="text-lg font-bold text-inegi-oscuro">Tu perfil</h3>
      <dl class="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <dt class="text-xs font-semibold uppercase text-inegi-secundario">Nombre</dt>
          <dd class="text-[16px] text-inegi-texto">{{ perfilFrida.nombre }}</dd>
        </div>
        <div>
          <dt class="text-xs font-semibold uppercase text-inegi-secundario">Licenciatura</dt>
          <dd class="text-[16px] text-inegi-texto">{{ perfilFrida.licenciatura }}</dd>
        </div>
        <div>
          <dt class="text-xs font-semibold uppercase text-inegi-secundario">Universidad</dt>
          <dd class="text-[16px] text-inegi-texto">{{ perfilFrida.universidad }}</dd>
        </div>
        <div>
          <dt class="text-xs font-semibold uppercase text-inegi-secundario">Sede</dt>
          <dd class="text-[16px] text-inegi-texto">{{ perfilFrida.sede }}</dd>
        </div>
        <div>
          <dt class="text-xs font-semibold uppercase text-inegi-secundario">Horario habitual</dt>
          <dd class="text-[16px] text-inegi-texto">{{ perfilFrida.horario }}</dd>
        </div>
      </dl>
    </section>
  </div>
</template>
