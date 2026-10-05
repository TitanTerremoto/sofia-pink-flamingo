import { FormAccion, estiloCampo, estiloEtiqueta } from "@/components/admin/FormAccion";
import { guardarReglas, guardarSitio, guardarTextos } from "@/lib/admin/acciones";
import { requerirAdmin } from "@/lib/admin/sesion";
import { obtenerReglas, obtenerSitio, obtenerTextos } from "@/lib/datos/contenido";

export const metadata = { title: "Configuración" };

export default async function Configuracion() {
  await requerirAdmin();
  const [s, r, t] = await Promise.all([obtenerSitio(), obtenerReglas(), obtenerTextos()]);

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink-soft">
        Lo que empiece con <code>[</code> se considera “sin completar” y la web lo oculta. Las fotos y el logo todavía se cambian
        en <code>src/config/imagenes.ts</code>.
      </p>

      <Seccion titulo="Contacto, ubicación y datos bancarios">
        <FormAccion accion={guardarSitio} boton="Guardar">
          <Grupo titulo="Contacto">
            <Campo etiqueta="WhatsApp (sólo números, con 549…)" nombre="whatsapp" valor={s.contacto.whatsapp} />
            <Campo etiqueta="WhatsApp como se muestra" nombre="whatsappVisible" valor={s.contacto.whatsappVisible} />
            <Campo etiqueta="Email" nombre="email" valor={s.contacto.email} />
            <Campo etiqueta="Instagram (sin @)" nombre="instagram" valor={s.contacto.instagram} />
          </Grupo>
          <Grupo titulo="Ubicación">
            <Campo etiqueta="Dirección" nombre="direccion" valor={s.ubicacion.direccion} />
            <Campo etiqueta="Barrio" nombre="barrio" valor={s.ubicacion.barrio} />
            <Campo etiqueta="Ciudad" nombre="ciudad" valor={s.ubicacion.ciudad} />
          </Grupo>
          <Area etiqueta="Indicaciones para llegar" nombre="indicaciones" valor={s.ubicacion.indicaciones} />
          <Area
            etiqueta="Horarios de atención (una línea por fila: Días | Horas)"
            nombre="horarios"
            valor={s.horarios.map((h) => `${h.dias} | ${h.horas}`).join("\n")}
          />
          <Grupo titulo="Datos para la seña">
            <Campo etiqueta="Alias" nombre="alias" valor={s.banco.alias} />
            <Campo etiqueta="CBU" nombre="cbu" valor={s.banco.cbu} />
            <Campo etiqueta="Titular" nombre="titular" valor={s.banco.titular} />
            <Campo etiqueta="CUIT" nombre="cuit" valor={s.banco.cuit} />
          </Grupo>
          <Area etiqueta="Condiciones de cancelación / reprogramación" nombre="condicionesCancelacion" valor={s.condicionesCancelacion} />
          <Area etiqueta="Aviso para reservas de astrología" nombre="avisoAstrologia" valor={s.avisoAstrologia} />
          <Grupo titulo="Google">
            <Campo etiqueta="Link a tus reseñas" nombre="linkResenas" valor={s.google.linkResenas} />
            <Campo etiqueta="Link para dejar reseña" nombre="linkEscribirResena" valor={s.google.linkEscribirResena} />
          </Grupo>
          <Campo etiqueta="Frase del inicio" nombre="frase" valor={s.frase} />
        </FormAccion>
      </Seccion>

      <Seccion titulo="Reglas de reserva">
        <FormAccion accion={guardarReglas} boton="Guardar">
          <Grupo>
            <Campo etiqueta="Seña (%)" nombre="senaPorcentaje" valor={String(r.senaPorcentaje)} numerico />
            <Campo etiqueta="Turnos cada (minutos)" nombre="intervaloMinutos" valor={String(r.intervaloMinutos)} numerico />
            <Campo etiqueta="Anticipación mínima (horas)" nombre="anticipacionMinimaHoras" valor={String(r.anticipacionMinimaHoras)} numerico />
            <Campo etiqueta="Reservar hasta (días hacia adelante)" nombre="horizonteDias" valor={String(r.horizonteDias)} numerico />
            <Campo etiqueta="Máx. reservas por email por hora" nombre="maxReservasPorHora" valor={String(r.maxReservasPorHora)} numerico />
          </Grupo>
        </FormAccion>
      </Seccion>

      <Seccion titulo="Textos">
        <FormAccion accion={guardarTextos} boton="Guardar">
          <Grupo titulo="Sobre mí">
            <Campo etiqueta="Título" nombre="sobreMi_titulo" valor={t.sobreMi.titulo} />
            <Campo etiqueta="Saludo" nombre="sobreMi_saludo" valor={t.sobreMi.saludo} />
            <Campo etiqueta="Firma" nombre="sobreMi_firma" valor={t.sobreMi.firma} />
          </Grupo>
          <Area
            etiqueta="Párrafos (separalos con una línea en blanco)"
            nombre="sobreMi_parrafos"
            valor={t.sobreMi.parrafos.join("\n\n")}
            filas={12}
          />
          <Grupo titulo="Bajadas">
            <Campo etiqueta="Servicios (inicio)" nombre="servicios_bajada" valor={t.servicios.bajada} />
            <Campo etiqueta="Manicuría" nombre="bajada_manicuria" valor={t.categorias.manicuria.bajada} />
            <Campo etiqueta="Rostro" nombre="bajada_rostro" valor={t.categorias.rostro.bajada} />
            <Campo etiqueta="Astrología" nombre="bajada_astrologia" valor={t.categorias.astrologia.bajada} />
            <Campo etiqueta="Contacto" nombre="contacto_bajada" valor={t.contacto.bajada} />
            <Campo etiqueta="Reseñas" nombre="resenas_bajada" valor={t.resenas.bajada} />
          </Grupo>
        </FormAccion>
      </Seccion>
    </div>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white/80 p-5 shadow-softer">
      <h2 className="mb-4 font-display text-2xl text-ink">{titulo}</h2>
      {children}
    </section>
  );
}

function Grupo({ titulo, children }: { titulo?: string; children: React.ReactNode }) {
  return (
    <fieldset className="mt-4 first:mt-0">
      {titulo && <legend className="mb-2 text-sm text-blush-600">{titulo}</legend>}
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Campo({ etiqueta, nombre, valor, numerico }: { etiqueta: string; nombre: string; valor: string; numerico?: boolean }) {
  return (
    <label className={estiloEtiqueta}>
      {etiqueta}
      <input
        name={nombre}
        defaultValue={valor}
        inputMode={numerico ? "numeric" : undefined}
        className={`${estiloCampo} mt-1 normal-case tracking-normal`}
      />
    </label>
  );
}

function Area({ etiqueta, nombre, valor, filas = 3 }: { etiqueta: string; nombre: string; valor: string; filas?: number }) {
  return (
    <label className={`${estiloEtiqueta} mt-4`}>
      {etiqueta}
      <textarea name={nombre} defaultValue={valor} rows={filas} className={`${estiloCampo} mt-1 normal-case tracking-normal`} />
    </label>
  );
}
