export type IconKind =
  | "roll"
  | "linkage"
  | "gearbox"
  | "spindle"
  | "bracket"
  | "cavity"
  | "fixture";

export const ICON_KINDS: IconKind[] = [
  "roll",
  "linkage",
  "gearbox",
  "spindle",
  "bracket",
  "cavity",
  "fixture",
];

export type Review = {
  who: string;
  quote: string;
};

export type Project = {
  id: string;
  code: string;
  category: string;
  title: string;
  time: string;
  cost: string;
  tool: string;
  icon: IconKind;
  images: string[];
  modelUrl: string | null;
  role: string;
  status: string;
  tools: string[];
  reviews: Review[];
  sortOrder: number;
  featured: boolean;
};

export type NavLink = { label: string; anchor: string };

export type LogoPosition = "before" | "after";
export type TextDirection = "ltr" | "rtl";
export type TextAlign = "left" | "center" | "right";
export type HeroFontFamily = "default" | "arabic";

export type SiteSettings = {
  heroName: string;
  heroDisc: string;
  heroRev: string;
  heroPrefix: string;
  heroEmphasis: string;
  heroSuffix: string;
  heroLede: string;
  heroDirection: TextDirection;
  heroTextAlign: TextAlign;
  heroFontFamily: HeroFontFamily;
  heroFontSize: number;
  statHours: string;
  statRating: string;
  statCertValue: string;
  statCertLabel: string;
  colorBg: string;
  colorPanel: string;
  colorPanelHover: string;
  colorText: string;
  colorTextDim: string;
  colorAccent: string;
  colorVerified: string;
  navLinks: NavLink[];
  navCtaLabel: string;
  navCtaAnchor: string;
  logoUrl: string | null;
  logoEnabled: boolean;
  logoWidth: number;
  logoPosition: LogoPosition;
};

export type Category = {
  id: string;
  name: string;
  enabled: boolean;
  sortOrder: number;
};

export const CATEGORIES = [
  "ALL",
  "PLASTIC INJECTION",
  "REVERSE ENGINEERING",
  "ADVANCED MODELS",
  "MECHANISMS",
  "SHEET METAL",
] as const;

export const PROJECT_CATEGORY_OPTIONS = [
  "Plastic Injection",
  "Reverse Engineering",
  "Advanced Models",
  "Mechanisms",
  "Sheet Metal",
] as const;

export const DEFAULT_SETTINGS: SiteSettings = {
  heroName: "YEHIA EL MOHAMADY",
  heroDisc: "MFG / MOLD DESIGN",
  heroRev: "2026.01",
  heroPrefix: "Design work that's been ",
  heroEmphasis: "built",
  heroSuffix: ", not just rendered.",
  heroLede:
    "A working register of mold design, reverse engineering, and mechanical projects — each one with the real numbers attached: time spent, cost, and the tools used to get there.",
  heroDirection: "ltr",
  heroTextAlign: "left",
  heroFontFamily: "default",
  heroFontSize: 64,
  statHours: "342h",
  statRating: "4.9",
  statCertValue: "CSWE",
  statCertLabel: "CERTIFIED 06.2025",
  colorBg: "#0B0E11",
  colorPanel: "#1A1F26",
  colorPanelHover: "#20262E",
  colorText: "#E8E6E0",
  colorTextDim: "#6B7280",
  colorAccent: "#FF6B35",
  colorVerified: "#2DD4BF",
  navLinks: [
    { label: "Work", anchor: "work" },
    { label: "About", anchor: "about" },
    { label: "Reviews", anchor: "reviews" },
  ],
  navCtaLabel: "SCHEDULE CALL →",
  navCtaAnchor: "contact",
  logoUrl: null,
  logoEnabled: false,
  logoWidth: 28,
  logoPosition: "before",
};

export const DEFAULT_CATEGORIES: Category[] = PROJECT_CATEGORY_OPTIONS.map((name, i) => ({
  id: name,
  name,
  enabled: true,
  sortOrder: i,
}));

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "PRJ-001",
    code: "PRJ-001",
    category: "Plastic Injection",
    title: "Replaceable Insert Seaming Roll",
    time: "96h",
    cost: "$420",
    tool: "SW2024",
    icon: "roll",
    images: [],
    modelUrl: null,
    role: "Mold Designer",
    status: "Published",
    tools: ["SolidWorks 2024", "Mold Tools", "Moldflow"],
    sortOrder: 0,
    featured: true,
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
    id: "PRJ-002",
    code: "PRJ-002",
    category: "Mechanisms",
    title: "Dental Chair Movement Linkage",
    time: "52h",
    cost: "$0",
    tool: "SW2023",
    icon: "linkage",
    images: [],
    modelUrl: null,
    role: "Mechanism Designer",
    status: "Published",
    tools: ["SolidWorks 2023", "Motion Study"],
    sortOrder: 1,
    featured: true,
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
    id: "PRJ-003",
    code: "PRJ-003",
    category: "Advanced Models",
    title: "6-Speed Gearbox Assembly",
    time: "70h",
    cost: "$0",
    tool: "SW2024",
    icon: "gearbox",
    images: [],
    modelUrl: null,
    role: "CAD Engineer",
    status: "Published",
    tools: ["SolidWorks 2024", "Toolbox", "GD&T"],
    sortOrder: 2,
    featured: true,
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
    id: "PRJ-004",
    code: "PRJ-004",
    category: "Reverse Engineering",
    title: "CNC Spindle Housing Rebuild",
    time: "38h",
    cost: "$180",
    tool: "GOM Scan",
    icon: "spindle",
    images: [],
    modelUrl: null,
    role: "Reverse Engineer",
    status: "Published",
    tools: ["GOM Scan", "SolidWorks", "Mesh2Surface"],
    sortOrder: 3,
    featured: false,
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
    id: "PRJ-005",
    code: "PRJ-005",
    category: "Sheet Metal",
    title: "Enclosure Bracket Family",
    time: "22h",
    cost: "$60",
    tool: "SW2023",
    icon: "bracket",
    images: [],
    modelUrl: null,
    role: "Sheet Metal Designer",
    status: "Published",
    tools: ["SolidWorks Sheet Metal", "DXF Export"],
    sortOrder: 4,
    featured: false,
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
    id: "PRJ-006",
    code: "PRJ-006",
    category: "Plastic Injection",
    title: "Monitor Stand Core / Cavity Set",
    time: "64h",
    cost: "$310",
    tool: "SW Mold",
    icon: "cavity",
    images: [],
    modelUrl: null,
    role: "Mold Designer",
    status: "Published",
    tools: ["SolidWorks Mold Tools", "Moldflow", "DFM Review"],
    sortOrder: 5,
    featured: false,
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
    id: "PRJ-007",
    code: "PRJ-007",
    category: "Mechanisms",
    title: "Rotary Indexing Fixture",
    time: "30h",
    cost: "$95",
    tool: "SW2024",
    icon: "fixture",
    images: [],
    modelUrl: null,
    role: "Mechanism Designer",
    status: "Published",
    tools: ["SolidWorks 2024", "Motion Study", "GD&T"],
    sortOrder: 6,
    featured: false,
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
