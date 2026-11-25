import { InsigniaEstado } from "@/components/ui/insignia-estado";
import { Dato } from "@/components/ui/pagina";
import { fecha, MODALIDADES, type Prestamo } from "@/lib/biblioteca";

/** Resumen de un préstamo como papeleta de mostrador: folio, material y vencimiento. */
export function Papeleta({ prestamo: p }: { prestamo: Prestamo }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <dl>
          <Dato etiqueta="Folio" mono>
            {p.folio}
          </Dato>
        </dl>
        <InsigniaEstado estado={p.estado} />
      </div>
      <ul className="mt-4 space-y-1 font-medium">
        {p.titulos.map((t) => (
          <li key={t.id}>{t.titulo}</li>
        ))}
      </ul>
      <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-base-300 pt-4">
        <Dato etiqueta="Modalidad">{MODALIDADES[p.modalidad]}</Dato>
        <Dato etiqueta={p.venceEn ? "Vence" : "Entrega"} destacado>
          {p.venceEn ? fecha(p.venceEn) : "En el mostrador"}
        </Dato>
      </dl>
    </>
  );
}
