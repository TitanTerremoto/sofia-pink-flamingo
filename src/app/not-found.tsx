import Link from "next/link";
import { Flamenco } from "@/components/brand/Logo";
import { PageBackground } from "@/components/effects/PageBackground";

export default function NoEncontrada() {
  return (
    <>
      <PageBackground ambiente="inicio" />
      <section className="flex min-h-[70svh] flex-col items-center justify-center gap-6 px-6 text-center">
        <Flamenco className="h-24 w-auto text-blush-500" />
        <h1 className="title-caps text-2xl text-ink">Página no encontrada</h1>
        <p className="font-display text-xl italic text-ink-soft">Este flamenco voló a otro lado.</p>
        <Link href="/" className="inline-flex min-h-12 items-center rounded-full bg-blush-500 px-8 title-caps text-sm text-white">
          Volver al inicio
        </Link>
      </section>
    </>
  );
}
