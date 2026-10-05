<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Proyecto Sofía Pink Flamingo — reglas para agentes

- Idioma del sitio y de la documentación: español rioplatense.
- Antes de continuar, leer `README.md` y `docs/ROADMAP.md` (plan de Fases 2 y 3 y sus principios).
- Datos editables: `src/config/*` (sitio, precios, imágenes) y `src/content/*` (textos, servicios).
  Las páginas nunca escriben precios, contactos o fotos a mano: siempre leen de ahí.
- Un valor que empieza con `[` es placeholder: usar `estaCargado()` (src/lib/contacto.ts) y ocultar/desactivar, nunca mostrar datos inventados.
- No inventar datos personales, bancarios ni reseñas.
- Secretos sólo en variables de entorno de servidor (sin prefijo `NEXT_PUBLIC_`).
- Un turno sólo se confirma por acción de la admin o webhook verificado; nunca por subir un comprobante.
- Verificar con `npm run build`, `npm run lint` y `npm test` antes de commitear. Mobile-first: probar a 375–390 px sin scroll horizontal.
- Contenido editable: leer SIEMPRE por `src/lib/datos/contenido.ts` (base de datos o archivos). No importar `src/config/*`/`src/content/*` desde páginas.
- Reglas de turnos (horarios, superposición, estados) viven en SQL (`supabase/migrations`). Cambiarlas = nueva migración + tests en `tests/db`.
- Toda Server Action del panel empieza con `requerirAdmin()`. `clienteServidor()` (service_role) sólo para subir comprobantes y `crear_reserva`.
