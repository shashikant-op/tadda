import React, { useEffect, useState } from "react";
import { type Editor } from "@tiptap/react";
import { Bold, Italic, Link as LinkIcon, Highlighter, Code, Heading1 } from "lucide-react";

interface BubbleMenuProps {
  editor: Editor | null;
  onOpenLinkDialog: () => void;
}

export function BubbleMenu({ editor, onOpenLinkDialog }: BubbleMenuProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      const { from, to } = editor.state.selection;
      if (from === to || editor.isActive("image")) {
        setIsVisible(false);
        return;
      }
      setIsVisible(true);
    };

    editor.on("selectionUpdate", handleSelectionUpdate);
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor]);

  if (!editor || !isVisible) return null;

  return (
    <div className="absolute z-50 flex items-center space-x-1 bg-background border shadow-2xl rounded-lg p-1 text-xs">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1.5 rounded ${editor.isActive("bold") ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
        title="Bold"
      >
        <Bold className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded ${editor.isActive("italic") ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
        title="Italic"
      >
        <Italic className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1.5 rounded ${editor.isActive("heading", { level: 1 }) ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
        title="Heading 1"
      >
        <Heading1 className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`p-1.5 rounded ${editor.isActive("highlight") ? "bg-amber-400 text-[var(--ink)]" : "hover:bg-muted"}`}
        title="Highlight"
      >
        <Highlighter className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-1.5 rounded ${editor.isActive("code") ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
        title="Code"
      >
        <Code className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={onOpenLinkDialog}
        className={`p-1.5 rounded ${editor.isActive("link") ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
        title="Link"
      >
        <LinkIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
