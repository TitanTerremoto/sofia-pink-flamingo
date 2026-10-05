"use client";

import { useActionState } from "react";
import type { Aviso } from "@/lib/admin/acciones";

/** Formulario del panel: ejecuta la acción del servidor y muestra el resultado. */
export function FormAccion({
  accion,
  boton,
  children,
  className = "",
  variante = "principal",
  confirmar,
}: {
  accion: (previo: Aviso, form: FormData) => Promise<Aviso>;
  boton: string;
  children?: React.ReactNode;
  className?: string;
  variante?: "principal" | "peligro" | "suave";
  /** Pregunta de confirmación antes de enviar (acciones importantes). */
  confirmar?: string;
}) {
  const [aviso, enviar, enviando] = useActionState(accion, null);
  const estilos = {
    principal: "bg-blush-500 text-white hover:bg-blush-600",
    peligro: "bg-white text-rose-700 ring-1 ring-rose-200 hover:bg-rose-50",
    suave: "bg-white text-ink ring-1 ring-blush-200 hover:bg-blush-50",
  };

  return (
    <form
      action={enviar}
      className={className}
      onSubmit={(e) => {
        if (confirmar && !window.confirm(confirmar)) e.preventDefault();
      }}
    >
      {children}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={enviando}
          className={`min-h-11 rounded-full px-6 text-sm font-normal transition disabled:cursor-wait disabled:opacity-60 ${estilos[variante]}`}
        >
          {enviando ? "Guardando…" : boton}
        </button>
        {aviso && (
          <p role="status" className={`text-sm ${aviso.tipo === "ok" ? "text-emerald-700" : "text-rose-700"}`}>
            {aviso.mensaje}
          </p>
        )}
      </div>
    </form>
  );
}

export const estiloCampo =
  "w-full rounded-xl border border-blush-200 bg-white px-3.5 py-2.5 text-base text-ink outline-none focus:border-blush-400 focus:ring-4 focus:ring-blush-100";
export const estiloEtiqueta = "mb-1 block text-xs font-normal uppercase tracking-wider text-ink-soft";
