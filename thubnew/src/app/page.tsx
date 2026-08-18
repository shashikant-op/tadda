"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, ArrowRight, BookOpen, Award, Users, Terminal, CheckCircle2, Zap } from "lucide-react";
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
          <div className="container mx-auto px-4 sm:px-6 py-6 md:py-16 lg:px-8 text-center max-w-4xl space-y-6 sm:space-y-8">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50/60 px-3.5 py-1 text-[11px] md:text-xs font-semibold text-blue-700 shadow-xs">
              <Terminal className="mr-2 h-3.5 w-3.5 text-blue-600" />
              Engineering Knowledge Base
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-black leading-[1.15]">
              Master Engineering. <br />
              <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-700 bg-clip-text text-transparent">Without the Noise.</span>
            </h1>
            <p className="text-xs sm:text-base text-[#737373] max-w-xl mx-auto leading-relaxed">
              A pristine technical platform for computer science and modern systems engineering. Zero clutter. Pure content.
            </p>

            <div className="flex flex-row items-center justify-center gap-2 max-w-md mx-auto w-full pt-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-[#737373]" />
                <Input
                  placeholder="Search algorithms, React..."
                  className="pl-10 h-11 w-full bg-[#FAFAFA] border-[#E5E5E5] text-xs sm:text-sm text-black rounded-xl focus-visible:ring-0 focus-visible:border-black"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link href={`/search?q=${encodeURIComponent(searchQuery)}`} className="flex-shrink-0">
                <Button className="h-11 px-5 sm:px-6 bg-black text-white hover:bg-[#262626] text-xs sm:text-sm font-medium rounded-xl shadow-md">Explore</Button>
              </Link>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-4 pt-6 sm:pt-16 border-t border-[#E5E5E5] text-left max-w-4xl mx-auto">
              <div className="relative p-2.5 sm:p-5 h-22 sm:h-28 overflow-hidden rounded-xl sm:rounded-2xl border border-[#E5E5E5] bg-gradient-to-br from-white via-[#FAFAFA] to-[#F4F4F5] transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer group">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <span className="hidden sm:inline-block text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Curated</span>
                </div>
                <div className="font-extrabold text-sm sm:text-2xl text-black tracking-tight">50+</div>
                <div className="text-[9px] sm:text-xs text-[#737373] font-medium mt-0.5 truncate">Tutorials</div>
              </div>

              <div className="relative p-2.5 sm:p-5 h-22 sm:h-28 overflow-hidden rounded-xl sm:rounded-2xl border border-[#E5E5E5] bg-gradient-to-br from-white via-[#FAFAFA] to-[#F4F4F5] transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/5 cursor-pointer group">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <span className="hidden sm:inline-block text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Verified</span>
                </div>
                <div className="font-extrabold text-sm sm:text-2xl text-black tracking-tight">50+</div>
                <div className="text-[9px] sm:text-xs text-[#737373] font-medium mt-0.5 truncate">Quizzes</div>
              </div>

              <div className="relative p-2.5 sm:p-5 h-22 sm:h-28 overflow-hidden rounded-xl sm:rounded-2xl border border-[#E5E5E5] bg-gradient-to-br from-white via-[#FAFAFA] to-[#F4F4F5] transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/5 cursor-pointer group">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <span className="hidden sm:inline-block text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Active</span>
                </div>
                <div className="font-extrabold text-sm sm:text-2xl text-black tracking-tight">1.5k+</div>
                <div className="text-[9px] sm:text-xs text-[#737373] font-medium mt-0.5 truncate">Learners</div>
              </div>

              <div className="relative p-2.5 sm:p-5 h-22 sm:h-28 overflow-hidden rounded-xl sm:rounded-2xl border border-[#E5E5E5] bg-gradient-to-br from-white via-[#FAFAFA] to-[#F4F4F5] transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/5 cursor-pointer group">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Terminal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <span className="hidden sm:inline-block text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Free</span>
                </div>
                <div className="font-extrabold text-sm sm:text-2xl text-black tracking-tight">100%</div>
                <div className="text-[9px] sm:text-xs text-[#737373] font-medium mt-0.5 truncate">Open Access</div>
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
              
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 py-4">
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
              <div className="grid grid-cols-3 gap-1.5 sm:gap-6 items-stretch">
                {/* Card 1: Tall Green Card (Python & Automation) */}
                {(() => {
                  const c1 = courses[0] || { name: "Python & Automation", slug: "python-automation", branchSlug: "computer-science", description: "Master scripts, Scrapy, and large-scale data manipulation for the modern web." };
                  return (
                    <div className="w-full relative overflow-hidden rounded-xl sm:rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-2.5 sm:p-8 text-white flex flex-col justify-between shadow-md sm:shadow-xl group min-h-[220px] sm:min-h-[420px] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-2xl active:scale-[0.98] cursor-pointer">
                      <div className="absolute right-[-10px] bottom-[-10px] opacity-20 pointer-events-none hidden sm:block">
                        <img src="/aiml.png" alt="" className="w-56 h-56 lg:w-64 lg:h-64 object-contain" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1.5 sm:mb-4">
                          <span className="text-[8px] sm:text-[11px] font-semibold px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/25 backdrop-blur-md text-white tracking-wider animate-pulse">
                            HOT
                          </span>
                        </div>
                        <h3 className="text-xs sm:text-2xl lg:text-3xl font-bold text-white tracking-tight mb-1 sm:mb-3 line-clamp-2 group-hover:text-emerald-100 transition-colors">{c1.name}</h3>
                        <p className="text-[10px] sm:text-sm text-emerald-100 leading-tight sm:leading-relaxed line-clamp-2 sm:line-clamp-3">
                          {c1.description || "Master core concepts and advanced patterns for production engineering."}
                        </p>
                      </div>
                      <div className="pt-3 sm:pt-12 mt-auto relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0">
                        <div className="hidden sm:block">
                          <div className="text-lg sm:text-xl font-extrabold text-white">{c1.topicCount ? `${c1.topicCount} Topics` : "12.4k"}</div>
                          <div className="text-[10px] tracking-wider uppercase text-emerald-200 font-medium">Students &middot; Beginner Level</div>
                        </div>
                        <Link href={`/${c1.branchSlug || "computer-science"}/${c1.slug}`} className="w-full sm:w-auto">
                          <Button className="bg-white text-emerald-900 hover:bg-emerald-50 hover:scale-105 active:scale-95 font-semibold px-2 sm:px-5 py-1 sm:py-2.5 rounded-full text-[9px] sm:text-xs shadow-sm sm:shadow-md transition-all duration-200 w-full sm:w-auto">
                            Explore Path
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })()}

                {/* Column 2: Two Stacked Cards */}
                <div className="flex flex-col gap-1.5 sm:gap-6 w-full">
                  {/* Card 2: Blue Card (Data Systems) */}
                  {(() => {
                    const c2 = courses[1] || { name: "Data Systems", slug: "data-systems", branchSlug: "computer-science", description: "PostgreSQL performance, Redis caching, and MongoDB scaling." };
                    return (
                      <div className="relative overflow-hidden rounded-xl sm:rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-2 sm:p-7 text-white flex flex-col justify-between shadow-md sm:shadow-lg group flex-1 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] cursor-pointer min-h-[105px] sm:min-h-[200px]">
                        <div>
                          <div className="flex items-center justify-between mb-1 sm:mb-3">
                            <span className="text-[7px] sm:text-[10px] font-semibold px-1.5 sm:px-2.5 py-0.5 rounded-full bg-white/25 backdrop-blur-md text-white tracking-wider uppercase">
                              Core Systems
                            </span>
                          </div>
                          <h3 className="text-[11px] sm:text-xl font-bold text-white tracking-tight mb-0.5 sm:mb-1 line-clamp-1 sm:line-clamp-2 group-hover:text-blue-100 transition-colors">{c2.name}</h3>
                          <p className="text-[9px] sm:text-xs text-blue-100 leading-tight line-clamp-1 sm:line-clamp-2">
                            {c2.description || "High-performance architecture and distributed data stores."}
                          </p>
                        </div>
                        <div className="pt-2 sm:pt-6 mt-auto border-t border-blue-500/30 flex items-center justify-between">
                          <div className="hidden sm:block text-[11px] sm:text-xs text-blue-200 font-medium">Advanced Difficulty</div>
                          <Link href={`/${c2.branchSlug || "computer-science"}/${c2.slug}`} className="w-full">
                            <Button variant="ghost" className="bg-white/15 hover:bg-white/30 hover:scale-105 active:scale-95 text-white font-medium px-2 sm:px-4 py-0.5 sm:py-1.5 rounded-full text-[9px] sm:text-xs transition-all duration-200 border border-white/20 w-full justify-center">
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
                      <div className="relative overflow-hidden rounded-xl sm:rounded-3xl bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 p-2 sm:p-7 text-white flex flex-col justify-between shadow-md sm:shadow-lg group flex-1 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] cursor-pointer min-h-[105px] sm:min-h-[200px]">
                        <div>
                          <div className="flex items-center justify-between mb-1 sm:mb-3">
                            <span className="text-[7px] sm:text-[10px] font-semibold px-1.5 sm:px-2.5 py-0.5 rounded-full bg-white/25 backdrop-blur-md text-white tracking-wider uppercase">
                              Essential
                            </span>
                          </div>
                          <h3 className="text-[11px] sm:text-xl font-bold text-white tracking-tight mb-0.5 sm:mb-1 line-clamp-1 sm:line-clamp-2 group-hover:text-amber-100 transition-colors">{c3.name}</h3>
                          <p className="text-[9px] sm:text-xs text-amber-100 leading-tight line-clamp-1 sm:line-clamp-2">
                            {c3.description || "Full-stack application development with modern frameworks."}
                          </p>
                        </div>
                        <div className="pt-2 sm:pt-6 mt-auto border-t border-amber-500/30 flex items-center justify-between">
                          <div className="hidden sm:block text-[11px] sm:text-xs text-amber-200 font-medium">All Levels</div>
                          <Link href={`/${c3.branchSlug || "computer-science"}/${c3.slug}`} className="w-full">
                            <Button className="bg-amber-900/80 hover:bg-amber-950 hover:scale-105 active:scale-95 text-white font-semibold px-2 sm:px-5 py-0.5 sm:py-2 rounded-full text-[9px] sm:text-xs transition-all duration-200 shadow-sm w-full justify-center">
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
                    <div className="w-full relative overflow-hidden rounded-xl sm:rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-blue-900 p-2.5 sm:p-8 text-white flex flex-col justify-between shadow-md sm:shadow-xl group min-h-[220px] sm:min-h-[420px] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-2xl active:scale-[0.98] cursor-pointer">
                      <div className="absolute right-[-10px] bottom-[-10px] opacity-20 pointer-events-none hidden sm:block">
                        <img src="/window.svg" alt="" className="w-56 h-56 lg:w-64 lg:h-64 object-contain invert" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1.5 sm:mb-4">
                          <span className="text-[8px] sm:text-[11px] font-semibold px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/25 backdrop-blur-md text-white tracking-wider animate-pulse">
                            ADVANCED
                          </span>
                        </div>
                        <h3 className="text-xs sm:text-2xl lg:text-3xl font-bold text-white tracking-tight mb-1 sm:mb-3 line-clamp-2 group-hover:text-indigo-100 transition-colors">{c4.name}</h3>
                        <p className="text-[10px] sm:text-sm text-indigo-100 leading-tight sm:leading-relaxed line-clamp-2 sm:line-clamp-3">
                          {c4.description || "Containerization, cloud infrastructure, and automated deployments."}
                        </p>
                      </div>
                      <div className="pt-3 sm:pt-16 mt-auto relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-indigo-600/40 gap-1 sm:gap-0">
                        <div className="hidden sm:block">
                          <div className="text-[11px] sm:text-xs text-indigo-200 font-medium uppercase tracking-wider">Advanced Difficulty</div>
                        </div>
                        <Link href={`/${c4.branchSlug || "computer-science"}/${c4.slug}`} className="w-full sm:w-auto">
                          <Button className="bg-white text-indigo-950 hover:bg-indigo-50 hover:scale-105 active:scale-95 font-semibold px-2 sm:px-5 py-1 sm:py-2.5 rounded-full text-[9px] sm:text-xs shadow-sm sm:shadow-md transition-all duration-200 w-full sm:w-auto">
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
        <section className="py-10 md:py-28 bg-[#FAFAFA] border-b border-[#E5E5E5] hidden md:block">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 py-4">
                {featuredTutorials.map((tutorial) => (
                  <TutorialCard key={tutorial.id} tutorial={tutorial} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Why Learn Here Section */}
        <section className="py-12 md:py-28 bg-[#FAFAFA] border-b border-[#E5E5E5]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center space-y-10 sm:space-y-12">
            <div className="space-y-3 max-w-2xl mx-auto">
              <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 uppercase tracking-wider">
                Why Choose Us
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-black">
                Built for <span className="text-blue-700">serious engineering focus.</span>
              </h2>
              <p className="text-[#737373] text-sm leading-relaxed">
                We stripped away ads, popups, and visual noise to give you pure technical clarity.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="relative p-6 sm:p-7 rounded-2xl border border-[#E5E5E5] bg-gradient-to-br from-white via-[#FAFAFA] to-[#F4F4F5] space-y-3 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="font-bold text-black text-base group-hover:text-blue-700 transition-colors">Notion-Grade Reading</div>
                <p className="text-xs text-[#737373] leading-relaxed">Clean typography, responsive sidebar navigation, and syntax-highlighted code blocks.</p>
              </div>

              <div className="relative p-6 sm:p-7 rounded-2xl border border-[#E5E5E5] bg-gradient-to-br from-white via-[#FAFAFA] to-[#F4F4F5] space-y-3 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/5 cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="font-bold text-black text-base group-hover:text-emerald-700 transition-colors">Interactive Validation</div>
                <p className="text-xs text-[#737373] leading-relaxed">Test your understanding with topic-specific quizzes and automated progress tracking.</p>
              </div>

              <div className="relative p-6 sm:p-7 rounded-2xl border border-[#E5E5E5] bg-gradient-to-br from-white via-[#FAFAFA] to-[#F4F4F5] space-y-3 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/5 cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Zap className="h-5 w-5" />
                </div>
                <div className="font-bold text-black text-base group-hover:text-amber-700 transition-colors">Production Ready</div>
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
