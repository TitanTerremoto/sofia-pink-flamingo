import Link from "next/link";
import { Flamenco } from "@/components/brand/Logo";
import { marca } from "@/config/sitio";
import { obtenerSitio } from "@/lib/datos/contenido";
import { redesCargadas } from "@/lib/contacto";
import { navegacion } from "./navegacion";
import { RedesMini } from "./RedesMini";

export async function Footer() {
  const sitio = await obtenerSitio();
  return (
    <footer className="border-t border-white/70 bg-white/40 px-6 py-10 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
        <Link href="/" className="flex min-h-11 items-center gap-2 text-blush-600" aria-label="Ir al inicio">
          <Flamenco className="h-8 w-auto" />
          <span className="font-script text-3xl">Sofía</span>
          <span className="title-caps text-[0.6rem] text-ink-soft">Pink Flamingo</span>
        </Link>
        <nav aria-label="Pie de página">
          <ul className="flex flex-wrap justify-center gap-x-2">
            {navegacion.map(({ href, etiqueta }) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-11 items-center px-3 title-caps text-xs text-ink-soft transition-colors hover:text-blush-600">
                  {etiqueta}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <RedesMini redes={redesCargadas(sitio)} />
        <p className="text-xs text-ink-soft">
          © {new Date().getFullYear()} {marca} · {sitio.ubicacion.barrio}, {sitio.ubicacion.ciudad}
        </p>
      </div>
    </footer>
  );
}
