import { IconoEmail, IconoInstagram, IconoWhatsapp } from "@/components/brand/Iconos";
import type { Red } from "@/lib/contacto";

const datos = {
  whatsapp: { etiqueta: "WhatsApp", Icono: IconoWhatsapp },
  instagram: { etiqueta: "Instagram", Icono: IconoInstagram },
  email: { etiqueta: "Email", Icono: IconoEmail },
};

/** Íconos de redes al pie del menú. Sólo aparecen los datos ya cargados. */
export function RedesMini({ redes }: { redes: Red[] }) {
  if (redes.length === 0) return <span aria-hidden />;

  return (
    <ul className="flex justify-center gap-2">
      {redes.map(({ red, href }) => {
        const { etiqueta, Icono } = datos[red];
        return (
          <li key={red}>
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
        );
      })}
    </ul>
  );
}
