import type { Modulo } from './tipos'
import { hojaValidacionErrores } from '../lib/datos'

export const modulo2: Modulo = {
  id: 2,
  titulo: 'Validación, como en el INEGI',
  subtitulo: 'Detectar errores sin inventar datos',
  objetivo: 'Que encuentres errores en una base y escribas observaciones claras, sin cambiar la respuesta del informante.',
  tiempo: '1 hora 30 minutos',
  lecciones: [
    {
      id: '2.1',
      numero: '2.1',
      titulo: 'Qué es criticar y validar',
      bloques: [
        'Criticar, en el INEGI, no es regañar. Es revisar con cuidado si la información cuadra.',
        'Validar es comprobar tres cosas: que no falte nada, que no se repita nada y que todo tenga sentido.',
        'El criterio mínimo: folio único, fecha presente, datos dentro de rango y estatus bien escrito.',
        'Cuando algo no cuadra, se señala y se explica. No se decide por la persona que respondió.',
        'Validar bien evita que un error pequeño se vuelva un número grande y equivocado.'
      ],
      ejemplo: {
        tipo: 'tarjetas',
        titulo: 'Los tres criterios de una revisión',
        items: [
          { titulo: 'Completa', texto: 'No falta la fecha, ni el folio, ni el estatus.' },
          { titulo: 'Única', texto: 'Cada folio aparece una sola vez en la base.' },
          { titulo: 'Con sentido', texto: 'La edad es posible y el estatus está escrito igual que en el catálogo.' }
        ]
      },
      reto: {
        id: '2.1-r',
        tipo: 'quiz',
        pregunta: '¿Cuál de estas tres acciones SÍ es validar bien?',
        opciones: [
          'Cambiar una edad de 250 a 50 porque seguro fue error',
          'Marcar el registro y escribir “edad fuera de rango, revisar”',
          'Borrar la fila que se ve rara'
        ],
        correcta: 1,
        pista: 'Validar es señalar y explicar. No es corregir ni borrar.',
        respuestaModelo: 'Se marca el registro y se escribe la observación, sin cambiar el dato ni borrar la fila.',
        explicacion: 'La observación deja rastro y permite que alguien revise el caso con el entrevistador.'
      }
    },
    {
      id: '2.2',
      numero: '2.2',
      titulo: 'Los errores que más vas a ver',
      bloques: [
        'Folio duplicado: el mismo número aparece dos veces. Casi siempre es un caso capturado doble.',
        'Edad imposible: 250 años, 0 años o números negativos. No es una persona, es un error de captura.',
        'Fecha vacía: sin fecha no se puede saber cuándo se levantó el caso.',
        'Respuesta fuera de rango: un dato que no puede existir, como 40 personas en una sola vivienda.',
        'Estatus mal escrito: “completa” en minúscula o con espacio al final no coincide con el catálogo.'
      ],
      ejemplo: {
        tipo: 'tabla',
        titulo: 'Cinco errores típicos',
        columnas: ['Tipo de error', 'Cómo se ve', 'Qué se escribe'],
        filas: [
          ['Folio duplicado', 'CDMX-202 dos veces', 'Folio 202 duplicado, revisar con el entrevistador'],
          ['Edad imposible', '250 años', 'Edad fuera de rango, revisar captura'],
          ['Fecha vacía', 'Fecha en blanco', 'Falta la fecha de levantamiento'],
          ['Fuera de rango', '40 personas en una vivienda', 'Número de personas fuera de rango'],
          ['Estatus mal escrito', '“completa” con minúscula', 'Estatus no coincide con el catálogo']
        ]
      },
      reto: {
        id: '2.2-r',
        tipo: 'quiz',
        pregunta: 'Ves “completa” con minúscula en la columna Estatus. ¿Es un error?',
        opciones: [
          'No, es lo mismo',
          'Sí, porque no coincide exactamente con el catálogo y rompe los conteos',
          'Sí, se borra la fila'
        ],
        correcta: 1,
        pista: 'Para Excel “Completa” y “completa” son distintos. Eso hace que el conteo salga mal.',
        respuestaModelo:
          'Sí es un error, porque no coincide con el catálogo. Se marca y se escribe la observación; no se borra la fila.',
        explicacion: 'Si el estatus no está escrito igual, CONTAR.SI no lo cuenta y el avance sale mal.'
      }
    },
    {
      id: '2.3',
      numero: '2.3',
      titulo: 'Cómo escribir una observación clara',
      bloques: [
        'Una observación clara dice tres cosas: qué folio es, qué problema tiene y qué se necesita.',
        'Empieza con el folio. Así quien la lea encuentra el caso en segundos.',
        'Di el problema sin adivinar la causa: “folio duplicado”, no “seguro lo capturó mal”.',
        'Cierra con la acción: “revisar con el entrevistador”, “completar fecha”.',
        'Nunca escribas una observación que cambie el dato. La observación es para que alguien más revise.'
      ],
      ejemplo: {
        tipo: 'formula',
        titulo: 'De vago a claro',
        formula: '“Folio 123 duplicado, revisar con el entrevistador”',
        resultado: 'Observación útil',
        explicacion: 'Dice el folio, el problema y qué hacer. En cambio “está mal” no sirve para nada.'
      },
      reto: {
        id: '2.3-r',
        tipo: 'texto',
        pregunta: 'Escribe una observación para el folio CDMX-208, que tiene edad de -3 años.',
        instruccion: 'Incluye el folio, el problema y qué se necesita. Mínimo 8 palabras.',
        claves: ['cdmx-208', 'edad'],
        palabrasMinimas: 8,
        pista: 'Algo como: “Folio CDMX-208, edad negativa fuera de rango, revisar captura con el entrevistador”.',
        respuestaModelo:
          'Folio CDMX-208, edad negativa fuera de rango, revisar captura y confirmar con el entrevistador.',
        explicacion: 'Tu observación nombra el folio, el problema y la acción. Así se hace en el INEGI.'
      }
    }
  ],
  reto: {
    id: '2-cierre',
    tipo: 'validacion',
    pregunta: 'Reto de cierre: encuentra los 5 registros con error y marca cada uno.',
    instruccion:
      'Marca las filas que tienen un problema. Hay 5 con error en esta base de 10. Cuando marques una, escribe tu observación.',
    columnas: ['Folio', 'Alcaldía', 'Edad', 'Fecha', 'Estatus'],
    filas: [
      ['CDMX-201', 'Azcapotzalco', '34', '2026-03-02', 'Completa'],
      ['CDMX-202', 'Cuauhtémoc', '250', '2026-03-02', 'Completa'],
      ['CDMX-203', 'Iztapalapa', '41', '', 'Completa'],
      ['CDMX-204', 'Coyoacán', '29', '2026-03-03', 'Completa'],
      ['CDMX-202', 'Cuauhtémoc', '38', '2026-03-03', 'Pendiente'],
      ['CDMX-205', 'Benito Juárez', '17', '2026-03-03', 'Completa'],
      ['CDMX-206', 'Miguel Hidalgo', '45', '2026-03-04', 'completa'],
      ['CDMX-207', 'Álvaro Obregón', '52', '2026-03-04', 'Pendiente'],
      ['CDMX-208', 'Iztapalapa', '-3', '2026-03-05', 'Completa'],
      ['CDMX-209', 'Coyoacán', '31', '2026-03-05', 'Completa ']
    ],
    errores: [
      { fila: 1, observacion: 'Edad 250 fuera de rango. Revisar captura con el entrevistador.' },
      { fila: 2, observacion: 'Fecha vacía. Falta la fecha de levantamiento.' },
      { fila: 4, observacion: 'Folio CDMX-202 duplicado. Revisar cuál es el caso correcto.' },
      { fila: 6, observacion: 'Estatus “completa” no coincide con el catálogo. Corregir el texto, no el dato.' },
      { fila: 8, observacion: 'Edad negativa fuera de rango. Revisar captura.' }
    ],
    pista: 'Busca una edad imposible, una fecha en blanco, un folio repetido, un estatus en minúscula y una edad negativa.',
    respuestaModelo:
      'Los 5 errores están en las filas 2, 3, 5, 7 y 9 (contando el encabezado como fila 1). Son: edad 250, fecha vacía, folio CDMX-202 duplicado, estatus “completa” y edad -3. Cada uno solo se marca y se describe.',
    mensajeExito: '¡Lo lograste! Encontraste los 5 errores y escribiste observaciones claras, sin inventar datos.'
  }
}

export const libroValidacion = hojaValidacionErrores
