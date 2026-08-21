"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Search, User as UserIcon, LogOut, Shield, ChevronDown, ChevronRight, FileText, Cpu, Layers, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth.store";
import { branchService } from "@/services/branch.service";
import { subjectService } from "@/services/subject.service";
import { tutorialService } from "@/services/tutorial.service";
import { Branch, Subject, Tutorial } from "@/types";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";

export function Navbar() {
  const router = useRouter();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [activeBranch, setActiveBranch] = useState<Branch | null>(null);
  const [subjectsMap, setSubjectsMap] = useState<Record<string, Subject[]>>({});

  // Global Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Tutorial[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const [isMounted, setIsMounted] = useState(true);
  const { user, isAuthenticated, logout, initializeAuth } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      initializeAuth();

      branchService.getBranches()
        .then((data) => {
          const list = Array.isArray(data) ? data : [];
          setBranches(list);
          if (list.length > 0) {
            setActiveBranch(list[0]);
          }
        })
        .catch(() => setBranches([]));
    }, 0);
    return () => clearTimeout(timer);
  }, [initializeAuth]);

  // Preload subjects for all branches for lightning-fast instant hover
  useEffect(() => {
    if (branches.length > 0) {
      branches.forEach((b) => {
        const bId = b.id || (b as unknown as Record<string, unknown>)._id;
        if (bId) {
          subjectService.getSubjects(bId as string)
            .then((subs) => {
              setSubjectsMap((prev) => ({ ...prev, [b.slug]: Array.isArray(subs) ? subs : [] }));
            })
            .catch(() => {});
        }
      });
    }
  }, [branches]);

  const currentSubjects = activeBranch ? (subjectsMap[activeBranch.slug] || []) : [];

  // Live Search effect with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        tutorialService.searchTutorials(searchQuery)
          .then((data) => setSearchResults(Array.isArray(data) ? data : []))
          .catch(() => setSearchResults([]))
          .finally(() => setIsSearching(false));
      } else {
        setSearchResults([]);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--canvas)]/90 backdrop-blur-xl">
      <div className="site-container flex h-16 items-center justify-between">
        {/* ================= MOBILE SECTION ================= */}
        {/* This section renders only on mobile screens (md:hidden) with logo, category link, and login section without dropdowns */}
        <div className="flex md:hidden items-center justify-between w-full">
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <img src="/logopng.png" alt="TutorialsAdda Logo" className="h-8 w-8 rounded-lg object-cover" />
            <span className="font-semibold text-xs tracking-[-.02em] text-[var(--ink)]">TutorialsAdda</span>
          </Link>

          <div className="flex items-center space-x-2.5 shrink-0">
            <ThemeSwitcher compact />
            <Link href="/search" className="text-xs font-medium text-[var(--body)] hover:text-[var(--ink)]">
              Category
            </Link>

            {isAuthenticated ? (
              <Button asChild variant="outline" size="sm" className="h-7 px-2 text-[11px] font-medium border-[var(--border)]">
                <Link href={user?.role === "admin" ? "/admin" : user?.role === "author" ? "/author/dashboard" : "/dashboard"}>
                  Dashboard
                </Link>
              </Button>
            ) : (
              <Button asChild size="sm" className="h-7 px-2.5 bg-[var(--ink)] text-[var(--primary-foreground)] hover:bg-[var(--ink)] text-[11px] font-medium">
                <Link href="/auth/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
        {/* ================= END MOBILE SECTION ================= */}

        {/* ================= DESKTOP SECTION ================= */}
        {/* Desktop Logo */}
        <div className="hidden md:flex items-center">
          <Link href="/" className="flex items-center space-x-2.5">
            <img src="/logopng.png" alt="TutorialsAdda Logo" className="h-9 w-9 rounded-[10px] object-cover" />
            <span className="font-semibold text-base tracking-[-.025em] text-[var(--ink)]">TutorialsAdda</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <div
            className="relative"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button className="flex items-center space-x-1.5 py-2 transition-colors hover:text-[var(--ink)] text-[var(--body)] font-medium">
              <Layers className="h-4 w-4 text-[var(--body)]" />
              <span>Categories</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-150 ${categoriesOpen ? "rotate-180" : ""}`} />
            </button>

            {categoriesOpen && (
              <div className="editorial-shadow absolute left-0 top-full z-50 grid w-[680px] grid-cols-12 overflow-hidden rounded-[1.2rem] border border-[var(--border)] bg-[var(--surface)] transition-all duration-200 ease-out animate-in fade-in zoom-in-95">
                {/* Left Column: Branches list */}
                <div className="col-span-4 max-h-[380px] space-y-1 overflow-y-auto border-r border-[var(--border)] bg-[var(--soft)] p-3">
                  <div className="text-[11px] font-semibold text-[var(--body)] uppercase tracking-wider px-3 py-2">
                    Branches
                  </div>
                  {branches.map((branch) => {
                    const isSelected = branch.slug === activeBranch?.slug;
                    return (
                      <div
                        key={branch.id || branch.slug}
                        onMouseEnter={() => setActiveBranch(branch)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 ${
                          isSelected
                            ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-medium shadow-sm"
                            : "hover:bg-[var(--soft)] text-[#171717]"
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 truncate">
                          <Cpu className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-[var(--primary-foreground)]" : "text-[var(--body)]"}`} />
                          <span className="text-xs truncate">{branch.name}</span>
                        </div>
                        <ChevronRight className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-[var(--primary-foreground)]" : "text-[var(--body)]"}`} />
                      </div>
                    );
                  })}
                </div>

                {/* Right Column: Expanded Subjects / Courses */}
                <div className="col-span-8 flex max-h-[380px] flex-col justify-between space-y-3 overflow-y-auto bg-[var(--surface)] p-5">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-[var(--ink)] font-semibold text-xs uppercase tracking-wider border-b border-[var(--border)] pb-2">
                      <span>{activeBranch?.name} Courses ({currentSubjects.length})</span>
                    </div>
                    <p className="text-xs text-[var(--body)]">{activeBranch?.description || "Explore technical documentation and engineering guides."}</p>

                    <div className="pt-2 space-y-1.5">
                      {currentSubjects.length === 0 ? (
                        <div className="text-xs text-[var(--body)] py-4">No subjects found for this branch.</div>
                      ) : (
                        currentSubjects.map((subject) => (
                          <Link
                            key={subject.id || subject.slug}
                            href={`/${activeBranch?.slug}/${subject.slug}`}
                            onClick={() => setCategoriesOpen(false)}
                            className="block p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--ink)] hover:shadow-sm transition-all group"
                          >
                            <div className="font-medium text-xs text-[var(--ink)] group-hover:text-[var(--ink)] flex items-center justify-between">
                              <span>{subject.name}</span>
                              <ChevronRight className="h-3.5 w-3.5 text-[var(--body)] group-hover:translate-x-1 transition-transform" />
                            </div>
                            <div className="text-[11px] text-[var(--body)] mt-0.5 line-clamp-1">{subject.description || "Structured tutorials & reference materials"}</div>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--border)] flex justify-between items-center text-xs">
                    <span className="text-[var(--body)]">Complete syllabus</span>
                    {activeBranch && (
                      <Link
                        href={`/${activeBranch.slug}`}
                        onClick={() => setCategoriesOpen(false)}
                        className="text-[var(--ink)] font-medium hover:underline"
                      >
                        View all &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href="/search" className="transition-colors hover:text-[var(--ink)] text-[var(--body)]">Search</Link>
        </nav>

        {/* Global Search Bar & Auth Actions */}
        <div className="hidden md:flex items-center space-x-3">
          <ThemeSwitcher />
          <div className="relative w-60 lg:w-72" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--body)]" />
              <Input
                placeholder="Search documentation..."
                className="h-9 w-full rounded-lg border-[var(--border)] bg-[var(--soft)]/70 pl-9 text-xs focus-visible:border-[var(--primary)] focus-visible:ring-0"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
              />
            </form>

            {/* Global Search Autocomplete Dropdown */}
            {searchOpen && searchQuery.trim() !== "" && (
              <div className="absolute top-full left-0 right-0 mt-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 shadow-xl z-50 max-h-80 overflow-y-auto space-y-1">
                <div className="text-[11px] font-semibold text-[var(--body)] px-3 py-1.5 border-b border-[var(--border)] flex justify-between">
                  <span>Results ({searchResults.length})</span>
                  {isSearching && <span>Searching...</span>}
                </div>
                {searchResults.length === 0 && !isSearching ? (
                  <div className="text-xs text-[var(--body)] p-3 text-center">No documents found matching &quot;{searchQuery}&quot;</div>
                ) : (
                  searchResults.map((tutorial) => {
                    const tutAny = tutorial as unknown as Record<string, unknown>;
                    const branchObj = tutAny.branch as Record<string, unknown> | undefined;
                    const subjectObj = tutAny.subject as Record<string, unknown> | undefined;
                    const branchSlug = typeof tutAny.branch === "object" && branchObj ? (branchObj.slug as string) : ((tutAny.branchSlug as string) || "computer-science");
                    const subjectSlug = typeof tutAny.subject === "object" && subjectObj ? (subjectObj.slug as string) : ((tutAny.subjectSlug as string) || "data-structures");
                    return (
                      <Link
                        key={tutorial.id || tutorial.slug}
                        href={`/${branchSlug}/${subjectSlug}/${tutorial.slug}`}
                        className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-[var(--surface)] transition-colors text-xs group"
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        <div className="flex items-center space-x-2.5 overflow-hidden">
                          <FileText className="h-3.5 w-3.5 text-[var(--body)] shrink-0" />
                          <div className="overflow-hidden">
                            <div className="font-medium text-[var(--ink)] truncate group-hover:underline">{tutorial.title}</div>
                            <div className="text-[11px] text-[var(--body)] truncate">{tutorial.description}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[var(--soft)] text-[var(--body)] shrink-0 ml-2">
                          {tutorial.difficulty || "Beginner"}
                        </span>
                      </Link>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {!isMounted ? (
            <div className="h-8 w-20 bg-[var(--soft)] animate-pulse rounded-md" />
          ) : isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Link href={user?.role === "admin" ? "/admin" : user?.role === "author" ? "/author/dashboard" : "/dashboard"}>
                <Button variant="outline" size="sm" className="h-8 text-xs font-medium border-[var(--border)] hover:border-[var(--ink)]">
                  {user?.role === "admin" ? <Shield className="mr-1.5 h-3.5 w-3.5 text-[var(--body)]" /> : user?.role === "author" ? <PlusCircle className="mr-1.5 h-3.5 w-3.5 text-[var(--body)]" /> : <UserIcon className="mr-1.5 h-3.5 w-3.5 text-[var(--body)]" />}
                  <span>{user?.name || "Account"}</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-[var(--body)] hover:text-[var(--ink)]" onClick={handleLogout} title="Logout">
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="h-8 text-xs font-medium text-[var(--body)] hover:text-[var(--ink)]">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="h-9 rounded-lg bg-[var(--primary)] px-4 text-xs font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary)] active:scale-[.98]">Get started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
