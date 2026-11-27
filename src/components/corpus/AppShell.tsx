import { Link, useRouterState } from "@tanstack/react-router";
import { CircleHelp, FlaskConical, History, Home, Menu, PersonStanding, Search, UserRound, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

const nav = [
  ["Inicio", "/", Home], ["Buscar", "/buscar", Search],
  ["Búsqueda fonológica", "/busqueda-fonologica", FlaskConical], ["Avatar", "/avatar", PersonStanding], ["Historial", "/historial", History],
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const title = nav.find((item) => item[1] === pathname)?.[0] ?? (pathname.startsWith("/glosas/") ? "Detalle de glosa" : "Corpus de Lengua de Señas");
  const sidebar = (
    <>
      <div className="px-5 pb-5 pt-6"><Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-accent font-display text-xs font-bold text-accent-foreground">LSM</span><span><strong className="block font-display text-lg text-sidebar-foreground">Corpus LSM</strong><small className="block text-[10px] uppercase tracking-[0.15em] text-sidebar-muted">Lengua de Señas Mexicana</small></span></Link></div>
      <div className="border-t border-sidebar-border px-3"><p className="px-3 pb-2 pt-4 text-[10px] uppercase tracking-[0.2em] text-sidebar-muted">Navegación</p><nav className="space-y-1">{nav.map(([label, to, Icon]) => <Link key={to} to={to} onClick={() => setOpen(false)} activeOptions={{ exact: to === "/" }} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground" activeProps={{ className: "bg-sidebar-accent text-sidebar-foreground ring-1 ring-sidebar-border" }}><Icon size={16}/>{label}</Link>)}</nav></div>
      <div className="mt-5 px-3"><p className="px-3 pb-2 pt-3 text-[10px] uppercase tracking-[0.2em] text-sidebar-muted">Proyecto</p><Link to="/acerca" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"><CircleHelp size={16}/>Acerca del proyecto</Link></div>
      <div className="mt-auto px-6 py-5 text-[11px] text-sidebar-muted">Corpus LSM · Beta</div>
    </>
  );
  return <div className="min-h-screen bg-background font-body text-foreground lg:flex"><aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar lg:flex">{sidebar}</aside>{open && <div className="fixed inset-0 z-50 flex lg:hidden"><Button variant="ghost" aria-label="Cerrar menú" onClick={() => setOpen(false)} className="absolute inset-0 h-auto w-full rounded-none bg-overlay"/><aside className="relative flex h-full w-72 flex-col bg-sidebar shadow-2xl">{sidebar}<Button variant="ghost" size="icon" aria-label="Cerrar menú" onClick={() => setOpen(false)} className="absolute right-3 top-3 text-sidebar-foreground"><X/></Button></aside></div>}<main className="min-w-0 flex-1"><header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md"><div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-8"><Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú" onClick={() => setOpen(true)}><Menu/></Button><span className="hidden text-sm text-muted-foreground sm:block">Corpus LSM <span className="mx-2 text-border">/</span> <strong className="font-medium text-foreground">{title}</strong></span><form action="/buscar" className="ml-auto hidden w-full max-w-sm items-center sm:flex"><input name="q" aria-label="Búsqueda global" placeholder="Buscar palabra o glosa..." className="h-9 min-w-0 flex-1 rounded-l-md border border-input bg-card px-3 text-sm outline-none focus:ring-1 focus:ring-ring"/><Button type="submit" className="rounded-l-none" aria-label="Ejecutar búsqueda"><Search/></Button></form><span className="rounded-full bg-accent-soft px-2.5 py-1 text-[10px] font-medium text-accent">Beta</span><span className="hidden size-8 place-items-center rounded-full bg-primary-soft text-primary md:grid"><UserRound size={16}/></span></div></header>{children}</main></div>;
}
