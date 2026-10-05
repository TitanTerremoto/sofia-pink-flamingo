/**
 * Ojo con pestañas: parpadeo lento y un aleteo muy sutil de las pestañas.
 * El párpado superior (y sus pestañas) se pliega sobre la línea del ojo.
 */

const CENTRO_Y = 55;
/** Punto sobre el párpado superior (Bézier cuadrática simétrica) para t ∈ [0,1]. */
const enParpado = (t: number) => ({ x: 20 + 100 * t, y: CENTRO_Y - 80 * t * (1 - t) });

const pestanas = [0.14, 0.24, 0.34, 0.44, 0.54, 0.64, 0.74, 0.84].map((t) => {
  const p = enParpado(t);
  const abre = (t - 0.5) * 34;
  const largo = 15 - Math.abs(t - 0.55) * 10;
  return `M${p.x.toFixed(1)} ${p.y.toFixed(1)} q${(abre * 0.25).toFixed(1)} ${(-largo * 0.7).toFixed(1)} ${(abre * 0.6 + 4).toFixed(1)} ${(-largo).toFixed(1)}`;
});

export function OjoAnimado({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 100" className={className} role="img" aria-label="Ojo con pestañas">
      <style>{`
        .ojo-parpado { transform-box: view-box; transform-origin: 70px ${CENTRO_Y}px; animation: ojo-parpado 6s ease-in-out infinite; }
        .ojo-globo { transform-box: view-box; transform-origin: 70px ${CENTRO_Y}px; animation: ojo-globo 6s ease-in-out infinite; }
        .ojo-pestanas { transform-box: view-box; transform-origin: 70px ${CENTRO_Y}px; animation: ojo-aleteo 3s ease-in-out infinite alternate; }
        .ojo-iris { animation: ojo-mira 12s ease-in-out infinite; }
        @keyframes ojo-parpado {
          0%, 86%, 100% { transform: scaleY(1); }
          91% { transform: scaleY(-.35); }
        }
        @keyframes ojo-globo {
          0%, 86%, 100% { transform: scaleY(1); }
          91% { transform: scaleY(.02); }
        }
        @keyframes ojo-aleteo {
          from { transform: rotate(-1deg) scaleY(1); }
          to { transform: rotate(1deg) scaleY(1.04); }
        }
        @keyframes ojo-mira {
          0%, 30%, 100% { transform: translateX(0); }
          40%, 55% { transform: translateX(-5px); }
          65%, 80% { transform: translateX(4px); }
        }
      `}</style>
      <defs>
        <radialGradient id="ojo-iris-g" cx=".45" cy=".4" r=".7">
          <stop offset="0" stopColor="#c99a8c" />
          <stop offset=".6" stopColor="#8e5f5c" />
          <stop offset="1" stopColor="#5b3a40" />
        </radialGradient>
        <clipPath id="ojo-forma">
          <path d={`M20 ${CENTRO_Y}Q70 15 120 ${CENTRO_Y}Q70 85 20 ${CENTRO_Y}Z`} />
        </clipPath>
      </defs>

      {/* Globo ocular */}
      <g className="ojo-globo">
        <path d={`M20 ${CENTRO_Y}Q70 15 120 ${CENTRO_Y}Q70 85 20 ${CENTRO_Y}Z`} fill="#fffafb" />
        <g clipPath="url(#ojo-forma)">
          <g className="ojo-iris">
            <circle cx="70" cy={CENTRO_Y} r="17" fill="url(#ojo-iris-g)" />
            <circle cx="70" cy={CENTRO_Y} r="7" fill="#3d262b" />
            <circle cx="64" cy={CENTRO_Y - 6} r="3.2" fill="#fff" fillOpacity=".9" />
            <circle cx="75" cy={CENTRO_Y + 5} r="1.4" fill="#fff" fillOpacity=".6" />
          </g>
        </g>
      </g>

      {/* Línea inferior */}
      <path d={`M20 ${CENTRO_Y}Q70 85 120 ${CENTRO_Y}`} fill="none" stroke="#c0567c" strokeWidth="1" strokeOpacity=".6" />
      {[0.3, 0.5, 0.7].map((t) => (
        <path
          key={t}
          d={`M${20 + 100 * t} ${CENTRO_Y + 80 * t * (1 - t) * 0.5 + 15 * (1 - Math.abs(t - 0.5))}l${(t - 0.5) * 6} 4`}
          stroke="#7a5867"
          strokeWidth=".7"
          strokeLinecap="round"
          opacity=".5"
        />
      ))}

      {/* Párpado superior + pestañas */}
      <g className="ojo-parpado">
        <path d={`M14 ${CENTRO_Y + 2}Q70 7 126 ${CENTRO_Y + 2}`} fill="none" stroke="#eb9db5" strokeWidth="1" strokeOpacity=".6" />
        <path d={`M20 ${CENTRO_Y}Q70 15 120 ${CENTRO_Y}`} fill="none" stroke="#4b2e3b" strokeWidth="2.2" strokeLinecap="round" />
        <g className="ojo-pestanas">
          {pestanas.map((d) => (
            <path key={d} d={d} fill="none" stroke="#4b2e3b" strokeWidth="1.3" strokeLinecap="round" />
          ))}
        </g>
      </g>
    </svg>
  );
}
