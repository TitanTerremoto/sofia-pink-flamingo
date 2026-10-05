# Cómo editar el sitio (guía para Sofi)

Todo lo editable está en **5 archivos**. No hace falta tocar nada más.
Después de guardar un cambio y subirlo a GitHub, Vercel publica la web nueva solo (en 1–2 minutos).

> Se puede editar directo desde la web de GitHub: abrís el archivo → ícono del lápiz ✏️ →
> cambiás → botón verde **Commit changes**.

---

## 1. Precios — `src/config/precios.ts`

```ts
precio_kapping: null,     // muestra "$ X"
precio_kapping: 28000,    // muestra "$ 28.000"
```

- Número sin `$` ni puntos.
- Se actualiza en toda la web, y la seña (50 %) se calcula sola.

## 2. Datos de contacto, banco y horarios — `src/config/sitio.ts`

Reemplazá lo que está entre corchetes. **Mientras un dato siga con `[`, la web lo oculta**
(por ejemplo, el botón de WhatsApp aparece desactivado). Así nunca se muestra un dato falso.

| Campo | Ejemplo |
| --- | --- |
| `direccion` | `"Av. Triunvirato 1234"` (el mapa y "Cómo llegar" se activan solos) |
| `whatsapp` | `"5491112345678"` — sin `+`, espacios ni guiones |
| `whatsappVisible` | `"+54 9 11 1234-5678"` — cómo se lee en pantalla |
| `email` | `"hola@sofiapinkflamingo.com"` |
| `instagram` | `"sofiapinkflamingo"` — sin `@` |
| `horarios` | `{ dias: "Lunes a viernes", horas: "10 a 19 h" }` |
| `banco` | alias, CBU, titular, CUIT |
| `senaPorcentaje` | `50` |
| `diasHastaSesionCartaNatal` | `7` |
| `preguntasTarot` | `3` |

## 3. Logo y fotos — `src/config/imagenes.ts`

1. Subí la foto a la carpeta `public/images/...` (por ejemplo `public/images/sofia/sobre-mi.jpg`).
2. En `imagenes.ts` cambiá la ruta: `sobreMi: "/images/sofia/sobre-mi.jpg"` (sin `public`).

Tamaños ideales:

- Fotos de servicios (círculos): cuadradas, 1000 × 1000 px.
- Fotos tuyas: verticales, 1000 × 1300 px.
- Peso: menos de 400 KB (podés comprimirlas gratis en https://squoosh.app).

**Logo**: guardalo como `public/images/marca/logo.png` (fondo transparente) y poné
`logo: "/images/marca/logo.png"`. Con `logo: null` se usa el logo tipográfico incluido.

## 4. Texto "Sobre mí" — `src/content/textos.ts`

Cada línea entre comillas es un párrafo. Reemplazá los `[COMPLETAR: ...]` con tu historia.

## 5. Servicios — `src/content/servicios.ts`

Nombre, descripción, qué incluye, duración, cuidados, modalidad. No cambies el `slug`
(es el identificador del link, por ejemplo `/manicuria#kapping`).

---

### ¿Algo se rompió?

Si Vercel marca error al publicar, casi siempre es una comilla o una coma que faltó.
Mirá que cada valor tenga comillas `"..."` y termine con `,`.
