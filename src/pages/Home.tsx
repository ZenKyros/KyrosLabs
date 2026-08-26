/**
 * Home — opens with what this lab actually is: a living map of the vault.
 */

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, ExternalLink, FileText, Newspaper, RefreshCw } from "lucide-react";
import { vault } from "../engine/vault";
import { buildFileSystemGraph } from "../engine/filesystem-graph";
import FileSystemGraph from "../components/FileSystemGraph";
import { Kicker, Reveal, TagList } from "../components/ui";

type PulseItem = {
  title: string;
  url: string;
  source: string;
  published: string;
  kind: "news" | "paper";
};

const NEWS_FEED = "https://news.google.com/rss/search?q=artificial+intelligence+when:7d&hl=en-US&gl=US&ceid=US:en";

function formatPulseDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
}

async function fetchPulse(): Promise<PulseItem[]> {
  const [newsResult, papersResult] = await Promise.allSettled([
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(NEWS_FEED)}`).then((response) => {
      if (!response.ok) throw new Error("News feed unavailable");
      return response.json();
    }),
    fetch("https://huggingface.co/api/daily_papers?limit=3").then((response) => {
      if (!response.ok) throw new Error("Papers feed unavailable");
      return response.json();
    }),
  ]);

  const news: PulseItem[] = newsResult.status === "fulfilled"
    ? (newsResult.value.items ?? []).slice(0, 3).map((item: { title: string; link: string; pubDate: string; author?: string }) => ({
        title: item.title,
        url: item.link,
        source: item.author || "AI news",
        published: item.pubDate,
        kind: "news",
      }))
    : [];
  const papers: PulseItem[] = papersResult.status === "fulfilled"
    ? (papersResult.value ?? []).slice(0, 3).map((item: { paper: { title: string; id: string; publishedAt?: string; authors?: { name: string }[] } }) => ({
        title: item.paper.title,
        url: `https://huggingface.co/papers/${item.paper.id}`,
        source: item.paper.authors?.[0]?.name ? `Hugging Face · ${item.paper.authors[0].name}` : "Hugging Face Papers",
        published: item.paper.publishedAt ?? new Date().toISOString(),
        kind: "paper",
      }))
    : [];

  return [...news, ...papers].sort((a, b) => +new Date(b.published) - +new Date(a.published));
}

function AIPulse() {
  const [items, setItems] = useState<PulseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      setItems(await fetchPulse());
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
    const interval = window.setInterval(() => void refresh(), 24 * 60 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="mt-24">
      <Reveal>
        <div className="rounded-2xl border border-line bg-panel p-8 md:p-10 shadow-[var(--shadow-sm)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Kicker>AI pulse</Kicker>
              <p className="mt-2 text-[13.5px] text-muted">Fresh headlines and newly surfaced papers from the AI world.</p>
            </div>
            <button
              type="button"
              onClick={() => void refresh()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-panel2 px-3.5 py-2 text-[12px] font-semibold text-muted hover:text-ink hover:border-faint transition-colors disabled:opacity-50"
              aria-label="Refresh AI news"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
          <div className="mt-8 grid md:grid-cols-2 gap-x-10 divide-y md:divide-y-0 md:divide-x divide-linesoft">
            {loading && !items.length ? (
              <p className="md:col-span-2 text-[13.5px] text-muted py-4">Checking the latest AI signals...</p>
            ) : items.length ? (
              items.map((item) => (
                <a
                  key={`${item.kind}-${item.url}`}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-3 py-4 first:pt-0 md:[&:nth-child(2)]:pt-0 md:[&:nth-child(odd)]:pr-8"
                >
                  <span className="flex-none mt-0.5 text-accent">{item.kind === "paper" ? <FileText size={15} /> : <Newspaper size={15} />}</span>
                  <span className="min-w-0">
                    <span className="block text-[14px] leading-snug font-medium text-ink group-hover:text-accent transition-colors">{item.title}</span>
                    <span className="mt-2 flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.1em] text-faint">
                      {item.kind === "paper" ? "Paper" : "News"} · {formatPulseDate(item.published)} · {item.source}
                      <ExternalLink size={11} />
                    </span>
                  </span>
                </a>
              ))
            ) : (
              <p className="md:col-span-2 text-[13.5px] text-muted py-4">The live feeds are unavailable right now. Try refreshing in a moment.</p>
            )}
          </div>
          {lastUpdated && <div className="mt-5 text-right font-mono2 text-[10px] uppercase tracking-[0.1em] text-faint">Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>}
        </div>
      </Reveal>
    </section>
  );
}

const VAULT_PREFIX = "/src/content/vault/";

interface Territory {
  id: string;
  label: string;
  count: number;
  subs: string[];
  tags: string[];
}

export default function Home() {
  const fileSystemGraph = useMemo(() => buildFileSystemGraph(), []);

  // Top-level vault territories (folders directly under the root) with the
  // notes inside them — derived from the filesystem graph so the cards always
  // match the "N territories" heading and the graph view.
  const territories = useMemo<Territory[]>(
    () =>
      fileSystemGraph.nodes
        .filter((n) => n.type === "folder" && n.parentId === "root")
        .map((folder) => {
          const rel = folder.path.startsWith(VAULT_PREFIX)
            ? folder.path.slice(VAULT_PREFIX.length)
            : folder.path;
          const notes = vault.notes.filter((n) => n.path.startsWith(`${rel}/`));
          return {
            id: folder.id,
            label: folder.label,
            count: notes.length,
            subs: [...new Set(notes.map((n) => n.subpath.join(" / ")))].filter(Boolean),
            tags: [...new Set(notes.flatMap((n) => n.meta.tags))].slice(0, 3),
          };
        })
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)),
    [fileSystemGraph]
  );
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

      {/* ————— explore territories ————— */}
      <section className="mt-24">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Kicker>Explore</Kicker>
            <h2 className="mt-4 font-display font-bold tracking-tight text-[clamp(1.7rem,3.5vw,2.4rem)]">
              {territories.length} {territories.length === 1 ? "territory" : "territories"}, one graph
            </h2>
          </div>
          <Link to="/knowledge" className="group inline-flex items-center gap-2 text-[13.5px] font-semibold text-muted hover:text-accent transition-colors pb-1">
            All notes <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {territories.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 80}>
              <Link
                to={`/graph?focus=${encodeURIComponent(t.id)}`}
                className="lift group block h-full rounded-2xl border border-line bg-panel p-6 hover:border-accent/40"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono2 text-[11px] text-faint">{String(i + 1).padStart(2, "0")}</span>
                  <ArrowUpRight size={16} className="text-faint group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </div>
                <div className="mt-6 font-display font-bold text-[1.3rem] tracking-tight group-hover:text-accent transition-colors">
                  {t.label}
                </div>
                <div className="mt-1.5 text-[12.5px] text-muted">
                  {t.count} note{t.count === 1 ? "" : "s"}
                  {t.subs.length > 0 ? ` · ${t.subs.join(", ")}` : ""}
                </div>
                <div className="mt-4 pt-4 border-t border-linesoft">
                  <TagList tags={t.tags} />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <AIPulse />
    </div>
  );
}