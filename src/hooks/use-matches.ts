import { useEffect, useState, useCallback } from "react";
import type { Match, MatchInput } from "@/interfaces/match";

const STORAGE_KEY = "chess-club-matches";

const seed: Match[] = [
  {
    id: crypto.randomUUID(),
    white: "Magnus Carlsen",
    black: "Hikaru Nakamura",
    result: "1-0",
    opening: "Ruy López",
    date: "2025-04-12",
    notes: "Hızlı tempo, 38 hamlede sonuç.",
  },
  {
    id: crypto.randomUUID(),
    white: "Ding Liren",
    black: "Ian Nepomniachtchi",
    result: "½-½",
    opening: "Berlin Defense",
    date: "2025-03-30",
  },
  {
    id: crypto.randomUUID(),
    white: "Alireza Firouzja",
    black: "Fabiano Caruana",
    result: "0-1",
    opening: "Sicilian Najdorf",
    date: "2025-02-18",
    notes: "Şiddetli kanat saldırısı.",
  },
];

function read(): Match[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    return JSON.parse(raw) as Match[];
  } catch {
    return seed;
  }
}

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>(seed);

  useEffect(() => {
    setMatches(read());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
  }, [matches]);

  const add = useCallback((input: MatchInput) => {
    setMatches((prev) => [{ id: crypto.randomUUID(), ...input }, ...prev]);
  }, []);

  const update = useCallback((id: string, input: MatchInput) => {
    setMatches((prev) => prev.map((m) => (m.id === id ? { ...m, ...input } : m)));
  }, []);

  const remove = useCallback((id: string) => {
    setMatches((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return { matches, add, update, remove };
}