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
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  List,
  Code,
  Eye,
  Edit3,
  Loader2,
  Underline,
  Strikethrough,
  ListOrdered,
  Quote,
  RemoveFormatting,
  Minus,
  Pilcrow,
} from "lucide-react";

const PREVIEW_TOOLS = [
  { label: "Paragraph", icon: Pilcrow, command: "formatBlock", value: "<p>" },
  { label: "Heading 1", icon: Heading1, command: "formatBlock", value: "<h1>" },
  { label: "Heading 2", icon: Heading2, command: "formatBlock", value: "<h2>" },
  { label: "Heading 3", icon: Heading3, command: "formatBlock", value: "<h3>" },
  { label: "Bold", icon: Bold, command: "bold" },
  { label: "Italic", icon: Italic, command: "italic" },
  { label: "Underline", icon: Underline, command: "underline" },
  { label: "Strikethrough", icon: Strikethrough, command: "strikeThrough" },
  { label: "Bullet list", icon: List, command: "insertUnorderedList" },
  { label: "Numbered list", icon: ListOrdered, command: "insertOrderedList" },
  { label: "Quote", icon: Quote, command: "formatBlock", value: "<blockquote>" },
  { label: "Link", icon: LinkIcon, command: "createLink" },
  { label: "Horizontal rule", icon: Minus, command: "insertHorizontalRule" },
  { label: "Clear formatting", icon: RemoveFormatting, command: "removeFormat" },
] as const;

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});
turndownService.use(gfm.gfm);
turndownService.addRule("underline", {
  filter: ["u"],
  replacement: (content) => `<u>${content}</u>`,
});
turndownService.addRule("previewFencedCode", {
  filter: (node) => node instanceof HTMLElement && node.hasAttribute("data-code-language"),
  replacement: (_content, node) => {
    const element = node as HTMLElement;
    const language = element.dataset.codeLanguage || "text";
    const code = element.querySelector("pre code")?.textContent || "";
    return `\n\n\`\`\`${language}\n${code.replace(/\n$/, "")}\n\`\`\`\n\n`;
  },
});

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
  const editablePreviewRef = useRef<HTMLDivElement>(null);
  const previewDirtyRef = useRef(false);
  const previewSelectionRef = useRef<Range | null>(null);

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

    // 2. Check for HTML paste (Google Docs, Word, Notion, ChatGPT, Docs, etc.)
    const htmlData = e.clipboardData.getData("text/html");
    if (htmlData) {
      e.preventDefault();
      try {
        const sanitized = DOMPurify.sanitize(htmlData);
        let markdown = turndownService.turndown(sanitized);
        markdown = markdown
          .replace(/\u00A0/g, " ")
          .replace(/\r\n/g, "\n")
          .replace(/\n{3,}/g, "\n\n")
          .trim();
        insertAtCursor(markdown);
      } catch (err) {
        console.error("Failed to parse pasted rich text", err);
        const textData = e.clipboardData.getData("text/plain");
        if (textData) {
          const cleanedText = textData
            .replace(/\u00A0/g, " ")
            .replace(/\r\n/g, "\n")
            .replace(/\n{3,}/g, "\n\n")
            .trim();
          insertAtCursor(cleanedText);
        }
      }
      return;
    }

    // 3. Fallback for plain text paste
    const textData = e.clipboardData.getData("text/plain");
    if (textData) {
      e.preventDefault();
      const cleanedText = textData
        .replace(/\u00A0/g, " ")
        .replace(/\r\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      insertAtCursor(cleanedText);
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

  const handlePreviewBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!previewDirtyRef.current) return;
    previewDirtyRef.current = false;
    const editable = event.currentTarget;
    const clone = editable.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("[data-preview-control]").forEach((control) => control.remove());
    const sanitizedHtml = DOMPurify.sanitize(clone.innerHTML);

    const markdown = turndownService.turndown(sanitizedHtml)
      .replace(/\u00A0/g, " ")
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    updateContent(markdown);
  };

  const capturePreviewSelection = () => {
    const preview = editablePreviewRef.current;
    const selection = window.getSelection();
    if (!preview || !selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (preview.contains(range.commonAncestorContainer)) {
      previewSelectionRef.current = range.cloneRange();
    }
  };

  const restorePreviewSelection = () => {
    const preview = editablePreviewRef.current;
    const range = previewSelectionRef.current;
    if (!preview || !range || !preview.contains(range.commonAncestorContainer)) return false;

    preview.focus();
    const selection = window.getSelection();
    if (!selection) return false;
    selection.removeAllRanges();
    selection.addRange(range);
    return true;
  };

  const applyPreviewCommand = (command: string, value?: string) => {
    if (!restorePreviewSelection()) {
      setError("Select content in the preview before applying formatting.");
      return;
    }

    document.execCommand(command, false, value);
    if (command === "removeFormat") {
      document.execCommand("formatBlock", false, "<p>");
    }
    previewDirtyRef.current = true;
    setError(null);
    capturePreviewSelection();
  };

  const addPreviewLink = () => {
    const range = previewSelectionRef.current;
    if (!range || range.collapsed) {
      setError("Select some preview text before adding a link.");
      return;
    }
    const url = prompt("Enter the destination URL:", "https://");
    if (!url) return;
    applyPreviewCommand("createLink", url);
  };

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
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b pb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span>Live Preview</span>
            <span className="font-medium normal-case tracking-normal text-primary">Click the content to edit · changes sync automatically</span>
          </div>
          <div
            data-preview-control
            className="sticky top-16 z-10 mb-3 flex flex-wrap items-center gap-1 rounded-lg border bg-background/95 p-2 shadow-sm backdrop-blur"
            aria-label="Preview formatting toolbar"
          >
            {PREVIEW_TOOLS.map(({ label, icon: Icon, command, ...tool }) => (
              <button
                key={label}
                type="button"
                title={label}
                aria-label={label}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  if (command === "createLink") {
                    addPreviewLink();
                    return;
                  }
                  applyPreviewCommand(command, "value" in tool ? tool.value : undefined);
                }}
                className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
          <div
            ref={editablePreviewRef}
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-label="Editable lesson preview"
            aria-multiline="true"
            spellCheck
            onInput={() => {
              previewDirtyRef.current = true;
              capturePreviewSelection();
            }}
            onMouseUp={capturePreviewSelection}
            onKeyUp={capturePreviewSelection}
            onFocus={capturePreviewSelection}
            onBlur={handlePreviewBlur}
            className="min-h-[240px] rounded-lg border border-transparent p-2 outline-none transition-colors hover:border-border focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/15"
          >
            <MarkdownRenderer content={content} />
          </div>
        </div>
      )}
    </div>
  );
}
