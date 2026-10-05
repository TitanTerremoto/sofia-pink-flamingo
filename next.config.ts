import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
