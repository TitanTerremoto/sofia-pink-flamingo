/**
 * Genera supabase/migrations/…_datos_iniciales.sql a partir de los valores
 * iniciales de src/config y src/content, para no copiarlos a mano.
 *
 *   npm run db:datos-iniciales
 *
 * Es idempotente (ON CONFLICT DO NOTHING): no pisa lo que ya se editó en el panel.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { reglasIniciales, sitioInicial } from "../src/config/sitio";
import { serviciosIniciales } from "../src/content/servicios";
import { textosIniciales } from "../src/content/textos";

const texto = (v: string | null | undefined) => (v == null ? "null" : `'${v.replace(/'/g, "''")}'`);
const json = (v: unknown) => `${texto(JSON.stringify(v))}::jsonb`;
const arreglo = (v: string[]) => `array[${v.map(texto).join(", ")}]::text[]`;

const filas = serviciosIniciales.map(
  (s, i) =>
    `  (${[
      texto(s.slug),
      `${texto(s.categoria)}::public.categoria_servicio`,
      texto(s.nombre),
      texto(s.tituloDescripcion),
      texto(s.descripcion),
      arreglo(s.incluye),
      texto(s.duracion),
      s.duracionMinutos,
      json(s.detalles),
      texto(s.destacado ?? null),
      s.precio ?? "null",
      (i + 1) * 10,
    ].join(", ")})`,
);

const sql = `-- ============================================================
--  Datos iniciales. GENERADO por scripts/generar-datos-iniciales.ts
--  desde src/config y src/content. No editar a mano.
--  No pisa datos existentes: después de esto, se edita desde /admin.
-- ============================================================

insert into public.servicios
  (slug, categoria, nombre, titulo_descripcion, descripcion, incluye, duracion_texto, duracion_minutos, detalles, destacado, precio, orden)
values
${filas.join(",\n")}
on conflict (slug) do nothing;

insert into public.configuracion (clave, valor) values
  ('sitio', ${json(sitioInicial)}),
  ('textos', ${json(textosIniciales)}),
  ('reservas', ${json(reglasIniciales)})
on conflict (clave) do nothing;
`;

const destino = join(process.cwd(), "supabase", "migrations", "20261005000400_datos_iniciales.sql");
writeFileSync(destino, sql, "utf8");
console.log(`Escrito ${destino} (${serviciosIniciales.length} servicios)`);
