"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconoDestello } from "@/components/brand/Iconos";

/**
 * Acceso rápido a reservar en celular. Aparece después de bajar un poco
 * (no tapa el inicio) y no se muestra en la página de reserva.
 */
export function BotonReservarFlotante({ href, externo }: { href: string; externo: boolean }) {
  const ruta = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const alScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  if (ruta.startsWith("/reservar")) return null;

  const clase = `fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-30 inline-flex min-h-12 items-center gap-2 rounded-full bg-blush-500/95 px-5 title-caps text-xs tracking-[0.2em] text-white shadow-[0_10px_30px_-8px_rgb(192_86_124/0.55)] backdrop-blur transition-all duration-500 active:scale-95 lg:hidden ${
    visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
  }`;
  const contenido = (
    <>
      <IconoDestello className="h-3 w-3" />
      Reservar
    </>
  );

  return externo ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={clase} aria-hidden={!visible} tabIndex={visible ? 0 : -1}>
      {contenido}
    </a>
  ) : (
    <Link href={href} className={clase} aria-hidden={!visible} tabIndex={visible ? 0 : -1}>
      {contenido}
    </Link>
  );
}
