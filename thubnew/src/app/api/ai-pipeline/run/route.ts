import { NextResponse } from "next/server";
import { PipelineOrchestrator } from "aipipeline";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courseName, branchName } = body;

    const authHeader = request.headers.get("authorization");
    const token = authHeader ? authHeader.replace("Bearer ", "") : undefined;

    if (!courseName) {
      return NextResponse.json({ success: false, message: "Course name is required" }, { status: 400 });
    }

    const orchestrator = new PipelineOrchestrator(token);
    const job = await orchestrator.runPipeline(courseName, branchName || "Computer Science Engineering", token);

    return NextResponse.json({ success: true, data: job }, { status: 200 });
  } catch (err: any) {
    console.error("AI Pipeline API error:", err);
    return NextResponse.json({ success: false, message: err.message || "Internal server error" }, { status: 500 });
  }
}
