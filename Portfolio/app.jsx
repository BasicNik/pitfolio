// =============================================
// APP — root + routing + tweaks
// =============================================
const { useState, useEffect } = React;

function App() {
  const [route, navigate] = useHashRoute();
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  const [resume, setResume] = useState(null);
  const [error, setError] = useState(null);
  useShortcuts(navigate);

  useEffect(() => {
    fetch("data/resume.json", { cache: "no-cache" })
      .then((r) => { if (!r.ok) throw new Error("resume.json not found (" + r.status + ")"); return r.json(); })
      .then(setResume).catch((e) => setError(e.message || String(e)));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const PALETTES = {
      sunset:  { ember: "#FF5E1A", pink: "#FF2E93", violet: "#7B2CFF" },
      acid:    { ember: "#D7FF3A", pink: "#00FFA3", violet: "#1A4FFF" },
      mono:    { ember: "#F4EFE6", pink: "#9b9285", violet: "#3a342d" },
      cobalt:  { ember: "#1A4FFF", pink: "#7B2CFF", violet: "#FF2E93" },
    };
    const p = PALETTES[t.palette] || PALETTES.sunset;
    root.style.setProperty("--ember", p.ember);
    root.style.setProperty("--pink",  p.pink);
    root.style.setProperty("--violet",p.violet);
    root.style.setProperty("--grad-sunset",
      `linear-gradient(120deg, ${p.ember} 0%, ${p.pink} 48%, ${p.violet} 100%)`);
  }, [t.palette]);

  if (error) {
    return (
      <React.Fragment>
        <StatusBar />
        <main className="shell" style={{paddingTop: 140}}>
          <div className="ru" style={{marginBottom: 16, color: "var(--ember)"}}>ERROR</div>
          <h1 style={{fontSize: 48, lineHeight: 1, margin: 0, fontWeight: 500}}>
            Could not load <em style={{fontFamily:"var(--serif)"}}>data/resume.json</em>.
          </h1>
          <p style={{marginTop: 24, color: "var(--ink-2)", fontFamily: "var(--mono)", fontSize: 13}}>{error}</p>
        </main>
      </React.Fragment>
    );
  }
  if (!resume) {
    return (
      <React.Fragment>
        <StatusBar />
        <main className="shell" style={{paddingTop: 200, display:"grid", placeItems:"center",
                                        minHeight: "60vh", textAlign: "center"}}>
          <div>
            <div className="ru" style={{color:"var(--ember)", marginBottom: 16}}>● LOADING</div>
            <div style={{fontFamily:"var(--mono)", fontSize: 12, letterSpacing:"0.1em",
                         color: "var(--ink-3)"}}>FETCHING RESUME.JSON</div>
          </div>
        </main>
      </React.Fragment>
    );
  }

  // routing
  let page = null;
  const r = route;
  if (r === "" || r === "/")           page = <HomePage navigate={navigate} resume={resume} />;
  else if (r === "work")               page = <WorkPage navigate={navigate} resume={resume} />;
  else if (r === "blog")               page = <BlogPage navigate={navigate} resume={resume} />;
  else if (r.startsWith("blog/"))      page = <BlogPostPage navigate={navigate} resume={resume} slug={r.slice(5)} />;
  else if (r.startsWith("company/"))   page = <CompanyPage navigate={navigate} resume={resume} idx={parseInt(r.slice(8), 10)} />;
  else if (r.startsWith("project/"))   page = <ProjectPage navigate={navigate} resume={resume} slug={r.slice(8)} />;
  else if (r === "about")              page = <AboutPage resume={resume} />;
  else if (r === "contact")            page = <ContactPage resume={resume} />;
  else                                 page = <HomePage navigate={navigate} resume={resume} />;

  // top-level navbar route key (so /project/* keeps Work pill active)
  const navRoute =
    r.startsWith("company/") || r.startsWith("project/") ? "work" :
    r.startsWith("blog") ? "blog" :
    r;

  return (
    <React.Fragment>
      <StatusBar resume={resume} />
      <AmbientBlobs />
      <Navbar route={navRoute} navigate={navigate} resume={resume} />
      {t.showGrid && <GridLines />}
      <CursorBlob enabled={t.cursorBlob} />
      <Grain enabled={t.grain} />
      <ContextMenu navigate={navigate} resume={resume} />

      <PageSidebar route={navRoute} />
      <main className="shell" key={r}>{page}</main>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Palette">
          <TweakRadio label="Color direction" value={t.palette}
            options={[
              { value: "sunset", label: "Sunset" },
              { value: "acid",   label: "Acid"   },
              { value: "cobalt", label: "Cobalt" },
              { value: "mono",   label: "Mono"   },
            ]}
            onChange={(v) => setTweak("palette", v)} />
        </TweakSection>
        <TweakSection title="Atmosphere">
          <TweakToggle label="Cursor spotlight" value={t.cursorBlob} onChange={(v) => setTweak("cursorBlob", v)} />
          <TweakToggle label="Grain texture"    value={t.grain}      onChange={(v) => setTweak("grain", v)} />
          <TweakToggle label="Background blobs" value={t.blobs}      onChange={(v) => setTweak("blobs", v)} />
          <TweakToggle label="Show grid scaffold" value={t.showGrid} onChange={(v) => setTweak("showGrid", v)} />
        </TweakSection>
        <TweakSection title="Navigate">
          <TweakButton onClick={() => navigate("")}>Home</TweakButton>
          <TweakButton onClick={() => navigate("work")}>Work</TweakButton>
          <TweakButton onClick={() => navigate("blog")}>Blog</TweakButton>
          <TweakButton onClick={() => navigate("about")}>About</TweakButton>
          <TweakButton onClick={() => navigate("contact")}>Contact</TweakButton>
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);