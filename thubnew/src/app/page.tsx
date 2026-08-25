"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { BranchCard } from "@/components/cards/BranchCard";
import { TutorialCard } from "@/components/cards/TutorialCard";
import { homeService } from "@/services/home.service";
import { Branch, Subject, Tutorial } from "@/types";

function LoadingGrid({ count = 4 }: { count?: number }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Loading content">
    {Array.from({ length: count }).map((_, index) => <div key={index} className="h-56 rounded-[1.4rem] bg-[var(--soft)] p-6">
      <div className="skeleton-line h-3 w-20 rounded" /><div className="skeleton-line mt-10 h-7 w-3/4 rounded" /><div className="skeleton-line mt-3 h-3 w-full rounded" />
    </div>)}
  </div>;
}

export default function HomePage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [courses, setCourses] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    homeService.getHome()
      .then((data) => {
        if (!active) return;
        setBranches(data.branches);
        setTutorials(data.tutorials);
        setCourses(data.courses);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return <div className="min-h-screen">

    <Navbar />
    <main id="">
      <section className="relative isolate mx-auto w-full max-w-[80rem] overflow-hidden bg-transparent px-4 lg:grid lg:min-h-[42rem] lg:grid-cols-[.78fr_1.22fr] lg:items-center">
        <div className="relative z-30 flex flex-col justify-start pb-7 pt-9 sm:px-10 sm:pb-12 sm:pt-14 lg:min-h-0 lg:px-14 lg:py-24">
          <p className="eyebrow mb-4 flex items-center gap-3 sm:mb-6 lg:mb-7"><span className=" hidden sm:block h-px w-7 bg-[var(--primary)]" />Learn by building</p>
          <h1 className="max-w-[9ch] text-[3rem] font-semibold leading-[.94] tracking-[-.065em] text-[var(--ink)] sm:text-[4.25rem] lg:text-[5.6rem]">
            Understand the code you use.
          </h1>
          <p className="mt-5 max-w-[28rem] text-[.95rem] leading-6 text-[var(--body)] sm:mt-6 sm:text-lg lg:mt-7">Clear lessons that turn everyday engineering problems into lasting intuition.</p>
          <Link href={branches[0] ? `/${branches[0].slug}` : "/search"} className="group mt-6 inline-flex h-13 w-full max-w-[22rem] items-center justify-center gap-4 rounded-[10px] bg-[var(--primary)] px-7 text-sm font-semibold text-[var(--primary-foreground)] shadow-[0_18px_38px_-20px_rgba(36,77,56,.9)] ring-1 ring-white/20 transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:brightness-95 hover:shadow-[0_22px_42px_-20px_rgba(36,77,56,.95)] active:translate-y-0 active:scale-[.99] sm:mt-8 sm:h-14 sm:w-auto sm:min-w-52 sm:text-base">
            Start learning <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <div className="mt-4 hidden max-w-[22rem] flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[9px] uppercase tracking-[.11em] text-[var(--body)] sm:flex sm:max-w-none">
            <span>Concept first</span><span className="h-1 w-1 rounded-full bg-[var(--primary)]" /><span>Visual walkthroughs</span><span className="h-1 w-1 rounded-full bg-[var(--primary)]" /><span>Practical examples</span>
          </div>
        </div>
        <div className="absolute  inset-0 z-0 flex items-center justify-center overflow-hidden lg:relative lg:inset-auto lg:min-h-[42rem] lg:px-0">
          <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(82,116,95,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(82,116,95,.12)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_72%)]" />
          <div className="absolute left-[12%] top-[18%] h-48 w-48 rounded-full  blur-3xl sm:h-64 sm:w-64" />
          <Image src="/hero-code-learning.png" alt="Code on a laptop connected to a visual explanation" width={1672} height={941} priority className="absolute left-[56%] top-[54%] z-10 h-auto w-[145%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain opacity-45 saturate-[.82] drop-shadow-[0_28px_30px_rgba(36,50,40,.18)] sm:left-[60%] sm:w-[120%] lg:relative lg:left-auto lg:top-auto lg:w-full lg:max-w-[58rem] lg:-translate-x-3 lg:translate-y-0 lg:scale-[1.07] lg:opacity-100 lg:saturate-100" />
          <div className="hero-mobile-wash absolute inset-0 z-20 backdrop-blur-[.6px] lg:hidden" />


        </div>
      </section>

      <section className="mx-auto  w-full max-w-[80rem] px-5 pb-12 pt-8 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
        <div className="mb-9 grid gap-5 sm:mb-12 md:grid-cols-2 md:items-end">
          <div><p className="eyebrow">Choose a discipline</p><h2 className=" hidden sm:block mt-4 max-w-xl text-[2.15rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl">Start wide. Go deep where it matters.</h2></div>
          <p className=" hidden sm:block max-w-md text-sm leading-6 text-[var(--body)] md:justify-self-end">Each branch connects fundamentals, applied examples, quizzes, and longer reference material into one navigable path.</p>
        </div>
        {loading ? <LoadingGrid /> : branches.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {branches.map((branch, index) => <BranchCard key={branch.id || branch.slug} {...branch} subjectCount={branch.subjectCount || 0} icon={String(index + 1).padStart(2, "0")} />)}
        </div> : <p className="border-l-2 border-[var(--primary)] pl-5 text-[var(--body)]">No learning branches are published yet.</p>}
      </section>

      {courses.length > 0 && <section className="mx-auto w-full max-w-[80rem] border-b border-[var(--border)] bg-[var(--soft)] px-5 py-16 sm:px-10 sm:py-24 lg:border-x lg:px-14">
        <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
          <div><p className="eyebrow">Course index</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em]">Built in sequence.</h2><p className="mt-5 max-w-sm text-sm leading-6 text-[var(--body)]">Follow a syllabus from start to finish, or use it as a reference when a specific concept blocks your work.</p>{courses.length > 5 && <div className="mt-8 hidden items-center gap-3 font-mono text-[9px] uppercase tracking-[.14em] text-[var(--body)] lg:flex"><span className="h-px w-8 bg-[var(--body)]" />Scroll for {courses.length - 5} more</div>}</div>
          <div className="relative">
            <div className="mb-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[.14em] text-[var(--body)]"><span>{courses.length} learning paths</span>{courses.length > 5 && <span>Scroll ↓</span>}</div>
            <ol className="h-[27.5rem] snap-y overflow-y-auto overscroll-contain border-y border-[var(--border)] pr-2">{courses.map((course, index) => <li key={course.id || course.slug} className="h-[5.5rem] snap-start border-b border-[var(--border)] last:border-b-0">
              <Link href={`/${course.branchSlug || "computer-science"}/${course.slug}`} className="group relative grid h-full grid-cols-[3.25rem_1fr_auto] items-center gap-3 overflow-hidden border-l-2 border-transparent px-3 transition-[background-color,border-color] duration-200 hover:border-[var(--primary)] hover:bg-[var(--canvas)] sm:grid-cols-[4.25rem_1fr_auto] sm:px-4">
                <span className="grid h-8 w-8 place-items-center rounded-[7px] bg-[var(--soft)] font-mono text-[10px] text-[var(--body)] transition-colors group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-foreground)]">{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0"><span className="block truncate text-base font-semibold tracking-[-.025em] sm:text-lg">{course.name}</span><span className="mt-1 block max-w-xl truncate text-xs text-[var(--body)] sm:text-sm">{course.description || "A structured technical learning path."}</span></span>
                <span className="grid h-9 w-9 place-items-center rounded-[9px] text-[var(--primary)] transition-colors group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-foreground)]"><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
              </Link>
            </li>)}</ol>
          </div>
        </div>
      </section>}

      <section className="mx-auto   w-full max-w-[80rem] overflow-hidden px-5 py-14 sm:px-10 sm:py-24 lg:px-14">
        <div className="mb-8 flex  items-end justify-between gap-6 sm:mb-12"><div><p className="eyebrow">Recently published</p><h2 className="mt-3 max-w-[12ch] text-[2rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:mt-4 sm:max-w-none sm:text-4xl">Read something useful.</h2></div><Link href="/search" className="hidden items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:underline sm:flex">Browse the library <ArrowRight className="h-4 w-4" /></Link></div>
        {loading ? <LoadingGrid count={3} /> : tutorials.length ? <>
          <div className="  no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-5 sm:-mx-10 sm:px-10 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
            {tutorials.map((tutorial) => <div key={tutorial.id || tutorial.slug} className="w-[82vw] max-w-[21rem] shrink-0 snap-start md:w-auto md:max-w-none"><TutorialCard tutorial={tutorial} /></div>)}
          </div>
          <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 sm:hidden"><p className="font-mono text-[9px] uppercase tracking-[.14em] text-[var(--body)]">Swipe to browse</p><Link href="/search" className="flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)]">View all <ArrowRight className="h-3.5 w-3.5" /></Link></div>
        </> : <div className="flex min-h-48 items-center gap-5 border-y border-[var(--border)] py-10"><BookOpen className="h-9 w-9 text-[var(--primary)]" /><div><p className="font-semibold">The library is being prepared.</p><p className="mt-1 text-sm text-[var(--body)]">Published tutorials will appear here.</p></div></div>}
      </section>
    </main>
    <Footer />
  </div>;
}
