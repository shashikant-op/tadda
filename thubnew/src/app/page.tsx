"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, ArrowRight, Sparkles, BookOpen, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { BranchCard } from "@/components/cards/BranchCard";
import { TutorialCard } from "@/components/cards/TutorialCard";
import { tutorialService } from "@/services/tutorial.service";
import { Branch, Tutorial } from "@/types";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [featuredTutorials, setFeaturedTutorials] = useState<Tutorial[]>([]);

  useEffect(() => {
    tutorialService.getBranches()
      .then((data) => setBranches(Array.isArray(data) ? data : []))
      .catch(() => setBranches([]));

    tutorialService.searchTutorials("Two")
      .then((data) => setFeaturedTutorials(Array.isArray(data) ? data : []))
      .catch(() => setFeaturedTutorials([]));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative selection:bg-primary/20">
      <Navbar />

      <main className="flex-1 relative">
        <div className="glossy-glow top-20 left-1/2 -translate-x-1/2" />
        <div className="glossy-glow top-[600px] left-1/4" />
        <div className="glossy-glow top-[1200px] right-1/4" />

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32 border-b bg-gradient-to-b from-primary/10 via-background/60 to-background backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl space-y-8 relative z-10">
            <div className="inline-flex items-center rounded-full border bg-background/80 backdrop-blur-md px-3 py-1 text-sm font-medium shadow-sm">
              <Sparkles className="mr-2 h-4 w-4 text-primary animate-pulse" />
              Production-Ready Engineering Tutorials
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
              Master Computer Science & Modern Engineering
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore in-depth tutorials, production code examples, interactive quizzes, and structured learning paths from MongoDB database.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <div className="relative w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search algorithms, React, Docker..."
                  className="pl-9 h-11 w-full bg-background/80 backdrop-blur-md shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link href={`/search?q=${encodeURIComponent(searchQuery)}`}>
                <Button className="w-full sm:w-auto h-11 px-6 shadow-lg shadow-primary/20">Explore</Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t text-left max-w-3xl mx-auto">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-background/40 backdrop-blur-md border border-white/10 shadow-sm">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-bold text-lg">500+</div>
                  <div className="text-xs text-muted-foreground">Tutorials</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-background/40 backdrop-blur-md border border-white/10 shadow-sm">
                <Award className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-bold text-lg">50+</div>
                  <div className="text-xs text-muted-foreground">Quizzes</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-background/40 backdrop-blur-md border border-white/10 shadow-sm">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-bold text-lg">100k+</div>
                  <div className="text-xs text-muted-foreground">Learners</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-background/40 backdrop-blur-md border border-white/10 shadow-sm">
                <Sparkles className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-bold text-lg">100%</div>
                  <div className="text-xs text-muted-foreground">Live API</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Branches Section */}
        <section className="py-16 md:py-24 border-b relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Popular Learning Branches</h2>
                <p className="text-muted-foreground text-sm mt-1">Fetched live from MongoDB branches collection.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map((branch) => (
                <BranchCard
                  key={branch.id || branch.slug}
                  name={branch.name}
                  slug={branch.slug}
                  description={branch.description}
                  subjectCount={branch.subjectCount || 10}
                  icon={branch.icon || "Cpu"}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Tutorials Section */}
        <section className="py-16 md:py-24 bg-muted/20 border-b backdrop-blur-md">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Featured Tutorials</h2>
                <p className="text-muted-foreground text-sm mt-1">Fetched live from backend API database.</p>
              </div>
              <Link href="/search">
                <Button variant="ghost" className="flex items-center space-x-1">
                  <span>View all</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredTutorials.map((tutorial) => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
