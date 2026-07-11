import React, { useState } from "react";

export default function StandaloneExperiment({ src, title, description, allow }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="embedded-experiment">
      <div className="embedded-toolbar">
        <div>
          <span className={loaded ? "load-status ready" : "load-status"}>
            {loaded ? "Ready" : "Loading"}
          </span>
          <p>{description}</p>
        </div>
        <a href={src} target="_blank" rel="noreferrer">
          Open standalone
        </a>
      </div>
      <iframe
        className="experiment-frame"
        src={src}
        title={title}
        allow={allow}
        loading="eager"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
