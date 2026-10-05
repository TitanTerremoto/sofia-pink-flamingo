import "server-only";

/**
 * Verificación anti-bots de Cloudflare Turnstile.
 * Sin TURNSTILE_SECRET_KEY configurada se omite (útil en desarrollo), con un aviso en el log.
 * En producción conviene configurarla: ver docs/INTEGRACIONES.md.
 */
export async function verificarTurnstile(token: string, ip?: string): Promise<boolean> {
  const secreto = process.env.TURNSTILE_SECRET_KEY;
  if (!secreto) {
    console.warn("[turnstile] TURNSTILE_SECRET_KEY no configurada: se omite la verificación anti-bots.");
    return true;
  }
  if (!token) return false;

  const cuerpo = new URLSearchParams({ secret: secreto, response: token });
  if (ip) cuerpo.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: cuerpo,
      cache: "no-store",
    });
    const datos = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!datos.success) console.warn("[turnstile] Verificación rechazada:", datos["error-codes"]);
    return datos.success === true;
  } catch (error) {
    console.error("[turnstile] No se pudo contactar a Cloudflare:", error);
    return false;
  }
}
