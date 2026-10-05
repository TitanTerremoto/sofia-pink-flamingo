import type { NextConfig } from "next";

/**
 * GITHUB_PAGES=true → versión de vista previa estática para GitHub Pages
 * (sólo el sitio público: sin /admin ni reservas online, que necesitan servidor).
 * Ver .github/workflows/pages.yml y scripts/preparar-pages.mjs.
 */
const githubPages = process.env.GITHUB_PAGES === "true";
const basePath = githubPages ? "/sofia-pink-flamingo" : "";

const nextConfig: NextConfig = githubPages
  ? {
      output: "export",
      basePath,
      trailingSlash: true,
      env: { NEXT_PUBLIC_BASE_PATH: basePath },
      images: { loader: "custom", loaderFile: "./src/lib/cargadorImagenesPages.ts" },
    }
  : {
      experimental: {
        // Comprobantes de hasta 4 MB + margen del formulario (Vercel corta en 4,5 MB).
        serverActions: { bodySizeLimit: "4.4mb" },
      },
      images: {
        qualities: [75, 85],
        formats: ["image/avif", "image/webp"],
      },
      async headers() {
        return [
          {
            source: "/:path*",
            headers: [
              { key: "X-Content-Type-Options", value: "nosniff" },
              { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
              { key: "X-Frame-Options", value: "SAMEORIGIN" },
              { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
            ],
          },
        ];
      },
    };

export default nextConfig;
