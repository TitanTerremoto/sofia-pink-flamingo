import Link from "next/link";
import { EstadoBadge } from "@/components/admin/EstadoBadge";
import { ESTADOS, type EstadoReserva } from "@/lib/admin/formato";
import { requerirAdmin } from "@/lib/admin/sesion";
import { formatPrecio } from "@/lib/precio";
import { formatearTurno } from "@/lib/reservas/fechas";

export const metadata = { title: "Reservas" };

type Fila = {
  id: string;
  inicio: string;
  estado: EstadoReserva;
  cliente_nombre: string;
  sena_monto: number | null;
  servicios: { nombre: string } | null;
};

const FILTROS: { valor: string; etiqueta: string }[] = [
  { valor: "pendiente_verificacion", etiqueta: "Pendientes" },
  { valor: "confirmada", etiqueta: "Confirmadas" },
  { valor: "rechazada", etiqueta: "Rechazadas" },
  { valor: "cancelada", etiqueta: "Canceladas" },
  { valor: "todas", etiqueta: "Todas" },
];

export default async function Reservas({ searchParams }: PageProps<"/admin">) {
  const { db } = await requerirAdmin();
  const { estado: estadoParam, pasadas } = await searchParams;
  const estado =
    typeof estadoParam === "string" && (estadoParam in ESTADOS || estadoParam === "todas") ? estadoParam : "pendiente_verificacion";
  const verPasadas = pasadas === "1";
  const ahora = new Date().toISOString();

  let consulta = db
    .from("reservas")
    .select("id, inicio, estado, cliente_nombre, sena_monto, servicios(nombre)")
    .order("inicio", { ascending: !verPasadas })
    .limit(200);
  if (estado !== "todas") consulta = consulta.eq("estado", estado);
  consulta = verPasadas ? consulta.lt("inicio", ahora) : consulta.gte("inicio", ahora);
  const { data, error } = await consulta;
  if (error) throw new Error(`No se pudieron leer las reservas: ${error.message}`);
  const reservas = data as unknown as Fila[];

  const enlace = (e: string, p: boolean) => `/admin?estado=${e}${p ? "&pasadas=1" : ""}`;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <Link
            key={f.valor}
            href={enlace(f.valor, verPasadas)}
            className={`rounded-full px-3.5 py-1.5 text-sm ${estado === f.valor ? "bg-ink text-white" : "bg-white/70 text-ink"}`}
          >
            {f.etiqueta}
          </Link>
        ))}
        <Link href={enlace(estado, !verPasadas)} className="ml-auto rounded-full px-3.5 py-1.5 text-sm text-ink-soft underline">
          {verPasadas ? "Ver próximas" : "Ver pasadas"}
        </Link>
      </div>

      {reservas.length === 0 ? (
        <p className="mt-10 text-center text-ink-soft">No hay reservas para mostrar.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {reservas.map((r) => (
            <li key={r.id}>
              <Link
                href={`/admin/reservas/${r.id}`}
                className="flex flex-col gap-2 rounded-2xl bg-white/80 p-4 shadow-softer transition hover:bg-white sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-ink">
                    <span className="font-normal">{r.cliente_nombre}</span> · {r.servicios?.nombre}
                  </p>
                  <p className="text-sm capitalize text-ink-soft">{formatearTurno(r.inicio)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-ink-soft">Seña {formatPrecio(r.sena_monto)}</span>
                  <EstadoBadge estado={r.estado} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
