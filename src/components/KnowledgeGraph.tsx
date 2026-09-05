/**
 * KnowledgeGraph — a custom force-directed constellation of the vault.
 * SVG + hand-rolled physics: pan, zoom, drag, hover-neighborhood,
 * focus mode, type legend, reduced-motion static layout.
 */

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Maximize2 } from "lucide-react";
import type { GraphData } from "../engine/graph";
import type { NoteType, EdgeKind } from "../engine/types";
import { categoryLabel } from "../engine/vault";

interface SimNode {
  slug: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx: number | null;
  fy: number | null;
  degree: number;
  type: NoteType;
  category: string;
  folderGroup: string;
  color: string;
  title: string;
  r: number;
}

function folderGroup(note: { category: string; subpath: string[] }): string {
  return note.subpath[note.subpath.length - 1] ?? note.category;
}

function folderColor(group: string): string {
  let hash = 0;
  for (let i = 0; i < group.length; i++) hash = (hash * 31 + group.charCodeAt(i)) | 0;
  const hue = Math.abs(hash * 137.508) % 360;
  return `hsl(${hue.toFixed(1)} 68% 52%)`;
}

const EDGE_STYLE: Record<EdgeKind, { stroke: string; dash?: string; width: number; opacity: number }> = {
  prerequisite: { stroke: "var(--accent)", width: 1.3, opacity: 0.55 },
  related: { stroke: "var(--muted)", width: 1, opacity: 0.28 },
  "explained-by": { stroke: "var(--gold)", width: 1, opacity: 0.4, dash: "3 3" },
  "paper-introduces": { stroke: "var(--gold)", width: 1.1, opacity: 0.5 },
  implements: { stroke: "var(--cobalt)", width: 1.2, opacity: 0.5 },
  uses: { stroke: "var(--cobalt)", width: 1, opacity: 0.35, dash: "4 3" },
  references: { stroke: "var(--muted)", width: 1, opacity: 0.16, dash: "2 4" },
  "part-of": { stroke: "var(--muted)", width: 1, opacity: 0.2 },
  follows: { stroke: "var(--accent)", width: 1, opacity: 0.4 },
  structure: { stroke: "var(--muted)", width: 1, opacity: 0.2 },
  link: { stroke: "var(--muted)", width: 1, opacity: 0.28 },
};

const REST: Partial<Record<EdgeKind, number>> = {
  prerequisite: 84,
  related: 128,
  "paper-introduces": 108,
  "explained-by": 108,
  implements: 118,
  uses: 128,
  references: 150,
};

interface Props {
  data: GraphData;
  focus?: string | null;
  height?: number;
  className?: string;
  dimUnrelated?: boolean;
}

