import { useEffect, useState } from "react";
import { Check, Laptop, Moon, Sparkles, Sun } from "lucide-react";

export type ThemeMode = "light" | "dark" | "system";
export type ThemeAccent = "emerald" | "sapphire" | "amber" | "amethyst" | "slate";

export interface AccentThemeOption {
  id: ThemeAccent;
  name: string;
  tagline: string;
  colorHex: string;
  bgHex: string;
  ringHex: string;
}

export const ACCENT_THEMES: AccentThemeOption[] = [
  {
    id: "sapphire",
    name: "Royal Sapphire",
    tagline: "Corporate Executive & Azure",
    colorHex: "#2563EB",
    bgHex: "from-blue-600 to-indigo-800",
    ringHex: "ring-blue-500",
  },
  {
    id: "emerald",
    name: "Emerald Safari",
    tagline: "Kenya Green & Fintech Trust",
    colorHex: "#10B981",
    bgHex: "from-emerald-500 to-teal-700",
    ringHex: "ring-emerald-500",
  },
  {
    id: "amber",
    name: "Sunset Amber",
    tagline: "Warm Copper & Energy",
    colorHex: "#F59E0B",
    bgHex: "from-amber-500 to-orange-600",
    ringHex: "ring-amber-500",
  },
  {
    id: "amethyst",
    name: "Midnight Amethyst",
    tagline: "Luxury Boutique Purple",
    colorHex: "#8B5CF6",
    bgHex: "from-purple-600 to-pink-700",
    ringHex: "ring-purple-500",
  },
  {
    id: "slate",
    name: "Obsidian Slate",
    tagline: "Modern Monochrome Minimal",
    colorHex: "#64748B",
    bgHex: "from-slate-700 to-zinc-900",
    ringHex: "ring-slate-400",
  },
];

export const themeInitScript = `(function(){try{var m=localStorage.getItem('rrp-theme')||'system';var isDark=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',isDark);var a=localStorage.getItem('rrp-accent')||'sapphire';document.documentElement.setAttribute('data-accent',a);}catch(e){}})();`;

/**
 * Apply theme mode and accent palette directly to document and persist in localStorage
 */
export function applyTheme(mode: ThemeMode, accent: ThemeAccent) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("rrp-theme", mode);
    localStorage.setItem("rrp-accent", accent);
  } catch {
    /* ignore storage failure */
  }

  const isDark =
    mode === "dark" ||
    (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.setAttribute("data-accent", accent);
}

/**
 * Hook to access and mutate current theme mode & accent palette
 */
export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [accent, setAccentState] = useState<ThemeAccent>("sapphire");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const storedMode = (localStorage.getItem("rrp-theme") as ThemeMode) || "system";
      const storedAccent = (localStorage.getItem("rrp-accent") as ThemeAccent) || "sapphire";
      setModeState(storedMode);
      setAccentState(storedAccent);
      applyTheme(storedMode, storedAccent);
    } catch {
      /* ignore */
    }
  }, []);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  const setAccent = (newAccent: ThemeAccent) => {
    setAccentState(newAccent);
    applyTheme(mode, newAccent);
  };

  return {
    mode,
    setMode,
    accent,
    setAccent,
    mounted,
  };
}

/**
 * Navbar quick-toggle button
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { mode, setMode, mounted } = useTheme();
  const isDark =
    mode === "dark" ||
    (mode === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className={`glass inline-flex size-10 items-center justify-center rounded-full text-foreground opacity-50 ${className}`}
      >
        <Sun className="size-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setMode(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className={`glass inline-flex size-10 items-center justify-center rounded-full text-foreground transition-transform hover:scale-105 ${className}`}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

/**
 * Interactive Theme Picker Component for Sign Up & Settings pages
 */
export function ThemePicker({
  valueMode,
  valueAccent,
  onChange,
  compact = false,
}: {
  valueMode?: ThemeMode;
  valueAccent?: ThemeAccent;
  onChange?: (mode: ThemeMode, accent: ThemeAccent) => void;
  compact?: boolean;
}) {
  const { mode: currentMode, setMode, accent: currentAccent, setAccent } = useTheme();

  const selectedMode = valueMode ?? currentMode;
  const selectedAccent = valueAccent ?? currentAccent;

  const handleSelectMode = (m: ThemeMode) => {
    setMode(m);
    onChange?.(m, selectedAccent);
  };

  const handleSelectAccent = (a: ThemeAccent) => {
    setAccent(a);
    onChange?.(selectedMode, a);
  };

  return (
    <div className={`space-y-4 ${compact ? "text-xs" : ""}`}>
      {/* 1. Display Mode Picker (Light / Dark / Auto) */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
          Display Appearance
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleSelectMode("light")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-2xl border text-xs font-medium transition-all ${
              selectedMode === "light"
                ? "bg-primary/10 border-primary text-primary shadow-sm ring-1 ring-primary/40 font-bold"
                : "bg-muted/40 border-border/70 text-foreground hover:bg-muted/80"
            }`}
          >
            <Sun className="size-3.5 text-amber-500" />
            <span>Light</span>
            {selectedMode === "light" && <Check className="size-3 ml-auto text-primary" />}
          </button>

          <button
            type="button"
            onClick={() => handleSelectMode("dark")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-2xl border text-xs font-medium transition-all ${
              selectedMode === "dark"
                ? "bg-primary/10 border-primary text-primary shadow-sm ring-1 ring-primary/40 font-bold"
                : "bg-muted/40 border-border/70 text-foreground hover:bg-muted/80"
            }`}
          >
            <Moon className="size-3.5 text-indigo-400" />
            <span>Dark</span>
            {selectedMode === "dark" && <Check className="size-3 ml-auto text-primary" />}
          </button>

          <button
            type="button"
            onClick={() => handleSelectMode("system")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-2xl border text-xs font-medium transition-all ${
              selectedMode === "system"
                ? "bg-primary/10 border-primary text-primary shadow-sm ring-1 ring-primary/40 font-bold"
                : "bg-muted/40 border-border/70 text-foreground hover:bg-muted/80"
            }`}
          >
            <Laptop className="size-3.5 text-emerald-500" />
            <span>System</span>
            {selectedMode === "system" && <Check className="size-3 ml-auto text-primary" />}
          </button>
        </div>
      </div>

      {/* 2. Color Accent Palette */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            Brand Accent Palette
          </label>
          <span className="text-[11px] font-medium text-primary flex items-center gap-1">
            <Sparkles className="size-3" /> Live Preview
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ACCENT_THEMES.map((th) => {
            const isSelected = selectedAccent === th.id;
            return (
              <button
                key={th.id}
                type="button"
                onClick={() => handleSelectAccent(th.id)}
                className={`relative flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? "bg-card border-primary ring-2 ring-primary/40 shadow-sm"
                    : "bg-muted/30 border-border/60 hover:bg-muted/60"
                }`}
              >
                <div
                  className={`size-5 rounded-full bg-gradient-to-br ${th.bgHex} shadow-sm shrink-0 flex items-center justify-center`}
                  style={{ backgroundColor: th.colorHex }}
                >
                  {isSelected && <Check className="size-3 text-white stroke-[3]" />}
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-xs font-bold truncate leading-tight ${
                      isSelected ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {th.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">
                    {th.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
