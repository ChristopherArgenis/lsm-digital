import { createFileRoute } from "@tanstack/react-router";
import { HomeView } from "@/components/corpus/CorpusViews";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Corpus LSM — Lengua de Señas Mexicana" },
    { name: "description", content: "Explora palabras, glosas, características fonológicas del corpus." },
    { property: "og:title", content: "Corpus LSM — Lengua de Señas Mexicana" },
    { property: "og:description", content: "Plataforma académica de consulta y exploración lingüística." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: HomeView,
});
