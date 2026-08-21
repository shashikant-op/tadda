"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { branchService } from "@/services/branch.service";
import { Branch } from "@/types";

export function Footer() {
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    branchService.getBranches().then((data) => setBranches(Array.isArray(data) ? data : [])).catch(() => setBranches([]));
  }, []);

  return <footer className="bg-[var(--ink)] text-[var(--canvas)]">
    <div className="site-container px-5 pb-10 pt-16 sm:px-10 sm:pt-20 lg:px-14">
      <div className="grid gap-14 border-b border-white/15 pb-16 lg:grid-cols-[1.4fr_.6fr]">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-[var(--soft)]">TutorialsAdda · Engineering library</p>
          <p className="mt-8 max-w-3xl text-4xl font-medium leading-[1.05] tracking-[-.045em] sm:text-6xl">Learn enough to make your own decisions.</p>
        </div>
        <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-8 text-sm lg:pt-8">
          <div><p className="mb-5 text-xs text-[var(--soft)]">Library</p><ul className="space-y-3">{branches.slice(0, 4).map((branch) => <li key={branch.id || branch.slug}><Link className="transition-colors hover:text-[var(--soft)]" href={`/${branch.slug}`}>{branch.name}</Link></li>)}<li><Link className="transition-colors hover:text-[var(--soft)]" href="/search">Search all</Link></li></ul></div>
          <div><p className="mb-5 text-xs text-[var(--soft)]">Account</p><ul className="space-y-3"><li><Link className="transition-colors hover:text-[var(--soft)]" href="/dashboard">Dashboard</Link></li><li><Link className="transition-colors hover:text-[var(--soft)]" href="/auth/login">Sign in</Link></li><li><Link className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--soft)]" href="/auth/register">Create account <ArrowUpRight className="h-3.5 w-3.5" /></Link></li></ul></div>
        </nav>
      </div>
      <div className="flex flex-col gap-4 pt-8 text-xs text-[var(--soft)] sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} TutorialsAdda</p><div className="flex gap-6"><span>Privacy</span><span>Terms</span><span>Security</span></div></div>
    </div>
  </footer>;
}
