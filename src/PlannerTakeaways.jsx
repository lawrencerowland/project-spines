import React from "react";

const sliceSteps = [
  {
    label: "1. Strip to hard precedence",
    body: "Ignore dates, float, preferred sequencing, and resource wishful thinking. Keep only the must-finish-before logic."
  },
  {
    label: "2. Name the spine anchors",
    body: "Place each activity between a left anchor it depends on and a right anchor it must feed. If left is not before right, the plan is hiding a contradiction."
  },
  {
    label: "3. Rebuild the slices",
    body: "For each planned period or control gate, ask whether the tasks in the bucket are pairwise incomparable. If one waits for another, it is a chain pretending to be a slice."
  },
  {
    label: "4. Test the spine certificate",
    body: "A candidate spine becomes useful when the proposed antichain partition makes it visible in every slice. That does not prove resources, but it does prove the topology is honest."
  }
];

const reviewFlags = [
  "A gate claims to close the left-hand baseline but needs evidence that only appears after the gate.",
  "The same artefact is both the authority to start work and the output of that work.",
  "Review comments repeatedly redefine what would have counted as ready, rather than judging a fixed version.",
  "A loop is described as learning, but no version number, cap, or exit condition changes the dependency graph."
];

function SpineSliceSketch() {
  const spine = [
    { id: "S0", x: 54 },
    { id: "S1", x: 176 },
    { id: "S2", x: 298 },
    { id: "S3", x: 420 },
    { id: "S4", x: 542 }
  ];
  const sliceNodes = [
    { id: "A", x: 176, y: 74, good: true },
    { id: "B", x: 176, y: 130, good: true },
    { id: "C", x: 298, y: 70, good: true },
    { id: "D", x: 298, y: 128, good: true },
    { id: "E", x: 420, y: 72, good: false },
    { id: "F", x: 420, y: 130, good: false }
  ];
  return (
    <svg className="takeaway-sketch" viewBox="0 0 600 196" role="img" aria-labelledby="sliceSketchTitle sliceSketchDesc">
      <title id="sliceSketchTitle">Spine anchors and antichain slices</title>
      <desc id="sliceSketchDesc">A spine runs left to right. Two early vertical slices are valid antichains. The final slice is marked because one activity depends on another inside the same bucket.</desc>
      <defs>
        <marker id="takeaway-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="#7b4852" />
        </marker>
      </defs>
      {[176, 298, 420].map((x, index) => (
        <rect key={x} x={x - 48} y="38" width="96" height="116" rx="10" className={index === 2 ? "slice-band bad" : "slice-band"} />
      ))}
      {spine.slice(0, -1).map((node, index) => (
        <line key={node.id} x1={node.x + 17} y1="170" x2={spine[index + 1].x - 17} y2="170" className="spine-line" markerEnd="url(#takeaway-arrow)" />
      ))}
      {spine.map(node => (
        <g key={node.id}>
          <circle cx={node.x} cy="170" r="17" className="spine-node" />
          <text x={node.x} y="174" textAnchor="middle">{node.id}</text>
        </g>
      ))}
      {sliceNodes.map(node => (
        <g key={node.id}>
          <rect x={node.x - 23} y={node.y - 17} width="46" height="34" rx="7" className={node.good ? "slice-node" : "slice-node warn"} />
          <text x={node.x} y={node.y + 4} textAnchor="middle">{node.id}</text>
        </g>
      ))}
      <line x1="397" y1="72" x2="397" y2="124" className="bad-edge" markerEnd="url(#takeaway-arrow)" />
      <text x="300" y="24" textAnchor="middle" className="sketch-label">Same-period buckets only count when the tasks are incomparable</text>
      <text x="420" y="178" textAnchor="middle" className="sketch-note">fake slice</text>
    </svg>
  );
}

