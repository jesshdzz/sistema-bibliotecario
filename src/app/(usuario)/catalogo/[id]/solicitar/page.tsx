import Form from "next/form";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Dato, Encabezado } from "@/components/pagina";
import { disponibles, MODALIDADES, type Titulo } from "@/lib/biblioteca";
import { usuarioSesion } from "@/lib/sesion";

export default async function SolicitarPrestamo({
  params,
}: PageProps<"/catalogo/[id]/solicitar">) {
  if (!(await usuarioSesion())) redirect("/iniciar-sesion");
  const { id } = await params;
  // shortcut: sin datos hasta conectar la base
  const titulos: Titulo[] = [];
  const t = titulos.find((t) => t.id === id);
  if (!t || disponibles(t) === 0) notFound();

  return (
    <main className="contenedor flex-1 py-8">
      <div className="max-w-xl mx-auto space-y-6">
        <Encabezado
          titulo="Solicitar préstamo"
          descripcion="Confirma los datos de tu solicitud."
        />
        {/* shortcut: no guarda nada; sólo navega al perfil con la solicitud en la URL. Sustituir por una server action. */}
        <Form action="/perfil" className="tarjeta p-6 space-y-6">
          <input type="hidden" name="solicitud" value={t.id} />
          <dl className="space-y-3">
            <Dato etiqueta="Título">{t.titulo}</Dato>
            <Dato etiqueta="Autores">{t.autores}</Dato>
            <Dato etiqueta="Signatura topográfica" mono>
              {t.clasificacion}
            </Dato>
          </dl>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Modalidad</legend>
            {Object.entries(MODALIDADES).map(([valor, etiqueta], i) => (
              <label
                key={valor}
                className="flex items-center gap-2 py-1 text-sm"
              >
                <input
                  type="radio"
                  name="modalidad"
                  value={valor}
                  defaultChecked={i === 0}
                  className="radio radio-primary radio-sm"
                />
                {etiqueta}
              </label>
            ))}
          </fieldset>
          <div role="alert" className="alert alert-info">
            <span>
              Recoge el material en el mostrador dentro del plazo de recogida.
              Presenta tu credencial vigente.
            </span>
          </div>
          <div className="flex flex-wrap gap-3 justify-end">
            <Link href={`/catalogo/${t.id}`} className="btn btn-ghost">
              Cancelar
            </Link>
            <button type="submit" className="btn btn-primary">
              Confirmar solicitud
            </button>
          </div>
        </Form>
      </div>
    </main>
  );
}
