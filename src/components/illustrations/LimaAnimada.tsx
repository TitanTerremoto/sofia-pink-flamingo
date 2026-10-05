import { Dedos, LINEA, una, type Dedo } from "./Manos";

const dedos: Dedo[] = [
  { x: 28, top: 52 },
  { x: 45, top: 44 },
  { x: 62, top: 50 },
];

const polvo = [
  { x: 42, d: 0 },
  { x: 53, d: 0.5 },
  { x: 64, d: 1 },
  { x: 49, d: 1.5 },
];

/** Una lima se desliza suavemente sobre las puntas de las uñas. */
export function LimaAnimada({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" className={className} role="img" aria-label="Lima puliendo las uñas">
      <style>{`
        .lima-mov { animation: lima-mov 1.8s ease-in-out infinite alternate; }
        .lima-polvo { animation: lima-polvo 2s ease-in infinite; opacity: 0; }
        @keyframes lima-mov {
          from { transform: translateX(-9px); }
          to { transform: translateX(9px); }
        }
        @keyframes lima-polvo {
          0% { opacity: 0; transform: translateY(0); }
          20% { opacity: .9; }
          100% { opacity: 0; transform: translateY(16px); }
        }
      `}</style>
      <defs>
        <linearGradient id="lima-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".2" stopColor="#f4c0d0" />
          <stop offset=".8" stopColor="#f4c0d0" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <pattern id="lima-grano" width="3" height="3" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r=".45" fill="#c0567c" fillOpacity=".35" />
        </pattern>
      </defs>

      <Dedos dedos={dedos} />
      {dedos.map((d) => (
        <rect key={d.x} {...una(d)} fill="#f4c0d0" stroke={LINEA} strokeWidth=".8" />
      ))}

      {polvo.map((p) => (
        <circle
          key={p.x}
          className="lima-polvo"
          cx={p.x}
          cy="44"
          r=".9"
          fill="#fff"
          stroke="#eb9db5"
          strokeWidth=".3"
          style={{ animationDelay: `${p.d}s` }}
        />
      ))}

      <g transform="rotate(-8 60 36)">
        <g className="lima-mov">
          <rect x="14" y="31" width="104" height="9" rx="4.5" fill="url(#lima-g)" stroke={LINEA} strokeWidth=".8" />
          <rect x="30" y="32.5" width="72" height="6" rx="3" fill="url(#lima-grano)" />
          <path d="M20 33.5h8" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}
