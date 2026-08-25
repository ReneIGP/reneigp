/**
 * ============================================================
 * RENE IGNACIO GONZALEZ PEREZ — Personal Portfolio
 * ============================================================
 * LAYOUT SYSTEM:
 *   All sections use `w-full px-10 lg:px-20` for consistent
 *   edge padding across the full screen width.
 *   No max-width caps — content stretches edge to edge with
 *   comfortable breathing room on both sides.
 * ============================================================
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Github, Linkedin, Globe, Mail, Phone,
  ExternalLink, Menu, X, ChevronDown, MapPin,
} from "lucide-react";

/* ── DATA ─────────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: "About",      href: "#about"      },
  { label: "Skills",     href: "#skills"      },
  { label: "Experience", href: "#experience"  },
  { label: "Projects",   href: "#projects"    },
  { label: "Education",  href: "#education"   },
  { label: "Contact",    href: "#contact"     },
];

const HERO = {
  name:     "Rene Ignacio Gonzalez Perez",
  title:    "Software Engineer & IT Consultant",
  //tagline:  "Software Engineer building anything from neural networks, to self-driving cars, to webapps.",
  location: "Göteborg, Sweden",
  links: [
    { icon: Globe,    label: "reneigp.se",                   href: "https://reneigp.se"                                  },
    { icon: Github,   label: "ReneIGP",                      href: "https://github.com/ReneIGP"                          },
    { icon: Linkedin, label: "rene-ignacio-gonzalez-perez",  href: "https://linkedin.com/in/rene-ignacio-gonzalez-perez" },
    { icon: Mail,     label: "ignachogonzalez01@gmail.com",  href: "mailto:ignachogonzalez01@gmail.com"                  },
  ],
};

const ABOUT = `I'm a Computer Science Masters student at the University of Gothenburg. Whether that's learning a new skill, repurposing old hardware from
trash with a fresh OS, or setting up homelabs. I care about building things that are useful and thoughtfully made.
Outside of code you'll find me climbing and organizing events for my fellow students.`;

const SKILLS = [
  { category: "Languages",     items: ["Python", "C++", "JavaScript", "TypeScript", "SQL"] },
  { category: "Frontend",      items: ["React", "Vue.js", "Tailwind CSS", "HTML/CSS", "Web Audio API"] },
  { category: "Backend",       items: ["Django", "Django REST Framework", "Node.js", "RESTful APIs"] },
  { category: "ML / AI",       items: ["TensorFlow", "Keras", "MediaPipe", "OpenCV", "LSTM"] },
  { category: "DevOps & Tools",items: ["Docker", "GitLab CI/CD", "CMake", "DigitalOcean", "Catch2"] },
  { category: "Other",         items: ["Google Maps API", "Generative AI", "UI/UX Design", "Rapid Prototyping", "Homelabbing"] },
];

const EXPERIENCE = [
  {
    company:  "Ericsson",
    role:     "Part-time worker",
    period:   "August 2026 – Present",
    location: "Gothenburg, Sweden",
    bullets: [
      "Part-time work focused on CI/CD development with BCSS"],
  },
  {
    company:  "Ericsson",
    role:     "R&D Summer Intern",
    period:   "June 2026 – August 2026",
    location: "Gothenburg, Sweden",
    bullets: [
      "R&D internship focused on CI/CD pipelines and automated test infrastructure for large-scale telecom systems.",
      "Working in Python and Linux environments with the Test Framework and System Test teams, using container-based tooling.",
      "eveloped scripts to automate test-result review and failure triage."],
  },
  {
    company:  "CTB (Chalmers Teknologkonsulter AB)",
    role:     "Student IT Consultant",
    period:   "Feb 2026 – Present",
    location: "Gothenburg, Sweden",
    bullets: [
      "Execute technology and management projects for external customers and internal company initiatives.",
      "Deliver IT consultancy services, bridging the gap between technical execution and business needs.",
      "Manage full service-delivery lifecycle — marketing, recruitment, and client events.",
    ],
  },
  {
    company:  "SwipeJobb AB",
    role:     "Back-end Developer Intern",
    period:   "Sep 2025 – Nov 2025",
    location: "Gothenburg, Sweden",
    bullets: [
      "Built RESTful endpoints to enhance backend scalability.",
      "Developed an internal Admin Dashboard that streamlined operational workflows.",
    ],
  },
];

const PROJECTS = [
  {
    name:   "ASL Hand-Sign Recognition System",
    period: "Oct 2025 – Jan 2026",
    role:   "Lead Full-Stack & ML Developer",
    desc:   "Real-time ASL recognition platform powered by an LSTM neural network and MediaPipe for hand-landmark extraction. Custom dashboard for live data collection and model versioning.",
    tags:   ["TensorFlow", "Keras", "MediaPipe", "Django REST", "React", "Docker", "GitLab CI/CD"],
    highlight: false,
  },
  {
    name:   "Cone Vision — Self-Driving Car Steering",
    period: "Mar 2025 – Jun 2025",
    role:   "Systems & DevOps Engineer",
    desc:   "C++ software framework for autonomous vehicle perception and steering. Multi-stage Docker environment ensuring consistent CI/CD deployments across Linux VMs.",
    tags:   ["C++", "Docker", "CMake", "GitLab CI/CD", "Catch2"],
    highlight: false,
  },
  {
    name:   "Mapventures",
    period: "Jun 2025",
    role:   "Full-Stack Developer (Hackathon)",
    desc:   "Web app using Google Maps Street View for AI-driven global exploration. AI logic layer identifies locations and generates historical context with a smart fallback for landmark suggestions.",
    tags:   ["React", "Node.js", "Google Maps API", "Generative AI"],
    highlight: false,
  },
  {
    name:   "Trappist Explorers — NASA Space Apps",
    period: "Oct 2024",
    role:   "Fullstack Developer — Global Finalist 🏆",
    desc:   "Award-winning educational platform gamifying exoplanet exploration for children. Vue.js + Tailwind frontend with Web Audio API for synchronized storytelling during interactive painting sessions.",
    tags:   ["Vue.js", "Tailwind CSS", "Web Audio API", "UI/UX Design"],
    highlight: true,
  },
];

const EDUCATION = [
  {
    institution: "University of Gothenburg",
    degree:      "B.S. in Software Engineering and Management",
    period:      "Aug 2023 – June 2026",
    location:    "Gothenburg, Sweden",
    extras: [
    "OOPSEX (Göta Studentkår) — Core Member & Cashier (May 2024 – Present): managed yearly budget, organised events for 150+ people.",
    ],
  },
  {
    institution: "University of Gothenburg",
    degree:      "M.S Computer Science",
    period:      "September 2026 – present",
    location:    "Gothenburg, Sweden",
  }
];

/* ── SHARED PADDING — edit once, applies everywhere ─────── */
const PAD = "px-10 lg:px-20";

