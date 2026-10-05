"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { clienteConSesion } from "@/lib/supabase/sesion";
import { TAG_CONTENIDO } from "@/lib/supabase/publico";
import { reglasIniciales, sitioInicial } from "@/config/sitio";
import { textosIniciales } from "@/content/textos";
import type { ConfigSitio, ReglasReservas, Textos } from "@/lib/datos/tipos";
import { horaLocalBAaISO, type EstadoReserva } from "./formato";
import { requerirAdmin } from "./sesion";

export type Aviso = { tipo: "ok" | "error"; mensaje: string } | null;

const txt = (f: FormData, k: string, max = 2000) => String(f.get(k) ?? "").trim().slice(0, max);

/** El sitio público muestra el contenido nuevo en el próximo pedido. */
function refrescarSitio() {
  updateTag(TAG_CONTENIDO);
  revalidatePath("/", "layout");
}

// ───────────── Sesión ─────────────

export async function ingresar(_: Aviso, form: FormData): Promise<Aviso> {
  const db = await clienteConSesion();
  const { error } = await db.auth.signInWithPassword({ email: txt(form, "email", 254), password: String(form.get("password") ?? "") });
  if (error) return { tipo: "error", mensaje: "Email o contraseña incorrectos." };
  redirect("/admin");
}

export async function salir() {
  const db = await clienteConSesion();
  await db.auth.signOut();
  redirect("/admin/ingresar");
}

// ───────────── Reservas ─────────────

const ESTADOS_VALIDOS: EstadoReserva[] = ["confirmada", "rechazada", "cancelada"];

export async function cambiarEstado(_: Aviso, form: FormData): Promise<Aviso> {
  const { db } = await requerirAdmin();
  const id = txt(form, "id", 64);
  const estado = txt(form, "estado", 40) as EstadoReserva;
  if (!ESTADOS_VALIDOS.includes(estado)) return { tipo: "error", mensaje: "Acción inválida." };

  const { data: cambio, error } = await db.rpc("cambiar_estado_reserva", {
    p_reserva_id: id,
    p_estado: estado,
    p_motivo: txt(form, "motivo", 500) || null,
  });
  if (error) {
    if (error.message.includes("TRANSICION_INVALIDA"))
      return { tipo: "error", mensaje: "Esa reserva ya no se puede pasar a ese estado." };
    console.error("[admin] cambiar_estado_reserva:", error.message);
    return { tipo: "error", mensaje: "No se pudo actualizar la reserva." };
  }

  // Fase 3: si `cambio` es true y el estado es "confirmada", acá se enviará el email
  // de confirmación y se creará el evento de Google Calendar (ver docs/ROADMAP.md).

  revalidatePath("/admin", "layout");
  const textos = { confirmada: "Reserva confirmada.", rechazada: "Seña rechazada.", cancelada: "Reserva cancelada." };
  return { tipo: "ok", mensaje: cambio ? textos[estado as keyof typeof textos] : "La reserva ya estaba en ese estado." };
}

// ───────────── Servicios y precios ─────────────

export async function guardarServicio(_: Aviso, form: FormData): Promise<Aviso> {
  const { db } = await requerirAdmin();
  const slug = txt(form, "slug", 60);

  const precioTexto = txt(form, "precio", 12).replace(/[.\s$]/g, "");
  const precio = precioTexto === "" ? null : Number(precioTexto);
  if (precio !== null && (!Number.isInteger(precio) || precio < 0 || precio > 100_000_000))
    return { tipo: "error", mensaje: "El precio tiene que ser un número entero (sin puntos ni $), o vacío para mostrar \"$ X\"." };

  const duracionMinutos = Number(txt(form, "duracion_minutos", 4));
  if (!Number.isInteger(duracionMinutos) || duracionMinutos < 15 || duracionMinutos > 480)
    return { tipo: "error", mensaje: "La duración en minutos tiene que estar entre 15 y 480." };

  const nombre = txt(form, "nombre", 120);
  if (nombre.length < 1) return { tipo: "error", mensaje: "El nombre no puede quedar vacío." };

  const detalles = [0, 1, 2, 3]
    .map((i) => ({ titulo: txt(form, `detalle_titulo_${i}`, 80), texto: txt(form, `detalle_texto_${i}`, 1000) }))
    .filter((d) => d.titulo && d.texto);

  const { error } = await db
    .from("servicios")
    .update({
      nombre,
      precio,
      duracion_minutos: duracionMinutos,
      duracion_texto: txt(form, "duracion_texto", 80),
      titulo_descripcion: txt(form, "titulo_descripcion", 40) || "Descripción",
      descripcion: txt(form, "descripcion", 2000),
      incluye: txt(form, "incluye", 2000)
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
      detalles,
      destacado: txt(form, "destacado", 200) || null,
      activo: form.get("activo") === "on",
      orden: Number(txt(form, "orden", 5)) || 0,
    })
    .eq("slug", slug);
  if (error) {
    console.error("[admin] guardarServicio:", error.message);
    return { tipo: "error", mensaje: "No se pudo guardar el servicio." };
  }
  refrescarSitio();
  return { tipo: "ok", mensaje: `“${nombre}” guardado.` };
}

