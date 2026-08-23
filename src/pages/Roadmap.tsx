/**
 * /roadmap — learning path derived purely from `prerequisites:` frontmatter.
 * Nothing here is hardcoded: stages = topological depth in the prereq DAG.
 */

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { buildRoadmap } from "../engine/graph";
import { Kicker, Reveal, StatusBadge, STATUS_META, TYPE_COLOR } from "../components/ui";

export default function Roadmap() {
  const { stages, spine } = buildRoadmap();

  return (
    <div className="max-w-6xl mx-auto px-5 pt-14">
      <Kicker index="§">Learning roadmap</Kicker>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
        <h1 className="font-display font-bold tracking-[-0.025em] text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.05]">
          From axioms
          <br />
          <span className="text-accent">to agents.</span>
        </h1>
        <p className="text-[13.5px] text-muted max-w-xs leading-relaxed pb-1">
          Computed from <code className="font-mono2 text-[11.5px] text-accent">prerequisites:</code> fields in the vault.
          Stage {stages.length - 1} is the current frontier.
        </p>
      </div>

      {/* critical path */}
      <Reveal className="mt-10">
        <div className="border border-line rounded-lg bg-panel px-5 py-5 overflow-x-auto">
          <div className="kicker mb-4">
            <span className="text-accent">critical path</span> — longest prerequisite chain
          </div>
          <div className="flex items-center gap-2.5 whitespace-nowrap min-w-fit">
            {spine.map((n, i) => (
              <span key={n.slug} className="flex items-center gap-2.5">
                <Link
                  to={`/note/${n.slug}`}
                  className={`font-mono2 text-[11.5px] tracking-[0.06em] px-3 py-1.5 rounded-md border transition-colors ${
                    i === spine.length - 1
                      ? "border-accent text-accent bg-accentsoft"
                      : "border-line text-muted hover:text-ink hover:border-faint"
                  }`}
                >
                  {n.slug}
                </Link>
                {i < spine.length - 1 && <ArrowRight size={12} className="text-faint flex-none" />}
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      {/* stages */}
      <div className="mt-12 space-y-0">
        {stages.map((stage, si) => (
          <Reveal key={stage.index} delay={si * 60}>
            <section className="relative grid md:grid-cols-[220px_1fr] gap-6 py-8 border-t border-line">
              {/* connector node */}
              <div className="hidden md:block absolute left-[220px] top-0 bottom-0 w-px bg-linesoft -translate-x-1/2" aria-hidden />
              <div className="relative">
                <span
                  className="absolute -left-[7px] top-2 hidden md:block w-[13px] h-[13px] rounded-full border-2 border-bg"
                  style={{ background: si === stages.length - 1 ? "var(--accent)" : "var(--faint)" }}
                  aria-hidden
                />
                <div className="md:pl-6">
                  <div className="font-mono2 text-[10px] tracking-[0.22em] uppercase text-faint">
                    Stage {String(stage.index).padStart(2, "0")}
                  </div>
                  <h2 className="font-display font-semibold text-[1.35rem] tracking-tight mt-1.5">{stage.label}</h2>
                  <div className="font-mono2 text-[10.5px] tracking-[0.14em] uppercase text-muted mt-2">
                    {stage.notes.length} concept{stage.notes.length === 1 ? "" : "s"}
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {stage.notes.map((n) => (
                  <Link
                    key={n.slug}
                    to={`/note/${n.slug}`}
                    className="group flex items-center justify-between gap-3 border border-line rounded-md px-4 py-3.5 bg-panel hover:border-accent/50 hover:-translate-y-0.5 transition-all"
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span
                        className="status-dot"
                        style={{
                          background: n.meta.status ? STATUS_META[n.meta.status].color : "var(--faint)",
                          boxShadow: n.meta.status ? `0 0 8px ${STATUS_META[n.meta.status].color}55` : undefined,
                        }}
                      />
                      <span className="min-w-0">
                        <span className="block font-display font-medium text-[14.5px] leading-tight group-hover:text-accent transition-colors truncate">
                          {n.meta.title}
                        </span>
                        {n.meta.status && <StatusBadge status={n.meta.status} className="mt-1" />}
                      </span>
                    </span>
                    <span
                      className="w-[6px] h-[6px] rotate-45 flex-none"
                      style={{ background: TYPE_COLOR[n.meta.type] }}
                    />
                  </Link>
                ))}
              </div>
            </section>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10 border border-line rounded-lg bg-panel px-5 py-5">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="kicker">
            <span className="text-accent">how this is built</span>
          </span>
          <span className="font-mono2 text-[11px] text-muted">
            stage(n) = 1 + max(stage(prereq)) — a topological layering of every <span className="text-accent">prerequisites:</span> list in the vault.
          </span>
        </div>
      </Reveal>
    </div>
  );
}
