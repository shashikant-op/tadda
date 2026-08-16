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
import { subjectService } from "@/services/subject.service";
import { Branch, Tutorial, Subject } from "@/types";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [featuredTutorials, setFeaturedTutorials] = useState<Tutorial[]>([]);
  const [courses, setCourses] = useState<Subject[]>([]);

  useEffect(() => {
    branchService.getBranches()
      .then((data) => setBranches(Array.isArray(data) ? data : []))
      .catch(() => setBranches([]));

    tutorialService.getTutorials()
      .then((data) => setFeaturedTutorials(Array.isArray(data) ? data.slice(0, 6) : []))
      .catch(() => setFeaturedTutorials([]));

    subjectService.getSubjects()
      .then((data) => setCourses(Array.isArray(data) ? data : []))
      .catch(() => setCourses([]));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black selection:bg-black selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative  overflow-py-20     py-6 border-b border-[#E5E5E5] bg-white">
          <div className="absolute scale-310 top-40 left-[-30] sm:scale-540 sm:left-140 sm:top-100 hover:left-142 hover:top-102  opacity-20 hover:opacity-30 transition-all duration-500">
          {/* <img
            src="/aiml.png"
            alt=""
            className="w-48 z-[-10] select-none h-48 object-contain"
          /> */}
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
              <div className="p-4 h-24 overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:border-black hover:shadow-md cursor-pointer group">
                <BookOpen className="h-5 w-5 text-black mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-xl text-black">50+</div>
                <div className="text-xs text-[#737373] mt-0.5">Tutorials</div>
              </div>
              <div className="p-4 h-24 overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:border-black hover:shadow-md cursor-pointer group">
                <Award className="h-5 w-5 text-black mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-xl text-black">50+</div>
                <div className="text-xs text-[#737373] mt-0.5">Quizzes</div>
              </div>
              <div className="p-4 h-24 overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:border-black hover:shadow-md cursor-pointer group">
                <Users className="h-5 w-5 text-black mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-xl text-black">1.5k+</div>
                <div className="text-xs text-[#737373] mt-0.5">Learners</div>
              </div>
              <div className="p-4 h-24 overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:border-black hover:shadow-md cursor-pointer group">
                <Terminal className="h-5 w-5 text-black mb-2 group-hover:scale-110 transition-transform" />
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-4">
                {branches.map((branch) => (
                  <BranchCard
                    key={branch.id || branch.slug}
                    name={branch.name}
                    slug={branch.slug}
                    description={branch.description}
                    subjectCount={branch.subjectCount || 10}
                    icon={branch.icon || "Cpu"}
                    image={branch.image}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Featured Courses Section (Dynamic with Caching & Micro-Interactions) */}
        <section className="py-12 md:py-24 border-b border-[#E5E5E5] bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex items-end justify-between mb-8 sm:mb-12">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">Featured <span className="text-blue-700">Courses</span></h2>
                <p className="text-[#737373] text-sm mt-1">Curated masterclasses with cached database sync and interactive tracks</p>
              </div>
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-16 text-[#737373]">Loading courses from database...</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {/* Card 1: Tall Green Card (Python & Automation) */}
                {(() => {
                  const c1 = courses[0] || { name: "Python & Automation", slug: "python-automation", branchSlug: "computer-science", description: "Master scripts, Scrapy, and large-scale data manipulation for the modern web." };
                  return (
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-8 text-white flex flex-col justify-between shadow-xl group min-h-[420px] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-2xl active:scale-[0.98] cursor-pointer">
                      <div className="absolute right-[-20px] bottom-[-20px] opacity-25 pointer-events-none group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700">
                        <img src="/aiml.png" alt="" className="w-64 h-64 object-contain" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-white/25 backdrop-blur-md text-white tracking-wider animate-pulse">
                            HOT
                          </span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3 group-hover:text-emerald-100 transition-colors">{c1.name}</h3>
                        <p className="text-sm text-emerald-100 leading-relaxed max-w-sm line-clamp-3">
                          {c1.description || "Master core concepts and advanced patterns for production engineering."}
                        </p>
                      </div>
                      <div className="pt-12 mt-auto relative z-10 flex items-center justify-between">
                        <div>
                          <div className="text-xl font-extrabold text-white">{c1.topicCount ? `${c1.topicCount} Topics` : "12.4k"}</div>
                          <div className="text-[10px] tracking-wider uppercase text-emerald-200 font-medium">Students &middot; Beginner Level</div>
                        </div>
                        <Link href={`/${c1.branchSlug || "computer-science"}/${c1.slug}`}>
                          <Button className="bg-white text-emerald-900 hover:bg-emerald-50 hover:scale-105 active:scale-95 font-semibold px-5 py-2.5 rounded-full text-xs shadow-md transition-all duration-200">
                            Explore Path
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })()}

                {/* Column 2: Two Stacked Cards */}
                <div className="flex flex-col gap-6">
                  {/* Card 2: Blue Card (Data Systems) */}
                  {(() => {
                    const c2 = courses[1] || { name: "Data Systems", slug: "data-systems", branchSlug: "computer-science", description: "PostgreSQL performance, Redis caching, and MongoDB scaling." };
                    return (
                      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-6 sm:p-7 text-white flex flex-col justify-between shadow-lg group flex-1 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] cursor-pointer">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white/25 backdrop-blur-md text-white tracking-wider uppercase">
                              Core Systems
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-white tracking-tight mb-1 group-hover:text-blue-100 transition-colors">{c2.name}</h3>
                          <p className="text-xs text-blue-100 leading-relaxed line-clamp-2">
                            {c2.description || "High-performance architecture and distributed data stores."}
                          </p>
                        </div>
                        <div className="pt-6 mt-4 border-t border-blue-500/30 flex items-center justify-between">
                          <div className="text-xs text-blue-200 font-medium">Advanced Difficulty</div>
                          <Link href={`/${c2.branchSlug || "computer-science"}/${c2.slug}`}>
                            <Button variant="ghost" className="bg-white/15 hover:bg-white/30 hover:scale-105 active:scale-95 text-white font-medium px-4 py-1.5 rounded-full text-xs transition-all duration-200 border border-white/20">
                              Explore
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Card 3: Amber/Orange Card (Modern Web Dev) */}
                  {(() => {
                    const c3 = courses[2] || { name: "Modern Web Dev", slug: "web-dev", branchSlug: "computer-science", description: "Next.js 15, React Server Components, and Tailwind mastery." };
                    return (
                      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 p-6 sm:p-7 text-white flex flex-col justify-between shadow-lg group flex-1 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] cursor-pointer">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white/25 backdrop-blur-md text-white tracking-wider uppercase">
                              Essential
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-white tracking-tight mb-1 group-hover:text-amber-100 transition-colors">{c3.name}</h3>
                          <p className="text-xs text-amber-100 leading-relaxed line-clamp-2">
                            {c3.description || "Full-stack application development with modern frameworks."}
                          </p>
                        </div>
                        <div className="pt-6 mt-4 border-t border-amber-500/30 flex items-center justify-between">
                          <div className="text-xs text-amber-200 font-medium">All Levels</div>
                          <Link href={`/${c3.branchSlug || "computer-science"}/${c3.slug}`}>
                            <Button className="bg-amber-900/80 hover:bg-amber-950 hover:scale-105 active:scale-95 text-white font-semibold px-5 py-2 rounded-full text-xs transition-all duration-200 shadow-md">
                              Enroll Now
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Card 4: Tall Indigo/Purple Card (DevOps & SRE) */}
                {(() => {
                  const c4 = courses[3] || { name: "DevOps & SRE", slug: "devops", branchSlug: "computer-science", description: "Docker, Kubernetes, and zero-downtime CI/CD pipelines." };
                  return (
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-blue-900 p-8 text-white flex flex-col justify-between shadow-xl group min-h-[420px] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-2xl active:scale-[0.98] cursor-pointer">
                      <div className="absolute right-[-20px] bottom-[-20px] opacity-25 pointer-events-none group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-700">
                        <img src="/window.svg" alt="" className="w-64 h-64 object-contain invert" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-white/25 backdrop-blur-md text-white tracking-wider animate-pulse">
                            ADVANCED
                          </span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3 group-hover:text-indigo-100 transition-colors">{c4.name}</h3>
                        <p className="text-sm text-indigo-100 leading-relaxed max-w-sm line-clamp-3">
                          {c4.description || "Containerization, cloud infrastructure, and automated deployments."}
                        </p>
                      </div>
                      <div className="pt-16 mt-auto relative z-10 flex items-center justify-between border-t border-indigo-600/40">
                        <div>
                          <div className="text-xs text-indigo-200 font-medium uppercase tracking-wider">Advanced Difficulty</div>
                        </div>
                        <Link href={`/${c4.branchSlug || "computer-science"}/${c4.slug}`}>
                          <Button className="bg-white text-indigo-950 hover:bg-indigo-50 hover:scale-105 active:scale-95 font-semibold px-5 py-2.5 rounded-full text-xs shadow-md transition-all duration-200">
                            Open Syllabus
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })()}
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
              <div className="p-6 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] space-y-2 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-black hover:shadow-lg cursor-pointer">
                <div className="font-semibold text-black text-sm">Notion-Grade Reading</div>
                <p className="text-xs text-[#737373] leading-relaxed">Clean typography, responsive sidebar navigation, and syntax-highlighted code blocks.</p>
              </div>
              <div className="p-6 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] space-y-2 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-black hover:shadow-lg cursor-pointer">
                <div className="font-semibold text-black text-sm">Interactive Validation</div>
                <p className="text-xs text-[#737373] leading-relaxed">Test your understanding with topic-specific quizzes and automated progress tracking.</p>
              </div>
              <div className="p-6 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] space-y-2 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-black hover:shadow-lg cursor-pointer">
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
