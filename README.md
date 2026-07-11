# Project Spines

A single four-tab React application containing the complete corrected Project Spines experiments.

## Included views

1. **Schedule spine explorer** — the native React walkthrough covering precedence, incomparability, Dilworth lanes, spines, infinite limits, Hollom's P5 counterexample, Example 5.1, and the theorem classifier.
2. **Mountain refuge shed** — the full finite-DAG construction, three verified minimum antichain partitions, five-stage construction animation, tooltips, reset, and CPM comparison.
3. **Shed and vacillation** — the complete shed certificate followed by the lexicographic/Cartesian vacillation explorer, finite toggle, sliders, dynamic verdict, and theory panels.
4. **Project-controls briefing** — the director-facing WBS, two spine selections, slice navigation, churn test, briefing story, fishbone, live certificate validation, clipboard action, and JSON export.

The three standalone applications remain isolated same-origin documents under `public/experiments/` and are hosted by persistent React tabs. This preserves their global CSS, IDs, inline scripts, D3 selectors, downloads, timers, and state without collisions.

D3 7.8.5 is vendored under `public/vendor/` with its license so the finite construction and vacillation tabs work offline.

## Run locally

```sh
pnpm install --frozen-lockfile
pnpm run dev
```

## Build

```sh
pnpm run build
```

The Vite base is `/project-spines/`, ready for a repository with that GitHub Pages slug.

## Repository status

This local repository preserves the useful history of the earlier Hollman and Dilworth explorer. Its old GitHub remote has been removed deliberately; attach a new `project-spines` remote only when publishing is intended.

See [MIGRATION.md](MIGRATION.md) for provenance, source hashes, functional coverage, and the staging-deletion receipt.
