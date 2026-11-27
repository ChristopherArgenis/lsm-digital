import { Clock3, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { addHistory, useHistory } from "@/hooks/use-corpus-local";

const Page = ({ children }: { children: React.ReactNode }) => <div className="mx-auto max-w-7xl px-4 py-7 sm:px-8 sm:py-10">{children}</div>;

export function HistoryView() {
  const { history, clear } = useHistory();
  const items = history.filter((item) => !item.path.startsWith("/muestras"));
  return <Page><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="section-label">Actividad de la sesión</p><h1 className="mt-2 font-display text-3xl font-semibold">Historial</h1></div>{items.length > 0 && <Button variant="outline" onClick={clear}><Trash2/>Limpiar</Button>}</div>{items.length === 0 ? <div className="mt-8 rounded-lg border border-dashed border-border bg-card p-10 text-center"><Clock3 className="mx-auto text-muted-foreground"/><h2 className="mt-3 font-display text-lg font-semibold">No hay actividad reciente</h2><p className="mt-1 text-sm text-muted-foreground">Las búsquedas y glosas visitadas aparecerán aquí.</p></div> : <div className="mt-7 divide-y divide-border rounded-lg border border-border bg-card">{items.map((item) => <a key={`${item.id}-${item.at}`} href={item.path} className="flex items-center gap-4 p-4 hover:bg-muted"><span className="grid size-9 place-items-center rounded-md bg-primary-soft text-primary"><Clock3 size={17}/></span><span className="min-w-0 flex-1"><strong className="block truncate text-sm">{item.label}</strong><small className="text-muted-foreground">{item.kind}</small></span><span className="text-xs text-muted-foreground">{new Date(item.at).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}</span></a>)}</div>}</Page>;
}

export function TrackVisit({ id, label, kind, path }: Omit<Parameters<typeof addHistory>[0], "at">) {
  useEffect(() => addHistory({ id, label, kind, path }), [id, label, kind, path]); return null;
}
