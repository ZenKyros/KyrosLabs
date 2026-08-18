/**
 * SearchPalette — ⌘K command palette. Instant local search over the vault.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, CornerDownLeft, ArrowUp, ArrowDown } from "lucide-react";
import { searchVault } from "../engine/search";
import { vault, categoryLabel } from "../engine/vault";
import { TYPE_COLOR, TYPE_LABEL } from "./ui";
import type { SearchResult } from "../engine/types";

function Highlight({ text, tokens }: { text: string; tokens: string[] }) {
  if (!tokens.length) return <>{text}</>;
  const re = new RegExp(`(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "ig");
  const parts = text.split(re);
  const lowerTokens = tokens.map((t) => t.toLowerCase());
  return (
    <>
      {parts.map((p, i) =>
        lowerTokens.includes(p.toLowerCase()) ? (
          <mark key={i} className="bg-accentsoft text-accent rounded-[2px] px-[1px]">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

export default function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const results: SearchResult[] = useMemo(
    () => (query.trim() ? searchVault(query) : vault.notes.slice(0, 8).map((note) => ({ note, score: 0, excerpt: note.meta.description ?? "", matchedIn: [] }))),
    [query]
  );
  const tokens = useMemo(() => query.toLowerCase().split(/\s+/).filter(Boolean), [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);
  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (slug: string) => {
    onClose();
    navigate(`/note/${slug}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <div className="absolute inset-0 bg-bg2/70 backdrop-blur-[3px]" onMouseDown={onClose} />
          <motion.div
            className="relative w-full max-w-2xl bg-panel border border-line rounded-lg shadow-[var(--shadow)] overflow-hidden"
            initial={{ y: 14, scale: 0.985, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 10, scale: 0.99, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="flex items-center gap-3 px-5 border-b border-line">
              <Search size={16} className="text-faint flex-none" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActive((a) => Math.min(a + 1, results.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive((a) => Math.max(a - 1, 0));
                  } else if (e.key === "Enter" && results[active]) {
                    go(results[active].note.slug);
                  } else if (e.key === "Escape") {
                    onClose();
                  }
                }}
                placeholder={`Search ${vault.stats.totalNotes} notes, papers, projects…`}
                className="w-full bg-transparent py-4 outline-none text-[15px] placeholder:text-faint"
                aria-label="Search the vault"
              />
              <kbd className="kbd hidden sm:block">esc</kbd>
            </div>

            <div ref={listRef} className="max-h-[46vh] overflow-y-auto py-2">
              {!query.trim() && (
                <div className="kicker px-5 pb-2 pt-1.5">Recent & connected</div>
              )}
              {results.length === 0 && (
                <div className="px-5 py-10 text-center">
                  <div className="font-mono2 text-[12px] tracking-[0.16em] uppercase text-faint">
                    No matches for “{query}”
                  </div>
                  <p className="text-[13px] text-muted mt-2">
                    Try a concept (attention), a tag (#alignment) or a paper title.
                  </p>
                </div>
              )}
              {results.map((r, i) => (
                <button
                  key={r.note.slug}
                  data-idx={i}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r.note.slug)}
                  className={`w-full text-left px-5 py-3 flex gap-4 items-start border-l-2 transition-colors cursor-pointer ${
                    i === active ? "border-accent bg-panel2" : "border-transparent hover:bg-panel2/60"
                  }`}
                >
                  <span
                    className="mt-[7px] w-[7px] h-[7px] rotate-45 flex-none"
                    style={{ background: TYPE_COLOR[r.note.meta.type] }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-3 flex-wrap">
                      <span className="font-display font-medium text-[15px]">
                        <Highlight text={r.note.meta.title} tokens={tokens} />
                      </span>
                      <span className="font-mono2 text-[10px] tracking-[0.14em] uppercase" style={{ color: TYPE_COLOR[r.note.meta.type] }}>
                        {TYPE_LABEL[r.note.meta.type]}
                      </span>
                      <span className="font-mono2 text-[10px] tracking-[0.14em] uppercase text-faint">
                        {categoryLabel(r.note.category)}
                      </span>
                    </span>
                    {r.excerpt && (
                      <span className="block text-[12.5px] text-muted leading-relaxed mt-1 line-clamp-2">
                        <Highlight text={r.excerpt} tokens={tokens} />
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 px-5 py-2.5 border-t border-line bg-panel2/50">
              <span className="flex items-center gap-1.5 font-mono2 text-[10px] text-faint">
                <ArrowUp size={11} />
                <ArrowDown size={11} /> navigate
              </span>
              <span className="flex items-center gap-1.5 font-mono2 text-[10px] text-faint">
                <CornerDownLeft size={11} /> open
              </span>
              <span className="ml-auto font-mono2 text-[10px] tracking-[0.14em] uppercase text-faint">
                {results.length} result{results.length === 1 ? "" : "s"}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
