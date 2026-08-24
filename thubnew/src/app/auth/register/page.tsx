"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const loginStore = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      const res = await authService.register(data);
      loginStore(res.user, res.token);
      router.push("/dashboard");
    } catch {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--surface)] px-4 py-12">
      <Card className="w-full max-w-md border-[var(--border)] bg-[var(--surface)] shadow-xl rounded-xl p-2">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="flex justify-center mb-2">
            <Link href="/">
              <Image src="/logopng.png" alt="TutorialsAdda Logo" width={40} height={40} className="h-10 w-10 object-cover rounded-lg" />
            </Link>
          </div>
          <CardTitle className="text-xl font-bold text-[var(--ink)] tracking-tight">Create an account</CardTitle>
          <CardDescription className="text-xs text-[var(--body)]">Join TutorialsAdda to access documentation & quizzes</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <div className="p-3 text-xs bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] rounded-lg">{error}</div>}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--ink)]">Full Name</label>
              <Input autoComplete="name" placeholder="John Doe" className="h-10 text-xs border-[var(--border)] focus-visible:ring-0 focus-visible:border-[var(--ink)]" {...register("name")} />
              {errors.name && <p className="text-[11px] text-red-600">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--ink)]">Email</label>
              <Input type="email" autoComplete="email" placeholder="john@example.com" className="h-10 text-xs border-[var(--border)] focus-visible:ring-0 focus-visible:border-[var(--ink)]" {...register("email")} />
              {errors.email && <p className="text-[11px] text-red-600">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--ink)]">Password</label>
              <Input type="password" autoComplete="new-password" placeholder="••••••••" className="h-10 text-xs border-[var(--border)] focus-visible:ring-0 focus-visible:border-[var(--ink)]" {...register("password")} />
              {errors.password && <p className="text-[11px] text-red-600">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full h-10 bg-[var(--ink)] text-[var(--primary-foreground)] hover:bg-[var(--ink)] text-xs font-medium" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Sign up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-xs text-[var(--body)] pt-4 pb-4">
          Already have an account?&nbsp;
          <Link href="/auth/login" className="text-[var(--ink)] font-medium hover:underline">
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
