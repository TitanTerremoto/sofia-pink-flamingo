# Sofía Pink Flamingo

Sitio web de **Sofía Pink Flamingo**: Manicuría, Rostro y Astrología en Parque Chas, CABA.

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · diseño mobile-first.

## Estado del proyecto

| Fase | Contenido | Estado |
| --- | --- | --- |
| **1. Sitio** | Inicio, Manicuría, Rostro, Astrología, Contacto, menú lateral, animaciones, SEO, mapa, reseñas de Google (preparadas) | ✅ Hecha |
| **2. Reservas** | Turnos con disponibilidad real, seña 50 %, carga de comprobante, estados, panel administrador | ✅ Código hecho · falta crear Supabase: [docs/FASE2-PUESTA-EN-MARCHA.md](docs/FASE2-PUESTA-EN-MARCHA.md) |
| **3. Integraciones** | Email de confirmación, Google Calendar, (opcional) Mercado Pago | ⏳ Pendiente: ver [docs/ROADMAP.md](docs/ROADMAP.md) |

Mientras Supabase no esté conectado, el botón **RESERVAR** abre WhatsApp con un mensaje ya armado
y el contenido se lee de los archivos de abajo. Con Supabase conectado, todo se edita desde
el panel **/admin** y esos archivos quedan sólo como valores iniciales.

## ¿Dónde se cambia cada cosa?

| Quiero cambiar… | Archivo |
| --- | --- |
| Dirección, WhatsApp, email, Instagram, horarios, datos bancarios, % de seña | [`src/config/sitio.ts`](src/config/sitio.ts) |
| **Precios** | [`src/config/precios.ts`](src/config/precios.ts) |
| Logo y fotos | [`src/config/imagenes.ts`](src/config/imagenes.ts) + archivos en `public/images/` |
| Texto "Sobre mí" y títulos | [`src/content/textos.ts`](src/content/textos.ts) |
| Descripción, duración, cuidados de cada servicio | [`src/content/servicios.ts`](src/content/servicios.ts) |

Guía paso a paso (sin saber programar): [docs/CONFIGURACION.md](docs/CONFIGURACION.md).

> Fotos y logo se siguen cambiando en `src/config/imagenes.ts` (subirlas desde el panel queda pendiente).

## Correr el proyecto en tu compu

Requiere **Node.js 20.9 o superior** (recomendado: la versión LTS de https://nodejs.org).

```bash
npm install
```

```bash
npm run dev
```

Abrí http://localhost:3000.

Antes de publicar, verificá que todo compile y que pasen los tests:

```bash
npm run build
```

```bash
npm test
```

## Publicarlo

Ver [docs/INTEGRACIONES.md](docs/INTEGRACIONES.md): hosting (Vercel), dominio, Google Maps y reseñas de Google.

## Estructura

```text
src/
├── app/                 páginas (/, /manicuria, /rostro, /astrologia, /contacto), SEO
├── config/              ← datos editables (sitio, precios, imágenes)
├── content/             ← textos editables (servicios, sobre mí)
├── components/
│   ├── brand/           logo e íconos
│   ├── layout/          menú lateral, pie de página
│   ├── effects/         destellos, apariciones al hacer scroll, fondos
│   ├── illustrations/   esmalte, lima, ojo, ceja, órbita de planetas
│   ├── services/        círculos de servicios, fichas, botón Reservar
│   ├── contact/         datos de contacto, botones, mapa
│   ├── reviews/         reseñas de Google
│   ├── reservas/        flujo de reserva (pasos, calendario, datos bancarios)
│   └── admin/           piezas del panel
├── app/(sitio)/         páginas públicas + /reservar
├── app/admin/           panel (login, reservas, calendario, clientes, servicios, horarios, configuración)
├── proxy.ts             protege /admin (sesión)
└── lib/
    ├── datos/           ÚNICA puerta al contenido editable (base o archivos)
    ├── reservas/        acciones del servidor, validación, fechas
    ├── admin/           acciones del panel (siempre verifican admin)
    └── supabase/        clientes: público, con sesión, servidor (secreto)
supabase/migrations/     esquema, funciones, seguridad (RLS) y datos iniciales
tests/                   tests de la base (Postgres real con PGlite) y de validaciones
```
