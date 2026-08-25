/**
 * /about — Roshan Yadav, the person behind KeasAI .
 */

import { Link } from "react-router-dom";
import { Github, Twitter, MapPin, GraduationCap, ArrowUpRight, ArrowRight,Linkedin } from "lucide-react";
import { Kicker, Reveal } from "../components/ui";
import { vault } from "../engine/vault";

/* ————— custom hand-drawn focus icons ————— */
function NlpIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 13c0-1.5 1.2-2 2.4-2.6C7.8 9.7 8 8.4 8 7c0-2.2 1.8-4 4-4" />
      <path d="M12 3c2.2 0 4 1.8 4 4 0 1.4.2 2.7 1.6 3.4C18.8 11 20 11.5 20 13" />
      <path d="M4 13v2a8 8 0 0 0 3 6.2V23h2v-1.4a8 8 0 0 0 6 0V23h2v-1.8A8 8 0 0 0 20 15v-2" />
      <path d="M9 17.5h6" />
    </svg>
  );
}
function MultimodalIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="5.5" />
      <path d="M3 20.5c1.5-2.5 3.5-2.5 5 0s3.5 2.5 5 0" />
      <path d="M15.5 15.5h7M15.5 18.5h5M15.5 21.5h7" />
      <path d="M22.5 6.5l-4 4M18.5 6.5l4 4" />
    </svg>
  );
}
function InfraIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="13" cy="5.5" rx="8" ry="3" />
      <path d="M5 5.5v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" />
      <path d="M5 12.5v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" />
      <path d="M9 9.2h.01M9 16.2h.01" />
    </svg>
  );
}

const FOCUS = [
  {
    icon: <NlpIcon />,
    title: "AI Engineering",
    body: "Building practical AI systems and learning how to take ideas from models and prototypes to reliable real-world applications",
  },
  {
    icon: <MultimodalIcon />,
    title: "LLMs & AI Agents",
    body: "Exploring LLMs and learning to build AI agents that can reason, use tools, and work through real-world tasks.",
  },
  {
    icon: <InfraIcon />,
    title: "AI Systems",
    body: "Working with the engineering foundations behind AI applications, from APIs and databases to model integration and deployment.",
  },
];

const TIMELINE = [
  {
    when: "2026 → Present",
    role: "Intern — Unisys India",
    body: "Gaining real-world experience in databases, LLMs, and agentic AI development.",
    accent: true,
  },
 
  {
    when: "2022 → 2026",
    role: "B.E. Computer Science — NMIT, Bengaluru",
    body: "Completed my B.E. in Computer Science, with a focus on machine learning and building practical projects.",
    accent: false,
  },
];

const STACK = [
  "PyTorch", "Transformers", "NLP", "Multimodal", "FastAPI", "SQL Server",
  "GenAI Tooling", "LLM Orchestration", "Python", "MY SQL", "Git", "Linux", "Docker", "C++" , "Java"];

