import React, { useEffect, useState } from "react";
import ScheduleSpineExplainer from "./ScheduleSpineExplainer.jsx";
import StandaloneExperiment from "./StandaloneExperiment.jsx";
import { ReviewLoopTakeaway, SliceAuditTakeaway } from "./PlannerTakeaways.jsx";

const experimentBase = import.meta.env.BASE_URL + "experiments/";

const tabs = [
  {
    id: "theory-explorer",
    eyebrow: "Theory",
    title: "Schedule spine explorer",
    summary:
      "The native React walkthrough: precedence and incomparability, Dilworth lanes, spines, infinite limits, P5, and the theorem classifier.",
    kind: "native",
    component: ScheduleSpineExplainer,
  },
  {
    id: "shed-construction",
    eyebrow: "Finite construction",
    title: "Mountain refuge shed",
    summary:
      "A five-step finite-DAG construction with three verified minimum antichain partitions and a separate CPM selector.",
    kind: "embedded",
    src: experimentBase + "shed-spine-construction.html",
  },
  {
    id: "slice-audit",
    eyebrow: "Planner audit",
    title: "Antichain slice audit",
    summary:
      "A senior-planner mental model for testing whether planned concurrency is a real antichain surface that honours the spine.",
    kind: "native",
    component: SliceAuditTakeaway,
  },
  {
    id: "review-loop-diagnosis",
    eyebrow: "Loop diagnosis",
    title: "Left/right review loops",
    summary:
      "A project-control translation of the infinite-boundary intuition: version the artefact when authority from the left needs evidence from the right.",
    kind: "native",
    component: ReviewLoopTakeaway,
  },
  {
    id: "vacillation-boundary",
    eyebrow: "Infinite boundary",
    title: "Shed and vacillation",
    summary:
      "The complete shed certificate followed by the lexicographic-versus-Cartesian vacillation explorer.",
    kind: "embedded",
    src: experimentBase + "shed-and-vacillation.html",
  },
  {
    id: "controls-briefing",
    eyebrow: "Application",
    title: "Project-controls briefing",
    summary:
      "The director-facing WBS, two spine selections, antichain slices, churn test, live certificate, briefing story, copy action, and JSON export.",
    kind: "embedded",
    src: experimentBase + "project-controls-briefing.html",
    allow: "clipboard-write",
  },
];

const knownIds = new Set(tabs.map((tab) => tab.id));

