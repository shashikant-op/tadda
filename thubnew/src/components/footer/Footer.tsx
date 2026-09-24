"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen, Code2, Send, Users } from "lucide-react";
import { homeService } from "@/services/home.service";
import { Branch } from "@/types";

export function Footer() {
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    homeService.getHome().then((data) => setBranches(Array.isArray(data.branches) ? data.branches : [])).catch(() => setBranches([]));
  }, []);

  return <footer className="border-t border-[var(--border)]/30 bg-white pb-8 pt-16 text-[var(--ink)]">
    <div className="site-container px-3 sm:px-6">
      <div className="grid grid-cols-1 gap-10 pb-14 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="relative flex h-8 w-8 items-center justify-center rounded bg-[var(--primary)]" aria-hidden="true"><span className="absolute left-[5px] h-5 w-4 rounded-l-sm border-2 border-r-0 border-white" /><span className="absolute right-[4px] top-[4px] text-[14px] text-white">✦</span></span>
            <span className="text-xl font-bold tracking-tight">TutorialsHub</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-[var(--body)]">Engineered for mastery. Practical tutorials and clear reference material for modern developers.</p>
          <div className="mt-6 flex gap-4 text-[var(--body)]"><Link aria-label="Browse tutorials" className="transition-colors hover:text-[var(--primary)]" href="/search"><BookOpen className="h-5 w-5" /></Link><Link aria-label="Coding courses" className="transition-colors hover:text-[var(--primary)]" href="/search"><Code2 className="h-5 w-5" /></Link><Link aria-label="Your dashboard" className="transition-colors hover:text-[var(--primary)]" href="/dashboard"><Users className="h-5 w-5" /></Link></div>
        </div>
        <div><h2 className="mb-4 font-bold">Learn</h2><ul className="space-y-2.5 text-sm text-[var(--body)]">{branches.slice(0, 4).map((branch) => <li key={branch.id || branch.slug}><Link className="transition-colors hover:text-[var(--primary)]" href={`/${branch.slug}`}>{branch.name}</Link></li>)}<li><Link className="inline-flex items-center gap-1 transition-colors hover:text-[var(--primary)]" href="/search">View all <ArrowUpRight className="h-3.5 w-3.5" /></Link></li></ul></div>
        <div><h2 className="mb-4 font-bold">Platform</h2><ul className="space-y-2.5 text-sm text-[var(--body)]"><li><Link className="transition-colors hover:text-[var(--primary)]" href="/search">Tutorials</Link></li><li><Link className="transition-colors hover:text-[var(--primary)]" href="/dashboard">Dashboard</Link></li><li><Link className="transition-colors hover:text-[var(--primary)]" href="/auth/login">Sign in</Link></li><li><Link className="transition-colors hover:text-[var(--primary)]" href="/auth/register">Create account</Link></li></ul></div>
        <div><h2 className="mb-4 font-bold">Newsletter</h2><p className="mb-4 text-xs leading-5 text-[var(--body)]">Get new tutorials and engineering notes in your inbox.</p><form className="flex gap-2"><label className="sr-only" htmlFor="footer-email">Email address</label><input id="footer-email" type="email" placeholder="Email" className="min-w-0 flex-1 rounded-lg border-0 bg-[var(--surface-container-low)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--primary)]/20" /><button type="submit" aria-label="Subscribe" className="rounded-lg bg-[var(--primary)] p-2.5 text-white transition hover:bg-[#005c3e] active:scale-95"><Send className="h-4 w-4" /></button></form></div>
      </div>
      <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--border)]/25 pt-6 text-xs text-[var(--body)] sm:flex-row"><p>© {new Date().getFullYear()} TutorialsHub. All rights reserved.</p><div className="flex gap-6"><span>Privacy Policy</span><span>Terms of Service</span><span>Security</span></div></div>
    </div>
  </footer>;
}
