import { useMemo } from "react";
import type { Materia } from "@/types/materia";

interface PeriodoPlan {
  periodo: string;
  materias: Materia[];
}

interface SimuladorResult {
  plan: PeriodoPlan[];
  esFactible: boolean;
  cuatrisMinimos: number;
  materiasRestantes: number;
  promedioPorCuatri: number;
  mensaje: string;
}

function generarPeriodos(
  cuatriInicio: 1 | 2,
  anioInicio: number,
  cuatriObjetivo: 1 | 2,
  anioObjetivo: number
): string[] {
  const periodos: string[] = [];
  let cuatri = cuatriInicio;
  let anio = anioInicio;

  while (anio < anioObjetivo || (anio === anioObjetivo && cuatri <= cuatriObjetivo)) {
    periodos.push(`${cuatri === 1 ? "1er" : "2do"} Cuatri ${anio}`);
    if (cuatri === 1) {
      cuatri = 2;
    } else {
      cuatri = 1;
      anio++;
    }
  }
  return periodos;
}

function calcularMinimoCuatris(
  materias: Materia[],
  aprobadas: Set<string>,
  maxPorCuatri: number
): number {
  const sim = new Set(aprobadas);
  const pendientes = materias.filter((m) => !sim.has(m.codigo));
  let cuatris = 0;

  let restantes = pendientes.length;
  while (restantes > 0) {
    cuatris++;
    const disponibles = materias.filter((m) => {
      if (sim.has(m.codigo)) return false;
      return m.correlativas_anteriores.every((c) => sim.has(c.codigo));
    });

    if (disponibles.length === 0) break;

    // Priorizar: las que desbloquean más materias primero
    const scored = disponibles.map((m) => {
      const desbloquea = materias.filter((other) => {
        if (sim.has(other.codigo)) return false;
        return other.correlativas_anteriores.some((c) => c.codigo === m.codigo);
      }).length;
      return { materia: m, score: desbloquea };
    });
    scored.sort((a, b) => b.score - a.score);

    const tomarEste = scored.slice(0, maxPorCuatri);
    for (const { materia } of tomarEste) {
      sim.add(materia.codigo);
      restantes--;
    }

    if (cuatris > 20) break; // safety
  }

  return cuatris;
}

export function useSimulador(
  materias: Materia[],
  aprobadas: Set<string>,
  fechaObjetivo: { cuatri: 1 | 2; anio: number } | null,
  maxPorCuatri: number
): SimuladorResult {
  const cuatrisMinimos = useMemo(
    () => calcularMinimoCuatris(materias, aprobadas, maxPorCuatri),
    [materias, aprobadas, maxPorCuatri]
  );

  const materiasRestantes = materias.filter((m) => !aprobadas.has(m.codigo)).length;

  return useMemo(() => {
    if (!fechaObjetivo) {
      return {
        plan: [],
        esFactible: true,
        cuatrisMinimos,
        materiasRestantes,
        promedioPorCuatri: 0,
        mensaje: "",
      };
    }

    // Generate periods from now (1er cuatri 2026) to target
    const periodos = generarPeriodos(1, 2026, fechaObjetivo.cuatri, fechaObjetivo.anio);

    if (periodos.length === 0) {
      return {
        plan: [],
        esFactible: false,
        cuatrisMinimos,
        materiasRestantes,
        promedioPorCuatri: 0,
        mensaje: "La fecha objetivo ya paso.",
      };
    }

    // Simulate cuatrimestre by cuatrimestre
    const sim = new Set(aprobadas);
    const plan: PeriodoPlan[] = [];
    let totalAsignadas = 0;

    for (const periodo of periodos) {
      const disponibles = materias.filter((m) => {
        if (sim.has(m.codigo)) return false;
        return m.correlativas_anteriores.every((c) => sim.has(c.codigo));
      });

      if (disponibles.length === 0) continue;

      // Score: prioritize by how many subjects they unlock
      const scored = disponibles.map((m) => {
        const desbloquea = materias.filter((other) => {
          if (sim.has(other.codigo)) return false;
          return other.correlativas_anteriores.some((c) => c.codigo === m.codigo);
        }).length;
        // Bonus for being in the critical path (has posteriors that also have posteriors)
        const depth = m.correlativas_posteriores.length;
        return { materia: m, score: desbloquea * 2 + depth };
      });
      scored.sort((a, b) => b.score - a.score);

      const tomarEste = scored.slice(0, maxPorCuatri);
      const materiasDelPeriodo: Materia[] = [];

      for (const { materia } of tomarEste) {
        sim.add(materia.codigo);
        materiasDelPeriodo.push(materia);
        totalAsignadas++;
      }

      if (materiasDelPeriodo.length > 0) {
        plan.push({ periodo, materias: materiasDelPeriodo });
      }
    }

    const pendientesAlFinal = materias.filter((m) => !sim.has(m.codigo)).length;
    const esFactible = pendientesAlFinal === 0;
    const promedio = plan.length > 0 ? Math.round(totalAsignadas / plan.length * 10) / 10 : 0;

    let mensaje = "";
    if (esFactible) {
      mensaje = `Te recibirias en ${plan.length} cuatrimestres cursando ~${promedio} materias por cuatri.`;
    } else {
      mensaje = `No alcanza. Te quedan ${pendientesAlFinal} materias sin poder ubicar. Necesitas al menos ${cuatrisMinimos} cuatrimestres.`;
    }

    return {
      plan,
      esFactible,
      cuatrisMinimos,
      materiasRestantes,
      promedioPorCuatri: promedio,
      mensaje,
    };
  }, [materias, aprobadas, fechaObjetivo, maxPorCuatri, cuatrisMinimos, materiasRestantes]);
}
