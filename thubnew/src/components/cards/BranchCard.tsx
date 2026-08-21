import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface BranchCardProps {
  name: string;
  slug: string;
  description: string;
  subjectCount?: number;
  icon?: string;
  image?: string;
}

export function BranchCard({ name, slug, description, subjectCount, icon, image }: BranchCardProps) {
  const branchSlug = slug || name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "computer-science";
  const backgroundImage = image?.trim();

  return (
    <Link href={`/${branchSlug}`} className={`interactive-lift group relative isolate flex min-h-56 flex-col justify-between overflow-hidden rounded-[1.4rem] p-6 focus-visible:outline-[var(--primary)] ${backgroundImage ? "bg-[#172019] text-white" : "bg-[var(--soft)]"}`}>
      {backgroundImage && <>
        <span
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          style={{ backgroundImage: `url(${JSON.stringify(backgroundImage)})` }}
        />
        <span aria-hidden="true" className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/48 to-black/20" />
      </>}
      <div className="relative z-20 flex items-start justify-between">
        <span className={`font-mono text-xs ${backgroundImage ? "text-white/75" : "text-[var(--body)]"}`}>{icon || "01"}</span>
        <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
      <div className="relative z-20">
        <h3 className="text-2xl font-semibold leading-tight tracking-[-0.035em]">{name}</h3>
        <p className={`mt-3 line-clamp-2 text-sm leading-6 ${backgroundImage ? "text-white/78" : "text-[var(--body)]"}`}>{description || "Concepts, applied lessons, and reference material."}</p>
        <p className={`mt-5 font-mono text-[10px] uppercase tracking-[.12em] ${backgroundImage ? "text-white/85" : "text-[var(--primary)]"}`}>{subjectCount || "Open"} {subjectCount === 1 ? "subject" : "subjects"}</p>
      </div>
    </Link>
  );
}
