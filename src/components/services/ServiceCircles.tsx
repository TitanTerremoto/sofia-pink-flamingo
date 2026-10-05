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
  // Flex centrado: en celular quedan de a dos y el impar queda centrado y del mismo tamaño.
  const ancho = items.length === 4 ? "basis-[calc(50%-0.75rem)] lg:basis-[calc(25%-2rem)]" : "basis-[calc(50%-0.75rem)] sm:basis-[calc(33.333%-2rem)]";

  return (
    <ul className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-6 gap-y-10 sm:gap-x-10">
      {items.map((item, i) => (
        <Reveal as="li" key={item.href} delay={i * 140} className={`flex min-w-0 justify-center ${ancho}`}>
          <Link href={item.href} className="zoom-trigger group flex w-full max-w-60 flex-col items-center gap-4">
            <span
              className={`zoom-frame relative block aspect-square w-full overflow-hidden border-[5px] ${borde} ${radio} shadow-softer ring-1 ring-blush-200/70`}
            >
              <Image src={item.imagen} alt={item.titulo} fill sizes="(max-width: 640px) 45vw, 240px" className="object-cover" />
            </span>
            <span className="title-caps text-center text-[0.8rem] tracking-[0.14em] text-ink transition-colors duration-500 group-hover:text-blush-600 sm:text-base sm:tracking-[0.28em]">
              {item.titulo}
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
