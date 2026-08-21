"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { AlertCircle, ArrowRight, ChevronRight, Cpu } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { TutorialCard } from "@/components/cards/TutorialCard";
import { Branch, Subject, Tutorial } from "@/types";
import { branchService } from "@/services/branch.service";
import { subjectService } from "@/services/subject.service";
import { tutorialService } from "@/services/tutorial.service";

interface PageProps { params: Promise<{ branch: string }>; }

function PageSkeleton() {
  return <div className="space-y-5 py-8" aria-label="Loading branch">
    <div className="skeleton-line h-4 w-28 rounded" />
    <div className="skeleton-line h-20 w-full rounded-xl" />
    <div className="grid gap-3 sm:grid-cols-2"><div className="skeleton-line h-40 rounded-xl" /><div className="skeleton-line h-40 rounded-xl" /></div>
  </div>;
}

export default function DynamicBranchPage({ params }: PageProps) {
  const { branch: branchSlug } = use(params);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const branchData = await branchService.getBranchBySlug(branchSlug);
        setBranch(branchData);
        const branchId = branchData?.id || (branchData as unknown as Record<string, unknown>)?._id;
        if (branchId) {
          const [subjectData, tutorialData] = await Promise.all([
            subjectService.getSubjects(branchId as string),
            tutorialService.getTutorials(branchId as string),
          ]);
          setSubjects(Array.isArray(subjectData) ? subjectData : []);
          setTutorials(Array.isArray(tutorialData) ? tutorialData : []);
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "The branch could not be loaded.";
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [branchSlug]);

  const branchName = branch?.name || branchSlug.replaceAll("-", " ");
  const branchMark = branchName.trim().charAt(0).toUpperCase() || "B";

  return <div className="min-h-screen bg-[var(--canvas)]">
    <Navbar />
    <main className="bg-[var(--canvas)]">
      <div className="site-container  bg-[var(--canvas)]">
        <nav aria-label="Breadcrumb" className="flex h-8  items-center gap-2 border-b border-[var(--border)]  px-1  font-mono text-[10px] uppercase tracking-[.12em] text-[var(--body)] sm:px-4 lg:px-14">
          <Link href="/" className="transition-colors hover:text-[var(--primary)]">Library</Link><ChevronRight className="h-3 w-3" /><span className="truncate text-[var(--ink)]">{branchName}</span>
        </nav>

        <header className="relative  isolate grid overflow-hidden border-b border-[var(--border)] lg:grid-cols-[1.35fr_.65fr]">
          <div className="bg-[var(--soft)] px-5 py-4 sm:px-10 sm:py-10 lg:px-14">
            <p className="eyebrow">Engineering branch</p>
            <h1 className="mt-5 text-5xl font-semibold capitalize leading-none tracking-[-.055em] sm:text-7xl">{branchName}</h1>
            <p className="mt-6 max-w-xl text-sm leading-6 text-[var(--body)] sm:text-base sm:leading-7">{branch?.description || `Courses and technical references organized for ${branchName}.`}</p>
            <div className="mt-10 flex gap-8 border-t border-[var(--border)] pt-5 font-mono text-[10px] uppercase tracking-[.12em] text-[var(--body)]"><span><strong className="mr-2 text-lg font-medium text-[var(--primary)]">{subjects.length}</strong>subjects</span><span><strong className="mr-2 text-lg font-medium text-[var(--primary)]">{tutorials.length}</strong>tutorials</span></div>
          </div>
          <div className="relative hidden min-h-80 overflow-hidden border-l border-[var(--border)] bg-[var(--primary)] text-[var(--canvas)] lg:block">
            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:44px_44px]" />
            <span className="absolute -bottom-16 right-4 font-mono text-[15rem] font-semibold leading-none text-[var(--primary-foreground)]/[.08]">{branchMark}</span>
            <Cpu className="absolute left-10 top-10 h-12 w-12 stroke-[1.25]" />
          </div>
        </header>

        <section aria-labelledby="courses-rail-heading" className="border-b border-[var(--border)] bg-[var(--canvas)] py-5">
          <h2 id="courses-rail-heading" className="sr-only">Courses in {branchName}</h2>
          {isLoading ? <div className="no-scrollbar flex gap-3 overflow-hidden px-5 sm:px-10 lg:px-14">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="skeleton-line h-[4.75rem] w-64 shrink-0 rounded-[12px]" />)}</div> : subjects.length ? <nav aria-label={`${branchName} courses`} className="no-scrollbar flex snap-x gap-3 overflow-x-auto px-5 py-1 sm:px-10 lg:px-14">
            {subjects.map((subject, index) => <Link key={subject.id || subject.slug} href={`/${branchSlug}/${subject.slug}`} className="editorial-shadow group relative isolate flex h-[4.75rem] min-w-[16.5rem] snap-start items-center gap-3 overflow-hidden rounded-[12px] border border-[#aeb4ad] bg-[var(--surface)] px-3.5 transition-[background-color,color,transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--canvas)] hover:shadow-[0_18px_38px_-24px_rgba(36,77,56,.8)] active:translate-y-0 active:scale-[.99]">
              <span className="pointer-events-none absolute -bottom-8 -right-2 -z-10 font-mono text-[5.5rem] font-semibold leading-none text-[var(--primary)]/[.045] transition-colors group-hover:text-[var(--primary-foreground)]/[.055]" aria-hidden="true">{subject.name.trim().charAt(0).toUpperCase() || "C"}</span>
              <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-[9px] bg-[var(--soft)] font-mono text-[11px] font-semibold text-[var(--primary)] shadow-[inset_0_0_0_1px_rgba(36,77,56,.12)] transition-colors group-hover:bg-[var(--surface)]/10 group-hover:text-[var(--primary-foreground)]">{String(index + 1).padStart(2, "0")}</span>
              <span className="relative min-w-0 flex-1"><span className="block truncate text-sm font-semibold tracking-[-.02em]">{subject.name}</span><span className="mt-1 block font-mono text-[8px] uppercase tracking-[.14em] text-[#788078] transition-colors group-hover:text-[#b9ccbe]">Open course</span></span>
              <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-[8px] border border-[#c3c8c3] transition-colors group-hover:border-white/25 group-hover:bg-[var(--surface)]/10"><ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
            </Link>)}
          </nav> : <p className="px-5 text-sm text-[var(--body)] sm:px-10 lg:px-14">No courses have been published yet.</p>}
        </section>

        <div className="bg-[var(--canvas)] px-5 pb-20 pt-14 sm:px-10 sm:pb-24 sm:pt-20 lg:px-14">
          {errorMessage && <div className="mb-10 flex items-start gap-3 border-l-2 border-[#9a5d4c] bg-[#eee4da] p-4 text-sm text-[#5d3429]"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><div><p className="font-semibold">The library is temporarily unavailable.</p><p className="mt-1 text-xs leading-5">{errorMessage}</p></div></div>}
          {isLoading ? <PageSkeleton /> : <>
            <section aria-labelledby="tutorials-heading">
              <div className="mb-8 flex items-end justify-between gap-5"><div><p className="eyebrow">Recommended reading</p><h2 id="tutorials-heading" className="mt-3 text-3xl font-semibold tracking-[-.045em] sm:text-4xl">Tutorials in {branchName}.</h2></div><Link href="/search" className="hidden items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:underline sm:flex">Search all <ArrowRight className="h-4 w-4" /></Link></div>
              {tutorials.length === 0 ? <div className="border-y border-[var(--border)] py-10 text-sm text-[var(--body)]">No tutorials have been published for this branch yet.</div> : <><div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-5 sm:-mx-10 sm:px-10 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">{tutorials.map((tutorial) => <div key={tutorial.id || tutorial.slug} className="w-[82vw] max-w-[21rem] shrink-0 snap-start md:w-auto md:max-w-none"><TutorialCard tutorial={tutorial} /></div>)}</div><p className="border-t border-[var(--border)] pt-4 font-mono text-[9px] uppercase tracking-[.14em] text-[var(--body)] md:hidden">Swipe to browse</p></>}
            </section>
          </>}
        </div>
      </div>
    </main>
    <Footer />
  </div>;
}
