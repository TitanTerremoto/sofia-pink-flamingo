"use client";

import { useState } from "react";

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const DIAS = ["L", "M", "M", "J", "V", "S", "D"];

/** Suma días a una fecha YYYY-MM-DD (aritmética en UTC: no depende de la zona del navegador). */
function sumarDias(fecha: string, dias: number) {
  const d = new Date(`${fecha}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

/**
 * Calendario mensual para elegir el día. Sólo habilita días dentro del
 * horizonte de reservas y con disponibilidad semanal cargada; los horarios
 * reales los confirma el servidor al elegir el día.
 */
export function Calendario({
  hoy,
  horizonteDias,
  diasHabilitados,
  seleccionada,
  onElegir,
}: {
  hoy: string;
  horizonteDias: number;
  diasHabilitados: number[];
  seleccionada: string | null;
  onElegir: (fecha: string) => void;
}) {
  const limite = sumarDias(hoy, horizonteDias);
  const [mes, setMes] = useState(hoy.slice(0, 7)); // YYYY-MM

  const primero = `${mes}-01`;
  const anio = Number(mes.slice(0, 4));
  const numMes = Number(mes.slice(5, 7));
  const diasDelMes = new Date(Date.UTC(anio, numMes, 0)).getUTCDate();
  const desfase = (new Date(`${primero}T12:00:00Z`).getUTCDay() + 6) % 7; // lunes = 0

  const mesAnterior = sumarDias(primero, -1).slice(0, 7);
  const mesSiguiente = sumarDias(primero, diasDelMes).slice(0, 7);
  const puedeAtras = mes > hoy.slice(0, 7);
  const puedeAdelante = mesSiguiente <= limite.slice(0, 7);

  const habilitado = (f: string) =>
    f >= hoy && f <= limite && diasHabilitados.includes(new Date(`${f}T12:00:00Z`).getUTCDay());

  return (
    <div className="mx-auto max-w-sm">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMes(mesAnterior)}
          disabled={!puedeAtras}
          aria-label="Mes anterior"
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:bg-white/70 disabled:opacity-25"
        >
          ‹
        </button>
        <p className="title-caps text-sm text-ink" aria-live="polite">
          {MESES[numMes - 1]} {anio}
        </p>
        <button
          type="button"
          onClick={() => setMes(mesSiguiente)}
          disabled={!puedeAdelante}
          aria-label="Mes siguiente"
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:bg-white/70 disabled:opacity-25"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center" role="grid">
        {DIAS.map((d, i) => (
          <span key={i} className="pb-1 text-xs text-ink-soft" aria-hidden>
            {d}
          </span>
        ))}
        {Array.from({ length: desfase }, (_, i) => (
          <span key={`v${i}`} />
        ))}
        {Array.from({ length: diasDelMes }, (_, i) => {
          const f = `${mes}-${String(i + 1).padStart(2, "0")}`;
          const activo = habilitado(f);
          const elegido = seleccionada === f;
          return (
            <button
              key={f}
              type="button"
              disabled={!activo}
              onClick={() => onElegir(f)}
              aria-pressed={elegido}
              aria-label={`${i + 1} de ${MESES[numMes - 1]}`}
              className={`aspect-square rounded-full text-sm transition ${
                elegido
                  ? "bg-blush-500 text-white"
                  : activo
                    ? "bg-white/80 text-ink hover:bg-blush-100"
                    : "text-ink-soft/35"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      {diasHabilitados.length === 0 && (
        <p className="mt-4 text-center text-sm text-ink-soft">Todavía no hay días con turnos habilitados.</p>
      )}
    </div>
  );
}
