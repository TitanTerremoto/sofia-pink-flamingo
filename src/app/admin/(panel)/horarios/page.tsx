import { FormAccion, estiloCampo, estiloEtiqueta } from "@/components/admin/FormAccion";
import { agregarBloqueo, agregarFranja, borrarBloqueo, borrarFranja } from "@/lib/admin/acciones";
import { DIAS_SEMANA } from "@/lib/admin/formato";
import { requerirAdmin } from "@/lib/admin/sesion";
import { formatearTurno } from "@/lib/reservas/fechas";

export const metadata = { title: "Horarios" };

type Franja = { id: string; dia_semana: number; desde: string; hasta: string };
type Bloqueo = { id: string; inicio: string; fin: string; motivo: string | null };

// Lunes primero
const ORDEN_DIAS = [1, 2, 3, 4, 5, 6, 0];

export default async function Horarios() {
  const { db } = await requerirAdmin();
  const [{ data: franjas, error: e1 }, { data: bloqueos, error: e2 }] = await Promise.all([
    db.from("disponibilidad").select("id, dia_semana, desde, hasta").order("desde"),
    db.from("bloqueos").select("id, inicio, fin, motivo").gte("fin", new Date().toISOString()).order("inicio"),
  ]);
  if (e1 || e2) throw new Error(`No se pudieron leer los horarios: ${(e1 ?? e2)?.message}`);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-white/80 p-5 shadow-softer">
        <h1 className="font-display text-2xl text-ink">Horarios disponibles</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Franjas semanales en las que se pueden reservar turnos. Un turno tiene que terminar dentro de la franja.
        </p>
        <ul className="mt-4 divide-y divide-blush-100">
          {ORDEN_DIAS.map((dia) => {
            const delDia = ((franjas ?? []) as Franja[]).filter((f) => f.dia_semana === dia);
            return (
              <li key={dia} className="flex flex-wrap items-center gap-2 py-3">
                <span className="w-24 text-sm text-ink">{DIAS_SEMANA[dia]}</span>
                {delDia.length === 0 && <span className="text-sm text-ink-soft">Sin turnos</span>}
                {delDia.map((f) => (
                  <form key={f.id} action={borrarFranja} className="inline-flex items-center gap-1 rounded-full bg-blush-50 py-1 pl-3 pr-1 text-sm">
                    {f.desde.slice(0, 5)} – {f.hasta.slice(0, 5)}
                    <input type="hidden" name="id" value={f.id} />
                    <button aria-label="Borrar franja" className="flex h-7 w-7 items-center justify-center rounded-full text-ink-soft hover:bg-white">
                      ×
                    </button>
                  </form>
                ))}
              </li>
            );
          })}
        </ul>

        <FormAccion accion={agregarFranja} boton="Agregar franja" className="mt-4 border-t border-blush-100 pt-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={estiloEtiqueta} htmlFor="dia_semana">
                Día
              </label>
              <select id="dia_semana" name="dia_semana" className={estiloCampo}>
                {ORDEN_DIAS.map((d) => (
                  <option key={d} value={d}>
                    {DIAS_SEMANA[d]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={estiloEtiqueta} htmlFor="desde">
                Desde
              </label>
              <input id="desde" name="desde" type="time" required step={900} className={estiloCampo} />
            </div>
            <div>
              <label className={estiloEtiqueta} htmlFor="hasta">
                Hasta
              </label>
              <input id="hasta" name="hasta" type="time" required step={900} className={estiloCampo} />
            </div>
          </div>
        </FormAccion>
      </section>

      <section className="rounded-2xl bg-white/80 p-5 shadow-softer">
        <h2 className="font-display text-2xl text-ink">Días y horarios bloqueados</h2>
        <p className="mt-1 text-sm text-ink-soft">Vacaciones, trámites, feriados: en esos rangos no se ofrecen turnos.</p>
        {((bloqueos ?? []) as Bloqueo[]).length === 0 ? (
          <p className="mt-4 text-sm text-ink-soft">No hay bloqueos próximos.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {((bloqueos ?? []) as Bloqueo[]).map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 rounded-xl bg-blush-50 px-4 py-2.5 text-sm">
                <span>
                  <span className="capitalize">{formatearTurno(b.inicio)}</span> → {formatearTurno(b.fin)}
                  {b.motivo && <span className="text-ink-soft"> · {b.motivo}</span>}
                </span>
                <form action={borrarBloqueo}>
                  <input type="hidden" name="id" value={b.id} />
                  <button className="rounded-full px-3 py-1 text-ink-soft hover:bg-white">Quitar</button>
                </form>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 grid gap-6 border-t border-blush-100 pt-5 md:grid-cols-2">
          <FormAccion accion={agregarBloqueo} boton="Bloquear días completos">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={estiloEtiqueta} htmlFor="dia">
                  Desde el día
                </label>
                <input id="dia" name="dia" type="date" required className={estiloCampo} />
              </div>
              <div>
                <label className={estiloEtiqueta} htmlFor="dia_hasta">
                  Hasta el día
                </label>
                <input id="dia_hasta" name="dia_hasta" type="date" className={estiloCampo} />
              </div>
              <div className="col-span-2">
                <label className={estiloEtiqueta} htmlFor="motivo-dia">
                  Motivo (opcional, sólo lo ves vos)
                </label>
                <input id="motivo-dia" name="motivo" maxLength={200} className={estiloCampo} />
              </div>
            </div>
          </FormAccion>

          <FormAccion accion={agregarBloqueo} boton="Bloquear un horario">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={estiloEtiqueta} htmlFor="inicio">
                  Desde
                </label>
                <input id="inicio" name="inicio" type="datetime-local" required className={estiloCampo} />
              </div>
              <div>
                <label className={estiloEtiqueta} htmlFor="fin">
                  Hasta
                </label>
                <input id="fin" name="fin" type="datetime-local" required className={estiloCampo} />
              </div>
              <div className="col-span-2">
                <label className={estiloEtiqueta} htmlFor="motivo-hora">
                  Motivo (opcional)
                </label>
                <input id="motivo-hora" name="motivo" maxLength={200} className={estiloCampo} />
              </div>
            </div>
          </FormAccion>
        </div>
      </section>
    </div>
  );
}
