import Image from "next/image";
import { imagenes } from "@/config/imagenes";
import { sitio } from "@/config/sitio";
import type { Servicio } from "@/content/servicios";
import { formatPrecio, precioDe } from "@/lib/precio";
import { Reveal } from "@/components/effects/Reveal";
import { IconoDestello, IconoReloj } from "@/components/brand/Iconos";
import { ReservarButton } from "./ReservarButton";

/**
 * Ficha completa de un servicio. Alterna foto izquierda/derecha en pantallas grandes.
 */
export function ServiceDetail({
  servicio,
  invertido = false,
  tono = "rosa",
}: {
  servicio: Servicio;
  invertido?: boolean;
  tono?: "rosa" | "lavanda";
}) {
  const acento = tono === "lavanda" ? "text-lavender-500" : "text-blush-500";
  const precio = formatPrecio(precioDe(servicio.precioKey));

  return (
    <Reveal
      as="article"
      id={servicio.slug}
      className="glass mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] shadow-softer md:grid-cols-2"
    >
      <div className={`zoom-trigger relative ${invertido ? "md:order-2" : ""}`}>
        <div className="zoom-frame relative aspect-[4/3] overflow-hidden md:aspect-auto md:h-full md:min-h-[28rem]">
          <Image
            src={imagenes.servicios[servicio.slug]}
            alt={servicio.nombre}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 p-6 sm:p-10">
        <h3 className="font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">{servicio.nombre}</h3>

        <Bloque titulo={servicio.tituloDescripcion} acento={acento}>
          <p>{servicio.descripcion}</p>
        </Bloque>

        <Bloque titulo="¿Qué incluye?" acento={acento}>
          <ul className="space-y-1.5">
            {servicio.incluye.map((item) => (
              <li key={item} className="flex gap-2.5">
                <IconoDestello className={`mt-1.5 h-2.5 w-2.5 shrink-0 ${acento}`} />
                {item}
              </li>
            ))}
          </ul>
        </Bloque>

        <Bloque titulo="Duración aproximada" acento={acento}>
          <p className="flex items-center gap-2">
            <IconoReloj className={`h-4 w-4 ${acento}`} />
            {servicio.duracion}
          </p>
        </Bloque>

        {servicio.detalles.map((d) => (
          <Bloque key={d.titulo} titulo={d.titulo} acento={acento}>
            <p>{d.texto}</p>
          </Bloque>
        ))}

        <div className="mt-2 flex flex-col items-start gap-5 border-t border-blush-200/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="title-caps text-[0.7rem] text-ink-soft">Precio</p>
            <p className="font-display text-4xl text-ink">{precio}</p>
            {servicio.destacado && <p className={`mt-1 text-sm font-normal ${acento}`}>{servicio.destacado}</p>}
            <p className="mt-1 text-xs text-ink-soft">Seña del {sitio.reservas.senaPorcentaje}% para confirmar el turno.</p>
          </div>
          <ReservarButton servicio={servicio} tono={tono} />
        </div>
      </div>
    </Reveal>
  );
}

function Bloque({ titulo, acento, children }: { titulo: string; acento: string; children: React.ReactNode }) {
  return (
    <section className="text-[0.98rem] leading-relaxed text-ink-soft">
      <h4 className={`title-caps mb-2 text-[0.72rem] ${acento}`}>{titulo}</h4>
      {children}
    </section>
  );
}
