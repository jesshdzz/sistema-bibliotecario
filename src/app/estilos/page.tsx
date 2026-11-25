import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { TarjetaTitulo } from "@/components/tarjeta-titulo";
import { Alerta } from "@/components/ui/alerta";
import { Boton } from "@/components/ui/boton";
import {
  AreaTexto,
  Campo,
  Entrada,
  Grupo,
  Opcion,
  Segmentado,
  Selector,
} from "@/components/ui/campo";
import { Insignia } from "@/components/ui/insignia";
import { InsigniaEstado } from "@/components/ui/insignia-estado";
import { Seccion } from "@/components/ui/pagina";
import { Mono, Tabla } from "@/components/ui/tabla";
import { Cifra, Tarjeta, Vacio } from "@/components/ui/tarjeta";
import type { Titulo } from "@/lib/biblioteca";

// shortcut: sin datos hasta conectar la base (paso 4 de docs/spec/README.md)
const titulos: Titulo[] = [];

export default function Estilos() {
  return (
    <div>
      <Navbar />

      {/* ── Hero ── */}
      <section className="bg-neutral text-neutral-content py-20 border-b-4 border-secondary">
        <div className="contenedor">
          <p className="text-neutral-content/70 text-sm font-mono uppercase tracking-widest mb-2">
            Universidad Tecnológica de la Mixteca
          </p>
          <h1 className="font-serif text-5xl font-bold mb-4 max-w-2xl leading-tight">
            Catálogo y Servicios Bibliotecarios
          </h1>
          <p className="text-neutral-content/70 text-lg mb-8 max-w-[60ch]">
            Accede al acervo, gestiona préstamos y consulta recursos digitales
            desde un solo lugar.
          </p>
          {/* OPAC Search */}
          <div className="flex gap-2 max-w-xl">
            <Entrada
              type="text"
              tamano="lg"
              aria-label="Buscar en el catálogo"
              placeholder="Título, autor, ISBN, signatura…"
              className="flex-1"
            />
            <Boton tamano="lg">Buscar</Boton>
          </div>
        </div>
      </section>

      <main className="contenedor space-y-16 py-12">
        <Seccion titulo="Paleta semántica">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              {
                bg: "bg-primary",
                text: "text-primary-content",
                label: "primary",
              },
              {
                bg: "bg-secondary",
                text: "text-secondary-content",
                label: "secondary",
              },
              { bg: "bg-accent", text: "text-accent-content", label: "accent" },
              {
                bg: "bg-neutral",
                text: "text-neutral-content",
                label: "neutral",
              },
              { bg: "bg-info", text: "text-info-content", label: "info" },
              {
                bg: "bg-success",
                text: "text-success-content",
                label: "success",
              },
              {
                bg: "bg-warning",
                text: "text-warning-content",
                label: "warning",
              },
              { bg: "bg-error", text: "text-error-content", label: "error" },
            ].map(({ bg, text, label }) => (
              <div
                key={label}
                className={`${bg} ${text} rounded-box p-4 font-mono text-sm font-semibold`}
              >
                {label}
              </div>
            ))}
          </div>
        </Seccion>

        <Seccion titulo="Tipografía">
          <Tarjeta className="space-y-4 p-6">
            <p className="font-serif text-4xl">
              Playfair Display — Títulos editoriales
            </p>
            <p className="font-sans text-lg">
              Source Serif 4 — Texto de interfaz, cuerpo y metadatos de catálogo
            </p>
            <p className="font-mono text-sm">
              QA76.73 .P98 2026 — Signaturas topográficas · ISBN
              978-0-000-00000-0
            </p>
          </Tarjeta>
        </Seccion>

        <Seccion titulo="Botones">
          <div className="space-y-3">
            {(["solido", "contorno", "texto"] as const).map((variante) => (
              <div key={variante} className="flex flex-wrap items-center gap-3">
                {(
                  [
                    "primary",
                    "secondary",
                    "accent",
                    "error",
                    "neutral",
                  ] as const
                ).map((color) => (
                  <Boton key={color} variante={variante} color={color}>
                    {variante} {color}
                  </Boton>
                ))}
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-3">
              <Boton tamano="xs">xs</Boton>
              <Boton tamano="sm">sm</Boton>
              <Boton>md</Boton>
              <Boton tamano="lg">lg</Boton>
              <Boton disabled>Deshabilitado</Boton>
              <Boton href="/estilos" variante="contorno">
                Enlace
              </Boton>
            </div>
            <Boton anchoCompleto className="max-w-xs">
              Ancho completo
            </Boton>
          </div>
        </Seccion>

        <Seccion titulo="Insignias">
          <div className="flex flex-wrap gap-2">
            {(
              [
                "primary",
                "secondary",
                "accent",
                "info",
                "success",
                "warning",
                "error",
                "ghost",
              ] as const
            ).map((color) => (
              <Insignia key={color} color={color}>
                {color}
              </Insignia>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                "disponible",
                "apartado",
                "prestado",
                "en_sala",
                "pre_prestamo",
                "activo",
                "vencido",
                "devuelto",
              ] as const
            ).map((estado) => (
              <InsigniaEstado key={estado} estado={estado} />
            ))}
          </div>
        </Seccion>

        <Seccion titulo="Tarjetas">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Tarjeta className="p-6">Tarjeta</Tarjeta>
            <Tarjeta acento="primary" className="p-6">
              Tarjeta con acento primary
            </Tarjeta>
            <Tarjeta acento="secondary" className="p-6">
              Tarjeta con acento secondary
            </Tarjeta>
            <Cifra etiqueta="Cifra" valor={12} />
            <Cifra
              etiqueta="Cifra con enlace"
              valor={3}
              href="/estilos"
              nota="Ver detalle"
            />
          </div>
          <div className="mt-6">
            <Vacio>Estado vacío: no hay registros que mostrar.</Vacio>
          </div>
        </Seccion>

        <Seccion titulo="Tarjetas de catálogo">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {titulos.length === 0 && <Vacio>No hay títulos que mostrar.</Vacio>}
            {titulos.slice(0, 3).map((t) => (
              <TarjetaTitulo key={t.id} titulo={t} />
            ))}
          </div>
        </Seccion>

        <Seccion titulo="Alertas del sistema">
          <div className="space-y-3">
            <Alerta tono="info">
              Horario de atención: lunes a viernes de 9:00 a 20:00 h.
            </Alerta>
            <Alerta tono="success">
              Préstamo registrado correctamente. Folio:{" "}
              <Mono>BIB-2026-004821</Mono>
            </Alerta>
            <Alerta tono="warning">
              Tu ejemplar vence en 2 días. Puedes renovarlo en línea si no hay
              reservas pendientes.
            </Alerta>
            <Alerta tono="error">
              No es posible solicitar préstamos. Tienes una multa de 5 días sin
              préstamo por devolver con retraso.
            </Alerta>
          </div>
        </Seccion>

        <Seccion titulo="Formulario de búsqueda avanzada">
          <Tarjeta className="p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo etiqueta="Título">
                <Entrada type="text" placeholder="Ej. Introducción a…" />
              </Campo>
              <Campo etiqueta="Autor" ayuda="Apellido o nombre completo.">
                <Entrada type="text" placeholder="Ej. Cormen" />
              </Campo>
              <Campo etiqueta="ISBN" error="El ISBN no es válido.">
                <Entrada type="text" mono placeholder="978-…" />
              </Campo>
              <Campo etiqueta="Tipo de material">
                <Selector>
                  <option>Todos</option>
                  <option>Libro</option>
                  <option>Revista</option>
                  <option>Artículo</option>
                </Selector>
              </Campo>
              <Grupo etiqueta="Modalidad">
                <Opcion tipo="radio" etiqueta="A domicilio" name="modalidad" />
                <Opcion tipo="radio" etiqueta="En sala" name="modalidad" />
              </Grupo>
              <Campo etiqueta="Notas">
                <AreaTexto rows={3} />
              </Campo>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Opcion
                tipo="checkbox"
                etiqueta="Solo disponibles"
                defaultChecked
              />
              <Opcion tipo="checkbox" etiqueta="Acceso digital" />
              <Boton className="ml-auto">Buscar</Boton>
            </div>
          </Tarjeta>
        </Seccion>

        <Seccion titulo="Mis préstamos activos">
          <Tabla
            columnas={["Folio", "Título", "Vencimiento", "Estado", "Acciones"]}
          >
            {(
              [
                ["BIB-2026-004821", "Clean Code", "2026-11-20", "activo"],
                [
                  "BIB-2026-004755",
                  "El Nombre de la Rosa",
                  "2026-11-16",
                  "pre_prestamo",
                ],
                [
                  "BIB-2026-004601",
                  "Introducción a los Algoritmos",
                  "2026-10-30",
                  "vencido",
                ],
              ] as const
            ).map(([folio, titulo, vence, estado]) => (
              <tr key={folio}>
                <td>
                  <Mono>{folio}</Mono>
                </td>
                <td className="font-medium">{titulo}</td>
                <td className="text-sm text-base-content/70">{vence}</td>
                <td>
                  <InsigniaEstado estado={estado} />
                </td>
                <td>
                  <Boton variante="texto" tamano="xs">
                    Renovar
                  </Boton>
                </td>
              </tr>
            ))}
          </Tabla>
        </Seccion>

        <Seccion titulo="Cambiar tema">
          <p className="mb-4 text-sm text-base-content/70">
            Verifica que todos los componentes anteriores funcionen en ambos
            temas sin clases <code className="font-mono">dark:</code>.
          </p>
          {/* theme-controller de DaisyUI: cambia el tema con CSS, sin JS */}
          <div className="max-w-xs">
            <Segmentado
              name="tema"
              tema
              opciones={[
                ["biblioteca-light", "Claro"],
                ["biblioteca-dark", "Oscuro"],
              ]}
            />
          </div>
        </Seccion>
      </main>

      <Footer />
    </div>
  );
}
