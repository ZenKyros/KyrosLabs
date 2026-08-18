/**
 * SEARCH — a fast, dependency-free ranked full-text index over the vault.
 * Searches title, slug, description, tags, category, frontmatter relations
 * and the full body. Returns scored results with matching excerpts.
 */

import { vault } from "./vault";
import type { SearchResult, VaultNote } from "./types";

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$([^$\n]*)\$/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/[*_~#|>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

interface Doc {
  note: VaultNote;
  title: string;
  slug: string;
  description: string;
  tags: string[];
  category: string;
  type: string;
  relations: string;
  body: string;
}

const docs: Doc[] = vault.notes.map((note) => ({
  note,
  title: note.meta.title.toLowerCase(),
  slug: note.slug,
  description: (note.meta.description ?? "").toLowerCase(),
  tags: note.meta.tags,
  category: `${note.category} ${note.subpath.join(" ")}`.toLowerCase(),
  type: note.meta.type,
  relations: [...note.meta.prerequisites, ...note.meta.related, ...note.meta.papers, ...note.meta.concepts].join(" "),
  body: stripMarkdown(note.body).toLowerCase(),
}));

function makeExcerpt(body: string, token: string): string {
  const idx = body.indexOf(token);
  if (idx === -1) return body.slice(0, 150) + (body.length > 150 ? "…" : "");
  const start = Math.max(0, idx - 60);
  const end = Math.min(body.length, idx + token.length + 110);
  return (start > 0 ? "…" : "") + body.slice(start, end).trim() + (end < body.length ? "…" : "");
}

export function searchVault(query: string, limit = 14): SearchResult[] {
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0);
  if (!tokens.length) return [];

  const results: SearchResult[] = [];
  for (const doc of docs) {
    let score = 0;
    const matchedIn: string[] = [];
    let bestExcerptToken: string | null = null;
    let bestExcerptScore = -1;

    for (const t of tokens) {
      if (doc.title === t) score += 14;
      else if (doc.title.startsWith(t)) score += 10;
      else if (doc.title.includes(t)) score += 7;
      if (doc.slug.includes(t)) {
        score += 6;
        matchedIn.push("slug");
      }
      if (doc.tags.some((tag) => tag.includes(t))) {
        score += 6;
        matchedIn.push("tags");
      }
      if (doc.category.includes(t)) {
        score += 4;
        matchedIn.push("category");
      }
      if (doc.type.includes(t)) score += 2;
      if (doc.description.includes(t)) {
        score += 5;
        matchedIn.push("description");
      }
      if (doc.relations.includes(t)) {
        score += 3;
        matchedIn.push("relations");
      }
      const bodyHits = doc.body.split(t).length - 1;
      if (bodyHits > 0) {
        score += Math.min(bodyHits, 6);
        matchedIn.push("body");
        if (bodyHits > bestExcerptScore) {
          bestExcerptScore = bodyHits;
          bestExcerptToken = t;
        }
      }
      if (doc.title.includes(t)) matchedIn.push("title");
    }

    if (score > 0) {
      const fallback = doc.note.meta.description ?? doc.body;
      const excerpt = bestExcerptToken ? makeExcerpt(doc.body, bestExcerptToken) : fallback.slice(0, 160);
      results.push({
        note: doc.note,
        score,
        excerpt,
        matchedIn: [...new Set(matchedIn)],
      });
    }
  }

  return results
    .sort((a, b) => b.score - a.score || a.note.meta.title.localeCompare(b.note.meta.title))
    .slice(0, limit);
}
