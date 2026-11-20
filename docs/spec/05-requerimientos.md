# Requerimientos

Prioridad: M indispensable, S deseable, C solo si hay tiempo. Estado: pendiente, en curso o hecho (todo está pendiente salvo el prototipo de interfaz, que no tiene lógica). Los ID se conservan de la versión del informe: hay saltos en la numeración y no se reutilizan (RF-56 y RF-57 son nuevos). Las prioridades de RF-51 a RF-53 son propuesta.

## Cuentas y seguridad

| ID | Requerimiento | Prio | Estado |
|---|---|---|---|
| RF-01 | Registro e inicio de sesión con correo y contraseña, como un sitio web normal; se permiten usuarios externos a la universidad (el acceso solo con Google no está confirmado). Google puede añadirse como método adicional (Q24) | M | pendiente |
| RF-03 | Roles: alumno, bibliotecario, administrador de biblioteca, consulta (solo lectura) y administrador técnico | M | pendiente |
| RF-04 | Importar el padrón de alumnos desde CSV (activo o baja) y actualizarlo cada semestre; lo entrega servicios escolares | M | pendiente |
| RF-05 | Alta, baja y restablecimiento de cuentas del personal por el administrador | M | pendiente |
| RF-56 | Restablecer la contraseña de un usuario: por correo si hay SMTP (Q23); si no, lo hace un bibliotecario en ventanilla | M | pendiente |
| RF-57 | Todo usuario nuevo queda como público; el bibliotecario lo cambia a alumno o docente al validar su credencial o contra el padrón (propuesta, Q25) | M | pendiente |
| RF-06 | Bitácora de auditoría: préstamos, devoluciones, sanciones, ediciones, bajas y cambios de configuración | M | pendiente |

## Catálogo y ejemplares

| ID | Requerimiento | Prio | Estado |
|---|---|---|---|
| RF-09 | Modelo de título y ejemplar: varios ejemplares por título, cada uno con UTM único (el UTM es el código de barras) | M | pendiente |
| RF-10 | Alta con autocompletado por ISBN desde una fuente externa; solo rellena lo que encuentre y permite corregir | M | pendiente |
| RF-11 | Alta totalmente manual (sin ISBN o no encontrado); obligatoria (P28) | M | pendiente |
| RF-12 | Captura rápida e importación masiva desde CSV con los campos de la ficha, para migrar el acervo | M | pendiente |
| RF-13 | Validación de ISBN (dígito verificador) y detección de UTM duplicados | M | pendiente |
| RF-14 | Estados del ejemplar: disponible, apartado, prestado, en sala, no disponible, baja | M | pendiente |
| RF-15 | Historial de cambios de cada título y ejemplar | S | pendiente |
| RF-16 | Toma de inventario físico: escanear estantes y conciliar, con reporte de faltantes | S | pendiente |
| RF-17 | Generar e imprimir etiquetas con el UTM como código de barras | C | pendiente |
| RF-44 | Formulario de captura con los 22 campos de la ficha (`02-catalogo-busqueda.md`), con bibliotecario y fecha automáticos | M | pendiente |
| RF-45 | Número de ficha generado por el sistema, único por título e inmutable | M | pendiente |
| RF-46 | Número UTM por ejemplar: manual, único entre vigentes y editable; sugerencia, lista de libres y reutilización de los libres; informe de huecos y retirados | M | pendiente |
| RF-47 | Categorías configurables (Consulta, Tesis, Posgrado, INEGI, Libros y revistas) con indicadores de préstamo a domicilio y de fotocopia; Consulta solo se usa en sala (se puede fotocopiar) | M | pendiente |
| RF-48 | Clasificación LCC guardada con clave de orden y búsqueda por prefijo | M | pendiente |

## Búsqueda y ficha

| ID | Requerimiento | Prio | Estado |
|---|---|---|---|
| RF-49 | Búsqueda por autor, clasificación, categoría, ISBN, título y número UTM; por fecha de captura y número de ficha solo para bibliotecarios; tolerante a acentos y errores de escritura | M | pendiente |
| RF-50 | Filtros y ordenamientos sobre los resultados | M | pendiente |
| RF-51 | Ficha bibliográfica en el orden definido por la biblioteca (13 elementos) | M (propuesta) | pendiente |

## Circulación

| ID | Requerimiento | Prio | Estado |
|---|---|---|---|
| RF-18 | Solicitud en línea eligiendo modalidad (casa o sala), con cuenta regresiva de 30 minutos | M | pendiente |
| RF-19 | Apartado del ejemplar y liberación automática al vencer la ventana | M | pendiente |
| RF-20 | Evitar doble apartado del mismo ejemplar y más de un préstamo vivo por alumno | M | pendiente |
| RF-21 | El alumno puede cancelar su solicitud antes de recoger | M | pendiente |
| RF-22 | Ventanilla: buscar por matrícula o folio, validar credencial, escanear el ejemplar (debe coincidir con el apartado) y activar el préstamo | M | pendiente |
| RF-23 | Préstamo directo en mostrador, sin solicitud previa | S | pendiente |
| RF-24 | Devolución por escaneo con revisión de estado (bueno o dañado, con nota) | M | pendiente |
| RF-25 | Fecha de vencimiento automática según reglas y calendario institucional configurable | M | pendiente |
| RF-26 | Parámetros editables sin tocar código (ver RF-54) | M | pendiente |
| RF-27 | Impresión y reimpresión del ticket; la copia por correo depende de contar con SMTP (Q23) | M | pendiente |
| RF-28 | Renovación de préstamos (sin respuesta de la universidad) | C | pendiente |
| RF-29 | Lista de espera para libros prestados (la universidad dijo que sí se puede apartar un libro prestado) | C (confirmar, Q21) | pendiente |

