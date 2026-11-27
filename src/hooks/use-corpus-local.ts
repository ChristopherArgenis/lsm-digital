import { useEffect, useState } from "react";

const FAVORITES_KEY = "corpus-lsm-favorites";
const HISTORY_KEY = "corpus-lsm-history";
const LEGACY_FAVORITES_KEY = "cicese-corpus-favorites";
const LEGACY_HISTORY_KEY = "cicese-corpus-history";

export type HistoryItem = { id: string; label: string; kind: "Búsqueda" | "Glosa" | "Muestra"; path: string; at: number };

function readList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(window.localStorage.getItem(key) ?? "[]") as T[]; } catch { return []; }
}

/** Traslada los datos guardados con los nombres de clave anteriores para no perder el historial del navegador. */
function migrate(legacyKey: string, key: string) {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(key) !== null) return;
  const legacy = window.localStorage.getItem(legacyKey);
  if (legacy === null) return;
  window.localStorage.setItem(key, legacy);
  window.localStorage.removeItem(legacyKey);
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  useEffect(() => { migrate(LEGACY_FAVORITES_KEY, FAVORITES_KEY); setFavorites(readList<string>(FAVORITES_KEY)); }, []);
  const toggle = (id: string) => setFavorites((current) => {
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    return next;
  });
  return { favorites, toggle, isFavorite: (id: string) => favorites.includes(id) };
}

export function addHistory(item: Omit<HistoryItem, "at">) {
  if (typeof window === "undefined") return;
  migrate(LEGACY_HISTORY_KEY, HISTORY_KEY);
  const current = readList<HistoryItem>(HISTORY_KEY).filter((entry) => entry.id !== item.id);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify([{ ...item, at: Date.now() }, ...current].slice(0, 20)));
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  useEffect(() => { migrate(LEGACY_HISTORY_KEY, HISTORY_KEY); setHistory(readList<HistoryItem>(HISTORY_KEY)); }, []);
  const clear = () => { window.localStorage.removeItem(HISTORY_KEY); setHistory([]); };
  return { history, clear };
}
