import { useState, useEffect, useRef, useCallback } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 1,
    title: "AirGap",
    subtitle: "AI Gesture-Based Virtual Mouse",
    tags: ["Python", "OpenCV", "MediaPipe", "PyAutoGUI"],
    desc: "Control a computer without touching a mouse. Real-time hand tracking translates gestures into mouse actions — movement, clicking, scrolling, dragging.",
    year: "2026",
    size: "large",
    accent: "#ABD1C6",
  },
  {
    id: 2,
    title: "Easy-Pluck",
    subtitle: "Local Network File Sharing",
    tags: ["Flask", "Python", "QR Code"],
    desc: "Lightweight Flask app for rapid file sharing over a local network. Upload from one device, pluck from another via web interface or QR code.",
    year: "2025",
    size: "medium",
    accent: "#E8C547",
  },
  {
    id: 3,
    title: "Portfolio",
    subtitle: "Personal Developer Portfolio",
    tags: ["HTML", "CSS", "JavaScript"],
    desc: "A clean personal portfolio showcasing projects, skills and certifications — the canvas for my journey.",
    year: "2025",
    size: "small",
    accent: "#F07167",
  },
];

const CERTIFICATIONS = [
  { name: "AWS Cloud Builder Labs", issuer: "AWS Training Online", year: "2026" },
  { name: "Introduction to Cyber Security", issuer: "Simplilearn", year: "2025" },
  { name: "Introduction to Cloud Security", issuer: "Simplilearn", year: "2025" },
  { name: "Project Management Foundations", issuer: "PMI / LinkedIn Learning", year: "2025" },
  { name: "OCI Generative AI Professional", issuer: "Oracle", year: "2025" },
  { name: "JavaScript Algorithms & Data Structures", issuer: "freeCodeCamp", year: "2025" },
  { name: "Build Real World AI Apps (Gemini & Imagen)", issuer: "Google Cloud", year: "2024" },
  { name: "Cloud Speech API: 3 Ways", issuer: "Google Cloud", year: "2024" },
  { name: "Analyze Sentiment with NL API", issuer: "Google Cloud", year: "2024" },
  { name: "Programming in C", issuer: "Infosys Springboard", year: "2024" },
  { name: "C++ Programming – Beginners", issuer: "Infosys Springboard", year: "2025" },
  { name: "TCS iON Career Edge – IT Primer", issuer: "TCS iON", year: "2025" },
];

const TIMELINE = [
  {
    period: "Feb 2026",
    role: "Event Organizer",
    org: "Srinivas University",
    detail: "Planned & executed the Placement Simulation Program — mock aptitude tests, technical screening, and interview readiness workshops.",
  },
  {
    period: "2025",
    role: "2nd Place – Hackathon 1.0",
    org: "Dept. of MCA, Srinivas University",
    detail: "Competed and placed 2nd in the university hackathon, demonstrating end-to-end problem solving under time pressure.",
  },
  {
    period: "Jan 2025 – Feb 2026",
    role: "Team Member",
    org: "Wow! Momo",
    detail: "Honed high-pressure communication, billing accuracy, and fast-paced multitasking — skills directly translating to incident response and team collaboration.",
  },
  {
    period: "2024 – Present",
    role: "BCA Student",
    org: "Srinivas University",
    detail: "Specialising in AWS Cloud, Data Analytics & AI. Active on TryHackMe for offensive security and Google Cloud for practicals.",
  },
];

// ─── Noise SVG overlay ────────────────────────────────────────────────────────
const NoiseBg = () => (
  <svg
    style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 9999, opacity: 0.035 }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

