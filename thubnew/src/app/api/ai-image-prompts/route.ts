import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { z } from "zod";
import { buildEducationalVisualPrompt } from "@/lib/server/educational-visual-prompt";

export const runtime = "nodejs";

const RequestSchema = z.object({
  courseName: z.string().trim().min(1).max(200),
  moduleName: z.string().trim().min(1).max(200),
  topicName: z.string().trim().min(1).max(200),
  subtopicName: z.string().trim().min(1).max(200),
  content: z.string().trim().min(40, "Add more lesson content before requesting image prompts.").max(100_000),
});

const VisualSchema = z.object({
  id: z.string().min(1).max(100),
  placement: z.object({ type: z.string().min(1).max(100), reference: z.string().min(1).max(1000) }),
  visualType: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  educationalPurpose: z.string().min(1).max(2000),
  conceptsCovered: z.array(z.string().max(500)).max(30),
  requiredElements: z.array(z.string().max(1000)).max(50),
  imagePrompt: z.string().min(20).max(15_000),
  avoid: z.array(z.string().max(500)).max(30),
});

const ResponseSchema = z.object({
  needsVisual: z.boolean(),
  visualCount: z.number().int().min(0).max(12),
  visuals: z.array(VisualSchema).max(12),
}).superRefine((value, context) => {
  if (value.visualCount !== value.visuals.length || value.needsVisual !== (value.visuals.length > 0)) {
    context.addIssue({ code: "custom", message: "Gemini returned inconsistent visual counts." });
  }
});

async function readLocalGeminiKey(): Promise<string> {
  // Check all common env names first (works in both dev and production on Vercel)
  const direct =
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_API_KEY?.trim() ||
    process.env.AI_API_KEY?.trim() ||
    "";
  if (direct) return direct;

  // In production there is no local file - return empty so caller shows 503
  if (process.env.NODE_ENV === "production") return "";

  // Local dev fallback: try aipipeline/.env and thubnew/.env.local
  const candidates = [
    path.resolve(process.cwd(), "../aipipeline/.env"),
    path.resolve(process.cwd(), ".env.local"),
    path.resolve(process.cwd(), ".env"),
  ];
  for (const filePath of candidates) {
    try {
      const envText = await readFile(filePath, "utf8");
      const match = envText.match(/^GEMINI_API_KEY\s*=\s*["']?([^\r\n"']+)["']?\s*$/m);
      if (match?.[1]?.trim()) return match[1].trim();
    } catch {
      // ignore
    }
  }
  return "";
}

function extractGeminiText(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const candidates = (payload as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }).candidates;
  return candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
    if (!token) return NextResponse.json({ success: false, message: "Authentication is required." }, { status: 401 });

    const backendUrl = (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace(/\/$/, "");
    const authResponse = await fetch(`${backendUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!authResponse.ok) return NextResponse.json({ success: false, message: "Invalid or expired session." }, { status: 401 });

    const authPayload = await authResponse.json() as { data?: { user?: { role?: string } } };
    if (!(["author", "admin"].includes(authPayload.data?.user?.role || ""))) {
      return NextResponse.json({ success: false, message: "Author access is required." }, { status: 403 });
    }

    const parsedRequest = RequestSchema.safeParse(await request.json());
    if (!parsedRequest.success) {
      return NextResponse.json({ success: false, message: parsedRequest.error.issues[0]?.message || "Invalid lesson content." }, { status: 400 });
    }

    const apiKey = await readLocalGeminiKey();
    if (!apiKey) {
      return NextResponse.json({ success: false, message: "GEMINI_API_KEY is not configured on the server." }, { status: 503 });
    }

    const model = process.env.GEMINI_MODEL || process.env.AI_MODEL || "gemini-3.6-flash";

    let geminiResponse: Response | null = null;
    let lastErrorBody = "";
    // Retry once on transient 429/500/503
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: buildEducationalVisualPrompt(parsedRequest.data) }] }],
              generationConfig: { temperature: 0.15, responseMimeType: "application/json" },
            }),
            signal: AbortSignal.timeout(60_000),
          },
        );
        if (geminiResponse.ok) break;
        lastErrorBody = await geminiResponse.text().catch(() => "");
        console.error(`Gemini image-prompt request failed (attempt ${attempt + 1}) status ${geminiResponse.status} body:`, lastErrorBody.slice(0, 2000));
        // Retry only on rate-limit / server errors
        if (![429, 500, 502, 503].includes(geminiResponse.status)) break;
        if (attempt === 0) await new Promise((r) => setTimeout(r, 1500));
      } catch (e) {
        lastErrorBody = e instanceof Error ? e.message : String(e);
        console.error(`Gemini image-prompt fetch error (attempt ${attempt + 1}):`, lastErrorBody);
        if (attempt === 0) await new Promise((r) => setTimeout(r, 1500));
      }
    }

    if (!geminiResponse || !geminiResponse.ok) {
      const status = geminiResponse?.status || 502;
      // Surface leaked-key case clearly
      if (lastErrorBody.includes("leaked") || lastErrorBody.includes("PERMISSION_DENIED")) {
        console.error("Gemini API key rejected:", lastErrorBody.slice(0, 500));
        return NextResponse.json({ success: false, message: "Gemini API key is invalid or revoked. Please update GEMINI_API_KEY." }, { status: 502 });
      }
      return NextResponse.json({ success: false, message: "Gemini could not analyze this lesson. Please try again." }, { status: 502 });
    }

    const geminiPayload = await geminiResponse.json().catch(async () => {
      const t = await geminiResponse!.text().catch(() => "");
      return { _raw: t };
    });
    const rawText = extractGeminiText(geminiPayload).trim().replace(/^```json\s*/i, "").replace(/\s*```$/, "");
    if (!rawText) {
      console.error("Gemini returned empty candidates payload:", JSON.stringify(geminiPayload).slice(0, 2000));
      return NextResponse.json({ success: false, message: "Gemini returned an empty response. Please try again." }, { status: 502 });
    }
    let geminiJson: unknown;
    try {
      geminiJson = JSON.parse(rawText);
    } catch {
      return NextResponse.json({ success: false, message: "Gemini returned an invalid response. Please try again." }, { status: 502 });
    }

    const parsedResponse = ResponseSchema.safeParse(geminiJson);
    if (!parsedResponse.success) {
      console.error("Gemini image-prompt response failed validation", parsedResponse.error.issues);
      return NextResponse.json({ success: false, message: "Gemini returned incomplete image suggestions. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ success: true, data: parsedResponse.data });
  } catch (error) {
    console.error("AI image prompt route failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, message: "Unable to analyze lesson content right now." }, { status: 500 });
  }
}
