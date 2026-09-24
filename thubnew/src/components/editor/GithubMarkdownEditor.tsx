import React, { useState, useRef, useEffect, useCallback } from "react";
import { MarkdownRenderer } from "@/components/tutorial/MarkdownRenderer";
import { uploadService, uploadStatusLabel, type UploadStatus } from "@/services/upload.service";
import { richTextHtmlToMarkdown } from "@/lib/rich-text-paste";
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

interface GithubMarkdownEditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

export function GithubMarkdownEditor({ initialContent = "", onChange, placeholder }: GithubMarkdownEditorProps) {
  const content = initialContent;
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ stage: "preparing", percent: 0 });
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editablePreviewRef = useRef<HTMLDivElement>(null);
  const previewWrapperRef = useRef<HTMLDivElement>(null);
  const previewDirtyRef = useRef(false);
  const previewSelectionRef = useRef<Range | null>(null);

  // Canva-style image resize state
  const [selectedImg, setSelectedImg] = useState<HTMLImageElement | null>(null);
  const [overlayStyle, setOverlayStyle] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const resizingRef = useRef<{ handle: ResizeHandle; startX: number; startY: number; startW: number; startH: number } | null>(null);
  const isResizingRef = useRef(false);

  const updateContent = (newText: string) => {
    onChange(newText);
  };

  const syncContentFromPreview = useCallback(() => {
    const el = editablePreviewRef.current;
    if (!el) return;
    const clone = el.cloneNode(true) as HTMLElement;
    // richTextHtmlToMarkdown will convert resized <img style width/height> to persisted HTML img tag
    const markdown = richTextHtmlToMarkdown(clone.innerHTML);
    updateContent(markdown);
  }, [updateContent]);

  const updateOverlayPosition = useCallback(() => {
    if (!selectedImg || !previewWrapperRef.current) return;
    const container = previewWrapperRef.current;
    const containerRect = container.getBoundingClientRect();
    const imgRect = selectedImg.getBoundingClientRect();
    setOverlayStyle({
      left: imgRect.left - containerRect.left + container.scrollLeft,
      top: imgRect.top - containerRect.top + container.scrollTop,
      width: imgRect.width,
      height: imgRect.height,
    });
  }, [selectedImg]);

  // Keep overlay in sync on scroll/resize
  useEffect(() => {
    if (!selectedImg) {
      setOverlayStyle(null);
      return;
    }
    updateOverlayPosition();
    const onScrollOrResize = () => updateOverlayPosition();
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);
    return () => {
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [selectedImg, updateOverlayPosition, content]);

  // Clear selection when switching tabs or content changes externally
  useEffect(() => {
    if (tab !== "preview") {
      setSelectedImg(null);
      setOverlayStyle(null);
    }
  }, [tab]);

  // Click handling for image selection in preview
  useEffect(() => {
    if (tab !== "preview") return;
    const el = editablePreviewRef.current;
    if (!el) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        e.preventDefault();
        e.stopPropagation();
        const img = target as HTMLImageElement;
        // Make sure image is not inside a control
        setSelectedImg(img);
        // prevent contentEditable cursor jump
        const sel = window.getSelection();
        sel?.removeAllRanges();
        setTimeout(() => updateOverlayPosition(), 0);
      } else {
        // click outside image but inside preview - check if click is on overlay handle
        const overlay = document.querySelector("[data-canva-overlay]");
        if (overlay && overlay.contains(target)) return;
        setSelectedImg(null);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const wrapper = previewWrapperRef.current;
      if (!wrapper) return;
      const target = e.target as Node;
      if (!wrapper.contains(target) && !(target as HTMLElement).closest?.("[data-canva-overlay]")) {
        setSelectedImg(null);
      }
    };

    el.addEventListener("click", handleClick);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      el.removeEventListener("click", handleClick);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tab, updateOverlayPosition]);

  const handleResizeStart = (e: React.MouseEvent, handle: ResizeHandle) => {
    if (!selectedImg) return;
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = true;
    const rect = selectedImg.getBoundingClientRect();
    resizingRef.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startW: rect.width,
      startH: rect.height,
    };

    const onMove = (ev: MouseEvent) => {
      if (!resizingRef.current || !selectedImg) return;
      const { handle: h, startX, startY, startW, startH } = resizingRef.current;
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      let newW = startW;
      let newH = startH;

      if (h.includes("e")) newW = startW + dx;
      if (h.includes("w")) newW = startW - dx;
      if (h.includes("s")) newH = startH + dy;
      if (h.includes("n")) newH = startH - dy;

      newW = Math.max(40, Math.round(newW));
      newH = Math.max(40, Math.round(newH));

      // Apply directly to DOM for live Canva-like feedback
      selectedImg.style.width = `${newW}px`;
      selectedImg.style.height = `${newH}px`;
      selectedImg.style.maxWidth = "none";
      selectedImg.setAttribute("width", String(newW));
      selectedImg.setAttribute("height", String(newH));
      selectedImg.style.objectFit = "contain";

      // Update overlay
      if (previewWrapperRef.current) {
        const containerRect = previewWrapperRef.current.getBoundingClientRect();
        const imgRect = selectedImg.getBoundingClientRect();
        setOverlayStyle({
          left: imgRect.left - containerRect.left + previewWrapperRef.current.scrollLeft,
          top: imgRect.top - containerRect.top + previewWrapperRef.current.scrollTop,
          width: imgRect.width,
          height: imgRect.height,
        });
      }
      previewDirtyRef.current = true;
    };

    const onUp = () => {
      isResizingRef.current = false;
      resizingRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      // Persist to markdown/DB so student sees exact size
      syncContentFromPreview();
      setTimeout(() => updateOverlayPosition(), 0);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
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

  const insertAtRange = (textToInsert: string, start: number, end = start) => {
    const newContent = content.substring(0, start) + textToInsert + content.substring(end);
    updateContent(newContent);
    setTimeout(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const nextPosition = start + textToInsert.length;
      textarea.focus();
      textarea.setSelectionRange(nextPosition, nextPosition);
    }, 0);
  };

  const handleFileUpload = async (file: File) => {
    if (uploading) return;
    if (!file.type.startsWith("image/")) {
      setError("Please drop/select a valid image file.");
      return;
    }
    const insertionStart = textareaRef.current?.selectionStart ?? content.length;
    const insertionEnd = textareaRef.current?.selectionEnd ?? insertionStart;
    try {
      setUploading(true);
      setError(null);
      const res = await uploadService.uploadImage(file, setUploadStatus);
      const url = res.url;
      const altText = file.name.replace(/\.[^.]+$/, "").replace(/[\[\]]/g, "").trim() || "lesson image";
      const beforeCursor = content.slice(0, insertionStart);
      const afterCursor = content.slice(insertionEnd);
      const leadingNewline = beforeCursor.length > 0 && !beforeCursor.endsWith("\n") ? "\n" : "";
      const trailingNewline = afterCursor.length > 0 && !afterCursor.startsWith("\n") ? "\n" : "";
      insertAtRange(`${leadingNewline}![${altText}](${url})${trailingNewline}`, insertionStart, insertionEnd);
    } catch (err: unknown) {
      const uploadError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(uploadError.response?.data?.message || uploadError.message || "Image upload failed. No image was inserted.");
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
        const markdown = richTextHtmlToMarkdown(htmlData);
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
    if (isResizingRef.current) return;
    // don't sync if click was on overlay
    const related = event.relatedTarget as HTMLElement | null;
    if (related?.closest?.("[data-canva-overlay]")) return;
    if (!previewDirtyRef.current) return;
    previewDirtyRef.current = false;
    const editable = event.currentTarget;
    const clone = editable.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("[data-preview-control]").forEach((control) => control.remove());
    const markdown = richTextHtmlToMarkdown(clone.innerHTML);
    updateContent(markdown);
  };

  const capturePreviewSelection = () => {
    if (isResizingRef.current) return;
    const preview = editablePreviewRef.current;
    const selection = window.getSelection();
    if (!preview || !selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    // Avoid capturing when image is selected
    const anchor = range.commonAncestorContainer as HTMLElement;
    if (anchor instanceof Element && anchor.tagName === "IMG") return;
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
                  const input = e.currentTarget;
                  const file = input.files?.[0];
                  if (file) {
                    void handleFileUpload(file);
                  }
                  input.value = "";
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
          <span>{uploadStatusLabel(uploadStatus)}</span>
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
            disabled={uploading}
            onChange={(e) => updateContent(e.target.value)}
            onPaste={handlePaste}
            placeholder={placeholder || "Type markdown here... Paste rich text from Google Docs, Word, Notion, ChatGPT, etc. — auto-converted to Markdown!"}
            className="w-full bg-background p-4 text-sm font-mono leading-relaxed resize-y focus:outline-none disabled:cursor-wait disabled:opacity-70"
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
            <span className="font-medium normal-case tracking-normal text-primary">Click image to select · drag handles to resize · changes saved to DB</span>
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
          <div ref={previewWrapperRef} className="relative">
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
                if (selectedImg) setTimeout(() => updateOverlayPosition(), 0);
              }}
              onMouseUp={capturePreviewSelection}
              onKeyUp={capturePreviewSelection}
              onFocus={capturePreviewSelection}
              onBlur={handlePreviewBlur}
              className="min-h-[240px] rounded-lg border border-transparent p-2 outline-none transition-colors hover:border-border focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/15 [&_img]:cursor-pointer [&_img]:max-w-full [&_img]:select-none"
            >
              <MarkdownRenderer content={content} />
            </div>

            {/* Canva-style overlay */}
            {selectedImg && overlayStyle && (
              <div
                data-canva-overlay
                className="absolute pointer-events-none border-2 border-primary rounded-sm"
                style={{
                  left: overlayStyle.left,
                  top: overlayStyle.top,
                  width: overlayStyle.width,
                  height: overlayStyle.height,
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.8)",
                }}
              >
                {/* Size label */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-mono font-bold px-2 py-0.5 rounded whitespace-nowrap pointer-events-none">
                  {Math.round(overlayStyle.width)} × {Math.round(overlayStyle.height)}
                </div>

                {/* Corner handles */}
                {(["nw", "ne", "sw", "se"] as ResizeHandle[]).map((h) => (
                  <div
                    key={h}
                    onMouseDown={(e) => handleResizeStart(e, h)}
                    className="absolute w-3 h-3 bg-white border-2 border-primary rounded-sm shadow-md pointer-events-auto"
                    style={{
                      cursor: h === "nw" || h === "se" ? "nwse-resize" : "nesw-resize",
                      top: h.includes("n") ? -6 : "auto",
                      bottom: h.includes("s") ? -6 : "auto",
                      left: h.includes("w") ? -6 : "auto",
                      right: h.includes("e") ? -6 : "auto",
                    }}
                  />
                ))}

                {/* Edge handles */}
                {(["n", "s", "e", "w"] as ResizeHandle[]).map((h) => (
                  <div
                    key={h}
                    onMouseDown={(e) => handleResizeStart(e, h)}
                    className="absolute bg-white border border-primary shadow-md pointer-events-auto"
                    style={{
                      cursor: h === "n" || h === "s" ? "ns-resize" : "ew-resize",
                      width: h === "n" || h === "s" ? 20 : 8,
                      height: h === "n" || h === "s" ? 8 : 20,
                      borderRadius: 999,
                      top: h === "n" ? -4 : h === "s" ? "auto" : "50%",
                      bottom: h === "s" ? -4 : "auto",
                      left: h === "w" ? -4 : h === "e" ? "auto" : "50%",
                      right: h === "e" ? -4 : "auto",
                      transform: h === "n" || h === "s" ? "translateX(-50%)" : h === "w" || h === "e" ? "translateY(-50%)" : undefined,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">Tip: Click any image in preview, then drag the white handles (Canva-style) to resize. Size is saved automatically — students see the exact dimensions.</p>
        </div>
      )}
    </div>
  );
}
