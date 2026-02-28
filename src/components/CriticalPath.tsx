"use client";

import type { Materia } from "@/types/materia";

interface CriticalPathProps {
  camino: Materia[];
}

export function CriticalPath({ camino }: CriticalPathProps) {
  if (camino.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[rgba(0,0,0,0.06)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h2 className="text-sm font-semibold text-[#1d1d1f] mb-3">Camino Critico</h2>
        <div className="text-[#30d158] font-medium text-center py-6 text-sm">
          Aprobaste todas las materias!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[rgba(0,0,0,0.06)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <h2 className="text-sm font-semibold text-[#1d1d1f] mb-1">Camino Critico</h2>
      <p className="text-[11px] text-[#86868b] mb-4 leading-relaxed">
        Prioriza estas materias para recibirte mas rapido.
      </p>

      <div className="space-y-0">
        {camino.map((m, i) => (
          <div key={m.codigo} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0 ${
                i === 0
                  ? "bg-[#0071e3] shadow-[0_2px_8px_rgba(0,113,227,0.4)]"
                  : "bg-[#1d1d1f]"
              }`}>
                {i + 1}
              </div>
              {i < camino.length - 1 && (
                <div className="w-px h-5 bg-[rgba(0,0,0,0.08)]" />
              )}
            </div>
            <div className={`text-[13px] pt-0.5 leading-snug ${
              i === 0 ? "text-[#0071e3] font-medium" : "text-[#1d1d1f]"
            }`}>
              {m.nombre}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-[rgba(0,0,0,0.06)] text-[11px] text-[#86868b]">
        {camino.length} materias en cadena
      </div>
    </div>
  );
}
