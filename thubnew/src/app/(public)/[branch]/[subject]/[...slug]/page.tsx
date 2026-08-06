"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { MarkdownRenderer } from "@/components/tutorial/MarkdownRenderer";
import { CodeBlock } from "@/components/tutorial/CodeBlock";
import { QuizCard } from "@/components/quiz/QuizCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Bookmark, ChevronRight, ChevronLeft, CheckCircle, BookOpen, Terminal } from "lucide-react";
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
        let tutorialData: Tutorial | null = null;
        try {
          tutorialData = await tutorialService.getTutorialBySlug(branch, subjectSlug, "", currentTutorialSlug);
        } catch (err) {
          console.error("Direct tutorial fetch failed", err);
        }

        if (tutorialData) {
          setCurrentTutorial(tutorialData);
        }

        const tutAny = tutorialData as unknown as Record<string, unknown> | null;
        const subObj = tutAny?.subject as Record<string, unknown> | undefined;
        const subSlug = subObj?.slug || (tutAny?.subjectSlug as string) || subjectSlug;
        const res = await tutorialService.getTutorials(undefined, subSlug as string);
        const list = Array.isArray(res) ? res : [];
        setTutorials(list);

        if (!tutorialData && list.length > 0) {
          const found = list.find((t: Tutorial) => t.slug === currentTutorialSlug);
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
  tutorials.forEach((tut: unknown) => {
    const tObj = tut as Record<string, unknown>;
    const topicObj = tObj.topic as Record<string, unknown> | undefined;
    const topName = typeof tObj.topic === "object" && topicObj ? (topicObj.name as string) : ((tObj.topicSlug as string) || "General Modules");
    const topId = typeof tObj.topic === "object" && topicObj ? ((topicObj._id || topicObj.slug) as string) : ((tObj.topicSlug as string) || "general");
    if (!topicsMap.has(topId)) {
      topicsMap.set(topId, { topicName: topName || "Module", tutorials: [] });
    }
    topicsMap.get(topId)!.tutorials.push(tObj as unknown as Tutorial);
  });
  const topicsList = Array.from(topicsMap.values());

  const toggleTopic = (topicName: string) => {
    setOpenTopics((prev) => ({ ...prev, [topicName]: !prev[topicName] }));
  };

  const currentIndex = tutorials.findIndex((t) => {
    const tId = t.id || (t as unknown as Record<string, unknown>)._id;
    const currId = currentTutorial?.id || (currentTutorial as unknown as Record<string, unknown>)?._id;
    return tId === currId;
  });

  const handleBookmark = async () => {
    if (!currentTutorial) return;
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      setPendingAction("bookmark");
      setIsLoginModalOpen(true);
      return;
    }
    try {
      const tId = currentTutorial.id || (currentTutorial as unknown as Record<string, unknown>)._id;
      await bookmarkService.addBookmark(tId as string);
      setIsBookmarked(true);
    } catch (err: unknown) {
      const errObj = err as Record<string, unknown>;
      const resp = errObj?.response as Record<string, unknown> | undefined;
      if (resp?.status === 401) {
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
      const tId = currentTutorial.id || (currentTutorial as unknown as Record<string, unknown>)._id;
      await progressService.markProgressCompleted(tId as string);
      setIsCompleted(true);
    } catch (err: unknown) {
      const errObj = err as Record<string, unknown>;
      const resp = errObj?.response as Record<string, unknown> | undefined;
      if (resp?.status === 401) {
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

  const tutAny = currentTutorial as unknown as Record<string, unknown> | null;
  const branchObj = tutAny?.branch as Record<string, unknown> | undefined;
  const subjectObj = tutAny?.subject as Record<string, unknown> | undefined;
  const branchName = branchObj?.name ? (branchObj.name as string) : branch.replace(/-/g, " ");
  const subjectName = subjectObj?.name ? (subjectObj.name as string) : subjectSlug.replace(/-/g, " ");

  return (
    <div className="min-h-screen flex flex-col bg-white text-black selection:bg-black selection:text-white">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-[10px] sm:text-xs text-[#737373] mb-8">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3 text-[#A3A3A3]" />
          <Link href={`/${branch}`} className="hover:text-black transition-colors capitalize">{branchName}</Link>
          <ChevronRight className="h-3 w-3 text-[#A3A3A3]" />
          <Link href={`/${branch}/${subjectSlug}`} className="hover:text-black transition-colors capitalize">{subjectName}</Link>
          <ChevronRight className="h-3 w-3 text-[#A3A3A3]" />
          <span className="text-black font-medium capitalize truncate max-w-[200px] sm:max-w-xs">{currentTutorial?.title || currentTutorialSlug.replace(/-/g, " ")}</span>
        </nav>

        {isLoading ? (
          <div className="text-center py-24 text-[#737373] text-sm">Loading documentation...</div>
        ) : !currentTutorial ? (
          <Card className="p-12 text-center text-[#737373] border-[#E5E5E5] bg-white">
            Tutorial not found in database.
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Sidebar: Curriculum Tree (Notion Style) */}
            <aside className="hidden lg:block lg:col-span-4 border border-[#E5E5E5] rounded-xl bg-[#FAFAFA] p-5 space-y-5 sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
                <div className="font-semibold text-xs text-black uppercase tracking-wider flex items-center space-x-2">
                  <BookOpen className="h-3.5 w-3.5 text-black" />
                  <span>Curriculum ({tutorials.length})</span>
                </div>
              </div>
              <div className="space-y-4">
                {topicsList.map((group, gIdx) => {
                  const isOpen = openTopics[group.topicName] ?? true;
                  return (
                    <div key={gIdx} className="space-y-1.5">
                      <button
                        onClick={() => toggleTopic(group.topicName)}
                        className="w-full flex items-center justify-between font-semibold text-xs uppercase tracking-wider text-[#525252] py-1 px-1 hover:text-black transition-colors"
                      >
                        <span className="line-clamp-1">{group.topicName}</span>
                        <ChevronRight className={`h-3 w-3 shrink-0 transition-transform duration-150 ${isOpen ? "rotate-90" : ""}`} />
                      </button>

                      {isOpen && (
                        <div className="space-y-1 pl-2 border-l border-[#E5E5E5] ml-1 mt-1">
                          {group.tutorials.map((tut) => {
                            const tId = tut.id || (tut as unknown as Record<string, unknown>)._id;
                            const currId = currentTutorial.id || (currentTutorial as unknown as Record<string, unknown>)._id;
                            const isActive = tId === currId;
                            const tSlug = tut.slug;
                            const tAny = tut as unknown as Record<string, unknown>;
                            const bObj = tAny.branch as Record<string, unknown> | undefined;
                            const sObj = tAny.subject as Record<string, unknown> | undefined;
                            const bSlug = (bObj?.slug as string) || branch;
                            const sSlug = (sObj?.slug as string) || subjectSlug;
                            return (
                              <Link
                                key={tSlug}
                                href={`/${bSlug}/${sSlug}/${tSlug}`}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                                  isActive
                                    ? "bg-black text-white font-medium"
                                    : "text-[#525252] hover:bg-white hover:text-black"
                                }`}
                              >
                                <span className="line-clamp-1">{tut.title}</span>
                                {isActive && <CheckCircle className="h-3 w-3 shrink-0 ml-1 text-white" />}
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

            {/* Right Main Course Content (Notion Reading Area) */}
            <main className="lg:col-span-8 space-y-8 bg-white border border-[#E5E5E5] rounded-xl p-6 sm:p-12">
              <div className="space-y-4 border-b border-[#E5E5E5] pb-8">
                <div className="flex items-center space-x-3">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#FAFAFA] border border-[#E5E5E5] text-[#525252]">
                    {currentTutorial.difficulty || "Beginner"}
                  </span>
                  <div className="flex items-center text-xs text-[#737373]">
                    <Clock className="mr-1 h-3.5 w-3.5" />
                    {currentTutorial.readTime || "10 min read"}
                  </div>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black leading-tight">
                  {currentTutorial.title}
                </h1>
                <p className="text-[#737373] text-sm leading-relaxed">
                  {currentTutorial.description}
                </p>
                <div className="flex items-center justify-between text-xs text-[#737373] pt-3 border-t border-[#E5E5E5]">
                  <span className="font-medium text-black">Author: {currentTutorial.author?.name || "Expert Author"}</span>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs border-[#E5E5E5] hover:border-black" onClick={handleBookmark}>
                      <Bookmark className={`mr-1.5 h-3.5 w-3.5 ${isBookmarked ? "fill-black text-black" : "text-[#737373]"}`} />
                      {isBookmarked ? "Saved" : "Save"}
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs border-[#E5E5E5] hover:border-black" onClick={handleComplete}>
                      <CheckCircle className={`mr-1.5 h-3.5 w-3.5 ${isCompleted ? "text-black" : "text-[#737373]"}`} />
                      {isCompleted ? "Completed" : "Mark Complete"}
                    </Button>
                  </div>
                </div>
              </div>

              <article className="space-y-6 text-sm sm:text-base leading-relaxed text-[#171717]">
                <MarkdownRenderer content={currentTutorial.content} />

                {tutAny && Array.isArray(tutAny.codeBlocks) && (tutAny.codeBlocks as Record<string, unknown>[]).length > 0 && (
                  <div className="space-y-4 pt-4">
                    <h3 className="text-base font-bold text-black flex items-center space-x-2">
                      <Terminal className="h-4 w-4" />
                      <span>Code Example</span>
                    </h3>
                    {(tutAny.codeBlocks as Record<string, unknown>[]).map((cb: unknown, cIdx: number) => {
                      const cObj = cb as Record<string, unknown>;
                      return (
                        <CodeBlock key={cIdx} language={(cObj.language as string) || "javascript"} code={(cObj.code as string) || ""} />
                      );
                    })}
                  </div>
                )}

                {currentTutorial.quiz && currentTutorial.quiz.length > 0 && (
                  <div className="space-y-4 pt-8 border-t border-[#E5E5E5]">
                    <h3 className="text-base font-bold text-black">Knowledge Check</h3>
                    <QuizCard quiz={currentTutorial.quiz} />
                  </div>
                )}
              </article>

              {/* Pagination / Navigation between tutorials */}
              <div className="flex items-center justify-between pt-8 border-t border-[#E5E5E5] mt-12">
                {currentIndex > 0 ? (
                  <Link href={`/${branch}/${subjectSlug}/${tutorials[currentIndex - 1].slug}`}>
                    <Button variant="outline" className="h-9 text-xs font-medium border-[#E5E5E5] hover:border-black flex items-center space-x-2">
                      <ChevronLeft className="h-4 w-4" />
                      <span>Previous</span>
                    </Button>
                  </Link>
                ) : <div />}
                <div className="text-xs text-[#737373]">
                  Module {currentIndex > -1 ? currentIndex + 1 : 1} of {tutorials.length || 1}
                </div>
                {currentIndex > -1 && currentIndex < tutorials.length - 1 ? (
                  <Link href={`/${branch}/${subjectSlug}/${tutorials[currentIndex + 1].slug}`}>
                    <Button className="h-9 text-xs font-medium bg-black text-white hover:bg-[#262626] flex items-center space-x-2">
                      <span>Next</span>
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
