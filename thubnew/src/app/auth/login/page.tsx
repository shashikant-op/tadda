"use client";

import Link from "next/link";
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

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const loginStore = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      const res = await authService.login(data);
      loginStore(res.user, res.token);
      if (res.user.role === "admin") {
        router.push("/admin");
      } else if (res.user.role === "author") {
        router.push("/author/create");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const errObj = err as Record<string, unknown>;
      const response = errObj?.response as Record<string, unknown> | undefined;
      const dataResp = response?.data as Record<string, unknown> | undefined;
      const msg = (dataResp?.message as string) || "Invalid email or password. Try student@tutorialsadda.com (password: password123)";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4 py-12">
      <Card className="w-full max-w-md border-[#E5E5E5] bg-white shadow-xl rounded-xl p-2">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="flex justify-center mb-2">
            <Link href="/">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-black text-white font-bold text-base">
                TA
              </div>
            </Link>
          </div>
          <CardTitle className="text-xl font-bold text-black tracking-tight">Welcome back</CardTitle>
          <CardDescription className="text-xs text-[#737373]">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <div className="p-3 text-xs bg-[#FAFAFA] border border-[#E5E5E5] text-black rounded-lg">{error}</div>}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-black">Email</label>
              <Input type="email" placeholder="student@tutorialsadda.com" className="h-10 text-xs border-[#E5E5E5] focus-visible:ring-0 focus-visible:border-black" {...register("email")} />
              {errors.email && <p className="text-[11px] text-red-600">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-black">Password</label>
              <Input type="password" placeholder="••••••••" className="h-10 text-xs border-[#E5E5E5] focus-visible:ring-0 focus-visible:border-black" {...register("password")} />
              {errors.password && <p className="text-[11px] text-red-600">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full h-10 bg-black text-white hover:bg-[#262626] text-xs font-medium" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-xs text-[#737373] pt-4 pb-4">
          Don&apos;t have an account?&nbsp;
          <Link href="/auth/register" className="text-black font-medium hover:underline">
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
