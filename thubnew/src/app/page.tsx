"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, ArrowRight, BookOpen, Award, Users, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { BranchCard } from "@/components/cards/BranchCard";
import { TutorialCard } from "@/components/cards/TutorialCard";
import { branchService } from "@/services/branch.service";
import { tutorialService } from "@/services/tutorial.service";
import { Branch, Tutorial } from "@/types";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [featuredTutorials, setFeaturedTutorials] = useState<Tutorial[]>([]);

  useEffect(() => {
    branchService.getBranches()
      .then((data) => setBranches(Array.isArray(data) ? data : []))
      .catch(() => setBranches([]));

    tutorialService.getTutorials()
      .then((data) => setFeaturedTutorials(Array.isArray(data) ? data.slice(0, 6) : []))
      .catch(() => setFeaturedTutorials([]));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black selection:bg-black selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative  overflow-py-20    py-6 border-b border-[#E5E5E5] bg-white">
          <div className="absolute scale-310 top-40 left-[-30] sm:scale-540 sm:left-140 sm:top-100 hover:left-142 hover:top-102  opacity-20 hover:opacity-30 transition-all duration-500">
          <img
            src="/aiml.png"
            alt=""
            className="w-48 h-48 object-contain"
          />
        </div>
          <div className="container mx-auto px-4 sm:px-6 py-2 md:py-8  lg:px-8 text-center max-w-4xl space-y-8">
            <div className="inline-flex items-center px-1 rounded-full border border-[#E5E5E5] bg-[#FAFAFA] px-3.5 py-1 text-[10px] md:!text-xs font-medium text-[#525252]">
              <Terminal className="mr-2  h-3.5 w-3.5 text-black" />
              Engineering Knowledge Base &middot; 
            </div>
            <h1 className="text-4xl sm:text-3xl  md:text-7xl font-bold tracking-tight text-black leading-[1.4] sm:leading-[1.1]">
              Master Engineering. <br />
              Without the Noise.
            </h1>
            <p className="text-base text-[12px] sm:text-lg mt-[-20px]  text-[#737373] max-w-2xl mx-auto leading-relaxed">
              A pristine technical platform for computer science and modern systems engineering. Zero clutter. Pure content.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto w-full pt-2">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[#737373]" />
                <Input
                  placeholder="Search algorithms, React, Docker..."
                  className="pl-10 h-11 w-full bg-[#FAFAFA] border-[#E5E5E5] text-sm text-black focus-visible:ring-0 focus-visible:border-black"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link href={`/search?q=${encodeURIComponent(searchQuery)}`} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-11 px-6 bg-black text-white hover:bg-[#262626] text-sm font-medium">Explore</Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 sm:pt-16 border-t border-[#E5E5E5] text-left max-w-3xl mx-auto">
              <div className="p-4 h-24 overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#FAFAFA]">
                <BookOpen className=" h-5  w-5 text-black mb-2" />
                <div className="font-bold text-xl text-black">50+</div>
                <div className="text-xs text-[#737373] mt-0.5">Tutorials</div>
              </div>
              <div className="p-4 h-24 overflow-hidden   rounded-xl border border-[#E5E5E5] bg-[#FAFAFA]">
                <Award className="h-5 w-5 text-black mb-2" />
                <div className="font-bold text-xl text-black">50+</div>
                <div className="text-xs text-[#737373] mt-0.5">Quizzes</div>
              </div>
              <div className="p-4  h-24 overflow-hidden   rounded-xl border border-[#E5E5E5] bg-[#FAFAFA]">
                <Users className="h-5 w-5 text-black mb-2" />
                <div className="font-bold text-xl text-black">1.5k+</div>
                <div className="text-xs text-[#737373] mt-0.5">Learners</div>
              </div>
              <div className="p-4 h-24 overflow-hidden   rounded-xl border border-[#E5E5E5] bg-[#FAFAFA]">
                <Terminal className="h-5 w-5 text-black mb-2" />
                <div className="font-bold text-xl text-black">100%</div>
                <div className="text-xs text-[#737373] mt-0.5">Open Access</div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Branches Section */}
        <section className="py-4  md:py-18 border-b border-[#E5E5E5] bg-white">
          <div className="container mx-auto px-4  sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex items-end  justify-between mb-4 sm:mb-12">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">Learning  <span className="text-blue-700">Branches</span></h2>
                <p className="text-[#737373] text-sm mt-1">Structured knowledge tracks </p>
              </div>
            </div>
            {branches.length === 0 ? (
              <div className="text-center py-4 sm:py-16 text-[#737373]">Loading branches...</div>
            ) : (
              
              <div className="grid grid-cols-1 h-50 overflow-y-scroll !scrollbar-hide py-2  md:grid-cols-2 lg:grid-cols-3 gap-4">
                {branches.map((branch) => (
                  <BranchCard
                    key={branch.id || branch.slug}
                    name={branch.name}
                    slug={branch.slug}
                    description={branch.description}
                    subjectCount={branch.subjectCount || 10}
                    icon={branch.icon || "Cpu"}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Featured Tutorials Section */}
        <section className="py-10 md:py-28 bg-[#FAFAFA] border-b border-[#E5E5E5]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex items-end justify-between mb-4 sm:mb-18">
              <div className="w-full">
                <div className="flex justify-between">
                  <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">Featured  <span className="text-blue-700">Tutorials</span></h2>

                  </div>
                   <Link href="/search">
                <Button variant="ghost" className="text-xs font-medium text-black hover:bg-[#F0F0F0] flex items-center space-x-1.5">
                  <span>View all</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
                </div>

                <p className="text-[#737373] text-sm mt-1">Hand-crafted tutorials.</p>

              </div>
             
              
            </div>
            {featuredTutorials.length === 0 ? (
              <div className="text-center py-16 text-[#737373]">Loading tutorials...</div>
            ) : (
              <div className="grid  py-4 grid-cols-1 md:grid-cols-3 gap-3 h-160  sm:h-50 overflow-hidden">
                {featuredTutorials.map((tutorial) => (
                  <TutorialCard key={tutorial.id} tutorial={tutorial} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Why Learn Here Section */}
        <section className="py-10 md:py-28 bg-white border-b border-[#E5E5E5]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center space-y-8">
            <div className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-black">Built for serious engineering focus.</h2>
              <p className="text-[#737373] text-sm leading-relaxed">
                We stripped away ads, popups, and visual noise to give you pure technical clarity.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="p-6 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] space-y-2">
                <div className="font-semibold text-black text-sm">Notion-Grade Reading</div>
                <p className="text-xs text-[#737373] leading-relaxed">Clean typography, responsive sidebar navigation, and syntax-highlighted code blocks.</p>
              </div>
              <div className="p-6 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] space-y-2">
                <div className="font-semibold text-black text-sm">Interactive Validation</div>
                <p className="text-xs text-[#737373] leading-relaxed">Test your understanding with topic-specific quizzes and automated progress tracking.</p>
              </div>
              <div className="p-6 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] space-y-2">
                <div className="font-semibold text-black text-sm">Production Ready</div>
                <p className="text-xs text-[#737373] leading-relaxed">Real-world code examples and architectural blueprints you can apply directly to your projects.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
