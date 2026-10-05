import type { Metadata } from "next";
import { CategoryPage } from "@/components/services/CategoryPage";
import { OrbitaPlanetas } from "@/components/illustrations/OrbitaPlanetas";
import { IconoDestello } from "@/components/brand/Iconos";
import { Reveal } from "@/components/effects/Reveal";
import { sitio } from "@/config/sitio";

export const metadata: Metadata = {
  title: "Astrología · Carta Natal, Revolución Solar y Tarot Astrológico",
  description:
    "Lectura de carta natal, revolución solar y tarot astrológico con Sofía Pink Flamingo. Parque Chas, CABA.",
  alternates: { canonical: "/astrologia" },
};

export default function Astrologia() {
  return (
    <CategoryPage
      categoria="astrologia"
      tono="lavanda"
      centro={<OrbitaPlanetas />}
      notaFinal={
        <Reveal className="mx-auto flex max-w-2xl items-start gap-3 rounded-[1.75rem] border border-white/80 bg-white/50 p-6 text-ink-soft backdrop-blur-md">
          <IconoDestello className="mt-1 h-4 w-4 shrink-0 text-lavender-500" />
          <p className="font-display text-lg italic leading-snug">{sitio.astrologia.avisoPostReserva}</p>
        </Reveal>
      }
    />
  );
}
