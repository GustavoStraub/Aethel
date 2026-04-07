"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import {
  generateMindMapData,
  MindMapNode,
  MindMapGraphData,
} from "@/lib/mind-map";
import { MindMapUniverseBackdrop } from "@/components/MindMapUniverseBackdrop";
import { MindMapNodeModal } from "@/components/MindMapNodeModal";

// Caching images
const imgCache = new Map<string, HTMLImageElement>();

// Colors for each type
const GROUP_COLORS: Record<string, string> = {
  Personagem: "#ef4444", // red-500
  Pessoa: "#3b82f6", // blue-500
  Facção: "#eab308", // amber-500
  Local: "#10b981", // emerald-500
  Sessão: "#8b5cf6", // violet-500
};

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  if (h.length !== 6) return `rgba(161, 161, 170, ${alpha})`;
  const n = Number.parseInt(h, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type GraphNode = MindMapNode & { x?: number; y?: number };

/**
 * Aumenta um pouco círculos, texto dos rótulos e espessura das arestas.
 * Subir para ~1.2 se quiser ainda maior; 1 = tamanho “antigo”.
 */
const NODE_MAP_SCALE = 1.25;

const BASE_NODE_RADIUS = 25;
/** Tamanho mínimo do rótulo (px no espaço da tela), antes de dividir pelo zoom. */
const LABEL_FONT_MIN = 10 * NODE_MAP_SCALE;

/** Escala visual no hover (1 = normal). */
const HOVER_SCALE_MAX = 1.36;

function graphNodeRadius(node: GraphNode): number {
  return BASE_NODE_RADIUS * NODE_MAP_SCALE * (node.val || 1);
}

function effectiveNodeRadius(
  node: GraphNode,
  hoverId: string | null,
  hoverBoost: number,
): number {
  const base = graphNodeRadius(node);
  if (hoverId !== null && node.id === hoverId) return base * hoverBoost;
  return base;
}

/** Fase estável por id (oscilação não fica em “sincronia robótica”). */
function floatPhaseFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  }
  return ((h & 0xffff) / 0xffff) * Math.PI * 2;
}

/**
 * Deslocamento no plano XY: órbita quase circular + leve harmônico (menos “robótico”).
 */
function mindMapFloatOffset(
  id: string,
  tSec: number,
): { ox: number; oy: number } {
  const p = floatPhaseFromId(id);
  const r = 7.2;
  const speed = 0.66;
  const ang = tSec * speed + p;
  let ox = r * Math.cos(ang);
  let oy = r * Math.sin(ang);
  const r2 = 2.35;
  ox += r2 * Math.sin(ang * 2.05 + 0.7);
  oy += r2 * Math.cos(ang * 2.05 + 0.7);
  return { ox, oy };
}

/**
 * Distância do clique ao “alvo” do nó (círculo ou centro do rótulo); null = fora.
 * Sempre usa o raio base (sem hover): se usássemos o raio ampliado do nó já em
 * hover, a área grande “roubava” o cursor dos vizinhos e o efeito não aparecia.
 */
function pointerDistanceScore(
  gx: number,
  gy: number,
  node: GraphNode,
  zoom: number,
  tSec: number,
): number | null {
  const ix0 = node.x;
  const iy0 = node.y;
  if (ix0 === undefined || iy0 === undefined) return null;

  const { ox, oy } = mindMapFloatOffset(node.id, tSec);
  const ix = ix0 + ox;
  const iy = iy0 + oy;

  const r = graphNodeRadius(node);
  const slopGraph = 16 / zoom;

  const dCenter = Math.hypot(gx - ix, gy - iy);
  if (dCenter <= r + 4 + slopGraph) return dCenter;

  const fontSize = Math.max(LABEL_FONT_MIN / zoom, 4);
  const labelW = node.name.length * fontSize * 0.58 + 16;
  const labelH = fontSize + 12;
  const lcx = ix;
  const lcy = iy + r + fontSize;
  if (Math.abs(gx - lcx) <= labelW / 2 && Math.abs(gy - lcy) <= labelH / 2) {
    return Math.hypot(gx - lcx, gy - lcy);
  }
  return null;
}

