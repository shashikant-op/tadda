"client"
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Search, Menu, X, BookOpen, User as UserIcon, LogOut, Shield, ChevronDown, ChevronRight, FileText, Cpu, Globe, Brain, Cloud, Layers, Sparkles, FolderTree, BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth.store";

export function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [activeBranchSlug, setActiveBranchSlug] = useState("computer-science");

  // Global Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, logout } = useAuthStore();

  const branchesWithCourses = [
    {
      name: "Computer Science",
      slug: "computer-science",
      description: "Algorithms, Data Structures & Core CS",
      icon: Cpu,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      courses: [
        { name: "Data Structures & Algorithms", slug: "data-structures", defaultTutorial: "two-sum" },
        { name: "Object Oriented Programming", slug: "oop", defaultTutorial: "classes-objects" },
        { name: "Database Systems", slug: "databases", defaultTutorial: "sql-joins" },
        { name: "Operating Systems", slug: "operating-systems", defaultTutorial: "processes" },
      ],
    },
    {
      name: "Web Development",
      slug: "web-development",
      description: "Frontend, Backend & Full Stack Engineering",
      icon: Globe,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      courses: [
        { name: "Frontend Engineering (React 19)", slug: "frontend", defaultTutorial: "react-19-actions" },
        { name: "Backend Architecture (Node.js)", slug: "backend", defaultTutorial: "express-middleware" },
        { name: "Full Stack Development", slug: "full-stack", defaultTutorial: "auth-flow" },
      ],
    },
    {
      name: "Artificial Intelligence",
      slug: "ai-ml",
      description: "Machine Learning, LLMs & Neural Nets",
      icon: Brain,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      courses: [
        { name: "Machine Learning Basics", slug: "ml-basics", defaultTutorial: "linear-regression" },
        { name: "Deep Learning & Neural Networks", slug: "deep-learning", defaultTutorial: "cnn-basics" },
        { name: "Large Language Models & Transformers", slug: "llms", defaultTutorial: "transformer-architecture" },
      ],
    },
    {
      name: "Cloud & DevOps",
      slug: "cloud-devops",
      description: "Docker, Kubernetes, AWS & CI/CD",
      icon: Cloud,
      color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      courses: [
        { name: "Docker & Containers", slug: "docker", defaultTutorial: "dockerfile-basics" },
        { name: "Kubernetes Orchestration", slug: "kubernetes", defaultTutorial: "pods-deployments" },
        { name: "AWS Cloud Architecture", slug: "aws", defaultTutorial: "ec2-s3" },
      ],
    },
  ];

  const activeBranchData = branchesWithCourses.find((b) => b.slug === activeBranchSlug) || branchesWithCourses[0];

  // Comprehensive global search database including branches, subjects (courses), topics, tutorials, and subtopics
  const searchableItems = [
    // Subjects / Courses
    { title: "Data Structures & Algorithms", type: "Subject", branch: "computer-science", href: "/computer-science/data-structures" },
    { title: "Object Oriented Programming", type: "Subject", branch: "computer-science", href: "/computer-science/oop" },
    { title: "Database Systems", type: "Subject", branch: "computer-science", href: "/computer-science/databases" },
    { title: "Frontend Engineering (React 19)", type: "Subject", branch: "web-development", href: "/web-development/frontend/arrays/react-19-actions" },
    { title: "Backend Architecture (Node.js)", type: "Subject", branch: "web-development", href: "/web-development/backend/arrays/express-middleware" },
    { title: "Machine Learning Basics", type: "Subject", branch: "ai-ml", href: "/ai-ml/ml-basics/arrays/linear-regression" },
    { title: "Large Language Models & Transformers", type: "Subject", branch: "ai-ml", href: "/ai-ml/llms/arrays/transformer-architecture" },
    { title: "Docker & Containers", type: "Subject", branch: "cloud-devops", href: "/cloud-devops/docker/arrays/dockerfile-basics" },

    // Topics
    { title: "Arrays & Strings", type: "Topic", branch: "computer-science", href: "/computer-science/data-structures" },
    { title: "Linked Lists & Trees", type: "Topic", branch: "computer-science", href: "/computer-science/data-structures" },
    { title: "Searching & Sorting Algorithms", type: "Topic", branch: "computer-science", href: "/computer-science/data-structures" },
    { title: "React Components & Hooks", type: "Topic", branch: "web-development", href: "/web-development/frontend/arrays/react-19-actions" },
    { title: "Neural Networks & Attention", type: "Topic", branch: "ai-ml", href: "/ai-ml/llms/arrays/transformer-architecture" },

    // Tutorials & Subtopics
    { title: "Two Sum Algorithm", type: "Tutorial", branch: "computer-science", href: "/computer-science/data-structures/arrays/two-sum?subtopic=intro" },
    { title: "Brute Force Approach O(n²)", type: "Subtopic", branch: "computer-science", href: "/computer-science/data-structures/arrays/two-sum?subtopic=brute-force" },
    { title: "Optimized Hash Map Approach O(n)", type: "Subtopic", branch: "computer-science", href: "/computer-science/data-structures/arrays/two-sum?subtopic=hash-map" },
    { title: "TypeScript Implementation", type: "Subtopic", branch: "computer-science", href: "/computer-science/data-structures/arrays/two-sum?subtopic=typescript-code" },
    { title: "Python Implementation", type: "Subtopic", branch: "computer-science", href: "/computer-science/data-structures/arrays/two-sum?subtopic=python-code" },
    { title: "Knowledge Quiz & Assessment", type: "Subtopic", branch: "computer-science", href: "/computer-science/data-structures/arrays/two-sum?subtopic=quiz-assessment" },
    { title: "React 19 Server Actions", type: "Tutorial", branch: "web-development", href: "/web-development/frontend/react/react-19-actions?subtopic=intro" },
    { title: "Transformer Architecture & LLMs", type: "Tutorial", branch: "ai-ml", href: "/ai-ml/llms/transformers/transformer-architecture?subtopic=intro" },
    { title: "Docker Containerization", type: "Tutorial", branch: "cloud-devops", href: "/cloud-devops/docker/containers/dockerfile-basics?subtopic=intro" },
  ];

  const filteredSearchResults = searchQuery.trim() === "" ? [] : searchableItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glossy-nav">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xl shadow-md">
            TA
          </div>
          <span className="font-bold text-xl tracking-tight">TutorialsAdda</span>
        </Link>

        {/* Desktop Navigation with Glossy Transparent Split-Panel Dropdown */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <div
            className="relative"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button className="flex items-center space-x-1.5 py-2 transition-colors hover:text-primary font-medium">
              <Layers className="h-4 w-4 text-primary" />
              <span>Categories</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${categoriesOpen ? "rotate-180" : ""}`} />
            </button>

            {categoriesOpen && (
              <div className="absolute top-full left-0 w-[720px] rounded-2xl border border-white/20 dark:border-white/10 bg-background/70 backdrop-blur-2xl shadow-2xl z-50 grid grid-cols-12 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
                {/* Left Column: Branches list with glossy transparency */}
                <div className="col-span-5 border-r border-white/10 bg-muted/20 p-3 space-y-1">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                    Branches
                  </div>
                  {branchesWithCourses.map((branch) => {
                    const Icon = branch.icon;
                    const isSelected = branch.slug === activeBranchSlug;
                    return (
                      <div
                        key={branch.slug}
                        onMouseEnter={() => setActiveBranchSlug(branch.slug)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                          isSelected
                            ? "bg-primary text-primary-foreground font-semibold shadow-md"
                            : "hover:bg-muted/50 text-foreground"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`h-4 w-4 ${isSelected ? "text-primary-foreground" : "text-primary"}`} />
                          <span className="text-sm">{branch.name}</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      </div>
                    );
                  })}
                </div>

                {/* Right Column: Expanded Courses with glossy background */}
                <div className="col-span-7 p-6 space-y-4 bg-background/40 backdrop-blur-md flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-primary font-bold text-sm">
                      <Sparkles className="h-4 w-4" />
                      <span>{activeBranchData.name} Courses</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{activeBranchData.description}</p>

                    <div className="pt-2 space-y-2">
                      {activeBranchData.courses.map((course) => (
                        <Link
                          key={course.slug}
                          href={`/${activeBranchData.slug}/${course.slug}/arrays/${course.defaultTutorial}`}
                          onClick={() => setCategoriesOpen(false)}
                          className="block p-3 rounded-xl border border-white/10 bg-card/50 hover:border-primary hover:bg-primary/10 transition-all group shadow-sm"
                        >
                          <div className="font-semibold text-sm group-hover:text-primary flex items-center justify-between">
                            <span>{course.name}</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Explore structured tutorials, code examples & quizzes</div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Looking for a specific topic?</span>
                    <Link
                      href={`/${activeBranchData.slug}`}
                      onClick={() => setCategoriesOpen(false)}
                      className="text-primary font-semibold hover:underline"
                    >
                      View all in {activeBranchData.name} &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href="/computer-science" className="transition-colors hover:text-primary">
            Computer Science
          </Link>
          <Link href="/web-development" className="transition-colors hover:text-primary">
            Web Dev
          </Link>
          <Link href="/ai-ml" className="transition-colors hover:text-primary">
            AI & ML
          </Link>
        </nav>

        {/* Global Search Bar & Auth Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative w-64 lg:w-80" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subject, topic, subtopic..."
                className="pl-9 h-9 w-full text-sm bg-background/60 backdrop-blur-md border-white/20 shadow-sm"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
              />
            </form>

            {/* Global Search Autocomplete Dropdown */}
            {searchOpen && searchQuery.trim() !== "" && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-white/20 bg-background/80 backdrop-blur-2xl p-2 shadow-2xl z-50 max-h-96 overflow-y-auto space-y-1">
                <div className="text-xs font-semibold text-muted-foreground px-3 py-1 border-b border-white/10 flex justify-between">
                  <span>Matching Subjects, Topics & Tutorials</span>
                  <span>Type</span>
                </div>
                {filteredSearchResults.length > 0 ? (
                  filteredSearchResults.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-primary/10 transition-colors text-sm group"
                      onClick={() => setSearchOpen(false)}
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        {item.type === "Subject" ? (
                          <BookMarked className="h-4 w-4 text-primary shrink-0" />
                        ) : item.type === "Topic" ? (
                          <FolderTree className="h-4 w-4 text-primary shrink-0" />
                        ) : (
                          <FileText className="h-4 w-4 text-primary shrink-0" />
                        )}
                        <div className="overflow-hidden">
                          <div className="font-medium truncate group-hover:text-primary">{item.title}</div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {item.branch}
                          </div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                        item.type === "Subject" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                        item.type === "Topic" ? "bg-purple-500/10 text-purple-600 dark:text-purple-400" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {item.type}
                      </span>
                    </Link>
                  ))
                ) : (
                  <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                    No matching results found. Press Enter to search all.
                  </div>
                )}
              </div>
            )}
          </div>

          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3">
              <Link href={user.role === "admin" ? "/admin" : "/dashboard"}>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  {user.role === "admin" ? <Shield className="h-4 w-4 text-primary" /> : <UserIcon className="h-4 w-4" />}
                  <span>{user.name}</span>
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center space-x-2">
          <Link href="/search">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-background/80 backdrop-blur-2xl px-4 py-4 space-y-3">
          <div className="font-semibold text-xs text-muted-foreground uppercase px-2">Branches & Courses</div>
          {branchesWithCourses.map((branch) => (
            <div key={branch.slug} className="space-y-1">
              <Link
                href={`/${branch.slug}`}
                className="block px-2 py-1.5 text-sm font-medium hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {branch.name}
              </Link>
              <div className="pl-4 space-y-1 border-l ml-2">
                {branch.courses.map((course) => (
                  <Link
                    key={course.slug}
                    href={`/${branch.slug}/${course.slug}/arrays/${course.defaultTutorial}`}
                    className="block px-2 py-1 text-xs text-muted-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {course.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-white/10 flex flex-col space-y-2">
            {isAuthenticated && user ? (
              <>
                <Link href={user.role === "admin" ? "/admin" : "/dashboard"}>
                  <Button variant="outline" className="w-full justify-start">
                    <UserIcon className="mr-2 h-4 w-4" /> Dashboard ({user.name})
                  </Button>
                </Link>
                <Button variant="destructive" className="w-full justify-start" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="w-full">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
