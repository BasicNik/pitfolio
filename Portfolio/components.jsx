// =============================================
// SHARED COMPONENTS — navbar, ambient layer, hooks
// =============================================
const { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback } = React;

// ---------- ROUTER ----------
function useHashRoute() {
  const [route, setRoute] = useState(() => (window.location.hash || "#/").slice(2) || "");
  useEffect(() => {
    const onHash = () => setRoute((window.location.hash || "#/").slice(2) || "");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const navigate = useCallback((to) => {
    window.location.hash = "#/" + to;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  return [route, navigate];
}

// ---------- WANDERING COLOR BLOBS (background) ----------
function AmbientBlobs() {
  return (
    <div className="ambient-blobs" aria-hidden="true">
      <div className="ab b1" />
      <div className="ab b2" />
      <div className="ab b3" />
      <div className="ab b4" />
    </div>
  );
}

// ---------- CURSOR SPOTLIGHT ----------
function CursorBlob({ enabled = true }) {
  const blob = useRef(null);
  const dot = useRef(null);
  const target = useRef({ x: -500, y: -500 });
  const cur = useRef({ x: -500, y: -500 });
  const dotCur = useRef({ x: -500, y: -500 });
  const raf = useRef(null);
  const [hot, setHot] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    const onOver = (e) => {
      const t = e.target;
      const isHot = !!(t && (t.closest("a, button, .work-card, .channel, .nav-item, .nav-cta, .module, .glass-card, .ctx-item")));
      setHot(isHot);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    const tick = () => {
      cur.current.x += (target.current.x - cur.current.x) * 0.08;
      cur.current.y += (target.current.y - cur.current.y) * 0.08;
      dotCur.current.x += (target.current.x - dotCur.current.x) * 0.35;
      dotCur.current.y += (target.current.y - dotCur.current.y) * 0.35;
      if (blob.current) blob.current.style.transform = `translate(${cur.current.x}px, ${cur.current.y}px)`;
      if (dot.current) dot.current.style.transform = `translate(${dotCur.current.x}px, ${dotCur.current.y}px)`;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf.current);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <React.Fragment>
      <div ref={blob} className="cursor-blob" />
      <div ref={dot} className={"cursor-dot" + (hot ? " hot" : "")} />
    </React.Fragment>
  );
}

function Grain({ enabled = true }) {
  if (!enabled) return null;
  return <div className="grain" aria-hidden="true" />;
}

// ---------- STATUS BAR ----------
function StatusBar({ resume }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const fmt = (d) => {
    const hh = String(d.getHours()).padStart(2,"0");
    const mm = String(d.getMinutes()).padStart(2,"0");
    const ss = String(d.getSeconds()).padStart(2,"0");
    return `${hh}:${mm}:${ss}`;
  };
  const tz = useMemo(() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone.split("/").pop().replace("_"," "); }
    catch (e) { return "Local"; }
  }, []);
  const handle = (resume?.name || "NR").toUpperCase().replace(/\s+/g, ".");
  return (
    <div className="statusbar">
      <span><b>{handle}</b> / portfolio_v07</span>
      <span className="sb-hide-mobile">{tz} · <b>{fmt(now)}</b></span>
      <span className="sb-spacer" />
      <span className="sb-blink">● LIVE</span>
      <span className="sb-hide-mobile">STATUS: <b style={{color:"#5fff8e"}}>OPEN TO WORK</b></span>
      <span className="sb-hide-mobile">RIGHT-CLICK FOR MENU</span>
    </div>
  );
}

// ---------- NAVBAR (with mega-menu on Work hover) ----------
const NAV = [
  { id: "",        label: "Home" },
  { id: "work",    label: "Work",  hasMenu: true },
  { id: "blog",    label: "Blog" },
  { id: "about",   label: "About" },
  { id: "contact", label: "Contact" },
];
function Navbar({ route, navigate, resume }) {
  const wrap = useRef(null);
  const refs = useRef({});
  const [pill, setPill] = useState({ x: 0, w: 0, ready: false });
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef(null);

  // Close mobile sheet on route change or Escape
  useEffect(() => { setMobileOpen(false); }, [route]);
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const positionPill = useCallback((id) => {
    const el = refs.current[id];
    const parent = wrap.current;
    if (!el || !parent) return;
    const er = el.getBoundingClientRect();
    const pr = parent.getBoundingClientRect();
    setPill({ x: er.left - pr.left, w: er.width, ready: true });
  }, []);

  useLayoutEffect(() => {
    positionPill(route);
    const onResize = () => positionPill(route);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [route, positionPill]);

  const openMenu = () => { clearTimeout(closeTimer.current); setMenuOpen(true); };
  const closeMenuSoon = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenuOpen(false), 180);
  };

  const companies = (resume?.experience || []);

  return (
    <React.Fragment>
      <div className="nav-wrap">
        <nav className="nav glass" aria-label="Primary">
          <button className="nav-brand" onClick={() => navigate("")}>
            <img src="assets/Nr_Logo_png.png" alt="NR logo" className="nav-logo" />
          </button>
          <div className="nav-items" ref={wrap}>
            <span
              className="nav-pill"
              style={{
                transform: `translateX(${pill.x}px)`,
                width: pill.w,
                opacity: pill.ready ? 1 : 0,
              }}
              aria-hidden="true"
            />
            {NAV.map((n) => (
              <button
                key={n.id || "idx"}
                ref={(el) => (refs.current[n.id] = el)}
                className={"nav-item" + (route === n.id ? " active" : "")}
                onClick={() => navigate(n.id)}
                onMouseEnter={() => { positionPill(n.id); if (n.hasMenu) openMenu(); else closeMenuSoon(); }}
                onMouseLeave={() => { positionPill(route); if (n.hasMenu) closeMenuSoon(); }}
              >
                {n.label}
                {n.hasMenu && <span className="nav-caret">▾</span>}
              </button>
            ))}
          </div>
          <button className="nav-cta" onClick={() => navigate("contact")}>
            Book a call
          </button>
          {/* Hamburger — visible only on mobile */}
          <button
            className={"nav-hamburger" + (mobileOpen ? " open" : "")}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span /><span /><span />
          </button>
        </nav>

        {/* Mega-menu — companies only */}
        <div
          className={"nav-mega glass" + (menuOpen ? " open" : "")}
          onMouseEnter={openMenu}
          onMouseLeave={closeMenuSoon}
        >
          <div className="nav-mega-head">
            <span className="ru">EXPERIENCE · COMPANIES</span>
            <button className="nav-mega-all" onClick={() => { setMenuOpen(false); navigate("work"); }}>
              View all work →
            </button>
          </div>
          <div className="nav-mega-grid">
            {companies.map((e, i) => (
              <button
                key={i}
                className="nav-mega-item"
                onClick={() => { setMenuOpen(false); navigate("company/" + i); }}
              >
                <div className="nmi-num">0{i+1}</div>
                <div className="nmi-body">
                  <div className="nmi-company">{e.company}</div>
                  <div className="nmi-role">{e.role}{e.client ? " · " + e.client : ""}</div>
                  <div className="nmi-duration">{e.duration}</div>
                </div>
                <div className="nmi-arrow">↗</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile full-screen nav sheet */}
      <div className={"nav-mobile-sheet" + (mobileOpen ? " open" : "")} aria-hidden={!mobileOpen}>
        {NAV.map((n) => (
          <button
            key={n.id || "home"}
            className={"nav-mobile-item" + (route === n.id ? " active" : "")}
            onClick={() => { navigate(n.id); setMobileOpen(false); }}
          >
            {n.label}
            <span className="mob-arrow">↗</span>
          </button>
        ))}
        <button
          className="nav-mobile-cta"
          onClick={() => { navigate("contact"); setMobileOpen(false); }}
        >
          Book a call
          <span style={{
            width: 22, height: 22, borderRadius: "50%",
            background: "var(--bg)", color: "var(--ink)",
            display: "grid", placeItems: "center", fontSize: 14
          }}>↗</span>
        </button>
      </div>
    </React.Fragment>
  );
}

// ---------- GRID LINES ----------
function GridLines() {
  return (
    <div className="grid-lines" aria-hidden="true">
      {Array.from({length: 13}).map((_, i) => <i key={i} />)}
    </div>
  );
}

// ---------- MARQUEE ----------
function Marquee({ items, reverse = false }) {
  const all = items.concat(items);
  return (
    <div className={"marquee" + (reverse ? " reverse" : "")}>
      <div className="marquee-track">
        {all.map((it, i) => (
          <span key={i} className="marquee-item">
            {it.kind === "grad" ? <em className="grad">{it.text}</em>
             : it.kind === "out" ? <span className="out">{it.text}</span>
             : <span>{it.text}</span>}
            <span className="marquee-dot" style={{ background: it.dot || "var(--ember)" }} />
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------- PAGE ENTRY ----------
function usePageEntry(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("entering");
    const id = setTimeout(() => el.classList.remove("entering"), 700);
    return () => clearTimeout(id);
  }, []);
}
function useReveal() { useEffect(() => {}, []); }

// ---------- ANIMATED TEXT (variable-font wave on hover) ----------
function FlexText({ children, className = "" }) {
  const text = String(children);
  return (
    <span className={"flex-text " + className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="flex-letter"
          style={{ "--i": i }}
          aria-hidden="true"
        >{ch === " " ? "\u00A0" : ch}</span>
      ))}
    </span>
  );
}

// ---------- SCRAMBLE TEXT ----------
function ScrambleText({ children, duration = 800, className = "" }) {
  const ref = useRef(null);
  const final = String(children);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const chars = "!<>-_\\/[]{}—=+*^?#________";
    let frame = 0;
    const total = Math.ceil(duration / 40);
    const queue = final.split("").map((c, i) => ({
      from: chars[Math.floor(Math.random() * chars.length)],
      to: c, start: Math.floor(Math.random() * total / 2),
      end: Math.floor(total / 2 + Math.random() * total / 2),
    }));
    const id = setInterval(() => {
      let out = "";
      let done = 0;
      queue.forEach((q) => {
        if (frame >= q.end) { out += q.to; done++; }
        else if (frame >= q.start) {
          out += chars[Math.floor(Math.random() * chars.length)];
        } else out += q.from;
      });
      el.textContent = out;
      if (done === queue.length) clearInterval(id);
      frame++;
    }, 40);
    return () => clearInterval(id);
  }, [final, duration]);
  return <span ref={ref} className={className}>{final}</span>;
}

// ---------- WORK PREVIEW (gradient swatch) ----------
function PreviewSwatch({ a, b, c, label }) {
  const grad = `linear-gradient(135deg, ${a} 0%, ${b} 50%, ${c} 100%)`;
  return (
    <div className="preview-fill" style={{ background: grad }}>
      <span>{label}</span>
    </div>
  );
}

// ---------- WORK CARD (liquid glass) ----------
function WorkCard({ idx, title, tags, year, role, onOpen }) {
  const cardRef = useRef(null);
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
      card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
    };
    card.addEventListener("mousemove", onMove);
    return () => card.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <div className="work-card glass-card" ref={cardRef} onClick={onOpen}
         onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen?.()}
         role="link" tabIndex={0}>
      <div className="wc-num">{String(idx).padStart(2,"0")}</div>
      <h3 className="wc-title">{title}</h3>
      <div className="wc-tags">
        {tags.map((t) => <span key={t} className="tag">{t}</span>)}
      </div>
      <div className="wc-meta">{role}<br/>{year}</div>
      <div className="wc-arrow">↗</div>
    </div>
  );
}

