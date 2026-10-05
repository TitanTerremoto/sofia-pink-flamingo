# Roadmap: Fases 2 y 3

Este documento es el plan de trabajo para continuar el proyecto. Está escrito para que
cualquier persona (o agente) pueda retomarlo sin el contexto de la conversación original.

---

## Principios que NO se negocian

1. **Un turno nunca se confirma porque el cliente subió un comprobante.** Sólo Sofi
   (o, en el futuro, el webhook verificado de Mercado Pago) puede confirmar.
2. **El email de "¡Tu turno está confirmado!" y el evento de Calendar se generan
   sólo después de la confirmación**, nunca antes.
3. **La base de datos es la única fuente de verdad** de turnos, estados, precios y disponibilidad.
   El navegador no decide nada: puede ser manipulado.
4. **Dos personas no pueden reservar el mismo horario**: lo garantiza una restricción de la
   base de datos, no una validación en pantalla.
5. **Ningún secreto en el frontend**: service-role key, credenciales de Google, API de email,
   todo en variables de entorno del servidor.
6. **Comprobantes privados**: almacenamiento no público; sólo el panel admin los ve, mediante
   links firmados que vencen.

---

## Stack recomendado

| Necesidad | Servicio | Motivo |
| --- | --- | --- |
| Base de datos + login admin + archivos | **Supabase** (Postgres, Auth, Storage) | Plan gratis generoso, RLS, almacenamiento privado, todo versionable en `supabase/migrations` |
| Emails | **Resend** (+ React Email para la plantilla) | Simple, buena entregabilidad, plantillas en el mismo repo |
| Calendario | **Google Calendar API** con OAuth de la cuenta de Sofi | Permite crear el evento en SU calendario e invitar al cliente |
| Anti-spam | **Cloudflare Turnstile** | Gratis, sin "elegí los semáforos" |
| Pagos automáticos (futuro) | **Mercado Pago** Checkout Pro + webhook | Estándar en Argentina |

---

## FASE 2 — Sistema de reservas + panel administrador

### 2.1 Modelo de datos (Postgres / Supabase)

```text
servicios        id, slug, categoria, nombre, descripcion, incluye[], duracion_texto,
                 duracion_minutos, detalles jsonb, precio (int, null = "$ X"), activo, orden
clientes         id, nombre, email, telefono, creado_en
reservas         id, cliente_id, servicio_id, inicio timestamptz, fin timestamptz,
                 estado enum('pendiente_verificacion','confirmada','rechazada','cancelada'),
                 precio_al_reservar int, sena_monto int, sena_porcentaje int,
                 comprobante_path text, motivo_rechazo text,
                 confirmada_en, confirmada_por, email_enviado_en, calendar_event_id,
                 creado_en, actualizado_en
disponibilidad   dia_semana (0-6), desde time, hasta time, categoria (opcional)
bloqueos         inicio timestamptz, fin timestamptz, motivo   ← días/horarios bloqueados
configuracion    clave text pk, valor jsonb   ← dirección, whatsapp, banco, textos, % seña…
eventos_reserva  reserva_id, estado_anterior, estado_nuevo, actor, creado_en   ← auditoría
```

**Anti doble reserva** (lo central):

```sql
create extension if not exists btree_gist;
alter table reservas add constraint sin_superposicion
  exclude using gist (tstzrange(inicio, fin) with &&)
  where (estado in ('pendiente_verificacion', 'confirmada'));
```

Así, aunque dos personas envíen al mismo segundo, la base rechaza la segunda.
Si Sofi rechaza o cancela, el horario se libera automáticamente.

> **Pregunta abierta para Sofi:** ¿se puede atender a dos personas a la vez en distintas
> categorías (ej. una astrología online mientras otra persona espera)? Por ahora se asume
> que **no**: una sola agenda.

### 2.2 Flujo del cliente (`/reservar?servicio=kapping`)

