import { createFileRoute } from "@tanstack/react-router";
import { HistoryView } from "@/components/corpus/CorpusExtras";

export const Route = createFileRoute("/historial")({
  head: () => ({ meta: [{ title: "Historial — Corpus LSM" }, { name: "description", content: "Revisa búsquedas y consultas recientes del corpus." }, { property: "og:title", content: "Historial — Corpus LSM" }, { property: "og:description", content: "Actividad reciente de consulta del corpus." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: HistoryView,
});