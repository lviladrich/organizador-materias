"use client";

import { useMemo, useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  Position,
  MarkerType,
  Background,
  Controls,
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";
import type { Materia, MateriaEstado } from "@/types/materia";

interface DependencyGraphProps {
  materias: Materia[];
  getEstado: (m: Materia) => MateriaEstado;
  onToggle: (codigo: string) => void;
  caminoCriticoCodigos: Set<string>;
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 56;

function layoutWithDagre(nodes: Node[], edges: Edge[]) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 50, ranksep: 70, marginx: 30, marginy: 30 });
  for (const node of nodes) g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  for (const edge of edges) g.setEdge(edge.source, edge.target);
  dagre.layout(g);
  return nodes.map((node) => {
    const pos = g.node(node.id);
    return { ...node, position: { x: pos.x - NODE_WIDTH / 2, y: pos.y - NODE_HEIGHT / 2 } };
  });
}

const estadoStyle: Record<MateriaEstado, { bg: string; border: string; text: string }> = {
  aprobada: { bg: "rgba(48,209,88,0.08)", border: "rgba(48,209,88,0.35)", text: "#1d1d1f" },
  disponible: { bg: "rgba(255,255,255,0.9)", border: "rgba(0,0,0,0.08)", text: "#1d1d1f" },
  bloqueada: { bg: "rgba(255,255,255,0.4)", border: "rgba(0,0,0,0.04)", text: "#86868b" },
};

export function DependencyGraph({ materias, getEstado, onToggle, caminoCriticoCodigos }: DependencyGraphProps) {
  const { nodes, edges } = useMemo(() => {
    const connected = new Set<string>();
    for (const m of materias) {
      if (m.correlativas_anteriores.length > 0 || m.correlativas_posteriores.length > 0) {
        connected.add(m.codigo);
        for (const c of m.correlativas_anteriores) connected.add(c.codigo);
        for (const c of m.correlativas_posteriores) connected.add(c.codigo);
      }
    }

    const raw: Node[] = [];
    const edges: Edge[] = [];

    for (const m of materias.filter((m) => connected.has(m.codigo))) {
      const estado = getEstado(m);
      const s = estadoStyle[estado];
      const isCritical = caminoCriticoCodigos.has(m.codigo) && estado !== "aprobada";

      raw.push({
        id: m.codigo,
        position: { x: 0, y: 0 },
        data: {
          label: (
            <div style={{ textAlign: "center", lineHeight: 1.3 }}>
              <div style={{ fontSize: 11, fontWeight: 600 }}>{m.nombre}</div>
            </div>
          ),
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
        style: {
          background: isCritical ? "rgba(0,113,227,0.06)" : s.bg,
          border: `1.5px solid ${isCritical ? "rgba(0,113,227,0.4)" : s.border}`,
          borderRadius: 16,
          padding: "8px 10px",
          width: NODE_WIDTH,
          color: s.text,
          backdropFilter: "blur(12px)",
          boxShadow: isCritical
            ? "0 0 24px rgba(0,113,227,0.15), 0 2px 8px rgba(0,0,0,0.06)"
            : "0 1px 4px rgba(0,0,0,0.05)",
        },
      });

      for (const post of m.correlativas_posteriores) {
        const isCriticalEdge = caminoCriticoCodigos.has(m.codigo) && caminoCriticoCodigos.has(post.codigo);
        edges.push({
          id: `${m.codigo}->${post.codigo}`,
          source: m.codigo,
          target: post.codigo,
          type: "smoothstep",
          animated: isCriticalEdge,
          style: { stroke: isCriticalEdge ? "#0071e3" : "rgba(0,0,0,0.15)", strokeWidth: isCriticalEdge ? 2 : 1.5 },
          markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14, color: isCriticalEdge ? "#0071e3" : "rgba(0,0,0,0.2)" },
        });
      }
    }

    return { nodes: layoutWithDagre(raw, edges), edges };
  }, [materias, getEstado, caminoCriticoCodigos]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => onToggle(node.id), [onToggle]);

  return (
    <div className="w-full h-[700px] bg-white/60 backdrop-blur-sm rounded-2xl border border-[rgba(0,0,0,0.06)] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <ReactFlow nodes={nodes} edges={edges} onNodeClick={onNodeClick} fitView fitViewOptions={{ padding: 0.3 }} minZoom={0.3} maxZoom={2} proOptions={{ hideAttribution: true }}>
        <Background color="rgba(0,0,0,0.04)" gap={24} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
