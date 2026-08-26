/**
 * Home — opens with what this lab actually is: a living map of the vault.
 */

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Search } from "lucide-react";
import { vault } from "../engine/vault";
import { buildFileSystemGraph } from "../engine/filesystem-graph";
import FileSystemGraph from "../components/FileSystemGraph";
import { Kicker, Reveal, TagList, TYPE_COLOR } from "../components/ui";

export default function Home() {
  const { categories } = vault;
  const fileSystemGraph = useMemo(() => buildFileSystemGraph(), []);
  const territoryCount = fileSystemGraph.nodes.filter(
    (node) => node.type === "folder" && node.parentId === "root"
  ).length;
  const papers = vault.notes.filter((n) => n.meta.type === "paper");

  const citeCount = (slug: string) =>
    vault.notes.filter((n) => n.slug !== slug && n.meta.concepts.includes(slug)).length;

  return (
    <div className="max-w-6xl mx-auto px-5">
      {/* ————— hero ————— */}
      <section className="home-hero grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center pt-16 lg:pt-24 pb-8">
        <div className="home-hero-copy">
          <Reveal>
            <div className="home-hero-status">
              <span className="pulse-dot" aria-hidden="true" />
              <span>Knowledge system online</span>
            </div>
          </Reveal>
          <Reveal>
            <h1 className="home-hero-title font-display font-bold tracking-[-0.035em] leading-[0.96] text-[clamp(3.5rem,8vw,6.2rem)]">
              Keas<span className="home-hero-ai text-accent">AI</span>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="home-hero-tagline font-display font-medium text-accent">Learn AI with KeasAI Labs</p>
          </Reveal>

          <Reveal delay={220}>
            <p className="mt-7 text-[16px] text-muted leading-relaxed max-w-[54ch]">
              An evolving map of artificial intelligence — concepts, papers, and projects woven into one
              explorable graph.
            </p>
          </Reveal>

          <Reveal delay={300}>
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
              <span className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-faint">
                <span className="pulse-dot !w-[5px] !h-[5px]" aria-hidden="true" />
                Living vault map
              </span>
              <Link to="/graph" className="flex items-center gap-1 text-[12px] font-semibold text-accent hover:brightness-110 transition-all">
                Open graph <ArrowUpRight size={12} />
              </Link>
            </div>
            <FileSystemGraph data={fileSystemGraph} height={400} className="!border-0 !rounded-xl" />
          </div>
        </Reveal>
      </section>

      {/* ————— stats band ————— */}

      {/* ————— learning essentials ————— */}
      <section className="mt-24">
        <Reveal>
          <Kicker>Learning essentials</Kicker>
          <h2 className="mt-4 font-display font-bold tracking-tight text-[clamp(1.7rem,3.5vw,2.4rem)]">
            A clear route through the ideas
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
            Build durable understanding by moving from first principles to working systems, one connected idea at a time.
          </p>
        </Reveal>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            {
              number: "01",
              title: "Start with foundations",
              text: "Strengthen the mathematics, Python, and problem-solving habits that make advanced AI easier to understand.",
              to: "/knowledge",
              action: "Open foundations",
            },
            {
              number: "02",
              title: "Connect the core ideas",
              text: "Follow how models, papers, and techniques build on one another instead of studying each topic in isolation.",
              to: "/graph",
              action: "Explore connections",
            },
            {
              number: "03",
              title: "Learn by building",
              text: "Turn each concept into an experiment or project, then record what worked, what failed, and what changed.",
              to: "/research",
              action: "See research work",
            },
          ].map((item, i) => (
            <Reveal key={item.number} delay={i * 80}>
              <Link
                to={item.to}
                className="lift group block h-full rounded-2xl border border-line bg-panel p-6 hover:border-accent/40"
              >
                <div className="font-mono2 text-[11px] tracking-[0.12em] text-accent">{item.number}</div>
                <h3 className="mt-7 font-display font-semibold text-[18px] tracking-tight group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{item.text}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold text-accent">
                  {item.action} <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ————— explore categories ————— */}
      <section className="mt-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Kicker>Explore</Kicker>
            <h2 className="mt-4 font-display font-bold tracking-tight text-[clamp(1.7rem,3.5vw,2.4rem)]">
              {territoryCount} {territoryCount === 1 ? "territory" : "territories"}, one graph
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
                { n: "01", t: "Write Markdown", d: "Drop a .md file anywhere in the vault. Frontmatter is optional metadata — the body is the truth." },
                { n: "02", t: "Build discovers it", d: "Recursive discovery parses frontmatter, wikilinks, headings and math into a typed index." },
                { n: "03", t: "The graph updates", d: "Routes, search, categories, relationships and statistics regenerate automatically." },
              ].map((s, i) => (
                <div key={s.n} className="relative">
                  {i < 2 && (
                    <div className="hidden md:block absolute top-5 left-[calc(100%-1.25rem)] w-[calc(100%-3.5rem)] h-px bg-line" aria-hidden>
                      <ArrowRight size={12} className="absolute -right-1 -top-[5.5px] text-faint" />
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-full border border-line bg-panel2 flex items-center justify-center font-mono2 text-[12px] text-accent">
                    {s.n}
                  </div>
                  <div className="mt-4 font-display font-semibold text-[16.5px] tracking-tight">{s.t}</div>
                  <p className="mt-2 text-[13.5px] text-muted leading-relaxed">{s.d}</p>
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