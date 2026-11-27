// Cliente de la API de LSM_DB (FastAPI + PostgreSQL).
// La API vive en el repositorio LSM_DB (carpeta api/). Por defecto corre en
// http://localhost:8000; se puede cambiar con VITE_LSM_API_URL en un archivo .env.

export const API_URL: string =
  (import.meta.env["VITE_LSM_API_URL"] as string | undefined)?.replace(/\/$/, "") ??
  "http://localhost:8000";

export type Presencia = {
  cm_dominante?: string[];
  cm_base?: string[];
  ubicacion_dominante?: string[];
  ubicacion_base?: string[];
};
export type Metadatos = {
  presencia: Presencia;
  linea_temporal: { orden: number; cm_dominante?: string; cm_base?: string }[];
} | null;

export type SenaResumen = {
  id_sena: number;
  codigo: string;
  significado: string;
  tipo: string;
  glosa: string;
  imagen: string | null;
  metadatos: Metadatos;
};

export type SenaFicha = SenaResumen & {
  palabras: string[];
  definiciones: { definicion: string; autor: string | null; lengua: string }[];
  diccionarios: { diccionario: string; datos_fonologicos: Record<string, string | number> }[];
};

export type Opciones = { manos: [string, number][]; zonas: [string, number][] };

export type CampoMetadatos =
  "tipo" | "cm_dominante" | "cm_base" | "ubicacion_dominante" | "ubicacion_base";
export type OpcionesMetadatos = Record<CampoMetadatos, [string, number][]>;

async function pedir<T>(ruta: string): Promise<T> {
  const r = await fetch(API_URL + ruta);
  if (!r.ok) throw new Error(`La API respondió ${r.status}`);
  return r.json() as Promise<T>;
}

export const api = {
  estadisticas: () => pedir<Record<string, number>>("/api/estadisticas"),
  opciones: () => pedir<Opciones>("/api/visual/opciones"),
  filtrar: (mano: string, zona: string, dosManos: "" | "true" | "false") => {
    const p = new URLSearchParams({ mano, zona });
    if (dosManos) p.set("dos_manos", dosManos);
    return pedir<SenaResumen[]>("/api/visual/filtrar?" + p.toString());
  },
  sena: (id: number) => pedir<SenaFicha>(`/api/senas/${id}`),
  metadatosOpciones: () => pedir<OpcionesMetadatos>("/api/metadatos/opciones"),
  buscarMetadatos: (criterios: Partial<Record<CampoMetadatos, string>>) => {
    const p = new URLSearchParams(
      Object.entries(criterios).filter(([, v]) => v) as [string, string][],
    );
    return pedir<SenaResumen[]>("/api/metadatos/buscar?" + p.toString());
  },
};

// Fotos de las configuraciones manuales del DLSM (public/manos, 221 archivos).
let indiceFotos: Promise<Record<string, string>> | null = null;
export function cargarFotos() {
  indiceFotos ??= fetch("/manos/indice.json")
    .then((r) => r.json())
    .catch(() => ({}));
  return indiceFotos;
}
/** Foto representativa de una familia (B-P → B-P.1) o de una variante exacta (O.5). */
export function fotoDe(fotos: Record<string, string>, codigo: string): string | null {
  if (fotos[codigo]) return "/manos/" + fotos[codigo];
  const k = fotos[codigo + ".1"]
    ? codigo + ".1"
    : Object.keys(fotos).find((c) => c.startsWith(codigo + "."));
  return k ? "/manos/" + fotos[k] : null;
}
/** Códigos exactos de configuración (B-P.12, 5.4…) que menciona el texto del diccionario. */
export function configuracionesExactas(texto: string, fotos: Record<string, string>): string[] {
  const vistos = new Set<string>();
  for (const m of texto.matchAll(/(?<![\w.])([0-9A-Z]+(?:-[A-Z0-9]+)?)\.\s?(\d+)/g)) {
    const c = `${m[1]}.${m[2]}`;
    if (fotos[c]) vistos.add(c);
  }
  return [...vistos];
}