// ─── Custom Cursor ────────────────────────────────────────────────────────────
const Cursor = () => {
  const dot = useRef(null);
  const ring = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const magnetic = useRef(false);
  const raf = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onEnter = (e) => {
      const el = e.target.closest("a,button,[data-mag]");
      if (el) {
        magnetic.current = true;
        ring.current && (ring.current.style.transform = "translate(-50%,-50%) scale(2.2)");
        ring.current && (ring.current.style.borderColor = "#ABD1C6");
      }
    };
    const onLeave = () => {
      magnetic.current = false;
      ring.current && (ring.current.style.transform = "translate(-50%,-50%) scale(1)");
      ring.current && (ring.current.style.borderColor = "#F0EDE5");
    };

    const animate = () => {
      const dx = pos.current.x - ringPos.current.x;
      const dy = pos.current.y - ringPos.current.y;
      ringPos.current.x += dx * 0.12;
      ringPos.current.y += dy * 0.12;

      if (dot.current) {
        dot.current.style.left = pos.current.x + "px";
        dot.current.style.top = pos.current.y + "px";
      }
      if (ring.current) {
        ring.current.style.left = ringPos.current.x + "px";
        ring.current.style.top = ringPos.current.y + "px";
      }
      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseenter", onEnter, true);
    document.addEventListener("mouseleave", onLeave, true);
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onEnter, true);
      document.removeEventListener("mouseleave", onLeave, true);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div
        ref={dot}
        style={{
          position: "fixed", width: 8, height: 8, borderRadius: "50%",
          background: "#ABD1C6", pointerEvents: "none", zIndex: 100000,
          transform: "translate(-50%,-50%)", transition: "background 0.2s",
        }}
      />
      <div
        ref={ring}
        style={{
          position: "fixed", width: 36, height: 36, borderRadius: "50%",
          border: "1.5px solid #F0EDE5", pointerEvents: "none", zIndex: 99999,
          transform: "translate(-50%,-50%)", transition: "transform 0.3s cubic-bezier(.175,.885,.32,1.275), border-color 0.3s",
        }}
      />
    </>
  );
};

// ─── Scroll Reveal Text ───────────────────────────────────────────────────────
const RevealText = ({ children, className = "", delay = 0, tag: Tag = "span" }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);

  const words = String(children).split(" ");

  return (
    <Tag ref={ref} className={className} style={{ display: "block", overflow: "hidden" }}>
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            marginRight: "0.28em",
            transform: visible ? "translateY(0)" : "translateY(110%)",
            opacity: visible ? 1 : 0,
            transition: `transform 0.7s cubic-bezier(.22,1,.36,1) ${delay + i * 0.04}s, opacity 0.5s ease ${delay + i * 0.04}s`,
          }}
        >
          {w}
        </span>
      ))}
    </Tag>
  );
};

