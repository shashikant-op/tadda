import Link from "next/link";
import { Cpu, Globe, Brain, Cloud, Shield, Network, ChevronRight } from "lucide-react";

interface BranchCardProps {
  name: string;
  slug: string;
  description: string;
  subjectCount?: number;
  icon?: string;
}

export function BranchCard({ name, slug, subjectCount, icon }: BranchCardProps) {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case "Cpu": return <Cpu className="h-4 w-4 text-black" />;
      case "Globe": return <Globe className="h-4 w-4 text-black" />;
      case "Brain": return <Brain className="h-4 w-4 text-black" />;
      case "Cloud": return <Cloud className="h-4 w-4 text-black" />;
      case "Shield": return <Shield className="h-4 w-4 text-black" />;
      default: return <Network className="h-4 w-4 text-black" />;
    }
  };

  return (
    <Link href={`/${slug}`}>
      <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 flex items-center justify-between transition-all hover:border-black cursor-pointer shadow-2xs group">
        <div className="flex items-center space-x-4">
          <div className="p-2.5 rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] group-hover:bg-black group-hover:text-white transition-colors">
            {getIcon(icon)}
          </div>
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-black group-hover:underline">{name}</h3>
            <p className="text-xs text-[#737373] mt-0.5">{subjectCount || 10} Subjects &middot; Explore syllabus</p>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-[#A3A3A3] group-hover:text-black group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}
