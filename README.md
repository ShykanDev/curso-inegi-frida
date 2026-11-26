# Curso práctico INEGI para Frida

Aplicación web para que Frida Paola Sánchez Aguirre llegue tranquila y segura a su primer día en la Dirección Regional Centro del INEGI (Ciudad de México). No es un examen: es un curso paso a paso, con calma, en español sencillo.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre la dirección que muestra la terminal (por ejemplo `http://localhost:5173`). Todo el avance se guarda solo en el navegador.

## Qué incluye

- **Seis módulos (0 al 5)** con 31 lecciones, ejemplo hecho, reto, pista y respuesta modelo.
- **Simulador de Excel propio**, con barra de fórmulas, celdas editables y cálculo real de `SUMA`, `PROMEDIO`, `CONTAR`, `CONTAR.SI`, `SI`, `BUSCARV` y `XLOOKUP`.
- **Formato condicional real**: ella elige el rango, la condición y el color, y las celdas se pintan solas.
- **Gráficas hechas por ella dentro del simulador**: barras y pastel, generadas desde un rango de la hoja.
- **Retos de tabla dinámica** que se arman dentro de la app.
- **Reto de validación** con una base de 10 filas que esconde 5 errores reales.
- **Plantillas de Word y PowerPoint** para armar un oficio con tabla y una presentación de tres diapositivas.
- **Simulación de un día completo** en el INEGI, con guion y decisiones.
- **Botón "Ver la solución en el simulador"** en cada reto de Excel: si se atora, ve la fórmula, el formato y la gráfica ya hechos, sin perder su avance.
- **Progreso guardado** en `localStorage` y cuatro insignias: Primera suma, Primera tabla dinámica, Validadora, Reportera INEGI.

## Ruta de Excel (de cero a intermedio)

| Lección | Qué aprende |
| --- | --- |
| 1.1 – 1.2 | Celdas, guardar, ordenar y filtrar |
| 1.3 – 1.4 | `SUMA`, `PROMEDIO`, `CONTAR` |
| 1.5 – 1.6 | `CONTAR.SI`, porcentajes, `SI` |
| 1.7 | `BUSCARV` y `XLOOKUP` |
| 1.8 | Tablas dinámicas |
| 1.9 – 1.10 | Limpieza de datos |
| 1.11 – 1.12 | Formato condicional: una regla y semáforo de tres colores |
| 1.13 – 1.14 | Gráficas de barras y de pastel hechas por ella |
| 1.15 | Todo junto: fórmula + semáforo + gráfica |

## Estructura

```
src/
  components/     Simulador de Excel, formularios de reto, ejemplos y diseño base
  data/           Contenido del curso: un archivo por módulo
  lib/            Motor de fórmulas y datos de ejemplo
  store/          Progreso y persistencia
  views/          Inicio, módulo y mi progreso
```

## Pruebas

```bash
npm run probar          # fórmula y respuestas esperadas de cada reto
npm run probar:interfaz # recorrido completo en un navegador real
npm run probar:retos    # tablas dinámicas, validación, Word, gráficas y simulación
```

Las pruebas de navegador necesitan el servidor de desarrollo corriendo. Si el puerto 5173 está ocupado, levántalo en otro y ajusta la constante `BASE` al inicio de `e2e.ts` y `e2e-retos.ts`.

## Notas de contenido

- Todos los datos de personas son inventados; las alcaldías y municipios sí son reales.
- La app no enseña SIA, Python, R, SQL ni estadística avanzada: no forman parte de este nivel del puesto.
- En la pantalla de inicio se aclara que la preparación es general para Enlace / Analista de validación y que el puesto exacto lo confirmará el INEGI.
- Todo el texto está en español, salvo los nombres de las fórmulas de Excel, que se explican en español.
