"use client";

import Script from "next/script";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { IconoDestello } from "@/components/brand/Iconos";
import { consultarHorarios, enviarReserva, type ResultadoReserva } from "@/lib/reservas/acciones";
import { formatearDia, formatearHora, formatearTurno } from "@/lib/reservas/fechas";
import { TAMANO_MAXIMO_COMPROBANTE } from "@/lib/reservas/validacion";
import { formatPrecio, montoSena } from "@/lib/precio";
import type { Categoria, ConfigSitio } from "@/lib/datos/tipos";
import { Calendario } from "./Calendario";
import { DatoBancario } from "./DatoBancario";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opciones: { sitekey: string; language?: string }) => string;
      reset: (id?: string) => void;
    };
  }
}

export type ServicioReservable = {
  slug: string;
  nombre: string;
  categoria: Categoria;
  precio: number | null;
  duracion: string;
};

type Props = {
  servicios: ServicioReservable[];
  preseleccion?: string;
  hoy: string;
  horizonteDias: number;
  diasHabilitados: number[];
  senaPorcentaje: number;
  banco: ConfigSitio["banco"];
  avisoAstrologia: string;
  turnstileSiteKey?: string;
};

const PASOS = ["Tus datos", "Fecha y horario", "Seña", "Listo"];
const CATEGORIAS: Record<Categoria, string> = { manicuria: "Manicuría", rostro: "Rostro", astrologia: "Astrología" };

const estiloInput =
  "w-full rounded-2xl border border-blush-200 bg-white/80 px-4 py-3.5 text-base text-ink outline-none transition focus:border-blush-400 focus:ring-4 focus:ring-blush-100";
const estiloEtiqueta = "title-caps mb-1.5 block text-xs text-ink-soft";
const botonPrincipal =
  "inline-flex min-h-13 w-full items-center justify-center rounded-full bg-blush-500 px-8 py-3.5 title-caps text-sm tracking-[0.24em] text-white shadow-[0_10px_30px_-10px_rgb(220_116_153/0.65)] transition hover:bg-blush-600 disabled:cursor-wait disabled:opacity-60 sm:w-auto";
const botonSecundario =
  "inline-flex min-h-13 items-center justify-center rounded-full px-6 py-3.5 title-caps text-xs text-ink-soft transition hover:text-blush-600";

