import Link from "next/link";
import { notFound } from "next/navigation";
import { EstadoBadge } from "@/components/admin/EstadoBadge";
import { FormAccion, estiloCampo, estiloEtiqueta } from "@/components/admin/FormAccion";
import { cambiarEstado } from "@/lib/admin/acciones";
import { ESTADOS, type EstadoReserva } from "@/lib/admin/formato";
import { requerirAdmin } from "@/lib/admin/sesion";
import { formatPrecio } from "@/lib/precio";
import { formatearTurno } from "@/lib/reservas/fechas";

export const metadata = { title: "Reserva" };

type Reserva = {
  id: string;
  inicio: string;
  estado: EstadoReserva;
  precio: number | null;
  sena_porcentaje: number;
  sena_monto: number | null;
  comentarios: string | null;
  comprobante_path: string;
  motivo: string | null;
  cliente_nombre: string;
  cliente_telefono: string;
  creado_en: string;
  servicios: { nombre: string } | null;
  clientes: { email: string } | null;
};

type Evento = {
  id: number;
  estado_anterior: EstadoReserva | null;
  estado_nuevo: EstadoReserva;
  motivo: string | null;
  creado_en: string;
};

export default async function DetalleReserva({ params }: PageProps<"/admin/reservas/[id]">) {
  const { id } = await params;
  const { db } = await requerirAdmin();
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();

  const { data, error } = await db.from("reservas").select("*, servicios(nombre), clientes(email)").eq("id", id).maybeSingle();
  if (error) throw new Error(`No se pudo leer la reserva: ${error.message}`);
  if (!data) notFound();
  const r = data as unknown as Reserva;

  const [{ data: firmada }, { data: eventos }] = await Promise.all([
    db.storage.from("comprobantes").createSignedUrl(r.comprobante_path, 300),
    db.from("eventos_reserva").select("id, estado_anterior, estado_nuevo, motivo, creado_en").eq("reserva_id", id).order("creado_en"),
  ]);
  const urlComprobante = firmada?.signedUrl ?? null;
  const esPdf = r.comprobante_path.endsWith(".pdf");
  const email = r.clientes?.email ?? "";
  const telefono = r.cliente_telefono.replace(/\D/g, "");

  const datos: [string, React.ReactNode][] = [
    ["Cliente", r.cliente_nombre],
    [
      "Email",
      <a key="e" href={`mailto:${email}`} className="underline">
        {email}
      </a>,
    ],
    [
      "Teléfono",
      <a key="t" href={`https://wa.me/${telefono}`} target="_blank" rel="noopener noreferrer" className="underline">
        {r.cliente_telefono}
      </a>,
    ],
    ["Servicio", r.servicios?.nombre],
    [
      "Turno",
      <span key="f" className="capitalize">
        {formatearTurno(r.inicio)}
      </span>,
    ],
    ["Precio", formatPrecio(r.precio)],
    [`Seña (${r.sena_porcentaje}%)`, formatPrecio(r.sena_monto)],
    ["Comentarios", r.comentarios || "—"],
    ["Reservó el", formatearTurno(r.creado_en)],
  ];
  if (r.motivo) datos.push(["Motivo", r.motivo]);

  return (
    <div className="space-y-6">
      <Link href="/admin" className="text-sm text-ink-soft underline">
        ← Reservas
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-ink">{r.cliente_nombre}</h1>
        <EstadoBadge estado={r.estado} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <dl className="divide-y divide-blush-100 rounded-2xl bg-white/80 px-5 shadow-softer">
          {datos.map(([etiqueta, valor]) => (
            <div key={etiqueta} className="flex justify-between gap-4 py-3">
              <dt className="text-sm text-ink-soft">{etiqueta}</dt>
              <dd className="text-right text-ink">{valor}</dd>
            </div>
          ))}
        </dl>

        <section className="rounded-2xl bg-white/80 p-5 shadow-softer">
          <h2 className={estiloEtiqueta}>Comprobante</h2>
          {!urlComprobante ? (
            <p className="text-sm text-rose-700">No se pudo cargar el comprobante.</p>
          ) : esPdf ? (
            <a
              href={urlComprobante}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-full bg-blush-100 px-5 text-sm text-blush-700"
            >
              Abrir PDF
            </a>
          ) : (
            <a href={urlComprobante} target="_blank" rel="noopener noreferrer" title="Abrir en tamaño completo">
              {/* Link firmado y temporal de un bucket privado: no pasa por el optimizador de imágenes. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={urlComprobante} alt="Comprobante de la seña" className="max-h-[28rem] w-full rounded-xl object-contain" />
            </a>
          )}
          <p className="mt-2 text-xs text-ink-soft">El link vence en 5 minutos (recargá la página para verlo de nuevo).</p>
        </section>
      </div>

      {(r.estado === "pendiente_verificacion" || r.estado === "confirmada") && (
        <section className="rounded-2xl bg-white/80 p-5 shadow-softer">
          <h2 className={estiloEtiqueta}>Acciones</h2>
          {r.estado === "pendiente_verificacion" && (
            <>
              <p className="mb-2 text-sm text-ink-soft">Confirmá sólo después de verificar que la seña llegó a tu cuenta.</p>
              <FormAccion
                accion={cambiarEstado}
                boton="Confirmar seña"
                confirmar="¿Verificaste que la seña está acreditada? La reserva quedará CONFIRMADA."
              >
                <input type="hidden" name="id" value={r.id} />
                <input type="hidden" name="estado" value="confirmada" />
              </FormAccion>
              <hr className="my-5 border-blush-100" />
              <FormAccion
                accion={cambiarEstado}
                boton="Rechazar seña"
                variante="peligro"
                confirmar="¿Rechazar la seña? El horario queda libre."
              >
                <input type="hidden" name="id" value={r.id} />
                <input type="hidden" name="estado" value="rechazada" />
                <label className={estiloEtiqueta} htmlFor="motivo-rechazo">
                  Motivo (opcional)
                </label>
                <input
                  id="motivo-rechazo"
                  name="motivo"
                  maxLength={500}
                  className={estiloCampo}
                  placeholder="Ej.: el comprobante no corresponde"
                />
              </FormAccion>
              <hr className="my-5 border-blush-100" />
            </>
          )}
          <FormAccion
            accion={cambiarEstado}
            boton="Cancelar reserva"
            variante="suave"
            confirmar="¿Cancelar esta reserva? El horario queda libre."
          >
            <input type="hidden" name="id" value={r.id} />
            <input type="hidden" name="estado" value="cancelada" />
            <label className={estiloEtiqueta} htmlFor="motivo-cancelacion">
              Motivo (opcional)
            </label>
            <input id="motivo-cancelacion" name="motivo" maxLength={500} className={estiloCampo} />
          </FormAccion>
          <p className="mt-4 text-xs text-ink-soft">El email de confirmación y el evento de Google Calendar se agregan en la Fase 3.</p>
        </section>
      )}

      <section>
        <h2 className={estiloEtiqueta}>Historial</h2>
        <ul className="space-y-1 text-sm text-ink-soft">
          {((eventos ?? []) as Evento[]).map((e) => (
            <li key={e.id}>
              {formatearTurno(e.creado_en)} — {e.estado_anterior ? `${ESTADOS[e.estado_anterior].etiqueta} → ` : ""}
              {ESTADOS[e.estado_nuevo].etiqueta}
              {e.motivo ? ` (${e.motivo})` : ""}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