// ─── Nav ──────────────────────────────────────────────────────────────────────
const NAV_LINKS = ["About", "Projects", "Experience", "Certifications", "Contact"];

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: "1.2rem 2.5rem",
        background: scrolled ? "rgba(0,70,67,0.72)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(240,237,229,0.08)" : "none",
        transition: "all 0.4s ease",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}
    >
      <button
        onClick={() => scrollTo("hero")}
        style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: "#F0EDE5", background: "none", border: "none", cursor: "none", letterSpacing: "0.04em" }}
      >
        MRj<span style={{ color: "#ABD1C6" }}>.</span>
      </button>

      {/* Desktop */}
      <div style={{ display: "flex", gap: "2.5rem" }} className="nav-desktop">
        {NAV_LINKS.map((l) => (
          <button
            key={l}
            data-mag
            onClick={() => scrollTo(l)}
            style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", letterSpacing: "0.12em",
              textTransform: "uppercase", color: "#F0EDE5", background: "none", border: "none",
              cursor: "none", opacity: 0.72, transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = 1)}
            onMouseLeave={(e) => (e.target.style.opacity = 0.72)}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(!open)}
        style={{ display: "none", background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: 5, padding: 4 }}
        className="nav-ham"
      >
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ display: "block", width: 24, height: 1.5, background: "#F0EDE5", borderRadius: 2, transition: "all 0.3s" }} />
        ))}
      </button>

      {open && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,70,67,0.97)", zIndex: 9000,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2.5rem",
        }}>
          <button onClick={() => setOpen(false)} style={{ position: "absolute", top: "1.5rem", right: "2rem", background: "none", border: "none", color: "#F0EDE5", fontSize: "1.6rem", cursor: "pointer" }}>×</button>
          {NAV_LINKS.map((l) => (
            <button key={l} onClick={() => scrollTo(l)}
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#F0EDE5", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.06em" }}>
              {l}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 700px) {
          .nav-desktop { display: none !important; }
          .nav-ham { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "0 2.5rem", position: "relative", overflow: "hidden",
      }}
    >
      {/* Background accent circle */}
      <div style={{
        position: "absolute", top: "10%", right: "-8%", width: 480, height: 480,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(171,209,198,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "5%", left: "-5%", width: 320, height: 320,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(171,209,198,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 980, margin: "0 auto", width: "100%", paddingTop: "5rem" }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", letterSpacing: "0.22em",
          textTransform: "uppercase", color: "#ABD1C6", marginBottom: "1.8rem",
          transform: loaded ? "translateY(0)" : "translateY(20px)", opacity: loaded ? 1 : 0,
          transition: "all 0.6s ease 0.1s",
        }}>
          Hello
        </p>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(3rem, 9vw, 8rem)",
          lineHeight: 1.02, fontWeight: 900, color: "#F0EDE5",
          letterSpacing: "-0.02em", marginBottom: "0.3rem",
        }}>
          {["Midhun", "Raj"].map((word, wi) => (
            <span
              key={word}
              style={{
                display: "block",
                transform: loaded ? "translateY(0)" : "translateY(60px)",
                opacity: loaded ? 1 : 0,
                transition: `transform 0.8s cubic-bezier(.22,1,.36,1) ${0.2 + wi * 0.12}s, opacity 0.6s ease ${0.2 + wi * 0.12}s`,
              }}
            >
              {word}
              {wi === 1 && <span style={{ color: "#ABD1C6" }}>.</span>}
            </span>
          ))}
        </h1>

        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(0.95rem, 2vw, 1.2rem)",
          color: "#F0EDE5", opacity: 0.55, maxWidth: 520, lineHeight: 1.65, marginTop: "1.8rem",
          transform: loaded ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.7s ease 0.55s", opacity: loaded ? 0.55 : 0,
        }}>
          BCA student at Srinivas University. Offensive security learner. Cloud practitioner. I study how systems break so I can help them hold.
        </p>

        <div style={{
          display: "flex", gap: "1.2rem", marginTop: "3rem", flexWrap: "wrap",
          transform: loaded ? "translateY(0)" : "translateY(20px)", opacity: loaded ? 1 : 0,
          transition: "all 0.7s ease 0.7s",
        }}>
          <a
            href="#projects"
            data-mag
            onClick={(e) => { e.preventDefault(); document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); }}
            style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#004643", background: "#ABD1C6",
              padding: "0.85rem 2rem", borderRadius: 2, textDecoration: "none",
              transition: "transform 0.2s, background 0.2s", display: "inline-block",
            }}
            onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.background = "#F0EDE5"; }}
            onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.background = "#ABD1C6"; }}
          >
            View Work
          </a>
          <a
            href="#contact"
            data-mag
            onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
            style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#F0EDE5", border: "1px solid rgba(240,237,229,0.3)",
              padding: "0.85rem 2rem", borderRadius: 2, textDecoration: "none",
              transition: "all 0.2s", display: "inline-block",
            }}
            onMouseEnter={(e) => { e.target.style.borderColor = "#ABD1C6"; e.target.style.color = "#ABD1C6"; }}
            onMouseLeave={(e) => { e.target.style.borderColor = "rgba(240,237,229,0.3)"; e.target.style.color = "#F0EDE5"; }}
          >
            Get in Touch
          </a>
        </div>

        {/* Scroll hint */}
        <div style={{
          marginTop: "6rem", display: "flex", alignItems: "center", gap: "1rem",
          opacity: loaded ? 0.35 : 0, transition: "opacity 0.7s ease 1.2s",
        }}>
          <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, transparent, #F0EDE5)" }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#F0EDE5" }}>Scroll</span>
        </div>
      </div>
    </section>
  );
};

