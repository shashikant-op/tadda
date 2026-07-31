"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { tutorialService } from "@/services/tutorial.service";
import { Branch } from "@/types";
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Video,
  Code,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Search,
  Layers,
} from "lucide-react";

export default function AuthorCreateTutorialPage() {
  const router = useRouter();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [moduleTitle, setModuleTitle] = useState("Foundations");
  const [lessonTitle, setLessonTitle] = useState("Introduction to Types");
  const [description, setDescription] = useState("Learn TypeScript type system fundamentals, primitives, and inference.");
  const [content, setContent] = useState("Start writing your course content here... Use Markdown or rich formatting.");
  const [codeLanguage, setCodeLanguage] = useState("typescript");
  const [codeSnippet, setCodeSnippet] = useState(`interface User {\n  id: number;\n  name: string;\n  role: 'admin' | 'educator';\n}`);
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/embed/dQw4w9WgXcQ");
  const [activeSubtopic, setActiveSubtopic] = useState("Introduction to Types");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    tutorialService.getBranches()
      .then((data) => {
        setBranches(data);
        if (data && data.length > 0) {
          setSelectedBranch(data[0].id || "computer-science");
        }
      })
      .catch(() => {
        // fallback branch
        setSelectedBranch("67cba123456789012345678a");
      });
  }, []);

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

      // We need valid IDs or placeholders for branch, subject, topic
      const payload = {
        title: lessonTitle,
        description: description,
        content: content,
        branch: selectedBranch || "67cba123456789012345678a",
        subject: "67cba123456789012345678b",
        topic: "67cba123456789012345678c",
        codeBlocks: [
          {
            language: codeLanguage,
            code: codeSnippet,
          },
        ],
        video: {
          url: videoUrl,
          platform: "youtube",
        },
        status: status,
        seo: {
          title: `${lessonTitle} - Course Tutorial`,
          description: description,
          keywords: ["typescript", "tutorialsadda", "programming"],
        },
      };

      await tutorialService.createTutorial(payload);
      setSuccessMessage(status === "published" ? "Course & tutorial published successfully!" : "Draft saved successfully!");
      if (status === "published") {
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setErrorMessage(errorObj.response?.data?.message || "Failed to save tutorial. Please check inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/20 text-foreground">
      {/* Top Header matching screen.png */}
      <header className="border-b bg-background sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="font-bold text-xl tracking-tight text-primary flex items-center space-x-2">
              <span>TutorialsAdda</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">EDUCATOR PORTAL</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-muted-foreground">
              <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
              <Link href="/author/create" className="text-foreground font-semibold">My Courses</Link>
              <Link href="/admin" className="hover:text-foreground">Students</Link>
              <Link href="/admin" className="hover:text-foreground">Analytics</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center bg-muted px-3 py-1.5 rounded-md text-xs text-muted-foreground w-64">
              <Search className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <span>Search resources...</span>
              <span className="ml-auto bg-background px-1.5 py-0.5 rounded border text-[10px]">⌘K</span>
            </div>
            <div className="flex items-center space-x-3 border-l pl-4">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold">Dr. Alex Rivers</div>
                <div className="text-[10px] text-muted-foreground">Senior Educator</div>
              </div>
              <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                AR
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Subheader bar matching screen.png */}
      <div className="border-b bg-background px-4 py-3 shadow-xs">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center space-x-3">
              <h1 className="text-lg font-bold">Advanced TypeScript Mastery</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full border border-amber-500/20">
                Draft
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={() => handleSaveOrPublish("draft")}>
              <Eye className="mr-1.5 h-4 w-4" /> Preview
            </Button>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              onClick={() => handleSaveOrPublish("published")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publishing..." : "Publish Course"}
            </Button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="container mx-auto px-4 pt-4">
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
        {/* Left Sidebar: Curriculum Structure matching screen.png */}
        <aside className="lg:col-span-1 border rounded-xl bg-card p-4 space-y-6 sticky top-24 shadow-xs">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center space-x-2">
              <Layers className="h-4 w-4 text-primary" />
              <span>Curriculum Structure</span>
            </div>
            <Plus className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
          </div>

          <div className="space-y-5 text-sm">
            {/* Module 1 */}
            <div className="space-y-2">
              <div className="font-semibold text-xs text-foreground uppercase tracking-tight">
                Module 1: Foundations
              </div>
              <div className="space-y-1 pl-2 border-l ml-1">
                {["Introduction to Types", "Generics Deep Dive", "Union & Intersection"].map((lesson) => {
                  const isActive = activeSubtopic === lesson;
                  return (
                    <button
                      key={lesson}
                      onClick={() => {
                        setActiveSubtopic(lesson);
                        setLessonTitle(lesson);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <span className="line-clamp-1">{lesson}</span>
                      {isActive && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                    </button>
                  );
                })}
                <button className="w-full text-left px-3 py-1.5 text-xs font-medium text-primary hover:underline flex items-center space-x-1 pt-1">
                  <Plus className="h-3 w-3" />
                  <span>Add Subtopic</span>
                </button>
              </div>
            </div>

            {/* Module 2 */}
            <div className="space-y-1">
              <div className="font-semibold text-xs text-muted-foreground uppercase tracking-tight">
                Module 2: Advanced Patterns
              </div>
            </div>

            {/* Module 3 */}
            <div className="space-y-1">
              <div className="font-semibold text-xs text-muted-foreground uppercase tracking-tight">
                Module 3: Type Systems
              </div>
            </div>
          </div>

          <div className="pt-2 border-t">
            <Button variant="outline" size="sm" className="w-full text-xs border-dashed">
              <Plus className="h-3.5 w-3.5 mr-1.5" /> New Module
            </Button>
          </div>
        </aside>

        {/* Right Main Content Area matching screen.png */}
        <main className="lg:col-span-3 space-y-6">
          <Card className="shadow-xs border bg-card">
            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* Active content node header */}
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Active Content Node
                  </div>
                  <h2 className="text-xl font-extrabold">{lessonTitle}</h2>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleSaveOrPublish("draft")}>
                  <Save className="h-3.5 w-3.5 mr-1.5" /> Save Draft
                </Button>
              </div>

              {/* Module Title & Lesson Title Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Module Title</label>
                  <Input
                    value={moduleTitle}
                    onChange={(e) => setModuleTitle(e.target.value)}
                    placeholder="e.g. Foundations"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lesson Title</label>
                  <Input
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    placeholder="e.g. Introduction to Types"
                  />
                </div>
              </div>

              {/* Branch Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Engineering Branch</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                  <option value="67cba123456789012345678a">Computer Science (Default)</option>
                </select>
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

              {/* Formatting Toolbar */}
              <div className="border rounded-lg bg-muted/40 p-2 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <button className="px-2.5 py-1 rounded hover:bg-background font-bold">B</button>
                  <button className="px-2.5 py-1 rounded hover:bg-background italic">I</button>
                  <button className="px-2.5 py-1 rounded hover:bg-background">• List</button>
                  <span className="text-muted-foreground">|</span>
                  <button className="px-2.5 py-1 rounded hover:bg-background">🔗 Link</button>
                  <button className="px-2.5 py-1 rounded hover:bg-background">🖼 Image</button>
                  <button className="px-2.5 py-1 rounded hover:bg-background font-mono bg-background shadow-2xs">{'<>'} Code</button>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  LATEST SYNC: 2 MINS AGO
                </div>
              </div>

              {/* Main Content Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lesson Content (Markdown / Rich Text)</label>
                <textarea
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Start writing your course content here... Use Markdown or rich formatting."
                />
              </div>
            </CardContent>
          </Card>

          {/* Two Cards Side by Side matching screen.png */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add Lecture Video */}
            <Card className="border bg-card">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <Video className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-sm">Add Lecture Video</h3>
                </div>
                <div className="border-2 border-dashed rounded-xl p-6 text-center space-y-2 bg-muted/20">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div className="text-xs font-medium">MP4/WebM supported (max 500MB)</div>
                  <div className="text-[10px] text-muted-foreground">Or paste YouTube embed URL below</div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Video URL</label>
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
                    <span className="font-mono text-xs text-zinc-300">example_snippet.ts</span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="text-zinc-400 hover:text-zinc-100 p-1 rounded transition-colors"
                    title="Copy code"
                  >
                    {copiedCode ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  className="w-full bg-transparent font-mono text-xs text-emerald-300 resize-none focus:outline-none"
                  placeholder="interface User { ... }"
                />
                <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-[10px] text-zinc-400">
                  <span>Language: TypeScript</span>
                  <span>Syntax Highlighted</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Resources Section matching screen.png */}
          <Card className="border bg-card">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-sm">Learning Resources</h3>
                </div>
                <span className="text-xs text-primary font-medium cursor-pointer hover:underline">Manage All</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border rounded-lg p-3 flex items-center space-x-3 bg-muted/30">
                  <div className="h-9 w-9 rounded bg-red-500/10 text-red-600 flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold truncate">Cheat_Sheet.pdf</div>
                    <div className="text-[10px] text-muted-foreground">1.2 MB</div>
                  </div>
                </div>

                <div className="border rounded-lg p-3 flex items-center space-x-3 bg-muted/30">
                  <div className="h-9 w-9 rounded bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs">
                    ZIP
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold truncate">Exercise_Files.zip</div>
                    <div className="text-[10px] text-muted-foreground">45 MB</div>
                  </div>
                </div>

                <div className="border-2 border-dashed rounded-lg p-3 flex items-center justify-center space-x-2 text-muted-foreground hover:text-foreground cursor-pointer bg-muted/10">
                  <Plus className="h-4 w-4" />
                  <span className="text-xs font-medium">Attach Resource</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      <Footer />
    </div>
  );
}
