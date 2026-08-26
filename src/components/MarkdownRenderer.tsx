/**
 * MarkdownRenderer — renders a vault note body.
 * Supports: GFM (tables, footnotes, task lists), LaTeX via KaTeX,
 * syntax-highlighted code with copy, callouts (> [!type]), collapsible
 * <details>, images, external links and Obsidian-style [[wikilinks]].
 */

import { useMemo, useState, cloneElement, type ReactNode, type ReactElement, type MouseEvent } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { visit } from "unist-util-visit";
import { useNavigate } from "react-router-dom";
import { Check, Copy, FileText, Info, Lightbulb, AlertTriangle, FlaskConical, HelpCircle } from "lucide-react";
import { vault, slugifyHeading } from "../engine/vault";
import type { Pluggable } from "unified";
import type { Root, Content } from "mdast";

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

/* ————— main renderer ————— */

export default function MarkdownRenderer({ body }: { body: string }) {
  const navigate = useNavigate();

  const components = useMemo<Components>(() => {
    const onWikiClick = (e: MouseEvent<HTMLAnchorElement>, slug: string) => {
      e.preventDefault();
      navigate(`/note/${slug}`);
    };
    return {
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
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" className="ext">
            {children}
          </a>
        );
      },
      pre: ({ children }) => {
        const child = Array.isArray(children) ? children[0] : children;
        const el = child as { props?: { className?: string; children?: ReactNode } } | undefined;
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
      img: ({ src, alt }) => (
        <img src={src} alt={alt ?? ""} loading="lazy" className="max-w-full" />
      ),
    };
  }, [navigate]);

  const plugins = useMemo(
    () => [remarkGfm, remarkMath, remarkWikiLinks] as Pluggable[],
    []
  );
  const rehype = useMemo(
    () => [[rehypeHighlight, { detect: true }], rehypeKatex, rehypeRaw] as Pluggable[],
    []
  );

  return (
    <div className="prose-lab">
      <ReactMarkdown
        remarkPlugins={plugins}
        rehypePlugins={rehype}
        components={components}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
