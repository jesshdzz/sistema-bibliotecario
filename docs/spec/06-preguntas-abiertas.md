# Preguntas abiertas

Cada pregunta trae una **propuesta por defecto** para poder avanzar sin inventar: constrúyela aislada y configurable, y márcala en tu respuesta. Cuando el cliente responda, actualiza este archivo (mueve la pregunta a "Resueltas" con la fecha) y la spec que corresponda.

## Catálogo (pendientes, pueden esperar)

**Q09. Formato del número LCC.** Ejemplos del cliente: `PQ2226`, `C65`, `D8`. Por defecto: un campo de texto con validación laxa y clave de orden.

**Q10. Campos obligatorios del formulario.** La lista del cliente terminaba con un renglón vacío: ¿faltaba un campo? Por defecto: obligatorios título, categoría y un ejemplar; configurable.

**Q11. Idiomas y países: lista cerrada con códigos MARC o texto libre.** Por defecto: catálogos editables, sin códigos.

**Q13. Informes: lista exacta de estadísticas y plantilla de impresión del inventario (encabezado, logotipo).** Por defecto: los de `04-informes-configuracion.md`.

**Q14. ¿Una o varias categorías por título?** Por defecto: una.

**Q15. Encabezamientos de materia: ¿vocabulario controlado (por ejemplo LCSH) o texto libre?** Por defecto: texto libre con autocompletado de los ya usados.

**Q16. ¿Qué ve el alumno?** Número de ficha, UTM y campos internos. Por defecto: el alumno ve la ficha completa de la lista de 13 elementos; el UTM de cada ejemplar solo lo ve el bibliotecario, aunque pueda buscar por UTM.

**Q17. "Pie de imprenta" frente a editorial, país y fecha.** La ficha muestra "Lugar, editorial y año". Por defecto: guardar lugar, editorial y fecha por separado y componer el pie de imprenta; permitir sobrescribirlo con texto libre.

## Generales (siguen abiertas)

**Q19. Licencia del código.** La universidad dijo "abierta y libre" (P30), sin especificar. Por defecto: sin archivo LICENSE hasta decidirlo.

**Q20. ¿Se eliminan las multas?** Por defecto: el módulo de sanciones detrás de `sancion.multas_activas`, activado.

**Q21. Prioridad de RF-28 (renovaciones) y RF-29 (lista de espera).** Por defecto: C.

**Q22. Hardware de lectura.** La credencial trae QR; los lectores Honeywell MS9520 existentes tienen el cable dañado y, según lo investigado, solo leen 1D (confirmar con el fabricante). La impresora Epson TM-U210D ya no funciona. Por defecto: no depender de ningún lector concreto; el campo de escaneo acepta texto y el lector se resuelve después (posible lectura con cámara).

**Q23. Correo electrónico (SMTP).** Ahora pesa más: con registro propio, el correo serviría para verificar cuentas y restablecer contraseñas, además de los avisos. Por defecto: sin correo; cuentas sin verificar (sin privilegios hasta que el bibliotecario valide), restablecimiento de contraseña en ventanilla y avisos dentro de la aplicación.

**Q24. ¿Se ofrece también el inicio de sesión con Google?** No se confirmó el acceso solo con Google Workspace y habrá usuarios externos. Por defecto: solo correo y contraseña; Google como método adicional queda fuera hasta decidirlo.

**Q25. ¿Cómo se acredita que un usuario es alumno o trabajador?** Por defecto: el registro declara el tipo y los datos, pero la cuenta es pública hasta que el bibliotecario valide la credencial en ventanilla (o el correo institucional contra el padrón) y cambie el tipo de usuario. Pendiente de confirmar con el cliente; el mecanismo ya está decidido (2026-11-21).

## Migración del sistema heredado (para la próxima visita)

Base entregada: `biblioteca_20261119.sql` (PostgreSQL 8.2, sin claves ni restricciones, texto Latin-1 en mayúsculas, sin tabla de usuarios). Decisiones del equipo (2026-11-24): la primera fase migra solo libros (títulos, ejemplares, materias, notas, tesis) con un ETL repetible en el repositorio que pasa por un esquema `legacy`; se conserva el folio como `numero_ficha`; el texto se convierte de mayúsculas; `tipo_autor` queda nulo; no se migran credenciales (el personal crea cuenta nueva).

**Q26. Prefijo `CD` en la clasificación (209 títulos) y columna `adicional` (`C`, `V`, `S`, `CD`, `NINGUNO`).** Los prefijos `T`, `I`, `C` y `P` corresponden a Tesis, INEGI, Consulta y Posgrado. Por defecto: `CD` = libro con material anexo, categoría Libros y revistas; `adicional` pasa a notas generales.

**Q27. UTM repetidos: 73 números en 146 ejemplares.** Por defecto: esos ejemplares quedan fuera de la migración y se entrega un CSV de conflictos para que la biblioteca asigne el UTM correcto.

**Q28. Estado real de los ejemplares.** El sistema heredado no registra bajas; 671 préstamos apuntan a UTM que ya no existen y 64 títulos no tienen ejemplares. ¿Hay inventario reciente? Por defecto: todos entran como `disponible`.

**Q29. Historial de préstamos (338 573 devoluciones, 2003–2025, solo con matrícula).** ¿Se conserva? ¿Cuántos años? ¿Anonimizado? Por defecto: no se migra hasta decidirlo; el dump se resguarda fuera del repositorio.

