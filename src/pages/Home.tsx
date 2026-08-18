/**
 * Home — opens on the lab itself: wordmark, living constellation, live stats.
 */

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Compass, Network } from "lucide-react";
import { vault } from "../engine/vault";
import { topConnected } from "../engine/graph";
import KnowledgeGraph from "../components/KnowledgeGraph";
import { Kicker, NoteRow, Reveal, useCountUp, useInView, formatDate } from "../components/ui";

function Stat({ value, label, started, suffix = "" }: { value: number; label: string; started: boolean; suffix?: string }) {
  const v = useCountUp(value, started);
  return (
    <div className="px-5 py-6 sm:px-7">
      <div className="font-display font-semibold text-[clamp(1.7rem,3.4vw,2.5rem)] leading-none tabular-nums">
        {v.toLocaleString()}
        {suffix}
      </div>
      <div className="font-mono2 text-[10px] tracking-[0.2em] uppercase text-muted mt-2.5">{label}</div>
    </div>
  );
}

export default function Home() {
  const { stats, recent, categories } = vault;
  const constellation = useMemo(() => topConnected(18), []);
  const [statsRef, statsInView] = useInView<HTMLDivElement>(0.25);

  return (
    <div className="max-w-6xl mx-auto px-5">
      {/* ————— opening: the lab, not a hero ————— */}
      <section className="pt-14 md:pt-20 pb-10 grid lg:grid-cols-[1.05fr_1fr] gap-10 items-center">
        <div>
          <Kicker index="§01">Personal research vault</Kicker>
          <h1 className="mt-6 font-display font-bold leading-[0.94] tracking-[-0.03em] text-[clamp(3.4rem,9vw,6.8rem)]">
            <Reveal className="block">
              <span className="reveal-mask">
                <span>KYROS</span>
              </span>
            </Reveal>
            <Reveal delay={120} className="block text-transparent" >
              <span className="reveal-mask">
                <span style={{ WebkitTextStroke: "1px var(--muted)" }}>AI LAB</span>
              </span>
            </Reveal>
          </h1>
          <Reveal delay={220}>
            <p className="font-mono2 text-[11px] tracking-[0.3em] uppercase text-accent mt-6">
              Knowledge · Graph · Research
            </p>
            <p className="font-serif2 italic text-muted text-[17px] leading-relaxed mt-4 max-w-md">
              “An evolving map of artificial intelligence — written by hand in Markdown,
              connected by machine, rendered as a living graph.”
            </p>
          </Reveal>
          <Reveal delay={320}>
            <div className="flex flex-wrap items-center gap-3.5 mt-8">
              <Link
                to="/knowledge"
                className="group inline-flex items-center gap-2.5 bg-accent text-bg font-mono2 text-[11.5px] tracking-[0.16em] uppercase px-5 py-3 rounded-md hover:brightness-110 transition-all"
              >
                Browse knowledge
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/graph"
                className="group inline-flex items-center gap-2.5 border border-line font-mono2 text-[11.5px] tracking-[0.16em] uppercase px-5 py-3 rounded-md text-muted hover:text-ink hover:border-faint transition-colors"
              >
                <Network size={14} className="text-accent" />
                Open the graph
              </Link>
            </div>
            <div className="flex items-center gap-2.5 mt-9 font-mono2 text-[10.5px] tracking-[0.16em] uppercase text-faint">
              <span className="pulse-dot" />
              vault online — {stats.totalNotes} notes indexed · {stats.graphEdges} edges resolved
            </div>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <div className="relative">
            <div className="kicker absolute -top-7 left-1 z-10">
              <span className="text-accent">fig. 0</span>
              <span className="h-px w-6 bg-line inline-block mx-3 align-middle" />
              live constellation · {constellation.nodes.length} nodes
            </div>
            <KnowledgeGraph data={constellation} height={430} dimUnrelated={false} />
          </div>
        </Reveal>
      </section>

      {/* ————— automatic statistics ————— */}
      <section className="mt-8">
        <Reveal>
          <Kicker index="§02">Knowledge — computed from the vault</Kicker>
        </Reveal>
        <div ref={statsRef} className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border border-line rounded-lg bg-panel overflow-hidden [&>*]:border-r [&>*]:border-b [&>*]:border-linesoft">
          <Stat value={stats.totalNotes} label="Notes" started={statsInView} />
          <Stat value={stats.concepts} label="Concepts" started={statsInView} />
          <Stat value={stats.papers} label="Papers" started={statsInView} />
          <Stat value={stats.projects} label="Projects" started={statsInView} />
          <Stat value={stats.tags} label="Tags" started={statsInView} />
          <Stat value={stats.graphEdges} label="Edges" started={statsInView} />
        </div>
      </section>

      {/* ————— continue learning ————— */}
      <section className="mt-20 grid lg:grid-cols-[220px_1fr] gap-8">
        <Reveal>
          <Kicker index="§03">Continue learning</Kicker>
          <p className="text-[13px] text-muted leading-relaxed mt-4 max-w-[200px]">
            The most recently revised notes in the vault.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <div>
            {recent.slice(0, 6).map((n) => (
              <NoteRow key={n.slug} note={n} showDate />
            ))}
            <Link
              to="/knowledge"
              className="group inline-flex items-center gap-2 mt-5 font-mono2 text-[11px] tracking-[0.16em] uppercase text-muted hover:text-accent transition-colors"
            >
              All {stats.totalNotes} notes
              <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ————— explore ————— */}
      <section className="mt-20">
        <Reveal>
          <Kicker index="§04">Explore</Kicker>
        </Reveal>
        <div className="mt-6 border-t border-line">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 60}>
              <Link
                to={`/category/${c.id}`}
                className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 py-5 border-b border-line hover:bg-panel transition-colors px-2 -mx-2"
              >
                <span className="font-mono2 text-[11px] text-faint tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="font-display font-medium text-[clamp(1.15rem,2.4vw,1.6rem)] tracking-tight group-hover:text-accent transition-colors">
                    {c.label}
                  </span>
                  <span className="block font-mono2 text-[10px] tracking-[0.16em] uppercase text-faint mt-1">
                    {c.count} note{c.count === 1 ? "" : "s"}
                    {c.subs.length > 0 && <span className="text-muted"> · {c.subs.map((s) => s.label).join(" · ")}</span>}
                  </span>
                </span>
                <ArrowUpRight
                  size={17}
                  className="text-faint justify-self-end group-hover:text-accent transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ————— research desk ————— */}
      {vault.notes.some((n) => n.meta.type === "research") && (
        <section className="mt-20 grid lg:grid-cols-[220px_1fr] gap-8">
          <Reveal>
            <Kicker index="§05">Research desk</Kicker>
            <p className="text-[13px] text-muted leading-relaxed mt-4 max-w-[200px]">
              Hypotheses growing out of the connected notes.
            </p>
          </Reveal>
          <div className="space-y-4">
            {vault.notes
              .filter((n) => n.meta.type === "research")
              .map((n, i) => (
                <Reveal key={n.slug} delay={i * 80}>
                  <Link
                    to={`/note/${n.slug}`}
                    className="group block border border-line rounded-lg bg-panel p-5 hover:border-faint hover:-translate-y-0.5 transition-all"
                  >
                    <div className="flex items-center gap-3 font-mono2 text-[10px] tracking-[0.18em] uppercase text-blush">
                      <Compass size={12} />
                      Research · {n.meta.updated ? formatDate(n.meta.updated) : ""}
                    </div>
                    <div className="font-display font-medium text-[17px] mt-2.5 group-hover:text-accent transition-colors">
                      {n.meta.title}
                    </div>
                    {n.meta.hypothesis && (
                      <p className="font-serif2 italic text-muted text-[14.5px] leading-relaxed mt-2 line-clamp-2">
                        “{n.meta.hypothesis}”
                      </p>
                    )}
                  </Link>
                </Reveal>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
