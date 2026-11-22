import { Campo } from "@/components/campo";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { TarjetaTitulo } from "@/components/tarjeta-titulo";
import type { Titulo } from "@/lib/biblioteca";

// shortcut: sin datos hasta conectar la base (paso 4 de docs/spec/README.md)
const titulos: Titulo[] = [];

export default function Estilos() {
  return (
    <div>
      <Navbar />

      {/* ── Hero ── */}
      <section className="bg-neutral text-neutral-content py-20 border-b-4 border-secondary">
        <div className="max-w-340 mx-auto px-4 sm:px-6 lg:px-8">
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
            <input
              type="text"
              aria-label="Buscar en el catálogo"
              placeholder="Título, autor, ISBN, signatura…"
              className="input input-lg flex-1 bg-base-100 text-base-content border-base-300"
            />
            <button type="button" className="btn btn-primary btn-lg">
              Buscar
            </button>
          </div>
        </div>
      </section>

      <main className="max-w-340 mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* ── Colores semánticos ── */}
        <section>
          <h2 className="font-serif text-3xl font-bold mb-6">
            Paleta semántica
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
        </section>

        {/* ── Tipografía ── */}
        <section>
          <h2 className="font-serif text-3xl font-bold mb-6">Tipografía</h2>
          <div className="bg-base-100 border border-base-300 rounded-box p-6 space-y-4">
            <p className="font-serif text-4xl">
              Playfair Display — Títulos editoriales
            </p>
            <p className="font-sans text-lg">
              Inter — Texto de interfaz, cuerpo y metadatos de catálogo
            </p>
            <p className="font-mono text-sm">
              QA76.73 .P98 2026 — Signaturas topográficas · ISBN
              978-0-000-00000-0
            </p>
          </div>
        </section>

        {/* ── Buttons ── */}
        <section>
          <h2 className="font-serif text-3xl font-bold mb-6">Botones</h2>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary">
              Solicitar préstamo
            </button>
            <button type="button" className="btn btn-secondary">
              Colección especial
            </button>
            <button type="button" className="btn btn-accent">
              Leer en línea
            </button>
            <button type="button" className="btn btn-neutral">
              Neutro
            </button>
            <button type="button" className="btn btn-ghost">
              Fantasma
            </button>
            <button type="button" className="btn btn-outline btn-primary">
              Contorno
            </button>
            <button type="button" className="btn btn-primary" disabled>
              Deshabilitado
            </button>
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            <button type="button" className="btn btn-info btn-sm">
              Info
            </button>
            <button type="button" className="btn btn-success btn-sm">
              Préstamo confirmado
            </button>
            <button type="button" className="btn btn-warning btn-sm">
              Vence pronto
            </button>
            <button type="button" className="btn btn-error btn-sm">
              No disponible
            </button>
          </div>
        </section>

        {/* ── Cards de catálogo ── */}
        <section>
          <h2 className="font-serif text-3xl font-bold mb-6">
            Tarjetas de catálogo
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {titulos.length === 0 && (
              <p className="tarjeta p-6 text-base-content/70">
                No hay títulos que mostrar.
              </p>
            )}
            {titulos.slice(0, 3).map((t) => (
              <TarjetaTitulo key={t.id} titulo={t} />
            ))}
          </div>
        </section>

        {/* ── Alertas / Estados ── */}
        <section>
          <h2 className="font-serif text-3xl font-bold mb-6">
            Alertas del sistema
          </h2>
          <div className="space-y-3">
            <div role="alert" className="alert alert-info">
              <span>
                Horario de atención: lunes a viernes de 9:00 a 20:00 h.
              </span>
            </div>
            <div role="alert" className="alert alert-success">
              <span>
                Préstamo registrado correctamente. Folio:{" "}
                <span className="font-mono">BIB-2026-004821</span>
              </span>
            </div>
            <div role="alert" className="alert alert-warning">
              <span>
                Tu ejemplar vence en 2 días. Puedes renovarlo en línea si no hay
                reservas pendientes.
              </span>
            </div>
            <div role="alert" className="alert alert-error">
              <span>
                No es posible solicitar préstamos. Tienes una multa de 5 días
                sin préstamo por devolver con retraso.
              </span>
            </div>
          </div>
        </section>

        {/* ── Formulario ── */}
        <section>
          <h2 className="font-serif text-3xl font-bold mb-6">
            Formulario de búsqueda avanzada
          </h2>
          <div className="bg-base-100 border border-base-300 rounded-box p-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <Campo etiqueta="Título">
                <input
                  type="text"
                  placeholder="Ej. Introducción a…"
                  className="input w-full"
                />
              </Campo>
              <Campo etiqueta="Autor">
                <input
                  type="text"
                  placeholder="Ej. Cormen"
                  className="input w-full"
                />
              </Campo>
              <Campo etiqueta="ISBN">
                <input
                  type="text"
                  placeholder="978-…"
                  className="input w-full font-mono"
                />
              </Campo>
              <Campo etiqueta="Tipo de material">
                <select className="select w-full">
                  <option>Todos</option>
                  <option>Libro</option>
                  <option>Revista</option>
                  <option>Artículo</option>
                </select>
              </Campo>
            </div>
            <div className="mt-4 flex gap-3 items-center flex-wrap">
              <label className="flex gap-2 items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                  defaultChecked
                />
                <span className="text-sm">Solo disponibles</span>
              </label>
              <label className="flex gap-2 items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                />
                <span className="text-sm">Acceso digital</span>
              </label>
              <button type="button" className="btn btn-primary ml-auto">
                Buscar
              </button>
            </div>
          </div>
        </section>

        {/* ── Tabla de préstamos ── */}
        <section>
          <h2 className="font-serif text-3xl font-bold mb-6">
            Mis préstamos activos
          </h2>
          <div className="bg-base-100 border border-base-300 rounded-box overflow-x-auto">
            <table className="table">
              <thead className="bg-base-300">
                <tr>
                  <th>Folio</th>
                  <th>Título</th>
                  <th>Vencimiento</th>
                  <th>Estado</th>
                  <th>
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    folio: "BIB-2026-004821",
                    titulo: "Clean Code",
                    vence: "2026-11-20",
                    estado: "Activo",
                    color: "badge-success",
                  },
                  {
                    folio: "BIB-2026-004755",
                    titulo: "El Nombre de la Rosa",
                    vence: "2026-11-16",
                    estado: "Por vencer",
                    color: "badge-warning",
                  },
                  {
                    folio: "BIB-2026-004601",
                    titulo: "Introducción a los Algoritmos",
                    vence: "2026-10-30",
                    estado: "Vencido",
                    color: "badge-error",
                  },
                ].map((row) => (
                  <tr key={row.folio}>
                    <td>
                      <span className="font-mono text-[13px]">{row.folio}</span>
                    </td>
                    <td className="font-sans font-medium">{row.titulo}</td>
                    <td className="text-base-content/70 text-sm">
                      {row.vence}
                    </td>
                    <td>
                      <span className={`badge ${row.color} badge-sm`}>
                        {row.estado}
                      </span>
                    </td>
                    <td>
                      <button type="button" className="btn btn-ghost btn-xs">
                        Renovar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Theme switcher ── */}
        <section>
          <h2 className="font-serif text-3xl font-bold mb-4">Cambiar tema</h2>
          <p className="text-base-content/70 text-sm mb-4">
            Verifica que todos los componentes anteriores funcionen en ambos
            temas sin clases <code className="font-mono">dark:</code>.
          </p>
          {/* theme-controller de DaisyUI: cambia el tema con CSS, sin JS */}
          <div className="join">
            <input
              type="radio"
              name="tema"
              value="biblioteca-light"
              aria-label="Claro"
              className="btn join-item theme-controller"
            />
            <input
              type="radio"
              name="tema"
              value="biblioteca-dark"
              aria-label="Oscuro"
              className="btn join-item theme-controller"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
