import type { Modulo } from './tipos'
import { construirLibro, hojaPromedioEquipo } from '../lib/datos'

const hojaFrecuencias = construirLibro(
  'frecuencias',
  'Tabulador_CDMX.xlsx',
  ['Alcaldía', 'Sexo', 'Completas'],
  [
    ['Benito Juárez', 'Mujer', 18],
    ['Benito Juárez', 'Hombre', 14],
    ['Iztapalapa', 'Mujer', 17],
    ['Iztapalapa', 'Hombre', 16],
    ['Coyoacán', 'Mujer', 21],
    ['Coyoacán', 'Hombre', 20],
    ['Cuauhtémoc', 'Mujer', 24],
    ['Cuauhtémoc', 'Hombre', 24]
  ],
  { hoja: 'Tabulador', anchos: [160, 110, 120] }
)

export const modulo3: Modulo = {
  id: 3,
  titulo: 'Estadística básica que sí usa el INEGI',
  subtitulo: 'Los números que vas a reportar',
  objetivo: 'Que entiendas y expliques porcentajes, promedios, frecuencias y tabuladores con palabras sencillas.',
  tiempo: '1 hora 30 minutos',
  lecciones: [
    {
      id: '3.1',
      numero: '3.1',
      titulo: 'Porcentajes: avance, cobertura y no respuesta',
      bloques: [
        'Un porcentaje compara una parte con el total. 70 de 100 es 70%.',
        'Avance es cuánto llevamos del total programado. Cobertura es cuántas viviendas logramos completar.',
        'No respuesta es cuántas viviendas no se pudieron entrevistar. También se reporta, no se esconde.',
        'Los tres se sacan igual: parte entre total, por 100.',
        'Un porcentaje bajo no es un fracaso, es información para pedir apoyo.'
      ],
      ejemplo: {
        tipo: 'grafico',
        titulo: 'Cobertura por estado (%)',
        estilo: 'barras',
        etiquetas: ['CDMX', 'Edomex', 'Jalisco', 'Nuevo León'],
        valores: [70, 80, 70, 85],
        nota: 'Nuevo León va al frente con 85% de cobertura.'
      },
      reto: {
        id: '3.1-r',
        tipo: 'quiz',
        pregunta: 'De 120 viviendas seleccionadas en el Estado de México, se completaron 96. ¿Cuál es la cobertura?',
        opciones: ['70%', '80%', '96%'],
        correcta: 1,
        pista: 'Divide 96 entre 120 y multiplica por 100.',
        respuestaModelo: '96 entre 120 es 0.8, por 100 da 80% de cobertura.',
        explicacion: 'Cobertura = completas / seleccionadas × 100.'
      }
    },
    {
      id: '3.2',
      numero: '3.2',
      titulo: 'Promedios y frecuencias',
      bloques: [
        'Un promedio dice cuánto toca en general, repartiendo el total entre todos.',
        'Una frecuencia dice cuántas veces aparece algo. Por ejemplo, cuántas viviendas tienen 3 personas.',
        'El promedio por entrevistador te dice si el trabajo va parejo.',
        'La frecuencia te dice cómo se reparte: si casi todas las viviendas son de 3 o 4 personas.',
        'Estos números no se inventan: salen de contar y dividir la base real.'
      ],
      ejemplo: {
        tipo: 'tabla',
        titulo: 'Frecuencia de personas por vivienda',
        columnas: ['Personas en la vivienda', 'Cuántas viviendas'],
        filas: [
          ['2 personas', 12],
          ['3 personas', 21],
          ['4 personas', 18],
          ['5 personas', 9]
        ]
      },
      reto: {
        id: '3.2-r',
        tipo: 'excel',
        pregunta: 'Calcula el promedio de completas por entrevistador.',
        instruccion: 'En B7 escribe el PROMEDIO de la columna Completas.',
        libro: hojaPromedioEquipo,
        objetivos: [
          { celda: 'B7', valor: 16, funciones: ['PROMEDIO', 'AVERAGE'], etiqueta: 'Promedio de completas' }
        ],
        pista: 'Suma 20+18+16+14+12 y divide entre 5. En Excel: =PROMEDIO(B2:B6).',
        respuestaModelo: '=PROMEDIO(B2:B6) da 16 completas por entrevistador en promedio.',
        mensajeExito: '¡Bien! 16 completas promedio por entrevistador. Ese número ya lo puedes explicar.',
        solucion: { B7: '=PROMEDIO(B2:B6)' }
      }
    },
    {
      id: '3.3',
      numero: '3.3',
      titulo: 'Tabuladores: por sexo, edad y alcaldía',
      bloques: [
        'Un tabulador es una tabla que resume la base por categorías: sexo, edad, alcaldía o tipo de vivienda.',
        'Primero eliges la categoría, luego cuentas o sumas lo que hay en cada grupo.',
        'El tabulador es lo que se entrega en los reportes y presentaciones.',
        'Se revisa que la suma de los grupos coincida con el total. Si no coincide, falta algo.',
        'Con un tabulador claro, cualquiera entiende los resultados sin ver toda la base.'
      ],
      ejemplo: {
        tipo: 'tabla',
        titulo: 'Tabulador por alcaldía y sexo',
        columnas: ['Alcaldía', 'Mujeres', 'Hombres', 'Total'],
        filas: [
          ['Benito Juárez', 18, 14, 32],
          ['Iztapalapa', 17, 16, 33],
          ['Coyoacán', 21, 20, 41],
          ['Cuauhtémoc', 24, 24, 48]
        ]
      },
      reto: {
        id: '3.3-r',
        tipo: 'dinamica',
        pregunta: 'Arma el tabulador de completas por alcaldía y revisa el total.',
        instruccion: 'En filas pon Alcaldía, en valores pon Completas y usa suma.',
        libro: hojaFrecuencias,
        camposFila: ['Alcaldía', 'Sexo', 'Completas'],
        camposValor: ['Completas', 'Sexo'],
        filaEsperada: 'Alcaldía',
        valorEsperado: 'Completas',
        agregacionEsperada: 'suma',
        resultadoEsperado: [
          { etiqueta: 'Cuauhtémoc', valor: 48 },
          { etiqueta: 'Coyoacán', valor: 41 },
          { etiqueta: 'Iztapalapa', valor: 33 },
          { etiqueta: 'Benito Juárez', valor: 32 }
        ],
        pista: 'Cuauhtémoc suma 24 + 24 = 48. Por eso queda al frente.',
        respuestaModelo:
          'Filas: Alcaldía. Valores: Completas. Suma. Cuauhtémoc 48, Coyoacán 41, Iztapalapa 33 y Benito Juárez 32.',
        mensajeExito: '¡Perfecto! Ese tabulador se puede entregar tal cual en un reporte.'
      }
    },
    {
      id: '3.4',
      numero: '3.4',
      titulo: 'Cómo leer y explicar una gráfica',
      bloques: [
        'Una gráfica se explica en tres pasos: qué muestra, qué resalta y qué falta hacer.',
        'No hace falta decir todos los números. Basta con lo más alto, lo más bajo y la diferencia.',
        'Frase modelo: “En Benito Juárez llevamos 70% y en Iztapalapa 55%, nos falta apoyar Iztapalapa”.',
        'Hablar así transmite calma y control. Estás explicando, no justificándote.',
        'Siempre cierra con una acción concreta: apoyar, revisar o reportar.'
      ],
      ejemplo: {
        tipo: 'grafico',
        titulo: 'Avance por alcaldía (%)',
        estilo: 'barras',
        etiquetas: ['Benito Juárez', 'Iztapalapa', 'Coyoacán', 'Cuauhtémoc'],
        valores: [70, 55, 82, 96],
        nota: 'Iztapalapa es la más baja con 55%; Cuauhtémoc la más alta con 96%.'
      },
      reto: {
        id: '3.4-r',
        tipo: 'quiz',
        pregunta: 'En la gráfica, Iztapalapa lleva 55% y Cuauhtémoc 96%. ¿Qué frase explica mejor la situación?',
        opciones: [
          'Iztapalapa está mal y no sirve',
          'Cuauhtémoc va al 96% e Iztapalapa al 55%; conviene apoyar Iztapalapa esta semana',
          'Todo va igual'
        ],
        correcta: 1,
        pista: 'Una buena explicación dice qué resalta y qué acción sigue, sin juzgar.',
        respuestaModelo:
          'Cuauhtémoc va al 96% e Iztapalapa al 55%; conviene apoyar Iztapalapa esta semana.',
        explicacion: 'Explicar es señalar la diferencia y proponer una acción concreta.'
      }
    }
  ],
  reto: {
    id: '3-cierre',
    tipo: 'grafico',
    pregunta: 'Reto de cierre: elige la gráfica para explicar cobertura por estado y contesta la lectura.',
    instruccion: 'Compara estados, elige el tipo de gráfica y responde qué estado tiene la cobertura más baja.',
    titulo: 'Cobertura por estado (%)',
    etiquetas: ['CDMX', 'Edomex', 'Puebla', 'Veracruz'],
    valores: [70, 80, 60, 57],
    tipoCorrecto: 'barras',
    preguntaLectura: '¿Qué estado tiene la cobertura más baja?',
    opcionesLectura: ['Ciudad de México', 'Estado de México', 'Puebla', 'Veracruz'],
    correctaLectura: 3,
    pista: 'Veracruz tiene 57%, la barra más corta.',
    respuestaModelo:
      'Barras para comparar estados. Veracruz tiene la cobertura más baja, con 57%, así que conviene apoyarlo.',
    mensajeExito: '¡Terminaste el Módulo 3! Ya puedes leer y explicar los números que vas a reportar.'
  }
}
