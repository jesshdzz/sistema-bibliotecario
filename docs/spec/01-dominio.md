# Dominio, modelo de datos y reglas

## Actores y roles

| Rol | Quién | Puede |
|---|---|---|
| Alumno | Alumnos activos del padrón | Buscar, ver fichas, solicitar préstamo, ver su historial y sanciones |
| Docente / administrativo | Personal con matrícula de trabajador | Igual que el alumno (P1) |
| Público | Cualquier persona registrada que no sea alumno ni personal, incluidos usuarios externos a la universidad | Solo uso en sala o fotocopia; no se llevan libros a casa (P1) |
| Bibliotecario | 3 personas (P32) | Capturar y editar catálogo, operar ventanilla, sanciones, informes, configuración |
| Administrador de biblioteca | Por definir (Q12) | Lo del bibliotecario más lo que se decida restringir |
| Consulta | Vicerrectoría | Solo lectura de informes agregados |
| Administrador técnico | Técnico de la universidad (P30) | Operación del sistema |

Acceso: registro e inicio de sesión normales, con correo y contraseña, como en cualquier sitio web; se permiten usuarios externos a la universidad (el acceso solo con Google Workspace no está confirmado y se descartó como requisito). Todo usuario nuevo queda como **público**; el bibliotecario lo cambia a alumno o docente al validar su credencial o contra el padrón (propuesta, Q25). El rol y el tipo de usuario se guardan en la base de datos y los asigna el personal, nunca el propio usuario. Sin SMTP por ahora (Q23): no se puede depender del correo para verificar la cuenta ni para restablecer la contraseña.

## Glosario

Ver `CLAUDE.md`. Atención: "clasificación" se usa en dos sentidos en el lenguaje de la biblioteca: el **número LCC** (p. ej. `PQ2226 .C65 D8`) y el **grupo del acervo** (Consulta, Tesis, Posgrado, INEGI, Libros y revistas). En código y pantallas: `clasificacion_lcc` y `categoria`.

## Modelo de datos propuesto

El esquema inicial está en `src/db/schema/` (`auth.ts` y `dominio.ts`). Este modelo es el diseño objetivo; los nombres y columnas se ajustan al implementar. El detalle de los campos del título está en `02-catalogo-busqueda.md`.

### Esquema inicial existente y qué cambia

| Elemento actual | Estado | Cambio |
|---|---|---|
| `auth.ts`: `user`, `session`, `account` (con `password`), `verification` | Generado por Better Auth | No se edita a mano. `account.password` ya permite correo y contraseña. Los datos de dominio van en `perfil_usuario` |
| `titulo`: `isbn`, `titulo`, `autores`, `editorial`, `anio`, `tipo` (libro, revista, artículo; obligatorio), `clasificacion` | Mínimo | Ampliar a los 22 campos con `numero_ficha` automático e inmutable, `categoria_id`, `clasificacion_lcc` y `clasificacion_lcc_orden`, `capturado_por`; `tipo` pasa a opcional (Q07) |
| `ejemplar`: `codigo_barras` obligatorio y único, `estado` (disponible, apartado, prestado, en_sala, no_disponible, baja) | Mínimo | Sustituir `codigo_barras` por `numero_utm` (Q01), con índice único parcial `WHERE estado <> 'baja'` en lugar de la restricción única total (Q02); agregar `volumen`, `copia` y datos de baja |
| `prestamo`: `usuario_id`, `modalidad` (domicilio, sala, fotocopia), `estado`, `credencial_retenida`, `vence_en`, `cerrado_en`; índice único parcial de un préstamo vivo por usuario | Sirve como base | Agregar folio, límite de recogida (30 min), activación y quién atendió; revisar `credencial_retenida` (por confirmar) |
| `prestamo_item`: `vivo`, `devuelto_en`; índice único parcial de un ítem vivo por ejemplar y `check` de coherencia | Sirve como base | Agregar la condición del libro al devolverlo; el tope de 3 libros va en el servicio |
| `parametro`: `clave`, `valor` (JSON), `descripcion`, `actualizado_en`, `actualizado_por` | Sirve como base | Agregar validación por clave (Zod) |
| No existen | Nuevos | `categoria`, `catalogo_valor`, `titulo_materia`, `perfil_usuario`, `llamado_atencion`, `sancion`, `dia_no_habil`, `bitacora` |

### Modelo objetivo

