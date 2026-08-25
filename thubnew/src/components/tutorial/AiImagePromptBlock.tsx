"use client";

import { useState } from "react";
import { Check, Copy, ImagePlus } from "lucide-react";
import type { AiImagePromptSuggestion } from "@/lib/ai-image-prompts";

export function AiImagePromptBlock({ suggestion, raw }: { suggestion: AiImagePromptSuggestion; raw: string }) {
  const [copied, setCopied] = useState(false);

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(suggestion.imagePrompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section
      data-code-language="ai-image-prompt"
      className="my-6 overflow-hidden rounded-xl border border-emerald-500/35 bg-emerald-500/10 text-foreground shadow-sm"
    >
      <pre className="hidden" aria-hidden="true"><code>{raw}</code></pre>
      <div data-preview-control className="space-y-3 p-5" contentEditable={false}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-emerald-600 p-2 text-white"><ImagePlus className="h-5 w-5" /></div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-200">AI Image Prompt</h4>
            </div>
          </div>
          <button
            type="button"
            onClick={copyPrompt}
            className="inline-flex items-center gap-1.5 rounded-md border border-emerald-600/30 bg-background px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy prompt"}
          </button>
        </div>
        <div className="rounded-lg border border-emerald-700/25 bg-emerald-50 p-4 text-sm font-medium leading-relaxed whitespace-pre-wrap text-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-50">
          {suggestion.imagePrompt}
        </div>
      </div>
    </section>
  );
}
