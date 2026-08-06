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
    <footer className="border-t border-[#E5E5E5] bg-white text-[#171717]">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand Info Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <img src="/logopng.png" alt="TutorialsAdda Logo" className="h-8 w-8 object-cover rounded-lg" />
              <span className="font-bold text-base tracking-tight text-black">TutorialsAdda</span>
            </Link>
            <p className="text-xs text-[#737373] leading-relaxed max-w-sm">
              A premium engineering knowledge platform designed for developers and students to master modern systems, algorithms, and architecture without the noise.
            </p>
          </div>

          {/* Branches Column */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-black uppercase tracking-wider">Branches</h4>
            <ul className="space-y-2.5 text-xs text-[#737373]">
              {branches.map((b) => (
                <li key={b.id || b.slug}>
                  <Link href={`/${b.slug}`} className="hover:text-black transition-colors block py-0.5">{b.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Column */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-black uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2.5 text-xs text-[#737373]">
              <li><Link href="/search" className="hover:text-black transition-colors block py-0.5">Search Documentation</Link></li>
              <li><Link href="/dashboard" className="hover:text-black transition-colors block py-0.5">Student Dashboard</Link></li>
              <li><Link href="/auth/login" className="hover:text-black transition-colors block py-0.5">Sign In</Link></li>
              <li><Link href="/auth/register" className="hover:text-black transition-colors block py-0.5">Get Started</Link></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-black uppercase tracking-wider">Legal & Security</h4>
            <ul className="space-y-2.5 text-xs text-[#737373]">
              <li><span className="hover:text-black cursor-pointer transition-colors block py-0.5">Privacy Policy</span></li>
              <li><span className="hover:text-black cursor-pointer transition-colors block py-0.5">Terms of Service</span></li>
              <li><span className="hover:text-black cursor-pointer transition-colors block py-0.5">Security Compliance</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-[#E5E5E5] pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#737373]">
          <p>&copy; {new Date().getFullYear()} TutorialsAdda Inc. All rights reserved.</p>
          <p className="mt-3 sm:mt-0 font-medium">Crafted with precision &middot; Minimal Architecture</p>
        </div>
      </div>
    </footer>
  );
}
