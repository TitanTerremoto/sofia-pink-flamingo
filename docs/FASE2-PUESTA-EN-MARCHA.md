# Fase 2: cómo activar las reservas online y el panel

El código de la Fase 2 ya está en el repo. Para que funcione falta crear la base de datos
(Supabase, plan gratis) y cargar 3 variables en Vercel. Son unos 20 minutos.

Mientras no se haga esto, el sitio funciona igual que en la Fase 1 (RESERVAR abre WhatsApp)
y `/admin` muestra un aviso.

---

## 1. Crear el proyecto en Supabase

1. Entrar a https://supabase.com → **Start your project** → registrarse (puede ser con GitHub).
2. **New project**:
   - Name: `sofia-pink-flamingo`
   - Database password: generar una y guardarla en un lugar seguro (no se usa en la web).
   - Region: **South America (São Paulo)** (la más cercana).
3. Esperar a que termine de crearse (~2 min).

## 2. Crear las tablas (migraciones)

En Supabase: **SQL Editor → New query**. Copiar y ejecutar (**Run**), **en este orden**,
el contenido completo de cada archivo de `supabase/migrations/`:

1. `20261005000100_esquema.sql`
2. `20261005000200_funciones.sql`
3. `20261005000300_seguridad.sql`
4. `20261005000400_datos_iniciales.sql`

Cada uno debe terminar con "Success". (Alternativa para quien use terminal:
`npx supabase link` + `npx supabase db push`.)

## 3. Crear el usuario de Sofi para el panel

1. **Authentication → Users → Add user → Create new user**: email y contraseña de Sofi
   (marcar *Auto Confirm User*).
2. **Authentication → Sign In / Providers → Email**: desactivar **"Allow new users to sign up"**
   (así nadie más puede crearse una cuenta).
3. **SQL Editor**, ejecutar (cambiando el email):

```sql
insert into public.admins (user_id, email)
select id, email from auth.users where email = 'EMAIL-DE-SOFI@ejemplo.com';
```

## 4. Variables de entorno en Vercel

En Supabase: **Project Settings → API** (o **API Keys**). En Vercel: **Settings → Environment Variables**:

| Variable | Valor | ¿Es secreta? |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | No (es pública por diseño) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clave `anon` / *publishable* | No (la protegen las reglas RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | clave `service_role` / *secret* | **SÍ. Nunca con prefijo NEXT_PUBLIC_ ni en el código** |

Después: **Deployments → Redeploy**.

## 5. Anti-spam (recomendado)

1. https://dash.cloudflare.com → **Turnstile → Add widget** → dominio del sitio → modo *Managed*.
2. En Vercel:
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` = Site Key
   - `TURNSTILE_SECRET_KEY` = Secret Key (secreta)

Sin estas variables el formulario funciona igual, protegido por el campo trampa y el límite por email.

## 6. Primeros pasos en el panel

Entrar a `https://TU-SITIO/admin`:

1. **Horarios** → cargar las franjas de atención (ej. martes 10:00–19:00). Sin franjas no hay turnos.
2. **Servicios y precios** → precios y duración real en minutos.
3. **Configuración** → WhatsApp, email, Instagram, dirección, datos bancarios, condiciones de cancelación.
4. Probar una reserva desde el celular y confirmarla desde el panel.

---

## Cómo funciona (resumen)

```text
Clienta: datos → día y horario → seña (datos bancarios) → sube comprobante
   ↓ (servidor: valida, sube el archivo a un bucket PRIVADO, llama a crear_reserva)
Reserva = PENDIENTE DE VERIFICACIÓN   ← el horario queda tomado
   ↓
Sofi en /admin: ve el comprobante → Confirmar / Rechazar / Cancelar
   ↓
CONFIRMADA (o el horario se libera si se rechaza/cancela)
   ↓
Fase 3: email automático + Google Calendar
```

- **Nunca** se confirma un turno por subir un comprobante.
- La base de datos impide que dos turnos se superpongan (una sola agenda), aunque dos personas
  reserven en el mismo segundo.
- Los comprobantes sólo los puede ver una admin, con links que vencen a los 5 minutos.
- Tests de estas reglas: `npm test`.
