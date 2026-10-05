"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** Colores RGB de los destellos, ej. ["255,255,255", "244,192,208"]. */
  colores?: string[];
  /** Densidad: destellos por cada 10.000 px² de pantalla (se limita en celular). */
  densidad?: number;
  className?: string;
};

type Destello = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  fase: number;
  velFase: number;
  color: string;
  cruz: boolean;
};

/**
 * Destellos suaves que flotan lentamente. Canvas liviano:
 * - se pausa cuando la pestaña no está visible o el canvas sale de pantalla;
 * - respeta "reducir movimiento" (queda estático);
 * - limita partículas, resolución y cuadros por segundo en celulares;
 * - cada brillo se dibuja una vez como "sello" y se reutiliza (sin crear
 *   degradés en cada cuadro).
 */
export function Sparkles({
  colores = ["255,255,255", "255,236,244", "244,192,208"],
  densidad = 0.5,
  className = "",
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const esCelular = window.matchMedia("(max-width: 640px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, esCelular ? 1.5 : 2);
    // En celular basta con 30 cuadros por segundo: el movimiento es muy lento.
    const msPorCuadro = esCelular ? 1000 / 30 : 0;
    let ultimoCuadro = 0;
    // Mismo ritmo visual con la mitad de cuadros.
    const paso = esCelular ? 2 : 1;

    // Un "sello" por color: halo radial pre-dibujado.
    const TAM_SELLO = 64;
    const sellos = new Map<string, HTMLCanvasElement>();
    for (const color of colores) {
      const sello = document.createElement("canvas");
      sello.width = sello.height = TAM_SELLO;
      const sctx = sello.getContext("2d");
      if (!sctx) continue;
      const g = sctx.createRadialGradient(TAM_SELLO / 2, TAM_SELLO / 2, 0, TAM_SELLO / 2, TAM_SELLO / 2, TAM_SELLO / 2);
      g.addColorStop(0, `rgba(${color},0.9)`);
      g.addColorStop(1, `rgba(${color},0)`);
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, TAM_SELLO, TAM_SELLO);
      sellos.set(color, sello);
    }
    let destellos: Destello[] = [];
    let ancho = 0;
    let alto = 0;
    let frame = 0;
    let visible = true;

    const crear = (): Destello => ({
      x: Math.random() * ancho,
      y: Math.random() * alto,
      r: 0.6 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -0.04 - Math.random() * 0.12,
      fase: Math.random() * Math.PI * 2,
      velFase: 0.006 + Math.random() * 0.014,
      color: colores[Math.floor(Math.random() * colores.length)],
      cruz: Math.random() < 0.18,
    });

    const medir = () => {
      const rect = canvas.getBoundingClientRect();
      ancho = rect.width;
      alto = rect.height;
      canvas.width = Math.round(ancho * dpr);
      canvas.height = Math.round(alto * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const maximo = ancho < 640 ? 45 : 110;
      const cantidad = Math.min(maximo, Math.round(((ancho * alto) / 10000) * densidad));
      destellos = Array.from({ length: cantidad }, crear);
    };

    const dibujar = () => {
      ctx.clearRect(0, 0, ancho, alto);
      for (const d of destellos) {
        if (!reducir) {
          d.x += d.vx * paso;
          d.y += d.vy * paso;
          d.fase += d.velFase * paso;
          if (d.y < -10) {
            d.y = alto + 10;
            d.x = Math.random() * ancho;
          }
          if (d.x < -10) d.x = ancho + 10;
          if (d.x > ancho + 10) d.x = -10;
        }
        const brillo = 0.25 + 0.75 * Math.abs(Math.sin(d.fase));
        const halo = d.r * 4;
        const sello = sellos.get(d.color);
        if (sello) {
          ctx.globalAlpha = brillo;
          ctx.drawImage(sello, d.x - halo, d.y - halo, halo * 2, halo * 2);
          ctx.globalAlpha = 1;
        }
        if (d.cruz) {
          ctx.strokeStyle = `rgba(255,255,255,${0.7 * brillo})`;
          ctx.lineWidth = 0.6;
          const l = d.r * 3.2 * brillo;
          ctx.beginPath();
          ctx.moveTo(d.x - l, d.y);
          ctx.lineTo(d.x + l, d.y);
          ctx.moveTo(d.x, d.y - l);
          ctx.lineTo(d.x, d.y + l);
          ctx.stroke();
        }
      }
    };

    const loop = (ahora = 0) => {
      if (ahora - ultimoCuadro >= msPorCuadro) {
        ultimoCuadro = ahora;
        dibujar();
      }
      if (!reducir && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    const reanudar = () => {
      cancelAnimationFrame(frame);
      if (visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    medir();
    loop();

    const ro = new ResizeObserver(() => {
      medir();
      if (reducir) dibujar();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entrada]) => {
      visible = entrada.isIntersecting;
      reanudar();
    });
    io.observe(canvas);

    document.addEventListener("visibilitychange", reanudar);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", reanudar);
    };
    // Los colores se pasan como literales; recrear el efecto si cambian no aporta nada.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [densidad]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none h-full w-full ${className}`} />;
}
