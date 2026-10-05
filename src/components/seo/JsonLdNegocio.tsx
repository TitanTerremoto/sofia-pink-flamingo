import { sitio } from "@/config/sitio";
import { estaCargado } from "@/lib/contacto";
import { linkInstagram } from "@/lib/contacto";

/**
 * Datos estructurados (schema.org) para que Google entienda el negocio local.
 * Sólo incluye los datos ya cargados en la configuración.
 */
export function JsonLdNegocio() {
  const { ubicacion, contacto } = sitio;
  const instagram = linkInstagram();

  const datos = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: sitio.marca,
    url: sitio.url,
    image: `${sitio.url}/opengraph-image`,
    description:
      "Manicuría, lifting de pestañas, laminado y diseño de cejas, y astrología (carta natal, revolución solar, tarot astrológico).",
    areaServed: `${ubicacion.barrio}, ${ubicacion.ciudad}`,
    address: {
      "@type": "PostalAddress",
      ...(estaCargado(ubicacion.direccion) && { streetAddress: ubicacion.direccion }),
      addressLocality: ubicacion.barrio,
      addressRegion: ubicacion.ciudad,
      addressCountry: "AR",
    },
    ...(estaCargado(contacto.email) && { email: contacto.email }),
    ...(estaCargado(contacto.whatsapp) && { telephone: `+${contacto.whatsapp}` }),
    ...(instagram && { sameAs: [instagram] }),
  };

  return (
    <script
      type="application/ld+json"
      // JSON generado desde la configuración propia; se escapa "<" para evitar cortar el <script>.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos).replace(/</g, "\\u003c") }}
    />
  );
}
