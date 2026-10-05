"use client";

import { useState } from "react";
import { estaCargado } from "@/lib/contacto";

/** Una fila de datos bancarios, con botón para copiar (alias y CBU). */
export function DatoBancario({ etiqueta, valor, copiable = false }: { etiqueta: string; valor: string; copiable?: boolean }) {
  const [copiado, setCopiado] = useState(false);
  const cargado = estaCargado(valor);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(valor);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      // Navegadores sin permiso de portapapeles: el dato igual queda visible para copiar a mano.
      setCopiado(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <dt className="title-caps text-xs text-ink-soft">{etiqueta}</dt>
      <dd className="flex min-w-0 items-center gap-2 text-right">
        <span className={`break-all ${cargado ? "text-ink" : "italic text-ink-soft"}`}>{cargado ? valor : "A completar"}</span>
        {copiable && cargado && (
          <button
            type="button"
            onClick={copiar}
            className="shrink-0 rounded-full bg-blush-100 px-3 py-1.5 text-xs text-blush-600 transition hover:bg-blush-200"
          >
            {copiado ? "¡Copiado!" : "Copiar"}
          </button>
        )}
      </dd>
    </div>
  );
}