function LoopSketch() {
  return (
    <svg className="takeaway-sketch" viewBox="0 0 600 230" role="img" aria-labelledby="loopSketchTitle loopSketchDesc">
      <title id="loopSketchTitle">Left and right review-loop contradiction</title>
      <desc id="loopSketchDesc">An approval depends on future evidence in the bad model. The repaired model versions the artefact into a probe and baseline.</desc>
      <defs>
        <marker id="loop-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="#5f6975" />
        </marker>
      </defs>
      <text x="70" y="25" className="sketch-label">Contradiction</text>
      <rect x="46" y="48" width="110" height="42" rx="8" className="loop-node authority" />
      <text x="101" y="73" textAnchor="middle">Approve basis</text>
      <rect x="230" y="48" width="112" height="42" rx="8" className="loop-node work" />
      <text x="286" y="73" textAnchor="middle">Design work</text>
      <rect x="420" y="48" width="112" height="42" rx="8" className="loop-node evidence" />
      <text x="476" y="73" textAnchor="middle">Evidence</text>
      <line x1="156" y1="69" x2="230" y2="69" className="loop-edge" markerEnd="url(#loop-arrow)" />
      <line x1="342" y1="69" x2="420" y2="69" className="loop-edge" markerEnd="url(#loop-arrow)" />
      <path d="M476 91 C476 130 102 130 102 93" className="loop-edge bad" markerEnd="url(#loop-arrow)" />
      <text x="294" y="145" textAnchor="middle" className="sketch-note">The gate needs something from its own future.</text>

      <text x="70" y="181" className="sketch-label">Repair</text>
      <rect x="148" y="192" width="84" height="30" rx="7" className="loop-node authority" />
      <text x="190" y="212" textAnchor="middle">basis v0</text>
      <rect x="258" y="192" width="84" height="30" rx="7" className="loop-node work" />
      <text x="300" y="212" textAnchor="middle">probe</text>
      <rect x="368" y="192" width="84" height="30" rx="7" className="loop-node evidence" />
      <text x="410" y="212" textAnchor="middle">basis v1</text>
      <line x1="232" y1="207" x2="258" y2="207" className="loop-edge" markerEnd="url(#loop-arrow)" />
      <line x1="342" y1="207" x2="368" y2="207" className="loop-edge" markerEnd="url(#loop-arrow)" />
    </svg>
  );
}

export function SliceAuditTakeaway() {
  return (
    <div className="takeaway-view">
      <div className="takeaway-hero">
        <div>
          <p className="takeaway-kicker">Planner intuition pump</p>
          <h2>Validate the claimed concurrency, not just the critical path.</h2>
          <p>
            The applied move from Dilworth/Mirsky/Hollom is to treat the schedule as a partial order and then ask whether the plan survives being reassembled as spine-respecting antichain slices.
          </p>
        </div>
        <SpineSliceSketch />
      </div>

      <section className="takeaway-band">
        <h3>The missing judgement habit</h3>
        <p>
          A senior planner already knows how to challenge path logic. The extra habit is to challenge the parallel surface: a calendar bucket, sprint, phase window, or assurance period is not a slice until every pair of activities inside it is incomparable in the hard dependency logic.
        </p>
      </section>

      <section className="takeaway-steps" aria-label="Antichain audit steps">
        {sliceSteps.map(step => (
          <article key={step.label}>
            <h3>{step.label}</h3>
            <p>{step.body}</p>
          </article>
        ))}
      </section>

      <section className="takeaway-dialogue">
        <h3>How I would say it to a senior controls lead</h3>
        <p>
          "Your CPM review asks whether the plan has a credible driving chain. Good. Now run the dual review: take each claimed period of parallel work and prove it is really an antichain. If two activities in the same bucket have a hard dependency between them, the schedule is borrowing concurrency it does not own."
        </p>
        <p>
          "Then anchor each activity to the spine. What must already be true on the left before this work can start, and what must this work make true on the right? The clean activities sit between those anchors. The suspect ones reach backwards and forwards at the same time."
        </p>
      </section>
    </div>
  );
}

export function ReviewLoopTakeaway() {
  return (
    <div className="takeaway-view loop-view">
      <div className="takeaway-hero compact">
        <div>
          <p className="takeaway-kicker">Loop diagnosis</p>
          <h2>Find the left/right contradiction before it becomes schedule churn.</h2>
          <p>
            The infinite results do not transfer literally to a finite project. The useful project-control reading is the repeating dependency pattern: a thing claims authority from the left while needing evidence from the right.
          </p>
        </div>
        <LoopSketch />
      </div>

      <section className="takeaway-band">
        <h3>The finite-project translation</h3>
        <p>
          Real projects end, but they can still recreate the same local obstruction: approval depends on downstream evidence, downstream work depends on approval, and the review forum calls the alternation normal governance. That is not yet a schedule. It is an unresolved dependency model.
        </p>
      </section>

      <section className="takeaway-steps flags" aria-label="Review-loop warning signs">
        {reviewFlags.map(flag => (
          <article key={flag}>
            <h3>Warning sign</h3>
            <p>{flag}</p>
          </article>
        ))}
      </section>

      <section className="takeaway-dialogue">
        <h3>The control move</h3>
        <p>
          Split the artefact. "Basis v0" authorises a bounded probe. The probe produces evidence. "Basis v1" becomes the baseline. This turns a contradiction into a chain and gives the slice audit something honest to validate.
        </p>
        <p>
          The question for the planner is not "is there a review loop?" It is "has this loop been versioned into ordered learning, or is the same unnamed deliverable being asked to be both premise and conclusion?"
        </p>
      </section>
    </div>
  );
}
