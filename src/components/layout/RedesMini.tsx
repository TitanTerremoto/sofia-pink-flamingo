import { IconoEmail, IconoInstagram, IconoWhatsapp } from "@/components/brand/Iconos";
import { linkEmail, linkInstagram, linkWhatsapp } from "@/lib/contacto";

/** Íconos de redes al pie del menú. Sólo aparecen los datos ya cargados en la configuración. */
export function RedesMini() {
  const redes = [
    { href: linkWhatsapp(), etiqueta: "WhatsApp", Icono: IconoWhatsapp },
    { href: linkInstagram(), etiqueta: "Instagram", Icono: IconoInstagram },
    { href: linkEmail(), etiqueta: "Email", Icono: IconoEmail },
  ].filter((r): r is typeof r & { href: string } => r.href !== null);

  if (redes.length === 0) return <span aria-hidden />;

  return (
    <ul className="flex justify-center gap-2">
      {redes.map(({ href, etiqueta, Icono }) => (
        <li key={etiqueta}>
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            aria-label={etiqueta}
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft transition-colors duration-500 hover:bg-white/70 hover:text-blush-600"
          >
            <Icono className="h-5 w-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
