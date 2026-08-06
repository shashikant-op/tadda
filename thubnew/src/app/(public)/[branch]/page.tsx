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
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl space-y-10">
        <nav className="flex items-center space-x-2 text-xs text-[#6B7280]">
          <Link href="/" className="hover:text-black">Home</Link>
          <ChevronRight className="h-3 w-3 text-[#9CA3AF]" />
          <span className="text-black font-medium capitalize">{branch?.name || branchSlug.replace("-", " ")}</span>
        </nav>

        {/* Header */}
        <div className="flex items-center space-x-5 p-6 sm:p-8 rounded-2xl border border-[#E5E5E5] bg-[#F8F8F8]">
          <div className="p-4 rounded-xl bg-white border border-[#E5E5E5] text-black shadow-xs">
            <Cpu className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">{branch?.name || branchSlug}</h1>
            <p className="text-[#6B7280] text-sm mt-1">
              {branch?.description || `Explore engineering tutorials, subjects, and courses for ${branchSlug}.`}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] text-black flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-black" />
            <div className="text-sm">
              <div className="font-semibold">Backend Connection Notice</div>
              <div>{errorMessage}</div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-20 text-[#6B7280]">Loading branch and subjects...</div>
        ) : (
          <>
            {/* Subjects Grid */}
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black">Subjects ({subjects.length})</h2>
              {subjects.length === 0 ? (
                <div className="p-8 text-center text-[#6B7280] border border-[#E5E5E5] rounded-xl bg-white">No subjects found for this branch.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {subjects.map((subject) => (
                    <Link key={subject.id || subject.slug} href={`/${branchSlug}/${subject.slug}`}>
                      <div className="minimal-card p-6 h-full flex flex-col justify-between hover:border-black transition-colors">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[#F8F8F8] border border-[#E5E5E5] text-[#374151]">
                              Subject
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-black mb-1">{subject.name}</h3>
                          <p className="text-sm text-[#6B7280] line-clamp-2">{subject.description || "Explore tutorials on " + subject.name}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Tutorials in Branch */}
            <div className="space-y-6 pt-6">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black">Top Tutorials ({tutorials.length})</h2>
              {tutorials.length === 0 ? (
                <div className="p-8 text-center text-[#6B7280] border border-[#E5E5E5] rounded-xl bg-white">No tutorials found for this branch.</div>
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
