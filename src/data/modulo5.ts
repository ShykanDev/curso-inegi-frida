import type { Modulo } from './tipos'

export const modulo5: Modulo = {
  id: 5,
  titulo: 'Un día completo en el INEGI, con calma',
  subtitulo: 'Simulación suave, paso a paso',
  objetivo: 'Que practiques un día completo: revisar avance, hacer un reporte, simular una supervisión y cerrar el día.',
  tiempo: '1 hora',
  lecciones: [
    {
      id: '5.1',
      numero: '5.1',
      titulo: 'Mañana: revisar el avance y hacer el reporte',
      bloques: [
        'Llegas a las 8:30. Lo primero es abrir la base del día y revisar el avance contra la meta.',
        'Revisa tres columnas: completas, pendientes y no respuesta. Con eso ya sabes cómo va la semana.',
        'Después haces el reporte de una página con la tabla del avance y el total.',
        'Antes de guardar, revisa que el total de la tabla coincida con la suma de las filas.',
        'Guarda el archivo con un nombre claro: Avance_CDMX_semana_10.xlsx.'
      ],
      ejemplo: {
        tipo: 'tabla',
        titulo: 'Revisión de la mañana',
        columnas: ['Revisión', 'Qué miras', 'Por qué'],
        filas: [
          ['Completas', 'Cuántas entrevistas terminadas', 'Mide el avance real'],
          ['Pendientes', 'Cuántas faltan', 'Dice dónde apoyar'],
          ['No respuesta', 'Cuántas no se pudieron hacer', 'Se reporta, no se esconde']
        ]
      },
      reto: {
        id: '5.1-r',
        tipo: 'quiz',
        pregunta: 'Son las 8:30 de tu primer día. ¿Con qué empiezas?',
        opciones: [
          'Con el celular, a esperar instrucciones',
          'Abriendo la base del día y revisando completas, pendientes y no respuesta',
          'Haciendo la presentación antes de ver los datos'
        ],
        correcta: 1,
        pista: 'Primero los datos, luego los documentos. Sin datos no hay reporte.',
        respuestaModelo:
          'Se abre la base del día y se revisan completas, pendientes y no respuesta. Después se hace el reporte.',
        explicacion: 'El orden es: revisar datos, calcular, y luego reportar. Así el reporte sale bien desde la primera vez.'
      }
    },
    {
      id: '5.2',
      numero: '5.2',
      titulo: 'Tarde: simular una supervisión',
      bloques: [
        'Una supervisión es acompañar al entrevistador y revisar que el trabajo vaya bien.',
        'Lo que sí se hace: presentarse, explicar el motivo, observar sin interrumpir y anotar dudas.',
        'Lo que no se hace: corregir enfrente del informante ni cambiar respuestas.',
        'Al terminar, se agradece y se anota lo observado en una hoja de supervisión.',
        'Si hay algo raro, se comenta con el entrevistador al final, con respeto.'
      ],
      ejemplo: {
        tipo: 'tarjetas',
        titulo: 'Guion corto de supervisión',
        items: [
          { titulo: 'Al llegar', texto: '“Buenos días, vengo a acompañar la entrevista. No me meto, solo observo.”' },
          { titulo: 'Durante', texto: 'Anotas dudas en tu libreta. No corriges enfrente del informante.' },
          { titulo: 'Al final', texto: '“Gracias. Te comento dos dudas para revisar juntos.”' }
        ]
      },
      reto: {
        id: '5.2-r',
        tipo: 'quiz',
        pregunta: 'Durante la supervisión, el entrevistador se equivoca en una pregunta. ¿Qué haces?',
        opciones: [
          'Lo corrijo enfrente del informante',
          'Anoto la duda y se la comento al final, en privado',
          'Cambio la respuesta yo mismo'
        ],
        correcta: 1,
        pista: 'Nunca se corrige enfrente del informante ni se cambian respuestas.',
        respuestaModelo: 'Se anota la duda y se comenta con el entrevistador al final, en privado y con respeto.',
        explicacion: 'La supervisión cuida la información y el trato digno a la persona entrevistada.'
      }
    },
    {
      id: '5.3',
      numero: '5.3',
      titulo: 'Cierre: entregar y guardar bien',
      bloques: [
        'Al final del día se entrega el reporte y se guarda el archivo con nombre claro y fecha.',
        'Antes de enviar, revisa tres cosas: totales que cuadren, fecha correcta y folio correcto.',
        'Guarda una copia. Si mañana te preguntan algo, ya tienes el archivo a la mano.',
        'Enviar un reporte con el total mal es lo único que de verdad conviene evitar.',
        'Con calma, revisar dos veces toma un minuto y evita un problema grande.'
      ],
      ejemplo: {
        tipo: 'tabla',
        titulo: 'Revisión final antes de enviar',
        columnas: ['Reviso', 'Bien si…'],
        filas: [
          ['Total de la tabla', 'Coincide con la suma de las filas'],
          ['Fecha', 'Es la fecha correcta del periodo'],
          ['Folio', 'Sigue la numeración y no se repite'],
          ['Nombre del archivo', 'Dice qué es, dónde y de qué semana']
        ]
      },
      reto: {
        id: '5.3-r',
        tipo: 'quiz',
        pregunta: 'Antes de enviar el reporte, ¿qué revisas?',
        opciones: [
          'Solo que se vea bonito',
          'Que los totales cuadren, la fecha sea correcta y el folio no se repita',
          'Nada, lo mando rápido para acabar'
        ],
        correcta: 1,
        pista: 'Totales, fecha y folio. Esos tres revisan todo.',
        respuestaModelo: 'Se revisa que los totales cuadren, que la fecha sea la correcta y que el folio no se repita.',
        explicacion: 'Esa revisión de un minuto es la diferencia entre un reporte limpio y uno con problemas.'
      }
    }
  ],
  reto: {
    id: '5-cierre',
    tipo: 'simulacion',
    pregunta: 'Simula tu día completo, paso a paso, sin presión.',
    instruccion: 'Avanza por las partes del día y elige la mejor decisión en cada una.',
    pista: 'En cada paso, pregúntate: ¿esto cuida el dato y cuida a la persona?',
    respuestaModelo:
      'Mañana: revisar la base y hacer el reporte. Tarde: acompañar la supervisión sin corregir enfrente. Cierre: revisar totales, fecha y folio, y guardar el archivo con nombre claro.',
    mensajeExito:
      '¡Lo lograste! Ya hiciste un día completo, con calma. Lo demás lo vas a aprender en el trabajo, preguntando.',
    pasos: [
      {
        titulo: 'Mañana, 8:30',
        guion: 'Llegas, prendes la computadora y abres la base Avance_CDMX_semana_10.xlsx.',
        pregunta: '¿Qué revisas primero?',
        opciones: [
          'Las completas, pendientes y no respuesta del día',
          'El correo personal',
          'Cambiar el orden de las columnas'
        ],
        correcta: 0,
        explicacion: 'Primero se revisa el avance del día con esas tres columnas.'
      },
      {
        titulo: 'Mañana, 11:00',
        guion: 'Ya tienes el avance. Toca hacer el reporte de una página.',
        pregunta: '¿Qué debe llevar el reporte?',
        opciones: [
          'Fecha, folio, título, tabla con total y firma',
          'Solo una gráfica grande',
          'Toda la base de datos copiada'
        ],
        correcta: 0,
        explicacion: 'Un oficio corto lleva fecha, folio, título, tabla con total y firma.'
      },
      {
        titulo: 'Tarde, 13:00',
        guion: 'Sales a acompañar una supervisión en Iztapalapa.',
        pregunta: 'Durante la entrevista, ¿qué haces?',
        opciones: [
          'Corregir enfrente del informante',
          'Observar, anotar dudas y comentarlas al final',
          'Responder tú las preguntas'
        ],
        correcta: 1,
        explicacion: 'Se observa y se anota. Las dudas se comentan al final, en privado.'
      },
      {
        titulo: 'Cierre, 16:00',
        guion: 'Regresas, revisas el reporte y lo vas a enviar.',
        pregunta: 'Antes de enviar, ¿qué revisas?',
        opciones: [
          'Que los totales cuadren, la fecha sea correcta y el folio no se repita',
          'Que el archivo tenga el nombre corto',
          'Nada, ya está listo'
        ],
        correcta: 0,
        explicacion: 'Totales, fecha y folio: esa es la revisión final antes de enviar.'
      }
    ]
  }
}
