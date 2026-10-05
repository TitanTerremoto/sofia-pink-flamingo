import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";
import { redesCargadas } from "@/lib/contacto";
import { obtenerSitio } from "@/lib/datos/contenido";

/** Estructura del sitio público: menú lateral + contenido + pie. */
export default async function LayoutSitio({ children }: LayoutProps<"/">) {
  const sitio = await obtenerSitio();
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
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
