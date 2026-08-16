"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Search, Menu, X, User as UserIcon, LogOut, Shield, ChevronDown, ChevronRight, FileText, Cpu, Layers, PlusCircle } from "lucide-react";
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
      if (!activeBranch) {
        setActiveBranch(branches[0]);
      }
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
    <header className="sticky top-0 z-50 w-full border-b border-[#E5E5E5] bg-white/90 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ================= MOBILE SECTION ================= */}
        {/* This section renders only on mobile screens (md:hidden) with logo, category link, and login section without dropdowns */}
        <div className="flex md:hidden items-center justify-between w-full">
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <img src="/logopng.png" alt="TutorialsAdda Logo" className="h-7 w-7 object-cover rounded" />
            <span className="font-semibold text-xs tracking-tight text-black truncate max-w-[120px]">TutorialsAdda</span>
          </Link>

          <div className="flex items-center space-x-2.5 shrink-0">
            <Link href={branches.length > 0 ? `/${branches[0].slug}` : "/search"} className="text-xs font-medium text-[#525252] hover:text-black">
              Category
            </Link>

            {isAuthenticated ? (
              <Button asChild variant="outline" size="sm" className="h-7 px-2 text-[11px] font-medium border-[#E5E5E5]">
                <Link href={user?.role === "admin" ? "/admin" : user?.role === "author" ? "/author/dashboard" : "/dashboard"}>
                  Dashboard
                </Link>
              </Button>
            ) : (
              <Button asChild size="sm" className="h-7 px-2.5 bg-black text-white hover:bg-[#262626] text-[11px] font-medium">
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
            <img src="/logopng.png" alt="TutorialsAdda Logo" className="h-8 w-8 object-cover rounded" />
            <span className="font-semibold text-base tracking-tight text-black">TutorialsAdda</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <div
            className="relative"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button className="flex items-center space-x-1.5 py-2 transition-colors hover:text-black text-[#525252] font-medium">
              <Layers className="h-4 w-4 text-[#525252]" />
              <span>Categories</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-150 ${categoriesOpen ? "rotate-180" : ""}`} />
            </button>

            {categoriesOpen && (
              <div className="absolute top-full left-0 w-[680px] rounded-xl border border-[#E5E5E5] bg-white shadow-xl z-50 grid grid-cols-12 overflow-hidden transition-all duration-200 ease-out animate-in fade-in zoom-in-95">
                {/* Left Column: Branches list */}
                <div className="col-span-4 border-r border-[#E5E5E5] bg-[#FAFAFA] p-3 space-y-1 max-h-[380px] overflow-y-auto">
                  <div className="text-[11px] font-semibold text-[#737373] uppercase tracking-wider px-3 py-2">
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
                            ? "bg-black text-white font-medium shadow-sm"
                            : "hover:bg-[#F0F0F0] text-[#171717]"
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 truncate">
                          <Cpu className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-white" : "text-[#737373]"}`} />
                          <span className="text-xs truncate">{branch.name}</span>
                        </div>
                        <ChevronRight className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-white" : "text-[#A3A3A3]"}`} />
                      </div>
                    );
                  })}
                </div>

                {/* Right Column: Expanded Subjects / Courses */}
                <div className="col-span-8 p-5 space-y-3 bg-white flex flex-col justify-between max-h-[380px] overflow-y-auto">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-black font-semibold text-xs uppercase tracking-wider border-b border-[#E5E5E5] pb-2">
                      <span>{activeBranch?.name} Courses ({currentSubjects.length})</span>
                    </div>
                    <p className="text-xs text-[#737373]">{activeBranch?.description || "Explore technical documentation and engineering guides."}</p>

                    <div className="pt-2 space-y-1.5">
                      {currentSubjects.length === 0 ? (
                        <div className="text-xs text-[#737373] py-4">No subjects found for this branch.</div>
                      ) : (
                        currentSubjects.map((subject) => (
                          <Link
                            key={subject.id || subject.slug}
                            href={`/${activeBranch?.slug}/${subject.slug}`}
                            onClick={() => setCategoriesOpen(false)}
                            className="block p-2.5 rounded-lg border border-[#E5E5E5] bg-white hover:border-black hover:shadow-sm transition-all group"
                          >
                            <div className="font-medium text-xs text-black group-hover:text-black flex items-center justify-between">
                              <span>{subject.name}</span>
                              <ChevronRight className="h-3.5 w-3.5 text-[#A3A3A3] group-hover:translate-x-1 transition-transform" />
                            </div>
                            <div className="text-[11px] text-[#737373] mt-0.5 line-clamp-1">{subject.description || "Structured tutorials & reference materials"}</div>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E5E5E5] flex justify-between items-center text-xs">
                    <span className="text-[#737373]">Complete syllabus</span>
                    {activeBranch && (
                      <Link
                        href={`/${activeBranch.slug}`}
                        onClick={() => setCategoriesOpen(false)}
                        className="text-black font-medium hover:underline"
                      >
                        View all &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href="/search" className="transition-colors hover:text-black text-[#525252]">Search</Link>
        </nav>

        {/* Global Search Bar & Auth Actions */}
        <div className="hidden md:flex items-center space-x-3">
          <div className="relative w-60 lg:w-72" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#737373]" />
              <Input
                placeholder="Search documentation..."
                className="pl-9 h-9 w-full text-xs bg-[#FAFAFA] border-[#E5E5E5] focus-visible:ring-0 focus-visible:border-black"
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
              <div className="absolute top-full left-0 right-0 mt-1.5 rounded-lg border border-[#E5E5E5] bg-white p-2 shadow-xl z-50 max-h-80 overflow-y-auto space-y-1">
                <div className="text-[11px] font-semibold text-[#737373] px-3 py-1.5 border-b border-[#E5E5E5] flex justify-between">
                  <span>Results ({searchResults.length})</span>
                  {isSearching && <span>Searching...</span>}
                </div>
                {searchResults.length === 0 && !isSearching ? (
                  <div className="text-xs text-[#737373] p-3 text-center">No documents found matching &quot;{searchQuery}&quot;</div>
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
                        className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-[#FAFAFA] transition-colors text-xs group"
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        <div className="flex items-center space-x-2.5 overflow-hidden">
                          <FileText className="h-3.5 w-3.5 text-[#737373] shrink-0" />
                          <div className="overflow-hidden">
                            <div className="font-medium text-black truncate group-hover:underline">{tutorial.title}</div>
                            <div className="text-[11px] text-[#737373] truncate">{tutorial.description}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#F0F0F0] text-[#525252] shrink-0 ml-2">
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
            <div className="h-8 w-20 bg-[#F0F0F0] animate-pulse rounded-md" />
          ) : isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Link href={user?.role === "admin" ? "/admin" : user?.role === "author" ? "/author/dashboard" : "/dashboard"}>
                <Button variant="outline" size="sm" className="h-8 text-xs font-medium border-[#E5E5E5] hover:border-black">
                  {user?.role === "admin" ? <Shield className="mr-1.5 h-3.5 w-3.5 text-[#525252]" /> : user?.role === "author" ? <PlusCircle className="mr-1.5 h-3.5 w-3.5 text-[#525252]" /> : <UserIcon className="mr-1.5 h-3.5 w-3.5 text-[#525252]" />}
                  <span>{user?.name || "Account"}</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-[#737373] hover:text-black" onClick={handleLogout} title="Logout">
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="h-8 text-xs font-medium text-[#525252] hover:text-black">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="h-8 text-xs font-medium bg-black text-white hover:bg-[#262626]">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
