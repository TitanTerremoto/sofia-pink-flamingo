import type { Metadata } from "next";
import { CategoryPage } from "@/components/services/CategoryPage";
import { EsmalteAnimado } from "@/components/illustrations/EsmalteAnimado";
import { LimaAnimada } from "@/components/illustrations/LimaAnimada";

export const metadata: Metadata = {
  title: "Manicuría · Semipermanente, Kapping y Esculpidas en Parque Chas",
  description:
    "Uñas semipermanente en manos y pies, kapping y uñas esculpidas en Parque Chas, CABA. Turnos con seña online.",
  alternates: { canonical: "/manicuria" },
};

export default function Manicuria() {
  return (
    <CategoryPage
      categoria="manicuria"
      forma="circulo"
      izquierda={<EsmalteAnimado className="w-[5.75rem] sm:w-36 lg:w-44" />}
      derecha={<LimaAnimada className="w-[5.75rem] sm:w-36 lg:w-44" />}
    />
  );
}
