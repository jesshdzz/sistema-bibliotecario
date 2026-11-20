import { fecha, MODALIDADES, type Prestamo } from "@/lib/biblioteca";
import { InsigniaEstado } from "./insignia-estado";

/** Resumen de un préstamo como papeleta de mostrador: folio, material y vencimiento. */
export function Papeleta({ prestamo: p }: { prestamo: Prestamo }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-base-content/70">Folio</p>
          <p className="font-mono text-[13px] font-medium">{p.folio}</p>
        </div>
        <InsigniaEstado estado={p.estado} />
      </div>
      <ul className="mt-4 space-y-1 font-medium">
        {p.titulos.map((t) => (
          <li key={t.id}>{t.titulo}</li>
        ))}
      </ul>
      <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-base-300 pt-4">
        <div>
          <dt className="text-sm text-base-content/70">Modalidad</dt>
          <dd className="font-medium">{MODALIDADES[p.modalidad]}</dd>
        </div>
        <div>
          <dt className="text-sm text-base-content/70">
            {p.venceEn ? "Vence" : "Entrega"}
          </dt>
          <dd className="text-lg font-semibold leading-tight">
            {p.venceEn ? fecha(p.venceEn) : "En el mostrador"}
          </dd>
        </div>
      </dl>
    </>
  );
}
