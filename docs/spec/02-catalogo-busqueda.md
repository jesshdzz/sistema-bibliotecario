# Catálogo, ficha bibliográfica y búsqueda

Fuente: definición de la biblioteca (19-nov-2026). Formato de los registros: MARC 21. El sistema es **propio** (no se adopta Koha, P5). Alcance del material: libros, revistas y artículos (P4), más las categorías Tesis, Posgrado e INEGI (Q05, resuelta).

## 1. Captura de un título nuevo

El formulario debe contener estos campos. Columnas propuestas; los nombres exactos pueden ajustarse al implementar. La columna MARC es referencia para exportar/importar y se marca **verificado** si la etiqueta se comprobó en la documentación oficial de la Library of Congress, o **por verificar**.

| # | Campo del cliente | Columna propuesta | Quién lo escribe | MARC 21 |
|---|---|---|---|---|
| 1 | Número de ficha | `titulo.numero_ficha` | Sistema; no se modifica nunca | 001 número de control (verificado como campo; el uso es propuesta) |
| 2 | Número UTM | `ejemplar.numero_utm` | Bibliotecario; **sí se modifica** | Campo local, sin etiqueta estándar; es el código de barras del ejemplar (Q01) |
| 3 | Autor principal, corporativo o de congreso | `autor_principal` + `tipo_autor` (personal, corporativo, congreso) | Bibliotecario | 100 verificado; 110 y 111 por verificar |
| 4 | Título y mención de responsabilidad | `titulo` + `mencion_responsabilidad` | Bibliotecario | 245 verificado ($a título, $c responsabilidad) |
| 5 | Edición | `edicion` | Bibliotecario | 250 verificado |
| 6 | Editorial | `editorial` | Bibliotecario | 260 $b verificado (264 también existe) |
| 7 | País de publicación | `pais_publicacion` | Bibliotecario (lista, Q11) | 008 por verificar |
| 8 | Idioma | `idioma` | Bibliotecario (lista, Q11) | 008 / 041 por verificar |
| 9 | Fecha de publicación | `fecha_publicacion` (texto: admite "c1991", "s.f.") | Bibliotecario | 260 $c verificado |
| 10 | Pie de imprenta | `pie_imprenta` | Bibliotecario | 260 verificado ($a lugar, $b editorial, $c fecha); ver Q17 |
| 11 | Descripción física (páginas, volumen, dimensiones…) | `descripcion_fisica` (texto) | Bibliotecario | 300 verificado |
| 12 | Colección o serie | `coleccion_serie` | Bibliotecario | 490 / 830 por verificar |
| 13 | Checkbox "es tesis" | `es_tesis` (booleano) | Bibliotecario | Se relaciona con 502; al marcarla, la categoría pasa a Tesis (Q05) |
| 14 | Notas generales | `notas_generales` | Bibliotecario | 500 verificado |
| 15 | Notas de contenido | `notas_contenido` | Bibliotecario | 505 / 520 por verificar |
| 16 | Notas de tesis | `notas_tesis` (visible si `es_tesis`) | Bibliotecario | 502 verificado (nota de disertación) |
| 17 | Contenido (índice) | `contenido` (texto largo) | Bibliotecario | 505 por verificar |
| 18 | ISBN | `titulo_isbn` (varios por título, cada uno con nota opcional: tomo, editorial, encuadernación; sin unicidad global porque se repite entre ediciones y colecciones; opcional; validar dígito verificador) | Bibliotecario o autocompletado | 020 verificado |
| 19 | Encabezamiento de materia | `titulo_materia` (varios) | Bibliotecario | 650 verificado |
| 20 | Ejemplares (número de libros y/o copias) | filas en `ejemplar` | Bibliotecario (ver sección 3) | Existencias; 852 por verificar |
| 21 | Clasificación | `clasificacion_lcc` | Bibliotecario (hoy consulta tablas LCC a mano) | 050 verificado |
| 22 | Bibliotecario que capturó | `capturado_por` | **Automático** desde la cuenta con sesión | — |

