-- ============================================================
--  Seguridad: RLS, permisos y almacenamiento de comprobantes.
--  Para cada tabla queda explícito quién puede leer y escribir.
-- ============================================================

alter table public.servicios enable row level security;
alter table public.clientes enable row level security;
alter table public.reservas enable row level security;
alter table public.eventos_reserva enable row level security;
alter table public.disponibilidad enable row level security;
alter table public.bloqueos enable row level security;
alter table public.configuracion enable row level security;
alter table public.admins enable row level security;

-- servicios ─ público: lee los activos · admin: lee y edita todo
create policy servicios_lectura on public.servicios
  for select to anon, authenticated using (activo or public.es_admin());
create policy servicios_admin_inserta on public.servicios
  for insert to authenticated with check (public.es_admin());
create policy servicios_admin_edita on public.servicios
  for update to authenticated using (public.es_admin()) with check (public.es_admin());

-- configuracion ─ público: lee (datos que igual se muestran en el sitio) · admin: edita
create policy configuracion_lectura on public.configuracion
  for select to anon, authenticated using (true);
create policy configuracion_admin_inserta on public.configuracion
  for insert to authenticated with check (public.es_admin());
create policy configuracion_admin_edita on public.configuracion
  for update to authenticated using (public.es_admin()) with check (public.es_admin());

-- disponibilidad y bloqueos ─ sólo admin (el público usa horarios_disponibles())
create policy disponibilidad_admin on public.disponibilidad
  for all to authenticated using (public.es_admin()) with check (public.es_admin());
create policy bloqueos_admin on public.bloqueos
  for all to authenticated using (public.es_admin()) with check (public.es_admin());

-- clientes, reservas, eventos ─ sólo admin LEE. Nadie escribe directo:
-- se crean con crear_reserva() y cambian con cambiar_estado_reserva().
create policy clientes_admin_lee on public.clientes
  for select to authenticated using (public.es_admin());
create policy reservas_admin_lee on public.reservas
  for select to authenticated using (public.es_admin());
create policy eventos_admin_lee on public.eventos_reserva
  for select to authenticated using (public.es_admin());

-- admins ─ cada admin ve su propia fila (para chequear acceso). Se gestionan desde el SQL editor.
create policy admins_propia on public.admins
  for select to authenticated using (user_id = (select auth.uid()));

-- Defensa en profundidad: aunque una policy se agregara por error,
-- el navegador no tiene permiso de escritura sobre estas tablas.
revoke insert, update, delete, truncate on public.clientes, public.reservas, public.eventos_reserva, public.admins
  from anon, authenticated;
revoke all on public.disponibilidad, public.bloqueos, public.clientes, public.reservas, public.eventos_reserva, public.admins
  from anon;
revoke insert, update, delete, truncate on public.servicios, public.configuracion from anon;

-- ───────────── Funciones ─────────────
revoke execute on function public.crear_reserva(text, timestamptz, text, text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.crear_reserva(text, timestamptz, text, text, text, text, text)
  to service_role;

revoke execute on function public.cambiar_estado_reserva(uuid, public.estado_reserva, text) from public, anon;
grant execute on function public.cambiar_estado_reserva(uuid, public.estado_reserva, text) to authenticated;

revoke execute on function public.horarios_disponibles(uuid, date) from public;
grant execute on function public.horarios_disponibles(uuid, date) to anon, authenticated, service_role;

revoke execute on function public.es_admin() from public;
grant execute on function public.es_admin() to anon, authenticated, service_role;

-- ───────────── Comprobantes (bucket PRIVADO) ─────────────
-- Sube el servidor con service_role. Sólo admins pueden leer (vía links firmados).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('comprobantes', 'comprobantes', false, 4194304, array['image/jpeg', 'image/png', 'application/pdf'])
on conflict (id) do nothing;

create policy comprobantes_admin_lee on storage.objects
  for select to authenticated using (bucket_id = 'comprobantes' and public.es_admin());
