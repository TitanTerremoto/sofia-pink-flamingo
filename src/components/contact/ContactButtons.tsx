import { IconoEmail, IconoInstagram, IconoUbicacion, IconoWhatsapp } from "@/components/brand/Iconos";
import { linkComoLlegar, linkEmail, linkInstagram, linkWhatsapp } from "@/lib/contacto";

/** Botones grandes de contacto. Los que no tienen dato cargado se muestran desactivados. */
export function ContactButtons() {
  const botones = [
    { etiqueta: "WhatsApp", href: linkWhatsapp("¡Hola Sofi! Te escribo desde la web."), Icono: IconoWhatsapp },
    { etiqueta: "Instagram", href: linkInstagram(), Icono: IconoInstagram },
    { etiqueta: "Email", href: linkEmail(), Icono: IconoEmail },
    { etiqueta: "Cómo llegar", href: linkComoLlegar(), Icono: IconoUbicacion },
  ];

  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4">
      {botones.map(({ etiqueta, href, Icono }) => {
        const clase =
          "flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full px-4 title-caps text-[0.78rem] tracking-[0.2em] transition-all duration-500";
        return (
          <li key={etiqueta}>
            {href ? (
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`${clase} bg-white/80 text-ink shadow-softer hover:-translate-y-0.5 hover:bg-white hover:text-blush-600 active:scale-[.98]`}
              >
                <Icono className="h-5 w-5 text-blush-500" />
                {etiqueta}
              </a>
            ) : (
              <span className={`${clase} cursor-not-allowed bg-white/40 text-ink-soft/70`} title="Dato pendiente de configurar">
                <Icono className="h-5 w-5" />
                {etiqueta}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
