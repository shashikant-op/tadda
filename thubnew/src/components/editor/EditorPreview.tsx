import React from "react";
import { sanitizeHtml } from "./lib/editor";
import { Eye, ShieldCheck } from "lucide-react";

interface EditorPreviewProps {
  contentHtml: string;
}

export function EditorPreview({ contentHtml }: EditorPreviewProps) {
  const sanitized = sanitizeHtml(contentHtml);

  return (
    <div className="border rounded-xl bg-card p-8 min-h-[400px] shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b pb-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
        <span className="flex items-center space-x-2">
          <Eye className="h-4 w-4 text-primary" />
          <span>Live Production Preview</span>
        </span>
        <span className="flex items-center space-x-1 text-emerald-600">
          <ShieldCheck className="h-4 w-4" />
          <span>DOMPurify Sanitized</span>
        </span>
      </div>
      <div
        className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed"
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    </div>
  );
}
