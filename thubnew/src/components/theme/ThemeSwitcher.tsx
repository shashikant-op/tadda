"use client";

import { Check, ChevronDown, Palette } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type ThemeName = "quiet" | "fresh" | "night";

const themes: Array<{ id: ThemeName; name: string; description: string; colors: string[] }> = [
  { id: "quiet", name: "Quiet Focus", description: "Calm and grounded", colors: ["#F6F3EA", "#285540", "#B97A34"] },
  { id: "fresh", name: "Fresh Momentum", description: "Bright and motivating", colors: ["#F4F8F5", "#177A55", "#F2B84B"] },
  { id: "night", name: "Night Owl", description: "Cozy and low-glare", colors: ["#111713", "#72C89A", "#E0A85A"] },
];

function applyTheme(theme: ThemeName) {
  document.documentElement.classList.add("theme-changing");
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme === "night" ? "dark" : "light";
  localStorage.setItem("tutorialsadda-theme", theme);
  window.setTimeout(() => document.documentElement.classList.remove("theme-changing"), 220);
}

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<ThemeName>("quiet");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const active = document.documentElement.dataset.theme as ThemeName | undefined;
    const frame = requestAnimationFrame(() => {
      if (active && themes.some((item) => item.id === active)) setTheme(active);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  const chooseTheme = (nextTheme: ThemeName) => {
    setTheme(nextTheme);
    applyTheme(nextTheme);
    setOpen(false);
  };

  const activeTheme = themes.find((item) => item.id === theme) ?? themes[0];

  return <div ref={rootRef} className="relative">
    <button
      type="button"
      aria-label={`Change theme. Current theme: ${activeTheme.name}`}
      aria-haspopup="listbox"
      aria-expanded={open}
      onClick={() => setOpen((value) => !value)}
      className="flex h-8 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 text-xs font-medium text-[var(--ink)] shadow-sm transition hover:border-[var(--primary)] focus-visible:outline-none"
    >
      <Palette className="h-3.5 w-3.5 text-[var(--primary)]" />
      {!compact && <span>{activeTheme.name}</span>}
      <ChevronDown className={`h-3 w-3 text-[var(--body)] transition-transform ${open ? "rotate-180" : ""}`} />
    </button>

    {open && <div role="listbox" aria-label="Website theme" className="editorial-shadow absolute right-0 top-[calc(100%+.5rem)] z-[70] w-64 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2">
      <div className="px-2 pb-2 pt-1 font-mono text-[9px] uppercase tracking-[.14em] text-[var(--body)]">Choose your study mood</div>
      {themes.map((item) => <button
        key={item.id}
        type="button"
        role="option"
        aria-selected={theme === item.id}
        onClick={() => chooseTheme(item.id)}
        className="group flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors hover:bg-[var(--soft)]"
      >
        <span className="flex overflow-hidden rounded-full border border-[var(--border)]">
          {item.colors.map((color) => <span key={color} className="h-6 w-3" style={{ backgroundColor: color }} />)}
        </span>
        <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-[var(--ink)]">{item.name}</span><span className="mt-0.5 block text-[10px] text-[var(--body)]">{item.description}</span></span>
        <Check className={`h-4 w-4 text-[var(--primary)] ${theme === item.id ? "opacity-100" : "opacity-0"}`} />
      </button>)}
    </div>}
  </div>;
}
