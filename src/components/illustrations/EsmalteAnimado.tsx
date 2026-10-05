import { Dedos, ESMALTE, LINEA, una, type Dedo } from "./Manos";

const dedos: Dedo[] = [
  { x: 80, top: 50 },
  { x: 97, top: 42 },
  { x: 114, top: 48 },
];
const unaPintada = una(dedos[1]);

/**
 * Un esmalte se abre, el pincel viaja hasta una uña y la pinta.
 * Loop de 8 s. Coordenadas en el viewBox 0 0 140 140.
 */
export function EsmalteAnimado({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" className={className} role="img" aria-label="Esmalte pintando una uña">
      <style>{`
        .esm-tapa { transform-box: view-box; transform-origin: 28px 98px; animation: esm-tapa 8s cubic-bezier(.45,0,.25,1) infinite; }
        .esm-pintura { transform-box: fill-box; transform-origin: top; animation: esm-pintura 8s ease-in-out infinite; }
        .esm-brillo { transform-box: fill-box; transform-origin: center; animation: esm-brillo 8s ease-in-out infinite; }
        @keyframes esm-tapa {
          0%, 8% { transform: none; }
          16% { transform: translate(0px, -40px); }
          28% { transform: translate(75px, -50px) rotate(-14deg); }
          36% { transform: translate(75px, -40px) rotate(-14deg); }
          44% { transform: translate(75px, -48px) rotate(-14deg); }
          52% { transform: translate(75px, -38px) rotate(-14deg); }
          60% { transform: translate(75px, -46px) rotate(-14deg); }
          70% { transform: translate(0px, -40px); }
          78%, 100% { transform: none; }
        }
        @keyframes esm-pintura {
          0%, 28% { transform: scaleY(0); opacity: 1; }
          58%, 88% { transform: scaleY(1); opacity: 1; }
          96% { transform: scaleY(1); opacity: 0; }
          100% { transform: scaleY(0); opacity: 0; }
        }
        @keyframes esm-brillo {
          0%, 60% { opacity: 0; transform: scale(.3); }
          68% { opacity: 1; transform: scale(1); }
          80%, 100% { opacity: 0; transform: scale(.6); }
        }
      `}</style>
      <defs>
        <linearGradient id="esm-frasco" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#eb9db5" />
          <stop offset=".5" stopColor="#f4c0d0" />
          <stop offset="1" stopColor="#dc7499" />
        </linearGradient>
        <linearGradient id="esm-tapa-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f6e7d6" />
          <stop offset=".45" stopColor="#fffaf3" />
          <stop offset="1" stopColor="#e9d3bd" />
        </linearGradient>
      </defs>

      {/* Mano */}
      <Dedos dedos={dedos} />
      {dedos.map((d) => {
        const u = una(d);
        return <rect key={d.x} {...u} fill={d === dedos[1] ? "#fff" : ESMALTE} stroke={LINEA} strokeWidth=".8" />;
      })}
      <rect className="esm-pintura" {...unaPintada} fill={ESMALTE} />
      <path d={`M${unaPintada.x + 2.5} ${unaPintada.y + 4}v4`} stroke="#fff" strokeOpacity=".7" strokeWidth="1.3" strokeLinecap="round" />

      {/* Tapa + pincel (se dibuja antes del frasco para que el pincel quede "adentro") */}
      <g className="esm-tapa">
        <path d="M27 76v18" stroke="#b98a7a" strokeWidth="1.6" />
        <path d="M24.5 92c0 4 1.5 6.5 3.5 6.5s3.5-2.5 3.5-6.5Z" fill={ESMALTE} />
        <rect x="19" y="44" width="18" height="34" rx="4" fill="url(#esm-tapa-g)" stroke="#c9a98c" strokeWidth=".8" />
        <path d="M23 49v24" stroke="#fff" strokeOpacity=".9" strokeWidth="1.4" strokeLinecap="round" />
      </g>

      {/* Frasco */}
      <rect x="20" y="78" width="16" height="9" rx="2" fill="#f7d6e0" stroke={LINEA} strokeWidth=".8" />
      <path
        d="M14 92c0-3.5 2.5-6 6-6h16c3.5 0 6 2.5 6 6v30c0 4-3 7-7 7H21c-4 0-7-3-7-7Z"
        fill="url(#esm-frasco)"
        stroke={LINEA}
        strokeWidth=".9"
      />
      <path d="M19 95v22" stroke="#fff" strokeOpacity=".75" strokeWidth="2" strokeLinecap="round" />
      <path d="M23 96v6" stroke="#fff" strokeOpacity=".5" strokeWidth="1.2" strokeLinecap="round" />

      {/* Destello final */}
      <path
        className="esm-brillo"
        d="M121 30c.4 3 1.6 4.6 4.6 5-3 .4-4.2 2-4.6 5-.4-3-1.6-4.6-4.6-5 3-.4 4.2-2 4.6-5Z"
        fill="#fff"
        stroke="#eb9db5"
        strokeWidth=".5"
      />
    </svg>
  );
}
