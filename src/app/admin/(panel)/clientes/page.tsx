import { requerirAdmin } from "@/lib/admin/sesion";
import { formatearDia } from "@/lib/reservas/fechas";

export const metadata = { title: "Clientes" };

type Cliente = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  creado_en: string;
  reservas: { inicio: string; estado: string }[];
};

export default async function Clientes({ searchParams }: PageProps<"/admin/clientes">) {
  const { db } = await requerirAdmin();
  const { q } = await searchParams;
  const busqueda = typeof q === "string" ? q.trim().toLowerCase() : "";

  const { data, error } = await db
    .from("clientes")
    .select("id, nombre, email, telefono, creado_en, reservas(inicio, estado)")
    .order("creado_en", { ascending: false })
    .limit(1000);
  if (error) throw new Error(`No se pudieron leer los clientes: ${error.message}`);

  const clientes = (data as Cliente[]).filter(
    (c) => !busqueda || c.nombre.toLowerCase().includes(busqueda) || c.email.toLowerCase().includes(busqueda) || c.telefono.includes(busqueda),
  );

  return (
    <div>
      <form className="mb-5 flex gap-2">
        <input
          name="q"
          defaultValue={busqueda}
          placeholder="Buscar por nombre, email o teléfono"
          aria-label="Buscar clientes"
          className="min-h-11 flex-1 rounded-full border border-blush-200 bg-white px-4 text-base"
        />
        <button className="rounded-full bg-blush-500 px-5 text-sm text-white">Buscar</button>
      </form>
      <p className="mb-3 text-sm text-ink-soft">{clientes.length} clientes</p>
      <ul className="space-y-2">
        {clientes.map((c) => {
          const confirmadas = c.reservas.filter((r) => r.estado === "confirmada");
          const ultima = [...c.reservas].sort((a, b) => b.inicio.localeCompare(a.inicio))[0];
          return (
            <li key={c.id} className="flex flex-col gap-1 rounded-2xl bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-ink">{c.nombre}</p>
                <p className="text-sm text-ink-soft">
                  <a href={`mailto:${c.email}`} className="underline">
                    {c.email}
                  </a>{" "}
                  ·{" "}
                  <a href={`https://wa.me/${c.telefono.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="underline">
                    {c.telefono}
                  </a>
                </p>
              </div>
              <p className="text-sm text-ink-soft">
                {confirmadas.length} turno{confirmadas.length === 1 ? "" : "s"} confirmado{confirmadas.length === 1 ? "" : "s"}
                {ultima && <> · último: {formatearDia(ultima.inicio)}</>}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
