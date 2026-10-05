import { FormAccion, estiloCampo, estiloEtiqueta } from "@/components/admin/FormAccion";
import { guardarServicio } from "@/lib/admin/acciones";
import { NOMBRE_CATEGORIA } from "@/lib/admin/formato";
import { requerirAdmin } from "@/lib/admin/sesion";
import type { Categoria } from "@/lib/datos/tipos";
import { formatPrecio } from "@/lib/precio";

export const metadata = { title: "Servicios y precios" };

type Fila = {
  slug: string;
  categoria: Categoria;
  nombre: string;
  titulo_descripcion: string;
  descripcion: string;
  incluye: string[];
  duracion_texto: string;
  duracion_minutos: number;
  detalles: { titulo: string; texto: string }[];
  destacado: string | null;
  precio: number | null;
  activo: boolean;
  orden: number;
};

export default async function Servicios() {
  const { db } = await requerirAdmin();
  const { data, error } = await db.from("servicios").select("*").order("orden");
  if (error) throw new Error(`No se pudieron leer los servicios: ${error.message}`);
  const servicios = data as Fila[];

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-soft">
        Los cambios se ven en la web al instante. La <strong className="font-normal">duración en minutos</strong> define cuánto
        tiempo ocupa el turno en tu agenda; el texto de duración es lo que lee la clienta.
      </p>
      {(["manicuria", "rostro", "astrologia"] as Categoria[]).map((cat) => (
        <section key={cat}>
          <h2 className="mb-2 mt-6 font-display text-2xl text-ink">{NOMBRE_CATEGORIA[cat]}</h2>
          <div className="space-y-3">
            {servicios
              .filter((s) => s.categoria === cat)
              .map((s) => (
                <details key={s.slug} className="group rounded-2xl bg-white/80 shadow-softer">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-5 py-3">
                    <span className="text-ink">
                      {s.nombre}
                      {!s.activo && <span className="ml-2 text-xs text-ink-soft">(oculto)</span>}
                    </span>
                    <span className="text-ink-soft">{formatPrecio(s.precio)}</span>
                  </summary>
                  <FormAccion accion={guardarServicio} boton="Guardar" className="border-t border-blush-100 px-5 pb-5 pt-4">
                    <input type="hidden" name="slug" value={s.slug} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Campo etiqueta="Nombre" nombre="nombre" valor={s.nombre} />
                      <Campo
                        etiqueta="Precio (sin puntos; vacío = $ X)"
                        nombre="precio"
                        valor={s.precio?.toString() ?? ""}
                        inputMode="numeric"
                      />
                      <Campo etiqueta="Duración en minutos (agenda)" nombre="duracion_minutos" valor={String(s.duracion_minutos)} inputMode="numeric" />
                      <Campo etiqueta="Duración (texto)" nombre="duracion_texto" valor={s.duracion_texto} />
                      <Campo etiqueta="Título de la descripción" nombre="titulo_descripcion" valor={s.titulo_descripcion} />
                      <Campo etiqueta="Destacado junto al precio" nombre="destacado" valor={s.destacado ?? ""} />
                    </div>
                    <Area etiqueta="Descripción" nombre="descripcion" valor={s.descripcion} filas={4} />
                    <Area etiqueta="¿Qué incluye? (un ítem por línea)" nombre="incluye" valor={s.incluye.join("\n")} filas={4} />
                    <fieldset className="mt-4">
                      <legend className={estiloEtiqueta}>Bloques extra (mantenimiento, cuidados, modalidad…)</legend>
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="mt-2 grid gap-2 sm:grid-cols-[12rem_1fr]">
                          <input
                            name={`detalle_titulo_${i}`}
                            defaultValue={s.detalles[i]?.titulo ?? ""}
                            placeholder="Título"
                            aria-label={`Título del bloque ${i + 1}`}
                            className={estiloCampo}
                          />
                          <textarea
                            name={`detalle_texto_${i}`}
                            defaultValue={s.detalles[i]?.texto ?? ""}
                            placeholder="Texto"
                            aria-label={`Texto del bloque ${i + 1}`}
                            rows={2}
                            className={estiloCampo}
                          />
                        </div>
                      ))}
                    </fieldset>
                    <div className="mt-4 flex flex-wrap items-center gap-6">
                      <label className="flex items-center gap-2 text-sm text-ink">
                        <input type="checkbox" name="activo" defaultChecked={s.activo} className="h-5 w-5 accent-blush-500" />
                        Visible en la web y reservable
                      </label>
                      <label className="flex items-center gap-2 text-sm text-ink">
                        Orden
                        <input name="orden" defaultValue={s.orden} inputMode="numeric" className={`${estiloCampo} w-20`} />
                      </label>
                    </div>
                  </FormAccion>
                </details>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function Campo({
  etiqueta,
  nombre,
  valor,
  inputMode,
}: {
  etiqueta: string;
  nombre: string;
  valor: string;
  inputMode?: "numeric";
}) {
  return (
    <div>
      <label className={estiloEtiqueta}>
        {etiqueta}
        <input name={nombre} defaultValue={valor} inputMode={inputMode} className={`${estiloCampo} mt-1 normal-case tracking-normal`} />
      </label>
    </div>
  );
}

function Area({ etiqueta, nombre, valor, filas }: { etiqueta: string; nombre: string; valor: string; filas: number }) {
  return (
    <div className="mt-4">
      <label className={estiloEtiqueta}>
        {etiqueta}
        <textarea name={nombre} defaultValue={valor} rows={filas} className={`${estiloCampo} mt-1 normal-case tracking-normal`} />
      </label>
    </div>
  );
}
