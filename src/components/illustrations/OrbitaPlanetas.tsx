import { Logo } from "@/components/brand/Logo";

/**
 * Logo en el centro con planetas girando muy lento en tres órbitas.
 * Cada planeta contra-rota para mantenerse derecho (por ejemplo, el anillo de Saturno).
 */

type Planeta = { nombre: string; angulo: number; tamano: number; dibujo: React.ReactNode };
type Orbita = { radio: number; duracion: number; sentido: 1 | -1; planetas: Planeta[] };

const orbitas: Orbita[] = [
  {
    radio: 31,
    duracion: 110,
    sentido: 1,
    planetas: [
      { nombre: "Mercurio", angulo: 40, tamano: 7, dibujo: <Mercurio /> },
      { nombre: "Luna", angulo: 215, tamano: 9, dibujo: <Luna /> },
    ],
  },
  {
    radio: 40,
    duracion: 160,
    sentido: -1,
    planetas: [
      { nombre: "Sol", angulo: 120, tamano: 13, dibujo: <Sol /> },
      { nombre: "Marte", angulo: 300, tamano: 8, dibujo: <Marte /> },
    ],
  },
  {
    radio: 48,
    duracion: 220,
    sentido: 1,
    planetas: [
      { nombre: "Saturno", angulo: 10, tamano: 16, dibujo: <Saturno /> },
      { nombre: "Júpiter", angulo: 135, tamano: 12, dibujo: <Jupiter /> },
      { nombre: "Urano", angulo: 250, tamano: 10, dibujo: <Urano /> },
    ],
  },
];

export function OrbitaPlanetas() {
  return (
    <div
      className="relative mx-auto aspect-square w-[min(88vw,30rem)]"
      role="img"
      aria-label="Logo de Sofía Pink Flamingo rodeado de Saturno, Sol, Luna, Urano, Marte, Mercurio y Júpiter en órbita"
    >
      <style>{`
        .orb-giro { animation: orb-giro var(--dur) linear infinite; animation-direction: var(--dir); }
        .orb-contra { animation: orb-giro var(--dur) linear infinite; animation-direction: var(--contra); }
        @keyframes orb-giro { to { transform: rotate(360deg); } }
      `}</style>

      {/* halo central */}
      <div className="absolute inset-[22%] rounded-full bg-white/50 blur-2xl" aria-hidden />

      {orbitas.map((o) => (
        <div
          key={o.radio}
          aria-hidden
          className="orb-giro absolute rounded-full border border-white/80 shadow-[0_0_0_1px_rgb(197_177_234/0.25)]"
          style={
            {
              inset: `${50 - o.radio}%`,
              "--dur": `${o.duracion}s`,
              "--dir": o.sentido === 1 ? "normal" : "reverse",
              "--contra": o.sentido === 1 ? "reverse" : "normal",
            } as React.CSSProperties
          }
        >
          {o.planetas.map((p) => {
            const rad = (p.angulo * Math.PI) / 180;
            return (
              <div
                key={p.nombre}
                title={p.nombre}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${50 + 50 * Math.sin(rad)}%`,
                  top: `${50 - 50 * Math.cos(rad)}%`,
                  width: `${(p.tamano / (o.radio * 2)) * 100}%`,
                }}
              >
                <div className="orb-contra aspect-square w-full">{p.dibujo}</div>
              </div>
            );
          })}
        </div>
      ))}

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-logo-in w-[38%]">
          <Logo tamano="page" className="scale-[0.82] sm:scale-100" />
        </div>
      </div>
    </div>
  );
}

/* ───────────── Planetas (SVG, viewBox 0 0 40 40) ───────────── */

function Sol() {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full overflow-visible">
      <defs>
        <radialGradient id="pl-sol" cx=".4" cy=".4" r=".7">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset=".55" stopColor="#ffe2b8" />
          <stop offset="1" stopColor="#f6b9a6" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="19" fill="#fff1d6" opacity=".45" />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d="M20 3.5v4" stroke="#f5c99a" strokeWidth=".9" strokeLinecap="round" transform={`rotate(${i * 30} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="10" fill="url(#pl-sol)" />
    </svg>
  );
}

function Luna() {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full">
      <defs>
        <linearGradient id="pl-luna" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ddd0f4" />
        </linearGradient>
      </defs>
      <path d="M26 4a16 16 0 1 0 10 26A13 13 0 0 1 26 4Z" fill="url(#pl-luna)" stroke="#c5b1ea" strokeWidth=".8" />
    </svg>
  );
}

function Mercurio() {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full">
      <defs>
        <radialGradient id="pl-mercurio" cx=".35" cy=".35" r=".75">
          <stop offset="0" stopColor="#f4f1f7" />
          <stop offset="1" stopColor="#b9adc9" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="17" fill="url(#pl-mercurio)" />
      <circle cx="14" cy="16" r="2.5" fill="#a89cba" opacity=".5" />
      <circle cx="25" cy="25" r="3.2" fill="#a89cba" opacity=".4" />
    </svg>
  );
}

function Marte() {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full">
      <defs>
        <radialGradient id="pl-marte" cx=".35" cy=".35" r=".75">
          <stop offset="0" stopColor="#fbd9d0" />
          <stop offset="1" stopColor="#d98476" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="17" fill="url(#pl-marte)" />
      <path d="M9 22c6-2 14 2 22-1" stroke="#c86f63" strokeOpacity=".35" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Jupiter() {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full">
      <defs>
        <clipPath id="pl-jupiter-c">
          <circle cx="20" cy="20" r="17" />
        </clipPath>
      </defs>
      <g clipPath="url(#pl-jupiter-c)">
        <rect width="40" height="40" fill="#fbe6d6" />
        <rect y="10" width="40" height="4" fill="#efc2b0" />
        <rect y="17" width="40" height="3" fill="#f7d6c6" />
        <rect y="23" width="40" height="5" fill="#e9b4a6" />
        <rect y="31" width="40" height="3" fill="#efc2b0" />
        <ellipse cx="27" cy="25.5" rx="3.5" ry="2" fill="#d99a8c" />
      </g>
      <circle cx="20" cy="20" r="17" fill="none" stroke="#fff" strokeOpacity=".6" />
    </svg>
  );
}

function Saturno() {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full overflow-visible">
      <defs>
        <radialGradient id="pl-saturno" cx=".35" cy=".35" r=".75">
          <stop offset="0" stopColor="#fff6e6" />
          <stop offset="1" stopColor="#e8cfa6" />
        </radialGradient>
      </defs>
      <ellipse cx="20" cy="20" rx="19" ry="5.5" fill="none" stroke="#e3c7a0" strokeWidth="1.6" transform="rotate(-18 20 20)" />
      <circle cx="20" cy="20" r="10" fill="url(#pl-saturno)" />
      {/* mitad delantera del anillo, por encima del planeta */}
      <path d="M1.93 25.87A19 5.5 -18 0 0 38.07 14.13" fill="none" stroke="#e3c7a0" strokeWidth="1.6" />
    </svg>
  );
}

function Urano() {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full overflow-visible">
      <defs>
        <radialGradient id="pl-urano" cx=".35" cy=".35" r=".75">
          <stop offset="0" stopColor="#f3fbff" />
          <stop offset="1" stopColor="#a9d3ea" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="14" fill="url(#pl-urano)" />
      <ellipse cx="20" cy="20" rx="4" ry="19" fill="none" stroke="#cfe6f4" strokeWidth="1" transform="rotate(12 20 20)" />
    </svg>
  );
}
