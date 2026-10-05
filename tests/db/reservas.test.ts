/**
 * Invariantes del sistema de reservas, probadas contra Postgres real:
 *  - nunca dos turnos activos superpuestos (aunque lleguen a la vez);
 *  - una reserva nace "pendiente de verificación" y sólo una admin la confirma;
 *  - el navegador (anon) no puede leer ni escribir reservas.
 */
import { after, before, beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import type { PGlite } from "@electric-sql/pglite";
import { ADMIN_ID, OTRA_ID, como, crearBase, fechaBA } from "./entorno";

let db: PGlite;
let fecha: string;
let servicioId: string;
let comprobanteN = 0;

const comprobante = () => `2026/10/${String(++comprobanteN).padStart(8, "0")}-0000-4000-8000-000000000000.jpg`;

/** Instante en Buenos Aires para la fecha de prueba, ej. hora("10:00"). */
async function hora(hhmm: string) {
  const r = await db.query<{ t: string }>(
    `select (($1::date + $2::time) at time zone 'America/Argentina/Buenos_Aires')::text as t`,
    [fecha, hhmm],
  );
  return r.rows[0].t;
}

async function reservar(inicio: string, email = "cliente@example.com", slug = "kapping") {
  return como(db, "service_role", null, async () => {
    const r = await db.query<{ id: string }>(
      `select public.crear_reserva($1, $2::timestamptz, 'Ana Cliente', $3, '+54 9 11 5555-5555', null, $4) as id`,
      [slug, inicio, email, comprobante()],
    );
    return r.rows[0].id;
  });
}

async function cambiarEstado(id: string, estado: string, usuario = ADMIN_ID) {
  return como(db, "authenticated", usuario, async () => {
    const r = await db.query<{ cambio: boolean }>(
      `select public.cambiar_estado_reserva($1, $2::public.estado_reserva, 'motivo') as cambio`,
      [id, estado],
    );
    return r.rows[0].cambio;
  });
}

async function libres(slug = "kapping") {
  const r = await db.query<{ h: string }>(
    `select to_char(h at time zone 'America/Argentina/Buenos_Aires', 'HH24:MI') as h
     from public.horarios_disponibles((select id from public.servicios where slug = $1), $2::date) h`,
    [slug, fecha],
  );
  return r.rows.map((x) => x.h);
}

before(async () => {
  db = await crearBase();
  fecha = await fechaBA(db, 3);
  await db.query(
    `insert into public.disponibilidad (dia_semana, desde, hasta)
     values (extract(dow from $1::date)::int, '10:00', '13:00')`,
    [fecha],
  );
  await db.exec(`
    insert into public.configuracion (clave, valor) values
      ('reservas', '{"senaPorcentaje": 50, "intervaloMinutos": 30, "anticipacionMinimaHoras": 12, "horizonteDias": 60, "maxReservasPorHora": 3}');
    insert into public.servicios (slug, categoria, nombre, duracion_minutos, precio) values
      ('kapping', 'manicuria', 'Kapping', 90, 20000),
      ('diseno', 'rostro', 'Diseño', 45, null);
  `);
  servicioId = (await db.query<{ id: string }>(`select id from public.servicios where slug = 'kapping'`)).rows[0].id;
});

after(async () => db.close());

beforeEach(async () => {
  await db.exec(`delete from public.reservas; delete from public.clientes; delete from public.bloqueos;`);
});

describe("horarios disponibles", () => {
  test("ofrece turnos que terminan dentro de la franja", async () => {
    // 10:00–13:00 con servicio de 90 min cada 30 → último inicio 11:30
    assert.deepEqual(await libres(), ["10:00", "10:30", "11:00", "11:30"]);
  });

  test("una reserva activa (de cualquier servicio) ocupa la agenda", async () => {
    await reservar(await hora("10:30"));
    // 10:30–12:00 ocupado: un diseño de 45 min sólo entra a las 12:00
    assert.deepEqual(await libres("diseno"), ["12:00"]);
  });

  test("un bloqueo quita los horarios que lo tocan", async () => {
    await db.query(`insert into public.bloqueos (inicio, fin) values ($1, $2)`, [await hora("11:00"), await hora("11:30")]);
    // kapping (90 min): sólo 11:30–13:00 no toca el bloqueo 11:00–11:30
    assert.deepEqual(await libres(), ["11:30"]);
    assert.deepEqual(await libres("diseno"), ["10:00", "11:30", "12:00"]);
  });

  test("no ofrece fechas pasadas ni fuera del horizonte", async () => {
    const r = await db.query(`select * from public.horarios_disponibles($1, current_date - 1)`, [servicioId]);
    assert.equal(r.rows.length, 0);
    const lejos = await db.query(`select * from public.horarios_disponibles($1, current_date + 400)`, [servicioId]);
    assert.equal(lejos.rows.length, 0);
  });
});

describe("crear reserva", () => {
  test("nace pendiente de verificación, con precio y seña congelados", async () => {
    const id = await reservar(await hora("10:00"));
    const r = await db.query<{ estado: string; precio: number; sena_monto: number }>(
      `select estado, precio, sena_monto from public.reservas where id = $1`,
      [id],
    );
    assert.deepEqual(r.rows[0], { estado: "pendiente_verificacion", precio: 20000, sena_monto: 10000 });
  });

  test("no permite reservar el mismo horario dos veces", async () => {
    await reservar(await hora("10:00"));
    await assert.rejects(reservar(await hora("10:00"), "otra@example.com"), /HORARIO_NO_DISPONIBLE/);
  });

  test("no permite superponer horarios parcialmente", async () => {
    await reservar(await hora("10:00"));
    await assert.rejects(reservar(await hora("11:00"), "otra@example.com"), /HORARIO_NO_DISPONIBLE/);
  });

  test("la base rechaza superposiciones aunque se saltee la validación (carrera)", async () => {
    const id = await reservar(await hora("10:00"));
    await assert.rejects(
      db.query(
        `insert into public.reservas (cliente_id, servicio_id, inicio, fin, sena_porcentaje, comprobante_path, cliente_nombre, cliente_telefono)
         select cliente_id, servicio_id, inicio + interval '30 min', fin + interval '30 min', 50, 'x', 'Otra', '1155555555'
         from public.reservas where id = $1`,
        [id],
      ),
      /reservas_sin_superposicion/,
    );
  });

  test("rechazar una reserva libera el horario", async () => {
    const id = await reservar(await hora("10:00"));
    await cambiarEstado(id, "rechazada");
    assert.ok((await libres()).includes("10:00"));
    await reservar(await hora("10:00"), "otra@example.com");
  });

  test("rechaza horarios que no están ofrecidos", async () => {
    await assert.rejects(reservar(await hora("10:15")), /HORARIO_NO_DISPONIBLE/);
    await assert.rejects(reservar(await hora("12:00")), /HORARIO_NO_DISPONIBLE/); // terminaría 13:30
  });

  test("valida datos y ruta del comprobante", async () => {
    const inicio = await hora("10:00");
    await como(db, "service_role", null, async () => {
      await assert.rejects(
        db.query(`select public.crear_reserva('kapping', $1, 'Ana', 'no-es-email', '1155555555', null, $2)`, [inicio, comprobante()]),
        /DATOS_INVALIDOS: email/,
      );
      await assert.rejects(
        db.query(`select public.crear_reserva('kapping', $1, 'Ana', 'a@b.co', '1155555555', null, '../../secreto.jpg')`, [inicio]),
        /DATOS_INVALIDOS: comprobante/,
      );
      await assert.rejects(
        db.query(`select public.crear_reserva('no-existe', $1, 'Ana', 'a@b.co', '1155555555', null, $2)`, [inicio, comprobante()]),
        /SERVICIO_INVALIDO/,
      );
    });
  });

  test("limita reservas repetidas del mismo email (anti-spam)", async () => {
    await db.exec(`update public.configuracion set valor = valor || '{"maxReservasPorHora": 1}' where clave = 'reservas'`);
    try {
      await reservar(await hora("10:00"));
      await assert.rejects(reservar(await hora("11:30")), /DEMASIADAS_RESERVAS/);
    } finally {
      await db.exec(`update public.configuracion set valor = valor || '{"maxReservasPorHora": 3}' where clave = 'reservas'`);
    }
  });

  test("reutilizar un email no pisa los datos de reservas anteriores", async () => {
    const id1 = await reservar(await hora("10:00"));
    const inicio2 = await hora("12:00");
    await como(db, "service_role", null, () =>
      db.query(`select public.crear_reserva('diseno', $1, 'Impostora', 'cliente@example.com', '1199999999', null, $2)`, [
        inicio2,
        comprobante(),
      ]),
    );
    const r = await db.query<{ cliente_nombre: string }>(
      `select cliente_nombre from public.reservas order by inicio`,
    );
    assert.deepEqual(
      r.rows.map((x) => x.cliente_nombre),
      ["Ana Cliente", "Impostora"],
    );
    const clientes = await db.query(`select * from public.clientes`);
    assert.equal(clientes.rows.length, 1);
    assert.ok(id1);
  });
});

describe("estados", () => {
  test("sólo una admin puede confirmar", async () => {
    const id = await reservar(await hora("10:00"));
    await assert.rejects(cambiarEstado(id, "confirmada", OTRA_ID), /NO_AUTORIZADO/);
    await assert.rejects(
      como(db, "anon", null, () => db.query(`select public.cambiar_estado_reserva($1, 'confirmada')`, [id])),
      /permission denied/,
    );
    assert.equal(await cambiarEstado(id, "confirmada"), true);
  });

  test("confirmar dos veces es idempotente", async () => {
    const id = await reservar(await hora("10:00"));
    assert.equal(await cambiarEstado(id, "confirmada"), true);
    assert.equal(await cambiarEstado(id, "confirmada"), false);
    const ev = await db.query(`select * from public.eventos_reserva where reserva_id = $1`, [id]);
    assert.equal(ev.rows.length, 2); // creada + confirmada
  });

  test("transiciones inválidas se rechazan", async () => {
    const id = await reservar(await hora("10:00"));
    await cambiarEstado(id, "rechazada");
    await assert.rejects(cambiarEstado(id, "confirmada"), /TRANSICION_INVALIDA/);
    const id2 = await reservar(await hora("10:00"), "otra@example.com");
    await cambiarEstado(id2, "confirmada");
    await assert.rejects(cambiarEstado(id2, "pendiente_verificacion"), /TRANSICION_INVALIDA/);
    assert.equal(await cambiarEstado(id2, "cancelada"), true);
  });
});

describe("permisos del navegador", () => {
  test("anon no ve reservas ni clientes", async () => {
    await reservar(await hora("10:00"));
    await como(db, "anon", null, async () => {
      await assert.rejects(db.query(`select * from public.reservas`), /permission denied/);
      await assert.rejects(db.query(`select * from public.clientes`), /permission denied/);
    });
  });

  test("anon no puede crear reservas directamente", async () => {
    const inicio = await hora("10:00");
    await como(db, "anon", null, async () => {
      await assert.rejects(
        db.query(`select public.crear_reserva('kapping', $1, 'Ana', 'a@b.co', '1155555555', null, $2)`, [inicio, comprobante()]),
        /permission denied/,
      );
    });
  });

  test("una usuaria logueada que no es admin no ve reservas", async () => {
    await reservar(await hora("10:00"));
    const r = await como(db, "authenticated", OTRA_ID, () => db.query(`select * from public.reservas`));
    assert.equal(r.rows.length, 0);
  });

  test("la admin ve reservas y puede editar precios", async () => {
    await reservar(await hora("10:00"));
    await como(db, "authenticated", ADMIN_ID, async () => {
      assert.equal((await db.query(`select * from public.reservas`)).rows.length, 1);
      await db.query(`update public.servicios set precio = 25000 where slug = 'kapping'`);
    });
    const p = await db.query<{ precio: number }>(`select precio from public.servicios where slug = 'kapping'`);
    assert.equal(p.rows[0].precio, 25000);
    await db.exec(`update public.servicios set precio = 20000 where slug = 'kapping'`);
  });

  test("una no-admin no puede editar precios", async () => {
    await como(db, "authenticated", OTRA_ID, () => db.query(`update public.servicios set precio = 1 where slug = 'kapping'`));
    const p = await db.query<{ precio: number }>(`select precio from public.servicios where slug = 'kapping'`);
    assert.equal(p.rows[0].precio, 20000);
  });
});
