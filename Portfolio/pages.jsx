// =============================================
// PAGES — Home, Work, Company, Project, About, Contact, Blog
// =============================================

const SWATCHES = [
  ["#FF5E1A", "#FF2E93", "#7B2CFF"],
  ["#7B2CFF", "#FF2E93", "#FF5E1A"],
  ["#0A0908", "#FF5E1A", "#D7FF3A"],
  ["#1A4FFF", "#7B2CFF", "#FF2E93"],
  ["#D7FF3A", "#FF5E1A", "#FF2E93"],
  ["#FF2E93", "#7B2CFF", "#1A4FFF"],
];

function inferTags(text = "") {
  const known = ["React","Next.js","Firebase","Firestore","Node.js","TypeScript",
    "Java","Spring Boot","REST","ChatGPT","AI","Auth","SQL","MongoDB",
    "Docker","Jenkins","AWS","Oracle","Multithreading","Hibernate"];
  const t = text.toLowerCase();
  return known.filter((k) => t.includes(k.toLowerCase())).slice(0, 4).map((k) => k.toUpperCase());
}
function shortDate(d = "") { return d.replace(/\u2013|\-/g, "→").replace("Present", "ongoing"); }
function slug(s = "") { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

function projectsFromResume(resume) {
  return (resume.projects || []).map((p, i) => ({
    idx: i + 1,
    slug: slug(p.name),
    title: p.name,
    sub: p.description,
    link: p.link,
    tags: inferTags(p.name + " " + p.description),
    year: shortDate(p.duration || ""),
    role: "Solo build",
    swatch: SWATCHES[i % SWATCHES.length],
  }));
}

// ---------- HOME ----------
function HomePage({ navigate, resume }) {
  useReveal();
  const ref = React.useRef(null);
  usePageEntry(ref);
  const projects = projectsFromResume(resume);
  const exp = resume.experience || [];
  const yearsExp = (() => {
    const first = exp[exp.length - 1];
    const m = (first?.duration || "").match(/(20\d{2})/);
    if (!m) return "2";
    return String(Math.max(1, new Date().getFullYear() - parseInt(m[1], 10)));
  })();
  const apisShipped = (() => {
    const text = exp.flatMap((e) => e.highlights || []).join(" ");
    const m = text.match(/(\d+)\+?\s*REST APIs/i);
    return m ? m[1] + "+" : "15+";
  })();
  const firstName = (resume.name || "").split(" ")[0] || "Nikhil";

  return (
    <div className="page-fade" ref={ref}>
      <section className="hero">
        <div className="hero-eyebrow">
          <span>NR / 001 — INDEX</span>
          <span style={{marginLeft: "auto"}}>SCROLL ↓</span>
        </div>
        <h1 className="hero-title hero-anim">
          I don't <em className="grad">follow</em><br/>
          best <span className="out">practices.</span><br/>
          I set them.
        </h1>

        <div className="sticker grad spin" style={{top: 200, right: 40, transform: "rotate(-8deg)"}}>
          ↳ portfolio<br/>v07 · 2026
        </div>


        <div className="hero-meta">
          <p className="hero-bio">
            <b>{resume.name}</b> — {resume.title?.toLowerCase()}{resume.summary ? " — " + resume.summary.split(".")[0] + "." : ""}
          </p>
          <div className="hero-stats">
            <div className="hero-stat glass-card sm">
              <div className="n">{yearsExp}<span style={{color:"var(--ember)"}}>+</span></div>
              <div className="l">Years shipping</div>
            </div>
            <div className="hero-stat glass-card sm">
              <div className="n">{apisShipped}</div>
              <div className="l">REST APIs in prod</div>
            </div>
            <div className="hero-stat glass-card sm">
              <div className="n">{projects.length}</div>
              <div className="l">Side projects · live</div>
            </div>
          </div>
        </div>
      </section>

      <Marquee items={[
        { text: "AVAILABLE FOR WORK" },
        { text: "BUILDING IN PUBLIC", kind: "out" },
        { text: firstName.toLowerCase() + " · backend", kind: "grad" },
        { text: "JAVA · SPRING · REACT" },
        { text: "rest apis · sql · cloud", kind: "grad" },
        { text: "SHIPS WEEKLY", kind: "out" },
      ]}/>

      <section className="section">
        <header className="section-head">
          <div className="section-num">SECTION <b>02</b> / WORK</div>
          <h2 className="section-title">
            Things I've <em>shipped</em> that didn't<br/>fall over in production.
          </h2>
        </header>
        <div className="ru" style={{marginBottom: 16}}>PROJECTS · SOLO BUILDS</div>
        <div className="work-list">
          {projects.map((p) => (
            <WorkCard key={p.title} idx={p.idx} title={p.title}
              tags={p.tags.length ? p.tags : ["WEB", "FULLSTACK"]}
              year={p.year} role={p.role} swatch={p.swatch}
              onOpen={() => navigate("project/" + p.slug)} />
          ))}
        </div>
        <div className="ru" style={{marginTop: 48, marginBottom: 16}}>INDUSTRY EXPERIENCE</div>
        <div className="work-list">
          {exp.map((e, i) => (
            <WorkCard key={"exp-" + i} idx={i + 1}
              title={e.role + " · " + e.company}
              tags={inferTags(e.highlights?.join(" ") || "").length
                ? inferTags(e.highlights?.join(" ") || "") : ["BACKEND", "JAVA"]}
              year={shortDate(e.duration || "")}
              role={e.client || e.company}
              swatch={SWATCHES[(projects.length + i) % SWATCHES.length]}
              onOpen={() => navigate("company/" + i)} />
          ))}
        </div>
      </section>

      <section className="section">
        <header className="section-head">
          <div className="section-num">SECTION <b>03</b> / PROCESS</div>
          <h2 className="section-title">What the <em>commit log</em><br/>won't tell you.</h2>
        </header>
        <div className="process">
          {[
            ["01 · INTAKE", "Get it down on paper, fast.", "A 30-min call, an end-of-day napkin doc, and a brutally honest assumption list. I'd rather kill the idea on day one than month four."],
            ["02 · PROTOTYPE", "Make it run before you make it pretty.", "Ship a janky prototype in week one. Real data, real edge cases, real friction — not a Figma frame."],
            ["03 · PRESSURE-TEST", "Run it at the people you're scared of.", "Demo to the harshest critic in your network. If they shrug, the idea isn't sharp enough yet."],
            ["04 · SHIP & SHARPEN", "Cut scope, ship hot, fix in flight.", "Ship at 80% and treat the next two weeks as the real design phase."],
          ].map(([n, t, b]) => (
            <div key={n} className="process-item glass-card sm">
              <div className="pi-num">{n}</div>
              <h4 className="pi-title">{t}</h4>
              <p className="pi-body">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <header className="section-head">
          <div className="section-num">SECTION <b>04</b> / NOW</div>
          <h2 className="section-title">What I'm <em>currently</em><br/>obsessed with.</h2>
        </header>
        <div className="now">
          <div className="now-card glow span-6">
            <div className="nc-label">▍ Building</div>
            <div className="nc-value" style={{fontSize: 32}}>
              {projects[0]?.title || "—"} — {projects[0]?.sub || ""}
            </div>
            <div className="nc-sub">{projects[0]?.year || ""}</div>
          </div>
          <div className="now-card glass-card span-3">
            <div className="nc-label">▍ Day job</div>
            <div className="nc-value">{exp[0]?.role}</div>
            <div className="nc-sub">{exp[0]?.company} · {exp[0]?.client || shortDate(exp[0]?.duration || "")}</div>
          </div>
          <div className="now-card glass-card span-3">
            <div className="nc-label">▍ Listening</div>
            <div className="nc-value">
              <span className="equalizer" style={{color: "var(--ember)"}}>
                <i style={{height:14}}/><i style={{height:8}}/><i style={{height:18}}/><i style={{height:6}}/>
              </span>
              Compiler hum · CI logs
            </div>
            <div className="nc-sub">Live · always</div>
          </div>
          <div className="now-card glass-card span-4">
            <div className="nc-label">▍ Stack du jour</div>
            <div className="nc-value">{(resume.skills?.primary || []).slice(0, 4).join(" · ")}</div>
            <div className="nc-sub">+ {(resume.skills?.working || []).slice(0, 3).join(", ")}</div>
          </div>
          <div className="now-card glass-card span-4">
            <div className="nc-label">▍ Last shipped</div>
            <div className="nc-value">{exp[0]?.highlights?.[0] || "—"}</div>
            <div className="nc-sub">{exp[0]?.company}</div>
          </div>
          <div className="now-card glass-card span-4">
            <div className="nc-label">▍ Reachable</div>
            <div className="nc-value">{resume.contact?.email}</div>
            <div className="nc-sub">{resume.contact?.phone}</div>
          </div>
        </div>
      </section>

      <section className="contact-cta">
        <div className="ru" style={{marginBottom: 24}}>SECTION 05 / FINISH</div>
        <h2 className="big">
          Got <em>something</em><br/><span className="out">worth building?</span>
        </h2>
        <div className="contact-cta-sub">REPLIES IN ≤ 24H · NO BOILERPLATE INTROS</div>
        <button className="contact-btn" onClick={() => navigate("contact")}>
          Start a project <span className="arrow">↗</span>
        </button>
      </section>

      <FooterBar resume={resume} />
    </div>
  );
}

// ---------- WORK ----------
function WorkPage({ navigate, resume }) {
  useReveal();
  const ref = React.useRef(null);
  usePageEntry(ref);
  const projects = projectsFromResume(resume);
  const exp = resume.experience || [];

  return (
    <div className="page-fade" ref={ref}>
      <section className="work-hero">
        <div className="ru" style={{marginBottom: 24}}>002 / WORK INDEX · {projects.length} PROJECTS · {exp.length} ROLES</div>
        <h1 className="wh-title">Selected <em>work,</em><br/>1:1 scale.</h1>
      </section>

      <section className="work-modules">
        <div className="module glass-card span-12">
          <div className="mod-tag">COMPANIES · WHERE I'VE BUILT</div>
          <h3 className="mod-title" style={{marginBottom: 18}}>Roles &amp; clients.</h3>
          <div className="company-grid">
            {exp.map((e, i) => (
              <button key={i} className="company-row glass-card sm"
                      onClick={() => navigate("company/" + i)}>
                <div>
                  <div className="ru" style={{color:"var(--ember)"}}>0{i+1} · {shortDate(e.duration || "")}</div>
                  <div style={{fontSize: 22, fontWeight: 500, marginTop: 6}}>{e.company}</div>
                  <div style={{fontFamily:"var(--mono)", fontSize: 12, color:"var(--ink-2)", marginTop: 4}}>
                    {e.role}{e.client ? " · " + e.client : ""}
                  </div>
                </div>
                <span className="ch-arrow" style={{fontSize: 22, color:"var(--ink-2)"}}>↗</span>
              </button>
            ))}
          </div>
        </div>

        {projects.map((p, i) => (
          <div key={p.title}
               className={"module glass-card " + (i === 0 ? "span-8 tall" : "span-6")}
               onClick={() => navigate("project/" + p.slug)}
               style={{cursor:"none"}}>
            <div className="mod-tag">PROJECT · 0{p.idx} · {p.year}</div>
            <h3 className="mod-title" style={i === 0 ? {fontSize: 56} : {}}>{p.title}</h3>
            <p className="mod-body">{p.sub}</p>
            {p.link && (
              <span style={{marginTop: 8, fontFamily:"var(--mono)", fontSize: 11,
                       letterSpacing:"0.1em", color:"var(--ink-2)"}}>
                {p.link.replace(/^https?:\/\//, "")} ↗
              </span>
            )}
            <div className="mod-art" style={{
              background: `linear-gradient(135deg, ${p.swatch[0]} 0%, ${p.swatch[1]} 50%, ${p.swatch[2]} 100%)`
            }}/>
          </div>
        ))}

        {(resume.achievements || []).length > 0 && (
          <div className="module glass-card span-12">
            <div className="mod-tag">RECOGNITION</div>
            <h3 className="mod-title" style={{marginBottom: 18}}>Things on the wall.</h3>
            <ul className="achievement-grid">
              {resume.achievements.map((a, i) => (
                <li key={i} style={{
                  borderTop: "2px solid var(--ember)", paddingTop: 12,
                  fontSize: 14, color: "var(--ink)", lineHeight: 1.45
                }}>
                  <div className="ru" style={{marginBottom: 6}}>0{i+1}</div>{a}
                </li>
              ))}
            </ul>
            <div className="mod-art" style={{height: 0, minHeight: 0}}/>
          </div>
        )}
      </section>

      <Marquee reverse items={[
        { text: "MORE COMING SOON" },
        { text: "in the lab", kind: "grad" },
        { text: "BUILT IN PUBLIC", kind: "out" },
        { text: (resume.contact?.links?.portfolio || "").replace(/^https?:\/\//, ""), kind: "grad" },
      ]}/>
      <FooterBar resume={resume} right={<a href="#/contact">→ START A PROJECT</a>} />
    </div>
  );
}

// ---------- COMPANY DETAIL ----------
function CompanyPage({ navigate, resume, idx }) {
  useReveal();
  const ref = React.useRef(null);
  usePageEntry(ref);
  const e = (resume.experience || [])[idx];
  if (!e) return (
    <div className="page-fade" ref={ref}>
      <section className="work-hero"><h1 className="wh-title">Not <em>found.</em></h1></section>
      <FooterBar resume={resume} right={<a href="#/work">→ BACK TO WORK</a>} />
    </div>
  );
  return (
    <div className="page-fade" ref={ref}>
      <section className="work-hero">
        <div className="ru" style={{marginBottom: 16}}>
          <a href="#/work" style={{color:"var(--ink-2)"}}>← WORK</a> · COMPANY · 0{idx+1}
        </div>
        <h1 className="wh-title">{e.company}<br/><em>{e.role}.</em></h1>
        <div style={{marginTop: 24, fontFamily:"var(--mono)", fontSize: 13, color:"var(--ink-2)"}}>
          {e.client ? <span>CLIENT: <b style={{color:"var(--ink)"}}>{e.client}</b> · </span> : null}
          {shortDate(e.duration || "")}
        </div>
      </section>

      <section className="work-modules">
        <div className="module glass-card span-8 tall">
          <div className="mod-tag">HIGHLIGHTS</div>
          <h3 className="mod-title">What I shipped here.</h3>
          <ul style={{listStyle:"none", padding:0, margin:"24px 0 0",
                      display:"flex", flexDirection:"column", gap: 14}}>
            {(e.highlights || []).map((h, i) => (
              <li key={i} style={{
                fontSize: 18, color: "var(--ink)", lineHeight: 1.5,
                paddingLeft: 26, position: "relative",
                borderTop: "1px solid var(--rule)", paddingTop: 14
              }}>
                <span style={{
                  position:"absolute", left: 0, top: 22, width: 14, height: 2,
                  background: "var(--grad-sunset)"
                }} />
                {h}
              </li>
            ))}
          </ul>
        </div>
        <div className="module glass-card span-4 tall">
          <div className="mod-tag">META</div>
          <h3 className="mod-title" style={{fontSize: 24}}>At a glance.</h3>
          <ul style={{listStyle:"none", padding:0, margin:"20px 0 0",
                      display:"flex", flexDirection:"column", gap: 0}}>
            {[
              ["COMPANY", e.company],
              ["ROLE", e.role],
              ["CLIENT", e.client || "—"],
              ["DURATION", e.duration],
            ].map(([k, v]) => (
              <li key={k} style={{display:"flex", justifyContent:"space-between",
                                  padding:"14px 0", borderTop:"1px solid var(--rule)"}}>
                <span className="ru">{k}</span>
                <span style={{fontFamily:"var(--mono)", fontSize: 12, color:"var(--ink)", textAlign:"right", maxWidth:"60%"}}>{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FooterBar resume={resume} right={<a href="#/work">→ ALL WORK</a>} />
    </div>
  );
}

// ---------- PROJECT DETAIL ----------
function ProjectPage({ navigate, resume, slug: pslug }) {
  useReveal();
  const ref = React.useRef(null);
  usePageEntry(ref);
  const projects = projectsFromResume(resume);
  const p = projects.find((x) => x.slug === pslug);
  const i = projects.findIndex((x) => x.slug === pslug);
  const next = projects[(i + 1) % projects.length];
  if (!p) return (
    <div className="page-fade" ref={ref}>
      <section className="work-hero"><h1 className="wh-title">Project <em>not found.</em></h1></section>
      <FooterBar resume={resume} right={<a href="#/work">→ BACK TO WORK</a>} />
    </div>
  );
  return (
    <div className="page-fade" ref={ref}>
      <section className="work-hero">
        <div className="ru" style={{marginBottom: 16}}>
          <a href="#/work" style={{color:"var(--ink-2)"}}>← WORK</a> · PROJECT · 0{p.idx}
        </div>
        <h1 className="wh-title">{p.title}<br/><em>{p.year}.</em></h1>
        <p style={{marginTop: 24, fontSize: 18, color: "var(--ink-2)", maxWidth: "60ch"}}>
          {p.sub}
        </p>
        {p.link && (
          <a href={p.link} target="_blank" rel="noopener" className="contact-btn"
             style={{marginTop: 28}}>
            Visit live site <span className="arrow">↗</span>
          </a>
        )}
      </section>

      <section className="work-modules">
        <div className="module glass-card feature span-12 tall">
          <div className="mod-tag" style={{color:"rgba(10,9,8,.7)"}}>HERO ART · {p.tags.join(" · ")}</div>
          <div className="mod-art" style={{
            marginTop: 14, height: 360, minHeight: 360,
            background: `linear-gradient(135deg, ${p.swatch[0]} 0%, ${p.swatch[1]} 50%, ${p.swatch[2]} 100%)`
          }}/>
        </div>

        <div className="module glass-card span-7">
          <div className="mod-tag">OVERVIEW</div>
          <h3 className="mod-title">What it is.</h3>
          <p className="mod-body" style={{fontSize: 15, lineHeight: 1.6}}>{p.sub}</p>
          <p className="mod-body" style={{fontSize: 15, lineHeight: 1.6, marginTop: 12, color:"var(--ink-2)"}}>
            Built solo end-to-end — design, frontend, backend, deploy. The kind of
            scope that teaches you why every shortcut has a price tag attached.
          </p>
        </div>
        <div className="module glass-card span-5">
          <div className="mod-tag">STACK</div>
          <h3 className="mod-title" style={{fontSize: 24}}>Under the hood.</h3>
          <div style={{display:"flex", flexWrap:"wrap", gap: 8, marginTop: 16}}>
            {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
          <ul style={{listStyle:"none", padding:0, margin:"20px 0 0",
                      display:"flex", flexDirection:"column", gap: 0}}>
            {[["YEAR", p.year], ["ROLE", p.role], ["LINK", p.link?.replace(/^https?:\/\//, "") || "—"]].map(([k, v]) => (
              <li key={k} style={{display:"flex", justifyContent:"space-between",
                                  padding:"12px 0", borderTop:"1px solid var(--rule)"}}>
                <span className="ru">{k}</span>
                <span style={{fontFamily:"var(--mono)", fontSize: 12, color:"var(--ink)", textAlign:"right", maxWidth:"60%"}}>{v}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="module glass-card span-12">
          <div className="mod-tag">UP NEXT</div>
          <button className="company-row glass-card sm" style={{marginTop: 14}}
                  onClick={() => navigate("project/" + next.slug)}>
            <div>
              <div className="ru" style={{color:"var(--ember)"}}>NEXT PROJECT · 0{next.idx}</div>
              <div style={{fontSize: 32, fontWeight: 500, marginTop: 6}}>{next.title}</div>
              <div style={{fontFamily:"var(--mono)", fontSize: 12, color:"var(--ink-2)", marginTop: 4}}>{next.year}</div>
            </div>
            <span className="ch-arrow" style={{fontSize: 28, color:"var(--ink-2)"}}>↗</span>
          </button>
        </div>
      </section>

      <FooterBar resume={resume} right={<a href="#/work">→ ALL WORK</a>} />
    </div>
  );
}

// ---------- BLOG ----------
const BLOG_POSTS = [
  { slug: "rest-apis-30-percent", title: "How I cut REST API response times by 30%",
    date: "Apr 12, 2026", read: "8 min", tag: "PERFORMANCE",
    excerpt: "The TCS Trade-Finance refactor: where the latency was actually hiding, and why nobody had looked there." },
  { slug: "5-min-batch", title: "From 30 minutes to 5: rewriting a batch job",
    date: "Mar 28, 2026", read: "11 min", tag: "JAVA",
    excerpt: "A war-story walkthrough of the changes that took our nightly batch from \"go get coffee\" to \"already done\"." },
  { slug: "spicybits-arch", title: "Building SpicyBits — architecture notes",
    date: "Feb 14, 2026", read: "14 min", tag: "FULLSTACK",
    excerpt: "Firebase Auth, Firestore at the edge, ChatGPT moderation, and the parts that aged badly in three weeks." },
  { slug: "spring-boot-traps", title: "Three Spring Boot traps I keep falling into",
    date: "Jan 03, 2026", read: "6 min", tag: "BACKEND",
    excerpt: "Lazy collections, transaction boundaries, and the bean that wasn't where you thought it was." },
  { slug: "react-real-time", title: "Real-time UI without losing your mind",
    date: "Dec 09, 2025", read: "9 min", tag: "REACT",
    excerpt: "TaskPilot's Firestore sync layer — what worked, what I'd burn down and rebuild today." },
];
function BlogPage({ navigate, resume }) {
  useReveal();
  const ref = React.useRef(null);
  usePageEntry(ref);

  const tickerLines = BLOG_POSTS.flatMap((p) => [
    { text: p.date, accent: false },
    { text: p.tag, accent: true },
    { text: p.read + " read", accent: false },
    { text: "—", accent: false },
  ]);
  const doubled = [...tickerLines, ...tickerLines];

  const SPANS = ["span-7", "span-5", "span-5", "span-7"];

  return (
    <div className="page-fade" ref={ref}>
      <section className="blog-hero">
        <aside className="blog-side" aria-hidden="true">
          <div className="blog-vticker">
            <div className="blog-vticker-track">
              {doubled.map((t, i) => (
                <div key={i} className={"blog-tick-row" + (t.accent ? " accent" : "")}>{t.text}</div>
              ))}
            </div>
          </div>
          <div className="blog-side-line">
            <div className="blog-side-dot" />
          </div>
        </aside>

        <div className="blog-hero-main">
          <div className="ru" style={{marginBottom: 24}}>004 / JOURNAL · {BLOG_POSTS.length} POSTS</div>
          <h1 className="wh-title">Field <em>notes,</em><br/>shipped weekly.</h1>
          <div className="blog-hero-stats">
            {[["POSTS", String(BLOG_POSTS.length)], ["TOPICS", "BACKEND · REACT · PERF"], ["CADENCE", "WEEKLY"]].map(([k, v]) => (
              <div key={k} className="blog-stat">
                <div className="ru">{k}</div>
                <div className="blog-stat-val">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="work-modules">
        <div className="module glass-card feature span-12 tall">
          <div className="mod-tag" style={{color:"rgba(10,9,8,.7)"}}>FEATURED · {BLOG_POSTS[0].tag}</div>
          <h3 className="mod-title blog-featured-title" style={{fontSize: 56, color: "var(--bg)"}}>{BLOG_POSTS[0].title}</h3>
          <p className="mod-body" style={{fontSize: 16, maxWidth: "52ch", color:"rgba(10,9,8,.78)"}}>
            {BLOG_POSTS[0].excerpt}
          </p>
          <div style={{
            marginTop: "auto", display: "flex", alignItems: "center",
            gap: 24, paddingTop: 20, borderTop: "1px solid rgba(10,9,8,0.2)"
          }}>
            <span style={{fontFamily:"var(--mono)", fontSize:11, color:"rgba(10,9,8,.65)", letterSpacing:"0.14em"}}>
              {BLOG_POSTS[0].date}
            </span>
            <span style={{fontFamily:"var(--mono)", fontSize:11, color:"rgba(10,9,8,.65)", letterSpacing:"0.14em"}}>
              {BLOG_POSTS[0].read} read
            </span>
            <span style={{marginLeft:"auto", fontFamily:"var(--mono)", fontSize:11,
              color:"rgba(10,9,8,.85)", letterSpacing:"0.1em"}}>
              READ →
            </span>
          </div>
        </div>

        {BLOG_POSTS.slice(1).map((p, i) => (
          <a key={p.slug} href={"#/blog/" + p.slug}
             className={"module glass-card " + SPANS[i % SPANS.length]}>
            <div className="mod-tag">{p.tag} · {p.date} · {p.read} read</div>
            <h3 className="mod-title" style={{fontSize: 28, marginTop: 14}}>{p.title}</h3>
            <p className="mod-body">{p.excerpt}</p>
            <div className="mod-art" style={{
              minHeight: 120, height: 140,
              background: `linear-gradient(135deg, ${SWATCHES[i % SWATCHES.length].join(", ")})`
            }}/>
          </a>
        ))}
      </section>

      <FooterBar resume={resume} right={<a href="#/contact">→ SUBSCRIBE</a>} />
    </div>
  );
}

const BLOG_CONTENT = {
  "rest-apis-30-percent": [
    { h: "Where the time was actually going",
      p: ["The profiler said it was the database. The database said it was fine. Both were technically right. After wiring up Micrometer and watching 40ms evaporate into 'application logic', the culprit wasn't a slow query — it was 47 of them. One endpoint was firing a separate SELECT for every row in a 200-item list. Classic N+1, hiding behind a clean-looking JPA repository call.",
          "Nobody had caught it because the individual queries were fast — around 0.8ms each. Multiply that by 47 per request at 60 requests/minute and you've quietly invented a problem that only shows up in prod metrics, never in local testing."] },
    { h: "The fix wasn't clever",
      p: ["JOIN FETCH. Three words in a JPQL query. The round-trip count dropped from 48 to 2 per request and average response time fell from 210ms to 140ms. The lesson isn't the fix — it's that aggregate performance debt hides in places that look fine at the unit level.",
          "The code review that approved the original had no idea. The tests passed. The endpoint returned correct data. Latency is a cross-cutting concern and it doesn't show up in a green test suite."] },
    { h: "The second win — connection pool tuning",
      p: ["The JOIN FETCH got us to roughly 20% improvement. The remaining 10% came from HikariCP config: default pool size was 10 while the service was handling 80 concurrent requests. Half the threads were queuing for a connection, adding ~30ms of artificial wait per request.",
          "Bumping the pool ceiling and setting a max-wait timeout of 200ms dropped p95 latency from 180ms to 126ms in production. Two config lines. No code change. Always profile before you optimise — the bottleneck is never where you assume."] },
  ],
  "5-min-batch": [
    { h: "The original crime",
      p: ["The job read 90,000 records one at a time, processed each synchronously, and committed after every single row. It had been in production for 18 months. Nobody complained because it ran at 2am. When the dataset grew, '2am' became '4am' and an SLA alarm finally fired.",
          "Reading the code, there was no malice — just an early design that was never revisited. One loop, one entity manager call per iteration, one flush per row. 90,000 database round-trips for a job that could theoretically complete in a handful."] },
    { h: "What chunking actually does",
      p: ["Spring Batch chunk processing reads N records, processes them, then commits once. We set chunk size to 500. That took 90,000 commits down to 180. The I/O reduction alone cut the job from 30 minutes to about 18.",
          "Add a ThreadPoolTaskExecutor with 8 partitions and you're processing 8 chunks simultaneously. Wall-clock time dropped to 11 minutes. The database barely noticed — each partition owned a non-overlapping ID range so there was zero lock contention."] },
    { h: "The last mile to 5 minutes",
      p: ["11 minutes wasn't the target. The remaining bottleneck was a downstream REST call inside each item processor — synchronous HTTP, one record at a time, averaging 90ms per call. At 90,000 records that's 135 minutes of pure network wait, amortised by threading down to about 6.",
          "The provider had a bulk endpoint that accepted 50 records per payload. Batching the processor calls took the network component from 6 minutes to under 2. Final runtime: 5 minutes 18 seconds. The 2am alarm has been quiet ever since."] },
  ],
  "spicybits-arch": [
    { h: "The stack that made sense at 9pm",
      p: ["Firebase Auth, Firestore, Cloud Functions, ChatGPT API. Serverless, real-time, zero ops overhead, zero upfront cost. For a solo side project the pitch was perfect. The architecture doc fit on one page and it shipped a working prototype in a weekend.",
          "Three weeks of real usage rewrote that doc entirely."] },
    { h: "What aged badly — Firestore query limits",
      p: ["Firestore's document model is excellent until your queries need more than one inequality filter. The content feed needed to filter by category, sort by engagement score, and paginate. That is three Firestore limitations in one sentence.",
          "The workaround was denormalising everything into a flat feed collection — one document per user per post, pre-sorted. Not elegant. Writes became fan-out operations. But it shipped and it's fast. Sometimes the right answer is the one you can finish."] },
    { h: "What aged badly — ChatGPT moderation latency",
      p: ["The moderation API averages 800ms. Putting that in the synchronous write path meant every post submission sat on a spinner for nearly a second before confirmation. Users assumed it was broken. Two of them submitted the same post four times.",
          "Moving moderation async fixed the UX entirely: write optimistically, flag the post as 'under review' in the UI, moderate in a Cloud Function, soft-delete if flagged. The latency didn't go away — it just stopped being the user's problem."] },
    { h: "What I'd keep",
      p: ["Firebase Auth remains the best authentication story for a solo build. The Firestore real-time listeners are genuinely useful for collaborative features. If I rebuilt SpicyBits today I'd keep both and replace the feed logic with a single Postgres table and a simple index. Sometimes a SQL ORDER BY is just the right tool."] },
  ],
  "spring-boot-traps": [
    { h: "Trap 1 — The lazy collection that wasn't lazy",
      p: ["@OneToMany is LAZY by default. Everyone knows this. What's less obvious: calling .size() on that collection inside a @Transactional method re-opens the Hibernate session and fires the SELECT right there — even if you never intended to load those records.",
          "We had a summary endpoint loading four extra collections per entity because a mapper had written if (entity.getItems().size() > 0). Four collections, per entity, in a list of 50. The query count was 201 per request. The fix was one @Query with a COUNT subquery. The code review that should have caught it didn't, because no one was counting queries."] },
    { h: "Trap 2 — The transaction that wasn't",
      p: ["@Transactional on a private method does nothing. Spring's AOP proxy wraps the bean, so when you call a private method from within the same class, you bypass the proxy entirely. No proxy means no transaction boundary. The annotation is decorating thin air.",
          "The bug this produces is subtle: the code runs, no exception is thrown, but two writes that should be atomic aren't. You find out from a data integrity alert at 3am, not from a failing test. Fix: separate bean, or make the method public and call it through the injected self-reference."] },
    { h: "Trap 3 — The bean that wasn't where you thought",
      p: ["Two implementations of the same interface, no @Primary, no @Qualifier. In local dev Spring throws NoUniqueBeanDefinitionException at startup and you fix it immediately. In some CI environments it doesn't throw — classpath ordering happens to load one implementation first and Spring silently picks it. Your tests pass. Prod uses the wrong implementation.",
          "This one is easy to prevent and painful to debug. @Qualifier every ambiguous injection. @Primary every default implementation. Treat missing qualifiers as a code smell in review."] },
  ],
  "react-real-time": [
    { h: "Why Firestore listeners feel like magic",
      p: ["You call onSnapshot, hand it a query, and the UI just updates when data changes. No polling interval. No WebSocket handshake. No server-sent event infrastructure. For a task manager where multiple users edit shared boards, this felt like the entire backend problem was solved for free.",
          "For the first two weeks it was. The first version of TaskPilot had real-time board sync, presence indicators, and unread counts working in under 400 lines of React. That number was misleading."] },
    { h: "Where it stops feeling like magic",
      p: ["At peak we had 6 active Firestore listeners per user session: tasks by user, tasks by project, shared tasks, notification badges, unread counts, presence. Each new browser tab opened all six. The SDK handles reconnection gracefully but the React tree was re-rendering on every snapshot across all six simultaneously — including for changes in completely unrelated collections.",
          "The fix: consolidate into one root listener on a user-scoped aggregate document, derive everything else client-side from that single snapshot. Six network connections became one. Re-render surface shrank by about 70%."] },
    { h: "What I'd burn down and rebuild",
      p: ["The optimistic update layer. We built a local pending-writes cache that merged with incoming snapshots to give instant UI feedback. It worked. It was also 400 lines of custom state logic that broke in two specific edge cases we didn't find until closed beta: concurrent edits from two tabs, and a race between a delete and a snapshot arrival.",
          "React Query's built-in optimistic update primitives plus a Zustand slice would have done this in under 50 lines with better conflict handling. The lesson: the glamorous part of the architecture (real-time sync) was fine. The unsexy part (local state) was where the debt accumulated."] },
  ],
};

function BlogPostPage({ navigate, resume, slug: pslug }) {
  useReveal();
  const ref = React.useRef(null);
  usePageEntry(ref);
  const post = BLOG_POSTS.find((p) => p.slug === pslug);
  const postIdx = BLOG_POSTS.findIndex((p) => p.slug === pslug);
  const nextPost = BLOG_POSTS[(postIdx + 1) % BLOG_POSTS.length];
  const content = BLOG_CONTENT[pslug] || [];

  if (!post) return (
    <div className="page-fade" ref={ref}>
      <section className="work-hero"><h1 className="wh-title">Post <em>not found.</em></h1></section>
      <FooterBar resume={resume} right={<a href="#/blog">→ BACK TO BLOG</a>} />
    </div>
  );

  const sideItems = [
    { text: post.tag, accent: true },
    { text: post.date, accent: false },
    { text: post.read + " read", accent: false },
    { text: "—", accent: false },
    ...content.map((s) => ({ text: s.h.split(" ").slice(0,3).join(" "), accent: false })),
    { text: "—", accent: false },
  ];
  const doubled = [...sideItems, ...sideItems, ...sideItems];

  return (
    <div className="page-fade" ref={ref}>
      <div className="blog-post-wrap">
        <aside className="blog-post-sidebar" aria-hidden="true">
          <div className="blog-vticker" style={{height: "100%"}}>
            <div className="blog-vticker-track" style={{animationDuration: "30s"}}>
              {doubled.map((t, i) => (
                <div key={i} className={"blog-tick-row" + (t.accent ? " accent" : "")}>{t.text}</div>
              ))}
            </div>
          </div>
          <div className="blog-side-line">
            <div className="blog-side-dot" />
          </div>
        </aside>

        <div className="blog-post-body-wrap">
          <div className="ru" style={{marginBottom: 16}}>
            <a href="#/blog" style={{color:"var(--ink-2)"}}>← BLOG</a>
            {" · "}{post.tag}{" · "}{post.date}{" · "}{post.read}
          </div>
          <h1 className="wh-title" style={{marginBottom: 28}}>{post.title}</h1>
          <p className="blog-lede">{post.excerpt}</p>

          <div className="blog-prose">
            {content.map((s, i) => (
              <div key={i} className="blog-section">
                <h2 className="blog-section-h">{s.h}</h2>
                {s.p.map((para, j) => <p key={j}>{para}</p>)}
              </div>
            ))}
          </div>

          {nextPost && (
            <div className="blog-next glass-card">
              <div className="ru" style={{marginBottom: 12}}>NEXT POST</div>
              <a href={"#/blog/" + nextPost.slug} className="blog-next-title">
                {nextPost.title} →
              </a>
              <div className="ru" style={{marginTop: 10}}>
                {nextPost.tag} · {nextPost.date} · {nextPost.read}
              </div>
            </div>
          )}
        </div>
      </div>

      <FooterBar resume={resume} right={<a href="#/blog">→ ALL POSTS</a>} />
    </div>
  );
}

// ---------- ABOUT ----------
function AboutPage({ resume }) {
  useReveal();
  const ref = React.useRef(null);
  usePageEntry(ref);
  const edu = resume.education || [];
  const exp = resume.experience || [];
  const certs = resume.certifications || [];

  return (
    <div className="page-fade" ref={ref}>
      <div className="about-grid">
        <div className="about-portrait glass-card" />
        <div className="about-text">
          <div className="ru">003 / ABOUT · {resume.name?.toUpperCase()}</div>
          <h2>{resume.title} who <em>thinks like a designer</em>, ships like an operator.</h2>
          <p>{resume.summary}</p>
          <p>Currently at <b>{exp[0]?.company}</b>{exp[0]?.client ? <span> on the <b>{exp[0].client}</b> account</span> : null}, shipping production backend systems. Outside of the day job: side projects ({(resume.projects || []).map((p) => p.name).join(", ")}), writing on the blog, code at hours I shouldn't.</p>
          <p>Reach me at <b>{resume.contact?.email}</b>. I read every email.</p>
        </div>
      </div>

      <div className="about-strip">
        <div className="item glass-card sm">
          <h4>STACK / DAILY</h4>
          <ul>{(resume.skills?.primary || []).map((s) => <li key={s}>{s} <b>primary</b></li>)}</ul>
        </div>
        <div className="item glass-card sm">
          <h4>WORKING WITH</h4>
          <ul>{(resume.skills?.working || []).map((s) => <li key={s}>{s} <b>active</b></li>)}</ul>
        </div>
        <div className="item glass-card sm">
          <h4>EXPERIENCE</h4>
          <ul>{exp.map((e, i) => <li key={i}>{e.company} <b>{shortDate(e.duration || "")} · {e.role.toLowerCase()}</b></li>)}</ul>
        </div>
        <div className="item glass-card sm">
          <h4>EDUCATION</h4>
          <ul>
            {edu.map((e, i) => <li key={i}>{e.degree || e.stream || "Schooling"}<b>{e.institution} · {e.duration}</b></li>)}
            {certs.map((c, i) => <li key={"c"+i}>{c.name}<b>{c.issuer}</b></li>)}
          </ul>
        </div>
      </div>

      <FooterBar resume={resume} right={<a href="#/contact">→ SAY HI</a>} />
    </div>
  );
}

// ---------- CONTACT ----------
function ContactPage({ resume }) {
  useReveal();
  const ref = React.useRef(null);
  usePageEntry(ref);
  const c = resume.contact || {};
  const links = c.links || {};
  const channels = [
    { num: "01", name: "Email",     handle: c.email + " · ≤ 24h reply",  href: "mailto:" + c.email,        arrow: "↗" },
    { num: "02", name: "Phone",     handle: c.phone + " · IST",          href: "tel:" + (c.phone || "").replace(/\s/g, ""), arrow: "↗" },
    { num: "03", name: "Portfolio", handle: (links.portfolio || "").replace(/^https?:\/\//, ""), href: links.portfolio, arrow: "↗" },
    { num: "04", name: "GitHub",    handle: (links.github || "").replace(/^https?:\/\//, ""),    href: links.github,    arrow: "↗" },
    { num: "05", name: "LinkedIn",  handle: (links.linkedin || "").replace(/^https?:\/\//, ""),  href: links.linkedin,  arrow: "↗" },
  ].filter((ch) => ch.href);

  return (
    <div className="page-fade" ref={ref}>
      <div className="contact-grid">
        <h1 className="lead">Let's <em>build</em><br/>something <span className="out">loud.</span></h1>
        <div className="contact-channels glass-card">
          {channels.map((ch) => (
            <a key={ch.num} className="channel" href={ch.href}
               target={ch.href?.startsWith("http") ? "_blank" : undefined} rel="noopener">
              <span className="ch-num">{ch.num} ·</span>
              <span>
                <div className="ch-name">{ch.name}</div>
                <div className="ch-handle">{ch.handle}</div>
              </span>
              <span className="ch-arrow">{ch.arrow}</span>
            </a>
          ))}
        </div>
        <aside className="contact-meta">
          <div className="block glass-card sm">
            <h5>STATUS</h5>
            <span className="available">Open to interesting backend work</span>
          </div>
          <div className="block glass-card sm">
            <h5>CURRENTLY</h5>
            <p>{resume.experience?.[0]?.role} at <b>{resume.experience?.[0]?.company}</b>{resume.experience?.[0]?.client ? <span> ({resume.experience[0].client})</span> : null}.</p>
          </div>
          <div className="block glass-card sm">
            <h5>BEST FIT</h5>
            <p>Backend systems, REST APIs, performance work, anything where the spec is still slightly on fire.</p>
          </div>
          <div className="block glass-card sm">
            <h5>STACK</h5>
            <p>{(resume.skills?.primary || []).join(" · ")}</p>
          </div>
          <div className="block glass-card sm">
            <h5>BASED IN</h5>
            <p>{resume.education?.[0]?.location || "India"} · IST</p>
          </div>
        </aside>
      </div>
      <Marquee reverse items={[
        { text: "DROP A LINE" }, { text: "i actually read these", kind: "grad" },
        { text: "NO RECRUITERS", kind: "out" }, { text: "SAY HI" },
        { text: c.email || "", kind: "grad" },
      ]}/>
      <FooterBar resume={resume} right={<a href="#/">→ BACK TO INDEX</a>} />
    </div>
  );
}

// ---------- FOOTER ----------
function FooterBar({ resume, right }) {
  const links = resume.contact?.links || {};
  return (
    <footer className="footer">
      <div className="col span-3">
        <span><b>{(resume.name || "").split(" ").map((s) => s[0]).join("")}</b></span>
        <span>© {new Date().getFullYear()} {resume.name?.toUpperCase()}</span>
        <span>{resume.education?.[0]?.location?.toUpperCase() || "EARTH"}</span>
      </div>
      <div className="col span-3">
        <span>SOCIAL</span>
        {links.github   && <a href={links.github}   target="_blank" rel="noopener">→ GITHUB</a>}
        {links.linkedin && <a href={links.linkedin} target="_blank" rel="noopener">→ LINKEDIN</a>}
        {links.portfolio&& <a href={links.portfolio}target="_blank" rel="noopener">→ PORTFOLIO</a>}
      </div>
      <div className="col span-3">
        <span>EXPLORE</span>
        <a href="#/work">→ CASE STUDIES</a>
        <a href="#/blog">→ BLOG</a>
        <a href="#/about">→ ABOUT</a>
      </div>
      <div className="col span-3" style={right ? {textAlign:"right"} : null}>
        {right ? right : (
          <React.Fragment>
            <span>COLOPHON</span>
            <span>INTER TIGHT (VAR)</span>
            <span>INSTRUMENT SERIF</span>
            <span>JETBRAINS MONO</span>
          </React.Fragment>
        )}
      </div>
    </footer>
  );
}

Object.assign(window, {
  HomePage, WorkPage, CompanyPage, ProjectPage,
  BlogPage, BlogPostPage, AboutPage, ContactPage, FooterBar,
});