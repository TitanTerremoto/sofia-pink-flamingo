# Integraciones externas: qué cuenta crear y qué configurar

Regla de seguridad: **las claves privadas van en variables de entorno de Vercel**,
nunca dentro del código. Las variables que empiezan con `NEXT_PUBLIC_` son visibles en el
navegador; por eso las claves secretas **nunca** llevan ese prefijo.

Plantilla de variables: [`.env.example`](../.env.example).

---

## A. Hosting: Vercel (Fase 1, necesario para publicar)

1. Crear cuenta en https://vercel.com con el usuario de GitHub.
2. **Add New → Project** → elegir el repo `sofia-pink-flamingo` → **Deploy**.
3. En **Settings → Environment Variables** cargar `NEXT_PUBLIC_SITE_URL` con la URL final.
4. HTTPS es automático.

> Costo: el plan Hobby es gratis pero Vercel lo define para uso **no comercial**.
> Para un negocio corresponde el plan Pro (USD 20/mes) o usar otra plataforma
> compatible con Next.js (Netlify, Cloudflare). Decisión pendiente de Sofi.

## B. Dominio (opcional pero recomendado)

1. Registrar el dominio `.com.ar` en https://nic.ar (requiere clave fiscal) o un `.com` en cualquier registrador.
2. En Vercel: **Settings → Domains → Add** y seguir las instrucciones de DNS.
3. Actualizar `NEXT_PUBLIC_SITE_URL`.

## C. Google Maps (Fase 1) — ya funciona, sin cuenta

El mapa embebido y el botón "Cómo llegar" usan links públicos de Google Maps y
**no requieren API key**. Se activan solos al completar `direccion` en `src/config/sitio.ts`.

## D. Reseñas de Google (Fase 1) — preparado, falta configurar

El sitio **no muestra reseñas inventadas**. Hay dos niveles:

**Nivel 1 — Botones (gratis, 2 minutos):**

1. Tener un **Perfil de Empresa de Google** (https://business.google.com) verificado.
2. Desde el perfil, copiar el link "Leer reseñas" y el link "Pedir reseñas".
3. Pegarlos en `src/config/sitio.ts` → `google.linkResenas` y `google.linkEscribirResena`.

**Nivel 2 — Reseñas reales dentro de la web (automático):**

1. Entrar a https://console.cloud.google.com y crear un proyecto ("Sofia Pink Flamingo").
2. Activar facturación (Google pide tarjeta; con este uso el costo esperado es ~0
   porque la respuesta se guarda 12 h y entra en el crédito mensual gratuito; igual conviene
   poner una **alerta de presupuesto**).
3. **APIs y servicios → Biblioteca → "Places API (New)" → Habilitar.**
4. **Credenciales → Crear credenciales → Clave de API.** Restringirla:
   - Restricción de API: sólo "Places API (New)".
5. Buscar el **Place ID** del negocio en
   https://developers.google.com/maps/documentation/places/web-service/place-id
6. En Vercel cargar:
   - `GOOGLE_PLACES_API_KEY` = la clave
   - `GOOGLE_PLACE_ID` = el Place ID
7. Redeploy. Listo: aparecen hasta 5 reseñas (límite de Google), con promedio y total.

Código: `src/lib/googleReviews.ts` (corre sólo en el servidor).

---

Las integraciones de la Fase 2 y 3 (base de datos, emails, Google Calendar, Mercado Pago)
están detalladas en [ROADMAP.md](ROADMAP.md).
