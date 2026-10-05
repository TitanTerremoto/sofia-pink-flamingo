import "server-only";
import { clienteServidor } from "@/lib/supabase/servidor";

/** Días de la semana (0 = domingo) que tienen alguna franja de disponibilidad. */
export async function diasConDisponibilidad(): Promise<number[]> {
  const { data, error } = await clienteServidor().from("disponibilidad").select("dia_semana");
  if (error) throw new Error(`No se pudo leer la disponibilidad: ${error.message}`);
  return [...new Set((data as { dia_semana: number }[]).map((d) => d.dia_semana))];
}
