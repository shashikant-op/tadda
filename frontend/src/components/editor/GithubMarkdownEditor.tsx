import React, { useState, useRef } from "react";
import { MarkdownRenderer } from "@/components/tutorial/MarkdownRenderer";
import { uploadService } from "@/services/upload.service";
import TurndownService from "turndown";
// @ts-expect-error no types available
import * as gfm from "turndown-plugin-gfm";
import DOMPurify from "dompurify";
import {
  Bold,
  Italic,
  Heading1,
  Link as LinkIcon,
  Image as ImageIcon,
  List,
  Code,
  Eye,
  Edit3,
  Loader2,
} from "lucide-react";

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});
turndownService.use(gfm.gfm);

interface GithubMarkdownEditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function GithubMarkdownEditor({ initialContent = "", onChange, placeholder }: GithubMarkdownEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const updateContent = (newText: string) => {
    setContent(newText);
    onChange(newText);
  };

  const insertAtCursor = (textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      updateContent(content + "\n" + textToInsert);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + textToInsert + content.substring(end);
    updateContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 0);
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please drop/select a valid image file.");
      return;
    }
    try {
      setUploading(true);
      setError(null);
      const res = await uploadService.uploadImage(file);
      const url = res.url;
      insertAtCursor(`![${file.name}](${url})`);
    } catch {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Url = e.target?.result as string;
        if (base64Url) {
          insertAtCursor(`![${file.name}](${base64Url})`);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    // 1. Check for image file paste
    if (e.clipboardData.files && e.clipboardData.files[0]) {
      const file = e.clipboardData.files[0];
      if (file.type.startsWith("image/")) {
        e.preventDefault();
        handleFileUpload(file);
        return;
      }
    }

    // 2. Check for HTML paste (Google Docs, Word, Notion, ChatGPT, etc.)
    const htmlData = e.clipboardData.getData("text/html");
    if (htmlData) {
      e.preventDefault();
      try {
        const sanitized = DOMPurify.sanitize(htmlData);
        const markdown = turndownService.turndown(sanitized);
        insertAtCursor(markdown);
      } catch (err) {
        console.error("Failed to parse pasted rich text", err);
        const textData = e.clipboardData.getData("text/plain");
        if (textData) {
          insertAtCursor(textData);
        }
      }
    }
  };

  const handleBold = () => insertAtCursor("**bold text**");
  const handleItalic = () => insertAtCursor("*italic text*");
  const handleHeading = () => insertAtCursor("### Heading Title");
  const handleLink = () => {
    const url = prompt("Enter URL (e.g., https://example.com):");
    if (!url) return;
    const text = prompt("Enter link text:", "click here") || url;
    insertAtCursor(`[${text}](${url})`);
  };
  const handleList = () => insertAtCursor("- List item");
  const handleCode = () => insertAtCursor("```typescript\nconsole.log('Hello GitHub Editor');\n```");

  return (
    <div className="border rounded-xl bg-card shadow-xs overflow-hidden flex flex-col">
      {/* GitHub Style Tabs & Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-2.5 border-b bg-muted/40 gap-2">
        <div className="flex items-center space-x-1 bg-background border rounded-lg p-1">
          <button
            type="button"
            onClick={() => setTab("write")}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1 ${
              tab === "write" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1 ${
              tab === "preview" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Preview</span>
          </button>
        </div>

        {tab === "write" && (
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <button
              type="button"
              onClick={handleBold}
              className="p-1.5 rounded hover:bg-muted text-foreground px-2"
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleItalic}
              className="p-1.5 rounded hover:bg-muted text-foreground px-2"
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleHeading}
              className="p-1.5 rounded hover:bg-muted text-foreground px-2 font-bold"
              title="Heading"
            >
              <Heading1 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleLink}
              className="p-1.5 rounded hover:bg-muted text-foreground px-2"
              title="Insert Link"
            >
              <LinkIcon className="h-4 w-4 text-primary" />
            </button>
            <label className="p-1.5 rounded hover:bg-muted text-foreground px-2 cursor-pointer flex items-center space-x-1" title="Upload Image">
              <ImageIcon className="h-4 w-4 text-emerald-600" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
            </label>
            <button
              type="button"
              onClick={handleList}
              className="p-1.5 rounded hover:bg-muted text-foreground px-2"
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleCode}
              className="p-1.5 rounded hover:bg-muted text-foreground px-2"
              title="Code Block"
            >
              <Code className="h-4 w-4 text-primary" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border-b border-destructive/20 text-destructive text-xs">
          {error}
        </div>
      )}

      {uploading && (
        <div className="p-2 bg-primary/10 border-b border-primary/20 text-primary text-xs flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Uploading image to Cloudinary & inserting markdown...</span>
        </div>
      )}

      {tab === "write" ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="relative flex flex-col"
        >
          <textarea
            ref={textareaRef}
            rows={12}
            value={content}
            onChange={(e) => updateContent(e.target.value)}
            onPaste={handlePaste}
            placeholder={placeholder || "Type markdown here... Paste rich text from Google Docs, Word, Notion, ChatGPT, etc. — auto-converted to Markdown!"}
            className="w-full bg-background p-4 text-sm font-mono leading-relaxed resize-y focus:outline-none"
          />
          <div className="px-4 py-2 bg-muted/20 border-t flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Rich text paste supported (Auto HTML → GFM Markdown) • Drag & drop images to Cloudinary</span>
            <span>{content.length} characters</span>
          </div>
        </div>
      ) : (
        <div className="p-6 min-h-[320px] bg-card">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 pb-2 border-b">
            Live Preview
          </div>
          <MarkdownRenderer content={content} />
        </div>
      )}
    </div>
  );
}
