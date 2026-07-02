import type { SiteSettings } from "@/data/projects";

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

function safeColor(value: string, fallback: string): string {
  return HEX_COLOR.test(value) ? value : fallback;
}

export function buildColorOverrideCss(settings: SiteSettings): string {
  return `:root {
  --bg: ${safeColor(settings.colorBg, "#0B0E11")};
  --panel: ${safeColor(settings.colorPanel, "#1A1F26")};
  --panel-hover: ${safeColor(settings.colorPanelHover, "#20262E")};
  --text: ${safeColor(settings.colorText, "#E8E6E0")};
  --text-dim: ${safeColor(settings.colorTextDim, "#6B7280")};
  --accent: ${safeColor(settings.colorAccent, "#FF6B35")};
  --verified: ${safeColor(settings.colorVerified, "#2DD4BF")};
}`;
}
