/**
 * Shared UI atoms — status system, type system, reveals, kickers, note rows.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { VaultNote, NoteStatus, NoteType } from "../engine/types";
import { categoryLabel } from "../engine/vault";

/* ————— type + status color system ————— */

export const TYPE_COLOR: Record<NoteType, string> = {
  concept: "var(--accent)",
  paper: "var(--gold)",
  project: "var(--cobalt)",
  research: "var(--blush)",
  note: "var(--muted)",
};

export const TYPE_LABEL: Record<NoteType, string> = {
  concept: "Concept",
  paper: "Paper",
  project: "Project",
  research: "Research",
  note: "Note",
};

export const STATUS_META: Record<NoteStatus, { label: string; color: string }> = {
  "not-started": { label: "Not started", color: "var(--faint)" },
  learning: { label: "Learning", color: "var(--gold)" },
  understood: { label: "Understood", color: "var(--cobalt)" },
  implemented: { label: "Implemented", color: "var(--accent)" },
  experimented: { label: "Experimented", color: "var(--blush)" },
  research: { label: "Research", color: "var(--blush)" },
  mastered: { label: "Mastered", color: "var(--accent)" },
};

export function StatusBadge({ status, className = "" }: { status?: NoteStatus; className?: string }) {
  if (!status) return null;
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-2 font-mono2 text-[10.5px] tracking-[0.16em] uppercase text-muted ${className}`}>
      <span className="status-dot" style={{ background: meta.color, boxShadow: `0 0 8px ${meta.color}55` }} />
      {meta.label}
    </span>
  );
}

export function TypeChip({ type, className = "" }: { type: NoteType; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono2 text-[10px] tracking-[0.16em] uppercase ${className}`}
      style={{ color: TYPE_COLOR[type] }}
    >
      <span className="inline-block w-[5px] h-[5px] rotate-45" style={{ background: TYPE_COLOR[type] }} />
      {TYPE_LABEL[type]}
    </span>
  );
}

export function TagList({ tags, to = true }: { tags: string[]; to?: boolean }) {
  if (!tags.length) return null;
  return (
    <span className="flex flex-wrap gap-x-3 gap-y-1">
      {tags.map((t) =>
        to ? (
          <Link key={t} to={`/knowledge?tag=${t}`} className="font-mono2 text-[11px] text-faint hover:text-accent transition-colors">
            #{t}
          </Link>
        ) : (
          <span key={t} className="font-mono2 text-[11px] text-faint">
            #{t}
          </span>
        )
      )}
    </span>
  );
}

/* ————— section kickers: "§ 01 — KNOWLEDGE" ————— */

export function Kicker({ index, children, className = "" }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`kicker flex items-center gap-3 ${className}`}>
      {index && <span className="text-accent">{index}</span>}
      <span className="h-px w-8 bg-line inline-block" />
      {children}
    </div>
  );
}

/* ————— reveal-on-scroll ————— */

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("is-in");
            io.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

/* ————— animated counter ————— */

export function useCountUp(target: number, start: boolean, duration = 1100): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return value;
}

export function useInView<T extends HTMLElement>(threshold = 0.3): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (setInView(true), io.disconnect())),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ————— note row: the workhorse list item ————— */

export function NoteRow({ note, showDate = false }: { note: VaultNote; showDate?: boolean }) {
  return (
    <Link
      to={`/note/${note.slug}`}
      className="group grid grid-cols-[1fr_auto] md:grid-cols-[110px_1fr_auto] items-baseline gap-x-4 gap-y-1 py-4 border-b border-linesoft hover:bg-panel transition-colors px-2 -mx-2"
    >
      <span className="hidden md:flex flex-col gap-1">
        <TypeChip type={note.meta.type} />
        {note.meta.status && <StatusBadge status={note.meta.status} />}
      </span>
      <span className="min-w-0">
        <span className="block font-display font-medium text-[16.5px] leading-snug group-hover:text-accent transition-colors">
          {note.meta.title}
        </span>
        {note.meta.description && (
          <span className="block text-[13px] text-muted leading-relaxed mt-0.5 line-clamp-1">
            {note.meta.description}
          </span>
        )}
        <span className="md:hidden flex items-center gap-3 mt-1.5">
          <TypeChip type={note.meta.type} />
          {note.meta.status && <StatusBadge status={note.meta.status} />}
        </span>
      </span>
      <span className="flex items-center gap-4 justify-self-end">
        <span className="font-mono2 text-[10.5px] tracking-[0.12em] uppercase text-faint text-right hidden sm:block">
          {categoryLabel(note.category)}
          {showDate && note.meta.updated && (
            <span className="block mt-0.5 text-muted">{formatDate(note.meta.updated)}</span>
          )}
        </span>
        <ArrowUpRight
          size={15}
          className="text-faint group-hover:text-accent transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </span>
    </Link>
  );
}

export function formatDate(iso: string): string {
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
