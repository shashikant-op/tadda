"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { tutorialService } from "@/services/tutorial.service";
import { branchService } from "@/services/branch.service";
import { subjectService } from "@/services/subject.service";
import { topicService } from "@/services/topic.service";
import { useAuthStore } from "@/store/auth.store";
import { Footer } from "@/components/footer/Footer";
import { axiosInstance } from "@/lib/axios";
import { Branch, Subject, Topic } from "@/types";
import { GithubMarkdownEditor } from "@/components/editor/GithubMarkdownEditor";
import {
  Save,
  Plus,
  Video,
  Code,
  FileText,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Layers,
} from "lucide-react";

function AuthorCreateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { user } = useAuthStore();
  const dashboardHref = user?.role === "admin" ? "/admin" : user?.role === "author" ? "/author/dashboard" : "/dashboard";

  const [branches, setBranches] = useState<Branch[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  const [lessonTitle, setLessonTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("typescript");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/auth/login");
      return;
    }

    branchService.getBranches()
      .then(async (data) => {
        const list = Array.isArray(data) ? data : [];
        setBranches(list);

        if (editId) {
          try {
            const res = await axiosInstance.get(`/tutorials/${editId}?edit=true`);
            const tut = res.data.data.tutorial || res.data.data;
            if (tut) {
              setLessonTitle(tut.title || "");
              setDescription(tut.description || "");
              setContent(tut.content || "");
              if (tut.branch) {
                const bId = typeof tut.branch === "object" ? (tut.branch.id || tut.branch._id) : tut.branch;
                setSelectedBranch(bId);
              }
              if (tut.subject) {
                const sId = typeof tut.subject === "object" ? (tut.subject.id || tut.subject._id) : tut.subject;
                setSelectedSubject(sId);
              }
              if (tut.topic) {
                const tId = typeof tut.topic === "object" ? (tut.topic.id || tut.topic._id) : tut.topic;
                setSelectedTopic(tId);
              }
              if (tut.codeBlocks && tut.codeBlocks.length > 0) {
                setCodeLanguage(tut.codeBlocks[0].language || "typescript");
                setCodeSnippet(tut.codeBlocks[0].code || "");
              }
              if (tut.video && tut.video.url) {
                setVideoUrl(tut.video.url);
              }
            }
          } catch (err) {
            console.error("Failed to load tutorial for editing", err);
          }
        } else if (list.length > 0) {
          const bId = list[0].id || (list[0] as unknown as Record<string, unknown>)._id;
          setSelectedBranch(bId as string);
        }
      })
      .catch((err) => console.error("Failed to load branches", err));
  }, [router, editId]);

  useEffect(() => {
    if (selectedBranch) {
      subjectService.getSubjects(selectedBranch)
        .then((subs) => {
          const list = Array.isArray(subs) ? subs : [];
          setSubjects(list);
          if (list.length > 0) {
            const sId = list[0].id || (list[0] as unknown as Record<string, unknown>)._id;
            setSelectedSubject(sId as string);
          } else {
            setSelectedSubject("");
            setTopics([]);
          }
        })
        .catch(() => setSubjects([]));
    }
  }, [selectedBranch]);

  useEffect(() => {
    if (selectedSubject) {
      topicService.getTopics(selectedSubject)
        .then((tops) => {
          const list = Array.isArray(tops) ? tops : [];
          setTopics(list);
          if (list.length > 0) {
            const tId = list[0].id || (list[0] as unknown as Record<string, unknown>)._id;
            setSelectedTopic(tId as string);
          } else {
            setSelectedTopic("");
          }
        })
        .catch(() => setTopics([]));
    }
  }, [selectedSubject]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSaveOrPublish = async (status: "draft" | "published") => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      if (!selectedBranch || !selectedSubject || !selectedTopic) {
        throw new Error("Please select Branch, Subject, and Topic from the database.");
      }

      const payload = {
        title: lessonTitle,
        description: description,
        content: content,
        branch: selectedBranch,
        subject: selectedSubject,
        topic: selectedTopic,
        codeBlocks: codeSnippet.trim()
          ? [
              {
                language: codeLanguage,
                code: codeSnippet,
              },
            ]
          : [],
        video: videoUrl.trim()
          ? {
              url: videoUrl,
              platform: "youtube",
            }
          : undefined,
        status: status,
        seo: {
          title: `${lessonTitle} - Course Tutorial`,
          description: description,
          keywords: ["tutorialsadda", "engineering", "programming"],
        },
      };

      if (editId) {
        await tutorialService.updateTutorial(editId, payload);
        setSuccessMessage(status === "published" ? "Tutorial updated and published successfully!" : "Tutorial draft updated successfully!");
      } else {
        await tutorialService.createTutorial(payload);
        setSuccessMessage(status === "published" ? "Tutorial published successfully to MongoDB!" : "Draft saved successfully!");
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string; response?: { data?: { message?: string } } };
      setErrorMessage(errorObj.response?.data?.message || errorObj.message || "Failed to save tutorial. Please check inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/20 text-foreground">
      {/* Top Header */}
      <header className="border-b bg-background sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2.5">
              <img src="/logopng.png" alt="TutorialsAdda Logo" className="h-10 w-10 object-cover rounded-lg" />
              <span className="font-bold text-xl tracking-tight">TutorialsAdda</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-muted-foreground">
              <Link href={dashboardHref} className="hover:text-foreground">Dashboard</Link>
              <Link href="/author/create" className="text-foreground font-semibold">Course Publisher</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 border-l pl-4">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold">{user?.name || "Educator Author"}</div>
                <div className="text-[10px] text-muted-foreground capitalize">{user?.role || "Author"}</div>
              </div>
              <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : "EA"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Subheader bar */}
      <div className=" bg-background px-4 pt-5 ">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={() => handleSaveOrPublish("draft")}>
              <Save className="mr-1.5 h-4 w-4" /> Save Draft
            </Button>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-[var(--primary-foreground)] font-semibold"
              onClick={() => handleSaveOrPublish("published")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publishing..." : "Publish Tutorial"}
            </Button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="container mx-auto px-4 ">
        {successMessage && (
          <div className="p-3 mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 rounded-lg flex items-center space-x-2 text-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="p-3 mb-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg flex items-center space-x-2 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex-1 container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Sidebar: Database Hierarchy with Add Subject / Topic */}
        <aside className="lg:col-span-1 border rounded-xl bg-card p-4 space-y-6 sticky top-24 shadow-xs">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center space-x-2">
              <Layers className="h-4 w-4 text-primary" />
              <span>Database Hierarchy</span>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            {/* Branch Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Branch</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm"
              >
                {branches.map((b) => {
                  const bRec = b as unknown as Record<string, unknown>;
                  const bId = b.id || (bRec._id as string);
                  return (
                    <option key={bId} value={bId}>
                      {b.name}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Subject Selection + Add New Subject */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subject / Course</label>
                <button
                  type="button"
                  onClick={async () => {
                    const name = prompt("Enter new Subject / Course name:");
                    if (!name) return;
                    try {
                      const res = await axiosInstance.post("/subjects", { name, branch: selectedBranch, description: `Tutorials for ${name}` });
                      const newSub = res.data.data.subject;
                      const subRec = newSub as Record<string, unknown>;
                      setSubjects((prev) => [...prev, newSub]);
                      setSelectedSubject(newSub.id || (subRec._id as string));
                    } catch (err: unknown) {
                      const errObj = err as Record<string, unknown>;
                      const resp = errObj?.response as Record<string, unknown> | undefined;
                      const data = resp?.data as Record<string, unknown> | undefined;
                      alert((data?.message as string) || "Failed to create subject");
                    }
                  }}
                  className="text-[10px] text-primary font-bold hover:underline flex items-center"
                >
                  <Plus className="h-3 w-3 mr-0.5" /> Add Subject
                </button>
              </div>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm"
              >
                {subjects.length === 0 ? (
                  <option value="">No subjects found</option>
                ) : (
                  subjects.map((s) => {
                    const sRec = s as unknown as Record<string, unknown>;
                    const sId = s.id || (sRec._id as string);
                    return (
                      <option key={sId} value={sId}>
                        {s.name}
                      </option>
                    );
                  })
                )}
              </select>
            </div>

            {/* Topic Selection + Add New Topic */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Topic / Module</label>
                <button
                  type="button"
                  onClick={async () => {
                    const name = prompt("Enter new Topic / Module name:");
                    if (!name) return;
                    try {
                      const res = await axiosInstance.post("/topics", { name, subject: selectedSubject, description: `Modules for ${name}` });
                      const newTop = res.data.data.topic;
                      const topRec = newTop as Record<string, unknown>;
                      setTopics((prev) => [...prev, newTop]);
                      setSelectedTopic(newTop.id || (topRec._id as string));
                    } catch (err: unknown) {
                      const errObj = err as Record<string, unknown>;
                      const resp = errObj?.response as Record<string, unknown> | undefined;
                      const data = resp?.data as Record<string, unknown> | undefined;
                      alert((data?.message as string) || "Failed to create topic");
                    }
                  }}
                  className="text-[10px] text-primary font-bold hover:underline flex items-center"
                >
                  <Plus className="h-3 w-3 mr-0.5" /> Add Topic
                </button>
              </div>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm"
              >
                {topics.length === 0 ? (
                  <option value="">No topics found</option>
                ) : (
                  topics.map((t) => {
                    const tRec = t as unknown as Record<string, unknown>;
                    const tId = t.id || (tRec._id as string);
                    return (
                      <option key={tId} value={tId}>
                        {t.name}
                      </option>
                    );
                  })
                )}
              </select>
            </div>
          </div>
        </aside>

        {/* Right Main Content Area */}
        <main className="lg:col-span-3 space-y-6">
          <Card className="shadow-xs border bg-card">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Content Editor
                  </div>
                  <h2 className="text-xl font-extrabold">{lessonTitle}</h2>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleSaveOrPublish("draft")}>
                  <Save className="h-3.5 w-3.5 mr-1.5" /> Save Draft
                </Button>
              </div>

              {/* Lesson Title Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tutorial / Lesson Title</label>
                <Input
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="e.g. Advanced Data Structures"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Short Description / Summary</label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of what students will learn..."
                />
              </div>

              {/* Main Content GitHub Markdown Editor */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center space-x-1.5">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>Lesson Content (GitHub Markdown Editor with Cloudinary Image Drop & Upload)</span>
                </label>
                <GithubMarkdownEditor
                  initialContent={content}
                  onChange={(text) => setContent(text)}
                  placeholder="Type markdown here... Drag & drop or paste images to upload to Cloudinary."
                />
              </div>
            </CardContent>
          </Card>

          {/* Two Cards Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Video URL */}
            <Card className="border bg-card">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <Video className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-sm">Add Lecture Video</h3>
                </div>
                <div className="space-y-1 pt-4">
                  <label className="text-xs font-medium text-muted-foreground">Video Embed URL</label>
                  <Input
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/embed/..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Code Snippet Editor */}
            <Card className="border bg-zinc-950 text-zinc-50">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Code className="h-5 w-5 text-emerald-400" />
                    <span className="font-mono text-xs text-zinc-300">code_snippet.ts</span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="text-zinc-400 hover:text-zinc-100 p-1 rounded transition-colors"
                  >
                    {copiedCode ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  className="w-full bg-transparent font-mono text-xs text-emerald-300 resize-none focus:outline-none"
                  placeholder="console.log('Hello World');"
                />
                <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-[10px] text-zinc-400">
                  <span>Language: {codeLanguage}</span>
                  <span>Syntax Highlighted</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default function AuthorCreateTutorialPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground font-medium">Loading Course Editor...</div>}>
      <AuthorCreateForm />
    </Suspense>
  );
}
