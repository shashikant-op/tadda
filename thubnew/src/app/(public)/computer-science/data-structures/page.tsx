"client"
"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { TutorialCard } from "@/components/cards/TutorialCard";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronRight, Network } from "lucide-react";
import { Tutorial } from "@/types";

export default function DataStructuresSubjectPage() {
  const topics = [
    { name: "Arrays & Strings", slug: "arrays", count: 8 },
    { name: "Linked Lists", slug: "linked-lists", count: 6 },
    { name: "Trees & Graphs", slug: "trees", count: 10 },
  ];

  const tutorials: Tutorial[] = [
    {
      id: "1",
      title: "Two Sum Algorithm",
      slug: "two-sum",
      branchSlug: "computer-science",
      subjectSlug: "data-structures",
      topicSlug: "arrays",
      description: "Learn the optimal Two Sum algorithm with O(n) time complexity using hash maps.",
      content: "",
      author: { name: "Dr. Alex Turner" },
      difficulty: "Beginner",
      readTime: "8 min read",
      createdAt: "2026-03-01",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
        <nav className="flex items-center space-x-2 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/computer-science" className="hover:text-primary">Computer Science</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Data Structures</span>
        </nav>

        <div className="flex items-center space-x-4 mb-12 p-6 rounded-xl border bg-primary/5">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Network className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Data Structures & Algorithms</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Master essential data structures and algorithmic problem solving.
            </p>
          </div>
        </div>

        <div className="space-y-6 mb-12">
          <h2 className="text-2xl font-bold tracking-tight">Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <Link key={topic.slug} href={`/computer-science/data-structures/${topic.slug}/two-sum`}>
                <Card className="hover:shadow-md transition-all h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-muted">
                        {topic.count} Tutorials
                      </span>
                    </div>
                    <CardTitle className="text-lg">{topic.name}</CardTitle>
                    <CardDescription>Explore tutorials on {topic.name}.</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Tutorials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tutorials.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