export default function About() {
  const stats = vault.stats;

  return (
    <div className="max-w-6xl mx-auto px-5 pt-14">
      {/* ————— header ————— */}
      <Kicker>About</Kicker>
      <div className="mt-6 grid lg:grid-cols-[1.3fr_1fr] gap-10 items-start">
        <div>
          <h1 className="font-display font-bold tracking-[-0.03em] leading-[1.03] text-[clamp(2.6rem,6vw,4.4rem)]">
            <Reveal>
              <span className="reveal-mask">
                <span>Hi, I&rsquo;m Roshan Yadav.</span>
              </span>
            </Reveal>
          </h1>
          <Reveal delay={120}>
            <p className="mt-5 text-[16.5px] text-muted leading-relaxed max-w-[56ch]">
              A Computer Science graduate from{" "}
<span className="text-ink font-medium">NMIT, Bengaluru</span>, currently an{" "}
<span className="text-ink font-medium">intern at Unisys India</span>, focused
on becoming a strong{" "}
<span className="text-ink font-medium">AI Engineer</span> and learning to build
real-world AI systems and agents.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="https://github.com/ZenKyros"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 bg-accent text-accentink rounded-full px-5 py-3 text-[13.5px] font-semibold shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow)] hover:-translate-y-0.5 transition-all"
              >
                <Github size={16} />
                @ZenKyros
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <a
                href="https://www.linkedin.com/in/roshan-yadav-623b812a3/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-panel px-5 py-3 text-[13.5px] font-semibold text-ink hover:border-faint hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)] transition-all"
              >
                <Linkedin size={15} />
                Roshan Yadav
                <ArrowUpRight size={14} className="text-faint group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
            </div>
          </Reveal>

          {/* short bio strip */}
          <Reveal delay={280}>
            <div className="mt-9 rounded-xl border border-line bg-panel2/60 px-5 py-4 font-mono2 text-[12.5px] leading-relaxed text-muted">
              <span className="text-accent">~/</span> Roshan Yadav&ensp;|&ensp;CS @ NMIT &rsquo;26&ensp;|&ensp;AI/ML
              Engineer building with PyTorch, NLP Transformers &amp; Multimodal Systems&ensp;|&ensp;Intern @ Unisys
              India&ensp;|&ensp;GitHub: <span className="text-accent">@ZenKyros</span>
            </div>
          </Reveal>
        </div>

        {/* identity card */}
        <Reveal delay={180}>
          <div className="lift rounded-2xl border border-line bg-panel p-6 shadow-[var(--shadow-sm)]">
            <div className="flex items-center gap-4">
              <span className="flex-none inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent text-accentink font-display font-bold text-[20px]">
                RY
              </span>
              <div>
                <div className="font-display font-semibold text-[17px] tracking-tight">Roshan Yadav</div>
                <div className="text-[12.5px] text-muted mt-0.5">AI/ML Engineer · CS &rsquo;26</div>
              </div>
            </div>
            <div className="mt-6 space-y-3.5 text-[13.5px]">
              <div className="flex items-center gap-3 text-muted">
                <MapPin size={15} className="text-accent flex-none" />
                Bengaluru, India
              </div>
              <div className="flex items-center gap-3 text-muted">
                <GraduationCap size={15} className="text-accent flex-none" />
                NMIT Bengaluru — Class of 2026
              </div>
              <div className="flex items-center gap-3 text-muted">
                <span className="pulse-dot flex-none" />
                Currently interning at Unisys India
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-linesoft grid grid-cols-3 text-center">
              {[
                { v: stats.concepts, l: "concepts" },
                { v: stats.papers, l: "papers" },
                { v: stats.projects, l: "projects" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display font-bold text-[22px] text-accent tabular-nums">{s.v}</div>
                  <div className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-faint mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-[11.5px] text-faint leading-relaxed text-center">
              Every number above is a note I wrote in this lab.
            </p>
          </div>
        </Reveal>
      </div>

      {/* ————— bio + focus ————— */}
      <div className="mt-20 grid lg:grid-cols-[1fr_1.15fr] gap-12">
        <Reveal>
          <div>
            <Kicker className="mb-5">Longer version</Kicker>
            <div className="space-y-5 font-serif2 text-[16px] leading-[1.8] text-muted">
              <p>
                My goal is to become a strong{" "}
                <strong className="text-ink font-semibold">AI Engineer</strong>, with a focus
                on learning to build real-world AI systems and{" "}
                <strong className="text-ink font-semibold">AI agents</strong>. I’m focused on
                gaining the skills and experience needed to build AI that is practical,
                reliable, and genuinely useful.

              </p>
              <p>
                Whether I&rsquo;m fine-tuning transformer models in PyTorch, building FastAPI microservices, or exploring
                LLM orchestration, my goal is to build{" "}
                <strong className="text-ink font-semibold">reliable, high-impact AI systems from the ground up</strong>.
              </p>
            </div>
          </div>
        </Reveal>

        <div>
          <Kicker className="mb-5">What I focus on</Kicker>
          <div className="space-y-4">
            {FOCUS.map((f, i) => (
              <Reveal key={f.title} delay={i * 90}>
                <div className="lift group flex gap-5 rounded-2xl border border-line bg-panel p-5 shadow-[var(--shadow-sm)]">
                  <span className="flex-none inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accentsoft text-accent transition-transform duration-300 group-hover:scale-110">
                    {f.icon}
                  </span>
                  <div>
                    <div className="font-display font-semibold text-[15.5px] tracking-tight">{f.title}</div>
                    <p className="text-[13.5px] text-muted leading-relaxed mt-1.5">{f.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ————— experience timeline ————— */}
      <div className="mt-20">
        <Kicker className="mb-8">Where I&rsquo;ve been</Kicker>
        <div className="relative pl-8">
          <span className="absolute left-[7px] top-2 bottom-2 w-px bg-line" aria-hidden />
          <div className="space-y-10">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.role} delay={i * 100}>
                <div className="relative">
                  <span
                    className={`absolute -left-8 top-1.5 w-[15px] h-[15px] rounded-full border-[3px] border-bg ${
                      t.accent ? "bg-accent" : "bg-faint"
                    }`}
                    aria-hidden
                  />
                  <div className="font-mono2 text-[11px] tracking-[0.14em] uppercase text-faint">{t.when}</div>
                  <div className={`font-display font-semibold text-[18px] tracking-tight mt-1.5 ${t.accent ? "text-accent" : ""}`}>
                    {t.role}
                  </div>
                  <p className="text-[14px] text-muted leading-relaxed mt-2 max-w-[62ch]">{t.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ————— stack ————— */}
      <div className="mt-20">
        <Kicker className="mb-6">The stack</Kicker>
        <div className="flex flex-wrap gap-2.5">
          {STACK.map((s, i) => (
            <Reveal key={s} delay={i * 40}>
              <span className="inline-block rounded-full border border-line bg-panel px-4 py-2 text-[13px] font-medium text-muted hover:text-accent hover:border-accent/40 transition-colors cursor-default">
                {s}
              </span>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ————— how this lab fits ————— */}
      <Reveal className="mt-20">
        <div className="rounded-2xl border border-line bg-panel p-8 shadow-[var(--shadow-sm)]">
          <Kicker className="mb-4">Birth of  KeasAI </Kicker>
          <p className="font-serif2 italic text-[16.5px] text-muted leading-relaxed max-w-[64ch]">
            KeasAI is my initiative to regularly document what I learn, explore, and
            build. I keep adding notes and topics as I learn, turning them into a
            growing, connected knowledge base that I can keep building on over time.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            
          
          </div>
        </div>
      </Reveal>

      <div className="h-8" />
    </div>
  );
}
