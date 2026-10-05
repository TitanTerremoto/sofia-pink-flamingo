import { ImageResponse } from "next/og";
import { marca, sitioInicial } from "@/config/sitio";

// Se genera una vez en el build (necesario también para la vista previa estática).
export const dynamic = "force-static";

export const alt = `${marca} · Manicuría, Rostro y Astrología`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagen que aparece al compartir el link por WhatsApp, Instagram, etc. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #fff8fa 0%, #fadbe5 55%, #ede5fa 100%)",
          color: "#4b2e3b",
        }}
      >
        <div style={{ fontSize: 92, marginTop: 10, color: "#c0567c" }}>Sofía</div>
        <div style={{ fontSize: 34, letterSpacing: 16, marginTop: 6 }}>PINK FLAMINGO</div>
        <div style={{ fontSize: 28, letterSpacing: 6, marginTop: 40, color: "#7a5867" }}>
          MANICURÍA · ROSTRO · ASTROLOGÍA
        </div>
        <div style={{ fontSize: 24, marginTop: 14, color: "#7a5867" }}>
          {`${sitioInicial.ubicacion.barrio}, ${sitioInicial.ubicacion.ciudad}`}
        </div>
      </div>
    ),
    size,
  );
}
