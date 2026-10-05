import { IconoEstrella } from "@/components/brand/Iconos";
import { Reveal } from "@/components/effects/Reveal";
import { sitio } from "@/config/sitio";
import { estaCargado } from "@/lib/contacto";
import { obtenerResenasGoogle } from "@/lib/googleReviews";

function Estrellas({ cantidad }: { cantidad: number }) {
  return (
    <span className="flex gap-0.5 text-blush-400" aria-label={`${cantidad} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <IconoEstrella key={i} className={`h-4 w-4 ${i < Math.round(cantidad) ? "" : "opacity-25"}`} />
      ))}
    </span>
  );
}

/**
 * Reseñas reales de Google. No hay reseñas de ejemplo: si la integración
 * no está configurada, se muestran sólo los enlaces a Google.
 */
export async function GoogleReviews() {
  const datos = await obtenerResenasGoogle();
  const linkVer = datos?.linkGoogle ?? (estaCargado(sitio.google.linkResenas) ? sitio.google.linkResenas : null);
  const linkEscribir = estaCargado(sitio.google.linkEscribirResena) ? sitio.google.linkEscribirResena : null;

  return (
    <div className="mx-auto max-w-5xl">
      {datos && datos.resenas.length > 0 ? (
        <>
          <p className="mb-8 flex flex-wrap items-center justify-center gap-3 text-ink-soft">
            <span className="font-display text-4xl text-ink">{datos.promedio.toFixed(1)}</span>
            <Estrellas cantidad={datos.promedio} />
            <span className="text-sm">({datos.total} reseñas en Google)</span>
          </p>
          <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
            {datos.resenas.map((r, i) => (
              <Reveal as="li" key={`${r.autor}-${i}`} delay={i * 100} className="w-[85%] shrink-0 snap-center sm:w-auto">
                <figure className="glass flex h-full flex-col gap-4 rounded-[1.75rem] p-6 shadow-softer">
                  <Estrellas cantidad={r.estrellas} />
                  <blockquote className="line-clamp-[8] font-display text-lg leading-snug text-ink">“{r.texto}”</blockquote>
                  <figcaption className="mt-auto flex items-center gap-3 text-sm text-ink-soft">
                    {r.fotoAutor && (
                      // Las fotos de perfil vienen de Google; se muestran tal cual exige su política de atribución.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.fotoAutor} alt="" width={32} height={32} className="h-8 w-8 rounded-full" loading="lazy" referrerPolicy="no-referrer" />
                    )}
                    <span>
                      {r.linkAutor ? (
                        <a href={r.linkAutor} target="_blank" rel="noopener noreferrer" className="hover:text-blush-600">
                          {r.autor}
                        </a>
                      ) : (
                        r.autor
                      )}
                      {r.haceCuanto && <span className="block text-xs opacity-80">{r.haceCuanto}</span>}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
          <p className="mt-2 text-center text-xs text-ink-soft">Reseñas publicadas en Google</p>
        </>
      ) : (
        <Reveal className="glass mx-auto max-w-xl rounded-[2rem] p-8 text-center shadow-softer">
          <p className="font-display text-xl italic text-ink">
            Muy pronto vas a poder leer acá las experiencias de quienes ya pasaron por el espacio.
          </p>
        </Reveal>
      )}

      {(linkVer || linkEscribir) && (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {linkVer && (
            <a
              href={linkVer}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center rounded-full bg-white/80 px-6 title-caps text-xs text-ink shadow-softer transition-colors hover:text-blush-600"
            >
              Ver reseñas en Google
            </a>
          )}
          {linkEscribir && (
            <a
              href={linkEscribir}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center rounded-full border border-blush-300 px-6 title-caps text-xs text-blush-600 transition-colors hover:bg-white/60"
            >
              Dejá tu reseña
            </a>
          )}
        </div>
      )}
    </div>
  );
}
