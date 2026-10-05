import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/effects/Reveal";

export type CirculoItem = { href: string; titulo: string; imagen: string };

/**
 * Fotos circulares con zoom suave. Llevan a otra página ("/manicuria")
 * o a un anchor dentro de la misma ("#kapping").
 */
export function ServiceCircles({
  items,
  forma = "circulo",
  borde = "border-white",
}: {
  items: CirculoItem[];
  forma?: "circulo" | "redondeado";
  borde?: string;
}) {
  const radio = forma === "circulo" ? "rounded-full" : "rounded-[2rem]";
  const columnas =
    items.length === 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 sm:grid-cols-3 [&>*:last-child:nth-child(odd)]:col-span-2 sm:[&>*:last-child:nth-child(odd)]:col-span-1";

  return (
    <ul className={`mx-auto grid max-w-5xl gap-x-5 gap-y-10 sm:gap-x-10 ${columnas}`}>
      {items.map((item, i) => (
        <Reveal as="li" key={item.href} delay={i * 140} className="flex justify-center">
          <Link href={item.href} className="zoom-trigger group flex w-full max-w-60 flex-col items-center gap-4">
            <span
              className={`zoom-frame relative block aspect-square w-full overflow-hidden border-[5px] ${borde} ${radio} shadow-softer ring-1 ring-blush-200/70`}
            >
              <Image src={item.imagen} alt={item.titulo} fill sizes="(max-width: 640px) 45vw, 240px" className="object-cover" />
            </span>
            <span className="title-caps text-center text-sm text-ink transition-colors duration-500 group-hover:text-blush-600 sm:text-base">
              {item.titulo}
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
