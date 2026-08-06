"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { branchService } from "@/services/branch.service";
import { Branch } from "@/types";

export function Footer() {
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    branchService.getBranches()
      .then((data) => setBranches(Array.isArray(data) ? data : []))
      .catch(() => setBranches([]));
  }, []);

  return (
    <footer className="border-t border-[#E5E5E5] bg-[#FAFAFA] text-[#171717]">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-black text-white font-bold text-xs">
                TA
              </div>
              <span className="font-semibold text-sm tracking-tight text-black">TutorialsAdda</span>
            </div>
            <p className="text-xs text-[#737373] leading-relaxed">
              A premium engineering knowledge platform designed for developers and students to master modern systems.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-xs text-black uppercase tracking-wider mb-3">Branches</h4>
            <ul className="space-y-2 text-xs text-[#737373]">
              {branches.map((b) => (
                <li key={b.id || b.slug}>
                  <Link href={`/${b.slug}`} className="hover:text-black transition-colors">{b.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs text-black uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs text-[#737373]">
              <li><Link href="/search" className="hover:text-black transition-colors">Search Documentation</Link></li>
              <li><Link href="/dashboard" className="hover:text-black transition-colors">Student Dashboard</Link></li>
              <li><Link href="/auth/login" className="hover:text-black transition-colors">Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs text-black uppercase tracking-wider mb-3">Legal</h4>
            <ul className="space-y-2 text-xs text-[#737373]">
              <li><span className="hover:text-black cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-black cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-black cursor-pointer">Security</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#E5E5E5] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#737373]">
          <p>&copy; {new Date().getFullYear()} TutorialsAdda Inc. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Crafted with precision &middot; Minimal Architecture</p>
        </div>
      </div>
    </footer>
  );
}
