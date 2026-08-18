/**
 * Layout — navbar, ambient backdrop, footer, ⌘K palette, page transitions.
 */

import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Sun, Moon, Menu, X, ArrowUpRight } from "lucide-react";
import SearchPalette from "./SearchPalette";
import { vault } from "../engine/vault";

function useTheme(): [string, () => void] {
  const [theme, setTheme] = useState(() =>
    document.documentElement.classList.contains("light") ? "light" : "dark"
  );
  const toggle = useCallback(() => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      document.documentElement.classList.replace(t, next);
      try {
        localStorage.setItem("kyros-theme", next);
      } catch {
        /* private mode */
      }
      return next;
    });
  }, []);
  return [theme, toggle];
}

const NAV = [
  { to: "/knowledge", label: "Knowledge" },
  { to: "/graph", label: "Graph" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/research", label: "Research" },
];

export default function Layout() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const location = useLocation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="lab-backdrop" aria-hidden />

      {/* ————— navbar ————— */}
      <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center gap-6">
          <Link to="/" className="flex items-baseline gap-2 group" aria-label="KYROS home">
            <span className="font-display font-bold text-[17px] tracking-[0.04em]">KYROS</span>
            <span className="w-[7px] h-[7px] bg-accent inline-block group-hover:rotate-45 transition-transform duration-300" />
            <span className="hidden sm:block font-mono2 text-[10px] tracking-[0.22em] uppercase text-muted -mb-[1px]">
              AI Knowledge Lab
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 ml-4">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `nav-sweep font-mono2 text-[11px] tracking-[0.18em] uppercase transition-colors ${
                    isActive ? "text-ink active" : "text-muted hover:text-ink"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2.5">
            <button
              onClick={() => setPaletteOpen(true)}
              className="flex items-center gap-2.5 border border-line rounded-md pl-3 pr-2 py-1.5 text-muted hover:text-ink hover:border-faint transition-colors cursor-pointer"
              aria-label="Open search"
            >
              <Search size={13} />
              <span className="hidden lg:block text-[12.5px]">Search vault</span>
              <span className="hidden sm:flex items-center gap-0.5">
                <kbd className="kbd">⌘</kbd>
                <kbd className="kbd">K</kbd>
              </span>
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 border border-line rounded-md text-muted hover:text-ink hover:border-faint transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden p-2 border border-line rounded-md text-muted hover:text-ink cursor-pointer"
              aria-label="Menu"
            >
              {menuOpen ? <X size={14} /> : <Menu size={14} />}
            </button>
          </div>
        </div>

        {/* mobile menu */}
        {menuOpen && (
          <nav className="md:hidden border-t border-line bg-panel px-5 py-4 flex flex-col gap-4">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `font-mono2 text-[12px] tracking-[0.18em] uppercase ${isActive ? "text-accent" : "text-muted"}`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      {/* ————— page ————— */}
      <main className="flex-1">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.2, 0.6, 0.2, 1] }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* ————— footer ————— */}
      <footer className="border-t border-line mt-24">
        <div className="max-w-6xl mx-auto px-5 py-12 grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-[15px]">KYROS</span>
              <span className="w-[6px] h-[6px] bg-accent inline-block" />
              <span className="font-mono2 text-[10px] tracking-[0.2em] uppercase text-muted">AI Knowledge Lab</span>
            </div>
            <p className="text-[13px] text-muted leading-relaxed mt-3 max-w-xs">
              An evolving map of artificial intelligence — every page rendered from plain Markdown,
              every connection discovered automatically.
            </p>
          </div>
          <div>
            <div className="kicker mb-4">Index</div>
            <ul className="space-y-2.5">
              {[...NAV, { to: "/", label: "Home" }].map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="group flex items-center gap-1.5 text-[13px] text-muted hover:text-accent transition-colors">
                    {n.label}
                    <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="kicker mb-4">Vault status</div>
            <ul className="font-mono2 text-[11.5px] text-muted space-y-2.5">
              <li className="flex justify-between gap-4">
                <span>notes indexed</span>
                <span className="text-ink">{vault.stats.totalNotes}</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>graph edges</span>
                <span className="text-ink">{vault.stats.graphEdges}</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>categories</span>
                <span className="text-ink">{vault.stats.categories}</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>words written</span>
                <span className="text-ink">{vault.stats.words.toLocaleString()}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-linesoft">
          <div className="max-w-6xl mx-auto px-5 py-4 flex flex-wrap items-center gap-x-6 gap-y-2 justify-between">
            <span className="font-mono2 text-[10.5px] tracking-[0.14em] uppercase text-faint">
              © 2026 Kyros · rendered from src/content/vault
            </span>
            <span className="flex items-center gap-2 font-mono2 text-[10.5px] tracking-[0.14em] uppercase text-faint">
              <span className="pulse-dot" />
              markdown → knowledge graph → website
            </span>
          </div>
        </div>
      </footer>

      <SearchPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
