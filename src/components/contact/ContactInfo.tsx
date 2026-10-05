import { IconoEmail, IconoInstagram, IconoReloj, IconoUbicacion, IconoWhatsapp } from "@/components/brand/Iconos";
import { direccionCompleta, estaCargado, linkEmail, linkInstagram, linkWhatsapp } from "@/lib/contacto";
import { obtenerSitio } from "@/lib/datos/contenido";

/** Datos de contacto y horarios. Lo que todavía no está cargado se muestra como "Próximamente". */
export async function ContactInfo() {
  const sitio = await obtenerSitio();
  const pendiente = <span className="italic opacity-70">Próximamente</span>;
  const direccion = direccionCompleta(sitio);
  const whatsapp = linkWhatsapp(sitio);
  const instagram = linkInstagram(sitio);
  const email = linkEmail(sitio);

  const filas = [
    {
      Icono: IconoUbicacion,
      etiqueta: "Ubicación",
      valor: direccion ?? `${sitio.ubicacion.barrio}, ${sitio.ubicacion.ciudad}`,
    },
    {
      Icono: IconoWhatsapp,
      etiqueta: "WhatsApp",
      valor: whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-blush-600">{sitio.contacto.whatsappVisible}</a> : pendiente,
    },
    {
      Icono: IconoEmail,
      etiqueta: "Email",
      valor: email ? <a href={email} className="break-all hover:text-blush-600">{sitio.contacto.email}</a> : pendiente,
    },
    {
      Icono: IconoInstagram,
      etiqueta: "Instagram",
      valor: instagram ? <a href={instagram} target="_blank" rel="noopener noreferrer" className="hover:text-blush-600">@{sitio.contacto.instagram}</a> : pendiente,
    },
  ];

  return (
    <div className="glass rounded-[2rem] p-6 shadow-softer sm:p-8">
      <dl className="space-y-5">
        {filas.map(({ Icono, etiqueta, valor }) => (
          <div key={etiqueta} className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blush-100 text-blush-500">
              <Icono className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <dt className="title-caps text-[0.68rem] text-ink-soft">{etiqueta}</dt>
              <dd className="text-ink">{valor}</dd>
            </div>
          </div>
        ))}
        <div className="flex gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blush-100 text-blush-500">
            <IconoReloj className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <dt className="title-caps text-[0.68rem] text-ink-soft">Horarios de atención</dt>
            <dd>
              <ul className="mt-1 space-y-1 text-ink">
                {sitio.horarios.map((h) => (
                  <li key={h.dias} className="flex justify-between gap-4 border-b border-dashed border-blush-200 pb-1 last:border-0">
                    <span>{h.dias}</span>
                    <span className="text-right text-ink-soft">{estaCargado(h.horas) ? h.horas : pendiente}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </div>
      </dl>
    </div>
  );
}
