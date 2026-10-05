import Image from "next/image";
import { imagenes } from "@/config/imagenes";
import { marca } from "@/config/sitio";

type Tamano = "hero" | "page" | "nav";

const anchoArchivo: Record<Tamano, number> = { hero: 360, page: 260, nav: 150 };

/**
 * Logo de la marca. Si en src/config/imagenes.ts se define `logo`,
 * usa ese archivo; si no, dibuja el logo tipográfico incluido.
 */
export function Logo({ tamano = "page", className = "" }: { tamano?: Tamano; className?: string }) {
  if (imagenes.logo) {
    const ancho = anchoArchivo[tamano];
    return (
      <Image
        src={imagenes.logo}
        alt={marca}
        width={ancho}
        height={ancho}
        preload={tamano === "hero"}
        className={`h-auto w-full ${className}`}
        style={{ maxWidth: ancho }}
      />
    );
  }

  const escala = {
    hero: { flamenco: "h-24 sm:h-28", sofia: "text-6xl sm:text-7xl", pink: "text-[0.7rem] sm:text-sm" },
    page: { flamenco: "h-16 sm:h-20", sofia: "text-5xl sm:text-6xl", pink: "text-[0.62rem] sm:text-xs" },
    nav: { flamenco: "h-9", sofia: "text-3xl", pink: "text-[0.5rem]" },
  }[tamano];

  return (
    <span
      role="img"
      aria-label={marca}
      className={`inline-flex flex-col items-center leading-none text-blush-600 ${className}`}
    >
      <Flamenco className={`${escala.flamenco} w-auto`} />
      <span className={`font-script ${escala.sofia} -mt-1 text-blush-600`} aria-hidden>
        Sofía
      </span>
      <span className={`title-caps ${escala.pink} mt-1 tracking-[0.42em] text-ink-soft`} aria-hidden>
        Pink Flamingo
      </span>
    </span>
  );
}

/** Flamenco en línea fina. También se usa como ícono/favicon. */
export function Flamenco({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 100" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id="flamenco-cuerpo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fadbe5" />
          <stop offset="1" stopColor="#eb9db5" />
        </linearGradient>
      </defs>
      <path
        d="M17 52c2-10 22-13 29-3 4 7-3 14-15 14-8 0-15-4-14-11Z"
        fill="url(#flamenco-cuerpo)"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M38 50c4 2 8 2 11-1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path
        d="M23 47c-9-8-9-18-1-24 6-5 8-10 3-14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="23.5" cy="8" r="3.2" fill="url(#flamenco-cuerpo)" stroke="currentColor" strokeWidth="1.2" />
      <path d="M20.5 7.5c-3 0-5.5 2.5-5.5 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15 12.2v2" stroke="#4b2e3b" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M32 63v34" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M32 74l8-6-6 11" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 97h8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}