**Q30. Significado de los códigos heredados.** `tipo_usu` 1–4, `tipo_prest` 0–2, `prestamos.status` 3 y la tabla `cargos`. Por defecto (deducido de los datos, sin confirmar): `tipo_usu` 1 alumno, 2 profesor, 3 externo; `tipo_prest` 1 sala, 2 domicilio; `status` 3 apartado sin recoger.

**Q31. Obtención del ejemplar (compra, donación, reposición; 11 400 con dato).** ¿Se conserva? Por defecto: sí, como catálogo editable `obtencion`.

**Q32. Revistas: 1 020 títulos, 13 953 números, 110 163 artículos.** ¿Se migran los artículos? ¿Con qué UTM se prestan los números? Hoy su número de edición choca con 13 783 UTM de libros. Por defecto: segunda fase.

**Q33. Material audiovisual (1 669 CD, VHS y DVD) y material anexo de los libros.** ¿Sigue en uso? Por defecto: fuera del alcance.

**Q34. Fecha de corte.** El catálogo heredado se sigue capturando (última ficha: 2026-07-03). ¿Cuándo se deja de usar? Por defecto: el ETL se repite hasta el corte.

**Q35. Bibliotecarios e iniciales.** El historial usa iniciales (`JOR`, `RGG`…) de más de 15 personas. ¿Quiénes siguen activos? Por defecto: `capturado_por` nulo en lo migrado.

**Q36. ISBN inválidos y fichas duplicadas.** 525 fichas tienen un ISBN que falla el dígito verificador o no se puede leer; 5 grupos (12 fichas) tienen mismo título, edición e ISBN. Por defecto: se migran tal cual y se entrega un CSV para revisión (sin consultar servicios externos). Los ISBN repetidos entre ediciones o colecciones y los títulos con varios ISBN son legítimos y se modelan con `titulo_isbn` (decisión del equipo, 2026-11-24).

**Q37. Carreras de las tesis.** Equivalencias propuestas de los 15 códigos heredados al catálogo `carrera`; las maestrías y el doctorado pasan a `POS`; 92 tesis no tienen carrera. Por defecto: esa equivalencia, sin carrera donde falte.

## Resueltas

| Fecha | Pregunta | Respuesta |
|---|---|---|
| 2026-11-21 | Roles | `usuario`, `bibliotecario`, `administrador` (administrador de biblioteca y técnico juntos) y `consulta` (Vicerrectoría, solo lectura de informes agregados); `alumno` pasa a `usuario` |
| 2026-11-21 | Tipos de usuario | `alumno`, `trabajador` (antes `docente`) y `publico`; un bibliotecario tiene rol bibliotecario y tipo trabajador |
| 2026-11-21 | Perfil de usuario | Se elimina `perfil_usuario`: sus datos son columnas de `user` (`additionalFields` de Better Auth) para que el registro sea un solo INSERT atómico |
| 2026-11-21 | Registro | La persona elige Alumno, Trabajador o Externo y declara matrícula, carrera y semestre, o número de trabajador; la cuenta sigue como público y lo declarado se guarda en `tipo_solicitado` hasta la validación del bibliotecario (RF-57). La carrera se elige de un catálogo y el semestre máximo depende de la carrera |
| 2026-11-21 | Carreras en el registro | Catálogo editable `carrera` en `catalogo_valor` (se guarda el código); semestre máximo por carrera en el parámetro `registro.semestre_max` (10 por defecto, Posgrado 4) |
| 2026-11-21 | Q25. Validación previa al registro | Mientras no haya padrón, el correo institucional es la única validación previa: alumno `@gs.utm.mx`, trabajador `@gs.utm.mx` o `@mixteco.utm.mx`, externo cualquiera (parámetros `registro.dominios_*`) |
| 2026-11-21 | Q12 | Un solo rol `administrador` |
| 2026-11-20 | Q18. Acceso de emergencia si Google falla | Ya no aplica: el inicio de sesión es propio y no depende de Google |
| 2026-11-19 | Formato de los registros bibliográficos | MARC 21, solo como estructura (Q08) |
| 2026-11-19 | Sistema de clasificación | LCC, asignada a mano |
| 2026-11-19 | Categorías del acervo | Consulta, Tesis, Posgrado, INEGI, Libros y revistas |
| 2026-11-19 | ¿Consulta se presta a domicilio? | No, solo uso en biblioteca |
| 2026-11-19 | Q01. ¿El UTM reemplaza al código de barras? | El UTM es el código de barras que asignan los bibliotecarios. Un solo identificador por ejemplar; formato por definir |
| 2026-11-19 | Q02. ¿Qué se espera al "automatizar" el UTM? | Sugerir el número al cargar un libro, listar los UTM disponibles y reutilizar los libres |
| 2026-11-19 | Q03 y Q04. UTM por ejemplar; volúmenes y copias | Un título tiene un solo número de ficha; cada libro, copia, ejemplar o volumen tiene su propio UTM único |
| 2026-11-19 | Q05. ¿"Es tesis" equivale a la categoría Tesis? | Sí: al marcarla pasa a Tesis; lo mismo con revistas, artículos y las demás categorías |
| 2026-11-19 | Q06. ¿Qué categorías no salen a domicilio y qué pasa con la fotocopia? | Por ahora solo Consulta, pero puede cambiar; Consulta se puede fotocopiar (la fotocopiadora está en la biblioteca). Los bibliotecarios deben poder configurarlo |
| 2026-11-19 | Q07. ¿Se conserva el tipo de material? | "Podría ser": se conserva como dato opcional |
| 2026-11-19 | Q08. MARC 21: ¿importar o exportar? | Solo seguir la estructura; sin importar ni exportar MARC (RF-55 descartado) |
