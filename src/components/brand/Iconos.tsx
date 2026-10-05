/** Íconos de línea fina, coherentes con la estética de la marca. */
type P = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const IconoDestello = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
    <path d="M12 2c.6 4.6 2.4 7.4 7 8-4.6.6-6.4 3.4-7 8-.6-4.6-2.4-7.4-7-8 4.6-.6 6.4-3.4 7-8Z" />
  </svg>
);

export const IconoWhatsapp = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6Z" />
    <path d="M9.3 8.6c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .4-.1.6l-.5.6c.6 1.1 1.4 1.9 2.6 2.5l.6-.6c.2-.2.4-.2.6-.1l1.4.7c.3.1.3.3.3.5 0 .9-.8 1.6-1.6 1.6-3 0-6.1-3-6.1-6 0-.3.1-.8.4-1.2Z" />
  </svg>
);

export const IconoInstagram = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
  </svg>
);

export const IconoEmail = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export const IconoUbicacion = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);

export const IconoReloj = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const IconoMenu = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4 7h16M7 12h13M4 17h16" />
  </svg>
);

export const IconoCerrar = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconoFlecha = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const IconoEstrella = ({ className = "" }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
    <path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8Z" />
  </svg>
);