Además, de forma automática: `creado_en` (fecha de captura) y `actualizado_en`. Y la **categoría** (Consulta, Tesis, Posgrado, INEGI, Libros y revistas), obligatoria, elegida de una lista configurable (Q14: una por título).

La lista del cliente terminaba con un renglón vacío: confirmar si faltaba un campo (Q10). No se sabe qué campos son obligatorios (Q10): hazlo configurable (`formulario.campos_obligatorios`) y por defecto exige solo título, categoría y al menos un ejemplar.

Reglas:
- `numero_ficha` lo genera la base de datos (columna de identidad). Ninguna ruta, acción de servidor ni formulario puede modificarlo; si se puede, agrega un disparador que lo impida.
- Validar ISBN-10 e ISBN-13 con su dígito verificador; aceptar títulos sin ISBN (captura manual obligatoria, P28).
- Autocompletar por ISBN con Open Library (adaptador propio, caché) solo rellena lo que encuentre; el bibliotecario revisa y completa. Nunca sobrescribas lo que ya capturó.
- Cada cambio de un título o ejemplar queda en la bitácora (quién, cuándo, qué) (RF-06, RF-15).
- Eliminar un título solo corrige un alta por error y solo sin historial; retirarlo del acervo es **baja** de sus ejemplares, con motivo.

## 2. Clasificación LCC

La biblioteca usa Library of Congress Classification, asignada a mano con las tablas de clasificación. Ejemplos del cliente: `PQ2226`, `C65`, `D8` (clase y cutters; probablemente se lee `PQ2226 .C65 D8`, ver Q09).

- Guarda el texto tal como lo escribe el bibliotecario, con validación laxa (letras de clase al inicio, número, cutters opcionales). No inventes que el formato sea único.
- Guarda también una clave de orden calculada (`clasificacion_lcc_orden`): las letras en mayúscula y el número de clase con relleno, para que `PQ999` ordene antes de `PQ2226`. Ordenar el texto crudo es incorrecto.
- Para buscar por prefijo (por ejemplo todo `PQ`), usa la clave de orden o un índice sobre el texto normalizado.
- Automatizar la asignación de LCC **no** se pidió. No la construyas.

## 3. Ejemplares y número UTM

- Un título tiene un solo número de ficha y uno o más ejemplares. Cada libro, copia, ejemplar o volumen tiene su propio UTM. Al capturar, el bibliotecario indica cuántas copias hay; el formulario genera una fila por copia (`volumen` y `copia` opcionales) y pide su UTM (Q03 y Q04, resueltas).
- El **UTM es el código de barras** que asignan los bibliotecarios (Q01, resuelta): obligatorio, único entre ejemplares vigentes y editable. Su formato no se conoce: texto libre hasta que se defina.
- Automatización (Q02, resuelta): al cargar un libro el sistema **sugiere** un UTM, **lista los UTM disponibles** y permite **reutilizar los libres**.
  1. **Libre** = número que ningún ejemplar vigente (estado distinto de `baja`) tiene: huecos de la numeración y números de ejemplares dados de baja.
  2. Unicidad con índice único **parcial** sobre `ejemplar(numero_utm) WHERE estado <> 'baja'`. Los ejemplares dados de baja se conservan con su número como historial, y el historial de préstamos referencia `ejemplar.id`, nunca el número.
  3. Sugerencia: con `utm.reutilizar_libres = true` (por defecto) propone el menor libre; con `false`, el máximo existente más uno. Solo aplica si el UTM es numérico; prefijo y longitud en `parametro` (`utm.*`).
  4. Si el UTM elegido perteneció a un ejemplar dado de baja, avisar al bibliotecario (la etiqueta del libro retirado debió quitarse).
  5. Pantalla de UTM disponibles e informe de huecos y retirados.
  La sugerencia debe tolerar concurrencia (dos bibliotecarios capturando a la vez): la unicidad la garantiza la base de datos, no la sugerencia.
