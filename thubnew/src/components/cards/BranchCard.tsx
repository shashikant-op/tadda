import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Cpu, Globe, Brain, Cloud, Shield, Network } from "lucide-react";

interface BranchCardProps {
  name: string;
  slug: string;
  description: string;
  subjectCount?: number;
  icon?: string;
}

export function BranchCard({ name, slug, description, subjectCount, icon }: BranchCardProps) {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case "Cpu": return <Cpu className="h-6 w-6 text-primary" />;
      case "Globe": return <Globe className="h-6 w-6 text-primary" />;
      case "Brain": return <Brain className="h-6 w-6 text-primary" />;
      case "Cloud": return <Cloud className="h-6 w-6 text-primary" />;
      case "Shield": return <Shield className="h-6 w-6 text-primary" />;
      default: return <Network className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <Link href={`/${slug}`}>
      <Card className="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              {getIcon(icon)}
            </div>
            {subjectCount && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted">
                {subjectCount} Subjects
              </span>
            )}
          </div>
          <CardTitle className="text-xl mb-1">{name}</CardTitle>
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
