"use client";

import { useEffect } from "react";

export default function FullscreenManager() {
  useEffect(() => {
    const enter = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    };

    // First attempt (succeeds when browser allows autoplay-style fullscreen)
    enter();

    // Capture first user interaction to guarantee fullscreen
    const opts = { once: true, capture: true } as const;
    document.addEventListener("pointerdown", enter, opts);
    document.addEventListener("keydown", enter, opts);

    // Re-request fullscreen if the user accidentally exits (e.g. pressing Escape)
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        document.addEventListener("pointerdown", enter, { once: true, capture: true });
        document.addEventListener("keydown", enter, { once: true, capture: true });
      }
    };
    document.addEventListener("fullscreenchange", onFsChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
    };
  }, []);

  return null;
}
