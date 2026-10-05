import { IconoUbicacion } from "@/components/brand/Iconos";
import { urlMapaEmbebido } from "@/lib/contacto";
import { obtenerSitio } from "@/lib/datos/contenido";

/** Mapa de Google Maps embebido (no requiere API key). */
export async function MapEmbed({ className = "" }: { className?: string }) {
  const url = urlMapaEmbebido(await obtenerSitio());
  return (
    <div className={`overflow-hidden rounded-[2rem] border-4 border-white shadow-softer ${className}`}>
      {url ? (
        <iframe
          src={url}
          title="Ubicación en Google Maps"
          className="h-full min-h-72 w-full grayscale-[25%] saturate-[.85]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="flex h-full min-h-72 flex-col items-center justify-center gap-3 bg-white/60 p-8 text-center text-ink-soft">
          <IconoUbicacion className="h-8 w-8 text-blush-400" />
          <p className="text-sm">El mapa aparece automáticamente al completar la dirección en la configuración.</p>
        </div>
      )}
    </div>
  );
}
