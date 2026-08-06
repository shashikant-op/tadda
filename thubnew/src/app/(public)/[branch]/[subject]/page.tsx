"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { CodeBlock } from "@/components/tutorial/CodeBlock";
import { QuizCard } from "@/components/quiz/QuizCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Bookmark, ChevronRight, ChevronLeft, CheckCircle, BookOpen } from "lucide-react";
import { Tutorial } from "@/types";
import { tutorialService } from "@/services/tutorial.service";
import { bookmarkService } from "@/services/bookmark.service";
import { progressService } from "@/services/progress.service";
import { MarkdownRenderer } from "@/components/tutorial/MarkdownRenderer";

interface PageProps {
  params: Promise<{
    branch: string;
    subject: string;
  }>;
}

export default function CoursePlayerPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { branch, subject: subjectSlug } = resolvedParams;

  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadTutorials() {
      try {
        setIsLoading(true);
        const res = await tutorialService.getTutorials(undefined, subjectSlug);
        const filtered = Array.isArray(res) ? res.filter((t: Tutorial) => {
          const tRec = t as unknown as Record<string, unknown>;
          const sObj = tRec.subject;
          const sSlug = typeof sObj === "object" && sObj !== null ? (sObj as Record<string, unknown>)?.slug : sObj;
          return sSlug === subjectSlug || tRec.subjectSlug === subjectSlug || (tRec.slug as string)?.includes(subjectSlug);
        }) : [];
        // If filtered has results use them, otherwise take a slice of 20 (one subject's worth)
        const finalTutorials = filtered.length > 0 ? filtered : (Array.isArray(res) ? res.slice(0, 20) : []);
        setTutorials(finalTutorials);
      } catch (err) {
        console.error("Failed to load course player tutorials", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTutorials();
  }, [subjectSlug]);

  const currentTutorial = tutorials[currentIndex];

  // Group tutorials by Topic with subtopics
  const topicsMap = new Map<string, { topicName: string; tutorials: { tut: Tutorial; globalIndex: number }[] }>();
  tutorials.forEach((tut: Tutorial, globalIndex: number) => {
    const tutRec = tut as unknown as Record<string, unknown>;
    const topicObj = tutRec.topic as Record<string, unknown> | undefined;
    const topName = typeof tutRec.topic === "object" && topicObj ? (topicObj.name as string) : ((tutRec.topicSlug as string) || "General Topics");
    const topId = typeof tutRec.topic === "object" && topicObj ? ((topicObj._id || topicObj.slug) as string) : ((tutRec.topicSlug as string) || "general");
    if (!topicsMap.has(topId)) {
      topicsMap.set(topId, { topicName: topName || "Topic Module", tutorials: [] });
    }
    topicsMap.get(topId)!.tutorials.push({ tut, globalIndex });
  });
  const topicsList = Array.from(topicsMap.values());

  const toggleTopic = (topicName: string) => {
    setOpenTopics((prev) => ({ ...prev, [topicName]: !prev[topicName] }));
  };

  const handleBookmark = async () => {
    if (!currentTutorial) return;
    try {
      const tutRec = currentTutorial as unknown as Record<string, unknown>;
      const tId = currentTutorial.id || (tutRec._id as string);
      await bookmarkService.addBookmark(tId);
      setIsBookmarked(true);
    } catch (err: unknown) {
      console.error("Bookmark error", err);
    }
  };

  const handleComplete = async () => {
    if (!currentTutorial) return;
    try {
      const tutRec = currentTutorial as unknown as Record<string, unknown>;
      const tId = currentTutorial.id || (tutRec._id as string);
      await progressService.markProgressCompleted(tId);
      setIsCompleted(true);
    } catch (err: unknown) {
      console.error("Progress error", err);
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
          <span className="text-foreground font-medium capitalize">{subjectSlug.replace(/-/g, " ")}</span>
        </nav>

        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">Loading course player from database...</div>
        ) : tutorials.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground">
            No tutorials available for this subject yet.
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Left Sidebar: Topics and Subtopics Dropdown */}
            <aside className="lg:col-span-1 border rounded-xl bg-card p-4 space-y-4 sticky top-20 shadow-sm max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="font-bold text-sm border-b pb-3 uppercase tracking-wider text-muted-foreground flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>Course Curriculum ({tutorials.length})</span>
              </div>
              <div className="space-y-3">
                {topicsList.map((group, gIdx) => {
                  const isOpen = openTopics[group.topicName] ?? true;
                  return (
                    <div key={gIdx} className="space-y-1 border-b border-white/10 pb-3 last:border-0">
                      <button
                        onClick={() => toggleTopic(group.topicName)}
                        className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-foreground py-1 px-1 hover:text-primary transition-colors"
                      >
                        <span className="line-clamp-1">{group.topicName}</span>
                        <ChevronRight className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
                      </button>

                      {isOpen && (
                        <div className="space-y-1 pl-2 border-l ml-1 mt-1.5">
                          {group.tutorials.map(({ tut, globalIndex }) => {
                            const isActive = globalIndex === currentIndex;
                            return (
                              <button
                                key={tut.id || tut.slug}
                                onClick={() => setCurrentIndex(globalIndex)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                                  isActive
                                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                              >
                                <span className="line-clamp-1">{tut.title}</span>
                                {isActive && <CheckCircle className="h-3.5 w-3.5 shrink-0 ml-1" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* Right Main Course Content */}
            <main className="lg:col-span-3 space-y-8 bg-card border rounded-xl p-6 sm:p-10 shadow-sm">
              {currentTutorial && (
                <>
                  <div className="space-y-4 border-b pb-6">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-primary/10 text-primary">
                        {currentTutorial.difficulty || "Beginner"}
                      </span>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3.5 w-3.5" />
                        {currentTutorial.readTime || "10 min read"}
                      </div>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight">
                      {currentTutorial.title}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      {currentTutorial.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                      <span>Author: {currentTutorial.author?.name || "Expert Instructor"}</span>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={handleBookmark}>
                          <Bookmark className={`mr-1.5 h-3.5 w-3.5 ${isBookmarked ? "fill-primary text-primary" : ""}`} />
                          {isBookmarked ? "Saved" : "Save"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleComplete}>
                          <CheckCircle className={`mr-1.5 h-3.5 w-3.5 ${isCompleted ? "text-green-500" : ""}`} />
                          {isCompleted ? "Completed" : "Mark Complete"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <article className="space-y-6 text-base leading-relaxed">
                    <MarkdownRenderer content={currentTutorial.content} />

                    {(() => {
                      const tutRec = currentTutorial as unknown as Record<string, unknown>;
                      const codeBlocks = tutRec.codeBlocks as Record<string, unknown>[] | undefined;
                      return codeBlocks && codeBlocks.length > 0 ? (
                        <div className="space-y-4">
                          <h3 className="text-lg font-bold">Code Implementation</h3>
                          {codeBlocks.map((cb, cIdx: number) => (
                            <CodeBlock key={cIdx} language={(cb.language as string) || "javascript"} code={(cb.code as string) || ""} />
                          ))}
                        </div>
                      ) : null;
                    })()}

                    {currentTutorial.quiz && currentTutorial.quiz.length > 0 && (
                      <div className="space-y-4 pt-6 border-t">
                        <h3 className="text-lg font-bold">Knowledge Quiz</h3>
                        <QuizCard quiz={currentTutorial.quiz} />
                      </div>
                    )}
                  </article>

                  {/* Navigation between course tutorials */}
                  <div className="flex items-center justify-between pt-8 border-t mt-12">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentIndex === 0}
                      className="flex items-center space-x-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Previous Tutorial</span>
                    </Button>
                    <div className="text-xs text-muted-foreground">
                      Module {currentIndex + 1} of {tutorials.length}
                    </div>
                    <Button
                      onClick={() => setCurrentIndex((prev) => Math.min(tutorials.length - 1, prev + 1))}
                      disabled={currentIndex === tutorials.length - 1}
                      className="flex items-center space-x-2"
                    >
                      <span>Next Tutorial</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </main>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