| Tabla | Contenido principal | Notas |
|---|---|---|
| `titulo` | `numero_ficha` (identidad, único, inmutable), `categoria_id`, `tipo` (opcional), `isbn` (único, opcional), los demás campos de la ficha, `clasificacion_lcc` y `clasificacion_lcc_orden`, `capturado_por`, `creado_en`, `actualizado_en` | El tipo de material (libro, revista, artículo, tesis) asigna la categoría por defecto (Q05, Q07) |
| `titulo_materia` | Encabezamientos de materia (varios por título) | Campo repetible; puede ser un arreglo |
| `ejemplar` | `titulo_id`, `numero_utm`, `volumen`, `copia`, `estado`, `capturado_por`, baja (`baja_en`, `motivo_baja`) | El UTM es el código de barras. Único entre ejemplares vigentes con índice parcial `WHERE estado <> 'baja'`; reutilizable cuando queda libre (Q02). Las bajas no se borran |
| `categoria` | `nombre` único, `permite_domicilio`, `permite_fotocopia`, `orden`, `activa` | Configurable; Consulta = solo sala, con fotocopia |
| `catalogo_valor` | `catalogo`, `codigo`, `etiqueta`, `activo`, `orden` | Idiomas, países, motivos de baja, tipos de usuario; editables |
| `perfil_usuario` | `usuario_id` (a `user.id`), `rol`, `tipo_usuario` (alumno, docente, publico), `matricula`, `carrera`, `semestre`, `estatus` | Se crea con tipo público al registrarse. Rol y tipo los asigna el personal. El padrón se importa desde CSV (RF-04) |
| `prestamo` y `prestamo_item` | Folio, usuario, modalidad (casa, sala, fotocopia), estado, fechas de solicitud, límite de recogida, activación, vencimiento y devolución; ejemplares del préstamo y su condición al devolver | Préstamo vivo = `pre_prestamo`, `activo` o `vencido` |
| `llamado_atencion` y `sancion` | Usuario, motivo, fechas, quién la confirmó | Detrás de `sancion.multas_activas` |
| `parametro` | `clave`, `valor` (JSON), `actualizado_por`, `actualizado_en` | Validación por clave; ver `04-informes-configuracion.md` |
| `dia_no_habil` | Fecha y motivo | Calendario institucional para el vencimiento |
| `bitacora` | Quién, cuándo, acción, entidad, antes y después | Auditoría (RF-06) |

El UTM de un libro dado de baja: el cliente pidió listar los UTM disponibles y **reutilizar los libres** (Q02). El historial de préstamos referencia `ejemplar.id`, nunca el número. Detalle y automatización en `02-catalogo-busqueda.md`.

## Reglas de negocio confirmadas (P1–P15)

| Regla | Decisión | Dónde se aplica |
|---|---|---|
| Quién pide (P1) | Alumno con credencial, docente y administrativo con matrícula de trabajador: casa, fotocopia o sala. Público: solo sala o fotocopia | Tipos de usuario y modalidades permitidas, configurables |
| Ventana de recogida (P6) | 30 minutos, fija. Si la solicitud queda cerca del cierre (20:00) y no llega a tiempo, cuenta como multa | `prestamo.ventana_recogida_min` |
| Vencimiento (P7) | 10:00 del día siguiente; con suspensiones, el siguiente día hábil | `prestamo.hora_vencimiento` y calendario |
| Préstamo vivo (P8) | Una solicitud sin recoger cuenta (pre-préstamo); el uso en sala cuenta; máximo 3 libros por préstamo | Índice único parcial en la base; tope de 3 en el servicio |
| Libros prestados (P9) | Se puede apartar un libro que está prestado. Renovaciones: sin respuesta | Lista de espera (RF-29); renovación (RF-28) por confirmar |
| Llamados (P10) | Se avisan en la aplicación; tres equivalen a una sanción; el conteo se reinicia | `sancion.llamados_para_sancion` |
| Sanciones (P11, P12) | Duración según tabla del reglamento (tipo de usuario y modalidad). La universidad evalúa eliminar las multas. Sin sanciones económicas; si se pierde o daña un libro, se repone el mismo ejemplar u otro similar | `sancion.multas_activas`, `sancion.tabla` |
| Estado de libros (P13) | Todos en buen estado; es fácil detectar maltrato | Revisión al devolver |
| Sala (P14) | 2 horas, ampliables si nadie espera; la devolución se registra en ventanilla | `sala.horas` |
| Recoger y devolver (P15) | Solo el prestatario recoge; otra persona puede devolver, pero no se le entrega la credencial. Se entiende que la biblioteca retiene la credencial durante el préstamo (por confirmar) | `prestamo.credencial_retenida` |
| Categoría Consulta | No sale de la biblioteca; solo uso en sala. Incluye diccionarios, enciclopedias y anuarios | `categoria.permite_domicilio = false`; se puede fotocopiar (`permite_fotocopia = true`) |

Operación: horario 07:00 a 20:00, sin fines de semana, una sola biblioteca, dos ventanillas (una PC actualizada) (P3). Volumen: 20 a 30 préstamos diarios, máximo 50; hasta 5 copias por título; unos 2 000 alumnos (P2).

## Invariantes

En la base de datos: un préstamo vivo por usuario; un ejemplar en un solo ítem vivo; `numero_ficha` único y sin ruta de actualización; `numero_utm` único entre ejemplares vigentes (índice parcial). En el servicio, dentro de una transacción: máximo de libros por préstamo, ejemplar prestable según su categoría y modalidad, usuario sin sanción vigente.
