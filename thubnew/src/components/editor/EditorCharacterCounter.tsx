import React from "react";
import { type Editor } from "@tiptap/react";
import { calculateReadingTime } from "./lib/editor";
import { FileText, Clock, Type, AlignLeft } from "lucide-react";

interface EditorCharacterCounterProps {
  editor: Editor | null;
}

export function EditorCharacterCounter({ editor }: EditorCharacterCounterProps) {
  if (!editor) return null;

  const words = editor.storage.characterCount.words();
  const characters = editor.storage.characterCount.characters();
  const text = editor.getText();
  const readingTime = calculateReadingTime(text);
  const paragraphs = text.split(/\n+/).filter(Boolean).length || 1;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-2.5 bg-muted/30 border-t text-xs text-muted-foreground">
      <div className="flex items-center space-x-6">
        <span className="flex items-center space-x-1.5">
          <Type className="h-3.5 w-3.5 text-primary" />
          <span><strong>{words}</strong> words</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <FileText className="h-3.5 w-3.5 text-primary" />
          <span><strong>{characters}</strong> characters</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <AlignLeft className="h-3.5 w-3.5 text-primary" />
          <span><strong>{paragraphs}</strong> paragraphs</span>
        </span>
      </div>
      <div className="flex items-center space-x-1.5">
        <Clock className="h-3.5 w-3.5 text-emerald-600" />
        <span>Est. reading time: <strong>{readingTime} min</strong></span>
      </div>
    </div>
  );
}