// ───────────── Horarios disponibles y bloqueos ─────────────

export async function agregarFranja(_: Aviso, form: FormData): Promise<Aviso> {
  const { db } = await requerirAdmin();
  const dia = Number(txt(form, "dia_semana", 1));
  const desde = txt(form, "desde", 5);
  const hasta = txt(form, "hasta", 5);
  if (!Number.isInteger(dia) || dia < 0 || dia > 6 || !/^\d{2}:\d{2}$/.test(desde) || !/^\d{2}:\d{2}$/.test(hasta))
    return { tipo: "error", mensaje: "Completá el día y el horario." };
  if (hasta <= desde) return { tipo: "error", mensaje: "La hora de fin tiene que ser posterior a la de inicio." };

  const { error } = await db.from("disponibilidad").insert({ dia_semana: dia, desde, hasta });
  if (error) {
    console.error("[admin] agregarFranja:", error.message);
    return { tipo: "error", mensaje: "No se pudo agregar el horario." };
  }
  revalidatePath("/admin/horarios");
  return { tipo: "ok", mensaje: "Horario agregado." };
}

export async function borrarFranja(form: FormData) {
  const { db } = await requerirAdmin();
  const { error } = await db.from("disponibilidad").delete().eq("id", txt(form, "id", 64));
  if (error) throw new Error(`No se pudo borrar el horario: ${error.message}`);
  revalidatePath("/admin/horarios");
}

export async function agregarBloqueo(_: Aviso, form: FormData): Promise<Aviso> {
  const { db } = await requerirAdmin();
  let inicio: string | null;
  let fin: string | null;

  const diaCompleto = txt(form, "dia", 10);
  if (diaCompleto) {
    inicio = horaLocalBAaISO(`${diaCompleto}T00:00`);
    const hastaDia = txt(form, "dia_hasta", 10) || diaCompleto;
    const finDia = horaLocalBAaISO(`${hastaDia}T00:00`);
    fin = finDia ? new Date(new Date(finDia).getTime() + 24 * 3600 * 1000).toISOString() : null;
  } else {
    inicio = horaLocalBAaISO(txt(form, "inicio", 16));
    fin = horaLocalBAaISO(txt(form, "fin", 16));
  }
  if (!inicio || !fin) return { tipo: "error", mensaje: "Completá las fechas del bloqueo." };
  if (fin <= inicio) return { tipo: "error", mensaje: "El fin del bloqueo tiene que ser posterior al inicio." };

  const { error } = await db.from("bloqueos").insert({ inicio, fin, motivo: txt(form, "motivo", 200) || null });
  if (error) {
    console.error("[admin] agregarBloqueo:", error.message);
    return { tipo: "error", mensaje: "No se pudo guardar el bloqueo." };
  }
  revalidatePath("/admin/horarios");
  return {
    tipo: "ok",
    mensaje: "Bloqueo guardado. Las reservas que ya existían en ese rango no se cancelan solas: revisalas en el calendario.",
  };
}

export async function borrarBloqueo(form: FormData) {
  const { db } = await requerirAdmin();
  const { error } = await db.from("bloqueos").delete().eq("id", txt(form, "id", 64));
  if (error) throw new Error(`No se pudo borrar el bloqueo: ${error.message}`);
  revalidatePath("/admin/horarios");
}

// ───────────── Configuración ─────────────

async function guardarClave(clave: "sitio" | "textos" | "reservas", valor: unknown): Promise<Aviso> {
  const { db } = await requerirAdmin();
  const { error } = await db.from("configuracion").upsert({ clave, valor });
  if (error) {
    console.error(`[admin] guardar configuración ${clave}:`, error.message);
    return { tipo: "error", mensaje: "No se pudo guardar." };
  }
  refrescarSitio();
  return { tipo: "ok", mensaje: "Cambios guardados." };
}

