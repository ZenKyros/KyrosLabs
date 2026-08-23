/**
 * Layout — navbar, page-transition shell, footer.
 */

import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Sun, Moon, Menu, X, ArrowUpRight } from "lucide-react";
import SearchPalette from "./SearchPalette";
import { vault } from "../engine/vault";

function BrandMark({ size = 26 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-lg bg-accent text-accentink flex-none transition-transform duration-300 group-hover:rotate-90"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9" />
      </svg>
    </span>
  );
}

const NAV = [
  { to: "/knowledge", label: "Knowledge" },
  { to: "/graph", label: "Graph" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/research", label: "Research" },
];

export default function Layout() {
  const [theme, setTheme] = useState<"dark" | "light">(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light"
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const reduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("kyros-theme", theme);
    } catch {
      /* private mode */
    }
  }, [theme]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((s) => !s);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // page title + scroll restore per route
  useEffect(() => {
    const path = location.pathname;
    const note = path.startsWith("/note/") ? vault.bySlug.get(path.slice(6)) : undefined;
    document.title = note
      ? `${note.meta.title} · Kyros`
      : path === "/"
      ? "Kyros · AI Knowledge Lab"
      : `${path.slice(1)[0]?.toUpperCase() ?? ""}${path.slice(2)} · Kyros`;
    window.scrollTo(0, 0);
    setMenuOpen(false);
  }, [location]);

  const dur = reduced ? 0 : 0.5;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="lab-backdrop" aria-hidden />

      {/* ————— navbar ————— */}
      <header className="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center gap-7">
          <Link to="/" className="group flex items-center gap-3 mr-auto">
            <BrandMark />
            <span className="leading-none">
              <span className="block font-display font-bold text-[17px] tracking-tight">Kyros</span>
              <span className="hidden sm:block text-[10.5px] font-medium tracking-[0.08em] uppercase text-faint mt-0.5">
                AI Knowledge Lab
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `nav-sweep text-[13.5px] font-medium transition-colors ${
                    isActive ? "active text-ink" : "text-muted hover:text-ink"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2.5 h-9 pl-3 pr-2 rounded-full border border-line bg-panel text-muted hover:text-ink hover:border-faint hover:shadow-[var(--shadow-sm)] transition-all cursor-pointer"
              aria-label="Search"
            >
              <Search size={14} />
              <span className="hidden sm:block text-[12.5px] font-medium">Search</span>
              <kbd className="kbd hidden sm:block">⌘K</kbd>
            </button>
            <button
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              className="w-9 h-9 rounded-full border border-line bg-panel flex items-center justify-center text-muted hover:text-ink hover:border-faint transition-all cursor-pointer"
              aria-label="Toggle theme"
            >
              <motion.span
                key={theme}
                initial={reduced ? false : { rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex"
              >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </motion.span>
            </button>
            <button
              onClick={() => setMenuOpen((m) => !m)}
              className="md:hidden w-9 h-9 rounded-full border border-line bg-panel flex items-center justify-center text-muted hover:text-ink transition-colors cursor-pointer"
              aria-label="Menu"
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={reduced ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduced ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden overflow-hidden border-t border-line bg-panel"
            >
              <div className="px-5 py-5 flex flex-col">
                {[{ to: "/", label: "Home" }, ...NAV].map((n, i) => (
                  <motion.div
                    key={n.to}
                    initial={reduced ? false : { x: -14, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.06 + i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <NavLink
                      to={n.to}
                      className={({ isActive }) =>
                        `flex items-center justify-between py-3.5 border-b border-linesoft font-display font-semibold text-[20px] tracking-tight ${
                          isActive ? "text-accent" : "text-ink"
                        }`
                      }
                    >
                      {n.label}
                      <ArrowUpRight size={17} className="text-faint" />
                    </NavLink>
                  </motion.div>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* ————— page with epic enter/exit ————— */}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="flex-1"
          initial={reduced ? false : { opacity: 0, y: 28, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={reduced ? undefined : { opacity: 0, y: -18, filter: "blur(4px)" }}
          transition={{ duration: dur, ease: [0.16, 1, 0.3, 1] }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      {/* ————— footer ————— */}
      <footer className="mt-24 border-t border-line bg-panel/60">
        <div className="max-w-6xl mx-auto px-5 py-14 grid md:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-10">
          <div>
            <Link to="/" className="group flex items-center gap-3 w-fit">
              <BrandMark size={30} />
              <span className="font-display font-bold text-[19px] tracking-tight">Kyros</span>
            </Link>
            <p className="text-[13.5px] text-muted leading-relaxed mt-4 max-w-[30ch]">
              An evolving map of artificial intelligence — every page rendered from plain Markdown.
            </p>
          </div>
          <div>
            <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-faint mb-4">Explore</div>
            <ul className="space-y-2.5">
              {[{ to: "/knowledge", label: "Knowledge" }, { to: "/graph", label: "Graph" }, { to: "/roadmap", label: "Roadmap" }, { to: "/research", label: "Research" }].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[13.5px] text-muted hover:text-accent transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-faint mb-4">Categories</div>
            <ul className="space-y-2.5">
              {vault.categories.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <Link to={`/category/${c.id}`} className="text-[13.5px] text-muted hover:text-accent transition-colors">
                    {c.label}
                    <span className="text-faint ml-1.5 font-mono2 text-[11px]">{c.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-faint mb-4">Colophon</div>
            <p className="text-[13px] text-muted leading-relaxed">
              {vault.stats.totalNotes} notes · {vault.stats.papers} papers · {vault.stats.graphEdges} connections —
              discovered from <code className="font-mono2 text-[11.5px] text-accent">src/content/vault</code> at build time.
              No CMS, no database. Edit a <code className="font-mono2 text-[11.5px] text-accent">.md</code> file, push, done.
            </p>
          </div>
        </div>
        <div className="border-t border-linesoft">
          <div className="max-w-6xl mx-auto px-5 py-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-faint">
            <span>© 2026 Kyros · AI Knowledge Lab</span>
            <span className="hidden sm:inline">Markdown in → knowledge graph out.</span>
            <button
              onClick={() => setSearchOpen(true)}
              className="ml-auto flex items-center gap-2 hover:text-accent transition-colors cursor-pointer"
            >
              <Search size={12} />
              Press <kbd className="kbd">⌘K</kbd> to search
            </button>
          </div>
        </div>
      </footer>

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
