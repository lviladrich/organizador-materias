export interface Correlativa {
  codigo: string;
  nombre: string;
}

export interface Materia {
  codigo: string;
  nombre: string;
  anio: string;
  cuatrimestre: string;
  correlativas_anteriores: Correlativa[];
  correlativas_posteriores: Correlativa[];
}

export interface PlanData {
  carrera: string;
  plan: string;
  anio_plan: string;
  total_materias: number;
  materias: Materia[];
}

export type MateriaEstado = "aprobada" | "disponible" | "bloqueada";
