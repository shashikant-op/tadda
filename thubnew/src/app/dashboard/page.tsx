"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { userService } from "@/services/user.service";
import { Bookmark, LearningProgress } from "@/types";
import { BookOpen, CheckCircle, Bookmark as BookmarkIcon, Award, User, ArrowRight } from "lucide-react";

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [progress, setProgress] = useState<LearningProgress[]>([]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    userService.getBookmarks()
      .then((data) => setBookmarks(Array.isArray(data) ? data : []))
      .catch(() => setBookmarks([]));

    userService.getProgress()
      .then((data) => setProgress(Array.isArray(data) ? data : []))
      .catch(() => setProgress([]));
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{user?.role} Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Welcome back, {user?.name || "Student"}! Track your learning progress and saved tutorials from MongoDB.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {(user?.role === "author" || user?.role === "admin") && (
              <Link href="/author/create">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-[var(--primary-foreground)]">
                  + Create / Edit Course
                </Button>
              </Link>
            )}
            <Link href="/profile">
              <Button variant="outline">
                <User className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed Tutorials</CardTitle>
              <CheckCircle className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress.filter((p) => p.completed).length}</div>
              <p className="text-xs text-muted-foreground mt-1">Live from database</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Saved Bookmarks</CardTitle>
              <BookmarkIcon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookmarks.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Saved tutorials</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Quizzes Passed</CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100%</div>
              <p className="text-xs text-muted-foreground mt-1">Accuracy score</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground mt-1">Keep it up!</p>
            </CardContent>
          </Card>
        </div>

        {/* Saved / In Progress Tutorials */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Saved Bookmarks & Learning History</h2>
            <Link href="/search" className="text-sm text-primary hover:underline flex items-center">
              Explore more <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          {bookmarks.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              No saved bookmarks yet. Browse tutorials and click Save to bookmark them.
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookmarks.map((item, index) => (
                <Card key={item.id || index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-primary/10 text-primary">
                        Bookmark
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">Saved</span>
                    </div>
                    <CardTitle className="text-lg mt-2">{item.tutorial?.title || "Saved Tutorial"}</CardTitle>
                    <CardDescription>{item.tutorial?.description || "Continue reading where you left off."}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
