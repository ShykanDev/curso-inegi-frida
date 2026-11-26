import type { Modulo } from './tipos'

export const modulo0: Modulo = {
  id: 0,
  titulo: 'Tranquila, así trabaja el INEGI',
  subtitulo: 'El mapa completo, sin prisa',
  objetivo: 'Que entiendas para qué existe el INEGI y qué hace cada persona, sin miedo y en palabras sencillas.',
  tiempo: '30 minutos',
  lecciones: [
    {
      id: '0.1',
      numero: '0.1',
      titulo: 'Qué es el INEGI, qué es un censo y qué es una encuesta',
      bloques: [
        'El INEGI es la oficina del gobierno que cuenta y mide a México. Hace las preguntas que después se convierten en números oficiales.',
        'Un censo pregunta a todas las viviendas del país. Es enorme y se hace cada varios años, como el Censo de Población y Vivienda.',
        'Una encuesta pregunta solo a una parte de las viviendas, elegidas con una regla. Con esa parte se explica el total.',
        'En la Ciudad de México el INEGI levanta encuestas todo el año en alcaldías como Iztapalapa, Cuauhtémoc o Coyoacán.',
        'Tu trabajo no es inventar esos números. Tu trabajo es cuidar que lleguen completos y correctos.'
      ],
      ejemplo: {
        tipo: 'tarjetas',
        titulo: 'Dos formas de preguntar, un mismo cuidado',
        items: [
          {
            titulo: 'Censo',
            texto: 'Pregunta a todas las viviendas. Ejemplo: el Censo de Población y Vivienda 2020 contó cada casa de la CDMX.'
          },
          {
            titulo: 'Encuesta',
            texto: 'Pregunta a una muestra de viviendas. Ejemplo: la ENIGH visita hogares elegidos en Cuauhtémoc y Azcapotzalco.'
          }
        ]
      },
      reto: {
        id: '0.1-r',
        tipo: 'quiz',
        pregunta: 'El INEGI va a preguntar a todas las viviendas del país. ¿Eso qué es?',
        opciones: ['Una encuesta', 'Un censo', 'Un tabulador'],
        correcta: 1,
        pista: 'Piensa en la palabra “todas”. Cuando es todo el país completo, es censo.',
        respuestaModelo: 'Es un censo, porque se pregunta a todas las viviendas y no solo a una parte.',
        explicacion: 'Censo = todas las viviendas. Encuesta = una parte elegida con una regla.'
      }
    },
    {
      id: '0.2',
      numero: '0.2',
      titulo: 'Vivienda seleccionada, folio e informante',
      bloques: [
        'Una vivienda seleccionada es una casa que ya salió elegida en la lista para visitar. No se cambia a la de al lado.',
        'El folio es el número único de ese caso. Es como su credencial: con el folio se encuentra todo lo demás.',
        'El informante es la persona de la casa que responde. Sus respuestas se respetan tal como las dio.',
        'Si el folio se repite o la vivienda no coincide, no se arregla solo: se avisa y se revisa.'
      ],
      ejemplo: {
        tipo: 'tabla',
        titulo: 'Así se ve un caso seleccionado',
        columnas: ['Folio', 'Alcaldía', 'Vivienda seleccionada', 'Informante'],
        filas: [
          ['CDMX-1042', 'Benito Juárez', 'Sí', 'Jefa de hogar, 46 años'],
          ['CDMX-1043', 'Iztapalapa', 'Sí', 'Joven, 22 años'],
          ['CDMX-1044', 'Coyoacán', 'Sí', 'Adulto mayor, 68 años']
        ]
      },
      reto: {
        id: '0.2-r',
        tipo: 'quiz',
        pregunta: 'Llegas a una casa y no es la vivienda que dice la lista. ¿Qué haces?',
        opciones: [
          'Entrevisto a la casa de al lado para no perder el viaje',
          'Anoto que la vivienda no coincide y aviso al supervisor',
          'Cambio el folio por otro número'
        ],
        correcta: 1,
        pista: 'La regla de oro del INEGI es no inventar y no cambiar por cuenta propia.',
        respuestaModelo:
          'Se anota que la vivienda no coincide y se avisa al supervisor. No se cambia la vivienda ni el folio.',
        explicacion: 'La vivienda seleccionada y el folio se respetan. Cualquier cambio se reporta, no se decide solo.'
      }
    },
    {
      id: '0.3',
      numero: '0.3',
      titulo: 'Quién hace qué: entrevistador, supervisor, analista y enlace',
      bloques: [
        'El entrevistador visita las viviendas y hace las preguntas. Es quien está en la calle.',
        'El supervisor revisa el trabajo de varios entrevistadores y resuelve dudas en campo.',
        'El analista revisa la información en computadora: detecta errores y arma cuadros y reportes.',
        'El enlace coordina y da seguimiento entre la oficina y el equipo en campo.',
        'Tu perfil se parece mucho al de analista o enlace de apoyo: oficina, computadora y salidas ocasionales.'
      ],
      ejemplo: {
        tipo: 'tabla',
        titulo: 'Cuatro papeles, un mismo objetivo',
        columnas: ['Quién', 'Dónde está', 'Qué hace'],
        filas: [
          ['Entrevistador', 'En la calle', 'Visita viviendas y aplica el cuestionario'],
          ['Supervisor', 'En campo, con el equipo', 'Revisa y apoya a los entrevistadores'],
          ['Analista', 'En oficina', 'Valida datos y hace tabuladores y reportes'],
          ['Enlace', 'En oficina y en campo', 'Coordina, da seguimiento y avisa avances']
        ]
      },
      reto: {
        id: '0.3-r',
        tipo: 'quiz',
        pregunta: '¿Quién revisa la información en computadora y arma los cuadros de avance?',
        opciones: ['El entrevistador', 'El analista', 'El informante'],
        correcta: 1,
        pista: 'El trabajo de oficina, con Excel y reportes, lo hace el analista.',
        respuestaModelo: 'El analista. Revisa datos en computadora, valida y arma tabuladores y reportes.',
        explicacion: 'Entrevistador = calle. Analista = oficina y datos. Informante = quien responde en la casa.'
      }
    },
    {
      id: '0.4',
      numero: '0.4',
      titulo: 'Qué es validar y por qué no se inventa el dato',
      bloques: [
        'Validar es revisar que la información esté completa y tenga sentido, sin cambiarla.',
        'Si un dato falta, está duplicado o es imposible, se marca y se escribe una observación.',
        'Nunca se corrige “a ojo”. No se pone una edad que parece mejor ni se cambia una respuesta.',
        'El dato del informante se respeta. Si hay duda, se devuelve el caso para que lo revisen.',
        'Esto se llama confidencialidad: la información de las personas se cuida y no se comenta fuera.'
      ],
      ejemplo: {
        tipo: 'tabla',
        titulo: 'Marcar en vez de corregir',
        columnas: ['Folio', 'Problema encontrado', 'Qué se hace'],
        filas: [
          ['CDMX-202', 'Edad de 250 años', 'Se marca y se escribe: “edad fuera de rango, revisar”'],
          ['CDMX-203', 'Fecha vacía', 'Se marca y se pide completar la fecha'],
          ['CDMX-202', 'Folio repetido', 'Se avisa: “folio duplicado, revisar con el entrevistador”']
        ]
      },
      reto: {
        id: '0.4-r',
        tipo: 'quiz',
        pregunta: 'Un registro dice que la persona tiene 250 años. ¿Qué haces?',
        opciones: [
          'Lo cambio a 50 porque seguro fue un error de dedo',
          'Lo dejo así y no digo nada',
          'Lo marco como error, escribo la observación y lo devuelvo'
        ],
        correcta: 2,
        pista: 'No se corrige a ojo. Solo se marca, se explica y se devuelve.',
        respuestaModelo:
          'Se marca el error, se escribe la observación y se devuelve el caso. El dato no se cambia por cuenta propia.',
        explicacion: 'Validar es señalar el problema, no arreglarlo inventando un valor nuevo.'
      }
    }
  ],
  reto: {
    id: '0-cierre',
    tipo: 'clasificar',
    pregunta: 'Acomoda cada tarea con la persona que la hace.',
    pista: 'Piensa dónde está cada quien: calle, campo, oficina o coordinación.',
    respuestaModelo:
      'Entrevistador: visitar viviendas y aplicar el cuestionario. Supervisor: revisar el trabajo en campo. Analista: validar datos y hacer tabuladores. Enlace: coordinar y dar seguimiento al avance.',
    categorias: ['Entrevistador', 'Supervisor', 'Analista', 'Enlace'],
    items: [
      { texto: 'Visitar la vivienda y aplicar el cuestionario', categoria: 'Entrevistador' },
      { texto: 'Revisar el trabajo de varios entrevistadores en campo', categoria: 'Supervisor' },
      { texto: 'Validar datos y armar el tabulador de avance', categoria: 'Analista' },
      { texto: 'Coordinar al equipo y dar seguimiento al avance', categoria: 'Enlace' }
    ],
    explicacion: 'Cada papel tiene su lugar. Cuando lo tengas claro, sabrás a quién preguntar cada cosa.'
  }
}
