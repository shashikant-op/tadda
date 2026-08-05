"use client";

import Link from "next/link";
import { use, useState, useEffect } from "react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { TutorialCard } from "@/components/cards/TutorialCard";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Cpu, ChevronRight, AlertCircle } from "lucide-react";
import { Branch, Subject, Tutorial } from "@/types";
import { branchService } from "@/services/branch.service";
import { subjectService } from "@/services/subject.service";
import { tutorialService } from "@/services/tutorial.service";

interface PageProps {
  params: Promise<{
    branch: string;
  }>;
}

export default function DynamicBranchPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const branchSlug = resolvedParams.branch;

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
        const b = await branchService.getBranchBySlug(branchSlug);
        setBranch(b);
        const branchId = b?.id || (b as any)?._id;
        if (branchId) {
          const subs = await subjectService.getSubjects(branchId);
          setSubjects(Array.isArray(subs) ? subs : []);
          const tuts = await tutorialService.getTutorials(branchId);
          setTutorials(Array.isArray(tuts) ? tuts : []);
        }
      } catch (err: any) {
        console.error("Failed to load branch data", err);
        setErrorMessage(err.message || "Unable to fetch data from backend. Please ensure backend is running at http://localhost:5005");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [branchSlug]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
        <nav className="flex items-center space-x-2 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium capitalize">{branch?.name || branchSlug.replace("-", " ")}</span>
        </nav>

        {/* Header */}
        <div className="flex items-center space-x-4 mb-12 p-6 rounded-xl border bg-primary/5">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Cpu className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{branch?.name || branchSlug}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {branch?.description || `Explore engineering tutorials, subjects, and courses for ${branchSlug}.`}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-8 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div className="text-sm">
              <div className="font-semibold">Backend Connection Notice</div>
              <div>{errorMessage} (Start backend with: <code className="bg-background px-1.5 py-0.5 rounded">cd backend && npm run dev</code>)</div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">Loading branch and subjects from MongoDB...</div>
        ) : (
          <>
            {/* Subjects Grid */}
            <div className="space-y-6 mb-12">
              <h2 className="text-2xl font-bold tracking-tight">Subjects ({subjects.length})</h2>
              {subjects.length === 0 ? (
                <Card className="p-6 text-center text-muted-foreground">No subjects found for this branch in database.</Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {subjects.map((subject) => (
                    <Link key={subject.id || subject.slug} href={`/${branchSlug}/${subject.slug}`}>
                      <Card className="hover:shadow-md transition-all h-full">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-muted">
                              Subject
                            </span>
                          </div>
                          <CardTitle className="text-lg">{subject.name}</CardTitle>
                          <CardDescription className="line-clamp-2 mt-1">{subject.description || "Explore tutorials on " + subject.name}</CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Tutorials in Branch */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">Top Tutorials ({tutorials.length})</h2>
              {tutorials.length === 0 ? (
                <Card className="p-6 text-center text-muted-foreground">No tutorials found for this branch in database.</Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {tutorials.map((tutorial) => (
                    <TutorialCard key={tutorial.id} tutorial={tutorial} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
