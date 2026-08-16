"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Sparkles, CheckCircle2, AlertCircle, Loader2, Terminal, ExternalLink, BookOpen, Check } from "lucide-react";

interface LogStep {
  time: string;
  message: string;
  status: "pending" | "running" | "completed" | "error";
}

export default function AIPipelineAdminPage() {
  const [courseName, setCourseName] = useState("Compiler Design");
  const [branchName, setBranchName] = useState("Computer Science Engineering");
  const [loading, setLoading] = useState(false);
  const [jobResult, setJobResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogStep[]>([]);

  const addLog = (message: string, status: "pending" | "running" | "completed" | "error" = "running") => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { time, message, status }]);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setJobResult(null);
    setErrorMsg(null);
    setLogs([]);

    addLog(`Initiating AI pipeline for course: "${courseName}" in branch: "${branchName}"`, "running");

    // Simulate real-time step logging
    setTimeout(() => addLog(`🌐 Initializing Research Agent & scraping reference technical sources...`, "running"), 800);
    setTimeout(() => addLog(`📊 Extracting technical specifications, syntax, and architecture from web sources...`, "running"), 2000);
    setTimeout(() => addLog(`🗺️ Structuring comprehensive curriculum modules, topics, and subtopics...`, "running"), 3500);
    setTimeout(() => addLog(`✍️ Generating production-level markdown content subtopic by subtopic using Gemini AI (nothing left out)...`, "running"), 5000);
    setTimeout(() => addLog(`🧪 Validating code snippets, markdown structure, and accessibility...`, "running"), 7000);
    setTimeout(() => addLog(`💾 Persisting course structure, topics, and tutorials to MongoDB database via Backend API...`, "running"), 9000);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch("/api/ai-pipeline/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ courseName, branchName })
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to execute AI pipeline");
      }
      setJobResult(data.data);
      if (data.data?.logs && Array.isArray(data.data.logs)) {
        setLogs(data.data.logs.map((l: any) => ({
          time: l.timestamp,
          message: `[${l.level}] [${l.stage}] ${l.message}`,
          status: l.level === "ERROR" ? "error" : "completed"
        })));
      }
      addLog(`✅ Pipeline successfully completed and saved to database!`, "completed");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to execute AI pipeline");
      addLog(`❌ Pipeline error: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex items-center justify-between pb-6 border-b">
          <div>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-extrabold tracking-tight">AI Course Generation Pipeline (Phase 1)</h1>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Autonomous AI research, curriculum structuring, content generation, visual prompt creation, and database persistence.
            </p>
          </div>
          <Link href="/admin">
            <Button variant="outline">Back to Admin Dashboard</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generation Controls */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span>Generate Course</span>
              </CardTitle>
              <CardDescription>Enter course details to initiate the Phase 1 pipeline.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course Name</label>
                  <Input
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="e.g. Compiler Design"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Engineering Branch</label>
                  <Input
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    placeholder="e.g. Computer Science Engineering"
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full flex items-center justify-center space-x-2">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{loading ? "Running Pipeline..." : "Generate Course"}</span>
                </Button>
              </form>

              {errorMsg && (
                <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Status & Live Step-by-Step Logs */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Terminal className="h-5 w-5 text-primary" />
                <span>Live Pipeline Execution Console & Results</span>
              </CardTitle>
              <CardDescription>Real-time progress, step-by-step logs, generated structure, and clickable editor links.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!jobResult && logs.length === 0 && !loading && (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  No active pipeline run. Enter a course name and click Generate Course.
                </div>
              )}

              {/* Step-by-Step Terminal Logs */}
              {logs.length > 0 && (
                <div className="rounded-xl bg-black text-emerald-400 font-mono text-xs p-4 space-y-2 max-h-64 overflow-y-auto shadow-inner">
                  <div className="text-[10px] uppercase tracking-widest text-emerald-600 border-b border-emerald-900 pb-1 mb-2 flex items-center justify-between">
                    <span>Live Execution Logs</span>
                    <span>{loading ? "RUNNING..." : "COMPLETED"}</span>
                  </div>
                  {logs.map((log, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <span className="text-gray-500 shrink-0">[{log.time}]</span>
                      <span className="flex-1">{log.message}</span>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex items-center space-x-2 text-emerald-300 animate-pulse pt-1">
                      <Loader2 className="h-3 w-3 animate-spin shrink-0" />
                      <span>Processing pipeline stages...</span>
                    </div>
                  )}
                </div>
              )}

              {jobResult && (
                <div className="space-y-6">
                  <div className="p-4 border rounded-lg bg-muted/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Job ID</span>
                      <span className="text-xs font-mono">{jobResult.jobId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Status</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                        jobResult.status === "completed" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                      }`}>
                        {jobResult.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Progress</span>
                      <span className="text-xs font-bold">{jobResult.progress}%</span>
                    </div>
                  </div>

                  {jobResult.result?.structure && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                        <span>Generated Course Structure (Click subtopic to open editor)</span>
                        <BookOpen className="h-4 w-4" />
                      </h3>
                      <div className="p-4 border rounded-lg bg-card space-y-4 max-h-[320px] overflow-y-auto">
                        <div className="font-bold text-base border-b pb-2">{jobResult.result.structure.title}</div>
                        {jobResult.result.structure.topics.map((topic: any, idx: number) => {
                          const topicSlug = topic.slug || topic.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                          const branchSlug = branchName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                          const courseSlug = courseName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                          return (
                            <div key={idx} className="pl-4 border-l-2 border-primary/30 space-y-2">
                              <div className="font-semibold text-sm text-black dark:text-white">{topic.title}</div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {topic.subtopics.map((sub: any, sIdx: number) => {
                                  const subSlug = sub.slug || sub.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                                  const editorUrl = `/${branchSlug}/${courseSlug}/${subSlug}`;
                                  return (
                                    <Link key={sIdx} href={editorUrl} target="_blank">
                                      <div className="p-2.5 rounded-lg border bg-background hover:border-black transition-all flex items-center justify-between group cursor-pointer shadow-2xs">
                                        <div className="text-xs font-medium text-foreground group-hover:underline truncate">{sub.title}</div>
                                        <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-black shrink-0 ml-1.5" />
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {jobResult.errors && jobResult.errors.length > 0 && (
                    <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm space-y-1">
                      <div className="font-bold">Pipeline Error:</div>
                      {jobResult.errors.map((e: any, idx: number) => (
                        <div key={idx} className="text-xs">[{e.step}] {e.error}</div>
                      ))}
                    </div>
                  )}

                  {jobResult.result?.persistence && (
                    <div className="p-4 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm flex items-center space-x-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      <div>
                        <div className="font-bold">Successfully Saved to Database via Backend API!</div>
                        <div className="text-xs mt-0.5">
                          Topics created: {jobResult.result.persistence.topicsCreated}, Subtopics/Tutorials saved: {jobResult.result.persistence.subtopicsCreated}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
