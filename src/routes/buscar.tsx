import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SearchView } from "@/components/corpus/CorpusViews";
export const Route = createFileRoute("/buscar")({
  validateSearch: z.object({ q: z.string().catch("") }),
  head: () => ({ meta: [{ title: "Buscar — Corpus LSM" }, { name: "description", content: "Busca palabras, glosas y características en el corpus." }, { property: "og:title", content: "Buscar — Corpus LSM" }, { property: "og:description", content: "Consulta relaciones entre palabras, glosas y rasgos." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <SearchView query={Route.useSearch().q}/>,
});
