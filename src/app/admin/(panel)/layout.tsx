import Link from "next/link";
import { Flamenco } from "@/components/brand/Logo";
import { NavAdmin } from "@/components/admin/NavAdmin";
import { salir } from "@/lib/admin/acciones";
import { requerirAdmin } from "@/lib/admin/sesion";

export default async function LayoutPanel({ children }: LayoutProps<"/admin">) {
  const { email } = await requerirAdmin();
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16">
      <header className="flex items-center justify-between gap-4 py-4">
        <Link href="/admin" className="flex items-center gap-2 text-blush-600">
          <Flamenco className="h-8 w-auto" />
          <span className="font-script text-3xl">Sofía</span>
          <span className="text-xs uppercase tracking-widest text-ink-soft">Panel</span>
        </Link>
        <form action={salir} className="flex items-center gap-3">
          <span className="hidden text-xs text-ink-soft sm:inline">{email}</span>
          <button className="min-h-10 rounded-full bg-white/70 px-4 text-sm text-ink hover:bg-white">Salir</button>
        </form>
      </header>
      <NavAdmin />
      <main className="mt-6">{children}</main>
    </div>
  );
}
