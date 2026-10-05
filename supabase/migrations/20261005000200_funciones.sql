-- ============================================================
--  Funciones de negocio. Toda decisión sobre turnos ocurre acá,
--  dentro de la base, y nunca en el navegador.
-- ============================================================

-- ¿La persona con sesión iniciada es administradora?
create function public.es_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins a where a.user_id = (select auth.uid()));
$$;

-- ───────────────────────────────────────────────────────────
-- Horarios libres de un servicio para una fecha (hora de Buenos Aires).
-- Respeta: disponibilidad semanal, duración del servicio, bloqueos,
-- reservas activas, anticipación mínima y horizonte máximo.
-- ───────────────────────────────────────────────────────────
create function public.horarios_disponibles(p_servicio_id uuid, p_fecha date)
returns setof timestamptz
language plpgsql stable security definer set search_path = '' as $$
declare
  v_tz constant text := 'America/Argentina/Buenos_Aires';
  v_dur interval;
  v_reglas jsonb;
  v_paso interval;
  v_minimo timestamptz;
  v_hoy date;
begin
  select make_interval(mins => s.duracion_minutos) into v_dur
  from public.servicios s
  where s.id = p_servicio_id and s.activo;
  if v_dur is null then
    return;
  end if;

  select c.valor into v_reglas from public.configuracion c where c.clave = 'reservas';
  v_reglas := coalesce(v_reglas, '{}'::jsonb);
  v_paso := make_interval(mins => greatest(coalesce((v_reglas ->> 'intervaloMinutos')::int, 30), 5));
  v_minimo := now() + make_interval(hours => coalesce((v_reglas ->> 'anticipacionMinimaHoras')::int, 12));
  v_hoy := (now() at time zone v_tz)::date;

  if p_fecha < v_hoy or p_fecha > v_hoy + coalesce((v_reglas ->> 'horizonteDias')::int, 60) then
    return;
  end if;

  return query
  select distinct t.inicio
  from public.disponibilidad d
  cross join lateral generate_series(
    (p_fecha + d.desde) at time zone v_tz,
    ((p_fecha + d.hasta) at time zone v_tz) - v_dur,
    v_paso
  ) as t(inicio)
  where d.dia_semana = extract(dow from p_fecha)::int
    and t.inicio >= v_minimo
    and not exists (
      select 1 from public.bloqueos b
      where tstzrange(b.inicio, b.fin, '[)') && tstzrange(t.inicio, t.inicio + v_dur, '[)')
    )
    and not exists (
      select 1 from public.reservas r
      where r.estado in ('pendiente_verificacion', 'confirmada')
        and tstzrange(r.inicio, r.fin, '[)') && tstzrange(t.inicio, t.inicio + v_dur, '[)')
    )
  order by t.inicio;
end;
$$;

