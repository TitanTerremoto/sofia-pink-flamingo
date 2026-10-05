import "server-only";

/**
 * Reseñas reales desde Google (Places API "New").
 *
 * Se ejecuta SÓLO en el servidor: la API key nunca llega al navegador.
 * Requiere las variables de entorno GOOGLE_PLACES_API_KEY y GOOGLE_PLACE_ID.
 * Si faltan, devuelve null y el sitio muestra los botones a Google en su lugar.
 *
 * Límite de Google: la API devuelve como máximo 5 reseñas (las "más relevantes").
 * La respuesta se cachea 12 h para no gastar cuota.
 */

export type Resena = {
  autor: string;
  fotoAutor?: string;
  linkAutor?: string;
  estrellas: number;
  texto: string;
  haceCuanto: string;
};

export type DatosResenas = {
  promedio: number;
  total: number;
  linkGoogle?: string;
  resenas: Resena[];
};

type RespuestaPlaces = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: {
    rating: number;
    relativePublishTimeDescription?: string;
    text?: { text: string };
    originalText?: { text: string };
    authorAttribution?: { displayName: string; uri?: string; photoUri?: string };
  }[];
};

export async function obtenerResenasGoogle(): Promise<DatosResenas | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return null;

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=es`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
      },
      next: { revalidate: 60 * 60 * 12 },
    });
    if (!res.ok) {
      console.error(`[reseñas] Google Places respondió ${res.status}`);
      return null;
    }
    const data = (await res.json()) as RespuestaPlaces;
    return {
      promedio: data.rating ?? 0,
      total: data.userRatingCount ?? 0,
      linkGoogle: data.googleMapsUri,
      resenas: (data.reviews ?? [])
        .filter((r) => (r.text?.text ?? r.originalText?.text)?.trim())
        .map((r) => ({
          autor: r.authorAttribution?.displayName ?? "Cliente de Google",
          fotoAutor: r.authorAttribution?.photoUri,
          linkAutor: r.authorAttribution?.uri,
          estrellas: r.rating,
          texto: (r.text?.text ?? r.originalText?.text ?? "").trim(),
          haceCuanto: r.relativePublishTimeDescription ?? "",
        })),
    };
  } catch (error) {
    console.error("[reseñas] No se pudieron obtener las reseñas de Google", error);
    return null;
  }
}