// ─── About ────────────────────────────────────────────────────────────────────
const About = () => {
  const SKILLS = ["Python", "C / C++", "Flask", "HTML & CSS", "JavaScript", "TryHackMe", "Ethical Hacking", "Cloud Security", "Google Cloud", "AWS", "OpenCV", "MediaPipe"];

  return (
    <section id="about" style={{ padding: "10rem 2.5rem", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}
        className="about-grid">
        <div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#ABD1C6", marginBottom: "1.5rem" }}>
            001 — About
          </p>
          <RevealText tag="h2" className="" style={{}} delay={0}>
            Bridging offense and defense in the digital frontier
          </RevealText>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#F0EDE5", lineHeight: 1.15, marginBottom: "2rem", fontWeight: 700 }}>
            <RevealText delay={0}>Bridging offense and defense in the digital frontier</RevealText>
          </h2>
        </div>
        <div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "#F0EDE5", opacity: 0.68, lineHeight: 1.85, marginBottom: "1.5rem" }}>
            I am a Cybersecurity-focused BCA student at Srinivas University Mangaluru. My philosophy: understanding how systems are broken is the most effective way to protect them.
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "#F0EDE5", opacity: 0.68, lineHeight: 1.85, marginBottom: "2.5rem" }}>
            My time at Wow! Momo — handling billing and high-volume customer pressure — has unexpectedly sharpened skills I now translate into incident response: composure, precision, and communication under fire.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
            {SKILLS.map((s) => (
              <span key={s} style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", letterSpacing: "0.08em",
                textTransform: "uppercase", color: "#ABD1C6", border: "1px solid rgba(171,209,198,0.3)",
                padding: "0.4rem 0.9rem", borderRadius: 100,
                transition: "background 0.2s, color 0.2s",
              }}
                onMouseEnter={(e) => { e.target.style.background = "#ABD1C6"; e.target.style.color = "#004643"; }}
                onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#ABD1C6"; }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </section>
  );
};

// ─── Projects (Bento) ─────────────────────────────────────────────────────────
const ProjectCard = ({ p, style = {} }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      data-mag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `rgba(171,209,198,0.08)` : "rgba(240,237,229,0.04)",
        border: `1px solid ${hovered ? p.accent + "55" : "rgba(240,237,229,0.1)"}`,
        borderRadius: 8, padding: "2.2rem", cursor: "none",
        transform: hovered ? "translateY(-6px) translateZ(20px)" : "translateY(0) translateZ(0)",
        transition: "all 0.4s cubic-bezier(.22,1,.36,1)",
        boxShadow: hovered ? `0 24px 60px rgba(0,0,0,0.28), 0 0 0 1px ${p.accent}22` : "none",
        ...style,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <span style={{
          width: 10, height: 10, borderRadius: "50%", background: p.accent,
          display: "block", marginTop: 4,
          boxShadow: hovered ? `0 0 16px ${p.accent}` : "none",
          transition: "box-shadow 0.3s",
        }} />
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#F0EDE5", opacity: 0.35, letterSpacing: "0.1em" }}>{p.year}</span>
      </div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: p.size === "large" ? "2rem" : "1.4rem", color: "#F0EDE5", fontWeight: 700, marginBottom: "0.4rem", lineHeight: 1.1 }}>{p.title}</h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: p.accent, letterSpacing: "0.06em", marginBottom: "1rem" }}>{p.subtitle}</p>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#F0EDE5", opacity: 0.58, lineHeight: 1.7, marginBottom: "1.5rem" }}>{p.desc}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {p.tags.map((t) => (
          <span key={t} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "#F0EDE5", opacity: 0.4, background: "rgba(240,237,229,0.06)", padding: "0.3rem 0.7rem", borderRadius: 100 }}>{t}</span>
        ))}
      </div>
    </div>
  );
};

const Projects = () => (
  <section id="projects" style={{ padding: "8rem 2.5rem", maxWidth: 1100, margin: "0 auto" }}>
    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#ABD1C6", marginBottom: "1.2rem" }}>002 — Projects</p>
    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: "#F0EDE5", fontWeight: 900, marginBottom: "3.5rem", lineHeight: 1.1 }}>
      Things I've built
    </h2>

    {/* Bento grid */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "auto auto", gap: "1.2rem" }} className="bento-grid">
      <ProjectCard p={PROJECTS[0]} style={{ gridColumn: "1 / 3" }} />
      <ProjectCard p={PROJECTS[1]} style={{ gridColumn: "3 / 4", gridRow: "1 / 2" }} />
      <ProjectCard p={PROJECTS[2]} style={{ gridColumn: "3 / 4", gridRow: "2 / 3" }} />
    </div>

    <style>{`
      @media (max-width: 800px) {
        .bento-grid { grid-template-columns: 1fr !important; }
        .bento-grid > * { grid-column: 1 !important; grid-row: auto !important; }
      }
    `}</style>
  </section>
);

