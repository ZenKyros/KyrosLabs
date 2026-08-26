/**
 * FileSystemGraph — a force-directed graph visualization for the filesystem-based knowledge graph.
 * Shows root, folders, and notes with structural and link edges.
 */

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Maximize2 } from "lucide-react";
import type { FileSystemGraphData, FileSystemGraphNode, FileSystemGraphEdge } from "../engine/types";

interface SimNode {
  id: string;
  label: string;
  type: "root" | "folder" | "note";
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx: number | null;
  fy: number | null;
  r: number;
  parentId?: string;
}

const NODE_COLORS = {
  root: "var(--accent)",
  folder: "#3b82f6",
  note: "#22c55e",
};

const NODE_RADIUS = {
  root: 14,
  folder: 9,
  note: 6,
};

interface Props {
  data: FileSystemGraphData;
  focus?: string | null;
  height?: number;
  className?: string;
}

export default function FileSystemGraph({ data, focus = null, height = 560, className = "" }: Props) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nodesRef = useRef<SimNode[]>([]);
  const alphaRef = useRef(1);
  const rafRef = useRef(0);
  const dragRef = useRef<{ id: string; moved: number } | { pan: true; sx: number; sy: number; ox: number; oy: number; moved: number } | null>(null);
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const viewRef = useRef(view);
  viewRef.current = view;
  const [hover, setHover] = useState<string | null>(null);
  const [signalPhase, setSignalPhase] = useState(0);
  const [, setFrame] = useState(0);
  const [size, setSize] = useState({ w: 800, h: height });
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    if (reduced) return;
    let animationFrame = 0;
    const animateSignals = (time: number) => {
      setSignalPhase(time * 0.00028);
      animationFrame = requestAnimationFrame(animateSignals);
    };
    animationFrame = requestAnimationFrame(animateSignals);
    return () => cancelAnimationFrame(animationFrame);
  }, [reduced]);

  const adjacency = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const n of data.nodes) m.set(n.id, new Set());
    for (const e of data.edges) {
      m.get(e.source)?.add(e.target);
      m.get(e.target)?.add(e.source);
    }
    return m;
  }, [data]);

  /* ————— initialize simulation when data changes ————— */
  useEffect(() => {
    const el = containerRef.current;
    const w = el?.clientWidth ?? 800;
    const h = height;
    setSize({ w, h });

    const prev = new Map(nodesRef.current.map((n) => [n.id, n]));
    nodesRef.current = data.nodes.map((node) => {
      const existing = prev.get(node.id);

      // Position based on type and hierarchy
      let startX: number, startY: number;

      if (node.type === "root") {
        startX = w / 2;
        startY = h / 2;
      } else if (node.type === "folder") {
        // Position folders around root in a radial pattern
        const parent = data.nodes.find(n => n.id === node.parentId);
        if (parent) {
          const angle = Math.random() * Math.PI * 2;
          const distance = 120 + Math.random() * 80;
          startX = w / 2 + Math.cos(angle) * distance;
          startY = h / 2 + Math.sin(angle) * distance;
        } else {
          startX = w / 2 + (Math.random() - 0.5) * 200;
          startY = h / 2 + (Math.random() - 0.5) * 200;
        }
      } else {
        // Notes near their parent folder
        const parent = data.nodes.find(n => n.id === node.parentId);
        if (parent) {
          const angle = Math.random() * Math.PI * 2;
          const distance = 60 + Math.random() * 40;
          startX = w / 2 + Math.cos(angle) * distance;
          startY = h / 2 + Math.sin(angle) * distance;
        } else {
          startX = w / 2 + (Math.random() - 0.5) * 300;
          startY = h / 2 + (Math.random() - 0.5) * 300;
        }
      }

      return {
        id: node.id,
        label: node.label,
        type: node.type,
        x: existing?.x ?? startX,
        y: existing?.y ?? startY,
        vx: 0,
        vy: 0,
        fx: null,
        fy: null,
        r: NODE_RADIUS[node.type],
        parentId: node.parentId,
      };
    });
    alphaRef.current = 1;

    const step = () => {
      const nodes = nodesRef.current;
      const byId = new Map(nodes.map((n) => [n.id, n]));
      const alpha = alphaRef.current;

      // pairwise repulsion
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          let d2 = dx * dx + dy * dy;
          if (d2 < 0.01) {
            dx = Math.random() - 0.5;
            dy = Math.random() - 0.5;
            d2 = dx * dx + dy * dy;
          }
          const d = Math.sqrt(d2);
          const f = (2400 * alpha) / d2;
          const fx = (dx / d) * f;
          const fy = (dy / d) * f;
          a.vx -= fx;
          a.vy -= fy;
          b.vx += fx;
          b.vy += fy;
        }
      }

      // springs for edges
      for (const e of data.edges) {
        const a = byId.get(e.source);
        const b = byId.get(e.target);
        if (!a || !b) continue;

        // Different rest lengths for different edge types
        const rest = e.type === "structure" ? 100 : 140;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.max(1, Math.sqrt(dx * dx + dy * dy));
        const f = (d - rest) * 0.018 * alpha;
        const fx = (dx / d) * f;
        const fy = (dy / d) * f;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      }

      // gravity to center + parent attraction
      for (const n of nodes) {
        // Weak gravity to center
        n.vx += (w / 2 - n.x) * 0.003 * alpha;
        n.vy += (h / 2 - n.y) * 0.003 * alpha;

        // Attraction to parent (for structure)
        if (n.parentId) {
          const parent = byId.get(n.parentId);
          if (parent) {
            const dx = parent.x - n.x;
            const dy = parent.y - n.y;
            n.vx += dx * 0.015 * alpha;
            n.vy += dy * 0.015 * alpha;
          }
        }

        if (n.fx !== null && n.fy !== null) {
          n.x = n.fx;
          n.y = n.fy;
          n.vx = 0;
          n.vy = 0;
          continue;
        }
        n.vx *= 0.85;
        n.vy *= 0.85;
        n.x += n.vx;
        n.y += n.vy;

        // Keep every node inside the graph viewport as the simulation settles.
        const padding = Math.max(18, n.r + 8);
        n.x = Math.min(Math.max(n.x, padding), Math.max(padding, w - padding));
        n.y = Math.min(Math.max(n.y, padding), Math.max(padding, h - padding));
      }
      alphaRef.current *= 0.99;
    };

    if (reduced) {
      for (let i = 0; i < 340; i++) step();
      alphaRef.current = 0;
      setFrame((f) => f + 1);
    } else {
      cancelAnimationFrame(rafRef.current);
      const loop = () => {
        if (alphaRef.current > 0.012 || dragRef.current) {
          step();
          step();
          setFrame((f) => f + 1);
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    }

    const ro = new ResizeObserver(() => {
      const cw = el?.clientWidth ?? 800;
      setSize((s) => (s.w === cw ? s : { w: cw, h }));
    });
    if (el) ro.observe(el);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [data, height, reduced]);

  /* ————— wheel zoom (non-passive) ————— */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      setView((v) => {
        const k = Math.min(3.2, Math.max(0.35, v.k * Math.exp(-e.deltaY * 0.0012)));
        return { k, x: mx - ((mx - v.x) / v.k) * k, y: my - ((my - v.y) / v.k) * k };
      });
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, []);

  const fit = useCallback(() => {
    const nodes = nodesRef.current;
    if (!nodes.length) return;
    const xs = nodes.map((n) => n.x);
    const ys = nodes.map((n) => n.y);
    const minX = Math.min(...xs) - 60;
    const maxX = Math.max(...xs) + 60;
    const minY = Math.min(...ys) - 60;
    const maxY = Math.max(...ys) + 60;
    const k = Math.min(size.w / (maxX - minX), size.h / (maxY - minY), 1.6);
    setView({
      k,
      x: size.w / 2 - ((minX + maxX) / 2) * k,
      y: size.h / 2 - ((minY + maxY) / 2) * k,
    });
  }, [size]);

  // initial fit once layout settles
  const didFit = useRef(false);
  useEffect(() => {
    if (didFit.current) return;
    const t = setTimeout(() => {
      fit();
      didFit.current = true;
    }, reduced ? 30 : 900);
    return () => clearTimeout(t);
  }, [fit, reduced]);

  /* ————— pointer interactions ————— */
  const toWorld = (clientX: number, clientY: number) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const v = viewRef.current;
    return { x: (clientX - rect.left - v.x) / v.k, y: (clientY - rect.top - v.y) / v.k };
  };

  const onNodeDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = { id, moved: 0 };
    const node = nodesRef.current.find((n) => n.id === id);
    if (node) {
      node.fx = node.x;
      node.fy = node.y;
    }
    alphaRef.current = Math.max(alphaRef.current, 0.25);
  };

  const onBgDown = (e: React.PointerEvent) => {
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    dragRef.current = { pan: true, sx: e.clientX, sy: e.clientY, ox: viewRef.current.x, oy: viewRef.current.y, moved: 0 };
  };

  const onMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    if ("id" in d) {
      const p = toWorld(e.clientX, e.clientY);
      const node = nodesRef.current.find((n) => n.id === d.id);
      if (node) {
        node.fx = p.x;
        node.fy = p.y;
        d.moved += 1;
        alphaRef.current = Math.max(alphaRef.current, 0.2);
        if (reduced) setFrame((f) => f + 1);
      }
    } else if (d.pan) {
      const dx = e.clientX - d.sx;
      const dy = e.clientY - d.sy;
      d.moved = Math.max(d.moved, Math.abs(dx) + Math.abs(dy));
      setView((v) => ({ ...v, x: d.ox + dx, y: d.oy + dy }));
    }
  };

  const onUp = (e: React.PointerEvent) => {
    const d = dragRef.current;
    dragRef.current = null;
    if (d && "id" in d) {
      const node = nodesRef.current.find((n) => n.id === d.id);
      if (node) {
        node.fx = null;
        node.fy = null;
      }
      if (d.moved < 6 && !(e as any).button) {
        // Navigate to note if it's a note node — the vault indexes notes by
        // lowercased file basename, so derive the slug from the basename.
        const nodeData = data.nodes.find((n) => n.id === d.id);
        if (nodeData && nodeData.type === "note") {
          const base = nodeData.path.split("/").pop() ?? "";
          const slug = base.replace(/\.md$/i, "").trim().toLowerCase();
          if (slug) navigate(`/note/${slug}`);
        }
      }
      alphaRef.current = Math.max(alphaRef.current, 0.2);
    }
  };

  const hoveredNeighbors = hover ? adjacency.get(hover) ?? new Set<string>() : null;

  const visible = useCallback(
    (id: string) => {
      if (focus && adjacency.get(focus)?.has(id)) return true;
      if (focus === id) return true;
      if (hover && (hover === id || hoveredNeighbors?.has(id))) return true;
      if (!focus && !hover) return true;
      return false;
    },
    [focus, hover, hoveredNeighbors, adjacency]
  );

  const nodes = nodesRef.current;
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes, nodes.length]);
  const hoveredNode = hover ? byId.get(hover) : null;

  return (
    <div ref={containerRef} className={`relative overflow-hidden rounded-lg border border-line bg-bg2/60 ${className}`} style={{ height }}>
      <svg
        ref={svgRef}
        className="graph-surface w-full h-full block"
        onPointerDown={onBgDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        role="img"
        aria-label="Filesystem knowledge graph"
      >
        <defs>
          <filter id="filesystem-node-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        </defs>
        <g transform={`translate(${view.x},${view.y}) scale(${view.k})`}>
          {/* Edges */}
          {data.edges.map((e, i) => {
            const a = byId.get(e.source);
            const b = byId.get(e.target);
            if (!a || !b) return null;

            const isStructure = e.type === "structure";
            const active =
              hover && (e.source === hover || e.target === hover)
                ? 1
                : visible(e.source) && visible(e.target)
                ? 1
                : 0.12;

            return (
              <g key={i}>
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={isStructure ? "var(--muted)" : "var(--accent)"}
                  strokeWidth={(hover && (e.source === hover || e.target === hover) ? 1.7 : 1.2) / Math.max(view.k, 0.7)}
                  strokeDasharray={isStructure ? undefined : "3 3"}
                  opacity={(isStructure ? 0.25 : 0.5) * active}
                />
                {!reduced && active > 0.12 && (
                  <>
                    {[0, 1].map((pulse) => (
                      (() => {
                        const progress = (signalPhase * (isStructure ? 0.72 : 1) + i * 0.17 + pulse * 0.5) % 1;
                        return (
                          <circle
                            key={pulse}
                            cx={a.x + (b.x - a.x) * progress}
                            cy={a.y + (b.y - a.y) * progress}
                            r={(pulse === 0 ? 2.4 : 1.6) / Math.max(view.k, 0.7)}
                            fill={isStructure ? "var(--muted)" : "var(--accent)"}
                            opacity={(isStructure ? 0.65 : 0.95) * active}
                          />
                        );
                      })()
                    ))}
                  </>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((n, index) => {
            const dim = !visible(n.id);
            const isFocus = focus === n.id;
            const isHover = hover === n.id;
            const neighbor = hoveredNeighbors?.has(n.id);
            const showLabel = isHover || isFocus || neighbor || n.r >= 10 || view.k > 1.05;
            const shine = reduced ? 0.35 : (Math.sin(signalPhase * 2.4 + index * 0.8) + 1) / 2;

            return (
              <g
                key={n.id}
                className="graph-node"
                transform={`translate(${n.x},${n.y})`}
                opacity={dim ? 0.13 : 1}
                onPointerDown={(e) => onNodeDown(e, n.id)}
                onPointerEnter={() => setHover(n.id)}
                onPointerLeave={() => setHover((h) => (h === n.id ? null : h))}
              >
                <circle
                  r={n.r + 3 + shine * 4}
                  fill={NODE_COLORS[n.type]}
                  opacity={(0.12 + shine * 0.2) * (dim ? 0.35 : 1)}
                  filter="url(#filesystem-node-glow)"
                  pointerEvents="none"
                />
                {(isFocus || isHover) && (
                  <circle r={n.r + 7} fill="none" stroke={NODE_COLORS[n.type]} strokeOpacity={0.35} strokeWidth={1} />
                )}
                <circle
                  r={n.r}
                  fill={NODE_COLORS[n.type]}
                  fillOpacity={isFocus || isHover ? 1 : 0.85}
                  stroke="var(--bg)"
                  strokeWidth={1.6 / Math.max(view.k, 0.6)}
                />
                {showLabel && (
                  <text
                    y={n.r + 13}
                    textAnchor="middle"
                    fontSize={10.5 / Math.max(view.k, 0.75)}
                    fontFamily="IBM Plex Mono, monospace"
                    fill={isHover || isFocus ? "var(--ink)" : "var(--muted)"}
                    style={{ paintOrder: "stroke", stroke: "var(--bg)", strokeWidth: 3, pointerEvents: "none" }}
                  >
                    {n.label.length > 26 ? n.label.slice(0, 25) + "…" : n.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5">
        {[
          { icon: <Plus size={13} />, fn: () => setView((v) => ({ ...v, k: Math.min(3.2, v.k * 1.25) })), label: "Zoom in" },
          { icon: <Minus size={13} />, fn: () => setView((v) => ({ ...v, k: Math.max(0.35, v.k / 1.25) })), label: "Zoom out" },
          { icon: <Maximize2 size={13} />, fn: fit, label: "Fit" },
        ].map((b, i) => (
          <button
            key={i}
            onClick={b.fn}
            aria-label={b.label}
            className="p-1.5 bg-panel border border-line rounded-md text-muted hover:text-ink hover:border-faint transition-colors cursor-pointer"
          >
            {b.icon}
          </button>
        ))}
      </div>

      {/* legend */}
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-x-4 gap-y-1 bg-panel/90 border border-line rounded-md px-3 py-2">
        <span className="flex items-center gap-1.5 font-mono2 text-[9.5px] tracking-[0.14em] uppercase text-muted">
          <span className="w-[7px] h-[7px] rounded-full" style={{ background: NODE_COLORS.root }} />
          Root
        </span>
        <span className="flex items-center gap-1.5 font-mono2 text-[9.5px] tracking-[0.14em] uppercase text-muted">
          <span className="w-[7px] h-[7px] rounded-full" style={{ background: NODE_COLORS.folder }} />
          Folder
        </span>
        <span className="flex items-center gap-1.5 font-mono2 text-[9.5px] tracking-[0.14em] uppercase text-muted">
          <span className="w-[7px] h-[7px] rounded-full" style={{ background: NODE_COLORS.note }} />
          Note
        </span>
      </div>

      {/* hover card */}
      {hoveredNode && (
        <div
          className="absolute pointer-events-none bg-panel border border-line rounded-md shadow-[var(--shadow)] px-3 py-2.5 max-w-[240px]"
          style={{
            left: Math.min(size.w - 250, Math.max(10, (hoveredNode.x * view.k) + view.x + 15)),
            top: Math.min(size.h - 100, Math.max(10, (hoveredNode.y * view.k) + view.y - 10)),
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="w-[6px] h-[6px] rotate-45" style={{ background: NODE_COLORS[hoveredNode.type] }} />
            <span className="font-mono2 text-[9.5px] uppercase tracking-[0.14em] text-faint">{hoveredNode.type}</span>
          </div>
          <div className="font-display font-medium text-[14.5px] leading-tight">{hoveredNode.label}</div>
        </div>
      )}
    </div>
  );
}
