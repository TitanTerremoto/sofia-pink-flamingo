import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost, Pinyon_Script } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { sitio } from "@/config/sitio";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});
const jost = Jost({ variable: "--font-jost", subsets: ["latin"], weight: ["300", "400", "500"] });
const pinyon = Pinyon_Script({ variable: "--font-pinyon", subsets: ["latin"], weight: "400" });

const descripcion =
  "Manicuría (semipermanente, kapping, esculpidas), lifting de pestañas, laminado y diseño de cejas, y astrología (carta natal, revolución solar, tarot astrológico) en Parque Chas, CABA.";

export const metadata: Metadata = {
  metadataBase: new URL(sitio.url),
  title: {
    default: `${sitio.marca} · Manicuría, Rostro y Astrología en Parque Chas, CABA`,
    template: `%s · ${sitio.marca}`,
  },
  description: descripcion,
  keywords: [
    "manicuría",
    "uñas",
    "kapping",
    "esculpidas",
    "semipermanente",
    "lifting de pestañas",
    "laminado de cejas",
    "diseño de cejas",
    "astrología",
    "carta natal",
    "revolución solar",
    "tarot astrológico",
    "Parque Chas",
    "CABA",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: sitio.marca,
    title: sitio.marca,
    description: descripcion,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#fdeff3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className={`${cormorant.variable} ${jost.variable} ${pinyon.variable} antialiased`}>
      <body className="min-h-dvh">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
        >
          Saltar al contenido
        </a>
        <Sidebar />
        <div className="relative isolate flex min-h-dvh flex-col pt-16 lg:pl-64 lg:pt-0">
          <main id="contenido" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </body>
    </html>
  );
}