export async function guardarSitio(_: Aviso, form: FormData): Promise<Aviso> {
  await requerirAdmin();
  const horarios = txt(form, "horarios", 1000)
    .split("\n")
    .map((linea) => linea.split("|").map((p) => p.trim()))
    .filter(([dias, horas]) => dias && horas)
    .map(([dias, horas]) => ({ dias, horas }));

  const valor: ConfigSitio = {
    frase: txt(form, "frase", 200),
    ubicacion: {
      direccion: txt(form, "direccion", 200),
      barrio: txt(form, "barrio", 80) || sitioInicial.ubicacion.barrio,
      ciudad: txt(form, "ciudad", 80) || sitioInicial.ubicacion.ciudad,
      indicaciones: txt(form, "indicaciones", 1000),
    },
    contacto: {
      whatsapp: txt(form, "whatsapp", 20).replace(/\D/g, "") || sitioInicial.contacto.whatsapp,
      whatsappVisible: txt(form, "whatsappVisible", 40),
      email: txt(form, "email", 254),
      instagram: txt(form, "instagram", 60).replace(/^@/, ""),
    },
    horarios,
    banco: {
      alias: txt(form, "alias", 60),
      cbu: txt(form, "cbu", 40),
      titular: txt(form, "titular", 120),
      cuit: txt(form, "cuit", 20),
    },
    condicionesCancelacion: txt(form, "condicionesCancelacion", 1500),
    avisoAstrologia: txt(form, "avisoAstrologia", 500),
    google: { linkResenas: txt(form, "linkResenas", 500), linkEscribirResena: txt(form, "linkEscribirResena", 500) },
  };
  if (valor.contacto.email && !valor.contacto.email.startsWith("[") && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(valor.contacto.email))
    return { tipo: "error", mensaje: "Revisá el email de contacto." };
  for (const link of [valor.google.linkResenas, valor.google.linkEscribirResena]) {
    if (link && !link.startsWith("[") && !/^https:\/\//.test(link))
      return { tipo: "error", mensaje: "Los links de Google tienen que empezar con https://" };
  }
  return guardarClave("sitio", valor);
}

export async function guardarReglas(_: Aviso, form: FormData): Promise<Aviso> {
  const entero = (k: keyof ReglasReservas, min: number, max: number) => {
    const n = Number(txt(form, k, 6));
    return Number.isInteger(n) && n >= min && n <= max ? n : null;
  };
  const valor = {
    senaPorcentaje: entero("senaPorcentaje", 0, 100),
    intervaloMinutos: entero("intervaloMinutos", 5, 240),
    anticipacionMinimaHoras: entero("anticipacionMinimaHoras", 0, 720),
    horizonteDias: entero("horizonteDias", 1, 365),
    maxReservasPorHora: entero("maxReservasPorHora", 1, 50),
  };
  if (Object.values(valor).some((v) => v === null)) return { tipo: "error", mensaje: "Revisá los números: alguno está fuera de rango." };
  return guardarClave("reservas", { ...reglasIniciales, ...valor });
}

export async function guardarTextos(_: Aviso, form: FormData): Promise<Aviso> {
  const valor: Textos = {
    ...textosIniciales,
    sobreMi: {
      titulo: txt(form, "sobreMi_titulo", 60) || textosIniciales.sobreMi.titulo,
      saludo: txt(form, "sobreMi_saludo", 120),
      parrafos: txt(form, "sobreMi_parrafos", 6000)
        .split(/\n\s*\n/)
        .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
        .filter(Boolean),
      firma: txt(form, "sobreMi_firma", 40),
    },
    servicios: { titulo: textosIniciales.servicios.titulo, bajada: txt(form, "servicios_bajada", 200) },
    categorias: {
      manicuria: { titulo: textosIniciales.categorias.manicuria.titulo, bajada: txt(form, "bajada_manicuria", 200) },
      rostro: { titulo: textosIniciales.categorias.rostro.titulo, bajada: txt(form, "bajada_rostro", 200) },
      astrologia: { titulo: textosIniciales.categorias.astrologia.titulo, bajada: txt(form, "bajada_astrologia", 200) },
    },
    contacto: { titulo: textosIniciales.contacto.titulo, bajada: txt(form, "contacto_bajada", 300) },
    resenas: { titulo: textosIniciales.resenas.titulo, bajada: txt(form, "resenas_bajada", 200) },
  };
  return guardarClave("textos", valor);
}
