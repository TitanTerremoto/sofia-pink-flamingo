import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";
import { modoEjemplo } from "@/config/ejemplo";
import { BotonReservarFlotante } from "@/components/layout/BotonReservarFlotante";
import { linkWhatsapp, redesCargadas } from "@/lib/contacto";
import { obtenerSitio, reservasOnline } from "@/lib/datos/contenido";

/** Estructura del sitio público: menú lateral + contenido + pie. */
export default async function LayoutSitio({ children }: LayoutProps<"/">) {
  const sitio = await obtenerSitio();
  const online = reservasOnline();
  const hrefReservar = online ? "/reservar" : linkWhatsapp(sitio, "¡Hola Sofi! Quiero reservar un turno.");
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
      >
        Saltar al contenido
      </a>
      <Sidebar redes={redesCargadas(sitio)} />
      <div className="relative isolate flex min-h-dvh flex-col pt-16 lg:pl-64 lg:pt-0">
        {modoEjemplo && (
          <p className="mx-auto mt-3 w-fit rounded-full bg-white/80 px-4 py-1.5 text-center text-xs text-ink-soft shadow-softer">
            Vista previa · fotos y precios de ejemplo
          </p>
        )}
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
      {hrefReservar && <BotonReservarFlotante href={hrefReservar} externo={!online} />}
    </>
  );
}
