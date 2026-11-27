import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Hand,
  HandHelping,
  MapPin,
  MapPinned,
  RotateCcw,
  Search,
  ServerCrash,
  Shapes,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PhonologicalSelect } from "@/components/corpus/PhonologicalSelect";
import { Button } from "@/components/ui/button";
import {
  API_URL,
  api,
  cargarFotos,
  fotoDe,
  type CampoMetadatos,
  type OpcionesMetadatos,
  type SenaResumen,
} from "@/lib/lsm-api";

// Búsqueda fonológica con los valores de lista cerrada de METADATOS (vía la API de LSM_DB).

const CAMPOS: { key: CampoMetadatos; label: string; icon: typeof Hand }[] = [
  { key: "tipo", label: "Tipo de seña", icon: Shapes },
  { key: "cm_dominante", label: "Forma de la mano principal", icon: Hand },
  { key: "ubicacion_dominante", label: "Lugar de la mano principal", icon: MapPin },
  { key: "cm_base", label: "Forma de la mano de apoyo", icon: HandHelping },
  { key: "ubicacion_base", label: "Lugar de la mano de apoyo", icon: MapPinned },
];
const PAGINA = 24;

export function BusquedaMetadatosView() {
  const [opciones, setOpciones] = useState<OpcionesMetadatos | null>(null);
  const [fotos, setFotos] = useState<Record<string, string>>({});
  const [criterios, setCriterios] = useState<Partial<Record<CampoMetadatos, string>>>({});
  const [resultados, setResultados] = useState<SenaResumen[] | null>(null);
  const [mostrar, setMostrar] = useState(PAGINA);
  const [cargando, setCargando] = useState(false);
  const [sinApi, setSinApi] = useState(false);

  useEffect(() => {
    cargarFotos().then(setFotos);
    api
      .metadatosOpciones()
      .then(setOpciones)
      .catch(() => setSinApi(true));
  }, []);

  const activos = CAMPOS.filter((c) => criterios[c.key]);
  const buscar = () => {
    if (!activos.length) return;
    setCargando(true);
    api
      .buscarMetadatos(criterios)
      .then((r) => {
        setResultados(r);
        setMostrar(PAGINA);
        setSinApi(false);
      })
      .catch(() => setSinApi(true))
      .finally(() => setCargando(false));
  };
  const limpiar = () => {
    setCriterios({});
    setResultados(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
      <div className="flex gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          Búsqueda avanzada
        </p>
        <span className="entity-tag">METADATOS</span>
      </div>
      <h1 className="mt-2 font-display text-3xl font-semibold">Búsqueda fonológica</h1>
      <p className="mt-2 text-muted-foreground">
        Elige un valor por rasgo. Se muestran las señas que cumplen todos. Los valores salen de
        METADATOS: la forma de la mano y el lugar del cuerpo, en listas cerradas.
      </p>

      {sinApi && (
        <div className="mt-5 flex gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <ServerCrash className="shrink-0 text-destructive" size={20} />
          <p>
            No hay conexión con la API en <code className="rounded bg-muted px-1">{API_URL}</code>.
            Enciende PostgreSQL y arranca el Backend; luego recarga esta página.
          </p>
        </div>
      )}

      <form
        aria-label="Filtros fonológicos"
        onSubmit={(e) => {
          e.preventDefault();
          buscar();
        }}
        className="mt-6 border-y border-border bg-card"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal size={16} className="text-primary" aria-hidden="true" />
            Rasgos (METADATOS)
          </h2>
          <span className="text-xs tabular-nums text-muted-foreground">
            {activos.length} de 5 seleccionados
          </span>
        </div>
        <div className="grid grid-cols-1 gap-x-3 gap-y-2 px-4 pb-5 pt-2 min-[420px]:grid-cols-2 sm:px-5 lg:grid-cols-5">
          {CAMPOS.map(({ key, label, icon }) => (
            <PhonologicalSelect
              key={key}
              id={`meta-${key}`}
              label={label}
              icon={icon}
              value={criterios[key] ?? ""}
              options={(opciones?.[key] ?? []).map(([value, count]) => ({ value, count }))}
              onChange={(value) => setCriterios((c) => ({ ...c, [key]: value }))}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/40 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            {activos.length === 0 ? (
              <span className="text-xs text-muted-foreground">Todos los rasgos</span>
            ) : (
              activos.map(({ key, label }) => (
                <Button
                  key={key}
                  type="button"
                  size="sm"
                  variant="secondary"
                  aria-label={`Quitar ${label}: ${criterios[key]}`}
                  onClick={() => setCriterios((c) => ({ ...c, [key]: "" }))}
                  className="h-auto max-w-full gap-2 bg-primary-soft px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/15"
                >
                  <span className="min-w-0 whitespace-normal text-left">
                    {label}: {criterios[key]}
                  </span>
                  <X size={13} className="shrink-0" aria-hidden="true" />
                </Button>
              ))
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              disabled={!activos.length && !resultados}
              onClick={limpiar}
              className="gap-2 text-muted-foreground"
            >
              <RotateCcw size={15} />
              Limpiar
            </Button>
            <Button type="submit" disabled={!activos.length || cargando} className="h-10 gap-2">
              <Search size={16} />
              {cargando ? "Buscando…" : "Buscar"}
            </Button>
          </div>
        </div>
      </form>

      <section className="mt-6">
        {!resultados ? (
          <div className="grid min-h-48 place-items-center rounded-lg border border-dashed border-border bg-card text-center text-sm text-muted-foreground">
            Selecciona uno o varios valores y ejecuta la búsqueda.
          </div>
        ) : (
          <>
            <div className="flex justify-between">
              <h2 className="font-display text-xl font-semibold">Resultados</h2>
              <span className="text-sm text-muted-foreground">
                {resultados.length.toLocaleString("es-MX")} coincidencias
              </span>
            </div>
            {resultados.length === 0 ? (
              <div className="mt-4 rounded-lg border border-dashed border-border bg-card p-8 text-center">
                No hay coincidencias con esta combinación.
              </div>
            ) : (
              <>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {resultados.slice(0, mostrar).map((s) => (
                    <TarjetaSena key={s.id_sena} sena={s} fotos={fotos} />
                  ))}
                </div>
                {mostrar < resultados.length && (
                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() => setMostrar(mostrar + PAGINA)}
                  >
                    Mostrar más
                  </Button>
                )}
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export function TarjetaSena({ sena, fotos }: { sena: SenaResumen; fotos: Record<string, string> }) {
  const p = sena.metadatos?.presencia;
  const manos = [
    ...(p?.cm_dominante ?? []).slice(0, 2).map((c) => [c, "dom"] as const),
    ...(p?.cm_base ?? []).slice(0, 1).map((c) => [c, "base"] as const),
  ];
  const lugares = [...new Set([...(p?.ubicacion_dominante ?? []), ...(p?.ubicacion_base ?? [])])];
  return (
    <Link
      to="/glosas/$glossId"
      params={{ glossId: sena.codigo.replace(/\s+/g, "-") }}
      className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition hover:border-primary/40"
    >
      <span className="flex shrink-0 gap-1">
        {manos.map(([c, t]) => {
          const src = fotoDe(fotos, c);
          return (
            <span
              key={t + c}
              title={(t === "dom" ? "Mano principal: " : "Mano de apoyo: ") + c}
              className={
                "grid size-12 place-items-center rounded-md bg-background ring-2 " +
                (t === "dom" ? "ring-accent" : "ring-primary")
              }
            >
              {src ? (
                <img src={src} alt={c} className="h-10 w-10 object-contain" />
              ) : (
                <b className="text-xs">{c}</b>
              )}
            </span>
          );
        })}
      </span>
      <span className="min-w-0 flex-1">
        <strong className="block truncate font-display">{sena.glosa}</strong>
        <span className="block truncate text-xs text-muted-foreground">
          {sena.codigo} · {sena.tipo} · {lugares.join(", ")}
        </span>
      </span>
      <ArrowRight
        size={16}
        className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
      />
    </Link>
  );
}