-- ───────────────────────────────────────────────────────────
-- Crear una reserva. Sólo la llama el servidor (service_role) después de
-- validar anti-spam y subir el comprobante al bucket privado.
-- Siempre nace como 'pendiente_verificacion'.
-- Errores (en el mensaje): DATOS_INVALIDOS, SERVICIO_INVALIDO,
-- DEMASIADAS_RESERVAS, HORARIO_NO_DISPONIBLE. Una carrera entre dos
-- reservas simultáneas termina en exclusion_violation (23P01).
-- ───────────────────────────────────────────────────────────
create function public.crear_reserva(
  p_servicio_slug text,
  p_inicio timestamptz,
  p_nombre text,
  p_email text,
  p_telefono text,
  p_comentarios text,
  p_comprobante_path text
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_tz constant text := 'America/Argentina/Buenos_Aires';
  v_servicio public.servicios;
  v_reglas jsonb;
  v_porcentaje int;
  v_cliente uuid;
  v_id uuid;
  v_nombre text := trim(coalesce(p_nombre, ''));
  v_email text := lower(trim(coalesce(p_email, '')));
  v_telefono text := trim(coalesce(p_telefono, ''));
  v_comentarios text := nullif(trim(coalesce(p_comentarios, '')), '');
begin
  if length(v_nombre) not between 2 and 120 then
    raise exception 'DATOS_INVALIDOS: nombre';
  end if;
  if length(v_email) > 254 or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'DATOS_INVALIDOS: email';
  end if;
  if length(v_telefono) > 30 or regexp_replace(v_telefono, '[^0-9]', '', 'g') !~ '^[0-9]{6,15}$' then
    raise exception 'DATOS_INVALIDOS: telefono';
  end if;
  if length(v_comentarios) > 1000 then
    raise exception 'DATOS_INVALIDOS: comentarios';
  end if;
  if coalesce(p_comprobante_path, '') !~ '^[0-9]{4}/[0-9]{2}/[0-9a-f-]{36}\.(jpg|png|pdf)$' then
    raise exception 'DATOS_INVALIDOS: comprobante';
  end if;

  select * into v_servicio from public.servicios s where s.slug = p_servicio_slug and s.activo;
  if not found then
    raise exception 'SERVICIO_INVALIDO';
  end if;

  select c.valor into v_reglas from public.configuracion c where c.clave = 'reservas';
  v_reglas := coalesce(v_reglas, '{}'::jsonb);
  v_porcentaje := coalesce((v_reglas ->> 'senaPorcentaje')::int, 50);

  -- Anti-spam: límite de reservas recientes por email
  if (
    select count(*) from public.reservas r
    join public.clientes c on c.id = r.cliente_id
    where lower(c.email) = v_email and r.creado_en > now() - interval '1 hour'
  ) >= coalesce((v_reglas ->> 'maxReservasPorHora')::int, 3) then
    raise exception 'DEMASIADAS_RESERVAS';
  end if;

  -- El horario tiene que ser exactamente uno de los ofrecidos
  if not exists (
    select 1
    from public.horarios_disponibles(v_servicio.id, (p_inicio at time zone v_tz)::date) h
    where h = p_inicio
  ) then
    raise exception 'HORARIO_NO_DISPONIBLE';
  end if;

  insert into public.clientes (nombre, email, telefono)
  values (v_nombre, v_email, v_telefono)
  on conflict ((lower(email))) do nothing
  returning id into v_cliente;
  if v_cliente is null then
    select c.id into v_cliente from public.clientes c where lower(c.email) = v_email;
  end if;

  insert into public.reservas (
    cliente_id, servicio_id, inicio, fin, estado,
    precio, sena_porcentaje, sena_monto,
    comentarios, comprobante_path, cliente_nombre, cliente_telefono
  ) values (
    v_cliente, v_servicio.id, p_inicio, p_inicio + make_interval(mins => v_servicio.duracion_minutos),
    'pendiente_verificacion',
    v_servicio.precio, v_porcentaje,
    case when v_servicio.precio is null then null else round(v_servicio.precio * v_porcentaje / 100.0)::int end,
    v_comentarios, p_comprobante_path, v_nombre, v_telefono
  )
  returning id into v_id;

  insert into public.eventos_reserva (reserva_id, estado_anterior, estado_nuevo)
  values (v_id, null, 'pendiente_verificacion');

  return v_id;
end;
$$;

-- ───────────────────────────────────────────────────────────
-- Cambiar el estado de una reserva. Sólo administradoras.
-- Transiciones válidas:
--   pendiente_verificacion → confirmada | rechazada | cancelada
--   confirmada             → cancelada
-- Devuelve true si cambió, false si ya estaba en ese estado (idempotente:
-- un doble clic en "Confirmar" no dispara dos emails en la Fase 3).
-- ───────────────────────────────────────────────────────────
create function public.cambiar_estado_reserva(
  p_reserva_id uuid,
  p_estado public.estado_reserva,
  p_motivo text default null
) returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  v_actual public.estado_reserva;
  v_motivo text := nullif(trim(coalesce(p_motivo, '')), '');
begin
  if not public.es_admin() then
    raise exception 'NO_AUTORIZADO' using errcode = '42501';
  end if;

  select r.estado into v_actual from public.reservas r where r.id = p_reserva_id for update;
  if not found then
    raise exception 'RESERVA_INEXISTENTE';
  end if;

  if v_actual = p_estado then
    return false;
  end if;

  if not (
    (v_actual = 'pendiente_verificacion' and p_estado in ('confirmada', 'rechazada', 'cancelada'))
    or (v_actual = 'confirmada' and p_estado = 'cancelada')
  ) then
    raise exception 'TRANSICION_INVALIDA: % → %', v_actual, p_estado;
  end if;

  update public.reservas r set
    estado = p_estado,
    motivo = coalesce(v_motivo, r.motivo),
    confirmada_en = case when p_estado = 'confirmada' then now() else r.confirmada_en end
  where r.id = p_reserva_id;

  insert into public.eventos_reserva (reserva_id, estado_anterior, estado_nuevo, actor, motivo)
  values (p_reserva_id, v_actual, p_estado, (select auth.uid()), v_motivo);

  return true;
end;
$$;
