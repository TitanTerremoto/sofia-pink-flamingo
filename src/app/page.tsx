import Image from "next/image";
import { Logo } from "@/components/brand/Logo";
import { PageBackground } from "@/components/effects/PageBackground";
import { Reveal } from "@/components/effects/Reveal";
import { SectionTitle } from "@/components/services/SectionTitle";
import { ServiceCircles } from "@/components/services/ServiceCircles";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { ContactButtons } from "@/components/contact/ContactButtons";
import { MapEmbed } from "@/components/contact/MapEmbed";
import { GoogleReviews } from "@/components/reviews/GoogleReviews";
import { JsonLdNegocio } from "@/components/seo/JsonLdNegocio";
import { imagenes } from "@/config/imagenes";
import { sitio } from "@/config/sitio";
import { textos } from "@/content/textos";

export default function Inicio() {
  return (
    <>
      <PageBackground ambiente="inicio" />
      <JsonLdNegocio />

      {/* ───── HERO ───── */}
      <section className="relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center px-6 text-center lg:min-h-svh">
        <div className="animate-logo-in">
          <h1>
            <Logo tamano="hero" />
          </h1>
        </div>
        <p
          className="animate-fade-up mt-8 max-w-md font-display text-xl italic leading-snug text-ink-soft sm:text-2xl"
          style={{ "--delay": "0.9s" } as React.CSSProperties}
        >
          {sitio.frase}
        </p>
        <a
          href="#sobre-mi"
          aria-label="Bajar a Sobre mí"
          className="animate-fade-up absolute bottom-8 flex h-12 w-12 items-center justify-center rounded-full text-blush-400"
          style={{ "--delay": "1.6s" } as React.CSSProperties}
        >
          <span className="animate-float block h-8 w-[1px] bg-gradient-to-b from-transparent via-blush-400 to-transparent" />
        </a>
      </section>

      {/* ───── SOBRE MÍ ───── */}
      <section id="sobre-mi" aria-labelledby="titulo-sobre-mi" className="px-5 py-20 sm:py-28">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[5fr_6fr] md:gap-16">
          <Reveal className="relative mx-auto w-full max-w-sm md:max-w-none">
            <div className="absolute -inset-3 -z-10 rotate-3 rounded-[2.5rem] bg-blush-200/60" aria-hidden />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border-[6px] border-white shadow-soft">
              <Image
                src={imagenes.sofia.sobreMi}
                alt={`Sofi, de ${sitio.marca}`}
                fill
                sizes="(max-width: 768px) 90vw, 420px"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={150}>
            <h2 id="titulo-sobre-mi" className="title-caps text-sm text-blush-500">
              {textos.sobreMi.titulo}
            </h2>
            <p className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">{textos.sobreMi.saludo}</p>
            <div className="mt-6 space-y-4 text-[1.02rem] leading-relaxed text-ink-soft">
              {textos.sobreMi.parrafos.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <p className="mt-6 font-script text-5xl text-blush-500">{textos.sobreMi.firma}</p>
          </Reveal>
        </div>
      </section>

      {/* ───── SERVICIOS ───── */}
      <section aria-labelledby="titulo-servicios" className="px-5 py-16 sm:py-24">
        <SectionTitle id="titulo-servicios" bajada={textos.servicios.bajada}>
          {textos.servicios.titulo}
        </SectionTitle>
        <ServiceCircles
          items={[
            { href: "/manicuria", titulo: "Manicuría", imagen: imagenes.categorias.manicuria },
            { href: "/rostro", titulo: "Rostro", imagen: imagenes.categorias.rostro },
            { href: "/astrologia", titulo: "Astrología", imagen: imagenes.categorias.astrologia },
          ]}
        />
      </section>

      {/* ───── CONTACTO / UBICACIÓN ───── */}
      <section aria-labelledby="titulo-ubicacion" className="px-5 py-16 sm:py-24">
        <SectionTitle id="titulo-ubicacion" bajada={`${sitio.ubicacion.barrio}, ${sitio.ubicacion.ciudad}`}>
          Dónde encontrarme
        </SectionTitle>
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <Reveal className="flex flex-col gap-5">
            <ContactInfo />
            <ContactButtons />
          </Reveal>
          <Reveal delay={150} className="min-h-80">
            <MapEmbed className="h-full" />
          </Reveal>
        </div>
      </section>

      {/* ───── RESEÑAS ───── */}
      <section aria-labelledby="titulo-resenas" className="px-5 pb-24 pt-10">
        <SectionTitle id="titulo-resenas" bajada={textos.resenas.bajada}>
          {textos.resenas.titulo}
        </SectionTitle>
        <GoogleReviews />
      </section>
    </>
  );
}
