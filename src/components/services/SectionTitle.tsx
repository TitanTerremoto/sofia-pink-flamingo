import { IconoDestello } from "@/components/brand/Iconos";

export function SectionTitle({
  children,
  bajada,
  id,
  tono = "rosa",
}: {
  children: React.ReactNode;
  bajada?: string;
  id?: string;
  tono?: "rosa" | "lavanda";
}) {
  const acento = tono === "lavanda" ? "text-lavender-500" : "text-blush-400";
  return (
    <div className="mx-auto mb-8 max-w-xl text-center sm:mb-14">
      <h2 id={id} className="title-caps flex items-center justify-center gap-4 text-2xl text-ink sm:text-3xl">
        <IconoDestello className={`h-3 w-3 ${acento}`} />
        {children}
        <IconoDestello className={`h-3 w-3 ${acento}`} />
      </h2>
      {bajada && <p className="mt-4 font-display text-lg italic text-ink-soft sm:text-xl">{bajada}</p>}
    </div>
  );
}
