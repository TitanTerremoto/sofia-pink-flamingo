import { Sparkles } from "./Sparkles";

export type Ambiente = "inicio" | "manicuria" | "rostro" | "astrologia" | "contacto";

/** Fondo fijo de cada página: degradé propio + destellos. */
const fondos: Record<
  Ambiente,
  { degrade: string; colores: string[]; densidad: number; acompanaScroll?: boolean }
> = {
  inicio: {
    degrade: "linear-gradient(180deg, #fff8fa 0%, #fdeff3 45%, #fff8fa 100%)",
    colores: ["255,255,255", "255,236,244", "244,192,208"],
    densidad: 0.45,
  },
  manicuria: {
    degrade:
      "radial-gradient(120% 70% at 10% 0%, #fadbe5 0%, transparent 60%), radial-gradient(90% 60% at 100% 40%, #fde4ec 0%, transparent 65%), linear-gradient(180deg, #fdeff3 0%, #fff8fa 55%, #fdeff3 100%)",
    colores: ["255,255,255", "255,228,238", "235,157,181"],
    densidad: 0.55,
  },
  rostro: {
    degrade: "linear-gradient(180deg, #f2b3c7 0%, #f7cbd8 22%, #fbe1e9 50%, #fdf0f4 78%, #fff8fa 100%)",
    colores: ["255,255,255", "255,240,245"],
    densidad: 0.35,
    // El degradé se aclara a lo largo de toda la página, no sólo de la pantalla.
    acompanaScroll: true,
  },
  astrologia: {
    degrade:
      "radial-gradient(80% 50% at 50% 0%, #e7dcf8 0%, transparent 70%), radial-gradient(70% 50% at 0% 60%, #e3effb 0%, transparent 70%), radial-gradient(70% 50% at 100% 85%, #fbe4ee 0%, transparent 70%), linear-gradient(180deg, #ddd0f4 0%, #ede5fa 40%, #f7f3fd 100%)",
    colores: ["255,255,255", "226,236,251", "221,208,244", "255,246,230"],
    densidad: 0.7,
  },
  contacto: {
    degrade: "linear-gradient(170deg, #fdeff3 0%, #fadbe5 40%, #eedcf3 75%, #e7dcf8 100%)",
    colores: ["255,255,255", "250,219,229", "221,208,244"],
    densidad: 0.4,
  },
};

/**
 * Debe usarse dentro de un contenedor `relative` (el layout ya lo es).
 * El degradé puede quedar fijo o recorrer toda la página; los destellos
 * siempre quedan fijos para que el canvas tenga el tamaño de la pantalla.
 */
export function PageBackground({ ambiente }: { ambiente: Ambiente }) {
  const f = fondos[ambiente];
  return (
    <>
      <div
        aria-hidden
        className={`pointer-events-none inset-0 -z-20 ${f.acompanaScroll ? "absolute" : "fixed"}`}
        style={{ background: f.degrade }}
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <Sparkles colores={f.colores} densidad={f.densidad} />
      </div>
    </>
  );
}
