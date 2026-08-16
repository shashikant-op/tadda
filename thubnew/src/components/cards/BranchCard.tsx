import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface BranchCardProps {
  name: string;
  slug: string;
  description: string;
  subjectCount?: number;
  icon?: string;
  image?: string;
}

export function BranchCard({ name, slug, subjectCount, icon, image }: BranchCardProps) {
  const branchSlug = slug || name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "computer-science";

  const getWatermarkImage = (branchName: string, iconName?: string, customImage?: string) => {
    if (customImage) return customImage;
    const lower = branchName.toLowerCase();
    if (lower.includes("ai") || lower.includes("machine") || iconName === "Brain") return "/aiml.png";
    if (lower.includes("web") || iconName === "Globe") return "/file.svg";
    if (lower.includes("cyber") || iconName === "Shield") return "/window.svg";
    return "/aiml.png";
  };

  return (
    <Link href={`/${branchSlug}`} className="block group">
      <div className="relative bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-7 flex flex-col justify-between h-64 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-xl active:scale-[0.98] hover:border-black cursor-pointer">
        {/* Background Watermark Illustration */}
        <div className="absolute right-[-10px] bottom-[-10px] opacity-20 pointer-events-none group-hover:scale-110 group-hover:rotate-3 group-hover:opacity-30 transition-all duration-700">
          <img src={getWatermarkImage(name, icon, image)} alt="" className="w-48 h-48 object-contain" />
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-black tracking-tight group-hover:text-blue-700 transition-colors">
            {name}
          </h3>
          <p className="text-xs text-[#737373] mt-1 line-clamp-2">
            {subjectCount || 10} Subjects &middot; Explore syllabus & tracks
          </p>
        </div>

        <div className="pt-8 relative z-10">
          <div className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center group-hover:bg-black group-hover:text-white group-hover:border-black group-hover:scale-105 transition-all duration-300 shadow-sm">
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