// ─── Experience / Timeline ────────────────────────────────────────────────────
const Experience = () => (
  <section id="experience" style={{ padding: "8rem 2.5rem", maxWidth: 1100, margin: "0 auto" }}>
    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#ABD1C6", marginBottom: "1.2rem" }}>003 — Experience</p>
    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: "#F0EDE5", fontWeight: 900, marginBottom: "4rem", lineHeight: 1.1 }}>
      The journey so far
    </h2>

    <div style={{ position: "relative" }}>
      {/* Vertical line */}
      <div style={{ position: "absolute", left: 5, top: 0, bottom: 0, width: 1, background: "rgba(240,237,229,0.1)" }} />

      {TIMELINE.map((t, i) => (
        <TimelineItem key={i} item={t} idx={i} />
      ))}
    </div>
  </section>
);

const TimelineItem = ({ item, idx }) => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.2 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        paddingLeft: "3rem", paddingBottom: "3.5rem", position: "relative",
        transform: vis ? "translateX(0)" : "translateX(-20px)", opacity: vis ? 1 : 0,
        transition: `all 0.6s cubic-bezier(.22,1,.36,1) ${idx * 0.1}s`,
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 4, width: 11, height: 11, borderRadius: "50%", background: "#ABD1C6", border: "2px solid #004643" }} />
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#ABD1C6", display: "block", marginBottom: "0.5rem" }}>{item.period}</span>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.35rem", color: "#F0EDE5", fontWeight: 700, marginBottom: "0.2rem" }}>{item.role}</h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "#ABD1C6", marginBottom: "0.8rem", opacity: 0.8 }}>{item.org}</p>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#F0EDE5", opacity: 0.55, lineHeight: 1.7, maxWidth: 520 }}>{item.detail}</p>
    </div>
  );
};

// ─── Certifications ───────────────────────────────────────────────────────────
const Certifications = () => (
  <section id="certifications" style={{ padding: "8rem 2.5rem", maxWidth: 1100, margin: "0 auto" }}>
    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#ABD1C6", marginBottom: "1.2rem" }}>004 — Credentials</p>
    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: "#F0EDE5", fontWeight: 900, marginBottom: "3.5rem", lineHeight: 1.1 }}>
      Certifications
    </h2>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
      {CERTIFICATIONS.map((c, i) => (
        <CertCard key={i} c={c} idx={i} />
      ))}
    </div>
  </section>
);

const CertCard = ({ c, idx }) => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  const [hov, setHov] = useState(false);
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "1.5rem 1.6rem",
        background: hov ? "rgba(171,209,198,0.07)" : "rgba(240,237,229,0.03)",
        border: `1px solid ${hov ? "rgba(171,209,198,0.3)" : "rgba(240,237,229,0.07)"}`,
        borderRadius: 6,
        transform: vis ? "translateY(0)" : "translateY(16px)", opacity: vis ? 1 : 0,
        transition: `transform 0.5s ease ${idx * 0.04}s, opacity 0.5s ease ${idx * 0.04}s, background 0.2s, border 0.2s`,
      }}
    >
      <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", fontWeight: 600, color: "#F0EDE5", marginBottom: "0.4rem", lineHeight: 1.4 }}>{c.name}</h4>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#ABD1C6", opacity: 0.8 }}>{c.issuer} · {c.year}</p>
    </div>
  );
};

