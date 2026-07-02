import type { IconKind } from "@/data/projects";

const PATHS: Record<IconKind, React.ReactNode> = {
  roll: (
    <>
      <rect x={14} y={14} width={36} height={36} transform="rotate(15 32 32)" />
      <circle cx={32} cy={32} r={10} />
    </>
  ),
  linkage: (
    <>
      <polygon points="32,8 56,24 56,48 32,56 8,48 8,24" />
      <circle cx={32} cy={32} r={6} />
    </>
  ),
  gearbox: (
    <>
      <rect x={10} y={20} width={44} height={24} />
      <line x1={10} y1={32} x2={54} y2={32} />
      <circle cx={22} cy={32} r={4} />
      <circle cx={42} cy={32} r={4} />
    </>
  ),
  spindle: (
    <>
      <ellipse cx={32} cy={32} rx={22} ry={14} />
      <ellipse cx={32} cy={32} rx={22} ry={14} transform="rotate(60 32 32)" />
    </>
  ),
  bracket: (
    <>
      <path d="M10 50 L20 14 L44 14 L54 50 Z" />
      <line x1={16} y1={38} x2={48} y2={38} />
    </>
  ),
  cavity: (
    <>
      <rect x={12} y={12} width={40} height={40} rx={2} />
      <rect x={22} y={22} width={20} height={20} rx={1} />
    </>
  ),
  fixture: (
    <>
      <circle cx={32} cy={32} r={20} />
      <circle cx={32} cy={32} r={8} />
      <line x1={32} y1={4} x2={32} y2={60} />
      <line x1={4} y1={32} x2={60} y2={32} />
    </>
  ),
};

export function WireIcon({
  kind,
  opacity,
  className,
}: {
  kind: IconKind;
  opacity?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="#E8E6E0"
      strokeWidth={1}
      className={className}
      style={{ width: "100%", height: "100%", opacity }}
    >
      {PATHS[kind]}
    </svg>
  );
}
