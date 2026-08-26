/**
 * VAULT — the content engine entry point.
 *
 * Pipeline:  markdown files → recursive discovery (import.meta.glob)
 *         → frontmatter parsing → wikilink extraction → metadata index
 *         → relationship generation → statistics / recents / categories
 *
 * Nothing is registered manually. Drop a .md file anywhere under
 * src/content/vault and it becomes a page, a graph node and a search entry.
 */

import { splitFrontmatter, asString, asList, asNumber } from "./frontmatter";
import type {
  VaultNote,
  VaultIndex,
  NoteMeta,
  NoteType,
  NoteStatus,
  NoteLevel,
  Relationship,
  EdgeKind,
  CategoryInfo,
  TocItem,
  VaultStats,
} from "./types";

const VAULT_PREFIX = "/src/content/vault/";

/* Recursive discovery — the ONLY place files are enumerated. */
const modules = import.meta.glob("/src/content/vault/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const TYPE_DEFAULTS: Record<string, NoteType> = {
  papers: "paper",
  projects: "project",
  research: "research",
};

const CATEGORY_LABELS: Record<string, string> = {
  foundations: "Foundations",
  "deep-learning": "Deep Learning",
  transformers: "Transformers",
  llms: "Large Language Models",
  agents: "Agents",
  papers: "Papers",
  projects: "Projects",
  research: "Research",
  // display-only fix for the vault folder's spelling
  "artificial intillegence": "Artificial Intelligence",
};

export function categoryLabel(id: string): string {
  return CATEGORY_LABELS[id] ?? id.split("-").map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ");
}

const VALID_TYPES: NoteType[] = ["concept", "paper", "project", "research", "note"];
const VALID_STATUS: NoteStatus[] = [
  "not-started", "learning", "understood", "implemented", "experimented", "research", "mastered",
];
const VALID_LEVELS: NoteLevel[] = ["foundations", "beginner", "intermediate", "advanced"];

/** Strip fenced code + inline code so wikilinks/heading scans never match code. */
function stripCode(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "\n")
    .replace(/`[^`\n]*`/g, " ");
}

const WIKILINK_RE = /\[\[([^\]|#\n]+?)(?:#[^\]|\n]*)?(?:\|([^\]\n]+))?\]\]/g;

export function extractWikilinks(body: string): string[] {
  const clean = stripCode(body);
  const found: string[] = [];
  let m: RegExpExecArray | null;
  WIKILINK_RE.lastIndex = 0;
  while ((m = WIKILINK_RE.exec(clean))) {
    const target = m[1].trim().toLowerCase();
    if (target && !found.includes(target)) found.push(target);
  }
  return found;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\$+([^$]*)\$+/g, "$1")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function extractHeadings(body: string): TocItem[] {
  const clean = stripCode(body);
  const items: TocItem[] = [];
  for (const line of clean.split("\n")) {
    const m = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/);
    if (m) {
      items.push({ id: slugifyHeading(m[2]), text: m[2].replace(/[*_`]/g, ""), depth: m[1].length === 2 ? 2 : 3 });
    }
  }
  return items;
}

function countWords(body: string): number {
  return stripCode(body).split(/\s+/).filter(Boolean).length;
}

function normalizeSlug(s: string): string {
  return s.trim().toLowerCase();
}

function parseNote(filePath: string, raw: string): VaultNote | null {
  const rel = filePath.startsWith(VAULT_PREFIX) ? filePath.slice(VAULT_PREFIX.length) : filePath;
  const noExt = rel.replace(/\.md$/i, "");
  const segments = noExt.split("/");
  const fileBase = segments[segments.length - 1];
  if (/^readme$/i.test(fileBase)) return null;
  // skip stray files with no basename (e.g. ".md") — they would index as a ghost note with an empty slug
  if (!fileBase.trim()) return null;
  const slug = normalizeSlug(fileBase);
  const category = segments.length > 1 ? segments[0] : "notes";
  const subpath = segments.slice(1, -1);

  const { meta, body } = splitFrontmatter(raw);

  const typeRaw = asString(meta.type).toLowerCase();
  const type: NoteType = (VALID_TYPES as string[]).includes(typeRaw)
    ? (typeRaw as NoteType)
    : TYPE_DEFAULTS[category] ?? "note";

  const statusRaw = asString(meta.status).toLowerCase();
  const levelRaw = asString(meta.level).toLowerCase();

  const fmCategory = asString(meta.category).toLowerCase();

  const noteMeta: NoteMeta = {
    title: asString(meta.title) || fileBase.split("-").map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" "),
    description: asString(meta.description) || undefined,
    type,
    level: (VALID_LEVELS as string[]).includes(levelRaw) ? (levelRaw as NoteLevel) : undefined,
    status: (VALID_STATUS as string[]).includes(statusRaw) ? (statusRaw as NoteStatus) : undefined,
    tags: asList(meta.tags).map((t) => t.toLowerCase()),
    prerequisites: asList(meta.prerequisites).map(normalizeSlug),
    related: asList(meta.related).map(normalizeSlug),
    papers: asList(meta.papers).map(normalizeSlug),
    concepts: asList(meta.concepts).map(normalizeSlug),
    authors: asList(meta.authors),
    year: asNumber(meta.year),
    topics: asList(meta.topics).map((t) => t.toLowerCase()),
    hypothesis: asString(meta.hypothesis) || undefined,
    tech: asList(meta.tech),
    updated: asString(meta.updated) || undefined,
    created: asString(meta.created) || undefined,
  };

  return {
    slug,
    path: noExt,
    category: fmCategory || category,
    subpath,
    meta: noteMeta,
    body: body.trim(),
    headings: extractHeadings(body),
    wordCount: countWords(body),
    outLinks: extractWikilinks(body),
  };
}

