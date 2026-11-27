import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Hand, RotateCcw, ServerCrash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Avatar3D, NOMBRES_ZONAS, type Marca } from "@/components/corpus/Avatar3D";
import { Button } from "@/components/ui/button";
import {
  API_URL,
  api,
  cargarFotos,
  configuracionesExactas,
  fotoDe,
  type Opciones,
  type SenaFicha,
  type SenaResumen,
} from "@/lib/lsm-api";

export const Route = createFileRoute("/avatar")({
  head: () => ({
    meta: [
      { title: "Avatar — Corpus LSM" },
      {
        name: "description",
        content: "Busca señas tocando el cuerpo de un avatar 3D y eligiendo la forma de la mano.",
      },
      { property: "og:title", content: "Avatar — Corpus LSM" },
      { property: "og:description", content: "Búsqueda visual de señas con un avatar 3D." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AvatarView,
});

type Manos = "" | "true" | "false";

function marcasDe(
  s: { metadatos: SenaResumen["metadatos"] } | null,
): Record<string, Marca> | undefined {
  if (!s?.metadatos) return undefined;
  const m: Record<string, Marca> = {};
  for (const z of s.metadatos.presencia.ubicacion_dominante ?? []) m[z] = "dom";
  for (const z of s.metadatos.presencia.ubicacion_base ?? [])
    m[z] = m[z] === "dom" ? "ambas" : "base";
  return m;
}

function AvatarView() {
  const [opciones, setOpciones] = useState<Opciones | null>(null);
  const [fotos, setFotos] = useState<Record<string, string>>({});
  const [sinApi, setSinApi] = useState(false);
  const [zona, setZona] = useState<string | null>(null);
  const [mano, setMano] = useState("");
  const [manos, setManos] = useState<Manos>("");
  const [resultados, setResultados] = useState<SenaResumen[] | null>(null);
  const [cargando, setCargando] = useState(false);
  const [ficha, setFicha] = useState<SenaFicha | null>(null);

  useEffect(() => {
    cargarFotos().then(setFotos);
    api
      .opciones()
      .then(setOpciones)
      .catch(() => setSinApi(true));
  }, []);

  useEffect(() => {
    if (!zona && !mano) {
      setResultados(null);
      return;
    }
    setCargando(true);
    api
      .filtrar(mano, zona ?? "", manos)
      .then((r) => {
        setResultados(r);
        setSinApi(false);
      })
      .catch(() => setSinApi(true))
      .finally(() => setCargando(false));
  }, [zona, mano, manos]);

  const conteoZona = useMemo(() => Object.fromEntries(opciones?.zonas ?? []), [opciones]);
  const abrir = (id: number) =>
    api
      .sena(id)
      .then((f) => {
        setFicha(f);
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch(() => setSinApi(true));
  const limpiar = () => {
    setZona(null);
    setMano("");
    setManos("");
    setFicha(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            Nueva sección · Búsqueda visual
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold">
            {ficha ? ficha.glosa : "Encuentra una seña con el cuerpo"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {ficha
              ? `${ficha.codigo} · ${ficha.significado}`
              : "Toca dónde se hace la seña y elige la forma de la mano. No hace falta escribir."}
          </p>
        </div>
        {ficha ? (
          <Button variant="outline" onClick={() => setFicha(null)}>
            <ArrowLeft />
            Volver a los resultados
          </Button>
        ) : (
          (zona || mano || manos) && (
            <Button variant="outline" onClick={limpiar}>
              <RotateCcw />
              Borrar elección
            </Button>
          )
        )}
      </div>

      {sinApi && (
        <div className="mt-5 flex gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <ServerCrash className="shrink-0 text-destructive" size={20} />
          <p>
            No hay conexión con la API en <code className="rounded bg-muted px-1">{API_URL}</code>.
            Enciende PostgreSQL y arranca la API de LSM_DB con <b>iniciar.bat</b>; luego recarga
            esta página.
          </p>
        </div>
      )}

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <section
          aria-label="Avatar"
          className="overflow-hidden rounded-xl bg-hero text-hero-foreground shadow-sm ring-1 ring-border"
        >
          <div className="flex items-center justify-between px-5 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-hero-muted">
              {ficha ? "Dónde se hace" : "1 · ¿Dónde se hace?"}
            </p>
            {ficha ? (
              <span className="flex gap-3 text-xs text-hero-muted">
                <span className="flex items-center gap-1.5">
                  <i className="size-2.5 rounded-full bg-[#f28a3c]" />
                  Mano principal
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="size-2.5 rounded-full bg-[#3b82f6]" />
                  Mano de apoyo
                </span>
              </span>
            ) : (
              <span className="text-xs text-hero-muted">Arrastra para girar</span>
            )}
          </div>
          <Avatar3D
            className="h-[420px] sm:h-[520px]"
            seleccion={ficha ? null : zona}
            marcas={ficha ? marcasDe(ficha) : undefined}
            disponibles={opciones?.zonas.map((z) => z[0])}
            onSelect={ficha ? undefined : (z) => setZona((a) => (a === z ? null : z))}
          />
          {!ficha && (
            <div className="flex flex-wrap items-center gap-2 border-t border-hero-soft px-5 py-3">
              <label htmlFor="zona" className="text-xs text-hero-muted">
                O elige de la lista
              </label>
              <select
                id="zona"
                value={zona ?? ""}
                onChange={(e) => setZona(e.target.value || null)}
                className="h-9 rounded-md border border-hero-soft bg-hero px-2 text-sm text-hero-foreground"
              >
                <option value="">Cualquier lugar</option>
                {NOMBRES_ZONAS.filter((z) => conteoZona[z]).map((z) => (
                  <option key={z} value={z}>
                    {z} ({conteoZona[z]})
                  </option>
                ))}
              </select>
            </div>
          )}
        </section>

        <section
          aria-label={ficha ? "Ficha de la seña" : "Forma de la mano y resultados"}
          className="space-y-6"
        >
          {ficha ? (
            <Ficha ficha={ficha} fotos={fotos} />
          ) : (
            <>
              <div className="rounded-xl bg-card p-5 shadow-sm ring-1 ring-border">
                <p className="section-label">2 · ¿Qué forma tiene la mano?</p>
                <div
                  className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6 xl:grid-cols-8"
                  role="group"
                  aria-label="Formas de la mano"
                >
                  {(opciones?.manos ?? []).map(([m, n]) => {
                    const src = fotoDe(fotos, m),
                      on = mano === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        aria-pressed={on}
                        aria-label={`Mano ${m}, ${n} señas`}
                        onClick={() => setMano(on ? "" : m)}
                        className={
                          "flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg p-1 ring-1 transition " +
                          (on
                            ? "bg-accent-soft ring-2 ring-accent"
                            : "bg-background ring-border hover:ring-primary/40")
                        }
                      >
                        {src ? (
                          <img src={src} alt="" className="h-12 w-full object-contain" />
                        ) : (
                          <Hand size={28} className="text-muted-foreground" />
                        )}
                        <span className="font-display text-sm font-semibold leading-none">{m}</span>
                        <span className="text-[10px] tabular-nums text-muted-foreground">{n}</span>
                      </button>
                    );
                  })}
                  {!opciones && !sinApi && (
                    <p className="col-span-full text-sm text-muted-foreground">
                      Cargando formas de mano…
                    </p>
                  )}
                </div>
                <p className="section-label mt-5">3 · ¿Cuántas manos?</p>
                <div className="mt-2 flex gap-2">
                  {(
                    [
                      ["", "Cualquiera"],
                      ["false", "Una mano"],
                      ["true", "Dos manos"],
                    ] as const
                  ).map(([v, t]) => (
                    <Button
                      key={v}
                      variant={manos === v ? "default" : "outline"}
                      size="sm"
                      aria-pressed={manos === v}
                      onClick={() => setManos(v)}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <h2 className="font-display text-xl font-semibold">Señas encontradas</h2>
                  {resultados && (
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {resultados.length} {resultados.length === 1 ? "seña" : "señas"}
                    </span>
                  )}
                </div>
                {!resultados && (
                  <p className="mt-3 rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
                    Toca una zona del avatar o elige una forma de mano para empezar.
                  </p>
                )}
                {cargando && <p className="mt-3 text-sm text-muted-foreground">Buscando…</p>}
                {resultados && resultados.length === 0 && (
                  <p className="mt-3 rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
                    No hay señas con esa combinación. Prueba quitando algo.
                  </p>
                )}
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {resultados?.slice(0, 60).map((s) => (
                    <button
                      key={s.id_sena}
                      type="button"
                      onClick={() => abrir(s.id_sena)}
                      className="group flex items-center gap-3 rounded-lg bg-card p-3 text-left shadow-sm ring-1 ring-border transition hover:ring-primary/40"
                    >
                      <span className="flex shrink-0 gap-1">
                        {(s.metadatos?.presencia.cm_dominante ?? []).slice(0, 2).map((c) => (
                          <ManoChip key={"d" + c} codigo={c} fotos={fotos} tipo="dom" />
                        ))}
                        {(s.metadatos?.presencia.cm_base ?? []).slice(0, 1).map((c) => (
                          <ManoChip key={"b" + c} codigo={c} fotos={fotos} tipo="base" />
                        ))}
                      </span>
                      <span className="min-w-0 flex-1">
                        <strong className="block truncate font-display">{s.glosa}</strong>
                        <span className="block truncate text-xs text-muted-foreground">
                          {s.codigo} · {s.significado}
                        </span>
                      </span>
                      <ArrowRight
                        size={16}
                        className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  ))}
                </div>
                {resultados && resultados.length > 60 && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Se muestran 60 de {resultados.length}. Elige otra forma de mano o zona para
                    acotar.
                  </p>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function ManoChip({
  codigo,
  fotos,
  tipo,
}: {
  codigo: string;
  fotos: Record<string, string>;
  tipo: "dom" | "base";
}) {
  const src = fotoDe(fotos, codigo);
  return (
    <span
      title={(tipo === "dom" ? "Mano principal: " : "Mano de apoyo: ") + codigo}
      className={
        "grid size-12 place-items-center rounded-md bg-background ring-2 " +
        (tipo === "dom" ? "ring-accent" : "ring-primary ring-dashed")
      }
    >
      {src ? (
        <img src={src} alt={codigo} className="h-10 w-10 object-contain" />
      ) : (
        <b className="text-xs">{codigo}</b>
      )}
    </span>
  );
}

function Ficha({ ficha, fotos }: { ficha: SenaFicha; fotos: Record<string, string> }) {
  const df = ficha.diccionarios[0]?.datos_fonologicos ?? {};
  const exactas = configuracionesExactas(String(df["configuracion"] ?? ""), fotos);
  const pres = ficha.metadatos?.presencia;
  const pasos = exactas.length
    ? exactas
    : (ficha.metadatos?.linea_temporal ?? []).map((t) => t.cm_dominante ?? "").filter(Boolean);
  const imagen = ficha.imagen ? API_URL + ficha.imagen : null;
  const campos: [string, string][] = [
    ["ubicacion", "Ubicación"],
    ["movimiento", "Movimiento"],
    ["orientacion", "Orientación"],
    ["rasgos_no_manuales", "Cara y cuerpo"],
    ["representacion", "Qué imita"],
    ["nota_cultural", "Nota cultural"],
  ];
  const glossId = ficha.codigo.replace(/\s+/g, "-");
  return (
    <>
      <div className="rounded-xl bg-card p-5 shadow-sm ring-1 ring-border">
        <div className="flex flex-wrap gap-1.5">
          {ficha.palabras.map((p) => (
            <span key={p} className="word-tag">
              {p}
            </span>
          ))}
        </div>
        {imagen && (
          <img
            src={imagen}
            alt={`Ilustración de ${ficha.glosa}`}
            className="mt-4 max-h-64 w-full rounded-md bg-background object-contain ring-1 ring-border"
          />
        )}
        <p className="section-label mt-5">Forma de la mano</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {pasos.map((c, i) => (
            <span key={c + i} className="flex items-center gap-3">
              {i > 0 && <ArrowRight className="text-accent" />}
              <figure className="flex flex-col items-center gap-1">
                <span className="grid size-24 place-items-center rounded-lg bg-background ring-2 ring-accent">
                  {fotoDe(fotos, c) ? (
                    <img
                      src={fotoDe(fotos, c)!}
                      alt={`Configuración ${c}`}
                      className="h-20 w-20 object-contain"
                    />
                  ) : (
                    <b>{c}</b>
                  )}
                </span>
                <figcaption className="font-display text-sm font-semibold">{c}</figcaption>
              </figure>
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {pres?.cm_base ? "Se hace con dos manos." : "Se hace con una mano."}{" "}
          {pasos.length > 1 ? "La mano cambia de forma durante la seña." : ""} Fotos: DLSM CDMX
          2017.
        </p>
      </div>
      <div className="rounded-xl bg-card p-5 shadow-sm ring-1 ring-border">
        <p className="section-label">Lo que dice el diccionario</p>
        {ficha.definiciones[0] && (
          <p className="mt-2 text-sm leading-relaxed">{ficha.definiciones[0].definicion}</p>
        )}
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {campos
            .filter(([k]) => df[k])
            .map(([k, n]) => (
              <div key={k} className="rounded-md bg-muted p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-accent">{n}</dt>
                <dd className="mt-1 text-sm">{String(df[k])}</dd>
              </div>
            ))}
        </dl>
        <p className="mt-4 text-xs text-muted-foreground">
          {ficha.diccionarios[0]?.diccionario}
          {df["pagina"] ? `, página ${df["pagina"]}` : ""}
        </p>
        <Link
          to="/glosas/$glossId"
          params={{ glossId }}
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Ver en el corpus <ArrowRight size={14} />
        </Link>
      </div>
    </>
  );
}
