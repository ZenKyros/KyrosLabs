/**
 * GRAPH ENGINE — turns the relationship list into renderable graph data,
 * focused neighborhoods, and the prerequisite-derived learning roadmap.
 * No graph data is ever authored by hand: it all flows from the vault.
 */

import { vault, getAdjacency } from "./vault";
import type { GraphNodeDatum, Relationship, VaultNote } from "./types";

export interface GraphData {
  links: any;
  nodes: GraphNodeDatum[];
  edges: Relationship[];
}

export function buildGraph(notes: VaultNote[] = vault.notes, edges: Relationship[] = vault.edges): GraphData {
  const inSet = new Set(notes.map((n) => n.slug));
  const degree = new Map<string, number>();
  const filtered = edges.filter((e) => inSet.has(e.source) && inSet.has(e.target));
  for (const e of filtered) {
    degree.set(e.source, (degree.get(e.source) ?? 0) + 1);
    degree.set(e.target, (degree.get(e.target) ?? 0) + 1);
  }
  return {
    links: filtered,
    nodes: notes.map((note) => ({ note, degree: degree.get(note.slug) ?? 0 })),
    edges: filtered,
  };
}

/** k-hop neighborhood around a slug (used for "explore this concept" focus mode). */
export function neighborhood(center: string, depth = 1): GraphData {
  const adj = getAdjacency();
  const levels = new Map<string, number>();
  levels.set(center, 0);
  let frontier = [center];
  for (let d = 1; d <= depth; d++) {
    const next: string[] = [];
    for (const s of frontier) {
      for (const t of adj.get(s) ?? []) {
        if (!levels.has(t)) {
          levels.set(t, d);
          next.push(t);
        }
      }
    }
    frontier = next;
  }
  const notes = [...levels.keys()]
    .map((s) => vault.bySlug.get(s))
    .filter((n): n is VaultNote => Boolean(n));
  return buildGraph(notes, vault.edges);
}

/** Top-N most connected notes (home constellation). */
export function topConnected(limit: number): GraphData {
  const g = buildGraph();
  const top = [...g.nodes]
    .sort((a, b) => b.degree - a.degree || a.note.meta.title.localeCompare(b.note.meta.title))
    .slice(0, limit)
    .map((n) => n.note.slug);
  const set = new Set(top);
  return buildGraph(
    vault.notes.filter((n) => set.has(n.slug)),
    vault.edges
  );
}

/* ————— ROADMAP: layered stages derived purely from `prerequisites:` ————— */

export interface RoadmapStage {
  index: number;
  label: string;
  notes: VaultNote[];
}

export interface Roadmap {
  stages: RoadmapStage[];
  spine: VaultNote[];
}

const STAGE_NAMES = [
  "Foundations",
  "Core Models",
  "Deep Networks",
  "Sequence Models",
  "Attention Era",
  "Architectures",
  "Large Models",
  "Alignment",
  "Systems",
  "Frontier",
];

export function buildRoadmap(): Roadmap {
  const level = new Map<string, number>();
  const resolving = new Set<string>();

  const depthOf = (slug: string): number => {
    const hit = level.get(slug);
    if (hit !== undefined) return hit;
    if (resolving.has(slug)) return 0; // cycle guard
    resolving.add(slug);
    const note = vault.bySlug.get(slug);
    const prereqs = (note?.meta.prerequisites ?? []).filter((p) => vault.bySlug.has(p));
    const d = prereqs.length === 0 ? 0 : 1 + Math.max(...prereqs.map(depthOf));
    resolving.delete(slug);
    level.set(slug, d);
    return d;
  };

  const concepts = vault.notes.filter((n) => n.meta.type === "concept");
  for (const n of concepts) depthOf(n.slug);

  const byLevel = new Map<number, VaultNote[]>();
  for (const n of concepts) {
    const d = level.get(n.slug) ?? 0;
    if (!byLevel.has(d)) byLevel.set(d, []);
    byLevel.get(d)!.push(n);
  }
  const stages: RoadmapStage[] = [...byLevel.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([index, notes], i) => ({
      index,
      label: STAGE_NAMES[i] ?? `Stage ${index}`,
      notes: notes.sort((a, b) => a.meta.title.localeCompare(b.meta.title)),
    }));

  // critical path: walk down from the deepest node through strongest prereq chain
  const spine: VaultNote[] = [];
  let current = concepts
    .filter((n) => (level.get(n.slug) ?? 0) === stages.length - 1)
    .sort((a, b) => a.meta.title.localeCompare(b.meta.title))[0];
  const guard = new Set<string>();
  while (current && !guard.has(current.slug)) {
    guard.add(current.slug);
    spine.unshift(current);
    const prereqs = current.meta.prerequisites
      .map((p) => vault.bySlug.get(p))
      .filter((n): n is VaultNote => Boolean(n));
    if (!prereqs.length) break;
    current = prereqs.sort(
      (a, b) => (level.get(b.slug) ?? 0) - (level.get(a.slug) ?? 0) || a.meta.title.localeCompare(b.meta.title)
    )[0];
  }

  return { stages, spine };
}

/** Breadcrumb chain for "you are here" — AI → category → subpath → title. */
export function youAreHere(note: VaultNote): { label: string; to?: string }[] {
  const chain: { label: string; to?: string }[] = [{ label: "AI", to: "/" }];
  const catLabel = note.category.split("-").map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ");
  chain.push({ label: catLabel, to: `/category/${note.category}` });
  for (const s of note.subpath) {
    chain.push({ label: s.split("-").map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" "), to: `/category/${note.category}` });
  }
  chain.push({ label: note.meta.title });
  return chain;
}
