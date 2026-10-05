import type { Metadata } from "next";
import { Logo } from "@/components/brand/Logo";
import { PageBackground } from "@/components/effects/PageBackground";
import { FlujoReserva } from "@/components/reservas/FlujoReserva";
import { linkWhatsapp } from "@/lib/contacto";
import { obtenerReglas, obtenerServicios, obtenerSitio, reservasOnline } from "@/lib/datos/contenido";
import { diasConDisponibilidad } from "@/lib/reservas/agenda";
import { fechaLocal } from "@/lib/reservas/fechas";

export const metadata: Metadata = {
  title: "Reservar turno",
  description: "Reservá tu turno de manicuría, rostro o astrología con Sofía Pink Flamingo.",
  alternates: { canonical: "/reservar" },
};

export default async function Reservar({ searchParams }: PageProps<"/reservar">) {
  const { servicio } = await searchParams;
  const sitio = await obtenerSitio();

  if (!reservasOnline()) {
    const whatsapp = linkWhatsapp(sitio, "¡Hola Sofi! Quiero reservar un turno.");
    return (
      <>
        <PageBackground ambiente="inicio" />
        <section className="flex min-h-[70svh] flex-col items-center justify-center gap-6 px-6 text-center">
          <Logo tamano="page" />
          <h1 className="title-caps text-2xl text-ink">Reservas</h1>
          <p className="max-w-md font-display text-xl italic text-ink-soft">
            Las reservas online van a estar disponibles muy pronto. Mientras tanto, escribime y coordinamos tu turno.
          </p>
          {whatsapp && (
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center rounded-full bg-blush-500 px-8 title-caps text-sm text-white">
              WhatsApp
            </a>
          )}
        </section>
      </>
    );
  }

  const [servicios, reglas, dias] = await Promise.all([obtenerServicios(), obtenerReglas(), diasConDisponibilidad()]);

  return (
    <>
      <PageBackground ambiente="contacto" />
      <section className="px-4 pb-24 pt-10 sm:pt-14">
        <div className="mb-8 text-center">
          <Logo tamano="nav" />
          <h1 className="title-caps mt-6 text-3xl text-ink">Reservar turno</h1>
        </div>
        <FlujoReserva
          servicios={servicios.map((s) => ({
            slug: s.slug,
            nombre: s.nombre,
            categoria: s.categoria,
            precio: s.precio,
            duracion: s.duracion,
          }))}
          preseleccion={typeof servicio === "string" ? servicio : undefined}
          hoy={fechaLocal(new Date())}
          horizonteDias={reglas.horizonteDias}
          diasHabilitados={dias}
          senaPorcentaje={reglas.senaPorcentaje}
          banco={sitio.banco}
          avisoAstrologia={sitio.avisoAstrologia}
          turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || undefined}
        />
      </section>
    </>
  );
}
