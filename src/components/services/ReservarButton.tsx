import Link from "next/link";
import { linkWhatsapp } from "@/lib/contacto";
import { obtenerSitio, reservasOnline } from "@/lib/datos/contenido";
import type { Servicio } from "@/lib/datos/tipos";

const estilo =
  "inline-flex min-h-12 items-center justify-center rounded-full px-9 title-caps text-sm tracking-[0.3em] transition-all duration-500";

/**
 * Botón RESERVAR.
 * - Con la base de datos conectada: abre el sistema de reservas propio.
 * - Sin base de datos: abre WhatsApp con un mensaje ya armado.
 */
export async function ReservarButton({ servicio, tono = "rosa" }: { servicio: Servicio; tono?: "rosa" | "lavanda" }) {
  const color =
    tono === "lavanda"
      ? "bg-lavender-500 text-white shadow-[0_10px_30px_-10px_rgb(141_115_198/0.6)] hover:bg-lavender-700"
      : "bg-blush-500 text-white shadow-[0_10px_30px_-10px_rgb(220_116_153/0.65)] hover:bg-blush-600";

  if (reservasOnline()) {
    return (
      <Link href={`/reservar?servicio=${encodeURIComponent(servicio.slug)}`} className={`${estilo} ${color}`}>
        Reservar
      </Link>
    );
  }

  const href = linkWhatsapp(await obtenerSitio(), `¡Hola Sofi! Quiero reservar un turno de ${servicio.nombre}.`);
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
