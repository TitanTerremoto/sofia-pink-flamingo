/**
 * Loader de imágenes para la vista previa en GitHub Pages: no hay servidor que
 * optimice imágenes y el sitio vive en /sofia-pink-flamingo, así que sólo
 * antepone ese prefijo a las rutas locales. (En Vercel se usa el optimizador normal.)
 */
export default function cargadorImagenesPages({ src }: { src: string; width: number; quality?: number }) {
  return src.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}` : src;
}
