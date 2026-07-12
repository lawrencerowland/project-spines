# Prompt foray - Hollom project spines

## 2026-07-12 additions: planner-facing antichain and review-loop prompts

These prompts preserve the additional project-controls takeaways from the antichain/spine discussion without duplicating the app's explanatory tabs.

### Spine-respecting antichain audit

Use this when reviewing a real schedule or toy WBS:

```text
Treat this schedule as a finite partially ordered set. Ignore dates, resource preferences, and soft sequencing at first. Extract only hard precedence dependencies.

1. Identify the main project spine or candidate spine chain.
2. Assign every activity a left spine anchor L(x): the latest spine point that must precede it.
3. Assign every activity a right spine anchor R(x): the earliest spine point that it must precede or feed.
4. Flag any activity where L(x) is not strictly before R(x).
5. Reassemble the schedule into proposed slices. For each slice, test whether every pair of activities is incomparable in the precedence graph.
6. Flag any calendar bucket, sprint, phase, or review window that is being treated as parallel even though it contains a hidden chain.
7. State whether the candidate spine hits each proposed antichain slice, and what this proves or does not prove for project control.

Output: a table of slices, hidden-chain warnings, left/right anchor warnings, and a short planner-facing judgement.
```

### Senior project-controls conversation

Use this when translating the idea for an experienced planner:

```text
Explain this to an intelligent senior project controls or planning manager without leading with theorem names.

Core message: CPM validates a duration-selected chain. A separate structural review should validate the claimed parallel surfaces. A dated work bucket is not an antichain until every pair of activities in it is precedence-incomparable.

Walk through the conversation you would have:
- start from network logic rather than dates;
- distinguish path review from slice review;
- show how a chain can masquerade as concurrency;
- introduce the spine as a chain that should remain visible through the antichain slices;
- end with a repeatable validation routine the planner could use in a schedule review.

Keep the tone practical and senior, not academic.
```

### Left/right review-loop diagnosis

Use this when a plan has repeated review, rework, governance, assurance, or design-freeze loops:

```text
Audit this plan for left/right contradictions.

A left/right contradiction occurs when an artefact or gate claims to close authority from the left, while also requiring evidence that can only be produced by work to its right.

For each suspected loop:
1. Identify the artefact or decision that is being asked to act as both premise and conclusion.
2. Name the left dependency: what must be true before the gate can authorise work?
3. Name the right dependency: what future evidence is being demanded before the same gate can close?
4. Decide whether this is genuine ordered learning or an unmodelled cycle.
5. If it is a cycle, propose a versioned repair such as basis v0 -> bounded probe -> basis v1 -> baseline.
6. Add an exit condition or cap if the loop is intended to be iterative.

Output: suspected contradictions, versioning repairs, and the revised dependency chain.
```

### Infinite-boundary translation for finite projects

Use this when connecting Hollom's infinite-poset boundary work to real project controls:

```text
Do not claim that the infinite theorem literally applies to this finite project. Instead, extract the project-control intuition.

Look for local patterns that can reproduce without changing kind:
- a review creates new prerequisites rather than judging a fixed version;
- a downstream deliverable is needed to approve its own upstream basis;
- an assurance forum alternates between authority and evidence roles;
- a plan treats repeated re-entry as normal governance without versioning the artefact.

Explain how the finite schedule can still exhibit an infinite-like failure mode: not mathematical infinity, but unbounded churn caused by repeatedly rebuilding the same left/right contradiction.
```

### Non-duplication note

The app tabs explain the concept visually. These prompts are for applying the concept to external schedules, conversations, and plan-review material.
