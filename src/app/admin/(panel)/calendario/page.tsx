import Link from "next/link";
import { ESTADOS, type EstadoReserva } from "@/lib/admin/formato";
import { requerirAdmin } from "@/lib/admin/sesion";
import { fechaLocal, formatearHora } from "@/lib/reservas/fechas";

export const metadata = { title: "Calendario" };

type Turno = { id: string; inicio: string; estado: EstadoReserva; cliente_nombre: string; servicios: { nombre: string } | null };

const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function moverMes(mes: string, delta: number) {
  const [a, m] = mes.split("-").map(Number);
  const d = new Date(Date.UTC(a, m - 1 + delta, 1));
  return d.toISOString().slice(0, 7);
}

export default async function Calendario({ searchParams }: PageProps<"/admin/calendario">) {
  const { db } = await requerirAdmin();
  const { mes: mesParam } = await searchParams;
  const hoy = fechaLocal(new Date());
  const mes = typeof mesParam === "string" && /^\d{4}-\d{2}$/.test(mesParam) ? mesParam : hoy.slice(0, 7);
  const [anio, numMes] = mes.split("-").map(Number);

  // Rango del mes en hora de Buenos Aires (UTC-3)
  const desde = new Date(`${mes}-01T00:00:00-03:00`).toISOString();
  const hasta = new Date(`${moverMes(mes, 1)}-01T00:00:00-03:00`).toISOString();

  const { data, error } = await db
    .from("reservas")
    .select("id, inicio, estado, cliente_nombre, servicios(nombre)")
    .in("estado", ["pendiente_verificacion", "confirmada"])
    .gte("inicio", desde)
    .lt("inicio", hasta)
    .order("inicio");
  if (error) throw new Error(`No se pudo leer el calendario: ${error.message}`);

  const porDia = new Map<string, Turno[]>();
  for (const t of data as unknown as Turno[]) {
    const dia = fechaLocal(t.inicio);
    porDia.set(dia, [...(porDia.get(dia) ?? []), t]);
  }

  const diasDelMes = new Date(Date.UTC(anio, numMes, 0)).getUTCDate();
  const desfase = (new Date(Date.UTC(anio, numMes - 1, 1)).getUTCDay() + 6) % 7;
  const dias = Array.from({ length: diasDelMes }, (_, i) => `${mes}-${String(i + 1).padStart(2, "0")}`);

  const Chip = ({ t }: { t: Turno }) => (
    <Link
      href={`/admin/reservas/${t.id}`}
      className={`block truncate rounded-md px-1.5 py-0.5 text-[0.7rem] ${ESTADOS[t.estado].clase}`}
      title={`${t.cliente_nombre} · ${t.servicios?.nombre}`}
    >
      {formatearHora(t.inicio)} {t.cliente_nombre}
    </Link>
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link href={`/admin/calendario?mes=${moverMes(mes, -1)}`} className="rounded-full bg-white/70 px-4 py-2 text-sm">
          ‹ Anterior
        </Link>
        <h1 className="font-display text-2xl text-ink">
          {MESES[numMes - 1]} {anio}
        </h1>
        <Link href={`/admin/calendario?mes=${moverMes(mes, 1)}`} className="rounded-full bg-white/70 px-4 py-2 text-sm">
          Siguiente ›
        </Link>
      </div>
      <p className="mb-4 flex gap-3 text-xs text-ink-soft">
        <span className={`rounded px-1.5 ${ESTADOS.confirmada.clase}`}>Confirmada</span>
        <span className={`rounded px-1.5 ${ESTADOS.pendiente_verificacion.clase}`}>Pendiente</span>
      </p>

      {/* Escritorio: grilla mensual */}
      <div className="hidden grid-cols-7 gap-1.5 md:grid">
        {DIAS.map((d) => (
          <span key={d} className="text-center text-xs text-ink-soft">
            {d}
          </span>
        ))}
        {Array.from({ length: desfase }, (_, i) => (
          <span key={`v${i}`} />
        ))}
        {dias.map((dia) => (
          <div key={dia} className={`min-h-24 rounded-xl bg-white/80 p-1.5 ${dia === hoy ? "ring-2 ring-blush-400" : ""}`}>
            <p className="mb-1 text-xs text-ink-soft">{Number(dia.slice(8))}</p>
            <div className="space-y-1">
              {(porDia.get(dia) ?? []).map((t) => (
                <Chip key={t.id} t={t} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Celular: agenda por día */}
      <ul className="space-y-3 md:hidden">
        {dias
          .filter((dia) => porDia.has(dia))
          .map((dia) => (
            <li key={dia} className="rounded-2xl bg-white/80 p-4">
              <p className="mb-2 text-sm capitalize text-ink">
                {new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", timeZone: "UTC" }).format(new Date(`${dia}T12:00:00Z`))}
              </p>
              <div className="space-y-1.5">
                {porDia.get(dia)!.map((t) => (
                  <Chip key={t.id} t={t} />
                ))}
              </div>
            </li>
          ))}
        {porDia.size === 0 && <p className="text-center text-ink-soft">No hay turnos este mes.</p>}
      </ul>
    </div>
  );
}
