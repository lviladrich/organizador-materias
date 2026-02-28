"use client";

interface ProgressBarProps {
  aprobadas: number;
  total: number;
  disponibles: number;
}

export function ProgressBar({ aprobadas, total, disponibles }: ProgressBarProps) {
  const porcentaje = Math.round((aprobadas / total) * 100);

  return (
    <div className="bg-white rounded-xl border border-[#eaeaea] p-5">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-sm font-semibold text-[#171717]">Progreso</h2>
        <span className="text-3xl font-bold text-[#171717] tabular-nums">{porcentaje}%</span>
      </div>

      <div className="w-full bg-[#eaeaea] rounded-full h-2 mb-5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${porcentaje}%`,
            background: "linear-gradient(90deg, #0070f3, #22c55e)",
          }}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-2.5 rounded-lg bg-[#f0fdf4]">
          <div className="text-xl font-bold text-[#22c55e] tabular-nums">{aprobadas}</div>
          <div className="text-[10px] text-[#666] uppercase tracking-widest font-medium mt-0.5">
            Aprobadas
          </div>
        </div>
        <div className="text-center p-2.5 rounded-lg bg-[#eff6ff]">
          <div className="text-xl font-bold text-[#0070f3] tabular-nums">{disponibles}</div>
          <div className="text-[10px] text-[#666] uppercase tracking-widest font-medium mt-0.5">
            Disponibles
          </div>
        </div>
        <div className="text-center p-2.5 rounded-lg bg-[#f9fafb]">
          <div className="text-xl font-bold text-[#999] tabular-nums">{total - aprobadas}</div>
          <div className="text-[10px] text-[#666] uppercase tracking-widest font-medium mt-0.5">
            Restantes
          </div>
        </div>
      </div>
    </div>
  );
}