/* ── NAVBAR ──────────────────────────────────────────────── */
function Navbar() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const lc = "text-slate-400 hover:text-amber-400 transition-colors duration-200 text-sm tracking-wide font-mono uppercase";

    return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0a0f1e]/90 backdrop-blur-md border-b border-slate-800/60 py-3" : "bg-transparent py-5"}`}>
      {/* ADDED: max-w-6xl mx-auto to center the navbar content */}
      <div className={`max-w-6xl mx-auto w-full ${PAD} flex items-center justify-between`}>
        <Link to="/" className="font-mono text-amber-400 font-bold text-lg tracking-widest hover:opacity-80 transition-opacity">
          R.I.G.P
        </Link>
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <li key={l.href}><a href={l.href} className={lc}>{l.label}</a></li>
          ))}
          <li>
            <Link to="/os" className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-400 text-xs font-mono tracking-widest uppercase hover:bg-amber-400/20 hover:border-amber-400/70 transition-all duration-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Enter current project
            </Link>
          </li>
        </ul>
        <button onClick={() => setOpen(!open)} className="md:hidden text-slate-400 hover:text-amber-400 transition-colors" aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <ul className={`md:hidden bg-[#0d1425] border-t border-slate-800/60 ${PAD} py-4 flex flex-col gap-4`}>
          {NAV_LINKS.map(l => (
            <li key={l.href}><a href={l.href} onClick={() => setOpen(false)} className={lc}>{l.label}</a></li>
          ))}
          <li>
            <Link to="/os" onClick={() => setOpen(false)} className="inline-flex items-center gap-1.5 text-amber-400 text-sm font-mono tracking-widest uppercase hover:text-amber-300 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Enter OS
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}

