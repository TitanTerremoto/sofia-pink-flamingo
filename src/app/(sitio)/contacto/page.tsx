import type { Metadata } from "next";
import Image from "next/image";
import { Logo } from "@/components/brand/Logo";
import { PageBackground } from "@/components/effects/PageBackground";
import { Reveal } from "@/components/effects/Reveal";
import { ContactButtons } from "@/components/contact/ContactButtons";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { MapEmbed } from "@/components/contact/MapEmbed";
import { imagenes } from "@/config/imagenes";
import { marca } from "@/config/sitio";
import { obtenerSitio, obtenerTextos } from "@/lib/datos/contenido";
import { estaCargado } from "@/lib/contacto";

export const metadata: Metadata = {
  title: "Contacto · Parque Chas, CABA",
  description: "WhatsApp, Instagram, email, dirección y horarios de Sofía Pink Flamingo en Parque Chas, CABA.",
  alternates: { canonical: "/contacto" },
};

export default async function Contacto() {
  const [sitio, textos] = await Promise.all([obtenerSitio(), obtenerTextos()]);
  return (
    <>
      <PageBackground ambiente="contacto" />

      <section className="px-5 pb-12 pt-10 sm:pt-16">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2 md:gap-14">
          <div className="text-center md:text-left">
            <div className="animate-logo-in">
              <Logo tamano="page" />
            </div>
            <h1 className="title-caps mt-8 text-3xl text-ink sm:text-4xl">{textos.contacto.titulo}</h1>
            <p className="mt-4 font-display text-xl italic leading-snug text-ink-soft">{textos.contacto.bajada}</p>
          </div>
          <Reveal className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-3 -z-10 -rotate-3 rounded-[2.5rem] bg-lavender-200/60" aria-hidden />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border-[6px] border-white shadow-soft">
              <Image
                src={imagenes.sofia.contacto}
                alt={`Sofi, de ${marca}`}
                fill
                sizes="(max-width: 768px) 90vw, 384px"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-label="Formas de contacto" className="px-5 pb-24">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <Reveal className="flex flex-col gap-5">
            <ContactButtons />
            <ContactInfo />
            {estaCargado(sitio.ubicacion.indicaciones) && (
              <p className="rounded-[1.5rem] bg-white/50 p-5 text-sm leading-relaxed text-ink-soft">
                <span className="title-caps mb-1 block text-[0.68rem] text-blush-500">Cómo llegar</span>
                {sitio.ubicacion.indicaciones}
              </p>
            )}
          </Reveal>
          <Reveal delay={150} className="min-h-96">
            <MapEmbed className="h-full" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
