-- ============================================================
--  Sofía Pink Flamingo — Esquema de reservas (Fase 2)
-- ============================================================
--  Principios (ver docs/ROADMAP.md):
--   * La base es la única fuente de verdad de turnos, precios y disponibilidad.
--   * Dos turnos activos nunca se superponen (una sola agenda): lo garantiza
--     la restricción EXCLUDE de `reservas`, no la interfaz.
--   * Un turno sólo pasa a 'confirmada' por acción de una admin.
-- ============================================================

create type public.estado_reserva as enum (
  'pendiente_verificacion',
  'confirmada',
  'rechazada',
  'cancelada'
);

create type public.categoria_servicio as enum ('manicuria', 'rostro', 'astrologia');

-- ───────────── Servicios y precios ─────────────
create table public.servicios (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  categoria public.categoria_servicio not null,
  nombre text not null check (length(nombre) between 1 and 120),
  titulo_descripcion text not null default 'Descripción',
  descripcion text not null default '',
  incluye text[] not null default '{}',
  duracion_texto text not null default '',
  duracion_minutos int not null check (duracion_minutos between 15 and 480),
  -- [{ "titulo": "...", "texto": "..." }]
  detalles jsonb not null default '[]'::jsonb check (jsonb_typeof(detalles) = 'array'),
  destacado text,
  -- null = todavía sin precio (el sitio muestra "$ X")
  precio int check (precio is null or precio >= 0),
  activo boolean not null default true,
  orden int not null default 0,
  actualizado_en timestamptz not null default now()
);

-- ───────────── Clientes ─────────────
create table public.clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (length(nombre) between 2 and 120),
  email text not null check (length(email) <= 254),
  telefono text not null check (length(telefono) between 6 and 30),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);
create unique index clientes_email_unico on public.clientes (lower(email));

-- ───────────── Reservas ─────────────
create table public.reservas (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes (id) on delete restrict,
  -- Nombre y teléfono congelados en cada reserva: reutilizar un email
  -- no permite pisar los datos de reservas anteriores.
  cliente_nombre text not null check (length(cliente_nombre) between 2 and 120),
  cliente_telefono text not null check (length(cliente_telefono) between 6 and 30),
  servicio_id uuid not null references public.servicios (id) on delete restrict,
  inicio timestamptz not null,
  fin timestamptz not null,
  estado public.estado_reserva not null default 'pendiente_verificacion',
  -- Precio y seña congelados al momento de reservar (si después cambia el precio, no afecta).
  precio int,
  sena_porcentaje int not null check (sena_porcentaje between 0 and 100),
  sena_monto int,
  comentarios text check (length(comentarios) <= 1000),
  -- Ruta dentro del bucket privado "comprobantes"
  comprobante_path text not null,
  motivo text check (length(motivo) <= 500),
  confirmada_en timestamptz,
  -- Fase 3: idempotencia de email y Calendar
  email_enviado_en timestamptz,
  calendar_event_id text,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint reservas_rango_valido check (fin > inicio),
  -- UNA SOLA AGENDA: dos reservas activas no pueden superponerse.
  constraint reservas_sin_superposicion exclude using gist (
    tstzrange(inicio, fin, '[)') with &&
  ) where (estado in ('pendiente_verificacion', 'confirmada'))
);
create index reservas_inicio_idx on public.reservas (inicio);
create index reservas_estado_idx on public.reservas (estado, inicio);
create index reservas_cliente_idx on public.reservas (cliente_id);

-- Historial de cambios de estado (auditoría)
create table public.eventos_reserva (
  id bigint generated always as identity primary key,
  reserva_id uuid not null references public.reservas (id) on delete cascade,
  estado_anterior public.estado_reserva,
  estado_nuevo public.estado_reserva not null,
  actor uuid,
  motivo text,
  creado_en timestamptz not null default now()
);
create index eventos_reserva_reserva_idx on public.eventos_reserva (reserva_id, creado_en);

-- ───────────── Disponibilidad ─────────────
-- Franjas semanales en hora de Buenos Aires. dia_semana: 0 = domingo … 6 = sábado.
create table public.disponibilidad (
  id uuid primary key default gen_random_uuid(),
  dia_semana smallint not null check (dia_semana between 0 and 6),
  desde time not null,
  hasta time not null,
  constraint disponibilidad_rango_valido check (hasta > desde)
);

-- Días u horarios bloqueados (vacaciones, trámites, etc.)
create table public.bloqueos (
  id uuid primary key default gen_random_uuid(),
  inicio timestamptz not null,
  fin timestamptz not null,
  motivo text check (length(motivo) <= 200),
  creado_en timestamptz not null default now(),
  constraint bloqueos_rango_valido check (fin > inicio)
);
create index bloqueos_rango_idx on public.bloqueos using gist (tstzrange(inicio, fin, '[)'));

-- ───────────── Configuración editable ─────────────
-- Claves: 'sitio' (contacto, ubicación, banco…), 'textos' y 'reservas' (reglas de agenda).
-- El formato de cada valor está definido en src/lib/datos/tipos.ts.
create table public.configuracion (
  clave text primary key,
  valor jsonb not null,
  actualizado_en timestamptz not null default now()
);

-- ───────────── Administradoras ─────────────
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  creado_en timestamptz not null default now()
);

-- ───────────── actualizado_en automático ─────────────
create function public.tocar_actualizado_en() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.actualizado_en := now();
  return new;
end;
$$;

create trigger servicios_actualizado before update on public.servicios
  for each row execute function public.tocar_actualizado_en();
create trigger clientes_actualizado before update on public.clientes
  for each row execute function public.tocar_actualizado_en();
create trigger reservas_actualizado before update on public.reservas
  for each row execute function public.tocar_actualizado_en();
create trigger configuracion_actualizado before update on public.configuracion
  for each row execute function public.tocar_actualizado_en();
