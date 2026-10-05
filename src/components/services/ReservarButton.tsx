import Link from "next/link";
import { sitio } from "@/config/sitio";
import { linkWhatsapp } from "@/lib/contacto";
import type { Servicio } from "@/content/servicios";

const estilo =
  "inline-flex min-h-12 items-center justify-center rounded-full px-9 title-caps text-sm tracking-[0.3em] transition-all duration-500";

/**
 * Botón RESERVAR.
 * - Modo "whatsapp" (Fase 1): abre WhatsApp con un mensaje ya armado.
 * - Modo "online"   (Fase 2): abre el sistema de reservas propio.
 * Se cambia en src/config/sitio.ts → reservas.modo.
 */
export function ReservarButton({ servicio, tono = "rosa" }: { servicio: Servicio; tono?: "rosa" | "lavanda" }) {
  const color =
    tono === "lavanda"
      ? "bg-lavender-500 text-white shadow-[0_10px_30px_-10px_rgb(141_115_198/0.6)] hover:bg-lavender-700"
      : "bg-blush-500 text-white shadow-[0_10px_30px_-10px_rgb(220_116_153/0.65)] hover:bg-blush-600";

  if (sitio.reservas.modo === "online") {
    return (
      <Link href={`/reservar?servicio=${servicio.slug}`} className={`${estilo} ${color}`}>
        Reservar
      </Link>
    );
  }

  const href = linkWhatsapp(`¡Hola Sofi! Quiero reservar un turno de ${servicio.nombre}.`);
  if (!href) {
    return (
      <span className={`${estilo} cursor-not-allowed bg-white/60 text-ink-soft`} title="Falta cargar el WhatsApp en la configuración">
        Reservar
      </span>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${estilo} ${color}`}>
      Reservar
    </a>
  );
}
