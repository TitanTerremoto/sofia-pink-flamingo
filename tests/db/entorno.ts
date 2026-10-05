/**
 * Postgres real en memoria (PGlite) con lo mínimo de Supabase para correr
 * las migraciones de supabase/migrations tal cual y probar las reglas de negocio.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";

const SHIM_SUPABASE = `
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin bypassrls;

  create schema auth;
  create table auth.users (id uuid primary key, email text);
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  $$;
  grant usage on schema auth to anon, authenticated, service_role;
  grant execute on function auth.uid() to anon, authenticated, service_role;

  create schema storage;
  create table storage.buckets (
    id text primary key, name text, public boolean,
    file_size_limit bigint, allowed_mime_types text[]
  );
  create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
  alter table storage.objects enable row level security;

  -- Igual que Supabase: los roles de la API reciben permisos por defecto y RLS decide.
  grant usage on schema public to anon, authenticated, service_role;
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
  alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
  alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
`;

export const ADMIN_ID = "00000000-0000-4000-8000-0000000000ad";
export const OTRA_ID = "00000000-0000-4000-8000-0000000000bb";

export async function crearBase() {
  const db = new PGlite();
  await db.exec(SHIM_SUPABASE);
  const dir = join(process.cwd(), "supabase", "migrations");
  for (const archivo of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
    await db.exec(readFileSync(join(dir, archivo), "utf8"));
  }
  await db.exec(`
    insert into auth.users (id, email) values ('${ADMIN_ID}', 'sofi@example.com'), ('${OTRA_ID}', 'otra@example.com');
    insert into public.admins (user_id, email) values ('${ADMIN_ID}', 'sofi@example.com');
  `);
  return db;
}

/** Ejecuta `fn` como un rol de la API (anon / authenticated / service_role), opcionalmente con usuario. */
export async function como<T>(db: PGlite, rol: "anon" | "authenticated" | "service_role", usuario: string | null, fn: () => Promise<T>) {
  await db.exec(`set role ${rol}; select set_config('request.jwt.claim.sub', '${usuario ?? ""}', false);`);
  try {
    return await fn();
  } finally {
    await db.exec(`reset role; select set_config('request.jwt.claim.sub', '', false);`);
  }
}

/** Fecha (YYYY-MM-DD) en Buenos Aires, `dias` días después de hoy. */
export async function fechaBA(db: PGlite, dias: number) {
  const r = await db.query<{ f: string }>(
    `select ((now() at time zone 'America/Argentina/Buenos_Aires')::date + $1::int)::text as f`,
    [dias],
  );
  return r.rows[0].f;
}
