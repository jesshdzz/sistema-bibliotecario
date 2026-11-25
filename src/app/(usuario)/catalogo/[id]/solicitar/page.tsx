import Form from "next/form";
import { notFound, redirect } from "next/navigation";
import { Alerta } from "@/components/ui/alerta";
import { Boton } from "@/components/ui/boton";
import { Grupo, Opcion } from "@/components/ui/campo";
import { Dato, Encabezado } from "@/components/ui/pagina";
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
        <Form action="/perfil" className="tarjeta space-y-6 p-6">
          <input type="hidden" name="solicitud" value={t.id} />
          <dl className="space-y-3">
            <Dato etiqueta="Título">{t.titulo}</Dato>
            <Dato etiqueta="Autores">{t.autores}</Dato>
            <Dato etiqueta="Signatura topográfica" mono>
              {t.clasificacion}
            </Dato>
          </dl>
          <Grupo etiqueta="Modalidad">
            {Object.entries(MODALIDADES).map(([valor, etiqueta], i) => (
              <Opcion
                key={valor}
                tipo="radio"
                etiqueta={etiqueta}
                name="modalidad"
                value={valor}
                defaultChecked={i === 0}
              />
            ))}
          </Grupo>
          <Alerta tono="info">
            Recoge el material en el mostrador dentro del plazo de recogida.
            Presenta tu credencial vigente.
          </Alerta>
          <div className="flex flex-wrap justify-end gap-3">
            <Boton href={`/catalogo/${t.id}`} variante="texto">
              Cancelar
            </Boton>
            <Boton type="submit">Confirmar solicitud</Boton>
          </div>
        </Form>
      </div>
    </main>
  );
}
