import { sitio } from "@/config/sitio";

/** Un valor de configuración está cargado si no está vacío y no es un placeholder "[...]". */
export function estaCargado(valor: string | null | undefined): valor is string {
  return !!valor && !valor.trim().startsWith("[");
}

export function direccionCompleta(): string | null {
  const { direccion, barrio, ciudad } = sitio.ubicacion;
  return estaCargado(direccion) ? `${direccion}, ${barrio}, ${ciudad}` : null;
}

export function linkWhatsapp(mensaje?: string): string | null {
  const numero = sitio.contacto.whatsapp;
  if (!estaCargado(numero)) return null;
  const texto = mensaje ? `?text=${encodeURIComponent(mensaje)}` : "";
  return `https://wa.me/${numero.replace(/\D/g, "")}${texto}`;
}

export function linkInstagram(): string | null {
  const usuario = sitio.contacto.instagram;
  return estaCargado(usuario) ? `https://instagram.com/${usuario.replace(/^@/, "")}` : null;
}

export function linkEmail(): string | null {
  const email = sitio.contacto.email;
  return estaCargado(email) ? `mailto:${email}` : null;
}

export function linkComoLlegar(): string | null {
  const destino = direccionCompleta();
  return destino
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destino)}`
    : null;
}

/** URL para el iframe de Google Maps (no requiere API key). */
export function urlMapaEmbebido(): string | null {
  const destino = direccionCompleta();
  return destino ? `https://www.google.com/maps?q=${encodeURIComponent(destino)}&output=embed` : null;
}
