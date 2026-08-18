/**
 * /research — every note with `type: research`, hypothesis first.
 */

import { Link } from "react-router-dom";
import { ArrowUpRight, Compass, FlaskConical } from "lucide-react";
import { vault } from "../engine/vault";
import { Kicker, Reveal, StatusBadge, TagList, formatDate, TYPE_COLOR } from "../components/ui";
import type { VaultNote } from "../engine/types";

const ANATOMY = [
  "Hypothesis",
  "Motivation",
  "Literature",
  "Mathematical formulation",
  "Proposed architecture",
  "Experiments",
  "Results",
  "Limitations",
  "Open questions",
];

const resolveLinks = (n: VaultNote): VaultNote[] =>
  n.outLinks
    .map((s) => vault.bySlug.get(s))
    .filter((x): x is VaultNote => x !== undefined && x.meta.type === "concept");

export default function Research() {
  const notes = vault.notes
    .filter((n) => n.meta.type === "research")
    .sort((a, b) => (b.meta.updated ?? "").localeCompare(a.meta.updated ?? ""));

  return (
    <div className="max-w-6xl mx-auto px-5 pt-14">
      <Kicker index="§">Research desk</Kicker>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
        <h1 className="font-display font-bold tracking-tight text-[clamp(2.2rem,5vw,3.4rem)] leading-none">
          Ideas that
          <br />
          <span className="text-transparent" style={{ WebkitTextStroke: "1px var(--muted)" }}>
            grew from notes.
          </span>
        </h1>
        <p className="text-[13.5px] text-muted max-w-xs leading-relaxed pb-1">
          Research notes are Markdown files with <code className="font-mono2 text-[11.5px] text-accent">type: research</code>.
          They surface here automatically, hypotheses and all.
        </p>
      </div>

      <div className="mt-12 grid lg:grid-cols-[1fr_260px] gap-10 items-start">
        <div className="space-y-6">
          {notes.length === 0 && (
            <div className="border border-line rounded-lg bg-panel px-6 py-12 text-center">
              <FlaskConical size={20} className="text-faint mx-auto" />
              <p className="text-muted text-[13.5px] mt-4">
                No research notes yet — add a file with <code className="font-mono2 text-accent text-[12px]">type: research</code> to the vault.
              </p>
            </div>
          )}
          {notes.map((n, i) => {
            const concepts = resolveLinks(n);
            return (
              <Reveal key={n.slug} delay={i * 80}>
                <Link
                  to={`/note/${n.slug}`}
                  className="group block border border-line rounded-lg bg-panel p-6 sm:p-7 hover:border-blush/60 hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="flex items-center gap-2 font-mono2 text-[10px] tracking-[0.18em] uppercase text-blush">
                      <Compass size={12} />
                      Research
                    </span>
                    <StatusBadge status={n.meta.status} />
                    {n.meta.updated && (
                      <span className="font-mono2 text-[10px] tracking-[0.14em] uppercase text-faint">
                        {formatDate(n.meta.updated)}
                      </span>
                    )}
                    <ArrowUpRight
                      size={15}
                      className="ml-auto text-faint group-hover:text-blush transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                  <h2 className="font-display font-semibold text-[1.45rem] tracking-tight mt-3.5 group-hover:text-accent transition-colors">
                    {n.meta.title}
                  </h2>
                  {n.meta.hypothesis && (
                    <blockquote className="font-serif2 italic text-muted text-[15.5px] leading-relaxed mt-3 border-l-2 border-blush/60 pl-4">
                      “{n.meta.hypothesis}”
                    </blockquote>
                  )}
                  {n.meta.description && !n.meta.hypothesis && (
                    <p className="text-muted text-[14px] leading-relaxed mt-3">{n.meta.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5">
                    {concepts.length > 0 && (
                      <span className="font-mono2 text-[10.5px] tracking-[0.1em] text-faint">
                        builds on{" "}
                        <span className="text-muted">
                          {concepts.map((c) => c.meta.title).join(" · ")}
                        </span>
                      </span>
                    )}
                    <TagList tags={n.meta.tags} />
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <aside className="lg:sticky lg:top-24">
          <Reveal delay={150}>
            <div className="border border-line rounded-lg bg-panel p-5">
              <div className="kicker mb-4">Anatomy of a research note</div>
              <ol className="space-y-2.5">
                {ANATOMY.map((a, i) => (
                  <li key={a} className="flex items-baseline gap-3 text-[13px] text-muted">
                    <span className="font-mono2 text-[10px] text-faint tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    {a}
                  </li>
                ))}
              </ol>
              <p className="font-mono2 text-[10.5px] leading-relaxed text-faint mt-5 pt-4 border-t border-linesoft">
                Every section is optional Markdown — the lab renders whatever you write.
              </p>
            </div>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-4 border border-line rounded-lg bg-panel p-5">
              <div className="kicker mb-3.5">Research signals</div>
              {[
                ["active hypotheses", notes.length],
                ["referenced concepts", new Set(notes.flatMap(resolveLinks).map((c) => c.slug)).size],
                ["tagged #research", vault.notes.filter((n) => n.meta.tags.includes("research")).length],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between items-baseline py-1.5">
                  <span className="font-mono2 text-[10.5px] tracking-[0.12em] uppercase text-muted">{label}</span>
                  <span className="font-display font-semibold text-[17px]" style={{ color: "var(--blush)" }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
          <div className="mt-4 font-mono2 text-[10px] tracking-[0.14em] uppercase text-faint flex items-center gap-2">
            <span className="w-[6px] h-[6px] rotate-45" style={{ background: TYPE_COLOR.research }} />
            type: research
          </div>
        </aside>
      </div>
    </div>
  );
}
