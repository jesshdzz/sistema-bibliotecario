# Especificación funcional

Versión: 2026-11-22. Fuente: informe técnico y funcional de Fase 1 (respuestas de la universidad P1 a P33 y definición del catálogo de la biblioteca). El informe vive en el Project "Sistema Bibliotecario" de claude.ai; este directorio es la versión operativa para desarrollar.

## Índice

| Archivo | Contenido | Léelo cuando… |
|---|---|---|
| `01-dominio.md` | Roles, glosario, modelo de datos propuesto, reglas de negocio confirmadas e invariantes | diseñes datos o toques cualquier regla |
| `02-catalogo-busqueda.md` | Campos del registro, ficha bibliográfica, búsqueda, filtros, orden, MARC 21 | trabajes catálogo, captura o búsqueda |
| `03-circulacion.md` | Préstamo, ventanilla, devolución, llamados y sanciones | trabajes préstamos |
| `04-informes-configuracion.md` | Estadísticas, impresión de inventario, parámetros y catálogos configurables | trabajes informes o configuración |
| `05-requerimientos.md` | Requerimientos con prioridad y estado, y metas no funcionales | planees o priorices |
| `06-preguntas-abiertas.md` | Dudas sin resolver, con propuesta por defecto, y las ya resueltas | tu tarea dependa de algo no decidido |

## Convenciones

- **Prioridad:** M indispensable para la primera versión, S deseable, C solo si hay tiempo. Las marcadas "(propuesta)" no las ha confirmado la universidad.
- **Estado:** `pendiente`, `en curso` o `hecho`.
- **"Por confirmar":** dato no validado. Constrúyelo configurable y aislado.
- **"Verificado" / "por verificar":** en referencias a MARC 21, indica si la etiqueta se comprobó en la documentación oficial de la Library of Congress (https://www.loc.gov/marc/bibliographic/).
- Nombres en español: tablas y columnas en `snake_case` (`numero_ficha`), TypeScript en `camelCase` (`numeroFicha`).

## Punto de partida

El proyecto es un prototipo de interfaz (componentes y vistas para mostrar el diseño al cliente). Ya están hechos: el esquema adaptado a esta spec en `src/db/schema/` (salvo sanciones y calendario), el registro e inicio de sesión con correo y contraseña (con límite de intentos), los parámetros `registro.*` validados con Zod y el catálogo `carrera`. El panel `/admin` exige rol de personal. Las demás vistas siguen con datos de ejemplo y no hay lógica de negocio. `01-dominio.md` indica qué falta del esquema.

## Orden de implementación sugerido

1. **Datos y acceso** (en curso; falta RF-03 completo, RF-04, RF-05, RF-56 y la validación de RF-57): adaptar el esquema inicial, registro e inicio de sesión con correo y contraseña, roles, tipo de usuario y padrón de alumnos (RF-01, RF-03, RF-04, RF-56, RF-57).
2. **Configuración base:** tabla `parametro` con validación por clave, catálogos y pantalla mínima (RF-26, RF-54). Todo lo siguiente la consume.
3. **Catálogo:** captura con ficha y UTM, ejemplares y categorías (RF-44 a RF-48).
4. **Búsqueda y ficha bibliográfica** (RF-49 a RF-51), reemplazando los datos de ejemplo de las vistas del prototipo.
5. **Circulación:** pre-préstamo, ventanilla, devolución (RF-18 a RF-25).
6. **Llamados y sanciones** (RF-30 a RF-35), sujetos a la decisión sobre multas.
7. **Informes e impresión de inventario** (RF-38, RF-39, RF-52, RF-53).
8. Importación masiva del acervo heredado (RF-12), cuando llegue la base heredada.

Las preguntas Q01 a Q08 están resueltas (sección "Resueltas" de `06-preguntas-abiertas.md`). Antes del punto 3, revisa Q09 a Q17 y fija por defecto lo que falte.
