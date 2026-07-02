export function trackPageView(path: string): void {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
    keepalive: true,
  }).catch(() => {
    // Analytics is best-effort — never let a tracking failure affect the visitor.
  });
}
