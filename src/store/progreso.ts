import { reactive, computed } from 'vue'
import { modulos } from '../data/curso'

const CLAVE = 'inegi-frida-curso:progreso'

export interface EstadoProgreso {
  leccionesHechas: string[]
  retosHechos: string[]
  modulosCompletados: number[]
  actualizado: string | null
}

interface Insignia {
  id: string
  nombre: string
  descripcion: string
  icono: string
  lograda: boolean
}

function estadoInicial(): EstadoProgreso {
  return {
    leccionesHechas: [],
    retosHechos: [],
    modulosCompletados: [],
    actualizado: null
  }
}

function cargar(): EstadoProgreso {
  try {
    const crudo = localStorage.getItem(CLAVE)
    if (!crudo) return estadoInicial()
    const datos = JSON.parse(crudo)
    return {
      leccionesHechas: Array.isArray(datos.leccionesHechas) ? datos.leccionesHechas : [],
      retosHechos: Array.isArray(datos.retosHechos) ? datos.retosHechos : [],
      modulosCompletados: Array.isArray(datos.modulosCompletados) ? datos.modulosCompletados : [],
      actualizado: typeof datos.actualizado === 'string' ? datos.actualizado : null
    }
  } catch {
    return estadoInicial()
  }
}

const estado = reactive<EstadoProgreso>(cargar())

function guardar() {
  estado.actualizado = new Date().toISOString()
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado))
  } catch {
    // Si el navegador no permite guardar, seguimos en memoria.
  }
}

const totalLecciones = modulos.reduce((suma, m) => suma + m.lecciones.length, 0)
const totalRetos = modulos.reduce(
  (suma, m) => suma + m.lecciones.filter((l) => l.reto && l.reto.id).length,
  0
)

export function usarProgreso() {
  const porcentajeTotal = computed(() => {
    if (totalLecciones === 0) return 0
    return Math.round((estado.leccionesHechas.length / totalLecciones) * 100)
  })

  const moduloActual = computed(() => {
    for (const m of modulos) {
      if (!moduloCompleto(m.id)) return m.id
    }
    return 5
  })

  const proximaLeccion = computed(() => {
    for (const m of modulos) {
      for (const l of m.lecciones) {
        if (!estado.leccionesHechas.includes(l.id)) {
          return { modulo: m.id, leccion: l.id, titulo: l.titulo, numero: l.numero }
        }
      }
    }
    return null
  })

  function leccionHecha(id: string) {
    return estado.leccionesHechas.includes(id)
  }

  function retoHecho(id: string) {
    return estado.retosHechos.includes(id)
  }

  function marcarLeccion(id: string) {
    if (!estado.leccionesHechas.includes(id)) {
      estado.leccionesHechas.push(id)
      guardar()
    }
    actualizarModulos()
  }

  function marcarReto(id: string) {
    if (!estado.retosHechos.includes(id)) {
      estado.retosHechos.push(id)
      guardar()
    }
  }

  function actualizarModulos() {
    for (const m of modulos) {
      const todas = m.lecciones.every((l) => estado.leccionesHechas.includes(l.id))
      const yaEsta = estado.modulosCompletados.includes(m.id)
      if (todas && !yaEsta) {
        estado.modulosCompletados.push(m.id)
        guardar()
      } else if (!todas && yaEsta) {
        estado.modulosCompletados = estado.modulosCompletados.filter((x) => x !== m.id)
        guardar()
      }
    }
  }

  function moduloCompleto(id: number) {
    return estado.modulosCompletados.includes(id)
  }

  function progresoModulo(id: number) {
    const m = modulos.find((x) => x.id === id)
    if (!m || m.lecciones.length === 0) return 0
    const hechas = m.lecciones.filter((l) => estado.leccionesHechas.includes(l.id)).length
    return Math.round((hechas / m.lecciones.length) * 100)
  }

  function leccionesModulo(id: number) {
    const m = modulos.find((x) => x.id === id)
    if (!m) return { hechas: 0, total: 0 }
    return {
      hechas: m.lecciones.filter((l) => estado.leccionesHechas.includes(l.id)).length,
      total: m.lecciones.length
    }
  }

  const insignias = computed<Insignia[]>(() => {
    const hechos = estado.retosHechos
    const tiene = (prefijo: string) => hechos.some((r) => r.startsWith(prefijo))
    return [
      {
        id: 'primera-suma',
        nombre: 'Primera suma',
        descripcion: 'Hiciste tu primera SUMA en el simulador.',
        icono: '＋',
        lograda: tiene('1.3') || tiene('1.4')
      },
      {
        id: 'primera-tabla-dinamica',
        nombre: 'Primera tabla dinámica',
        descripcion: 'Armaste un tabulador con tabla dinámica.',
        icono: '▦',
        lograda: tiene('1.8')
      },
      {
        id: 'validadora',
        nombre: 'Validadora',
        descripcion: 'Encontraste errores y escribiste observaciones claras.',
        icono: '✓',
        lograda: tiene('2.')
      },
      {
        id: 'reportera',
        nombre: 'Reportera INEGI',
        descripcion: 'Entregaste un reporte de avance completo.',
        icono: '▤',
        lograda: tiene('4.') || tiene('5.')
      }
    ]
  })

  function reiniciar() {
    estado.leccionesHechas = []
    estado.retosHechos = []
    estado.modulosCompletados = []
    guardar()
  }

  return {
    estado,
    totalLecciones,
    totalRetos,
    porcentajeTotal,
    moduloActual,
    proximaLeccion,
    leccionHecha,
    retoHecho,
    marcarLeccion,
    marcarReto,
    moduloCompleto,
    progresoModulo,
    leccionesModulo,
    insignias,
    reiniciar
  }
}

export type Progreso = ReturnType<typeof usarProgreso>