export default function KnowledgeGraph({ data, focus = null, height = 560, className = "", dimUnrelated = true }: Props) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nodesRef = useRef<SimNode[]>([]);
  const alphaRef = useRef(1);
  const rafRef = useRef(0);
  const dragRef = useRef<{ slug: string; moved: number } | { pan: true; sx: number; sy: number; ox: number; oy: number; moved: number } | null>(null);
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const viewRef = useRef(view);
  viewRef.current = view;
  const [hover, setHover] = useState<string | null>(null);
  const [, setFrame] = useState(0);
  const [size, setSize] = useState({ w: 800, h: height });
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const adjacency = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const n of data.nodes) m.set(n.note.slug, new Set());
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

    const cats = [...new Set(data.nodes.map((n) => n.note.category))];
    const clusterCenter = (cat: string) => {
      const i = cats.indexOf(cat);
      const angle = (i / Math.max(cats.length, 1)) * Math.PI * 2 - Math.PI / 2;
      const R = Math.min(w, h) * (cats.length > 1 ? 0.27 : 0);
      return { x: w / 2 + Math.cos(angle) * R, y: h / 2 + Math.sin(angle) * R };
    };

    const prev = new Map(nodesRef.current.map((n) => [n.slug, n]));
    nodesRef.current = data.nodes.map((d) => {
      const existing = prev.get(d.note.slug);
      const c = clusterCenter(d.note.category);
      const jitter = () => (Math.random() - 0.5) * Math.min(w, h) * 0.3;
      return {
        slug: d.note.slug,
        x: existing?.x ?? c.x + jitter(),
        y: existing?.y ?? c.y + jitter(),
        vx: 0,
        vy: 0,
        fx: null,
        fy: null,
        degree: d.degree,
        type: d.note.meta.type,
        category: d.note.category,
        folderGroup: folderGroup(d.note),
        color: folderColor(folderGroup(d.note)),
        title: d.note.meta.title,
        r: 5 + Math.min(d.degree, 12) * 1.15,
      };
    });
    alphaRef.current = 1;

    const step = () => {
      const nodes = nodesRef.current;
      const byId = new Map(nodes.map((n) => [n.slug, n]));
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
      // springs
      for (const e of data.edges) {
        const a = byId.get(e.source);
        const b = byId.get(e.target);
        if (!a || !b) continue;
        const rest = REST[e.kind] ?? 130;
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
      // gravity to cluster + center
      for (const n of nodes) {
        const c = clusterCenter(n.category);
        n.vx += (c.x - n.x) * 0.02 * alpha + (w / 2 - n.x) * 0.0035 * alpha;
        n.vy += (c.y - n.y) * 0.02 * alpha + (h / 2 - n.y) * 0.0035 * alpha;
        if (n.fx !== null && n.fy !== null) {
          n.x = n.fx;
          n.y = n.fy;
          n.vx = 0;
          n.vy = 0;
          continue;
        }
        n.vx *= 0.8;
        n.vy *= 0.8;
        n.x += n.vx;
        n.y += n.vy;
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

  const onNodeDown = (e: React.PointerEvent, slug: string) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = { slug, moved: 0 };
    const node = nodesRef.current.find((n) => n.slug === slug);
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
    if ("slug" in d) {
      const p = toWorld(e.clientX, e.clientY);
      const node = nodesRef.current.find((n) => n.slug === d.slug);
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
    if (d && "slug" in d) {
      const node = nodesRef.current.find((n) => n.slug === d.slug);
      if (node) {
        node.fx = null;
        node.fy = null;
      }
      if (d.moved < 6 && !("button" in e && e.button !== 0)) {
        navigate(`/note/${d.slug}`);
      }
      alphaRef.current = Math.max(alphaRef.current, 0.2);
    }
  };

  const hoveredNeighbors = hover ? adjacency.get(hover) ?? new Set<string>() : null;

  const visible = useCallback(
    (slug: string) => {
      if (!dimUnrelated) return true;
      if (focus && adjacency.get(focus)?.has(slug)) return true;
      if (focus === slug) return true;
      if (hover && (hover === slug || hoveredNeighbors?.has(slug))) return true;
      if (!focus && !hover) return true;
      return false;
    },
    [focus, hover, hoveredNeighbors, adjacency, dimUnrelated]
  );

  const nodes = nodesRef.current;
  const byId = useMemo(() => new Map(nodes.map((n) => [n.slug, n])), [nodes, nodes.length]);
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
        aria-label="Knowledge graph"
      >
        <g transform={`translate(${view.x},${view.y}) scale(${view.k})`}>
          {data.edges.map((e, i) => {
            const a = byId.get(e.source);
            const b = byId.get(e.target);
            if (!a || !b) return null;
            const style = EDGE_STYLE[e.kind] ?? EDGE_STYLE.references;
            const active =
              hover && (e.source === hover || e.target === hover)
                ? 1
                : visible(e.source) && visible(e.target)
                ? 1
                : 0.12;
            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={style.stroke}
                strokeWidth={(hover && (e.source === hover || e.target === hover) ? style.width + 0.7 : style.width) / Math.max(view.k, 0.7)}
                strokeDasharray={style.dash}
                opacity={style.opacity * active}
              />
            );
          })}
          {nodes.map((n) => {
            const dim = !visible(n.slug);
            const isFocus = focus === n.slug;
            const isHover = hover === n.slug;
            const neighbor = hoveredNeighbors?.has(n.slug);
            const showLabel = isHover || isFocus || neighbor || n.degree >= 5 || view.k > 1.05;
            return (
              <g
                key={n.slug}
                className="graph-node"
                transform={`translate(${n.x},${n.y})`}
                opacity={dim ? 0.13 : 1}
                onPointerDown={(e) => onNodeDown(e, n.slug)}
                onPointerEnter={() => setHover(n.slug)}
                onPointerLeave={() => setHover((h) => (h === n.slug ? null : h))}
              >
                {(isFocus || isHover) && (
                  <circle r={n.r + 7} fill="none" stroke={n.color} strokeOpacity={0.35} strokeWidth={1} />
                )}
                <circle
                  r={n.r}
                  fill={n.color}
                  fillOpacity={isFocus || isHover ? 1 : 0.82}
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
                    {n.title.length > 26 ? n.title.slice(0, 25) + "…" : n.title}
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
        {[...new Map(nodes.map((n) => [n.folderGroup, n.color])).entries()].map(([group, color]) => (
          <span key={group} className="flex items-center gap-1.5 font-mono2 text-[9.5px] tracking-[0.14em] uppercase text-muted">
            <span className="w-[7px] h-[7px] rounded-full" style={{ background: color }} />
            {categoryLabel(group)}
          </span>
        ))}
      </div>

      {/* hover card */}
      {hoveredNode && (
        <div
          className="absolute pointer-events-none z-10 bg-panel border border-line rounded-md px-3.5 py-2.5 shadow-[var(--shadow)] max-w-[220px]"
          style={{
            left: Math.min(size.w - 230, Math.max(8, view.x + hoveredNode.x * view.k + 14)),
            top: Math.min(size.h - 90, Math.max(8, view.y + hoveredNode.y * view.k - 20)),
          }}
        >
          <div className="font-display font-medium text-[13.5px] leading-tight">{hoveredNode.title}</div>
          <div className="font-mono2 text-[9.5px] tracking-[0.14em] uppercase mt-1.5" style={{ color: hoveredNode.color }}>
            {categoryLabel(hoveredNode.folderGroup)}
          </div>
          <div className="font-mono2 text-[9.5px] text-faint mt-1">
            {hoveredNode.degree} connection{hoveredNode.degree === 1 ? "" : "s"} · click to open
          </div>
        </div>
      )}
    </div>
  );
}
