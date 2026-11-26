<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { RetoClasificar, RetoQuiz, RetoTexto } from '../data/tipos'

const props = defineProps<{ reto: RetoQuiz | RetoClasificar | RetoTexto }>()
const emit = defineEmits<{ (e: 'validado', ok: boolean): void }>()

const opcion = ref<number | null>(null)
const texto = ref('')
const asignaciones = ref<Record<number, string>>({})
const mensaje = ref<{ tipo: 'exito' | 'aviso' | 'neutro'; texto: string } | null>(null)
const revelarRespuesta = ref(false)

watch(
  () => props.reto.id,
  () => {
    opcion.value = null
    texto.value = ''
    asignaciones.value = {}
    mensaje.value = null
    revelarRespuesta.value = false
  }
)

const palabras = computed(() => texto.value.trim().split(/\s+/).filter(Boolean).length)

function revisarQuiz() {
  if (props.reto.tipo !== 'quiz') return
  if (opcion.value === null) {
    mensaje.value = { tipo: 'aviso', texto: 'Elige una opción y luego revisamos juntas.' }
    return
  }
  if (opcion.value === props.reto.correcta) {
    mensaje.value = { tipo: 'exito', texto: `¡Bien! ${props.reto.explicacion}` }
    emit('validado', true)
  } else {
    mensaje.value = { tipo: 'aviso', texto: 'Casi, mira la pista. Vuelve a leer con calma y prueba otra vez.' }
    emit('validado', false)
  }
}

function revisarTexto() {
  if (props.reto.tipo !== 'texto') return
  const limpio = texto.value.toLowerCase().replace(/\s+/g, ' ')
  const faltan = props.reto.claves.filter((clave) => !limpio.includes(clave.toLowerCase()))
  const minimo = props.reto.palabrasMinimas ?? 6
  if (faltan.length === 0 && palabras.value >= minimo) {
    mensaje.value = { tipo: 'exito', texto: `¡Bien! ${props.reto.explicacion}` }
    emit('validado', true)
  } else if (faltan.length > 0) {
    mensaje.value = {
      tipo: 'aviso',
      texto: `Casi, mira la pista. A tu observación le falta mencionar: ${faltan.join(', ')}.`
    }
    emit('validado', false)
  } else {
    mensaje.value = {
      tipo: 'aviso',
      texto: `Casi, mira la pista. Escribe al menos ${minimo} palabras para que quede clara.`
    }
    emit('validado', false)
  }
}

const todasAsignadas = computed(() => {
  if (props.reto.tipo !== 'clasificar') return false
  return props.reto.items.every((_, i) => asignaciones.value[i])
})

function revisarClasificar() {
  if (props.reto.tipo !== 'clasificar') return
  const correctas = props.reto.items.filter((item, i) => asignaciones.value[i] === item.categoria).length
  if (correctas === props.reto.items.length) {
    mensaje.value = { tipo: 'exito', texto: `¡Bien! ${props.reto.explicacion}` }
    emit('validado', true)
  } else {
    mensaje.value = {
      tipo: 'aviso',
      texto: `Casi, mira la pista. Llevas ${correctas} de ${props.reto.items.length} bien acomodadas.`
    }
    emit('validado', false)
  }
}

function revisar() {
  if (props.reto.tipo === 'quiz') revisarQuiz()
  else if (props.reto.tipo === 'texto') revisarTexto()
  else revisarClasificar()
}
</script>

<template>
  <div class="space-y-4">
    <div v-if="reto.tipo === 'quiz'" class="space-y-2.5">
      <button
        v-for="(op, i) in reto.opciones"
        :key="op"
        type="button"
        class="flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition"
        :class="
          opcion === i
            ? 'border-inegi-azul bg-inegi-claro font-semibold text-inegi-oscuro'
            : 'border-inegi-borde bg-white hover:bg-inegi-fondo'
        "
        :aria-pressed="opcion === i"
        @click="opcion = i"
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

    <div v-else-if="reto.tipo === 'texto'" class="space-y-2">
      <textarea
        v-model="texto"
        class="campo min-h-[110px]"
        placeholder="Escribe tu observación con folio, problema y qué se necesita."
        aria-label="Tu respuesta"
      />
      <p class="text-xs text-inegi-secundario">{{ palabras }} palabras escritas</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="(item, i) in reto.items"
        :key="item.texto"
        class="rounded-xl border border-inegi-borde bg-white p-4"
      >
        <p class="mb-2.5 text-[16px] font-medium text-inegi-texto">{{ item.texto }}</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="categoria in reto.categorias"
            :key="categoria"
            type="button"
            class="rounded-full border px-3.5 py-1.5 text-sm font-medium transition"
            :class="
              asignaciones[i] === categoria
                ? 'border-inegi-azul bg-inegi-azul text-white'
                : 'border-inegi-borde bg-white text-inegi-texto hover:bg-inegi-claro'
            "
            :aria-pressed="asignaciones[i] === categoria"
            @click="asignaciones[i] = categoria"
          >
            {{ categoria }}
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <button type="button" class="btn-primario" @click="revisar">Revisar mi respuesta</button>
      <button type="button" class="btn-suave" @click="revelarRespuesta = !revelarRespuesta">
        {{ revelarRespuesta ? 'Ocultar respuesta modelo' : 'Ver respuesta modelo' }}
      </button>
    </div>

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

    <div v-if="revelarRespuesta" class="rounded-xl border-l-4 border-inegi-turquesa bg-inegi-claro/70 px-4 py-3">
      <p class="text-sm font-semibold uppercase tracking-wide text-inegi-azul">Respuesta modelo</p>
      <p class="mt-1 text-[16px] leading-relaxed text-inegi-texto">{{ reto.respuestaModelo }}</p>
    </div>
  </div>
</template>
