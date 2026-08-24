import { NextResponse } from "next/server";
import { PipelineOrchestrator } from "aipipeline";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
    }

    const { courseName, branchName } = body as Record<string, unknown>;

    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";

    if (typeof courseName !== "string" || !courseName.trim() || courseName.length > 200) {
      return NextResponse.json({ success: false, message: "Course name is required" }, { status: 400 });
    }
    if (branchName !== undefined && (typeof branchName !== "string" || branchName.length > 200)) {
      return NextResponse.json({ success: false, message: "Invalid branch name" }, { status: 400 });
    }
    if (!token) {
      return NextResponse.json({ success: false, message: "Admin authentication is required" }, { status: 401 });
    }

    const backendUrl = (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace(/\/$/, "");
    const authResponse = await fetch(`${backendUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store"
    });
    if (!authResponse.ok) {
      return NextResponse.json({ success: false, message: "Invalid or expired session" }, { status: 401 });
    }
    const authPayload: unknown = await authResponse.json();
    const authenticatedUser = authPayload && typeof authPayload === "object"
      ? (authPayload as { data?: { user?: { role?: string } } }).data?.user
      : undefined;
    if (authenticatedUser?.role !== "admin") {
      return NextResponse.json({ success: false, message: "Admin access is required" }, { status: 403 });
    }

    const orchestrator = new PipelineOrchestrator(token);
    const job = await orchestrator.runPipeline(
      courseName.trim(),
      typeof branchName === "string" && branchName.trim() ? branchName.trim() : "Computer Science Engineering",
      token
    );

    return NextResponse.json({ success: true, data: job }, { status: 200 });
  } catch (err: unknown) {
    console.error("AI Pipeline API error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
