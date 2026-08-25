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
      className="brand-mark inline-flex items-center justify-center flex-none transition-transform duration-300 group-hover:rotate-90"
      style={{ width: size, height: size }}
    >


<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
	 viewBox="0 0 511.999 511.999">
<g>
	<g>
		<path d="M409.113,73.174c-3.884-3.909-7.959-7.736-12.113-11.377c-3.402-2.982-8.578-2.64-11.559,0.762
			c-2.982,3.402-2.64,8.577,0.762,11.559c3.871,3.393,7.67,6.96,11.288,10.602c1.601,1.612,3.706,2.418,5.811,2.418
			c2.087,0,4.176-0.793,5.774-2.381C412.285,81.57,412.302,76.383,409.113,73.174z"/>
	</g>
</g>
<g>
	<g>
		<path d="M511.883,223.39c-0.387-2.277-1.718-4.285-3.664-5.529c-9.648-6.165-20.57-10.677-32.477-13.546
			c-4.582-29.111-14.4-56.796-29.231-82.365c-2.271-3.914-7.283-5.247-11.196-2.976c-3.914,2.271-5.246,7.283-2.976,11.196
			c12.877,22.201,21.697,46.113,26.29,71.218c-27.373-2.881-58.704,1.833-91.225,14.192c-2.255,0.857-4.018,2.665-4.819,4.942
			c-0.799,2.276-0.555,4.791,0.668,6.87c15.879,26.984,15.397,62.3-0.632,92.529l-22.395-25.347
			c-2.161-2.445-5.571-3.367-8.674-2.357c-3.104,1.01-5.314,3.777-5.621,7.027c-0.505,5.337-3.576,20.744-11.628,27.858
			c-10.696,9.452-26.312,6.958-26.428,6.938c-3.432-0.614-6.875,1.012-8.582,4.051c-1.707,3.039-1.305,6.825,1.003,9.437
			l22.396,25.347c-31.971,12.184-67.081,8.316-91.908-10.763c-1.914-1.47-4.378-2.023-6.736-1.508
			c-2.357,0.513-4.369,2.04-5.497,4.173c-5.199,9.828-9.685,19.797-13.334,29.629c-1.574,4.241,0.589,8.956,4.83,10.53
			c4.241,1.573,8.956-0.589,10.53-4.83c2.389-6.434,5.165-12.941,8.292-19.43c31.764,19.653,74.264,20.862,111.045,2.509
			c2.277-1.136,3.898-3.267,4.384-5.765c0.486-2.499-0.216-5.081-1.902-6.988l-18.39-20.813c6.801-1.379,14.438-4.314,21.145-10.24
			c6.814-6.021,10.957-14.435,13.455-21.897l19.167,21.692c1.685,1.907,4.16,2.92,6.701,2.748c2.539-0.175,4.853-1.52,6.261-3.64
			c22.745-34.249,26.777-76.571,11.178-110.509c42.408-14.345,81.489-14.49,109.744-0.478
			c-26.933,37.373-38.662,77.396-32.104,109.668c-2.627,1.915-4.958,3.78-7.138,5.707c-28.716,25.372-41.647,63.033-35.175,99.456
			c-35.352-10.905-74.318-2.709-103.034,22.663c-2.18,1.926-4.318,4.007-6.54,6.378c-31.218-10.478-72.377-3.77-112.778,18.353
			c-5.393-15.5-6.704-33.786-3.769-53.468c0.667-4.475-2.419-8.644-6.894-9.31c-4.479-0.666-8.643,2.419-9.31,6.894
			c-1.079,7.237-1.625,14.325-1.681,21.222C80.445,426.13,16.383,339.788,16.383,241.871c0-122.937,100.017-222.955,222.954-222.955
			c38.35,0,76.167,9.896,109.361,28.618c3.941,2.223,8.937,0.83,11.159-3.111c2.223-3.941,0.83-8.938-3.111-11.159
			C321.102,13.158,280.501,2.532,239.337,2.532c-63.929,0-124.032,24.895-169.237,70.102C24.895,117.839,0,177.942,0,241.871
			c0,107.145,71.465,201.374,174.204,230.355c1.47,11.755,4.567,22.722,9.268,32.577c0.994,2.085,2.822,3.654,5.035,4.319
			c0.773,0.232,1.567,0.346,2.358,0.346c1.473,0,2.936-0.398,4.223-1.172c40.342-24.272,83.169-31.912,111.771-19.936
			c3.27,1.367,7.05,0.478,9.365-2.205c3.187-3.694,5.992-6.581,8.829-9.086c28.015-24.755,67.477-30.27,100.536-14.053
			c2.979,1.461,6.545,0.982,9.033-1.216c2.487-2.198,3.402-5.677,2.319-8.814c-12.027-34.8-1.694-73.281,26.322-98.037
			c2.835-2.506,6.048-4.935,10.107-7.646c2.948-1.968,4.296-5.61,3.34-9.023c-8.362-29.854,4.491-71.414,33.546-108.462
			C511.679,228.003,512.271,225.666,511.883,223.39z"/>
	</g>
</g>
</svg>


    </span>
  );
}
const NAV = [
  { to: "/knowledge", label: "Notes" },
  { to: "/graph", label: "Graph" },
  { to: "/about", label: "About" },
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
      ? `${note.meta.title} · KeasAI`
      : path === "/"
      ? "KeasAI · AI Knowledge Lab"
      : `${path.slice(1)[0]?.toUpperCase() ?? ""}${path.slice(2)} · KeasAI`;
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
              <span className="block font-display font-bold text-[17px] tracking-tight">
                Keas<span className="text-accent">AI</span>
              </span>
              <span className="hidden sm:block text-[10.5px] font-medium tracking-[0.08em] uppercase text-faint mt-0.5">
                Learn AI from Scratch
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
              <span className="font-display font-bold text-[19px] tracking-tight">
                Keas<span className="text-accent">AI</span>
              </span>
            </Link>
            <p className="text-[13.5px] text-muted leading-relaxed mt-4 max-w-[30ch]">
              An evolving map of artificial intelligence Concepts .
            </p>
            <p className="text-[12.5px] text-faint mt-3">
              Built by{" "}
              <Link to="/about" className="text-muted hover:text-accent transition-colors font-medium">
                Roshan Yadav
              </Link>
            </p>
          </div>
          <div>
            <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-faint mb-4">Explore</div>
            <ul className="space-y-2.5">
              {[{ to: "/knowledge", label: "Knowledge" }, { to: "/graph", label: "Graph" }].map((l) => (
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
              {vault.stats.totalNotes} notes · {vault.stats.papers} papers —
              A Growing  Collection of <code className="font-mono2 text-[11.5px] text-accent">Ai Notes , Ideas </code> and things I am Learning. exploring 
              and building along the way.
            </p>
          </div>
        </div>
        <div className="border-t border-linesoft">
          <div className="max-w-6xl mx-auto px-5 py-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-faint">
            <span>© 2026 KeasAI · AI Knowledge Lab</span>
            <span className="hidden sm:inline">Learn, Build and Become an AI Engineer</span>
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
