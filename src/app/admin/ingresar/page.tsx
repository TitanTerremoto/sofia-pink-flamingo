import { Logo } from "@/components/brand/Logo";
import { FormAccion, estiloCampo, estiloEtiqueta } from "@/components/admin/FormAccion";
import { ingresar } from "@/lib/admin/acciones";

export const metadata = { title: "Ingresar" };

export default async function Ingresar({ searchParams }: PageProps<"/admin/ingresar">) {
  const { error } = await searchParams;
  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6 py-12">
      <div className="mb-8 text-center">
        <Logo tamano="nav" />
        <h1 className="mt-5 font-display text-3xl text-ink">Panel</h1>
      </div>
      {error === "sin-acceso" && (
        <p role="alert" className="mb-4 rounded-xl bg-rose-50 p-3 text-center text-sm text-rose-700">
          Esta cuenta no tiene acceso al panel.
        </p>
      )}
      <FormAccion accion={ingresar} boton="Ingresar" className="rounded-3xl bg-white/80 p-6 shadow-softer">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className={estiloEtiqueta}>
              Email
            </label>
            <input id="email" name="email" type="email" required autoComplete="username" className={estiloCampo} />
          </div>
          <div>
            <label htmlFor="password" className={estiloEtiqueta}>
              Contraseña
            </label>
            <input id="password" name="password" type="password" required autoComplete="current-password" className={estiloCampo} />
          </div>
        </div>
      </FormAccion>
    </div>
  );
}
