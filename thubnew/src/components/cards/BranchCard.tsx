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
      <div className="relative bg-white border border-[#E5E5E5] rounded-2xl sm:rounded-3xl p-4 sm:p-7 flex flex-col justify-between h-44 sm:h-64 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-xl active:scale-[0.98] hover:border-black cursor-pointer">
        {/* Background Watermark Illustration */}
        <div className="absolute right-[-5px] bottom-[-5px] opacity-25 pointer-events-none group-hover:scale-110 group-hover:rotate-3 group-hover:opacity-35 transition-all duration-700">
          <img src={getWatermarkImage(name, icon, image)} alt="" className="w-28 h-28 sm:w-48 sm:h-48 object-contain" />
        </div>

        <div>
          <h3 className="text-base sm:text-2xl font-bold text-black tracking-tight group-hover:text-blue-700 transition-colors line-clamp-1">
            {name}
          </h3>
          <p className="text-[10px] sm:text-xs text-[#737373] mt-0.5 sm:mt-1 line-clamp-2">
            {subjectCount || 10} Subjects &middot; Explore tracks
          </p>
        </div>

        <div className="pt-2 sm:pt-8 relative z-10">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-black/20 flex items-center justify-center group-hover:bg-black group-hover:text-white group-hover:border-black group-hover:scale-105 transition-all duration-300 shadow-sm">
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
