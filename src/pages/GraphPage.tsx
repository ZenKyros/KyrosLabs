/**
 * /graph — the full knowledge universe, explorable and focusable.
 * Supports ?focus=slug&depth=1|2 for neighborhood mode.
 */

import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Focus, X, ArrowUpRight } from "lucide-react";
import { vault } from "../engine/vault";
import { buildGraph, neighborhood, type GraphData } from "../engine/graph";
import KnowledgeGraph from "../components/KnowledgeGraph";
import { Kicker, Reveal, TYPE_COLOR, TYPE_LABEL, TagList } from "../components/ui";
import type { NoteType } from "../engine/types";

const TYPES: (NoteType | "all")[] = ["all", "concept", "paper", "project", "research"];

export default function GraphPage() {
  const [params, setParams] = useSearchParams();
  const focus = params.get("focus");
  const depth = params.get("depth") === "2" ? 2 : 1;
  const [typeFilter, setTypeFilter] = useState<NoteType | "all">("all");
  const [query, setQuery] = useState("");

  const data: GraphData = useMemo(() => {
    if (focus && vault.bySlug.has(focus)) {
      return neighborhood(focus, depth);
    }
    if (typeFilter === "all") return buildGraph();
    const notes = vault.notes.filter((n) => n.meta.type === typeFilter || vault.edges.some(
      (e) =>
        (e.source === n.slug && vault.bySlug.get(e.target)?.meta.type === typeFilter) ||
        (e.target === n.slug && vault.bySlug.get(e.source)?.meta.type === typeFilter)
    ));
    return buildGraph(notes);
  }, [focus, depth, typeFilter]);

  const focusNote = focus ? vault.bySlug.get(focus) : undefined;

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return vault.notes.filter((n) => n.meta.title.toLowerCase().includes(q) || n.slug.includes(q)).slice(0, 7);
  }, [query]);

  const setFocus = (slug: string | null, d = 1) => {
    if (slug) {
      params.set("focus", slug);
      params.set("depth", String(d));
    } else {
      params.delete("focus");
      params.delete("depth");
    }
    setParams(params, { replace: true });
  };

  return (
    <div className="max-w-6xl mx-auto px-5 pt-14">
      <Kicker index="§">Knowledge graph</Kicker>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
        <h1 className="font-display font-bold tracking-[-0.025em] text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.05]">
          The vault,
          <br />
          <span className="text-accent">connected.</span>
        </h1>
        <p className="text-[13.5px] text-muted max-w-xs leading-relaxed pb-1">
          {data.nodes.length} nodes · {data.edges.length} edges — every one derived from wikilinks and
          frontmatter, never entered by hand.
        </p>
      </div>

      {/* controls */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => {
              setTypeFilter(t);
              if (focus) setFocus(null);
            }}
            className={`px-3.5 py-1.5 rounded-md border font-mono2 text-[10.5px] tracking-[0.14em] uppercase transition-all cursor-pointer ${
              typeFilter === t && !focus
                ? "border-accent text-accent bg-accentsoft"
                : "border-line text-muted hover:text-ink hover:border-faint"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              {t !== "all" && <span className="w-[5px] h-[5px] rotate-45" style={{ background: TYPE_COLOR[t] }} />}
              {t === "all" ? "Everything" : TYPE_LABEL[t] + "s"}
            </span>
          </button>
        ))}

        <div className="relative ml-auto w-full sm:w-64">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a node…"
            className="w-full bg-panel border border-line rounded-md px-3.5 py-2 text-[13px] outline-none focus:border-accent placeholder:text-faint transition-colors"
          />
          {matches.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-panel border border-line rounded-md shadow-[var(--shadow)] overflow-hidden z-20">
              {matches.map((n) => (
                <button
                  key={n.slug}
                  onClick={() => {
                    setFocus(n.slug);
                    setQuery("");
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] hover:bg-panel2 transition-colors cursor-pointer"
                >
                  <span className="w-[6px] h-[6px] rotate-45 flex-none" style={{ background: TYPE_COLOR[n.meta.type] }} />
                  {n.meta.title}
                  <span className="ml-auto font-mono2 text-[9.5px] uppercase tracking-[0.12em] text-faint">
                    {TYPE_LABEL[n.meta.type]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* focus banner */}
      {focusNote && (
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border border-accent/40 bg-accentsoft rounded-md px-4 py-3">
          <Focus size={14} className="text-accent flex-none" />
          <span className="font-mono2 text-[10.5px] tracking-[0.16em] uppercase text-accent">
            Neighborhood · depth {depth}
          </span>
          <span className="font-display font-medium text-[15px]">{focusNote.meta.title}</span>
          <button
            onClick={() => setFocus(focusNote.slug, depth === 1 ? 2 : 1)}
            className="font-mono2 text-[10.5px] tracking-[0.14em] uppercase text-muted hover:text-ink transition-colors cursor-pointer"
          >
            {depth === 1 ? "widen → depth 2" : "narrow → depth 1"}
          </button>
          <button
            onClick={() => setFocus(null)}
            className="ml-auto flex items-center gap-1.5 font-mono2 text-[10.5px] tracking-[0.14em] uppercase text-muted hover:text-blush transition-colors cursor-pointer"
          >
            <X size={12} /> clear focus
          </button>
        </div>
      )}

      <Reveal className="mt-6">
        <KnowledgeGraph data={data} focus={focus} height={560} />
      </Reveal>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5 font-mono2 text-[10px] tracking-[0.14em] uppercase text-faint">
        <span>scroll — zoom</span>
        <span>drag canvas — pan</span>
        <span>drag node — rearrange</span>
        <span>hover — connections</span>
        <span>click — open note</span>
      </div>

      {/* focused note detail */}
      {focusNote && (
        <div className="mt-10 grid md:grid-cols-[1fr_260px] gap-8">
          <div>
            <div className="kicker mb-3">
              <span style={{ color: TYPE_COLOR[focusNote.meta.type] }}>{TYPE_LABEL[focusNote.meta.type]}</span>
            </div>
            <h2 className="font-display font-semibold text-[1.6rem] tracking-tight">{focusNote.meta.title}</h2>
            {focusNote.meta.description && (
              <p className="font-serif2 italic text-muted text-[15.5px] leading-relaxed mt-3 max-w-xl">
                {focusNote.meta.description}
              </p>
            )}
            <div className="mt-4">
              <TagList tags={focusNote.meta.tags} />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              to={`/note/${focusNote.slug}`}
              className="group inline-flex items-center gap-2 font-mono2 text-[11px] tracking-[0.16em] uppercase text-accent hover:brightness-125 transition-all w-fit"
            >
              Open full note
              <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <div className="font-mono2 text-[11px] text-muted leading-relaxed mt-1">
              {data.nodes.length - 1} connected node{data.nodes.length - 1 === 1 ? "" : "s"} in this view
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
