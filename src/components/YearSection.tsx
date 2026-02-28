"use client";

import type { Materia, MateriaEstado } from "@/types/materia";
import { MateriaCard } from "./MateriaCard";

interface YearSectionProps {
  anio: string;
  materiasPorCuatri: Record<string, Materia[]>;
  getEstado: (m: Materia) => MateriaEstado;
  onToggle: (codigo: string) => void;
  getDesbloquea: (codigo: string) => Materia[];
  caminoCriticoCodigos: Set<string>;
}

export function YearSection({
  anio,
  materiasPorCuatri,
  getEstado,
  onToggle,
  getDesbloquea,
  caminoCriticoCodigos,
}: YearSectionProps) {
  const cuatrimestres = Object.keys(materiasPorCuatri).sort();

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <span className="bg-[#1d1d1f] text-white text-xs font-semibold px-3.5 py-1.5 rounded-full tracking-wide">
          {anio}
        </span>
        <div className="flex-1 h-px bg-[rgba(0,0,0,0.06)]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cuatrimestres.map((cuatri) => (
          <div key={cuatri}>
            <h3 className="text-xs font-medium text-[#86868b] mb-3 uppercase tracking-widest">
              {cuatri}
            </h3>
            <div className="space-y-2">
              {materiasPorCuatri[cuatri].map((materia) => (
                <MateriaCard
                  key={materia.codigo}
                  materia={materia}
                  estado={getEstado(materia)}
                  onToggle={onToggle}
                  desbloquea={getDesbloquea(materia.codigo)}
                  esCaminoCritico={caminoCriticoCodigos.has(materia.codigo)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
