import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import ScheduleSpineExplainer from "./ScheduleSpineExplainer.jsx";
import StandaloneExperiment from "./StandaloneExperiment.jsx";
import "./styles.css";

const experimentBase = import.meta.env.BASE_URL + "experiments/";

const tabs = [
  {
    id: "theory-explorer",
    eyebrow: "Theory",
    title: "Schedule spine explorer",
    summary:
      "The native React walkthrough: precedence and incomparability, Dilworth lanes, spines, infinite limits, P5, and the theorem classifier.",
    kind: "native",
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

function App() {
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

  const active = tabs.find((tab) => tab.id === activeId);

  return (
    <main className="project-spines-shell">
      <header className="project-header">
        <p className="project-kicker">Project controls / posets / schedule structure</p>
        <h1>Project Spines</h1>
        <p>
          Four complete, preserved experiments: one native React theory explorer
          and three isolated interactive applications brought together behind a
          single durable tabbed interface.
        </p>
      </header>

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
        <h2>{active.title}</h2>
        <span>{active.summary}</span>
      </section>

      <div className="project-panels">
        {tabs.map((tab) => {
          const selected = tab.id === activeId;
          return (
            <section
              id={"panel-" + tab.id}
              key={tab.id}
              role="tabpanel"
              aria-labelledby={"tab-" + tab.id}
              hidden={!selected}
              className={tab.kind === "native" ? "tab-panel native-panel" : "tab-panel"}
            >
              {tab.kind === "native" ? (
                <ScheduleSpineExplainer />
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

      <footer className="project-footer">
        The standalone applications remain same-origin documents so their
        original controls, state, downloads, timers, IDs, and styles stay
        isolated and functional.
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
