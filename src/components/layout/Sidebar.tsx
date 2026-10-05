"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Flamenco, Logo } from "@/components/brand/Logo";
import { IconoCerrar, IconoDestello, IconoMenu } from "@/components/brand/Iconos";
import { navegacion } from "./navegacion";
import { RedesMini } from "./RedesMini";
import type { Red } from "@/lib/contacto";

function ItemsMenu({ onNavigate }: { onNavigate?: () => void }) {
  const ruta = usePathname();
  return (
    <ul className="flex flex-col gap-1">
      {navegacion.map(({ href, etiqueta }) => {
        const activo = ruta === href;
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={activo ? "page" : undefined}
              className={`group flex min-h-12 items-center gap-3 rounded-full px-5 title-caps text-[0.95rem] transition-colors duration-500 ${
                activo ? "bg-white/70 text-blush-600 shadow-softer" : "text-ink hover:bg-white/50 hover:text-blush-600"
              }`}
            >
              <IconoDestello
                className={`h-3 w-3 shrink-0 transition-all duration-700 ${
                  activo ? "scale-100 text-blush-500 opacity-100" : "scale-50 text-blush-400 opacity-0 group-hover:scale-90 group-hover:opacity-100"
                }`}
              />
              {etiqueta}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function Sidebar({ redes }: { redes: Red[] }) {
  const [abierto, setAbierto] = useState(false);
  const ruta = usePathname();

  // Cerrar el menú al cambiar de página
  const [rutaPrevia, setRutaPrevia] = useState(ruta);
  if (ruta !== rutaPrevia) {
    setRutaPrevia(ruta);
    setAbierto(false);
  }

  useEffect(() => {
    if (!abierto) return;
    const alEscape = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("keydown", alEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alEscape);
      document.body.style.overflow = "";
    };
  }, [abierto]);

  return (
    <>
      {/* ───── Escritorio: menú lateral fijo ───── */}
      <aside className="glass fixed inset-y-0 left-0 z-40 hidden w-64 flex-col justify-between border-r border-blush-200/60 px-5 py-10 lg:flex">
        <Link href="/" aria-label="Ir al inicio" className="mx-auto transition-opacity hover:opacity-80">
          <Logo tamano="nav" />
        </Link>
        <nav aria-label="Principal">
          <ItemsMenu />
        </nav>
        <RedesMini redes={redes} />
      </aside>

      {/* ───── Celular / tablet: barra superior + menú desplegable ───── */}
      <header className="glass fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-blush-200/60 px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setAbierto(true)}
          aria-label="Abrir menú"
          aria-expanded={abierto}
          aria-controls="menu-movil"
          className="flex h-12 w-12 items-center justify-center rounded-full text-ink transition-colors active:bg-white/70"
        >
          <IconoMenu className="h-6 w-6" />
        </button>
        <Link href="/" aria-label="Ir al inicio" className="flex min-h-12 items-center gap-2 px-2 text-blush-600">
          <Flamenco className="h-8 w-auto" />
          <span className="font-script text-3xl leading-none">Sofía</span>
        </Link>
        <span className="w-12" aria-hidden />
      </header>

      <div
        onClick={() => setAbierto(false)}
        aria-hidden
        className={`fixed inset-0 z-50 bg-ink/20 backdrop-blur-[2px] transition-opacity duration-500 lg:hidden ${
          abierto ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        id="menu-movil"
        aria-label="Menú"
        aria-hidden={!abierto}
        inert={!abierto}
        className={`fixed inset-y-0 left-0 z-50 flex w-[82%] max-w-80 flex-col justify-between bg-blush-50/95 px-5 pb-8 pt-6 shadow-soft backdrop-blur-xl transition-transform duration-700 ease-silk lg:hidden ${
          abierto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between">
          <Link href="/" onClick={() => setAbierto(false)} aria-label="Ir al inicio" className="pl-2 pt-2">
            <Logo tamano="nav" />
          </Link>
          <button
            type="button"
            onClick={() => setAbierto(false)}
            aria-label="Cerrar menú"
            className="flex h-12 w-12 items-center justify-center rounded-full text-ink active:bg-white/70"
          >
            <IconoCerrar className="h-6 w-6" />
          </button>
        </div>
        <nav aria-label="Principal">
          <ItemsMenu onNavigate={() => setAbierto(false)} />
        </nav>
        <RedesMini redes={redes} />
      </aside>
    </>
  );
}
