/**
 * /knowledge — the explorer: every note in the vault with live filters.
 */

import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowUpDown, Folder } from "lucide-react";
import { vault } from "../engine/vault";
import { buildFileSystemGraph } from "../engine/filesystem-graph";
import { Kicker, NoteRow, Reveal, TYPE_COLOR, TYPE_LABEL } from "../components/ui";
import type { NoteType } from "../engine/types";


const TYPE_FILTERS: { id: NoteType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "concept", label: "Concepts" },
  { id: "paper", label: "Papers" },
  { id: "note", label: "Notes" },
];

const LEVELS = ["foundations", "beginner", "intermediate", "advanced"] as const;

/* ————— folder tree (folders inside folders) for the filter rail ————— */

interface FolderTreeNode {
  id: string;
  /** path relative to the vault, e.g. "ArtificiaL Intillegence/Deep Learning" */
  rel: string;
  label: string;
  depth: number;
  /** notes under this folder, including nested ones */
  count: number;
  children: FolderTreeNode[];
}

function FolderBranch({
  node,
  selected,
  onSelect,
}: {
  node: FolderTreeNode;
  selected: string;
  onSelect: (rel: string) => void;
}) {
  const active = selected === node.rel;
  const inTrail = selected.startsWith(`${node.rel}/`);
  return (
    <div>
      <button
        onClick={() => onSelect(active ? "all" : node.rel)}
        style={{ paddingLeft: `${10 + node.depth * 16}px` }}
        className={`flex w-full items-center gap-2 pr-2.5 py-1.5 rounded text-left text-[13px] transition-colors cursor-pointer ${
          active
            ? "text-accent bg-accentsoft"
            : inTrail
            ? "text-ink hover:bg-panel"
            : "text-muted hover:text-ink hover:bg-panel"
        }`}
      >
        <Folder size={12} className="flex-none text-faint" />
        <span className="min-w-0 flex-1 truncate">{node.label}</span>
        <span className="font-mono2 text-[10.5px] text-faint tabular-nums">{node.count}</span>
      </button>
      {node.children.map((c) => (
        <FolderBranch key={c.id} node={c} selected={selected} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default function Explorer() {
  const [params, setParams] = useSearchParams();
  const [type, setType] = useState<NoteType | "all">((params.get("type") as NoteType) ?? "all");
  // holds a folder path relative to the vault ("all" = no folder filter);
  // selecting a folder includes every note inside it, at any nesting depth
  const [folder, setFolder] = useState(params.get("cat") ?? "all");
  const [level, setLevel] = useState(params.get("level") ?? "all");
  const [tag, setTag] = useState(params.get("tag") ?? "all");
  const [sort, setSort] = useState<"title" | "updated">("updated");

  const fileSystemGraph = useMemo(() => buildFileSystemGraph(), []);

  const folderTree = useMemo<FolderTreeNode[]>(() => {
    const VAULT_PREFIX = "/src/content/vault/";
    const folders = fileSystemGraph.nodes.filter((n) => n.type === "folder");
    const byParent = new Map<string, typeof folders>();
    for (const f of folders) {
      const key = f.parentId ?? "root";
      const list = byParent.get(key) ?? [];
      list.push(f);
      byParent.set(key, list);
    }
    const countNotes = (rel: string) =>
      vault.notes.filter((n) => n.path.startsWith(`${rel}/`)).length;
    const build = (parentId: string, depth: number): FolderTreeNode[] =>
      (byParent.get(parentId) ?? [])
        .map((f) => {
          const rel = f.path.startsWith(VAULT_PREFIX) ? f.path.slice(VAULT_PREFIX.length) : f.path;
          return {
            id: f.id,
            rel,
            label: f.label,
            depth,
            count: countNotes(rel),
            children: build(f.id, depth + 1),
          };
        })
        .sort((a, b) => a.label.localeCompare(b.label));
    return build("root", 0);
  }, [fileSystemGraph]);

  const folderLabels = useMemo(() => {
    const m = new Map<string, string>();
    const walk = (nodes: FolderTreeNode[]) => {
      for (const n of nodes) {
        m.set(n.rel, n.label);
        walk(n.children);
      }
    };
    walk(folderTree);
    return m;
  }, [folderTree]);

  const results = useMemo(() => {
    let list = vault.notes.filter((n) => {
      if (type !== "all" && n.meta.type !== type) return false;
      if (folder !== "all" && !n.path.startsWith(`${folder}/`)) return false;
      if (level !== "all" && n.meta.level !== level) return false;
      if (tag !== "all" && !n.meta.tags.includes(tag)) return false;
      return true;
    });
    list = [...list].sort((a, b) =>
      sort === "title"
        ? a.meta.title.localeCompare(b.meta.title)
        : (b.meta.updated ?? "").localeCompare(a.meta.updated ?? "") || a.meta.title.localeCompare(b.meta.title)
    );
    return list;
  }, [type, folder, level, tag, sort]);

  const setTagBoth = (t: string) => {
    setTag(t);
    if (t === "all") params.delete("tag");
    else params.set("tag", t);
    setParams(params, { replace: true });
  };

  const chip = (active: boolean) =>
    `px-3.5 py-1.5 rounded-md border font-mono2 text-[10.5px] tracking-[0.14em] uppercase transition-all cursor-pointer ${
      active
        ? "border-accent text-accent bg-accentsoft"
        : "border-line text-muted hover:text-ink hover:border-faint"
    }`;

  return (
    <div className="max-w-6xl mx-auto px-5 pt-14">
      <Kicker index="§">Knowledge explorer</Kicker>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
        <h1 className="font-display font-bold tracking-[-0.025em] text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.05]">
          Explore AI
          <br />
          <span className="text-accent">One Palace</span>
        </h1>
        <p className="text-[13.5px] text-muted max-w-xs leading-relaxed pb-1">
          {vault.stats.totalNotes} documents discovered recursively from{" "}
          <code className="font-mono2 text-[11.5px] text-accent">src/content/vault</code> — filter them, or press{" "}
          <kbd className="kbd">⌘K</kbd> to search everything.
        </p>
      </div>

      <div className="mt-12 grid lg:grid-cols-[230px_1fr] gap-10">
        {/* ————— filter rail ————— */}
        <aside className="space-y-8 lg:sticky lg:top-24 self-start">
          <div>
            <div className="kicker mb-3.5">Type</div>
            <div className="flex flex-wrap gap-2">
              {TYPE_FILTERS.map((t) => (
                <button key={t.id} onClick={() => setType(t.id)} className={chip(type === t.id)}>
                  <span className="inline-flex items-center gap-1.5">
                    {t.id !== "all" && (
                      <span className="w-[5px] h-[5px] rotate-45" style={{ background: TYPE_COLOR[t.id] }} />
                    )}
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="kicker mb-3.5">Folders</div>
            <div className="flex flex-col items-stretch gap-0.5">
              <button
                onClick={() => setFolder("all")}
                className={`flex items-center gap-2 text-left px-2.5 py-1.5 rounded text-[13px] transition-colors cursor-pointer ${
                  folder === "all" ? "text-accent bg-accentsoft" : "text-muted hover:text-ink hover:bg-panel"
                }`}
              >
                All folders
                <span className="ml-auto font-mono2 text-[10.5px] text-faint tabular-nums">
                  {vault.stats.totalNotes}
                </span>
              </button>
              {folderTree.map((node) => (
                <FolderBranch key={node.id} node={node} selected={folder} onSelect={setFolder} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="kicker mb-3.5">Level</div>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-panel border border-line rounded-md px-2.5 py-2 text-[12.5px] text-muted outline-none focus:border-accent cursor-pointer"
              >
                <option value="all">Any</option>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l[0].toUpperCase() + l.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="kicker mb-3.5">Tags</div>
            <div className="flex flex-wrap gap-x-3 gap-y-2">
              {vault.allTags.slice(0, 16).map(({ tag: t, count }) => (
                <button
                  key={t}
                  onClick={() => setTagBoth(tag === t ? "all" : t)}
                  className={`font-mono2 text-[11.5px] transition-colors cursor-pointer ${tag === t ? "text-accent" : "text-faint hover:text-ink"}`}
                >
                  #{t}
                  <span className="text-faint/70 ml-1">{count}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ————— results ————— */}
        <div>
          <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
            <span className="font-mono2 text-[11px] tracking-[0.16em] uppercase text-muted">
              Showing <span className="text-accent">{results.length}</span> / {vault.stats.totalNotes}
              {tag !== "all" && <span> · #{tag}</span>}
              {folder !== "all" && <span> · {folderLabels.get(folder) ?? folder}</span>}
            </span>
            <button
              onClick={() => setSort((s) => (s === "title" ? "updated" : "title"))}
              className="flex items-center gap-1.5 font-mono2 text-[10.5px] tracking-[0.14em] uppercase text-faint hover:text-ink transition-colors cursor-pointer"
            >
              <ArrowUpDown size={12} />
              {sort === "title" ? "A → Z" : "Recently updated"}
            </button>
          </div>

          {results.length === 0 && (
            <div className="py-16 text-center">
              <div className="font-mono2 text-[12px] tracking-[0.16em] uppercase text-faint">No notes match these filters</div>
              <p className="text-[13px] text-muted mt-2">Loosen a filter, or add the note to the vault as Markdown.</p>
            </div>
          )}

          <div>
            {results.map((n, i) => (
              <Reveal key={n.slug} delay={Math.min(i, 8) * 40}>
                <NoteRow note={n} showDate={sort === "updated"} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-14 text-center font-mono2 text-[10.5px] tracking-[0.16em] uppercase text-faint">
        {Object.entries(TYPE_LABEL).length} note types · {vault.stats.tags} tags · all discovered automatically
      </div>
    </div>
  );
}