```text
1. Datos: nombre, email, teléfono (inputs con type="email"/"tel", autocomplete)
2. Servicio + fecha + horario   ← horarios libres calculados en el SERVIDOR
3. Pantalla de seña: "Para confirmar tu turno se requiere una seña del 50 %."
   + alias / CBU / titular / CUIT (desde configuracion) + monto calculado
4. Subir comprobante (JPG, PNG o PDF, máx. 5 MB)
5. Envío único → Server Action:
     - valida Turnstile, datos y archivo (tipo REAL por magic bytes, no por extensión)
     - recalcula precio y seña en el servidor
     - sube el archivo al bucket privado
     - inserta la reserva en estado 'pendiente_verificacion' (la restricción evita choques)
     - si falla el insert, borra el archivo subido
6. Pantalla final: "Recibimos tu comprobante. Tu turno queda PENDIENTE DE VERIFICACIÓN…"
   + (astrología) "Una vez confirmada tu reserva recibirás información sobre los tiempos…"
```

Notas:

- No se crea nada en la base hasta el paso 5 → no quedan horarios "tomados" por gente que abandonó.
- Si el horario se ocupó entre el paso 2 y el 5, se muestra un mensaje amable y se vuelve al paso 2.
- Rate-limit por IP en la Server Action.

### 2.3 Panel administrador (`/admin`)

- Login con Supabase Auth (email + contraseña de Sofi, o magic link). Sólo emails en una
  lista de admins (tabla `admins` + RLS). `proxy.ts` (ex-middleware en Next 16) redirige si no hay sesión.
- **Reservas**: lista filtrable por estado/fecha; detalle con nombre, email, teléfono,
  servicio, fecha, horario y **comprobante** (link firmado de 5 min).
  Botones: **Confirmar seña** · **Rechazar seña** (con motivo) · **Cancelar reserva**.
- **Calendario**: vista semana/mes de turnos (colores por estado).
- **Clientes**: historial por cliente.
- **Servicios y precios**: editar nombre, descripciones, duración, precio, activo/inactivo.
- **Horarios disponibles**: franjas por día de la semana + **bloqueos** de días/horarios.
- **Configuración**: dirección, WhatsApp, email, Instagram, datos bancarios, % seña, textos.
- **Fotos**: subir a Supabase Storage (bucket público `fotos`), reemplaza `src/config/imagenes.ts`.

Al pasar los datos a la base, los archivos `src/config/*` y `src/content/*` quedan como
**valores iniciales (seed)** y se elimina su uso directo de las páginas, para que no haya dos fuentes de verdad.

### 2.4 Transiciones de estado (sólo en el servidor)

```text
pendiente_verificacion → confirmada   (Sofi)       → dispara email + Calendar (Fase 3)
pendiente_verificacion → rechazada    (Sofi)       → email "no pudimos verificar tu seña" (Fase 3)
pendiente_verificacion → cancelada    (Sofi)
confirmada             → cancelada    (Sofi)       → borra/cancela evento de Calendar
```

Cualquier otra transición se rechaza. Cada cambio se registra en `eventos_reserva`.
Confirmar dos veces no envía dos emails (se chequea `email_enviado_en`).

### 2.5 Tests mínimos

- Dos reservas simultáneas al mismo horario → sólo una entra.
- Archivo `.exe` renombrado a `.jpg` → rechazado.
- Usuario no admin llamando a "confirmar" → rechazado.
- Doble clic en "Confirmar" → un solo email / un solo evento.
- Nombre de cliente con `<script>` → se muestra como texto.

---

## FASE 3 — Email, Google Calendar y (opcional) Mercado Pago

### 3.1 Email de confirmación (Resend)

**Cuenta:** https://resend.com → verificar el dominio propio (registros DNS que indica Resend)
→ crear API key.
**Variables:** `RESEND_API_KEY`, `EMAIL_REMITENTE="Sofía Pink Flamingo <turnos@tu-dominio.com.ar>"`.

