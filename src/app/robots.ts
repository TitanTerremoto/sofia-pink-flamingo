import type { MetadataRoute } from "next";
import { urlSitio } from "@/config/sitio";

// Se genera una vez en el build (necesario también para la vista previa estática).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // La vista previa de GitHub Pages no debe indexarse (tiene datos de ejemplo).
  if (process.env.GITHUB_PAGES === "true") return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${urlSitio}/sitemap.xml`,
  };
}
