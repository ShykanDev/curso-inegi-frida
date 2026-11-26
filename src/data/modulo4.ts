import type { Modulo } from './tipos'

const filasSemana: (string | number)[][] = [
  ['Azcapotzalco', 16],
  ['Cuauhtémoc', 18],
  ['Benito Juárez', 12],
  ['Iztapalapa', 11],
  ['Coyoacán', 13]
]

export const modulo4: Modulo = {
  id: 4,
  titulo: 'Word y PowerPoint para reportes',
  subtitulo: 'Un reporte limpio y una presentación corta',
  objetivo: 'Que entregues un oficio de una página y una presentación de tres diapositivas, con tabla y gráfica.',
  tiempo: '1 hora 30 minutos',
  lecciones: [
    {
      id: '4.1',
      numero: '4.1',
      titulo: 'Word: tu oficio de una página',
      bloques: [
        'Un oficio es un documento corto y formal. En una página cabe todo si está ordenado.',
        'Lleva fecha y lugar, folio, título, un párrafo breve, la tabla y la firma.',
        'El párrafo dice qué se reporta y en qué periodo. Tres líneas bastan.',
        'La tabla resume el avance. El total se revisa antes de imprimir o enviar.',
        'La plantilla ya está hecha: solo cambias los datos y revisas que cuadre.'
      ],
      ejemplo: {
        tipo: 'texto',
        titulo: 'Estructura de un oficio corto',
        contenido:
          'Ciudad de México, 6 de marzo de 2026. Folio DREC/CMX/0126. Asunto: Reporte de avance semanal. Por medio del presente se informa el avance de la semana del 2 al 6 de marzo de 2026 en las alcaldías de la Ciudad de México. Se anexa tabla con el total de entrevistas completas. Atentamente, Frida Paola Sánchez Aguirre.'
      },
      reto: {
        id: '4.1-r',
        tipo: 'word',
        pregunta: 'Arma tu oficio de una página con los datos de la semana.',
        instruccion:
          'Elige el folio correcto, el título y la fecha. Revisa abajo que el total de la tabla cuadre antes de terminar.',
        pista: 'El folio va en el encabezado, el título dice qué reportas y la fecha es la del día de entrega.',
        respuestaModelo:
          'Folio DREC/CMX/0126, título “Reporte de avance semanal”, fecha 6 de marzo de 2026. Tabla de cinco alcaldías con total 70 entrevistas completas y firma al final.',
        mensajeExito: '¡Muy bien! Tu oficio tiene fecha, folio, tabla con total y firma. Así se entrega un reporte.',
        campos: [
          {
            id: 'folio',
            etiqueta: 'Folio del oficio',
            ayuda: 'Va en la parte de arriba, después de la fecha.',
            opciones: ['DREC/CMX/0126', 'Folio pendiente', 'CDMX-001'],
            correcta: 0
          },
          {
            id: 'titulo',
            etiqueta: 'Asunto o título',
            ayuda: 'Debe decir qué estás reportando.',
            opciones: ['Lista de asistencia', 'Reporte de avance semanal', 'Receta de cocina'],
            correcta: 1
          },
          {
            id: 'fecha',
            etiqueta: 'Fecha del documento',
            ayuda: 'Es la fecha en que entregas el reporte.',
            opciones: ['6 de marzo de 2026', '1 de enero de 2020', 'Sin fecha'],
            correcta: 0
          }
        ],
        tabla: {
          columnas: ['Alcaldía', 'Entrevistas completas'],
          filas: filasSemana,
          etiquetaTotal: 'Total de la semana',
          total: 70
        }
      }
    },
    {
      id: '4.2',
      numero: '4.2',
      titulo: 'PowerPoint: tres diapositivas y listo',
      bloques: [
        'Una presentación corta se entiende mejor. Tres diapositivas son suficientes para un reporte semanal.',
        'La primera es la portada: título, lugar y fecha.',
        'La segunda es la tabla de avance, con las mismas cifras del oficio.',
        'La tercera es la gráfica, copiada de Excel, que muestra lo mismo que la tabla.',
        'No llenes las diapositivas de texto. Un título y un dato claro dicen más.'
      ],
      ejemplo: {
        tipo: 'tarjetas',
        titulo: 'Las tres diapositivas',
        items: [
          { titulo: '1. Portada', texto: '“Avance semanal CDMX, marzo 2026” con tu nombre.' },
          { titulo: '2. Tabla', texto: 'Alcaldías, completas y total. Las mismas cifras del reporte.' },
          { titulo: '3. Gráfica', texto: 'Barras de completas por alcaldía, copiada de Excel.' }
        ]
      },
      reto: {
        id: '4.2-r',
        tipo: 'powerpoint',
        pregunta: 'Arma tu presentación de 3 diapositivas.',
        instruccion:
          'Elige la portada correcta, qué va en la diapositiva 2 y qué gráfica va en la 3. Abajo verás cómo queda.',
        pista: 'Portada con título y fecha, tabla con las mismas cifras del reporte y una gráfica de barras con esos datos.',
        respuestaModelo:
          'Portada: “Avance semanal CDMX, marzo 2026”. Diapositiva 2: tabla de alcaldías con completas. Diapositiva 3: gráfica de barras con las mismas cifras.',
        mensajeExito: '¡Excelente! Tres diapositivas: portada, tabla y gráfica. Eso es suficiente y se ve profesional.',
        campos: [
          {
            id: 'portada',
            etiqueta: 'Diapositiva 1: portada',
            ayuda: 'Debe decir qué es y de qué periodo.',
            opciones: ['Avance semanal CDMX, marzo 2026', 'Diapositiva en blanco', 'Tabla de multiplicar'],
            correcta: 0
          },
          {
            id: 'diapo2',
            etiqueta: 'Diapositiva 2',
            ayuda: 'Aquí va el resumen con números.',
            opciones: ['Una foto de la oficina', 'La tabla de avance por alcaldía', 'Mucho texto'],
            correcta: 1
          },
          {
            id: 'diapo3',
            etiqueta: 'Diapositiva 3',
            ayuda: 'Debe mostrar lo mismo que la tabla, pero visual.',
            opciones: ['Gráfica de barras con las mismas cifras', 'Otra vez el mismo texto', 'Nada'],
            correcta: 0
          }
        ],
        tabla: {
          columnas: ['Alcaldía', 'Completas'],
          filas: filasSemana
        }
      }
    }
  ],
  reto: {
    id: '4-cierre',
    tipo: 'word',
    pregunta: 'Reto de cierre: entrega tu reporte de avance de una semana en CDMX.',
    instruccion:
      'Vuelve a armar el oficio, ahora con otra semana. Elige folio, título y fecha, y revisa que el total cuadre.',
    pista: 'Antes de entregar, revisa dos veces que el total de la tabla coincida con la suma de las filas.',
    respuestaModelo:
      'Oficio con folio DREC/CMX/0127, título “Reporte de avance semanal”, fecha 13 de marzo de 2026 y tabla con total 70.',
    mensajeExito: '¡Terminaste el Módulo 4! Ya sabes entregar un reporte limpio y una presentación corta.',
    campos: [
      {
        id: 'folio',
        etiqueta: 'Folio de esta semana',
        ayuda: 'Sigue la numeración: si la anterior fue 0126, ahora toca 0127.',
        opciones: ['DREC/CMX/0127', 'DREC/CMX/0126', 'Sin folio'],
        correcta: 0
      },
      {
        id: 'titulo',
        etiqueta: 'Asunto o título',
        ayuda: 'Debe decir qué estás reportando.',
        opciones: ['Reporte de avance semanal', 'Invitación a reunión', 'Nota de compra'],
        correcta: 0
      },
      {
        id: 'fecha',
        etiqueta: 'Fecha del documento',
        ayuda: 'La semana siguiente a la del 6 de marzo.',
        opciones: ['13 de marzo de 2026', '6 de marzo de 2026', 'Sin fecha'],
        correcta: 0
      }
    ],
    tabla: {
      columnas: ['Alcaldía', 'Entrevistas completas'],
      filas: filasSemana,
      etiquetaTotal: 'Total de la semana',
      total: 70
    }
  }
}
