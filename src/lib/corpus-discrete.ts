import raw from "@/data/corpus-discrete.json";

/** Capa analítica: valores discretizados por glosa (solo para búsqueda fonológica y relaciones). */
export const DISCRETE_FIELDS = [
  { key: "tipo", label: "Tipo de seña" },
  { key: "configuracion", label: "Configuración manual" },
  { key: "orientacion", label: "Orientación" },
  { key: "ubicacion", label: "Ubicación" },
  { key: "movimiento", label: "Movimiento" },
] as const;
export type DiscreteKey = (typeof DISCRETE_FIELDS)[number]["key"];
export type DiscreteFeatures = Partial<Record<DiscreteKey, string[]>>;

const data = raw as Record<string, DiscreteFeatures>;
export const getDiscrete = (id: string): DiscreteFeatures => data[id] ?? {};

export const discreteOptions = Object.fromEntries(
  DISCRETE_FIELDS.map(({ key }) => {
    const counts = new Map<string, number>();
    Object.values(data).forEach((f) => f[key]?.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1)));
    return [key, [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([value, count]) => ({ value, count }))];
  }),
) as Record<DiscreteKey, { value: string; count: number }[]>;

/** Mismo campo: cualquiera de los valores elegidos (OR). Entre campos: todos (AND). */
export function matchesDiscrete(id: string, criteria: Partial<Record<DiscreteKey, string[]>>) {
  const f = getDiscrete(id);
  return Object.entries(criteria).every(([k, vals]) => !vals?.length || vals.some((v) => f[k as DiscreteKey]?.includes(v)));
}

/** Valores discretos compartidos entre dos glosas, por campo. */
export function sharedDiscrete(a: string, b: string) {
  const fa = getDiscrete(a), fb = getDiscrete(b);
  return DISCRETE_FIELDS.flatMap(({ key, label }) => (fa[key] ?? []).filter((v) => fb[key]?.includes(v)).map((v) => ({ key, label, value: v })));
}
