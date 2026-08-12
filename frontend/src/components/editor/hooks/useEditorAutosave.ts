import { useEffect, useRef, useState } from "react";
import { axiosInstance } from "@/lib/axios";

interface UseEditorAutosaveProps {
  tutorialId?: string;
  contentJson: unknown;
  enabled?: boolean;
}

export type SaveStatus = "idle" | "saving" | "saved" | "failed";

export function useEditorAutosave({ tutorialId, contentJson, enabled = true }: UseEditorAutosaveProps) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!enabled || !tutorialId) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    queueMicrotask(() => setStatus("saving"));

    timeoutRef.current = setTimeout(async () => {
      try {
        await axiosInstance.put(`/tutorials/${tutorialId}`, {
          contentJson,
        });
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 3000);
      } catch (err) {
        console.error("Autosave failed", err);
        setStatus("failed");
      }
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [contentJson, tutorialId, enabled]);

  return { status };
}
