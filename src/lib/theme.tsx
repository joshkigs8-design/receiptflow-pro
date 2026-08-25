import { useEffect, useState } from "react";
import { Check, Sparkles } from "lucide-react";

export type ThemeMode = "light";
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
    id: "emerald",
    name: "Forest & Emerald",
    tagline: "Official Kenyan PropTech Green",
    colorHex: "#087443",
    bgHex: "from-[#063B2A] to-[#087443]",
    ringHex: "ring-[#087443]",
  },
  {
    id: "amber",
    name: "Champagne Gold & Amber",
    tagline: "Warm Luxury & Energy",
    colorHex: "#C9A227",
    bgHex: "from-[#C9A227] to-[#E5BA38]",
    ringHex: "ring-[#C9A227]",
  },
  {
    id: "sapphire",
    name: "Royal Sapphire",
    tagline: "Corporate Executive & Azure",
    colorHex: "#2563EB",
    bgHex: "from-blue-600 to-indigo-800",
    ringHex: "ring-blue-500",
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

export const themeInitScript = `(function(){try{document.documentElement.classList.remove('dark');var a=localStorage.getItem('rrp-accent')||'emerald';document.documentElement.setAttribute('data-accent',a);}catch(e){}})();`;

/**
 * Apply theme accent palette directly to document and persist in localStorage (Strict Light Mode)
 */
export function applyTheme(mode: ThemeMode = "light", accent: ThemeAccent = "emerald") {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("rrp-theme", "light");
    localStorage.setItem("rrp-accent", accent);
  } catch {
    /* ignore storage failure */
  }

  document.documentElement.classList.remove("dark");
  document.documentElement.setAttribute("data-accent", accent);
}

/**
 * Hook to access and mutate theme accent palette (Always Light Mode)
 */
export function useTheme() {
  const [mode] = useState<ThemeMode>("light");
  const [accent, setAccentState] = useState<ThemeAccent>("emerald");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const storedAccent = (localStorage.getItem("rrp-accent") as ThemeAccent) || "emerald";
      setAccentState(storedAccent);
      applyTheme("light", storedAccent);
    } catch {
      /* ignore */
    }
  }, []);

  const setMode = (_newMode: ThemeMode) => {
    applyTheme("light", accent);
  };

  const setAccent = (newAccent: ThemeAccent) => {
    setAccentState(newAccent);
    applyTheme("light", newAccent);
  };

  return {
    mode: "light" as const,
    accent,
    setMode,
    setAccent,
    mounted,
  };
}

/**
 * Clean ThemeToggle component (Hidden since site is exclusively light mode)
 */
export function ThemeToggle(_props: { className?: string }) {
  return null;
}

/**
 * ThemePicker component for Settings (Light Mode Only Accent Customization)
 */
export function ThemePicker({
  valueAccent,
  onChange,
  compact = false,
}: {
  valueMode?: string;
  valueAccent: ThemeAccent;
  onChange: (mode: "light", accent: ThemeAccent) => void;
  compact?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold text-[#4A5B53] mb-2">Select Brand Color Palette</p>
        <AccentPaletteSelector
          selected={valueAccent}
          onSelect={(accent) => onChange("light", accent)}
        />
      </div>
    </div>
  );
}
export function AccentPaletteSelector({
  selected,
  onSelect,
}: {
  selected: ThemeAccent;
  onSelect: (accent: ThemeAccent) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {ACCENT_THEMES.map((theme) => {
        const isSelected = selected === theme.id;
        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => onSelect(theme.id)}
            className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all text-left ${
              isSelected
                ? "border-[#087443] bg-[#E8F2ED] shadow-sm"
                : "border-[#E2E8E4] bg-white hover:border-[#087443]/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className="size-6 rounded-full shadow-sm shrink-0 border border-black/10"
                style={{ backgroundColor: theme.colorHex }}
              />
              <div>
                <p className="font-display font-bold text-xs text-[#101714]">
                  {theme.name}
                </p>
                <p className="text-[10px] text-[#4A5B53]">
                  {theme.tagline}
                </p>
              </div>
            </div>
            {isSelected ? (
              <span className="flex size-5 items-center justify-center rounded-full bg-[#087443] text-white">
                <Check className="size-3 stroke-[3]" />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
