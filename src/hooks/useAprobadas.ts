"use client";

import { useState, useEffect, useCallback } from "react";
import type { Materia, MateriaEstado } from "@/types/materia";

const STORAGE_KEY = "correlativas-aprobadas";

export function useAprobadas(materias: Materia[]) {
  const [aprobadas, setAprobadas] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setAprobadas(new Set(JSON.parse(stored)));
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...aprobadas]));
    }
  }, [aprobadas, loaded]);

  const toggle = useCallback((codigo: string) => {
    setAprobadas((prev) => {
      const next = new Set(prev);
      if (next.has(codigo)) {
        next.delete(codigo);
      } else {
        next.add(codigo);
      }
      return next;
    });
  }, []);

  const getEstado = useCallback(
    (materia: Materia): MateriaEstado => {
      if (aprobadas.has(materia.codigo)) return "aprobada";
      if (materia.correlativas_anteriores.length === 0) return "disponible";
      const todasAprobadas = materia.correlativas_anteriores.every((c) =>
        aprobadas.has(c.codigo)
      );
      return todasAprobadas ? "disponible" : "bloqueada";
    },
    [aprobadas]
  );

  const getDesbloquea = useCallback(
    (codigo: string): Materia[] => {
      return materias.filter((m) => {
        if (aprobadas.has(m.codigo)) return false;
        const necesita = m.correlativas_anteriores.map((c) => c.codigo);
        if (!necesita.includes(codigo)) return false;
        const otrasAprobadas = necesita
          .filter((c) => c !== codigo)
          .every((c) => aprobadas.has(c));
        return otrasAprobadas;
      });
    },
    [materias, aprobadas]
  );

  const getCaminoCritico = useCallback((): Materia[] => {
    const memo = new Map<string, Materia[]>();

    function longestChain(codigo: string): Materia[] {
      if (memo.has(codigo)) return memo.get(codigo)!;
      const materia = materias.find((m) => m.codigo === codigo);
      if (!materia || aprobadas.has(codigo)) {
        memo.set(codigo, []);
        return [];
      }

      const posteriores = materia.correlativas_posteriores
        .filter((c) => !aprobadas.has(c.codigo))
        .map((c) => c.codigo);

      if (posteriores.length === 0) {
        memo.set(codigo, [materia]);
        return [materia];
      }

      let longest: Materia[] = [];
      for (const post of posteriores) {
        const chain = longestChain(post);
        if (chain.length > longest.length) {
          longest = chain;
        }
      }

      const result = [materia, ...longest];
      memo.set(codigo, result);
      return result;
    }

    let best: Materia[] = [];
    for (const m of materias) {
      if (!aprobadas.has(m.codigo)) {
        const chain = longestChain(m.codigo);
        if (chain.length > best.length) {
          best = chain;
        }
      }
    }
    return best;
  }, [materias, aprobadas]);

  const reset = useCallback(() => {
    setAprobadas(new Set());
  }, []);

  return {
    aprobadas,
    loaded,
    toggle,
    getEstado,
    getDesbloquea,
    getCaminoCritico,
    reset,
    totalAprobadas: aprobadas.size,
  };
}
