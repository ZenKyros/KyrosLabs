/**
 * /note/:slug — the reading room. Content dominates; chrome whispers.
 * Right rail: live table of contents. Bottom: every relationship the
 * vault engine derived for this note.
 */

import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, FileText, Network } from "lucide-react";
import { vault, getBacklinks, categoryLabel } from "../engine/vault";
import { youAreHere } from "../engine/graph";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { Kicker, Reveal, TagList, TypeChip, formatDate, TYPE_COLOR } from "../components/ui";
import type { VaultNote } from "../engine/types";

/* ————— table of contents with scrollspy ————— */

function Toc({ note }: { note: VaultNote }) {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const ids = note.headings.map((h) => h.id);
    if (!ids.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-90px 0px -65% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [note]);

  if (!note.headings.length) return null;
  return (
    <nav className="text-[12.5px]" aria-label="On this page">
      <div className="kicker mb-4">On this page</div>
      <ul className="border-l border-line">
        {note.headings.map((h) => (
          <li key={h.id}>
            <button
              onClick={() => document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className={`block w-full text-left py-[5px] border-l-2 -ml-px transition-all cursor-pointer ${
                h.depth === 3 ? "pl-6 text-[11.5px]" : "pl-3.5"
              } ${active === h.id ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink"}`}
            >
              {h.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ————— relationship link tiles (quiet, typographic) ————— */

function RelLink({ note, hint }: { note: VaultNote; hint?: string }) {
  return (
    <Link
      to={`/note/${note.slug}`}
      className="group flex items-center justify-between gap-3 border border-line rounded-md px-4 py-3 bg-panel hover:border-accent/50 hover:-translate-y-0.5 transition-all"
    >
      <span className="min-w-0">
        <span className="block font-display font-medium text-[14px] leading-tight group-hover:text-accent transition-colors truncate">
          {note.meta.title}
        </span>
        <span className="font-mono2 text-[9.5px] tracking-[0.14em] uppercase mt-1 block" style={{ color: TYPE_COLOR[note.meta.type] }}>
          {hint ?? note.meta.type}
        </span>
      </span>
      <ArrowUpRight size={14} className="text-faint group-hover:text-accent transition-colors flex-none" />
    </Link>
  );
}

function RelSection({ title, notes, hintFor }: { title: string; notes: VaultNote[]; hintFor?: (n: VaultNote) => string }) {
  if (!notes.length) return null;
  return (
    <div>
      <div className="kicker mb-3.5">{title}</div>
      <div className="grid sm:grid-cols-2 gap-2.5">
        {notes.map((n) => (
          <RelLink key={n.slug} note={n} hint={hintFor?.(n)} />
        ))}
      </div>
    </div>
  );
}

const resolve = (slugs: string[]): VaultNote[] =>
  slugs.map((s) => vault.bySlug.get(s)).filter((n): n is VaultNote => Boolean(n));

export default function NotePage() {
  const { slug } = useParams();
  const note = slug ? vault.bySlug.get(slug) : undefined;

  useEffect(() => {
    if (note) document.title = `${note.meta.title} — KeasAI`;
    return () => {
      document.title = "KeasAI — Learn AI from Scratch";
    };
  }, [note]);

  const rel = useMemo(() => {
    if (!note) return null;
    const prereqs = resolve(note.meta.prerequisites);
    const related = resolve(note.meta.related);
    const papers = resolve(note.meta.papers);
    const concepts = resolve(note.meta.concepts);
    const backlinks = getBacklinks(note.slug);
    const outConcepts = note.outLinks
      .map((s) => vault.bySlug.get(s))
      .filter((n): n is VaultNote => n !== undefined && n.meta.type === "concept" && !prereqs.some((p) => p.slug === n.slug) && !related.some((r) => r.slug === n.slug));
    const outPapers = note.outLinks
      .map((s) => vault.bySlug.get(s))
      .filter((n): n is VaultNote => n !== undefined && n.meta.type === "paper" && !papers.some((p) => p.slug === n.slug));
    const siblings = vault.notes
      .filter((n) => n.category === note.category && n.slug !== note.slug)
      .sort((a, b) => a.meta.title.localeCompare(b.meta.title));
    const next = siblings[0];
    return { prereqs, related, papers, concepts, backlinks, outConcepts, outPapers, next };
  }, [note]);

  if (!note || !rel) {
    return (
      <div className="max-w-3xl mx-auto px-5 pt-28 text-center">
        <div className="font-mono2 text-[12px] tracking-[0.2em] uppercase text-blush">404 · note not indexed</div>
        <h1 className="font-display font-bold text-3xl mt-4">"{slug}" is not in the vault yet.</h1>
        <p className="text-muted mt-3 text-[14px]">
          Create <code className="font-mono2 text-accent text-[12.5px]">src/content/vault/**/{slug}.md</code> and it will
          appear here automatically.
        </p>
        <Link to="/knowledge" className="inline-flex items-center gap-2 mt-8 font-mono2 text-[11px] tracking-[0.16em] uppercase text-accent">
          <ArrowLeft size={13} /> Back to knowledge
        </Link>
      </div>
    );
  }

  const crumbs = youAreHere(note);
  const minutes = Math.max(1, Math.round(note.wordCount / 220));
  const isPaper = note.meta.type === "paper";

  return (
    <div className="max-w-6xl mx-auto px-5 pt-10">
      {/* back + breadcrumbs ("you are here") */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <button
          onClick={() => history.length > 1 ? history.back() : undefined}
          className="group flex items-center gap-2 font-mono2 text-[10.5px] tracking-[0.16em] uppercase text-muted hover:text-ink transition-colors cursor-pointer"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>
        <nav className="flex flex-wrap items-center gap-2 font-mono2 text-[10.5px] tracking-[0.14em] uppercase text-faint" aria-label="You are here">
          <span className="text-accent">⌖ you are here</span>
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="text-line">→</span>
              {c.to ? (
                <Link to={c.to} className="hover:text-accent transition-colors">
                  {c.label}
                </Link>
              ) : (
                <span className="text-ink">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* ————— header ————— */}
      <header className="mt-10 max-w-3xl">
        <Reveal>
          <Kicker>
            <span className="text-accent">{categoryLabel(note.category)}</span>
            {note.subpath.length > 0 && (
              <span className="normal-case tracking-[0.14em]">/ {note.subpath.map((s) => categoryLabel(s)).join(" / ")}</span>
            )}
          </Kicker>
          <h1 className="font-display font-bold tracking-[-0.02em] leading-[1.04] text-[clamp(2rem,5.4vw,3.3rem)] mt-5">
            {note.meta.title}
          </h1>
          {note.meta.description && (
            <p className="font-serif2 italic text-muted text-[17.5px] leading-relaxed mt-5 max-w-xl">
              {note.meta.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 mt-6">
            <TypeChip type={note.meta.type} />
            {isPaper && note.meta.year && (
              <span className="font-mono2 text-[10.5px] tracking-[0.16em] uppercase text-gold">{note.meta.year}</span>
            )}
            {note.meta.authors && note.meta.authors.length > 0 && (
              <span className="font-mono2 text-[10.5px] tracking-[0.1em] text-muted">{note.meta.authors.join(" · ")}</span>
            )}
            {note.meta.updated && (
              <span className="font-mono2 text-[10.5px] tracking-[0.16em] uppercase text-faint">
                updated {formatDate(note.meta.updated)}
              </span>
            )}
            <span className="font-mono2 text-[10.5px] tracking-[0.16em] uppercase text-faint">
              {note.wordCount.toLocaleString()} words · {minutes} min
            </span>
          </div>

          {/* actions */}
          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href="#article"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("article")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 bg-accent text-bg font-mono2 text-[10.5px] tracking-[0.16em] uppercase px-4 py-2.5 rounded-md hover:brightness-110 transition-all"
            >
              <BookOpen size={13} /> Read
            </a>
            {rel.papers[0] && !isPaper && (
              <Link
                to={`/note/${rel.papers[0].slug}`}
                className="inline-flex items-center gap-2 border border-line font-mono2 text-[10.5px] tracking-[0.16em] uppercase px-4 py-2.5 rounded-md text-muted hover:text-gold hover:border-gold/50 transition-colors"
              >
                <FileText size={13} /> Source paper
              </Link>
            )}
            <Link
              to={`/graph?focus=${note.slug}`}
              className="inline-flex items-center gap-2 border border-line font-mono2 text-[10.5px] tracking-[0.16em] uppercase px-4 py-2.5 rounded-md text-muted hover:text-accent hover:border-accent/50 transition-colors"
            >
              <Network size={13} /> Graph
            </Link>
          </div>
        </Reveal>
      </header>

      {/* ————— article + toc ————— */}
      <div id="article" className="mt-12 grid lg:grid-cols-[minmax(0,1fr)_220px] gap-12 items-start">
        <Reveal delay={80}>
          <article className="max-w-[72ch]">
            <MarkdownRenderer
              body={note.body}
              // note's folder inside the vault — lets the renderer resolve
              // relative image/SVG paths like ./img.png or ../assets/x.webp
              basePath={note.path.includes("/") ? note.path.slice(0, note.path.lastIndexOf("/")) : ""}
            />
          </article>
        </Reveal>
        <aside className="hidden lg:block sticky top-24">
          <Toc note={note} />
          <div className="mt-10 pt-6 border-t border-linesoft">
            <div className="kicker mb-3.5">Explore this concept</div>
            <Link
              to={`/graph?focus=${note.slug}`}
              className="group block border border-line rounded-md p-4 bg-panel hover:border-accent/50 transition-colors"
            >
              <Network size={16} className="text-accent" />
              <span className="block font-mono2 text-[10px] tracking-[0.16em] uppercase text-muted mt-2.5 group-hover:text-ink transition-colors">
                Open focused graph
                <ArrowUpRight size={11} className="inline ml-1.5 group-hover:text-accent" />
              </span>
            </Link>
          </div>
          {note.meta.tags.length > 0 && (
            <div className="mt-8">
              <div className="kicker mb-3">Tags</div>
              <TagList tags={note.meta.tags} />
            </div>
          )}
        </aside>
      </div>

      {/* ————— derived relationships ————— */}
      <footer className="mt-20 border-t border-line pt-12 pb-4 max-w-4xl space-y-10">
        <Reveal>
          <div className="grid md:grid-cols-2 gap-10">
            <RelSection title="Prerequisites" notes={rel.prereqs} hintFor={() => "build up to this"} />
            <RelSection title="Related" notes={rel.related} hintFor={() => "connected idea"} />
          </div>
        </Reveal>
        <Reveal>
          <div className="grid md:grid-cols-2 gap-10">
            {(isPaper ? (
              <RelSection title="Concepts introduced" notes={rel.concepts} hintFor={() => "explained by this paper"} />
            ) : (
              <RelSection title="Papers" notes={[...rel.papers, ...rel.outPapers.filter((p) => !rel.papers.includes(p))]} hintFor={() => "primary source"} />
            ))}
            {!isPaper && <RelSection title="Referenced by" notes={rel.backlinks} hintFor={(n) => `${n.meta.type} · links here`} />}
          </div>
        </Reveal>

        {rel.next && (
          <Reveal>
            <Link
              to={`/note/${rel.next.slug}`}
              className="group flex items-center justify-between border border-line rounded-lg px-5 py-4 bg-panel hover:border-accent/50 transition-colors"
            >
              <span>
                <span className="kicker block mb-1.5">
                  Next in {categoryLabel(note.category)}
                </span>
                <span className="font-display font-semibold text-[18px] group-hover:text-accent transition-colors">
                  {rel.next.meta.title}
                </span>
              </span>
              <ArrowRight size={18} className="text-faint group-hover:text-accent group-hover:translate-x-1 transition-all" />
            </Link>
          </Reveal>
        )}
      </footer>
    </div>
  );
}
