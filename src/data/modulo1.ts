import type { Modulo } from './tipos'
import {
  hojaEntrevistadores,
  hojaDuplicados,
  hojaCierreModulo1,
  hojaFormatoCondicional,
  hojaGraficoPractica,
  hojaPastel,
  hojaEstilosAvance,
  hojaViviendas
} from '../lib/datos'

export const modulo1: Modulo = {
  id: 1,
  titulo: 'Excel desde cero, con datos del INEGI',
  subtitulo: 'Sumas, promedios y porcentajes sin miedo',
  objetivo: 'Que uses el simulador para sumar, promediar, contar y sacar porcentajes con datos de viviendas y entrevistas.',
  tiempo: '3 horas, a tu ritmo',
  lecciones: [
    {
      id: '1.1',
      numero: '1.1',
      titulo: 'Abrir, guardar y no romper nada',
      bloques: [
        'Excel guarda la información en celdas. Cada celda tiene una dirección: la columna va primero y luego la fila, como B3.',
        'La fila 1 casi siempre tiene los nombres de las columnas. Eso se llama encabezado.',
        'Para no romper una base, no borres filas a la mitad ni muevas columnas de lugar sin avisar.',
        'Antes de cambiar algo grande, guarda. El botón Guardar está arriba, en la barra de herramientas.',
        'Si te equivocas, Deshacer te regresa un paso. No hay problema, se puede intentar otra vez.'
      ],
      ejemplo: {
        tipo: 'tabla',
        titulo: 'Una base de viviendas, ordenada',
        columnas: ['A: Folio', 'B: Alcaldía', 'C: Estatus', 'D: Personas'],
        filas: [
          ['CDMX-001', 'Azcapotzalco', 'Completa', 4],
          ['CDMX-002', 'Cuauhtémoc', 'Completa', 3],
          ['CDMX-003', 'Iztapalapa', 'Pendiente', 5]
        ]
      },
      reto: {
        id: '1.1-r',
        tipo: 'excel',
        pregunta: 'Selecciona la celda B2 y escribe la alcaldía que le toca a ese folio según el ejemplo.',
        instruccion: 'Haz clic en la celda B2 y escribe sin miedo. Aquí solo practicas cómo se escribe en una celda.',
        libro: {
          id: 'practica-celdas',
          archivo: 'Practica_Celdas.xlsx',
          hoja: 'Datos',
          columnas: ['Folio', 'Alcaldía', 'Estatus'],
          filas: 4,
          celdas: {
            A1: 'Folio',
            B1: 'Alcaldía',
            C1: 'Estatus',
            A2: 'CDMX-001',
            B2: '',
            C2: 'Completa',
            A3: 'CDMX-002',
            B3: 'Cuauhtémoc',
            C3: 'Completa',
            A4: 'CDMX-003',
            B4: 'Iztapalapa',
            C4: 'Pendiente'
          },
          anchos: [120, 170, 130]
        },
        objetivos: [
          { celda: 'B2', valor: 'Azcapotzalco', etiqueta: 'La alcaldía del folio CDMX-001' }
        ],
        pista: 'En la fila 2, junto al folio CDMX-001, va Azcapotzalco.',
        respuestaModelo: 'En B2 se escribe Azcapotzalco, que es la alcaldía del folio CDMX-001.',
        mensajeExito: '¡Muy bien! Ya sabes seleccionar una celda y escribir en ella.',
        solucion: { B2: 'Azcapotzalco' }
      }
    },
    {
      id: '1.2',
      numero: '1.2',
      titulo: 'Ordenar y filtrar para encontrar casos',
      bloques: [
        'Ordenar es poner las filas en otro orden, por ejemplo por alcaldía. Las filas se mueven completas, no se rompen.',
        'Filtrar es esconder lo que no necesitas y dejar visible solo lo que sí, por ejemplo solo “Pendiente”.',
        'Filtra primero y cuenta después. Así tus números hablan solo de lo que quieres revisar.',
        'Un filtro no borra nada. Lo que está escondido sigue ahí y regresa cuando quitas el filtro.'
      ],
      ejemplo: {
        tipo: 'tabla',
        titulo: 'Las mismas viviendas, filtradas a “Pendiente”',
        columnas: ['Folio', 'Alcaldía', 'Estatus'],
        filas: [
          ['CDMX-003', 'Iztapalapa', 'Pendiente'],
          ['CDMX-007', 'Ecatepec', 'Pendiente'],
          ['CDMX-011', 'Coyoacán', 'Pendiente']
        ]
      },
      reto: {
        id: '1.2-r',
        tipo: 'excel',
        pregunta: 'Cuenta cuántas viviendas están en estatus “Pendiente” en esta base.',
        instruccion: 'Usa CONTAR.SI sobre la columna Estatus y escribe el resultado en la celda F2.',
        libro: {
          id: 'practica-filtro',
          archivo: 'Viviendas_Filtro.xlsx',
          hoja: 'Viviendas',
          columnas: ['Folio', 'Alcaldía', 'Entrevistador', 'Fecha', 'Estatus', 'Pendientes'],
          filas: 8,
          celdas: {
            A1: 'Folio',
            B1: 'Alcaldía',
            C1: 'Entrevistador',
            D1: 'Fecha',
            E1: 'Estatus',
            F1: 'Pendientes',
            A2: 'CDMX-001',
            B2: 'Azcapotzalco',
            C2: 'Ana Ramírez',
            D2: '2026-03-02',
            E2: 'Completa',
            A3: 'CDMX-002',
            B3: 'Cuauhtémoc',
            C3: 'Luis Ortega',
            D3: '2026-03-02',
            E3: 'Pendiente',
            A4: 'CDMX-003',
            B4: 'Iztapalapa',
            C4: 'Mariana Cruz',
            D4: '2026-03-03',
            E4: 'Pendiente',
            A5: 'CDMX-004',
            B5: 'Coyoacán',
            C5: 'José Peña',
            D5: '2026-03-03',
            E5: 'No respuesta',
            A6: 'CDMX-005',
            B6: 'Benito Juárez',
            C6: 'Sofía Delgado',
            D6: '2026-03-04',
            E6: 'Pendiente',
            A7: 'CDMX-006',
            B7: 'Gustavo A. Madero',
            C7: 'Ana Ramírez',
            D7: '2026-03-04',
            E7: 'Completa',
            F2: ''
          },
          anchos: [110, 160, 150, 120, 130, 110]
        },
        objetivos: [
          { celda: 'F2', valor: 3, funciones: ['CONTAR.SI', 'COUNTIF'], etiqueta: 'Viviendas pendientes' }
        ],
        pista: 'La fórmula es =CONTAR.SI(E2:E7,"Pendiente"). Fíjate que el texto va entre comillas.',
        respuestaModelo: '=CONTAR.SI(E2:E7,"Pendiente") da 3 viviendas pendientes.',
        mensajeExito: '¡Perfecto! Eso es 3 viviendas pendientes. Contar con criterio ya no es un misterio.',
        solucion: { F2: '=CONTAR.SI(E2:E7,"Pendiente")' }
      }
    },
    {
      id: '1.3',
      numero: '1.3',
      titulo: 'SUMA: el total de entrevistas completas',
      bloques: [
        'SUMA junta varios números en uno solo. Se escribe =SUMA( y luego el rango de celdas.',
        'Un rango se escribe con dos puntos: D2:D6 quiere decir “de D2 hasta D6”.',
        'En el INEGI lo usarás todo el tiempo: total de entrevistas, total de viviendas, total de personas.',
        'Si te da 0, casi siempre es que el rango está mal seleccionado. Revisa de dónde a dónde va.'
      ],
      ejemplo: {
        tipo: 'formula',
        titulo: 'Las entrevistas de una semana',
        formula: '=SUMA(B2:B6)',
        resultado: '70',
        explicacion: 'Suma 12 + 15 + 9 + 20 + 14. Ese 70 son las entrevistas completas de la semana.'
      },
      reto: {
        id: '1.3-r',
        tipo: 'excel',
        pregunta: 'Suma el total de entrevistas completas de la semana de Azcapotzalco y Cuauhtémoc.',
        instruccion: 'En la celda B7 escribe la SUMA de las entrevistas de los cinco días. Debe dar 70.',
        libro: {
          id: 'suma-semana',
          archivo: 'Avance_Azcapotzalco_Cuauhtémoc.xlsx',
          hoja: 'Avance',
          columnas: ['Día', 'Entrevistas completas'],
          filas: 7,
          celdas: {
            A1: 'Día',
            B1: 'Entrevistas completas',
            A2: 'Lunes',
            B2: '12',
            A3: 'Martes',
            B3: '15',
            A4: 'Miércoles',
            B4: '9',
            A5: 'Jueves',
            B5: '20',
            A6: 'Viernes',
            B6: '14',
            A7: 'Total',
            B7: ''
          },
          anchos: [150, 200]
        },
        objetivos: [
          { celda: 'B7', valor: 70, funciones: ['SUMA', 'SUM'], etiqueta: 'Total de entrevistas' }
        ],
        pista: 'Escribe =SUMA(B2:B6). Empieza en B2 y termina en B6, sin tocar la fila del total.',
        respuestaModelo: '=SUMA(B2:B6) da 70 entrevistas completas en la semana.',
        mensajeExito: '¡Bien! Te dio 70, que es el total de entrevistas completas de la semana.',
        solucion: { B7: '=SUMA(B2:B6)' }
      }
    },
    {
      id: '1.4',
      numero: '1.4',
      titulo: 'PROMEDIO y CONTAR: cuánto por día y cuántas en total',
      bloques: [
        'PROMEDIO reparte el total entre la cantidad: sirve para saber cuántas entrevistas por día en promedio.',
        'CONTAR dice cuántos números hay en un rango. Es distinto del total: no suma, solo cuenta.',
        'Si sumas 70 en cinco días, el promedio es 14 por día.',
        'Estos dos números juntos te dicen si el equipo va parejo o si un día se cayó el avance.'
      ],
      ejemplo: {
        tipo: 'formula',
        titulo: 'Promedio de la semana',
        formula: '=PROMEDIO(B2:B6)',
        resultado: '14',
        explicacion: '70 entrevistas entre 5 días son 14 por día en promedio.'
      },
      reto: {
        id: '1.4-r',
        tipo: 'excel',
        pregunta: 'Saca el promedio de entrevistas por día y cuenta cuántos días se registraron.',
        instruccion: 'En B7 pon el PROMEDIO y en C7 pon CONTAR de los días con dato.',
        libro: {
          id: 'promedio-semana',
          archivo: 'Promedio_Semana.xlsx',
          hoja: 'Avance',
          columnas: ['Día', 'Entrevistas completas', 'Días contados'],
          filas: 7,
          celdas: {
            A1: 'Día',
            B1: 'Entrevistas completas',
            C1: 'Días contados',
            A2: 'Lunes',
            B2: '12',
            A3: 'Martes',
            B3: '15',
            A4: 'Miércoles',
            B4: '9',
            A5: 'Jueves',
            B5: '20',
            A6: 'Viernes',
            B6: '14',
            A7: 'Resultado',
            B7: '',
            C7: ''
          },
          anchos: [150, 200, 150]
        },
        objetivos: [
          { celda: 'B7', valor: 14, funciones: ['PROMEDIO', 'AVERAGE'], etiqueta: 'Promedio por día' },
          { celda: 'C7', valor: 5, funciones: ['CONTAR', 'COUNT'], etiqueta: 'Días con dato' }
        ],
        pista: 'Usa =PROMEDIO(B2:B6) para el promedio y =CONTAR(B2:B6) para contar los días.',
        respuestaModelo: '=PROMEDIO(B2:B6) da 14 por día y =CONTAR(B2:B6) da 5 días.',
        mensajeExito: '¡Eso es! Promedio de 14 al día y 5 días registrados. Ya controlas los dos números.',
        solucion: { B7: '=PROMEDIO(B2:B6)', C7: '=CONTAR(B2:B6)' }
      }
    },
    {
      id: '1.5',
      numero: '1.5',
      titulo: 'CONTAR.SI y porcentajes: cobertura y no respuesta',
      bloques: [
        'CONTAR.SI cuenta solo lo que cumple una condición. Por ejemplo, solo las viviendas “No respuesta”.',
        'El porcentaje se saca dividiendo una parte entre el total y multiplicando por 100.',
        'Cobertura es cuánto logramos del total. Si son 70 completas de 100 seleccionadas, es 70%.',
        'La no respuesta también es importante: dice cuántas viviendas no pudimos entrevistar.'
      ],
      ejemplo: {
        tipo: 'formula',
        titulo: 'Porcentaje de cobertura en la República',
        formula: '=B2/B1*100',
        resultado: '70',
        explicacion: '70 entrevistas completas entre 100 seleccionadas, por 100, da 70% de cobertura.'
      },
      reto: {
        id: '1.5-r',
        tipo: 'excel',
        pregunta: 'Calcula el porcentaje de cobertura de CDMX y el porcentaje de no respuesta de Veracruz.',
        instruccion: 'En D2 pon la cobertura de CDMX con fórmula y en E6 pon el porcentaje de no respuesta de Veracruz.',
        libro: {
          id: 'cobertura-rep',
          archivo: 'Cobertura_República.xlsx',
          hoja: 'Cobertura',
          columnas: ['Estado', 'Seleccionadas', 'Completas', 'Cobertura %', 'No respuesta', 'No respuesta %'],
          filas: 7,
          celdas: {
            A1: 'Estado',
            B1: 'Seleccionadas',
            C1: 'Completas',
            D1: 'Cobertura %',
            E1: 'No respuesta',
            F1: 'No respuesta %',
            A2: 'Ciudad de México',
            B2: '100',
            C2: '70',
            D2: '',
            E2: '12',
            A3: 'Estado de México',
            B3: '120',
            C3: '96',
            E3: '9',
            A4: 'Jalisco',
            B4: '90',
            C4: '63',
            E4: '11',
            A5: 'Nuevo León',
            B5: '80',
            C5: '68',
            E5: '5',
            A6: 'Veracruz',
            B6: '95',
            C6: '57',
            E6: '18',
            F6: ''
          },
          anchos: [170, 130, 120, 130, 130, 140]
        },
        objetivos: [
          { celda: 'D2', valor: 70, tolerancia: 0.5, funciones: ['/'], etiqueta: 'Cobertura CDMX' },
          { celda: 'F6', valor: 18.95, tolerancia: 0.1, funciones: ['/'], etiqueta: 'No respuesta Veracruz' }
        ],
        pista: 'Para CDMX usa =C2/B2*100. Para Veracruz usa =E6/B6*100, que da cerca de 19%.',
        respuestaModelo: '=C2/B2*100 da 70% de cobertura. =E6/B6*100 da 18.95% de no respuesta en Veracruz.',
        mensajeExito: '¡Muy bien! La cobertura de CDMX es 70% y la no respuesta de Veracruz ronda 19%.',
        solucion: { D2: '=C2/B2*100', F6: '=E6/B6*100' }
      }
    },
    {
      id: '1.6',
      numero: '1.6',
      titulo: 'SI y formato condicional: marcar lo que falta',
      bloques: [
        'La función SI decide entre dos respuestas: si se cumple algo, escribe una cosa; si no, otra.',
        'Se escribe =SI(condición, "si se cumple", "si no se cumple").',
        'En el INEGI sirve para marcar rápido: si el avance es 80% o más, “Bien”; si no, “Falta”.',
        'El formato condicional solo cambia el color, no el dato. Sirve para ver de un vistazo.'
      ],
      ejemplo: {
        tipo: 'formula',
        titulo: '¿Llegamos al 80%?',
        formula: '=SI(D2>=80, "Bien", "Falta")',
        resultado: 'Falta',
        explicacion: 'Si el avance de D2 fuera 70, como no llega a 80, escribe “Falta”.'
      },
      reto: {
        id: '1.6-r',
        tipo: 'excel',
        pregunta: 'Marca con SI si cada alcaldía llegó al 80% de avance.',
        instruccion: 'En la columna D escribe =SI(C2>=80, "Bien", "Falta") para la primera fila y copia para las demás.',
        libro: {
          id: 'si-avance',
          archivo: 'Avance_SI_CDMX.xlsx',
          hoja: 'Avance',
          columnas: ['Alcaldía', 'Completas', 'Meta', 'Resultado'],
          filas: 6,
          celdas: {
            A1: 'Alcaldía',
            B1: 'Completas',
            C1: 'Meta',
            D1: 'Resultado',
            A2: 'Benito Juárez',
            B2: '70',
            C2: '80',
            D2: '',
            A3: 'Iztapalapa',
            B3: '55',
            C3: '80',
            D3: '',
            A4: 'Coyoacán',
            B4: '85',
            C4: '80',
            D4: '',
            A5: 'Cuauhtémoc',
            B5: '92',
            C5: '80',
            D5: '',
            A6: 'Miguel Hidalgo',
            B6: '78',
            C6: '80',
            D6: ''
          },
          anchos: [170, 120, 100, 130]
        },
        objetivos: [
          { celda: 'D2', valor: 'Falta', funciones: ['SI', 'IF'], etiqueta: 'Benito Juárez' },
          { celda: 'D4', valor: 'Bien', funciones: ['SI', 'IF'], etiqueta: 'Coyoacán' }
        ],
        pista: 'Compara las completas con la meta: =SI(B2>=C2, "Bien", "Falta"). Benito Juárez tiene 70 contra 80.',
        respuestaModelo:
          '=SI(B2>=C2, "Bien", "Falta") da “Falta” en Benito Juárez y “Bien” en Coyoacán, que tiene 85 contra 80.',
        mensajeExito: '¡Bien! Con SI ya puedes marcar al instante quién va bien y quién necesita apoyo.',
        solucion: { D2: '=SI(B2>=C2,"Bien","Falta")', D4: '=SI(B4>=C4,"Bien","Falta")' }
      }
    },
    {
      id: '1.7',
      numero: '1.7',
      titulo: 'BUSCARV y XLOOKUP: traer datos por folio',
      bloques: [
        'BUSCARV busca un folio en una lista y trae otro dato de esa misma fila, como el nombre del entrevistador.',
        'Se escribe =BUSCARV(folio, tabla, número de columna, FALSO). El FALSO significa “que sea exacto”.',
        'La columna 1 es donde buscas, la 2 es el primer dato que quieres traer, y así sigue.',
        'XLOOKUP hace lo mismo pero más simple: le dices dónde buscar y de dónde traer.'
      ],
      ejemplo: {
        tipo: 'formula',
        titulo: 'Traer al entrevistador por folio',
        formula: '=BUSCARV(A2, Catalogo!A2:B6, 2, FALSO)',
        resultado: 'Ana Ramírez',
        explicacion: 'Busca el folio de A2 en el catálogo y trae el nombre de la columna 2.'
      },
      reto: {
        id: '1.7-r',
        tipo: 'excel',
        pregunta: 'Trae el entrevistador de los folios E-02 (Toluca) y E-04 (Tlalnepantla).',
        instruccion:
          'El catálogo está a la derecha, en las columnas E y F. En B3 y en B5 escribe BUSCARV usando ese catálogo.',
        libro: {
          id: 'buscarv-casos',
          archivo: 'Casos_Edomex.xlsx',
          hoja: 'Casos',
          columnas: ['Folio', 'Entrevistador', 'Municipio', 'Catálogo folio', 'Catálogo entrevistador'],
          filas: 6,
          celdas: {
            A1: 'Folio',
            B1: 'Entrevistador',
            C1: 'Municipio',
            D1: 'Catálogo',
            E1: 'Folio del catálogo',
            F1: 'Entrevistador del catálogo',
            A2: 'E-01',
            B2: 'Ana Ramírez',
            C2: 'Ecatepec',
            E2: 'E-01',
            F2: 'Ana Ramírez',
            A3: 'E-02',
            B3: '',
            C3: 'Toluca',
            E3: 'E-02',
            F3: 'Luis Ortega',
            A4: 'E-03',
            B4: 'Mariana Cruz',
            C4: 'Naucalpan',
            E4: 'E-03',
            F4: 'Mariana Cruz',
            A5: 'E-04',
            B5: '',
            C5: 'Tlalnepantla',
            E5: 'E-04',
            F5: 'José Peña',
            A6: 'E-05',
            B6: 'Sofía Delgado',
            C6: 'Chimalhuacán',
            E6: 'E-05',
            F6: 'Sofía Delgado'
          },
          anchos: [110, 170, 150, 100, 140, 190]
        },
        objetivos: [
          {
            celda: 'B3',
            valor: 'Luis Ortega',
            funciones: ['BUSCARV', 'VLOOKUP', 'XLOOKUP', 'BUSCARX'],
            etiqueta: 'Toluca (E-02)'
          },
          {
            celda: 'B5',
            valor: 'José Peña',
            funciones: ['BUSCARV', 'VLOOKUP', 'XLOOKUP', 'BUSCARX'],
            etiqueta: 'Tlalnepantla (E-04)'
          }
        ],
        pista: 'El catálogo va de E2 a F6. La columna 1 es el folio y la 2 el nombre: =BUSCARV(A3,E2:F6,2,FALSO).',
        respuestaModelo:
          'Con =BUSCARV(A3,E2:F6,2,FALSO) sale Luis Ortega para E-02. Para E-04 sale José Peña.',
        mensajeExito: '¡Muy bien! Con BUSCARV ya puedes jalar el entrevistador sin teclear uno por uno.',
        solucion: {
          B3: '=BUSCARV(A3,E2:F6,2,FALSO)',
          B5: '=BUSCARV(A5,E2:F6,2,FALSO)'
        }
      }
    },
    {
      id: '1.8',
      numero: '1.8',
      titulo: 'Tablas dinámicas: avance por entrevistador y por alcaldía',
      bloques: [
        'Una tabla dinámica resume una base grande en una tabla chica: agrupa y suma sin hacer fórmulas.',
        'Se elige qué va en las filas, por ejemplo Entrevistador, y qué se suma, por ejemplo Completas.',
        'Sirve para responder rápido: ¿quién lleva más? ¿qué alcaldía va atrás?',
        'Es el tabulador que vas a entregar. No se hace a mano, se arma con unos clics.'
      ],
      ejemplo: {
        tipo: 'tabla',
        titulo: 'Tabla dinámica: completas por entrevistador',
        columnas: ['Entrevistador', 'Completas'],
        filas: [
          ['Ana Ramírez', 18],
          ['Luis Ortega', 17],
          ['Mariana Cruz', 15],
          ['José Peña', 12],
          ['Sofía Delgado', 16]
        ]
      },
      reto: {
        id: '1.8-r',
        tipo: 'dinamica',
        pregunta: 'Arma el tabulador de completas por entrevistador y encuentra quién lleva más.',
        instruccion: 'Elige el campo de fila, el campo de valor y la operación. El simulador lo calcula de verdad.',
        libro: hojaEntrevistadores,
        camposFila: ['Entrevistador', 'Completas', 'Viviendas visitadas'],
        camposValor: ['Completas', 'Viviendas visitadas'],
        filaEsperada: 'Entrevistador',
        valorEsperado: 'Completas',
        agregacionEsperada: 'suma',
        resultadoEsperado: [
          { etiqueta: 'Ana Ramírez', valor: 18 },
          { etiqueta: 'Luis Ortega', valor: 17 },
          { etiqueta: 'Sofía Delgado', valor: 16 },
          { etiqueta: 'Mariana Cruz', valor: 15 },
          { etiqueta: 'José Peña', valor: 12 }
        ],
        pista: 'En filas va Entrevistador. En valores va Completas. La operación es suma.',
        respuestaModelo:
          'Filas: Entrevistador. Valores: Completas. Operación: suma. Ana Ramírez va al frente con 18 y José Peña al final con 12.',
        mensajeExito: '¡Excelente! Ese es tu primer tabulador. Ana Ramírez lidera con 18 completas.'
      }
    },
    {
      id: '1.9',
      numero: '1.9',
      titulo: 'Gráficos: barras y pastel para explicar el avance',
      bloques: [
        'Una gráfica de barras compara cantidades. Sirve para ver quién avanza más por día o por estado.',
        'Una gráfica de pastel muestra partes de un total. Sirve para completas contra pendientes.',
        'Una gráfica no adorna: ayuda a explicar en una junta, en diez segundos, cómo vamos.',
        'Ponle título y revisa que los números coincidan con tu tabla antes de presentarla.'
      ],
      ejemplo: {
        tipo: 'grafico',
        titulo: 'Completas por estado (barras)',
        estilo: 'barras',
        etiquetas: ['Jalisco', 'Nuevo León', 'Puebla', 'Veracruz'],
        valores: [63, 68, 51, 57],
        nota: 'Nuevo León va al frente con 68 completas.'
      },
      reto: {
        id: '1.9-r',
        tipo: 'grafico',
        pregunta: 'Elige la gráfica correcta para completas contra pendientes y contesta la lectura.',
        instruccion:
          'Primero elige si va barras o pastel para mostrar partes de un total. Luego contesta la pregunta de lectura.',
        titulo: 'Completas por estado',
        etiquetas: ['Jalisco', 'Nuevo León', 'Puebla', 'Veracruz'],
        valores: [63, 68, 51, 57],
        tipoCorrecto: 'barras',
        preguntaLectura: '¿Qué estado tiene más entrevistas completas?',
        opcionesLectura: ['Jalisco', 'Nuevo León', 'Puebla', 'Veracruz'],
        correctaLectura: 1,
        pista: 'Para comparar estados, barras. Para ver el número más alto, mira la barra más larga.',
        respuestaModelo:
          'Barras para comparar estados. El más alto es Nuevo León, con 68 entrevistas completas.',
        mensajeExito: '¡Bien! Barras para comparar y leíste que Nuevo León va al frente.'
      }
    },
    {
      id: '1.10',
      numero: '1.10',
      titulo: 'Limpieza: duplicados, fechas y texto revuelto',
      bloques: [
        'Una base limpia tiene folios únicos y sin filas repetidas.',
        'Las fechas deben tener el mismo formato en toda la columna, sin vacíos escondidos.',
        'Los números no se mezclan con texto: “tres” y 3 no son lo mismo para Excel.',
        'Antes de borrar un duplicado, confirma cuál es el bueno. A veces se borra el dato correcto.'
      ],
      ejemplo: {
        tipo: 'tabla',
        titulo: 'Un folio repetido y un estatus mal escrito',
        columnas: ['Folio', 'Estatus', 'Problema'],
        filas: [
          ['CDMX-101', 'Completa', 'Está dos veces'],
          ['CDMX-105', 'completa', 'Minúscula, no coincide'],
          ['CDMX-106', 'Completa', 'Correcto']
        ]
      },
      reto: {
        id: '1.10-r',
        tipo: 'excel',
        pregunta: 'Cuenta cuántas veces aparece el folio CDMX-101 repetido.',
        instruccion: 'En E2 escribe CONTAR.SI sobre la columna Folio para el folio CDMX-101.',
        libro: hojaDuplicados,
        objetivos: [
          { celda: 'E2', valor: 2, funciones: ['CONTAR.SI', 'COUNTIF'], etiqueta: 'Veces que aparece CDMX-101' }
        ],
        pista: 'Usa =CONTAR.SI(A2:A12,"CDMX-101"). Si te da más de 1, hay duplicado.',
        respuestaModelo: '=CONTAR.SI(A2:A12,"CDMX-101") da 2, así que el folio CDMX-101 está duplicado.',
        mensajeExito: '¡Bien! Detectaste el duplicado. Eso es limpieza de datos de verdad.',
        solucion: { E2: '=CONTAR.SI(A2:A12,"CDMX-101")' }
      }
    },
    {
      id: '1.11',
      numero: '1.11',
      titulo: 'Formato condicional: que Excel marque solo lo que falta',
      bloques: [
        'El formato condicional pinta una celda solita según el valor que tiene. Tú pones la regla una vez y ya.',
        'Se usa así: eliges el rango, pones la condición y eliges el color. Por ejemplo: si el avance es mayor que 80, verde.',
        'En el INEGI sirve para ver de un vistazo quién va bien y quién necesita apoyo, sin leer todos los números.',
        'El color no cambia el dato. Solo cambia cómo se ve. El número sigue siendo el mismo.',
        'Aquí vas a aplicar dos reglas: verde para 80 o más, y amarillo para las que están entre 60 y 79.'
      ],
      ejemplo: {
        tipo: 'tabla',
        titulo: 'Así se ve con formato condicional aplicado',
        columnas: ['Alcaldía', 'Avance %', 'Cómo se ve'],
        filas: [
          ['Benito Juárez', '92', 'Verde: ya cumplió'],
          ['Coyoacán', '85', 'Verde: ya cumplió'],
          ['Cuauhtémoc', '78', 'Amarillo: casi llega'],
          ['Iztapalapa', '55', 'Sin color: necesita apoyo']
        ]
      },
      reto: {
        id: '1.11-r',
        tipo: 'excel',
        pregunta: 'Aplica formato condicional a la columna Avance %: verde si es mayor que 80.',
        instruccion:
          'Pulsa “Formato condicional”, elige el rango B2:B7, la condición “es mayor que”, valor 80 y color verde. Después revisa.',
        libro: hojaFormatoCondicional,
        objetivos: [],
        formatoRequerido: [
          { rango: 'B2:B7', reglas: [{ condicion: 'mayor', valor: 80, color: 'verde' }] }
        ],
        pista: 'El rango es B2:B7. La condición es “es mayor que” y el valor es 80. El color, verde.',
        respuestaModelo:
          'Se aplica a B2:B7 la regla “es mayor que 80” en verde. Benito Juárez (92), Coyoacán (85) y Azcapotzalco (81) quedan en verde.',
        mensajeExito: '¡Perfecto! Ahora Excel te avisa sola quién ya pasó de 80.',
        solucion: {},
        solucionFormato: [{ rango: 'B2:B7', reglas: [{ condicion: 'mayor', valor: 80, color: 'verde' }] }]
      }
    },
    {
      id: '1.12',
      numero: '1.12',
      titulo: 'Dos reglas a la vez: verde, amarillo y rojo',
      bloques: [
        'Puedes poner varias reglas sobre el mismo rango. Excel aplica la primera que se cumpla.',
        'Si el avance es mayor que 80, verde. Si está entre 60 y 80, amarillo. Si es menor que 60, rojo.',
        'Así se lee un tabulador en dos segundos: verde ya cumplió, amarillo casi, rojo necesita apoyo.',
        'Ese semáforo es justo lo que se presenta en una reunión de avance.',
        'Aquí vas a poner las tres reglas sobre la misma columna.'
      ],
      ejemplo: {
        tipo: 'tabla',
        titulo: 'Semáforo completo',
        columnas: ['Avance', 'Color', 'Qué significa'],
        filas: [
          ['Mayor que 80', 'Verde', 'Ya cumplió la meta'],
          ['Entre 60 y 80', 'Amarillo', 'Va a la mitad, hay que empujar'],
          ['Menor que 60', 'Rojo', 'Necesita apoyo esta semana']
        ]
      },
      reto: {
        id: '1.12-r',
        tipo: 'excel',
        pregunta: 'Pon el semáforo completo en la columna Avance %.',
        instruccion:
          'Aplica tres reglas sobre B2:B7: mayor que 80 en verde, entre 60 y 80 en amarillo, y menor que 60 en rojo.',
        libro: hojaEstilosAvance,
        objetivos: [],
        formatoRequerido: [
          {
            rango: 'B2:B7',
            reglas: [
              { condicion: 'mayor', valor: 80, color: 'verde' },
              { condicion: 'entre', valor: 60, valor2: 80, color: 'amarillo' },
              { condicion: 'menor', valor: 60, color: 'rojo' }
            ]
          }
        ],
        pista: 'Puedes aplicar varias reglas al mismo rango B2:B7. Una por una, sin borrar la anterior.',
        respuestaModelo:
          'En B2:B7 quedan tres reglas: mayor que 80 verde, entre 60 y 80 amarillo, menor que 60 rojo. Iztapalapa (55) queda en rojo.',
        mensajeExito: '¡Muy bien! Ese semáforo es el que se lleva a una reunión de avance.',
        solucion: {},
        solucionFormato: [
          {
            rango: 'B2:B7',
            reglas: [
              { condicion: 'mayor', valor: 80, color: 'verde' },
              { condicion: 'entre', valor: 60, valor2: 80, color: 'amarillo' },
              { condicion: 'menor', valor: 60, color: 'rojo' }
            ]
          }
        ]
      }
    },
    {
      id: '1.13',
      numero: '1.13',
      titulo: 'Tu primera gráfica de barras, hecha por ti',
      bloques: [
        'Una gráfica de barras compara cantidades entre categorías. Aquí comparas alcaldías.',
        'Se hace con dos cosas: un rango con las etiquetas y otro con los números. Aquí van juntos, A1:B7.',
        'Pulsa “Insertar gráfica”, elige Barras, escribe el rango y ponle título.',
        'Revisa que la barra más larga coincida con el número más alto de la tabla. Eso es leer tu propia gráfica.',
        'Si algo no cuadra, no borres la tabla: cambia el rango de la gráfica.'
      ],
      ejemplo: {
        tipo: 'grafico',
        titulo: 'Completas por alcaldía (barras)',
        estilo: 'barras',
        etiquetas: ['Benito Juárez', 'Coyoacán', 'Cuauhtémoc', 'Iztapalapa'],
        valores: [92, 85, 78, 55],
        nota: 'Benito Juárez va al frente con 92; Iztapalapa está al final con 55.'
      },
      reto: {
        id: '1.13-r',
        tipo: 'excel',
        pregunta: 'Crea tú misma la gráfica de barras de completas por alcaldía.',
        instruccion:
          'Pulsa “Insertar gráfica”, elige Barras, usa el rango A1:B7 y pon el título “Completas por alcaldía”.',
        libro: hojaGraficoPractica,
        objetivos: [],
        graficoRequerido: { tipo: 'barras', rango: 'A1:B7', titulo: 'Completas por alcaldía' },
        pista: 'El rango A1:B7 incluye el encabezado y las seis alcaldías. Tipo: barras.',
        respuestaModelo:
          'Gráfica de barras con rango A1:B7. Benito Juárez (92) queda como la barra más alta e Iztapalapa (55) como la más baja.',
        mensajeExito: '¡Esa es tu gráfica! Ahora puedes explicar el avance con una imagen, no con una lista de números.',
        solucion: {},
        solucionGrafico: { tipo: 'barras', rango: 'A1:B7', titulo: 'Completas por alcaldía' }
      }
    },
    {
      id: '1.14',
      numero: '1.14',
      titulo: 'Gráfica de pastel: partes de un total',
      bloques: [
        'La gráfica de pastel muestra cómo se reparte un total. Cada rebanada es una parte.',
        'Sirve cuando quieres ver proporciones: cuánto del total ya está completo y cuánto falta.',
        'Se hace igual que la de barras, solo cambias el tipo a Pastel.',
        'El pastel solo tiene sentido si las partes suman un total. Aquí son 70 completas, 18 pendientes y 12 sin respuesta.',
        'Revisa que las tres rebanadas juntas den 100 viviendas.'
      ],
      ejemplo: {
        tipo: 'grafico',
        titulo: 'Completas, pendientes y no respuesta',
        estilo: 'pastel',
        etiquetas: ['Completas', 'Pendientes', 'No respuesta'],
        valores: [70, 18, 12],
        nota: 'Las tres partes suman 100 viviendas. Completas es la rebanada más grande.'
      },
      reto: {
        id: '1.14-r',
        tipo: 'excel',
        pregunta: 'Crea la gráfica de pastel de completas, pendientes y no respuesta.',
        instruccion: 'Pulsa “Insertar gráfica”, elige Pastel, usa el rango A1:B4 y titúlala “Completas vs pendientes”.',
        libro: hojaPastel,
        objetivos: [],
        graficoRequerido: { tipo: 'pastel', rango: 'A1:B4', titulo: 'Completas vs pendientes' },
        pista: 'Rango A1:B4: el encabezado y las tres categorías. Tipo: pastel.',
        respuestaModelo:
          'Gráfica de pastel con A1:B4. Completas 70 (la rebanada más grande), pendientes 18 y no respuesta 12.',
        mensajeExito: '¡Bien! Con barras comparas y con pastel muestras partes de un total. Esas dos te alcanzan.',
        solucion: {},
        solucionGrafico: { tipo: 'pastel', rango: 'A1:B4', titulo: 'Completas vs pendientes' }
      }
    },
    {
      id: '1.15',
      numero: '1.15',
      titulo: 'Todo junto: fórmula, semáforo y gráfica',
      bloques: [
        'Este es el ejercicio que se parece a un día real: calcular, marcar y presentar.',
        'Primero calculas el porcentaje de cobertura de cada estado.',
        'Después pintas en verde los que ya llegaron a 80 y en rojo los que no.',
        'Al final haces una gráfica de barras para presentarlo.',
        'Si te trabas en una parte, pide la solución y mira exactamente cómo se hace. No pasa nada.'
      ],
      ejemplo: {
        tipo: 'tabla',
        titulo: 'Lo que vas a armar',
        columnas: ['Paso', 'Herramienta', 'Resultado'],
        filas: [
          ['1. Calcular cobertura', 'Fórmula =C2/B2*100', 'Un porcentaje por estado'],
          ['2. Marcar el avance', 'Formato condicional', 'Verde o rojo según el avance'],
          ['3. Presentar', 'Gráfica de barras', 'Una imagen para la reunión']
        ]
      },
      reto: {
        id: '1.15-r',
        tipo: 'excel',
        pregunta: 'Calcula la cobertura, pinta el semáforo y arma la gráfica.',
        instruccion:
          'En D2 escribe =C2/B2*100 y copia hasta D4. Luego aplica a D2:D4 verde si es mayor que 80 y rojo si es menor que 60. Al final crea una gráfica de barras con el rango A1:A4 y D1:D4, que son las etiquetas y la cobertura.',
        libro: hojaCierreModulo1,
        objetivos: [
          { celda: 'D2', valor: 70, tolerancia: 0.5, funciones: ['/'], etiqueta: 'CDMX' },
          { celda: 'D3', valor: 80, tolerancia: 0.5, funciones: ['/'], etiqueta: 'Edomex' },
          { celda: 'D4', valor: 70, tolerancia: 0.5, funciones: ['/'], etiqueta: 'Jalisco' }
        ],
        formatoRequerido: [
          {
            rango: 'D2:D4',
            reglas: [
              { condicion: 'mayor', valor: 80, color: 'verde' },
              { condicion: 'menor', valor: 60, color: 'rojo' }
            ]
          }
        ],
        graficoRequerido: {
          tipo: 'barras',
          rango: 'A1:D4',
          titulo: 'Cobertura por estado',
          valoresEsperados: [70, 80, 70, 85]
        },
        pista:
          'La cobertura es completas entre seleccionadas por 100. El semáforo va sobre D2:D4 y la gráfica debe mostrar la columna D, no las seleccionadas.',
        respuestaModelo:
          '=C2/B2*100 da 70, 80, 70 y 85. Con las reglas, los que pasan de 80 quedan en verde. La gráfica de barras compara la cobertura de los cuatro estados, no las viviendas seleccionadas.',
        mensajeExito: '¡Lo lograste completo! Calcular, marcar y graficar es exactamente lo que vas a hacer en el INEGI.',
        solucion: { D2: '=C2/B2*100', D3: '=C3/B3*100', D4: '=C4/B4*100', D5: '=C5/B5*100' },
        solucionFormato: [
          {
            rango: 'D2:D4',
            reglas: [
              { condicion: 'mayor', valor: 80, color: 'verde' },
              { condicion: 'menor', valor: 60, color: 'rojo' }
            ]
          }
        ],
        solucionGrafico: {
          tipo: 'barras',
          rango: 'A1:D4',
          titulo: 'Cobertura por estado',
          valoresEsperados: [70, 80, 70, 85]
        }
      }
    }
  ],
  reto: {
    id: '1-cierre',
    tipo: 'excel',
    pregunta: 'Reto de cierre: saca el porcentaje de cobertura de cada estado en la columna D.',
    instruccion: 'En D2 escribe la fórmula de cobertura para CDMX y en D3 la de Estado de México. Luego copia a las demás.',
    libro: hojaCierreModulo1,
    pista: 'La cobertura es completas entre seleccionadas por 100. En la fila 2 sería =C2/B2*100.',
    respuestaModelo:
      '=C2/B2*100 da 70% en CDMX. =C3/B3*100 da 80% en Estado de México. Jalisco queda en 70% y Nuevo León en 85%.',
    mensajeExito: '¡Terminaste el Módulo 1! Ya sabes sumar, promediar, contar, sacar porcentajes y armar un tabulador.',
    objetivos: [
      { celda: 'D2', valor: 70, tolerancia: 0.5, funciones: ['/'], etiqueta: 'Cobertura CDMX' },
      { celda: 'D3', valor: 80, tolerancia: 0.5, funciones: ['/'], etiqueta: 'Cobertura Edomex' }
    ],
    solucion: { D2: '=C2/B2*100', D3: '=C3/B3*100' }
  }
}
