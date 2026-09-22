"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Braces, Code2, Grid3X3, Play, Sparkles, Trophy, Zap } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { TutorialCard } from "@/components/cards/TutorialCard";
import { homeService } from "@/services/home.service";
import { Branch, Subject, Tutorial } from "@/types";

function CardSkeleton({ count = 4 }: { count?: number }) {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-label="Loading learning paths">
    {Array.from({ length: count }).map((_, index) => <div key={index} className="h-72 rounded-[1.6rem] border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="skeleton-line h-5 w-1/2 rounded" /><div className="skeleton-line mt-28 h-4 w-full rounded" /><div className="skeleton-line mt-3 h-4 w-2/3 rounded" />
    </div>)}
  </div>;
}

const categoryColors = ["category-green", "category-blue", "category-violet", "category-orange", "category-ink", "category-purple"];

export default function HomePage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [courses, setCourses] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    homeService.getHome().then((data) => {
      if (!active) return;
      setBranches(data.branches); setTutorials(data.tutorials); setCourses(data.courses);
    }).catch(() => {}).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const paths = courses.slice(0, 4);
  const categories = branches.length ? branches.slice(0, 6) : courses.slice(0, 6).map((course) => ({ ...course, subjectCount: 0 } as unknown as Branch));

  return <div className="min-h-screen overflow-hidden">
    <a href="#main-content" className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-lg bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-[var(--canvas)] transition-transform focus:translate-y-0">Skip to content</a>
    <Navbar />
    <main id="main-content">
      <section className="hero-shell">
        <div className="hero-copy">
          <p className="reference-kicker"><Sparkles className="h-4 w-4" /> AI-powered mastery</p>
          <h1>Learn anything.<br /><span>Master everything.</span></h1>
          <p>Interactive tutorials, clear explanations, coding playgrounds, and real-world projects designed for modern engineers.</p>
          <div className="hero-actions">
            <Link href={branches[0] ? `/${branches[0].slug}` : "/search"} className="primary-cta">Start learning <ArrowRight className="h-5 w-5" /></Link>
            <Link href="/search" className="secondary-cta">Explore tutorials</Link>
          </div>
          <div className="search-suggestions"><span>Try searching:</span><Link href="/search?q=binary%20search">“Teach binary search”</Link><Link href="/search?q=next.js%20auth">“Next.js auth patterns”</Link></div>
        </div>
        <div className="hero-visual" aria-label="Interactive learning workspace illustration">
          <div className="quick-card"><span><Zap className="h-5 w-5" /></span><div><strong>Quick start</strong><small>Continue your learning path</small></div></div>
          <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
          <Image src="/hero-code-learning.png" alt="Laptop showing an interactive code lesson" width={1672} height={941} priority sizes="(max-width: 900px) 100vw, 50vw" />
          <div className="floating-chip chip-ai"><Sparkles className="h-4 w-4" /> AI explanations</div>
          <div className="floating-chip chip-code"><Code2 className="h-5 w-5" /></div>
        </div>
      </section>

      <section className="reference-section learning-section">
        <header className="section-heading"><h2>Learning <span>paths</span></h2><Link href="/search">View all paths <ArrowRight className="h-5 w-5" /></Link></header>
        {loading ? <CardSkeleton /> : paths.length ? <div className="path-grid">{paths.map((course, index) => <Link key={course.id || course.slug} href={`/${course.branchSlug || "computer-science"}/${course.slug}`} className="path-card group">
          <span className="path-number">0{index + 1}</span><h3>{course.name}</h3><p>{course.description || "A structured path from core ideas to confident application."}</p><span className="path-arrow"><ArrowRight className="h-5 w-5" /></span>
        </Link>)}</div> : <p className="empty-line">Learning paths are being prepared.</p>}
      </section>

      <section className="reference-section categories-section">
        <header className="section-heading"><div><p className="reference-kicker">Built for working engineers</p><h2>Explore <span>categories</span></h2></div></header>
        {loading ? <CardSkeleton count={3} /> : <div className="category-grid">{categories.map((branch, index) => <Link href={`/${branch.slug}`} key={branch.id || branch.slug} className={`category-card ${categoryColors[index % categoryColors.length]}`}>
          {branch.image && <span className="category-image" style={{ backgroundImage: `url(${JSON.stringify(branch.image)})` }} />}
          <div className="category-content"><span className="category-label">{index === 0 ? "Popular" : `${String(index + 1).padStart(2, "0")} / Path`}</span><h3>{branch.name}</h3><p>{branch.description || "Focused lessons, practical examples, and guided projects."}</p><div className="category-meta"><span>{branch.subjectCount || "Curated"}<small>{branch.subjectCount ? " courses" : " syllabus"}</small></span><span className="category-button">Explore <ArrowRight className="h-4 w-4" /></span></div></div>
        </Link>)}</div>}
        <div className="all-categories"><Link href="/search"><Grid3X3 className="h-5 w-5" /> View all categories</Link></div>
      </section>

      <section className="playground-section">
        <header><p className="reference-kicker">Learn by doing</p><h2>Interactive playground</h2><p>Write, run, and understand code directly in your browser.</p></header>
        <div className="code-window">
          <div className="code-toolbar"><span className="window-dots"><i /><i /><i /></span><span>binary_search.py</span><button><Play className="h-3.5 w-3.5 fill-current" /> Run</button></div>
          <pre aria-label="Python binary search example"><code><span className="code-pink">def</span> <span className="code-purple">binary_search</span>(arr, target):{"\n"}    low = <span className="code-blue">0</span>{"\n"}    high = len(arr) - <span className="code-blue">1</span>{"\n\n"}    <span className="code-pink">while</span> low &lt;= high:{"\n"}        mid = (low + high) // <span className="code-blue">2</span>{"\n"}        <span className="code-pink">if</span> arr[mid] == target:{"\n"}            <span className="code-pink">return</span> mid</code></pre>
          <div className="code-hint"><Zap className="h-4 w-4" /> Think about why integer division keeps the midpoint valid.</div>
        </div>
        <div className="learning-stats"><article><div className="streak-ring">12</div><div><strong>Day streak</strong><span>Keep the momentum going</span></div></article><article><div className="badge-stack"><Trophy /><Braces /><Zap /></div><div><strong>Earned badges</strong><span>Track real progress</span></div></article><article><BookOpen /><div><strong>Focused lessons</strong><span>Short enough to finish</span></div></article></div>
      </section>

      <section className="reference-section latest-section">
        <header className="section-heading"><div><p className="reference-kicker">Recently published</p><h2>Keep <span>learning</span></h2></div><Link href="/search">Browse library <ArrowRight className="h-5 w-5" /></Link></header>
        {tutorials.length ? <div className="tutorial-grid">{tutorials.slice(0, 3).map((tutorial) => <TutorialCard key={tutorial.id || tutorial.slug} tutorial={tutorial} />)}</div> : !loading && <p className="empty-line">Published tutorials will appear here.</p>}
      </section>
    </main>
    <Footer />
  </div>;
}