// ---------- CONTEXT MENU (right-click override) ----------
function ContextMenu({ navigate, resume }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [toast, setToast] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const onCtx = (e) => {
      // allow native menu inside form fields
      if (e.target.closest("input, textarea, [contenteditable]")) return;
      e.preventDefault();
      const x = Math.min(e.clientX, window.innerWidth - 280);
      const y = Math.min(e.clientY, window.innerHeight - 360);
      setPos({ x, y });
      setOpen(true);
    };
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("contextmenu", onCtx);
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("contextmenu", onCtx);
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const copy = async (val, label) => {
    try {
      await navigator.clipboard.writeText(val);
      flash("Copied " + label);
    } catch (e) { flash("Copy blocked"); }
    setOpen(false);
  };

  const go = (to) => { setOpen(false); navigate(to); };

  const links = resume?.contact?.links || {};
  const email = resume?.contact?.email;

  return (
    <React.Fragment>
      {open && (
        <div ref={ref} className="ctx-menu glass"
             style={{ left: pos.x, top: pos.y }}
             role="menu">
          <div className="ctx-head">
            <span className="ru">QUICK MENU · {(resume?.name || "").split(" ")[0]?.toUpperCase()}</span>
          </div>
          <div className="ctx-section">
            <div className="ctx-label">Navigate</div>
            <button className="ctx-item" onClick={() => go("")}>
              <span>Home</span><kbd>G H</kbd>
            </button>
            <button className="ctx-item" onClick={() => go("work")}>
              <span>Work</span><kbd>G W</kbd>
            </button>
            <button className="ctx-item" onClick={() => go("blog")}>
              <span>Blog</span><kbd>G B</kbd>
            </button>
            <button className="ctx-item" onClick={() => go("about")}>
              <span>About</span><kbd>G A</kbd>
            </button>
            <button className="ctx-item" onClick={() => go("contact")}>
              <span>Contact</span><kbd>G C</kbd>
            </button>
          </div>
          <div className="ctx-divider" />
          <div className="ctx-section">
            <div className="ctx-label">Quick actions</div>
            {email && (
              <button className="ctx-item" onClick={() => copy(email, "email")}>
                <span>Copy email</span><kbd>⌘ E</kbd>
              </button>
            )}
            <button className="ctx-item" onClick={() => { copy(window.location.href, "link"); }}>
              <span>Copy current link</span><kbd>⌘ L</kbd>
            </button>
            {links.github && (
              <a className="ctx-item" href={links.github} target="_blank" rel="noopener" onClick={() => setOpen(false)}>
                <span>Open GitHub</span><kbd>↗</kbd>
              </a>
            )}
            {links.linkedin && (
              <a className="ctx-item" href={links.linkedin} target="_blank" rel="noopener" onClick={() => setOpen(false)}>
                <span>Open LinkedIn</span><kbd>↗</kbd>
              </a>
            )}
            <button className="ctx-item" onClick={() => { window.print(); setOpen(false); }}>
              <span>Print page</span><kbd>⌘ P</kbd>
            </button>
          </div>
          <div className="ctx-divider" />
          <div className="ctx-foot ru">v07 · 2026 · ESC TO CLOSE</div>
        </div>
      )}
      {toast && <div className="ctx-toast glass">{toast}</div>}
    </React.Fragment>
  );
}

