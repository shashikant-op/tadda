import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { Tutorial } from "@/types";

interface TutorialCardProps {
  tutorial: Tutorial;
}

export function TutorialCard({ tutorial }: TutorialCardProps) {
  const tutAny = tutorial as unknown as Record<string, unknown>;
  const branchObj = tutAny.branch as Record<string, unknown> | undefined;
  const subjectObj = tutAny.subject as Record<string, unknown> | undefined;
  const branchSlug = (typeof tutAny.branch === "object" && branchObj ? branchObj.slug : tutAny.branchSlug) as string | undefined;
  const subjectSlug = (typeof tutAny.subject === "object" && subjectObj ? subjectObj.slug : tutAny.subjectSlug) as string | undefined;
  const safeBranchSlug = branchSlug || "computer-science";
  const safeSubjectSlug = subjectSlug || "general";
  const href = `/${safeBranchSlug}/${safeSubjectSlug}/${tutorial.slug}`;
  const subjectLabel = safeSubjectSlug.replaceAll("-", " ");
  const subjectMark = subjectLabel.trim().charAt(0).toUpperCase() || "T";

  return (
    <Link
      href={href}
      aria-label={`Read ${tutorial.title}`}
      className="group block h-full rounded-[1.4rem] focus-visible:outline-[var(--primary)]"
    >
      <article className="editorial-shadow relative isolate flex h-full min-h-[17.5rem] flex-col overflow-hidden rounded-[1.2rem] bg-[var(--soft)] p-5 transition-[transform,background-color,box-shadow] duration-300 ease-out group-hover:-translate-y-1 group-hover:bg-[var(--border)] group-hover:shadow-[0_28px_64px_-38px_rgba(36,77,56,.62)] group-active:translate-y-0 group-active:scale-[.99] sm:min-h-80 sm:rounded-[1.4rem] sm:p-7">
        <div className="pointer-events-none absolute -right-4 -top-6 -z-10 font-mono text-[6rem] font-semibold leading-none text-[var(--primary)]/[.055] transition-transform duration-500 group-hover:-translate-x-1 group-hover:translate-y-1 sm:-right-7 sm:-top-10 sm:text-[9rem]" aria-hidden="true">
          {subjectMark}
        </div>

        <header className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] bg-[var(--primary)] font-mono text-[11px] font-semibold text-[var(--canvas)] sm:h-9 sm:w-9 sm:rounded-[9px] sm:text-xs">
              {subjectMark}
            </span>
            <div className="min-w-0">
              <p className="truncate font-mono text-[9px] font-semibold uppercase tracking-[.14em] text-[var(--primary)]">{subjectLabel}</p>
              <p className="mt-0.5 text-xs text-[var(--body)]">{tutorial.difficulty || "Beginner"}</p>
            </div>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[.1em] text-[var(--body)]">
            <Clock className="h-3.5 w-3.5 stroke-[1.7]" aria-hidden="true" />
            {tutorial.readTime || "10 min"}
          </span>
        </header>

        <div className="flex-1 pt-6 sm:pt-9">
          <h3 className="max-w-[18ch] text-[1.35rem] font-semibold leading-[1.08] tracking-[-.04em] text-[var(--ink)] text-balance sm:text-[1.8rem]">
            {tutorial.title}
          </h3>
          <p className="mt-3 line-clamp-2 max-w-[34rem] text-[13px] leading-5 text-[var(--body)] sm:mt-4 sm:text-sm sm:leading-6">
            {tutorial.description || "A focused technical lesson with practical context and clear examples."}
          </p>
        </div>

        <footer className="mt-6 flex items-center justify-end border-t border-[var(--border)] pt-4 sm:mt-8 sm:pt-5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[9px] border border-[#91a095] text-[var(--primary)] transition-colors duration-200 group-hover:bg-[var(--primary)] group-hover:text-[var(--canvas)] sm:h-10 sm:w-10 sm:rounded-[10px]">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </footer>
      </article>
    </Link>
  );
}
