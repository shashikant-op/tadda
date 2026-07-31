"client"
"use client";

import { use, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { CodeBlock } from "@/components/tutorial/CodeBlock";
import { VideoEmbed } from "@/components/tutorial/VideoEmbed";
import { QuizCard } from "@/components/quiz/QuizCard";
import { Button } from "@/components/ui/button";
import { Clock, Bookmark, Share2, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";

// Sidebar topics and subtopics hierarchy
const chapters = [
  {
    title: "1. Introduction & Overview",
    subtopics: [
      { id: "intro", title: "Problem Statement & Basics" },
      { id: "constraints", title: "Understanding Constraints" },
    ],
  },
  {
    title: "2. Algorithmic Approaches",
    subtopics: [
      { id: "brute-force", title: "Brute Force Approach O(n²)" },
      { id: "hash-map", title: "Optimized Hash Map Approach O(n)" },
    ],
  },
  {
    title: "3. Implementation & Code",
    subtopics: [
      { id: "typescript-code", title: "TypeScript Implementation" },
      { id: "python-code", title: "Python Implementation" },
    ],
  },
  {
    title: "4. Assessment & Quiz",
    subtopics: [
      { id: "video-review", title: "Video Walkthrough" },
      { id: "quiz-assessment", title: "Knowledge Quiz" },
    ],
  },
];

const allSubtopics = chapters.flatMap((c) => c.subtopics);

interface PageProps {
  params: Promise<{
    branch: string;
    subject: string;
    topic: string;
    slug: string;
  }>;
}

export default function TutorialReadingPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { branch, subject, slug } = resolvedParams;
  const searchParams = useSearchParams();
  const subtopicParam = searchParams.get("subtopic");

  const [activeSubtopicId, setActiveSubtopicId] = useState(() => {
    return subtopicParam && allSubtopics.some((s) => s.id === subtopicParam) ? subtopicParam : "hash-map";
  });

  const currentIndex = allSubtopics.findIndex((s) => s.id === activeSubtopicId);
  const currentSubtopic = allSubtopics[currentIndex] || allSubtopics[0];

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveSubtopicId(allSubtopics[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < allSubtopics.length - 1) {
      setActiveSubtopicId(allSubtopics[currentIndex + 1].id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/${branch}`} className="hover:text-primary capitalize">{branch.replace("-", " ")}</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/${branch}/${subject}`} className="hover:text-primary capitalize">{subject.replace("-", " ")}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium capitalize">{slug.replace("-", " ")}</span>
        </nav>

        {/* Main Grid: Left Sidebar + Right Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Sidebar: Topics and Subtopics */}
          <aside className="lg:col-span-1 border rounded-xl bg-card p-4 space-y-6 sticky top-20 shadow-sm">
            <div className="font-bold text-sm border-b pb-3 uppercase tracking-wider text-muted-foreground">
              Table of Contents
            </div>
            <div className="space-y-4">
              {chapters.map((chapter, cIdx) => (
                <div key={cIdx} className="space-y-1.5">
                  <div className="font-semibold text-xs text-foreground uppercase tracking-tight">
                    {chapter.title}
                  </div>
                  <div className="space-y-1 pl-2 border-l ml-1">
                    {chapter.subtopics.map((sub) => {
                      const isActive = sub.id === activeSubtopicId;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => setActiveSubtopicId(sub.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                            isActive
                              ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <span className="line-clamp-1">{sub.title}</span>
                          {isActive && <CheckCircle className="h-3.5 w-3.5 shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Right Section: Main Content */}
          <main className="lg:col-span-3 space-y-8 bg-card border rounded-xl p-6 sm:p-10 shadow-sm">
            {/* Header info */}
            <div className="space-y-4 border-b pb-6">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-primary/10 text-primary">
                  Beginner
                </span>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 h-3.5 w-3.5" />
                  8 min read
                </div>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                {currentSubtopic.title}
              </h1>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                <span>Course: {subject.replace("-", " ").toUpperCase()}</span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Bookmark className="mr-1.5 h-3.5 w-3.5" /> Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-1.5 h-3.5 w-3.5" /> Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Content Body based on active subtopic */}
            <article className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-base leading-relaxed">
              {activeSubtopicId === "intro" && (
                <div>
                  <p>
                    Welcome to the comprehensive tutorial on <strong>{slug.replace("-", " ")}</strong>. This guide breaks down core principles step by step, ensuring deep mastery for technical interviews and production engineering.
                  </p>
                  <h3 className="text-xl font-bold mt-4 mb-2">Why Learn This?</h3>
                  <p>
                    Mastering this concept strengthens your algorithmic intuition and problem-solving framework.
                  </p>
                </div>
              )}

              {activeSubtopicId === "brute-force" && (
                <div>
                  <p>
                    The brute force approach evaluates every possible combination using nested loops. While simple to understand, its time complexity is typically $O(n^2)$, which does not scale well for large inputs.
                  </p>
                  <CodeBlock
                    language="typescript"
                    code={`function bruteForceSolve(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}`}
                  />
                </div>
              )}

              {activeSubtopicId === "hash-map" && (
                <div>
                  <p>
                    We can optimize the lookup time to $O(n)$ by utilizing a hash map (or dictionary) to store previously visited values and their indices.
                  </p>
                  <CodeBlock
                    language="typescript"
                    code={`function optimizedSolve(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`}
                  />
                </div>
              )}

              {activeSubtopicId === "typescript-code" && (
                <div>
                  <p>Here is the complete production-ready TypeScript implementation with strict type checking and edge-case handling.</p>
                  <CodeBlock
                    language="typescript"
                    code={`export function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (seen.has(diff)) {
      return [seen.get(diff)!, i];
    }
    seen.set(nums[i], i);
  }
  throw new Error("No two sum solution found");
}`}
                  />
                </div>
              )}

              {activeSubtopicId === "python-code" && (
                <div>
                  <p>Here is the equivalent Python implementation using dictionaries.</p>
                  <CodeBlock
                    language="python"
                    code={`def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`}
                  />
                </div>
              )}

              {activeSubtopicId === "video-review" && (
                <VideoEmbed url="https://www.youtube.com/embed/dQw4w9WgXcQ" />
              )}

              {activeSubtopicId === "quiz-assessment" && (
                <QuizCard
                  quiz={[
                    {
                      id: "q1",
                      question: "What is the time complexity of the optimized hash map solution?",
                      options: ["O(n^2)", "O(n)", "O(log n)", "O(1)"],
                      correctAnswer: 1,
                      explanation: "We traverse the array of size n once and perform O(1) hash map lookups.",
                    },
                  ]}
                />
              )}
            </article>

            {/* Prev / Next Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 border-t mt-12">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous Subtopic</span>
              </Button>
              <div className="text-xs text-muted-foreground">
                {currentIndex + 1} of {allSubtopics.length}
              </div>
              <Button
                onClick={handleNext}
                disabled={currentIndex === allSubtopics.length - 1}
                className="flex items-center space-x-2"
              >
                <span>Next Subtopic</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