// ---------- KEYBOARD SHORTCUTS ----------
function useShortcuts(navigate) {
  useEffect(() => {
    let pending = null;
    let timer = null;
    const onKey = (e) => {
      const tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (pending === "g") {
        const map = { h: "", w: "work", b: "blog", a: "about", c: "contact" };
        if (k in map) { e.preventDefault(); navigate(map[k]); }
        pending = null; clearTimeout(timer);
        return;
      }
      if (k === "g") {
        pending = "g";
        clearTimeout(timer);
        timer = setTimeout(() => { pending = null; }, 900);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);
}

// ---------- FIXED PAGE SIDEBAR ----------
const PAGE_TICKERS = {
  "":        ["HOME", "BACKEND DEV", "NIKHIL R", "JAVA · SPRING", "REST APIS", "SHIP IT", "—", "v07 · 2026"],
  "work":    ["WORK", "PROJECTS", "EXPERIENCE", "BUILT IN PROD", "SOLO BUILDS", "—", "TCS · 2024", "BASKETHUNT"],
  "blog":    ["BLOG", "FIELD NOTES", "BACKEND", "REACT", "PERFORMANCE", "—", "WEEKLY", "5 POSTS"],
  "about":   ["ABOUT", "NIKHIL R", "BACKEND DEV", "IST · INDIA", "JAVA FIRST", "—", "SHIPS WEEKLY", "3+ YRS"],
  "contact": ["CONTACT", "OPEN TO WORK", "≤ 24H REPLY", "NO BOILERPLATE", "—", "EMAIL ME", "LET'S BUILD"],
};

function PageSidebar({ route }) {
  const base =
    route.startsWith("blog")    ? "blog"   :
    route.startsWith("company") || route.startsWith("project") ? "work" : route;
  const items = PAGE_TICKERS[base] || PAGE_TICKERS[""];
  const doubled = [...items, ...items, ...items];
  const label = (PAGE_TICKERS[base] || PAGE_TICKERS[""])[0];

  return (
    <div className="page-sidebar-fixed" aria-hidden="true">
      <div className="psf-line">
        <div className="psf-dot" />
      </div>
      <div className="psf-ticker">
        <div className="psf-ticker-track">
          {doubled.map((t, i) => (
            <span key={i} className={"psf-tick" + (t === "—" ? " dim" : "")}>{t}</span>
          ))}
        </div>
      </div>
      <div className="psf-label">{label}</div>
    </div>
  );
}

// ---------- exports ----------
Object.assign(window, {
  useHashRoute,
  AmbientBlobs, CursorBlob, Grain, StatusBar, Navbar, GridLines,
  Marquee, useReveal, usePageEntry, PreviewSwatch, WorkCard,
  FlexText, ScrambleText, ContextMenu, useShortcuts, PageSidebar,
});