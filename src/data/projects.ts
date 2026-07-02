export type IconKind =
  | "roll"
  | "linkage"
  | "gearbox"
  | "spindle"
  | "bracket"
  | "cavity"
  | "fixture";

export type Review = {
  who: string;
  quote: string;
};

export type Project = {
  code: string;
  category: string;
  title: string;
  time: string;
  cost: string;
  tool: string;
  has3d: boolean;
  icon: IconKind;
  role: string;
  status: string;
  tools: string[];
  reviews: Review[];
};

export const CATEGORIES = [
  "ALL",
  "PLASTIC INJECTION",
  "REVERSE ENGINEERING",
  "ADVANCED MODELS",
  "MECHANISMS",
  "SHEET METAL",
] as const;

export const PROJECTS: Project[] = [
  {
    code: "PRJ-001",
    category: "Plastic Injection",
    title: "Replaceable Insert Seaming Roll",
    time: "96h",
    cost: "$420",
    tool: "SW2024",
    has3d: true,
    icon: "roll",
    role: "Mold Designer",
    status: "Published",
    tools: ["SolidWorks 2024", "Mold Tools", "Moldflow"],
    reviews: [
      {
        who: "R. Hassan, Mold Shop Lead",
        quote:
          "Clean parting line strategy and the insert swap logic saved real tooling cost on the second revision.",
      },
      {
        who: "A. Farouk, Production Engineer",
        quote:
          "Documentation was thorough enough that manufacturing had zero clarifying questions.",
      },
    ],
  },
  {
    code: "PRJ-002",
    category: "Mechanisms",
    title: "Dental Chair Movement Linkage",
    time: "52h",
    cost: "$0",
    tool: "SW2023",
    has3d: true,
    icon: "linkage",
    role: "Mechanism Designer",
    status: "Published",
    tools: ["SolidWorks 2023", "Motion Study"],
    reviews: [
      {
        who: "M. Adel, R&D Lead",
        quote:
          "Motion range hit spec on the first physical prototype — the linkage geometry was dead on.",
      },
      {
        who: "S. Nabil, Test Engineer",
        quote:
          "Load cases were documented clearly enough to validate without re-deriving anything.",
      },
    ],
  },
  {
    code: "PRJ-003",
    category: "Advanced Models",
    title: "6-Speed Gearbox Assembly",
    time: "70h",
    cost: "$0",
    tool: "SW2024",
    has3d: false,
    icon: "gearbox",
    role: "CAD Engineer",
    status: "Published",
    tools: ["SolidWorks 2024", "Toolbox", "GD&T"],
    reviews: [
      {
        who: "K. Osman, Instructor",
        quote:
          "One of the cleanest full assemblies I have reviewed — mates are logical and rebuild fast.",
      },
      {
        who: "D. Wael, Peer Reviewer",
        quote:
          "Gear ratios and shaft alignment all check out against the reference spec.",
      },
    ],
  },
  {
    code: "PRJ-004",
    category: "Reverse Engineering",
    title: "CNC Spindle Housing Rebuild",
    time: "38h",
    cost: "$180",
    tool: "GOM Scan",
    has3d: true,
    icon: "spindle",
    role: "Reverse Engineer",
    status: "Published",
    tools: ["GOM Scan", "SolidWorks", "Mesh2Surface"],
    reviews: [
      {
        who: "T. Ibrahim, Shop Owner",
        quote:
          "Scan-to-CAD deviation stayed under 0.1mm — the rebuilt housing dropped straight in.",
      },
      {
        who: "N. Saleh, Machinist",
        quote: "Tolerances on the bearing seats were spot on. No rework needed.",
      },
    ],
  },
  {
    code: "PRJ-005",
    category: "Sheet Metal",
    title: "Enclosure Bracket Family",
    time: "22h",
    cost: "$60",
    tool: "SW2023",
    has3d: false,
    icon: "bracket",
    role: "Sheet Metal Designer",
    status: "Published",
    tools: ["SolidWorks Sheet Metal", "DXF Export"],
    reviews: [
      {
        who: "H. Zaki, Fabricator",
        quote:
          "Flat patterns and bend allowances were correct — laser cut and folded with no adjustment.",
      },
      {
        who: "L. Amin, Buyer",
        quote:
          "The parametric family made re-sizing for the next SKU a five-minute job.",
      },
    ],
  },
  {
    code: "PRJ-006",
    category: "Plastic Injection",
    title: "Monitor Stand Core / Cavity Set",
    time: "64h",
    cost: "$310",
    tool: "SW Mold",
    has3d: true,
    icon: "cavity",
    role: "Mold Designer",
    status: "Published",
    tools: ["SolidWorks Mold Tools", "Moldflow", "DFM Review"],
    reviews: [
      {
        who: "F. Gamal, Tooling Lead",
        quote:
          "Draft and shut-off surfaces were handled correctly the first time — rare on a part this size.",
      },
      {
        who: "B. Youssef, Molder",
        quote:
          "Cooling layout was thought through; cycle time came in under estimate.",
      },
    ],
  },
  {
    code: "PRJ-007",
    category: "Mechanisms",
    title: "Rotary Indexing Fixture",
    time: "30h",
    cost: "$95",
    tool: "SW2024",
    has3d: false,
    icon: "fixture",
    role: "Mechanism Designer",
    status: "Published",
    tools: ["SolidWorks 2024", "Motion Study", "GD&T"],
    reviews: [
      {
        who: "W. Kamal, Line Engineer",
        quote:
          "Index repeatability held across a full shift — the detent design was the right call.",
      },
      {
        who: "E. Sami, Operator",
        quote:
          "Load and clamp cycle is fast and the part locates the same way every time.",
      },
    ],
  },
];

export const HERO_STATS = [
  { num: String(PROJECTS.length).padStart(2, "0"), label: "PROJECTS LOGGED" },
  { num: "342h", label: "TOTAL HOURS TRACKED" },
  { num: "4.9", label: "AVG CLIENT RATING" },
  { num: "CSWE", label: "CERTIFIED 06.2025" },
];
