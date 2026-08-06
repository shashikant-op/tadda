"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { X } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const loginStore = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  if (!isOpen) return null;

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      const res = await authService.login(data);
      loginStore(res.user, res.token);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const errObj = err as Record<string, unknown>;
      const response = errObj?.response as Record<string, unknown> | undefined;
      const dataResp = response?.data as Record<string, unknown> | undefined;
      const msg = (dataResp?.message as string) || "Invalid email or password. Try student@tutorialsadda.com (password: password123)";
      setError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <Card className="w-full max-w-md relative border-[#E5E5E5] bg-white shadow-2xl rounded-xl p-2">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm text-[#737373] hover:text-black transition-colors"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <CardHeader className="space-y-2 text-center pb-6">
          <div className="flex justify-center mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-black text-white font-bold text-base">
              TA
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-black tracking-tight">Authentication Required</CardTitle>
          <CardDescription className="text-xs text-[#737373]">Sign in to save bookmarks and track learning progress</CardDescription>
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
              {isSubmitting ? "Signing in..." : "Sign in & Continue"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center text-xs text-[#737373] pb-4">
          Demo: student@tutorialsadda.com (password123)
        </CardFooter>
      </Card>
    </div>
  );
}
