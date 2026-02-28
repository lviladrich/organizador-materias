"use client";

import { useMemo, useState } from "react";
import planData from "@/data/materias.json";
import type { Materia, PlanData } from "@/types/materia";
import { useAprobadas } from "@/hooks/useAprobadas";
import { useSimulador } from "@/hooks/useSimulador";
import { YearSection } from "@/components/YearSection";
import { CriticalPath } from "@/components/CriticalPath";
import { DependencyGraph } from "@/components/DependencyGraph";
import { GraduationSimulator } from "@/components/GraduationSimulator";

const data = planData as PlanData;

export default function Home() {
  const {
    aprobadas,
    loaded,
    toggle,
    getEstado,
    getDesbloquea,
    getCaminoCritico,
    reset,
    totalAprobadas,
  } = useAprobadas(data.materias);

  const [vista, setVista] = useState<"grilla" | "grafo">("grilla");
  const [showSimulador, setShowSimulador] = useState(false);

  const materiasPorAnio = useMemo(() => {
    const grouped: Record<string, Record<string, Materia[]>> = {};
    for (const m of data.materias) {
      if (!grouped[m.anio]) grouped[m.anio] = {};
      if (!grouped[m.anio][m.cuatrimestre])
        grouped[m.anio][m.cuatrimestre] = [];
      grouped[m.anio][m.cuatrimestre].push(m);
    }
    return grouped;
  }, []);

  const disponibles = useMemo(() => {
    return data.materias.filter((m) => getEstado(m) === "disponible").length;
  }, [getEstado]);

  const caminoCritico = useMemo(() => getCaminoCritico(), [getCaminoCritico]);
  const caminoCriticoCodigos = useMemo(
    () => new Set(caminoCritico.map((m) => m.codigo)),
    [caminoCritico]
  );

  const { cuatrisMinimos } = useSimulador(data.materias, aprobadas, null, 5);

  const anios = Object.keys(materiasPorAnio).sort();
  const restantes = data.total_materias - totalAprobadas;
  const porcentaje = Math.round((totalAprobadas / data.total_materias) * 100);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="animate-pulse text-[#86868b]">Cargando...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] pb-16">
      {/* Hero Header */}
      <header className="relative bg-[#000] text-white overflow-hidden">
        {/* Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0071e3] rounded-full opacity-[0.07] blur-[120px]" />
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#30d158] rounded-full opacity-[0.05] blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-10 pb-8">
          {/* Title */}
          <div className="mb-7">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Organizador de Materias
            </h1>
            <p className="text-[#86868b] text-sm mt-2">
              {restantes > 0
                ? `${restantes} materias restantes · ${disponibles} disponibles para cursar`
                : "¡Aprobaste todas las materias!"}
            </p>
          </div>

          {/* Glass stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
            {/* Avance */}
            <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}>
              <div className="text-2xl font-bold tabular-nums">{porcentaje}%</div>
              <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1 mb-2">Avance</div>
              <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${porcentaje}%`, background: "linear-gradient(90deg, #0071e3, #30d158)" }} />
              </div>
            </div>
            {/* Aprobadas */}
            <div className="rounded-2xl p-4" style={{ background: "rgba(48,209,88,0.08)", border: "1px solid rgba(48,209,88,0.2)", backdropFilter: "blur(20px)" }}>
              <div className="text-2xl font-bold text-[#30d158] tabular-nums">{totalAprobadas}</div>
              <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Aprobadas</div>
            </div>
            {/* Disponibles */}
            <div className="rounded-2xl p-4" style={{ background: "rgba(0,113,227,0.08)", border: "1px solid rgba(0,113,227,0.2)", backdropFilter: "blur(20px)" }}>
              <div className="text-2xl font-bold text-[#0071e3] tabular-nums">{disponibles}</div>
              <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Disponibles</div>
            </div>
            {/* Cuatrimestres */}
            <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}>
              <div className="text-2xl font-bold tabular-nums">{cuatrisMinimos}</div>
              <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Cuatris mínimos</div>
            </div>
          </div>

          {/* CTA + career info */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-white/30 text-xs font-mono">
              {data.carrera} &middot; Plan {data.plan} &middot; {data.anio_plan}
            </p>
            {restantes > 0 && (
              <button
                onClick={() => setShowSimulador(true)}
                className="text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 card-press"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(20px)", color: "white" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.16)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              >
                Simular mi egreso
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8">
        {/* Toolbar */}
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <div className="flex bg-white/80 backdrop-blur-sm rounded-xl border border-[rgba(0,0,0,0.06)] p-0.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <button
              onClick={() => setVista("grilla")}
              className={`px-4 py-1.5 text-xs font-medium rounded-md ${
                vista === "grilla"
                  ? "bg-[#171717] text-white"
                  : "text-[#666] hover:text-[#171717]"
              }`}
            >
              Grilla
            </button>
            <button
              onClick={() => setVista("grafo")}
              className={`px-4 py-1.5 text-xs font-medium rounded-md ${
                vista === "grafo"
                  ? "bg-[#171717] text-white"
                  : "text-[#666] hover:text-[#171717]"
              }`}
            >
              Grafo
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#86868b]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#30d158]" />
              Aprobada
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[rgba(0,0,0,0.15)]" />
              Disponible
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[rgba(0,0,0,0.08)]" />
              Bloqueada
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0071e3]" />
              Prioridad
            </div>
          </div>

          <div className="flex-1" />

          <button
            onClick={reset}
            className="text-xs text-[#86868b] hover:text-[#1d1d1f] font-medium"
          >
            Resetear
          </button>
        </div>

        {vista === "grafo" ? (
          <div className="space-y-4">
            <DependencyGraph
              materias={data.materias}
              getEstado={getEstado}
              onToggle={toggle}
              caminoCriticoCodigos={caminoCriticoCodigos}
            />
            <p className="text-[11px] text-[#86868b] text-center">
              Click en un nodo para aprobar/desaprobar &middot; Las flechas animadas son el camino critico
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
            <div>
              {anios.map((anio) => (
                <YearSection
                  key={anio}
                  anio={anio}
                  materiasPorCuatri={materiasPorAnio[anio]}
                  getEstado={getEstado}
                  onToggle={toggle}
                  getDesbloquea={getDesbloquea}
                  caminoCriticoCodigos={caminoCriticoCodigos}
                />
              ))}
            </div>

            <aside>
              <div className="lg:sticky lg:top-6 space-y-5">
                <CriticalPath camino={caminoCritico} />
              </div>
            </aside>
          </div>
        )}
      </div>

      {showSimulador && (
        <GraduationSimulator
          materias={data.materias}
          aprobadas={aprobadas}
          onClose={() => setShowSimulador(false)}
        />
      )}
    </main>
  );
}
