"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { TutorialCard } from "@/components/cards/TutorialCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Layers, Cpu, BookOpen, ChevronRight, ArrowRight, Sparkles, BookMarked } from "lucide-react";
import { tutorialService } from "@/services/tutorial.service";
import { branchService } from "@/services/branch.service";
import { subjectService } from "@/services/subject.service";
import { Tutorial, Branch, Subject } from "@/types";

const POPULAR_SEARCHES = ["Binary search", "Compiler design", "React", "Machine learning"];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchSequence = useRef(0);
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Tutorial[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Branches and Subjects (Courses) state
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);

  useEffect(() => {
    branchService.getBranches()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setBranches(list);
        if (list.length > 0) {
          setSelectedBranch(list[0]);
        }
      })
      .catch(() => setBranches([]));
  }, []);

  useEffect(() => {
    let active = true;
    const loadSubjects = async () => {
      if (!selectedBranch) return;
      const bId = selectedBranch.id || (selectedBranch as unknown as Record<string, unknown>)._id;
      if (!bId) return;

      await Promise.resolve();
      if (active) setIsLoadingSubjects(true);
      try {
        const subs = await subjectService.getSubjects(bId as string);
        if (active) setSubjects(Array.isArray(subs) ? subs : []);
      } catch {
        if (active) setSubjects([]);
      } finally {
        if (active) setIsLoadingSubjects(false);
      }
    };
    void loadSubjects();
    return () => { active = false; };
  }, [selectedBranch]);

  const handleSearch = useCallback((searchVal: string) => {
    const term = searchVal.trim();
    const sequence = ++searchSequence.current;
    if (!term) {
      setResults([]);
      setIsLoading(false);
      router.replace("/search", { scroll: false });
      return;
    }
    router.replace(`/search?q=${encodeURIComponent(term)}`, { scroll: false });
    setIsLoading(true);
    tutorialService.searchTutorials(term)
      .then((data) => {
        if (sequence === searchSequence.current) setResults(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (sequence === searchSequence.current) setResults([]);
      })
      .finally(() => {
        if (sequence === searchSequence.current) setIsLoading(false);
      });
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (initialQuery) {
        handleSearch(initialQuery);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [initialQuery, handleSearch]);

  return (
    <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl space-y-10">
      {/* Hero Banner Section matching reference design */}
      <section className="relative overflow-hidden rounded-[1.75rem] border border-emerald-100/90 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-green-50/60 p-6 sm:p-10 lg:p-12 shadow-xs">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-end opacity-25 pointer-events-none select-none">
          <div className="w-36 h-28 rounded-2xl bg-emerald-700/20 mb-3 shadow-inner transform rotate-3" />
          <div className="w-44 h-32 rounded-2xl bg-emerald-800/30 mb-3 shadow-inner transform -rotate-2" />
          <div className="w-52 h-36 rounded-2xl bg-emerald-900/40 shadow-inner transform rotate-1" />
        </div>

        <div className="relative z-10 space-y-5 max-w-2xl">
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
            <Sparkles className="h-3.5 w-3.5" />
            <span>EXPLORE THE LIBRARY</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--ink)] tracking-tight">
              What do you want to learn?
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Search across branches, subjects, topics, algorithms, and frameworks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
              <Input
                aria-label="Search tutorials, courses, and topics"
                placeholder="Search tutorials, courses, and topics"
                className="pl-11 pr-12 h-12 text-sm rounded-xl border-emerald-200 bg-white shadow-xs focus-visible:ring-emerald-600"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
              />
              <span className="absolute right-3.5 top-3.5 hidden sm:inline-flex items-center text-[10px] font-mono text-muted-foreground bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                ⌘ K
              </span>
            </div>
            <Button
              className="h-12 px-7 text-sm font-semibold rounded-xl bg-[#1a4331] hover:bg-[#122e22] text-white shadow-sm transition-colors shrink-0"
              disabled={isLoading}
              onClick={() => handleSearch(query)}
            >
              {isLoading ? "Searching…" : "Search"}
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
            <span className="font-medium text-[var(--ink)]">Popular searches:</span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setQuery(term);
                  handleSearch(term);
                }}
                className="bg-white/80 hover:bg-emerald-100/60 border border-emerald-200/70 text-emerald-900 px-3 py-1 rounded-full text-xs font-medium transition-colors shadow-2xs"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* If searching, show search results */}
      {query.trim().length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--ink)]">
              Search Results ({results.length})
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 text-xs font-medium flex items-center space-x-2 rounded-xl"
              onClick={() => { setQuery(""); setResults([]); router.replace("/search", { scroll: false }); }}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Browse categories</span>
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-16 text-muted-foreground text-xs">Searching database...</div>
          ) : results.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-xs">No tutorials found matching your query.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((tutorial) => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Otherwise, show Browse by branch on left and Branch Courses on right */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Browse by branch */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Browse by branch</h2>
            <div className="space-y-3">
              {branches.map((branch) => {
                const isSelected = branch.slug === selectedBranch?.slug;
                return (
                  <button
                    type="button"
                    key={branch.id || branch.slug}
                    onClick={() => setSelectedBranch(branch)}
                    aria-pressed={isSelected}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/40 shadow-sm"
                        : "border-[var(--border)] bg-[var(--surface)] hover:border-emerald-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2.5 rounded-xl ${isSelected ? "bg-emerald-600 text-white" : "bg-gray-100 text-muted-foreground"}`}>
                        <Cpu className="h-4 w-4 shrink-0" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[var(--ink)] block">{branch.name}</span>
                        <span className="text-[10px] text-muted-foreground block mt-0.5">
                          {branch.description || "Engineering branch"}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-transform ${isSelected ? "text-emerald-700 translate-x-0.5" : "text-muted-foreground group-hover:translate-x-0.5"}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Courses (Subjects) Section for Selected Branch */}
          <div className="lg:col-span-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center space-x-3">
                <h2 className="text-base font-bold text-[var(--ink)] tracking-tight">
                  {selectedBranch ? `${selectedBranch.name} courses` : "Courses"}
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {subjects.length} courses
                </span>
              </div>
              <div className="text-xs font-medium text-muted-foreground flex items-center space-x-1 border rounded-lg px-3 py-1.5 bg-[var(--surface)]">
                <span>Sort: Recommended</span>
                <span className="text-[10px]">▼</span>
              </div>
            </div>

            {isLoadingSubjects ? (
              <div className="text-center py-20 text-muted-foreground text-xs">Loading courses...</div>
            ) : subjects.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground text-xs">No courses found for this branch.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjects.map((subject) => (
                  <Link
                    key={subject.id || subject.slug}
                    href={`/${selectedBranch?.slug}/${subject.slug}`}
                    className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-emerald-600/70 hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-xl bg-emerald-100/70 text-emerald-800">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-gray-100/80 px-2 py-0.5 rounded">
                          {selectedBranch?.name || "Branch"}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="font-bold text-sm text-[var(--ink)] group-hover:text-emerald-900 transition-colors line-clamp-1">
                          {subject.name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {subject.description || "Structured tutorials, core algorithms, and practical implementation guides."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100 space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <BookMarked className="h-3 w-3" />
                          <span>12 lessons</span>
                        </span>
                        <span>•</span>
                        <span>Beginner</span>
                        <div className="h-7 w-7 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                          <span>0% complete</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-600 w-0 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <Suspense fallback={<div className="flex-1 container mx-auto py-20 text-center text-xs">Loading...</div>}>
        <SearchContent />
      </Suspense>
      <Footer />
    </div>
  );
}
