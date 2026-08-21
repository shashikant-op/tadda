"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { TutorialCard } from "@/components/cards/TutorialCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Filter, Cpu, BookOpen, ChevronRight } from "lucide-react";
import { tutorialService } from "@/services/tutorial.service";
import { branchService } from "@/services/branch.service";
import { subjectService } from "@/services/subject.service";
import { Tutorial, Branch, Subject } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
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
    if (selectedBranch) {
      const bId = selectedBranch.id || (selectedBranch as unknown as Record<string, unknown>)._id;
      if (bId) {
        setIsLoadingSubjects(true);
        subjectService.getSubjects(bId as string)
          .then((subs) => setSubjects(Array.isArray(subs) ? subs : []))
          .catch(() => setSubjects([]))
          .finally(() => setIsLoadingSubjects(false));
      }
    }
  }, [selectedBranch]);

  const handleSearch = (searchVal: string) => {
    setIsLoading(true);
    const term = searchVal.trim() || "";
    tutorialService.searchTutorials(term)
      .then((data) => setResults(Array.isArray(data) ? data : []))
      .catch(() => setResults([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (initialQuery) {
        handleSearch(initialQuery);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [initialQuery]);

  return (
    <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl space-y-8">
      {/* Search Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Search Tutorials & Code</h1>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Search across branches, subjects, topics, algorithms, and frameworks from MongoDB.
        </p>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by keyword (e.g. binary search)..."
              className="pl-10 h-11 text-xs"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
            />
          </div>
          <Button className="h-11 px-6 text-xs font-medium" onClick={() => handleSearch(query)}>Search</Button>
        </div>
      </div>

      {/* If searching, show search results */}
      {query.trim().length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b">
            <h2 className="text-sm font-bold uppercase tracking-wider">Search Results ({results.length})</h2>
            <Button variant="outline" size="sm" className="h-8 text-xs flex items-center space-x-2">
              <Filter className="h-3.5 w-3.5" />
              <span>Filter</span>
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground text-xs">Searching database...</div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-xs">No tutorials found matching your query.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((tutorial) => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Otherwise, show Branches and Courses (Subjects) of selected branch */
        <div className="space-y-8">
          {/* Branches Section */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Browse by Branch</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {branches.map((branch) => {
                const isSelected = branch.slug === selectedBranch?.slug;
                return (
                  <div
                    key={branch.id || branch.slug}
                    onClick={() => setSelectedBranch(branch)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--primary-foreground)] shadow-md" : "border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--ink)]"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Cpu className={`h-4 w-4 shrink-0 ${isSelected ? "text-[var(--primary-foreground)]" : "text-muted-foreground"}`} />
                      <span className="font-semibold text-xs tracking-tight">{branch.name}</span>
                    </div>
                    <span className={`text-[10px] mt-3 ${isSelected ? "text-gray-300" : "text-muted-foreground"}`}>
                      {branch.description || "Engineering branch"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courses (Subjects) Section for Selected Branch */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h2 className="text-sm font-bold uppercase tracking-wider">
                {selectedBranch ? `${selectedBranch.name} Courses` : "Courses"} ({subjects.length})
              </h2>
            </div>

            {isLoadingSubjects ? (
              <div className="text-center py-12 text-muted-foreground text-xs">Loading courses...</div>
            ) : subjects.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-xs">No courses found for this branch.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                  <Link
                    key={subject.id || subject.slug}
                    href={`/${selectedBranch?.slug}/${subject.slug}`}
                    className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--ink)] transition-all flex flex-col justify-between group shadow-2xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <BookOpen className="h-4 w-4 text-muted-foreground group-hover:text-[var(--ink)] transition-colors" />
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <h3 className="font-bold text-xs text-[var(--ink)] group-hover:underline">{subject.name}</h3>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">{subject.description || "Structured tutorials & reference guides."}</p>
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
