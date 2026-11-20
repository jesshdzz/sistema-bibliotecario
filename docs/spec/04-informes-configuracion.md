# Informes, impresión de inventario y configuración

## 1. Estadísticas e informes (RF-38, RF-39, RF-52, RF-53)

El cliente pidió: estadísticas e informes **mensuales y anuales** sobre préstamos, libros, usuarios, etc.; impresión del **inventario**; y filtros para decidir **qué información se muestra y cómo**. La lista exacta de informes no está cerrada (Q13); empieza por estos y hazlos extensibles.

| Informe | Contenido | Filtros |
|---|---|---|
| Préstamos | Total por mes y por año; por modalidad (casa, sala, fotocopia); por categoría; por tipo de usuario; tasa de no recogida; devoluciones tardías | Periodo (mes o año), modalidad, categoría, tipo de usuario |
| Libros | Más solicitados; títulos sin movimiento; altas del periodo (por fecha de captura); bajas con motivo | Periodo, categoría, prefijo LCC |
| Usuarios | Usuarios con préstamos en el periodo; por carrera y semestre; sanciones vigentes | Periodo, carrera, semestre |
| Inventario | Títulos y ejemplares por categoría, por clasificación y por estado | Categoría, LCC, estado |
| Numeración UTM | UTM disponibles, retirados y huecos | — |

Impresión de inventario:
- El bibliotecario elige filtros (categoría, rango LCC, estado, fecha de captura), **columnas** (número de ficha, UTM, título, autor, LCC, ejemplares, estado…) y **orden**; ve una vista previa.
- Salida: página optimizada para imprimir, PDF, CSV y Excel. El encabezado (nombre de la institución, logotipo) es configurable (Q13).
- Los informes para vicerrectoría son agregados y sin datos personales por defecto (RF-40).
- Los cálculos se hacen con consultas SQL agregadas en el servidor; no cargues tablas completas en el navegador. Los periodos usan `America/Mexico_City`.

## 2. Configuración: principio de diseño

"Es probable que salgan más cambios": todo lo que pueda cambiar sin tocar código se vuelve un valor editable por los bibliotecarios en la sección de configuración. Hay dos mecanismos:

- **Parámetros** (`parametro`: clave, valor JSON, descripción, quién y cuándo lo cambió). Para valores sueltos y estructuras pequeñas.
- **Catálogos** (tablas con `nombre/etiqueta`, `activo`, `orden`). Para listas que crecen o se desactivan: categorías, idiomas, países, motivos de baja, tipos de usuario.

Reglas de implementación:
1. Define cada clave en un registro único en el código (clave, tipo, valor por defecto, esquema Zod, descripción, rol que puede editarla). Una clave desconocida o con valor inválido se rechaza al guardar; al leer, si falta, se usa el valor por defecto.
2. Lee los parámetros solo a través de un módulo de servicio tipado (por ejemplo `getParametro("prestamo.max_libros")`), nunca con consultas sueltas. Puedes cachear, pero invalida al guardar.
3. Cada cambio de configuración va a la bitácora (RF-06): quién, cuándo, valor anterior y nuevo.
4. Los catálogos no se borran si están en uso: se **desactivan**. Los registros viejos conservan su valor.
5. Los cambios de parámetros no reescriben datos históricos: un préstamo ya creado conserva su vencimiento calculado.
6. Ruta y permisos: pantalla "Configuración" solo para bibliotecarios (Q12: ¿los tres o solo un administrador?); autorización en el servidor.

## 3. Parámetros iniciales

Valores por defecto tomados de las respuestas de la universidad. "Por definir" significa que no hay dato: crea la clave, no un valor inventado.

| Clave | Valor inicial | Origen |
|---|---|---|
| `prestamo.ventana_recogida_min` | 30 | P6 |
| `prestamo.max_libros` | 3 | P8 |
| `prestamo.hora_vencimiento` | `10:00` (día hábil siguiente) | P7 |
| `sala.horas` | 2 (ampliable si nadie espera) | P14 |
| `sancion.llamados_para_sancion` | 3 | P10 |
| `sancion.multas_activas` | verdadero (la universidad evalúa eliminarlas) | P11 |
| `sancion.tabla` | por definir (tabla del reglamento por tipo de usuario y modalidad) | P11 |
| `biblioteca.horario` | lunes a viernes 07:00 a 20:00 | P3 |
| `biblioteca.dias_no_habiles` | calendario por definir (suspensiones, feriados) | P7 |
| `usuarios.modalidades_por_tipo` | alumno, docente, administrativo: casa, fotocopia, sala; público: sala y fotocopia | P1 |
| `utm.prefijo`, `utm.longitud`, `utm.reutilizar_libres` | formato por definir; `reutilizar_libres` = verdadero | Q01, Q02 |
| `formulario.campos_obligatorios` | título, categoría y un ejemplar (propuesta) | Q10 |
| `informes.encabezado` | nombre de la institución y logotipo; por definir | Q13 |

Catálogos iniciales:

| Catálogo | Valores iniciales | Notas |
|---|---|---|
| `categoria` | Consulta (no prestable a domicilio), Tesis, Posgrado, INEGI, Libros y revistas | Atributos `permite_domicilio` y `permite_fotocopia`; por ahora solo Consulta no sale a domicilio (Q06); Tesis, Posgrado e INEGI arrancan prestables, por confirmar |
| Idiomas | Español, inglés y los que use la biblioteca; por definir | Q11 |
| Países | Lista de países; por definir si con códigos MARC | Q11 |
| Motivos de baja | Extravío, deterioro, donación (del informe; por confirmar) | Baja con historial |
| Tipos de usuario | Alumno, docente, administrativo, público | P1 |

Cualquier regla nueva que mencione el cliente entra aquí primero como parámetro o catálogo, y recién después como código.
