"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { reservasOnline } from "@/lib/datos/contenido";
import { clienteServidor } from "@/lib/supabase/servidor";
import { verificarTurnstile } from "./turnstile";
import {
  TAMANO_MAXIMO_COMPROBANTE,
  detectarTipoComprobante,
  validarDatos,
  validarFecha,
  type DatosReserva,
  type ErrorValidacion,
} from "./validacion";

/** Horarios libres (ISO) de un servicio para una fecha YYYY-MM-DD. Siempre consulta la base en el momento. */
export async function consultarHorarios(servicio: string, fecha: string): Promise<string[]> {
  if (!reservasOnline() || !/^[a-z0-9-]{1,60}$/.test(servicio) || !validarFecha(fecha)) return [];
  const db = clienteServidor();
  const { data: s, error: e1 } = await db.from("servicios").select("id").eq("slug", servicio).eq("activo", true).maybeSingle();
  if (e1) throw new Error(`No se pudo leer el servicio: ${e1.message}`);
  if (!s) return [];
  const { data, error } = await db.rpc("horarios_disponibles", { p_servicio_id: s.id, p_fecha: fecha });
  if (error) throw new Error(`No se pudieron consultar los horarios: ${error.message}`);
  return (data as string[]).map((h) => new Date(h).toISOString());
}

export type ResultadoReserva =
  | { estado: "inicial" }
  | { estado: "ok"; reservaId: string }
  | { estado: "error"; mensaje: string; campo?: ErrorValidacion["campo"]; volverAlHorario?: boolean };

const texto = (f: FormData, k: string) => String(f.get(k) ?? "");

/**
 * Registra una reserva. La reserva queda SIEMPRE "pendiente de verificación":
 * subir un comprobante no confirma nada; sólo Sofi confirma desde el panel.
 */
export async function enviarReserva(_previo: ResultadoReserva, form: FormData): Promise<ResultadoReserva> {
  if (!reservasOnline()) {
    return { estado: "error", mensaje: "Las reservas online todavía no están habilitadas. Escribinos por WhatsApp." };
  }

  // Anti-spam 1: campo trampa invisible que sólo completan los bots.
  if (texto(form, "sitio_web") !== "") return { estado: "error", mensaje: "No pudimos registrar tu reserva." };

  // Anti-spam 2: Cloudflare Turnstile (si está configurado).
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!(await verificarTurnstile(texto(form, "cf-turnstile-response"), ip))) {
    return { estado: "error", mensaje: "No pudimos verificar que no seas un robot. Recargá la página e intentá de nuevo." };
  }

  const datos: DatosReserva = {
    servicio: texto(form, "servicio"),
    inicio: texto(form, "inicio"),
    nombre: texto(form, "nombre"),
    email: texto(form, "email"),
    telefono: texto(form, "telefono"),
    comentarios: texto(form, "comentarios"),
  };
  const invalido = validarDatos(datos);
  if (invalido) return { estado: "error", ...invalido };

  const archivo = form.get("comprobante");
  if (!(archivo instanceof File) || archivo.size === 0) {
    return { estado: "error", campo: "comprobante", mensaje: "Subí el comprobante de la seña." };
  }
  if (archivo.size > TAMANO_MAXIMO_COMPROBANTE) {
    return { estado: "error", campo: "comprobante", mensaje: "El archivo supera los 4 MB. Probá con una captura de pantalla." };
  }
  const bytes = new Uint8Array(await archivo.arrayBuffer());
  const tipo = detectarTipoComprobante(bytes);
  if (!tipo) {
    return { estado: "error", campo: "comprobante", mensaje: "El comprobante tiene que ser JPG, PNG o PDF." };
  }

  const db = clienteServidor();
  const ahora = new Date();
  const ruta = `${ahora.getUTCFullYear()}/${String(ahora.getUTCMonth() + 1).padStart(2, "0")}/${randomUUID()}.${tipo.extension}`;

  const subida = await db.storage.from("comprobantes").upload(ruta, bytes, { contentType: tipo.mime, upsert: false });
  if (subida.error) {
    console.error("[reservas] Falló la subida del comprobante:", subida.error.message);
    return { estado: "error", mensaje: "No pudimos subir el comprobante. Probá de nuevo en unos minutos." };
  }

  const { data, error } = await db.rpc("crear_reserva", {
    p_servicio_slug: datos.servicio,
    p_inicio: datos.inicio,
    p_nombre: datos.nombre,
    p_email: datos.email,
    p_telefono: datos.telefono,
    p_comentarios: datos.comentarios,
    p_comprobante_path: ruta,
  });

  if (error) {
    // La reserva no se creó: el comprobante no debe quedar huérfano.
    const borrado = await db.storage.from("comprobantes").remove([ruta]);
    if (borrado.error) console.error("[reservas] No se pudo borrar el comprobante huérfano", ruta, borrado.error.message);
    return traducirError(error.message, error.code);
  }

  return { estado: "ok", reservaId: data as string };
}

function traducirError(mensaje: string, codigo?: string): ResultadoReserva {
  if (codigo === "23P01" || mensaje.includes("HORARIO_NO_DISPONIBLE")) {
    return {
      estado: "error",
      volverAlHorario: true,
      mensaje: "Ese horario se acaba de ocupar o ya no está disponible. Elegí otro, por favor.",
    };
  }
  if (mensaje.includes("DEMASIADAS_RESERVAS")) {
    return {
      estado: "error",
      mensaje: "Ya recibimos varias reservas con este email en la última hora. Si necesitás algo más, escribinos por WhatsApp.",
    };
  }
  if (mensaje.includes("SERVICIO_INVALIDO")) {
    return { estado: "error", campo: "servicio", mensaje: "Ese servicio no está disponible para reservar." };
  }
  if (mensaje.includes("DATOS_INVALIDOS")) {
    return { estado: "error", mensaje: "Revisá los datos ingresados e intentá de nuevo." };
  }
  console.error("[reservas] Error inesperado al crear la reserva:", codigo, mensaje);
  return { estado: "error", mensaje: "No pudimos registrar tu reserva. Probá de nuevo o escribinos por WhatsApp." };
}
