import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { getEditorExtensions } from "./lib/editor";
import { EditorToolbar } from "./EditorToolbar";
import { BubbleMenu } from "./BubbleMenu";
import { EditorSlashMenu } from "./EditorSlashMenu";
import { EditorCharacterCounter } from "./EditorCharacterCounter";
import { EditorLinkDialog } from "./EditorLinkDialog";
import { EditorImageUpload } from "./EditorImageUpload";
import { EditorPreview } from "./EditorPreview";
import { useEditorAutosave } from "./hooks/useEditorAutosave";
import { Edit3, Eye, Cloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface EditorProps {
  initialContent?: string;
  onChange?: (html: string, json: unknown) => void;
  tutorialId?: string;
  placeholder?: string;
}

export function Editor({ initialContent = "", onChange, tutorialId, placeholder }: EditorProps) {
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [jsonContent, setJsonContent] = useState<unknown>(null);
  const [htmlContent, setHtmlContent] = useState(initialContent);

  const editor = useEditor({
    extensions: getEditorExtensions(placeholder),
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const json = editor.getJSON();
      setHtmlContent(html);
      setJsonContent(json);
      if (onChange) {
        onChange(html, json);
      }
    },
  });

  const { status: autosaveStatus } = useEditorAutosave({
    tutorialId,
    contentJson: jsonContent,
    enabled: Boolean(tutorialId),
  });

  // Unsaved changes protection (Requirement 10)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleSaveLink = (url: string, text: string) => {
    if (!editor) return;
    if (editor.state.selection.empty) {
      editor.chain().focus().insertContent(`<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`).run();
    } else {
      editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
    }
  };

  const handleInsertImage = (url: string) => {
    if (!editor) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="border rounded-xl bg-card shadow-xs overflow-hidden flex flex-col">
      {/* Top Bar with Mode Switch & Autosave Indicator */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20">
        <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setMode("write")}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1.5 ${
              mode === "write" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1.5 ${
              mode === "preview" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Live Preview</span>
          </button>
        </div>

        {/* Autosave Badge */}
        {tutorialId && (
          <div className="flex items-center space-x-1.5 text-xs">
            {autosaveStatus === "saving" && (
              <span className="flex items-center space-x-1 text-amber-600">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Saving draft...</span>
              </span>
            )}
            {autosaveStatus === "saved" && (
              <span className="flex items-center space-x-1 text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Saved</span>
              </span>
            )}
            {autosaveStatus === "failed" && (
              <span className="flex items-center space-x-1 text-destructive">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Save failed</span>
              </span>
            )}
            {autosaveStatus === "idle" && (
              <span className="flex items-center space-x-1 text-muted-foreground">
                <Cloud className="h-3.5 w-3.5" />
                <span>Synced</span>
              </span>
            )}
          </div>
        )}
      </div>

      {mode === "write" ? (
        <div className="relative flex flex-col flex-1">
          <EditorToolbar
            editor={editor}
            onOpenLinkDialog={() => setIsLinkDialogOpen(true)}
            onOpenImageUpload={() => setIsImageUploadOpen(true)}
          />
          <BubbleMenu editor={editor} onOpenLinkDialog={() => setIsLinkDialogOpen(true)} />
          <EditorSlashMenu editor={editor} onOpenImageUpload={() => setIsImageUploadOpen(true)} />

          <div className="flex-1 p-6 min-h-[360px] cursor-text">
            <EditorContent editor={editor} className="prose prose-neutral dark:prose-invert max-w-none focus:outline-none min-h-[320px]" />
          </div>

          <EditorCharacterCounter editor={editor} />
        </div>
      ) : (
        <div className="p-6">
          <EditorPreview contentHtml={htmlContent} />
        </div>
      )}

      <EditorLinkDialog
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        onSave={handleSaveLink}
      />

      <EditorImageUpload
        isOpen={isImageUploadOpen}
        onClose={() => setIsImageUploadOpen(false)}
        onInsertImage={handleInsertImage}
      />
    </div>
  );
}
