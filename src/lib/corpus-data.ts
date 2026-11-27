import raw from "@/data/corpus.json";

/** Fila del dataset del corpus. `configuracion` replica una columna JSONB: las claves ausentes no se registraron. */
type RawGloss = { id: string; codigo: string; titulo: string; pagina: number; definicion: string | null; configuracion: Record<string, string>; notaCultural?: string };

export type Gloss = { id: string; code: string; words: [string, ...string[]]; description: string; features: Record<string, string>; page: number; culturalNote?: string | undefined };

export const glosses: Gloss[] = (raw as RawGloss[]).map((r) => ({
  id: r.id, code: r.codigo, words: [r.titulo], description: r.definicion ?? "", features: r.configuracion, page: r.pagina, culturalNote: r.notaCultural,
}));

export const FEATURE_KEYS = ["Tipo de seña", "Configuración", "Orientación", "Ubicación", "Movimiento", "Rasgos no manuales", "Representación"] as const;

export const getGloss = (id: string) => glosses.find((g) => g.id === id);

const norm = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
export { norm as normalizeText };

export function searchGlosses(query: string) {
  const term = norm(query.trim());
  if (!term) return glosses;
  return glosses.filter((g) => norm(`${g.code} ${g.words.join(" ")} ${g.description}`).includes(term) || Object.values(g.features).some((v) => norm(v).includes(term)));
}

/** Códigos de configuración manual detectados en el texto (p. ej. "B-P.2", "1.1"). */
export const handshapeCodes = (g: Gloss) => [...new Set((g.features["Configuración"] ?? "").match(/\b[A-Z0-9](?:-[A-Z])?\.\d+\b|\b\d\.\d+\b/g) ?? [])];

export const signTypes = [...new Set(glosses.map((g) => g.features["Tipo de seña"]).filter((t): t is string => Boolean(t)))].sort();
