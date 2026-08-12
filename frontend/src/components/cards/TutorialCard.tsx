import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Tutorial } from "@/types";

interface TutorialCardProps {
  tutorial: Tutorial;
}

export function TutorialCard({ tutorial }: TutorialCardProps) {
  const tutAny = tutorial as unknown as Record<string, unknown>;
  const branchObj = tutAny.branch as Record<string, unknown> | undefined;
  const subjectObj = tutAny.subject as Record<string, unknown> | undefined;
  const branchSlug = typeof tutAny.branch === "object" && branchObj ? (branchObj.slug as string) : ((tutAny.branchSlug as string) || "computer-science");
  const subjectSlug = typeof tutAny.subject === "object" && subjectObj ? (subjectObj.slug as string) : ((tutAny.subjectSlug as string) || "data-structures");
  const href = `/${branchSlug}/${subjectSlug}/${tutorial.slug}`;

  return (
    <Link href={href}>
      <Card className="transition-all hover:border-black cursor-pointer h-full flex flex-col justify-between border-[#E5E5E5] bg-white shadow-2xs rounded-xl p-5">
        <CardHeader className="p-0 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#FAFAFA] border border-[#E5E5E5] text-[#525252]">
              {tutorial.difficulty || "Beginner"}
            </span>
            <div className="flex items-center text-xs text-[#737373]">
              <Clock className="mr-1 h-3.5 w-3.5" />
              {tutorial.readTime || "10 min read"}
            </div>
          </div>
          <CardTitle className="text-base font-semibold text-black tracking-tight line-clamp-1">{tutorial.title}</CardTitle>
          <CardDescription className="text-xs text-[#737373] line-clamp-2 leading-relaxed">{tutorial.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-0 pt-4 mt-4 border-t border-[#E5E5E5]">
          <div className="flex items-center justify-between text-xs text-[#737373]">
            <span className="font-medium text-black">{tutorial.author?.name || "Expert Author"}</span>
            <span className="uppercase tracking-wider text-[10px] font-medium">{subjectSlug}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
