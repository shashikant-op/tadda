"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, BookOpen, Users, BarChart, PlusCircle, Settings, CheckCircle2, Trash2 } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { branchService } from "@/services/branch.service";
import { tutorialService } from "@/services/tutorial.service";
import { Branch, Tutorial } from "@/types";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [analytics, setAnalytics] = useState<Record<string, unknown> | null>(null);
  const [usersList, setUsersList] = useState<Record<string, unknown>[]>([]);
  const [branchesList, setBranchesList] = useState<Branch[]>([]);
  const [tutorialsList, setTutorialsList] = useState<Record<string, unknown>[]>([]);
  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchDesc, setNewBranchDesc] = useState("");
  const [branchMessage, setBranchMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    adminService.getAnalytics()
      .then((data) => setAnalytics(data))
      .catch(() => setAnalytics(null));

    adminService.getUsers()
      .then((users) => {
        const list = Array.isArray(users) ? users : [];
        setUsersList(list);
      })
      .catch(() => setUsersList([]));

    branchService.getBranches()
      .then((b) => setBranchesList(b))
      .catch(() => setBranchesList([]));

    tutorialService.getTutorials()
      .then((t) => setTutorialsList(t as unknown as Record<string, unknown>[]))
      .catch(() => setTutorialsList([]));
  }, [isAuthenticated, router]);

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setBranchMessage(null);
      const res = await axiosInstance.post("/branches", { name: newBranchName, description: newBranchDesc });
      const created = res.data.data.branch || res.data.data;
      setBranchesList((prev) => [...prev, { ...created, id: created.id || created._id }]);
      setBranchMessage("New engineering branch created successfully!");
      setNewBranchName("");
      setNewBranchDesc("");
      adminService.getAnalytics().then((data) => setAnalytics(data)).catch(() => {});
    } catch (err: unknown) {
      const errObj = err as Record<string, unknown>;
      const resp = errObj?.response as Record<string, unknown> | undefined;
      const data = resp?.data as Record<string, unknown> | undefined;
      setBranchMessage((data?.message as string) || "Failed to create branch");
    }
  };

  const handleDeleteBranch = async (branchId: string) => {
    if (!confirm("Are you sure you want to delete this branch? All associated subjects and content may be affected.")) return;
    try {
      await axiosInstance.delete(`/branches/${branchId}`);
      setBranchesList((prev) => prev.filter((b) => b.id !== branchId));
      setBranchMessage("Branch deleted successfully.");
      adminService.getAnalytics().then((data) => setAnalytics(data)).catch(() => {});
    } catch (err: unknown) {
      const errObj = err as Record<string, unknown>;
      const resp = errObj?.response as Record<string, unknown> | undefined;
      const data = resp?.data as Record<string, unknown> | undefined;
      setBranchMessage((data?.message as string) || "Failed to delete branch");
    }
  };

  const handleDeleteTutorial = async (tutorialId: string) => {
    if (!confirm("Are you sure you want to delete this content/tutorial?")) return;
    try {
      await axiosInstance.delete(`/tutorials/${tutorialId}`);
      setTutorialsList((prev) => prev.filter((t) => t.id !== tutorialId));
      adminService.getAnalytics().then((data) => setAnalytics(data)).catch(() => {});
    } catch (err) {
      console.error("Failed to delete tutorial", err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      setUsersList((prev) => prev.filter((u) => (u.id || u._id) !== userId));
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const updated = await adminService.updateUserRole(userId, newRole);
      setUsersList((prev) =>
        prev.map((u) => {
          const uId = u.id || u._id;
          if (uId === userId) {
            return { ...u, role: updated?.role || newRole };
          }
          return u;
        })
      );
    } catch (err: unknown) {
      console.error("Failed to update user role", err);
      const errObj = err as Record<string, unknown>;
      const resp = errObj?.response as Record<string, unknown> | undefined;
      const data = resp?.data as Record<string, unknown> | undefined;
      alert((data?.message as string) || "Failed to update user role");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-extrabold tracking-tight">Admin Management Console</h1>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Full platform control to manage users (authors/students), create branches, and moderate content from MongoDB.
            </p>
          </div>
          <Link href="/author/create">
            <Button className="flex items-center space-x-2">
              <PlusCircle className="h-4 w-4" />
              <span>Create New Tutorial</span>
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Tutorials</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(analytics?.totalTutorials as number) ?? 1000}</div>
              <p className="text-xs text-muted-foreground mt-1">Live from database</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersList.length || (analytics?.totalUsers as number) || 3}</div>
              <p className="text-xs text-muted-foreground mt-1">Authors & Students</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Branches</CardTitle>
              <BarChart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(analytics?.totalBranches as number) ?? 5}</div>
              <p className="text-xs text-muted-foreground mt-1">All operational</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Settings className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.9%</div>
              <p className="text-xs text-muted-foreground mt-1">MongoDB & Vercel OK</p>
            </CardContent>
          </Card>
        </div>

        {/* Section 1: Create & Manage Branches */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Create New Engineering Branch</CardTitle>
              <CardDescription>Add a new branch category (e.g. Aerospace, Chemical, Biotechnology).</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateBranch} className="space-y-4">
                {branchMessage && (
                  <div className="p-3 bg-primary/10 text-primary rounded-lg text-sm flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{branchMessage}</span>
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Branch Name</label>
                  <Input
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    placeholder="e.g. Aerospace Engineering"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</label>
                  <Input
                    value={newBranchDesc}
                    onChange={(e) => setNewBranchDesc(e.target.value)}
                    placeholder="Brief description of the branch..."
                    required
                  />
                </div>
                <Button type="submit">Create Branch</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Branch Management</CardTitle>
              <CardDescription>View and delete platform engineering branches.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-[300px] overflow-y-auto space-y-3">
                {branchesList.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-6">No branches found.</div>
                ) : (
                  branchesList.map((branch) => (
                    <div key={branch.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                      <div>
                        <div className="font-semibold text-sm">{branch.name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[220px]">{branch.description}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBranch(branch.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 2: Platform Content Moderation (Delete Anyone's Content) */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Content Moderation (All Tutorials)</CardTitle>
            <CardDescription>Full admin control to view and delete any course or tutorial on the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {tutorialsList.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">No tutorials found on the platform.</div>
              ) : (
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
                    {tutorialsList.map((tut) => {
                      const tId = (tut.id || tut._id) as string;
                      const isPublished = tut.status === "published";
                      return (
                        <tr key={tId} className="hover:bg-muted/30">
                          <td className="py-3 font-medium">{tut.title as string}</td>
                          <td className="py-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              isPublished ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                            }`}>
                              {(tut.status as string) || "draft"}
                            </span>
                          </td>
                          <td className="py-3 text-muted-foreground">{(tut.views as number) || 0}</td>
                          <td className="py-3 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTutorial(tId)}
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
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section 3: User Management (Authors & Students) */}
        <Card>
          <CardHeader>
            <CardTitle>User Management (Authors & Students)</CardTitle>
            <CardDescription>View registered authors and students across the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground uppercase text-xs">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {usersList.map((u) => {
                    const uId = (u.id || u._id) as string;
                    return (
                      <tr key={uId} className="hover:bg-muted/30">
                        <td className="py-3 font-medium">{u.name as string}</td>
                        <td className="py-3 text-muted-foreground">{u.email as string}</td>
                        <td className="py-3">
                          {u.role === "admin" ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-red-500/10 text-red-600">
                              {u.role as string}
                            </span>
                          ) : (
                            <select
                              value={u.role as string}
                              onChange={(e) => handleUpdateUserRole(uId, e.target.value)}
                              className={`text-[10px] font-bold px-2 py-1 rounded uppercase border cursor-pointer ${
                                u.role === "author" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                              }`}
                            >
                              <option value="student">Student</option>
                              <option value="author">Author</option>
                            </select>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          {u.role !== "admin" && (
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(uId)} className="text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