// ─── Contact ──────────────────────────────────────────────────────────────────
const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = "Valid email required";
    if (form.message.trim().length < 10) e.message = "At least 10 characters";
    return e;
  };

  const submit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setStatus("sent");
    setForm({ name: "", email: "", message: "" });
  };

  const inputStyle = (field) => ({
    width: "100%", background: "rgba(240,237,229,0.04)", border: `1px solid ${errors[field] ? "#F07167" : "rgba(240,237,229,0.15)"}`,
    borderRadius: 4, padding: "0.9rem 1rem", color: "#F0EDE5", fontSize: "0.95rem",
    fontFamily: "'DM Sans', sans-serif", outline: "none", transition: "border 0.2s",
    boxSizing: "border-box",
  });

  return (
    <section id="contact" style={{ padding: "8rem 2.5rem 10rem", maxWidth: 1100, margin: "0 auto" }}>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#ABD1C6", marginBottom: "1.2rem" }}>005 — Contact</p>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: "#F0EDE5", fontWeight: 900, marginBottom: "1rem", lineHeight: 1.1 }}>
        Let's talk
      </h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "#F0EDE5", opacity: 0.5, maxWidth: 460, lineHeight: 1.7, marginBottom: "3.5rem" }}>
        Open to internship opportunities, collaborations, or just a conversation about security. Drop me a line.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }} className="contact-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {["name", "email"].map((field) => (
            <div key={field}>
              <input
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                style={inputStyle(field)}
                onFocus={(e) => (e.target.style.borderColor = "#ABD1C6")}
                onBlur={(e) => (e.target.style.borderColor = errors[field] ? "#F07167" : "rgba(240,237,229,0.15)")}
              />
              {errors[field] && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#F07167", marginTop: "0.3rem" }}>{errors[field]}</p>}
            </div>
          ))}
          <div>
            <textarea
              placeholder="Your message"
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              style={{ ...inputStyle("message"), resize: "vertical" }}
              onFocus={(e) => (e.target.style.borderColor = "#ABD1C6")}
              onBlur={(e) => (e.target.style.borderColor = errors.message ? "#F07167" : "rgba(240,237,229,0.15)")}
            />
            {errors.message && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", color: "#F07167", marginTop: "0.3rem" }}>{errors.message}</p>}
          </div>

          {status === "sent"
            ? <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#ABD1C6", padding: "0.9rem 0" }}>✓ Message received. I'll be in touch.</p>
            : (
              <button
                data-mag
                onClick={submit}
                style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", letterSpacing: "0.1em",
                  textTransform: "uppercase", color: "#004643", background: "#ABD1C6",
                  border: "none", padding: "0.9rem 2rem", borderRadius: 2, cursor: "none",
                  alignSelf: "flex-start", transition: "transform 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => { e.target.style.background = "#F0EDE5"; e.target.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.target.style.background = "#ABD1C6"; e.target.style.transform = "translateY(0)"; }}
              >
                Send Message
              </button>
            )
          }
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
          {[
            { label: "Email", value: "miidhunraj@gmail.com", href: "mailto:miidhunraj@gmail.com" },
            { label: "Phone", value: "+91 7994079690", href: "tel:+917994079690" },
            { label: "LinkedIn", value: "linkedin.com/in/midhunraj06", href: "https://linkedin.com/in/midhunraj06" },
          ].map((c) => (
            <div key={c.label}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#ABD1C6", marginBottom: "0.3rem" }}>{c.label}</p>
              <a href={c.href} target="_blank" rel="noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", color: "#F0EDE5", opacity: 0.75, textDecoration: "none", transition: "opacity 0.2s" }}
                onMouseEnter={(e) => (e.target.style.opacity = 1)}
                onMouseLeave={(e) => (e.target.style.opacity = 0.75)}>
                {c.value}
              </a>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
      `}</style>
    </section>
  );
};

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{ borderTop: "1px solid rgba(240,237,229,0.08)", padding: "2rem 2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "#F0EDE5", opacity: 0.3 }}>© 2026 Midhun Raj M</span>
    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "#F0EDE5", opacity: 0.3 }}>BCA · Srinivas University · Mangaluru</span>
  </footer>
);

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
          background: #004643;
          color: #F0EDE5;
          cursor: none;
          overflow-x: hidden;
        }
        ::selection { background: #ABD1C6; color: #004643; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #004643; }
        ::-webkit-scrollbar-thumb { background: #ABD1C6; border-radius: 4px; }
        input::placeholder, textarea::placeholder { color: rgba(240,237,229,0.3); }
      `}</style>

      <NoiseBg />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
