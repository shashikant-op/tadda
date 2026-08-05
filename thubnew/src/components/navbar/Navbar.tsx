"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Search, Menu, X, User as UserIcon, LogOut, Shield, ChevronDown, ChevronRight, FileText, Cpu, Layers, Sparkles, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth.store";
import { branchService } from "@/services/branch.service";
import { subjectService } from "@/services/subject.service";
import { tutorialService } from "@/services/tutorial.service";
import { Branch, Subject, Tutorial } from "@/types";

export function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [activeBranch, setActiveBranch] = useState<Branch | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Global Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Tutorial[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const [isMounted, setIsMounted] = useState(false);
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

  useEffect(() => {
    if (activeBranch) {
      const bId = activeBranch.id || (activeBranch as unknown as Record<string, unknown>)._id;
      if (bId) {
        subjectService.getSubjects(bId as string)
          .then((subs) => setSubjects(Array.isArray(subs) ? subs : []))
          .catch(() => setSubjects([]));
      }
    }
  }, [activeBranch]);

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
    <header className="sticky top-2  z-50 mr-8  ml-8 rounded-full   glossy-nav">
      <div className="container mx-auto flex h-12 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xl shadow-md">
            TA
          </div>
          <span className="font-bold text-xl tracking-tight">TutorialsAdda</span>
        </Link>

        {/* Desktop Navigation with Glossy Transparent Split-Panel Dropdown */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <div
            className="relative"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button className="flex items-center space-x-1.5 py-2 transition-colors hover:text-primary font-medium">
              <Layers className="h-4 w-4 text-primary" />
              <span>Categories</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${categoriesOpen ? "rotate-180" : ""}`} />
            </button>

            {categoriesOpen && (
              <div className="absolute top-full left-0 w-[720px] rounded-2xl border border-white/20 dark:border-white/10 bg-background/92 backdrop-blur-2xl shadow-2xl z-50 grid grid-cols-12 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
                {/* Left Column: Branches list */}
                <div className="col-span-5 border-r border-white/10 bg-muted/20 p-3 space-y-1 max-h-[400px] overflow-y-auto">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                    Branches ({branches.length})
                  </div>
                  {branches.map((branch) => {
                    const isSelected = branch.slug === activeBranch?.slug;
                    return (
                      <div
                        key={branch.id || branch.slug}
                        onMouseEnter={() => setActiveBranch(branch)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                          isSelected
                            ? "bg-primary text-primary-foreground font-semibold shadow-md"
                            : "hover:bg-muted/50 text-foreground"
                        }`}
                      >
                        <div className="flex items-center space-x-3 truncate">
                          <Cpu className={`h-4 w-4 shrink-0 ${isSelected ? "text-primary-foreground" : "text-primary"}`} />
                          <span className="text-sm truncate">{branch.name}</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 shrink-0 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      </div>
                    );
                  })}
                </div>

                {/* Right Column: Expanded Subjects / Courses */}
                <div className="col-span-7 p-6 space-y-4 bg-background/60 backdrop-blur-md flex flex-col justify-between max-h-[400px] overflow-y-auto">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-primary font-bold text-sm">
                      <Sparkles className="h-4 w-4" />
                      <span>{activeBranch?.name} Courses ({subjects.length})</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{activeBranch?.description || "Explore engineering subjects and tutorials."}</p>

                    <div className="pt-2 space-y-2">
                      {subjects.length === 0 ? (
                        <div className="text-xs text-muted-foreground py-4">No subjects found for this branch.</div>
                      ) : (
                        subjects.map((subject) => (
                          <Link
                            key={subject.id || subject.slug}
                            href={`/${activeBranch?.slug}/${subject.slug}`}
                            onClick={() => setCategoriesOpen(false)}
                            className="block p-3 rounded-xl border border-white/10 bg-card/50 hover:border-primary hover:bg-primary/10 transition-all group shadow-sm"
                          >
                            <div className="font-semibold text-sm group-hover:text-primary flex items-center justify-between">
                              <span>{subject.name}</span>
                              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">{subject.description || "Explore structured tutorials & quizzes"}</div>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Looking for more?</span>
                    {activeBranch && (
                      <Link
                        href={`/${activeBranch.slug}`}
                        onClick={() => setCategoriesOpen(false)}
                        className="text-primary font-semibold hover:underline"
                      >
                        View all in {activeBranch.name} &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Global Search Bar & Auth Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative w-64 lg:w-80" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tutorials, algorithms..."
                className="pl-9 h-9 w-full text-sm bg-background/60 backdrop-blur-md border-white/20 shadow-sm"
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
              <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-white/25 bg-background/95 backdrop-blur-2xl p-2 shadow-2xl z-50 max-h-96 overflow-y-auto space-y-1">
                <div className="text-xs font-semibold text-muted-foreground px-3 py-1 border-b border-white/10 flex justify-between">
                  <span>Search Results ({searchResults.length})</span>
                  {isSearching && <span>Searching database...</span>}
                </div>
                {searchResults.length === 0 && !isSearching ? (
                  <div className="text-xs text-muted-foreground p-4 text-center">No tutorials found matching &quot;{searchQuery}&quot;</div>
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
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-primary/10 transition-colors text-sm group"
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <FileText className="h-4 w-4 text-primary shrink-0" />
                          <div className="overflow-hidden">
                            <div className="font-medium truncate group-hover:text-primary">{tutorial.title}</div>
                            <div className="text-xs text-muted-foreground truncate">{tutorial.description}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-muted uppercase text-muted-foreground shrink-0 ml-2">
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
            <div className="h-9 w-24 bg-muted animate-pulse rounded-md" />
          ) : isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <Link href={user?.role === "admin" ? "/admin" : user?.role === "author" ? "/author/dashboard" : "/dashboard"}>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  {user?.role === "admin" ? <Shield className="h-4 w-4 text-primary" /> : user?.role === "author" ? <PlusCircle className="h-4 w-4 text-primary" /> : <UserIcon className="h-4 w-4 text-primary" />}
                  <span>{user?.name || "Account"}</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-background p-4 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            <div className="font-semibold text-xs text-muted-foreground uppercase px-2">Branches</div>
            {branches.map((b) => (
              <Link
                key={b.slug}
                href={`/${b.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted"
              >
                {b.name}
              </Link>
            ))}
          </div>
          <div className="pt-2 border-t flex flex-col space-y-2">
            {!isMounted ? (
              <div className="h-9 w-full bg-muted animate-pulse rounded-md" />
            ) : isAuthenticated ? (
              <>
                <Link href={user?.role === "admin" ? "/admin" : user?.role === "author" ? "/author/dashboard" : "/dashboard"} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">Dashboard</Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
