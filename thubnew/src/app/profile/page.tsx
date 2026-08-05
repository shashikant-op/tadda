"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth.store";
import { PlusCircle, Shield } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const isPrivileged = user?.role === "admin" || user?.role === "author";

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl space-y-8">
        <h1 className="text-3xl font-extrabold tracking-tight">User Profile Settings</h1>

        {isPrivileged && (
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Educator & Admin Content Portal</span>
              </CardTitle>
              <CardDescription>
                You have {user?.role} privileges. You can create, edit, modify, and publish tutorials and courses directly to the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/author/create">
                <Button className="w-full flex items-center justify-center space-x-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>Open Course Editor & Publisher Dashboard</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your account details and avatar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input defaultValue={user?.name || "Student User"} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input defaultValue={user?.email || "student@tutorialsadda.com"} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Input disabled defaultValue={user?.role || "student"} className="bg-muted capitalize" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
