// lib/design-tokens.ts

export const SECTION_TOKENS = {
    football: {
    accent: "#10b981",
    className: "section-football",
    label: "Football",
    icon: "⚽",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    glow: "rgba(16, 185, 129, 0.08)",
    via: "via-emerald-500/25",
  },
  tennis: {
    accent: "#f59e0b",
    className: "section-tennis",
    label: "Tennis",
    icon: "🎾",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    glow: "rgba(245, 158, 11, 0.08)",
    via: "via-amber-500/25",
  },
  f1: {
    accent: "#ef4444",
    className: "section-f1",
    label: "Formula 1",
    icon: "🏎️",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400",
    glow: "rgba(239, 68, 68, 0.08)",
    via: "via-red-500/25",
  },
  watching: {
    accent: "#8b5cf6",
    className: "section-watching",
    label: "Watching",
    icon: "🎬",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    text: "text-violet-400",
    glow: "rgba(139, 92, 246, 0.08)",
    via: "via-violet-500/25",
  },
  books: {
    accent: "#f97316",
    className: "section-books",
    label: "Books",
    icon: "📚",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    text: "text-orange-400",
    glow: "rgba(249, 115, 22, 0.08)",
    via: "via-orange-500/25",
  },
  travel: {
    accent: "#0ea5e9",
    className: "section-travel",
    label: "Travel",
    icon: "✈️",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    text: "text-sky-400",
    glow: "rgba(14, 165, 233, 0.08)",
    via: "via-sky-500/25",
  },
  fitness: {
    accent: "#f43f5e",
    className: "section-fitness",
    label: "Fitness",
    icon: "💪",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    text: "text-rose-400",
    glow: "rgba(244, 63, 94, 0.08)",
    via: "via-rose-500/25",
  },

    tasks: {
    accent: "#6366f1",
    className: "section-tasks",
    label: "Tasks",
    icon: "✅",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    text: "text-indigo-400",
    glow: "rgba(99, 102, 241, 0.08)",
    via: "via-indigo-500/25",
  },
  goals: {
    accent: "#22c55e",
    className: "section-goals",
    label: "Goals",
    icon: "🎯",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    text: "text-green-400",
    glow: "rgba(34, 197, 94, 0.08)",
    via: "via-green-500/25",
  },
  jobhunt: {
    accent: "#3b82f6",
    className: "section-jobhunt",
    label: "Job Hunt",
    icon: "💼",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    glow: "rgba(59, 130, 246, 0.08)",
    via: "via-blue-500/25",
  },
  tech: {
    accent: "#a855f7",
    className: "section-tech",
    label: "Tech",
    icon: "💻",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
    glow: "rgba(168, 85, 247, 0.08)",
    via: "via-purple-500/25",
  },
} as const;

export type SectionKey = keyof typeof SECTION_TOKENS;

// nav structure

export const NAV_STRUCTURE = {
  perso: {
    label: "Perso",
    items: [
      { key: "sport", label: "Sport", icon: "🏆", href: "/perso/sports", children: [
        { key: "football", ...SECTION_TOKENS.football, href: "/perso/sports/football" },
        { key: "tennis",   ...SECTION_TOKENS.tennis,   href: "/perso/sports/tennis"   },
        { key: "f1",       ...SECTION_TOKENS.f1,       href: "/perso/sports/f1"       },
      ]},
      { key: "watching", ...SECTION_TOKENS.watching, href: "/perso/watching" },
      { key: "books",    ...SECTION_TOKENS.books,    href: "/perso/books"    },
      { key: "travel",   ...SECTION_TOKENS.travel,   href: "/perso/travel"   },
      { key: "fitness",  ...SECTION_TOKENS.fitness,  href: "/perso/fitness"  },
    ],
  },
  pro: {
    label: "Pro",
    items: [
      { key: "tasks",    ...SECTION_TOKENS.tasks,    href: "/pro/tasks"    },
      { key: "goals",    ...SECTION_TOKENS.goals,    href: "/pro/goals"    },
      { key: "jobhunt",  ...SECTION_TOKENS.jobhunt,  href: "/pro/jobhunt"  },
      { key: "tech",     ...SECTION_TOKENS.tech,     href: "/pro/tech"     },
    ],
  },
} as const;

// ui constants

export const UI = {
  // Sidebar
  sidebar: {
    widthExpanded: "240px",
    widthCollapsed: "64px",
  },
  // Transitions
  transition: {
    fast: "150ms ease",
    default: "200ms ease",
    slow: "300ms ease",
    spring: "type: spring, bounce: 0.2, duration: 0.35",
  },
  // Card defaults
  card: {
    base: "bg-zinc-950 border border-zinc-800/60 rounded-2xl",
    hover: "hover:border-zinc-700/80 transition-all duration-300",
  },
} as const;