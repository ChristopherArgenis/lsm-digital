import { createFileRoute } from "@tanstack/react-router";
import { BusquedaMetadatosView } from "@/components/corpus/BusquedaMetadatos";
export const Route = createFileRoute("/busqueda-fonologica")({
  head: () => ({
    meta: [
      { title: "Búsqueda fonológica — Corpus LSM" },
      { name: "description", content: "Combina características fonológicas para buscar glosas." },
      { property: "og:title", content: "Búsqueda fonológica — Corpus LSM" },
      {
        property: "og:description",
        content: "Consulta experimental por características lingüísticas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BusquedaMetadatosView,
});
