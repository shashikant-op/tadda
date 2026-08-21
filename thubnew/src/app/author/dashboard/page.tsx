"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth.store";
import { axiosInstance } from "@/lib/axios";
import { PlusCircle, BookOpen, Trash2, Edit, CheckCircle2 } from "lucide-react";

export default function AuthorDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [tutorials, setTutorials] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    async function fetchMyCourses() {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get("/tutorials/author/me");
        const list = res.data.data.tutorials || res.data.data;
        setTutorials(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Failed to fetch author courses", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMyCourses();
  }, [isAuthenticated, router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course/tutorial?")) return;
    try {
      await axiosInstance.delete(`/tutorials/${id}`);
      setTutorials((prev) => prev.filter((t) => (t.id || (t as Record<string, unknown>)._id) !== id));
      setMessage("Course deleted successfully.");
    } catch (err: unknown) {
      const errObj = err as Record<string, unknown>;
      const resp = errObj?.response as Record<string, unknown> | undefined;
      const data = resp?.data as Record<string, unknown> | undefined;
      setMessage((data?.message as string) || "Failed to delete course.");
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const res = await axiosInstance.patch(`/tutorials/${id}/publish`);
      const updated = res.data.data.tutorial;
      setTutorials((prev) => prev.map((t) => (((t.id || (t as Record<string, unknown>)._id) === id) ? { ...t, status: updated.status } : t)));
      setMessage("Course status updated successfully.");
    } catch (err: unknown) {
      const errObj = err as Record<string, unknown>;
      const resp = errObj?.response as Record<string, unknown> | undefined;
      const data = resp?.data as Record<string, unknown> | undefined;
      setMessage((data?.message as string) || "Failed to update course status.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-extrabold tracking-tight">Author Course Dashboard</h1>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Welcome back, {user?.name || "Author"}! Manage, edit, publish, or delete your created courses and tutorials.
            </p>
          </div>
          <Link href="/author/create">
            <Button className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-[var(--primary-foreground)] font-semibold">
              <PlusCircle className="h-4 w-4" />
              <span>Create New Course</span>
            </Button>
          </Link>
        </div>

        {message && (
          <div className="p-3 bg-primary/10 text-primary rounded-lg text-sm flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Courses Created</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{tutorials.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Managed from MongoDB</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Published Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{tutorials.filter((t) => t.status === "published").length}</div>
              <p className="text-xs text-muted-foreground mt-1">Live on platform</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Draft Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{tutorials.filter((t) => t.status !== "published").length}</div>
              <p className="text-xs text-muted-foreground mt-1">Unpublished drafts</p>
            </CardContent>
          </Card>
        </div>

        {/* Courses Table / List */}
        <Card>
          <CardHeader>
            <CardTitle>My Created Courses & Tutorials</CardTitle>
            <CardDescription>Full CRUD management for your engineering content.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading your courses from database...</div>
            ) : tutorials.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground space-y-4">
                <p>You haven&apos;t created any courses yet.</p>
                <Link href="/author/create">
                  <Button>Create Your First Course</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground uppercase text-xs">
                      <th className="pb-3">Title</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Views</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {tutorials.map((tut) => {
                      const id = (tut.id || tut._id) as string;
                      const isPublished = tut.status === "published";
                      return (
                        <tr key={id} className="hover:bg-muted/30">
                          <td className="py-4 font-medium">{tut.title as string}</td>
                          <td className="py-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              isPublished ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                            }`}>
                              {(tut.status as string) || "draft"}
                            </span>
                          </td>
                          <td className="py-4 text-muted-foreground">{(tut.views as number) || 0}</td>
                          <td className="py-4 text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTogglePublish(id)}
                            >
                              {isPublished ? "Unpublish" : "Publish"}
                            </Button>
                            <Link href={`/author/create?edit=${id}`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(id)}
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
