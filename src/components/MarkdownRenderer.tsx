/**
 * MarkdownRenderer — renders a vault note body.
 *
 * Supports: GFM (tables, footnotes, task lists, strikethrough), LaTeX math
 * ($inline$ and $$block$$) via KaTeX, syntax-highlighted code with copy,
 * Obsidian callouts (> [!type]), collapsible <details>, [[wikilinks]],
 * relative-path images & SVG diagrams resolved from the vault, image
 * lightbox with captions, graceful missing-asset fallbacks, sanitized
 * inline HTML/SVG, and auto-embedded YouTube links.
 *
 * Security: raw HTML is parsed (rehype-raw) then strictly filtered with
 * rehype-sanitize — scripts/event handlers never reach the DOM, iframes
 * are restricted to YouTube/Vimeo embeds, SVG is limited to shape tags.
 */

import { useEffect, useMemo, useState, useRef, cloneElement, type ReactNode, type ReactElement, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown, { defaultUrlTransform, type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import mermaid from "mermaid";
import { visit } from "unist-util-visit";
import { useNavigate } from "react-router-dom";
import {
  Check, Copy, FileText, Info, Lightbulb, AlertTriangle, FlaskConical,
  HelpCircle, ImageOff, X, ZoomIn,
} from "lucide-react";
import { vault, slugifyHeading } from "../engine/vault";
import type { Pluggable } from "unified";
import type { Root, Content } from "mdast";

/* ————— vault asset resolution (images / SVG diagrams) ————— */

const VAULT_PREFIX = "/src/content/vault/";

/** every binary asset inside the vault → bundled URL (build-time glob) */
const assetModules = import.meta.glob(
  "/src/content/vault/**/*.{png,jpg,jpeg,gif,webp,avif,bmp,svg}",
  { query: "?url", import: "default", eager: true }
) as Record<string, string>;

/** lowercase vault-relative path → URL */
const ASSET_BY_PATH = new Map<string, string>();
/** lowercase basename → URL (lenient fallback for loose references) */
const ASSET_BY_NAME = new Map<string, string>();
for (const [file, url] of Object.entries(assetModules)) {
  const rel = file.startsWith(VAULT_PREFIX) ? file.slice(VAULT_PREFIX.length) : file;
  ASSET_BY_PATH.set(rel.toLowerCase(), url);
  const base = rel.split("/").pop();
  if (base && !ASSET_BY_NAME.has(base.toLowerCase())) ASSET_BY_NAME.set(base.toLowerCase(), url);
}

/** "./img.png" / "../assets/x.webp" relative to the note's folder → clean vault path */
function normalizeRelative(src: string, basePath: string): string {
  const clean = decodeURIComponent(src.trim().replace(/^\.\//, ""));
  const segments = `${basePath ? `${basePath.replace(/\/+$/, "")}/` : ""}${clean}`.split("/");
  const stack: string[] = [];
  for (const seg of segments) {
    if (seg === "..") stack.pop();
    else if (seg === "." || seg === "") continue;
    else stack.push(seg);
  }
  return stack.join("/");
}

/**
 * Resolve a markdown image src to a loadable URL.
 * External URLs / data URIs / site-absolute paths pass through untouched;
 * vault-relative paths are matched against the bundled asset map.
 * Returns null when the asset cannot be found (caller shows a fallback).
 */
export function resolveAssetUrl(src: string | undefined, basePath: string): string | null {
  if (!src) return null;
  const trimmed = src.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;
  if (/^(https?:)?\/\//i.test(trimmed)) return trimmed;
  if (/^(mailto|tel):/i.test(trimmed)) return trimmed;
  if (/^data:image\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  const rel = normalizeRelative(trimmed, basePath);
  return (
    ASSET_BY_PATH.get(rel.toLowerCase()) ??
    ASSET_BY_PATH.get(decodeURIComponent(trimmed).toLowerCase()) ??
    ASSET_BY_NAME.get(rel.split("/").pop()?.toLowerCase() ?? "") ??
    null
  );
}

/* ————— preprocessing: Obsidian embeds + bare YouTube links ————— */

const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|avif|bmp|svg)$/i;
// Capture: filename | size (e.g., "191" or "191x100")
const EMBED_RE = /!\[\[([^\]|]+?)(?:\|([^\]]+))?\]\]/g;
const YOUTUBE_LINE_RE =
  /^[ \t]*(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?(?:[^#\s]*&)?v=|youtu\.be\/)([\w-]{6,20})(?:[?&#][^\s]*)?[ \t]*$/gm;

function preprocessBody(body: string, basePath: string): string {
  let out = body;

  // Obsidian-style embeds: ![[diagram.svg|191]] → sanitized HTML with size.
  // Non-asset targets degrade gracefully to a plain [[wikilink]].
  out = out.replace(EMBED_RE, (_match, targetRaw: string, sizeRaw?: string) => {
    const target = String(targetRaw).trim();
    if (!IMAGE_EXT_RE.test(target)) return `[[${target}]]`;
    const url = resolveAssetUrl(target, basePath);
    if (!url) return `![${target.split("/").pop() ?? target}](${target})`;
    
    // Parse size parameter (e.g., "191" or "191x100")
    let sizeAttr = "";
    if (sizeRaw) {
      const size = sizeRaw.trim();
      if (/^\d+$/.test(size)) {
        sizeAttr = ` width="${size}"`;
      } else if (/^\d+x\d+$/.test(size)) {
        const [w, h] = size.split("x");
        sizeAttr = ` width="${w}" height="${h}"`;
      }
    }
    
    const label = target.split("/").pop() ?? target;
    return `<img src="${encodeURI(url)}" alt="${label.replace(/"/g, "&quot;")}"${sizeAttr} />`;
  });

  // A lone YouTube URL on its own line → privacy-friendly embedded player.
  out = out.replace(YOUTUBE_LINE_RE, (_match, id: string) => {
    return `\n<iframe src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube video" loading="lazy"></iframe>\n`;
  });

  return out;
}

/* ————— sanitization schema (safe HTML + inline SVG + video embeds) ————— */

const SANITIZE_SCHEMA = {
  ...defaultSchema,
  protocols: {
    ...defaultSchema.protocols,
    // wiki: powers [[wikilinks]]; data: powers small inline/base64 images
    href: [...(defaultSchema.protocols?.href ?? []), "wiki"],
    src: [...(defaultSchema.protocols?.src ?? []), "data"],
  },
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    // inline SVG diagram subset — shapes only, no foreignObject/script/use
    "svg", "g", "defs", "title", "desc",
    "path", "circle", "ellipse", "rect", "line", "polyline", "polygon",
    // media
    "iframe", "video", "source",
  ],
  attributes: {
    ...defaultSchema.attributes,
    "*": [...(defaultSchema.attributes?.["*"] ?? []), "className"],
    svg: ["xmlns", "viewBox", "width", "height", "fill", "stroke", "strokeWidth", "stroke-width", "opacity", "preserveAspectRatio", "role", "aria-hidden", "ariaLabel", "aria-label"],
    path: ["d", "fill", "stroke", "strokeWidth", "stroke-width", "strokeLinecap", "stroke-linecap", "strokeLinejoin", "stroke-linejoin", "strokeDasharray", "stroke-dasharray", "transform", "fillRule", "fill-rule", "clipRule", "clip-rule", "opacity"],
    circle: ["cx", "cy", "r", "fill", "stroke", "strokeWidth", "stroke-width", "opacity"],
    ellipse: ["cx", "cy", "rx", "ry", "fill", "stroke", "strokeWidth", "stroke-width", "opacity"],
    rect: ["x", "y", "width", "height", "rx", "ry", "fill", "stroke", "strokeWidth", "stroke-width", "opacity", "transform"],
    line: ["x1", "y1", "x2", "y2", "stroke", "strokeWidth", "stroke-width", "strokeLinecap", "stroke-linecap", "opacity"],
    polyline: ["points", "fill", "stroke", "strokeWidth", "stroke-width", "opacity"],
    polygon: ["points", "fill", "stroke", "strokeWidth", "stroke-width", "opacity"],
    g: ["transform", "fill", "stroke", "strokeWidth", "stroke-width", "opacity", "fontFamily", "font-family", "fontSize", "font-size", "textAnchor", "text-anchor"],
    // iframes locked to YouTube/Vimeo embed endpoints
    iframe: [
      ["src", /^https:\/\/(www\.)?(youtube(-nocookie)?\.com\/embed\/[\w-]+|player\.vimeo\.com\/video\/\d+)/],
      "width", "height", "allow", "allowFullScreen", "allowfullscreen", "frameBorder", "frameborder", "loading", "title",
    ],
    video: [["src", /\.(mp4|webm|ogv|ogg)$/i], "controls", "width", "height", "poster", "preload", "muted"],
    source: [["src", /\.(mp4|webm|ogv|ogg)$/i], "type"],
    // GFM task-list checkboxes
    input: [["type", "checkbox"], "checked", "disabled"],
  },
} as typeof defaultSchema;

/* ————— small building blocks ————— */

function nodeToText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  if (typeof node === "object" && "props" in node) {
    return nodeToText((node as ReactElement).props.children as ReactNode);
  }
  return "";
}

function CodeBlock({ className, children }: { className?: string; children?: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const lang = /language-([\w+-]+)/.exec(className ?? "")?.[1] ?? "text";
  const text = nodeToText(children).replace(/\n$/, "");
  const onCopy = () => {
    navigator.clipboard?.writeText(text).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className="codeblock not-prose">
      <div className="codeblock-head">
        <span className="codeblock-lang">// {lang}</span>
        <button
          onClick={onCopy}
          className="flex items-center gap-1.5 font-mono2 text-[10.5px] tracking-[0.14em] uppercase text-[#7f92a6] hover:text-white transition-colors cursor-pointer"
          aria-label="Copy code"
        >
          {copied ? <Check size={12} className="text-accent" /> : <Copy size={12} />}
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre>
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

let mermaidRenderId = 0;

function MermaidBlock({ children }: { children?: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  const source = nodeToText(children).replace(/\n$/, "").trim();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;
    const render = async () => {
      try {
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: isDark ? "dark" : "base",
          themeVariables: isDark
            ? { primaryColor: "#24324a", primaryTextColor: "#e8edf7", lineColor: "#9aa8c2" }
            : { primaryColor: "#eef6f0", primaryTextColor: "#17211b", lineColor: "#526158" },
        });
        const result = await mermaid.render(`mermaid-diagram-${mermaidRenderId++}`, source);
        if (active && containerRef.current) {
          containerRef.current.innerHTML = result.svg;
          result.bindFunctions?.(containerRef.current);
          setError(false);
        }
      } catch {
        if (active) setError(true);
      }
    };
    render();
    return () => {
      active = false;
    };
  }, [source, isDark]);

  if (error) return <CodeBlock className="language-mermaid">{children}</CodeBlock>;
  return <div ref={containerRef} className="mermaid-block not-prose" aria-label="Mermaid diagram" />;
}

const CALLOUT_META: Record<string, { label: string; icon: ReactNode; cls: string }> = {
  note: { label: "Note", icon: <Info size={13} />, cls: "callout-note" },
  tip: { label: "Tip", icon: <Lightbulb size={13} />, cls: "callout-tip" },
  warning: { label: "Warning", icon: <AlertTriangle size={13} />, cls: "callout-warning" },
  math: { label: "Mathematics", icon: <FlaskConical size={13} />, cls: "callout-math" },
  paper: { label: "From the paper", icon: <FileText size={13} />, cls: "callout-paper" },
  question: { label: "Open question", icon: <HelpCircle size={13} />, cls: "callout-note" },
};

function Callout({ type, children }: { type: string; children?: ReactNode }) {
  const meta = CALLOUT_META[type] ?? CALLOUT_META.note;
  return (
    <aside className={`callout ${meta.cls} not-prose`}>
      <div className="callout-title">
        {meta.icon}
        {meta.label}
      </div>
      <div className="prose-lab text-[0.95rem] [&>p]:!my-0">{children}</div>
    </aside>
  );
}

/* ————— smart image: caption, lightbox, graceful fallback ————— */

function SmartImage({ src, alt, width, basePath }: { src?: string; alt?: string; width?: string | number; basePath: string }) {
  const [failed, setFailed] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const resolved = useMemo(() => resolveAssetUrl(src, basePath), [src, basePath]);

  // explicit |WIDTH from ![[image.png|191]] → fixed pixel width; otherwise a
  // compact default so images don't stretch across the whole content area
  const explicitWidth = width ? Number(width) : NaN;
  const hasExplicitWidth = !Number.isNaN(explicitWidth) && explicitWidth > 0;
  const imgStyle: React.CSSProperties = hasExplicitWidth
    ? { width: `${explicitWidth}px`, maxWidth: "100%", height: "auto", objectFit: "contain" }
    : { width: "100%", maxWidth: "480px", height: "auto", objectFit: "contain" };

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoomed(false);
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [zoomed]);

  // missing asset → quiet placeholder instead of a broken-image glyph
  if (!resolved || failed) {
    return (
      <span className="not-prose my-7 flex flex-col items-center gap-2 rounded-xl border border-dashed border-line bg-panel2/50 px-6 py-9 text-center">
        <ImageOff size={18} className="text-faint" />
        <span className="font-mono2 text-[10px] tracking-[0.16em] uppercase text-faint">image unavailable</span>
        {(alt || src) && <span className="max-w-full break-all text-[12.5px] text-muted">{alt || src}</span>}
      </span>
    );
  }

  return (
    <>
      <figure className="not-prose my-7">
        <button
          type="button"
          onClick={() => setZoomed(true)}
          className="group relative block w-full cursor-zoom-in"
          aria-label={alt ? `Zoom image: ${alt}` : "Zoom image"}
        >
          <img
            src={resolved}
            alt={alt ?? ""}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            style={imgStyle}
            className="mx-auto block rounded-xl border border-line transition-shadow duration-300 group-hover:shadow-[var(--shadow)]"
          />
          <span className="pointer-events-none absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-md bg-bg2/80 px-2 py-1 font-mono2 text-[9px] tracking-[0.14em] uppercase text-muted opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <ZoomIn size={11} /> zoom
          </span>
        </button>
        {alt && (
          <figcaption className="mt-2.5 text-center font-mono2 text-[10.5px] tracking-[0.08em] text-faint">
            {alt}
          </figcaption>
        )}
      </figure>

      {zoomed &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={alt ?? "Image preview"}
            onClick={() => setZoomed(false)}
            className="fixed inset-0 z-100 flex items-center justify-center bg-bg2/85 p-6 backdrop-blur-md"
          >
            <img
              src={resolved}
              alt={alt ?? ""}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full rounded-xl border border-line object-contain shadow-[var(--shadow)]"
            />
            <button
              onClick={() => setZoomed(false)}
              className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-panel text-muted hover:text-ink transition-colors cursor-pointer"
              aria-label="Close preview"
            >
              <X size={17} />
            </button>
          </div>,
          document.body
        )}
    </>
  );
}

/* ————— custom remark plugin: [[wikilinks]] → link nodes with wiki: scheme ————— */

const WIKI_RE = /\[\[([^\]|#\n]+?)(?:#[^\]|\n]*)?(?:\|([^\]\n]+))?\]\]/;

function remarkWikiLinks() {
  return (tree: Root) => {
    visit(tree, "text", (node, index, parent) => {
      if (!parent || index === undefined) return;
      const parts: Content[] = [];
      let rest = node.value;
      let m: RegExpExecArray | null;
      WIKI_RE.lastIndex = 0;
      while ((m = WIKI_RE.exec(rest))) {
        if (m.index > 0) parts.push({ type: "text", value: rest.slice(0, m.index) });
        const target = m[1].trim().toLowerCase();
        const alias = m[2]?.trim() ?? target;
        parts.push({
          type: "link",
          url: `wiki:${target}`,
          children: [{ type: "text", value: alias }],
        });
        rest = rest.slice(m.index + m[0].length);
        WIKI_RE.lastIndex = 0;
      }
      if (parts.length === 0) return;
      if (rest) parts.push({ type: "text", value: rest });
      parent.children.splice(index, 1, ...parts);
      return index + parts.length;
    });
  };
}

/* ————— main renderer ————— */

export default function MarkdownRenderer({ body, basePath = "" }: { body: string; basePath?: string }) {
  const navigate = useNavigate();

  const processedBody = useMemo(() => preprocessBody(body, basePath), [body, basePath]);

  const components = useMemo<Components>(() => {
    const onWikiClick = (e: MouseEvent<HTMLAnchorElement>, slug: string) => {
      e.preventDefault();
      navigate(`/note/${slug}`);
    };
    return {
      code: ({ className, children }) => {
        const language = /language-([\w+-]+)/.exec(className ?? "")?.[1]?.toLowerCase();
        return language === "mermaid"
          ? <MermaidBlock>{children}</MermaidBlock>
          : <CodeBlock className={className}>{children}</CodeBlock>;
      },
      h1: ({ children }) => (
        <h1 id={slugifyHeading(nodeToText(children))} className="!text-2xl font-semibold mt-10">
          {children}
        </h1>
      ),
      h2: ({ children }) => {
        // headings may contain inline nodes (code, emphasis…) — extract plain
        // text so the id matches the TOC ids extracted from the raw markdown
        const text = nodeToText(children);
        return (
          <h2 id={slugifyHeading(text)}>
            <a href={`#/note#`} onClick={(e) => { e.preventDefault(); document.getElementById(slugifyHeading(text))?.scrollIntoView({ behavior: "smooth" }); }} className="no-underline">
              {children}
            </a>
          </h2>
        );
      },
      h3: ({ children }) => {
        const text = nodeToText(children);
        return (
          <h3 id={slugifyHeading(text)}>{children}</h3>
        );
      },
      a: ({ href, children, className }) => {
        if (href?.startsWith("wiki:")) {
          const slug = href.slice(5);
          const exists = vault.bySlug.has(slug);
          if (!exists) {
            return (
              <span className="wikilink-broken" title={`No note "${slug}" in the vault yet`}>
                {children}
              </span>
            );
          }
          return (
            <a href={`#/note/${slug}`} className={`wikilink ${className ?? ""}`} onClick={(e) => onWikiClick(e, slug)}>
              {children}
            </a>
          );
        }
        // intra-note anchors → smooth scroll (TOC-style links)
        if (href?.startsWith("#")) {
          const id = href.slice(1);
          return (
            <a
              href={href}
              className={className}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {children}
            </a>
          );
        }
        // relative links to other notes: ./other.md → /note/other
        if (href && /\.md$/i.test(href)) {
          const slug = href.split("/").pop()!.replace(/\.md$/i, "").toLowerCase();
          return (
            <a href={`#/note/${slug}`} className={`wikilink ${className ?? ""}`} onClick={(e) => onWikiClick(e, slug)}>
              {children}
            </a>
          );
        }
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" className="ext">
            {children}
          </a>
        );
      },
      pre: ({ children }) => {
        const child = Array.isArray(children) ? children[0] : children;
        const el = child as { props?: { className?: string; children?: ReactNode } } | undefined;
        const language = /language-([\w+-]+)/.exec(el?.props?.className ?? "")?.[1]?.toLowerCase();
        if (language === "mermaid") return <MermaidBlock>{el?.props?.children}</MermaidBlock>;
        return <CodeBlock className={el?.props?.className}>{el?.props?.children}</CodeBlock>;
      },
      blockquote: ({ children }) => {
        // detect callout: the first <p>'s first text child starts with [!type]
        const arr = Array.isArray(children) ? children : [children];
        const first = arr[0] as ReactElement<{ children?: ReactNode }> | null;
        const pChildren = first?.props?.children;
        const kids = Array.isArray(pChildren) ? pChildren : [pChildren];
        const firstKid = kids[0];
        if (typeof firstKid === "string") {
          const m = /^\[!(note|tip|warning|math|paper|question)\]\s*/i.exec(firstKid);
          if (m) {
            const rest = firstKid.slice(m[0].length);
            const newKids = rest ? [rest, ...kids.slice(1)] : kids.slice(1);
            const rebuiltFirst =
              newKids.length > 0
                ? cloneElement(first as ReactElement, { key: "callout-p" }, ...(newKids as ReactNode[]))
                : null;
            const content = rebuiltFirst ? [rebuiltFirst, ...arr.slice(1)] : arr.slice(1);
            return <Callout type={m[1].toLowerCase()}>{content}</Callout>;
          }
        }
        return <blockquote>{children}</blockquote>;
      },
      table: ({ children }) => (
        <div className="not-prose overflow-x-auto my-6 border border-line rounded-md">
          <table className="w-full">{children}</table>
        </div>
      ),
      img: ({ src, alt, width }) => (
        <SmartImage src={typeof src === "string" ? src : undefined} alt={alt} width={width} basePath={basePath} />
      ),
      // inline/raw SVG diagrams — sized to the column, inherit theme colors
      svg: ({ node: _node, className, ...rest }) => (
        <svg {...rest} className={`md-svg${className ? ` ${className}` : ""}`} />
      ),
      // sanitized video embeds (YouTube/Vimeo only — enforced by the schema)
      iframe: ({ node: _node, src }) => (
        <div className="not-prose my-7 aspect-video overflow-hidden rounded-xl border border-line bg-panel shadow-[var(--shadow-sm)]">
          <iframe
            src={typeof src === "string" ? src : undefined}
            title="Embedded video"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      ),
    };
  }, [navigate, basePath]);

  const plugins = useMemo(
    () => [remarkGfm, remarkMath, remarkWikiLinks] as Pluggable[],
    []
  );

  // pipeline order matters: parse raw HTML → sanitize EVERYTHING → then
  // highlight & KaTeX generate their own trusted markup afterwards
  const rehype = useMemo(
    () =>
      [
        rehypeRaw,
        [rehypeSanitize, SANITIZE_SCHEMA],
        [rehypeHighlight, { detect: true }],
        rehypeKatex,
      ] as Pluggable[],
    []
  );

  // keep wiki:/data-image URLs alive; delegate everything else to the
  // library's safe default (strips javascript: etc.)
  const urlTransform = useMemo(
    () => (url: string) =>
      /^wiki:/i.test(url) || /^data:image\//i.test(url) ? url : defaultUrlTransform(url),
    []
  );

  return (
    <div className="prose-lab">
      <ReactMarkdown
        remarkPlugins={plugins}
        rehypePlugins={rehype}
        urlTransform={urlTransform}
        components={components}
      >
        {processedBody}
      </ReactMarkdown>
    </div>
  );
}