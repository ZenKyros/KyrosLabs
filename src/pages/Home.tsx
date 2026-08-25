/**
 * Home — opens with what this lab actually is: a living map of the vault.
 */

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Search } from "lucide-react";
import { vault, categoryLabel } from "../engine/vault";
import { topConnected } from "../engine/graph";
import KnowledgeGraph from "../components/KnowledgeGraph";
import { Kicker, NoteRow, Reveal, TagList, TypeChip, formatDate, useCountUp, useInView, TYPE_COLOR } from "../components/ui";

function Stat({ value, label, start }: { value: number; label: string; start: boolean }) {
  const n = useCountUp(value, start);
  return (
    <div className="px-6 py-1 first:pl-0">
      <div className="font-display font-bold text-[2.1rem] leading-none tracking-tight tabular-nums">{n}</div>
      <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-faint mt-2.5">{label}</div>
    </div>
  );
}

export default function Home() {
  const { stats, recent, categories } = vault;
  const constellation = useMemo(() => topConnected(18), []);
  const papers = vault.notes.filter((n) => n.meta.type === "paper");
  const [statsRef, statsInView] = useInView<HTMLDivElement>(0.4);

  const citeCount = (slug: string) =>
    vault.notes.filter((n) => n.slug !== slug && n.meta.concepts.includes(slug)).length;

  return (
    <div className="max-w-6xl mx-auto px-5">
      {/* ————— hero ————— */}
      <section className="grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center pt-16 lg:pt-24 pb-8">
        <div>
          <Reveal>
            <h1 className="font-display font-bold tracking-[-0.035em] leading-[1.02] text-[clamp(3rem,7.5vw,5.4rem)]">
              <Reveal delay={80}>
                <span className="reveal-mask">
                  <span>
                    Keas<span className="text-accent">AI</span>
                  </span>
                </span>
              </Reveal>
              <br />
              <Reveal delay={180}>
                <span className="reveal-mask">
                  <span>
                    <em className="keasai-glitter font-sans font-mono2 font-medium text-accent text-[0.65em]">Learn AI with KeasAI Labs</em>
                  </span>
                </span>
              </Reveal>
            </h1>
          </Reveal>

          <Reveal delay={280}>
            <p className="mt-7 text-[16px] text-muted leading-relaxed max-w-[54ch]">
              An evolving map of artificial intelligence — concepts, papers, and projects woven into one
              explorable graph.
            </p>
          </Reveal>

          <Reveal delay={360}>
            <div className="mt-9 flex flex-wrap items-center gap-3.5">
              <Link
                to="/knowledge"
                className="group inline-flex items-center gap-2.5 bg-accent text-accentink rounded-full px-6 py-3.5 text-[14px] font-semibold shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow)] hover:-translate-y-0.5 transition-all"
              >
                Explore the knowledge
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/graph"
                className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-panel px-6 py-3.5 text-[14px] font-semibold text-ink hover:border-faint hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)] transition-all"
              >
                View the graph
                <ArrowUpRight size={15} className="text-faint group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* live constellation */}
        <Reveal delay={200}>
          <div className="rounded-2xl border border-line bg-panel p-2.5 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
              <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-faint">
                Most connected notes
              </span>
              <Link to="/graph" className="flex items-center gap-1 text-[12px] font-semibold text-accent hover:brightness-110 transition-all">
                Open graph <ArrowUpRight size={12} />
              </Link>
            </div>
            <KnowledgeGraph data={constellation} height={400} className="!border-0 !rounded-xl" dimUnrelated={false} />
          </div>
        </Reveal>
      </section>

      {/* ————— stats band ————— */}
      <Reveal>
        <div
          ref={statsRef as React.RefObject<HTMLDivElement>}
          className="mt-10 rounded-2xl border border-line bg-panel shadow-[var(--shadow-sm)] flex flex-wrap items-center divide-x divide-linesoft"
        >
          <Stat value={stats.totalNotes} label="Notes" start={statsInView} />
          <Stat value={stats.concepts} label="Concepts" start={statsInView} />
          <Stat value={stats.papers} label="Papers" start={statsInView} />
          <Stat value={stats.graphEdges} label="Graph edges" start={statsInView} />
          <Stat value={stats.words} label="Words written" start={statsInView} />
        </div>
      </Reveal>

      {/* ————— continue learning ————— */}
      <section className="mt-24">
        <div>
          <Reveal>
            <Kicker>Continue learning</Kicker>
            <h2 className="mt-4 font-display font-bold tracking-tight text-[clamp(1.7rem,3.5vw,2.4rem)]">
              Recently in the vault
            </h2>
          </Reveal>
          <div className="mt-6">
            {recent.slice(0, 5).map((n, i) => (
              <Reveal key={n.slug} delay={i * 60}>
                <NoteRow note={n} showDate />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ————— explore categories ————— */}
      <section className="mt-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Kicker>Explore</Kicker>
            <h2 className="mt-4 font-display font-bold tracking-tight text-[clamp(1.7rem,3.5vw,2.4rem)]">
              Seven territories, one graph
            </h2>
          </div>
          <Link to="/knowledge" className="group inline-flex items-center gap-2 text-[13.5px] font-semibold text-muted hover:text-accent transition-colors pb-1">
            All notes <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={(i % 3) * 80}>
              <Link
                to={`/category/${c.id}`}
                className="lift group block h-full rounded-2xl border border-line bg-panel p-6 hover:border-accent/40"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono2 text-[11px] text-faint">{String(i + 1).padStart(2, "0")}</span>
                  <ArrowUpRight size={16} className="text-faint group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </div>
                <div className="mt-6 font-display font-bold text-[1.3rem] tracking-tight group-hover:text-accent transition-colors">
                  {c.label}
                </div>
                <div className="mt-1.5 text-[12.5px] text-muted">
                  {c.count} notes{c.subs.length > 0 && c.subs[0]
                    ? ` · ${c.subs.map((s) => s.label).join(", ")}`
                    : ""}
                </div>
                <div className="mt-4 pt-4 border-t border-linesoft">
                  <TagList
                    tags={[
                      ...new Set(
                        vault.notes
                          .filter((n) => n.category === c.id)
                          .flatMap((n) => n.meta.tags)
                      ),
                    ].slice(0, 3)}
                  />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ————— papers ————— */}
      <section className="mt-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Kicker>Paper trail</Kicker>
            <h2 className="mt-4 font-display font-bold tracking-tight text-[clamp(1.7rem,3.5vw,2.4rem)]">
              Ideas worth their citations
            </h2>
          </div>
          <Link to="/knowledge?type=paper" className="group inline-flex items-center gap-2 text-[13.5px] font-semibold text-muted hover:text-accent transition-colors pb-1">
            All papers <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>
        <div className="mt-8 grid md:grid-cols-2 xl:grid-cols-5 gap-4">
          {papers.slice(0, 5).map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <Link
                to={`/note/${p.slug}`}
                className="lift group flex h-full flex-col rounded-2xl border border-line bg-panel p-6 hover:border-gold/50"
              >
                <div className="font-serif2 font-semibold text-[2.4rem] leading-none" style={{ color: TYPE_COLOR.paper }}>
                  {p.meta.year}
                </div>
                <div className="mt-5 font-display font-semibold text-[15.5px] leading-snug tracking-tight group-hover:text-accent transition-colors">
                  {p.meta.title}
                </div>
                <div className="mt-2 text-[12px] text-faint leading-relaxed">
                  {p.meta.authors?.slice(0, 3).join(", ")}
                  {(p.meta.authors?.length ?? 0) > 3 ? " et al." : ""}
                </div>
                <div className="mt-auto pt-5 text-[11.5px] font-medium text-muted">
                  introduces {p.meta.concepts.length} concept{p.meta.concepts.length === 1 ? "" : "s"} · cited by{" "}
                  {citeCount(p.slug)} note{citeCount(p.slug) === 1 ? "" : "s"}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ————— how it works ————— */}
      <section className="mt-24">
        <Reveal>
          <div className="rounded-2xl border border-line bg-panel p-8 md:p-10 shadow-[var(--shadow-sm)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Kicker>Content pipeline</Kicker>
              <code className="font-mono2 text-[12px] text-muted bg-panel2 border border-linesoft rounded-md px-3 py-1.5">
                src/content/vault/**/*.md
              </code>
            </div>
            <div className="mt-8 grid md:grid-cols-3 gap-8">
  {[
    {
      n: "01",
      t: "Learn",
      d: "Explore new ideas, concepts, and technologies through study, experiments, and hands-on work.",
    },
    {
      n: "02",
      t: "Document",
      d: "Regularly turn what you learn, build, and discover into structured notes and topics.",
    },
    {
      n: "03",
      t: "Connect",
      d: "KeasAI organizes everything into a growing, connected knowledge graph that evolves with me.",
    },
  ].map((s, i) => (
    <div key={s.n} className="relative">
  

      <div className="w-10 h-10 rounded-full border border-line bg-panel2 flex items-center justify-center font-mono2 text-[12px] text-accent">
        {s.n}
      </div>

      <div className="mt-4 font-display font-semibold text-[16.5px] tracking-tight">
        {s.t}
      </div>

      <p className="mt-2 text-[13.5px] text-muted leading-relaxed">
        {s.d}
      </p>
    </div>
  ))}
</div>
            <div className="mt-9 pt-7 border-t border-linesoft flex flex-wrap items-center gap-4">
              <Search size={15} className="text-faint" />
              <span className="text-[13.5px] text-muted">
                Looking for something specific? Search every note, tag, paper and concept instantly —
              </span>
              <kbd className="kbd">⌘</kbd>
              <kbd className="kbd">K</kbd>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
