"use client";

import { useEffect, useState } from "react";

export function ModelViewer({ src, alt }: { src: string; alt: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    import("@google/model-viewer").then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return <div className="viewer-hint">Loading 3D viewer…</div>;
  }

  return (
    <model-viewer
      src={src}
      alt={alt}
      camera-controls
      auto-rotate
      shadow-intensity="1"
      exposure="1"
      style={{ width: "100%", height: "100%", background: "transparent" }}
    />
  );
}
