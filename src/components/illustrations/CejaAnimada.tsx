/**
 * Una ceja que se va rellenando mientras un pincel en ángulo la recorre.
 * Loop de 6 s.
 */

const CEJA = "M14 64C32 44 72 34 120 48c3 1 3 5-1 5C82 45 46 50 18 68c-3 2-6-1-4-4Z";

const pelos = Array.from({ length: 16 }, (_, i) => {
  const t = i / 15;
  const x = 18 + t * 98;
  const y = 64 - 26 * Math.sin(t * Math.PI * 0.85) + t * 6;
  const inclinacion = 6 + t * 6;
  return `M${x.toFixed(1)} ${(y + 3).toFixed(1)}l${inclinacion.toFixed(1)} -${(5 - t * 2).toFixed(1)}`;
});

export function CejaAnimada({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 110" className={className} role="img" aria-label="Pincel aplicando producto en una ceja">
      <style>{`
        .ceja-relleno { transform-box: fill-box; transform-origin: left; animation: ceja-relleno 6s ease-in-out infinite; }
        .ceja-pincel { animation: ceja-pincel 6s ease-in-out infinite; }
        @keyframes ceja-relleno {
          0%, 8% { transform: scaleX(0); opacity: 1; }
          62%, 86% { transform: scaleX(1); opacity: 1; }
          96%, 100% { transform: scaleX(1); opacity: 0; }
        }
        @keyframes ceja-pincel {
          0% { transform: translate(8px, 82px); opacity: 0; }
          8% { transform: translate(18px, 62px); opacity: 1; }
          24% { transform: translate(44px, 50px); }
          40% { transform: translate(74px, 44px); }
          56% { transform: translate(104px, 47px); }
          64% { transform: translate(118px, 50px); opacity: 1; }
          76%, 100% { transform: translate(128px, 78px); opacity: 0; }
        }
      `}</style>
      <defs>
        <clipPath id="ceja-forma">
          <path d={CEJA} />
        </clipPath>
        <linearGradient id="ceja-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b98a8f" stopOpacity=".55" />
          <stop offset=".5" stopColor="#8e5f5c" stopOpacity=".85" />
          <stop offset="1" stopColor="#8e5f5c" stopOpacity=".7" />
        </linearGradient>
      </defs>

      {/* Contorno de la ceja y producto que se va aplicando */}
      <path d={CEJA} fill="#fdeff3" stroke="#c0567c" strokeWidth=".7" strokeDasharray="2 2.5" strokeOpacity=".7" />
      <g clipPath="url(#ceja-forma)">
        <rect className="ceja-relleno" x="12" y="30" width="114" height="42" fill="url(#ceja-g)" />
      </g>
      {pelos.map((d) => (
        <path key={d} d={d} stroke="#5b3a40" strokeWidth=".8" strokeLinecap="round" opacity=".55" />
      ))}

      {/* Pincel en ángulo: la punta está en (0,0) del grupo */}
      <g className="ceja-pincel">
        <g transform="rotate(-28)">
          <path d="M-4 -1h8l-1.5 9h-5Z" fill="#5b3a40" />
          <rect x="-2.8" y="8" width="5.6" height="9" rx="1" fill="#e9d3bd" stroke="#c9a98c" strokeWidth=".5" />
          <rect x="-2.2" y="17" width="4.4" height="34" rx="2.2" fill="#f4c0d0" stroke="#c0567c" strokeWidth=".6" />
          <path d="M-.8 20v26" stroke="#fff" strokeOpacity=".8" strokeWidth=".9" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}
