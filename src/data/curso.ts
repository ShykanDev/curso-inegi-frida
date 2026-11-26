import type { Modulo } from './tipos'
import { modulo0 } from './modulo0'
import { modulo1 } from './modulo1'
import { modulo2 } from './modulo2'
import { modulo3 } from './modulo3'
import { modulo4 } from './modulo4'
import { modulo5 } from './modulo5'

export const modulos: Modulo[] = [modulo0, modulo1, modulo2, modulo3, modulo4, modulo5]

export const perfilFrida = {
  nombre: 'Frida Paola Sánchez Aguirre',
  saludo: 'Hola, Frida',
  licenciatura: 'Ciencias Políticas y Administración Pública',
  universidad: 'Universidad Humanitas, CDMX',
  sede: 'Av. Balderas 71, Col. Centro, Ciudad de México',
  horario: '8:30 a 16:30, lunes a viernes'
}

export function obtenerModulo(id: number): Modulo | undefined {
  return modulos.find((m) => m.id === id)
}

export function siguienteModulo(id: number): number | null {
  const indice = modulos.findIndex((m) => m.id === id)
  if (indice === -1 || indice === modulos.length - 1) return null
  return modulos[indice + 1].id
}

export function moduloAnterior(id: number): number | null {
  const indice = modulos.findIndex((m) => m.id === id)
  if (indice <= 0) return null
  return modulos[indice - 1].id
}
