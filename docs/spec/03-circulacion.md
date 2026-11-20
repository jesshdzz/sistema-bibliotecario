# Circulación: préstamos, devoluciones y sanciones

Reglas confirmadas y parámetros en `01-dominio.md`. Todo valor numérico sale de `parametro`; aquí solo se describe el flujo.

## Estados

- Préstamo: `pre_prestamo` → `activo` → `vencido` → `devuelto`; `cancelado` desde `pre_prestamo`. "Vivo" = `pre_prestamo`, `activo` o `vencido`.
- Ejemplar: `disponible`, `apartado`, `prestado`, `en_sala`, `no_disponible`, `baja`. El sistema asigna `apartado`, `prestado` y `en_sala`; el bibliotecario marca `no_disponible` (reparación o revisión) o `baja` (con motivo).

## Flujo

1. **Solicitud (alumno).** Busca, abre la ficha y elige modalidad (casa o sala). Se crea un `pre_prestamo` con hasta 3 ejemplares y una ventana de recogida de 30 minutos con cuenta regresiva. Los ejemplares pasan a `apartado`. Si un ejemplar es de una categoría que no permite domicilio (Consulta), solo se ofrece sala. Si el usuario ya tiene un préstamo vivo o una sanción vigente, no puede solicitar.
2. **Vencimiento de la ventana.** Si no recoge a tiempo, el préstamo se cancela, los ejemplares se liberan y se registra un llamado de atención (tres llamados = una sanción). Esto lo ejecuta una tarea programada del servidor (cron o systemd llamando a una ruta protegida), sin librería de colas.
3. **Ventanilla (bibliotecario).** Busca por matrícula o folio, valida la credencial (QR con matrícula, carrera, semestre, estado y vigencia; P18), escanea el ejemplar físico, que debe coincidir con el apartado, y activa el préstamo. La biblioteca retiene la credencial durante el préstamo. Se imprime el ticket.
4. **Préstamo directo.** Sin solicitud previa, en mostrador (RF-23).
5. **Devolución.** Por escaneo del ejemplar, con revisión de estado (bueno o dañado, con nota). Otra persona puede devolver, pero no recibe la credencial; el prestatario debe ir por ella (P15). Vence a las 10:00 del día siguiente (o siguiente día hábil).
6. **Sala.** 2 horas, ampliables si nadie espera; la devolución se registra en ventanilla (P14).

Toda operación registra automáticamente al bibliotecario que la hizo, por su sesión (no se le pide en cada operación) y entra a la bitácora.

## Reglas que exigen cuidado

- Concurrencia: dos alumnos que apartan el mismo ejemplar a la vez, o dos solicitudes del mismo alumno. Las garantizan los índices únicos parciales; el servicio debe manejar el error de violación de unicidad y responder con un mensaje claro.
- El tope de 3 libros por préstamo y la regla de la categoría se validan en el servicio, en la misma transacción que crea el préstamo.
- Fechas en UTC; el cálculo de vencimiento usa el calendario institucional (días hábiles, suspensiones) en `America/Mexico_City` (RF-25).
- Fotocopia es una modalidad de uso, junto con casa y sala. Consulta sí se puede fotocopiar porque la fotocopiadora está dentro de la biblioteca (Q06, resuelta); cada categoría tiene `permite_fotocopia` configurable.

## Llamados y sanciones

- Llamado de atención: por no recoger a tiempo, entre otras causas (por definir con el reglamento). Se avisa dentro de la aplicación (P10). Tres llamados generan una sanción y el conteo se reinicia.
- Duración de la sanción: de la tabla del reglamento (tipo de usuario y modalidad). Estructura propuesta en `parametro` (`sancion.tabla`); la tabla real aún no se tiene.
- La universidad evalúa **eliminar las multas** por la baja demanda (P11). Por eso todo el módulo de sanciones va detrás del parámetro `sancion.multas_activas` (Q20): si está en falso, no se crean sanciones, pero el historial de llamados y la reposición de libros perdidos o dañados (P12) siguen existiendo.
- Mientras haya una sanción vigente, el usuario no puede solicitar libros. Las sanciones se encadenan y se muestra cuándo termina la última. Condonar o ajustar exige motivo, rol autorizado y bitácora.
- No hay sanciones económicas: si se pierde o daña un libro, el prestatario repone el mismo ejemplar u otro similar. Regístralo como un estado del préstamo o de la sanción, sin montos.

## Pendiente de definir

Renovaciones (sin respuesta, RF-28), lista de espera para libros prestados (se dijo que sí es posible apartarlos, RF-29), correo electrónico (Q23) y los motivos exactos que generan un llamado.
