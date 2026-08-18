/**
 * /category/:id — every note the vault discovered under one top-level folder.
 */

import { Link, useParams } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { vault, categoryLabel } from "../engine/vault";
import { Kicker, NoteRow, Reveal, TagList } from "../components/ui";

export default function CategoryPage() {
  const params = useParams();
  const raw = params["*"] ?? "";
  const id = raw.split("/")[0];
  const category = vault.categories.find((c) => c.id === id);
  const notes = vault.notes.filter((n) => n.category === id).sort((a, b) => a.meta.title.localeCompare(b.meta.title));

  if (!category) {
    return (
      <div className="max-w-3xl mx-auto px-5 pt-28 text-center">
        <div className="font-mono2 text-[12px] tracking-[0.2em] uppercase text-blush">category not indexed</div>
        <h1 className="font-display font-bold text-3xl mt-4">No folder “{id}” in the vault.</h1>
        <p className="text-muted mt-3 text-[14px]">Create the folder with Markdown files inside and it appears here.</p>
        <Link to="/knowledge" className="inline-block mt-8 font-mono2 text-[11px] tracking-[0.16em] uppercase text-accent">
          ← Back to knowledge
        </Link>
      </div>
    );
  }

  const subIds = new Set(notes.flatMap((n) => (n.subpath.length ? [n.subpath.join("/")] : [])));
  const ungrouped = notes.filter((n) => n.subpath.length === 0);
  const catTags = vault.allTags.filter(({ tag }) => notes.some((n) => n.meta.tags.includes(tag))).slice(0, 12);

  return (
    <div className="max-w-6xl mx-auto px-5 pt-14">
      <Kicker index="§">Category</Kicker>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
        <h1 className="font-display font-bold tracking-tight text-[clamp(2.4rem,6vw,4rem)] leading-none">
          {category.label}
          <span className="text-accent">.</span>
        </h1>
        <div className="font-mono2 text-[11px] tracking-[0.16em] uppercase text-muted pb-2 text-right">
          {category.count} note{category.count === 1 ? "" : "s"} indexed
          {subIds.size > 0 && <span className="block text-faint mt-1">{subIds.size} sub-tracks</span>}
        </div>
      </div>

      <div className="mt-10 grid lg:grid-cols-[1fr_240px] gap-10 items-start">
        <div>
          {category.subs.map((sub) => {
            const subNotes = notes.filter((n) => n.subpath.join("/") === sub.id);
            return (
              <Reveal key={sub.id} className="mb-8">
                <div className="kicker mb-2">
                  <span className="text-accent">↳</span> {sub.label} · {sub.count}
                </div>
                <div className="border-t border-line">
                  {subNotes.map((n) => (
                    <NoteRow key={n.slug} note={n} showDate />
                  ))}
                </div>
              </Reveal>
            );
          })}
          {ungrouped.length > 0 && (
            <Reveal>
              {category.subs.length > 0 && <div className="kicker mb-2">↳ General · {ungrouped.length}</div>}
              <div className="border-t border-line">
                {ungrouped.map((n) => (
                  <NoteRow key={n.slug} note={n} showDate />
                ))}
              </div>
            </Reveal>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 space-y-6">
          <Reveal delay={100}>
            <div className="border border-line rounded-lg bg-panel p-5">
              <div className="kicker mb-4">Tags in this track</div>
              <TagList tags={catTags.map((t) => t.tag)} />
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="border border-line rounded-lg bg-panel p-5">
              <div className="kicker mb-4">Other categories</div>
              <ul className="space-y-2.5">
                {vault.categories
                  .filter((c) => c.id !== id)
                  .map((c) => (
                    <li key={c.id}>
                      <Link
                        to={`/category/${c.id}`}
                        className="group flex items-center justify-between text-[13px] text-muted hover:text-accent transition-colors"
                      >
                        {c.label}
                        <span className="flex items-center gap-2">
                          <span className="font-mono2 text-[10.5px] text-faint">{c.count}</span>
                          <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </Reveal>
          <p className="font-mono2 text-[10.5px] leading-relaxed text-faint">
            Categories map 1:1 to vault folders — <span className="text-muted">src/content/vault/{category.id}/</span>
          </p>
        </aside>
      </div>
    </div>
  );
}
