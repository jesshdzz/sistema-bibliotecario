import Form from "next/form";
import Link from "next/link";
import { Papeleta } from "@/components/papeleta";
import { TarjetaTitulo } from "@/components/tarjeta-titulo";
import { Boton } from "@/components/ui/boton";
import { Entrada } from "@/components/ui/campo";
import { Seccion } from "@/components/ui/pagina";
import { Vacio } from "@/components/ui/tarjeta";
import {
  ESTADOS_VIVOS,
  type Prestamo,
  TIPOS,
  type Titulo,
} from "@/lib/biblioteca";
import { usuarioSesion } from "@/lib/sesion";

const PASOS = [
  [
    "Busca y solicita",
    "Encuentra el material en el catálogo y solicita el préstamo en línea.",
  ],
  [
    "Recoge en el mostrador",
    "Pasa por él al mostrador con tu credencial vigente antes de que termine el plazo de recogida.",
  ],
  [
    "Devuelve o renueva",
    "Entrégalo antes de la fecha de vencimiento o renuévalo desde tu cuenta.",
  ],
];

export default async function Inicio() {
  const usuario = await usuarioSesion();
  // shortcut: sin datos hasta conectar la base
  const prestamos: Prestamo[] = [];
  const titulos: Titulo[] = [];
  const vivo = prestamos.find((p) => ESTADOS_VIVOS.includes(p.estado));

  return (
    <>
      <section className="bg-hero-background text-neutral-content">
        <div className="contenedor grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_360px]">
          <div>
            <h1 className="max-w-[18ch] text-4xl font-bold leading-tight sm:text-5xl">
              Busca en el catálogo bibliográfico
            </h1>
            <p className="mt-4 max-w-[56ch] text-lg text-neutral-content/80">
              Libros, revistas y artículos de la universidad. Solicita tu
              préstamo en línea y recoge el material en el mostrador.
            </p>
            <Form
              action="/catalogo"
              className="mt-8 flex max-w-2xl flex-col gap-2 sm:flex-row"
            >
              <Entrada
                type="search"
                name="q"
                tamano="lg"
                aria-label="Buscar en el catálogo"
                placeholder="Título, autor, ISBN o signatura"
                className="w-full min-w-0 sm:flex-1"
              />
              <Boton type="submit" color="secondary" tamano="lg">
                Buscar
              </Boton>
            </Form>
            <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
              <span className="text-neutral-content/80">
                Explorar por tipo:
              </span>
              {Object.entries(TIPOS).map(([tipo, etiqueta]) => (
                <Link
                  key={tipo}
                  href={`/catalogo?tipo=${tipo}`}
                  className="link"
                >
                  {etiqueta}s
                </Link>
              ))}
            </p>
          </div>

          {/* Papeleta: el préstamo vigente del usuario o, sin sesión, el horario. */}
          <aside className="rounded-box border-t-4 border-secondary bg-base-100 p-6 text-base-content">
            {vivo ? (
              <>
                <p className="mb-3 text-lg font-semibold">
                  Tu préstamo vigente
                </p>
                <Papeleta prestamo={vivo} />
                <Boton href="/perfil" anchoCompleto className="mt-5">
                  Ver mis préstamos
                </Boton>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold">Horario de atención</p>
                {/* shortcut: el horario es el parámetro `biblioteca.horario`; mostrarlo al conectar la configuración */}
                <p className="mt-3 text-base-content/70">
                  Consulta el horario en el mostrador.
                </p>
                {!usuario && (
                  <Boton href="/iniciar-sesion" anchoCompleto className="mt-5">
                    Iniciar sesión para solicitar préstamos
                  </Boton>
                )}
              </>
            )}
          </aside>
        </div>
      </section>

      <main className="contenedor flex-1 space-y-14 py-12">
        <Seccion titulo="Novedades del acervo">
          {titulos.length === 0 ? (
            <Vacio>Aún no hay títulos en el acervo.</Vacio>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {titulos.slice(0, 4).map((t) => (
                <TarjetaTitulo key={t.id} titulo={t} />
              ))}
            </div>
          )}
          <Boton href="/catalogo" variante="contorno" className="mt-6">
            Ver todo el catálogo
          </Boton>
        </Seccion>

        <Seccion titulo="Cómo funciona el préstamo">
          <ol className="grid gap-4 md:grid-cols-3">
            {PASOS.map(([titulo, texto], i) => (
              <li key={titulo} className="tarjeta flex gap-4 p-5">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary font-semibold text-primary-content">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold">{titulo}</h3>
                  <p className="mt-1 text-sm text-base-content/70">{texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </Seccion>
      </main>
    </>
  );
}
