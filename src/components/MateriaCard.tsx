"use client";

import { useState } from "react";
import type { Materia, MateriaEstado } from "@/types/materia";

interface MateriaCardProps {
  materia: Materia;
  estado: MateriaEstado;
  onToggle: (codigo: string) => void;
  desbloquea: Materia[];
  esCaminoCritico: boolean;
}

const cardStyles: Record<MateriaEstado, string> = {
  aprobada:
    "bg-[rgba(48,209,88,0.08)] border-[rgba(48,209,88,0.25)] hover:border-[rgba(48,209,88,0.45)] hover:shadow-[0_4px_24px_rgba(48,209,88,0.12)]",
  disponible:
    "bg-white/80 border-[rgba(0,0,0,0.06)] hover:border-[rgba(0,113,227,0.3)] hover:shadow-[0_4px_24px_rgba(0,113,227,0.1)] hover:-translate-y-0.5",
  bloqueada:
    "bg-white/40 border-[rgba(0,0,0,0.04)] opacity-50 cursor-default",
};

export function MateriaCard({
  materia,
  estado,
  onToggle,
  desbloquea,
  esCaminoCritico,
}: MateriaCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={`relative rounded-2xl border p-3.5 select-none backdrop-blur-sm card-press
        ${estado !== "bloqueada" ? "cursor-pointer" : ""}
        ${cardStyles[estado]}
        ${esCaminoCritico && estado !== "aprobada"
          ? "ring-1 ring-[#0071e3]/40 border-[rgba(0,113,227,0.3)] shadow-[0_0_20px_rgba(0,113,227,0.12)]"
          : "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.04)]"
        }`}
      onClick={() => onToggle(materia.codigo)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 shrink-0">
          {estado === "aprobada" ? (
            <div className="w-5 h-5 rounded-full bg-[#30d158] flex items-center justify-center shadow-[0_2px_8px_rgba(48,209,88,0.4)]">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M2 5.5L4.5 8L9 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          ) : estado === "disponible" ? (
            <div className="w-5 h-5 rounded-full border-2 border-[#0071e3]/40 bg-[#0071e3]/5" />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-[rgba(0,0,0,0.1)] bg-[rgba(0,0,0,0.03)]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-medium leading-snug text-[#1d1d1f]">
            {materia.nombre}
          </div>
          <div className="text-[11px] font-mono text-[#86868b] mt-0.5">
            {materia.codigo}
          </div>
        </div>
      </div>

      {esCaminoCritico && estado !== "aprobada" && (
        <div className="absolute -top-2 -right-2 bg-[#0071e3] text-white text-[9px] font-semibold px-2 py-0.5 rounded-full tracking-wide shadow-[0_2px_8px_rgba(0,113,227,0.4)]">
          PRIORIDAD
        </div>
      )}

      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 pointer-events-none"
          style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.25))" }}
        >
          <div className="bg-[rgba(29,29,31,0.92)] backdrop-blur-2xl text-white text-xs rounded-2xl p-4 border border-white/10">
            <div className="font-semibold text-[13px] mb-3">{materia.nombre}</div>

            {materia.correlativas_anteriores.length > 0 && (
              <div className="mb-3">
                <div className="text-white/40 text-[10px] uppercase tracking-widest mb-1.5 font-medium">
                  Necesitas aprobar
                </div>
                {materia.correlativas_anteriores.map((c) => (
                  <div key={c.codigo} className="text-[#30d158] leading-relaxed">· {c.nombre}</div>
                ))}
              </div>
            )}

            {materia.correlativas_posteriores.length > 0 && (
              <div className="mb-3">
                <div className="text-white/40 text-[10px] uppercase tracking-widest mb-1.5 font-medium">
                  Te habilita
                </div>
                {materia.correlativas_posteriores.map((c) => (
                  <div key={c.codigo} className="text-[#0071e3] leading-relaxed">· {c.nombre}</div>
                ))}
              </div>
            )}

            {desbloquea.length > 0 && estado !== "aprobada" && (
              <div>
                <div className="text-white/40 text-[10px] uppercase tracking-widest mb-1.5 font-medium">
                  Si la aprobas, desbloqueas
                </div>
                {desbloquea.map((m) => (
                  <div key={m.codigo} className="text-amber-400 leading-relaxed">· {m.nombre}</div>
                ))}
              </div>
            )}

            {materia.correlativas_anteriores.length === 0 &&
              materia.correlativas_posteriores.length === 0 && (
                <div className="text-white/30">Sin correlativas</div>
              )}
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-[rgba(29,29,31,0.92)]" />
        </div>
      )}
    </div>
  );
}
