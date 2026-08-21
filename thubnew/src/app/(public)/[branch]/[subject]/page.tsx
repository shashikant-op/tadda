"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import { tutorialService } from "@/services/tutorial.service";
import { subjectService } from "@/services/subject.service";
import { Tutorial } from "@/types";

interface PageProps {
  params: Promise<{ branch: string; subject: string }>;
}

function belongsToSubject(tutorial: Tutorial, subjectSlug: string) {
  const record = tutorial as unknown as Record<string, unknown>;
  const subject = record.subject;
  const nestedSlug = typeof subject === "object" && subject !== null
    ? (subject as Record<string, unknown>).slug
    : undefined;

  return nestedSlug === subjectSlug || record.subjectSlug === subjectSlug || subject === subjectSlug;
}

export default function CourseEndpointPage({ params }: PageProps) {
  const { branch, subject } = use(params);
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "empty" | "error">("loading");

  if (branch === "admin") notFound();

  useEffect(() => {
    let active = true;

    async function openCoursePlayer() {
      try {
        // Public routes use slugs, while the tutorial endpoint filters by subject id.
        const subjectRecord = await subjectService.getSubjectBySlug(subject);
        const subjectId = subjectRecord.id || (subjectRecord as unknown as Record<string, unknown>)._id;
        const response = await tutorialService.getTutorials(undefined, subjectId as string);
        if (!active) return;

        const tutorials = Array.isArray(response) ? response : [];
        const firstTutorial = tutorials.find((tutorial) =>
          belongsToSubject(tutorial, subject) || belongsToSubject(tutorial, subjectId as string)
        ) || tutorials[0];

        if (!firstTutorial?.slug) {
          setStatus("empty");
          return;
        }

        router.replace(`/${branch}/${subject}/${firstTutorial.slug}`);
      } catch (error) {
        console.error("Unable to open course player", error);
        if (active) setStatus("error");
      }
    }

    openCoursePlayer();
    return () => { active = false; };
  }, [branch, subject, router]);

  return <div className="flex min-h-screen flex-col bg-[var(--canvas)] text-[var(--ink)]">
    <Navbar />
    <main className="mx-auto grid w-full max-w-[80rem] flex-1 place-items-center px-5 py-16">
      {status === "loading" ? <div className="w-full max-w-xl text-center" role="status" aria-live="polite">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[var(--soft)] text-[var(--primary)]"><BookOpen className="h-5 w-5" /></span>
        <p className="mt-5 text-sm font-semibold">Opening course player…</p>
        <p className="mt-2 text-xs text-[var(--body)]">Preparing the first lesson and curriculum.</p>
        <div className="mx-auto mt-6 h-1 w-44 overflow-hidden rounded-full bg-[var(--soft)]"><span className="block h-full w-1/2 animate-pulse rounded-full bg-[var(--primary)]" /></div>
      </div> : <div className="max-w-lg text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[var(--soft)] text-[var(--primary)]"><BookOpen className="h-5 w-5" /></span>
        <h1 className="mt-5 text-2xl font-semibold tracking-[-.035em]">{status === "empty" ? "Course content is being prepared" : "The course player is unavailable"}</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--body)]">{status === "empty" ? "This course does not have a published lesson yet." : "We could not load this course right now. Please try again shortly."}</p>
        <Link href={`/${branch}`} className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:underline"><ArrowLeft className="h-4 w-4" />Back to courses</Link>
      </div>}
    </main>
  </div>;
}