## Sanciones

Todo el bloque depende de `sancion.multas_activas` (Q20).

| ID | Requerimiento | Prio | Estado |
|---|---|---|---|
| RF-30 | Registrar llamados de atención y llevar el conteo por alumno (tres = una sanción; se reinicia) | M | pendiente |
| RF-31 | Aplicar la sanción automáticamente al tercer llamado, con duración configurable | M | pendiente |
| RF-32 | Sanciones por retraso y por daño, propuestas por el sistema y confirmadas por el bibliotecario | M | pendiente |
| RF-33 | Encadenar sanciones, mostrar cuándo termina la última y bloquear solicitudes mientras haya una vigente | M | pendiente |
| RF-34 | El alumno ve sus sanciones, el motivo y cuándo terminan | M | pendiente |
| RF-35 | Condonar o ajustar una sanción con motivo, rol autorizado y bitácora | S | pendiente |

## Notificaciones

| ID | Requerimiento | Prio | Estado |
|---|---|---|---|
| RF-36 | Correo para confirmar solicitud, ventana por vencer, llamado, vencimiento y sanción. **Sin SMTP por ahora**; se retoma si TI ofrece uno (Q23) | M → por confirmar | pendiente |
| RF-37 | Avisos dentro de la aplicación con el mismo contenido (hoy son el canal principal; P10) | M (sube de S por no haber SMTP) | pendiente |

## Informes y configuración

| ID | Requerimiento | Prio | Estado |
|---|---|---|---|
| RF-38 | Panel con préstamos por periodo, más solicitados, sin movimiento, por carrera, no recogida, devoluciones tardías, sanciones e inventario por estado | M | pendiente |
| RF-39 | Filtros por periodo, carrera y semestre; exportación a PDF, Excel y CSV | M | pendiente |
| RF-40 | Informes para vicerrectoría agregados y sin datos personales por defecto | S | pendiente |
| RF-41 | Historial de préstamos de cada alumno, visible para él y para el bibliotecario | M | pendiente |
| RF-52 | Estadísticas e informes mensuales y anuales sobre préstamos, libros, usuarios y más | M (propuesta) | pendiente |
| RF-53 | Impresión del inventario con filtros, selección de columnas y orden | M (propuesta) | pendiente |
| RF-54 | Sección de configuración para bibliotecarios: parámetros y catálogos editables, con validación y bitácora | M | pendiente |

## Continuidad

| ID | Requerimiento | Prio | Estado |
|---|---|---|---|
| RF-42 | Registro posterior de préstamos hechos en papel durante una caída, conservando la fecha y hora reales | S | pendiente |
| RF-43 | Exportación completa de los datos en formato abierto en cualquier momento | M | pendiente |

## Metas no funcionales (hipótesis a calibrar)

- Compatibilidad: últimas 2 versiones de Chrome, Edge, Firefox y Safari (escritorio y móvil); responsivo desde 360 px.
- Rendimiento: carga inicial menor a 3 s con 2 Mbps; búsqueda menor a 1 s en el percentil 95; pruebas de carga con 3 veces el pico estimado (50 préstamos diarios).
- Disponibilidad: 99 % mensual en horario de atención, con procedimiento de contingencia (se avisa al técnico, P31).
- Integridad: préstamos atómicos; reglas críticas también en la base de datos; cero dobles asignaciones en pruebas de concurrencia.
- Seguridad: registro e inicio de sesión con contraseña (usar el mecanismo de hash de Better Auth, verificado en su documentación), límite de intentos y de registros por IP, longitud mínima de contraseña, sin privilegios por autoregistro (el rol y el tipo de usuario los asigna el personal); TOTP para el personal por decidir; sesiones con cookie HttpOnly; protección OWASP Top 10; HTTPS; secretos fuera del repositorio; auditoría de dependencias.
- Privacidad: sin CURP, aviso de privacidad, acceso por rol; la universidad es pública, el área jurídica confirma la ley aplicable (P19).
- Respaldo: diario, copia fuera del servidor, restauración probada cada mes; pérdida máxima 24 h, recuperación en 4 h.
- Usabilidad: ventanilla con foco permanente en el campo de escaneo y operación con teclado; préstamo en menos de 30 s tras identificar al alumno; WCAG 2.1 AA; español de México.
- Mantenibilidad: TypeScript estricto, migraciones versionadas, cobertura de al menos 70 % en reglas de negocio.
- Salida de datos: CSV de importación y exportación; exportación completa en formato abierto.
