import type { Metadata } from "next";
import { CategoryPage } from "@/components/services/CategoryPage";
import { OjoAnimado } from "@/components/illustrations/OjoAnimado";
import { CejaAnimada } from "@/components/illustrations/CejaAnimada";

export const metadata: Metadata = {
  title: "Rostro · Lifting de pestañas, Laminado y Diseño de cejas en Parque Chas",
  description:
    "Lifting de pestañas, laminado de cejas, diseño y perfilado, y sombreado de cejas en Parque Chas, CABA.",
  alternates: { canonical: "/rostro" },
};

export default function Rostro() {
  return (
    <CategoryPage
      categoria="rostro"
      forma="redondeado"
      izquierda={<OjoAnimado className="w-[5.75rem] sm:w-36 lg:w-44" />}
      derecha={<CejaAnimada className="w-[5.75rem] sm:w-36 lg:w-44" />}
    />
  );
}