- Consulta no sale a domicilio (`categoria.permite_domicilio = false`), pero el ejemplar existe, tiene UTM, se presta en sala y se puede fotocopiar porque la fotocopiadora está dentro de la biblioteca (`categoria.permite_fotocopia = true`; Q06, resuelta).

### Categoría, tipo de material y tesis

- Al marcar «es tesis», el título pasa a la categoría Tesis; lo mismo con revistas, artículos y las demás categorías: el tipo de material (`titulo.tipo`, opcional; Q07) asigna la categoría por defecto (Q05, resuelta). Propuesta: el bibliotecario puede corregirla.
- Las categorías son configurables y cada una tiene `permite_domicilio` y `permite_fotocopia`. Por ahora solo Consulta no sale a domicilio; Tesis, Posgrado e INEGI arrancan como prestables, por confirmar.

## 4. Búsqueda

Criterios (cualquiera, por separado o combinados):

| Criterio | Quién | Notas |
|---|---|---|
| Título | Todos | Coincidencia por palabras |
| Autor | Todos | Incluye autor corporativo y de congreso |
| Clasificación (LCC) | Todos | Por prefijo y exacta |
| Categoría | Todos | Lista de categorías activas |
| ISBN | Todos | Acepta con o sin guiones |
| Número UTM | Todos (por confirmar, Q16) | Devuelve el título al que pertenece el ejemplar vigente |
| Número de ficha | **Solo bibliotecarios** | Exacto |
| Fecha de captura | **Solo bibliotecarios** | Rango de fechas |

Filtros y ordenamientos (aplican sobre cualquier resultado):
- Filtros: categoría, disponibles, idioma, país, rango de fecha de publicación, es tesis, prefijo LCC; solo bibliotecarios: capturado por, rango de fecha de captura.
- Orden: relevancia, título, autor, fecha de publicación, clasificación LCC (con la clave de orden), disponibilidad; solo bibliotecarios: fecha de captura, número de ficha.
- Paginación en el servidor; filtros y orden en la URL para poder compartir la búsqueda.

Calidad de búsqueda (RF-07, meta: menos de 1 s en el percentil 95): insensible a acentos y mayúsculas, tolerante a errores de escritura, texto completo en español. Con PostgreSQL esto apunta a las extensiones `unaccent` y `pg_trgm` y a `to_tsvector('spanish', …)`; **verifica su disponibilidad y sintaxis en la documentación de PostgreSQL 17** y crea la migración con SQL personalizado (comprueba cómo lo soporta la versión instalada de drizzle-kit). Mide con datos de prueba realistas (hasta 5 copias por título).

La autorización del criterio "solo bibliotecarios" se valida en el servidor; ocultar el campo en la interfaz no basta.

## 5. Ficha bibliográfica (vista de un libro)

Mostrar, en este orden:

1. Número de ficha
2. Clasificación LCC
3. Autor principal
4. Título y mención de responsabilidad
5. Edición
6. Lugar, editorial y año
7. Descripción física
8. Colección o serie
9. Notas generales y de contenido
10. ISBN
11. Tema o materia (los encabezamientos)
12. Ejemplares disponibles (disponibles de total; para bibliotecarios, cada ejemplar con su UTM y estado)
13. Tabla de contenido

Mostrar solo los renglones con dato. "Lugar, editorial y año" se compone de los campos de publicación (Q17). Si es tesis, mostrar además las notas de tesis. La categoría y, si es Consulta, el aviso de "solo uso en biblioteca" deben ser visibles. Portada y ubicación física (RF-08 original) quedan fuera hasta nueva orden (P29: la ubicación se desconoce).

## 6. MARC 21

El formato de los registros es MARC 21 y la respuesta del cliente fue **solo seguir su estructura** (Q08, resuelta): los campos se modelan como arriba y la etiqueta MARC de referencia se guarda en la documentación. **No** se construye importación ni exportación MARC; solo CSV (RF-12, RF-43). Referencia oficial: https://www.loc.gov/marc/bibliographic/. Las etiquetas "por verificar" deben comprobarse ahí antes de tomarlas como referencia definitiva.
