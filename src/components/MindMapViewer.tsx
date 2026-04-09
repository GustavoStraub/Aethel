"use client";

import {
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import {
  generateMindMapData,
  MindMapNode,
  MindMapGraphData,
  MindMapGroup,
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

const ALL_GROUPS = Object.keys(GROUP_COLORS) as MindMapGroup[];

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
type Particle = {
  srcId: string;
  tgtId: string;
  progress: number;
  speed: number;
};

const NODE_MAP_SCALE = 1.25;
const BASE_NODE_RADIUS = 25;
const LABEL_FONT_MIN = 10 * NODE_MAP_SCALE;
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

function floatPhaseFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  }
  return ((h & 0xffff) / 0xffff) * Math.PI * 2;
}

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
    for (const n of data.nodes as GraphNode[]) m.set(n.id, n);
    return m;
  }, [data.nodes]);

  // Adjacency map: nodeId -> Set of connected nodeIds
  const adjacencyMap = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const n of data.nodes) {
      m.set(n.id, new Set());
    }
    for (const l of data.links) {
      const src =
        typeof l.source === "string" ? l.source : (l.source as GraphNode).id;
      const tgt =
        typeof l.target === "string" ? l.target : (l.target as GraphNode).id;
      m.get(src)?.add(tgt);
      m.get(tgt)?.add(src);
    }
    return m;
  }, [data]);

  // Connection count per node
  const connectionCount = useMemo(() => {
    const m = new Map<string, number>();
    for (const [id, neighbors] of adjacencyMap) {
      m.set(id, neighbors.size);
    }
    return m;
  }, [adjacencyMap]);

  const [detailNode, setDetailNode] = useState<MindMapNode | null>(null);
  const [legendExpanded, setLegendExpanded] = useState(true);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const hoverBoostRef = useRef(1);
  const [hoverPaintTick, setHoverPaintTick] = useState(0);

  // Active filter groups (empty = show all)
  const [activeFilters, setActiveFilters] = useState<Set<MindMapGroup>>(
    new Set(),
  );

  const toggleFilter = useCallback((group: MindMapGroup) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  }, []);

  // Particle system for animated edges
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const particles: Particle[] = [];
    for (const l of data.links) {
      const src =
        typeof l.source === "string" ? l.source : (l.source as GraphNode).id;
      const tgt =
        typeof l.target === "string" ? l.target : (l.target as GraphNode).id;
      const count = Math.random() < 0.4 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        particles.push({
          srcId: src,
          tgtId: tgt,
          progress: Math.random(),
          speed: 0.0018 + Math.random() * 0.0022,
        });
      }
    }
    particlesRef.current = particles;
  }, [data.links]);

  // Advance particles in a separate RAF loop so linkCanvasObject only reads
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      for (const p of particlesRef.current) {
        p.progress += p.speed;
        if (p.progress > 1) p.progress -= 1;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

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

  const [nodeTooltip, setNodeTooltip] = useState<{
    x: number;
    y: number;
    name: string;
    group: string;
    connections: number;
  } | null>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setDimensions({ width, height });
    });
    ro.observe(el);
    setDimensions({ width: el.clientWidth, height: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!graphRef.current || dimensions.width <= 0) return;
    graphRef.current.d3Force("charge")?.strength(-3200);
    graphRef.current.d3Force("link")?.distance(100);
    graphRef.current.d3ReheatSimulation();
  }, [data, dimensions.width]);

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
      // Animate zoom to node before opening modal
      if (
        graphRef.current &&
        picked.x !== undefined &&
        picked.y !== undefined
      ) {
        graphRef.current.centerAt(picked.x, picked.y, 600);
        graphRef.current.zoom(2.8, 600);
      }
      setTimeout(() => setDetailNode(picked), 300);
    },
    [pickNodeFromClientPointer],
  );

  const handleBackgroundClick = useCallback(
    (ev: MouseEvent) => {
      const picked = pickNodeFromClientPointer(ev);
      if (picked) {
        if (
          graphRef.current &&
          picked.x !== undefined &&
          picked.y !== undefined
        ) {
          graphRef.current.centerAt(picked.x, picked.y, 600);
          graphRef.current.zoom(2.8, 600);
        }
        setTimeout(() => setDetailNode(picked), 300);
      } else {
        setDetailNode(null);
      }
    },
    [pickNodeFromClientPointer],
  );

  useEffect(() => {
    const root = containerRef.current;
    if (!root || dimensions.width <= 0) return;

    const onPointerMove = (ev: Pick<PointerEvent, "clientX" | "clientY">) => {
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
          connections: connectionCount.get(picked.id) ?? 0,
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
  }, [dimensions.width, pickNodeFromClientPointer, connectionCount]);

  // Determine if a node is "dimmed" based on active filters
  const isNodeDimmed = useCallback(
    (node: GraphNode): boolean => {
      if (activeFilters.size === 0) return false;
      return !activeFilters.has(node.group as MindMapGroup);
    },
    [activeFilters],
  );

  // Whether a node is "highlighted" (connected to hovered node)
  const isNodeHighlighted = useCallback(
    (node: GraphNode): boolean => {
      if (!hoveredNodeId) return false;
      if (node.id === hoveredNodeId) return true;
      return adjacencyMap.get(hoveredNodeId)?.has(node.id) ?? false;
    },
    [hoveredNodeId, adjacencyMap],
  );

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
    // Disable link click area so links don't steal hover from nodes
  }, []);

  const nodeCanvasObject = useCallback(
    (node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
      void hoverPaintTick;
      const r = effectiveNodeRadius(node, hoveredNodeId, hoverBoostRef.current);
      const tSec = performance.now() / 1000;
      const { ox, oy } = mindMapFloatOffset(node.id, tSec);
      const nodeX = (node.x ?? 0) + ox;
      const nodeY = (node.y ?? 0) + oy;
      const color = GROUP_COLORS[node.group] || "#71717a";

      const dimmed = isNodeDimmed(node);
      const highlighted = isNodeHighlighted(node);
      // If hovering and not highlighted, dim the node
      const darken = hoveredNodeId !== null && !highlighted;

      const globalAlpha = dimmed ? 0.18 : darken ? 0.3 : 1;
      ctx.save();
      ctx.globalAlpha = globalAlpha;

      // --- Glow pulsante ---
      const isHovered = node.id === hoveredNodeId;
      if (!dimmed && !darken) {
        // Outer glow: pulses continuously
        const glowPulse =
          0.45 + 0.35 * Math.sin(tSec * 2.1 + floatPhaseFromId(node.id));
        const glowRadius = r * (isHovered ? 2.4 : 1.75);
        const gradient = ctx.createRadialGradient(
          nodeX,
          nodeY,
          r * 0.5,
          nodeX,
          nodeY,
          glowRadius,
        );
        gradient.addColorStop(
          0,
          hexToRgba(color, isHovered ? glowPulse * 0.72 : glowPulse * 0.42),
        );
        gradient.addColorStop(1, hexToRgba(color, 0));
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, glowRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // --- Border ring ---
      ctx.beginPath();
      ctx.arc(nodeX, nodeY, r + 1.5, 0, 2 * Math.PI, false);
      ctx.fillStyle = color;
      ctx.fill();

      // --- Image or fallback ---
      if (node.image) {
        const src = node.image;
        if (!imgCache.has(src)) {
          const img = new Image();
          img.src = src;
          imgCache.set(src, img);
        }
        const img = imgCache.get(src);
        if (img && img.complete && img.naturalWidth !== 0) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(nodeX, nodeY, r, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();
          const ratio = Math.max((r * 2) / img.width, (r * 2) / img.height);
          const nw = img.width * ratio;
          const nh = img.height * ratio;
          ctx.drawImage(img, nodeX - nw / 2, nodeY - r, nw, nh);
          ctx.restore();
        } else {
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
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, r, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
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

      // --- Text label ---
      const label = node.name;
      const fontSize = Math.max(LABEL_FONT_MIN / globalScale, 4);
      ctx.font = `600 ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
      ctx.shadowBlur = 4;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(label, nodeX, nodeY + r + fontSize);
      ctx.shadowBlur = 0;

      ctx.restore();
    },
    [hoveredNodeId, hoverPaintTick, isNodeDimmed, isNodeHighlighted],
  );

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
      )
        return;

      const tSec = performance.now() / 1000;
      const f1 = mindMapFloatOffset(sn.id, tSec);
      const f2 = mindMapFloatOffset(tn.id, tSec);
      const x1 = sn.x + f1.ox;
      const y1 = sn.y + f1.oy;
      const x2 = tn.x + f2.ox;
      const y2 = tn.y + f2.oy;

      const snDimmed = isNodeDimmed(sn) || isNodeDimmed(tn);
      const snHighlighted = isNodeHighlighted(sn) && isNodeHighlighted(tn);
      const darken = hoveredNodeId !== null && !snHighlighted;

      const baseAlpha = snDimmed ? 0.06 : darken ? 0.12 : 0.62;
      const hex = (sn.group && GROUP_COLORS[sn.group]) || "#a1a1aa";

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = hexToRgba(hex, baseAlpha);
      ctx.lineWidth = Math.max(
        1.15 * NODE_MAP_SCALE,
        (2.2 * NODE_MAP_SCALE) / globalScale,
      );
      ctx.lineCap = "round";
      ctx.globalAlpha = 0.92;
      ctx.stroke();
      ctx.restore();

      // --- Particles traveling along the link ---
      if (!snDimmed && !darken) {
        const particles = particlesRef.current;
        const isHoverLink = hoveredNodeId === sn.id || hoveredNodeId === tn.id;

        for (const p of particles) {
          const matchFwd = p.srcId === sn.id && p.tgtId === tn.id;
          const matchBwd = p.srcId === tn.id && p.tgtId === sn.id;
          if (!matchFwd && !matchBwd) continue;

          // On hover: force direction away from the hovered node.
          // The particle always travels from the hovered end toward the other end.
          let ax1 = x1,
            ay1 = y1,
            ax2 = x2,
            ay2 = y2;
          let prog = p.progress;
          if (isHoverLink && hoveredNodeId !== null) {
            const hoveredIsSrc = hoveredNodeId === sn.id;
            // Flip so origin is always the hovered node
            if (!hoveredIsSrc) {
              ax1 = x2;
              ay1 = y2;
              ax2 = x1;
              ay2 = y1;
              prog = 1 - prog;
            }
          } else if (matchBwd) {
            // Non-hover: keep consistent direction by always going srcId→tgtId
            ax1 = x2;
            ay1 = y2;
            ax2 = x1;
            ay2 = y1;
            prog = 1 - prog;
          }

          const px = ax1 + (ax2 - ax1) * prog;
          const py = ay1 + (ay2 - ay1) * prog;

          const particleR = Math.max(
            isHoverLink ? 2.2 : 1.5,
            (isHoverLink ? 3.2 : 2.5) / globalScale,
          );
          const pAlpha = isHoverLink ? 1.0 : 0.55;

          // Glow trail behind particle
          const trailLen = isHoverLink ? 0.1 : 0.06;
          const t0 = Math.max(0, prog - trailLen);
          const tx0 = ax1 + (ax2 - ax1) * t0;
          const ty0 = ay1 + (ay2 - ay1) * t0;
          const trailGrad = ctx.createLinearGradient(tx0, ty0, px, py);
          trailGrad.addColorStop(0, hexToRgba(hex, 0));
          trailGrad.addColorStop(1, hexToRgba(hex, pAlpha * 0.65));
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(tx0, ty0);
          ctx.lineTo(px, py);
          ctx.strokeStyle = trailGrad;
          ctx.lineWidth = particleR * 1.4;
          ctx.lineCap = "round";
          ctx.stroke();
          ctx.restore();

          // Particle dot
          ctx.save();
          ctx.beginPath();
          ctx.arc(px, py, particleR, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(hex, pAlpha);
          ctx.shadowColor = hex;
          ctx.shadowBlur = particleR * (isHoverLink ? 6 : 4);
          ctx.fill();
          ctx.restore();
        }
      }
    },
    [nodeById, hoverPaintTick, isNodeDimmed, isNodeHighlighted, hoveredNodeId],
  );

  if (!data) return null;

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-[#06040f]"
    >
      <MindMapUniverseBackdrop />
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
          enableNodeDrag={false}
          autoPauseRedraw={false}
          linkColor={linkColor}
          linkWidth={2 * NODE_MAP_SCALE}
          d3VelocityDecay={0.35}
          d3AlphaDecay={0.015}
          warmupTicks={120}
          onEngineStop={() => {
            if (graphRef.current && !zoomedRef.current) {
              graphRef.current.zoomToFit(800, 120 * NODE_MAP_SCALE);
              zoomedRef.current = true;
            }
          }}
        />
      </div>

      {/* Tooltip */}
      {nodeTooltip ? (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-80 max-w-[min(90vw,20rem)] rounded-lg border border-violet-500/25 bg-zinc-950/92 px-3 py-2 text-sm text-zinc-100 shadow-lg shadow-violet-950/40 backdrop-blur-md"
          style={{ left: nodeTooltip.x + 14, top: nodeTooltip.y + 14 }}
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
            {nodeTooltip.connections > 0 && (
              <>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-400">
                  {nodeTooltip.connections}{" "}
                  {nodeTooltip.connections === 1 ? "conexão" : "conexões"}
                </span>
              </>
            )}
          </div>
        </div>
      ) : null}

      {/* Legend with filter buttons */}
      <div className="pointer-events-auto absolute left-4 top-4 z-10 min-w-44 rounded-xl border border-violet-500/20 bg-zinc-950/75 shadow-lg shadow-black/30 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setLegendExpanded((v) => !v)}
          className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left transition hover:bg-violet-950/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60"
          aria-expanded={legendExpanded}
          aria-controls="mind-map-legend-items"
          aria-label={legendExpanded ? "Recolher legenda" : "Expandir legenda"}
          id="mind-map-legend-toggle"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider text-violet-200/80">
            Legenda
          </h3>
          <span
            className={`text-violet-300/90 transition-transform duration-200 ${legendExpanded ? "rotate-180" : ""}`}
            aria-hidden
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </button>
        <div
          id="mind-map-legend-items"
          role="region"
          aria-labelledby="mind-map-legend-toggle"
          hidden={!legendExpanded}
          className="flex flex-col gap-1.5 border-t border-violet-500/15 px-3 pb-3 pt-2"
        >
          {ALL_GROUPS.map((group) => {
            const color = GROUP_COLORS[group];
            const isActive = activeFilters.has(group);
            const hasFilter = activeFilters.size > 0;
            return (
              <button
                key={group}
                type="button"
                onClick={() => toggleFilter(group)}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm font-medium transition
                  ${isActive ? "bg-zinc-800/80 text-zinc-100" : hasFilter ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-200 hover:bg-zinc-800/50"}
                `}
                title={
                  isActive
                    ? `Remover filtro: ${group}`
                    : `Filtrar por: ${group}`
                }
              >
                <span
                  className={`h-3 w-3 shrink-0 rounded-full transition-all ${isActive ? "scale-125 shadow-[0_0_8px_2px_currentColor]" : "shadow-[0_0_6px_rgba(255,255,255,0.2)]"}`}
                  style={{
                    backgroundColor: color,
                    color: color,
                  }}
                />
                <span>{group}</span>
                {isActive && (
                  <span className="ml-auto text-xs text-zinc-400">✓</span>
                )}
              </button>
            );
          })}
          {activeFilters.size > 0 && (
            <button
              type="button"
              onClick={() => setActiveFilters(new Set())}
              className="mt-0.5 rounded-md px-2 py-1 text-xs text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      <MindMapNodeModal
        node={detailNode}
        onClose={() => setDetailNode(null)}
        adjacencyMap={adjacencyMap}
        nodeById={nodeById}
      />
    </div>
  );
}