function tabFromHash() {
  const id = window.location.hash.replace(/^#/, "");
  return knownIds.has(id) ? id : tabs[0].id;
}

export default function App() {
  const [activeId, setActiveId] = useState(tabFromHash);

  useEffect(() => {
    const onHashChange = () => setActiveId(tabFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function selectTab(id, moveFocus = false) {
    setActiveId(id);
    window.history.replaceState(null, "", "#" + id);
    if (moveFocus) {
      window.requestAnimationFrame(() => {
        document.getElementById("tab-" + id)?.focus();
      });
    }
  }

  function handleTabKey(event, index) {
    let nextIndex = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    selectTab(tabs[nextIndex].id, true);
  }

  function followViewLink(event, id) {
    // Keep normal link behaviour for a new tab or copied fragment.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    selectTab(id);
    window.requestAnimationFrame(() => {
      const panel = document.getElementById("panel-" + id);
      panel?.focus({ preventScroll: true });
      document.getElementById("active-view-heading")?.scrollIntoView({ block: "start" });
    });
  }

  const active = tabs.find((tab) => tab.id === activeId);

  return (
    <main className="project-spines-shell">
      <nav className="estate-navigation" aria-label="Wider project collection">
        <a href="https://lawrencerowland.github.io/side-projects.html">← Projects</a>
        <a href="https://lawrencerowland.github.io/library.html">Library</a>
        <button type="button" onClick={() => { document.getElementById("project-views")?.focus(); document.getElementById("project-views")?.scrollIntoView({ block: "start" }); }}>Skip to the six views ↓</button>
      </nav>
      <header className="project-header">
        <p className="project-kicker">An enquiry into the order of work</p>
        <h1>Project Spines</h1>
        <p>
          Can one chain of work stay visible through different ways of grouping
          the project? Start with a small shed, then follow the construction into
          its mathematics and limits.
        </p>
      </header>
      <section className="pw-scenario" aria-labelledby="shed-scenario-title">
        <figure><img src="https://lawrencerowland.github.io/gimmer-crag-project-mountain-refuge/input/processes%20to%20plans%20for%20Gimmer.PNG" alt="Illustrated mountain refuge used to motivate the finite shed example" width="640" height="400" decoding="async" /><figcaption>Shared refuge illustration. These experiments supply their own finite dependency model.</figcaption></figure>
        <div>
          <p className="pw-kicker">Start here · A finite toy project</p>
          <h2 id="shed-scenario-title">Build a mountain-refuge shed, one dependency at a time.</h2>
          <p>Survey the site, arrange permits and delivery, assemble the structure and make it weatherproof. The example fixes 14 tasks and their dependencies. Some tasks must follow others; the order leaves other pairs unrelated.</p>
          <p className="pw-question">What stays connected when the work is divided into different layers?</p>
          <a className="journey-button" href="#shed-construction" onClick={(event) => followViewLink(event, "shed-construction")}>Start with the shed <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <details className="reader-guide">
        <summary>What to try—and what it establishes</summary>
        <ol>
          <li><strong>Make one comparison.</strong> In Mountain refuge shed, choose “Show Spine”, then switch from “Earliest Feasible Layers” to “Middle-Shifted Layers”. The task dependencies stay fixed.</li>
          <li><strong>Read the result.</strong> A red chain still meets each of the eight coloured groups once. The status below the diagram checks that every task belongs to one group, no pair in a group is related by precedence, and the chain meets every group.</li>
          <li><strong>Inspect the construction.</strong> Choose “Run Construction”, then “Next Step” through the five stages. The last stage compares the 17-day height-selected spine with the 19-day duration-selected path. Both are spines here; they answer different selection questions.</li>
        </ol>
        <p>The groups are antichains: tasks unrelated by the represented precedence. They are not a promise of simultaneous execution. Resources, calendars and access constraints would still need their own model. These three compatible partitions do not show that every possible grouping meets the chain.</p>
      </details>

      <div className="views-heading" id="project-views" tabIndex={-1}>
        <h2>Six views of the enquiry</h2>
        <p>The shed is the suggested first example. Choose another view when ready to follow a different part of the question.</p>
      </div>
      <nav className="project-tabs" role="tablist" aria-label="Project Spines views">
        {tabs.map((tab, index) => {
          const selected = tab.id === activeId;
          return (
            <button
              id={"tab-" + tab.id}
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={"panel-" + tab.id}
              tabIndex={selected ? 0 : -1}
              className={selected ? "active" : ""}
              onClick={() => selectTab(tab.id)}
              onKeyDown={(event) => handleTabKey(event, index)}
            >
              <span>{tab.eyebrow}</span>
              {tab.title}
            </button>
          );
        })}
      </nav>

      <section className="active-view-intro" aria-live="polite">
        <p>{active.eyebrow}</p>
        <h2 id="active-view-heading">{active.title}</h2>
        <span>{active.summary}</span>
      </section>

      <div className="project-panels">
        {tabs.map((tab) => {
          const selected = tab.id === activeId;
          const NativeComponent = tab.component;
          return (
            <section
              id={"panel-" + tab.id}
              key={tab.id}
              role="tabpanel"
              tabIndex={-1}
              aria-labelledby={"tab-" + tab.id}
              hidden={!selected}
              className={tab.kind === "native" ? "tab-panel native-panel" : "tab-panel"}
            >
              {tab.kind === "native" ? (
                <NativeComponent />
              ) : (
                <StandaloneExperiment
                  src={tab.src}
                  title={tab.title}
                  description={tab.summary}
                  allow={tab.allow}
                />
              )}
            </section>
          );
        })}
      </div>

      <section className="journey-sources" aria-labelledby="journey-sources-heading">
        <h2 id="journey-sources-heading">Follow the idea further</h2>
        <p><a href="#theory-explorer" onClick={(event) => followViewLink(event, "theory-explorer")}>Read the formal explanation</a> for chains, antichains and the finite/infinite distinction. <a href="#slice-audit" onClick={(event) => followViewLink(event, "slice-audit")}>Try the slice audit</a> for the separate question of whether a proposed work grouping really contains unrelated tasks.</p>
        <details>
          <summary>Sources, construction and limits</summary>
          <p>The shed, its durations and these interfaces are teaching constructions. <a href="https://github.com/lawrencerowland/project-spines/blob/dc481f0d02b1542ba1c19e02d32df13370c359e4/public/experiments/shed-spine-construction.html#L439">Inspect the fixed task model and its checks</a>, or read the <a href="https://github.com/lawrencerowland/project-spines/blob/dc481f0d02b1542ba1c19e02d32df13370c359e4/MIGRATION.md">preserved source history</a>.</p>
          <p>The theory explanations refer to Lawrence Hollom’s <a href="https://arxiv.org/abs/2411.16844v4">A resolution of the Aharoni–Korman conjecture, version 4 (May 2025)</a>. The <a href="https://arxiv.org/abs/2411.16844">later paper record</a> separates the positive results from the counterexample. The explanations here use the earlier edition’s theorem numbering.</p>
          <p>A finite dependency certificate is not a resource-feasible schedule, an engineering design or evidence of project benefit. The review-loop tabs translate an intuition into project language; they do not establish that an infinite-poset theorem applies to a finite project.</p>
        </details>
      </section>
      <footer className="project-footer">
        <span>Project Spines · independent project experiments</span>
        <nav aria-label="Return to the wider collection"><a href="https://lawrencerowland.github.io/side-projects.html">Back to Projects</a><a href="https://lawrencerowland.github.io/library.html">Library</a></nav>
      </footer>
    </main>
  );
}
