import type { Metadata } from "next";
import { Logo } from "@/components/brand/Logo";
import { baseConfigurada } from "@/lib/supabase/entorno";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s · Panel" },
  robots: { index: false, follow: false },
};

export default function LayoutAdmin({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-blush-100 to-blush-50">
      {baseConfigurada() ? (
        children
      ) : (
        <div className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-5 px-6 text-center">
          <Logo tamano="nav" />
          <h1 className="font-display text-3xl">Panel administrador</h1>
          <p className="text-ink-soft">
            Falta conectar la base de datos (Supabase). Seguí los pasos de <code>docs/FASE2-PUESTA-EN-MARCHA.md</code> y
            cargá las variables de entorno.
          </p>
        </div>
      )}
    </div>
  );
}
