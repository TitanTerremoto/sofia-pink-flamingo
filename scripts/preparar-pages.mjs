/**
 * Prepara una copia del proyecto para la vista previa estática de GitHub Pages:
 * quita las rutas que necesitan servidor (panel, reservas online, proxy).
 *
 * BORRA ARCHIVOS: sólo corre dentro de GitHub Actions (copia descartable del repo)
 * o con --forzar en una copia hecha a propósito. Nunca en tu carpeta de trabajo.
 */
import { rmSync } from "node:fs";

if (process.env.GITHUB_ACTIONS !== "true" && !process.argv.includes("--forzar")) {
  console.error("preparar-pages: sólo se ejecuta en GitHub Actions (o con --forzar en una copia descartable).");
  process.exit(1);
}

for (const ruta of ["src/app/admin", "src/app/(sitio)/reservar", "src/proxy.ts"]) {
  rmSync(ruta, { recursive: true, force: true });
  console.log(`preparar-pages: quitado ${ruta}`);
}
