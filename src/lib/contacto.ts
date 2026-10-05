import type { ConfigSitio } from "@/lib/datos/tipos";

/** Un valor de configuración está cargado si no está vacío y no es un placeholder "[...]". */
export function estaCargado(valor: string | null | undefined): valor is string {
  return !!valor && !valor.trim().startsWith("[");
}

export function direccionCompleta(s: ConfigSitio): string | null {
  const { direccion, barrio, ciudad } = s.ubicacion;
  return estaCargado(direccion) ? `${direccion}, ${barrio}, ${ciudad}` : null;
}

export function linkWhatsapp(s: ConfigSitio, mensaje?: string): string | null {
  const numero = s.contacto.whatsapp;
  if (!estaCargado(numero)) return null;
  const texto = mensaje ? `?text=${encodeURIComponent(mensaje)}` : "";
  return `https://wa.me/${numero.replace(/\D/g, "")}${texto}`;
}

export function linkInstagram(s: ConfigSitio): string | null {
  const usuario = s.contacto.instagram;
  return estaCargado(usuario) ? `https://instagram.com/${encodeURIComponent(usuario.replace(/^@/, ""))}` : null;
}

export function linkEmail(s: ConfigSitio): string | null {
  const email = s.contacto.email;
  return estaCargado(email) ? `mailto:${email}` : null;
}

export function linkComoLlegar(s: ConfigSitio): string | null {
  const destino = direccionCompleta(s);
  return destino ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destino)}` : null;
}

/** URL para el iframe de Google Maps (no requiere API key). */
export function urlMapaEmbebido(s: ConfigSitio): string | null {
  const destino = direccionCompleta(s);
  return destino ? `https://www.google.com/maps?q=${encodeURIComponent(destino)}&output=embed` : null;
}

/** Links de redes ya cargados, para el menú y el pie. */
export function redesCargadas(s: ConfigSitio) {
  return [
    { red: "whatsapp", href: linkWhatsapp(s) },
    { red: "instagram", href: linkInstagram(s) },
    { red: "email", href: linkEmail(s) },
  ].filter((r): r is { red: "whatsapp" | "instagram" | "email"; href: string } => r.href !== null);
}

export type Red = ReturnType<typeof redesCargadas>[number];