/* ————— relationship generation: the vault IS the graph database ————— */

function buildRelationships(notes: VaultNote[], bySlug: Map<string, VaultNote>): Relationship[] {
  const seen = new Set<string>();
  const edges: Relationship[] = [];
  const add = (source: string, target: string, kind: EdgeKind) => {
    if (source === target) return;
    if (!bySlug.has(source) || !bySlug.has(target)) return;
    const key = `${source}→${target}:${kind}`;
    if (seen.has(key)) return;
    seen.add(key);
    edges.push({ source, target, kind });
  };

  for (const n of notes) {
    const covered = new Set<string>();
    for (const p of n.meta.prerequisites) {
      add(p, n.slug, "prerequisite");
      covered.add(p);
    }
    for (const r of n.meta.related) {
      add(n.slug, r, "related");
      covered.add(r);
    }
    for (const p of n.meta.papers) {
      add(n.slug, p, "explained-by");
      covered.add(p);
    }
    if (n.meta.type === "paper") {
      for (const c of n.meta.concepts) {
        add(n.slug, c, "paper-introduces");
        covered.add(c);
      }
    }
    if (n.meta.type === "project") {
      for (const l of n.outLinks) {
        if (covered.has(l)) continue;
        const target = bySlug.get(l);
        if (!target) continue;
        add(n.slug, l, target.meta.type === "paper" ? "implements" : "uses");
        covered.add(l);
      }
    }
    for (const l of n.outLinks) {
      if (!covered.has(l)) add(n.slug, l, "references");
    }
  }
  return edges;
}

function buildIndex(): VaultIndex {
  const notes: VaultNote[] = [];
  const bySlug = new Map<string, VaultNote>();

  for (const [path, raw] of Object.entries(modules)) {
    const note = parseNote(path, raw);
    if (!note) continue;
    if (bySlug.has(note.slug)) {
      console.warn(`[kyros] duplicate slug "${note.slug}" — keeping ${path}`);
      continue;
    }
    bySlug.set(note.slug, note);
    notes.push(note);
  }

  notes.sort((a, b) => a.meta.title.localeCompare(b.meta.title));
  const edges = buildRelationships(notes, bySlug);

  const catMap = new Map<string, CategoryInfo>();
  const tagMap = new Map<string, number>();
  let words = 0;

  for (const n of notes) {
    words += n.wordCount;
    if (!catMap.has(n.category)) {
      catMap.set(n.category, { id: n.category, label: categoryLabel(n.category), count: 0, subs: [] });
    }
    const cat = catMap.get(n.category)!;
    cat.count++;
    const subId = n.subpath.join("/");
    if (subId) {
      let sub = cat.subs.find((s) => s.id === subId);
      if (!sub) {
        sub = { id: subId, label: n.subpath.map((s) => categoryLabel(s)).join(" / "), count: 0 };
        cat.subs.push(sub);
      }
      sub.count++;
    }
    for (const t of n.meta.tags) tagMap.set(t, (tagMap.get(t) ?? 0) + 1);
  }

  const categories = [...catMap.values()].sort((a, b) => {
    const order = ["foundations", "deep-learning", "transformers", "llms", "agents", "papers", "projects", "research"];
    const ia = order.indexOf(a.id);
    const ib = order.indexOf(b.id);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  const allTags = [...tagMap.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

  const countType = (t: NoteType) => notes.filter((n) => n.meta.type === t).length;

  const recent = notes
    .filter((n) => n.meta.updated)
    .sort((a, b) => (b.meta.updated ?? "").localeCompare(a.meta.updated ?? ""));

  const stats: VaultStats = {
    totalNotes: notes.length,
    concepts: countType("concept"),
    papers: countType("paper"),
    projects: countType("project"),
    research: countType("research"),
    plainNotes: countType("note"),
    categories: categories.length,
    tags: allTags.length,
    graphNodes: notes.length,
    graphEdges: edges.length,
    words,
  };

  return { notes, bySlug, edges, stats, categories, allTags, recent };
}

/** Singleton — computed once at build/import time. */
export const vault: VaultIndex = buildIndex();

/** Notes linking INTO a given note (computed lazily, cached). */
const backlinkCache = new Map<string, VaultNote[]>();
export function getBacklinks(slug: string): VaultNote[] {
  const hit = backlinkCache.get(slug);
  if (hit) return hit;
  const result = vault.notes
    .filter((n) => n.slug !== slug && vault.edges.some((e) => e.target === slug && e.source === n.slug))
    .sort((a, b) => a.meta.title.localeCompare(b.meta.title));
  backlinkCache.set(slug, result);
  return result;
}

/** Adjacency (undirected) for graph neighborhood queries. */
let adjacency: Map<string, Set<string>> | null = null;
export function getAdjacency(): Map<string, Set<string>> {
  if (adjacency) return adjacency;
  adjacency = new Map();
  for (const n of vault.notes) adjacency.set(n.slug, new Set());
  for (const e of vault.edges) {
    adjacency.get(e.source)?.add(e.target);
    adjacency.get(e.target)?.add(e.source);
  }
  return adjacency;
}
