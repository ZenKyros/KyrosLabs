/**
 * Core type definitions for the KYROS content engine.
 * The engine is deliberately decoupled from the UI: it can later be mounted
 * inside a larger portfolio application (/knowledge) without changes.
 */

export type NoteType = "concept" | "paper" | "project" | "research" | "note";

export type NoteStatus =
  | "not-started"
  | "learning"
  | "understood"
  | "implemented"
  | "experimented"
  | "research"
  | "mastered";

export type NoteLevel = "foundations" | "beginner" | "intermediate" | "advanced";

export type EdgeKind =
  | "prerequisite"
  | "related"
  | "implements"
  | "explained-by"
  | "paper-introduces"
  | "references"
  | "part-of"
  | "follows"
  | "uses"
  | "structure"
  | "link";

export type GraphNodeType = "root" | "folder" | "note";

export interface NoteMeta {
  title: string;
  description?: string;
  type: NoteType;
  level?: NoteLevel;
  status?: NoteStatus;
  tags: string[];
  prerequisites: string[];
  related: string[];
  papers: string[];
  /** papers: concepts this paper introduces / explains */
  concepts: string[];
  /** papers */
  authors?: string[];
  year?: number;
  topics?: string[];
  /** research */
  hypothesis?: string;
  /** projects */
  tech: string[];
  updated?: string;
  created?: string;
}

export interface TocItem {
  id: string;
  text: string;
  depth: 2 | 3;
}

export interface VaultNote {
  /** unique slug — the file basename, e.g. "self-attention" */
  slug: string;
  /** path inside the vault, e.g. "transformers/self-attention" */
  path: string;
  /** top-level folder, e.g. "transformers" */
  category: string;
  /** remaining folder segments, e.g. ["mathematics"] */
  subpath: string[];
  meta: NoteMeta;
  /** markdown body with frontmatter removed */
  body: string;
  headings: TocItem[];
  wordCount: number;
  /** slugs referenced through [[wikilinks]] in the body */
  outLinks: string[];
}

export interface Relationship {
  source: string;
  target: string;
  kind: EdgeKind;
}

export interface CategoryInfo {
  id: string;
  label: string;
  count: number;
  subs: { id: string; label: string; count: number }[];
}

export interface VaultStats {
  totalNotes: number;
  concepts: number;
  papers: number;
  projects: number;
  research: number;
  plainNotes: number;
  categories: number;
  tags: number;
  graphNodes: number;
  graphEdges: number;
  words: number;
}

export interface VaultIndex {
  notes: VaultNote[];
  bySlug: Map<string, VaultNote>;
  edges: Relationship[];
  stats: VaultStats;
  categories: CategoryInfo[];
  allTags: { tag: string; count: number }[];
  recent: VaultNote[];
}

export interface GraphNodeDatum {
  note: VaultNote;
  degree: number;
}

export interface FileSystemGraphNode {
  id: string;
  label: string;
  type: GraphNodeType;
  path: string;
  parentId?: string;
  metadata?: Record<string, unknown>;
}

export interface FileSystemGraphEdge {
  source: string;
  target: string;
  type: "structure" | "link";
}

export interface FileSystemGraphData {
  nodes: FileSystemGraphNode[];
  edges: FileSystemGraphEdge[];
}

export interface SearchResult {
  note: VaultNote;
  score: number;
  excerpt: string;
  matchedIn: string[];
}
