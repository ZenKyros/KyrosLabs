/**
 * Minimal, dependency-free YAML-subset frontmatter parser.
 * Supports: scalars (string / number / bool), quoted strings,
 * block lists ("- item"), inline lists ("[a, b]"), and one level of nesting.
 * Frontmatter is optional metadata — notes work perfectly without it.
 */

export type FrontmatterValue = string | number | boolean | FrontmatterValue[] | { [k: string]: FrontmatterValue };
export type Frontmatter = { [k: string]: FrontmatterValue };

const FENCE = /^---\s*$/;

export function splitFrontmatter(raw: string): { meta: Frontmatter; body: string } {
  const text = raw.replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/);
  if (!FENCE.test(lines[0] ?? "")) return { meta: {}, body: text };
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (FENCE.test(lines[i])) {
      end = i;
      break;
    }
  }
  if (end === -1) return { meta: {}, body: text };
  const meta = parseYamlBlock(lines.slice(1, end));
  const body = lines.slice(end + 1).join("\n");
  return { meta, body };
}

function parseScalar(v: string): FrontmatterValue {
  const s = v.trim();
  if (s === "") return "";
  if (/^".*"$/.test(s) || /^'.*'$/.test(s)) return s.slice(1, -1);
  if (/^\[.*\]$/.test(s)) {
    return s
      .slice(1, -1)
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)
      .map(parseScalar);
  }
  if (s === "true") return true;
  if (s === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  return s;
}

function parseYamlBlock(lines: string[]): Frontmatter {
  const out: Frontmatter = {};
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) {
      i++;
      continue;
    }
    const indent = line.length - line.trimStart().length;
    if (indent > 0) {
      // stray indented line outside a key context — skip
      i++;
      continue;
    }
    const m = line.match(/^([\w-]+)\s*:\s*(.*)$/);
    if (!m) {
      i++;
      continue;
    }
    const key = m[1];
    const rest = m[2].trim();
    if (rest !== "") {
      out[key] = parseScalar(rest);
      i++;
      continue;
    }
    // block value: collect following indented lines
    const items: string[] = [];
    let nested: string[] = [];
    let isList = false;
    let j = i + 1;
    while (j < lines.length) {
      const l = lines[j];
      if (!l.trim()) {
        j++;
        continue;
      }
      const ind = l.length - l.trimStart().length;
      if (ind === 0) break;
      const t = l.trim();
      if (t.startsWith("- ") || t === "-") {
        isList = true;
        items.push(t === "-" ? "" : t.slice(2).trim());
      } else {
        nested.push(t);
      }
      j++;
    }
    if (isList) {
      out[key] = items.map(parseScalar);
    } else if (nested.length) {
      out[key] = parseYamlBlock(nested);
    } else {
      out[key] = "";
    }
    i = j;
  }
  return out;
}

/* ————— typed accessors (never any) ————— */

export function asString(v: FrontmatterValue | undefined, fallback = ""): string {
  if (v === undefined || v === null) return fallback;
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return fallback;
}

export function asList(v: FrontmatterValue | undefined): string[] {
  if (Array.isArray(v)) return v.map((x) => asString(x)).filter(Boolean);
  if (typeof v === "string" && v.trim()) return [v];
  return [];
}

export function asNumber(v: FrontmatterValue | undefined): number | undefined {
  if (typeof v === "number") return v;
  if (typeof v === "string" && /^-?\d+$/.test(v)) return Number(v);
  return undefined;
}
