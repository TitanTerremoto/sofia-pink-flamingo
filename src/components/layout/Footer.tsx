import Link from "next/link";
import { Flamenco } from "@/components/brand/Logo";
import { sitio } from "@/config/sitio";
import { navegacion } from "./navegacion";
import { RedesMini } from "./RedesMini";

export function Footer() {
  return (
    <footer className="border-t border-white/70 bg-white/40 px-6 py-10 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
        <Link href="/" className="flex items-center gap-2 text-blush-600" aria-label="Ir al inicio">
          <Flamenco className="h-8 w-auto" />
          <span className="font-script text-3xl">Sofía</span>
          <span className="title-caps text-[0.6rem] text-ink-soft">Pink Flamingo</span>
        </Link>
        <nav aria-label="Pie de página">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {navegacion.map(({ href, etiqueta }) => (
              <li key={href}>
                <Link href={href} className="title-caps text-xs text-ink-soft transition-colors hover:text-blush-600">
                  {etiqueta}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <RedesMini />
        <p className="text-xs text-ink-soft">
          © {new Date().getFullYear()} {sitio.marca} · {sitio.ubicacion.barrio}, {sitio.ubicacion.ciudad}
        </p>
      </div>
    </footer>
  );
}
