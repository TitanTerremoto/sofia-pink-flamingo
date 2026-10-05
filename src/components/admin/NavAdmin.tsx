"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const secciones = [
  { href: "/admin", etiqueta: "Reservas" },
  { href: "/admin/calendario", etiqueta: "Calendario" },
  { href: "/admin/clientes", etiqueta: "Clientes" },
  { href: "/admin/servicios", etiqueta: "Servicios y precios" },
  { href: "/admin/horarios", etiqueta: "Horarios" },
  { href: "/admin/configuracion", etiqueta: "Configuración" },
];

export function NavAdmin() {
  const ruta = usePathname();
  return (
    <nav aria-label="Panel" className="-mx-4 overflow-x-auto px-4">
      <ul className="flex gap-1.5 whitespace-nowrap pb-1">
        {secciones.map(({ href, etiqueta }) => {
          const activo = href === "/admin" ? ruta === "/admin" || ruta.startsWith("/admin/reservas") : ruta.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={activo ? "page" : undefined}
                className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm transition ${
                  activo ? "bg-blush-500 text-white" : "bg-white/70 text-ink hover:bg-white"
                }`}
              >
                {etiqueta}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
