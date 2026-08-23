/**
 * KYROSLABS — AI KNOWLEDGE LAB
 *
 * Architecture:  Markdown vault  →  content engine (src/engine)
 *              →  graph / search / roadmap  →  renderer (src/pages)
 *
 * Routing is isolated here so the engine can later be mounted at
 * /knowledge inside a larger portfolio without modification.
 */

import { HashRouter, Route, Routes, Link } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Explorer from "./pages/Explorer";
import GraphPage from "./pages/GraphPage";
import Roadmap from "./pages/Roadmap";
import Research from "./pages/Research";
import NotePage from "./pages/NotePage";
import CategoryPage from "./pages/CategoryPage";
import About from "./pages/About";

function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-5 pt-28 text-center">
      <div className="font-mono2 text-[12px] tracking-[0.24em] uppercase text-blush">404 · uncharted territory</div>
      <h1 className="font-display font-bold text-[clamp(2.4rem,6vw,4rem)] tracking-tight mt-5">
        This node has no edges.
      </h1>
      <p className="text-muted mt-4 text-[14.5px]">The page you followed is not part of the knowledge graph.</p>
      <div className="flex justify-center gap-3 mt-9">
        <Link to="/" className="inline-flex items-center gap-2 bg-accent text-bg font-mono2 text-[11px] tracking-[0.16em] uppercase px-5 py-3 rounded-md hover:brightness-110 transition-all">
          Return home
        </Link>
        <Link to="/graph" className="inline-flex items-center gap-2 border border-line font-mono2 text-[11px] tracking-[0.16em] uppercase px-5 py-3 rounded-md text-muted hover:text-ink transition-colors">
          Open the graph
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="knowledge" element={<Explorer />} />
          <Route path="graph" element={<GraphPage />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="research" element={<Research />} />
          <Route path="note/:slug" element={<NotePage />} />
          <Route path="category/*" element={<CategoryPage />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
