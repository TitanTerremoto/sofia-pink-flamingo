import { Logo } from "@/components/brand/Logo";
import { PageBackground, type Ambiente } from "@/components/effects/PageBackground";
import { imagenServicio } from "@/config/imagenes";
import { obtenerServiciosDe, obtenerTextos } from "@/lib/datos/contenido";
import type { Categoria } from "@/lib/datos/tipos";
import { SectionTitle } from "./SectionTitle";
import { ServiceCircles } from "./ServiceCircles";
import { ServiceDetail } from "./ServiceDetail";

/**
 * Estructura común de Manicuría / Rostro / Astrología:
 * encabezado (logo + ilustraciones) → círculos de servicios → fichas.
 * Cada página aporta su fondo y sus ilustraciones.
 */
export async function CategoryPage({
  categoria,
  izquierda,
  derecha,
  centro,
  forma = "circulo",
  tono = "rosa",
  notaFinal,
}: {
  categoria: Categoria;
  izquierda?: React.ReactNode;
  derecha?: React.ReactNode;
  /** Reemplaza el logo central (lo usa Astrología para la órbita de planetas). */
  centro?: React.ReactNode;
  forma?: "circulo" | "redondeado";
  tono?: "rosa" | "lavanda";
  notaFinal?: React.ReactNode;
}) {
  const [lista, textos] = await Promise.all([obtenerServiciosDe(categoria), obtenerTextos()]);
  const texto = textos.categorias[categoria];

  return (
    <>
      <PageBackground ambiente={categoria satisfies Ambiente} />

      <header className="px-4 pb-10 pt-10 sm:pt-16">
        <div className="mx-auto grid max-w-5xl grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-6">
          <div className="flex justify-end">{izquierda}</div>
          <div className="animate-logo-in">{centro ?? <Logo tamano="page" />}</div>
          <div className="flex justify-start">{derecha}</div>
        </div>
        <div className="animate-fade-up mx-auto mt-8 max-w-xl text-center" style={{ "--delay": "0.5s" } as React.CSSProperties}>
          <h1 className="title-caps text-3xl text-ink sm:text-4xl">{texto.titulo}</h1>
          <p className="mt-3 font-display text-lg italic text-ink-soft sm:text-xl">{texto.bajada}</p>
        </div>
      </header>

      <section aria-labelledby="titulo-servicios" className="px-4 py-10">
        <SectionTitle id="titulo-servicios" tono={tono}>
          Servicios
        </SectionTitle>
        <ServiceCircles
          forma={forma}
          items={lista.map((s) => ({ href: `#${s.slug}`, titulo: s.nombre, imagen: imagenServicio(s.slug, s.categoria) }))}
        />
      </section>

      <div className="flex flex-col gap-12 px-4 pb-20 pt-6 sm:gap-16">
        {lista.map((s, i) => (
          <ServiceDetail key={s.slug} servicio={s} invertido={i % 2 === 1} tono={tono} />
        ))}
        {notaFinal}
      </div>
    </>
  );
}
