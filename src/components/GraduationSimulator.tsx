"use client";

import { useState } from "react";
import type { Materia } from "@/types/materia";
import { useSimulador } from "@/hooks/useSimulador";

interface GraduationSimulatorProps {
  materias: Materia[];
  aprobadas: Set<string>;
  onClose: () => void;
}

export function GraduationSimulator({ materias, aprobadas, onClose }: GraduationSimulatorProps) {
  const [anioObjetivo, setAnioObjetivo] = useState(2027);
  const [cuatriObjetivo, setCuatriObjetivo] = useState<1 | 2>(2);
  const [maxPorCuatri, setMaxPorCuatri] = useState(5);

  const { plan, esFactible, cuatrisMinimos, materiasRestantes, promedioPorCuatri, mensaje } =
    useSimulador(materias, aprobadas, { cuatri: cuatriObjetivo, anio: anioObjetivo }, maxPorCuatri);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[88vh] overflow-hidden flex flex-col rounded-t-3xl sm:rounded-3xl"
        style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.6)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.04)",
        }}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-[rgba(0,0,0,0.12)]" />
        </div>

        {/* Header */}
        <div className="px-6 py-4 flex items-start justify-between shrink-0 border-b border-[rgba(0,0,0,0.06)]">
          <div>
            <h2 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight">
              Simulador de Egreso
            </h2>
            <p className="text-xs text-[#86868b] mt-0.5">
              {materiasRestantes} materias pendientes · mínimo {cuatrisMinimos} cuatrimestres
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[rgba(0,0,0,0.06)] flex items-center justify-center text-[#86868b] hover:bg-[rgba(0,0,0,0.1)] hover:text-[#1d1d1f] ml-4 shrink-0"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Controls */}
        <div className="px-6 py-4 shrink-0 border-b border-[rgba(0,0,0,0.06)] space-y-4">
          <div className="flex items-end gap-4 flex-wrap">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#86868b] font-medium block mb-2">
                Me quiero recibir en
              </label>
              <div className="flex gap-2">
                <select
                  value={cuatriObjetivo}
                  onChange={(e) => setCuatriObjetivo(Number(e.target.value) as 1 | 2)}
                  className="bg-[rgba(0,0,0,0.04)] border border-[rgba(0,0,0,0.08)] rounded-xl px-3 py-2 text-sm text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                >
                  <option value={1}>1er Cuatrimestre</option>
                  <option value={2}>2do Cuatrimestre</option>
                </select>
                <select
                  value={anioObjetivo}
                  onChange={(e) => setAnioObjetivo(Number(e.target.value))}
                  className="bg-[rgba(0,0,0,0.04)] border border-[rgba(0,0,0,0.08)] rounded-xl px-3 py-2 text-sm text-[#1d1d1f] focus:outline-none focus:border-[#0071e3]"
                >
                  {[2026, 2027, 2028, 2029, 2030, 2031, 2032].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#86868b] font-medium block mb-2">
                Materias por cuatrimestre
              </label>
              <div className="flex gap-1">
                {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <button
                    key={n}
                    onClick={() => setMaxPorCuatri(n)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold border transition-all ${
                      maxPorCuatri === n
                        ? "bg-[#1d1d1f] text-white border-[#1d1d1f] shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                        : "bg-[rgba(0,0,0,0.04)] text-[#6e6e73] border-[rgba(0,0,0,0.06)] hover:border-[rgba(0,0,0,0.15)] hover:text-[#1d1d1f]"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Result banner */}
        <div className={`px-6 py-3 text-sm font-medium shrink-0 flex items-center gap-2 ${
          esFactible
            ? "bg-[rgba(48,209,88,0.1)] text-[#1a7a33]"
            : "bg-[rgba(255,59,48,0.08)] text-[#c0392b]"
        }`}>
          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${esFactible ? "bg-[#30d158]" : "bg-[#ff3b30]"}`}>
            {esFactible ? (
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M2.5 2.5L6.5 6.5M6.5 2.5L2.5 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </div>
          {mensaje}
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {plan.length === 0 ? (
            <div className="text-center py-12 text-[#86868b] text-sm">
              Selecciona una fecha para ver el plan.
            </div>
          ) : (
            <div className="space-y-0">
              {plan.map((p, i) => (
                <div key={p.periodo} className="flex gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      i === plan.length - 1 && esFactible
                        ? "bg-[#30d158] text-white shadow-[0_2px_12px_rgba(48,209,88,0.4)]"
                        : i === 0
                        ? "bg-[#0071e3] text-white shadow-[0_2px_12px_rgba(0,113,227,0.4)]"
                        : "bg-[#1d1d1f] text-white"
                    }`}>
                      {i + 1}
                    </div>
                    {i < plan.length - 1 && (
                      <div className="w-px flex-1 min-h-4 bg-[rgba(0,0,0,0.08)]" />
                    )}
                  </div>

                  <div className="flex-1 pb-5">
                    <div className="text-xs font-semibold text-[#1d1d1f] mb-2">
                      {p.periodo}
                      <span className="text-[#86868b] font-normal ml-2">
                        {p.materias.length} {p.materias.length === 1 ? "materia" : "materias"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {p.materias.map((m) => (
                        <div
                          key={m.codigo}
                          className="bg-[rgba(0,0,0,0.03)] border border-[rgba(0,0,0,0.05)] rounded-xl px-3 py-2 text-xs text-[#1d1d1f]"
                        >
                          {m.nombre}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {esFactible && (
                <div className="flex gap-4 items-center pt-1">
                  <div className="w-8 h-8 rounded-full bg-[#30d158] flex items-center justify-center shadow-[0_4px_16px_rgba(48,209,88,0.4)] shrink-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8L6.5 11.5L13 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="text-sm font-semibold text-[#30d158]">
                    Te recibirías 🎓
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[rgba(0,0,0,0.06)] flex items-center justify-between shrink-0 bg-[rgba(0,0,0,0.01)]">
          <div className="text-[11px] text-[#86868b]">
            {plan.length > 0 && `${plan.length} cuatrimestres · ~${promedioPorCuatri} materias/cuatri`}
          </div>
          <button
            onClick={onClose}
            className="bg-[#1d1d1f] text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-[#3d3d3d] shadow-[0_1px_3px_rgba(0,0,0,0.2)]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
