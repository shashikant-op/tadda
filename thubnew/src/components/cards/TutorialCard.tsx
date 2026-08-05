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
      <Card className="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer h-full flex flex-col justify-between">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-primary/10 text-primary">
              {tutorial.difficulty || "Beginner"}
            </span>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-3.5 w-3.5" />
              {tutorial.readTime || "10 min read"}
            </div>
          </div>
          <CardTitle className="text-lg line-clamp-1">{tutorial.title}</CardTitle>
          <CardDescription className="line-clamp-2 mt-1">{tutorial.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
            <span className="font-medium text-foreground">{tutorial.author?.name || "Expert Author"}</span>
            <span className="uppercase tracking-wider">{subjectSlug}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
