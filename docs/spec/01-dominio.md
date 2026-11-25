# Dominio, modelo de datos y reglas

## Actores y roles

| Rol | Quién | Puede |
|---|---|---|
| Usuario | Cualquier persona registrada; lo que puede hacer depende de su **tipo de usuario** | Buscar, ver fichas, solicitar préstamo, ver su historial y sanciones |
| Bibliotecario | 3 personas (P32); su tipo de usuario es trabajador | Capturar y editar catálogo, operar ventanilla, sanciones, informes, configuración |
| Administrador | Administración de la biblioteca y técnico de la universidad (P30); un solo rol (Q12) | Lo del bibliotecario más la operación del sistema |
| Consulta | Vicerrectoría | Solo lectura de informes agregados |

El **tipo de usuario** es distinto del rol: `alumno` (alumno activo del padrón), `trabajador` (docente o administrativo con número de trabajador) y `publico` (cualquier otra persona, incluidos externos a la universidad). Alumno y trabajador piden libros en cualquier modalidad (P1); público solo uso en sala o fotocopia, no se lleva libros a casa (P1).

Acceso: registro e inicio de sesión normales, con correo y contraseña, como en cualquier sitio web; se permiten usuarios externos a la universidad (el acceso solo con Google Workspace no está confirmado y se descartó como requisito). Al registrarse la persona elige Alumno, Trabajador o Externo y declara sus datos (alumno: matrícula, carrera y semestre; trabajador: número de trabajador; externo: ninguno). Lo declarado queda pendiente: la cuenta sigue como **público** y lo declarado se guarda en `tipo_solicitado` hasta que el bibliotecario valide la credencial o el padrón y cambie el tipo de usuario (Q25). El rol y el tipo de usuario se guardan en la base de datos y los asigna el personal, nunca el propio usuario. Sin SMTP por ahora (Q23): no se puede depender del correo para verificar la cuenta ni para restablecer la contraseña.

## Glosario

Ver `CLAUDE.md`. Atención: "clasificación" se usa en dos sentidos en el lenguaje de la biblioteca: el **número LCC** (p. ej. `PQ2226 .C65 D8`) y el **grupo del acervo** (Consulta, Tesis, Posgrado, INEGI, Libros y revistas). En código y pantallas: `clasificacion_lcc` y `categoria`.

## Modelo de datos propuesto

El esquema inicial está en `src/db/schema/` (`auth.ts` y `dominio.ts`). Este modelo es el diseño objetivo; los nombres y columnas se ajustan al implementar. El detalle de los campos del título está en `02-catalogo-busqueda.md`.

### Estado del esquema (2026-11-22)

| Elemento | Estado |
|---|---|
| `user` con columnas de dominio (`additionalFields`), índices únicos parciales de matrícula (alumnos) y número de trabajador (trabajadores); `perfil_usuario` eliminada | Hecho |
| `categoria`, `catalogo_valor` (con el catálogo `carrera` sembrado), `titulo` con los 22 campos y `numero_ficha` inmutable, `titulo_materia`, `ejemplar` con `numero_utm` y su índice parcial, `prestamo` con `folio` y `limite_recogida`, `prestamo_item` con condición de devolución, `parametro`, `bitacora` | Hecho |
| Validación de `parametro` por clave con Zod (`src/lib/parametros.ts`) | Hecho para las claves `registro.*`; se agregan claves conforme se usan |
| `llamado_atencion`, `sancion`, `dia_no_habil` | Pendiente |
| Semilla de `categoria` y cuenta inicial del personal (administrador) | Pendiente |

### Modelo objetivo

| Tabla | Contenido principal | Notas |
|---|---|---|
| `titulo` | `numero_ficha` (identidad, único, inmutable), `categoria_id`, `tipo` (opcional), los demás campos de la ficha, `clasificacion_lcc` y `clasificacion_lcc_orden`, `capturado_por`, `creado_en`, `actualizado_en` | El tipo de material (libro, revista, artículo, tesis) asigna la categoría por defecto (Q05, Q07) |
| `titulo_materia` | Encabezamientos de materia (varios por título) | Campo repetible; puede ser un arreglo |
| `titulo_isbn` | `titulo_id`, `isbn`, `nota` (tomo, editorial, encuadernación) | MARC 020 repetible. Sin unicidad global: el sistema heredado muestra ISBN repetidos legítimos entre ediciones y colecciones (2026-11-24) |
| `ejemplar` | `titulo_id`, `numero_utm`, `volumen`, `copia`, `estado`, `capturado_por`, baja (`baja_en`, `motivo_baja`) | El UTM es el código de barras. Único entre ejemplares vigentes con índice parcial `WHERE estado <> 'baja'`; reutilizable cuando queda libre (Q02). Las bajas no se borran |
| `categoria` | `nombre` único, `permite_domicilio`, `permite_fotocopia`, `orden`, `activa` | Configurable; Consulta = solo sala, con fotocopia |
| `catalogo_valor` | `catalogo`, `codigo`, `etiqueta`, `activo`, `orden` | Idiomas, países, motivos de baja, tipos de usuario; editables |
| Columnas de dominio en `user` (sin tabla `perfil_usuario`) | `rol` (usuario, bibliotecario, administrador, consulta), `tipo_usuario` (alumno, trabajador, publico), `tipo_solicitado`, `matricula`, `carrera`, `semestre`, `numero_trabajador`, `estatus` | Un solo INSERT atómico al registrarse. Siempre nace con rol usuario y tipo público; lo declarado va en `tipo_solicitado` y los datos. Rol y tipo los asigna el personal. Matrícula única entre alumnos y número de trabajador único entre trabajadores. `carrera` guarda el código del catálogo `carrera` en `catalogo_valor`. El padrón se importa desde CSV (RF-04) |
| `prestamo` y `prestamo_item` | Folio, usuario, modalidad (casa, sala, fotocopia), estado, fechas de solicitud, límite de recogida, activación, vencimiento y devolución; ejemplares del préstamo y su condición al devolver | Préstamo vivo = `pre_prestamo`, `activo` o `vencido` |
| `llamado_atencion` y `sancion` | Usuario, motivo, fechas, quién la confirmó | Detrás de `sancion.multas_activas` |
| `parametro` | `clave`, `valor` (JSON), `actualizado_por`, `actualizado_en` | Validación por clave; ver `04-informes-configuracion.md` |
| `dia_no_habil` | Fecha y motivo | Calendario institucional para el vencimiento |
| `bitacora` | Quién, cuándo, acción, entidad, antes y después | Auditoría (RF-06) |

El UTM de un libro dado de baja: el cliente pidió listar los UTM disponibles y **reutilizar los libres** (Q02). El historial de préstamos referencia `ejemplar.id`, nunca el número. Detalle y automatización en `02-catalogo-busqueda.md`.

## Reglas de negocio confirmadas (P1–P15)

| Regla | Decisión | Dónde se aplica |
|---|---|---|
| Quién pide (P1) | Alumno con credencial y trabajador (docente o administrativo) con número de trabajador: casa, fotocopia o sala. Público: solo sala o fotocopia | Tipos de usuario y modalidades permitidas, configurables |
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
