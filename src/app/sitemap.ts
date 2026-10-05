import type { MetadataRoute } from "next";
import { sitio } from "@/config/sitio";

export default function sitemap(): MetadataRoute.Sitemap {
  const paginas = [
    { ruta: "", prioridad: 1 },
    { ruta: "/manicuria", prioridad: 0.9 },
    { ruta: "/rostro", prioridad: 0.9 },
    { ruta: "/astrologia", prioridad: 0.9 },
    { ruta: "/contacto", prioridad: 0.7 },
  ];
  return paginas.map(({ ruta, prioridad }) => ({
    url: `${sitio.url}${ruta}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: prioridad,
  }));
}
