/** Dedos estilizados con uñas, compartidos por las ilustraciones de manicuría. */

export type Dedo = { x: number; top: number };

export const PIEL = "#fde9ee";
export const LINEA = "#c0567c";
export const ESMALTE = "#dc7499";

export function Dedos({ dedos, ancho = 15, base = 140 }: { dedos: Dedo[]; ancho?: number; base?: number }) {
  return (
    <g>
      {dedos.map((d) => (
        <rect
          key={d.x}
          x={d.x}
          y={d.top}
          width={ancho}
          height={base - d.top + 10}
          rx={ancho / 2}
          fill={PIEL}
          stroke={LINEA}
          strokeWidth="1"
        />
      ))}
    </g>
  );
}

/** Rectángulo de la uña ubicado sobre la punta de un dedo. */
export function una(d: Dedo, ancho = 15) {
  return { x: d.x + 2.5, y: d.top + 3, width: ancho - 5, height: 14, rx: (ancho - 5) / 2 };
}
