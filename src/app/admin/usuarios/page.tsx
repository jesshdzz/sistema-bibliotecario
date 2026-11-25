import Form from "next/form";
import Link from "next/link";
import { Boton } from "@/components/ui/boton";
import { Entrada, Selector } from "@/components/ui/campo";
import { Insignia } from "@/components/ui/insignia";
import { InsigniaEstado } from "@/components/ui/insignia-estado";
import { Encabezado } from "@/components/ui/pagina";
import { Mono, Tabla } from "@/components/ui/tabla";
import { Vacio } from "@/components/ui/tarjeta";
import {
  ESTADOS_VIVOS,
  type Multa,
  normalizar,
  type Prestamo,
  sancion,
  type Usuario,
  uno,
} from "@/lib/biblioteca";

export default async function Usuarios({
  searchParams,
}: PageProps<"/admin/usuarios">) {
  const sp = await searchParams;
  const q = uno(sp.q);
  const rol = uno(sp.rol);
  // shortcut: sin datos hasta conectar la base
  const usuarios: Usuario[] = [];
  const prestamos: Prestamo[] = [];
  const multas: Multa[] = [];
  const ROLES = [...new Set(usuarios.map((u) => u.rol))];
  const resultados = usuarios.filter(
    (u) =>
      normalizar(`${u.nombre} ${u.matricula}`).includes(normalizar(q)) &&
      (!rol || u.rol === rol),
  );

  return (
    <>
      <Encabezado
        titulo="Usuarios"
        descripcion="Cuentas registradas, su préstamo vigente y sus multas pendientes."
      />

      {/* key: al cambiar los filtros se vuelve a montar y los campos coinciden con la URL */}
      <Form
        key={`${q}|${rol}`}
        action="/admin/usuarios"
        className="tarjeta flex flex-wrap gap-3 p-4"
      >
        <Entrada
          type="search"
          name="q"
          defaultValue={q}
          aria-label="Buscar usuario"
          placeholder="Nombre o matrícula"
          className="min-w-0 grow basis-64"
        />
        <Selector
          name="rol"
          defaultValue={rol}
          aria-label="Rol"
          className="w-auto grow sm:grow-0"
        >
          <option value="">Todos los roles</option>
          {ROLES.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </Selector>
        <Boton type="submit">Buscar</Boton>
        {(q || rol) && (
          <Boton href="/admin/usuarios" variante="texto">
            Limpiar
          </Boton>
        )}
      </Form>

      <div>
        <p className="mb-3 text-sm text-base-content/70">
          {resultados.length} de {usuarios.length} usuarios
        </p>
        {resultados.length === 0 ? (
          <Vacio>No se encontraron usuarios con esos criterios.</Vacio>
        ) : (
          <Tabla
            columnas={[
              "Nombre",
              "Matrícula",
              "Adscripción",
              "Rol",
              "Préstamo vigente",
              "Multas",
            ]}
          >
            {resultados.map((u) => {
              // El esquema permite un solo préstamo vivo por usuario.
              const vigente = prestamos.find(
                (p) =>
                  p.usuario.id === u.id && ESTADOS_VIVOS.includes(p.estado),
              );
              const pendientes = multas.filter(
                (m) => m.usuario.id === u.id && m.estado === "pendiente",
              );
              return (
                <tr key={u.id}>
                  <td className="min-w-48">
                    <Link
                      href={`/admin/usuarios/${u.id}`}
                      className="link link-hover font-medium"
                    >
                      {u.nombre}
                    </Link>
                    <p className="text-sm text-base-content/70">{u.correo}</p>
                  </td>
                  <td>
                    <Mono>{u.matricula}</Mono>
                  </td>
                  <td className="min-w-40">{u.carrera}</td>
                  <td>{u.rol}</td>
                  <td>
                    {vigente ? (
                      <span className="flex items-center gap-2">
                        <Mono>{vigente.folio}</Mono>
                        <InsigniaEstado estado={vigente.estado} />
                      </span>
                    ) : (
                      <span className="text-base-content/70">Ninguno</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap">
                    {pendientes.length > 0 ? (
                      pendientes.map((m) => (
                        <Insignia key={m.folio} color="warning">
                          {sancion(m)}
                        </Insignia>
                      ))
                    ) : (
                      <span className="text-base-content/70">Ninguna</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </Tabla>
        )}
      </div>
    </>
  );
}