/* ── HERO ─────────────────────────────────────────────────── */
function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center w-full">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(245,158,11,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(245,158,11,0.04) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      
      {/* ADDED: A container div with max-w-6xl mx-auto to center the text */}
      <div className={`relative z-10 max-w-6xl mx-auto w-full ${PAD} pt-20 pb-16`}>
        <span className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" style={{ animation: "ping 1.5s ease-in-out infinite" }} />
          Open to work
        </span>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight text-slate-50 mb-5" style={{ fontFamily: "'DM Serif Display', serif" }}>
          {HERO.name.split("\n").map((line, i) => (
            <span key={i} className="block">
              {i === 1
                ? <><span className="text-amber-400">{line.split(" ")[0]}</span>{" "}{line.split(" ").slice(1).join(" ")}</>
                : line}
            </span>
          ))}
        </h1>

        <p className="font-mono text-amber-400/80 text-sm tracking-widest uppercase mb-3">{HERO.title}</p>
        <p className="text-slate-400 text-lg max-w-2xl leading-relaxed mb-6">{HERO.tagline}</p>

        <div className="flex items-center gap-1.5 text-slate-500 text-sm font-mono mb-8">
          <MapPin size={14} className="text-amber-400/60" />
          {HERO.location}
        </div>

        <div className="flex flex-wrap gap-3">
          {HERO.links.map(({ icon: Icon, label, href }) => (
            <a key={href} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 bg-slate-800/40 text-slate-300 text-xs font-mono hover:border-amber-400/50 hover:text-amber-300 hover:bg-amber-400/5 transition-all duration-200">
              <Icon size={13} />{label}
            </a>
          ))}
        </div>
      </div>

      <a href="#about" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-600 hover:text-amber-400 transition-colors" style={{ animation: "bounce 2s ease-in-out infinite" }}>
        <ChevronDown size={24} />
      </a>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500&display=swap');
        html { scroll-behavior: smooth; }
        @keyframes ping   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
        @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(6px)} }
      `}</style>
    </section>
  );
}

/* ── ABOUT ───────────────────────────────────────────────── */
function About() {
  return (
    <section id="about" className={`py-24 w-full max-w-6xl mx-auto ${PAD}`}>
      <SectionLabel index="01" title="About Me" />
      <div className="mt-10 grid md:grid-cols-5 gap-10 items-start">
        <p className="md:col-span-3 text-slate-300 text-lg leading-relaxed">{ABOUT}</p>
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          {[
            { n: "IT Consultant"},
            { n: "Backend Developer"},
            { n: "Event organizer"},
            { n: "Curious"},
          ].map(({ n, label }) => (
            <div key={label} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 hover:border-amber-400/30 transition-colors">
              <span className="block text-3xl font-bold text-amber-400 mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>{n}</span>
              <span className="text-xs text-slate-500 leading-snug">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SKILLS ──────────────────────────────────────────────── */
function Skills() {
  return (
    <section id="skills" className={`py-24 w-full ${PAD}`}>
      <SectionLabel index="02" title="Skills" />
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SKILLS.map(({ category, items }) => (
          <div key={category} className="bg-slate-800/20 border border-slate-700/40 rounded-xl p-5 hover:border-amber-400/25 transition-colors duration-200">
            <h3 className="font-mono text-amber-400 text-xs tracking-widest uppercase mb-4">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {items.map(skill => (
                <span key={skill} className="font-mono text-xs text-slate-300 bg-slate-700/50 border border-slate-600/40 rounded px-2.5 py-1 hover:border-amber-400/40 hover:text-amber-300 transition-colors cursor-default">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── EXPERIENCE ──────────────────────────────────────────── */
function Experience() {
  return (
    <section id="experience" className={`py-24 w-full ${PAD}`}>
      <SectionLabel index="03" title="Experience" />
      <div className="mt-10 flex flex-col gap-8">
        {EXPERIENCE.map((job, i) => (
          <div key={i} className="relative pl-6 border-l-2 border-amber-400/30 hover:border-amber-400/70 transition-colors duration-300 group">
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-amber-400/50 bg-[#0a0f1e] group-hover:border-amber-400 transition-colors" />
            <div className="bg-slate-800/20 border border-slate-700/40 rounded-xl p-6 hover:bg-slate-800/30 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
                <h3 className="text-slate-100 text-lg font-semibold" style={{ fontFamily: "'DM Serif Display', serif" }}>{job.role}</h3>
                <span className="font-mono text-xs text-amber-400/70 whitespace-nowrap mt-0.5">{job.period}</span>
              </div>
              <p className="font-mono text-sm text-slate-400 mb-4">{job.company} · {job.location}</p>
              <ul className="flex flex-col gap-2">
                {job.bullets.map((b, j) => (
                  <li key={j} className="flex gap-2 text-slate-400 text-sm leading-relaxed">
                    <span className="text-amber-400/60 mt-0.5 shrink-0">—</span>{b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── PROJECTS ────────────────────────────────────────────── */
function Projects() {
  return (
    <section id="projects" className={`py-24 w-full ${PAD}`}>
      <SectionLabel index="04" title="Projects" />
      <div className="mt-10 grid md:grid-cols-2 gap-6">
        {PROJECTS.map((p, i) => (
          <div key={i} className={`relative flex flex-col bg-slate-800/20 border rounded-xl p-6 hover:bg-slate-800/35 transition-all duration-200 hover:-translate-y-0.5 ${p.highlight ? "border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.07)]" : "border-slate-700/40 hover:border-amber-400/25"}`}>
            {p.highlight && (
              <span className="absolute top-4 right-4 font-mono text-[10px] text-amber-300 bg-amber-400/10 border border-amber-400/30 rounded-full px-2 py-0.5 tracking-widest uppercase">🏆 Global Finalist</span>
            )}
            <div className="mb-2">
              <p className="font-mono text-xs text-amber-400/70 tracking-wider mb-1">{p.period}</p>
              <h3 className="text-slate-100 text-lg font-semibold leading-snug" style={{ fontFamily: "'DM Serif Display', serif" }}>{p.name}</h3>
              <p className="text-slate-500 text-xs font-mono mt-0.5">{p.role}</p>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mt-3 flex-1">{p.desc}</p>
            <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-slate-700/40">
              {p.tags.map(t => <span key={t} className="font-mono text-[11px] text-slate-400 bg-slate-700/40 rounded px-2 py-0.5">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── EDUCATION ───────────────────────────────────────────── */
function Education() {
  return (
    <section id="education" className={`py-24 w-full ${PAD}`}>
      <SectionLabel index="05" title="Education" />
      <div className="mt-10 bg-slate-800/20 border border-slate-700/40 rounded-xl p-6 hover:border-amber-400/25 transition-colors max-w-3xl">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
          <h3 className="text-slate-100 text-xl font-semibold" style={{ fontFamily: "'DM Serif Display', serif" }}>{EDUCATION.institution}</h3>
          <span className="font-mono text-xs text-amber-400/70 whitespace-nowrap mt-0.5">{EDUCATION.period}</span>
        </div>
        <p className="text-amber-400/80 font-mono text-sm mb-1">{EDUCATION.degree}</p>
        <p className="text-slate-500 font-mono text-xs mb-5">{EDUCATION.location}</p>
        {EDUCATION.extras.map((e, i) => (
          <p key={i} className="text-slate-400 text-sm leading-relaxed border-t border-slate-700/40 pt-4">
            <span className="text-amber-400/60 mr-2">↗</span>{e}
          </p>
        ))}
      </div>
    </section>
  );
}

/* ── CONTACT ─────────────────────────────────────────────── */
function Contact() {
  return (
    <footer id="contact" className={`py-24 w-full ${PAD} border-t border-slate-800/60`}>
      <SectionLabel index="06" title="Get In Touch" />
      <p className="mt-6 text-slate-400 max-w-lg text-lg leading-relaxed">
        If you have an open role or are interested in any projects my inbox is always open.
      </p>
      <a href="mailto:ignachogonzalez01@gmail.com" className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-amber-400 text-slate-900 font-mono font-semibold text-sm rounded-full hover:bg-amber-300 active:scale-95 transition-all duration-200">
        <Mail size={15} />Say Hello
      </a>
      <div className="mt-10 flex flex-wrap gap-4">
        {HERO.links.filter(l => l.icon !== Mail).map(({ icon: Icon, label, href }) => (
          <a key={href} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
            className="inline-flex items-center gap-2 text-slate-500 text-sm font-mono hover:text-amber-400 transition-colors">
            <Icon size={14} />{label}<ExternalLink size={11} className="opacity-50" />
          </a>
        ))}
      </div>
      <p className="mt-16 text-slate-700 text-xs font-mono">
        © {new Date().getFullYear()} Rene Ignacio Gonzalez Perez · Designed & built with React
      </p>
    </footer>
  );
}

/* ── SECTION LABEL ───────────────────────────────────────── */
function SectionLabel({ index, title }) {
  return (
    <div className="flex items-baseline gap-4 overflow-hidden">
      <span className="font-mono text-7xl font-bold text-slate-800/70 leading-none select-none">{index}</span>
      <h2 className="text-slate-100 text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>{title}</h2>
    </div>
  );
}

/* ── ROOT ────────────────────────────────────────────────── */
export default function Portfolio() {
  return (
    <div className="w-full min-h-screen bg-[#0a0f1e] text-slate-100 overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Education />
      <Contact />
    </div>
  );
}
