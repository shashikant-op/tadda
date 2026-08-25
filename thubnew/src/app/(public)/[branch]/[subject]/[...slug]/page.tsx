"use client";

import { use, useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { MarkdownRenderer } from "@/components/tutorial/MarkdownRenderer";
import { CodeBlock } from "@/components/tutorial/CodeBlock";
import { QuizCard } from "@/components/quiz/QuizCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bookmark, ChevronRight, ChevronLeft, CheckCircle, BookOpen, Terminal, Trash2, GripVertical, Pencil, Save as SaveIcon, X, Loader2 } from "lucide-react";
import { Tutorial } from "@/types";
import { tutorialService } from "@/services/tutorial.service";
import { bookmarkService } from "@/services/bookmark.service";
import { progressService } from "@/services/progress.service";
import { LoginModal } from "@/components/auth/LoginModal";
import { useAuthStore } from "@/store/auth.store";
import { topicService } from "@/services/topic.service";
import { GithubMarkdownEditor } from "@/components/editor/GithubMarkdownEditor";

interface PageProps {
  params: Promise<{
    branch: string;
    subject: string;
    slug: string[];
  }>;
}

export default function CatchAllTutorialPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { branch, subject: subjectSlug, slug: slugSegments } = resolvedParams;
  const { initializeAuth, user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsMounted(true);
      initializeAuth();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [initializeAuth]);

  const canEdit = isMounted && (user?.role === "admin" || user?.role === "author");

  if (branch === 'admin') {
    notFound();
  }
  const currentTutorialSlug = slugSegments[slugSegments.length - 1];

  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [currentTutorial, setCurrentTutorial] = useState<Tutorial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({});
  const [topicOrderOverride, setTopicOrderOverride] = useState<string[] | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"bookmark" | "complete" | null>(null);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [contentEditError, setContentEditError] = useState<string | null>(null);

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

          const tutorialRecord = tutorialData as unknown as Record<string, unknown>;
          const populatedBranch = tutorialRecord.branch as Record<string, unknown> | undefined;
          const populatedSubject = tutorialRecord.subject as Record<string, unknown> | undefined;
          const canonicalBranch = populatedBranch?.slug as string | undefined;
          const canonicalSubject = populatedSubject?.slug as string | undefined;
          if (canonicalBranch && canonicalSubject && (canonicalBranch !== branch || canonicalSubject !== subjectSlug)) {
            router.replace(`/${canonicalBranch}/${canonicalSubject}/${tutorialData.slug}`);
          }
        }

        const tutAny = tutorialData as unknown as Record<string, unknown> | null;
        const subObj = tutAny?.subject as Record<string, unknown> | undefined;
        // Subject slugs are only unique within a branch. Use the populated
        // subject id so a same-slug course in another branch cannot produce
        // an empty or incorrect curriculum.
        const subjectIdentifier = subObj?._id
          || subObj?.id
          || subObj?.slug
          || (tutAny?.subjectSlug as string)
          || subjectSlug;
        const res = await tutorialService.getTutorials(undefined, subjectIdentifier as string);
        const list = Array.isArray(res) ? [...res] : [];

        // The current published tutorial is authoritative. Keep it visible in
        // the curriculum if a stale cache or temporarily inconsistent list
        // response omits it.
        if (tutorialData) {
          const currentId = tutorialData.id || (tutorialData as unknown as Record<string, unknown>)._id;
          const isIncluded = list.some((tutorial) => {
            const tutorialId = tutorial.id || (tutorial as unknown as Record<string, unknown>)._id;
            return tutorialId === currentId || tutorial.slug === tutorialData?.slug;
          });
          if (!isIncluded) list.unshift(tutorialData);
        }
        setTutorials(list);
        setTopicOrderOverride(null);

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
  }, [branch, subjectSlug, currentTutorialSlug, router]);

  const topicsMap = new Map<string, { topicId: string; topicName: string; topicOrder: number; tutorials: Tutorial[] }>();
  tutorials.forEach((tut: unknown) => {
    const tObj = tut as Record<string, unknown>;
    const topicObj = tObj.topic as Record<string, unknown> | undefined;
    const topName = typeof tObj.topic === "object" && topicObj ? (topicObj.name as string) : ((tObj.topicSlug as string) || "General Modules");
    const topId = typeof tObj.topic === "object" && topicObj ? ((topicObj._id || topicObj.slug) as string) : ((tObj.topicSlug as string) || "general");
    const topicOrder = typeof topicObj?.order === "number" ? topicObj.order : Number.MAX_SAFE_INTEGER;
    if (!topicsMap.has(topId)) {
      topicsMap.set(topId, { topicId: topId, topicName: topName || "Module", topicOrder, tutorials: [] });
    }
    topicsMap.get(topId)!.tutorials.push(tObj as unknown as Tutorial);
  });
  const topicsList = Array.from(topicsMap.values()).sort((a, b) => {
    if (topicOrderOverride) {
      const aIndex = topicOrderOverride.indexOf(a.topicId);
      const bIndex = topicOrderOverride.indexOf(b.topicId);
      if (aIndex !== -1 || bIndex !== -1) {
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      }
    }
    return a.topicOrder - b.topicOrder;
  });

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
  const tutorialAuthor = tutAny?.author as Record<string, unknown> | undefined;
  const tutorialAuthorId = (tutorialAuthor?._id || tutorialAuthor?.id) as string | undefined;
  const currentUserRecord = user as unknown as Record<string, unknown> | null;
  const currentUserId = (currentUserRecord?.id || currentUserRecord?._id) as string | undefined;
  const canUpdateContent = canEdit && (user?.role === "admin" || Boolean(currentUserId && tutorialAuthorId && currentUserId === tutorialAuthorId));

  const startContentEditing = () => {
    if (!currentTutorial || !canUpdateContent) return;
    setEditedContent(currentTutorial.content);
    setContentEditError(null);
    setIsEditingContent(true);
  };

  const cancelContentEditing = () => {
    setEditedContent(currentTutorial?.content || "");
    setContentEditError(null);
    setIsEditingContent(false);
  };

  const saveContentChanges = async () => {
    if (!currentTutorial || !editedContent.trim() || !canUpdateContent) {
      setContentEditError("Lesson content cannot be empty.");
      return;
    }

    const tutorialId = currentTutorial.id || (currentTutorial as unknown as Record<string, unknown>)._id;
    if (!tutorialId) {
      setContentEditError("Unable to identify this lesson.");
      return;
    }

    try {
      setIsSavingContent(true);
      setContentEditError(null);
      await tutorialService.updateTutorial(tutorialId as string, { content: editedContent });
      setCurrentTutorial((previous) => previous ? { ...previous, content: editedContent } : previous);
      setTutorials((previous) => previous.map((tutorial) => {
        const id = tutorial.id || (tutorial as unknown as Record<string, unknown>)._id;
        return id === tutorialId ? { ...tutorial, content: editedContent } : tutorial;
      }));
      setIsEditingContent(false);
    } catch (error: unknown) {
      const errorRecord = error as Record<string, unknown>;
      const response = errorRecord.response as Record<string, unknown> | undefined;
      const responseData = response?.data as Record<string, unknown> | undefined;
      setContentEditError((responseData?.message as string) || "Failed to save lesson content.");
    } finally {
      setIsSavingContent(false);
    }
  };

  const branchObj = tutAny?.branch as Record<string, unknown> | undefined;
  const subjectObj = tutAny?.subject as Record<string, unknown> | undefined;
  const branchName = branchObj?.name ? (branchObj.name as string) : branch.replace(/-/g, " ");
  const subjectName = subjectObj?.name ? (subjectObj.name as string) : subjectSlug.replace(/-/g, " ");

  return (
    <div className="min-h-screen flex flex-col bg-[var(--canvas)] text-[var(--ink)] selection:bg-[var(--primary)] selection:text-[var(--primary-foreground)]">
      <Navbar />

      <div className="site-container flex-1 px-1 py-6 sm:px-4 sm:py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex min-w-0 items-center gap-1 overflow-hidden whitespace-nowrap font-mono text-[9px] uppercase tracking-[.08em] text-[var(--body)] sm:mb-10 sm:gap-2 sm:text-[10px]">
          <Link href="/" className="shrink-0 transition-colors hover:text-[var(--ink)]">Home</Link>
          <span aria-hidden="true" className="shrink-0">›</span>
          <Link href={`/${branch}`} className="max-w-[3.5rem] shrink-0 truncate capitalize transition-colors hover:text-[var(--ink)] sm:max-w-[8rem]">{branchName}</Link>
          <span aria-hidden="true" className="shrink-0">›</span>
          <Link href={`/${branch}/${subjectSlug}`} className="min-w-0 max-w-[5.5rem] truncate capitalize transition-colors hover:text-[var(--ink)] sm:max-w-[13rem]">{subjectName}</Link>
          <span aria-hidden="true" className="shrink-0">›</span>
          <span className="min-w-0 flex-1 truncate font-medium capitalize text-[var(--ink)]">{currentTutorial?.title || currentTutorialSlug.replace(/-/g, " ")}</span>
        </nav>

        {isLoading ? (
          <div className="text-center py-24 text-[var(--body)] text-sm">Loading documentation...</div>
        ) : !currentTutorial ? (
          <Card className="p-12 text-center text-[var(--body)] border-[var(--border)] bg-[var(--surface)]">
            Tutorial not found in database.
          </Card>
        ) : (
          <div className="grid grid-cols-1 items-start lg:grid-cols-12 lg:gap-0">
            {/* Left Sidebar: Curriculum Tree with Drag-and-Drop Sequencing & Bin */}
            <aside className="sticky top-20 hidden max-h-[calc(100vh-100px)] space-y-5 overflow-y-auto pr-7 lg:col-span-3 lg:block">
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center space-x-2 font-mono text-[10px] font-semibold uppercase tracking-[.12em] text-[var(--primary)]">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Curriculum ({tutorials.length})</span>
                </div>
              </div>
              <div className="space-y-5">
                {topicsList.map((group, gIdx) => {
                  const isOpen = openTopics[group.topicName] ?? true;
                  return (
                    <div
                      key={group.topicId}
                      data-topic-id={group.topicId}
                      data-topic-order={group.topicOrder}
                      className="space-y-2"
                      draggable={canEdit}
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", JSON.stringify({ type: "topic", id: group.topicId }));
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={async (e) => {
                        e.preventDefault();
                        if (!canEdit) return;
                        let data: { type?: string; id?: string } = {};
                        try {
                          data = JSON.parse(e.dataTransfer.getData("text/plain") || "{}");
                        } catch {
                          return;
                        }
                        if (data.type !== "topic" || data.id === group.topicId) return;

                        const oldIndex = topicsList.findIndex((topic) => topic.topicId === data.id);
                        if (oldIndex < 0) return;
                        const reorderedTopics = [...topicsList];
                        const [moved] = reorderedTopics.splice(oldIndex, 1);
                        reorderedTopics.splice(gIdx, 0, moved);
                        const previousOrder = topicOrderOverride;
                        try {
                          const topicIds = reorderedTopics.map((topic) => topic.topicId);
                          setTopicOrderOverride(topicIds);
                          const persisted = await topicService.reorderTopics(topicIds);
                          const persistedIds = persisted?.map((topic) => topic.id || (topic as unknown as Record<string, unknown>)._id);
                          if (persistedIds && persistedIds.join(",") !== topicIds.join(",")) {
                            throw new Error("The database returned a different topic order");
                          }
                        } catch {
                          setTopicOrderOverride(previousOrder);
                          alert("Failed to save the new topic order");
                        }
                      }}
                    >
                      <button
                        onClick={() => toggleTopic(group.topicName)}
                        className="flex w-full items-center justify-between px-1 py-1 text-left text-[11px] font-semibold tracking-[.02em] text-[var(--body)] transition-colors hover:text-[var(--ink)]"
                      >
                        <span className="line-clamp-1 flex items-center">
                          {canEdit && <GripVertical className="h-3 w-3 mr-1 text-gray-400 cursor-grab shrink-0" />}
                          {group.topicName}
                        </span>
                        <ChevronRight className={`h-3 w-3 shrink-0 transition-transform duration-150 ${isOpen ? "rotate-90" : ""}`} />
                      </button>

                      {isOpen && (
                        <div className="ml-1 mt-1 space-y-1 pl-2">
                          {group.tutorials.map((tut) => {
                            const tId = tut.id || (tut as unknown as Record<string, unknown>)._id;
                            const currId = currentTutorial?.id || (currentTutorial as unknown as Record<string, unknown>)._id;
                            const isActive = tId === currId;
                            const tSlug = tut.slug;
                            const tAny = tut as unknown as Record<string, unknown>;
                            const bObj = tAny.branch as Record<string, unknown> | undefined;
                            const sObj = tAny.subject as Record<string, unknown> | undefined;
                            const bSlug = (bObj?.slug as string) || branch;
                            const sSlug = (sObj?.slug as string) || subjectSlug;
                            return (
                              <div
                                key={tSlug}
                                draggable={canEdit}
                                onDragStart={(e) => {
                                  e.stopPropagation();
                                  e.dataTransfer.effectAllowed = "move";
                                  e.dataTransfer.setData("text/plain", JSON.stringify({ type: "tutorial", id: tId }));
                                }}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={async (e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (!canEdit) return;
                                  let data: { type?: string; id?: string } = {};
                                  try {
                                    data = JSON.parse(e.dataTransfer.getData("text/plain") || "{}");
                                  } catch {
                                    return;
                                  }
                                  if (data.type === "tutorial" && data.id !== tId) {
                                    const oldIndex = group.tutorials.findIndex(t => (t.id || (t as unknown as Record<string, unknown>)._id) === data.id);
                                    const newIndex = group.tutorials.findIndex(t => (t.id || (t as unknown as Record<string, unknown>)._id) === tId);
                                    if (oldIndex > -1 && newIndex > -1) {
                                      const reorderedGroup = [...group.tutorials];
                                      const [moved] = reorderedGroup.splice(oldIndex, 1);
                                      reorderedGroup.splice(newIndex, 0, moved);
                                      const updated = topicsList.flatMap((topic) => topic.topicId === group.topicId ? reorderedGroup : topic.tutorials);
                                      setTutorials(updated);
                                      try {
                                         const tutorialIds = reorderedGroup.map(t => t.id || (t as unknown as Record<string, unknown>)._id);
                                         const persisted = await tutorialService.reorderTutorials(tutorialIds as string[]);
                                         const persistedIds = persisted?.map(t => t.id || (t as unknown as Record<string, unknown>)._id);
                                         if (persistedIds && persistedIds.join(",") !== tutorialIds.join(",")) {
                                           throw new Error("The database returned a different lesson order");
                                         }
                                      } catch {
                                        setTutorials(tutorials);
                                        alert("Failed to save the new lesson order");
                                      }
                                    }
                                  }
                                }}
                              >
                                <Link
                                  href={`/${bSlug}/${sSlug}/${tSlug}`}
                                  className={`flex w-full items-center justify-between rounded-[8px] border-l-2 px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                                    isActive
                                      ? "border-[var(--primary)] bg-[var(--soft)] text-[#173524]"
                                      : "border-transparent text-[var(--body)] hover:bg-[var(--soft)] hover:text-[var(--ink)]"
                                  }`}
                                >
                                  <span className="line-clamp-1 flex items-center">
                                    {canEdit && <GripVertical className="h-3 w-3 mr-1 text-gray-400 cursor-grab shrink-0" />}
                                    {tut.title}
                                  </span>
                                  {isActive && <CheckCircle className="ml-1 h-3 w-3 shrink-0 text-[var(--primary)]" />}
                                </Link>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bin / Trash Drop Target for Admin and Author */}
              {canEdit && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={async (e) => {
                    e.preventDefault();
                    let data: { type?: string; id?: string } = {};
                    try {
                      data = JSON.parse(e.dataTransfer.getData("text/plain") || "{}");
                    } catch {
                      return;
                    }
                    if (!data.id) return;
                    if (data.type === "tutorial") {
                      if (confirm("Are you sure you want to delete this tutorial?")) {
                        try {
                          await tutorialService.deleteTutorial(data.id);
                          const remaining = tutorials.filter(t => (t.id || (t as unknown as Record<string, unknown>)._id) !== data.id);
                          setTutorials(remaining);
                          const currentId = currentTutorial?.id || (currentTutorial as unknown as Record<string, unknown>)?._id;
                          if (currentId === data.id) {
                            const nextTutorial = remaining[Math.min(Math.max(currentIndex, 0), remaining.length - 1)];
                            router.replace(nextTutorial ? `/${branch}/${subjectSlug}/${nextTutorial.slug}` : `/${branch}/${subjectSlug}`);
                          }
                        } catch {
                          alert("Failed to delete tutorial");
                        }
                      }
                    } else if (data.type === "topic") {
                      if (confirm("Are you sure you want to delete this topic and its lessons?")) {
                        try {
                          await topicService.deleteTopic(data.id);
                          const remaining = tutorials.filter(t => {
                            const tAny = t as unknown as Record<string, unknown>;
                            const topObj = tAny.topic as Record<string, unknown> | undefined;
                            const topicId = typeof tAny.topic === "object" && topObj
                              ? ((topObj._id || topObj.id || topObj.slug) as string)
                              : (tAny.topicSlug as string);
                            return topicId !== data.id;
                          });
                          setTutorials(remaining);
                          const currentId = currentTutorial?.id || (currentTutorial as unknown as Record<string, unknown>)?._id;
                          const currentStillExists = remaining.some(t => (t.id || (t as unknown as Record<string, unknown>)._id) === currentId);
                          if (!currentStillExists) {
                            router.replace(remaining[0] ? `/${branch}/${subjectSlug}/${remaining[0].slug}` : `/${branch}/${subjectSlug}`);
                          }
                        } catch {
                          alert("Failed to delete topic");
                        }
                      }
                    }
                  }}
                  className="mt-6 flex cursor-pointer items-center justify-center space-x-2 rounded-[8px] bg-[#eee4da] p-3 text-center text-xs font-semibold text-[#8a4c3c] transition-colors hover:bg-[#e8d8ca]"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Drag here to Delete (Bin)</span>
                </div>
              )}
            </aside>

            {/* Right Main Course Content (Notion Reading Area) */}
            <main className="space-y-7 !bg-white lg:col-span-9 lg:space-y-10 lg:border-l lg:border-[var(--border)] lg:pl-12 xl:pl-16">
              <div className="max-w-3xl space-y-4 pb-5 sm:space-y-5 sm:pb-8">
                <h1 className="text-[2rem] mt-4 font-semibold leading-[1.02] tracking-[-.05em] text-[var(--ink)] sm:text-5xl">
                  {currentTutorial.title}
                </h1>
                {currentTutorial.description?.trim().toLowerCase() !== currentTutorial.title.trim().toLowerCase() && <p className="max-w-2xl text-sm leading-6 text-[var(--body)] sm:text-base sm:leading-7">
                  {currentTutorial.description}
                </p>}
                <div className="flex items-center pt-1 text-xs text-[var(--body)]">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 rounded-[8px] px-2.5 text-xs text-[var(--body)] hover:bg-[var(--soft)] hover:text-[var(--ink)]" onClick={handleBookmark}>
                      <Bookmark className={`mr-1.5 h-3.5 w-3.5 ${isBookmarked ? "fill-black text-[var(--ink)]" : "text-[var(--body)]"}`} />
                      {isBookmarked ? "Saved" : "Save"}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 rounded-[8px] px-2.5 text-xs text-[var(--body)] hover:bg-[var(--soft)] hover:text-[var(--ink)]" onClick={handleComplete}>
                      <CheckCircle className={`mr-1.5 h-3.5 w-3.5 ${isCompleted ? "text-[var(--ink)]" : "text-[var(--body)]"}`} />
                      {isCompleted ? "Completed" : "Mark Complete"}
                    </Button>
                    {canUpdateContent && !isEditingContent && <Button variant="ghost" size="sm" className="h-8 rounded-[8px] px-2.5 text-xs text-[var(--body)] hover:bg-[var(--soft)] hover:text-[var(--ink)]" onClick={startContentEditing}>
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      Edit Content
                    </Button>}
                  </div>
                </div>
              </div>

              {isEditingContent ? <section className="max-w-3xl space-y-4" aria-label="Edit lesson content">
                {contentEditError && <div role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{contentEditError}</div>}
                <GithubMarkdownEditor initialContent={currentTutorial.content} onChange={setEditedContent} placeholder="Write the lesson content in Markdown..." />
                <div className="flex flex-wrap justify-end gap-2">
                  <Button type="button" variant="outline" onClick={cancelContentEditing} disabled={isSavingContent}>
                    <X className="mr-2 h-4 w-4" />Cancel
                  </Button>
                  <Button type="button" onClick={saveContentChanges} disabled={isSavingContent || !editedContent.trim()}>
                    {isSavingContent ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SaveIcon className="mr-2 h-4 w-4" />}
                    {isSavingContent ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </section> : <article className="max-w-3xl space-y-8 text-[15px] leading-7 text-[var(--ink)] sm:text-base sm:leading-8">
                <MarkdownRenderer content={currentTutorial.content} />

                {(() => {
                  if (!tutAny || !Array.isArray(tutAny.codeBlocks)) return null;
                  const validCodeBlocks = (tutAny.codeBlocks as Record<string, unknown>[]).filter(
                    (cb) => cb && typeof cb.code === "string" && cb.code.trim().length > 0
                  );
                  if (validCodeBlocks.length === 0) return null;

                  return (
                    <div className="space-y-4 pt-4">
                      <h3 className="text-base font-bold text-[var(--ink)] flex items-center space-x-2">
                        <Terminal className="h-4 w-4" />
                        <span>Code Example</span>
                      </h3>
                      {validCodeBlocks.map((cObj, cIdx) => (
                        <CodeBlock
                          key={cIdx}
                          language={(cObj.language as string) || "javascript"}
                          code={(cObj.code as string) || ""}
                        />
                      ))}
                    </div>
                  );
                })()}

                {currentTutorial.quiz && typeof currentTutorial.quiz === "object" && (
                  <div className="space-y-4 pt-8 border-t border-[var(--border)]">
                    <h3 className="text-base font-bold text-[var(--ink)]">Knowledge Check</h3>
                    <QuizCard quiz={currentTutorial.quiz} />
                  </div>
                )}
              </article>}

              {/* Pagination / Navigation between tutorials */}
              <div className="flex max-w-3xl items-center justify-between border-t border-[var(--border)] pt-7 mt-14">
                {currentIndex > 0 ? (
                  <Link href={`/${branch}/${subjectSlug}/${tutorials[currentIndex - 1].slug}`}>
                    <Button variant="ghost" className="flex h-9 items-center space-x-2 rounded-[8px] text-xs font-medium hover:bg-[var(--soft)]">
                      <ChevronLeft className="h-4 w-4" />
                      <span>Previous</span>
                    </Button>
                  </Link>
                ) : <div />}
                <div className="text-xs text-[var(--body)]">
                  Module {currentIndex > -1 ? currentIndex + 1 : 1} of {tutorials.length || 1}
                </div>
                {currentIndex > -1 && currentIndex < tutorials.length - 1 ? (
                  <Link href={`/${branch}/${subjectSlug}/${tutorials[currentIndex + 1].slug}`}>
                    <Button className="flex h-9 items-center space-x-2 rounded-[8px] bg-[var(--primary)] text-xs font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary)]">
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
