"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { MarkdownRenderer } from "@/components/tutorial/MarkdownRenderer";
import { CodeBlock } from "@/components/tutorial/CodeBlock";
import { VideoEmbed } from "@/components/tutorial/VideoEmbed";
import { QuizCard } from "@/components/quiz/QuizCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Bookmark, Share2, ChevronRight, ChevronLeft, CheckCircle, BookOpen } from "lucide-react";
import { Tutorial } from "@/types";
import { tutorialService } from "@/services/tutorial.service";
import { bookmarkService } from "@/services/bookmark.service";
import { progressService } from "@/services/progress.service";
import { LoginModal } from "@/components/auth/LoginModal";

interface PageProps {
  params: Promise<{
    branch: string;
    subject: string;
    slug: string[];
  }>;
}

export default function CatchAllTutorialPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { branch, subject: subjectSlug, slug: slugSegments } = resolvedParams;
  const currentTutorialSlug = slugSegments[slugSegments.length - 1];

  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [currentTutorial, setCurrentTutorial] = useState<Tutorial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({});
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"bookmark" | "complete" | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        // 1. Fetch current tutorial directly by slug (production-ready robust retrieval)
        let tutorialData: Tutorial | null = null;
        try {
          tutorialData = await tutorialService.getTutorialBySlug(branch, subjectSlug, "", currentTutorialSlug);
        } catch (err) {
          console.error("Direct tutorial fetch failed, trying search/list", err);
        }

        if (tutorialData) {
          setCurrentTutorial(tutorialData);
        }

        // 2. Fetch sidebar curriculum tutorials
        const subSlug = (tutorialData as any)?.subject?.slug || (tutorialData as any)?.subjectSlug || subjectSlug;
        const res = await tutorialService.getTutorials(undefined, subSlug);
        const list = Array.isArray(res) ? res : [];
        setTutorials(list);

        if (!tutorialData && list.length > 0) {
          const found = list.find((t: any) => t.slug === currentTutorialSlug);
          setCurrentTutorial(found || list[0]);
        }
      } catch (err) {
        console.error("Failed to load tutorial data", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [branch, subjectSlug, currentTutorialSlug]);

  const topicsMap = new Map<string, { topicName: string; tutorials: Tutorial[] }>();
  tutorials.forEach((tut: any) => {
    const topName = typeof tut.topic === "object" ? tut.topic?.name : (tut.topicSlug || "General Topics");
    const topId = typeof tut.topic === "object" ? (tut.topic?._id || tut.topic?.slug) : (tut.topicSlug || "general");
    if (!topicsMap.has(topId)) {
      topicsMap.set(topId, { topicName: topName || "Topic Module", tutorials: [] });
    }
    topicsMap.get(topId)!.tutorials.push(tut);
  });
  const topicsList = Array.from(topicsMap.values());

  const toggleTopic = (topicName: string) => {
    setOpenTopics((prev) => ({ ...prev, [topicName]: !prev[topicName] }));
  };

  const currentIndex = tutorials.findIndex((t) => (t.id || (t as any)._id) === (currentTutorial?.id || (currentTutorial as any)?._id));

  const handleBookmark = async () => {
    if (!currentTutorial) return;
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      setPendingAction("bookmark");
      setIsLoginModalOpen(true);
      return;
    }
    try {
      const tId = currentTutorial.id || (currentTutorial as any)._id;
      await bookmarkService.addBookmark(tId);
      setIsBookmarked(true);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setPendingAction("bookmark");
        setIsLoginModalOpen(true);
      }
      console.error("Bookmark error", err);
    }
  };

  const handleComplete = async () => {
    if (!currentTutorial) return;
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      setPendingAction("complete");
      setIsLoginModalOpen(true);
      return;
    }
    try {
      const tId = currentTutorial.id || (currentTutorial as any)._id;
      await progressService.markProgressCompleted(tId);
      setIsCompleted(true);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setPendingAction("complete");
        setIsLoginModalOpen(true);
      }
      console.error("Progress error", err);
    }
  };

  const handleLoginSuccess = async () => {
    if (pendingAction === "bookmark") {
      await handleBookmark();
    } else if (pendingAction === "complete") {
      await handleComplete();
    }
    setPendingAction(null);
  };

  const branchName = (currentTutorial as any)?.branch?.name || branch.replace(/-/g, " ");
  const subjectName = (currentTutorial as any)?.subject?.name || subjectSlug.replace(/-/g, " ");

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/${branch}`} className="hover:text-primary capitalize">{branchName}</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/${branch}/${subjectSlug}`} className="hover:text-primary capitalize">{subjectName}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium capitalize">{currentTutorial?.title || currentTutorialSlug.replace(/-/g, " ")}</span>
        </nav>

        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">Loading tutorial from database...</div>
        ) : !currentTutorial ? (
          <Card className="p-12 text-center text-muted-foreground">
            Tutorial not found.
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
                          {group.tutorials.map((tut) => {
                            const isActive = (tut.id || (tut as any)._id) === (currentTutorial.id || (currentTutorial as any)._id);
                            const tSlug = tut.slug;
                            const bSlug = (tut as any).branch?.slug || branch;
                            const sSlug = (tut as any).subject?.slug || subjectSlug;
                            return (
                              <Link
                                key={tSlug}
                                href={`/${bSlug}/${sSlug}/${tSlug}`}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between block ${
                                  isActive
                                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                              >
                                <span className="line-clamp-1">{tut.title}</span>
                                {isActive && <CheckCircle className="h-3.5 w-3.5 shrink-0 ml-1" />}
                              </Link>
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

                {(currentTutorial as any).codeBlocks && (currentTutorial as any).codeBlocks.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold">Code Implementation</h3>
                    {(currentTutorial as any).codeBlocks.map((cb: any, cIdx: number) => (
                      <CodeBlock key={cIdx} language={cb.language || "javascript"} code={cb.code} />
                    ))}
                  </div>
                )}

                {currentTutorial.quiz && currentTutorial.quiz.length > 0 && (
                  <div className="space-y-4 pt-6 border-t">
                    <h3 className="text-lg font-bold">Knowledge Quiz</h3>
                    <QuizCard quiz={currentTutorial.quiz} />
                  </div>
                )}
              </article>

              {/* Navigation between tutorials */}
              <div className="flex items-center justify-between pt-8 border-t mt-12">
                {currentIndex > 0 ? (
                  <Link href={`/${branch}/${subjectSlug}/${tutorials[currentIndex - 1].slug}`}>
                    <Button variant="outline" className="flex items-center space-x-2">
                      <ChevronLeft className="h-4 w-4" />
                      <span>Previous Tutorial</span>
                    </Button>
                  </Link>
                ) : <div />}
                <div className="text-xs text-muted-foreground">
                  Module {currentIndex > -1 ? currentIndex + 1 : 1} of {tutorials.length || 1}
                </div>
                {currentIndex > -1 && currentIndex < tutorials.length - 1 ? (
                  <Link href={`/${branch}/${subjectSlug}/${tutorials[currentIndex + 1].slug}`}>
                    <Button className="flex items-center space-x-2">
                      <span>Next Tutorial</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : <div />}
              </div>
            </main>
          </div>
        )}
      </div>

      <Footer />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onSuccess={handleLoginSuccess} />
    </div>
  );
}
