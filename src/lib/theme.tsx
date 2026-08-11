import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export const themeInitScript = `(function(){try{var t=localStorage.getItem('rrp-theme')||'light';document.documentElement.classList.toggle('dark',t==='dark');}catch(e){document.documentElement.classList.remove('dark');}})();`;

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("rrp-theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle colour theme"
      className={`glass inline-flex size-10 items-center justify-center rounded-full text-foreground transition-transform hover:scale-105 ${className}`}
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}