export function FlujoReserva(p: Props) {
  const [paso, setPaso] = useState(0);
  const [servicio, setServicio] = useState(
    p.servicios.some((s) => s.slug === p.preseleccion) ? p.preseleccion! : (p.servicios[0]?.slug ?? ""),
  );
  const [fecha, setFecha] = useState<string | null>(null);
  const [horarios, setHorarios] = useState<string[] | null>(null);
  const [inicio, setInicio] = useState<string | null>(null);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const [buscando, iniciarBusqueda] = useTransition();
  const [resultado, enviar, enviando] = useActionState<ResultadoReserva, FormData>(enviarReserva, { estado: "inicial" });
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const [scriptListo, setScriptListo] = useState(false);

  const elegido = p.servicios.find((s) => s.slug === servicio);
  const sena = montoSena(elegido?.precio ?? null, p.senaPorcentaje);

  // Si el horario se ocupó mientras la persona completaba la seña, vuelve a elegir horario.
  const [resultadoPrevio, setResultadoPrevio] = useState(resultado);
  if (resultado !== resultadoPrevio) {
    setResultadoPrevio(resultado);
    if (resultado.estado === "ok") setPaso(3);
    if (resultado.estado === "error" && resultado.volverAlHorario) {
      setPaso(1);
      setInicio(null);
      setFecha(null);
      setHorarios(null);
    }
  }

  // Turnstile: se dibuja al llegar al paso de la seña y se reinicia tras un error (cada token sirve una sola vez).
  useEffect(() => {
    const el = turnstileRef.current;
    if (paso !== 2 || !scriptListo || !el || !p.turnstileSiteKey || el.childElementCount > 0) return;
    window.turnstile?.render(el, { sitekey: p.turnstileSiteKey, language: "es" });
  }, [paso, scriptListo, p.turnstileSiteKey]);
  useEffect(() => {
    if (resultado.estado === "error") window.turnstile?.reset();
  }, [resultado]);

  function validarPaso(): boolean {
    const contenedor = formRef.current?.querySelector<HTMLElement>(`[data-paso="${paso}"]`);
    for (const el of contenedor?.querySelectorAll<HTMLInputElement>("input, select, textarea") ?? []) {
      if (!el.checkValidity()) {
        el.reportValidity();
        return false;
      }
    }
    return true;
  }

  function elegirFecha(f: string) {
    setFecha(f);
    setInicio(null);
    setHorarios(null);
    setErrorLocal(null);
    iniciarBusqueda(async () => {
      try {
        setHorarios(await consultarHorarios(servicio, f));
      } catch {
        setErrorLocal("No pudimos cargar los horarios. Probá de nuevo.");
      }
    });
  }

  function cambiarServicio(slug: string) {
    setServicio(slug);
    setFecha(null);
    setHorarios(null);
    setInicio(null);
  }

  function siguiente() {
    setErrorLocal(null);
    if (paso === 0 && !validarPaso()) return;
    if (paso === 1 && !inicio) {
      setErrorLocal("Elegí un día y un horario.");
      return;
    }
    setPaso((n) => n + 1);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function alElegirArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    setErrorLocal(null);
    if (archivo && archivo.size > TAMANO_MAXIMO_COMPROBANTE) {
      setErrorLocal("El archivo supera los 4 MB. Probá con una captura de pantalla.");
      e.target.value = "";
    }
  }

  const errorServidor = resultado.estado === "error" ? resultado.mensaje : null;

  if (paso === 3 && resultado.estado === "ok") {
    return (
      <div className="glass mx-auto max-w-xl rounded-[2rem] p-8 text-center shadow-softer sm:p-10" role="status">
        <IconoDestello className="mx-auto h-6 w-6 text-blush-400" />
        <h2 className="mt-4 font-display text-3xl text-ink">¡Gracias, recibimos tu reserva!</h2>
        <p className="mt-3 inline-block rounded-full bg-blush-100 px-4 py-1.5 title-caps text-xs text-blush-600">
          Pendiente de verificación
        </p>
        <p className="mt-5 leading-relaxed text-ink-soft">
          {elegido?.nombre} · {inicio && formatearTurno(inicio)}
        </p>
        <p className="mt-4 leading-relaxed text-ink-soft">
          Sofi va a revisar tu comprobante. Cuando la seña esté verificada, tu turno queda confirmado y te avisamos por email.
        </p>
        {elegido?.categoria === "astrologia" && (
          <p className="mt-4 font-display text-lg italic leading-snug text-lavender-700">{p.avisoAstrologia}</p>
        )}
      </div>
    );
  }

  return (
    <form ref={formRef} action={enviar} className="mx-auto max-w-2xl scroll-mt-24" noValidate={false}>
      {p.turnstileSiteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={() => setScriptListo(true)}
        />
      )}

      {/* Pasos */}
      <ol className="mb-8 flex items-center justify-center gap-2 sm:gap-3" aria-label="Pasos de la reserva">
        {PASOS.slice(0, 3).map((nombre, i) => (
          <li key={nombre} className="flex items-center gap-2 sm:gap-3">
            <span
              aria-current={i === paso ? "step" : undefined}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm transition ${
                i <= paso ? "bg-blush-500 text-white" : "bg-white/70 text-ink-soft"
              }`}
            >
              {i + 1}
            </span>
            <span className={`title-caps text-xs tracking-[0.1em] sm:tracking-[0.28em] ${i === paso ? "text-ink" : "text-ink-soft"} ${i === paso ? "" : "hidden min-[400px]:inline"}`}>{nombre}</span>
            {i < 2 && <span className="h-px w-4 bg-blush-300 sm:w-8" aria-hidden />}
          </li>
        ))}
      </ol>

      <div className="glass rounded-[2rem] p-5 shadow-softer sm:p-9">
        {/* Campo trampa anti-bots: invisible para personas */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            No completar
            <input type="text" name="sitio_web" tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>
        <input type="hidden" name="inicio" value={inicio ?? ""} />

        {/* ───── Paso 1: datos ───── */}
        <fieldset data-paso="0" hidden={paso !== 0} className="space-y-5">
          <legend className="sr-only">Tus datos</legend>
          <div>
            <label htmlFor="servicio" className={estiloEtiqueta}>
              Servicio
            </label>
            <select
              id="servicio"
              name="servicio"
              required
              value={servicio}
              onChange={(e) => cambiarServicio(e.target.value)}
              className={estiloInput}
            >
              {(Object.keys(CATEGORIAS) as Categoria[]).map((cat) => (
                <optgroup key={cat} label={CATEGORIAS[cat]}>
                  {p.servicios
                    .filter((s) => s.categoria === cat)
                    .map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.nombre} — {formatPrecio(s.precio)}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
            {elegido && <p className="mt-1.5 text-sm text-ink-soft">Duración: {elegido.duracion}</p>}
          </div>
          <div>
            <label htmlFor="nombre" className={estiloEtiqueta}>
              Nombre completo
            </label>
            <input id="nombre" name="nombre" required minLength={2} maxLength={120} autoComplete="name" className={estiloInput} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className={estiloEtiqueta}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                inputMode="email"
                className={estiloInput}
              />
            </div>
            <div>
              <label htmlFor="telefono" className={estiloEtiqueta}>
                Teléfono / WhatsApp
              </label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                required
                minLength={6}
                maxLength={30}
                pattern="[0-9+()\s\-]{6,30}"
                autoComplete="tel"
                inputMode="tel"
                placeholder="11 1234-5678"
                className={estiloInput}
              />
            </div>
          </div>
          <div>
            <label htmlFor="comentarios" className={estiloEtiqueta}>
              Comentarios (opcional)
            </label>
            <textarea
              id="comentarios"
              name="comentarios"
              rows={3}
              maxLength={1000}
              placeholder={
                elegido?.categoria === "astrologia"
                  ? "Fecha, hora exacta y lugar de nacimiento"
                  : "Algo que quieras contarme antes del turno"
              }
              className={estiloInput}
            />
          </div>
        </fieldset>

        {/* ───── Paso 2: fecha y horario ───── */}
        <fieldset data-paso="1" hidden={paso !== 1}>
          <legend className="sr-only">Fecha y horario</legend>
          <Calendario
            hoy={p.hoy}
            horizonteDias={p.horizonteDias}
            diasHabilitados={p.diasHabilitados}
            seleccionada={fecha}
            onElegir={elegirFecha}
          />
          <div className="mt-6" aria-live="polite">
            {!fecha && <p className="text-center text-sm text-ink-soft">Elegí un día para ver los horarios disponibles.</p>}
            {fecha && buscando && <p className="text-center text-sm text-ink-soft">Buscando horarios…</p>}
            {fecha && !buscando && horarios?.length === 0 && (
              <p className="text-center text-sm text-ink-soft">No quedan horarios para ese día. Probá con otro.</p>
            )}
            {fecha && !buscando && horarios && horarios.length > 0 && (
              <>
                <p className="title-caps mb-3 text-center text-xs text-ink-soft">{formatearDia(horarios[0])}</p>
                <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                  {horarios.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setInicio(h)}
                      aria-pressed={inicio === h}
                      className={`min-h-12 rounded-full border text-base transition ${
                        inicio === h
                          ? "border-blush-500 bg-blush-500 text-white"
                          : "border-blush-200 bg-white/80 text-ink hover:border-blush-400"
                      }`}
                    >
                      {formatearHora(h)}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </fieldset>

        {/* ───── Paso 3: seña y comprobante ───── */}
        <fieldset data-paso="2" hidden={paso !== 2} className="space-y-6">
          <legend className="sr-only">Seña y comprobante</legend>
          <div className="rounded-2xl bg-blush-50/80 p-5 text-center">
            <p className="text-sm text-ink-soft">
              {elegido?.nombre} · {inicio && formatearTurno(inicio)}
            </p>
            <p className="mt-3 font-display text-xl leading-snug text-ink">
              Para confirmar tu turno se requiere una seña del {p.senaPorcentaje}%.
            </p>
            <p className="mt-2 font-display text-4xl text-blush-600">
              {sena != null ? formatPrecio(sena) : `${p.senaPorcentaje}% del valor`}
            </p>
          </div>

          <div>
            <p className={estiloEtiqueta}>Datos para la transferencia</p>
            <dl className="divide-y divide-blush-100 rounded-2xl bg-white/80 px-4">
              <DatoBancario etiqueta="Alias" valor={p.banco.alias} copiable />
              <DatoBancario etiqueta="CBU" valor={p.banco.cbu} copiable />
              <DatoBancario etiqueta="Titular" valor={p.banco.titular} />
              <DatoBancario etiqueta="CUIT" valor={p.banco.cuit} />
            </dl>
          </div>

          <div>
            <label htmlFor="comprobante" className={estiloEtiqueta}>
              Subir comprobante (JPG, PNG o PDF · máx. 4 MB)
            </label>
            <input
              id="comprobante"
              name="comprobante"
              type="file"
              required
              accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
              onChange={alElegirArchivo}
              className="block w-full rounded-2xl border border-dashed border-blush-300 bg-white/70 p-4 text-sm text-ink-soft file:mr-4 file:rounded-full file:border-0 file:bg-blush-100 file:px-4 file:py-2.5 file:title-caps file:text-xs file:text-blush-600"
            />
            <p className="mt-2 text-xs leading-relaxed text-ink-soft">
              Tu turno queda <strong className="font-normal text-ink">pendiente de verificación</strong> hasta que Sofi revise el
              comprobante. Te avisamos por email cuando esté confirmado.
            </p>
          </div>

          {p.turnstileSiteKey && <div ref={turnstileRef} className="flex justify-center" />}
        </fieldset>

        {(errorLocal || errorServidor) && (
          <p role="alert" className="mt-6 rounded-2xl bg-blush-100 px-4 py-3 text-center text-sm text-blush-700">
            {errorLocal ?? errorServidor}
          </p>
        )}

        <div className="mt-8 flex flex-col-reverse items-center gap-3 sm:flex-row sm:justify-between">
          {paso > 0 ? (
            <button type="button" onClick={() => setPaso((n) => n - 1)} className={botonSecundario}>
              ← Volver
            </button>
          ) : (
            <span />
          )}
          {paso < 2 ? (
            <button type="button" onClick={siguiente} className={botonPrincipal}>
              Siguiente
            </button>
          ) : (
            <button type="submit" disabled={enviando} className={botonPrincipal}>
              {enviando ? "Enviando…" : "Enviar reserva"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
