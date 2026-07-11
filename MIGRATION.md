# Project Spines migration receipt

## Consolidation

The corrected JSX explorer and three corrected standalone applications were consolidated into this repository on 2026-07-11.

| Source staging artefact | Source SHA-256 | Durable destination |
| --- | --- | --- |
| `code to review/hollman-dilworth-for-controls/src/ScheduleSpineExplainer.jsx` | `4ad4f4cc85e669efd710cfc2b78f4db1dc5135983caf5cb3bb2407fb528fb7cd` | `src/ScheduleSpineExplainer.jsx` |
| `code to review/artifact - project-spine-viz.html` | `543e9a3cbb9d664b4747b7e43fa975d566eb6ef962b627e8d2a40c5d88158f10` | `public/experiments/shed-spine-construction.html` |
| `code to review/code-block-02.html` | `b17a9f9991adc151dcbd9093dd7795721d670f98eeba6d5407858fa7d90f1cf1` | `public/experiments/shed-and-vacillation.html` |
| `code to review/hollom_project_controls_spine_demo.html` | `0546330f6073fdfc3e80fa80fb3e4fbe1cb5474986e661c0a655d7b8dcc32fa2` | `public/experiments/project-controls-briefing.html` |

The JSX and director-demo copies are byte-identical at migration. The two D3-based HTML destinations differ only in replacing their CDN script URL with the vendored `../vendor/d3-7.8.5.min.js`.

Vendored D3 7.8.5 SHA-256: `d6b03aefc9f6c44c7bc78713679c78c295028fa914319119e5cc4b4954855b1c`.

## Functional coverage retained

- React explorer: five scenes, interactive network, Dilworth/spine switch, front slider, finite/infinite loop, omega-grid/P5 comparison, Example 5.1 explanation, and eight-result theorem classifier.
- Shed construction: three partitions, spine/info toggles, hover tooltips, validation summary, five-stage construction animation, reset, and CPM comparison.
- Shed/vacillation: full shed display plus lexicographic/Cartesian modes, finite truncation, both sliders, dynamic diagram/verdict/legend, and five expandable theory panels.
- Project-controls briefing: path and slice toggles, slice navigation and auto-sweep, churn insertion, reset, hover chain, keyboard/click inspector, five briefing steps, live statistics, fishbone, certificate table, runtime DAG/reachability/partition/CPM checks, clipboard action, and JSON export.

## Architecture decision

Direct JSX conversion was rejected because the standalone apps reuse global CSS, fixed IDs, document-wide selectors, D3 globals, timers, and inline handlers. Persistent same-origin iframe tabs preserve those behaviours while preventing cross-app collisions. All four panels stay mounted so state survives tab changes.

## Repository safety

The earlier Git history was preserved. The old `hollman-dilworth-project-controls` GitHub remote was removed from this new local repository before any consolidation work. No new remote was created or pushed.

## Staging deletion scope

After a clean production build, route and interaction checks, and a clean consolidation commit, the following staging items are superseded:

- `code to review/artifact - project-spine-viz.html`
- `code to review/code-block-02.html`
- `code to review/hollom_project_controls_spine_demo.html`
- `code to review/hollman-dilworth-for-controls/`

The papers, prompts, notes, and everything else in `250 Hollom` remain outside this deletion scope.
