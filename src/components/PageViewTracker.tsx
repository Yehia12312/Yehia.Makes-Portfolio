"use client";

import { useEffect } from "react";
import { trackPageView } from "@/lib/track";

export function PageViewTracker() {
  useEffect(() => {
    trackPageView(window.location.pathname || "/");
  }, []);
  return null;
}