function pickMindMapNodeAtGraph(
  nodes: GraphNode[],
  gx: number,
  gy: number,
  zoom: number,
): GraphNode | null {
  const tSec =
    typeof performance !== "undefined" ? performance.now() / 1000 : 0;
  let best: GraphNode | null = null;
  let bestScore = Infinity;
  for (const n of nodes) {
    const s = pointerDistanceScore(gx, gy, n, zoom, tSec);
    if (s !== null && s < bestScore) {
      bestScore = s;
      best = n;
    }
  }
  return best;
}

export default function MindMapViewer() {
  const graphRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [data] = useState<MindMapGraphData>(generateMindMapData());
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomedRef = useRef(false);
  const nodeById = useMemo(() => {
    const m = new Map<string, GraphNode>();
    for (const n of data.nodes as GraphNode[]) {
      m.set(n.id, n);
    }
    return m;
  }, [data.nodes]);

  const [detailNode, setDetailNode] = useState<MindMapNode | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const hoverBoostRef = useRef(1);
  /** Incrementa a cada frame da animação de hover para o grafo redesenhar o canvas. */
  const [hoverPaintTick, setHoverPaintTick] = useState(0);

  useEffect(() => {
    const target = hoveredNodeId ? HOVER_SCALE_MAX : 1;
    let raf = 0;

    const loop = () => {
      const s = hoverBoostRef.current;
      const next = s + (target - s) * 0.28;
      hoverBoostRef.current = Math.abs(next - target) < 0.004 ? target : next;
      setHoverPaintTick((t) => t + 1);
      if (Math.abs(hoverBoostRef.current - target) > 0.004) {
        raf = requestAnimationFrame(loop);
      }
    };

    if (Math.abs(hoverBoostRef.current - target) > 0.004) {
      raf = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(raf);
  }, [hoveredNodeId]);

  /** Tooltip alinhado ao picking geométrico (o nativo do force-graph usa o canvas de sombra). */
  const [nodeTooltip, setNodeTooltip] = useState<{
    x: number;
    y: number;
    name: string;
    group: string;
  } | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!graphRef.current || dimensions.width <= 0) return;
    // Repulsão forte = nós mais espaçados (evita “bola” ilegível).
    graphRef.current.d3Force("charge")?.strength(-3200);
    // Distância alvo maior ao longo de cada aresta.
    graphRef.current.d3Force("link")?.distance(100);
    graphRef.current.d3ReheatSimulation();
  }, [data, dimensions.width]);

  /** Navegação por geometria no espaço do grafo — mais confiável que o hit por cor do canvas. */
  const pickNodeFromClientPointer = useCallback(
    (ev: Pick<MouseEvent, "clientX" | "clientY">): GraphNode | null => {
      const fg = graphRef.current;
      const el = containerRef.current;
      if (!fg || !el || dimensions.width <= 0) return null;

      const rect = el.getBoundingClientRect();
      const sx = ev.clientX - rect.left;
      const sy = ev.clientY - rect.top;
      const { x: gx, y: gy } = fg.screen2GraphCoords(sx, sy);
      return pickMindMapNodeAtGraph(
        data.nodes as GraphNode[],
        gx,
        gy,
        fg.zoom(),
      );
    },
    [data.nodes, dimensions.width],
  );

  const handleNodeClick = useCallback(
    (node: GraphNode, ev: MouseEvent) => {
      const picked = pickNodeFromClientPointer(ev) ?? node;
      setDetailNode(picked);
    },
    [pickNodeFromClientPointer],
  );

  const handleBackgroundClick = useCallback(
    (ev: MouseEvent) => {
      const picked = pickNodeFromClientPointer(ev);
      if (picked) setDetailNode(picked);
      else setDetailNode(null);
    },
    [pickNodeFromClientPointer],
  );

  // Cursor + tooltip: mesma lógica do clique (picking geométrico). O tooltip nativo do
  // force-graph depende do canvas de sombra e falha nos mesmos casos que o hover antigo.
  useEffect(() => {
    const root = containerRef.current;
    if (!root || dimensions.width <= 0) return;

    const onPointerMove = (ev: Pick<PointerEvent, "clientX" | "clientY">) => {
      // O primeiro `canvas` no container é o do MindMapUniverseBackdrop; o do grafo está em .force-graph-container.
      const graphCanvas = root.querySelector<HTMLCanvasElement>(
        ".force-graph-container canvas",
      );
      if (!graphCanvas) return;
      const picked = pickNodeFromClientPointer(ev);
      setHoveredNodeId((prev) => {
        const next = picked?.id ?? null;
        return prev === next ? prev : next;
      });
      const cur = picked ? "pointer" : "default";
      graphCanvas.style.cursor = cur;
      root.style.cursor = cur;
      if (picked) {
        setNodeTooltip({
          x: ev.clientX,
          y: ev.clientY,
          name: picked.name,
          group: picked.group,
        });
      } else {
        setNodeTooltip(null);
      }
    };

    const onLeave = () => {
      const graphCanvas = root.querySelector<HTMLCanvasElement>(
        ".force-graph-container canvas",
      );
      if (graphCanvas) graphCanvas.style.cursor = "default";
      root.style.cursor = "";
      setHoveredNodeId(null);
      setNodeTooltip(null);
    };

    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [dimensions.width, pickNodeFromClientPointer]);

  const nodePointerAreaPaint = useCallback(
    (
      node: GraphNode,
      color: string,
      ctx: CanvasRenderingContext2D,
      globalScale: number,
    ) => {
      void hoverPaintTick;
      const r = effectiveNodeRadius(node, hoveredNodeId, hoverBoostRef.current);
      const tSec = performance.now() / 1000;
      const { ox, oy } = mindMapFloatOffset(node.id, tSec);
      const nodeX = (node.x ?? 0) + ox;
      const nodeY = (node.y ?? 0) + oy;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(nodeX, nodeY, r + 4, 0, 2 * Math.PI, false);
      ctx.fill();

      // Incluir o rótulo abaixo do nó (mesma lógica que nodeCanvasObject), senão o clique no nome não funciona.
      const label = node.name;
      const fontSize = Math.max(LABEL_FONT_MIN / globalScale, 4);
      ctx.font = `600 ${fontSize}px Inter, sans-serif`;
      const w = ctx.measureText(label).width + 12;
      const h = fontSize + 8;
      const labelCenterY = nodeY + r + fontSize;
      ctx.fillRect(nodeX - w / 2, labelCenterY - h / 2, w, h);
    },
    [hoveredNodeId, hoverPaintTick],
  );

  const linkPointerAreaPaint = useCallback(() => {
    // Desativa a área de clique nas arestas para que links não roubem o "hover" dos nós nas áreas muito conexas!
  }, []);

  const nodeCanvasObject = useCallback(
    (node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
      void hoverPaintTick;
      const r = effectiveNodeRadius(node, hoveredNodeId, hoverBoostRef.current);
      const tSec = performance.now() / 1000;
      const { ox, oy } = mindMapFloatOffset(node.id, tSec);
      const nodeX = (node.x ?? 0) + ox;
      const nodeY = (node.y ?? 0) + oy;

      // Draw Border Circle
      ctx.beginPath();
      ctx.arc(nodeX, nodeY, r + 1.5, 0, 2 * Math.PI, false);
      ctx.fillStyle = GROUP_COLORS[node.group] || "#71717a";
      ctx.fill();

      // Draw Image
      if (node.image) {
        const src = node.image;
        if (!imgCache.has(src)) {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            // Force re-render if needed? We rely on continuous simulation or just wait
          };
          imgCache.set(src, img);
        }

        const img = imgCache.get(src);
        if (img && img.complete && img.naturalWidth !== 0) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(nodeX, nodeY, r, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();

          // Cover: preenche o círculo (corta laterais ou parte de baixo conforme o aspect ratio).
          // Alinhar pelo topo para retratos: mostra cabeça/rosto em vez do “miolo” da foto.
          const ratio = Math.max((r * 2) / img.width, (r * 2) / img.height);
          const nw = img.width * ratio;
          const nh = img.height * ratio;
          const drawX = nodeX - nw / 2;
          const drawY = nodeY - r;

          ctx.drawImage(img, drawX, drawY, nw, nh);
          ctx.restore();
        } else {
          // Fallback color while loading
          ctx.beginPath();
          ctx.arc(nodeX, nodeY, r, 0, 2 * Math.PI, false);
          ctx.fillStyle = "#18181b";
          ctx.fill();

          ctx.font = `bold ${r * 1.2}px Inter, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "white";
          ctx.fillText(node.name.charAt(0), nodeX, nodeY);
        }
      } else {
        // Fallback text (e.g. Session "S1")
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, r, 0, 2 * Math.PI, false);
        ctx.fillStyle = GROUP_COLORS[node.group] || "#18181b";
        ctx.fill();

        let innerText = node.name.charAt(0);
        if (node.group === "Sessão") {
          innerText = "S" + node.id.replace("session_", "");
        }

        ctx.font = `bold ${r * 0.9}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        ctx.fillText(innerText, nodeX, nodeY);
      }

      // Draw Text Label external
      const label = node.name;
      const fontSize = Math.max(LABEL_FONT_MIN / globalScale, 4);
      ctx.font = `600 ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Text Shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
      ctx.shadowBlur = 4;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(label, nodeX, nodeY + r + fontSize);
      ctx.shadowBlur = 0; // reset
    },
    [hoveredNodeId, hoverPaintTick],
  );

  /** Cor da aresta = tipo do nó de origem (quem referencia o outro no texto). */
  const linkColor = useCallback(
    (link: object) => {
      const l = link as {
        source: GraphNode | string;
        target: GraphNode | string;
      };
      const src =
        typeof l.source === "object" && l.source !== null
          ? (l.source as GraphNode)
          : nodeById.get(String(l.source));
      const hex = (src?.group && GROUP_COLORS[src.group]) || "#a1a1aa";
      return hexToRgba(hex, 0.58);
    },
    [nodeById],
  );

  const linkCanvasObject = useCallback(
    (link: object, ctx: CanvasRenderingContext2D, globalScale: number) => {
      void hoverPaintTick;
      const l = link as {
        source: GraphNode | string;
        target: GraphNode | string;
      };
      const sn =
        typeof l.source === "object" && l.source !== null
          ? (l.source as GraphNode)
          : nodeById.get(String(l.source));
      const tn =
        typeof l.target === "object" && l.target !== null
          ? (l.target as GraphNode)
          : nodeById.get(String(l.target));
      if (
        !sn ||
        !tn ||
        sn.x === undefined ||
        sn.y === undefined ||
        tn.x === undefined ||
        tn.y === undefined
      ) {
        return;
      }
      const tSec = performance.now() / 1000;
      const f1 = mindMapFloatOffset(sn.id, tSec);
      const f2 = mindMapFloatOffset(tn.id, tSec);
      const x1 = sn.x + f1.ox;
      const y1 = sn.y + f1.oy;
      const x2 = tn.x + f2.ox;
      const y2 = tn.y + f2.oy;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = linkColor(link);
      ctx.lineWidth = Math.max(
        1.15 * NODE_MAP_SCALE,
        (2.2 * NODE_MAP_SCALE) / globalScale,
      );
      ctx.lineCap = "round";
      ctx.globalAlpha = 0.92;
      ctx.stroke();
      ctx.restore();
    },
    [linkColor, nodeById, hoverPaintTick],
  );

  if (!data) return null;

  return (
    <div
      ref={containerRef}
      className="relative h-[75vh] w-full overflow-hidden rounded-2xl border border-violet-950/40 bg-[#06040f] shadow-[0_0_0_1px_rgba(139,92,246,0.12),0_25px_80px_-20px_rgba(15,5,40,0.85)]"
    >
      <MindMapUniverseBackdrop
        width={dimensions.width}
        height={dimensions.height}
      />
      <div className="relative z-1 h-full min-h-0 w-full">
        <ForceGraph2D
          ref={graphRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={data as unknown as { nodes: object[]; links: object[] }}
          backgroundColor="transparent"
          nodeLabel={() => ""}
          nodeCanvasObject={
            nodeCanvasObject as unknown as (
              node: object,
              ctx: CanvasRenderingContext2D,
              globalScale: number,
            ) => void
          }
          nodePointerAreaPaint={
            nodePointerAreaPaint as unknown as (
              node: object,
              color: string,
              ctx: CanvasRenderingContext2D,
              globalScale: number,
            ) => void
          }
          linkPointerAreaPaint={
            linkPointerAreaPaint as unknown as (
              link: object,
              color: string,
              ctx: CanvasRenderingContext2D,
              globalScale: number,
            ) => void
          }
          linkCanvasObject={
            linkCanvasObject as unknown as (
              link: object,
              ctx: CanvasRenderingContext2D,
              globalScale: number,
            ) => void
          }
          linkCanvasObjectMode="replace"
          onNodeClick={(node, ev) => handleNodeClick(node as GraphNode, ev)}
          onBackgroundClick={handleBackgroundClick}
          showPointerCursor={false}
          enableNodeDrag={false} // Evitar que micro-arrastos cancelem o evento de clique
          autoPauseRedraw={false}
          linkColor={linkColor}
          linkWidth={2 * NODE_MAP_SCALE}
          d3VelocityDecay={0.35}
          d3AlphaDecay={0.015}
          warmupTicks={120}
          onEngineStop={() => {
            if (graphRef.current && !zoomedRef.current) {
              // Padding maior = zoom mais afastado, leitura mais confortável.
              graphRef.current.zoomToFit(800, 120 * NODE_MAP_SCALE);
              zoomedRef.current = true;
            }
          }}
        />
      </div>
      {nodeTooltip ? (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-80 max-w-[min(90vw,20rem)] rounded-lg border border-violet-500/25 bg-zinc-950/92 px-3 py-2 text-sm text-zinc-100 shadow-lg shadow-violet-950/40 backdrop-blur-md"
          style={{
            left: nodeTooltip.x + 14,
            top: nodeTooltip.y + 14,
          }}
        >
          <div className="font-semibold leading-snug text-zinc-50">
            {nodeTooltip.name}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-400">
            <span
              className="inline-block size-2 shrink-0 rounded-full"
              style={{
                backgroundColor: GROUP_COLORS[nodeTooltip.group] ?? "#71717a",
              }}
              aria-hidden
            />
            <span>{nodeTooltip.group}</span>
          </div>
        </div>
      ) : null}
      <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-col gap-2 rounded-xl border border-violet-500/20 bg-zinc-950/75 p-4 shadow-lg shadow-black/30 backdrop-blur-md">
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-violet-200/80">
          Legenda
        </h3>
        {Object.entries(GROUP_COLORS).map(([group, color]) => (
          <div key={group} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.25)]"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm font-medium text-zinc-200">{group}</span>
          </div>
        ))}
      </div>
      <MindMapNodeModal node={detailNode} onClose={() => setDetailNode(null)} />
    </div>
  );
}