Plantilla (React Email, estética rosa/blanco, tipografía serif):
"¡Tu turno está confirmado!", nombre, servicio, fecha, horario, dirección, indicaciones para llegar,
información importante, % de seña abonado (y monto), condiciones de cancelación/reprogramación,
datos de contacto. Para astrología, además, el texto sobre tiempos de preparación de la carta.

Se envía **sólo** desde la acción "Confirmar seña", después de que el cambio de estado
quedó guardado. Si el envío falla, el turno sigue confirmado y el panel muestra
"Email pendiente — Reintentar".

> Sin dominio propio, Resend sólo permite enviar a tu propio email (modo prueba).
> El dominio es necesario para producción.

### 3.2 Google Calendar

**Cuenta:** la cuenta de Google de Sofi.

1. https://console.cloud.google.com → mismo proyecto que Places (o uno nuevo).
2. **Habilitar "Google Calendar API".**
3. **Pantalla de consentimiento OAuth**: tipo *Externo*, agregar a Sofi como usuaria de prueba
   y luego **publicar la app** (si queda en "Prueba", el token vence cada 7 días).
   Scope: `https://www.googleapis.com/auth/calendar.events`.
4. **Credenciales → ID de cliente OAuth → Aplicación web.**
   URI de redirección: `https://tu-dominio/api/google/callback`.
5. En el panel admin habrá un botón **"Conectar Google Calendar"**: Sofi inicia sesión una vez,
   el servidor guarda el *refresh token* cifrado en la base.

**Variables:** `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_CALENDAR_ID`
(normalmente `primary`), `TOKEN_ENCRYPTION_KEY`.

Al confirmar: se crea el evento en el calendario de Sofi con nombre del cliente, servicio,
fecha, hora, teléfono, email, ubicación y notas; el cliente se agrega como invitado con
`sendUpdates=all`, así recibe la invitación de Google Calendar. Se guarda `calendar_event_id`
para no duplicar y para poder cancelar.

> ¿Por qué OAuth y no "cuenta de servicio"? Una cuenta de servicio no puede invitar
> personas sin Google Workspace con delegación de dominio. OAuth de la cuenta de Sofi sí.

### 3.3 Mercado Pago (opcional, futuro)

- Cuenta de vendedor en Mercado Pago → **Tus integraciones → Crear aplicación** →
  credenciales de producción (`MP_ACCESS_TOKEN`) y **secreto de webhook** (`MP_WEBHOOK_SECRET`).
- Flujo: reserva creada como `pendiente_pago` (estado nuevo, con vencimiento de 20–30 min) →
  Checkout Pro → **webhook** `/api/mp/webhook`:
  - verifica la firma `x-signature`,
  - consulta el pago a la API de MP (no confía en el cuerpo del webhook),
  - es **idempotente** (`payment_id` único): dos notificaciones no confirman dos veces,
  - pasa la reserva a `confirmada` y dispara email + Calendar igual que la confirmación manual.
- Nunca se confirma por la página de "pago exitoso" del navegador.
- La transferencia manual con comprobante sigue disponible como alternativa.

---

## Checklist de cuentas a crear (resumen)

| Cuenta | Fase | Para qué | Variables |
| --- | --- | --- | --- |
| GitHub | 1 | Código | — |
| Vercel | 1 | Publicar | `NEXT_PUBLIC_SITE_URL` |
| Dominio (nic.ar) | 1 | Dirección web + emails | — |
| Google Business Profile | 1 | Reseñas | links en `sitio.ts` |
| Google Cloud (Places API) | 1 | Reseñas automáticas | `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID` |
| Supabase | 2 | Base de datos, login, comprobantes | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (sólo servidor) |
| Cloudflare Turnstile | 2 | Anti-spam | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` |
| Resend | 3 | Emails | `RESEND_API_KEY`, `EMAIL_REMITENTE` |
| Google Cloud (Calendar API + OAuth) | 3 | Calendario | `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_CALENDAR_ID`, `TOKEN_ENCRYPTION_KEY` |
| Mercado Pago | futuro | Cobro automático | `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET` |
