"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { TutorialCard } from "@/components/cards/TutorialCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Filter } from "lucide-react";
import { tutorialService } from "@/services/tutorial.service";
import { Tutorial } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Tutorial[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (searchVal: string) => {
    setIsLoading(true);
    tutorialService.searchTutorials(searchVal || "a")
      .then((data) => setResults(Array.isArray(data) ? data : []))
      .catch(() => setResults([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(initialQuery);
    }, 0);
    return () => clearTimeout(timer);
  }, [initialQuery]);

  return (
    <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
      <div className="space-y-6 mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Search Tutorials & Code</h1>
        <p className="text-muted-foreground text-sm">
          Search across branches, subjects, topics, algorithms, and frameworks from MongoDB.
        </p>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by keyword (e.g. binary search, React, Docker)..."
              className="pl-9 h-11"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
            />
          </div>
          <Button className="h-11 px-6" onClick={() => handleSearch(query)}>Search</Button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b">
          <h2 className="text-lg font-semibold">Search Results ({results.length})</h2>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter by branch</span>
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Searching database...</div>
        ) : results.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No tutorials found matching your query.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <Suspense fallback={<div className="flex-1 container mx-auto py-20 text-center">Loading search...</div>}>
        <SearchContent />
      </Suspense>
      <Footer />
    </div>
  );
}
